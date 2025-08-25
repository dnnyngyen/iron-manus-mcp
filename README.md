[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/dnnyngyen-iron-manus-mcp-badge.png)](https://mseep.ai/app/dnnyngyen-iron-manus-mcp)

<img src="banner.png" alt="Iron Manus MCP Banner" width="100%" height="250">

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/dnnyngyen/iron-manus-mcp/actions)
[![Tests](https://img.shields.io/badge/tests-266%2F266-brightgreen.svg)](https://github.com/dnnyngyen/iron-manus-mcp/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-green.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker Hub](https://img.shields.io/badge/Docker_Hub-v0.2.3-blue.svg)](https://hub.docker.com/r/dnnyngyen/iron-manus-mcp)
[![GitHub Container Registry](https://img.shields.io/badge/GHCR-v0.2.3-blue.svg)](https://github.com/dnnyngyen/iron-manus-mcp/pkgs/container/iron-manus-mcp)
[![Source Code](https://img.shields.io/badge/Source-v0.2.4-green.svg)](https://github.com/dnnyngyen/iron-manus-mcp)

# Iron Manus MCP (J.A.R.V.I.S.)

**Model Context Protocol server for AI workflow orchestration** - An 8-phase finite state machine that manages complex AI workflows through structured phases and agent delegation with session state management.

## Extended context management through agent delegation

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

Iron Manus MCP is an 8-phase finite state machine for AI workflow orchestration. The system includes a unified tool registry with JARVIS FSM Controller and API selection from 65+ endpoints.

**8-Phase Workflow**: `INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE`

**Key Features:**

- 🔄 **8-Phase Workflow** - Structured workflow orchestration with deterministic state transitions
- 🧠 **Context Management** - Agent delegation for extended conversation handling
- 🛠️ **Unified Tool Registry** - APITaskAgent and PythonComputationalTool with supporting tools
- 📡 **65+ API Registry** - API discovery and selection from available endpoints
- 🔒 **SSRF Protection** - Production security with allowlist validation
- ✅ **266 Tests** - Test suite with 100% success rate using Vitest
- 📦 **ES Modules** - TypeScript 5.0 with modern JavaScript support

## Quick Start

> **📦 Docker Images**: v0.2.3 (stable, published)  
> **📄 Source Code**: v0.2.4 (latest, with comprehensive JSDoc documentation)

### Option 1: Docker (Recommended - v0.2.3)

**Docker Hub:**
```bash
# Pull and run from Docker Hub (v0.2.3 - stable)
docker pull dnnyngyen/iron-manus-mcp:0.2.4
docker run -d --name iron-manus-mcp dnnyngyen/iron-manus-mcp:0.2.3

# Alternative: Use latest tag
docker pull dnnyngyen/iron-manus-mcp:latest
docker run -d --name iron-manus-mcp dnnyngyen/iron-manus-mcp:latest

# Or using docker-compose
curl -O https://raw.githubusercontent.com/dnnyngyen/iron-manus-mcp/main/docker-compose.yml
docker-compose up -d
```

**GitHub Container Registry:**
```bash
# Pull and run from GitHub Container Registry (v0.2.3 - stable)
docker pull ghcr.io/dnnyngyen/iron-manus-mcp:0.2.3
docker run -d --name iron-manus-mcp ghcr.io/dnnyngyen/iron-manus-mcp:0.2.3

# Alternative: Use latest tag
docker pull ghcr.io/dnnyngyen/iron-manus-mcp:latest
docker run -d --name iron-manus-mcp ghcr.io/dnnyngyen/iron-manus-mcp:latest
```

### Option 2: From Source (v0.2.4 - Latest with JSDoc)

**Quick Setup (Cross-Platform):**
```bash
# Clone and install (v0.2.4 - includes comprehensive JSDoc documentation)
git clone https://github.com/dnnyngyen/iron-manus-mcp
cd iron-manus-mcp

# Automated cross-platform installation
npm run setup
```

**Manual Installation:**
```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests (optional - 266 tests)
npm test

# Start server
npm start
```

> 📖 **Platform-Specific Instructions**: See [docs/CROSS_PLATFORM_SETUP.md](docs/CROSS_PLATFORM_SETUP.md) for detailed Windows, macOS, and Linux setup guides.

**If git clone fails with network errors:**
```bash
# Try with increased buffer and timeout
git clone --depth 1 https://github.com/dnnyngyen/iron-manus-mcp
# OR download as ZIP
curl -L https://github.com/dnnyngyen/iron-manus-mcp/archive/main.zip -o iron-manus-mcp.zip
unzip iron-manus-mcp.zip
cd iron-manus-mcp-main
```

**If npm install hangs or fails:**

**Unix/Linux/macOS:**
```bash
# Clean and retry
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --no-optional

# If it still fails, install core dependencies first:
npm install @modelcontextprotocol/sdk@^1.13.2 typescript@^5.0.0
npm run build
```

**Windows (PowerShell):**
```powershell
# Clean and retry
Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue
npm cache clean --force
npm install --no-optional

# If it still fails, install core dependencies first:
npm install @modelcontextprotocol/sdk@^1.13.2 typescript@^5.0.0
npm run build
```

**Windows (Command Prompt):**
```cmd
# Clean and retry
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul
npm cache clean --force
npm install --no-optional

# If it still fails, install core dependencies first:
npm install @modelcontextprotocol/sdk@^1.13.2 typescript@^5.0.0
npm run build
```

## ⚠️ Legacy File Prevention

This project uses knowledge graph state management. If you see files like `iron_manus_*.json`, immediately:

**Unix/Linux/macOS:**
1. Stop the server: `pkill -f iron-manus`
2. Remove files: `rm -f iron_manus_*.json` 
3. Clean rebuild: `rm -rf dist/ && npm run build`

**Windows (PowerShell):**
1. Stop the server: `Get-Process -Name "*iron-manus*" | Stop-Process -Force`
2. Remove files: `Remove-Item iron_manus_*.json -Force -ErrorAction SilentlyContinue`
3. Clean rebuild: `Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue; npm run build`

**Windows (Command Prompt):**
1. Stop the server: `taskkill /f /im node.exe /fi "WINDOWTITLE eq iron-manus*"`
2. Remove files: `del iron_manus_*.json 2>nul`
3. Clean rebuild: `rmdir /s /q dist 2>nul && npm run build`

See [LEGACY_PREVENTION.md](./docs/LEGACY_PREVENTION.md) for details.

**For MCP Integration:**

Local installation with Claude Code:
```bash
# From the project directory after building
claude mcp add iron-manus-mcp node dist/index.js

# Or add to MCP client settings.json:
{
  "mcpServers": {
    "iron-manus-mcp": {
      "command": "node",
      "args": ["path/to/iron-manus-mcp/dist/index.js"]
    }
  }
}
```

**For Claude Code Hooks (Optional):**

**Unix/Linux/macOS:**
```bash
# Copy example hooks configuration
cp .claude/hooks-example.json .claude/hooks.json

# Requires Python 3.7+ for validation scripts
python3 --version
```

**Windows (PowerShell):**
```powershell
# Copy example hooks configuration
Copy-Item .claude\hooks-example.json .claude\hooks.json

# Requires Python 3.7+ for validation scripts
python --version
```

**Windows (Command Prompt):**
```cmd
# Copy example hooks configuration
copy .claude\hooks-example.json .claude\hooks.json

# Requires Python 3.7+ for validation scripts
python --version
```

## Docker Usage

### Docker Compose (Recommended)

The easiest way to run Iron Manus MCP is using Docker Compose:

```yaml
# docker-compose.yml
services:
  iron-manus-mcp:
    image: dnnyngyen/iron-manus-mcp:0.2.3  # or :latest
    container_name: iron-manus-mcp
    restart: unless-stopped
    stdin_open: true
    tty: true
    environment:
      - KNOWLEDGE_MAX_CONCURRENCY=2
      - KNOWLEDGE_TIMEOUT_MS=4000
      - ALLOWED_HOSTS=api.github.com,httpbin.org,api.openai.com
      - ENABLE_SSRF_PROTECTION=true
```

```bash
# Start the service
docker-compose up -d

# View logs
docker-compose logs -f iron-manus-mcp

# Stop the service
docker-compose down
```

### Docker Commands

```bash
# Pull latest stable version (v0.2.3)
docker pull dnnyngyen/iron-manus-mcp:0.2.4

# Run with custom environment variables
docker run -d \
  --name iron-manus-mcp \
  -e KNOWLEDGE_MAX_CONCURRENCY=3 \
  -e ALLOWED_HOSTS="api.github.com,httpbin.org" \
  dnnyngyen/iron-manus-mcp:0.2.3

# View container logs
docker logs iron-manus-mcp

# Stop and remove container
docker stop iron-manus-mcp && docker rm iron-manus-mcp
```

### Available Tags

**Docker Registry Tags:**
- `0.2.3` - Current stable published version (recommended for production)
- `latest` - Points to v0.2.3 stable release
- `stable` - Alias for v0.2.3

**Available Registries:**
- Docker Hub: `dnnyngyen/iron-manus-mcp:0.2.3`
- GitHub Container Registry: `ghcr.io/dnnyngyen/iron-manus-mcp:0.2.3`

> **Note**: Source code v0.2.4 includes comprehensive JSDoc documentation improvements.
> Docker images will be updated to v0.2.4 in the next release.

### MCP Integration with Docker

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

**8-Phase Flow:**
1. **INIT** - Session initialization (internal state setup)
2. **QUERY** - Analyze user objective, initialize workflow, and detect optimal role
3. **ENHANCE** - Add missing requirements and context
4. **KNOWLEDGE** - Auto-discover relevant APIs and patterns
5. **PLAN** - Create structured tasks with meta-prompts
6. **EXECUTE** - Process tasks with specialized tools
7. **VERIFY** - Validate completion and quality
8. **DONE** - Complete session and cleanup

## Available Tools

- `JARVIS` - Main FSM controller (8-phase orchestration)
- `APISearch` - Intelligent API discovery from 65+ endpoint registry
- `MultiAPIFetch` - Parallel HTTP requests with SSRF protection
- `IronManusStateGraph` - Project-scoped FSM state management
- `APIValidator` - Response validation and confidence scoring

## Development

**Prerequisites:**
- Node.js 18+ (tested with 18.x, 20.x, 22.x)
- npm 8+
- TypeScript 5.0+
- Python 3.7+ (for optional Claude Code hooks)
- Git (for source installation)

**Available Scripts:**
```bash
npm run build        # TypeScript compilation
npm test            # Run full test suite (266 tests)
npm run test:nocov   # Run tests without coverage
npm run lint        # ESLint checking (with enhanced rules)
npm run format      # Prettier formatting
npm start          # Start compiled server
npm run dev         # Fast incremental compilation + watch mode
npm run dev:simple  # Simple dev script (fallback)
npm run check       # Run lint + format + tests in parallel
npm run check:fix   # Auto-fix lint/format issues + run tests
```

**Configuration:**
Environment variables with enhanced validation:
```bash
KNOWLEDGE_MAX_CONCURRENCY=2          # API concurrency limit (1-10)
KNOWLEDGE_TIMEOUT_MS=4000            # Request timeout (1000-30000ms)
ALLOWED_HOSTS="api.github.com,httpbin.org"  # SSRF whitelist
ENABLE_SSRF_PROTECTION=true          # Security toggle (required in production)
MIN_COMPLETION_PERCENT=70            # Quality threshold (50-100)
USER_AGENT="Iron-Manus-MCP/0.2.4-AutoFetch"    # Service identification
```

**Enhanced Features (v0.2.4+):**
- ✅ **Zod Schema Validation** - Type-safe configuration with detailed error messages
- ⚡ **Optimized Dev Experience** - Incremental TypeScript compilation with parallel tools
- 🔧 **Enhanced ESLint Rules** - Strict type checking and code quality enforcement
- 🚀 **Parallel Script Execution** - Run lint, format, and tests concurrently

See the complete list of configuration options in the [docker-compose.yml](docker-compose.yml) file.

## Testing

Comprehensive test suite with 266 tests using Vitest:

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

### Security with Claude Code Hooks Integration

Iron Manus MCP includes security validation through [Claude Code Hooks](https://docs.anthropic.com/en/docs/claude-code/hooks) integration, providing deterministic security enforcement with the finite state machine.

**Built-in Security Features:**
- Blocks private/localhost IPs (192.168.x.x, 127.x.x.x, etc.)
- Validates URL schemes (HTTP/HTTPS only)
- Enforces allowlist when configured
- Request timeout and size limits
- Rate limiting per API endpoint

**Claude Code Hooks Security Features:**
- **Command Validation**: PreToolUse hooks block dangerous bash commands (`rm -rf`, etc.)
- **SSRF Protection**: URL validation with allowlist enforcement
- **Code Quality Gates**: Output validation prevents security issues in generated code
- **Session Monitoring**: FSM progression and security event tracking

See `.claude/HOOKS_INTEGRATION.md` for complete hook configuration and security implementation details.

## Architecture

**Core Components:**
- **FSM Engine** - 8-phase state machine orchestration
- **Tool Registry** - Unified tool architecture with APITaskAgent and PythonComputationalTool
- **API Registry** - 65+ endpoints with role-based selection
- **Security Layer** - SSRF protection with input validation
- **Type System** - TypeScript interfaces and schemas

## License

MIT - See [LICENSE](LICENSE) file for details.

## Version History

- **v0.2.4** - (Source) Comprehensive JSDoc documentation, professional standards
- **v0.2.3** - (Docker) Published Docker images with clean configuration 
- **v0.2.2** - Stable release with test coverage and build improvements
- **v0.2.1** - Claude Code Hooks integration with security validation
- **v0.2.0** - Refactor with Jest→Vitest migration, repository flattening, 8-phase FSM
- **v0.1.x** - Initial release with 6-phase workflow

> **Current Status**: Docker images (v0.2.3) provide stable functionality, while source code (v0.2.4) includes the latest documentation improvements.

---

**AI workflow orchestration** - Structured workflows with intelligent automation.
