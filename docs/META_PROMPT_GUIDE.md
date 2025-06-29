# Meta-Prompt Syntax Guide

This guide provides a comprehensive reference for Iron Manus MCP's meta-prompt DSL (Domain Specific Language) used for agent spawning and task delegation.

## Overview

Meta-prompts are specialized instructions that automatically generate Task() agents with role-specific expertise, context, and deliverable specifications. They enable the FSM to spawn autonomous agents that work within focused context windows.

## Core Syntax

### Basic Structure

```text
(ROLE: agent_type) (CONTEXT: domain) (PROMPT: instructions) (OUTPUT: deliverable)
```

**All four components are required** for valid meta-prompt generation.

### Visual Syntax Reference

```text
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

**Available Agent Types:**

#### Development Roles
- **`planner`** - Strategic decomposition and dependency analysis
- **`coder`** - Implementation with testing and best practices  
- **`critic`** - Security review and quality assessment

#### Research and Analysis Roles
- **`researcher`** - Information gathering and synthesis
- **`analyzer`** - Data analysis and pattern recognition
- **`synthesizer`** - Integration and optimization

#### UI Specialization Roles
- **`ui_architect`** - V0-style UI architecture and systematic design
- **`ui_implementer`** - V0-style UI implementation with concurrent execution
- **`ui_refiner`** - V0-style UI refinement with polished aesthetics

**Role Selection Guidelines:**
```text
✅ Use specific roles: ui_implementer, coder, researcher
❌ Avoid generic roles: developer, person, assistant
```

### CONTEXT Component

**Context Specifications:**

#### Technology Context
```text
✅ Specific: react_authentication, nodejs_api, python_data_analysis
✅ Framework-focused: nextjs_routing, express_middleware, django_models
❌ Generic: web_development, programming, software
```

#### Domain Context
```text
✅ Focused: ecommerce_cart, user_management, data_visualization
✅ Feature-specific: jwt_authentication, crud_operations, form_validation
❌ Broad: business_logic, application_development, system_design
```

#### Integration Context
```text
✅ Clear boundaries: frontend_components, backend_services, database_layer
✅ API-specific: rest_endpoints, graphql_resolvers, websocket_handlers
❌ Overlapping: full_stack, everything, general_development
```

### PROMPT Component

**Effective Prompt Patterns:**

#### Action-Oriented Instructions
```text
✅ "Create JWT authentication middleware with error handling"
✅ "Build React login form with validation and state management"
✅ "Implement user CRUD operations with database integration"

❌ "Work on authentication stuff"
❌ "Handle the login functionality"
❌ "Do some coding work"
```

#### Specific Technical Requirements
```text
✅ "Create responsive dashboard with React hooks and Material-UI components"
✅ "Build REST API endpoints with Express, validation, and error handling"
✅ "Implement data visualization with D3.js and real-time updates"

❌ "Make a nice-looking dashboard"
❌ "Create some API endpoints"  
❌ "Add charts and graphs"
```

#### Quality and Testing Specifications
```text
✅ "Implement payment processing with Stripe integration, error handling, and unit tests"
✅ "Create responsive UI components with accessibility features and Jest tests"
✅ "Build database models with validation, relationships, and migration scripts"

❌ "Add payment functionality"
❌ "Make responsive components"
❌ "Set up the database"
```

### OUTPUT Component

**Deliverable Type Specifications:**

#### Code Deliverables
```text
✅ react_components - Specific component files with props and state
✅ api_endpoints - REST/GraphQL endpoints with documentation
✅ service_code - Business logic services with error handling
✅ test_suite - Comprehensive tests with coverage reports
✅ database_schema - Models, migrations, and seed data
```

#### Documentation Deliverables
```text
✅ api_documentation - Endpoint docs with examples
✅ setup_guide - Installation and configuration instructions
✅ user_manual - End-user documentation with screenshots
✅ technical_specs - Architecture and implementation details
```

#### Configuration Deliverables
```text
✅ deployment_config - Docker, CI/CD, and infrastructure setup
✅ environment_setup - Development environment configuration
✅ security_config - Authentication, authorization, and security settings
```

## Complete Examples

### Frontend Development Examples

#### React Component Creation
```text
(ROLE: ui_implementer) (CONTEXT: react_ecommerce) (PROMPT: Create product catalog component with filtering, sorting, and pagination using React hooks and Material-UI) (OUTPUT: react_components)
```

**Generated Agent Behavior:**
- Focuses on React best practices and hooks usage
- Implements Material-UI design patterns
- Includes proper state management for filtering/sorting
- Adds responsive design considerations
- Provides component documentation and prop types

#### UI Architecture Planning
```text
(ROLE: ui_architect) (CONTEXT: dashboard_design) (PROMPT: Design responsive admin dashboard layout with navigation, charts, and data tables using modern UI principles) (OUTPUT: design_specifications)
```

**Generated Agent Behavior:**
- Creates comprehensive UI/UX specifications
- Defines component hierarchy and relationships
- Specifies responsive breakpoints and layouts
- Includes accessibility and usability considerations
- Provides wireframes and interaction patterns

### Backend Development Examples

#### API Service Implementation
```text
(ROLE: coder) (CONTEXT: nodejs_authentication) (PROMPT: Build JWT authentication service with login, register, token refresh, and password reset functionality using Express and bcrypt) (OUTPUT: service_code)
```

**Generated Agent Behavior:**
- Implements secure authentication patterns
- Adds comprehensive error handling
- Includes input validation and sanitization
- Provides proper JWT token management
- Adds logging and security middleware

#### Database Design
```text
(ROLE: coder) (CONTEXT: postgresql_ecommerce) (PROMPT: Create database schema for e-commerce platform with users, products, orders, and reviews including relationships and constraints) (OUTPUT: database_schema)
```

**Generated Agent Behavior:**
- Designs normalized database structure
- Implements proper foreign key relationships
- Adds data validation constraints
- Includes indexing for performance
- Provides migration scripts and seed data

### Research and Analysis Examples

#### Technology Research
```text
(ROLE: researcher) (CONTEXT: modern_web_frameworks) (PROMPT: Research and compare React, Vue, and Angular for building large-scale enterprise applications with performance benchmarks) (OUTPUT: research_report)
```

**Generated Agent Behavior:**
- Conducts comprehensive framework analysis
- Gathers performance benchmarks and statistics
- Compares developer experience and ecosystem
- Evaluates enterprise readiness and support
- Provides actionable recommendations

#### Security Analysis
```text
(ROLE: critic) (CONTEXT: web_application_security) (PROMPT: Analyze authentication system for security vulnerabilities including XSS, CSRF, and injection attacks with mitigation strategies) (OUTPUT: security_assessment)
```

**Generated Agent Behavior:**
- Performs systematic security review
- Identifies potential vulnerabilities
- Provides specific mitigation strategies
- Reviews code for security best practices
- Includes penetration testing recommendations

## Advanced Meta-Prompt Patterns

### Hierarchical Agent Spawning

**Parent Meta-Prompt:**
```text
(ROLE: planner) (CONTEXT: fullstack_application) (PROMPT: Create comprehensive development plan for social media app with user authentication, posts, comments, and real-time features) (OUTPUT: project_plan)
```

**Generated Child Meta-Prompts:**
```text
(ROLE: ui_architect) (CONTEXT: social_media_ui) (PROMPT: Design user interface for social media app with feed, profiles, and messaging) (OUTPUT: ui_specifications)

(ROLE: coder) (CONTEXT: realtime_backend) (PROMPT: Implement WebSocket server for real-time messaging and notifications using Socket.io) (OUTPUT: backend_services)

(ROLE: coder) (CONTEXT: authentication_system) (PROMPT: Build OAuth authentication with social logins and JWT tokens) (OUTPUT: auth_services)
```

### Cross-Domain Integration

**Integration Meta-Prompt:**
```text
(ROLE: synthesizer) (CONTEXT: api_frontend_integration) (PROMPT: Create integration layer connecting React frontend with Node.js API including error handling, loading states, and data synchronization) (OUTPUT: integration_code)
```

**Generated Agent Behavior:**
- Focuses on seamless frontend-backend communication
- Implements proper error boundaries and user feedback
- Adds loading states and optimistic updates
- Provides data synchronization patterns
- Includes offline functionality considerations

## Common Mistakes and Corrections

### Invalid Syntax Examples

#### Missing Components
```text
❌ (ROLE: coder) (PROMPT: Build authentication) (OUTPUT: code)
✅ (ROLE: coder) (CONTEXT: nodejs_jwt) (PROMPT: Build JWT authentication middleware with session management) (OUTPUT: service_code)
```

#### Generic Specifications
```text
❌ (ROLE: developer) (CONTEXT: web) (PROMPT: Make a website) (OUTPUT: files)
✅ (ROLE: ui_implementer) (CONTEXT: react_portfolio) (PROMPT: Create responsive portfolio website with project showcase and contact form) (OUTPUT: react_components)
```

#### Ambiguous Instructions
```text
❌ (ROLE: coder) (CONTEXT: database) (PROMPT: Set up data stuff) (OUTPUT: database)
✅ (ROLE: coder) (CONTEXT: mongodb_ecommerce) (PROMPT: Create MongoDB schemas for products, users, and orders with validation and indexing) (OUTPUT: database_models)
```

### Role Mismatches

#### Wrong Role for Task
```text
❌ (ROLE: ui_refiner) (CONTEXT: backend_api) (PROMPT: Build REST endpoints) (OUTPUT: api_code)
✅ (ROLE: coder) (CONTEXT: express_api) (PROMPT: Build REST endpoints with validation and error handling) (OUTPUT: api_endpoints)
```

#### Context-Role Misalignment
```text
❌ (ROLE: researcher) (CONTEXT: react_components) (PROMPT: Implement login form) (OUTPUT: react_code)
✅ (ROLE: ui_implementer) (CONTEXT: react_authentication) (PROMPT: Implement login form with validation and error handling) (OUTPUT: react_components)
```

## Meta-Prompt Quality Checklist

### Syntax Validation
- [ ] All four components present: ROLE, CONTEXT, PROMPT, OUTPUT
- [ ] Proper parentheses and colons: `(COMPONENT: value)`
- [ ] Valid role name from supported agent types
- [ ] Specific, focused context specification

### Content Quality
- [ ] Role matches the type of work requested
- [ ] Context provides sufficient technical scope
- [ ] Prompt is actionable and specific
- [ ] Output type clearly defines expected deliverable

### Specificity Check
- [ ] Avoids generic terms (developer, web, code, files)
- [ ] Includes technology stack or framework details
- [ ] Specifies quality requirements (testing, validation, etc.)
- [ ] Defines clear success criteria

### Agent Effectiveness
- [ ] Single, focused responsibility per agent
- [ ] Clear deliverable boundaries
- [ ] Appropriate complexity for single agent
- [ ] Enables parallel execution when possible

## Testing Meta-Prompts

### Validation Commands

**Test Meta-Prompt Parsing:**
```text
Use JARVIS with objective: "Test meta-prompt generation" and watch for properly formatted meta-prompts in PLAN phase
```

**Verify Agent Spawning:**
```text
Use JARVIS with simple objective to verify Task() agents spawn correctly from meta-prompts
```

### Quality Indicators

**Successful Meta-Prompt Generation:**
```text
✅ Clear role assignment with appropriate thinking methodology
✅ Focused context that guides agent decision-making
✅ Specific, actionable instructions
✅ Well-defined deliverable expectations
✅ Agent completes task autonomously without clarification
```

**Failed Meta-Prompt Indicators:**
```text
❌ Agent requests clarification or additional context
❌ Generic output that doesn't match specifications
❌ Agent attempts tasks outside their role expertise
❌ Incomplete deliverables that require manual completion
```

## Integration with FSM Phases

### PLAN Phase Generation

During the PLAN phase, the FSM automatically generates meta-prompts based on:

1. **Objective Analysis** - Complexity and scope assessment
2. **Task Decomposition** - Breaking down into agent-appropriate chunks
3. **Role Optimization** - Selecting best agent types for each task
4. **Context Injection** - Adding relevant technical and domain context
5. **Output Specification** - Defining clear deliverable expectations

### EXECUTE Phase Usage

In the EXECUTE phase, meta-prompts are converted to Task() agent spawning:

```typescript
// Meta-prompt processing
const metaPrompt = "(ROLE: ui_implementer) (CONTEXT: react_dashboard) (PROMPT: Create responsive dashboard with charts) (OUTPUT: react_components)";

// Automatic Task() agent generation
const agent = Task({
  description: "React Dashboard Implementation Specialist",
  prompt: generateRoleSpecificPrompt(metaPrompt),
  constraints: getContextConstraints(metaPrompt),
  deliverables: parseOutputRequirements(metaPrompt)
});
```

---

**Key Insight**: Meta-prompts serve as the bridge between high-level project objectives and specific agent execution. Well-crafted meta-prompts enable autonomous, parallel development with minimal oversight while maintaining quality and consistency across all generated deliverables.

Understanding and utilizing effective meta-prompt patterns is essential for maximizing Iron Manus MCP's Thread-of-Thought orchestration capabilities.