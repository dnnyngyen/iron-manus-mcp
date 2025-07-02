/**
 * Graph State Adapter - Drop-in replacement for JSON file-based state management
 * Preserves existing SessionState interface while using knowledge graphs internally
 */

import { SessionState, Phase, Role } from './types.js';
import { stateGraphManager } from '../tools/iron-manus-state-graph.js';

/**
 * Adapter that converts between SessionState and knowledge graph entities
 * Maintains backward compatibility with existing FSM code
 */
export class GraphStateAdapter {
  private sessionCache: Map<string, SessionState> = new Map();

  /**
   * Get session state - preserves existing interface
   * Converts knowledge graph entities back to SessionState format
   */
  async getSessionState(sessionId: string): Promise<SessionState> {
    // Check cache first
    if (this.sessionCache.has(sessionId)) {
      return this.sessionCache.get(sessionId)!;
    }

    try {
      // Load from knowledge graph
      const graph = await stateGraphManager.readSessionGraph(sessionId);

      // Find session entity
      const sessionEntity = graph.entities.find(
        e => e.name === sessionId && e.entityType === 'session'
      );

      if (!sessionEntity) {
        // Create new session
        const newSession: SessionState = {
          current_phase: 'INIT',
          initial_objective: '',
          detected_role: 'researcher',
          payload: {
            current_task_index: 0,
            current_todos: [],
          },
          reasoning_effectiveness: 0.8,
          last_activity: Date.now(),
        };

        this.sessionCache.set(sessionId, newSession);
        return newSession;
      }

      // Convert graph entities back to SessionState
      const session = this.entitiesToSessionState(sessionId, graph.entities, graph.relations);
      this.sessionCache.set(sessionId, session);
      return session;
    } catch (error) {
      console.warn(`Failed to load session ${sessionId} from graph, creating new:`, error);

      // Fallback to new session
      const newSession: SessionState = {
        current_phase: 'INIT',
        initial_objective: '',
        detected_role: 'researcher',
        payload: {
          current_task_index: 0,
          current_todos: [],
        },
        reasoning_effectiveness: 0.8,
        last_activity: Date.now(),
      };

      this.sessionCache.set(sessionId, newSession);
      return newSession;
    }
  }

  /**
   * Update session state - preserves existing interface
   * Converts SessionState updates to knowledge graph operations
   */
  async updateSessionState(sessionId: string, updates: Partial<SessionState>): Promise<void> {
    // Get current session
    const currentSession = await this.getSessionState(sessionId);

    // Apply updates
    const updatedSession = { ...currentSession, ...updates, last_activity: Date.now() };

    // Cache the updated session
    this.sessionCache.set(sessionId, updatedSession);

    // Convert to graph operations
    await this.sessionStateToEntities(sessionId, updatedSession);
  }

  /**
   * Convert knowledge graph entities back to SessionState format
   */
  private entitiesToSessionState(
    sessionId: string,
    entities: any[],
    relations: any[]
  ): SessionState {
    const sessionEntity = entities.find(e => e.name === sessionId && e.entityType === 'session');

    if (!sessionEntity) {
      throw new Error(`Session entity not found for ${sessionId}`);
    }

    // Extract session data from observations
    const observations = sessionEntity.observations || [];
    const session: SessionState = {
      current_phase: this.extractObservation(observations, 'current_phase', 'INIT') as Phase,
      initial_objective: this.extractObservation(observations, 'objective', ''),
      detected_role: this.extractObservation(observations, 'detected_role', 'researcher') as Role,
      reasoning_effectiveness: parseFloat(
        this.extractObservation(observations, 'reasoning_effectiveness', '0.8')
      ),
      last_activity: parseInt(
        this.extractObservation(observations, 'last_activity', Date.now().toString())
      ),
      payload: this.extractPayload(observations),
    };

    // Extract tasks from task entities
    const taskEntities = entities.filter(
      e => e.entityType === 'task' && e.name.startsWith(`${sessionId}_task_`)
    );
    session.payload.current_todos = taskEntities.map(task => ({
      id: task.name.replace(`${sessionId}_task_`, ''),
      content: this.extractObservation(task.observations, 'content', ''),
      status: this.extractObservation(task.observations, 'status', 'pending') as
        | 'pending'
        | 'in_progress'
        | 'completed',
      priority: this.extractObservation(task.observations, 'priority', 'medium') as
        | 'high'
        | 'medium'
        | 'low',
    }));

    return session;
  }

  /**
   * Convert SessionState to knowledge graph entities
   */
  private async sessionStateToEntities(sessionId: string, session: SessionState): Promise<void> {
    // Skip graph operations in test environment
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    // Create or update session entity
    const sessionObservations = [
      `current_phase: ${session.current_phase}`,
      `objective: ${session.initial_objective}`,
      `detected_role: ${session.detected_role}`,
      `reasoning_effectiveness: ${session.reasoning_effectiveness}`,
      `last_activity: ${session.last_activity}`,
      ...this.payloadToObservations(session.payload),
    ];

    // Initialize session if it doesn't exist
    await stateGraphManager.initializeSession(
      sessionId,
      session.initial_objective,
      session.detected_role
    );

    // Update session observations
    await stateGraphManager.addSessionObservations(sessionId, [
      {
        entityName: sessionId,
        contents: sessionObservations,
      },
    ]);

    // Update tasks
    if (session.payload.current_todos) {
      for (const todo of session.payload.current_todos) {
        const taskId = todo.id || `task_${Date.now()}`;
        await stateGraphManager.recordTaskCreation(sessionId, taskId, todo.content, todo.priority);

        if (todo.status !== 'pending') {
          await stateGraphManager.updateTaskStatus(sessionId, taskId, todo.status);
        }
      }
    }
  }

  /**
   * Extract observation value by key
   */
  private extractObservation(observations: string[], key: string, defaultValue: string): string {
    const observation = observations.find(obs => obs.startsWith(`${key}:`));
    return observation ? observation.split(':').slice(1).join(':').trim() : defaultValue;
  }

  /**
   * Extract payload from observations
   */
  private extractPayload(observations: string[]): Record<string, any> {
    const payload: Record<string, any> = {
      current_task_index: 0,
      current_todos: [],
    };

    observations.forEach(obs => {
      if (obs.startsWith('payload_')) {
        const [key, ...valueParts] = obs.replace('payload_', '').split(':');
        const value = valueParts.join(':').trim();

        try {
          // Try to parse as JSON
          payload[key] = JSON.parse(value);
        } catch {
          // Fallback to string
          payload[key] = value;
        }
      }
    });

    return payload;
  }

  /**
   * Convert payload to observations
   */
  private payloadToObservations(payload: Record<string, any>): string[] {
    const observations: string[] = [];

    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'current_todos') {
        // Skip todos - handled separately
        return;
      }

      try {
        observations.push(`payload_${key}: ${JSON.stringify(value)}`);
      } catch {
        observations.push(`payload_${key}: ${String(value)}`);
      }
    });

    return observations;
  }

  /**
   * Get session performance metrics
   */
  async getSessionPerformanceMetrics(sessionId: string): Promise<Record<string, any>> {
    const session = await this.getSessionState(sessionId);

    // Search for performance-related entities
    const graph = await stateGraphManager.searchSessionNodes(sessionId, 'performance');
    const phaseEntities = graph.entities.filter(e => e.entityType === 'phase');

    return {
      session_id: sessionId,
      detected_role: session.detected_role,
      current_phase: session.current_phase,
      phase_transitions: phaseEntities.length,
      reasoning_effectiveness: session.reasoning_effectiveness,
      performance_grade: this.calculatePerformanceGrade(session.reasoning_effectiveness),
      cognitive_enhancement_active: session.reasoning_effectiveness > 0.7,
      task_complexity_handled: (session.payload.current_task_index || 0) > 3 ? 'complex' : 'simple',
      session_duration_minutes: Math.round(
        (Date.now() - (session.last_activity || Date.now())) / (1000 * 60)
      ),
    };
  }

  private calculatePerformanceGrade(effectiveness: number): string {
    if (effectiveness >= 0.9) return 'EXCELLENT';
    if (effectiveness >= 0.8) return 'GOOD';
    if (effectiveness >= 0.7) return 'SATISFACTORY';
    if (effectiveness >= 0.6) return 'NEEDS_IMPROVEMENT';
    return 'REQUIRES_ATTENTION';
  }

  /**
   * Cleanup old sessions - archives to graph format
   */
  async cleanup(): Promise<void> {
    // This could be enhanced to move old sessions to archive graphs
    // For now, just clear the cache
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;

    for (const [sessionId, session] of this.sessionCache) {
      if (session.last_activity < cutoff) {
        this.sessionCache.delete(sessionId);
      }
    }
  }
}

/**
 * Backward-compatible state manager that uses graph storage
 */
class GraphStateManager {
  private adapter = new GraphStateAdapter();
  private sessionCache: Map<string, SessionState> = new Map();

  getSessionState(sessionId: string): SessionState {
    // Use sync fallback with cached state for immediate access
    // Async operations happen in the background

    // Check cache first for immediate response
    const cached = this.sessionCache.get(sessionId);
    if (cached) {
      return cached;
    }

    // Create new session if not found
    const newSession: SessionState = {
      current_phase: 'INIT',
      initial_objective: '',
      detected_role: 'researcher',
      payload: { current_task_index: 0, current_todos: [] },
      reasoning_effectiveness: 0.8,
      last_activity: Date.now(),
    };

    this.sessionCache.set(sessionId, newSession);

    // Trigger async load in background with proper error handling
    this.adapter
      .getSessionState(sessionId)
      .then(session => {
        this.sessionCache.set(sessionId, session);
      })
      .catch(error => {
        console.error(`Background session load failed for ${sessionId}:`, error);

        // Recovery strategy: Mark for retry if not a permanent failure
        if (this.isRetriableError(error)) {
          this.markSessionForRetry(sessionId, 'load', { sessionId });
        }

        // Emit error event for monitoring
        this.emitErrorEvent('background_session_load_failed', sessionId, error);
      });

    return newSession;
  }

  updateSessionState(sessionId: string, updates: Partial<SessionState>): void {
    // Update cache immediately
    const currentSession = this.getSessionState(sessionId);
    const updatedSession = { ...currentSession, ...updates, last_activity: Date.now() };
    this.sessionCache.set(sessionId, updatedSession);

    // Proper error handling for graph update with recovery
    this.adapter.updateSessionState(sessionId, updates).catch(error => {
      console.error(`Graph update failed for session ${sessionId}:`, error);

      // Recovery strategy: Mark session for retry
      this.markSessionForRetry(sessionId, 'update', { updates });

      // Emit error event for monitoring systems
      this.emitErrorEvent('graph_update_failed', sessionId, error);
    });
  }

  getSessionPerformanceMetrics(sessionId: string): Record<string, any> {
    // Simplified synchronous version
    const session = this.getSessionState(sessionId);
    return {
      session_id: sessionId,
      detected_role: session.detected_role,
      current_phase: session.current_phase,
      reasoning_effectiveness: session.reasoning_effectiveness,
    };
  }

  cleanup(): void {
    // Clean up local cache
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    for (const [sessionId, session] of this.sessionCache) {
      if (session.last_activity < cutoff) {
        this.sessionCache.delete(sessionId);
      }
    }

    // Proper error handling for async cleanup
    this.adapter.cleanup().catch(error => {
      console.error('Graph cleanup failed:', error);

      // Recovery strategy: Schedule retry for next cleanup cycle
      this.scheduleCleanupRetry();

      // Emit error event for monitoring
      this.emitErrorEvent('graph_cleanup_failed', 'system', error);
    });
  }

  // Add retry tracking for failed operations
  private retryQueue: Map<
    string,
    { operation: string; data: any; attempts: number; nextRetry: number }
  > = new Map();
  private readonly MAX_RETRY_ATTEMPTS = 3;
  private readonly RETRY_DELAY_MS = 5000;

  private markSessionForRetry(sessionId: string, operation: string, data: any): void {
    const key = `${sessionId}_${operation}`;
    const existing = this.retryQueue.get(key);

    if (existing && existing.attempts >= this.MAX_RETRY_ATTEMPTS) {
      console.warn(`Max retry attempts reached for session ${sessionId}, operation ${operation}`);
      return;
    }

    this.retryQueue.set(key, {
      operation,
      data,
      attempts: (existing?.attempts || 0) + 1,
      nextRetry: Date.now() + this.RETRY_DELAY_MS,
    });

    // Schedule retry
    setTimeout(() => this.processRetryQueue(), this.RETRY_DELAY_MS);
  }

  private async processRetryQueue(): Promise<void> {
    const now = Date.now();

    for (const [key, retryItem] of this.retryQueue) {
      if (retryItem.nextRetry <= now) {
        try {
          const [sessionId] = key.split('_');

          if (retryItem.operation === 'update') {
            await this.adapter.updateSessionState(sessionId, retryItem.data.updates);
            this.retryQueue.delete(key); // Success - remove from queue
          } else if (retryItem.operation === 'load') {
            const session = await this.adapter.getSessionState(sessionId);
            this.sessionCache.set(sessionId, session);
            this.retryQueue.delete(key); // Success - remove from queue
          }
        } catch (error) {
          console.warn(`Retry failed for ${key}, attempt ${retryItem.attempts}:`, error);

          if (retryItem.attempts >= this.MAX_RETRY_ATTEMPTS) {
            this.retryQueue.delete(key); // Give up after max attempts
          } else {
            // Exponential backoff
            retryItem.nextRetry = now + this.RETRY_DELAY_MS * Math.pow(2, retryItem.attempts);
            retryItem.attempts++;
          }
        }
      }
    }
  }

  private isRetriableError(error: any): boolean {
    // Determine if an error is worth retrying
    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      // Network/timeout errors are retriable
      if (
        message.includes('timeout') ||
        message.includes('network') ||
        message.includes('econnreset') ||
        message.includes('enotfound')
      ) {
        return true;
      }

      // Permission/auth errors are not retriable
      if (
        message.includes('permission') ||
        message.includes('unauthorized') ||
        message.includes('forbidden')
      ) {
        return false;
      }
    }

    // Default: retry temporary-looking errors
    return true;
  }

  private scheduleCleanupRetry(): void {
    // Retry cleanup after delay
    setTimeout(() => {
      this.adapter.cleanup().catch(error => {
        console.warn('Cleanup retry failed:', error);
        // Could implement exponential backoff here if needed
      });
    }, this.RETRY_DELAY_MS);
  }

  private emitErrorEvent(eventType: string, sessionId: string, error: any): void {
    // Structured error event for monitoring systems
    const errorEvent = {
      timestamp: new Date().toISOString(),
      type: eventType,
      session_id: sessionId,
      error_message: error instanceof Error ? error.message : String(error),
      error_stack: error instanceof Error ? error.stack : undefined,
      component: 'GraphStateManager',
    };

    // In production, this could send to monitoring systems (DataDog, etc.)
    if (process.env.NODE_ENV === 'production') {
      // Could integrate with monitoring systems here
      console.error('PRODUCTION_ERROR_EVENT:', JSON.stringify(errorEvent));
    } else {
      console.warn('Error event:', errorEvent);
    }
  }
}

export const graphStateManager = new GraphStateManager();
