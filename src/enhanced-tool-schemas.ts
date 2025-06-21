// Enhanced Tool Schemas - Manus-Grade Advanced Parameterization
// Following Manus's sophisticated approach to tool parameterization and validation

import { z } from 'zod';

// ======================================================================
// ADVANCED TOOL PARAMETER SCHEMAS (Manus-Style)
// ======================================================================

// Session Management Schema with fine-grained control
const SessionConfigSchema = z.object({
  session_id: z.string()
    .min(8, "Session ID must be at least 8 characters")
    .regex(/^[a-zA-Z0-9-_]+$/, "Session ID must contain only alphanumeric characters, hyphens, and underscores"),
  
  session_timeout: z.number()
    .min(60, "Session timeout must be at least 60 seconds")
    .max(86400, "Session timeout cannot exceed 24 hours")
    .default(3600),
    
  persistence_mode: z.enum(['memory', 'disk', 'hybrid']).default('memory'),
  
  debug_level: z.enum(['silent', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  
  performance_tracking: z.object({
    enabled: z.boolean().default(true),
    metrics_collection: z.array(z.enum(['reasoning_effectiveness', 'phase_transitions', 'tool_usage', 'error_rates', 'response_times'])).default(['reasoning_effectiveness', 'phase_transitions']),
    sampling_rate: z.number().min(0.1).max(1.0).default(1.0)
  }).default({})
});

// Phase Completion Schema with validation
const PhaseCompletionSchema = z.object({
  phase: z.enum(['QUERY', 'ENHANCE', 'KNOWLEDGE', 'PLAN', 'EXECUTE', 'VERIFY']),
  
  completion_confidence: z.number()
    .min(0.0, "Confidence must be between 0.0 and 1.0")
    .max(1.0, "Confidence must be between 0.0 and 1.0")
    .default(0.8),
    
  validation_checks: z.object({
    input_validation: z.boolean().default(true),
    output_validation: z.boolean().default(true),
    semantic_validation: z.boolean().default(false),
    schema_validation: z.boolean().default(true)
  }).default({}),
  
  error_handling: z.object({
    retry_on_failure: z.boolean().default(true),
    max_retries: z.number().min(0).max(5).default(2),
    fallback_strategy: z.enum(['skip', 'manual', 'auto_correct', 'escalate']).default('auto_correct')
  }).default({})
});

// Payload Schema with sophisticated validation
const PayloadSchema = z.object({
  // Core data (required for most phases)
  content: z.any().optional(),
  
  // Phase-specific validation
  query_data: z.object({
    interpreted_goal: z.string().min(10, "Interpreted goal must be at least 10 characters"),
    goal_complexity: z.enum(['simple', 'moderate', 'complex', 'enterprise']).default('moderate'),
    domain_detection: z.array(z.enum(['web_dev', 'data_science', 'security', 'mobile', 'devops', 'ai_ml', 'backend', 'frontend'])).default([]),
    confidence_score: z.number().min(0).max(1).default(0.7)
  }).optional(),
  
  enhance_data: z.object({
    enhanced_goal: z.string().min(20, "Enhanced goal must be at least 20 characters"),
    added_requirements: z.array(z.string()).default([]),
    edge_cases_considered: z.array(z.string()).default([]),
    complexity_increase: z.number().min(1.0).max(5.0).default(1.5),
    framework_suggestions: z.array(z.string()).default([])
  }).optional(),
  
  knowledge_data: z.object({
    knowledge_gathered: z.string().optional(),
    external_research_needed: z.boolean().default(false),
    knowledge_sources: z.array(z.enum(['internal', 'web_search', 'documentation', 'api_reference', 'code_analysis'])).default(['internal']),
    research_queries: z.array(z.string()).default([]),
    knowledge_confidence: z.number().min(0).max(1).default(0.8)
  }).optional(),
  
  plan_data: z.object({
    plan_created: z.boolean().default(false),
    todos_with_metaprompts: z.array(z.string()).default([]),
    fractal_orchestration: z.object({
      enabled: z.boolean().default(true),
      max_depth: z.number().min(1).max(5).default(3),
      agent_spawning_threshold: z.number().min(0.1).max(1.0).default(0.7)
    }).default({}),
    estimated_completion_time: z.number().min(1).optional(),
    resource_requirements: z.array(z.string()).default([])
  }).optional(),
  
  execute_data: z.object({
    execution_success: z.boolean().default(false),
    current_task_index: z.number().min(0).default(0),
    current_task_completed: z.string().optional(),
    more_tasks_pending: z.boolean().default(true),
    fractal_delegation: z.string().optional(),
    deliverables: z.array(z.string()).default([]),
    execution_metrics: z.object({
      tasks_completed: z.number().min(0).default(0),
      tasks_failed: z.number().min(0).default(0),
      average_task_duration: z.number().min(0).optional(),
      resource_utilization: z.number().min(0).max(1).optional()
    }).default({})
  }).optional(),
  
  verify_data: z.object({
    verification_passed: z.boolean().default(false),
    quality_assessment: z.string().optional(),
    test_results: z.array(z.object({
      test_name: z.string(),
      status: z.enum(['passed', 'failed', 'skipped']),
      details: z.string().optional()
    })).default([]),
    performance_metrics: z.object({
      reasoning_effectiveness: z.string().optional(),
      task_completion_rate: z.string().optional(),
      quality_score: z.string().optional(),
      compliance_status: z.string().optional()
    }).default({})
  }).optional()
});

// Role Configuration Schema with advanced parameters
const RoleConfigurationSchema = z.object({
  role_override: z.enum(['planner', 'coder', 'critic', 'researcher', 'analyzer', 'synthesizer']).optional(),
  
  cognitive_enhancement: z.object({
    reasoning_multiplier: z.number().min(1.0).max(5.0).default(2.5),
    framework_specialization: z.array(z.string()).default([]),
    authority_level: z.enum(['OBSERVE', 'SUGGEST', 'IMPLEMENT', 'EVALUATE_AND_REFINE', 'AUTONOMOUS']).default('IMPLEMENT'),
    quality_threshold: z.enum(['BASIC', 'STANDARD', 'PROFESSIONAL', 'ENTERPRISE', 'RESEARCH_GRADE']).default('PROFESSIONAL')
  }).default({}),
  
  tool_preferences: z.object({
    preferred_tools: z.array(z.string()).default([]),
    restricted_tools: z.array(z.string()).default([]),
    tool_timeout: z.number().min(1000).max(300000).default(30000),
    parallel_execution: z.boolean().default(false)
  }).default({})
});

// Fractal Orchestration Schema
const FractalOrchestrationSchema = z.object({
  enabled: z.boolean().default(true),
  
  meta_prompt_generation: z.object({
    template_format: z.enum(['structured', 'natural', 'hybrid']).default('structured'),
    include_context: z.boolean().default(true),
    include_constraints: z.boolean().default(true),
    include_success_criteria: z.boolean().default(true)
  }).default({}),
  
  agent_spawning: z.object({
    auto_spawn_threshold: z.number().min(0.1).max(1.0).default(0.6),
    max_concurrent_agents: z.number().min(1).max(10).default(3),
    agent_timeout: z.number().min(30000).max(600000).default(120000),
    communication_protocol: z.enum(['synchronous', 'asynchronous', 'hybrid']).default('hybrid')
  }).default({}),
  
  task_delegation: z.object({
    complexity_threshold: z.number().min(0.1).max(1.0).default(0.5),
    delegation_strategy: z.enum(['breadth_first', 'depth_first', 'priority_based', 'load_balanced']).default('priority_based'),
    result_aggregation: z.enum(['sequential', 'parallel', 'streaming']).default('sequential')
  }).default({})
});

// ======================================================================
// MAIN TOOL SCHEMA - ENHANCED MANUS ORCHESTRATOR
// ======================================================================

export const EnhancedManusOrchestratorSchema = z.object({
  // Core required parameters
  session_id: z.string()
    .min(8, "Session ID must be at least 8 characters")
    .regex(/^[a-zA-Z0-9-_]+$/, "Session ID must contain only alphanumeric characters, hyphens, and underscores"),
    
  // Phase management
  phase_completed: z.enum(['QUERY', 'ENHANCE', 'KNOWLEDGE', 'PLAN', 'EXECUTE', 'VERIFY']).optional(),
  
  // Initial objective (required on first call)
  initial_objective: z.string()
    .min(10, "Initial objective must be at least 10 characters")
    .max(1000, "Initial objective cannot exceed 1000 characters")
    .optional(),
    
  // Enhanced payload with validation
  payload: PayloadSchema.optional(),
  
  // Session configuration
  session_config: SessionConfigSchema.optional(),
  
  // Role configuration
  role_config: RoleConfigurationSchema.optional(),
  
  // Fractal orchestration settings
  fractal_config: FractalOrchestrationSchema.optional(),
  
  // Advanced debugging and monitoring
  debug_options: z.object({
    enable_phase_logging: z.boolean().default(false),
    enable_performance_profiling: z.boolean().default(false),
    enable_tool_call_tracing: z.boolean().default(false),
    enable_state_snapshots: z.boolean().default(false),
    log_level: z.enum(['error', 'warn', 'info', 'debug', 'trace']).default('info')
  }).default({}),
  
  // Output customization
  output_preferences: z.object({
    format: z.enum(['standard', 'detailed', 'minimal', 'json']).default('standard'),
    include_metadata: z.boolean().default(true),
    include_performance_metrics: z.boolean().default(true),
    include_phase_history: z.boolean().default(false)
  }).default({})
});

// Export the inferred type
export type EnhancedManusOrchestratorInput = z.infer<typeof EnhancedManusOrchestratorSchema>;

// ======================================================================
// VALIDATION UTILITIES
// ======================================================================

export class ToolParameterValidator {
  static validateManusOrchestratorInput(input: unknown): EnhancedManusOrchestratorInput {
    try {
      return EnhancedManusOrchestratorSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
          code: err.code
        }));
        
        throw new Error(`Tool parameter validation failed:\n${JSON.stringify(formattedErrors, null, 2)}`);
      }
      throw error;
    }
  }
  
  static generateSchemaDocumentation(): string {
    return `
# Enhanced Manus Orchestrator Tool Schema

## Core Parameters

### session_id (required)
- **Type**: string
- **Constraints**: 8+ characters, alphanumeric with hyphens/underscores only
- **Purpose**: Unique session identifier for state management

### phase_completed (optional)
- **Type**: enum ['QUERY', 'ENHANCE', 'KNOWLEDGE', 'PLAN', 'EXECUTE', 'VERIFY']
- **Purpose**: Indicates which phase Claude just completed

### initial_objective (optional, required on first call)
- **Type**: string
- **Constraints**: 10-1000 characters
- **Purpose**: User's primary goal statement

## Advanced Configuration

### session_config
- **session_timeout**: Session duration (60-86400 seconds)
- **persistence_mode**: Storage strategy ('memory', 'disk', 'hybrid')
- **debug_level**: Logging verbosity
- **performance_tracking**: Metrics collection settings

### role_config
- **role_override**: Force specific role assignment
- **cognitive_enhancement**: Reasoning multipliers and frameworks
- **tool_preferences**: Tool allowlists/blocklists and timeouts

### fractal_config
- **meta_prompt_generation**: Template formatting options
- **agent_spawning**: Auto-spawn thresholds and limits
- **task_delegation**: Complexity-based delegation strategies

## Payload Structure (Phase-Specific)

Each phase has its own payload validation schema with appropriate constraints
and default values, ensuring data integrity throughout the FSM workflow.

## Benefits Over Basic Schema

1. **Input Validation**: Comprehensive parameter validation with detailed error messages
2. **Type Safety**: Full TypeScript support with inferred types
3. **Default Values**: Sensible defaults reduce parameter burden
4. **Extensibility**: Easy to add new parameters without breaking changes
5. **Documentation**: Self-documenting schema with constraints and purposes
6. **Error Handling**: Structured error reporting for debugging
`;
  }
}

// ======================================================================
// TOOL CALL TEMPLATES (Manus-Style)
// ======================================================================

export const ToolCallTemplates = {
  basic_initialization: {
    session_id: "demo-session-2025",
    initial_objective: "Create a comprehensive web application"
  },
  
  advanced_initialization: {
    session_id: "advanced-session-2025",
    initial_objective: "Build an enterprise-grade React application with authentication",
    session_config: {
      session_timeout: 7200,
      persistence_mode: "hybrid" as const,
      debug_level: "debug" as const,
      performance_tracking: {
        enabled: true,
        metrics_collection: ["reasoning_effectiveness", "phase_transitions", "tool_usage"] as const
      }
    },
    role_config: {
      cognitive_enhancement: {
        reasoning_multiplier: 3.0,
        authority_level: "AUTONOMOUS" as const,
        quality_threshold: "ENTERPRISE" as const
      }
    },
    fractal_config: {
      agent_spawning: {
        auto_spawn_threshold: 0.7,
        max_concurrent_agents: 5
      }
    }
  },
  
  phase_completion_template: {
    session_id: "session-id",
    phase_completed: "QUERY" as const,
    payload: {
      query_data: {
        interpreted_goal: "Build a secure web application with user authentication",
        goal_complexity: "complex" as const,
        domain_detection: ["web_dev", "security"] as const,
        confidence_score: 0.85
      }
    }
  }
};