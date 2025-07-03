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

**Cross-Platform Setup:**
```json
{
  "mcpServers": {
    "iron-manus": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "/path/to/your/iron-manus-mcp"
    }
  }
}
```

**Platform-Specific Configuration Locations:**
- **Windows**: `%USERPROFILE%\.claude\settings.json`
- **macOS/Linux**: `~/.claude/settings.json`

**Example with relative paths** (when Claude Code is run from project directory):
```json
{
  "mcpServers": {
    "iron-manus": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "."
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

**Unix/Linux/macOS:**
```bash
# Copy hook configuration example
cp .claude/hooks-example.json ~/.claude/settings.json
```

**Windows (PowerShell):**
```powershell
# Copy hook configuration example
Copy-Item .claude\hooks-example.json $env:USERPROFILE\.claude\settings.json
```

**Windows (Command Prompt):**
```cmd
# Copy hook configuration example
copy .claude\hooks-example.json %USERPROFILE%\.claude\settings.json
```

See `.claude/HOOKS_INTEGRATION.md` for complete setup instructions.

## Status: ✅ Production Ready

- MCP SDK v1.13.2 compatible
- All imports working correctly
- 107/107 tests passing (100% success rate)
- Claude Code Hooks integrated
- Enhanced security validation
- Production ready