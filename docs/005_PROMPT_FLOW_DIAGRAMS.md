# Manus FSM Prompt Engineering Flow Diagrams
## Visual Architecture of Software 3.0 Natural Language Programming

---

## File Tree: Prompt Engineering Architecture

```
manus-fleur-mcp/
├── src/
│   ├── core/
│   │   ├── prompts.ts              ⚡ Software 3.0 Core Engine
│   │   │   ├── BASE_PHASE_PROMPTS           [Layer 1: Phase Programming]
│   │   │   ├── ROLE_CONFIG                  [Layer 2: Cognitive Algorithms]
│   │   │   ├── generateRoleEnhancedPrompt() [Layer Integration Engine]
│   │   │   ├── generateMetaPrompt()         [Layer 4: Program Generation]
│   │   │   ├── PHASE_ALLOWED_TOOLS          [Layer 5: API Constraints]
│   │   │   └── PHASE_TOOL_GUIDANCE          [Layer 5: Interface Design]
│   │   │
│   │   ├── fsm.ts                  🔄 Prompt Cascade Orchestrator
│   │   │   ├── processManusFSM()            [Layer 3: Context Injection]
│   │   │   ├── extractMetaPromptFromTodo()  [DSL Parser]
│   │   │   ├── generateRoleEnhancedPrompt() [Prompt Compiler]
│   │   │   └── augmentedPrompt +=           [Runtime Concatenation]
│   │   │
│   │   ├── types.ts                📝 Natural Language Type System
│   │   │   ├── MetaPrompt Interface         [DSL Type Definition]
│   │   │   ├── RoleConfig Interface         [Cognitive Type Schema]
│   │   │   └── Phase Type Union             [Workflow State Types]
│   │   │
│   │   └── state.ts                💾 Prompt Context Persistence
│   │       ├── SessionState                 [Prompt State Management]
│   │       └── reasoning_effectiveness      [NL Program Performance]
│   │
│   └── agents/
│       └── ui-agent-roles.ts       🎨 Specialized NL Programming
│           ├── UI_ROLE_CONFIG              [UI Domain-Specific Language]
│           ├── generateUIRoleEnhancedPrompt() [UI Prompt Compilation]
│           └── generateUIMetaPrompt()      [UI Program Generation]
│
├── 📚 Documentation/
│   ├── 001_ARCHITECTURE_GUIDE.md          [System Architecture]
│   ├── PROMPT_ARCHITECTURE.md             [Software 3.0 Deep Dive]
│   └── PROMPT_FLOW_DIAGRAMS.md           [Visual Prompt Engineering]
│
└── 🧠 Generated Prompts (Runtime)/
    ├── Layer1_PhasePrompts/               [Workflow Logic]
    ├── Layer2_RoleMethodologies/          [Cognitive Algorithms]
    ├── Layer3_DynamicContext/             [Runtime State]
    ├── Layer4_MetaPrompts/                [Generated Programs]
    ├── Layer5_ToolConstraints/            [API Interfaces]
    └── Layer6_RecursiveAgents/            [Spawned Sub-Programs]
```

---

## The 6-Layer Prompt Engineering Stack

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           SOFTWARE 3.0 PROMPT STACK                            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│ Layer 6: RECURSIVE META-PROMPTING                                               │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ Task(analyzer) spawns Task(coder) spawns Task(tester) ...                   │ │
│ │ Each agent gets full Layer 1-5 stack with specialized context               │ │
│ │ Infinite depth natural language program generation                          │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Layer 5: TOOL CONSTRAINT GUIDANCE                                               │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ EXECUTE: ['TodoRead', 'Task', 'Bash', 'Read', 'Write']                      │ │
│ │ "Think through execution approach, then choose: TodoRead (check todos)..."  │ │
│ │ API design as natural language conversation                                 │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Layer 4: META-PROMPT GENERATION                                                │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ (ROLE: analyzer) (CONTEXT: codebase) (PROMPT: evaluate) (OUTPUT: report)   │ │
│ │ ↓ COMPILES TO ↓                                                            │ │
│ │ Full Layer 1-5 stack with analyzer-specific cognitive enhancements         │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Layer 3: DYNAMIC CONTEXT INJECTION                                             │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ **📊 EXECUTION CONTEXT:**                                                  │ │
│ │ - Current Task Index: 2/5                                                  │ │
│ │ - Reasoning Effectiveness: 87.3%                                           │ │
│ │ - Previous Failure: "Type errors in analysis module"                       │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Layer 2: ROLE-SPECIFIC THINKING METHODOLOGIES                                  │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ **🧠 THINKING METHODOLOGY FOR ANALYZER:**                                  │ │
│ │ • Validate data quality, completeness, and accuracy                        │ │
│ │ • Look for patterns, trends, anomalies, and correlations                   │ │
│ │ • Consider statistical significance and avoid false conclusions             │ │
│ │ • Question assumptions and consider alternative explanations                │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Layer 1: BASE PHASE PROMPTS                                                    │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ "You are in the EXECUTE phase. Think through your execution strategy       │ │
│ │ before taking action. Analyze: What is the current task complexity..."      │ │
│ │ [Workflow programming in natural language]                                 │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘

                                    ⬇️ COMPILES TO ⬇️

┌─────────────────────────────────────────────────────────────────────────────────┐
│                        EXECUTED NATURAL LANGUAGE PROGRAM                       │
│                                                                                 │
│ You are in the EXECUTE phase. Think through your execution strategy before     │
│ taking action. Analyze: What is the current task complexity and scope?         │
│                                                                                 │
│ **🧠 THINKING METHODOLOGY FOR ANALYZER:**                                      │
│ • Validate data quality, completeness, and accuracy                            │
│ • Look for patterns, trends, anomalies, and correlations                       │
│                                                                                 │
│ **📊 EXECUTION CONTEXT:**                                                      │
│ - Current Task Index: 2/5                                                      │
│ - Current Task: (ROLE: analyzer) (CONTEXT: codebase) (PROMPT: evaluate)...     │
│                                                                                 │
│ **🛠️ TOOL GUIDANCE:** Think through execution approach, then choose:           │
│ TodoRead (check todos), Task (spawn agent), Bash/Browser (direct execution)    │
│                                                                                 │
│ Since current task contains (ROLE:...) pattern, spawn Task() agent with        │
│ generated analyzer-specific prompt stack...                                    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Prompt Cascade Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    MANUS FSM PROMPT CASCADE ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────────────────────────┘

User Request: "Analyze this codebase for quality issues"
         │
         ▼
┌─────────────────┐       ┌──────────────────────────────────────────────────────┐
│  Initial Input  │──────►│            PROMPT COMPILATION PIPELINE              │
│                 │       │                                                      │
│ "Analyze this   │       │ 1. detectRole("analyze") → analyzer                 │
│ codebase for    │       │ 2. phase = QUERY → BASE_PHASE_PROMPTS[QUERY]        │
│ quality issues" │       │ 3. generateRoleEnhancedPrompt(QUERY, analyzer, ...) │
└─────────────────┘       │ 4. Layer 1 + Layer 2 + Layer 5 concatenation       │
         │                 └──────────────────────────────────────────────────────┘
         │                                       │
         ▼                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           COMPILED PROMPT PROGRAM                              │
│                                                                                 │
│ You are in the QUERY phase (Manus: "Analyze Events"). Your task:               │
│                                                                                 │
│ Think through your analysis approach before proceeding. Consider:               │
│ - What is the user really asking for at its core?                              │
│ - What are the key requirements and constraints?                                │
│                                                                                 │
│ **🧠 THINKING METHODOLOGY FOR ANALYZER:**                                      │
│ • Validate data quality, completeness, and accuracy                            │
│ • Look for patterns, trends, anomalies, and correlations                       │
│ • Consider statistical significance and avoid false conclusions                 │
│                                                                                 │
│ **🛠️ TOOL GUIDANCE:** Think through goal analysis, then call                   │
│ manus_orchestrator with phase_completed: "QUERY"                               │
└─────────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐       ┌──────────────────────────────────────────────────────┐
│ Claude Executes │──────►│              LAYER 3: CONTEXT INJECTION             │
│ Natural Language│       │                                                      │
│ Program         │       │ if (nextPhase === 'ENHANCE') {                      │
│                 │       │   augmentedPrompt += `CONTEXT: ${interpreted_goal}` │
│ Calls:          │       │ }                                                    │
│ manus_orchestr  │       │ if (nextPhase === 'EXECUTE') {                      │
│ ator(QUERY)     │       │   augmentedPrompt += `Current Task: ${currentTodo}` │
└─────────────────┘       │ }                                                    │
         │                 └──────────────────────────────────────────────────────┘
         │                                       │
         ▼                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    PHASE TRANSITION WITH ENHANCED CONTEXT                      │
│                                                                                 │
│ You are in the PLAN phase (Manus Planner Module). Your task:                   │
│                                                                                 │
│ **📋 CONTEXT:** User wants comprehensive codebase quality analysis with        │
│ focus on maintainability, performance, and security issues                     │
│                                                                                 │
│ **🧠 THINKING METHODOLOGY FOR ANALYZER:**                                      │
│ • Validate data quality, completeness, and accuracy                            │
│ • Look for patterns, trends, anomalies, and correlations                       │
│                                                                                 │
│ **🔄 FRACTAL ORCHESTRATION GUIDE:**                                            │
│ For complex sub-tasks that need specialized expertise, create todos with:       │
│ "(ROLE: coder) (CONTEXT: auth_system) (PROMPT: JWT auth) (OUTPUT: code)"       │
└─────────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐       ┌──────────────────────────────────────────────────────┐
│ Claude Creates  │──────►│           LAYER 4: META-PROMPT GENERATION           │
│ Meta-Prompt     │       │                                                      │
│ Todos:          │       │ extractMetaPromptFromTodo() parses:                  │
│                 │       │ "(ROLE: analyzer) (CONTEXT: typescript_files)       │
│ "(ROLE: analyzer│       │  (PROMPT: Examine code quality) (OUTPUT: report)"   │
│ (CONTEXT: ts... │       │                                                      │
│ (PROMPT: Exam...│       │ generateMetaPrompt() compiles full stack:           │
│ (OUTPUT: report)│       │ Layer 1-5 with analyzer specialization              │
└─────────────────┘       └──────────────────────────────────────────────────────┘
         │                                       │
         ▼                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        LAYER 6: RECURSIVE AGENT SPAWNING                      │
│                                                                                 │
│ Task(analyzer) receives generated prompt:                                      │
│                                                                                 │
│ You are a specialized (ROLE: analyzer) agent.                                  │
│                                                                                 │
│ **🧠 THINKING METHODOLOGY FOR ANALYZER:**                                      │
│ • Validate data quality, completeness, and accuracy                            │
│ • Look for patterns, trends, anomalies, and correlations                       │
│ [Full Layer 1-5 stack with analyzer context]                                   │
│                                                                                 │
│ Your specific task: Examine TypeScript files for code quality issues,          │
│ identify maintainability problems, performance bottlenecks, and security       │
│ vulnerabilities. Generate comprehensive technical report.                       │
│                                                                                 │
│ Generate additional sub-programs if needed using meta-prompt syntax.           │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Meta-Prompt DSL Processing Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        META-PROMPT DSL COMPILATION                             │
└─────────────────────────────────────────────────────────────────────────────────┘

Input DSL Syntax:
┌─────────────────────────────────────────────────────────────────────────────────┐
│ (ROLE: analyzer) (CONTEXT: typescript_codebase) (PROMPT: Evaluate code         │
│ quality and identify improvement opportunities) (OUTPUT: technical_report)      │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────┐              ┌──────────────────────────────────────────────────┐
│ Regex Parser    │ ────────────►│         EXTRACTION PROCESS                       │
│                 │              │                                                  │
│ roleMatch =     │              │ 1. roleMatch.match(/\(ROLE:\s*([^)]+)\)/i)       │
│ "analyzer"      │              │    → role_specification = "analyzer"             │
│                 │              │                                                  │
│ contextMatch =  │              │ 2. contextMatch.match(/\(CONTEXT:\s*([^)]+)\)/i) │
│ "typescript_    │              │    → context_parameters = {domain: "typescript_  │
│ codebase"       │              │      codebase"}                                  │
│                 │              │                                                  │
│ promptMatch =   │              │ 3. promptMatch.match(/\(PROMPT:\s*([^)]+)\)/i)   │
│ "Evaluate..."   │              │    → instruction_block = "Evaluate code..."      │
│                 │              │                                                  │
│ outputMatch =   │              │ 4. outputMatch.match(/\(OUTPUT:\s*([^)]+)\)/i)   │
│ "technical_     │              │    → output_requirements = "technical_report"    │
│ report"         │              │                                                  │
└─────────────────┘              └──────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           METAPROMPT OBJECT                                    │
│                                                                                 │
│ {                                                                               │
│   role_specification: "analyzer",                                              │
│   context_parameters: { domain: "typescript_codebase" },                       │
│   instruction_block: "Evaluate code quality and identify improvement           │
│                      opportunities",                                            │
│   output_requirements: "technical_report"                                      │
│ }                                                                               │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────┐              ┌──────────────────────────────────────────────────┐
│ Program         │ ────────────►│         PROMPT COMPILATION PROCESS               │
│ Generator       │              │                                                  │
│                 │              │ 1. Load ROLE_CONFIG[analyzer]                    │
│ generateMeta    │              │ 2. Get thinkingMethodology, frameworks, etc.     │
│ Prompt()        │              │ 3. Generate role-specific think guidance         │
│                 │              │ 4. Assemble Layer 1-5 stack template            │
│                 │              │ 5. Inject context and instructions               │
│                 │              │ 6. Add execution approach and validation         │
└─────────────────┘              └──────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      COMPILED NATURAL LANGUAGE PROGRAM                         │
│                                                                                 │
│ You are a specialized (ROLE: analyzer) agent.                                  │
│                                                                                 │
│ **🧠 THINKING METHODOLOGY FOR ANALYZER:**                                      │
│ • Validate data quality, completeness, and accuracy                            │
│ • Look for patterns, trends, anomalies, and correlations                       │
│ • Consider statistical significance and avoid false conclusions                 │
│ • Question assumptions and consider alternative explanations                    │
│                                                                                 │
│ **🎯 FOCUS:** multi_dimensional_analysis                                       │
│ **🔧 FRAMEWORKS:** statistical_analysis, pattern_recognition                   │
│                                                                                 │
│ **📊 EXECUTION CONTEXT:**                                                      │
│ - Domain: typescript_codebase                                                  │
│ - Expected Output: technical_report                                            │
│ - Complexity Level: complex                                                    │
│                                                                                 │
│ **🎯 EXECUTION APPROACH:**                                                     │
│ 1. Think through approach using Multi-dimensional Analysis Matrix and          │
│    Statistical Pattern Recognition frameworks                                   │
│ 2. Apply analyzer expertise with systematic precision                          │
│ 3. Follow data_validation, pattern_verification, statistical_significance      │
│    validation rules                                                            │
│ 4. Use TodoWrite to create your own sub-task breakdown if needed               │
│ 5. Execute with systematic precision using statistical_analysis and            │
│    pattern_recognition methodologies                                           │
│ 6. Think critically about work quality against ANALYZE_AND_REPORT standards    │
│ 7. Report completion with detailed deliverables                                │
│                                                                                 │
│ Your specific task: Evaluate code quality and identify improvement             │
│ opportunities                                                                   │
│                                                                                 │
│ Expected deliverable: technical_report                                         │
│                                                                                 │
│ Generate additional sub-programs if needed using the same meta-prompt syntax.  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Recursive Agent Spawning Tree

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           FRACTAL PROMPT EXECUTION                             │
└─────────────────────────────────────────────────────────────────────────────────┘

User Request: "Build a secure authentication system"
│
├── Main Claude (Layer 1-6 Stack)
│   ├── QUERY: Analyze → "secure auth system needed"
│   ├── ENHANCE: Add → "JWT, password reset, email verification, security audit"
│   ├── PLAN: Creates meta-prompt todos:
│   │   ├── "(ROLE: planner) (CONTEXT: auth_architecture) ..."
│   │   ├── "(ROLE: coder) (CONTEXT: jwt_implementation) ..."
│   │   ├── "(ROLE: critic) (CONTEXT: security_audit) ..."
│   │   └── "(ROLE: coder) (CONTEXT: frontend_integration) ..."
│   │
│   └── EXECUTE: Spawns specialized agents...
│
├── 📋 Task(planner) - Auth Architecture
│   │   [Receives own Layer 1-6 stack with planner specialization]
│   │
│   ├── EXECUTE: Creates sub-todos:
│   │   ├── "(ROLE: analyzer) (CONTEXT: existing_auth) ..."
│   │   ├── "(ROLE: coder) (CONTEXT: database_schema) ..."
│   │   └── "Design API endpoints for auth flow"
│   │
│   └── Spawns sub-agents:
│       │
│       ├── 🔍 Task(analyzer) - Existing Auth Analysis
│       │   [Layer 1-6 stack + analyzer + existing_auth context]
│       │   └── Returns: "Current auth gaps: no 2FA, weak password rules"
│       │
│       └── 💾 Task(coder) - Database Schema
│           [Layer 1-6 stack + coder + database_schema context]
│           └── Returns: SQL schema with users, sessions, tokens tables
│
├── 💻 Task(coder) - JWT Implementation  
│   │   [Receives own Layer 1-6 stack with coder specialization]
│   │
│   ├── EXECUTE: Creates sub-todos:
│   │   ├── "(ROLE: coder) (CONTEXT: jwt_generation) ..."
│   │   ├── "(ROLE: coder) (CONTEXT: token_validation) ..."
│   │   ├── "(ROLE: critic) (CONTEXT: jwt_security) ..."
│   │   └── "Write comprehensive tests for JWT flow"
│   │
│   └── Spawns sub-agents:
│       │
│       ├── 🔐 Task(coder) - JWT Generation
│       │   └── Returns: JWT creation with secure signing algorithm
│       │
│       ├── ✅ Task(coder) - Token Validation  
│       │   └── Returns: Middleware for JWT verification
│       │
│       └── 🛡️ Task(critic) - JWT Security Review
│           └── Returns: "Use RS256, implement rotation, check expiration"
│
├── 🔒 Task(critic) - Security Audit
│   │   [Receives own Layer 1-6 stack with critic specialization]
│   │
│   ├── EXECUTE: Creates sub-todos:
│   │   ├── "(ROLE: critic) (CONTEXT: auth_vulnerabilities) ..."
│   │   ├── "(ROLE: analyzer) (CONTEXT: security_metrics) ..."
│   │   └── "Test for common auth attack vectors"
│   │
│   └── Spawns sub-agents:
│       │
│       ├── ⚠️ Task(critic) - Vulnerability Assessment
│       │   └── Returns: "Check CSRF, XSS, injection, timing attacks"
│       │
│       └── 📊 Task(analyzer) - Security Metrics
│           └── Returns: "Password strength algorithm, rate limiting rules"
│
└── 🎨 Task(coder) - Frontend Integration
    │   [Receives own Layer 1-6 stack with coder + UI specialization]
    │
    ├── EXECUTE: Creates sub-todos:
    │   ├── "(ROLE: ui_implementer) (CONTEXT: login_forms) ..."
    │   ├── "(ROLE: coder) (CONTEXT: api_integration) ..."
    │   └── "Implement auth state management"
    │
    └── Spawns sub-agents:
        │
        ├── 🎯 Task(ui_implementer) - Login Forms
        │   └── Returns: React components with validation
        │
        └── 🔌 Task(coder) - API Integration  
            └── Returns: Auth service with error handling

Each agent at every level:
✅ Receives full Layer 1-6 prompt stack
✅ Can spawn infinite sub-agents with meta-prompts  
✅ Operates independently with specialized context
✅ Reports results back up the hierarchy
✅ Maintains consistent Software 3.0 programming model
```

---

## Tool Constraint Flow Visualization

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          TOOL CONSTRAINT ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────────────────────┘

Phase-Based Tool Whitelisting (Layer 5 Implementation):

INIT Phase
┌─────────────────┐
│ Tools: ['manus_orchestrator']                                                   │
│ Guidance: "Call manus_orchestrator to begin"                                   │
│ Effect: Forces immediate transition to FSM                                     │
└─────────────────┘
         │
         ▼
QUERY Phase  
┌─────────────────┐
│ Tools: ['manus_orchestrator']                                                   │
│ Guidance: "Think through goal analysis, then call manus_orchestrator"          │
│ Effect: Thinking + single tool = feels natural but guided                      │
└─────────────────┘
         │
         ▼
ENHANCE Phase
┌─────────────────┐
│ Tools: ['manus_orchestrator']                                                   │  
│ Guidance: "Think through enhancement opportunities, then call manus_orchestrator"│
│ Effect: Context injection + single tool choice                                 │
└─────────────────┘
         │
         ▼
KNOWLEDGE Phase
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Tools: ['WebSearch', 'WebFetch', 'mcp__ide__executeCode', 'manus_orchestrator'] │
│ Guidance: "Think through knowledge needs, then choose: WebSearch/WebFetch       │
│           (research), mcp__ide__executeCode (data processing),                  │
│           manus_orchestrator (skip research)"                                  │
│ Effect: FIRST bounded choice - feels like autonomy within constraints          │
└─────────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
PLAN Phase
┌─────────────────┐
│ Tools: ['TodoWrite']                                                           │
│ Guidance: "Think through strategic planning, then use TodoWrite to create      │
│           todos, then call manus_orchestrator"                                │
│ Effect: Forces planning mode, enables meta-prompt injection                   │
└─────────────────┘
         │
         ▼
EXECUTE Phase  
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Tools: ['TodoRead', 'TodoWrite', 'Task', 'Bash', 'Read', 'Write', 'Edit',      │
│         'Browser', 'mcp__ide__executeCode']                                     │
│ Guidance: "Think through execution approach, then choose: TodoRead (check      │
│           todos), Task (spawn agent), Bash/Browser (direct execution),         │
│           mcp__ide__executeCode (Python analysis/computation)"                 │
│ Effect: Maximum tool choice for execution flexibility                          │
│                                                                                 │
│ FRACTAL DECISION TREE:                                                         │
│ ┌─────────────────┐                                                             │
│ │ TodoRead        │ → Check current task                                       │
│ └─────────────────┘                                                             │
│          │                                                                      │
│          ▼                                                                      │
│ ┌─────────────────┐       ┌─────────────────┐                                  │
│ │ Meta-prompt?    │ YES ──► Task() spawn     │                                  │
│ │ (ROLE:...)      │       │ specialized     │                                  │
│ └─────────────────┘       │ agent           │                                  │
│          │ NO             └─────────────────┘                                  │
│          ▼                                                                      │
│ ┌─────────────────┐                                                             │
│ │ Direct execution│ → Bash/Read/Write/Edit                                     │
│ │ tools           │                                                             │
│ └─────────────────┘                                                             │
│          │                                                                      │
│          ▼                                                                      │
│ ┌─────────────────┐                                                             │
│ │ Single tool per │ → Report back via manus_orchestrator                      │
│ │ iteration       │                                                             │
│ └─────────────────┘                                                             │
└─────────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
VERIFY Phase
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Tools: ['TodoRead', 'Read', 'mcp__ide__executeCode']                            │
│ Guidance: "Think through quality assessment, then choose: TodoRead              │
│           (check completion), Read (verify output), mcp__ide__executeCode       │
│           (analytical verification)"                                           │
│ Effect: Validation-focused tool choices                                        │
└─────────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
DONE Phase
┌─────────────────┐
│ Tools: []                                                                      │
│ Guidance: "No action needed"                                                   │
│ Effect: Mission complete, enter standby                                       │
└─────────────────┘
```

---

## Prompt Compilation Process

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        SOFTWARE 3.0 COMPILATION PIPELINE                       │
└─────────────────────────────────────────────────────────────────────────────────┘

generateRoleEnhancedPrompt(phase: EXECUTE, role: analyzer, objective: "analyze code")
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              STEP 1: LOAD TEMPLATES                            │
│                                                                                 │
│ BASE_PHASE_PROMPTS[EXECUTE]:                                                    │
│ "You are in the EXECUTE phase (Manus Datasource Module). Your task:            │
│  Think through your execution strategy before taking action. Analyze:          │
│  - What is the current task complexity and scope?..."                          │
│                                                                                 │
│ ROLE_CONFIG[analyzer].thinkingMethodology:                                     │
│ ["Validate data quality, completeness, and accuracy",                          │
│  "Look for patterns, trends, anomalies, and correlations",                     │
│  "Consider statistical significance and avoid false conclusions",               │
│  "Question assumptions and consider alternative explanations"]                  │
│                                                                                 │
│ PHASE_TOOL_GUIDANCE[EXECUTE]:                                                  │
│ "Think through execution approach, then choose: TodoRead (check todos)..."     │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           STEP 2: ROLE ENHANCEMENT                             │
│                                                                                 │
│ const thinkingMethodology = `                                                  │
│                                                                                 │
│ **🧠 THINKING METHODOLOGY FOR ANALYZER:**                                      │
│ • Validate data quality, completeness, and accuracy                            │
│ • Look for patterns, trends, anomalies, and correlations                       │
│ • Consider statistical significance and avoid false conclusions                 │
│ • Question assumptions and consider alternative explanations                    │
│                                                                                 │
│ **🎯 FOCUS:** multi_dimensional_analysis                                       │
│ **🔧 FRAMEWORKS:** statistical_analysis, pattern_recognition                   │
│                                                                                 │
│ **🛠️ TOOL GUIDANCE:** Think through execution approach, then choose:           │
│ TodoRead (check todos), Task (spawn agent), Bash/Browser (direct execution)    │
│                                                                                 │
│ Apply these thinking steps systematically to improve reasoning quality.`;      │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         STEP 3: TEMPLATE CONCATENATION                         │
│                                                                                 │
│ return basePrompt + thinkingMethodology;                                       │
│                                                                                 │
│ // Software 3.0: String concatenation = program compilation                    │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           STEP 4: CONTEXT INJECTION                            │
│                                                                                 │
│ if (nextPhase === 'EXECUTE') {                                                 │
│   const currentTaskIndex = session.payload.current_task_index || 0;            │
│   const currentTodos = session.payload.current_todos || [];                    │
│   const currentTodo = currentTodos[currentTaskIndex];                          │
│                                                                                 │
│   augmentedPrompt += `**📊 EXECUTION CONTEXT:**                               │
│   - Current Task Index: ${currentTaskIndex}                                    │
│   - Total Tasks: ${currentTodos.length}                                        │
│   - Current Task: ${currentTodo || 'None'}                                     │
│   - Reasoning Effectiveness: ${reasoning_effectiveness * 100}%`;               │
│ }                                                                               │
│                                                                                 │
│ // Software 3.0: Runtime state becomes part of executing program              │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         FINAL COMPILED PROGRAM                                 │
│                                                                                 │
│ You are in the EXECUTE phase (Manus Datasource Module). Your task:             │
│                                                                                 │
│ Think through your execution strategy before taking action. Analyze:           │
│ - What is the current task complexity and scope?                               │
│ - What is the optimal execution approach for this specific task?               │
│ - Should you use direct tools or spawn specialized Task() agents?              │
│                                                                                 │
│ **🧠 THINKING METHODOLOGY FOR ANALYZER:**                                      │
│ • Validate data quality, completeness, and accuracy                            │
│ • Look for patterns, trends, anomalies, and correlations                       │
│ • Consider statistical significance and avoid false conclusions                 │
│ • Question assumptions and consider alternative explanations                    │
│                                                                                 │
│ **🎯 FOCUS:** multi_dimensional_analysis                                       │
│ **🔧 FRAMEWORKS:** statistical_analysis, pattern_recognition                   │
│                                                                                 │
│ **📊 EXECUTION CONTEXT:**                                                      │
│ - Current Task Index: 2                                                        │
│ - Total Tasks: 5                                                               │
│ - Current Task: (ROLE: analyzer) (CONTEXT: codebase) (PROMPT: analyze) ...     │
│ - Reasoning Effectiveness: 87.3%                                               │
│                                                                                 │
│ **🛠️ TOOL GUIDANCE:** Think through execution approach, then choose:           │
│ TodoRead (check todos), Task (spawn agent), Bash/Browser (direct execution)    │
│                                                                                 │
│ Apply these thinking steps systematically to improve reasoning quality.        │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
                            📤 DELIVERED TO CLAUDE 📤
```

This comprehensive visual documentation shows how **Manus FSM implements Software 3.0** through sophisticated prompt engineering, where **natural language becomes the primary programming language** and traditional code serves as the compilation infrastructure.