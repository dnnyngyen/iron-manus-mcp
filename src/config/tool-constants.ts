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
  // Visualization constants
  FIGURE_SIZE: [15, 12] as const,
  HISTOGRAM_BINS: 20,
  // ML constants
  ML_SAMPLE_SIZE: 1000,
  ML_FEATURE_COUNT: 10,
  ML_TEST_SIZE: 0.2,
  ML_N_ESTIMATORS: 100,
  ML_RANDOM_STATE: 42,
} as const;

// SSRF Guard Configuration
export const SSRF_GUARD_CONFIG = {
  SESSION_ID_MAX_LENGTH: 200,
} as const;

// Auto Connection Configuration
export const AUTO_CONNECTION_CONFIG = {
  MAX_API_URLS: 5,
  // Confidence calculation constants
  BASE_CONFIDENCE: 0.5,
  STATUS_200_BOOST: 0.3,
  STATUS_SUCCESS_BOOST: 0.2,
  STATUS_FAILURE_PENALTY: 0.2,
  DATA_QUALITY_LARGE_BOOST: 0.2,
  DATA_QUALITY_SMALL_BOOST: 0.1,
  DATA_QUALITY_LARGE_THRESHOLD: 100,
  DATA_QUALITY_SMALL_THRESHOLD: 10,
  RESPONSE_TIME_FAST_BOOST: 0.1,
  RESPONSE_TIME_SLOW_PENALTY: 0.1,
  RESPONSE_TIME_FAST_THRESHOLD: 1000,
  RESPONSE_TIME_SLOW_THRESHOLD: 5000,
  // Similarity threshold
  SIMILARITY_THRESHOLD: 0.3,
} as const;
