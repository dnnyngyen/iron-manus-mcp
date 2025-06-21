// Core FSM logic - replaces Manus's entire PyArmor-protected FastAPI server
// Implements the 6-step agent loop + 3 modules + fractal orchestration
import { ManusOrchestratorInput, ManusOrchestratorOutput, Phase, Role, TodoItem, MetaPrompt, VerificationResult } from './types.js';
import { generateRoleEnhancedPrompt, detectRole, PHASE_ALLOWED_TOOLS } from './prompts.js';
import { stateManager } from './state.js';

export function processManusFSM(input: ManusOrchestratorInput): ManusOrchestratorOutput {
  const sessionId = input.session_id;
  const session = stateManager.getSessionState(sessionId);
  
  // Handle initial objective setup with role detection
  if (input.initial_objective) {
    session.initial_objective = input.initial_objective;
    session.detected_role = detectRole(input.initial_objective); // Auto-detect role like Manus modules
    session.current_phase = 'INIT';
    session.reasoning_effectiveness = 0.8; // Initial effectiveness score
    // Initialize payload with execution state
    session.payload = {
      current_task_index: 0,
      current_todos: [],
      phase_transition_count: 0
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
        // Store gathered knowledge and move to planning
        if (input.payload?.knowledge_gathered) {
          session.payload.knowledge_gathered = input.payload.knowledge_gathered;
        }
        nextPhase = 'PLAN';
      }
      break;
      
    case 'PLAN':
      if (input.phase_completed === 'PLAN') {
        // Confirm plan created and move to execution
        if (input.payload?.plan_created) {
          session.payload.plan_created = true;
          // Store todos in payload and reset task index for execution
          session.payload.current_todos = input.payload.todos_with_metaprompts || [];
          session.payload.current_task_index = 0;
        }
        nextPhase = 'EXECUTE';
      }
      break;
      
    case 'EXECUTE':
      if (input.phase_completed === 'EXECUTE') {
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
            nextPhase = 'EXECUTE'; // Continue in EXECUTE phase
          } else {
            nextPhase = 'VERIFY'; // All tasks done, move to verification
          }
        } else {
          nextPhase = 'VERIFY';
        }
      }
      break;
      
    case 'VERIFY':
      if (input.phase_completed === 'VERIFY') {
        // Enhanced verification with strict completion percentage validation
        const verificationResult = validateTaskCompletion(session, input.payload);
        
        if (verificationResult.isValid && input.payload?.verification_passed === true) {
          nextPhase = 'DONE';
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
            nextPhase = 'PLAN';
            session.payload.current_task_index = 0;
          } else if (verificationResult.completionPercentage < 80) {
            // Moderate incompletion - retry from current task
            nextPhase = 'EXECUTE';
            // Don't decrement task index if completion is too low
          } else {
            // Minor incompletion - retry previous task
            if (session.payload.current_task_index > 0) {
              session.payload.current_task_index = session.payload.current_task_index - 1;
            }
            nextPhase = 'EXECUTE';
          }
        }
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

  // Generate role-enhanced system prompt with cognitive amplification
  const roleEnhancedPrompt = generateRoleEnhancedPrompt(nextPhase, session.detected_role, session.initial_objective);
  const allowedTools = PHASE_ALLOWED_TOOLS[nextPhase];
  
  // Augment system prompt with phase-specific context and fractal orchestration info
  let augmentedPrompt = roleEnhancedPrompt;
  
  if (nextPhase === 'ENHANCE' && session.payload.interpreted_goal) {
    augmentedPrompt += `\n\n**📋 CONTEXT:** ${session.payload.interpreted_goal}`;
  } else if (nextPhase === 'PLAN' && session.payload.enhanced_goal) {
    augmentedPrompt += `\n\n**🎯 GOAL TO PLAN:** ${session.payload.enhanced_goal}`;
    augmentedPrompt += `\n\n**🔄 FRACTAL ORCHESTRATION GUIDE:**\nFor complex sub-tasks that need specialized expertise, create todos with this format:\n"(ROLE: coder) (CONTEXT: authentication_system) (PROMPT: Implement secure JWT authentication with password reset) (OUTPUT: production_ready_code)"\n\nThis enables Task() agent spawning in the EXECUTE phase.`;
  } else if (nextPhase === 'EXECUTE') {
    const currentTaskIndex = session.payload.current_task_index || 0;
    const currentTodos = session.payload.current_todos || [];
    const currentTodo = currentTodos[currentTaskIndex];
    
    augmentedPrompt += `\n\n**📊 EXECUTION CONTEXT:**\n- Current Task Index: ${currentTaskIndex}\n- Total Tasks: ${currentTodos.length}\n- Current Task: ${currentTodo || 'None'}\n- Reasoning Effectiveness: ${(session.reasoning_effectiveness * 100).toFixed(1)}%\n- Objective: ${session.initial_objective}`;
    
    // Add fractal execution guidance
    augmentedPrompt += `\n\n**🔄 FRACTAL EXECUTION PROTOCOL:**\n1. Check current todo (index ${currentTaskIndex}) for meta-prompt patterns\n2. If todo contains (ROLE:...) pattern, use Task() tool to spawn specialized agent\n3. If todo is direct execution, use appropriate tools (Bash/Browser/etc.)\n4. After each action, report results back\n\n**⚡ SINGLE TOOL PER ITERATION:** Choose ONE tool call per turn (Manus requirement).`;
  } else if (nextPhase === 'VERIFY') {
    const todos = session.payload.current_todos || [];
    const taskBreakdown = calculateTaskBreakdown(todos);
    const completionPercentage = calculateCompletionPercentage(taskBreakdown);
    const criticalTasks = todos.filter((todo: any) => 
      todo.priority === 'high' || 
      todo.type === 'TaskAgent' || 
      todo.meta_prompt
    );
    const criticalTasksCompleted = criticalTasks.filter((todo: any) => todo.status === 'completed').length;
    
    augmentedPrompt += `\n\n**✅ VERIFICATION CONTEXT:**\n- Original Objective: ${session.initial_objective}\n- Final Reasoning Effectiveness: ${(session.reasoning_effectiveness * 100).toFixed(1)}%\n- Role Applied: ${session.detected_role}`;
    augmentedPrompt += `\n\n**📊 COMPLETION METRICS:**\n- Overall Completion: ${completionPercentage}% (${taskBreakdown.completed}/${taskBreakdown.total} tasks)\n- Critical Tasks Completed: ${criticalTasksCompleted}/${criticalTasks.length}\n- Tasks Breakdown: ${taskBreakdown.completed} completed, ${taskBreakdown.in_progress} in-progress, ${taskBreakdown.pending} pending`;
    augmentedPrompt += `\n\n**⚠️ VERIFICATION REQUIREMENTS:**\n- Critical tasks must be 100% complete\n- Overall completion must be ≥95%\n- No high-priority tasks can remain pending\n- No tasks can remain in-progress\n- Execution success rate must be ≥70%\n- verification_passed=true requires backing metrics`;
    
    if (session.payload.verification_failure_reason) {
      augmentedPrompt += `\n\n**🚨 PREVIOUS VERIFICATION FAILURE:**\n${session.payload.verification_failure_reason}\nLast Completion: ${session.payload.last_completion_percentage}%`;
    }
  }

  // Determine status
  const status = nextPhase === 'DONE' ? 'DONE' : 'IN_PROGRESS';

  const output: ManusOrchestratorOutput = {
    next_phase: nextPhase,
    system_prompt: augmentedPrompt,
    allowed_next_tools: allowedTools,
    payload: {
      session_id: sessionId,
      current_objective: session.initial_objective,
      detected_role: session.detected_role,
      reasoning_effectiveness: session.reasoning_effectiveness,
      phase_transition_count: (session.payload.phase_transition_count || 0) + 1,
      ...session.payload
    },
    status
  };

  return output;
}

// Helper function to extract meta-prompt from todo content
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
      output_requirements: outputMatch ? outputMatch[1].trim() : 'comprehensive_deliverable'
    };
  }
  
  return null;
}

// Performance tracking for reasoning effectiveness
export function updateReasoningEffectiveness(sessionId: string, success: boolean, taskComplexity: 'simple' | 'complex' = 'simple'): void {
  const session = stateManager.getSessionState(sessionId);
  const multiplier = taskComplexity === 'complex' ? 0.15 : 0.1;
  
  if (success) {
    session.reasoning_effectiveness = Math.min(1.0, session.reasoning_effectiveness + multiplier);
  } else {
    session.reasoning_effectiveness = Math.max(0.3, session.reasoning_effectiveness - multiplier);
  }
  
  stateManager.updateSessionState(sessionId, session);
}

// Enhanced verification logic with strict completion percentage thresholds

export function validateTaskCompletion(session: any, verificationPayload: any): VerificationResult {
  const todos = session.payload.current_todos || [];
  const currentTaskIndex = session.payload.current_task_index || 0;
  
  // Calculate task completion metrics
  const taskBreakdown = calculateTaskBreakdown(todos);
  const completionPercentage = calculateCompletionPercentage(taskBreakdown);
  
  // Identify critical tasks (high priority or meta-prompt tasks)
  const criticalTasks = todos.filter((todo: any) => 
    todo.priority === 'high' || 
    todo.type === 'TaskAgent' || 
    todo.meta_prompt
  );
  const criticalTasksCompleted = criticalTasks.filter((todo: any) => todo.status === 'completed').length;
  
  // Strict validation rules
  const result: VerificationResult = {
    isValid: false,
    completionPercentage,
    reason: '',
    criticalTasksCompleted,
    totalCriticalTasks: criticalTasks.length,
    taskBreakdown
  };
  
  // Rule 1: 100% critical task completion required
  if (criticalTasks.length > 0 && criticalTasksCompleted < criticalTasks.length) {
    result.reason = `Critical tasks incomplete: ${criticalTasksCompleted}/${criticalTasks.length} completed. 100% critical task completion required.`;
    return result;
  }
  
  // Rule 2: Minimum 95% overall completion for non-critical scenarios
  if (completionPercentage < 95) {
    result.reason = `Overall completion ${completionPercentage}% below required threshold of 95%.`;
    return result;
  }
  
  // Rule 3: No pending high-priority tasks
  const pendingHighPriority = todos.filter((todo: any) => 
    todo.status === 'pending' && todo.priority === 'high'
  );
  if (pendingHighPriority.length > 0) {
    result.reason = `${pendingHighPriority.length} high-priority tasks still pending.`;
    return result;
  }
  
  // Rule 4: All in-progress tasks must be resolved
  const inProgressTasks = todos.filter((todo: any) => todo.status === 'in_progress');
  if (inProgressTasks.length > 0) {
    result.reason = `${inProgressTasks.length} tasks still in progress. All tasks must be completed or explicitly marked as pending.`;
    return result;
  }
  
  // Rule 5: Verify execution success rate
  const executionSuccessRate = session.reasoning_effectiveness || 0;
  if (executionSuccessRate < 0.7) {
    result.reason = `Execution success rate ${(executionSuccessRate * 100).toFixed(1)}% below required threshold of 70%.`;
    return result;
  }
  
  // Rule 6: Validate verification payload consistency
  if (verificationPayload?.verification_passed === true) {
    // Additional validation: ensure verification_passed claim is backed by actual metrics
    if (completionPercentage < 100 && criticalTasks.length > 0) {
      result.reason = `Verification claim inconsistent with completion metrics. Critical tasks exist but completion is ${completionPercentage}%.`;
      return result;
    }
  }
  
  // All validation rules passed
  result.isValid = true;
  result.reason = `Validation passed: ${completionPercentage}% completion, ${criticalTasksCompleted}/${criticalTasks.length} critical tasks completed.`;
  
  return result;
}

function calculateTaskBreakdown(todos: any[]): { completed: number; in_progress: number; pending: number; total: number } {
  const breakdown = {
    completed: 0,
    in_progress: 0,
    pending: 0,
    total: todos.length
  };
  
  todos.forEach(todo => {
    switch (todo.status) {
      case 'completed':
        breakdown.completed++;
        break;
      case 'in_progress':
        breakdown.in_progress++;
        break;
      case 'pending':
        breakdown.pending++;
        break;
    }
  });
  
  return breakdown;
}

function calculateCompletionPercentage(breakdown: { completed: number; total: number }): number {
  if (breakdown.total === 0) return 100; // No tasks means 100% completion
  return Math.round((breakdown.completed / breakdown.total) * 100);
}