/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Send,
  Lock,
  Cpu,
  ShieldCheck,
  ChevronRight,
  RotateCcw,
  BookOpen,
  CheckCircle,
  Clock,
  Terminal,
  Database,
  Search,
  Check,
  Zap,
  HelpCircle,
  FileCode2,
  Users
} from 'lucide-react';
import { useRuntime } from '../core/RuntimeContext';
import { safeStorage } from '../core/safeStorage';
import AskArgConsole from './AskArgConsole';
import IntentTranslator from './IntentTranslator';
import DocumentAnalyzer from './DocumentAnalyzer';

interface ProgressiveExperienceProps {
  currentLayer: 1 | 2 | 3;
  setLayer: (layer: 1 | 2 | 3) => void;
  onUnlockLayer3: () => void;
}

export default function ProgressiveExperience({
  currentLayer,
  setLayer,
  onUnlockLayer3
}: ProgressiveExperienceProps) {
  const { addLog, updateCanonicalIntent, logs } = useRuntime();

  // Active user target goal
  const [goalInput, setGoalInput] = useState('');
  const [activeGoalText, setActiveGoalText] = useState(() => {
    return safeStorage.getItem('arg_onboarding_active_goal') || '';
  });

  // Layer 2 active tool selector
  const [activeTool, setActiveTool] = useState<'ASK' | 'SCHEMA' | 'VERIFY'>('ASK');

  // Dynamically managed list of actual user-authored recent projects, starting completely empty
  const [recentProjects, setRecentProjects] = useState<{ title: string; desc: string }[]>(() => {
    const saved = safeStorage.getItem('arg_recent_projects_v1.6');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const PLACEHOLDERS = [
    "Describe what you want to build...",
    "E.g., A client booking system with automated reminders...",
    "E.g., An offline inventory app for a local warehouse...",
    "E.g., A shared family recipe book with meal planners...",
    "E.g., A customer dashboard with real-time feedback logging..."
  ];

  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  React.useEffect(() => {
    if (currentLayer !== 1) return;
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [currentLayer]);

  const handleStartProject = (goal: string) => {
    if (!goal.trim()) return;
    updateCanonicalIntent(goal);
    setActiveGoalText(goal);
    safeStorage.setItem('arg_onboarding_active_goal', goal);
    
    // Add to actual user recent projects
    const shortTitle = goal.substring(0, 40) + (goal.length > 40 ? '...' : '');
    const newProject = { title: shortTitle, desc: goal };
    const filtered = recentProjects.filter(p => p.desc !== goal);
    const updated = [newProject, ...filtered].slice(0, 5);
    setRecentProjects(updated);
    safeStorage.setItem('arg_recent_projects_v1.6', JSON.stringify(updated));

    addLog(`User initiated onboarding goal: "${goal.substring(0, 45)}..."`, 'SYSTEM', 'SEED');
    setLayer(2);
  };

  const handleResetOnboarding = () => {
    if (window.confirm("Reset your active project state and return to pristine Layer 1?")) {
      setGoalInput('');
      setActiveGoalText('');
      safeStorage.removeItem('arg_onboarding_active_goal');
      addLog('Onboarding project reset to pristine Layer 1 baseline.', 'INFO', 'SEED');
      setLayer(1);
    }
  };

  if (currentLayer === 1) {
    return (
      <div 
        className="min-h-screen bg-[#030303] text-gray-300 flex flex-col justify-center items-center px-6 py-20 font-sans relative overflow-hidden" 
        id="progressive-layer-1-canvas"
      >
        {/* Subtle mesh & glowing orbs in Apple/Linear style */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none opacity-20 z-0" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FFD700]/3 rounded-full blur-3xl pointer-events-none z-0" />
        
        <div className="w-full max-w-xl mx-auto space-y-12 relative z-10 text-center animate-fade-in">
          {/* Stunning, high-contrast, bold display title */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight font-sans uppercase">
              ARG
            </h1>
            
            <p className="text-xs md:text-sm text-gray-400 font-medium max-w-md mx-auto leading-relaxed">
              Describe what you want to build. We’ll organize the details, secure the architecture, and ensure your progress is never lost.
            </p>
          </div>

          {/* Shockingly Empty Prompter Form */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-200 tracking-wider uppercase font-mono">
              What would you like to accomplish today?
            </h2>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleStartProject(goalInput);
              }}
              className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto"
            >
              <input
                type="text"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder={PLACEHOLDERS[placeholderIdx]}
                className="flex-1 bg-[#090909] border border-[#222] focus:border-[#FFD700] rounded-xl px-4 py-3.5 text-xs md:text-sm text-white placeholder-gray-600 outline-none transition font-sans shadow-inner text-center sm:text-left"
                autoFocus
              />
              <button
                type="submit"
                disabled={!goalInput.trim()}
                className="bg-white hover:bg-gray-100 disabled:bg-gray-800 disabled:text-gray-600 text-black font-black px-6 py-3.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer uppercase text-xs shrink-0 font-mono"
              >
                <span>Start</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Recent Projects Separator */}
          {recentProjects.length > 0 && (
            <div className="max-w-md mx-auto space-y-4 pt-4 border-t border-[#111]">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">
                Recent Projects
              </span>
              
              <div className="grid grid-cols-1 gap-2.5">
                {recentProjects.map((proj, idx) => (
                  <button
                    key={`${proj.title}-${idx}`}
                    onClick={() => handleStartProject(proj.desc)}
                    className="bg-[#070707] hover:bg-[#0c0c0c] border border-[#1a1a1a] hover:border-gray-800 p-3.5 rounded-xl text-left transition-all duration-300 flex items-center justify-between group cursor-pointer"
                  >
                    <div className="space-y-0.5 max-w-[85%]">
                      <span className="text-xs font-bold text-white group-hover:text-[#FFD700] transition-colors font-mono block">
                        • {proj.title}
                      </span>
                      <span className="text-[10px] text-gray-500 truncate block font-sans">
                        {proj.desc}
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-white transition-colors group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- LAYER 2: CHOOSE ADDITIONAL SIMPLIFIED TOOLS ---
  return (
    <div 
      className="min-h-screen bg-[#050505] text-gray-300 flex flex-col justify-start px-4 md:px-8 py-10 font-sans relative overflow-hidden"
      id="progressive-layer-2-canvas"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0F0F0F_1px,transparent_1px),linear-gradient(to_bottom,#0F0F0F_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none opacity-20 z-0" />
      
      <div className="w-full max-w-5xl mx-auto space-y-8 relative z-10 animate-fade-in">
        
        {/* Layer 2 Header / Breadcrumbs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#222] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#FFD700]">ARG ANCHOR</span>
              <ChevronRight className="w-3 h-3 text-gray-600" />
              <span className="text-xs font-mono text-gray-400">LAYER 2 WORKSPACE</span>
            </div>
            <h2 className="text-lg font-black text-white uppercase font-sans tracking-tight">
              Sovereign Implementation Studio
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetOnboarding}
              className="px-3 py-1.5 rounded-lg bg-[#111] border border-[#222] hover:border-red-500/30 text-gray-400 hover:text-white text-[10px] font-mono transition cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" />
              RESET PROJECT
            </button>
            <button
              onClick={onUnlockLayer3}
              className="px-4 py-1.5 rounded-lg bg-[#FFD700] hover:bg-[#FFD700]/90 text-black text-[10px] font-mono font-black transition cursor-pointer flex items-center gap-1.5 shadow-lg"
            >
              <Zap className="w-3 h-3" />
              UNLOCK POWER-USER (LAYER 3)
            </button>
          </div>
        </div>

        {/* Success / Status card representing success at Layer 1 */}
        <div className="bg-emerald-950/10 border border-emerald-500/20 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                ✓ System Objective Captured Successfully
              </span>
              <h3 className="text-xs md:text-sm font-bold text-white font-mono">
                "{activeGoalText || 'My Application Goal'}"
              </h3>
            </div>
          </div>
          <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-md font-mono uppercase font-black">
            Aligned
          </span>
        </div>

        {/* 3 Simple Tool Option Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Tool 1 Tab Button */}
          <button
            onClick={() => setActiveTool('ASK')}
            className={`p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
              activeTool === 'ASK'
                ? 'bg-[#111] border-[#FFD700] shadow-[0_4px_20px_rgba(255,215,0,0.04)]'
                : 'bg-[#080808] border-[#1C1C1C] hover:border-[#333]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-xl border ${activeTool === 'ASK' ? 'bg-[#FFD700]/10 border-[#FFD700]/30 text-[#FFD700]' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                <Users className="w-4 h-4" />
              </div>
              <span className="text-[8px] font-mono text-gray-500 uppercase font-black">TOOL 01</span>
            </div>
            <h4 className="text-white font-black text-xs uppercase tracking-wider">
              Conversational Guide
            </h4>
            <p className="text-[10px] text-gray-400 font-sans leading-relaxed mt-1">
              Refine active requirements, query capabilities, or brainstorm design paths with the AI.
            </p>
          </button>

          {/* Tool 2 Tab Button */}
          <button
            onClick={() => setActiveTool('SCHEMA')}
            className={`p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
              activeTool === 'SCHEMA'
                ? 'bg-[#111] border-[#FFD700] shadow-[0_4px_20px_rgba(255,215,0,0.04)]'
                : 'bg-[#080808] border-[#1C1C1C] hover:border-[#333]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-xl border ${activeTool === 'SCHEMA' ? 'bg-[#FFD700]/10 border-[#FFD700]/30 text-[#FFD700]' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                <Database className="w-4 h-4" />
              </div>
              <span className="text-[8px] font-mono text-gray-500 uppercase font-black">TOOL 02</span>
            </div>
            <h4 className="text-white font-black text-xs uppercase tracking-wider">
              Blueprint Compiler
            </h4>
            <p className="text-[10px] text-gray-400 font-sans leading-relaxed mt-1">
              Translate active commands into SQL database definitions and system code specifications.
            </p>
          </button>

          {/* Tool 3 Tab Button */}
          <button
            onClick={() => setActiveTool('VERIFY')}
            className={`p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
              activeTool === 'VERIFY'
                ? 'bg-[#111] border-[#FFD700] shadow-[0_4px_20px_rgba(255,215,0,0.04)]'
                : 'bg-[#080808] border-[#1C1C1C] hover:border-[#333]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-xl border ${activeTool === 'VERIFY' ? 'bg-[#FFD700]/10 border-[#FFD700]/30 text-[#FFD700]' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-[8px] font-mono text-gray-500 uppercase font-black">TOOL 03</span>
            </div>
            <h4 className="text-white font-black text-xs uppercase tracking-wider">
              Compliance Verifier
            </h4>
            <p className="text-[10px] text-gray-400 font-sans leading-relaxed mt-1">
              Paste generated snippets to test static safety rules and protect the codebase against drift.
            </p>
          </button>

        </div>

        {/* Interactive Selected Tool Content Panel */}
        <div className="bg-[#090909] border border-[#222] rounded-2xl p-6">
          {activeTool === 'ASK' && (
            <div className="space-y-4">
              <div className="border-b border-[#1C1C1C] pb-3 mb-2 flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase">
                  <Users className="w-3.5 h-3.5 text-[#FFD700]" />
                  Chat Assistant Panel
                </span>
                <span className="text-[9px] font-mono text-gray-500 uppercase">Interactive chat mode</span>
              </div>
              <AskArgConsole />
            </div>
          )}

          {activeTool === 'SCHEMA' && (
            <div className="space-y-4">
              <div className="border-b border-[#1C1C1C] pb-3 mb-2 flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase">
                  <Database className="w-3.5 h-3.5 text-[#FFD700]" />
                  Active Schema & Blueprint compiler
                </span>
                <span className="text-[9px] font-mono text-gray-500 uppercase">SQL Spec Sandbox</span>
              </div>
              <IntentTranslator />
            </div>
          )}

          {activeTool === 'VERIFY' && (
            <div className="space-y-4">
              <div className="border-b border-[#1C1C1C] pb-3 mb-2 flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FFD700]" />
                  Compliance & Mandates Auditor
                </span>
                <span className="text-[9px] font-mono text-gray-500 uppercase">Analysis Engine</span>
              </div>
              <DocumentAnalyzer />
            </div>
          )}
        </div>

        {/* Call to action to unlock Layer 3 */}
        <div className="bg-[#0A0A0A] border border-[#1e1e1e] rounded-2xl p-6 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6">
          <div className="space-y-1 md:max-w-xl">
            <span className="text-[9px] font-mono text-[#FFD700] uppercase font-black tracking-widest block">
              CONTINUITY & REGULATORY CONTROLS
            </span>
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wide">
              Ready to explore governance & deep telemetry?
            </h4>
            <p className="text-[10px] text-gray-400 font-sans leading-relaxed">
              Unlock the advanced power-user suite to access immutable ledgers, real-time container stressors, constitutional rules, capability task pipelines, and automated recovery rollback triggers.
            </p>
          </div>
          <button
            onClick={onUnlockLayer3}
            className="px-6 py-4 rounded-xl bg-white hover:bg-gray-100 text-black text-xs font-black font-mono tracking-wider transition cursor-pointer shrink-0 uppercase flex items-center justify-center gap-2"
          >
            <span>Unlock Advanced Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
