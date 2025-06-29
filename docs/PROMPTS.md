# Iron Manus MCP Prompt Architecture Guide
## Software 3.0: Natural Language as Code in Meta Thread-of-Thought Orchestration

### Table of Contents
1. [Executive Summary](#executive-summary)
2. [Software 3.0 Foundations](#software-3.0-foundations)
3. [The 6-Layer Prompt Stack](#the-6-layer-prompt-stack)
4. [Prompt Flow Architecture](#prompt-flow-architecture)
5. [Meta-Prompting Engine](#meta-prompting-engine)
6. [Context Injection Mechanisms](#context-injection-mechanisms)
7. [Natural Language Programming Patterns](#natural-language-programming-patterns)
8. [Prompt Engineering Implementation](#prompt-engineering-implementation)

---

## Executive Summary

**What**: Iron Manus MCP implements **Software 3.0** through Meta Thread-of-Thought orchestration - where natural language becomes executable code for cognitive workflow management. Context segmentation patterns become the programming interface for AI self-orchestration.

**Software 3.0 Innovation**: Instead of writing traditional orchestration code, we write **prompt programs** that compile into context-segmented workflow behavior. Natural language prompts become the primary programming language for cognitive process management.

**Architecture**: A 6-layer prompt stack that transforms natural language into Meta Thread-of-Thought orchestration through cascading prompt engineering, context injection, and recursive agent spawning.

---

## Software 3.0 Foundations

### Traditional Software Evolution
- **Software 1.0**: Hand-written code (if/else, loops, functions)
- **Software 2.0**: Neural networks learn patterns from data
- **Software 3.0**: Natural language prompts as executable programs

### Iron Manus MCP as Software 3.0

In Iron Manus MCP's Meta Thread-of-Thought orchestration, **prompts are the primary programming language** for cognitive workflow management:

```typescript
// Software 2.0: Traditional code
function analyzeTasks() {
  if (tasks.length > 0) {
    return tasks.filter(t => t.status === 'pending');
  }
}

// Software 3.0: Natural language as code
const QUERY_PROMPT = `Think through your analysis approach before proceeding. Consider:
- What is the user really asking for at its core?
- What are the key requirements and constraints?
- Are there any ambiguities that need clarification?`;
```

The **prompt becomes the program** - it defines behavior, logic flow, and execution patterns.

---

## The 6-Layer Prompt Stack

### Layer 1: Base Phase Prompts (`src/core/prompts.ts:243-355`)

**Software 3.0 Concept**: **Workflow Programming in Natural Language**

```typescript
const BASE_PHASE_PROMPTS: Record<Phase, string> = {
  QUERY: `You are in the QUERY phase (Manus: "Analyze Events"). Your task:

Think through your analysis approach before proceeding. Consider:
- What is the user really asking for at its core?
- What are the key requirements and constraints?
- Are there any ambiguities that need clarification?
- What type of task is this (research, coding, deployment, etc.)?
- What primary role would be most effective?

After analyzing the situation, proceed with:
1. Parse the user's goal and identify key requirements
2. Clarify any ambiguous aspects 
3. Identify what type of task this is
4. Detect the primary role needed
5. Call JARVIS with phase_completed: 'QUERY'`,

  EXECUTE: `You are in the EXECUTE phase (Manus Datasource Module). Your task:

Think through your execution strategy before taking action. Analyze:
- What is the current task complexity and scope?
- What is the optimal execution approach for this specific task?
- Should you use direct tools or spawn specialized Task() agents?
- What potential challenges might you encounter?

After analyzing the execution approach, proceed with:
1. Use TodoRead to see your current tasks
2. For todos with meta-prompts (ROLE/CONTEXT/PROMPT/OUTPUT), use Task() tool
3. For direct execution todos, use Bash, Browser, Read, Write, Edit tools
4. **Single tool per iteration** - call one tool, then return
5. After each significant action, call JARVIS`
};
```

**Software 3.0 Elements**:
- **Natural language control flow**: "Think through... then proceed with..."
- **Conditional logic in prose**: "If todos with meta-prompts... else direct execution"
- **Error handling instructions**: "What potential challenges might you encounter?"
- **API calls as natural language**: "Call JARVIS with phase_completed"

### Layer 2: Role-Specific Thinking Methodologies (`src/core/prompts.ts:17-154`)

**Software 3.0 Concept**: **Cognitive Programming - Algorithms as Thought Patterns**

```typescript
export const ROLE_CONFIG: Record<Role, RoleConfig> = {
  planner: {
    thinkingMethodology: [
      'Break down into components and identify dependencies',
      'Assess risks and plan contingencies for failure modes', 
      'Sequence tasks based on dependencies and estimate realistic timeframes',
      'Consider all stakeholders and their constraints'
    ]
  },
  
  analyzer: {
    thinkingMethodology: [
      'Validate data quality, completeness, and accuracy',
      'Look for patterns, trends, anomalies, and correlations',
      'Consider statistical significance and avoid false conclusions',
      'Question assumptions and consider alternative explanations'
    ]
  },
  
  coder: {
    thinkingMethodology: [
      'Define expected behavior and write tests before implementation',
      'Design for single responsibility, loose coupling, high cohesion',
      'Consider error handling, input validation, and graceful degradation',
      'Analyze performance implications and optimization opportunities'
    ]
  }
};
```

**Software 3.0 Elements**:
- **Algorithmic thinking in natural language**: Each step is a cognitive algorithm
- **Domain-specific languages**: Different roles have different "programming languages" of thought
- **Reusable cognitive components**: Thinking methodologies as functions
- **Polymorphic behavior**: Same input, different processing based on role

### Layer 3: Dynamic Context Injection (``)

**Software 3.0 Concept**: **Runtime State Programming in Natural Language**

```typescript
// Context injection as executable natural language
if (nextPhase === 'ENHANCE' && session.payload.interpreted_goal) {
  augmentedPrompt += `\n\n**📋 CONTEXT:** ${session.payload.interpreted_goal}`;
}

if (nextPhase === 'EXECUTE') {
  const currentTaskIndex = session.payload.current_task_index || 0;
  const currentTodos = session.payload.current_todos || [];
  const currentTodo = currentTodos[currentTaskIndex];
  
  augmentedPrompt += `\n\n**📊 EXECUTION CONTEXT:**
- Current Task Index: ${currentTaskIndex}
- Total Tasks: ${currentTodos.length}
- Current Task: ${currentTodo || 'None'}
- Reasoning Effectiveness: ${(session.reasoning_effectiveness * 100).toFixed(1)}%
- Objective: ${session.initial_objective}`;
  
  augmentedPrompt += `\n\n**🔄 FRACTAL EXECUTION PROTOCOL:**
1. Check current todo (index ${currentTaskIndex}) for meta-prompt patterns
2. If todo contains (ROLE:...) pattern, use Task() tool to spawn specialized agent
3. If todo is direct execution, use appropriate tools (Bash/Browser/etc.)
4. After each action, report results back

**⚡ SINGLE TOOL PER ITERATION:** Choose ONE tool call per turn (Manus requirement).`;
}
```

**Software 3.0 Elements**:
- **Variables as natural language**: `Current Task Index: ${currentTaskIndex}`
- **Conditional execution in prose**: "If todo contains (ROLE:...) pattern"
- **Function calls as instructions**: "use Task() tool to spawn specialized agent"
- **Runtime state as readable context**: Makes execution state transparent to Claude

### Layer 4: Meta-Prompt Generation (`src/core/prompts.ts:358-470`)

**Software 3.0 Concept**: **Code Generation Through Natural Language Compilation**

```typescript
export function generateMetaPrompt(todoContent: string, role: Role, context: Record<string, any>): MetaPrompt {
  const config = ROLE_CONFIG[role];
  
  // Generate role-specific Think tool guidance
  const thinkGuidance = generateRoleSpecificThinkGuidance(role, config);
  
  return {
    role_specification: `(ROLE: ${role})`,
    context_parameters: {
      domain_info: context.domain || 'general',
      complexity_level: config.complexityLevel,
      frameworks: config.suggestedFrameworks,
      reasoning_multiplier: config.reasoningMultiplier,
      ...context
    },
    instruction_block: `(PROMPT: "${todoContent}

${thinkGuidance}

**🎯 EXECUTION APPROACH:**
1. Think through your approach using the ${config.cognitiveFrameworks.join(' and ')} frameworks
2. Apply ${role} expertise with ${config.reasoningMultiplier}x cognitive enhancement
3. Follow ${config.validationRules.join(', ')} validation rules
4. Use TodoWrite to create your own sub-task breakdown if needed
5. Think through implementation strategy and potential challenges
6. Execute with systematic precision using ${config.suggestedFrameworks.join(' and ')} methodologies
7. Think critically about work quality against ${config.authorityLevel} standards
8. Report completion with detailed deliverables

**🧠 COGNITIVE ENHANCEMENT:** Your reasoning effectiveness is enhanced ${config.reasoningMultiplier}x through systematic thinking and role-specific frameworks.")`,
    output_requirements: `(OUTPUT: ${config.defaultOutput})`
  };
}
```

**Software 3.0 Elements**:
- **Template-based code generation**: Natural language templates that generate full programs
- **Dependency injection in prose**: Frameworks, validation rules, cognitive patterns injected as readable text
- **Recursive program generation**: Generated programs can generate sub-programs
- **Compile-time optimization**: Context and configuration compiled into natural language instructions

### Layer 5: Tool Constraint Guidance (`src/core/prompts.ts:662-683`)

**Software 3.0 Concept**: **API Design as Natural Language Interfaces**

```typescript
export const PHASE_ALLOWED_TOOLS: Record<Phase, string[]> = {
  INIT: ['JARVIS'],
  QUERY: ['JARVIS'], 
  ENHANCE: ['JARVIS'],
  KNOWLEDGE: ['WebSearch', 'WebFetch', 'mcp__ide__executeCode', 'JARVIS'],
  PLAN: ['TodoWrite'],
  EXECUTE: ['TodoRead', 'TodoWrite', 'Task', 'Bash', 'Read', 'Write', 'Edit', 'Browser', 'mcp__ide__executeCode'],
  VERIFY: ['TodoRead', 'Read', 'mcp__ide__executeCode'],
  DONE: []
};

export const PHASE_TOOL_GUIDANCE: Record<Phase, string> = {
  QUERY: 'Think through the goal analysis, then call JARVIS with phase_completed: "QUERY"',
  KNOWLEDGE: 'Think through knowledge needs, then choose: WebSearch/WebFetch (research), mcp__ide__executeCode (data processing), JARVIS (skip research)',
  EXECUTE: 'Think through execution approach, then choose: TodoRead (check todos), Task (spawn agent), Bash/Browser (direct execution), mcp__ide__executeCode (Python analysis/computation)',
  VERIFY: 'Think through quality assessment, then choose: TodoRead (check completion), Read (verify output), mcp__ide__executeCode (analytical verification)'
};
```

**Software 3.0 Elements**:
- **API documentation as executable guidance**: Tool choices presented as natural language options
- **Access control in prose**: Phase-specific permissions described naturally
- **Interface design as conversation**: Tools presented as choices in dialogue
- **Bounded execution environments**: Natural language creates "sandboxes" for different capabilities

### Layer 6: Recursive Meta-Prompting

**Software 3.0 Concept**: **Self-Modifying Natural Language Programs**

```typescript
// Layer 6 enables infinite recursion of Software 3.0 programs
User Request → Layer 1-5 Prompt Stack
     ↓
Claude creates meta-prompt: "(ROLE: analyzer) (CONTEXT: codebase_eval) (PROMPT: Examine code quality) (OUTPUT: report)"
     ↓ 
System generates new Layer 1-5 stack for spawned agent:
     ↓
Task(analyzer) receives:
- Layer 1: EXECUTE phase prompts for analyzer context
- Layer 2: Analyzer thinking methodology
- Layer 3: Context about codebase evaluation  
- Layer 4: Can generate own meta-prompts for sub-agents
- Layer 5: Analyzer-appropriate tool constraints
     ↓
Spawned analyzer can create: "(ROLE: coder) (CONTEXT: refactoring) (PROMPT: Fix issues) (OUTPUT: code)"
     ↓
Infinite depth of natural language program generation...
```

**Software 3.0 Elements**:
- **Self-modifying programs**: Natural language programs that generate new natural language programs
- **Infinite recursion**: No theoretical limit to program depth
- **Dynamic compilation**: New programs compiled at runtime from natural language specifications
- **Distributed execution**: Multiple natural language programs running concurrently

---

## Prompt Flow Architecture

### Traditional Code Flow vs. Software 3.0 Flow

**Traditional Software 2.0:**
```
Input → Function → Output
```

**Software 3.0 in Iron Manus JARVIS:**
```
User Input → Prompt Cascade → Context Injection → Natural Language Reasoning → Tool Selection → Output
```

### The Prompt Processing Pipeline

```typescript
// 1. Initial Prompt Assembly (Layer 1 + 2 + 5)
function generateRoleEnhancedPrompt(phase: Phase, role: Role, objective: string): string {
  const config = ROLE_CONFIG[role];
  const basePrompt = BASE_PHASE_PROMPTS[phase];  // Layer 1
  const toolGuidance = PHASE_TOOL_GUIDANCE[phase]; // Layer 5
  
  const thinkingMethodology = `
**🧠 THINKING METHODOLOGY FOR ${role.toUpperCase()}:**
${config.thinkingMethodology.map(step => `• ${step}`).join('\n')}  // Layer 2

**🎯 FOCUS:** ${config.focus}
**🔧 FRAMEWORKS:** ${config.suggestedFrameworks.join(', ')}
**🛠️ TOOL GUIDANCE:** ${toolGuidance}

Apply these thinking steps systematically to improve reasoning quality and thoroughness.`;
  
  return basePrompt + thinkingMethodology;  // Software 3.0: String concatenation = program compilation
}

// 2. Context Injection (Layer 3)
function injectDynamicContext(augmentedPrompt: string, session: SessionState, nextPhase: Phase): string {
  if (nextPhase === 'EXECUTE') {
    const currentTaskIndex = session.payload.current_task_index || 0;
    const currentTodos = session.payload.current_todos || [];
    
    // Software 3.0: Runtime state becomes part of the executing program
    augmentedPrompt += `\n\n**📊 EXECUTION CONTEXT:**
- Current Task Index: ${currentTaskIndex}
- Total Tasks: ${currentTodos.length}
- Reasoning Effectiveness: ${(session.reasoning_effectiveness * 100).toFixed(1)}%`;
  }
  return augmentedPrompt;
}

// 3. Meta-Prompt Processing (Layer 4)
function processMetaPrompts(todos: TodoItem[]): EnhancedTodo[] {
  return todos.map(todo => {
    const metaPrompt = extractMetaPromptFromTodo(todo.content);
    if (metaPrompt) {
      // Software 3.0: Natural language syntax becomes executable specification
      return {
        ...todo,
        type: 'TaskAgent',
        meta_prompt: metaPrompt,
        generated_prompt: generateMetaPrompt(todo.content, metaPrompt.role_specification, {})
      };
    }
    return todo;
  });
}
```

---

## Meta-Prompting Engine

### The Meta-Prompt Language

Manus FSM implements a **Domain-Specific Language (DSL) for natural language programming**:

```
(ROLE: agent_type) (CONTEXT: domain_info) (PROMPT: instructions) (OUTPUT: deliverables)
```

This syntax is **compiled** into full natural language programs:

### Compilation Process

**Input DSL:**
```
(ROLE: analyzer) (CONTEXT: typescript_codebase) (PROMPT: Evaluate code quality and identify improvement opportunities) (OUTPUT: technical_report)
```

**Compiled Output (Layer 1-5 Stack):**
```typescript
const compiledProgram = `
You are in the EXECUTE phase (Manus Datasource Module). Your task:

Think through your execution strategy before taking action. Analyze:
- What is the current task complexity and scope?
- What is the optimal execution approach for this specific task?
- Should you use direct tools or spawn specialized Task() agents?

**🧠 THINKING METHODOLOGY FOR ANALYZER:**
• Validate data quality, completeness, and accuracy
• Look for patterns, trends, anomalies, and correlations  
• Consider statistical significance and avoid false conclusions
• Question assumptions and consider alternative explanations

**🎯 FOCUS:** multi_dimensional_analysis
**🔧 FRAMEWORKS:** statistical_analysis, pattern_recognition
**🛠️ TOOL GUIDANCE:** Think through execution approach, then choose: TodoRead (check todos), Task (spawn agent), Bash/Browser (direct execution)

**📊 EXECUTION CONTEXT:**
- Current Task: Evaluate code quality and identify improvement opportunities
- Context Domain: typescript_codebase
- Expected Output: technical_report

**🎯 EXECUTION APPROACH:**
1. Think through your approach using the Multi-dimensional Analysis Matrix and Statistical Pattern Recognition frameworks
2. Apply analyzer expertise with systematic precision
3. Follow data_validation, pattern_verification, statistical_significance validation rules
4. Use TodoWrite to create your own sub-task breakdown if needed
5. Think through implementation strategy and potential challenges
6. Execute with systematic precision using statistical_analysis and pattern_recognition methodologies
7. Think critically about work quality against ANALYZE_AND_REPORT standards
8. Report completion with detailed deliverables

Apply these thinking steps systematically to improve reasoning quality and thoroughness.`;
```

### Meta-Prompt Extraction & Generation

```typescript
// Software 3.0: Parsing natural language syntax into executable components
export function extractMetaPromptFromTodo(todoContent: string): MetaPrompt | null {
  const roleMatch = todoContent.match(/\(ROLE:\s*([^)]+)\)/i);
  const contextMatch = todoContent.match(/\(CONTEXT:\s*([^)]+)\)/i);
  const promptMatch = todoContent.match(/\(PROMPT:\s*([^)]+)\)/i);
  const outputMatch = todoContent.match(/\(OUTPUT:\s*([^)]+)\)/i);
  
  if (roleMatch && promptMatch) {
    return {
      role_specification: roleMatch[1].trim(),
      context_parameters: contextMatch ? { domain: contextMatch[1].trim() } : {},
      instruction_block: promptMatch[1].trim(),
      output_requirements: outputMatch ? outputMatch[1].trim() : 'comprehensive_deliverable'
    };
  }
  return null;
}

// Software 3.0: Template-based program generation
export function generateMetaPrompt(todoContent: string, role: Role, context: Record<string, any>): MetaPrompt {
  const config = ROLE_CONFIG[role];
  
  // Compile role-specific thinking patterns into executable natural language
  const thinkGuidance = generateRoleSpecificThinkGuidance(role, config);
  
  return {
    role_specification: `(ROLE: ${role})`,
    context_parameters: {
      domain_info: context.domain || 'general',
      complexity_level: config.complexityLevel,
      frameworks: config.suggestedFrameworks,
      reasoning_multiplier: config.reasoningMultiplier,
      ...context
    },
    instruction_block: `(PROMPT: "${todoContent}

${thinkGuidance}

**🎯 EXECUTION APPROACH:**
1. Think through your approach using the ${config.cognitiveFrameworks?.join(' and ') || 'systematic'} frameworks
2. Apply ${role} expertise with systematic precision
3. Follow ${config.validationRules.join(', ')} validation rules
4. Use TodoWrite to create your own sub-task breakdown if needed
5. Execute with systematic precision using ${config.suggestedFrameworks.join(' and ')} methodologies
6. Think critically about work quality against ${config.authorityLevel} standards
7. Report completion with detailed deliverables

**🧠 REASONING ENHANCEMENT:** Your reasoning effectiveness is enhanced through systematic thinking and role-specific frameworks.")`,
    output_requirements: `(OUTPUT: ${config.defaultOutput})`
  };
}
```

---

## Context Injection Mechanisms

### Static vs. Dynamic Context

**Static Context (Compile-time):**
```typescript
// Built into prompt templates - Software 3.0 "source code"
const EXECUTE_PROMPT = `Think through your execution strategy before taking action. Analyze:
- What is the current task complexity and scope?
- What is the optimal execution approach for this specific task?`;
```

**Dynamic Context (Runtime):**
```typescript
// Injected based on current system state - Software 3.0 "runtime variables"
augmentedPrompt += `\n\n**📊 EXECUTION CONTEXT:**
- Current Task Index: ${currentTaskIndex}
- Total Tasks: ${currentTodos.length}
- Current Task: ${currentTodo || 'None'}
- Reasoning Effectiveness: ${(session.reasoning_effectiveness * 100).toFixed(1)}%
- Objective: ${session.initial_objective}`;
```

### Context Types in Software 3.0

**1. State Context**: Current system state as natural language
```typescript
**📊 COMPLETION METRICS:**
- Overall Completion: ${completionPercentage}% (${taskBreakdown.completed}/${taskBreakdown.total} tasks)
- Critical Tasks Completed: ${criticalTasksCompleted}/${criticalTasks.length}
- Tasks Breakdown: ${taskBreakdown.completed} completed, ${taskBreakdown.in_progress} in-progress, ${taskBreakdown.pending} pending
```

**2. Historical Context**: Previous decisions and outcomes
```typescript
if (session.payload.verification_failure_reason) {
  augmentedPrompt += `\n\n**🚨 PREVIOUS VERIFICATION FAILURE:**
${session.payload.verification_failure_reason}
Last Completion: ${session.payload.last_completion_percentage}%`;
}
```

**3. Behavioral Context**: Instructions for behavior modification
```typescript
**🔄 FRACTAL EXECUTION PROTOCOL:**
1. Check current todo (index ${currentTaskIndex}) for meta-prompt patterns
2. If todo contains (ROLE:...) pattern, use Task() tool to spawn specialized agent
3. If todo is direct execution, use appropriate tools (Bash/Browser/etc.)
4. After each action, report results back

**⚡ SINGLE TOOL PER ITERATION:** Choose ONE tool call per turn (Manus requirement).
```

---

## Natural Language Programming Patterns

### Pattern 1: Conditional Logic in Prose

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

### Pattern 2: Loop Constructs in Natural Language

**Traditional Code:**
```typescript
for (let i = 0; i < todos.length; i++) {
  processTask(todos[i]);
}
```

**Software 3.0:**
```typescript
const ITERATION_PATTERN = `
**🔄 FRACTAL EXECUTION PROTOCOL:**
1. Check current todo (index ${currentTaskIndex}) for meta-prompt patterns
2. Process the current task
3. Report results back
4. Continue to next task until all complete
`;
```

### Pattern 3: Error Handling as Natural Language

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
- Critical tasks must be 100% complete
- Overall completion must be ≥95%
- If verification fails, implement rollback strategy
`;
```

### Pattern 4: Function Calls as Instructions

**Traditional Code:**
```typescript
const result = analyzeCode(files);
const report = generateReport(result);
return report;
```

**Software 3.0:**
```typescript
const FUNCTIONAL_FLOW = `
1. Use TodoRead to see your current tasks
2. For todos with meta-prompts, use Task() tool to spawn specialized agents  
3. For direct execution todos, use Bash, Browser, Read, Write, Edit tools
4. After each significant action, call JARVIS with results
`;
```

### Pattern 5: Variable Assignment in Natural Language

**Traditional Code:**
```typescript
const currentTask = todos[currentIndex];
const progress = calculateProgress(todos);
```

**Software 3.0:**
```typescript
const VARIABLE_CONTEXT = `
**📊 EXECUTION CONTEXT:**
- Current Task Index: ${currentTaskIndex}
- Total Tasks: ${currentTodos.length}
- Current Task: ${currentTodo || 'None'}
- Reasoning Effectiveness: ${(reasoning_effectiveness * 100).toFixed(1)}%
`;
```

---

## Prompt Engineering Implementation

### Role-Specific Prompt Generation

```typescript
// Software 3.0: Domain-specific natural language compilers
function generateRoleSpecificThinkGuidance(role: Role, config: RoleConfig): string {
  const roleSpecificThinking: Record<Role, string> = {
    planner: `**🧠 STRATEGIC THINKING REQUIRED:** Think strategically about:
- System architecture and component relationships
- Strategic decomposition using Hierarchical Decomposition framework
- Dependencies, timelines, and resource allocation
- Risk assessment and mitigation strategies
- Success criteria and validation checkpoints`,

    analyzer: `**🧠 ANALYTICAL REASONING REQUIRED:** Think analytically about:
- Multi-dimensional analysis matrix construction and variable relationships
- Statistical pattern recognition and data correlation significance
- Data validation methodologies and quality assurance protocols
- Pattern verification strategies and anomaly detection approaches
- **Python Analysis**: Use mcp__ide__executeCode for statistical analysis, data processing`,

    coder: `**🧠 IMPLEMENTATION REASONING REQUIRED:** Think through the implementation:
- Modular architecture design patterns and component boundaries
- Test-driven development approach and testing strategy
- Error handling, edge cases, and robustness considerations
- Code maintainability, readability, and convention adherence
- **Python Execution**: For complex algorithms, calculations, or code generation`
  };

  return roleSpecificThinking[role];
}
```

### UI Agent Prompt Specialization

```typescript
// Software 3.0: Specialized natural language dialects for different domains
export function generateUIRoleEnhancedPrompt(phase: Phase, role: UIRole, objective: string): string {
  const config = UI_ROLE_CONFIG[role];
  const basePrompt = UI_BASE_PHASE_PROMPTS[phase];
  
  const v0Enhancement = `
**🏗️ V0 ARCHITECTURAL ENHANCEMENT:**
- Apply Atomic Design hierarchy: atomic_decomposition → molecular_composition → organism_integration
- Systematic component architecture planning with ${config.reasoningMultiplier}x effectiveness
- Design system integration: ${config.designSystems.join(', ')}
- Accessibility-first architecture: ${config.accessibilityStandards.join(', ')}
- Performance-optimized component planning: ${config.performanceTargets.join(', ')}`;

  const dualityIntegration = `
**🔄 COMPONENT-COGNITIVE DUALITY INTEGRATION:**
- Seamless switching between UI generation and cognitive orchestration modes
- V0 component patterns integrated with Manus FSM phases
- Unified constraint validation across component/project/ecosystem levels
- ${config.reasoningMultiplier}x cognitive enhancement applied to UI-specific reasoning`;

  return basePrompt + v0Enhancement + dualityIntegration;
}
```

### Component-Cognitive Duality Programming

```typescript
// Software 3.0: Multi-paradigm natural language programming
export function generateComponentCognitiveDualityPrompt(
  todoContent: string, 
  role: Role, 
  context: Record<string, any>,
  duality: ComponentCognitiveDuality,
  constraints: UnifiedConstraint[]
): MetaPrompt {
  
  const dualityGuidance = `
**🧠 HYBRID DUALITY REASONING:** Think holistically about unified component-cognitive patterns:
- Bidirectional mapping between V0 Component↔Manus Task hierarchies
- Unified constraint propagation across component/project/ecosystem scopes
- Encapsulation pattern integration with cognitive orchestration
- Performance synergy between component generation and cognitive reasoning
- Cross-domain optimization and architectural elegance
- Duality effectiveness metrics and continuous improvement`;

  const constraintFramework = `
**🔒 UNIFIED CONSTRAINT FRAMEWORK:**
- **Component-level constraints:** ${constraints.filter(c => c.scope === 'component').map(c => c.type).join(', ')}
- **Project-level constraints:** ${constraints.filter(c => c.scope === 'project').map(c => c.type).join(', ')}
- **Ecosystem-level constraints:** ${constraints.filter(c => c.scope === 'ecosystem').map(c => c.type).join(', ')}
- **Constraint validation priority:** ${constraints.filter(c => c.priority === 'critical').length} critical constraints`;

  return {
    role_specification: `(ROLE: ${role} with Component-Cognitive Duality Enhancement)`,
    context_parameters: { /* Enhanced context */ },
    instruction_block: `(PROMPT: "${todoContent}

${dualityGuidance}

${constraintFramework}

**🎯 COMPONENT-COGNITIVE EXECUTION APPROACH:**
1. Think through unified cognitive orchestration + V0 Component Generation frameworks
2. Apply ${role} expertise with enhanced duality synergy
3. Execute with systematic precision using unified constraint-driven methodologies
4. Apply unified constraint hierarchy: Component-level → Project-level → Ecosystem-level
5. Report completion with constraint satisfaction metrics")`,
    output_requirements: `(OUTPUT: enhanced_deliverable + Component-Cognitive Duality Metrics)`
  };
}
```

---

## Software 3.0 Design Principles

### 1. Natural Language as First-Class Code

**Traditional Approach:**
```typescript
// Code defines behavior
function executeTask(task: Task): Result {
  if (task.type === 'analysis') {
    return analyze(task.data);
  }
  return process(task.data);
}
```

**Software 3.0 Approach:**
```typescript
// Natural language defines behavior  
const EXECUTION_BEHAVIOR = `
Think through your execution strategy before taking action. Analyze:
- What is the current task complexity and scope?
- What is the optimal execution approach for this specific task?

If the task requires analysis, use analytical thinking patterns.
Otherwise, use direct processing approaches.`;
```

### 2. Compilation Through Template Assembly

```typescript
// Software 3.0: Natural language templates compile into executable programs
function compilePromptProgram(phase: Phase, role: Role, context: SessionState): string {
  const layer1 = BASE_PHASE_PROMPTS[phase];                    // Base logic
  const layer2 = ROLE_CONFIG[role].thinkingMethodology;        // Role-specific algorithms  
  const layer3 = injectDynamicContext(context);                // Runtime state
  const layer5 = PHASE_TOOL_GUIDANCE[phase];                   // API interfaces
  
  // Compile layers into executable natural language program
  return `${layer1}

**🧠 THINKING METHODOLOGY:**
${layer2.map(step => `• ${step}`).join('\n')}

${layer3}

**🛠️ TOOL GUIDANCE:** ${layer5}`;
}
```

### 3. Runtime Program Modification

```typescript
// Software 3.0: Programs can modify themselves at runtime
function injectRuntimeContext(baseProgram: string, session: SessionState): string {
  // Self-modifying natural language program
  if (session.payload.verification_failure_reason) {
    baseProgram += `\n\n**🚨 RUNTIME MODIFICATION:**
Previous execution failed: ${session.payload.verification_failure_reason}
Adjust strategy accordingly.`;
  }
  
  return baseProgram;
}
```

### 4. Recursive Program Generation

```typescript
// Software 3.0: Programs that generate programs
function generateSubProgram(metaPrompt: MetaPrompt): string {
  // Natural language program generates another natural language program
  return `
You are a specialized ${metaPrompt.role_specification} agent.

${generateRoleSpecificPrompts(metaPrompt.role_specification)}

Your specific task: ${metaPrompt.instruction_block}

Generate additional sub-programs if needed using the same meta-prompt syntax.`;
}
```

---

## Summary

**Iron Manus JARVIS implements Software 3.0** - where natural language becomes the primary programming language and traditional code serves as infrastructure, following the Iron Man vision of human-AI collaboration.

### Key Software 3.0 Innovations:

1. **Natural Language as Executable Code**: Prompts are programs that define behavior, logic flow, and execution patterns
2. **Multi-Layer Compilation**: 6-layer prompt stack compiles natural language into sophisticated agent behavior  
3. **Runtime Program Modification**: Context injection allows programs to modify themselves based on state
4. **Recursive Code Generation**: Meta-prompting enables programs to generate sub-programs infinitely
5. **Domain-Specific Natural Languages**: Different roles use specialized "dialects" of natural language programming
6. **Template-Based Compilation**: Natural language templates compile into full executable programs

### The Future of Programming:

Software 3.0 represents a fundamental shift from **writing code** to **writing prompts**. In Iron Manus JARVIS, developers program by:
- Designing natural language templates (prompt engineering)
- Creating compilation pipelines (layer assembly) 
- Building runtime systems (context injection)
- Implementing meta-languages (meta-prompt syntax)

**The result**: Software behavior emerges from natural language programming rather than traditional code, making the system maintainable, understandable, and adaptable.