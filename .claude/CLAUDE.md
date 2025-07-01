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
npm test            # Run full test suite (107 tests)
npm run lint        # ESLint checking
npm run dev         # Build and start server
npm start          # Start compiled server
```

## Important Notes

- Uses MCP SDK v1.13.2 with correct import paths
- 107/107 tests passing (100% success rate)
- Claude Code Hooks integration for enhanced security
- TypeScript strict mode enabled
- ESM modules with proper .js extensions
- Production-ready with comprehensive validation

## Recent Updates

- **v0.2.1**: Claude Code Hooks integration with security validation
- Fixed all test issues achieving 100% success rate
- Enhanced SSRF protection with hooks validation
- Added intelligent output validation and rollback signaling
- Comprehensive session tracking and performance monitoring

## Development Status

✅ Core FSM functionality working
✅ Tool registry operational
✅ Build pipeline functional
✅ Test suite 100% passing (107/107)
✅ MCP SDK v1.13.2 fully compatible
✅ Claude Code Hooks integrated
✅ Production ready

## Architecture

Hybrid cognitive-deterministic system with:

1. **Cognitive Layer (FSM)**: Strategic reasoning and workflow orchestration
2. **Deterministic Layer (Hooks)**: Security validation and quality enforcement
3. **Tool Registry**: Modular architecture with 5 specialized tools
4. **API Registry**: Intelligent selection from 65+ endpoints
5. **Security System**: Multi-layered protection with SSRF guards and hooks validation
