/**
 * Shared API Fetching Utility
 * Centralized HTTP request logic with rate limiting, retries, and SSRF protection
 */

import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { rateLimiter, SAMPLE_API_REGISTRY } from '../core/api-registry.js';
import { validateAndSanitizeURL } from '../security/ssrfGuard.js';
import { CONFIG } from '../config.js';
import logger from './logger.js';

/**
 * Semaphore class for limiting concurrent operations
 */
export class Semaphore {
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
 * Result from API fetch operation
 */
export interface FetchResult {
  endpoint: string;
  index: number;
  success: boolean;
  status: number;
  statusText: string;
  headers: Record<string, unknown>;
  data: unknown;
  size: number;
  duration: number;
  error: { type: string; message: string; code: string } | null;
  corrected?: boolean;
}

/**
 * Configuration options for API fetching
 */
export interface APIFetchConfig {
  timeout: number;
  maxConcurrent: number;
  headers: Record<string, string>;
  maxContentLength: number;
  maxRetries: number;
  retryDelay: number;
}

/**
 * Default configuration for API fetching
 */
export const DEFAULT_API_FETCH_CONFIG: APIFetchConfig = {
  timeout: 5000,
  maxConcurrent: 3,
  headers: {},
  maxContentLength: 5 * 1024 * 1024, // 5MB
  maxRetries: 2,
  retryDelay: 500,
};

/**
 * Unified API Fetcher
 * Provides consistent HTTP request handling across all API tools
 */
export class APIFetcher {
  private config: APIFetchConfig;
  private semaphore: Semaphore;
  private axiosInstance: AxiosInstance;

  constructor(config: Partial<APIFetchConfig> = {}) {
    this.config = { ...DEFAULT_API_FETCH_CONFIG, ...config };
    this.semaphore = new Semaphore(this.config.maxConcurrent);
    this.axiosInstance = this.createAxiosInstance();
  }

  /**
   * Creates configured axios instance
   */
  private createAxiosInstance(): AxiosInstance {
    return axios.create({
      timeout: this.config.timeout,
      headers: {
        'User-Agent': CONFIG.USER_AGENT,
        Accept: 'application/json, text/plain, */*',
        ...this.config.headers,
      },
      maxContentLength: this.config.maxContentLength,
      maxBodyLength: this.config.maxContentLength,
    });
  }

  /**
   * Fetch single API endpoint with retry logic and error handling
   */
  async fetchSingle(
    endpoint: string,
    index: number = 0,
    maxTruncateChars: number = 10000
  ): Promise<FetchResult> {
    await this.semaphore.acquire();
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
      let attemptedUrls = [endpoint];

      // If primary endpoint fails and we have alternatives, try them
      if (registryAPI?.endpoint_patterns) {
        attemptedUrls = [endpoint, ...registryAPI.endpoint_patterns.filter(p => p !== endpoint)];
      }

      for (const currentUrl of attemptedUrls) {
        for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
          try {
            if (attempt > 0) {
              // Exponential backoff
              const delay = this.config.retryDelay * Math.pow(2, attempt - 1);
              await new Promise(resolve => setTimeout(resolve, delay));
            }

            // SSRF Protection: Validate and sanitize URL before making request
            const sanitizedUrl = validateAndSanitizeURL(currentUrl);
            if (!sanitizedUrl) {
              throw new Error(`URL blocked by SSRF protection: ${currentUrl}`);
            }

            const response = await this.axiosInstance.get(sanitizedUrl);
            const duration = Date.now() - startTime;

            // Sanitize response data
            let sanitizedData = response.data;
            if (typeof sanitizedData === 'string' && sanitizedData.length > maxTruncateChars) {
              sanitizedData = sanitizedData.substring(0, maxTruncateChars) + '... [truncated]';
            } else if (typeof sanitizedData === 'object' && sanitizedData !== null) {
              sanitizedData = this.truncateJSONObject(sanitizedData, maxTruncateChars);
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
        errorMessage = `Request timeout after ${this.config.timeout}ms`;
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
      this.semaphore.release();
    }
  }

  /**
   * Fetch multiple API endpoints in parallel
   */
  async fetchMultiple(
    endpoints: string[],
    maxTruncateChars: number = 10000
  ): Promise<FetchResult[]> {
    // Execute all requests in parallel with Promise.allSettled
    const results = await Promise.allSettled(
      endpoints.map((endpoint, index) => this.fetchSingle(endpoint, index, maxTruncateChars))
    );

    // Process results and return API results
    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          endpoint: endpoints[index],
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
   * Test endpoint health (for validation)
   */
  async testEndpoint(endpoint: string): Promise<{
    isHealthy: boolean;
    status: number;
    responseTime: number;
    error?: string;
    suggestion?: string;
  }> {
    const startTime = Date.now();

    try {
      const result = await this.fetchSingle(endpoint, 0, 100); // Small response for testing

      return {
        isHealthy: result.success,
        status: result.status,
        responseTime: result.duration,
        error: result.error?.message,
        suggestion: result.corrected ? `Consider using: ${result.endpoint}` : undefined,
      };
    } catch (error) {
      return {
        isHealthy: false,
        status: 0,
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
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

/**
 * Create a configured API fetcher instance
 */
export function createAPIFetcher(config: Partial<APIFetchConfig> = {}): APIFetcher {
  return new APIFetcher(config);
}
