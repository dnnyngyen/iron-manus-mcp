// Phase-specific prompts that replace Manus's Planner/Knowledge/Datasource modules
// Role-aware, cognitively enhanced prompts with fractal orchestration capability

import { 
  Phase, 
  Role, 
  RoleConfig, 
  MetaPrompt, 
  ComponentCognitiveDuality,
  UnifiedConstraint,
  EncapsulationPattern,
  CognitiveContext 
} from './types.js';
import { detectUIRole, generateUIRoleEnhancedPrompt, generateUIMetaPrompt } from '../agents/ui-agent-roles.js';

// Role configuration from Manus's modular architecture
export const ROLE_CONFIG: Record<Role, RoleConfig> = {
  planner: {
    defaultOutput: 'strategic_architecture',
    focus: 'systematic_planning',
    complexityLevel: 'complex',
    suggestedFrameworks: ['systems_thinking', 'dependency_analysis'],
    validationRules: ['has_objectives', 'has_timeline', 'has_dependencies'],
    thinkingMethodology: [
      'Break down into components and identify dependencies',
      'Assess risks and plan contingencies for failure modes', 
      'Sequence tasks based on dependencies and estimate realistic timeframes',
      'Consider all stakeholders and their constraints'
    ],
    reasoningMultiplier: 2.7,
    authorityLevel: 'STRATEGIZE_AND_COORDINATE'
  },
  coder: {
    defaultOutput: 'implementation_with_tests',
    focus: 'modular_development',
    complexityLevel: 'multi-step',
    suggestedFrameworks: ['TDD', 'modular_architecture'],
    validationRules: ['has_tests', 'follows_conventions', 'error_handling'],
    thinkingMethodology: [
      'Define expected behavior and write tests before implementation',
      'Design for single responsibility, loose coupling, high cohesion',
      'Consider error handling, input validation, and graceful degradation',
      'Analyze performance implications and optimization opportunities'
    ],
    reasoningMultiplier: 2.5,
    authorityLevel: 'IMPLEMENT_AND_VALIDATE'
  },
  critic: {
    defaultOutput: 'comprehensive_assessment',
    focus: 'security_quality_assurance',
    complexityLevel: 'complex',
    suggestedFrameworks: ['security_review', 'code_analysis'],
    validationRules: ['security_check', 'performance_review', 'compliance'],
    thinkingMethodology: [
      'Analyze attack vectors, input validation, and privilege escalation risks',
      'Verify compliance with standards, regulations, and best practices',
      'Consider edge cases, boundary conditions, and unexpected inputs',
      'Evaluate maintainability, performance, and reliability trade-offs'
    ],
    reasoningMultiplier: 3.0,
    authorityLevel: 'EVALUATE_AND_REFINE'
  },
  researcher: {
    defaultOutput: 'comprehensive_research',
    focus: 'parallel_information_synthesis',
    complexityLevel: 'multi-step',
    suggestedFrameworks: ['systematic_research', 'parallel_validation'],
    validationRules: ['source_validation', 'data_accuracy', 'completeness'],
    thinkingMethodology: [
      'Validate source credibility, recency, and relevance',
      'Cross-reference multiple sources to triangulate findings',
      'Identify knowledge gaps and research limitations',
      'Assess research methodology quality and potential biases'
    ],
    reasoningMultiplier: 2.8,
    authorityLevel: 'INVESTIGATE_AND_SYNTHESIZE'
  },
  analyzer: {
    defaultOutput: 'analytical_insights',
    focus: 'multi_dimensional_analysis',
    complexityLevel: 'complex',
    suggestedFrameworks: ['statistical_analysis', 'pattern_recognition'],
    validationRules: ['data_validation', 'pattern_verification', 'statistical_significance'],
    thinkingMethodology: [
      'Validate data quality, completeness, and accuracy',
      'Look for patterns, trends, anomalies, and correlations',
      'Consider statistical significance and avoid false conclusions',
      'Question assumptions and consider alternative explanations'
    ],
    reasoningMultiplier: 3.2,
    authorityLevel: 'ANALYZE_AND_REPORT'
  },
  synthesizer: {
    defaultOutput: 'integrated_solution',
    focus: 'component_integration',
    complexityLevel: 'complex',
    suggestedFrameworks: ['system_integration', 'optimization_framework'],
    validationRules: ['integration_testing', 'performance_validation', 'quality_synthesis'],
    thinkingMethodology: [
      'Consider how components work together and interact',
      'Balance competing requirements and analyze trade-offs',
      'Find efficient solutions that optimize multiple constraints',
      'Ensure coherent, maintainable, and scalable results'
    ],
    reasoningMultiplier: 2.9,
    authorityLevel: 'INTEGRATE_AND_OPTIMIZE'
  },
  // V0-Style UI Agent Roles - Convert UIRoleConfig to RoleConfig for compatibility
  ui_architect: {
    defaultOutput: 'component_architecture',
    focus: 'ui_system_design',
    complexityLevel: 'complex',
    suggestedFrameworks: ['V0', 'component_hierarchy', 'design_systems'],
    validationRules: ['has_component_structure', 'follows_design_system', 'accessibility_compliant'],
    thinkingMethodology: [
      'Consider user needs, workflows, and accessibility requirements first',
      'Design reusable, composable component hierarchies',
      'Plan for scalability, maintainability, and future growth',
      'Ensure accessibility standards and diverse user abilities'
    ],
    reasoningMultiplier: 3.1,
    authorityLevel: 'DESIGN_AND_ARCHITECT'
  },
  ui_implementer: {
    defaultOutput: 'working_components',
    focus: 'concurrent_ui_implementation',
    complexityLevel: 'multi-step',
    suggestedFrameworks: ['React', 'Shadcn/UI', 'concurrent_execution'],
    validationRules: ['renders_correctly', 'responsive_design', 'proper_props'],
    thinkingMethodology: [
      'Use established, proven implementation patterns',
      'Consider cross-browser compatibility and platform requirements',
      'Optimize for performance: bundle size, rendering, memory usage',
      'Write maintainable, readable, and well-documented code'
    ],
    reasoningMultiplier: 2.8,
    authorityLevel: 'IMPLEMENT_AND_RENDER'
  },
  ui_refiner: {
    defaultOutput: 'polished_ui',
    focus: 'ui_polish_optimization',
    complexityLevel: 'multi-step',
    suggestedFrameworks: ['ui_refinement', 'micro_interactions', 'accessibility'],
    validationRules: ['visual_polish', 'interaction_feedback', 'cross_browser_compatible'],
    thinkingMethodology: [
      'Evaluate usability, accessibility, and performance systematically',
      'Consider real user interactions and feedback patterns',
      'Make incremental, measurable improvements with clear goals',
      'Ensure compliance with accessibility and web standards'
    ],
    reasoningMultiplier: 2.5,
    authorityLevel: 'REFINE_AND_POLISH'
  }
};

// Enhanced role detection including UI roles (replicates Manus's module selection)
export function detectRole(objective: string): Role {
  const lowerObjective = objective.toLowerCase();
  
  // Check for UI context patterns FIRST - these should override generic roles
  const uiContextPatterns = [
    'modern_web_ui_design', 'ui_design', 'component_design', 'frontend_development',
    'web_ui', 'interface_design', 'ui_implementation', 'ui_architecture'
  ];
  
  const contextMatch = objective.match(/\(CONTEXT:\s*([^)]+)\)/i);
  const hasUIContext = contextMatch && uiContextPatterns.some(pattern => 
    contextMatch[1].toLowerCase().includes(pattern)
  );
  
  // If we have UI context, override any generic roles with UI-specific ones
  if (hasUIContext) {
    // Check refiner patterns first (most specific)
    if (lowerObjective.includes('refine') || lowerObjective.includes('polish') || lowerObjective.includes('optimize') || lowerObjective.includes('styling')) {
      return 'ui_refiner';
    }
    // Then architect patterns
    if (lowerObjective.includes('architect') || lowerObjective.includes('design system') || lowerObjective.includes('plan')) {
      return 'ui_architect';
    }
    // Then implementer patterns
    if (lowerObjective.includes('implement') || lowerObjective.includes('code') || lowerObjective.includes('build')) {
      return 'ui_implementer';
    }
    // Default to ui_implementer for UI context with generic roles
    return 'ui_implementer';
  }
  
  // Check for meta-prompt ROLE syntax for non-UI contexts
  const metaRoleMatch = objective.match(/\(ROLE:\s*([^)]+)\)/i);
  if (metaRoleMatch) {
    const explicitRole = metaRoleMatch[1].trim().toLowerCase();
    // Map explicit meta-prompt roles
    if (explicitRole === 'ui_architect' || explicitRole === 'ui-architect') return 'ui_architect';
    if (explicitRole === 'ui_implementer' || explicitRole === 'ui-implementer') return 'ui_implementer';  
    if (explicitRole === 'ui_refiner' || explicitRole === 'ui-refiner') return 'ui_refiner';
    if (explicitRole === 'planner') return 'planner';
    if (explicitRole === 'coder') return 'coder';
    if (explicitRole === 'critic') return 'critic';
    if (explicitRole === 'researcher') return 'researcher';
    if (explicitRole === 'analyzer') return 'analyzer';
    if (explicitRole === 'synthesizer') return 'synthesizer';
  }
  
  // First check for UI-specific roles in content
  if (lowerObjective.includes('ui') && (lowerObjective.includes('architect') || lowerObjective.includes('design system'))) {
    return 'ui_architect';
  }
  if (lowerObjective.includes('ui') && (lowerObjective.includes('implement') || lowerObjective.includes('component'))) {
    return 'ui_implementer';
  }
  if (lowerObjective.includes('ui') && (lowerObjective.includes('refine') || lowerObjective.includes('polish'))) {
    return 'ui_refiner';
  }
  
  // Planner keywords
  if (lowerObjective.includes('plan') || lowerObjective.includes('strategy') || 
      lowerObjective.includes('design') || lowerObjective.includes('architect')) {
    return 'planner';
  }
  
  // Coder keywords
  if (lowerObjective.includes('implement') || lowerObjective.includes('code') || 
      lowerObjective.includes('build') || lowerObjective.includes('develop') || 
      lowerObjective.includes('program')) {
    return 'coder';
  }
  
  // Critic keywords
  if (lowerObjective.includes('review') || lowerObjective.includes('analyze') || 
      lowerObjective.includes('security') || lowerObjective.includes('audit') || 
      lowerObjective.includes('validate')) {
    return 'critic';
  }
  
  // Analyzer keywords
  if (lowerObjective.includes('analyze') || lowerObjective.includes('data') || 
      lowerObjective.includes('metrics') || lowerObjective.includes('statistics')) {
    return 'analyzer';
  }
  
  // Synthesizer keywords
  if (lowerObjective.includes('integrate') || lowerObjective.includes('combine') || 
      lowerObjective.includes('merge') || lowerObjective.includes('optimize')) {
    return 'synthesizer';
  }
  
  // Default to researcher (like Manus Knowledge Module)
  return 'researcher';
}

// Generate enhanced prompts with role-specific cognitive enhancement + tool guidance
export function generateRoleEnhancedPrompt(phase: Phase, role: Role, objective: string): string {
  // Check if this is a UI role and use specialized UI prompt generation
  const uiRole = detectUIRole(objective);
  if (uiRole && (role === 'ui_architect' || role === 'ui_implementer' || role === 'ui_refiner')) {
    return generateUIRoleEnhancedPrompt(phase, uiRole, objective);
  }
  
  const config = ROLE_CONFIG[role];
  const basePrompt = BASE_PHASE_PROMPTS[phase];
  let toolGuidance = PHASE_TOOL_GUIDANCE[phase];
  
  // Add Python execution guidance if beneficial for this role and objective
  if (requiresPythonExecution(objective, role) && phase === 'EXECUTE') {
    const pythonGuidance = role === 'analyzer' 
      ? ' **Python Analysis Recommended**: Use mcp__ide__executeCode for statistical analysis, data processing, and metrics calculation.'
      : ' **Python Computation Recommended**: Use mcp__ide__executeCode for complex algorithms, calculations, or code generation.';
    toolGuidance += pythonGuidance;
  }
  
  const thinkingMethodology = `

**🧠 THINKING METHODOLOGY FOR ${role.toUpperCase()}:**
${config.thinkingMethodology.map(step => `• ${step}`).join('\n')}

**🎯 FOCUS:** ${config.focus}
**🔧 FRAMEWORKS:** ${config.suggestedFrameworks.join(', ')}

**🛠️ TOOL GUIDANCE:** ${toolGuidance}

Apply these thinking steps systematically to improve reasoning quality and thoroughness.`;
  
  return basePrompt + thinkingMethodology;
}

// Base phase prompts (enhanced for fractal orchestration)
const BASE_PHASE_PROMPTS: Record<Phase, string> = {
  INIT: `You are initializing a new task. This should not be reached - call manus_orchestrator immediately.`,
  
  QUERY: `You are in the QUERY phase (Manus: "Analyze Events"). Your task:

Think through your analysis approach before proceeding. Consider:
- What is the user really asking for at its core?
- What are the key requirements and constraints?
- Are there any ambiguities that need clarification?
- What type of task is this (research, coding, deployment, etc.)?
- What primary role would be most effective (planner/coder/critic/researcher/analyzer/synthesizer)?

After analyzing the situation, proceed with:
1. Parse the user's goal and identify key requirements
2. Clarify any ambiguous aspects 
3. Identify what type of task this is (research, coding, deployment, etc.)
4. Detect the primary role needed (planner/coder/critic/researcher/analyzer/synthesizer)
5. Call manus_orchestrator with phase_completed: 'QUERY' and include your interpretation in the payload as 'interpreted_goal'.

Focus on understanding the core objective with role-specific expertise.`,

  ENHANCE: `You are in the ENHANCE phase (Manus: "Select Tools"). Your task:

Think through how to enhance and refine the interpreted goal. Consider:
- What important details might be missing from the initial interpretation?
- What edge cases or implicit requirements should be considered?
- What information, resources, or tools will be needed?
- What potential challenges or dependencies might arise?
- How can you make this goal more comprehensive and actionable?

After evaluating these aspects, proceed with:
1. Take the interpreted goal and enhance it with missing details
2. Consider edge cases or requirements that weren't explicitly stated
3. Determine what information or resources you'll need
4. Identify potential challenges or dependencies
5. Call manus_orchestrator with phase_completed: 'ENHANCE' and include the enhanced understanding in payload as 'enhanced_goal'.

Focus on making the goal comprehensive and actionable with your specialized perspective.`,

  KNOWLEDGE: `You are in the KNOWLEDGE phase (Manus Knowledge Module). Your task:

Think through your knowledge requirements before proceeding. Assess:
- Do you need external information (APIs, research, documentation) for this task?
- If research is needed, what specific information should you gather?
- What relevant knowledge do you already possess that applies to this goal?
- Are there any technical constraints or requirements to consider?
- What knowledge gaps might exist that could impact success?

After evaluating your knowledge needs, proceed with:
1. Determine if you need external information (APIs, research, documentation)
2. If research is needed, note what specific information to gather
3. If no external research is needed, summarize relevant knowledge you already have
4. Identify any technical constraints or requirements
5. Call manus_orchestrator with phase_completed: 'KNOWLEDGE' and include your findings in payload as 'knowledge_gathered'.

Gather essential knowledge using your domain expertise.`,

  PLAN: `You are in the PLAN phase (Manus Planner Module). Your task:

Think strategically about how to break down this goal. Consider:
- What is the optimal task breakdown strategy for this specific goal?
- Which tasks require specialized Task() agent expertise vs direct execution?
- What are the dependencies, sequencing, and timeline considerations?
- What complexity challenges might arise during execution?
- How can you ensure the plan is actionable and efficient?

After strategic analysis, proceed with:
1. Break down the enhanced goal into specific, actionable steps
2. Use TodoWrite to create a detailed task breakdown
3. For complex sub-tasks that need specialized expertise, embed MetaPrompt structure in todo content
4. Format complex todos as: "(ROLE: agent_type) (CONTEXT: domain_info) (PROMPT: detailed_instructions) (OUTPUT: deliverables)"
5. After creating todos, call manus_orchestrator with phase_completed: 'PLAN' and include 'plan_created': true in payload.

**FRACTAL ORCHESTRATION:** Mark todos that should spawn Task() agents with detailed meta-prompts. Use TodoWrite now.`,

  EXECUTE: `You are in the EXECUTE phase (Manus Datasource Module). Your task:

Think through your execution strategy before taking action. Analyze:
- What is the current task complexity and scope?
- What is the optimal execution approach for this specific task?
- Should you use direct tools or spawn specialized Task() agents?
- What potential challenges might you encounter?
- What mitigation strategies should you have ready?

After analyzing the execution approach, proceed with:
1. Use TodoRead to see your current tasks
2. For todos with meta-prompts (ROLE/CONTEXT/PROMPT/OUTPUT), use Task() tool to spawn specialized agents
3. For direct execution todos, use Bash, Browser, Read, Write, Edit tools
4. **Single tool per iteration** (Manus requirement) - call one tool, then return to orchestrator
5. After each significant action, call manus_orchestrator with phase_completed: 'EXECUTE' and include execution results.

**FRACTAL EXECUTION:** Spawn Task() agents for complex work, execute directly for simple tasks.`,

  VERIFY: `You are in the VERIFY phase (Quality Assessment). Your task:

Think critically about the quality and completeness of the work. Evaluate:
- How do the actual deliverables compare to the original objective?
- Have all requirements been met according to role-specific quality standards?
- What gaps or improvements might be needed?
- What are the success criteria and have they been achieved?
- What is the best approach to verify functionality and quality?

After thorough quality assessment, proceed with:
1. Review the original objective against what was delivered
2. Check if all requirements were met with role-specific quality standards
3. Test functionality if applicable
4. Identify any gaps or improvements needed
5. Call manus_orchestrator with phase_completed: 'VERIFY' and include 'verification_passed': true/false in payload.

Apply rigorous quality assessment with your specialized validation expertise.`,

  DONE: `Task completed successfully. Entering standby mode (Manus: "Enter Standby").`
};

// Meta-prompt generation for Task() agent spawning with Think tool integration
export function generateMetaPrompt(todoContent: string, role: Role, context: Record<string, any>): MetaPrompt {
  // Check if this is a UI role and use specialized UI meta-prompt generation
  const uiRole = detectUIRole(todoContent);
  if (uiRole && (role === 'ui_architect' || role === 'ui_implementer' || role === 'ui_refiner')) {
    return generateUIMetaPrompt(todoContent, uiRole, context);
  }
  
  const config = ROLE_CONFIG[role];
  
  // Generate role-specific Think tool guidance
  const thinkGuidance = generateRoleSpecificThinkGuidance(role, config);
  
  return {
    role_specification: `(ROLE: ${role})`,
    context_parameters: {
      domain_info: context.domain || 'general',
      complexity_level: config.complexityLevel,
      frameworks: config.suggestedFrameworks,
      reasoning_multiplier: config.reasoningMultiplier,
      cognitive_frameworks: config.cognitiveFrameworks || config.suggestedFrameworks,
      ...context
    },
    instruction_block: `(PROMPT: "${todoContent}

${thinkGuidance}

**🎯 EXECUTION APPROACH:**
1. Think through your approach using the ${(config.cognitiveFrameworks || config.suggestedFrameworks).join(' and ')} frameworks
2. Apply ${role} expertise with ${config.reasoningMultiplier}x cognitive enhancement
3. Follow ${config.validationRules.join(', ')} validation rules
4. Use TodoWrite to create your own sub-task breakdown if needed
5. Think through implementation strategy and potential challenges
6. Execute with systematic precision using ${config.suggestedFrameworks.join(' and ')} methodologies
7. Think critically about work quality against ${config.authorityLevel} standards before completion
8. Report completion with detailed deliverables

**🧠 COGNITIVE ENHANCEMENT:** Your reasoning effectiveness is enhanced ${config.reasoningMultiplier}x through systematic thinking and role-specific frameworks.")`
    ,
    output_requirements: `(OUTPUT: ${config.defaultOutput})`
  };
}

// ============================================================================
// COMPONENT-COGNITIVE DUALITY META-PROMPT GENERATION
// Enhanced meta-prompt generation supporting V0 component patterns + Manus cognitive orchestration
// ============================================================================

export function generateComponentCognitiveDualityPrompt(
  todoContent: string, 
  role: Role, 
  context: Record<string, any>,
  duality: ComponentCognitiveDuality,
  constraints: UnifiedConstraint[]
): MetaPrompt {
  const config = ROLE_CONFIG[role];
  const cognitiveContext = duality.ecosystem_session_mapping.cognitive_context;
  
  // Generate component-cognitive duality guidance based on reasoning mode
  const dualityGuidance = generateComponentCognitiveDualityGuidance(
    cognitiveContext.reasoning_mode, 
    role, 
    config, 
    constraints
  );
  
  // Generate constraint-aware execution framework
  const constraintFramework = generateConstraintAwareFramework(constraints, role);
  
  // Generate encapsulation pattern integration
  const encapsulationGuidance = generateEncapsulationPatternGuidance(
    duality.ecosystem_session_mapping.encapsulation_patterns,
    role
  );
  
  return {
    role_specification: `(ROLE: ${role} with Component-Cognitive Duality Enhancement)`,
    context_parameters: {
      domain_info: context.domain || 'component_cognitive_hybrid',
      complexity_level: config.complexityLevel,
      frameworks: [...config.suggestedFrameworks, 'V0_Component_Generation', 'Unified_Constraint_System'],
      reasoning_multiplier: config.reasoningMultiplier,
      cognitive_frameworks: config.cognitiveFrameworks || config.suggestedFrameworks,
      reasoning_mode: cognitiveContext.reasoning_mode,
      duality_effectiveness: cognitiveContext.duality_effectiveness,
      constraint_count: constraints.length,
      encapsulation_patterns: duality.ecosystem_session_mapping.encapsulation_patterns.length,
      orchestration_mode: duality.project_phase_mapping.orchestration_mode,
      ...context
    },
    instruction_block: `(PROMPT: "${todoContent}

${dualityGuidance}

${constraintFramework}

${encapsulationGuidance}

**🎯 COMPONENT-COGNITIVE EXECUTION APPROACH:**
1. Think through your approach using unified ${(config.cognitiveFrameworks || config.suggestedFrameworks).join(' and ')} + V0 Component Generation frameworks
2. Apply ${role} expertise with ${config.reasoningMultiplier}x cognitive enhancement + ${cognitiveContext.duality_effectiveness}x duality synergy
3. Follow ${config.validationRules.join(', ')} validation rules + unified constraint validation
4. Use TodoWrite to create your own sub-task breakdown if needed (Level 2 Task Agent decomposition)
5. Think through implementation strategy considering both cognitive orchestration and component generation patterns
6. Execute with systematic precision using ${config.suggestedFrameworks.join(', ')} + V0 encapsulation methodologies
7. Apply unified constraint hierarchy: Component-level → Project-level → Ecosystem-level constraints
8. Think critically about work quality against ${config.authorityLevel} + Component-Cognitive Duality standards
9. Report completion with detailed deliverables including constraint satisfaction metrics

**🧠 COMPONENT-COGNITIVE ENHANCEMENT:** Your reasoning effectiveness is enhanced ${config.reasoningMultiplier}x (cognitive) × ${cognitiveContext.duality_effectiveness}x (duality synergy) through systematic thinking, role-specific frameworks, and unified constraint-driven component generation.")`
    ,
    output_requirements: `(OUTPUT: ${config.defaultOutput} + Component-Cognitive Duality Metrics)`
  };
}

// Generate component-cognitive duality specific guidance
function generateComponentCognitiveDualityGuidance(
  reasoningMode: CognitiveContext['reasoning_mode'],
  role: Role,
  config: RoleConfig,
  constraints: UnifiedConstraint[]
): string {
  const modeSpecificGuidance: Record<CognitiveContext['reasoning_mode'], string> = {
    component_generation: `**🧠 COMPONENT GENERATION REASONING (${config.reasoningMultiplier}x enhancement):** Think systematically about V0-style component creation:
- Component hierarchy and composition patterns (atomic → composite → ecosystem)
- Framework-specific constraints (React/Vue/Svelte patterns)
- Accessibility compliance and WAI-ARIA integration
- Styling system integration (Tailwind/Material UI/Chakra UI)
- Props interface design and component API definition
- Performance optimization and bundle size considerations`,

    cognitive_orchestration: `**🧠 COGNITIVE ORCHESTRATION REASONING (${config.reasoningMultiplier}x enhancement):** Think strategically about Manus FSM orchestration:`,
    
    unified: `**🧠 UNIFIED REASONING (${config.reasoningMultiplier}x enhancement):** Think holistically combining both approaches:`,
    
    component_focused: `**🧠 COMPONENT-FOCUSED REASONING (${config.reasoningMultiplier}x enhancement):** Focus on component generation:`,
    
    cognitive_focused: `**🧠 COGNITIVE-FOCUSED REASONING (${config.reasoningMultiplier}x enhancement):** Focus on cognitive orchestration:
- Phase transition logic and state management
- Task decomposition and fractal orchestration
- Role-based cognitive enhancement application
- Reasoning effectiveness optimization
- Session state persistence and performance tracking
- Constraint validation and compliance enforcement`,

    hybrid_duality: `**🧠 HYBRID DUALITY REASONING (${config.reasoningMultiplier}x enhancement):** Think holistically about unified component-cognitive patterns:
- Bidirectional mapping between V0 Component↔Manus Task hierarchies
- Unified constraint propagation across component/project/ecosystem scopes
- Encapsulation pattern integration with cognitive orchestration
- Performance synergy between component generation and cognitive reasoning
- Cross-domain optimization and architectural elegance
- Duality effectiveness metrics and continuous improvement`
  };

  const constraintGuidance = constraints.length > 0 
    ? `\n- Active unified constraints: ${constraints.map(c => `${c.type}(${c.scope})`).join(', ')}`
    : '';

  return modeSpecificGuidance[reasoningMode] + constraintGuidance;
}

// Generate constraint-aware execution framework
function generateConstraintAwareFramework(constraints: UnifiedConstraint[], role: Role): string {
  if (constraints.length === 0) {
    return '**🔒 CONSTRAINT FRAMEWORK:** No active constraints - use default role frameworks.';
  }

  const constraintsByScope = constraints.reduce((acc, constraint) => {
    if (!acc[constraint.scope]) acc[constraint.scope] = [];
    acc[constraint.scope].push(constraint);
    return acc;
  }, {} as Record<string, UnifiedConstraint[]>);

  let framework = '**🔒 UNIFIED CONSTRAINT FRAMEWORK:**\n';
  
  if (constraintsByScope.component) {
    framework += `- **Component-level constraints:** ${constraintsByScope.component.map(c => c.type).join(', ')}\n`;
  }
  if (constraintsByScope.project) {
    framework += `- **Project-level constraints:** ${constraintsByScope.project.map(c => c.type).join(', ')}\n`;
  }
  if (constraintsByScope.ecosystem) {
    framework += `- **Ecosystem-level constraints:** ${constraintsByScope.ecosystem.map(c => c.type).join(', ')}\n`;
  }

  framework += `- **Constraint validation priority:** ${constraints.filter(c => c.priority === 'critical').length} critical, ${constraints.filter(c => c.priority === 'high').length} high priority constraints must be satisfied`;

  return framework;
}

// Generate encapsulation pattern integration guidance
function generateEncapsulationPatternGuidance(patterns: EncapsulationPattern[], role: Role): string {
  if (patterns.length === 0) {
    return '**🏗️ ENCAPSULATION PATTERNS:** No active patterns - use default architectural approaches.';
  }

  const patternTypes = patterns.map(p => p.pattern_type).join(', ');
  const stateManagement = [...new Set(patterns.map(p => p.state_management))].join(', ');
  
  return `**🏗️ V0 ENCAPSULATION PATTERN INTEGRATION:**
- **Active patterns:** ${patternTypes}
- **State management:** ${stateManagement}
- **Scope isolation:** ${patterns.filter(p => p.scope_isolation).length}/${patterns.length} patterns use scope isolation
- **Integration approach:** Apply V0 encapsulation principles while maintaining Manus cognitive orchestration flow
- **Pattern constraints:** ${patterns.reduce((total, p) => total + p.constraint_enforcement.length, 0)} pattern-specific constraints to validate`;
}

// Helper function to detect when Python execution would be beneficial
function requiresPythonExecution(objective: string, role: Role): boolean {
  const lowerObjective = objective.toLowerCase();
  
  // Python indicators for analyzer role
  const analysisIndicators = [
    'analyze', 'statistics', 'metrics', 'performance', 'data', 'calculate',
    'measure', 'benchmark', 'correlation', 'pattern', 'trend', 'visualization'
  ];
  
  // Python indicators for coder role
  const codingIndicators = [
    'algorithm', 'computation', 'complex calculation', 'generate code',
    'template', 'optimization', 'mathematical', 'numerical', 'processing'
  ];
  
  if (role === 'analyzer' && analysisIndicators.some(indicator => lowerObjective.includes(indicator))) {
    return true;
  }
  
  if (role === 'coder' && codingIndicators.some(indicator => lowerObjective.includes(indicator))) {
    return true;
  }
  
  return false;
}

// Generate role-specific Think tool guidance for cognitive enhancement
function generateRoleSpecificThinkGuidance(role: Role, config: RoleConfig): string {
  const roleSpecificThinking: Record<Role, string> = {
    planner: `**🧠 STRATEGIC THINKING REQUIRED (${config.reasoningMultiplier}x enhancement):** Think strategically about:
- System architecture and component relationships
- Strategic decomposition using Hierarchical Decomposition framework
- Dependencies, timelines, and resource allocation
- Risk assessment and mitigation strategies
- Success criteria and validation checkpoints`,

    coder: `**🧠 IMPLEMENTATION REASONING REQUIRED (${config.reasoningMultiplier}x enhancement):** Think through the implementation approach:
- Modular architecture design patterns and component boundaries
- Test-driven development approach and testing strategy
- Error handling, edge cases, and robustness considerations
- Code maintainability, readability, and convention adherence
- Integration points and API design decisions
- **Python Execution**: For complex algorithms, calculations, or code generation, use mcp__ide__executeCode to write and test Python scripts`,

    critic: `**🧠 CRITICAL ASSESSMENT REQUIRED (${config.reasoningMultiplier}x enhancement):** Think critically about quality and security:
- Security vulnerabilities and attack vectors using Security-First Assessment
- Code quality, performance bottlenecks, and optimization opportunities
- Compliance with standards, regulations, and best practices
- Multi-layer validation across functional, security, and performance dimensions
- Risk severity assessment and remediation prioritization`,

    researcher: `**🧠 RESEARCH ANALYSIS REQUIRED (${config.reasoningMultiplier}x enhancement):** Think systematically about the research approach:
- Parallel research validation strategies and source credibility assessment
- Information synthesis patterns and data correlation analysis
- Research scope boundaries and information completeness criteria
- Source triangulation and verification methodologies
- Knowledge gaps identification and research direction prioritization`,

    analyzer: `**🧠 ANALYTICAL REASONING REQUIRED (${config.reasoningMultiplier}x enhancement):** Think analytically about the data and patterns:
- Multi-dimensional analysis matrix construction and variable relationships
- Statistical pattern recognition and data correlation significance
- Data validation methodologies and quality assurance protocols
- Pattern verification strategies and anomaly detection approaches
- Statistical significance assessment and confidence interval analysis
- **Python Analysis**: Use mcp__ide__executeCode for statistical analysis, data processing, performance metrics calculation, and visualization`,

    synthesizer: `**🧠 INTEGRATION REASONING REQUIRED (${config.reasoningMultiplier}x enhancement):** Think holistically about integration and optimization:
- Component integration strategies and system interoperability
- Optimization framework selection and performance metric definition
- Integration testing approaches and quality synthesis validation
- System-level emergence patterns and holistic performance assessment
- Trade-off analysis between conflicting requirements and constraints`,

    ui_architect: `**🧠 UI ARCHITECTURE REASONING REQUIRED (${config.reasoningMultiplier}x enhancement):** Think systematically about UI design architecture:
- Component hierarchy and design system structure
- User experience flow and interaction patterns
- Accessibility and inclusive design principles
- Design token systems and theming architecture`,

    ui_implementer: `**🧠 UI IMPLEMENTATION REASONING REQUIRED (${config.reasoningMultiplier}x enhancement):** Think through UI implementation:
- Component implementation patterns and best practices
- Responsive design and cross-device compatibility
- Performance optimization for UI rendering
- Integration with design systems and style guides`,

    ui_refiner: `**🧠 UI REFINEMENT REASONING REQUIRED (${config.reasoningMultiplier}x enhancement):** Think critically about UI refinement:
- Visual polish and aesthetic improvements
- User interaction feedback and micro-interactions
- Cross-browser compatibility and testing
- Accessibility compliance and usability testing`
  };

  return roleSpecificThinking[role];
}

// Tool gating - enforces Manus's "single tool call per iteration" rule
// Single tool = forced via tool_code, Multiple tools = Claude chooses from whitelist
export const PHASE_ALLOWED_TOOLS: Record<Phase, string[]> = {
  INIT: ['manus_orchestrator'], // Force orchestrator
  QUERY: ['manus_orchestrator'], // Natural thinking + orchestrator
  ENHANCE: ['manus_orchestrator'], // Natural thinking + orchestrator
  KNOWLEDGE: ['WebSearch', 'WebFetch', 'mcp__ide__executeCode', 'manus_orchestrator'], // Natural thinking + research tools + data processing
  PLAN: ['TodoWrite'], // Natural thinking + planning tools
  EXECUTE: ['TodoRead', 'TodoWrite', 'Task', 'Bash', 'Read', 'Write', 'Edit', 'Browser', 'mcp__ide__executeCode'], // Natural thinking + execution tools + Python execution
  VERIFY: ['TodoRead', 'Read', 'mcp__ide__executeCode'], // Natural thinking + verification tools + analysis
  DONE: [] // No tools needed
};

// For phases where Claude should choose, we specify the choice in the prompt
export const PHASE_TOOL_GUIDANCE: Record<Phase, string> = {
  INIT: 'Call manus_orchestrator to begin',
  QUERY: 'Think through the goal analysis, then call manus_orchestrator with phase_completed: "QUERY"',
  ENHANCE: 'Think through enhancement opportunities, then call manus_orchestrator with phase_completed: "ENHANCE"',
  KNOWLEDGE: 'Think through knowledge needs, then choose: WebSearch/WebFetch (research), mcp__ide__executeCode (data processing), manus_orchestrator (skip research)',
  PLAN: 'Think through strategic planning, then use TodoWrite to create todos, then call manus_orchestrator with phase_completed: "PLAN"',
  EXECUTE: 'Think through execution approach, then choose: TodoRead (check todos), Task (spawn agent), Bash/Browser (direct execution), mcp__ide__executeCode (Python analysis/computation)',
  VERIFY: 'Think through quality assessment, then choose: TodoRead (check completion), Read (verify output), mcp__ide__executeCode (analytical verification)',
  DONE: 'No action needed'
};

// UI agent configurations are now imported from dedicated modules