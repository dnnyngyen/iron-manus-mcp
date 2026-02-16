# Iron Manus MCP Prompt Architecture

## 8-Phase FSM Architecture

The Iron Manus JARVIS controller implements an 8-phase finite state machine:

```
INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE
```

Each phase has specialized prompts that define behavior.

### Phase 1: INIT
**Purpose**: Internal session state setup and initialization
```typescript
INIT: "You are initializing a new project session. Assess the user's objective and prepare to begin the 8-phase workflow."
```

### Phase 2: QUERY
**Purpose**: User-facing objective analysis, workflow initialization, and role selection

```typescript
const QUERY_PROMPT = `You are analyzing the user's objective and initializing the project workflow.

Think through your analysis approach:
- What is the user really asking for at its core?
- What are the key requirements and constraints?
- Are there any ambiguities that need clarification?
- What type of task is this (research, coding, deployment, etc.)?

After analysis:
1. Parse the user's goal and identify key requirements
2. Clarify any ambiguous aspects
3. Identify what type of task this is
4. Call JARVIS with phase_completed: 'QUERY'`;
```

### Phase 3: ENHANCE
**Purpose**: Goal refinement and requirement analysis
```typescript
ENHANCE: `Think through how to enhance and refine the interpreted goal:
- What important details might be missing from the initial interpretation?
- What edge cases or implicit requirements should be considered?
- What information, resources, or tools will be needed?
- What potential challenges or dependencies might arise?`;
```

### Phase 4: KNOWLEDGE
**Purpose**: Intelligent information gathering

```typescript
KNOWLEDGE: `AVAILABLE RESEARCH TOOLS:
- APITaskAgent for structured API research workflows
- PythonComputationalTool for data processing and analysis
- WebSearch/WebFetch for general web research
- Task agents for specialized research domains

Decide if you need external information. If sufficient knowledge is available, call JARVIS with phase_completed: 'KNOWLEDGE'.`;
```

### Phase 5: PLAN
**Purpose**: Strategic task decomposition

```typescript
PLAN: `Think strategically about how to break down this goal:
- What is the optimal task breakdown strategy?
- Which tasks require specialized Task() agent expertise vs direct execution?
- What are the dependencies and sequencing?

AGENT SPAWNING: Mark todos that should spawn Task() agents:
Format: "(ROLE: agent_type) (CONTEXT: domain_info) (PROMPT: detailed_instructions) (OUTPUT: deliverables)"`;
```

### Phase 6: EXECUTE
**Purpose**: Task execution with agent spawning

```typescript
EXECUTE: `**Single tool per iteration** - call one tool, then return to orchestrator

## Task() Tool Usage:
When you see a todo formatted as "(ROLE: agent_type) (CONTEXT: domain) (PROMPT: instructions) (OUTPUT: deliverable)", convert it to Task() tool with enhanced prompts.

The Task() tool creates an independent Claude instance that:
- Starts with fresh context
- Has access to the same tools you do
- Works autonomously on the specific task
- Reports back when complete`;
```

### Phase 7: VERIFY
**Purpose**: Quality assessment and completion validation
```typescript
VERIFY: `Think critically about the quality and completeness of the work:
- How do the actual deliverables compare to the original objective?
- Have all requirements been met according to role-specific quality standards?
- What gaps or improvements might be needed?

VERIFICATION REQUIREMENTS:
- Critical tasks must be 100% complete
- Overall completion must be >= 95%
- verification_passed=true requires backing metrics`;
```

### Phase 8: DONE
**Purpose**: Task completion and standby mode
```typescript
DONE: "Task completed successfully. Entering standby mode."
```

---

## Role-Based Prompt Enhancement

### 10-Role System

**Core Roles (6):**
1. **planner** - Strategic planning and architecture design
2. **coder** - Implementation and development
3. **critic** - Quality assessment and security review
4. **researcher** - Information gathering and synthesis
5. **analyzer** - Data analysis and pattern recognition
6. **synthesizer** - Integration and optimization

**UI-Specialized Roles (4):**
7. **ui_architect** - UI architecture and design systems
8. **ui_implementer** - Frontend development and component building
9. **ui_refiner** - UI polish and optimization

### Role Configuration Structure

```typescript
export const ROLE_CONFIG: Record<Role, RoleConfig> = {
  analyzer: {
    defaultOutput: 'analytical_insights',
    focus: 'multi_dimensional_analysis',
    complexityLevel: 'complex',
    suggestedFrameworks: ['statistical_analysis', 'pattern_recognition'],
    validationRules: ['data_validation', 'pattern_verification'],
    thinkingMethodology: [
      'Validate data quality, completeness, and accuracy',
      'Look for patterns, trends, anomalies, and correlations',
      'Consider statistical significance and avoid false conclusions',
      'Question assumptions and consider alternative explanations'
    ],
    authorityLevel: 'ANALYZE_AND_REPORT'
  }
  // ... 9 more roles
};
```

### Role Selection Prompt

The system generates intelligent role selection prompts:

```typescript
export function generateRoleSelectionPrompt(objective: string): string {
  return `# Role Selection for Task Execution

## Objective
${objective}

## Available Roles (10 total)
1. **planner** - Strategic planning, architecture design
2. **coder** - Implementation, programming, development
3. **critic** - Quality assessment, security review
4. **researcher** - Information gathering, knowledge synthesis
5. **analyzer** - Data analysis, metrics, insights
6. **synthesizer** - Integration, optimization
7. **ui_architect** - UI architecture, design systems
8. **ui_implementer** - UI implementation, component building
9. **ui_refiner** - UI refinement, styling, optimization

## Your Task
Analyze the objective and select the SINGLE most appropriate role.`;
}
```

---

## Phase-Specific Tool Orchestration

### Tool Allowlists by Phase

```typescript
export const PHASE_ALLOWED_TOOLS: Record<Phase, string[]> = {
  INIT: ['JARVIS'],
  QUERY: ['JARVIS'],
  ENHANCE: ['JARVIS'],
  KNOWLEDGE: [
    'WebSearch', 'WebFetch', 'APITaskAgent', 'KnowledgeSynthesize',
    'mcp__ide__executeCode', 'PythonComputationalTool',
    'JARVIS'
  ],
  PLAN: ['TodoWrite'],
  EXECUTE: [
    'TodoRead', 'TodoWrite', 'Task', 'Bash', 'Read', 'Write', 'Edit', 'Browser',
    'mcp__ide__executeCode', 'PythonComputationalTool'
  ],
  VERIFY: ['TodoRead', 'Read', 'mcp__ide__executeCode', 'PythonComputationalTool'],
  DONE: []
};
```

### Tool Guidance by Phase

```typescript
export const PHASE_TOOL_GUIDANCE: Record<Phase, string> = {
  KNOWLEDGE: 'Choose: WebSearch/WebFetch (research), APITaskAgent (structured API research), PythonComputationalTool (data analysis), JARVIS (skip research)',

  EXECUTE: 'Choose: TodoRead (check todos), Task (spawn agent), Bash/Browser (direct execution), PythonComputationalTool (Python operations)',

  VERIFY: 'Choose: TodoRead (check completion), Read (verify output), PythonComputationalTool (data validation)'
};
```

---

## Meta-Prompt Generation

For detailed meta-prompt syntax and extraction, refer to [META_PROMPT_GUIDE.md](./META_PROMPT_GUIDE.md).

---

## Python Integration

### Phase-Specific Python Availability

- **KNOWLEDGE**: `PythonComputationalTool` for data collection and research automation
- **EXECUTE**: Full Python tool suite for implementation and processing
- **VERIFY**: `PythonComputationalTool` for analytical verification

---

## Summary

**Key Components:**

1. **8-Phase FSM Loop**: INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE
2. **Role-Based Selection**: Intelligent role detection using natural language understanding
3. **10-Role System**: Core cognitive roles + UI-specialized roles with thinking methodologies
4. **Meta-Prompt DSL**: Domain-specific language for spawning specialized Task() agents
5. **Phase-Specific Tools**: Carefully curated tool access per phase
6. **Agent Spawning**: Role-based prompts with thinking methodologies for specialized execution
