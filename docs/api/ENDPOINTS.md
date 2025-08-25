---
title: "Iron Manus MCP API Endpoints Reference"
topics: ["API", "endpoints", "parameters", "tool parameters", "reference"]
related: ["api/EXAMPLES.md", "core/TOOLS.md", "guides/INTEGRATION.md"]
---

# Iron Manus MCP API Endpoints Reference

**Complete API documentation for all Iron Manus MCP tools and interfaces.**

## Overview

Iron Manus MCP exposes a unified tool system through the Model Context Protocol. All tools follow consistent interface patterns and are designed for integration with Claude's native tooling capabilities.

**Major Tool Consolidation (v0.2.4)**:
- **APITaskAgent**: Unified API research workflow (replaces APISearch, APIValidator, MultiAPIFetch)
- **PythonComputationalTool**: Unified Python operations (replaces 3 separate Python tools)
- **Tool count reduced by 75%** while maintaining 100% functionality

## Core Tool Endpoints

### JARVIS FSM Controller

**Primary FSM orchestrator implementing 8-phase workflow management.**

#### Tool Definition
```typescript
{
  name: "JARVIS",
  description: "JARVIS Finite State Machine Controller - 8-phase agent loop with Meta Thread-of-Thought orchestration",
  inputSchema: {
    type: "object",
    properties: {
      session_id: {
        type: "string",
        description: "Unique session identifier (auto-generated if not provided)"
      },
      phase_completed: {
        type: "string",
        enum: ["QUERY", "ENHANCE", "KNOWLEDGE", "PLAN", "EXECUTE", "VERIFY"],
        description: "Phase that Claude just completed (omit for initial call)"
      },
      initial_objective: {
        type: "string",
        description: "User's goal (only on first call)"
      },
      payload: {
        type: "object",
        description: "Phase-specific data from Claude",
        additionalProperties: true
      }
    },
    required: []
  }
}
```

#### Parameters

**`session_id`** (optional)
- **Type**: string
- **Purpose**: Unique identifier for session continuity
- **Auto-generated**: If not provided, system creates unique ID
- **Format**: `session_{timestamp}_{random}`

**`phase_completed`** (optional)
- **Type**: enum
- **Values**: "QUERY", "ENHANCE", "KNOWLEDGE", "PLAN", "EXECUTE", "VERIFY"
- **Purpose**: Indicates which phase Claude just finished
- **Required**: For continuing existing sessions

**`initial_objective`** (required for new sessions)
- **Type**: string
- **Purpose**: The user's goal or objective
- **Usage**: Only provided on first call to start new session

**`payload`** (optional)
- **Type**: object
- **Purpose**: Phase-specific data and results
- **Content**: Varies by phase (interpreted_goal, enhanced_goal, knowledge_gathered, etc.)

#### Response Format
```json
{
  "content": [{
    "type": "text",
    "text": "{\n  \"next_phase\": \"ENHANCE\",\n  \"system_prompt\": \"You are in the ENHANCE phase...\",\n  \"allowed_next_tools\": [\"JARVIS\"],\n  \"status\": \"IN_PROGRESS\",\n  \"session_id\": \"session_123\",\n  \"payload\": {...}\n}"
  }],
  "isError": false
}
```

### APITaskAgent

**Unified API research workflow for discovery, validation, and data fetching.**

#### Tool Definition
```typescript
{
  name: "APITaskAgent",
  description: "Specialized API research agent that orchestrates discovery, validation, and data fetching workflows",
  inputSchema: {
    type: "object",
    properties: {
      objective: {
        type: "string",
        description: "Strategic research intent - What specific data or insights are you seeking?"
      },
      user_role: {
        type: "string",
        enum: ["planner", "coder", "critic", "researcher", "analyzer", "synthesizer", "ui_architect", "ui_implementer", "ui_refiner"],
        description: "Cognitive perspective - What type of thinking are you applying?"
      },
      research_depth: {
        type: "string",
        enum: ["light", "standard", "comprehensive"],
        description: "Research thoroughness level (default: standard)"
      },
      validation_required: {
        type: "boolean",
        description: "Whether to validate discovered APIs before fetching (default: true)"
      },
      max_sources: {
        type: "number",
        description: "Maximum number of API sources to use (default: 5)"
      },
      category_filter: {
        type: "string",
        description: "Domain focus constraint (e.g., 'financial', 'social', 'technical')"
      },
      timeout_ms: {
        type: "number",
        description: "Request timeout per API (default: 5000)"
      },
      headers: {
        type: "object",
        description: "Authentication headers for premium data sources"
      }
    },
    required: ["objective", "user_role"]
  }
}
```

#### Parameters

**`objective`** (required)
- **Type**: string
- **Purpose**: Strategic research intent and data requirements
- **Examples**: "Research cryptocurrency market trends", "Find payment processing APIs"

**`user_role`** (required)
- **Type**: enum
- **Values**: 9 specialized roles (planner, coder, critic, researcher, analyzer, synthesizer, ui_architect, ui_implementer, ui_refiner)
- **Purpose**: Cognitive perspective that influences API selection and analysis

**`research_depth`** (optional)
- **Type**: enum
- **Values**: "light", "standard", "comprehensive"
- **Default**: "standard"
- **Purpose**: Controls thoroughness of research workflow

**`validation_required`** (optional)
- **Type**: boolean
- **Default**: true
- **Purpose**: Whether to validate API endpoints before data fetching

**`max_sources`** (optional)
- **Type**: number
- **Default**: 5
- **Purpose**: Maximum number of API sources for data triangulation

**`category_filter`** (optional)
- **Type**: string
- **Purpose**: Domain-specific filtering (financial, social, technical, etc.)

**`timeout_ms`** (optional)
- **Type**: number
- **Default**: 5000
- **Purpose**: Request timeout per API call

**`headers`** (optional)
- **Type**: object
- **Purpose**: Authentication credentials for premium APIs

#### Response Format
```json
{
  "content": [{
    "type": "text",
    "text": "# 🚀 API Research Results\n\n**Research Objective**: Research cryptocurrency...\n**Cognitive Role**: analyzer\n**Research Depth**: standard\n\n## 📊 Summary\n- **APIs Discovered**: 3\n- **Successful Retrievals**: 3\n- **Total Data Retrieved**: 45.2KB\n\n## ✅ Successful Data Retrieval\n### 1. coinapi.io\n**URL**: https://rest.coinapi.io/v1/exchangerate/BTC/USD\n**Status**: 200 OK\n**Data Preview**: {...}\n\n## 🧠 Strategic Analysis Framework\n### Data Quality Assessment\n- **Completeness**: 95%\n- **Reliability**: Consistent performance\n..."
  }],
  "isError": false
}
```

### PythonComputationalTool

**Unified Python execution and data science tool with automatic library management.**

#### Tool Definition
```typescript
{
  name: "PythonComputationalTool",
  description: "Unified Python execution and data science tool with automatic library management and comprehensive workflow support",
  inputSchema: {
    type: "object",
    properties: {
      operation: {
        type: "string",
        enum: ["web_scraping", "data_analysis", "visualization", "machine_learning", "custom"],
        description: "Type of computational operation to perform"
      },
      input_data: {
        type: "string",
        description: "Input data as string (HTML, XML, CSV, JSON, etc.)"
      },
      parameters: {
        type: "object",
        description: "Operation-specific parameters and configuration"
      },
      custom_code: {
        type: "string",
        description: "Custom Python code to execute (for custom operation)"
      }
    },
    required: ["operation"]
  }
}
```

#### Parameters

**`operation`** (required)
- **Type**: enum
- **Values**: "web_scraping", "data_analysis", "visualization", "machine_learning", "custom"
- **Purpose**: Defines the type of Python operation to perform

**`input_data`** (optional)
- **Type**: string
- **Purpose**: Input data in various formats (CSV, JSON, HTML, XML, etc.)
- **Usage**: Required for most operations except custom

**`parameters`** (optional)
- **Type**: object
- **Purpose**: Operation-specific configuration
- **Content**: Varies by operation type

**`custom_code`** (optional)
- **Type**: string
- **Purpose**: User-provided Python code
- **Usage**: Required for "custom" operation type

#### Operation-Specific Parameters

**Data Analysis Parameters**:
```typescript
{
  analysis_type: "descriptive" | "correlation" | "regression" | "classification",
  target_column: string,
  features: string[],
  test_size: number
}
```

**Machine Learning Parameters**:
```typescript
{
  model_type: "classification" | "regression" | "clustering",
  target_column: string,
  test_size: number,
  algorithms: string[]
}
```

**Visualization Parameters**:
```typescript
{
  chart_type: "line" | "bar" | "scatter" | "histogram" | "heatmap",
  x_column: string,
  y_column: string,
  title: string
}
```

**Web Scraping Parameters**:
```typescript
{
  selector: string,
  output_format: "csv" | "json" | "xml",
  extract_links: boolean,
  follow_redirects: boolean
}
```

#### Response Format
```json
{
  "content": [{
    "type": "text",
    "text": "{\n  \"operation\": \"data_analysis\",\n  \"generated_code\": \"# Auto-install and import required libraries...\",\n  \"execution_ready\": true,\n  \"instructions\": \"Use mcp__ide__executeCode tool to run this Python code\",\n  \"required_libraries\": [\"pandas\", \"numpy\", \"matplotlib\"]\n}"
  }],
  "isError": false
}
```

### IronManusStateGraph

**Project-scoped FSM state management using knowledge graphs.**

#### Tool Definition
```typescript
{
  name: "IronManusStateGraph",
  description: "Project-scoped FSM state management using knowledge graphs. Manage sessions, phases, tasks, and transitions with isolated state per project.",
  inputSchema: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: ["initialize_session", "record_phase_transition", "record_task_creation", "update_task_status", "read_graph"],
        description: "The action to perform on the session state graph"
      },
      session_id: {
        type: "string",
        description: "The session ID for project-scoped state isolation"
      },
      objective: {
        type: "string",
        description: "Session objective (for initialize_session action)"
      },
      role: {
        type: "string",
        description: "Detected role (for initialize_session action)"
      },
      from_phase: {
        type: "string",
        description: "Source phase (for record_phase_transition action)"
      },
      to_phase: {
        type: "string",
        description: "Target phase (for record_phase_transition action)"
      },
      content: {
        type: "string",
        description: "Task content (for record_task_creation action)"
      },
      priority: {
        type: "string",
        description: "Task priority (for record_task_creation action)"
      },
      task_id: {
        type: "string",
        description: "Task identifier (for task operations)"
      },
      status: {
        type: "string",
        description: "Task status (for update_task_status action)"
      }
    },
    required: ["action", "session_id"]
  }
}
```

#### Parameters

**`action`** (required)
- **Type**: enum
- **Values**: "initialize_session", "record_phase_transition", "record_task_creation", "update_task_status", "read_graph"
- **Purpose**: Defines the state management operation

**`session_id`** (required)
- **Type**: string
- **Purpose**: Unique identifier for session isolation

**Action-Specific Parameters**:
- **initialize_session**: `objective`, `role`
- **record_phase_transition**: `from_phase`, `to_phase`
- **record_task_creation**: `content`, `priority`
- **update_task_status**: `task_id`, `status`
- **read_graph**: None (returns current state)

### HealthCheck

**Comprehensive system health monitoring and diagnostics.**

#### Tool Definition
```typescript
{
  name: "HealthCheck",
  description: "System intelligence assessment - evaluates operational health and cognitive readiness of tools and infrastructure",
  inputSchema: {
    type: "object",
    properties: {
      detailed: {
        type: "boolean",
        description: "Diagnostic depth preference - How much system introspection is needed?"
      }
    },
    required: []
  }
}
```

#### Parameters

**`detailed`** (optional)
- **Type**: boolean
- **Default**: false
- **Purpose**: Controls depth of diagnostic information

#### Response Format
```json
{
  "content": [{
    "type": "text",
    "text": "# 🏥 Iron Manus MCP Health Check\n\n## System Status: ✅ HEALTHY\n\n### Core Components\n- **FSM Controller**: Operational\n- **Tool Registry**: 8 tools registered\n- **State Management**: Active\n- **Security Hooks**: 5 hooks operational\n\n### Performance Metrics\n- **Memory Usage**: 127MB\n- **Session Count**: 3 active\n- **API Response Time**: 245ms average\n- **Error Rate**: 0.2%\n\n### Recommendations\n- System operating within normal parameters\n- No immediate action required"
  }],
  "isError": false
}
```

## Common Parameters and Patterns

### Session Management
All tools that interact with sessions use consistent session_id patterns:
- **Format**: `session_{timestamp}_{random}`
- **Scope**: Project-specific isolation
- **Persistence**: Automatic state management

### Error Handling
All tools implement consistent error response patterns:
```json
{
  "content": [{
    "type": "text",
    "text": "# 🔍 Strategic Tool Error Analysis\n\n**Error Encountered**: Invalid API endpoint\n\n## Cognitive Recalibration Questions\n🤔 **Assumption Check**: What assumptions about this tool's capabilities might need revisiting?\n🎯 **Intent Clarification**: Are you using the right tool for your actual objective?\n..."
  }],
  "isError": true
}
```

### Response Standards
All successful responses follow these patterns:
- **Structured headers**: Clear section organization
- **Strategic guidance**: Metaprompting-first approach
- **Actionable insights**: Next steps and recommendations
- **Performance metrics**: Execution time and resource usage

## Tool Selection Guidelines

### API Research
- **Primary**: Use APITaskAgent for all structured API research
- **Alternative**: WebSearch/WebFetch for general web content
- **Deprecated**: Avoid APISearch, APIValidator, MultiAPIFetch

### Python Operations
- **Primary**: Use PythonComputationalTool for all Python needs
- **Integration**: Works with mcp__ide__executeCode for execution
- **Deprecated**: Avoid PythonExecutor, PythonDataAnalysis, EnhancedPythonDataScience

### Workflow Management
- **Primary**: Use JARVIS for FSM orchestration
- **State**: Use IronManusStateGraph for session management
- **Monitoring**: Use HealthCheck for system diagnostics

## Rate Limiting and Quotas

### Default Limits
- **API requests**: 10 per minute per user
- **Burst capacity**: 20 requests
- **Concurrent requests**: 2 for knowledge gathering
- **Session duration**: 1 hour default timeout

### Configuration
```bash
# Adjust rate limits
export API_RATE_LIMIT=20
export API_BURST_LIMIT=30
export KNOWLEDGE_MAX_CONCURRENCY=3
```

## Security Considerations

### Input Validation
- **Zod schemas**: All inputs validated against TypeScript schemas
- **Sanitization**: Dangerous characters removed
- **Size limits**: Maximum input sizes enforced

### SSRF Protection
- **Enabled by default**: All HTTP requests validated
- **Allowlist**: Configurable allowed hosts
- **IP blocking**: Private networks blocked

### Authentication
- **Headers**: Support for API key authentication
- **Token management**: Secure credential handling
- **Session isolation**: User-specific resource access

## Performance Characteristics

### Response Times
| Tool | Average | P95 | Max |
|------|---------|-----|-----|
| JARVIS | 200ms | 500ms | 2s |
| APITaskAgent | 1.5s | 3s | 10s |
| PythonComputationalTool | 500ms | 1s | 5s |
| IronManusStateGraph | 50ms | 100ms | 200ms |
| HealthCheck | 100ms | 200ms | 500ms |

### Resource Usage
- **Memory**: 50-200MB per session
- **CPU**: 2-10% during execution
- **Network**: 1-100KB per API call
- **Storage**: 1-10MB per session

## Integration Patterns

### MCP Client Integration
```json
{
  "mcpServers": {
    "iron-manus-mcp": {
      "command": "node",
      "args": ["dist/index.js"],
      "env": {
        "ENABLE_SSRF_PROTECTION": "true",
        "ALLOWED_HOSTS": "api.github.com,api.openai.com"
      }
    }
  }
}
```

### Multi-Server Coordination
```typescript
// Use explicit namespacing
await mcp.callTool({
  name: "mcp__iron-manus-mcp__JARVIS",
  args: { initial_objective: "Build dashboard" }
});

// Coordinate with other servers
await mcp.callTool({
  name: "mcp__specialized-server__CustomTool",
  args: { task: "specific_implementation" }
});
```

## Deprecated Endpoints

### Removed Tools (v0.2.4)
- **APISearch**: Use APITaskAgent instead
- **APIValidator**: Integrated into APITaskAgent
- **MultiAPIFetch**: Integrated into APITaskAgent
- **PythonExecutor**: Use PythonComputationalTool
- **PythonDataAnalysis**: Use PythonComputationalTool
- **EnhancedPythonDataScience**: Use PythonComputationalTool

### Migration Guide
See api/EXAMPLES.md for migration examples from legacy tools to unified tools.

## Summary

The Iron Manus MCP API provides a comprehensive, unified interface for AI workflow orchestration with:

- **8 core tools** covering all functionality
- **75% tool reduction** through intelligent consolidation
- **Consistent interfaces** with comprehensive validation
- **Security-first design** with multi-layer protection
- **Performance optimization** through shared infrastructure

The API design emphasizes clarity, security, and intelligent workflow orchestration while maintaining the flexibility needed for complex AI-assisted development tasks.