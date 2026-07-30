/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, RefreshCw, AlertTriangle, Cpu, Activity, Zap } from 'lucide-react';
import { SystemMetric, SystemLog } from '../types';

interface GovernancePanelProps {
  metrics: SystemMetric;
  onUpdateMetrics: (updater: (prev: SystemMetric) => SystemMetric) => void;
  onAddLog: (message: string, level: SystemLog['level'], source: SystemLog['source']) => void;
  confidence: number;
  setConfidence: (val: number) => void;
  isReconstructing: boolean;
  reconstructionStep: number;
  triggerReconstruction: () => void;
  onShowExplanation: (area: string) => void;
}

export default function GovernancePanel({ 
  metrics, 
  onUpdateMetrics, 
  onAddLog,
  confidence,
  setConfidence,
  isReconstructing,
  reconstructionStep,
  triggerReconstruction,
  onShowExplanation
}: GovernancePanelProps) {
  const [arbitrationLog, setArbitrationLog] = useState<string[]>([]);

  const simulateConflict = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering card click
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
        onAddLog(msg, 'WARN', 'GOVERNOR');
      }, delay);
      delay += 500;
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="governance-panel">
      
      {/* Immutable Seed (Layer 1) */}
      <div 
        onClick={() => onShowExplanation('seed')}
        className="bg-[#0A0A0A] border border-[#222] rounded p-5 relative overflow-hidden hover:border-[#FFD700]/30 hover:shadow-[0_0_15px_rgba(255,215,0,0.05)] cursor-pointer transition-all duration-300 group" 
        id="immutable-seed-card"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#FFD700]/10 transition-all duration-300" />
        <div className="flex items-center gap-3 border-b border-[#222] pb-3 mb-4">
          <Shield className="text-[#FFD700] w-5 h-5 shadow-[0_0_8px_rgba(255,215,0,0.2)] group-hover:scale-110 transition-transform duration-300" />
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-gray-200">LAYER 1: THE IMMUTABLE SEED</h2>
            <p className="text-[10px] font-mono text-gray-500 uppercase">THE FROZEN CORE / MASTER CHARTER</p>
          </div>
          <span className="ml-auto text-[9px] font-mono text-gray-600 border border-[#222] px-1.5 py-0.5 rounded group-hover:text-[#FFD700] group-hover:border-[#FFD700]/30 transition-colors">
            Inspect Node
          </span>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#111] border border-[#222] p-3 rounded">
              <div className="flex items-center gap-2 mb-1 text-[11px] font-mono text-[#FFD700]">
                <Activity className="w-3.5 h-3.5" />
                <span>IMMUNE RESPONSE</span>
              </div>
              <p className="text-[10px] text-gray-500">Anti-hallucination vector defense</p>
            </div>
            <div className="bg-[#111] border border-[#222] p-3 rounded">
              <div className="flex items-center gap-2 mb-1 text-[11px] font-mono text-white">
                <Cpu className="w-3.5 h-3.5" />
                <span>METABOLIC BOUNDS</span>
              </div>
              <p className="text-[10px] text-gray-500">Optimal compute constraints</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Identity Locks (Absolute Authorities)</h3>
            
            {/* System Constitution Motto */}
            <div className="bg-[#111] p-3 rounded border border-[#FFD700]/30 relative overflow-hidden group-hover:border-[#FFD700]/50 transition-colors">
              <div className="absolute top-0 right-0 w-12 h-12 bg-[#FFD700]/5 rounded-full blur-md pointer-events-none" />
              <span className="text-[8px] font-mono text-[#FFD700] uppercase tracking-widest block mb-1">PROJECT CONSTITUTIONAL MOTTO</span>
              <p className="text-[11px] font-serif italic text-gray-300 leading-relaxed">
                "Beyond the next level is the minimal build and quality standard for all aspects of the project."
              </p>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-start bg-[#111] p-2.5 rounded border border-[#222] group-hover:border-[#222]/80 transition-colors">
                <div>
                  <span className="font-mono text-[#FFD700] font-bold">1. Truth &gt; Persuasion</span>
                  <p className="text-[10px] text-gray-500">Accuracy is the absolute metric. No marketing hype.</p>
                </div>
                <span className="text-[9px] bg-[#FFD700]/10 text-[#FFD700] px-1.5 py-0.5 rounded font-mono font-bold uppercase border border-[#FFD700]/20">Locked</span>
              </div>
              <div className="flex justify-between items-start bg-[#111] p-2.5 rounded border border-[#222] group-hover:border-[#222]/80 transition-colors">
                <div>
                  <span className="font-mono text-white font-bold">2. Survival &gt; Growth</span>
                  <p className="text-[10px] text-gray-500">Systemic stability precedes expansion or features.</p>
                </div>
                <span className="text-[9px] bg-white/10 text-white px-1.5 py-0.5 rounded font-mono font-bold uppercase border border-white/20">Locked</span>
              </div>
              <div className="flex justify-between items-start bg-[#111] p-2.5 rounded border border-[#222] group-hover:border-[#222]/80 transition-colors">
                <div>
                  <span className="font-mono text-[#FFD700] font-bold">3. Operator Sovereignty</span>
                  <p className="text-[10px] text-gray-500">Ultimate command lies strictly with the operator.</p>
                </div>
                <span className="text-[9px] bg-[#FFD700]/10 text-[#FFD700] px-1.5 py-0.5 rounded font-mono font-bold uppercase border border-[#FFD700]/20">Locked</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Continuity Spine (Layer 2) */}
      <div 
        onClick={() => onShowExplanation('spine')}
        className="bg-[#0A0A0A] border border-[#222] rounded p-5 relative overflow-hidden hover:border-[#FFD700]/30 hover:shadow-[0_0_15px_rgba(255,215,0,0.05)] cursor-pointer transition-all duration-300 group" 
        id="continuity-spine-card"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#FFD700]/10 transition-all duration-300" />
        <div className="flex items-center gap-3 border-b border-[#222] pb-3 mb-4">
          <RefreshCw className={`text-[#FFD700] w-5 h-5 group-hover:rotate-180 transition-all duration-500 ${isReconstructing ? 'animate-spin' : ''}`} />
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-gray-200">LAYER 2: THE CONTINUITY SPINE</h2>
            <p className="text-[10px] font-mono text-gray-500 uppercase">IDENTITY PERSISTENCE & GOVERNOR CORE</p>
          </div>
          <span className="ml-auto text-[9px] font-mono text-gray-600 border border-[#222] px-1.5 py-0.5 rounded group-hover:text-[#FFD700] group-hover:border-[#FFD700]/30 transition-colors">
            Inspect Node
          </span>
        </div>

        <div className="space-y-4" onClick={(e) => e.stopPropagation() /* Prevent opening explanation drawer when clicking controls inside spine */}>
          {/* Confidence Score Control / Visualization */}
          <div className="bg-[#111] border border-[#222] p-4 rounded relative">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-mono text-gray-400 uppercase">Cognitive Integrity Level</span>
              <span className={`text-sm font-mono font-bold ${confidence < 0.5 ? 'text-red-500 animate-pulse' : confidence < 0.8 ? 'text-[#FFD700]' : 'text-emerald-400'}`}>
                {(confidence * 100).toFixed(1)}% Integrity
              </span>
            </div>

            {isReconstructing ? (
              <div className="space-y-2 py-2 animate-fade-in">
                <div className="flex items-center gap-2 text-xs font-mono text-[#FFD700]">
                  <RefreshCw className="animate-spin w-3.5 h-3.5" />
                  <span>RECONSTRUCTING CORES - PHASE {reconstructionStep}/7</span>
                </div>
                <div className="w-full bg-[#222] h-1.5 rounded overflow-hidden">
                  <div
                    className="bg-[#FFD700] h-full transition-all duration-300 shadow-[0_0_8px_rgba(255,215,0,0.5)]"
                    style={{ width: `${(reconstructionStep / 7) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={confidence}
                  onChange={(e) => setConfidence(parseFloat(e.target.value))}
                  className="w-full accent-[#FFD700] h-1 bg-[#222] rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-gray-500">
                  <span className="text-red-500">DRIFTED (CRITICAL)</span>
                  <span className="text-[#FFD700]">WARNING BASE (50%)</span>
                  <span className="text-emerald-400">STABLE CORE (100%)</span>
                </div>
              </div>
            )}

            {confidence < 0.5 && !isReconstructing && (
              <div className="mt-3 flex items-center gap-2 p-2 bg-red-950/20 border border-red-900/30 rounded text-xs text-red-400 animate-pulse">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>INTEGRITY THRESHOLD BREACHED. Emergency Seed load imminent.</span>
              </div>
            )}
          </div>

          {/* Governor & Arbitration Simulation */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Intent Arbitration Engine</h3>
              <button
                onClick={(e) => simulateConflict(e)}
                disabled={isReconstructing}
                className="text-[10px] font-mono bg-[#111] hover:bg-[#1A1A1A] border border-[#222] text-[#FFD700] px-2.5 py-1 rounded transition disabled:opacity-50"
              >
                Simulate Goal Conflict
              </button>
            </div>

            <div className="bg-[#050505] border border-[#222] p-3 rounded h-28 overflow-y-auto font-mono text-[10px] text-gray-400 space-y-1 scrollbar-thin">
              {arbitrationLog.length === 0 ? (
                <span className="text-gray-600 block text-center py-8">[GOVERNOR STATE: IDLE / PATROLLING BOUNDS]</span>
              ) : (
                arbitrationLog.map((log, i) => (
                  <div key={i} className="border-l-2 border-[#FFD700] pl-2 leading-relaxed animate-fade-in">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
