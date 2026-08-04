/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Hammer,
  FolderOpen,
  FileText,
  MessageSquare,
  RotateCcw,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Database,
  Cpu,
  ChevronRight,
  Sliders,
  Layers,
  HelpCircle,
  Users,
  Send,
  Zap
} from 'lucide-react';
import { useRuntime } from '../core/RuntimeContext';
import IntentTranslator from './IntentTranslator';
import AskArgConsole from './AskArgConsole';
import DocumentAnalyzer from './DocumentAnalyzer';
import AiModelSelector from './AiModelSelector';
import DecisionStudio from './DecisionStudio';

interface HomePanelProps {
  onNavigate: (tab: 'STATE' | 'MEMORY' | 'REGISTRY' | 'GOVERNANCE' | 'RESTORATION') => void;
}

type AccomplishTarget = 'NONE' | 'BUILD' | 'DEBATE' | 'CONTINUE' | 'ANALYZE' | 'ASK';

export default function HomePanel({ onNavigate }: HomePanelProps) {
  const {
    snapshots,
    restoreSnapshot,
    knowledgeVault,
    perspective,
    setPerspective,
    addLog,
    updateCanonicalIntent
  } = useRuntime();

  // Active user target choice
  const [activeTarget, setActiveTarget] = useState<AccomplishTarget>('NONE');
  
  // Listen for Progressive Disclosure Escalation events
  useEffect(() => {
    const handleSwitch = () => {
      setActiveTarget('DEBATE');
    };
    window.addEventListener('SWITCH_DELIBERATION_MODE', handleSwitch);
    return () => window.removeEventListener('SWITCH_DELIBERATION_MODE', handleSwitch);
  }, []);
  
  // 5-Second Goal Prompt Bar
  const [quickPrompt, setQuickPrompt] = useState<string>('');

  const handleQuickBuildSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;
    updateCanonicalIntent(quickPrompt);
    setActiveTarget('BUILD');
    addLog(`User initialized project from 5-second prompt bar: "${quickPrompt.substring(0, 30)}..."`, 'INFO', 'SPINE');
  };

  const handlePresetPromptClick = (presetText: string) => {
    setQuickPrompt(presetText);
    updateCanonicalIntent(presetText);
    setActiveTarget('BUILD');
    addLog(`User selected preset prompt: "${presetText}"`, 'INFO', 'SPINE');
  };

  return (
    <div className="space-y-6 animate-fade-in text-gray-300 font-mono text-[11px]" id="arg-anchor-home">
      
      {/* 1. THE 5-SECOND RULE PROMISE HEADER */}
      <div className="bg-[#080808]/95 border border-[#222] rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl text-center md:text-left">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[#FFD700] text-[9.5px] uppercase tracking-widest font-black bg-[#FFD700]/10 border border-[#FFD700]/20 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              Sovereign Intent Compiler
            </div>
            
            <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-none">
              ARG Anchor
            </h1>
            
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans font-medium">
              Arg Anchor helps builders translate natural language ideas into verified software applications and database schemas in seconds.
            </p>
          </div>

          <div className="bg-[#111] border border-[#222] p-3 rounded-xl shrink-0 text-center font-mono select-none self-center md:self-auto min-w-[160px]">
            <span className="text-[8.5px] text-gray-500 uppercase block font-bold">SYSTEM STATUS</span>
            <span className="text-[#FFD700] font-black text-xs block mt-1 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              READY
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN 5-SECOND INTENTION LAUNCHER */}
      {activeTarget === 'NONE' ? (
        <div className="space-y-6 pt-2">
          
          {/* THE 5-SECOND RULE UNIFIED PROMPT BAR */}
          <div className="bg-[#0a0a0a] border border-[#FFD700]/30 rounded-2xl p-5 md:p-6 shadow-2xl space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <label className="text-white font-black text-sm uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFD700]" />
                <span>What do you want to build today?</span>
              </label>
              <span className="text-[8.5px] bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30 px-2 py-0.5 rounded font-black uppercase">
                5-Second Execution
              </span>
            </div>

            <form onSubmit={handleQuickBuildSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={quickPrompt}
                onChange={(e) => setQuickPrompt(e.target.value)}
                placeholder="E.g., Build an inspection reporting app with PDF generation and offline sync..."
                className="flex-1 bg-[#121212] border border-[#2a2a2a] focus:border-[#FFD700] rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 outline-none font-sans transition shadow-inner"
              />
              <button
                type="submit"
                className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-black px-6 py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer uppercase text-xs shrink-0 shadow-lg"
              >
                <span>Start Building</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[9px] text-gray-500 font-bold uppercase">Quick Examples:</span>
              {[
                'Offline Mobile Inspection SaaS',
                'Multi-Tenant Subscription Ledger',
                'Realtime AI Analytics Dashboard',
                'Restricted SQL Audit System'
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handlePresetPromptClick(chip)}
                  className="bg-[#141414] hover:bg-[#1f1f1f] border border-[#222] hover:border-[#FFD700]/40 text-gray-300 hover:text-[#FFD700] px-2.5 py-1 rounded-lg text-[9.5px] transition cursor-pointer font-sans"
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>

          {/* 5 Primary Intention Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            
            {/* Action 1: Build a Project */}
            <button
              onClick={() => {
                setActiveTarget('BUILD');
                addLog('User launched: Build a Project tool', 'INFO', 'SPINE');
              }}
              className="bg-[#090909] border border-[#222] hover:border-[#FFD700] p-4 rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-[0_12px_30px_rgba(255,215,0,0.08)] group cursor-pointer flex flex-col justify-between min-h-[185px]"
            >
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] group-hover:scale-110 transition-transform">
                  <Hammer className="w-4 h-4" />
                </div>
                
                <div>
                  <h3 className="text-white font-black text-xs uppercase tracking-wider group-hover:text-[#FFD700] transition-colors">
                    Build a Project
                  </h3>
                  <p className="text-[10px] text-gray-400 font-sans leading-relaxed mt-1">
                    Translate plain English into full software blueprints & SQL schemas.
                  </p>
                </div>
              </div>

              <div className="pt-2.5 border-t border-[#181818] flex items-center justify-between text-[9px] text-[#FFD700] font-black uppercase tracking-wider">
                <span>Start Building</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Action 2: Decision Studio */}
            <button
              onClick={() => {
                setActiveTarget('DEBATE');
                addLog('User launched: Decision Studio & Deliberation Workspace', 'INFO', 'SPINE');
              }}
              className="bg-[#090909] border border-[#222] hover:border-purple-500 p-4 rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-[0_12px_30px_rgba(168,85,247,0.08)] group cursor-pointer flex flex-col justify-between min-h-[185px]"
            >
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                
                <div>
                  <h3 className="text-white font-black text-xs uppercase tracking-wider group-hover:text-purple-400 transition-colors">
                    Decision Studio
                  </h3>
                  <p className="text-[10px] text-gray-400 font-sans leading-relaxed mt-1">
                    Multi-expert AI deliberation & verified engineering decision records.
                  </p>
                </div>
              </div>

              <div className="pt-2.5 border-t border-[#181818] flex items-center justify-between text-[9px] text-purple-400 font-black uppercase tracking-wider">
                <span>Convene Session</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Action 3: Continue Previous Work */}
            <button
              onClick={() => {
                setActiveTarget('CONTINUE');
                addLog('User launched: Continue Previous Work tool', 'INFO', 'SPINE');
              }}
              className="bg-[#090909] border border-[#222] hover:border-sky-500 p-4 rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-[0_12px_30px_rgba(56,189,248,0.08)] group cursor-pointer flex flex-col justify-between min-h-[185px]"
            >
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                  <FolderOpen className="w-4 h-4" />
                </div>
                
                <div>
                  <h3 className="text-white font-black text-xs uppercase tracking-wider group-hover:text-sky-400 transition-colors">
                    Continue Work
                  </h3>
                  <p className="text-[10px] text-gray-400 font-sans leading-relaxed mt-1">
                    Re-open saved workspace blueprints, active sessions, or snapshots.
                  </p>
                </div>
              </div>

              <div className="pt-2.5 border-t border-[#181818] flex items-center justify-between text-[9px] text-sky-400 font-black uppercase tracking-wider">
                <span>View Saved</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Action 4: Analyze Documents */}
            <button
              onClick={() => {
                setActiveTarget('ANALYZE');
                addLog('User launched: Analyze Documents tool', 'INFO', 'SPINE');
              }}
              className="bg-[#090909] border border-[#222] hover:border-emerald-500 p-4 rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-[0_12px_30px_rgba(16,185,129,0.08)] group cursor-pointer flex flex-col justify-between min-h-[185px]"
            >
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                
                <div>
                  <h3 className="text-white font-black text-xs uppercase tracking-wider group-hover:text-emerald-400 transition-colors">
                    Analyze Code
                  </h3>
                  <p className="text-[10px] text-gray-400 font-sans leading-relaxed mt-1">
                    Upload or paste code to verify mandate compliance & static security.
                  </p>
                </div>
              </div>

              <div className="pt-2.5 border-t border-[#181818] flex items-center justify-between text-[9px] text-emerald-400 font-black uppercase tracking-wider">
                <span>Run Analysis</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Action 5: Ask ARG */}
            <button
              onClick={() => {
                setActiveTarget('ASK');
                addLog('User launched: Ask ARG assistant', 'INFO', 'SPINE');
              }}
              className="bg-[#090909] border border-[#222] hover:border-amber-500 p-4 rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-[0_12px_30px_rgba(245,158,11,0.08)] group cursor-pointer flex flex-col justify-between min-h-[185px]"
            >
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-4 h-4" />
                </div>
                
                <div>
                  <h3 className="text-white font-black text-xs uppercase tracking-wider group-hover:text-amber-400 transition-colors">
                    Ask Assistant
                  </h3>
                  <p className="text-[10px] text-gray-400 font-sans leading-relaxed mt-1">
                    Ask questions or brainstorm ideas in plain English.
                  </p>
                </div>
              </div>

              <div className="pt-2.5 border-t border-[#181818] flex items-center justify-between text-[9px] text-amber-400 font-black uppercase tracking-wider">
                <span>Ask ARG</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

          </div>

          {/* 3. MULTI-MODEL ORCHESTRATION LAYER (HOT-SWAPPABLE AI) */}
          <div className="bg-[#080808] border border-[#222] rounded-2xl p-5 space-y-4 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1b1b1b] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-white font-black text-xs uppercase tracking-wider">
                    Orchestration Layer & Hot-Swappable AI
                  </h3>
                  <p className="text-[10px] text-gray-400 font-sans">
                    State & memory stay 100% continuous regardless of which AI engine is active.
                  </p>
                </div>
              </div>

              {/* Hot Swappable Model Switcher */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[9px] text-gray-500 uppercase font-bold hidden sm:inline">Active Model:</span>
                <AiModelSelector compact />
              </div>
            </div>

            {/* Visual Orchestration Pipeline Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 pt-1 font-mono text-[9.5px]">
              <div className="bg-[#111] border border-[#222] p-2.5 rounded-xl text-center space-y-1">
                <span className="text-[#FFD700] font-bold uppercase block text-[8.5px]">1. User Intent</span>
                <span className="text-gray-300 font-sans text-[10px] block">Natural Language Prompt</span>
              </div>

              <div className="bg-[#111] border border-[#222] p-2.5 rounded-xl text-center space-y-1">
                <span className="text-sky-400 font-bold uppercase block text-[8.5px]">2. Intent Translation</span>
                <span className="text-gray-300 font-sans text-[10px] block">Canonical Meaning</span>
              </div>

              <div className="bg-[#111] border border-[#222] p-2.5 rounded-xl text-center space-y-1">
                <span className="text-emerald-400 font-bold uppercase block text-[8.5px]">3. Governed State</span>
                <span className="text-gray-300 font-sans text-[10px] block">9 Static Mandates</span>
              </div>

              <div className="bg-[#141414] border border-[#FFD700]/40 p-2.5 rounded-xl text-center space-y-1 relative shadow-[0_0_15px_rgba(255,215,0,0.05)]">
                <span className="text-[#FFD700] font-black uppercase block text-[8.5px]">4. Orchestration</span>
                <span className="text-white font-bold font-sans text-[10px] block">Auto-Select & Switch</span>
              </div>

              <div className="bg-[#111] border border-[#222] p-2.5 rounded-xl text-center space-y-1">
                <span className="text-purple-400 font-bold uppercase block text-[8.5px]">5. Unified State</span>
                <span className="text-gray-300 font-sans text-[10px] block">Zero-Loss Persistence</span>
              </div>
            </div>
          </div>

          {/* Secondary Footer Bar (Architect Mode Toggle) */}
          <div className="bg-[#080808] border border-[#1b1b1b] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left mt-6">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-4 h-4 text-[#FFD700]" />
              <div>
                <span className="text-[10px] text-white font-bold block uppercase">Architect & Telemetry Deck</span>
                <span className="text-[9.5px] text-gray-500 font-sans block">Switch to Architect Perspective to inspect the 9 mandates, operational knobs, and capability catalog.</span>
              </div>
            </div>

            <button
              onClick={() => {
                setPerspective(perspective === 'customer' ? 'architect' : 'customer');
                addLog(`Switched view perspective to ${perspective === 'customer' ? 'Architect' : 'Customer'} Mode`, 'INFO', 'GOVERNOR');
              }}
              className="px-3.5 py-1.5 bg-[#141414] hover:bg-[#1a1a1a] text-gray-200 border border-[#2a2a2a] hover:border-[#FFD700]/40 font-bold text-[10px] rounded-lg transition shrink-0 cursor-pointer"
            >
              Mode: {perspective.toUpperCase()} VIEW ⚙️
            </button>
          </div>

        </div>
      ) : (
        /* 3. ACTIVE INTENTION WORKSPACE */
        <div className="space-y-6">
          
          {/* Active Navigation Header */}
          <div className="flex items-center justify-between bg-[#080808] border border-[#222] px-4 py-3 rounded-xl shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-gray-500 uppercase font-bold">ACTIVE WORKSPACE:</span>
              <span className="text-xs bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] px-2.5 py-0.5 rounded font-black tracking-wider uppercase flex items-center gap-1.5">
                {activeTarget === 'BUILD' && <><Hammer className="w-3.5 h-3.5" /> Build a Project</>}
                {activeTarget === 'DEBATE' && <><Users className="w-3.5 h-3.5" /> Decision Studio & Deliberation Workspace</>}
                {activeTarget === 'CONTINUE' && <><FolderOpen className="w-3.5 h-3.5" /> Continue Previous Work</>}
                {activeTarget === 'ANALYZE' && <><FileText className="w-3.5 h-3.5" /> Analyze Documents</>}
                {activeTarget === 'ASK' && <><MessageSquare className="w-3.5 h-3.5" /> Ask ARG Assistant</>}
              </span>
            </div>

            <button
              onClick={() => {
                setActiveTarget('NONE');
                addLog('Returned to main Intention Launcher', 'INFO', 'SPINE');
              }}
              className="text-[10px] font-bold uppercase text-gray-300 hover:text-white px-3 py-1.5 bg-[#141414] border border-[#2a2a2a] hover:border-[#FFD700]/40 rounded-lg transition cursor-pointer flex items-center gap-1"
            >
              <span>↩ Main Menu</span>
            </button>
          </div>

          {/* Active View Containers */}
          {activeTarget === 'BUILD' && (
            <IntentTranslator />
          )}

          {activeTarget === 'DEBATE' && (
            <DecisionStudio />
          )}

          {activeTarget === 'CONTINUE' && (
            <div className="bg-[#080808] border border-[#222] rounded-xl p-5 space-y-6 shadow-2xl font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#1b1b1b] pb-3">
                <div>
                  <h3 className="text-white font-black uppercase text-xs tracking-wider">Saved Workspace Checkpoints & Knowledge Vault</h3>
                  <p className="text-[9.5px] text-gray-500 font-sans">1-click restore previous state vectors and view saved specifications</p>
                </div>
                <button
                  onClick={() => onNavigate('RESTORATION')}
                  className="text-[9.5px] text-[#FFD700] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                >
                  <span>Full Restoration Deck</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Saved Snapshots Grid */}
              <div className="space-y-3">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">State Checkpoints</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {snapshots.map((snap) => (
                    <div
                      key={snap.id}
                      className="bg-[#111] border border-[#222] hover:border-[#FFD700]/40 p-3.5 rounded-lg space-y-2 transition flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[9px] text-gray-500">
                          <span className="font-bold text-[#FFD700]">{snap.id} ({snap.version})</span>
                          <span>{snap.timestamp}</span>
                        </div>
                        <p className="text-[10.5px] text-gray-200 font-sans leading-snug">{snap.message}</p>
                      </div>

                      <button
                        onClick={() => restoreSnapshot(snap)}
                        className="w-full mt-2 py-1.5 bg-[#1a1a1a] hover:bg-[#FFD700] text-gray-300 hover:text-black font-bold text-[9.5px] rounded transition flex items-center justify-center gap-1 cursor-pointer uppercase"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restore Snapshot</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Saved Knowledge Objects */}
              <div className="space-y-3 border-t border-[#1b1b1b] pt-4">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Saved Knowledge Objects</span>
                <div className="space-y-2">
                  {knowledgeVault.map((obj) => (
                    <div key={obj.id} className="bg-[#111] border border-[#222] p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-[11px]">{obj.id}: {obj.title}</span>
                          <span className="text-[8px] bg-[#FFD700]/10 text-[#FFD700] px-1.5 py-0.2 rounded font-bold uppercase">{obj.type}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-sans mt-0.5">{obj.purpose}</p>
                      </div>
                      <span className="text-[9px] text-gray-500 font-mono">{obj.modified}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {activeTarget === 'ANALYZE' && (
            <DocumentAnalyzer />
          )}

          {activeTarget === 'ASK' && (
            <AskArgConsole />
          )}

        </div>
      )}

    </div>
  );
}
