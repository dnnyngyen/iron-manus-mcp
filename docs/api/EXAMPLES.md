---
title: "Iron Manus MCP Usage Examples"
topics: ["examples", "usage", "code samples", "workflows", "demonstrations"]
related: ["api/ENDPOINTS.md", "guides/METAPROMPTS.md", "core/TOOLS.md"]
---

# Iron Manus MCP Usage Examples

**Working examples and code samples for all Iron Manus MCP tools and workflows.**

## Overview

This guide provides practical, working examples for all Iron Manus MCP tools, from basic usage to advanced workflow orchestration. All examples are tested and production-ready.

## Basic Workflow Examples

### Example 1: Simple React Component Creation

**Objective**: Create a React login component with validation

**JARVIS Workflow**:
```typescript
// 1. Initialize session
await mcp.callTool({
  name: "JARVIS",
  args: {
    initial_objective: "Create a React login component with form validation and error handling"
  }
});

// 2. System progresses through phases automatically
// INIT → QUERY → ENHANCE → KNOWLEDGE → PLAN → EXECUTE → VERIFY → DONE
```

**Expected Flow**:
1. **QUERY**: Analyzes objective, detects `ui_implementer` role
2. **ENHANCE**: Adds state management, accessibility, testing requirements
3. **KNOWLEDGE**: Research React form patterns, validation libraries
4. **PLAN**: Creates todo list with component structure, validation logic, styling
5. **EXECUTE**: Implements component with hooks, validation, error handling
6. **VERIFY**: Validates component functionality, accessibility, code quality
7. **DONE**: Complete React component with all requirements

### Example 2: Data Analysis Workflow

**Objective**: Analyze sales data and create insights

**JARVIS Workflow**:
```typescript
await mcp.callTool({
  name: "JARVIS",
  args: {
    initial_objective: "Analyze quarterly sales data to identify trends and create actionable insights"
  }
});
```

**Expected Flow**:
1. **QUERY**: Analyzes objective, detects `analyzer` role
2. **ENHANCE**: Adds statistical analysis, visualization, reporting requirements
3. **KNOWLEDGE**: Research analysis methodologies, visualization best practices
4. **PLAN**: Data cleaning, statistical analysis, visualization, insight generation
5. **EXECUTE**: Uses PythonComputationalTool for analysis and visualization
6. **VERIFY**: Validates analysis results, statistical significance
7. **DONE**: Complete analysis with insights and recommendations

## Individual Tool Examples

### JARVIS FSM Controller

#### Initialize New Session
```typescript
const response = await mcp.callTool({
  name: "JARVIS",
  args: {
    initial_objective: "Build a TypeScript API with authentication and testing"
  }
});

// Response includes:
// - next_phase: "QUERY"
// - system_prompt: Instructions for QUERY phase
// - session_id: Auto-generated unique identifier
// - allowed_next_tools: ["JARVIS"]
```

#### Continue Existing Session
```typescript
const response = await mcp.callTool({
  name: "JARVIS",
  args: {
    session_id: "session_1234567890_abc123",
    phase_completed: "QUERY",
    payload: {
      interpreted_goal: "Build secure TypeScript API with JWT authentication, comprehensive testing, and OpenAPI documentation",
      detected_role: "coder"
    }
  }
});

// Response includes:
// - next_phase: "ENHANCE"
// - system_prompt: Instructions for ENHANCE phase
// - payload: Accumulated session data
```

#### Session Diagnostics
```typescript
const response = await mcp.callTool({
  name: "JARVIS",
  args: {
    session_id: "session_1234567890_abc123",
    phase_completed: "VERIFY",
    payload: {
      diagnostic_request: true
    }
  }
});

// Response includes current session state, phase history, performance metrics
```

### APITaskAgent

#### Standard API Research
```typescript
const response = await mcp.callTool({
  name: "APITaskAgent",
  args: {
    objective: "Research current cryptocurrency market trends and pricing data",
    user_role: "analyzer",
    research_depth: "standard",
    validation_required: true,
    max_sources: 3
  }
});

// Response includes:
// - API discovery results
// - Data retrieval from 3 sources
// - Strategic analysis framework
// - Quality assessment and confidence scores
```

#### Comprehensive Financial Analysis
```typescript
const response = await mcp.callTool({
  name: "APITaskAgent",
  args: {
    objective: "Analyze technology stock performance across multiple markets for investment decision",
    user_role: "analyzer",
    research_depth: "comprehensive",
    category_filter: "financial",
    max_sources: 5,
    timeout_ms: 10000,
    validation_required: true
  }
});

// Response includes:
// - Multi-market data analysis
// - Cross-validation across 5 financial APIs
// - Statistical significance assessment
// - Investment recommendation framework
```

#### Quick Data Gathering
```typescript
const response = await mcp.callTool({
  name: "APITaskAgent",
  args: {
    objective: "Get latest weather data for dashboard display",
    user_role: "coder",
    research_depth: "light",
    max_sources: 2,
    category_filter: "weather"
  }
});

// Response includes:
// - Quick weather data retrieval
// - Format suitable for dashboard integration
// - Minimal processing overhead
```

### PythonComputationalTool

#### Data Analysis Operation
```typescript
const response = await mcp.callTool({
  name: "PythonComputationalTool",
  args: {
    operation: "data_analysis",
    input_data: "name,age,salary,department\nJohn,30,50000,Engineering\nJane,25,60000,Marketing\nBob,35,55000,Engineering\nAlice,28,65000,Marketing",
    parameters: {
      analysis_type: "descriptive",
      target_column: "salary",
      group_by: "department"
    }
  }
});

// Response includes:
// - Generated Python code for analysis
// - Library installation instructions
// - Execution-ready code for mcp__ide__executeCode
```

#### Machine Learning Pipeline
```typescript
const response = await mcp.callTool({
  name: "PythonComputationalTool",
  args: {
    operation: "machine_learning",
    input_data: csvData,
    parameters: {
      model_type: "classification",
      target_column: "category",
      test_size: 0.2,
      algorithms: ["random_forest", "svm", "logistic_regression"]
    }
  }
});

// Response includes:
// - Complete ML pipeline code
// - Model comparison and evaluation
// - Performance metrics and visualization
```

#### Web Scraping Operation
```typescript
const response = await mcp.callTool({
  name: "PythonComputationalTool",
  args: {
    operation: "web_scraping",
    input_data: "https://example.com/data-table",
    parameters: {
      selector: ".data-table tr",
      output_format: "csv",
      extract_links: true,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; DataScraper/1.0)"
      }
    }
  }
});

// Response includes:
// - Web scraping code with BeautifulSoup
// - Error handling and retry logic
// - Data cleaning and formatting
```

#### Custom Python Code
```typescript
const response = await mcp.callTool({
  name: "PythonComputationalTool",
  args: {
    operation: "custom",
    custom_code: `
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Create sample data
data = {'x': [1, 2, 3, 4, 5], 'y': [2, 5, 3, 8, 7]}
df = pd.DataFrame(data)

# Create visualization
plt.figure(figsize=(10, 6))
sns.scatterplot(data=df, x='x', y='y')
plt.title('Sample Data Visualization')
plt.show()

# Display statistics
print(df.describe())
`
  }
});

// Response includes:
// - Code with automatic library management
// - Visualization generation
// - Statistical output
```

### IronManusStateGraph

#### Initialize Session
```typescript
const response = await mcp.callTool({
  name: "IronManusStateGraph",
  args: {
    action: "initialize_session",
    session_id: "project_ecommerce_2024",
    objective: "Build complete e-commerce platform with authentication, payments, and admin dashboard",
    role: "coder"
  }
});

// Creates session state graph with initial entities and relationships
```

#### Record Phase Transition
```typescript
const response = await mcp.callTool({
  name: "IronManusStateGraph",
  args: {
    action: "record_phase_transition",
    session_id: "project_ecommerce_2024",
    from_phase: "PLAN",
    to_phase: "EXECUTE"
  }
});

// Records phase transition with timestamp and performance metrics
```

#### Read Session Graph
```typescript
const response = await mcp.callTool({
  name: "IronManusStateGraph",
  args: {
    action: "read_graph",
    session_id: "project_ecommerce_2024"
  }
});

// Returns complete session state including phases, tasks, and performance data
```

### HealthCheck

#### Basic Health Check
```typescript
const response = await mcp.callTool({
  name: "HealthCheck",
  args: {
    detailed: false
  }
});

// Returns:
// - System status summary
// - Core component health
// - Basic performance metrics
```

#### Detailed Diagnostics
```typescript
const response = await mcp.callTool({
  name: "HealthCheck",
  args: {
    detailed: true
  }
});

// Returns:
// - Comprehensive system analysis
// - Memory usage breakdown
// - Tool registry detailed status
// - Performance bottleneck identification
// - Security hook status
// - Recommendations for optimization
```

## Advanced Workflow Examples

### Example 1: Full-Stack Application Development

**Complete workflow for building a React + Node.js application**

```typescript
// 1. Initialize comprehensive development project
await mcp.callTool({
  name: "JARVIS",
  args: {
    initial_objective: "Build full-stack e-commerce application with React frontend, Node.js backend, PostgreSQL database, authentication, payment processing, and admin dashboard"
  }
});

// Expected workflow:
// - QUERY: Detects 'coder' role, analyzes full-stack requirements
// - ENHANCE: Adds testing, security, deployment, monitoring requirements
// - KNOWLEDGE: Research React patterns, Node.js architecture, database design
// - PLAN: Creates hierarchical task breakdown with meta-prompts:
//   * "(ROLE: ui_architect) (CONTEXT: ecommerce_frontend) (PROMPT: Design responsive React components for product catalog, cart, checkout) (OUTPUT: component_architecture)"
//   * "(ROLE: coder) (CONTEXT: nodejs_backend) (PROMPT: Build REST API with authentication, payments, order management) (OUTPUT: api_services)"
//   * "(ROLE: coder) (CONTEXT: postgresql_database) (PROMPT: Design normalized database schema with users, products, orders) (OUTPUT: database_schema)"
// - EXECUTE: Spawns specialized agents for each component
// - VERIFY: Validates integration, security, performance
// - DONE: Complete full-stack application
```

### Example 2: Data Science Research Project

**Comprehensive data analysis with machine learning**

```typescript
// 1. Initialize research project
await mcp.callTool({
  name: "JARVIS",
  args: {
    initial_objective: "Analyze customer behavior data to predict churn, identify key factors, and recommend retention strategies"
  }
});

// Expected workflow includes:
// - KNOWLEDGE phase uses APITaskAgent for external data sources
// - PLAN phase creates data analysis pipeline
// - EXECUTE phase uses PythonComputationalTool for:
//   * Data cleaning and preprocessing
//   * Exploratory data analysis
//   * Feature engineering
//   * Model training and evaluation
//   * Visualization and reporting
```

### Example 3: API Integration Project

**Research and integrate multiple APIs**

```typescript
// 1. Initialize API integration project
await mcp.callTool({
  name: "JARVIS",
  args: {
    initial_objective: "Research and integrate payment processing APIs (Stripe, PayPal, Square) with fallback handling and comprehensive error management"
  }
});

// During KNOWLEDGE phase, APITaskAgent is used:
await mcp.callTool({
  name: "APITaskAgent",
  args: {
    objective: "Research payment processing APIs focusing on integration complexity, fees, and reliability",
    user_role: "coder",
    research_depth: "comprehensive",
    category_filter: "financial",
    max_sources: 6,
    validation_required: true
  }
});

// Results inform PLAN phase for implementation strategy
```

## Meta-Prompt Examples

### Simple Meta-Prompt
```text
(ROLE: coder) (CONTEXT: react_authentication) (PROMPT: Create JWT login component with form validation and error handling) (OUTPUT: react_component)
```

**Generated Agent Behavior**:
- Focuses on React best practices
- Implements proper JWT handling
- Adds comprehensive form validation
- Includes error handling and user feedback
- Provides component documentation

### Complex Meta-Prompt
```text
(ROLE: ui_architect) (CONTEXT: dashboard_design) (PROMPT: Design responsive admin dashboard with navigation, real-time metrics, data tables, and chart visualization using modern UI principles and accessibility standards) (OUTPUT: design_specifications)
```

**Generated Agent Behavior**:
- Creates comprehensive UI/UX specifications
- Defines component hierarchy and relationships
- Specifies responsive breakpoints
- Includes accessibility considerations
- Provides wireframes and interaction patterns

### Multi-Agent Coordination
```text
Parent task creates multiple specialized agents:

(ROLE: researcher) (CONTEXT: market_analysis) (PROMPT: Research competitor analysis and market trends) (OUTPUT: research_report)

(ROLE: analyzer) (CONTEXT: financial_data) (PROMPT: Analyze revenue trends and performance metrics) (OUTPUT: financial_analysis)

(ROLE: synthesizer) (CONTEXT: business_strategy) (PROMPT: Integrate research and analysis into actionable business recommendations) (OUTPUT: strategic_recommendations)
```

## Migration Examples

### From Legacy Python Tools
```typescript
// OLD: Multiple separate tools
// PythonExecutor for simple code
await mcp.callTool({
  name: "PythonExecutor",
  args: { code: "import pandas as pd\nprint(pd.__version__)" }
});

// PythonDataAnalysis for analysis
await mcp.callTool({
  name: "PythonDataAnalysis",
  args: { data: csvData, analysis_type: "descriptive" }
});

// NEW: Single unified tool
await mcp.callTool({
  name: "PythonComputationalTool",
  args: {
    operation: "custom",
    custom_code: "import pandas as pd\nprint(pd.__version__)"
  }
});

await mcp.callTool({
  name: "PythonComputationalTool",
  args: {
    operation: "data_analysis",
    input_data: csvData,
    parameters: { analysis_type: "descriptive" }
  }
});
```

### From Legacy API Tools
```typescript
// OLD: Manual multi-step process
// Step 1: Search for APIs
const searchResult = await mcp.callTool({
  name: "APISearch",
  args: { objective: "cryptocurrency data", user_role: "analyzer" }
});

// Step 2: Validate APIs
const validationResult = await mcp.callTool({
  name: "APIValidator",
  args: { api_endpoint: searchResult.apis[0] }
});

// Step 3: Fetch data
const fetchResult = await mcp.callTool({
  name: "MultiAPIFetch",
  args: { api_endpoints: validationResult.validEndpoints }
});

// NEW: Single unified workflow
const result = await mcp.callTool({
  name: "APITaskAgent",
  args: {
    objective: "Research cryptocurrency market data with price trends and trading volumes",
    user_role: "analyzer",
    research_depth: "standard",
    validation_required: true,
    max_sources: 3
  }
});
```

## Error Handling Examples

### Handling FSM Errors
```typescript
try {
  const response = await mcp.callTool({
    name: "JARVIS",
    args: {
      session_id: "invalid_session",
      phase_completed: "NONEXISTENT_PHASE"
    }
  });
} catch (error) {
  // Response includes strategic error analysis:
  // - Assumption checking questions
  // - Intent clarification guidance
  // - Recovery suggestions
  // - Alternative approaches
}
```

### Handling API Research Errors
```typescript
const response = await mcp.callTool({
  name: "APITaskAgent",
  args: {
    objective: "Research non-existent API category",
    user_role: "analyzer",
    category_filter: "invalid_category"
  }
});

// Response includes:
// - Strategic error analysis
// - Alternative category suggestions
// - Research methodology guidance
// - Recovery strategies
```

### Handling Python Execution Errors
```typescript
const response = await mcp.callTool({
  name: "PythonComputationalTool",
  args: {
    operation: "custom",
    custom_code: "import non_existent_library\nprint('This will fail')"
  }
});

// Response includes:
// - Error analysis and explanation
// - Alternative library suggestions
// - Code correction guidance
// - Best practices recommendations
```

## Performance Optimization Examples

### Parallel API Research
```typescript
// Use APITaskAgent with comprehensive depth for parallel processing
const response = await mcp.callTool({
  name: "APITaskAgent",
  args: {
    objective: "Research multiple data sources for comprehensive market analysis",
    user_role: "analyzer",
    research_depth: "comprehensive",
    max_sources: 5,
    validation_required: true
  }
});

// APITaskAgent automatically handles parallel API calls for optimal performance
```

### Batch Python Operations
```typescript
// Combine multiple operations in single tool call
const response = await mcp.callTool({
  name: "PythonComputationalTool",
  args: {
    operation: "custom",
    custom_code: `
# Multiple operations in single execution
import pandas as pd
import matplotlib.pyplot as plt

# Data analysis
df = pd.read_csv('data.csv')
stats = df.describe()

# Visualization
plt.figure(figsize=(10, 6))
df.plot(kind='bar')
plt.title('Data Analysis Results')
plt.show()

# Export results
df.to_csv('processed_data.csv')
print('Analysis complete')
`
  }
});
```

## Best Practices Summary

### Tool Selection
1. **Use JARVIS for workflow orchestration** - Let FSM manage complex projects
2. **Use APITaskAgent for all API research** - Single tool replaces multiple manual steps
3. **Use PythonComputationalTool for all Python** - Unified interface with auto-management
4. **Use meta-prompts for complex tasks** - Enable specialized agent spawning

### Performance Optimization
1. **Leverage parallel processing** - APITaskAgent and PythonComputationalTool include built-in parallelization
2. **Use appropriate research depth** - Light for quick answers, comprehensive for critical research
3. **Batch operations** - Combine multiple tool calls when possible
4. **Monitor with HealthCheck** - Regular system health monitoring

### Error Recovery
1. **Trust strategic error guidance** - Tools provide intelligent recovery suggestions
2. **Use session isolation** - Start new sessions for different approaches
3. **Leverage rollback capabilities** - FSM automatically handles incomplete work
4. **Monitor performance** - Use diagnostic tools for optimization

These examples demonstrate the power and flexibility of the Iron Manus MCP unified tool system, showing how complex workflows can be managed through intelligent orchestration while maintaining clarity and purpose.