/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ArchitecturalConcept {
  term: string;
  codename: string;
  benefit: string;
  description: string;
  technicalRole: string;
}

export const ARCHITECTURAL_DICTIONARY: Record<string, ArchitecturalConcept> = {
  IMMUTABLE_SEED: {
    term: 'Sovereign Root Backup',
    codename: 'Immutable Seed (Sovereign Root)',
    benefit: 'Guarantees the system can always rebuild itself perfectly in seconds, even after critical crashes.',
    description: 'A read-only, cryptographic seed that anchors the core identity, personality traits, and foundational rules of the agent.',
    technicalRole: 'Used to reconstruct active state variables whenever systemic confidence or integrity metrics fall below safe boundaries (0.50).'
  },
  FROZEN_CORE: {
    term: 'Policy Engine Service',
    codename: 'Frozen Constitutional Core (Policy Engine)',
    benefit: 'Prevents the AI agent from accidentally modifying its core safety rules or running out of control.',
    description: 'An unalterable set of 9 structural mandates governing safety, budgeting, and execution correctness.',
    technicalRole: 'Acts as the compile-time and runtime policy anchor, refusing any action that violates its safety rules.'
  },
  CONTINUITY_SPINE: {
    term: 'Event Ledger Service',
    codename: 'Continuity Spine (Event Ledger)',
    benefit: 'Maintains an absolute, un-erasable history of every action, decision, and state change for total auditability.',
    description: 'An append-only transaction ledger that logs all internal state transitions, ledger events, and external handshakes.',
    technicalRole: 'Provides event-sourced recovery, enabling complete system rollback and audit compliance checks.'
  },
  HYDRAULIC_ENGINE: {
    term: 'Task Scheduler & Action Throttle',
    codename: 'Hydraulic Intent Engine (Task Scheduler)',
    benefit: 'Protects your budget and API limits by pacing and prioritizing tasks based on real-time cost and pressure.',
    description: 'A fluidic scheduling model that accumulates execution pressure as tasks build up, and dispenses them safely based on resource availability.',
    technicalRole: 'Throttles and sequences high-frequency action loops to respect token budgets and rate-limits, preventing cost spikes.'
  },
  APEX_COMPILER: {
    term: 'Task Routing & Registry Core',
    codename: 'Capability Registry (Task Routing)',
    benefit: 'Ensures external browser tools, databases, and APIs are 100% safe and verified before execution.',
    description: 'The registry and verification gateway for all sub-agents, browser actions, and computational modules.',
    technicalRole: 'Performs pre-execution abstract syntax tree (AST) audits and security sandboxing on all external tools.'
  }
};

export class ArchitectureOntology {
  /**
   * Resolves a concept key or term to its dual-naming descriptor.
   */
  public static query(keyOrTerm: string): ArchitecturalConcept | undefined {
    if (!keyOrTerm) return undefined;
    const normalized = keyOrTerm.toUpperCase().trim();
    if (ARCHITECTURAL_DICTIONARY[normalized]) {
      return ARCHITECTURAL_DICTIONARY[normalized];
    }
    // Search by codename or term content
    return Object.values(ARCHITECTURAL_DICTIONARY).find(concept => 
      concept.term.toLowerCase().includes(keyOrTerm.toLowerCase()) ||
      concept.codename.toLowerCase().includes(keyOrTerm.toLowerCase())
    );
  }

  /**
   * Returns complete mapping of branding terms to their precise engineering role.
   */
  public static getDualNames(): Array<{ branding: string; engineering: string; key: string }> {
    return Object.entries(ARCHITECTURAL_DICTIONARY).map(([key, concept]) => {
      const brandingMatch = concept.codename.match(/^([^\(]+)/);
      const engineering = concept.term;
      return {
        key,
        branding: brandingMatch ? brandingMatch[1].trim() : concept.codename,
        engineering
      };
    });
  }

  /**
   * Validates whether a requested subsystem component is compliant with active architectural ontology.
   */
  public static verifyComponentOntology(name: string): boolean {
    const termLower = name.toLowerCase();
    return Object.values(ARCHITECTURAL_DICTIONARY).some(concept => 
      concept.term.toLowerCase().includes(termLower) ||
      concept.codename.toLowerCase().includes(termLower)
    );
  }
}
