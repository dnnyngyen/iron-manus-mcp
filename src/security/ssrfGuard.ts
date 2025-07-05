// SSRF protection module
import { CONFIG } from '../config.js';

/**
 * SSRF Guard - prevents Server-Side Request Forgery attacks
 * @param url - URL to validate
 * @param allowedHosts - Array of allowed hostnames (optional, uses config if not provided)
 * @returns True if URL is safe to fetch from
 */
export function ssrfGuard(url: string, allowedHosts?: string[]): boolean {
  if (!CONFIG.ENABLE_SSRF_PROTECTION) {
    return true; // SSRF protection disabled
  }

  const hosts = allowedHosts || CONFIG.ALLOWED_HOSTS;

  try {
    const urlObj = new URL(url);

    // Block non-HTTP(S) protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }

    // Block private/local IP ranges
    if (isPrivateIP(urlObj.hostname)) {
      return false;
    }

    // Block localhost variants
    if (isLocalhost(urlObj.hostname)) {
      return false;
    }

    // If allowed hosts are specified, only allow those
    if (hosts.length > 0) {
      return hosts.some(allowedHost => {
        // Support wildcard subdomains (e.g., "*.example.com")
        if (allowedHost.startsWith('*.')) {
          const domain = allowedHost.slice(2);
          return urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain);
        }
        return urlObj.hostname === allowedHost;
      });
    }

    // If no allowed hosts specified, allow all public hosts
    return true;
  } catch (_error) {
    // Invalid URL
    return false;
  }
}

/**
 * Check if hostname is a private IP address
 */
function isPrivateIP(hostname: string): boolean {
  // IPv4 private ranges
  const ipv4PrivateRanges = [
    /^10\./, // 10.0.0.0/8
    /^172\.(1[6-9]|2[0-9]|3[01])\./, // 172.16.0.0/12
    /^192\.168\./, // 192.168.0.0/16
    /^127\./, // 127.0.0.0/8 (loopback)
    /^169\.254\./, // 169.254.0.0/16 (link-local)
  ];

  // IPv6 private ranges (simplified)
  const ipv6PrivateRanges = [
    /^::1$/, // loopback
    /^::$/, // unspecified
    /^fe80:/, // link-local
    /^fc00:/, // unique local
    /^fd00:/, // unique local
  ];

  // Check IPv4 private ranges
  for (const range of ipv4PrivateRanges) {
    if (range.test(hostname)) {
      return true;
    }
  }

  // Check IPv6 private ranges
  for (const range of ipv6PrivateRanges) {
    if (range.test(hostname)) {
      return true;
    }
  }

  return false;
}

/**
 * Check if hostname is localhost variant
 */
function isLocalhost(hostname: string): boolean {
  const localhostVariants = ['localhost', '0.0.0.0', '127.0.0.1', '::1', '::'];

  return localhostVariants.includes(hostname.toLowerCase());
}

/**
 * Validate and sanitize URL for external requests
 * @param url - URL to validate and sanitize
 * @param allowedHosts - Optional array of allowed hosts
 * @returns Sanitized URL or null if invalid
 */
export function validateAndSanitizeURL(url: string, allowedHosts?: string[]): string | null {
  if (!ssrfGuard(url, allowedHosts)) {
    return null;
  }

  try {
    const urlObj = new URL(url);

    // Remove potentially dangerous query parameters
    const dangerousParams = ['callback', 'jsonp', '__proto__', 'constructor'];
    dangerousParams.forEach(param => {
      urlObj.searchParams.delete(param);
    });

    // Ensure HTTPS for sensitive operations (optional)
    if (urlObj.protocol === 'http:' && CONFIG.ALLOWED_HOSTS.length > 0) {
      // If we have an allow list, prefer HTTPS
      urlObj.protocol = 'https:';
    }

    return urlObj.toString();
  } catch (_error) {
    return null;
  }
}

/**
 * Get SSRF protection status and configuration
 */
export function getSSRFProtectionStatus() {
  return {
    enabled: CONFIG.ENABLE_SSRF_PROTECTION,
    allowedHosts: CONFIG.ALLOWED_HOSTS,
    allowedHostsCount: CONFIG.ALLOWED_HOSTS.length,
    strictMode: CONFIG.ALLOWED_HOSTS.length > 0,
  };
}

/**
 * Validates session ID to prevent path traversal attacks
 *
 * @param sessionId - Session identifier to validate
 * @returns True if session ID is safe, false otherwise
 * @description Ensures session ID cannot be used for directory traversal or file system attacks
 */
export function isValidSessionId(sessionId: string): boolean {
  // Check for empty or non-string values
  if (!sessionId || typeof sessionId !== 'string' || sessionId.trim() === '') {
    return false;
  }

  // Check for reasonable length (prevent extremely long paths)
  if (sessionId.length > 200) {
    return false;
  }

  // Check for safe characters only: alphanumeric, hyphens, underscores
  const safePattern = /^[a-zA-Z0-9_-]+$/;
  if (!safePattern.test(sessionId)) {
    return false;
  }

  // Check for dangerous patterns that could lead to path traversal
  const dangerousPatterns = [
    /\.\./, // Directory traversal
    /[\/\\]/, // Path separators
    /^[.-]/, // Leading dots or dashes
    /[<>:"|?*]/, // Windows reserved characters
    // eslint-disable-next-line no-control-regex
    /[\x00-\x1f]/, // Control characters
    /\s/, // Whitespace
    /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i, // Windows reserved names
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(sessionId)) {
      return false;
    }
  }

  return true;
}
