/**
 * @fileoverview Centralized logging utility for the Iron Manus MCP system.
 *
 * This module provides a unified logging interface that replaces direct console
 * calls throughout the codebase. It supports configurable log levels, environment-based
 * filtering, and structured logging for better debugging and monitoring.
 *
 * Features:
 * - Environment-based log level filtering
 * - Structured log output with timestamps
 * - Performance-optimized with early returns
 * - Production-safe with configurable verbosity
 *
 * @module logger
 */

/* eslint-disable no-console */

/**
 * Available log levels in order of severity
 */
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

/**
 * Current log level based on environment
 * - Development: DEBUG (shows all logs)
 * - Test: WARN (reduces noise during testing)
 * - Production: INFO (balanced production logging)
 */
const currentLogLevel: LogLevel = (() => {
  switch (process.env.NODE_ENV) {
    case 'test':
      return LogLevel.WARN;
    case 'production':
      return LogLevel.INFO;
    default:
      return LogLevel.DEBUG;
  }
})();

/**
 * Formats a log message with timestamp and level
 * In test environment, timestamps are omitted for consistent test assertions
 */
function formatMessage(level: string, ...args: unknown[]): unknown[] {
  if (process.env.NODE_ENV === 'test') {
    // No timestamp in test environment for cleaner test assertions
    return args;
  }
  const timestamp = new Date().toISOString();
  return [`[${timestamp}] [${level}]`, ...args];
}

/**
 * Detect if running in test environment for console forwarding
 */
const isTestEnvironment = process.env.NODE_ENV === 'test' || !!process.env.VITEST_POOL_ID;

/**
 * Centralized logger instance with level-based filtering
 *
 * In test environments, forwards directly to console to maintain test compatibility.
 * In other environments, provides structured logging with timestamps and level filtering.
 */
const logger = {
  /**
   * Debug-level logging for detailed troubleshooting
   * Only shown in development environment
   */
  debug: (...args: unknown[]): void => {
    if (isTestEnvironment) {
      console.debug(...args);
      return;
    }
    if (currentLogLevel <= LogLevel.DEBUG) {
      console.debug(...formatMessage('DEBUG', ...args));
    }
  },

  /**
   * Info-level logging for general information
   * Shown in development and production
   */
  info: (...args: unknown[]): void => {
    if (isTestEnvironment) {
      console.info(...args);
      return;
    }
    if (currentLogLevel <= LogLevel.INFO) {
      console.info(...formatMessage('INFO', ...args));
    }
  },

  /**
   * Warning-level logging for potential issues
   * Shown in all environments except when disabled
   */
  warn: (...args: unknown[]): void => {
    if (isTestEnvironment) {
      console.warn(...args);
      return;
    }
    if (currentLogLevel <= LogLevel.WARN) {
      console.warn(...formatMessage('WARN', ...args));
    }
  },

  /**
   * Error-level logging for serious issues
   * Always shown unless explicitly disabled
   */
  error: (...args: unknown[]): void => {
    if (isTestEnvironment) {
      console.error(...args);
      return;
    }
    if (currentLogLevel <= LogLevel.ERROR) {
      console.error(...formatMessage('ERROR', ...args));
    }
  },

  /**
   * Gets the current log level for debugging
   */
  getLevel: (): string => {
    return LogLevel[currentLogLevel];
  },
};

export default logger;
export { LogLevel };
