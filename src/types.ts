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

// Active AI Model Definition for switching AI engines
export interface AiModel {
  id: string;
  name: string;
  provider: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  description: string;
  tag: string;
  isAuto?: boolean;
}

export const POPULAR_AI_MODELS: AiModel[] = [
  {
    id: 'arg-auto',
    name: 'ARG Sovereign Engine',
    provider: 'ARG Core Router',
    badge: 'AUTO SELECT',
    badgeBg: 'bg-[#FFD700]/10 border-[#FFD700]/30',
    badgeColor: 'text-[#FFD700]',
    description: 'Dynamic multi-agent router auto-selecting the optimal model per task intent',
    tag: 'Default',
    isAuto: true,
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google DeepMind',
    badge: '1M+ CONTEXT',
    badgeBg: 'bg-blue-500/10 border-blue-500/30',
    badgeColor: 'text-blue-400',
    description: '1M+ context window, ultra-high reasoning & multimodal precision',
    tag: 'Google',
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'Google DeepMind',
    badge: 'ULTRA FAST',
    badgeBg: 'bg-sky-500/10 border-sky-500/30',
    badgeColor: 'text-sky-400',
    description: 'Sub-second execution speed, low latency, lightweight agentic loops',
    tag: 'Google',
  },
  {
    id: 'claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    badge: 'SOTA CODE',
    badgeBg: 'bg-amber-500/10 border-amber-500/30',
    badgeColor: 'text-amber-400',
    description: 'Industry-leading code generation, architectural analysis & complex logic',
    tag: 'Anthropic',
  },
  {
    id: 'claude-3.5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'Anthropic',
    badge: 'SPEED & REASONING',
    badgeBg: 'bg-orange-500/10 border-orange-500/30',
    badgeColor: 'text-orange-400',
    description: 'High-speed reasoning, rapid refactoring & concise structural outputs',
    tag: 'Anthropic',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    badge: 'OMNI-MODAL',
    badgeBg: 'bg-emerald-500/10 border-emerald-500/30',
    badgeColor: 'text-emerald-400',
    description: 'Flagship omni model with fast, robust structured JSON outputs',
    tag: 'OpenAI',
  },
  {
    id: 'o3-mini',
    name: 'o3-mini',
    provider: 'OpenAI',
    badge: 'REASONING CHAIN',
    badgeBg: 'bg-teal-500/10 border-teal-500/30',
    badgeColor: 'text-teal-400',
    description: 'Advanced step-by-step reasoning & complex mathematical verification',
    tag: 'OpenAI',
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    badge: '671B MOE',
    badgeBg: 'bg-indigo-500/10 border-indigo-500/30',
    badgeColor: 'text-indigo-400',
    description: 'Open Mixture-of-Experts engine tailored for high-scale software development',
    tag: 'DeepSeek',
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    badge: 'OPEN REASONER',
    badgeBg: 'bg-violet-500/10 border-violet-500/30',
    badgeColor: 'text-violet-400',
    description: 'Open-weights reasoning model with verifiable chain-of-thought outputs',
    tag: 'DeepSeek',
  },
  {
    id: 'llama-3.3-70b',
    name: 'Llama 3.3 70B',
    provider: 'Meta AI',
    badge: 'OPEN SOURCE',
    badgeBg: 'bg-cyan-500/10 border-cyan-500/30',
    badgeColor: 'text-cyan-400',
    description: 'Open-source 70B flagship model for privacy-first architecture compliance',
    tag: 'Meta',
  },
  {
    id: 'mistral-large-2',
    name: 'Mistral Large 2',
    provider: 'Mistral AI',
    badge: '123B FLAGSHIP',
    badgeBg: 'bg-rose-500/10 border-rose-500/30',
    badgeColor: 'text-rose-400',
    description: 'European frontier model optimized for multilingual code & reasoning tasks',
    tag: 'Mistral',
  },
];

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
