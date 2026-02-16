# Iron Manus MCP Workflow Phases

## Phase Sequence

```
INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE
```

## Phase Descriptions

### Phase 1: INIT

**What Happens:**
- Auto-generates session ID
- Initializes FSM state
- Triggers role detection
- Transitions immediately to QUERY

**Code:**
```typescript
if (input.initial_objective) {
    session.initial_objective = input.initial_objective;
    session.detected_role = detectRole(input.initial_objective);
    session.current_phase = 'INIT';
    session.payload = {
        current_task_index: 0,
        current_todos: [],
        phase_transition_count: 0,
        awaiting_role_selection: true,
    };
}
```

### Phase 2: QUERY

**What Happens:**
- Analyzes user's objective
- Identifies core requirements and constraints
- Selects appropriate role for the task
- Stores interpreted goal

**Prompt Template:**
```
You are analyzing the user's objective and initializing the project workflow.

Think through your analysis approach:
- What is the user really asking for at its core?
- What are the key requirements and constraints?
- What type of task is this (research, coding, deployment, etc.)?

After role considerations:
1. Parse the user's goal and identify key requirements
2. Clarify any ambiguous aspects
3. Call JARVIS with phase_completed: 'QUERY'
```

### Phase 3: ENHANCE

**What Happens:**
- Applies role-specific thinking methodology
- Enhances goal with technical details
- Identifies edge cases and dependencies
- Prepares for knowledge gathering

**Prompt Template:**
```
Think through how to enhance and refine the interpreted goal:
- What important details might be missing?
- What edge cases or implicit requirements should be considered?
- What information, resources, or tools will be needed?
- What potential challenges or dependencies might arise?
```

### Phase 4: KNOWLEDGE

**What Happens:**
- Gathers needed information (research, documentation, data)
- Uses APITaskAgent for structured data research
- Uses PythonComputationalTool for data analysis
- Uses WebSearch/WebFetch for general research
- Skips if no research needed

**Available Tools:**
- WebSearch
- WebFetch
- APITaskAgent
- PythonComputationalTool
- Task

**Prompt Template:**
```
AUTO-CONNECTION ACTIVE: The system can automatically discover, fetch, and synthesize knowledge from relevant APIs.

AVAILABLE RESEARCH TOOLS:
- APITaskAgent for structured API research workflows
- PythonComputationalTool for data processing and analysis
- WebSearch/WebFetch for general web research
- Task agents for specialized research domains

Decide if you need external information. If not, call JARVIS with phase_completed: 'KNOWLEDGE'.
```

### Phase 5: PLAN

**What Happens:**
- Breaks work into manageable tasks
- Creates meta-prompts for complex work requiring specialized agents
- Uses TodoWrite to create structured task list

**Prompt Template:**
```
Think strategically about how to break down this goal:
- What is the optimal task breakdown strategy?
- Which tasks require specialized Task() agent expertise vs direct execution?
- What are the dependencies and sequencing?
- What complexity challenges might arise?

AGENT SPAWNING: Mark todos that should spawn Task() agents:
Format: "(ROLE: agent_type) (CONTEXT: domain_info) (PROMPT: detailed_instructions) (OUTPUT: deliverables)"
```

**Example Todo List:**
```json
[
  {
    "content": "(ROLE: coder) (CONTEXT: auth_infrastructure) (PROMPT: Set up project structure) (OUTPUT: project_setup)",
    "status": "pending",
    "priority": "high"
  },
  {
    "content": "(ROLE: coder) (CONTEXT: user_auth) (PROMPT: Implement JWT auth) (OUTPUT: auth_endpoints)",
    "status": "pending",
    "priority": "high"
  }
]
```

### Phase 6: EXECUTE

**What Happens:**
- Iterates through tasks one by one
- Direct execution for simple tasks (Bash, Read, Write, Edit)
- Uses PythonComputationalTool for Python operations
- Spawns Task() agents for meta-prompted tasks
- Single tool per iteration

**Prompt Template:**
```
EXECUTION CONTEXT:
- Current Task Index: {{index}}
- Total Tasks: {{total}}
- Current Task: {{current_todo}}

EXECUTION PROTOCOL:
1. Check todo for meta-prompt patterns (ROLE:...)
2. If meta-prompt → use Task() tool to spawn specialized agent
3. If direct execution → use Bash/Browser/Read/Write/Edit
4. **Single tool per iteration**

Task() Tool Usage:
When you see a todo formatted as "(ROLE: agent_type) (CONTEXT: domain) (PROMPT: instructions) (OUTPUT: deliverable)", convert it to Task() tool with enhanced prompts.
```

### Phase 7: VERIFY

**What Happens:**
- Mathematical validation (completion percentage)
- Intelligent rollback if completion insufficient
- Quality assessment and final checks
- Integration of Claude Code Hooks feedback

**Rollback Logic:**
```typescript
if (completionPercentage < 50) {
    // Severe incompletion - restart from planning
    return 'PLAN';
} else if (completionPercentage < 80) {
    // Moderate incompletion - retry from current task
    return 'EXECUTE';
} else {
    // Minor incompletion - retry previous task
    return 'EXECUTE';
}
```

**Prompt Template:**
```
Think critically about the quality and completeness of the work:
- How do the actual deliverables compare to the original objective?
- Have all requirements been met?
- What gaps or improvements might be needed?

VERIFICATION REQUIREMENTS:
- Critical tasks must be 100% complete
- Overall completion must be >= 95%
- verification_passed=true requires backing metrics
```

### Phase 8: DONE

**What Happens:**
- Task completion summary
- Performance metrics and session data
- System enters standby mode

**Prompt Template:**
```
Task completed successfully. Entering standby mode.

Provide a summary of:
- What was accomplished
- Key deliverables
- Any remaining considerations
```

## Agent Spawning Details

When a todo contains a meta-prompt pattern, the system extracts it:

```typescript
const roleMatch = todoContent.match(/\(ROLE:\s*([^)]+)\)/i);
const contextMatch = todoContent.match(/\(CONTEXT:\s*([^)]+)\)/i);
const promptMatch = todoContent.match(/\(PROMPT:\s*([^)]+)\)/i);
const outputMatch = todoContent.match(/\(OUTPUT:\s*([^)]+)\)/i);
```

And spawns a Task() agent with role-enhanced prompts including thinking methodologies.

## Session Data Flow

Each phase expects specific data in `session.payload`:

| Phase | Required Payload Fields |
|-------|------------------------|
| QUERY | `interpreted_goal`, `claude_response` (role selection) |
| ENHANCE | `enhanced_goal` |
| KNOWLEDGE | `knowledge_gathered`, `synthesized_knowledge` |
| PLAN | `plan_created`, `todos_with_metaprompts` |
| EXECUTE | `execution_success`, `task_results` |
| VERIFY | `verification_passed`, `completion_percentage` |
