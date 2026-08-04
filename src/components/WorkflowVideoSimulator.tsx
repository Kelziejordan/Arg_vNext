/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  Search, 
  Maximize2, 
  Terminal, 
  Sparkles, 
  CheckCircle2, 
  Activity,
  Cpu
} from 'lucide-react';

interface Step {
  id: number;
  label: string;
  description: string;
  codeSnippet: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED';
}

export default function WorkflowVideoSimulator() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState<1 | 1.5 | 2>(1);
  const [focusArea, setFocusArea] = useState<'flow' | 'terminal' | 'checklist'>('flow');
  const [progress, setProgress] = useState(0);
  
  const steps: Step[] = [
    {
      id: 1,
      label: "TRANSPILATION",
      description: "Compile portable, natural language requirements down to machine-readable JSON ast specifications.",
      codeSnippet: "Compiling 'todo list applet'...\n  -> Generating Abstract Syntax Tree\n  -> Output: metadata.json + blueprints.json\n[OK] AST structural layout compiled.",
      status: 'PENDING'
    },
    {
      id: 2,
      label: "AUDITING & LINTING",
      description: "Run the AOT static linter across the 9 constitutional engineering mandates to ensure safety.",
      codeSnippet: "Enforcing Rule M1: State Determinism... OK\nEnforcing Rule M2: AbortControllers found... OK\nEnforcing Rule M4: Safe Memory Limits... OK\n[OK] Linter clearance GRANTED.",
      status: 'PENDING'
    },
    {
      id: 3,
      label: "LEDGER SIGNATURE",
      description: "Package compiling transactions into an event-sourced immutable snapshot, signed with SHA-256.",
      codeSnippet: "Computing checksum signature...\n  -> Hash: sha256_b6acae10cbc94066bfa927592\n  -> Adding transaction block #402\n[OK] Snapshot immutable record secured.",
      status: 'PENDING'
    },
    {
      id: 4,
      label: "DEPLOYMENT RECOVERY",
      description: "Autonomically synchronize active container with the signed ledger state, resolving drift.",
      codeSnippet: "Starting sync thread...\n  -> Resetting sandbox container state to ledger #402\n  -> Validating performance ping: 8ms\n[OK] ArgOS synchronization COMPLETE. Core Nominal.",
      status: 'PENDING'
    }
  ];

  // Auto-play interval
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Move to next step or loop back
          setCurrentStepIndex((prevIndex) => (prevIndex + 1) % steps.length);
          return 0;
        }
        return prev + 6;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  const activeStep = steps[currentStepIndex];

  return (
    <div className="bg-[#090909]/95 border border-[#222] rounded-xl p-5 shadow-2xl relative overflow-hidden text-gray-300 font-mono text-[11px]" id="workflow-video-simulator">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#222] pb-3 mb-4 select-none">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <div>
            <h3 className="text-white font-black text-xs uppercase tracking-wider">LIVE WORKFLOW SIMULATION VIDEO</h3>
            <p className="text-[9px] text-gray-500 uppercase">Step-by-step Execution Visualizer</p>
          </div>
        </div>

        {/* Zoom & Focus Selection */}
        <div className="flex items-center gap-2">
          <span className="text-[8.5px] text-gray-500 uppercase">Focus Lens Zoom:</span>
          <div className="bg-[#111] border border-[#222] rounded p-0.5 flex gap-1">
            {([1, 1.5, 2] as const).map((z) => (
              <button
                key={z}
                onClick={() => setZoomLevel(z)}
                className={`text-[9px] font-black px-2 py-0.5 rounded cursor-pointer transition ${zoomLevel === z ? 'bg-[#FFD700] text-black' : 'text-gray-400 hover:text-white'}`}
              >
                {z}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Workspace Frame with Zoom style */}
      <div 
        className="relative border border-[#222] bg-[#050505] rounded-lg overflow-hidden min-h-[290px] transition-transform duration-500"
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'center center',
          zIndex: zoomLevel > 1 ? 20 : 1
        }}
      >
        {/* Background Scanlines for cool Retro/CRT vibe */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_50%,rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] pointer-events-none z-10" />

        <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch h-full">
          
          {/* FLOW DIAGRAM (Left panel) */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-3">
            <span className="text-[8.5px] text-gray-500 uppercase tracking-widest block font-black">
              ⚡ ACTIVE WORKFLOW FLOW
            </span>

            <div className="space-y-2.5 py-1">
              {steps.map((step, idx) => {
                const isActive = idx === currentStepIndex;
                const isPassed = idx < currentStepIndex;
                return (
                  <div 
                    key={step.id}
                    onClick={() => {
                      setCurrentStepIndex(idx);
                      setProgress(0);
                    }}
                    className={`p-2.5 rounded-lg border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                      isActive 
                        ? 'bg-[#FFD700]/10 border-[#FFD700] text-white shadow-[0_0_12px_rgba(255,215,0,0.1)]' 
                        : isPassed 
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-gray-400'
                        : 'bg-[#111]/40 border-[#1f1f1f] text-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black border ${
                        isActive 
                          ? 'bg-[#FFD700] text-black border-[#FFD700]' 
                          : isPassed 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-[#222] text-gray-500 border-transparent'
                      }`}>
                        {step.id}
                      </span>
                      <div className="text-left">
                        <span className="font-bold text-[9.5px] block tracking-wide uppercase">{step.label}</span>
                        <span className="text-[8px] text-gray-400 block max-w-[210px] truncate leading-none mt-0.5">{step.description}</span>
                      </div>
                    </div>

                    {isActive && (
                      <span className="text-[9px] text-[#FFD700] font-black animate-pulse flex items-center gap-1">
                        <Cpu className="w-3 h-3 animate-spin" />
                        RUNNING
                      </span>
                    )}
                    {isPassed && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SIMULATED TERMINAL WINDOW (Right panel) */}
          <div className="md:col-span-6 bg-[#0a0a0a] border border-[#1b1b1b] rounded-lg p-3.5 flex flex-col justify-between min-h-[220px]">
            <div className="flex items-center justify-between border-b border-[#1b1b1b] pb-2.5 mb-2.5">
              <span className="text-[8.5px] text-gray-400 font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                INTELLIGENT TELEMETRY RAW LOG
              </span>
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[8px] text-emerald-400 uppercase">ACTIVE</span>
              </div>
            </div>

            <div className="flex-grow font-mono text-[9px] text-gray-300 space-y-2 leading-relaxed overflow-y-auto max-h-[140px] pr-1 scrollbar-thin">
              <p className="text-[#FFD700] uppercase font-bold">// SEQUENCE INITIATED: {activeStep.label}</p>
              <pre className="whitespace-pre-wrap text-emerald-300 font-mono text-[9px] leading-relaxed">
                {activeStep.codeSnippet}
              </pre>
              <div className="w-full h-1 bg-[#111] rounded overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 transition-all duration-100 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <p className="text-[8px] text-gray-500 mt-2 text-center border-t border-[#111] pt-2">
              Autonomously compiling directives & signing cryptographically.
            </p>
          </div>

        </div>
      </div>

      {/* CONTROLLER DECK */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-[#111] border border-[#222] p-3 rounded-lg mt-4 gap-3 select-none">
        
        {/* Play Pause */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-1.5 bg-[#FFD700] hover:bg-[#FFD700]/90 text-black rounded font-black text-[10px] transition flex items-center gap-1.5 cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                PAUSE WORKFLOW
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                RESUME WORKFLOW
              </>
            )}
          </button>

          <button
            onClick={() => {
              setCurrentStepIndex(0);
              setProgress(0);
              setIsPlaying(true);
            }}
            className="p-1.5 border border-[#222] hover:border-white text-gray-400 hover:text-white rounded transition cursor-pointer"
            title="Restart Workflow Video"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Video progress indicator bar */}
        <div className="flex-grow max-w-sm w-full mx-4 flex items-center gap-3">
          <span className="text-[8px] text-gray-500">00:{(currentStepIndex * 5).toString().padStart(2, '0')}</span>
          <div className="flex-grow h-1.5 bg-[#1f1f1f] rounded-full overflow-hidden relative">
            <div 
              className="absolute left-0 top-0 h-full bg-[#FFD700]"
              style={{ width: `${((currentStepIndex + progress / 100) / steps.length) * 100}%` }}
            />
          </div>
          <span className="text-[8px] text-gray-500">00:20</span>
        </div>

        <div className="text-[9px] uppercase font-black text-[#FFD700]">
          Active Objective: <span className="text-white">{activeStep.label}</span>
        </div>
      </div>

    </div>
  );
}
