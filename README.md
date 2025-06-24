<img src="./iron-manus-mcp.png" alt="Iron Manus MCP" width="200" height="100"/>
# Iron Manus MCP (& J.A.R.V.I.S.)
**Experimental "Software 3.0" Implementation**

> Forked Sequential Thinking and turned it into a Thread of Thought (ThoT) Meta-Prompting tool with Claude-code's built-in features.

## Overview

"Iron Manus" came from an interest I've had in Chinese AI Superagents, with the name being recently inspired by Andrej Karpathy's "Iron Man" analogy for the future of Software 3.0.

Instead of building complex orchestration systems, it repurposes Claude's native `Task()`, `TodoWrite`, and `TodoRead` tools for autonomous decomposition, delegation. and task management.

## Key Concepts

### Native Tool Integration
- **Task() spawning** - Creates specialized Claude instances as autonomous agents with context management, so conversations can get over 200K+ tokens. (More practical with Sonnet 4)
- **TodoWrite/TodoRead** - Each Todo List item Claude generates gets broken down into a set of sub-ToDo lists for native task decomposition, state management, and progress tracking  
- **Meta-prompt compilation** - Transforms simple syntax into specialized agent prompts

+ **Single MCP One-Shot tool** - Entire system runs through one interface

### The Meta-Prompt DSL
```
(ROLE: agent_type) (CONTEXT: domain) (PROMPT: instructions) (OUTPUT: deliverable)
```

This syntax automatically generates specialized prompts for Task() agents:
```typescript
// Simple input:
"(ROLE: coder) (CONTEXT: authentication) (PROMPT: Implement JWT auth) (OUTPUT: production_code)"

// Becomes a full agent prompt with:
// - Role-specific thinking methodologies
// - Domain context and frameworks  
// - Quality validation rules
// - Output specifications
```

### 6-Phase Workflow
```
QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE
```

Each phase uses native Claude tools for state management and progression:
- **Planning** creates meta-prompt todos via TodoWrite
- **Execution** spawns Task() agents for complex work
- **Verification** ensures quality through systematic checks

## Example Usage

**Input:**
```typescript
await mcp.callTool({
  name: 'JARVIS',
  args: {
    session_id: 'demo',
    initial_objective: 'Create a React dashboard with authentication'
  }
});
```

**Automatic breakdown:**
1. System analyzes the request and detects optimal role (planner)
2. Enhances goal with missing technical requirements
3. Creates specialized todos including meta-prompts
4. Spawns Task(ui_architect) and Task(coder) agents autonomously
5. Agents work independently and report back
6. Verifies completion against success criteria

## Implementation Details

### Architecture
```
iron-manus-mcp/
├── src/
│   ├── index.ts          # MCP server entry point
│   ├── core/
│   │   ├── fsm.ts        # 6-phase state machine
│   │   ├── prompts.ts    # Role-specific prompt templates
│   │   ├── state.ts      # Session management
│   │   └── types.ts      # Core interfaces
│   └── utils/
└── docs/                 # Technical documentation
```

### Role Specialization
The system includes specialized roles with distinct thinking methodologies:
- **Planner** - Strategic decomposition and dependency analysis
- **Coder** - Implementation with testing and best practices
- **Critic** - Security review and quality assessment
- **Analyzer** - Data analysis and pattern recognition
- **Researcher** - Information gathering and synthesis
- **Synthesizer** - Integration and optimization

### Recursive Capabilities
Spawned agents can create their own sub-tasks and spawn additional agents, enabling:
- Unlimited depth of specialization
- Autonomous delegation of complex work
- Self-organizing task hierarchies

## Current Status

### ✅ Implemented
- 6-phase FSM orchestration
- Meta-prompt DSL parsing and compilation
- Role detection and specialization
- Recursive agent spawning via Task()
- Session state persistence
- Quality verification with rollback

### 🚧 In Development  
- Enhanced AST-based meta-prompt validation
- Advanced cognitive framework integration
- Performance optimization and caching

### 💭 Research Areas
- Component-cognitive duality patterns
- Cross-session knowledge persistence
- Advanced constraint satisfaction

## Installation

```bash
git clone https://github.com/dnnyngyen/iron-manus-mcp
cd iron-manus-mcp
npm install
npm run build
```

Add to your Claude Code MCP configuration:
```json
{
  "mcpServers": {
    "iron-manus-mcp": {
      "command": "node",
      "args": ["./dist/index.js"]
    }
  }
}
```

## Technical Philosophy

This project explores **Software 3.0** concepts where natural language becomes executable through AI augmentation. Rather than building external orchestration layers, it demonstrates that sophisticated agent behavior can emerge from elegant tool integration.

The approach prioritizes:
- **Simplicity** over complexity
- **Native integration** over external dependencies  
- **Emergent behavior** over rigid control structures
- **Experimentation** over premature optimization

## Limitations & Considerations

- Working Proof-of-Concept
- Depends on Claude's native tool availability
- Performance limited by Claude's context windows
- Quality depends on prompt engineering effectiveness

## Documentation

- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Technical deep dive
- **[GETTING_STARTED.md](./docs/GETTING_STARTED.md)** - Tutorial and examples
- **[EXAMPLES.md](./docs/EXAMPLES.md)** - Real usage scenarios

## Inspiration & Credits

- **Andrej Karpathy** - Software 3.0 vision and AI augmentation concepts
- **Sequential Thinking** - Workflow orchestration patterns (adapted for FSM control)
- **Claude's native tooling** - Foundation capabilities that make this possible

---

**Note**: This is an experimental exploration of native tool integration for agent behavior. The goal is to demonstrate that sophisticated orchestration can emerge from simple, well-designed tool usage rather than complex external systems.

For technical details and implementation guides, see the documentation in the `docs/` directory.
