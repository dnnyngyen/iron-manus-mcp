/**
 * @fileoverview Centralized configuration layer for the Iron Manus MCP system.
 * 
 * This module provides a unified configuration interface that consolidates all environment
 * variables, system defaults, and runtime parameters. It serves as the single source of
 * truth for system behavior across all components including FSM orchestration, API
 * integrations, security policies, and performance tuning.
 * 
 * The configuration is organized into logical sections:
 * - Knowledge phase settings for API orchestration and data processing
 * - Connection and networking parameters
 * - Rate limiting and resource management
 * - Content size restrictions and security boundaries
 * - Performance thresholds and quality metrics
 * - Reasoning effectiveness parameters for cognitive enhancement
 * - Security policies and host validation
 * - User agent configuration for external service identification
 * 
 * All settings support environment variable overrides while providing sensible defaults
 * for development and production environments.
 * 
 * @module config
 */

/**
 * Centralized configuration object containing all system settings and defaults.
 * 
 * This configuration drives the behavior of the entire Iron Manus MCP system,
 * from FSM orchestration to API integrations and security policies.
 * 
 * @constant {Object} CONFIG - Immutable configuration object
 */
export const CONFIG = {
  // Knowledge phase configuration - Controls API orchestration and data processing
  
  /** 
   * Maximum number of concurrent API requests during knowledge gathering phase.
   * Higher values increase throughput but may overwhelm APIs or hit rate limits.
   * @type {number}
   * @default 2
   * @env KNOWLEDGE_MAX_CONCURRENCY
   */
  KNOWLEDGE_MAX_CONCURRENCY: parseInt(process.env.KNOWLEDGE_MAX_CONCURRENCY || '2'),
  
  /** 
   * Timeout for individual API requests in milliseconds.
   * Prevents hanging requests from blocking the knowledge gathering process.
   * @type {number}
   * @default 4000
   * @env KNOWLEDGE_TIMEOUT_MS
   */
  KNOWLEDGE_TIMEOUT_MS: parseInt(process.env.KNOWLEDGE_TIMEOUT_MS || '4000'),
  
  /** 
   * Minimum confidence threshold for accepting API responses.
   * Responses below this threshold are considered unreliable and may be discarded.
   * @type {number}
   * @default 0.4
   * @env KNOWLEDGE_CONFIDENCE_THRESHOLD
   */
  KNOWLEDGE_CONFIDENCE_THRESHOLD: parseFloat(process.env.KNOWLEDGE_CONFIDENCE_THRESHOLD || '0.4'),
  
  /** 
   * Maximum response size in characters for API responses.
   * Prevents oversized responses from consuming excessive memory or processing time.
   * @type {number}
   * @default 5000
   * @env KNOWLEDGE_MAX_RESPONSE_SIZE
   */
  KNOWLEDGE_MAX_RESPONSE_SIZE: parseInt(process.env.KNOWLEDGE_MAX_RESPONSE_SIZE || '5000'),
  
  // Auto-connection configuration - Controls automatic service connections
  
  /** 
   * Enables automatic connection to external services during initialization.
   * When disabled, connections must be established manually.
   * @type {boolean}
   * @default true
   * @env AUTO_CONNECTION_ENABLED
   */
  AUTO_CONNECTION_ENABLED: process.env.AUTO_CONNECTION_ENABLED !== 'false',
  
  // Rate limiting configuration - Prevents API abuse and ensures fair usage
  
  /** 
   * Maximum number of requests allowed per minute for rate limiting.
   * Protects against excessive API usage and ensures compliance with service limits.
   * @type {number}
   * @default 5
   * @env RATE_LIMIT_REQUESTS_PER_MINUTE
   */
  RATE_LIMIT_REQUESTS_PER_MINUTE: parseInt(process.env.RATE_LIMIT_REQUESTS_PER_MINUTE || '5'),
  
  /** 
   * Time window in milliseconds for rate limiting calculations.
   * Defines the sliding window period for request count tracking.
   * @type {number}
   * @default 60000
   * @env RATE_LIMIT_WINDOW_MS
   */
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
  
  // Content limits - Security boundaries for data processing
  
  /** 
   * Maximum content length in bytes for incoming requests.
   * Prevents memory exhaustion from oversized payloads.
   * @type {number}
   * @default 2097152 (2MB)
   * @env MAX_CONTENT_LENGTH
   */
  MAX_CONTENT_LENGTH: parseInt(process.env.MAX_CONTENT_LENGTH || String(1024 * 1024 * 2)), // 2MB
  
  /** 
   * Maximum body length in bytes for HTTP requests.
   * Complements MAX_CONTENT_LENGTH for specific HTTP body size restrictions.
   * @type {number}
   * @default 2097152 (2MB)
   * @env MAX_BODY_LENGTH
   */
  MAX_BODY_LENGTH: parseInt(process.env.MAX_BODY_LENGTH || String(1024 * 1024 * 2)), // 2MB
  
  // Performance thresholds - Quality metrics and success criteria
  
  /** 
   * Minimum completion percentage required for verification phase success.
   * Tasks below this threshold are considered incomplete and may trigger retries.
   * @type {number}
   * @default 95
   * @env VERIFICATION_COMPLETION_THRESHOLD
   */
  VERIFICATION_COMPLETION_THRESHOLD: parseInt(process.env.VERIFICATION_COMPLETION_THRESHOLD || '95'),
  
  /** 
   * Minimum success rate required for execution phase completion.
   * Lower rates indicate systematic issues that may require intervention.
   * @type {number}
   * @default 0.7
   * @env EXECUTION_SUCCESS_RATE_THRESHOLD
   */
  EXECUTION_SUCCESS_RATE_THRESHOLD: parseFloat(process.env.EXECUTION_SUCCESS_RATE_THRESHOLD || '0.7'),
  
  // Reasoning effectiveness - Cognitive enhancement parameters
  
  /** 
   * Initial reasoning effectiveness score for new sessions.
   * Represents the starting cognitive capability level before adaptation.
   * @type {number}
   * @default 0.8
   * @env INITIAL_REASONING_EFFECTIVENESS
   */
  INITIAL_REASONING_EFFECTIVENESS: parseFloat(process.env.INITIAL_REASONING_EFFECTIVENESS || '0.8'),
  
  /** 
   * Minimum allowed reasoning effectiveness score.
   * Prevents cognitive degradation below acceptable performance levels.
   * @type {number}
   * @default 0.3
   * @env MIN_REASONING_EFFECTIVENESS
   */
  MIN_REASONING_EFFECTIVENESS: parseFloat(process.env.MIN_REASONING_EFFECTIVENESS || '0.3'),
  
  /** 
   * Maximum allowed reasoning effectiveness score.
   * Caps cognitive enhancement to prevent overconfidence or unrealistic expectations.
   * @type {number}
   * @default 1.0
   * @env MAX_REASONING_EFFECTIVENESS
   */
  MAX_REASONING_EFFECTIVENESS: parseFloat(process.env.MAX_REASONING_EFFECTIVENESS || '1.0'),
  
  // Security configuration - Host validation and protection policies
  
  /** 
   * List of allowed hosts for external connections.
   * Whitelist approach to prevent unauthorized network access.
   * @type {string[]}
   * @default []
   * @env ALLOWED_HOSTS (comma-separated)
   */
  ALLOWED_HOSTS: (process.env.ALLOWED_HOSTS || '').split(',').filter(Boolean),
  
  /** 
   * Enables Server-Side Request Forgery (SSRF) protection.
   * Prevents malicious requests to internal or restricted network resources.
   * @type {boolean}
   * @default true
   * @env ENABLE_SSRF_PROTECTION
   */
  ENABLE_SSRF_PROTECTION: process.env.ENABLE_SSRF_PROTECTION !== 'false',
  
  // User agent configuration - Service identification
  
  /** 
   * User agent string for external API requests.
   * Identifies the Iron Manus MCP system to external services for proper handling.
   * @type {string}
   * @default 'Iron-Manus-MCP/0.2.4-AutoFetch'
   * @env USER_AGENT
   */
  USER_AGENT: process.env.USER_AGENT || 'Iron-Manus-MCP/0.2.4-AutoFetch',
} as const;

/**
 * Validates the current configuration settings against defined constraints.
 * 
 * This function performs comprehensive validation of all configuration parameters
 * to ensure they fall within acceptable ranges and maintain system stability.
 * It checks for:
 * - Concurrency limits within reasonable bounds
 * - Timeout values that prevent system hangs
 * - Confidence thresholds within probability ranges
 * - Performance thresholds that maintain quality standards
 * - Success rates that indicate healthy system operation
 * 
 * @returns {Object} Validation result containing validity status and error details
 * @returns {boolean} returns.valid - True if all configuration values are valid
 * @returns {string[]} returns.errors - Array of error messages for invalid configurations
 * 
 * @example
 * ```typescript
 * const validation = validateConfig();
 * if (!validation.valid) {
 *   console.error('Configuration errors:', validation.errors);
 *   process.exit(1);
 * }
 * ```
 */
export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Production Security Validation - Critical security checks for production environments
  if (process.env.NODE_ENV === 'production') {
    if (!CONFIG.ENABLE_SSRF_PROTECTION) {
      errors.push('CRITICAL: SSRF protection must be enabled in production (ENABLE_SSRF_PROTECTION=true)');
    }
    
    if (CONFIG.ALLOWED_HOSTS.length === 0) {
      errors.push('WARNING: ALLOWED_HOSTS is empty in production - consider restricting to specific domains for enhanced security');
    }
    
    if (CONFIG.KNOWLEDGE_MAX_CONCURRENCY > 5) {
      errors.push('WARNING: High concurrency in production may overwhelm external APIs (recommended: <= 5)');
    }
  }
  
  // General Configuration Validation
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