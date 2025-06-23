# Getting Started with Iron Manus JARVIS
## 5-Minute Quick Start Guide

### What You'll Learn
- How to use JARVIS for autonomous task execution
- Understanding the 6-phase workflow
- Creating meta-prompts for specialized agents
- Watching recursive agent spawning in action

---

## Installation & Setup

### 1. Install the MCP Server
```bash
git clone <repo-url>
cd iron-manus-mcp
npm install
npm run build
```

### 2. Add to Claude Code Configuration
Add Iron Manus JARVIS to your MCP settings:
```json
{
  "mcpServers": {
    "iron-manus": {
      "command": "node",
      "args": ["path/to/iron-manus-mcp/dist/index.js"]
    }
  }
}
```

### 3. Restart Claude Code
The JARVIS tool should now be available in your tool list.

---

## Basic Usage

### Example 1: Simple Project Request
**User Input:**
```
I want to create a React todo app with TypeScript
```

**What JARVIS Does:**
1. **QUERY**: "You want a React todo app with TypeScript and standard features"
2. **ENHANCE**: "Add state management, local storage, responsive design"
3. **KNOWLEDGE**: Skips research (common project)
4. **PLAN**: Creates structured task breakdown:
   ```
   - Set up React TypeScript project structure
   - (ROLE: ui_architect) (CONTEXT: todo_app) (PROMPT: Design component hierarchy) (OUTPUT: architecture_plan)
   - (ROLE: coder) (CONTEXT: react_typescript) (PROMPT: Implement todo CRUD) (OUTPUT: working_components)
   - Add styling and responsive design
   ```
5. **EXECUTE**: 
   - Direct execution for simple tasks
   - Spawns Task(ui_architect) for design
   - Spawns Task(coder) for implementation
6. **VERIFY**: Checks 95% completion + all critical tasks done

### Example 2: Analysis Project
**User Input:**
```
Analyze my codebase for performance bottlenecks and suggest optimizations
```

**What JARVIS Does:**
1. **QUERY**: "You want performance analysis and optimization recommendations"
2. **ENHANCE**: "Include bundle analysis, runtime profiling, memory usage"
3. **KNOWLEDGE**: Might research latest optimization techniques
4. **PLAN**: Creates analysis breakdown:
   ```
   - Scan codebase structure and identify key files
   - (ROLE: analyzer) (CONTEXT: performance_audit) (PROMPT: Analyze bundle size and dependencies) (OUTPUT: bundle_analysis)
   - (ROLE: analyzer) (CONTEXT: code_quality) (PROMPT: Find performance anti-patterns) (OUTPUT: code_review)
   - (ROLE: planner) (CONTEXT: optimization) (PROMPT: Create optimization roadmap) (OUTPUT: action_plan)
   ```
5. **EXECUTE**: Spawns specialized analyzer agents for different aspects
6. **VERIFY**: Ensures comprehensive analysis completed

---

## Understanding the 6-Phase Workflow

### Phase Sequence
```
INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE
```

### What Each Phase Does

**INIT**: System initialization, role detection, session setup

**QUERY**: 
- Clarifies what you really want
- Identifies core requirements and constraints
- Detects the primary role needed (planner, coder, analyzer, etc.)

**ENHANCE**:
- Adds missing details and considerations
- Specifies edge cases and technical requirements
- Enriches the goal with implementation details

**KNOWLEDGE**:
- Gathers any needed information (research, documentation, data analysis)
- Can use WebSearch, WebFetch, or Python analysis
- Skips if no research needed

**PLAN**:
- Breaks work into manageable tasks
- Creates meta-prompts for complex work requiring specialized agents
- Uses TodoWrite to create structured task list

**EXECUTE**:
- Iterates through tasks one by one
- Direct execution for simple tasks (Bash, Read, Write, Edit)
- Spawns Task() agents for meta-prompted tasks
- Single tool per iteration, reports back each time

**VERIFY**:
- Mathematical validation (95% overall + 100% critical tasks)
- Intelligent rollback if completion insufficient
- Quality assessment and final checks

---

## Meta-Prompt Syntax

### Simple Tasks (Direct Execution)
```
"Read and analyze the main configuration file"
"Run tests and report any failures"
"Update import statements in core modules"
```

### Complex Tasks (Agent Spawning)
```
"(ROLE: analyzer) (CONTEXT: security_audit) (PROMPT: Scan for vulnerabilities and security issues) (OUTPUT: security_report)"

"(ROLE: coder) (CONTEXT: authentication) (PROMPT: Implement JWT auth with refresh tokens) (OUTPUT: production_code)"

"(ROLE: ui_architect) (CONTEXT: dashboard_design) (PROMPT: Design responsive dashboard layout) (OUTPUT: component_structure)"
```

### How Meta-Prompts Work
1. **PLAN phase**: JARVIS guides you to create tasks with `(ROLE:...)` syntax for complex work
2. **EXECUTE phase**: System detects meta-prompt pattern and spawns specialized Task() agent
3. **Agent receives**: Full prompt stack with role-specific thinking methodologies
4. **Agent can**: Create its own sub-tasks and spawn sub-agents
5. **Coordination**: All agents report back through the main session

---

## Available Roles

### Core Roles
- **planner**: Systems thinking, dependency analysis, strategic decomposition
- **analyzer**: Data validation, pattern recognition, statistical analysis  
- **coder**: Test-driven development, modular design, implementation
- **critic**: Security analysis, compliance checking, edge case detection
- **researcher**: Source validation, methodology assessment, information gathering
- **synthesizer**: Integration thinking, trade-off analysis, optimization

### UI Specialized Roles
- **ui_architect**: User-centered design, component hierarchy, accessibility
- **ui_implementer**: Implementation patterns, browser compatibility, performance
- **ui_refiner**: Quality assessment, user testing, iterative improvement

---

## Tips for Best Results

### 1. Be Specific About Goals
❌ "Build me an app"
✅ "Create a React dashboard with user authentication and real-time data visualization"

### 2. Trust the Process
- Let JARVIS go through all phases
- Don't interrupt the workflow
- The system will ask if it needs clarification

### 3. Watch for Meta-Prompts
- Complex tasks automatically get broken into specialized agent work
- Each agent brings domain expertise and thinking methodologies
- Agents can spawn sub-agents for even deeper specialization

### 4. Understand Tool Constraints
- Each phase has specific tools available
- Single tool per iteration keeps execution focused
- System will guide tool choices naturally

### 5. Quality Validation
- 95% completion threshold ensures thorough work
- Critical tasks must be 100% complete
- Automatic rollback and retry for incomplete work

---

## Common Patterns

### Development Projects
1. **Setup tasks**: Direct execution (file creation, package initialization)
2. **Architecture**: ui_architect agent for design decisions
3. **Implementation**: coder agents for complex features
4. **Testing**: analyzer agents for quality assessment

### Analysis Projects  
1. **Data gathering**: Direct execution or research agents
2. **Analysis**: analyzer agents with statistical methodologies
3. **Insights**: synthesizer agents for interpretation
4. **Recommendations**: planner agents for action plans

### Research Projects
1. **Information gathering**: researcher agents with validation frameworks
2. **Analysis**: analyzer agents for pattern recognition
3. **Synthesis**: synthesizer agents for integration
4. **Documentation**: Direct execution for final formatting

---

## Troubleshooting

### If Tasks Don't Complete
- Check verification output for specific failure reasons
- System will automatically retry with adjusted approach
- Rollback thresholds: <50% restarts planning, <80% retries execution

### If You Need Different Approach
- Start new session for different methodology
- Each session maintains independent state and reasoning effectiveness
- Can run multiple concurrent sessions for different aspects

### For Complex Multi-Part Projects
- Break into logical phases and run separate sessions
- Use meta-prompts to spawn specialized agents for each major component
- Let the fractal orchestration handle deep task hierarchies

---

## Next Steps

1. **Try the basic examples** above to understand the workflow
2. **Read [ARCHITECTURE.md](./ARCHITECTURE.md)** for deep technical understanding
3. **Study [ORCHESTRATION.md](./ORCHESTRATION.md)** to see detailed phase breakdowns
4. **Experiment with meta-prompts** to leverage specialized agent spawning

The power of Iron Manus JARVIS comes from letting it orchestrate the work while you focus on defining what you want to achieve.