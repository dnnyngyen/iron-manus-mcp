# ATOS Architecture - Source Code Organization

This directory contains the reorganized ATOS (Adaptive Task Orchestration System) codebase, clearly separating core infrastructure from generated products.

## Directory Structure

### Core ATOS Infrastructure

- **`core/`** - Core ATOS runtime modules
  - `fsm.ts` - Main FSM orchestration logic (6-step agent loop)
  - `types.ts` - Core type definitions 
  - `state.ts` - Session state management
  - `prompts.ts` - Phase-specific prompt generation
  - `reasoning-rules-engine.ts` - Reasoning validation engine
  - `enhanced-session-management.ts` - Advanced session handling
  - `cognitive/` - Cognitive processing modules
    - `cognitive-ast.ts` - Abstract Syntax Tree for cognitive patterns
    - `cognitive-ast-integration.ts` - AST integration layer
    - `cognitive-framework-injection.ts` - Framework injection system
    - Other cognitive processing utilities

### Agent Implementations

- **`agents/`** - UI and specialized agent implementations
  - `ui-agent-roles.ts` - UI agent role definitions
  - `ui-concurrent-execution.ts` - Concurrent UI processing
  - `role-specific-validators.ts` - Agent role validation

### Pipeline & Orchestration

- **`pipeline/`** - Pipeline and orchestration modules
  - `pipeline-core-implementation.ts` - Core pipeline logic
  - `parallel-cognitive-pipeline.ts` - Parallel processing pipeline
  - `unified-cognitive-component-pipeline.ts` - Unified component pipeline
  - Integration test modules

### Performance Optimization

- **`performance/`** - Performance monitoring and optimization
  - `performance-optimization.ts` - Main optimization engine
  - `performance-metrics-collector.ts` - Metrics collection
  - `performance-memory-manager.ts` - Memory management
  - `performance-monitoring-alerting.ts` - Performance alerting
  - Other performance utilities

### System Integration

- **`integration/`** - System integration modules
  - `integration-engine.ts` - Main integration engine
  - `ast-rules-integration.ts` - AST rules integration
  - `v0-patterns-integration.ts` - V0 pattern integration

### Components & UI

- **`components/`** - Component management
  - `component-cognitive-duality.ts` - Cognitive-UI duality system
  - `component-constraint-validator.ts` - Component validation

### Constraints & Validation

- **`constraints/`** - Constraint system modules
  - `unified-constraint-management-api.ts` - Constraint management API
  - `constraint-system-integration-framework.ts` - Integration framework
  - Cross-domain rules and validation

### Utilities

- **`utils/`** - Utility modules and helpers
  - `enhanced-tool-schemas.ts` - Tool schema definitions
  - `validation-framework.ts` - General validation utilities
  - `error-recovery-memory-management.ts` - Error handling
  - `backward-compatibility.ts` - Compatibility layer

## Key Principles

1. **Core vs Generated**: Clear separation between ATOS infrastructure and products it generates
2. **Functional Organization**: Modules grouped by function rather than random placement
3. **Hierarchical Structure**: Core modules at the top level, specialized functions in subdirectories
4. **Import Clarity**: Clean import paths that reflect the architectural hierarchy

## Understanding ATOS

- **Claude Code** = ATOS Runtime environment
- **manus-fsm-orchestrator** (MCP) = Control plane orchestrating the FSM
- **UI agents** = Code generators (like the coder agent)
- **Generated products** = Applications created by the system, not part of core infrastructure

This organization makes it clear what the ATOS actually IS versus what it GENERATES.