/**
 * Slide Executor - Handles batch slide generation for presentation pipeline
 *
 * This executor specializes in processing presentation tasks including:
 * - Batch slide generation with parallel execution
 * - Slide template selection and content mapping
 * - Integration with SlideGeneratorTool
 * - Asset management and optimization
 */

import { SlideGeneratorTool } from '../tools/content/slide-generator-tool.js';
import { SlideOutline, BatchGroup, PresentationAssets } from '../core/types.js';
import logger from '../utils/logger.js';

export interface SlideExecutionResult {
  success: boolean;
  slides_generated: number;
  batch_results: BatchSlideResult[];
  errors: string[];
  processing_time: number;
}

export interface BatchSlideResult {
  batch_id: number;
  slide_numbers: number[];
  success: boolean;
  generated_slides: GeneratedSlide[];
  error?: string;
  processing_time: number;
}

export interface GeneratedSlide {
  slide_number: number;
  title: string;
  html_content: string;
  template_used: string;
  file_path?: string;
}

/**
 * SlideExecutor - Core class for presentation slide generation
 */
export class SlideExecutor {
  private slideGenerator: SlideGeneratorTool;

  constructor() {
    this.slideGenerator = new SlideGeneratorTool();
  }

  /**
   * Execute batch slide generation based on slide outline and batch plan
   *
   * @param slideOutline Array of slide specifications
   * @param batchGroups Batch groupings for parallel execution
   * @param presentationDir Directory for presentation output
   * @param assets Presentation assets (images, diagrams, etc.)
   * @returns Execution result with generated slides and metrics
   */
  async executeBatchSlideGeneration(
    slideOutline: SlideOutline[],
    batchGroups: BatchGroup[],
    presentationDir: string,
    assets?: PresentationAssets
  ): Promise<SlideExecutionResult> {
    const startTime = Date.now();
    const batchResults: BatchSlideResult[] = [];
    const errors: string[] = [];
    let totalSlidesGenerated = 0;

    logger.info(
      `Starting batch slide generation: ${slideOutline.length} slides, ${batchGroups.length} batches`
    );

    try {
      // Process each batch group
      for (const batch of batchGroups) {
        logger.info(`Processing batch ${batch.batch_id}: slides ${batch.slide_numbers.join(', ')}`);

        const batchResult = await this.processBatch(batch, slideOutline, presentationDir, assets);

        batchResults.push(batchResult);

        if (batchResult.success) {
          totalSlidesGenerated += batchResult.generated_slides.length;
          logger.info(
            `Batch ${batch.batch_id} completed: ${batchResult.generated_slides.length} slides generated`
          );
        } else {
          errors.push(`Batch ${batch.batch_id} failed: ${batchResult.error}`);
          logger.error(`Batch ${batch.batch_id} failed: ${batchResult.error}`);
        }
      }

      const processingTime = Date.now() - startTime;
      const success = errors.length === 0;

      return {
        success,
        slides_generated: totalSlidesGenerated,
        batch_results: batchResults,
        errors,
        processing_time: processingTime,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Batch slide generation failed: ${errorMessage}`);

      return {
        success: false,
        slides_generated: totalSlidesGenerated,
        batch_results: batchResults,
        errors: [errorMessage],
        processing_time: Date.now() - startTime,
      };
    }
  }

  /**
   * Process a single batch of slides
   */
  private async processBatch(
    batch: BatchGroup,
    slideOutline: SlideOutline[],
    presentationDir: string,
    assets?: PresentationAssets
  ): Promise<BatchSlideResult> {
    const batchStartTime = Date.now();
    const generatedSlides: GeneratedSlide[] = [];

    try {
      // Generate slides in parallel for this batch
      const slidePromises = batch.slide_numbers.map(slideNumber =>
        this.generateSingleSlide(slideNumber, slideOutline, presentationDir, assets)
      );

      const slideResults = await Promise.allSettled(slidePromises);

      // Process results
      for (let i = 0; i < slideResults.length; i++) {
        const result = slideResults[i];
        const slideNumber = batch.slide_numbers[i];

        if (result.status === 'fulfilled' && result.value) {
          generatedSlides.push(result.value);
        } else {
          const error = result.status === 'rejected' ? result.reason : 'Unknown error';
          logger.error(`Failed to generate slide ${slideNumber}: ${error}`);
        }
      }

      return {
        batch_id: batch.batch_id,
        slide_numbers: batch.slide_numbers,
        success: generatedSlides.length === batch.slide_numbers.length,
        generated_slides: generatedSlides,
        processing_time: Date.now() - batchStartTime,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown batch error';

      return {
        batch_id: batch.batch_id,
        slide_numbers: batch.slide_numbers,
        success: false,
        generated_slides: generatedSlides,
        error: errorMessage,
        processing_time: Date.now() - batchStartTime,
      };
    }
  }

  /**
   * Generate a single slide based on its outline specification
   */
  private async generateSingleSlide(
    slideNumber: number,
    slideOutline: SlideOutline[],
    presentationDir: string,
    assets?: PresentationAssets
  ): Promise<GeneratedSlide | null> {
    try {
      // Find the slide specification
      const slideSpec = slideOutline.find(slide => slide.slide_number === slideNumber);
      if (!slideSpec) {
        throw new Error(`Slide specification not found for slide ${slideNumber}`);
      }

      // Determine template based on content type
      const templateId = this.selectTemplate(slideSpec.content_type);

      // Prepare content data
      const contentData = this.prepareContentData(slideSpec, assets);

      // Generate the slide
      const result = await this.slideGenerator.handle({
        templateId,
        contentData,
        sessionId: `batch_${Date.now()}`,
      });

      if (!result.isError && result.content && result.content.length > 0) {
        const htmlContent = result.content[0].text;
        return {
          slide_number: slideNumber,
          title: slideSpec.title,
          html_content: htmlContent,
          template_used: templateId,
          file_path: `${presentationDir}/slide_${slideNumber.toString().padStart(2, '0')}.html`,
        };
      } else {
        throw new Error(
          `SlideGeneratorTool failed: ${result.isError ? 'Tool error' : 'No content generated'}`
        );
      }
    } catch (error) {
      logger.error(`Error generating slide ${slideNumber}: ${error}`);
      return null;
    }
  }

  /**
   * Select appropriate template based on content type using our enhanced template system
   */
  private selectTemplate(contentType: string): string {
    const templateMap: { [key: string]: string } = {
      title: 'cover_slide',
      agenda: 'table_of_contents',
      toc: 'table_of_contents',
      intro: 'standard_content',
      content: 'standard_content',
      data: 'data_table',
      team: 'team_showcase',
      quote: 'quote_highlight',
      timeline: 'timeline_flow',
      visual: 'visual_showcase',
      comparison: 'comparison_layout',
      list: 'bulleted_list',
      diagram: 'system_diagram',
      conclusion: 'closing_slide',
      closing: 'closing_slide',
      thank_you: 'closing_slide',
    };

    return templateMap[contentType] || 'standard_content';
  }

  /**
   * Prepare content data for slide generation
   */
  private prepareContentData(
    slideSpec: SlideOutline,
    assets?: PresentationAssets
  ): Record<string, any> {
    const contentData: Record<string, any> = {
      title: slideSpec.title,
      content: slideSpec.description,
      slide_number: slideSpec.slide_number,
    };

    // Add visual requirements if specified
    if (slideSpec.visual_requirements && slideSpec.visual_requirements.length > 0) {
      contentData.visual_elements = slideSpec.visual_requirements;
    }

    // Add relevant assets if available
    if (assets) {
      contentData.available_images = Object.keys(assets.images);
      contentData.available_diagrams = Object.keys(assets.diagrams);
      contentData.project_directory = assets.project_directory;
    }

    return contentData;
  }

  /**
   * Generate a simple slide outline for testing (max 10 slides)
   */
  static createSampleOutline(topic: string, slideCount: number = 10): SlideOutline[] {
    // Enforce maximum of 10 slides
    const maxSlides = Math.min(slideCount, 10);
    const outline: SlideOutline[] = [];

    outline.push({
      slide_number: 1,
      title: `${topic}: Overview`,
      description: `Title slide introducing ${topic}`,
      content_type: 'title',
      batch_group: 1,
    });

    outline.push({
      slide_number: 2,
      title: 'Agenda',
      description: 'Overview of presentation sections and key topics',
      content_type: 'agenda',
      batch_group: 1,
    });

    // Add introduction slide
    if (maxSlides >= 3) {
      outline.push({
        slide_number: 3,
        title: 'Introduction',
        description: `Background and context for ${topic}`,
        content_type: 'intro',
        batch_group: 1,
      });
    }

    // Generate content slides (slides 4-9)
    for (let i = 4; i <= maxSlides - 1; i++) {
      outline.push({
        slide_number: i,
        title: `${topic}: Section ${i - 3}`,
        description: `Content slide covering key aspects of ${topic}`,
        content_type: 'content',
        visual_requirements: ['charts', 'diagrams'],
        batch_group: i <= 5 ? 1 : 2, // First 5 slides in batch 1, rest in batch 2
      });
    }

    // Add conclusion slide
    if (maxSlides >= 4) {
      outline.push({
        slide_number: maxSlides,
        title: 'Conclusion',
        description: 'Summary and key takeaways',
        content_type: 'conclusion',
        batch_group: 2,
      });
    }

    return outline;
  }

  /**
   * Create sample batch groups for testing (2 batches of 5 slides each)
   */
  static createSampleBatches(slideCount: number): BatchGroup[] {
    const maxSlides = Math.min(slideCount, 10);
    const batches: BatchGroup[] = [];

    // Batch 1: First 5 slides (1-5)
    const batch1Slides = [];
    for (let i = 1; i <= Math.min(5, maxSlides); i++) {
      batch1Slides.push(i);
    }

    if (batch1Slides.length > 0) {
      batches.push({
        batch_id: 1,
        slide_numbers: batch1Slides,
        description: `Batch 1: slides ${batch1Slides.join(', ')} (Setup and first content)`,
      });
    }

    // Batch 2: Remaining slides (6-10)
    const batch2Slides = [];
    for (let i = 6; i <= maxSlides; i++) {
      batch2Slides.push(i);
    }

    if (batch2Slides.length > 0) {
      batches.push({
        batch_id: 2,
        slide_numbers: batch2Slides,
        description: `Batch 2: slides ${batch2Slides.join(', ')} (Final content and conclusion)`,
      });
    }

    return batches;
  }
}
