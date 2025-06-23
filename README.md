# Iron Manus JARVIS - Native Task Agent System

## An Experimental Software 3.0 Implementation

**My first project** exploring how Claude's native tools can be leveraged for autonomous development. The goal: demonstrate that sophisticated agent behavior doesn't require complex external systems - Claude's own tools are sufficient for Software 3.0 experimentation.

## What Makes This Different

1. **Uses Claude's own tools** - No external APIs or complex orchestration
2. **Natural language as code** - Prompts become executable programs  
3. **Recursive agent spawning** - Agents can create specialized sub-agents
4. **Minimal complexity** - Single MCP tool handles everything

Iron Manus JARVIS hijacks Claude's built-in `Task()` and `TodoWrite/TodoRead` tools to create autonomous task agents. **For developers who want AI autopilot**: Describe what you want, watch JARVIS break it down and spawn specialized agents that work autonomously.

## Software 3.0 Context

Building on Andrej Karpathy's vision where AI becomes augmentation suits for human intelligence:

- **Software 1.0**: Hand-written code (if/else, loops, functions)
- **Software 2.0**: Neural networks learn patterns from data  
- **Software 3.0**: Natural language as executable programs with AI augmentation

This project explores Software 3.0 by turning **prompts into programs** that compile into agent behavior through Claude's native tooling. Instead of traditional code orchestrating AI, natural language becomes the orchestration layer itself.

## The Core Innovation

### Native Task Agents (Not External APIs)

- **Uses Claude's Task() tool** to spawn actual Claude instances as specialized agents
- **TodoWrite/TodoRead becomes task decomposition** - automatic breakdown and execution tracking
- **Meta-prompt syntax parsing** - `(ROLE: coder) (CONTEXT: auth) (PROMPT: build JWT) (OUTPUT: code)`
- **Sequential Thinking fork** - repurposed as a finite state machine for workflow control

### How It Works

1. **You describe a goal** - "Build a React dashboard with auth and real-time charts"
2. **JARVIS auto-decomposes** - Uses TodoWrite to break into specialized tasks
3. **Agents spawn via Task()** - Creates coder, analyzer, ui_architect agents automatically  
4. **Autonomous execution** - Each agent works independently then reports back
5. **Minimal intervention** - You mostly just watch it work

## Example Usage

```typescript
// Just call JARVIS with your goal
await mcp.callTool({
  name: 'JARVIS',
  args: {
    session_id: 'my-session',
    initial_objective: 'Build a dashboard with user auth and data visualization'
  }
});

// JARVIS automatically:
// 1. Breaks down the goal using TodoWrite
// 2. Spawns Task(ui_architect) for component design
// 3. Spawns Task(coder) for auth implementation  
// 4. Spawns Task(analyzer) for performance optimization
// 5. Coordinates everything through the 6-phase FSM
```

## Technical Implementation

### 6-Phase Finite State Machine

- **QUERY** - Understand what you want
- **ENHANCE** - Add missing details and requirements
- **KNOWLEDGE** - Research if needed
- **PLAN** - Break into tasks (creates meta-prompts for agents)
- **EXECUTE** - Run tasks (spawns Task() agents or direct execution)
- **VERIFY** - Check completion and quality

### Natural Language Programming

The system compiles natural language into executable agent behavior:

```typescript
// Traditional Software 1.0
function processTask(task) {
  if (task.type === 'complex') {
    return spawnAgent(task);
  }
  return executeDirectly(task);
}

// Software 3.0 in Iron Manus
const EXECUTE_PROMPT = `Think through your execution strategy:
- If todo contains (ROLE:...) pattern, use Task() tool to spawn specialized agent
- If todo is direct execution, use appropriate tools (Bash/Browser/etc.)
- Single tool per iteration, then report back`;
```

### Meta-Prompt Agent Spawning

When JARVIS creates a todo like:

```text
(ROLE: coder) (CONTEXT: authentication) (PROMPT: Implement JWT auth with refresh tokens) (OUTPUT: production_code)
```

It automatically spawns a Task() agent with a specialized prompt that includes:

- Role-specific thinking methodologies
- Context about the auth domain
- Detailed implementation instructions
- Quality standards and validation rules

### Sequential Thinking Fork

Credit to Sequential Thinking, but we use it differently:

- **Not for reasoning chains** - Used as FSM controller
- **Prompt injection engine** - Enforces workflow and injects specialized prompts
- **State management** - Tracks session progress and agent coordination

## Architecture

```text
iron-manus-mcp/
├── src/
│   ├── index.ts          # MCP server with single JARVIS tool
│   ├── core/
│   │   ├── fsm.ts        # 6-phase state machine logic
│   │   ├── prompts.ts    # Phase-specific prompt templates
│   │   ├── state.ts      # Session and agent state management
│   │   └── types.ts      # Core interfaces
│   └── utils/
└── docs/
    ├── ARCHITECTURE.md   # Deep dive into the FSM design
    ├── ORCHESTRATION.md  # Phase-by-phase workflow explanation
    ├── PROMPTS.md        # How prompt injection works
    └── visuals/          # Examples and diagrams
```

## Installation

1. **Clone and build:**

   ```bash
   git clone <repo-url>
   cd iron-manus-mcp
   npm install
   npm run build
   ```

2. **Add to Claude Code:**

   ```bash
   # Add to your MCP config
   ```

## Why This Experiment Matters

- **Genuinely novel approach** - Hijacking Claude's native tools for agent behavior
- **Software 3.0 exploration** - Natural language becomes the programming layer
- **Elegant simplicity** - Single MCP tool replaces complex agent frameworks
- **Recursive capabilities** - Agents spawn sub-agents through meta-prompting
- **Zero external dependencies** - Everything runs through Claude's existing capabilities

## Credits & Inspiration

- **Andrej Karpathy** - Software 3.0 vision and "Iron Man suits for AI" concept
- **Sequential Thinking** - Forked their approach but repurposed as FSM controller
- **Claude's native tools** - Task(), TodoWrite/TodoRead are the foundation
- **Iron Man inspiration** - JARVIS as AI augmentation suit metaphor

---

This is my first project exploring how Claude's native features can be leveraged for autonomous development. The goal is to demonstrate that sophisticated agent behavior doesn't require complex external systems - Claude's own tools are sufficient for Software 3.0 experimentation.

Check [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for the technical deep dive.