# API Reference

This document provides comprehensive API documentation for the Iron Manus MCP server tools and interfaces.

## Overview

Iron Manus MCP exposes a modular tool system through the Model Context Protocol. All tools follow a consistent interface pattern and are designed for integration with Claude's native tooling capabilities.

## Core Tools

### JARVIS FSM Controller

The Iron Manus MCP v0.2.4 implements an 8-phase finite state machine.

#### Tool Definition

```typescript
{
  name: "JARVIS",
  description: "JARVIS Finite State Machine Controller - Implements the 8-phase agent loop with fractal orchestration",
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
    text: "{\n  \"next_phase\": \"ENHANCE\",\n  \"system_prompt\": \"...\",\n  \"allowed_next_tools\": [\"JARVIS\"],\n  \"status\": \"IN_PROGRESS\",\n  \"payload\": {...}\n}"
  }],
  isError: false
}
```

### MultiAPIFetch

Parallel HTTP requests with timeout management and response aggregation.

#### Tool Definition

```typescript
{
  name: "MultiAPIFetch",
  description: "Parallel HTTP requests to multiple APIs with timeout management",
  inputSchema: {
    type: "object", 
    properties: {
      api_endpoints: {
        type: "array",
        items: { type: "string" },
        description: "Array of API URLs to fetch from"
      },
      headers: {
        type: "object",
        description: "Optional headers to include in requests"
      },
      max_concurrent: {
        type: "number",
        description: "Maximum concurrent requests (default: 3)"
      },
      timeout_ms: {
        type: "number", 
        description: "Request timeout in milliseconds (default: 5000)"
      }
    },
    required: ["api_endpoints"]
  }
}
```

#### Usage Example

```typescript
await mcp.callTool({
  name: "MultiAPIFetch",
  args: {
    api_endpoints: [
      "https://api.github.com/users/octocat",
      "https://jsonplaceholder.typicode.com/users/1"
    ],
    max_concurrent: 2,
    timeout_ms: 10000
  }
});
```

### APISearch

Intelligent API discovery with role-based filtering from the 65 endpoint registry.

#### Tool Definition

```typescript
{
  name: "APISearch", 
  description: "Intelligent API discovery with role-based filtering",
  inputSchema: {
    type: "object",
    properties: {
      objective: {
        type: "string",
        description: "The goal or task requiring API data"
      },
      user_role: {
        type: "string",
        enum: ["planner", "coder", "critic", "researcher", "analyzer", "synthesizer", "ui_architect", "ui_implementer", "ui_refiner"],
        description: "User role for preference-based filtering"
      },
      category_filter: {
        type: "string", 
        description: "Optional category to filter by"
      },
      max_results: {
        type: "number",
        description: "Maximum number of APIs to return (default: 5)"
      }
    },
    required: ["objective", "user_role"]
  }
}
```

#### Usage Example

```typescript
await mcp.callTool({
  name: "APISearch",
  args: {
    objective: "Analyze cryptocurrency market trends",
    user_role: "analyzer",
    max_results: 3
  }
});
```

### IronManusStateGraph

Project-scoped FSM state management using knowledge graphs for session isolation.

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
        enum: ["create_entities", "create_transitions", "add_observations", "delete_entities", "delete_observations", "delete_transitions", "read_graph", "search_nodes", "open_nodes", "initialize_session", "record_phase_transition", "record_task_creation", "update_task_status"],
        description: "The action to perform on the session state graph"
      },
      session_id: {
        type: "string",
        description: "The session ID for project-scoped state isolation"
      },
      // Additional properties based on action type
      objective: { type: "string", description: "Session objective (for initialize_session)" },
      role: { type: "string", description: "Detected role (for initialize_session)" },
      from_phase: { type: "string", description: "Source phase (for record_phase_transition)" },
      to_phase: { type: "string", description: "Target phase (for record_phase_transition)" },
      task_id: { type: "string", description: "Task identifier (for task operations)" },
      content: { type: "string", description: "Task content (for record_task_creation)" },
      priority: { type: "string", description: "Task priority (for record_task_creation)" },
      status: { type: "string", description: "Task status (for update_task_status)" }
    },
    required: ["action", "session_id"]
  }
}
```

### APIValidator

Validates API endpoints and suggests corrections for failed requests.

#### Tool Definition

```typescript
{
  name: "APIValidator",
  description: "Validates API endpoints and suggests corrections for failed requests",
  inputSchema: {
    type: "object",
    properties: {
      api_endpoint: {
        type: "object",
        description: "API endpoint to validate"
      },
      auto_correct: {
        type: "boolean",
        description: "Attempt to auto-correct failed endpoints (default: true)"
      }
    },
    required: ["api_endpoint"]
  }
}
```

This document provides comprehensive API documentation for the Iron Manus MCP server tools and interfaces. It focuses on tool definitions, input schemas, and usage examples.

For detailed information on FSM phases, roles, meta-prompts, error handling, and performance considerations, please refer to [PROMPTS.md](./PROMPTS.md), [META_PROMPT_GUIDE.md](./META_PROMPT_GUIDE.md), [ORCHESTRATION.md](./ORCHESTRATION.md), and [ARCHITECTURE.md](./ARCHITECTURE.md).

## Overview

Iron Manus MCP exposes a modular tool system through the Model Context Protocol. All tools follow a consistent interface pattern and are designed for integration with Claude's native tooling capabilities.

## Core Tools

### JARVIS FSM Controller

The Iron Manus MCP v0.2.4 implements an 8-phase finite state machine.

#### Tool Definition

```typescript
{
  name: "JARVIS",
  description: "JARVIS Finite State Machine Controller - Implements the 8-phase agent loop with fractal orchestration",
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
    text: "{
  "next_phase": "ENHANCE",
  "system_prompt": "...",
  "allowed_next_tools": ["JARVIS"],
  "status": "IN_PROGRESS",
  "payload": {...}
}"
  }],
  isError: false
}
```

### MultiAPIFetch

Parallel HTTP requests with timeout management and response aggregation.

#### Tool Definition

```typescript
{
  name: "MultiAPIFetch",
  description: "Parallel HTTP requests to multiple APIs with timeout management",
  inputSchema: {
    type: "object", 
    properties: {
      api_endpoints: {
        type: "array",
        items: { type: "string" },
        description: "Array of API URLs to fetch from"
      },
      headers: {
        type: "object",
        description: "Optional headers to include in requests"
      },
      max_concurrent: {
        type: "number",
        description: "Maximum concurrent requests (default: 3)"
      },
      timeout_ms: {
        type: "number", 
        description: "Request timeout in milliseconds (default: 5000)"
      }
    },
    required: ["api_endpoints"]
  }
}
```

#### Usage Example

```typescript
await mcp.callTool({
  name: "MultiAPIFetch",
  args: {
    api_endpoints: [
      "https://api.github.com/users/octocat",
      "https://jsonplaceholder.typicode.com/users/1"
    ],
    max_concurrent: 2,
    timeout_ms: 10000
  }
});
```

### APISearch

Intelligent API discovery with role-based filtering from the 65 endpoint registry.

#### Tool Definition

```typescript
{
  name: "APISearch", 
  description: "Intelligent API discovery with role-based filtering",
  inputSchema: {
    type: "object",
    properties: {
      objective: {
        type: "string",
        description: "The goal or task requiring API data"
      },
      user_role: {
        type: "string",
        enum: ["planner", "coder", "critic", "researcher", "analyzer", "synthesizer", "ui_architect", "ui_implementer", "ui_refiner"],
        description: "User role for preference-based filtering"
      },
      category_filter: {
        type: "string", 
        description: "Optional category to filter by"
      },
      max_results: {
        type: "number",
        description: "Maximum number of APIs to return (default: 5)"
      }
    },
    required: ["objective", "user_role"]
  }
}
```

#### Usage Example

```typescript
await mcp.callTool({
  name: "APISearch",
  args: {
    objective: "Analyze cryptocurrency market trends",
    user_role: "analyzer",
    max_results: 3
  }
});
```

### IronManusStateGraph

Project-scoped FSM state management using knowledge graphs for session isolation.

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
        enum: ["create_entities", "create_transitions", "add_observations", "delete_entities", "delete_observations", "delete_transitions", "read_graph", "search_nodes", "open_nodes", "initialize_session", "record_phase_transition", "record_task_creation", "update_task_status"],
        description: "The action to perform on the session state graph"
      },
      session_id: {
        type: "string",
        description: "The session ID for project-scoped state isolation"
      },
      // Additional properties based on action type
      objective: { type: "string", description: "Session objective (for initialize_session)" },
      role: { type: "string", description: "Detected role (for initialize_session)" },
      from_phase: { type: "string", description: "Source phase (for record_phase_transition)" },
      to_phase: { type: "string", description: "Target phase (for record_phase_transition)" },
      task_id: { type: "string", description: "Task identifier (for task operations)" },
      content: { type: "string", description: "Task content (for record_task_creation)" },
      priority: { type: "string", description: "Task priority (for record_task_creation)" },
      status: { type: "string", description: "Task status (for update_task_status)" }
    },
    required: ["action", "session_id"]
  }
}
```

### APIValidator

Validates API endpoints and suggests corrections for failed requests.

#### Tool Definition

```typescript
{
  name: "APIValidator",
  description: "Validates API endpoints and suggests corrections for failed requests",
  inputSchema: {
    type: "object",
    properties: {
      api_endpoint: {
        type: "object",
        description: "API endpoint to validate"
      },
      auto_correct: {
        type: "boolean",
        description: "Attempt to auto-correct failed endpoints (default: true)"
      }
    },
    required: ["api_endpoint"]
  }
}
```

## API Registry

### Registry Statistics

The built-in API registry contains:

- **Total APIs**: 65 endpoints
- **Categories**: 25+ different categories
- **Authentication**: All no-auth APIs for simplicity
- **Reliability**: Scored 0-1 based on uptime and response quality

### API Endpoint Structure

```typescript
interface APIEndpoint {
  name: string;
  description: string;
  url: string;
  category: string;
  keywords: string[];
  auth_type: 'None' | 'API Key' | 'OAuth';
  https: boolean;
  cors: boolean;
  reliability_score: number; // 0-1 scale
  rate_limits?: {
    requests: number;
    timeWindow: string;
  };
}
```

### Rate Limiting

Built-in rate limiting prevents API abuse:

```typescript
// Check if API call is allowed
const canUse = rateLimiter.canMakeRequest(apiName, maxRequests, timeWindow);

// Get current status
const status = rateLimiter.getRateLimitStatus(apiName);
// Returns: { tokens: number, requestCount: number }

// Reset limits
rateLimiter.resetRateLimit(apiName);
```

## Integration Examples

### Basic Workflow

```typescript
// 1. Initialize session
const session = await mcp.callTool({
  name: "JARVIS",
  args: { initial_objective: "Build a weather app" }
});

// 2. Continue through phases
const enhanced = await mcp.callTool({
  name: "JARVIS", 
  args: {
    session_id: extractSessionId(session),
    phase_completed: "QUERY",
    payload: { interpreted_goal: "React weather app with geolocation" }
  }
});

// 3. Gather knowledge
const knowledge = await mcp.callTool({
  name: "APISearch",
  args: {
    objective: "Weather data APIs", 
    user_role: "coder"
  }
});
```

### Advanced API Orchestration

```typescript
// Parallel API data gathering
const apiData = await mcp.callTool({
  name: "MultiAPIFetch",
  args: {
    api_endpoints: [
      "https://api.openweathermap.org/data/2.5/weather?q=London",
      "https://wttr.in/London?format=j1"
    ],
    max_concurrent: 2
  }
});

// Synthesize conflicting data
const synthesis = await mcp.callTool({
  name: "IronManusStateGraph", 
  args: {
    api_responses: apiData.responses,
    synthesis_mode: "consensus",
    confidence_threshold: 0.7
  }
});
```

This API reference provides complete documentation for integrating with the Iron Manus MCP server. For additional examples and tutorials, see the [EXAMPLES.md](./EXAMPLES.md) and [GETTING_STARTED.md](./GETTING_STARTED.md) guides.