// src/phase-engine/helpers.ts
import type { Role } from '../core/types.js';
import logger from '../utils/logger.js';

// Type alias for compatibility
export type RoleName = Role;

/**
 * Parse ROLE and other meta-prompts from a single LLM line.
 * Returns { role, metaPrompts } or null if not found.
 */

/** crude token estimator ~4 chars = 1 token */
export function tokenBudgetOkay(str: string, budget = 6_000): boolean {
  return Math.ceil(str.length / 4) < budget;
}

export function detectFractalDelegation(text: string): boolean {
  return /\(ROLE:\s*[^)]+\)/i.test(text);
}

/** no-op placeholder, can wire to a real metrics collector later */
export function recordCognitiveLoad(phase: string, ms: number): void {
  if (process.env.DEBUG_LOAD) logger.debug(`Phase ${phase} took ${ms} ms`);
}

/** Normalised result object from the Knowledge phase */
export interface KnowledgePhaseResult {
  answer: string;
  contradictions: string[];
  confidence: number;
}

/** Dependencies injected into createFSM() for easy unit testing */
export interface AutoConnectionDeps {
  autoConnection: (q: string) => Promise<KnowledgePhaseResult>;
}
