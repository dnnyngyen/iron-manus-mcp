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

## DevOps and Infrastructure Examples

### Example 7: CI/CD Pipeline Setup

**User Request:**
```
Set up a complete CI/CD pipeline with Docker, GitHub Actions, and AWS deployment
```

**JARVIS Workflow:**
```
ENHANCE → "Add automated testing, staging environment, security scanning, rollback capabilities"
PLAN → Creates infrastructure breakdown:
  - (ROLE: planner) (CONTEXT: cicd_architecture) (PROMPT: Design CI/CD pipeline with staging, testing, and production environments) (OUTPUT: pipeline_design)
  - (ROLE: coder) (CONTEXT: docker_containerization) (PROMPT: Create Dockerfiles and docker-compose for development and production) (OUTPUT: container_configs)
  - (ROLE: coder) (CONTEXT: github_actions) (PROMPT: Implement GitHub Actions workflows for automated testing and deployment) (OUTPUT: workflow_files)
  - (ROLE: coder) (CONTEXT: aws_deployment) (PROMPT: Set up AWS infrastructure with ECS, load balancer, and RDS) (OUTPUT: infrastructure_code)
  - (ROLE: critic) (CONTEXT: security_pipeline) (PROMPT: Add security scanning and compliance checks to CI/CD) (OUTPUT: security_configs)
```

**Agent Specialization:**
- **planner**: DevOps architecture with environment separation
- **coder (docker)**: Container optimization and multi-stage builds
- **coder (actions)**: Workflow automation with proper secrets management
- **coder (aws)**: Infrastructure as Code with Terraform/CloudFormation
- **critic**: Security scanning integration and compliance validation

### Example 8: Database Migration and Optimization

**User Request:**
```
Migrate legacy MySQL database to PostgreSQL with performance optimization
```

**JARVIS Workflow:**
```
KNOWLEDGE → Researches migration best practices and PostgreSQL optimization
PLAN → Creates migration strategy:
  - Analyze current database schema and data patterns
  - (ROLE: analyzer) (CONTEXT: schema_analysis) (PROMPT: Analyze MySQL schema and identify PostgreSQL migration requirements) (OUTPUT: migration_analysis)
  - (ROLE: coder) (CONTEXT: data_migration) (PROMPT: Create migration scripts with data validation and rollback procedures) (OUTPUT: migration_scripts)
  - (ROLE: analyzer) (CONTEXT: performance_optimization) (PROMPT: Design PostgreSQL indexes and query optimizations for current workload) (OUTPUT: optimization_plan)
  - (ROLE: coder) (CONTEXT: application_updates) (PROMPT: Update application code for PostgreSQL compatibility) (OUTPUT: code_changes)
  - (ROLE: critic) (CONTEXT: data_integrity) (PROMPT: Create comprehensive data validation and testing procedures) (OUTPUT: validation_suite)
```

## Machine Learning and Data Science Examples

### Example 9: Data Analysis Pipeline

**User Request:**
```
Build a data analysis pipeline for customer behavior analytics with Python and machine learning
```

**JARVIS Workflow:**
```
KNOWLEDGE → Researches current ML frameworks and customer analytics patterns
PLAN → Creates data science breakdown:
  - Set up Python data science environment with Jupyter notebooks
  - (ROLE: analyzer) (CONTEXT: data_exploration) (PROMPT: Perform exploratory data analysis on customer behavior dataset) (OUTPUT: eda_report)
  - (ROLE: coder) (CONTEXT: data_pipeline) (PROMPT: Build ETL pipeline with pandas and automated data cleaning) (OUTPUT: pipeline_code)
  - (ROLE: analyzer) (CONTEXT: feature_engineering) (PROMPT: Create customer behavior features for machine learning models) (OUTPUT: feature_pipeline)
  - (ROLE: coder) (CONTEXT: ml_modeling) (PROMPT: Implement and evaluate customer segmentation models using scikit-learn) (OUTPUT: ml_models)
  - (ROLE: ui_implementer) (CONTEXT: data_visualization) (PROMPT: Create interactive dashboards with Plotly and Streamlit) (OUTPUT: dashboard_app)
```

**Specialized Data Science Agents:**
- **analyzer (exploration)**: Statistical analysis and pattern discovery
- **coder (pipeline)**: Data engineering with robust error handling
- **analyzer (features)**: Domain expertise in customer behavior metrics
- **coder (modeling)**: ML best practices with model validation
- **ui_implementer**: Data visualization and interactive dashboard design

### Example 10: Natural Language Processing System

**User Request:**
```
Create a document classification system with NLP preprocessing and model training
```

**JARVIS Workflow:**
```
ENHANCE → "Add text preprocessing, multiple classification algorithms, model evaluation, and API deployment"
PLAN → Creates NLP system breakdown:
  - (ROLE: researcher) (CONTEXT: nlp_techniques) (PROMPT: Research current best practices for document classification and preprocessing) (OUTPUT: nlp_research)
  - (ROLE: coder) (CONTEXT: text_preprocessing) (PROMPT: Implement comprehensive text preprocessing pipeline with NLTK and spaCy) (OUTPUT: preprocessing_pipeline)
  - (ROLE: analyzer) (CONTEXT: feature_extraction) (PROMPT: Create text features using TF-IDF, word embeddings, and advanced NLP techniques) (OUTPUT: feature_extraction)
  - (ROLE: coder) (CONTEXT: model_training) (PROMPT: Implement and compare multiple classification models with cross-validation) (OUTPUT: classification_models)
  - (ROLE: coder) (CONTEXT: api_deployment) (PROMPT: Create REST API for document classification with FastAPI) (OUTPUT: api_service)
```

## Mobile and Cross-Platform Examples

### Example 11: React Native Mobile App

**User Request:**
```
Build a cross-platform mobile app for task management with offline capabilities
```

**JARVIS Workflow:**
```
ENHANCE → "Add offline sync, push notifications, biometric authentication, and app store deployment"
PLAN → Creates mobile development breakdown:
  - Set up React Native development environment and project structure
  - (ROLE: ui_architect) (CONTEXT: mobile_design) (PROMPT: Design mobile-first UI for task management with native platform conventions) (OUTPUT: mobile_ui_specs)
  - (ROLE: coder) (CONTEXT: offline_storage) (PROMPT: Implement offline data storage with SQLite and sync capabilities) (OUTPUT: offline_system)
  - (ROLE: coder) (CONTEXT: native_features) (PROMPT: Integrate push notifications, biometric auth, and platform-specific features) (OUTPUT: native_integrations)
  - (ROLE: coder) (CONTEXT: state_management) (PROMPT: Implement Redux with offline-first state management) (OUTPUT: state_system)
  - (ROLE: critic) (CONTEXT: mobile_testing) (PROMPT: Create comprehensive testing strategy for iOS and Android platforms) (OUTPUT: mobile_test_suite)
```

## Enterprise and Scale Examples

### Example 12: Microservices Architecture

**User Request:**
```
Design and implement a microservices architecture for a large-scale social media platform
```

**JARVIS Workflow (Multiple Sessions Required):**

**Session 1 - Architecture Design:**
```
PLAN → Creates architecture planning:
  - (ROLE: planner) (CONTEXT: microservices_design) (PROMPT: Design domain-driven microservices architecture for social media platform) (OUTPUT: service_architecture)
  - (ROLE: analyzer) (CONTEXT: data_flow) (PROMPT: Analyze data flow patterns and design inter-service communication) (OUTPUT: communication_design)
  - (ROLE: critic) (CONTEXT: scalability_review) (PROMPT: Review architecture for scalability, reliability, and performance concerns) (OUTPUT: architecture_assessment)
```

**Session 2 - Core Services:**
```
PLAN → Implements foundational services:
  - (ROLE: coder) (CONTEXT: user_service) (PROMPT: Implement user management microservice with authentication and profiles) (OUTPUT: user_service_code)
  - (ROLE: coder) (CONTEXT: content_service) (PROMPT: Build content management service for posts, comments, and media) (OUTPUT: content_service_code)
  - (ROLE: coder) (CONTEXT: notification_service) (PROMPT: Create real-time notification service with WebSocket support) (OUTPUT: notification_service)
```

**Session 3 - Infrastructure:**
```
PLAN → Handles deployment and operations:
  - (ROLE: coder) (CONTEXT: service_mesh) (PROMPT: Set up Istio service mesh for microservices communication) (OUTPUT: mesh_configuration)
  - (ROLE: coder) (CONTEXT: monitoring) (PROMPT: Implement comprehensive monitoring with Prometheus and Grafana) (OUTPUT: monitoring_stack)
  - (ROLE: coder) (CONTEXT: deployment) (PROMPT: Create Kubernetes deployment manifests with auto-scaling) (OUTPUT: k8s_manifests)
```

### Example 13: Enterprise Security Implementation

**User Request:**
```
Implement enterprise-grade security for web application including SSO, MFA, and compliance
```

**JARVIS Workflow:**
```
KNOWLEDGE → Researches enterprise security standards (SAML, OAuth 2.0, OIDC, compliance frameworks)
PLAN → Creates security implementation:
  - (ROLE: planner) (CONTEXT: security_architecture) (PROMPT: Design enterprise security architecture with SSO, MFA, and role-based access) (OUTPUT: security_design)
  - (ROLE: coder) (CONTEXT: sso_implementation) (PROMPT: Implement SAML 2.0 and OAuth 2.0 SSO with identity provider integration) (OUTPUT: sso_system)
  - (ROLE: coder) (CONTEXT: mfa_system) (PROMPT: Build multi-factor authentication with TOTP, SMS, and biometric options) (OUTPUT: mfa_implementation)
  - (ROLE: critic) (CONTEXT: compliance_audit) (PROMPT: Audit implementation for SOC 2, GDPR, and industry compliance requirements) (OUTPUT: compliance_report)
  - (ROLE: coder) (CONTEXT: security_monitoring) (PROMPT: Implement security event logging and anomaly detection) (OUTPUT: security_monitoring)
```

## Performance and Optimization Examples

### Example 14: Large-Scale Performance Optimization

**User Request:**
```
Optimize a high-traffic e-commerce site for performance under Black Friday load conditions
```

**JARVIS Workflow:**
```
KNOWLEDGE → Researches high-performance web architecture patterns and CDN strategies
PLAN → Creates performance optimization strategy:
  - (ROLE: analyzer) (CONTEXT: performance_audit) (PROMPT: Analyze current performance bottlenecks using real user metrics and synthetic testing) (OUTPUT: performance_baseline)
  - (ROLE: coder) (CONTEXT: caching_optimization) (PROMPT: Implement multi-layer caching with Redis, CDN, and application-level caching) (OUTPUT: caching_system)
  - (ROLE: coder) (CONTEXT: database_optimization) (PROMPT: Optimize database queries, implement read replicas, and connection pooling) (OUTPUT: db_optimizations)
  - (ROLE: coder) (CONTEXT: frontend_optimization) (PROMPT: Implement code splitting, lazy loading, and progressive web app features) (OUTPUT: frontend_optimizations)
  - (ROLE: analyzer) (CONTEXT: load_testing) (PROMPT: Create comprehensive load testing scenarios for Black Friday traffic patterns) (OUTPUT: load_test_suite)
```

## Integration and API Examples

### Example 15: Third-Party API Integration Hub

**User Request:**
```
Build a centralized API integration hub that connects to multiple third-party services with rate limiting and error handling
```

**JARVIS Workflow:**
```
ENHANCE → "Add API versioning, webhook handling, transformation pipelines, monitoring, and developer portal"
PLAN → Creates integration platform:
  - (ROLE: planner) (CONTEXT: integration_architecture) (PROMPT: Design scalable API integration hub with plugin architecture) (OUTPUT: integration_design)
  - (ROLE: coder) (CONTEXT: rate_limiting) (PROMPT: Implement sophisticated rate limiting with different strategies per API provider) (OUTPUT: rate_limiting_system)
  - (ROLE: coder) (CONTEXT: transformation_engine) (PROMPT: Build data transformation pipeline for API response normalization) (OUTPUT: transformation_pipeline)
  - (ROLE: coder) (CONTEXT: webhook_handler) (PROMPT: Create webhook processing system with retry logic and dead letter queues) (OUTPUT: webhook_system)
  - (ROLE: ui_implementer) (CONTEXT: developer_portal) (PROMPT: Build developer portal with API documentation and testing interface) (OUTPUT: developer_portal)
```

**Advanced Integration Patterns:**
- **Circuit breaker implementation** for resilient API calls
- **Event-driven architecture** with message queues
- **API versioning strategies** with backward compatibility
- **Comprehensive logging and monitoring** for integration health
- **Developer experience optimization** with SDKs and documentation

---

## Context Window Management in Complex Projects

### When to Use Multiple Sessions

**Single Session Appropriate:**
- Projects with 1-20 files
- Single technology stack
- Clear, focused objectives
- Completion time: 30-60 minutes

**Multiple Sessions Required:**
- Enterprise-scale applications
- Multiple technology stacks
- Complex integrations
- 50+ files or components

**Session Segmentation Strategies:**

**Architecture → Implementation → Integration → Deployment**
```
Session 1: Overall design and planning
Session 2: Core backend services
Session 3: Frontend implementation
Session 4: Integration and testing
Session 5: Deployment and monitoring
```

**Domain-Based Segmentation:**
```
Session A: User management and authentication
Session B: Product catalog and search
Session C: Shopping cart and checkout
Session D: Payment processing and orders
Session E: Admin dashboard and analytics
```

---

This comprehensive examples guide demonstrates Iron Manus MCP's versatility across development, data science, DevOps, mobile, enterprise, and performance optimization scenarios. Each example shows how the 6-phase FSM and meta-prompt agent spawning create sophisticated autonomous workflows while maintaining clarity and reliability through Thread-of-Thought context segmentation.