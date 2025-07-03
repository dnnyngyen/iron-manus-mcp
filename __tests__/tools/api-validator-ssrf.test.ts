/**
 * SSRF Protection Tests for API Validator Tool
 * 
 * Tests the SSRF (Server-Side Request Forgery) protection mechanisms
 * in the API Validator tool to ensure malicious URLs are blocked.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { APIValidatorTool } from '../../src/tools/api-validator.js';
import * as ssrfGuard from '../../src/security/ssrfGuard.js';

// Mock the ssrfGuard module
vi.mock('../../src/security/ssrfGuard.js', () => ({
  validateAndSanitizeURL: vi.fn(),
}));

// Mock axios to prevent actual network requests
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('APIValidatorTool SSRF Protection', () => {
  let apiValidator: APIValidatorTool;
  let mockValidateAndSanitizeURL: any;

  beforeEach(() => {
    apiValidator = new APIValidatorTool();
    mockValidateAndSanitizeURL = vi.mocked(ssrfGuard.validateAndSanitizeURL);
    vi.clearAllMocks();
  });

  describe('SSRF Attack Prevention', () => {
    it('should block localhost URLs', async () => {
      // Mock SSRF protection to block localhost
      mockValidateAndSanitizeURL.mockReturnValue(null);

      const maliciousEndpoint = {
        url: 'http://localhost:8080/admin',
        name: 'Localhost Admin',
        category: 'malicious',
      };

      const result = await apiValidator.handle({
        api_endpoint: maliciousEndpoint,
      });

      expect(mockValidateAndSanitizeURL).toHaveBeenCalledWith('http://localhost:8080/admin');
      expect(result.content[0]?.text).toContain('URL blocked by SSRF protection');
      expect(result.content[0]?.text).toContain('ERROR API Validation Failed');
    });

    it('should block private IP addresses (192.168.x.x)', async () => {
      mockValidateAndSanitizeURL.mockReturnValue(null);

      const maliciousEndpoint = {
        url: 'http://192.168.1.1/router-config',
        name: 'Router Config',
        category: 'malicious',
      };

      const result = await apiValidator.handle({
        api_endpoint: maliciousEndpoint,
      });

      expect(mockValidateAndSanitizeURL).toHaveBeenCalledWith('http://192.168.1.1/router-config');
      expect(result.content[0]?.text).toContain('URL blocked by SSRF protection');
    });

    it('should block private IP addresses (10.x.x.x)', async () => {
      mockValidateAndSanitizeURL.mockReturnValue(null);

      const maliciousEndpoint = {
        url: 'http://10.0.0.1/internal-service',
        name: 'Internal Service',
        category: 'malicious',
      };

      const result = await apiValidator.handle({
        api_endpoint: maliciousEndpoint,
      });

      expect(mockValidateAndSanitizeURL).toHaveBeenCalledWith('http://10.0.0.1/internal-service');
      expect(result.content[0]?.text).toContain('URL blocked by SSRF protection');
    });

    it('should block private IP addresses (172.16-31.x.x)', async () => {
      mockValidateAndSanitizeURL.mockReturnValue(null);

      const maliciousEndpoint = {
        url: 'http://172.16.0.1/internal-api',
        name: 'Internal API',
        category: 'malicious',
      };

      const result = await apiValidator.handle({
        api_endpoint: maliciousEndpoint,
      });

      expect(mockValidateAndSanitizeURL).toHaveBeenCalledWith('http://172.16.0.1/internal-api');
      expect(result.content[0]?.text).toContain('URL blocked by SSRF protection');
    });

    it('should block cloud metadata endpoints', async () => {
      mockValidateAndSanitizeURL.mockReturnValue(null);

      const maliciousEndpoint = {
        url: 'http://169.254.169.254/metadata/v1/',
        name: 'AWS Metadata',
        category: 'malicious',
      };

      const result = await apiValidator.handle({
        api_endpoint: maliciousEndpoint,
      });

      expect(mockValidateAndSanitizeURL).toHaveBeenCalledWith('http://169.254.169.254/metadata/v1/');
      expect(result.content[0]?.text).toContain('URL blocked by SSRF protection');
    });

    it('should block non-HTTP protocols', async () => {
      mockValidateAndSanitizeURL.mockReturnValue(null);

      const maliciousEndpoint = {
        url: 'file:///etc/passwd',
        name: 'File Protocol',
        category: 'malicious',
      };

      const result = await apiValidator.handle({
        api_endpoint: maliciousEndpoint,
      });

      expect(mockValidateAndSanitizeURL).toHaveBeenCalledWith('file:///etc/passwd');
      expect(result.content[0]?.text).toContain('URL blocked by SSRF protection');
    });
  });

  describe('Legitimate URL Handling', () => {
    it('should allow legitimate public URLs', async () => {
      // Mock successful validation and axios response
      const sanitizedUrl = 'https://api.github.com/users/octocat';
      mockValidateAndSanitizeURL.mockReturnValue(sanitizedUrl);

      const axios = await import('axios');
      const mockAxios = vi.mocked(axios.default);
      mockAxios.get.mockResolvedValue({
        status: 200,
        statusText: 'OK',
      });

      const legitimateEndpoint = {
        url: 'https://api.github.com/users/octocat',
        name: 'GitHub API',
        category: 'development',
      };

      const result = await apiValidator.handle({
        api_endpoint: legitimateEndpoint,
      });

      expect(mockValidateAndSanitizeURL).toHaveBeenCalledWith('https://api.github.com/users/octocat');
      expect(mockAxios.get).toHaveBeenCalledWith(sanitizedUrl, expect.any(Object));
      expect(result.content[0]?.text).toContain('SUCCESS API Validation Success');
    });
  });

  describe('Alternative URL Testing with SSRF Protection', () => {
    it('should validate all alternative URLs during auto-correction', async () => {
      // Mock SSRF protection to block all URLs
      mockValidateAndSanitizeURL.mockReturnValue(null);

      const endpointWithAlternatives = {
        url: 'http://localhost:8080/api/v1',
        name: 'API with Alternatives',
        category: 'test',
        endpoint_patterns: [
          'http://127.0.0.1:8080/api/v1',
          'http://192.168.1.100/api/v1',
        ],
      };

      const result = await apiValidator.handle({
        api_endpoint: endpointWithAlternatives,
        auto_correct: true,
      });

      // Should validate primary URL and all alternatives
      expect(mockValidateAndSanitizeURL).toHaveBeenCalledTimes(3);
      expect(mockValidateAndSanitizeURL).toHaveBeenCalledWith('http://localhost:8080/api/v1');
      expect(mockValidateAndSanitizeURL).toHaveBeenCalledWith('http://127.0.0.1:8080/api/v1');
      expect(mockValidateAndSanitizeURL).toHaveBeenCalledWith('http://192.168.1.100/api/v1');

      expect(result.content[0]?.text).toContain('ERROR API Validation Failed');
      expect(result.content[0]?.text).toContain('All Endpoints Failed');
    });

    it('should stop at first valid alternative URL', async () => {
      // Mock SSRF protection to block first two URLs but allow third
      mockValidateAndSanitizeURL
        .mockReturnValueOnce(null) // Block primary
        .mockReturnValueOnce(null) // Block first alternative
        .mockReturnValueOnce('https://api.example.com/v1'); // Allow second alternative

      const axios = await import('axios');
      const mockAxios = vi.mocked(axios.default);
      mockAxios.get.mockResolvedValue({
        status: 200,
        statusText: 'OK',
      });

      const endpointWithAlternatives = {
        url: 'http://localhost:8080/api/v1',
        name: 'API with Alternatives',
        category: 'test',
        endpoint_patterns: [
          'http://127.0.0.1:8080/api/v1',
          'https://api.example.com/v1',
        ],
      };

      const result = await apiValidator.handle({
        api_endpoint: endpointWithAlternatives,
        auto_correct: true,
      });

      // Should validate primary and first two alternatives, then succeed
      expect(mockValidateAndSanitizeURL).toHaveBeenCalledTimes(3);
      expect(mockAxios.get).toHaveBeenCalledWith('https://api.example.com/v1', expect.any(Object));
      expect(result.content[0]?.text).toContain('INFO API Endpoint Auto-Corrected');
    });
  });

  describe('Error Message Quality', () => {
    it('should provide clear error messages for blocked URLs', async () => {
      mockValidateAndSanitizeURL.mockReturnValue(null);

      const maliciousEndpoint = {
        url: 'http://localhost:22/ssh-config',
        name: 'SSH Config',
        category: 'malicious',
      };

      const result = await apiValidator.handle({
        api_endpoint: maliciousEndpoint,
      });

      const errorMessage = result.content[0]?.text as string;
      
      expect(errorMessage).toContain('ERROR API Validation Failed');
      expect(errorMessage).toContain('URL blocked by SSRF protection');
      expect(errorMessage).toContain('invalid or dangerous URL');
      expect(errorMessage).toContain('Recommended Actions');
      expect(errorMessage).toContain('Check API Status');
    });
  });
});