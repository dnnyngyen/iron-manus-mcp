---
title: "Iron Manus MCP System Architecture"
topics: ["architecture", "system design", "FSM", "8-phase workflow", "orchestration"]
related: ["core/FSM.md", "core/TOOLS.md", "core/SECURITY.md"]
---

# Iron Manus MCP System Architecture

**Technical implementation guide for the 8-phase FSM-driven orchestration system with unified tool architecture and intelligent API workflows.**

## Executive Summary

**What**: Iron Manus MCP implements an 8-phase FSM (INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE) with unified tool architecture and intelligent API orchestration.

**Why**: Complex AI projects require systematic orchestration with specialized capabilities, intelligent API integration, and robust data processing.

**How**: FSM-driven workflow orchestration with metaprompting-first design, unified tool consolidation, and role-based cognitive enhancement.

**Key Innovation**: Metaprompting-first architecture that guides intelligent thinking rather than constraining it through unified workflows and strategic cognitive guidance.

## The OS Kernel & Application Architecture

### Iron Manus as Operating System Kernel

**JARVIS FSM serves as the OS Kernel** - the ultimate authority managing all system resources and defining execution environment rules.

**Kernel Responsibilities:**
- **Resource Management**: Controls tool access and system resources
- **Process Scheduling**: Manages phase transitions and execution flow
- **Memory Management**: Maintains session state across phases
- **Security Enforcement**: Enforces tool constraints and prevents unauthorized access
- **System Call Interface**: Provides JARVIS system call for process communication

### Claude as Sandboxed Application

**Claude operates as a sophisticated application process** in user space, completely managed by the kernel but with complex internal logic.

**Application Characteristics:**
- **Sophisticated reasoning**: Advanced cognitive capabilities and natural language processing
- **Task-specific design**: Built for complex cognitive tasks
- **User space execution**: Cannot access system resources directly
- **Kernel-managed**: All operations through kernel system calls
- **Process isolation**: Cannot interfere with kernel operations

### Control Mechanism: System Calls and Environment Variables

**Tool Access = System Calls:**
- Claude cannot perform operations directly
- Must request kernel permission via system calls (tools)
- Single tool per iteration enforces atomic operations
- Phase-specific tool allowlists define system call tables

**Prompt Engineering = Environment Variables:**
- Initial prompt cascade loads like environment variables
- Runtime context injection updates process environment
- Phase-specific prompts define different system capabilities

## 8-Phase FSM Architecture

### Core State Machine

```
INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE
```

Each phase has specialized prompts defining behavior through natural language programming:

### Phase Details

**INIT (System Initialization)**
- Purpose: Internal session state setup
- Tools: JARVIS only
- Duration: Instantaneous
- Transitions to: QUERY

**QUERY (Objective Analysis)**
- Purpose: User-facing analysis and role detection
- Tools: JARVIS only
- Features: Claude-powered intelligent role selection
- Claude analyzes objective and selects optimal role from 9 specialized types

**ENHANCE (Requirement Refinement)**
- Purpose: Goal enhancement with role-specific frameworks
- Tools: JARVIS only
- Enhancement: Applies role-specific thinking methodologies
- Adds missing requirements and context

**KNOWLEDGE (Information Gathering)**
- Purpose: Intelligent research and data synthesis
- Tools: WebSearch, WebFetch, APITaskAgent, PythonComputationalTool, Task
- Features: Auto-connection system for API discovery and synthesis
- Parallel research capabilities with cross-validation

**PLAN (Strategic Decomposition)**
- Purpose: Task breakdown with meta-prompt generation
- Tools: TodoWrite only
- Features: Fractal orchestration with meta-prompt DSL
- Creates structured task lists with agent spawning instructions

**EXECUTE (Task Execution)**
- Purpose: Implementation with agent spawning
- Tools: Full tool access (Task, Bash, Read, Write, Edit, PythonComputationalTool)
- Features: Single tool per iteration, meta-prompt detection and agent spawning
- Context segmentation for complex workflows

**VERIFY (Quality Assessment)**
- Purpose: Validation and completion assessment
- Tools: Read, PythonComputationalTool, validation tools
- Features: Hook integration for structured feedback
- Mathematical validation with rollback capabilities

**DONE (Completion)**
- Purpose: Session completion and cleanup
- Tools: None
- Features: Performance metrics and session summary
- Enters standby mode for new objectives

## Unified Tool Architecture

### Tool Consolidation Results

**75% Python Tool Reduction**: 3 overlapping tools → 1 unified PythonComputationalTool
**API Workflow Consolidation**: 3 manual steps → 1 intelligent APITaskAgent workflow
**Category Organization**: 5 logical categories (orchestration, api, computation, content, system)

### Tool Categories

**Orchestration Tools** (`src/tools/orchestration/`)
- **JARVISTool**: Primary FSM controller and phase orchestrator
- **IronManusStateGraphTool**: Persistent state management with knowledge graphs

**API Tools** (`src/tools/api/`)
- **APITaskAgent**: Unified API research workflow (discovery → validation → fetching)
- Replaces: APISearch, APIValidator, MultiAPIFetch

**Computation Tools** (`src/tools/computation/`)
- **PythonComputationalTool**: Unified Python operations with automatic library management
- Operations: web_scraping, data_analysis, visualization, machine_learning, custom
- Replaces: PythonExecutor, PythonDataAnalysis, EnhancedPythonDataScience

**Content Tools** (`src/tools/content/`)
- **SlideGeneratorTool**: Template-based presentation generation

**System Tools** (`src/tools/system/`)
- **HealthCheckTool**: Comprehensive system monitoring and diagnostics

### Shared Infrastructure

**`src/utils/api-fetcher.ts`**: Centralized HTTP request logic
- Used by all API tools for consistency
- Features: rate limiting, retries, SSRF protection, response sanitization

**`src/tools/tool-registry.ts`**: Centralized tool management
- Auto-discovery and initialization
- Type-safe tool access
- Category-based organization

## Role-Based Cognitive Enhancement

### 9-Role System

**Core Cognitive Roles (6):**
1. **planner** - Strategic planning and architecture design
2. **coder** - Implementation and development
3. **critic** - Quality assessment and security review
4. **researcher** - Information gathering and synthesis
5. **analyzer** - Data analysis and pattern recognition
6. **synthesizer** - Integration and optimization

**UI-Specialized Roles (3):**
7. **ui_architect** - UI architecture and design systems
8. **ui_implementer** - Frontend development and component building
9. **ui_refiner** - UI polish and optimization

### Role Configuration

Each role has comprehensive configuration:
- **Thinking Methodology**: Specialized cognitive frameworks
- **Validation Rules**: Role-specific quality standards
- **Authority Level**: Scope of decision-making power
- **Suggested Frameworks**: Recommended approaches and patterns

### Claude-Powered Role Selection

The system uses Claude's natural language understanding for intelligent role selection:
- Analyzes objective context and requirements
- Selects optimal role from 9 specialized types
- Provides confidence scoring and reasoning
- Graceful fallback to keyword-based detection

## Meta Thread-of-Thought Orchestration

### Fractal Agent Spawning

**Meta-Prompt DSL**: Domain-specific language for agent spawning
```
(ROLE: agent_type) (CONTEXT: domain) (PROMPT: instructions) (OUTPUT: deliverable)
```

**Context Segmentation Strategy:**
1. **Main Orchestrator Context**: Strategic workflow and phase management
2. **Specialized Agent Context**: Focused technical implementation
3. **Result Integration Context**: Synthesis of specialized outputs

### Agent Communication Patterns

**Critical Limitation**: Task() agents spawn with completely isolated contexts
- Cannot access variables from spawning agent
- Cannot directly receive output from other agents
- Must use file-based communication protocols

**Session Workspace Pattern**:
```
/tmp/iron-manus-session-{session_id}/
├── primary_research.md      (researcher agent)
├── analysis_data.md         (analyzer agent)
├── technical_specs.md       (coder agent)
└── synthesized_knowledge.md (synthesizer agent)
```

## Security Architecture

### Hybrid Cognitive-Deterministic System

**Cognitive Layer (FSM)**: Strategic reasoning and decision-making
**Deterministic Layer (Hooks)**: Fast validation and quality enforcement

### Security Features

**Built-in Protection:**
- SSRF protection with IP/hostname validation
- URL scheme validation (HTTP/HTTPS only)
- Request timeout and size limits
- Rate limiting per API endpoint

**Claude Code Hooks Enhancement:**
- Command validation for dangerous operations
- Enhanced SSRF protection with allowlist enforcement
- Output validation for code quality and security
- Session monitoring and performance tracking

### Multi-Layer Security

1. **Input Validation**: Comprehensive argument validation
2. **Runtime Protection**: SSRF guards and rate limiting
3. **Output Validation**: Code quality and security scanning
4. **Session Monitoring**: Performance tracking and anomaly detection

## Performance Characteristics

### System Metrics

**FSM Execution Times:**
- Phase transition: 50-200ms average
- Agent spawning: 100-500ms per agent
- Tool execution: 10-2000ms depending on complexity

**Memory Usage:**
- Base system: 50-100MB
- Per session: 10-20MB
- Agent instances: 5-15MB each

**Throughput:**
- Simple workflows: 1-5 operations/second
- Complex workflows: 0.1-0.5 operations/second
- Parallel agent execution: 2-5 concurrent agents

### Optimization Strategies

**Parallel Operations**: Multiple agents work concurrently
**Resource Pooling**: Shared infrastructure reduces overhead
**Caching**: Session state and API responses cached
**Lazy Loading**: Tools loaded only when needed

## Integration Patterns

### MCP Protocol Compliance

**Standard MCP Interface**: Full compatibility with MCP specification
**Tool Registration**: Automatic tool discovery and registration
**Error Handling**: Consistent error responses and recovery
**Resource Management**: Proper cleanup and resource disposal

### Multi-Server Coordination

**Orchestrator Pattern**: Iron Manus as primary orchestrator
**Peer Collaboration**: Equal partners with handoff protocols
**Hierarchical Delegation**: Meta-control with specialized orchestrators

## Quality Assurance

### Testing Architecture

**323 Comprehensive Tests**: 100% success rate
- Unit tests for individual components
- Integration tests for FSM workflow
- End-to-end tests for complete scenarios
- Performance tests for optimization

**Test Categories:**
- Configuration management
- Security validation
- FSM state transitions
- Tool integrations
- API registry functionality

### Verification Requirements

**Mathematical Validation**: Completion percentage-based verification
**Rollback Logic**: Intelligent rollback on insufficient completion
**Quality Thresholds**: Configurable quality standards
**Hook Integration**: Structured feedback from validation hooks

## Key Architectural Insights

### Software 3.0 Implementation

**Natural Language Programming**: Prompts as executable code
**Context Compilation**: Prompt templates compile into behavior
**Runtime System**: FSM manages execution environment
**Meta-Language**: Meta-prompts for recursive agent spawning

### Design Philosophy

**Trust Intelligence**: Tools guide thinking rather than constraining it
**Cognitive Enhancement**: Role-based thinking methodologies
**Systematic Structure**: 8-phase workflow ensures thoroughness
**Extensible Architecture**: Modular design supports growth

### Production Readiness

**Enterprise Security**: SSRF protection and validation hooks
**Performance Optimization**: Shared infrastructure and caching
**Comprehensive Testing**: 323 tests with 100% success rate
**Operational Monitoring**: Health checks and performance metrics

## Summary

Iron Manus MCP v0.2.4 represents a production-ready AI orchestration platform featuring:

- **8-phase FSM workflow** with intelligent rollback
- **Unified tool architecture** with 75% redundancy elimination
- **Role-based cognitive enhancement** with 9 specialized roles
- **Meta Thread-of-Thought orchestration** for complex project management
- **Hybrid security model** combining cognitive and deterministic layers
- **Comprehensive testing** with 323 passing tests

The architecture demonstrates how to build scalable AI orchestration systems that enhance intelligence rather than constraining it, resulting in more powerful, maintainable, and user-friendly AI infrastructure.