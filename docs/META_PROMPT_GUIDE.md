# Iron Manus MCP Meta-Prompt Architecture Guide

**Version**: v0.2.4  
**System**: 8-Phase FSM with Meta Thread-of-Thought (THoT) Orchestration

This guide provides a comprehensive reference for Iron Manus MCP's meta-prompt DSL (Domain Specific Language) and Meta Thread-of-Thought orchestration system used for fractal agent spawning and task delegation.

## Overview

Meta-prompts are specialized instruction patterns that enable **fractal orchestration** through autonomous Task() agent spawning. They bridge high-level strategic planning with specialized execution by creating focused context windows for independent Claude instances with role-specific expertise.

The Iron Manus MCP implements a **Meta Thread-of-Thought (THoT) orchestration** pattern where:
1. The main FSM orchestrator manages the 8-phase workflow (INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE)
2. Meta-prompts embedded in todo items trigger Task() agent spawning during the EXECUTE phase
3. Each Task() agent operates as an independent Claude instance with specialized context and fresh working memory
4. Results flow back to the main orchestrator for integration and verification

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

**Available Agent Types** (9 specialized roles with cognitive enhancement):

#### Development Roles
- **`planner`** - Strategic decomposition, dependency analysis, systematic planning
  - *Thinking Methodology*: Systems thinking, dependency analysis, risk assessment, stakeholder consideration
  - *Frameworks*: systems_thinking, dependency_analysis
  - *Authority Level*: STRATEGIZE_AND_COORDINATE

- **`coder`** - Implementation with testing, best practices, and modular development
  - *Thinking Methodology*: TDD, single responsibility, error handling, performance analysis
  - *Frameworks*: TDD, modular_architecture
  - *Authority Level*: IMPLEMENT_AND_VALIDATE

- **`critic`** - Security review, quality assessment, comprehensive validation
  - *Thinking Methodology*: Security analysis, compliance verification, edge case consideration, trade-off evaluation
  - *Frameworks*: security_review, code_analysis
  - *Authority Level*: EVALUATE_AND_REFINE

#### Research and Analysis Roles
- **`researcher`** - Information gathering, parallel validation, knowledge synthesis
  - *Thinking Methodology*: Source validation, triangulation, gap identification, bias assessment
  - *Frameworks*: systematic_research, parallel_validation
  - *Authority Level*: INVESTIGATE_AND_SYNTHESIZE

- **`analyzer`** - Data analysis, pattern recognition, multi-dimensional insights
  - *Thinking Methodology*: Data validation, statistical analysis, pattern verification, assumption questioning
  - *Frameworks*: statistical_analysis, pattern_recognition
  - *Authority Level*: ANALYZE_AND_REPORT

- **`synthesizer`** - Integration, optimization, component coordination
  - *Thinking Methodology*: System integration, trade-off analysis, constraint optimization, coherence maintenance
  - *Frameworks*: system_integration, optimization_framework
  - *Authority Level*: INTEGRATE_AND_OPTIMIZE

#### V0-Style UI Specialization Roles
- **`ui_architect`** - V0-style UI architecture, design systems, component planning
  - *Thinking Methodology*: User-centered design, component hierarchy, accessibility, scalability planning
  - *Frameworks*: V0, component_hierarchy, design_systems
  - *Authority Level*: DESIGN_AND_ARCHITECT

- **`ui_implementer`** - V0-style UI implementation, concurrent execution, component building
  - *Thinking Methodology*: Proven patterns, cross-browser compatibility, performance optimization, maintainable code
  - *Frameworks*: React, Shadcn/UI, concurrent_execution
  - *Authority Level*: IMPLEMENT_AND_RENDER

- **`ui_refiner`** - V0-style UI refinement, polished aesthetics, optimization
  - *Thinking Methodology*: Usability evaluation, accessibility compliance, incremental improvement, standards compliance
  - *Frameworks*: ui_refinement, micro_interactions, accessibility
  - *Authority Level*: REFINE_AND_POLISH

**Role Selection Guidelines:**
```text
Use specific roles: ui_implementer, coder, researcher
Avoid generic roles: developer, person, assistant
```

### CONTEXT Component

**Context Specifications:**

#### Technology Context
```text
Good: react_authentication, nodejs_api, python_data_analysis
Good: nextjs_routing, express_middleware, django_models
Bad: web_development, programming, software
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
Bad: (ROLE: coder) (PROMPT: Build authentication) (OUTPUT: code)
Good: (ROLE: coder) (CONTEXT: nodejs_jwt) (PROMPT: Build JWT authentication middleware with session management) (OUTPUT: service_code)
```

#### Generic Specifications
```text
Bad: (ROLE: developer) (CONTEXT: web) (PROMPT: Make a website) (OUTPUT: files)
Good: (ROLE: ui_implementer) (CONTEXT: react_portfolio) (PROMPT: Create responsive portfolio website with project showcase and contact form) (OUTPUT: react_components)
```

#### Ambiguous Instructions
```text
Bad: (ROLE: coder) (CONTEXT: database) (PROMPT: Set up data stuff) (OUTPUT: database)
Good: (ROLE: coder) (CONTEXT: mongodb_ecommerce) (PROMPT: Create MongoDB schemas for products, users, and orders with validation and indexing) (OUTPUT: database_models)
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

## Meta Thread-of-Thought (THoT) Orchestration

### Architecture Overview

The Iron Manus MCP implements a sophisticated **THoT orchestration pattern** that segments complex objectives into specialized contexts:

```
Main FSM Orchestrator (8-Phase Loop)
├── PLAN Phase: Creates todos with embedded meta-prompts
├── EXECUTE Phase: Extracts meta-prompts and spawns Task() agents
└── VERIFY Phase: Integrates results and validates completion

Task() Agent Instances (Independent Claude)
├── Fresh context window with role-specific enhancement
├── Specialized thinking methodologies and frameworks
├── Autonomous execution with TodoWrite decomposition
└── Result reporting back to main orchestrator
```

### FSM Integration Points

#### PLAN Phase: Meta-Prompt Generation

The PLAN phase embeds meta-prompts into todo items using the fractal orchestration protocol:

```typescript
// src/phase-engine/FSM.ts:461 - Fractal orchestration guidance
prompt += `\n\n**🔄 FRACTAL ORCHESTRATION GUIDE:**
For complex sub-tasks that need specialized expertise, create todos with this format:
"(ROLE: coder) (CONTEXT: authentication_system) (PROMPT: Implement secure JWT authentication with password reset) (OUTPUT: production_ready_code)"

This enables Task() agent spawning in the EXECUTE phase.`;
```

#### EXECUTE Phase: Agent Spawning

The EXECUTE phase detects meta-prompt patterns and triggers Task() agent spawning:

```typescript
// src/phase-engine/FSM.ts:536-553 - Meta-prompt extraction
export function extractMetaPromptFromTodo(todoContent: string): MetaPrompt | null {
  const roleMatch = todoContent.match(/\(ROLE:\s*([^)]+)\)/i);
  const contextMatch = todoContent.match(/\(CONTEXT:\s*([^)]+)\)/i);
  const promptMatch = todoContent.match(/\(PROMPT:\s*([^)]+)\)/i);
  const outputMatch = todoContent.match(/\(OUTPUT:\s*([^)]+)\)/i);

  if (roleMatch && promptMatch) {
    return {
      role_specification: roleMatch[1].trim(),
      context_parameters: contextMatch ? { domain: contextMatch[1].trim() } : {},
      instruction_block: promptMatch[1].trim(),
      output_requirements: outputMatch ? outputMatch[1].trim() : 'comprehensive_deliverable',
    };
  }
  return null;
}
```

#### Task() Tool Integration

When meta-prompts are detected, the system converts them to Task() agent spawning:

```typescript
// Task() agent spawning pattern from EXECUTE phase
const metaPrompt = extractMetaPromptFromTodo(currentTodo);
if (metaPrompt) {
  // Spawn independent Claude instance with specialized context
  Task({
    description: `(ROLE: ${metaPrompt.role_specification}) (CONTEXT: ${metaPrompt.context_parameters.domain}) (PROMPT: ${briefDescription}) (OUTPUT: ${metaPrompt.output_requirements})`,
    prompt: generateRoleEnhancedPrompt(metaPrompt) // Enhanced with role-specific thinking methodologies
  });
}
```

### Context Segmentation Strategy

THoT orchestration implements **context segmentation** to manage complexity:

1. **Main Orchestrator Context**: Manages strategic workflow, phase transitions, and integration
2. **Specialized Agent Context**: Focused on specific technical implementation with role expertise
3. **Result Integration Context**: Merges specialized outputs into coherent deliverables

This approach prevents context pollution while enabling deep specialization for complex sub-tasks.

## Agent Context Isolation and Communication Patterns

### Critical Limitation: Complete Context Isolation

**IMPORTANT**: Task() agents spawn with **completely fresh, isolated contexts**:

#### What Agents CANNOT Do:
- Access variables or data from the spawning agent
- Directly receive output from other Task() agents  
- Share memory or state with other agents
- Inherit context from the main orchestrator
- Access session state or payload data directly

#### What Agents CAN Do:
- Read and write files with explicit file paths
- Use all available tools independently (Bash, Read, Write, etc.)
- Work on tasks defined in their prompts
- Report results through their final output
- Create their own TodoWrite decompositions

### Session Workspace Pattern

**File-Based Communication Protocol:**

```
1. Main orchestrator creates: /tmp/iron-manus-session-{session_id}/
2. Agents write to: /tmp/iron-manus-session-{session_id}/agent_name_output.md
3. Synthesis agent reads all files and combines results
4. Main orchestrator reads final synthesis
5. Session data flows back to FSM through JARVIS payload
```

**Example Session Workspace Structure:**
```
/tmp/iron-manus-session-abc123/
├── primary_research.md      (from researcher agent)
├── analysis_data.md         (from analyzer agent)  
├── technical_specs.md       (from coder agent)
├── expert_review.md         (from critic agent)
└── synthesized_knowledge.md (from synthesizer agent)
```

### Best Practices for Agent Communication

#### 1. **Always Specify Exact File Paths in Meta-Prompts**
```
Bad: "(PROMPT: Research topic and save results)"
Good: "(PROMPT: Research topic and write findings to /tmp/iron-manus-session-{session_id}/research_output.md)"
```

#### 2. **Use Session-Specific Directories**
```
Bad: "/tmp/research_output.md" (conflicts with other sessions)
Good: "/tmp/iron-manus-session-{session_id}/research_output.md"
```

#### 3. **Include File Writing Instructions in Meta-Prompts**
```
Example: "(PROMPT: Analyze data patterns and write detailed analysis to /tmp/iron-manus-session-{session_id}/analysis.md with sections for findings, metrics, and recommendations)"
```

#### 4. **Design for File-Based Handoffs, Not Direct Context Passing**
```
Bad: Sequential agents expecting context inheritance
Good: Parallel agents writing to files + synthesis agent reading all files
```

#### 5. **PARALLEL SEARCH OPTIMIZATION for Research Agents**
```
Enhanced Meta-Prompt with Batch Optimization:
"(PROMPT: Research microservices architecture using PARALLEL SEARCH OPTIMIZATION: batch multiple WebSearch/WebFetch calls in a single response for maximum speed, then write comprehensive findings to /tmp/iron-manus-session-{session_id}/research.md)"
```

**Parallel Search Techniques:**
- **WebSearch Batching**: Multiple search queries in one tool call batch
- **WebFetch Parallel**: Simultaneous URL fetching from multiple sources  
- **APISearch + MultiAPIFetch**: Combined API discovery and parallel data gathering
- **Cross-Domain Research**: Batch searches across different knowledge domains

**Example Optimized Research Pattern:**
```typescript
// Agent receives instruction to batch these calls:
WebSearch("microservices benefits scalability")
WebSearch("microservices team autonomy")  
WebSearch("microservices technology diversity")
WebFetch("https://example.com/microservices-guide")
WebFetch("https://example.com/architecture-patterns")
// All in a single response for maximum parallelization
```

### Data Flow Integration with FSM

**Critical Session State Requirements:**

Each phase expects specific data in `session.payload`:
- **KNOWLEDGE**: Must populate `knowledge_gathered` field
- **PLAN**: Must include `plan_created: true` and `todos_with_metaprompts`
- **EXECUTE**: Supports full payload merge with `Object.assign(session.payload, input.payload)`

**Agent Integration Pattern:**
```typescript
// 1. Agents write to session workspace files
// 2. Main orchestrator reads synthesis file
// 3. JARVIS call includes required payload fields:
JARVIS({
  phase_completed: 'KNOWLEDGE',
  payload: {
    knowledge_gathered: synthesizedContentFromFile,
    // ... other expected fields
  }
});
```

## Claude-Powered Intelligent Role Selection

Iron Manus MCP v0.2.4 implements **Claude-powered role selection** that surpasses simple keyword matching:

### QUERY Phase Role Detection

During the QUERY phase, the system generates an intelligent role selection prompt for Claude:

```typescript
// src/core/prompts.ts:157-250 - Role selection prompt generation
export function generateRoleSelectionPrompt(objective: string): string {
  return `# Role Selection for Task Execution

## Objective
${objective}

## Available Roles (9 total)
[Detailed role descriptions with thinking methodologies...]

## Your Task
Analyze the objective and select the SINGLE most appropriate role for this task.

## Response Format
Return a JSON object with your role selection:
\`\`\`json
{
  "selected_role": "role_name",
  "confidence": 0.95,
  "reasoning": "Brief explanation why this role is optimal"
}
\`\`\``;
}
```

### Intelligent Role Processing

The FSM processes Claude's intelligent role selection:

```typescript
// src/phase-engine/FSM.ts:97-124 - Claude role selection processing
if (session.payload.awaiting_role_selection && input.payload?.claude_response) {
  try {
    const claudeSelectedRole = parseClaudeRoleSelection(
      input.payload.claude_response,
      session.initial_objective || ''
    );
    session.detected_role = claudeSelectedRole;
    session.payload.awaiting_role_selection = false;
    console.log(`SUCCESS Claude selected role: ${claudeSelectedRole}`);
  } catch (error) {
    // Graceful fallback to hardcoded detection
    session.payload.awaiting_role_selection = false;
  }
}
```

### Benefits of Claude-Powered Selection

1. **Context Understanding**: Claude analyzes nuanced requirements beyond keyword matching
2. **Domain Expertise**: Intelligent selection considers task complexity and role specialization
3. **Adaptive Selection**: Dynamic role selection based on full objective context
4. **Fallback Safety**: Graceful degradation to keyword-based detection if needed

## Single-Tool-Per-Iteration Enforcement

The system enforces **Manus compliance** through strict tool gating:

```typescript
// src/core/prompts.ts:1008-1041 - Phase tool restrictions
export const PHASE_ALLOWED_TOOLS: Record<Phase, string[]> = {
  INIT: ['JARVIS'],
  QUERY: ['JARVIS'],
  ENHANCE: ['JARVIS'],
  KNOWLEDGE: ['WebSearch', 'WebFetch', 'APISearch', 'MultiAPIFetch', 'KnowledgeSynthesize', 'JARVIS'],
  PLAN: ['TodoWrite'],
  EXECUTE: ['TodoRead', 'TodoWrite', 'Task', 'Bash', 'Read', 'Write', 'Edit', 'Browser'],
  VERIFY: ['TodoRead', 'Read'],
  DONE: []
};
```

This ensures **single tool per iteration** while providing Claude with appropriate tool choices for each phase.

## Performance and Reasoning Effectiveness Tracking

The system tracks performance metrics throughout the workflow:

```typescript
// Reasoning effectiveness adaptation (src/phase-engine/FSM.ts:375-380)
if (input.payload.execution_success) {
  session.reasoning_effectiveness = Math.min(1.0, session.reasoning_effectiveness + 0.1);
} else {
  session.reasoning_effectiveness = Math.max(0.3, session.reasoning_effectiveness - 0.1);
}
```

Performance metrics include:
- **Reasoning Effectiveness**: 0.3-1.0 scale with adaptive optimization
- **Phase Transition Count**: Tracking workflow efficiency
- **API Usage Metrics**: Auto-connection performance and confidence scores
- **Task Completion Rates**: Success/failure tracking for continuous improvement

---

## Key Architectural Insights

### Meta-Prompt as Fractal Orchestration Bridge

Meta-prompts serve as the **critical bridge** between high-level strategic orchestration and specialized technical execution:

1. **Context Segmentation**: Prevents main orchestrator context pollution
2. **Cognitive Enhancement**: Each agent operates with role-specific thinking methodologies
3. **Autonomous Execution**: Task() agents work independently with fresh context
4. **Integration Coherence**: Results flow back through structured output requirements

### THoT Orchestration Benefits

1. **Complexity Management**: Large projects decomposed into manageable, specialized contexts
2. **Parallel Execution**: Independent agents can work concurrently on different aspects
3. **Quality Assurance**: Role-specific validation and thinking methodologies ensure high-quality outputs
4. **Scalability**: Fractal patterns enable indefinite task decomposition depth

### Production-Ready Architecture

Iron Manus MCP v0.2.4 represents a **production-ready AI orchestration platform** featuring:
- 8-phase FSM workflow with intelligent rollback (completion percentage-based)
- 65 API registry with auto-connection and knowledge synthesis
- Claude-powered intelligent role selection and API selection
- Comprehensive testing suite (107/107 tests passing)
- Security-hardened hook integration with sub-100ms validation
- Meta Thread-of-Thought orchestration for complex project management

Understanding and utilizing effective meta-prompt patterns is essential for maximizing Iron Manus MCP's fractal orchestration capabilities and achieving autonomous, high-quality development workflows.