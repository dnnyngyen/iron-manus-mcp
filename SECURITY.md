# Security Policy

## Overview

Iron Manus MCP implements enterprise-grade security measures to protect against common web application vulnerabilities, particularly Server-Side Request Forgery (SSRF) attacks.

## SSRF Protection

### Automatic Protection

Iron Manus includes built-in SSRF protection that:

- **Blocks private IP ranges**: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
- **Blocks localhost**: 127.0.0.1, localhost, ::1
- **Blocks metadata endpoints**: 169.254.169.254 (AWS/cloud metadata)
- **Validates protocols**: Only HTTP/HTTPS allowed
- **Enforces allowlist**: When configured, only specified hosts allowed

### Configuration

```bash
# Enable/disable SSRF protection
ENABLE_SSRF_PROTECTION=true

# Define allowed hosts (empty = allow all public hosts)
ALLOWED_HOSTS="api.github.com,*.httpbin.org,jsonplaceholder.typicode.com"

# Rate limiting
RATE_LIMIT_REQUESTS_PER_MINUTE=5
RATE_LIMIT_WINDOW_MS=60000

# Content limits
MAX_CONTENT_LENGTH=2097152  # 2MB
MAX_BODY_LENGTH=2097152     # 2MB
```

### Example Usage

```typescript
import { ssrfGuard, validateAndSanitizeURL } from './src/security/ssrfGuard.js';

// Check if URL is safe
const isSafe = ssrfGuard('https://api.example.com/data');

// Validate and sanitize URL
const cleanUrl = validateAndSanitizeURL('https://api.example.com/data?callback=evil');
```

## Security Best Practices

### 1. Environment Configuration

Always configure SSRF protection for production:

```bash
# Production settings
ENABLE_SSRF_PROTECTION=true
ALLOWED_HOSTS="api.trusted.com,*.safe-domain.org"
KNOWLEDGE_MAX_CONCURRENCY=2
KNOWLEDGE_TIMEOUT_MS=4000
```

### 2. Input Validation

All inputs are validated using Zod schemas:

```typescript
import { MessageJARVISSchema } from './src/validation/schemas.js';

// Validate input
const validatedInput = MessageJARVISSchema.parse(input);
```

### 3. Rate Limiting

Built-in rate limiting prevents abuse:

- Default: 5 requests per minute per hostname
- Configurable via environment variables
- Automatic backoff on rate limit exceeded

### 4. Content Size Limits

Prevent memory exhaustion:

- Default: 2MB max response size
- Automatic truncation of large responses
- Configurable limits via environment

## Reporting Security Issues

If you discover a security vulnerability in Iron Manus MCP, please:

1. **Do not** create a public GitHub issue
2. Email security issues to: [security@iron-manus.dev](mailto:security@iron-manus.dev)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Impact assessment
   - Suggested fix (if any)

## Security Response

We take security seriously and will:

- Acknowledge receipt within 24 hours
- Provide an initial assessment within 72 hours
- Release security patches as soon as possible
- Credit researchers (with permission)

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | ✅ Yes             |
| 1.0.x   | ⚠️ Limited support |
| < 1.0   | ❌ No              |

## Security Checklist

Before deploying Iron Manus MCP:

- [ ] SSRF protection enabled
- [ ] Allowed hosts configured (if using external APIs)
- [ ] Rate limits configured appropriately
- [ ] Content size limits set
- [ ] Regular dependency updates scheduled
- [ ] Security monitoring in place

## Dependencies

Keep dependencies updated:

```bash
# Check for vulnerabilities
npm audit

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

## Additional Resources

- [OWASP SSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [TypeScript Security Guidelines](https://typescript-eslint.io/rules/)