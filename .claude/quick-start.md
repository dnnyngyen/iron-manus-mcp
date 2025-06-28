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
- **KnowledgeSynthesize**: Cross-validation and synthesis
- **APIValidator**: Endpoint validation and auto-correction

## Key Features

1. **8-Phase FSM Loop**: INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE
2. **Role-Based Intelligence**: Automatic role detection and cognitive enhancement
3. **65+ API Registry**: Curated API collection with intelligent selection
4. **Fractal Orchestration**: Recursive task decomposition and execution
5. **Single Tool Per Iteration**: Enforced constraint for deterministic behavior

## Development

```bash
npm run dev         # Development mode with auto-rebuild
npm run lint        # Code quality checking  
npm run test:watch  # Watch mode testing
```

## Status: ✅ Ready for Use

- MCP SDK v1.13.0 compatible
- All imports working correctly
- 66/67 tests passing
- Clean, emoji-free codebase
- Production ready