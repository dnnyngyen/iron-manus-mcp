// V0-Style UI Agent Roles - Specialized AI CODE GENERATORS for systematic UI generation
// 
// ✨ IMPORTANT: These are AI personas that GENERATE UI code, NOT UI components themselves
// 
// 🎯 WHAT UI AGENTS DO:
// - UI agents are specialized intelligence that CREATE UI applications using tools
// - They generate HTML files (like manus-fsm-designer.html), React components, CSS, TypeScript
// - Similar to the "coder" agent but focused specifically on UI-related code generation
// - They use Read/Write/Edit tools to create and modify files, not to render UI
// 
// 🔧 HOW UI AGENTS WORK:
// - ui_architect: Plans component architecture and writes specifications/documentation
// - ui_implementer: Generates functional JSX/HTML/CSS code and TypeScript interfaces  
// - ui_refiner: Polishes existing UI code with better styling and optimizations
// 
// 📁 EXAMPLE OUTPUTS:
// - HTML applications: manus-fsm-designer.html (terminal UI designer)
// - React components: Button.tsx, Card.tsx, Dashboard.tsx
// - CSS stylesheets: component.styles.css, theme.css
// - TypeScript interfaces: ComponentProps.ts, ThemeConfig.ts
// 
// 🧠 COGNITIVE ENHANCEMENT:
// Implements ui_architect (3.1x), ui_implementer (2.8x), ui_refiner (2.5x) with V0's design patterns
// Integrated with Component-Cognitive Duality architecture and MCP tool ecosystem

import { Phase, Role, MetaPrompt } from '../core/types.js';

// V0-Style UI Role definitions - These are specialized AI CODE GENERATORS, not UI components
// Each role represents a different type of intelligence for generating UI applications
export type UIRole = 'ui_architect' | 'ui_implementer' | 'ui_refiner';

// Enhanced UI role configuration for AI CODE GENERATORS that create UI applications
// These agents generate code files, not render UI themselves
export interface UIRoleConfig {
  defaultOutput: string;
  focus: string;
  complexityLevel: 'simple' | 'multi-step' | 'complex';
  suggestedFrameworks: string[];
  validationRules: string[];
  cognitiveFrameworks: string[];
  reasoningMultiplier: number;
  authorityLevel: string;
  
  // V0-specific enhancements
  v0Patterns: string[];                      // V0 design patterns (atomic, molecular, organism, template)
  componentLibraries: string[];              // shadcn/ui, Material UI, Chakra UI support
  designSystems: string[];                   // Apple, Notion, minimalist aesthetic patterns
  accessibilityStandards: string[];         // WCAG, WAI-ARIA compliance levels
  performanceTargets: string[];             // Bundle size, Core Web Vitals optimization
  concurrentCapabilities: string[];         // Parallel execution and workflow coordination
}

// V0-Style UI Agent Role Configurations with cognitive multipliers
export const UI_ROLE_CONFIG: Record<UIRole, UIRoleConfig> = {
  ui_architect: {
    defaultOutput: 'systematic_ui_architecture',
    focus: 'component_architecture_planning_and_code_generation',
    complexityLevel: 'complex',
    suggestedFrameworks: ['V0_Design_System', 'Component_Hierarchy', 'shadcn_ui', 'Atomic_Design'],
    validationRules: ['component_hierarchy_validation', 'design_system_consistency', 'accessibility_compliance', 'scalability_assessment'],
    cognitiveFrameworks: ['Systematic Component Architecture', 'V0 Design System Planning', 'Hierarchical UI Decomposition'],
    reasoningMultiplier: 3.1,
    authorityLevel: 'ARCHITECT_AND_SYSTEMATIZE',
    
    // V0-specific CODE GENERATION capabilities - this agent WRITES architectural specifications and plans
    // UI Architect generates: component specs, architectural docs, design system files, not actual UI rendering
    v0Patterns: ['atomic_decomposition', 'molecular_composition', 'organism_integration', 'template_orchestration'],
    componentLibraries: ['shadcn_ui', 'headless_ui', 'radix_ui', 'react_aria'],
    designSystems: ['Apple_HIG', 'Notion_Minimalism', 'Vercel_Design', 'System_Aesthetic'],
    accessibilityStandards: ['WCAG_2.1_AAA', 'WAI_ARIA_1.2', 'Semantic_HTML5', 'Screen_Reader_Optimization'],
    performanceTargets: ['Bundle_Size_Optimization', 'Tree_Shaking_Compatibility', 'Core_Web_Vitals', 'Component_Lazy_Loading'],
    concurrentCapabilities: ['Parallel_Component_Planning', 'Multi_Library_Coordination', 'Cross_Framework_Architecture']
  },
  
  ui_implementer: {
    defaultOutput: 'production_ready_component_code',
    focus: 'concurrent_ui_code_generation_and_implementation',
    complexityLevel: 'multi-step',
    suggestedFrameworks: ['React_JSX_Generation', 'TypeScript_Integration', 'Tailwind_CSS', 'Component_Testing'],
    validationRules: ['jsx_syntax_validation', 'typescript_compatibility', 'props_interface_completeness', 'component_functionality'],
    cognitiveFrameworks: ['Concurrent Implementation Patterns', 'V0 Component Generation', 'Static JSX Optimization'],
    reasoningMultiplier: 2.8,
    authorityLevel: 'IMPLEMENT_AND_OPTIMIZE',
    
    // V0-specific CODE GENERATION capabilities - this agent WRITES functional JSX/HTML/CSS code files
    // UI Implementer generates: React components, HTML files (like manus-fsm-designer.html), CSS, TypeScript interfaces
    v0Patterns: ['static_jsx_generation', 'props_interface_design', 'component_composition', 'variant_system_implementation'],
    componentLibraries: ['shadcn_ui_implementation', 'tailwind_components', 'css_modules', 'styled_components'],
    designSystems: ['Responsive_Implementation', 'Dark_Mode_Support', 'Component_Variants', 'State_Management'],
    accessibilityStandards: ['ARIA_Implementation', 'Keyboard_Navigation', 'Focus_Management', 'Screen_Reader_Support'],
    performanceTargets: ['Component_Memoization', 'Bundle_Splitting', 'Image_Optimization', 'Runtime_Performance'],
    concurrentCapabilities: ['Parallel_JSX_Generation', 'Multi_Component_Implementation', 'Concurrent_Testing', 'Batch_Optimization']
  },
  
  ui_refiner: {
    defaultOutput: 'polished_ui_component_code',
    focus: 'aesthetic_code_refinement_and_optimization',
    complexityLevel: 'multi-step', 
    suggestedFrameworks: ['Apple_Aesthetics', 'Notion_Minimalism', 'Performance_Optimization', 'Accessibility_Enhancement'],
    validationRules: ['aesthetic_quality_assessment', 'performance_benchmarking', 'accessibility_audit', 'user_experience_validation'],
    cognitiveFrameworks: ['Aesthetic Refinement Patterns', 'Performance Optimization Strategies', 'Accessibility Enhancement'],
    reasoningMultiplier: 2.5,
    authorityLevel: 'REFINE_AND_PERFECT',
    
    // V0-specific CODE REFINEMENT capabilities - this agent EDITS and POLISHES existing code
    // UI Refiner improves: CSS styling, animations, accessibility attributes, performance optimizations in code
    v0Patterns: ['component_polishing', 'interaction_refinement', 'visual_hierarchy_optimization', 'micro_interaction_design'],
    componentLibraries: ['component_enhancement', 'animation_integration', 'gesture_support', 'theme_customization'],
    designSystems: ['Clean_Polish', 'Minimal_Aesthetic', 'Professional_Finish', 'Modern_Elegance'],
    accessibilityStandards: ['Enhanced_ARIA', 'Advanced_Navigation', 'Cognitive_Accessibility', 'Motor_Accessibility'],
    performanceTargets: ['Advanced_Optimization', 'Memory_Efficiency', 'Render_Performance', 'Network_Optimization'],
    concurrentCapabilities: ['Parallel_Refinement', 'Multi_Aspect_Optimization', 'Concurrent_Testing', 'Batch_Enhancement']
  }
};

// Enhanced UI role detection with V0 pattern recognition
export function detectUIRole(objective: string): UIRole | null {
  const lowerObjective = objective.toLowerCase();
  
  // UI Architect patterns - systematic design and architecture
  const architectPatterns = [
    'ui architect', 'component architecture', 'design system', 'ui planning',
    'component hierarchy', 'ui structure', 'design patterns', 'component strategy',
    'ui framework', 'design architecture', 'component design', 'ui system design'
  ];
  
  // UI Implementer patterns - concrete implementation and JSX generation
  const implementerPatterns = [
    'ui implement', 'component implement', 'jsx generate', 'component code',
    'ui development', 'component development', 'react component', 'ui coding',
    'component creation', 'ui build', 'component build', 'frontend implement'
  ];
  
  // UI Refiner patterns - aesthetic polish and optimization
  const refinerPatterns = [
    'ui refine', 'component refine', 'ui polish', 'ui enhance',
    'component enhance', 'ui optimize', 'component optimize', 'ui improve',
    'aesthetic refine', 'ui perfect', 'component perfect', 'ui aesthetic'
  ];
  
  // Check for specific role patterns
  if (architectPatterns.some(pattern => lowerObjective.includes(pattern))) {
    return 'ui_architect';
  }
  
  if (implementerPatterns.some(pattern => lowerObjective.includes(pattern))) {
    return 'ui_implementer';
  }
  
  if (refinerPatterns.some(pattern => lowerObjective.includes(pattern))) {
    return 'ui_refiner';
  }
  
  // Check for general UI keywords that might indicate UI work
  const generalUIPatterns = [
    'ui', 'component', 'interface', 'frontend', 'design', 'user interface',
    'react', 'vue', 'svelte', 'tailwind', 'css', 'html', 'jsx', 'tsx'
  ];
  
  if (generalUIPatterns.some(pattern => lowerObjective.includes(pattern))) {
    // Default to ui_architect for general UI tasks requiring systematic approach
    return 'ui_architect';
  }
  
  return null;
}

// Generate V0-style enhanced prompts for UI roles with cognitive amplification
export function generateUIRoleEnhancedPrompt(phase: Phase, role: UIRole, objective: string): string {
  const config = UI_ROLE_CONFIG[role];
  const basePrompt = UI_BASE_PHASE_PROMPTS[phase];
  const toolGuidance = UI_PHASE_TOOL_GUIDANCE[phase];
  
  // Generate V0-specific cognitive enhancement
  const v0Enhancement = generateV0CognitiveEnhancement(role, config);
  
  // Generate component-cognitive duality integration
  const dualityIntegration = generateUIComponentCognitiveDuality(role, config);
  
  const roleSpecificGuidance = generateUIRoleSpecificGuidance(role, config, phase);
  
  const cognitiveEnhancement = `
**🧠 V0-STYLE UI COGNITIVE ENHANCEMENT (${config.reasoningMultiplier}x effectiveness):**
${config.cognitiveFrameworks.join(', ')}

**🎯 UI ROLE-SPECIFIC FOCUS:** ${config.focus}
**📊 UI QUALITY THRESHOLD:** ${config.authorityLevel}
**🔧 V0 FRAMEWORKS:** ${config.suggestedFrameworks.join(', ')}
**🏗️ V0 PATTERNS:** ${config.v0Patterns.join(', ')}
**📚 COMPONENT LIBRARIES:** ${config.componentLibraries.join(', ')}
**🎨 DESIGN SYSTEMS:** ${config.designSystems.join(', ')}

${v0Enhancement}

${dualityIntegration}

${roleSpecificGuidance}

**🛠️ UI TOOL GUIDANCE:** ${toolGuidance}

Apply ${role} expertise with V0-style systematic precision and ${config.reasoningMultiplier}x UI reasoning effectiveness.`;
  
  return basePrompt + cognitiveEnhancement;
}

// Generate V0-style meta-prompts for UI Task() agent spawning
export function generateUIMetaPrompt(todoContent: string, role: UIRole, context: Record<string, any>): MetaPrompt {
  const config = UI_ROLE_CONFIG[role];
  
  // Generate UI-specific Think tool guidance
  const uiThinkGuidance = generateUIRoleSpecificThinkGuidance(role, config);
  
  // Generate V0 component generation framework
  const v0Framework = generateV0ComponentFramework(role, config);
  
  return {
    role_specification: `(ROLE: ${role} with V0-Style Component Generation)`,
    context_parameters: {
      domain_info: context.domain || 'ui_component_generation',
      complexity_level: config.complexityLevel,
      frameworks: [...config.suggestedFrameworks, 'V0_Component_System'],
      reasoning_multiplier: config.reasoningMultiplier,
      cognitive_frameworks: config.cognitiveFrameworks,
      v0_patterns: config.v0Patterns,
      component_libraries: config.componentLibraries,
      design_systems: config.designSystems,
      accessibility_standards: config.accessibilityStandards,
      performance_targets: config.performanceTargets,
      concurrent_capabilities: config.concurrentCapabilities,
      ...context
    },
    instruction_block: `(PROMPT: "${todoContent}

${uiThinkGuidance}

${v0Framework}

**🎯 V0-STYLE UI EXECUTION APPROACH:**
1. Think through your UI approach using the ${config.cognitiveFrameworks.join(' and ')} frameworks
2. Apply ${role} expertise with ${config.reasoningMultiplier}x UI cognitive enhancement
3. Follow ${config.validationRules.join(', ')} UI validation rules
4. Use TodoWrite to create your own UI sub-task breakdown if needed
5. Think through V0-style component implementation strategy and potential challenges
6. Execute with systematic precision using ${config.suggestedFrameworks.join(' and ')} + V0 methodologies
7. Apply ${config.v0Patterns.join(', ')} component generation patterns
8. Think critically about UI work quality against ${config.authorityLevel} standards before completion
9. Report completion with detailed UI deliverables and component specifications

**🧠 V0 UI COGNITIVE ENHANCEMENT:** Your UI reasoning effectiveness is enhanced ${config.reasoningMultiplier}x through systematic V0-style thinking, component generation patterns, and UI-specific frameworks.")`
    ,
    output_requirements: `(OUTPUT: ${config.defaultOutput} with V0 Component Specifications)`
  };
}

// V0-style base phase prompts for UI-specific workflows
const UI_BASE_PHASE_PROMPTS: Record<Phase, string> = {
  INIT: `You are initializing a V0-style UI task. This should not be reached - call manus_orchestrator immediately.`,
  
  QUERY: `You are in the UI QUERY phase (V0: Component Analysis). Your UI-specific task:

Think through your V0-style UI analysis approach before proceeding. Consider:
- What UI components or interfaces does the user really need at their core?
- What are the key design requirements, constraints, and aesthetic preferences?
- What component hierarchy and design system patterns are most appropriate?
- What frameworks, libraries, and tools should be integrated (React, shadcn/ui, Tailwind)?
- What accessibility, performance, and responsive design requirements exist?

After analyzing the UI situation, proceed with:
1. Parse the user's UI goal and identify key design requirements and component needs
2. Clarify any ambiguous UI aspects, aesthetic preferences, or technical constraints
3. Identify what type of UI task this is (architecture, implementation, refinement)
4. Detect the primary UI role needed (ui_architect/ui_implementer/ui_refiner)
5. Call manus_orchestrator with phase_completed: 'QUERY' and include your UI interpretation in the payload as 'interpreted_goal'.

Focus on understanding the core UI objective with V0-style systematic component analysis.`,

  ENHANCE: `You are in the UI ENHANCE phase (V0: Component Enhancement). Your UI-specific task:

Think through how to enhance and refine the interpreted UI goal with V0-style systematic patterns. Consider:
- What important UI details, component specifications, or design patterns might be missing?
- What edge cases, responsive breakpoints, or accessibility requirements should be considered?
- What component libraries, design systems, or UI frameworks will be needed?
- What potential UI challenges, browser compatibility, or performance constraints might arise?
- How can you make this UI goal more comprehensive, systematic, and production-ready?

After evaluating these UI aspects, proceed with:
1. Take the interpreted UI goal and enhance it with missing component specifications
2. Consider UI edge cases, responsive design, or accessibility requirements not explicitly stated
3. Determine what UI libraries, frameworks, or design system resources you'll need
4. Identify potential UI challenges, performance constraints, or cross-browser compatibility issues
5. Call manus_orchestrator with phase_completed: 'ENHANCE' and include the enhanced UI understanding in payload as 'enhanced_goal'.

Focus on making the UI goal comprehensive and systematically actionable with V0-style component planning.`,

  KNOWLEDGE: `You are in the UI KNOWLEDGE phase (V0: Component Research). Your UI-specific task:

Think through your V0-style UI knowledge requirements before proceeding. Assess:
- Do you need external UI information (component libraries, design patterns, documentation) for this task?
- If UI research is needed, what specific component specifications, design guidelines, or implementation examples should you gather?
- What relevant UI knowledge do you already possess about the requested frameworks, libraries, or design systems?
- Are there any technical UI constraints, browser compatibility, or accessibility requirements to research?
- What UI knowledge gaps might exist that could impact component generation success?

After evaluating your UI knowledge needs, proceed with:
1. Determine if you need external UI information (component docs, design system guides, implementation examples)
2. If UI research is needed, note what specific component specifications or design patterns to gather
3. If no external UI research is needed, summarize relevant UI knowledge you already have
4. Identify any technical UI constraints, accessibility standards, or framework requirements
5. Call manus_orchestrator with phase_completed: 'KNOWLEDGE' and include your UI findings in payload as 'knowledge_gathered'.

Gather essential UI knowledge using your V0-style component generation expertise.`,

  PLAN: `You are in the UI PLAN phase (V0: Component Planning). Your UI-specific task:

Think strategically about how to break down this UI goal using V0-style systematic component generation. Consider:
- What is the optimal UI component breakdown strategy for this specific design goal?
- Which UI tasks require specialized UI Task() agent expertise vs direct component generation?
- What are the component dependencies, design system integration, and implementation timeline considerations?
- What UI complexity challenges might arise during component generation and implementation?
- How can you ensure the UI plan is systematically actionable and follows V0 patterns?

After strategic UI analysis, proceed with:
1. Break down the enhanced UI goal into specific, actionable component generation steps
2. Use TodoWrite to create a detailed UI task breakdown with V0-style component hierarchy
3. For complex UI sub-tasks that need specialized expertise, embed MetaPrompt structure in todo content
4. Format complex UI todos as: "(ROLE: ui_agent_type) (CONTEXT: component_domain) (PROMPT: detailed_ui_instructions) (OUTPUT: component_deliverables)"
5. After creating UI todos, call manus_orchestrator with phase_completed: 'PLAN' and include 'plan_created': true in payload.

**V0 COMPONENT ORCHESTRATION:** Mark UI todos that should spawn specialized UI Task() agents with detailed component meta-prompts. Use TodoWrite now.`,

  EXECUTE: `You are in the UI EXECUTE phase (V0: Component Code Generation). Your UI-specific task:

Think through your V0-style UI CODE GENERATION strategy before taking action. Analyze:
- What UI code files need to be created or modified (HTML, JSX, CSS, TypeScript)?
- What is the optimal V0-style approach for generating this specific UI code?
- Should you use direct Write/Edit tools or spawn specialized UI Task() agents?
- What potential code challenges, browser compatibility, or accessibility issues might you encounter?
- What V0 code generation and validation strategies should you have ready?

After analyzing the UI code generation approach, proceed with:
1. Use TodoRead to see your current UI code generation tasks and priorities
2. For UI todos with meta-prompts (ROLE/CONTEXT/PROMPT/OUTPUT), use Task() tool to spawn specialized UI code generators
3. For direct UI execution todos, use Write, Edit, Read tools to CREATE UI code files
4. **Single tool per iteration** (Manus requirement) - call one tool, then return to orchestrator
5. After each significant UI code generation action, call manus_orchestrator with phase_completed: 'EXECUTE' and include UI execution results.

**V0 CODE GENERATION EXECUTION:** Spawn specialized UI Task() agents for complex code generation, execute directly for simple file creation.`,

  VERIFY: `You are in the UI VERIFY phase (V0: Component Validation). Your UI-specific task:

Think critically about the quality and completeness of the UI work using V0-style validation standards. Evaluate:
- How do the actual UI deliverables compare to the original component generation objective?
- Have all UI requirements been met according to V0-style quality standards and component specifications?
- What UI gaps, accessibility issues, or performance optimizations might be needed?
- What are the UI success criteria and have they been achieved (responsiveness, accessibility, performance)?
- What is the best approach to verify UI functionality, component integration, and cross-browser compatibility?

After thorough UI quality assessment, proceed with:
1. Review the original UI objective against what UI components were delivered
2. Check if all UI requirements were met with V0-style quality standards and component specifications
3. Test UI functionality, responsiveness, accessibility, and performance if applicable
4. Identify any UI gaps, component issues, or optimizations needed
5. Call manus_orchestrator with phase_completed: 'VERIFY' and include 'verification_passed': true/false in payload.

Apply rigorous V0-style UI quality assessment with your specialized UI validation expertise.`,

  DONE: `UI task completed successfully using V0-style systematic component generation. Entering standby mode.`
};

// UI-specific tool guidance for V0-style workflows
const UI_PHASE_TOOL_GUIDANCE: Record<Phase, string> = {
  INIT: 'Call manus_orchestrator to begin V0-style UI workflow',
  QUERY: 'Think through the V0-style UI goal analysis, then call manus_orchestrator with phase_completed: "QUERY"',
  ENHANCE: 'Think through V0 component enhancement opportunities, then call manus_orchestrator with phase_completed: "ENHANCE"',
  KNOWLEDGE: 'Think through UI knowledge needs, then choose: WebSearch/WebFetch (UI research), manus_orchestrator (skip UI research)',
  PLAN: 'Think through V0-style strategic UI planning, then use TodoWrite to create component todos, then call manus_orchestrator with phase_completed: "PLAN"',
  EXECUTE: 'Think through V0 UI execution approach, then choose: TodoRead (check UI todos), Task (spawn UI agent), Write/Edit/Read (direct component generation)',
  VERIFY: 'Think through V0-style UI quality assessment, then choose: TodoRead (check UI completion), Read (verify UI output)',
  DONE: 'No action needed - V0-style UI workflow completed'
};

// UI-specific allowed tools with component generation focus
export const UI_ROLE_ALLOWED_TOOLS: Record<Phase, string[]> = {
  INIT: ['manus_orchestrator'],
  QUERY: ['manus_orchestrator'],
  ENHANCE: ['manus_orchestrator'], 
  KNOWLEDGE: ['WebSearch', 'WebFetch', 'manus_orchestrator'],
  PLAN: ['TodoWrite'],
  EXECUTE: ['TodoRead', 'TodoWrite', 'Task', 'Write', 'Edit', 'Read', 'MultiEdit'], // CODE GENERATION tools - UI agents create files
  VERIFY: ['TodoRead', 'Read'],
  DONE: []
};

// ========================================
// 🎯 CRITICAL UNDERSTANDING: UI AGENTS ARE CODE GENERATORS
// ========================================
//
// UI agents (ui_architect, ui_implementer, ui_refiner) are specialized AI personas that:
//
// ✅ WHAT THEY ARE:
// - Intelligent code generators focused on UI-related tasks
// - Similar to the "coder" agent but specialized for UI development
// - They generate files: HTML, JSX, CSS, TypeScript, documentation
//
// ✅ WHAT THEY DO:
// - Use Write/Edit/Read tools to CREATE UI applications
// - Generate complete applications like manus-fsm-designer.html
// - Create React components, styling, and TypeScript interfaces
// - Write architectural documentation and specifications
//
// ❌ WHAT THEY ARE NOT:
// - They are NOT UI components themselves
// - They do NOT render or display user interfaces
// - They are NOT part of any UI rendering pipeline
// - They are NOT visual elements or widgets
//
// 🔧 EXAMPLE WORKFLOW:
// 1. User: "Create a dashboard component"
// 2. ui_architect: Plans component architecture, writes specifications
// 3. ui_implementer: Generates Dashboard.tsx, Dashboard.css, types
// 4. ui_refiner: Polishes styling and adds animations
// 5. Result: Code files that can be used in applications
//
// The generated code creates applications like manus-fsm-designer.html,
// but the UI agents themselves are the intelligence that creates the code.
// ========================================

// Generate V0-specific cognitive enhancement for UI roles
function generateV0CognitiveEnhancement(role: UIRole, config: UIRoleConfig): string {
  const roleSpecificEnhancement: Record<UIRole, string> = {
    ui_architect: `**🏗️ V0 ARCHITECTURAL ENHANCEMENT:**
- Apply Atomic Design hierarchy: ${config.v0Patterns.join(' → ')}
- Systematic component architecture planning with ${config.reasoningMultiplier}x effectiveness
- Design system integration: ${config.designSystems.join(', ')}
- Accessibility-first architecture: ${config.accessibilityStandards.join(', ')}
- Performance-optimized component planning: ${config.performanceTargets.join(', ')}`,

    ui_implementer: `**⚡ V0 IMPLEMENTATION ENHANCEMENT:**
- Concurrent JSX generation with ${config.reasoningMultiplier}x implementation speed
- Component library integration: ${config.componentLibraries.join(', ')}
- Static component generation patterns: ${config.v0Patterns.join(', ')}
- TypeScript-first component interfaces with full accessibility support
- Parallel implementation workflows: ${config.concurrentCapabilities.join(', ')}`,

    ui_refiner: `**✨ V0 REFINEMENT ENHANCEMENT:**
- Aesthetic polish with ${config.reasoningMultiplier}x refinement precision
- Apple-Notion design aesthetics: ${config.designSystems.join(', ')}
- Advanced accessibility optimization: ${config.accessibilityStandards.join(', ')}
- Performance micro-optimizations: ${config.performanceTargets.join(', ')}
- Multi-aspect concurrent refinement: ${config.concurrentCapabilities.join(', ')}`
  };

  return roleSpecificEnhancement[role];
}

// Generate component-cognitive duality integration for UI roles
function generateUIComponentCognitiveDuality(role: UIRole, config: UIRoleConfig): string {
  return `**🔄 COMPONENT-COGNITIVE DUALITY INTEGRATION:**
- Seamless switching between UI generation and cognitive orchestration modes
- V0 component patterns integrated with Manus FSM phases
- Unified constraint validation across component/project/ecosystem levels
- ${config.reasoningMultiplier}x cognitive enhancement applied to UI-specific reasoning
- Cross-domain efficiency optimization for both UI generation and cognitive orchestration`;
}

// Generate UI role-specific guidance for each phase
function generateUIRoleSpecificGuidance(role: UIRole, config: UIRoleConfig, phase: Phase): string {
  const phaseSpecificGuidance: Record<UIRole, Record<Phase, string>> = {
    ui_architect: {
      INIT: '',  
      QUERY: '**🏗️ ARCHITECTURAL ANALYSIS:** Focus on component hierarchy, design system patterns, and systematic UI architecture planning.',
      ENHANCE: '**🏗️ ARCHITECTURAL ENHANCEMENT:** Consider component composition, design system integration, and scalable architecture patterns.',
      KNOWLEDGE: '**🏗️ ARCHITECTURAL RESEARCH:** Gather design system documentation, component library specifications, and architectural best practices.',
      PLAN: '**🏗️ ARCHITECTURAL PLANNING:** Create systematic component breakdown using Atomic Design principles and V0 patterns.',
      EXECUTE: '**🏗️ ARCHITECTURAL EXECUTION:** Focus on high-level component structure, design system definition, and architectural documentation.',
      VERIFY: '**🏗️ ARCHITECTURAL VALIDATION:** Verify component hierarchy, design consistency, and architectural scalability.',
      DONE: ''
    },
    ui_implementer: {
      INIT: '',
      QUERY: '**⚡ IMPLEMENTATION ANALYSIS:** Focus on technical requirements, component specifications, and implementation feasibility.',
      ENHANCE: '**⚡ IMPLEMENTATION ENHANCEMENT:** Consider technical constraints, framework integration, and implementation complexity.',
      KNOWLEDGE: '**⚡ IMPLEMENTATION RESEARCH:** Gather technical documentation, API references, and implementation examples.',
      PLAN: '**⚡ IMPLEMENTATION PLANNING:** Create detailed technical breakdown with concurrent execution strategies.',
      EXECUTE: '**⚡ IMPLEMENTATION EXECUTION:** Generate production-ready JSX components with TypeScript interfaces and full functionality.',
      VERIFY: '**⚡ IMPLEMENTATION VALIDATION:** Test component functionality, TypeScript compilation, and integration compatibility.',
      DONE: ''
    },
    ui_refiner: {
      INIT: '',
      QUERY: '**✨ REFINEMENT ANALYSIS:** Focus on aesthetic requirements, polish opportunities, and optimization potential.',
      ENHANCE: '**✨ REFINEMENT ENHANCEMENT:** Consider aesthetic details, performance optimizations, and accessibility improvements.',
      KNOWLEDGE: '**✨ REFINEMENT RESEARCH:** Gather design inspiration, performance benchmarks, and accessibility guidelines.',
      PLAN: '**✨ REFINEMENT PLANNING:** Create systematic polish and optimization breakdown with quality metrics.',
      EXECUTE: '**✨ REFINEMENT EXECUTION:** Apply aesthetic polish, performance optimizations, and accessibility enhancements.',
      VERIFY: '**✨ REFINEMENT VALIDATION:** Verify aesthetic quality, performance metrics, and accessibility compliance.',
      DONE: ''
    }
  };

  return phaseSpecificGuidance[role][phase] || '';
}

// Generate UI-specific Think tool guidance for cognitive enhancement
function generateUIRoleSpecificThinkGuidance(role: UIRole, config: UIRoleConfig): string {
  const roleSpecificThinking: Record<UIRole, string> = {
    ui_architect: `**🧠 V0 ARCHITECTURAL THINKING REQUIRED (${config.reasoningMultiplier}x enhancement):** Think systematically about UI architecture:
- Component hierarchy design using Atomic Design principles (atoms → molecules → organisms → templates)
- Design system architecture and component library integration patterns
- Accessibility-first architectural decisions and WAI-ARIA integration strategies
- Performance-optimized component architecture and bundle size considerations
- Scalable component composition patterns and reusability optimization
- Cross-framework compatibility and design system portability`,

    ui_implementer: `**🧠 V0 IMPLEMENTATION THINKING REQUIRED (${config.reasoningMultiplier}x enhancement):** Think systematically about UI implementation:
- Concurrent JSX generation strategies and parallel component development
- TypeScript interface design and props API optimization for component reusability
- Component library integration patterns and framework-specific implementations
- Static component generation with runtime performance optimization
- Accessibility implementation strategies and semantic HTML structure
- Testing strategy for component functionality and integration compatibility`,

    ui_refiner: `**🧠 V0 REFINEMENT THINKING REQUIRED (${config.reasoningMultiplier}x enhancement):** Think systematically about UI refinement:
- Aesthetic polish strategies using Apple-Notion design principles and minimalist aesthetics
- Performance micro-optimizations and Core Web Vitals enhancement techniques
- Advanced accessibility refinement including cognitive and motor accessibility patterns
- Component animation and micro-interaction design for enhanced user experience
- Cross-browser compatibility testing and progressive enhancement strategies
- Design system consistency validation and component quality assurance`
  };

  return roleSpecificThinking[role];
}

// Generate V0 component generation framework guidance
function generateV0ComponentFramework(role: UIRole, config: UIRoleConfig): string {
  return `**🔧 V0 COMPONENT GENERATION FRAMEWORK:**
- **Component Patterns:** ${config.v0Patterns.join(', ')}
- **Library Integration:** ${config.componentLibraries.join(', ')}
- **Design Systems:** ${config.designSystems.join(', ')}
- **Accessibility Standards:** ${config.accessibilityStandards.join(', ')}
- **Performance Targets:** ${config.performanceTargets.join(', ')}
- **Concurrent Capabilities:** ${config.concurrentCapabilities.join(', ')}
- **Validation Requirements:** ${config.validationRules.join(', ')}

Apply V0-style systematic component generation with ${config.reasoningMultiplier}x cognitive enhancement for superior UI development outcomes.`;
}