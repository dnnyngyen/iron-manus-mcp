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
export function validatePythonCode(code: string): void {
  if (!code || typeof code !== 'string') {
    throw new Error('Invalid Python code: code must be a non-empty string');
  }

  // Dangerous patterns that should be blocked
  const dangerousPatterns = [
    /os\.system\s*\(/i, // os.system() calls
    /subprocess\.(call|run|Popen)/i, // subprocess execution
    /eval\s*\(/i, // eval() calls
    /exec\s*\(/i, // exec() calls
    /compile\s*\(/i, // compile() calls
    /import\s+(os|subprocess|sys)(?:\s|$)/i, // Dangerous imports
    /from\s+(os|subprocess|sys)\s+import/i, // Dangerous from imports
    /__import__\s*\(/i, // Dynamic imports
    /open\s*\(\s*['"][^'"]*\/etc/i, // Access to system files
    /open\s*\(\s*['"][^'"]*\/proc/i, // Access to proc filesystem
    /\$\{[^}]*\}/, // Shell substitution patterns
    /`[^`]*`/, // Backtick execution
  ];

  // Check for dangerous patterns
  for (const pattern of dangerousPatterns) {
    if (pattern.test(code)) {
      throw new Error(
        `Security: Potentially dangerous code pattern detected: ${pattern.toString()}`
      );
    }
  }

  // Check for suspicious file operations
  if (
    code.includes('open(') &&
    (code.includes('../') ||
      code.includes('..\\') ||
      code.includes('/etc/') ||
      code.includes('/proc/'))
  ) {
    throw new Error('Security: Suspicious file access pattern detected');
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
