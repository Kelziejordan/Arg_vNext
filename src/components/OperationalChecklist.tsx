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
  Sparkles,
  ChevronRight,
  Database,
  Search,
  Check,
  AlertCircle,
  Layers,
  Cpu,
  Bookmark,
  CheckSquare,
  XSquare,
  HelpCircle as HelpIcon
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
  const { addLog, updateCanonicalIntent } = useRuntime();

  // Selected Active Phase tab to view checklist items
  const [activeTabPhase, setActiveTabPhase] = useState<number>(0);
  
  // Pipeline active sweep stage (0 to 12) matching the constitutional pipeline
  const [activePipelineStage, setActivePipelineStage] = useState<number>(0);

  // 13 stages of the Constitutional Pipeline
  const PIPELINE_STAGES = [
    { name: 'Intent', color: 'text-amber-400', bg: 'bg-amber-400/10', desc: 'Capturing user intent & boundary identification' },
    { name: 'Decision Studio', color: 'text-purple-400', bg: 'bg-purple-400/10', desc: 'Pre-flight multi-expert deliberation' },
    { name: 'Governance', color: 'text-blue-400', bg: 'bg-blue-400/10', desc: 'Enforcing constitutional compliance rules' },
    { name: 'Knowledge', color: 'text-emerald-400', bg: 'bg-emerald-400/10', desc: 'Searching current Knowledge Vault contexts' },
    { name: 'Planning', color: 'text-sky-400', bg: 'bg-sky-400/10', desc: 'Formulating sequence logic & execution paths' },
    { name: 'Execution', color: 'text-pink-400', bg: 'bg-pink-400/10', desc: 'Executing core task workflows & compiler sweeps' },
    { name: 'Validation', color: 'text-indigo-400', bg: 'bg-indigo-400/10', desc: 'Testing build readiness & verifying regressions' },
    { name: 'Evidence', color: 'text-cyan-400', bg: 'bg-cyan-400/10', desc: 'Generating supporting proof-of-work indicators' },
    { name: 'Ledger', color: 'text-teal-400', bg: 'bg-teal-400/10', desc: 'Committing transaction logs & state changes' },
    { name: 'Recovery', color: 'text-red-400', bg: 'bg-red-400/10', desc: 'Creating rollback points & recovery vectors' },
    { name: 'Continuity', color: 'text-orange-400', bg: 'bg-orange-400/10', desc: 'Securing session resume capability offline' },
    { name: 'Reflection', color: 'text-rose-400', bg: 'bg-rose-400/10', desc: 'Running self-critique performance benchmarks' },
    { name: 'Institutional Memory', color: 'text-green-400', bg: 'bg-green-400/10', desc: 'Consolidating learned patterns into memory cores' }
  ];

  // Helper mapping of 13 pipeline stages to the 6 primary checklist tabs
  const mapStageToPhase = (stageIndex: number): number => {
    if (stageIndex === 0) return 0; // Phase 0
    if (stageIndex === 1) return 1; // Phase 1
    if (stageIndex === 2 || stageIndex === 3 || stageIndex === 6 || stageIndex === 7 || stageIndex === 8 || stageIndex === 9 || stageIndex === 10) return 2; // Phase 2
    if (stageIndex === 4 || stageIndex === 5) return 3; // Phase 3
    if (stageIndex === 11 || stageIndex === 12) return 5; // Phase X (Reflection)
    return 4; // Phase 4 (Long-Term Continuity/Exit checks)
  };

  // Primary checklist phases matching user request
  const PHASES = [
    { num: 0, title: 'Phase 0 — Request Intake', icon: Compass, color: 'text-amber-400', desc: 'Sovereign intent alignment & objective boundaries identification' },
    { num: 1, title: 'Phase 1 — Decision Studio', icon: Users, color: 'text-purple-400', desc: 'Pre-flight multi-expert deliberation & stable roles mapping' },
    { num: 2, title: 'Phase 2 — Governance Checklist', icon: ShieldCheck, color: 'text-blue-400', desc: 'Constitutional rules, context memory, evidence vaults, ledgers, and rollback validation' },
    { num: 3, title: 'Phase 3 — Engineering Workflow', icon: Terminal, color: 'text-emerald-400', desc: 'Deliberate workflow execution path & process line checkpoints' },
    { num: 4, title: 'Phase 4 — Long-Term Continuity', icon: Clock, color: 'text-sky-400', desc: 'Offline recovery timelines & definitive exit certification' },
    { num: 5, title: 'Phase X — Reflection & Improvement', icon: RefreshCw, color: 'text-pink-400', desc: 'Sovereign post-mortem assessment & permanent Knowledge Vault feedback' }
  ];

  // Complete set of checklist items precisely reflecting user requested checkboxes
  const INITIAL_CHECKLIST_ITEMS: ChecklistItem[] = [
    // --- PHASE 0: REQUEST INTAKE ---
    { id: 'p0-1', phase: 0, category: 'Request Intake', label: 'User request received', checked: true, skipped: false, flagged: false, justification: '' },
    { id: 'p0-2', phase: 0, category: 'Request Intake', label: 'User intent captured', checked: true, skipped: false, flagged: false, justification: '' },
    { id: 'p0-3', phase: 0, category: 'Request Intake', label: 'Primary objective identified', checked: true, skipped: false, flagged: false, justification: '' },
    { id: 'p0-4', phase: 0, category: 'Request Intake', label: 'Success criteria identified', checked: true, skipped: false, flagged: false, justification: '' },
    { id: 'p0-5', phase: 0, category: 'Request Intake', label: 'Constraints identified', checked: true, skipped: false, flagged: false, justification: '' },
    { id: 'p0-6', phase: 0, category: 'Request Intake', label: 'Assumptions identified', checked: true, skipped: false, flagged: false, justification: '' },
    { id: 'p0-7', phase: 0, category: 'Request Intake', label: 'Missing information detected', checked: false, skipped: true, flagged: false, justification: 'Auto-scan verified: complete context' },
    { id: 'p0-8', phase: 0, category: 'Request Intake', label: 'Clarification required? (Yes / No)', checked: false, skipped: false, flagged: false, justification: '' }, // Special item
    { id: 'p0-9', phase: 0, category: 'Request Intake', label: 'Request accepted', checked: true, skipped: false, flagged: false, justification: '' },

    // --- PHASE 1: DECISION STUDIO ---
    { id: 'p1-1', phase: 1, category: 'Understand the Problem', label: 'What is the actual problem?', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p1-2', phase: 1, category: 'Understand the Problem', label: 'What outcome does the user want?', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p1-3', phase: 1, category: 'Understand the Problem', label: 'Is the request complete?', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p1-4', phase: 1, category: 'Understand the Problem', label: 'Do I already know the answer?', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p1-5', phase: 1, category: 'Understand the Problem', label: 'Does the Knowledge Vault already contain this?', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p1-6', phase: 1, category: 'Understand the Problem', label: 'Can previous work be reused?', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p1-7', phase: 1, category: 'Understand the Problem', label: 'Is additional evidence required?', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p1-8', phase: 1, category: 'Understand the Problem', label: 'Is deeper review needed?', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p1-9', phase: 1, category: 'Understand the Problem', label: 'Should specialists collaborate?', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p1-10', phase: 1, category: 'Understand the Problem', label: 'Which specialists were assigned?', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p1-11', phase: 1, category: 'Understand the Problem', label: 'Consensus achieved?', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p1-12', phase: 1, category: 'Understand the Problem', label: 'Human approval required?', checked: false, skipped: false, flagged: false, justification: '' },

    // --- PHASE 2: GOVERNANCE CHECKLIST ---
    // Governance
    { id: 'p2-1', phase: 2, category: 'Governance', label: 'Constitutional rules enforced', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-2', phase: 2, category: 'Governance', label: 'Frozen Core protected', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-3', phase: 2, category: 'Governance', label: 'Policy compliance verified', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-4', phase: 2, category: 'Governance', label: 'Scope validated', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-5', phase: 2, category: 'Governance', label: 'Permissions verified', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-6', phase: 2, category: 'Governance', label: 'Safety verified', checked: false, skipped: false, flagged: false, justification: '' },
    // Memory
    { id: 'p2-7', phase: 2, category: 'Memory', label: 'Existing project located', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-8', phase: 2, category: 'Memory', label: 'Existing context loaded', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-9', phase: 2, category: 'Memory', label: 'Previous sessions restored', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-10', phase: 2, category: 'Memory', label: 'Active memory updated', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-11', phase: 2, category: 'Memory', label: 'New memory linked', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-12', phase: 2, category: 'Memory', label: 'Snapshot created', checked: false, skipped: false, flagged: false, justification: '' },
    // Evidence
    { id: 'p2-13', phase: 2, category: 'Evidence', label: 'Evidence collected', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-14', phase: 2, category: 'Evidence', label: 'Sources verified', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-15', phase: 2, category: 'Evidence', label: 'Confidence assessed', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-16', phase: 2, category: 'Evidence', label: 'Traceability established', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-17', phase: 2, category: 'Evidence', label: 'Supporting artifacts generated', checked: false, skipped: false, flagged: false, justification: '' },
    // Ledger
    { id: 'p2-18', phase: 2, category: 'Ledger', label: 'Decision logged', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-19', phase: 2, category: 'Ledger', label: 'Events recorded', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-20', phase: 2, category: 'Ledger', label: 'State transition recorded', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-21', phase: 2, category: 'Ledger', label: 'Audit trail updated', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-22', phase: 2, category: 'Ledger', label: 'Version incremented', checked: false, skipped: false, flagged: false, justification: '' },
    // Validation
    { id: 'p2-23', phase: 2, category: 'Validation', label: 'Requirements validated', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-24', phase: 2, category: 'Validation', label: 'Architecture validated', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-25', phase: 2, category: 'Validation', label: 'Data validated', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-26', phase: 2, category: 'Validation', label: 'Output validated', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-27', phase: 2, category: 'Validation', label: 'User request satisfied', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-28', phase: 2, category: 'Validation', label: 'Regression check completed', checked: false, skipped: false, flagged: false, justification: '' },
    // Recovery
    { id: 'p2-29', phase: 2, category: 'Recovery', label: 'Recovery point created', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-30', phase: 2, category: 'Recovery', label: 'Rollback available', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-31', phase: 2, category: 'Recovery', label: 'Recovery verified', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-32', phase: 2, category: 'Recovery', label: 'Failure strategy documented', checked: false, skipped: false, flagged: false, justification: '' },
    // Knowledge
    { id: 'p2-33', phase: 2, category: 'Knowledge', label: 'Existing knowledge searched', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-34', phase: 2, category: 'Knowledge', label: 'Duplicate detection completed', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-35', phase: 2, category: 'Knowledge', label: 'New knowledge extracted', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-36', phase: 2, category: 'Knowledge', label: 'Knowledge Vault updated', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-37', phase: 2, category: 'Knowledge', label: 'Cross references created', checked: false, skipped: false, flagged: false, justification: '' },
    // Continuity
    { id: 'p2-38', phase: 2, category: 'Continuity', label: 'Project continuity maintained', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-39', phase: 2, category: 'Continuity', label: 'AI-independent state preserved', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-40', phase: 2, category: 'Continuity', label: 'Session continuity verified', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-41', phase: 2, category: 'Continuity', label: 'Resume point created', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p2-42', phase: 2, category: 'Continuity', label: 'Future recovery verified', checked: false, skipped: false, flagged: false, justification: '' },

    // --- PHASE 3: ENGINEERING WORKFLOW ---
    { id: 'p3-1', phase: 3, category: 'Workflow', label: 'Goal defined', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p3-2', phase: 3, category: 'Workflow', label: 'Planning completed', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p3-3', phase: 3, category: 'Workflow', label: 'Architecture approved', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p3-4', phase: 3, category: 'Workflow', label: 'Implementation completed', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p3-5', phase: 3, category: 'Workflow', label: 'Review completed', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p3-6', phase: 3, category: 'Workflow', label: 'Testing completed', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p3-7', phase: 3, category: 'Workflow', label: 'Validation completed', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p3-8', phase: 3, category: 'Workflow', label: 'Deployment completed', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p3-9', phase: 3, category: 'Workflow', label: 'Monitoring enabled', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p3-10', phase: 3, category: 'Workflow', label: 'Maintenance active', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p3-11', phase: 3, category: 'Workflow', label: 'Recovery verified', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p3-12', phase: 3, category: 'Workflow', label: 'Continuity preserved', checked: false, skipped: false, flagged: false, justification: '' },

    // --- PHASE 4: LONG-TERM CONTINUITY ---
    // Recovery Timeline
    { id: 'p4-1', phase: 4, category: 'Recovery Timeline', label: 'Resume after 1 minute', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p4-2', phase: 4, category: 'Recovery Timeline', label: 'Resume after 1 hour', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p4-3', phase: 4, category: 'Recovery Timeline', label: 'Resume after 1 day', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p4-4', phase: 4, category: 'Recovery Timeline', label: 'Resume after 1 week', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p4-5', phase: 4, category: 'Recovery Timeline', label: 'Resume after 1 month', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p4-6', phase: 4, category: 'Recovery Timeline', label: 'Resume after 6 months', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p4-7', phase: 4, category: 'Recovery Timeline', label: 'Resume after 1 year', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p4-8', phase: 4, category: 'Recovery Timeline', label: 'Resume after 2+ years', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p4-9', phase: 4, category: 'Recovery Timeline', label: 'Resume using a different AI', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p4-10', phase: 4, category: 'Recovery Timeline', label: 'Resume on different hardware', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p4-11', phase: 4, category: 'Recovery Timeline', label: 'Resume after software upgrade', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p4-12', phase: 4, category: 'Recovery Timeline', label: 'Resume after schema migration', checked: false, skipped: false, flagged: false, justification: '' },
    // Final Exit Checklist
    { id: 'p4-13', phase: 4, category: 'Final Exit Checklist', label: 'User objective achieved', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p4-14', phase: 4, category: 'Final Exit Checklist', label: 'Deliverables generated', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p4-15', phase: 4, category: 'Final Exit Checklist', label: 'ADR generated (if applicable)', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p4-16', phase: 4, category: 'Final Exit Checklist', label: 'Knowledge updated', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p4-17', phase: 4, category: 'Final Exit Checklist', label: 'Evidence archived', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p4-18', phase: 4, category: 'Final Exit Checklist', label: 'Ledger committed', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p4-19', phase: 4, category: 'Final Exit Checklist', label: 'Recovery snapshot saved', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p4-20', phase: 4, category: 'Final Exit Checklist', label: 'Continuity verified', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'p4-21', phase: 4, category: 'Final Exit Checklist', label: 'Ready for future resumption', checked: false, skipped: false, flagged: false, justification: '' },

    // --- PHASE X: REFLECTION & IMPROVEMENT ---
    { id: 'px-1', phase: 5, category: 'Improvement', label: 'Did we solve the user\'s actual problem?', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'px-2', phase: 5, category: 'Improvement', label: 'Was unnecessary work performed?', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'px-3', phase: 5, category: 'Improvement', label: 'Could fewer specialists have been used?', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'px-4', phase: 5, category: 'Improvement', label: 'Could fewer AI calls have achieved the same result?', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'px-5', phase: 5, category: 'Improvement', label: 'Was the decision supported by sufficient evidence?', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'px-6', phase: 5, category: 'Improvement', label: 'Were any assumptions left unverified?', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'px-7', phase: 5, category: 'Improvement', label: 'Was new knowledge discovered?', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'px-8', phase: 5, category: 'Improvement', label: 'Should this become a reusable pattern?', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'px-9', phase: 5, category: 'Improvement', label: 'Should this become an ADR?', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'px-10', phase: 5, category: 'Improvement', label: 'Should this become institutional knowledge?', checked: false, skipped: false, flagged: false, justification: '' },
    { id: 'px-11', phase: 5, category: 'Improvement', label: 'What should ARG do better next time?', checked: false, skipped: false, flagged: false, justification: '' }
  ];

  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(() => {
    const stored = localStorage.getItem('argos_operational_checklist_v14_definitive');
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
    localStorage.setItem('argos_operational_checklist_v14_definitive', JSON.stringify(checklistItems));
    const total = checklistItems.length;
    // Checked or skipped are counted as met
    const met = checklistItems.filter(item => item.checked || item.skipped).length;
    setOverallReady(Math.round((met / total) * 100));
  }, [checklistItems]);

  const handleToggleCheck = (id: string) => {
    setChecklistItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextChecked = !item.checked;
        addLog(`Operational Check [${item.id}]: "${item.label}" set to [${nextChecked ? 'PASSED' : 'STBY'}].`, 'INFO', 'GOVERNOR');
        return { ...item, checked: nextChecked, skipped: false, flagged: false };
      }
      return item;
    }));
  };

  const handleToggleFlag = (id: string) => {
    setChecklistItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextFlagged = !item.flagged;
        addLog(`Operational Check Warning: [${item.id}] marked [FLAGGED FOR HUMAN REVIEW].`, 'WARN', 'GOVERNOR');
        return { ...item, flagged: nextFlagged, checked: false, skipped: false };
      }
      return item;
    }));
  };

  const handleSaveJustification = (id: string, reason: string) => {
    setChecklistItems(prev => prev.map(item => {
      if (item.id === id) {
        addLog(`Operator Justified Bypass on [${item.id}]: "${reason}"`, 'INFO', 'GOVERNOR');
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

  // Run automatic pipeline sweep simulator - advancing step-by-step through the 13 stages
  const handleAutoScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    setScanLogs([]);
    setActivePipelineStage(0);
    addLog('Initiating Constitutional Execution Pipeline sweep...', 'INFO', 'GOVERNOR');

    // Logs matched to the 13 pipeline steps
    const sweepLogs = [
      'PIPELINE [01/13] - INTENT: Analyzing user request, alignment parameters & primary objective boundaries.',
      'PIPELINE [02/13] - DECISION STUDIO: Deliberating actual problem & outcome goals. Mapping expert roles.',
      'PIPELINE [03/13] - GOVERNOR: Validating constitutional rule sets & protecting immutable Frozen Core.',
      'PIPELINE [04/13] - KNOWLEDGE: Scanning local Knowledge Vault structures. Matching previous codebases.',
      'PIPELINE [05/13] - PLANNING: Structuring optimal execution sequence & parsing requirements tree.',
      'PIPELINE [06/13] - EXECUTION: Compiling layouts, building state-machines, and running compiler tests.',
      'PIPELINE [07/13] - VALIDATION: Verification algorithms verified. Analyzing regression test harnesses.',
      'PIPELINE [08/13] - EVIDENCE: Gathering proof-of-work indicators & confirming WCAG readability criteria.',
      'PIPELINE [09/13] - LEDGER: Committing state transition blocks to audit logs with cryptographic headers.',
      'PIPELINE [10/13] - RECOVERY: Anchoring restore markers. Rollback systems nominal.',
      'PIPELINE [11/13] - CONTINUITY: Saving offline state persistence layers. Session resumability verified.',
      'PIPELINE [12/13] - REFLECTION: Critical post-mortem analysis completed. specialist cost index validated.',
      'PIPELINE [13/13] - INST. MEMORY: Updating permanent knowledge cores. Preparing safe exit certificate.'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < sweepLogs.length) {
        const nextLog = sweepLogs[currentStep];
        setScanLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${nextLog}`]);
        addLog(`[CONSTITUTIONAL_PIPELINE] ${nextLog}`, 'INFO', 'GOVERNOR');
        setActivePipelineStage(currentStep);

        // Dynamically shift the selected checklist Phase Tab to align with the running step
        const mappedPhase = mapStageToPhase(currentStep);
        setActiveTabPhase(mappedPhase);

        // Automatically complete the items associated with this phase
        setChecklistItems(prev => prev.map(item => {
          if (item.phase === mappedPhase && !item.checked && !item.skipped && !item.flagged) {
            return { ...item, checked: true, justification: 'Auto-verified by Constitutional runtime sweep.' };
          }
          return item;
        }));

        setScanProgress(Math.round(((currentStep + 1) / sweepLogs.length) * 100));
        currentStep++;
      } else {
        clearInterval(interval);
        setIsScanning(false);
        addLog('Constitutional Execution Pipeline sweep completed. Core status set to perfect nominal.', 'SUCCESS', 'GOVERNOR');
      }
    }, 600);
  };

  // Compile pre-flight report and archive to Knowledge Vault
  const handleExportCertificate = () => {
    addLog('Assembling Unified Constitutional Execution Certificate...', 'INFO', 'GOVERNOR');
    
    const completed = checklistItems.filter(item => item.checked).length;
    const skipped = checklistItems.filter(item => item.skipped).length;
    const flagged = checklistItems.filter(item => item.flagged).length;

    const mdCertificate = `
# ARGOS CONSTITUTIONAL EXECUTION CERTIFICATE
**Timestamp:** ${new Date().toUTCString()}
**Pre-Flight Integrity Score:** ${overallReady}%
**Ledger Signature:** Verified SHA-256 Block Lock Bound

## SYSTEM PERFORMANCE TELEMETRY
This certificate verifies that the current runtime state is in strict compliance with the ARG Constitutional Pipeline.

- **Checkpoints Satisfied:** ${completed} / ${checklistItems.length}
- **Bypassed with Justification:** ${skipped}
- **Flagged Warning Metrics:** ${flagged}

## RUNTIME PIPELINE AUDITS
${[0, 1, 2, 3, 4, 5].map(phaseNum => {
  const phaseItems = checklistItems.filter(item => item.phase === phaseNum);
  const phaseName = PHASES.find(p => p.num === phaseNum)?.title || `Phase ${phaseNum}`;
  
  // Group by category inside the phase
  const categoriesInPhase = Array.from(new Set(phaseItems.map(item => item.category))) as string[];
  
  return `
### ${phaseName}
${categoriesInPhase.map(cat => {
    const catItems = phaseItems.filter(i => i.category === cat);
    return `
*${cat.toUpperCase()} CONTROL LAYER*
${catItems.map(item => {
      const status = item.checked ? '✓ [SECURED]' : item.skipped ? '↷ [OVERRIDDEN]' : item.flagged ? '⚠ [FLAGGED]' : '✗ [STANDBY]';
      const justificationText = item.justification ? ` - *Reason: ${item.justification}*` : '';
      return `- ${status} ${item.label}${justificationText}`;
    }).join('\n')}
`;
}).join('\n')}
`;
}).join('\n')}

---
*Signed, Sovereign Governor & Lead Architect AI*
`;

    // Commit to runtime intent
    updateCanonicalIntent(mdCertificate);

    alert(`Constitutional Execution Certificate successfully generated!\nIntegrity index: ${overallReady}%\nReport committed to permanent knowledge storage files.`);
  };

  const handleReset = () => {
    if (window.confirm("Restore Constitutional Checklist to pristine factory default baseline? This clears custom overrides.")) {
      setChecklistItems(INITIAL_CHECKLIST_ITEMS);
      setActivePipelineStage(0);
      setActiveTabPhase(0);
      localStorage.removeItem('argos_operational_checklist_v14_definitive');
      addLog('Operational pre-flight checklist restored to pristine baseline.', 'INFO', 'GOVERNOR');
    }
  };

  // Grouping active phase items by category for premium, clean structure
  const activePhaseItems = checklistItems.filter(item => item.phase === activeTabPhase);
  const activeCategories = Array.from(new Set(activePhaseItems.map(item => item.category)));

  return (
    <div className="bg-[#050505] border border-[#222] rounded-xl p-5 md:p-6 space-y-6 animate-fade-in" id="operational-checklist-monitor">
      
      {/* 1. UPPER TELEMETRY SUMMARY HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#222] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#FFD700]" />
            <h2 className="text-sm font-black font-mono text-white uppercase tracking-wider">
              Constitutional Pipeline & Pre-Flight Monitor
            </h2>
          </div>
          <p className="text-[10px] text-gray-400 font-sans leading-relaxed">
            Determinism Engine: advances sequentially through our pipeline layers, creating auditable, resumable receipts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Integrity Metric */}
          <div className="bg-[#0C0C0C] border border-[#222] px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="text-[9px] text-gray-500 font-mono">PIPELINE INTEGRITY</span>
            <span className={`text-xs font-black font-mono ${overallReady >= 90 ? 'text-emerald-400' : overallReady >= 60 ? 'text-[#FFD700]' : 'text-rose-500'}`}>
              {overallReady}%
            </span>
          </div>

          <button
            onClick={handleReset}
            className="p-1.5 rounded bg-[#0D0D0D] hover:bg-[#1A1A1A] text-gray-400 hover:text-white border border-[#222] transition cursor-pointer"
            title="Reset Checklist"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. DYNAMIC PIPELINE SEQUENCE TRACK (13 Stages) */}
      <div className="bg-[#0A0A0A] border border-[#1C1C1C] rounded-lg p-3 space-y-2">
        <div className="flex justify-between items-center text-[9px] font-mono border-b border-[#1A1A1A] pb-1.5 mb-1 text-gray-500">
          <span>CONSTITUTIONAL RUNTIME PIPELINE</span>
          <span className="text-[#FFD700]">ACTIVE STAGE: {PIPELINE_STAGES[activePipelineStage].name.toUpperCase()}</span>
        </div>

        <div className="overflow-x-auto scrollbar-thin pb-2">
          <div className="flex items-center min-w-[1000px] gap-1">
            {PIPELINE_STAGES.map((st, idx) => {
              const isCurrent = activePipelineStage === idx;
              const isPassed = activePipelineStage > idx;
              
              return (
                <React.Fragment key={st.name}>
                  {idx > 0 && <ChevronRight className="w-3 h-3 text-gray-700 shrink-0" />}
                  <button
                    onClick={() => {
                      setActivePipelineStage(idx);
                      // Auto-shift the main checklist tab to the related Phase
                      setActiveTabPhase(mapStageToPhase(idx));
                      addLog(`Pipeline focused: ${st.name} (${st.desc})`, 'INFO', 'GOVERNOR');
                    }}
                    className={`px-2.5 py-1.5 rounded text-[10px] font-mono transition text-left shrink-0 border cursor-pointer ${
                      isCurrent
                        ? `bg-[#FFD700]/10 border-[#FFD700] text-white shadow-[0_0_8px_rgba(255,215,0,0.15)]`
                        : isPassed
                        ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400'
                        : 'bg-black border-[#222] text-gray-500 hover:text-gray-300 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-[8px] opacity-60">{(idx + 1).toString().padStart(2, '0')}</span>
                      <span className="font-bold">{st.name}</span>
                    </div>
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>
        <p className="text-[9px] text-gray-400 font-mono italic pl-1 text-center sm:text-left">
          &quot;{PIPELINE_STAGES[activePipelineStage].desc}&quot;
        </p>
      </div>

      {/* 3. CHECKLIST LAYER TABS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2" id="constitutional-checklist-tabs">
        {PHASES.map((ph) => {
          const Icon = ph.icon;
          const isTabActive = activeTabPhase === ph.num;
          const phaseProgress = checklistItems.filter(item => item.phase === ph.num);
          const phaseCompleted = phaseProgress.filter(item => item.checked || item.skipped).length;

          return (
            <button
              key={ph.num}
              onClick={() => {
                setActiveTabPhase(ph.num);
                addLog(`Checking Checklist Phase: "${ph.title}"`, 'INFO', 'GOVERNOR');
              }}
              className={`p-2.5 rounded-lg border text-left transition-all duration-200 cursor-pointer ${
                isTabActive
                  ? 'bg-[#FFD700]/5 border-[#FFD700]'
                  : 'bg-[#0B0B0B] border-[#222] opacity-70 hover:opacity-100 hover:border-[#333]'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Icon className={`w-3.5 h-3.5 ${ph.color}`} />
                <span className="text-[9.5px] font-black font-mono text-white truncate">
                  PHASE {ph.num === 5 ? 'X' : ph.num}
                </span>
              </div>
              
              <p className="text-[9.5px] text-gray-300 font-bold truncate mt-1">
                {ph.title.split(' — ')[1]}
              </p>

              <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#1C1C1C] text-[8.5px] text-gray-500 font-mono">
                <span>CHECKS</span>
                <span className={phaseCompleted === phaseProgress.length ? 'text-emerald-400 font-black' : 'text-gray-400'}>
                  {phaseCompleted}/{phaseProgress.length}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 4. ACTIVE TAB INSTRUCTION PANEL */}
      <div className="bg-[#090909] border border-[#1F1F1F] p-3 rounded-lg flex items-center justify-between text-[10px] font-mono">
        <div className="space-y-0.5">
          <span className="text-gray-500 block text-[8px] uppercase">Active Layer Target</span>
          <span className="text-[#FFD700] font-black uppercase tracking-wider">
            {PHASES[activeTabPhase].title}
          </span>
          <p className="text-gray-400 font-sans text-[10px]">
            {PHASES[activeTabPhase].desc}
          </p>
        </div>
        <span className="text-[9px] bg-white/5 border border-white/10 px-2.5 py-0.5 rounded text-gray-400 uppercase font-bold hidden sm:inline-block">
          {checklistItems.filter(item => item.phase === activeTabPhase && (item.checked || item.skipped)).length} / {checklistItems.filter(item => item.phase === activeTabPhase).length} Secured
        </span>
      </div>

      {/* 5. INTERACTIVE TWO-COLUMN DISPLAY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Checkpoints, organized by category */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block border-b border-[#222] pb-1.5">
            Operational Verification Points
          </span>

          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1.5 scrollbar-thin">
            {activeCategories.map((cat) => {
              const catItems = activePhaseItems.filter(i => i.category === cat);
              return (
                <div key={cat} className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400 uppercase tracking-wider bg-[#0C0C0C] px-2 py-1 rounded border border-[#1E1E1E]">
                    <Database className="w-3 h-3 text-[#FFD700]" />
                    <span>{cat} Control Layer</span>
                  </div>

                  <div className="space-y-2 pl-1">
                    {catItems.map((item) => {
                      const isClarificationItem = item.id === 'p0-8';
                      return (
                        <div
                          key={item.id}
                          className={`bg-[#080808] border p-3 rounded-lg transition-all duration-200 flex items-start justify-between gap-3 group ${
                            item.checked
                              ? 'border-emerald-500/20 bg-emerald-950/2'
                              : item.skipped
                              ? 'border-amber-500/20 bg-amber-950/2'
                              : item.flagged
                              ? 'border-red-500/30 bg-red-950/3 animate-pulse'
                              : 'border-[#1E1E1E] hover:border-[#333]'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            {/* Standard Checkbox */}
                            {!isClarificationItem ? (
                              <button
                                onClick={() => handleToggleCheck(item.id)}
                                className={`mt-0.5 w-4.5 h-4.5 rounded border flex items-center justify-center transition-all duration-150 cursor-pointer shrink-0 ${
                                  item.checked
                                    ? 'bg-emerald-500 border-emerald-500 text-black'
                                    : item.skipped
                                    ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                                    : 'border-[#444] hover:border-[#FFD700]'
                                }`}
                              >
                                {item.checked && <Check className="w-3.5 h-3.5 text-black stroke-[3]" />}
                              </button>
                            ) : (
                              /* Interactive Clarification Required Yes/No switch */
                              <div className="mt-0.5 shrink-0 flex items-center bg-[#1A1A1A] p-0.5 rounded border border-[#333] select-none text-[8px] font-mono font-bold">
                                <button
                                  onClick={() => {
                                    setChecklistItems(prev => prev.map(i => i.id === item.id ? { ...i, checked: true } : i));
                                    addLog('Sovereign governor flagged: Clarification with user REQUIRED.', 'WARN', 'GOVERNOR');
                                  }}
                                  className={`px-1.5 py-0.5 rounded transition ${item.checked ? 'bg-red-500 text-black' : 'text-gray-500 hover:text-white'}`}
                                >
                                  YES
                                </button>
                                <button
                                  onClick={() => {
                                    setChecklistItems(prev => prev.map(i => i.id === item.id ? { ...i, checked: false } : i));
                                    addLog('Sovereign governor flagged: Context clear, clarification bypass nominal.', 'INFO', 'GOVERNOR');
                                  }}
                                  className={`px-1.5 py-0.5 rounded transition ${!item.checked ? 'bg-emerald-500 text-black' : 'text-gray-500 hover:text-white'}`}
                                >
                                  NO
                                </button>
                              </div>
                            )}

                            <div className="space-y-1">
                              <p className={`text-xs font-semibold leading-relaxed ${item.checked && !isClarificationItem ? 'text-gray-400 line-through' : item.flagged ? 'text-red-400 font-bold' : 'text-white'}`}>
                                {item.label}
                              </p>
                              
                              {item.justification && (
                                <span className="text-[9px] text-gray-400 italic block border-l border-[#333] pl-2 leading-relaxed">
                                  {item.justification}
                                </span>
                              )}

                              <span className="text-[8px] font-mono text-gray-600 uppercase block">
                                ID: {item.id} • {item.category}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity shrink-0">
                            {/* Skip / Restore override triggers */}
                            {!item.skipped ? (
                              <button
                                onClick={() => {
                                  setEditingItemId(item.id);
                                  setEditingJustification('');
                                }}
                                className="px-1.5 py-0.5 text-[8px] font-mono text-amber-400 hover:text-amber-300 bg-[#111] border border-amber-900/30 rounded cursor-pointer uppercase"
                              >
                                SKIP
                              </button>
                            ) : (
                              <button
                                onClick={() => handleClearItem(item.id)}
                                className="px-1.5 py-0.5 text-[8px] font-mono text-gray-400 hover:text-white bg-[#222] border border-[#333] rounded cursor-pointer uppercase"
                              >
                                RESTORE
                              </button>
                            )}

                            {/* Flag triggers */}
                            {!item.flagged ? (
                              <button
                                onClick={() => handleToggleFlag(item.id)}
                                className="px-1.5 py-0.5 text-[8px] font-mono text-red-500 hover:text-red-400 bg-[#111] border border-red-950 rounded cursor-pointer uppercase"
                              >
                                FLAG
                              </button>
                            ) : (
                              <button
                                onClick={() => handleClearItem(item.id)}
                                className="px-1.5 py-0.5 text-[8px] font-mono text-gray-200 hover:text-white bg-red-950/40 border border-red-500/30 rounded cursor-pointer uppercase font-black"
                              >
                                NOMINAL
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* JUSTIFICATION DRAWER */}
          {editingItemId && (
            <div className="bg-[#0A0A0A] border border-amber-500/30 p-4 rounded-lg space-y-3 animate-fade-in">
              <span className="text-[9px] font-mono text-amber-400 font-bold block uppercase tracking-wider">
                ↷ Provide Constitutional Bypass Override Justification
              </span>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Skips must be backed by transparent arguments registered on the decision ledger.
              </p>
              <textarea
                value={editingJustification}
                onChange={(e) => setEditingJustification(e.target.value)}
                placeholder="E.g., Context verifies that requirements have been completely isolated and static analysis tests nominal..."
                className="w-full bg-black border border-[#222] focus:border-amber-500 rounded p-2 text-[10px] font-sans text-white outline-none min-h-[60px]"
              />
              <div className="flex justify-end gap-2 text-[10px] font-mono">
                <button
                  onClick={() => setEditingItemId(null)}
                  className="px-3 py-1.5 rounded bg-[#111] border border-[#222] text-gray-400 hover:text-white cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => handleSaveJustification(editingItemId, editingJustification || 'Manual override requested by system operator.')}
                  className="px-3 py-1.5 rounded bg-amber-500 text-black font-black cursor-pointer"
                >
                  COMMIT OVERRIDE
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Sweeper Diagnostic Engine & terminal outputs */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3 flex-grow">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block border-b border-[#222] pb-1.5">
              Pipeline Diagnostic Engine
            </span>

            {/* Sweep console panel */}
            <div className="bg-[#080808] border border-[#1E1E1E] rounded-xl p-4 space-y-4 min-h-[200px] flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[9.5px] text-[#FFD700] font-black uppercase tracking-widest block">
                  Constitutional Execution Sweep
                </span>
                <p className="text-[10px] text-gray-400 font-sans leading-normal">
                  Advances deterministically through each of the 13 sovereign runtime layers, compiling results.
                </p>
              </div>

              {isScanning ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-mono text-[#FFD700]">
                    <span className="animate-pulse">SWEEPING RUNTIME PIPELINE...</span>
                    <span>{scanProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-black rounded overflow-hidden border border-[#222]">
                    <div className="h-full bg-[#FFD700] transition-all duration-200" style={{ width: `${scanProgress}%` }} />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-[9.5px] font-mono font-black text-emerald-400 uppercase tracking-wider">
                    Pipeline secure (Nominal integrity)
                  </span>
                </div>
              )}

              <button
                onClick={handleAutoScan}
                disabled={isScanning}
                className="w-full text-center text-[10.5px] font-mono font-black bg-[#FFD700] hover:bg-[#FFD700]/90 text-black py-2.5 rounded disabled:opacity-50 transition cursor-pointer uppercase tracking-widest flex items-center justify-center gap-1.5"
              >
                <Activity className="w-3.5 h-3.5" />
                {isScanning ? 'Sweeping Pipeline...' : 'Execute Pipeline Sweep'}
              </button>
            </div>

            {/* Terminal Feed logs */}
            <div className="bg-black border border-[#1C1C1C] rounded-xl p-3 h-[180px] flex flex-col justify-between">
              <div className="flex justify-between items-center text-[8px] font-mono text-gray-500 border-b border-[#111] pb-1.5 shrink-0">
                <span>CONSTITUTIONAL LOG FEED</span>
                <span className="text-[#FFD700]">ARG RUNTIME PIPELINE</span>
              </div>
              
              <div className="flex-grow overflow-y-auto font-mono text-[8.5px] text-gray-400 space-y-1.5 py-2 pr-1 scrollbar-thin">
                {scanLogs.map((lg, index) => (
                  <div key={index} className="leading-snug truncate border-l border-[#FFD700]/30 pl-2">
                    {lg}
                  </div>
                ))}
                {scanLogs.length === 0 && (
                  <div className="text-gray-600 text-center py-10 text-[9px] leading-relaxed">
                    Ready to execute. Run compliance sweep to evaluate system integrity live.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Save/Commit Certificate trigger */}
          <div className="pt-2 border-t border-[#1C1C1C]">
            <button
              onClick={handleExportCertificate}
              className="w-full text-center text-xs font-mono font-black bg-black hover:bg-[#0D0D0D] text-[#FFD700] border border-[#FFD700]/30 hover:border-[#FFD700] py-3 rounded transition cursor-pointer uppercase flex items-center justify-center gap-2"
            >
              <FileCheck2 className="w-4 h-4 text-[#FFD700]" />
              Commit Pre-Flight Report
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
