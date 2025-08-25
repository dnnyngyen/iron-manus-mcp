---
title: "Iron Manus MCP Troubleshooting Guide"
topics: ["troubleshooting", "errors", "debugging", "problems", "solutions"]
related: ["quick/SETUP.md", "core/SECURITY.md", "quick/FAQ.md"]
---

# Iron Manus MCP Troubleshooting Guide

**Comprehensive solutions for common setup issues, FSM errors, and runtime problems.**

## Quick Diagnostics

### Health Check Commands
```bash
# Check MCP registration
/mcp

# Test basic functionality
Use JARVIS to test basic functionality

# Verify build
ls -la dist/index.js

# Check Node.js version
node --version
```

## Setup Issues

### Bash Commands Not Working in Claude Code

**Symptoms:**
- `pwd`, `ls`, `git` commands return "Error: Error"
- Cannot run shell commands in Claude Code environment

**Solutions:**

#### Option 1: Use Alternative Terminal
```bash
# Open regular terminal
git clone https://github.com/dnnyngyen/iron-manus-mcp
cd iron-manus-mcp
npm install
npm run build

# Return to Claude Code for registration
claude mcp add iron-manus-mcp node /full/path/to/iron-manus-mcp/dist/index.js
```

#### Option 2: Use Absolute Paths
```bash
# If some functionality works
npm install --prefix /full/path/to/iron-manus-mcp
npm run build --prefix /full/path/to/iron-manus-mcp
```

#### Option 3: Use Native Tools
- Use `Read` tool to examine files
- Use `Write` tool to create files
- Use `LS` tool to list directories

### MCP Server Registration Failures

**Problem:** "No MCP servers configured"

**Diagnosis:**
```bash
# Check build exists
ls /path/to/iron-manus-mcp/dist/index.js

# Test Node.js accessibility
node --version

# Test server startup
node /path/to/iron-manus-mcp/dist/index.js
```

**Solutions:**
```bash
# Register from project directory
cd /path/to/iron-manus-mcp
claude mcp add iron-manus-mcp node dist/index.js

# Or use full absolute path
claude mcp add iron-manus-mcp node /full/absolute/path/to/iron-manus-mcp/dist/index.js
```

### Build Failures

**TypeScript compilation errors:**
```bash
# Check Node.js version (requires 18+)
node --version

# Clean rebuild
rm -rf node_modules package-lock.json dist/
npm install
npm run build
```

**Missing dependencies:**
```bash
# Force install
npm install --force
npm audit fix
npm run build
```

### Permission Issues

**Cannot write to directories:**
```bash
# Check permissions
ls -la /path/to/parent/directory

# Fix permissions
chmod 755 /path/to/iron-manus-mcp

# Make scripts executable
chmod +x scripts/iron-manus/*
```

## FSM Runtime Issues

### FSM Phase Transition Failures

**Symptoms:**
- JARVIS stuck in single phase
- No phase progression messages
- FSM appears frozen

**Diagnosis:**
```bash
# Check current session state
Use JARVIS to show current session status and phase details

# Look for phase indicators
# Expected: "Phase QUERY → ENHANCE transition ready"
```

**Solutions:**
```bash
# Reset session
Use JARVIS with session_id: "fresh_start_$(date +%s)"

# Use clearer objectives
Use JARVIS with objective: "Create a simple React component with JSX and props"

# Check tool availability
# Ensure TodoWrite and Task tools are accessible
```

### Meta-Prompt Validation Errors

**Problem:** Agent spawning fails

**Symptoms:**
- PLAN phase completes but EXECUTE doesn't spawn agents
- Meta-prompts appear malformed
- Task() agents don't receive proper instructions

**Valid Meta-Prompt Format:**
```text
✅ Correct: (ROLE: coder) (CONTEXT: react_auth) (PROMPT: Build login form with validation) (OUTPUT: components)
❌ Incorrect: ROLE coder CONTEXT react_auth PROMPT Build login form
❌ Incorrect: (ROLE: coder) (CONTEXT: react_auth) (PROMPT: Build login form)
```

**Required Components:**
- **ROLE**: Must be from: planner, coder, critic, researcher, analyzer, synthesizer, ui_architect, ui_implementer, ui_refiner
- **CONTEXT**: Specific domain (e.g., react_authentication, nodejs_api)
- **PROMPT**: Clear, actionable instruction
- **OUTPUT**: Expected deliverable type

**Fix Invalid Meta-Prompts:**
```text
# Instead of:
(ROLE: coder) (CONTEXT: general) (PROMPT: write some code) (OUTPUT: files)

# Use:
(ROLE: coder) (CONTEXT: react_authentication) (PROMPT: Create JWT login component with form validation) (OUTPUT: react_component)
```

### Tool Constraint Violations

**Problem:** "Tool not allowed in current phase"

**Phase-Specific Tool Access:**
- **INIT/QUERY/ENHANCE**: JARVIS only
- **KNOWLEDGE**: Research tools (WebSearch, APITaskAgent, PythonComputationalTool)
- **PLAN**: TodoWrite only
- **EXECUTE**: Full tool access (Task, Bash, Read, Write, Edit)
- **VERIFY**: Validation tools (Read, PythonComputationalTool)

**Solution:** Wait for appropriate phase before using tools.

### Session State Corruption

**Symptoms:**
- Random phase jumps
- Lost session context
- Duplicate or missing tasks

**Recovery:**
```bash
# Clear session state
Use JARVIS with session_id: "recovery_$(date +%s)" to initialize fresh session

# Validate session
Use JARVIS to show session diagnostics and validation

# Test with simple objective
Use JARVIS with objective: "Test FSM functionality with simple echo command"
```

## Performance Issues

### Slow FSM Operations

**Optimization Strategies:**
1. **Reduce objective complexity**
   - Break large projects into smaller objectives
   - Use incremental development approach
   - Avoid creating entire applications in one session

2. **Monitor resource usage**
   - Check memory consumption during workflows
   - Verify network connectivity for API tasks
   - Ensure sufficient disk space

3. **Optimize agent spawning**
   - Limit concurrent agents to 2-3
   - Use sequential execution for dependent tasks
   - Prefer specialized agents over generalists

### API Timeout Issues

**Common Causes:**
- Network connectivity problems
- Rate limiting exceeded
- SSRF protection blocking requests

**Solutions:**
```bash
# Check environment variables
echo $ALLOWED_HOSTS
echo $ENABLE_SSRF_PROTECTION

# Adjust timeouts
export KNOWLEDGE_TIMEOUT_MS=8000

# Check rate limits
export API_RATE_LIMIT=5
export API_BURST_LIMIT=10
```

## Security Hook Issues

### Hooks Not Executing

**Symptoms:** No hook output in logs

**Diagnosis:**
```bash
# Check hook configuration
cat ~/.claude/settings.json | grep -A 10 "hooks"

# Test hook directly
echo '{"tool_name": "Bash", "tool_input": {"command": "echo test"}}' | \
  scripts/iron-manus/security-validator.py
```

**Solutions:**
```bash
# Fix permissions
chmod +x scripts/iron-manus/*.py

# Check Python path
which python3

# Validate JSON syntax
python3 -m json.tool ~/.claude/settings.json
```

### Security Validation Errors

**Problem:** Legitimate commands blocked

**Diagnosis:**
```bash
# Check security logs
grep "security_violation" ~/.claude/iron-manus-log.txt

# Test validation
echo '{"tool_name": "Bash", "tool_input": {"command": "ls -la"}}' | \
  scripts/iron-manus/security-validator.py
```

**Solutions:**
```bash
# Adjust security settings
export ALLOWED_HOSTS="api.github.com,api.openai.com,custom.api.com"

# Lower security threshold
export STRICT_VALIDATION=false
```

## Integration Issues

### Multi-Server Conflicts

**Problem:** Tool conflicts with other MCP servers

**Solutions:**
```bash
# Check registered servers
/mcp

# Use explicit namespacing
Use mcp__iron-manus-mcp__JARVIS instead of JARVIS

# Manage server priorities
# Register Iron Manus first for priority
```

### Context Window Exhaustion

**Problem:** Complex projects hit context limits

**Solutions:**
1. **Hierarchical task breakdown**
   - Start with high-level architecture
   - Implement components incrementally
   - Use separate sessions for major features

2. **Optimize agent delegation**
   - Create focused, single-purpose agents
   - Use clear handoff protocols
   - Minimize context sharing between tasks

## Environment-Specific Issues

### macOS Issues
```bash
# Install Xcode Command Line Tools
xcode-select --install

# Check architecture
arch

# Process management
pkill -f iron-manus
```

### Windows Issues
```powershell
# Clean installation
Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue
npm cache clean --force
npm install

# Process management
Get-Process -Name "*iron-manus*" | Stop-Process -Force
```

### Linux Issues
```bash
# Install Node.js with nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18

# Check npm permissions
npm config get prefix
```

## Error Message Reference

### Common Error Messages

**"Phase transition validation failed"**
- Check current phase completed required tasks
- Verify tool constraints weren't violated
- Ensure payload has required fields

**"Meta-prompt parsing error"**
- Validate syntax: (ROLE:...) (CONTEXT:...) (PROMPT:...) (OUTPUT:...)
- Ensure all four components present
- Check role names are valid

**"Agent spawning timeout"**
- Verify TodoWrite tool availability
- Check Task() tool accessibility
- Reduce meta-prompt complexity

**"Session state corrupted"**
- Initialize new session with fresh session_id
- Start with simpler objective
- Clear session workspace files

**"Tool constraint violation"**
- Wait for appropriate FSM phase
- Don't override phase restrictions
- Check PHASE_ALLOWED_TOOLS mapping

## Diagnostic Commands

### System Health Check
```bash
# FSM diagnostics
Use JARVIS to run system diagnostics and show FSM state

# Session information
Use JARVIS to display current session details

# Tool validation
Use TodoWrite to create diagnostic todo item

# Meta-prompt testing
Use JARVIS with objective: "Test meta-prompt generation with simple hello world"
```

### Log Analysis
```bash
# Hook execution
grep "hook_execute" ~/.claude/iron-manus-log.txt

# Security violations
grep "security_violation" ~/.claude/iron-manus-log.txt

# Performance metrics
grep "performance" ~/.claude/iron-manus-log.txt

# Phase transitions
grep "phase_transition" ~/.claude/iron-manus-log.txt
```

## Advanced Troubleshooting

### Debug Mode
```bash
# Enable comprehensive logging
export IRON_MANUS_DEBUG=true
export HOOK_DEBUG=true

# View debug logs
tail -f ~/.claude/iron-manus-debug.log
```

### Session Workspace Analysis
```bash
# Check session files
ls -la iron-manus-sessions/

# View session data
cat iron-manus-sessions/session_*/fsm-state-graph.json

# Clean session data
rm -rf iron-manus-sessions/session_*
```

## Escalation Path

### When to Escalate
1. **Persistent FSM failures** after session resets
2. **Security hooks causing false positives**
3. **Performance degradation** in simple workflows
4. **Tool registry corruption** preventing execution

### Information to Gather
1. **FSM state information** from diagnostic commands
2. **Meta-prompt examples** that failed validation
3. **Tool constraint violations** with phase context
4. **Session timeline** showing phase transitions
5. **Environment details** (OS, Node.js version, etc.)

### Recovery Strategies
1. **Minimal test case** - Use simple objective to isolate issue
2. **Clean environment** - Fresh directory, new session
3. **Incremental complexity** - Start simple, add complexity gradually
4. **Alternative approach** - Use direct tools instead of FSM orchestration

## Key Insights

Iron Manus MCP troubleshooting focuses on:
- **FSM state management** - Most issues stem from session state problems
- **Meta-prompt validation** - Syntax errors break agent spawning
- **Tool constraints** - Phase restrictions prevent tool misuse
- **Context management** - Complexity reduction improves reliability

The system is designed for robust operation when used within designed parameters. Focus on input validation, session management, and complexity reduction for best results.