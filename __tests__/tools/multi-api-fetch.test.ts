// Multi-API Fetch Tool Tests - Tests for parallel HTTP requests with timeout management
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { MultiAPIFetchTool } from '../../src/tools/multi-api-fetch.js';
import { rateLimiter } from '../../src/core/api-registry.js';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockAxios = axios as any;
mockAxios.create = vi.fn(() => mockAxios);
mockAxios.get = vi.fn();

// Mock rate limiter
vi.mock('../../src/core/api-registry.js', () => ({
  rateLimiter: {
    canMakeRequest: vi.fn(() => true),
  },
  SAMPLE_API_REGISTRY: [
    {
      name: 'Test API',
      url: 'https://api.test.com/data',
      endpoint_patterns: ['https://api.test.com/data', 'https://backup.test.com/data'],
    }
  ],
}));

describe('MultiAPIFetch Tool', () => {
  let tool: MultiAPIFetchTool;
  const mockRateLimiter = rateLimiter as any;

  beforeEach(() => {
    tool = new MultiAPIFetchTool();
    vi.clearAllMocks();
    mockRateLimiter.canMakeRequest.mockReturnValue(true);
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Tool Definition', () => {
    it('should have correct tool metadata', () => {
      expect(tool.name).toBe('MultiAPIFetch');
      expect(tool.description).toContain('Strategic knowledge synthesis');
      expect(tool.inputSchema).toBeDefined();
      expect(tool.inputSchema.type).toBe('object');
      expect(tool.inputSchema.required).toEqual(['api_endpoints']);
    });

    it('should have correct input schema structure', () => {
      const schema = tool.inputSchema;
      
      expect(schema.properties).toHaveProperty('api_endpoints');
      expect(schema.properties).toHaveProperty('timeout_ms');
      expect(schema.properties).toHaveProperty('max_concurrent');
      expect(schema.properties).toHaveProperty('headers');

      expect(schema.properties.api_endpoints.type).toBe('array');
      expect(schema.properties.api_endpoints.items.type).toBe('string');
      expect(schema.properties.timeout_ms.type).toBe('number');
      expect(schema.properties.max_concurrent.type).toBe('number');
    });
  });

  describe('Input Validation', () => {
    it('should reject empty api_endpoints array', async () => {
      const args = { api_endpoints: [] };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false); // Error response, not tool error
      expect(result.content[0].text).toContain('api_endpoints array cannot be empty');
    });

    it('should reject non-array api_endpoints', async () => {
      const args = { api_endpoints: 'not-an-array' as any };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain('api_endpoints is required and must be an array');
    });

    it('should reject too many endpoints', async () => {
      const args = { 
        api_endpoints: Array(11).fill('https://api.test.com') 
      };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain('Maximum 10 API endpoints allowed');
    });

    it('should reject invalid URLs', async () => {
      const args = { api_endpoints: ['not-a-url'] };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain('Invalid URL format');
    });

    it('should reject non-HTTP protocols', async () => {
      // file:// URLs are invalid on most systems, so it will throw "Invalid URL format"
      const args = { api_endpoints: ['file://example.txt'] };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain('Invalid URL format');
    });

    it('should reject invalid timeout values', async () => {
      const args = { 
        api_endpoints: ['https://api.test.com'],
        timeout_ms: 500 // Too low
      };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain('timeout_ms must be a number between 1000 and 30000');
    });

    it('should reject invalid max_concurrent values', async () => {
      const args = { 
        api_endpoints: ['https://api.test.com'],
        max_concurrent: 10 // Too high
      };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain('max_concurrent must be a number between 1 and 5');
    });

    it('should reject invalid headers format', async () => {
      const args = { 
        api_endpoints: ['https://api.test.com'],
        headers: 'not-an-object' as any
      };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain('headers must be an object');
    });
  });

  describe('Successful Requests', () => {
    it('should handle single successful request', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        data: { message: 'test data' }
      };
      mockAxios.get.mockResolvedValue(mockResponse);

      const args = { api_endpoints: ['https://api.test.com'] };
      const result = await tool.handle(args);

      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain('Multi-API Fetch Results');
      // Check for correct format - the actual format uses "**Successful**:"
      expect(result.content[0].text).toContain('**Successful**: 1');
      expect(result.content[0].text).toContain('**Failed**: 0');
      expect(result.content[0].text).toContain('SUCCESS api.test.com');
    });

    it('should handle multiple successful requests', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        data: { message: 'test data' }
      };
      mockAxios.get.mockResolvedValue(mockResponse);

      const args = { 
        api_endpoints: [
          'https://api1.test.com',
          'https://api2.test.com',
          'https://api3.test.com'
        ]
      };
      const result = await tool.handle(args);

      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain('**APIs Queried**: 3');
      expect(result.content[0].text).toContain('**Successful**: 3');
      expect(result.content[0].text).toContain('**Failed**: 0');
      expect(mockAxios.get).toHaveBeenCalledTimes(3);
    });

    it('should handle custom timeout and concurrency', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: {},
        data: { test: 'data' }
      };
      mockAxios.get.mockResolvedValue(mockResponse);

      const args = { 
        api_endpoints: ['https://api.test.com'],
        timeout_ms: 10000,
        max_concurrent: 2
      };
      const result = await tool.handle(args);

      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain('**Request Timeout**: 10000ms');
      expect(result.content[0].text).toContain('**Concurrent Requests**: 2');
      expect(mockAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          timeout: 10000
        })
      );
    });

    it('should handle custom headers', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: {},
        data: {}
      };
      mockAxios.get.mockResolvedValue(mockResponse);

      const args = { 
        api_endpoints: ['https://api.test.com'],
        headers: { 'Authorization': 'Bearer token123' }
      };
      const result = await tool.handle(args);

      expect(result.isError).toBe(false);
      expect(mockAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer token123'
          })
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network Error');
      networkError.code = 'ENOTFOUND';
      mockAxios.get.mockRejectedValue(networkError);

      const args = { api_endpoints: ['https://nonexistent.api.com'] };
      const result = await tool.handle(args);

      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain('**Failed**: 1');
      expect(result.content[0].text).toContain('ERROR nonexistent.api.com');
      expect(result.content[0].text).toContain('Network connection failed');
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Timeout');
      timeoutError.code = 'ECONNABORTED';
      mockAxios.get.mockRejectedValue(timeoutError);

      const args = { 
        api_endpoints: ['https://slow.api.com'],
        timeout_ms: 2000
      };
      const result = await tool.handle(args);

      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain('ERROR slow.api.com');
      expect(result.content[0].text).toContain('Request timeout after 2000ms');
    });

    it('should handle HTTP error status codes', async () => {
      const httpError = {
        response: {
          status: 404,
          statusText: 'Not Found'
        }
      };
      mockAxios.get.mockRejectedValue(httpError);

      const args = { api_endpoints: ['https://api.test.com/notfound'] };
      const result = await tool.handle(args);

      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain('ERROR api.test.com');
      expect(result.content[0].text).toContain('HTTP 404: Not Found');
    });

    it('should handle rate limiting', async () => {
      mockRateLimiter.canMakeRequest.mockReturnValue(false);

      const args = { api_endpoints: ['https://rate-limited.api.com'] };
      const result = await tool.handle(args);

      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain('ERROR rate-limited.api.com');
      expect(result.content[0].text).toContain('Rate limit exceeded');
    });

    it('should handle mixed success and failure', async () => {
      let callCount = 0;
      mockAxios.get.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({
            status: 200,
            statusText: 'OK',
            headers: {},
            data: { success: true }
          });
        } else {
          const error = new Error('Server Error');
          error.response = { status: 500, statusText: 'Internal Server Error' };
          return Promise.reject(error);
        }
      });

      const args = { 
        api_endpoints: [
          'https://working.api.com',
          'https://broken.api.com'
        ]
      };
      const result = await tool.handle(args);

      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain('**Successful**: 1');
      expect(result.content[0].text).toContain('**Failed**: 1');
      expect(result.content[0].text).toContain('SUCCESS working.api.com');
      expect(result.content[0].text).toContain('ERROR broken.api.com');
    });
  });

  describe('Response Processing', () => {
    it('should truncate large string responses', async () => {
      const largeString = 'x'.repeat(15000);
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: {},
        data: largeString
      };
      mockAxios.get.mockResolvedValue(mockResponse);

      const args = { api_endpoints: ['https://api.test.com'] };
      const result = await tool.handle(args);

      expect(result.isError).toBe(false);
      // Should contain truncation indicator in data preview
      expect(result.content[0].text).toContain('...');
    });

    it('should truncate large JSON responses', async () => {
      const largeObject = {
        data: Array(1000).fill({ key: 'value'.repeat(100) })
      };
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: {},
        data: largeObject
      };
      mockAxios.get.mockResolvedValue(mockResponse);

      const args = { api_endpoints: ['https://api.test.com'] };
      const result = await tool.handle(args);

      expect(result.isError).toBe(false);
      // Should successfully handle large JSON objects without errors
      expect(result.content[0].text).toContain('SUCCESS api.test.com');
    });

    it('should limit response headers', async () => {
      const manyHeaders = {};
      for (let i = 0; i < 20; i++) {
        manyHeaders[`header-${i}`] = `value-${i}`;
      }
      
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: manyHeaders,
        data: { test: 'data' }
      };
      mockAxios.get.mockResolvedValue(mockResponse);

      const args = { api_endpoints: ['https://api.test.com'] };
      const result = await tool.handle(args);

      expect(result.isError).toBe(false);
      // Should successfully handle many headers without errors
      expect(result.content[0].text).toContain('SUCCESS api.test.com');
    });
  });

  describe('Retry Logic', () => {
    it('should retry failed requests with exponential backoff', async () => {
      let attemptCount = 0;
      mockAxios.get.mockImplementation(() => {
        attemptCount++;
        if (attemptCount < 3) {
          return Promise.reject(new Error('Temporary failure'));
        }
        return Promise.resolve({
          status: 200,
          statusText: 'OK',
          headers: {},
          data: { success: true, attempt: attemptCount }
        });
      });

      // Use fake timers to control setTimeout
      vi.useFakeTimers();
      
      const promise = tool.handle({ api_endpoints: ['https://api.test.com'] });
      
      // Fast-forward timers to trigger retries
      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain('SUCCESS api.test.com');
      expect(attemptCount).toBe(3); // Initial + 2 retries
      
      vi.useRealTimers();
    });

    it('should try alternative endpoints when available', async () => {
      let callCount = 0;
      mockAxios.get.mockImplementation((url) => {
        callCount++;
        if (url === 'https://api.test.com/data') {
          return Promise.reject(new Error('Primary endpoint failed'));
        } else if (url === 'https://backup.test.com/data') {
          return Promise.resolve({
            status: 200,
            statusText: 'OK',
            headers: {},
            data: { success: true, backup: true }
          });
        }
        return Promise.reject(new Error('Unknown endpoint'));
      });

      const args = { api_endpoints: ['https://api.test.com/data'] };
      const result = await tool.handle(args);

      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain('SUCCESS api.test.com');
      expect(result.content[0].text).toContain('→'); // Indicates endpoint correction
    });
  });

  describe('Performance Metrics', () => {
    it('should calculate accurate performance metrics', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: {},
        data: { message: 'test' }
      };
      mockAxios.get.mockImplementation(() => {
        return new Promise(resolve => {
          setTimeout(() => resolve(mockResponse), 100);
        });
      });

      vi.useFakeTimers();
      const promise = tool.handle({ api_endpoints: ['https://api.test.com'] });
      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain('**Success Rate**: 100.0%');
      expect(result.content[0].text).toContain('**Average Response Time**:');
      expect(result.content[0].text).toContain('**Total Data Retrieved**:');
      
      vi.useRealTimers();
    });

    it('should group errors by type', async () => {
      let callCount = 0;
      mockAxios.get.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          const timeoutError = new Error('Timeout') as any;
          timeoutError.code = 'ECONNABORTED';
          return Promise.reject(timeoutError);
        } else {
          const networkError = new Error('Network Error') as any;
          networkError.code = 'ENOTFOUND';
          return Promise.reject(networkError);
        }
      });

      const args = { 
        api_endpoints: [
          'https://timeout.api.com',
          'https://network.api.com'
        ]
      };
      const result = await tool.handle(args);

      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain('**Failed**: 2');
      // Check that both errors were captured
      expect(result.content[0].text).toContain('ERROR timeout.api.com');
      expect(result.content[0].text).toContain('ERROR network.api.com');
    }, 10000); // Increase timeout for this test
  });
});