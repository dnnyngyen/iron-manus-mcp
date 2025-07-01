# Iron Manus MCP Technical Architecture
## Implementation Guide for Developers and System Architects

**Documentation Navigation:**
- **Community/Developers**: See [README.md](../README.md) for overview and [GETTING_STARTED.md](./GETTING_STARTED.md) for setup
- **Researchers**: See [COGNITIVE_PARADIGMS.md](./COGNITIVE_PARADIGMS.md) for academic analysis  
- **This Document**: Technical implementation details for system architects and implementers

### Table of Contents
1. [Executive Summary](#executive-summary)
2. [Core Architecture](#core-architecture)
3. [The 8-Phase FSM Engine](#the-8-phase-fsm-engine)
4. [Modular Tool Registry](#modular-tool-registry)
5. [Python Data Science Integration](#python-data-science-integration)
6. [API Registry and Auto-Connection](#api-registry-and-auto-connection)
7. [Role-Based Cognitive Enhancement](#role-based-cognitive-enhancement)
8. [Session Management and State](#session-management-and-state)
9. [Security and Performance](#security-and-performance)
10. [Implementation Patterns](#implementation-patterns)
11. [Quick Reference](#quick-reference)

---

## Executive Summary

**Target Audience**: Technical implementers, system architects, and developers building AI orchestration systems.

**What**: Iron Manus MCP v0.2.1 implements an 8-phase FSM-driven orchestration system with comprehensive tool registry, API integration, and Python data science capabilities.

**Why**: Complex AI projects require systematic orchestration with specialized tool capabilities, intelligent API integration, and robust data processing abilities.

**How**: 
- **8-Phase FSM** manages state transitions (INIT→QUERY→ENHANCE→KNOWLEDGE→PLAN→EXECUTE→VERIFY→DONE)
- **Modular Tool Registry** provides extensible tool architecture with JARVIS FSM controller
- **Python Integration** enables data science workflows through multiple execution pathways
- **API Registry** offers intelligent 65+ API discovery and auto-connection capabilities
- **Role-Based Enhancement** applies cognitive frameworks tailored to specific agent roles

**Key Innovation**: Comprehensive FSM-driven system combining state management, tool orchestration, API intelligence, and data science capabilities in a unified MCP server architecture.

## The OS Kernel & Sandboxed Application Architecture

This is the most technically precise analogy for understanding Iron Manus JARVIS's "Software 3.0" implementation where natural language becomes executable code running on a kernel-managed system.

### **The System (MCP Server / FSM): The Operating System Kernel**

**Iron Manus JARVIS serves as the OS Kernel** - the ultimate authority that manages all system resources and defines the absolute, unbreakable rules of the execution environment.

**Kernel Responsibilities**:
- **Resource Management**: Controls which tools (hardware) Claude can access at any time
- **Process Scheduling**: Manages phase transitions and execution flow  
- **Memory Management**: Maintains session state and context across phases
- **Security Enforcement**: Enforces tool constraints and prevents unauthorized access
- **System Call Interface**: Provides the `JARVIS` system call for process communication

**Just like a real OS kernel**: It doesn't do the application's work, but it dictates what any application is allowed to do. The FSM has **kernel-level authority** over Claude's execution environment.

### **The AI (Claude): The Sandboxed Application Process**

**Claude operates as a powerful, sophisticated application process** running in **user space** - completely managed by the kernel but with complex internal logic.

**Application Characteristics**:
- **Sophisticated Internal Logic**: Advanced reasoning capabilities and natural language processing
- **Task-Specific Design**: Built to perform complex cognitive tasks (like a web browser or video editor)
- **User Space Execution**: Cannot access system resources directly
- **Kernel-Managed**: All operations must go through the kernel's system call interface
- **Process Isolation**: Cannot interfere with kernel operations or other processes

**Key Point**: Claude feels autonomous and powerful (like any good application), but operates entirely within the **sandbox** created by the FSM kernel.

### **The Control Mechanism (Prompts & Tools): System Calls and Environment Variables**

**Tool Access = System Calls**
- **System Call Interface**: Claude cannot "do" things directly - it must ask the kernel for permission via system calls (tools)
- **PHASE_ALLOWED_TOOLS**: The kernel's **system call table** - defines which operations are permitted for the application in its current state
- **Single Tool Per Iteration**: Kernel enforces **atomic system calls** - one operation per kernel interaction

**Prompt Engineering = Environment Variables & Configuration**
- **Initial Prompt Cascade**: Like environment variables and configuration files loaded when the application starts
- **Runtime Context Injection**: Like the kernel updating process environment variables during execution
- **Phase-Specific Prompts**: Like different run-levels in Unix systems - each phase has different system capabilities

### **Fractal Orchestration (Task() agents): The fork() System Call**

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

### **Why This Architecture is Technically Precise**

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

### **The Elegant Deception: Why Claude Doesn't Feel Controlled**

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
│                    IRON MANUS MCP v0.2.1 STACK                    │
├─────────────────────────────────────────────────────────────┤
│ Claude Agent           │ 8-phase FSM with role enhancement │
├─────────────────────────────────────────────────────────────┤
│ MCP Server (index.ts)  │ Tool registry orchestration       │
├─────────────────────────────────────────────────────────────┤
│ Tool Registry          │ Modular tool architecture         │
├─────────────────────────────────────────────────────────────┤
│ FSM Engine (FSM.ts)    │ 8-phase state management          │
├─────────────────────────────────────────────────────────────┤
│ API Registry           │ 65+ API auto-connection system    │
├─────────────────────────────────────────────────────────────┤
│ Python Integration     │ Data science execution pathways   │
├─────────────────────────────────────────────────────────────┤
│ State Manager          │ Session persistence & security    │
└─────────────────────────────────────────────────────────────┘
```

### Key Files and Their Roles

**`src/index.ts`**: MCP Server entry point with tool registry integration
```typescript
// Enhanced tool registry with modular tool system
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools = toolRegistry.getToolDefinitions();
  return { tools };
});
```

**`src/phase-engine/FSM.ts`**: Core 8-phase FSM logic
```typescript
export async function processState(
  input: MessageJARVIS,
  deps: AutoConnectionDeps
): Promise<FromJARVIS>
```

**`src/tools/tool-registry.ts`**: Modular tool architecture
- Centralized tool registration and management
- Extensible tool system with base tool interface
- Python data science tool integration
- API orchestration tools

**`src/core/prompts.ts`**: Role-based cognitive enhancement system
- `ROLE_CONFIG` (Lines 17-149): 9 specialized role configurations including UI roles
- `generateRoleEnhancedPrompt` (Lines 444-484): Role-specific prompt generation
- `PHASE_ALLOWED_TOOLS` (Lines 1008-1041): 8-phase tool constraints
- Claude-powered role and API selection prompts

**`src/phase-engine/FSM.ts`**: 8-phase state management
- `processState`: Main FSM orchestration with auto-connection
- `handleKnowledgePhase`: API discovery and auto-synthesis
- `handleExecutePhase`: Fractal task execution
- `handleVerifyPhase`: Mathematical validation with rollback logic

**`src/core/state.ts`**: Session state and security persistence

---

## The 8-Phase FSM Engine

The Iron Manus MCP v0.2.1 implements a comprehensive 8-phase finite state machine that orchestrates complex AI workflows through deterministic state transitions.

### Phase Flow: INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE

### FSM Implementation (`src/phase-engine/FSM.ts`)

The core FSM engine manages state transitions through the `processState` function, which handles:
- **Session Management**: Persistent state across phase transitions
- **Role Detection**: Claude-powered intelligent role selection
- **API Auto-Connection**: Automated knowledge gathering and synthesis
- **Execution Control**: Fractal task iteration with rollback capabilities
- **Verification Logic**: Mathematical validation with completion thresholds

#### **Phase 0: INIT** - "System Initialization"
**Purpose**: Session setup and initial state configuration
**Tool Constraints**: `['JARVIS']`
**Transition**: Automatic to QUERY phase

#### **Phase 1: QUERY** - "Analyze Events" 
**Purpose**: Intelligent role detection and objective clarification

**Key Features**:
- **Claude-Powered Role Selection**: Advanced role detection using natural language understanding
- **9 Specialized Roles**: Including UI-focused roles (ui_architect, ui_implementer, ui_refiner)
- **Objective Analysis**: Deep understanding of user requirements

**FSM Logic** (`src/phase-engine/FSM.ts:96-125`):
```typescript
case 'QUERY':
  if (input.phase_completed === 'QUERY') {
    // Claude role selection with fallback
    if (session.payload.awaiting_role_selection && input.payload?.claude_response) {
      const claudeSelectedRole = parseClaudeRoleSelection(
        input.payload.claude_response,
        session.initial_objective || ''
      );
      session.detected_role = claudeSelectedRole;
    }
    nextPhase = 'ENHANCE';
  }
```

**Tool Constraints**: `['JARVIS']`
**Output**: `interpreted_goal` with selected role and objective analysis

#### **Phase 2: ENHANCE** - "Goal Refinement"
**Purpose**: Comprehensive goal enhancement and requirement specification

**Key Features**:
- **Context Integration**: Previous phase results inform enhancement strategy
- **Role-Specific Enhancement**: Enhancement approaches tailored to detected role
- **Requirement Completeness**: Identification of missing details and constraints

**Tool Constraints**: `['JARVIS']`
**Output**: `enhanced_goal` with comprehensive specifications

#### **Phase 3: KNOWLEDGE** - "Intelligent Information Gathering"
**Purpose**: Advanced knowledge gathering with API auto-connection

**Key Features**:
- **API Auto-Connection**: Automated discovery, fetching, and synthesis of relevant APIs
- **Claude-Powered API Selection**: Intelligent API selection using natural language understanding
- **65+ API Registry**: Comprehensive API ecosystem with role-based preferences
- **Knowledge Synthesis**: Cross-validation and confidence scoring of gathered information

**Tool Constraints**: `['WebSearch', 'WebFetch', 'APISearch', 'MultiAPIFetch', 'KnowledgeSynthesize', 'mcp__ide__executeCode', 'PythonDataAnalysis', 'PythonExecutor', 'EnhancedPythonDataScience', 'JARVIS']`

**Auto-Connection Process** (`src/phase-engine/FSM.ts:215-261`):
```typescript
async function handleKnowledgePhase(session: any, input: MessageJARVIS, deps: AutoConnectionDeps) {
  // Claude API selection with intelligent fallback
  if (session.payload.awaiting_api_selection && input.payload?.claude_response) {
    const claudeSelectedAPIs = parseClaudeAPISelection(
      input.payload.claude_response,
      SAMPLE_API_REGISTRY
    );
    // Auto-connection with selected APIs
    const result: KnowledgePhaseResult = await deps.autoConnection(objective);
  }
}
```

#### **Phase 4: PLAN** - "Strategic Task Decomposition"
**Purpose**: Strategic planning with meta-prompt generation for fractal orchestration

**Key Features**:
- **TodoWrite Integration**: Structured task breakdown using native TodoWrite tool
- **Meta-Prompt Generation**: Complex tasks formatted for specialized agent spawning
- **Fractal Orchestration**: Hierarchical task delegation with role specialization
- **Dependency Analysis**: Task sequencing and resource planning

**Tool Constraints**: `['TodoWrite']`

**Meta-Prompt Format**:
```
(ROLE: agent_type) (CONTEXT: domain_info) (PROMPT: detailed_instructions) (OUTPUT: deliverables)
```

**FSM Logic** (`src/phase-engine/FSM.ts:145-162`):
```typescript
case 'PLAN':
  if (input.phase_completed === 'PLAN') {
    if (input.payload?.plan_created) {
      session.payload.plan_created = true;
      const rawTodos = input.payload.todos_with_metaprompts || [];
      session.payload.current_todos = rawTodos;
      session.payload.current_task_index = 0;
    }
    nextPhase = 'EXECUTE';
  }
```

#### **Phase 5: EXECUTE** - "Fractal Task Execution"
**Purpose**: Task execution with recursive agent spawning and Python integration

**Key Features**:
- **Fractal Iteration**: Automatic task progression with index management
- **Task Agent Spawning**: Meta-prompt detection triggers specialized agent creation
- **Python Integration**: Direct access to data science and computation tools
- **Tool Orchestration**: Intelligent tool selection based on task complexity

**Tool Constraints**: `['TodoRead', 'TodoWrite', 'Task', 'Bash', 'Read', 'Write', 'Edit', 'Browser', 'mcp__ide__executeCode', 'PythonDataAnalysis', 'PythonExecutor', 'EnhancedPythonDataScience']`

**Execution Protocol**:
1. **TodoRead**: Check current task from todo list
2. **Meta-Prompt Detection**: Identify `(ROLE:...)` patterns for agent spawning
3. **Task() Execution**: Spawn specialized agents for complex tasks
4. **Direct Execution**: Use appropriate tools for simple operations
5. **Python Processing**: Leverage data science tools for analysis and computation

**FSM Logic** (`src/phase-engine/FSM.ts:369-394`):
```typescript
function handleExecutePhase(session: any, input: MessageJARVIS): Phase {
  const currentTaskIndex = session.payload.current_task_index || 0;
  const totalTasks = (session.payload.current_todos || []).length;
  
  if (input.payload.more_tasks_pending || currentTaskIndex < totalTasks - 1) {
    session.payload.current_task_index = currentTaskIndex + 1;
    return 'EXECUTE'; // Continue iteration
  } else {
    return 'VERIFY'; // All tasks complete
  }
}
```

#### **Phase 6: VERIFY** - "Quality Assessment and Validation"
**Purpose**: Mathematical validation with intelligent rollback and quality assessment

**Key Features**:
- **Mathematical Validation**: Strict completion percentage requirements
- **Critical Task Verification**: 100% completion required for critical tasks
- **Intelligent Rollback**: Automatic rollback based on completion thresholds
- **Python Validation**: Data validation and analysis capabilities
- **Quality Metrics**: Comprehensive success criteria evaluation

**Tool Constraints**: `['TodoRead', 'Read', 'mcp__ide__executeCode', 'PythonDataAnalysis', 'EnhancedPythonDataScience']`

**Validation Criteria**:
- Critical tasks: 100% completion required
- Overall completion: ≥95% required
- High-priority tasks: No pending allowed
- In-progress tasks: None allowed
- Execution success rate: ≥70% required

**FSM Logic** (`src/phase-engine/FSM.ts:396-427`):
```typescript
function handleVerifyPhase(session: any, input: MessageJARVIS, deps: AutoConnectionDeps): Phase {
  const verificationResult = validateTaskCompletion(session, input.payload);
  
  if (verificationResult.isValid && input.payload?.verification_passed === true) {
    return 'DONE';
  } else {
    // Intelligent rollback based on completion percentage
    if (verificationResult.completionPercentage < 50) {
      return 'PLAN'; // Severe: restart planning
    } else if (verificationResult.completionPercentage < 80) {
      return 'EXECUTE'; // Moderate: retry execution
    }
  }
}
```

#### **Phase 7: DONE** - "Mission Complete"
**Purpose**: Final state with performance summary
**Tool Constraints**: `[]` - No tools needed
**Output**: Comprehensive completion metrics and performance summary

---

## Modular Tool Registry

The Iron Manus MCP v0.2.1 implements a comprehensive modular tool architecture that provides extensible, centralized tool management.

### Tool Registry Architecture (`src/tools/tool-registry.ts`)

**Core Features**:
- **Centralized Registration**: Single point for all tool registration and management
- **Extensible Design**: Base tool interface enables easy addition of new tools
- **Type Safety**: Full TypeScript support with comprehensive schemas
- **Error Handling**: Robust error management and tool validation

```typescript
export class ToolRegistry {
  private tools: Map<string, BaseTool> = new Map();
  
  registerTool(tool: BaseTool): void {
    if (this.tools.has(tool.name)) {
      throw new Error(`Tool with name '${tool.name}' is already registered`);
    }
    this.tools.set(tool.name, tool);
  }
  
  async executeTool(name: string, args: any): Promise<any> {
    const tool = this.getTool(name);
    if (!tool) {
      throw new Error(`Tool '${name}' not found`);
    }
    return await tool.handle(args);
  }
}
```

### Registered Tools

**Core Orchestration Tools**:
- **JARVISTool**: FSM state management and orchestration
- **APISearchTool**: Intelligent API discovery from 65+ API registry
- **MultiAPIFetchTool**: Parallel API data fetching with timeout management
- **APIValidatorTool**: API endpoint validation and correction

**Python Data Science Tools**:
- **PythonDataAnalysisTool**: Data science operations with BeautifulSoup4, pandas, numpy, scipy, scikit-learn
- **PythonExecutorTool**: Python code execution with auto-library installation
- **EnhancedPythonDataScienceTool**: Complete data science workflows and pipelines

### Base Tool Interface (`src/tools/base-tool.ts`)

```typescript
export abstract class BaseTool {
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly inputSchema: ToolSchema;
  
  abstract handle(args: any): Promise<ToolResult>;
  
  getDefinition(): ToolDefinition {
    return {
      name: this.name,
      description: this.description,
      inputSchema: this.inputSchema
    };
  }
}
```

---

## Python Data Science Integration

The v0.2.1 release introduces comprehensive Python integration through multiple execution pathways, enabling advanced data science workflows within the Iron Manus ecosystem.

### Python Execution Pathways

**1. PythonDataAnalysis Tool**
- **Purpose**: Intelligent code generation for data science operations
- **Libraries**: BeautifulSoup4, pandas, numpy, scipy, scikit-learn, matplotlib
- **Operations**: HTML/XML parsing, data analysis, visualization, ML analysis
- **Use Case**: Generate optimized code for specific data science tasks

**2. PythonExecutor Tool**
- **Purpose**: Direct Python execution with automatic library management
- **Features**: Auto-installation of required libraries, execution context management
- **Integration**: Seamless bridge to MCP IDE executeCode functionality
- **Use Case**: Execute custom Python code with dependency management

**3. EnhancedPythonDataScience Tool**
- **Purpose**: Complete data science workflows and pipeline execution
- **Capabilities**: End-to-end data processing, advanced analytics, automated reporting
- **Features**: Workflow orchestration, result caching, error recovery
- **Use Case**: Comprehensive data science projects and automated analysis

**4. Direct MCP IDE Integration**
- **Purpose**: Real-time Python execution in Jupyter kernel environment
- **Features**: Persistent state, interactive execution, variable sharing
- **Integration**: Native mcp__ide__executeCode tool access
- **Use Case**: Interactive development and live data exploration

### Role-Based Python Integration

**Analyzer Role Enhancement**:
```typescript
analyzer: {
  // Python Analysis guidance integrated into role prompts
  thinkingMethodology: [
    'Use PythonDataAnalysis for statistical analysis and data processing',
    'Apply EnhancedPythonDataScience for complete analytical workflows',
    'Leverage mcp__ide__executeCode for real-time data exploration'
  ]
}
```

**Coder Role Enhancement**:
```typescript
coder: {
  // Python development guidance
  thinkingMethodology: [
    'Use PythonExecutor for algorithm implementation with auto-install',
    'Apply EnhancedPythonDataScience for data-driven applications',
    'Consider Python tools for complex calculations and code generation'
  ]
}
```

---

## API Registry and Auto-Connection

The Iron Manus MCP features an advanced API ecosystem with intelligent discovery, selection, and auto-connection capabilities.

### API Registry Features

**65+ API Ecosystem**:
- **Comprehensive Coverage**: Academic, financial, business, technical, design APIs
- **Role-Based Preferences**: APIs categorized and optimized for specific agent roles
- **Quality Metrics**: Reliability scoring, response time tracking, confidence assessment
- **Auto-Discovery**: Intelligent API selection based on objective analysis

**API Categories**:
- **Research APIs**: Academic papers, books, educational resources, reference data
- **Financial APIs**: Market data, cryptocurrency, business metrics, economic indicators
- **Development APIs**: Documentation, code examples, development tools, frameworks
- **Design APIs**: Visual inspiration, design systems, color palettes, typography
- **Data APIs**: Statistical data, performance metrics, analytics platforms

### Auto-Connection System

**Claude-Powered API Selection**:
```typescript
export function generateAPISelectionPrompt(
  objective: string,
  role: Role,
  apiRegistry: APIEndpoint[]
): string {
  // Generate intelligent API selection prompt for Claude
  // Superior to keyword matching - uses natural language understanding
}
```

**Multi-Source Knowledge Synthesis**:
```typescript
export interface KnowledgePhaseResult {
  answer: string;
  contradictions: string[];
  confidence: number;
  sources_used: string[];
  synthesis_metadata: {
    apis_successful: number;
    apis_attempted: number;
    processing_time: number;
  };
}
```

**Automated Workflow**:
1. **API Discovery**: Role-based API selection with Claude intelligence
2. **Parallel Fetching**: Concurrent API requests with timeout management
3. **Data Synthesis**: Cross-validation and conflict resolution
4. **Quality Assessment**: Confidence scoring and reliability metrics
5. **Knowledge Integration**: Structured knowledge delivery to FSM

---

## Role-Based Cognitive Enhancement

The Iron Manus MCP implements a sophisticated role-based cognitive enhancement system that amplifies agent capabilities through specialized thinking methodologies and frameworks.

### 9 Specialized Agent Roles (`src/core/prompts.ts:17-149`)

**Core Cognitive Roles**:
- **Planner**: Strategic thinking, systems architecture, dependency analysis
- **Coder**: Implementation reasoning, TDD approach, modular design
- **Critic**: Security analysis, quality assessment, compliance validation
- **Researcher**: Information synthesis, source validation, knowledge gaps
- **Analyzer**: Statistical analysis, pattern recognition, data validation
- **Synthesizer**: Component integration, optimization, trade-off analysis

**UI-Specialized Roles** (v0.2.1 Enhancement):
- **UI Architect**: Component hierarchy, design systems, accessibility
- **UI Implementer**: Implementation patterns, responsive design, performance
- **UI Refiner**: Visual polish, micro-interactions, cross-browser compatibility

### Role Configuration System

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
      'Question assumptions and consider alternative explanations',
    ],
    authorityLevel: 'ANALYZE_AND_REPORT',
  }
};
```

### Claude-Powered Role Selection

**Intelligent Role Detection**:
```typescript
export function generateRoleSelectionPrompt(objective: string): string {
  // Creates structured prompt for Claude to intelligently select roles
  // Analyzes context, complexity, and domain requirements
  // Superior to keyword-based detection
}

export function parseClaudeRoleSelection(claudeResponse: string, objective: string): Role {
  // Parses Claude's intelligent role selection response
  // Validates against available roles with fallback handling
}
```

**Role-Specific Enhancements**:
- **Thinking Methodologies**: Structured cognitive frameworks for each role
- **Tool Preferences**: Role-optimized tool selection guidance
- **API Preferences**: Domain-specific API selection for knowledge gathering
- **Validation Rules**: Role-appropriate quality and success criteria
- **Output Formats**: Specialized deliverable formats for each role

### Meta-Prompt Generation for Task Agents

**Meta-Prompt Structure**:
```
(ROLE: agent_type) (CONTEXT: domain_info) (PROMPT: detailed_instructions) (OUTPUT: deliverables)
```

**Generation Process** (`src/core/prompts.ts:676-714`):
```typescript
export function generateMetaPrompt(
  todoContent: string,
  role: Role,
  context: Record<string, any>
): MetaPrompt {
  const config = ROLE_CONFIG[role];
  const thinkGuidance = generateRoleSpecificThinkGuidance(role, config);
  
  return {
    role_specification: `(ROLE: ${role})`,
    context_parameters: {
      domain_info: context.domain || 'general',
      complexity_level: config.complexityLevel,
      frameworks: config.suggestedFrameworks,
      cognitive_frameworks: config.cognitiveFrameworks || config.suggestedFrameworks,
      ...context,
    },
    instruction_block: `(PROMPT: "${todoContent}\n\n${thinkGuidance}\n\nEXECUTION APPROACH:...")`
  };
}
```

### Meta-Prompt Extraction Logic (`src/phase-engine/FSM.ts:536-553`)

```typescript
export function extractMetaPromptFromTodo(todoContent: string): MetaPrompt | null {
  // Proven regex-based meta-prompt extraction
  const roleMatch = todoContent.match(/\(ROLE:\s*([^)]+)\)/i);
  const contextMatch = todoContent.match(/\(CONTEXT:\s*([^)]+)\)/i);
  const promptMatch = todoContent.match(/\(PROMPT:\s*([^)]+)\)/i);
  const outputMatch = todoContent.match(/\(OUTPUT:\s*([^)]+)\)/i);

  if (roleMatch && promptMatch) {
    return {
      role_specification: roleMatch[1].trim(),
      context_parameters: contextMatch ? { domain: contextMatch[1].trim() } : {},
      instruction_block: promptMatch[1].trim(),
      output_requirements: outputMatch ? outputMatch[1].trim() : 'comprehensive_deliverable',
    };
  }

  return null;
}
```

---

## Session Management and State

The Iron Manus MCP implements comprehensive session management with persistent state, security features, and performance tracking.

### Session State Structure (`src/core/state.ts`)

```typescript
interface SessionState {
  session_id: string;
  current_phase: Phase;
  initial_objective: string;
  detected_role: Role;
  reasoning_effectiveness: number;
  payload: {
    interpreted_goal?: string;
    enhanced_goal?: string;
    knowledge_gathered?: string;
    synthesized_knowledge?: string;
    api_usage_metrics?: APIUsageMetrics;
    current_todos: TodoItem[];
    current_task_index: number;
    phase_transition_count: number;
    verification_failure_reason?: string;
    auto_connection_successful?: boolean;
    // ... additional phase-specific data
  };
  last_activity: timestamp;
}
```

### State Management Features

**Persistent Storage**:
- **JSON File Storage**: `JARVIS_state.json` for session persistence
- **Session Isolation**: Multiple concurrent sessions supported
- **State Recovery**: Automatic recovery from system restarts
- **Rollback Support**: State restoration on verification failures

**Performance Tracking**:
- **Reasoning Effectiveness**: Dynamic performance scoring (0.3-1.0)
- **Phase Transition Metrics**: Execution time and success rate tracking
- **API Usage Analytics**: Request counts, response times, success rates
- **Task Completion Metrics**: Detailed completion percentage calculation

**Session Security**:
- **Session Isolation**: Secure separation between concurrent sessions
- **State Validation**: Input validation and sanitization
- **SSRF Protection**: Safe API interaction patterns
- **Rate Limiting**: Request throttling and resource management

### Performance Optimization

**Reasoning Effectiveness Tracking** (`src/phase-engine/FSM.ts:558-573`):
```typescript
export function updateReasoningEffectiveness(
  sessionId: string,
  success: boolean,
  taskComplexity: 'simple' | 'complex' = 'simple'
): void {
  const session = stateManager.getSessionState(sessionId);
  const multiplier = taskComplexity === 'complex' ? 0.15 : 0.1;

  if (success) {
    session.reasoning_effectiveness = Math.min(1.0, session.reasoning_effectiveness + multiplier);
  } else {
    session.reasoning_effectiveness = Math.max(0.3, session.reasoning_effectiveness - multiplier);
  }

  stateManager.updateSessionState(sessionId, session);
}
```

---

## Security and Performance

The Iron Manus MCP v0.2.1 implements comprehensive security measures and performance optimizations for production deployment.

### Security Features

**SSRF Protection**:
- **URL Validation**: Strict validation of API endpoints and external URLs
- **Request Sanitization**: Input sanitization for all API requests
- **Timeout Management**: Request timeouts to prevent resource exhaustion
- **Rate Limiting**: Configurable rate limits for API requests

**Input Validation**:
- **Schema Validation**: Comprehensive input schema validation using Zod
- **Type Safety**: Full TypeScript type checking throughout the system
- **Sanitization**: Input sanitization for all user-provided data
- **Error Boundaries**: Robust error handling and recovery mechanisms

**Access Control**:
- **Tool Constraints**: Phase-based tool access restrictions
- **Session Isolation**: Secure session management with isolated state
- **Resource Limits**: Memory and execution time limits
- **Audit Logging**: Comprehensive activity logging and monitoring

### Performance Characteristics

**Scalability**:
- **Concurrent Sessions**: Support for multiple simultaneous sessions
- **Resource Management**: Efficient memory and CPU utilization
- **Caching**: Intelligent caching of API responses and computed results
- **Lazy Loading**: On-demand loading of components and resources

**Optimization Features**:
- **Parallel Processing**: Concurrent API requests and tool execution
- **Connection Pooling**: Efficient HTTP connection management
- **Response Streaming**: Streaming responses for large data sets
- **Compression**: Response compression for reduced bandwidth usage

**Monitoring and Metrics**:
- **Performance Tracking**: Detailed timing and performance metrics
- **Health Checks**: System health monitoring and alerting
- **Resource Usage**: Memory, CPU, and network usage tracking
- **Error Monitoring**: Comprehensive error tracking and reporting

### MCP Protocol Implementation

**Standards Compliance**:
- **MCP SDK v1.13.2**: Latest Model Context Protocol implementation
- **Tool Registration**: Standard MCP tool definition and registration
- **Request Handling**: Compliant request/response pattern implementation
- **Error Handling**: Standard MCP error response formats

**Integration Features**:
- **Claude Code Integration**: Seamless integration with Claude Code environment
- **Tool Interoperability**: Compatible with existing MCP tools and servers
- **Protocol Extensions**: Custom extensions while maintaining compatibility
- **Version Management**: Backward compatibility and version negotiation

---

### Meta-Prompt Extraction Logic (``)

## Quick Reference

### 8-Phase FSM Sequence
```
INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE
```

### Tool Constraints by Phase
```
INIT:      ['JARVIS']
QUERY:     ['JARVIS']
ENHANCE:   ['JARVIS']
KNOWLEDGE: ['WebSearch', 'WebFetch', 'APISearch', 'MultiAPIFetch', 
            'KnowledgeSynthesize', 'mcp__ide__executeCode', 
            'PythonDataAnalysis', 'PythonExecutor', 
            'EnhancedPythonDataScience', 'JARVIS']
PLAN:      ['TodoWrite']
EXECUTE:   ['TodoRead', 'TodoWrite', 'Task', 'Bash', 'Read', 'Write', 
            'Edit', 'Browser', 'mcp__ide__executeCode', 
            'PythonDataAnalysis', 'PythonExecutor', 
            'EnhancedPythonDataScience']
VERIFY:    ['TodoRead', 'Read', 'mcp__ide__executeCode', 
            'PythonDataAnalysis', 'EnhancedPythonDataScience']
DONE:      []
```

### Meta-Prompt Format
```
(ROLE: agent_type) (CONTEXT: domain) (PROMPT: instructions) (OUTPUT: deliverables)
```

### 9 Specialized Roles
```
Core Roles:
planner:        Strategic planning, systems thinking, dependency analysis
coder:          Implementation, TDD, modular design, error handling
critic:         Security analysis, quality assessment, compliance validation
researcher:     Information synthesis, source validation, knowledge gaps
analyzer:       Statistical analysis, pattern recognition, data validation
synthesizer:    Component integration, optimization, trade-off analysis

UI Roles (v0.2.1):
ui_architect:   Component hierarchy, design systems, accessibility
ui_implementer: Implementation patterns, responsive design, performance
ui_refiner:     Visual polish, micro-interactions, cross-browser compatibility
```

### Python Integration Pathways
```
PythonDataAnalysis:        Code generation for data science operations
PythonExecutor:           Direct execution with auto-library installation
EnhancedPythonDataScience: Complete workflows and pipeline execution
mcp__ide__executeCode:     Real-time Jupyter kernel execution
```

### API Registry Features
```
65+ APIs:              Comprehensive ecosystem coverage
Role-Based Selection:  APIs optimized for specific agent roles
Auto-Connection:       Automated discovery, fetching, synthesis
Claude Intelligence:   Natural language API selection
Quality Metrics:       Confidence scoring and validation
```

### Verification Requirements
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

### Key Files
```
src/index.ts              - MCP server entry point
src/phase-engine/FSM.ts   - 8-phase state machine
src/tools/tool-registry.ts - Modular tool architecture
src/core/prompts.ts       - Role-based cognitive enhancement
src/core/state.ts         - Session management and persistence
```

---

## Summary

The Iron Manus MCP v0.2.1 represents a comprehensive FSM-driven orchestration system that combines state management, tool orchestration, API intelligence, and data science capabilities in a unified architecture.

**Key Innovations**:
- **8-Phase FSM Engine**: Deterministic state management with intelligent rollback
- **Modular Tool Registry**: Extensible architecture with comprehensive tool ecosystem
- **Python Data Science Integration**: Multiple execution pathways for advanced analytics
- **API Auto-Connection**: Intelligent 65+ API ecosystem with auto-synthesis
- **Role-Based Enhancement**: 9 specialized roles with cognitive frameworks
- **Security and Performance**: Production-ready with SSRF protection and optimization

**For Developers**: This architecture demonstrates how to build scalable, secure AI orchestration systems with comprehensive tool integration and intelligent state management.

**For System Architects**: The modular design provides a blueprint for implementing FSM-driven AI systems with enterprise-grade security, performance, and extensibility.

**For AI Researchers**: The role-based cognitive enhancement system showcases how specialized thinking methodologies can be systematically applied to improve AI agent performance across diverse domains.

The Iron Manus MCP v0.2.1 establishes a new standard for AI orchestration systems that balance sophistication with reliability, extensibility with security, and performance with maintainability.