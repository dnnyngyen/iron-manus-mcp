/**
 * SlideGenerator Tool - Core slide rendering engine for Iron Manus MCP
 *
 * Maintains metaprompting-first philosophy by acting as deterministic renderer
 * while AI agents handle creative interpretation and content generation.
 */

import { BaseTool, ToolSchema, ToolResult } from '../base-tool.js';
import {
  SLIDE_TEMPLATE_LIBRARY,
  SlideTemplate,
  TemplateSelector,
} from '../../templates/slide-templates.js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

interface SlideGenerationInput {
  templateId: string;
  contentData: Record<string, any>;
  designOptions?: {
    colorScheme?: string;
    fontFamily?: string;
    customStyles?: Record<string, string>;
  };
  sessionId?: string;
}

interface SlideGenerationResult {
  html: string;
  templateUsed: string;
  placeholdersFilled: string[];
  filePath?: string;
  sessionPath?: string;
  metadata: {
    generatedAt: string;
    templateId: string;
    contentAnalysis?: any;
    slideNumber?: number;
  };
}

export class SlideGeneratorTool extends BaseTool {
  readonly name = 'SlideGenerator';
  readonly description =
    'Generates HTML slides from templates and content data. Takes template ID and structured content, returns rendered slide HTML.';

  readonly inputSchema: ToolSchema = {
    type: 'object',
    properties: {
      templateId: {
        type: 'string',
        description: 'Template identifier (e.g., cover_slide, data_table, team_showcase)',
        enum: Object.keys(SLIDE_TEMPLATE_LIBRARY),
      },
      contentData: {
        type: 'object',
        description: 'Structured content data to fill template placeholders',
        properties: {
          title: { type: 'string' },
          subtitle: { type: 'string' },
          content: { type: 'string' },
          items: { type: 'array' },
          image: { type: 'string' },
          data: { type: 'array' },
        },
      },
      designOptions: {
        type: 'object',
        description: 'Optional design customizations',
        properties: {
          colorScheme: { type: 'string' },
          fontFamily: { type: 'string' },
          customStyles: { type: 'object' },
        },
      },
      sessionId: {
        type: 'string',
        description: 'Session ID for workspace file management',
      },
    },
    required: ['templateId', 'contentData'],
  };

  async handle(args: unknown): Promise<ToolResult> {
    try {
      const input = args as SlideGenerationInput;
      const result = await this.generateSlide(input);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `SlideGenerator execution failed: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * Generate a slide from template and content data
   */
  async generateSlide(input: SlideGenerationInput): Promise<SlideGenerationResult> {
    const template = SLIDE_TEMPLATE_LIBRARY[input.templateId];

    if (!template) {
      throw new Error(
        `Unknown template ID: ${input.templateId}. Available templates: ${Object.keys(SLIDE_TEMPLATE_LIBRARY).join(', ')}`
      );
    }

    // Render template with content
    const html = this.renderTemplate(template, input.contentData, input.designOptions);

    // Track which placeholders were filled
    const placeholdersFilled = this.getFilledPlaceholders(template, input.contentData);

    // Session workspace integration
    let filePath: string | undefined;
    let sessionPath: string | undefined;

    if (input.sessionId) {
      const result = this.saveToSession(html, input.sessionId, input.templateId, input.contentData);
      filePath = result.filePath;
      sessionPath = result.sessionPath;
    }

    return {
      html,
      templateUsed: template.name,
      placeholdersFilled,
      filePath,
      sessionPath,
      metadata: {
        generatedAt: new Date().toISOString(),
        templateId: input.templateId,
        contentAnalysis: input.contentData._analysis, // Optional analysis metadata
        slideNumber: input.contentData._slideNumber,
      },
    };
  }

  /**
   * Auto-select template based on content analysis
   */
  async generateSlideWithAutoTemplate(
    content: string,
    additionalData?: Record<string, any>
  ): Promise<SlideGenerationResult> {
    const analysis = TemplateSelector.analyzeContent(content);

    const input: SlideGenerationInput = {
      templateId: analysis.recommendedTemplate,
      contentData: {
        content,
        ...additionalData,
        _analysis: analysis,
      },
    };

    return this.generateSlide(input);
  }

  /**
   * Render template HTML with content data
   */
  private renderTemplate(
    template: SlideTemplate,
    contentData: Record<string, any>,
    designOptions?: SlideGenerationInput['designOptions']
  ): string {
    let html = template.htmlStructure;

    // Replace placeholders with content
    for (const placeholder of template.placeholders) {
      const value = contentData[placeholder] || '';
      const rendered = this.renderContent(value, placeholder, template);
      html = html.replace(new RegExp(`{{${placeholder}}}`, 'g'), rendered);
    }

    // Apply design customizations
    if (designOptions) {
      html = this.applyDesignOptions(html, designOptions);
    }

    // Ensure all unreplaced placeholders are cleaned up
    html = html.replace(/{{[^}]+}}/g, '');

    return html;
  }

  /**
   * Render specific content types based on placeholder and template context
   */
  private renderContent(value: any, placeholder: string, template: SlideTemplate): string {
    if (!value) return '';

    // Handle different content types
    switch (placeholder) {
      case 'list_items':
      case 'bullet_points':
        return this.renderList(value);

      case 'table_data':
      case 'rows':
        return this.renderTable(value);

      case 'team_members':
        return this.renderTeamMembers(value);

      case 'timeline_items':
        return this.renderTimeline(value);

      case 'comparison_items':
        return this.renderComparison(value);

      case 'sections':
        return this.renderSections(value);

      default:
        return Array.isArray(value) ? value.join(', ') : String(value);
    }
  }

  /**
   * Render list items with appropriate HTML structure
   */
  private renderList(items: any[]): string {
    if (!Array.isArray(items)) return String(items);

    return items
      .map((item, index) => {
        if (typeof item === 'string') {
          return `
          <div class="list-item">
            <div class="list-marker">${index + 1}</div>
            <div class="list-content">
              <h4>${item}</h4>
            </div>
          </div>
        `;
        } else if (typeof item === 'object' && item.text) {
          return `
          <div class="list-item">
            <div class="list-marker">${index + 1}</div>
            <div class="list-content">
              <h4>${item.text}</h4>
              ${item.description ? `<p>${item.description}</p>` : ''}
            </div>
          </div>
        `;
        }
        return `
        <div class="list-item">
          <div class="list-marker">${index + 1}</div>
          <div class="list-content">
            <h4>${String(item)}</h4>
          </div>
        </div>
      `;
      })
      .join('');
  }

  /**
   * Render table of contents sections
   */
  private renderSections(items: any[]): string {
    if (!Array.isArray(items)) return String(items);

    return items
      .map((item, index) => {
        const title = typeof item === 'string' ? item : item.title || item.name || String(item);
        return `
        <div class="toc-item">
          <div class="toc-number">${index + 1}</div>
          <div class="text-xl">${title}</div>
        </div>
      `;
      })
      .join('');
  }

  /**
   * Render table data with headers and rows
   */
  private renderTable(data: any[]): string {
    if (!Array.isArray(data) || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const headerRow = headers.map(h => `<th>${h}</th>`).join('');
    const dataRows = data
      .map(row => `<tr>${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}</tr>`)
      .join('');

    return `
      <table class="data-table">
        <thead><tr>${headerRow}</tr></thead>
        <tbody>${dataRows}</tbody>
      </table>
    `;
  }

  /**
   * Render team member cards
   */
  private renderTeamMembers(members: any[]): string {
    if (!Array.isArray(members)) return '';

    return members
      .map(
        member => `
      <div class="team-member-card">
        ${member.photo ? `<img src="${member.photo}" alt="${member.name}" class="member-photo">` : ''}
        <h3 class="member-name">${member.name || ''}</h3>
        <p class="member-title">${member.title || ''}</p>
        ${member.description ? `<p class="member-description">${member.description}</p>` : ''}
      </div>
    `
      )
      .join('');
  }

  /**
   * Render timeline with connected milestones
   */
  private renderTimeline(items: any[]): string {
    if (!Array.isArray(items)) return '';

    return items
      .map(
        (item, index) => `
      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <h4>${item.title || item.phase || ''}</h4>
          <p>${item.description || item.details || ''}</p>
          ${item.date ? `<span class="timeline-date">${item.date}</span>` : ''}
        </div>
      </div>
    `
      )
      .join('');
  }

  /**
   * Render comparison between items
   */
  private renderComparison(items: any[]): string {
    if (!Array.isArray(items) || items.length < 2) return '';

    return `
      <div class="comparison-container">
        ${items
          .map(
            item => `
          <div class="comparison-item">
            <h3>${item.name || item.title || ''}</h3>
            ${item.features ? this.renderList(item.features) : ''}
            ${item.description ? `<p>${item.description}</p>` : ''}
          </div>
        `
          )
          .join('')}
      </div>
    `;
  }

  /**
   * Apply design customizations to rendered HTML
   */
  private applyDesignOptions(html: string, options: SlideGenerationInput['designOptions']): string {
    if (!options) return html;

    // Apply color scheme
    if (options.colorScheme) {
      html = html.replace(/#2563eb/g, options.colorScheme);
    }

    // Apply font family
    if (options.fontFamily) {
      html = html.replace(/Roboto/g, options.fontFamily);
    }

    // Apply custom styles
    if (options.customStyles) {
      const styleSheet = Object.entries(options.customStyles)
        .map(([property, value]) => `${property}: ${value};`)
        .join(' ');
      html = html.replace('<head>', `<head><style>.slide-container { ${styleSheet} }</style>`);
    }

    return html;
  }

  /**
   * Get list of placeholders that were successfully filled
   */
  private getFilledPlaceholders(
    template: SlideTemplate,
    contentData: Record<string, any>
  ): string[] {
    return template.placeholders.filter(
      placeholder =>
        contentData[placeholder] !== undefined &&
        contentData[placeholder] !== null &&
        contentData[placeholder] !== ''
    );
  }

  /**
   * Save generated slide to session workspace
   */
  private saveToSession(
    html: string,
    sessionId: string,
    templateId: string,
    contentData: Record<string, any>
  ): { filePath: string; sessionPath: string } {
    // Determine session directory path
    const sessionPath = join(process.cwd(), 'iron-manus-sessions', sessionId);
    const slidesPath = join(sessionPath, 'slides');

    // Ensure slides directory exists
    if (!existsSync(slidesPath)) {
      mkdirSync(slidesPath, { recursive: true });
    }

    // Generate unique filename
    const slideNumber = contentData._slideNumber || Date.now();
    const title = contentData.title
      ? contentData.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 50)
      : templateId;
    const fileName = `slide_${slideNumber}_${title}.html`;
    const filePath = join(slidesPath, fileName);

    // Add session metadata to HTML
    const htmlWithMetadata = this.addMetadataToHtml(html, {
      sessionId,
      templateId,
      generatedAt: new Date().toISOString(),
      slideNumber,
      fileName,
    });

    // Save to file
    writeFileSync(filePath, htmlWithMetadata, 'utf-8');

    return { filePath, sessionPath };
  }

  /**
   * Add metadata to HTML as comments for debugging and tracking
   */
  private addMetadataToHtml(html: string, metadata: Record<string, any>): string {
    const metadataComment = `<!-- 
Iron Manus MCP Slide Metadata
${JSON.stringify(metadata, null, 2)}
-->`;

    return metadataComment + '\n' + html;
  }
}
