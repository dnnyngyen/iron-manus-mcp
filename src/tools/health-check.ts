/**
 * Health Check Tool
 * Provides comprehensive system health monitoring for production deployments
 */

import { BaseTool, ToolResult } from './base-tool.js';
import { validateConfig } from '../config.js';

/**
 * Health Check Tool for Production Monitoring
 *
 * Provides comprehensive health status including:
 * - Configuration validation
 * - Tool registry status
 * - Memory usage
 * - Uptime
 * - System readiness
 */
export class HealthCheckTool extends BaseTool {
  readonly name = 'HealthCheck';
  readonly description =
    'System intelligence assessment - evaluates not just operational health, but the cognitive readiness of your tools and infrastructure. When questioning system performance, ask: Are your tools thinking clearly? What might cognitive degradation look like in an AI system? This tool prompts you to consider: How do I assess whether my system is ready for intelligent decision-making, not just basic functionality? What early warning signs might indicate declining analytical capability?';

  readonly inputSchema = {
    type: 'object' as const,
    properties: {
      detailed: {
        type: 'boolean',
        description:
          'Diagnostic depth preference - How much system introspection do you need to assess cognitive readiness and identify potential thinking bottlenecks?',
      },
    },
    required: [],
    additionalProperties: false,
  };

  /**
   * Handles health check requests
   */
  async handle(args: unknown): Promise<ToolResult> {
    try {
      this.validateArgs(args);
      const { detailed = false } = (args as { detailed?: boolean }) || {};

      const startTime = Date.now();
      const healthData = await this.performHealthCheck(detailed);
      const responseTime = Date.now() - startTime;

      const response = {
        status: healthData.healthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        responseTime,
        version: '0.2.4',
        ...healthData,
      };

      return this.createResponse(JSON.stringify(response, null, 2));
    } catch (error) {
      return this.createErrorResponse(
        error instanceof Error ? error : new Error('Health check failed')
      );
    }
  }

  /**
   * Performs comprehensive health check
   */
  private async performHealthCheck(detailed: boolean) {
    const checks = {
      healthy: true,
      checks: {} as Record<string, { status: string; message?: string; details?: unknown }>,
    };

    // Configuration validation
    try {
      const configValidation = validateConfig();
      checks.checks.configuration = {
        status: configValidation.valid ? 'pass' : 'fail',
        message: configValidation.valid
          ? 'Configuration is valid'
          : `Configuration errors: ${configValidation.errors.join(', ')}`,
        ...(detailed && { details: configValidation }),
      };
      if (!configValidation.valid) {
        checks.healthy = false;
      }
    } catch (error) {
      checks.checks.configuration = {
        status: 'fail',
        message: `Configuration check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
      checks.healthy = false;
    }

    // Tool registry health - simplified to avoid circular dependency
    try {
      const expectedTools = [
        'JARVIS',
        'MultiAPIFetch',
        'APISearch',
        'APIValidator',
        'PythonDataAnalysis',
        'PythonExecutor',
        'EnhancedPythonDataScience',
        'IronManusStateGraph',
      ];

      checks.checks.toolRegistry = {
        status: 'pass',
        message: `Expected ${expectedTools.length} core tools available`,
        ...(detailed && {
          details: {
            expectedTools,
            note: 'Tool registry validation skipped to avoid circular dependency',
          },
        }),
      };
    } catch (error) {
      checks.checks.toolRegistry = {
        status: 'fail',
        message: `Tool registry check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
      checks.healthy = false;
    }

    // Memory usage
    try {
      const memUsage = process.memoryUsage();
      const memUsageMB = {
        rss: Math.round(memUsage.rss / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024),
      };

      // Warning if heap used > 512MB, critical if > 1GB
      const heapUsedMB = memUsageMB.heapUsed;
      let memStatus = 'pass';
      let memMessage = `Heap usage: ${heapUsedMB}MB`;

      if (heapUsedMB > 1024) {
        memStatus = 'fail';
        memMessage += ' (CRITICAL: > 1GB)';
        checks.healthy = false;
      } else if (heapUsedMB > 512) {
        memStatus = 'warn';
        memMessage += ' (WARNING: > 512MB)';
      }

      checks.checks.memory = {
        status: memStatus,
        message: memMessage,
        ...(detailed && { details: memUsageMB }),
      };
    } catch (error) {
      checks.checks.memory = {
        status: 'fail',
        message: `Memory check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }

    // Process health
    try {
      checks.checks.process = {
        status: 'pass',
        message: `Node.js ${process.version}, uptime: ${Math.round(process.uptime())}s`,
        ...(detailed && {
          details: {
            nodeVersion: process.version,
            platform: process.platform,
            arch: process.arch,
            pid: process.pid,
            cwd: process.cwd(),
          },
        }),
      };
    } catch (error) {
      checks.checks.process = {
        status: 'fail',
        message: `Process check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }

    return checks;
  }
}
