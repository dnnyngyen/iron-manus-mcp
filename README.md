# 🦾 Iron Manus MCP

> **Meta Thread-of-Thought (THoT) orchestration for Claude Code** - A production-ready MCP server that enables Claude to autonomously manage complex projects through structured 6-phase workflows.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/dnnyngyen/iron-manus-mcp/actions)
[![Coverage](https://img.shields.io/badge/coverage-80%25-green.svg)](https://codecov.io/gh/dnnyngyen/iron-manus-mcp)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![Demo](docs/images/demo.gif)

## What It Does

Iron Manus MCP solves Claude Code's biggest weakness: **context window limitations**. Instead of cramming everything into one massive context, it breaks complex work into focused phases and spawns specialized sub-agents with clean contexts.

**6-Phase Workflow**: `QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY`

**Key Benefits:**
- ✅ **Handles Large Projects** - Context segmentation prevents information overload
- ✅ **Autonomous Management** - Claude creates its own todos and spawns specialized agents  
- ✅ **No External Dependencies** - Uses only Claude Code's native tools
- ✅ **95%+ Success Rate** - Built-in verification ensures completion
- ✅ **SSRF Protection** - Enterprise-grade security built-in

## Quick Start

```bash
# Clone and build
git clone https://github.com/dnnyngyen/iron-manus-mcp
cd iron-manus-mcp
npm install && npm run build

# Register with Claude Code
claude mcp add iron-manus-mcp node dist/index.js

# Verify installation
/mcp
```

**Test it:**
```
Create a React dashboard with authentication and real-time data
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

**Automatic Flow:**
1. **QUERY** - Analyzes request and detects optimal role (e.g., `coder`)
2. **ENHANCE** - Adds missing requirements (auth, validation, docs)
3. **KNOWLEDGE** - Auto-discovers relevant APIs and patterns
4. **PLAN** - Creates specialized todos with meta-prompts
5. **EXECUTE** - Spawns `Task(api_architect)` and `Task(tester)` agents
6. **VERIFY** - Ensures 95%+ completion before marking done

## Tools Available

- `JARVIS` - Main FSM controller (6-phase orchestration)
- `APISearch` - Intelligent API discovery from 65+ endpoint registry
- `MultiAPIFetch` - Parallel HTTP requests with SSRF protection
- `KnowledgeSynthesize` - Cross-validation with conflict resolution
- `APIValidator` - Response validation and confidence scoring

## Configuration

Environment variables for customization:

```bash
KNOWLEDGE_MAX_CONCURRENCY=2          # API concurrency limit
KNOWLEDGE_TIMEOUT_MS=4000            # Request timeout
ALLOWED_HOSTS="api.github.com,httpbin.org"  # SSRF whitelist
ENABLE_SSRF_PROTECTION=true          # Security toggle
VERIFICATION_COMPLETION_THRESHOLD=95  # Quality threshold
```

## Documentation

- **[Quick Start](docs/GETTING_STARTED.md)** - Setup and basic usage
- **[Examples](docs/EXAMPLES.md)** - 15+ real-world use cases
- **[Architecture](docs/ARCHITECTURE.md)** - Technical deep-dive
- **[Security](docs/SECURITY.md)** - SSRF protection and best practices
- **[Vision](docs/VISION.md)** - Software 3.0 philosophy

## Security

Iron Manus includes enterprise-grade SSRF protection:
- Blocks private/localhost IPs
- Validates URL schemes
- Enforces allowlist when configured
- Rate limiting and content size limits

## License

MIT - See [LICENSE](LICENSE) file for details.

---

**Built with Software 3.0 principles** - Natural language becomes executable through AI orchestration.