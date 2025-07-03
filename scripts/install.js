#!/usr/bin/env node

/**
 * Cross-Platform Installation Script for Iron Manus MCP
 * Handles installation, setup, and configuration across Windows, macOS, and Linux
 */

import { execSync, spawn } from 'child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, chmodSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { homedir, platform } from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

const isWindows = platform() === 'win32';
const isMacOS = platform() === 'darwin';
const isLinux = platform() === 'linux';

/**
 * Execute command with cross-platform compatibility
 */
function execCommand(command, options = {}) {
  try {
    const result = execSync(command, { 
      stdio: 'inherit', 
      encoding: 'utf8',
      cwd: options.cwd || projectRoot,
      ...options 
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Check if command exists
 */
function commandExists(command) {
  try {
    const checkCmd = isWindows ? `where ${command}` : `which ${command}`;
    execSync(checkCmd, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get Claude settings directory
 */
function getClaudeSettingsDir() {
  if (isWindows) {
    return join(process.env.USERPROFILE || homedir(), '.claude');
  }
  return join(homedir(), '.claude');
}

/**
 * Install Git hooks with cross-platform compatibility
 */
function installGitHooks() {
  console.log('📦 Installing Git hooks...');
  
  const hooksDir = join(projectRoot, '.git', 'hooks');
  const preCommitSource = join(projectRoot, 'hooks', 'pre-commit');
  const preCommitTarget = join(hooksDir, 'pre-commit');
  
  if (!existsSync(hooksDir)) {
    console.log('⚠️  Git hooks directory not found. Make sure you\'re in a Git repository.');
    return false;
  }
  
  if (!existsSync(preCommitSource)) {
    console.log('⚠️  Pre-commit hook source file not found.');
    return false;
  }
  
  try {
    copyFileSync(preCommitSource, preCommitTarget);
    
    // Set executable permissions (Unix-like systems only)
    if (!isWindows) {
      chmodSync(preCommitTarget, 0o755);
    }
    
    console.log('✅ Git hooks installed successfully');
    return true;
  } catch (error) {
    console.error(`❌ Failed to install Git hooks: ${error.message}`);
    return false;
  }
}

/**
 * Set up Claude Code configuration
 */
function setupClaudeConfig() {
  console.log('🔧 Setting up Claude Code configuration...');
  
  const claudeDir = getClaudeSettingsDir();
  const exampleHooks = join(projectRoot, '.claude', 'hooks-example.json');
  const claudeHooks = join(claudeDir, 'hooks.json');
  
  // Create .claude directory if it doesn't exist
  if (!existsSync(claudeDir)) {
    try {
      mkdirSync(claudeDir, { recursive: true });
    } catch (error) {
      console.error(`❌ Failed to create Claude directory: ${error.message}`);
      return false;
    }
  }
  
  // Copy hooks configuration if example exists
  if (existsSync(exampleHooks)) {
    try {
      copyFileSync(exampleHooks, claudeHooks);
      console.log(`✅ Claude hooks configuration copied to: ${claudeHooks}`);
    } catch (error) {
      console.error(`❌ Failed to copy hooks configuration: ${error.message}`);
      return false;
    }
  }
  
  // Display MCP configuration instructions
  console.log('\n📋 MCP Configuration Instructions:');
  console.log('Add this to your Claude Desktop MCP settings:');
  console.log(JSON.stringify({
    mcpServers: {
      "iron-manus-mcp": {
        command: "node",
        args: ["dist/index.js"],
        cwd: projectRoot
      }
    }
  }, null, 2));
  
  console.log(`\n📍 Claude settings location: ${join(claudeDir, 'settings.json')}`);
  
  return true;
}

/**
 * Verify installation requirements
 */
function verifyRequirements() {
  console.log('🔍 Verifying installation requirements...');
  
  const requirements = [
    { name: 'Node.js', command: 'node', version: '--version' },
    { name: 'npm', command: 'npm', version: '--version' },
    { name: 'Git', command: 'git', version: '--version' }
  ];
  
  let allValid = true;
  
  for (const req of requirements) {
    if (commandExists(req.command)) {
      try {
        const version = execSync(`${req.command} ${req.version}`, { encoding: 'utf8' }).trim();
        console.log(`✅ ${req.name}: ${version}`);
      } catch {
        console.log(`✅ ${req.name}: Available`);
      }
    } else {
      console.log(`❌ ${req.name}: Not found`);
      allValid = false;
    }
  }
  
  // Check Python (optional for hooks)
  if (commandExists('python') || commandExists('python3')) {
    const pythonCmd = commandExists('python3') ? 'python3' : 'python';
    try {
      const version = execSync(`${pythonCmd} --version`, { encoding: 'utf8' }).trim();
      console.log(`✅ Python: ${version} (optional for Claude Code hooks)`);
    } catch {
      console.log(`⚠️  Python: Available but version check failed`);
    }
  } else {
    console.log(`⚠️  Python: Not found (optional for Claude Code hooks)`);
  }
  
  return allValid;
}

/**
 * Main installation process
 */
async function main() {
  console.log('🚀 Iron Manus MCP Cross-Platform Installation\n');
  
  // Detect platform
  console.log(`🖥️  Platform: ${platform()} (${process.arch})`);
  console.log(`📁 Project root: ${projectRoot}\n`);
  
  // Verify requirements
  if (!verifyRequirements()) {
    console.log('\n❌ Some requirements are missing. Please install them before continuing.');
    process.exit(1);
  }
  
  console.log('\n📦 Installing dependencies...');
  const installResult = execCommand('npm install');
  if (!installResult.success) {
    console.error('❌ Failed to install dependencies');
    process.exit(1);
  }
  
  console.log('\n🔨 Building project...');
  const buildResult = execCommand('npm run build');
  if (!buildResult.success) {
    console.error('❌ Failed to build project');
    process.exit(1);
  }
  
  console.log('\n🧪 Running tests...');
  const testResult = execCommand('npm test');
  if (!testResult.success) {
    console.log('⚠️  Some tests failed, but installation can continue');
  }
  
  // Install Git hooks
  installGitHooks();
  
  // Setup Claude configuration
  setupClaudeConfig();
  
  console.log('\n🎉 Installation completed successfully!');
  console.log('\n📚 Next steps:');
  console.log('1. Configure Claude Desktop with the MCP settings shown above');
  console.log('2. Restart Claude Desktop');
  console.log('3. Test the JARVIS tool in Claude');
  
  if (!commandExists('python') && !commandExists('python3')) {
    console.log('\n💡 Optional: Install Python 3.7+ for enhanced Claude Code hooks functionality');
  }
  
  console.log('\n📖 See README.md for detailed usage instructions');
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Iron Manus MCP Installation Script

Usage: node scripts/install.js [options]

Options:
  --help, -h     Show this help message
  --verify       Only verify requirements without installing
  --hooks        Only install Git hooks
  --claude       Only setup Claude configuration

Examples:
  node scripts/install.js           # Full installation
  node scripts/install.js --verify  # Check requirements only
  node scripts/install.js --hooks   # Install Git hooks only
  node scripts/install.js --claude  # Setup Claude config only
`);
  process.exit(0);
}

if (args.includes('--verify')) {
  verifyRequirements();
  process.exit(0);
}

if (args.includes('--hooks')) {
  installGitHooks();
  process.exit(0);
}

if (args.includes('--claude')) {
  setupClaudeConfig();
  process.exit(0);
}

// Run main installation
main().catch(error => {
  console.error(`❌ Installation failed: ${error.message}`);
  process.exit(1);
});