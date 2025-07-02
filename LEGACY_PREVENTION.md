# Legacy JSON File Prevention

## Important: No More Legacy JSON Files

This project has migrated from JSON file-based state management to a knowledge graph system. 

### Files That Should NEVER Be Generated:
- `iron_manus_*.json`
- `iron_manus_component_cognitive_duality.json`
- `iron_manus_performance_archive.json`
- `iron_manus_unified_constraints.json`
- `iron_manus_state.json`

### If You See These Files:
1. **Stop the MCP server immediately**
2. **Delete the files**: `rm -f iron_manus_*.json`
3. **Clean rebuild**: `rm -rf dist/ && npm run build`
4. **Report the issue** - this indicates a regression

### Current State Management:
- **Knowledge Graph**: `iron-manus-sessions/*/fsm-state-graph.json`
- **Session Isolation**: Each session gets its own directory
- **GraphStateAdapter**: Handles backward compatibility

### Prevention Measures:
- ✅ Legacy files ignored in `.gitignore`
- ✅ `/dist` directory rebuilt cleanly
- ✅ All imports use new `graph-state-adapter.js`
- ✅ Docker build excludes legacy files

If legacy files still appear, there may be:
1. Multiple MCP server instances running
2. Cached compiled code in `/dist`
3. Missing environment variable (set `NODE_ENV=test` for testing)