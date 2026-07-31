/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Sliders,
  Activity,
  Gauge,
  Sparkles,
  Compass,
  AlertTriangle,
  Layers,
  Settings
} from 'lucide-react';
import { useRuntime } from '../core/RuntimeContext';
import { ARCHITECTURAL_DICTIONARY } from '../core/TranslationLayer';

export default function OperationalStatePanel() {
  const {
    perspective,
    metrics,
    operatingState,
    transitionOperatingState,
    aggression,
    setAggression,
    caution,
    setCaution,
    exploration,
    setExploration,
    setExplorationRate,
    addLedgerEvent
  } = useRuntime();

  // Terminology translation helper
  const t = (key: keyof typeof ARCHITECTURAL_DICTIONARY, part: 'term' | 'codename' | 'benefit' | 'description' | 'technicalRole' = 'term') => {
    const concept = ARCHITECTURAL_DICTIONARY[key];
    if (!concept) return '';
    if (part === 'term') {
      return perspective === 'customer' ? concept.term : `${concept.term} (${concept.codename})`;
    }
    return concept[part];
  };

  // Mathematically calculate points of a dynamic balance triangle for the SVG
  // Central core is (100, 100). Max radius is 80.
  const cx = 120;
  const cy = 120;
  const radius = 90;

  // Let's compute the offsets based on active sliders
  const aggAngle = -Math.PI / 2; // Pointing straight up
  const cauAngle = (2 * Math.PI) / 3 - Math.PI / 2; // Bottom right
  const expAngle = (4 * Math.PI) / 3 - Math.PI / 2; // Bottom left

  const ax = cx + radius * aggression * Math.cos(aggAngle);
  const ay = cy + radius * aggression * Math.sin(aggAngle);

  const bx = cx + radius * caution * Math.cos(cauAngle);
  const by = cy + radius * caution * Math.sin(cauAngle);

  const cxPoint = cx + radius * (exploration * 2) * Math.cos(expAngle);
  const cyPoint = cy + radius * (exploration * 2) * Math.sin(expAngle);

  // Background reference triangle points
  const bgAx = cx + radius * Math.cos(aggAngle);
  const bgAy = cy + radius * Math.sin(aggAngle);
  const bgBx = cx + radius * Math.cos(cauAngle);
  const bgBy = cy + radius * Math.sin(cauAngle);
  const bgCx = cx + radius * Math.cos(expAngle);
  const bgCy = cy + radius * Math.sin(expAngle);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in" id="operational-state-workspace">
      
      {/* State Knobs (7 columns) */}
      <div className="md:col-span-7 space-y-6 flex flex-col justify-between">
        
        {/* State Vectors Adjustment Card */}
        <div className="bg-[#0A0A0A] border border-[#222] p-5 rounded-lg space-y-5 flex-grow">
          <div className="flex justify-between items-center border-b border-[#222] pb-3">
            <span className="text-xs font-mono text-[#FFD700] uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Identity Vectors & Canonical State Knobs
            </span>
            <span className="text-[9px] font-mono text-gray-500 uppercase">State Controller</span>
          </div>

          <div className="space-y-6">
            {/* Knob 1: Aggression */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-mono text-gray-400 font-bold">Aggression Stance</span>
                <span className="font-mono text-[#FFD700] font-black">{aggression.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={aggression}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setAggression(val);
                  addLedgerEvent(`State parameter changed: aggression -> ${val.toFixed(2)}`);
                }}
                className="w-full accent-[#FFD700] h-1 bg-[#111] rounded outline-none cursor-pointer"
              />
              <p className="text-[10px] text-gray-500 leading-normal">
                Scales cognitive speed and strategic risk bounds. Higher values prioritize throughput and direct actions over recursive safeguards.
              </p>
            </div>

            {/* Knob 2: Caution */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-mono text-gray-400 font-bold">Caution Guardrails</span>
                <span className="font-mono text-white font-black">{caution.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={caution}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setCaution(val);
                  addLedgerEvent(`State parameter changed: caution -> ${val.toFixed(2)}`);
                }}
                className="w-full accent-white h-1 bg-[#111] rounded outline-none cursor-pointer"
              />
              <p className="text-[10px] text-gray-500 leading-normal">
                Controls the sensitivity of our <strong className="text-white font-mono">{t('FROZEN_CORE')}</strong> audit routines. Higher values tighten pre-execution sandboxing limits.
              </p>
            </div>

            {/* Knob 3: Exploration */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-mono text-gray-400 font-bold">Exploration Rate</span>
                <span className="font-mono text-[#FFD700] font-black">{(exploration * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.05"
                value={exploration}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setExploration(val);
                  setExplorationRate(val);
                  addLedgerEvent(`State parameter changed: explorationRate -> ${val.toFixed(2)}`);
                }}
                className="w-full accent-[#FFD700] h-1 bg-[#111] rounded outline-none cursor-pointer"
              />
              <p className="text-[10px] text-gray-500 leading-normal">
                Determines LLM provider distribution weight. High parameters leverage diverse alternative intelligence networks, while lower weights lock into the local core model.
              </p>
            </div>
          </div>
        </div>

        {/* Operating State Profile Metadata Summary */}
        <div className="bg-[#0A0A0A] border border-[#222] p-5 rounded-lg space-y-4">
          <div className="flex justify-between items-center border-b border-[#222] pb-2">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#FFD700]" />
              Active Operating State: {operatingState}
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            The active operating stance defines the macro behavioral profile:
          </p>
          <div className="grid grid-cols-3 gap-3 text-center text-[10px] font-mono">
            <div className={`p-2.5 rounded border transition ${operatingState === 'SHIP' ? 'bg-[#FFD700]/5 border-[#FFD700] text-white' : 'bg-[#050505] border-[#222] text-gray-500'}`}>
              <div className="font-bold uppercase text-[#FFD700] mb-0.5">SHIP MODE</div>
              <span>Optimal action speed. Active safeguards.</span>
            </div>
            <div className={`p-2.5 rounded border transition ${operatingState === 'FREEZE' ? 'bg-white/5 border-white text-white' : 'bg-[#050505] border-[#222] text-gray-500'}`}>
              <div className="font-bold uppercase text-white mb-0.5">FREEZE MODE</div>
              <span>Zero drift. Read-only variables locked.</span>
            </div>
            <div className={`p-2.5 rounded border transition ${operatingState === 'EXPAND' ? 'bg-white/5 border-white text-white' : 'bg-[#050505] border-[#222] text-gray-500'}`}>
              <div className="font-bold uppercase text-white mb-0.5">EXPAND MODE</div>
              <span>High research bias. Sovereign exploration.</span>
            </div>
          </div>
        </div>

      </div>

      {/* Cybernetic Dynamic Balance Map (5 columns) */}
      <div className="md:col-span-5 space-y-6 flex flex-col h-full justify-between">
        
        {/* Dynamic Triangle Balance Visualizer */}
        <div className="bg-[#0A0A0A] border border-[#222] p-5 rounded-lg flex flex-col items-center justify-between h-full min-h-[440px]">
          <div className="w-full flex justify-between items-center border-b border-[#222] pb-2 mb-4 shrink-0">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#FFD700]" />
              Autonomic Balance Vector Map
            </span>
            <span className="text-[9px] text-[#FFD700] font-mono uppercase">Live Field</span>
          </div>

          {/* SVG Canvas for balance plot */}
          <div className="flex-grow flex items-center justify-center py-4">
            <svg width="240" height="240" className="overflow-visible" id="autonomy-vector-svg">
              {/* Reference Grid lines */}
              <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#222" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx={cx} cy={cy} r={radius / 2} fill="none" stroke="#222" strokeWidth="1" strokeDasharray="3 3" />
              
              {/* Axes lines */}
              <line x1={cx} y1={cy} x2={bgAx} y2={bgAy} stroke="#222" strokeWidth="1" />
              <line x1={cx} y1={cy} x2={bgBx} y2={bgBy} stroke="#222" strokeWidth="1" />
              <line x1={cx} y1={cy} x2={bgCx} y2={bgCy} stroke="#222" strokeWidth="1" />

              {/* Background limit triangle */}
              <polygon 
                points={`${bgAx},${bgAy} ${bgBx},${bgBy} ${bgCx},${bgCy}`} 
                fill="none" 
                stroke="#333" 
                strokeWidth="1.5" 
              />

              {/* Central stable core zone */}
              <polygon 
                points={`${cx + 20 * Math.cos(aggAngle)},${cy + 20 * Math.sin(aggAngle)} ${cx + 20 * Math.cos(cauAngle)},${cy + 20 * Math.sin(cauAngle)} ${cx + 20 * Math.cos(expAngle)},${cy + 20 * Math.sin(expAngle)}`} 
                fill="#FFD700" 
                fillOpacity="0.03"
                stroke="#FFD700" 
                strokeWidth="0.5" 
                strokeDasharray="2 2"
              />

              {/* Dynamic state polygon representing active sliders */}
              <polygon 
                points={`${ax},${ay} ${bx},${by} ${cxPoint},${cyPoint}`} 
                fill="url(#goldGradient)" 
                fillOpacity="0.18"
                stroke="#FFD700" 
                strokeWidth="2.5" 
                className="transition-all duration-300"
              />

              {/* Vertex Anchor Points */}
              <circle cx={ax} cy={ay} r="5" fill="#FFD700" className="transition-all duration-300 shadow-md" />
              <circle cx={bx} cy={by} r="5" fill="#FFF" className="transition-all duration-300 shadow-md" />
              <circle cx={cxPoint} cy={cyPoint} r="5" fill="#FFD700" className="transition-all duration-300 shadow-md" />

              {/* Axis Labels */}
              <text x={bgAx} y={bgAy - 10} textAnchor="middle" fill="#FFD700" className="text-[9px] font-mono font-black uppercase">AGGRESSION</text>
              <text x={bgBx + 12} y={bgBy + 4} textAnchor="start" fill="#FFF" className="text-[9px] font-mono font-bold uppercase">CAUTION</text>
              <text x={bgCx - 12} y={bgCy + 4} textAnchor="end" fill="#FFD700" className="text-[9px] font-mono font-bold uppercase">EXPLORE</text>

              {/* Defs for glow gradient */}
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#D4AF37" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="w-full text-center border-t border-[#111] pt-3 shrink-0">
            <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest block mb-1">Vector Alignment Metric</span>
            <p className="text-[10px] text-gray-400 leading-normal font-mono">
              Aut Autonomic Balance: <span className="text-white font-bold">{((aggression + caution + (exploration * 2)) / 3).toFixed(2)}</span> / Stable Coherence Profile
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
