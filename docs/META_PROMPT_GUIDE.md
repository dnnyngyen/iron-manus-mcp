# Iron Manus MCP Meta-Prompt Guide

**Version**: v0.2.5

This guide provides a reference for the meta-prompt DSL used for agent spawning and task delegation.

## Overview

Meta-prompts are specialized instruction patterns that enable agent spawning through Task() tool calls. They bridge high-level planning with specialized execution by creating focused context windows for independent Claude instances.

The pattern:
1. Main FSM orchestrator manages the 8-phase workflow
2. Meta-prompts embedded in todo items trigger Task() agent spawning during EXECUTE phase
3. Each Task() agent operates as an independent Claude instance with specialized context
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

**Available Agent Types** (10 specialized roles):

#### Development Roles
- **`planner`** - Strategic decomposition, dependency analysis, systematic planning
- **`coder`** - Implementation with testing, best practices, modular development
- **`critic`** - Security review, quality assessment, comprehensive validation

#### Research and Analysis Roles
- **`researcher`** - Information gathering, parallel validation, knowledge synthesis
- **`analyzer`** - Data analysis, pattern recognition, multi-dimensional insights
- **`synthesizer`** - Integration, optimization, component coordination

#### UI Specialization Roles
- **`ui_architect`** - UI architecture, design systems, component planning
- **`ui_implementer`** - UI implementation, concurrent execution, component building
- **`ui_refiner`** - UI refinement, polished aesthetics, optimization

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
Good: ecommerce_cart, user_management, data_visualization
Good: jwt_authentication, crud_operations, form_validation
Bad: business_logic, application_development, system_design
```

### PROMPT Component

**Effective Prompt Patterns:**

#### Action-Oriented Instructions
```text
Good: "Create JWT authentication middleware with error handling"
Good: "Build React login form with validation and state management"
Bad: "Work on authentication stuff"
Bad: "Handle the login functionality"
```

#### Specific Technical Requirements
```text
Good: "Create responsive dashboard with React hooks and Material-UI components"
Good: "Build REST API endpoints with Express, validation, and error handling"
Bad: "Make a nice-looking dashboard"
Bad: "Create some API endpoints"
```

### OUTPUT Component

**Deliverable Type Specifications:**

#### Code Deliverables
```text
Good: react_components - Specific component files with props and state
Good: api_endpoints - REST/GraphQL endpoints with documentation
Good: service_code - Business logic services with error handling
Good: test_suite - Comprehensive tests with coverage reports
```

#### Documentation Deliverables
```text
Good: api_documentation - Endpoint docs with examples
Good: setup_guide - Installation and configuration instructions
Good: technical_specs - Architecture and implementation details
```

## Complete Examples

### Frontend Development

```text
(ROLE: ui_implementer) (CONTEXT: react_ecommerce) (PROMPT: Create product catalog component with filtering, sorting, and pagination using React hooks and Material-UI) (OUTPUT: react_components)
```

**Generated Agent Behavior:**
- Focuses on React best practices and hooks usage
- Implements Material-UI design patterns
- Includes proper state management for filtering/sorting
- Adds responsive design considerations

### Backend Development

```text
(ROLE: coder) (CONTEXT: nodejs_authentication) (PROMPT: Build JWT authentication service with login, register, token refresh, and password reset functionality using Express and bcrypt) (OUTPUT: service_code)
```

**Generated Agent Behavior:**
- Implements secure authentication patterns
- Adds comprehensive error handling
- Includes input validation and sanitization
- Provides proper JWT token management

### Research and Analysis

```text
(ROLE: researcher) (CONTEXT: modern_web_frameworks) (PROMPT: Research and compare React, Vue, and Angular for building large-scale enterprise applications with performance benchmarks) (OUTPUT: research_report)
```

**Generated Agent Behavior:**
- Conducts comprehensive framework analysis
- Gathers performance benchmarks and statistics
- Compares developer experience and ecosystem
- Provides actionable recommendations

### Security Analysis

```text
(ROLE: critic) (CONTEXT: web_application_security) (PROMPT: Analyze authentication system for security vulnerabilities including XSS, CSRF, and injection attacks with mitigation strategies) (OUTPUT: security_assessment)
```

**Generated Agent Behavior:**
- Performs systematic security review
- Identifies potential vulnerabilities
- Provides specific mitigation strategies
- Includes penetration testing recommendations

## Common Mistakes and Corrections

### Missing Components
```text
Bad: (ROLE: coder) (PROMPT: Build authentication) (OUTPUT: code)
Good: (ROLE: coder) (CONTEXT: nodejs_jwt) (PROMPT: Build JWT authentication middleware with session management) (OUTPUT: service_code)
```

### Generic Specifications
```text
Bad: (ROLE: developer) (CONTEXT: web) (PROMPT: Make a website) (OUTPUT: files)
Good: (ROLE: ui_implementer) (CONTEXT: react_portfolio) (PROMPT: Create responsive portfolio website with project showcase and contact form) (OUTPUT: react_components)
```

### Role Mismatches
```text
Bad: (ROLE: ui_refiner) (CONTEXT: backend_api) (PROMPT: Build REST endpoints) (OUTPUT: api_code)
Good: (ROLE: coder) (CONTEXT: express_api) (PROMPT: Build REST endpoints with validation and error handling) (OUTPUT: api_endpoints)
```

## Quality Checklist

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

## Context Isolation

**IMPORTANT**: Task() agents spawn with **completely fresh, isolated contexts**:

### What Agents CANNOT Do:
- Access variables or data from the spawning agent
- Directly receive output from other Task() agents
- Share memory or state with other agents
- Inherit context from the main orchestrator

### What Agents CAN Do:
- Read and write files with explicit file paths
- Use all available tools independently (Bash, Read, Write, etc.)
- Work on tasks defined in their prompts
- Report results through their final output

## Session Workspace Pattern

**File-Based Communication Protocol:**

```
1. Main orchestrator creates: /tmp/iron-manus-session-{session_id}/
2. Agents write to: /tmp/iron-manus-session-{session_id}/agent_name_output.md
3. Synthesis agent reads all files and combines results
4. Main orchestrator reads final synthesis
```

**Example Workspace Structure:**
```
/tmp/iron-manus-session-abc123/
├── primary_research.md      (from researcher agent)
├── analysis_data.md         (from analyzer agent)
├── technical_specs.md       (from coder agent)
└── synthesized_knowledge.md (from synthesizer agent)
```

## Best Practices

### 1. Always Specify Exact File Paths in Meta-Prompts
```
Bad: "(PROMPT: Research topic and save results)"
Good: "(PROMPT: Research topic and write findings to /tmp/iron-manus-session-{session_id}/research_output.md)"
```

### 2. Use Session-Specific Directories
```
Bad: "/tmp/research_output.md" (conflicts with other sessions)
Good: "/tmp/iron-manus-session-{session_id}/research_output.md"
```

### 3. Include File Writing Instructions
```
Example: "(PROMPT: Analyze data patterns and write detailed analysis to /tmp/iron-manus-session-{session_id}/analysis.md with sections for findings, metrics, and recommendations)"
```

### 4. Design for File-Based Handoffs
```
Bad: Sequential agents expecting context inheritance
Good: Parallel agents writing to files + synthesis agent reading all files
```

## FSM Integration

### PLAN Phase: Meta-Prompt Generation

The PLAN phase embeds meta-prompts into todo items:

```typescript
// Agent spawning guidance
prompt += `AGENT SPAWNING GUIDE:
For complex sub-tasks that need specialized expertise, create todos with this format:
"(ROLE: coder) (CONTEXT: authentication_system) (PROMPT: Implement secure JWT authentication) (OUTPUT: production_ready_code)"`;
```

### EXECUTE Phase: Agent Spawning

The EXECUTE phase detects meta-prompt patterns and triggers Task() agent spawning:

```typescript
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
