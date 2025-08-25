// PresentationOrchestrator Tests - Comprehensive testing for structured presentation generation
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PresentationOrchestrator, PresentationRequest, PresentationResult, GeneratedSlideInfo } from '../../src/executors/presentation-orchestrator.js';
import { SlideGeneratorTool } from '../../src/tools/content/slide-generator-tool.js';
import { TemplateSelector } from '../../src/templates/slide-templates.js';
import { existsSync, mkdirSync, rmSync, readdirSync } from 'fs';
import { join } from 'path';

// Mock external dependencies
vi.mock('../../src/utils/logger.js', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn()
  }
}));

describe('PresentationOrchestrator', () => {
  let orchestrator: PresentationOrchestrator;
  let mockSlideGenerator: vi.Mocked<SlideGeneratorTool>;
  const testSessionId = 'test-session-orchestrator';
  const testSessionPath = join(process.cwd(), 'iron-manus-sessions', testSessionId);

  beforeEach(() => {
    // Create a mock SlideGeneratorTool
    mockSlideGenerator = {
      generateSlide: vi.fn(),
      generateSlideWithAutoTemplate: vi.fn(),
      name: 'SlideGenerator',
      description: 'Mock slide generator',
      inputSchema: {} as any,
      handle: vi.fn()
    } as any;
    
    // Setup default mock responses for SlideGeneratorTool with dynamic template handling
    mockSlideGenerator.generateSlide.mockImplementation(async (input) => {
      // Create realistic file path based on input
      const slideFileName = `slide_${input.contentData._slideNumber || 1}_${input.contentData.title?.replace(/\s+/g, '_') || 'untitled'}.html`;
      
      return {
        html: `<html><head><title>${input.contentData.title || 'Mock Slide'}</title></head><body>Mock slide content for ${input.templateId}</body></html>`,
        templateUsed: input.templateId,
        placeholdersFilled: Object.keys(input.contentData),
        filePath: join(testSessionPath, 'slides', slideFileName),
        sessionPath: testSessionPath,
        metadata: {
          generatedAt: new Date().toISOString(),
          templateId: input.templateId,
          slideNumber: input.contentData._slideNumber || 1
        }
      };
    });

    // Create fresh orchestrator instance and inject mock
    orchestrator = new PresentationOrchestrator();
    (orchestrator as any).slideGenerator = mockSlideGenerator;

    // Clean up any existing test session
    if (existsSync(testSessionPath)) {
      rmSync(testSessionPath, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    // Clean up test session
    if (existsSync(testSessionPath)) {
      rmSync(testSessionPath, { recursive: true, force: true });
    }
    vi.clearAllMocks();
  });

  describe('Core Structure Enforcement', () => {
    it('should enforce Title → TOC → Content → Closing structure', async () => {
      const request: PresentationRequest = {
        title: 'Test Presentation',
        subtitle: 'Testing Structure',
        objective: 'Validate presentation structure',
        audience: 'Test audience',
        contentBlocks: [
          {
            title: 'Content Slide 1',
            content: 'This is test content for slide 1'
          },
          {
            title: 'Content Slide 2', 
            content: 'This is test content for slide 2'
          }
        ],
        sessionId: testSessionId,
        author: 'Test Author'
      };

      const result = await orchestrator.generatePresentation(request);

      expect(result.success).toBe(true);
      expect(result.slides).toHaveLength(5); // Title + TOC + 2 Content + Closing
      
      // Verify structure order
      expect(result.slides[0]).toHaveValidSlideStructure('cover_slide', 1);
      expect(result.slides[1]).toHaveValidSlideStructure('table_of_contents', 2);
      expect(result.slides[2]).toHaveValidSlideStructure('auto', 3); // Content slides use template selection
      expect(result.slides[3]).toHaveValidSlideStructure('auto', 4);
      expect(result.slides[4]).toHaveValidSlideStructure('closing_slide', 5);

      // Verify structure metadata
      expect(result.metadata.structure).toHaveValidPresentationStructure();
    });

    it('should generate proper table of contents from content blocks', async () => {
      const request: PresentationRequest = {
        title: 'Test Presentation',
        objective: 'Test TOC generation',
        audience: 'Developers',
        contentBlocks: [
          {
            title: 'Introduction to Architecture',
            content: 'Overview of the system architecture and key components'
          },
          {
            title: 'Implementation Details',
            content: 'Technical implementation specifics and code examples'
          },
          {
            title: 'Performance Metrics',
            content: 'Benchmarks and performance analysis data'
          }
        ],
        sessionId: testSessionId
      };

      const result = await orchestrator.generatePresentation(request);

      expect(result.success).toBe(true);
      
      // Verify TOC slide was called with proper content
      const tocCall = mockSlideGenerator.generateSlide.mock.calls.find(
        call => call[0].templateId === 'table_of_contents'
      );
      
      expect(tocCall).toBeDefined();
      expect(tocCall![0].contentData.sections).toHaveLength(3);
      expect(tocCall![0].contentData.sections[0].title).toBe('Introduction to Architecture');
      expect(tocCall![0].contentData.sections[1].title).toBe('Implementation Details');
      expect(tocCall![0].contentData.sections[2].title).toBe('Performance Metrics');
    });

    it('should handle empty content blocks gracefully', async () => {
      const request: PresentationRequest = {
        title: 'Minimal Presentation',
        objective: 'Test minimal structure',
        audience: 'Test audience',
        contentBlocks: [], // No content blocks
        sessionId: testSessionId
      };

      const result = await orchestrator.generatePresentation(request);

      expect(result.success).toBe(true);
      expect(result.slides).toHaveLength(3); // Title + TOC + Closing only
      
      expect(result.metadata.structure.hasTitle).toBe(true);
      expect(result.metadata.structure.hasTableOfContents).toBe(true);
      expect(result.metadata.structure.contentSlides).toBe(0);
      expect(result.metadata.structure.hasClosing).toBe(true);
    });
  });

  describe('Session Workspace Management', () => {
    it('should create session directory if it does not exist', async () => {
      const request: PresentationRequest = {
        title: 'Test Presentation',
        objective: 'Test directory creation',
        audience: 'Test audience',
        contentBlocks: [
          { title: 'Test Slide', content: 'Test content' }
        ],
        sessionId: testSessionId
      };

      expect(existsSync(testSessionPath)).toBe(false);

      const result = await orchestrator.generatePresentation(request);

      expect(result.success).toBe(true);
      expect(existsSync(testSessionPath)).toBe(true);
      expect(existsSync(join(testSessionPath, 'slides'))).toBe(true);
    });

    it('should isolate sessions in separate directories', async () => {
      const session1Id = 'test-session-1';
      const session2Id = 'test-session-2';
      
      const request1: PresentationRequest = {
        title: 'Presentation 1',
        objective: 'Test isolation',
        audience: 'Audience 1',
        contentBlocks: [{ title: 'Slide 1', content: 'Content 1' }],
        sessionId: session1Id
      };

      const request2: PresentationRequest = {
        title: 'Presentation 2',
        objective: 'Test isolation',
        audience: 'Audience 2',
        contentBlocks: [{ title: 'Slide 2', content: 'Content 2' }],
        sessionId: session2Id
      };

      // Generate both presentations
      const [result1, result2] = await Promise.all([
        orchestrator.generatePresentation(request1),
        orchestrator.generatePresentation(request2)
      ]);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      
      // Verify separate session paths
      expect(result1.sessionPath).toContain(session1Id);
      expect(result2.sessionPath).toContain(session2Id);
      expect(result1.sessionPath).not.toBe(result2.sessionPath);

      // Clean up additional test sessions
      const session1Path = join(process.cwd(), 'iron-manus-sessions', session1Id);
      const session2Path = join(process.cwd(), 'iron-manus-sessions', session2Id);
      
      if (existsSync(session1Path)) rmSync(session1Path, { recursive: true, force: true });
      if (existsSync(session2Path)) rmSync(session2Path, { recursive: true, force: true });
    });

    it('should generate navigation index file', async () => {
      const request: PresentationRequest = {
        title: 'Test Presentation Index',
        objective: 'Test index generation',
        audience: 'Test audience',
        contentBlocks: [
          { title: 'Content Slide', content: 'Test content for index' }
        ],
        sessionId: testSessionId
      };

      const result = await orchestrator.generatePresentation(request);

      expect(result.success).toBe(true);
      expect(result.indexFilePath).toBeDefined();
      expect(result.indexFilePath).toContain('presentation_index.html');
      expect(existsSync(result.indexFilePath!)).toBe(true);
    });
  });

  describe('Content Processing and Template Integration', () => {
    it('should use explicit content types when specified', async () => {
      const request: PresentationRequest = {
        title: 'Content Type Test',
        objective: 'Test explicit content types',
        audience: 'Developers',
        contentBlocks: [
          {
            title: 'Team Information',
            content: 'Meet our development team',
            contentType: 'team'
          },
          {
            title: 'Performance Data',
            content: 'System performance metrics',
            contentType: 'data'
          }
        ],
        sessionId: testSessionId
      };

      await orchestrator.generatePresentation(request);

      // Verify that explicit content types were used
      const teamSlideCall = mockSlideGenerator.generateSlide.mock.calls.find(
        call => call[0].templateId === 'team_showcase'
      );
      const dataSlideCall = mockSlideGenerator.generateSlide.mock.calls.find(
        call => call[0].templateId === 'data_table'
      );

      expect(teamSlideCall).toBeDefined();
      expect(dataSlideCall).toBeDefined();
    });

    it('should use intelligent template selection for auto content type', async () => {
      // Mock TemplateSelector to return specific template
      const mockAnalyze = vi.spyOn(TemplateSelector, 'analyzeContent').mockReturnValue({
        contentType: 'testimonial_quote',
        keywords: ['quote', 'testimonial'],
        structure: 'text',
        complexity: 'simple',
        recommendedTemplate: 'quote_highlight',
        confidence: 0.9
      });

      const request: PresentationRequest = {
        title: 'Template Selection Test',
        objective: 'Test intelligent template selection',
        audience: 'Test audience',
        contentBlocks: [
          {
            title: 'Customer Testimonial',
            content: 'Our CEO said: "This product revolutionized our workflow"',
            contentType: 'auto'
          }
        ],
        sessionId: testSessionId
      };

      await orchestrator.generatePresentation(request);

      expect(mockAnalyze).toHaveBeenCalledWith('Our CEO said: "This product revolutionized our workflow"');
      
      const quoteSlideCall = mockSlideGenerator.generateSlide.mock.calls.find(
        call => call[0].templateId === 'quote_highlight'
      );
      expect(quoteSlideCall).toBeDefined();

      mockAnalyze.mockRestore();
    });

    it('should prepare template-specific content data correctly', async () => {
      const request: PresentationRequest = {
        title: 'Content Data Test',
        objective: 'Test content data preparation',
        audience: 'Test audience',
        contentBlocks: [
          {
            title: 'Team Slide',
            content: 'Our amazing team',
            contentType: 'team',
            metadata: {
              teamMembers: [
                { name: 'Alice', role: 'Developer', photo: 'alice.jpg' },
                { name: 'Bob', role: 'Designer', photo: 'bob.jpg' }
              ]
            }
          }
        ],
        sessionId: testSessionId
      };

      await orchestrator.generatePresentation(request);

      const teamSlideCall = mockSlideGenerator.generateSlide.mock.calls.find(
        call => call[0].templateId === 'team_showcase'
      );

      expect(teamSlideCall).toBeDefined();
      expect(teamSlideCall![0].contentData.team_members).toEqual([
        { name: 'Alice', role: 'Developer', photo: 'alice.jpg' },
        { name: 'Bob', role: 'Designer', photo: 'bob.jpg' }
      ]);
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should handle slide generation failures gracefully', async () => {
      // Mock a failure in content slide generation
      mockSlideGenerator.generateSlide
        .mockResolvedValueOnce({ // Title slide succeeds
          success: true,
          filePath: '/mock/title.html',
          html: '<html>Title</html>',
          metadata: {}
        })
        .mockResolvedValueOnce({ // TOC slide succeeds
          success: true,
          filePath: '/mock/toc.html',
          html: '<html>TOC</html>',
          metadata: {}
        })
        .mockRejectedValueOnce(new Error('Content slide generation failed')) // Content slide fails
        .mockResolvedValueOnce({ // Closing slide succeeds
          success: true,
          filePath: '/mock/closing.html',
          html: '<html>Closing</html>',
          metadata: {}
        });

      const request: PresentationRequest = {
        title: 'Error Handling Test',
        objective: 'Test error recovery',
        audience: 'Test audience',
        contentBlocks: [
          { title: 'Failing Content', content: 'This will fail' }
        ],
        sessionId: testSessionId
      };

      const result = await orchestrator.generatePresentation(request);

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Failed to generate content slide 3: Failing Content');
      expect(result.slides).toHaveLength(3); // Title + TOC + Closing (content slide excluded)
    });

    it('should continue generation when non-critical slides fail', async () => {
      // Mock failures for title and closing, but content succeeds
      mockSlideGenerator.generateSlide
        .mockRejectedValueOnce(new Error('Title slide failed'))
        .mockResolvedValueOnce({ // TOC succeeds
          success: true,
          filePath: '/mock/toc.html',
          html: '<html>TOC</html>',
          metadata: {}
        })
        .mockResolvedValueOnce({ // Content succeeds
          success: true,
          filePath: '/mock/content.html',
          html: '<html>Content</html>',
          metadata: {}
        })
        .mockRejectedValueOnce(new Error('Closing slide failed'));

      const request: PresentationRequest = {
        title: 'Partial Failure Test',
        objective: 'Test partial failure recovery',
        audience: 'Test audience',
        contentBlocks: [
          { title: 'Working Content', content: 'This will work' }
        ],
        sessionId: testSessionId
      };

      const result = await orchestrator.generatePresentation(request);

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.slides).toHaveLength(2); // TOC + Content only
      expect(result.metadata.structure.hasTitle).toBe(false);
      expect(result.metadata.structure.hasClosing).toBe(false);
    });

    it('should handle complete generation failure', async () => {
      mockSlideGenerator.generateSlide.mockRejectedValue(new Error('Complete failure'));

      const request: PresentationRequest = {
        title: 'Complete Failure Test',
        objective: 'Test complete failure handling',
        audience: 'Test audience',
        contentBlocks: [
          { title: 'Content', content: 'Content' }
        ],
        sessionId: testSessionId
      };

      const result = await orchestrator.generatePresentation(request);

      expect(result.success).toBe(false);
      expect(result.slides).toHaveLength(0);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.metadata.structure.totalSlides).toBe(0);
    });
  });

  describe('Performance and Metadata', () => {
    it('should track processing time accurately', async () => {
      const request: PresentationRequest = {
        title: 'Performance Test',
        objective: 'Test performance tracking',
        audience: 'Test audience',
        contentBlocks: [
          { title: 'Content', content: 'Test content' }
        ],
        sessionId: testSessionId
      };

      const startTime = Date.now();
      const result = await orchestrator.generatePresentation(request);
      const endTime = Date.now();

      expect(result.success).toBe(true);
      expect(result.metadata.processingTime).toBeGreaterThan(0);
      expect(result.metadata.processingTime).toBeLessThanOrEqual(endTime - startTime + 100); // Allow 100ms tolerance
    });

    it('should generate comprehensive metadata', async () => {
      const request: PresentationRequest = {
        title: 'Metadata Test',
        objective: 'Test metadata generation',
        audience: 'Test audience',
        contentBlocks: [
          { title: 'Content 1', content: 'Test content 1' },
          { title: 'Content 2', content: 'Test content 2' }
        ],
        sessionId: testSessionId,
        author: 'Test Author',
        organization: 'Test Org'
      };

      const result = await orchestrator.generatePresentation(request);

      expect(result.success).toBe(true);
      expect(result.metadata).toMatchObject({
        totalSlides: 5, // Title + TOC + 2 Content + Closing
        generatedAt: expect.any(String),
        processingTime: expect.any(Number),
        structure: {
          hasTitle: true,
          hasTableOfContents: true,
          contentSlides: 2,
          hasClosing: true,
          totalSlides: 5
        }
      });
    });
  });
});

// Custom matchers for presentation testing
declare module 'vitest' {
  interface Assertion<T = any> {
    toHaveValidSlideStructure(expectedTemplate: string, expectedSlideNumber: number): T;
    toHaveValidPresentationStructure(): T;
  }
}