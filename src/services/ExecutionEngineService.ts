/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { eventLedgerInstance } from './EventLedgerService';
import { capabilityRegistryInstance, RouteResolution } from './CapabilityRegistryService';
import { PolicyEngineService, PolicyReport } from './PolicyEngineService';

export interface TaskDirective {
  id: string;
  title: string;
  intent: string;
  status: 'PENDING' | 'PLANNED' | 'EXECUTING' | 'VERIFIED' | 'FAILED';
}

export interface ExecutionContract {
  taskId: string;
  resolvedCapabilityId: string;
  estimatedCost: number;
  safetyClearance: boolean;
  timestamp: string;
}

export interface EngineResult {
  success: boolean;
  logs: string[];
  contract?: ExecutionContract;
  error?: string;
}

export class ExecutionEngineService {
  private activeDirectives: TaskDirective[] = [];
  private activeLogs: string[] = [];

  /**
   * Dispatches and processes a natural language intent directive.
   * Walks strictly through: Directives -> Planner -> Capability Resolution -> Safety Audit -> Commit Ledger -> Telemetry
   */
  public async executeDirective(
    title: string,
    intent: string,
    systemMetrics: {
      aggression: number;
      caution: number;
      activeThreads: number;
      confidence: number;
      operatingState: 'SHIP' | 'FREEZE' | 'EXPAND';
      metabolicCost: number;
    }
  ): Promise<EngineResult> {
    const logs: string[] = [];
    const taskId = `TK-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    logs.push(`[ENGINE] Initialized task context: ${taskId} (${title})`);
    
    // 1. Planner Phase
    logs.push(`[PLANNER] Analyzing directive inputs for intent: "${intent}"`);
    
    // 2. Capability Resolution Phase
    const resolution: RouteResolution | null = capabilityRegistryInstance.resolveTask(intent);
    if (!resolution) {
      logs.push(`[ERROR] Unable to resolve suitable capability for task ${taskId}`);
      return { success: false, logs, error: 'No matching capability found.' };
    }
    
    const cap = resolution.capability;
    logs.push(`[RESOLVER] Capability match identified: [${cap.id}] ${cap.name} (Match Confidence: ${Math.round(resolution.confidence * 100)}%)`);
    logs.push(`[RESOLVER] Verification contract inputs: [${cap.inputs.join(', ')}]. Output schemas expected: [${cap.outputs.join(', ')}].`);

    // 3. Governance Policy Core Pass
    const policyReport: PolicyReport = PolicyEngineService.evaluate({
      ...systemMetrics,
      metabolicCost: systemMetrics.metabolicCost + resolution.cost,
      activeThreads: systemMetrics.activeThreads + 1
    });

    logs.push(`[GOVERNOR] Running policy audit. System Compliance Score: ${policyReport.score}%`);
    if (policyReport.score < 55) {
      logs.push(`[ABORT] Policy Engine vetoed task execution. Compliance score is below safety threshold (55%).`);
      eventLedgerInstance.append('TASK_ABORTED', {
        taskId,
        capabilityId: cap.id,
        reason: 'GOVERNANCE_VETO_COMPLIANCE_LOW'
      });
      return { success: false, logs, error: 'Task aborted due to governance policy violation.' };
    }

    // 4. Execution & Verification Phase
    logs.push(`[EXECUTION] Deploying computational threads on resolved executable module: ${cap.name}`);
    
    let execResult: Record<string, any> = {};
    try {
      // Execute the capability with input payloads constructed from the task details
      execResult = await cap.execute({
        natural_prompt: intent,
        url: intent.match(/https?:\/\/[^\s]+/) ? intent.match(/https?:\/\/[^\s]+/)?.[0] : undefined,
        multiplier_history: [1.5, 2.1, 1.8, 2.5],
        source_code: `// Task context ${taskId}\nfunction execute() {}`
      });
      logs.push(`[EXECUTION] Execution completed. Output keys generated: [${Object.keys(execResult).join(', ')}]`);
    } catch (err: any) {
      logs.push(`[ERROR] Execution failure in ${cap.name}: ${err.message || err}`);
      return { success: false, logs, error: `Capability execution crashed: ${err.message}` };
    }
    
    // Verify outputs using the capability's verification rules
    logs.push(`[VERIFICATION] Verifying output integrity matching schemas: [${cap.outputs.join(', ')}]...`);
    const isVerified = cap.verify(execResult);
    
    if (!isVerified) {
      logs.push(`[VERIFICATION] ✗ Output verification failure. Schemas mismatched.`);
      return { success: false, logs, error: 'Verification failed.' };
    }
    
    logs.push(`[VERIFICATION] ✓ Verification signature matched. Executed block matches target schemas perfectly.`);

    const contract: ExecutionContract = {
      taskId,
      resolvedCapabilityId: cap.id,
      estimatedCost: resolution.cost,
      safetyClearance: true,
      timestamp: new Date().toLocaleTimeString()
    };

    // 5. Commit Ledger Block
    eventLedgerInstance.append('TASK_COMMIT', {
      taskId,
      title,
      capabilityId: cap.id,
      cost: resolution.cost,
      confidence: resolution.confidence,
      policyScore: policyReport.score
    });

    logs.push(`[LEDGER] Execution snapshot appended to block ledger safely.`);

    return {
      success: true,
      logs,
      contract
    };
  }
}

export const executionEngineInstance = new ExecutionEngineService();
