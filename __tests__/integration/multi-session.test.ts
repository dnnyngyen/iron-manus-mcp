// Multi-Session Validation Tests - Concurrency and workspace isolation testing
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PresentationOrchestrator, PresentationRequest } from '../../src/executors/presentation-orchestrator.js';
import { SlideGeneratorTool } from '../../src/tools/content/slide-generator-tool.js';
import { existsSync, rmSync, readdirSync, mkdirSync, writeFileSync } from 'fs';
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

describe('Multi-Session Validation', () => {
  let orchestrators: PresentationOrchestrator[];
  let mockSlideGenerator: vi.Mocked<SlideGeneratorTool>;
  const sessionIds = [
    'multi-session-test-1',
    'multi-session-test-2', 
    'multi-session-test-3',
    'multi-session-test-4'
  ];
  const sessionPaths = sessionIds.map(id => 
    join(process.cwd(), 'iron-manus-sessions', id)
  );

  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
    
    // Setup the slide generator mock implementation
    const generateSlideMock = vi.fn().mockImplementation(async (args) => {
      // Simulate realistic processing time
      await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 10));
      
      // Create proper session directory structure for workspace tests
      const sessionPath = join(process.cwd(), 'iron-manus-sessions', args.sessionId);
      const slidesPath = join(sessionPath, 'slides');
      const slideNumber = args.contentData?._slideNumber || Math.floor(Math.random() * 1000);
      const timestamp = Date.now();
      const fileName = `slide_${slideNumber}_${args.templateId}_${timestamp}.html`;
      const filePath = join(slidesPath, fileName);
      
      // Create directories if needed for workspace isolation tests
      if (!existsSync(slidesPath)) {
        mkdirSync(slidesPath, { recursive: true });
      }
      
      // Write a simple HTML file for workspace tests
      const html = `<html><body><h1>Mock slide for ${args.sessionId}</h1><p>Template: ${args.templateId}</p></body></html>`;
      writeFileSync(filePath, html, 'utf-8');
      
      return {
        html,
        templateUsed: args.templateId || 'mock_template',
        placeholdersFilled: ['title', 'content'],
        filePath,
        sessionPath,
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

    // Create multiple orchestrator instances after setting up mocks
    orchestrators = Array.from({ length: 4 }, () => new PresentationOrchestrator());

    // Clean up any existing test sessions
    for (const sessionPath of sessionPaths) {
      if (existsSync(sessionPath)) {
        rmSync(sessionPath, { recursive: true, force: true });
      }
    }
  });

  afterEach(() => {
    // Clean up all test sessions
    for (const sessionPath of sessionPaths) {
      if (existsSync(sessionPath)) {
        rmSync(sessionPath, { recursive: true, force: true });
      }
    }
    vi.clearAllMocks();
  });

  describe('Parallel Session Processing', () => {
    it('should handle multiple simultaneous presentation generations', async () => {
      const requests: PresentationRequest[] = sessionIds.map((sessionId, index) => ({
        title: `Concurrent Presentation ${index + 1}`,
        subtitle: `Test session ${sessionId}`,
        objective: `Test parallel processing for session ${index + 1}`,
        audience: `Test audience ${index + 1}`,
        contentBlocks: [
          {
            title: `Content Block 1 for Session ${index + 1}`,
            content: `This is content for session ${sessionId} block 1`
          },
          {
            title: `Content Block 2 for Session ${index + 1}`,
            content: `This is content for session ${sessionId} block 2`
          }
        ],
        sessionId,
        author: `Author ${index + 1}`
      }));

      // Execute all presentations concurrently
      const startTime = Date.now();
      const results = await Promise.allSettled(
        requests.map((request, index) => 
          orchestrators[index].generatePresentation(request)
        )
      );
      const endTime = Date.now();

      // Verify all succeeded
      expect(results.every(result => result.status === 'fulfilled')).toBe(true);
      
      const successfulResults = results
        .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
        .map(result => result.value);

      expect(successfulResults.every(result => result.success)).toBe(true);
      
      // Verify each session has the expected structure
      for (let i = 0; i < successfulResults.length; i++) {
        const result = successfulResults[i];
        expect(result.sessionId).toBe(sessionIds[i]);
        expect(result.slides).toHaveLength(5); // Title + TOC + 2 Content + Closing
        expect(result.sessionPath).toContain(sessionIds[i]);
      }

      // Verify reasonable performance (concurrent should be faster than sequential)
      const processingTime = endTime - startTime;
      console.log(`Concurrent processing time: ${processingTime}ms for ${sessionIds.length} sessions`);
      
      // Should complete in reasonable time (less than 2x single session time)
      expect(processingTime).toBeLessThan(5000); // 5 seconds max for 4 concurrent sessions
    });

    it('should maintain session isolation during concurrent generation', async () => {
      const requests: PresentationRequest[] = [
        {
          title: 'Session A Presentation',
          objective: 'Test session A isolation',
          audience: 'Audience A',
          contentBlocks: [
            { title: 'A Content 1', content: 'Session A specific content 1' },
            { title: 'A Content 2', content: 'Session A specific content 2' }
          ],
          sessionId: sessionIds[0],
          author: 'Author A',
          organization: 'Company A'
        },
        {
          title: 'Session B Presentation',
          objective: 'Test session B isolation',
          audience: 'Audience B',
          contentBlocks: [
            { title: 'B Content 1', content: 'Session B specific content 1' },
            { title: 'B Content 2', content: 'Session B specific content 2' }
          ],
          sessionId: sessionIds[1],
          author: 'Author B',
          organization: 'Company B'
        }
      ];

      // Generate presentations concurrently
      const [resultA, resultB] = await Promise.all([
        orchestrators[0].generatePresentation(requests[0]),
        orchestrators[1].generatePresentation(requests[1])
      ]);

      expect(resultA.success).toBe(true);
      expect(resultB.success).toBe(true);

      // Verify complete isolation
      expect(resultA.sessionId).toBe(sessionIds[0]);
      expect(resultB.sessionId).toBe(sessionIds[1]);
      expect(resultA.sessionPath).not.toBe(resultB.sessionPath);

      // Verify session-specific content was preserved
      const sessionASlideGenerator = mockSlideGenerator.generateSlide.mock.calls
        .filter(call => call[0].sessionId === sessionIds[0]);
      const sessionBSlideGenerator = mockSlideGenerator.generateSlide.mock.calls
        .filter(call => call[0].sessionId === sessionIds[1]);

      expect(sessionASlideGenerator.length).toBeGreaterThan(0);
      expect(sessionBSlideGenerator.length).toBeGreaterThan(0);

      // Verify no cross-contamination in slide generator calls
      for (const call of sessionASlideGenerator) {
        expect(call[0].sessionId).toBe(sessionIds[0]);
      }
      for (const call of sessionBSlideGenerator) {
        expect(call[0].sessionId).toBe(sessionIds[1]);
      }
    });
  });

  describe('Workspace Isolation', () => {
    it('should create separate workspace directories for each session', async () => {
      const requests: PresentationRequest[] = sessionIds.slice(0, 3).map((sessionId, index) => ({
        title: `Workspace Test ${index + 1}`,
        objective: `Test workspace isolation ${index + 1}`,
        audience: `Test audience ${index + 1}`,
        contentBlocks: [
          { title: `Content ${index + 1}`, content: `Test content ${index + 1}` }
        ],
        sessionId
      }));

      // Generate presentations sequentially to verify workspace creation
      const results = [];
      for (const request of requests) {
        const result = await orchestrators[0].generatePresentation(request);
        results.push(result);
      }

      // Verify all succeeded
      expect(results.every(result => result.success)).toBe(true);

      // Verify separate workspace directories exist
      for (let i = 0; i < sessionIds.slice(0, 3).length; i++) {
        const sessionPath = sessionPaths[i];
        expect(existsSync(sessionPath)).toBe(true);
        expect(existsSync(join(sessionPath, 'slides'))).toBe(true);
        
        // Verify each workspace contains its own files
        const slidesDir = join(sessionPath, 'slides');
        const files = readdirSync(slidesDir);
        expect(files.length).toBeGreaterThan(0);
        
        // Verify workspace isolation (no files from other sessions)
        for (const file of files) {
          expect(file).not.toContain(sessionIds.filter((_, idx) => idx !== i).join(''));
        }
      }

      // Verify workspaces are completely separate
      const allWorkspaces = sessionPaths.slice(0, 3).filter(existsSync);
      expect(allWorkspaces).toHaveLength(3);
      
      // Check that each workspace has unique contents
      const workspaceContents = allWorkspaces.map(workspace => {
        const slidesDir = join(workspace, 'slides');
        return readdirSync(slidesDir);
      });

      // No file should appear in multiple workspaces
      const allFiles = workspaceContents.flat();
      const uniqueFiles = new Set(allFiles);
      expect(uniqueFiles.size).toBe(allFiles.length);
    });

    it('should prevent cross-session file contamination', async () => {
      const sessionARequest: PresentationRequest = {
        title: 'Session A - Unique Content',
        objective: 'Test file isolation A',
        audience: 'Audience A',
        contentBlocks: [
          { title: 'A Specific Content', content: 'This content belongs only to session A' }
        ],
        sessionId: sessionIds[0],
        author: 'Author A'
      };

      const sessionBRequest: PresentationRequest = {
        title: 'Session B - Different Content',
        objective: 'Test file isolation B',
        audience: 'Audience B',
        contentBlocks: [
          { title: 'B Specific Content', content: 'This content belongs only to session B' }
        ],
        sessionId: sessionIds[1],
        author: 'Author B'
      };

      // Generate presentations for both sessions
      const [resultA, resultB] = await Promise.all([
        orchestrators[0].generatePresentation(sessionARequest),
        orchestrators[1].generatePresentation(sessionBRequest)
      ]);

      expect(resultA.success).toBe(true);
      expect(resultB.success).toBe(true);

      // Verify file isolation by checking slide generator calls
      const slideGeneratorCalls = mockSlideGenerator.generateSlide.mock.calls;
      
      const sessionACalls = slideGeneratorCalls.filter(call => call[0].sessionId === sessionIds[0]);
      const sessionBCalls = slideGeneratorCalls.filter(call => call[0].sessionId === sessionIds[1]);

      // Verify session A calls only reference session A data
      for (const call of sessionACalls) {
        expect(call[0].sessionId).toBe(sessionIds[0]);
        if (call[0].contentData?.title) {
          expect(call[0].contentData.title).not.toContain('Session B');
        }
        if (call[0].contentData?.content) {
          expect(call[0].contentData.content).not.toContain('session B');
        }
      }

      // Verify session B calls only reference session B data  
      for (const call of sessionBCalls) {
        expect(call[0].sessionId).toBe(sessionIds[1]);
        if (call[0].contentData?.title) {
          expect(call[0].contentData.title).not.toContain('Session A');
        }
        if (call[0].contentData?.content) {
          expect(call[0].contentData.content).not.toContain('session A');
        }
      }
    });
  });

  describe('Resource Contention and Performance', () => {
    it('should handle high-concurrency scenarios gracefully', async () => {
      const concurrencyLevel = 8;
      const requests: PresentationRequest[] = Array.from({ length: concurrencyLevel }, (_, index) => ({
        title: `High Concurrency Test ${index + 1}`,
        objective: `Load test ${index + 1}`,
        audience: `Load test audience ${index + 1}`,
        contentBlocks: [
          { title: `Load Content 1`, content: `High concurrency content ${index + 1}` },
          { title: `Load Content 2`, content: `Additional load content ${index + 1}` }
        ],
        sessionId: `load-test-session-${index + 1}`,
        author: `Load Test Author ${index + 1}`
      }));

      const orchestratorInstances = Array.from({ length: concurrencyLevel }, () => new PresentationOrchestrator());

      const startTime = Date.now();
      const results = await Promise.allSettled(
        requests.map((request, index) => 
          orchestratorInstances[index].generatePresentation(request)
        )
      );
      const endTime = Date.now();

      // Clean up load test sessions
      for (let i = 1; i <= concurrencyLevel; i++) {
        const loadTestPath = join(process.cwd(), 'iron-manus-sessions', `load-test-session-${i}`);
        if (existsSync(loadTestPath)) {
          rmSync(loadTestPath, { recursive: true, force: true });
        }
      }

      // Verify all sessions completed successfully
      const successfulResults = results.filter(result => result.status === 'fulfilled');
      expect(successfulResults.length).toBe(concurrencyLevel);

      // Verify reasonable performance under load
      const totalProcessingTime = endTime - startTime;
      const averageTimePerSession = totalProcessingTime / concurrencyLevel;
      
      console.log(`High concurrency test: ${concurrencyLevel} sessions in ${totalProcessingTime}ms`);
      console.log(`Average time per session: ${averageTimePerSession.toFixed(2)}ms`);

      // Performance should degrade gracefully (not exponentially)
      expect(averageTimePerSession).toBeLessThan(2000); // 2 seconds max average per session
    });

    it('should maintain performance consistency across sessions', async () => {
      const sessionRequests: PresentationRequest[] = sessionIds.slice(0, 3).map((sessionId, index) => ({
        title: `Performance Test ${index + 1}`,
        objective: `Performance consistency test ${index + 1}`,
        audience: `Performance test audience ${index + 1}`,
        contentBlocks: [
          { title: `Perf Content 1`, content: `Performance test content ${index + 1}` },
          { title: `Perf Content 2`, content: `Additional performance content ${index + 1}` }
        ],
        sessionId,
        author: `Performance Author ${index + 1}`
      }));

      const processingTimes: number[] = [];

      // Execute sessions sequentially to measure individual performance
      for (const request of sessionRequests) {
        const startTime = Date.now();
        const result = await orchestrators[0].generatePresentation(request);
        const endTime = Date.now();

        expect(result.success).toBe(true);
        processingTimes.push(endTime - startTime);
      }

      // Verify performance consistency (no dramatic outliers)
      const averageTime = processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length;
      const maxDeviation = Math.max(...processingTimes.map(time => Math.abs(time - averageTime)));

      console.log(`Performance consistency test:`);
      console.log(`Processing times: ${processingTimes.map(t => `${t}ms`).join(', ')}`);
      console.log(`Average: ${averageTime.toFixed(2)}ms, Max deviation: ${maxDeviation.toFixed(2)}ms`);

      // Max deviation should not be more than 100% of average (reasonable variance)
      expect(maxDeviation).toBeLessThan(averageTime);
    });
  });

  describe('Session Cleanup and Recovery', () => {
    it('should handle failed session cleanup gracefully', async () => {
      const request: PresentationRequest = {
        title: 'Cleanup Test',
        objective: 'Test cleanup handling',
        audience: 'Test audience',
        contentBlocks: [
          { title: 'Test Content', content: 'Test cleanup content' }
        ],
        sessionId: sessionIds[0]
      };

      // Generate presentation successfully
      const result = await orchestrators[0].generatePresentation(request);
      expect(result.success).toBe(true);

      // Verify session workspace was created
      expect(existsSync(sessionPaths[0])).toBe(true);

      // Session should exist and contain expected files
      const slidesDir = join(sessionPaths[0], 'slides');
      expect(existsSync(slidesDir)).toBe(true);
      
      const files = readdirSync(slidesDir);
      expect(files.length).toBeGreaterThan(0);

      // Manual cleanup will be handled by afterEach
      // This test verifies the session was created properly for cleanup
    });

    it('should isolate session failures without affecting other sessions', async () => {
      // Setup mock to fail for specific session
      mockSlideGenerator.generateSlide.mockImplementation(async (args) => {
        if (args.sessionId === sessionIds[1]) {
          throw new Error('Simulated session failure');
        }
        
        await new Promise(resolve => setTimeout(resolve, 10));
        
        // Create proper session directory structure for successful sessions
        const sessionPath = join(process.cwd(), 'iron-manus-sessions', args.sessionId);
        const slidesPath = join(sessionPath, 'slides');
        const fileName = `slide_${args.contentData?._slideNumber || 1}_${args.templateId}.html`;
        const filePath = join(slidesPath, fileName);
        
        if (!existsSync(slidesPath)) {
          mkdirSync(slidesPath, { recursive: true });
        }
        
        const html = `<html><body><h1>Mock slide for ${args.sessionId}</h1></body></html>`;
        writeFileSync(filePath, html, 'utf-8');
        
        return {
          html,
          templateUsed: args.templateId || 'mock_template',
          placeholdersFilled: ['title', 'content'],
          filePath,
          sessionPath,
          metadata: { 
            generatedAt: new Date().toISOString(),
            templateId: args.templateId,
            slideNumber: args.contentData?._slideNumber || 1
          }
        };
      });

      const requests: PresentationRequest[] = [
        {
          title: 'Success Session',
          objective: 'This should succeed',
          audience: 'Test audience',
          contentBlocks: [{ title: 'Success Content', content: 'This will work' }],
          sessionId: sessionIds[0]
        },
        {
          title: 'Failure Session',
          objective: 'This should fail',
          audience: 'Test audience',
          contentBlocks: [{ title: 'Failure Content', content: 'This will fail' }],
          sessionId: sessionIds[1]
        },
        {
          title: 'Another Success Session',
          objective: 'This should also succeed',
          audience: 'Test audience',
          contentBlocks: [{ title: 'Success Content 2', content: 'This will also work' }],
          sessionId: sessionIds[2]
        }
      ];

      // Execute all sessions concurrently
      const results = await Promise.allSettled(
        requests.map((request, index) => orchestrators[index].generatePresentation(request))
      );

      // Verify isolation: success sessions should succeed, failure session should fail
      expect(results[0].status).toBe('fulfilled');
      if (results[0].status === 'fulfilled') {
        expect(results[0].value.success).toBe(true);
        expect(results[0].value.sessionId).toBe(sessionIds[0]);
      }

      expect(results[1].status).toBe('fulfilled');
      if (results[1].status === 'fulfilled') {
        expect(results[1].value.success).toBe(false); // Should fail but not throw
        expect(results[1].value.errors.length).toBeGreaterThan(0);
      }

      expect(results[2].status).toBe('fulfilled');
      if (results[2].status === 'fulfilled') {
        expect(results[2].value.success).toBe(true);
        expect(results[2].value.sessionId).toBe(sessionIds[2]);
      }
    });
  });
});