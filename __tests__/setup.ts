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
    const validRoles = ['planner', 'coder', 'critic', 'researcher', 'analyzer', 'synthesizer', 'ui_architect', 'ui_implementer', 'ui_refiner', 'slide_generator'];
    
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
    const validRoles = ['planner', 'coder', 'critic', 'researcher', 'analyzer', 'synthesizer', 'ui_architect', 'ui_implementer', 'ui_refiner', 'slide_generator'];
    const pass = validRoles.includes(received);

    return {
      message: () =>
        pass
          ? `expected ${received} not to be a valid role`
          : `expected ${received} to be one of: ${validRoles.join(', ')}`,
      pass,
    };
  },

  // Presentation-specific matchers
  toHaveValidSlideStructure(received, expectedTemplate, expectedSlideNumber) {
    const pass = received &&
      typeof received === 'object' &&
      typeof received.slideNumber === 'number' &&
      received.slideNumber === expectedSlideNumber &&
      typeof received.title === 'string' &&
      received.title.length > 0 &&
      typeof received.templateUsed === 'string' &&
      (expectedTemplate === 'auto' || received.templateUsed === expectedTemplate) &&
      typeof received.filePath === 'string' &&
      typeof received.contentType === 'string';

    return {
      message: () =>
        pass
          ? `expected slide not to have valid structure`
          : `expected slide to have valid structure with slideNumber: ${expectedSlideNumber}, template: ${expectedTemplate}, but got: ${JSON.stringify(received)}`,
      pass,
    };
  },

  toHaveValidPresentationStructure(received) {
    const pass = received &&
      typeof received === 'object' &&
      typeof received.hasTitle === 'boolean' &&
      typeof received.hasTableOfContents === 'boolean' &&
      typeof received.contentSlides === 'number' &&
      received.contentSlides >= 0 &&
      typeof received.hasClosing === 'boolean' &&
      typeof received.totalSlides === 'number' &&
      received.totalSlides >= 0 &&
      // Logical consistency checks
      received.totalSlides === (
        (received.hasTitle ? 1 : 0) +
        (received.hasTableOfContents ? 1 : 0) +
        received.contentSlides +
        (received.hasClosing ? 1 : 0)
      );

    return {
      message: () =>
        pass
          ? `expected presentation structure not to be valid`
          : `expected presentation structure to be valid with consistent slide counts, but got: ${JSON.stringify(received)}`,
      pass,
    };
  },
});

// Global test timeout

// Clean up after tests
afterEach(() => {
  vi.clearAllMocks();
});