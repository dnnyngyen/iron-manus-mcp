# Troubleshooting Iron Manus MCP Setup

## Common Setup Issues

### Bash Commands Not Working in Claude Code

**Symptoms:**
- `pwd`, `ls`, `git --version` all return "Error: Error"
- Cannot change directories or run basic shell commands
- Environment appears broken or restricted

**Solutions:**

#### Option 1: Use Alternative Terminal
1. Open a regular terminal (outside Claude Code)
2. Navigate to your desired directory
3. Run the setup commands:
   ```bash
   git clone https://github.com/dnnyngyen/iron-manus-mcp
   cd iron-manus-mcp
   npm install
   npm run build
   ```
4. Return to Claude Code and register the server:
   ```bash
   claude mcp add iron-manus-mcp node /full/path/to/iron-manus-mcp/dist/index.js
   ```

#### Option 2: Use Absolute Paths
If some bash functionality works, try using absolute paths:
```bash
npm install --prefix /Users/username/path/to/iron-manus-mcp
npm run build --prefix /Users/username/path/to/iron-manus-mcp
```

#### Option 3: Manual File Operations
Use Claude Code's native tools instead of bash:
- Use `Read` tool to examine files
- Use `Write` tool to create configuration files
- Use `LS` tool to list directories

### MCP Server Registration Issues

**Problem: "No MCP servers configured"**

**Verification Steps:**
1. Check that the build succeeded:
   ```bash
   ls /path/to/iron-manus-mcp/dist/index.js
   ```
2. Verify Node.js is accessible:
   ```bash
   node --version
   ```
3. Test server startup manually:
   ```bash
   node /path/to/iron-manus-mcp/dist/index.js
   ```
   (Should start but wait for input - press Ctrl+C to exit)

**Registration Command:**
```bash
cd /path/to/iron-manus-mcp
claude mcp add iron-manus-mcp node dist/index.js
```

**Alternative Registration with Full Path:**
```bash
claude mcp add iron-manus-mcp node /full/absolute/path/to/iron-manus-mcp/dist/index.js
```

### Build Failures

**Problem: TypeScript compilation errors**

**Solution:**
1. Check Node.js version (requires Node 18+):
   ```bash
   node --version
   ```
2. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. Try building with verbose output:
   ```bash
   npm run build -- --verbose
   ```

**Problem: Missing dependencies**

**Solution:**
```bash
npm install --force
npm audit fix
npm run build
```

### Permission Issues

**Problem: Cannot write to directories**

**Solutions:**
1. Check directory permissions:
   ```bash
   ls -la /path/to/parent/directory
   ```
2. Use a directory you have write access to
3. Try running with explicit permissions:
   ```bash
   chmod 755 /path/to/iron-manus-mcp
   ```

### Testing Installation

**Verify MCP Registration:**
```bash
/mcp
```
Expected output: List showing "iron-manus-mcp" server

**Test JARVIS Tool:**
Try this simple command in Claude Code:
```
Test the JARVIS FSM controller functionality
```

Expected: Tool responds with phase progression (QUERY -> ENHANCE -> KNOWLEDGE -> PLAN -> EXECUTE -> VERIFY)

**Check Available Tools:**
Look for these tool names:
- `mcp__iron-manus-mcp__JARVIS`
- `mcp__iron-manus-mcp__APISearch`
- `mcp__iron-manus-mcp__MultiAPIFetch`
- `mcp__iron-manus-mcp__KnowledgeSynthesize`
- `mcp__iron-manus-mcp__APIValidator`

## Environment-Specific Issues

### macOS Issues
- Ensure Xcode Command Line Tools are installed:
  ```bash
  xcode-select --install
  ```
- Check if using Apple Silicon (M1/M2):
  ```bash
  arch
  ```

### Windows Issues
- Use Git Bash or WSL for bash commands
- Ensure Node.js PATH is configured correctly
- Use forward slashes in paths: `/c/Users/username/...`

### Linux Issues
- Check Node.js installation method (nvm recommended)
- Verify npm permissions:
  ```bash
  npm config get prefix
  ```

## Getting Help

### Diagnostic Information to Gather
1. Operating system and version
2. Node.js version (`node --version`)
3. npm version (`npm --version`)
4. Claude Code version
5. Exact error messages
6. Directory structure (`ls -la`)

### Manual Verification Checklist
- [ ] Repository cloned successfully
- [ ] Dependencies installed (`node_modules` directory exists)
- [ ] Build completed (`dist` directory with `.js` files)
- [ ] MCP server registered (`/mcp` shows the server)
- [ ] Tools accessible (JARVIS responds to test)

### Alternative Setup Method
If all else fails, try this minimal approach:
1. Download the repository as ZIP
2. Extract to a simple path (no spaces): `/Users/username/iron-manus-mcp`
3. Open regular terminal and run setup commands
4. Use absolute paths for Claude Code registration

## Performance Issues

### Slow Startup
- Check for antivirus interference
- Verify sufficient disk space
- Monitor CPU/memory usage during startup

### Tool Response Delays
- Network connectivity (for API tools)
- Node.js memory allocation
- Too many concurrent MCP servers

## Still Having Issues?

1. Try the setup in a fresh directory
2. Use the exact commands from successful setup logs
3. Check Claude Code documentation for updates
4. Verify all prerequisites are met

The key insight is that the MCP server itself works correctly - most issues are environment-related during the setup phase.