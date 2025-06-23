# Manus FSM Orchestrator
## Software 3.0 AI Operating System Kernel

An **AI Operating System Kernel** that implements **Software 3.0 computing** - where natural language becomes executable code running on a kernel-managed system. Claude operates as a sophisticated **application process** executing natural language programs in **user space**, while the FSM serves as the **kernel** with ultimate authority over system resources.

## Overview

The Manus FSM Orchestrator creates a **kernel-level control plane** that manages AI processes with the same rigor as an operating system manages applications - through system calls, environment variables, and process isolation. Claude feels autonomous and powerful (like any good application) while operating entirely within a **sandbox** created by the FSM kernel.

**Key Innovation**: The first **Software 3.0 operating system** that treats **natural language as executable code** running on a kernel-managed system. AI agents become **sandboxed application processes** executing natural language programs with strict control through elegant system-level architecture.

## Key Features

### OS Kernel Architecture
- **Kernel-Level Control**: FSM operates in "kernel mode" with unrestricted access; Claude operates in "user mode" with restricted access
- **System Call Interface**: Claude cannot access resources directly - must request through `manus_orchestrator` system calls
- **Process Isolation**: Claude's execution is completely contained within its sandbox with strict security boundaries
- **Resource Management**: Kernel controls memory (context), CPU (phase timing), and I/O (tool access)

### Software 3.0 Natural Language Computing
- **Natural Language as Code**: Prompts are executable programs that define behavior, logic flow, and execution patterns
- **Prompt Compilation**: 6-layer template system compiles natural language into sophisticated agent behavior
- **Runtime Program Modification**: Context injection allows programs to modify themselves based on state
- **Meta-Programming**: Process spawning through natural language DSL: `(ROLE: X) (CONTEXT: Y) (PROMPT: Z) (OUTPUT: W)`

### Application Process Management
- **Sandboxed Execution**: Claude operates as sophisticated application with complex internal logic but kernel-managed boundaries
- **Process Communication**: All agent processes communicate through kernel's system call interface
- **Memory Management**: Session state persistence across phase transitions with kernel-controlled context injection
- **Privilege Separation**: Clear separation between system-level operations (FSM) and application-level operations (Claude)

## Workflow Phases

The FSM kernel implements a 6-phase workflow that manages Claude's execution like an OS manages application processes:

| Phase | Kernel Function | System Calls Available | Application Behavior |
|-------|-----------------|------------------------|---------------------|
| **QUERY** | Process initialization | `manus_orchestrator` | Analyze user objectives |
| **ENHANCE** | Environment configuration | `manus_orchestrator` | Refine understanding |
| **KNOWLEDGE** | Resource allocation | `WebSearch`, `WebFetch`, `mcp__ide__executeCode` | Gather required information |
| **PLAN** | Process scheduling | `TodoWrite`, `manus_orchestrator` | Create structured plan |
| **EXECUTE** | Runtime execution | All available system calls | Implement solution |
| **VERIFY** | Quality control | Read-only system calls | Validate completion |

### Software 3.0 Programming Paradigm

**Software Evolution**:
- **Software 1.0**: Hand-written code (if/else, loops, functions)
- **Software 2.0**: Neural networks learn patterns from data  
- **Software 3.0**: Natural language prompts as executable programs

**How Natural Language Becomes Code**:
```typescript
// Software 1.0: Traditional code
function analyzeTasks() {
  if (tasks.length > 0) {
    return tasks.filter(t => t.status === 'pending');
  }
}

// Software 3.0: Natural language as executable code
const QUERY_PROMPT = `Think through your analysis approach before proceeding. Consider:
- What is the user really asking for at its core?
- What are the key requirements and constraints?`;
```

**Key Software 3.0 Elements**:
- **Natural Language Control Flow**: "Think through... then proceed with..."
- **Conditional Logic in Prose**: "If todos with meta-prompts... else direct execution"  
- **Function Calls as Instructions**: "Use TodoRead to check current tasks"
- **Template-Based Compilation**: Natural language templates compile into executable agent behavior

### OS Kernel + Software 3.0 Integration

- **System Calls**: Tools that execute Software 3.0 natural language programs (like `read()`, `write()`, `fork()` in Unix)
- **Process Phases**: Different execution modes running different natural language programs
- **Meta-Prompting**: `fork()` system call that compiles and spawns new Software 3.0 programs for specialized agents  
- **Prompt Compilation**: 6-layer template system that compiles natural language into kernel-executable instructions

## Architecture

The Manus FSM Orchestrator implements a minimal, focused architecture with novel LLM-native orchestration patterns:

```
Core Components:
└── manus_orchestrator (Single MCP tool with FSM control)
    ├── State Manager (Session and phase tracking)
    ├── Phase-specific Prompts (Cognitive enhancement)
    ├── Tool Gating (Security and workflow control)
    └── Transition Logic (Deterministic phase progression)
```

**Key Design Principles:**
- **LLM-as-Governor Pattern**: FSM serves as cognitive control mechanism for AI reasoning flows
- **Protocol Constraint Exploitation**: Uses MCP limitations as architectural opportunities for infrastructure consolidation
- **Dynamic Meta-Prompt Generation**: Systematic creation of specialized agents with role-specific cognitive frameworks
- **Deterministic Orchestration**: Predictable workflow progression through protocol-level constraint enforcement

**Architectural Innovations:**
- **Direct-to-LLM-Runtime Orchestration**: Phase-based workflow control with adaptive performance tracking
- **Single-Tool Infrastructure**: Replaces complex multi-component architectures through MCP constraint exploitation
- **Fractal Agent Delegation**: Hierarchical task decomposition with specialized meta-prompt extraction
- **Cognitive Enhancement Integration**: Role-specific reasoning multipliers (2.3x-3.2x) with framework application

## How It Works

The orchestrator implements a deterministic workflow through phase-controlled prompt injection:

1. **Initialize**: User provides objective, FSM creates session in `INIT` phase
2. **Phase Transition**: Claude calls `manus_orchestrator`, FSM transitions to next phase
3. **Prompt Injection**: FSM injects phase-specific system prompts and tool restrictions
4. **Execution**: Claude follows enhanced prompts to complete phase objectives
5. **Iteration**: Process repeats through all phases until task completion

The FSM controls Claude's behavior through strategic prompt injection, eliminating the need for complex external orchestration systems.

## Project Structure

```
manus-fsm-orchestrator/
├── src/
│   ├── types.ts                 # Core type definitions and interfaces
│   ├── prompts.ts              # Phase-specific prompt templates
│   ├── state.ts                # Session state management
│   ├── fsm.ts                  # Finite state machine logic
│   ├── enhanced-tool-schemas.ts # Tool schema definitions
│   └── index.ts                # MCP server entry point
├── dist/                       # Compiled JavaScript output
├── archive/                    # Legacy documentation and examples
├── package.json               # Project configuration and dependencies
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
```

## Installation & Setup

### Prerequisites

- Node.js 18.0.0 or higher
- Claude Code CLI with MCP support

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd manus-fsm-orchestrator
   npm install
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Register with Claude Code:**
   ```bash
   claude mcp add ./dist/index.js
   ```

4. **For Windsurf IDE Integration:**
   ```bash
   # The project includes windsurf-config.json for MCP integration
   # Windsurf will automatically detect and load the configuration
   ```

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start the MCP server
- `npm run dev` - Build and start in development mode
- `npm run clean` - Remove compiled output

## Usage

### Basic Usage

The orchestrator is invoked through a single tool call with session-based state management:

```javascript
// Initial invocation with user objective
manus_orchestrator({
  session_id: "unique_session_id",
  initial_objective: "Create a React application with user authentication"
})

// Subsequent calls to progress through phases
manus_orchestrator({
  session_id: "unique_session_id",
  phase_completed: "QUERY",
  payload: { /* phase-specific data */ }
})
```

### Session Management

Each orchestration sequence requires a unique `session_id` to track state across phases. The FSM automatically manages phase transitions and applies appropriate cognitive enhancements.

## Key Benefits

- **Simplicity**: Single tool replaces complex multi-tool architectures
- **Transparency**: Open-source implementation with clear, readable code
- **Determinism**: Predictable workflow progression through FSM control
- **Cognitive Enhancement**: Role-based reasoning with performance multipliers
- **Security**: Phase-gated tool access ensures controlled execution
- **Maintainability**: Minimal codebase with clean separation of concerns

## Technical Implementation

The orchestrator leverages several key techniques:

- **Finite State Machine**: Manages deterministic phase transitions
- **Prompt Injection**: Phase-specific system prompts control behavior
- **Tool Gating**: Security through restricted tool access per phase
- **Session Management**: Stateful tracking across orchestration sequences
- **Cognitive Enhancement**: Role-based reasoning with performance multipliers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Documentation

For detailed technical information, see the comprehensive documentation in the `docs/` directory:

- **[Architecture Guide](./docs/001_ARCHITECTURE_GUIDE.md)** - Complete system architecture and 6-layer prompt engineering details
- **[Orchestration Loop](./docs/002_ORCHESTRATION_LOOP.md)** - Step-by-step workflow execution and phase transitions  
- **[System Diagrams](./docs/003_System_Diagram.md)** - Visual architecture flows and ASCII diagrams
- **[Prompt Architecture](./docs/004_PROMPT_ARCHITECTURE.md)** - Deep dive into prompt engineering implementation
- **[Prompt Flow Diagrams](./docs/005_PROMPT_FLOW_DIAGRAMS.md)** - Visual prompt compilation and processing flows

## Support

For issues, questions, or contributions, please use the GitHub issue tracker.

---

*The Manus FSM Orchestrator demonstrates that sophisticated agent orchestration can be achieved through elegant prompt engineering architectures that guide natural reasoning patterns rather than constraining them.*