# Iron Manus MCP - Development Context

## Project Overview
This is the Iron Manus MCP (Model Context Protocol) server - a comprehensive FSM-driven system with 8-phase agent loop orchestration and 65+ API registry integration.

## Key Components
- **Core FSM**: 8-phase state machine (INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE)
- **Tool Registry**: Modular tool architecture with JARVIS FSM controller
- **API Registry**: 65+ APIs with role-based selection and intelligent orchestration
- **Type System**: Comprehensive TypeScript interfaces for all components

## Build & Test Commands
```bash
npm run build        # TypeScript compilation
npm test            # Run full test suite
npm run lint        # ESLint checking
npm run dev         # Build and start server
npm start          # Start compiled server
```

## Important Notes
- Uses MCP SDK v1.13.0+ with updated import paths
- All emojis removed from codebase (clean professional text)
- 66/67 tests passing (98.5% success rate)
- TypeScript strict mode enabled
- ESM modules with proper .js extensions

## Recent Updates
- Fixed all major test failures and type issues
- Migrated ESLint to v9 flat config
- Removed all emoji usage throughout codebase
- Updated MCP SDK import paths for v1.13.0 compatibility
- Repository cleaned of temporary/demo files

## Development Status
✅ Core FSM functionality working
✅ Tool registry operational  
✅ Build pipeline functional
✅ Test suite mostly passing
🔄 MCP SDK import paths need updating for server startup

## Architecture
The system follows a modular tool-based architecture where:
1. JARVIS FSM controller orchestrates the 8-phase loop
2. Role detection enhances cognitive capabilities
3. API registry provides intelligent data source selection
4. Tool registry enables extensible functionality