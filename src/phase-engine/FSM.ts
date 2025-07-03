/**
 * @fileoverview FSM Engine - Core 8-phase finite state machine implementation
 * 
 * This file contains the main FSM engine that orchestrates the 8-phase agent loop:
 * INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE
 * 
 * The engine provides:
 * - Phase transition management with strict state validation
 * - Role-based cognitive enhancement through intelligent role detection
 * - Auto-connection API orchestration for knowledge gathering
 * - Fractal task decomposition with meta-prompt extraction
 * - Session state management with graph-based persistence
 * - Performance tracking and reasoning effectiveness optimization
 * 
 * Key architectural patterns:
 * - Pure function design with dependency injection
 * - Immutable state transitions with validation
 * - Composable phase handlers with standardized interfaces
 * - Error recovery mechanisms with graceful degradation
 * 
 * @version 2.0.0
 * @since 1.0.0
 */

import {
  MessageJARVIS,
  FromJARVIS,
  Phase,
  Role,
  MetaPrompt,
  ComplexityLevel,
  APIUsageMetrics,
} from '../core/types.js';
import {
  
  tokenBudgetOkay,
  detectFractalDelegation,
  recordCognitiveLoad,
  KnowledgePhaseResult,
  AutoConnectionDeps,
} from './helpers.js';
import {
  generateRoleEnhancedPrompt,
  detectRole,
  generateRoleSelectionPrompt,
  parseClaudeRoleSelection,
  PHASE_ALLOWED_TOOLS,
} from '../core/prompts.js';
import { graphStateManager } from '../core/graph-state-adapter.js';
import {
  selectRelevantAPIs,
  generateAPISelectionPrompt,
  parseClaudeAPISelection,
  SAMPLE_API_REGISTRY,
} from '../core/api-registry.js';
import {
  autoFetchAPIs,
  autoSynthesize,
  AUTO_CONNECTION_CONFIG,
} from '../knowledge/autoConnection.js';
import {
  validateTaskCompletion,
  calculateTaskBreakdown,
  calculateCompletionPercentage,
} from '../verification/metrics.js';
import { CONFIG } from '../config.js';

/**
 * Creates a finite state machine instance with dependency injection
 * 
 * Factory function that creates an FSM instance with injected dependencies for
 * auto-connection, API orchestration, and knowledge synthesis. Returns a configured
 * FSM interface with core processing functions.
 * 
 * @param deps - Auto-connection dependencies for API orchestration
 * @param deps.autoConnection - Function for automatic API knowledge gathering
 * @param deps.apiSearch - Function for intelligent API discovery
 * @param deps.validator - Function for API endpoint validation
 * @returns FSM instance with processing methods
 * 
 * @example
 * ```typescript
 * const fsm = createFSM({
 *   autoConnection: async (objective) => ({ answer: "...", confidence: 0.8 }),
 *   apiSearch: async (query) => [{ name: "API", url: "..." }],
 *   validator: async (endpoint) => ({ valid: true })
 * });
 * ```
 */
export function createFSM(deps: AutoConnectionDeps) {
  return {
    processState: (input: MessageJARVIS) => processState(input, deps),
    extractMetaPromptFromTodo,
    // extractEnhancedMetaPromptFromTodo removed - use extractMetaPromptFromTodo
    updateReasoningEffectiveness,
  };
}

/**
 * Core FSM state processing function - orchestrates the 8-phase agent loop
 * 
 * This is the main entry point for FSM processing that handles:
 * - Session initialization and role detection
 * - Phase transition logic with strict validation
 * - State persistence and error recovery
 * - System prompt generation with role enhancement
 * - Tool permission management per phase
 * 
 * The function implements the complete 8-phase loop:
 * INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE
 * 
 * @param input - Incoming message from JARVIS with phase completion data
 * @param deps - Injected dependencies for auto-connection and API orchestration
 * @returns Promise resolving to FSM response with next phase and system prompt
 * 
 * @throws {Error} When session state is corrupted or phase transition fails
 * 
 * @example
 * ```typescript
 * const result = await processState({
 *   session_id: "abc123",
 *   initial_objective: "Build a web app",
 *   phase_completed: "QUERY",
 *   payload: { interpreted_goal: "Create React app" }
 * }, deps);
 * ```
 */
export async function processState(
  input: MessageJARVIS,
  deps: AutoConnectionDeps
): Promise<FromJARVIS> {
  const sessionId = input.session_id;
  const session = graphStateManager.getSessionState(sessionId);

  // Handle initial objective setup with Claude-powered role detection
  if (input.initial_objective) {
    session.initial_objective = input.initial_objective;

    // Generate role selection prompt for Claude instead of hardcoded detection
    const roleSelectionPrompt = generateRoleSelectionPrompt(input.initial_objective);

    // Set temporary role as fallback, but request Claude selection
    session.detected_role = detectRole(input.initial_objective);
    session.current_phase = 'INIT';
    session.reasoning_effectiveness = CONFIG.INITIAL_REASONING_EFFECTIVENESS;

    // Initialize payload with execution state and role selection request
    session.payload = {
      current_task_index: 0,
      current_todos: [],
      phase_transition_count: 0,
      role_selection_prompt: roleSelectionPrompt,
      awaiting_role_selection: true,
    };
    graphStateManager.updateSessionState(sessionId, session);
  }

  // Determine next phase based on current phase and completed phase
  let nextPhase: Phase = session.current_phase;

  // Phase transition logic - mirrors Manus's 8-step agent loop
  switch (session.current_phase) {
    case 'INIT':
      nextPhase = 'QUERY';
      break;

    case 'QUERY':
      if (input.phase_completed === 'QUERY') {
        // Check if Claude provided role selection response
        if (session.payload.awaiting_role_selection && input.payload?.claude_response) {
          try {
            // Parse Claude's role selection
            const claudeSelectedRole = parseClaudeRoleSelection(
              input.payload.claude_response,
              session.initial_objective || ''
            );

            // Update session with Claude's intelligent role selection
            session.detected_role = claudeSelectedRole;
            session.payload.awaiting_role_selection = false;

            console.log(`SUCCESS Claude selected role: ${claudeSelectedRole}`);
          } catch (error) {
            console.error('Error processing Claude role selection:', error);
            // Fall back to hardcoded role detection
            session.payload.awaiting_role_selection = false;
          }
        }

        // Store interpreted goal and move to enhancement
        if (input.payload?.interpreted_goal) {
          session.payload.interpreted_goal = input.payload.interpreted_goal;
        }
        nextPhase = 'ENHANCE';
      }
      break;

    case 'ENHANCE':
      if (input.phase_completed === 'ENHANCE') {
        // Store enhanced goal and move to knowledge gathering
        if (input.payload?.enhanced_goal) {
          session.payload.enhanced_goal = input.payload.enhanced_goal;
        }
        nextPhase = 'KNOWLEDGE';
      }
      break;

    case 'KNOWLEDGE':
      if (input.phase_completed === 'KNOWLEDGE') {
        // Handle knowledge phase with auto-connection
        await handleKnowledgePhase(session, input, deps);
        nextPhase = 'PLAN';
      }
      break;

    case 'PLAN':
      if (input.phase_completed === 'PLAN') {
        // Confirm plan created and move to execution
        if (input.payload?.plan_created) {
          session.payload.plan_created = true;
          // Process todos using proven regex-based extraction
          const rawTodos = input.payload.todos_with_metaprompts || [];
          if (rawTodos.length > 0) {
            // Store todos directly - meta-prompt extraction happens during execution
            session.payload.current_todos = rawTodos;
          } else {
            session.payload.current_todos = [];
          }
          session.payload.current_task_index = 0;
        }
        nextPhase = 'EXECUTE';
      }
      break;

    case 'EXECUTE':
      if (input.phase_completed === 'EXECUTE') {
        nextPhase = handleExecutePhase(session, input);
      }
      break;

    case 'VERIFY':
      if (input.phase_completed === 'VERIFY') {
        nextPhase = handleVerifyPhase(session, input, deps);
      }
      break;

    case 'DONE':
      // Stay in DONE state
      nextPhase = 'DONE';
      break;

    default:
      // Fallback to QUERY if unknown state
      nextPhase = 'QUERY';
  }

  // Update session with new phase
  session.current_phase = nextPhase;
  graphStateManager.updateSessionState(sessionId, session);

  // Generate enhanced system prompt
  const augmentedPrompt = generateSystemPrompt(session, nextPhase, input);
  const allowedTools = PHASE_ALLOWED_TOOLS[nextPhase];

  // Determine status
  const status = nextPhase === 'DONE' ? 'DONE' : 'IN_PROGRESS';

  const output: FromJARVIS = {
    next_phase: nextPhase,
    system_prompt: augmentedPrompt,
    allowed_next_tools: allowedTools,
    payload: {
      session_id: sessionId,
      current_objective: session.initial_objective,
      detected_role: session.detected_role,
      reasoning_effectiveness: session.reasoning_effectiveness,
      phase_transition_count: (session.payload.phase_transition_count || 0) + 1,
      ...session.payload,
    },
    status,
  };

  return output;
}

/**
 * Handles the KNOWLEDGE phase processing with multi-modal knowledge gathering
 * 
 * This function orchestrates knowledge acquisition through multiple pathways:
 * 1. Agent synthesis from pre-existing knowledge files
 * 2. Claude-powered API selection and auto-connection
 * 3. Fallback to manual research tools
 * 
 * The function prioritizes agent synthesis results when available, falling back
 * to API auto-connection and finally to manual research tool recommendations.
 * 
 * @param session - Current session state with payload and configuration
 * @param input - JARVIS input message with knowledge phase completion data
 * @param deps - Auto-connection dependencies for API orchestration
 * 
 * @throws {Error} When session workspace cannot be created or accessed
 * 
 * @example
 * ```typescript
 * await handleKnowledgePhase(session, {
 *   session_id: "abc123",
 *   phase_completed: "KNOWLEDGE",
 *   payload: { knowledge_gathered: "Research results..." }
 * }, deps);
 * ```
 */
async function handleKnowledgePhase(session: any, input: MessageJARVIS, deps: AutoConnectionDeps) {
  // Initialize session workspace for agent communication
  const sessionId = input.session_id;
  const sessionWorkspace = `./iron-manus-sessions/${sessionId}`;

  // Store session workspace path in payload for prompt variable substitution
  session.payload.session_workspace = sessionWorkspace;

  // Support agent synthesis results - check if synthesized knowledge file exists
  const synthesisFile = `${sessionWorkspace}/synthesized_knowledge.md`;
  try {
    const fs = await import('fs');
    if (fs.existsSync(synthesisFile)) {
      const synthesizedContent = fs.readFileSync(synthesisFile, 'utf-8');
      session.payload.knowledge_gathered = synthesizedContent;
      session.payload.synthesized_knowledge = synthesizedContent;

      // Mark agent orchestration as successful
      session.payload.agent_orchestration_successful = true;
      session.payload.agent_workspace_used = sessionWorkspace;

      console.log(`SUCCESS: Agent synthesis completed, knowledge gathered from ${synthesisFile}`);
      return; // Skip traditional auto-connection if agent synthesis succeeded
    }
  } catch (error) {
    console.log(
      `No agent synthesis found at ${synthesisFile}, proceeding with traditional research`
    );
  }

  // Check if Claude provided API selection response
  if (session.payload.awaiting_api_selection && input.payload?.claude_response) {
    try {
      // Parse Claude's API selection
      const claudeSelectedAPIs = parseClaudeAPISelection(
        input.payload.claude_response,
        SAMPLE_API_REGISTRY
      );

      if (claudeSelectedAPIs.length > 0) {
        // Use Claude's intelligent selection for auto-connection
        session.payload.api_discovery_results = claudeSelectedAPIs;
        session.payload.awaiting_api_selection = false;

        // Proceed with auto-connection using Claude's selected APIs
        const objective = session.payload.enhanced_goal || session.initial_objective || '';
        const result: KnowledgePhaseResult = await deps.autoConnection(objective);

        session.payload.synthesized_knowledge = result.answer;
        session.payload.knowledge_contradictions = result.contradictions;
        session.payload.knowledge_confidence = result.confidence;
      }
    } catch (error) {
      console.error('Error processing Claude API selection:', error);
      // Fall back to hardcoded selection
      session.payload.awaiting_api_selection = false;
    }
  }

  // Store gathered knowledge from direct Claude input
  if (input.payload?.knowledge_gathered) {
    session.payload.knowledge_gathered = input.payload.knowledge_gathered;
  }

  // Run auto-connection if conditions are met and no agent synthesis occurred
  if (
    session.payload.enhanced_goal &&
    session.detected_role &&
    !session.payload.awaiting_api_selection &&
    !session.payload.agent_orchestration_successful
  ) {
    await runAutoConnection(session, deps);
  } else if (!session.payload.agent_orchestration_successful) {
    // Initialize empty API fields for backward compatibility
    initializeEmptyAPIFields(session);
  }
}

/**
 * Executes auto-connection API orchestration with intelligent API selection
 * 
 * This function implements the core auto-connection logic that:
 * 1. Generates Claude-powered API selection prompts
 * 2. Discovers relevant APIs based on enhanced goal and role
 * 3. Executes parallel API fetching and knowledge synthesis
 * 4. Tracks performance metrics and success rates
 * 
 * The function provides graceful fallback mechanisms when auto-connection fails,
 * ensuring the system remains functional even with API failures.
 * 
 * @param session - Current session state with enhanced goal and role
 * @param deps - Auto-connection dependencies for API orchestration
 * 
 * @throws {Error} When API discovery completely fails (handled gracefully)
 * 
 * @example
 * ```typescript
 * await runAutoConnection(session, {
 *   autoConnection: async (objective) => ({ answer: "...", confidence: 0.8 }),
 *   apiSearch: async (query) => [{ name: "API", url: "..." }],
 *   validator: async (endpoint) => ({ valid: true })
 * });
 * ```
 */
async function runAutoConnection(session: any, deps: AutoConnectionDeps) {
  try {
    const startTime = Date.now();

    // Generate API selection prompt for Claude
    const apiSelectionPrompt = generateAPISelectionPrompt(
      session.payload.enhanced_goal,
      session.detected_role,
      SAMPLE_API_REGISTRY
    );

    // Store the prompt in session for Claude to process
    session.payload.api_selection_prompt = apiSelectionPrompt;
    session.payload.awaiting_api_selection = true;

    // Fallback to hardcoded selection
    const relevantAPIs = selectRelevantAPIs(session.payload.enhanced_goal, session.detected_role);

    // Store API discovery results in session payload
    session.payload.api_discovery_results = relevantAPIs;
    session.payload.api_fetch_responses = session.payload.api_fetch_responses || [];
    session.payload.synthesized_knowledge = session.payload.synthesized_knowledge || '';

    // Initialize API usage metrics
    const processingTime = Date.now() - startTime;
    const apiUsageMetrics: APIUsageMetrics = {
      apis_discovered: relevantAPIs.length,
      apis_queried: 0,
      synthesis_confidence: relevantAPIs.length > 0 ? 0.8 : 0.0,
      processing_time: processingTime,
      discovery_success_rate: relevantAPIs.length > 0 ? 1.0 : 0.0,
      api_response_time: 0,
      knowledge_synthesis_quality: 0.0,
    };
    session.payload.api_usage_metrics = apiUsageMetrics;

    if (relevantAPIs.length > 0) {
      // AUTO-CONNECTION: Automatically fetch and synthesize knowledge
      try {
        const autoConnectionStartTime = Date.now();
        const objective = session.payload.enhanced_goal || session.initial_objective || '';

        const result: KnowledgePhaseResult = await deps.autoConnection(objective);

        // Store synthesized knowledge in session
        session.payload.synthesized_knowledge = result.answer;
        session.payload.knowledge_contradictions = result.contradictions;
        session.payload.knowledge_confidence = result.confidence;

        // Update API usage metrics with auto-connection results
        const autoConnectionTime = Date.now() - autoConnectionStartTime;
        session.payload.api_usage_metrics.apis_queried = relevantAPIs.length;
        session.payload.api_usage_metrics.synthesis_confidence = result.confidence;
        session.payload.api_usage_metrics.api_response_time = autoConnectionTime;
        session.payload.api_usage_metrics.knowledge_synthesis_quality = result.confidence;

        // Mark auto-connection as successful
        session.payload.auto_connection_successful = true;
        session.payload.auto_connection_metadata = {
          apis_attempted: relevantAPIs.length,
          synthesis_confidence: result.confidence,
          total_processing_time: autoConnectionTime,
          contradictions_found: result.contradictions.length,
        };
      } catch (autoConnectionError) {
        console.warn(
          '[FSM-KNOWLEDGE] WARNING Auto-connection failed, falling back to manual mode:',
          autoConnectionError
        );

        // Graceful fallback
        session.payload.auto_connection_successful = false;
        session.payload.synthesized_knowledge = `Auto-connection failed: ${autoConnectionError instanceof Error ? autoConnectionError.message : 'Unknown error'}. Manual API tools are still available.`;
        session.payload.knowledge_contradictions = [];
        session.payload.knowledge_confidence = 0;
        session.payload.api_usage_metrics.knowledge_synthesis_quality = 0.0;
      }
    } else {
      session.payload.auto_connection_successful = false;
      session.payload.synthesized_knowledge =
        'No relevant APIs discovered for automatic knowledge gathering. Consider using manual research tools.';
    }
  } catch (error) {
    console.warn(
      '[FSM-KNOWLEDGE] API discovery failed, continuing with traditional knowledge gathering:',
      error
    );
    initializeEmptyAPIFields(session);
  }
}

/**
 * Initializes empty API fields for backward compatibility
 * 
 * This function ensures that session payload contains properly initialized
 * API-related fields when auto-connection is not available or fails.
 * Prevents undefined field errors in downstream processing.
 * 
 * @param session - Current session state to initialize
 * 
 * @example
 * ```typescript
 * initializeEmptyAPIFields(session);
 * // session.payload.api_discovery_results = []
 * // session.payload.api_usage_metrics = { apis_discovered: 0, ... }
 * ```
 */
function initializeEmptyAPIFields(session: any) {
  session.payload.api_discovery_results = session.payload.api_discovery_results || [];
  session.payload.api_fetch_responses = session.payload.api_fetch_responses || [];
  session.payload.synthesized_knowledge = session.payload.synthesized_knowledge || '';
  session.payload.api_usage_metrics = session.payload.api_usage_metrics || {
    apis_discovered: 0,
    apis_queried: 0,
    synthesis_confidence: 0.0,
    processing_time: 0,
    discovery_success_rate: 0.0,
    api_response_time: 0,
    knowledge_synthesis_quality: 0.0,
  };
}

/**
 * Handles the EXECUTE phase processing with fractal task iteration
 * 
 * This function manages the execution phase by:
 * 1. Storing execution results and updating reasoning effectiveness
 * 2. Tracking task progression through the todo list
 * 3. Implementing fractal iteration for complex task sequences
 * 4. Determining when to continue execution vs. move to verification
 * 
 * The function supports both linear task execution and fractal delegation
 * patterns where tasks can spawn sub-agents for specialized work.
 * 
 * @param session - Current session state with task tracking
 * @param input - JARVIS input message with execution results
 * @returns Next phase (EXECUTE for more tasks, VERIFY when complete)
 * 
 * @example
 * ```typescript
 * const nextPhase = handleExecutePhase(session, {
 *   session_id: "abc123",
 *   phase_completed: "EXECUTE",
 *   payload: { 
 *     execution_success: true,
 *     current_task_index: 2,
 *     more_tasks_pending: false
 *   }
 * });
 * ```
 */
function handleExecutePhase(session: any, input: MessageJARVIS): Phase {
  // Store execution results and continue or move to verification
  if (input.payload) {
    Object.assign(session.payload, input.payload);

    // Update reasoning effectiveness based on execution success
    if (input.payload.execution_success) {
      session.reasoning_effectiveness = Math.min(1.0, session.reasoning_effectiveness + 0.1);
    } else {
      session.reasoning_effectiveness = Math.max(0.3, session.reasoning_effectiveness - 0.1);
    }

    // Check if there are more tasks to execute (fractal iteration)
    const currentTaskIndex = session.payload.current_task_index || 0;
    const totalTasks = (session.payload.current_todos || []).length;

    if (input.payload.more_tasks_pending || currentTaskIndex < totalTasks - 1) {
      session.payload.current_task_index = currentTaskIndex + 1;
      return 'EXECUTE'; // Continue in EXECUTE phase
    } else {
      return 'VERIFY'; // All tasks done, move to verification
    }
  } else {
    return 'VERIFY';
  }
}

/**
 * Handles the VERIFY phase processing with intelligent rollback logic
 * 
 * This function implements comprehensive verification with:
 * 1. Strict completion percentage validation using metrics
 * 2. Intelligent rollback logic based on completion levels
 * 3. Failure context storage for debugging and recovery
 * 4. Adaptive retry strategies based on failure severity
 * 
 * The function determines whether to complete the FSM loop (DONE) or
 * rollback to appropriate phases based on verification results.
 * 
 * @param session - Current session state with task completion data
 * @param input - JARVIS input message with verification results
 * @param deps - Auto-connection dependencies (unused but required for signature)
 * @returns Next phase (DONE for success, PLAN/EXECUTE for rollback)
 * 
 * @example
 * ```typescript
 * const nextPhase = handleVerifyPhase(session, {
 *   session_id: "abc123",
 *   phase_completed: "VERIFY",
 *   payload: { 
 *     verification_passed: true,
 *     task_completion_rate: 0.95
 *   }
 * }, deps);
 * ```
 */
function handleVerifyPhase(session: any, input: MessageJARVIS, deps: AutoConnectionDeps): Phase {
  // Enhanced verification with strict completion percentage validation
  const verificationResult = validateTaskCompletion(session, input.payload);

  if (verificationResult.isValid && input.payload?.verification_passed === true) {
    return 'DONE';
  } else {
    // Log validation failure details
    console.warn(`Verification failed: ${verificationResult.reason}`);
    console.warn(`Completion percentage: ${verificationResult.completionPercentage}%`);

    // Store verification failure context for rollback
    session.payload.verification_failure_reason = verificationResult.reason;
    session.payload.last_completion_percentage = verificationResult.completionPercentage;

    // Rollback logic based on completion percentage
    if (verificationResult.completionPercentage < 50) {
      // Severe incompletion - restart from planning
      session.payload.current_task_index = 0;
      return 'PLAN';
    } else if (verificationResult.completionPercentage < 80) {
      // Moderate incompletion - retry from current task
      return 'EXECUTE';
    } else {
      // Minor incompletion - retry previous task
      if (session.payload.current_task_index > 0) {
        session.payload.current_task_index = session.payload.current_task_index - 1;
      }
      return 'EXECUTE';
    }
  }
}

/**
 * Generates comprehensive system prompts with role-based enhancement
 * 
 * This function creates dynamic system prompts that adapt to:
 * 1. Current phase requirements and constraints
 * 2. Detected user role and cognitive preferences
 * 3. Session context and accumulated knowledge
 * 4. Phase-specific tool permissions and guidance
 * 
 * The generated prompts include role-based cognitive amplification,
 * phase-specific context, and session variable substitution.
 * 
 * @param session - Current session state with role and objective
 * @param nextPhase - Target phase for prompt generation
 * @param input - JARVIS input message with session ID
 * @returns Enhanced system prompt with phase-specific context
 * 
 * @example
 * ```typescript
 * const prompt = generateSystemPrompt(session, 'EXECUTE', {
 *   session_id: "abc123",
 *   phase_completed: "PLAN"
 * });
 * ```
 */
function generateSystemPrompt(session: any, nextPhase: Phase, input: MessageJARVIS): string {
  // Generate role-enhanced system prompt with cognitive amplification
  const roleEnhancedPrompt = generateRoleEnhancedPrompt(
    nextPhase,
    session.detected_role,
    session.initial_objective
  );

  // Use the role-enhanced prompt directly (proven functionality)
  let augmentedPrompt = roleEnhancedPrompt;

  // Add phase-specific context
  augmentedPrompt = addPhaseSpecificContext(augmentedPrompt, nextPhase, session);

  // Substitute session variables for agent coordination
  const sessionId = input.session_id;
  augmentedPrompt = augmentedPrompt.replace(/\{\{session_id\}\}/g, sessionId);

  return augmentedPrompt;
}

/**
 * Adds phase-specific context to system prompts
 * 
 * This function enhances base system prompts with contextual information
 * specific to each phase of the FSM loop. Each phase receives tailored
 * context that guides Claude's behavior and tool usage.
 * 
 * @param prompt - Base system prompt to enhance
 * @param phase - Current phase requiring context
 * @param session - Session state containing relevant context data
 * @returns Enhanced prompt with phase-specific context
 * 
 * @example
 * ```typescript
 * const enhanced = addPhaseSpecificContext(
 *   "You are an AI assistant...",
 *   "EXECUTE",
 *   session
 * );
 * ```
 */
function addPhaseSpecificContext(prompt: string, phase: Phase, session: any): string {
  switch (phase) {
    case 'ENHANCE':
      if (session.payload.interpreted_goal) {
        prompt += `\n\n**📋 CONTEXT:** ${session.payload.interpreted_goal}`;
      }
      break;

    case 'KNOWLEDGE':
      prompt = addKnowledgePhaseContext(prompt, session);
      break;

    case 'PLAN':
      if (session.payload.enhanced_goal) {
        prompt += `\n\nGOAL TO PLAN: ${session.payload.enhanced_goal}`;
        prompt += `\n\n**🔄 FRACTAL ORCHESTRATION GUIDE:**\nFor complex sub-tasks that need specialized expertise, create todos with this format:\n"(ROLE: coder) (CONTEXT: authentication_system) (PROMPT: Implement secure JWT authentication with password reset) (OUTPUT: production_ready_code)"\n\nThis enables Task() agent spawning in the EXECUTE phase.`;
      }
      break;

    case 'EXECUTE':
      prompt = addExecutePhaseContext(prompt, session);
      break;

    case 'VERIFY':
      prompt = addVerifyPhaseContext(prompt, session);
      break;
  }

  return prompt;
}

/**
 * Adds knowledge phase specific context to system prompts
 * 
 * This function provides detailed context for the KNOWLEDGE phase including:
 * - Auto-connection results and API usage metrics
 * - Synthesized knowledge from automatic processing
 * - Fallback guidance when auto-connection fails
 * - Available manual research tools
 * 
 * @param prompt - Base system prompt to enhance
 * @param session - Session state with knowledge gathering results
 * @returns Enhanced prompt with knowledge phase context
 */
function addKnowledgePhaseContext(prompt: string, session: any): string {
  if (session.payload.auto_connection_successful) {
    const metadata = session.payload.auto_connection_metadata;
    prompt += `\n\nAUTO-CONNECTION RESULTS:\n`;
    prompt += `- APIs Discovered: ${session.payload.api_usage_metrics?.apis_discovered || 0}\n`;
    prompt += `- APIs Successfully Queried: ${metadata?.apis_successful || 0}/${metadata?.apis_attempted || 0}\n`;
    prompt += `- Synthesis Confidence: ${((metadata?.synthesis_confidence || 0) * 100).toFixed(1)}%\n`;
    prompt += `- Processing Time: ${metadata?.total_processing_time || 0}ms\n`;
    prompt += `- Sources Used: ${metadata?.sources_used?.join(', ') || 'None'}\n`;
    if (metadata?.contradictions_found && metadata.contradictions_found > 0) {
      prompt += `- WARNING Contradictions Found: ${metadata.contradictions_found}\n`;
    }
    prompt += `\n**📄 AUTO-SYNTHESIZED KNOWLEDGE:**\n${session.payload.synthesized_knowledge || 'No knowledge synthesized'}`;
  } else if (session.payload.auto_connection_successful === false) {
    prompt += `\n\nWARNING AUTO-CONNECTION STATUS:\n`;
    prompt += `- Auto-connection failed or no relevant APIs found\n`;
    prompt += `- APIs Discovered: ${session.payload.api_usage_metrics?.apis_discovered || 0}\n`;
    prompt += `- Fallback Message: ${session.payload.synthesized_knowledge || 'Manual research tools required'}\n`;
    prompt += `- Manual tools available: APISearch, MultiAPIFetch, KnowledgeSynthesize, WebSearch, WebFetch`;
  }
  return prompt;
}

/**
 * Adds execute phase specific context to system prompts
 * 
 * This function provides detailed context for the EXECUTE phase including:
 * - Current task progression and todo list status
 * - Reasoning effectiveness tracking
 * - Fractal execution protocol guidance
 * - Single tool per iteration constraints
 * 
 * @param prompt - Base system prompt to enhance
 * @param session - Session state with execution context
 * @returns Enhanced prompt with execute phase context
 */
function addExecutePhaseContext(prompt: string, session: any): string {
  const currentTaskIndex = session.payload.current_task_index || 0;
  const currentTodos = session.payload.current_todos || [];
  const currentTodo = currentTodos[currentTaskIndex];

  prompt += `\n\nEXECUTION CONTEXT:\n- Current Task Index: ${currentTaskIndex}\n- Total Tasks: ${currentTodos.length}\n- Current Task: ${currentTodo || 'None'}\n- Reasoning Effectiveness: ${(session.reasoning_effectiveness * 100).toFixed(1)}%\n- Objective: ${session.initial_objective}`;

  // Add fractal execution guidance
  prompt += `\n\nFRACTAL EXECUTION PROTOCOL:\n1. Check current todo (index ${currentTaskIndex}) for meta-prompt patterns\n2. If todo contains (ROLE:...) pattern, use Task() tool to spawn specialized agent\n3. If todo is direct execution, use appropriate tools (Bash/Browser/etc.)\n4. After each action, report results back\n\nSINGLE TOOL PER ITERATION: Choose ONE tool call per turn (Manus requirement).`;

  return prompt;
}

/**
 * Adds verify phase specific context to system prompts
 * 
 * This function provides comprehensive context for the VERIFY phase including:
 * - Task completion metrics and breakdown analysis
 * - Critical task tracking and completion status
 * - Verification requirements and success criteria
 * - Previous failure context for debugging
 * 
 * @param prompt - Base system prompt to enhance
 * @param session - Session state with verification context
 * @returns Enhanced prompt with verify phase context
 */
function addVerifyPhaseContext(prompt: string, session: any): string {
  const todos = session.payload.current_todos || [];
  const taskBreakdown = calculateTaskBreakdown(todos);
  const completionPercentage = calculateCompletionPercentage(taskBreakdown);
  const criticalTasks = todos.filter(
    (todo: any) => todo.priority === 'high' || todo.type === 'TaskAgent' || todo.meta_prompt
  );
  const criticalTasksCompleted = criticalTasks.filter(
    (todo: any) => todo.status === 'completed'
  ).length;

  prompt += `\n\nVERIFICATION CONTEXT:\n- Original Objective: ${session.initial_objective}\n- Final Reasoning Effectiveness: ${(session.reasoning_effectiveness * 100).toFixed(1)}%\n- Role Applied: ${session.detected_role}`;
  prompt += `\n\nCOMPLETION METRICS:\n- Overall Completion: ${completionPercentage}% (${taskBreakdown.completed}/${taskBreakdown.total} tasks)\n- Critical Tasks Completed: ${criticalTasksCompleted}/${criticalTasks.length}\n- Tasks Breakdown: ${taskBreakdown.completed} completed, ${taskBreakdown.in_progress} in-progress, ${taskBreakdown.pending} pending`;
  prompt += `\n\nVERIFICATION REQUIREMENTS:\n- Critical tasks must be 100% complete\n- Overall completion must be >=95%\n- No high-priority tasks can remain pending\n- No tasks can remain in-progress\n- Execution success rate must be >=70%\n- verification_passed=true requires backing metrics`;

  if (session.payload.verification_failure_reason) {
    prompt += `\n\n**🚨 PREVIOUS VERIFICATION FAILURE:**\n${session.payload.verification_failure_reason}\nLast Completion: ${session.payload.last_completion_percentage}%`;
  }

  return prompt;
}

/**
 * Extracts meta-prompt specifications from todo content using regex patterns
 * 
 * This function parses todo content to extract fractal agent specifications
 * using the format: (ROLE: role) (CONTEXT: context) (PROMPT: prompt) (OUTPUT: output)
 * 
 * When a meta-prompt is detected, it enables Task() agent spawning in the
 * EXECUTE phase for specialized task delegation.
 * 
 * @param todoContent - Raw todo text content to parse
 * @returns Extracted meta-prompt object or null if no pattern found
 * 
 * @example
 * ```typescript
 * const metaPrompt = extractMetaPromptFromTodo(
 *   "(ROLE: coder) (CONTEXT: auth) (PROMPT: Implement JWT) (OUTPUT: code)"
 * );
 * // Returns: { role_specification: "coder", context_parameters: { domain: "auth" }, ... }
 * ```
 */
export function extractMetaPromptFromTodo(todoContent: string): MetaPrompt | null {
  // Use proven regex-based meta-prompt extraction
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

/**
 * Updates session reasoning effectiveness based on task performance
 * 
 * This function implements adaptive reasoning effectiveness tracking that:
 * - Increases effectiveness on successful task completion
 * - Decreases effectiveness on task failures
 * - Applies different multipliers based on task complexity
 * - Maintains effectiveness bounds (0.3 to 1.0)
 * 
 * The reasoning effectiveness influences cognitive load calculations
 * and system prompt generation for enhanced performance.
 * 
 * @param sessionId - Session identifier for state management
 * @param success - Whether the task was completed successfully
 * @param taskComplexity - Task complexity level affecting update magnitude
 * 
 * @example
 * ```typescript
 * updateReasoningEffectiveness("session123", true, "complex");
 * // Increases effectiveness by 0.15 for successful complex task
 * ```
 */
export function updateReasoningEffectiveness(
  sessionId: string,
  success: boolean,
  taskComplexity: 'simple' | 'complex' = 'simple'
): void {
  const session = graphStateManager.getSessionState(sessionId);
  const multiplier = taskComplexity === 'complex' ? 0.15 : 0.1;

  if (success) {
    session.reasoning_effectiveness = Math.min(1.0, session.reasoning_effectiveness + multiplier);
  } else {
    session.reasoning_effectiveness = Math.max(0.3, session.reasoning_effectiveness - multiplier);
  }

  graphStateManager.updateSessionState(sessionId, session);
}
