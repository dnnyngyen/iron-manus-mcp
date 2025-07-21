/**
 * Python Security Utilities
 * Centralized security validation functions for Python code execution
 */

/**
 * Allowed libraries for Python execution (security-validated list)
 */
export const ALLOWED_LIBRARIES = new Set([
  'pandas',
  'numpy',
  'matplotlib',
  'scipy',
  'sklearn',
  'bs4',
  'cv2',
  'requests',
  'json',
  'os',
  'sys',
  're',
  'datetime',
  'math',
  'random',
  'beautifulsoup4',
  'scikit-learn',
  'opencv-python',
  'seaborn',
  'plotly',
]);

/**
 * Validates Python code to prevent dangerous command execution
 *
 * Performs security checks on Python code to prevent command injection,
 * system access, and other potentially dangerous operations. This function
 * scans for dangerous patterns and throws errors if unsafe code is detected.
 *
 * Security Checks:
 * - Prevents direct system command execution (os.system, subprocess)
 * - Blocks file system manipulation outside safe operations
 * - Prevents network access to internal resources
 * - Blocks evaluation of user-provided strings (eval, exec)
 * - Prevents import of dangerous modules
 *
 * @param code - The Python code to validate
 * @throws {Error} When dangerous patterns are detected
 */
import { spawnSync } from 'child_process';

/**
 * Validates Python code using a dedicated Python script with an AST parser.
 *
 * @param code - The Python code to validate
 * @throws {Error} When dangerous patterns are detected
 */
export function validatePythonCode(code: string): void {
  if (!code || typeof code !== 'string') {
    throw new Error('Invalid Python code: code must be a non-empty string');
  }

  const validationResult = spawnSync('python3', ['scripts/iron-manus/python-code-validator.py'], {
    input: code,
    encoding: 'utf-8',
  });

  if (validationResult.status !== 0) {
    throw new Error(`Security: Python code validation failed: ${validationResult.stderr}`);
  }
}

/**
 * Validates library names to prevent command injection
 *
 * Checks if a library name is safe for use in shell commands by validating
 * against an allowlist and checking for dangerous patterns that could lead
 * to command injection vulnerabilities.
 *
 * Security Checks:
 * - Must be in allowlist of known safe libraries
 * - Must match safe naming pattern (alphanumeric, hyphens, underscores)
 * - Cannot contain shell metacharacters or command injection patterns
 * - Cannot be empty or only whitespace
 *
 * @param libraryName - The library name to validate
 * @param allowedLibraries - Set of allowed library names
 * @returns True if library name is safe, false otherwise
 */
export function isValidLibraryName(
  libraryName: string,
  allowedLibraries: Set<string> = ALLOWED_LIBRARIES
): boolean {
  // Check for empty or whitespace-only strings
  if (!libraryName || typeof libraryName !== 'string' || libraryName.trim() === '') {
    return false;
  }

  // Check if library is in allowlist
  if (!allowedLibraries.has(libraryName)) {
    return false;
  }

  // Check for safe naming pattern: only alphanumeric, hyphens, underscores
  const safePattern = /^[a-zA-Z0-9_-]+$/;
  if (!safePattern.test(libraryName)) {
    return false;
  }

  // Check for dangerous patterns that could lead to command injection
  const dangerousPatterns = [
    /[;&|`$(){}[\]<>'"]/, // Shell metacharacters
    /\s/, // Whitespace
    /\.\./, // Directory traversal
    /^-/, // Options that start with dash
    /[\\\/]/, // Path separators
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(libraryName)) {
      return false;
    }
  }

  return true;
}
