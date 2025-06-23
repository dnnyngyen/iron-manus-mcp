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
  | 'synthesizer' // Integration and optimization
  | 'ui_architect'   // V0-Style UI architecture and systematic design (3.1x multiplier)
  | 'ui_implementer' // V0-Style UI implementation with concurrent execution (2.8x multiplier)
  | 'ui_refiner';    // V0-Style UI refinement with Apple-Notion aesthetics (2.5x multiplier)

// Complexity levels for validation and processing
export enum ComplexityLevel {
  SIMPLE = 'simple',
  MODERATE = 'moderate', 
  COMPLEX = 'complex',
  ENTERPRISE = 'enterprise'
}

// Security levels for AST validation (moved from cognitive-ast.ts)
export enum SecurityLevel {
  TRUSTED = 'TRUSTED',
  SAFE = 'SAFE', 
  RESTRICTED = 'RESTRICTED',
  BLOCKED = 'BLOCKED'
}

// Deliverable types for output validation (moved from cognitive-ast.ts)
export enum DeliverableType {
  CODE = 'CODE',
  DOCUMENTATION = 'DOCUMENTATION',
  ANALYSIS = 'ANALYSIS',
  PLAN = 'PLAN',
  IMPLEMENTATION = 'IMPLEMENTATION',
  REVIEW = 'REVIEW',
  TESTING = 'TESTING',
  DEPLOYMENT = 'DEPLOYMENT'
}

// Basic validation interfaces for core modules (simplified from cognitive-ast.ts)
export interface ParseError {
  message: string;
  position: { start: number; end: number; line: number; column: number };
  severity: 'error' | 'warning' | 'info';
  code: string;
  suggestions: string[];
}

export interface ParseWarning {
  message: string;
  position: { start: number; end: number; line: number; column: number };
  code: string;
}

export enum InferredType {
  ROLE_REFERENCE = 'ROLE_REFERENCE',
  DOMAIN_CONTEXT = 'DOMAIN_CONTEXT',
  INSTRUCTION_SET = 'INSTRUCTION_SET',
  DELIVERABLE_SPEC = 'DELIVERABLE_SPEC',
  PARAMETER_VALUE = 'PARAMETER_VALUE'
}

export interface ValidationResult {
  isValid: boolean;
  errors: ParseError[];
  warnings: ParseWarning[];
  securityLevel: SecurityLevel;
  inferredTypes: Map<string, InferredType>;
  metadata: {
    validationTimeMs: number;
    rulesApplied: string[];
  };
}

// Basic AST types for core modules (simplified from cognitive-ast.ts)
export interface ASTNode {
  type: string;
  value?: string;
  children: ASTNode[];
  position: { start: number; end: number; line: number; column: number };
  metadata: {
    raw: string;
    validated: boolean;
    securityLevel: SecurityLevel;
  };
}

// Meta-prompt structure for fractal orchestration (Level 1 → Level 2 → Level 3)
export interface MetaPrompt {
  role_specification: string;    // (ROLE: agent_type)
  context_parameters: Record<string, any>; // (CONTEXT: domain_info)
  instruction_block: string;     // (PROMPT: "detailed_instructions")
  output_requirements: string;   // (OUTPUT: specific_deliverables)
}

// Enhanced TodoItem for fractal orchestration with Component-Cognitive Duality
export interface TodoItem {
  id: string;
  content: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  type?: 'TaskAgent' | 'SubAgent' | 'DirectExecution'; // Fractal level indicator
  meta_prompt?: MetaPrompt; // For Task() agent spawning
  
  // Component-Cognitive Duality Extensions
  duality_mode?: 'ui-generation' | 'cognitive-orchestration' | 'unified';
  component_mapping?: ComponentTaskMapping;  // V0 component correspondence
  constraint_level?: 'atomic' | 'component' | 'phase' | 'session';
}

// V0 Component mapping for duality support (moved to ComponentCognitiveDuality structure)

export interface MessageJARVIS {
  session_id: string;
  phase_completed?: Phase;
  initial_objective?: string; // Only on first call
  payload?: Record<string, any>; // Phase-specific data (event stream simulation)
}

export interface FromJARVIS {
  next_phase: Phase;
  system_prompt: string; // Role-enhanced, cognitively augmented prompt
  allowed_next_tools: string[]; // Tool gating - enforces "single tool per iteration"
  payload?: Record<string, any>; // Event stream data for next phase
  status: 'IN_PROGRESS' | 'DONE' | 'ERROR';
}

// Role configuration with explicit thinking methodologies
export interface RoleConfig {
  defaultOutput: string;
  focus: string;
  complexityLevel: 'simple' | 'multi-step' | 'complex';
  suggestedFrameworks: string[];
  validationRules: string[];
  thinkingMethodology: string[]; // Explicit thinking steps for quality reasoning
  reasoningMultiplier: number; // Psychological anchor (not mathematical)
  authorityLevel: string;
  cognitiveFrameworks?: string[]; // Optional cognitive frameworks for enhanced reasoning
}

export interface SessionState {
  current_phase: Phase;
  initial_objective: string;
  detected_role: Role; // Auto-detected from initial_objective
  payload: Record<string, any>; // Event stream simulation (includes current_task_index, current_todos)
  reasoning_effectiveness: number; // Performance tracking
  last_activity: number;
  
  // Component-Cognitive Duality Extensions
  duality_mode?: 'ui-generation' | 'cognitive-orchestration' | 'unified';
  ecosystem_mapping?: EcosystemSessionMapping; // V0 ecosystem correspondence
  performance_metrics?: DualityPerformanceMetrics; // Cross-mode performance tracking
}

// V0 Ecosystem mapping for session-level duality
export interface EcosystemSessionMapping {
  ecosystemName?: string;                      // Vercel deployment name
  deploymentStrategy?: string;                 // Production, preview, etc.
  projectPortfolio?: ProjectPhaseMapping[];    // Active projects
  integrationServices?: string[];              // External APIs, databases
  coherenceMode?: 'unified' | 'isolated';     // Cross-system consistency
}

// Project-Phase level mapping (legacy - moved to extracted ProjectPhaseMapping)

// Performance metrics for duality operations
export interface DualityPerformanceMetrics {
  cognitiveEffectiveness: number;              // 2.3x-3.2x multiplier
  componentGenerationSpeed?: number;           // Components/minute (UI mode)
  phaseTransitionEfficiency: number;           // Successful transitions/total
  systemCoherence: number;                     // Cross-mode consistency (0-1)
  dualityUtilization: number;                  // % time in unified mode
  modeSwitch_frequency: number;                // Switches per session
  modeSwitch_latency: number;                  // Average switch time (ms)
}

// ================================
// COMPONENT-COGNITIVE DUALITY STATE TYPES
// Supporting types for enhanced session management
// ================================

// ComponentCognitiveDuality moved to later in file with proper structure

// Extracted component task mapping interface
export interface ComponentTaskMapping {
  component_id: string;
  task_objective: string;
  constraint_hierarchy: UnifiedConstraint[];
  generation_pattern: 'atomic' | 'composite' | 'ecosystem';
  cognitive_enhancement: number;
}

// Extracted project phase mapping interface  
export interface ProjectPhaseMapping {
  project_scope: string;
  phase_sequence: Phase[];
  constraint_propagation: UnifiedConstraint[];
  integration_patterns: string[];
  orchestration_mode: 'sequential' | 'parallel' | 'fractal';
}

// Extracted ecosystem session mapping interface
export interface EcosystemSessionMapping {
  ecosystem_context: Record<string, any>;
  session_state: SessionState;
  global_constraints: UnifiedConstraint[];
  encapsulation_patterns: EncapsulationPattern[];
  cognitive_context: CognitiveContext;
}

export interface BaseConstraint {
  id: string;
  type: 'access' | 'mutation' | 'communication' | 'resource' | 'validation';
  scope: 'component' | 'project' | 'ecosystem' | 'phase' | 'session';
  rule: string;
  enforcement: 'error' | 'warning' | 'log';
  priority: number;
}

export interface EncapsulationPattern {
  pattern_name: string;
  isolation_level: 'strict' | 'permeable' | 'transparent';
  boundary_definition: string;
  interaction_protocols: string[];
  resource_limits: ResourceLimits;
}

export interface ResourceLimits {
  memory?: number;
  cpu?: number;
  network?: number;
  storage?: number;
}

export interface CognitiveContext {
  reasoning_mode: 'hybrid_duality' | 'component_focused' | 'cognitive_focused' | 'unified' | 'component_generation' | 'cognitive_orchestration';
  framework_selection: string[];
  constraint_resolution: 'strict' | 'adaptive' | 'permissive' | 'flexible';
  performance_metrics: ComponentCognitiveMetrics;
  duality_effectiveness: number;
}

export interface ComponentCognitiveMetrics {
  component_generation: {
    generation_speed: number;
    constraint_satisfaction: number;
    accessibility_score: number;
    reusability_index: number;
  };
  cognitive_orchestration: {
    reasoning_effectiveness: number;
    phase_transition_efficiency: number;
    task_completion_rate: number;
    fractal_orchestration_depth: number;
  };
  duality_synergy: {
    integration_coherence: number;
    constraint_unification: number;
    cross_domain_efficiency: number;
    architectural_elegance: number;
  };
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

// ============================================================================
// COMPONENT-COGNITIVE DUALITY MAPPING
// Unified constraint hierarchy bridging V0's Component→Project→Ecosystem 
// with Manus Task→Phase→Session patterns
// ============================================================================

// V0-inspired constraint types for component generation domain
export type ComponentConstraintType = 
  | 'framework'      // React, Vue, Svelte constraints
  | 'styling'        // Tailwind, Material UI, Chakra UI constraints  
  | 'accessibility'  // WAI-ARIA, WCAG compliance constraints
  | 'integration'    // Third-party library integration constraints
  | 'architecture'   // Component composition and hierarchy constraints
  | 'performance';   // Optimization and bundle size constraints

// Unified constraint hierarchy interface
export interface UnifiedConstraint {
  id: string;
  type: ComponentConstraintType;
  scope: 'component' | 'project' | 'ecosystem'; // V0 hierarchy levels
  cognitive_phase: Phase;                       // Manus phase mapping
  constraint_value: any;                        // Flexible constraint data
  priority: 'critical' | 'high' | 'medium' | 'low';
  validation_rules: string[];                   // Constraint validation logic
  dependency_graph: string[];                   // Inter-constraint dependencies
}

// Component-Cognitive duality mapping structure
export interface ComponentCognitiveDuality {
  // V0 Component ↔ Manus Task mapping
  component_task_mapping: ComponentTaskMapping;
  
  // V0 Project ↔ Manus Phase mapping  
  project_phase_mapping: ProjectPhaseMapping;
  
  // V0 Ecosystem ↔ Manus Session mapping
  ecosystem_session_mapping: EcosystemSessionMapping;
}

// V0 encapsulation patterns for integration
export interface EncapsulationPattern {
  pattern_type: 'functional_component' | 'custom_hook' | 'context_provider' | 'higher_order_component';
  scope_isolation: boolean;                    // Component scope isolation
  state_management: 'local' | 'context' | 'external'; // State encapsulation
  props_interface: Record<string, any>;       // Component API definition
  side_effect_management: string[];           // Hook and effect patterns
  constraint_enforcement: UnifiedConstraint[]; // Pattern-specific constraints
}

// Enhanced cognitive context for component-cognitive duality (merged definition)

// Unified performance metrics for both domains
export interface ComponentCognitiveMetrics {
  component_generation: {
    generation_speed: number;                  // Components per second
    constraint_satisfaction: number;          // Constraint compliance percentage
    accessibility_score: number;              // WCAG compliance score
    reusability_index: number;                // Component reuse potential
  };
  cognitive_orchestration: {
    reasoning_effectiveness: number;           // Manus reasoning multiplier
    phase_transition_efficiency: number;      // Phase completion speed
    task_completion_rate: number;             // Task success percentage
    fractal_orchestration_depth: number;      // Nested Task() agent levels
  };
  duality_synergy: {
    integration_coherence: number;            // System coherence score
    constraint_unification: number;          // Unified constraint effectiveness
    cross_domain_efficiency: number;         // Inter-domain operation efficiency
    architectural_elegance: number;          // Overall system design quality
  };
}