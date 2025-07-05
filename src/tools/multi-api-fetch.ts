/**
 * Multi-API Fetch Tool
 * Extracted from index.ts to provide modular tool architecture
 */

import { BaseTool, ToolSchema, ToolResult } from './base-tool.js';
import axios, { AxiosError } from 'axios';
import { rateLimiter, SAMPLE_API_REGISTRY } from '../core/api-registry.js';
import { validateAndSanitizeURL } from '../security/ssrfGuard.js';
import { MULTI_API_FETCH_CONFIG } from '../config/tool-constants.js';
import logger from '../utils/logger.js';

export interface MultiAPIFetchArgs {
  api_endpoints: string[]; // Knowledge sources for triangulation
  timeout_ms?: number; // Patience threshold for each source
  max_concurrent?: number; // Synthesis bandwidth
  headers?: Record<string, string>; // Authentication and context signals
}

/**
 * Semaphore class for limiting concurrent operations
 */
class Semaphore {
  private permits: number;
  private waiting: (() => void)[] = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--;
      return Promise.resolve();
    }

    return new Promise<void>(resolve => {
      this.waiting.push(resolve);
    });
  }

  release(): void {
    this.permits++;
    if (this.waiting.length > 0) {
      const resolve = this.waiting.shift()!;
      this.permits--;
      resolve();
    }
  }
}

/**
 * Multi-API Fetch Tool
 * Parallel HTTP requests with timeout management and response aggregation
 */
export class MultiAPIFetchTool extends BaseTool {
  readonly name = 'MultiAPIFetch';
  readonly description =
    'Strategic knowledge synthesis from diverse sources. When comprehensive cross-validation is crucial, when contradictory data requires intelligent reconciliation, when single sources feel insufficient - this tool prompts you to think: How do patterns emerge across multiple perspectives? What insights arise from data triangulation? Use this to challenge assumptions and build robust understanding through systematic comparison of independent knowledge sources.';

  readonly inputSchema: ToolSchema = {
    type: 'object',
    properties: {
      api_endpoints: {
        type: 'array',
        items: { type: 'string' },
        description:
          'Knowledge sources for triangulation - Which perspectives will challenge your assumptions? What diverse viewpoints will reveal blind spots in your understanding?',
      },
      timeout_ms: {
        type: 'number',
        description:
          'Patience threshold for each source (default: 5000ms) - How long should you wait for each perspective before accepting partial knowledge?',
      },
      max_concurrent: {
        type: 'number',
        description:
          'Synthesis bandwidth (default: 3) - How many perspectives can you meaningfully process simultaneously without losing analytical depth?',
      },
      headers: {
        type: 'object',
        description:
          'Authentication and context signals - What identity or credentials will unlock the most authentic responses from each source?',
      },
    },
    required: ['api_endpoints'],
  };

  /**
   * Handle Multi-API Fetch execution
   */
  async handle(args: MultiAPIFetchArgs): Promise<ToolResult> {
    const startTime = Date.now();

    try {
      // Extract validation into helper methods
      const validationResult = this.validateMultiAPIFetchArgs(args);
      const { validEndpoints, timeoutMs, maxConcurrent, headers } = validationResult;

      // Create semaphore and axios instance
      const { semaphore, axiosInstance } = this.setupFetchingInfrastructure(
        timeoutMs,
        maxConcurrent,
        headers
      );

      // Execute all API requests in parallel
      const apiResults = await this.executeParallelFetches(
        validEndpoints,
        semaphore,
        axiosInstance,
        timeoutMs
      );

      // Process and format results
      return this.generateFetchResponse(
        apiResults,
        validEndpoints,
        maxConcurrent,
        timeoutMs,
        startTime
      );
    } catch (error) {
      return this.handleFetchError(error, startTime);
    }
  }

  /**
   * Validates and processes MultiAPIFetch arguments
   */
  private validateMultiAPIFetchArgs(args: MultiAPIFetchArgs) {
    this.validateArgs(args);

    // Validate required parameters
    if (!args.api_endpoints || !Array.isArray(args.api_endpoints)) {
      throw new Error('api_endpoints is required and must be an array of URLs');
    }

    if (args.api_endpoints.length === 0) {
      throw new Error('api_endpoints array cannot be empty');
    }

    if (args.api_endpoints.length > MULTI_API_FETCH_CONFIG.MAX_ENDPOINTS) {
      throw new Error(
        `Maximum ${MULTI_API_FETCH_CONFIG.MAX_ENDPOINTS} API endpoints allowed per request`
      );
    }

    // Validate URLs
    const validEndpoints: string[] = [];
    for (const endpoint of args.api_endpoints) {
      if (typeof endpoint !== 'string') {
        throw new Error('All api_endpoints must be strings');
      }

      try {
        const url = new URL(endpoint);
        if (!['http:', 'https:'].includes(url.protocol)) {
          throw new Error(`Invalid protocol in URL: ${endpoint}`);
        }
        validEndpoints.push(endpoint);
      } catch {
        throw new Error(`Invalid URL format: ${endpoint}`);
      }
    }

    // Validate optional parameters
    const timeoutMs = args.timeout_ms ?? MULTI_API_FETCH_CONFIG.DEFAULT_TIMEOUT_MS;
    if (
      typeof timeoutMs !== 'number' ||
      timeoutMs < MULTI_API_FETCH_CONFIG.MIN_TIMEOUT_MS ||
      timeoutMs > MULTI_API_FETCH_CONFIG.MAX_TIMEOUT_MS
    ) {
      throw new Error(
        `timeout_ms must be a number between ${MULTI_API_FETCH_CONFIG.MIN_TIMEOUT_MS} and ${MULTI_API_FETCH_CONFIG.MAX_TIMEOUT_MS}`
      );
    }

    const maxConcurrent = args.max_concurrent ?? MULTI_API_FETCH_CONFIG.DEFAULT_MAX_CONCURRENT;
    if (
      typeof maxConcurrent !== 'number' ||
      maxConcurrent < MULTI_API_FETCH_CONFIG.MIN_CONCURRENT ||
      maxConcurrent > MULTI_API_FETCH_CONFIG.MAX_CONCURRENT
    ) {
      throw new Error(
        `max_concurrent must be a number between ${MULTI_API_FETCH_CONFIG.MIN_CONCURRENT} and ${MULTI_API_FETCH_CONFIG.MAX_CONCURRENT}`
      );
    }

    const headers = args.headers || {};
    if (typeof headers !== 'object' || Array.isArray(headers)) {
      throw new Error('headers must be an object');
    }

    return { validEndpoints, timeoutMs, maxConcurrent, headers };
  }

  /**
   * Sets up semaphore and axios instance for fetching
   */
  private setupFetchingInfrastructure(
    timeoutMs: number,
    maxConcurrent: number,
    headers: Record<string, string>
  ) {
    const semaphore = new Semaphore(maxConcurrent);

    const axiosInstance = axios.create({
      timeout: timeoutMs,
      headers: {
        'User-Agent': 'Iron-Manus-MCP/0.2.4',
        Accept: 'application/json, text/plain, */*',
        ...headers,
      },
      maxContentLength: MULTI_API_FETCH_CONFIG.MAX_CONTENT_LENGTH_MB * 1024 * 1024,
      maxBodyLength: MULTI_API_FETCH_CONFIG.MAX_CONTENT_LENGTH_MB * 1024 * 1024,
    });

    return { semaphore, axiosInstance };
  }

  /**
   * Executes parallel API fetches with rate limiting and error handling
   */
  private async executeParallelFetches(
    validEndpoints: string[],
    semaphore: Semaphore,
    axiosInstance: any,
    timeoutMs: number
  ) {
    // Function to fetch a single API with rate limiting and error handling
    const fetchAPI = async (endpoint: string, index: number) => {
      await semaphore.acquire();
      const startTime = Date.now();

      try {

        // Check rate limiting
        const apiName = new URL(endpoint).hostname;
        if (!rateLimiter.canMakeRequest(apiName, 10, 60000)) {
          throw new Error('Rate limit exceeded for this API');
        }

        // Try to find API in registry for smart retry
        const registryAPI = SAMPLE_API_REGISTRY.find(
          api => api.url === endpoint || endpoint.includes(new URL(api.url).hostname)
        );

        // Make the request with exponential backoff retry and smart alternatives
        let lastError: Error | null = null;
        const maxRetries = 2;
        let attemptedUrls = [endpoint];

        // If primary endpoint fails and we have alternatives, try them
        if (registryAPI?.endpoint_patterns) {
          attemptedUrls = [endpoint, ...registryAPI.endpoint_patterns.filter(p => p !== endpoint)];
        }

        for (const currentUrl of attemptedUrls) {
          for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
              if (attempt > 0) {
                // Exponential backoff: 500ms, 1000ms
                const delay = 500 * Math.pow(2, attempt - 1);
                await new Promise(resolve => setTimeout(resolve, delay));
              }

              // SSRF Protection: Validate and sanitize URL before making request
              const sanitizedUrl = validateAndSanitizeURL(currentUrl);
              if (!sanitizedUrl) {
                throw new Error(`URL blocked by SSRF protection: ${currentUrl}`);
              }

              const response = await axiosInstance.get(sanitizedUrl);
              const duration = Date.now() - startTime;

              // Sanitize response data
              let sanitizedData = response.data;
              if (
                typeof sanitizedData === 'string' &&
                sanitizedData.length > MULTI_API_FETCH_CONFIG.MAX_TRUNCATE_CHARS
              ) {
                sanitizedData =
                  sanitizedData.substring(0, MULTI_API_FETCH_CONFIG.MAX_TRUNCATE_CHARS) +
                  '... [truncated]';
              } else if (typeof sanitizedData === 'object' && sanitizedData !== null) {
                // Properly truncate JSON objects while maintaining validity
                sanitizedData = this.truncateJSONObject(
                  sanitizedData,
                  MULTI_API_FETCH_CONFIG.MAX_TRUNCATE_CHARS
                );
              }

              return {
                endpoint: currentUrl !== endpoint ? `${endpoint} → ${currentUrl}` : endpoint,
                index,
                success: true,
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(
                  Object.entries(response.headers).slice(0, 10) // Limit headers
                ),
                data: sanitizedData,
                size: JSON.stringify(response.data).length,
                duration,
                error: null,
                corrected: currentUrl !== endpoint,
              };
            } catch (error) {
              lastError = error as Error;
              // Don't break here, continue to next attempt
            }
          }
          // If all attempts for this URL failed, try next URL
        }

        // If all URLs failed, throw the last error
        throw lastError;
      } catch (error) {
        const duration = Date.now() - startTime;
        const axiosError = error as AxiosError;

        let errorType = 'Unknown';
        let errorMessage = 'Unknown error occurred';

        if (axiosError.code === 'ECONNABORTED') {
          errorType = 'Timeout';
          errorMessage = `Request timeout after ${timeoutMs}ms`;
        } else if (axiosError.code === 'ENOTFOUND' || axiosError.code === 'ECONNREFUSED') {
          errorType = 'Network';
          errorMessage = 'Network connection failed';
        } else if (axiosError.response) {
          errorType = 'HTTP';
          errorMessage = `HTTP ${axiosError.response.status}: ${axiosError.response.statusText}`;
        } else if (error instanceof Error) {
          if (error.message.includes('Rate limit exceeded')) {
            errorType = 'Rate Limit';
            errorMessage = 'Rate limit exceeded';
          } else {
            errorType = 'Request';
            errorMessage = error.message;
          }
        }

        return {
          endpoint,
          index,
          success: false,
          status: axiosError.response?.status || 0,
          statusText: axiosError.response?.statusText || 'Error',
          headers: {},
          data: null,
          size: 0,
          duration,
          error: {
            type: errorType,
            message: errorMessage,
            code: axiosError.code || 'UNKNOWN',
          },
        };
      } finally {
        semaphore.release();
      }
    };

    // Execute all requests in parallel with Promise.allSettled
    const results = await Promise.allSettled(
      validEndpoints.map((endpoint, index) => fetchAPI(endpoint, index))
    );

    // Process results and return API results
    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          endpoint: validEndpoints[index],
          index,
          success: false,
          status: 0,
          statusText: 'Promise Rejected',
          headers: {},
          data: null,
          size: 0,
          duration: 0,
          error: {
            type: 'Promise',
            message: result.reason?.message || 'Promise was rejected',
            code: 'PROMISE_REJECTED',
          },
        };
      }
    });
  }

  /**
   * Generates comprehensive fetch response with statistics and formatting
   */
  private generateFetchResponse(
    apiResults: any[],
    validEndpoints: string[],
    maxConcurrent: number,
    timeoutMs: number,
    startTime: number
  ): ToolResult {
    // Calculate statistics
    const totalDuration = Date.now() - startTime;
    const successful = apiResults.filter(r => r.success).length;
    const failed = apiResults.length - successful;
    const totalDataSize = apiResults.reduce((sum, r) => sum + r.size, 0);
    const avgResponseTime =
      successful > 0
        ? apiResults.filter(r => r.success).reduce((sum, r) => sum + r.duration, 0) / successful
        : 0;

    // Group errors by type
    const errorsByType: Record<string, number> = {};
    apiResults
      .filter(r => !r.success)
      .forEach(r => {
        const errorType = r.error?.type || 'Unknown';
        errorsByType[errorType] = (errorsByType[errorType] || 0) + 1;
      });

    // Format individual results
    const formattedResults = apiResults
      .map((result, i) => {
        const status = result.success ? 'SUCCESS' : 'ERROR';
        const url = new URL(result.endpoint);
        const domain = url.hostname;

        if (result.success) {
          const dataPreview =
            typeof result.data === 'object'
              ? JSON.stringify(result.data).substring(0, 200) + '...'
              : String(result.data).substring(0, 200) + '...';

          return `### ${i + 1}. ${status} ${domain}
**URL**: ${result.endpoint}
**Status**: ${result.status} ${result.statusText}
**Response Time**: ${result.duration}ms
**Data Size**: ${(result.size / 1024).toFixed(2)}KB
**Data Preview**: ${dataPreview}
`;
        } else {
          return `### ${i + 1}. ${status} ${domain}
**URL**: ${result.endpoint}
**Error Type**: ${result.error?.type || 'Unknown'}
**Error**: ${result.error?.message || 'Unknown error'}
**Response Time**: ${result.duration}ms
`;
        }
      })
      .join('\n');

    // Generate comprehensive response
    const responseText = `# 📡 Multi-API Fetch Results

**APIs Queried**: ${validEndpoints.length}
**Successful**: ${successful}
**Failed**: ${failed}
**Total Time**: ${totalDuration}ms
**Average Response Time**: ${avgResponseTime.toFixed(0)}ms
**Total Data Retrieved**: ${(totalDataSize / 1024).toFixed(2)}KB

## Performance Summary
- **Success Rate**: ${((successful / validEndpoints.length) * 100).toFixed(1)}%
- **Concurrent Requests**: ${maxConcurrent}
- **Request Timeout**: ${timeoutMs}ms
- **Rate Limiting**: Active

${
  Object.keys(errorsByType).length > 0
    ? `## ⚠️ **Error Analysis**
${Object.entries(errorsByType)
  .map(([type, count]) => `- **${type} Errors**: ${count}`)
  .join('\n')}

`
    : ''
}## API Results

${formattedResults}

## Strategic Interpretation Framework
- **Cross-Reference Patterns**: What stories do successful responses tell when viewed together? Where do they converge or diverge?
- **Intelligence in Failures**: What do failed endpoints reveal about data availability, system health, or access constraints? Are these failures meaningful signals?
- **Synthesis Opportunities**: How can you triangulate partial information to build a more complete picture than any single source provides?
- **Assumption Challenges**: Which responses contradict your initial hypotheses? What blind spots do conflicting data points illuminate?
- **Quality Assessment**: Which sources demonstrate higher reliability, timeliness, or depth? How does this inform future knowledge gathering strategies?

## Next Strategic Considerations
Consider: Do you have sufficient perspective diversity? Should you explore alternative viewpoints? What patterns emerge that warrant deeper investigation?

## Performance Metrics
- **Parallel Execution**: ${maxConcurrent} concurrent requests
- **Memory Usage**: Responses limited to 5MB each
- **Timeout Handling**: ${timeoutMs}ms per request
- **Retry Logic**: Up to 2 retries with exponential backoff

---
*Generated by Iron Manus Multi-API Fetch System*`;

    return this.createResponse(responseText);
  }

  /**
   * Handles fetch errors with strategic recovery guidance
   */
  private handleFetchError(error: unknown, startTime: number): ToolResult {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const totalDuration = Date.now() - startTime;

    logger.error(`MultiAPIFetch Error: ${errorMessage}`);

    // Enhanced error handling with recovery guidance
    const errorResponse = `# ERROR Multi-API Fetch Error

**Error**: ${errorMessage}
**Duration**: ${totalDuration}ms

## Strategic Error Recovery Framework

**Diagnostic Questions to Guide Your Thinking:**

🤔 **Assumption Analysis**: What assumptions about these knowledge sources might be incorrect? Are you approaching the right endpoints for your actual information needs?

🔍 **Root Cause Investigation**: Is this a surface-level technical error, or does it reveal deeper issues with your data strategy? What might this failure be teaching you about your approach?

📊 **Pattern Recognition**: If multiple endpoints failed, what do they have in common? What does this pattern reveal about your selection criteria or the nature of your data quest?

⚖️ **Trade-off Evaluation**: Are you being too aggressive with timeouts or concurrency? What does this suggest about balancing speed vs. reliability in your knowledge gathering?

🎯 **Strategic Pivot**: Should you reconsider your knowledge sources entirely? What alternative approaches might better serve your underlying objective?

**Self-Correction Prompts:**
- What would success look like if you refined your approach?
- Are you asking the right questions of the right data sources?
- What would a domain expert do differently in this situation?

## 📖 **Usage Example**
\`\`\`json
{
  "api_endpoints": [
    "https://api.github.com/users/octocat",
    "https://jsonplaceholder.typicode.com/posts/1",
    "https://httpbin.org/get"
  ],
  "timeout_ms": 5000,
  "max_concurrent": 3,
  "headers": {
    "Authorization": "Bearer <your-api-token>"
  }
}
\`\`\`

## Built-in Protections
- **Rate Limiting**: Prevents API abuse
- **Timeout Management**: Prevents hanging requests
- **Concurrent Limiting**: Prevents overwhelming servers
- **Response Size Limits**: Prevents memory issues
- **Retry Logic**: Handles transient failures
- **Error Categorization**: Clear error reporting

**Next Action**: Call MultiAPIFetch with corrected parameters.`;

    return this.createResponse(errorResponse);
  }

  /**
   * Properly truncate JSON objects while maintaining validity
   */
  private truncateJSONObject(obj: unknown, maxChars: number): unknown {
    const jsonString = JSON.stringify(obj);

    // If the JSON string is within limits, return as-is
    if (jsonString.length <= maxChars) {
      return obj;
    }

    // If it's an array, truncate elements
    if (Array.isArray(obj)) {
      const result = [];
      let currentSize = 2; // Account for []

      for (const item of obj) {
        const itemString = JSON.stringify(item);
        if (currentSize + itemString.length + 1 > maxChars) {
          // +1 for comma
          result.push({ _truncated: `... ${obj.length - result.length} more items` });
          break;
        }
        result.push(item);
        currentSize += itemString.length + 1; // +1 for comma
      }

      return result;
    }

    // If it's an object, truncate properties
    if (typeof obj === 'object' && obj !== null) {
      const result: Record<string, unknown> = {};
      let currentSize = 2; // Account for {}
      let truncatedCount = 0;

      for (const [key, value] of Object.entries(obj)) {
        const keyString = JSON.stringify(key);
        const valueString = JSON.stringify(value);
        const pairSize = keyString.length + valueString.length + 3; // +3 for :"",

        if (currentSize + pairSize > maxChars) {
          truncatedCount = Object.keys(obj).length - Object.keys(result).length;
          break;
        }

        result[key] = value;
        currentSize += pairSize;
      }

      if (truncatedCount > 0) {
        result._truncated = `... ${truncatedCount} more properties`;
      }

      return result;
    }

    // For primitives, convert to string and truncate
    return jsonString.substring(0, maxChars) + '... [truncated]';
  }
}
