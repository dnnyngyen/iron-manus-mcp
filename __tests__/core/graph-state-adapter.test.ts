// Graph State Adapter Tests - Tests for knowledge graph state management with JSON fallback
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { GraphStateAdapter, graphStateManager } from '../../src/core/graph-state-adapter.js';
import { SessionState, Phase, Role } from '../../src/core/types.js';
import { stateGraphManager } from '../../src/tools/iron-manus-state-graph.js';

// Mock the state graph manager
vi.mock('../../src/tools/iron-manus-state-graph.js', () => ({
  stateGraphManager: {
    readSessionGraph: vi.fn(),
    initializeSession: vi.fn(),
    addSessionObservations: vi.fn(),
    recordTaskCreation: vi.fn(),
    updateTaskStatus: vi.fn(),
    searchSessionNodes: vi.fn(),
  },
}));

describe('GraphStateAdapter', () => {
  let adapter: GraphStateAdapter;
  const mockStateGraphManager = stateGraphManager as any;

  beforeEach(() => {
    adapter = new GraphStateAdapter();
    vi.clearAllMocks();
    
    // Set test environment
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Session State Management', () => {
    it('should create new session when no graph exists', async () => {
      mockStateGraphManager.readSessionGraph.mockResolvedValue({
        entities: [],
        relations: []
      });

      const result = await adapter.getSessionState('new-session');

      expect(result).toEqual({
        current_phase: 'INIT',
        initial_objective: '',
        detected_role: 'researcher',
        payload: {
          current_task_index: 0,
          current_todos: []
        },
        reasoning_effectiveness: 0.8,
        last_activity: expect.any(Number)
      });
    });

    it('should return cached session on second call', async () => {
      mockStateGraphManager.readSessionGraph.mockResolvedValue({
        entities: [],
        relations: []
      });

      const first = await adapter.getSessionState('cached-session');
      const second = await adapter.getSessionState('cached-session');

      expect(first).toBe(second); // Should be same object reference
      expect(mockStateGraphManager.readSessionGraph).toHaveBeenCalledTimes(1);
    });

    it('should handle graph read errors gracefully', async () => {
      mockStateGraphManager.readSessionGraph.mockRejectedValue(new Error('Graph read failed'));

      const result = await adapter.getSessionState('error-session');

      expect(result.current_phase).toBe('INIT');
      expect(result.detected_role).toBe('researcher');
      expect(result.reasoning_effectiveness).toBe(0.8);
    });
  });

  describe('Session State Conversion from Graph', () => {
    it('should convert graph entities to session state', async () => {
      const mockGraphData = {
        entities: [
          {
            name: 'test-session',
            entityType: 'session',
            observations: [
              'current_phase: PLAN',
              'objective: Build a test application',
              'detected_role: coder',
              'reasoning_effectiveness: 0.9',
              'last_activity: 1640995200000',
              'payload_current_task_index: 2',
              'payload_enhanced_goal: "Enhanced test goal"'
            ]
          },
          {
            name: 'test-session_task_task1',
            entityType: 'task',
            observations: [
              'content: First test task',
              'status: completed',
              'priority: high'
            ]
          },
          {
            name: 'test-session_task_task2',
            entityType: 'task',
            observations: [
              'content: Second test task',
              'status: in_progress',
              'priority: medium'
            ]
          }
        ],
        relations: []
      };

      mockStateGraphManager.readSessionGraph.mockResolvedValue(mockGraphData);

      const result = await adapter.getSessionState('test-session');

      expect(result.current_phase).toBe('PLAN');
      expect(result.initial_objective).toBe('Build a test application');
      expect(result.detected_role).toBe('coder');
      expect(result.reasoning_effectiveness).toBe(0.9);
      expect(result.last_activity).toBe(1640995200000);
      expect(result.payload.current_task_index).toBe(2);
      expect(result.payload.enhanced_goal).toBe('Enhanced test goal');
      expect(result.payload.current_todos).toHaveLength(2);
      expect(result.payload.current_todos[0]).toEqual({
        id: 'task1',
        content: 'First test task',
        status: 'completed',
        priority: 'high'
      });
    });

    it('should handle missing session entity', async () => {
      const mockGraphData = {
        entities: [
          {
            name: 'different-session',
            entityType: 'session',
            observations: []
          }
        ],
        relations: []
      };

      mockStateGraphManager.readSessionGraph.mockResolvedValue(mockGraphData);

      const result = await adapter.getSessionState('missing-session');

      expect(result.current_phase).toBe('INIT');
      expect(result.detected_role).toBe('researcher');
    });

    it('should handle malformed graph data', async () => {
      const mockGraphData = {
        entities: [
          {
            name: 'test-session',
            entityType: 'session',
            observations: [
              'invalid_format_observation',
              'current_phase:', // Missing value
              'reasoning_effectiveness: not_a_number'
            ]
          }
        ],
        relations: []
      };

      mockStateGraphManager.readSessionGraph.mockResolvedValue(mockGraphData);

      const result = await adapter.getSessionState('test-session');

      expect(result.current_phase).toBe(''); // Empty value
      expect(result.reasoning_effectiveness).toBeNaN(); // Invalid number
    });
  });

  describe('Session State Updates', () => {
    it('should update session state and sync to graph', async () => {
      // Temporarily set production environment to trigger graph operations
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      // First, create initial session
      mockStateGraphManager.readSessionGraph.mockResolvedValue({
        entities: [],
        relations: []
      });

      await adapter.getSessionState('update-session');

      // Then update it
      const updates: Partial<SessionState> = {
        current_phase: 'EXECUTE',
        detected_role: 'planner',
        reasoning_effectiveness: 0.95
      };

      await adapter.updateSessionState('update-session', updates);

      expect(mockStateGraphManager.initializeSession).toHaveBeenCalledWith(
        'update-session',
        '',
        'planner'
      );
      expect(mockStateGraphManager.addSessionObservations).toHaveBeenCalled();

      // Restore environment
      process.env.NODE_ENV = originalEnv;
    });

    it('should handle task updates in session state', async () => {
      // Temporarily set production environment to trigger graph operations
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      // Set up initial session
      mockStateGraphManager.readSessionGraph.mockResolvedValue({
        entities: [],
        relations: []
      });

      await adapter.getSessionState('task-session');

      // Update with tasks
      const updates: Partial<SessionState> = {
        payload: {
          current_task_index: 1,
          current_todos: [
            {
              id: 'todo1',
              content: 'Complete implementation',
              status: 'in_progress',
              priority: 'high'
            },
            {
              id: 'todo2', 
              content: 'Write tests',
              status: 'pending',
              priority: 'medium'
            }
          ]
        }
      };

      await adapter.updateSessionState('task-session', updates);

      expect(mockStateGraphManager.recordTaskCreation).toHaveBeenCalledWith(
        'task-session',
        'todo1',
        'Complete implementation',
        'high'
      );
      expect(mockStateGraphManager.updateTaskStatus).toHaveBeenCalledWith(
        'task-session',
        'todo1',
        'in_progress'
      );

      // Restore environment
      process.env.NODE_ENV = originalEnv;
    });

    it('should skip graph operations in test environment', async () => {
      process.env.NODE_ENV = 'test';

      // Create initial session
      mockStateGraphManager.readSessionGraph.mockResolvedValue({
        entities: [],
        relations: []
      });

      await adapter.getSessionState('test-env-session');
      await adapter.updateSessionState('test-env-session', { current_phase: 'PLAN' });

      // Graph operations should be skipped
      expect(mockStateGraphManager.initializeSession).not.toHaveBeenCalled();
      expect(mockStateGraphManager.addSessionObservations).not.toHaveBeenCalled();
    });
  });

  describe('Observation Extraction', () => {
    it('should extract observation values correctly', () => {
      const observations = [
        'current_phase: EXECUTE',
        'objective: Test objective with: colons',
        'simple_key: simple_value',
        'empty_key:',
        'no_separator_observation'
      ];

      const adapter = new GraphStateAdapter();
      
      expect((adapter as any).extractObservation(observations, 'current_phase', 'default')).toBe('EXECUTE');
      expect((adapter as any).extractObservation(observations, 'objective', 'default')).toBe('Test objective with: colons');
      expect((adapter as any).extractObservation(observations, 'simple_key', 'default')).toBe('simple_value');
      expect((adapter as any).extractObservation(observations, 'empty_key', 'default')).toBe('');
      expect((adapter as any).extractObservation(observations, 'missing_key', 'default')).toBe('default');
    });

    it('should extract payload from observations', () => {
      const observations = [
        'current_phase: PLAN',
        'payload_task_index: 5',
        'payload_enhanced_goal: "Enhanced objective"',
        'payload_complex_data: {"key": "value", "number": 42}',
        'payload_invalid_json: {invalid json}',
        'regular_observation: not_payload'
      ];

      const adapter = new GraphStateAdapter();
      const payload = (adapter as any).extractPayload(observations);

      expect(payload.task_index).toBe(5);
      expect(payload.enhanced_goal).toBe('Enhanced objective');
      expect(payload.complex_data).toEqual({ key: 'value', number: 42 });
      expect(payload.invalid_json).toBe('{invalid json}'); // Fallback to string
      expect(payload.regular_observation).toBeUndefined(); // Should not be included
    });

    it('should convert payload to observations', () => {
      const payload = {
        task_index: 3,
        enhanced_goal: 'Test goal',
        complex_data: { nested: { value: 42 } },
        current_todos: [], // Should be skipped
        undefined_value: undefined,
        null_value: null,
        boolean_value: true
      };

      const adapter = new GraphStateAdapter();
      const observations = (adapter as any).payloadToObservations(payload);

      expect(observations).toContain('payload_task_index: 3');
      expect(observations).toContain('payload_enhanced_goal: "Test goal"');
      expect(observations).toContain('payload_complex_data: {"nested":{"value":42}}');
      expect(observations).toContain('payload_null_value: null');
      expect(observations).toContain('payload_boolean_value: true');
      
      // Should not contain current_todos (handled separately)
      expect(observations.some(obs => obs.includes('current_todos'))).toBe(false);
    });
  });

  describe('Performance Metrics', () => {
    it('should calculate session performance metrics', async () => {
      const mockGraphData = {
        entities: [
          {
            name: 'perf-session',
            entityType: 'session',
            observations: [
              'current_phase: EXECUTE',
              'detected_role: coder',
              'reasoning_effectiveness: 0.92',
              'last_activity: 1640995200000',
              'payload_current_task_index: 5'
            ]
          },
          {
            name: 'perf-session_phase_query',
            entityType: 'phase',
            observations: []
          },
          {
            name: 'perf-session_phase_enhance',
            entityType: 'phase',
            observations: []
          }
        ],
        relations: []
      };

      mockStateGraphManager.readSessionGraph.mockResolvedValue(mockGraphData);
      mockStateGraphManager.searchSessionNodes.mockResolvedValue(mockGraphData);

      const metrics = await adapter.getSessionPerformanceMetrics('perf-session');

      expect(metrics).toEqual({
        session_id: 'perf-session',
        detected_role: 'coder',
        current_phase: 'EXECUTE',
        phase_transitions: 2,
        reasoning_effectiveness: 0.92,
        performance_grade: 'EXCELLENT',
        cognitive_enhancement_active: true,
        task_complexity_handled: 'complex',
        session_duration_minutes: expect.any(Number)
      });
    });

    it('should calculate performance grades correctly', () => {
      const adapter = new GraphStateAdapter();
      
      expect((adapter as any).calculatePerformanceGrade(0.95)).toBe('EXCELLENT');
      expect((adapter as any).calculatePerformanceGrade(0.85)).toBe('GOOD');
      expect((adapter as any).calculatePerformanceGrade(0.75)).toBe('SATISFACTORY');
      expect((adapter as any).calculatePerformanceGrade(0.65)).toBe('NEEDS_IMPROVEMENT');
      expect((adapter as any).calculatePerformanceGrade(0.55)).toBe('REQUIRES_ATTENTION');
    });
  });

  describe('Cleanup Operations', () => {
    it('should cleanup old sessions from cache', async () => {
      const adapter = new GraphStateAdapter();
      
      // Add sessions to cache with different timestamps
      const oldTime = Date.now() - 25 * 60 * 60 * 1000; // 25 hours ago
      const recentTime = Date.now() - 1 * 60 * 60 * 1000; // 1 hour ago

      (adapter as any).sessionCache.set('old-session', {
        current_phase: 'INIT',
        last_activity: oldTime,
        initial_objective: '',
        detected_role: 'researcher',
        payload: { current_task_index: 0, current_todos: [] },
        reasoning_effectiveness: 0.8
      });

      (adapter as any).sessionCache.set('recent-session', {
        current_phase: 'INIT',
        last_activity: recentTime,
        initial_objective: '',
        detected_role: 'researcher', 
        payload: { current_task_index: 0, current_todos: [] },
        reasoning_effectiveness: 0.8
      });

      await adapter.cleanup();

      expect((adapter as any).sessionCache.has('old-session')).toBe(false);
      expect((adapter as any).sessionCache.has('recent-session')).toBe(true);
    });
  });
});

describe('GraphStateManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    process.env.NODE_ENV = 'test';
    
    // Clear retry queue and session cache to avoid interference between tests
    (graphStateManager as any).retryQueue.clear();
    (graphStateManager as any).sessionCache.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Synchronous State Access', () => {
    it('should return session immediately from cache', () => {
      const sessionId = 'sync-session';
      
      // First call creates and caches
      const first = graphStateManager.getSessionState(sessionId);
      
      // Second call should return same cached instance
      const second = graphStateManager.getSessionState(sessionId);
      
      expect(first).toBe(second);
      expect(first.current_phase).toBe('INIT');
    });

    it('should create new session with default values', () => {
      const session = graphStateManager.getSessionState('new-sync-session');

      expect(session).toEqual({
        current_phase: 'INIT',
        initial_objective: '',
        detected_role: 'researcher',
        payload: { current_task_index: 0, current_todos: [] },
        reasoning_effectiveness: 0.8,
        last_activity: expect.any(Number)
      });
    });
  });

  describe('State Updates', () => {
    it('should update session state immediately in cache', () => {
      const sessionId = 'update-sync-session';
      
      graphStateManager.getSessionState(sessionId);
      
      const updates: Partial<SessionState> = {
        current_phase: 'PLAN',
        detected_role: 'planner',
        reasoning_effectiveness: 0.95
      };

      graphStateManager.updateSessionState(sessionId, updates);
      
      const updatedSession = graphStateManager.getSessionState(sessionId);
      expect(updatedSession.current_phase).toBe('PLAN');
      expect(updatedSession.detected_role).toBe('planner');
      expect(updatedSession.reasoning_effectiveness).toBe(0.95);
      expect(updatedSession.last_activity).toBeGreaterThan(Date.now() - 1000);
    });
  });

  describe('Performance Metrics', () => {
    it('should return simplified performance metrics', () => {
      const sessionId = 'metrics-session';
      
      graphStateManager.updateSessionState(sessionId, {
        current_phase: 'EXECUTE',
        detected_role: 'coder',
        reasoning_effectiveness: 0.88
      });

      const metrics = graphStateManager.getSessionPerformanceMetrics(sessionId);

      expect(metrics).toEqual({
        session_id: sessionId,
        detected_role: 'coder',
        current_phase: 'EXECUTE',
        reasoning_effectiveness: 0.88
      });
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should handle adapter errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Mock adapter to fail
      const mockAdapter = {
        getSessionState: vi.fn().mockRejectedValue(new Error('Adapter error')),
        updateSessionState: vi.fn().mockRejectedValue(new Error('Update error'))
      };

      (graphStateManager as any).adapter = mockAdapter;

      // Should still work despite adapter errors
      const session = graphStateManager.getSessionState('error-session');
      expect(session.current_phase).toBe('INIT');

      graphStateManager.updateSessionState('error-session', { current_phase: 'PLAN' });
      
      // Wait for async operations to complete
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });

    it('should identify retriable errors correctly', () => {
      const manager = graphStateManager as any;

      // Retriable errors
      expect(manager.isRetriableError(new Error('Network timeout'))).toBe(true);
      expect(manager.isRetriableError(new Error('ECONNRESET'))).toBe(true);
      expect(manager.isRetriableError(new Error('ENOTFOUND'))).toBe(true);

      // Non-retriable errors
      expect(manager.isRetriableError(new Error('Permission denied'))).toBe(false);
      expect(manager.isRetriableError(new Error('Unauthorized access'))).toBe(false);
      expect(manager.isRetriableError(new Error('Forbidden operation'))).toBe(false);

      // Default behavior
      expect(manager.isRetriableError(new Error('Unknown error'))).toBe(true);
      expect(manager.isRetriableError('String error')).toBe(true);
    });

    it('should handle retry queue operations', async () => {
      vi.useFakeTimers();
      const manager = graphStateManager as any;

      // Mark session for retry
      manager.markSessionForRetry('retry-session', 'update', { updates: { current_phase: 'PLAN' } });

      expect(manager.retryQueue.size).toBe(1);
      expect(manager.retryQueue.get('retry-session_update')).toEqual({
        operation: 'update',
        data: { updates: { current_phase: 'PLAN' } },
        attempts: 1,
        nextRetry: expect.any(Number)
      });

      vi.useRealTimers();
    });

    it('should respect max retry attempts', () => {
      const manager = graphStateManager as any;
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Mark for retry multiple times
      for (let i = 0; i < 5; i++) {
        manager.markSessionForRetry('max-retry-session', 'update', { updates: {} });
      }

      expect(manager.retryQueue.size).toBe(1);
      expect(manager.retryQueue.get('max-retry-session_update').attempts).toBe(3); // MAX_RETRY_ATTEMPTS

      consoleWarnSpy.mockRestore();
    });

    it('should emit structured error events', () => {
      const manager = graphStateManager as any;
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Test development environment
      process.env.NODE_ENV = 'development';
      manager.emitErrorEvent('test_error', 'test-session', new Error('Test error'));
      
      expect(consoleWarnSpy).toHaveBeenCalledWith('Error event:', expect.objectContaining({
        type: 'test_error',
        session_id: 'test-session',
        error_message: 'Test error',
        component: 'GraphStateManager'
      }));

      // Test production environment
      process.env.NODE_ENV = 'production';
      manager.emitErrorEvent('prod_error', 'prod-session', new Error('Production error'));
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('PRODUCTION_ERROR_EVENT:', expect.stringContaining('prod_error'));

      consoleWarnSpy.mockRestore();
      consoleErrorSpy.mockRestore();
      process.env.NODE_ENV = 'test';
    });
  });

  describe('Cleanup Operations', () => {
    it('should cleanup old sessions and handle adapter cleanup errors', async () => {
      const manager = graphStateManager as any;
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Add old session to cache
      const oldTime = Date.now() - 25 * 60 * 60 * 1000;
      manager.sessionCache.set('old-cleanup-session', {
        current_phase: 'INIT',
        last_activity: oldTime,
        initial_objective: '',
        detected_role: 'researcher',
        payload: { current_task_index: 0, current_todos: [] },
        reasoning_effectiveness: 0.8
      });

      // Mock adapter cleanup to fail
      manager.adapter.cleanup = vi.fn().mockRejectedValue(new Error('Cleanup failed'));

      manager.cleanup();

      // Cache should be cleaned immediately
      expect(manager.sessionCache.has('old-cleanup-session')).toBe(false);

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(consoleErrorSpy).toHaveBeenCalledWith('Graph cleanup failed:', expect.any(Error));
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Retry Queue Processing', () => {
    it('should process retry queue successfully', async () => {
      vi.useFakeTimers();
      const manager = graphStateManager as any;

      // Mock adapter methods
      manager.adapter.updateSessionState = vi.fn().mockResolvedValue(undefined);
      manager.adapter.getSessionState = vi.fn().mockResolvedValue({
        current_phase: 'PLAN',
        initial_objective: '',
        detected_role: 'researcher',
        payload: { current_task_index: 0, current_todos: [] },
        reasoning_effectiveness: 0.8,
        last_activity: Date.now()
      });

      // Add items to retry queue
      manager.retryQueue.set('session1_update', {
        operation: 'update',
        data: { updates: { current_phase: 'PLAN' } },
        attempts: 1,
        nextRetry: Date.now() - 1000 // Past due
      });

      manager.retryQueue.set('session2_load', {
        operation: 'load',
        data: { sessionId: 'session2' },
        attempts: 1,
        nextRetry: Date.now() - 1000 // Past due
      });

      await manager.processRetryQueue();

      expect(manager.adapter.updateSessionState).toHaveBeenCalledWith('session1', { current_phase: 'PLAN' });
      expect(manager.adapter.getSessionState).toHaveBeenCalledWith('session2');
      expect(manager.retryQueue.size).toBe(0); // Should be cleared after success

      vi.useRealTimers();
    });

    it('should handle retry failures with exponential backoff', async () => {
      const manager = graphStateManager as any;
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Mock adapter to fail
      manager.adapter.updateSessionState = vi.fn().mockRejectedValue(new Error('Retry failed'));

      // Add item to retry queue
      manager.retryQueue.set('fail-session_update', {
        operation: 'update',
        data: { updates: { current_phase: 'PLAN' } },
        attempts: 1,
        nextRetry: Date.now() - 1000
      });

      await manager.processRetryQueue();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Retry failed for fail-session_update'),
        expect.any(Error)
      );

      // Should still be in queue with incremented attempts
      expect(manager.retryQueue.has('fail-session_update')).toBe(true);
      expect(manager.retryQueue.get('fail-session_update').attempts).toBe(2);

      consoleWarnSpy.mockRestore();
    });
  });
});