// Configuration validation tests
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CONFIG, validateConfig } from '../src/config.js';

describe('Configuration Management', () => {
  let originalEnv: Record<string, string | undefined>;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    // Restore original environment
    Object.keys(process.env).forEach(key => {
      delete process.env[key];
    });
    Object.assign(process.env, originalEnv);
  });

  it('should use default values when env vars are not set', () => {
    // Clear relevant env vars
    delete process.env.KNOWLEDGE_MAX_CONCURRENCY;
    delete process.env.KNOWLEDGE_TIMEOUT_MS;
    
    expect(CONFIG.KNOWLEDGE_MAX_CONCURRENCY).toBe(2);
    expect(CONFIG.KNOWLEDGE_TIMEOUT_MS).toBe(4000);
    expect(CONFIG.AUTO_CONNECTION_ENABLED).toBe(true);
  });

  it('should override defaults with environment variables', () => {
    process.env.KNOWLEDGE_MAX_CONCURRENCY = '5';
    process.env.KNOWLEDGE_TIMEOUT_MS = '8000';
    process.env.AUTO_CONNECTION_ENABLED = 'false';
    
    // Re-import to get updated config
    delete require.cache[require.resolve('../src/config.js')];
    const { CONFIG: updatedConfig } = require('../src/config.js');
    
    expect(updatedConfig.KNOWLEDGE_MAX_CONCURRENCY).toBe(5);
    expect(updatedConfig.KNOWLEDGE_TIMEOUT_MS).toBe(8000);
    expect(updatedConfig.AUTO_CONNECTION_ENABLED).toBe(false);
  });

  it('should validate configuration correctly', () => {
    const validation = validateConfig();
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it('should detect invalid configuration', () => {
    // Test with invalid values by mocking CONFIG
    const invalidConfig = {
      ...CONFIG,
      KNOWLEDGE_MAX_CONCURRENCY: 15, // Too high
      KNOWLEDGE_TIMEOUT_MS: 500, // Too low
      VERIFICATION_COMPLETION_THRESHOLD: 150, // Invalid percentage
    };

    // Mock the CONFIG for validation
    const originalConfig = { ...CONFIG };
    Object.assign(CONFIG as any, invalidConfig);

    const validation = validateConfig();
    expect(validation.valid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);

    // Restore original config
    Object.assign(CONFIG as any, originalConfig);
  });

  it('should parse ALLOWED_HOSTS correctly', () => {
    process.env.ALLOWED_HOSTS = 'api.example.com,*.github.com,httpbin.org';
    
    delete require.cache[require.resolve('../src/config.js')];
    const { CONFIG: updatedConfig } = require('../src/config.js');
    
    expect(updatedConfig.ALLOWED_HOSTS).toEqual([
      'api.example.com',
      '*.github.com', 
      'httpbin.org'
    ]);
  });

  it('should handle empty ALLOWED_HOSTS', () => {
    process.env.ALLOWED_HOSTS = '';
    
    delete require.cache[require.resolve('../src/config.js')];
    const { CONFIG: updatedConfig } = require('../src/config.js');
    
    expect(updatedConfig.ALLOWED_HOSTS).toEqual([]);
  });
});