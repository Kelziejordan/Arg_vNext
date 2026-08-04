/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SystemCapability {
  id: string;
  name: string;
  category: string;
  status: 'ACTIVE' | 'EXPERIMENTAL' | 'DEPRECATED';
  description: string;
  inputs: string[];
  outputs: string[];
  estimatedCost: number; // in metabolic units
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  confidenceScore: number;
}

export interface ExecutableCapability extends SystemCapability {
  canHandle(task: string): number;
  execute(inputs: Record<string, any>): Promise<Record<string, any>>;
  verify(outputs: Record<string, any>): boolean;
}

export interface RouteResolution {
  capability: ExecutableCapability;
  confidence: number;
  cost: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  matchScore: number;
}

export class DigitalHandsBrowserCap implements ExecutableCapability {
  id = 'CAP-001';
  name = 'DigitalHands Browser Agent';
  category = 'Automation';
  status: 'ACTIVE' | 'EXPERIMENTAL' | 'DEPRECATED' = 'ACTIVE';
  description = 'Autonomous browser execution via Playwright orchestration.';
  inputs = ['url', 'action_chain'];
  outputs = ['screenshot', 'dom_elements'];
  estimatedCost = 35;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'HIGH';
  confidenceScore = 0.94;

  canHandle(task: string): number {
    const t = task.toLowerCase();
    if (t.includes('browser') || t.includes('playwright') || t.includes('url') || t.includes('scrape')) return 12;
    return 0;
  }

  async execute(inputs: Record<string, any>): Promise<Record<string, any>> {
    const url = inputs.url || 'https://google.com';
    return {
      screenshot: `data:image/png;base64,mock_render_of_${url}`,
      dom_elements: ['body', 'div', 'button'],
      executed_at: new Date().toISOString()
    };
  }

  verify(outputs: Record<string, any>): boolean {
    return !!outputs.screenshot && Array.isArray(outputs.dom_elements);
  }
}

export class ApexSentinelCap implements ExecutableCapability {
  id = 'CAP-002';
  name = 'APEX Adaptive Sentinel';
  category = 'Trading';
  status: 'ACTIVE' | 'EXPERIMENTAL' | 'DEPRECATED' = 'EXPERIMENTAL';
  description = 'Environment-adaptive cashout, 10x cluster chasing, and floating stop-loss limits.';
  inputs = ['multiplier_history', 'bankroll_limit'];
  outputs = ['order_ticket', 'hedge_allocation'];
  estimatedCost = 20;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
  confidenceScore = 0.82;

  canHandle(task: string): number {
    const t = task.toLowerCase();
    if (t.includes('trade') || t.includes('cashout') || t.includes('bankroll') || t.includes('limit')) return 12;
    return 0;
  }

  async execute(inputs: Record<string, any>): Promise<Record<string, any>> {
    const history = inputs.multiplier_history || [1.2, 1.5, 2.0];
    const avg = history.reduce((a: number, b: number) => a + b, 0) / history.length;
    return {
      order_ticket: `TKT-${Math.floor(Math.random() * 90000) + 10000}`,
      hedge_allocation: avg > 1.8 ? 0.35 : 0.15,
      calculated_avg: avg
    };
  }

  verify(outputs: Record<string, any>): boolean {
    return !!outputs.order_ticket && typeof outputs.hedge_allocation === 'number';
  }
}

export class ReflexAuditCap implements ExecutableCapability {
  id = 'CAP-003';
  name = 'Reflex Code Auditing Pass';
  category = 'Verification';
  status: 'ACTIVE' | 'EXPERIMENTAL' | 'DEPRECATED' = 'ACTIVE';
  description = 'Pre-commit AOT AST structural analysis against constitution mandates.';
  inputs = ['source_code', 'ruleset'];
  outputs = ['ast_json', 'compliance_findings'];
  estimatedCost = 10;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  confidenceScore = 0.99;

  canHandle(task: string): number {
    const t = task.toLowerCase();
    if (t.includes('audit') || t.includes('code') || t.includes('ast') || t.includes('compile') || t.includes('mandate')) return 12;
    return 0;
  }

  async execute(inputs: Record<string, any>): Promise<Record<string, any>> {
    const code = inputs.source_code || '';
    const length = code.length;
    return {
      ast_json: { type: 'Program', bodyLength: length },
      compliance_findings: length > 0 ? [] : ['Empty payload rejected.'],
      timestamp: Date.now()
    };
  }

  verify(outputs: Record<string, any>): boolean {
    return typeof outputs.ast_json === 'object' && Array.isArray(outputs.compliance_findings);
  }
}

export class HydraulicIntentCap implements ExecutableCapability {
  id = 'CAP-004';
  name = 'Hydraulic Intent Dispatcher';
  category = 'Scheduling';
  status: 'ACTIVE' | 'EXPERIMENTAL' | 'DEPRECATED' = 'ACTIVE';
  description = 'Throttles and matches execution pace with hardware metabolic boundaries.';
  inputs = ['task_queue', 'metabolic_pressure'];
  outputs = ['throttle_coefficient', 'scheduled_pings'];
  estimatedCost = 5;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  confidenceScore = 0.97;

  canHandle(task: string): number {
    const t = task.toLowerCase();
    if (t.includes('schedule') || t.includes('throttle') || t.includes('queue') || t.includes('metabolic')) return 12;
    return 0;
  }

  async execute(inputs: Record<string, any>): Promise<Record<string, any>> {
    const queue = inputs.task_queue || [];
    const pressure = inputs.metabolic_pressure || 50;
    return {
      throttle_coefficient: pressure > 80 ? 0.25 : 0.85,
      scheduled_pings: queue.map((_: any, i: number) => `ping_${i}`),
      applied_at: new Date().toISOString()
    };
  }

  verify(outputs: Record<string, any>): boolean {
    return typeof outputs.throttle_coefficient === 'number' && Array.isArray(outputs.scheduled_pings);
  }
}

export class OmniVectorCap implements ExecutableCapability {
  id = 'CAP-005';
  name = 'Omni Vector Generator';
  category = 'Cognition';
  status: 'ACTIVE' | 'EXPERIMENTAL' | 'DEPRECATED' = 'EXPERIMENTAL';
  description = 'Translates unstructured prompts to multi-dimensional context blocks.';
  inputs = ['natural_prompt', 'embedding_model'];
  outputs = ['context_vector', 'confidence_index'];
  estimatedCost = 15;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  confidenceScore = 0.89;

  canHandle(task: string): number {
    const t = task.toLowerCase();
    // Falls back to true for typical queries
    if (t.includes('cognitive') || t.includes('prompt') || t.includes('vector') || t.includes('generate')) return 12;
    return 2; // general default fallback score
  }

  async execute(inputs: Record<string, any>): Promise<Record<string, any>> {
    const prompt = inputs.natural_prompt || 'empty';
    return {
      context_vector: [0.15, -0.4, 0.88, 0.33],
      confidence_index: prompt.length > 5 ? 0.95 : 0.72
    };
  }

  verify(outputs: Record<string, any>): boolean {
    return Array.isArray(outputs.context_vector) && typeof outputs.confidence_index === 'number';
  }
}

export class CapabilityRegistryService {
  private capabilities: ExecutableCapability[] = [
    new DigitalHandsBrowserCap(),
    new ApexSentinelCap(),
    new ReflexAuditCap(),
    new HydraulicIntentCap(),
    new OmniVectorCap()
  ];

  /**
   * Resolves the best available system capability to handle a specific operational task.
   * Utilizes the score-based query routing system.
   */
  public resolveTask(intent: string): RouteResolution | null {
    if (!intent) return null;
    
    let bestCap: ExecutableCapability | null = null;
    let highestScore = 0;

    for (const cap of this.capabilities) {
      if (cap.status === 'DEPRECATED') continue;

      const score = cap.canHandle(intent);

      if (score > highestScore) {
        highestScore = score;
        bestCap = cap;
      }
    }

    // Default to CAP-005 (Omni Vector) if no high-confidence match
    if (!bestCap || highestScore < 1) {
      bestCap = this.capabilities.find(c => c.id === 'CAP-005') || this.capabilities[0];
      highestScore = 1;
    }

    return {
      capability: bestCap,
      confidence: bestCap.confidenceScore,
      cost: bestCap.estimatedCost,
      risk: bestCap.riskLevel,
      matchScore: highestScore
    };
  }

  public getCapabilities(): ExecutableCapability[] {
    return [...this.capabilities];
  }

  public setCapabilityStatus(id: string, status: SystemCapability['status']) {
    const cap = this.capabilities.find(c => c.id === id);
    if (cap) {
      cap.status = status;
    }
  }

  /**
   * Static access method for code execution diagnostics.
   */
  public static getAll(): SystemCapability[] {
    return [
      new DigitalHandsBrowserCap(),
      new ApexSentinelCap(),
      new ReflexAuditCap(),
      new HydraulicIntentCap(),
      new OmniVectorCap()
    ];
  }
}

export const capabilityRegistryInstance = new CapabilityRegistryService();
