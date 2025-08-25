# Iron Manus MCP Tools Documentation

## Overview

Iron Manus MCP provides a comprehensive suite of tools organized into logical categories for maximum clarity and maintainability. This document provides a complete guide to the tool ecosystem after the major consolidation and reorganization effort.

## 🎯 **Major Improvements Achieved**

### **Tool Consolidation Results**
- **Eliminated 75% Python tool redundancy**: 3 overlapping tools → 1 unified `PythonComputationalTool`
- **Created specialized API workflow**: Individual tools → `APITaskAgent` for complete API research
- **Organized by logical categories**: Flat structure → 5 clear categories
- **Maintained 100% functionality**: All capabilities preserved while reducing complexity

### **Architectural Benefits**
- **Reduced cognitive load**: Clear tool responsibilities eliminate decision paralysis
- **Improved maintainability**: Shared infrastructure reduces code duplication
- **Enhanced user experience**: Single tool calls replace complex orchestration
- **Better organization**: Logical categories make tool discovery intuitive

## 📁 **Tool Categories**

### **🎛️ Orchestration Tools** (`src/tools/orchestration/`)
**Purpose**: FSM control and workflow management

#### **JARVISTool**
- **Role**: Primary FSM controller and 8-phase agent loop orchestrator
- **Usage**: Handles all phase transitions, state management, and workflow orchestration
- **When to use**: Core tool for any FSM-based workflow execution
- **Integration**: Automatically used by INIT, QUERY, ENHANCE phases

#### **IronManusStateGraphTool**
- **Role**: Persistent state management using knowledge graphs
- **Usage**: Stores sessions, phases, tasks, transitions, and observations
- **When to use**: Automatic state persistence (rarely called directly)
- **Integration**: Used by FSM for state tracking and session management

---

### **🌐 API Tools** (`src/tools/api/`)
**Purpose**: External data access and manipulation

#### **APITaskAgent** ⭐ **(Recommended)**
- **Role**: Unified API research workflow (discovery → validation → fetching)
- **Usage**: Complete API research in single tool call with intelligent workflows
- **When to use**: Any time you need structured data from external APIs
- **Research depths**:
  - `light`: Quick answers from reliable sources
  - `standard`: Balanced research with validation (default)
  - `comprehensive`: Deep validation with alternative source exploration
- **Example**:
  ```typescript
  APITaskAgent({
    objective: "Research current AI model pricing across providers",
    user_role: "researcher",
    research_depth: "comprehensive",
    validation_required: true,
    max_sources: 5
  })
  ```

#### **Legacy API Tools** (Deprecated - use APITaskAgent instead)
- **APISearchTool**: Discovers relevant APIs (replaced by APITaskAgent discovery workflow)
- **APIValidatorTool**: Validates API endpoints (integrated into APITaskAgent validation)
- **MultiAPIFetchTool**: Fetches data from multiple endpoints (integrated into APITaskAgent fetching)

---

### **🧮 Computation Tools** (`src/tools/computation/`)
**Purpose**: Data processing and analysis

#### **PythonComputationalTool**
- **Role**: Unified Python execution and data science operations
- **Consolidates**: Former PythonExecutor, PythonDataAnalysis, EnhancedPythonDataScience
- **Operations**:
  - `web_scraping`: Extract data from websites using BeautifulSoup
  - `data_analysis`: Comprehensive analysis with pandas and numpy
  - `visualization`: Charts and plots with matplotlib and seaborn
  - `machine_learning`: ML models with scikit-learn
  - `custom`: User-provided Python code with library management
- **Features**:
  - Auto-generates production-ready code
  - Handles library installation automatically
  - Comprehensive error handling and security validation
  - Template-based code generation for common patterns

---

### **📄 Content Tools** (`src/tools/content/`)
**Purpose**: Content generation and presentation

#### **SlideGeneratorTool**
- **Role**: Core slide rendering engine for presentations
- **Usage**: Deterministic rendering while AI handles creative interpretation
- **Features**: Template-based generation, design options, session tracking
- **Integration**: Used by presentation pipeline executors

---

### **⚙️ System Tools** (`src/tools/system/`)
**Purpose**: Infrastructure and monitoring

#### **HealthCheckTool**
- **Role**: Comprehensive system health monitoring
- **Usage**: Production deployment monitoring and diagnostics
- **Checks**: Configuration validation, tool registry status, memory usage
- **When to use**: System diagnostics and health verification

---

## 🔄 **Tool Usage by FSM Phase**

### **INIT Phase**
- **Available**: `JARVIS`
- **Purpose**: Initialize session and detect user role

### **QUERY Phase**
- **Available**: `JARVIS`
- **Purpose**: Process user objective and prepare for enhancement

### **ENHANCE Phase**
- **Available**: `JARVIS`
- **Purpose**: Enhance objective with role-specific cognitive frameworks

### **KNOWLEDGE Phase** 🌟
- **Available**: `Task`, `WebSearch`, `WebFetch`, `APITaskAgent`, `mcp__ide__executeCode`, `PythonComputationalTool`, `JARVIS`
- **Purpose**: Parallel research and data gathering
- **Recommended workflow**:
  1. Use `APITaskAgent` for structured API research
  2. Use `WebSearch`/`WebFetch` for general web research
  3. Use `PythonComputationalTool` for data analysis
  4. Use `Task` for complex multi-step workflows

### **PLAN Phase**
- **Available**: `TodoWrite`
- **Purpose**: Create structured task planning

### **EXECUTE Phase**
- **Available**: `TodoRead`, `TodoWrite`, `Task`, `Bash`, `Read`, `Write`, `Edit`, `Browser`, `mcp__ide__executeCode`, `PythonComputationalTool`
- **Purpose**: Execute planned tasks with full tool access

### **VERIFY Phase**
- **Available**: `TodoRead`, `Read`, `mcp__ide__executeCode`, `PythonComputationalTool`
- **Purpose**: Verification and validation of completed work

### **DONE Phase**
- **Available**: None
- **Purpose**: Session completion

---

## 🚀 **Best Practices**

### **Tool Selection Guidelines**

#### **For API Research:**
✅ **Use `APITaskAgent`** - Handles complete workflow with validation
❌ Avoid using deprecated API tools - use `APITaskAgent` instead

#### **For Python Operations:**
✅ **Use `PythonComputationalTool`** - Unified interface for all Python needs
❌ Avoid thinking about separate data analysis vs execution tools

#### **For Web Research:**
✅ **Use `WebSearch`/`WebFetch`** - Direct web content research
✅ **Use `APITaskAgent`** - Structured data from APIs
❌ Don't use API tools for general web content

#### **For Complex Workflows:**
✅ **Use `Task` agents** - Multi-step workflows requiring context
✅ **Use direct tools** - Single-purpose operations
❌ Don't use Task agents for simple, direct operations

### **Performance Optimization**

#### **Parallel Operations**
- Use `APITaskAgent` with `research_depth: "comprehensive"` for maximum parallelism
- Batch multiple `WebSearch`/`WebFetch` calls in single responses
- Use `PythonComputationalTool` for concurrent data processing

#### **Resource Management**
- `APITaskAgent` includes built-in rate limiting and retry logic
- `PythonComputationalTool` handles library management automatically
- State persistence is automatic via `IronManusStateGraphTool`

---

## 🔧 **Implementation Details**

### **Shared Infrastructure**

#### **`src/utils/api-fetcher.ts`**
- Centralized HTTP request logic
- Used by all API tools for consistency
- Features: rate limiting, retries, SSRF protection, response sanitization

#### **`src/tools/base-tool.ts`**
- Abstract base class for all tools
- Provides consistent interface and validation
- Metaprompting-first error handling with strategic guidance

#### **`src/tools/tool-registry.ts`**
- Centralized tool registration and management
- Auto-discovery and initialization
- Type-safe tool access

### **Security Features**
- **SSRF Protection**: All HTTP requests validated and sanitized
- **Python Security**: Code validation and library allowlisting
- **Rate Limiting**: Automatic API rate limiting and retry logic
- **Input Validation**: Comprehensive argument validation for all tools

---

## 📊 **Migration Guide**

### **From Legacy Tools**

#### **Python Tools**
```typescript
// Old approach (deprecated)
PythonExecutor({ code: "print('hello')" })
PythonDataAnalysis({ data: csvData })
EnhancedPythonDataScience({ operation: "visualization" })

// New unified approach
PythonComputationalTool({ 
  operation: "custom", 
  custom_code: "print('hello')" 
})
PythonComputationalTool({ 
  operation: "data_analysis", 
  input_data: csvData 
})
PythonComputationalTool({ 
  operation: "visualization", 
  input_data: data 
})
```

#### **API Tools**
```typescript
// Old approach (complex orchestration)
const apis = await APISearch({ objective, user_role })
const validated = await APIValidator({ api_endpoint: apis[0] })
const data = await MultiAPIFetch({ api_endpoints: validatedUrls })

// New unified approach
const result = await APITaskAgent({
  objective: "Research market data",
  user_role: "analyzer",
  research_depth: "standard",
  validation_required: true
})
```

---

## 🎯 **Summary**

The Iron Manus MCP tool ecosystem now provides:

1. **🔄 Clear workflows**: Each tool has a specific, well-defined purpose
2. **🚀 Reduced complexity**: Major consolidation eliminated redundancy
3. **🎯 Better UX**: Single tool calls replace complex orchestration
4. **📚 Logical organization**: Category-based structure for easy discovery
5. **⚡ Enhanced performance**: Shared infrastructure and optimizations
6. **🔒 Built-in security**: Comprehensive validation and protection
7. **🧠 Metaprompting-first**: Strategic guidance for intelligent tool usage

The result is a more powerful, easier-to-use, and better-organized tool ecosystem that maintains the metaprompting-first design philosophy while dramatically improving usability and maintainability.