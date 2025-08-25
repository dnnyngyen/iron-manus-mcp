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

import { z } from 'zod';

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
  KNOWLEDGE_MAX_CONCURRENCY: (() => {
    const envValue = process.env.KNOWLEDGE_MAX_CONCURRENCY;
    const parsed = parseInt(envValue || '', 10);
    return isNaN(parsed) ? 2 : parsed;
  })(),

  /**
   * Timeout for individual API requests in milliseconds.
   * Prevents hanging requests from blocking the knowledge gathering process.
   * @type {number}
   * @default 4000
   * @env KNOWLEDGE_TIMEOUT_MS
   */
  KNOWLEDGE_TIMEOUT_MS: (() => {
    const envValue = process.env.KNOWLEDGE_TIMEOUT_MS;
    const parsed = parseInt(envValue || '', 10);
    return isNaN(parsed) ? 4000 : parsed;
  })(),

  /**
   * Minimum confidence threshold for accepting API responses.
   * Responses below this threshold are considered unreliable and may be discarded.
   * @type {number}
   * @default 0.4
   * @env KNOWLEDGE_CONFIDENCE_THRESHOLD
   */
  KNOWLEDGE_CONFIDENCE_THRESHOLD: (() => {
    const envValue = process.env.KNOWLEDGE_CONFIDENCE_THRESHOLD;
    const parsed = parseFloat(envValue || '');
    return isNaN(parsed) ? 0.4 : parsed;
  })(),

  /**
   * Maximum response size in characters for API responses.
   * Prevents oversized responses from consuming excessive memory or processing time.
   * @type {number}
   * @default 5000
   * @env KNOWLEDGE_MAX_RESPONSE_SIZE
   */
  KNOWLEDGE_MAX_RESPONSE_SIZE: (() => {
    const envValue = process.env.KNOWLEDGE_MAX_RESPONSE_SIZE;
    const parsed = parseInt(envValue || '', 10);
    return isNaN(parsed) ? 5000 : parsed;
  })(),

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
  RATE_LIMIT_REQUESTS_PER_MINUTE: (() => {
    const envValue = process.env.RATE_LIMIT_REQUESTS_PER_MINUTE;
    const parsed = parseInt(envValue || '', 10);
    return isNaN(parsed) ? 5 : parsed;
  })(),

  /**
   * Time window in milliseconds for rate limiting calculations.
   * Defines the sliding window period for request count tracking.
   * @type {number}
   * @default 60000
   * @env RATE_LIMIT_WINDOW_MS
   */
  RATE_LIMIT_WINDOW_MS: (() => {
    const envValue = process.env.RATE_LIMIT_WINDOW_MS;
    const parsed = parseInt(envValue || '', 10);
    return isNaN(parsed) ? 60000 : parsed;
  })(),

  // Content limits - Security boundaries for data processing

  /**
   * Maximum content length in bytes for incoming requests.
   * Prevents memory exhaustion from oversized payloads.
   * @type {number}
   * @default 2097152 (2MB)
   * @env MAX_CONTENT_LENGTH
   */
  MAX_CONTENT_LENGTH: (() => {
    const envValue = process.env.MAX_CONTENT_LENGTH;
    const parsed = parseInt(envValue || '', 10);
    return isNaN(parsed) ? 1024 * 1024 * 2 : parsed; // 2MB default
  })(),

  /**
   * Maximum body length in bytes for HTTP requests.
   * Complements MAX_CONTENT_LENGTH for specific HTTP body size restrictions.
   * @type {number}
   * @default 2097152 (2MB)
   * @env MAX_BODY_LENGTH
   */
  MAX_BODY_LENGTH: (() => {
    const envValue = process.env.MAX_BODY_LENGTH;
    const parsed = parseInt(envValue || '', 10);
    return isNaN(parsed) ? 1024 * 1024 * 2 : parsed; // 2MB default
  })(),

  // Performance thresholds - Quality metrics and success criteria

  /**
   * Minimum completion percentage required for verification phase success.
   * Tasks below this threshold are considered incomplete and may trigger retries.
   * @type {number}
   * @default 95
   * @env VERIFICATION_COMPLETION_THRESHOLD
   */
  VERIFICATION_COMPLETION_THRESHOLD: (() => {
    const envValue = process.env.VERIFICATION_COMPLETION_THRESHOLD;
    const parsed = parseInt(envValue || '', 10);
    return isNaN(parsed) ? 95 : parsed;
  })(),

  /**
   * Minimum success rate required for execution phase completion.
   * Lower rates indicate systematic issues that may require intervention.
   * @type {number}
   * @default 0.7
   * @env EXECUTION_SUCCESS_RATE_THRESHOLD
   */
  EXECUTION_SUCCESS_RATE_THRESHOLD: (() => {
    const envValue = process.env.EXECUTION_SUCCESS_RATE_THRESHOLD;
    const parsed = parseFloat(envValue || '');
    return isNaN(parsed) ? 0.7 : parsed;
  })(),

  // Reasoning effectiveness - Cognitive enhancement parameters

  /**
   * Initial reasoning effectiveness score for new sessions.
   * Represents the starting cognitive capability level before adaptation.
   * @type {number}
   * @default 0.8
   * @env INITIAL_REASONING_EFFECTIVENESS
   */
  INITIAL_REASONING_EFFECTIVENESS: (() => {
    const envValue = process.env.INITIAL_REASONING_EFFECTIVENESS;
    const parsed = parseFloat(envValue || '');
    return isNaN(parsed) ? 0.8 : parsed;
  })(),

  /**
   * Minimum allowed reasoning effectiveness score.
   * Prevents cognitive degradation below acceptable performance levels.
   * @type {number}
   * @default 0.3
   * @env MIN_REASONING_EFFECTIVENESS
   */
  MIN_REASONING_EFFECTIVENESS: (() => {
    const envValue = process.env.MIN_REASONING_EFFECTIVENESS;
    const parsed = parseFloat(envValue || '');
    return isNaN(parsed) ? 0.3 : parsed;
  })(),

  /**
   * Maximum allowed reasoning effectiveness score.
   * Caps cognitive enhancement to prevent overconfidence or unrealistic expectations.
   * @type {number}
   * @default 1.0
   * @env MAX_REASONING_EFFECTIVENESS
   */
  MAX_REASONING_EFFECTIVENESS: (() => {
    const envValue = process.env.MAX_REASONING_EFFECTIVENESS;
    const parsed = parseFloat(envValue || '');
    return isNaN(parsed) ? 1.0 : parsed;
  })(),

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
 * Zod schema for runtime configuration validation
 * Provides type-safe validation with detailed error messages
 */
const ConfigSchema = z
  .object({
    KNOWLEDGE_MAX_CONCURRENCY: z.number().int().min(1).max(10),
    KNOWLEDGE_TIMEOUT_MS: z.number().int().min(1000).max(30000),
    KNOWLEDGE_CONFIDENCE_THRESHOLD: z.number().min(0).max(1),
    KNOWLEDGE_MAX_RESPONSE_SIZE: z.number().int().positive(),
    AUTO_CONNECTION_ENABLED: z.boolean(),
    RATE_LIMIT_REQUESTS_PER_MINUTE: z.number().int().positive(),
    RATE_LIMIT_WINDOW_MS: z.number().int().positive(),
    MAX_CONTENT_LENGTH: z.number().int().positive(),
    MAX_BODY_LENGTH: z.number().int().positive(),
    VERIFICATION_COMPLETION_THRESHOLD: z.number().int().min(50).max(100),
    EXECUTION_SUCCESS_RATE_THRESHOLD: z.number().min(0).max(1),
    INITIAL_REASONING_EFFECTIVENESS: z.number().min(0).max(1),
    MIN_REASONING_EFFECTIVENESS: z.number().min(0).max(1),
    MAX_REASONING_EFFECTIVENESS: z.number().min(0).max(1),
    ALLOWED_HOSTS: z.array(z.string()),
    ENABLE_SSRF_PROTECTION: z.boolean(),
    USER_AGENT: z.string().min(1),
  })
  .refine(
    config => {
      return config.MIN_REASONING_EFFECTIVENESS <= config.MAX_REASONING_EFFECTIVENESS;
    },
    {
      message: 'MIN_REASONING_EFFECTIVENESS must be <= MAX_REASONING_EFFECTIVENESS',
      path: ['MIN_REASONING_EFFECTIVENESS'],
    }
  );

/**
 * Validates configuration using Zod schema
 * @returns Validation result with detailed error information
 */
export function validateConfigWithSchema(): { valid: boolean; errors: string[] } {
  try {
    ConfigSchema.parse(CONFIG);
    return { valid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { valid: false, errors };
    }
    return { valid: false, errors: [`Unexpected validation error: ${error}`] };
  }
}

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

  // First run Zod schema validation for type safety and basic constraints
  const schemaValidation = validateConfigWithSchema();
  if (!schemaValidation.valid) {
    errors.push(...schemaValidation.errors.map(err => `Schema validation: ${err}`));
  }

  // Production Security Validation - Critical security checks for production environments
  if (process.env.NODE_ENV === 'production') {
    if (!CONFIG.ENABLE_SSRF_PROTECTION) {
      errors.push(
        'CRITICAL: SSRF protection must be enabled in production (ENABLE_SSRF_PROTECTION=true)'
      );
    }

    if (CONFIG.ALLOWED_HOSTS.length === 0) {
      errors.push(
        'WARNING: ALLOWED_HOSTS is empty in production - consider restricting to specific domains for enhanced security'
      );
    }

    if (CONFIG.KNOWLEDGE_MAX_CONCURRENCY > 5) {
      errors.push(
        'WARNING: High concurrency in production may overwhelm external APIs (recommended: <= 5)'
      );
    }
  }

  // Environment-specific validation
  if (CONFIG.USER_AGENT && !CONFIG.USER_AGENT.includes('Iron-Manus-MCP')) {
    errors.push(
      'WARNING: USER_AGENT should identify as Iron-Manus-MCP for proper service recognition'
    );
  }

  // Performance optimization warnings
  if (CONFIG.KNOWLEDGE_TIMEOUT_MS > 10000) {
    errors.push(
      'INFO: Long timeout values may impact user experience (consider reducing KNOWLEDGE_TIMEOUT_MS)'
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
