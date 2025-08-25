---
title: "Iron Manus MCP 8-Phase FSM Workflow"
topics: ["FSM", "workflow", "phases", "orchestration", "8-phase", "state machine"]
related: ["core/ARCHITECTURE.md", "guides/METAPROMPTS.md", "core/TOOLS.md"]
---

# Iron Manus MCP 8-Phase FSM Workflow

**Complete guide to the 8-phase finite state machine orchestration system with Meta Thread-of-Thought patterns.**

## Overview

Iron Manus MCP implements an 8-phase FSM that transforms complex objectives into systematic, executable workflows:

```
INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE
```

Each phase has specific purposes, tools, and transition criteria designed for optimal cognitive workflow management.

## Phase Sequence and Purposes

### Phase 1: INIT (System Initialization)
**Purpose**: Internal session state setup and initialization
**Duration**: Instantaneous
**Tools Available**: JARVIS only
**Next Phase**: QUERY

**What Happens:**
- Session state initialization
- FSM variables setup
- Context preparation
- Role detection preparation

**System Prompt**:
```
You are initializing a new project session. Assess the user's objective and prepare to begin the 8-phase workflow.
```

### Phase 2: QUERY (Objective Analysis)
**Purpose**: User-facing objective analysis, workflow initialization, and intelligent role selection
**Duration**: 30-60 seconds
**Tools Available**: JARVIS only
**Next Phase**: ENHANCE

**What Happens:**
- Parse user's objective and identify requirements
- Clarify ambiguous aspects
- Claude-powered intelligent role selection from 9 specialized types
- Prepare for enhancement phase

**Key Features:**
- **Combined initialization & analysis** in single clear prompt
- **Claude-powered role selection** for optimal task matching
- **Context understanding** beyond simple keyword matching

**System Prompt**:
```
You are analyzing the user's objective and initializing the project workflow. Consider:
- What is the user really asking for at its core?
- What are the key requirements and constraints?
- What type of task is this (research, coding, deployment, etc.)?

CLAUDE-POWERED ROLE SELECTION: The system needs your intelligent analysis to select the most appropriate role...
```

### Phase 3: ENHANCE (Requirement Refinement)
**Purpose**: Goal refinement and requirement analysis with role-specific cognitive frameworks
**Duration**: 30-45 seconds
**Tools Available**: JARVIS only
**Next Phase**: KNOWLEDGE

**What Happens:**
- Apply role-specific thinking methodologies
- Add missing requirements and context
- Consider edge cases and dependencies
- Prepare enhanced objectives for knowledge gathering

**Role-Specific Enhancement**:
- **Analyzer**: Multi-dimensional analysis and statistical considerations
- **Coder**: Implementation patterns and testing strategies
- **Researcher**: Information validation and source triangulation
- **UI Architect**: User-centered design and accessibility

**System Prompt**:
```
Think through how to enhance and refine the interpreted goal. Consider:
- What important details might be missing?
- What edge cases should be considered?
- What resources will be needed?
- What challenges might arise?
```

### Phase 4: KNOWLEDGE (Information Gathering)
**Purpose**: Intelligent research and data synthesis with API orchestration
**Duration**: 1-3 minutes
**Tools Available**: WebSearch, WebFetch, APITaskAgent, PythonComputationalTool, Task, JARVIS
**Next Phase**: PLAN

**What Happens:**
- **Auto-connection system** discovers and synthesizes relevant APIs
- **Parallel research** with cross-validation
- **Multi-source data gathering** with confidence scoring
- **Knowledge synthesis** with contradiction detection

**Research Workflow:**
1. **API Discovery**: Identify relevant APIs for domain
2. **Multi-source Fetching**: Gather data from top-ranked APIs
3. **Knowledge Synthesis**: Cross-validate and synthesize information
4. **Quality Assessment**: Confidence scoring and gap identification

**Tool Selection Guide:**
- **APITaskAgent**: Structured API research with validation
- **WebSearch/WebFetch**: General web content research
- **PythonComputationalTool**: Data processing and analysis
- **Task**: Complex multi-step research workflows

**System Prompt**:
```
AUTO-CONNECTION ACTIVE: The system has automatically discovered, fetched, and synthesized knowledge from relevant APIs.

AUTOMATED WORKFLOW COMPLETED:
1. ✓ API Discovery - Relevant APIs identified
2. ✓ Multi-Source Fetching - Data gathered from top APIs
3. ✓ Knowledge Synthesis - Information cross-validated
4. ✓ Quality Assessment - Confidence scoring completed
```

### Phase 5: PLAN (Strategic Decomposition)
**Purpose**: Task breakdown with meta-prompt generation for fractal orchestration
**Duration**: 45-90 seconds
**Tools Available**: TodoWrite only
**Next Phase**: EXECUTE

**What Happens:**
- **Strategic task breakdown** with dependency analysis
- **Meta-prompt generation** for complex tasks requiring agent spawning
- **Todo list creation** with fractal orchestration instructions
- **Sequencing and priority** assignment

**Meta-Prompt DSL**:
```
(ROLE: agent_type) (CONTEXT: domain) (PROMPT: instructions) (OUTPUT: deliverable)
```

**Fractal Orchestration Guide**:
- Tasks requiring specialized expertise get meta-prompt format
- Simple tasks remain as direct execution instructions
- Clear output requirements for agent coordination
- Dependency relationships between tasks

**System Prompt**:
```
Think strategically about task breakdown. Consider:
- What is the optimal decomposition strategy?
- Which tasks need specialized Task() agent expertise?
- What are the dependencies and sequencing?
- How can you ensure actionable and efficient planning?

FRACTAL ORCHESTRATION: Mark todos requiring Task() agents with meta-prompts.
```

### Phase 6: EXECUTE (Task Execution)
**Purpose**: Implementation with fractal agent spawning and single-tool iteration
**Duration**: 2-10 minutes
**Tools Available**: Full tool access (Task, Bash, Read, Write, Edit, PythonComputationalTool, etc.)
**Next Phase**: VERIFY

**What Happens:**
- **Single tool per iteration** enforcement (Manus requirement)
- **Meta-prompt detection** and Task() agent spawning
- **Context segmentation** for complex workflows
- **Result integration** from specialized agents

**Execution Patterns:**
1. **Direct execution** for simple tasks (Bash, Read, Write)
2. **Agent spawning** for meta-prompted tasks
3. **File-based communication** between agents
4. **Session workspace** for result coordination

**Task() Agent Spawning**:
- Detects meta-prompt patterns in todos
- Spawns independent Claude instances with specialized context
- Agents work autonomously with fresh context
- Results reported through structured output

**System Prompt**:
```
Single tool per iteration (Manus requirement) - call one tool, then return to orchestrator.

When you see meta-prompt format "(ROLE: agent_type) (CONTEXT: domain) (PROMPT: instructions) (OUTPUT: deliverable)", convert to Task() tool usage.

The Task() tool creates independent Claude instances that work autonomously on specific tasks.
```

### Phase 7: VERIFY (Quality Assessment)
**Purpose**: Validation and completion assessment with hook integration
**Duration**: 30-90 seconds
**Tools Available**: Read, PythonComputationalTool, validation tools
**Next Phase**: DONE or rollback

**What Happens:**
- **Quality assessment** against original objective
- **Hook integration** for structured feedback
- **Mathematical validation** with completion percentages
- **Rollback decision** for insufficient completion

**Verification Criteria**:
- **Deliverable comparison** against original objectives
- **Role-specific quality standards** application
- **Functionality testing** where applicable
- **Gap identification** and improvement recommendations

**Hook Integration**:
- **Structured feedback** from validation hooks
- **Block decision processing** for quality issues
- **Security validation** results integration
- **Performance metrics** consideration

**Rollback Logic**:
- **<50% completion**: Restart from PLAN phase
- **50-80% completion**: Retry EXECUTE phase
- **>80% completion**: Proceed to DONE

**System Prompt**:
```
Think critically about quality and completeness. Evaluate:
- How do deliverables compare to original objective?
- Have all requirements been met with role-specific standards?
- What gaps or improvements are needed?

HOOK INTEGRATION: Review structured feedback from validation hooks before final decision.
```

### Phase 8: DONE (Completion)
**Purpose**: Task completion and standby mode
**Duration**: Instantaneous
**Tools Available**: None
**Next Phase**: None (session complete)

**What Happens:**
- **Task completion summary** with performance metrics
- **Session data cleanup** and state finalization
- **Performance tracking** and reasoning effectiveness updates
- **Standby mode** entry for new objectives

**Completion Metrics**:
- **Reasoning effectiveness**: 0.3-1.0 scale with adaptive optimization
- **Phase transition count**: Workflow efficiency tracking
- **API usage metrics**: Performance and confidence scores
- **Task completion rate**: Success/failure tracking

**System Prompt**:
```
Task completed successfully. Entering standby mode (Manus: "Enter Standby").
```

## Phase Transitions and State Management

### Transition Criteria

**Deterministic Transitions**:
- INIT → QUERY: Automatic (system initialization)
- QUERY → ENHANCE: Objective analysis complete
- ENHANCE → KNOWLEDGE: Requirements refined
- KNOWLEDGE → PLAN: Information gathering complete
- PLAN → EXECUTE: Task breakdown finished
- EXECUTE → VERIFY: All tasks completed
- VERIFY → DONE: Quality validation passed

**Conditional Transitions**:
- VERIFY → PLAN: <50% completion (restart planning)
- VERIFY → EXECUTE: 50-80% completion (retry execution)
- VERIFY → DONE: >80% completion (proceed to completion)

### State Persistence

**Session State Structure**:
```typescript
interface SessionState {
  session_id: string;
  initial_objective: string;
  detected_role: Role;
  current_phase: Phase;
  payload: Record<string, any>;
  phase_count: number;
  reasoning_effectiveness: number;
  created_at: Date;
  updated_at: Date;
}
```

**State Tracking**:
- **Phase progression**: All transitions logged with timestamps
- **Payload evolution**: Data accumulated across phases
- **Performance metrics**: Reasoning effectiveness and completion rates
- **Session isolation**: Project-scoped state management

### Error Recovery

**Graceful Degradation**:
- **Invalid phase transitions**: Automatic correction
- **Tool constraint violations**: Phase-appropriate guidance
- **Session corruption**: Fresh session initialization
- **Agent communication failures**: Fallback to direct execution

## Single-Tool-Per-Iteration Enforcement

### Manus Compliance

**Principle**: Each FSM iteration processes exactly one tool call
**Benefits**: Controlled execution, clear state transitions, predictable behavior
**Implementation**: Phase-specific tool allowlists with strict enforcement

### Tool Allowlists by Phase

```typescript
PHASE_ALLOWED_TOOLS = {
  INIT: ['JARVIS'],
  QUERY: ['JARVIS'],
  ENHANCE: ['JARVIS'],
  KNOWLEDGE: ['WebSearch', 'WebFetch', 'APITaskAgent', 'PythonComputationalTool', 'Task', 'JARVIS'],
  PLAN: ['TodoWrite'],
  EXECUTE: ['TodoRead', 'TodoWrite', 'Task', 'Bash', 'Read', 'Write', 'Edit', 'PythonComputationalTool'],
  VERIFY: ['TodoRead', 'Read', 'PythonComputationalTool'],
  DONE: []
}
```

### Tool Guidance

**Phase-Specific Guidance**:
- **KNOWLEDGE**: "Think through knowledge needs, then choose appropriate research tool"
- **EXECUTE**: "Think through execution approach, then choose single tool for this iteration"
- **VERIFY**: "Think through quality assessment, then choose validation tool"

## Performance Characteristics

### Phase Timing

| Phase | Average Duration | Tool Operations | Complexity |
|-------|------------------|-----------------|------------|
| INIT | <100ms | 1 (automatic) | Low |
| QUERY | 30-60s | 1 (analysis) | Medium |
| ENHANCE | 30-45s | 1 (refinement) | Medium |
| KNOWLEDGE | 1-3min | 1-5 (research) | High |
| PLAN | 45-90s | 1 (planning) | Medium |
| EXECUTE | 2-10min | 5-20 (implementation) | High |
| VERIFY | 30-90s | 1-3 (validation) | Medium |
| DONE | <100ms | 0 (completion) | Low |

### Optimization Strategies

**Phase Optimization**:
- **Parallel research**: Multiple API calls in KNOWLEDGE phase
- **Batch tool usage**: Efficient tool selection in EXECUTE phase
- **Cached results**: Reuse of API responses and computations
- **Smart rollback**: Minimal recomputation on verification failures

## Integration with Meta-Prompts

### Meta-Prompt Detection

**Pattern Recognition**: System detects meta-prompt format in todos
**Agent Spawning**: Converts meta-prompts to Task() agent calls
**Context Segmentation**: Independent agent contexts for specialization
**Result Integration**: File-based communication back to orchestrator

### Fractal Orchestration

**Recursive Decomposition**: Agents can create sub-todos and spawn sub-agents
**Specialized Execution**: Each agent operates with role-specific expertise
**Autonomous Operation**: Agents work independently with fresh context
**Hierarchical Coordination**: Main orchestrator manages agent coordination

## Real-World Workflow Examples

### Example 1: React Dashboard Development

**INIT**: Session initialization
**QUERY**: "Build React dashboard with authentication" → Role: ui_architect
**ENHANCE**: Add responsive design, state management, testing requirements
**KNOWLEDGE**: Research React patterns, authentication libraries, UI frameworks
**PLAN**: Break into components, authentication, styling, testing
**EXECUTE**: Spawn ui_implementer and coder agents for implementation
**VERIFY**: Validate components, test authentication, check responsiveness
**DONE**: Complete dashboard with all requirements

### Example 2: Data Analysis Project

**INIT**: Session initialization
**QUERY**: "Analyze sales data and create insights" → Role: analyzer
**ENHANCE**: Add statistical analysis, visualization, reporting requirements
**KNOWLEDGE**: Research analysis methods, visualization libraries, data patterns
**PLAN**: Data cleaning, statistical analysis, visualization, reporting
**EXECUTE**: Use PythonComputationalTool for analysis, spawn agents for visualization
**VERIFY**: Validate analysis results, check visualization quality
**DONE**: Complete analysis with insights and visualizations

## Key Architectural Benefits

### Systematic Execution
- **Structured workflow**: Ensures thorough coverage of all aspects
- **Phase separation**: Clear boundaries between different types of work
- **Tool optimization**: Right tools for each phase
- **Quality assurance**: Built-in validation and rollback

### Cognitive Enhancement
- **Role-based thinking**: Specialized methodologies for different roles
- **Context management**: Prevents information overload
- **Systematic reasoning**: Guided thinking through complex problems
- **Adaptive optimization**: Performance improves with usage

### Scalability
- **Context segmentation**: Manages complexity through agent spawning
- **Parallel execution**: Multiple agents work concurrently
- **Resource optimization**: Efficient tool and API usage
- **Session isolation**: Multiple projects can run independently

The 8-phase FSM represents a sophisticated approach to AI workflow orchestration that combines systematic structure with cognitive enhancement, enabling complex projects to be completed with high quality and efficiency.