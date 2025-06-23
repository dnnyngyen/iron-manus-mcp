/**
 * MANUS FSM REFERENCE INDEX
 * 
 * This file tracks all code references across the project to enable:
 * - Proactive error detection during refactoring
 * - Documentation synchronization validation
 * - Dependency impact analysis
 * - Safe renaming and restructuring
 */

export interface CodeReference {
  file: string;
  line: number;
  referencedIn: string[];
  exports?: string[];
  imports?: string[];
  description: string;
  type: 'function' | 'class' | 'interface' | 'constant' | 'phase' | 'documentation';
  dependencies?: string[];
}

export interface DocumentationReference {
  file: string;
  section?: string;
  referencedIn: string[];
  description: string;
  codeReferences: string[];
}

/**
 * CORE FSM FUNCTIONS
 */
export const CORE_FSM_REFERENCES: Record<string, CodeReference> = {
  // Main processing function
  'processManusFSM': {
    file: 'src/core/fsm.ts',
    line: 104,
    referencedIn: [
      'src/index.ts:74',
      'docs/001_ARCHITECTURE_GUIDE.md:149',
      'docs/002_ORCHESTRATION_LOOP.md:10',
      'docs/003_System_Diagram.md:10',
      'manus_mega_diagram_fixed.html:325'
    ],
    exports: ['processManusFSM'],
    imports: ['types.js', 'prompts.js', 'state.js'],
    description: 'Main FSM processing function - handles all phase transitions',
    type: 'function',
    dependencies: ['ManusOrchestratorInput', 'ManusOrchestratorOutput', 'stateManager']
  },

  // Validation engine
  'validateTaskCompletion': {
    file: 'src/core/fsm.ts',
    line: 467,
    referencedIn: [
      'src/core/fsm.ts:220',
      'docs/001_ARCHITECTURE_GUIDE.md:333',
      'docs/002_ORCHESTRATION_LOOP.md:206',
      'manus_mega_diagram_fixed.html:467'
    ],
    description: 'Mathematical validation engine with 5 strict rules',
    type: 'function',
    dependencies: ['VerificationResult', 'TodoItem']
  },

  // Meta-prompt extraction
  'extractMetaPromptFromTodo': {
    file: 'src/core/fsm.ts',
    line: 398,
    referencedIn: [
      'src/index.ts:5',
      'src/core/fsm.ts:170',
      'docs/001_ARCHITECTURE_GUIDE.md:382',
      'manus_mega_diagram_fixed.html:398'
    ],
    exports: ['extractMetaPromptFromTodo'],
    description: 'Parses meta-prompt syntax from todo content for fractal orchestration',
    type: 'function',
    dependencies: ['MetaPrompt']
  }
};

/**
 * PHASE WORKFLOW REFERENCES
 */
export const PHASE_REFERENCES: Record<string, CodeReference> = {
  'QUERY_PHASE': {
    file: 'src/core/fsm.ts',
    line: 132,
    referencedIn: [
      'docs/001_ARCHITECTURE_GUIDE.md:226',
      'docs/002_ORCHESTRATION_LOOP.md:26',
      'docs/003_System_Diagram.md:73',
      'manus_mega_diagram_fixed.html:325'
    ],
    description: 'QUERY phase - Analyze Events (role detection and objective clarification)',
    type: 'phase'
  },

  'ENHANCE_PHASE': {
    file: 'src/core/fsm.ts',
    line: 142,
    referencedIn: [
      'docs/001_ARCHITECTURE_GUIDE.md:248',
      'docs/002_ORCHESTRATION_LOOP.md:54',
      'manus_mega_diagram_fixed.html:326'
    ],
    description: 'ENHANCE phase - Select Tools (goal refinement)',
    type: 'phase'
  },

  'KNOWLEDGE_PHASE': {
    file: 'src/core/fsm.ts',
    line: 152,
    referencedIn: [
      'docs/001_ARCHITECTURE_GUIDE.md:262',
      'docs/002_ORCHESTRATION_LOOP.md:79',
      'manus_mega_diagram_fixed.html:327'
    ],
    description: 'KNOWLEDGE phase - Wait for Execution (information gathering)',
    type: 'phase'
  },

  'PLAN_PHASE': {
    file: 'src/core/fsm.ts',
    line: 162,
    referencedIn: [
      'docs/001_ARCHITECTURE_GUIDE.md:272',
      'docs/002_ORCHESTRATION_LOOP.md:101',
      'docs/003_System_Diagram.md:123',
      'manus_mega_diagram_fixed.html:328'
    ],
    description: 'PLAN phase - Iterate (strategic decomposition and fractal orchestration setup)',
    type: 'phase'
  },

  'EXECUTE_PHASE': {
    file: 'src/core/fsm.ts',
    line: 191,
    referencedIn: [
      'docs/001_ARCHITECTURE_GUIDE.md:302',
      'docs/002_ORCHESTRATION_LOOP.md:137',
      'docs/003_System_Diagram.md:201',
      'manus_mega_diagram_fixed.html:329'
    ],
    description: 'EXECUTE phase - Submit Results (task execution with recursive agent spawning)',
    type: 'phase'
  },

  'VERIFY_PHASE': {
    file: 'src/core/fsm.ts',
    line: 220,
    referencedIn: [
      'docs/001_ARCHITECTURE_GUIDE.md:330',
      'docs/002_ORCHESTRATION_LOOP.md:183',
      'manus_mega_diagram_fixed.html:330'
    ],
    description: 'VERIFY phase - Enter Standby (mathematical validation and intelligent rollback)',
    type: 'phase'
  }
};

/**
 * PROMPT ENGINEERING REFERENCES
 */
export const PROMPT_REFERENCES: Record<string, CodeReference> = {
  'generateRoleEnhancedPrompt': {
    file: 'src/core/prompts.ts',
    line: 208,
    referencedIn: [
      'src/core/fsm.ts:271',
      'docs/001_ARCHITECTURE_GUIDE.md:158'
    ],
    exports: ['generateRoleEnhancedPrompt'],
    description: 'Layer integration engine for multi-layer prompt engineering',
    type: 'function'
  },

  'ROLE_CONFIG': {
    file: 'src/core/prompts.ts',
    line: 17,
    referencedIn: [
      'docs/001_ARCHITECTURE_GUIDE.md:156',
      'docs/003_System_Diagram.md:309',
      'manus_mega_diagram_fixed.html:363'
    ],
    description: 'Layer 2 - Role-specific thinking methodologies with cognitive multipliers',
    type: 'constant'
  },

  'BASE_PHASE_PROMPTS': {
    file: 'src/core/prompts.ts',
    line: 243,
    referencedIn: [
      'docs/001_ARCHITECTURE_GUIDE.md:155',
      'manus_mega_diagram_fixed.html:354'
    ],
    description: 'Layer 1 - Phase-specific thinking guidance',
    type: 'constant'
  },

  'PHASE_ALLOWED_TOOLS': {
    file: 'src/core/prompts.ts',
    line: 662,
    referencedIn: [
      'src/core/fsm.ts:20',
      'docs/001_ARCHITECTURE_GUIDE.md:159',
      'docs/003_System_Diagram.md:354',
      'manus_mega_diagram_fixed.html:389'
    ],
    exports: ['PHASE_ALLOWED_TOOLS'],
    description: 'Layer 5 - Tool constraint guidance with phase-specific whitelists',
    type: 'constant'
  }
};

/**
 * STATE MANAGEMENT REFERENCES
 */
export const STATE_REFERENCES: Record<string, CodeReference> = {
  'stateManager': {
    file: 'src/core/state.ts',
    line: 1,
    referencedIn: [
      'src/index.ts:89',
      'src/core/fsm.ts:23',
      'docs/001_ARCHITECTURE_GUIDE.md:525'
    ],
    exports: ['stateManager'],
    description: 'Session state and context persistence manager',
    type: 'class'
  },

  'SessionState': {
    file: 'src/core/types.ts',
    line: 50,
    referencedIn: [
      'src/core/state.ts:10',
      'docs/001_ARCHITECTURE_GUIDE.md:504',
      'docs/003_System_Diagram.md:302'
    ],
    description: 'Session state structure interface',
    type: 'interface'
  }
};

/**
 * DOCUMENTATION REFERENCES
 */
export const DOCUMENTATION_REFERENCES: Record<string, DocumentationReference> = {
  'ARCHITECTURE_GUIDE': {
    file: 'docs/001_ARCHITECTURE_GUIDE.md',
    referencedIn: [
      'README.md:25',
      'docs/README.md:15',
      'manus_mega_diagram_fixed.html:310'
    ],
    description: 'Complete guide to deterministic agent control',
    codeReferences: [
      'src/core/fsm.ts:104',
      'src/core/prompts.ts:17',
      'src/index.ts:73'
    ]
  },

  'ORCHESTRATION_LOOP': {
    file: 'docs/002_ORCHESTRATION_LOOP.md',
    referencedIn: [
      'docs/README.md:16',
      'manus_mega_diagram_fixed.html:311'
    ],
    description: 'Complete chronological breakdown of 6-phase workflow',
    codeReferences: [
      'src/core/fsm.ts:132',
      'src/index.ts:73'
    ]
  },

  'SYSTEM_DIAGRAM': {
    file: 'docs/003_System_Diagram.md',
    referencedIn: [
      'docs/README.md:17'
    ],
    description: 'ASCII flow diagrams for all phases',
    codeReferences: [
      'src/core/fsm.ts:162',
      'src/core/prompts.ts:662'
    ]
  }
};

/**
 * COMBINED REFERENCE INDEX
 */
export const REFERENCE_INDEX = {
  ...CORE_FSM_REFERENCES,
  ...PHASE_REFERENCES,
  ...PROMPT_REFERENCES,
  ...STATE_REFERENCES
} as const;

/**
 * FILE STRUCTURE MAPPING
 */
export const FILE_STRUCTURE = {
  'src/index.ts': {
    description: 'MCP Server entry point',
    keyFunctions: ['main', 'processManusFSM call'],
    dependencies: ['src/core/fsm.ts', 'src/core/types.ts', 'src/core/state.ts']
  },
  'src/core/fsm.ts': {
    description: 'Core FSM logic with 6-phase workflow',
    keyFunctions: ['processManusFSM', 'validateTaskCompletion', 'extractMetaPromptFromTodo'],
    dependencies: ['src/core/types.ts', 'src/core/prompts.ts', 'src/core/state.ts']
  },
  'src/core/prompts.ts': {
    description: 'Multi-layer prompt engineering system',
    keyFunctions: ['generateRoleEnhancedPrompt', 'detectRole'],
    constants: ['ROLE_CONFIG', 'BASE_PHASE_PROMPTS', 'PHASE_ALLOWED_TOOLS']
  },
  'src/core/state.ts': {
    description: 'Session state and persistence management',
    keyFunctions: ['stateManager'],
    dependencies: ['src/core/types.ts']
  },
  'src/core/types.ts': {
    description: 'Type definitions for the entire system',
    interfaces: ['ManusOrchestratorInput', 'ManusOrchestratorOutput', 'SessionState', 'MetaPrompt']
  }
} as const;

/**
 * VALIDATION RULES
 */
export const VALIDATION_RULES = {
  fileExists: (filePath: string): boolean => {
    // This will be implemented in the validation script
    return true;
  },
  lineExists: (filePath: string, lineNumber: number): boolean => {
    // This will be implemented in the validation script
    return true;
  },
  referenceExists: (filePath: string, searchTerm: string): boolean => {
    // This will be implemented in the validation script
    return true;
  }
} as const;