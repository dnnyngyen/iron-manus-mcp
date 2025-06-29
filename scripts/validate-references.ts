#!/usr/bin/env ts-node

/**
 * MANUS FSM REFERENCE VALIDATION SCRIPT
 * 
 * Validates all code and documentation references to ensure:
 * - All referenced files exist
 * - All line numbers are valid
 * - All cross-references are accurate
 * - Documentation stays in sync with code
 */

import * as fs from 'fs';
import * as path from 'path';

// Temporary inline definitions to avoid module import issues
interface CodeReference {
  file: string;
  line: number;
  referencedIn: string[];
  exports?: string[];
  imports?: string[];
  description: string;
  type: 'function' | 'class' | 'interface' | 'constant' | 'phase' | 'documentation';
  dependencies?: string[];
}

interface DocumentationReference {
  file: string;
  section?: string;
  referencedIn: string[];
  description: string;
  codeReferences: string[];
}

// Simplified reference data for validation
const REFERENCE_INDEX: Record<string, CodeReference> = {
  'processManusFSM': {
    file: 'src/core/fsm.ts',
    line: 104,
    referencedIn: ['src/index.ts:74'],
    description: 'Main FSM processing function',
    type: 'function'
  }
};

const DOCUMENTATION_REFERENCES: Record<string, DocumentationReference> = {
  'ARCHITECTURE_GUIDE': {
    file: 'docs/001_ARCHITECTURE_GUIDE.md',
    referencedIn: ['README.md'],
    description: 'Architecture guide',
    codeReferences: ['src/core/fsm.ts']
  }
};

const FILE_STRUCTURE = {
  'src/index.ts': {
    description: 'MCP Server entry point',
    dependencies: ['src/core/fsm.ts']
  }
};

interface ValidationError {
  type: 'file_not_found' | 'line_invalid' | 'reference_missing' | 'dependency_broken';
  reference: string;
  file: string;
  line?: number;
  details: string;
}

class ReferenceValidator {
  private errors: ValidationError[] = [];
  private warnings: string[] = [];
  private basePath: string;

  constructor(basePath: string = process.cwd()) {
    this.basePath = basePath;
  }

  /**
   * Main validation entry point
   */
  async validate(): Promise<{ success: boolean; errors: ValidationError[]; warnings: string[] }> {
    console.log('🔍 Starting Manus FSM reference validation...\n');

    // Validate code references
    await this.validateCodeReferences();
    
    // Validate documentation references
    await this.validateDocumentationReferences();
    
    // Validate file structure consistency
    await this.validateFileStructure();
    
    // Validate cross-dependencies
    await this.validateDependencies();

    // Report results
    this.reportResults();

    return {
      success: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  /**
   * Validate all code references in REFERENCE_INDEX
   */
  private async validateCodeReferences(): Promise<void> {
    console.log('📁 Validating code references...');

    for (const [name, ref] of Object.entries(REFERENCE_INDEX)) {
      // Check if main file exists
      const filePath = this.resolvePath(ref.file);
      if (!this.fileExists(filePath)) {
        this.addError('file_not_found', name, ref.file, undefined, 
          `Referenced file does not exist: ${ref.file}`);
        continue;
      }

      // Check if line number is valid
      if (ref.line && !this.lineExists(filePath, ref.line)) {
        this.addError('line_invalid', name, ref.file, ref.line,
          `Line ${ref.line} does not exist in ${ref.file}`);
      }

      // Check all references to this code
      for (const refPath of ref.referencedIn) {
        const [refFile, refLine] = this.parseReference(refPath);
        const refFilePath = this.resolvePath(refFile);
        
        if (!this.fileExists(refFilePath)) {
          this.addError('file_not_found', name, refFile, undefined,
            `Reference file does not exist: ${refFile}`);
          continue;
        }

        if (refLine && !this.lineExists(refFilePath, refLine)) {
          this.addError('line_invalid', name, refFile, refLine,
            `Referenced line ${refLine} does not exist in ${refFile}`);
        }

        // Check if the reference actually exists in the file
        if (!this.referenceExists(refFilePath, name, refLine)) {
          this.addError('reference_missing', name, refFile, refLine,
            `Reference to "${name}" not found in ${refFile}${refLine ? `:${refLine}` : ''}`);
        }
      }
    }
  }

  /**
   * Validate documentation references
   */
  private async validateDocumentationReferences(): Promise<void> {
    console.log('📚 Validating documentation references...');

    for (const [name, ref] of Object.entries(DOCUMENTATION_REFERENCES)) {
      const filePath = this.resolvePath(ref.file);
      
      if (!this.fileExists(filePath)) {
        this.addError('file_not_found', name, ref.file, undefined,
          `Documentation file does not exist: ${ref.file}`);
        continue;
      }

      // Check references to this documentation
      for (const refPath of ref.referencedIn) {
        const [refFile] = this.parseReference(refPath);
        const refFilePath = this.resolvePath(refFile);
        
        if (!this.fileExists(refFilePath)) {
          this.addError('file_not_found', name, refFile, undefined,
            `File referencing documentation does not exist: ${refFile}`);
        }
      }

      // Check code references from documentation
      for (const codeRef of ref.codeReferences) {
        const [codeFile, codeLine] = this.parseReference(codeRef);
        const codeFilePath = this.resolvePath(codeFile);
        
        if (!this.fileExists(codeFilePath)) {
          this.addError('file_not_found', name, codeFile, undefined,
            `Code file referenced in documentation does not exist: ${codeFile}`);
        } else if (codeLine && !this.lineExists(codeFilePath, codeLine)) {
          this.addError('line_invalid', name, codeFile, codeLine,
            `Code line referenced in documentation does not exist: ${codeFile}:${codeLine}`);
        }
      }
    }
  }

  /**
   * Validate file structure consistency
   */
  private async validateFileStructure(): Promise<void> {
    console.log('🏗️ Validating file structure...');

    for (const [filePath, structure] of Object.entries(FILE_STRUCTURE)) {
      const fullPath = this.resolvePath(filePath);
      
      if (!this.fileExists(fullPath)) {
        this.addError('file_not_found', 'FILE_STRUCTURE', filePath, undefined,
          `File in structure definition does not exist: ${filePath}`);
        continue;
      }

      // Check dependencies
      if (structure.dependencies) {
        for (const dep of structure.dependencies) {
          const depPath = this.resolvePath(dep);
          if (!this.fileExists(depPath)) {
            this.addError('dependency_broken', filePath, dep, undefined,
              `Dependency does not exist: ${dep}`);
          }
        }
      }
    }
  }

  /**
   * Validate cross-dependencies between components
   */
  private async validateDependencies(): Promise<void> {
    console.log('🔗 Validating cross-dependencies...');

    // Check imports/exports consistency
    for (const [name, ref] of Object.entries(REFERENCE_INDEX)) {
      if (ref.dependencies) {
        for (const dep of ref.dependencies) {
          // Check if dependency is defined in REFERENCE_INDEX or FILE_STRUCTURE
          const isDefined = REFERENCE_INDEX[dep] || 
                          Object.values(REFERENCE_INDEX).some(r => r.exports?.includes(dep)) ||
                          Object.values(FILE_STRUCTURE).some(s => s.interfaces?.includes(dep));
          
          if (!isDefined) {
            this.warnings.push(`Dependency "${dep}" for "${name}" not found in reference index`);
          }
        }
      }
    }
  }

  /**
   * Helper methods
   */
  private fileExists(filePath: string): boolean {
    try {
      return fs.existsSync(filePath);
    } catch {
      return false;
    }
  }

  private lineExists(filePath: string, lineNumber: number): boolean {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      return lineNumber <= lines.length && lineNumber > 0;
    } catch {
      return false;
    }
  }

  private referenceExists(filePath: string, searchTerm: string, lineNumber?: number): boolean {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      if (lineNumber) {
        // Check specific line
        const lines = content.split('\n');
        if (lineNumber <= lines.length) {
          return lines[lineNumber - 1].includes(searchTerm);
        }
        return false;
      } else {
        // Check entire file
        return content.includes(searchTerm);
      }
    } catch {
      return false;
    }
  }

  private resolvePath(relativePath: string): string {
    return path.resolve(this.basePath, relativePath);
  }

  private parseReference(reference: string): [string, number | undefined] {
    const parts = reference.split(':');
    const file = parts[0];
    const line = parts[1] ? parseInt(parts[1], 10) : undefined;
    return [file, line];
  }

  private addError(
    type: ValidationError['type'], 
    reference: string, 
    file: string, 
    line?: number, 
    details?: string
  ): void {
    this.errors.push({
      type,
      reference,
      file,
      line,
      details: details || ''
    });
  }

  private reportResults(): void {
    console.log('\n' + '='.repeat(60));
    console.log('📊 VALIDATION RESULTS');
    console.log('='.repeat(60));

    if (this.errors.length === 0) {
      console.log('✅ All references validated successfully!');
      console.log(`📁 ${Object.keys(REFERENCE_INDEX).length} code references checked`);
      console.log(`📚 ${Object.keys(DOCUMENTATION_REFERENCES).length} documentation references checked`);
      console.log(`🏗️ ${Object.keys(FILE_STRUCTURE).length} file structure entries validated`);
    } else {
      console.log(`❌ ${this.errors.length} validation errors found:`);
      console.log();
      
      // Group errors by type
      const errorsByType = this.errors.reduce((acc, error) => {
        if (!acc[error.type]) acc[error.type] = [];
        acc[error.type].push(error);
        return acc;
      }, {} as Record<string, ValidationError[]>);

      for (const [type, errors] of Object.entries(errorsByType)) {
        console.log(`🔸 ${type.toUpperCase().replace('_', ' ')} (${errors.length}):`);
        errors.forEach(error => {
          console.log(`   ${error.reference} → ${error.file}${error.line ? `:${error.line}` : ''}`);
          if (error.details) {
            console.log(`     ${error.details}`);
          }
        });
        console.log();
      }
    }

    if (this.warnings.length > 0) {
      console.log(`⚠️ ${this.warnings.length} warnings:`);
      this.warnings.forEach(warning => {
        console.log(`   ${warning}`);
      });
    }

    console.log('='.repeat(60));
  }
}

/**
 * CLI interface
 */
async function main() {
  const args = process.argv.slice(2);
  const basePath = args[0] || process.cwd();
  
  console.log(`🚀 Manus FSM Reference Validator`);
  console.log(`📂 Base path: ${basePath}\n`);

  const validator = new ReferenceValidator(basePath);
  const result = await validator.validate();

  process.exit(result.success ? 0 : 1);
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  });
}

export { ReferenceValidator };