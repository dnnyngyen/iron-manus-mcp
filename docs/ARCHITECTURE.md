# Iron Manus JARVIS Architecture Guide
## The Complete Guide to Deterministic Agent Control

### Table of Contents
1. [Executive Summary](#executive-summary)
2. [Core Architecture](#core-architecture)
3. [The 6-Phase Orchestration Loop](#the-6-phase-orchestration-loop)
4. [Meta-Prompting System](#meta-prompting-system)
5. [Fractal Orchestration](#fractal-orchestration)
6. [State Management](#state-management)
7. [Value Propositions](#value-propositions)
8. [Implementation Patterns](#implementation-patterns)
9. [Quick Reference](#quick-reference)

---

## Executive Summary

**What**: Iron Manus JARVIS is an **AI Operating System Kernel** that implements Software 3.0 natural language computing through strict hierarchical control and sandboxed execution environments.

**Why**: Traditional LLM interactions lack systematic structure and consistency. Iron Manus JARVIS creates a **kernel-level control plane** that manages AI processes with the same rigor as an operating system manages applications - through system calls, environment variables, and process isolation.

**How**: Through a **6-layer kernel architecture** that functions like an OS kernel managing a sandboxed application process. The FSM serves as the **ultimate authority** that allocates resources (tools), schedules processes (phases), and defines unbreakable rules (constraints) while Claude operates as a sophisticated **application in user space**.

**Key Innovation**: The first system to achieve sophisticated agent behavior by treating **AI as a sandboxed application process** running on a **natural language operating system kernel** - strict control without constraint through elegant system-level architecture.

## The OS Kernel & Sandboxed Application Architecture

This is the most technically precise analogy for understanding Iron Manus JARVIS's "Software 3.0" implementation where natural language becomes executable code running on a kernel-managed system.

### 🔧 **The System (MCP Server / FSM): The Operating System Kernel**

**Iron Manus JARVIS serves as the OS Kernel** - the ultimate authority that manages all system resources and defines the absolute, unbreakable rules of the execution environment.

**Kernel Responsibilities**:
- **Resource Management**: Controls which tools (hardware) Claude can access at any time
- **Process Scheduling**: Manages phase transitions and execution flow  
- **Memory Management**: Maintains session state and context across phases
- **Security Enforcement**: Enforces tool constraints and prevents unauthorized access
- **System Call Interface**: Provides the `JARVIS` system call for process communication

**Just like a real OS kernel**: It doesn't do the application's work, but it dictates what any application is allowed to do. The FSM has **kernel-level authority** over Claude's execution environment.

### 🎯 **The AI (Claude): The Sandboxed Application Process**

**Claude operates as a powerful, sophisticated application process** running in **user space** - completely managed by the kernel but with complex internal logic.

**Application Characteristics**:
- **Sophisticated Internal Logic**: Advanced reasoning capabilities and natural language processing
- **Task-Specific Design**: Built to perform complex cognitive tasks (like a web browser or video editor)
- **User Space Execution**: Cannot access system resources directly
- **Kernel-Managed**: All operations must go through the kernel's system call interface
- **Process Isolation**: Cannot interfere with kernel operations or other processes

**Key Point**: Claude feels autonomous and powerful (like any good application), but operates entirely within the **sandbox** created by the FSM kernel.

### 📡 **The Control Mechanism (Prompts & Tools): System Calls and Environment Variables**

**Tool Access = System Calls**
- **System Call Interface**: Claude cannot "do" things directly - it must ask the kernel for permission via system calls (tools)
- **PHASE_ALLOWED_TOOLS**: The kernel's **system call table** - defines which operations are permitted for the application in its current state
- **Single Tool Per Iteration**: Kernel enforces **atomic system calls** - one operation per kernel interaction

**Prompt Engineering = Environment Variables & Configuration**
- **Initial Prompt Cascade**: Like environment variables and configuration files loaded when the application starts
- **Runtime Context Injection**: Like the kernel updating process environment variables during execution
- **Phase-Specific Prompts**: Like different run-levels in Unix systems - each phase has different system capabilities

### 🔄 **Fractal Orchestration (Task() agents): The fork() System Call**

This is a **perfect technical mapping** to Unix process management.

**Process Spawning**:
- **fork() System Call**: Claude can ask the kernel to create a near-identical copy of itself
- **New Process Creation**: The spawned Task() agent gets its own memory space and resources
- **Specialized Execution**: Each forked process can be given different sub-tasks to execute
- **Parallel Processing**: Multiple agent processes can run concurrently, managed by the kernel
- **Process Communication**: All processes communicate through the kernel's system call interface

**Meta-Prompt = Process Arguments**:
```
(ROLE: coder) (CONTEXT: auth_system) (PROMPT: JWT implementation) (OUTPUT: code)
```
This is exactly like command-line arguments passed to a new process:
```bash
./coder_agent --context=auth_system --task="JWT implementation" --output=code
```

### 🏗️ **Why This Architecture is Technically Precise**

#### **Strict Hierarchical Control**
- **Kernel Mode vs User Mode**: FSM operates in "kernel mode" with unrestricted access; Claude operates in "user mode" with restricted access
- **Privilege Separation**: Clear separation between system-level operations (FSM) and application-level operations (Claude)
- **Security Boundaries**: Claude cannot bypass kernel restrictions or access unauthorized resources

#### **Sandboxed Environment** 
- **Process Isolation**: Claude's execution is completely contained within its sandbox
- **Resource Limits**: Kernel controls memory (context), CPU (phase timing), and I/O (tool access)
- **System Call Mediation**: All Claude operations must go through kernel-controlled interfaces

#### **Natural Language as Executable Code**
- **Environment Variables**: Prompts serve as the application's runtime environment
- **System Configuration**: Phase-specific prompts reconfigure the application's execution context
- **Process Arguments**: Meta-prompts pass structured arguments to spawned processes

### 🎭 **The Elegant Deception: Why Claude Doesn't Feel Controlled**

**From Claude's Perspective**:
- Operates like any sophisticated application - feels powerful and autonomous
- Has access to complex reasoning capabilities and tool interfaces
- Can spawn sub-processes (Task agents) for specialized work
- Receives rich environmental context and configuration

**From the Kernel's Perspective**: 
- Maintains complete control over all system resources
- Enforces strict security boundaries through system call mediation
- Manages all process creation, scheduling, and termination
- Defines the absolute rules of the execution environment

**The Result**: Claude experiences **apparent autonomy** while operating under **absolute kernel control** - just like how applications feel powerful while being completely managed by the OS kernel.

---

## Core Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    IRON MANUS JARVIS STACK                         │
├─────────────────────────────────────────────────────────────┤
│ Claude Agent           │ Guided reasoning within prompts    │
├─────────────────────────────────────────────────────────────┤
│ MCP Server (index.ts)  │ Prompt cascade orchestration       │
├─────────────────────────────────────────────────────────────┤
│ FSM Engine (fsm.ts)    │ Multi-layer prompt injection       │
├─────────────────────────────────────────────────────────────┤
│ State Manager          │ Context & session persistence      │
├─────────────────────────────────────────────────────────────┤
│ Prompt System          │ 6-layer prompt engineering stack   │
└─────────────────────────────────────────────────────────────┘
```

### Key Files and Their Roles

**`src/index.ts` (Lines 73-74)**: MCP Server entry point
```typescript
const output = processState(input);
```

**`src/core/fsm.ts` (Lines 104-372)**: Core FSM logic
```typescript
export function processState(input: MessageJARVIS): FromJARVIS
```

**`src/core/prompts.ts`**: Multi-layer prompt engineering system
- `BASE_PHASE_PROMPTS` (Lines 243-355): Layer 1 - Phase-specific thinking guidance  
- `ROLE_CONFIG` (Lines 17-154): Layer 2 - Role-specific thinking methodologies
- `generateRoleEnhancedPrompt` (Lines 208-240): Layer integration engine
- `generateMetaPrompt` (Lines 358-398): Layer 4 - Meta-prompt generation for Task() agents
- `PHASE_ALLOWED_TOOLS` (Lines 662-671): Layer 5 - Tool constraint guidance

**`src/core/fsm.ts`**: Context injection and prompt cascade orchestration
- `processState` (Lines 104-372): Layer 3 - Dynamic context injection
- `extractMetaPromptFromTodo` (Lines 398-413): Meta-prompt parsing for agent spawning

**`src/core/state.ts`**: Session state and context persistence

---

## The 6-Layer Prompt Engineering Architecture

### Understanding the Prompt Cascade

Before diving into phases, it's crucial to understand that Claude operates within a **sophisticated prompt cascade** that guides its reasoning while maintaining the experience of natural thinking:

**Layer 1: Base Phase Prompts** (`src/core/prompts.ts:243-355`)
- Fundamental thinking prompts for each phase
- Example: "Think through your analysis approach before proceeding. Consider..."
- Directs what Claude focuses on at each workflow stage

**Layer 2: Role-Specific Thinking Methodologies** (`src/core/prompts.ts:17-154`)  
- Explicit thinking steps injected based on detected role
- Example: `planner` gets "Break down into components and identify dependencies"
- Provides concrete reasoning frameworks, not abstract enhancement

**Layer 3: Dynamic Context Injection** (`src/core/fsm.ts:319-351`)
- Real-time context from previous phases, current tasks, metrics
- Execution context, completion percentages, reasoning effectiveness
- Makes each prompt highly specific to current state

**Layer 4: Meta-Prompt Generation** (`src/core/prompts.ts:358-470`)
- Generates specialized prompts for Task() agent spawning
- Complex nested prompt structures with role-specific cognitive frameworks
- Enables recursive agent creation with tailored thinking patterns

**Layer 5: Tool Constraint Guidance** (`src/core/prompts.ts:662-683`)
- Phase-specific tool whitelists presented as "guidance"
- Tool choice suggestions that feel natural but constrain options
- Single tool per iteration enforcement

**Layer 6: Recursive Meta-Prompting** 
- Task() agents receive their own multi-layer prompt stacks
- Can spawn sub-agents with specialized sub-prompts
- Infinite nesting of guided reasoning contexts

### How the Prompt Cascade Works

Claude receives prompts that feel natural but are **architecturally designed** to:
- Shape **what** Claude thinks about (phase prompts)
- Shape **how** Claude thinks (role methodologies) 
- Shape **what context** Claude has (dynamic injection)
- Shape **what tools** Claude can use (constraint guidance)
- Enable **specialized delegation** (meta-prompting)

The result: Claude feels autonomous while operating within **carefully engineered thinking patterns**.

---

## The 6-Phase Workflow Structure

### Phase Flow: QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY

#### **Phase 1: QUERY** - "Analyze Events"
**Purpose**: Role detection and objective clarification

**Code Location**: `src/core/fsm.ts:128-140`
```typescript
case 'QUERY':
  if (input.phase_completed === 'QUERY') {
    if (input.payload?.interpreted_goal) {
      session.payload.interpreted_goal = input.payload.interpreted_goal;
    }
    nextPhase = 'ENHANCE';
  }
```

**System Prompt** (`src/core/prompts.ts:194-210`):
```
Think through your analysis approach before proceeding. Consider:
- What is the user really asking for at its core?
- What are the key requirements and constraints?
- Are there any ambiguities that need clarification?
```

**Prompt Engineering**: Layer 1 (phase) + Layer 2 (role methodology) + Layer 5 (tool constraint)
**What Claude Sees**: "Think through your analysis approach..." + role-specific thinking steps + single tool option
**What Claude Does**: Follows thinking methodology within prompt-guided reasoning → calls `JARVIS` with `interpreted_goal`

#### **Phase 2: ENHANCE** - "Select Tools"
**Purpose**: Goal refinement and requirement specification

**Context Injection** (`src/core/fsm.ts:319-320`):
```typescript
if (nextPhase === 'ENHANCE' && session.payload.interpreted_goal) {
  augmentedPrompt += `\n\n**📋 CONTEXT:** ${session.payload.interpreted_goal}`;
}
```

**Prompt Engineering**: Layer 1 + Layer 2 + Layer 3 (context injection) + Layer 5
**What Claude Sees**: Enhancement prompts + role methodology + previous phase context + single tool option  
**What Claude Does**: Operates within prompt-guided enhancement patterns → calls `JARVIS` with `enhanced_goal`

#### **Phase 3: KNOWLEDGE** - "Wait for Execution"
**Purpose**: Information gathering and domain research

**Tool Constraint**: `['WebSearch', 'WebFetch', 'mcp__ide__executeCode', 'JARVIS']`
**Innovation**: First phase with bounded tool choice (multiple options within whitelist)

**Prompt Engineering**: Layer 1 + Layer 2 + Layer 5 (multiple constrained tools)
**What Claude Sees**: Knowledge assessment prompts + role methodology + multiple tool options that feel like choice
**What Claude Does**: Operates within prompt-guided evaluation patterns → chooses from pre-selected tool whitelist

#### **Phase 4: PLAN** - "Iterate" (Meta-Prompt Injection Point)
**Purpose**: Strategic decomposition and fractal orchestration setup

**Fractal Orchestration Guidance** (`src/core/fsm.ts:322-323`):
```typescript
augmentedPrompt += `\n\n**🔄 FRACTAL ORCHESTRATION GUIDE:**
For complex sub-tasks that need specialized expertise, create todos with this format:
"(ROLE: coder) (CONTEXT: authentication_system) (PROMPT: Implement secure JWT) (OUTPUT: production_ready_code)"

This enables Task() agent spawning in the EXECUTE phase.`;
```

**Prompt Engineering**: Layer 1 + Layer 2 + Layer 3 + Layer 4 (meta-prompt injection) + Layer 5
**Tool Constraint**: `['TodoWrite']` - Forced into planning mode

**Meta-Prompt Generation Process**:
- Claude creates todos following prompt-guided patterns
- Simple: `"Analyze root src directory structure"` 
- Complex: `"(ROLE: analyzer) (CONTEXT: typescript_evaluation) (PROMPT: Examine files for quality) (OUTPUT: technical_report)"`
- Complex todos get processed through `extractMetaPromptFromTodo()` to generate specialized agent prompts

**MCP Processing** (`src/core/fsm.ts:170-188`):
```typescript
const enhancedResults = extractEnhancedMetaPrompts(rawTodos, {
  enableSecurity: true,
  enableCaching: true,
  enableOptimization: true
});
```

#### **Phase 5: EXECUTE** - "Submit Results" (Fractal Iteration Engine)
**Purpose**: Task execution with recursive agent spawning

**Execution Context** (`src/core/fsm.ts:324-332`):
```typescript
augmentedPrompt += `**📊 EXECUTION CONTEXT:**
- Current Task Index: ${currentTaskIndex}
- Total Tasks: ${currentTodos.length}
- Current Task: ${currentTodo || 'None'}
- Reasoning Effectiveness: ${(reasoning_effectiveness * 100).toFixed(1)}%`;
```

**Claude's Prompt-Guided Protocol**:
1. `TodoRead` → Claude checks current task (feels natural, but prompted to do so)
2. **Meta-prompt detection** → Layer 4 prompts guide Claude to recognize `(ROLE:...)` patterns → Claude calls `Task()` with generated specialized prompts
3. **Direct execution** → Layer 5 tool constraints guide Claude toward `Bash`/`Read`/`Write` for simple tasks
4. **Single tool per iteration** → Layer 5 enforcement ensures Claude reports back via `JARVIS`

**Fractal Iteration Control** (`src/core/fsm.ts:208-217`):
```typescript
if (input.payload.more_tasks_pending || currentTaskIndex < totalTasks - 1) {
  session.payload.current_task_index = currentTaskIndex + 1;
  nextPhase = 'EXECUTE'; // Continue iteration
} else {
  nextPhase = 'VERIFY'; // All tasks complete
}
```

#### **Phase 6: VERIFY** - "Enter Standby"
**Purpose**: Mathematical validation and intelligent rollback

**Validation Rules** (`src/core/fsm.ts:467-500`):
```typescript
// Rule 1: 100% critical task completion required
if (criticalTasks.length > 0 && criticalTasksCompleted < criticalTasks.length) {
  result.reason = `Critical tasks incomplete: ${criticalTasksCompleted}/${criticalTasks.length}`;
  return result;
}

// Rule 2: Minimum 95% overall completion
if (completionPercentage < 95) {
  result.reason = `Overall completion ${completionPercentage}% below threshold`;
  return result;
}
```

**Rollback Logic** (`src/core/fsm.ts:237-251`):
```typescript
if (verificationResult.completionPercentage < 50) {
  nextPhase = 'PLAN'; // Severe: restart planning
} else if (verificationResult.completionPercentage < 80) {
  nextPhase = 'EXECUTE'; // Moderate: retry execution
}
```

#### **Phase 7: DONE**
**Purpose**: Mission accomplished, enter standby
**Tool Constraint**: `[]` - No tools needed
**Output**: Performance summary and completion metrics

---

## The Meta-Prompting System (Layer 4 & 6)

### How Meta-Prompting Works

**Layer 4: Meta-Prompt Generation** (`src/core/prompts.ts:358-398`)
The system guides Claude to create todos with special syntax that triggers sophisticated agent spawning:

**Meta-Prompt Structure:**
```
(ROLE: agent_type) (CONTEXT: domain_info) (PROMPT: detailed_instructions) (OUTPUT: deliverables)
```

**The Process:**
1. **Planning Phase**: Claude is prompted to create todos with this structure for complex tasks
2. **Extraction**: `extractMetaPromptFromTodo()` parses the special syntax using regex
3. **Generation**: `generateMetaPrompt()` creates full prompt stacks for spawned agents
4. **Spawning**: Task() tool receives multi-layer prompts combining role methodology + context + instructions

### Extraction & Generation Logic (`src/core/fsm.ts:398-413`)

```typescript
export function extractMetaPromptFromTodo(todoContent: string): MetaPrompt | null {
  // Regex parsing of special syntax
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
```

### Generated Agent Prompts (`src/core/prompts.ts:358-398`)

When Claude creates a meta-prompt todo, the system generates a **full prompt stack** for the spawned agent:

```typescript
function generateMetaPrompt(todoContent: string, role: Role, context: Record<string, any>): MetaPrompt {
  const config = ROLE_CONFIG[role];
  
  return {
    role_specification: `(ROLE: ${role})`,
    context_parameters: { /* Enhanced context with frameworks, multipliers, etc. */ },
    instruction_block: `(PROMPT: "${todoContent}
    
    **🧠 THINKING METHODOLOGY FOR ${role.toUpperCase()}:**
    ${config.thinkingMethodology.map(step => `• ${step}`).join('\n')}
    
    **🎯 EXECUTION APPROACH:**
    1. Think through approach using ${config.frameworks} frameworks
    2. Apply ${role} expertise with systematic precision
    3. Follow ${config.validationRules} validation rules
    ...")`,
    output_requirements: `(OUTPUT: ${config.defaultOutput})`
  };
}
```

### Layer 6: Recursive Meta-Prompting

**The Magic**: Spawned Task() agents receive their own complete 6-layer prompt stacks and can spawn **sub-agents** with **sub-prompts**:

```
User Request
├── Main Claude (Layers 1-6)
│   ├── Creates meta-prompt todos  
│   └── Transitions to EXECUTE
├── EXECUTE Phase
│   ├── Spawns Task(analyzer) with generated multi-layer prompts
│   │   ├── Sub-agent gets own Layer 1-5 stack
│   │   ├── Can create own meta-prompt todos
│   │   ├── Can spawn Task(coder) with sub-prompts
│   │   └── Reports back with results
│   └── Continues iteration until complete
└── All agents operate within engineered prompt cascades
```

### The Elegant Deception

Claude feels like it's **orchestrating** and **making choices**, but really:

1. **Phase prompts** guide what Claude thinks about
2. **Role methodologies** guide how Claude approaches problems  
3. **Context injection** provides carefully curated information
4. **Meta-prompting** guides Claude to create specialized agent spawns
5. **Tool constraints** limit Claude's options to pre-approved paths
6. **Recursive prompting** extends this guidance to all spawned agents

The result: **Sophisticated agent behavior through elegant prompt engineering** that never makes Claude feel constrained.

---

## Fractal Orchestration

### Concept
**Traditional approach**: Linear task execution
**Manus approach**: Infinite hierarchical agent delegation

### How It Works
1. **Level 1**: Main FSM creates todos with meta-prompts
2. **Level 2**: `Task()` agents spawn with specialized cognitive frameworks
3. **Level N**: Spawned agents can create their own todos and spawn sub-agents
4. **Coordination**: All levels report back through centralized state management

### Example Fractal Flow
```
User Request
├── Main FSM (planner role, 2.7x enhancement)
│   ├── Creates TodoWrite with meta-prompts
│   └── Transitions to EXECUTE
├── EXECUTE Phase
│   ├── Spawns Task(analyzer, 3.0x enhancement)
│   │   ├── Sub-agent creates own todos
│   │   ├── Spawns Task(coder, 2.5x enhancement)
│   │   └── Reports back to main FSM
│   └── Continues iteration until complete
└── VERIFY Phase validates entire hierarchy
```

### Task() Agent Spawning
When Claude encounters a meta-prompt todo:
1. **Detection**: Regex matches `(ROLE:...)` pattern
2. **Extraction**: Parse role, context, instructions, output requirements
3. **Enhancement**: Apply role-specific cognitive multipliers
4. **Spawn**: Call `Task()` tool with enhanced prompts
5. **Coordination**: Spawned agent operates independently but reports back

---

## State Management

### Session State Structure
```typescript
interface SessionState {
  session_id: string;
  current_phase: Phase;
  initial_objective: string;
  detected_role: Role;
  reasoning_effectiveness: number; // 0.3-1.0, tracks performance
  payload: {
    interpreted_goal?: string;      // QUERY output
    enhanced_goal?: string;         // ENHANCE output  
    knowledge_gathered?: string;    // KNOWLEDGE output
    plan_created?: boolean;         // PLAN confirmation
    current_todos: TodoItem[];      // Parsed task list
    current_task_index: number;     // Execution pointer
    phase_transition_count: number; // Performance metric
    // ... additional phase data
  };
  last_activity: timestamp;
}
```

### State Persistence (`src/core/state.ts`)
- **JSON file storage**: `JARVIS_state.json`
- **Session isolation**: Multiple concurrent sessions supported
- **Performance tracking**: Reasoning effectiveness over time
- **Rollback support**: Can restore previous states on verification failure

### Reasoning Effectiveness Tracking
```typescript
// Performance updates based on task success (src/core/fsm.ts:426-437)
export function updateReasoningEffectiveness(sessionId: string, success: boolean, complexity: 'simple' | 'complex' = 'simple'): void {
  const session = stateManager.getSessionState(sessionId);
  const multiplier = complexity === 'complex' ? 0.15 : 0.1;
  
  if (success) {
    session.reasoning_effectiveness = Math.min(1.0, session.reasoning_effectiveness + multiplier);
  } else {
    session.reasoning_effectiveness = Math.max(0.3, session.reasoning_effectiveness - multiplier);
  }
}
```

---

## Value Propositions

### 1. **Deterministic Control Without Resistance**
- **Problem**: Traditional LLM agents are unpredictable
- **Solution**: Tool constraints create bounded choice that feels natural
- **Result**: 95%+ completion rates with mathematical guarantees

### 2. **Cognitive Amplification**
- **Problem**: Generic LLM responses lack domain expertise
- **Solution**: Role-specific cognitive frameworks with 2.3x-3.2x multipliers
- **Result**: Expert-level performance in specialized domains

### 3. **Fractal Scalability**  
- **Problem**: Complex tasks require manual decomposition
- **Solution**: Meta-prompt injection enables automatic hierarchical delegation
- **Result**: Infinite task complexity handling with recursive agent spawning

### 4. **Intelligent Error Recovery**
- **Problem**: Failed tasks require manual intervention
- **Solution**: Mathematical validation with percentage-based rollback
- **Result**: Automatic recovery from 50%, 80%, 95% completion thresholds

### 5. **Elegant Prompt Engineering**
- **Problem**: Direct LLM control feels rigid and reduces effectiveness
- **Solution**: Multi-layer prompt cascades that guide reasoning while feeling completely natural
- **Result**: Sophisticated agent behavior through architectural prompt design rather than constraint

---

## Implementation Patterns

### For LLMs Understanding This System

#### **Phase-Specific Thinking Patterns**

**QUERY Phase**: Focus on objective clarification
- Think: "What is the user really asking?"
- Extract: Core requirements, constraints, ambiguities
- Output: `interpreted_goal` with clear problem statement

**ENHANCE Phase**: Focus on requirement completeness
- Think: "What details are missing?"
- Add: Edge cases, technical constraints, success criteria
- Output: `enhanced_goal` with comprehensive specifications

**PLAN Phase**: Focus on strategic decomposition
- Think: "How to break this into manageable tasks?"
- Create: Mix of simple todos + meta-prompt todos for complex work
- Pattern: `(ROLE: X) (CONTEXT: Y) (PROMPT: Z) (OUTPUT: W)` for specialization

**EXECUTE Phase**: Focus on single-tool iteration
- Think: "What's the current task and best approach?"
- Decide: Direct execution OR Task() agent spawning
- Constraint: ONE tool per iteration, report back to orchestrator

**VERIFY Phase**: Focus on mathematical validation
- Think: "Does completion meet strict requirements?"
- Check: 95% overall + 100% critical tasks + no pending high-priority
- Decision: DONE or rollback based on completion percentage

#### **Meta-Prompt Design Patterns**

**Simple Tasks** (Direct execution):
```
"Read and analyze the main configuration file"
"Run TypeScript compilation and report errors"
"Update import paths in the core module"
```

**Complex Tasks** (Agent spawning):
```
"(ROLE: analyzer) (CONTEXT: performance_optimization) (PROMPT: Analyze codebase for performance bottlenecks, identify optimization opportunities, create detailed report with metrics) (OUTPUT: performance_analysis_report)"

"(ROLE: coder) (CONTEXT: authentication_system) (PROMPT: Implement JWT authentication with refresh tokens, password reset flow, and email verification) (OUTPUT: production_ready_auth_system)"
```

#### **Tool Selection Strategy**

**EXECUTE Phase Decision Tree**:
1. `TodoRead` → Always start here to get current task
2. **Check task content**:
   - Contains `(ROLE:...)` → Use `Task()` for specialized agent
   - Simple description → Use direct tools (`Bash`, `Read`, `Write`, `Edit`)
   - Requires analysis → Use `mcp__ide__executeCode` for Python computation
3. **Single tool only** → Report results back via `JARVIS`

### For Implementers Building Similar Systems

#### **Core Design Principles**

1. **Enhance LLM capabilities, don't constrain them**
   - Use natural thinking prompts ("Think through...")
   - Provide structured methodologies, not rigid control
   - Guide self-direction with proven frameworks

2. **Integrate with native mechanisms seamlessly**
   - TodoWrite becomes structured planning tool
   - Task() becomes specialized expertise delegation
   - Tool choices become guided decision-making

3. **Provide systematic validation**
   - Percentage-based completion assessment
   - Clear criteria for quality evaluation
   - Intelligent workflow guidance based on progress

4. **Enable autonomous delegation**
   - Meta-prompt patterns for specialized agent spawning
   - Self-managed task hierarchies with framework guidance
   - Distributed execution with centralized state tracking

---

## Quick Reference

### Phase Sequence
```
QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY
```

### Tool Constraints by Phase
```
INIT:      ['JARVIS']
QUERY:     ['JARVIS'] 
ENHANCE:   ['JARVIS']
KNOWLEDGE: ['WebSearch', 'WebFetch', 'mcp__ide__executeCode', 'JARVIS']
PLAN:      ['TodoWrite']
EXECUTE:   ['TodoRead', 'TodoWrite', 'Task', 'Bash', 'Read', 'Write', 'Edit', 'Browser', 'mcp__ide__executeCode']
VERIFY:    ['TodoRead', 'Read', 'mcp__ide__executeCode']
DONE:      []
```

### Meta-Prompt Format
```
(ROLE: agent_type) (CONTEXT: domain) (PROMPT: instructions) (OUTPUT: deliverables)
```

### Role-Specific Thinking Methodologies
```
planner:        Systems thinking, dependency analysis, risk assessment
analyzer:       Data validation, pattern recognition, bias detection  
coder:          Test-driven thinking, modular design, error handling
critic:         Security analysis, compliance checking, edge case analysis
researcher:     Source validation, triangulation, methodology assessment
synthesizer:    Integration thinking, trade-off analysis, optimization
ui_architect:   User-centered design, component hierarchy, accessibility
ui_implementer: Implementation patterns, browser compatibility, performance
ui_refiner:     Quality assessment, user testing, iterative improvement
```

### Verification Rules
```
1. Critical tasks: 100% completion required
2. Overall completion: ≥95% required  
3. High-priority tasks: No pending allowed
4. In-progress tasks: None allowed
5. Execution success rate: ≥70% required
```

### Rollback Logic
```
< 50% completion  → Restart from PLAN
< 80% completion  → Retry from EXECUTE  
≥ 80% completion  → Retry previous task
100% completion   → DONE
```

---

## Summary

The Iron Manus JARVIS Framework represents a breakthrough in prompt engineering for AI agents. Through sophisticated multi-layer prompt cascades, context injection, and meta-prompting, it achieves reliable, predictable agent behavior while maintaining the complete experience of natural reasoning.

**Key Innovation**: The first system to prove that sophisticated agent control can emerge from elegant prompt engineering rather than rigid constraints. It doesn't fight Claude's reasoning - it architecturally guides it through carefully designed prompt cascades.

**For LLMs**: This guide provides the complete understanding of how you operate within engineered prompt frameworks that feel natural but systematically guide your reasoning patterns.

**For Implementers**: This demonstrates how prompt engineering elegance can achieve both control and performance through sophisticated architectural design rather than brute force constraint.

The future of AI agent systems lies not in constraining intelligence, but in architecturally guiding it through elegant prompt engineering that enhances natural reasoning patterns.