// Core FSM logic - implements the 6-step agent loop with auto-connection capabilities
// Features: API discovery, automatic fetching, knowledge synthesis, and role-based orchestration

import { MessageJARVIS, FromJARVIS } from './types.js';
import { createFSM } from '../phase-engine/FSM.js';
import { autoConnection } from '../knowledge/autoConnection.js';

// Create FSM with dependency injection
const fsm = createFSM({
  autoConnection,
});

// Export the main processState function to maintain backward compatibility
export const processState = fsm.processState;

// Export other functions for backward compatibility
export const extractMetaPromptFromTodo = fsm.extractMetaPromptFromTodo;
// extractEnhancedMetaPromptFromTodo removed - use extractMetaPromptFromTodo for all meta-prompt extraction
export const updateReasoningEffectiveness = fsm.updateReasoningEffectiveness;

// Re-export configuration for backward compatibility
export { AUTO_CONNECTION_CONFIG } from '../knowledge/autoConnection.js';
export { validateTaskCompletion } from '../verification/metrics.js';
