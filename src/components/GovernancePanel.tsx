/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  Shield,
  RefreshCw,
  AlertTriangle,
  Cpu,
  Activity,
  Zap,
  Lock,
  Sparkles,
  ClipboardCheck,
  FileCode,
  Upload,
  Play,
  ShieldAlert,
  Compass,
  Database,
  ArrowRight,
  Settings
} from 'lucide-react';
import { useRuntime } from '../core/RuntimeContext';
import { ARCHITECTURAL_DICTIONARY } from '../core/TranslationLayer';
import { GeminiAdapter } from '../adapters/geminiAdapter';
import { MandateAuditReport, RemoteData, PriorityGoal } from '../types';

interface AIChatLog {
  id: string;
  role: 'ATLAS' | 'ARGUS' | 'ADVISOR';
  text: string;
  timestamp: string;
}

interface ClientAuditFinding {
  mandate: string;
  passed: boolean;
  findings: string;
  recommendation: string;
}

const TEMPLATE_NON_COMPLIANT = `// Violates several ARGUS V12 mandates
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Heavy dependency instead of native fetch

export default function UserList() {
  const [users, setUsers] = useState<any[]>([]); // Violates Mandate 3: any type
  const [loading, setLoading] = useState(true); // Violates Mandate 1: Split boolean flags
  const [error, setError] = useState(false); // Violates Mandate 1: Split boolean flags

  useEffect(() => {
    // Violates Mandate 2: Missing AbortController / cancellation
    axios.get('https://api.example.com/users')
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>loading...</div>;
  if (error) return <div>error!</div>;

  return (
    // Violates Mandate 4: Non-accessible container structure
    <div onClick={() => console.log('clicked')}>
      {users.map(u => (
        <span key={u.id}>{u.name}</span>
      ))}
    </div>
  );
}`;

const TEMPLATE_COMPLIANT = `// Adheres strictly to ARGUS V12 Engineering Mandates
import React, { useEffect, useState } from 'react';
import { RemoteData } from './types'; // Mandate 5: Proper Separation of layers

interface User {
  id: string;
  name: string;
}

export default function UserList() {
  // Mandate 1: STATE DETERMINISM using RemoteData union state
  const [state, setState] = useState<RemoteData<User[]>>({ type: 'NOT_ASKED' });

  useEffect(() => {
    // Mandate 2: SIGNAL-DRIVEN ASYNCHRONY with AbortController
    const controller = new AbortController();
    
    setState({ type: 'LOADING' });

    async function fetchUsers() {
      try {
        const response = await fetch('https://api.example.com/users', {
          signal: controller.signal
        });
        
        // Mandate 8: ZERO-TRUST BOUNDARIES runtime validation
        if (!response.ok) {
          throw new Error(\`Network response error: \${response.status}\`);
        }
        
        const data: unknown = await response.json();
        
        // Runtime type assertion & check
        if (Array.isArray(data) && data.every(item => item && typeof item.id === 'string' && typeof item.name === 'string')) {
          setState({ type: 'SUCCESS', data: data as User[] }); // Mandate 3: Strict Types
        } else {
          throw new Error('Data format breach: invalid schema.');
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          // Mandate 9: INTRINSIC OBSERVABILITY logging
          console.error('[OBSERVABILITY_LOGGER] fetch failure', { error: err.message });
          setState({ type: 'FAILURE', error: err.message || 'Unknown compilation anomaly.' });
        }
      }
    }

    fetchUsers();

    return () => {
      // Clean teardown handle
      controller.abort();
    };
  }, []);

  // Structural accessibility (Mandate 4)
  if (state.type === 'LOADING') {
    return <div role="status" aria-label="Loading users list" className="text-sm font-mono text-[#FFD700]">Loading...</div>;
  }

  if (state.type === 'FAILURE') {
    return <div role="alert" className="text-sm font-mono text-red-500">Error: {state.error}</div>;
  }

  if (state.type === 'SUCCESS') {
    return (
      <ul aria-label="User registry" className="space-y-1">
        {state.data.map(user => (
          <li key={user.id} className="text-xs font-mono text-gray-300">
            ID: <span className="text-[#FFD700]">{user.id}</span> | Name: <span className="font-bold">{user.name}</span>
          </li>
        ))}
      </ul>
    );
  }

  return null;
}`;

function runClientSideLinter(codeStr: string): { score: number; findings: ClientAuditFinding[] } {
  const findings: ClientAuditFinding[] = [];
  
  // 1. STATE DETERMINISM
  const usesRemoteData = codeStr.includes('RemoteData');
  const usesSplitBooleans = /useState\s*\(\s*(true|false)\s*\)/.test(codeStr) && (codeStr.includes('loading') || codeStr.includes('error') || codeStr.includes('load'));
  if (usesSplitBooleans && !usesRemoteData) {
    findings.push({
      mandate: "M1: STATE DETERMINISM",
      passed: false,
      findings: "Detected split boolean loading/error state flags in code parameters.",
      recommendation: "Replace split states with a single unified RemoteData<T> union model."
    });
  } else {
    findings.push({
      mandate: "M1: STATE DETERMINISM",
      passed: true,
      findings: usesRemoteData ? "RemoteData union state is cleanly integrated." : "No split loading/error flags found.",
      recommendation: "Preserve deterministic transitions across state updates."
    });
  }

  // 2. SIGNAL-DRIVEN ASYNCHRONY
  const hasAsync = codeStr.includes('async') || codeStr.includes('fetch') || codeStr.includes('axios') || codeStr.includes('useEffect');
  const hasAbortController = codeStr.includes('AbortController') || codeStr.includes('signal:');
  if (hasAsync && !hasAbortController) {
    findings.push({
      mandate: "M2: SIGNAL-DRIVEN ASYNCHRONY",
      passed: false,
      findings: "Found un-cancellable asynchronous hooks or requests.",
      recommendation: "Inject an AbortController and bind its signal parameters to the fetch scope."
    });
  } else {
    findings.push({
      mandate: "M2: SIGNAL-DRIVEN ASYNCHRONY",
      passed: true,
      findings: hasAbortController ? "AbortController or cancellation signal found." : "No asynchronous requests needing abort handles.",
      recommendation: "Keep async scopes cleanly cancellable."
    });
  }

  // 3. STRICT TYPE BOUNDARIES
  const hasAnyType = /\bany\b|:\s*any\b|as\s+any\b|any\[\]/.test(codeStr);
  if (hasAnyType) {
    findings.push({
      mandate: "M3: STRICT TYPE BOUNDARIES",
      passed: false,
      findings: "Unsafe 'any' type cast or declaration found.",
      recommendation: "Define precise interfaces or use 'unknown' with type-safety checks."
    });
  } else {
    findings.push({
      mandate: "M3: STRICT TYPE BOUNDARIES",
      passed: true,
      findings: "Strict type integrity is preserved throughout.",
      recommendation: "Avoid future any casts to protect code compile safety."
    });
  }

  // 4. ZERO-TRUST BOUNDARIES
  const hasUnvalidatedJson = codeStr.includes('response.json()') && !codeStr.includes('typeof') && !codeStr.includes('zod') && !codeStr.includes('valibot') && !codeStr.includes('Array.isArray');
  if (hasUnvalidatedJson) {
    findings.push({
      mandate: "M8: ZERO-TRUST BOUNDARIES",
      passed: false,
      findings: "Response.json() parsed directly without validation guards.",
      recommendation: "Perform structure check using schemas or type-guards before accepting raw streams."
    });
  } else {
    findings.push({
      mandate: "M8: ZERO-TRUST BOUNDARIES",
      passed: true,
      findings: "Input schemas and validation guards appear properly handled.",
      recommendation: "Ensure all external data entry channels use runtime validations."
    });
  }

  const passedCount = findings.filter(f => f.passed).length;
  const score = Math.round((passedCount / findings.length) * 100);

  return { score, findings };
}

type SubTab = 'SAFEGUARDS' | 'COGNITIVE' | 'LINTER';

export default function GovernancePanel() {
  const {
    perspective,
    operatingState,
    addLog,
    addLedgerEvent,
    confidence,
    setConfidence,
    setMetrics
  } = useRuntime();

  const [activeSubTab, setActiveSubTab] = useState<SubTab>('SAFEGUARDS');

  // Terminology helper
  const t = (key: keyof typeof ARCHITECTURAL_DICTIONARY, part: 'term' | 'codename' | 'benefit' | 'description' | 'technicalRole' = 'term') => {
    const concept = ARCHITECTURAL_DICTIONARY[key];
    if (!concept) return '';
    if (part === 'term') {
      return perspective === 'customer' ? concept.term : `${concept.term} (${concept.codename})`;
    }
    return concept[part];
  };

  // --- Sub-Tab 1: Safeguards & Arbitration State ---
  const [arbitrationLog, setArbitrationLog] = useState<string[]>([]);
  const simulateConflict = () => {
    const conflicts = [
      '⚡ [CONFLICT] User requested experimental high-risk code generation. Core rule: Stability precedes expansion.',
      '⚖️ [ARBITRATION] P0 Identity Lock enforced: Restricting execution branch to verified sandbox.',
      '⚡ [CONFLICT] Pipeline attempt to import unverified library dependency. Core rule: Minimal Dependency first.',
      '⚖️ [ARBITRATION] Governor rejected import request. Forcing native AOT module fallback.'
    ];

    let delay = 0;
    conflicts.forEach(msg => {
      setTimeout(() => {
        setArbitrationLog(prev => [...prev, msg].slice(-8));
        addLog(msg, 'WARN', 'GOVERNOR');
      }, delay);
      delay += 500;
    });
  };

  // --- Sub-Tab 2: Cognitive Routing & Organism Layers ---
  const [taskInput, setTaskInput] = useState('');
  const [isRouting, setIsRouting] = useState(false);
  const [activeRoutingRole, setActiveRoutingRole] = useState<'NONE' | 'ADVISOR' | 'ATLAS' | 'ARGUS'>('NONE');

  const [adaptiveAutonomy, setAdaptiveAutonomy] = useState(false);
  const [cognitiveCache, setCognitiveCache] = useState(false);
  const [microIntent, setMicroIntent] = useState(false);
  const [selfHealing, setSelfHealing] = useState(false);

  const [atlasLogs, setAtlasLogs] = useState<AIChatLog[]>([
    { id: '1', role: 'ATLAS', text: '🌌 [ATLAS_MEM_ONLINE] - Memory Spine configured in read-through cache mode.', timestamp: '10:44:02' },
    { id: '2', role: 'ATLAS', text: '📖 Indexed ADR-004 & ADR-005. Verified 3 core knowledge objects.', timestamp: '10:44:20' }
  ]);

  const [argusLogs, setArgusLogs] = useState<AIChatLog[]>([
    { id: '1', role: 'ARGUS', text: '🛠️ [ARGUS_ENGINE_ACTIVE] - Shifting to active branch: /server/runtime.', timestamp: '10:44:02' },
    { id: '2', role: 'ARGUS', text: '⚖️ Running static linter against 9 mandates... 100% compliant.', timestamp: '10:44:31' }
  ]);

  const [advisorLogs, setAdvisorLogs] = useState<AIChatLog[]>([
    { id: '1', role: 'ADVISOR', text: '💡 [ADVISOR_ACTIVE] - Standing by to audit design alternatives and risk.', timestamp: '10:44:02' },
    { id: '2', role: 'ADVISOR', text: '📋 Recommendation: Focus on consolidation of core primitives before trading.', timestamp: '10:44:42' }
  ]);

  const [unifiedResponse, setUnifiedResponse] = useState<string | null>(null);

  const handleRouteTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim() || isRouting) return;

    const prompt = taskInput.trim();
    setIsRouting(true);
    setUnifiedResponse(null);
    addLog(`Routing task: "${prompt}" through Governor priority arbitrator.`, 'INFO', 'GOVERNOR');
    addLedgerEvent(`COGNITIVE_TASK_ROUTE -> "${prompt.substring(0, 25)}..."`);

    setActiveRoutingRole('ADVISOR');
    const advisorRes = await GeminiAdapter.processQuery({ prompt, contextMode: 'ADVISOR', operatingState });
    setAdvisorLogs(prev => [...prev, { id: String(Date.now()), role: 'ADVISOR', text: advisorRes.rawResponse, timestamp: new Date().toLocaleTimeString() }]);
    addLog('Strategic Advisor analysis complete. Routing to memory index...', 'INFO', 'AGENT');

    setActiveRoutingRole('ATLAS');
    const atlasRes = await GeminiAdapter.processQuery({ prompt, contextMode: 'ATLAS', operatingState });
    setAtlasLogs(prev => [...prev, { id: String(Date.now() + 1), role: 'ATLAS', text: atlasRes.rawResponse, timestamp: new Date().toLocaleTimeString() }]);
    addLog('Atlas Memory lineage matched. Dispatching code compiler...', 'INFO', 'AGENT');

    setActiveRoutingRole('ARGUS');
    const argusRes = await GeminiAdapter.processQuery({ prompt, contextMode: 'ARGUS', operatingState });
    setArgusLogs(prev => [...prev, { id: String(Date.now() + 2), role: 'ARGUS', text: argusRes.rawResponse, timestamp: new Date().toLocaleTimeString() }]);
    addLog('ARGUS constraints verified. Processing final synthesis.', 'SYSTEM', 'APEX');

    setActiveRoutingRole('NONE');
    setIsRouting(false);
    setTaskInput('');

    if (argusRes.systemActionRequired && argusRes.actionPayload) {
      addLog(`[ACTION TRIGGERED] ${argusRes.actionPayload.details}`, 'WARN', 'GOVERNOR');
      addLedgerEvent(`AUTONOMOUS_ACTION_DISPATCH -> ${argusRes.actionPayload.type}`);
      if (confidence < 0.6) setConfidence(0.98);
    }

    setUnifiedResponse(
      `🚀 [UNIFIED PRIORITY RESOLUTION]\n\n` +
      `1. ADVISOR (Strategic Utility): ${advisorRes.rawResponse.split('\n')[1] || 'Approved.'}\n` +
      `2. ATLAS (Memory Anchor): ${atlasRes.rawResponse.split('\n')[1] || 'Lineage verified.'}\n` +
      `3. ARGUS (Systemic Safeguard): ${argusRes.rawResponse.split('\n')[1] || '100% compliant with S7 Constitutional Core.'}`
    );

    setMetrics(prev => ({
      ...prev,
      speed: Math.max(5, prev.speed - 1),
      leverage: +(prev.leverage + 0.15).toFixed(2),
      metabolicCost: prev.metabolicCost + 4
    }));
  };

  const handleToggleAdaptiveAutonomy = () => {
    const val = !adaptiveAutonomy;
    setAdaptiveAutonomy(val);
    if (val) {
      addLog('Activated Adaptive Autonomy Layer. Self-adjusting thresholds engaged.', 'INFO', 'SEED');
      setMetrics(prev => ({ ...prev, leverage: +(prev.leverage + 0.4).toFixed(2), metabolicCost: prev.metabolicCost + 5 }));
    } else {
      addLog('Deactivated Adaptive Autonomy Layer.', 'WARN', 'SEED');
      setMetrics(prev => ({ ...prev, leverage: +(prev.leverage - 0.4).toFixed(2), metabolicCost: prev.metabolicCost - 5 }));
    }
  };

  const handleToggleCognitiveCache = () => {
    const val = !cognitiveCache;
    setCognitiveCache(val);
    if (val) {
      addLog('Engaged Local Cognitive Cache. Storing last decisions & user patterns locally.', 'INFO', 'SPINE');
      setMetrics(prev => ({ ...prev, speed: Math.max(4, prev.speed - 3), metabolicCost: prev.metabolicCost + 3 }));
    } else {
      addLog('Disengaged Local Cognitive Cache.', 'WARN', 'SPINE');
      setMetrics(prev => ({ ...prev, speed: prev.speed + 3, metabolicCost: prev.metabolicCost - 3 }));
    }
  };

  const handleToggleMicroIntent = () => {
    const val = !microIntent;
    setMicroIntent(val);
    if (val) {
      addLog('Micro-Intent Engine online. Reading gestures, hesitation states, and micro-delays.', 'INFO', 'AGENT');
      setMetrics(prev => ({ ...prev, leverage: +(prev.leverage + 0.3).toFixed(2), metabolicCost: prev.metabolicCost + 4 }));
    } else {
      addLog('Micro-Intent Engine offline.', 'WARN', 'AGENT');
      setMetrics(prev => ({ ...prev, leverage: +(prev.leverage - 0.3).toFixed(2), metabolicCost: prev.metabolicCost - 4 }));
    }
  };

  const handleToggleSelfHealing = () => {
    const val = !selfHealing;
    setSelfHealing(val);
    if (val) {
      addLog('Self-Healing Runtime active. Anomaly diagnostics and automated state recovery online.', 'SYSTEM', 'GOVERNOR');
      setMetrics(prev => ({ ...prev, correctness: 100, continuity: 100, metabolicCost: prev.metabolicCost + 6 }));
    } else {
      addLog('Self-Healing Runtime disabled.', 'WARN', 'GOVERNOR');
    }
  };


  // --- Sub-Tab 3: Interactive Mandate Linter ---
  const [code, setCode] = useState<string>(TEMPLATE_NON_COMPLIANT);
  const [auditResult, setAuditResult] = useState<RemoteData<MandateAuditReport>>({ type: 'NOT_ASKED' });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setCode(event.target.result);
          addLog(`Loaded source code from local file: "${files[0].name}"`, 'INFO', 'APEX');
        }
      };
      reader.readAsText(files[0]);
    }
  };

  const runAudit = async () => {
    setAuditResult({ type: 'LOADING' });
    addLog('Initiating Static Mandate Analysis on target codebase...', 'SYSTEM', 'APEX');

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      if (!response.ok) {
        throw new Error(`Audit server responded with state: ${response.status}`);
      }

      const data: MandateAuditReport = await response.json();
      setAuditResult({ type: 'SUCCESS', data });
      addLog(`Audit completed with compliance score: ${data.score}% (${data.passed ? 'PASSED' : 'REJECTED'})`, data.passed ? 'INFO' : 'ERROR', 'APEX');
    } catch (err: any) {
      setAuditResult({ type: 'FAILURE', error: err.message || 'An unknown compilation breakdown occurred.' });
      addLog(`Static compiler failure: ${err.message}`, 'ERROR', 'APEX');
    }
  };

  const loadTemplate = (type: 'compliant' | 'non-compliant') => {
    if (type === 'compliant') {
      setCode(TEMPLATE_COMPLIANT);
      addLog('Loaded standard ARGUS-compliant reference template.', 'INFO', 'APEX');
    } else {
      setCode(TEMPLATE_NON_COMPLIANT);
      addLog('Loaded standard non-compliant reference template.', 'INFO', 'APEX');
    }
  };

  return (
    <div className="bg-[#0A0A0A] border border-[#222] rounded-lg p-5 flex flex-col space-y-6" id="governance-service-dashboard">
      
      {/* Tab select bar */}
      <div className="flex border-b border-[#222] pb-1.5 gap-2 shrink-0 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('SAFEGUARDS')}
          className={`px-3 py-1.5 text-xs font-mono font-bold border transition rounded ${
            activeSubTab === 'SAFEGUARDS'
              ? 'bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700]'
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          Constitutional Core & Safeguards
        </button>
        <button
          onClick={() => setActiveSubTab('COGNITIVE')}
          className={`px-3 py-1.5 text-xs font-mono font-bold border transition rounded ${
            activeSubTab === 'COGNITIVE'
              ? 'bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700]'
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          Cognitive Command Cockpit
        </button>
        <button
          onClick={() => setActiveSubTab('LINTER')}
          className={`px-3 py-1.5 text-xs font-mono font-bold border transition rounded ${
            activeSubTab === 'LINTER'
              ? 'bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700]'
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          Interactive Mandate Linter
        </button>
      </div>

      {/* Dynamic Sub-tab Views */}
      <div className="min-h-[440px]">
        
        {/* VIEW 1: Constitutional Core */}
        {activeSubTab === 'SAFEGUARDS' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            {/* Left Card: Immutable Seed Info */}
            <div className="bg-[#050505] border border-[#222] rounded p-5 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 border-b border-[#222] pb-3 mb-4">
                  <Shield className="text-[#FFD700] w-5 h-5" />
                  <div>
                    <h2 className="text-xs font-mono font-bold uppercase text-gray-200">{t('IMMUTABLE_SEED')}</h2>
                    <span className="text-[9px] font-mono text-gray-500 uppercase">Layer 1 Sovereignty</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {t('IMMUTABLE_SEED', 'description')}
                  </p>
                  
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-gray-500 uppercase block">Absolute Identity Locks</span>
                    <div className="bg-[#111] p-2 rounded border border-[#222] text-xs space-y-1 font-mono">
                      <div className="flex justify-between">
                        <span className="text-gray-300">1. Truth &gt; Persuasion</span>
                        <span className="text-[#FFD700] font-bold text-[9px] uppercase">Locked</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">2. Stability &gt; Growth</span>
                        <span className="text-[#FFD700] font-bold text-[9px] uppercase">Locked</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">3. Operator Sovereignty</span>
                        <span className="text-[#FFD700] font-bold text-[9px] uppercase">Locked</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-[#111]">
                <span className="text-[9px] font-mono text-gray-500 block uppercase">Technical Role</span>
                <p className="text-[10px] text-gray-400 font-mono leading-normal mt-1">
                  {t('IMMUTABLE_SEED', 'technicalRole')}
                </p>
              </div>
            </div>

            {/* Right Card: Intent Arbitration Simulation */}
            <div className="bg-[#050505] border border-[#222] rounded p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#222] pb-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <Activity className="text-[#FFD700] w-5 h-5 animate-pulse" />
                    <div>
                      <h2 className="text-xs font-mono font-bold uppercase text-gray-200">Intent Arbitration Simulator</h2>
                      <span className="text-[9px] font-mono text-gray-500 uppercase">Policy Conflicts Resolver</span>
                    </div>
                  </div>
                  <button
                    onClick={simulateConflict}
                    className="text-[9px] font-mono bg-[#111] hover:bg-[#1A1A1A] border border-[#222] text-[#FFD700] px-3 py-1.5 rounded transition uppercase font-bold"
                  >
                    Simulate Conflict
                  </button>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  Test how the unalterable rules handle conflicting operational goals in real-time, pacing and filtering rogue intents.
                </p>

                <div className="bg-[#080808] border border-[#222] p-3.5 rounded-lg h-52 overflow-y-auto font-mono text-[10px] text-gray-400 space-y-2 scrollbar-thin">
                  {arbitrationLog.length === 0 ? (
                    <div className="text-center py-16 text-gray-600 block">
                      [GOVERNOR STATE: IDLE / PATROLLING BOUNDS]
                      <p className="text-[9px] text-gray-700 mt-1 uppercase">Click simulate above to inject a conflict event</p>
                    </div>
                  ) : (
                    arbitrationLog.map((log, i) => (
                      <div key={i} className="border-l-2 border-[#FFD700] pl-2.5 py-0.5 leading-relaxed animate-fade-in text-gray-300">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="text-[9px] font-mono text-center text-gray-600 mt-4 leading-normal uppercase">
                Sovereign governance dictates that safety, stability, and operator orders outrank any speculative sub-intent.
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Conversational Task Router & Layers */}
        {activeSubTab === 'COGNITIVE' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
            {/* Left 4 Organism Layers (3 columns) */}
            <div className="lg:col-span-4 bg-[#050505] border border-[#222] p-4 rounded-lg flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-[#222] pb-2">
                  <Settings className="w-3.5 h-3.5 text-[#FFD700]" />
                  The 4 Organism Layers
                </span>
                <p className="text-[10px] text-gray-500 font-mono leading-relaxed">
                  These operational layers dynamically self-tune the system parameters to create a resilient, organic agent.
                </p>

                <div className="space-y-4 pt-1">
                  {/* Layer 1: Adaptive Autonomy */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-white font-bold block">1. Adaptive Autonomy</span>
                      <span className="text-[8px] text-gray-500 block leading-tight">Self-tuning decision weights</span>
                    </div>
                    <button
                      onClick={handleToggleAdaptiveAutonomy}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${adaptiveAutonomy ? 'bg-[#FFD700]' : 'bg-[#222]'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-black transition-transform ${adaptiveAutonomy ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Layer 2: Cognitive Cache */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-white font-bold block">2. Cognitive Cache</span>
                      <span className="text-[8px] text-gray-500 block leading-tight">Fast, offline judgment store</span>
                    </div>
                    <button
                      onClick={handleToggleCognitiveCache}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${cognitiveCache ? 'bg-[#FFD700]' : 'bg-[#222]'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-black transition-transform ${cognitiveCache ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Layer 3: Micro-Intent Engine */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-white font-bold block">3. Micro-Intent Engine</span>
                      <span className="text-[8px] text-gray-500 block leading-tight">Reacts to hesitation & delays</span>
                    </div>
                    <button
                      onClick={handleToggleMicroIntent}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${microIntent ? 'bg-[#FFD700]' : 'bg-[#222]'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-black transition-transform ${microIntent ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Layer 4: Self-Healing Runtime */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-white font-bold block">4. Self-Healing Runtime</span>
                      <span className="text-[8px] text-gray-500 block leading-tight">Detects anomalies & rolls back</span>
                    </div>
                    <button
                      onClick={handleToggleSelfHealing}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${selfHealing ? 'bg-[#FFD700]' : 'bg-[#222]'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-black transition-transform ${selfHealing ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#111] pt-3 mt-4">
                <div className="flex justify-between text-[9px] font-mono text-gray-600">
                  <span>METABOLIC COST:</span>
                  <span className="text-[#FFD700] font-bold">ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Right Chat Router (8 columns) */}
            <div className="lg:col-span-8 flex flex-col space-y-4">
              
              {/* Split Chat Columns */}
              <div className="grid grid-cols-3 gap-2 flex-grow h-[260px]">
                {/* Advisor Column */}
                <div className={`bg-[#050505] border rounded p-2.5 flex flex-col justify-between transition-all duration-300 ${activeRoutingRole === 'ADVISOR' ? 'border-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.05)]' : 'border-[#222]'}`}>
                  <div className="border-b border-[#222] pb-1.5 mb-2 flex justify-between items-center">
                    <span className="text-[9px] font-mono text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-[#FFD700]" />
                      ADVISOR
                    </span>
                    <span className="text-[7px] font-mono text-gray-500">Strategic</span>
                  </div>
                  <div className="flex-grow overflow-y-auto space-y-2 text-[8px] font-mono text-gray-400 pr-1 scrollbar-thin">
                    {advisorLogs.map(l => (
                      <div key={l.id} className="border-b border-[#111] pb-1 leading-normal">
                        <span className="text-gray-600">[{l.timestamp}]</span> <span className="text-gray-300">{l.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Atlas Column */}
                <div className={`bg-[#050505] border rounded p-2.5 flex flex-col justify-between transition-all duration-300 ${activeRoutingRole === 'ATLAS' ? 'border-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.05)]' : 'border-[#222]'}`}>
                  <div className="border-b border-[#222] pb-1.5 mb-2 flex justify-between items-center">
                    <span className="text-[9px] font-mono text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Database className="w-3 h-3 text-[#FFD700]" />
                      ATLAS
                    </span>
                    <span className="text-[7px] font-mono text-gray-500">Memory</span>
                  </div>
                  <div className="flex-grow overflow-y-auto space-y-2 text-[8px] font-mono text-gray-400 pr-1 scrollbar-thin">
                    {atlasLogs.map(l => (
                      <div key={l.id} className="border-b border-[#111] pb-1 leading-normal">
                        <span className="text-gray-600">[{l.timestamp}]</span> <span className="text-gray-300">{l.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Argus Column */}
                <div className={`bg-[#050505] border rounded p-2.5 flex flex-col justify-between transition-all duration-300 ${activeRoutingRole === 'ARGUS' ? 'border-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.05)]' : 'border-[#222]'}`}>
                  <div className="border-b border-[#222] pb-1.5 mb-2 flex justify-between items-center">
                    <span className="text-[9px] font-mono text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Shield className="w-3 h-3 text-[#FFD700]" />
                      ARGUS
                    </span>
                    <span className="text-[7px] font-mono text-gray-500">Safeguard</span>
                  </div>
                  <div className="flex-grow overflow-y-auto space-y-2 text-[8px] font-mono text-gray-400 pr-1 scrollbar-thin">
                    {argusLogs.map(l => (
                      <div key={l.id} className="border-b border-[#111] pb-1 leading-normal">
                        <span className="text-gray-600">[{l.timestamp}]</span> <span className="text-gray-300">{l.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Unified Resolution output */}
              {unifiedResponse && (
                <div className="bg-emerald-950/15 border border-emerald-900/30 p-3 rounded-lg text-[10px] font-mono text-emerald-400 leading-normal animate-fade-in shrink-0">
                  <pre className="whitespace-pre-wrap font-sans leading-relaxed">{unifiedResponse}</pre>
                </div>
              )}

              {/* Router Input Box */}
              <form onSubmit={handleRouteTask} className="flex gap-2 shrink-0">
                <input
                  type="text"
                  placeholder="Enter request or compliance query to arbitrate through layers..."
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  className="flex-grow bg-[#111] border border-[#222] focus:border-[#FFD700]/50 text-xs font-mono px-3 py-2.5 rounded text-white outline-none"
                  disabled={isRouting}
                />
                <button
                  type="submit"
                  disabled={!taskInput.trim() || isRouting}
                  className="bg-[#FFD700] hover:bg-[#E5C100] disabled:opacity-50 text-black text-xs font-mono font-bold px-4 rounded transition cursor-pointer flex items-center gap-1 uppercase"
                >
                  {isRouting ? 'Routing...' : 'Route Query'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

            </div>
          </div>
        )}

        {/* VIEW 3: Static Compiler Linter */}
        {activeSubTab === 'LINTER' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fade-in">
            {/* Linter Left (Code Editor & Instant finding) */}
            <div className="lg:col-span-7 flex flex-col space-y-3">
              <div className="flex justify-between items-center bg-[#050505] border border-[#222] px-3 py-1.5 rounded">
                <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-[#FFD700]" />
                  TARGET_VERIFICATION.TS
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".ts,.tsx,.js,.jsx"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[9px] font-mono text-gray-400 hover:text-white border border-[#222] px-2.5 py-1 rounded bg-[#111] transition"
                  >
                    Select File
                  </button>
                  <button
                    onClick={runAudit}
                    disabled={auditResult.type === 'LOADING'}
                    className="text-[9px] font-mono font-bold bg-[#FFD700] hover:bg-[#E5C100] text-black px-3 py-1 rounded transition uppercase shadow-[0_0_8px_rgba(255,215,0,0.15)] flex items-center gap-1"
                  >
                    <Play className="w-2.5 h-2.5 fill-black" />
                    Verify Mandates
                  </button>
                </div>
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-64 bg-[#050505] text-gray-300 font-mono text-xs p-4 border border-[#222] focus:outline-none focus:border-[#FFD700]/30 resize-none leading-relaxed rounded-lg"
                placeholder="Paste code or choose a template below..."
              />

              <div className="flex gap-2">
                <button
                  onClick={() => loadTemplate('non-compliant')}
                  className="flex-grow text-[9px] font-mono bg-[#111] hover:bg-[#1A1A1A] text-red-400 border border-red-950 px-2.5 py-1.5 rounded transition uppercase font-bold"
                >
                  Load Non-Compliant Sandbox
                </button>
                <button
                  onClick={() => loadTemplate('compliant')}
                  className="flex-grow text-[9px] font-mono bg-[#111] hover:bg-[#1A1A1A] text-[#FFD700] border border-[#FFD700]/20 px-2.5 py-1.5 rounded transition uppercase font-bold"
                >
                  Load Compliant Template
                </button>
              </div>

              {/* Instant keystroke heuristic bar */}
              <div className="bg-[#050505] border border-[#222] p-3 rounded-lg space-y-1.5 text-[9px] font-mono">
                <div className="flex justify-between text-[#FFD700] font-bold border-b border-[#111] pb-1 uppercase">
                  <span>Keystroke Live Diagnostics</span>
                  <span>Score: {runClientSideLinter(code).score}%</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {runClientSideLinter(code).findings.map((f, i) => (
                    <div key={i} className={`p-2 rounded border flex flex-col justify-between ${f.passed ? 'bg-emerald-950/5 border-emerald-900/10 text-gray-400' : 'bg-red-950/10 border-red-900/20 text-gray-300'}`}>
                      <div className="flex justify-between font-bold">
                        <span>{f.mandate}</span>
                        <span className={f.passed ? 'text-[#FFD700]' : 'text-red-400'}>{f.passed ? '✓ PASS' : '✗ DRIFT'}</span>
                      </div>
                      <p className="text-[8px] text-gray-500 leading-tight mt-0.5">{f.findings}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Linter Right (Full Audit Report) */}
            <div className="lg:col-span-5 flex flex-col space-y-3">
              <div className="bg-[#111] px-3 py-1.5 rounded border border-[#222]">
                <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1.5 uppercase">
                  <ClipboardCheck className="w-3.5 h-3.5 text-[#FFD700]" />
                  Constitutional static linter
                </span>
              </div>

              <div className="bg-[#050505] border border-[#222] rounded-lg p-4 h-full min-h-[300px] flex flex-col justify-between overflow-y-auto scrollbar-thin">
                {auditResult.type === 'NOT_ASKED' && (
                  <div className="text-center py-20 text-gray-600 font-mono text-xs">
                    [STANDBY: AWAITING CODE SOURCE]
                    <p className="text-[10px] text-gray-700 uppercase mt-1">Paste code or load a template and click "Verify Mandates"</p>
                  </div>
                )}

                {auditResult.type === 'LOADING' && (
                  <div className="text-center py-20 text-[#FFD700] font-mono text-xs flex flex-col items-center justify-center gap-3">
                    <RefreshCw className="animate-spin w-6 h-6" />
                    <span>PARSING ABSTRACT SYNTAX TREE (AST)...</span>
                  </div>
                )}

                {auditResult.type === 'FAILURE' && (
                  <div className="bg-red-950/20 border border-red-900/30 p-3.5 rounded-lg font-mono text-[10px] text-red-400">
                    <p className="font-bold mb-1">COMPLIANCE CRITICAL FAULT:</p>
                    {auditResult.error}
                  </div>
                )}

                {auditResult.type === 'SUCCESS' && (
                  <div className="space-y-4 animate-fade-in">
                    {/* Overall audit outcome */}
                    <div className="flex items-center justify-between p-3.5 bg-[#111] border border-[#222] rounded-lg">
                      <div>
                        <span className="text-[9px] font-mono text-gray-500 uppercase block">Audit Compliance Score</span>
                        <h3 className="text-lg font-black font-mono text-white mt-0.5">{auditResult.data.score}%</h3>
                      </div>
                      <span className={`text-xs font-mono font-bold px-3 py-1 rounded uppercase ${
                        auditResult.data.passed 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.15)]' 
                          : 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse'
                      }`}>
                        {auditResult.data.passed ? 'PASSED (STABLE)' : 'REJECTED (DRIFT)'}
                      </span>
                    </div>

                    {/* Detailed findings list */}
                    <div className="space-y-3">
                      <span className="text-[9px] font-mono text-gray-500 uppercase block">Linter Finding Breakdown ({auditResult.data.findings.length} points)</span>
                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                        {auditResult.data.findings.map((f, i) => (
                          <div key={i} className={`p-2.5 rounded border text-[10px] leading-relaxed ${
                            f.passed 
                              ? 'bg-[#111] border-[#222] text-gray-400' 
                              : 'bg-red-950/15 border-red-900/20 text-gray-200'
                          }`}>
                            <div className="flex justify-between items-center mb-1 font-mono">
                              <span className="font-bold text-gray-200">{f.mandate}</span>
                              <span className={f.passed ? 'text-[#FFD700] font-bold' : 'text-red-400 font-black'}>
                                {f.passed ? 'PASS' : 'BREACH'}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-400">{f.findings}</p>
                            {!f.passed && f.recommendation && (
                              <p className="text-[9px] text-red-400 font-bold border-t border-red-900/10 pt-1 mt-1.5 font-mono">
                                Action Needed: {f.recommendation}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
