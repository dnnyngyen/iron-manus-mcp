/**
 * Multi-API Fetch Tool
 * Extracted from index.ts to provide modular tool architecture
 */

import { BaseTool, ToolSchema, ToolResult } from './base-tool.js';
import axios, { AxiosError } from 'axios';
import { rateLimiter, SAMPLE_API_REGISTRY } from '../core/api-registry.js';

export interface MultiAPIFetchArgs {
  api_endpoints: string[];
  timeout_ms?: number;
  max_concurrent?: number;
  headers?: Record<string, string>;
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
    'Parallel HTTP requests to multiple APIs with timeout management and response aggregation - fetches data from selected APIs simultaneously for efficient knowledge gathering';

  readonly inputSchema: ToolSchema = {
    type: 'object',
    properties: {
      api_endpoints: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of API URLs to fetch from',
      },
      timeout_ms: {
        type: 'number',
        description: 'Request timeout in milliseconds (default: 5000)',
      },
      max_concurrent: {
        type: 'number',
        description: 'Maximum concurrent requests (default: 3)',
      },
      headers: {
        type: 'object',
        description: 'Optional headers to include in requests',
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
      this.validateArgs(args);

      // Validate required parameters
      if (!args.api_endpoints || !Array.isArray(args.api_endpoints)) {
        throw new Error('api_endpoints is required and must be an array of URLs');
      }

      if (args.api_endpoints.length === 0) {
        throw new Error('api_endpoints array cannot be empty');
      }

      if (args.api_endpoints.length > 10) {
        throw new Error('Maximum 10 API endpoints allowed per request');
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
      const timeoutMs = args.timeout_ms ?? 5000;
      if (typeof timeoutMs !== 'number' || timeoutMs < 1000 || timeoutMs > 30000) {
        throw new Error('timeout_ms must be a number between 1000 and 30000');
      }

      const maxConcurrent = args.max_concurrent ?? 3;
      if (typeof maxConcurrent !== 'number' || maxConcurrent < 1 || maxConcurrent > 5) {
        throw new Error('max_concurrent must be a number between 1 and 5');
      }

      const headers = args.headers || {};
      if (typeof headers !== 'object' || Array.isArray(headers)) {
        throw new Error('headers must be an object');
      }

      // Create semaphore for concurrent request limiting
      const semaphore = new Semaphore(maxConcurrent);

      // Create axios instance with default config
      const axiosInstance = axios.create({
        timeout: timeoutMs,
        headers: {
          'User-Agent': 'Iron-Manus-MCP/0.2.1',
          Accept: 'application/json, text/plain, */*',
          ...headers,
        },
        maxContentLength: 1024 * 1024 * 5, // 5MB limit
        maxBodyLength: 1024 * 1024 * 5,
      });

      // Function to fetch a single API with rate limiting and error handling
      const fetchAPI = async (endpoint: string, index: number) => {
        await semaphore.acquire();

        try {
          const startTime = Date.now();

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
            attemptedUrls = [
              endpoint,
              ...registryAPI.endpoint_patterns.filter(p => p !== endpoint),
            ];
          }

          for (const currentUrl of attemptedUrls) {
            for (let attempt = 0; attempt <= maxRetries; attempt++) {
              try {
                if (attempt > 0) {
                  // Exponential backoff: 500ms, 1000ms
                  const delay = 500 * Math.pow(2, attempt - 1);
                  await new Promise(resolve => setTimeout(resolve, delay));
                }

                const response = await axiosInstance.get(currentUrl);
                const duration = Date.now() - startTime;

                // Sanitize response data
                let sanitizedData = response.data;
                if (typeof sanitizedData === 'string' && sanitizedData.length > 10000) {
                  sanitizedData = sanitizedData.substring(0, 10000) + '... [truncated]';
                } else if (typeof sanitizedData === 'object' && sanitizedData !== null) {
                  // Properly truncate JSON objects while maintaining validity
                  sanitizedData = this.truncateJSONObject(sanitizedData, 10000);
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
            errorType = 'Request';
            errorMessage = error.message;
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

      // Process results
      const apiResults = results.map((result, index) => {
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

## Integration Guidance
- **Successful APIs**: Use the returned data for your application logic
- **Failed APIs**: Check error types and implement appropriate retry logic
- **Rate Limiting**: Some APIs may have been rate-limited; retry later if needed
- **Data Sanitization**: Large responses have been truncated for readability

## Performance Metrics
- **Parallel Execution**: ${maxConcurrent} concurrent requests
- **Memory Usage**: Responses limited to 5MB each
- **Timeout Handling**: ${timeoutMs}ms per request
- **Retry Logic**: Up to 2 retries with exponential backoff

---
*Generated by Iron Manus Multi-API Fetch System*`;

      return this.createResponse(responseText);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const totalDuration = Date.now() - startTime;

      console.error(`MultiAPIFetch Error: ${errorMessage}`);

      // Enhanced error handling with recovery guidance
      const errorResponse = `# ERROR Multi-API Fetch Error

**Error**: ${errorMessage}
**Duration**: ${totalDuration}ms

## Recovery Protocol
1. **API Endpoints**: Ensure all URLs are valid and accessible
   - Must be valid HTTP/HTTPS URLs
   - Maximum 10 endpoints per request
   - Each endpoint must be a string

2. **Timeout**: Optional timeout in milliseconds (1000-30000, default: 5000)

3. **Concurrency**: Optional max concurrent requests (1-5, default: 3)

4. **Headers**: Optional object with custom headers

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
  }

  /**
   * Properly truncate JSON objects while maintaining validity
   */
  private truncateJSONObject(obj: any, maxChars: number): any {
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
      const result: any = {};
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
