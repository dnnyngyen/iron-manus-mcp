#!/usr/bin/env node

/**
 * Iron Manus State Graph - Project-scoped FSM state management
 * Forked from MCP Memory Server with Iron Manus FSM terminology
 *
 * Core concepts adapted for Iron Manus:
 * - Sessions: FSM execution sessions with isolated state graphs
 * - Phases: FSM phases (INIT, QUERY, ENHANCE, KNOWLEDGE, PLAN, EXECUTE, VERIFY, DONE)
 * - Tasks: Todo items with meta-prompt relationships
 * - Transitions: Phase-to-phase state changes with performance tracking
 * - Observations: Discrete facts about sessions, phases, tasks, and performance
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BaseTool, type ToolDefinition, type ToolResult } from './base-tool.js';

/**
 * Arguments interface for Iron Manus State Graph operations
 * Defines all possible parameters for FSM state management actions
 * 
 * @interface IronManusStateGraphArgs
 * @description Type-safe argument structure for state graph operations
 */
interface IronManusStateGraphArgs {
  /** Action to perform on the session state graph */
  action: 'create_entities' | 'create_transitions' | 'add_observations' | 'delete_entities' | 
          'delete_observations' | 'delete_transitions' | 'read_graph' | 'search_nodes' | 
          'open_nodes' | 'initialize_session' | 'record_phase_transition' | 
          'record_task_creation' | 'update_task_status';
  /** Session ID for project-scoped state isolation */
  session_id: string;
  /** Entities to create (for create_entities action) */
  entities?: SessionEntity[];
  /** State transitions to create (for create_transitions action) */
  transitions?: StateTransition[];
  /** Observations to add (for add_observations action) */
  observations?: { entityName: string; contents: string[] }[];
  /** Search query (for search_nodes action) */
  query?: string;
  /** Entity names to retrieve (for open_nodes action) */
  names?: string[];
  /** Session objective (for initialize_session action) */
  objective?: string;
  /** Detected role (for initialize_session action) */
  role?: string;
  /** Source phase (for record_phase_transition action) */
  from_phase?: string;
  /** Target phase (for record_phase_transition action) */
  to_phase?: string;
  /** Task identifier (for task operations) */
  task_id?: string;
  /** Task content (for record_task_creation action) */
  content?: string;
  /** Task priority (for record_task_creation action) */
  priority?: string;
  /** Task status (for update_task_status action) */
  status?: string;
}

/**
 * Iron Manus FSM-specific entities
 * Represents discrete state entities within the FSM execution graph
 */

/**
 * SessionEntity - Core entity in Iron Manus FSM state management
 * Represents tracked entities across FSM execution sessions
 * 
 * @interface SessionEntity
 * @description Core data structure for FSM state entities with observations
 */
interface SessionEntity {
  /** Unique identifier for the entity (typically session_id, phase_id, task_id) */
  name: string;
  /** Type classification for FSM entity categorization and filtering */
  entityType: 'session' | 'phase' | 'task' | 'role' | 'api' | 'performance';
  /** Array of discrete facts and observations about the entity state */
  observations: string[];
}

/**
 * StateTransition - Represents relationships between FSM entities
 * Defines directional relationships for state graph construction
 * 
 * @interface StateTransition
 * @description Encodes FSM state transitions and entity relationships
 */
interface StateTransition {
  /** Source entity name in the state transition */
  from: string;
  /** Target entity name in the state transition */
  to: string;
  /** Type of relationship defining the semantic connection between entities */
  relationType: 'transitions_to' | 'spawns' | 'depends_on' | 'uses' | 'tracks' | 'contains';
}

/**
 * StateGraph - Complete FSM state representation
 * Encapsulates all entities and their relationships for a session
 * 
 * @interface StateGraph
 * @description Primary data structure for FSM state management and persistence
 */
interface StateGraph {
  /** Array of all session entities (sessions, phases, tasks, roles, APIs, performance) */
  entities: SessionEntity[];
  /** Array of all state transitions and entity relationships */
  relations: StateTransition[];
}

/**
 * Iron Manus State Graph Manager
 * 
 * Comprehensive FSM state management with project-scoped knowledge graphs.
 * Handles persistent state storage, entity relationships, and FSM transitions
 * across Iron Manus execution sessions.
 * 
 * Key Features:
 * - Session-isolated state graphs with file-based persistence
 * - FSM phase tracking and transition recording
 * - Task lifecycle management with observations
 * - Role-based entity categorization
 * - API usage tracking and performance monitoring
 * - Test environment compatibility with in-memory operation
 * 
 * @class IronManusStateGraphManager
 * @description Core state management engine for Iron Manus MCP FSM orchestration
 */
class IronManusStateGraphManager {
  /**
   * Get file system path for session state graph
   * 
   * @private
   * @param sessionId - Unique session identifier
   * @returns Absolute path to session graph JSON file
   * @description Constructs standardized file path for session state persistence
   */
  private getSessionGraphPath(sessionId: string): string {
    const sessionDir = `./iron-manus-sessions/${sessionId}`;
    return path.join(sessionDir, 'fsm-state-graph.json');
  }

  /**
   * Ensure session directory exists for state persistence
   * 
   * @private
   * @param sessionId - Unique session identifier
   * @returns Promise resolving when directory is ready
   * @description Creates session directory structure, skips in test environment
   */
  private async ensureSessionDirectory(sessionId: string): Promise<void> {
    // Skip directory creation in test environment
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    const sessionDir = `./iron-manus-sessions/${sessionId}`;
    try {
      await fs.mkdir(sessionDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, which is fine
    }
  }

  /**
   * Load session state graph from persistent storage
   * 
   * @private
   * @param sessionId - Unique session identifier
   * @returns Promise resolving to complete state graph
   * @throws Error if file read fails (except ENOENT)
   * @description Reads and parses JSONL-formatted state graph from disk
   */
  private async loadSessionGraph(sessionId: string): Promise<StateGraph> {
    // Return empty graph in test environment
    if (process.env.NODE_ENV === 'test') {
      return { entities: [], relations: [] };
    }

    const graphPath = this.getSessionGraphPath(sessionId);
    try {
      const data = await fs.readFile(graphPath, 'utf-8');
      const lines = data.split('\n').filter(line => line.trim() !== '');
      return lines.reduce(
        (graph: StateGraph, line) => {
          const item = JSON.parse(line);
          if (item.type === 'entity') graph.entities.push(item as SessionEntity);
          if (item.type === 'relation') graph.relations.push(item as StateTransition);
          return graph;
        },
        { entities: [], relations: [] }
      );
    } catch (error) {
      if (error instanceof Error && 'code' in error && (error as any).code === 'ENOENT') {
        return { entities: [], relations: [] };
      }
      throw error;
    }
  }

  /**
   * Save session state graph to persistent storage
   * 
   * @private
   * @param sessionId - Unique session identifier
   * @param graph - Complete state graph to persist
   * @returns Promise resolving when save is complete
   * @description Writes state graph as JSONL format to session directory
   */
  private async saveSessionGraph(sessionId: string, graph: StateGraph): Promise<void> {
    // Skip file operations in test environment
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    await this.ensureSessionDirectory(sessionId);
    const graphPath = this.getSessionGraphPath(sessionId);
    const lines = [
      ...graph.entities.map(e => JSON.stringify({ type: 'entity', ...e })),
      ...graph.relations.map(r => JSON.stringify({ type: 'relation', ...r })),
    ];
    await fs.writeFile(graphPath, lines.join('\n'));
  }

  /**
   * Create new entities in session state graph
   * 
   * @param sessionId - Unique session identifier
   * @param entities - Array of entities to create
   * @returns Promise resolving to array of successfully created entities
   * @description Adds new entities to graph, filtering out duplicates by name
   */
  async createSessionEntities(
    sessionId: string,
    entities: SessionEntity[]
  ): Promise<SessionEntity[]> {
    const graph = await this.loadSessionGraph(sessionId);
    const newEntities = entities.filter(
      e => !graph.entities.some(existingEntity => existingEntity.name === e.name)
    );
    graph.entities.push(...newEntities);
    await this.saveSessionGraph(sessionId, graph);
    return newEntities;
  }

  /**
   * Create new state transitions in session graph
   * 
   * @param sessionId - Unique session identifier
   * @param relations - Array of state transitions to create
   * @returns Promise resolving to array of successfully created transitions
   * @description Adds new relationships to graph, filtering out exact duplicates
   */
  async createStateTransitions(
    sessionId: string,
    relations: StateTransition[]
  ): Promise<StateTransition[]> {
    const graph = await this.loadSessionGraph(sessionId);
    const newRelations = relations.filter(
      r =>
        !graph.relations.some(
          existingRelation =>
            existingRelation.from === r.from &&
            existingRelation.to === r.to &&
            existingRelation.relationType === r.relationType
        )
    );
    graph.relations.push(...newRelations);
    await this.saveSessionGraph(sessionId, graph);
    return newRelations;
  }

  /**
   * Add observations to existing session entities
   * 
   * @param sessionId - Unique session identifier
   * @param observations - Array of observations to add to entities
   * @returns Promise resolving to summary of added observations per entity
   * @throws Error if target entity not found
   * @description Appends new observations to entities, filtering duplicates
   */
  async addSessionObservations(
    sessionId: string,
    observations: { entityName: string; contents: string[] }[]
  ): Promise<{ entityName: string; addedObservations: string[] }[]> {
    const graph = await this.loadSessionGraph(sessionId);
    const results = observations.map(o => {
      const entity = graph.entities.find(e => e.name === o.entityName);
      if (!entity) {
        throw new Error(`Entity with name ${o.entityName} not found in session ${sessionId}`);
      }
      const newObservations = o.contents.filter(content => !entity.observations.includes(content));
      entity.observations.push(...newObservations);
      return { entityName: o.entityName, addedObservations: newObservations };
    });
    await this.saveSessionGraph(sessionId, graph);
    return results;
  }

  /**
   * Delete entities from session state graph
   * 
   * @param sessionId - Unique session identifier
   * @param entityNames - Array of entity names to delete
   * @returns Promise resolving when deletion is complete
   * @description Removes entities and all related transitions from graph
   */
  async deleteSessionEntities(sessionId: string, entityNames: string[]): Promise<void> {
    const graph = await this.loadSessionGraph(sessionId);
    graph.entities = graph.entities.filter(e => !entityNames.includes(e.name));
    graph.relations = graph.relations.filter(
      r => !entityNames.includes(r.from) && !entityNames.includes(r.to)
    );
    await this.saveSessionGraph(sessionId, graph);
  }

  /**
   * Delete specific observations from session entities
   * 
   * @param sessionId - Unique session identifier
   * @param deletions - Array specifying entities and observations to delete
   * @returns Promise resolving when deletion is complete
   * @description Removes specific observations from entities, ignoring missing entities
   */
  async deleteSessionObservations(
    sessionId: string,
    deletions: { entityName: string; observations: string[] }[]
  ): Promise<void> {
    const graph = await this.loadSessionGraph(sessionId);
    deletions.forEach(d => {
      const entity = graph.entities.find(e => e.name === d.entityName);
      if (entity) {
        entity.observations = entity.observations.filter(o => !d.observations.includes(o));
      }
    });
    await this.saveSessionGraph(sessionId, graph);
  }

  /**
   * Delete specific state transitions from session graph
   * 
   * @param sessionId - Unique session identifier
   * @param relations - Array of state transitions to delete
   * @returns Promise resolving when deletion is complete
   * @description Removes exact matching transitions from graph
   */
  async deleteStateTransitions(sessionId: string, relations: StateTransition[]): Promise<void> {
    const graph = await this.loadSessionGraph(sessionId);
    graph.relations = graph.relations.filter(
      r =>
        !relations.some(
          delRelation =>
            r.from === delRelation.from &&
            r.to === delRelation.to &&
            r.relationType === delRelation.relationType
        )
    );
    await this.saveSessionGraph(sessionId, graph);
  }

  /**
   * Read complete session state graph
   * 
   * @param sessionId - Unique session identifier
   * @returns Promise resolving to complete state graph
   * @description Loads and returns entire session state graph
   */
  async readSessionGraph(sessionId: string): Promise<StateGraph> {
    return this.loadSessionGraph(sessionId);
  }

  /**
   * Search session nodes by text query
   * 
   * @param sessionId - Unique session identifier
   * @param query - Search query string
   * @returns Promise resolving to filtered state graph
   * @description Searches entity names, types, and observations for query matches
   */
  async searchSessionNodes(sessionId: string, query: string): Promise<StateGraph> {
    const graph = await this.loadSessionGraph(sessionId);

    // Filter entities
    const filteredEntities = graph.entities.filter(
      e =>
        e.name.toLowerCase().includes(query.toLowerCase()) ||
        e.entityType.toLowerCase().includes(query.toLowerCase()) ||
        e.observations.some(o => o.toLowerCase().includes(query.toLowerCase()))
    );

    // Create a Set of filtered entity names for quick lookup
    const filteredEntityNames = new Set(filteredEntities.map(e => e.name));

    // Filter relations to only include those between filtered entities
    const filteredRelations = graph.relations.filter(
      r => filteredEntityNames.has(r.from) && filteredEntityNames.has(r.to)
    );

    const filteredGraph: StateGraph = {
      entities: filteredEntities,
      relations: filteredRelations,
    };

    return filteredGraph;
  }

  /**
   * Open specific session nodes by name
   * 
   * @param sessionId - Unique session identifier
   * @param names - Array of entity names to retrieve
   * @returns Promise resolving to filtered state graph
   * @description Retrieves specific entities and their interconnections
   */
  async openSessionNodes(sessionId: string, names: string[]): Promise<StateGraph> {
    const graph = await this.loadSessionGraph(sessionId);

    // Filter entities
    const filteredEntities = graph.entities.filter(e => names.includes(e.name));

    // Create a Set of filtered entity names for quick lookup
    const filteredEntityNames = new Set(filteredEntities.map(e => e.name));

    // Filter relations to only include those between filtered entities
    const filteredRelations = graph.relations.filter(
      r => filteredEntityNames.has(r.from) && filteredEntityNames.has(r.to)
    );

    const filteredGraph: StateGraph = {
      entities: filteredEntities,
      relations: filteredRelations,
    };

    return filteredGraph;
  }

  /**
   * Iron Manus-specific convenience methods for FSM operations
   */

  /**
   * Initialize new FSM session with objective and role
   * 
   * @param sessionId - Unique session identifier
   * @param objective - Session objective description
   * @param role - Detected user role for cognitive enhancement
   * @returns Promise resolving when session is initialized
   * @description Creates initial session entity with core FSM state
   */
  async initializeSession(sessionId: string, objective: string, role: string): Promise<void> {
    const sessionEntity: SessionEntity = {
      name: sessionId,
      entityType: 'session',
      observations: [
        `objective: ${objective}`,
        `detected_role: ${role}`,
        `created_at: ${new Date().toISOString()}`,
        `current_phase: INIT`,
      ],
    };

    await this.createSessionEntities(sessionId, [sessionEntity]);
  }

  /**
   * Record FSM phase transition
   * 
   * @param sessionId - Unique session identifier
   * @param fromPhase - Source FSM phase name
   * @param toPhase - Target FSM phase name
   * @returns Promise resolving when transition is recorded
   * @description Creates phase entities and records transition relationship
   */
  async recordPhaseTransition(
    sessionId: string,
    fromPhase: string,
    toPhase: string
  ): Promise<void> {
    const phaseTransition: StateTransition = {
      from: `${sessionId}_phase_${fromPhase}`,
      to: `${sessionId}_phase_${toPhase}`,
      relationType: 'transitions_to',
    };

    // Create phase entities if they don't exist
    const phaseEntities: SessionEntity[] = [
      {
        name: `${sessionId}_phase_${fromPhase}`,
        entityType: 'phase',
        observations: [`phase_name: ${fromPhase}`, `session_id: ${sessionId}`],
      },
      {
        name: `${sessionId}_phase_${toPhase}`,
        entityType: 'phase',
        observations: [`phase_name: ${toPhase}`, `session_id: ${sessionId}`],
      },
    ];

    await this.createSessionEntities(sessionId, phaseEntities);
    await this.createStateTransitions(sessionId, [phaseTransition]);
  }

  /**
   * Record task creation within FSM session
   * 
   * @param sessionId - Unique session identifier
   * @param taskId - Unique task identifier
   * @param content - Task content description
   * @param priority - Task priority level
   * @returns Promise resolving when task is recorded
   * @description Creates task entity and links to session
   */
  async recordTaskCreation(
    sessionId: string,
    taskId: string,
    content: string,
    priority: string
  ): Promise<void> {
    const taskEntity: SessionEntity = {
      name: `${sessionId}_task_${taskId}`,
      entityType: 'task',
      observations: [
        `content: ${content}`,
        `priority: ${priority}`,
        `status: pending`,
        `session_id: ${sessionId}`,
        `created_at: ${new Date().toISOString()}`,
      ],
    };

    const taskRelation: StateTransition = {
      from: sessionId,
      to: `${sessionId}_task_${taskId}`,
      relationType: 'contains',
    };

    await this.createSessionEntities(sessionId, [taskEntity]);
    await this.createStateTransitions(sessionId, [taskRelation]);
  }

  /**
   * Update task status with timestamped observation
   * 
   * @param sessionId - Unique session identifier
   * @param taskId - Unique task identifier
   * @param status - New task status
   * @returns Promise resolving when status is updated
   * @description Adds status update observation to task entity
   */
  async updateTaskStatus(sessionId: string, taskId: string, status: string): Promise<void> {
    await this.addSessionObservations(sessionId, [
      {
        entityName: `${sessionId}_task_${taskId}`,
        contents: [`status_updated: ${status} at ${new Date().toISOString()}`],
      },
    ]);
  }
}

/**
 * Singleton instance of Iron Manus State Graph Manager
 * Provides shared state management across all tool invocations
 * 
 * @const stateGraphManager
 * @description Global instance for consistent FSM state management
 */
const stateGraphManager = new IronManusStateGraphManager();

/**
 * Iron Manus State Graph Tool
 * 
 * MCP tool interface for FSM state management with comprehensive graph operations.
 * Provides project-scoped state management for Iron Manus execution sessions.
 * 
 * Supported Operations:
 * - Entity management (create, delete, search)
 * - State transition tracking
 * - Observation management
 * - FSM-specific convenience methods
 * 
 * Integration Points:
 * - JARVIS FSM controller for phase transitions
 * - Task management system for todo tracking
 * - Role-based cognitive enhancement
 * - Performance monitoring and analytics
 * 
 * @class IronManusStateGraphTool
 * @extends BaseTool
 * @description MCP tool for comprehensive FSM state graph management
 */
export class IronManusStateGraphTool extends BaseTool {
  /** Tool name identifier for MCP registration */
  readonly name = 'IronManusStateGraph';
  
  /** Tool description for MCP discovery and usage */
  readonly description =
    'Project-scoped FSM state management using knowledge graphs. Manage sessions, phases, tasks, and transitions with isolated state per project.';

  /** 
   * JSON Schema for tool input validation
   * Defines comprehensive parameter structure for all FSM state operations
   */
  readonly inputSchema = {
    type: 'object' as const,
    properties: {
      action: {
        type: 'string',
        enum: [
          'create_entities',
          'create_transitions',
          'add_observations',
          'delete_entities',
          'delete_observations',
          'delete_transitions',
          'read_graph',
          'search_nodes',
          'open_nodes',
          'initialize_session',
          'record_phase_transition',
          'record_task_creation',
          'update_task_status',
        ],
        description: 'The action to perform on the session state graph',
      },
      session_id: {
        type: 'string',
        description: 'The session ID for project-scoped state isolation',
      },
      // Generic graph operations
      entities: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            entityType: {
              type: 'string',
              enum: ['session', 'phase', 'task', 'role', 'api', 'performance'],
            },
            observations: { type: 'array', items: { type: 'string' } },
          },
        },
        description: 'Entities to create (for create_entities action)',
      },
      transitions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            from: { type: 'string' },
            to: { type: 'string' },
            relationType: {
              type: 'string',
              enum: ['transitions_to', 'spawns', 'depends_on', 'uses', 'tracks', 'contains'],
            },
          },
        },
        description: 'State transitions to create (for create_transitions action)',
      },
      observations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            entityName: { type: 'string' },
            contents: { type: 'array', items: { type: 'string' } },
          },
        },
        description: 'Observations to add (for add_observations action)',
      },
      query: {
        type: 'string',
        description: 'Search query (for search_nodes action)',
      },
      names: {
        type: 'array',
        items: { type: 'string' },
        description: 'Entity names to retrieve (for open_nodes action)',
      },
      // Iron Manus-specific actions
      objective: {
        type: 'string',
        description: 'Session objective (for initialize_session action)',
      },
      role: {
        type: 'string',
        description: 'Detected role (for initialize_session action)',
      },
      from_phase: {
        type: 'string',
        description: 'Source phase (for record_phase_transition action)',
      },
      to_phase: {
        type: 'string',
        description: 'Target phase (for record_phase_transition action)',
      },
      task_id: {
        type: 'string',
        description: 'Task identifier (for task operations)',
      },
      content: {
        type: 'string',
        description: 'Task content (for record_task_creation action)',
      },
      priority: {
        type: 'string',
        description: 'Task priority (for record_task_creation action)',
      },
      status: {
        type: 'string',
        description: 'Task status (for update_task_status action)',
      },
    },
    required: ['action', 'session_id'],
  };

  /**
   * Handle Iron Manus State Graph operations
   * 
   * @param args - Tool arguments containing action and parameters
   * @returns Promise resolving to tool execution result
   * @throws Error if session_id missing or operation fails
   * @description Processes FSM state graph operations with comprehensive error handling
   */
  async handle(args: any): Promise<ToolResult> {
    const { action, session_id } = args;

    if (!session_id) {
      throw new Error('session_id is required for all Iron Manus State Graph operations');
    }

    try {
      switch (action) {
        case 'create_entities': {
          const newEntities = await stateGraphManager.createSessionEntities(
            session_id,
            args.entities || []
          );
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(newEntities, null, 2),
              },
            ],
          };
        }

        case 'create_transitions': {
          const newTransitions = await stateGraphManager.createStateTransitions(
            session_id,
            args.transitions || []
          );
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(newTransitions, null, 2),
              },
            ],
          };
        }

        case 'add_observations': {
          const addedObservations = await stateGraphManager.addSessionObservations(
            session_id,
            args.observations || []
          );
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(addedObservations, null, 2),
              },
            ],
          };
        }

        case 'delete_entities':
          await stateGraphManager.deleteSessionEntities(session_id, args.entity_names || []);
          return {
            content: [
              {
                type: 'text',
                text: 'Session entities deleted successfully',
              },
            ],
          };

        case 'delete_observations':
          await stateGraphManager.deleteSessionObservations(session_id, args.deletions || []);
          return {
            content: [
              {
                type: 'text',
                text: 'Session observations deleted successfully',
              },
            ],
          };

        case 'delete_transitions':
          await stateGraphManager.deleteStateTransitions(session_id, args.transitions || []);
          return {
            content: [
              {
                type: 'text',
                text: 'State transitions deleted successfully',
              },
            ],
          };

        case 'read_graph': {
          const graph = await stateGraphManager.readSessionGraph(session_id);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(graph, null, 2),
              },
            ],
          };
        }

        case 'search_nodes': {
          const searchResults = await stateGraphManager.searchSessionNodes(
            session_id,
            args.query || ''
          );
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(searchResults, null, 2),
              },
            ],
          };
        }

        case 'open_nodes': {
          const openResults = await stateGraphManager.openSessionNodes(
            session_id,
            args.names || []
          );
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(openResults, null, 2),
              },
            ],
          };
        }

        // Iron Manus-specific convenience actions
        case 'initialize_session':
          await stateGraphManager.initializeSession(
            session_id,
            args.objective || '',
            args.role || ''
          );
          return {
            content: [
              {
                type: 'text',
                text: `Session ${session_id} initialized successfully`,
              },
            ],
          };

        case 'record_phase_transition':
          await stateGraphManager.recordPhaseTransition(
            session_id,
            args.from_phase || '',
            args.to_phase || ''
          );
          return {
            content: [
              {
                type: 'text',
                text: `Phase transition recorded: ${args.from_phase} → ${args.to_phase}`,
              },
            ],
          };

        case 'record_task_creation':
          await stateGraphManager.recordTaskCreation(
            session_id,
            args.task_id || '',
            args.content || '',
            args.priority || 'medium'
          );
          return {
            content: [
              {
                type: 'text',
                text: `Task ${args.task_id} created successfully`,
              },
            ],
          };

        case 'update_task_status':
          await stateGraphManager.updateTaskStatus(
            session_id,
            args.task_id || '',
            args.status || ''
          );
          return {
            content: [
              {
                type: 'text',
                text: `Task ${args.task_id} status updated to: ${args.status}`,
              },
            ],
          };

        default:
          throw new Error(`Unknown action: ${action}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `ERROR: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }
}

/**
 * Export singleton state graph manager for external access
 * Enables direct state management operations outside of MCP tool interface
 */
export { stateGraphManager };
