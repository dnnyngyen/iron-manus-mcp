// LEGACY session state management - FILE OPERATIONS DISABLED
// This is legacy code kept for reference only. All file operations have been disabled.
// State is now managed by GraphStateAdapter in graph-state-adapter.ts
// import { readFileSync, writeFileSync, existsSync } from 'fs'; // DISABLED
import {
  SessionState,
  Phase,
  Role,
  ComponentCognitiveDuality,
  UnifiedConstraint,
  EncapsulationPattern,
  CognitiveContext,
  ComponentCognitiveMetrics,
} from './types.js';

// const STATE_FILE = './iron_manus_state.json'; // DISABLED - No longer used

class StateManager {
  private sessions: Map<string, SessionState> = new Map();
  private componentCognitiveDuality: Map<string, ComponentCognitiveDuality> = new Map();
  private unifiedConstraints: Map<string, UnifiedConstraint[]> = new Map();

  constructor() {
    this.loadState();
    this.loadComponentCognitiveState();
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
          current_todos: [],
        },
        reasoning_effectiveness: 0.8, // Initial effectiveness score
        last_activity: Date.now(),
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
    // LEGACY CODE - File operations disabled to prevent JSON file creation
    // State is now managed by GraphStateAdapter in graph-state-adapter.ts
    console.warn('Legacy state manager - file operations disabled. Use GraphStateAdapter instead.');
    this.sessions = new Map();
  }

  private saveState(): void {
    // LEGACY CODE - File operations disabled to prevent JSON file creation
    // State is now managed by GraphStateAdapter in graph-state-adapter.ts
    // No-op to prevent ./iron_manus_state.json creation
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

  // ============================================================================
  // COMPONENT-COGNITIVE DUALITY STATE MANAGEMENT
  // V0 encapsulation patterns integration with existing session management
  // ============================================================================

  // Initialize component-cognitive duality for a session
  initializeComponentCognitiveDuality(
    sessionId: string,
    dualityConfig: Partial<ComponentCognitiveDuality>
  ): void {
    const session = this.getSessionState(sessionId);

    const defaultDuality: ComponentCognitiveDuality = {
      component_task_mapping: {
        component_id: `session_${sessionId}_component`,
        task_objective: session.initial_objective,
        constraint_hierarchy: [],
        generation_pattern: 'atomic',
        cognitive_enhancement: session.reasoning_effectiveness,
      },
      project_phase_mapping: {
        project_scope: session.initial_objective,
        phase_sequence: ['QUERY', 'ENHANCE', 'KNOWLEDGE', 'PLAN', 'EXECUTE', 'VERIFY', 'DONE'],
        constraint_propagation: [],
        integration_patterns: ['sequential_orchestration'],
        orchestration_mode: 'sequential',
      },
      ecosystem_session_mapping: {
        ecosystem_context: { session_id: sessionId },
        session_state: session,
        global_constraints: [],
        encapsulation_patterns: [],
        cognitive_context: {
          reasoning_mode: 'hybrid_duality',
          framework_selection: ['iron_manus_fsm'],
          constraint_resolution: 'adaptive',
          performance_metrics: this.initializeComponentCognitiveMetrics(),
          duality_effectiveness: 0.8,
        },
      },
    };

    // Merge with provided configuration
    const duality = { ...defaultDuality, ...dualityConfig };
    this.componentCognitiveDuality.set(sessionId, duality);
    this.saveComponentCognitiveState();
  }

  // Get component-cognitive duality state for session
  getComponentCognitiveDuality(sessionId: string): ComponentCognitiveDuality | null {
    return this.componentCognitiveDuality.get(sessionId) || null;
  }

  // Update component-cognitive duality state
  updateComponentCognitiveDuality(
    sessionId: string,
    updates: Partial<ComponentCognitiveDuality>
  ): void {
    const existing = this.getComponentCognitiveDuality(sessionId);
    if (existing) {
      const updated = { ...existing, ...updates };
      this.componentCognitiveDuality.set(sessionId, updated);
      this.saveComponentCognitiveState();
    }
  }

  // Add unified constraint to session
  addUnifiedConstraint(sessionId: string, constraint: UnifiedConstraint): void {
    const constraints = this.unifiedConstraints.get(sessionId) || [];
    constraints.push(constraint);
    this.unifiedConstraints.set(sessionId, constraints);

    // Update duality state with new constraint
    const duality = this.getComponentCognitiveDuality(sessionId);
    if (duality) {
      // Add constraint to appropriate hierarchy level
      switch (constraint.scope) {
        case 'component':
          duality.component_task_mapping.constraint_hierarchy.push(constraint);
          break;
        case 'project':
          duality.project_phase_mapping.constraint_propagation.push(constraint);
          break;
        case 'ecosystem':
          duality.ecosystem_session_mapping.global_constraints.push(constraint);
          break;
      }
      this.updateComponentCognitiveDuality(sessionId, duality);
    }
  }

  // Get unified constraints for session
  getUnifiedConstraints(sessionId: string): UnifiedConstraint[] {
    return this.unifiedConstraints.get(sessionId) || [];
  }

  // Add encapsulation pattern to session
  addEncapsulationPattern(sessionId: string, pattern: EncapsulationPattern): void {
    const duality = this.getComponentCognitiveDuality(sessionId);
    if (duality) {
      duality.ecosystem_session_mapping.encapsulation_patterns.push(pattern);
      this.updateComponentCognitiveDuality(sessionId, duality);
    }
  }

  // Update cognitive context for session
  updateCognitiveContext(sessionId: string, contextUpdates: Partial<CognitiveContext>): void {
    const duality = this.getComponentCognitiveDuality(sessionId);
    if (duality) {
      duality.ecosystem_session_mapping.cognitive_context = {
        ...duality.ecosystem_session_mapping.cognitive_context,
        ...contextUpdates,
      };
      this.updateComponentCognitiveDuality(sessionId, duality);
    }
  }

  // Initialize component-cognitive metrics
  private initializeComponentCognitiveMetrics(): ComponentCognitiveMetrics {
    return {
      component_generation: {
        generation_speed: 0,
        constraint_satisfaction: 0,
        accessibility_score: 0,
        reusability_index: 0,
      },
      cognitive_orchestration: {
        reasoning_effectiveness: 0.8,
        phase_transition_efficiency: 0,
        task_completion_rate: 0,
        fractal_orchestration_depth: 1,
      },
      duality_synergy: {
        integration_coherence: 0.8,
        constraint_unification: 0,
        cross_domain_efficiency: 0,
        architectural_elegance: 0.8,
      },
    };
  }

  // Get comprehensive performance metrics including component-cognitive duality
  getEnhancedSessionMetrics(sessionId: string): Record<string, any> {
    const baseMetrics = this.getSessionPerformanceMetrics(sessionId);
    const duality = this.getComponentCognitiveDuality(sessionId);
    const constraints = this.getUnifiedConstraints(sessionId);

    if (!duality) {
      return baseMetrics;
    }

    return {
      ...baseMetrics,
      component_cognitive_duality: {
        duality_active: true,
        reasoning_mode: duality.ecosystem_session_mapping.cognitive_context.reasoning_mode,
        constraint_count: constraints.length,
        encapsulation_patterns: duality.ecosystem_session_mapping.encapsulation_patterns.length,
        orchestration_mode: duality.project_phase_mapping.orchestration_mode,
        duality_effectiveness:
          duality.ecosystem_session_mapping.cognitive_context.duality_effectiveness,
        performance_metrics:
          duality.ecosystem_session_mapping.cognitive_context.performance_metrics,
        framework_selection:
          duality.ecosystem_session_mapping.cognitive_context.framework_selection,
      },
    };
  }

  // Load component-cognitive state from persistence
  private loadComponentCognitiveState(): void {
    // LEGACY CODE - File operations disabled to prevent JSON file creation
    // State is now managed by GraphStateAdapter in graph-state-adapter.ts
    console.warn('Legacy component-cognitive state manager - file operations disabled. Use GraphStateAdapter instead.');
    this.componentCognitiveDuality = new Map();
    this.unifiedConstraints = new Map();
  }

  // Save component-cognitive state to persistence
  private saveComponentCognitiveState(): void {
    // LEGACY CODE - File operations disabled to prevent JSON file creation
    // State is now managed by GraphStateAdapter in graph-state-adapter.ts
    // No-op to prevent ./iron_manus_component_cognitive_duality.json and ./iron_manus_unified_constraints.json creation
  }

  // Enhanced cleanup with performance archiving (including component-cognitive duality)
  cleanup(): void {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    const archivedSessions: any[] = [];

    for (const [sessionId, session] of this.sessions) {
      if (session.last_activity < cutoff) {
        // Archive enhanced performance data including component-cognitive duality
        archivedSessions.push({
          session_id: sessionId,
          performance_metrics: this.getEnhancedSessionMetrics(sessionId),
          archived_at: Date.now(),
        });

        // Clean up component-cognitive duality data
        this.componentCognitiveDuality.delete(sessionId);
        this.unifiedConstraints.delete(sessionId);
        this.sessions.delete(sessionId);
      }
    }

    // Save archived performance data for analysis
    if (archivedSessions.length > 0) {
      this.saveArchivedMetrics(archivedSessions);
    }

    this.saveState();
    this.saveComponentCognitiveState();
  }

  private saveArchivedMetrics(archivedSessions: any[]): void {
    // LEGACY CODE - File operations disabled to prevent JSON file creation
    // Performance metrics are now tracked by GraphStateAdapter in graph-state-adapter.ts
    // No-op to prevent ./iron_manus_performance_archive.json creation
    console.warn(`Legacy performance archiving disabled - ${archivedSessions.length} sessions would have been archived. Use GraphStateAdapter instead.`);
  }
}

export const stateManager = new StateManager();

// Periodic cleanup (runs every hour)
setInterval(
  () => {
    stateManager.cleanup();
  },
  60 * 60 * 1000
);
