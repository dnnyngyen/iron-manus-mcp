---
title: "Iron Manus MCP Quick Setup Guide"
topics: ["installation", "setup", "docker", "npm", "getting started"]
related: ["core/ARCHITECTURE.md", "guides/INTEGRATION.md", "quick/TROUBLESHOOTING.md"]
---

# Iron Manus MCP Quick Setup Guide

**Fast installation and setup for Iron Manus MCP - get running in under 5 minutes.**

## Prerequisites

- **Node.js 18+** (tested with 18.x, 20.x, 22.x)
- **npm 8+** 
- **Python 3.7+** (for optional Claude Code hooks)
- **Git** (for source installation)

## Option 1: Docker (Recommended)

**Docker Hub (Stable v0.2.3):**
```bash
# Pull and run stable version
docker pull dnnyngyen/iron-manus-mcp:0.2.3
docker run -d --name iron-manus-mcp dnnyngyen/iron-manus-mcp:0.2.3

# Or use docker-compose
curl -O https://raw.githubusercontent.com/dnnyngyen/iron-manus-mcp/main/docker-compose.yml
docker-compose up -d
```

**GitHub Container Registry:**
```bash
# Alternative registry
docker pull ghcr.io/dnnyngyen/iron-manus-mcp:0.2.3
docker run -d --name iron-manus-mcp ghcr.io/dnnyngyen/iron-manus-mcp:0.2.3
```

## Option 2: From Source (Latest v0.2.4)

**Quick Installation:**
```bash
# Clone and install
git clone https://github.com/dnnyngyen/iron-manus-mcp
cd iron-manus-mcp

# Automated setup
npm run setup
```

**Manual Installation:**
```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests (optional - 323 tests)
npm test

# Start server
npm start
```

## MCP Registration

Register with Claude Code:
```bash
# From project directory
claude mcp add iron-manus-mcp node dist/index.js

# Or with full path
claude mcp add iron-manus-mcp node /full/path/to/iron-manus-mcp/dist/index.js
```

**Verify Registration:**
```bash
/mcp
```
Look for "iron-manus-mcp" in the server list.

## Quick Test

Test the JARVIS FSM controller:
```
Test the JARVIS FSM controller functionality
```

Expected: Tool responds with 8-phase workflow progression.

## Environment Configuration

**Optional Environment Variables:**
```bash
# API Settings
export KNOWLEDGE_MAX_CONCURRENCY=2
export KNOWLEDGE_TIMEOUT_MS=4000

# Security Settings
export ALLOWED_HOSTS="api.github.com,httpbin.org"
export ENABLE_SSRF_PROTECTION=true

# Quality Settings
export MIN_COMPLETION_PERCENT=70
```

## Claude Code Hooks (Optional)

For enhanced security and validation:

```bash
# Copy hooks configuration
cp .claude/hooks-example.json .claude/hooks.json

# Make scripts executable
chmod +x scripts/iron-manus/*.py

# Test hooks
python3 --version  # Verify Python 3.7+
```

## Platform-Specific Notes

### macOS
```bash
# Install Xcode Command Line Tools if needed
xcode-select --install
```

### Windows
```bash
# Use Git Bash or WSL
# Ensure Node.js PATH is configured
```

### Linux
```bash
# Recommended: Use nvm for Node.js installation
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
```

## Common Issues

### Git Clone Network Errors
```bash
# Try with depth limit
git clone --depth 1 https://github.com/dnnyngyen/iron-manus-mcp

# Or download ZIP
curl -L https://github.com/dnnyngyen/iron-manus-mcp/archive/main.zip -o iron-manus-mcp.zip
unzip iron-manus-mcp.zip
```

### npm Install Hangs
```bash
# Clean and retry
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --no-optional
```

### Bash Commands Don't Work in Claude Code
- Use regular terminal for setup commands
- Then register with Claude Code using absolute paths
- See quick/TROUBLESHOOTING.md for detailed solutions

## Verification Checklist

- [ ] Repository cloned/downloaded successfully
- [ ] Dependencies installed (node_modules exists)
- [ ] Build completed (dist directory with .js files)
- [ ] MCP server registered (`/mcp` shows server)
- [ ] JARVIS tool responds to test command
- [ ] Optional: Hooks configured and executable

## Next Steps

1. **Try basic workflow**: Use JARVIS with simple objective
2. **Read architecture**: See core/ARCHITECTURE.md for system details
3. **Explore tools**: Check core/TOOLS.md for available capabilities
4. **Advanced features**: Review guides/METAPROMPTS.md for agent spawning

## Support

- **Setup issues**: See quick/TROUBLESHOOTING.md
- **Integration help**: See guides/INTEGRATION.md
- **API reference**: See api/ENDPOINTS.md

**Iron Manus MCP v0.2.4** - Production-ready AI orchestration platform with 8-phase FSM workflow and 323 passing tests.