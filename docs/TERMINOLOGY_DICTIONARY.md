# Iron Manus MCP Terminology Dictionary

## Project Identification

### Primary Name
**Iron Manus MCP** - The complete project name
- Use consistently across all documentation
- Not "Iron Manus MCP server", "Iron Manus framework", or "Iron Manus architecture"

### Alternative References
- **Iron Manus** - Acceptable short form when context is clear
- **MCP Server** - Only when specifically discussing the Model Context Protocol server implementation

## Architecture Components

### Core System
- **8-phase workflow** - The complete state sequence
- **finite state machine** - The underlying architecture pattern
- **orchestration system** - The overall system design
- **workflow orchestration** - The primary function

### Phase Terminology
- **Phase sequence**: INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE
- **Phase names**: Always uppercase (INIT, QUERY, etc.)
- **Phase references**: "INIT phase", "QUERY phase" (not "init phase" or "Query phase")
- **Phase transitions**: Use arrow notation (→) for documentation

## Tool Names (Exact Casing Required)

### Primary Tools
- **JARVIS FSM Controller** - The main orchestration tool
- **APITaskAgent** - Unified API research workflow tool
- **PythonComputationalTool** - Unified Python operations tool
- **IronManusStateGraph** - Session state management tool

### Supporting Tools
- **HealthCheck** - System health monitoring
- **SlideGenerator** - Presentation creation tool
- **Task** - Agent spawning mechanism

## Technical Specifications

### Version References
- **Current version**: v0.2.4 (source code)
- **Docker version**: v0.2.3 (published containers)
- **Format**: Always use "v" prefix with semantic versioning

### Platform Requirements
- **Node.js**: v20+ (not "18+", "20+", or "22+")
- **npm**: 8+ (not "npm 8+" or "npm version 8+")
- **TypeScript**: 5.0+ (not "TypeScript 5.0")
- **Python**: 3.7+ (for optional components)

### Test Specifications
- **Test count**: 266 tests (not "300+" or "266/266")
- **Test framework**: Vitest (not "Jest" or "testing framework")
- **Test status**: 100% success rate (not "all tests passing")

## API and Integration

### API Registry
- **API count**: 65+ endpoints (not "65+ APIs" or "API collection")
- **API registry**: The collection of available endpoints
- **API selection**: Role-based endpoint selection
- **API workflow**: Discovery → validation → fetching → analysis

### Integration Points
- **Model Context Protocol**: MCP (not "MCP Protocol")
- **Claude Code**: Integration platform (not "Claude Code Hooks")
- **Direct integration**: Connection method (not "seamless integration")

## Role System

### Agent Roles (Exact Names)
- **planner** - Systems thinking and strategic decomposition
- **analyzer** - Data validation and pattern recognition
- **coder** - Implementation and test-driven development
- **critic** - Security analysis and compliance checking
- **researcher** - Information gathering and source validation
- **synthesizer** - Integration and optimization thinking
- **ui_architect** - User interface design and component hierarchy
- **ui_implementer** - UI implementation and browser compatibility
- **ui_refiner** - Quality assessment and iterative improvement

### Role References
- Use lowercase for role names in parameters
- Use "agent role" not "user role" in descriptions
- Use "role-based" not "role based" (hyphenated)

## Security and Performance

### Security Features
- **SSRF protection** - Server-side request forgery prevention
- **Input validation** - Parameter and data validation
- **Rate limiting** - Request frequency control
- **Production security** - Overall security posture

### Performance Metrics
- **Concurrency limit** - Maximum simultaneous operations
- **Timeout configuration** - Request time limits
- **Processing time** - Execution duration
- **Response time** - End-to-end latency

## Development and Operations

### Build Process
- **TypeScript compilation** - Source code transformation
- **Build pipeline** - Complete build process
- **Development mode** - Local development environment
- **Production build** - Optimized deployment build

### Testing
- **Test suite** - Complete test collection
- **Unit tests** - Component-level testing
- **Integration tests** - System-level testing
- **Test coverage** - Code coverage metrics

## Documentation Standards

### File Types
- **README.md** - Project overview and quick start
- **API documentation** - Tool and interface specifications
- **Architecture documentation** - System design and implementation
- **User guides** - Step-by-step instructions

### Content Types
- **Technical documentation** - Implementation details
- **User documentation** - Usage instructions
- **Developer documentation** - Integration guides
- **API reference** - Interface specifications

## Deprecated Terms (Do Not Use)

### Marketing Language
- ❌ "revolutionary", "cutting-edge", "game-changing"
- ❌ "enterprise-grade", "blazing fast", "seamless"
- ❌ "comprehensive", "sophisticated", "advanced"
- ❌ "powerful", "robust", "efficient"

### Vague Technical Terms
- ❌ "framework" (use "orchestration system")
- ❌ "architecture" (use "system design" or "implementation")
- ❌ "Software 3.0" (use "natural language orchestration")
- ❌ "Meta Thread-of-Thought" (use "role-based prompt generation")

### Inconsistent Naming
- ❌ "Iron Manus MCP server" (use "Iron Manus MCP")
- ❌ "FSM system" (use "finite state machine")
- ❌ "API collection" (use "API registry")
- ❌ "Python tool" (use "PythonComputationalTool")

## Usage Examples

### Correct Usage
```markdown
Iron Manus MCP is an 8-phase finite state machine that orchestrates AI workflows. The system processes requests through the sequence: INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE.

The APITaskAgent provides unified API research workflows, while the PythonComputationalTool handles all Python operations. The system requires Node.js v20+ and includes 266 tests with 100% success rate.
```

### Incorrect Usage
```markdown
Iron Manus MCP is a revolutionary, cutting-edge orchestration framework that seamlessly manages sophisticated AI workflows through advanced state transitions.

The powerful API research agent provides comprehensive API integration, while the advanced Python tool handles all computational tasks. The system leverages bleeding-edge Node.js technology with enterprise-grade test coverage.
```

## Consistency Guidelines

### Cross-Reference Rules
1. Use identical terminology in all related documents
2. Update all references when terminology changes
3. Maintain consistency between code comments and documentation
4. Ensure README.md aligns with detailed documentation

### Review Checklist
- [ ] All tool names use exact casing
- [ ] Phase names are uppercase with arrow notation
- [ ] Version numbers include "v" prefix
- [ ] No banned marketing language
- [ ] Technical claims are specific and verifiable
- [ ] Terminology matches this dictionary

---

This terminology dictionary serves as the authoritative reference for all Iron Manus MCP documentation.