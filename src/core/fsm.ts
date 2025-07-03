/**
 * Iron Manus MCP Core FSM Exports
 * 
 * This module serves as the main export gateway for the Iron Manus FSM orchestration system.
 * It provides access to the core 8-phase agent loop (INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE)
 * with auto-connection capabilities, API discovery, knowledge synthesis, and role-based cognitive enhancement.
 * 
 * Architecture:
 * - Creates FSM instance with dependency injection for testability and modularity
 * - Exports core functions for backward compatibility with existing integrations
 * - Provides configuration and utility function re-exports for convenient access
 * - Supports fractal orchestration through meta-prompt extraction and reasoning effectiveness tracking
 * 
 * Integration Points:
 * - JARVIS FSM controller: Uses processState for 8-phase orchestration
 * - Knowledge synthesis: Integrates autoConnection for API discovery and data fetching
 * - Task validation: Provides validateTaskCompletion for VERIFY phase operations
 * - Meta-prompt generation: Supports fractal Task() agent spawning through extractMetaPromptFromTodo
 * 
 * @example
 * ```typescript
 * import { processState, extractMetaPromptFromTodo, AUTO_CONNECTION_CONFIG } from './core/fsm.js';
 * 
 * // Initialize FSM session
 * const response = await processState({
 *   session_id: 'session_123',
 *   initial_objective: 'Build responsive dashboard'
 * });
 * 
 * // Extract meta-prompt for Task() agent spawning
 * const metaPrompt = extractMetaPromptFromTodo(todoItem);
 * 
 * // Access configuration
 * console.log('Auto-connection enabled:', AUTO_CONNECTION_CONFIG.enabled);
 * ```
 */

import { MessageJARVIS, FromJARVIS } from './types.js';
import { createFSM } from '../phase-engine/FSM.js';
import { autoConnection } from '../knowledge/autoConnection.js';

/**
 * FSM instance created with dependency injection for modularity and testability
 * 
 * The FSM is configured with autoConnection capabilities for the KNOWLEDGE phase,
 * enabling automatic API discovery, data fetching, and knowledge synthesis.
 * This dependency injection pattern allows for easy testing and configuration.
 */
const fsm = createFSM({
  autoConnection,
});

/**
 * Core FSM state processor for the 8-phase agent loop orchestration
 * 
 * This function orchestrates the complete 8-phase FSM cycle with role-based cognitive enhancement.
 * It processes MessageJARVIS inputs and returns FromJARVIS responses with enhanced system prompts,
 * tool gating, and phase transition instructions.
 * 
 * Features:
 * - Role detection and cognitive enhancement from initial_objective
 * - Phase transition management (INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE)
 * - Tool gating with "single tool per iteration" enforcement
 * - Event stream simulation through payload management
 * - Performance tracking and reasoning effectiveness measurement
 * 
 * @param input - MessageJARVIS containing session_id, phase_completed, initial_objective, and payload
 * @returns Promise<FromJARVIS> with next_phase, system_prompt, allowed_next_tools, and payload
 * 
 * @example
 * ```typescript
 * // Initial session start
 * const response = await processState({
 *   session_id: 'session_123',
 *   initial_objective: 'Create responsive navigation component'
 * });
 * 
 * // Phase transition
 * const nextResponse = await processState({
 *   session_id: 'session_123',
 *   phase_completed: 'KNOWLEDGE',
 *   payload: {
 *     apis_discovered: 3,
 *     synthesis_confidence: 0.85,
 *     current_todos: [...]
 *   }
 * });
 * ```
 */
export const processState = fsm.processState;

/**
 * Meta-prompt extraction function for fractal Task() agent spawning
 * 
 * Extracts structured MetaPrompt from TodoItem to enable fractal orchestration where
 * the FSM controller spawns specialized Task() agents with complete context and instructions.
 * This supports Level 1 → Level 2 → Level 3 fractal decomposition with role-based enhancement.
 * 
 * Features:
 * - Structured prompt generation with role_specification, context_parameters, instruction_block, and output_requirements
 * - Role-based cognitive enhancement integration
 * - Component-Cognitive Duality support for UI generation and cognitive orchestration
 * - Fractal task decomposition with context preservation
 * 
 * @param todo - TodoItem with potential meta_prompt property and task details
 * @returns MetaPrompt | null - Structured prompt for Task() agent spawning or null if not applicable
 * 
 * @example
 * ```typescript
 * const todoItem = {
 *   id: 'nav-001',
 *   content: 'Create responsive navigation component',
 *   status: 'pending',
 *   priority: 'high',
 *   type: 'TaskAgent',
 *   meta_prompt: {
 *     role_specification: 'ROLE: ui_architect',
 *     context_parameters: { framework: 'React', styling: 'Tailwind' },
 *     instruction_block: 'PROMPT: Build accessible navigation',
 *     output_requirements: 'OUTPUT: React component with TypeScript'
 *   }
 * };
 * 
 * const metaPrompt = extractMetaPromptFromTodo(todoItem);
 * // Returns structured MetaPrompt for Task() agent spawning
 * ```
 */
export const extractMetaPromptFromTodo = fsm.extractMetaPromptFromTodo;

/**
 * Reasoning effectiveness tracking function for cognitive performance optimization
 * 
 * Updates the reasoning effectiveness metric (0-1 scale) for session performance tracking.
 * This metric influences cognitive enhancement strategies, tool selection, and phase transition decisions.
 * Higher effectiveness scores lead to more advanced cognitive frameworks and reduced validation overhead.
 * 
 * Performance Impact:
 * - Effectiveness > 0.8: Enables advanced cognitive frameworks and optimized tool selection
 * - Effectiveness 0.6-0.8: Standard cognitive enhancement with balanced validation
 * - Effectiveness < 0.6: Increased validation and simplified cognitive strategies
 * 
 * @param sessionId - Unique session identifier for state tracking
 * @param effectiveness - Reasoning effectiveness score (0-1 scale)
 * @returns void - Updates session state in knowledge graph
 * 
 * @example
 * ```typescript
 * // Update reasoning effectiveness after successful task completion
 * updateReasoningEffectiveness('session_123', 0.85);
 * 
 * // Lower effectiveness after encountering errors
 * updateReasoningEffectiveness('session_123', 0.65);
 * ```
 */
export const updateReasoningEffectiveness = fsm.updateReasoningEffectiveness;

/**
 * Auto-connection configuration for KNOWLEDGE phase API discovery and synthesis
 * 
 * Provides configuration settings for the automatic API discovery and knowledge synthesis
 * capabilities in the KNOWLEDGE phase. This configuration controls timeout, concurrency,
 * confidence thresholds, and response size limits for optimal performance.
 * 
 * Configuration Properties:
 * - enabled: Boolean flag to enable/disable auto-connection features
 * - timeout_ms: Request timeout in milliseconds for API calls
 * - max_concurrent: Maximum concurrent API requests for parallel processing
 * - confidence_threshold: Minimum confidence level for knowledge synthesis
 * - max_response_size: Maximum response size limit to prevent memory issues
 * 
 * @example
 * ```typescript
 * import { AUTO_CONNECTION_CONFIG } from './core/fsm.js';
 * 
 * console.log('Auto-connection enabled:', AUTO_CONNECTION_CONFIG.enabled);
 * console.log('Timeout:', AUTO_CONNECTION_CONFIG.timeout_ms, 'ms');
 * console.log('Max concurrent:', AUTO_CONNECTION_CONFIG.max_concurrent);
 * ```
 */
export { AUTO_CONNECTION_CONFIG } from '../knowledge/autoConnection.js';

/**
 * Task completion validation function for VERIFY phase operations
 * 
 * Validates task completion with strict percentage thresholds and critical task tracking.
 * This function is used during the VERIFY phase to determine if the session objectives
 * have been sufficiently completed before transitioning to DONE phase.
 * 
 * Validation Criteria:
 * - Completion percentage calculation based on task status
 * - Critical task identification (high priority, TaskAgent, meta-prompt tasks)
 * - Task breakdown analysis (completed, in_progress, pending counts)
 * - Configurable thresholds for completion requirements
 * 
 * @param session - Session state containing payload with current_todos and current_task_index
 * @param verificationPayload - Additional verification context and parameters
 * @returns VerificationResult with isValid, completionPercentage, task breakdown, and reasoning
 * 
 * @example
 * ```typescript
 * import { validateTaskCompletion } from './core/fsm.js';
 * 
 * const result = validateTaskCompletion(sessionState, {
 *   strict_validation: true,
 *   completion_threshold: 0.85
 * });
 * 
 * if (result.isValid) {
 *   console.log('Tasks completed:', result.completionPercentage, '%');
 *   console.log('Critical tasks:', result.criticalTasksCompleted, '/', result.totalCriticalTasks);
 * } else {
 *   console.log('Validation failed:', result.reason);
 * }
 * ```
 */
export { validateTaskCompletion } from '../verification/metrics.js';
