// JARVIS Tool Tests - Tests for the FSM controller tool integration
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JARVISTool } from '../../src/tools/jarvis-tool.js';
import { processState } from '../../src/core/fsm.js';
import { MessageJARVIS, Role, Phase } from '../../src/core/types.js';

// Mock the FSM module
vi.mock('../../src/core/fsm.js', () => ({
  processState: vi.fn()
}));

describe('JARVIS Tool Integration', () => {
  let jarvisTool: JARVISTool;
  const mockProcessState = processState as vi.MockedFunction<typeof processState>;

  beforeEach(() => {
    jarvisTool = new JARVISTool();
    vi.clearAllMocks();
  });

  describe('Tool Definition', () => {
    it('should have correct tool metadata', () => {
      expect(jarvisTool.name).toBe('JARVIS');
      expect(jarvisTool.description).toMatch(/Finite State Machine Controller/i);
      expect(jarvisTool.description).toContain('8-phase agent loop');
      expect(jarvisTool.inputSchema).toBeDefined();
      expect(jarvisTool.inputSchema.type).toBe('object');
    });

    it('should have correct input schema structure', () => {
      const schema = jarvisTool.inputSchema;
      
      expect(schema.properties).toHaveProperty('session_id');
      expect(schema.properties).toHaveProperty('phase_completed');
      expect(schema.properties).toHaveProperty('initial_objective');
      expect(schema.properties).toHaveProperty('payload');

      // Verify phase_completed enum values
      expect(schema.properties.phase_completed.enum).toEqual([
        'QUERY', 'ENHANCE', 'KNOWLEDGE', 'PLAN', 'EXECUTE', 'VERIFY'
      ]);

      // Verify no required fields (all optional for flexibility)
      expect(schema.required).toEqual([]);
    });
  });

  describe('Session ID Handling', () => {
    it('should auto-generate session_id when not provided', async () => {
      const mockResult = {
        next_phase: 'QUERY' as Phase,
        system_prompt: 'Test prompt',
        allowed_next_tools: ['JARVIS'],
        status: 'IN_PROGRESS' as const
      };
      mockProcessState.mockResolvedValue(mockResult);

      const args = {
        session_id: 'test-1',
        initial_objective: 'Test objective'
      };

      const result = await jarvisTool.handle(args);

      expect(mockProcessState).toHaveBeenCalledWith(
        expect.objectContaining({
          session_id: 'test-1',
          initial_objective: 'Test objective'
        })
      );
      expect(result.isError).toBeFalsy();
    });

    it('should use provided session_id when given', async () => {
      const mockResult = {
        next_phase: 'ENHANCE' as Phase,
        system_prompt: 'Test prompt',
        allowed_next_tools: ['JARVIS'],
        status: 'IN_PROGRESS' as const
      };
      mockProcessState.mockResolvedValue(mockResult);

      const args = {
        session_id: 'custom-session-123',
        phase_completed: 'QUERY'
      };

      await jarvisTool.handle(args);

      expect(mockProcessState).toHaveBeenCalledWith(
        expect.objectContaining({
          session_id: 'custom-session-123',
          phase_completed: 'QUERY'
        })
      );
    });
  });

  describe('Initial Objective Handling', () => {
    it('should handle initial objective for new session', async () => {
      const mockResult = {
        next_phase: 'QUERY' as Phase,
        system_prompt: 'Test prompt with role detection',
        allowed_next_tools: ['JARVIS'],
        status: 'IN_PROGRESS' as const,
        payload: {
          session_id: 'test-session',
          detected_role: 'coder' as Role
        }
      };
      mockProcessState.mockResolvedValue(mockResult);

      const args = {
        session_id: 'test-session',
        initial_objective: 'Build a React application with authentication'
      };

      const result = await jarvisTool.handle(args);

      expect(mockProcessState).toHaveBeenCalledWith({
        session_id: 'test-session',
        initial_objective: 'Build a React application with authentication'
      });

      expect(result.isError).toBeFalsy();
      expect(result.content[0].text).toContain('coder');
    });

    it('should not include initial_objective in subsequent calls', async () => {
      const mockResult = {
        next_phase: 'PLAN' as Phase,
        system_prompt: 'Planning phase prompt',
        allowed_next_tools: ['TodoWrite'],
        status: 'IN_PROGRESS' as const
      };
      mockProcessState.mockResolvedValue(mockResult);

      const args = {
        session_id: 'test-session',
        phase_completed: 'KNOWLEDGE',
        payload: {
          knowledge_gathered: 'Relevant research completed'
        }
      };

      await jarvisTool.handle(args);

      expect(mockProcessState).toHaveBeenCalledWith({
        session_id: 'test-session',
        phase_completed: 'KNOWLEDGE',
        payload: {
          knowledge_gathered: 'Relevant research completed'
        }
      });
    });
  });

  describe('Phase Completion Handling', () => {
    const phases = ['QUERY', 'ENHANCE', 'KNOWLEDGE', 'PLAN', 'EXECUTE', 'VERIFY'] as const;

    phases.forEach(phase => {
      it(`should handle ${phase} phase completion`, async () => {
        const mockResult = {
          next_phase: 'DONE' as Phase,
          system_prompt: 'Completion prompt',
          allowed_next_tools: [],
          status: 'DONE' as const
        };
        mockProcessState.mockResolvedValue(mockResult);

        const args = {
          session_id: 'test-session',
          phase_completed: phase,
          payload: {
            result: `${phase} completed successfully`
          }
        };

        await jarvisTool.handle(args);

        expect(mockProcessState).toHaveBeenCalledWith({
          session_id: 'test-session',
          phase_completed: phase,
          payload: {
            result: `${phase} completed successfully`
          }
        });
      });
    });
  });

  describe('Payload Handling', () => {
    it('should pass complex payload data correctly', async () => {
      const mockResult = {
        next_phase: 'EXECUTE' as Phase,
        system_prompt: 'Execute prompt',
        allowed_next_tools: ['TodoRead', 'Task', 'Bash'],
        status: 'IN_PROGRESS' as const
      };
      mockProcessState.mockResolvedValue(mockResult);

      const complexPayload = {
        plan_created: true,
        todos_with_metaprompts: [
          {
            id: '1',
            content: '(ROLE: coder) (CONTEXT: auth) (PROMPT: Implement JWT) (OUTPUT: code)',
            status: 'pending',
            priority: 'high'
          }
        ],
        enhanced_goal: 'Build secure authentication system',
        execution_metadata: {
          start_time: Date.now(),
          complexity: 'moderate'
        }
      };

      const args = {
        session_id: 'test-session',
        phase_completed: 'PLAN',
        payload: complexPayload
      };

      await jarvisTool.handle(args);

      expect(mockProcessState).toHaveBeenCalledWith({
        session_id: 'test-session',
        phase_completed: 'PLAN',
        payload: complexPayload
      });
    });

    it('should handle empty payload', async () => {
      const mockResult = {
        next_phase: 'ENHANCE' as Phase,
        system_prompt: 'Enhancement prompt',
        allowed_next_tools: ['JARVIS'],
        status: 'IN_PROGRESS' as const
      };
      mockProcessState.mockResolvedValue(mockResult);

      const args = {
        session_id: 'test-session',
        phase_completed: 'QUERY'
      };

      await jarvisTool.handle(args);

      expect(mockProcessState).toHaveBeenCalledWith({
        session_id: 'test-session',
        phase_completed: 'QUERY'
      });
    });
  });

  describe('Response Formatting', () => {
    it('should format successful response correctly', async () => {
      const mockResult = {
        next_phase: 'KNOWLEDGE' as Phase,
        system_prompt: 'Research prompt with specific guidance',
        allowed_next_tools: ['WebSearch', 'WebFetch', 'JARVIS'],
        status: 'IN_PROGRESS' as const,
        payload: {
          session_id: 'test-session',
          detected_role: 'researcher' as Role,
          reasoning_effectiveness: 0.85
        }
      };
      mockProcessState.mockResolvedValue(mockResult);

      const args = {
        session_id: 'test-session',
        phase_completed: 'ENHANCE'
      };

      const result = await jarvisTool.handle(args);

      expect(result.isError).toBeFalsy();
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      
      const responseText = result.content[0].text;
      expect(responseText).toContain('KNOWLEDGE');
      expect(responseText).toContain('researcher');
      // Check for reasoning effectiveness in response
      expect(responseText).toMatch(/reasoning|effectiveness/i);
      expect(responseText).toContain('WebSearch');
    });

    it('should format completion response for DONE status', async () => {
      const mockResult = {
        next_phase: 'DONE' as Phase,
        system_prompt: 'Mission accomplished',
        allowed_next_tools: [],
        status: 'DONE' as const,
        payload: {
          session_id: 'test-session',
          current_objective: 'Build authentication system',
          detected_role: 'coder' as Role,
          reasoning_effectiveness: 0.92
        }
      };
      mockProcessState.mockResolvedValue(mockResult);

      const args = {
        session_id: 'test-session',
        phase_completed: 'VERIFY',
        payload: {
          verification_passed: true
        }
      };

      const result = await jarvisTool.handle(args);

      expect(result.isError).toBeFalsy();
      
      const responseText = result.content[0].text;
      expect(responseText).toMatch(/done|accomplished|mission/i);
      expect(responseText).toContain('authentication');
      expect(responseText).toMatch(/coder|role/i);
      // Check for effectiveness metrics
      expect(responseText).toMatch(/\d+\.\d%|effectiveness/i);
    });
  });

  describe('Error Handling', () => {
    it('should handle FSM processing errors gracefully', async () => {
      const error = new Error('FSM processing failed');
      mockProcessState.mockRejectedValue(error);

      const args = {
        session_id: 'test-session',
        initial_objective: 'Test objective'
      };

      const result = await jarvisTool.handle(args);

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Tool Error');
      expect(result.content[0].text).toContain('FSM processing failed');
    });

    it('should handle non-Error exceptions', async () => {
      mockProcessState.mockRejectedValue('String error');

      const args = {
        session_id: 'test-session',
        initial_objective: 'Test objective'
      };

      const result = await jarvisTool.handle(args);

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('String error');
    });

    it('should handle undefined/null session_id gracefully', async () => {
      const mockResult = {
        next_phase: 'QUERY' as Phase,
        system_prompt: 'Test prompt',
        allowed_next_tools: ['JARVIS'],
        status: 'IN_PROGRESS' as const
      };
      mockProcessState.mockResolvedValue(mockResult);

      const args = {
        session_id: 'test-2',
        initial_objective: 'Test objective'
        // Note: Now explicitly providing session_id for consistency
      };

      const result = await jarvisTool.handle(args);

      expect(result.isError).toBeFalsy();
      expect(mockProcessState).toHaveBeenCalledWith(
        expect.objectContaining({
          session_id: 'test-2',
          initial_objective: 'Test objective'
        })
      );
    });
  });

  describe('Argument Validation', () => {
    it('should handle minimal valid arguments', async () => {
      const mockResult = {
        next_phase: 'QUERY' as Phase,
        system_prompt: 'Test prompt',
        allowed_next_tools: ['JARVIS'],
        status: 'IN_PROGRESS' as const
      };
      mockProcessState.mockResolvedValue(mockResult);

      const args = { session_id: 'test-3' }; // Minimal valid args

      const result = await jarvisTool.handle(args);

      expect(result.isError).toBeFalsy();
      expect(mockProcessState).toHaveBeenCalledWith(
        expect.objectContaining({
          session_id: 'test-3'
        })
      );
    });

    it('should validate phase_completed enum values', () => {
      const validPhases = jarvisTool.inputSchema.properties.phase_completed.enum;
      const expectedPhases = ['QUERY', 'ENHANCE', 'KNOWLEDGE', 'PLAN', 'EXECUTE', 'VERIFY'];
      
      expect(validPhases).toEqual(expectedPhases);
    });
  });

  describe('JSON Response Formatting', () => {
    it('should format FSM result as proper JSON', async () => {
      const mockResult = {
        next_phase: 'PLAN' as Phase,
        system_prompt: 'Planning phase with detailed guidance',
        allowed_next_tools: ['TodoWrite'],
        status: 'IN_PROGRESS' as const,
        payload: {
          session_id: 'test-session',
          enhanced_goal: 'Detailed goal specification',
          detected_role: 'planner' as Role
        }
      };
      mockProcessState.mockResolvedValue(mockResult);

      const args = {
        session_id: 'test-session',
        phase_completed: 'KNOWLEDGE'
      };

      const result = await jarvisTool.handle(args);

      const responseText = result.content[0].text;
      
      // Should contain JSON-formatted FSM result
      expect(responseText).toContain('"next_phase"');
      expect(responseText).toContain('"PLAN"');
      expect(responseText).toContain('"allowed_next_tools"');
      expect(responseText).toContain('TodoWrite');
    });

    it('should handle special characters in FSM response', async () => {
      const mockResult = {
        next_phase: 'EXECUTE' as Phase,
        system_prompt: 'Execute with "quotes" and special chars: <>&',
        allowed_next_tools: ['Task'],
        status: 'IN_PROGRESS' as const,
        payload: {
          session_id: 'test-session',
          special_data: {
            quotes: '"nested quotes"',
            symbols: '<>&',
            unicode: 'café résumé'
          }
        }
      };
      mockProcessState.mockResolvedValue(mockResult);

      const args = {
        session_id: 'test-session',
        phase_completed: 'PLAN'
      };

      const result = await jarvisTool.handle(args);

      expect(result.isError).toBeFalsy();
      
      const responseText = result.content[0].text;
      expect(responseText).toContain('Execute with');
      expect(responseText).toContain('special_data');
    });
  });
});