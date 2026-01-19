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

Iron Manus MCP is a Model Context Protocol (MCP) server that orchestrates AI workflows with a
clear 8-phase control flow and a small set of focused tools.

### 📹 GIF Demo

<img src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWpiYWd4eWx6bWlwcHA5Z3QxOGR1Nzh6aWcyY3hzMGlpaGpqYm12ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7fqy8AAeJusLTkSGzF/giphy.gif" alt="Iron Manus MCP Demo" width="650">

#### 🎥 Video Tutorials
Iron Manus MCP is a Model Context Protocol (MCP) server that orchestrates AI workflows with a
clear 8-phase control flow and a small set of focused tools.

| **Quick Demo** | **Demo + Explanations** |
|:---:|:---:|
| [![Iron Manus MCP Demo](https://img.youtube.com/vi/CWuQ_PvZkOs/mqdefault.jpg)](https://www.youtube.com/watch?v=CWuQ_PvZkOs) | [![Iron Manus MCP Deep Dive](https://img.youtube.com/vi/EFVQT3pmyTc/mqdefault.jpg)](https://www.youtube.com/watch?v=EFVQT3pmyTc) |
| **[Watch the quick demo](https://www.youtube.com/watch?v=CWuQ_PvZkOs)** | **[Watch the detailed walkthrough](https://www.youtube.com/watch?v=EFVQT3pmyTc)** |

## Overview

**8-phase control flow**: `INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE`

**Core capabilities**
- Phase-based orchestration with session state and phase gating.
- Unified tools for API research and Python analysis.
- SSRF protection and configuration validation.
- Optional slide generation tool for structured presentations.

## Tools

The MCP server registers the following tools:

- **JARVIS**: Controller for the 8-phase workflow.
- **APITaskAgent**: API discovery + validation + fetch workflow in one tool.
- **PythonComputationalTool**: Unified Python execution and data analysis.
- **IronManusStateGraph**: Session state graph management.
- **SlideGenerator**: HTML slide rendering from templates.
- **HealthCheck**: Runtime health diagnostics.

See the detailed schemas and examples in [docs/API-REFERENCE.md](docs/API-REFERENCE.md).

## Quick start

### From source

```bash
git clone https://github.com/dnnyngyen/iron-manus-mcp
cd iron-manus-mcp
npm install
npm run build
npm start
```

### Docker

```bash
docker build -t iron-manus-mcp:local .
docker run -d --name iron-manus-mcp iron-manus-mcp:local
```

Or use docker-compose:

```bash
docker-compose up -d
```

## MCP integration (Claude Code)

Register the server after building:

```bash
claude mcp add iron-manus-mcp node dist/index.js
```

Or add it to your MCP config:

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

Configuration is driven by environment variables. Common settings:

- `ALLOWED_HOSTS` (comma-separated allowlist)
- `ENABLE_SSRF_PROTECTION` (`true`/`false`)
- `KNOWLEDGE_MAX_CONCURRENCY`
- `KNOWLEDGE_TIMEOUT_MS`
- `USER_AGENT`

See [src/config.ts](src/config.ts) and [docker-compose.yml](docker-compose.yml) for the full list.

## Development

```bash
npm run build
npm run lint
npm run format
npm test
```

## Documentation

- [Getting Started](docs/GETTING_STARTED.md)
- [Architecture](docs/ARCHITECTURE.md)
- [API Reference](docs/API-REFERENCE.md)
- [Orchestration](docs/ORCHESTRATION.md)
- [Security](SECURITY.md)

## License

MIT. See [LICENSE](LICENSE).
