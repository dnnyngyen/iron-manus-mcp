# Changelog

All notable changes to Iron Manus MCP will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2024-12-29

### Added
- **Modular Architecture**: Split fsm.ts into focused modules (phase-engine/, knowledge/, verification/)
- **Configuration Layer**: Centralized config.ts with environment variable support
- **SSRF Protection**: Enterprise-grade security with ssrfGuard and URL validation
- **Type Safety**: Zod validation schemas for all inputs and outputs
- **Testing Infrastructure**: Vitest setup with FSM, SSRF, and config tests
- **CI/CD Pipeline**: GitHub Actions workflow with Node 18/20 testing
- **Concurrency Control**: Replaced custom semaphore with p-limit for better safety
- **Documentation**: Concise README (≤500 words), SECURITY.md, and VISION.md

### Changed  
- **BREAKING**: Refactored FSM into dependency-injected architecture
- **BREAKING**: Updated tool descriptions to remove PyArmor references
- Moved research JSON files to docs/research/ directory
- Improved error handling and logging throughout codebase
- Enhanced verification logic with configurable thresholds

### Security
- Added SSRF protection blocking private IPs and localhost
- Implemented URL sanitization and allowlist support
- Added rate limiting and content size restrictions
- Environment-based security configuration

### Developer Experience
- Modular codebase with clear separation of concerns
- Comprehensive type validation with Zod
- Enhanced debugging and error messages
- Improved code maintainability and testability

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