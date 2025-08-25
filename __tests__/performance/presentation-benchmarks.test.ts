// Performance Benchmarks - Presentation generation speed and resource usage testing
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PresentationOrchestrator, PresentationRequest } from '../../src/executors/presentation-orchestrator.js';
import { TemplateSelector } from '../../src/templates/slide-templates.js';
import { SlideGeneratorTool } from '../../src/tools/content/slide-generator-tool.js';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';

// Mock external dependencies
vi.mock('../../src/tools/content/slide-generator-tool.js', () => {
  return {
    SlideGeneratorTool: vi.fn().mockImplementation(() => {
      return {
        generateSlide: vi.fn()
      };
    })
  };
});
vi.mock('../../src/utils/logger.js', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn()
  }
}));

interface PerformanceMetrics {
  processingTime: number;
  memoryUsage: {
    before: NodeJS.MemoryUsage;
    after: NodeJS.MemoryUsage;
    peak: NodeJS.MemoryUsage;
  };
  slidesGenerated: number;
  averageTimePerSlide: number;
}

describe('Presentation Performance Benchmarks', () => {
  let orchestrator: PresentationOrchestrator;
  let mockSlideGenerator: vi.Mocked<SlideGeneratorTool>;
  const testSessionIds: string[] = [];

  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
    
    // Setup the slide generator mock implementation
    const generateSlideMock = vi.fn().mockImplementation(async (args) => {
      // Simulate realistic slide generation time
      const baseTime = 50; // Base 50ms
      const variableTime = Math.random() * 30; // 0-30ms variable
      await new Promise(resolve => setTimeout(resolve, baseTime + variableTime));
      
      return {
        html: `<html>Mock slide content for ${args.templateId}</html>`,
        templateUsed: args.templateId || 'mock_template',
        placeholdersFilled: ['title', 'content'],
        filePath: `/mock/sessions/${args.sessionId}/slide_${Date.now()}.html`,
        sessionPath: `/mock/sessions/${args.sessionId}`,
        metadata: { 
          generatedAt: new Date().toISOString(),
          templateId: args.templateId,
          slideNumber: args.contentData?._slideNumber || 1
        }
      };
    });

    // Apply the mock to the constructor
    vi.mocked(SlideGeneratorTool).mockImplementation(() => ({
      generateSlide: generateSlideMock
    } as any));

    // Set up the mockSlideGenerator reference for tests
    mockSlideGenerator = { generateSlide: generateSlideMock } as any;

    // Create orchestrator after setting up mocks
    orchestrator = new PresentationOrchestrator();
  });

  afterEach(() => {
    // Clean up test sessions
    for (const sessionId of testSessionIds) {
      const sessionPath = join(process.cwd(), 'iron-manus-sessions', sessionId);
      if (existsSync(sessionPath)) {
        rmSync(sessionPath, { recursive: true, force: true });
      }
    }
    testSessionIds.length = 0; // Clear array
    vi.clearAllMocks();
  });

  async function measurePerformance<T>(
    operation: () => Promise<T>,
    label: string
  ): Promise<{ result: T; metrics: PerformanceMetrics }> {
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    const memoryBefore = process.memoryUsage();
    const startTime = performance.now();
    
    let peakMemory = memoryBefore;
    const memoryMonitor = setInterval(() => {
      const currentMemory = process.memoryUsage();
      if (currentMemory.heapUsed > peakMemory.heapUsed) {
        peakMemory = currentMemory;
      }
    }, 10);

    try {
      const result = await operation();
      const endTime = performance.now();
      const memoryAfter = process.memoryUsage();
      
      clearInterval(memoryMonitor);
      
      const processingTime = endTime - startTime;
      const slidesGenerated = result && typeof result === 'object' && 'slides' in result 
        ? (result as any).slides.length 
        : 1;

      const metrics: PerformanceMetrics = {
        processingTime,
        memoryUsage: {
          before: memoryBefore,
          after: memoryAfter,
          peak: peakMemory
        },
        slidesGenerated,
        averageTimePerSlide: processingTime / slidesGenerated
      };

      console.log(`\n=== ${label} Performance ===`);
      console.log(`Processing time: ${processingTime.toFixed(2)}ms`);
      console.log(`Slides generated: ${slidesGenerated}`);
      console.log(`Average time per slide: ${metrics.averageTimePerSlide.toFixed(2)}ms`);
      console.log(`Memory - Before: ${(memoryBefore.heapUsed / 1024 / 1024).toFixed(2)}MB`);
      console.log(`Memory - After: ${(memoryAfter.heapUsed / 1024 / 1024).toFixed(2)}MB`);
      console.log(`Memory - Peak: ${(peakMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
      console.log(`Memory - Diff: ${((memoryAfter.heapUsed - memoryBefore.heapUsed) / 1024 / 1024).toFixed(2)}MB`);

      return { result, metrics };
    } catch (error) {
      clearInterval(memoryMonitor);
      throw error;
    }
  }

  function createTestRequest(sessionId: string, slideCount: number): PresentationRequest {
    testSessionIds.push(sessionId);
    
    const contentBlocks = Array.from({ length: slideCount }, (_, index) => ({
      title: `Content Slide ${index + 1}`,
      content: `This is test content for slide ${index + 1}. It contains enough text to trigger meaningful template analysis and processing. The content includes various keywords and structures to test the template selection system.`
    }));

    return {
      title: `Performance Test Presentation (${slideCount} content slides)`,
      subtitle: `Benchmark test with ${slideCount} slides`,
      objective: `Performance testing with ${slideCount} content slides`,
      audience: 'Performance testing audience',
      contentBlocks,
      sessionId,
      author: 'Performance Test Suite'
    };
  }

  describe('Generation Speed Benchmarks', () => {
    it('should generate small presentations quickly (3 content slides)', async () => {
      const sessionId = 'perf-small-presentation';
      const request = createTestRequest(sessionId, 3);

      const { result, metrics } = await measurePerformance(
        () => orchestrator.generatePresentation(request),
        'Small Presentation (3 content slides)'
      );

      expect(result.success).toBe(true);
      expect(result.slides).toHaveLength(6); // Title + TOC + 3 Content + Closing = 6

      // Performance expectations for small presentations
      expect(metrics.processingTime).toBeLessThan(1000); // Under 1 second
      expect(metrics.averageTimePerSlide).toBeLessThan(200); // Under 200ms per slide
    });

    it('should generate medium presentations efficiently (8 content slides)', async () => {
      const sessionId = 'perf-medium-presentation';
      const request = createTestRequest(sessionId, 8);

      const { result, metrics } = await measurePerformance(
        () => orchestrator.generatePresentation(request),
        'Medium Presentation (8 content slides)'
      );

      expect(result.success).toBe(true);
      expect(result.slides).toHaveLength(11); // Title + TOC + 8 Content + Closing = 11

      // Performance expectations for medium presentations
      expect(metrics.processingTime).toBeLessThan(2500); // Under 2.5 seconds
      expect(metrics.averageTimePerSlide).toBeLessThan(250); // Under 250ms per slide
    });

    it('should handle large presentations within reasonable time (15 content slides)', async () => {
      const sessionId = 'perf-large-presentation';
      const request = createTestRequest(sessionId, 15);

      const { result, metrics } = await measurePerformance(
        () => orchestrator.generatePresentation(request),
        'Large Presentation (15 content slides)'
      );

      expect(result.success).toBe(true);
      expect(result.slides).toHaveLength(18); // Title + TOC + 15 Content + Closing = 18

      // Performance expectations for large presentations
      expect(metrics.processingTime).toBeLessThan(5000); // Under 5 seconds
      expect(metrics.averageTimePerSlide).toBeLessThan(300); // Under 300ms per slide
    });

    it('should maintain linear scaling performance', async () => {
      const slideCounts = [2, 5, 10];
      const performanceResults: Array<{ slideCount: number; metrics: PerformanceMetrics }> = [];

      for (const slideCount of slideCounts) {
        const sessionId = `perf-scaling-${slideCount}`;
        const request = createTestRequest(sessionId, slideCount);

        const { result, metrics } = await measurePerformance(
          () => orchestrator.generatePresentation(request),
          `Scaling Test (${slideCount} content slides)`
        );

        expect(result.success).toBe(true);
        performanceResults.push({ slideCount, metrics });
      }

      // Analyze scaling characteristics
      console.log('\n=== Scaling Analysis ===');
      for (let i = 0; i < performanceResults.length; i++) {
        const { slideCount, metrics } = performanceResults[i];
        console.log(`${slideCount} slides: ${metrics.processingTime.toFixed(2)}ms (${metrics.averageTimePerSlide.toFixed(2)}ms/slide)`);
      }

      // Verify roughly linear scaling (not exponential)
      for (let i = 1; i < performanceResults.length; i++) {
        const prev = performanceResults[i - 1];
        const curr = performanceResults[i];
        
        const slideRatio = curr.slideCount / prev.slideCount;
        const timeRatio = curr.metrics.processingTime / prev.metrics.processingTime;
        
        // Time ratio should not be significantly worse than slide ratio (allowing for some overhead)
        expect(timeRatio).toBeLessThan(slideRatio * 1.5); // 50% overhead tolerance
      }
    });
  });

  describe('Template Selection Performance', () => {
    it('should perform template analysis quickly', async () => {
      const testContents = [
        'Meet our amazing team of developers and designers working on innovative solutions.',
        'Our CEO said: "This product will revolutionize the industry" at the recent conference.',
        '| Product | Revenue | Growth |\n| A | $100k | +20% |\n| B | $200k | +15% |',
        'Project timeline: Phase 1 (Planning), Phase 2 (Development), Phase 3 (Testing)',
        'Table of Contents: 1. Introduction 2. Features 3. Pricing 4. Conclusion'
      ];

      const { result: results, metrics } = await measurePerformance(
        async () => {
          return testContents.map(content => TemplateSelector.analyzeContent(content));
        },
        'Template Selection Performance'
      );

      expect(results).toHaveLength(testContents.length);
      
      // Template selection should be very fast
      expect(metrics.averageTimePerSlide).toBeLessThan(20); // Under 20ms per analysis
      expect(metrics.processingTime).toBeLessThan(100); // Under 100ms total

      // Verify all analyses completed successfully
      for (const analysis of results) {
        expect(analysis.recommendedTemplate).toBeDefined();
        expect(analysis.confidence).toBeGreaterThan(0);
      }
    });

    it('should handle large content analysis efficiently', async () => {
      const largeContent = `
        This is a comprehensive analysis of our product performance including detailed metrics,
        customer testimonials, team information, development timelines, and comparative analysis.
        ${' '.repeat(1000)} ${'Large content section. '.repeat(200)}
        Our development team consists of experienced professionals working on cutting-edge technology.
        Customer feedback: "Outstanding product quality and exceptional service delivery."
        Performance data shows consistent growth across all key performance indicators.
        Timeline includes multiple phases of development, testing, and deployment activities.
        Comparison with competitors reveals significant advantages in functionality and pricing.
      `;

      const { result: analysis, metrics } = await measurePerformance(
        () => Promise.resolve(TemplateSelector.analyzeContent(largeContent)),
        'Large Content Analysis'
      );

      expect(analysis.recommendedTemplate).toBeDefined();
      expect(analysis.confidence).toBeGreaterThan(0);
      
      // Large content analysis should still be fast
      expect(metrics.processingTime).toBeLessThan(100); // Under 100ms even for large content
    });
  });

  describe('Memory Usage Benchmarks', () => {
    it('should maintain reasonable memory usage for standard presentations', async () => {
      const sessionId = 'perf-memory-standard';
      const request = createTestRequest(sessionId, 10);

      const { result, metrics } = await measurePerformance(
        () => orchestrator.generatePresentation(request),
        'Memory Usage - Standard Presentation'
      );

      expect(result.success).toBe(true);

      // Memory usage should be reasonable
      const memoryIncrease = metrics.memoryUsage.after.heapUsed - metrics.memoryUsage.before.heapUsed;
      const memoryIncreaseInMB = memoryIncrease / 1024 / 1024;
      
      expect(memoryIncreaseInMB).toBeLessThan(50); // Under 50MB memory increase
      
      // Peak memory should not be excessive
      const peakIncrease = metrics.memoryUsage.peak.heapUsed - metrics.memoryUsage.before.heapUsed;
      const peakIncreaseInMB = peakIncrease / 1024 / 1024;
      
      expect(peakIncreaseInMB).toBeLessThan(100); // Under 100MB peak increase
    });

    it('should not have significant memory leaks during multiple generations', async () => {
      const iterations = 3;
      const memorySnapshots: NodeJS.MemoryUsage[] = [];
      
      // Take initial memory snapshot
      if (global.gc) global.gc();
      memorySnapshots.push(process.memoryUsage());

      for (let i = 0; i < iterations; i++) {
        const sessionId = `perf-memory-leak-${i}`;
        const request = createTestRequest(sessionId, 5);

        const result = await orchestrator.generatePresentation(request);
        expect(result.success).toBe(true);

        // Force garbage collection and take snapshot
        if (global.gc) global.gc();
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait for GC
        memorySnapshots.push(process.memoryUsage());
      }

      console.log('\n=== Memory Leak Analysis ===');
      for (let i = 0; i < memorySnapshots.length; i++) {
        const snapshot = memorySnapshots[i];
        console.log(`Iteration ${i}: ${(snapshot.heapUsed / 1024 / 1024).toFixed(2)}MB heap`);
      }

      // Check for memory leaks (memory should not continuously increase)
      const initialMemory = memorySnapshots[0].heapUsed;
      const finalMemory = memorySnapshots[memorySnapshots.length - 1].heapUsed;
      const memoryGrowth = (finalMemory - initialMemory) / 1024 / 1024;

      console.log(`Total memory growth: ${memoryGrowth.toFixed(2)}MB`);
      
      // Memory growth should be reasonable (allowing for some caching/optimization)
      expect(memoryGrowth).toBeLessThan(20); // Under 20MB growth for multiple generations
    });
  });

  describe('Concurrent Performance', () => {
    it('should handle concurrent presentations with reasonable resource usage', async () => {
      const concurrencyLevel = 3;
      const sessionIds = Array.from({ length: concurrencyLevel }, (_, i) => `perf-concurrent-${i}`);
      
      // Add to cleanup list
      testSessionIds.push(...sessionIds);

      const requests = sessionIds.map((sessionId, index) => 
        createTestRequest(sessionId, 5) // 5 content slides each
      );

      const orchestrators = Array.from({ length: concurrencyLevel }, () => new PresentationOrchestrator());

      const { result: results, metrics } = await measurePerformance(
        () => Promise.all(
          requests.map((request, index) => orchestrators[index].generatePresentation(request))
        ),
        `Concurrent Performance (${concurrencyLevel} presentations)`
      );

      expect(results.every(result => result.success)).toBe(true);

      // Concurrent execution should be more efficient than sequential
      const totalSlides = results.reduce((sum, result) => sum + result.slides.length, 0);
      const averageTimePerSlide = metrics.processingTime / totalSlides;

      expect(averageTimePerSlide).toBeLessThan(150); // Should be faster due to parallelization
      
      // Memory usage should scale reasonably with concurrency
      const memoryIncrease = metrics.memoryUsage.peak.heapUsed - metrics.memoryUsage.before.heapUsed;
      const memoryIncreaseInMB = memoryIncrease / 1024 / 1024;
      
      expect(memoryIncreaseInMB).toBeLessThan(concurrencyLevel * 25); // Under 25MB per concurrent session
    });
  });

  describe('Performance Regression Detection', () => {
    it('should establish baseline performance metrics', async () => {
      const sessionId = 'perf-baseline';
      const request = createTestRequest(sessionId, 10);

      const { result, metrics } = await measurePerformance(
        () => orchestrator.generatePresentation(request),
        'Baseline Performance Measurement'
      );

      expect(result.success).toBe(true);

      // Establish baseline expectations (these should be monitored for regressions)
      const baselineMetrics = {
        maxProcessingTime: 3000, // 3 seconds max
        maxAverageTimePerSlide: 300, // 300ms max per slide
        maxMemoryIncreaseMB: 30, // 30MB max memory increase
        minSlidesGenerated: 12 // Should generate all expected slides
      };

      expect(metrics.processingTime).toBeLessThan(baselineMetrics.maxProcessingTime);
      expect(metrics.averageTimePerSlide).toBeLessThan(baselineMetrics.maxAverageTimePerSlide);
      expect(metrics.slidesGenerated).toBeGreaterThanOrEqual(baselineMetrics.minSlidesGenerated);

      const memoryIncrease = (metrics.memoryUsage.after.heapUsed - metrics.memoryUsage.before.heapUsed) / 1024 / 1024;
      expect(memoryIncrease).toBeLessThan(baselineMetrics.maxMemoryIncreaseMB);

      // Log baseline for monitoring
      console.log('\n=== Baseline Metrics Established ===');
      console.log(`Processing time: ${metrics.processingTime.toFixed(2)}ms (max: ${baselineMetrics.maxProcessingTime}ms)`);
      console.log(`Average per slide: ${metrics.averageTimePerSlide.toFixed(2)}ms (max: ${baselineMetrics.maxAverageTimePerSlide}ms)`);
      console.log(`Memory increase: ${memoryIncrease.toFixed(2)}MB (max: ${baselineMetrics.maxMemoryIncreaseMB}MB)`);
      console.log(`Slides generated: ${metrics.slidesGenerated} (min: ${baselineMetrics.minSlidesGenerated})`);
    });
  });
});