---
title: "Iron Manus MCP Integration Guide"
topics: ["integration", "multi-server", "MCP coordination", "Claude Code"]
related: ["core/SECURITY.md", "quick/SETUP.md", "guides/METAPROMPTS.md"]
---

# Iron Manus MCP Integration Guide

**Comprehensive guide for integrating Iron Manus MCP with other systems, MCP servers, and development environments.**

## Overview

Iron Manus MCP is designed for seamless integration with other MCP servers, development tools, and AI systems. This guide covers integration patterns, coordination strategies, and best practices for multi-server environments.

## Integration Architecture Patterns

### 1. Orchestrator + Specialists Pattern

**Iron Manus as Primary Orchestrator**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Iron Manus    │    │  Database MCP   │    │   API MCP       │
│   (Orchestrator)│◄──►│  (SQL Queries)  │    │  (Integrations) │
│   - JARVIS FSM  │    │  - Query Builder│    │  - Rate Limiting│
│   - Agent Spawn │    │  - Migration    │    │  - Auth Handling│
│   - Meta-Prompts│    │  - Optimization │    │  - Data Transform│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Benefits:**
- Iron Manus handles complex multi-step workflows
- Specialized servers provide domain expertise
- Clean separation of concerns
- Reduced context confusion

**Implementation:**
```typescript
// Iron Manus orchestrates overall workflow
await mcp.callTool({
  name: "mcp__iron-manus-mcp__JARVIS",
  args: {
    initial_objective: "Build dashboard with real-time database integration"
  }
});

// During EXECUTE phase, delegates to specialists
await mcp.callTool({
  name: "mcp__database-mcp__QueryBuilder",
  args: {
    query_type: "real_time_analytics",
    tables: ["users", "events", "metrics"]
  }
});
```

### 2. Peer Collaboration Pattern

**Equal Partners with Handoff Protocols**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Iron Manus    │    │   Testing MCP   │    │   Deploy MCP    │
│   (Development) │◄──►│   (Quality)     │◄──►│  (Operations)   │
│   - Code Gen    │    │   - Unit Tests  │    │   - CI/CD       │
│   - Architecture│    │   - Integration │    │   - Monitoring  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Coordination:**
- Sequential workflow handoffs
- Shared session state management
- Cross-server communication protocols

**Implementation:**
```typescript
// 1. Development phase (Iron Manus)
await mcp.callTool({
  name: "mcp__iron-manus-mcp__JARVIS",
  args: { initial_objective: "Create microservice API" }
});

// 2. Testing phase (Testing MCP)
await mcp.callTool({
  name: "mcp__testing-mcp__RunTests",
  args: { 
    test_suite: "comprehensive",
    coverage_threshold: 80
  }
});

// 3. Deployment phase (Deploy MCP)
await mcp.callTool({
  name: "mcp__deploy-mcp__Deploy",
  args: { 
    environment: "production",
    strategy: "blue_green"
  }
});
```

### 3. Hierarchical Delegation Pattern

**Iron Manus Delegates to Specialized Orchestrators**

```
                    ┌─────────────────┐
                    │   Iron Manus    │
                    │  (Meta-Control) │
                    └─────────┬───────┘
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
    ┌───────▼───────┐ ┌───────▼───────┐ ┌───────▼───────┐
    │  Frontend MCP │ │  Backend MCP  │ │Infrastructure │
    │ (UI/UX Focus) │ │ (API Focus)   │ │    MCP        │
    │ - Components  │ │ - Services    │ │ (DevOps Focus)│
    │ - Styling     │ │ - Database    │ │ - Containers  │
    └───────────────┘ └───────────────┘ └───────────────┘
```

**Implementation:**
```typescript
// Meta-control delegates to specialized orchestrators
await mcp.callTool({
  name: "mcp__iron-manus-mcp__Task",
  args: {
    description: "(ROLE: external_coordinator) (CONTEXT: fullstack_app) (PROMPT: Coordinate frontend-mcp, backend-mcp, and infrastructure-mcp for complete application deployment) (OUTPUT: integrated_application)"
  }
});
```

## Tool Namespace Management

### Conflict Resolution

**Tool Name Conflicts:**
```bash
# Problem: Multiple servers provide similar tools
iron-manus-mcp: JARVIS
other-orchestrator-mcp: JARVIS

# Solution: Use explicit namespacing
mcp__iron-manus-mcp__JARVIS
mcp__other-orchestrator-mcp__JARVIS
```

**Tool Priority Configuration:**
```json
{
  "mcpServers": {
    "iron-manus-mcp": {
      "priority": 1,
      "command": "node",
      "args": ["dist/index.js"],
      "tools": ["JARVIS", "APITaskAgent"]
    },
    "specialized-api-mcp": {
      "priority": 2,
      "command": "node", 
      "args": ["dist/server.js"],
      "tools": ["APIConnect", "RateLimit"]
    }
  }
}
```

### Tool Discovery and Selection

**Intelligent Tool Selection:**
```
User Request: "Build React app with database integration"

Tool Selection Logic:
1. mcp__iron-manus-mcp__JARVIS (Primary orchestration)
   ├── Delegates frontend: react-mcp__ComponentBuilder
   ├── Delegates database: database-mcp__SchemaDesigner
   └── Coordinates integration: iron-manus-mcp__APITaskAgent

2. Cross-server coordination through meta-prompts:
   (ROLE: external_specialist) (CONTEXT: react_components) 
   (PROMPT: Use react-mcp tools for component generation) 
   (OUTPUT: react_application)
```

## Session State Sharing

### Shared Context Management

**Session State Structure:**
```typescript
interface SharedMCPSession {
  sessionId: string;
  primaryOrchestrator: "iron-manus-mcp";
  participatingServers: string[];
  sharedState: {
    project: ProjectContext;
    currentPhase: string;
    completedTasks: Task[];
    activeAgents: Agent[];
  };
  handoffProtocol: HandoffRule[];
}
```

**File-Based State Sharing:**
```typescript
// Iron Manus creates shared workspace
/tmp/shared-mcp-session-{sessionId}/
├── session_state.json       // Shared session information
├── iron_manus_progress.md    // FSM progress and phase data
├── database_schema.sql       // Database server contributions
├── frontend_components.tsx   // Frontend server contributions
└── integration_plan.md       // Cross-server coordination plan
```

### State Synchronization Patterns

**Event-Based Updates:**
```typescript
// Iron Manus broadcasts phase transitions
await mcp.callTool({
  name: "mcp__iron-manus-mcp__JARVIS",
  args: {
    session_id: "shared_session_123",
    phase_completed: "PLAN",
    payload: {
      broadcast_event: "phase_transition",
      target_servers: ["database-mcp", "frontend-mcp"],
      event_data: { next_phase: "EXECUTE", tasks: [...] }
    }
  }
});

// Other servers listen for events
await mcp.callTool({
  name: "mcp__database-mcp__EventListener",
  args: {
    session_id: "shared_session_123",
    event_type: "phase_transition"
  }
});
```

**Pull-Based Synchronization:**
```typescript
// Servers query shared state as needed
await mcp.callTool({
  name: "mcp__frontend-mcp__StateSync",
  args: {
    session_id: "shared_session_123",
    query_type: "current_phase"
  }
});
```

## Integration Examples

### Example 1: Full-Stack Development Pipeline

**Participating Servers:**
- `iron-manus-mcp`: Primary orchestration
- `react-builder-mcp`: Frontend specialization
- `node-api-mcp`: Backend API development
- `database-designer-mcp`: Schema and query optimization
- `testing-framework-mcp`: Automated testing
- `deployment-mcp`: CI/CD and infrastructure

**Workflow:**
```typescript
// 1. Iron Manus analyzes requirements
await mcp.callTool({
  name: "mcp__iron-manus-mcp__JARVIS",
  args: {
    initial_objective: "Build e-commerce platform with React frontend, Node.js backend, PostgreSQL database, and automated testing"
  }
});

// 2. During PLAN phase, creates coordination strategy
// 3. During EXECUTE phase, spawns coordinated agents:

// Frontend delegation
await mcp.callTool({
  name: "mcp__iron-manus-mcp__Task",
  args: {
    description: "(ROLE: external_coordinator) (CONTEXT: frontend_development) (PROMPT: Use react-builder-mcp tools to create responsive e-commerce UI with product catalog, shopping cart, and checkout flow) (OUTPUT: react_application)"
  }
});

// Backend delegation
await mcp.callTool({
  name: "mcp__node-api-mcp__APIGenerator",
  args: {
    api_type: "ecommerce",
    features: ["authentication", "payments", "inventory"],
    database_integration: true
  }
});

// Database delegation
await mcp.callTool({
  name: "mcp__database-designer-mcp__SchemaBuilder",
  args: {
    schema_type: "ecommerce",
    tables: ["users", "products", "orders", "payments"],
    relationships: ["user_orders", "order_items"]
  }
});

// 4. Integration and testing
await mcp.callTool({
  name: "mcp__testing-framework-mcp__IntegrationTest",
  args: {
    test_type: "end_to_end",
    components: ["frontend", "backend", "database"],
    scenarios: ["user_registration", "product_purchase", "order_management"]
  }
});

// 5. Deployment
await mcp.callTool({
  name: "mcp__deployment-mcp__Deploy",
  args: {
    application_type: "fullstack",
    environment: "production",
    components: ["react_app", "node_api", "postgres_db"]
  }
});
```

### Example 2: AI/ML Pipeline Integration

**Participating Servers:**
- `iron-manus-mcp`: Workflow orchestration
- `data-pipeline-mcp`: ETL and preprocessing
- `ml-training-mcp`: Model training and evaluation
- `model-serving-mcp`: Deployment and inference
- `monitoring-mcp`: Performance and drift monitoring

**Coordination Pattern:**
```typescript
// Phase 1: Data Preparation
await mcp.callTool({
  name: "mcp__iron-manus-mcp__JARVIS",
  args: {
    initial_objective: "Build ML model for customer churn prediction with automated training pipeline and monitoring"
  }
});

// Iron Manus coordinates data pipeline
await mcp.callTool({
  name: "mcp__data-pipeline-mcp__ETLProcessor",
  args: {
    source_data: "customer_behavior_db",
    transformations: ["feature_engineering", "normalization", "split"],
    output_format: "training_ready"
  }
});

// Phase 2: Model Development
await mcp.callTool({
  name: "mcp__ml-training-mcp__ModelTrainer",
  args: {
    model_type: "classification",
    algorithms: ["random_forest", "gradient_boosting", "neural_network"],
    validation_strategy: "cross_validation",
    performance_metrics: ["accuracy", "precision", "recall", "f1"]
  }
});

// Phase 3: Deployment and Monitoring
await mcp.callTool({
  name: "mcp__model-serving-mcp__Deploy",
  args: {
    model_path: "/tmp/shared-session/trained_model.pkl",
    serving_type: "rest_api",
    scaling: "auto"
  }
});

await mcp.callTool({
  name: "mcp__monitoring-mcp__SetupTracking",
  args: {
    metrics: ["model_performance", "data_drift", "prediction_latency"],
    alerting: ["performance_degradation", "drift_detection"]
  }
});
```

### Example 3: Security-First Integration

**Participating Servers:**
- `iron-manus-mcp`: Security architecture orchestration
- `auth-provider-mcp`: Authentication and SSO
- `security-scanner-mcp`: Vulnerability assessment
- `compliance-mcp`: Regulatory compliance checks
- `audit-logging-mcp`: Security event logging

**Security Workflow:**
```typescript
// 1. Security architecture analysis
await mcp.callTool({
  name: "mcp__iron-manus-mcp__JARVIS",
  args: {
    initial_objective: "Implement enterprise security architecture with SSO, vulnerability scanning, compliance validation, and audit logging"
  }
});

// 2. Authentication implementation
await mcp.callTool({
  name: "mcp__auth-provider-mcp__SSOSetup",
  args: {
    provider: "okta",
    protocols: ["saml", "oauth2"],
    mfa_required: true,
    session_management: "secure"
  }
});

// 3. Security scanning
await mcp.callTool({
  name: "mcp__security-scanner-mcp__VulnerabilityAssessment",
  args: {
    scan_type: "comprehensive",
    targets: ["web_application", "api_endpoints", "database"],
    compliance_frameworks: ["owasp", "nist"]
  }
});

// 4. Compliance validation
await mcp.callTool({
  name: "mcp__compliance-mcp__ComplianceCheck",
  args: {
    standards: ["soc2", "gdpr", "hipaa"],
    audit_scope: "full_system",
    reporting: "detailed"
  }
});

// 5. Audit logging setup
await mcp.callTool({
  name: "mcp__audit-logging-mcp__LoggingSetup",
  args: {
    log_types: ["authentication", "authorization", "data_access"],
    retention_policy: "7_years",
    monitoring: "real_time"
  }
});
```

## Best Practices

### Server Selection Guidelines

**Choose Iron Manus MCP When:**
- Complex multi-step workflows requiring orchestration
- Cross-domain projects needing specialist coordination
- Large projects benefiting from context segmentation
- Meta-cognitive capabilities needed for autonomous planning

**Complement with Specialist Servers For:**
- Domain-specific expertise (databases, APIs, UI frameworks)
- Performance-critical operations (compilation, deployment)
- Regulatory compliance (security, audit, testing)
- Platform-specific integrations (cloud providers, services)

### Configuration Management

**Recommended MCP Server Setup:**
```json
{
  "mcpServers": {
    "iron-manus-mcp": {
      "command": "node",
      "args": ["/path/to/iron-manus-mcp/dist/index.js"],
      "priority": 1,
      "role": "orchestrator",
      "env": {
        "ENABLE_SSRF_PROTECTION": "true",
        "ALLOWED_HOSTS": "api.github.com,api.openai.com"
      }
    },
    "specialized-frontend-mcp": {
      "command": "node",
      "args": ["/path/to/frontend-mcp/dist/index.js"],
      "priority": 2,
      "role": "specialist",
      "domains": ["react", "vue", "angular"]
    },
    "specialized-backend-mcp": {
      "command": "node",
      "args": ["/path/to/backend-mcp/dist/index.js"],
      "priority": 2,
      "role": "specialist",
      "domains": ["nodejs", "python", "database"]
    }
  }
}
```

### Performance Optimization

**Minimize Cross-Server Overhead:**
```
✅ Batch operations when possible
✅ Use lazy loading for context sharing
✅ Implement caching for repeated operations
✅ Optimize tool selection algorithms

❌ Avoid frequent server switching
❌ Avoid duplicate functionality across servers
❌ Avoid tight coupling between server states
```

**Resource Management:**
```
✅ Monitor memory usage across all servers
✅ Implement resource pooling for shared operations
✅ Use efficient serialization for state sharing
✅ Graceful degradation when servers are unavailable

❌ Avoid resource competition between servers
❌ Avoid blocking operations in critical paths
```

## Troubleshooting Multi-Server Issues

### Common Integration Problems

**Tool Conflicts:**
```
Problem: Multiple servers provide similar functionality
Solution: Use explicit tool namespacing and priority ordering
Debug: Check tool registration order and naming conflicts
```

**State Synchronization Issues:**
```
Problem: Servers have inconsistent session state
Solution: Implement centralized state management
Debug: Verify state update propagation and timing
```

**Performance Degradation:**
```
Problem: Too many servers active simultaneously
Solution: Optimize server selection and lifecycle management
Debug: Monitor resource usage and response times
```

### Debugging Commands

**List Active Servers:**
```bash
/mcp
```

**Check Specific Server Tools:**
```bash
# Use explicit namespacing
Use mcp__iron-manus-mcp__JARVIS to show server status
```

**Verify Tool Accessibility:**
```bash
# Test cross-server coordination
Use mcp__iron-manus-mcp__JARVIS with objective: "Test multi-server coordination"
```

### Integration Health Checks

**Diagnostic Checklist:**
1. ✅ Verify all required servers are registered and responding
2. ✅ Test tool accessibility across server boundaries
3. ✅ Validate state sharing and synchronization
4. ✅ Confirm handoff protocols are working correctly
5. ✅ Monitor performance metrics for optimization opportunities

## Advanced Integration Patterns

### Dynamic Server Discovery

**Runtime Server Selection:**
```typescript
interface ServerCapability {
  serverId: string;
  tools: string[];
  domains: string[];
  performance: PerformanceMetrics;
  availability: boolean;
}

// Iron Manus dynamically selects optimal servers
const selectOptimalServer = (requirement: TaskRequirement): string => {
  return availableServers
    .filter(server => server.domains.includes(requirement.domain))
    .sort((a, b) => a.performance.responseTime - b.performance.responseTime)[0]
    .serverId;
};
```

### Event-Driven Coordination

**Server Communication via Events:**
```
Iron Manus Event Broadcasting:
├── phase_transition: Notify all servers of FSM phase changes
├── task_completion: Signal completed tasks to interested servers
├── agent_spawn: Notify servers of new agent availability
└── session_end: Cleanup coordination across servers

Specialist Server Event Responses:
├── capability_advertisement: Announce available tools and domains
├── resource_status: Report server health and availability
├── task_request: Request delegation from Iron Manus
└── completion_report: Report task completion with results
```

### Cross-Server Agent Spawning

**Agent Delegation Patterns:**
```typescript
// Iron Manus creates meta-prompt for external server delegation
await mcp.callTool({
  name: "mcp__iron-manus-mcp__Task",
  args: {
    description: "(ROLE: external_delegate) (CONTEXT: specialized_domain) (PROMPT: Use {specialist-server} tools for {specific-task}) (OUTPUT: domain_deliverable)"
  }
});

// Specialist server receives delegation and executes
await mcp.callTool({
  name: "mcp__specialist-server__ExecuteTask",
  args: {
    delegation_context: "from_iron_manus",
    task_specification: "specific_domain_task",
    reporting_format: "structured_output"
  }
});
```

## Summary

Iron Manus MCP's integration capabilities enable sophisticated multi-server environments where:

### Key Benefits
1. **Orchestration Excellence**: Iron Manus provides cognitive architecture for complex workflows
2. **Specialist Integration**: Seamless delegation to domain-specific servers
3. **State Management**: Robust session sharing and synchronization
4. **Performance Optimization**: Efficient resource utilization across servers
5. **Scalable Architecture**: Supports growth and additional server integration

### Integration Patterns
- **Orchestrator + Specialists**: Iron Manus coordinates specialized servers
- **Peer Collaboration**: Equal partners with handoff protocols
- **Hierarchical Delegation**: Meta-control with specialized orchestrators

### Best Practices
- Use explicit namespacing to avoid conflicts
- Implement centralized state management
- Optimize for performance and resource efficiency
- Design for graceful degradation and error recovery

The integration approach enables building sophisticated development environments where each server contributes its expertise while Iron Manus provides the cognitive architecture to coordinate complex, multi-domain projects efficiently.