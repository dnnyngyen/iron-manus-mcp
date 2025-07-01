<img src="banner.png" alt="Iron Manus MCP Banner" width="100%" height="250">

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/dnnyngyen/iron-manus-mcp/actions)
[![Tests](https://img.shields.io/badge/tests-107%2F107-brightgreen.svg)](https://github.com/dnnyngyen/iron-manus-mcp/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# 🦾 Iron Manus MCP (J.A.R.V.I.S.)

> **Claude-code MCP server that spawns agents as tools** - An agent orchestration system that lets Claude autonomously break down complex workflows by structured phases and delegate to subagents with native context management.

## Fit over 300k+ tokens in one session!

<div align="center">

### 📹 GIF Demo
<img src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWpiYWd4eWx6bWlwcHA5Z3QxOGR1Nzh6aWcyY3hzMGlpaGpqYm12ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7fqy8AAeJusLTkSGzF/giphy.gif" alt="Iron Manus MCP Demo" width="650">

#### 🎥 Video Tutorials

| **Quick Demo** | **Demo + Explanations** |
|:---:|:---:|
| [![Iron Manus MCP Demo](https://img.youtube.com/vi/CWuQ_PvZkOs/mqdefault.jpg)](https://www.youtube.com/watch?v=CWuQ_PvZkOs) | [![Iron Manus MCP Deep Dive](https://img.youtube.com/vi/EFVQT3pmyTc/mqdefault.jpg)](https://www.youtube.com/watch?v=EFVQT3pmyTc) |
| **[Watch the quick demo](https://www.youtube.com/watch?v=CWuQ_PvZkOs)** | **[Watch the detailed walkthrough](https://www.youtube.com/watch?v=EFVQT3pmyTc)** |

</div>

## What It Does

Iron Manus MCP is a comprehensive FSM-driven orchestration system that manages complex workflows through structured phases. It features a complete tool registry with JARVIS FSM controller and intelligent API selection from 65+ endpoints.

**6-Phase Workflow**: `QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY`

**Key Features:**
- 🔄 **6-Phase Orchestraion Loop** - Structured workflow orchestration with INIT/DONE states
- 🧠 **Optimized Context Management** - Subagent delegation enables 300k+ token conversations
- 🛠️ **Modular Tool Registry** - 5+ specialized tools with extensible architecture
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

Local installation with Claude Code:
```bash
# From the project directory after building
claude mcp add iron-manus-mcp node dist/index.js
```

**Note:** The `claude mcp add` command doesn't support complex Docker arguments. To use Iron Manus MCP with Docker in Claude Code, you need to manually add it to your configuration file.

Edit your Claude Code configuration file (typically `~/.config/claude/claude_config.json` or `~/Library/Application Support/Claude/claude_config.json` on macOS):

```json
{
  "mcpServers": {
    "iron-manus-mcp": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "ALLOWED_HOSTS=api.github.com,httpbin.org",
        "iron-manus-mcp:local"
      ]
    }
  }
}
```

**Note:** Replace `iron-manus-mcp:local` with:
- `iron-manus-mcp:local` - if you built it locally with `docker build -t iron-manus-mcp:local .`
- `dnnyngyen/iron-manus-mcp:latest` - once the image is published to Docker Hub

After adding this configuration, restart Claude Code for the changes to take effect.

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

## Docker Usage

### Quick Start with Docker

```bash
# Using pre-built image from Docker Hub
docker run -i --rm \
  -e ALLOWED_HOSTS="api.github.com,httpbin.org" \
  dnnyngyen/iron-manus-mcp:latest
```

### MCP Integration with Docker

Add to your `.mcp.json` configuration:
```json
{
  "mcpServers": {
    "iron-manus": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-e", "ALLOWED_HOSTS=api.github.com,httpbin.org",
        "-e", "KNOWLEDGE_MAX_CONCURRENCY=3",
        "dnnyngyen/iron-manus-mcp:latest"
      ]
    }
  }
}
```

### Building and Running Locally

```bash
# Build the Docker image
docker build -t iron-manus-mcp:local .

# Run with docker-compose (recommended)
docker-compose up

# Or run directly with Docker
docker run -i --rm \
  -e ALLOWED_HOSTS="api.github.com,httpbin.org,api.openai.com" \
  -e KNOWLEDGE_MAX_CONCURRENCY=2 \
  -e ENABLE_SSRF_PROTECTION=true \
  iron-manus-mcp:local
```

### Configuration with Docker

All environment variables can be passed using `-e` flags or configured in `docker-compose.yml`:

```bash
# Example with multiple configurations
docker run -i --rm \
  -e ALLOWED_HOSTS="api.github.com,httpbin.org" \
  -e KNOWLEDGE_MAX_CONCURRENCY=3 \
  -e KNOWLEDGE_TIMEOUT_MS=5000 \
  -e RATE_LIMIT_REQUESTS_PER_MINUTE=10 \
  -e ENABLE_SSRF_PROTECTION=true \
  iron-manus-mcp:local
```

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

See the complete list of configuration options in the [docker-compose.yml](docker-compose.yml) file.

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

### Enhanced Security with Claude Code Hooks Integration

Iron Manus MCP now features comprehensive security validation through [Claude Code Hooks](https://docs.anthropic.com/en/docs/claude-code/hooks) integration, providing deterministic security enforcement alongside the cognitive FSM layer.

**Built-in Security Features:**
- Blocks private/localhost IPs (192.168.x.x, 127.x.x.x, etc.)
- Validates URL schemes (HTTP/HTTPS only)
- Enforces allowlist when configured
- Request timeout and size limits
- Rate limiting per API endpoint

**Claude Code Hooks Security Enhancements:**
- **Command Validation**: PreToolUse hooks block dangerous bash commands (`rm -rf`, etc.)
- **Enhanced SSRF Protection**: Additional URL validation with allowlist enforcement
- **Code Quality Gates**: Output validation prevents security issues in generated code
- **Session Monitoring**: Comprehensive tracking of FSM progression and security events

See `.claude/HOOKS_INTEGRATION.md` for complete hook configuration and security implementation details.

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

- **v0.2.1** - Claude Code Hooks integration with enhanced security validation and intelligent feedback loops
- **v0.2.0** - Complete refactor with Jest→Vitest migration, repository flattening, 6-phase FSM
- **v0.1.x** - Initial release with 6-phase workflow

---

**Built for modern AI orchestration** - Structured workflows meet intelligent automation.
