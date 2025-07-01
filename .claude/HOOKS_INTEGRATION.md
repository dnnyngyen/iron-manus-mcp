# Iron Manus MCP + Claude Code Hooks Integration

This document explains how to integrate Claude Code hooks with the Iron Manus MCP system for enhanced security, quality assurance, and observability.

## Overview

The Iron Manus MCP hooks integration adds deterministic validation and automation around the sophisticated 8-phase FSM workflow, following the principle that **hooks handle "what" (rules) while the FSM handles "why" (strategy)**.

## Hook Components

### Sprint 1: Foundational Guardrails & Observability

#### 1. Security Validator (`security-validator.py`)
- **Type**: PreToolUse hook
- **Targets**: `Bash|mcp__iron-manus-mcp__MultiAPIFetch`
- **Purpose**: Blocks dangerous commands and enhances SSRF protection
- **Features**:
  - Validates bash commands against dangerous patterns (`rm -rf`, etc.)
  - Enhances existing SSRF protection with URL allowlist validation
  - Blocks execution with exit code 2 for security violations

#### 2. DevEx Workflow (`dev-workflow.sh`)
- **Type**: PostToolUse hook  
- **Targets**: `Write|Edit|MultiEdit`
- **Purpose**: Automated code quality assurance
- **Features**:
  - Auto-runs `npm run lint --fix` and `npm run format` on code files
  - Supports TypeScript, JavaScript, JSON, and Markdown files
  - Integrates with existing Iron Manus build pipeline

#### 3. Session Tracker (`session-tracker.py`)
- **Type**: PostToolUse hook
- **Targets**: `mcp__iron-manus-mcp__JARVIS`
- **Purpose**: FSM progression monitoring and performance tracking
- **Features**:
  - Logs all 8-phase FSM transitions with timestamps
  - Tracks reasoning effectiveness and session metrics
  - Provides session pattern analysis for optimization

### Sprint 2: Intelligent Feedback Loop

#### 4. API Validator (`api-validator.py`)
- **Type**: PreToolUse and PostToolUse hook
- **Targets**: `mcp__iron-manus-mcp__MultiAPIFetch`
- **Purpose**: Rate limiting enforcement and response quality scoring
- **Features**:
  - **PreToolUse**: Enforces rate limits using token bucket algorithm
  - **PostToolUse**: Scores API response quality and saves session metrics
  - Integrates with Iron Manus's existing 65+ API registry system

#### 5. Output Validator (`output-validator.py`)
- **Type**: PostToolUse hook
- **Targets**: `Write|Task|Edit`
- **Purpose**: Intelligent rollback signaling for quality control
- **Features**:
  - Validates code quality (TODOs, FIXMEs, security issues)
  - TypeScript-specific validation (any types, ts-ignore comments)
  - Returns structured JSON for blocking: `{"decision": "block", "reason": "details"}`

#### 6. VERIFY Phase Enhancement
- **File**: `src/core/prompts.ts`
- **Enhancement**: Added hook integration line to VERIFY phase prompt
- **Purpose**: Ensures Claude considers hook feedback in quality assessment

## Installation

### Step 1: Verify Scripts
Ensure all hook scripts are executable:
```bash
chmod +x scripts/iron-manus/*.py
chmod +x scripts/iron-manus/*.sh
```

### Step 2: Configure Hooks
1. Copy the example configuration:
```bash
cp .claude/hooks-example.json ~/.claude/settings.json
```

2. Or add to your existing Claude Code settings:
```json
{
  "hooks": {
    // ... paste contents from hooks-example.json
  }
}
```

### Step 3: Test Integration
Run a simple test to verify hooks are working:
```bash
echo '{"tool_name": "Bash", "tool_input": {"command": "echo test"}}' | scripts/iron-manus/security-validator.py
```

## Architecture Benefits

### Separation of Concerns
- **FSM (Cognitive Layer)**: Handles strategic reasoning and "why" decisions
- **Hooks (Deterministic Layer)**: Handle validation rules and "what" enforcement

### Enhanced Security
- SSRF protection enhancement beyond existing Iron Manus guards
- Command validation preventing destructive operations
- Security issue detection in code outputs

### Quality Assurance
- Automated code formatting and linting integration
- TypeScript quality validation with specific rules
- Intelligent rollback signaling for failed validations

### Observability
- Comprehensive FSM progression tracking
- API performance monitoring and scoring  
- Session pattern analysis for optimization

## Hook Execution Flow

### PreToolUse Flow
1. Claude creates tool parameters
2. Security Validator checks for dangerous patterns
3. API Validator enforces rate limits
4. If validation passes, tool executes normally
5. If validation fails, execution blocked with feedback to Claude

### PostToolUse Flow
1. Tool completes execution
2. DevEx Workflow auto-formats code files
3. Session Tracker logs FSM progression
4. API Validator scores response quality
5. Output Validator checks result quality
6. Results feed into VERIFY phase for intelligent rollback decisions

## Configuration Options

### Per-Project Settings
Place hooks configuration in `.claude/settings.json` for project-specific rules.

### User-Global Settings
Place hooks configuration in `~/.claude/settings.json` for system-wide rules.

### Environment Variables
Scripts respect Iron Manus environment variables:
- `ALLOWED_HOSTS`: For SSRF protection allowlist
- `ENABLE_SSRF_PROTECTION`: Enable/disable SSRF validation

## Integration with Iron Manus Features

### 8-Phase FSM
- Hooks observe and enhance each phase transition
- Session tracking provides comprehensive workflow visibility
- VERIFY phase integration ensures hook feedback is considered

### API Registry (65+ APIs)
- Rate limiting complements existing token bucket system
- Response scoring enhances knowledge synthesis quality
- Role-based API selection benefits from performance feedback

### Tool Architecture
- Hooks integrate seamlessly with modular BaseTool pattern
- MCP protocol compliance maintained throughout
- No disruption to existing JARVIS FSM controller

### Security System
- Enhances existing SSRF protection with additional validation
- Complements Iron Manus rate limiting and content size restrictions
- Adds command-level security validation

## Performance Impact

- **Minimal Overhead**: All hooks designed for sub-100ms execution
- **Async Execution**: PostToolUse hooks run in parallel where possible
- **Smart Caching**: Session data cached to temporary files for efficiency
- **Graceful Degradation**: Hook failures don't break FSM execution

## Debugging

### Hook Execution Logs
Check hook execution in Claude Code transcript mode (Ctrl-R).

### Session Tracking
View FSM progression logs:
```bash
tail -f ~/.claude/iron-manus-log.txt
```

### API Scores
Check API performance scores:
```bash
ls /tmp/iron-manus-sessions/
cat /tmp/iron-manus-sessions/[session_id]_api_scores.json
```

## Security Considerations

- All hooks execute with your user permissions
- Scripts validate input data and sanitize file paths
- SSRF protection applies to all hook-generated requests
- Hook commands are stored in settings files with restricted access

## Future Enhancements

- **Dynamic Threshold Adjustment**: Context-aware completion thresholds
- **ML-Powered Optimization**: Learning from hook feedback patterns
- **Advanced Analytics**: Real-time performance dashboards
- **Custom Rule Engine**: User-defined validation rules

This integration transforms Iron Manus MCP into a **hybrid cognitive-deterministic system** that maintains the sophisticated FSM reasoning while adding reliable, fast validation and enhancement services.