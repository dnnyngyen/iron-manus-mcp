# Troubleshooting Iron Manus MCP

This guide covers setup issues, FSM state errors, meta-prompt validation, and runtime troubleshooting for Iron Manus MCP.

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
- `mcp__iron-manus-mcp__APITaskAgent`
- `mcp__iron-manus-mcp__PythonComputationalTool`
- `mcp__iron-manus-mcp__KnowledgeSynthesize`
- `mcp__iron-manus-mcp__IronManusStateGraph`

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

## FSM State Errors and Runtime Issues

### FSM Phase Transition Failures

**Problem: FSM stuck in a phase**

**Symptoms:**
- JARVIS tool doesn't progress beyond QUERY phase
- Phase transitions appear frozen
- No error message but no progress

**Debugging Steps:**
1. Check current session state:
   ```text
   Use JARVIS to show current session status and phase details
   ```
2. Look for phase transition indicators:
   ```text
   Expected: "Phase QUERY → ENHANCE transition ready"
   Actual: Phase indicator missing
   ```
3. Reset session if needed:
   ```text
   Use JARVIS with a new session_id to start fresh
   ```

**Common Causes:**
- Invalid objective format that breaks analysis
- TodoWrite tool restrictions preventing task creation
- Insufficient context for phase completion

**Solutions:**
- Use clearer, more specific objectives
- Ensure TodoWrite tool is available and functional
- Break complex requests into smaller objectives

### Meta-Prompt Validation Errors

**Problem: Agent spawning fails**

**Symptoms:**
- PLAN phase completes but EXECUTE phase doesn't spawn agents
- Meta-prompts appear malformed
- Task() agents don't receive proper instructions

**Meta-Prompt Format Validation:**
```text
✅ Correct: (ROLE: coder) (CONTEXT: api_integration) (PROMPT: Build auth service) (OUTPUT: service_code)
❌ Incorrect: ROLE coder CONTEXT api_integration PROMPT Build auth service
❌ Incorrect: (ROLE: coder) (CONTEXT: api_integration) (PROMPT: Build auth service)
```

**Required Components:**
- **ROLE**: Must be one of: planner, coder, critic, researcher, analyzer, synthesizer, ui_architect, ui_implementer, ui_refiner
- **CONTEXT**: Specific domain or technical area
- **PROMPT**: Clear, actionable instruction
- **OUTPUT**: Expected deliverable type

**Debugging Meta-Prompts:**
1. Check if all four components are present
2. Verify role names match supported types
3. Ensure prompts are specific and actionable
4. Confirm output types are clearly defined

**Fix Invalid Meta-Prompts:**
```text
# Instead of generic prompts like:
(ROLE: coder) (CONTEXT: general) (PROMPT: write some code) (OUTPUT: files)

# Use specific prompts like:
(ROLE: coder) (CONTEXT: react_authentication) (PROMPT: Create JWT login component with form validation) (OUTPUT: react_component)
```

### Tool Constraint Violations

**Problem: "Tool not allowed in current phase"**

**Phase-Specific Tool Restrictions:**
- **QUERY**: Analysis tools only, no execution tools
- **ENHANCE**: Requirement expansion tools only
- **KNOWLEDGE**: Research and API tools only
- **PLAN**: TodoWrite and planning tools only
- **EXECUTE**: Task spawning and execution tools only
- **VERIFY**: Validation and completion tools only

**Solution:**
- Wait for appropriate phase before using tools
- Let FSM naturally progress through phases
- Don't force tool usage outside of designated phases

### Session State Corruption

**Problem: FSM behavior becomes inconsistent**

**Symptoms:**
- Random phase jumps
- Lost session context
- Duplicate or missing tasks

**Recovery Steps:**
1. **Clear session state:**
   ```text
   Use JARVIS with session_id: "fresh_start" to initialize new session
   ```
2. **Validate session integrity:**
   ```text
   Use JARVIS to show session diagnostics and state validation
   ```
3. **Reset if necessary:**
   ```text
   Start with simple objective to test FSM functionality
   ```

### Agent Communication Failures

**Problem: Spawned agents don't report back**

**Symptoms:**
- EXECUTE phase hangs waiting for agent completion
- No agent status updates
- Tasks marked as in-progress indefinitely

**Debugging Agent Issues:**
1. **Check TodoWrite functionality:**
   ```text
   Create a simple todo item to verify TodoWrite is working
   ```
2. **Test Task() spawning manually:**
   ```text
   Use the Task tool directly to verify agent spawning capability
   ```
3. **Verify agent prompt clarity:**
   - Ensure meta-prompts provide clear context
   - Check that output expectations are specific
   - Confirm role assignments match task requirements

### Performance and Timeout Issues

**Problem: FSM operations timeout or perform slowly**

**Performance Optimization:**
1. **Reduce objective complexity:**
   - Break large projects into smaller objectives
   - Use incremental development approach
   - Avoid trying to create entire applications in one session

2. **Monitor resource usage:**
   - Watch for memory consumption during complex workflows
   - Check network connectivity for API-heavy tasks
   - Verify sufficient disk space for code generation

3. **Optimize agent spawning:**
   - Limit concurrent agent spawning to 2-3 agents
   - Use sequential execution for dependent tasks
   - Prefer single specialized agents over multiple generalists

### Error Message Reference

**Common Error Messages and Solutions:**

```text
❌ "Phase transition validation failed"
→ Check that current phase completed all required tasks
→ Verify phase-specific tool constraints weren't violated

❌ "Meta-prompt parsing error"
→ Validate meta-prompt syntax: (ROLE:...) (CONTEXT:...) (PROMPT:...) (OUTPUT:...)
→ Ensure all four components are present and properly formatted

❌ "Agent spawning timeout"
→ Check TodoWrite tool availability
→ Verify Task() tool is accessible
→ Reduce meta-prompt complexity

❌ "Session state corrupted"
→ Initialize new session with fresh session_id
→ Start with simpler objective to test functionality

❌ "Tool constraint violation"
→ Wait for appropriate FSM phase
→ Don't override phase-specific tool restrictions
```

## Diagnostic Commands

### FSM Health Check
```text
Use JARVIS to run system diagnostics and show FSM state information
```

### Session Information
```text
Use JARVIS to display current session details including phase, tasks, and agent status
```

### Tool Validation
```text
Test TodoWrite functionality by creating a diagnostic todo item
```

### Meta-Prompt Testing
```text
Use JARVIS with this test objective: "Create a simple hello world function" and watch meta-prompt generation
```

## Advanced Troubleshooting

### Context Window Management

**Problem: Complex projects hit context limits**

**Solutions:**
1. **Use hierarchical task breakdown:**
   - Start with high-level architecture
   - Implement components incrementally
   - Use separate sessions for major features

2. **Optimize agent delegation:**
   - Create focused, single-purpose agents
   - Use clear handoff protocols between agents
   - Minimize context sharing between unrelated tasks

### Integration with Other MCP Servers

**Problem: Tool conflicts with other MCP servers**

**Solutions:**
1. **Check tool namespace conflicts:**
   ```bash
   /mcp  # List all registered servers and their tools
   ```
2. **Use explicit tool names:**
   ```text
   Use mcp__iron-manus-mcp__JARVIS specifically instead of generic JARVIS
   ```
3. **Manage server priorities:**
   - Register Iron Manus MCP first for priority
   - Unregister conflicting servers temporarily

## Still Having Issues?

### Escalation Path
1. **Try minimal test case** - Use simple objective to isolate issue
2. **Check recent changes** - Verify if issue appeared after updates
3. **Review setup logs** - Look for missed configuration steps
4. **Test in clean environment** - Fresh directory, new session
5. **Document specific symptoms** - Exact error messages and reproduction steps

### Support Information to Include
1. **FSM state information** from diagnostic commands
2. **Meta-prompt examples** that failed validation
3. **Tool constraint violations** with specific phase information
4. **Agent spawning logs** showing communication failures
5. **Session timeline** showing phase transitions

### Key Troubleshooting Insight

Iron Manus MCP is designed for robust operation - most runtime issues stem from:
- **Invalid meta-prompt syntax** breaking agent spawning
- **Tool constraint violations** interrupting FSM flow
- **Session state corruption** from interrupted workflows
- **Context window exhaustion** from overly complex objectives

The FSM itself is deterministic and reliable when operating within designed parameters. Focus troubleshooting on input validation, session management, and complexity reduction.