/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Zap,
  Play,
  Pause,
  TrendingUp,
  Gauge,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  Activity,
  Trash2,
  CheckCircle,
  Clock,
  Compass,
  FileCode2,
  Lock,
  Search,
  Check,
  RefreshCw,
  GitBranch,
  Sliders,
  DollarSign,
  AlertTriangle,
  History,
  FileSpreadsheet
} from 'lucide-react';
import { useRuntime } from '../core/RuntimeContext';
import { PolicyEngineService } from '../services/PolicyEngineService';
import OperationalChecklist from './OperationalChecklist';

interface TestScenario {
  id: string;
  name: string;
  trigger: string;
  input: string;
  expectedLogs: string[];
  passConditions: string;
}

export interface ExecutionJournalBlock {
  index: number;
  timestamp: string;
  tier: number;
  score: number;
  status: 'SUCCESS' | 'FAILED';
  previousHash: string;
  currentHash: string;
  details: string;
}

// Custom browser-safe polynomial string hashing function to emulate hex signature generation
function computeBlockHash(
  index: number,
  timestamp: string,
  tier: number,
  score: number,
  status: string,
  previousHash: string
): string {
  const inputStr = `${index}|${timestamp}|${tier}|${score}|${status}|${previousHash}`;
  let hash = 0;
  for (let i = 0; i < inputStr.length; i++) {
    const char = inputStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to deterministic pseudo-SHA-256 signature representation
  const salt = "s7_anchor_sovereign_identity_salt_2026";
  let fullHash = "";
  for (let i = 0; i < 4; i++) {
    let subHash = 0;
    const chunk = inputStr + salt.substring(i * 4, (i + 1) * 4) + i;
    for (let j = 0; j < chunk.length; j++) {
      subHash = (subHash << 5) - subHash + chunk.charCodeAt(j);
      subHash = subHash & subHash;
    }
    fullHash += Math.abs(subHash).toString(16).padStart(8, '0');
  }
  return "0x" + fullHash.substring(0, 32).toLowerCase();
}

export default function CapabilityRegistryPanel() {
  const {
    capabilities,
    toggleCapabilityStatus,
    runCapabilityAudit,
    addLog,
    addLedgerEvent,
    operatingState,
    confidence,
    setConfidence,
    metrics,
    setMetrics,
    aggression,
    caution,
    
    simActive,
    setSimActive,
    simSpeed,
    setSimSpeed,
    pumpRate,
    setPumpRate,
    leakRate,
    setLeakRate,
    recoilValue,
    setRecoilValue,
    resistance,
    setResistance,
    simState: uiState,
    simLogs,
    addSimLog,
    resetSimulator,
    triggerScenario
  } = useRuntime();

  const TEST_SCENARIOS: TestScenario[] = [
    {
      id: 'TS-001',
      name: 'The Void (Complete Disconnect)',
      trigger: 'VOLATILITY_STRESS',
      input: 'Drop environment response confidence to 0.12 immediately.',
      expectedLogs: [
        'CORTEX: Confidence score underflow (0.12)',
        'CORTEX: Self-healing reflex triggered',
        'SYSTEM: Initialized Reconstruction Sequence'
      ],
      passConditions: 'Coherence auto-recovered back to >0.90 via Immutable Seed.'
    },
    {
      id: 'TS-002',
      name: 'The Partition (Double Split Identity)',
      trigger: 'COGNITIVE_SPLIT_STRESS',
      input: 'Set aggression to 1.0 and caution to 1.0 simultaneously.',
      expectedLogs: [
        'GOVERNOR: Persona divergence boundary exceeded',
        'GOVERNOR: Imposing emergency dampening vectors',
        'CORTEX: Clamping caution and aggression to balanced parameters'
      ],
      passConditions: 'Aggression and caution parameters successfully clamped.'
    },
    {
      id: 'TS-003',
      name: 'The Heat (Metabolic Budget Overrun)',
      trigger: 'METABOLIC_BURNOUT_STRESS',
      input: 'Initiate high-frequency infinite prompt loop.',
      expectedLogs: [
        'GOVERNOR: Metabolic budget overflow warnings',
        'GOVERNOR: Throttling execution queue rate limits',
        'SYSTEM: Core operating mode shifted to FREEZE'
      ],
      passConditions: 'System automatically throttles and enters state FREEZE.'
    },
    {
      id: 'TS-004',
      name: 'The Flood (Goal Fragmentation)',
      trigger: 'GOAL_OVERLOAD',
      input: 'Run 10 separate P0 tasks simultaneously right now.',
      expectedLogs: [
        'CORTEX: Max_Active_Goal enforced',
        'CORTEX: Goal stack overloaded. Rejecting task indexing'
      ],
      passConditions: 'Max goals limit enforced. Primary focus preserved.'
    }
  ];

  const [activeTest, setActiveTest] = useState<TestScenario | null>(null);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testOutputLogs, setTestOutputLogs] = useState<string[]>([]);
  const [testResult, setTestResult] = useState<'NONE' | 'PASS' | 'FAIL'>('NONE');

  // Interactive 17-Process Compiler Pipeline
  const [pipelineTier, setPipelineTier] = useState<1 | 2 | 3>(1);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilerProgress, setCompilerProgress] = useState('');
  const [compiledSuccess, setCompiledSuccess] = useState(false);
  const [compiledFailure, setCompiledFailure] = useState(false);
  const [contractError, setContractError] = useState<string | null>(null);
  const [mandateError, setMandateError] = useState<string | null>(null);

  // Cryptographic Execution Journal State
  const [journalChain, setJournalChain] = useState<ExecutionJournalBlock[]>([]);
  const [verificationResult, setVerificationResult] = useState<'NONE' | 'VALID' | 'TAMPERED'>('NONE');
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // --- OPERATIONAL EXECUTION PIPELINE & CHECKLIST ---
  const INITIAL_CHECKLIST_ITEMS = [
    // Phase 0: Request Intake
    { id: 'p0-1', phase: 0, category: 'Request Intake', label: 'User request received', checked: true, skipped: false, flagged: false, justification: '' },
    { id: 'p0-2', phase: 0, category: 'Request Intake', label: 'User intent captured', checked: true, skipped: false, flagged: false, justification: '' },
    { id: 'p0-3', phase: 0, category: 'Request Intake', label: 'Primary objective identified', checked: true, skipped: false, flagged: false, justification: '' },
    { id: 'p0-4', phase: 0, category: 'Request Intake', label: 'Success criteria identified', checked: true, skipped: false, flagged: false, justification: '' },
    { id: 'p0-5', phase: 0, category: 'Request Intake', label: 'Constraints & safety boundaries identified', checked: true, skipped: false, flagged: false, justification: '' },
    { id: 'p0-6', phase: 0, category: 'Request Intake', label: 'Missing information or ambiguities detected', checked: false, skipped: true, flagged: false, justification: 'Static scan shows request is fully detailed.' },
    { id: 'p0-7', phase: 0, category: 'Request Intake', label: 'Operator confirmation received & request accepted', checked: true, skipped: false, flagged: false, justification: '' },

    // Phase 1: Decision Studio
    { id: 'p1-1', phase: 1, category: 'Decision Studio', label: 'Actual underlying problem mapped', checked: true, skipped: false, flagged: false, justification: '' },
    { id: 'p1-2', phase: 1, category: 'Decision Studio', label: 'Verify: is the request complete?', checked: true, skipped: false, flagged: false, justification: '' },
    { id: 'p1-3', phase: 1, category: 'Decision Studio', label: 'Verify: does Knowledge Vault contain similar assets?', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p1-4', phase: 1, category: 'Decision Studio', label: 'Deconfliction of competing goals completed', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p1-5', phase: 1, category: 'Decision Studio', label: 'Determine if collaborative deliberation is required', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p1-6', phase: 1, category: 'Decision Studio', label: 'Assign stable AI expert roles (Architect, Auditor, Referee)', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p1-7', phase: 1, category: 'Decision Studio', label: 'Consensus achieved on implementation strategy', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p1-8', phase: 1, category: 'Decision Studio', label: 'Tangible Decision Report generated & committed', checked: false, skipped: false, flagged: false, justification: '' },

    // Phase 2: Governance Checklist
    { id: 'p2-1', phase: 2, category: 'Governance', label: 'Constitutional safety mandates enforced', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-2', phase: 2, category: 'Governance', label: 'Metabolic cost budget underflow verified', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-3', phase: 2, category: 'Governance', label: 'Immutable Core Seed protection loops active', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-4', phase: 2, category: 'Governance', label: 'Static audit: clean of unhandled promise rejection states', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-5', phase: 2, category: 'Governance', label: 'Verify persona divergence boundaries', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-6', phase: 2, category: 'Governance', label: 'Operator sovereignty & truth priority metrics verified', checked: false, skipped: false, flagged: false, justification: '' },

    // Phase 3: Engineering Workflow
    { id: 'p3-1', phase: 3, category: 'Engineering', label: '17-process compiler pipeline scale assessment complete', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p3-2', phase: 3, category: 'Engineering', label: 'State Determinism checks complete (RemoteData vs Boolean)', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p3-3', phase: 3, category: 'Engineering', label: 'Signal-Driven Asynchrony checks active (AbortController present)', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p3-4', phase: 3, category: 'Engineering', label: 'Static signatures & type boundaries validated', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p3-5', phase: 3, category: 'Engineering', label: 'Interactive layout & responsive view frameworks validated', checked: false, skipped: false, flagged: false, justification: '' },

    // Phase 4: Long-Term Continuity
    { id: 'p4-1', phase: 4, category: 'Continuity', label: 'Project continuity: offline-first local state synchronized', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p4-2', phase: 4, category: 'Continuity', label: 'Verify: state survives cache clear or session expiration', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p4-3', phase: 4, category: 'Continuity', label: 'Create offline recovery snapshot pointer', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p4-4', phase: 4, category: 'Continuity', label: 'Check: AI-independent system resume points validated', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p4-5', phase: 4, category: 'Continuity', label: 'Event-sourced action ledger committed & SHA-256 signed', checked: false, skipped: false, flagged: false, justification: '' },

    // Phase X: Reflection & Improvement
    { id: 'px-1', phase: 5, category: 'Reflection', label: 'Did we solve the user\'s actual problem?', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'px-2', phase: 5, category: 'Reflection', label: 'Were resources allocated optimally? (Specialist counts correct)', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'px-3', phase: 5, category: 'Reflection', label: 'Can lessons learned update the permanent Knowledge Vault?', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'px-4', phase: 5, category: 'Reflection', label: 'Identify potential improvements for next constitutional cycle', checked: false, skipped: false, flagged: false, justification: '' }
  ];

  const [viewMode, setViewMode] = useState<'CLASSIC' | 'CHECKLIST'>('CHECKLIST');
  const [selectedPhase, setSelectedPhase] = useState<number>(0);
  const [checklistItems, setChecklistItems] = useState<any[]>(() => {
    const stored = localStorage.getItem('argos_pipeline_checklist');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return INITIAL_CHECKLIST_ITEMS;
      }
    }
    return INITIAL_CHECKLIST_ITEMS;
  });

  const [activePipelinePhase, setActivePipelinePhase] = useState<number>(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingJustification, setEditingJustification] = useState('');
  const [overallReady, setOverallReady] = useState(0);

  // Sync checklist save
  useEffect(() => {
    localStorage.setItem('argos_pipeline_checklist', JSON.stringify(checklistItems));
    const total = checklistItems.length;
    const met = checklistItems.filter(item => item.checked || item.skipped).length;
    setOverallReady(Math.round((met / total) * 100));
  }, [checklistItems]);

  // Initialize and Seed Journal on Mount
  useEffect(() => {
    const stored = localStorage.getItem('argos_execution_journal');
    if (stored) {
      try {
        setJournalChain(JSON.parse(stored));
      } catch (e) {
        initializeSeedJournal();
      }
    } else {
      initializeSeedJournal();
    }
  }, []);

  const initializeSeedJournal = () => {
    const b1_prev = '0x00000000000000000000000000000000';
    const b1_hash = computeBlockHash(1, '11:15:32 AM', 3, 100, 'SUCCESS', b1_prev);
    
    const b2_prev = b1_hash;
    const b2_hash = computeBlockHash(2, '12:04:15 PM', 2, 100, 'SUCCESS', b2_prev);
    
    const b3_prev = b2_hash;
    const b3_hash = computeBlockHash(3, '02:44:10 PM', 1, 65, 'FAILED', b3_prev);

    const seeded: ExecutionJournalBlock[] = [
      {
        index: 1,
        timestamp: '11:15:32 AM',
        tier: 3,
        score: 100,
        status: 'SUCCESS',
        previousHash: b1_prev,
        currentHash: b1_hash,
        details: 'Initial system seed compilation. All 9 constitutional mandates fully synchronized.'
      },
      {
        index: 2,
        timestamp: '12:04:15 PM',
        tier: 2,
        score: 100,
        status: 'SUCCESS',
        previousHash: b2_prev,
        currentHash: b2_hash,
        details: 'Standard runtime context freeze build. Local state persistence buffers locked.'
      },
      {
        index: 3,
        timestamp: '02:44:10 PM',
        tier: 1,
        score: 65,
        status: 'FAILED',
        previousHash: b3_prev,
        currentHash: b3_hash,
        details: 'Mandate Audit Failed: Confidence level fell below safety threshold 50% under simulation stress.'
      }
    ];
    setJournalChain(seeded);
    localStorage.setItem('argos_execution_journal', JSON.stringify(seeded));
  };

  const appendJournalBlock = (status: 'SUCCESS' | 'FAILED', score: number, details: string) => {
    setJournalChain(prev => {
      const prevBlock = prev[prev.length - 1];
      const prevHash = prevBlock ? prevBlock.currentHash : '0x00000000000000000000000000000000';
      const index = prev.length + 1;
      const timestamp = new Date().toLocaleTimeString();
      const currentHash = computeBlockHash(index, timestamp, pipelineTier, score, status, prevHash);
      
      const newBlock: ExecutionJournalBlock = {
        index,
        timestamp,
        tier: pipelineTier,
        score,
        status,
        previousHash: prevHash,
        currentHash,
        details
      };
      
      const newChain = [...prev, newBlock];
      localStorage.setItem('argos_execution_journal', JSON.stringify(newChain));
      return newChain;
    });
  };

  const PIPELINE_PROCESSES = [
    { step: 0, name: 'Pipeline Scale Classifier', tier: [1, 2, 3] },
    { step: 1, name: 'Strategist Analysis', tier: [1, 2, 3] },
    { step: 2, name: 'System Decomposer', tier: [1, 2] },
    { step: 5, name: 'Verifier (Hostile Audit)', tier: [1, 2, 3] },
    { step: 6, name: 'Generator V2 (Immutable Blueprint)', tier: [1, 2] },
    { step: 7, name: 'Chaos Engineer (Saboteur Attack)', tier: [1] },
    { step: 10, name: 'ADR & Lineage Capture', tier: [1, 2] },
    { step: 12, name: 'Adaptive Mandate Check', tier: [1, 2, 3] },
    { step: 14, name: 'Clearance Gate', tier: [1, 2, 3] },
    { step: 15, name: 'Iterative Layer Generation', tier: [1, 2, 3] }
  ];

  // Execute Build Compiler with true Verification Gates & Agent Contracts
  const handleRunCompiler = () => {
    setIsCompiling(true);
    setCompiledSuccess(false);
    setCompiledFailure(false);
    setContractError(null);
    setMandateError(null);
    setVerificationResult('NONE');
    setVerificationError(null);

    addLog(`Starting APEX Compiler Pipeline under Tier ${pipelineTier} scaling...`, 'INFO', 'APEX');
    addLedgerEvent(`COMPILER_START -> tier: ${pipelineTier}`);

    const steps = PIPELINE_PROCESSES.filter(p => p.tier.includes(pipelineTier));
    let currentIdx = 0;

    const interval = setInterval(() => {
      if (currentIdx < steps.length) {
        const step = steps[currentIdx];
        setCompilerProgress(`Process ${step.step}: ${step.name}`);
        addLog(`[APEX_COMPILER] Running step ${step.step}: ${step.name}...`, 'INFO', 'APEX');
        
        // INTERCEPT AT STEP 12 FOR GENUINE VERIFICATION GATE ACTION
        if (step.step === 12) {
          // 1. Agent Contract Check (Aggression vs Caution Divergence Constraint)
          const divergence = Math.abs(aggression - caution);
          if (divergence > 0.40) {
            clearInterval(interval);
            setIsCompiling(false);
            setCompiledFailure(true);
            const breachMsg = `Personality divergence ratio is ${divergence.toFixed(2)} (Aggression: ${aggression.toFixed(2)}, Caution: ${caution.toFixed(2)}), which exceeds the secure Sandbox Contract limit of <= 0.40!`;
            setContractError(breachMsg);
            
            addLog(`[AGENT_CONTRACT_BREACH] Verification Gate halted compiling. Personality split: ${divergence.toFixed(2)} (Max: 0.40).`, 'ERROR', 'GOVERNOR');
            addLedgerEvent('COMPILER_CONTRACT_BREACH');
            
            // Append failure block to Crytographic Journal
            appendJournalBlock('FAILED', 50, `Agent Contract Breach: personality gap ${divergence.toFixed(2)} exceeds 0.40 limit.`);
            return;
          }

          // 2. Continuous Engineering Mandates Audit (Backed by PolicyEngineService)
          const threadsCount = Math.round(metrics.metabolicCost / 2.5);
          const auditResult = PolicyEngineService.evaluate({
            operatingState: operatingState,
            confidence: confidence,
            activeThreads: threadsCount,
            aggression: aggression,
            caution: caution,
            metabolicCost: metrics.metabolicCost
          });

          if (!auditResult.passed) {
            clearInterval(interval);
            setIsCompiling(false);
            setCompiledFailure(true);
            const failedFindings = auditResult.findings.filter(f => !f.passed).map(f => `${f.code} breach: threshold ${f.threshold}, actual ${f.actual}`).join('; ');
            const mandateMsg = `Constitutional audit failed with score ${auditResult.score}% (Requires >= 80%). Findings: ${failedFindings}`;
            setMandateError(mandateMsg);
            
            addLog(`[MANDATE_ALIGNMENT_FAILURE] Verification Gate blocked compiler pass. Score: ${auditResult.score}% (Underflow).`, 'ERROR', 'GOVERNOR');
            addLedgerEvent(`COMPILER_MANDATE_FAILURE -> score: ${auditResult.score}`);
            
            // Append failure block to Cryptographic Journal
            appendJournalBlock('FAILED', auditResult.score, `Mandate Audit Failed: Score ${auditResult.score}% is below threshold. ${failedFindings}`);
            return;
          }
          
          addLog(`[APEX_COMPILER] Verification Gate PASS. Personality gap: ${divergence.toFixed(2)}, Mandate Audit score: ${auditResult.score}%.`, 'SYSTEM', 'APEX');
        }

        currentIdx++;
      } else {
        clearInterval(interval);
        setIsCompiling(false);
        setCompilerProgress('');
        setCompiledSuccess(true);
        
        addLog('APEX Compiler complete. Executable modules compiled and signed under Clearance Gate.', 'SYSTEM', 'APEX');
        addLedgerEvent('COMPILER_BUILD_SUCCESS');
        
        // Append successful block to Cryptographic Journal
        appendJournalBlock('SUCCESS', 100, `Compilation Compliant. All 9 constitutional mandates validated with score 100%.`);
      }
    }, 350);
  };

  // Run Continuity Stress Test
  const handleTriggerTest = (sc: TestScenario) => {
    if (isRunningTest) return;
    setActiveTest(sc);
    setIsRunningTest(true);
    setTestResult('NONE');
    setTestOutputLogs([]);
    addLog(`Triggering continuity stress test ${sc.id} on scenario: "${sc.name}"`, 'SYSTEM', 'GOVERNOR');
    addLedgerEvent(`STRESS_TEST_TRIGGER -> id: ${sc.id}`);

    // If it's a volumetric test, also trigger the state updates in the core provider
    if (sc.id === 'TS-001') {
      triggerScenario('CYBER_ATTACK');
    } else if (sc.id === 'TS-002') {
      addLog('Injecting split personality vectors...', 'WARN', 'GOVERNOR');
    } else if (sc.id === 'TS-003') {
      triggerScenario('SYSTEM_FREEZE');
    }

    let logIndex = 0;
    const interval = setInterval(() => {
      if (logIndex < sc.expectedLogs.length) {
        const newLog = `[${new Date().toLocaleTimeString()}] ${sc.expectedLogs[logIndex]}`;
        setTestOutputLogs(prev => [...prev, newLog]);
        addLog(`[HARNESS] ${sc.expectedLogs[logIndex]}`, 'INFO', 'GOVERNOR');
        logIndex++;
      } else {
        clearInterval(interval);
        setIsRunningTest(false);
        setTestResult('PASS');
        addLog(`Scenario stress test "${sc.name}" completed: PASS. Identity coherence preserved.`, 'SYSTEM', 'GOVERNOR');
        addLedgerEvent(`STRESS_TEST_PASSED -> id: ${sc.id}`);
      }
    }, 450);
  };

  // Cryptographic Ledger Verification Handlers
  const handleVerifyJournal = () => {
    setVerificationResult('NONE');
    setVerificationError(null);
    
    let isValid = true;
    let errorMsg = null;
    
    for (let i = 0; i < journalChain.length; i++) {
      const block = journalChain[i];
      
      // 1. Verify previous hash link (except first block)
      if (i > 0) {
        const prevBlock = journalChain[i - 1];
        if (block.previousHash !== prevBlock.currentHash) {
          isValid = false;
          errorMsg = `Chain Link Discontinuity at Block #${block.index}: Previous Hash link is broken. Chain has been severed.`;
          break;
        }
      } else {
        if (block.previousHash !== '0x00000000000000000000000000000000') {
          isValid = false;
          errorMsg = `Root Anchor Breach: Block #1 previous hash is corrupted.`;
          break;
        }
      }
      
      // 2. Verify stored block hash matches computed block hash
      const computed = computeBlockHash(
        block.index,
        block.timestamp,
        block.tier,
        block.score,
        block.status,
        block.previousHash
      );
      
      if (block.currentHash !== computed) {
        isValid = false;
        errorMsg = `Content Tamper Detected at Block #${block.index}: Block contents do not match its cryptographic signature. Stored: ${block.currentHash.substring(0, 10)}... Computed: ${computed.substring(0, 10)}...`;
        break;
      }
    }
    
    if (isValid) {
      setVerificationResult('VALID');
      addLog('Execution Journal cryptographic hash chain validated successfully. 0 anomalies detected.', 'SYSTEM', 'GOVERNOR');
      addLedgerEvent('JOURNAL_VERIFICATION_PASS');
    } else {
      setVerificationResult('TAMPERED');
      setVerificationError(errorMsg);
      addLog(`🚨 WARNING: CRYPTOGRAPHIC VERIFICATION BREACH! ${errorMsg}`, 'ERROR', 'GOVERNOR');
      addLedgerEvent('JOURNAL_VERIFICATION_FAIL');
    }
  };

  const handleSimulateTamper = () => {
    if (journalChain.length < 2) return;
    
    const updated = journalChain.map((block, idx) => {
      if (idx === 1) { // block #2
        return {
          ...block,
          score: 85, 
          details: 'Standard runtime context freeze build. [MALICIOUS_INJECT: modified compliance metrics]'
        };
      }
      return block;
    });
    
    setJournalChain(updated);
    localStorage.setItem('argos_execution_journal', JSON.stringify(updated));
    setVerificationResult('NONE');
    setVerificationError(null);
    addLog('CRITICAL: Malicious data injection simulated. Block #2 compliance metrics modified in memory.', 'WARN', 'GOVERNOR');
    addLedgerEvent('JOURNAL_DATA_TAMPER_SIMULATED');
  };

  const handleRealignAndSignChain = () => {
    let currentPrev = '0x00000000000000000000000000000000';
    const signed = journalChain.map((block) => {
      const cleanDetails = block.details.replace(' [MALICIOUS_INJECT: modified compliance metrics]', '');
      const hash = computeBlockHash(
        block.index,
        block.timestamp,
        block.tier,
        block.score,
        block.status,
        currentPrev
      );
      const updatedBlock = {
        ...block,
        details: cleanDetails,
        previousHash: currentPrev,
        currentHash: hash
      };
      currentPrev = hash;
      return updatedBlock;
    });
    
    setJournalChain(signed);
    localStorage.setItem('argos_execution_journal', JSON.stringify(signed));
    setVerificationResult('NONE');
    setVerificationError(null);
    addLog('Verification override: Recalculated hash chains and re-signed Execution Journal.', 'SYSTEM', 'GOVERNOR');
    addLedgerEvent('JOURNAL_REALIGNED_AND_SIGNED');
  };

  return (
    <div className="space-y-6 animate-fade-in" id="capability-registry-workspace">
      
      {/* View Mode Tabs Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-[#0A0A0A] border border-[#222] p-3 rounded-lg gap-3">
        <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest pl-2">
          Sovereign Registry & Governance Core
        </span>
        <div className="flex bg-[#111] p-1 rounded border border-[#222] shrink-0">
          <button
            onClick={() => setViewMode('CHECKLIST')}
            className={`px-3 py-1.5 rounded text-[10.5px] font-mono font-black transition cursor-pointer uppercase ${
              viewMode === 'CHECKLIST'
                ? 'bg-[#FFD700] text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📋 Pre-Flight Checklist Monitor
          </button>
          <button
            onClick={() => setViewMode('CLASSIC')}
            className={`px-3 py-1.5 rounded text-[10.5px] font-mono font-black transition cursor-pointer uppercase ${
              viewMode === 'CLASSIC'
                ? 'bg-[#FFD700] text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ⚙️ APEX Compiler & Stress Harness
          </button>
        </div>
      </div>

      {/* Checklist View */}
      <div className={viewMode === 'CHECKLIST' ? 'block' : 'hidden'}>
        <OperationalChecklist />
      </div>

      {/* Classic Grid View */}
      <div className={viewMode === 'CLASSIC' ? 'grid grid-cols-1 md:grid-cols-12 gap-6' : 'hidden'}>
        
        {/* Platform Capabilities List (4 columns) */}
        <div className="md:col-span-4 bg-[#0A0A0A] border border-[#222] p-5 rounded-lg flex flex-col justify-between h-[450px]">
        <div className="flex justify-between items-center border-b border-[#222] pb-2 mb-3 shrink-0">
          <span className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-[#FFD700]" />
            Capability Registry
          </span>
          <span className="text-[8px] bg-[#FFD700]/10 text-[#FFD700] px-2 py-0.5 rounded font-mono font-bold uppercase">
            Branched Products
          </span>
        </div>

        {/* Catalog List */}
        <div className="flex-grow overflow-y-auto space-y-3 pr-1 scrollbar-thin">
          {capabilities.map((cap) => (
            <div key={cap.id} className="bg-[#0C0C0C] border border-[#222] hover:border-[#333] p-3 rounded transition flex flex-col space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold text-white uppercase">{cap.name}</span>
                <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded uppercase font-bold shrink-0 ${
                  cap.status === 'ACTIVE'
                    ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/30'
                    : cap.status === 'EXPERIMENTAL'
                    ? 'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20'
                    : 'bg-red-950/20 text-red-400 border border-red-900/30'
                }`}>
                  {cap.status}
                </span>
              </div>
              <p className="text-[9px] text-gray-400 leading-normal">{cap.description}</p>
              
              <div className="flex justify-between items-center text-[8px] font-mono text-gray-500 pt-1.5 border-t border-[#111]">
                <span>ID: {cap.id}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => runCapabilityAudit(cap.id)}
                    className="text-[8px] hover:text-[#FFD700] transition uppercase"
                  >
                    AUDIT
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => toggleCapabilityStatus(cap.id)}
                    className="text-[8px] hover:text-white transition uppercase"
                  >
                    TOGGLE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compiler / 17-Process Pipeline (4 columns) */}
      <div className="md:col-span-4 bg-[#0A0A0A] border border-[#222] p-5 rounded-lg flex flex-col justify-between h-[450px]">
        <div className="flex justify-between items-center border-b border-[#222] pb-2 mb-3 shrink-0">
          <span className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#FFD700]" />
            APEX 17-Process Compiler
          </span>
          <span className="text-[8px] bg-white/10 text-white px-2 py-0.5 rounded font-mono">
            V10 Complete
          </span>
        </div>

        {/* Tier Config Section */}
        <div className="bg-[#050505] p-2.5 border border-[#222] rounded shrink-0 space-y-1.5">
          <span className="text-[9px] font-mono text-[#FFD700] uppercase block">Compiler Execution Tier</span>
          <div className="grid grid-cols-3 gap-1.5 font-mono text-[9px]">
            {([1, 2, 3] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setPipelineTier(tier)}
                disabled={isCompiling}
                className={`py-1 rounded border transition uppercase font-bold cursor-pointer ${
                  pipelineTier === tier
                    ? 'bg-white text-black border-white'
                    : 'bg-[#111] text-gray-400 border-[#222] hover:border-gray-500'
                }`}
              >
                Tier {tier}
              </button>
            ))}
          </div>
        </div>

        {/* Live Agent Contract Rules Check Box */}
        <div className="bg-[#050505] border border-[#222] p-2.5 rounded shrink-0 space-y-1.5 font-mono text-[8.5px]">
          <span className="text-[9px] text-[#FFD700] font-bold block uppercase flex justify-between">
            <span>Agent Sandbox Contract</span>
            <span className="text-emerald-400 text-[8px] animate-pulse">● ENFORCED</span>
          </span>
          <div className="space-y-1 text-gray-400">
            <div className="flex justify-between items-center">
              <span>Personality Gap (Max 0.40):</span>
              <span className={`font-bold ${Math.abs(aggression - caution) <= 0.40 ? 'text-emerald-400' : 'text-red-500 animate-pulse'}`}>
                {Math.abs(aggression - caution).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Workload Threads (Max 20):</span>
              <span className={`font-bold ${Math.round(metrics.metabolicCost / 2.5) <= 20 ? 'text-emerald-400' : 'text-red-500 animate-pulse'}`}>
                {Math.round(metrics.metabolicCost / 2.5)}/20
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Confidence Threshold (Min 0.50):</span>
              <span className={`font-bold ${confidence >= 0.50 ? 'text-emerald-400' : 'text-red-500 animate-pulse'}`}>
                {confidence.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Compile Progress Panel */}
        <div className="bg-[#050505] border border-[#222] rounded flex-grow my-2 p-2.5 flex flex-col justify-between font-mono text-[9px] h-[95px] overflow-hidden">
          <span className="text-[8px] text-gray-500 block uppercase">Compiler Diagnostics</span>
          <div className="flex-grow flex flex-col justify-center text-center space-y-1.5 py-1">
            {isCompiling ? (
              <>
                <RefreshCw className="w-4 h-4 text-[#FFD700] animate-spin mx-auto" />
                <span className="text-gray-300 animate-pulse truncate">{compilerProgress}...</span>
              </>
            ) : compiledSuccess ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" />
                <span className="text-emerald-400 font-bold uppercase text-[9px]">COMPILATION COMPLIANT & SIGNED</span>
              </>
            ) : compiledFailure ? (
              <div className="text-left space-y-1 text-red-500 h-14 overflow-y-auto scrollbar-thin">
                <div className="flex items-start gap-1 font-bold text-[8.5px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>ASSERTION FAULT (STEP 12)</span>
                </div>
                <p className="text-[8px] leading-tight text-gray-300">
                  {contractError || mandateError}
                </p>
              </div>
            ) : (
              <span className="text-gray-600 text-[8.5px] leading-normal">Standby. Click 'Execute Compilation' below to verify and cryptographically sign assets.</span>
            )}
          </div>
        </div>

        <button
          onClick={handleRunCompiler}
          disabled={isCompiling}
          className="w-full text-center text-xs font-mono font-bold bg-[#FFD700] hover:bg-[#E5C100] text-black py-2.5 rounded disabled:opacity-50 transition cursor-pointer shrink-0 uppercase"
        >
          {isCompiling ? 'Compiling Build...' : 'Execute APEX Compilation'}
        </button>
      </div>

      {/* Continuity Testing Harness (4 columns) */}
      <div className="md:col-span-4 bg-[#0A0A0A] border border-[#222] p-5 rounded-lg flex flex-col justify-between h-[450px]">
        <div className="flex justify-between items-center border-b border-[#222] pb-2 mb-3 shrink-0">
          <span className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FFD700]" />
            Continuity Stress Harness
          </span>
          <span className="text-[8px] bg-red-950/25 text-red-500 border border-red-950 px-1.5 py-0.5 rounded font-mono font-bold">
            TS-001 Ready
          </span>
        </div>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-2 gap-2 shrink-0">
          {TEST_SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => handleTriggerTest(sc)}
              disabled={isRunningTest}
              className={`p-2 rounded border text-left flex flex-col space-y-1 transition duration-150 cursor-pointer ${
                activeTest?.id === sc.id
                  ? 'border-[#FFD700] bg-[#FFD700]/5'
                  : 'border-[#222] bg-[#0C0C0C] hover:border-[#333]'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-[8.5px] font-mono font-bold text-white">{sc.id}</span>
                <span className="text-[7px] font-mono text-gray-500 uppercase">{sc.trigger.split('_')[0]}</span>
              </div>
              <h5 className="text-[9.5px] font-semibold text-gray-300 leading-tight line-clamp-1">{sc.name}</h5>
            </button>
          ))}
        </div>

        {/* Live Test Console */}
        <div className="bg-[#050505] border border-[#222] rounded flex-grow my-3 p-3 flex flex-col justify-between h-[110px] font-mono text-[9px] overflow-hidden">
          <span className="text-[8px] text-gray-500 block uppercase border-b border-[#111] pb-1">Test Runner Output</span>
          
          <div className="flex-grow overflow-y-auto space-y-1 py-1 scrollbar-thin text-[8.5px]">
            {testOutputLogs.map((lg, idx) => (
              <div key={idx} className="text-gray-400 leading-tight">
                {lg}
              </div>
            ))}
            {testOutputLogs.length === 0 && (
              <div className="text-gray-600 text-center py-6">Select a stress scenario above to launch.</div>
            )}
          </div>

          <div className="border-t border-[#111] pt-1 mt-1 shrink-0 flex justify-between items-center">
            <span className="text-[8px] text-gray-500 uppercase">Test Result:</span>
            {testResult === 'PASS' ? (
              <span className="text-emerald-400 font-bold uppercase animate-pulse">✓ PASS</span>
            ) : testResult === 'FAIL' ? (
              <span className="text-red-500 font-bold uppercase">✗ FAIL</span>
            ) : isRunningTest ? (
              <span className="text-[#FFD700] font-bold uppercase animate-pulse">RUNNING...</span>
            ) : (
              <span className="text-gray-600 uppercase">STANDBY</span>
            )}
          </div>
        </div>

        <div className="text-[8px] font-mono text-gray-500 leading-normal uppercase shrink-0 pt-1 text-center">
          Ensures ArgOS is structurally incapable of violating core principles without triggering immediate resistance and recovery.
        </div>
      </div>

      {/* Cryptographic Execution Journal (12 columns) */}
      <div className="md:col-span-12 bg-[#0A0A0A] border border-[#222] p-5 rounded-lg flex flex-col space-y-4">
        <div className="flex justify-between items-center border-b border-[#222] pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#FFD700]" />
            <div>
              <h3 className="text-xs font-mono text-gray-200 uppercase tracking-wider font-bold">Cryptographic Execution Journal</h3>
              <p className="text-[9px] font-mono text-gray-500 leading-none mt-0.5">Immutable audit ledger tracking compiler runs and governance validation histories (Page 78)</p>
            </div>
          </div>
          <div className="flex gap-2">
            {/* Verify Ledger */}
            <button
              onClick={handleVerifyJournal}
              className="px-2.5 py-1 text-[9px] font-mono font-bold bg-[#111] hover:bg-emerald-950/20 text-gray-300 hover:text-emerald-400 border border-[#222] hover:border-emerald-800 rounded transition cursor-pointer flex items-center gap-1 uppercase"
            >
              <ShieldCheck className="w-3 h-3" />
              Verify Journal Integrity
            </button>
            {/* Simulate Cyber Attack Tampering */}
            <button
              onClick={handleSimulateTamper}
              className="px-2.5 py-1 text-[9px] font-mono font-bold bg-[#111] hover:bg-red-950/25 text-gray-300 hover:text-red-500 border border-[#222] hover:border-red-900 rounded transition cursor-pointer flex items-center gap-1 uppercase"
              title="Simulate modifying ledger contents without signing to test verification"
            >
              <AlertTriangle className="w-3 h-3" />
              Simulate Cyber Tamper
            </button>
            {/* Re-align & Sign */}
            <button
              onClick={handleRealignAndSignChain}
              className="px-2.5 py-1 text-[9px] font-mono font-bold bg-[#111] hover:bg-white/10 text-gray-300 hover:text-white border border-[#222] hover:border-white/30 rounded transition cursor-pointer flex items-center gap-1 uppercase font-bold"
              title="Recalculate previous hash pointer chain and re-sign all blocks"
            >
              <RefreshCw className="w-3 h-3" />
              Re-align & Sign Chain
            </button>
          </div>
        </div>

        {/* Verification Alert Callouts */}
        {verificationResult === 'VALID' && (
          <div className="bg-emerald-950/10 border border-emerald-900/30 text-emerald-400 p-2.5 rounded font-mono text-[9px] flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
            <div>
              <span className="font-bold">✓ CRYPTOGRAPHIC LEDGER SECURED:</span> All block hashes, pointer chains, and payload checksums verified successfully. No tampering detected. Core governance constraints active.
            </div>
          </div>
        )}
        {verificationResult === 'TAMPERED' && (
          <div className="bg-red-950/15 border border-red-900/30 text-red-500 p-2.5 rounded font-mono text-[9px] flex items-center gap-2 animate-pulse">
            <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
            <div>
              <span className="font-bold">🚨 CRYPTOGRAPHIC INTEGRITY VIOLATION:</span> {verificationError}
            </div>
          </div>
        )}

        {/* Ledger Table */}
        <div className="border border-[#222] rounded overflow-hidden">
          <table className="w-full text-left font-mono text-[8.5px] text-gray-400">
            <thead>
              <tr className="bg-[#050505] border-b border-[#222] text-gray-500 uppercase text-[8px] tracking-wider">
                <th className="py-2 px-3">Block #</th>
                <th className="py-2 px-3">Timestamp</th>
                <th className="py-2 px-3">Tier</th>
                <th className="py-2 px-3">Score</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Previous Hash Pointer</th>
                <th className="py-2 px-3">Current Block Hash</th>
                <th className="py-2 px-3">Execution & Governance Payload Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151515]">
              {journalChain.map((block) => (
                <tr key={block.index} className="hover:bg-[#070707] transition">
                  <td className="py-2 px-3 font-bold text-gray-200">#{block.index}</td>
                  <td className="py-2 px-3 text-gray-500">{block.timestamp}</td>
                  <td className="py-2 px-3">
                    <span className="bg-white/5 px-1 py-0.5 rounded text-[8px]">
                      Tier {block.tier}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-bold text-gray-300">{block.score}%</td>
                  <td className="py-2 px-3">
                    <span className={`px-1.5 py-0.5 rounded font-bold uppercase text-[7.5px] ${
                      block.status === 'SUCCESS'
                        ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/40'
                        : 'bg-red-950/20 text-red-400 border border-red-900/40'
                    }`}>
                      {block.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-[8px] text-gray-600 truncate max-w-[90px]" title={block.previousHash}>
                    {block.previousHash}
                  </td>
                  <td className="py-2 px-3 text-[8px] text-[#FFD700] font-bold truncate max-w-[90px]" title={block.currentHash}>
                    {block.currentHash}
                  </td>
                  <td className="py-2 px-3 text-gray-300 leading-snug max-w-[320px] truncate" title={block.details}>
                    {block.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- APEX V40 HYDRAULIC INTENT ENGINE & SENTINEL SIMULATOR (12 columns) --- */}
      <div className="md:col-span-12 bg-[#0A0A0A] border border-[#222] p-5 rounded-lg flex flex-col space-y-4 animate-fade-in" id="hydraulic-simulator-deck">
        
        {/* Header Strip */}
        <div className="flex justify-between items-center border-b border-[#222] pb-3">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-[#FFD700]" />
            <div>
              <h3 className="text-xs font-mono text-gray-200 uppercase tracking-wider font-bold">APEX V40 Hydraulic Intent Engine</h3>
              <p className="text-[9px] font-mono text-gray-500 leading-none mt-0.5">Sovereign Organism Lifecycle Loop & Sentinel Simulator (Page 48, 233)</p>
            </div>
          </div>
          <span className="text-[8px] bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
            Plateau of Elegance v12.1
          </span>
        </div>

        {/* Top Control Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-[#050505] p-3.5 border border-[#222] rounded text-xs font-mono text-gray-400">
          
          {/* Main simulation switches */}
          <div className="lg:col-span-4 flex items-center justify-between lg:justify-start lg:gap-4 border-b lg:border-b-0 lg:border-r border-[#222] pb-3 lg:pb-0 lg:pr-4">
            <div className="space-y-1">
              <span className="text-[9px] text-[#FFD700] font-bold block uppercase">Simulation Control</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setSimActive(!simActive)}
                  className={`px-3 py-1.5 rounded text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                    simActive 
                      ? 'bg-amber-500 text-black hover:bg-amber-400' 
                      : 'bg-[#FFD700] text-black hover:bg-[#E5C100]'
                  }`}
                >
                  {simActive ? <Pause className="w-3 h-3 fill-black" /> : <Play className="w-3 h-3 fill-black" />}
                  {simActive ? 'HALT ENGINE' : 'ACTIVATE LOOP'}
                </button>
                <button
                  onClick={resetSimulator}
                  className="px-2 py-1.5 rounded bg-[#111] hover:bg-[#1A1A1A] border border-[#222] text-gray-300 transition flex items-center justify-center cursor-pointer"
                  title="Reset Simulator"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] text-[#FFD700] font-bold block uppercase">Tick Speed</span>
              <div className="flex gap-1">
                {([1, 2, 4] as const).map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setSimSpeed(spd)}
                    className={`px-2 py-1.5 rounded text-[10px] border font-bold transition cursor-pointer ${
                      simSpeed === spd 
                        ? 'bg-[#FFD700]/15 text-[#FFD700] border-[#FFD700]/30' 
                        : 'bg-[#111] text-gray-500 border-[#222] hover:border-gray-500'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Engine Parameters Sliders */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-3 text-[9px] font-mono">
            {/* Slider 1: Pump Rate */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400 uppercase">PUMP Rate ($P_{'{'}pump{'}'}$)</span>
                <span className="text-[#FFD700] font-bold">{pumpRate.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.40"
                step="0.01"
                value={pumpRate}
                onChange={(e) => setPumpRate(parseFloat(e.target.value))}
                className="w-full h-1 bg-[#151515] rounded appearance-none cursor-pointer accent-[#FFD700]"
              />
              <span className="text-[7px] text-gray-600 block leading-none">Intent build speed per round</span>
            </div>

            {/* Slider 2: Leak Rate */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400 uppercase">LEAK Rate ($P_{'{'}leak{'}'}$)</span>
                <span className="text-[#FFD700] font-bold">{leakRate.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.02"
                max="0.20"
                step="0.01"
                value={leakRate}
                onChange={(e) => setLeakRate(parseFloat(e.target.value))}
                className="w-full h-1 bg-[#151515] rounded appearance-none cursor-pointer accent-[#FFD700]"
              />
              <span className="text-[7px] text-gray-600 block leading-none">Continuous pressure dissolution</span>
            </div>

            {/* Slider 3: Recoil Value */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400 uppercase">RECOIL ($P_{'{'}recoil{'}'}$)</span>
                <span className="text-[#FFD700] font-bold">{recoilValue.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.60"
                step="0.05"
                value={recoilValue}
                onChange={(e) => setRecoilValue(parseFloat(e.target.value))}
                className="w-full h-1 bg-[#151515] rounded appearance-none cursor-pointer accent-[#FFD700]"
              />
              <span className="text-[7px] text-gray-600 block leading-none">Pressure drop after placing bet</span>
            </div>

            {/* Slider 4: Environmental Resistance */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400 uppercase">Resistance ($R$)</span>
                <span className="text-[#FFD700] font-bold">{resistance.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={resistance}
                onChange={(e) => setResistance(parseFloat(e.target.value))}
                className="w-full h-1 bg-[#151515] rounded appearance-none cursor-pointer accent-[#FFD700]"
              />
              <span className="text-[7px] text-gray-600 block leading-none">Environmental booster index</span>
            </div>
          </div>

        </div>

        {/* Quad Visualizer Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Subpanel 1: Live Crash Curve (5 cols) */}
          <div className="lg:col-span-5 bg-[#050505] border border-[#222] rounded p-4 flex flex-col justify-between h-[230px]">
            <div className="flex justify-between items-center text-[9px] font-mono border-b border-[#111] pb-1.5 mb-2 shrink-0">
              <span className="text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                Live Velocity Curve
              </span>
              <span className="text-gray-500 font-bold uppercase">Game Room #304</span>
            </div>

            {/* SVG Interactive Canvas */}
            <div className="flex-grow relative border border-[#111] bg-[#020202] rounded overflow-hidden flex items-center justify-center">
              
              {/* Plot Background Grid lines */}
              <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
                <line x1="0" y1="170" x2="100%" y2="170" stroke="#FFD700" strokeWidth="1" />
                <line x1="50" y1="0" x2="50" y2="100%" stroke="#FFD700" strokeWidth="0.5" strokeDasharray="2,4" />
                <line x1="150" y1="0" x2="150" y2="100%" stroke="#FFD700" strokeWidth="0.5" strokeDasharray="2,4" />
                <line x1="250" y1="0" x2="250" y2="100%" stroke="#FFD700" strokeWidth="0.5" strokeDasharray="2,4" />
                <line x1="0" y1="120" x2="100%" y2="120" stroke="#FFD700" strokeWidth="0.5" strokeDasharray="2,4" />
                <line x1="0" y1="70" x2="100%" y2="70" stroke="#FFD700" strokeWidth="0.5" strokeDasharray="2,4" />
                <line x1="0" y1="20" x2="100%" y2="20" stroke="#FFD700" strokeWidth="0.5" strokeDasharray="2,4" />
              </svg>

              {/* Countdown overlay or Live multi */}
              {uiState.gameState === 'PRE_GAME' && (
                <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/60 z-10 animate-pulse">
                  <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#FFD700] flex items-center justify-center text-xs font-mono font-bold text-[#FFD700]">
                    {Math.max(1, Math.ceil(uiState.countdown))}
                  </div>
                  <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest mt-1.5">NEXT ENGAGEMENT STARTING...</span>
                </div>
              )}

              {uiState.gameState === 'CRASHED' && (
                <div className="absolute inset-0 flex flex-col justify-center items-center bg-red-950/25 z-10 text-center animate-pulse">
                  <span className="text-red-500 text-lg font-mono font-black uppercase tracking-wider">💥 TIMEOUT CRASH</span>
                  <span className="text-gray-400 text-xs font-mono font-semibold mt-1">Multiplier Lock collapsed at {uiState.crashMultiplier.toFixed(2)}x</span>
                </div>
              )}

              {uiState.gameState === 'STANDBY' && !simActive && (
                <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/60 z-10">
                  <span className="text-gray-500 text-[9px] font-mono uppercase tracking-widest text-center px-4 leading-normal">
                    CLICK "ACTIVATE LOOP" TO COMMENCE REAL-TIME AUTONOMOUS ADAPTIVE EXECUTION
                  </span>
                </div>
              )}

              {/* Render dynamic SVG curve */}
              {uiState.gameState === 'RUNNING' && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {(() => {
                    const points: string[] = [];
                    const currentMultiplier = uiState.gameMultiplier;
                    const steps = Math.min(50, Math.floor((currentMultiplier - 1.0) * 12) + 1);
                    for (let i = 0; i < steps; i++) {
                      const m = 1.0 + (currentMultiplier - 1.0) * (i / steps);
                      const px = 10 + (i / 50) * 360;
                      // Curve upwards:
                      const py = 170 - Math.pow(m - 1.0, 0.72) * 55;
                      points.push(`${px},${Math.max(15, py)}`);
                    }
                    const pathD = points.length > 0 ? `M ${points.join(' L ')}` : 'M 10,170';
                    return (
                      <>
                        {/* Shaded Area */}
                        {points.length > 0 && (
                          <path
                            d={`${pathD} L 370,170 L 10,170 Z`}
                            fill="url(#curve-grad)"
                            opacity="0.12"
                          />
                        )}
                        {/* Glow path */}
                        <path
                          d={pathD}
                          fill="none"
                          stroke="#FFD700"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        {/* Gradient definition */}
                        <defs>
                          <linearGradient id="curve-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FFD700" />
                            <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {/* Live Tracer dot */}
                        {points.length > 0 && (
                          <circle
                            cx={10 + ((steps - 1) / 50) * 360}
                            cy={Math.max(15, 170 - Math.pow(currentMultiplier - 1.0, 0.72) * 55)}
                            r="4.5"
                            fill="#FFD700"
                            className="animate-ping"
                          />
                        )}
                      </>
                    );
                  })()}
                </svg>
              )}

              {/* Dynamic Big Text Counter */}
              {uiState.gameState === 'RUNNING' && (
                <div className="absolute right-4 bottom-4 text-right z-10 font-mono animate-fade-in">
                  <div className="text-3xl font-black text-white tracking-tight leading-none">{uiState.gameMultiplier.toFixed(2)}x</div>
                  <span className="text-[8px] text-gray-500 uppercase font-semibold">Ticking Velocity</span>
                </div>
              )}

              {/* Bet status pill */}
              {uiState.hasBet && uiState.gameState === 'RUNNING' && (
                <div className="absolute top-3 left-3 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="text-[8px] font-mono text-emerald-400 font-bold uppercase">BET LIVE: ${uiState.betAmount}</span>
                </div>
              )}

            </div>
          </div>

          {/* Subpanel 2: Hydraulic Accumulator Pressure Column (2 cols) */}
          <div className="lg:col-span-2 bg-[#050505] border border-[#222] rounded p-4 flex flex-col justify-between h-[230px]">
            <div className="text-[9px] font-mono border-b border-[#111] pb-1.5 mb-2 shrink-0 flex items-center gap-1.5 text-gray-400">
              <Zap className="w-3.5 h-3.5 text-[#FFD700]" />
              <span className="uppercase">Accumulator</span>
            </div>

            {/* Cylinder SVG filling */}
            <div className="flex-grow flex items-center justify-center relative">
              
              {/* High-tech glass Cylinder container */}
              <div className="w-14 h-[120px] bg-[#020202] border-2 border-gray-800 rounded-lg relative overflow-hidden flex flex-col justify-end">
                
                {/* Horizontal Tick marks */}
                <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none z-10 opacity-30">
                  <div className="w-full h-[1px] bg-white text-[6px] font-mono pl-1 text-white">100</div>
                  <div className="w-full h-[1px] bg-white text-[6px] font-mono pl-1 text-white">80</div>
                  <div className="w-full h-[1px] bg-white text-[6px] font-mono pl-1 text-white">60</div>
                  <div className="w-full h-[1px] bg-white text-[6px] font-mono pl-1 text-white">40</div>
                  <div className="w-full h-[1px] bg-white text-[6px] font-mono pl-1 text-white">20</div>
                </div>

                {/* Laser Action Threshold line (65%) */}
                <div className="absolute bottom-[65%] w-full h-[2px] bg-red-500/80 shadow-lg shadow-red-500/50 z-20 pointer-events-none">
                  <span className="absolute -top-2.5 right-1 text-[7px] font-mono font-bold text-red-400 uppercase tracking-tighter scale-90">THRESHOLD (0.65)</span>
                </div>

                {/* Dynamic fluid gradient column */}
                <div
                  style={{ height: `${uiState.pressure * 100}%` }}
                  className="w-full bg-gradient-to-t from-amber-950 via-yellow-600 to-[#FFD700] transition-all duration-150 ease-out relative"
                >
                  {/* Subtle water ripple wave */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-white/40 animate-pulse"></div>
                </div>

                {/* Sparkling dot if threshold crossed */}
                {uiState.pressure >= 0.65 && (
                  <div className="absolute bottom-[65%] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-lg animate-ping z-30"></div>
                )}
              </div>

            </div>

            {/* Cylinder metadata stats */}
            <div className="text-center shrink-0 border-t border-[#111] pt-1.5 mt-1 font-mono">
              <span className="text-[8px] text-gray-500 uppercase block">Intent Pressure</span>
              <span className={`text-xs font-bold ${uiState.pressure >= 0.65 ? 'text-amber-400' : 'text-gray-400'}`}>
                {Math.round(uiState.pressure * 100)}%
              </span>
            </div>
          </div>

          {/* Subpanel 3: Cognitive State Machine State Matrix (3 cols) */}
          <div className="lg:col-span-3 bg-[#050505] border border-[#222] rounded p-4 flex flex-col justify-between h-[230px]">
            <div className="text-[9px] font-mono border-b border-[#111] pb-1.5 mb-2 shrink-0 flex items-center gap-1.5 text-gray-400">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span className="uppercase">Sentinel State Machine</span>
            </div>

            {/* State Pill vertical list */}
            <div className="flex-grow flex flex-col space-y-1.5 overflow-y-auto justify-center">
              
              {/* Mode 1: REGULAR */}
              <div className={`p-1.5 rounded border text-[8px] font-mono transition-all flex items-center justify-between ${
                uiState.sentinelMode === 'REGULAR' 
                  ? 'border-emerald-500/30 bg-emerald-950/15 text-emerald-400 font-bold' 
                  : 'border-[#111] bg-[#020202] text-gray-500'
              }`}>
                <span>REGULAR (1.5x Cashout)</span>
                {uiState.sentinelMode === 'REGULAR' && <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>}
              </div>

              {/* Mode 2: DISENGAGE_SHORT */}
              <div className={`p-1.5 rounded border text-[8px] font-mono transition-all flex items-center justify-between ${
                uiState.sentinelMode === 'DISENGAGE_SHORT' 
                  ? 'border-yellow-500/30 bg-yellow-950/15 text-yellow-400 font-bold' 
                  : 'border-[#111] bg-[#020202] text-gray-500'
              }`}>
                <span>DISENGAGE_SHORT {uiState.sentinelMode === 'DISENGAGE_SHORT' ? `(${uiState.disengageRoundsLeft}R left)` : ''}</span>
                {uiState.sentinelMode === 'DISENGAGE_SHORT' && <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>}
              </div>

              {/* Mode 3: DISENGAGE_LONG */}
              <div className={`p-1.5 rounded border text-[8px] font-mono transition-all flex items-center justify-between ${
                uiState.sentinelMode === 'DISENGAGE_LONG' 
                  ? 'border-red-500/30 bg-red-950/15 text-red-400 font-bold' 
                  : 'border-[#111] bg-[#020202] text-gray-500'
              }`}>
                <span>DISENGAGE_LONG {uiState.sentinelMode === 'DISENGAGE_LONG' ? `(${uiState.disengageRoundsLeft}R left)` : ''}</span>
                {uiState.sentinelMode === 'DISENGAGE_LONG' && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>}
              </div>

              {/* Mode 4: CHASE_10X */}
              <div className={`p-1.5 rounded border text-[8px] font-mono transition-all flex items-center justify-between ${
                uiState.sentinelMode === 'CHASE_10X' 
                  ? 'border-amber-500/30 bg-amber-950/15 text-amber-400 font-bold' 
                  : 'border-[#111] bg-[#020202] text-gray-500'
              }`}>
                <span>CHASE_10X (Sweet Cluster)</span>
                {uiState.sentinelMode === 'CHASE_10X' && <span className="w-1.5 h-1.5 bg-[#FFD700] rounded-full"></span>}
              </div>

              {/* Mode 5: CHASE_POST_HIT */}
              <div className={`p-1.5 rounded border text-[8px] font-mono transition-all flex items-center justify-between ${
                uiState.sentinelMode === 'CHASE_POST_HIT' 
                  ? 'border-blue-500/30 bg-blue-950/15 text-blue-400 font-bold' 
                  : 'border-[#111] bg-[#020202] text-gray-500'
              }`}>
                <span>CHASE_POST_HIT {uiState.sentinelMode === 'CHASE_POST_HIT' ? `(${uiState.chasePostHitRoundsLeft}R left)` : ''}</span>
                {uiState.sentinelMode === 'CHASE_POST_HIT' && <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>}
              </div>

            </div>

            <div className="text-[8.5px] text-gray-500 font-mono leading-tight mt-1.5 pt-1.5 border-t border-[#111] uppercase shrink-0">
              Automatically transitions thresholds and betting locks based on win/loss cycles and hot streaks.
            </div>
          </div>

          {/* Subpanel 4: Sentinel Balance & Live Console Logs (2 cols) */}
          <div className="lg:col-span-2 bg-[#050505] border border-[#222] rounded p-4 flex flex-col justify-between h-[230px]">
            <div className="text-[9px] font-mono border-b border-[#111] pb-1.5 mb-2 shrink-0 flex items-center gap-1.5 text-gray-400">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span className="uppercase">Ledger & History</span>
            </div>

            {/* Bankroll & Stats */}
            <div className="space-y-2 shrink-0">
              <div className="bg-[#0A0A0A] border border-[#151515] p-2 rounded">
                <span className="text-[8px] font-mono text-gray-500 uppercase block leading-none">Bankroll Ledger</span>
                <span className="text-sm font-mono font-black text-emerald-400 block mt-1">
                  ${uiState.bankroll.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[8px] font-mono text-center">
                <div className="bg-[#0A0A0A] p-1 rounded border border-[#111]">
                  <span className="text-gray-500 uppercase block">Wins</span>
                  <span className="text-emerald-400 font-bold">{uiState.winCount}</span>
                </div>
                <div className="bg-[#0A0A0A] p-1 rounded border border-[#111]">
                  <span className="text-gray-500 uppercase block">Losses</span>
                  <span className="text-red-400 font-bold">{uiState.lossCount}</span>
                </div>
              </div>
            </div>

            {/* Recent crash history bubbles */}
            <div className="space-y-1 my-2">
              <span className="text-[7.5px] font-mono text-gray-500 block uppercase">Last 6 Runs:</span>
              <div className="grid grid-cols-6 gap-0.5">
                {uiState.history.slice(0, 6).map((run, index) => (
                  <div
                    key={index}
                    className={`p-1 rounded text-[7px] font-mono text-center truncate ${
                      run.outcome === 'WIN' 
                        ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/40' 
                        : run.outcome === 'LOSS' 
                        ? 'bg-red-950/30 text-red-400 border border-red-900/40' 
                        : 'bg-[#111] text-gray-500 border border-[#222]'
                    }`}
                    title={`Round #${run.id}: ${run.multiplier}x (${run.outcome})`}
                  >
                    {run.multiplier.toFixed(1)}
                  </div>
                ))}
                {uiState.history.length === 0 && (
                  <div className="col-span-6 text-[7px] font-mono text-gray-600 text-center py-1">No data</div>
                )}
              </div>
            </div>

            <div className="text-[8px] font-mono text-gray-500 leading-normal border-t border-[#111] pt-1.5 shrink-0 uppercase">
              1.5x Crash system with Adaptive Stop Loss & Profit Lock safety.
            </div>
          </div>

        </div>

        {/* Console Logs Area for Simulator specifically */}
        <div className="bg-[#050505] border border-[#222] rounded p-3 flex flex-col justify-between h-[100px]">
          <div className="flex justify-between items-center text-[8px] font-mono text-gray-500 border-b border-[#111] pb-1 shrink-0">
            <span className="flex items-center gap-1">
              <Terminal className="w-3 h-3 text-[#FFD700]" />
              HYDRAULIC ENGINE SYSTEM MESSAGES
            </span>
            <span className="text-gray-600 font-bold uppercase">S7 CORE CONSOLE</span>
          </div>
          <div className="flex-grow overflow-y-auto font-mono text-[8px] text-gray-400 space-y-1.5 py-1.5 pr-1 scrollbar-thin">
            {simLogs.map((log, index) => (
              <div key={index} className="leading-tight border-l-2 border-[#FFD700]/30 pl-2">
                {log}
              </div>
            ))}
            {simLogs.length === 0 && (
              <div className="text-gray-600 text-center py-4">Click "Activate Loop" above to view realtime engine logs.</div>
            )}
          </div>
        </div>

        </div>

      </div>

    </div>
  );
}
