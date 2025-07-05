/**
 * Tool Configuration Constants
 * Centralized configuration values for all tools
 */

// MultiAPIFetch Configuration
export const MULTI_API_FETCH_CONFIG = {
  MAX_ENDPOINTS: 10,
  DEFAULT_TIMEOUT_MS: 5000,
  MIN_TIMEOUT_MS: 1000,
  MAX_TIMEOUT_MS: 30000,
  DEFAULT_MAX_CONCURRENT: 3,
  MIN_CONCURRENT: 1,
  MAX_CONCURRENT: 5,
  MAX_CONTENT_LENGTH_MB: 5,
  MAX_TRUNCATE_CHARS: 10000,
} as const;

// APISearch Configuration
export const API_SEARCH_CONFIG = {
  DEFAULT_MAX_RESULTS: 5,
  MIN_RESULTS: 1,
  MAX_RESULTS: 20,
} as const;

// HealthCheck Configuration
export const HEALTH_CHECK_CONFIG = {
  MEMORY_WARNING_THRESHOLD_MB: 512,
  MEMORY_CRITICAL_THRESHOLD_MB: 1024,
} as const;

// Python Executor Configuration
export const PYTHON_EXECUTOR_CONFIG = {
  MAX_RETRIES: 2,
  BASE_DELAY_MS: 500,
  MAX_RESPONSE_SIZE_CHARS: 10000,
} as const;
