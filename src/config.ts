// Configuration layer - centralizes all environment variables and magic numbers
export const CONFIG = {
  // Knowledge phase configuration
  KNOWLEDGE_MAX_CONCURRENCY: parseInt(process.env.KNOWLEDGE_MAX_CONCURRENCY || '2'),
  KNOWLEDGE_TIMEOUT_MS: parseInt(process.env.KNOWLEDGE_TIMEOUT_MS || '4000'),
  KNOWLEDGE_CONFIDENCE_THRESHOLD: parseFloat(process.env.KNOWLEDGE_CONFIDENCE_THRESHOLD || '0.4'),
  KNOWLEDGE_MAX_RESPONSE_SIZE: parseInt(process.env.KNOWLEDGE_MAX_RESPONSE_SIZE || '5000'),
  
  // Auto-connection configuration
  AUTO_CONNECTION_ENABLED: process.env.AUTO_CONNECTION_ENABLED !== 'false',
  
  // Rate limiting configuration
  RATE_LIMIT_REQUESTS_PER_MINUTE: parseInt(process.env.RATE_LIMIT_REQUESTS_PER_MINUTE || '5'),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
  
  // Content limits
  MAX_CONTENT_LENGTH: parseInt(process.env.MAX_CONTENT_LENGTH || String(1024 * 1024 * 2)), // 2MB
  MAX_BODY_LENGTH: parseInt(process.env.MAX_BODY_LENGTH || String(1024 * 1024 * 2)), // 2MB
  
  // Performance thresholds
  VERIFICATION_COMPLETION_THRESHOLD: parseInt(process.env.VERIFICATION_COMPLETION_THRESHOLD || '95'),
  EXECUTION_SUCCESS_RATE_THRESHOLD: parseFloat(process.env.EXECUTION_SUCCESS_RATE_THRESHOLD || '0.7'),
  
  // Reasoning effectiveness
  INITIAL_REASONING_EFFECTIVENESS: parseFloat(process.env.INITIAL_REASONING_EFFECTIVENESS || '0.8'),
  MIN_REASONING_EFFECTIVENESS: parseFloat(process.env.MIN_REASONING_EFFECTIVENESS || '0.3'),
  MAX_REASONING_EFFECTIVENESS: parseFloat(process.env.MAX_REASONING_EFFECTIVENESS || '1.0'),
  
  // Security configuration
  ALLOWED_HOSTS: (process.env.ALLOWED_HOSTS || '').split(',').filter(Boolean),
  ENABLE_SSRF_PROTECTION: process.env.ENABLE_SSRF_PROTECTION !== 'false',
  
  // User agent
  USER_AGENT: process.env.USER_AGENT || 'Iron-Manus-MCP/1.0.0-AutoFetch',
} as const;

// Validation function to ensure configuration is valid
export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (CONFIG.KNOWLEDGE_MAX_CONCURRENCY < 1 || CONFIG.KNOWLEDGE_MAX_CONCURRENCY > 10) {
    errors.push('KNOWLEDGE_MAX_CONCURRENCY must be between 1 and 10');
  }
  
  if (CONFIG.KNOWLEDGE_TIMEOUT_MS < 1000 || CONFIG.KNOWLEDGE_TIMEOUT_MS > 30000) {
    errors.push('KNOWLEDGE_TIMEOUT_MS must be between 1000 and 30000');
  }
  
  if (CONFIG.KNOWLEDGE_CONFIDENCE_THRESHOLD < 0 || CONFIG.KNOWLEDGE_CONFIDENCE_THRESHOLD > 1) {
    errors.push('KNOWLEDGE_CONFIDENCE_THRESHOLD must be between 0 and 1');
  }
  
  if (CONFIG.VERIFICATION_COMPLETION_THRESHOLD < 50 || CONFIG.VERIFICATION_COMPLETION_THRESHOLD > 100) {
    errors.push('VERIFICATION_COMPLETION_THRESHOLD must be between 50 and 100');
  }
  
  if (CONFIG.EXECUTION_SUCCESS_RATE_THRESHOLD < 0 || CONFIG.EXECUTION_SUCCESS_RATE_THRESHOLD > 1) {
    errors.push('EXECUTION_SUCCESS_RATE_THRESHOLD must be between 0 and 1');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}