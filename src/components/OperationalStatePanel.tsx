import React, { useState } from 'react';
import {
  Activity,
  History,
  RefreshCw,
  GitBranch,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  Database,
  Lock,
  Sliders,
  Check,
  AlertTriangle
} from 'lucide-react';
import { SystemMetric, SystemLog } from '../types';

interface OperationalStatePanelProps {
  metrics: SystemMetric;
  onUpdateMetrics: React.Dispatch<React.SetStateAction<SystemMetric>>;
  onAddLog: (message: string, level: SystemLog['level'], source: SystemLog['source']) => void;
  confidence: number;
  setConfidence: React.Dispatch<React.SetStateAction<number>>;
  operatingState: 'SHIP' | 'FREEZE' | 'EXPAND';
}

interface StateSnapshot {
  id: string;
  version: string;
  timestamp: string;
  hash: string;
  aggression: number;
  caution: number;
  exploration: number;
  explorationRate: number;
  operatingState: string;
  message: string;
  status: 'VERIFIED' | 'RECONSTRUCTED';
}

export default function OperationalStatePanel({
  metrics,
  onUpdateMetrics,
  onAddLog,
  confidence,
  setConfidence,
  operatingState
}: OperationalStatePanelProps) {
  // Local state vectors (Identity Knobs)
  const [aggression, setAggression] = useState(0.5);
  const [caution, setCaution] = useState(0.5);
  const [exploration, setExploration] = useState(0.25);
  const [explorationRate, setExplorationRate] = useState(0.25);

  // State Refresh flow variables
  const [refreshStep, setRefreshStep] = useState<number>(0);
  const [isRefreshing, setIsRefreshActive] = useState<boolean>(false);

  // Snapshot registry (Initial values based on historical sessions)
  const [snapshots, setSnapshots] = useState<StateSnapshot[]>([
    {
      id: 'OSS-004',
      version: 'v1.2.4',
      timestamp: '15:02:11',
      hash: 'SHA-256: 0x9f8b7a...',
      aggression: 0.5,
      caution: 0.5,
      exploration: 0.25,
      explorationRate: 0.25,
      operatingState: 'SHIP',
      message: 'State Refresh: Unified Constitutional Architect & Lineage Root initialized.',
      status: 'VERIFIED'
    },
    {
      id: 'OSS-003',
      version: 'v1.2.0',
      timestamp: '12:44:02',
      hash: 'SHA-256: 0x2b4c5e...',
      aggression: 0.45,
      caution: 0.55,
      exploration: 0.3,
      explorationRate: 0.3,
      operatingState: 'FREEZE',
      message: 'Consolidated cognitive state & preserved decisions.',
      status: 'VERIFIED'
    },
    {
      id: 'OSS-002',
      version: 'v1.1.1',
      timestamp: '09:12:55',
      hash: 'SHA-256: 0x8a9b3c...',
      aggression: 0.7,
      caution: 0.3,
      exploration: 0.4,
      explorationRate: 0.4,
      operatingState: 'EXPAND',
      message: 'Reconstructed core identity from the Frozen Seed.',
      status: 'RECONSTRUCTED'
    }
  ]);

  const [newCommitMessage, setNewCommitMessage] = useState('');

  // Event Sourced Ledger log
  const [ledger, setLedger] = useState<string[]>([
    `[SYSTEM] State vector committed to index OSS-004. Hash chain verified.`,
    `[LEDGER] Event emitted: STATE_TRANSITION (CORTEX) -> active_mode: REGULAR`,
    `[LEDGER] Event emitted: MODE_SELECT (GOVERNOR) -> status: NOMINAL`,
    `[LEDGER] Event emitted: PLAN_COMMIT -> plan_id: plan_g1_recalibrate_hash`,
    `[SYSTEM] Snapshot loaded. Restored state: aggression: 0.50, caution: 0.50.`
  ]);

  // Execute State Refresh Loop
  const handleStateRefreshStep = () => {
    if (isRefreshing) return;
    setIsRefreshActive(true);
    setRefreshStep(1);
    onAddLog('Initiating State Refresh sequence loop...', 'SYSTEM', 'SPINE');

    const steps = [
      { msg: 'Reading BOOT.md canonical state rules...', source: 'SEED' as const },
      { msg: 'Evaluating active working context and memory nodes...', source: 'SPINE' as const },
      { msg: 'Detecting semantic drift or unverified mutations...', source: 'GOVERNOR' as const },
      { msg: 'Emitting state refresh events across all 7 self-systems...', source: 'SEED' as const },
      { msg: 'Freezing session state vector and compiling snapshot...', source: 'SEED' as const }
    ];

    let current = 1;
    const interval = setInterval(() => {
      if (current <= steps.length) {
        setRefreshStep(current);
        onAddLog(`[REFRESH ${current}/5] ${steps[current - 1].msg}`, 'INFO', steps[current - 1].source);
        setLedger(prev => [`[LEDGER] Event emitted: STATE_REFRESH_STEP_${current} (${steps[current-1].msg.substring(0, 15)}...)`, ...prev]);
        current++;
      } else {
        clearInterval(interval);
        setIsRefreshActive(false);
        setRefreshStep(0);
        onUpdateMetrics(prev => ({
          ...prev,
          continuity: 100,
          correctness: 100,
          leverage: +(prev.leverage + 0.1).toFixed(2)
        }));
        onAddLog('State Refresh completed successfully. System is aligned.', 'SYSTEM', 'SPINE');
        setLedger(prev => [`[SYSTEM] State Refresh verified. Canonical state locked.`, ...prev]);
      }
    }, 600);
  };

  // Commit a new state snapshot (as a Git Commit equivalent)
  const handleCreateCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommitMessage.trim()) return;

    const nextId = `OSS-${String(snapshots.length + 1).padStart(3, '0')}`;
    const nextHash = `SHA-256: 0x${Math.random().toString(16).substring(2, 8)}${Math.random().toString(16).substring(2, 8)}...`;
    
    const newSnapshot: StateSnapshot = {
      id: nextId,
      version: `v1.2.${snapshots.length + 1}`,
      timestamp: new Date().toLocaleTimeString(),
      hash: nextHash,
      aggression,
      caution,
      exploration,
      explorationRate,
      operatingState,
      message: newCommitMessage.trim(),
      status: 'VERIFIED'
    };

    setSnapshots([newSnapshot, ...snapshots]);
    setNewCommitMessage('');
    onAddLog(`State committed successfully as Operational State Snapshot ${nextId}.`, 'SYSTEM', 'SEED');
    setLedger(prev => [
      `[SYSTEM] State snapshot ${nextId} committed: "${newSnapshot.message}"`,
      `[LEDGER] Event emitted: STATE_SNAPSHOT_COMMIT -> hash: ${nextHash}`,
      ...prev
    ]);
  };

  // Restore snapshot (simulate rollback)
  const handleRestoreSnapshot = (snap: StateSnapshot) => {
    setAggression(snap.aggression);
    setCaution(snap.caution);
    setExploration(snap.exploration);
    setExplorationRate(snap.explorationRate);
    onAddLog(`Restoring Operational State to commit ${snap.id}. Recalibrating...`, 'RECONSTRUCT', 'SPINE');
    
    // Simulate slight drop then fast restoration
    setConfidence(0.4); 
    setLedger(prev => [
      `[SYSTEM] Triggered manual rollback recovery to snapshot ${snap.id}`,
      `[LEDGER] Event emitted: SNAPSHOT_RESTORE -> target: ${snap.id}`,
      ...prev
    ]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in" id="operational-state-workspace">
      
      {/* State Knobs and Refresh Controller (7 columns) */}
      <div className="md:col-span-7 space-y-6 flex flex-col">
        
        {/* State Vectors Adjustment Card */}
        <div className="bg-[#0A0A0A] border border-[#222] p-5 rounded-lg space-y-4">
          <div className="flex justify-between items-center border-b border-[#222] pb-3">
            <span className="text-xs font-mono text-[#FFD700] uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Canonical State Knobs (Identity Vectors)
            </span>
            <span className="text-[9px] font-mono text-gray-500 uppercase">State/Behavior Separation</span>
          </div>

          <div className="space-y-5">
            {/* Knob 1: Aggression */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-mono text-gray-400">Aggression Vector</span>
                <span className="font-mono text-white font-bold">{aggression.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={aggression}
                onChange={(e) => {
                  setAggression(parseFloat(e.target.value));
                  setLedger(prev => [`[LEDGER] State parameter changed: aggression -> ${parseFloat(e.target.value).toFixed(2)}`, ...prev]);
                }}
                className="w-full accent-[#FFD700] h-1 bg-[#111] rounded outline-none cursor-pointer"
              />
              <p className="text-[9px] text-gray-500 leading-relaxed font-mono">
                Scales positional risk and execution speeds under non-hostile environments.
              </p>
            </div>

            {/* Knob 2: Caution */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-mono text-gray-400">Caution Vector</span>
                <span className="font-mono text-white font-bold">{caution.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={caution}
                onChange={(e) => {
                  setCaution(parseFloat(e.target.value));
                  setLedger(prev => [`[LEDGER] State parameter changed: caution -> ${parseFloat(e.target.value).toFixed(2)}`, ...prev]);
                }}
                className="w-full accent-white h-1 bg-[#111] rounded outline-none cursor-pointer"
              />
              <p className="text-[9px] text-gray-500 leading-relaxed font-mono">
                Defines quarantine and shutdown thresholds when system-wide noise or failure is encountered.
              </p>
            </div>

            {/* Knob 3: Exploration */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-mono text-gray-400">Exploration Rate</span>
                <span className="font-mono text-white font-bold">{(exploration * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.05"
                value={exploration}
                onChange={(e) => {
                  setExploration(parseFloat(e.target.value));
                  setExplorationRate(parseFloat(e.target.value));
                  setLedger(prev => [`[LEDGER] State parameter changed: explorationRate -> ${parseFloat(e.target.value).toFixed(2)}`, ...prev]);
                }}
                className="w-full accent-[#FFD700] h-1 bg-[#111] rounded outline-none cursor-pointer"
              />
              <p className="text-[9px] text-gray-500 leading-relaxed font-mono">
                Determines AI provider allocation weight during complex or ambiguous context gaps.
              </p>
            </div>
          </div>
        </div>

        {/* State Refresh Sequence Controller */}
        <div className="bg-[#0A0A0A] border border-[#222] p-5 rounded-lg space-y-4 flex-grow flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-[#222] pb-3">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <RefreshCw className={`w-3.5 h-3.5 text-[#FFD700] ${isRefreshing ? 'animate-spin' : ''}`} />
              Sovereign State Refresh Loop
            </span>
            <span className="text-[8px] bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 px-1.5 py-0.2 rounded font-mono font-bold uppercase">
              End-of-Session Loop
            </span>
          </div>

          <div className="bg-[#050505] border border-[#222] p-4 rounded text-xs space-y-3 font-mono text-gray-400">
            <p className="text-gray-300">
              The project's session loop represents the canonical discipline required for high-integrity development:
            </p>
            <div className="flex items-center justify-center gap-3 text-[10px] text-white py-1">
              <span className="bg-[#111] border border-[#222] px-2 py-1 rounded">Read BOOT.md</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#FFD700]" />
              <span className="bg-[#111] border border-[#222] px-2 py-1 rounded">Engineer Code</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#FFD700]" />
              <span className="bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] px-2 py-1 rounded font-bold animate-pulse">State Refresh</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#FFD700]" />
              <span className="bg-[#111] border border-[#222] px-2 py-1 rounded">Commit State</span>
            </div>
            <p className="text-[10px] text-gray-500 leading-normal border-t border-[#111] pt-2">
              Executing a State Refresh parses current working configurations, detects drift, locks in decisions, and regenerates local cache files before a session halts.
            </p>
          </div>

          <div className="space-y-3">
            {isRefreshing && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-[#FFD700]">
                  <span>RE-ALIGNING COHERENCE MATRIX...</span>
                  <span>{refreshStep * 20}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#111] rounded overflow-hidden">
                  <div className="h-full bg-[#FFD700] transition-all duration-300" style={{ width: `${refreshStep * 20}%` }} />
                </div>
              </div>
            )}

            <button
              onClick={handleStateRefreshStep}
              disabled={isRefreshing}
              className="w-full text-center text-xs font-mono font-bold bg-[#FFD700] hover:bg-[#E5C100] text-black py-2.5 rounded transition disabled:opacity-50 cursor-pointer shadow-[0_0_12px_rgba(255,215,0,0.15)] uppercase flex items-center justify-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Executing State Refresh...' : 'Trigger Sovereign State Refresh'}
            </button>
          </div>
        </div>

      </div>

      {/* Snapshot Ledger & History Commit Registry (5 columns) */}
      <div className="md:col-span-5 space-y-6 flex flex-col h-full justify-between">
        
        {/* Event Sourced Ledger */}
        <div className="bg-[#0A0A0A] border border-[#222] p-5 rounded-lg flex flex-col h-[230px]">
          <div className="flex justify-between items-center border-b border-[#222] pb-2 mb-3 shrink-0">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#FFD700]" />
              Event Sourced Ledger
            </span>
            <span className="text-[9px] text-[#FFD700] font-mono">APPEND-ONLY</span>
          </div>

          <div className="flex-grow overflow-y-auto space-y-2 text-[9px] font-mono text-gray-500 pr-1 scrollbar-thin">
            {ledger.map((evt, idx) => (
              <div key={idx} className="border-b border-[#111] pb-1 hover:text-gray-300 transition-colors leading-tight">
                {evt}
              </div>
            ))}
          </div>
        </div>

        {/* Operational State Snapshot Commit Register */}
        <div className="bg-[#0A0A0A] border border-[#222] p-5 rounded-lg flex flex-col h-[280px] justify-between">
          <div className="flex justify-between items-center border-b border-[#222] pb-2 mb-3 shrink-0">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-[#FFD700]" />
              Operational State Snapshots
            </span>
            <span className="text-[9px] bg-white/10 text-white px-1.5 py-0.2 rounded font-mono font-bold">
              {snapshots.length} Snapshots
            </span>
          </div>

          {/* List of Commits */}
          <div className="flex-grow overflow-y-auto space-y-2.5 pr-1 scrollbar-thin max-h-[140px]">
            {snapshots.map((snap) => (
              <div key={snap.id} className="bg-[#111] border border-[#222] hover:border-[#333] p-2.5 rounded transition-all flex flex-col space-y-1 relative group">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-white uppercase">{snap.id}</span>
                    <span className="text-[8px] font-mono text-gray-500">{snap.hash}</span>
                  </div>
                  <button
                    onClick={() => handleRestoreSnapshot(snap)}
                    className="text-[8px] font-mono font-bold uppercase bg-[#FFD700]/10 hover:bg-[#FFD700] hover:text-black text-[#FFD700] border border-[#FFD700]/20 px-2 py-0.5 rounded transition shrink-0 cursor-pointer"
                  >
                    ROLLBACK
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 font-semibold line-clamp-1 italic font-serif">
                  "{snap.message}"
                </p>
                <div className="flex items-center gap-3 text-[8px] font-mono text-gray-500 pt-0.5">
                  <span>State: {snap.operatingState}</span>
                  <span>A: {snap.aggression.toFixed(2)}</span>
                  <span>C: {snap.caution.toFixed(2)}</span>
                  <span>E: {snap.exploration.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Commit Snapshot Form */}
          <form onSubmit={handleCreateCommit} className="border-t border-[#222] pt-3 mt-2 shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Commit state snapshot message..."
                value={newCommitMessage}
                onChange={(e) => setNewCommitMessage(e.target.value)}
                className="flex-grow bg-[#111] border border-[#222] focus:border-[#FFD700]/50 outline-none text-xs font-mono px-2.5 py-1.5 rounded text-white"
              />
              <button
                type="submit"
                disabled={!newCommitMessage.trim()}
                className="bg-[#1A1A1A] hover:bg-[#222] disabled:opacity-50 text-white border border-[#222] text-xs font-mono font-bold px-3 rounded transition cursor-pointer shrink-0 uppercase"
              >
                Commit
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
}
