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

  // Interactive Canonical System Map States
  const [selectedMapLevel, setSelectedMapLevel] = useState<number>(0);
  const [showDevWorkspace, setShowDevWorkspace] = useState<boolean>(false);

  const CANONICAL_MAP = [
    {
      level: 0,
      name: "The Human",
      icon: Users,
      purpose: "Everything begins and ends with the person using ARG. The user does not care which AI model is running. The user has one objective: 'I want to accomplish something.'",
      layman: "This is you. You bring the goal. ARG handles everything else."
    },
    {
      level: 1,
      name: "ARG Manifest (Product Vision)",
      icon: Sparkles,
      purpose: "Defines why ARG exists. This is the story of the product. It explains what ARG is, who it serves, why it exists, what promises it makes, and what promises it refuses to make. No technical language belongs here.",
      layman: "This explains what ARG is and why anyone would want to use it."
    },
    {
      level: 2,
      name: "ARG Constitution (ACR)",
      icon: BookOpen,
      purpose: "The immutable laws of ARG. Nothing underneath may violate this document. Guides product philosophy, core principles, governance philosophy, AI independence, and canonical terminology.",
      layman: "These are the rules that never change, no matter how ARG evolves."
    },
    {
      level: 3,
      name: "ARG Workflow Constitution (AWC)",
      icon: ArrowRight,
      purpose: "Defines how users move through ARG. This is the product itself—not the UI or the runtime. Every interaction follows: Intent → Discovery → Planning → Architecture → Execution → Verification → Freeze → Resume.",
      layman: "This is the roadmap ARG follows to help you finish your project."
    },
    {
      level: 4,
      name: "ARG Operational Constitution (AOC)",
      icon: ShieldCheck,
      purpose: "Defines how work progresses behind the scenes. It governs state transitions, entry and exit criteria, artifacts, validation, recovery, checkpoints, and continuity. The AOC never changes the workflow; it simply explains how work advances.",
      layman: "This is the instruction manual that keeps every project organized and consistent."
    },
    {
      level: 5,
      name: "ARG Runtime",
      icon: Cpu,
      purpose: "The execution engine. It faithfully carries out the constitutional rules. Major components include: Governor, Knowledge Vault, Memory, Ledger, Recovery Engine, Validation Engine, Capability Registry, Continuity Engine, and Communication Bus. The runtime is replaceable; the workflow is not.",
      layman: "This is the engine under the hood that keeps everything running smoothly."
    },
    {
      level: 6,
      name: "ARG Capabilities",
      icon: Zap,
      purpose: "These are the specialized systems ARG can use while solving problems: Decision Studio (high-confidence architectural reviews), Knowledge Vault (reusable structures), Evidence Engine, Ledger, Recovery, Continuity, Validation, Memory, and Reflection.",
      layman: "These are ARG's specialized tools. Each one performs a specific job when needed."
    },
    {
      level: 7,
      name: "Intelligence Network",
      icon: Terminal,
      purpose: "Provides cognitive processing. Includes ChatGPT, Gemini, Claude, Local LLMs, and future AI systems. These models are workers; they are not ARG. They are completely interchangeable.",
      layman: "These are the experts ARG hires to help solve problems. If one expert changes, your project does not."
    },
    {
      level: 8,
      name: "Platform Layer",
      icon: Database,
      purpose: "Presents ARG to users via Web, Desktop, Mobile, CLI, API, or IDE Plugins. Every platform must follow the same Workflow Constitution; only the interface changes.",
      layman: "This is how you interact with ARG, whether on a phone, computer, website, or another tool."
    },
    {
      level: 9,
      name: "Source Code",
      icon: FileCode2,
      purpose: "The concrete implementation. Programming languages, frameworks, databases, services. Everything here is replaceable. The code exists solely to implement the layers above it.",
      layman: "This is the actual software developers write to make ARG work."
    }
  ];

  const getActiveCorrelation = (level: number, goal: string) => {
    const cleanGoal = goal ? `"${goal}"` : 'your active objective';
    switch (level) {
      case 0:
        return `You brought the goal: ${cleanGoal}. ARG has locked this as the sovereign driver for all downstream execution layers.`;
      case 1:
        return `We have mapped the product vision to build ${cleanGoal} under a platform-independent model where you retain full intellectual ownership.`;
      case 2:
        return `The ARG Constitution guarantees that the requirements, logic rules, and historical progress of ${cleanGoal} are fully isolated from vendor APIs or SDK locks.`;
      case 3:
        return `The user journey for ${cleanGoal} is governed by a standard multi-stage pipeline: Intent → Discovery → Architecture → Generation → Verification.`;
      case 4:
        return `The Operational Constitution enforces state validation, ensuring that code generated for ${cleanGoal} passes rigorous compilation and correctness check-gates.`;
      case 5:
        return `The ArgOS Governor runtime is ready to process execution journals, logs, and state commits to build a safe, isolated container context for ${cleanGoal}.`;
      case 6:
        return `Under the hood, specialized systems like the Decision Studio, Evidence Engine, and Knowledge Vault are working to preserve architectural decisions made for ${cleanGoal}.`;
      case 7:
        return `Your chosen AI model (Gemini, Claude, GPT, or Llama) is treated purely as an interchangeable cognitive worker executing directives for ${cleanGoal}.`;
      case 8:
        return `The ARG Web Studio serves as a high-fidelity visual workspace to monitor the synthesis and structure of ${cleanGoal} at 60 FPS.`;
      case 9:
        return `Your project's concrete source code (React, TypeScript, Tailwind CSS) is being maintained with strict type safety, modular structures, and clean boundaries.`;
      default:
        return '';
    }
  };

  const CONSTITUTIONAL_TRUTHS = [
    "The user's project is the primary asset.",
    "The workflow is the product.",
    "AI models are interchangeable execution engines.",
    "Continuity is ARG's defining capability.",
    "Knowledge is institutional, not conversational.",
    "Every significant decision should be traceable.",
    "Recovery is mandatory, not optional.",
    "The implementation serves the constitution—not the other way around."
  ];

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
      className="min-h-screen bg-[#030303] text-gray-300 flex flex-col justify-start px-4 md:px-8 py-12 font-sans relative overflow-hidden"
      id="progressive-layer-2-canvas"
    >
      {/* Mesh and glowing elements matching Layer 1 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none opacity-20 z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFD700]/2 rounded-full blur-3xl pointer-events-none z-0" />
      
      <div className="w-full max-w-5xl mx-auto space-y-10 relative z-10 animate-fade-in">
        
        {/* Layer 2 Header / Breadcrumbs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#181818] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-[#FFD700] tracking-widest">ARG ANCHOR</span>
              <ChevronRight className="w-3 h-3 text-gray-700" />
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">LAYER 2 WORKSPACE</span>
            </div>
            <h2 className="text-xl font-black text-white uppercase font-sans tracking-tight">
              Sovereign Representation Studio
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleResetOnboarding}
              className="px-3.5 py-2 rounded-xl bg-[#090909] border border-[#222] hover:border-red-500/30 text-gray-400 hover:text-white text-[10px] font-mono transition cursor-pointer flex items-center gap-1.5 uppercase font-bold"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Goal
            </button>
            <button
              onClick={onUnlockLayer3}
              className="px-4 py-2 rounded-xl bg-[#FFD700] hover:bg-[#FFD700]/90 text-black text-[10px] font-mono font-black transition cursor-pointer flex items-center gap-1.5 shadow"
            >
              <Zap className="w-3.5 h-3.5" />
              UNLOCK POWER-USER (LAYER 3)
            </button>
          </div>
        </div>

        {/* Alignment Header Banner */}
        <div className="bg-[#070707] border border-[#1c1c1c] p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Active System Objective Alignment
              </span>
            </div>
            <h3 className="text-sm font-bold text-white font-mono leading-relaxed">
              "{activeGoalText || 'My Application Goal'}"
            </h3>
            <p className="text-[10.5px] text-gray-400 font-sans leading-relaxed">
              ARG has digested this intent. Below is the custom canonical representation. Your project is preserved across all cognitive environments.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-xl font-mono uppercase font-black tracking-wider">
              ALIGNED TO RECOVERY SEED
            </span>
            <span className="text-[9px] text-gray-600 font-mono uppercase">MAP VERSION 1.0</span>
          </div>
        </div>

        {/* ARG Ecosystem Section */}
        <div className="space-y-6">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-[10px] font-mono text-[#FFD700] uppercase font-black tracking-widest block">
              THE COMPLETE ARG ECOSYSTEM
            </span>
            <h4 className="text-lg font-black text-white uppercase tracking-tight">
              ARG Canonical System Map v1.0
            </h4>
            <div className="max-w-2xl bg-[#090909]/40 border border-[#161616] p-4 rounded-xl mt-2 text-center md:text-left">
              <p className="text-xs text-[#FFD700] font-mono font-bold uppercase tracking-wider mb-1">
                « MISSION »
              </p>
              <p className="text-xs text-gray-300 font-sans leading-relaxed">
                Build with any AI. Own your project forever. ARG exists to ensure that projects, decisions, and knowledge survive changes in AI models, technology, hardware, and time.
              </p>
            </div>
          </div>

          {/* Dynamic 10-Level Splitted View */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            
            {/* Left selector col: 10 levels */}
            <div className="md:col-span-5 space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {CANONICAL_MAP.map((item) => {
                const IconComponent = item.icon;
                const isSelected = selectedMapLevel === item.level;
                return (
                  <button
                    key={`map-lvl-${item.level}`}
                    onClick={() => setSelectedMapLevel(item.level)}
                    className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all duration-300 group cursor-pointer ${
                      isSelected
                        ? 'bg-[#111] border-[#FFD700] shadow-[0_4px_20px_rgba(255,215,0,0.03)]'
                        : 'bg-[#070707] border-[#181818] hover:border-[#333]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg border transition-colors ${
                        isSelected 
                          ? 'bg-[#FFD700]/10 border-[#FFD700]/30 text-[#FFD700]' 
                          : 'bg-white/5 border-white/10 text-gray-500 group-hover:text-gray-300'
                      }`}>
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className={`text-[8px] font-mono block font-black tracking-wider uppercase ${isSelected ? 'text-[#FFD700]' : 'text-gray-600 group-hover:text-gray-400'}`}>
                          LEVEL 0{item.level}
                        </span>
                        <span className={`text-xs font-bold transition-colors ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                          {item.name.split(' (')[0]}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 transition-all ${
                      isSelected ? 'text-[#FFD700] translate-x-0.5' : 'text-gray-700 group-hover:text-gray-400'
                    }`} />
                  </button>
                );
              })}
            </div>

            {/* Right details content card */}
            <div className="md:col-span-7 bg-[#070707] border border-[#1a1a1a] p-6 rounded-2xl flex flex-col justify-between space-y-6 relative min-h-[400px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/1 rounded-full blur-2xl pointer-events-none" />
              
              <div className="space-y-5">
                {/* Level Title Tag */}
                <div className="flex justify-between items-center border-b border-[#1c1c1c] pb-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#FFD700] font-black tracking-widest uppercase block">
                      LEVEL 0{selectedMapLevel} OF 09
                    </span>
                    <h5 className="text-base font-black text-white font-sans uppercase">
                      {CANONICAL_MAP[selectedMapLevel].name}
                    </h5>
                  </div>
                  <div className="p-2.5 bg-[#111] border border-[#222] rounded-xl text-[#FFD700]">
                    {React.createElement(CANONICAL_MAP[selectedMapLevel].icon, { className: "w-5 h-5" })}
                  </div>
                </div>

                {/* Level Purpose */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-gray-500 uppercase font-black tracking-wider block">
                    PURPOSE & SPECIFICATION
                  </span>
                  <p className="text-[11.5px] text-gray-300 font-sans leading-relaxed">
                    {CANONICAL_MAP[selectedMapLevel].purpose}
                  </p>
                </div>

                {/* Layman Description */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-gray-500 uppercase font-black tracking-wider block">
                    LAYMAN'S DESCRIPTION
                  </span>
                  <div className="border-l-2 border-[#FFD700]/40 pl-3.5 py-1.5">
                    <p className="text-[11px] text-[#FFD700]/90 italic font-sans">
                      "{CANONICAL_MAP[selectedMapLevel].layman}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Action Alignment Map */}
              <div className="bg-[#111] border border-[#222] p-4 rounded-xl space-y-2 mt-auto">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#FFD700]" />
                  <span className="text-[9px] font-mono text-white font-black uppercase tracking-wider">
                    ACTIVE PROJECT CORRELATION
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                  {getActiveCorrelation(selectedMapLevel, activeGoalText)}
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* Philosophical Shift Model */}
        <div className="bg-[#070707] border border-[#1a1a1a] p-6 rounded-2xl space-y-6">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-[#FFD700] uppercase font-black tracking-widest block">
              THE PHILOSOPHICAL SHIFT
            </span>
            <h4 className="text-base font-black text-white uppercase tracking-tight">
              Constitutional Truth vs. Runtime Truth
            </h4>
            <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
              Earlier versions of ArgOS were centered around the runtime, governance engine, and AI orchestration. The system you are shaping is centered on something more durable: <strong>the user's project</strong>. Every other layer exists to preserve, advance, validate, and recover that project over its entire lifetime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch pt-2">
            
            {/* List of truths */}
            <div className="space-y-3 pr-2 border-r border-[#161616] hidden md:block">
              <span className="text-[9px] font-mono text-gray-500 uppercase font-black tracking-wider block mb-1">
                CONSTITUTIONAL TRUTHS
              </span>
              <div className="grid grid-cols-1 gap-2">
                {CONSTITUTIONAL_TRUTHS.map((truth, i) => (
                  <div key={`truth-${i}`} className="flex items-start gap-2.5">
                    <span className="text-[#FFD700] text-xs mt-0.5 select-none font-mono">0{i+1}.</span>
                    <span className="text-[11px] text-gray-300 font-sans leading-relaxed">{truth}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ASCII Shift Architecture Model */}
            <div className="flex flex-col justify-between bg-[#040404] border border-[#161616] p-5 rounded-xl">
              <div className="space-y-1 text-center md:text-left mb-4">
                <span className="text-[9px] font-mono text-gray-500 uppercase font-black tracking-wider block">
                  CANONICAL ASSET TOPOLOGY
                </span>
                <span className="text-xs font-bold text-white uppercase block">
                  The Permanent Asset Model
                </span>
              </div>

              <div className="flex justify-center items-center py-4 bg-[#090909]/40 border border-[#181818] rounded-xl overflow-x-auto select-none">
                <pre className="text-[9.5px] leading-relaxed text-[#FFD700] text-center font-mono font-medium">
{`          CONSTITUTIONAL TRUTH            RUNTIME TRUTH
            ("How ARG must be")          ("How ARG executes")
                     │                           │
                     └─────────────┬─────────────┘
                                   ▼
                             USER'S PROJECT
                       (The only permanent asset)`}
                </pre>
              </div>

              <div className="text-center text-[9.5px] text-gray-500 font-sans mt-4">
                Decoupled design isolates implementation dependencies at the far edge.
              </div>
            </div>

          </div>
        </div>

        {/* Collapsible Developer Workspace Toggle */}
        <div className="border border-[#181818] rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowDevWorkspace(!showDevWorkspace)}
            className="w-full bg-[#070707] hover:bg-[#0c0c0c] p-5 flex items-center justify-between transition-colors border-b border-[#181818] cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-lg border ${showDevWorkspace ? 'bg-[#FFD700]/10 border-[#FFD700]/25 text-[#FFD700]' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                <Terminal className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-[8px] font-mono text-gray-500 uppercase block font-black">
                  EXPERIMENTAL SANDBOX
                </span>
                <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wide">
                  {showDevWorkspace ? '[-] Hide Technical Dev Workspace' : '[+] Expand Technical Dev Workspace'}
                </h4>
              </div>
            </div>
            <span className="text-[9px] font-mono text-gray-500 uppercase">
              {showDevWorkspace ? 'Visible' : 'Collapsed'}
            </span>
          </button>

          {showDevWorkspace && (
            <div className="p-6 bg-[#050505] space-y-6 animate-fade-in border-t border-[#1a1a1a]">
              {/* Status information explaining we've entered layer 2's optional diagnostic deck */}
              <p className="text-[10.5px] text-gray-400 font-sans leading-relaxed">
                You have requested the technical development deck of Layer 2. Use these live diagnostics to execute active conversational prompts, construct database schemas, or evaluate custom governance safeguards against local policies.
              </p>

              {/* 3 Simple Tool Option Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Tool 1 Tab Button */}
                <button
                  onClick={() => setActiveTool('ASK')}
                  className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                    activeTool === 'ASK'
                      ? 'bg-[#111] border-[#FFD700]'
                      : 'bg-[#080808] border-[#1C1C1C] hover:border-[#333]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-1.5 rounded-lg border ${activeTool === 'ASK' ? 'bg-[#FFD700]/10 border-[#FFD700]/30 text-[#FFD700]' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[8px] font-mono text-gray-500 uppercase font-black">01 / DISCOVERY</span>
                  </div>
                  <h4 className="text-white font-bold text-xs uppercase font-mono">
                    Conversational Guide
                  </h4>
                </button>

                {/* Tool 2 Tab Button */}
                <button
                  onClick={() => setActiveTool('SCHEMA')}
                  className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                    activeTool === 'SCHEMA'
                      ? 'bg-[#111] border-[#FFD700]'
                      : 'bg-[#080808] border-[#1C1C1C] hover:border-[#333]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-1.5 rounded-lg border ${activeTool === 'SCHEMA' ? 'bg-[#FFD700]/10 border-[#FFD700]/30 text-[#FFD700]' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                      <Database className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[8px] font-mono text-gray-500 uppercase font-black">02 / ARCHITECTURE</span>
                  </div>
                  <h4 className="text-white font-bold text-xs uppercase font-mono">
                    Blueprint Compiler
                  </h4>
                </button>

                {/* Tool 3 Tab Button */}
                <button
                  onClick={() => setActiveTool('VERIFY')}
                  className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                    activeTool === 'VERIFY'
                      ? 'bg-[#111] border-[#FFD700]'
                      : 'bg-[#080808] border-[#1C1C1C] hover:border-[#333]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-1.5 rounded-lg border ${activeTool === 'VERIFY' ? 'bg-[#FFD700]/10 border-[#FFD700]/30 text-[#FFD700]' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[8px] font-mono text-gray-500 uppercase font-black">03 / COMPLIANCE</span>
                  </div>
                  <h4 className="text-white font-bold text-xs uppercase font-mono">
                    Compliance Verifier
                  </h4>
                </button>

              </div>

              {/* Interactive Selected Tool Content Panel */}
              <div className="bg-[#080808] border border-[#1a1a1a] rounded-xl p-5">
                {activeTool === 'ASK' && (
                  <div className="space-y-4">
                    <div className="border-b border-[#1c1c1c] pb-2.5 mb-1 flex justify-between items-center">
                      <span className="text-[10px] font-mono font-bold text-white flex items-center gap-1.5 uppercase">
                        <Users className="w-3.5 h-3.5 text-[#FFD700]" />
                        Chat Assistant Panel
                      </span>
                    </div>
                    <AskArgConsole />
                  </div>
                )}

                {activeTool === 'SCHEMA' && (
                  <div className="space-y-4">
                    <div className="border-b border-[#1c1c1c] pb-2.5 mb-1 flex justify-between items-center">
                      <span className="text-[10px] font-mono font-bold text-white flex items-center gap-1.5 uppercase">
                        <Database className="w-3.5 h-3.5 text-[#FFD700]" />
                        Active Schema & Blueprint compiler
                      </span>
                    </div>
                    <IntentTranslator />
                  </div>
                )}

                {activeTool === 'VERIFY' && (
                  <div className="space-y-4">
                    <div className="border-b border-[#1c1c1c] pb-2.5 mb-1 flex justify-between items-center">
                      <span className="text-[10px] font-mono font-bold text-white flex items-center gap-1.5 uppercase">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#FFD700]" />
                        Compliance & Mandates Auditor
                      </span>
                    </div>
                    <DocumentAnalyzer />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Call to action to unlock Layer 3 */}
        <div className="bg-[#070707] border border-[#1a1a1a] rounded-2xl p-6 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6">
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
