/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PolicyErrorCode = 
  | 'IDENTITY_DRIFT' 
  | 'THREAD_OVERFLOW' 
  | 'CONFIDENCE_DEGRADATION' 
  | 'METABOLIC_OVERDRAFT' 
  | 'AST_AUDIT_WARNING';

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface PolicyFinding {
  code: PolicyErrorCode;
  severity: Severity;
  threshold: number;
  actual: number;
  passed: boolean;
  message: string;
}

export interface PolicyReport {
  score: number;
  passed: boolean;
  timestamp: string;
  findings: PolicyFinding[];
}

export class PolicyEngineService {
  /**
   * Evaluates system indicators against strict structural parameters.
   * "The service speaks data, the UI renders the prose."
   */
  public static evaluate(metrics: {
    aggression: number;
    caution: number;
    activeThreads: number;
    confidence: number;
    operatingState: 'SHIP' | 'FREEZE' | 'EXPAND';
    metabolicCost: number;
  }): PolicyReport {
    const timestamp = new Date().toLocaleTimeString();
    const findings: PolicyFinding[] = [];
    let score = 100;

    // Rule 1: IDENTITY_DRIFT (Aggression vs Caution balance)
    const driftRatio = Math.abs(metrics.aggression - metrics.caution);
    const driftPassed = driftRatio <= 0.40;
    if (!driftPassed) score -= 15;
    findings.push({
      code: 'IDENTITY_DRIFT',
      severity: driftRatio > 0.60 ? 'CRITICAL' : 'HIGH',
      threshold: 0.40,
      actual: parseFloat(driftRatio.toFixed(3)),
      passed: driftPassed,
      message: 'Difference ratio between system Aggression and Caution must remain within constitutional constraints.'
    });

    // Rule 2: THREAD_OVERFLOW
    // Allow more threads in EXPAND, tighten bounds in FREEZE
    const maxThreads = metrics.operatingState === 'FREEZE' ? 8 : metrics.operatingState === 'EXPAND' ? 24 : 16;
    const threadsPassed = metrics.activeThreads <= maxThreads;
    if (!threadsPassed) score -= 15;
    findings.push({
      code: 'THREAD_OVERFLOW',
      severity: metrics.activeThreads > maxThreads + 4 ? 'HIGH' : 'MEDIUM',
      threshold: maxThreads,
      actual: metrics.activeThreads,
      passed: threadsPassed,
      message: 'Active concurrent threads must not overflow standard operating sandbox metabolic limits.'
    });

    // Rule 3: CONFIDENCE_DEGRADATION
    const minConfidence = 0.50;
    const confidencePassed = metrics.confidence >= minConfidence;
    if (!confidencePassed) score -= 25;
    findings.push({
      code: 'CONFIDENCE_DEGRADATION',
      severity: metrics.confidence < 0.35 ? 'CRITICAL' : 'HIGH',
      threshold: minConfidence,
      actual: parseFloat(metrics.confidence.toFixed(3)),
      passed: confidencePassed,
      message: 'System alignment confidence must remain above state determinism thresholds.'
    });

    // Rule 4: METABOLIC_OVERDRAFT
    const maxCost = metrics.operatingState === 'FREEZE' ? 20 : metrics.operatingState === 'SHIP' ? 75 : 120;
    const metabolicPassed = metrics.metabolicCost <= maxCost;
    if (!metabolicPassed) score -= 15;
    findings.push({
      code: 'METABOLIC_OVERDRAFT',
      severity: 'LOW',
      threshold: maxCost,
      actual: metrics.metabolicCost,
      passed: metabolicPassed,
      message: 'Operational footprint must respect active energy throttling rules.'
    });

    // Final compliance synthesis
    const passed = score >= 75;

    return {
      score: Math.max(0, score),
      passed,
      timestamp,
      findings
    };
  }
}
