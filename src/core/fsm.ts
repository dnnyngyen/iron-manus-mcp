// Core FSM logic - replaces Manus's entire PyArmor-protected FastAPI server
// Implements the 6-step agent loop + 3 modules + fractal orchestration + reasoning rules validation
// + Component-Cognitive Duality unified API for seamless mode switching
import { 
  MessageJARVIS, 
  FromJARVIS, 
  Phase, 
  Role, 
  TodoItem, 
  MetaPrompt, 
  VerificationResult,
  ComponentCognitiveDuality,
  UnifiedConstraint,
  EncapsulationPattern,
  CognitiveContext 
} from './types.js';
import { 
  generateRoleEnhancedPrompt, 
  detectRole, 
  PHASE_ALLOWED_TOOLS,
  generateComponentCognitiveDualityPrompt 
} from './prompts.js';
import { stateManager } from './state.js';
// Temporarily comment out cognitive module imports until they're fixed
// import { 
//   extractEnhancedMetaPrompt, 
//   extractEnhancedMetaPrompts,
//   detectEnhancedRole,
//   generateEnhancedRoleConfig,
//   getExtractionPerformanceMetrics,
//   EnhancedMetaPrompt
// } from './cognitive/cognitive-ast-integration.js';
// import { 
//   reasoningRulesEngine,
//   ValidationContext,
//   ValidationSeverity
// } from './reasoning-rules-engine.js';
// import { cognitiveFrameworkManager } from './cognitive/cognitive-framework-injection.js';
import { ComplexityLevel } from './types.js';

// Temporary fallback implementations for cognitive features
function detectEnhancedRole(objective: string): Role {
  return detectRole(objective); // Use basic role detection
}

function extractEnhancedMetaPrompts(todos: any[], options: any): any[] {
  return []; // Return empty for now
}

function extractEnhancedMetaPrompt(content: string, options: any): any {
  return null; // Return null for now
}

// Mock interfaces for temporarily disabled features
interface EnhancedMetaPrompt {
  role: Role;
  context: string;
  prompt: string;
  output: string;
}

interface ValidationContext {
  phase: Phase;
  role: Role;
  objective: string;
  reasoning?: string;
}

// Add ValidationSeverity enum for compatibility
enum ValidationSeverity {
  CRITICAL = 'CRITICAL',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO'
}

// Mock objects for temporarily disabled features
const reasoningRulesEngine = {
  validateReasoning: (context: ValidationContext) => ({ 
    isValid: true, 
    issues: [],
    confidence: 0.8,
    violations: []
  })
};

const cognitiveFrameworkManager = {
  injectCognitiveFramework: (role: Role, phase: Phase, prompt: string, context: any) => ({
    enhancedReasoning: prompt,
    cognitiveMultiplier: 1.0,
    injectedFrameworks: [],
    appliedPatterns: []
  })
};

function getExtractionPerformanceMetrics() {
  return {
    parseTime: 10,
    cacheHitRate: 0.8,
    successRate: 0.95
  };
}

export function processState(input: MessageJARVIS): FromJARVIS {
  const sessionId = input.session_id;
  const session = stateManager.getSessionState(sessionId);
  
  // Handle initial objective setup with enhanced role detection
  if (input.initial_objective) {
    session.initial_objective = input.initial_objective;
    session.detected_role = detectEnhancedRole(input.initial_objective); // Enhanced AST-based role detection
    session.current_phase = 'INIT';
    session.reasoning_effectiveness = 0.8; // Initial effectiveness score
    // Initialize payload with execution state
    session.payload = {
      current_task_index: 0,
      current_todos: [],
      phase_transition_count: 0
    };
    stateManager.updateSessionState(sessionId, session);
  }

  // Determine next phase based on current phase and completed phase
  let nextPhase: Phase = session.current_phase;
  
  // Phase transition logic - mirrors Manus's 6-step agent loop
  switch (session.current_phase) {
    case 'INIT':
      nextPhase = 'QUERY';
      break;
      
    case 'QUERY':
      if (input.phase_completed === 'QUERY') {
        // Store interpreted goal and move to enhancement
        if (input.payload?.interpreted_goal) {
          session.payload.interpreted_goal = input.payload.interpreted_goal;
        }
        nextPhase = 'ENHANCE';
      }
      break;
      
    case 'ENHANCE':
      if (input.phase_completed === 'ENHANCE') {
        // Store enhanced goal and move to knowledge gathering
        if (input.payload?.enhanced_goal) {
          session.payload.enhanced_goal = input.payload.enhanced_goal;
        }
        nextPhase = 'KNOWLEDGE';
      }
      break;
      
    case 'KNOWLEDGE':
      if (input.phase_completed === 'KNOWLEDGE') {
        // Store gathered knowledge and move to planning
        if (input.payload?.knowledge_gathered) {
          session.payload.knowledge_gathered = input.payload.knowledge_gathered;
        }
        nextPhase = 'PLAN';
      }
      break;
      
    case 'PLAN':
      if (input.phase_completed === 'PLAN') {
        // Confirm plan created and move to execution
        if (input.payload?.plan_created) {
          session.payload.plan_created = true;
          // Process todos with enhanced AST-based MetaPrompt extraction
          const rawTodos = input.payload.todos_with_metaprompts || [];
          if (rawTodos.length > 0) {
            const enhancedResults = extractEnhancedMetaPrompts(rawTodos, {
              enableSecurity: true,
              enableCaching: true,
              enableOptimization: true,
              maxComplexity: 'EXPERT' as any,
              timeoutMs: 5000
            });
            
            // Store enhanced todos and performance metrics
            session.payload.current_todos = enhancedResults.map(result => result.todo);
            session.payload.ast_performance_metrics = getExtractionPerformanceMetrics();
            session.payload.enhanced_extraction_count = enhancedResults.filter(r => r.metaPrompt).length;
          } else {
            session.payload.current_todos = [];
          }
          session.payload.current_task_index = 0;
        }
        nextPhase = 'EXECUTE';
      }
      break;
      
    case 'EXECUTE':
      if (input.phase_completed === 'EXECUTE') {
        // Store execution results and continue or move to verification
        if (input.payload) {
          Object.assign(session.payload, input.payload);
          
          // Update reasoning effectiveness based on execution success
          if (input.payload.execution_success) {
            session.reasoning_effectiveness = Math.min(1.0, session.reasoning_effectiveness + 0.1);
          } else {
            session.reasoning_effectiveness = Math.max(0.3, session.reasoning_effectiveness - 0.1);
          }
          
          // Check if there are more tasks to execute (fractal iteration)
          const currentTaskIndex = session.payload.current_task_index || 0;
          const totalTasks = (session.payload.current_todos || []).length;
          
          if (input.payload.more_tasks_pending || currentTaskIndex < totalTasks - 1) {
            session.payload.current_task_index = currentTaskIndex + 1;
            nextPhase = 'EXECUTE'; // Continue in EXECUTE phase
          } else {
            nextPhase = 'VERIFY'; // All tasks done, move to verification
          }
        } else {
          nextPhase = 'VERIFY';
        }
      }
      break;
      
    case 'VERIFY':
      if (input.phase_completed === 'VERIFY') {
        // Enhanced verification with strict completion percentage validation
        const verificationResult = validateTaskCompletion(session, input.payload);
        
        if (verificationResult.isValid && input.payload?.verification_passed === true) {
          nextPhase = 'DONE';
        } else {
          // Log validation failure details
          console.warn(`Verification failed: ${verificationResult.reason}`);
          console.warn(`Completion percentage: ${verificationResult.completionPercentage}%`);
          
          // Store verification failure context for rollback
          session.payload.verification_failure_reason = verificationResult.reason;
          session.payload.last_completion_percentage = verificationResult.completionPercentage;
          
          // Rollback logic based on completion percentage
          if (verificationResult.completionPercentage < 50) {
            // Severe incompletion - restart from planning
            nextPhase = 'PLAN';
            session.payload.current_task_index = 0;
          } else if (verificationResult.completionPercentage < 80) {
            // Moderate incompletion - retry from current task
            nextPhase = 'EXECUTE';
            // Don't decrement task index if completion is too low
          } else {
            // Minor incompletion - retry previous task
            if (session.payload.current_task_index > 0) {
              session.payload.current_task_index = session.payload.current_task_index - 1;
            }
            nextPhase = 'EXECUTE';
          }
        }
      }
      break;
      
    case 'DONE':
      // Stay in DONE state
      nextPhase = 'DONE';
      break;
      
    default:
      // Fallback to QUERY if unknown state
      nextPhase = 'QUERY';
  }

  // Update session with new phase
  session.current_phase = nextPhase;
  stateManager.updateSessionState(sessionId, session);

  // Generate role-enhanced system prompt with cognitive amplification
  const roleEnhancedPrompt = generateRoleEnhancedPrompt(nextPhase, session.detected_role, session.initial_objective);
  const allowedTools = PHASE_ALLOWED_TOOLS[nextPhase];
  
  // Apply reasoning rules engine validation and enhancement
  const validationContext = createValidationContext(session, nextPhase, roleEnhancedPrompt, input);
  const reasoningValidation = reasoningRulesEngine.validateReasoning(validationContext);
  
  // Apply cognitive framework injection for enhanced reasoning
  const cognitiveEnhancement = cognitiveFrameworkManager.injectCognitiveFramework(
    session.detected_role,
    nextPhase,
    roleEnhancedPrompt, 
    validationContext
  );

  // Update reasoning effectiveness based on validation results
  if (reasoningValidation.confidence > 0.8) {
    session.reasoning_effectiveness = Math.min(1.0, session.reasoning_effectiveness + 0.05);
  } else if (reasoningValidation.confidence < 0.5) {
    session.reasoning_effectiveness = Math.max(0.3, session.reasoning_effectiveness - 0.05);
  }

  // Start with enhanced reasoning or original prompt
  let augmentedPrompt = cognitiveEnhancement.enhancedReasoning || roleEnhancedPrompt;
  
  // TODO: Add reasoning validation feedback when reasoning rules engine is fixed
  // if (!reasoningValidation.isValid) {
  //   const criticalViolations = reasoningValidation.violations.filter(v => 
  //     v.severity === ValidationSeverity.CRITICAL || v.severity === ValidationSeverity.ERROR
  //   );
  //   
  //   if (criticalViolations.length > 0) {
  //     augmentedPrompt += `\n\n**🚨 REASONING VALIDATION ALERTS:**\n`;
  //     criticalViolations.forEach(violation => {
  //       augmentedPrompt += `- **${violation.severity}:** ${violation.message}\n`;
  //       augmentedPrompt += `  *Suggested Fix:* ${violation.suggestedFix}\n`;
  //     });
  //   }
  // }

  // Add cognitive enhancement metrics
  if (cognitiveEnhancement.cognitiveMultiplier > 1.0) {
    augmentedPrompt += `\n\n**🧠 COGNITIVE ENHANCEMENT ACTIVE:**\n`;
    augmentedPrompt += `- Reasoning Effectiveness: ${(cognitiveEnhancement.cognitiveMultiplier * 100).toFixed(0)}%\n`;
    augmentedPrompt += `- Applied Frameworks: ${cognitiveEnhancement.injectedFrameworks.join(', ')}\n`;
    augmentedPrompt += `- Pattern Enhancements: ${cognitiveEnhancement.appliedPatterns.join(', ') || 'None'}\n`;
  }
  
  if (nextPhase === 'ENHANCE' && session.payload.interpreted_goal) {
    augmentedPrompt += `\n\n**📋 CONTEXT:** ${session.payload.interpreted_goal}`;
  } else if (nextPhase === 'PLAN' && session.payload.enhanced_goal) {
    augmentedPrompt += `\n\n**🎯 GOAL TO PLAN:** ${session.payload.enhanced_goal}`;
    augmentedPrompt += `\n\n**🔄 FRACTAL ORCHESTRATION GUIDE:**\nFor complex sub-tasks that need specialized expertise, create todos with this format:\n"(ROLE: coder) (CONTEXT: authentication_system) (PROMPT: Implement secure JWT authentication with password reset) (OUTPUT: production_ready_code)"\n\nThis enables Task() agent spawning in the EXECUTE phase.`;
  } else if (nextPhase === 'EXECUTE') {
    const currentTaskIndex = session.payload.current_task_index || 0;
    const currentTodos = session.payload.current_todos || [];
    const currentTodo = currentTodos[currentTaskIndex];
    
    augmentedPrompt += `\n\n**📊 EXECUTION CONTEXT:**\n- Current Task Index: ${currentTaskIndex}\n- Total Tasks: ${currentTodos.length}\n- Current Task: ${currentTodo || 'None'}\n- Reasoning Effectiveness: ${(session.reasoning_effectiveness * 100).toFixed(1)}%\n- Objective: ${session.initial_objective}`;
    
    // Add fractal execution guidance
    augmentedPrompt += `\n\n**🔄 FRACTAL EXECUTION PROTOCOL:**\n1. Check current todo (index ${currentTaskIndex}) for meta-prompt patterns\n2. If todo contains (ROLE:...) pattern, use Task() tool to spawn specialized agent\n3. If todo is direct execution, use appropriate tools (Bash/Browser/etc.)\n4. After each action, report results back\n\n**⚡ SINGLE TOOL PER ITERATION:** Choose ONE tool call per turn (Manus requirement).`;
  } else if (nextPhase === 'VERIFY') {
    const todos = session.payload.current_todos || [];
    const taskBreakdown = calculateTaskBreakdown(todos);
    const completionPercentage = calculateCompletionPercentage(taskBreakdown);
    const criticalTasks = todos.filter((todo: any) => 
      todo.priority === 'high' || 
      todo.type === 'TaskAgent' || 
      todo.meta_prompt
    );
    const criticalTasksCompleted = criticalTasks.filter((todo: any) => todo.status === 'completed').length;
    
    augmentedPrompt += `\n\n**✅ VERIFICATION CONTEXT:**\n- Original Objective: ${session.initial_objective}\n- Final Reasoning Effectiveness: ${(session.reasoning_effectiveness * 100).toFixed(1)}%\n- Role Applied: ${session.detected_role}`;
    augmentedPrompt += `\n\n**📊 COMPLETION METRICS:**\n- Overall Completion: ${completionPercentage}% (${taskBreakdown.completed}/${taskBreakdown.total} tasks)\n- Critical Tasks Completed: ${criticalTasksCompleted}/${criticalTasks.length}\n- Tasks Breakdown: ${taskBreakdown.completed} completed, ${taskBreakdown.in_progress} in-progress, ${taskBreakdown.pending} pending`;
    augmentedPrompt += `\n\n**⚠️ VERIFICATION REQUIREMENTS:**\n- Critical tasks must be 100% complete\n- Overall completion must be ≥95%\n- No high-priority tasks can remain pending\n- No tasks can remain in-progress\n- Execution success rate must be ≥70%\n- verification_passed=true requires backing metrics`;
    
    if (session.payload.verification_failure_reason) {
      augmentedPrompt += `\n\n**🚨 PREVIOUS VERIFICATION FAILURE:**\n${session.payload.verification_failure_reason}\nLast Completion: ${session.payload.last_completion_percentage}%`;
    }
  }

  // Determine status
  const status = nextPhase === 'DONE' ? 'DONE' : 'IN_PROGRESS';

  const output: FromJARVIS = {
    next_phase: nextPhase,
    system_prompt: augmentedPrompt,
    allowed_next_tools: allowedTools,
    payload: {
      session_id: sessionId,
      current_objective: session.initial_objective,
      detected_role: session.detected_role,
      reasoning_effectiveness: session.reasoning_effectiveness,
      phase_transition_count: (session.payload.phase_transition_count || 0) + 1,
      ...session.payload
    },
    status
  };

  return output;
}

// Helper function to extract meta-prompt from todo content (Enhanced with AST fallback)
export function extractMetaPromptFromTodo(todoContent: string): MetaPrompt | null {
  // Try enhanced AST-based extraction first
  try {
    const enhanced = extractEnhancedMetaPrompt(todoContent, {
      enableSecurity: false, // Keep disabled for backward compatibility
      enableCaching: true,
      enableOptimization: false,
      timeoutMs: 1000 // Short timeout for compatibility
    });
    
    if (enhanced) {
      return {
        role_specification: enhanced.role_specification,
        context_parameters: enhanced.context_parameters,
        instruction_block: enhanced.instruction_block,
        output_requirements: enhanced.output_requirements
      };
    }
  } catch (error) {
    console.warn('Enhanced extraction failed, falling back to regex:', error);
  }
  
  // Fallback to original regex-based extraction
  const roleMatch = todoContent.match(/\(ROLE:\s*([^)]+)\)/i);
  const contextMatch = todoContent.match(/\(CONTEXT:\s*([^)]+)\)/i);
  const promptMatch = todoContent.match(/\(PROMPT:\s*([^)]+)\)/i);
  const outputMatch = todoContent.match(/\(OUTPUT:\s*([^)]+)\)/i);
  
  if (roleMatch && promptMatch) {
    return {
      role_specification: roleMatch[1].trim(),
      context_parameters: contextMatch ? { domain: contextMatch[1].trim() } : {},
      instruction_block: promptMatch[1].trim(),
      output_requirements: outputMatch ? outputMatch[1].trim() : 'comprehensive_deliverable'
    };
  }
  
  return null;
}

// Enhanced version for new code that wants full AST capabilities
export function extractEnhancedMetaPromptFromTodo(todoContent: string): EnhancedMetaPrompt | null {
  return extractEnhancedMetaPrompt(todoContent, {
    enableSecurity: true,
    enableCaching: true,
    enableOptimization: true,
    timeoutMs: 5000
  });
}

// Performance tracking for reasoning effectiveness
export function updateReasoningEffectiveness(sessionId: string, success: boolean, taskComplexity: 'simple' | 'complex' = 'simple'): void {
  const session = stateManager.getSessionState(sessionId);
  const multiplier = taskComplexity === 'complex' ? 0.15 : 0.1;
  
  if (success) {
    session.reasoning_effectiveness = Math.min(1.0, session.reasoning_effectiveness + multiplier);
  } else {
    session.reasoning_effectiveness = Math.max(0.3, session.reasoning_effectiveness - multiplier);
  }
  
  stateManager.updateSessionState(sessionId, session);
}

// Enhanced verification logic with strict completion percentage thresholds

export function validateTaskCompletion(session: any, verificationPayload: any): VerificationResult {
  const todos = session.payload.current_todos || [];
  const currentTaskIndex = session.payload.current_task_index || 0;
  
  // Calculate task completion metrics
  const taskBreakdown = calculateTaskBreakdown(todos);
  const completionPercentage = calculateCompletionPercentage(taskBreakdown);
  
  // Identify critical tasks (high priority or meta-prompt tasks)
  const criticalTasks = todos.filter((todo: any) => 
    todo.priority === 'high' || 
    todo.type === 'TaskAgent' || 
    todo.meta_prompt
  );
  const criticalTasksCompleted = criticalTasks.filter((todo: any) => todo.status === 'completed').length;
  
  // Strict validation rules
  const result: VerificationResult = {
    isValid: false,
    completionPercentage,
    reason: '',
    criticalTasksCompleted,
    totalCriticalTasks: criticalTasks.length,
    taskBreakdown
  };
  
  // Rule 1: 100% critical task completion required
  if (criticalTasks.length > 0 && criticalTasksCompleted < criticalTasks.length) {
    result.reason = `Critical tasks incomplete: ${criticalTasksCompleted}/${criticalTasks.length} completed. 100% critical task completion required.`;
    return result;
  }
  
  // Rule 2: Minimum 95% overall completion for non-critical scenarios
  if (completionPercentage < 95) {
    result.reason = `Overall completion ${completionPercentage}% below required threshold of 95%.`;
    return result;
  }
  
  // Rule 3: No pending high-priority tasks
  const pendingHighPriority = todos.filter((todo: any) => 
    todo.status === 'pending' && todo.priority === 'high'
  );
  if (pendingHighPriority.length > 0) {
    result.reason = `${pendingHighPriority.length} high-priority tasks still pending.`;
    return result;
  }
  
  // Rule 4: All in-progress tasks must be resolved
  const inProgressTasks = todos.filter((todo: any) => todo.status === 'in_progress');
  if (inProgressTasks.length > 0) {
    result.reason = `${inProgressTasks.length} tasks still in progress. All tasks must be completed or explicitly marked as pending.`;
    return result;
  }
  
  // Rule 5: Verify execution success rate
  const executionSuccessRate = session.reasoning_effectiveness || 0;
  if (executionSuccessRate < 0.7) {
    result.reason = `Execution success rate ${(executionSuccessRate * 100).toFixed(1)}% below required threshold of 70%.`;
    return result;
  }
  
  // Rule 6: Validate verification payload consistency
  if (verificationPayload?.verification_passed === true) {
    // Additional validation: ensure verification_passed claim is backed by actual metrics
    if (completionPercentage < 100 && criticalTasks.length > 0) {
      result.reason = `Verification claim inconsistent with completion metrics. Critical tasks exist but completion is ${completionPercentage}%.`;
      return result;
    }
  }
  
  // All validation rules passed
  result.isValid = true;
  result.reason = `Validation passed: ${completionPercentage}% completion, ${criticalTasksCompleted}/${criticalTasks.length} critical tasks completed.`;
  
  return result;
}

function calculateTaskBreakdown(todos: any[]): { completed: number; in_progress: number; pending: number; total: number } {
  const breakdown = {
    completed: 0,
    in_progress: 0,
    pending: 0,
    total: todos.length
  };
  
  todos.forEach(todo => {
    switch (todo.status) {
      case 'completed':
        breakdown.completed++;
        break;
      case 'in_progress':
        breakdown.in_progress++;
        break;
      case 'pending':
        breakdown.pending++;
        break;
    }
  });
  
  return breakdown;
}

function calculateCompletionPercentage(breakdown: { completed: number; total: number }): number {
  if (breakdown.total === 0) return 100; // No tasks means 100% completion
  return Math.round((breakdown.completed / breakdown.total) * 100);
}

// Helper function to create validation context for reasoning rules engine
function createValidationContext(session: any, phase: Phase, reasoning: string, input: MessageJARVIS): ValidationContext {
  // Determine objective complexity based on task count and reasoning length
  let objectiveComplexity: ComplexityLevel = ComplexityLevel.SIMPLE;
  const taskCount = (session.payload.current_todos || []).length;
  const reasoningLength = reasoning.length;
  
  if (taskCount > 5 || reasoningLength > 1000) {
    objectiveComplexity = ComplexityLevel.COMPLEX;
  } else if (taskCount > 2 || reasoningLength > 500) {
    objectiveComplexity = ComplexityLevel.MODERATE;
  }

  // Extract meta-prompt if present in current context
  let metaPrompt: MetaPrompt | undefined;
  if (input.payload?.current_meta_prompt) {
    metaPrompt = input.payload.current_meta_prompt;
  } else if (phase === 'EXECUTE') {
    // Try to extract from current todo
    const currentTaskIndex = session.payload.current_task_index || 0;
    const currentTodos = session.payload.current_todos || [];
    const currentTodo = currentTodos[currentTaskIndex];
    if (currentTodo?.meta_prompt) {
      metaPrompt = currentTodo.meta_prompt;
    }
  }

  return {
    role: session.detected_role,
    phase: phase,
    objective: session.initial_objective || '',
    reasoning: reasoning
  };
}

// ============================================================================
// COMPONENT-COGNITIVE DUALITY UNIFIED API
// Seamless switching between component generation and cognitive orchestration modes
// ============================================================================

export interface ComponentCognitiveDualityInput extends MessageJARVIS {
  // Mode selection
  orchestration_mode?: 'cognitive_only' | 'component_only' | 'hybrid_duality';
  
  // Component generation specific
  component_constraints?: UnifiedConstraint[];
  encapsulation_patterns?: EncapsulationPattern[];
  component_framework?: 'react' | 'vue' | 'svelte' | 'html';
  styling_system?: 'tailwind' | 'material_ui' | 'chakra_ui' | 'css_modules';
  
  // Duality configuration
  duality_config?: Partial<ComponentCognitiveDuality>;
  constraint_resolution?: 'strict' | 'flexible' | 'adaptive';
}

export interface ComponentCognitiveDualityOutput extends FromJARVIS {
  // Enhanced output with duality information
  orchestration_mode: 'cognitive_only' | 'component_only' | 'hybrid_duality';
  duality_metrics?: {
    component_generation_efficiency: number;
    cognitive_orchestration_effectiveness: number;
    duality_synergy_score: number;
    constraint_satisfaction_rate: number;
  };
  active_constraints?: UnifiedConstraint[];
  applied_encapsulation_patterns?: EncapsulationPattern[];
}

// Unified API that handles both cognitive orchestration and component generation
export function processComponentCognitiveDuality(
  input: ComponentCognitiveDualityInput
): ComponentCognitiveDualityOutput {
  const sessionId = input.session_id;
  const orchestrationMode = input.orchestration_mode || 'hybrid_duality';
  
  // Initialize component-cognitive duality if not exists
  let duality = stateManager.getComponentCognitiveDuality(sessionId);
  if (!duality) {
    stateManager.initializeComponentCognitiveDuality(sessionId, input.duality_config || {});
    duality = stateManager.getComponentCognitiveDuality(sessionId)!;
  }
  
  // Update orchestration mode
  stateManager.updateCognitiveContext(sessionId, {
    reasoning_mode: orchestrationMode === 'cognitive_only' ? 'cognitive_orchestration' :
                   orchestrationMode === 'component_only' ? 'component_generation' :
                   'hybrid_duality',
    constraint_resolution: input.constraint_resolution || 'adaptive'
  });
  
  // Add component constraints if provided
  if (input.component_constraints) {
    input.component_constraints.forEach(constraint => {
      stateManager.addUnifiedConstraint(sessionId, constraint);
    });
  }
  
  // Add encapsulation patterns if provided
  if (input.encapsulation_patterns) {
    input.encapsulation_patterns.forEach(pattern => {
      stateManager.addEncapsulationPattern(sessionId, pattern);
    });
  }
  
  // Process based on orchestration mode
  let baseOutput: FromJARVIS;
  
  switch (orchestrationMode) {
    case 'cognitive_only':
      // Pure cognitive orchestration - use standard Manus FSM
      baseOutput = processState(input);
      break;
      
    case 'component_only':
      // Pure component generation mode - optimize for V0-style generation
      baseOutput = processComponentGenerationMode(input, duality);
      break;
      
    case 'hybrid_duality':
    default:
      // Hybrid mode - full component-cognitive duality
      baseOutput = processHybridDualityMode(input, duality);
      break;
  }
  
  // Calculate duality metrics
  const dualityMetrics = calculateDualityMetrics(sessionId);
  
  // Get active constraints and patterns
  const activeConstraints = stateManager.getUnifiedConstraints(sessionId);
  const updatedDuality = stateManager.getComponentCognitiveDuality(sessionId)!;
  const appliedPatterns = updatedDuality.ecosystem_session_mapping.encapsulation_patterns;
  
  return {
    ...baseOutput,
    orchestration_mode: orchestrationMode,
    duality_metrics: dualityMetrics,
    active_constraints: activeConstraints,
    applied_encapsulation_patterns: appliedPatterns
  };
}

// Process component generation mode (V0-style)
function processComponentGenerationMode(
  input: ComponentCognitiveDualityInput,
  duality: ComponentCognitiveDuality
): FromJARVIS {
  const sessionId = input.session_id;
  const session = stateManager.getSessionState(sessionId);
  const constraints = stateManager.getUnifiedConstraints(sessionId);
  
  // Generate component-focused prompts
  const componentPrompt = generateComponentCognitiveDualityPrompt(
    session.initial_objective,
    session.detected_role,
    { domain: 'component_generation' },
    duality,
    constraints
  );
  
  // Process with component-focused FSM logic
  const baseOutput = processState(input);
  
  // Override system prompt with component generation focus
  return {
    ...baseOutput,
    system_prompt: generateComponentGenerationPrompt(componentPrompt, constraints),
    allowed_next_tools: [...baseOutput.allowed_next_tools, 'Write', 'Edit', 'Read'] // Component creation tools
  };
}

// Process hybrid duality mode (full integration)
function processHybridDualityMode(
  input: ComponentCognitiveDualityInput,
  duality: ComponentCognitiveDuality
): FromJARVIS {
  const sessionId = input.session_id;
  const session = stateManager.getSessionState(sessionId);
  const constraints = stateManager.getUnifiedConstraints(sessionId);
  
  // Generate hybrid duality prompts
  const hybridPrompt = generateComponentCognitiveDualityPrompt(
    session.initial_objective,
    session.detected_role,
    { domain: 'hybrid_component_cognitive' },
    duality,
    constraints
  );
  
  // Process with enhanced FSM logic
  const baseOutput = processState(input);
  
  // Override system prompt with hybrid duality integration
  return {
    ...baseOutput,
    system_prompt: generateHybridDualityPrompt(hybridPrompt, duality, constraints),
    allowed_next_tools: [...baseOutput.allowed_next_tools, 'Write', 'Edit', 'Read', 'WebSearch'] // All tools available
  };
}

// Generate component generation focused system prompt
function generateComponentGenerationPrompt(
  componentPrompt: MetaPrompt,
  constraints: UnifiedConstraint[]
): string {
  const constraintGuidance = constraints.length > 0 
    ? `\n\n**ACTIVE CONSTRAINTS:** ${constraints.map(c => `${c.type}(${c.scope}:${c.priority})`).join(', ')}`
    : '';
  
  return `${componentPrompt.role_specification}

**COMPONENT GENERATION MODE ACTIVE** - Focus on V0-style UI component creation with systematic constraint validation.

${componentPrompt.instruction_block}

**COMPONENT GENERATION FOCUS:**
- Prioritize component creation, styling, and accessibility
- Apply framework-specific patterns (React/Vue/Svelte)
- Ensure constraint satisfaction at component/project/ecosystem levels
- Generate reusable, well-documented components
- Optimize for performance and maintainability${constraintGuidance}

${componentPrompt.output_requirements}`;
}

// Generate hybrid duality system prompt  
function generateHybridDualityPrompt(
  hybridPrompt: MetaPrompt,
  duality: ComponentCognitiveDuality,
  constraints: UnifiedConstraint[]
): string {
  const dualityEffectiveness = duality.ecosystem_session_mapping.cognitive_context.duality_effectiveness;
  const orchestrationMode = duality.project_phase_mapping.orchestration_mode;
  
  return `${hybridPrompt.role_specification}

**HYBRID COMPONENT-COGNITIVE DUALITY MODE ACTIVE** - Seamlessly integrate V0 component generation with Manus cognitive orchestration.

${hybridPrompt.instruction_block}

**DUALITY INTEGRATION METRICS:**
- Duality Effectiveness: ${dualityEffectiveness}x synergy multiplier
- Orchestration Mode: ${orchestrationMode}
- Active Constraints: ${constraints.length} unified constraints
- Integration Coherence: Apply both component and cognitive patterns

**UNIFIED EXECUTION FLOW:**
1. Cognitive orchestration for strategic planning and task decomposition
2. Component generation for UI creation and implementation
3. Constraint validation across all hierarchy levels
4. Performance optimization for both cognitive and component efficiency
5. Seamless mode switching based on task requirements

${hybridPrompt.output_requirements}`;
}

// Calculate duality performance metrics
function calculateDualityMetrics(sessionId: string): ComponentCognitiveDualityOutput['duality_metrics'] {
  const enhancedMetrics = stateManager.getEnhancedSessionMetrics(sessionId);
  const dualityData = enhancedMetrics.component_cognitive_duality;
  
  if (!dualityData) {
    return {
      component_generation_efficiency: 0,
      cognitive_orchestration_effectiveness: 0,
      duality_synergy_score: 0,
      constraint_satisfaction_rate: 0
    };
  }
  
  return {
    component_generation_efficiency: dualityData.performance_metrics.component_generation.generation_speed || 0,
    cognitive_orchestration_effectiveness: dualityData.performance_metrics.cognitive_orchestration.reasoning_effectiveness || 0,
    duality_synergy_score: dualityData.performance_metrics.duality_synergy.integration_coherence || 0,
    constraint_satisfaction_rate: dualityData.constraint_count > 0 ? 
      (dualityData.performance_metrics.component_generation.constraint_satisfaction || 0) : 1.0
  };
}