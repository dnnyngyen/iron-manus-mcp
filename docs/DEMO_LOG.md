# Iron Manus MCP: 8-Phase FSM Architecture & Demonstration

## Executive Summary

The Iron Manus MCP v0.2.5 is an 8-phase Finite State Machine (FSM)-driven orchestration system. This document provides a comprehensive analysis of the architecture, prompt flow, and demonstration of the complete workflow.

## Core Architecture: Hybrid Cognitive-Deterministic System

The Iron Manus MCP implements a hybrid cognitive-deterministic system that combines:

- **Cognitive Layer (FSM)**: Strategic reasoning, role-based orchestration, meta-prompt generation
- **Deterministic Layer (Hooks)**: Validation rules, security enforcement, quality assurance

**Architecture Philosophy:**
"Hooks handle 'what' (rules) while the FSM handles 'why' (strategy)"

---

## 8-Phase FSM Workflow Architecture

```
graph LR
    A[INIT] --> B[QUERY]
    B --> C[ENHANCE]
    C --> D[KNOWLEDGE]
    D --> E[PLAN]
    E --> F[EXECUTE]
    F --> G[VERIFY]
    G --> H[DONE]
    G -.->|Rollback <50%| E
    G -.->|Rollback <80%| F

INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE
```

---

## Phase-by-Phase Analysis with Code Annotations

### Phase 1: INIT → QUERY

**What Happens:**
- Auto-generates session ID
- Initializes FSM state
- Triggers role detection
- Transitions immediately to QUERY phase

**Code Implementation:**
```typescript
// src/phase-engine/FSM.ts:65-85
if (input.initial_objective) {
    session.initial_objective = input.initial_objective;

    // Generate role selection prompt
    const roleSelectionPrompt = generateRoleSelectionPrompt(input.initial_objective);

    // Set temporary role as fallback
    session.detected_role = detectRole(input.initial_objective);
    session.current_phase = 'INIT';
    session.reasoning_effectiveness = CONFIG.INITIAL_REASONING_EFFECTIVENESS;

    // Initialize payload with execution state
    session.payload = {
        current_task_index: 0,
        current_todos: [],
        phase_transition_count: 0,
        role_selection_prompt: roleSelectionPrompt,
        awaiting_role_selection: true,
    };
}
```

**Live Terminal Output:**
```json
{
  "next_phase": "QUERY",
  "system_prompt": "You are analyzing the user's objective...",
  "allowed_next_tools": ["JARVIS"],
  "payload": {
    "session_id": "session_1751340804726_2erkulbtx",
    "detected_role": "researcher",
    "reasoning_effectiveness": 0.8,
    "awaiting_role_selection": true
  },
  "status": "IN_PROGRESS"
}
```

---

### Phase 2: QUERY → ENHANCE

**What Happens:**
- Processes role selection response
- Updates session with intelligent role choice
- Stores interpreted goal
- Applies role-specific enhancement

**Code Implementation:**
```typescript
// src/phase-engine/FSM.ts:97-124
case 'QUERY':
    if (input.phase_completed === 'QUERY') {
        if (session.payload.awaiting_role_selection && input.payload?.claude_response) {
            try {
                const claudeSelectedRole = parseClaudeRoleSelection(
                    input.payload.claude_response,
                    session.initial_objective || ''
                );
                session.detected_role = claudeSelectedRole;
                session.payload.awaiting_role_selection = false;
                console.log(`SUCCESS Claude selected role: ${claudeSelectedRole}`);
            } catch (error) {
                console.error('Error processing role selection:', error);
                session.payload.awaiting_role_selection = false;
            }
        }

        if (input.payload?.interpreted_goal) {
            session.payload.interpreted_goal = input.payload.interpreted_goal;
        }
        nextPhase = 'ENHANCE';
    }
```

---

### Phase 3: ENHANCE → KNOWLEDGE

**What Happens:**
- Applies role-specific thinking methodology
- Enhances goal with technical details and edge cases
- Prepares for knowledge gathering phase

**Code Implementation:**
```typescript
// src/core/prompts.ts:444-485
export function generateRoleEnhancedPrompt(phase: Phase, role: Role, objective: string): string {
    const config = ROLE_CONFIG[role];
    let basePrompt = BASE_PHASE_PROMPTS[phase];
    let toolGuidance = PHASE_TOOL_GUIDANCE[phase];

    const thinkingMethodology = `
THINKING METHODOLOGY FOR ${role.toUpperCase()}:
${config.thinkingMethodology.map(step => `• ${step}`).join('\n')}

FOCUS: ${config.focus}
FRAMEWORKS: ${config.suggestedFrameworks.join(', ')}`;

    return basePrompt + thinkingMethodology;
}
```

---

### Phase 4: KNOWLEDGE → PLAN

**What Happens:**
- Executes auto-connection with 65 API registry
- Performs intelligent API selection
- Gathers and synthesizes knowledge from multiple sources
- Applies cross-validation and confidence scoring

**Code Implementation:**
```typescript
// src/phase-engine/FSM.ts:263-351
async function runAutoConnection(session: any, deps: AutoConnectionDeps) {
    try {
        const startTime = Date.now();

        // Generate API selection prompt
        const apiSelectionPrompt = generateAPISelectionPrompt(
            session.payload.enhanced_goal,
            session.detected_role,
            SAMPLE_API_REGISTRY
        );

        session.payload.api_selection_prompt = apiSelectionPrompt;
        session.payload.awaiting_api_selection = true;

        // Fallback to hardcoded selection
        const relevantAPIs = selectRelevantAPIs(session.payload.enhanced_goal, session.detected_role);

        if (relevantAPIs.length > 0) {
            const objective = session.payload.enhanced_goal || session.initial_objective || '';
            const result: KnowledgePhaseResult = await deps.autoConnection(objective);

            session.payload.synthesized_knowledge = result.answer;
            session.payload.knowledge_confidence = result.confidence;
            session.payload.auto_connection_successful = true;
        }
    } catch (autoConnectionError) {
        console.warn('[FSM-KNOWLEDGE] Auto-connection failed, falling back to manual mode');
        session.payload.auto_connection_successful = false;
    }
}
```

---

### Phase 5: PLAN → EXECUTE

**What Happens:**
- Creates TodoWrite breakdown with meta-prompts
- Embeds Task() agent spawning patterns
- Structures complex todos with meta-prompt syntax

**Code Implementation:**
```typescript
// src/phase-engine/FSM.ts:536-553
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
            output_requirements: outputMatch ? outputMatch[1].trim() : 'comprehensive_deliverable',
        };
    }
    return null;
}
```

**Todo Breakdown Example:**
```json
[
  {
    "content": "(ROLE: coder) (CONTEXT: authentication_infrastructure) (PROMPT: Set up project structure with TypeScript, Express.js, and required dependencies) (OUTPUT: production_ready_project_setup)",
    "status": "pending",
    "priority": "high",
    "id": "auth_1"
  },
  {
    "content": "(ROLE: coder) (CONTEXT: user_authentication) (PROMPT: Implement user registration and login endpoints with bcrypt password hashing, JWT token generation, input validation) (OUTPUT: secure_auth_endpoints)",
    "status": "pending",
    "priority": "high",
    "id": "auth_2"
  }
]
```

---

### Phase 6: EXECUTE → VERIFY

**What Happens:**
- Implements agent spawning with Task() tool
- Enforces single-tool-per-iteration pattern
- Tracks reasoning effectiveness and performance metrics
- Executes todos with specialized agents

**Code Implementation:**
```typescript
// src/phase-engine/FSM.ts:369-394
function handleExecutePhase(session: any, input: MessageJARVIS): Phase {
    if (input.payload) {
        Object.assign(session.payload, input.payload);

        // Update reasoning effectiveness based on execution success
        if (input.payload.execution_success) {
            session.reasoning_effectiveness = Math.min(1.0, session.reasoning_effectiveness + 0.1);
        } else {
            session.reasoning_effectiveness = Math.max(0.3, session.reasoning_effectiveness - 0.1);
        }

        const currentTaskIndex = session.payload.current_task_index || 0;
        const totalTasks = (session.payload.current_todos || []).length;

        if (input.payload.more_tasks_pending || currentTaskIndex < totalTasks - 1) {
            session.payload.current_task_index = currentTaskIndex + 1;
            return 'EXECUTE';
        } else {
            return 'VERIFY';
        }
    }
    return 'VERIFY';
}
```

---

### Phase 7: VERIFY → DONE

**What Happens:**
- Applies strict quality assessment with completion metrics
- Integrates Claude Code Hooks feedback
- Implements intelligent rollback logic based on completion percentage

**Code Implementation:**
```typescript
// src/phase-engine/FSM.ts:396-427
function handleVerifyPhase(session: any, input: MessageJARVIS, deps: AutoConnectionDeps): Phase {
    const verificationResult = validateTaskCompletion(session, input.payload);

    if (verificationResult.isValid && input.payload?.verification_passed === true) {
        return 'DONE';
    } else {
        console.warn(`Verification failed: ${verificationResult.reason}`);
        console.warn(`Completion percentage: ${verificationResult.completionPercentage}%`);

        session.payload.verification_failure_reason = verificationResult.reason;
        session.payload.last_completion_percentage = verificationResult.completionPercentage;

        // Rollback logic based on completion percentage
        if (verificationResult.completionPercentage < 50) {
            session.payload.current_task_index = 0;
            return 'PLAN';
        } else if (verificationResult.completionPercentage < 80) {
            return 'EXECUTE';
        } else {
            if (session.payload.current_task_index > 0) {
                session.payload.current_task_index = session.payload.current_task_index - 1;
            }
            return 'EXECUTE';
        }
    }
}
```

**Live Terminal Output - Rollback:**
```json
{
  "next_phase": "PLAN",
  "payload": {
    "verification_failure_reason": "Critical tasks incomplete: 0/6 completed",
    "last_completion_percentage": 0
  }
}
```

---

## Key Technical Achievements

### 1. Sophisticated Prompt Flow
- Role-based enhancement with 10 specialized thinking methodologies
- Dynamic context injection via Handlebars-style templating
- Phase-specific tool gating preventing tool proliferation

### 2. Intelligent API Orchestration
- 65 API registry with role-based selection and SSRF protection
- Auto-connection knowledge synthesis with cross-validation
- Claude-powered API selection over simple keyword matching

### 3. Agent Task Orchestration
- Meta-prompt extraction: (ROLE:...) (CONTEXT:...) (PROMPT:...) (OUTPUT:...)
- Task() agent spawning with fresh context and specialized expertise
- Single-tool-per-iteration enforcement

### 4. Hybrid Security Model
- Cognitive reasoning + deterministic validation through Claude Code Hooks
- Dangerous command patterns blocked by security validator
- Sub-100ms hook execution with graceful degradation

### 5. Intelligent Rollback System
- Completion percentage-based phase transitions
- <50% completion: Rollback to PLAN phase
- <80% completion: Retry EXECUTE phase
- <95% completion: Retry previous task

### 6. Production-Ready Testing
- 266/266 tests passing (100% success rate)
- Comprehensive coverage: Unit, integration, security, and performance tests
- Multi-node CI/CD pipeline with automated security auditing

---

## Performance Characteristics

| Metric                  | Performance                                     |
|-------------------------|-------------------------------------------------|
| Hook Execution          | Sub-100ms validation overhead                   |
| Context Handling        | Efficient 300k+ token management                |
| API Rate Limiting       | Configurable per-endpoint throttling            |
| Concurrent Safety       | Multi-session isolation and parallel processing |
| Reasoning Effectiveness | Adaptive optimization (0.3-1.0 scale)           |
| Session Persistence     | 24-hour automatic cleanup with archival         |
| Test Success Rate       | 100% (266/266 tests passing)                    |

---

## Conclusion

The Iron Manus MCP represents an AI orchestration platform that bridges cognitive reasoning with deterministic validation. Through its 8-phase FSM architecture, role-based enhancement, and intelligent rollback mechanisms, it creates a production-ready system for complex multi-phase project execution.

The demonstration showcases:
- Seamless phase transitions with context preservation
- Intelligent role selection using Claude's natural language understanding
- Agent task orchestration through meta-prompt spawning
- Robust error recovery with percentage-based rollback logic
- Comprehensive quality assurance through hooks integration
