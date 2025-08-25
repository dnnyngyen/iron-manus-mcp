#!/usr/bin/env node

/**
 * Protected Startup Script for Iron Manus MCP
 * 
 * This script ensures a clean startup by:
 * 1. Killing any legacy processes
 * 2. Removing any existing legacy files
 * 3. Starting the legacy file guardian
 * 4. Starting the main server
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const LEGACY_PATTERNS = [
  'iron_manus_component_cognitive_duality.json',
  'iron_manus_state.json', 
  'iron_manus_unified_constraints.json',
  'iron_manus_performance_archive.json'
];

console.log('🚀 Starting Iron Manus MCP with Legacy Protection');
console.log('=' .repeat(50));

/**
 * Step 1: Kill legacy processes
 */
function killLegacyProcesses() {
  return new Promise((resolve) => {
    console.log('🔍 Scanning for legacy processes...');
    
    exec('ps aux', (error, stdout) => {
      if (error) {
        console.log('⚠️  Could not scan processes, continuing...');
        resolve();
        return;
      }
      
      const lines = stdout.split('\n');
      const legacyProcesses = lines.filter(line => {
        const isLegacy = (line.includes('manus') || line.includes('iron')) && 
                        !line.includes('start-protected') &&
                        !line.includes('legacy-file-guardian') &&
                        (line.includes('manus-fleur-mcp') || 
                         line.includes('/Downloads/') ||
                         line.includes('old-manus') ||
                         (line.includes('iron-manus') && !line.includes(PROJECT_ROOT)));
        return isLegacy;
      });
      
      if (legacyProcesses.length === 0) {
        console.log('✅ No legacy processes found');
        resolve();
        return;
      }
      
      console.log(`🔥 Found ${legacyProcesses.length} legacy processes to kill`);
      let killed = 0;
      
      legacyProcesses.forEach(line => {
        const parts = line.trim().split(/\s+/);
        if (parts.length > 1) {
          const pid = parts[1];
          try {
            process.kill(pid, 'SIGTERM');
            console.log(`   💀 Killed PID ${pid}`);
            killed++;
            
            // Force kill after 2 seconds if still running
            setTimeout(() => {
              try {
                process.kill(pid, 'SIGKILL');
              } catch (e) {
                // Process already dead
              }
            }, 2000);
          } catch (e) {
            console.log(`   ⚠️  Could not kill PID ${pid}: ${e.message}`);
          }
        }
      });
      
      console.log(`✅ Killed ${killed} legacy processes`);
      setTimeout(resolve, 3000); // Wait for processes to die
    });
  });
}

/**
 * Step 2: Clean legacy files
 */
function cleanLegacyFiles() {
  console.log('🧹 Cleaning legacy files...');
  
  let cleaned = 0;
  LEGACY_PATTERNS.forEach(pattern => {
    const filePath = path.join(PROJECT_ROOT, pattern);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`   🗑️  Removed ${pattern}`);
        cleaned++;
      } catch (error) {
        console.log(`   ❌ Could not remove ${pattern}: ${error.message}`);
      }
    }
  });
  
  // Also check for any iron_manus_*.json files
  try {
    const files = fs.readdirSync(PROJECT_ROOT);
    files.forEach(file => {
      if (/^iron_manus_.*\.json$/.test(file)) {
        const filePath = path.join(PROJECT_ROOT, file);
        try {
          fs.unlinkSync(filePath);
          console.log(`   🗑️  Removed ${file}`);
          cleaned++;
        } catch (error) {
          console.log(`   ❌ Could not remove ${file}: ${error.message}`);
        }
      }
    });
  } catch (error) {
    console.log('   ⚠️  Could not scan directory for legacy files');
  }
  
  if (cleaned === 0) {
    console.log('✅ No legacy files found');
  } else {
    console.log(`✅ Cleaned ${cleaned} legacy files`);
  }
}

/**
 * Step 3: Start the guardian
 */
function startGuardian() {
  return new Promise((resolve) => {
    console.log('🛡️  Starting Legacy File Guardian...');
    
    const guardianPath = path.join(__dirname, 'legacy-file-guardian.cjs');
    const guardian = spawn('node', [guardianPath], {
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });
    
    guardian.stdout.on('data', (data) => {
      const msg = data.toString().trim();
      if (msg.includes('Guardian is now protecting')) {
        console.log('✅ Legacy File Guardian active');
        resolve();
      }
    });
    
    guardian.stderr.on('data', (data) => {
      console.log('Guardian stderr:', data.toString());
    });
    
    guardian.on('error', (error) => {
      console.log('⚠️  Guardian error:', error.message);
      resolve(); // Continue even if guardian fails
    });
    
    // Timeout fallback
    setTimeout(() => {
      console.log('✅ Guardian startup timeout - continuing...');
      resolve();
    }, 5000);
    
    guardian.unref(); // Don't keep process alive
  });
}

/**
 * Step 4: Start the main server
 */
function startMainServer() {
  console.log('🎯 Starting Iron Manus MCP server...');
  console.log('=' .repeat(50));
  
  const serverProcess = spawn('npm', ['start'], {
    cwd: PROJECT_ROOT,
    stdio: 'inherit'
  });
  
  serverProcess.on('error', (error) => {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  });
  
  serverProcess.on('close', (code) => {
    console.log(`🛑 Server process exited with code ${code}`);
    process.exit(code);
  });
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down...');
    serverProcess.kill('SIGINT');
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Terminating...');
    serverProcess.kill('SIGTERM');
  });
}

/**
 * Main execution
 */
async function main() {
  try {
    await killLegacyProcesses();
    cleanLegacyFiles();
    await startGuardian();
    startMainServer();
  } catch (error) {
    console.error('❌ Startup failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}