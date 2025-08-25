// Template Selection Accuracy Tests - Quantitative validation of template intelligence
import { describe, it, expect, beforeEach } from 'vitest';
import { TemplateSelector, ContentAnalysis, SLIDE_TEMPLATE_LIBRARY } from '../../src/templates/slide-templates.js';

describe('TemplateSelector Intelligence', () => {
  describe('Content Analysis Accuracy', () => {
    it('should correctly identify team content', () => {
      const teamContent = `
        Meet our development team:
        - Alice Johnson: Lead Developer with 5 years of experience
        - Bob Smith: UI/UX Designer specializing in user interfaces
        - Carol Davis: DevOps Engineer managing our infrastructure
        Our team members work collaboratively to deliver excellent software.
      `;

      const analysis = TemplateSelector.analyzeContent(teamContent);
      
      expect(analysis.recommendedTemplate).toBe('team_showcase');
      expect(analysis.contentType).toContain('team');
      expect(analysis.keywords).toContain('team');
      expect(analysis.confidence).toBeGreaterThan(0.7);
    });

    it('should correctly identify quote/testimonial content', () => {
      const quoteContent = `
        Customer feedback about our product:
        "This software has revolutionized our workflow. The team's productivity 
        increased by 40% after implementation." - Sarah Wilson, CEO of TechCorp
        
        Another client stated: "The customer support is exceptional and the 
        features are exactly what we needed."
      `;

      const analysis = TemplateSelector.analyzeContent(quoteContent);
      
      expect(analysis.recommendedTemplate).toBe('quote_highlight');
      expect(analysis.keywords).toEqual(
        expect.arrayContaining(['feedback', 'stated', 'ceo'])
      );
      expect(analysis.confidence).toBeGreaterThan(0.7);
    });

    it('should correctly identify data/table content', () => {
      const dataContent = `
        Performance Metrics Q3 2024:
        | Metric | Q1 | Q2 | Q3 | Change |
        |--------|----|----|----|----|
        | Revenue | $100k | $120k | $140k | +16.7% |
        | Users | 1,500 | 2,100 | 2,800 | +33.3% |
        | Conversion | 2.5% | 3.1% | 3.8% | +22.6% |
        
        These statistics show strong growth across all key performance indicators.
      `;

      const analysis = TemplateSelector.analyzeContent(dataContent);
      
      expect(analysis.recommendedTemplate).toBe('data_table');
      expect(analysis.structure).toBe('data');
      expect(analysis.keywords).toEqual(
        expect.arrayContaining(['metric', 'statistics'])
      );
      expect(analysis.confidence).toBeGreaterThan(0.7);
    });

    it('should correctly identify timeline/process content', () => {
      const timelineContent = `
        Project Development Timeline:
        Phase 1: Planning and Requirements (Weeks 1-2)
        Phase 2: Design and Architecture (Weeks 3-4)  
        Phase 3: Development and Implementation (Weeks 5-8)
        Phase 4: Testing and Quality Assurance (Weeks 9-10)
        Phase 5: Deployment and Launch (Week 11)
        
        This step-by-step process ensures systematic project delivery.
      `;

      const analysis = TemplateSelector.analyzeContent(timelineContent);
      
      expect(analysis.recommendedTemplate).toBe('timeline_flow');
      expect(analysis.keywords).toEqual(
        expect.arrayContaining(['timeline', 'phase', 'step'])
      );
      expect(analysis.confidence).toBeGreaterThan(0.7);
    });

    it('should correctly identify comparison content', () => {
      const comparisonContent = `
        Feature Comparison: Pro vs Standard Plan
        
        Standard Plan offers basic functionality while Pro Plan provides advanced features.
        Pro includes advanced analytics, priority support, and custom integrations.
        Standard has essential tools, standard support, and limited integrations.
        
        The difference between plans is significant in terms of capabilities.
      `;

      const analysis = TemplateSelector.analyzeContent(comparisonContent);
      
      expect(analysis.recommendedTemplate).toBe('comparison_layout');
      expect(analysis.keywords).toEqual(
        expect.arrayContaining(['comparison', 'vs', 'difference', 'while'])
      );
      expect(analysis.confidence).toBeGreaterThan(0.7);
    });

    it('should correctly identify table of contents', () => {
      const tocContent = `
        Table of Contents:
        1. Introduction and Overview
        2. System Architecture 
        3. Implementation Details
        4. Performance Analysis
        5. Conclusion and Next Steps
        
        This agenda covers all key sections of our presentation.
      `;

      const analysis = TemplateSelector.analyzeContent(tocContent);
      
      expect(analysis.recommendedTemplate).toBe('table_of_contents');
      expect(analysis.keywords).toEqual(
        expect.arrayContaining(['contents', 'overview', 'agenda'])
      );
      expect(analysis.confidence).toBeGreaterThan(0.8);
    });

    it('should identify bulleted list content', () => {
      const listContent = `
        Key Features of Our Product:
        • Advanced security with encryption
        • Real-time collaboration tools
        • Automated backup and recovery
        • 24/7 customer support
        • Integration with popular tools
        • Customizable user interface
        
        These points highlight our main advantages.
      `;

      const analysis = TemplateSelector.analyzeContent(listContent);
      
      expect(analysis.recommendedTemplate).toBe('bulleted_list');
      expect(analysis.structure).toBe('list');
      expect(analysis.keywords).toEqual(
        expect.arrayContaining(['points'])
      );
      expect(analysis.confidence).toBeGreaterThan(0.6);
    });
  });

  describe('Template Selection Accuracy Benchmarks', () => {
    // Test dataset with known expected templates
    const testDataset = [
      {
        content: 'Thank you for your attention. Questions welcome! Contact: john@company.com',
        expectedTemplate: 'closing_slide',
        description: 'Closing slide content'
      },
      {
        content: 'Our CEO said: "This product changed everything for us." - Maria Garcia, TechStart Inc.',
        expectedTemplate: 'quote_highlight',
        description: 'Customer testimonial'
      },
      {
        content: 'Meet our team: John (Developer), Sarah (Designer), Mike (Manager)',
        expectedTemplate: 'team_showcase',
        description: 'Team introduction'
      },
      {
        content: '| Product | Price | Sales | Growth |\n| A | $100 | 500 | +20% |\n| B | $200 | 300 | +15% |',
        expectedTemplate: 'data_table',
        description: 'Sales data table'
      },
      {
        content: 'Step 1: Initialize project. Step 2: Develop features. Step 3: Test and deploy.',
        expectedTemplate: 'timeline_flow',
        description: 'Process timeline'
      },
      {
        content: 'Pro plan offers advanced features while Basic plan provides essentials.',
        expectedTemplate: 'comparison_layout',
        description: 'Plan comparison'
      },
      {
        content: 'Table of Contents: 1. Overview 2. Features 3. Pricing 4. Support',
        expectedTemplate: 'table_of_contents',
        description: 'Presentation agenda'
      },
      {
        content: 'Introduction to Machine Learning: A comprehensive overview of ML concepts.',
        expectedTemplate: 'standard_content',
        description: 'General content'
      },
      {
        content: '• Feature A\n• Feature B\n• Feature C\n• Feature D',
        expectedTemplate: 'bulleted_list',
        description: 'Feature list'
      }
    ];

    it('should achieve high accuracy on curated test dataset', () => {
      let correctSelections = 0;
      const results: Array<{
        content: string;
        expected: string;
        actual: string;
        confidence: number;
        correct: boolean;
      }> = [];

      for (const testCase of testDataset) {
        const analysis = TemplateSelector.analyzeContent(testCase.content);
        const isCorrect = analysis.recommendedTemplate === testCase.expectedTemplate;
        
        if (isCorrect) {
          correctSelections++;
        }

        results.push({
          content: testCase.description,
          expected: testCase.expectedTemplate,
          actual: analysis.recommendedTemplate,
          confidence: analysis.confidence,
          correct: isCorrect
        });
      }

      const accuracy = correctSelections / testDataset.length;
      
      // Log detailed results for analysis
      console.log('\n=== Template Selection Accuracy Results ===');
      console.log(`Overall Accuracy: ${(accuracy * 100).toFixed(1)}%`);
      console.log(`Correct: ${correctSelections}/${testDataset.length}`);
      console.log('\nDetailed Results:');
      
      results.forEach((result, index) => {
        const status = result.correct ? '✓' : '✗';
        console.log(`${status} ${result.content}: ${result.expected} → ${result.actual} (conf: ${result.confidence.toFixed(2)})`);
      });

      // Validate accuracy threshold
      expect(accuracy).toBeGreaterThanOrEqual(0.85); // 85% minimum accuracy
      
      // Validate that high-confidence selections are more accurate
      const highConfidenceResults = results.filter(r => r.confidence > 0.8);
      const highConfidenceAccuracy = highConfidenceResults.filter(r => r.correct).length / highConfidenceResults.length;
      
      if (highConfidenceResults.length > 0) {
        expect(highConfidenceAccuracy).toBeGreaterThanOrEqual(0.9); // 90% accuracy for high-confidence selections
      }
    });

    it('should assign appropriate confidence scores', () => {
      const testCases = [
        {
          content: 'Table of Contents: 1. Introduction 2. Features 3. Conclusion',
          minConfidence: 0.8, // Very clear TOC
          description: 'Clear table of contents'
        },
        {
          content: 'Our CEO stated: "Revolutionary product!" - John Smith, TechCorp',
          minConfidence: 0.7, // Clear quote
          description: 'Clear testimonial quote'
        },
        {
          content: 'Some general information about the topic.',
          maxConfidence: 0.6, // Ambiguous content
          description: 'Ambiguous general content'
        }
      ];

      for (const testCase of testCases) {
        const analysis = TemplateSelector.analyzeContent(testCase.content);
        
        if (testCase.minConfidence) {
          expect(analysis.confidence).toBeGreaterThanOrEqual(testCase.minConfidence);
        }
        
        if (testCase.maxConfidence) {
          expect(analysis.confidence).toBeLessThanOrEqual(testCase.maxConfidence);
        }
      }
    });
  });

  describe('Edge Cases and Robustness', () => {
    it('should handle empty content gracefully', () => {
      const analysis = TemplateSelector.analyzeContent('');
      
      expect(analysis.recommendedTemplate).toBe('standard_content');
      expect(analysis.keywords).toEqual([]);
      expect(analysis.confidence).toBeLessThan(0.5);
    });

    it('should handle very short content', () => {
      const analysis = TemplateSelector.analyzeContent('Hi');
      
      expect(analysis.recommendedTemplate).toBe('standard_content');
      expect(analysis.confidence).toBeLessThan(0.5);
    });

    it('should handle mixed content types', () => {
      const mixedContent = `
        Team Update: Alice and Bob completed the data analysis.
        Results show: | Metric | Value | | Users | 1000 |
        CEO feedback: "Great progress on the timeline milestones."
        Next steps include comparison of options A vs B.
      `;

      const analysis = TemplateSelector.analyzeContent(mixedContent);
      
      // Should select the most prominent content type
      expect(analysis.recommendedTemplate).toBeDefined();
      expect(analysis.structure).toBe('mixed');
      expect(analysis.keywords.length).toBeGreaterThan(0);
    });

    it('should handle special characters and formatting', () => {
      const specialContent = `
        Performance Metrics: 
        Revenue: $100,000 (↑15%)
        Users: 50,000+ active
        Satisfaction: 4.8/5.0 ⭐⭐⭐⭐⭐
        Success rate: 99.9%
      `;

      const analysis = TemplateSelector.analyzeContent(specialContent);
      
      expect(analysis.recommendedTemplate).toBeDefined();
      expect(analysis.confidence).toBeGreaterThan(0);
    });

    it('should be case-insensitive for keywords', () => {
      const upperCaseContent = 'TABLE OF CONTENTS: 1. OVERVIEW 2. FEATURES 3. CONCLUSION';
      const lowerCaseContent = 'table of contents: 1. overview 2. features 3. conclusion';

      const upperAnalysis = TemplateSelector.analyzeContent(upperCaseContent);
      const lowerAnalysis = TemplateSelector.analyzeContent(lowerCaseContent);

      expect(upperAnalysis.recommendedTemplate).toBe(lowerAnalysis.recommendedTemplate);
      expect(upperAnalysis.recommendedTemplate).toBe('table_of_contents');
    });
  });

  describe('Performance and Reliability', () => {
    it('should process content quickly', () => {
      const longContent = `
        This is a long piece of content that contains many words and sentences.
        It includes various types of information including data tables, team information,
        quotes from customers, timeline information, and comparison data.
        The purpose is to test how quickly the template selector can process
        larger amounts of text while maintaining accuracy in template selection.
        Performance should remain consistent regardless of content length.
        ${' Extra padding text.'.repeat(100)}
      `;

      const startTime = performance.now();
      const analysis = TemplateSelector.analyzeContent(longContent);
      const endTime = performance.now();

      const processingTime = endTime - startTime;
      
      expect(processingTime).toBeLessThan(100); // Should process in under 100ms
      expect(analysis.recommendedTemplate).toBeDefined();
    });

    it('should produce consistent results for identical input', () => {
      const content = 'Meet our team: Alice (Developer), Bob (Designer), Carol (Manager)';
      
      const results = Array.from({ length: 10 }, () => 
        TemplateSelector.analyzeContent(content)
      );

      // All results should be identical
      const firstResult = results[0];
      for (const result of results.slice(1)) {
        expect(result.recommendedTemplate).toBe(firstResult.recommendedTemplate);
        expect(result.confidence).toBe(firstResult.confidence);
        expect(result.structure).toBe(firstResult.structure);
      }
    });
  });

  describe('Template Library Validation', () => {
    it('should have valid template definitions', () => {
      for (const [templateId, template] of Object.entries(SLIDE_TEMPLATE_LIBRARY)) {
        expect(template.id).toBe(templateId);
        expect(template.name).toBeDefined();
        expect(template.description).toBeDefined();
        expect(Array.isArray(template.contentTriggers)).toBe(true);
        expect(template.contentTriggers.length).toBeGreaterThan(0);
        expect(template.htmlStructure).toBeDefined();
        expect(Array.isArray(template.placeholders)).toBe(true);
        expect(Array.isArray(template.designPatterns)).toBe(true);
      }
    });

    it('should have unique template IDs', () => {
      const templateIds = Object.keys(SLIDE_TEMPLATE_LIBRARY);
      const uniqueIds = new Set(templateIds);
      
      expect(uniqueIds.size).toBe(templateIds.length);
    });

    it('should have appropriate content triggers for each template', () => {
      const expectedTriggers = {
        'cover_slide': ['title', 'presentation_start', 'introduction'],
        'table_of_contents': ['contents', 'overview', 'agenda'],
        'team_showcase': ['team', 'staff', 'members', 'people'],
        'quote_highlight': ['quote', 'testimonial', 'feedback'],
        'data_table': ['table', 'data', 'statistics', 'metrics'],
        'timeline_flow': ['timeline', 'sequence', 'steps', 'process'],
        'comparison_layout': ['comparison', 'versus', 'compare'],
        'closing_slide': ['conclusion', 'thank_you', 'questions', 'contact']
      };

      for (const [templateId, expectedTriggerSet] of Object.entries(expectedTriggers)) {
        if (SLIDE_TEMPLATE_LIBRARY[templateId]) {
          const template = SLIDE_TEMPLATE_LIBRARY[templateId];
          const hasExpectedTriggers = expectedTriggerSet.some(trigger =>
            template.contentTriggers.includes(trigger)
          );
          expect(hasExpectedTriggers).toBe(true);
        }
      }
    });
  });
});