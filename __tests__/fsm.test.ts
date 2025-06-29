// FSM phase transition tests
import { describe, it, expect, beforeEach } from 'vitest';
import { createFSM } from '../src/phase-engine/FSM.js';
import { validateTaskCompletion } from '../src/verification/metrics.js';
import { autoFetchAPIs, autoSynthesize, AUTO_CONNECTION_CONFIG } from '../src/knowledge/autoConnection.js';

describe('FSM Phase Transitions', () => {
  let fsm: ReturnType<typeof createFSM>;
  
  beforeEach(() => {
    fsm = createFSM({
      knowledge: {
        autoFetch: autoFetchAPIs,
        autoSynthesize: autoSynthesize,
        config: AUTO_CONNECTION_CONFIG,
      },
      verification: {
        validateCompletion: validateTaskCompletion,
      },
    });
  });

  it('should transition from INIT to QUERY', async () => {
    const input = {
      session_id: 'test-session',
      initial_objective: 'Test objective'
    };

    const result = await fsm.processState(input);
    
    expect(result.next_phase).toBe('QUERY');
    expect(result.status).toBe('IN_PROGRESS');
    expect(result.system_prompt).toContain('QUERY');
  });

  it('should transition QUERY -> ENHANCE -> KNOWLEDGE -> PLAN -> EXECUTE -> VERIFY -> DONE', async () => {
    const sessionId = 'test-flow';
    
    // INIT -> QUERY
    let result = await fsm.processState({
      session_id: sessionId,
      initial_objective: 'Create a simple function'
    });
    expect(result.next_phase).toBe('QUERY');

    // QUERY -> ENHANCE
    result = await fsm.processState({
      session_id: sessionId,
      phase_completed: 'QUERY',
      payload: { interpreted_goal: 'Create a function that adds two numbers' }
    });
    expect(result.next_phase).toBe('ENHANCE');

    // ENHANCE -> KNOWLEDGE
    result = await fsm.processState({
      session_id: sessionId,
      phase_completed: 'ENHANCE',
      payload: { enhanced_goal: 'Create a TypeScript function that adds two numbers with type safety' }
    });
    expect(result.next_phase).toBe('KNOWLEDGE');

    // KNOWLEDGE -> PLAN
    result = await fsm.processState({
      session_id: sessionId,
      phase_completed: 'KNOWLEDGE',
      payload: { knowledge_gathered: 'TypeScript function syntax research' }
    });
    expect(result.next_phase).toBe('PLAN');

    // PLAN -> EXECUTE
    result = await fsm.processState({
      session_id: sessionId,
      phase_completed: 'PLAN',
      payload: { 
        plan_created: true,
        todos_with_metaprompts: [
          { content: 'Create TypeScript function', status: 'pending', priority: 'high' }
        ]
      }
    });
    expect(result.next_phase).toBe('EXECUTE');

    // EXECUTE -> VERIFY
    result = await fsm.processState({
      session_id: sessionId,
      phase_completed: 'EXECUTE',
      payload: { execution_success: true }
    });
    expect(result.next_phase).toBe('VERIFY');

    // VERIFY -> DONE
    result = await fsm.processState({
      session_id: sessionId,
      phase_completed: 'VERIFY',
      payload: { verification_passed: true }
    });
    expect(result.next_phase).toBe('DONE');
    expect(result.status).toBe('DONE');
  });

  it('should handle verification failure with rollback', async () => {
    const sessionId = 'test-rollback';
    
    // Set up session to VERIFY phase with incomplete tasks
    const session = {
      current_phase: 'VERIFY',
      initial_objective: 'Test rollback',
      detected_role: 'coder',
      reasoning_effectiveness: 0.8,
      payload: {
        current_todos: [
          { status: 'completed', priority: 'high' },
          { status: 'pending', priority: 'medium' }
        ]
      }
    };

    const result = await fsm.processState({
      session_id: sessionId,
      phase_completed: 'VERIFY',
      payload: { verification_passed: false }
    });

    // Should rollback to EXECUTE due to incomplete tasks
    expect(result.next_phase).toBe('EXECUTE');
  });
});