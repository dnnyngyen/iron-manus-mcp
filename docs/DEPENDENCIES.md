# Dependencies Guide

## Overview

Iron Manus MCP v0.2.0 includes several key dependencies for enhanced functionality, security, and performance.

## Core Dependencies

### Production Dependencies

#### `p-limit` (^6.2.0)
- **Purpose**: Concurrency control for API requests
- **Usage**: Replaces custom semaphore implementation for safer concurrent operations
- **Location**: `src/knowledge/autoConnection.ts`
- **Example**:
```typescript
import pLimit from 'p-limit';
const limit = pLimit(CONFIG.KNOWLEDGE_MAX_CONCURRENCY);
```

#### `@modelcontextprotocol/sdk` (^1.13.2)
- **Purpose**: MCP server framework
- **Usage**: Core MCP server functionality

#### `axios` (^1.10.0)
- **Purpose**: HTTP client for API requests
- **Usage**: Knowledge synthesis and API fetching

#### `dotenv` (^16.5.0)
- **Purpose**: Environment variable management
- **Usage**: Configuration loading

### Development Dependencies

#### `zod` (^3.25.67)
- **Purpose**: Runtime type validation and schema definition
- **Usage**: Input validation for FSM messages and API responses
- **Location**: `src/validation/schemas.ts`
- **Example**:
```typescript
import { z } from 'zod';

export const MessageJARVISSchema = z.object({
  session_id: z.string(),
  phase_completed: z.enum(['QUERY', 'ENHANCE', 'KNOWLEDGE', 'PLAN', 'EXECUTE', 'VERIFY']).optional(),
  initial_objective: z.string().optional(),
  payload: z.record(z.any()).optional()
});
```

#### `vitest` (^0.34.6)
- **Purpose**: Fast unit testing framework
- **Usage**: Replaces Jest for testing
- **Configuration**: `vitest.config.ts`

#### `prettier` (^3.6.2)
- **Purpose**: Code formatting
- **Usage**: Consistent code style across the project

#### `typescript` (^5.0.0)
- **Purpose**: TypeScript compilation
- **Usage**: Type safety and compilation

## Security Dependencies

### SSRF Protection
The project includes built-in SSRF (Server-Side Request Forgery) protection:

- **Implementation**: `src/security/ssrfGuard.ts`
- **Features**:
  - Private IP blocking (10.x, 192.168.x, 127.x)
  - Localhost protection
  - URL validation and sanitization
  - Configurable allowlist support

### Environment Configuration
Security settings are managed through environment variables:

```bash
# SSRF Protection
ENABLE_SSRF_PROTECTION=true
ALLOWED_HOSTS="api.github.com,*.trusted.com"

# Rate Limiting  
KNOWLEDGE_MAX_CONCURRENCY=2
KNOWLEDGE_TIMEOUT_MS=4000

# Content Limits
MAX_CONTENT_LENGTH=2097152  # 2MB
```

## Testing Framework Migration

### Vitest (Current)
- **Fast execution**: Native ESM support
- **Built-in coverage**: V8 coverage provider
- **TypeScript support**: Native TypeScript handling
- **Configuration**: `vitest.config.ts`

### Coverage Thresholds
```typescript
coverage: {
  thresholds: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  }
}
```

## Installation Notes

### New Dependencies in v0.2.0
When upgrading from v1.x to v0.2.0, these dependencies are automatically installed:

```bash
npm install  # Installs all dependencies including p-limit, zod
```

### Dependency Verification
Verify all dependencies are correctly installed:

```bash
# Check for security vulnerabilities
npm audit

# Check for outdated packages
npm outdated

# Update dependencies
npm update
```

## Usage Examples

### p-limit for Concurrency Control
```typescript
import pLimit from 'p-limit';
import { CONFIG } from '../config.js';

const limit = pLimit(CONFIG.KNOWLEDGE_MAX_CONCURRENCY);

// Use with API requests
const fetchPromises = urls.map(url => 
  limit(() => axios.get(url))
);
```

### Zod for Validation
```typescript
import { MessageJARVISSchema } from '../validation/schemas.js';

function validateInput(input: unknown) {
  try {
    return MessageJARVISSchema.parse(input);
  } catch (error) {
    throw new Error(`Invalid input: ${error.message}`);
  }
}
```

### SSRF Protection
```typescript
import { ssrfGuard, validateAndSanitizeURL } from '../security/ssrfGuard.js';

// Check if URL is safe
if (!ssrfGuard(url)) {
  throw new Error('URL blocked by SSRF protection');
}

// Sanitize URL
const cleanUrl = validateAndSanitizeURL(url);
```

## Migration from v1.x

### Removed Dependencies
- Custom semaphore implementation (replaced by p-limit)
- Manual type checking (replaced by Zod)

### Added Dependencies
- `p-limit`: Concurrency control
- `zod`: Runtime validation
- `vitest`: Testing framework (replaces Jest setup)

### Configuration Changes
- New environment variables for security
- Vitest configuration replaces Jest
- Centralized config in `src/config.ts`