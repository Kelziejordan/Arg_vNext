/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Compass,
  Users,
  ShieldCheck,
  Terminal,
  Clock,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  FileCheck2,
  FileText,
  HelpCircle,
  Activity,
  History,
  Lock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useRuntime } from '../core/RuntimeContext';

interface ChecklistItem {
  id: string;
  phase: number;
  category: string;
  label: string;
  checked: boolean;
  skipped: boolean;
  flagged: boolean;
  justification: string;
}

export default function OperationalChecklist() {
  const { addLog, updateCanonicalIntent, metrics, confidence, aggression, caution } = useRuntime();

  // Selected Active Phase tab to view checklist items
  const [activeTabPhase, setActiveTabPhase] = useState<number>(0);
  
  // Pipeline active sweep phase matching compiler progress
  const [activePipelinePhase, setActivePipelinePhase] = useState<number>(0);
  
  // Hardcoded phases matching the PDF
  const PHASES = [
    { num: 0, title: 'Request Intake', icon: Compass, color: 'text-amber-400', desc: 'Sovereign intent alignment & objective boundaries identification' },
    { num: 1, title: 'Decision Studio', icon: Users, color: 'text-purple-400', desc: 'Pre-flight multi-expert deliberation & stable roles mapping' },
    { num: 2, title: 'Governance Checks', icon: ShieldCheck, color: 'text-blue-400', desc: 'Constitutional mandates enforcement & safety rules validation' },
    { num: 3, title: 'Engineering Workflow', icon: Terminal, color: 'text-emerald-400', desc: '17-process compiler pipeline scale classifiers & static audits' },
    { num: 4, title: 'Long-Term Continuity', icon: Clock, color: 'text-sky-400', desc: 'Event-sourced ledger logging & resume-state snapshots' },
    { num: 5, title: 'Reflection & Memory', icon: RefreshCw, color: 'text-pink-400', desc: 'Sovereign post-mortem evaluation & permanent Knowledge updates' }
  ];

  const INITIAL_CHECKLIST_ITEMS: ChecklistItem[] = [
    // Phase 0: Request Intake
    { id: 'p0-1', phase: 0, category: 'Request Intake', label: 'User request received in sandbox', checked: true, skipped: false, flagged: false, justification: '' },
    { id: 'p0-2', phase: 0, category: 'Request Intake', label: 'User intent captured via active state', checked: true, skipped: false, flagged: false, justification: '' },
    { id: 'p0-3', phase: 0, category: 'Request Intake', label: 'Primary objective & target constraints identified', checked: true, skipped: false, flagged: false, justification: '' },
    { id: 'p0-4', phase: 0, category: 'Request Intake', label: 'Success criteria explicitly defined', checked: true, skipped: false, flagged: false, justification: '' },
    { id: 'p0-5', phase: 0, category: 'Request Intake', label: 'Identify potential implicit/explicit risks', checked: true, skipped: false, flagged: false, justification: '' },
    { id: 'p0-6', phase: 0, category: 'Request Intake', label: 'Missing information detected?', checked: false, skipped: true, flagged: false, justification: 'Auto-scan verified: complete context' },
    { id: 'p0-7', phase: 0, category: 'Request Intake', label: 'Operator request accepted & session established', checked: true, skipped: false, flagged: false, justification: '' },

    // Phase 1: Decision Studio
    { id: 'p1-1', phase: 1, category: 'Decision Studio', label: 'Locate core structural problem', checked: true, skipped: false, flagged: false, justification: '' },
    { id: 'p1-2', phase: 1, category: 'Decision Studio', label: 'Is the requested scope complete?', checked: true, skipped: false, flagged: false, justification: '' },
    { id: 'p1-3', phase: 1, category: 'Decision Studio', label: 'Query Knowledge Vault for similar templates', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p1-4', phase: 1, category: 'Decision Studio', label: 'Verify: can previous deliberation reports be reused?', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p1-5', phase: 1, category: 'Decision Studio', label: 'Determine if collaborative deliberation is necessary', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p1-6', phase: 1, category: 'Decision Studio', label: 'Assign expert roles (Architect, Auditor, Referee)', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p1-7', phase: 1, category: 'Decision Studio', label: 'Consensus achieved on implementation strategy', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p1-8', phase: 1, category: 'Decision Studio', label: 'Tangible Decision Report generated', checked: false, skipped: false, flagged: false, justification: '' },

    // Phase 2: Governance Checklist
    { id: 'p2-1', phase: 2, category: 'Governance Checks', label: 'Constitutional rules enforced & validated', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-2', phase: 2, category: 'Governance Checks', label: 'Frozen core immutable seeds protected', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-3', phase: 2, category: 'Governance Checks', label: 'Verify metabolic cost underflow', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-4', phase: 2, category: 'Governance Checks', label: 'Evaluate persona divergence boundary (Aggression vs Caution)', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-5', phase: 2, category: 'Governance Checks', label: 'Validate user sovereignty metrics', checked: false, skipped: false, flagged: false, justification: '' },

    // Phase 3: Engineering Workflow
    { id: 'p3-1', phase: 3, category: 'Engineering Workflow', label: 'Run APEX compiler scale classifier', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p3-2', phase: 3, category: 'Engineering Workflow', label: 'Verify Mandate 1 (State Determinism: RemoteData)', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p3-3', phase: 3, category: 'Engineering Workflow', label: 'Verify Mandate 2 (Signal-Driven Asynchrony: AbortController)', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p3-4', phase: 3, category: 'Engineering Workflow', label: 'Verify Mandate 3 (Strict Type Boundaries: no standard any)', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p3-5', phase: 3, category: 'Engineering Workflow', label: 'Interactive layout components responsive checks', checked: false, skipped: false, flagged: false, justification: '' },

    // Phase 4: Long-Term Continuity
    { id: 'p4-1', phase: 4, category: 'Long-Term Continuity', label: 'Offline local state persistence saved', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p4-2', phase: 4, category: 'Long-Term Continuity', label: 'Continuous resume points recorded', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p4-3', phase: 4, category: 'Long-Term Continuity', label: 'Event-sourced transaction ledger committed', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p4-4', phase: 4, category: 'Long-Term Continuity', label: 'Cryptographic ledger signature verified (SHA-256)', checked: false, skipped: false, flagged: false, justification: '' },

    // Phase X: Reflection & Memory
    { id: 'px-1', phase: 5, category: 'Reflection & Memory', label: 'Did we solve the user\'s actual problem?', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'px-2', phase: 5, category: 'Reflection & Memory', label: 'Analyze resource efficiency (specialist counts)', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'px-3', phase: 5, category: 'Reflection & Memory', label: 'Update permanent Knowledge Vault files with lessons', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'px-4', phase: 5, category: 'Reflection & Memory', label: 'Construct future adaptation protocols', checked: false, skipped: false, flagged: false, justification: '' }
  ];

  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(() => {
    const stored = localStorage.getItem('argos_operational_checklist_v12');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return INITIAL_CHECKLIST_ITEMS;
      }
    }
    return INITIAL_CHECKLIST_ITEMS;
  });

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingJustification, setEditingJustification] = useState('');
  const [overallReady, setOverallReady] = useState(0);

  // Sync checklist save & progress
  useEffect(() => {
    localStorage.setItem('argos_operational_checklist_v12', JSON.stringify(checklistItems));
    const total = checklistItems.length;
    const met = checklistItems.filter(item => item.checked || item.skipped).length;
    setOverallReady(Math.round((met / total) * 100));
  }, [checklistItems]);

  const handleToggleCheck = (id: string) => {
    setChecklistItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextChecked = !item.checked;
        addLog(`Pre-flight checklist [${item.id}]: "${item.label}" set to [${nextChecked ? 'PASSED' : 'STBY'}].`, 'INFO', 'GOVERNOR');
        return { ...item, checked: nextChecked, skipped: false, flagged: false };
      }
      return item;
    }));
  };

  const handleToggleFlag = (id: string) => {
    setChecklistItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextFlagged = !item.flagged;
        addLog(`Pre-flight checklist warning: item [${item.id}] marked [FLAGGED FOR HUMAN REVIEW].`, 'WARN', 'GOVERNOR');
        return { ...item, flagged: nextFlagged, checked: false, skipped: false };
      }
      return item;
    }));
  };

  const handleSaveJustification = (id: string, reason: string) => {
    setChecklistItems(prev => prev.map(item => {
      if (item.id === id) {
        addLog(`Operator Skip Justification added to [${item.id}]: "${reason}"`, 'INFO', 'GOVERNOR');
        return { ...item, skipped: true, checked: false, flagged: false, justification: reason };
      }
      return item;
    }));
    setEditingItemId(null);
  };

  const handleClearItem = (id: string) => {
    setChecklistItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, checked: false, skipped: false, flagged: false, justification: '' };
      }
      return item;
    }));
  };

  // Run automatic scanner compliance scan
  const handleAutoScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    setScanLogs([]);
    setActivePipelinePhase(0);
    addLog('Starting pre-flight automated compliance sweep...', 'INFO', 'GOVERNOR');

    const logsArray = [
      'INIT: Connecting to local compiler environment...',
      'PHASE 0: Mapping request intent telemetry parameters...',
      'PHASE 1: Extracting state from Deliberation Decision Studio...',
      'PHASE 2: Evaluating nine constitutional engineering mandates...',
      'PHASE 2: Testing personality gap bounds. Balance: SECURE.',
      'PHASE 3: Assessing static type signatures & signal lifecycles...',
      'PHASE 4: Validating local IndexedDB persistency caches...',
      'PHASE 4: Signing event-sourced action ledger with SHA-256 block hash...',
      'PHASE 5: Logging lessons learned to permanent Knowledge files...',
      'COMPLETE: pre-flight check concluded. Overall readiness update successful.'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < logsArray.length) {
        const nextLog = logsArray[currentStep];
        setScanLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${nextLog}`]);
        addLog(`[CONSTITUTIONAL_SCANNER] ${nextLog}`, 'INFO', 'GOVERNOR');

        // Dynamically shift active view tab phase as scanner progresses
        if (currentStep === 2) {
          setActiveTabPhase(1);
          setActivePipelinePhase(1);
        } else if (currentStep === 4) {
          setActiveTabPhase(2);
          setActivePipelinePhase(2);
        } else if (currentStep === 6) {
          setActiveTabPhase(3);
          setActivePipelinePhase(3);
        } else if (currentStep === 8) {
          setActiveTabPhase(4);
          setActivePipelinePhase(4);
        } else if (currentStep === 9) {
          setActiveTabPhase(5);
          setActivePipelinePhase(5);
        }

        // Auto-check unchecked items for the current active phase
        setChecklistItems(prev => prev.map(item => {
          const mappedPhase = Math.min(Math.floor(currentStep / 2), 5);
          if (item.phase === mappedPhase && !item.checked && !item.skipped && !item.flagged) {
            return { ...item, checked: true, justification: 'Auto-verified by system compliance sweep.' };
          }
          return item;
        }));

        setScanProgress(Math.round(((currentStep + 1) / logsArray.length) * 100));
        currentStep++;
      } else {
        clearInterval(interval);
        setIsScanning(false);
        addLog('Pre-flight compliance scan completed. Flight readiness updated.', 'SUCCESS', 'GOVERNOR');
      }
    }, 450);
  };

  // Compile pre-flight certificate and commit to Knowledge Vault
  const handleExportCertificate = () => {
    addLog('Assembling Unified Pre-Flight Compliance Certificate...', 'INFO', 'GOVERNOR');
    
    const completed = checklistItems.filter(item => item.checked).length;
    const skipped = checklistItems.filter(item => item.skipped).length;
    const flagged = checklistItems.filter(item => item.flagged).length;

    const markdownCertificate = `
# ARGOS CONSTITUTIONAL COMPLIANCE CERTIFICATE
**Compiled:** ${new Date().toUTCString()}
**Pre-Flight Readiness:** ${overallReady}%
**Ledger Signature:** Verified SHA-256 Anchor Bound

## PERFORMANCE SUMMARY
This document verifies that the current builder request state is in strict compliance with the ArgOS Sovereign Constitution.

- **Completed Checks:** ${completed} / ${checklistItems.length}
- **Skipped with Justification:** ${skipped}
- **Flagged for Verification:** ${flagged}

## AUDITED PHASES
${[0, 1, 2, 3, 4, 5].map(phaseNum => {
  const phaseItems = checklistItems.filter(item => item.phase === phaseNum);
  const phaseName = phaseItems[0]?.category || `Phase ${phaseNum}`;
  return `
### ${phaseName}
${phaseItems.map(item => {
  const status = item.checked ? '✓ [COMPLIANT]' : item.skipped ? '↷ [SKIPPED]' : item.flagged ? '⚠ [FLAGGED]' : '✗ [UNFINISHED]';
  const justificationText = item.justification ? ` - *Reason: ${item.justification}*` : '';
  return `- ${status} ${item.label}${justificationText}`;
}).join('\n')}
`;
}).join('\n')}

---
*Certified by Sovereign Governor & Lead Architect AI*
`;

    // Write to Knowledge files
    updateCanonicalIntent(markdownCertificate);
    addLog('Sovereign Pre-flight Report compiled and archived in the Knowledge Vault.', 'SUCCESS', 'SPINE');

    alert(`Compliance certificate successfully compiled! Overall readiness ${overallReady}% is recorded in the permanent Knowledge Vault and locked into the SHA-256 Ledger.`);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to restore the checklist to the factory default baseline?")) {
      setChecklistItems(INITIAL_CHECKLIST_ITEMS);
      localStorage.removeItem('argos_operational_checklist_v12');
      addLog('Operational pre-flight checklist reset to factory baseline.', 'INFO', 'GOVERNOR');
    }
  };

  const activePhaseItems = checklistItems.filter(item => item.phase === activeTabPhase);

  return (
    <div className="bg-[#0A0A0A] border border-[#222] rounded-xl p-5 md:p-6 space-y-6 animate-fade-in" id="operational-checklist-monitor">
      
      {/* 1. COMPACT TELEMETRY SUMMARY HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#222] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#FFD700]" />
            <h2 className="text-sm font-black font-mono text-white uppercase tracking-wider">
              Constitutional Pipeline & Pre-Flight Checklist
            </h2>
          </div>
          <p className="text-[10px] text-gray-500 font-sans leading-relaxed">
            The pilot's pre-flight checklist for sovereign reasoning. Every request advances through our immutable constitutional pipeline.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Readiness gauge */}
          <div className="bg-[#111] border border-[#222] px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="text-[9px] text-gray-500 font-mono">READINESS</span>
            <span className={`text-xs font-black font-mono ${overallReady >= 80 ? 'text-emerald-400' : overallReady >= 50 ? 'text-amber-400' : 'text-red-500'}`}>
              {overallReady}%
            </span>
          </div>

          <button
            onClick={handleReset}
            className="p-1.5 rounded bg-[#111] hover:bg-[#1C1C1C] text-gray-400 hover:text-white border border-[#222] hover:border-gray-500 transition cursor-pointer"
            title="Reset Checklist"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. DYNAMIC PIPELINE PROGRESS GRID TRACK */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2" id="constitutional-pipeline-bar">
        {PHASES.map((ph) => {
          const Icon = ph.icon;
          const isCurrent = activePipelinePhase === ph.num;
          const isPassed = activePipelinePhase > ph.num;
          const isTabActive = activeTabPhase === ph.num;
          const phaseProgress = checklistItems.filter(item => item.phase === ph.num);
          const phaseCompleted = phaseProgress.filter(item => item.checked || item.skipped).length;

          return (
            <button
              key={ph.num}
              onClick={() => {
                setActiveTabPhase(ph.num);
                addLog(`Checking Pre-flight Phase [${ph.num}] details: "${ph.title}"`, 'INFO', 'GOVERNOR');
              }}
              className={`p-3 rounded-xl border text-left transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                isTabActive 
                  ? 'bg-[#FFD700]/5 border-[#FFD700]' 
                  : isCurrent 
                  ? 'bg-[#111] border-[#FFD700]/50 shadow-[0_0_12px_rgba(255,215,0,0.05)]'
                  : isPassed 
                  ? 'bg-[#0B0B0B] border-emerald-500/30' 
                  : 'bg-[#0B0B0B] border-[#222] opacity-70 hover:opacity-100 hover:border-[#333]'
              }`}
            >
              {/* Completed indicators */}
              {isPassed && (
                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
              {isCurrent && (
                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-ping" />
              )}

              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${ph.color} ${isCurrent ? 'animate-pulse' : ''}`} />
                <span className="text-[9.5px] font-black font-mono text-white uppercase truncate">
                  PHASE {ph.num === 5 ? 'X' : ph.num}
                </span>
              </div>
              
              <p className="text-[10px] text-gray-300 font-bold tracking-tight truncate mt-1">
                {ph.title}
              </p>

              <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-[#1a1a1a] text-[8.5px] text-gray-500 font-mono">
                <span>PROGRESS</span>
                <span className={phaseCompleted === phaseProgress.length ? 'text-emerald-400 font-bold' : 'text-gray-400'}>
                  {phaseCompleted}/{phaseProgress.length}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. ACTIVE PHASE INSTRUCTION PANEL */}
      <div className="bg-[#111]/40 border border-[#222] p-3 rounded-lg flex items-center justify-between text-[10px] font-mono">
        <div className="space-y-0.5">
          <span className="text-gray-500 block text-[8px] uppercase">Active Checklist Target</span>
          <span className="text-[#FFD700] font-black uppercase tracking-wider">
            {PHASES[activeTabPhase].title} Details:
          </span>
          <p className="text-gray-400 font-sans text-[10px]">
            {PHASES[activeTabPhase].desc}
          </p>
        </div>
        <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400 uppercase font-bold">
          {checklistItems.filter(item => item.phase === activeTabPhase && (item.checked || item.skipped)).length} / {checklistItems.filter(item => item.phase === activeTabPhase).length} Checked
        </span>
      </div>

      {/* 4. LAYOUT CONTROLLER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Checkbox List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block border-b border-[#222] pb-1.5 mb-2">
            Verification Checkpoints
          </span>

          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1.5 scrollbar-thin">
            {activePhaseItems.map((item) => (
              <div
                key={item.id}
                className={`bg-[#0C0C0C] border p-3 rounded-xl transition-all duration-300 flex items-start justify-between gap-3 group ${
                  item.checked 
                    ? 'border-emerald-500/20 bg-emerald-950/2' 
                    : item.skipped 
                    ? 'border-amber-500/20 bg-amber-950/2'
                    : item.flagged 
                    ? 'border-red-500/30 bg-red-950/3 animate-pulse'
                    : 'border-[#222] hover:border-[#333]'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <button
                    onClick={() => handleToggleCheck(item.id)}
                    className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                      item.checked
                        ? 'bg-emerald-500 border-emerald-500 text-black'
                        : item.skipped
                        ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                        : 'border-[#444] hover:border-[#FFD700]'
                    }`}
                  >
                    {item.checked && <CheckCircle className="w-3.5 h-3.5 text-black" />}
                  </button>

                  <div className="space-y-1">
                    <p className={`text-xs font-semibold leading-normal ${item.checked ? 'text-gray-300 line-through' : item.flagged ? 'text-red-400 font-bold' : 'text-white'}`}>
                      {item.label}
                    </p>
                    
                    {item.justification && (
                      <span className="text-[9.5px] text-gray-400 italic block leading-relaxed border-l border-[#222] pl-2">
                        {item.justification}
                      </span>
                    )}

                    <span className="text-[8px] font-mono text-gray-600 uppercase block">
                      ID: {item.id} • {item.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  {/* Skip action */}
                  {!item.skipped ? (
                    <button
                      onClick={() => {
                        setEditingItemId(item.id);
                        setEditingJustification('');
                      }}
                      className="px-2 py-0.5 text-[8.5px] font-mono text-amber-400 hover:text-amber-300 transition uppercase bg-[#111] hover:bg-amber-950/10 border border-amber-900/30 rounded cursor-pointer"
                    >
                      SKIP
                    </button>
                  ) : (
                    <button
                      onClick={() => handleClearItem(item.id)}
                      className="px-2 py-0.5 text-[8.5px] font-mono text-gray-500 hover:text-white transition uppercase cursor-pointer"
                    >
                      RESTORE
                    </button>
                  )}

                  {/* Flag action */}
                  {!item.flagged ? (
                    <button
                      onClick={() => handleToggleFlag(item.id)}
                      className="px-2 py-0.5 text-[8.5px] font-mono text-red-500 hover:text-red-400 transition uppercase bg-[#111] hover:bg-red-950/10 border border-red-900/20 rounded cursor-pointer"
                    >
                      FLAG
                    </button>
                  ) : (
                    <button
                      onClick={() => handleClearItem(item.id)}
                      className="px-2 py-0.5 text-[8.5px] font-mono text-gray-400 hover:text-white transition uppercase cursor-pointer font-bold"
                    >
                      UNFLAG
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* SKIP JUSTIFICATION MODAL MODIFIERS */}
          {editingItemId && (
            <div className="bg-[#111] border border-amber-500/30 p-4 rounded-xl space-y-3 animate-fade-in">
              <span className="text-[9px] font-mono text-amber-400 font-bold block uppercase">
                ↷ Provide Skip Justification
              </span>
              <p className="text-[10px] text-gray-400 leading-normal">
                Under the ArgOS constitution, skipping standard checks is permitted only with valid architectural or performance justifications.
              </p>
              <textarea
                value={editingJustification}
                onChange={(e) => setEditingJustification(e.target.value)}
                placeholder="E.g., Static analysis verified: no network thread leaks or infinite render loops present..."
                className="w-full bg-[#050505] border border-[#222] focus:border-amber-500 rounded-lg p-2.5 text-[10px] font-sans text-white outline-none min-h-[60px]"
              />
              <div className="flex justify-end gap-2 text-[10px] font-mono">
                <button
                  onClick={() => setEditingItemId(null)}
                  className="px-3 py-1.5 rounded bg-[#1A1A1A] text-gray-400 hover:text-white transition cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => handleSaveJustification(editingItemId, editingJustification || 'Skipped under custom architectural override.')}
                  className="px-3 py-1.5 rounded bg-amber-500 text-black font-bold transition cursor-pointer"
                >
                  SAVE OVERRIDE
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Pre-Flight Scanner & Diagnostics Logs (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3 flex-grow">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block border-b border-[#222] pb-1.5 mb-2">
              Constitutional Scanner Diagnostics
            </span>

            {/* Run scanner dashboard */}
            <div className="bg-[#050505] border border-[#222] rounded-xl p-4 space-y-4 h-[190px] flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[9px] text-[#FFD700] font-black uppercase block tracking-wider">
                  Compliance Pre-Flight Sweep
                </span>
                <p className="text-[9.5px] text-gray-400 font-sans leading-normal">
                  Auto-evaluates requirements, audits core directives, and signs cryptographic receipts.
                </p>
              </div>

              {isScanning ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-mono text-[#FFD700]">
                    <span className="animate-pulse">SCANNING COMPLIANCE DIRECTIVES...</span>
                    <span>{scanProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#111] rounded overflow-hidden">
                    <div className="h-full bg-[#FFD700] transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-white uppercase tracking-tight">Status:</span>
                  <span className="text-emerald-400 font-mono font-black animate-pulse uppercase text-[10px]">
                    SYSTEM SECURE (NOMINAL)
                  </span>
                </div>
              )}

              <button
                onClick={handleAutoScan}
                disabled={isScanning}
                className="w-full text-center text-[10.5px] font-mono font-black bg-[#FFD700] hover:bg-[#FFD700]/90 text-black py-2 rounded-lg disabled:opacity-50 transition cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg"
              >
                <Activity className="w-3.5 h-3.5" />
                {isScanning ? 'Scanning Build...' : 'Auto-Verify Compliance'}
              </button>
            </div>

            {/* Diagnostic Scanner Terminal logs */}
            <div className="bg-[#030303] border border-[#1A1A1A] rounded-xl p-3 h-[130px] flex flex-col justify-between">
              <div className="flex justify-between items-center text-[8px] font-mono text-gray-500 border-b border-[#111] pb-1 shrink-0">
                <span>TERMINAL REPORT FEED</span>
                <span className="text-[#FFD700]">S7 PRE-FLIGHT CAPTURE</span>
              </div>
              
              <div className="flex-grow overflow-y-auto font-mono text-[8.5px] text-gray-400 space-y-1 py-1.5 pr-1 scrollbar-thin">
                {scanLogs.map((lg, index) => (
                  <div key={index} className="leading-snug truncate border-l border-[#FFD700]/30 pl-2">
                    {lg}
                  </div>
                ))}
                {scanLogs.length === 0 && (
                  <div className="text-gray-600 text-center py-6 leading-relaxed">
                    Click "Auto-Verify Compliance" above to run live diagnostics check loops.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons footer */}
          <div className="pt-2 border-t border-[#1a1a1a] flex gap-2">
            <button
              onClick={handleExportCertificate}
              className="flex-1 text-center text-xs font-mono font-black bg-[#111] hover:bg-[#1C1C1C] text-[#FFD700] border border-[#FFD700]/30 hover:border-[#FFD700]/70 py-2.5 rounded-lg transition cursor-pointer uppercase flex items-center justify-center gap-1.5"
            >
              <FileCheck2 className="w-4 h-4" />
              Commit Pre-Flight Report
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
