# Iron Manus MCP Architecture

## What It Is

A TypeScript MCP server that enforces structured workflows through phase-gated tool access. The system uses a finite state machine (FSM) to control which tools are available at each stage of task execution.

## Core Components

### 8-Phase FSM

The system implements an 8-phase state machine:

```
INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE
```

Each phase has specific responsibilities and restricted tool access:

| Phase | Purpose | Tools Available |
|-------|---------|-----------------|
| INIT | Internal session setup | JARVIS only |
| QUERY | Analyze user objective, select role | JARVIS only |
| ENHANCE | Refine goal with technical details | JARVIS only |
| KNOWLEDGE | Research and information gathering | WebSearch, WebFetch, APITaskAgent, PythonComputationalTool, Task |
| PLAN | Create task breakdown | TodoWrite only |
| EXECUTE | Run tasks, spawn agents | Bash, Read, Write, Edit, Task, PythonComputationalTool |
| VERIFY | Validate completion | Read, PythonComputationalTool |
| DONE | Task complete | None |

### Phase-Gated Tools

Each phase restricts which tools are available through `PHASE_ALLOWED_TOOLS`:

```typescript
export const PHASE_ALLOWED_TOOLS: Record<Phase, string[]> = {
  INIT: ['JARVIS'],
  QUERY: ['JARVIS'],
  ENHANCE: ['JARVIS'],
  KNOWLEDGE: ['WebSearch', 'WebFetch', 'APITaskAgent', 'KnowledgeSynthesize', 'JARVIS'],
  PLAN: ['TodoWrite'],
  EXECUTE: ['TodoRead', 'TodoWrite', 'Task', 'Bash', 'Read', 'Write', 'Edit', 'Browser'],
  VERIFY: ['TodoRead', 'Read'],
  DONE: []
};
```

This prevents tool proliferation and ensures focused execution per phase.

### Meta-Prompt DSL

The system uses a structured format for spawning specialized agents:

```
(ROLE: agent_type) (CONTEXT: domain) (PROMPT: instructions) (OUTPUT: deliverable)
```

Example:
```
(ROLE: coder) (CONTEXT: authentication_system) (PROMPT: Implement JWT auth with refresh tokens) (OUTPUT: production_code)
```

When the EXECUTE phase encounters a todo with this pattern, it spawns a Task() agent with role-specific context and thinking methodologies.

### Verification with Rollback

The VERIFY phase uses completion percentage to determine next action:

- **< 50% completion** → Rollback to PLAN phase (severe incompletion)
- **50-80% completion** → Continue from EXECUTE phase (moderate incompletion)
- **> 80% completion** → Retry previous task (minor incompletion)

This provides intelligent recovery from incomplete work.

### Specialized Roles

The system includes 10 specialized roles with unique thinking methodologies:

**Core Roles:**
1. **planner** - Strategic planning and architecture design
2. **coder** - Implementation and development
3. **critic** - Quality assessment and security review
4. **researcher** - Information gathering and synthesis
5. **analyzer** - Data analysis and pattern recognition
6. **synthesizer** - Integration and optimization

**UI-Specialized Roles:**
7. **ui_architect** - UI architecture and design systems
8. **ui_implementer** - Frontend development and component building
9. **ui_refiner** - UI polish and optimization

Each role has configured thinking methodologies, frameworks, and validation rules that get injected into agent prompts.

### Session Workspace Pattern

Task() agents spawn with completely isolated contexts. They cannot share memory or state. Communication happens through file-based handoffs:

```
/tmp/iron-manus-session-{session_id}/
├── primary_research.md      (from researcher agent)
├── analysis_data.md         (from analyzer agent)
├── technical_specs.md       (from coder agent)
└── synthesized_knowledge.md (from synthesizer agent)
```

Meta-prompts must include exact file paths for agents to read/write.

## Key Files

| File | Purpose |
|------|---------|
| `src/index.ts` | MCP Server entry point, tool registry initialization |
| `src/core/fsm.ts` | Core 8-phase FSM logic, state transitions |
| `src/phase-engine/FSM.ts` | Main FSM engine implementation (609 lines) |
| `src/tools/tool-registry.ts` | Unified tool architecture with category organization |
| `src/tools/api/api-task-agent.ts` | API research workflow tool |
| `src/tools/computation/python-computational-tool.ts` | Python data science operations |
| `src/utils/api-fetcher.ts` | HTTP request logic with security optimizations |
| `src/core/prompts.ts` | Role-based prompt generation, phase-specific tool constraints |
| `src/config.ts` | Environment variables and operational parameters |
| `src/core/graph-state-adapter.ts` | Session state persistence and security |

## Security Features

- **SSRF Protection**: URL validation, IP blocking, allowlist support
- **Input Validation**: Request sanitization and parameter validation
- **Rate Limiting**: Configurable per-endpoint throttling
- **Session Isolation**: Independent session state with 24-hour cleanup

## API Integration

The APITaskAgent provides unified research workflows:

1. **Discovery** - Find relevant APIs from 65+ registry
2. **Validation** - Check API availability and relevance
3. **Fetching** - Gather data from multiple sources
4. **Synthesis** - Cross-validate and combine results

Role-based API guidance helps select appropriate sources for different task types.

## Python Integration

PythonComputationalTool handles all Python operations through operation-specific workflows:

- **web_scraping** - Data extraction from web sources
- **data_analysis** - Statistical analysis and processing
- **visualization** - Charts and graphs generation
- **machine_learning** - ML model operations
- **custom** - General Python execution

## Testing

- 266/266 tests passing (100% success rate)
- Unit, integration, security, and performance test coverage
- Multi-node CI/CD pipeline with automated security auditing
