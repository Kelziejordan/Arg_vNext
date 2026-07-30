import React, { useState } from 'react';
import {
  Compass,
  Cpu,
  BookOpen,
  User,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Activity,
  Heart,
  Settings,
  Terminal,
  Zap,
  Lock,
  Play,
  FileCode2,
  RefreshCw
} from 'lucide-react';
import { SystemMetric, SystemLog } from '../types';

interface WorkspacePanelProps {
  metrics: SystemMetric;
  onUpdateMetrics: React.Dispatch<React.SetStateAction<SystemMetric>>;
  onAddLog: (message: string, level: SystemLog['level'], source: SystemLog['source']) => void;
}

interface AIChatLog {
  id: string;
  role: 'ATLAS' | 'ARGUS' | 'ADVISOR';
  text: string;
  timestamp: string;
}

export default function WorkspacePanel({
  metrics,
  onUpdateMetrics,
  onAddLog
}: WorkspacePanelProps) {
  // Input prompt
  const [taskInput, setTaskInput] = useState('');
  const [isRouting, setIsRouting] = useState(false);
  const [activeRoutingRole, setActiveRoutingRole] = useState<'NONE' | 'ADVISOR' | 'ATLAS' | 'ARGUS'>('NONE');

  // The 4 Missing Layers Toggle states
  const [adaptiveAutonomy, setAdaptiveAutonomy] = useState(false);
  const [cognitiveCache, setCognitiveCache] = useState(false);
  const [microIntent, setMicroIntent] = useState(false);
  const [selfHealing, setSelfHealing] = useState(false);

  // Chat window log pools
  const [atlasLogs, setAtlasLogs] = useState<AIChatLog[]>([
    { id: '1', role: 'ATLAS', text: '🌌 [ATLAS_MEM_ONLINE] - Memory Spine configured in read-through cache mode.', timestamp: '10:44:02' },
    { id: '2', role: 'ATLAS', text: '📖 Indexed ADR-004 & ADR-005. Verified 6 knowledge objects.', timestamp: '10:44:20' }
  ]);

  const [argusLogs, setArgusLogs] = useState<AIChatLog[]>([
    { id: '1', role: 'ARGUS', text: '🛠️ [ARGUS_ENGINE_ACTIVE] - Shifting to active branch: /server/runtime.', timestamp: '10:44:02' },
    { id: '2', role: 'ARGUS', text: '⚖️ Running static linter against 9 mandates... 100% compliant.', timestamp: '10:44:31' }
  ]);

  const [advisorLogs, setAdvisorLogs] = useState<AIChatLog[]>([
    { id: '1', role: 'ADVISOR', text: '💡 [ADVISOR_ACTIVE] - Standing by to audit design alternatives and risk.', timestamp: '10:44:02' },
    { id: '2', role: 'ADVISOR', text: '📋 Recommendation: Focus on consolidation of core primitives before trading.', timestamp: '10:44:42' }
  ]);

  // Unified priority response container
  const [unifiedResponse, setUnifiedResponse] = useState<string | null>(null);

  // Split-screen task router handler
  const handleRouteTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim() || isRouting) return;

    setIsRouting(true);
    setUnifiedResponse(null);
    onAddLog(`Routing task: "${taskInput.trim()}" through Governor priority arbitrator.`, 'INFO', 'GOVERNOR');

    // Step 1: Advisor weighs in (0 - 800ms)
    setActiveRoutingRole('ADVISOR');
    setTimeout(() => {
      const newAdv: AIChatLog = {
        id: String(Date.now()),
        role: 'ADVISOR',
        text: `🔍 [CONSULT] Evaluated request: "${taskInput.trim()}".\n• Lens 1 (Economic): High leverage. Reduces MTTR.\n• Lens 2 (Human): Intuitive. Minimizes cognitive load.\n• Lens 3 (Truth): Confirmed compliance bounds. Propose implementation.`,
        timestamp: new Date().toLocaleTimeString()
      };
      setAdvisorLogs(prev => [...prev, newAdv]);
      onAddLog('Strategic Advisor proposal completed. Routing to Atlas...', 'INFO', 'AGENT');

      // Step 2: Atlas checks long-term vault (800 - 1600ms)
      setActiveRoutingRole('ATLAS');
      setTimeout(() => {
        const newAtl: AIChatLog = {
          id: String(Date.now()),
          role: 'ATLAS',
          text: `📖 [MEMORY] Correlated request with ADR-005 (State Refresh) & ADR-004. Fetching lineage rules. Restoring past contexts. No conflicting records detected. Approved to proceed.`,
          timestamp: new Date().toLocaleTimeString()
        };
        setAtlasLogs(prev => [...prev, newAtl]);
        onAddLog('Atlas Memory constraints resolved. Delegating to ARGUS builder...', 'INFO', 'AGENT');

        // Step 3: Argus compiles code (1600 - 2400ms)
        setActiveRoutingRole('ARGUS');
        setTimeout(() => {
          const newArg: AIChatLog = {
            id: String(Date.now()),
            role: 'ARGUS',
            text: `🛠️ [BUILD] Compiled executable module complying with all 9 Engineering Mandates. Incorporating AbortControllers and RemoteData state reducers. Integration complete.`,
            timestamp: new Date().toLocaleTimeString()
          };
          setArgusLogs(prev => [...prev, newArg]);
          onAddLog('ARGUS execution compiled successfully. Merging response.', 'SYSTEM', 'APEX');

          // Step 4: Final Unified Response
          setActiveRoutingRole('NONE');
          setIsRouting(false);
          setTaskInput('');
          setUnifiedResponse(`🚀 [UNIFIED PRIORITY RESOLUTION]\n\n1. ADVISOR (Risk/Utility): Implementation has highly asymmetric upside. Verified MTTR reductions.\n2. ATLAS (Memory): Context matched with ADR-005. State Refresh committed.\n3. ARGUS (Builder): Complete executable code blocks written in /src/hooks. Zero-trust validation schemas compiled.`);
          onUpdateMetrics(prev => ({
            ...prev,
            speed: Math.max(5, prev.speed - 1),
            leverage: +(prev.leverage + 0.15).toFixed(2),
            correctness: 100
          }));
        }, 1000);

      }, 1000);

    }, 1000);
  };

  // 4 Missing Layers toggle triggers
  const handleToggleAdaptiveAutonomy = () => {
    const val = !adaptiveAutonomy;
    setAdaptiveAutonomy(val);
    if (val) {
      onAddLog('Activated Adaptive Autonomy Layer. Self-adjusting thresholds engaged.', 'INFO', 'SEED');
      onUpdateMetrics(prev => ({ ...prev, leverage: +(prev.leverage + 0.4).toFixed(2), metabolicCost: prev.metabolicCost + 5 }));
    } else {
      onAddLog('Deactivated Adaptive Autonomy Layer.', 'WARN', 'SEED');
      onUpdateMetrics(prev => ({ ...prev, leverage: +(prev.leverage - 0.4).toFixed(2), metabolicCost: prev.metabolicCost - 5 }));
    }
  };

  const handleToggleCognitiveCache = () => {
    const val = !cognitiveCache;
    setCognitiveCache(val);
    if (val) {
      onAddLog('Engaged Local Cognitive Cache. Storing last decisions & user patterns locally.', 'INFO', 'SPINE');
      onUpdateMetrics(prev => ({ ...prev, speed: Math.max(4, prev.speed - 3), metabolicCost: prev.metabolicCost + 3 }));
    } else {
      onAddLog('Disengaged Local Cognitive Cache.', 'WARN', 'SPINE');
      onUpdateMetrics(prev => ({ ...prev, speed: prev.speed + 3, metabolicCost: prev.metabolicCost - 3 }));
    }
  };

  const handleToggleMicroIntent = () => {
    const val = !microIntent;
    setMicroIntent(val);
    if (val) {
      onAddLog('Micro-Intent Engine online. Reading gestures, hesitation states, and micro-delays.', 'INFO', 'AGENT');
      onUpdateMetrics(prev => ({ ...prev, leverage: +(prev.leverage + 0.3).toFixed(2), metabolicCost: prev.metabolicCost + 4 }));
    } else {
      onAddLog('Micro-Intent Engine offline.', 'WARN', 'AGENT');
      onUpdateMetrics(prev => ({ ...prev, leverage: +(prev.leverage - 0.3).toFixed(2), metabolicCost: prev.metabolicCost - 4 }));
    }
  };

  const handleToggleSelfHealing = () => {
    const val = !selfHealing;
    setSelfHealing(val);
    if (val) {
      onAddLog('Self-Healing Runtime active. Anomaly diagnostics and automated state recovery online.', 'SYSTEM', 'GOVERNOR');
      onUpdateMetrics(prev => ({ ...prev, correctness: 100, continuity: 100, metabolicCost: prev.metabolicCost + 6 }));
    } else {
      onAddLog('Self-Healing Runtime disabled.', 'WARN', 'GOVERNOR');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in" id="workspace-product-cockpit">
      
      {/* 4 Missing Layers Sidebar Config (3 columns) */}
      <div className="md:col-span-3 space-y-6 flex flex-col justify-between">
        
        <div className="bg-[#0A0A0A] border border-[#222] p-5 rounded-lg space-y-4 flex-grow">
          <div className="flex justify-between items-center border-b border-[#222] pb-2">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-[#FFD700]" />
              The 4 Organism Layers
            </span>
          </div>

          <p className="text-[10px] text-gray-500 font-mono leading-relaxed pb-2 border-b border-[#111]">
            These missing layers convert ArgOS from a rigid system into a self-sustaining, self-correcting organism.
          </p>

          <div className="space-y-4 pt-2">
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

            {/* Layer 2: Local Cognitive Cache */}
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

        {/* Local metrics tracker card */}
        <div className="bg-[#0A0A0A] border border-[#222] p-4 rounded-lg text-[9px] font-mono text-gray-500 space-y-1.5 shrink-0">
          <div className="text-white font-bold text-[10px] pb-1 border-b border-[#111]">Metabolic Index</div>
          <div className="flex justify-between"><span>Compute Cycles:</span> <span className="text-white">Active</span></div>
          <div className="flex justify-between"><span>Metabolic Cost:</span> <span className="text-[#FFD700]">{metrics.metabolicCost}</span></div>
          <div className="flex justify-between"><span>UI Delay:</span> <span className="text-white">0ms (Cognitive Cache)</span></div>
        </div>

      </div>

      {/* Cockpit Conversational Grid & Arbitrator (9 columns) */}
      <div className="md:col-span-9 flex flex-col space-y-6 h-full justify-between">
        
        {/* Three Split Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[280px]">
          
          {/* Column 1: Atlas (Memory) */}
          <div className={`bg-[#0A0A0A] border rounded-lg p-4 flex flex-col justify-between transition-all duration-300 ${
            activeRoutingRole === 'ATLAS' ? 'border-[#FFD700] ring-1 ring-[#FFD700]/30 shadow-[0_0_15px_rgba(255,215,0,0.05)]' : 'border-[#222]'
          }`}>
            <span className="text-[10px] font-mono text-blue-400 font-bold border-b border-[#222] pb-1.5 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              1. Atlas Memory Window
            </span>
            <div className="flex-grow overflow-y-auto space-y-1.5 font-mono text-[9px] text-gray-500 py-2 scrollbar-thin">
              {atlasLogs.map((lg) => (
                <div key={lg.id} className="border-b border-[#111] pb-1">
                  <span className="text-[8px] text-gray-600 block">{lg.timestamp}</span>
                  <p className="text-gray-300 leading-tight">{lg.text}</p>
                </div>
              ))}
            </div>
            <span className="text-[8px] font-mono uppercase bg-blue-950/20 text-blue-400 px-2 py-0.5 rounded text-center shrink-0 border border-blue-900/30">
              {activeRoutingRole === 'ATLAS' ? 'PROCESSING CONSTRAINTS...' : 'Atlas Mode Active'}
            </span>
          </div>

          {/* Column 2: Argus (Engineer) */}
          <div className={`bg-[#0A0A0A] border rounded-lg p-4 flex flex-col justify-between transition-all duration-300 ${
            activeRoutingRole === 'ARGUS' ? 'border-[#FFD700] ring-1 ring-[#FFD700]/30 shadow-[0_0_15px_rgba(255,215,0,0.05)]' : 'border-[#222]'
          }`}>
            <span className="text-[10px] font-mono text-emerald-400 font-bold border-b border-[#222] pb-1.5 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" />
              2. Argus Engineer Window
            </span>
            <div className="flex-grow overflow-y-auto space-y-1.5 font-mono text-[9px] text-gray-500 py-2 scrollbar-thin">
              {argusLogs.map((lg) => (
                <div key={lg.id} className="border-b border-[#111] pb-1">
                  <span className="text-[8px] text-gray-600 block">{lg.timestamp}</span>
                  <p className="text-gray-300 leading-tight">{lg.text}</p>
                </div>
              ))}
            </div>
            <span className="text-[8px] font-mono uppercase bg-emerald-950/20 text-emerald-400 px-2 py-0.5 rounded text-center shrink-0 border border-emerald-900/30">
              {activeRoutingRole === 'ARGUS' ? 'COMPILING COMPLIANT BUILD...' : 'ArgOS Execution Active'}
            </span>
          </div>

          {/* Column 3: Consultant (Advisor) */}
          <div className={`bg-[#0A0A0A] border rounded-lg p-4 flex flex-col justify-between transition-all duration-300 ${
            activeRoutingRole === 'ADVISOR' ? 'border-[#FFD700] ring-1 ring-[#FFD700]/30 shadow-[0_0_15px_rgba(255,215,0,0.05)]' : 'border-[#222]'
          }`}>
            <span className="text-[10px] font-mono text-purple-400 font-bold border-b border-[#222] pb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              3. Strategic Advisor Window
            </span>
            <div className="flex-grow overflow-y-auto space-y-1.5 font-mono text-[9px] text-gray-500 py-2 scrollbar-thin">
              {advisorLogs.map((lg) => (
                <div key={lg.id} className="border-b border-[#111] pb-1">
                  <span className="text-[8px] text-gray-600 block">{lg.timestamp}</span>
                  <p className="text-gray-300 leading-tight">{lg.text}</p>
                </div>
              ))}
            </div>
            <span className="text-[8px] font-mono uppercase bg-purple-950/20 text-purple-400 px-2 py-0.5 rounded text-center shrink-0 border border-purple-900/30">
              {activeRoutingRole === 'ADVISOR' ? 'AUDITING ALIGNMENT...' : 'Consultant Mode Active'}
            </span>
          </div>

        </div>

        {/* Task routing controller & Priority result (below) */}
        <div className="bg-[#0A0A0A] border border-[#222] p-5 rounded-lg space-y-4">
          
          {unifiedResponse && (
            <div className="bg-[#FFD700]/5 border border-[#FFD700]/20 rounded p-4 text-[10px] font-mono text-gray-300 space-y-2 whitespace-pre-wrap animate-fade-in max-h-[120px] overflow-y-auto scrollbar-thin">
              {unifiedResponse}
            </div>
          )}

          <form onSubmit={handleRouteTask} className="flex gap-3">
            <input
              type="text"
              placeholder="Inject engineering instructions (e.g. Implement self-healing state reducer)..."
              value={taskInput}
              disabled={isRouting}
              onChange={(e) => setTaskInput(e.target.value)}
              className="flex-grow bg-[#050505] border border-[#222] focus:border-[#FFD700]/50 outline-none text-xs font-mono px-3.5 py-2.5 rounded text-white"
            />
            <button
              type="submit"
              disabled={!taskInput.trim() || isRouting}
              className="bg-[#FFD700] hover:bg-[#E5C100] text-black disabled:opacity-50 text-xs font-mono font-bold px-5 rounded transition cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider"
            >
              <Zap className="w-3.5 h-3.5" />
              {isRouting ? 'Routing...' : 'Prioritize & Route'}
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
