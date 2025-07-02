# Changelog

All notable changes to Iron Manus MCP will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2024-12-29

### Added
- **Enhanced 6-Phase FSM**: Improved 6-phase workflow (QUERY→ENHANCE→KNOWLEDGE→PLAN→EXECUTE→VERIFY) with INIT/DONE states
- **Jest to Vitest Migration**: Complete test framework migration with 163/163 tests passing
- **Repository Flattening**: Eliminated nested directory structure for cleaner architecture
- **ESLint Integration**: Added comprehensive TypeScript linting with @typescript-eslint
- **Node.js Compatibility**: Tested support for Node 18.x, 20.x, and 22.x
- **CI/CD Improvements**: GitHub Actions with parallel test execution and security audits
- **Type System Enhancements**: Full TypeScript 5.0 with strict mode enabled
- **SSRF Security Enhancements**: Advanced URL validation and allowlist support

### Changed  
- **BREAKING**: Repository structure flattened (removed nested iron-manus-mcp/ directory)
- **BREAKING**: Test framework changed from Jest to Vitest for better ES module support
- **BREAKING**: Enhanced FSM workflow with improved state management
- Improved package.json with proper ES module configuration
- Enhanced CI pipeline with comprehensive error reporting
- Updated MCP SDK imports for v1.13.0+ compatibility

### Fixed
- CI/CD pipeline failures with ESLint dependency issues
- Node.js version compatibility across 18.x, 20.x, 22.x
- Test execution in GitHub Actions environment
- Import path issues with ES modules and TypeScript
- Package dependency conflicts and security vulnerabilities

### Security
- Enhanced SSRF protection with comprehensive IP blocking
- Advanced URL validation and sanitization
- Configurable allowlist support for trusted hosts
- Rate limiting and request timeout enforcement

### Developer Experience
- Complete Jest→Vitest migration for modern testing
- Comprehensive TypeScript configuration with strict mode
- ESLint integration with TypeScript-specific rules
- Improved CI/CD with parallel execution and debugging
- Clean repository structure with flattened directories

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