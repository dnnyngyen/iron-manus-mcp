---
title: "Iron Manus MCP Frequently Asked Questions"
topics: ["FAQ", "common questions", "quick answers"]
related: ["quick/SETUP.md", "quick/TROUBLESHOOTING.md", "core/ARCHITECTURE.md"]
---

# Iron Manus MCP FAQ

**Quick answers to common questions about Iron Manus MCP setup and usage.**

## General Questions

### What is Iron Manus MCP?
Iron Manus MCP is a comprehensive FSM-driven orchestration system that manages complex AI workflows through structured 8-phase execution (INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE).

### How is it different from other MCP servers?
- **8-phase FSM workflow** for systematic task orchestration
- **Fractal agent spawning** with meta-prompts for specialized execution
- **65+ API registry** with intelligent selection and auto-connection
- **Context segmentation** enabling 300k+ token conversations
- **Security-hardened** with Claude Code Hooks integration

### What version should I use?
- **Docker (v0.2.3)**: Stable, production-ready
- **Source (v0.2.4)**: Latest with comprehensive documentation

## Setup Questions

### Why won't bash commands work in Claude Code?
This is a common Claude Code environment limitation. Solutions:
1. Use regular terminal for setup commands
2. Register with absolute paths: `claude mcp add iron-manus-mcp node /full/path/to/dist/index.js`
3. See quick/TROUBLESHOOTING.md for detailed solutions

### How do I know if installation was successful?
Check these indicators:
- `/mcp` command shows "iron-manus-mcp" server
- JARVIS tool responds to test commands
- Build created `dist/` directory with JavaScript files
- Tests pass: `npm test` shows 323/323 passing

### Do I need Python for basic functionality?
No, Python is only required for:
- Claude Code Hooks integration (optional security enhancement)
- Advanced validation scripts
- Core FSM functionality works without Python

## Usage Questions

### How do I use the 8-phase workflow?
1. Start with any objective: "Build a React dashboard"
2. JARVIS automatically progresses through phases
3. Each phase has specific tools and purposes
4. System handles phase transitions automatically

### What are meta-prompts?
Meta-prompts are specialized instruction patterns that spawn Task() agents:
```
(ROLE: coder) (CONTEXT: react_auth) (PROMPT: Build login form) (OUTPUT: components)
```
See guides/METAPROMPTS.md for complete syntax guide.

### When should I use APITaskAgent vs other tools?
- **APITaskAgent**: For structured API research with validation
- **WebSearch/WebFetch**: For general web content research
- **PythonComputationalTool**: For all Python operations
- **Direct tools**: For simple file operations

### How do I integrate with other MCP servers?
Iron Manus works as:
- **Primary orchestrator**: Coordinates other specialized servers
- **Peer collaborator**: Works alongside other servers
- **Specialist**: Provides FSM orchestration to other systems

See guides/INTEGRATION.md for detailed patterns.

## Technical Questions

### What's the difference between phases?
- **INIT/QUERY**: Objective analysis and role detection
- **ENHANCE**: Requirement refinement and context building
- **KNOWLEDGE**: Information gathering and API research
- **PLAN**: Task decomposition with meta-prompt generation
- **EXECUTE**: Task execution with agent spawning
- **VERIFY**: Quality validation and completion assessment
- **DONE**: Session completion and cleanup

### How does context segmentation work?
- **Main orchestrator**: Manages strategic workflow
- **Task() agents**: Independent Claude instances with fresh context
- **Session workspace**: File-based communication between agents
- **Result integration**: Synthesis back to main orchestrator

### What security features are included?
- **SSRF protection**: URL validation and allowlist enforcement
- **Claude Code Hooks**: Command validation and output quality gates
- **Input validation**: Comprehensive argument validation
- **Rate limiting**: Automatic API rate limiting and retry logic

## Performance Questions

### Why is my workflow slow?
Common causes:
- **Complex objectives**: Break into smaller, focused tasks
- **API timeouts**: Check network connectivity
- **Context window limits**: Use context segmentation patterns

### How do I optimize performance?
- **Parallel operations**: Use batch tool calls when possible
- **Focused objectives**: Avoid overly broad initial requests
- **Agent specialization**: Use specific roles for better efficiency
- **Session management**: Start new sessions for different aspects

### What are the system requirements?
- **Node.js 18+**: For MCP server runtime
- **8GB RAM**: For comfortable operation
- **Python 3.7+**: Optional, for hooks integration
- **Good network**: For API operations

## Troubleshooting Questions

### JARVIS tool isn't responding
Check:
1. MCP server registration: `/mcp` shows iron-manus-mcp
2. Build completion: `dist/index.js` file exists
3. Tool availability: Look for `mcp__iron-manus-mcp__JARVIS`

### FSM seems stuck in a phase
1. Check phase progression messages
2. Verify tool constraints aren't violated
3. Start new session with fresh session_id
4. See quick/TROUBLESHOOTING.md for detailed debugging

### Meta-prompts aren't spawning agents
Common issues:
- **Invalid syntax**: Must have all 4 components (ROLE, CONTEXT, PROMPT, OUTPUT)
- **Tool availability**: TodoWrite and Task tools must be available
- **Phase restrictions**: Agent spawning only works in EXECUTE phase

### API calls are being blocked
Check:
- **Rate limiting**: API_RATE_LIMIT environment variable
- **SSRF protection**: ALLOWED_HOSTS configuration
- **Network connectivity**: Test with simple API calls

## Integration Questions

### Can I use Iron Manus with other AI tools?
Yes, Iron Manus is designed for integration:
- **MCP protocol**: Works with any MCP-compatible client
- **API endpoints**: Exposes standard MCP tool interface
- **File system**: Integrates through standard file operations

### Does it work with different LLMs?
Iron Manus is designed for Claude but the MCP protocol is model-agnostic. The FSM orchestration patterns could be adapted for other LLMs.

### Can I extend the tool registry?
Yes, the tool registry is modular and extensible:
- Add new tools in `src/tools/` directory
- Register in `src/tools/index.ts`
- Follow existing tool patterns

## Development Questions

### How do I contribute to Iron Manus?
1. Fork the repository
2. Set up development environment
3. Follow existing code patterns
4. Add comprehensive tests
5. Submit pull request

### What's the testing approach?
- **Vitest**: Test framework with 323 comprehensive tests
- **Unit tests**: Individual component testing
- **Integration tests**: FSM workflow testing
- **End-to-end tests**: Complete workflow validation

### How do I add new FSM phases?
FSM phases are carefully designed for cognitive workflow. Extensions should:
1. Maintain phase separation principles
2. Follow existing prompt patterns
3. Include comprehensive testing
4. Consider tool constraint implications

## Quick Reference

### Essential Commands
```bash
# Setup
npm run setup

# Test
npm test

# Build
npm run build

# Register
claude mcp add iron-manus-mcp node dist/index.js

# Health check
/mcp
```

### Key Files
- **setup**: quick/SETUP.md
- **architecture**: core/ARCHITECTURE.md  
- **tools**: core/TOOLS.md
- **troubleshooting**: quick/TROUBLESHOOTING.md
- **integration**: guides/INTEGRATION.md

### Support Resources
- **Detailed setup**: quick/SETUP.md
- **Common issues**: quick/TROUBLESHOOTING.md
- **API reference**: api/ENDPOINTS.md
- **Usage examples**: api/EXAMPLES.md