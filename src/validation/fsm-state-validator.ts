// FSM State Consistency Validation System
// Implements comprehensive state validation and transition logging for the Iron Manus FSM

import { Phase, SessionState, TodoItem, APIUsageMetrics } from '../core/types.js';
import logger from '../utils/logger.js';

// Validation configuration
export interface ValidationConfig {
  strictMode: boolean;
  enableTransitionLogging: boolean;
  maxTasksPerPhase: number;
  minReasoningEffectiveness: number;
  requiredCompletionThreshold: number;
}

export const DEFAULT_VALIDATION_CONFIG: ValidationConfig = {
  strictMode: true,
  enableTransitionLogging: true,
  maxTasksPerPhase: 50,
  minReasoningEffectiveness: 0.3,
  requiredCompletionThreshold: 0.95,
};

// Validation result types
export interface StateValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  metrics: ValidationMetrics;
  recommendations: string[];
}

export interface ValidationError {
  code: string;
  message: string;
  severity: 'critical' | 'high' | 'medium';
  phase: Phase;
  context?: Record<string, unknown>;
}

export interface ValidationWarning {
  code: string;
  message: string;
  phase: Phase;
  suggestion: string;
}

export interface ValidationMetrics {
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  validationTimeMs: number;
  stateConsistencyScore: number;
  transitionIntegrityScore: number;
}

// Transition logging types
export interface PhaseTransition {
  sessionId: string;
  fromPhase: Phase;
  toPhase: Phase;
  timestamp: number;
  duration: number;
  payload: Record<string, unknown>;
  success: boolean;
  errors?: string[];
}

export interface TransitionLog {
  sessionId: string;
  transitions: PhaseTransition[];
  totalTransitions: number;
  successfulTransitions: number;
  averageTransitionTime: number;
}

// Main FSM State Validator class
export class FSMStateValidator {
  private config: ValidationConfig;
  private transitionLogs: Map<string, TransitionLog> = new Map();

  constructor(config: ValidationConfig = DEFAULT_VALIDATION_CONFIG) {
    this.config = config;
  }

  /**
   * Validates FSM state consistency
   */
  validateState(sessionState: SessionState): StateValidationResult {
    const startTime = Date.now();
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    let totalChecks = 0;
    let passedChecks = 0;

    // Phase consistency validation
    const phaseValidation = this.validatePhaseConsistency(sessionState);
    totalChecks += phaseValidation.totalChecks;
    passedChecks += phaseValidation.passedChecks;
    errors.push(...phaseValidation.errors);
    warnings.push(...phaseValidation.warnings);

    // Payload integrity validation
    const payloadValidation = this.validatePayloadIntegrity(sessionState);
    totalChecks += payloadValidation.totalChecks;
    passedChecks += payloadValidation.passedChecks;
    errors.push(...payloadValidation.errors);
    warnings.push(...payloadValidation.warnings);

    // Task state validation
    const taskValidation = this.validateTaskStates(sessionState);
    totalChecks += taskValidation.totalChecks;
    passedChecks += taskValidation.passedChecks;
    errors.push(...taskValidation.errors);
    warnings.push(...taskValidation.warnings);

    // Performance metrics validation
    const performanceValidation = this.validatePerformanceMetrics(sessionState);
    totalChecks += performanceValidation.totalChecks;
    passedChecks += performanceValidation.passedChecks;
    errors.push(...performanceValidation.errors);
    warnings.push(...performanceValidation.warnings);

    const validationTimeMs = Date.now() - startTime;
    const stateConsistencyScore = totalChecks > 0 ? passedChecks / totalChecks : 0;
    const transitionIntegrityScore = this.calculateTransitionIntegrityScore(sessionState);

    const metrics: ValidationMetrics = {
      totalChecks,
      passedChecks,
      failedChecks: totalChecks - passedChecks,
      validationTimeMs,
      stateConsistencyScore,
      transitionIntegrityScore,
    };

    const recommendations = this.generateRecommendations(errors, warnings, sessionState);

    return {
      isValid: errors.filter(e => e.severity === 'critical').length === 0,
      errors,
      warnings,
      metrics,
      recommendations,
    };
  }

  /**
   * Logs phase transitions with integrity checks
   */
  logPhaseTransition(
    sessionId: string,
    fromPhase: Phase,
    toPhase: Phase,
    payload: Record<string, unknown>,
    duration: number = 0
  ): void {
    if (!this.config.enableTransitionLogging) return;

    const transition: PhaseTransition = {
      sessionId,
      fromPhase,
      toPhase,
      timestamp: Date.now(),
      duration,
      payload: { ...payload },
      success: this.isValidTransition(fromPhase, toPhase),
      errors: this.validateTransition(fromPhase, toPhase, payload),
    };

    let log = this.transitionLogs.get(sessionId);
    if (!log) {
      log = {
        sessionId,
        transitions: [],
        totalTransitions: 0,
        successfulTransitions: 0,
        averageTransitionTime: 0,
      };
      this.transitionLogs.set(sessionId, log);
    }

    log.transitions.push(transition);
    log.totalTransitions++;
    if (transition.success) {
      log.successfulTransitions++;
    }

    // Update average transition time
    const totalTime = log.transitions.reduce((sum, t) => sum + t.duration, 0);
    log.averageTransitionTime = totalTime / log.transitions.length;

    logger.info(
      `[FSM-TRANSITION] ${fromPhase} -> ${toPhase} (${duration}ms) ${transition.success ? 'SUCCESS' : 'FAILED'}`
    );
    if (transition.errors && transition.errors.length > 0) {
      logger.warn(`[FSM-TRANSITION-ERRORS] ${transition.errors.join(', ')}`);
    }
  }

  /**
   * Gets transition log for a session
   */
  getTransitionLog(sessionId: string): TransitionLog | undefined {
    return this.transitionLogs.get(sessionId);
  }

  /**
   * Validates phase consistency
   */
  private validatePhaseConsistency(sessionState: SessionState): {
    totalChecks: number;
    passedChecks: number;
    errors: ValidationError[];
    warnings: ValidationWarning[];
  } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const totalChecks = 3;
    let passedChecks = 0;

    // Check if phase is valid
    const validPhases: Phase[] = [
      'INIT',
      'QUERY',
      'ENHANCE',
      'KNOWLEDGE',
      'PLAN',
      'EXECUTE',
      'VERIFY',
      'DONE',
    ];
    if (validPhases.includes(sessionState.current_phase)) {
      passedChecks++;
    } else {
      errors.push({
        code: 'INVALID_PHASE',
        message: `Invalid phase: ${sessionState.current_phase}`,
        severity: 'critical',
        phase: sessionState.current_phase,
      });
    }

    // Check if objective exists
    if (sessionState.initial_objective && sessionState.initial_objective.trim().length > 0) {
      passedChecks++;
    } else {
      errors.push({
        code: 'MISSING_OBJECTIVE',
        message: 'Initial objective is missing or empty',
        severity: 'high',
        phase: sessionState.current_phase,
      });
    }

    // Check reasoning effectiveness bounds
    if (sessionState.reasoning_effectiveness >= 0 && sessionState.reasoning_effectiveness <= 1) {
      passedChecks++;
    } else {
      errors.push({
        code: 'INVALID_REASONING_EFFECTIVENESS',
        message: `Reasoning effectiveness out of bounds: ${sessionState.reasoning_effectiveness}`,
        severity: 'medium',
        phase: sessionState.current_phase,
      });
    }

    // Warning for low reasoning effectiveness
    if (sessionState.reasoning_effectiveness < this.config.minReasoningEffectiveness) {
      warnings.push({
        code: 'LOW_REASONING_EFFECTIVENESS',
        message: `Reasoning effectiveness is low: ${sessionState.reasoning_effectiveness}`,
        phase: sessionState.current_phase,
        suggestion: 'Consider task complexity adjustment or performance review',
      });
    }

    return { totalChecks, passedChecks, errors, warnings };
  }

  /**
   * Validates payload integrity
   */
  private validatePayloadIntegrity(sessionState: SessionState): {
    totalChecks: number;
    passedChecks: number;
    errors: ValidationError[];
    warnings: ValidationWarning[];
  } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const totalChecks = 4;
    let passedChecks = 0;

    // Check payload exists
    if (sessionState.payload && typeof sessionState.payload === 'object') {
      passedChecks++;
    } else {
      errors.push({
        code: 'MISSING_PAYLOAD',
        message: 'Payload is missing or invalid',
        severity: 'high',
        phase: sessionState.current_phase,
      });
      return { totalChecks, passedChecks, errors, warnings };
    }

    const payload = sessionState.payload;

    // Check task index validity
    const currentTaskIndex =
      typeof payload.current_task_index === 'number' ? payload.current_task_index : 0;
    const totalTasks = Array.isArray(payload.current_todos) ? payload.current_todos.length : 0;
    if (currentTaskIndex >= 0 && currentTaskIndex < Math.max(totalTasks, 1)) {
      passedChecks++;
    } else if (totalTasks > 0) {
      errors.push({
        code: 'INVALID_TASK_INDEX',
        message: `Task index out of bounds: ${currentTaskIndex}/${totalTasks}`,
        severity: 'medium',
        phase: sessionState.current_phase,
        context: { currentTaskIndex, totalTasks },
      });
    } else {
      passedChecks++; // No tasks is valid state
    }

    // Check phase transition count
    if (typeof payload.phase_transition_count === 'number' && payload.phase_transition_count >= 0) {
      passedChecks++;
    } else {
      warnings.push({
        code: 'MISSING_TRANSITION_COUNT',
        message: 'Phase transition count is missing or invalid',
        phase: sessionState.current_phase,
        suggestion: 'Initialize phase_transition_count to 0',
      });
    }

    // Check for excessive task count
    if (totalTasks <= this.config.maxTasksPerPhase) {
      passedChecks++;
    } else {
      warnings.push({
        code: 'EXCESSIVE_TASK_COUNT',
        message: `High task count: ${totalTasks} (max recommended: ${this.config.maxTasksPerPhase})`,
        phase: sessionState.current_phase,
        suggestion: 'Consider breaking down complex tasks',
      });
    }

    return { totalChecks, passedChecks, errors, warnings };
  }

  /**
   * Validates task states
   */
  private validateTaskStates(sessionState: SessionState): {
    totalChecks: number;
    passedChecks: number;
    errors: ValidationError[];
    warnings: ValidationWarning[];
  } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const todos = Array.isArray(sessionState.payload?.current_todos)
      ? sessionState.payload.current_todos
      : [];
    let totalChecks = todos.length * 3; // 3 checks per todo
    let passedChecks = 0;

    if (todos.length === 0) {
      totalChecks = 1;
      passedChecks = 1; // Empty todos is valid
      return { totalChecks, passedChecks, errors, warnings };
    }

    todos.forEach((todo: TodoItem, index: number) => {
      // Check todo structure
      if (todo.id && todo.content && todo.status && todo.priority) {
        passedChecks++;
      } else {
        errors.push({
          code: 'INVALID_TODO_STRUCTURE',
          message: `Todo at index ${index} has invalid structure`,
          severity: 'medium',
          phase: sessionState.current_phase,
          context: { todoIndex: index, todo },
        });
      }

      // Check status validity
      const validStatuses = ['pending', 'in_progress', 'completed'];
      if (validStatuses.includes(todo.status)) {
        passedChecks++;
      } else {
        errors.push({
          code: 'INVALID_TODO_STATUS',
          message: `Todo at index ${index} has invalid status: ${todo.status}`,
          severity: 'medium',
          phase: sessionState.current_phase,
          context: { todoIndex: index, status: todo.status },
        });
      }

      // Check priority validity
      const validPriorities = ['high', 'medium', 'low'];
      if (validPriorities.includes(todo.priority)) {
        passedChecks++;
      } else {
        errors.push({
          code: 'INVALID_TODO_PRIORITY',
          message: `Todo at index ${index} has invalid priority: ${todo.priority}`,
          severity: 'medium',
          phase: sessionState.current_phase,
          context: { todoIndex: index, priority: todo.priority },
        });
      }
    });

    // Check for multiple in_progress tasks (should be at most 1)
    const inProgressTasks = todos.filter((todo: TodoItem) => todo.status === 'in_progress');
    if (inProgressTasks.length > 1) {
      warnings.push({
        code: 'MULTIPLE_IN_PROGRESS_TASKS',
        message: `Multiple tasks in progress: ${inProgressTasks.length}`,
        phase: sessionState.current_phase,
        suggestion: 'Consider focusing on one task at a time',
      });
    }

    return { totalChecks, passedChecks, errors, warnings };
  }

  /**
   * Validates performance metrics
   */
  private validatePerformanceMetrics(sessionState: SessionState): {
    totalChecks: number;
    passedChecks: number;
    errors: ValidationError[];
    warnings: ValidationWarning[];
  } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const totalChecks = 2;
    let passedChecks = 0;

    // Check last activity timestamp
    if (typeof sessionState.last_activity === 'number' && sessionState.last_activity > 0) {
      passedChecks++;
    } else {
      warnings.push({
        code: 'MISSING_LAST_ACTIVITY',
        message: 'Last activity timestamp is missing or invalid',
        phase: sessionState.current_phase,
        suggestion: 'Initialize last_activity timestamp',
      });
    }

    // Check API usage metrics if they exist
    const apiMetrics = sessionState.payload?.api_usage_metrics as APIUsageMetrics;
    if (apiMetrics) {
      if (this.validateAPIMetrics(apiMetrics)) {
        passedChecks++;
      } else {
        warnings.push({
          code: 'INVALID_API_METRICS',
          message: 'API usage metrics contain invalid values',
          phase: sessionState.current_phase,
          suggestion: 'Verify API metrics calculation logic',
        });
      }
    } else {
      passedChecks++; // No API metrics is valid
    }

    return { totalChecks, passedChecks, errors, warnings };
  }

  /**
   * Validates API usage metrics
   */
  private validateAPIMetrics(metrics: APIUsageMetrics): boolean {
    return (
      typeof metrics.apis_discovered === 'number' &&
      typeof metrics.apis_queried === 'number' &&
      typeof metrics.synthesis_confidence === 'number' &&
      typeof metrics.processing_time === 'number' &&
      metrics.apis_discovered >= 0 &&
      metrics.apis_queried >= 0 &&
      metrics.apis_queried <= metrics.apis_discovered &&
      metrics.synthesis_confidence >= 0 &&
      metrics.synthesis_confidence <= 1 &&
      metrics.processing_time >= 0
    );
  }

  /**
   * Checks if a phase transition is valid
   */
  private isValidTransition(fromPhase: Phase, toPhase: Phase): boolean {
    const validTransitions: Record<Phase, Phase[]> = {
      INIT: ['QUERY'],
      QUERY: ['ENHANCE'],
      ENHANCE: ['KNOWLEDGE'],
      KNOWLEDGE: ['PLAN'],
      PLAN: ['EXECUTE'],
      EXECUTE: ['EXECUTE', 'VERIFY'], // Can stay in EXECUTE for multiple tasks
      VERIFY: ['EXECUTE', 'PLAN', 'DONE'], // Can rollback based on verification
      DONE: ['DONE'], // Terminal state
    };

    return validTransitions[fromPhase]?.includes(toPhase) || false;
  }

  /**
   * Validates a specific transition
   */
  private validateTransition(
    fromPhase: Phase,
    toPhase: Phase,
    payload: Record<string, unknown>
  ): string[] {
    const errors: string[] = [];

    if (!this.isValidTransition(fromPhase, toPhase)) {
      errors.push(`Invalid transition from ${fromPhase} to ${toPhase}`);
    }

    // Phase-specific validation
    switch (toPhase) {
      case 'ENHANCE':
        if (!payload.interpreted_goal) {
          errors.push('Missing interpreted_goal for ENHANCE phase');
        }
        break;
      case 'KNOWLEDGE':
        if (!payload.enhanced_goal) {
          errors.push('Missing enhanced_goal for KNOWLEDGE phase');
        }
        break;
      case 'PLAN':
        if (!payload.knowledge_gathered && !payload.synthesized_knowledge) {
          errors.push('Missing knowledge for PLAN phase');
        }
        break;
      case 'EXECUTE':
        if (!Array.isArray(payload.current_todos) || payload.current_todos.length === 0) {
          errors.push('Missing todos for EXECUTE phase');
        }
        break;
      case 'VERIFY':
        if (typeof payload.execution_success !== 'boolean') {
          errors.push('Missing execution_success for VERIFY phase');
        }
        break;
    }

    return errors;
  }

  /**
   * Calculates transition integrity score
   */
  private calculateTransitionIntegrityScore(_sessionState: SessionState): number {
    const log = this.transitionLogs.get('current'); // Simplified for demo
    if (!log || log.totalTransitions === 0) return 1.0;

    return log.successfulTransitions / log.totalTransitions;
  }

  /**
   * Generates recommendations based on validation results
   */
  private generateRecommendations(
    errors: ValidationError[],
    warnings: ValidationWarning[],
    sessionState: SessionState
  ): string[] {
    const recommendations: string[] = [];

    // Critical error recommendations
    const criticalErrors = errors.filter(e => e.severity === 'critical');
    if (criticalErrors.length > 0) {
      recommendations.push(
        'CRITICAL: Address critical errors immediately to prevent system instability'
      );
    }

    // Phase-specific recommendations
    switch (sessionState.current_phase) {
      case 'EXECUTE':
        if (
          Array.isArray(sessionState.payload?.current_todos) &&
          sessionState.payload.current_todos.length > 10
        ) {
          recommendations.push(
            'Consider breaking down large task lists into smaller, manageable chunks'
          );
        }
        break;
      case 'VERIFY': {
        const completionPercentage = this.calculateCompletionPercentage(sessionState);
        if (completionPercentage < this.config.requiredCompletionThreshold) {
          recommendations.push(
            `Completion rate (${(completionPercentage * 100).toFixed(1)}%) below threshold`
          );
        }
        break;
      }
    }

    // Performance recommendations
    if (sessionState.reasoning_effectiveness < 0.5) {
      recommendations.push(
        'Low reasoning effectiveness detected - review task complexity and approach'
      );
    }

    // Warning-based recommendations
    warnings.forEach(warning => {
      if (warning.suggestion) {
        recommendations.push(warning.suggestion);
      }
    });

    return recommendations;
  }

  /**
   * Calculates completion percentage for verification
   */
  private calculateCompletionPercentage(sessionState: SessionState): number {
    const todos = Array.isArray(sessionState.payload?.current_todos)
      ? sessionState.payload.current_todos
      : [];
    if (todos.length === 0) return 1.0;

    const completed = todos.filter((todo: TodoItem) => todo.status === 'completed').length;
    return completed / todos.length;
  }
}

// Export convenience functions
export function createValidator(config?: Partial<ValidationConfig>): FSMStateValidator {
  const fullConfig = { ...DEFAULT_VALIDATION_CONFIG, ...config };
  return new FSMStateValidator(fullConfig);
}

export function validateFSMState(
  sessionState: SessionState,
  config?: Partial<ValidationConfig>
): StateValidationResult {
  const validator = createValidator(config);
  return validator.validateState(sessionState);
}
