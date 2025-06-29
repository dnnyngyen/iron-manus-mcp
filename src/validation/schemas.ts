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
  'DONE'
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
  'ui_refiner'
]);

// Message JARVIS input validation
export const MessageJARVISSchema = z.object({
  session_id: z.string().min(1),
  phase_completed: PhaseSchema.optional(),
  initial_objective: z.string().optional(),
  payload: z.record(z.any()).optional()
});

// From JARVIS output validation
export const FromJARVISSchema = z.object({
  next_phase: PhaseSchema,
  system_prompt: z.string().min(1),
  allowed_next_tools: z.array(z.string()),
  payload: z.record(z.any()).optional(),
  status: z.enum(['IN_PROGRESS', 'DONE', 'ERROR'])
});

// Meta-prompt validation
export const MetaPromptSchema = z.object({
  role_specification: z.string().min(1),
  context_parameters: z.record(z.any()),
  instruction_block: z.string().min(1),
  output_requirements: z.string().min(1)
});

// API fetch result validation
export const APIFetchResultSchema = z.object({
  source: z.string(),
  data: z.string(),
  confidence: z.number().min(0).max(1),
  success: z.boolean(),
  duration: z.number().min(0),
  error: z.string().optional()
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
    total: z.number().min(0)
  })
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
  USER_AGENT: z.string().min(1)
});

// Type exports for use in other modules
export type Phase = z.infer<typeof PhaseSchema>;
export type Role = z.infer<typeof RoleSchema>;
export type MessageJARVIS = z.infer<typeof MessageJARVISSchema>;
export type FromJARVIS = z.infer<typeof FromJARVISSchema>;
export type MetaPrompt = z.infer<typeof MetaPromptSchema>;
export type APIFetchResult = z.infer<typeof APIFetchResultSchema>;
export type VerificationResult = z.infer<typeof VerificationResultSchema>;