// Manus FSM Types - Accurate replication of Manus's 6-step agent loop + 3 modules + fractal orchestration

export type Phase = 
  | 'INIT' 
  | 'QUERY'      // Manus: "Analyze Events" 
  | 'ENHANCE'    // Manus: "Select Tools"
  | 'KNOWLEDGE'  // Manus: "Wait for Execution" (Knowledge Module)
  | 'PLAN'       // Manus: "Iterate" (Planner Module)
  | 'EXECUTE'    // Manus: "Submit Results" (Datasource Module)
  | 'VERIFY'     // Quality check
  | 'DONE';      // Manus: "Enter Standby"

// Role detection from Manus's modular architecture
export type Role = 
  | 'planner'     // Maps to Manus Planner Module
  | 'coder'       // Implementation and development
  | 'critic'      // Quality assessment and security
  | 'researcher'  // Maps to Manus Knowledge Module  
  | 'analyzer'    // Data analysis and insights
  | 'synthesizer'; // Integration and optimization

// Meta-prompt structure for fractal orchestration (Level 1 → Level 2 → Level 3)
export interface MetaPrompt {
  role_specification: string;    // (ROLE: agent_type)
  context_parameters: Record<string, any>; // (CONTEXT: domain_info)
  instruction_block: string;     // (PROMPT: "detailed_instructions")
  output_requirements: string;   // (OUTPUT: specific_deliverables)
}

// Enhanced TodoItem for fractal orchestration
export interface TodoItem {
  id: string;
  content: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  type?: 'TaskAgent' | 'SubAgent' | 'DirectExecution'; // Fractal level indicator
  meta_prompt?: MetaPrompt; // For Task() agent spawning
}

export interface ManusOrchestratorInput {
  session_id: string;
  phase_completed?: Phase;
  initial_objective?: string; // Only on first call
  payload?: Record<string, any>; // Phase-specific data (event stream simulation)
}

export interface ManusOrchestratorOutput {
  next_phase: Phase;
  system_prompt: string; // Role-enhanced, cognitively augmented prompt
  allowed_next_tools: string[]; // Tool gating - enforces "single tool per iteration"
  payload?: Record<string, any>; // Event stream data for next phase
  status: 'IN_PROGRESS' | 'DONE' | 'ERROR';
}

// Role configuration (extracted from messy implementation's ROLE_CONFIG)
export interface RoleConfig {
  defaultOutput: string;
  focus: string;
  complexityLevel: 'simple' | 'multi-step' | 'complex';
  suggestedFrameworks: string[];
  validationRules: string[];
  cognitiveFrameworks: string[];
  reasoningMultiplier: number; // 2.3x - 3.2x effectiveness
  authorityLevel: string;
}

export interface SessionState {
  current_phase: Phase;
  initial_objective: string;
  detected_role: Role; // Auto-detected from initial_objective
  payload: Record<string, any>; // Event stream simulation (includes current_task_index, current_todos)
  reasoning_effectiveness: number; // Performance tracking
  last_activity: number;
}

// Enhanced verification result with strict completion metrics
export interface VerificationResult {
  isValid: boolean;
  completionPercentage: number;
  reason: string;
  criticalTasksCompleted: number;
  totalCriticalTasks: number;
  taskBreakdown: {
    completed: number;
    in_progress: number;
    pending: number;
    total: number;
  };
}