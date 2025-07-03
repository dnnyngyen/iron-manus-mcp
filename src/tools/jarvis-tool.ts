/**
 * JARVIS FSM Controller Tool
 * Extracted from index.ts to provide modular tool architecture
 */

import { BaseTool, ToolSchema, ToolResult } from './base-tool.js';
import { processState } from '../core/fsm.js';
import { MessageJARVIS, Phase } from '../core/types.js';

export interface JARVISArgs {
  session_id?: string;
  phase_completed?: 'QUERY' | 'ENHANCE' | 'KNOWLEDGE' | 'PLAN' | 'EXECUTE' | 'VERIFY';
  initial_objective?: string;
  payload?: Record<string, any>;
}

/**
 * JARVIS Finite State Machine Controller Tool
 * Implements the 8-phase agent loop with fractal orchestration
 */
export class JARVISTool extends BaseTool {
  readonly name = 'JARVIS';
  readonly description =
    'JARVIS Finite State Machine Controller - Implements the 8-phase agent loop (INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE) with Meta Thread-of-Thought orchestration. Features: Role-based cognitive enhancement through systematic thinking methodologies, meta-prompt generation for Task() agent spawning, fractal task decomposition, performance tracking, and single-tool-per-iteration enforcement. Enables Claude to autonomously manage complex projects through context segmentation.';

  readonly inputSchema: ToolSchema = {
    type: 'object',
    properties: {
      session_id: {
        type: 'string',
        description: 'Unique session identifier (auto-generated if not provided)',
      },
      phase_completed: {
        type: 'string',
        enum: ['QUERY', 'ENHANCE', 'KNOWLEDGE', 'PLAN', 'EXECUTE', 'VERIFY'],
        description: 'Phase that Claude just completed (omit for initial call)',
      },
      initial_objective: {
        type: 'string',
        description: "User's goal (only on first call)",
      },
      payload: {
        type: 'object',
        description: 'Phase-specific data from Claude',
        additionalProperties: true,
      },
    },
    required: [],
  };

  /**
   * Handle JARVIS FSM execution
   * Routes to the core FSM processState function
   */
  async handle(args: JARVISArgs): Promise<ToolResult> {
    try {
      // Auto-generate session_id if not provided (for convenience)
      // NOTE: In tests, always provide explicit session_id to avoid directory proliferation
      if (!args.session_id) {
        args.session_id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        console.warn(
          `Auto-generated session ID: ${args.session_id}. Consider providing explicit session_id.`
        );
      }

      this.validateArgs(args);

      // Construct FSM input message
      const input: MessageJARVIS = {
        session_id: args.session_id,
        ...(args.phase_completed && { phase_completed: args.phase_completed }),
        ...(args.initial_objective && { initial_objective: args.initial_objective }),
        ...(args.payload && { payload: args.payload }),
      };

      // Process through FSM
      const result = await processState(input);

      // Format response
      const responseText = JSON.stringify(result, null, 2);
      return this.createResponse(responseText);
    } catch (error) {
      console.error('JARVIS FSM Error:', error);
      return this.createErrorResponse(error instanceof Error ? error : String(error));
    }
  }
}
