#!/usr/bin/env node

/**
 * Docker Health Check Script for Iron Manus MCP
 * 
 * This script provides a proper health check for the Iron Manus MCP server
 * that validates actual application health rather than just Node.js availability.
 * 
 * The script:
 * 1. Attempts to create a server instance
 * 2. Validates that the HealthCheck tool is available
 * 3. Executes the health check logic
 * 4. Returns proper exit codes for Docker
 * 
 * Exit codes:
 * - 0: Healthy - application is running and responsive
 * - 1: Unhealthy - application has issues or is not responding
 */

import { createServer } from './dist/index.js';
import { toolRegistry } from './dist/tools/index.js';
import { validateConfig } from './dist/config.js';

async function performHealthCheck() {
  try {
    // 1. Validate configuration
    const configValidation = validateConfig();
    if (!configValidation.valid) {
      const criticalErrors = configValidation.errors.filter(error => error.includes('CRITICAL'));
      if (criticalErrors.length > 0) {
        console.error('❌ CRITICAL configuration errors detected:', criticalErrors);
        return false;
      }
      // Non-critical errors are warnings, don't fail health check
      console.warn('⚠️  Configuration warnings:', configValidation.errors);
    }

    // 2. Check if server can be created
    const server = createServer();
    if (!server) {
      console.error('❌ Failed to create server instance');
      return false;
    }

    // 3. Validate tool registry is functional
    const tools = toolRegistry.getToolDefinitions();
    if (!tools || tools.length === 0) {
      console.error('❌ Tool registry is empty or not functional');
      return false;
    }

    // 4. Check if HealthCheck tool is available
    const healthCheckTool = tools.find(tool => tool.name === 'HealthCheck');
    if (!healthCheckTool) {
      console.error('❌ HealthCheck tool not found in registry');
      return false;
    }

    // 5. Execute health check tool
    const healthResult = await toolRegistry.executeTool('HealthCheck', { detailed: false });
    
    if (!healthResult || !healthResult.content || !healthResult.content[0]) {
      console.error('❌ Health check tool returned invalid response');
      return false;
    }

    // Parse health check response
    const healthData = JSON.parse(healthResult.content[0].text);
    
    if (!healthData.healthy) {
      console.error('❌ Application health check failed:', healthData.status);
      if (healthData.checks) {
        Object.entries(healthData.checks).forEach(([check, result]) => {
          if (result.status === 'fail') {
            console.error(`  - ${check}: ${result.message}`);
          }
        });
      }
      return false;
    }

    // 6. Check memory usage (critical threshold)
    if (healthData.checks?.memory?.status === 'fail') {
      console.error('❌ Critical memory usage detected');
      return false;
    }

    // 7. Validate response time is reasonable
    if (healthData.responseTime > 5000) { // 5 seconds
      console.error('❌ Health check response time too slow:', healthData.responseTime, 'ms');
      return false;
    }

    console.log('✅ Health check passed');
    console.log(`  - Status: ${healthData.status}`);
    console.log(`  - Uptime: ${Math.round(healthData.uptime)}s`);
    console.log(`  - Response time: ${healthData.responseTime}ms`);
    console.log(`  - Version: ${healthData.version}`);
    
    return true;

  } catch (error) {
    console.error('❌ Health check failed with error:', error.message);
    return false;
  }
}

// Execute health check and exit with appropriate code
performHealthCheck()
  .then(isHealthy => {
    process.exit(isHealthy ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Health check crashed:', error);
    process.exit(1);
  });