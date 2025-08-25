---
title: "Iron Manus MCP Meta-Prompt Architecture Guide"
topics: ["meta-prompts", "agent spawning", "fractal orchestration", "Task agents"]
related: ["core/FSM.md", "api/EXAMPLES.md", "guides/INTEGRATION.md"]
---

# Iron Manus MCP Meta-Prompt Architecture Guide

**Complete reference for meta-prompt DSL and Meta Thread-of-Thought orchestration system for fractal agent spawning.**

## Overview

Meta-prompts are specialized instruction patterns that enable **fractal orchestration** through autonomous Task() agent spawning. They bridge high-level strategic planning with specialized execution by creating focused context windows for independent Claude instances.

**Meta Thread-of-Thought (THoT) Orchestration Pattern:**
1. Main FSM orchestrator manages 8-phase workflow
2. Meta-prompts embedded in todos trigger Task() agent spawning
3. Task() agents operate as independent Claude instances with specialized context
4. Results flow back to main orchestrator for integration

## Core Meta-Prompt Syntax

### Basic Structure
```
(ROLE: agent_type) (CONTEXT: domain) (PROMPT: instructions) (OUTPUT: deliverable)
```

**All four components are required** for valid meta-prompt generation.

### Visual Syntax Reference
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│    ROLE     │   CONTEXT   │   PROMPT    │   OUTPUT    │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ Agent type  │ Domain area │ Specific    │ Expected    │
│ and thinking│ and tech    │ actionable  │ deliverable │
│ methodology │ stack       │ instruction │ format      │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

## Component Specifications

### ROLE Component

**Available Agent Types** (9 specialized roles with cognitive enhancement):

#### Core Development Roles

**`planner`** - Strategic decomposition and systematic planning
- **Thinking Methodology**: Systems thinking, dependency analysis, risk assessment
- **Frameworks**: systems_thinking, dependency_analysis
- **Authority Level**: STRATEGIZE_AND_COORDINATE
- **Use Cases**: Architecture design, project planning, resource allocation

**`coder`** - Implementation with testing and best practices
- **Thinking Methodology**: TDD, single responsibility, error handling, performance
- **Frameworks**: TDD, modular_architecture
- **Authority Level**: IMPLEMENT_AND_VALIDATE
- **Use Cases**: Code implementation, API development, testing

**`critic`** - Security review and quality assessment
- **Thinking Methodology**: Security analysis, compliance verification, edge cases
- **Frameworks**: security_review, code_analysis
- **Authority Level**: EVALUATE_AND_REFINE
- **Use Cases**: Code review, security assessment, quality validation

#### Research and Analysis Roles

**`researcher`** - Information gathering and knowledge synthesis
- **Thinking Methodology**: Source validation, triangulation, gap identification
- **Frameworks**: systematic_research, parallel_validation
- **Authority Level**: INVESTIGATE_AND_SYNTHESIZE
- **Use Cases**: Market research, technical documentation, competitive analysis

**`analyzer`** - Data analysis and pattern recognition
- **Thinking Methodology**: Data validation, statistical analysis, pattern verification
- **Frameworks**: statistical_analysis, pattern_recognition
- **Authority Level**: ANALYZE_AND_REPORT
- **Use Cases**: Data science, performance analysis, metrics evaluation

**`synthesizer`** - Integration and optimization
- **Thinking Methodology**: System integration, trade-off analysis, constraint optimization
- **Frameworks**: system_integration, optimization_framework
- **Authority Level**: INTEGRATE_AND_OPTIMIZE
- **Use Cases**: System integration, workflow optimization, result synthesis

#### UI Specialization Roles

**`ui_architect`** - UI architecture and design systems
- **Thinking Methodology**: User-centered design, component hierarchy, accessibility
- **Frameworks**: design_systems, component_hierarchy
- **Authority Level**: DESIGN_AND_ARCHITECT
- **Use Cases**: UI architecture, design systems, component planning

**`ui_implementer`** - Frontend development and component building
- **Thinking Methodology**: Proven patterns, cross-browser compatibility, performance
- **Frameworks**: React, concurrent_execution
- **Authority Level**: IMPLEMENT_AND_RENDER
- **Use Cases**: Component implementation, frontend development, UI coding

**`ui_refiner`** - UI refinement and optimization
- **Thinking Methodology**: Usability evaluation, accessibility compliance, incremental improvement
- **Frameworks**: ui_refinement, accessibility
- **Authority Level**: REFINE_AND_POLISH
- **Use Cases**: UI polishing, accessibility improvement, user experience optimization

### CONTEXT Component

**Technology Context Examples:**
```
✅ Specific: react_authentication, nodejs_api, python_data_analysis
✅ Framework-focused: nextjs_routing, express_middleware, django_models
✅ Domain-specific: ecommerce_cart, user_management, payment_processing

❌ Generic: web_development, programming, software
❌ Vague: application, system, general
```

**Domain Context Guidelines:**
```
✅ Feature-specific: jwt_authentication, crud_operations, form_validation
✅ Business-focused: inventory_management, order_processing, customer_support
✅ Technical-focused: database_optimization, api_performance, security_audit

❌ Overly broad: business_logic, application_development, system_design
❌ Ambiguous: functionality, features, requirements
```

### PROMPT Component

**Effective Prompt Patterns:**

#### Action-Oriented Instructions
```
✅ "Create JWT authentication middleware with error handling and refresh token support"
✅ "Build responsive React dashboard with real-time data updates and user management"
✅ "Implement PostgreSQL database schema with proper indexing and relationships"

❌ "Work on authentication stuff"
❌ "Handle the user interface"
❌ "Set up the database"
```

#### Technical Specification Requirements
```
✅ "Create REST API endpoints with Express, input validation, error handling, and OpenAPI documentation"
✅ "Build data visualization dashboard with D3.js, real-time updates, and interactive filtering"
✅ "Implement machine learning pipeline with scikit-learn, model evaluation, and deployment scripts"

❌ "Make some API endpoints"
❌ "Add charts and graphs"
❌ "Create ML model"
```

#### Quality and Testing Specifications
```
✅ "Implement payment processing with Stripe integration, error handling, webhook validation, and comprehensive unit tests"
✅ "Create responsive UI components with accessibility features, proper semantic HTML, and Jest test coverage"
✅ "Build database models with validation, audit logging, migration scripts, and performance optimization"

❌ "Add payment functionality"
❌ "Make responsive components"
❌ "Set up database tables"
```

### OUTPUT Component

**Deliverable Type Specifications:**

#### Code Deliverables
```
✅ react_components - Component files with props, state, and documentation
✅ api_endpoints - REST/GraphQL endpoints with validation and docs
✅ service_code - Business logic with error handling and tests
✅ database_schema - Models, migrations, indexes, and seed data
✅ test_suite - Unit, integration, and e2e tests with coverage
```

#### Documentation Deliverables
```
✅ api_documentation - Endpoint docs with examples and authentication
✅ setup_guide - Installation, configuration, and deployment instructions
✅ user_manual - End-user documentation with screenshots and workflows
✅ technical_specs - Architecture diagrams and implementation details
✅ security_analysis - Vulnerability assessment and mitigation strategies
```

#### Configuration Deliverables
```
✅ deployment_config - Docker, CI/CD, and infrastructure setup
✅ environment_setup - Development environment and tool configuration
✅ monitoring_config - Logging, metrics, and alerting setup
✅ security_config - Authentication, authorization, and security policies
```

## Complete Meta-Prompt Examples

### Frontend Development Examples

#### React Component with State Management
```
(ROLE: ui_implementer) (CONTEXT: react_ecommerce) (PROMPT: Create product catalog component with filtering, sorting, pagination, and shopping cart integration using React hooks, TypeScript, and Material-UI) (OUTPUT: react_components)
```

**Generated Agent Behavior:**
- Implements React hooks for state management
- Adds TypeScript interfaces for type safety
- Integrates Material-UI components and theming
- Includes responsive design patterns
- Provides comprehensive component documentation

#### UI Architecture Design
```
(ROLE: ui_architect) (CONTEXT: dashboard_design) (PROMPT: Design responsive admin dashboard layout with navigation, real-time metrics, data tables, and chart visualization using modern UI principles and accessibility standards) (OUTPUT: design_specifications)
```

**Generated Agent Behavior:**
- Creates comprehensive UI/UX specifications
- Defines component hierarchy and data flow
- Specifies responsive breakpoints and layouts
- Includes WCAG accessibility guidelines
- Provides wireframes and interaction patterns

#### UI Refinement and Optimization
```
(ROLE: ui_refiner) (CONTEXT: mobile_optimization) (PROMPT: Optimize existing web application for mobile devices with touch interactions, gesture support, and performance improvements) (OUTPUT: mobile_optimized_ui)
```

**Generated Agent Behavior:**
- Analyzes current UI for mobile compatibility
- Implements touch-friendly interactions
- Optimizes performance for mobile devices
- Adds gesture recognition and support
- Provides mobile-specific UX improvements

### Backend Development Examples

#### API Service Implementation
```
(ROLE: coder) (CONTEXT: nodejs_microservice) (PROMPT: Build RESTful microservice for user management with authentication, authorization, rate limiting, and comprehensive error handling using Express, MongoDB, and JWT) (OUTPUT: service_code)
```

**Generated Agent Behavior:**
- Implements Express server with proper middleware
- Adds MongoDB integration with Mongoose
- Includes JWT authentication and authorization
- Implements rate limiting and security headers
- Provides comprehensive error handling and logging

#### Database Design and Optimization
```
(ROLE: coder) (CONTEXT: postgresql_optimization) (PROMPT: Design and optimize PostgreSQL database schema for high-traffic e-commerce platform with proper indexing, partitioning, and query optimization) (OUTPUT: database_schema)
```

**Generated Agent Behavior:**
- Creates normalized database schema
- Implements proper indexing strategies
- Adds table partitioning for scalability
- Includes query optimization techniques
- Provides performance monitoring setup

### Data Science Examples

#### Machine Learning Pipeline
```
(ROLE: analyzer) (CONTEXT: ml_customer_churn) (PROMPT: Build complete machine learning pipeline for customer churn prediction with feature engineering, model selection, evaluation, and deployment using scikit-learn and MLflow) (OUTPUT: ml_pipeline)
```

**Generated Agent Behavior:**
- Implements data preprocessing and feature engineering
- Performs model selection and hyperparameter tuning
- Adds comprehensive model evaluation metrics
- Includes MLflow for experiment tracking
- Provides deployment scripts and monitoring

#### Data Visualization Dashboard
```
(ROLE: analyzer) (CONTEXT: business_analytics) (PROMPT: Create interactive data visualization dashboard for sales analytics with real-time updates, drill-down capabilities, and executive reporting using D3.js and Python backend) (OUTPUT: analytics_dashboard)
```

**Generated Agent Behavior:**
- Builds interactive D3.js visualizations
- Implements real-time data updates
- Adds drill-down and filtering capabilities
- Creates executive summary reports
- Provides data export and sharing features

### Research and Analysis Examples

#### Market Research
```
(ROLE: researcher) (CONTEXT: competitive_analysis) (PROMPT: Conduct comprehensive competitive analysis for SaaS product including feature comparison, pricing analysis, market positioning, and strategic recommendations) (OUTPUT: research_report)
```

**Generated Agent Behavior:**
- Performs systematic competitor identification
- Analyzes feature sets and pricing models
- Evaluates market positioning strategies
- Provides SWOT analysis and recommendations
- Creates competitive landscape visualization

#### Technical Documentation
```
(ROLE: researcher) (CONTEXT: api_documentation) (PROMPT: Create comprehensive API documentation with interactive examples, authentication guides, SDKs, and integration tutorials for developer adoption) (OUTPUT: technical_documentation)
```

**Generated Agent Behavior:**
- Documents all API endpoints with examples
- Creates interactive API explorer
- Provides authentication and authorization guides
- Includes SDK documentation and code samples
- Adds integration tutorials and best practices

### Security and Quality Examples

#### Security Assessment
```
(ROLE: critic) (CONTEXT: web_application_security) (PROMPT: Perform comprehensive security audit of web application including vulnerability assessment, penetration testing, and security best practices implementation) (OUTPUT: security_assessment)
```

**Generated Agent Behavior:**
- Conducts systematic vulnerability scanning
- Performs penetration testing procedures
- Analyzes authentication and authorization flows
- Reviews data protection and privacy measures
- Provides security improvement recommendations

#### Code Quality Review
```
(ROLE: critic) (CONTEXT: code_quality_assessment) (PROMPT: Review codebase for quality, maintainability, and best practices including code analysis, testing coverage, and refactoring recommendations) (OUTPUT: quality_assessment)
```

**Generated Agent Behavior:**
- Analyzes code quality metrics
- Reviews testing coverage and effectiveness
- Identifies refactoring opportunities
- Evaluates architectural patterns
- Provides improvement prioritization

## Advanced Meta-Prompt Patterns

### Hierarchical Agent Spawning

**Parent Meta-Prompt:**
```
(ROLE: planner) (CONTEXT: fullstack_application) (PROMPT: Create comprehensive development plan for social media platform with user authentication, content management, real-time messaging, and analytics dashboard) (OUTPUT: project_plan)
```

**Generated Child Meta-Prompts:**
```
(ROLE: ui_architect) (CONTEXT: social_media_ui) (PROMPT: Design user interface for social media platform with feed, profiles, messaging, and mobile responsiveness) (OUTPUT: ui_specifications)

(ROLE: coder) (CONTEXT: realtime_backend) (PROMPT: Implement WebSocket server for real-time messaging, notifications, and live updates using Node.js and Socket.io) (OUTPUT: backend_services)

(ROLE: coder) (CONTEXT: content_management) (PROMPT: Build content management system with media upload, moderation, and analytics tracking) (OUTPUT: cms_system)

(ROLE: analyzer) (CONTEXT: user_analytics) (PROMPT: Create analytics dashboard for user engagement, content performance, and platform metrics) (OUTPUT: analytics_system)
```

### Cross-Domain Integration

**Integration Meta-Prompt:**
```
(ROLE: synthesizer) (CONTEXT: microservices_integration) (PROMPT: Design and implement integration layer for microservices architecture with service discovery, API gateway, distributed tracing, and error handling) (OUTPUT: integration_architecture)
```

**Generated Agent Behavior:**
- Designs service communication patterns
- Implements API gateway with routing and load balancing
- Adds distributed tracing and monitoring
- Creates service discovery and health checking
- Provides error handling and circuit breaker patterns

### Multi-Agent Coordination

**Coordinated Development Example:**
```
(ROLE: planner) (CONTEXT: team_coordination) (PROMPT: Coordinate development of e-commerce platform across frontend, backend, and DevOps teams with proper task distribution and integration points) (OUTPUT: coordination_plan)
```

**Spawned Coordinated Agents:**
```
(ROLE: ui_implementer) (CONTEXT: ecommerce_frontend) (PROMPT: Implement React storefront with product catalog, shopping cart, checkout flow, and user account management) (OUTPUT: frontend_application)

(ROLE: coder) (CONTEXT: ecommerce_backend) (PROMPT: Build Node.js API for product management, order processing, payment integration, and inventory tracking) (OUTPUT: backend_services)

(ROLE: coder) (CONTEXT: devops_automation) (PROMPT: Set up CI/CD pipeline, containerization, monitoring, and deployment automation for e-commerce platform) (OUTPUT: devops_infrastructure)

(ROLE: synthesizer) (CONTEXT: system_integration) (PROMPT: Integrate frontend, backend, and infrastructure components with proper testing and deployment coordination) (OUTPUT: integrated_system)
```

## Agent Context Isolation and Communication

### Critical Limitation: Complete Context Isolation

**Task() agents spawn with completely isolated contexts:**

#### What Agents CANNOT Do:
- Access variables or data from the spawning agent
- Directly receive output from other Task() agents
- Share memory or state with other agents
- Inherit context from the main orchestrator
- Access session state or payload data directly

#### What Agents CAN Do:
- Read and write files with explicit file paths
- Use all available tools independently
- Work on tasks defined in their prompts
- Report results through their final output
- Create their own TodoWrite decompositions

### Session Workspace Communication Pattern

**File-Based Communication Protocol:**
```
/tmp/iron-manus-session-{session_id}/
├── primary_research.md      # Researcher agent output
├── analysis_data.md         # Analyzer agent output
├── technical_specs.md       # Coder agent output
├── ui_specifications.md     # UI architect agent output
├── security_assessment.md   # Critic agent output
└── synthesized_knowledge.md # Synthesizer agent integration
```

**Communication Flow:**
1. Main orchestrator creates session directory
2. Each agent writes results to specific files
3. Synthesis agent reads all files and integrates
4. Main orchestrator reads synthesis for FSM progression
5. Session data flows back through JARVIS payload

### Best Practices for Agent Communication

#### 1. Always Specify File Paths in Meta-Prompts
```
✅ Good: "(PROMPT: Research authentication patterns and write findings to /tmp/iron-manus-session-{session_id}/auth_research.md with implementation recommendations)"

❌ Bad: "(PROMPT: Research authentication patterns and save results)"
```

#### 2. Use Session-Specific Directories
```
✅ Good: "/tmp/iron-manus-session-{session_id}/component_specs.md"
❌ Bad: "/tmp/component_specs.md" (conflicts with other sessions)
```

#### 3. Design for Parallel Execution
```
✅ Good: Multiple agents writing to different files simultaneously
❌ Bad: Sequential agents expecting context inheritance
```

#### 4. Include Synthesis Instructions
```
✅ Good: Create synthesizer agent to integrate all outputs
❌ Bad: Expect main orchestrator to manually combine results
```

## Meta-Prompt Quality Validation

### Syntax Validation Checklist
- [ ] All four components present: ROLE, CONTEXT, PROMPT, OUTPUT
- [ ] Proper parentheses and colons: `(COMPONENT: value)`
- [ ] Valid role name from 9 supported agent types
- [ ] Specific, focused context specification
- [ ] Actionable prompt with clear instructions
- [ ] Well-defined output deliverable type

### Content Quality Checklist
- [ ] Role matches the type of work requested
- [ ] Context provides sufficient technical scope
- [ ] Prompt includes quality and testing requirements
- [ ] Output type enables proper result validation
- [ ] File paths specified for agent communication
- [ ] Integration strategy defined for multi-agent workflows

### Common Mistakes and Corrections

#### Invalid Syntax Examples
```
❌ Bad: (ROLE: coder) (PROMPT: Build authentication) (OUTPUT: code)
✅ Good: (ROLE: coder) (CONTEXT: nodejs_jwt) (PROMPT: Build JWT authentication middleware with session management and error handling) (OUTPUT: service_code)
```

#### Generic Specifications
```
❌ Bad: (ROLE: developer) (CONTEXT: web) (PROMPT: Make a website) (OUTPUT: files)
✅ Good: (ROLE: ui_implementer) (CONTEXT: react_portfolio) (PROMPT: Create responsive portfolio website with project showcase, contact form, and blog integration) (OUTPUT: react_components)
```

#### Role Mismatches
```
❌ Bad: (ROLE: ui_refiner) (CONTEXT: backend_api) (PROMPT: Build REST endpoints) (OUTPUT: api_code)
✅ Good: (ROLE: coder) (CONTEXT: express_api) (PROMPT: Build REST endpoints with validation, authentication, and comprehensive error handling) (OUTPUT: api_endpoints)
```

## FSM Integration and Agent Spawning

### PLAN Phase: Meta-Prompt Generation

The PLAN phase creates todos with embedded meta-prompts:
```typescript
// FSM detects complex tasks and generates meta-prompts
const complexTasks = [
  "(ROLE: coder) (CONTEXT: authentication_system) (PROMPT: Implement secure JWT authentication with password reset) (OUTPUT: auth_services)",
  "(ROLE: ui_implementer) (CONTEXT: dashboard_ui) (PROMPT: Create responsive admin dashboard with real-time metrics) (OUTPUT: dashboard_components)"
];
```

### EXECUTE Phase: Agent Spawning

The EXECUTE phase detects meta-prompt patterns and spawns Task() agents:
```typescript
// System detects meta-prompt and spawns agent
const metaPrompt = extractMetaPromptFromTodo(todoContent);
if (metaPrompt) {
  await Task({
    description: generateRoleEnhancedPrompt(metaPrompt),
    // Agent receives specialized context with role-specific thinking methodologies
  });
}
```

### Single-Tool-Per-Iteration Enforcement

The system enforces Manus compliance through strict tool gating:
```typescript
// Phase-specific tool restrictions
export const PHASE_ALLOWED_TOOLS = {
  KNOWLEDGE: ['WebSearch', 'WebFetch', 'APITaskAgent', 'PythonComputationalTool', 'Task'],
  EXECUTE: ['Task', 'Bash', 'Read', 'Write', 'Edit', 'PythonComputationalTool'],
  VERIFY: ['Read', 'PythonComputationalTool']
};
```

## Performance and Optimization

### Agent Spawning Performance
- **Creation time**: 100-500ms per agent
- **Context loading**: 50-200ms
- **Parallel execution**: 2-5 concurrent agents optimal
- **Memory usage**: 10-20MB per agent instance

### Optimization Strategies
1. **Parallel agent spawning**: Multiple agents work concurrently
2. **File-based communication**: Efficient result sharing
3. **Context segmentation**: Prevents context window exhaustion
4. **Specialized roles**: Optimized cognitive frameworks per agent type

## Summary

The Iron Manus MCP meta-prompt architecture provides:

### Key Features
1. **Domain-Specific Language**: Structured syntax for agent spawning
2. **9 Specialized Roles**: Each with unique thinking methodologies
3. **Context Isolation**: Independent agent contexts prevent interference
4. **File-Based Communication**: Efficient result sharing and integration
5. **Hierarchical Orchestration**: Multi-level agent coordination
6. **Quality Validation**: Comprehensive syntax and content validation

### Benefits
- **Cognitive Enhancement**: Role-specific thinking methodologies
- **Scalable Complexity**: Fractal decomposition of complex tasks
- **Autonomous Execution**: Independent agent operation
- **Quality Assurance**: Built-in validation and best practices
- **Integration Coherence**: Structured result synthesis

The meta-prompt architecture demonstrates how structured natural language can become a powerful programming interface for AI orchestration, enabling complex projects to be decomposed into specialized, autonomous execution units while maintaining coherent integration and quality standards.