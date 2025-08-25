/**
 * Presentation Pipeline End-to-End Test
 *
 * This file provides testing capabilities for the complete presentation pipeline
 * including presentation mode detection, asset management, and slide generation.
 */

import { SlideExecutor } from './slide-executor.js';
import { PresentationAssetManager } from './asset-manager.js';
import { SlideOutline, BatchGroup, PresentationAssets } from '../core/types.js';
import logger from '../utils/logger.js';

export interface PipelineTestResult {
  test_name: string;
  success: boolean;
  duration_ms: number;
  steps_completed: string[];
  errors: string[];
  summary: {
    slides_generated: number;
    assets_prepared: number;
    directory_created: boolean;
  };
}

/**
 * PresentationPipelineTest - Comprehensive testing for presentation workflows
 */
export class PresentationPipelineTest {
  private slideExecutor: SlideExecutor;
  private assetManager: PresentationAssetManager;

  constructor() {
    this.slideExecutor = new SlideExecutor();
    this.assetManager = new PresentationAssetManager();
  }

  /**
   * Run a comprehensive end-to-end test of the presentation pipeline
   */
  async runEndToEndTest(
    topic: string = 'AI Agent Architecture',
    slideCount: number = 10
  ): Promise<PipelineTestResult> {
    const startTime = Date.now();
    const stepsCompleted: string[] = [];
    const errors: string[] = [];

    logger.info(`Starting end-to-end presentation pipeline test: ${topic}`);

    try {
      // Step 1: Initialize presentation project
      const assets = await this.assetManager.initializePresentationProject(topic);
      stepsCompleted.push('Project initialization');
      logger.info(`✓ Project initialized: ${assets.project_directory}`);

      // Step 2: Create slide outline
      const slideOutline = SlideExecutor.createSampleOutline(topic, slideCount);
      stepsCompleted.push('Slide outline creation');
      logger.info(`✓ Slide outline created: ${slideOutline.length} slides`);

      // Step 3: Create batch groups
      const batchGroups = SlideExecutor.createSampleBatches(slideCount);
      stepsCompleted.push('Batch planning');
      logger.info(`✓ Batch groups created: ${batchGroups.length} batches`);

      // Step 4: Prepare sample assets
      const assetRequests = PresentationAssetManager.createSampleAssetRequests(topic);
      const assetResult = await this.assetManager.prepareAssets(assets, assetRequests);
      stepsCompleted.push('Asset preparation');
      logger.info(`✓ Assets prepared: ${assetResult.assets_prepared}/${assetRequests.length}`);

      if (!assetResult.success) {
        errors.push(...assetResult.errors);
      }

      // Step 5: Generate slides in batches
      const slideResult = await this.slideExecutor.executeBatchSlideGeneration(
        slideOutline,
        batchGroups,
        assets.project_directory,
        assets
      );
      stepsCompleted.push('Batch slide generation');
      logger.info(`✓ Slides generated: ${slideResult.slides_generated}/${slideCount}`);

      if (!slideResult.success) {
        errors.push(...slideResult.errors);
      }

      // Step 6: Validate results
      const validationResult = await this.validateTestResults(assets, slideResult.slides_generated);
      stepsCompleted.push('Result validation');

      if (!validationResult.success) {
        errors.push(...validationResult.errors);
      }

      const duration = Date.now() - startTime;
      const overallSuccess = errors.length === 0;

      logger.info(
        `End-to-end test completed in ${duration}ms - ${overallSuccess ? 'SUCCESS' : 'FAILED'}`
      );

      return {
        test_name: `E2E-${topic.replace(/\s+/g, '-')}`,
        success: overallSuccess,
        duration_ms: duration,
        steps_completed: stepsCompleted,
        errors,
        summary: {
          slides_generated: slideResult.slides_generated,
          assets_prepared: assetResult.assets_prepared,
          directory_created: assetResult.directory_created,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`Fatal error: ${errorMessage}`);

      logger.error(`End-to-end test failed: ${errorMessage}`);

      return {
        test_name: `E2E-${topic.replace(/\s+/g, '-')}`,
        success: false,
        duration_ms: Date.now() - startTime,
        steps_completed: stepsCompleted,
        errors,
        summary: {
          slides_generated: 0,
          assets_prepared: 0,
          directory_created: false,
        },
      };
    }
  }

  /**
   * Test presentation mode detection logic (simulated)
   */
  async testPresentationDetection(): Promise<PipelineTestResult> {
    const startTime = Date.now();
    const stepsCompleted: string[] = [];
    const errors: string[] = [];

    logger.info('Testing presentation mode detection');

    try {
      // Test various presentation request patterns
      const testCases = [
        'Create a presentation about machine learning',
        'Make slides showing our API architecture',
        'Build a deck for the quarterly review',
        'Generate a slideshow about product features',
        'Design presentation explaining the new workflow',
      ];

      let detectedCount = 0;

      for (const testCase of testCases) {
        // Simulate the detection logic from FSM
        const detected = this.simulatePresentationDetection(testCase);
        if (detected) {
          detectedCount++;
          logger.debug(`✓ Detected: "${testCase}"`);
        } else {
          logger.debug(`✗ Missed: "${testCase}"`);
          errors.push(`Failed to detect presentation request: "${testCase}"`);
        }
      }

      stepsCompleted.push('Presentation detection tests');

      // Test negative cases (should NOT be detected)
      const negativeCases = [
        'Fix the authentication bug in the login system',
        'Implement JWT token validation',
        'Create a new database schema for users',
      ];

      for (const negativeCase of negativeCases) {
        const detected = this.simulatePresentationDetection(negativeCase);
        if (detected) {
          errors.push(`False positive: "${negativeCase}" was incorrectly detected as presentation`);
        } else {
          logger.debug(`✓ Correctly ignored: "${negativeCase}"`);
        }
      }

      stepsCompleted.push('Negative case validation');

      const success = errors.length === 0 && detectedCount === testCases.length;

      return {
        test_name: 'Presentation-Detection',
        success,
        duration_ms: Date.now() - startTime,
        steps_completed: stepsCompleted,
        errors,
        summary: {
          slides_generated: 0,
          assets_prepared: 0,
          directory_created: false,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`Detection test error: ${errorMessage}`);

      return {
        test_name: 'Presentation-Detection',
        success: false,
        duration_ms: Date.now() - startTime,
        steps_completed: stepsCompleted,
        errors,
        summary: {
          slides_generated: 0,
          assets_prepared: 0,
          directory_created: false,
        },
      };
    }
  }

  /**
   * Simulate the presentation detection logic from FSM
   */
  private simulatePresentationDetection(objective: string): boolean {
    const presentationKeywords = [
      'presentation',
      'slideshow',
      'slides',
      'present',
      'deck',
      'pitch',
      'demo',
      'visual presentation',
      'slide deck',
      'powerpoint',
      'keynote',
      'charts',
      'graphs',
      'visualization',
      'slide show',
      'presenting',
    ];

    const textToAnalyze = objective.toLowerCase();

    // Check for direct presentation keywords
    const hasKeywords = presentationKeywords.some(keyword => textToAnalyze.includes(keyword));

    // Check for presentation patterns
    const presentationPatterns = [
      /create.*slides.*about/i,
      /make.*presentation.*on/i,
      /build.*deck.*for/i,
      /generate.*slides.*showing/i,
      /design.*presentation.*explaining/i,
    ];

    const hasPatterns = presentationPatterns.some(pattern => pattern.test(objective));

    return hasKeywords || hasPatterns;
  }

  /**
   * Validate test results
   */
  private async validateTestResults(
    assets: PresentationAssets,
    slidesGenerated: number
  ): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      // Validate directory structure
      const directoryValid = await this.assetManager.validatePresentationDirectory(
        assets.project_directory
      );
      if (!directoryValid) {
        errors.push('Presentation directory structure is invalid');
      }

      // Validate asset tracking
      if (Object.keys(assets.asset_status).length === 0) {
        errors.push('No assets were tracked');
      }

      // Validate slide generation
      if (slidesGenerated === 0) {
        errors.push('No slides were generated');
      }

      return {
        success: errors.length === 0,
        errors,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown validation error';
      return {
        success: false,
        errors: [errorMessage],
      };
    }
  }

  /**
   * Run all tests and generate comprehensive report
   */
  async runAllTests(): Promise<PipelineTestResult[]> {
    logger.info('Starting comprehensive presentation pipeline tests');

    const results: PipelineTestResult[] = [];

    // Test 1: Presentation detection
    const detectionTest = await this.testPresentationDetection();
    results.push(detectionTest);

    // Test 2: Small presentation (5 slides, 1 batch)
    const smallTest = await this.runEndToEndTest('Quick Demo', 5);
    results.push(smallTest);

    // Test 3: Medium presentation (8 slides, 2 batches)
    const mediumTest = await this.runEndToEndTest('Technical Overview', 8);
    results.push(mediumTest);

    // Test 4: Full presentation (10 slides, 2 batches of 5 each)
    const fullTest = await this.runEndToEndTest('Comprehensive Analysis', 10);
    results.push(fullTest);

    // Generate summary report
    const totalTests = results.length;
    const passedTests = results.filter(r => r.success).length;
    const totalDuration = results.reduce((sum, r) => sum + r.duration_ms, 0);

    logger.info(`\n=== PRESENTATION PIPELINE TEST SUMMARY ===`);
    logger.info(`Tests Passed: ${passedTests}/${totalTests}`);
    logger.info(`Total Duration: ${totalDuration}ms`);
    logger.info(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    for (const result of results) {
      const status = result.success ? '✓ PASS' : '✗ FAIL';
      logger.info(`${status} ${result.test_name} (${result.duration_ms}ms)`);
      if (!result.success && result.errors.length > 0) {
        result.errors.forEach(error => logger.error(`  - ${error}`));
      }
    }

    return results;
  }
}

/**
 * Standalone function to run a quick test
 */
export async function runQuickPresentationTest(): Promise<void> {
  const tester = new PresentationPipelineTest();

  try {
    const result = await tester.runEndToEndTest('Quick Test', 3);

    if (result.success) {
      console.log('✓ Presentation pipeline test PASSED');
      console.log(`Generated ${result.summary.slides_generated} slides in ${result.duration_ms}ms`);
    } else {
      console.log('✗ Presentation pipeline test FAILED');
      result.errors.forEach(error => console.log(`  Error: ${error}`));
    }
  } catch (error) {
    console.error('Test execution failed:', error);
  }
}

// Export for potential CLI usage
if (import.meta.url === new URL(import.meta.resolve('./presentation-pipeline-test.js')).href) {
  runQuickPresentationTest();
}
