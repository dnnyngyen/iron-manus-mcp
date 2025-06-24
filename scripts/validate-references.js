#!/usr/bin/env node

/**
 * IRON MANUS JARVIS REFERENCE VALIDATION SCRIPT (JavaScript Version)
 * 
 * Validates all code and documentation references to ensure:
 * - All referenced files exist
 * - All line numbers are valid
 * - All cross-references are accurate
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Reference data - updated for new file structure
const REFERENCE_INDEX = {
  'processState': {
    file: 'src/core/fsm.ts',
    line: 104,
    referencedIn: ['src/index.ts:74', 'docs/ARCHITECTURE.md:149'],
    description: 'Main FSM processing function',
    type: 'function'
  },
  'validateTaskCompletion': {
    file: 'src/core/fsm.ts',
    line: 467,
    referencedIn: ['src/core/fsm.ts:220', 'docs/ARCHITECTURE.md:333'],
    description: 'Mathematical validation engine',
    type: 'function'
  },
  'extractMetaPromptFromTodo': {
    file: 'src/core/fsm.ts',
    line: 398,
    referencedIn: ['src/index.ts:5', 'docs/ARCHITECTURE.md:382'],
    description: 'Meta-prompt extraction for fractal orchestration',
    type: 'function'
  },
  'ROLE_CONFIG': {
    file: 'src/core/prompts.ts',
    line: 17,
    referencedIn: ['docs/ARCHITECTURE.md:156'],
    description: 'Role-specific thinking methodologies',
    type: 'constant'
  }
};

const DOCUMENTATION_REFERENCES = {
  'ARCHITECTURE_GUIDE': {
    file: 'docs/ARCHITECTURE.md',
    referencedIn: ['README.md', 'docs/README.md'],
    description: 'Complete guide to deterministic agent control',
    codeReferences: ['src/core/fsm.ts:104', 'src/index.ts:73']
  },
  'ORCHESTRATION_LOOP': {
    file: 'docs/ORCHESTRATION.md',
    referencedIn: ['docs/README.md'],
    description: 'Chronological breakdown of 6-phase workflow',
    codeReferences: ['src/core/fsm.ts:132']
  }
};

class ReferenceValidator {
  constructor(basePath = process.cwd()) {
    this.basePath = basePath;
    this.errors = [];
    this.warnings = [];
  }

  async validate() {
    console.log('🔍 Starting Iron Manus JARVIS reference validation...\n');

    this.validateCodeReferences();
    this.validateDocumentationReferences();
    this.validateFileStructure();

    this.reportResults();

    return {
      success: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  validateCodeReferences() {
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
      }
    }
  }

  validateDocumentationReferences() {
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

  validateFileStructure() {
    console.log('🏗️ Validating file structure...');
    
    const coreFiles = [
      'src/index.ts',
      'src/core/fsm.ts',
      'src/core/prompts.ts',
      'src/core/state.ts',
      'src/core/types.ts'
    ];

    for (const file of coreFiles) {
      const fullPath = this.resolvePath(file);
      if (!this.fileExists(fullPath)) {
        this.addError('file_not_found', 'CORE_STRUCTURE', file, undefined,
          `Core file missing: ${file}`);
      }
    }
  }

  fileExists(filePath) {
    try {
      return fs.existsSync(filePath);
    } catch {
      return false;
    }
  }

  lineExists(filePath, lineNumber) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      return lineNumber <= lines.length && lineNumber > 0;
    } catch {
      return false;
    }
  }

  resolvePath(relativePath) {
    return path.resolve(this.basePath, relativePath);
  }

  parseReference(reference) {
    const parts = reference.split(':');
    const file = parts[0];
    const line = parts[1] ? parseInt(parts[1], 10) : undefined;
    return [file, line];
  }

  addError(type, reference, file, line, details) {
    this.errors.push({
      type,
      reference,
      file,
      line,
      details: details || ''
    });
  }

  reportResults() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 VALIDATION RESULTS');
    console.log('='.repeat(60));

    if (this.errors.length === 0) {
      console.log('✅ All references validated successfully!');
      console.log(`📁 ${Object.keys(REFERENCE_INDEX).length} code references checked`);
      console.log(`📚 ${Object.keys(DOCUMENTATION_REFERENCES).length} documentation references checked`);
    } else {
      console.log(`❌ ${this.errors.length} validation errors found:`);
      console.log();
      
      this.errors.forEach(error => {
        console.log(`🔸 ${error.type.toUpperCase().replace('_', ' ')}:`);
        console.log(`   ${error.reference} → ${error.file}${error.line ? `:${error.line}` : ''}`);
        if (error.details) {
          console.log(`     ${error.details}`);
        }
        console.log();
      });
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

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const basePath = args[0] || process.cwd();
  
  console.log(`🚀 Iron Manus JARVIS Reference Validator`);
  console.log(`📂 Base path: ${basePath}\n`);

  const validator = new ReferenceValidator(basePath);
  const result = await validator.validate();

  process.exit(result.success ? 0 : 1);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  });
}

export { ReferenceValidator };