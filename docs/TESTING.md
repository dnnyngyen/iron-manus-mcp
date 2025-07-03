# Testing Guidelines

This document describes the testing infrastructure and guidelines for the Iron Manus MCP project.

## Overview

The project uses Vitest with TypeScript and ES modules for comprehensive testing. Our test suite covers:

- **Unit Tests**: FSM core functionality, API registry, and individual tools
- **Integration Tests**: MCP server startup and tool interactions  
- **163 Total Tests**: 163 passing with excellent coverage of all core functionality

## Test Structure

```
__tests__/
├── setup.ts                    # Global test configuration
├── core/
│   ├── fsm.test.ts            # FSM phase transitions and meta-prompt extraction
│   └── api-registry.test.ts   # API selection and rate limiting
├── tools/
│   └── jarvis-tool.test.ts    # JARVIS tool integration tests
└── integration/
    └── server.test.ts         # MCP server startup and protocol compliance
```

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run only integration tests
npm run test:integration

# Run only unit tests  
npm run test:unit

# CI mode (no watch, with coverage)
npm run test:ci
```

### Specific Test Patterns

```bash
# Run FSM tests only
npm test -- --testPathPattern="fsm.test.ts"

# Run specific test suite
npm test -- --testNamePattern="Phase Transitions"

# Run with timeout for slower tests
NODE_ENV=test npm test
```

## Vitest Configuration

Our Vitest setup includes:

- **ES Module Support**: Native ES module support with TypeScript
- **TypeScript**: Full TypeScript support with type checking
- **Custom Matchers**: Iron Manus-specific test utilities
- **Coverage Thresholds**: 70% minimum for all metrics
- **Parallel Execution**: Fast test runs with proper isolation

Key configuration in `vitest.config.ts`:

```typescript
export default {
  test: {
    testEnvironment: 'node',
    globals: true,
    setupFiles: ['__tests__/setup.ts']
  }
};
```

## Test Patterns

### FSM Testing

Tests for the 8-phase finite state machine:

```typescript
// Test phase transitions
it('should transition from QUERY to ENHANCE when phase completed', async () => {
  const input: MessageJARVIS = {
    session_id: 'test-session',
    phase_completed: 'QUERY',
    payload: { interpreted_goal: 'Enhanced test objective' }
  };
  
  const result = await processState(input);
  expect(result.next_phase).toBe('ENHANCE');
});

// Test meta-prompt extraction
it('should extract valid meta-prompt from todo content', () => {
  const todoContent = '(ROLE: coder) (CONTEXT: auth) (PROMPT: Implement JWT) (OUTPUT: code)';
  const metaPrompt = extractMetaPromptFromTodo(todoContent);
  
  expect(metaPrompt?.role_specification).toBe('coder');
  expect(metaPrompt?.instruction_block).toBe('Implement JWT');
});
```

### API Registry Testing

Tests for the 65 API endpoint registry:

```typescript
// Test role-based API selection
it('should select relevant APIs for researcher role', () => {
  const results = selectRelevantAPIs('Research quantum computing', 'researcher');
  
  expect(results).toHaveLength(5);
  expect(results[0].relevance_score).toBeGreaterThan(0);
});

// Test rate limiting
it('should deny requests exceeding rate limit', () => {
  const rateLimiter = new RateLimiter();
  // Use up the limit...
  expect(rateLimiter.canMakeRequest('api', 3, 60000)).toBe(false);
});
```

### Tool Integration Testing

Tests for the modular tool system:

```typescript
// Test JARVIS tool with auto-generated session IDs
it('should auto-generate session_id when not provided', async () => {
  const jarvisTool = new JARVISTool();
  const result = await jarvisTool.handle({ initial_objective: 'Test' });
  
  expect(result.isError).toBeFalsy();
  // Session ID should match pattern: session_\d+_[a-z0-9]+
});
```

## Custom Test Utilities

### Custom Matchers

The test setup includes Iron Manus-specific matchers:

```typescript
// Validate session state structure
expect(sessionState).toBeValidSessionState();

// Validate FSM phases
expect('QUERY').toBeValidPhase();

// Validate role types  
expect('researcher').toBeValidRole();
```

### Mocking Strategy

- **FSM State Manager**: Mocked for isolated unit tests
- **Console Output**: Suppressed for clean test output (keeps errors/warnings)
- **External APIs**: Not mocked - tests use actual API registry

## Test Environment

### Environment Variables

- `NODE_ENV=test`: Prevents server startup during testing
- Test timeouts: 10 seconds global, configurable per test

### Coverage Requirements

Minimum coverage thresholds:

```javascript
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70, 
    lines: 70,
    statements: 70
  }
}
```

## Writing New Tests

### Guidelines

1. **Descriptive Names**: Use clear, specific test descriptions
2. **Arrange-Act-Assert**: Follow AAA pattern for clarity
3. **Isolation**: Each test should be independent
4. **Mocking**: Mock external dependencies, test real logic
5. **Edge Cases**: Test both success and failure scenarios

### Example Test Structure

```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup for each test
    vi.clearAllMocks();
  });

  describe('Specific Functionality', () => {
    it('should handle expected behavior', async () => {
      // Arrange
      const input = { /* test data */ };
      
      // Act  
      const result = await functionUnderTest(input);
      
      // Assert
      expect(result).toEqual(expectedOutput);
    });

    it('should handle error conditions gracefully', async () => {
      // Test error scenarios
    });
  });
});
```

## Debugging Tests

### Common Issues

1. **ES Module Imports**: Ensure `.js` extensions in imports
2. **TypeScript Types**: Use proper type assertions for test data
3. **Async Operations**: Always await async calls in tests
4. **State Isolation**: Clear mocks between tests

### Debug Commands

```bash
# Run with verbose output
npm test -- --verbose

# Run specific test with debugging
npm test -- --testNamePattern="specific test" --verbose

# Check for open handles
npm test -- --detectOpenHandles
```

## Performance Testing

The test suite runs efficiently:

- **Full Suite**: ~7 seconds for 67 tests
- **Unit Tests**: ~2-3 seconds  
- **Integration Tests**: ~4-5 seconds
- **Parallel Execution**: Tests run concurrently where possible

## Contributing

When adding new features:

1. **Write tests first** (TDD approach recommended)
2. **Maintain coverage** above 70% threshold
3. **Update this guide** if introducing new testing patterns
4. **Run full suite** before submitting changes

```bash
# Before committing
npm run test:ci
npm run lint
npm run format:check
```

This ensures code quality and maintains the excellent test coverage we've established.