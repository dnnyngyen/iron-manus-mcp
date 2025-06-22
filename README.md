# Manus FSM Orchestrator

A lightweight, transparent MCP server that implements deterministic agent orchestration through a finite state machine. This tool provides structured multi-phase task execution with cognitive enhancement and role-based reasoning.

## Overview

The Manus FSM Orchestrator replaces complex multi-tool agent architectures with a single, powerful orchestration tool that guides Claude through a deterministic 6-phase workflow. Each phase applies specialized prompts and tool restrictions to ensure systematic task completion.

## Key Features

- **Single Tool Architecture**: One `manus_orchestrator` tool controls the entire agent workflow
- **Deterministic FSM**: Ensures predictable phase transitions and task progression  
- **Cognitive Enhancement**: Role-based reasoning with 2.3x-3.2x cognitive multipliers
- **Phase-Specific Prompts**: Specialized system prompts for each workflow phase
- **Tool Gating**: Security through phase-restricted tool access
- **Fractal Orchestration**: Supports spawning specialized Task() agents for complex work
- **Performance Tracking**: Built-in analytics and session state management

## Workflow Phases

The FSM orchestrator implements a 6-phase workflow that ensures systematic task completion:

| Phase | Purpose | Available Tools |
|-------|---------|----------------|
| **QUERY** | Interpret and clarify user objectives | `manus_orchestrator` |
| **ENHANCE** | Refine understanding with cognitive enhancement | `manus_orchestrator` |
| **KNOWLEDGE** | Gather required information and context | `manus_orchestrator` |
| **PLAN** | Create structured implementation plan | `TodoWrite`, `manus_orchestrator` |
| **EXECUTE** | Implement solution using all available tools | All tools |
| **VERIFY** | Quality assurance and completion validation | Read-only tools |

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

## Support

For issues, questions, or contributions, please use the GitHub issue tracker.

---

*The Manus FSM Orchestrator demonstrates that sophisticated agent orchestration can be achieved through elegant, minimal architectures rather than complex multi-component systems.*