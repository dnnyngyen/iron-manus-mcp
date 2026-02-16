# Iron Manus MCP

MCP server for AI workflow orchestration with an 8-phase state machine.

## Overview

**8-Phase Workflow**: `INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE`

**Tools:**
- `JARVIS` - 8-phase workflow controller
- `APITaskAgent` - API discovery and fetching
- `PythonComputationalTool` - Python execution
- `IronManusStateGraph` - Session state management
- `SlideGenerator` - HTML slide generation
- `HealthCheck` - Runtime diagnostics

## Quick Start

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

Or manually add to your MCP config:
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

Environment variables:
```bash
ALLOWED_HOSTS=api.github.com,httpbin.org    # SSRF whitelist
ENABLE_SSRF_PROTECTION=true                  # Security toggle
KNOWLEDGE_MAX_CONCURRENCY=2                  # API concurrency limit
KNOWLEDGE_TIMEOUT_MS=4000                    # Request timeout
```

## Security

- SSRF protection blocks private IPs (192.168.x.x, 127.x.x.x, etc.)
- URL validation (HTTP/HTTPS only)
- Allowlist enforcement when configured
- Request timeout and size limits

## License

MIT
