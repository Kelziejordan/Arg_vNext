/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Mandate 1: STATE DETERMINISM: RemoteData<T> union models instead of split loading/error booleans.
export type RemoteData<T, E = string> =
  | { type: 'NOT_ASKED' }
  | { type: 'LOADING' }
  | { type: 'SUCCESS'; data: T }
  | { type: 'FAILURE'; error: E };

export interface SystemMetric {
  speed: number;        // ms per execution
  leverage: number;     // ratio
  correctness: number;  // percentage (0-100)
  continuity: number;   // percentage (0-100)
  metabolicCost: number;// compute cost index
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'system';
  text: string;
  timestamp: string;
}

export interface SavedSession {
  id: string;
  title: string;
  timestamp: string;
  messages: ChatMessage[];
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SYSTEM' | 'RECONSTRUCT';
  source: 'SEED' | 'SPINE' | 'APEX' | 'GOVERNOR' | 'AGENT';
  message: string;
}

export interface PriorityGoal {
  id: string;
  priority: 'P0' | 'P1' | 'P2';
  title: string;
  status: 'ACTIVE' | 'PENDING' | 'BLOCKED';
  description: string;
}

export interface MandateAuditReport {
  score: number; // 0-100
  passed: boolean;
  timestamp: string;
  details: {
    mandate: string;
    description: string;
    passed: boolean;
    findings: string;
    recommendation: string;
  }[];
  overallSummary: string;
}

export enum DomainProtocol {
  PROTOCOL_A = 'PROTOCOL_A_BIOMETRIC',
  PROTOCOL_B = 'PROTOCOL_B_CYBER_KINETIC',
  PROTOCOL_C = 'PROTOCOL_C_ENTERPRISE_GRID',
  PROTOCOL_D = 'PROTOCOL_D_ATELIER_FLOW',
  PROTOCOL_E = 'PROTOCOL_E_ACADEMY_LMS',
  PROTOCOL_F = 'PROTOCOL_F_FOUNDRY',
}

export const PROTOCOL_METADATA: Record<DomainProtocol, { name: string; tag: string; description: string; rules: string[] }> = {
  [DomainProtocol.PROTOCOL_A]: {
    name: 'Protocol A (Bio-Metric)',
    tag: 'BIO-SEC',
    description: 'Deploys hardware-level physiological entropy vectors and neurological alignment validations.',
    rules: [
      'Heartbeat entropy feedback loop is locked to 1.12Hz base rate.',
      'Acoustic signal matching with 44.1kHz calibration required.',
      'Neuromorphic response triggers abort inside < 80ms.'
    ]
  },
  [DomainProtocol.PROTOCOL_B]: {
    name: 'Protocol B (Cyber-Kinetic)',
    tag: 'CYBER-KIN',
    description: 'Binds mechanical motion actuators, tactile feedback triggers, and low-level physical state engines.',
    rules: [
      'Pulse-width modulations must comply with kinetic speed dampers.',
      'Absolute angular feedback tolerance < 0.01 radians.',
      'Force-feedback pressure curves require double-sigmoidal damping.'
    ]
  },
  [DomainProtocol.PROTOCOL_C]: {
    name: 'Protocol C (Enterprise Grid)',
    tag: 'GRID-ENT',
    description: 'Enforces high-availability distributed state synchronization, partition-tolerance, and cluster telemetry.',
    rules: [
      'Raft consensus checks performed every 150ms heartbeat.',
      'Distributed clock skew boundary max 5 microseconds.',
      'Dynamic partition recovery routes via cold storage fallback.'
    ]
  },
  [DomainProtocol.PROTOCOL_D]: {
    name: 'Protocol D (Atelier Flow)',
    tag: 'FLOW-ATL',
    description: 'Customizes highly detailed creative design pipelines, visual aspect engines, and real-time artistic rendering loops.',
    rules: [
      'Viewport refresh boundaries locked to v-sync intervals.',
      'Subpixel positional coordinate rendering must use floating boundaries.',
      'Aesthetic weight ratios comply with exact golden ratio standards.'
    ]
  },
  [DomainProtocol.PROTOCOL_E]: {
    name: 'Protocol E (Academy LMS)',
    tag: 'ACAD-LMS',
    description: 'Secures knowledge retention logs, active educational paths, and semantic skill-tree dependencies.',
    rules: [
      'Prerequisite validation paths checked on all state changes.',
      'Curriculum progression models are strictly server-authoritative.',
      'Dynamic retention index decay calculated via half-life formulas.'
    ]
  },
  [DomainProtocol.PROTOCOL_F]: {
    name: 'Protocol F (Foundry)',
    tag: 'FND-CORE',
    description: 'Configures heavy compilation, automated tests pipelines, physical builds, and code delivery gates.',
    rules: [
      'AOT compilation boundaries verified on pre-commit hook.',
      'Static semantic analyzer parses strict bounds on entry.',
      'Rollback scripts pre-cached and hot-swappable on main branches.'
    ]
  },
};
