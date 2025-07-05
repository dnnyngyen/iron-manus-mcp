# Contributing to Iron Manus MCP

Thank you for your interest in contributing to Iron Manus MCP! This guide will help you get started with development and ensure your contributions align with the project's standards.

## Development Environment Setup

### Prerequisites

- Node.js 18+ 
- Git
- Claude Code CLI (for testing MCP integration)
- TypeScript knowledge

### Getting Started

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/iron-manus-mcp.git
   cd iron-manus-mcp
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Install Git Hooks**
   ```bash
   npm run install-hooks
   ```

4. **Build and Test**
   ```bash
   npm run build
   npm test
   ```

5. **Verify MCP Integration**
   ```bash
   claude mcp add iron-manus-mcp node dist/index.js
   /mcp  # Should show iron-manus-mcp listed
   ```

## Development Workflow

### Code Style Guidelines

This project follows strict TypeScript standards with automated formatting:

- **Language**: TypeScript 5.0+ with strict type checking
- **Formatting**: Prettier with 2-space indentation
- **Linting**: ESLint with TypeScript rules
- **Architecture**: Modular design with clear separation of concerns

### Automated Code Quality

All code is automatically validated through:

```bash
npm run lint          # Check code style
npm run format        # Auto-fix formatting
npm run test          # Run test suite
npm run test:coverage # Ensure 80%+ coverage
```

### File Organization

```
src/
├── index.ts              # MCP server entry point
├── config.ts             # Configuration layer
├── core/                 # Core FSM and orchestration logic
│   ├── fsm.ts           # State machine implementation
│   ├── prompts.ts       # Role-specific prompt templates
│   ├── state.ts         # Session management
│   ├── types.ts         # TypeScript interfaces
│   └── api-registry.ts  # API endpoint registry
├── phase-engine/         # FSM phase engine
│   └── FSM.ts           # Modular FSM with dependency injection
├── knowledge/            # Knowledge synthesis
│   └── autoConnection.ts # API discovery and synthesis
├── security/             # SSRF protection
│   └── ssrfGuard.ts     # URL validation and security
├── validation/           # Zod schemas
│   └── schemas.ts       # Runtime type validation
├── verification/         # Metrics and verification
│   └── metrics.ts       # Task completion validation
├── tools/               # MCP tool implementations
├── agents/              # Agent role definitions
└── utils/               # Shared utilities
```

## Testing Requirements

### Test Types

1. **Unit Tests** - Individual function testing
   ```bash
   npm run test:unit
   ```

2. **Integration Tests** - Component interaction testing
   ```bash
   npm run test:integration
   ```

3. **End-to-End Tests** - Full workflow testing
   ```bash
   npm run test:e2e
   ```

4. **Performance Tests** - FSM performance benchmarks
   ```bash
   npm run test:performance
   ```

### Coverage Requirements

- **Minimum**: 70% overall coverage
- **Core modules**: 85% coverage required
- **New features**: Must include comprehensive tests

### Writing Tests

Use Vitest with the following patterns:

```typescript
// Unit test example
describe('FSM Core', () => {
  it('should transition between phases correctly', () => {
    const fsm = new FSMController();
    const result = fsm.transitionPhase('QUERY', 'ENHANCE');
    expect(result.success).toBe(true);
  });
});

// Integration test example
describe('JARVIS Tool Integration', () => {
  it('should handle complete workflow execution', async () => {
    const jarvis = new JARVISTool();
    const result = await jarvis.execute({
      session_id: 'test',
      initial_objective: 'Test objective'
    });
    expect(result.phase).toBe('VERIFY');
  });
});
```

## Pull Request Process

### Before Submitting

1. **Run Quality Checks**
   ```bash
   npm run test:ci    # Full test suite
   npm run lint       # Code style check
   npm run docs:validate  # Documentation validation
   ```

2. **Update Documentation**
   - Update relevant documentation files
   - Add JSDoc comments for new functions
   - Update API references if needed

3. **Test MCP Integration**
   ```bash
   npm run build
   claude mcp add iron-manus-mcp node dist/index.js
   # Test your changes in Claude Code
   ```

### PR Guidelines

1. **Title Format**: Use conventional commits
   ```
   feat: add new FSM phase for error handling
   fix: resolve memory leak in agent spawning
   docs: update troubleshooting guide
   refactor: simplify prompt template system
   ```

2. **Description Template**:
   ```markdown
   ## Summary
   Brief description of changes and motivation

   ## Changes Made
   - Specific change 1
   - Specific change 2

   ## Testing
   - [ ] Unit tests pass
   - [ ] Integration tests pass
   - [ ] Manual testing completed
   - [ ] MCP integration verified

   ## Documentation
   - [ ] Code comments updated
   - [ ] Documentation files updated
   - [ ] API references updated (if applicable)
   ```

3. **Size Guidelines**:
   - Keep PRs focused and reasonably sized
   - Large features should be broken into multiple PRs
   - Include rationale for architectural changes

### Review Process

1. **Automated Checks**: All CI checks must pass
2. **Code Review**: At least one maintainer review required
3. **Testing**: Reviewers will test MCP integration
4. **Documentation**: Documentation completeness verified

## Contribution Types

### Bug Fixes

- Provide clear reproduction steps
- Include test cases that fail before fix
- Reference issue number in PR

### New Features

- Discuss in issue before implementation
- Follow existing architectural patterns
- Include comprehensive tests and documentation
- Consider backward compatibility

### Documentation Improvements

- Focus on clarity and accuracy
- Include practical examples
- Verify all links and references
- Test setup instructions

### Tool Development

When adding new MCP tools:

1. **Follow Tool Interface**:
   ```typescript
   interface MCPTool {
     name: string;
     description: string;
     inputSchema: object;
     execute(args: any): Promise<ToolResult>;
   }
   ```

2. **Add to Registry**:
   ```typescript
   // In src/index.ts
   server.setRequestHandler(ListToolsRequestSchema, async () => ({
     tools: [
       // ... existing tools
       new YourNewTool().definition
     ]
   }));
   ```

3. **Include Tests**:
   ```typescript
   describe('YourNewTool', () => {
     it('should execute successfully', async () => {
       const tool = new YourNewTool();
       const result = await tool.execute(validArgs);
       expect(result.success).toBe(true);
     });
   });
   ```

## API Registry Contributions

When adding APIs to the registry:

1. **Verify API Quality**:
   - HTTPS support required
   - CORS enabled
   - Stable endpoints
   - Clear documentation

2. **Follow Schema**:
   ```typescript
   {
     name: "API Name",
     url: "https://api.example.com/v1",
     description: "Clear, concise description",
     category: "category_name",
     headers: { /* if needed */ },
     auth_required: false
   }
   ```

3. **Test Integration**:
   ```bash
   npm run test:api-registry
   ```

## FSM Phase Development

When modifying FSM phases:

1. **Understand Current Flow**:
   ```
   QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY
   ```

2. **Phase Requirements**:
   - Clear entry/exit conditions
   - Specific allowed tools
   - Role-appropriate prompting
   - Error handling

3. **Test Phase Transitions**:
   ```typescript
   describe('New Phase', () => {
     it('should handle phase transition correctly', () => {
       // Test phase logic
     });
   });
   ```

## Documentation Standards

### Code Comments

```typescript
/**
 * Executes FSM phase transition with role-specific context injection
 * @param currentPhase - Current FSM state
 * @param nextPhase - Target FSM state
 * @param context - Session context data
 * @returns Transition result with updated state
 */
async function transitionPhase(
  currentPhase: FSMPhase, 
  nextPhase: FSMPhase, 
  context: SessionContext
): Promise<TransitionResult> {
  // Implementation
}
```

### Documentation Files

- Use clear headings and structure
- Include practical examples
- Keep content current and accurate
- Cross-reference related sections

## Release Process

Releases follow semantic versioning:

- **Patch** (1.0.1): Bug fixes, documentation updates
- **Minor** (1.1.0): New features, tool additions
- **Major** (2.0.0): Breaking changes, architecture updates

## Getting Help

- **Issues**: GitHub Issues for bugs and feature requests
- **Discussions**: GitHub Discussions for questions
- **Documentation**: Check `docs/` directory first
- **Code Examples**: See `docs/EXAMPLES.md`

## License

By contributing to Iron Manus MCP, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Iron Manus MCP! Your contributions help make AI orchestration more accessible and powerful for developers worldwide.