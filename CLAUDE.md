# Iron Manus MCP - Development Context

## Project Overview

Iron Manus MCP is a comprehensive FSM-driven orchestration system with 8-phase agent loop, 65+ API registry integration, and enhanced security through Claude Code Hooks.

## Key Components

- **Core FSM**: 8-phase state machine (INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE)
- **Tool Registry**: Modular tool architecture with JARVIS FSM controller
- **API Registry**: 65+ APIs with role-based selection and intelligent orchestration
- **Security Hooks**: Claude Code Hooks integration for deterministic validation
- **Type System**: Comprehensive TypeScript interfaces for all components

## Build & Test Commands

```bash
npm run build        # TypeScript compilation
npm test            # Run full test suite (266 tests)
npm run lint        # ESLint checking
npm run dev         # Build and start server
npm start          # Start compiled server
```

## Important Notes

- Uses MCP SDK v1.13.2 with correct import paths
- 266/266 tests passing (100% success rate)
- Claude Code Hooks integration for enhanced security
- TypeScript strict mode enabled
- ESM modules with proper .js extensions
- Production-ready with comprehensive validation

## Recent Updates

- **v0.2.5**: System Prompt Initialization Fix
  - Fixed confusing system prompt that showed "You are in the QUERY phase" during initialization
  - Simplified prompt logic by combining INIT and QUERY phases  
  - Updated QUERY phase prompt to clearly indicate "analyzing user objective and initializing workflow"
  - Removed complex conditional logic that caused timing issues
  - Improved user experience with clearer initialization messaging

- **v0.2.4**: Metaprompting-First Design Transformation
  - Tool descriptions rewritten as strategic metaprompts that guide intelligent thinking
  - Parameter names transformed into cognitive guides (e.g., `knowledge_sources`, `synthesis_bandwidth`)
  - Error messages enhanced with strategic self-reflection frameworks
  - Documentation updated to teach thinking patterns rather than just usage
  - All tools now prompt intelligence rather than constraining it

- **v0.2.3**: Claude Code Hooks integration with security validation
- Fixed all test issues achieving 100% success rate
- Enhanced SSRF protection with hooks validation
- Added intelligent output validation and rollback signaling
- Comprehensive session tracking and performance monitoring

## Development Status

✅ Core FSM functionality working
✅ Tool registry operational
✅ Build pipeline functional
✅ Test suite 100% passing (266/266)
✅ MCP SDK v1.13.2 fully compatible
✅ Claude Code Hooks integrated
✅ Production ready

## Design Philosophy: The Intelligence Question

You're building something that intelligent agents will use. Including yourself.

### The Choice

Every design decision is really asking: **Do I trust intelligence or try to replace it?**

When you write a tool description, you're not just documenting - you're programming how someone thinks about the problem.

### Two Paths

**Path 1: Engineer the thinking**
- Anticipate what they'll need
- Build logic to handle their "mistakes"
- Provide the "right" answers
- Make assumptions about their context

**Path 2: Prompt the thinking**
- Give them context to understand what they actually need
- Ask questions that make them consider implications
- Guide them to discover their own insights
- Trust them to understand their unique situation

### The Test

Read your own tool descriptions. Do they make you think more deeply about the problem, or do they make you stop thinking?

If someone intelligent uses what you built, will they become more thoughtful or more mechanical?

### The Insight

The most powerful tools don't solve problems for intelligent users.

They help intelligent users think better about problems.

### Implementation Examples

**MultiAPIFetch**: Asks "How do patterns emerge across multiple perspectives?" rather than simply fetching data - prompting strategic synthesis thinking.

**PythonExecutor**: Guides "What algorithmic approach captures your analytical intent?" rather than just running code - encouraging computational thinking.

**APISearch**: Prompts role-based cognitive filtering ("What type of thinking are you applying?") rather than mechanical search - trusting judgment.

**Error Messages**: Include strategic self-reflection frameworks that guide intelligent recovery rather than mechanical fixes.

---

*Every interface is a conversation with intelligence. What kind of conversation are you designing?*

## Architecture

Hybrid cognitive-deterministic system with metaprompting-first tool design:

1. **Cognitive Layer (FSM)**: Strategic reasoning and workflow orchestration with role-based thinking frameworks
2. **Deterministic Layer (Hooks)**: Security validation and quality enforcement
3. **Tool Registry**: Metaprompting-first tool architecture with strategic guidance
4. **API Registry**: Intelligent selection from 65+ endpoints with cognitive filtering
5. **Security System**: Multi-layered protection with SSRF guards and hooks validation
