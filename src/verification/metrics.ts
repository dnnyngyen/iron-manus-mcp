/**
 * @fileoverview Verification and Metrics System
 *
 * This module provides comprehensive task completion validation and performance tracking
 * for the Iron Manus MCP VERIFY phase. It implements strict validation rules to ensure
 * task completion quality and tracks reasoning effectiveness metrics.
 *
 * Key Features:
 * - Multi-tier validation rules for task completion
 * - Critical task identification and validation
 * - Performance metrics calculation and tracking
 * - Reasoning effectiveness scoring
 * - Integration with FSM VERIFY phase
 *
 * @module verification/metrics
 * @version 0.2.4
 * @since 0.1.0
 */

import { VerificationResult, TodoItem, SessionState } from '../core/types.js';
import { CONFIG } from '../config.js';

/**
 * Interface for task breakdown statistics
 *
 * Provides structured data about task completion status across all categories.
 * Used for calculating completion percentages and validation metrics.
 *
 * @interface TaskBreakdown
 * @since 0.1.0
 */
export interface TaskBreakdown {
  /** Number of completed tasks */
  completed: number;
  /** Number of in-progress tasks */
  in_progress: number;
  /** Number of pending tasks */
  pending: number;
  /** Total number of tasks */
  total: number;
}

/**
 * Validates task completion using comprehensive multi-tier validation rules
 *
 * This is the primary validation function for the VERIFY phase, implementing
 * strict completion requirements and quality thresholds. It evaluates task
 * completion across multiple dimensions including critical task completion,
 * overall completion percentage, and execution success rates.
 *
 * Validation Rules:
 * 1. 100% critical task completion required (high priority, meta-prompt tasks)
 * 2. Minimum overall completion threshold (configurable via CONFIG)
 * 3. No pending high-priority tasks allowed
 * 4. All in-progress tasks must be resolved
 * 5. Execution success rate must meet threshold
 * 6. Verification payload consistency check
 *
 * @param session - Current FSM session containing todos and metadata
 * @param verificationPayload - Verification data from VERIFY phase
 * @returns {VerificationResult} Comprehensive validation result with metrics
 *
 * @example
 * ```typescript
 * const result = validateTaskCompletion(session, verificationPayload);
 * if (result.isValid) {
 *   console.log(`Validation passed: ${result.completionPercentage}% complete`);
 * } else {
 *   console.log(`Validation failed: ${result.reason}`);
 * }
 * ```
 *
 * @since 0.1.0
 */
export function validateTaskCompletion(
  session: SessionState,
  verificationPayload: Record<string, unknown>
): VerificationResult {
  const todos = Array.isArray(session.payload.current_todos)
    ? (session.payload.current_todos as TodoItem[])
    : [];

  // Calculate task completion metrics
  const taskBreakdown = calculateTaskBreakdown(todos);
  const completionPercentage = calculateCompletionPercentage(taskBreakdown);

  // Identify critical tasks (high priority or meta-prompt tasks)
  const criticalTasks = todos.filter(
    (todo: TodoItem) =>
      todo.priority === 'high' ||
      todo.type === 'TaskAgent' ||
      ('meta_prompt' in todo && todo.meta_prompt)
  );
  const criticalTasksCompleted = criticalTasks.filter(
    (todo: TodoItem) => todo.status === 'completed'
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
    (todo: TodoItem) => todo.status === 'pending' && todo.priority === 'high'
  );
  if (pendingHighPriority.length > 0) {
    result.reason = `${pendingHighPriority.length} high-priority tasks still pending.`;
    return result;
  }

  // Rule 4: All in-progress tasks must be resolved
  const inProgressTasks = todos.filter((todo: TodoItem) => todo.status === 'in_progress');
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

/**
 * Calculates detailed task breakdown statistics from todo list
 *
 * Analyzes the current todo list to provide comprehensive statistics about
 * task completion status. This function categorizes tasks by their status
 * and provides the foundation for completion percentage calculations.
 *
 * @param todos - Array of todo items with status information
 * @returns {TaskBreakdown} Detailed breakdown of task completion statistics
 *
 * @example
 * ```typescript
 * const breakdown = calculateTaskBreakdown(session.payload.current_todos);
 * console.log(`${breakdown.completed}/${breakdown.total} tasks completed`);
 * ```
 *
 * @since 0.1.0
 */
export function calculateTaskBreakdown(todos: TodoItem[]): TaskBreakdown {
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

/**
 * Calculates completion percentage from task breakdown statistics
 *
 * Computes the percentage of completed tasks based on the provided breakdown.
 * Handles edge cases such as empty task lists and rounds to nearest integer
 * for consistent reporting.
 *
 * @param breakdown - Task breakdown statistics from calculateTaskBreakdown
 * @returns {number} Completion percentage (0-100, rounded to nearest integer)
 *
 * @example
 * ```typescript
 * const breakdown = calculateTaskBreakdown(todos);
 * const percentage = calculateCompletionPercentage(breakdown);
 * console.log(`Project is ${percentage}% complete`);
 * ```
 *
 * @since 0.1.0
 */
export function calculateCompletionPercentage(breakdown: TaskBreakdown): number {
  if (breakdown.total === 0) return 100; // No tasks means 100% completion
  return Math.round((breakdown.completed / breakdown.total) * 100);
}

/**
 * Updates reasoning effectiveness metrics based on task completion success
 *
 * Tracks and adjusts the reasoning effectiveness score based on task completion
 * outcomes. This metric influences future validation decisions and provides
 * feedback on the quality of task execution. The score is adjusted based on
 * success/failure and task complexity.
 *
 * Performance Tracking:
 * - Success increases effectiveness (complex tasks have higher impact)
 * - Failure decreases effectiveness (complex tasks have higher penalty)
 * - Bounded by configured min/max effectiveness thresholds
 * - Used in validation rules for execution success rate checks
 *
 * @param session - Current FSM session to update effectiveness score
 * @param success - Whether the task was completed successfully
 * @param taskComplexity - Task complexity level affecting score multiplier
 *
 * @example
 * ```typescript
 * // Update for successful complex task
 * updateReasoningEffectiveness(session, true, 'complex');
 *
 * // Update for failed simple task
 * updateReasoningEffectiveness(session, false, 'simple');
 * ```
 *
 * @since 0.1.0
 */
export function updateReasoningEffectiveness(
  session: SessionState,
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
