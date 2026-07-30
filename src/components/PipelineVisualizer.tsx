/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Layers, Terminal, AlertTriangle, ShieldCheck, ChevronRight, Play, Check } from 'lucide-react';
import { DomainProtocol, PROTOCOL_METADATA, SystemMetric } from '../types';

interface PipelineVisualizerProps {
  onAddLog: (message: string, level: 'INFO' | 'WARN' | 'ERROR' | 'SYSTEM' | 'RECONSTRUCT', source: 'SEED' | 'SPINE' | 'APEX' | 'GOVERNOR' | 'AGENT') => void;
  onUpdateMetrics: (updater: (prev: SystemMetric) => SystemMetric) => void;
  onShowExplanation?: (area: string) => void;
}

const PIPELINE_PROCESSES = [
  { id: 0, phase: 1, name: 'Scale Assessment', desc: 'Sizing core constraints' },
  { id: 1, phase: 1, name: 'Strategist Plan', desc: 'Delineating goal priorities' },
  { id: 2, phase: 1, name: 'Decomposer Structure', desc: 'Separating layers cleanly' },
  { id: 3, phase: 1, name: 'Drafting Spec', desc: 'Documenting signatures' },
  { id: 4, phase: 1, name: 'Threat Mapping', desc: 'Scanning for unsafe bounds' },
  { id: 5, phase: 1, name: 'Hostile Audit', desc: 'Injecting failure points' },
  { id: 6, phase: 1, name: 'Blueprint Render', desc: 'Serializing schemas' },
  { id: 7, phase: 1, name: 'Chaos Injection', desc: 'Validating recovery routes' },
  { id: 8, phase: 1, name: 'Alternatives Study', desc: 'Analyzing complexity metrics' },
  { id: 9, phase: 1, name: 'Simplicity Filter', desc: 'Pruning unneeded branches' },
  { id: 10, phase: 1, name: 'ADR Logging', desc: 'Recording structural design choices' },
  { id: 11, phase: 1, name: 'Scaling Test', desc: 'Simulating concurrent stress' },
  { id: 12, phase: 1, name: 'Mandate Audit', desc: 'Validating compliance gates' },
  { id: 13, phase: 1, name: 'Dependency Tree', desc: 'Locking module boundaries' },
  { id: 14, phase: 1, name: 'Clearance Gate', desc: 'Signing IVP security tokens' },
  { id: 15, phase: 2, name: 'Layered Generation', desc: 'Assembling verified code' },
  { id: 16, phase: 2, name: 'Retrospective', desc: 'Consolidating feedback loops' },
  { id: 17, phase: 2, name: 'Protocol Matrix Update', desc: 'Persisting adaptive weights' }
];

export default function PipelineVisualizer({ onAddLog, onUpdateMetrics, onShowExplanation }: PipelineVisualizerProps) {
  const [activeProtocol, setActiveProtocol] = useState<DomainProtocol>(DomainProtocol.PROTOCOL_F);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [stepStates, setStepStates] = useState<Record<number, 'IDLE' | 'ACTIVE' | 'DONE' | 'FAIL'>>({});
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [buildLogs]);

  const selectProtocol = (proto: DomainProtocol) => {
    if (isRunning) return;
    setActiveProtocol(proto);
    onAddLog(`Activated Domain ${PROTOCOL_METADATA[proto].name}`, 'INFO', 'GOVERNOR');
  };

  const startPipeline = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStepIndex(0);
    setBuildLogs([]);
    onAddLog(`Starting 17-Process Pipeline under ${PROTOCOL_METADATA[activeProtocol].name}`, 'SYSTEM', 'APEX');

    const initialStates: Record<number, 'IDLE' | 'ACTIVE' | 'DONE' | 'FAIL'> = {};
    PIPELINE_PROCESSES.forEach(p => {
      initialStates[p.id] = 'IDLE';
    });
    setStepStates(initialStates);

    let currentIndex = 0;

    const executeStep = () => {
      if (currentIndex >= PIPELINE_PROCESSES.length) {
        setIsRunning(false);
        setCurrentStepIndex(-1);
        onAddLog(`Apex Compile Pipeline successfully completed. Core signature hash: sha256_${Math.random().toString(16).substring(2, 10)}_omega.`, 'INFO', 'APEX');
        onUpdateMetrics(prev => ({
          ...prev,
          speed: Math.max(10, prev.speed - 5),
          leverage: +(prev.leverage + 0.15).toFixed(2),
          correctness: Math.min(100, prev.correctness + 2)
        }));
        return;
      }

      setCurrentStepIndex(currentIndex);
      const step = PIPELINE_PROCESSES[currentIndex];

      setStepStates(prev => ({ ...prev, [step.id]: 'ACTIVE' }));
      const logMsg = `[Step P${step.id}] [${step.name}] - ${step.desc}`;
      setBuildLogs(prev => [...prev, `🚀 ${logMsg}`]);

      // Add protocol-specific log embellishments
      setTimeout(() => {
        let embellish = '';
        if (step.id === 4) {
          embellish = `🛡️ [THREAT SCAN] Conforming to rules of ${PROTOCOL_METADATA[activeProtocol].tag}. Validating boundaries.`;
        } else if (step.id === 12) {
          embellish = `✅ [MANDATE GATE] Reviewing static code structures against 9 Mandates. All thresholds secure.`;
        } else if (step.id === 14) {
          embellish = `🔑 [CLEARANCE] IVP Continuity token generated. Signing compilation manifest.`;
        } else if (step.id === 17) {
          embellish = `💾 [MATRIX UPDATE] Synchronizing adaptive parameters across execution branches. State saved.`;
        }

        if (embellish) {
          setBuildLogs(prev => [...prev, embellish]);
        }

        setStepStates(prev => ({ ...prev, [step.id]: 'DONE' }));
        setBuildLogs(prev => [...prev, `✔ Completed P${step.id} securely.`]);

        currentIndex++;
        executeStep();
      }, 400); // quick transition
    };

    executeStep();
  };

  return (
    <div 
      onClick={() => onShowExplanation?.('apex')}
      className="bg-[#0A0A0A] border border-[#222] rounded p-5 relative hover:border-[#FFD700]/10 hover:shadow-[0_0_12px_rgba(255,215,0,0.02)] transition-all duration-300" 
      id="pipeline-visualizer-section"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#222] pb-3 mb-4 cursor-pointer group">
        <div className="flex items-center gap-2">
          <Layers className="text-[#FFD700] w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-gray-200 group-hover:text-white transition-colors">THE APEX EXECUTION BRANCH</h2>
            <p className="text-[10px] font-mono text-gray-500">17-PROCESS PIPELINE & DOMAIN PROTOCOL ENGINE</p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            startPipeline();
          }}
          disabled={isRunning}
          className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase bg-[#FFD700] hover:bg-[#E5C100] text-black px-4 py-1.5 rounded transition disabled:opacity-50 shadow-[0_0_8px_rgba(255,215,0,0.2)]"
        >
          <Play className="w-3.5 h-3.5 fill-black" />
          Compile Apex Build
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Domain Protocol Matrix (Left) */}
        <div className="xl:col-span-4 flex flex-col space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Active Domain Protocols</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(PROTOCOL_METADATA).map((key) => {
                const proto = key as DomainProtocol;
                const meta = PROTOCOL_METADATA[proto];
                const isActive = activeProtocol === proto;

                return (
                  <button
                    key={proto}
                    onClick={() => selectProtocol(proto)}
                    disabled={isRunning}
                    className={`text-left p-2.5 rounded border text-xs font-mono transition relative overflow-hidden ${
                      isActive
                        ? 'bg-[#111] border-[#FFD700]/50 text-[#FFD700] ring-1 ring-[#FFD700]/10'
                        : 'bg-[#111] border-[#222] text-gray-500 hover:border-[#444] hover:text-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-[10px] truncate">{meta.name.split(' (')[0]}</span>
                      <span className={`text-[8px] px-1 py-0.2 rounded font-bold ${
                        isActive ? 'bg-[#FFD700]/10 text-[#FFD700]' : 'bg-gray-800 text-gray-500'
                      }`}>
                        {meta.tag}
                      </span>
                    </div>
                    <p className="text-[9px] text-gray-500 leading-tight line-clamp-2">{meta.description}</p>
                    {isActive && (
                      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-[#FFD700]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Protocol Constraints */}
          <div className="bg-[#111] border border-[#222] p-4 rounded flex-grow space-y-2.5">
            <h4 className="text-xs font-mono text-[#FFD700] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              CONSTRAINTS_LIST: {PROTOCOL_METADATA[activeProtocol].tag}
            </h4>
            <div className="space-y-1.5">
              {PROTOCOL_METADATA[activeProtocol].rules.map((rule, idx) => (
                <div key={idx} className="flex gap-2 text-[10px] font-mono text-gray-400 items-start">
                  <span className="text-[#FFD700] mt-0.5">•</span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 17-Process Visual Stack (Middle) */}
        <div className="xl:col-span-5 flex flex-col space-y-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Process Pipeline Grid</h3>

          <div className="bg-[#050505] border border-[#222] rounded p-3 grid grid-cols-2 gap-2 h-[340px] overflow-y-auto">
            {PIPELINE_PROCESSES.map((proc, index) => {
              const state = stepStates[proc.id] || 'IDLE';
              const isCurrent = currentStepIndex === index;

              return (
                <div
                  key={proc.id}
                  className={`p-2 rounded border text-left transition relative flex items-center gap-2.5 ${
                    isCurrent
                      ? 'bg-[#111] border-[#FFD700]/50 text-[#FFD700] shadow-[0_0_8px_rgba(255,215,0,0.1)]'
                      : state === 'DONE'
                      ? 'bg-[#0A0A0A] border-[#222] text-gray-300'
                      : 'bg-[#0A0A0A] border-[#1A1A1A] text-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-center shrink-0">
                    {state === 'DONE' ? (
                      <span className="w-4 h-4 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] flex items-center justify-center text-[9px] font-bold">
                        ✓
                      </span>
                    ) : isCurrent ? (
                      <span className="w-4 h-4 rounded-full border border-[#FFD700] border-t-transparent animate-spin flex items-center justify-center text-[9px] font-bold" />
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-black border border-[#222] text-gray-600 flex items-center justify-center text-[8px] font-mono font-bold">
                        {proc.id}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-mono font-bold truncate">{proc.name}</p>
                    <p className="text-[8px] text-gray-500 truncate leading-none mt-0.5">{proc.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Build Logs Console (Right) */}
        <div className="xl:col-span-3 flex flex-col space-y-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-[#FFD700]" />
            Live Build Stream
          </h3>

          <div className="bg-[#050505] border border-[#222] rounded p-3 h-[340px] overflow-y-auto font-mono text-[9px] text-[#FFD700]/90 space-y-1.5 shadow-inner">
            {buildLogs.length === 0 ? (
              <span className="text-gray-600 text-center py-24 block">[APEX COOLDOWN STATE: WAITING FOR COMPILATION TRIGGER]</span>
            ) : (
              buildLogs.map((log, i) => (
                <div key={i} className="leading-normal border-b border-gray-900/40 pb-1 last:border-0">
                  {log}
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
