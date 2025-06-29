// SSRF protection tests
import { describe, it, expect } from 'vitest';
import { ssrfGuard, validateAndSanitizeURL, getSSRFProtectionStatus } from '../src/security/ssrfGuard.js';

describe('SSRF Protection', () => {
  it('should block private IP addresses', () => {
    const privateIPs = [
      'http://10.0.0.1/api',
      'http://192.168.1.1/data',
      'http://172.16.0.1/internal',
      'http://127.0.0.1:8080/admin',
      'http://169.254.169.254/metadata', // AWS metadata
    ];

    privateIPs.forEach(url => {
      expect(ssrfGuard(url)).toBe(false);
    });
  });

  it('should block localhost variants', () => {
    const localhostUrls = [
      'http://localhost/api',
      'http://0.0.0.0/internal',
      'https://localhost:3000/admin',
    ];

    localhostUrls.forEach(url => {
      expect(ssrfGuard(url)).toBe(false);
    });
  });

  it('should block non-HTTP protocols', () => {
    const dangerousUrls = [
      'file:///etc/passwd',
      'ftp://internal.server.com/data',
      'ldap://directory.internal/users',
      'javascript:alert(1)',
    ];

    dangerousUrls.forEach(url => {
      expect(ssrfGuard(url)).toBe(false);
    });
  });

  it('should allow public HTTPS URLs', () => {
    const publicUrls = [
      'https://api.github.com/repos',
      'https://jsonplaceholder.typicode.com/posts',
      'https://httpbin.org/get',
    ];

    publicUrls.forEach(url => {
      expect(ssrfGuard(url)).toBe(true);
    });
  });

  it('should respect allowed hosts whitelist', () => {
    const allowedHosts = ['api.example.com', '*.github.com'];
    
    expect(ssrfGuard('https://api.example.com/data', allowedHosts)).toBe(true);
    expect(ssrfGuard('https://api.github.com/repos', allowedHosts)).toBe(true);
    expect(ssrfGuard('https://raw.githubusercontent.com/file', allowedHosts)).toBe(true);
    expect(ssrfGuard('https://evil.com/data', allowedHosts)).toBe(false);
  });

  it('should sanitize URLs properly', () => {
    const dangerousUrl = 'https://api.example.com/data?callback=evil&__proto__=malicious';
    const sanitized = validateAndSanitizeURL(dangerousUrl);
    
    expect(sanitized).toBeTruthy();
    expect(sanitized).not.toContain('callback=evil');
    expect(sanitized).not.toContain('__proto__');
  });

  it('should return null for blocked URLs', () => {
    const blockedUrl = 'http://127.0.0.1/admin';
    const result = validateAndSanitizeURL(blockedUrl);
    
    expect(result).toBeNull();
  });

  it('should provide protection status', () => {
    const status = getSSRFProtectionStatus();
    
    expect(status).toHaveProperty('enabled');
    expect(status).toHaveProperty('allowedHosts');
    expect(status).toHaveProperty('allowedHostsCount');
    expect(status).toHaveProperty('strictMode');
  });
});