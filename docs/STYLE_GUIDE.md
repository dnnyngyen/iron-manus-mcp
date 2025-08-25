# Iron Manus MCP Style Guide

## Overview

This document defines the standardized language, terminology, and writing style for all Iron Manus MCP documentation. It ensures consistent, professional technical communication across the project.

## Core Principles

1. **Technical Accuracy**: Use precise, factual descriptions backed by evidence
2. **Professional Tone**: Technical but accessible, avoiding marketing hyperbole
3. **Consistent Terminology**: Standardized terms throughout all documentation
4. **Clear Communication**: Direct, actionable information without unnecessary embellishment

## Banned Language

### Marketing Hyperbole (Remove Immediately)
- "revolutionary", "cutting-edge", "game-changing", "bleeding-edge"
- "enterprise-grade", "blazing fast", "seamless", "comprehensive"
- "beautiful dance", "elegant deception", "sophisticated"
- "most technically precise", "advanced", "powerful"
- "state-of-the-art", "next-generation", "world-class"

### Vague Qualifiers (Replace with Specifics)
- "highly optimized" → "optimized for [specific metric]"
- "robust" → "production-ready with [specific features]"
- "efficient" → "processes X requests per second"
- "scalable" → "supports up to X concurrent sessions"

## Approved Terminology

### Core System Components
- **Iron Manus MCP** (not "Iron Manus MCP server" or "Iron Manus framework")
- **8-phase workflow** (not "8-phase loop" or "8-phase cycle")
- **orchestration system** (not "orchestration framework" or "orchestration architecture")
- **finite state machine** (not "FSM system" or "state machine architecture")

### Technical Specifications
- **Version**: v0.2.4 (source code) / v0.2.3 (Docker images)
- **Node.js**: Node.js v20+ (not "18+", "20+", or "22+")
- **Test Count**: 266 tests (not "300+" or "266/266")
- **API Registry**: 65+ endpoints (not "65+ APIs" or "API collection")

### Tool Names (Exact Casing)
- **JARVIS FSM Controller** (not "JARVIS tool" or "FSM controller")
- **APITaskAgent** (not "API Task Agent" or "API research agent")
- **PythonComputationalTool** (not "Python tool" or "computational tool")
- **IronManusStateGraph** (not "state graph" or "session manager")

### Phase Names (Exact Format)
- **INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE**
- Always use uppercase for phase names
- Use arrow notation (→) for sequences
- Individual phases: "INIT phase", "QUERY phase", etc.

## Writing Style Guidelines

### Tone and Voice
- **Technical but approachable**: Write for developers, not marketers
- **Active voice preferred**: "The system processes requests" not "Requests are processed"
- **Present tense**: "The tool validates input" not "The tool will validate input"
- **Specific claims**: Back assertions with evidence or metrics

### Structure and Format
- **Headings**: Use sentence case for headings ("Installation guide" not "Installation Guide")
- **Lists**: Use parallel structure and consistent formatting
- **Code blocks**: Always include language specification
- **Links**: Use descriptive text, not "click here" or "read more"

### Technical Descriptions
- **Features**: Describe what it does, not how amazing it is
- **Capabilities**: List specific functionalities with parameters
- **Performance**: Include measurable metrics when available
- **Security**: Specify exact protection mechanisms

## Standard Replacements

### Architecture Descriptions
❌ "revolutionary FSM-driven orchestration system"
✅ "8-phase finite state machine for workflow orchestration"

❌ "enterprise-grade security with advanced protection"
✅ "production security with SSRF protection, input validation, and rate limiting"

❌ "blazing fast performance with optimized execution"
✅ "optimized performance with configurable concurrency limits"

❌ "seamless integration with comprehensive API support"
✅ "direct integration with 65+ API endpoints"

### Feature Descriptions
❌ "sophisticated cognitive enhancement system"
✅ "role-based prompt generation for 9 specialized agent types"

❌ "intelligent metaprompting-first design"
✅ "prompt-based tool architecture with strategic guidance"

❌ "comprehensive Python data science capabilities"
✅ "unified Python tool supporting web scraping, data analysis, visualization, and machine learning"

### Performance Claims
❌ "handles massive scale with enterprise reliability"
✅ "supports up to 10 concurrent API requests with configurable timeout (1-30 seconds)"

❌ "lightning-fast response times"
✅ "processes requests within configured timeout limits"

❌ "robust error handling and recovery"
✅ "error handling with automatic retry logic and rollback mechanisms"

## Documentation Structure

### File Organization
- **README.md**: Project overview and quick start
- **docs/**: Technical documentation by category
- **ARCHITECTURE.md**: System design and implementation
- **API-REFERENCE.md**: Tool specifications and examples
- **GETTING_STARTED.md**: Installation and basic usage

### Section Standards
- **Overview**: Brief, factual project description
- **Features**: Bullet points with specific capabilities
- **Installation**: Step-by-step instructions with error handling
- **Usage**: Concrete examples with expected outputs
- **API Reference**: Complete interface documentation

## Quality Checklist

### Before Publishing
- [ ] No banned marketing language
- [ ] Consistent terminology throughout
- [ ] Specific claims backed by evidence
- [ ] Technical accuracy verified
- [ ] Code examples tested
- [ ] Links and references updated
- [ ] Professional tone maintained

### Review Questions
1. Would a technical audience find this credible?
2. Are all claims specific and verifiable?
3. Is the terminology consistent with other documentation?
4. Does this help users accomplish their goals?
5. Are there any remaining marketing phrases?

## Version Control

### Documentation Versioning
- Match documentation version to code version
- Update all references when versions change
- Maintain consistency across README, docs, and package.json

### Change Management
- Review all documentation changes for style compliance
- Update related files when making terminology changes
- Maintain this style guide as the authoritative reference

## Examples of Proper Usage

### Project Description
**Good**: "Iron Manus MCP is an 8-phase finite state machine that orchestrates AI workflows through structured phases: INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE."

**Bad**: "Iron Manus MCP is a revolutionary, cutting-edge orchestration framework that seamlessly manages complex AI workflows through sophisticated state transitions."

### Feature Lists
**Good**: 
- 8-phase workflow orchestration with deterministic state transitions
- Unified tool architecture with APITaskAgent and PythonComputationalTool
- Production security with SSRF protection and input validation
- Support for 65+ API endpoints with intelligent selection

**Bad**:
- Revolutionary 8-phase orchestration loop with advanced state management
- Comprehensive, enterprise-grade tool ecosystem
- Blazing fast security with cutting-edge protection mechanisms
- Seamless integration with a vast array of powerful APIs

### Technical Specifications
**Good**: "Requires Node.js v20+ with npm 8+. Test suite includes 266 tests with 100% success rate."

**Bad**: "Built on the latest, most advanced Node.js technology with comprehensive test coverage ensuring enterprise-grade reliability."

---

This style guide ensures Iron Manus MCP documentation maintains professional credibility while providing clear, actionable technical information.