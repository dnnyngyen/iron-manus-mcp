# Iron Manus MCP Examples
## Real-World Usage Scenarios

This document provides concrete examples of using Iron Manus MCP's Meta Thread-of-Thought orchestration for various types of projects, showing the actual 6-phase workflow and agent spawning patterns.

**Key Innovation:** Each example demonstrates how context segmentation solves Claude Code's biggest limitation - instead of overwhelming a single context with entire project complexity, Iron Manus breaks work into focused phases and spawns specialized agents with clean, dedicated contexts.

---

## Development Project Examples

### Example 1: React Dashboard with Authentication

**User Request:**
```
Build a React dashboard with user authentication, data visualization, and real-time updates
```

**Meta Thread-of-Thought Workflow:**
```
QUERY → "React dashboard with auth, charts, and real-time features"
ENHANCE → "Add JWT tokens, responsive design, WebSocket connections, chart library integration"
KNOWLEDGE → Skips (common technologies)
PLAN → Creates structured breakdown:
  - Initialize React TypeScript project
  - (ROLE: ui_architect) (CONTEXT: dashboard_layout) (PROMPT: Design responsive dashboard with sidebar navigation and chart areas) (OUTPUT: component_hierarchy)
  - (ROLE: coder) (CONTEXT: authentication) (PROMPT: Implement JWT auth with login/register forms) (OUTPUT: auth_system)
  - (ROLE: coder) (CONTEXT: data_visualization) (PROMPT: Integrate Chart.js with real-time data updates) (OUTPUT: chart_components)
  - Set up WebSocket connection for real-time updates
  - Add responsive styling and error handling
EXECUTE → Spawns ui_architect and coder agents, handles simple tasks directly
VERIFY → Validates 95% completion with working auth and charts
```

**Generated Agents:**
- **ui_architect**: Receives enhanced prompt with design thinking methodologies, creates component structure
- **coder (auth)**: Gets implementation-focused prompt with security best practices
- **coder (visualization)**: Specialized for data visualization with performance considerations

### Example 2: Node.js API with Database

**User Request:**
```
Create a REST API for a blog platform with PostgreSQL and proper error handling
```

**Meta Thread-of-Thought Workflow:**
```
PLAN → Creates breakdown:
  - Set up Node.js project structure with TypeScript
  - (ROLE: planner) (CONTEXT: api_architecture) (PROMPT: Design RESTful blog API with proper routing and middleware structure) (OUTPUT: api_design)
  - (ROLE: coder) (CONTEXT: database) (PROMPT: Implement PostgreSQL models for users, posts, comments with migrations) (OUTPUT: database_layer)
  - (ROLE: coder) (CONTEXT: api_endpoints) (PROMPT: Build CRUD endpoints with validation and error handling) (OUTPUT: route_handlers)
  - (ROLE: critic) (CONTEXT: security) (PROMPT: Audit API for security vulnerabilities and add proper authentication) (OUTPUT: security_audit)
```

**Agent Specialization:**
- **planner**: Uses system architecture thinking for API design
- **coder (database)**: Applies data modeling expertise with PostgreSQL best practices
- **coder (endpoints)**: Focuses on API implementation with error handling patterns
- **critic**: Security-focused analysis with vulnerability assessment

---

## Analysis Project Examples

### Example 3: Codebase Performance Audit

**User Request:**
```
Analyze my React application for performance bottlenecks and suggest optimizations
```

**JARVIS Workflow:**
```
KNOWLEDGE → Researches latest React performance best practices
PLAN → Creates analysis breakdown:
  - Scan codebase structure and identify key components
  - (ROLE: analyzer) (CONTEXT: bundle_analysis) (PROMPT: Analyze webpack bundle size and identify optimization opportunities) (OUTPUT: bundle_report)
  - (ROLE: analyzer) (CONTEXT: code_patterns) (PROMPT: Find performance anti-patterns like unnecessary re-renders) (OUTPUT: code_analysis)
  - (ROLE: analyzer) (CONTEXT: runtime_performance) (PROMPT: Assess component rendering performance and memory usage) (OUTPUT: runtime_analysis)
  - (ROLE: synthesizer) (CONTEXT: optimization_plan) (PROMPT: Create prioritized optimization roadmap with impact estimates) (OUTPUT: action_plan)
```

**Specialized Analysis:**
- **analyzer (bundle)**: Statistical analysis of build output with size optimization focus
- **analyzer (code)**: Pattern recognition for performance anti-patterns
- **analyzer (runtime)**: Performance profiling and memory usage assessment
- **synthesizer**: Integration thinking for comprehensive optimization strategy

### Example 4: Security Audit

**User Request:**
```
Perform a security audit of my web application and identify vulnerabilities
```

**JARVIS Workflow:**
```
PLAN → Creates security assessment:
  - Map application attack surface and entry points
  - (ROLE: critic) (CONTEXT: authentication) (PROMPT: Audit authentication and authorization mechanisms) (OUTPUT: auth_security_report)
  - (ROLE: critic) (CONTEXT: data_validation) (PROMPT: Test input validation and SQL injection vulnerabilities) (OUTPUT: input_security_report)
  - (ROLE: critic) (CONTEXT: infrastructure) (PROMPT: Review server configuration and deployment security) (OUTPUT: infra_security_report)
  - (ROLE: planner) (CONTEXT: remediation) (PROMPT: Create prioritized security remediation plan) (OUTPUT: security_roadmap)
```

---

## Research Project Examples

### Example 5: Technology Comparison Study

**User Request:**
```
Research and compare different state management solutions for large React applications
```

**JARVIS Workflow:**
```
KNOWLEDGE → Uses WebSearch and WebFetch for current information
PLAN → Creates research breakdown:
  - Identify current state management solutions (Redux, Zustand, Jotai, etc.)
  - (ROLE: researcher) (CONTEXT: solution_analysis) (PROMPT: Research each solution's architecture, performance, and ecosystem) (OUTPUT: solution_profiles)
  - (ROLE: analyzer) (CONTEXT: comparison_matrix) (PROMPT: Create detailed comparison matrix with metrics and trade-offs) (OUTPUT: comparison_analysis)
  - (ROLE: synthesizer) (CONTEXT: recommendations) (PROMPT: Synthesize findings into actionable recommendations for different use cases) (OUTPUT: recommendation_report)
```

**Research Agents:**
- **researcher**: Source validation and comprehensive information gathering
- **analyzer**: Multi-dimensional analysis with statistical comparison
- **synthesizer**: Trade-off analysis and contextual recommendations

---

## Multi-Agent Coordination Examples

### Example 6: Full-Stack Application Development

**User Request:**
```
Build a complete e-commerce platform with React frontend, Node.js backend, and payment integration
```

**JARVIS Orchestration:**
```
PLAN → Creates comprehensive breakdown with multiple specialized agents:

Frontend Tasks:
- (ROLE: ui_architect) (CONTEXT: ecommerce_design) (PROMPT: Design complete e-commerce UI with product catalog, cart, and checkout flow) (OUTPUT: ui_architecture)
- (ROLE: coder) (CONTEXT: react_frontend) (PROMPT: Implement React components with state management and routing) (OUTPUT: frontend_implementation)

Backend Tasks:
- (ROLE: planner) (CONTEXT: backend_architecture) (PROMPT: Design scalable backend architecture with microservices consideration) (OUTPUT: backend_design)
- (ROLE: coder) (CONTEXT: api_development) (PROMPT: Build REST API with product, user, and order management) (OUTPUT: api_implementation)
- (ROLE: coder) (CONTEXT: payment_integration) (PROMPT: Integrate Stripe payment processing with webhook handling) (OUTPUT: payment_system)

Integration Tasks:
- (ROLE: analyzer) (CONTEXT: testing) (PROMPT: Create comprehensive test suite for frontend and backend) (OUTPUT: test_implementation)
- (ROLE: critic) (CONTEXT: security) (PROMPT: Security audit of complete application) (OUTPUT: security_assessment)
```

**Agent Coordination:**
1. **Sequential Dependencies**: ui_architect → coder (frontend), planner → coder (backend)
2. **Parallel Execution**: Frontend and backend development happen simultaneously
3. **Integration Phase**: Testing and security happen after core implementation
4. **Cross-Domain Communication**: Agents report back through main JARVIS session

---

## Advanced Meta-Prompting Patterns

### Recursive Agent Spawning

**Original Task:**
```
(ROLE: planner) (CONTEXT: microservices) (PROMPT: Design microservices architecture for e-commerce platform) (OUTPUT: architecture_plan)
```

**Planner Agent Spawns Sub-Agents:**
```
# Planner creates its own sub-tasks:
- (ROLE: analyzer) (CONTEXT: service_boundaries) (PROMPT: Analyze domain boundaries for service separation) (OUTPUT: domain_analysis)
- (ROLE: coder) (CONTEXT: service_interfaces) (PROMPT: Design API contracts between services) (OUTPUT: interface_specs)
- (ROLE: critic) (CONTEXT: scalability) (PROMPT: Review architecture for scalability and reliability concerns) (OUTPUT: scalability_assessment)
```

### Cross-Domain Agent Collaboration

**UI + Backend Coordination:**
```
# UI Architect creates backend requirements:
(ROLE: ui_architect) → Creates UI design → Identifies API needs → Spawns:
(ROLE: planner) (CONTEXT: api_requirements) (PROMPT: Design API endpoints based on UI data requirements) (OUTPUT: api_specification)

# Backend Planner responds with constraints:
(ROLE: planner) → Reviews API spec → Identifies constraints → Updates UI requirements
```

---

## Tips for Effective Usage

### 1. Let JARVIS Guide the Breakdown
- Start with high-level goals
- Trust the system to identify where specialized agents are needed
- Don't micro-manage the task decomposition

### 2. Meta-Prompt Quality Indicators
✅ **Good**: `(ROLE: analyzer) (CONTEXT: performance_audit) (PROMPT: Analyze React component render performance and identify optimization opportunities) (OUTPUT: performance_report)`

❌ **Poor**: `(ROLE: coder) (CONTEXT: general) (PROMPT: Fix the code) (OUTPUT: code)`

### 3. Leveraging Agent Expertise
- **planner**: System design, architecture, dependencies
- **analyzer**: Data analysis, pattern recognition, metrics
- **coder**: Implementation, best practices, technical debt
- **critic**: Security, edge cases, quality assurance
- **researcher**: Information gathering, source validation
- **synthesizer**: Integration, trade-offs, recommendations

### 4. Understanding Agent Coordination
- Agents report back to main session automatically
- Complex agents can spawn their own sub-agents
- Dependencies are handled through sequential execution
- Parallel work happens when tasks are independent

---

## Troubleshooting Common Patterns

### When Tasks Don't Complete
- **Check meta-prompt syntax**: Ensure proper `(ROLE:...) (CONTEXT:...) (PROMPT:...) (OUTPUT:...)` format
- **Review task complexity**: Break overly complex tasks into smaller pieces
- **Verify role appropriateness**: Match roles to task types (analyzer for analysis, coder for implementation)

### When Agents Don't Spawn
- **Meta-prompt detection**: System looks for `(ROLE:...)` pattern to trigger agent spawning
- **Direct execution**: Simple tasks without meta-prompts execute directly
- **Phase constraints**: Agent spawning only happens in EXECUTE phase

### When Quality Is Insufficient
- **Verification threshold**: System requires 95% completion for success
- **Critical task completion**: All critical tasks must be 100% complete
- **Automatic rollback**: <80% completion triggers retry, <50% restarts planning

---

This examples guide shows the practical application of Iron Manus JARVIS across different project types, demonstrating how the 6-phase FSM and meta-prompt agent spawning create sophisticated autonomous workflows while maintaining simplicity and reliability.