// Zod validation schemas for type safety
import { z } from 'zod';

// Phase enum validation
export const PhaseSchema = z.enum([
  'INIT',
  'QUERY',
  'ENHANCE',
  'KNOWLEDGE',
  'PLAN',
  'EXECUTE',
  'VERIFY',
  'DONE',
]);

// Role enum validation
export const RoleSchema = z.enum([
  'planner',
  'coder',
  'critic',
  'researcher',
  'analyzer',
  'synthesizer',
  'ui_architect',
  'ui_implementer',
  'ui_refiner',
]);

// Message JARVIS input validation
export const MessageJARVISSchema = z.object({
  session_id: z.string().min(1),
  phase_completed: PhaseSchema.optional(),
  initial_objective: z.string().optional(),
  payload: z.record(z.unknown()).optional(),
});

// From JARVIS output validation
export const FromJARVISSchema = z.object({
  next_phase: PhaseSchema,
  system_prompt: z.string().min(1),
  allowed_next_tools: z.array(z.string()),
  payload: z.record(z.unknown()).optional(),
  status: z.enum(['IN_PROGRESS', 'DONE', 'ERROR']),
});

// Meta-prompt validation
export const MetaPromptSchema = z.object({
  role_specification: z.string().min(1),
  context_parameters: z.record(z.unknown()),
  instruction_block: z.string().min(1),
  output_requirements: z.string().min(1),
});

// API fetch result validation
export const APIFetchResultSchema = z.object({
  source: z.string(),
  data: z.string(),
  confidence: z.number().min(0).max(1),
  success: z.boolean(),
  duration: z.number().min(0),
  error: z.string().optional(),
});

// Verification result validation
export const VerificationResultSchema = z.object({
  isValid: z.boolean(),
  completionPercentage: z.number().min(0).max(100),
  reason: z.string(),
  criticalTasksCompleted: z.number().min(0),
  totalCriticalTasks: z.number().min(0),
  taskBreakdown: z.object({
    completed: z.number().min(0),
    in_progress: z.number().min(0),
    pending: z.number().min(0),
    total: z.number().min(0),
  }),
});

// URL validation for SSRF protection
export const URLSchema = z.string().url();

// Configuration validation
export const ConfigSchema = z.object({
  KNOWLEDGE_MAX_CONCURRENCY: z.number().min(1).max(10),
  KNOWLEDGE_TIMEOUT_MS: z.number().min(1000).max(30000),
  KNOWLEDGE_CONFIDENCE_THRESHOLD: z.number().min(0).max(1),
  KNOWLEDGE_MAX_RESPONSE_SIZE: z.number().min(100),
  AUTO_CONNECTION_ENABLED: z.boolean(),
  RATE_LIMIT_REQUESTS_PER_MINUTE: z.number().min(1),
  RATE_LIMIT_WINDOW_MS: z.number().min(1000),
  MAX_CONTENT_LENGTH: z.number().min(1024),
  MAX_BODY_LENGTH: z.number().min(1024),
  VERIFICATION_COMPLETION_THRESHOLD: z.number().min(50).max(100),
  EXECUTION_SUCCESS_RATE_THRESHOLD: z.number().min(0).max(1),
  INITIAL_REASONING_EFFECTIVENESS: z.number().min(0).max(1),
  MIN_REASONING_EFFECTIVENESS: z.number().min(0).max(1),
  MAX_REASONING_EFFECTIVENESS: z.number().min(0).max(1),
  ALLOWED_HOSTS: z.array(z.string()),
  ENABLE_SSRF_PROTECTION: z.boolean(),
  USER_AGENT: z.string().min(1),
});

// Tool input validation schemas
export const PythonExecutorArgsSchema = z.object({
  code: z.string().min(1, 'Code cannot be empty'),
  setup_libraries: z.array(z.string()).optional(),
  description: z.string().optional(),
});

export const EnhancedPythonDataScienceArgsSchema = z.object({
  operation: z.enum([
    'web_scraping',
    'data_analysis',
    'visualization',
    'machine_learning',
    'custom',
  ]),
  input_data: z.string().optional(),
  parameters: z.record(z.unknown()).optional(),
  custom_code: z.string().optional(),
});

export const MultiAPIFetchArgsSchema = z.object({
  api_endpoints: z
    .array(z.string().url())
    .min(1, 'At least one API endpoint required')
    .max(10, 'Maximum 10 endpoints allowed'),
  timeout_ms: z.number().min(1000).max(30000).optional().default(5000),
  max_concurrent: z.number().min(1).max(5).optional().default(3),
  headers: z.record(z.string()).optional(),
});

export const APIValidatorArgsSchema = z.object({
  api_endpoint: z.object({
    name: z.string().min(1),
    url: z.string().url(),
    description: z.string().optional(),
    category: z.string().optional(),
  }),
  auto_correct: z.boolean().optional().default(true),
});

export const APISearchArgsSchema = z.object({
  objective: z.string().min(1, 'Objective cannot be empty'),
  user_role: z.enum([
    'planner',
    'coder',
    'critic',
    'researcher',
    'analyzer',
    'synthesizer',
    'ui_architect',
    'ui_implementer',
    'ui_refiner',
  ]),
  category_filter: z.string().optional(),
  max_results: z.number().min(1).max(20).optional().default(5),
});

export const StateGraphArgsSchema = z.object({
  action: z.enum([
    'create_entities',
    'create_transitions',
    'add_observations',
    'delete_entities',
    'delete_observations',
    'delete_transitions',
    'read_graph',
    'search_nodes',
    'open_nodes',
    'initialize_session',
    'record_phase_transition',
    'record_task_creation',
    'update_task_status',
  ]),
  session_id: z.string().min(1),
  content: z.string().optional(),
  entities: z
    .array(
      z.object({
        entityType: z.enum(['session', 'phase', 'task', 'role', 'api', 'performance']),
        name: z.string(),
        observations: z.array(z.string()).optional(),
      })
    )
    .optional(),
  from_phase: z.string().optional(),
  to_phase: z.string().optional(),
  names: z.array(z.string()).optional(),
  objective: z.string().optional(),
  observations: z
    .array(
      z.object({
        entityName: z.string(),
        contents: z.array(z.string()),
      })
    )
    .optional(),
  priority: z.string().optional(),
  query: z.string().optional(),
  role: z.string().optional(),
  status: z.string().optional(),
  task_id: z.string().optional(),
  transitions: z
    .array(
      z.object({
        from: z.string(),
        relationType: z.enum([
          'transitions_to',
          'spawns',
          'depends_on',
          'uses',
          'tracks',
          'contains',
        ]),
        to: z.string(),
      })
    )
    .optional(),
});

// Type exports for use in other modules
export type Phase = z.infer<typeof PhaseSchema>;
export type Role = z.infer<typeof RoleSchema>;
export type MessageJARVIS = z.infer<typeof MessageJARVISSchema>;
export type FromJARVIS = z.infer<typeof FromJARVISSchema>;
export type MetaPrompt = z.infer<typeof MetaPromptSchema>;
export type APIFetchResult = z.infer<typeof APIFetchResultSchema>;
export type VerificationResult = z.infer<typeof VerificationResultSchema>;

// Tool argument types
export type PythonExecutorArgs = z.infer<typeof PythonExecutorArgsSchema>;
export type EnhancedPythonDataScienceArgs = z.infer<typeof EnhancedPythonDataScienceArgsSchema>;
export type MultiAPIFetchArgs = z.infer<typeof MultiAPIFetchArgsSchema>;
export type APIValidatorArgs = z.infer<typeof APIValidatorArgsSchema>;
export type APISearchArgs = z.infer<typeof APISearchArgsSchema>;
export type StateGraphArgs = z.infer<typeof StateGraphArgsSchema>;
