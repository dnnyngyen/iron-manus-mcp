# API Reference

This document provides comprehensive API documentation for the Iron Manus MCP server tools and interfaces.

## Overview

Iron Manus MCP exposes a modular tool system through the Model Context Protocol. All tools follow a consistent interface pattern and are designed for integration with Claude's native tooling capabilities.

## Core Tools

### JARVIS FSM Controller

The primary orchestration tool that implements the 6-phase finite state machine.

#### Tool Definition

```typescript
{
  name: "JARVIS",
  description: "🚀 **JARVIS Finite State Machine Controller** - Implements the 6-phase agent loop with fractal orchestration",
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

Intelligent API discovery with role-based filtering from the 65+ endpoint registry.

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

### KnowledgeSynthesize

Cross-validation engine with conflict resolution and confidence scoring.

#### Tool Definition

```typescript
{
  name: "KnowledgeSynthesize",
  description: "Cross-validation engine with conflict resolution and confidence scoring",
  inputSchema: {
    type: "object",
    properties: {
      api_responses: {
        type: "array",
        items: {
          type: "object",
          properties: {
            source: { type: "string" },
            data: { type: "string" },
            confidence: { type: "number" }
          }
        },
        description: "Array of API response objects to synthesize"
      },
      synthesis_mode: {
        type: "string",
        enum: ["consensus", "weighted", "hierarchical", "conflict_resolution"],
        description: "Method for synthesizing conflicting information"
      },
      confidence_threshold: {
        type: "number",
        description: "Minimum confidence score for inclusion (0-1, default: 0.5)"
      },
      objective_context: {
        type: "string", 
        description: "Original objective for context-aware synthesis"
      }
    },
    required: ["api_responses", "synthesis_mode"]
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

## FSM Phases and States

### Phase Transitions

The JARVIS FSM Controller manages state transitions through 6 phases:

```
QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY
```

#### Phase Descriptions

| Phase | Purpose | Allowed Tools | Expected Input |
|-------|---------|---------------|----------------|
| **INIT** | Session initialization | `["JARVIS"]` | `initial_objective` |
| **QUERY** | Goal interpretation | `["JARVIS"]` | None |
| **ENHANCE** | Goal enrichment | `["JARVIS"]` | `interpreted_goal` |
| **KNOWLEDGE** | Information gathering | `["WebSearch", "WebFetch", "APISearch", "MultiAPIFetch", "KnowledgeSynthesize", "JARVIS"]` | `enhanced_goal` |
| **PLAN** | Task decomposition | `["TodoWrite"]` | `knowledge_gathered` |
| **EXECUTE** | Task execution | `["TodoRead", "TodoWrite", "Task", "Bash", "Read", "Write", "Edit"]` | `plan_created` |
| **VERIFY** | Quality validation | `["TodoRead", "Read"]` | `execution_success` |
| **DONE** | Completion | `[]` | `verification_passed` |

#### State Management

Session state includes:

```typescript
interface SessionState {
  current_phase: Phase;
  initial_objective: string;
  detected_role: Role;
  payload: Record<string, any>;
  reasoning_effectiveness: number; // 0.3-1.0
  last_activity: number; // timestamp
}
```

## Role System

### Available Roles

The system supports 9 specialized roles with distinct processing characteristics:

| Role | Category | Purpose | Preferred APIs |
|------|----------|---------|----------------|
| **planner** | Strategy | Task decomposition and dependency analysis | Planning, project management |
| **coder** | Implementation | Code development with testing and best practices | Development, documentation |
| **critic** | Quality | Security review and quality assessment | Security, validation |
| **researcher** | Information | Data gathering and analysis | Research, academic |
| **analyzer** | Data | Pattern recognition and insights | Analytics, finance |
| **synthesizer** | Integration | Knowledge integration and optimization | General purpose |
| **ui_architect** | Design | V0-style UI architecture and systematic design | Design, art |
| **ui_implementer** | UI Dev | V0-style UI implementation with concurrent execution | UI frameworks |
| **ui_refiner** | Polish | V0-style UI refinement with polished aesthetics | Design tools |

### Role-Based API Selection

The system automatically selects relevant APIs based on the detected or specified role:

```typescript
// Example API preferences by role
const ROLE_API_MAPPING = {
  researcher: ["science", "education", "books", "news"],
  analyzer: ["finance", "cryptocurrency", "data", "analytics"], 
  coder: ["development", "documentation", "programming"],
  ui_architect: ["art", "design", "color", "photos"]
};
```

## Meta-Prompt DSL

### Syntax

The system recognizes meta-prompt syntax for specialized task generation:

```
(ROLE: agent_type) (CONTEXT: domain) (PROMPT: instructions) (OUTPUT: deliverable)
```

### Example Transformations

**Input:**
```
(ROLE: coder) (CONTEXT: authentication) (PROMPT: Implement JWT auth) (OUTPUT: production_code)
```

**Generated Prompt:**
- Role-specific thinking methodologies
- Domain context and frameworks  
- Quality validation rules
- Output specifications

### Supported Elements

- **ROLE**: Any of the 9 available roles
- **CONTEXT**: Domain-specific context (e.g., "authentication", "ui", "testing")
- **PROMPT**: Specific instructions
- **OUTPUT**: Expected deliverable type

## API Registry

### Registry Statistics

The built-in API registry contains:

- **Total APIs**: 65+ endpoints
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

## Error Handling

### Standard Error Response

All tools return standardized error responses:

```typescript
{
  content: [{
    type: "text",
    text: "❌ **Tool Error:** [Error description]"
  }],
  isError: true
}
```

### Common Error Types

1. **Validation Errors**: Invalid arguments or missing required fields
2. **FSM State Errors**: Invalid phase transitions or corrupted state
3. **API Errors**: Network timeouts, rate limits, or invalid endpoints
4. **Session Errors**: Missing or expired session state

## Performance Considerations

### Tool Execution Times

- **JARVIS**: ~100-500ms per state transition
- **APISearch**: ~50-200ms for registry lookup
- **MultiAPIFetch**: Variable based on API response times
- **KnowledgeSynthesize**: ~200-1000ms depending on data volume

### Optimization Tips

1. **Session Reuse**: Maintain session_id across calls for efficiency
2. **Concurrent APIs**: Use MultiAPIFetch for parallel data gathering
3. **Rate Limiting**: Respect API limits to avoid throttling
4. **Payload Size**: Keep payloads reasonable for faster processing

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
  name: "KnowledgeSynthesize", 
  args: {
    api_responses: apiData.responses,
    synthesis_mode: "consensus",
    confidence_threshold: 0.7
  }
});
```

This API reference provides complete documentation for integrating with the Iron Manus MCP server. For additional examples and tutorials, see the [EXAMPLES.md](./EXAMPLES.md) and [GETTING_STARTED.md](./GETTING_STARTED.md) guides.