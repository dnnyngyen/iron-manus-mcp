# Quick Start Guide

## Setup & Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests (optional)
npm test

# Start the MCP server
npm start
```

## Using with Claude Desktop

Add this to your Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "iron-manus": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "/Users/dannynguyen/iron-manus-mcp"
    }
  }
}
```

## Available Tools

- **JARVIS**: Main FSM controller with 8-phase agent loop
- **MultiAPIFetch**: Parallel API data gathering  
- **APISearch**: Intelligent API discovery
- **IronManusStateGraph**: Project-scoped FSM state management
- **APIValidator**: Endpoint validation and auto-correction

## Key Features

1. **8-Phase FSM Loop**: INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE
2. **Role-Based Intelligence**: Automatic role detection and cognitive enhancement
3. **65+ API Registry**: Curated API collection with intelligent selection
4. **Claude Code Hooks**: Enhanced security validation and quality assurance
5. **Fractal Orchestration**: Recursive task decomposition and execution
6. **Intelligent Validation**: Output quality gates and rollback signaling

## Development

```bash
npm run dev         # Development mode with auto-rebuild
npm run lint        # Code quality checking  
npm test            # Full test suite (107 tests)
```

## Claude Code Hooks Integration

Configure hooks for enhanced security and quality:

```bash
# Copy hook configuration example
cp .claude/hooks-example.json ~/.claude/settings.json
```

See `.claude/HOOKS_INTEGRATION.md` for complete setup instructions.

## Status: ✅ Production Ready

- MCP SDK v1.13.2 compatible
- All imports working correctly
- 107/107 tests passing (100% success rate)
- Claude Code Hooks integrated
- Enhanced security validation
- Production ready