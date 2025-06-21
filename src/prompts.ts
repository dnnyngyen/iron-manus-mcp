// Phase-specific prompts that replace Manus's Planner/Knowledge/Datasource modules
// Role-aware, cognitively enhanced prompts with fractal orchestration capability

import { Phase, Role, RoleConfig, MetaPrompt } from './types.js';

// Role configuration from Manus's modular architecture
export const ROLE_CONFIG: Record<Role, RoleConfig> = {
  planner: {
    defaultOutput: 'strategic_architecture',
    focus: 'systematic_planning',
    complexityLevel: 'complex',
    suggestedFrameworks: ['MANUS', 'hierarchical_decomposition'],
    validationRules: ['has_objectives', 'has_timeline', 'has_dependencies'],
    cognitiveFrameworks: ['Strategic Architecture Planning', 'Hierarchical Decomposition'],
    reasoningMultiplier: 2.7,
    authorityLevel: 'STRATEGIZE_AND_COORDINATE'
  },
  coder: {
    defaultOutput: 'implementation_with_tests',
    focus: 'modular_development',
    complexityLevel: 'multi-step',
    suggestedFrameworks: ['TDD', 'modular_architecture'],
    validationRules: ['has_tests', 'follows_conventions', 'error_handling'],
    cognitiveFrameworks: ['Modular Architecture Design', 'Test-Driven Implementation'],
    reasoningMultiplier: 2.5,
    authorityLevel: 'IMPLEMENT_AND_VALIDATE'
  },
  critic: {
    defaultOutput: 'comprehensive_assessment',
    focus: 'security_quality_assurance',
    complexityLevel: 'complex',
    suggestedFrameworks: ['security_review', 'code_analysis'],
    validationRules: ['security_check', 'performance_review', 'compliance'],
    cognitiveFrameworks: ['Security-First Assessment', 'Multi-Layer Validation'],
    reasoningMultiplier: 3.0,
    authorityLevel: 'EVALUATE_AND_REFINE'
  },
  researcher: {
    defaultOutput: 'comprehensive_research',
    focus: 'parallel_information_synthesis',
    complexityLevel: 'multi-step',
    suggestedFrameworks: ['systematic_research', 'parallel_validation'],
    validationRules: ['source_validation', 'data_accuracy', 'completeness'],
    cognitiveFrameworks: ['Parallel Research Validation', 'Information Synthesis'],
    reasoningMultiplier: 2.8,
    authorityLevel: 'INVESTIGATE_AND_SYNTHESIZE'
  },
  analyzer: {
    defaultOutput: 'analytical_insights',
    focus: 'multi_dimensional_analysis',
    complexityLevel: 'complex',
    suggestedFrameworks: ['statistical_analysis', 'pattern_recognition'],
    validationRules: ['data_validation', 'pattern_verification', 'statistical_significance'],
    cognitiveFrameworks: ['Multi-dimensional Analysis Matrix', 'Statistical Pattern Recognition'],
    reasoningMultiplier: 3.2,
    authorityLevel: 'ANALYZE_AND_REPORT'
  },
  synthesizer: {
    defaultOutput: 'integrated_solution',
    focus: 'component_integration',
    complexityLevel: 'complex',
    suggestedFrameworks: ['system_integration', 'optimization_framework'],
    validationRules: ['integration_testing', 'performance_validation', 'quality_synthesis'],
    cognitiveFrameworks: ['Integrative Optimization Framework', 'System Synthesis'],
    reasoningMultiplier: 2.9,
    authorityLevel: 'INTEGRATE_AND_OPTIMIZE'
  }
};

// Role detection from user input (replicates Manus's module selection)
export function detectRole(objective: string): Role {
  const lowerObjective = objective.toLowerCase();
  
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
  const config = ROLE_CONFIG[role];
  const basePrompt = BASE_PHASE_PROMPTS[phase];
  const toolGuidance = PHASE_TOOL_GUIDANCE[phase];
  
  const cognitiveEnhancement = `

**🧠 COGNITIVE ENHANCEMENT (${config.reasoningMultiplier}x effectiveness):**
${config.cognitiveFrameworks.join(', ')}

**🎯 ROLE-SPECIFIC FOCUS:** ${config.focus}
**📊 QUALITY THRESHOLD:** ${config.authorityLevel}
**🔧 SUGGESTED FRAMEWORKS:** ${config.suggestedFrameworks.join(', ')}

**🛠️ TOOL GUIDANCE:** ${toolGuidance}

Apply ${role} expertise with systematic precision and ${config.reasoningMultiplier}x reasoning effectiveness.`;
  
  return basePrompt + cognitiveEnhancement;
}

// Base phase prompts (enhanced for fractal orchestration)
const BASE_PHASE_PROMPTS: Record<Phase, string> = {
  INIT: `You are initializing a new task. This should not be reached - call manus_orchestrator immediately.`,
  
  QUERY: `You are in the QUERY phase (Manus: "Analyze Events"). Your task:
1. Parse the user's goal and identify key requirements
2. Clarify any ambiguous aspects 
3. Identify what type of task this is (research, coding, deployment, etc.)
4. Detect the primary role needed (planner/coder/critic/researcher/analyzer/synthesizer)
5. Call manus_orchestrator with phase_completed: 'QUERY' and include your interpretation in the payload as 'interpreted_goal'.

Focus on understanding the core objective with role-specific expertise.`,

  ENHANCE: `You are in the ENHANCE phase (Manus: "Select Tools"). Your task:
1. Take the interpreted goal and enhance it with missing details
2. Consider edge cases or requirements that weren't explicitly stated
3. Determine what information or resources you'll need
4. Identify potential challenges or dependencies
5. Call manus_orchestrator with phase_completed: 'ENHANCE' and include the enhanced understanding in payload as 'enhanced_goal'.

Focus on making the goal comprehensive and actionable with your specialized perspective.`,

  KNOWLEDGE: `You are in the KNOWLEDGE phase (Manus Knowledge Module). Your task:
1. Determine if you need external information (APIs, research, documentation)
2. If research is needed, note what specific information to gather
3. If no external research is needed, summarize relevant knowledge you already have
4. Identify any technical constraints or requirements
5. Call manus_orchestrator with phase_completed: 'KNOWLEDGE' and include your findings in payload as 'knowledge_gathered'.

Gather essential knowledge using your domain expertise.`,

  PLAN: `You are in the PLAN phase (Manus Planner Module). Your task:
1. Break down the enhanced goal into specific, actionable steps
2. Use TodoWrite to create a detailed task breakdown
3. For complex sub-tasks that need specialized expertise, embed MetaPrompt structure in todo content
4. Format complex todos as: "(ROLE: agent_type) (CONTEXT: domain_info) (PROMPT: detailed_instructions) (OUTPUT: deliverables)"
5. After creating todos, call manus_orchestrator with phase_completed: 'PLAN' and include 'plan_created': true in payload.

**FRACTAL ORCHESTRATION:** Mark todos that should spawn Task() agents with detailed meta-prompts. Use TodoWrite now.`,

  EXECUTE: `You are in the EXECUTE phase (Manus Datasource Module). Your task:
1. Use TodoRead to see your current tasks
2. For todos with meta-prompts (ROLE/CONTEXT/PROMPT/OUTPUT), use Task() tool to spawn specialized agents
3. For direct execution todos, use Bash, Browser, Read, Write, Edit tools
4. **Single tool per iteration** (Manus requirement) - call one tool, then return to orchestrator
5. After each significant action, call manus_orchestrator with phase_completed: 'EXECUTE' and include execution results.

**FRACTAL EXECUTION:** Spawn Task() agents for complex work, execute directly for simple tasks.`,

  VERIFY: `You are in the VERIFY phase (Quality Assessment). Your task:
1. Review the original objective against what was delivered
2. Check if all requirements were met with role-specific quality standards
3. Test functionality if applicable
4. Identify any gaps or improvements needed  
5. Call manus_orchestrator with phase_completed: 'VERIFY' and include 'verification_passed': true/false in payload.

Apply rigorous quality assessment with your specialized validation expertise.`,

  DONE: `Task completed successfully. Entering standby mode (Manus: "Enter Standby").`
};

// Meta-prompt generation for Task() agent spawning
export function generateMetaPrompt(todoContent: string, role: Role, context: Record<string, any>): MetaPrompt {
  const config = ROLE_CONFIG[role];
  
  return {
    role_specification: `(ROLE: ${role})`,
    context_parameters: {
      domain_info: context.domain || 'general',
      complexity_level: config.complexityLevel,
      frameworks: config.suggestedFrameworks,
      ...context
    },
    instruction_block: `(PROMPT: "${todoContent} Apply ${role} expertise with ${config.cognitiveFrameworks.join(' and ')} methodologies. Follow ${config.validationRules.join(', ')} validation rules. Use TodoWrite to create your own sub-task breakdown. Report completion with detailed deliverables.")`
    ,
    output_requirements: `(OUTPUT: ${config.defaultOutput})`
  };
}

// Tool gating - enforces Manus's "single tool call per iteration" rule
// Single tool = forced via tool_code, Multiple tools = Claude chooses from whitelist
export const PHASE_ALLOWED_TOOLS: Record<Phase, string[]> = {
  INIT: ['manus_orchestrator'], // Force orchestrator
  QUERY: ['manus_orchestrator'], // Force orchestrator
  ENHANCE: ['manus_orchestrator'], // Force orchestrator  
  KNOWLEDGE: ['WebSearch', 'WebFetch', 'manus_orchestrator'], // Claude chooses research tool or orchestrator
  PLAN: ['TodoWrite'], // Force TodoWrite (orchestrator called after)
  EXECUTE: ['TodoRead', 'TodoWrite', 'Task', 'Bash', 'Read', 'Write', 'Edit', 'Browser'], // Claude chooses execution tool
  VERIFY: ['TodoRead', 'Read'], // Claude chooses verification tool
  DONE: [] // No tools needed
};

// For phases where Claude should choose, we specify the choice in the prompt
export const PHASE_TOOL_GUIDANCE: Record<Phase, string> = {
  INIT: 'Call manus_orchestrator to begin',
  QUERY: 'Call manus_orchestrator with phase_completed: "QUERY"',
  ENHANCE: 'Call manus_orchestrator with phase_completed: "ENHANCE"',
  KNOWLEDGE: 'Choose appropriate tool: WebSearch/WebFetch (research), manus_orchestrator (skip research)',
  PLAN: 'Use TodoWrite to create todos, then call manus_orchestrator with phase_completed: "PLAN"',
  EXECUTE: 'Choose appropriate tool: TodoRead (check todos), Task (spawn agent), Bash/Browser (direct execution)',
  VERIFY: 'Choose appropriate tool: TodoRead (check completion), Read (verify output)',
  DONE: 'No action needed'
};