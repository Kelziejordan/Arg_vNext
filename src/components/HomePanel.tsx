/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Sparkles,
  Zap,
  Play,
  ArrowRight,
  Activity,
  Compass,
  Lock,
  Database,
  GitBranch,
  ShieldCheck,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { useRuntime } from '../core/RuntimeContext';
import IntentTranslator from './IntentTranslator';

interface HomePanelProps {
  onNavigate: (tab: 'STATE' | 'MEMORY' | 'REGISTRY' | 'GOVERNANCE' | 'RESTORATION') => void;
}

export default function HomePanel({ onNavigate }: HomePanelProps) {
  const {
    perspective,
    setPerspective,
    triggerScenario,
    activeScenario,
    confidence,
    operatingState,
    addLog
  } = useRuntime();

  const handleScenarioLaunch = (scenario: string, label: string) => {
    addLog(`Operator launched quick simulation: [${label}] from Workspace Home.`, 'INFO', 'GOVERNOR');
    triggerScenario(scenario);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Visual Identity Hero Card */}
      <div className="bg-[#0A0A0A] border border-[#222] rounded-lg p-6 relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-[#FFD700] text-[10px] font-mono tracking-wider uppercase font-bold bg-[#FFD700]/10 border border-[#FFD700]/20 px-2 py-0.5 rounded-full w-fit">
              <Sparkles className="w-3 h-3" />
              Sovereign & Portable Workspace
            </div>
            <h1 className="text-xl md:text-2xl font-black font-mono tracking-tight text-white uppercase">
              {perspective === 'customer' ? 'Your Portable AI Core' : 'Arg Anchor Core Controller'}
            </h1>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-serif italic">
              {perspective === 'customer' 
                ? "Resume any AI project exactly where you left off—even across models and sessions. Every important decision, constraint, and validated result is preserved as governed project state—not just chat history."
                : "Deterministic single-page cybernetic dashboard running state determinism, isolated knowledge adapters, and AOT linting routines."
              }
            </p>
          </div>
          
          <div className="flex flex-col items-stretch sm:items-center gap-2 bg-[#111] border border-[#222] p-4 rounded-lg shrink-0 min-w-[220px]">
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block text-center font-bold">
              Current Perspective
            </span>
            
            <div className="flex bg-[#050505] border border-[#222] rounded p-0.5 w-full">
              <button
                onClick={() => {
                  setPerspective('customer');
                  addLog('Perspective switched to Customer from Home Panel.', 'INFO', 'GOVERNOR');
                }}
                className={`flex-1 text-[9px] font-mono font-bold py-1.5 rounded transition cursor-pointer text-center ${
                  perspective === 'customer' ? 'bg-[#FFD700] text-black shadow-sm font-black' : 'text-gray-500 hover:text-white'
                }`}
              >
                CUSTOMER
              </button>
              <button
                onClick={() => {
                  setPerspective('architect');
                  addLog('Perspective switched to Architect from Home Panel.', 'INFO', 'GOVERNOR');
                }}
                className={`flex-1 text-[9px] font-mono font-bold py-1.5 rounded transition cursor-pointer text-center ${
                  perspective === 'architect' ? 'bg-white text-black font-black' : 'text-gray-500 hover:text-white'
                }`}
              >
                ARCHITECT
              </button>
            </div>
            
            <p className="text-[9.5px] font-mono text-gray-400 text-center leading-normal mt-1 max-w-[190px]">
              {perspective === 'customer' 
                ? "Showing simple, non-technical benefits & workflows."
                : "Unlocks advanced telemetry, raw logs, and technical pillars."
              }
            </p>
          </div>
        </div>
      </div>

      {/* 15-Second Quick Wow Factor (Action Playground) */}
      <div className="bg-[#0A0A0A] border border-[#FFD700]/20 rounded-lg p-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#FFD700]" />
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="text-[#FFD700] w-4.5 h-4.5" />
            <h2 className="text-xs font-mono font-bold uppercase text-gray-200 tracking-wider">
              15-Second Interactive Showcase
            </h2>
          </div>
          
          <p className="text-xs text-gray-400 max-w-3xl leading-relaxed">
            Witness how the system preserves integrity under pressure. Click a simulation button below to trigger real-time events, and watch the autonomic response immediately.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Action 1: Cyber Attack / Drift */}
            <div className="bg-[#111] border border-[#222] p-3.5 rounded hover:border-red-500/30 transition-all duration-300 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-0.2 rounded font-bold uppercase w-fit block">
                  Stress Recovery Demo
                </span>
                <h3 className="text-xs font-mono font-bold text-white uppercase mt-1">
                  Simulate Stress & Drift
                </h3>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  Drops core confidence index to simulate extreme stress. Watch the <strong>Reflex Reconstruction Engine</strong> automatically self-heal and restore state instantly.
                </p>
              </div>
              
              <button
                onClick={() => handleScenarioLaunch('CYBER_ATTACK', 'Stress Simulator')}
                disabled={activeScenario !== null}
                className="w-full text-[10px] font-mono font-bold uppercase py-2 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/30 text-red-400 rounded transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3 h-3 fill-current" />
                Trigger Stress Event
              </button>
            </div>

            {/* Action 2: Standard Run */}
            <div className="bg-[#111] border border-[#222] p-3.5 rounded hover:border-[#FFD700]/30 transition-all duration-300 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/20 px-1.5 py-0.2 rounded font-bold uppercase w-fit block">
                  Automated Scheduler Demo
                </span>
                <h3 className="text-xs font-mono font-bold text-white uppercase mt-1">
                  Trigger High-Capacity Window
                </h3>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  Seeds consecutive high-velocity rounds to engage <strong>CHASE_10X scheduling</strong> in the Hydraulic Engine, maximizing task dispatch speeds safely.
                </p>
              </div>
              
              <button
                onClick={() => handleScenarioLaunch('SWEET_SPOT_CLUSTER', 'High Capacity Scheduler')}
                disabled={activeScenario !== null}
                className="w-full text-[10px] font-mono font-bold uppercase py-2 bg-[#FFD700]/10 hover:bg-[#FFD700] hover:text-black border border-[#FFD700]/30 text-[#FFD700] rounded transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3 h-3 fill-current" />
                Trigger Optimal Cycle
              </button>
            </div>

            {/* Action 3: System Freeze */}
            <div className="bg-[#111] border border-[#222] p-3.5 rounded hover:border-white/30 transition-all duration-300 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-white bg-white/10 border border-white/20 px-1.5 py-0.2 rounded font-bold uppercase w-fit block">
                  State Locking Demo
                </span>
                <h3 className="text-xs font-mono font-bold text-white uppercase mt-1">
                  Engage Constitutional Lock
                </h3>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  Transitions active state mode directly into <strong>FREEZE</strong>, disabling non-essential background activity and locking core properties.
                </p>
              </div>
              
              <button
                onClick={() => handleScenarioLaunch('SYSTEM_FREEZE', 'Constitutional Lock')}
                disabled={activeScenario !== null}
                className="w-full text-[10px] font-mono font-bold uppercase py-2 bg-white/10 hover:bg-white hover:text-black border border-white/30 text-white rounded transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3 h-3 fill-current" />
                Engage State Lock
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sovereign Intent Translation Section */}
      <div className="text-center py-6 space-y-1.5 border-t border-[#1a1a1a] pt-10">
        <h2 className="text-xl md:text-2xl font-black font-mono tracking-tight text-white uppercase">
          What would you like to build today?
        </h2>
        <p className="text-[10px] md:text-xs text-gray-500 font-mono uppercase tracking-widest max-w-xl mx-auto">
          State your requirements in natural language below to compile them into a technology-agnostic canonical representation and live code projections.
        </p>
      </div>
      <IntentTranslator />

      {/* The 5 Pillar Exploration Section */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono font-bold uppercase text-gray-400 tracking-wider">
          Explore System Foundations (The 5 Pillars)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Pillar 1 */}
          <div 
            onClick={() => onNavigate('STATE')}
            className="bg-[#0A0A0A] border border-[#222] hover:border-[#FFD700]/30 hover:shadow-[0_0_12px_rgba(255,215,0,0.03)] p-4 rounded transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[140px]"
          >
            <div className="space-y-1">
              <Lock className="w-4 h-4 text-[#FFD700] mb-2" />
              <h3 className="text-xs font-mono font-bold text-white uppercase group-hover:text-[#FFD700] transition-colors">
                {perspective === 'customer' ? 'System Alignment' : 'Operational State'}
              </h3>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                {perspective === 'customer' 
                  ? "Calibrate active behavioral guidelines and personality metrics."
                  : "Calibrate aggression, caution safeguards, and exploration vectors."
                }
              </p>
            </div>
            <span className="text-[9px] font-mono text-[#FFD700] flex items-center gap-0.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Calibrate <ArrowRight className="w-2.5 h-2.5" />
            </span>
          </div>

          {/* Pillar 2 */}
          <div 
            onClick={() => onNavigate('MEMORY')}
            className="bg-[#0A0A0A] border border-[#222] hover:border-[#FFD700]/30 hover:shadow-[0_0_12px_rgba(255,215,0,0.03)] p-4 rounded transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[140px]"
          >
            <div className="space-y-1">
              <Database className="w-4 h-4 text-[#FFD700] mb-2" />
              <h3 className="text-xs font-mono font-bold text-white uppercase group-hover:text-[#FFD700] transition-colors">
                {perspective === 'customer' ? 'Secure Knowledge' : 'Knowledge Objects'}
              </h3>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                {perspective === 'customer' 
                  ? "Browse immutable templates and reference frameworks safely."
                  : "Database of unalterable static knowledge capsules and structures."
                }
              </p>
            </div>
            <span className="text-[9px] font-mono text-[#FFD700] flex items-center gap-0.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Browse <ArrowRight className="w-2.5 h-2.5" />
            </span>
          </div>

          {/* Pillar 3 */}
          <div 
            onClick={() => onNavigate('REGISTRY')}
            className="bg-[#0A0A0A] border border-[#222] hover:border-[#FFD700]/30 hover:shadow-[0_0_12px_rgba(255,215,0,0.03)] p-4 rounded transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[140px]"
          >
            <div className="space-y-1">
              <GitBranch className="w-4 h-4 text-[#FFD700] mb-2" />
              <h3 className="text-xs font-mono font-bold text-white uppercase group-hover:text-[#FFD700] transition-colors">
                {perspective === 'customer' ? 'Task Pipelines' : 'Capability Registry'}
              </h3>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                {perspective === 'customer' 
                  ? "Monitor background action lanes and active system work."
                  : "Review active capability pipelines and system execution logs."
                }
              </p>
            </div>
            <span className="text-[9px] font-mono text-[#FFD700] flex items-center gap-0.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Monitor <ArrowRight className="w-2.5 h-2.5" />
            </span>
          </div>

          {/* Pillar 4 */}
          <div 
            onClick={() => onNavigate('GOVERNANCE')}
            className="bg-[#0A0A0A] border border-[#222] hover:border-[#FFD700]/30 hover:shadow-[0_0_12px_rgba(255,215,0,0.03)] p-4 rounded transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[140px]"
          >
            <div className="space-y-1">
              <ShieldCheck className="w-4 h-4 text-[#FFD700] mb-2" />
              <h3 className="text-xs font-mono font-bold text-white uppercase group-hover:text-[#FFD700] transition-colors">
                {perspective === 'customer' ? 'Integrity Rules' : 'Governance'}
              </h3>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                {perspective === 'customer' 
                  ? "Audit rules ensuring code stability and execution safety."
                  : "Enforce unalterable mandates, static AST filters, and safety thresholds."
                }
              </p>
            </div>
            <span className="text-[9px] font-mono text-[#FFD700] flex items-center gap-0.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Audit <ArrowRight className="w-2.5 h-2.5" />
            </span>
          </div>

          {/* Pillar 5 */}
          <div 
            onClick={() => onNavigate('RESTORATION')}
            className="bg-[#0A0A0A] border border-[#222] hover:border-[#FFD700]/30 hover:shadow-[0_0_12px_rgba(255,215,0,0.03)] p-4 rounded transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[140px]"
          >
            <div className="space-y-1">
              <RefreshCw className="w-4 h-4 text-[#FFD700] mb-2" />
              <h3 className="text-xs font-mono font-bold text-white uppercase group-hover:text-[#FFD700] transition-colors">
                {perspective === 'customer' ? 'Recovery & Rollback' : 'Restoration'}
              </h3>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                {perspective === 'customer' 
                  ? "Restore preceding backups and event snapshots offline."
                  : "Restore structural restore-points and audit historical transaction logs."
                }
              </p>
            </div>
            <span className="text-[9px] font-mono text-[#FFD700] flex items-center gap-0.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Restore <ArrowRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
