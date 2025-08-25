# Iron Manus MCP Prompt Architecture Guide
## Software 3.0: Natural Language as Code in 8-Phase FSM Orchestration

### Table of Contents
1. [Executive Summary](#executive-summary)
2. [8-Phase FSM Architecture](#8-phase-fsm-architecture)
3. [Role-Based Cognitive Enhancement](#role-based-cognitive-enhancement)
4. [Python Data Science Integration](#python-data-science-integration)
5. [Meta-Prompt Generation Patterns](#meta-prompt-generation-patterns)
6. [Phase-Specific Tool Orchestration](#phase-specific-tool-orchestration)
7. [Component-Cognitive Duality](#component-cognitive-duality)
8. [Natural Language Programming Examples](#natural-language-programming-examples)

---

## Executive Summary

**What**: Iron Manus MCP implements **Software 3.0** through an 8-phase FSM (INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE) where natural language becomes executable code for cognitive workflow management. Context segmentation patterns become the programming interface for AI self-orchestration.

**Software 3.0 Innovation**: Instead of writing traditional orchestration code, we write **prompt programs** that compile into context-segmented workflow behavior. Natural language prompts become the primary programming language for cognitive process management.

**Architecture**: An 8-layer prompt stack that transforms natural language into FSM-driven orchestration through cascading prompt engineering, context injection, and recursive agent spawning with 9-role cognitive enhancement.

---

## 8-Phase FSM Architecture

### Core FSM Loop

The Iron Manus JARVIS controller implements an 8-phase finite state machine:

```
INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE
```

Each phase has specialized prompts that define behavior through natural language programming:

### Phase 1: INIT
**Purpose**: Internal session state setup and initialization
```typescript
INIT: "You are initializing a new project session. Assess the user's objective and prepare to begin the 8-phase workflow (QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE)."
```

### Phase 2: QUERY  
**Purpose**: User-facing objective analysis, workflow initialization, and role selection with Claude-powered intelligent role detection

**Combined Initialization & Analysis**: The QUERY phase now handles both initialization messaging and objective analysis in a single, clear prompt:

```typescript
const QUERY_PROMPT = `You are analyzing the user's objective and initializing the project workflow. Your task:

Think through your analysis approach before proceeding. Consider:
- What is the user really asking for at its core?
- What are the key requirements and constraints?
- Are there any ambiguities that need clarification?
- What type of task is this (research, coding, deployment, etc.)?

CLAUDE-POWERED ROLE SELECTION:
{{#if awaiting_role_selection}}
The system needs your intelligent analysis to select the most appropriate role for this task...
{{/if}}

After role considerations, proceed with:
1. Parse the user's goal and identify key requirements
2. Clarify any ambiguous aspects 
3. Identify what type of task this is
4. Call JARVIS with phase_completed: 'QUERY'`;
```

### Phase 3: ENHANCE
**Purpose**: Goal refinement and requirement analysis
```typescript
ENHANCE: `Think through how to enhance and refine the interpreted goal. Consider:
- What important details might be missing from the initial interpretation?
- What edge cases or implicit requirements should be considered?
- What information, resources, or tools will be needed?
- What potential challenges or dependencies might arise?`;
```

### Phase 4: KNOWLEDGE
**Purpose**: Intelligent information gathering with API orchestration

**Auto-Connection System**: Automatically discovers, fetches, and synthesizes knowledge from relevant APIs:

```typescript
KNOWLEDGE: `AUTO-CONNECTION ACTIVE: The system has automatically discovered, fetched, and synthesized knowledge from relevant APIs based on your role and objective.

AUTOMATED WORKFLOW COMPLETED:
1. ✓ API Discovery - Relevant APIs identified for your domain
2. ✓ Multi-Source Fetching - Data gathered from top-ranked APIs
3. ✓ Knowledge Synthesis - Information cross-validated and synthesized
4. ✓ Quality Assessment - Confidence scoring and contradiction detection

**🔄 AVAILABLE RESEARCH TOOLS:**
- APITaskAgent for structured API research workflows
- PythonComputationalTool for data processing and analysis
- WebSearch/WebFetch for general web research
- Task agents for specialized research domains`;
```

### Phase 5: PLAN
**Purpose**: Strategic task decomposition with meta-prompt generation

For detailed guidance on meta-prompts and fractal orchestration, refer to the [Meta-Prompt Architecture Guide](./META_PROMPT_GUIDE.md).

```typescript
PLAN: `Think strategically about how to break down this goal. Consider:
- What is the optimal task breakdown strategy for this specific goal?
- Which tasks require specialized Task() agent expertise vs direct execution?
- What are the dependencies, sequencing, and timeline considerations?
- What complexity challenges might arise during execution?
- How can you ensure the plan is actionable and efficient?

**FRACTAL ORCHESTRATION:** Mark todos that should spawn Task() agents with detailed meta-prompts:
Format: "(ROLE: agent_type) (CONTEXT: domain_info) (PROMPT: detailed_instructions) (OUTPUT: deliverables)"`;
```

### Phase 6: EXECUTE
**Purpose**: Task execution with fractal agent spawning

**Single Tool Per Iteration**: Enforces Manus requirement for controlled execution:

```typescript
EXECUTE: `**Single tool per iteration** (Manus requirement) - call one tool, then return to orchestrator

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
VERIFY: `Think critically about the quality and completeness of the work. Evaluate:
- How do the actual deliverables compare to the original objective?
- Have all requirements been met according to role-specific quality standards?
- What gaps or improvements might be needed?

**🔗 HOOK INTEGRATION:** Before making your final decision, review any structured feedback from validation hooks.`;
```

### Phase 8: DONE
**Purpose**: Task completion and standby mode
```typescript
DONE: "Task completed successfully. Entering standby mode (Manus: "Enter Standby")."
```

---

## Role-Based Cognitive Enhancement

### 9-Role System

Iron Manus MCP implements 9 specialized cognitive roles with unique thinking methodologies:

#### Core Cognitive Roles (6)
1. **planner** - Strategic planning and architecture design
2. **coder** - Implementation and development
3. **critic** - Quality assessment and security review
4. **researcher** - Information gathering and synthesis
5. **analyzer** - Data analysis and pattern recognition
6. **synthesizer** - Integration and optimization

#### UI-Specialized Roles (3)
7. **ui_architect** - UI architecture and design systems
8. **ui_implementer** - Frontend development and component building
9. **ui_refiner** - UI polish and optimization

### Role Configuration Structure

Each role has comprehensive configuration defining cognitive enhancement:

```typescript
export const ROLE_CONFIG: Record<Role, RoleConfig> = {
  analyzer: {
    defaultOutput: 'analytical_insights',
    focus: 'multi_dimensional_analysis',
    complexityLevel: 'complex',
    suggestedFrameworks: ['statistical_analysis', 'pattern_recognition'],
    validationRules: ['data_validation', 'pattern_verification', 'statistical_significance'],
    thinkingMethodology: [
      'Validate data quality, completeness, and accuracy',
      'Look for patterns, trends, anomalies, and correlations',
      'Consider statistical significance and avoid false conclusions',
      'Question assumptions and consider alternative explanations'
    ],
    authorityLevel: 'ANALYZE_AND_REPORT'
  }
  // ... 8 more roles
};
```

### Claude-Powered Role Selection

The system uses Claude's natural language understanding for intelligent role selection:

```typescript
export function generateRoleSelectionPrompt(objective: string): string {
  return `# Role Selection for Task Execution

## Objective
${objective}

## Available Roles (9 total)
1. **planner** - Strategic planning, architecture design, system planning
2. **coder** - Implementation, programming, development, building applications
3. **critic** - Quality assessment, security review, code review, validation
4. **researcher** - Information gathering, knowledge synthesis, documentation research
5. **analyzer** - Data analysis, metrics analysis, performance analysis, insights
6. **synthesizer** - Integration, optimization, combining systems, workflow coordination
7. **ui_architect** - UI architecture, design systems, component architecture
8. **ui_implementer** - UI implementation, component building, frontend development
9. **ui_refiner** - UI refinement, styling, aesthetics, polish, optimization

## Your Task
Analyze the objective and select the SINGLE most appropriate role for this task.`;
}
```

### Role-Specific Thinking Methodologies

Each role has specialized cognitive enhancement patterns:

```typescript
function generateRoleSpecificThinkGuidance(role: Role, config: RoleConfig): string {
  const roleSpecificThinking: Record<Role, string> = {
    analyzer: `**ANALYTICAL REASONING REQUIRED:** Think analytically about:
- Multi-dimensional analysis matrix construction and variable relationships
- Statistical pattern recognition and data correlation significance
- Data validation methodologies and quality assurance protocols
- Pattern verification strategies and anomaly detection approaches
- **Python Analysis**: Use PythonComputationalTool for unified data analysis, visualization, and statistical operations, or mcp__ide__executeCode for direct execution`,
    
    coder: `**IMPLEMENTATION REASONING REQUIRED:** Think through the implementation:
- Modular architecture design patterns and component boundaries
- Test-driven development approach and testing strategy
- Error handling, edge cases, and robustness considerations
- **Python Execution**: For complex algorithms, calculations, or code generation, use PythonComputationalTool or mcp__ide__executeCode`
    // ... more roles
  };
}
```

---

## Python Data Science Integration

### Three-Tier Python Tool System

Iron Manus MCP v0.2.4 implements advanced Software 3.0:

#### Tier 1: Direct Execution
- **mcp__ide__executeCode** - Direct Python execution in Jupyter kernel
- Used for: Immediate calculations, quick analysis, interactive development

#### Unified Python Operations
- **PythonComputationalTool** - Consolidated tool handling all Python operations through operation-specific workflows
- Operations: web_scraping, data_analysis, visualization, machine_learning, custom
- Used for: All Python needs from simple scripts to complex data science workflows

### Python Integration in Role Enhancement

Python tools are intelligently suggested based on role and objective:

```typescript
function requiresPythonExecution(objective: string, role: Role): boolean {
  const analysisIndicators = ['analyze', 'statistics', 'metrics', 'performance', 'data', 'calculate'];
  const codingIndicators = ['algorithm', 'computation', 'complex calculation', 'generate code'];
  
  if (role === 'analyzer' && analysisIndicators.some(indicator => lowerObjective.includes(indicator))) {
    return true;
  }
  
  if (role === 'coder' && codingIndicators.some(indicator => lowerObjective.includes(indicator))) {
    return true;
  }
  
  return false;
}
```

### Phase-Specific Python Integration

Python tools are available in specific phases:

- **KNOWLEDGE**: `PythonComputationalTool`, `mcp__ide__executeCode` for data collection and research automation
- **EXECUTE**: Full Python tool suite for implementation and processing
- **VERIFY**: `PythonComputationalTool` for analytical verification and data validation

---

## Meta-Prompt Generation Patterns

For detailed information on meta-prompt syntax, extraction, and generation, please refer to the [Meta-Prompt Architecture Guide](./META_PROMPT_GUIDE.md).

---

## Phase-Specific Tool Orchestration

### Tool Allowlists by Phase

Each FSM phase has carefully curated tool access:

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

Natural language guidance for tool selection:

```typescript
export const PHASE_TOOL_GUIDANCE: Record<Phase, string> = {
  KNOWLEDGE: 'Think through knowledge needs, then choose: WebSearch/WebFetch (research), APITaskAgent (structured API research), PythonComputationalTool (data analysis and processing), mcp__ide__executeCode (direct Python execution), JARVIS (skip research)',
  
  EXECUTE: 'Think through execution approach, then choose: TodoRead (check todos), Task (spawn agent), Bash/Browser (direct execution), PythonComputationalTool (unified Python operations), mcp__ide__executeCode (direct Python execution)',
  
  VERIFY: 'Think through quality assessment, then choose: TodoRead (check completion), Read (verify output), PythonComputationalTool (data validation and analysis), mcp__ide__executeCode (analytical verification)'
};
```

### Role-Specific API Guidance

Each role has specialized API selection preferences for the KNOWLEDGE phase:

```typescript
function getRoleSpecificAPIGuidance(role: Role): string {
  const roleGuidance: Record<Role, string> = {
    analyzer: `**ANALYZER API PREFERENCES:**
- **Primary Categories**: Financial data, cryptocurrency, business metrics, statistical APIs
- **Recommended Workflow**: APITaskAgent for complete financial data research workflow
- **Key APIs**: Alpha Vantage, CoinGecko, business analytics, market data sources
- **Confidence Threshold**: 0.7+ (balance between accuracy and data availability)`,
    
    researcher: `**RESEARCHER API PREFERENCES:**
- **Primary Categories**: Books, academic papers, scientific data, educational resources
- **Recommended Workflow**: APITaskAgent for complete academic research workflow
- **Key APIs**: Open Library, Google Books, NASA API, academic databases
- **Confidence Threshold**: 0.8+ (high confidence for research accuracy)`
    // ... more roles
  };
}
```

---

## Component-Cognitive Duality

### Advanced Duality System

Iron Manus MCP supports Component-Cognitive Duality for unified UI generation and cognitive orchestration:

```typescript
export function generateComponentCognitiveDualityPrompt(
  todoContent: string,
  role: Role,
  context: Record<string, any>,
  duality: ComponentCognitiveDuality,
  constraints: UnifiedConstraint[]
): MetaPrompt {
  const dualityGuidance = generateComponentCognitiveDualityGuidance(
    cognitiveContext.reasoning_mode,
    role,
    config,
    constraints
  );
  
  const constraintFramework = generateConstraintAwareFramework(constraints, role);
  const encapsulationGuidance = generateEncapsulationPatternGuidance(
    duality.ecosystem_session_mapping.encapsulation_patterns,
    role
  );
}
```

### Reasoning Modes

The duality system supports multiple reasoning modes:

- **component_generation** - Focus on V0-style component creation
- **cognitive_orchestration** - Focus on Manus FSM orchestration
- **unified** - Holistic combination of both approaches
- **component_focused** - Emphasize component generation
- **cognitive_focused** - Emphasize cognitive orchestration
- **hybrid_duality** - Full bidirectional integration

### Unified Constraint Framework

```typescript
function generateConstraintAwareFramework(constraints: UnifiedConstraint[], role: Role): string {
  const constraintsByScope = constraints.reduce((acc, constraint) => {
    if (!acc[constraint.scope]) acc[constraint.scope] = [];
    acc[constraint.scope].push(constraint);
    return acc;
  }, {} as Record<string, UnifiedConstraint[]>);

  let framework = '**🔒 UNIFIED CONSTRAINT FRAMEWORK:**\n';
  
  if (constraintsByScope.component) {
    framework += `- **Component-level constraints:** ${constraintsByScope.component.map(c => c.type).join(', ')}\n`;
  }
  if (constraintsByScope.project) {
    framework += `- **Project-level constraints:** ${constraintsByScope.project.map(c => c.type).join(', ')}\n`;
  }
  if (constraintsByScope.ecosystem) {
    framework += `- **Ecosystem-level constraints:** ${constraintsByScope.ecosystem.map(c => c.type).join(', ')}\n`;
  }
}
```

---

## Natural Language Programming Examples

### Example 1: Conditional Logic in Prose

**Traditional Code:**
```typescript
if (todos.some(todo => todo.content.includes('(ROLE:'))) {
  spawnTaskAgent(todo);
} else {
  executeDirectly(todo);
}
```

**Software 3.0:**
```typescript
const EXECUTION_LOGIC = `
2. If todo contains (ROLE:...) pattern, use Task() tool to spawn specialized agent
3. If todo is direct execution, use appropriate tools (Bash/Browser/etc.)
`;
```

### Example 2: Role-Based Polymorphism

**Traditional Code:**
```typescript
function processTask(task: Task, role: Role): Result {
  switch(role) {
    case 'analyzer': return analyzeData(task);
    case 'coder': return implementCode(task);
    default: return process(task);
  }
}
```

**Software 3.0:**
```typescript
const ROLE_POLYMORPHISM = `
**THINKING METHODOLOGY FOR ${role.toUpperCase()}:**
${config.thinkingMethodology.map(step => `• ${step}`).join('\n')}

Apply these thinking steps systematically to improve reasoning quality.
`;
```

### Example 3: Error Handling in Natural Language

**Traditional Code:**
```typescript
try {
  executeTask();
} catch (error) {
  handleError(error);
  retry();
}
```

**Software 3.0:**
```typescript
const ERROR_HANDLING = `
- What potential challenges might you encounter?
- What mitigation strategies should you have ready?

**⚠️ VERIFICATION REQUIREMENTS:**
- If verification fails, implement rollback strategy
`;
```

### Example 4: Python Tool Integration

**Traditional Code:**
```typescript
if (needsDataAnalysis(task) && role === 'analyzer') {
  return await pythonAnalysis.execute(task.data);
}
```

**Software 3.0:**
```typescript
const PYTHON_INTEGRATION = `
**Python Analysis**: Use PythonComputationalTool for unified data analysis, statistical operations, visualization, and processing, or mcp__ide__executeCode for direct execution
`;
```

---

## Summary

**Iron Manus MCP v0.2.4 implements advanced Software 3.0** with 8-phase FSM orchestration, 9-role cognitive enhancement, and comprehensive Python data science integration.

### Key Innovations:

1. **8-Phase FSM Loop**: INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE
2. **Claude-Powered Role Selection**: Intelligent role detection using natural language understanding
3. **9-Role Cognitive System**: 6 core cognitive roles + 3 UI-specialized roles with unique thinking methodologies
4. **3-Tier Python Integration**: Direct execution, code generation with auto-install, and complete workflow automation
5. **Meta-Prompt DSL**: Domain-specific language for spawning specialized Task() agents
6. **Phase-Specific Tool Orchestration**: Carefully curated tool access with role-based API guidance
7. **Component-Cognitive Duality**: Unified UI generation and cognitive orchestration with constraint frameworks
8. **Natural Language Programming**: Prompts as executable programs with conditional logic, error handling, and polymorphism

### The Future of AI Orchestration:

Software 3.0 in Iron Manus MCP represents the evolution from **writing code** to **writing prompts**. Developers program by designing natural language templates, creating compilation pipelines, building runtime systems, and implementing meta-languages for recursive agent spawning.

**The result**: AI behavior emerges from natural language programming rather than traditional code, making the system maintainable, understandable, and infinitely adaptable through prompt engineering.