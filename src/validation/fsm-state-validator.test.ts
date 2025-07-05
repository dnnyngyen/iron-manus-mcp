// FSM State Validator Test Suite
// Comprehensive testing with mock FSM state data and edge cases

import { describe, it, expect, beforeEach } from 'vitest';
import { FSMStateValidator, createValidator } from './fsm-state-validator.js';
import { SessionState, Phase, TodoItem } from '../core/types.js';

describe('FSMStateValidator', () => {
  let validator: FSMStateValidator;

  beforeEach(() => {
    validator = createValidator();
  });

  describe('State Validation', () => {
    it('should validate a valid session state', () => {
      const validState: SessionState = createValidSessionState();
      const result = validator.validateState(validState);

      expect(result.isValid).toBe(true);
      expect(result.errors.filter(e => e.severity === 'critical')).toHaveLength(0);
      expect(result.metrics.stateConsistencyScore).toBeGreaterThan(0.8);
    });

    it('should detect critical phase validation errors', () => {
      const invalidState: SessionState = {
        ...createValidSessionState(),
        current_phase: 'INVALID_PHASE' as Phase,
      };

      const result = validator.validateState(invalidState);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'INVALID_PHASE')).toBe(true);
      expect(result.errors.some(e => e.severity === 'critical')).toBe(true);
    });

    it('should detect missing objective errors', () => {
      const invalidState: SessionState = {
        ...createValidSessionState(),
        initial_objective: '',
      };

      const result = validator.validateState(invalidState);

      expect(result.errors.some(e => e.code === 'MISSING_OBJECTIVE')).toBe(true);
      expect(result.errors.some(e => e.severity === 'high')).toBe(true);
    });

    it('should detect invalid reasoning effectiveness', () => {
      const invalidState: SessionState = {
        ...createValidSessionState(),
        reasoning_effectiveness: 1.5, // Out of bounds
      };

      const result = validator.validateState(invalidState);

      expect(result.errors.some(e => e.code === 'INVALID_REASONING_EFFECTIVENESS')).toBe(true);
    });

    it('should warn about low reasoning effectiveness', () => {
      const lowEffectivenessState: SessionState = {
        ...createValidSessionState(),
        reasoning_effectiveness: 0.2, // Below threshold
      };

      const result = validator.validateState(lowEffectivenessState);

      expect(result.warnings.some(w => w.code === 'LOW_REASONING_EFFECTIVENESS')).toBe(true);
    });
  });

  describe('Payload Validation', () => {
    it('should detect missing payload', () => {
      const invalidState: SessionState = {
        ...createValidSessionState(),
        payload: undefined as any,
      };

      const result = validator.validateState(invalidState);

      expect(result.errors.some(e => e.code === 'MISSING_PAYLOAD')).toBe(true);
    });

    it('should detect invalid task index', () => {
      const invalidState: SessionState = {
        ...createValidSessionState(),
        payload: {
          current_task_index: 5,
          current_todos: [createValidTodo(), createValidTodo()], // Only 2 todos
          phase_transition_count: 3,
        },
      };

      const result = validator.validateState(invalidState);

      expect(result.errors.some(e => e.code === 'INVALID_TASK_INDEX')).toBe(true);
    });

    it('should warn about excessive task count', () => {
      const manyTodos = Array(60)
        .fill(0)
        .map((_, i) => createValidTodo(`task-${i}`));
      const stateWithManyTasks: SessionState = {
        ...createValidSessionState(),
        payload: {
          current_task_index: 0,
          current_todos: manyTodos,
          phase_transition_count: 1,
        },
      };

      const result = validator.validateState(stateWithManyTasks);

      expect(result.warnings.some(w => w.code === 'EXCESSIVE_TASK_COUNT')).toBe(true);
    });
  });

  describe('Task State Validation', () => {
    it('should validate well-formed todos', () => {
      const validState: SessionState = createValidSessionState();
      const result = validator.validateState(validState);

      expect(result.errors.filter(e => e.code.includes('TODO')).length).toBe(0);
    });

    it('should detect invalid todo structure', () => {
      const invalidState: SessionState = {
        ...createValidSessionState(),
        payload: {
          current_task_index: 0,
          current_todos: [
            { id: 'test-1', content: 'Test task' } as TodoItem, // Missing status and priority
          ],
          phase_transition_count: 1,
        },
      };

      const result = validator.validateState(invalidState);

      expect(result.errors.some(e => e.code === 'INVALID_TODO_STRUCTURE')).toBe(true);
    });

    it('should detect invalid todo status', () => {
      const invalidState: SessionState = {
        ...createValidSessionState(),
        payload: {
          current_task_index: 0,
          current_todos: [
            {
              id: 'test-1',
              content: 'Test task',
              status: 'invalid_status' as any,
              priority: 'high',
            },
          ],
          phase_transition_count: 1,
        },
      };

      const result = validator.validateState(invalidState);

      expect(result.errors.some(e => e.code === 'INVALID_TODO_STATUS')).toBe(true);
    });

    it('should warn about multiple in-progress tasks', () => {
      const invalidState: SessionState = {
        ...createValidSessionState(),
        payload: {
          current_task_index: 0,
          current_todos: [
            { ...createValidTodo('task-1'), status: 'in_progress' },
            { ...createValidTodo('task-2'), status: 'in_progress' },
            { ...createValidTodo('task-3'), status: 'pending' },
          ],
          phase_transition_count: 1,
        },
      };

      const result = validator.validateState(invalidState);

      expect(result.warnings.some(w => w.code === 'MULTIPLE_IN_PROGRESS_TASKS')).toBe(true);
    });
  });

  describe('API Metrics Validation', () => {
    it('should validate valid API metrics', () => {
      const stateWithValidAPIMetrics: SessionState = {
        ...createValidSessionState(),
        payload: {
          ...createValidSessionState().payload,
          api_usage_metrics: {
            apis_discovered: 5,
            apis_queried: 3,
            synthesis_confidence: 0.85,
            processing_time: 1250,
            discovery_success_rate: 1.0,
            api_response_time: 800,
            knowledge_synthesis_quality: 0.9,
          },
        },
      };

      const result = validator.validateState(stateWithValidAPIMetrics);

      expect(result.warnings.filter(w => w.code === 'INVALID_API_METRICS').length).toBe(0);
    });

    it('should detect invalid API metrics', () => {
      const stateWithInvalidAPIMetrics: SessionState = {
        ...createValidSessionState(),
        payload: {
          ...createValidSessionState().payload,
          api_usage_metrics: {
            apis_discovered: -1, // Invalid negative value
            apis_queried: 5, // More queried than discovered
            synthesis_confidence: 1.5, // Out of bounds
            processing_time: -100, // Invalid negative time
          },
        },
      };

      const result = validator.validateState(stateWithInvalidAPIMetrics);

      expect(result.warnings.some(w => w.code === 'INVALID_API_METRICS')).toBe(true);
    });
  });

  describe('Phase Transition Logging', () => {
    it('should log valid phase transitions', () => {
      const sessionId = 'test-session-123';

      validator.logPhaseTransition(
        sessionId,
        'QUERY',
        'ENHANCE',
        { interpreted_goal: 'Test goal' },
        150
      );

      const log = validator.getTransitionLog(sessionId);

      expect(log).toBeDefined();
      expect(log!.transitions).toHaveLength(1);
      expect(log!.transitions[0].success).toBe(true);
      expect(log!.transitions[0].fromPhase).toBe('QUERY');
      expect(log!.transitions[0].toPhase).toBe('ENHANCE');
    });

    it('should log invalid phase transitions', () => {
      const sessionId = 'test-session-456';

      validator.logPhaseTransition(sessionId, 'QUERY', 'EXECUTE', {}, 100); // Invalid jump

      const log = validator.getTransitionLog(sessionId);

      expect(log!.transitions[0].success).toBe(false);
      expect(log!.transitions[0].errors).toContain('Invalid transition from QUERY to EXECUTE');
    });

    it('should track transition metrics', () => {
      const sessionId = 'test-session-789';

      // Log multiple transitions
      validator.logPhaseTransition(sessionId, 'INIT', 'QUERY', {}, 100);
      validator.logPhaseTransition(
        sessionId,
        'QUERY',
        'ENHANCE',
        { interpreted_goal: 'Test' },
        200
      );
      validator.logPhaseTransition(
        sessionId,
        'ENHANCE',
        'KNOWLEDGE',
        { enhanced_goal: 'Enhanced' },
        300
      );

      const log = validator.getTransitionLog(sessionId);

      expect(log!.totalTransitions).toBe(3);
      expect(log!.successfulTransitions).toBe(3);
      expect(log!.averageTransitionTime).toBe(200); // (100+200+300)/3
    });

    it('should validate transition requirements', () => {
      const sessionId = 'test-session-validation';

      // Missing required payload for ENHANCE phase
      validator.logPhaseTransition(sessionId, 'QUERY', 'ENHANCE', {}, 100);

      const log = validator.getTransitionLog(sessionId);
      const transition = log!.transitions[0];

      expect(transition.errors).toContain('Missing interpreted_goal for ENHANCE phase');
    });
  });

  describe('Recommendations', () => {
    it('should generate phase-specific recommendations for EXECUTE phase', () => {
      const manyTodos = Array(15)
        .fill(0)
        .map((_, i) => createValidTodo(`task-${i}`));
      const executeState: SessionState = {
        ...createValidSessionState(),
        current_phase: 'EXECUTE',
        payload: {
          current_task_index: 0,
          current_todos: manyTodos,
          phase_transition_count: 5,
        },
      };

      const result = validator.validateState(executeState);

      expect(result.recommendations.some(r => r.includes('breaking down large task lists'))).toBe(
        true
      );
    });

    it('should recommend performance improvements for low effectiveness', () => {
      const lowPerformanceState: SessionState = {
        ...createValidSessionState(),
        reasoning_effectiveness: 0.4,
      };

      const result = validator.validateState(lowPerformanceState);

      expect(result.recommendations.some(r => r.includes('reasoning effectiveness'))).toBe(true);
    });

    it('should generate completion recommendations for VERIFY phase', () => {
      const incompleteVerifyState: SessionState = {
        ...createValidSessionState(),
        current_phase: 'VERIFY',
        payload: {
          current_task_index: 2,
          current_todos: [
            { ...createValidTodo('task-1'), status: 'completed' },
            { ...createValidTodo('task-2'), status: 'pending' },
            { ...createValidTodo('task-3'), status: 'in_progress' },
          ],
          phase_transition_count: 6,
        },
      };

      const result = validator.validateState(incompleteVerifyState);

      expect(result.recommendations.some(r => r.includes('Completion rate'))).toBe(true);
    });
  });

  describe('Configuration Options', () => {
    it('should respect strict mode configuration', () => {
      const strictValidator = createValidator({ strictMode: true });
      const lenientValidator = createValidator({ strictMode: false });

      const borderlineState: SessionState = {
        ...createValidSessionState(),
        reasoning_effectiveness: 0.25, // Below minimum
      };

      const strictResult = strictValidator.validateState(borderlineState);
      const lenientResult = lenientValidator.validateState(borderlineState);

      // Both should detect the issue, but strict mode may be more sensitive
      expect(strictResult.warnings.length).toBeGreaterThanOrEqual(lenientResult.warnings.length);
    });

    it('should disable transition logging when configured', () => {
      const noLogValidator = createValidator({ enableTransitionLogging: false });
      const sessionId = 'no-log-test';

      noLogValidator.logPhaseTransition(sessionId, 'INIT', 'QUERY', {}, 100);

      const log = noLogValidator.getTransitionLog(sessionId);
      expect(log).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty session state gracefully', () => {
      const emptyState: SessionState = {
        current_phase: 'INIT',
        initial_objective: 'Test objective',
        detected_role: 'coder',
        payload: {},
        reasoning_effectiveness: 0.5,
        last_activity: Date.now(),
      };

      const result = validator.validateState(emptyState);

      expect(result.isValid).toBe(true); // Empty payload is valid for INIT phase
    });

    it('should handle null/undefined values gracefully', () => {
      const nullState: SessionState = {
        current_phase: 'EXECUTE',
        initial_objective: 'Test objective',
        detected_role: 'coder',
        payload: {
          current_task_index: 0,
          current_todos: null as any,
          phase_transition_count: 1,
        },
        reasoning_effectiveness: 0.5,
        last_activity: Date.now(),
      };

      const result = validator.validateState(nullState);

      // Should handle gracefully without crashing
      expect(result.errors.some(e => e.code === 'MISSING_PAYLOAD')).toBe(false);
    });

    it('should validate DONE phase correctly', () => {
      const doneState: SessionState = {
        ...createValidSessionState(),
        current_phase: 'DONE',
        payload: {
          ...createValidSessionState().payload,
          current_todos: [
            { ...createValidTodo('task-1'), status: 'completed' },
            { ...createValidTodo('task-2'), status: 'completed' },
          ],
        },
      };

      const result = validator.validateState(doneState);

      expect(result.isValid).toBe(true);
      expect(result.metrics.stateConsistencyScore).toBeGreaterThan(0.9);
    });
  });
});

// Helper functions for creating test data
function createValidSessionState(): SessionState {
  return {
    current_phase: 'EXECUTE',
    initial_objective: 'Implement user authentication system with secure password handling',
    detected_role: 'coder',
    payload: {
      current_task_index: 0,
      current_todos: [
        createValidTodo('task-1'),
        createValidTodo('task-2'),
        createValidTodo('task-3'),
      ],
      phase_transition_count: 4,
      interpreted_goal: 'Build secure authentication',
      enhanced_goal: 'Implement JWT-based authentication with password hashing',
      synthesized_knowledge: 'Use bcrypt for password hashing, implement JWT tokens',
      plan_created: true,
    },
    reasoning_effectiveness: 0.75,
    last_activity: Date.now(),
  };
}

function createValidTodo(id: string = 'test-todo'): TodoItem {
  return {
    id,
    content: `Test task content for ${id}`,
    status: 'pending',
    priority: 'medium',
    type: 'DirectExecution',
  };
}

// Integration test with realistic FSM scenarios
describe('FSM Integration Scenarios', () => {
  let validator: FSMStateValidator;

  beforeEach(() => {
    validator = createValidator();
  });

  it('should validate complete authentication system implementation scenario', () => {
    const authSystemState: SessionState = {
      current_phase: 'VERIFY',
      initial_objective:
        'Implement secure user authentication system with JWT tokens and password reset functionality',
      detected_role: 'coder',
      payload: {
        current_task_index: 4,
        current_todos: [
          {
            id: 'auth-1',
            content: 'Set up JWT token generation and validation',
            status: 'completed',
            priority: 'high',
            type: 'DirectExecution',
          },
          {
            id: 'auth-2',
            content: 'Implement password hashing with bcrypt',
            status: 'completed',
            priority: 'high',
            type: 'DirectExecution',
          },
          {
            id: 'auth-3',
            content: 'Create password reset flow with email verification',
            status: 'completed',
            priority: 'medium',
            type: 'DirectExecution',
          },
          {
            id: 'auth-4',
            content: 'Add rate limiting for authentication endpoints',
            status: 'completed',
            priority: 'high',
            type: 'DirectExecution',
          },
          {
            id: 'auth-5',
            content: 'Write comprehensive test suite for auth system',
            status: 'in_progress',
            priority: 'medium',
            type: 'DirectExecution',
          },
        ],
        phase_transition_count: 6,
        interpreted_goal: 'Build secure authentication system',
        enhanced_goal: 'Implement JWT-based authentication with comprehensive security features',
        synthesized_knowledge:
          'JWT tokens, bcrypt hashing, rate limiting, email verification patterns',
        plan_created: true,
        execution_success: true,
        api_usage_metrics: {
          apis_discovered: 3,
          apis_queried: 2,
          synthesis_confidence: 0.92,
          processing_time: 2340,
          discovery_success_rate: 1.0,
          api_response_time: 450,
          knowledge_synthesis_quality: 0.88,
        },
      },
      reasoning_effectiveness: 0.88,
      last_activity: Date.now(),
    };

    const result = validator.validateState(authSystemState);

    expect(result.isValid).toBe(true);
    expect(result.metrics.stateConsistencyScore).toBeGreaterThan(0.85);
    expect(result.errors.filter(e => e.severity === 'critical')).toHaveLength(0);

    // Should warn about one task still in progress during VERIFY phase
    expect(result.recommendations.some(r => r.includes('Completion rate'))).toBe(true);
  });

  it('should handle complex UI architecture scenario with fractal orchestration', () => {
    const uiArchitectureState: SessionState = {
      current_phase: 'EXECUTE',
      initial_objective:
        'Design and implement a responsive dashboard with data visualization components',
      detected_role: 'ui_architect',
      payload: {
        current_task_index: 2,
        current_todos: [
          {
            id: 'ui-1',
            content:
              '(ROLE: ui_architect) (CONTEXT: dashboard_layout) Design responsive grid system for dashboard (OUTPUT: layout_specifications)',
            status: 'completed',
            priority: 'high',
            type: 'TaskAgent',
            meta_prompt: {
              role_specification: 'ui_architect',
              context_parameters: { domain: 'dashboard_layout' },
              instruction_block: 'Design responsive grid system for dashboard',
              output_requirements: 'layout_specifications',
            },
          },
          {
            id: 'ui-2',
            content:
              '(ROLE: ui_implementer) (CONTEXT: data_visualization) Implement chart components with D3.js (OUTPUT: reusable_chart_components)',
            status: 'completed',
            priority: 'high',
            type: 'TaskAgent',
            meta_prompt: {
              role_specification: 'ui_implementer',
              context_parameters: { domain: 'data_visualization' },
              instruction_block: 'Implement chart components with D3.js',
              output_requirements: 'reusable_chart_components',
            },
          },
          {
            id: 'ui-3',
            content:
              '(ROLE: ui_refiner) (CONTEXT: accessibility_compliance) Add ARIA labels and keyboard navigation (OUTPUT: accessible_dashboard)',
            status: 'in_progress',
            priority: 'medium',
            type: 'TaskAgent',
            meta_prompt: {
              role_specification: 'ui_refiner',
              context_parameters: { domain: 'accessibility_compliance' },
              instruction_block: 'Add ARIA labels and keyboard navigation',
              output_requirements: 'accessible_dashboard',
            },
          },
        ],
        phase_transition_count: 5,
        interpreted_goal: 'Create responsive dashboard with data visualization',
        enhanced_goal:
          'Build accessible, responsive dashboard with interactive data visualization components',
        synthesized_knowledge:
          'CSS Grid, D3.js patterns, WCAG 2.1 guidelines, responsive design principles',
        plan_created: true,
      },
      reasoning_effectiveness: 0.82,
      last_activity: Date.now(),
    };

    const result = validator.validateState(uiArchitectureState);

    expect(result.isValid).toBe(true);
    expect(result.metrics.stateConsistencyScore).toBeGreaterThan(0.8);

    // Should not warn about single in-progress task (normal for EXECUTE phase)
    expect(result.warnings.filter(w => w.code === 'MULTIPLE_IN_PROGRESS_TASKS')).toHaveLength(0);
  });
});
