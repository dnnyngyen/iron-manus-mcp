🎯 MANUS FSM WORKFLOW GUIDANCE - ASCII FLOW DIAGRAMS

  Main FSM Flow Architecture

  ┌─────────────────────────────────────────────────────────────────────────┐
  │                    MANUS FSM 6-PHASE WORKFLOW GUIDANCE                 │
  └─────────────────────────────────────────────────────────────────────────┘

  User Request
       │
       ▼
  ┌─────────┐    session_id     ┌──────────────────┐
  │  INIT   │ ──────────────►  │  MCP Server      │
  │  Phase  │   initial_obj    │  (index.ts:73)  │
  └─────────┘                  └──────────────────┘
       │                              │
       │ detectEnhancedRole()         │ processManusFSM()
       ▼                              ▼
  ┌─────────┐                  ┌──────────────────┐
  │ QUERY   │◄─────────────────│   FSM Logic      │
  │ Phase   │  system_prompt   │  (fsm.ts:104)   │
  └─────────┘                  └──────────────────┘
       │                              │
       │ manus_orchestrator           │ Store interpreted_goal
       │ phase_completed='QUERY'      │
       ▼                              ▼
  ┌─────────┐                  ┌──────────────────┐
  │ENHANCE  │◄─────────────────│  State Manager   │
  │ Phase   │  enhanced_prompt │  (state.js)     │
  └─────────┘                  └──────────────────┘
       │                              │
       │ manus_orchestrator           │ Store enhanced_goal
       │ phase_completed='ENHANCE'    │
       ▼                              ▼
  ┌─────────┐                  ┌──────────────────┐
  │KNOWLEDGE│◄─────────────────│  Session Payload │
  │ Phase   │ tool_whitelist   │  Management      │
  └─────────┘                  └──────────────────┘
       │                              │
       │ WebSearch/WebFetch OR        │ Store knowledge_gathered
       │ manus_orchestrator           │
       ▼                              ▼
  ┌─────────┐                  ┌──────────────────┐
  │  PLAN   │◄─────────────────│   TodoWrite      │
  │ Phase   │  TodoWrite only  │   Integration    │
  └─────────┘                  └──────────────────┘
       │                              │
       │ TodoWrite → manus_orch       │ Parse meta-prompts
       │ phase_completed='PLAN'       │ extractEnhancedMetaPrompts
       ▼                              ▼
  ┌─────────┐                  ┌──────────────────┐
  │ EXECUTE │◄─────────────────│  Framework State │
  │ Phase   │ single_tool      │  Management      │
  └─────────┘                  └──────────────────┘
       │                              │
       │ TodoRead/Task/Bash/etc       │ Task index tracking
       │ Single tool per iteration    │ current_task_index++
       ▼                              ▼
  ┌─────────┐                  ┌──────────────────┐
  │ VERIFY  │◄─────────────────│   Validation     │
  │ Phase   │ completion_check │   Engine         │
  └─────────┘                  └──────────────────┘
       │                              │
       │ Mathematical validation      │ 95% completion rule
       │ verification_passed=true     │ Rollback logic
       ▼                              ▼
  ┌─────────┐                  ┌──────────────────┐
  │  DONE   │◄─────────────────│   Standby Mode   │
  │ Phase   │ mission_complete │                  │
  └─────────┘                  └──────────────────┘

  Phase 1: QUERY - "Analyze Events" Detail

  ┌──────────────────────────────────────────────────────────────────┐
  │                        QUERY PHASE DETAIL                       │
  └──────────────────────────────────────────────────────────────────┘

  Natural Language Input
           │
           ▼
  ┌─────────────────┐    Think through analysis    ┌──────────────────┐
  │   Claude sees   │ ─────────────────────────► │  Role Detection  │
  │ "Think through  │  (prompts.ts:194-210)      │ (fsm.ts:111)    │
  │ your analysis   │                             │                  │
  │ approach..."    │                             │ detectEnhanced   │
  └─────────────────┘                             │ Role()           │
           │                                       └──────────────────┘
           │                                                │
           ▼                                                ▼
  ┌─────────────────┐                             ┌──────────────────┐
  │ Cognitive       │    2.7x effectiveness      │  System Prompt   │
  │ Enhancement     │ ◄──────────────────────── │  Augmentation    │
  │ (prompts.ts:    │                             │  (fsm.ts:271)   │
  │ 184-189)        │                             │                  │
  └─────────────────┘                             └──────────────────┘
           │                                                │
           │ Strategic Architecture Planning                │
           │ Hierarchical Decomposition                     │
           ▼                                                ▼
  ┌─────────────────┐                             ┌──────────────────┐
  │ Tool Constraint │    ['manus_orchestrator']   │  Forced Single   │
  │ (prompts.ts:    │ ──────────────────────────► │  Tool Response   │
  │ 582)            │                             │  (index.ts:122) │
  └─────────────────┘                             └──────────────────┘
           │                                                │
           │ MUST call manus_orchestrator                   │
           ▼                                                ▼
  ┌─────────────────┐                             ┌──────────────────┐
  │ Claude Response │    interpreted_goal         │   State Store    │
  │ manus_orchestr  │ ──────────────────────────► │  (fsm.ts:136)   │
  │ (phase_completed│                             │                  │
  │ ='QUERY')       │                             │ session.payload  │
  └─────────────────┘                             │ .interpreted_goal│
                                                   └──────────────────┘
                                                            │
                                                            ▼
                                                   ┌──────────────────┐
                                                   │   ENHANCE Phase  │
                                                   │   Transition     │
                                                   │  (fsm.ts:139)   │
                                                   └──────────────────┘

  Phase 4: PLAN - "Iterate" TodoWrite Fractal Orchestration

  ┌───────────────────────────────────────────────────────────────────────────┐
  │                    PLAN PHASE: FRACTAL ORCHESTRATION                     │
  └───────────────────────────────────────────────────────────────────────────┘

  System Prompt Injection (fsm.ts:322-323)
           │
           ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ **🔄 FRACTAL ORCHESTRATION GUIDE:**                                    │
  │ For complex sub-tasks that need specialized expertise, create todos:    │
  │ "(ROLE: coder) (CONTEXT: auth_system) (PROMPT: JWT auth) (OUTPUT: code)"│
  │ This enables Task() agent spawning in EXECUTE phase                    │
  └─────────────────────────────────────────────────────────────────────────┘
           │
           ▼
  ┌─────────────────┐           ┌─────────────────┐           ┌─────────────────┐
  │   Simple Todo   │           │ Meta-Prompt     │           │  Complex Todo   │
  │                 │           │ Injection       │           │                 │
  │ "Analyze src    │           │      │          │           │ "(ROLE: analyzer│
  │ directory"      │           │      ▼          │           │ (CONTEXT: ts_   │
  │                 │           │ ┌─────────────┐ │           │ eval) (PROMPT:  │
  │ Direct exec     │           │ │ TodoWrite   │ │           │ Examine files)  │
  │ in EXECUTE      │           │ │ creates     │ │           │ (OUTPUT: report)│
  └─────────────────┘           │ │ structured  │ │           │                 │
           │                    │ │ todos       │ │           │ Task() spawn    │
           │                    │ └─────────────┘ │           │ in EXECUTE      │
           ▼                    │      │          │           └─────────────────┘
  ┌─────────────────┐           │      ▼          │                    │
  │ TodoWrite Tool  │           │ ┌─────────────┐ │                    │
  │ Call            │───────────┼─│manus_orchest│─┼────────────────────┘
  │                 │           │ │rator call   │ │
  │ Creates todo    │           │ │phase_complet│ │
  │ list with mixed │           │ │ed='PLAN'    │ │
  │ simple + meta   │           │ └─────────────┘ │
  └─────────────────┘           └─────────────────┘
           │                              │
           ▼                              ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │                    MCP Server Processing                               │
  │                                                                         │
  │  extractEnhancedMetaPrompts(rawTodos) (fsm.ts:170)                    │
  │         │                                                               │
  │         ▼                                                               │
  │  ┌─────────────────┐         ┌─────────────────┐                      │
  │  │ Regex Parsing   │         │  Enhanced AST   │                      │
  │  │ (fsm.ts:398)    │         │  Processing     │                      │
  │  │                 │         │  (disabled)     │                      │
  │  │ /\(ROLE:\s*     │         │                 │                      │
  │  │ ([^)]+)\)/i     │         │ Fallback to     │                      │
  │  │                 │         │ regex           │                      │
  │  └─────────────────┘         └─────────────────┘                      │
  │         │                              │                               │
  │         ▼                              ▼                               │
  │  ┌─────────────────┐         ┌─────────────────┐                      │
  │  │ MetaPrompt      │         │ Session State   │                      │
  │  │ Objects         │         │ Update          │                      │
  │  │ Created         │         │                 │                      │
  │  │                 │         │ current_todos   │                      │
  │  │ role_spec       │         │ current_task_   │                      │
  │  │ context_params  │         │ index = 0       │                      │
  │  │ instruction     │         │                 │                      │
  │  │ output_req      │         │                 │                      │
  │  └─────────────────┘         └─────────────────┘                      │
  └─────────────────────────────────────────────────────────────────────────┘
           │
           ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │                         EXECUTE Phase Ready                            │
  │                                                                         │
  │ Todos parsed and stored:                                                │
  │ - Simple todos: Direct tool execution                                   │
  │ - Meta-prompt todos: Task() agent spawning with role enhancement       │
  │ - current_task_index: 0 (start with first todo)                       │
  │ - Fractal orchestration enabled                                        │
  └─────────────────────────────────────────────────────────────────────────┘

  Phase 5: EXECUTE - "Submit Results" Fractal Iteration Loop

  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │                    EXECUTE PHASE: FRACTAL ITERATION DETAIL                     │
  └─────────────────────────────────────────────────────────────────────────────────┘

  Entry Point: PLAN → EXECUTE Transition
           │
           ▼
  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │                    Execution Context Injection                                 │
  │                         (fsm.ts:324-332)                                       │
  │                                                                                 │
  │ **📊 EXECUTION CONTEXT:**                                                       │
  │ - Current Task Index: ${currentTaskIndex}                                      │
  │ - Total Tasks: ${currentTodos.length}                                          │
  │ - Current Task: ${currentTodo || 'None'}                                       │
  │ - Reasoning Effectiveness: ${reasoning_effectiveness * 100}%                   │
  │                                                                                 │
  │ **🔄 FRACTAL EXECUTION PROTOCOL:**                                              │
  │ 1. Check current todo (index N) for meta-prompt patterns                      │
  │ 2. If todo contains (ROLE:...) → use Task() tool to spawn agent               │
  │ 3. If direct execution → use Bash/Read/Write/etc                               │
  │ 4. After each action → report results back                                     │
  │ **⚡ SINGLE TOOL PER ITERATION:** Choose ONE tool per turn                     │
  └─────────────────────────────────────────────────────────────────────────────────┘
           │
           ▼
  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │                            Claude Decision Tree                                │
  └─────────────────────────────────────────────────────────────────────────────────┘
           │
           ▼
      ┌─────────┐
      │ Claude  │
      │ Reads   │
      │ Current │
      │ Todo    │
      └─────────┘
           │
           ▼
      ┌─────────┐
      │ Meta-   │
      │ Prompt? │
      └─────────┘
       │        │
     Yes│        │No
       │        │
       ▼        ▼
  ┌─────────┐ ┌─────────┐
  │ Task()  │ │Direct   │
  │ Agent   │ │Tool     │
  │ Spawn   │ │Execute  │
  └─────────┘ └─────────┘
       │        │
       │        ▼
       │   ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
       │   │   LS    │    │  Read   │    │  Bash   │    │  Edit   │
       │   │ (dir    │    │ (file)  │    │ (cmd)   │    │ (code)  │
       │   │ list)   │    │         │    │         │    │         │
       │   └─────────┘    └─────────┘    └─────────┘    └─────────┘
       │        │              │              │              │
       │        └──────────────┼──────────────┼──────────────┘
       │                       │              │
       ▼                       ▼              ▼
  ┌─────────┐           ┌─────────────────────────────┐
  │ Task()  │           │     Tool Execution          │
  │ Agent   │           │                             │
  │ with    │           │ Single tool → result →      │
  │ Role    │           │ manus_orchestrator call     │
  │ Config  │           │                             │
  └─────────┘           └─────────────────────────────┘
       │                              │
       │ Cognitive Enhancement        │
       │ 2.3x-3.2x multiplier        │
       ▼                              ▼
  ┌─────────┐                 ┌─────────────────┐
  │ Agent   │                 │ MCP Server      │
  │ Creates │                 │ Response        │
  │ Output  │                 │                 │
  │ Can     │                 │ execution_      │
  │ Create  │                 │ results stored  │
  │ Sub-    │                 │                 │
  │ Todos   │                 │ task index      │
  └─────────┘                 │ increment       │
       │                      └─────────────────┘
       │ Fractal Recursion             │
       ▼                               ▼
  ┌─────────┐                 ┌─────────────────┐
  │ N-Level │                 │ Iteration       │
  │ Deep    │                 │ Control         │
  │ Agent   │                 │ (fsm.ts:208)    │
  │ Spawning│                 │                 │
  └─────────┘                 │ More tasks?     │
                               │ → EXECUTE       │
                               │ No more?        │
                               │ → VERIFY        │
                               └─────────────────┘

  Session State Management Tree

  session_state_tree/
  ├── session_id: "unique_identifier"
  ├── current_phase: Phase
  │   ├── INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE
  │   └── phase_transition_logic (fsm.ts:127-264)
  ├── initial_objective: string
  ├── detected_role: Role
  │   ├── planner (2.7x Strategic Architecture Planning)
  │   ├── coder (2.5x Modular Architecture Design)
  │   ├── critic (3.0x Security-First Assessment)
  │   ├── researcher (2.8x Source Triangulation)
  │   ├── analyzer (3.2x Multi-dimensional Analysis)
  │   ├── synthesizer (2.9x Integration Reasoning)
  │   ├── ui_architect (3.1x V0 Component Architecture)
  │   ├── ui_implementer (2.8x V0 Implementation Patterns)
  │   └── ui_refiner (2.5x Strategic UI Refinement)
  ├── reasoning_effectiveness: number (0.3-1.0)
  ├── payload: SessionPayload
  │   ├── interpreted_goal: string (QUERY output)
  │   ├── enhanced_goal: string (ENHANCE output)
  │   ├── knowledge_gathered: string (KNOWLEDGE output)
  │   ├── plan_created: boolean (PLAN output)
  │   ├── current_todos: TodoItem[]
  │   │   ├── [0] simple_todo
  │   │   │   ├── id: string
  │   │   │   ├── content: string
  │   │   │   ├── status: "pending" | "in_progress" | "completed"
  │   │   │   └── priority: "high" | "medium" | "low"
  │   │   ├── [1] meta_prompt_todo
  │   │   │   ├── id: string
  │   │   │   ├── content: "(ROLE: X) (CONTEXT: Y) (PROMPT: Z) (OUTPUT: W)"
  │   │   │   ├── meta_prompt: MetaPrompt
  │   │   │   │   ├── role_specification: string
  │   │   │   │   ├── context_parameters: object
  │   │   │   │   ├── instruction_block: string
  │   │   │   │   └── output_requirements: string
  │   │   │   ├── type: "TaskAgent"
  │   │   │   └── priority: "high"
  │   │   └── [N] ...additional_todos
  │   ├── current_task_index: number
  │   ├── phase_transition_count: number
  │   ├── execution_results: object
  │   ├── verification_results: VerificationResult
  │   │   ├── isValid: boolean
  │   │   ├── completionPercentage: number
  │   │   ├── reason: string
  │   │   ├── criticalTasksCompleted: number
  │   │   ├── totalCriticalTasks: number
  │   │   └── taskBreakdown: object
  │   └── ...additional_phase_data
  └── last_activity: timestamp

  Tool Constraint Flow per Phase

  PHASE_ALLOWED_TOOLS_FLOW
  │
  ├── INIT: ['manus_orchestrator']
  │   └── Forced → index.ts:122 → tool_code.tool = 'manus_orchestrator'
  │
  ├── QUERY: ['manus_orchestrator'] 
  │   └── Forced → Think + mandatory manus_orchestrator call
  │
  ├── ENHANCE: ['manus_orchestrator']
  │   └── Forced → Enhanced thinking + mandatory manus_orchestrator call
  │
  ├── KNOWLEDGE: ['WebSearch', 'WebFetch', 'mcp__ide__executeCode', 'manus_orchestrator']
  │   └── Choice → Claude picks from whitelist based on knowledge needs
  │
  ├── PLAN: ['TodoWrite']
  │   └── Forced → TodoWrite (fractal orchestration injection) + manus_orchestrator
  │
  ├── EXECUTE: ['TodoRead', 'TodoWrite', 'Task', 'Bash', 'Read', 'Write', 'Edit', 'Browser', 'mcp__ide__executeCode']
  │   │
  │   ├── TodoRead → Check current task
  │   ├── Task → Spawn fractal agent (meta-prompt todos)
  │   ├── Bash/Read/Write/Edit → Direct execution (simple todos)
  │   ├── mcp__ide__executeCode → Python analysis/computation
  │   └── **SINGLE TOOL PER ITERATION** → manus_orchestrator after each action
  │
  ├── VERIFY: ['TodoRead', 'Read', 'mcp__ide__executeCode']
  │   └── Choice → Quality assessment tools + final manus_orchestrator
  │
  └── DONE: []
      └── No tools → Standby mode, mission accomplished

  Verification Engine Rollback Logic

  VERIFICATION_ROLLBACK_DECISION_TREE (fsm.ts:220-253)
  │
  ├── validateTaskCompletion(session, payload)
  │   │
  │   ├── Rule 1: Critical Tasks (fsm.ts:467-471)
  │   │   ├── criticalTasks.filter(priority='high' OR meta_prompt=true)
  │   │   └── IF criticalTasksCompleted < totalCriticalTasks → FAIL
  │   │
  │   ├── Rule 2: Overall Completion (fsm.ts:473-477)
  │   │   └── IF completionPercentage < 95% → FAIL
  │   │
  │   ├── Rule 3: Pending High Priority (fsm.ts:479-486)
  │   │   └── IF any todo.status='pending' AND priority='high' → FAIL
  │   │
  │   ├── Rule 4: In-Progress Tasks (fsm.ts:488-493)
  │   │   └── IF any todo.status='in_progress' → FAIL
  │   │
  │   └── Rule 5: Execution Success Rate (fsm.ts:495-500)
  │       └── IF reasoning_effectiveness < 0.7 → FAIL
  │
  ├── ROLLBACK LOGIC BASED ON COMPLETION %:
  │   │
  │   ├── completionPercentage < 50%
  │   │   └── → nextPhase = 'PLAN' (Severe: restart planning)
  │   │
  │   ├── completionPercentage < 80%
  │   │   └── → nextPhase = 'EXECUTE' (Moderate: retry execution)
  │   │
  │   └── completionPercentage >= 80%
  │       └── → Decrement task_index, retry previous task
  │
  └── SUCCESS PATH:
      ├── verification_passed === true
      ├── All rules pass
      └── → nextPhase = 'DONE'

  The Elegant Loop: Natural Flow with Deterministic Control

  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │                        ARCHITECTURAL ELEGANCE SUMMARY                          │
  └─────────────────────────────────────────────────────────────────────────────────┘

  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
  │   NATURAL       │    │    THINKING     │    │  DETERMINISTIC  │
  │   THINKING      │    │  METHODOLOGY    │    │    CONTROL      │
  │                 │    │                 │    │                 │
  │ "Think through  │    │ Role-specific   │    │ Tool constraints│
  │ your analysis   │◄──►│ thinking        │◄──►│ Phase gating    │
  │ approach..."    │    │ methodologies   │    │ Single tool/iter│
  │                 │    │ (all roles)     │    │                 │
  │                 │    │                 │    │                 │
  │ Natural Claude  │    │ Structured      │    │ Bounded choice  │
  │ reasoning       │    │ reasoning       │    │ Forced sequence │
  └─────────────────┘    └─────────────────┘    └─────────────────┘
           │                       │                       │
           └───────────────────────┼───────────────────────┘
                                   │
                                   ▼
              ┌─────────────────────────────────────┐
              │         ELEGANT SYNTHESIS           │
              │                                     │
              │ • Natural self-directed workflow     │
              │ • Systematic guidance framework     │
              │ • Autonomous task delegation        │
              │ • Quality-based validation          │
              │ • Intelligent workflow guidance     │
              │ • State persistence                 │
              │ • Performance tracking              │
              │                                     │
              │ "Structures Claude's reasoning      │
              │  with explicit thinking steps       │
              │  while preserving full autonomy     │
              │  through systematic guidance        │
              │  frameworks"                        │
              └─────────────────────────────────────┘

  This ASCII representation shows how the Manus FSM creates a beautiful dance between natural reasoning and systematic guidance - each phase has precisely defined
  responsibilities that build upon each other, creating sophisticated workflow structure while preserving Claude's complete autonomy.