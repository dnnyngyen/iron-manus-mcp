/**
 * @fileoverview Conceptual Presentation Template Guides for Metaprompting-First Design
 *
 * This module defines conceptual template guides that serve as intelligent prompting frameworks
 * rather than rigid APIs. Each template is a metaprompt that guides AI agents to creatively
 * interpret and design presentation elements while maintaining structural coherence.
 *
 * Philosophy: These are conversation starters, not constraints.
 * - Templates prompt thinking rather than dictate structure
 * - Each guide encourages creative interpretation within context
 * - Agents use these as conceptual frameworks, not mechanical templates
 *
 * Metaprompting-First Principle:
 * Instead of rigid template APIs that constrain creativity, these guides elicit intelligence
 * from agents to design contextually appropriate presentation elements.
 *
 * @version 1.0.0
 * @since 1.0.0
 */

/**
 * Conceptual template guide interface for intelligent presentation creation
 */
export interface ConceptualTemplateGuide {
  /** Unique identifier for the template concept */
  id: string;
  /** Human-readable name for the template concept */
  name: string;
  /** Core purpose that this template concept serves */
  purpose: string;
  /** Metaprompt that guides agent thinking about this concept */
  metaprompt: string;
  /** Strategic thinking questions to guide creative interpretation */
  thinkingQuestions: string[];
  /** Common elements that agents might consider (not requirements) */
  suggestedElements: string[];
  /** Examples of how this concept might be interpreted contextually */
  contextualExamples: string[];
}

/**
 * Presentation Opening Concept - Guide for creating impactful presentation beginnings
 */
export const PRESENTATION_OPENING_CONCEPT: ConceptualTemplateGuide = {
  id: 'presentation_opening',
  name: 'Presentation Opening Concept',
  purpose:
    'Create an engaging, contextually appropriate presentation opening that captures attention and establishes the narrative foundation',
  metaprompt: `
You are creating the opening moment of a presentation - the crucial first impression that sets the tone and direction for everything that follows.

Think strategically about this opening:
- What is the most compelling way to introduce this topic to THIS specific audience?
- How can you immediately establish relevance and value for the listeners?
- What opening approach best serves the presentation's ultimate objectives?
- How does the context (setting, time, audience energy) influence your approach?

Consider this opening as the foundation of a conversation you're beginning with intelligent, engaged people.
What would make them lean forward with interest rather than settle back with resignation?`,
  thinkingQuestions: [
    'What does this audience care most deeply about, and how does this presentation connect to those concerns?',
    'What opening approach would create immediate engagement without being gimmicky?',
    'How can the opening preview the value and journey without giving everything away?',
    'What tone and energy level best serve both the content and the context?',
    'How might cultural, professional, or situational factors influence the opening strategy?',
  ],
  suggestedElements: [
    'Compelling hook or attention-grabber appropriate to context',
    'Clear value proposition for the audience',
    'Presenter credibility establishment',
    'Presentation roadmap or journey preview',
    'Audience engagement or connection element',
  ],
  contextualExamples: [
    'Executive briefing: Start with strategic impact and business implications',
    'Technical conference: Open with intriguing problem or innovation',
    'Educational setting: Begin with relatable scenario or surprising insight',
    'Sales presentation: Lead with customer success story or pain point resolution',
  ],
};

/**
 * Content Overview Concept - Guide for creating navigational frameworks
 */
export const CONTENT_OVERVIEW_CONCEPT: ConceptualTemplateGuide = {
  id: 'content_overview',
  name: 'Content Overview Concept',
  purpose:
    'Provide audiences with a clear navigational framework that builds anticipation and understanding of the presentation journey',
  metaprompt: `
You are creating a roadmap for an intellectual journey - helping your audience understand where you're taking them and why.

This is not just a list of topics, but a strategic preview that:
- Builds anticipation for what's coming
- Shows logical progression and connections between ideas
- Helps the audience mentally prepare for the content depth and focus
- Establishes expectations for engagement and interaction

Think of this as setting the stage for collaborative exploration rather than passive consumption.`,
  thinkingQuestions: [
    'How can this overview build genuine anticipation rather than just listing topics?',
    'What level of detail helps without overwhelming or spoiling key insights?',
    'How does the sequence of topics create logical flow and building understanding?',
    'What does the audience need to know about the journey to be fully engaged participants?',
    'How might interactive elements or audience involvement enhance this overview?',
  ],
  suggestedElements: [
    'Clear section titles that preview value',
    'Logical flow indication between topics',
    'Time allocation or depth indicators',
    'Interaction or participation expectations',
    'Key outcomes or takeaways preview',
  ],
  contextualExamples: [
    'Workshop format: Include hands-on activities and break timing',
    'Research presentation: Show methodology, findings, and implications flow',
    'Strategy briefing: Map from analysis through recommendations to implementation',
    'Training session: Progress from concepts through practice to application',
  ],
};

/**
 * Core Content Concept - Guide for creating substantive information delivery
 */
export const CORE_CONTENT_CONCEPT: ConceptualTemplateGuide = {
  id: 'core_content',
  name: 'Core Content Concept',
  purpose:
    'Deliver substantive information in ways that promote understanding, retention, and practical application',
  metaprompt: `
You are crafting the substantial intellectual content that justifies your audience's time and attention.

This content should:
- Transform complex information into accessible, actionable insights
- Respect your audience's intelligence while acknowledging their context
- Create understanding that persists beyond the presentation moment
- Balance depth with clarity, complexity with practicality

Ask yourself: If this were the only slide people remembered, would it have delivered genuine value?`,
  thinkingQuestions: [
    'What is the core insight or understanding this content should create?',
    'How can complex information be made accessible without oversimplification?',
    'What examples, analogies, or applications will make this concrete and memorable?',
    'How does this content build on previous understanding and prepare for what follows?',
    "What level of detail serves the audience's actual needs and constraints?",
  ],
  suggestedElements: [
    'Clear key message or central insight',
    'Supporting evidence or reasoning',
    'Relevant examples or applications',
    'Visual aids that enhance understanding',
    'Connection to audience context and needs',
  ],
  contextualExamples: [
    'Technical topic: Use analogies and progressive complexity building',
    'Data presentation: Show patterns and implications, not just numbers',
    'Process explanation: Emphasize decision points and practical application',
    'Conceptual framework: Provide concrete examples of abstract principles',
  ],
};

/**
 * Data Visualization Concept - Guide for creating meaningful data presentations
 */
export const DATA_VISUALIZATION_CONCEPT: ConceptualTemplateGuide = {
  id: 'data_visualization',
  name: 'Data Visualization Concept',
  purpose:
    'Transform data into compelling visual narratives that reveal insights and support decision-making',
  metaprompt: `
You are creating a visual story with data - transforming numbers into insights that drive understanding and action.

Effective data visualization:
- Reveals patterns and relationships that numbers alone cannot communicate
- Guides the audience to specific insights rather than overwhelming with detail
- Supports the narrative while maintaining analytical integrity
- Respects both the data's accuracy and the audience's time

Consider: What story is this data telling, and how can visualization make that story both clear and compelling?`,
  thinkingQuestions: [
    'What specific insight or pattern should the audience take away from this data?',
    'Which visualization approach best reveals the key relationships or trends?',
    'How can visual design guide attention to the most important elements?',
    'What context does the audience need to interpret this data meaningfully?',
    'How does this data visualization support the broader presentation narrative?',
  ],
  suggestedElements: [
    'Chart type optimized for the data story',
    'Clear labeling and context',
    'Visual hierarchy emphasizing key insights',
    'Appropriate scale and comparison frameworks',
    'Integration with narrative flow',
  ],
  contextualExamples: [
    'Trend analysis: Use line charts with clear annotations for inflection points',
    'Comparison data: Bar charts with strategic color coding for emphasis',
    'Process metrics: Dashboard-style layouts showing multiple related indicators',
    'Geographic data: Maps or regional breakdowns with context for decision-making',
  ],
};

/**
 * Case Study Concept - Guide for creating compelling narrative examples
 */
export const CASE_STUDY_CONCEPT: ConceptualTemplateGuide = {
  id: 'case_study',
  name: 'Case Study Concept',
  purpose:
    'Present real-world applications that make abstract concepts concrete and demonstrate practical value',
  metaprompt: `
You are sharing a story that transforms abstract concepts into tangible reality - showing how ideas work in practice.

An effective case study:
- Demonstrates principles through authentic experience
- Helps audience envision application in their own context
- Builds credibility through concrete examples
- Reveals both successes and realistic challenges

Think of this as providing evidence that your concepts work in the messy reality of actual implementation.`,
  thinkingQuestions: [
    'What specific principle or concept does this case study best illustrate?',
    'How can this example help the audience envision application in their context?',
    'What balance of detail provides credibility without losing focus?',
    'What challenges or limitations should be acknowledged for authenticity?',
    "How does this case study connect to the audience's likely experiences or concerns?",
  ],
  suggestedElements: [
    'Clear context and background',
    'Challenge or opportunity description',
    'Approach or solution implementation',
    'Results and outcomes measurement',
    'Lessons learned or applications',
  ],
  contextualExamples: [
    'Technology implementation: Show problem, solution approach, results, and scalability',
    'Process improvement: Document baseline, intervention, metrics, and sustainability',
    'Strategic initiative: Map planning through execution to outcomes and learning',
    'Customer success: Present challenge, partnership, solution, and mutual value creation',
  ],
};

/**
 * Summary Conclusion Concept - Guide for creating memorable and actionable endings
 */
export const SUMMARY_CONCLUSION_CONCEPT: ConceptualTemplateGuide = {
  id: 'summary_conclusion',
  name: 'Summary Conclusion Concept',
  purpose:
    'Synthesize key insights into memorable takeaways and clear next steps that persist beyond the presentation',
  metaprompt: `
You are crafting the moment that determines what people actually DO with everything they've just learned.

An effective conclusion:
- Crystallizes the most important insights into memorable form
- Connects understanding to specific action possibilities
- Provides clear pathways for continued engagement or implementation
- Leaves audience feeling empowered rather than overwhelmed

Consider: Three months from now, what do you want people to remember and act upon from this presentation?`,
  thinkingQuestions: [
    'What are the 2-3 most important insights that should persist beyond today?',
    'What specific actions can the audience realistically take based on this presentation?',
    'How can these takeaways be made memorable and actionable?',
    'What support or resources do people need to move from understanding to implementation?',
    'How can you end with energy and commitment rather than just summary?',
  ],
  suggestedElements: [
    'Core insights synthesis',
    'Specific next steps or actions',
    'Resources or support information',
    'Contact or follow-up mechanisms',
    'Motivational or inspirational closing',
  ],
  contextualExamples: [
    'Training conclusion: Immediate application opportunities and ongoing support',
    'Strategic presentation: Decision points, timeline, and accountability framework',
    'Research findings: Implications for practice and further investigation needs',
    'Sales conclusion: Clear next steps, value proposition recap, and engagement pathway',
  ],
};

/**
 * Interactive Engagement Concept - Guide for creating audience participation elements
 */
export const INTERACTIVE_ENGAGEMENT_CONCEPT: ConceptualTemplateGuide = {
  id: 'interactive_engagement',
  name: 'Interactive Engagement Concept',
  purpose:
    'Create meaningful audience participation that enhances learning and maintains engagement',
  metaprompt: `
You are designing moments where the audience becomes active participants in the learning or decision-making process.

Effective interaction:
- Serves the content objectives rather than just breaking monotony
- Respects audience expertise and time constraints
- Creates genuine engagement rather than performative participation
- Builds on interaction results to deepen understanding

Consider: How can audience involvement enhance rather than interrupt the intellectual journey?`,
  thinkingQuestions: [
    'What specific learning or engagement objective does this interaction serve?',
    'How can participation feel meaningful rather than forced or artificial?',
    'What does the audience bring that enhances the content or discussion?',
    'How will you handle diverse participation levels and comfort zones?',
    'How do interaction results integrate back into the presentation flow?',
  ],
  suggestedElements: [
    'Clear participation instructions',
    'Meaningful discussion prompts',
    'Integration mechanism for responses',
    'Inclusive participation approaches',
    'Connection to content objectives',
  ],
  contextualExamples: [
    'Strategic session: Break into small groups for scenario planning',
    'Technical training: Hands-on problem-solving exercises',
    'Research presentation: Audience polling on applications or priorities',
    'Change management: Role-playing or challenge identification exercises',
  ],
};

/**
 * Complete collection of all conceptual template guides
 */
export const PRESENTATION_TEMPLATE_GUIDES: Record<string, ConceptualTemplateGuide> = {
  presentation_opening: PRESENTATION_OPENING_CONCEPT,
  content_overview: CONTENT_OVERVIEW_CONCEPT,
  core_content: CORE_CONTENT_CONCEPT,
  data_visualization: DATA_VISUALIZATION_CONCEPT,
  case_study: CASE_STUDY_CONCEPT,
  summary_conclusion: SUMMARY_CONCLUSION_CONCEPT,
  interactive_engagement: INTERACTIVE_ENGAGEMENT_CONCEPT,
};

/**
 * Get a specific conceptual template guide by ID
 */
export function getTemplateGuide(templateId: string): ConceptualTemplateGuide | undefined {
  return PRESENTATION_TEMPLATE_GUIDES[templateId];
}

/**
 * Get all available template guide IDs
 */
export function getAvailableTemplateIds(): string[] {
  return Object.keys(PRESENTATION_TEMPLATE_GUIDES);
}

/**
 * Get a metaprompt for a specific template concept, customized for context
 */
export function generateTemplateMetaprompt(
  templateId: string,
  context: {
    audience?: string;
    objective?: string;
    constraints?: string;
    setting?: string;
  } = {}
): string {
  const guide = getTemplateGuide(templateId);
  if (!guide) {
    throw new Error(`Template guide not found: ${templateId}`);
  }

  let metaprompt = `# ${guide.name} - ${guide.purpose}\n\n${guide.metaprompt}`;

  if (Object.keys(context).length > 0) {
    metaprompt += '\n\n**Context for this presentation:**\n';
    if (context.audience) metaprompt += `- **Audience**: ${context.audience}\n`;
    if (context.objective) metaprompt += `- **Objective**: ${context.objective}\n`;
    if (context.constraints) metaprompt += `- **Constraints**: ${context.constraints}\n`;
    if (context.setting) metaprompt += `- **Setting**: ${context.setting}\n`;
  }

  metaprompt += '\n\n**Strategic Thinking Questions:**\n';
  guide.thinkingQuestions.forEach((question, index) => {
    metaprompt += `${index + 1}. ${question}\n`;
  });

  metaprompt += '\n\n**Consider These Elements (not requirements, but possibilities):**\n';
  guide.suggestedElements.forEach(element => {
    metaprompt += `- ${element}\n`;
  });

  return metaprompt;
}
