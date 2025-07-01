// Pure FSM engine - implements the 6-phase state machine
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
  detectEnhancedRole,
  extractEnhancedMetaPrompts,
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
import { stateManager } from '../core/state.js';
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

// Core FSM implementation using basic, proven functionality

export function createFSM(deps: AutoConnectionDeps) {
  return {
    processState: (input: MessageJARVIS) => processState(input, deps),
    extractMetaPromptFromTodo,
    // extractEnhancedMetaPromptFromTodo removed - use extractMetaPromptFromTodo
    updateReasoningEffectiveness,
  };
}

export async function processState(
  input: MessageJARVIS,
  deps: AutoConnectionDeps
): Promise<FromJARVIS> {
  const sessionId = input.session_id;
  const session = stateManager.getSessionState(sessionId);

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
    stateManager.updateSessionState(sessionId, session);
  }

  // Determine next phase based on current phase and completed phase
  let nextPhase: Phase = session.current_phase;

  // Phase transition logic - mirrors Manus's 6-step agent loop
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
  stateManager.updateSessionState(sessionId, session);

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
    console.log(`No agent synthesis found at ${synthesisFile}, proceeding with traditional research`);
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

function addExecutePhaseContext(prompt: string, session: any): string {
  const currentTaskIndex = session.payload.current_task_index || 0;
  const currentTodos = session.payload.current_todos || [];
  const currentTodo = currentTodos[currentTaskIndex];

  prompt += `\n\nEXECUTION CONTEXT:\n- Current Task Index: ${currentTaskIndex}\n- Total Tasks: ${currentTodos.length}\n- Current Task: ${currentTodo || 'None'}\n- Reasoning Effectiveness: ${(session.reasoning_effectiveness * 100).toFixed(1)}%\n- Objective: ${session.initial_objective}`;

  // Add fractal execution guidance
  prompt += `\n\nFRACTAL EXECUTION PROTOCOL:\n1. Check current todo (index ${currentTaskIndex}) for meta-prompt patterns\n2. If todo contains (ROLE:...) pattern, use Task() tool to spawn specialized agent\n3. If todo is direct execution, use appropriate tools (Bash/Browser/etc.)\n4. After each action, report results back\n\nSINGLE TOOL PER ITERATION: Choose ONE tool call per turn (Manus requirement).`;

  return prompt;
}

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

// Helper function to extract meta-prompt from todo content (Enhanced with AST fallback)
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

// Enhanced function removed - use extractMetaPromptFromTodo for all meta-prompt extraction

// Performance tracking for reasoning effectiveness
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

// Validation context no longer needed - removed with enhanced features
