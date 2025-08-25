#!/usr/bin/env node

/**
 * Legacy File Guardian - Prevents legacy JSON files from persisting
 * 
 * This script creates a filesystem watcher that immediately detects and removes
 * legacy JSON files that might be created by old processes or cached code.
 * 
 * Protects against:
 * - iron_manus_*.json files
 * - Legacy state management files
 * - Old component cognitive duality files
 * - Unified constraints files
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Legacy file patterns to watch for
const LEGACY_PATTERNS = [
  'iron_manus_component_cognitive_duality.json',
  'iron_manus_state.json', 
  'iron_manus_unified_constraints.json',
  'iron_manus_performance_archive.json'
];

// Additional patterns to catch any iron_manus_*.json files
const LEGACY_REGEX = /^iron_manus_.*\.json$/;

const PROJECT_ROOT = path.resolve(__dirname, '..');

console.log('🛡️  Legacy File Guardian started');
console.log(`📁 Watching directory: ${PROJECT_ROOT}`);
console.log(`🎯 Protecting against: ${LEGACY_PATTERNS.join(', ')}`);

/**
 * Kill any legacy Manus processes that might be running
 */
function killLegacyProcesses() {
  const ps = spawn('ps', ['aux']);
  let output = '';
  
  ps.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  ps.on('close', () => {
    const lines = output.split('\n');
    const legacyProcesses = lines.filter(line => 
      (line.includes('manus') || line.includes('iron')) && 
      !line.includes('legacy-file-guardian') &&
      !line.includes('iron-manus-mcp/dist/index.js') && // Allow current server
      (line.includes('manus-fleur-mcp') || line.includes('old-manus') || line.includes('/Downloads/'))
    );
    
    legacyProcesses.forEach(line => {
      const parts = line.trim().split(/\s+/);
      if (parts.length > 1) {
        const pid = parts[1];
        console.log(`🔥 Killing legacy process PID ${pid}: ${parts.slice(10).join(' ')}`);
        try {
          process.kill(pid, 'SIGTERM');
          setTimeout(() => {
            try {
              process.kill(pid, 'SIGKILL');
            } catch (e) {
              // Process already dead
            }
          }, 1000);
        } catch (e) {
          console.log(`⚠️  Could not kill process ${pid}: ${e.message}`);
        }
      }
    });
  });
}

/**
 * Remove a legacy file immediately
 */
function removeLegacyFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️  DELETED legacy file: ${path.basename(filePath)}`);
      
      // Also kill any processes that might be creating these files
      killLegacyProcesses();
      
      return true;
    }
  } catch (error) {
    console.error(`❌ Error removing ${filePath}:`, error.message);
  }
  return false;
}

/**
 * Check if a filename matches legacy patterns
 */
function isLegacyFile(filename) {
  return LEGACY_PATTERNS.includes(filename) || LEGACY_REGEX.test(filename);
}

/**
 * Scan and clean existing legacy files
 */
function initialCleanup() {
  console.log('🧹 Performing initial cleanup...');
  
  try {
    const files = fs.readdirSync(PROJECT_ROOT);
    let cleaned = 0;
    
    files.forEach(file => {
      if (isLegacyFile(file)) {
        const filePath = path.join(PROJECT_ROOT, file);
        if (removeLegacyFile(filePath)) {
          cleaned++;
        }
      }
    });
    
    if (cleaned > 0) {
      console.log(`✅ Initial cleanup complete: ${cleaned} legacy files removed`);
    } else {
      console.log('✅ No legacy files found during initial cleanup');
    }
    
    // Kill any legacy processes
    killLegacyProcesses();
    
  } catch (error) {
    console.error('❌ Error during initial cleanup:', error.message);
  }
}

/**
 * Start filesystem watcher
 */
function startWatcher() {
  try {
    const watcher = fs.watch(PROJECT_ROOT, { persistent: true }, (eventType, filename) => {
      if (!filename) return;
      
      if (isLegacyFile(filename)) {
        console.log(`🚨 Legacy file detected: ${filename} (${eventType})`);
        
        const filePath = path.join(PROJECT_ROOT, filename);
        
        // Small delay to ensure file is fully written before attempting deletion
        setTimeout(() => {
          removeLegacyFile(filePath);
        }, 100);
      }
    });
    
    console.log('👁️  Filesystem watcher active');
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Legacy File Guardian shutting down...');
      watcher.close();
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.log('\n🛑 Legacy File Guardian terminated');
      watcher.close();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Error starting filesystem watcher:', error.message);
    process.exit(1);
  }
}

/**
 * Periodic cleanup - runs every 30 seconds
 */
function startPeriodicCleanup() {
  setInterval(() => {
    try {
      const files = fs.readdirSync(PROJECT_ROOT);
      files.forEach(file => {
        if (isLegacyFile(file)) {
          const filePath = path.join(PROJECT_ROOT, file);
          removeLegacyFile(filePath);
        }
      });
    } catch (error) {
      // Silent fail for periodic cleanup
    }
  }, 30000);
}

// Start the guardian
if (require.main === module) {
  initialCleanup();
  startWatcher();
  startPeriodicCleanup();
  
  console.log('🛡️  Legacy File Guardian is now protecting your project!');
  console.log('   Press Ctrl+C to stop');
}

module.exports = {
  removeLegacyFile,
  isLegacyFile,
  killLegacyProcesses
};