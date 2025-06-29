// Core FSM logic - implements the 6-step agent loop with auto-connection capabilities
// Features: API discovery, automatic fetching, knowledge synthesis, and role-based orchestration

import { MessageJARVIS, FromJARVIS } from './types.js';
import { createFSM } from '../phase-engine/FSM.js';
import { autoFetchAPIs, autoSynthesize, AUTO_CONNECTION_CONFIG } from '../knowledge/autoConnection.js';
import { validateTaskCompletion } from '../verification/metrics.js';

// Create FSM with dependency injection
const fsm = createFSM({
  knowledge: {
    autoFetch: autoFetchAPIs,
    autoSynthesize: autoSynthesize,
    config: AUTO_CONNECTION_CONFIG,
  },
  verification: {
    validateCompletion: validateTaskCompletion,
  },
});

// Export the main processState function to maintain backward compatibility
export const processState = fsm.processState;

// Export other functions for backward compatibility
export const extractMetaPromptFromTodo = fsm.extractMetaPromptFromTodo;
export const extractEnhancedMetaPromptFromTodo = fsm.extractEnhancedMetaPromptFromTodo;
export const updateReasoningEffectiveness = fsm.updateReasoningEffectiveness;

// Re-export configuration for backward compatibility
export { AUTO_CONNECTION_CONFIG } from '../knowledge/autoConnection.js';
export { validateTaskCompletion } from '../verification/metrics.js';