# Changelog

All notable changes to Iron Manus MCP will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.4] - 2025-01-03

### Added
- **Comprehensive JSDoc Documentation**: Added complete JSDoc documentation across entire codebase (~4,000+ lines)
- **Professional Documentation Standards**: Established consistent JSDoc patterns for all interfaces, classes, and functions
- **Core System Documentation**: Complete documentation for FSM engine, types, configuration, and server setup
- **Tool Documentation**: 100% JSDoc coverage for all 10 tools in src/tools/ directory
- **Architecture Documentation**: Detailed explanations of 8-phase FSM, Component-Cognitive Duality, and fractal orchestration
- **Developer Experience**: Significantly improved code maintainability and onboarding experience

### Enhanced
- **src/core/types.ts**: Complete JSDoc for all 50+ interfaces, enums, and type definitions
- **src/core/fsm.ts**: Full documentation of FSM exports and orchestration functions
- **src/phase-engine/FSM.ts**: Comprehensive documentation of 609-line main FSM engine
- **src/index.ts**: Complete server setup and MCP protocol documentation
- **src/core/prompts.ts**: Detailed documentation of 1171-line prompt generation system
- **src/verification/metrics.ts**: Full validation and metrics system documentation
- **src/config.ts**: Complete configuration layer documentation with environment variables
- **src/tools/iron-manus-state-graph.ts**: Comprehensive FSM state management documentation
- **src/tools/python-executor.ts**: Complete Python integration and data science tool documentation

### Technical Improvements
- **Documentation Quality**: Professional-grade JSDoc with examples, parameter descriptions, and integration notes
- **Architectural Clarity**: Clear documentation of complex systems including FSM orchestration and cognitive enhancement
- **Maintenance**: Established documentation standards for future development

## [0.2.3] - 2025-01-02

### Added
- **Docker Hub Release**: Published clean Docker images to Docker Hub registry (`dnnyngyen/iron-manus-mcp`)
- **GitHub Container Registry**: Published images to GHCR (`ghcr.io/dnnyngyen/iron-manus-mcp`)
- **Docker Compose Support**: Added comprehensive docker-compose.yml with environment configuration
- **Multi-Registry Distribution**: Images available on both Docker Hub and GitHub Container Registry
- **Container Documentation**: Added detailed Docker usage instructions and examples to README

### Changed
- **Clean Docker Configuration**: Removed personal identifiers from docker-compose.yml for public distribution
- **Docker Image Tagging**: Implemented proper versioning with `latest`, `stable`, and `0.2.3` tags
- **Documentation Enhancement**: Added comprehensive Docker installation and usage sections

### Fixed
- Docker image builds with proper multi-stage optimization (217MB final size)
- Container environment variable configuration
- Public registry compatibility and clean distribution

## [0.2.2] - 2025-01-02

### Changed
- **Documentation Updates**: Updated all test count references from 107 to 163 tests to reflect current test suite status
- **Badge Updates**: Updated GitHub badges in README.md to show accurate test counts (163/163 passing)
- **Cleanup**: Removed legacy JSON files as per prevention guidelines

### Fixed
- Documentation accuracy across README.md, CHANGELOG.md for global deployment readiness
- Test count inconsistencies in documentation and badges

## [0.2.1] - 2024-12-30

### Added
- **Build Reliability**: Enhanced build script with mkdir -p dist to ensure output directory exists
- **Installation Troubleshooting**: Added comprehensive fallback instructions for npm install issues
- **Clean Build Process**: Verified complete workflow from clean state to running server
- **Deployment Documentation**: Added specific commands for handling installation failures

### Fixed
- Build process reliability issues
- npm install hanging or failure scenarios
- Missing directory creation before TypeScript compilation

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