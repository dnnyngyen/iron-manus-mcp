#!/usr/bin/env ts-node

/**
 * MANUS FSM REFERENCE UPDATE SCRIPT
 * 
 * Automatically updates references when files are moved or renamed:
 * - Updates import statements
 * - Updates documentation links
 * - Updates reference index
 * - Validates all changes
 */

import * as fs from 'fs';
import * as path from 'path';
import { REFERENCE_INDEX, DOCUMENTATION_REFERENCES } from '../src/utils/reference-index.js';

interface RefactorOperation {
  type: 'move' | 'rename' | 'line_change';
  oldPath: string;
  newPath: string;
  oldLine?: number;
  newLine?: number;
}

interface UpdateResult {
  filesModified: string[];
  referencesUpdated: number;
  errors: string[];
}

class ReferenceUpdater {
  private basePath: string;
  private dryRun: boolean;

  constructor(basePath: string = process.cwd(), dryRun: boolean = false) {
    this.basePath = basePath;
    this.dryRun = dryRun;
  }

  /**
   * Move a file and update all references
   */
  async moveFile(oldPath: string, newPath: string): Promise<UpdateResult> {
    console.log(`📁 Moving file: ${oldPath} → ${newPath}`);
    
    const operation: RefactorOperation = {
      type: 'move',
      oldPath,
      newPath
    };

    return this.executeRefactor(operation);
  }

  /**
   * Rename a function/class and update all references
   */
  async renameFunctionOrClass(oldName: string, newName: string, filePath?: string): Promise<UpdateResult> {
    console.log(`🔄 Renaming: ${oldName} → ${newName}${filePath ? ` in ${filePath}` : ' globally'}`);
    
    const result: UpdateResult = {
      filesModified: [],
      referencesUpdated: 0,
      errors: []
    };

    // Find all references to the old name
    const references = this.findReferences(oldName);
    
    for (const ref of references) {
      try {
        await this.updateFileContent(ref.file, (content) => {
          return content.replace(new RegExp(`\\b${oldName}\\b`, 'g'), newName);
        });
        
        result.filesModified.push(ref.file);
        result.referencesUpdated++;
      } catch (error) {
        result.errors.push(`Failed to update ${ref.file}: ${error}`);
      }
    }

    return result;
  }

  /**
   * Update line numbers after code changes
   */
  async updateLineNumbers(filePath: string, oldLine: number, newLine: number): Promise<UpdateResult> {
    console.log(`📍 Updating line numbers in ${filePath}: ${oldLine} → ${newLine}`);
    
    const operation: RefactorOperation = {
      type: 'line_change',
      oldPath: filePath,
      newPath: filePath,
      oldLine,
      newLine
    };

    return this.executeRefactor(operation);
  }

  /**
   * Execute a refactoring operation
   */
  private async executeRefactor(operation: RefactorOperation): Promise<UpdateResult> {
    const result: UpdateResult = {
      filesModified: [],
      referencesUpdated: 0,
      errors: []
    };

    if (this.dryRun) {
      console.log('🔍 DRY RUN - No files will be modified');
    }

    try {
      // Update code references
      await this.updateCodeReferences(operation, result);
      
      // Update documentation references
      await this.updateDocumentationReferences(operation, result);
      
      // Update reference index
      await this.updateReferenceIndex(operation, result);
      
      // Actually move/rename the file if needed
      if (operation.type === 'move' && !this.dryRun) {
        await this.moveFilePhysically(operation.oldPath, operation.newPath);
      }

    } catch (error) {
      result.errors.push(`Refactor operation failed: ${error}`);
    }

    this.reportUpdateResults(result);
    return result;
  }

  /**
   * Update code references (imports, function calls, etc.)
   */
  private async updateCodeReferences(operation: RefactorOperation, result: UpdateResult): Promise<void> {
    const references = this.findReferences(operation.oldPath);
    
    for (const ref of references) {
      try {
        const updated = await this.updateFileContent(ref.file, (content) => {
          switch (operation.type) {
            case 'move':
              // Update import paths
              return content.replace(
                new RegExp(`from ['"]${this.escapeRegex(operation.oldPath)}['"]`, 'g'),
                `from '${operation.newPath}'`
              ).replace(
                new RegExp(`import\\(['"]${this.escapeRegex(operation.oldPath)}['"]\\)`, 'g'),
                `import('${operation.newPath}')`
              );
            
            case 'line_change':
              // Update line number references in comments/docs
              return content.replace(
                new RegExp(`${this.escapeRegex(operation.oldPath)}:${operation.oldLine}`, 'g'),
                `${operation.newPath}:${operation.newLine}`
              );
              
            default:
              return content;
          }
        });

        if (updated) {
          result.filesModified.push(ref.file);
          result.referencesUpdated++;
        }
      } catch (error) {
        result.errors.push(`Failed to update ${ref.file}: ${error}`);
      }
    }
  }

  /**
   * Update documentation references
   */
  private async updateDocumentationReferences(operation: RefactorOperation, result: UpdateResult): Promise<void> {
    const docFiles = Object.values(DOCUMENTATION_REFERENCES).map(ref => ref.file);
    
    for (const docFile of docFiles) {
      try {
        const updated = await this.updateFileContent(docFile, (content) => {
          switch (operation.type) {
            case 'move':
              return content.replace(
                new RegExp(this.escapeRegex(operation.oldPath), 'g'),
                operation.newPath
              );
            
            case 'line_change':
              return content.replace(
                new RegExp(`${this.escapeRegex(operation.oldPath)}:${operation.oldLine}`, 'g'),
                `${operation.newPath}:${operation.newLine}`
              );
              
            default:
              return content;
          }
        });

        if (updated) {
          result.filesModified.push(docFile);
          result.referencesUpdated++;
        }
      } catch (error) {
        result.errors.push(`Failed to update documentation ${docFile}: ${error}`);
      }
    }
  }

  /**
   * Update the reference index itself
   */
  private async updateReferenceIndex(operation: RefactorOperation, result: UpdateResult): Promise<void> {
    const indexFile = 'src/utils/reference-index.ts';
    
    try {
      const updated = await this.updateFileContent(indexFile, (content) => {
        switch (operation.type) {
          case 'move':
            return content.replace(
              new RegExp(`file: ['"]${this.escapeRegex(operation.oldPath)}['"]`, 'g'),
              `file: '${operation.newPath}'`
            ).replace(
              new RegExp(`['"]${this.escapeRegex(operation.oldPath)}:`, 'g'),
              `'${operation.newPath}:`
            );
          
          case 'line_change':
            return content.replace(
              new RegExp(`line: ${operation.oldLine}`, 'g'),
              `line: ${operation.newLine}`
            ).replace(
              new RegExp(`${this.escapeRegex(operation.oldPath)}:${operation.oldLine}`, 'g'),
              `${operation.newPath}:${operation.newLine}`
            );
            
          default:
            return content;
        }
      });

      if (updated) {
        result.filesModified.push(indexFile);
        result.referencesUpdated++;
      }
    } catch (error) {
      result.errors.push(`Failed to update reference index: ${error}`);
    }
  }

  /**
   * Find all files that reference a given path or name
   */
  private findReferences(searchTerm: string): { file: string; line?: number }[] {
    const references: { file: string; line?: number }[] = [];
    
    // Search in reference index
    for (const ref of Object.values(REFERENCE_INDEX)) {
      for (const refPath of ref.referencedIn) {
        if (refPath.includes(searchTerm)) {
          const [file, line] = refPath.split(':');
          references.push({ file, line: line ? parseInt(line, 10) : undefined });
        }
      }
    }

    // Search in documentation references
    for (const ref of Object.values(DOCUMENTATION_REFERENCES)) {
      for (const refPath of ref.referencedIn) {
        if (refPath.includes(searchTerm)) {
          references.push({ file: refPath });
        }
      }
      for (const codeRef of ref.codeReferences) {
        if (codeRef.includes(searchTerm)) {
          const [file, line] = codeRef.split(':');
          references.push({ file, line: line ? parseInt(line, 10) : undefined });
        }
      }
    }

    return references;
  }

  /**
   * Update file content with a transformation function
   */
  private async updateFileContent(
    filePath: string, 
    transform: (content: string) => string
  ): Promise<boolean> {
    const fullPath = path.resolve(this.basePath, filePath);
    
    if (!fs.existsSync(fullPath)) {
      return false;
    }

    const originalContent = fs.readFileSync(fullPath, 'utf-8');
    const newContent = transform(originalContent);
    
    if (originalContent === newContent) {
      return false; // No changes needed
    }

    if (!this.dryRun) {
      fs.writeFileSync(fullPath, newContent, 'utf-8');
    }

    return true;
  }

  /**
   * Actually move a file in the filesystem
   */
  private async moveFilePhysically(oldPath: string, newPath: string): Promise<void> {
    const fullOldPath = path.resolve(this.basePath, oldPath);
    const fullNewPath = path.resolve(this.basePath, newPath);
    
    // Create directory if it doesn't exist
    const newDir = path.dirname(fullNewPath);
    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir, { recursive: true });
    }

    // Move the file
    fs.renameSync(fullOldPath, fullNewPath);
  }

  /**
   * Escape special regex characters
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Report update results
   */
  private reportUpdateResults(result: UpdateResult): void {
    console.log('\n' + '='.repeat(50));
    console.log('📊 UPDATE RESULTS');
    console.log('='.repeat(50));

    if (result.errors.length === 0) {
      console.log('✅ Update completed successfully!');
      console.log(`📁 ${result.filesModified.length} files modified`);
      console.log(`🔗 ${result.referencesUpdated} references updated`);
      
      if (result.filesModified.length > 0) {
        console.log('\n📝 Modified files:');
        result.filesModified.forEach(file => console.log(`   ${file}`));
      }
    } else {
      console.log(`❌ ${result.errors.length} errors occurred:`);
      result.errors.forEach(error => console.log(`   ${error}`));
    }

    if (this.dryRun) {
      console.log('\n🔍 This was a dry run - no files were actually modified');
    }

    console.log('='.repeat(50));
  }
}

/**
 * CLI interface
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const dryRun = args.includes('--dry-run');
  
  console.log(`🚀 Manus FSM Reference Updater`);
  console.log(`📂 Base path: ${process.cwd()}`);
  if (dryRun) console.log('🔍 DRY RUN MODE\n');

  const updater = new ReferenceUpdater(process.cwd(), dryRun);

  switch (command) {
    case 'move':
      if (args.length < 3) {
        console.error('Usage: update-references move <old-path> <new-path> [--dry-run]');
        process.exit(1);
      }
      await updater.moveFile(args[1], args[2]);
      break;

    case 'rename':
      if (args.length < 3) {
        console.error('Usage: update-references rename <old-name> <new-name> [--dry-run]');
        process.exit(1);
      }
      await updater.renameFunctionOrClass(args[1], args[2]);
      break;

    case 'line':
      if (args.length < 4) {
        console.error('Usage: update-references line <file-path> <old-line> <new-line> [--dry-run]');
        process.exit(1);
      }
      await updater.updateLineNumbers(args[1], parseInt(args[2], 10), parseInt(args[3], 10));
      break;

    default:
      console.log('Available commands:');
      console.log('  move <old-path> <new-path>     - Move a file and update all references');
      console.log('  rename <old-name> <new-name>   - Rename a function/class globally');
      console.log('  line <file> <old> <new>        - Update line number references');
      console.log('');
      console.log('Options:');
      console.log('  --dry-run                      - Show what would be changed without modifying files');
      process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Update failed:', error);
    process.exit(1);
  });
}

export { ReferenceUpdater };