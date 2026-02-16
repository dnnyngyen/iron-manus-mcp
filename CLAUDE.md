# Iron Manus MCP - Development Context

## Project Overview

Iron Manus MCP is a comprehensive FSM-driven orchestration system with 8-phase agent loop and 65+ API registry integration.

## Key Components

- **Core FSM**: 8-phase state machine (INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE)
- **Tool Registry**: Modular tool architecture with JARVIS FSM controller
- **API Registry**: 65+ APIs with role-based selection and intelligent orchestration
- **Security Layer**: SSRF protection and input validation
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
- 265/266 tests passing (1 timing-related test flaky)
- TypeScript strict mode enabled
- ESM modules with proper .js extensions
- Production-ready with comprehensive validation

## Recent Updates

- **v0.2.5**: System Prompt Initialization Fix
  - Fixed confusing system prompt during initialization
  - Simplified prompt logic by combining INIT and QUERY phases
  - Improved user experience with clearer messaging

- **v0.2.4**: Tool Description Refinement
  - Tool descriptions rewritten to guide intelligent thinking
  - Parameter names transformed into cognitive guides
  - Error messages enhanced with self-reflection frameworks

- **v0.2.3**: Enhanced SSRF protection and security validation
- Added intelligent output validation and rollback signaling

## Development Status

✅ Core FSM functionality working
✅ Tool registry operational
✅ Build pipeline functional
✅ Test suite passing (265/266)
✅ MCP SDK v1.13.2 fully compatible
✅ Production ready

## Architecture

Hybrid cognitive-deterministic system:

1. **Cognitive Layer (FSM)**: Strategic reasoning and workflow orchestration with role-based frameworks
2. **Tool Registry**: Tool architecture with strategic guidance
3. **API Registry**: Intelligent selection from 65+ endpoints
4. **Security System**: Multi-layered protection with SSRF guards and input validation
