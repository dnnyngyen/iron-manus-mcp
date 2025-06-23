// Enhanced session state management - replicates Manus's event stream and performance tracking
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { SessionState, Phase, Role } from './types.js';

const STATE_FILE = './manus_fsm_state.json';

class StateManager {
  private sessions: Map<string, SessionState> = new Map();

  constructor() {
    this.loadState();
  }

  getSessionState(sessionId: string): SessionState {
    if (!this.sessions.has(sessionId)) {
      // Initialize new session with enhanced tracking
      const newSession: SessionState = {
        current_phase: 'INIT',
        initial_objective: '',
        detected_role: 'researcher', // Default role
        payload: {
          current_task_index: 0, // Moved to payload where execution state belongs
          current_todos: []
        },
        reasoning_effectiveness: 0.8, // Initial effectiveness score
        last_activity: Date.now()
      };
      this.sessions.set(sessionId, newSession);
      this.saveState();
    }
    
    const session = this.sessions.get(sessionId)!;
    session.last_activity = Date.now();
    return session;
  }

  updateSessionState(sessionId: string, updates: Partial<SessionState>): void {
    const session = this.getSessionState(sessionId);
    Object.assign(session, updates, { last_activity: Date.now() });
    this.sessions.set(sessionId, session);
    this.saveState();
  }

  private loadState(): void {
    if (existsSync(STATE_FILE)) {
      try {
        const data = readFileSync(STATE_FILE, 'utf-8');
        const parsed = JSON.parse(data);
        this.sessions = new Map(Object.entries(parsed));
      } catch (error) {
        console.warn('Failed to load state file, starting fresh');
        this.sessions = new Map();
      }
    }
  }

  private saveState(): void {
    try {
      const data = Object.fromEntries(this.sessions);
      writeFileSync(STATE_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  }

  // Performance analytics (replicates Manus's cognitive tracking)
  getSessionPerformanceMetrics(sessionId: string): Record<string, any> {
    const session = this.getSessionState(sessionId);
    const phaseTransitions = session.payload.phase_transition_count || 0;
    const effectiveness = session.reasoning_effectiveness;
    
    return {
      session_id: sessionId,
      detected_role: session.detected_role,
      current_phase: session.current_phase,
      phase_transitions: phaseTransitions,
      reasoning_effectiveness: effectiveness,
      performance_grade: this.calculatePerformanceGrade(effectiveness),
      cognitive_enhancement_active: effectiveness > 0.7,
      task_complexity_handled: (session.payload.current_task_index || 0) > 3 ? 'complex' : 'simple',
      session_duration_minutes: Math.round((Date.now() - (session.last_activity || Date.now())) / (1000 * 60))
    };
  }

  private calculatePerformanceGrade(effectiveness: number): string {
    if (effectiveness >= 0.9) return 'EXCELLENT';
    if (effectiveness >= 0.8) return 'GOOD';
    if (effectiveness >= 0.7) return 'SATISFACTORY';
    if (effectiveness >= 0.6) return 'NEEDS_IMPROVEMENT';
    return 'REQUIRES_ATTENTION';
  }

  // Enhanced cleanup with performance archiving
  cleanup(): void {
    const cutoff = Date.now() - (24 * 60 * 60 * 1000);
    const archivedSessions: any[] = [];
    
    for (const [sessionId, session] of this.sessions) {
      if (session.last_activity < cutoff) {
        // Archive performance data before deletion
        archivedSessions.push({
          session_id: sessionId,
          performance_metrics: this.getSessionPerformanceMetrics(sessionId),
          archived_at: Date.now()
        });
        this.sessions.delete(sessionId);
      }
    }
    
    // Save archived performance data for analysis
    if (archivedSessions.length > 0) {
      this.saveArchivedMetrics(archivedSessions);
    }
    
    this.saveState();
  }

  private saveArchivedMetrics(archivedSessions: any[]): void {
    try {
      const archiveFile = './manus_performance_archive.json';
      let existingArchive: any[] = [];
      
      if (existsSync(archiveFile)) {
        const data = readFileSync(archiveFile, 'utf-8');
        existingArchive = JSON.parse(data);
      }
      
      existingArchive.push(...archivedSessions);
      writeFileSync(archiveFile, JSON.stringify(existingArchive, null, 2));
    } catch (error) {
      console.error('Failed to archive performance metrics:', error);
    }
  }
}

export const stateManager = new StateManager();

// Periodic cleanup (runs every hour)
setInterval(() => {
  stateManager.cleanup();
}, 60 * 60 * 1000);