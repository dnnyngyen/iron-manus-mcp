# Iron Manus MCP Meta Thread-of-Thought Orchestration: Complete Chronological Breakdown

**Note:** This document shows the detailed phase-by-phase breakdown of how Meta Thread-of-Thought orchestration works in practice, demonstrating context segmentation and agent spawning patterns.

  Initial Invocation

  Natural Language: User asks for analysis of the Iron Manus codebase architecture
  MCP Server: Receives initial call with session_id and initial_objective. The system initializes the session and automatically transitions to the INIT phase.

  ---
  Phase 0: INIT - "System Initialization"

  Natural Language: System automatically initializes the session
  MCP Server: Sets up session state, detects role, and initializes the FSM. This phase immediately transitions to the QUERY phase.

  ---
  Phase 1: QUERY - "Analyze Events"

  Natural Language: I need to understand what the user is really asking for
  MCP Server: Phase transitions from INIT→QUERY. For detailed prompt and purpose, refer to [PROMPTS.md](./PROMPTS.md).
  Tool Call: JARVIS with phase_completed: 'QUERY' and payload: {interpreted_goal: "Conduct comprehensive architectural analysis..."}

  ---
  Phase 2: ENHANCE - "Select Tools"

  Natural Language: I need to refine and enhance the interpreted goal
  MCP Server: Phase transitions QUERY→ENHANCE with interpreted goal stored. For detailed prompt and purpose, refer to [PROMPTS.md](./PROMPTS.md).
  Tool Call: JARVIS with phase_completed: 'ENHANCE' and payload: {enhanced_goal: "Comprehensive architectural quality assessment..."}

  ---
  Phase 3: KNOWLEDGE - "Wait for Execution"

  Natural Language: I need to assess if I need external information
  MCP Server: Phase transitions ENHANCE→KNOWLEDGE with enhanced goal stored. For detailed prompt and purpose, refer to [PROMPTS.md](./PROMPTS.md).
  Tool Call: JARVIS with phase_completed: 'KNOWLEDGE' and payload: {knowledge_gathered: "Sufficient domain knowledge available..."}

  ---
  Phase 4: PLAN - "Iterate"

  Natural Language: I need to break down the enhanced goal into actionable steps
  MCP Server: Phase transitions KNOWLEDGE→PLAN with knowledge assessment stored. For detailed prompt and purpose, refer to [PROMPTS.md](./PROMPTS.md).
  Tool Call: TodoWrite with structured todo list
  Then: JARVIS with phase_completed: 'PLAN' and payload: {plan_created: true}

  ---
  Phase 5: EXECUTE - "Submit Results" (Fractal Iteration)

  Natural Language: I need to execute tasks from the todo list
  MCP Server: Phase transitions PLAN→EXECUTE with todos parsed and meta-prompts extracted. For detailed prompt and purpose, refer to [PROMPTS.md](./PROMPTS.md).
  Fractal Iteration: The system can spawn Task() agents for complex todos with meta-prompts, which themselves can create sub-todos and spawn sub-agents.

  ---
  Phase 6: VERIFY - "Enter Standby"

  Natural Language: I need to verify task completion and quality
  MCP Server: Phase transitions EXECUTE→VERIFY when all tasks complete. For detailed prompt and purpose, refer to [PROMPTS.md](./PROMPTS.md).
  Tool Call: JARVIS with phase_completed: 'VERIFY' and payload: {verification_passed: true/false}

  ---
  Phase 7: DONE - "Enter Standby"

  Natural Language: Mission accomplished, all phases complete
  MCP Server: Phase transitions VERIFY→DONE when validation passes. For detailed prompt and purpose, refer to [PROMPTS.md](./PROMPTS.md).

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