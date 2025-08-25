---
title: "Iron Manus MCP Command Reference"
topics: ["commands", "CLI", "quick reference", "shortcuts"]
related: ["quick/SETUP.md", "quick/TROUBLESHOOTING.md", "core/TOOLS.md"]
---

# Iron Manus MCP Command Reference

**Quick reference for essential commands and operations.**

## Setup and Build Commands

### Installation
```bash
# Quick setup (recommended)
npm run setup

# Manual installation
npm install
npm run build

# Test installation
npm test
```

### Development
```bash
# Start development mode
npm run dev

# Build for production
npm run build

# Run tests
npm test
npm run test:nocov    # Without coverage

# Linting and formatting
npm run lint
npm run format
npm run check         # Run lint + format + tests
```

## MCP Registration

### Register with Claude Code
```bash
# From project directory
claude mcp add iron-manus-mcp node dist/index.js

# With full path
claude mcp add iron-manus-mcp node /full/path/to/iron-manus-mcp/dist/index.js

# Verify registration
/mcp
```

### Server Management
```bash
# List registered servers
/mcp

# Check server status
/mcp status iron-manus-mcp

# Remove server
claude mcp remove iron-manus-mcp
```

## Docker Commands

### Basic Docker Operations
```bash
# Pull stable version
docker pull dnnyngyen/iron-manus-mcp:0.2.3

# Run container
docker run -d --name iron-manus-mcp dnnyngyen/iron-manus-mcp:0.2.3

# View logs
docker logs iron-manus-mcp

# Stop container
docker stop iron-manus-mcp
```

### Docker Compose
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f iron-manus-mcp

# Stop services
docker-compose down
```

## JARVIS FSM Commands

### Basic Usage
```bash
# Start new session
Use JARVIS to test basic functionality

# Test with objective
Use JARVIS with objective: "Create a simple hello world application"

# Continue session
Use JARVIS with session_id: "existing_session_123"
```

### FSM Phase Commands
```bash
# Phase progression test
Use JARVIS to demonstrate the 8-phase workflow

# Skip to specific phase
Use JARVIS with phase_completed: "QUERY" to continue from ENHANCE phase

# Session diagnostics
Use JARVIS to show current session status and phase details
```

## Tool Usage Commands

### Core Tools
```bash
# APITaskAgent (unified API research)
Use APITaskAgent with objective: "Research cryptocurrency prices" and user_role: "analyzer"

# PythonComputationalTool (unified Python operations)
Use PythonComputationalTool with operation: "data_analysis" and input_data: "csv_data"

# Task (agent spawning)
Use Task with meta-prompt: "(ROLE: coder) (CONTEXT: react_auth) (PROMPT: Build login form) (OUTPUT: components)"
```

### Phase-Specific Tools
```bash
# KNOWLEDGE phase
Use WebSearch for "microservices architecture patterns"
Use APITaskAgent for structured API research

# EXECUTE phase
Use Bash for "ls -la"
Use Read for file examination
Use Write for file creation

# VERIFY phase
Use Read for output verification
Use PythonComputationalTool for data validation
```

## Environment Configuration

### Essential Environment Variables
```bash
# API Configuration
export KNOWLEDGE_MAX_CONCURRENCY=2
export KNOWLEDGE_TIMEOUT_MS=4000

# Security Configuration
export ALLOWED_HOSTS="api.github.com,httpbin.org"
export ENABLE_SSRF_PROTECTION=true

# Quality Configuration
export MIN_COMPLETION_PERCENT=70
export USER_AGENT="Iron-Manus-MCP/0.2.4"
```

### Advanced Configuration
```bash
# Development Mode
export IRON_MANUS_DEBUG=true
export HOOK_DEBUG=true

# Performance Tuning
export API_RATE_LIMIT=10
export API_BURST_LIMIT=20
export SESSION_LOG_PATH=~/.claude/iron-manus-log.txt
```

## Hooks Integration Commands

### Setup Hooks
```bash
# Copy hooks configuration
cp .claude/hooks-example.json .claude/hooks.json

# Make scripts executable
chmod +x scripts/iron-manus/*.py

# Test security validator
echo '{"tool_name": "Bash", "tool_input": {"command": "echo test"}}' | \
  scripts/iron-manus/security-validator.py
```

### Hooks Debugging
```bash
# Check hook execution
grep "hook_execute" ~/.claude/iron-manus-log.txt

# View security violations
grep "security_violation" ~/.claude/iron-manus-log.txt

# Monitor session tracking
tail -f ~/.claude/iron-manus-log.txt
```

## Troubleshooting Commands

### Diagnostic Commands
```bash
# Check build status
ls -la dist/

# Verify Node.js version
node --version

# Test server startup
node dist/index.js

# Check permissions
ls -la scripts/iron-manus/
```

### Common Fixes
```bash
# Clean rebuild
rm -rf node_modules package-lock.json dist/
npm install
npm run build

# Fix permissions
chmod +x scripts/iron-manus/*

# Clear cache
npm cache clean --force
```

### Log Analysis
```bash
# View session logs
tail -f ~/.claude/iron-manus-log.txt

# Check for errors
grep -i "error" ~/.claude/iron-manus-log.txt

# Performance metrics
grep "performance" ~/.claude/iron-manus-log.txt
```

## Platform-Specific Commands

### macOS
```bash
# Install Xcode tools
xcode-select --install

# Check architecture
arch

# Process management
pkill -f iron-manus
```

### Windows (PowerShell)
```powershell
# Clean installation
Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue
npm cache clean --force
npm install

# Process management
Get-Process -Name "*iron-manus*" | Stop-Process -Force
```

### Linux
```bash
# Install via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18

# Permission fixes
chmod 755 scripts/iron-manus/
```

## Advanced Usage Patterns

### Multi-Server Coordination
```bash
# Register multiple servers
claude mcp add iron-manus-mcp node dist/index.js
claude mcp add specialized-server node /path/to/other/server.js

# Use with namespacing
Use mcp__iron-manus-mcp__JARVIS for orchestration
Use mcp__specialized-server__Tool for specific tasks
```

### Development Workflow
```bash
# Development cycle
npm run dev          # Watch mode
npm run lint --fix   # Fix linting issues
npm test            # Run tests
npm run build       # Production build
```

### Session Management
```bash
# Create session directory
mkdir -p /tmp/iron-manus-session-$(date +%s)

# Monitor sessions
ls -la iron-manus-sessions/

# Clean old sessions
rm -rf iron-manus-sessions/session_*
```

## Quick Reference Card

### Most Used Commands
| Command | Purpose |
|---------|---------|
| `npm run setup` | Complete installation |
| `npm test` | Run test suite |
| `claude mcp add iron-manus-mcp node dist/index.js` | Register server |
| `/mcp` | List servers |
| `Use JARVIS to test functionality` | Basic test |

### Essential Files
| File | Purpose |
|------|---------|
| `dist/index.js` | Built server |
| `package.json` | Dependencies |
| `.claude/hooks.json` | Hooks config |
| `scripts/iron-manus/` | Hook scripts |

### Key Environment Variables
| Variable | Purpose |
|----------|---------|
| `KNOWLEDGE_MAX_CONCURRENCY` | API concurrency |
| `ALLOWED_HOSTS` | SSRF protection |
| `ENABLE_SSRF_PROTECTION` | Security toggle |
| `MIN_COMPLETION_PERCENT` | Quality threshold |

### Support Resources
- **Setup issues**: quick/TROUBLESHOOTING.md
- **API reference**: api/ENDPOINTS.md
- **Tool documentation**: core/TOOLS.md
- **Integration help**: guides/INTEGRATION.md