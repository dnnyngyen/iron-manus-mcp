// Slide Template System for Iron Manus MCP
// Based on Genspark pattern analysis with metaprompting-first design

import { HTML_TEMPLATES } from './html-structures.js';

export interface SlideTemplate {
  id: string;
  name: string;
  description: string;
  contentTriggers: string[];
  htmlStructure: string;
  placeholders: string[];
  designPatterns: string[];
}

export const SLIDE_TEMPLATE_LIBRARY: Record<string, SlideTemplate> = {
  // Presentation Structure Templates
  cover_slide: {
    id: 'cover_slide',
    name: 'Cover Slide',
    description: 'Opening slide with title, subtitle, and branding',
    contentTriggers: ['title', 'presentation_start', 'introduction', 'opening'],
    htmlStructure: HTML_TEMPLATES.cover_slide,
    placeholders: ['title', 'subtitle', 'date', 'author', 'organization'],
    designPatterns: ['large_typography', 'minimal_content', 'brand_elements'],
  },

  table_of_contents: {
    id: 'table_of_contents',
    name: 'Table of Contents',
    description: 'Navigation overview with numbered sections',
    contentTriggers: ['contents', 'overview', 'agenda', 'navigation', 'sections'],
    htmlStructure: HTML_TEMPLATES.table_of_contents,
    placeholders: ['sections', 'page_numbers', 'subsections'],
    designPatterns: ['hierarchical_list', 'navigation_aids', 'clear_structure'],
  },

  // Content Layout Templates
  standard_content: {
    id: 'standard_content',
    name: 'Standard Content',
    description: 'General purpose layout with text and optional visuals',
    contentTriggers: ['general', 'mixed_content', 'standard', 'default'],
    htmlStructure: HTML_TEMPLATES.standard_content,
    placeholders: ['title', 'content', 'image', 'bullet_points'],
    designPatterns: ['two_column', 'flexible_layout', 'text_image_balance'],
  },

  data_table: {
    id: 'data_table',
    name: 'Data Table',
    description: 'Structured table for numerical and categorical data',
    contentTriggers: ['table', 'data', 'statistics', 'metrics', 'results', 'figures'],
    htmlStructure: HTML_TEMPLATES.data_table,
    placeholders: ['table_title', 'headers', 'rows', 'totals', 'notes'],
    designPatterns: ['structured_data', 'clear_headers', 'readable_rows'],
  },

  // Specialized Content Templates
  team_showcase: {
    id: 'team_showcase',
    name: 'Team Showcase',
    description: 'Personnel presentation with photos and roles',
    contentTriggers: ['team', 'staff', 'personnel', 'members', 'people', 'profiles'],
    htmlStructure: HTML_TEMPLATES.team_showcase,
    placeholders: ['team_members', 'names', 'titles', 'photos', 'descriptions'],
    designPatterns: ['grid_layout', 'photo_cards', 'person_info'],
  },

  quote_highlight: {
    id: 'quote_highlight',
    name: 'Quote Highlight',
    description: 'Emphasized quotation with attribution',
    contentTriggers: ['quote', 'testimonial', 'feedback', 'review', 'statement'],
    htmlStructure: HTML_TEMPLATES.quote_highlight,
    placeholders: ['quote_text', 'attribution', 'source', 'context'],
    designPatterns: ['large_quote', 'emphasis_styling', 'clear_attribution'],
  },

  timeline_flow: {
    id: 'timeline_flow',
    name: 'Timeline Flow',
    description: 'Chronological sequence with milestones',
    contentTriggers: ['timeline', 'sequence', 'steps', 'process', 'chronology', 'phases'],
    htmlStructure: HTML_TEMPLATES.timeline_flow,
    placeholders: ['timeline_items', 'dates', 'descriptions', 'milestones'],
    designPatterns: ['chronological_flow', 'connected_points', 'milestone_markers'],
  },

  visual_showcase: {
    id: 'visual_showcase',
    name: 'Visual Showcase',
    description: 'Full-screen image presentation with minimal text',
    contentTriggers: ['image', 'visual', 'photo', 'graphic', 'showcase', 'display'],
    htmlStructure: HTML_TEMPLATES.visual_showcase,
    placeholders: ['main_image', 'caption', 'overlay_text'],
    designPatterns: ['full_bleed', 'minimal_text', 'visual_impact'],
  },

  comparison_layout: {
    id: 'comparison_layout',
    name: 'Comparison Layout',
    description: 'Side-by-side feature or product comparison',
    contentTriggers: ['comparison', 'versus', 'compare', 'features', 'options', 'alternatives'],
    htmlStructure: HTML_TEMPLATES.comparison_layout,
    placeholders: ['item_one', 'item_two', 'features_one', 'features_two', 'comparison_points'],
    designPatterns: ['side_by_side', 'feature_lists', 'visual_distinction'],
  },

  bulleted_list: {
    id: 'bulleted_list',
    name: 'Bulleted List',
    description: 'Organized list with visual hierarchy',
    contentTriggers: ['list', 'points', 'items', 'bullets', 'enumeration', 'key_points'],
    htmlStructure: HTML_TEMPLATES.bulleted_list,
    placeholders: ['list_items', 'descriptions', 'icons', 'priorities'],
    designPatterns: ['visual_bullets', 'clear_hierarchy', 'scannable_content'],
  },

  closing_slide: {
    id: 'closing_slide',
    name: 'Closing Slide',
    description: 'Conclusion with call-to-action and contact info',
    contentTriggers: ['conclusion', 'thank_you', 'questions', 'contact', 'closing', 'end'],
    htmlStructure: HTML_TEMPLATES.closing_slide,
    placeholders: ['closing_message', 'call_to_action', 'contact_info', 'next_steps'],
    designPatterns: ['centered_content', 'call_to_action', 'contact_emphasis'],
  },

  system_diagram: {
    id: 'system_diagram',
    name: 'System Diagram',
    description: 'Technical diagrams and system relationships',
    contentTriggers: ['diagram', 'system', 'architecture', 'flow', 'mapping', 'relationships'],
    htmlStructure: HTML_TEMPLATES.system_diagram,
    placeholders: ['diagram_elements', 'connections', 'labels', 'legend'],
    designPatterns: ['diagram_layout', 'connection_lines', 'clear_labels'],
  },
};

// Content Analysis Engine for Template Selection
export interface ContentAnalysis {
  contentType: string;
  keywords: string[];
  structure: 'text' | 'data' | 'list' | 'image' | 'mixed';
  complexity: 'simple' | 'medium' | 'complex';
  recommendedTemplate: string;
  confidence: number;
}

export class TemplateSelector {
  static analyzeContent(content: string): ContentAnalysis {
    const keywords = this.extractKeywords(content);
    const structure = this.detectStructure(content);
    const template = this.selectTemplate(keywords, structure, content);

    return {
      contentType: this.classifyContent(keywords, structure),
      keywords,
      structure,
      complexity: this.assessComplexity(content),
      recommendedTemplate: template,
      confidence: this.calculateConfidence(keywords, structure, template),
    };
  }

  private static extractKeywords(content: string): string[] {
    // Normalize content for analysis
    const normalized = content.toLowerCase().trim();

    // Define keyword patterns for different content types
    const keywordPatterns = {
      presentation: ['presentation', 'slide', 'deck', 'show'],
      team: ['team', 'staff', 'member', 'people', 'person', 'employee', 'developer', 'engineer'],
      data: [
        'data',
        'table',
        'chart',
        'graph',
        'metric',
        'metrics',
        'statistic',
        'statistics',
        'number',
        'percent',
      ],
      timeline: ['timeline', 'schedule', 'phase', 'step', 'process', 'sequence', 'milestone'],
      quote: [
        'quote',
        'testimonial',
        'review',
        'feedback',
        'said',
        'statement',
        'stated',
        'ceo',
        'cto',
        'president',
        'client',
        'customer',
      ],
      comparison: [
        'compare',
        'versus',
        'vs',
        'comparison',
        'difference',
        'option',
        'alternative',
        'while',
        'offers',
        'provides',
        'feature',
      ],
      visual: ['image', 'photo', 'visual', 'picture', 'graphic', 'showcase'],
      conclusion: ['conclusion', 'thank', 'question', 'contact', 'end', 'summary'],
      contents: ['contents', 'overview', 'agenda', 'sections', 'navigation'],
      list: ['list', 'points', 'items', 'bullets', 'enumeration', 'key_points'],
    };

    // Extract keywords using pattern matching with priority
    const foundKeywords: string[] = [];

    // Check for exact keyword matches first (highest priority)
    Object.entries(keywordPatterns).forEach(([category, keywords]) => {
      keywords.forEach(keyword => {
        if (normalized.includes(keyword)) {
          foundKeywords.push(keyword);
        }
      });
    });

    // If we have strong keyword matches, prioritize them
    if (foundKeywords.length > 0) {
      return [...new Set(foundKeywords)];
    }

    // Fallback: Extract significant words only if no keyword matches
    const words = normalized.split(/\s+/).filter(word => word.length > 3);
    const significantWords = words.filter(
      word =>
        ![
          'this',
          'that',
          'with',
          'from',
          'they',
          'have',
          'will',
          'been',
          'were',
          'about',
          'after',
          'implementation',
        ].includes(word)
    );

    return [...new Set([...foundKeywords, ...significantWords.slice(0, 10)])];
  }

  private static detectStructure(content: string): 'text' | 'data' | 'list' | 'image' | 'mixed' {
    const normalized = content.toLowerCase();
    const structureScore = { text: 0, data: 0, list: 0, image: 0, mixed: 0 };

    // Data structure indicators
    if (
      normalized.includes('|') ||
      normalized.includes('row') ||
      normalized.includes('column') ||
      /\d+\.\d+/.test(content) ||
      normalized.includes('metric')
    ) {
      structureScore.data += 3;
    }

    // Special case: "table of contents" is NOT data structure
    if (normalized.includes('table of contents') || normalized.includes('contents:')) {
      structureScore.data = 0; // Reset data score
      structureScore.list += 2; // Favor list structure instead
    } else if (normalized.includes('table')) {
      structureScore.data += 2;
    }

    // List structure indicators
    const listPatterns = [/^\s*[-*+]\s+/gm, /^\s*\d+\.\s+/gm, /^\s*[a-zA-Z]\.\s+/gm];
    listPatterns.forEach(pattern => {
      if (pattern.test(content)) structureScore.list += 3;
    });

    // Bullet points and enumeration keywords
    const listKeywords = [
      'first',
      'second',
      'third',
      'next',
      'then',
      'finally',
      'list',
      'points',
      'items',
    ];
    let listKeywordCount = 0;
    listKeywords.forEach(keyword => {
      if (normalized.includes(keyword)) listKeywordCount++;
    });
    structureScore.list += listKeywordCount;

    // Strong bullet point indicators
    if (normalized.includes('• ') || normalized.includes('- ') || normalized.includes('* ')) {
      structureScore.list += 2;
    }

    // Image/visual indicators
    if (
      normalized.includes('image') ||
      normalized.includes('photo') ||
      normalized.includes('visual') ||
      normalized.includes('picture') ||
      normalized.includes('graphic') ||
      normalized.includes('chart')
    ) {
      structureScore.image += 2;
    }

    // Mixed content indicators - more sophisticated detection
    const activeStructures = Object.entries(structureScore).filter(
      ([key, score]) => key !== 'mixed' && score > 0
    ).length;

    if (activeStructures > 1) {
      structureScore.mixed += 4; // Higher score for mixed content
    } else if (
      normalized.includes('and') &&
      (structureScore.data > 0 || structureScore.list > 0 || structureScore.image > 0)
    ) {
      structureScore.mixed += 2;
    }

    // Default to text for simple content
    if (content.length < 100 && Object.values(structureScore).every(score => score === 0)) {
      structureScore.text += 1;
    }

    // Return the structure type with highest score
    const maxScore = Math.max(...Object.values(structureScore));
    return Object.keys(structureScore).find(
      key => structureScore[key as keyof typeof structureScore] === maxScore
    ) as 'text' | 'data' | 'list' | 'image' | 'mixed';
  }

  private static selectTemplate(keywords: string[], structure: string, content: string): string {
    // Enhanced priority-based template selection with structure weighting
    let bestMatch = { templateId: 'standard_content', score: 0 };

    for (const [templateId, template] of Object.entries(SLIDE_TEMPLATE_LIBRARY)) {
      let score = 0;

      // Base keyword matching score
      const keywordScore = this.calculateMatchScore(keywords, template.contentTriggers);
      score += keywordScore * 3; // Weight keyword matches heavily

      // Structure-based bonuses
      if (structure === 'data' && ['data_table', 'system_diagram'].includes(templateId)) {
        score += 2;
      }
      if (structure === 'list' && templateId === 'bulleted_list') {
        score += 2;
      }
      if (structure === 'image' && templateId === 'visual_showcase') {
        score += 2;
      }

      // Special content type bonuses
      const hasTeamKeywords = keywords.some(k =>
        ['team', 'staff', 'member', 'people', 'person'].includes(k.toLowerCase())
      );
      if (hasTeamKeywords && templateId === 'team_showcase') {
        score += 1.5;
      }

      const hasQuoteKeywords = keywords.some(k =>
        [
          'quote',
          'testimonial',
          'review',
          'feedback',
          'said',
          'stated',
          'ceo',
          'cto',
          'president',
        ].includes(k.toLowerCase())
      );
      if (hasQuoteKeywords && templateId === 'quote_highlight') {
        score += 2; // Increased weight
      }

      const hasTimelineKeywords = keywords.some(k =>
        ['timeline', 'schedule', 'phase', 'step', 'process'].includes(k.toLowerCase())
      );
      if (hasTimelineKeywords && templateId === 'timeline_flow') {
        score += 1.5;
      }

      const hasComparisonKeywords = keywords.some(k =>
        [
          'compare',
          'versus',
          'vs',
          'comparison',
          'difference',
          'while',
          'offers',
          'provides',
        ].includes(k.toLowerCase())
      );
      if (hasComparisonKeywords && templateId === 'comparison_layout') {
        score += 2; // Increased weight
      }

      const hasConclusionKeywords = keywords.some(k =>
        ['conclusion', 'thank', 'question', 'contact', 'end'].includes(k.toLowerCase())
      );
      if (hasConclusionKeywords && templateId === 'closing_slide') {
        score += 1.5;
      }

      // Presentation structure keywords
      const hasTocKeywords =
        keywords.some(k =>
          ['contents', 'overview', 'agenda', 'sections', 'table'].includes(k.toLowerCase())
        ) || content.toLowerCase().includes('table of contents');
      if (hasTocKeywords && templateId === 'table_of_contents') {
        score += 3; // High priority for TOC
      }

      // Update best match if this template scores higher
      if (score > bestMatch.score) {
        bestMatch = { templateId, score };
      }
    }

    // Return best match if score is reasonable, otherwise default
    return bestMatch.score > 0.3 ? bestMatch.templateId : 'standard_content';
  }

  private static calculateMatchScore(keywords: string[], triggers: string[]): number {
    const matches = keywords.filter(keyword =>
      triggers.some(
        trigger =>
          keyword.toLowerCase().includes(trigger.toLowerCase()) ||
          trigger.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    return matches.length / Math.max(keywords.length, triggers.length);
  }

  private static classifyContent(keywords: string[], structure: string): string {
    // Enhanced content classification based on keywords and structure
    const contentTypes = {
      presentation_structure: ['contents', 'overview', 'agenda', 'sections', 'introduction'],
      team_information: ['team', 'staff', 'member', 'people', 'person', 'employee'],
      data_metrics: ['data', 'table', 'chart', 'metric', 'statistic', 'number', 'percent'],
      process_timeline: ['timeline', 'schedule', 'phase', 'step', 'process', 'sequence'],
      testimonial_quote: ['quote', 'testimonial', 'review', 'feedback', 'said', 'statement'],
      product_comparison: ['compare', 'versus', 'vs', 'comparison', 'difference', 'option'],
      visual_showcase: ['image', 'photo', 'visual', 'picture', 'graphic', 'showcase'],
      conclusion_summary: ['conclusion', 'thank', 'question', 'contact', 'end', 'summary'],
      technical_system: [
        'system',
        'architecture',
        'flow',
        'diagram',
        'technical',
        'infrastructure',
      ],
    };

    // Calculate match scores for each content type
    let bestMatch = { type: 'general', score: 0 };

    for (const [contentType, typeKeywords] of Object.entries(contentTypes)) {
      const matchCount = keywords.filter(keyword =>
        typeKeywords.some(
          typeKeyword =>
            keyword.toLowerCase().includes(typeKeyword) ||
            typeKeyword.includes(keyword.toLowerCase())
        )
      ).length;

      let score = matchCount / Math.max(keywords.length, 1);

      // Structure bonuses
      if (structure === 'data' && contentType === 'data_metrics') score += 0.3;
      if (structure === 'list' && contentType === 'process_timeline') score += 0.2;
      if (structure === 'image' && contentType === 'visual_showcase') score += 0.3;

      if (score > bestMatch.score) {
        bestMatch = { type: contentType, score };
      }
    }

    return bestMatch.score > 0.2 ? bestMatch.type : 'general';
  }

  private static assessComplexity(content: string): 'simple' | 'medium' | 'complex' {
    let complexityScore = 0;

    // Length-based scoring
    if (content.length > 500) complexityScore += 2;
    else if (content.length > 200) complexityScore += 1;

    // Structure complexity indicators
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    if (sentences.length > 10) complexityScore += 2;
    else if (sentences.length > 5) complexityScore += 1;

    // Technical complexity indicators
    const technicalWords = ['data', 'system', 'architecture', 'process', 'metric', 'analysis'];
    const technicalMatches = technicalWords.filter(word =>
      content.toLowerCase().includes(word)
    ).length;
    if (technicalMatches > 3) complexityScore += 1;

    // Multiple content types indicate complexity
    const contentTypes = ['table', 'list', 'image', 'chart', 'timeline'];
    const typeMatches = contentTypes.filter(type => content.toLowerCase().includes(type)).length;
    if (typeMatches > 2) complexityScore += 1;

    // Return complexity level
    if (complexityScore >= 4) return 'complex';
    if (complexityScore >= 2) return 'medium';
    return 'simple';
  }

  private static calculateConfidence(
    keywords: string[],
    structure: string,
    template: string
  ): number {
    let confidence = 0.4; // Base confidence

    // Template-specific confidence adjustments
    const templateLib = SLIDE_TEMPLATE_LIBRARY[template];
    if (templateLib) {
      const triggerMatches = keywords.filter(keyword =>
        templateLib.contentTriggers.some(
          trigger =>
            keyword.toLowerCase().includes(trigger.toLowerCase()) ||
            trigger.toLowerCase().includes(keyword.toLowerCase())
        )
      ).length;

      // Higher confidence for more trigger matches
      confidence += Math.min(triggerMatches * 0.2, 0.6);

      // Bonus for exact trigger matches
      const exactMatches = templateLib.contentTriggers.filter(trigger =>
        keywords.some(keyword => keyword.toLowerCase() === trigger.toLowerCase())
      ).length;
      confidence += exactMatches * 0.2;
    }

    // Keyword quality bonus
    if (keywords.length > 3) confidence += 0.1;
    if (keywords.length > 7) confidence += 0.1;

    // Structure clarity bonus
    if (structure !== 'mixed') confidence += 0.1;

    // Specialized template bonus
    if (template !== 'standard_content') confidence += 0.2;

    // Special case: Low confidence for very short content or no keywords
    if (keywords.length < 2) confidence = Math.max(confidence * 0.5, 0.1);

    // Default template gets lower confidence
    if (template === 'standard_content') confidence = Math.max(confidence * 0.6, 0.3);

    // Ensure confidence stays within bounds
    return Math.min(Math.max(confidence, 0.1), 0.95);
  }
}
