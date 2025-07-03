#!/usr/bin/env node

/**
 * Iron Manus DevEx Workflow Hook (Cross-Platform Node.js Version)
 * PostToolUse hook for Write|Edit|MultiEdit that automatically formats and lints code
 * Enhances development experience with automated quality assurance
 * 
 * Replaces dev-workflow.sh with cross-platform Node.js implementation
 */

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve, dirname, extname, join } from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Find project root by traversing up from script location until package.json is found
 */
function findProjectRoot() {
  let currentDir = __dirname;
  
  while (currentDir !== resolve(currentDir, '..')) {
    if (existsSync(join(currentDir, 'package.json'))) {
      return currentDir;
    }
    currentDir = resolve(currentDir, '..');
  }
  
  // Fallback to current working directory
  return process.cwd();
}

/**
 * Execute command safely with error handling
 */
function safeExec(command, options = {}) {
  try {
    const result = execSync(command, { 
      stdio: 'pipe', 
      encoding: 'utf8',
      cwd: options.cwd || process.cwd(),
      ...options 
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, error: error.message, output: error.stdout || '' };
  }
}

/**
 * Check if command exists in PATH
 */
function commandExists(command) {
  const checkCmd = process.platform === 'win32' ? `where ${command}` : `command -v ${command}`;
  return safeExec(checkCmd).success;
}

/**
 * Format JSON file using built-in JSON parser
 */
function formatJsonFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(content);
    const formatted = JSON.stringify(parsed, null, 2);
    writeFileSync(filePath, formatted + '\n', 'utf8');
    return true;
  } catch (error) {
    console.error(`⚠️  JSON formatting failed: ${error.message}`);
    return false;
  }
}

async function main() {
  try {
    // Read JSON input from stdin
    const input = readFileSync(0, 'utf8');
    let inputData;
    
    try {
      inputData = JSON.parse(input);
    } catch (error) {
      console.log('ℹ️  No valid JSON input provided, exiting gracefully');
      process.exit(0);
    }

    // Extract file path from JSON
    const filePath = inputData?.tool_input?.file_path;
    
    // Skip if no file path found
    if (!filePath) {
      console.log('ℹ️  No file path found in input, exiting');
      process.exit(0);
    }

    // Skip if file doesn't exist
    if (!existsSync(filePath)) {
      console.log(`ℹ️  File ${filePath} does not exist, exiting`);
      process.exit(0);
    }

    // Get file extension
    const extension = extname(filePath).toLowerCase().slice(1);
    
    // Change to project root
    const projectRoot = findProjectRoot();
    process.chdir(projectRoot);
    
    console.log(`🔧 Iron Manus DevEx: Processing ${filePath}`);

    // Process TypeScript/JavaScript files
    if (['ts', 'js', 'tsx', 'jsx'].includes(extension)) {
      console.log('📝 Running Prettier formatting...');
      
      if (commandExists('npm')) {
        // Try to format the specific file
        let formatResult = safeExec('npm run format --silent');
        if (!formatResult.success) {
          console.log('⚠️  Format command failed, trying direct prettier...');
          formatResult = safeExec(`npx prettier --write "${filePath}"`);
        }
        
        console.log('🔍 Running ESLint...');
        // Lint the specific file with auto-fix
        let lintResult = safeExec(`npm run lint -- --fix "${filePath}" --silent`);
        if (!lintResult.success) {
          console.log('⚠️  ESLint failed, trying without auto-fix...');
          safeExec(`npm run lint -- "${filePath}" --silent`);
        }
        
        console.log('✅ Code quality checks completed');
      } else {
        console.log('⚠️  npm not found, skipping formatting');
      }

    // Process JSON files
    } else if (extension === 'json') {
      console.log('📝 Formatting JSON file...');
      if (formatJsonFile(filePath)) {
        console.log('✅ JSON formatting completed');
      }

    // Process Markdown files
    } else if (extension === 'md') {
      console.log('📝 Checking Markdown formatting...');
      if (commandExists('npx')) {
        const result = safeExec(`npx markdownlint --fix "${filePath}"`);
        console.log('✅ Markdown formatting completed');
      }

    } else {
      console.log(`ℹ️  File type .${extension} - no specific formatting applied`);
    }

    // Run type checking for TypeScript files in the project
    if (extension === 'ts' && existsSync(join(projectRoot, 'tsconfig.json'))) {
      console.log('🔍 Running TypeScript type checking...');
      const typeCheckResult = safeExec('npm run build --silent');
      if (!typeCheckResult.success) {
        console.log('⚠️  Type checking found issues (build will show details)');
      }
    }

    console.log(`🎯 DevEx workflow completed for ${filePath}`);
    process.exit(0);

  } catch (error) {
    console.error(`❌ DevEx workflow error: ${error.message}`);
    process.exit(1);
  }
}

// Run main function
main().catch(error => {
  console.error(`❌ Unexpected error: ${error.message}`);
  process.exit(1);
});