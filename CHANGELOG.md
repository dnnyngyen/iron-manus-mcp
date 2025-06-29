# Changelog

All notable changes to Iron Manus MCP will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- CONTRIBUTING.md with comprehensive development guidelines
- PERFORMANCE.md guide for context optimization and scaling strategies
- META_PROMPT_GUIDE.md with visual syntax reference and examples
- INTERACTIVE_DEMO.md showing step-by-step 6-phase FSM orchestration
- Enhanced TROUBLESHOOTING.md with FSM state errors and meta-prompt validation
- Expanded EXAMPLES.md with 15 real-world use cases across multiple domains
- INTEGRATION.md for multi-MCP server coordination patterns (planned)

### Documentation Improvements
- Added visual architecture diagrams verification and enhancement
- Created interactive demo walkthrough for new users
- Comprehensive troubleshooting guide for runtime issues
- Performance optimization strategies for large-scale projects
- Meta-prompt syntax validation and best practices
- Contributing guidelines for community development

## [1.1.0] - 2024-06-27

### Added
- **Meta Thread-of-Thought Orchestration** - First implementation applying Thread-of-Thought patterns to FSM orchestration
- Modular tool architecture with centralized registry system
- Context segmentation solution for Claude Code's context window limitations
- Software 3.0 principles implementation with natural language as programming interface
- Academic research documentation (COGNITIVE_PARADIGMS.md)
- Audience-specific documentation structure

### Changed
- **BREAKING**: Updated terminology from "Thread-of-Thought Meta-Orchestration" to "Meta Thread-of-Thought Orchestration"
- Positioned architecture following Meta Chain-of-Thought academic precedent
- Enhanced documentation for developers, researchers, and technical implementers
- Refactored monolithic index.ts into focused modular architecture
- Improved FSM controller with better context management

### Fixed
- Documentation accuracy and consistency across all files
- Academic positioning and citations
- Setup instructions using correct `claude mcp add` CLI commands
- Context flow and audience targeting in documentation

### Technical Improvements
- Context segmentation at FSM phase and Task() agent levels
- Enhanced role-based cognitive enhancement system
- Improved error handling and response validation
- Better TypeScript type safety and maintainability
- Comprehensive test suite with 98.5% success rate

### Migration Guide
- Update any references to "Thread-of-Thought Meta-Orchestration" in documentation
- Review academic citations for updated positioning
- No code changes required for existing implementations

## [1.0.0] - 2024-06-XX

### Added
- Initial release with JARVIS FSM controller
- 6-phase agent loop implementation (QUERY→ENHANCE→KNOWLEDGE→PLAN→EXECUTE→VERIFY)
- Native Claude Code tool integration (TodoWrite/TodoRead/Task)
- Fractal orchestration capabilities with recursive agent spawning
- Role-based cognitive enhancement with 9 specialized roles
- 65+ API registry with intelligent selection and auto-connection