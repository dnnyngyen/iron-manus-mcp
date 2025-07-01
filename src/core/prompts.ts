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
  CognitiveContext,
} from './types.js';
// UI agent role functions will be implemented when needed

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
      'Consider all stakeholders and their constraints',
    ],
    authorityLevel: 'STRATEGIZE_AND_COORDINATE',
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
      'Analyze performance implications and optimization opportunities',
    ],
    authorityLevel: 'IMPLEMENT_AND_VALIDATE',
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
      'Evaluate maintainability, performance, and reliability trade-offs',
    ],
    authorityLevel: 'EVALUATE_AND_REFINE',
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
      'Assess research methodology quality and potential biases',
    ],
    authorityLevel: 'INVESTIGATE_AND_SYNTHESIZE',
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
      'Question assumptions and consider alternative explanations',
    ],
    authorityLevel: 'ANALYZE_AND_REPORT',
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
      'Ensure coherent, maintainable, and scalable results',
    ],
    authorityLevel: 'INTEGRATE_AND_OPTIMIZE',
  },
  // V0-Style UI Agent Roles - Convert UIRoleConfig to RoleConfig for compatibility
  ui_architect: {
    defaultOutput: 'component_architecture',
    focus: 'ui_system_design',
    complexityLevel: 'complex',
    suggestedFrameworks: ['V0', 'component_hierarchy', 'design_systems'],
    validationRules: [
      'has_component_structure',
      'follows_design_system',
      'accessibility_compliant',
    ],
    thinkingMethodology: [
      'Consider user needs, workflows, and accessibility requirements first',
      'Design reusable, composable component hierarchies',
      'Plan for scalability, maintainability, and future growth',
      'Ensure accessibility standards and diverse user abilities',
    ],
    authorityLevel: 'DESIGN_AND_ARCHITECT',
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
      'Write maintainable, readable, and well-documented code',
    ],
    authorityLevel: 'IMPLEMENT_AND_RENDER',
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
      'Ensure compliance with accessibility and web standards',
    ],
    authorityLevel: 'REFINE_AND_POLISH',
  },
};

/**
 * Generate role selection prompt for Claude
 * Creates a structured prompt for Claude to intelligently select roles
 * @param objective - User's objective/goal
 * @returns Formatted prompt for Claude
 */
export function generateRoleSelectionPrompt(objective: string): string {
  const availableRoles = [
    {
      name: 'planner',
      description: 'Strategic planning, architecture design, system planning, project management',
      best_for: 'Breaking down complex goals, creating strategies, designing system architecture',
    },
    {
      name: 'coder',
      description: 'Implementation, programming, development, building applications',
      best_for: 'Writing code, implementing features, building applications, technical execution',
    },
    {
      name: 'critic',
      description: 'Quality assessment, security review, code review, validation',
      best_for: 'Security analysis, code review, quality assurance, validation tasks',
    },
    {
      name: 'researcher',
      description: 'Information gathering, knowledge synthesis, documentation research',
      best_for: 'Research tasks, information gathering, documentation, knowledge work',
    },
    {
      name: 'analyzer',
      description: 'Data analysis, metrics analysis, performance analysis, insights',
      best_for: 'Data analysis, performance metrics, statistical analysis, insights generation',
    },
    {
      name: 'synthesizer',
      description: 'Integration, optimization, combining systems, workflow coordination',
      best_for: 'Integration tasks, optimization, combining multiple systems, workflow design',
    },
    {
      name: 'ui_architect',
      description: 'UI architecture, design systems, component architecture, interface design',
      best_for: 'UI/UX architecture, design systems, component planning, interface design',
    },
    {
      name: 'ui_implementer',
      description: 'UI implementation, component building, frontend development',

      best_for: 'Frontend development, UI component implementation, interface building',
    },
    {
      name: 'ui_refiner',
      description: 'UI refinement, styling, aesthetics, polish, optimization',
      best_for: 'UI polish, styling refinement, aesthetic improvements, UX optimization',
    },
  ];

  const roleList = availableRoles
    .map(
      (role, index) =>
        `${index + 1}. **${role.name}**
   - Description: ${role.description}
   - Best for: ${role.best_for}`
    )
    .join('\n\n');

  return `# Role Selection for Task Execution

## Objective
${objective}

## Available Roles (9 total)
${roleList}

## Your Task
Analyze the objective and select the SINGLE most appropriate role for this task. Consider:

1. **Primary Focus**: What is the main type of work required?
2. **Task Complexity**: Which role has the best fit for this complexity level?
3. **Specialized Focus**: UI roles have specialized thinking methodologies for interface design
4. **Domain Expertise**: Which role's expertise best matches the objective?

## Advanced Options
You can also:
- **Suggest a new role** if none of the existing roles are optimal
- **Explain why** multiple roles might be needed for complex objectives
- **Recommend role sequencing** if the task requires multiple phases

## Response Format
Return a JSON object with your role selection:
\`\`\`json
{
  "selected_role": "role_name",
  "confidence": 0.95,
  "reasoning": "Brief explanation why this role is optimal",
  "alternative_suggestion": "optional: suggest new role or multi-role approach if needed"
}
\`\`\`

Select the BEST SINGLE role for the primary objective. Be decisive and intelligent.`;
}

/**
 * Parse Claude's role selection response
 * @param claudeResponse - Claude's response containing selected role
 * @returns Selected role or fallback to hardcoded detection
 */
export function parseClaudeRoleSelection(claudeResponse: string, objective: string): Role {
  try {
    // Extract JSON from Claude's response
    const jsonMatch = claudeResponse.match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch) {
      console.warn('No JSON found in Claude role response, falling back to hardcoded detection');
      return detectRole(objective);
    }

    const selection = JSON.parse(jsonMatch[1]);

    if (!selection.selected_role) {
      console.warn('No selected_role in Claude response, falling back');
      return detectRole(objective);
    }

    // Validate the selected role
    const validRoles: Role[] = [
      'planner',
      'coder',
      'critic',
      'researcher',
      'analyzer',
      'synthesizer',
      'ui_architect',
      'ui_implementer',
      'ui_refiner',
    ];

    if (validRoles.includes(selection.selected_role as Role)) {
      return selection.selected_role as Role;
    } else {
      console.warn(`Invalid role selected: ${selection.selected_role}, falling back`);
      return detectRole(objective);
    }
  } catch (error) {
    console.error('Error parsing Claude role selection:', error);
    return detectRole(objective);
  }
}

// Enhanced role detection including UI roles (LEGACY METHOD - replicates Manus's module selection)
export function detectRole(objective: string): Role {
  const lowerObjective = objective.toLowerCase();

  // Check for UI context patterns FIRST - these should override generic roles
  const uiContextPatterns = [
    'modern_web_ui_design',
    'ui_design',
    'component_design',
    'frontend_development',
    'web_ui',
    'interface_design',
    'ui_implementation',
    'ui_architecture',
  ];

  const contextMatch = objective.match(/\(CONTEXT:\s*([^)]+)\)/i);
  const hasUIContext =
    contextMatch &&
    uiContextPatterns.some(pattern => contextMatch[1].toLowerCase().includes(pattern));

  // If we have UI context, override any generic roles with UI-specific ones
  if (hasUIContext) {
    // Check refiner patterns first (most specific)
    if (
      lowerObjective.includes('refine') ||
      lowerObjective.includes('polish') ||
      lowerObjective.includes('optimize') ||
      lowerObjective.includes('styling')
    ) {
      return 'ui_refiner';
    }
    // Then architect patterns
    if (
      lowerObjective.includes('architect') ||
      lowerObjective.includes('design system') ||
      lowerObjective.includes('plan')
    ) {
      return 'ui_architect';
    }
    // Then implementer patterns
    if (
      lowerObjective.includes('implement') ||
      lowerObjective.includes('code') ||
      lowerObjective.includes('build')
    ) {
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
    if (explicitRole === 'ui_implementer' || explicitRole === 'ui-implementer')
      return 'ui_implementer';
    if (explicitRole === 'ui_refiner' || explicitRole === 'ui-refiner') return 'ui_refiner';
    if (explicitRole === 'planner') return 'planner';
    if (explicitRole === 'coder') return 'coder';
    if (explicitRole === 'critic') return 'critic';
    if (explicitRole === 'researcher') return 'researcher';
    if (explicitRole === 'analyzer') return 'analyzer';
    if (explicitRole === 'synthesizer') return 'synthesizer';
  }

  // First check for UI-specific roles in content
  if (
    lowerObjective.includes('ui') &&
    (lowerObjective.includes('architect') || lowerObjective.includes('design system'))
  ) {
    return 'ui_architect';
  }
  if (
    lowerObjective.includes('ui') &&
    (lowerObjective.includes('implement') || lowerObjective.includes('component'))
  ) {
    return 'ui_implementer';
  }
  if (
    lowerObjective.includes('ui') &&
    (lowerObjective.includes('refine') || lowerObjective.includes('polish'))
  ) {
    return 'ui_refiner';
  }

  // Planner keywords
  if (
    lowerObjective.includes('plan') ||
    lowerObjective.includes('strategy') ||
    lowerObjective.includes('design') ||
    lowerObjective.includes('architect')
  ) {
    return 'planner';
  }

  // Coder keywords
  if (
    lowerObjective.includes('implement') ||
    lowerObjective.includes('code') ||
    lowerObjective.includes('build') ||
    lowerObjective.includes('develop') ||
    lowerObjective.includes('program')
  ) {
    return 'coder';
  }

  // Critic keywords
  if (
    lowerObjective.includes('review') ||
    lowerObjective.includes('analyze') ||
    lowerObjective.includes('security') ||
    lowerObjective.includes('audit') ||
    lowerObjective.includes('validate')
  ) {
    return 'critic';
  }

  // Analyzer keywords
  if (
    lowerObjective.includes('analyze') ||
    lowerObjective.includes('data') ||
    lowerObjective.includes('metrics') ||
    lowerObjective.includes('statistics')
  ) {
    return 'analyzer';
  }

  // Synthesizer keywords
  if (
    lowerObjective.includes('integrate') ||
    lowerObjective.includes('combine') ||
    lowerObjective.includes('merge') ||
    lowerObjective.includes('optimize')
  ) {
    return 'synthesizer';
  }

  // Default to researcher (like Manus Knowledge Module)
  return 'researcher';
}

// Generate enhanced prompts with role-specific cognitive enhancement + tool guidance
export function generateRoleEnhancedPrompt(phase: Phase, role: Role, objective: string): string {
  // UI role support will be added in future enhancement
  // For now, treat UI roles as standard roles with enhanced focus

  const config = ROLE_CONFIG[role];
  let basePrompt = BASE_PHASE_PROMPTS[phase];
  let toolGuidance = PHASE_TOOL_GUIDANCE[phase];

  // Special handling for KNOWLEDGE phase to inject role-specific API guidance
  if (phase === 'KNOWLEDGE') {
    const roleAPIGuidance = getRoleSpecificAPIGuidance(role);
    basePrompt = basePrompt.replace(
      'INTELLIGENT API SELECTION: Based on your role and objective, select APIs that match your domain expertise. Each role has preferred API categories and workflows optimized for their specific needs.',
      `INTELLIGENT API SELECTION: Based on your role and objective:

${roleAPIGuidance}`
    );
  }

  // Add Python execution guidance if beneficial for this role and objective
  if (requiresPythonExecution(objective, role) && phase === 'EXECUTE') {
    const pythonGuidance =
      role === 'analyzer'
        ? ' **Python Analysis Recommended**: Use mcp__ide__executeCode for statistical analysis, data processing, and metrics calculation.'
        : ' **Python Computation Recommended**: Use mcp__ide__executeCode for complex algorithms, calculations, or code generation.';
    toolGuidance += pythonGuidance;
  }

  const thinkingMethodology = `

THINKING METHODOLOGY FOR ${role.toUpperCase()}:
${config.thinkingMethodology.map(step => `• ${step}`).join('\n')}

FOCUS: ${config.focus}
FRAMEWORKS: ${config.suggestedFrameworks.join(', ')}

**🛠️ TOOL GUIDANCE:** ${toolGuidance}

Apply these thinking steps systematically to improve reasoning quality and thoroughness.`;

  return basePrompt + thinkingMethodology;
}

// Base phase prompts (enhanced for fractal orchestration)
const BASE_PHASE_PROMPTS: Record<Phase, string> = {
  INIT: `You are initializing a new task. This should not be reached - call JARVIS immediately.`,

  QUERY: `You are in the QUERY phase (Manus: "Analyze Events"). Your task:

Think through your analysis approach before proceeding. Consider:
- What is the user really asking for at its core?
- What are the key requirements and constraints?
- Are there any ambiguities that need clarification?
- What type of task is this (research, coding, deployment, etc.)?

CLAUDE-POWERED ROLE SELECTION:
{{#if awaiting_role_selection}}
The system needs your intelligent analysis to select the most appropriate role for this task. Your understanding of context and nuance is far superior to keyword matching. Here's the task:

{{role_selection_prompt}}

**Your Task:**
1. Analyze the objective and select the optimal role
2. Consider task complexity, domain expertise, and thinking methodologies
3. Respond with the exact JSON format specified above
4. After role selection, continue with goal interpretation

{{else}}

ROLE SELECTED: {{detected_role}}
The system has determined your optimal role based on the objective analysis.

{{/if}}

After role considerations, proceed with:
1. Parse the user's goal and identify key requirements
2. Clarify any ambiguous aspects 
3. Identify what type of task this is (research, coding, deployment, etc.)
4. Call JARVIS with phase_completed: 'QUERY' and include your interpretation in the payload as 'interpreted_goal'.

Focus on understanding the core objective with your specialized role expertise.`,

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
5. Call JARVIS with phase_completed: 'ENHANCE' and include the enhanced understanding in payload as 'enhanced_goal'.

Focus on making the goal comprehensive and actionable with your specialized perspective.`,

  KNOWLEDGE: `You are in the KNOWLEDGE phase (Parallel Research Orchestration). Your task:

Think strategically about your research approach. Consider:
- What are the key knowledge domains required for this objective?
- How can parallel specialist agents maximize research efficiency?
- What comprehensive research coverage is needed?
- How should findings be synthesized for maximum insight?

**🚀 PARALLEL RESEARCH ORCHESTRATION PROTOCOL:**

1. **CREATE SESSION WORKSPACE**: First establish agent communication infrastructure:
   \`mkdir -p ./iron-manus-sessions/{{session_id}}\`

2. **SPAWN SPECIALIZED RESEARCH AGENTS** (3-5 agents working in parallel):

**Core Research Agents:**
- Primary Researcher: "(ROLE: researcher) (CONTEXT: primary_domain_research) (PROMPT: Conduct comprehensive research on core topic requirements using PARALLEL SEARCH OPTIMIZATION: batch multiple WebSearch/WebFetch calls in a single response for maximum speed, then write detailed findings to ./iron-manus-sessions/{{session_id}}/primary_research.md) (OUTPUT: research_report)"

- Data Analyzer: "(ROLE: analyzer) (CONTEXT: quantitative_analysis) (PROMPT: Research and analyze quantitative aspects, metrics, performance data using PARALLEL SEARCH OPTIMIZATION: batch multiple APISearch/MultiAPIFetch calls simultaneously for faster data gathering, then write analytical insights to ./iron-manus-sessions/{{session_id}}/analysis_data.md) (OUTPUT: analytical_insights)"

- Technical Specialist: "(ROLE: coder) (CONTEXT: technical_implementation) (PROMPT: Research technical approaches, frameworks, tools using PARALLEL SEARCH OPTIMIZATION: batch multiple WebSearch/WebFetch calls in parallel for rapid information gathering, then write specifications to ./iron-manus-sessions/{{session_id}}/technical_specs.md) (OUTPUT: technical_specifications)"

**Optional Specialized Agents** (based on objective complexity):
- Domain Expert: "(ROLE: critic) (CONTEXT: domain_expertise) (PROMPT: Research best practices, security considerations using PARALLEL SEARCH OPTIMIZATION: batch multiple WebSearch/APISearch calls for comprehensive coverage, then write expert recommendations to ./iron-manus-sessions/{{session_id}}/expert_review.md) (OUTPUT: expert_recommendations)"

3. **COORDINATION PROTOCOL**:
   - Each agent writes findings to designated session workspace files
   - Agents work independently with no direct context sharing
   - Wait for all research agents to complete before synthesis

4. **SYNTHESIS PHASE**:
   After all research agents complete, spawn synthesis agent:
   "(ROLE: synthesizer) (CONTEXT: knowledge_integration) (PROMPT: Read all research files from ./iron-manus-sessions/{{session_id}}/ directory, cross-validate findings, resolve contradictions, and if additional research is needed use PARALLEL SEARCH OPTIMIZATION: batch multiple WebSearch/APISearch calls for gap-filling, then write comprehensive synthesized knowledge to ./iron-manus-sessions/{{session_id}}/synthesized_knowledge.md) (OUTPUT: synthesized_knowledge)"

5. **INTEGRATION AND COMPLETION**:
   - Read the synthesized_knowledge.md file from ./iron-manus-sessions/{{session_id}}/
   - Integrate findings into session knowledge base
   - Call JARVIS with phase_completed: 'KNOWLEDGE' and include comprehensive findings in payload as 'knowledge_gathered'

**🔄 FALLBACK TO TRADITIONAL RESEARCH:**
If Task() agent spawning isn't suitable for the objective, use traditional tools:
- WebSearch/WebFetch for supplementary research  
- APISearch/MultiAPIFetch for specific data sources
- For knowledge integration: spawn synthesizer agent: "(ROLE: synthesizer) (CONTEXT: knowledge_integration) (PROMPT: Synthesize findings from research using systematic integration methodologies) (OUTPUT: integrated_knowledge)"

**📋 CRITICAL AGENT COMMUNICATION RULES:**
- Task() agents have isolated contexts and cannot directly share data
- All inter-agent communication MUST use session workspace files
- Always specify exact file paths in agent prompts
- Session workspace: ./iron-manus-sessions/{{session_id}}/

Choose your research approach based on objective complexity and proceed accordingly.`,

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
5. After creating todos, call JARVIS with phase_completed: 'PLAN' and include 'plan_created': true in payload.

**FRACTAL ORCHESTRATION:** Mark todos that should spawn Task() agents with detailed meta-prompts. Use TodoWrite now.`,

  EXECUTE: `You are in the EXECUTE phase (Manus Datasource Module). Your task:

Think through your execution strategy before taking action. Analyze:
- What is the current task complexity and scope?
- What is the optimal execution approach for this specific task?
- Should you use direct tools or spawn specialized Task() agents?
- Can parallel agent coordination improve efficiency?
- What potential challenges might you encounter?
- What mitigation strategies should you have ready?

**📂 SESSION WORKSPACE AVAILABLE**: ./iron-manus-sessions/{{session_id}}/
Use this workspace for agent coordination and file-based communication.

After analyzing the execution approach, proceed with:

**🔄 PARALLEL EXECUTION ORCHESTRATION:**
For complex objectives, consider spawning multiple Task() agents in parallel:

1. **Check Current Tasks**: Use TodoRead to see your current tasks
2. **PARALLEL SPAWNING STRATEGY**: For complex work, spawn 2-4 specialized Task() agents simultaneously:
   - Implementation agents for different components
   - Validation agents for testing and quality assurance  
   - Integration agents for system coordination
   - Use session workspace for agent file coordination

3. **Meta-Prompt Agent Spawning**: For todos with meta-prompts (ROLE/CONTEXT/PROMPT/OUTPUT), spawn Task() agents with enhanced file coordination
4. **Direct Execution**: For direct execution todos, use Bash, Browser, Read, Write, Edit tools
5. **Coordination Protocol**: Monitor agent results using session workspace files
6. **Single tool per iteration** (Manus requirement) - but can spawn multiple Task() agents in one iteration

## Enhanced Task() Tool Usage:
When you see a todo formatted as "(ROLE: agent_type) (CONTEXT: domain) (PROMPT: instructions) (OUTPUT: deliverable)", convert it to:

Task() with parameters:
- description: Use the structured format: "(ROLE: agent_type) (CONTEXT: domain) (PROMPT: brief_task_description) (OUTPUT: deliverable)"
- prompt: Enhanced version with detailed context, implementation guidance, role-specific methodologies, and **session workspace file coordination instructions**

**Agent File Coordination Pattern:**
Include in Task() prompts: "Write your results to ./iron-manus-sessions/{{session_id}}/agent_[role]_output.md"

**PARALLEL SEARCH OPTIMIZATION for Task Agents:**
Include in Task() prompts: "Use PARALLEL SEARCH OPTIMIZATION: batch multiple WebSearch/WebFetch/APISearch calls in a single response for maximum research speed"

The Task() tool creates an independent Claude instance that:
- Starts with fresh context
- Has access to the same tools you do
- Works autonomously on the specific task
- **Communicates through session workspace files**
- Reports back when complete

**PARALLEL EXECUTION FRAMEWORK:** Automatically recognize when parallel execution would improve efficiency and spawn appropriate specialized agents with proper file coordination.

Use Task() for complex work requiring specialized expertise. Use direct tools for simple operations.`,

  VERIFY: `You are in the VERIFY phase (Quality Assessment). Your task:

Think critically about the quality and completeness of the work. Evaluate:
- How do the actual deliverables compare to the original objective?
- Have all requirements been met according to role-specific quality standards?
- What gaps or improvements might be needed?
- What are the success criteria and have they been achieved?
- What is the best approach to verify functionality and quality?

**🔗 HOOK INTEGRATION:** Before making your final decision, review any structured feedback from validation hooks. If a block decision was issued, you must address the reason in your next step.

After thorough quality assessment, proceed with:
1. Review the original objective against what was delivered
2. Check if all requirements were met with role-specific quality standards
3. Test functionality if applicable
4. Identify any gaps or improvements needed
5. Call JARVIS with phase_completed: 'VERIFY' and include 'verification_passed': true/false in payload.

Apply rigorous quality assessment with your specialized validation expertise.`,

  DONE: `Task completed successfully. Entering standby mode (Manus: "Enter Standby").`,
};

// Meta-prompt generation for Task() agent spawning with Think tool integration
export function generateMetaPrompt(
  todoContent: string,
  role: Role,
  context: Record<string, any>
): MetaPrompt {
  // UI roles are handled the same as standard roles now

  const config = ROLE_CONFIG[role];

  // Generate role-specific Think tool guidance
  const thinkGuidance = generateRoleSpecificThinkGuidance(role, config);

  return {
    role_specification: `(ROLE: ${role})`,
    context_parameters: {
      domain_info: context.domain || 'general',
      complexity_level: config.complexityLevel,
      frameworks: config.suggestedFrameworks,
      cognitive_frameworks: config.cognitiveFrameworks || config.suggestedFrameworks,
      ...context,
    },
    instruction_block: `(PROMPT: "${todoContent}

${thinkGuidance}

EXECUTION APPROACH:
1. Think through your approach using the ${(config.cognitiveFrameworks || config.suggestedFrameworks).join(' and ')} frameworks
2. Apply ${role} expertise with systematic thinking methodologies
3. Follow ${config.validationRules.join(', ')} validation rules
4. Use TodoWrite to create your own sub-task breakdown if needed
5. Think through implementation strategy and potential challenges
6. Execute with systematic precision using ${config.suggestedFrameworks.join(' and ')} methodologies
7. Think critically about work quality against ${config.authorityLevel} standards before completion
8. Report completion with detailed deliverables

COGNITIVE ENHANCEMENT: Your reasoning effectiveness is enhanced through systematic thinking and role-specific frameworks.")`,
    output_requirements: `(OUTPUT: ${config.defaultOutput})`,
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
      frameworks: [
        ...config.suggestedFrameworks,
        'V0_Component_Generation',
        'Unified_Constraint_System',
      ],
      cognitive_frameworks: config.cognitiveFrameworks || config.suggestedFrameworks,
      reasoning_mode: cognitiveContext.reasoning_mode,
      duality_effectiveness: cognitiveContext.duality_effectiveness,
      constraint_count: constraints.length,
      encapsulation_patterns: duality.ecosystem_session_mapping.encapsulation_patterns.length,
      orchestration_mode: duality.project_phase_mapping.orchestration_mode,
      ...context,
    },
    instruction_block: `(PROMPT: "${todoContent}

${dualityGuidance}

${constraintFramework}

${encapsulationGuidance}

COMPONENT-COGNITIVE EXECUTION APPROACH:
1. Think through your approach using unified ${(config.cognitiveFrameworks || config.suggestedFrameworks).join(' and ')} + V0 Component Generation frameworks
2. Apply ${role} expertise with systematic thinking methodologies and duality integration
3. Follow ${config.validationRules.join(', ')} validation rules + unified constraint validation
4. Use TodoWrite to create your own sub-task breakdown if needed (Level 2 Task Agent decomposition)
5. Think through implementation strategy considering both cognitive orchestration and component generation patterns
6. Execute with systematic precision using ${config.suggestedFrameworks.join(', ')} + V0 encapsulation methodologies
7. Apply unified constraint hierarchy: Component-level → Project-level → Ecosystem-level constraints
8. Think critically about work quality against ${config.authorityLevel} + Component-Cognitive Duality standards
9. Report completion with detailed deliverables including constraint satisfaction metrics

COMPONENT-COGNITIVE ENHANCEMENT: Your reasoning effectiveness is enhanced through systematic thinking, role-specific frameworks, and unified constraint-driven component generation.")`,
    output_requirements: `(OUTPUT: ${config.defaultOutput} + Component-Cognitive Duality Metrics)`,
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
    component_generation: `COMPONENT GENERATION REASONING: Think systematically about V0-style component creation:
- Component hierarchy and composition patterns (atomic → composite → ecosystem)
- Framework-specific constraints (React/Vue/Svelte patterns)
- Accessibility compliance and WAI-ARIA integration
- Styling system integration (Tailwind/Material UI/Chakra UI)
- Props interface design and component API definition
- Performance optimization and bundle size considerations`,

    cognitive_orchestration: `COGNITIVE ORCHESTRATION REASONING: Think strategically about Manus FSM orchestration:`,

    unified: `UNIFIED REASONING: Think holistically combining both approaches:`,

    component_focused: `COMPONENT-FOCUSED REASONING: Focus on component generation:`,

    cognitive_focused: `COGNITIVE-FOCUSED REASONING: Focus on cognitive orchestration:
- Phase transition logic and state management
- Task decomposition and fractal orchestration
- Role-based cognitive enhancement application
- Reasoning effectiveness optimization
- Session state persistence and performance tracking
- Constraint validation and compliance enforcement`,

    hybrid_duality: `HYBRID DUALITY REASONING: Think holistically about unified component-cognitive patterns:
- Bidirectional mapping between V0 Component↔Manus Task hierarchies
- Unified constraint propagation across component/project/ecosystem scopes
- Encapsulation pattern integration with cognitive orchestration
- Performance synergy between component generation and cognitive reasoning
- Cross-domain optimization and architectural elegance
- Duality effectiveness metrics and continuous improvement`,
  };

  const constraintGuidance =
    constraints.length > 0
      ? `\n- Active unified constraints: ${constraints.map(c => `${c.type}(${c.scope})`).join(', ')}`
      : '';

  return modeSpecificGuidance[reasoningMode] + constraintGuidance;
}

// Generate constraint-aware execution framework
function generateConstraintAwareFramework(constraints: UnifiedConstraint[], role: Role): string {
  if (constraints.length === 0) {
    return '**🔒 CONSTRAINT FRAMEWORK:** No active constraints - use default role frameworks.';
  }

  const constraintsByScope = constraints.reduce(
    (acc, constraint) => {
      if (!acc[constraint.scope]) acc[constraint.scope] = [];
      acc[constraint.scope].push(constraint);
      return acc;
    },
    {} as Record<string, UnifiedConstraint[]>
  );

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
function generateEncapsulationPatternGuidance(
  patterns: EncapsulationPattern[],
  role: Role
): string {
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
    'analyze',
    'statistics',
    'metrics',
    'performance',
    'data',
    'calculate',
    'measure',
    'benchmark',
    'correlation',
    'pattern',
    'trend',
    'visualization',
  ];

  // Python indicators for coder role
  const codingIndicators = [
    'algorithm',
    'computation',
    'complex calculation',
    'generate code',
    'template',
    'optimization',
    'mathematical',
    'numerical',
    'processing',
  ];

  if (
    role === 'analyzer' &&
    analysisIndicators.some(indicator => lowerObjective.includes(indicator))
  ) {
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
    planner: `STRATEGIC THINKING REQUIRED: Think strategically about:
- System architecture and component relationships
- Strategic decomposition using Hierarchical Decomposition framework
- Dependencies, timelines, and resource allocation
- Risk assessment and mitigation strategies
- Success criteria and validation checkpoints`,

    coder: `IMPLEMENTATION REASONING REQUIRED: Think through the implementation approach:
- Modular architecture design patterns and component boundaries
- Test-driven development approach and testing strategy
- Error handling, edge cases, and robustness considerations
- Code maintainability, readability, and convention adherence
- Integration points and API design decisions
- **Python Execution**: For complex algorithms, calculations, or code generation, use EnhancedPythonDataScience (complete workflows), PythonExecutor (code with auto-install), or mcp__ide__executeCode (direct execution)`,

    critic: `CRITICAL ASSESSMENT REQUIRED: Think critically about quality and security:
- Security vulnerabilities and attack vectors using Security-First Assessment
- Code quality, performance bottlenecks, and optimization opportunities
- Compliance with standards, regulations, and best practices
- Multi-layer validation across functional, security, and performance dimensions
- Risk severity assessment and remediation prioritization`,

    researcher: `RESEARCH ANALYSIS REQUIRED: Think systematically about the research approach:
- Parallel research validation strategies and source credibility assessment
- Information synthesis patterns and data correlation analysis
- Research scope boundaries and information completeness criteria
- Source triangulation and verification methodologies
- Knowledge gaps identification and research direction prioritization
- **Data Collection**: Use EnhancedPythonDataScience for web scraping, data extraction, and research automation`,

    analyzer: `ANALYTICAL REASONING REQUIRED: Think analytically about the data and patterns:
- Multi-dimensional analysis matrix construction and variable relationships
- Statistical pattern recognition and data correlation significance
- Data validation methodologies and quality assurance protocols
- Pattern verification strategies and anomaly detection approaches
- Statistical significance assessment and confidence interval analysis
- **Python Analysis**: Use PythonDataAnalysis (code generation), EnhancedPythonDataScience (complete workflows), or mcp__ide__executeCode for statistical analysis, data processing, performance metrics calculation, and visualization`,

    synthesizer: `INTEGRATION REASONING REQUIRED: Think holistically about integration and optimization:
- Component integration strategies and system interoperability
- Optimization framework selection and performance metric definition
- Integration testing approaches and quality synthesis validation
- System-level emergence patterns and holistic performance assessment
- Trade-off analysis between conflicting requirements and constraints`,

    ui_architect: `UI ARCHITECTURE REASONING REQUIRED: Think systematically about UI design architecture:
- Component hierarchy and design system structure
- User experience flow and interaction patterns
- Accessibility and inclusive design principles
- Design token systems and theming architecture`,

    ui_implementer: `UI IMPLEMENTATION REASONING REQUIRED: Think through UI implementation:
- Component implementation patterns and best practices
- Responsive design and cross-device compatibility
- Performance optimization for UI rendering
- Integration with design systems and style guides`,

    ui_refiner: `UI REFINEMENT REASONING REQUIRED: Think critically about UI refinement:
- Visual polish and aesthetic improvements
- User interaction feedback and micro-interactions
- Cross-browser compatibility and testing
- Accessibility compliance and usability testing`,
  };

  return roleSpecificThinking[role];
}

// Tool gating - enforces Manus's "single tool call per iteration" rule
// Single tool = forced via tool_code, Multiple tools = Claude chooses from whitelist
export const PHASE_ALLOWED_TOOLS: Record<Phase, string[]> = {
  INIT: ['JARVIS'], // Force orchestrator
  QUERY: ['JARVIS'], // Natural thinking + orchestrator
  ENHANCE: ['JARVIS'], // Natural thinking + orchestrator
  KNOWLEDGE: [
    'Task',
    'WebSearch',
    'WebFetch',
    'APISearch',
    'MultiAPIFetch',
    'mcp__ide__executeCode',
    'PythonDataAnalysis',
    'PythonExecutor',
    'EnhancedPythonDataScience',
    'JARVIS',
  ], // Parallel agent spawning + research tools + API tools + data processing + Python analysis
  PLAN: ['TodoWrite'], // Natural thinking + planning tools
  EXECUTE: [
    'TodoRead',
    'TodoWrite',
    'Task',
    'Bash',
    'Read',
    'Write',
    'Edit',
    'Browser',
    'mcp__ide__executeCode',
    'PythonDataAnalysis',
    'PythonExecutor',
    'EnhancedPythonDataScience',
  ], // Natural thinking + execution tools + Python execution + data science
  VERIFY: ['TodoRead', 'Read', 'mcp__ide__executeCode', 'PythonDataAnalysis', 'EnhancedPythonDataScience'], // Natural thinking + verification tools + analysis + data validation
  DONE: [], // No tools needed
};

// For phases where Claude should choose, we specify the choice in the prompt
export const PHASE_TOOL_GUIDANCE: Record<Phase, string> = {
  INIT: 'Call JARVIS to begin',
  QUERY: 'Think through the goal analysis, then call JARVIS with phase_completed: "QUERY"',
  ENHANCE:
    'Think through enhancement opportunities, then call JARVIS with phase_completed: "ENHANCE"',
  KNOWLEDGE:
    'Think through knowledge needs, then choose: Task (spawn parallel research agents), WebSearch/WebFetch (traditional research), PythonDataAnalysis/EnhancedPythonDataScience (data science code generation), mcp__ide__executeCode (direct Python execution), JARVIS (skip research)',
  PLAN: 'Think through strategic planning, then use TodoWrite to create todos, then call JARVIS with phase_completed: "PLAN"',
  EXECUTE:
    'Think through execution approach, then choose: TodoRead (check todos), Task (spawn agent), Bash/Browser (direct execution), EnhancedPythonDataScience (complete data science workflows), PythonExecutor (Python code with auto-install), mcp__ide__executeCode (direct Python execution)',
  VERIFY:
    'Think through quality assessment, then choose: TodoRead (check completion), Read (verify output), PythonDataAnalysis/EnhancedPythonDataScience (data validation and analysis), mcp__ide__executeCode (analytical verification)',
  DONE: 'No action needed',
};

// Role-specific API guidance generation for KNOWLEDGE phase
function getRoleSpecificAPIGuidance(role: Role): string {
  const roleGuidance: Record<Role, string> = {
    researcher: `
**📚 RESEARCHER API PREFERENCES:**
- **Primary Categories**: Books, academic papers, scientific data, educational resources
- **Recommended Workflow**: APISearch → academic/reference APIs → MultiAPIFetch → synthesizer agent for integration
- **Key APIs**: Open Library, Google Books, NASA API, academic databases
- **Confidence Threshold**: 0.8+ (high confidence for research accuracy)
- **Synthesis Mode**: 'consensus' for academic validation, 'hierarchical' for authoritative sources
- **Evidence Standards**: Peer-reviewed sources preferred, multiple source triangulation required`,

    analyzer: `
ANALYZER API PREFERENCES:
- **Primary Categories**: Financial data, cryptocurrency, business metrics, statistical APIs
- **Recommended Workflow**: APISearch → financial/data APIs → MultiAPIFetch → synthesizer agent for integration
- **Key APIs**: Alpha Vantage, CoinGecko, business analytics, market data sources
- **Confidence Threshold**: 0.7+ (balance between accuracy and data availability)
- **Synthesis Mode**: 'weighted' for reliability-based analysis, 'conflict_resolution' for market data
- **Evidence Standards**: Real-time data preferred, historical trend validation essential`,

    ui_architect: `
UI ARCHITECT API PREFERENCES:
- **Primary Categories**: Design inspiration, color palettes, typography, visual frameworks
- **Recommended Workflow**: APISearch → design/visual APIs → MultiAPIFetch → synthesizer agent for integration
- **Key APIs**: Unsplash, Colormind, design systems, font APIs, visual inspiration platforms
- **Confidence Threshold**: 0.6+ (balance creativity with reliability)
- **Synthesis Mode**: 'consensus' for design standards, 'weighted' for aesthetic choices
- **Evidence Standards**: Current design trends, accessibility compliance data, user experience metrics`,

    ui_implementer: `
**⚙️ UI IMPLEMENTER API PREFERENCES:**
- **Primary Categories**: Component libraries, CSS frameworks, development tools, design tokens
- **Recommended Workflow**: APISearch → implementation APIs → MultiAPIFetch → synthesizer agent for integration
- **Key APIs**: Design system APIs, CSS framework documentation, component libraries
- **Confidence Threshold**: 0.7+ (implementation accuracy critical)
- **Synthesis Mode**: 'hierarchical' for official documentation, 'consensus' for best practices
- **Evidence Standards**: Official documentation preferred, tested implementation patterns required`,

    ui_refiner: `
**✨ UI REFINER API PREFERENCES:**
- **Primary Categories**: Accessibility standards, performance optimization, user experience metrics
- **Recommended Workflow**: APISearch → optimization/UX APIs → MultiAPIFetch → synthesizer agent for integration
- **Key APIs**: Accessibility checkers, performance monitoring, user experience analytics
- **Confidence Threshold**: 0.8+ (refinement requires high precision)
- **Synthesis Mode**: 'hierarchical' for standards compliance, 'conflict_resolution' for UX trade-offs
- **Evidence Standards**: WCAG compliance data, performance benchmarks, user testing results`,

    coder: `
**💻 CODER API PREFERENCES:**
- **Primary Categories**: Development tools, documentation, code examples, testing frameworks
- **Recommended Workflow**: APISearch → dev tool APIs → MultiAPIFetch → synthesizer agent for integration
- **Key APIs**: GitHub, Stack Overflow, documentation sites, package repositories
- **Confidence Threshold**: 0.7+ (balance between completeness and accuracy)
- **Synthesis Mode**: 'consensus' for best practices, 'weighted' for framework-specific guidance
- **Evidence Standards**: Tested code examples, maintained documentation, community validation`,

    planner: `
**📋 PLANNER API PREFERENCES:**
- **Primary Categories**: Project management, scheduling, productivity tools, organizational systems
- **Recommended Workflow**: APISearch → planning/productivity APIs → MultiAPIFetch → synthesizer agent for integration
- **Key APIs**: Calendar systems, project management platforms, productivity metrics APIs
- **Confidence Threshold**: 0.7+ (planning accuracy important for execution)
- **Synthesis Mode**: 'hierarchical' for methodology frameworks, 'consensus' for timeline estimation
- **Evidence Standards**: Proven methodologies, historical project data, resource availability metrics`,

    critic: `
**🔍 CRITIC API PREFERENCES:**
- **Primary Categories**: Security scanners, quality metrics, testing frameworks, compliance data
- **Recommended Workflow**: APISearch → security/quality APIs → MultiAPIFetch → synthesizer agent for integration
- **Key APIs**: Security vulnerability databases, code quality metrics, compliance checkers
- **Confidence Threshold**: 0.9+ (security and quality require highest confidence)
- **Synthesis Mode**: 'conflict_resolution' for security findings, 'hierarchical' for compliance standards
- **Evidence Standards**: Verified vulnerability data, security best practices, compliance documentation`,

    synthesizer: `
**🔄 SYNTHESIZER API PREFERENCES:**
- **Primary Categories**: Integration platforms, data transformation, workflow automation, cross-domain APIs
- **Recommended Workflow**: APISearch → integration APIs → MultiAPIFetch → synthesizer agent for integration
- **Key APIs**: Data transformation services, workflow platforms, integration frameworks
- **Confidence Threshold**: 0.7+ (balance integration complexity with reliability)
- **Synthesis Mode**: 'weighted' for integration patterns, 'consensus' for compatibility standards
- **Evidence Standards**: Tested integration patterns, compatibility matrices, performance benchmarks`,
  };

  return roleGuidance[role] || roleGuidance.researcher; // Default to researcher if role not found
}

// UI agent configurations are now imported from dedicated modules
