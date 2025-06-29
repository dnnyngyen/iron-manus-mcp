// Jest setup file for Iron Manus MCP tests
// Configure global test environment and utilities

import { vi, expect, afterEach } from 'vitest';

// Mock console methods to avoid cluttering test output
const originalConsole = global.console;
global.console = {
  ...originalConsole,
  // Keep error and warn for debugging, silence info/log
  log: vi.fn(),
  info: vi.fn(),
  // Keep error and warn for test debugging
  error: originalConsole.error,
  warn: originalConsole.warn,
};

// Global test utilities
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidSessionState(): R;
      toBeValidPhase(): R;
      toBeValidRole(): R;
    }
  }
}

// Custom Jest matchers for Iron Manus types
expect.extend({
  toBeValidSessionState(received) {
    const validPhases = ['INIT', 'QUERY', 'ENHANCE', 'KNOWLEDGE', 'PLAN', 'EXECUTE', 'VERIFY', 'DONE'];
    const validRoles = ['planner', 'coder', 'critic', 'researcher', 'analyzer', 'synthesizer', 'ui_architect', 'ui_implementer', 'ui_refiner'];
    
    const pass = received &&
      typeof received === 'object' &&
      validPhases.includes(received.current_phase) &&
      validRoles.includes(received.detected_role) &&
      typeof received.initial_objective === 'string' &&
      typeof received.reasoning_effectiveness === 'number' &&
      received.reasoning_effectiveness >= 0.3 &&
      received.reasoning_effectiveness <= 1.0;

    return {
      message: () =>
        pass
          ? `expected ${received} not to be a valid session state`
          : `expected ${received} to be a valid session state with valid phase, role, objective, and reasoning effectiveness`,
      pass,
    };
  },

  toBeValidPhase(received) {
    const validPhases = ['INIT', 'QUERY', 'ENHANCE', 'KNOWLEDGE', 'PLAN', 'EXECUTE', 'VERIFY', 'DONE'];
    const pass = validPhases.includes(received);

    return {
      message: () =>
        pass
          ? `expected ${received} not to be a valid phase`
          : `expected ${received} to be one of: ${validPhases.join(', ')}`,
      pass,
    };
  },

  toBeValidRole(received) {
    const validRoles = ['planner', 'coder', 'critic', 'researcher', 'analyzer', 'synthesizer', 'ui_architect', 'ui_implementer', 'ui_refiner'];
    const pass = validRoles.includes(received);

    return {
      message: () =>
        pass
          ? `expected ${received} not to be a valid role`
          : `expected ${received} to be one of: ${validRoles.join(', ')}`,
      pass,
    };
  },
});

// Global test timeout

// Clean up after tests
afterEach(() => {
  vi.clearAllMocks();
});