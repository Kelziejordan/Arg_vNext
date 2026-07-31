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
    codename: 'Immutable Seed',
    benefit: 'Guarantees the system can always rebuild itself perfectly in seconds, even after critical crashes.',
    description: 'A read-only, cryptographic seed that anchors the core identity, personality traits, and foundational rules of the agent.',
    technicalRole: 'Used to reconstruct active state variables whenever systemic confidence or integrity metrics fall below safe boundaries (0.50).'
  },
  FROZEN_CORE: {
    term: 'System Integrity Rules',
    codename: 'Frozen Constitutional Core',
    benefit: 'Prevents the AI agent from accidentally modifying its core safety rules or running out of control.',
    description: 'An unalterable set of 9 structural mandates governing safety, budgeting, and execution correctness.',
    technicalRole: 'Acts as the compile-time and runtime policy anchor, refusing any action that violates its safety rules.'
  },
  CONTINUITY_SPINE: {
    term: 'Immutable Event Ledger',
    codename: 'Continuity Spine',
    benefit: 'Maintains an absolute, un-erasable history of every action, decision, and state change for total auditability.',
    description: 'An append-only transaction ledger that logs all internal state transitions, ledger events, and external handshakes.',
    technicalRole: 'Provides event-sourced recovery, enabling complete system rollback and audit compliance checks.'
  },
  HYDRAULIC_ENGINE: {
    term: 'Autonomous Action Throttle',
    codename: 'Hydraulic Intent Engine',
    benefit: 'Protects your budget and API limits by pacing and prioritizing tasks based on real-time cost and pressure.',
    description: 'A fluidic scheduling model that accumulates execution pressure as tasks build up, and dispenses them safely based on resource availability.',
    technicalRole: 'Throttles and sequences high-frequency action loops to respect token budgets and rate-limits, preventing cost spikes.'
  },
  APEX_COMPILER: {
    term: 'Automated Tool Gate',
    codename: 'Apex Compiler / Capability Registry',
    benefit: 'Ensures external browser tools, databases, and APIs are 100% safe and verified before execution.',
    description: 'The registry and verification gateway for all sub-agents, browser actions, and computational modules.',
    technicalRole: 'Performs pre-execution abstract syntax tree (AST) audits and security sandboxing on all external tools.'
  }
};
