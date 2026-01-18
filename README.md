# Iron Manus MCP (J.A.R.V.I.S.)

Iron Manus MCP is a Model Context Protocol (MCP) server that orchestrates AI workflows with a
clear 8-phase control flow and a small set of focused tools.

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
