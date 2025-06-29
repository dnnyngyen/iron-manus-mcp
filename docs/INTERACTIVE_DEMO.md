# Interactive Demo: 6-Phase FSM Orchestration

This guide walks you through a complete Iron Manus MCP workflow, showing how the 6-phase FSM orchestrates complex tasks through Thread-of-Thought architecture.

## Demo Overview

**Objective**: Create a React authentication dashboard with user management  
**Expected Time**: 5-10 minutes to complete  
**What You'll See**: Autonomous phase transitions, agent spawning, and progressive workflow management

## Prerequisites

- Iron Manus MCP installed and configured
- Claude Code CLI active
- Basic familiarity with React (for context)

## Step-by-Step Walkthrough

### Step 1: Initialize the Workflow

Copy and paste this command into Claude Code:

```text
Use the JARVIS tool to create a React authentication dashboard with user management features including login, signup, user list, and profile editing
```

**Expected Response:**
```text
🚀 Iron Manus FSM initialized
📊 Session ID: [auto-generated]
🎯 Objective detected: React authentication dashboard
⚡ Role detected: UI_ARCHITECT
🔄 Entering Phase: QUERY
```

---

### Phase 1: QUERY (Analysis & Role Detection)

**What Happens:**
- System analyzes the request complexity
- Detects optimal role (UI_ARCHITECT for React dashboard)
- Initializes session state with FSM tracking

**Visual Indicators:**
```text
🔍 QUERY Phase Active
├── Analyzing request: "React authentication dashboard..."
├── Complexity assessment: HIGH (multiple components required)
├── Role optimization: UI_ARCHITECT selected
├── Technical requirements detected: React, auth, CRUD operations
└── ✅ Phase QUERY → ENHANCE transition ready
```

**User Action**: Watch the analysis complete automatically

---

### Phase 2: ENHANCE (Requirement Expansion)

**What Happens:**
- Adds missing technical specifications
- Identifies required technologies and dependencies
- Expands scope with security considerations

**Expected Output:**
```text
🔧 ENHANCE Phase Active
├── Adding technical requirements:
│   ├── Authentication: JWT tokens, secure storage
│   ├── State management: Context API or Redux
│   ├── UI framework: Material-UI or Tailwind
│   ├── Form validation: Formik + Yup
│   ├── API integration: Axios with error handling
│   └── Security: Input sanitization, CSRF protection
├── Enhanced objective: "React auth dashboard with JWT, user CRUD, responsive UI, form validation, error handling"
└── ✅ Phase ENHANCE → KNOWLEDGE transition ready
```

**User Action**: Review enhanced requirements - no input needed

---

### Phase 3: KNOWLEDGE (Research & API Discovery)

**What Happens:**
- Automatically searches API registry for authentication patterns
- Gathers React best practices and component patterns
- Collects security implementation examples

**Expected Output:**
```text
📚 KNOWLEDGE Phase Active
├── API Research:
│   ├── 🔍 Searching 65+ APIs for auth patterns...
│   ├── Found: JWT authentication examples
│   ├── Found: User management API patterns
│   └── Found: React security best practices
├── Knowledge synthesis:
│   ├── Authentication flow patterns
│   ├── React component architecture
│   ├── Form validation strategies
│   └── Security implementation guides
└── ✅ Phase KNOWLEDGE → PLAN transition ready
```

**User Action**: Watch automatic research completion

---

### Phase 4: PLAN (Task Decomposition & Agent Spawning)

**What Happens:**
- Breaks down project into specific tasks
- Creates meta-prompts for specialized agents
- Sets up hierarchical task structure with TodoWrite

**Expected Output:**
```text
📋 PLAN Phase Active
├── Task decomposition:
│   ├── 📝 Authentication components (Login, Signup, ProtectedRoute)
│   ├── 📝 User management (UserList, UserEdit, UserProfile)  
│   ├── 📝 State management setup (AuthContext, UserContext)
│   ├── 📝 API integration layer (auth service, user service)
│   └── 📝 Security implementation (validation, error handling)
├── Meta-prompt generation:
│   ├── (ROLE: ui_implementer) (CONTEXT: auth_components) (PROMPT: Create Login/Signup) (OUTPUT: react_components)
│   ├── (ROLE: coder) (CONTEXT: api_integration) (PROMPT: Build auth service) (OUTPUT: service_code)
│   └── (ROLE: ui_refiner) (CONTEXT: dashboard_polish) (PROMPT: Style and UX) (OUTPUT: styled_components)
└── ✅ Phase PLAN → EXECUTE transition ready
```

**User Action**: Review the planned task breakdown

---

### Phase 5: EXECUTE (Agent Orchestration)

**What Happens:**
- Spawns Task() agents with specialized roles
- Each agent works in parallel with dedicated context
- Agents can spawn their own sub-agents for complex work

**Expected Output:**
```text
⚡ EXECUTE Phase Active
├── 🤖 Spawning Agent: UI_IMPLEMENTER
│   ├── Context: React authentication components
│   ├── Task: Create Login, Signup, ProtectedRoute components
│   └── Status: Working... (dedicated context window)
├── 🤖 Spawning Agent: CODER  
│   ├── Context: API integration and services
│   ├── Task: Build authentication and user management services
│   └── Status: Working... (dedicated context window)
├── 🤖 Agent Reports:
│   ├── UI_IMPLEMENTER: "Login component completed with form validation"
│   ├── UI_IMPLEMENTER: "Signup component with error handling ready"
│   ├── CODER: "Auth service with JWT handling implemented"
│   └── CODER: "User CRUD service with error boundaries complete"
├── 🤖 Sub-agent spawned: UI_REFINER
│   ├── Spawned by: UI_IMPLEMENTER
│   ├── Task: Polish dashboard styling and responsive design
│   └── Status: Enhancing UI components...
└── ✅ All agents completed - Phase EXECUTE → VERIFY transition ready
```

**User Action**: Watch agents work autonomously - no input needed

---

### Phase 6: VERIFY (Quality Assurance & Completion)

**What Happens:**
- Validates all components were created
- Checks code quality and security implementation
- Ensures project requirements are met
- Provides final delivery summary

**Expected Output:**
```text
✅ VERIFY Phase Active  
├── Component validation:
│   ├── ✅ Login component with form validation
│   ├── ✅ Signup component with error handling  
│   ├── ✅ ProtectedRoute wrapper implemented
│   ├── ✅ UserList with pagination and search
│   ├── ✅ UserEdit with form validation
│   └── ✅ UserProfile with update functionality
├── Security validation:
│   ├── ✅ JWT token handling secure
│   ├── ✅ Input validation implemented
│   ├── ✅ Error boundaries in place
│   └── ✅ CSRF protection configured
├── Code quality check:
│   ├── ✅ TypeScript types defined
│   ├── ✅ Component structure clean
│   ├── ✅ State management organized
│   └── ✅ API integration robust
├── 📊 Completion rate: 95% (1 enhancement suggestion)
├── 💡 Enhancement: Add loading states for better UX
└── ✅ Project ready for development
```

**Final Output**: Complete React authentication dashboard code with all components

---

## What You Just Witnessed

### 🧠 Thread-of-Thought Orchestration in Action

1. **Context Segmentation**: Each phase operated with focused scope
2. **Agent Specialization**: UI_IMPLEMENTER and CODER worked with role-specific expertise  
3. **Fractal Delegation**: UI_REFINER was spawned autonomously for specialized polish
4. **Native Tool Integration**: TodoWrite/Task() handled all orchestration seamlessly

### 🔄 FSM State Management

- **Deterministic progression**: Each phase had clear entry/exit conditions
- **Quality gates**: Verification ensured completeness before transitions
- **Error handling**: FSM would handle failures gracefully (restart phases if needed)
- **State persistence**: Session maintained context across all phase transitions

### 🚀 Software 3.0 Principles Demonstrated

- **Natural language as executable code**: Your plain English became structured workflow
- **AI-driven architecture**: Claude orchestrated its own cognitive processes
- **Emergent intelligence**: Complex project emerged from simple tool interactions

## Try These Variations

### Simple Task (Quick Demo)
```text
Use JARVIS to create a todo list component with add/remove functionality
```
Expected: 3-4 phases, single agent, 2-3 minute completion

### Complex Task (Extended Demo)
```text
Use JARVIS to build a full-stack e-commerce platform with React frontend, Node.js backend, user authentication, product catalog, shopping cart, and payment integration
```
Expected: All 6 phases, multiple agent spawning, recursive task delegation

### Research Task (Knowledge-Heavy Demo)
```text
Use JARVIS to research and synthesize best practices for implementing microservices architecture with Docker and Kubernetes
```
Expected: Extended KNOWLEDGE phase, research agent spawning, comprehensive synthesis

## Understanding the Output

### Phase Indicators
- 🔍 **QUERY**: Analysis and role detection
- 🔧 **ENHANCE**: Requirement expansion  
- 📚 **KNOWLEDGE**: Research and information gathering
- 📋 **PLAN**: Task decomposition and meta-prompt creation
- ⚡ **EXECUTE**: Agent spawning and parallel execution
- ✅ **VERIFY**: Quality assurance and completion validation

### Agent Types You'll See
- **UI_ARCHITECT**: High-level UI design and component planning
- **UI_IMPLEMENTER**: React component implementation
- **UI_REFINER**: Styling and UX polish
- **CODER**: Backend services and API integration
- **PLANNER**: Project decomposition and strategy
- **CRITIC**: Security review and quality assessment

### Meta-Prompt Syntax
```text
(ROLE: agent_type) (CONTEXT: domain) (PROMPT: specific_task) (OUTPUT: deliverable_type)
```

## Troubleshooting Demo Issues

### Common Issues

**FSM doesn't start:**
```bash
# Verify MCP registration
/mcp
# Should show iron-manus-mcp listed
```

**Phases seem stuck:**
```text
# Check session status
Use JARVIS to show current session status and phase
```

**Agents not spawning:**
```text
# Verify TodoWrite capability
Create a simple todo item to test TodoWrite functionality
```

**For detailed troubleshooting**: See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## Next Steps

1. **Experiment with different objectives** to see FSM adaptability
2. **Try complex multi-step projects** to see recursive agent spawning
3. **Study the generated code** to understand quality standards
4. **Read [ARCHITECTURE.md](./ARCHITECTURE.md)** for technical implementation details

---

**Remember**: Iron Manus MCP demonstrates that sophisticated AI orchestration can emerge from elegant integration with Claude's native capabilities, using Thread-of-Thought architecture to manage complex cognitive workflows autonomously.