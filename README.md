# 🦾 Iron Manus MCP (J.A.R.V.I.S.)

> **Claude-code MCP server that spawns agents as tools** - An agent orchestration system that lets Claude autonomously break down complex workflows by structured phases and delegate to subagents with native context management (fit over 300k tokens in one session!).

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/dnnyngyen/iron-manus-mcp/actions)
[![Tests](https://img.shields.io/badge/tests-107%2F107-brightgreen.svg)](https://github.com/dnnyngyen/iron-manus-mcp/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Fit over 350k+ tokens in one session!

### 📹 Live Demo GIF
![Iron Manus MCP Demo](./demo.gif)

### 🎥 Full Video Tutorial
[![Iron Manus MCP Demo](https://img.youtube.com/vi/CWuQ_PvZkOs/mqdefault.jpg)](https://www.youtube.com/watch?v=CWuQ_PvZkOs)

**[Watch the complete walkthrough](https://www.youtube.com/watch?v=CWuQ_PvZkOs)** - See the 6-phase workflow orchestration in real-time

## What It Does

Iron Manus MCP is a comprehensive FSM-driven orchestration system that manages complex workflows through structured phases. It features a complete tool registry with JARVIS FSM controller and intelligent API selection from 65+ endpoints.

**6-Phase Workflow**: `QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY`

**Key Features:**
- 🔄 **6-Phase FSM Loop** - Structured workflow orchestration with INIT/DONE states
- 🛠️ **Modular Tool Registry** - Extensible architecture with 5+ specialized tools
- 📡 **65+ API Registry** - Intelligent API discovery and selection system
- 🔒 **SSRF Protection** - Enterprise-grade security with allowlist validation
- ✅ **107/107 Tests Passing** - Comprehensive test coverage with Vitest
- 📦 **ES Modules** - Modern JavaScript with TypeScript 5.0 support

## Quick Start

```bash
# Clone and install
git clone https://github.com/dnnyngyen/iron-manus-mcp
cd iron-manus-mcp
npm install

# Build TypeScript
npm run build

# Run tests (optional)
npm test

# Start server
npm start
```

**For MCP Integration:**
Add to your MCP client configuration or register with Claude Code:
```bash
claude mcp add iron-manus-mcp node dist/index.js
```

## Example Usage

**Input:**
```typescript
await mcp.callTool({
  name: 'JARVIS',
  args: {
    session_id: 'demo',
    initial_objective: 'Build a TypeScript API with tests'
  }
});
```

**6-Phase Flow:**
1. **QUERY** - Analyze request and detect role
2. **ENHANCE** - Add missing requirements and context
3. **KNOWLEDGE** - Auto-discover relevant APIs and patterns
4. **PLAN** - Create structured tasks with meta-prompts
5. **EXECUTE** - Process tasks with specialized tools
6. **VERIFY** - Validate completion and quality

## Available Tools

- `JARVIS` - Main FSM controller (6-phase orchestration)
- `APISearch` - Intelligent API discovery from 65+ endpoint registry
- `MultiAPIFetch` - Parallel HTTP requests with SSRF protection
- `KnowledgeSynthesize` - Cross-validation with conflict resolution
- `APIValidator` - Response validation and confidence scoring

## Development

**Prerequisites:**
- Node.js 18+ (tested with 18.x, 20.x, 22.x)
- npm 8+
- TypeScript 5.0+

**Available Scripts:**
```bash
npm run build        # TypeScript compilation
npm test            # Run full test suite (107 tests)
npm run test:nocov   # Run tests without coverage
npm run lint        # ESLint checking
npm run format      # Prettier formatting
npm start          # Start compiled server
npm run dev        # Build and start server
```

**Configuration:**
Environment variables for customization:
```bash
KNOWLEDGE_MAX_CONCURRENCY=2          # API concurrency limit
KNOWLEDGE_TIMEOUT_MS=4000            # Request timeout
ALLOWED_HOSTS="api.github.com,httpbin.org"  # SSRF whitelist
ENABLE_SSRF_PROTECTION=true          # Security toggle
MIN_COMPLETION_PERCENT=70            # Quality threshold
```

## Testing

Comprehensive test suite with 107 tests using Vitest:

```bash
# Run all tests
npm test

# Run tests without coverage
npm run test:nocov

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:e2e
```

**Test Coverage:**
- Configuration management
- SSRF protection and security
- FSM state transitions
- Tool integrations
- API registry functionality
- Server initialization and MCP compliance

## Security

Enterprise-grade SSRF protection built-in:
- Blocks private/localhost IPs (192.168.x.x, 127.x.x.x, etc.)
- Validates URL schemes (HTTP/HTTPS only)
- Enforces allowlist when configured
- Request timeout and size limits
- Rate limiting per API endpoint

## Architecture

**Core Components:**
- **FSM Engine** - 6-phase state machine orchestration
- **Tool Registry** - Modular tool architecture with dependency injection
- **API Registry** - 65+ APIs with role-based selection
- **Security Layer** - SSRF guard with comprehensive validation
- **Type System** - Full TypeScript interfaces and schemas

## License

MIT - See [LICENSE](LICENSE) file for details.

## Version History

- **v0.2.0** - Complete refactor with Jest→Vitest migration, repository flattening, 6-phase FSM
- **v0.1.x** - Initial release with 6-phase workflow

---

**Built for modern AI orchestration** - Structured workflows meet intelligent automation.
