#!/usr/bin/env node

/**
 * Legacy File Monitor - Continuous monitoring and alerting
 * 
 * This script provides continuous monitoring for legacy file creation
 * and sends alerts when files are detected. It's designed to run as
 * a background service or scheduled task.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const LEGACY_PATTERNS = [
  'iron_manus_component_cognitive_duality.json',
  'iron_manus_state.json',
  'iron_manus_unified_constraints.json',
  'iron_manus_performance_archive.json'
];

const LOG_FILE = path.join(PROJECT_ROOT, 'legacy-file-monitor.log');

/**
 * Log a message with timestamp
 */
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${level}: ${message}`;
  
  console.log(logMessage);
  
  try {
    fs.appendFileSync(LOG_FILE, logMessage + '\n');
  } catch (error) {
    console.error('Could not write to log file:', error.message);
  }
}

/**
 * Check for legacy files
 */
function checkForLegacyFiles() {
  try {
    const files = fs.readdirSync(PROJECT_ROOT);
    const legacyFiles = files.filter(file => 
      LEGACY_PATTERNS.includes(file) || /^iron_manus_.*\.json$/.test(file)
    );
    
    if (legacyFiles.length > 0) {
      const alert = `🚨 LEGACY FILES DETECTED: ${legacyFiles.join(', ')}`;
      log(alert, 'ALERT');
      
      // Remove the files
      legacyFiles.forEach(file => {
        const filePath = path.join(PROJECT_ROOT, file);
        try {
          fs.unlinkSync(filePath);
          log(`🗑️  Removed legacy file: ${file}`, 'ACTION');
        } catch (error) {
          log(`❌ Could not remove ${file}: ${error.message}`, 'ERROR');
        }
      });
      
      // Check for legacy processes
      exec('ps aux', (error, stdout) => {
        if (!error) {
          const lines = stdout.split('\n');
          const legacyProcesses = lines.filter(line => 
            (line.includes('manus') || line.includes('iron')) && 
            !line.includes('monitor-legacy-files') &&
            !line.includes('legacy-file-guardian') &&
            (line.includes('manus-fleur-mcp') || line.includes('/Downloads/'))
          );
          
          if (legacyProcesses.length > 0) {
            log(`🔍 Legacy processes detected: ${legacyProcesses.length}`, 'WARNING');
            legacyProcesses.forEach((line, index) => {
              log(`   Process ${index + 1}: ${line.trim()}`, 'INFO');
            });
          }
        }
      });
      
      return true;
    }
    
    return false;
  } catch (error) {
    log(`❌ Error checking for legacy files: ${error.message}`, 'ERROR');
    return false;
  }
}

/**
 * Check system health
 */
function checkSystemHealth() {
  const stats = {
    timestamp: new Date().toISOString(),
    projectRoot: PROJECT_ROOT,
    nodeVersion: process.version,
    platform: process.platform,
    uptime: process.uptime()
  };
  
  log(`💓 System health check: Node ${stats.nodeVersion}, Platform ${stats.platform}, Uptime ${Math.floor(stats.uptime)}s`, 'HEALTH');
}

/**
 * Main monitoring loop
 */
function startMonitoring(intervalMs = 10000) {
  log('🔍 Starting legacy file monitoring...', 'START');
  log(`📁 Monitoring directory: ${PROJECT_ROOT}`, 'INFO');
  log(`⏱️  Check interval: ${intervalMs}ms`, 'INFO');
  
  // Initial check
  checkForLegacyFiles();
  
  // Periodic checks
  const monitorInterval = setInterval(() => {
    checkForLegacyFiles();
  }, intervalMs);
  
  // Health checks every 5 minutes
  const healthInterval = setInterval(() => {
    checkSystemHealth();
  }, 300000);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    log('🛑 Monitor shutting down...', 'STOP');
    clearInterval(monitorInterval);
    clearInterval(healthInterval);
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    log('🛑 Monitor terminated', 'STOP');
    clearInterval(monitorInterval);
    clearInterval(healthInterval);
    process.exit(0);
  });
  
  log('✅ Legacy file monitoring active', 'SUCCESS');
}

/**
 * Command-line interface
 */
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Legacy File Monitor

Usage:
  node monitor-legacy-files.js [options]

Options:
  --interval <ms>    Monitoring interval in milliseconds (default: 10000)
  --once            Run check once and exit
  --help, -h        Show this help message

Examples:
  node monitor-legacy-files.js                    # Start continuous monitoring
  node monitor-legacy-files.js --interval 5000    # Check every 5 seconds
  node monitor-legacy-files.js --once             # Single check
`);
    process.exit(0);
  }
  
  if (args.includes('--once')) {
    log('🔍 Running single legacy file check...', 'START');
    const found = checkForLegacyFiles();
    if (found) {
      log('⚠️  Legacy files were found and removed', 'RESULT');
      process.exit(1);
    } else {
      log('✅ No legacy files detected', 'RESULT');
      process.exit(0);
    }
  }
  
  const intervalIndex = args.indexOf('--interval');
  let interval = 10000;
  
  if (intervalIndex !== -1 && args[intervalIndex + 1]) {
    interval = parseInt(args[intervalIndex + 1], 10);
    if (isNaN(interval) || interval < 1000) {
      console.error('❌ Invalid interval. Must be at least 1000ms.');
      process.exit(1);
    }
  }
  
  startMonitoring(interval);
}

module.exports = {
  checkForLegacyFiles,
  startMonitoring
};