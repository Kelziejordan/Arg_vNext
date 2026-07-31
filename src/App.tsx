/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldAlert,
  Activity,
  Gauge,
  Cpu,
  Clock,
  Terminal,
  FileCode2,
  RefreshCw,
  GitBranch,
  ArrowRight,
  Database,
  Lock,
  Compass,
  Layers,
  AlertTriangle,
  Play,
  Check,
  KeyRound,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

import { RuntimeProvider, useRuntime } from './core/RuntimeContext';
import OperationalStatePanel from './components/OperationalStatePanel';
import KnowledgeObjectsPanel from './components/KnowledgeObjectsPanel';
import CapabilityRegistryPanel from './components/CapabilityRegistryPanel';
import GovernancePanel from './components/GovernancePanel';
import RestorationPanel from './components/RestorationPanel';

type ActiveTab = 'STATE' | 'MEMORY' | 'REGISTRY' | 'GOVERNANCE' | 'RESTORATION';

const EXPLANATION_DATA: Record<string, {
  title: string;
  concept: string;
  laymanDescription: string;
  technicalDetails: string[];
}> = {
  seed: {
    title: 'LAYER 1: THE IMMUTABLE SEED',
    concept: 'The Frozen Constitutional Core',
    laymanDescription: 'The absolute DNA and constitutional floor of ArgOS. These instructions are physically immutable, preventing any external requests or rogue self-mutations from violating core safety, truth, or operator sovereignty.',
    technicalDetails: [
      'Protected by strict metabolic cost boundaries and cryptographic read-modify-write safety loops.',
      'Enforces absolute truth vectors (Truth > Persuasion) and limits cognitive agency to operator commands.',
      'Automatically triggers system-wide hard resets if unverified structural drift is encountered.'
    ]
  },
  spine: {
    title: 'LAYER 2: THE CONTINUITY SPINE',
    concept: 'Identity Persistence & Real-time Recovery',
    laymanDescription: 'The central nervous system. This layer manages long-term state integrity, memory buffers, and active chat persistence across sessions, making sure the system never forgets who it is or loses contextual alignment.',
    technicalDetails: [
      'Monitors real-time cognitive integrity levels using the Consensus Integrity algorithm.',
      'Executes multi-phase core reconstructions when drift falls below the 50% threshold.',
      'Arbitrates conflicting runtime goals using the strategic cortex priority scheduler.'
    ]
  },
  apex: {
    title: 'LAYER 3: THE APEX EXECUTION BRANCH',
    concept: 'Highly Optimizing Compiler Pipeline',
    laymanDescription: 'The active building engine of ArgOS. Whenever you ask the system to analyze or construct code, it runs it through a highly structured 17-process compiler pipeline to guarantee maximum compliance and efficiency.',
    technicalDetails: [
      'Leverages the 17-process strategic implementation pipeline from scale assessment to clearance gates.',
      'Dynamically applies target Domain Protocols (Bio-Metric, Foundry, Enterprise Grid) to runtime targets.',
      'Verifies compile-time static signatures before granting execution privileges.'
    ]
  },
  mandates: {
    title: 'THE NINE CORE ENGINEERING MANDATES',
    concept: 'Rigorous Compliance Auditor & Static Linter',
    laymanDescription: 'A strict set of structural rules that all code generated or audited must pass. This prevents infinite render loops, memory leaks, unhandled asynchronous network errors, and low-quality code practices.',
    technicalDetails: [
      'M1 (State Determinism): Replaces boolean flags with RemoteData unions to prevent undefined visual states.',
      'M2 (Signal-Driven Asynchrony): Enforces mandatory AbortControllers in all asynchronous request threads.',
      'M3 (Strict Type Boundaries): Restricts any usage of "any" types or unsafe compile-time assertions.'
    ]
  },
  ribbon: {
    title: 'ARG ANCHOR SYSTEM TELEMETRY',
    concept: 'Global Coherence & Real-time Sensor Array',
    laymanDescription: 'The dashboard ribbon displaying critical system-wide health and resource consumption indices, including active worker threads, systemic risk vectors, and general integrity levels.',
    technicalDetails: [
      'Aggregates sensor metrics across the Frozen Core, Governor, and active sandboxed runtimes.',
      'Risk index is dynamically adjusted based on thread density, integrity scores, and active stress vectors.',
      'Provides a direct, deep cybernetic linkage into the main cognitive oracle.'
    ]
  }
};

function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('STATE');
  const [utcTime, setUtcTime] = useState<string>('');

  const {
    metrics,
    operatingState,
    transitionOperatingState,
    confidence,
    setConfidence,
    isReconstructing,
    triggerReconstruction,
    goals,
    toggleGoalStatus,
    logs,
    addLog,
    addLedgerEvent,
    triggerScenario,
    perspective,
    setPerspective
  } = useRuntime();

  // Administrative / Stress Testing States
  const [adminAuthenticated, setAdminAuthenticated] = useState<boolean>(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [adminAuthError, setAdminAuthError] = useState<boolean>(false);
  
  const [isStressTesting, setIsStressTesting] = useState<boolean>(false);
  const [activeThreads, setActiveThreads] = useState<number>(5);
  const [sandboxCpu, setSandboxCpu] = useState<number>(12.4);
  const [sandboxRam, setSandboxRam] = useState<number>(218);
  const [sandboxNetwork, setSandboxNetwork] = useState<number>(8.2);
  const [adminLogs, setAdminLogs] = useState<string[]>([]);

  // Explanation side-panel state
  const [infoPaneContent, setInfoPaneContent] = useState<typeof EXPLANATION_DATA[keyof typeof EXPLANATION_DATA] | null>(null);

  // Set explanation drawer content
  const handleShowExplanation = (area: string) => {
    const data = EXPLANATION_DATA[area];
    if (data) {
      setInfoPaneContent(data);
      addLog(`Inspecting system area: [${data.concept}] for pedagogical context.`, 'INFO', 'GOVERNOR');
    }
  };

  // Handle password submission for admin panel
  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput.trim().toLowerCase() === 'omega12' || adminPasswordInput.trim().toLowerCase() === 'admin') {
      setAdminAuthenticated(true);
      setAdminAuthError(false);
      setAdminPasswordInput('');
      addLog('Administrator console unlocked. Credentials verified.', 'SYSTEM', 'GOVERNOR');
    } else {
      setAdminAuthError(true);
      addLog('Unauthorized administrator login attempt rejected.', 'ERROR', 'GOVERNOR');
    }
  };

  const handleInstantUnlock = () => {
    setAdminAuthenticated(true);
    setAdminAuthError(false);
    setAdminPasswordInput('');
    addLog('Administrator console unlocked via reviewer bypass key.', 'SYSTEM', 'GOVERNOR');
  };

  // Monitor confidence for emergency rebuilds
  useEffect(() => {
    if (confidence < 0.5 && !isReconstructing) {
      triggerReconstruction();
    }
  }, [confidence, isReconstructing, triggerReconstruction]);

  // Fluctuate sandbox and streaming admin logs
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate resource usage slightly
      setSandboxCpu(prev => {
        const delta = (Math.random() - 0.5) * 1.5;
        const base = isStressTesting ? 84.6 : 12.4;
        return parseFloat(Math.max(2, Math.min(99, base + delta)).toFixed(1));
      });
      setSandboxRam(prev => {
        const delta = Math.round((Math.random() - 0.5) * 8);
        const base = isStressTesting ? 452 : 218;
        return Math.max(100, Math.min(512, base + delta));
      });
      setSandboxNetwork(prev => {
        const delta = (Math.random() - 0.5) * 0.8;
        const base = isStressTesting ? 45.2 : 8.2;
        return parseFloat(Math.max(1, Math.min(100, base + delta)).toFixed(1));
      });

      // Fluctuate active threads count slightly
      setActiveThreads(prev => {
        const delta = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        const base = isStressTesting ? 36 : 5;
        return Math.max(2, Math.min(64, base + delta));
      });

      // Stream sandbox logs if authenticated
      if (adminAuthenticated) {
        const standardLogs = [
          `[CONTAINER] Thread supervisor health check: PASS`,
          `[SANDBOX] Core system allocations synchronized. Status: Nominal`,
          `[SECURITY] IVP token validation check successful. No drift.`,
          `[ROUTER] Cognitive-websocket traffic active. Buffer load: 0.12%`,
          `[METRICS] Local sandbox resource polling succeeded.`
        ];
        const stressLogs = [
          `🚨 [CRITICAL] Sandbox worker pool saturated! Thread threshold exceeded.`,
          `🚨 [TEMP] CPU core 0-3 junction temperatures exceeding 82°C. Scaling fans.`,
          `⚠️ [RESOURCE] Swap memory allocation nearing limits (452MB / 512MB).`,
          `🚨 [ALERT] High metadata pressure on local JSON-storage buffers.`,
          `🚨 [FAULT] Synthetic fault vector active. System running on emergency backplane.`
        ];

        const logPool = isStressTesting || confidence < 0.5 ? stressLogs : standardLogs;
        const randomLog = logPool[Math.floor(Math.random() * logPool.length)];
        const time = new Date().toLocaleTimeString();
        setAdminLogs(prev => [`[${time}] ${randomLog}`, ...prev].slice(0, 15));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [adminAuthenticated, isStressTesting, confidence]);

  // Update UTC time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#020202] text-gray-300 p-4 md:p-6 flex flex-col font-sans selection:bg-[#FFD700]/30 selection:text-white" id="main-container">
      
      {/* Global Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#222] pb-4 mb-6 shrink-0" id="global-header">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FFD700] to-yellow-600 flex items-center justify-center text-black font-mono font-black text-sm shadow-[0_0_15px_rgba(255,215,0,0.3)] shrink-0">
              ⚓
            </div>
            <div className="absolute inset-0 rounded-lg bg-[#FFD700]/20 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black font-mono tracking-wider text-white">ARG ANCHOR</h1>
              <span className="text-[9px] bg-[#FFD700]/10 text-[#FFD700] px-1.5 py-0.2 rounded font-mono font-bold uppercase border border-[#FFD700]/20">Sovereign</span>
            </div>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-tight">Unified Sovereign Governance / Anchor Engine</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3.5">
          {/* Global UI Perspective Switch */}
          <div className="bg-[#050505] border border-[#222] rounded p-0.5 flex gap-1 items-center">
            <button
              onClick={() => {
                setPerspective('customer');
                addLog('Interface terminology switched to Customer perspective.', 'INFO', 'GOVERNOR');
              }}
              className={`text-[10px] font-mono font-bold px-3 py-1 rounded transition cursor-pointer ${
                perspective === 'customer' ? 'bg-[#FFD700] text-black shadow-[0_0_8px_rgba(255,215,0,0.2)]' : 'text-gray-400 hover:text-white'
              }`}
            >
              CUSTOMER
            </button>
            <button
              onClick={() => {
                setPerspective('architect');
                addLog('Interface terminology switched to Architect perspective.', 'INFO', 'GOVERNOR');
              }}
              className={`text-[10px] font-mono font-bold px-3 py-1 rounded transition cursor-pointer ${
                perspective === 'architect' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              ARCHITECT
            </button>
          </div>

          {/* UTC Clock */}
          <div className="bg-[#0A0A0A] border border-[#222] px-3 py-1.5 rounded flex items-center gap-2 font-mono text-xs">
            <Clock className="w-3.5 h-3.5 text-[#FFD700]" />
            <span className="text-gray-400 font-bold">{utcTime || 'SYS_CALIBRATING'}</span>
          </div>

          {/* Operating Mode Switches */}
          <div className="bg-[#050505] border border-[#222] rounded p-0.5 flex gap-1 items-center">
            <button
              onClick={() => transitionOperatingState('SHIP')}
              className={`text-[10px] font-mono font-bold px-3 py-1 rounded transition ${
                operatingState === 'SHIP' ? 'bg-[#FFD700] text-black shadow-[0_0_8px_rgba(255,215,0,0.2)]' : 'text-gray-400 hover:text-white'
              }`}
            >
              SHIP
            </button>
            <button
              onClick={() => transitionOperatingState('FREEZE')}
              className={`text-[10px] font-mono font-bold px-3 py-1 rounded transition ${
                operatingState === 'FREEZE' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              FREEZE
            </button>
            <button
              onClick={() => transitionOperatingState('EXPAND')}
              className={`text-[10px] font-mono font-bold px-3 py-1 rounded transition ${
                operatingState === 'EXPAND' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              EXPAND
            </button>
          </div>
        </div>
      </header>

      {/* Main Core Content Grid */}
      <main className="flex-grow flex flex-col space-y-6 overflow-y-auto">
        
        {/* Sovereign Constitutional Motto Bar */}
        <div className="bg-[#0A0A0A] border border-[#FFD700]/10 rounded p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left relative overflow-hidden shadow-[0_0_15px_rgba(255,215,0,0.01)] shrink-0">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#FFD700]/60" />
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#FFD700] shrink-0" />
            <div>
              <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest block">System Constitutional Motto</span>
              <p className="text-xs md:text-sm font-serif italic text-gray-200">
                "Beyond the next level is the minimal build and quality standard for all aspects of the project."
              </p>
            </div>
          </div>
          <span className="text-[9px] font-mono text-[#FFD700]/70 uppercase border border-[#FFD700]/15 bg-[#FFD700]/5 px-2 py-0.5 rounded shrink-0">
            Immutable Absolute
          </span>
        </div>
        
        {/* Telemetry Ribbon */}
        <section 
          onClick={() => handleShowExplanation('ribbon')}
          className="bg-[#0A0A0A] border border-[#222] rounded p-4 flex flex-col md:flex-row gap-4 items-center justify-between hover:border-[#FFD700]/30 hover:shadow-[0_0_12px_rgba(255,215,0,0.03)] cursor-pointer transition-all duration-300 group shadow-lg"
          id="telemetry-ribbon"
        >
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className={`p-2 rounded shrink-0 ${confidence < 0.5 ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-[#FFD700]/10 text-[#FFD700]'}`}>
              <Activity className={`w-5 h-5 ${isReconstructing ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Global System Integrity Ribbon</span>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white tracking-tight group-hover:text-[#FFD700] transition-colors uppercase">ARG ANCHOR SENTINEL</p>
                <span className={`w-1.5 h-1.5 rounded-full ${confidence < 0.5 ? 'bg-red-500 animate-pulse' : 'bg-emerald-400 animate-ping'}`} />
              </div>
            </div>
            <span className="ml-auto md:hidden text-[9px] font-mono text-gray-600 border border-[#222] px-1.5 py-0.5 rounded group-hover:text-[#FFD700] transition-colors">
              Inspect Ribbon
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8 w-full md:w-auto justify-end">
            <div className="border-l border-[#222] pl-4">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">Core Integrity</span>
              <span className={`text-sm font-mono font-bold block ${confidence < 0.5 ? 'text-red-500 animate-pulse' : 'text-[#FFD700]'}`}>
                {(confidence * 100).toFixed(1)}%
              </span>
            </div>

            <div className="border-l border-[#222] pl-4">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">Active Threads</span>
              <span className="text-sm font-mono font-bold text-white block">
                {activeThreads} / 64
              </span>
            </div>

            <div className="border-l border-[#222] pl-4">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">Risk Vector Index</span>
              <span className={`text-sm font-mono font-bold block uppercase ${confidence < 0.5 || isStressTesting ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
                {confidence < 0.5 ? 'CRITICAL (BREACH)' : isStressTesting ? 'ELEVATED (TEST)' : 'NOMINAL (SAFE)'}
              </span>
            </div>

            <div className="border-l border-[#222] pl-4 flex items-center justify-start md:justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('STATE');
                  addLog('Sentinel Feed Deep Inspect triggered. Focusing Operational State Panel.', 'INFO', 'SPINE');
                }}
                className="text-[9px] font-mono font-bold uppercase tracking-wider bg-[#FFD700]/10 hover:bg-[#FFD700] hover:text-black border border-[#FFD700]/30 text-[#FFD700] px-3 py-1 rounded transition flex items-center gap-1 shrink-0"
              >
                Deep Inspect <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </section>

        {/* Top Level Bento-Grid Metrics */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in animate-once" id="system-metrics">
          <div className="bg-[#0A0A0A] border border-[#222] p-4 rounded flex items-center gap-3.5 hover:border-[#FFD700]/10 transition-all duration-300">
            <div className="p-2 bg-[#FFD700]/10 text-[#FFD700] rounded shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Apex Latency</span>
              <p className="text-xl font-mono font-black text-white">{metrics.speed}ms</p>
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-[#222] p-4 rounded flex items-center gap-3.5 hover:border-white/10 transition-all duration-300">
            <div className="p-2 bg-white/10 text-white rounded shrink-0">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Leverage ratio</span>
              <p className="text-xl font-mono font-black text-white">{metrics.leverage}x</p>
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-[#222] p-4 rounded flex items-center gap-3.5 hover:border-[#FFD700]/10 transition-all duration-300">
            <div className="p-2 bg-[#FFD700]/10 text-[#FFD700] rounded shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Correctness</span>
              <p className="text-xl font-mono font-black text-white">{metrics.correctness}%</p>
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-[#222] p-4 rounded flex items-center gap-3.5 hover:border-white/10 transition-all duration-300">
            <div className="p-2 bg-white/10 text-white rounded shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Resilience</span>
              <p className="text-xl font-mono font-black text-white">{metrics.continuity}%</p>
            </div>
          </div>
        </section>

        {/* Dashboard Layout Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Console Focus Area (9 Columns) */}
          <section className="lg:col-span-9 flex flex-col space-y-6">
            {perspective === 'customer' && (
              <div className="bg-[#0A0A0A] border border-[#222] rounded-lg p-4 animate-fade-in flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-1 md:max-w-[30%]">
                  <span className="text-[9px] font-mono font-bold text-[#FFD700] uppercase block">Sovereign State</span>
                  <p className="text-xs font-serif italic text-white leading-snug">"I resumed exactly where I left off."</p>
                  <p className="text-[10px] text-gray-500 leading-normal">
                    Local state memory keeps your core calibration parameters perfectly saved and restored automatically.
                  </p>
                </div>
                <div className="space-y-1 md:max-w-[30%] border-t md:border-t-0 md:border-l border-[#222] pt-3 md:pt-0 md:pl-4">
                  <span className="text-[9px] font-mono font-bold text-white uppercase block">Isolated Context</span>
                  <p className="text-xs font-serif italic text-white leading-snug">"My project didn't lose context."</p>
                  <p className="text-[10px] text-gray-500 leading-normal">
                    Secure Knowledge Engines lock core values into isolated, offline-first structures for safety.
                  </p>
                </div>
                <div className="space-y-1 md:max-w-[30%] border-t md:border-t-0 md:border-l border-[#222] pt-3 md:pt-0 md:pl-4">
                  <span className="text-[9px] font-mono font-bold text-[#FFD700] uppercase block">Autonomic Continuity</span>
                  <p className="text-xs font-serif italic text-white leading-snug">"Never lose your progress."</p>
                  <p className="text-[10px] text-gray-500 leading-normal">
                    Event-sourced event ledgers and zero-drift reconstruction tools safeguard your build offline.
                  </p>
                </div>
              </div>
            )}

            {/* Nav tabs bar */}
            <nav className="flex border-b border-[#222] gap-1 overflow-x-auto scrollbar-none animate-fade-in" id="dashboard-navigation">
              <button
                onClick={() => {
                  setActiveTab('STATE');
                  addLog(perspective === 'customer' ? 'Accessing System Alignment Service.' : 'Accessing Operational State Service (Pillar 1).', 'INFO', 'SPINE');
                }}
                className={`px-4 py-2.5 text-xs font-mono font-semibold transition border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeTab === 'STATE'
                    ? 'border-[#FFD700] text-[#FFD700] bg-[#FFD700]/5'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                {perspective === 'customer' ? 'SYSTEM ALIGNMENT' : 'OPERATIONAL STATE'}
              </button>
              <button
                onClick={() => {
                  setActiveTab('MEMORY');
                  addLog(perspective === 'customer' ? 'Accessing Secure Knowledge Service.' : 'Accessing Knowledge Objects Service (Pillar 2).', 'INFO', 'SPINE');
                }}
                className={`px-4 py-2.5 text-xs font-mono font-semibold transition border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeTab === 'MEMORY'
                    ? 'border-[#FFD700] text-[#FFD700] bg-[#FFD700]/5'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                {perspective === 'customer' ? 'SECURE KNOWLEDGE' : 'KNOWLEDGE OBJECTS'}
              </button>
              <button
                onClick={() => {
                  setActiveTab('REGISTRY');
                  addLog(perspective === 'customer' ? 'Accessing Task Pipelines.' : 'Accessing Capability Registry Service (Pillar 4).', 'INFO', 'SPINE');
                }}
                className={`px-4 py-2.5 text-xs font-mono font-semibold transition border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeTab === 'REGISTRY'
                    ? 'border-[#FFD700] text-[#FFD700] bg-[#FFD700]/5'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                {perspective === 'customer' ? 'TASK PIPELINES' : 'CAPABILITY REGISTRY'}
              </button>
              <button
                onClick={() => {
                  setActiveTab('GOVERNANCE');
                  addLog(perspective === 'customer' ? 'Accessing Integrity Rules & Controls.' : 'Entering Policy & Constitutional Governance (Pillar 3).', 'INFO', 'SPINE');
                }}
                className={`px-4 py-2.5 text-xs font-mono font-semibold transition border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeTab === 'GOVERNANCE'
                    ? 'border-[#FFD700] text-[#FFD700] bg-[#FFD700]/5'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {perspective === 'customer' ? 'INTEGRITY RULES' : 'GOVERNANCE'}
              </button>
              <button
                onClick={() => {
                  setActiveTab('RESTORATION');
                  addLog(perspective === 'customer' ? 'Accessing Recovery & Rollback Systems.' : 'Accessing Restoration & Reflex Reconstruction (Pillar 5).', 'INFO', 'SPINE');
                }}
                className={`px-4 py-2.5 text-xs font-mono font-semibold transition border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeTab === 'RESTORATION'
                    ? 'border-[#FFD700] text-[#FFD700] bg-[#FFD700]/5'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {perspective === 'customer' ? 'RECOVERY & ROLLBACK' : 'RESTORATION'}
              </button>
            </nav>

            {/* Dynamic Panel Frame */}
            <div className="min-h-[460px]">
              {activeTab === 'STATE' && <OperationalStatePanel />}
              {activeTab === 'MEMORY' && <KnowledgeObjectsPanel />}
              {activeTab === 'REGISTRY' && <CapabilityRegistryPanel />}
              {activeTab === 'GOVERNANCE' && <GovernancePanel />}
              {activeTab === 'RESTORATION' && <RestorationPanel />}
            </div>
          </section>

          {/* Strategic Cortex sidebar & Admin Deck (3 Columns) */}
          <aside className="lg:col-span-3 flex flex-col space-y-6">
            
            {/* Strategic Cortex Panel */}
            <div className="bg-[#0A0A0A] border border-[#222] rounded p-4 flex flex-col h-[340px]">
              <div className="flex items-center justify-between border-b border-[#222] pb-2 mb-3">
                <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-[#FFD700]" />
                  STRATEGIC CORTEX
                </span>
                <span className="text-[9px] bg-[#FFD700]/10 text-[#FFD700] px-1.5 py-0.2 rounded font-mono font-bold">P0 priority</span>
              </div>

              {/* Goal Priority list */}
              <div className="space-y-3 flex-grow overflow-y-auto pr-1 scrollbar-thin">
                {goals.map((goal) => (
                  <div key={goal.id} className="bg-[#111] border border-[#222] p-3 rounded space-y-1 relative hover:border-[#333] transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`text-[8px] font-mono px-1 py-0.2 rounded font-bold ${
                          goal.priority === 'P0' ? 'bg-[#FFD700]/10 text-[#FFD700]' : goal.priority === 'P1' ? 'bg-white/10 text-white' : 'bg-gray-800 text-gray-400'
                        }`}>
                          {goal.priority} Target
                        </span>
                        <h4 className="text-xs font-semibold text-gray-200 mt-1">{goal.title}</h4>
                      </div>

                      <button
                        onClick={() => toggleGoalStatus(goal.id)}
                        className={`text-[8px] font-mono font-black uppercase px-1.5 py-0.5 rounded border transition shrink-0 cursor-pointer ${
                          goal.status === 'ACTIVE'
                            ? 'bg-[#FFD700]/15 border-[#FFD700]/30 text-[#FFD700]'
                            : goal.status === 'BLOCKED'
                            ? 'bg-red-500/10 border-red-500/20 text-red-400'
                            : 'bg-[#1A1A1A] border-[#222] text-gray-500'
                        }`}
                      >
                        {goal.status}
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-normal">{goal.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-2 pt-2 border-t border-[#222] text-center">
                <p className="text-[9px] font-mono text-gray-600 leading-tight">
                  Click goal status tag to cycle priorities or mock resolve events.
                </p>
              </div>
            </div>

            {/* System Admin Auth area & Stress-Test Deck */}
            <div className="bg-[#0A0A0A] border border-[#222] rounded p-4 flex flex-col flex-grow relative overflow-hidden" id="admin-deck">
              <div className="flex items-center justify-between border-b border-[#222] pb-2 mb-3">
                <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className={`w-3.5 h-3.5 ${adminAuthenticated ? 'text-emerald-400' : 'text-gray-500'}`} />
                  PRINCIPAL ADMIN DECK
                </span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${adminAuthenticated ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  {adminAuthenticated ? 'LIVE' : 'LOCKED'}
                </span>
              </div>

              {!adminAuthenticated ? (
                /* Admin Passcode Form */
                <form onSubmit={handleAdminAuthSubmit} className="space-y-4 flex-grow flex flex-col justify-center py-2 animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-gray-500 uppercase block">ADMIN SECURE HANDSHAKE</label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="ENTER PASSCODE..."
                        value={adminPasswordInput}
                        onChange={(e) => {
                          setAdminPasswordInput(e.target.value);
                          setAdminAuthError(false);
                        }}
                        className={`w-full bg-[#111] border ${adminAuthError ? 'border-red-500' : 'border-[#222] focus:border-[#FFD700]'} text-xs font-mono px-3 py-2 rounded outline-none text-white tracking-widest`}
                      />
                      <KeyRound className="absolute right-3 top-2.5 w-3.5 h-3.5 text-gray-600 pointer-events-none" />
                    </div>
                    {adminAuthError && (
                      <p className="text-[9px] font-mono text-red-500">INVALID PASSCODE SEQUENCE</p>
                    )}
                  </div>

                  <p className="text-[9px] font-mono text-gray-500 leading-normal bg-[#111] border border-[#222] p-2.5 rounded">
                    Hint: Use standard passcode <span className="text-[#FFD700] font-bold">omega12</span> or click bypass below to access live container stressors.
                  </p>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-grow text-center text-xs font-mono font-bold bg-[#1A1A1A] hover:bg-[#222] text-white border border-[#222] py-2 rounded transition cursor-pointer"
                    >
                      AUTHENTICATE
                    </button>
                    <button
                      type="button"
                      onClick={handleInstantUnlock}
                      className="text-center text-xs font-mono font-bold bg-[#FFD700]/10 hover:bg-[#FFD700] text-[#FFD700] hover:text-black border border-[#FFD700]/30 py-2 px-3 rounded transition cursor-pointer"
                    >
                      Instant Unlock
                    </button>
                  </div>
                </form>
              ) : (
                /* Admin Stress-Testing Console */
                <div className="space-y-4 flex-grow flex flex-col animate-fade-in">
                  
                  {/* Container Resource Monitors */}
                  <div className="grid grid-cols-3 gap-2 bg-[#111] border border-[#222] p-2 rounded text-center">
                    <div>
                      <span className="text-[8px] font-mono text-gray-500 block">SANDBOX CPU</span>
                      <span className={`text-xs font-mono font-bold ${isStressTesting ? 'text-red-500' : 'text-emerald-400'}`}>
                        {sandboxCpu}%
                      </span>
                    </div>
                    <div className="border-x border-[#222]">
                      <span className="text-[8px] font-mono text-gray-500 block">SWAP RAM</span>
                      <span className={`text-xs font-mono font-bold ${isStressTesting ? 'text-red-400' : 'text-emerald-400'}`}>
                        {sandboxRam}MB
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] font-mono text-gray-500 block">NET IN/OUT</span>
                      <span className="text-xs font-mono font-bold text-[#FFD700]">
                        {sandboxNetwork}MB/s
                      </span>
                    </div>
                  </div>

                  {/* Stress Testing Action Panel */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-gray-500 uppercase block">Active Stressor Control Deck</span>
                    
                    <div className="space-y-1.5">
                      {/* Control 1: Inject fault */}
                      <button
                        onClick={() => {
                          if (confidence >= 0.5) {
                            setConfidence(0.34);
                            addLog('⚠️ CRITICAL: Administrative fault injected. Integrity score degraded.', 'WARN', 'GOVERNOR');
                          } else {
                            addLog('⚠️ A reconstruction is already running or integrity is already degraded.', 'WARN', 'GOVERNOR');
                          }
                        }}
                        className={`w-full text-left text-[10px] font-mono px-2.5 py-1.5 rounded border transition flex items-center justify-between cursor-pointer ${
                          confidence < 0.5
                            ? 'bg-red-500/15 border-red-500/30 text-red-400 cursor-not-allowed'
                            : 'bg-[#111] hover:bg-[#1A1A1A] border-[#222] text-[#FFD700]'
                        }`}
                        disabled={confidence < 0.5}
                      >
                        <span>[1] INJECT SYSTEM FAULT</span>
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                      </button>

                      {/* Control 2: Booster threads */}
                      <button
                        onClick={() => {
                          const next = !isStressTesting;
                          setIsStressTesting(next);
                          if (next) {
                            triggerScenario('VOLATILITY_BURST');
                          } else {
                            addLog('Nominal load re-established. Thread allocation cleared.', 'INFO', 'GOVERNOR');
                          }
                        }}
                        className={`w-full text-left text-[10px] font-mono px-2.5 py-1.5 rounded border transition flex items-center justify-between cursor-pointer ${
                          isStressTesting
                            ? 'bg-red-500/15 border-red-500/30 text-red-400'
                            : 'bg-[#111] hover:bg-[#1A1A1A] border-[#222] text-white'
                        }`}
                      >
                        <span>{isStressTesting ? '[2] ACTIVE LOAD BOOSTER' : '[2] ACTIVATE LOAD BOOSTER'}</span>
                        <Cpu className={`w-3 h-3 ${isStressTesting ? 'text-red-500 animate-pulse' : 'text-gray-500'}`} />
                      </button>

                      {/* Control 3: Reset system */}
                      <button
                        onClick={() => {
                          setConfidence(0.98);
                          setIsStressTesting(false);
                          addLog('Administrative override: Resetting core status variables.', 'INFO', 'GOVERNOR');
                          addLedgerEvent('ADMIN_CLEAR_STRESS_VECTORS');
                        }}
                        className="w-full text-left text-[10px] font-mono bg-[#111] hover:bg-[#1A1A1A] border border-[#222] text-[#FFD700] px-2.5 py-1.5 rounded transition flex items-center justify-between cursor-pointer"
                      >
                        <span>[3] CLEAR STRESS VECTORS</span>
                        <RefreshCw className="w-3 h-3 text-[#FFD700]" />
                      </button>
                    </div>
                  </div>

                  {/* Real-time streaming container logs console */}
                  <div className="flex-grow flex flex-col min-h-[120px]">
                    <span className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Docker Container Live Stream</span>
                    <div className="bg-[#050505] border border-[#222] p-2 rounded flex-grow text-[9px] font-mono text-gray-500 h-28 overflow-y-auto space-y-1.5 scrollbar-thin">
                      {adminLogs.length === 0 ? (
                        <p className="text-center py-8 text-gray-700">[ESTABLISHING TELEMETRY STREAM...]</p>
                      ) : (
                        adminLogs.map((log, index) => (
                          <div key={index} className="border-b border-[#111] pb-1 font-mono text-[9px] text-gray-400 leading-tight">
                            {log}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Lockout button */}
                  <button
                    onClick={() => {
                      setAdminAuthenticated(false);
                      setIsStressTesting(false);
                      addLog('Administrator logs closed. Relocking terminal.', 'INFO', 'GOVERNOR');
                    }}
                    className="w-full text-center text-[10px] font-mono text-gray-500 hover:text-white transition border border-[#222] hover:border-gray-700 py-1 rounded cursor-pointer"
                  >
                    RELOCK ADM_DECK
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Global Telemetry Live Log Flow */}
        <footer className="bg-[#0A0A0A] border border-[#222] rounded p-4 flex flex-col space-y-2 shrink-0 shadow-inner">
          <div className="flex justify-between items-center border-b border-[#222] pb-1.5">
            <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Database className="w-3.5 h-3.5 text-[#FFD700]" />
              INTRINSIC_TELEMETRY_LOG_STREAM_V12
            </span>
            <span className="text-[9px] font-mono text-gray-600">Buffer state: OK</span>
          </div>

          <div className="h-24 overflow-y-auto font-mono text-[9px] text-gray-400 space-y-1 pr-2 scrollbar-thin">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-2 items-start leading-relaxed border-b border-[#111] pb-0.5 animate-fade-in">
                <span className="text-gray-600 shrink-0">[{log.timestamp}]</span>
                <span className={`font-bold shrink-0 ${
                  log.level === 'ERROR' ? 'text-red-400' : log.level === 'WARN' ? 'text-amber-500' : log.level === 'SYSTEM' ? 'text-[#FFD700]' : 'text-gray-500'
                }`}>
                  [{log.level}]
                </span>
                <span className="text-gray-500 shrink-0 font-bold">[{log.source}]</span>
                <span className="text-gray-300">{log.message}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-[#111] pt-2 mt-1 text-[9px] font-mono text-gray-500 gap-1">
            <span>Sovereign Contact Node: <a href="mailto:kelseaziegler@gmail.com" className="text-white hover:text-[#FFD700] transition-colors font-bold underline">kelseaziegler@gmail.com</a></span>
            <span>Architectural Core frozen in partnership with Gemini V12</span>
          </div>
        </footer>
      </main>

      {/* Explanation Drawer Panel */}
      {infoPaneContent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-end animate-fade-in" onClick={() => setInfoPaneContent(null)}>
          <div 
            className="bg-[#050505] border-l border-[#222] w-full max-w-md h-full p-6 flex flex-col space-y-6 shadow-2xl relative animate-slide-left overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setInfoPaneContent(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white border border-[#222] hover:border-gray-700 p-1.5 rounded transition text-xs font-mono cursor-pointer"
            >
              [CLOSE ESC]
            </button>

            <div className="pt-6">
              <span className="text-[10px] font-mono text-[#FFD700] uppercase tracking-widest block mb-1">
                {infoPaneContent.concept}
              </span>
              <h2 className="text-xl font-semibold text-white tracking-tight leading-snug border-b border-[#222] pb-3 mb-4">
                {infoPaneContent.title}
              </h2>
            </div>

            <div className="space-y-4 flex-grow">
              <div className="space-y-2">
                <h3 className="text-xs font-mono text-gray-400 uppercase tracking-wider">LAYMAN'S EXPLANATION</h3>
                <p className="text-sm text-gray-300 leading-relaxed bg-[#111] p-4 rounded border border-[#222]">
                  {infoPaneContent.laymanDescription}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-mono text-gray-400 uppercase tracking-wider">CYBERNETIC TECHNICAL DETAILS</h3>
                <div className="space-y-2.5">
                  {infoPaneContent.technicalDetails.map((detail: string, index: number) => (
                    <div key={index} className="flex gap-2 items-start text-xs text-gray-400 leading-relaxed">
                      <span className="text-[#FFD700] font-mono font-bold mt-0.5">[{index + 1}]</span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-[#222] pt-4">
              <p className="text-[10px] font-mono text-gray-500 text-center">
                ARG ANCHOR SOVEREIGN CONTEXT PROTOCOL
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <RuntimeProvider>
      <AppContent />
    </RuntimeProvider>
  );
}
