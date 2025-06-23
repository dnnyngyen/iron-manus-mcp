# Iron Manus JARVIS Documentation

## Native Tool Agent System Documentation

This documentation covers **Iron Manus JARVIS** - a system that hijacks Claude's native tools (`Task()`, `TodoWrite/TodoRead`) to create autonomous task agents. Instead of complex external frameworks, it uses Claude's built-in capabilities for sophisticated agent orchestration.

### System Overview

- **Core Innovation**: Native tool augmenting for agent behavior
- **JARVIS (MCP)**: 6-phase FSM orchestrating Claude's native tool usage
- **Agent Spawning**: Meta-prompt DSL creates specialized Task() agents
- **Workflow**: Autonomous task decomposition and execution

## 📚 Documentation Structure

### Core Documentation

- **[Getting Started Guide](./GETTING_STARTED.md)** - 5-minute quick start tutorial
- **[Architecture Guide](./ARCHITECTURE.md)** - Complete technical deep dive into the 6-phase FSM
- **[Orchestration Details](./ORCHESTRATION.md)** - Phase-by-phase workflow breakdown
- **[Prompt Architecture](./PROMPTS.md)** - Software 3.0 natural language programming patterns

### Additional Resources

- **[Visual Examples](./visuals/)** - Diagrams, flowcharts, and example workflows
- **Technical Implementation** - Detailed code references and patterns
- **Meta-Prompt Examples** - Real-world agent spawning scenarios

## 🚀 Quick Start

```typescript
// Simple usage - just call JARVIS with your goal
await mcp.callTool({
  name: 'JARVIS',
  args: {
    session_id: 'my-session',
    initial_objective: 'Build a React dashboard with user auth and real-time charts'
  }
});

// JARVIS automatically:
// 1. Clarifies and enhances your goal (QUERY → ENHANCE)
// 2. Gathers needed knowledge (KNOWLEDGE)
// 3. Creates structured task breakdown (PLAN)
// 4. Spawns specialized agents for complex work (EXECUTE)
// 5. Validates completion mathematically (VERIFY)
```

## 🎯 Key Features

### Core Capabilities

- **Native Tool Integration**: Uses Claude's existing capabilities without external dependencies
- **6-Phase FSM Workflow**: Structured QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE
- **Meta-Prompt DSL**: `(ROLE: X) (CONTEXT: Y) (PROMPT: Z) (OUTPUT: W)` syntax for agent spawning
- **Recursive Orchestration**: Agents can spawn specialized sub-agents through Task() calls

### Agent Orchestration Hierarchy

- **Task-level**: Direct tool execution (Bash, Read, Write, Edit)
- **Agent-level**: Specialized Task() agents with role-specific prompts
- **Session-level**: Complete workflow coordination through 6-phase FSM

## 🏗️ Technical Architecture

### 6-Phase FSM Workflow

- **QUERY** - Goal clarification and role detection
- **ENHANCE** - Requirement specification and detail addition
- **KNOWLEDGE** - Information gathering (WebSearch, research, analysis)
- **PLAN** - Task decomposition with meta-prompt creation
- **EXECUTE** - Iterative execution with agent spawning
- **VERIFY** - Mathematical validation (95% threshold) with intelligent rollback

### Native Tool Integration

- **TodoWrite/TodoRead** - Intelligent task decomposition and tracking
- **Task() Tool** - Specialized agent spawning with role-specific prompts
- **Direct Tools** - Bash, Read, Write, Edit for simple task execution
- **Analysis Tools** - Python execution, web research, code diagnostics

## 📖 Documentation Guide

### For Beginners

1. Start with **[Getting Started Guide](./GETTING_STARTED.md)** for basic setup and first usage
2. Try the quick examples to understand the 6-phase workflow
3. Experiment with meta-prompts to see agent spawning in action

### For Technical Understanding

1. Read **[Architecture Guide](./ARCHITECTURE.md)** for the complete technical deep dive
2. Study **[Orchestration Details](./ORCHESTRATION.md)** for phase-by-phase breakdowns
3. Explore **[Prompt Architecture](./PROMPTS.md)** for Software 3.0 natural language programming

### For Implementation

1. Understand the core FSM in `src/core/fsm.ts`
2. Study prompt engineering patterns in `src/core/prompts.ts`
3. See meta-prompt generation and agent spawning logic

## 🛠️ Common Use Cases

### Development Projects

```typescript
// Example: "Build a React e-commerce site with Stripe integration"
// JARVIS creates:
// - Setup tasks (direct execution)
// - (ROLE: ui_architect) for component design
// - (ROLE: coder) for payment integration
// - (ROLE: analyzer) for security review
```

### Analysis Projects

```typescript
// Example: "Analyze my codebase for performance issues"
// JARVIS creates:
// - Code scanning (direct execution)
// - (ROLE: analyzer) for performance analysis
// - (ROLE: critic) for security audit
// - (ROLE: synthesizer) for recommendations
```

### Research Projects

```typescript
// Example: "Research best practices for microservices architecture"
// JARVIS creates:
// - Information gathering (WebSearch/WebFetch)
// - (ROLE: researcher) for source validation
// - (ROLE: analyzer) for pattern analysis
// - (ROLE: synthesizer) for final report
```

## 📊 What Makes This Different

### vs Traditional Agent Frameworks

- **No external dependencies** - Uses Claude's native tools only
- **Elegant simplicity** - Single MCP tool handles everything
- **Natural integration** - Feels like enhanced Claude, not separate system

### vs Manual Claude Usage

- **Systematic workflow** - 6-phase FSM ensures thorough approach
- **Specialized expertise** - Role-specific agents with domain knowledge
- **Automatic delegation** - Complex tasks spawn appropriate specialists
- **Quality validation** - Mathematical completion thresholds

### vs Complex AI Systems

- **Minimal complexity** - No APIs, databases, or external orchestration
- **Self-contained** - Everything runs through Claude's existing capabilities
- **Transparent operation** - Clear phases and decision points
- **Reliable outcomes** - 95% completion threshold with intelligent rollback

## 🔧 System Requirements

### Prerequisites

- **Claude Code** with MCP support
- **Node.js 18+** for the MCP server
- **TypeScript** knowledge helpful for customization

### Installation

```bash
git clone <repo-url>
cd iron-manus-mcp
npm install
npm run build
```

Add to Claude Code MCP configuration and restart.

## 🤝 Contributing

### Documentation

- Keep focus on implemented features vs aspirational ones
- Provide real examples and concrete use cases
- Maintain clear distinction between core innovation and supporting features

### Code

- Preserve the elegant simplicity of native tool integration
- Maintain the 6-phase FSM structure
- Keep meta-prompt DSL syntax consistent

## 📞 Support

### Getting Help

- **Start with [Getting Started Guide](./GETTING_STARTED.md)** for basic usage
- **Check [Architecture Guide](./ARCHITECTURE.md)** for technical understanding
- **Study the code** - it's designed to be readable and well-documented

### Common Issues

- **Sessions not persisting**: Check MCP server connection and file permissions
- **Agents not spawning**: Verify meta-prompt syntax `(ROLE:...) (CONTEXT:...) (PROMPT:...) (OUTPUT:...)`
- **Tasks not completing**: Review verification thresholds and task descriptions

---

## Summary

Iron Manus JARVIS demonstrates that sophisticated agent behavior doesn't require complex external frameworks. By augmenting Claude's native tools (`Task()`, `TodoWrite/TodoRead`) and orchestrating them through a 6-phase FSM, it achieves autonomous task decomposition, specialized agent spawning, and reliable completion validation.

**The key insight**: Claude's built-in capabilities are sufficient for Software 3.0 agent systems when properly orchestrated through natural language programming patterns.

*Start with the [Getting Started Guide](./GETTING_STARTED.md) to see it in action.*