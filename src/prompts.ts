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
      cognitive_frameworks: config.cognitiveFrameworks,
      ...context
    },
    instruction_block: `(PROMPT: "${todoContent}

${thinkGuidance}

**🎯 EXECUTION APPROACH:**
1. Think through your approach using the ${config.cognitiveFrameworks.join(' and ')} frameworks
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
- Integration points and API design decisions`,

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
- Statistical significance assessment and confidence interval analysis`,

    synthesizer: `**🧠 INTEGRATION REASONING REQUIRED (${config.reasoningMultiplier}x enhancement):** Think holistically about integration and optimization:
- Component integration strategies and system interoperability
- Optimization framework selection and performance metric definition
- Integration testing approaches and quality synthesis validation
- System-level emergence patterns and holistic performance assessment
- Trade-off analysis between conflicting requirements and constraints`
  };

  return roleSpecificThinking[role];
}

// Tool gating - enforces Manus's "single tool call per iteration" rule
// Single tool = forced via tool_code, Multiple tools = Claude chooses from whitelist
export const PHASE_ALLOWED_TOOLS: Record<Phase, string[]> = {
  INIT: ['manus_orchestrator'], // Force orchestrator
  QUERY: ['manus_orchestrator'], // Natural thinking + orchestrator
  ENHANCE: ['manus_orchestrator'], // Natural thinking + orchestrator
  KNOWLEDGE: ['WebSearch', 'WebFetch', 'manus_orchestrator'], // Natural thinking + research tools
  PLAN: ['TodoWrite'], // Natural thinking + planning tools
  EXECUTE: ['TodoRead', 'TodoWrite', 'Task', 'Bash', 'Read', 'Write', 'Edit', 'Browser'], // Natural thinking + execution tools
  VERIFY: ['TodoRead', 'Read'], // Natural thinking + verification tools
  DONE: [] // No tools needed
};

// For phases where Claude should choose, we specify the choice in the prompt
export const PHASE_TOOL_GUIDANCE: Record<Phase, string> = {
  INIT: 'Call manus_orchestrator to begin',
  QUERY: 'Think through the goal analysis, then call manus_orchestrator with phase_completed: "QUERY"',
  ENHANCE: 'Think through enhancement opportunities, then call manus_orchestrator with phase_completed: "ENHANCE"',
  KNOWLEDGE: 'Think through knowledge needs, then choose: WebSearch/WebFetch (research), manus_orchestrator (skip research)',
  PLAN: 'Think through strategic planning, then use TodoWrite to create todos, then call manus_orchestrator with phase_completed: "PLAN"',
  EXECUTE: 'Think through execution approach, then choose: TodoRead (check todos), Task (spawn agent), Bash/Browser (direct execution)',
  VERIFY: 'Think through quality assessment, then choose: TodoRead (check completion), Read (verify output)',
  DONE: 'No action needed'
};