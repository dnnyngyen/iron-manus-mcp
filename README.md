[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/dnnyngyen-iron-manus-mcp-badge.png)](https://mseep.ai/app/dnnyngyen-iron-manus-mcp)

<img src="banner.png" alt="Iron Manus MCP Banner" width="100%" height="250">

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/dnnynguyen/iron-manus-mcp/actions)
[![Tests](https://img.shields.io/badge/tests-266%2F266-brightgreen.svg)](https://github.com/dnnynguyen/iron-manus-mcp/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-green.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker Hub](https://img.shields.io/badge/Docker_Hub-v0.2.3-blue.svg)](https://hub.docker.com/r/dnnyngyen/iron-manus-mcp)
[![GitHub Container Registry](https://img.shields.io/badge/GHCR-v0.2.3-blue.svg)](https://github.com/dnnynguyen/iron-manus-mcp/pkgs/container/iron-manus-mcp)
[![Source Code](https://img.shields.io/badge/Source-v0.2.4-green.svg)](https://github.com/dnnynguyen/iron-manus-mcp)

# Iron Manus MCP (J.A.R.V.I.S.)

**Model Context Protocol server for AI workflow orchestration** - An 8-phase workflow engine that manages complex AI tasks through structured phases and agent delegation with session state management.

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

8-phase workflow orchestration: `INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE`

**Tools:**
- `JARVIS` - 8-phase workflow controller
- `APITaskAgent` - API discovery and fetching with SSRF protection
- `PythonComputationalTool` - Python execution for data analysis
- `IronManusStateGraph` - Session state management
- `SlideGenerator` - HTML slide generation
- `HealthCheck` - Runtime diagnostics

## Quick Start

### From Source

```bash
git clone https://github.com/dnnyngyen/iron-manus-mcp
cd iron-manus-mcp
npm install
npm run build
npm start
```

### Docker

```bash
docker build -t iron-manus-mcp .
docker run -d --name iron-manus-mcp iron-manus-mcp
```

Or with docker-compose:
```bash
docker-compose up -d
```

## MCP Integration

Add to Claude Code:
```bash
claude mcp add iron-manus-mcp node dist/index.js
```

Or add to your MCP config:
```json
{
  "mcpServers": {
    "iron-manus-mcp": {
      "command": "node",
      "args": ["path/to/iron-manus-mcp/dist/index.js"]
    }
  }
}
```

## Configuration

```bash
ALLOWED_HOSTS=api.github.com,httpbin.org    # SSRF whitelist
ENABLE_SSRF_PROTECTION=true                  # Enable security
KNOWLEDGE_MAX_CONCURRENCY=2                  # API concurrency limit
KNOWLEDGE_TIMEOUT_MS=4000                    # Request timeout (ms)
```

## Development

```bash
npm run build     # Compile TypeScript
npm run lint      # Check code style
npm run format    # Format code
npm start         # Run server
npm run dev       # Build + watch mode
```

## Security

- SSRF protection blocks private IPs (192.168.x.x, 127.x.x.x, etc.)
- URL validation (HTTP/HTTPS only)
- Host allowlist enforcement
- Request timeout and size limits

## License

MIT
