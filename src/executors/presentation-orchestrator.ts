/**
 * Presentation Orchestrator - FSM-integrated presentation generation
 *
 * Ensures proper presentation structure: Title → TOC → Content → Closing
 * Integrates with Iron Manus MCP's FSM workflow and role system
 * Maintains metaprompting-first philosophy through role-based orchestration
 */

import { SlideGeneratorTool } from '../tools/content/slide-generator-tool.js';
import { TemplateSelector } from '../templates/slide-templates.js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import logger from '../utils/logger.js';

export interface PresentationRequest {
  title: string;
  subtitle?: string;
  objective: string;
  audience: string;
  contentBlocks: ContentBlock[];
  sessionId: string;
  author?: string;
  organization?: string;
}

export interface ContentBlock {
  title: string;
  content: string;
  contentType?: 'auto' | 'data' | 'team' | 'quote' | 'timeline' | 'visual' | 'comparison' | 'list';
  metadata?: Record<string, any>;
}

export interface PresentationResult {
  success: boolean;
  sessionId: string;
  slides: GeneratedSlideInfo[];
  errors: string[];
  sessionPath: string;
  indexFilePath?: string;
  metadata: {
    totalSlides: number;
    generatedAt: string;
    processingTime: number;
    structure: PresentationStructure;
  };
}

export interface GeneratedSlideInfo {
  slideNumber: number;
  title: string;
  templateUsed: string;
  filePath: string;
  contentType: string;
}

export interface PresentationStructure {
  hasTitle: boolean;
  hasTableOfContents: boolean;
  contentSlides: number;
  hasClosing: boolean;
  totalSlides: number;
}

/**
 * PresentationOrchestrator - Ensures structured presentation generation
 */
export class PresentationOrchestrator {
  private slideGenerator: SlideGeneratorTool;

  constructor() {
    this.slideGenerator = new SlideGeneratorTool();
  }

  /**
   * Generate a complete presentation with proper structure
   */
  async generatePresentation(request: PresentationRequest): Promise<PresentationResult> {
    const startTime = Date.now();
    const slides: GeneratedSlideInfo[] = [];
    const errors: string[] = [];

    logger.info(`Starting presentation generation: "${request.title}" for ${request.audience}`);

    try {
      // Ensure session directory exists
      const sessionPath = join(process.cwd(), 'iron-manus-sessions', request.sessionId);
      const slidesPath = join(sessionPath, 'slides');

      if (!existsSync(slidesPath)) {
        mkdirSync(slidesPath, { recursive: true });
      }

      // 1. Generate Title Slide (Always first)
      const titleSlide = await this.generateTitleSlide(request);
      if (titleSlide) {
        slides.push(titleSlide);
      } else {
        errors.push('Failed to generate title slide');
      }

      // 2. Generate Table of Contents (Always second)
      const tocSlide = await this.generateTableOfContents(request);
      if (tocSlide) {
        slides.push(tocSlide);
      } else {
        errors.push('Failed to generate table of contents');
      }

      // 3. Generate Content Slides
      let slideNumber = 3;
      for (const contentBlock of request.contentBlocks) {
        const contentSlide = await this.generateContentSlide(
          contentBlock,
          slideNumber,
          request.sessionId
        );

        if (contentSlide) {
          slides.push(contentSlide);
          slideNumber++;
        } else {
          errors.push(`Failed to generate content slide ${slideNumber}: ${contentBlock.title}`);
        }
      }

      // 4. Generate Closing Slide (Always last)
      const closingSlide = await this.generateClosingSlide(request, slideNumber);
      if (closingSlide) {
        slides.push(closingSlide);
      } else {
        errors.push('Failed to generate closing slide');
      }

      // 5. Generate presentation index file
      const indexFilePath = await this.generatePresentationIndex(slides, sessionPath, request);

      // 6. Calculate structure metrics
      const structure: PresentationStructure = {
        hasTitle: slides.some(s => s.templateUsed === 'cover_slide'),
        hasTableOfContents: slides.some(s => s.templateUsed === 'table_of_contents'),
        contentSlides: slides.filter(
          s => !['cover_slide', 'table_of_contents', 'closing_slide'].includes(s.templateUsed)
        ).length,
        hasClosing: slides.some(s => s.templateUsed === 'closing_slide'),
        totalSlides: slides.length,
      };

      const processingTime = Date.now() - startTime;

      logger.info(
        `Presentation generation completed: ${slides.length} slides in ${processingTime}ms`
      );

      return {
        success: errors.length === 0,
        sessionId: request.sessionId,
        slides,
        errors,
        sessionPath,
        indexFilePath,
        metadata: {
          totalSlides: slides.length,
          generatedAt: new Date().toISOString(),
          processingTime,
          structure,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Presentation generation failed: ${errorMessage}`);

      return {
        success: false,
        sessionId: request.sessionId,
        slides,
        errors: [errorMessage],
        sessionPath: join(process.cwd(), 'iron-manus-sessions', request.sessionId),
        metadata: {
          totalSlides: slides.length,
          generatedAt: new Date().toISOString(),
          processingTime: Date.now() - startTime,
          structure: {
            hasTitle: false,
            hasTableOfContents: false,
            contentSlides: 0,
            hasClosing: false,
            totalSlides: 0,
          },
        },
      };
    }
  }

  /**
   * Generate title slide with proper branding and metadata
   */
  private async generateTitleSlide(
    request: PresentationRequest
  ): Promise<GeneratedSlideInfo | null> {
    try {
      const result = await this.slideGenerator.generateSlide({
        templateId: 'cover_slide',
        sessionId: request.sessionId,
        contentData: {
          title: request.title,
          subtitle: request.subtitle || `Presentation for ${request.audience}`,
          date: new Date().toLocaleDateString(),
          author: request.author || 'Iron Manus MCP',
          organization: request.organization || 'AI-Powered Presentation Generation',
          _slideNumber: 1,
        },
      });

      return {
        slideNumber: 1,
        title: request.title,
        templateUsed: 'cover_slide',
        filePath: result.filePath || '',
        contentType: 'title',
      };
    } catch (error) {
      logger.error(`Failed to generate title slide: ${error}`);
      return null;
    }
  }

  /**
   * Generate table of contents based on content blocks
   */
  private async generateTableOfContents(
    request: PresentationRequest
  ): Promise<GeneratedSlideInfo | null> {
    try {
      // Create sections from content blocks
      const sections = request.contentBlocks.map((block, index) => ({
        number: index + 1,
        title: block.title,
        description: block.content.substring(0, 100) + (block.content.length > 100 ? '...' : ''),
      }));

      const result = await this.slideGenerator.generateSlide({
        templateId: 'table_of_contents',
        sessionId: request.sessionId,
        contentData: {
          title: 'Table of Contents',
          sections: sections,
          _slideNumber: 2,
        },
      });

      return {
        slideNumber: 2,
        title: 'Table of Contents',
        templateUsed: 'table_of_contents',
        filePath: result.filePath || '',
        contentType: 'toc',
      };
    } catch (error) {
      logger.error(`Failed to generate table of contents: ${error}`);
      return null;
    }
  }

  /**
   * Generate content slide with intelligent template selection
   */
  private async generateContentSlide(
    contentBlock: ContentBlock,
    slideNumber: number,
    sessionId: string
  ): Promise<GeneratedSlideInfo | null> {
    try {
      // Determine template using intelligent analysis or explicit type
      let templateId: string;

      if (contentBlock.contentType && contentBlock.contentType !== 'auto') {
        // Use explicit content type mapping
        templateId = this.mapContentTypeToTemplate(contentBlock.contentType);
      } else {
        // Use intelligent template selection
        const analysis = TemplateSelector.analyzeContent(contentBlock.content);
        templateId = analysis.recommendedTemplate;
      }

      // Prepare content data based on template type
      const contentData = this.prepareContentDataForTemplate(templateId, contentBlock, slideNumber);

      const result = await this.slideGenerator.generateSlide({
        templateId,
        sessionId,
        contentData,
      });

      return {
        slideNumber,
        title: contentBlock.title,
        templateUsed: templateId,
        filePath: result.filePath || '',
        contentType: contentBlock.contentType || 'auto',
      };
    } catch (error) {
      logger.error(`Failed to generate content slide ${slideNumber}: ${error}`);
      return null;
    }
  }

  /**
   * Generate closing slide with thank you and contact info
   */
  private async generateClosingSlide(
    request: PresentationRequest,
    slideNumber: number
  ): Promise<GeneratedSlideInfo | null> {
    try {
      const result = await this.slideGenerator.generateSlide({
        templateId: 'closing_slide',
        sessionId: request.sessionId,
        contentData: {
          title: 'Thank You',
          message: 'Thank you for your attention.',
          call_to_action: 'Questions & Discussion',
          contact_details: request.author ? `Contact: ${request.author}` : 'Questions welcome!',
          _slideNumber: slideNumber,
        },
      });

      return {
        slideNumber,
        title: 'Thank You',
        templateUsed: 'closing_slide',
        filePath: result.filePath || '',
        contentType: 'closing',
      };
    } catch (error) {
      logger.error(`Failed to generate closing slide: ${error}`);
      return null;
    }
  }

  /**
   * Map content type to template ID
   */
  private mapContentTypeToTemplate(contentType: string): string {
    const mapping: { [key: string]: string } = {
      data: 'data_table',
      team: 'team_showcase',
      quote: 'quote_highlight',
      timeline: 'timeline_flow',
      visual: 'visual_showcase',
      comparison: 'comparison_layout',
      list: 'bulleted_list',
    };

    return mapping[contentType] || 'standard_content';
  }

  /**
   * Prepare content data based on template requirements
   */
  private prepareContentDataForTemplate(
    templateId: string,
    contentBlock: ContentBlock,
    slideNumber: number
  ): Record<string, any> {
    const baseData = {
      title: contentBlock.title,
      content: contentBlock.content,
      _slideNumber: slideNumber,
      ...contentBlock.metadata,
    };

    // Template-specific data preparation
    switch (templateId) {
      case 'data_table':
        return {
          ...baseData,
          table_data: contentBlock.metadata?.tableData || [],
          description: contentBlock.content,
          notes: contentBlock.metadata?.notes || '',
        };

      case 'team_showcase':
        return {
          ...baseData,
          team_members: contentBlock.metadata?.teamMembers || [],
        };

      case 'quote_highlight':
        return {
          ...baseData,
          quote_text: contentBlock.metadata?.quoteText || contentBlock.content,
          attribution: contentBlock.metadata?.attribution || 'Unknown',
        };

      case 'timeline_flow':
        return {
          ...baseData,
          timeline_items: contentBlock.metadata?.timelineItems || [],
        };

      case 'bulleted_list':
        return {
          ...baseData,
          list_items:
            contentBlock.metadata?.listItems ||
            contentBlock.content.split('\n').filter(line => line.trim()),
        };

      default:
        return baseData;
    }
  }

  /**
   * Generate presentation index HTML file for navigation
   */
  private async generatePresentationIndex(
    slides: GeneratedSlideInfo[],
    sessionPath: string,
    request: PresentationRequest
  ): Promise<string> {
    const indexContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${request.title} - Presentation</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        body { font-family: 'Roboto', sans-serif; }
        .slide-nav { cursor: pointer; transition: all 0.2s; }
        .slide-nav:hover { background-color: #f3f4f6; }
    </style>
</head>
<body class="bg-gray-100">
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-center mb-8 text-blue-900">${request.title}</h1>
        <div class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-semibold mb-4">Presentation Navigation</h2>
            <div class="grid gap-3">
                ${slides
                  .map(
                    slide => `
                <div class="slide-nav p-3 border rounded-lg flex justify-between items-center"
                     onclick="window.open('./slides/${slide.filePath.split('/').pop()}', '_blank')">
                    <div>
                        <span class="font-medium text-blue-700">Slide ${slide.slideNumber}:</span>
                        <span class="ml-2">${slide.title}</span>
                    </div>
                    <span class="text-sm text-gray-500">${slide.templateUsed}</span>
                </div>
                `
                  )
                  .join('')}
            </div>
            <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 class="font-semibold text-blue-900">Presentation Details</h3>
                <p class="text-sm text-gray-700 mt-1">Generated: ${new Date().toLocaleString()}</p>
                <p class="text-sm text-gray-700">Total Slides: ${slides.length}</p>
                <p class="text-sm text-gray-700">Audience: ${request.audience}</p>
            </div>
        </div>
    </div>
</body>
</html>`;

    const indexPath = join(sessionPath, 'presentation_index.html');
    writeFileSync(indexPath, indexContent, 'utf-8');

    return indexPath;
  }
}
