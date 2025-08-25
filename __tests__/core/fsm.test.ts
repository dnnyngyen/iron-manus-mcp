// FSM Core Tests - Tests for the 6-phase finite state machine
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { processState, extractMetaPromptFromTodo, validateTaskCompletion } from '../../src/core/fsm.js';
import { graphStateManager } from '../../src/core/graph-state-adapter.js';
import { MessageJARVIS, Phase, Role } from '../../src/core/types.js';

// Mock the graph state manager
vi.mock('../../src/core/graph-state-adapter.js', () => ({
  graphStateManager: {
    getSessionState: vi.fn(),
    updateSessionState: vi.fn(),
  }
}));

// Mock the autoConnection module to prevent real HTTP requests
vi.mock('../../src/knowledge/autoConnection.js', () => ({
  autoConnection: vi.fn().mockResolvedValue({
    answer: 'Mock synthesized knowledge',
    contradictions: [],
    confidence: 0.8,
  }),
  AUTO_CONNECTION_CONFIG: {
    enabled: true,
    timeout_ms: 5000,
    max_concurrent: 3,
    confidence_threshold: 0.7,
    max_response_size: 100000,
  },
}));

describe('FSM Core Functionality', () => {
  const mockStateManager = graphStateManager as vi.Mocked<typeof graphStateManager>;
  const TEST_SESSION_ID = 'fsm-test-session';
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock session state
    mockStateManager.getSessionState.mockReturnValue({
      current_phase: 'INIT' as Phase,
      initial_objective: '',
      detected_role: 'researcher' as Role,
      payload: {},
      reasoning_effectiveness: 0.8,
      last_activity: Date.now()
    });
  });

  describe('Phase Transitions', () => {
    it('should initialize session with initial_objective', async () => {
      const input: MessageJARVIS = {
        session_id: TEST_SESSION_ID,
        initial_objective: 'Test objective'
      };

      const result = await processState(input);

      expect(result.next_phase).toBe('QUERY');
      expect(result.status).toBe('IN_PROGRESS');
      expect(result.system_prompt).toContain('analyzing the user\'s objective');
      expect(mockStateManager.updateSessionState).toHaveBeenCalled();
    });

    it('should transition from QUERY to ENHANCE when phase completed', async () => {
      mockStateManager.getSessionState.mockReturnValue({
        current_phase: 'QUERY' as Phase,
        initial_objective: 'Test objective',
        detected_role: 'researcher' as Role,
        payload: {},
        reasoning_effectiveness: 0.8,
        last_activity: Date.now()
      });

      const input: MessageJARVIS = {
        session_id: TEST_SESSION_ID,
        phase_completed: 'QUERY',
        payload: {
          interpreted_goal: 'Enhanced test objective'
        }
      };

      const result = await processState(input);

      expect(result.next_phase).toBe('ENHANCE');
      expect(result.status).toBe('IN_PROGRESS');
    });

    it('should transition from ENHANCE to KNOWLEDGE', async () => {
      mockStateManager.getSessionState.mockReturnValue({
        current_phase: 'ENHANCE' as Phase,
        initial_objective: 'Test objective',
        detected_role: 'researcher' as Role,
        payload: {
          interpreted_goal: 'Test goal'
        },
        reasoning_effectiveness: 0.8,
        last_activity: Date.now()
      });

      const input: MessageJARVIS = {
        session_id: TEST_SESSION_ID,
        phase_completed: 'ENHANCE',
        payload: {
          enhanced_goal: 'Enhanced test objective with details'
        }
      };

      const result = await processState(input);

      expect(result.next_phase).toBe('KNOWLEDGE');
      expect(result.system_prompt).toContain('KNOWLEDGE phase');
    });

    it('should transition from KNOWLEDGE to PLAN', async () => {
      mockStateManager.getSessionState.mockReturnValue({
        current_phase: 'KNOWLEDGE' as Phase,
        initial_objective: 'Test objective',
        detected_role: 'researcher' as Role,
        payload: {
          enhanced_goal: 'Enhanced goal'
        },
        reasoning_effectiveness: 0.8,
        last_activity: Date.now()
      });

      const input: MessageJARVIS = {
        session_id: TEST_SESSION_ID,
        phase_completed: 'KNOWLEDGE',
        payload: {
          knowledge_gathered: 'Relevant knowledge'
        }
      };

      const result = await processState(input);

      expect(result.next_phase).toBe('PLAN');
    });

    it('should transition from PLAN to EXECUTE', async () => {
      mockStateManager.getSessionState.mockReturnValue({
        current_phase: 'PLAN' as Phase,
        initial_objective: 'Test objective',
        detected_role: 'coder' as Role,
        payload: {},
        reasoning_effectiveness: 0.8,
        last_activity: Date.now()
      });

      const input: MessageJARVIS = {
        session_id: TEST_SESSION_ID,
        phase_completed: 'PLAN',
        payload: {
          plan_created: true,
          todos_with_metaprompts: []
        }
      };

      const result = await processState(input);

      expect(result.next_phase).toBe('EXECUTE');
    });

    it('should stay in EXECUTE phase when more tasks pending', async () => {
      mockStateManager.getSessionState.mockReturnValue({
        current_phase: 'EXECUTE' as Phase,
        initial_objective: 'Test objective',
        detected_role: 'coder' as Role,
        payload: {
          current_task_index: 0,
          current_todos: [
            { id: '1', content: 'Task 1', status: 'completed', priority: 'medium' },
            { id: '2', content: 'Task 2', status: 'pending', priority: 'medium' }
          ]
        },
        reasoning_effectiveness: 0.8,
        last_activity: Date.now()
      });

      const input: MessageJARVIS = {
        session_id: TEST_SESSION_ID,
        phase_completed: 'EXECUTE',
        payload: {
          execution_success: true
        }
      };

      const result = await processState(input);

      expect(result.next_phase).toBe('EXECUTE');
    });

    it('should transition from EXECUTE to VERIFY when all tasks complete', async () => {
      mockStateManager.getSessionState.mockReturnValue({
        current_phase: 'EXECUTE' as Phase,
        initial_objective: 'Test objective',
        detected_role: 'coder' as Role,
        payload: {
          current_task_index: 1,
          current_todos: [
            { id: '1', content: 'Task 1', status: 'completed', priority: 'medium' },
            { id: '2', content: 'Task 2', status: 'completed', priority: 'medium' }
          ]
        },
        reasoning_effectiveness: 0.8,
        last_activity: Date.now()
      });

      const input: MessageJARVIS = {
        session_id: TEST_SESSION_ID,
        phase_completed: 'EXECUTE',
        payload: {
          execution_success: true
        }
      };

      const result = await processState(input);

      expect(result.next_phase).toBe('VERIFY');
    });

    it('should transition from VERIFY to DONE when verification passes', async () => {
      mockStateManager.getSessionState.mockReturnValue({
        current_phase: 'VERIFY' as Phase,
        initial_objective: 'Test objective',
        detected_role: 'coder' as Role,
        payload: {
          current_todos: [
            { id: '1', content: 'Task 1', status: 'completed', priority: 'medium' }
          ]
        },
        reasoning_effectiveness: 0.8,
        last_activity: Date.now()
      });

      const input: MessageJARVIS = {
        session_id: TEST_SESSION_ID,
        phase_completed: 'VERIFY',
        payload: {
          verification_passed: true
        }
      };

      const result = await processState(input);

      expect(result.next_phase).toBe('DONE');
      expect(result.status).toBe('DONE');
    });
  });

  describe('Meta-Prompt Extraction', () => {
    it('should extract valid meta-prompt from todo content', () => {
      const todoContent = '(ROLE: coder) (CONTEXT: authentication) (PROMPT: Implement JWT auth) (OUTPUT: production_code)';
      
      const metaPrompt = extractMetaPromptFromTodo(todoContent);
      
      expect(metaPrompt).not.toBeNull();
      expect(metaPrompt?.role_specification).toBe('coder');
      expect(metaPrompt?.context_parameters).toEqual({ domain: 'authentication' });
      expect(metaPrompt?.instruction_block).toBe('Implement JWT auth');
      expect(metaPrompt?.output_requirements).toBe('production_code');
    });

    it('should handle minimal meta-prompt with just ROLE and PROMPT', () => {
      const todoContent = '(ROLE: analyzer) (PROMPT: Analyze performance metrics)';
      
      const metaPrompt = extractMetaPromptFromTodo(todoContent);
      
      expect(metaPrompt).not.toBeNull();
      expect(metaPrompt?.role_specification).toBe('analyzer');
      expect(metaPrompt?.instruction_block).toBe('Analyze performance metrics');
      expect(metaPrompt?.output_requirements).toBe('comprehensive_deliverable');
    });

    it('should return null for invalid meta-prompt format', () => {
      const todoContent = 'Just a regular todo item without meta-prompt syntax';
      
      const metaPrompt = extractMetaPromptFromTodo(todoContent);
      
      expect(metaPrompt).toBeNull();
    });

    it('should return null when missing required ROLE', () => {
      const todoContent = '(CONTEXT: testing) (PROMPT: Write tests) (OUTPUT: test_suite)';
      
      const metaPrompt = extractMetaPromptFromTodo(todoContent);
      
      expect(metaPrompt).toBeNull();
    });

    it('should return null when missing required PROMPT', () => {
      const todoContent = '(ROLE: coder) (CONTEXT: testing) (OUTPUT: test_suite)';
      
      const metaPrompt = extractMetaPromptFromTodo(todoContent);
      
      expect(metaPrompt).toBeNull();
    });
  });

  describe('Task Completion Validation', () => {
    it('should validate successful completion with 100% completion rate', () => {
      const sessionMock = {
        payload: {
          current_todos: [
            { id: '1', content: 'Task 1', status: 'completed', priority: 'medium' },
            { id: '2', content: 'Task 2', status: 'completed', priority: 'high' }
          ]
        },
        reasoning_effectiveness: 0.8
      };

      const verificationPayload = {
        verification_passed: true
      };

      const result = validateTaskCompletion(sessionMock, verificationPayload);

      expect(result.isValid).toBe(true);
      expect(result.completionPercentage).toBe(100);
      expect(result.taskBreakdown.completed).toBe(2);
      expect(result.taskBreakdown.total).toBe(2);
    });

    it('should fail validation with low completion percentage', () => {
      const sessionMock = {
        payload: {
          current_todos: [
            { id: '1', content: 'Task 1', status: 'completed', priority: 'medium' },
            { id: '2', content: 'Task 2', status: 'pending', priority: 'high' },
            { id: '3', content: 'Task 3', status: 'pending', priority: 'medium' }
          ]
        },
        reasoning_effectiveness: 0.8
      };

      const verificationPayload = {
        verification_passed: false
      };

      const result = validateTaskCompletion(sessionMock, verificationPayload);

      expect(result.isValid).toBe(false);
      expect(result.completionPercentage).toBe(33); // 1 out of 3 completed
      expect(result.reason).toContain('Critical tasks incomplete');
    });

    it('should fail validation with incomplete critical tasks', () => {
      const sessionMock = {
        payload: {
          current_todos: [
            { id: '1', content: 'Task 1', status: 'completed', priority: 'medium' },
            { id: '2', content: 'Critical task', status: 'pending', priority: 'high' }
          ]
        },
        reasoning_effectiveness: 0.8
      };

      const verificationPayload = {
        verification_passed: true
      };

      const result = validateTaskCompletion(sessionMock, verificationPayload);

      expect(result.isValid).toBe(false);
      expect(result.reason).toContain('Critical tasks incomplete');
    });

    it('should fail validation with tasks still in progress', () => {
      const sessionMock = {
        payload: {
          current_todos: [
            { id: '1', content: 'Task 1', status: 'completed', priority: 'medium' },
            { id: '2', content: 'Task 2', status: 'in_progress', priority: 'medium' }
          ]
        },
        reasoning_effectiveness: 0.8
      };

      const verificationPayload = {
        verification_passed: true
      };

      const result = validateTaskCompletion(sessionMock, verificationPayload);

      expect(result.isValid).toBe(false);
      expect(result.reason).toContain('below required threshold');
    });

    it('should fail validation with low execution success rate', () => {
      const sessionMock = {
        payload: {
          current_todos: [
            { id: '1', content: 'Task 1', status: 'completed', priority: 'medium' }
          ]
        },
        reasoning_effectiveness: 0.6 // Below 70% threshold
      };

      const verificationPayload = {
        verification_passed: true
      };

      const result = validateTaskCompletion(sessionMock, verificationPayload);

      expect(result.isValid).toBe(false);
      expect(result.reason).toContain('success rate');
      expect(result.reason).toMatch(/below.*threshold/i);
    });
  });

  describe('Tool Constraints', () => {
    it('should provide correct allowed tools for each phase', async () => {
      const phases: Array<{ phase: Phase; expectedTools: string[] }> = [
        { phase: 'INIT', expectedTools: ['JARVIS'] },
        { phase: 'QUERY', expectedTools: ['JARVIS'] },
        { phase: 'ENHANCE', expectedTools: ['JARVIS'] },
        { phase: 'KNOWLEDGE', expectedTools: ['Task', 'WebSearch', 'WebFetch', 'APITaskAgent', 'mcp__ide__executeCode', 'PythonComputationalTool', 'JARVIS'] },
        { phase: 'PLAN', expectedTools: ['TodoWrite'] },
        { phase: 'EXECUTE', expectedTools: ['TodoRead', 'TodoWrite', 'Task', 'Bash', 'Read', 'Write', 'Edit', 'Browser', 'mcp__ide__executeCode', 'PythonComputationalTool'] },
        { phase: 'VERIFY', expectedTools: ['TodoRead', 'Read', 'mcp__ide__executeCode', 'PythonComputationalTool'] },
        { phase: 'DONE', expectedTools: [] }
      ];

      for (const { phase, expectedTools } of phases) {
        mockStateManager.getSessionState.mockReturnValue({
          current_phase: phase,
          initial_objective: 'Test objective',
          detected_role: 'researcher' as Role,
          payload: {},
          reasoning_effectiveness: 0.8,
          last_activity: Date.now()
        });

        const input: MessageJARVIS = {
          session_id: TEST_SESSION_ID
        };

        const result = await processState(input);
        expect(result.allowed_next_tools).toEqual(expectedTools);
      }
    });
  });

  describe('Role Detection Integration', () => {
    it('should properly set detected role during initialization', async () => {
      const input: MessageJARVIS = {
        session_id: TEST_SESSION_ID,
        initial_objective: 'Build a React application with authentication'
      };

      await processState(input);

      const updateCall = mockStateManager.updateSessionState.mock.calls[0];
      const updatedSession = updateCall[1];
      
      expect(['planner', 'coder', 'critic', 'researcher', 'analyzer', 'synthesizer', 'ui_architect', 'ui_implementer', 'ui_refiner']).toContain(updatedSession.detected_role);
      expect(updatedSession.initial_objective).toBe('Build a React application with authentication');
    });
  });
});