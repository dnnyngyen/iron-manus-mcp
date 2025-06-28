# Iron Manus MCP Meta Thread-of-Thought Orchestration: Complete Chronological Breakdown

**Note:** This document shows the detailed phase-by-phase breakdown of how Meta Thread-of-Thought orchestration works in practice, demonstrating context segmentation and agent spawning patterns.

  Initial Invocation

  Natural Language: User asks for analysis of the Iron Manus codebase architecture
  MCP Server: Receives initial call with session_id and initial_objective
  Code Execution (src/index.ts:31):
  const result = await toolRegistry.executeTool(name, args);

  FSM Logic (src/core/fsm.ts:109-121):
  if (input.initial_objective) {
    session.initial_objective = input.initial_objective;
    session.detected_role = detectEnhancedRole(input.initial_objective); // Enhanced AST-based role detection
    session.current_phase = 'INIT';
    session.reasoning_effectiveness = 0.8; // Initial effectiveness score
  }

  What I See: Raw system prompt directing me to QUERY phase
  What I Do: Automatically transition to QUERY phase per FSM logic

  ---
  Phase 1: QUERY - "Analyze Events"

  Natural Language: I need to understand what the user is really asking for
  MCP Server: Phase transitions from INIT→QUERY (src/core/fsm.ts:128-130)
  System Prompt (src/core/prompts.ts:194-210):
  Think through your analysis approach before proceeding. Consider:
  - What is the user really asking for at its core?
  - What are the key requirements and constraints?
  - Are there any ambiguities that need clarification?

  Cognitive Enhancement (src/core/prompts.ts:184-189):
  **🧠 COGNITIVE ENHANCEMENT (2.7x effectiveness):**
  Strategic Architecture Planning, Hierarchical Decomposition

  **🎯 ROLE-SPECIFIC FOCUS:** systematic_planning
  **📊 QUALITY THRESHOLD:** STRATEGIZE_AND_COORDINATE

  Tool Constraint (src/core/prompts.ts:582): QUERY: ['JARVIS']

  What I See: "Think through your analysis approach" + role-specific cognitive enhancement
  What I Do: I analyze the objective, detect it's a technical evaluation task, identify the primary role as "analyzer"
  Tool Call: JARVIS with phase_completed: 'QUERY' and payload: {interpreted_goal: "Conduct comprehensive architectural analysis..."}

  MCP Server Response (src/core/fsm.ts:133-140):
  if (input.phase_completed === 'QUERY') {
    if (input.payload?.interpreted_goal) {
      session.payload.interpreted_goal = input.payload.interpreted_goal;
    }
    nextPhase = 'ENHANCE';
  }

  ---
  Phase 2: ENHANCE - "Select Tools"

  Natural Language: I need to refine and enhance the interpreted goal
  MCP Server: Phase transitions QUERY→ENHANCE with interpreted goal stored
  System Prompt (src/core/prompts.ts:595-596):
  Think through enhancement opportunities, then call JARVIS with phase_completed: "ENHANCE"

  Context Injection (src/core/fsm.ts:319-320):
  if (nextPhase === 'ENHANCE' && session.payload.interpreted_goal) {
    augmentedPrompt += `\n\n**📋 CONTEXT:** ${session.payload.interpreted_goal}`;
  }

  What I See: Enhanced prompt with context from previous phase + cognitive enhancement
  What I Do: I take the interpreted goal and add missing details, edge cases, technical constraints
  Tool Call: JARVIS with phase_completed: 'ENHANCE' and payload: {enhanced_goal: "Comprehensive architectural quality assessment..."}

  MCP Server Response (src/core/fsm.ts:143-150):
  if (input.phase_completed === 'ENHANCE') {
    if (input.payload?.enhanced_goal) {
      session.payload.enhanced_goal = input.payload.enhanced_goal;
    }
    nextPhase = 'KNOWLEDGE';
  }

  ---
  Phase 3: KNOWLEDGE - "Wait for Execution"

  Natural Language: I need to assess if I need external information
  MCP Server: Phase transitions ENHANCE→KNOWLEDGE with enhanced goal stored
  System Prompt (src/core/prompts.ts:597):
  Think through knowledge needs, then choose: WebSearch/WebFetch (research), mcp__ide__executeCode (data processing), JARVIS (skip research)

  Tool Constraint (src/core/prompts.ts:585): KNOWLEDGE: ['WebSearch', 'WebFetch', 'mcp__ide__executeCode', 'JARVIS']

  What I See: First phase where I have tool choice, but bounded to specific whitelist
  What I Do: I evaluate my domain knowledge, determine I have sufficient TypeScript/Node.js expertise, decide no external research needed
  Tool Call: JARVIS with phase_completed: 'KNOWLEDGE' and payload: {knowledge_gathered: "Sufficient domain knowledge available..."}

  MCP Server Response (src/core/fsm.ts:152-159):
  if (input.phase_completed === 'KNOWLEDGE') {
    if (input.payload?.knowledge_gathered) {
      session.payload.knowledge_gathered = input.payload.knowledge_gathered;
    }
    nextPhase = 'PLAN';
  }

  ---
  Phase 4: PLAN - "Iterate"

  Natural Language: I need to break down the enhanced goal into actionable steps
  MCP Server: Phase transitions KNOWLEDGE→PLAN with knowledge assessment stored
  System Prompt (src/core/prompts.ts:598):
  Think through strategic planning, then use TodoWrite to create todos, then call JARVIS with phase_completed: "PLAN"

  Fractal Orchestration Guidance (src/core/fsm.ts:322-323):
  augmentedPrompt += `\n\n**🔄 FRACTAL ORCHESTRATION GUIDE:**\nFor complex sub-tasks that need specialized expertise, create todos with this format:\n"(ROLE: coder) 
  (CONTEXT: authentication_system) (PROMPT: Implement secure JWT authentication with password reset) (OUTPUT: production_ready_code)"\n\nThis enables Task() agent 
  spawning in the EXECUTE phase.`;

  Tool Constraint (src/core/prompts.ts:586): PLAN: ['TodoWrite']

  What I See: Strategic planning prompt + fractal orchestration guide for meta-prompt injection
  What I Do: I create structured todos, some with embedded meta-prompts for Task() agent spawning:
  - Simple todos: "Analyze root src directory structure"
  - Complex todos: "(ROLE: analyzer) (CONTEXT: typescript_codebase_evaluation) (PROMPT: Examine all TypeScript files...) (OUTPUT: code_quality_technical_report)"
  - UI todos: "(ROLE: ui_architect) (CONTEXT: component_system) (PROMPT: Design component architecture...) (OUTPUT: ui_design_system)"

  Tool Call: TodoWrite with structured todo list
  Then: JARVIS with phase_completed: 'PLAN' and payload: {plan_created: true}

  MCP Server Response (src/core/fsm.ts:162-188):
  if (input.phase_completed === 'PLAN') {
    if (input.payload?.plan_created) {
      // Process todos with enhanced AST-based MetaPrompt extraction
      const rawTodos = input.payload.todos_with_metaprompts || [];
      const enhancedResults = extractEnhancedMetaPrompts(rawTodos, {...});
      session.payload.current_todos = enhancedResults.map(result => result.todo);
      session.payload.current_task_index = 0;
    }
    nextPhase = 'EXECUTE';
  }

  ---
  Phase 5: EXECUTE - "Submit Results" (Fractal Iteration)

  Natural Language: I need to execute tasks from the todo list
  MCP Server: Phase transitions PLAN→EXECUTE with todos parsed and meta-prompts extracted
  System Prompt (src/core/prompts.ts:599):
  Think through execution approach, then choose: TodoRead (check todos), Task (spawn agent), Bash/Browser (direct execution), mcp__ide__executeCode (Python
  analysis/computation)

  Execution Context (src/core/fsm.ts:324-332):
  const currentTaskIndex = session.payload.current_task_index || 0;
  const currentTodos = session.payload.current_todos || [];
  const currentTodo = currentTodos[currentTaskIndex];

  augmentedPrompt += `\n\n**📊 EXECUTION CONTEXT:**\n- Current Task Index: ${currentTaskIndex}\n- Total Tasks: ${currentTodos.length}\n- Current Task: ${currentTodo 
  || 'None'}\n- Reasoning Effectiveness: ${(session.reasoning_effectiveness * 100).toFixed(1)}%`;

  Fractal Execution Protocol (src/core/fsm.ts:331-332):
  augmentedPrompt += `\n\n**🔄 FRACTAL EXECUTION PROTOCOL:**\n1. Check current todo (index ${currentTaskIndex}) for meta-prompt patterns\n2. If todo contains 
  (ROLE:...) pattern, use Task() tool to spawn specialized agent\n3. If todo is direct execution, use appropriate tools (Bash/Browser/etc.)\n4. After each action, 
  report results back\n\n**⚡ SINGLE TOOL PER ITERATION:** Choose ONE tool call per turn (Manus requirement).`;

  What I See: Execution context showing current task index, fractal execution protocol, single-tool constraint
  What I Do:
  - Iteration 1: LS to examine directory structure (direct execution)
  - Iteration 2: TodoWrite to mark task complete, update status
  - Iteration 3: JARVIS to report execution results

  MCP Server Response (src/core/fsm.ts:191-217):
  if (input.phase_completed === 'EXECUTE') {
    Object.assign(session.payload, input.payload);

    // Check if there are more tasks to execute (fractal iteration)
    const currentTaskIndex = session.payload.current_task_index || 0;
    const totalTasks = (session.payload.current_todos || []).length;

    if (input.payload.more_tasks_pending || currentTaskIndex < totalTasks - 1) {
      session.payload.current_task_index = currentTaskIndex + 1;
      nextPhase = 'EXECUTE'; // Continue in EXECUTE phase
    } else {
      nextPhase = 'VERIFY'; // All tasks done, move to verification
    }
  }

  Fractal Iteration: The system can spawn Task() agents for complex todos with meta-prompts, which themselves can create sub-todos and spawn sub-agents.

  ---
  Phase 6: VERIFY - "Enter Standby"

  Natural Language: I need to verify task completion and quality
  MCP Server: Phase transitions EXECUTE→VERIFY when all tasks complete
  System Prompt (src/core/prompts.ts:600):
  Think through quality assessment, then choose: TodoRead (check completion), Read (verify output), mcp__ide__executeCode (analytical verification)

  Verification Context (src/core/fsm.ts:333-350):
  const todos = session.payload.current_todos || [];
  const taskBreakdown = calculateTaskBreakdown(todos);
  const completionPercentage = calculateCompletionPercentage(taskBreakdown);

  augmentedPrompt += `\n\n**✅ VERIFICATION CONTEXT:**\n- Original Objective: ${session.initial_objective}\n- Final Reasoning Effectiveness: 
  ${(session.reasoning_effectiveness * 100).toFixed(1)}%`;
  augmentedPrompt += `\n\n**📊 COMPLETION METRICS:**\n- Overall Completion: ${completionPercentage}% (${taskBreakdown.completed}/${taskBreakdown.total} tasks)`;
  augmentedPrompt += `\n\n**⚠️ VERIFICATION REQUIREMENTS:**\n- Critical tasks must be 100% complete\n- Overall completion must be ≥95%\n- No high-priority tasks can 
  remain pending`;

  What I See: Verification context with completion metrics and strict requirements
  What I Do: I assess the work against original objective, check completion status
  Tool Call: JARVIS with phase_completed: 'VERIFY' and payload: {verification_passed: true/false}

  MCP Server Validation (src/core/fsm.ts:220-253):
  if (input.phase_completed === 'VERIFY') {
    const verificationResult = validateTaskCompletion(session, input.payload);

    if (verificationResult.isValid && input.payload?.verification_passed === true) {
      nextPhase = 'DONE';
    } else {
      // Rollback logic based on completion percentage
      if (verificationResult.completionPercentage < 50) {
        nextPhase = 'PLAN'; // Severe incompletion - restart from planning
      } else if (verificationResult.completionPercentage < 80) {
        nextPhase = 'EXECUTE'; // Moderate incompletion - retry execution
      }
    }
  }

  Validation Rules (src/core/fsm.ts:467-500):
  // Rule 1: 100% critical task completion required
  if (criticalTasks.length > 0 && criticalTasksCompleted < criticalTasks.length) {
    result.reason = `Critical tasks incomplete: ${criticalTasksCompleted}/${criticalTasks.length} completed`;
    return result;
  }

  // Rule 2: Minimum 95% overall completion
  if (completionPercentage < 95) {
    result.reason = `Overall completion ${completionPercentage}% below required threshold of 95%`;
    return result;
  }

  ---
  Phase 7: DONE - "Enter Standby"

  Natural Language: Mission accomplished, all phases complete
  MCP Server: Phase transitions VERIFY→DONE when validation passes
  System Prompt: Final status report with performance metrics
  Tool Constraint (src/core/prompts.ts:589): DONE: [] - No tools needed

  Final Response (src/index.ts:80-87):
  if (output.status === 'DONE') {
    responseText += `## ✅ **MISSION ACCOMPLISHED!**\n\n`;
    responseText += `**🎯 Objective**: ${output.payload?.current_objective}\n`;
    responseText += `**🤖 Role Applied**: ${output.payload?.detected_role}\n`;
    responseText += `**📊 Final Effectiveness**: ${((output.payload?.reasoning_effectiveness || 0.8) * 100).toFixed(1)}%\n`;
  }

  What I See: Mission accomplished status with performance summary
  What I Do: Enter standby mode, await new objectives

  ---
  The Elegant Loop: Natural Reasoning with Systematic Guidance

  The system creates a beautiful dance between natural reasoning and systematic framework guidance:

  1. Natural Thinking: Each phase begins with "Think through..." guidance
  2. Thinking Methodologies: Role-specific thinking frameworks improve reasoning quality
  3. Tool Guidance: Bounded choice provides structure while preserving autonomy
  4. State Persistence: All reasoning captured and carried forward
  5. Fractal Delegation: Complex tasks spawn specialized agents (including UI agents)
  6. Systematic Validation: Clear completion criteria with intelligent workflow guidance

  The elegance lies in how it enhances Claude's natural strengths with systematic frameworks that provide structure while preserving full reasoning autonomy.