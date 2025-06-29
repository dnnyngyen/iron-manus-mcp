// Verification and metrics module
// Handles task completion validation and performance tracking
import { VerificationResult, TodoItem } from '../core/types.js';
import { CONFIG } from '../config.js';

export interface TaskBreakdown {
  completed: number;
  in_progress: number;
  pending: number;
  total: number;
}

/**
 * Enhanced verification logic with strict completion percentage thresholds
 */
export function validateTaskCompletion(session: any, verificationPayload: any): VerificationResult {
  const todos = session.payload.current_todos || [];
  const currentTaskIndex = session.payload.current_task_index || 0;

  // Calculate task completion metrics
  const taskBreakdown = calculateTaskBreakdown(todos);
  const completionPercentage = calculateCompletionPercentage(taskBreakdown);

  // Identify critical tasks (high priority or meta-prompt tasks)
  const criticalTasks = todos.filter(
    (todo: any) => todo.priority === 'high' || todo.type === 'TaskAgent' || todo.meta_prompt
  );
  const criticalTasksCompleted = criticalTasks.filter(
    (todo: any) => todo.status === 'completed'
  ).length;

  // Strict validation rules
  const result: VerificationResult = {
    isValid: false,
    completionPercentage,
    reason: '',
    criticalTasksCompleted,
    totalCriticalTasks: criticalTasks.length,
    taskBreakdown,
  };

  // Rule 1: 100% critical task completion required
  if (criticalTasks.length > 0 && criticalTasksCompleted < criticalTasks.length) {
    result.reason = `Critical tasks incomplete: ${criticalTasksCompleted}/${criticalTasks.length} completed. 100% critical task completion required.`;
    return result;
  }

  // Rule 2: Minimum configured% overall completion for non-critical scenarios
  if (completionPercentage < CONFIG.VERIFICATION_COMPLETION_THRESHOLD) {
    result.reason = `Overall completion ${completionPercentage}% below required threshold of ${CONFIG.VERIFICATION_COMPLETION_THRESHOLD}%.`;
    return result;
  }

  // Rule 3: No pending high-priority tasks
  const pendingHighPriority = todos.filter(
    (todo: any) => todo.status === 'pending' && todo.priority === 'high'
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
  if (executionSuccessRate < CONFIG.EXECUTION_SUCCESS_RATE_THRESHOLD) {
    result.reason = `Execution success rate ${(executionSuccessRate * 100).toFixed(1)}% below required threshold of ${(CONFIG.EXECUTION_SUCCESS_RATE_THRESHOLD * 100).toFixed(1)}%.`;
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

export function calculateTaskBreakdown(todos: any[]): TaskBreakdown {
  const breakdown = {
    completed: 0,
    in_progress: 0,
    pending: 0,
    total: todos.length,
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

export function calculateCompletionPercentage(breakdown: TaskBreakdown): number {
  if (breakdown.total === 0) return 100; // No tasks means 100% completion
  return Math.round((breakdown.completed / breakdown.total) * 100);
}

/**
 * Performance tracking for reasoning effectiveness
 */
export function updateReasoningEffectiveness(
  session: any,
  success: boolean,
  taskComplexity: 'simple' | 'complex' = 'simple'
): void {
  const multiplier = taskComplexity === 'complex' ? 0.15 : 0.1;

  if (success) {
    session.reasoning_effectiveness = Math.min(
      CONFIG.MAX_REASONING_EFFECTIVENESS,
      session.reasoning_effectiveness + multiplier
    );
  } else {
    session.reasoning_effectiveness = Math.max(
      CONFIG.MIN_REASONING_EFFECTIVENESS,
      session.reasoning_effectiveness - multiplier
    );
  }
}
