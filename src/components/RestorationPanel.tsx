/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  History,
  RefreshCw,
  Database,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Play,
  Activity,
  Sparkles,
  Zap
} from 'lucide-react';
import { useRuntime, StateSnapshot } from '../core/RuntimeContext';
import { ARCHITECTURAL_DICTIONARY } from '../core/TranslationLayer';

export default function RestorationPanel() {
  const {
    perspective,
    confidence,
    setConfidence,
    operatingState,
    snapshots,
    createSnapshot,
    restoreSnapshot,
    ledger,
    addLedgerEvent,
    isRefreshing,
    refreshStep,
    triggerStateRefresh,
    addLog
  } = useRuntime();

  const [newCommitMessage, setNewCommitMessage] = useState('');
  const [localReconstructing, setLocalReconstructing] = useState(false);
  const [localReconstructStep, setLocalReconstructStep] = useState(0);

  // Terminology helper
  const t = (key: keyof typeof ARCHITECTURAL_DICTIONARY, part: 'term' | 'codename' | 'benefit' | 'description' | 'technicalRole' = 'term') => {
    const concept = ARCHITECTURAL_DICTIONARY[key];
    if (!concept) return '';
    if (part === 'term') {
      return perspective === 'customer' ? concept.term : `${concept.term} (${concept.codename})`;
    }
    return concept[part];
  };

  // Commit a new state snapshot
  const handleCreateCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommitMessage.trim()) return;
    createSnapshot(newCommitMessage.trim());
    setNewCommitMessage('');
  };

  // Trigger manual disaster recovery sequence
  const handleTriggerManualRecovery = () => {
    if (localReconstructing) return;
    setLocalReconstructing(true);
    setLocalReconstructStep(1);
    addLog('Manual Disaster Recovery sequence initiated by operator.', 'WARN', 'SPINE');
    addLedgerEvent('MANUAL_DISASTER_RECOVERY_START');
  };

  // Run mock steps for local recovery
  useEffect(() => {
    if (!localReconstructing) return;
    const interval = setInterval(() => {
      setLocalReconstructStep((prev) => {
        if (prev >= 7) {
          clearInterval(interval);
          setLocalReconstructing(false);
          setConfidence(0.98);
          addLog('System state restored to Sovereign Root Backup alignment successfully.', 'SYSTEM', 'SEED');
          addLedgerEvent('DISASTER_RECOVERY_COMPLETE');
          return 0;
        }
        const next = prev + 1;
        const recoveryMessages = [
          'Verifying Sovereign Root Backup signature...',
          'Invalidating memory buffers and active context blocks...',
          'Re-loading core behavioral metadata vectors...',
          'Aligning system priorities and strategic directives...',
          'Broadcasting status update across all micro-agents...',
          'Validating structural layout and compliance linter...',
          'Hot-swapping live active operating structures...'
        ];
        addLog(`[RECOVERY PHASE ${next}/7] ${recoveryMessages[next - 1]}`, 'SYSTEM', 'SEED');
        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [localReconstructing, addLog, addLedgerEvent, setConfidence]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in" id="restoration-workspace">
      
      {/* Recovery and Rebuild System (7 columns) */}
      <div className="md:col-span-7 space-y-6 flex flex-col">
        
        {/* Disaster Recovery Console */}
        <div className="bg-[#0A0A0A] border border-[#222] p-5 rounded-lg space-y-4">
          <div className="flex justify-between items-center border-b border-[#222] pb-3">
            <span className="text-xs font-mono text-[#FFD700] uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              Reflex Reconstruction & Recovery Console
            </span>
            <span className="text-[9px] font-mono text-gray-500 uppercase">Foundational Service</span>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            Monitors cognitive alignment to automatically restore stable behaviors from the{' '}
            <strong className="text-white font-mono">{t('IMMUTABLE_SEED')}</strong>. If alignment metrics drift below safe thresholds, an automated roll-back triggers.
          </p>

          <div className="bg-[#050505] border border-[#222] p-4 rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-gray-400 uppercase">Cognitive Integrity Level</span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                confidence < 0.5 
                  ? 'bg-red-500/10 text-red-400 animate-pulse' 
                  : confidence < 0.8 
                  ? 'bg-amber-500/10 text-amber-400' 
                  : 'bg-emerald-500/10 text-emerald-400'
              }`}>
                {(confidence * 100).toFixed(1)}% Alignment
              </span>
            </div>

            {/* Slider to simulate drift */}
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] font-mono text-gray-500">
                <span>SIMULATE SYSTEM DRIFT:</span>
                <span className="text-gray-400">Current Confidence: {confidence.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={confidence}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setConfidence(val);
                  if (val < 0.5) {
                    addLog(`Critical drift injected manually: integrity fell to ${(val * 100).toFixed(1)}%`, 'ERROR', 'SPINE');
                  }
                }}
                className="w-full accent-[#FFD700] h-1 bg-[#222] rounded outline-none cursor-pointer"
                disabled={localReconstructing}
              />
              <div className="flex justify-between text-[8px] font-mono text-gray-600">
                <span className="text-red-500">DRIFTED (RECONSTRUCT &lt;50%)</span>
                <span className="text-emerald-400">STABLE CORE (100%)</span>
              </div>
            </div>
          </div>

          {/* Active Reconstruction Status */}
          {(localReconstructing || confidence < 0.5) && (
            <div className="border border-amber-500/20 bg-amber-500/5 p-4 rounded-lg space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-[#FFD700]">
                  <RefreshCw className="animate-spin w-3.5 h-3.5" />
                  <span>
                    {localReconstructing 
                      ? `RECOVERY ACTIVE (PHASE ${localReconstructStep}/7)` 
                      : 'AUTOMATED DISASTER HEALING IMMINENT'}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-tight">Active State Swap</span>
              </div>

              <div className="w-full bg-[#111] h-2 rounded overflow-hidden">
                <div 
                  className="bg-[#FFD700] h-full transition-all duration-300 shadow-[0_0_8px_rgba(255,215,0,0.5)]" 
                  style={{ width: `${localReconstructing ? (localReconstructStep / 7) * 100 : 0}%` }}
                />
              </div>
              
              <p className="text-[10px] font-mono text-[#FFD700]/80 italic">
                {localReconstructing 
                  ? 'Restoring state alignment from the Sovereign Root Backup...' 
                  : 'Emergency override: Click "Trigger Disaster Recovery" or slide integrity up to stabilize.'}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleTriggerManualRecovery}
              disabled={localReconstructing}
              className="flex-grow text-center text-xs font-mono font-bold bg-[#111] hover:bg-[#1A1A1A] border border-[#222] hover:border-gray-700 text-[#FFD700] py-2.5 rounded transition disabled:opacity-50 cursor-pointer uppercase flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${localReconstructing ? 'animate-spin' : ''}`} />
              Trigger Disaster Recovery
            </button>
          </div>
        </div>

        {/* State Refresh Sequence Controller */}
        <div className="bg-[#0A0A0A] border border-[#222] p-5 rounded-lg space-y-4">
          <div className="flex justify-between items-center border-b border-[#222] pb-3">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <RefreshCw className={`w-3.5 h-3.5 text-[#FFD700] ${isRefreshing ? 'animate-spin' : ''}`} />
              End-of-Session State Refresh
            </span>
            <span className="text-[9px] bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 px-2 py-0.5 rounded font-mono font-bold uppercase">
              Operational Cycle
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
            <p className="text-[10px] text-gray-500 leading-normal border-t border-[#111] pt-2 text-center">
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
              onClick={triggerStateRefresh}
              disabled={isRefreshing}
              className="w-full text-center text-xs font-mono font-bold bg-[#FFD700] hover:bg-[#E5C100] text-black py-2.5 rounded transition disabled:opacity-50 cursor-pointer shadow-[0_0_12px_rgba(255,215,0,0.15)] uppercase flex items-center justify-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Executing State Refresh...' : 'Trigger Sovereign State Refresh'}
            </button>
          </div>
        </div>

      </div>

      {/* Snapshot Ledger & Event History (5 columns) */}
      <div className="md:col-span-5 space-y-6 flex flex-col h-full justify-between">
        
        {/* Event Sourced Ledger (Continuity Spine) */}
        <div className="bg-[#0A0A0A] border border-[#222] p-5 rounded-lg flex flex-col h-[230px]">
          <div className="flex justify-between items-center border-b border-[#222] pb-2 mb-3 shrink-0">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#FFD700]" />
              {t('CONTINUITY_SPINE')}
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
                    onClick={() => restoreSnapshot(snap)}
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
