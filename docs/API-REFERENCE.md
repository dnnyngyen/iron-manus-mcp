# API Reference

This document provides comprehensive API documentation for the Iron Manus MCP server tools and interfaces.

## Overview

Iron Manus MCP exposes a unified tool system through the Model Context Protocol. All tools follow a consistent interface pattern and are designed for integration with Claude's native tooling capabilities.

**Major Tool Consolidation (v0.2.5+):**
- **APITaskAgent**: Unified API research workflow (replaces APISearch, APIValidator, MultiAPIFetch)
- **PythonComputationalTool**: Unified Python operations (replaces PythonExecutorTool, PythonDataAnalysisTool, EnhancedPythonDataScienceTool)

## Core Tools

### JARVIS FSM Controller

The Iron Manus MCP v0.2.5 implements an 8-phase finite state machine with unified tool orchestration.

#### Tool Definition

```typescript
{
  name: "JARVIS",
  description: "JARVIS Finite State Machine Controller - Implements the 8-phase agent loop with unified tool orchestration",
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

#### Usage Examples

**Initialize New Session:**

```typescript
await mcp.callTool({
  name: "JARVIS",
  args: {
    initial_objective: "Create a React dashboard with authentication"
  }
});
```

**Continue Existing Session:**

```typescript
await mcp.callTool({
  name: "JARVIS", 
  args: {
    session_id: "session_1234_abc",
    phase_completed: "QUERY",
    payload: {
      interpreted_goal: "Build secure React dashboard with JWT auth"
    }
  }
});
```

#### Response Format

```typescript
{
  content: [{
    type: "text",
    text: "{\n  \"next_phase\": \"ENHANCE\",\n  \"system_prompt\": \"...\",\n  \"allowed_next_tools\": [\"APITaskAgent\", \"PythonComputationalTool\"],\n  \"status\": \"IN_PROGRESS\",\n  \"payload\": {...}\n}"
  }],
  isError: false
}
```

### APITaskAgent ⭐ **[Recommended for API Operations]**

Unified API research workflow that handles discovery, validation, and data fetching in a single, intelligent interface. Replaces the need for manual orchestration of APISearch, APIValidator, and MultiAPIFetch tools.

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
        description: "Cognitive perspective - What type of thinking are you applying to this research?"
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

#### Usage Examples

**Standard API Research:**

```typescript
await mcp.callTool({
  name: "APITaskAgent",
  args: {
    objective: "Research current cryptocurrency market trends and pricing",
    user_role: "analyzer",
    research_depth: "standard",
    validation_required: true,
    max_sources: 3
  }
});
```

**Comprehensive Financial Analysis:**

```typescript
await mcp.callTool({
  name: "APITaskAgent", 
  args: {
    objective: "Analyze tech stock performance across multiple markets",
    user_role: "analyzer",
    research_depth: "comprehensive",
    category_filter: "financial",
    max_sources: 5,
    timeout_ms: 10000
  }
});
```

**Quick Data Gathering:**

```typescript
await mcp.callTool({
  name: "APITaskAgent",
  args: {
    objective: "Get latest weather data for dashboard",
    user_role: "coder",
    research_depth: "light",
    max_sources: 2
  }
});
```

#### Response Format

```typescript
{
  content: [{
    type: "text", 
    text: "# 🚀 API Research Results\n\n**Research Objective**: Research current cryptocurrency...\n**Cognitive Role**: analyzer\n**Research Depth**: standard\n\n## 📊 Summary\n- **APIs Discovered**: 3\n- **Successful Retrievals**: 3\n- **Total Data Retrieved**: 45.2KB\n\n## ✅ Successful Data Retrieval\n### 1. coinapi.io\n**URL**: https://rest.coinapi.io/v1/exchangerate/BTC/USD\n**Status**: 200 OK\n**Data Preview**: {\"time\":\"2024-01-15T10:30:00.0000000Z\",\"asset_id_base\":\"BTC\"...}\n\n## 🧠 Strategic Analysis Framework for analyzer Perspective\n### Data Quality Assessment\n- **Completeness**: Retrieved data addresses 95% of research objective\n- **Reliability**: All sources demonstrated consistent performance\n..."
  }],
  isError: false
}
```

### PythonComputationalTool ⭐ **[Unified Python Operations]**

Comprehensive Python execution and data science tool that consolidates all Python-related capabilities into a single, intelligent interface. Replaces PythonExecutorTool, PythonDataAnalysisTool, and EnhancedPythonDataScienceTool.

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

#### Usage Examples

**Data Analysis Workflow:**

```typescript
await mcp.callTool({
  name: "PythonComputationalTool",
  args: {
    operation: "data_analysis",
    input_data: "name,age,salary\nJohn,30,50000\nJane,25,60000\nBob,35,55000",
    parameters: {
      analysis_type: "descriptive",
      target_column: "salary"
    }
  }
});
```

**Web Scraping:**

```typescript
await mcp.callTool({
  name: "PythonComputationalTool",
  args: {
    operation: "web_scraping",
    input_data: "https://example.com/data",
    parameters: {
      selector: ".data-table tr",
      output_format: "csv"
    }
  }
});
```

**Machine Learning Pipeline:**

```typescript
await mcp.callTool({
  name: "PythonComputationalTool",
  args: {
    operation: "machine_learning",
    input_data: csvData,
    parameters: {
      model_type: "classification",
      target_column: "category",
      test_size: 0.2
    }
  }
});
```

**Custom Python Code:**

```typescript
await mcp.callTool({
  name: "PythonComputationalTool",
  args: {
    operation: "custom",
    custom_code: "import pandas as pd\ndf = pd.DataFrame({'x': [1,2,3], 'y': [4,5,6]})\nprint(df.describe())"
  }
});
```

#### Response Format

```typescript
{
  content: [{
    type: "text",
    text: "{\n  \"operation\": \"data_analysis\",\n  \"generated_code\": \"# Auto-install and import required libraries...\",\n  \"execution_ready\": true,\n  \"instructions\": \"Use mcp__ide__executeCode tool to run this Python code in the Jupyter kernel\",\n  \"required_libraries\": [\"pandas\", \"numpy\", \"matplotlib\"]\n}"
  }],
  isError: false
}
```

### IronManusStateGraph

Project-scoped FSM state management using knowledge graphs for session isolation and performance tracking.

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

#### Usage Example

```typescript
await mcp.callTool({
  name: "IronManusStateGraph",
  args: {
    action: "initialize_session",
    session_id: "project_analysis_001",
    objective: "Analyze market trends and create dashboard",
    role: "analyzer"
  }
});
```

### HealthCheck

Comprehensive system health monitoring for production deployments.

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

#### Usage Example

```typescript
await mcp.callTool({
  name: "HealthCheck",
  args: {
    detailed: true
  }
});
```

## Advanced Workflows

### Multi-Phase Research Project

```typescript
// 1. Initialize session
await mcp.callTool({
  name: "JARVIS",
  args: {
    initial_objective: "Comprehensive market analysis with ML predictions"
  }
});

// 2. KNOWLEDGE phase - Research with APITaskAgent
await mcp.callTool({
  name: "APITaskAgent",
  args: {
    objective: "Gather financial market data and economic indicators",
    user_role: "analyzer", 
    research_depth: "comprehensive",
    max_sources: 5
  }
});

// 3. EXECUTE phase - Analysis with PythonComputationalTool
await mcp.callTool({
  name: "PythonComputationalTool",
  args: {
    operation: "machine_learning",
    input_data: marketData,
    parameters: {
      model_type: "regression",
      target_column: "price_prediction"
    }
  }
});
```

### Unified Development Workflow

```typescript
// Research APIs for integration
await mcp.callTool({
  name: "APITaskAgent",
  args: {
    objective: "Find payment processing APIs for e-commerce",
    user_role: "coder",
    category_filter: "financial"
  }
});

// Analyze performance data
await mcp.callTool({
  name: "PythonComputationalTool", 
  args: {
    operation: "data_analysis",
    input_data: performanceMetrics,
    parameters: {
      analysis_type: "performance"
    }
  }
});
```

## Phase-Specific Tool Access

### KNOWLEDGE Phase
**Available Tools**: `Task`, `WebSearch`, `WebFetch`, `APITaskAgent`, `mcp__ide__executeCode`, `PythonComputationalTool`, `JARVIS`

**Recommended Patterns**:
- Use `APITaskAgent` for structured API research with validation
- Use `WebSearch`/`WebFetch` for general web content research  
- Use `PythonComputationalTool` for data analysis and processing
- Use `Task` agents for complex multi-step research workflows

### EXECUTE Phase  
**Available Tools**: `TodoRead`, `TodoWrite`, `Task`, `Bash`, `Read`, `Write`, `Edit`, `Browser`, `mcp__ide__executeCode`, `PythonComputationalTool`

**Recommended Patterns**:
- Use `PythonComputationalTool` for all Python-related operations
- Use direct tools (`Bash`, `Read`, `Write`, `Edit`) for simple tasks
- Use `Task` agents for complex implementation requiring specialized expertise

### VERIFY Phase
**Available Tools**: `TodoRead`, `Read`, `mcp__ide__executeCode`, `PythonComputationalTool`

**Recommended Patterns**:
- Use `PythonComputationalTool` for data validation and testing
- Use `Read` tools for verification of generated content

## Migration from Legacy Tools

### API Tools Migration

**Before (Deprecated)**:
```typescript
// Step 1: Search for APIs
await mcp.callTool({ name: "APISearch", args: {...} });
// Step 2: Validate APIs  
await mcp.callTool({ name: "APIValidator", args: {...} });
// Step 3: Fetch data
await mcp.callTool({ name: "MultiAPIFetch", args: {...} });
```

**After (Unified)**:
```typescript
// Single unified operation
await mcp.callTool({
  name: "APITaskAgent",
  args: {
    objective: "Research market data",
    user_role: "analyzer",
    research_depth: "standard"
  }
});
```

### Python Tools Migration

**Before (Deprecated)**:
```typescript
// Different tools for different operations
await mcp.callTool({ name: "PythonExecutor", args: {...} });
await mcp.callTool({ name: "PythonDataAnalysis", args: {...} });
await mcp.callTool({ name: "EnhancedPythonDataScience", args: {...} });
```

**After (Unified)**:
```typescript
// Single tool with operation-specific parameters
await mcp.callTool({
  name: "PythonComputationalTool",
  args: {
    operation: "data_analysis", // or "custom", "visualization", etc.
    input_data: data,
    parameters: {...}
  }
});
```

## Error Handling

All tools implement metaprompting-first error handling with strategic guidance:

```typescript
{
  content: [{
    type: "text",
    text: "# 🔍 Strategic Tool Error Analysis\n\n**Error Encountered**: Invalid API endpoint\n\n## Cognitive Recalibration Questions\n🤔 **Assumption Check**: What assumptions about this tool's capabilities might need revisiting?\n🎯 **Intent Clarification**: Are you using the right tool for your actual objective?\n..."
  }],
  isError: true
}
```

## Best Practices

### Tool Selection Guidelines

1. **For API Research**: Always use `APITaskAgent` - it handles the complete workflow
2. **For Python Operations**: Always use `PythonComputationalTool` - it covers all Python needs  
3. **For Complex Workflows**: Use `Task` agents with meta-prompt syntax
4. **For Simple Operations**: Use direct tools (`Read`, `Write`, `Bash`, etc.)

### Performance Optimization

1. **Parallel Operations**: `APITaskAgent` includes built-in concurrency control
2. **Resource Management**: `PythonComputationalTool` handles library management automatically
3. **State Persistence**: Automatic via `IronManusStateGraph` - no manual intervention needed

### Security Considerations

- **SSRF Protection**: All HTTP requests are validated and sanitized
- **Python Security**: Code validation and library allowlisting in `PythonComputationalTool`
- **Rate Limiting**: Automatic API rate limiting in `APITaskAgent`
- **Input Validation**: Comprehensive argument validation for all tools

---

## Summary

Iron Manus MCP v0.2.5+ provides a streamlined, powerful tool ecosystem that eliminates complexity while maintaining comprehensive functionality. The unified tools (`APITaskAgent`, `PythonComputationalTool`) represent a significant improvement in usability and maintainability while preserving the metaprompting-first design philosophy that makes agents more intelligent and strategic in their tool usage.