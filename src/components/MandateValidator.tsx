/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { ClipboardCheck, Play, AlertCircle, CheckCircle, FileCode, Sparkles, Upload, ShieldAlert, Info } from 'lucide-react';
import { MandateAuditReport, RemoteData } from '../types';

interface MandateValidatorProps {
  onAddLog: (message: string, level: 'INFO' | 'WARN' | 'ERROR' | 'SYSTEM' | 'RECONSTRUCT', source: 'SEED' | 'SPINE' | 'APEX' | 'GOVERNOR' | 'AGENT') => void;
  onShowExplanation?: (area: string) => void;
}

const TEMPLATE_NON_COMPLIANT = `// Violates several ARGUS V12 mandates
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Heavy dependency instead of native fetch

export default function UserList() {
  const [users, setUsers] = useState<any[]>([]); // Violates Mandate 3: any type
  const [loading, setLoading] = useState(true); // Violates Mandate 1: Split boolean flags
  const [error, setError] = useState(false); // Violates Mandate 1: Split boolean flags

  useEffect(() => {
    // Violates Mandate 2: Missing AbortController / cancellation
    axios.get('https://api.example.com/users')
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>loading...</div>;
  if (error) return <div>error!</div>;

  return (
    // Violates Mandate 4: Non-accessible container structure
    <div onClick={() => console.log('clicked')}>
      {users.map(u => (
        <span key={u.id}>{u.name}</span>
      ))}
    </div>
  );
}`;

const TEMPLATE_COMPLIANT = `// Adheres strictly to ARGUS V12 Engineering Mandates
import React, { useEffect, useState } from 'react';
import { RemoteData } from './types'; // Mandate 5: Proper Separation of layers

interface User {
  id: string;
  name: string;
}

export default function UserList() {
  // Mandate 1: STATE DETERMINISM using RemoteData union state
  const [state, setState] = useState<RemoteData<User[]>>({ type: 'NOT_ASKED' });

  useEffect(() => {
    // Mandate 2: SIGNAL-DRIVEN ASYNCHRONY with AbortController
    const controller = new AbortController();
    
    setState({ type: 'LOADING' });

    async function fetchUsers() {
      try {
        const response = await fetch('https://api.example.com/users', {
          signal: controller.signal
        });
        
        // Mandate 8: ZERO-TRUST BOUNDARIES runtime validation
        if (!response.ok) {
          throw new Error(\`Network response error: \${response.status}\`);
        }
        
        const data: unknown = await response.json();
        
        // Runtime type assertion & check
        if (Array.isArray(data) && data.every(item => item && typeof item.id === 'string' && typeof item.name === 'string')) {
          setState({ type: 'SUCCESS', data: data as User[] }); // Mandate 3: Strict Types
        } else {
          throw new Error('Data format breach: invalid schema.');
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          // Mandate 9: INTRINSIC OBSERVABILITY logging
          console.error('[OBSERVABILITY_LOGGER] fetch failure', { error: err.message });
          setState({ type: 'FAILURE', error: err.message || 'Unknown compilation anomaly.' });
        }
      }
    }

    fetchUsers();

    return () => {
      // Clean teardown signal
      controller.abort();
    };
  }, []);

  // Structural accessibility (Mandate 4)
  if (state.type === 'LOADING') {
    return <div role="status" aria-label="Loading users list" className="text-sm font-mono text-cyan-400">Loading...</div>;
  }

  if (state.type === 'FAILURE') {
    return <div role="alert" className="text-sm font-mono text-red-500">Error: {state.error}</div>;
  }

  if (state.type === 'SUCCESS') {
    return (
      <ul aria-label="User registry" className="space-y-1">
        {state.data.map(user => (
          <li key={user.id} className="text-xs font-mono text-gray-300">
            ID: <span className="text-cyan-400">{user.id}</span> | Name: <span className="font-bold">{user.name}</span>
          </li>
        ))}
      </ul>
    );
  }

  return null;
}`;

interface ClientAuditFinding {
  mandate: string;
  passed: boolean;
  findings: string;
  recommendation: string;
}

function runClientSideLinter(codeStr: string): { score: number; findings: ClientAuditFinding[] } {
  const findings: ClientAuditFinding[] = [];
  
  // 1. STATE DETERMINISM
  const usesRemoteData = codeStr.includes('RemoteData');
  const usesSplitBooleans = /useState\s*\(\s*(true|false)\s*\)/.test(codeStr) && (codeStr.includes('loading') || codeStr.includes('error') || codeStr.includes('load'));
  if (usesSplitBooleans && !usesRemoteData) {
    findings.push({
      mandate: "M1: STATE DETERMINISM",
      passed: false,
      findings: "Detected split boolean loading/error state flags in code parameters.",
      recommendation: "Replace split states with a single unified RemoteData<T> union model."
    });
  } else {
    findings.push({
      mandate: "M1: STATE DETERMINISM",
      passed: true,
      findings: usesRemoteData ? "RemoteData union state is cleanly integrated." : "No split loading/error flags found.",
      recommendation: "Preserve deterministic transitions across state updates."
    });
  }

  // 2. SIGNAL-DRIVEN ASYNCHRONY
  const hasAsync = codeStr.includes('async') || codeStr.includes('fetch') || codeStr.includes('axios') || codeStr.includes('useEffect');
  const hasAbortController = codeStr.includes('AbortController') || codeStr.includes('signal:');
  if (hasAsync && !hasAbortController) {
    findings.push({
      mandate: "M2: SIGNAL-DRIVEN ASYNCHRONY",
      passed: false,
      findings: "Found un-cancellable asynchronous hooks or requests.",
      recommendation: "Inject an AbortController and bind its signal parameters to the fetch scope."
    });
  } else {
    findings.push({
      mandate: "M2: SIGNAL-DRIVEN ASYNCHRONY",
      passed: true,
      findings: hasAbortController ? "AbortController or cancellation signal found." : "No asynchronous requests needing abort handles.",
      recommendation: "Keep async scopes cleanly cancellable."
    });
  }

  // 3. STRICT TYPE BOUNDARIES
  const hasAnyType = /\bany\b|:\s*any\b|as\s+any\b|any\[\]/.test(codeStr);
  if (hasAnyType) {
    findings.push({
      mandate: "M3: STRICT TYPE BOUNDARIES",
      passed: false,
      findings: "Unsafe 'any' type cast or declaration found.",
      recommendation: "Define precise interfaces or use 'unknown' with type-safety checks."
    });
  } else {
    findings.push({
      mandate: "M3: STRICT TYPE BOUNDARIES",
      passed: true,
      findings: "Strict type integrity is preserved throughout.",
      recommendation: "Avoid future any casts to protect code compile safety."
    });
  }

  // 4. ZERO-TRUST BOUNDARIES
  const hasUnvalidatedJson = codeStr.includes('response.json()') && !codeStr.includes('typeof') && !codeStr.includes('zod') && !codeStr.includes('valibot') && !codeStr.includes('Array.isArray');
  if (hasUnvalidatedJson) {
    findings.push({
      mandate: "M8: ZERO-TRUST BOUNDARIES",
      passed: false,
      findings: "Response.json() parsed directly without validation guards.",
      recommendation: "Perform structure check using schemas or type-guards before accepting raw streams."
    });
  } else {
    findings.push({
      mandate: "M8: ZERO-TRUST BOUNDARIES",
      passed: true,
      findings: "Input schemas and validation guards appear properly handled.",
      recommendation: "Ensure all external data entry channels use runtime validations."
    });
  }

  const passedCount = findings.filter(f => f.passed).length;
  const score = Math.round((passedCount / findings.length) * 100);

  return { score, findings };
}

export default function MandateValidator({ onAddLog, onShowExplanation }: MandateValidatorProps) {
  const [code, setCode] = useState<string>(TEMPLATE_NON_COMPLIANT);
  const [auditResult, setAuditResult] = useState<RemoteData<MandateAuditReport>>({ type: 'NOT_ASKED' });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      loadFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      loadFile(files[0]);
    }
  };

  const loadFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === 'string') {
        setCode(event.target.result);
        onAddLog(`Loaded source code from local file: "${file.name}"`, 'INFO', 'APEX');
      }
    };
    reader.readAsText(file);
  };

  const runAudit = async () => {
    setAuditResult({ type: 'LOADING' });
    onAddLog('Initiating Static Mandate Analysis on target codebase...', 'SYSTEM', 'APEX');

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      if (!response.ok) {
        throw new Error(`Audit server responded with state: ${response.status}`);
      }

      const data: MandateAuditReport = await response.json();
      setAuditResult({ type: 'SUCCESS', data });
      onAddLog(`Audit completed with compliance score: ${data.score}% (${data.passed ? 'PASSED' : 'REJECTED'})`, data.passed ? 'INFO' : 'ERROR', 'APEX');
    } catch (err: any) {
      console.error(err);
      setAuditResult({ type: 'FAILURE', error: err.message || 'An unknown compilation breakdown occurred.' });
      onAddLog(`Static compiler failure: ${err.message}`, 'ERROR', 'APEX');
    }
  };

  const loadTemplate = (type: 'compliant' | 'non-compliant') => {
    if (type === 'compliant') {
      setCode(TEMPLATE_COMPLIANT);
      onAddLog('Loaded standard ARGUS-compliant reference template.', 'INFO', 'APEX');
    } else {
      setCode(TEMPLATE_NON_COMPLIANT);
      onAddLog('Loaded standard non-compliant reference template.', 'INFO', 'APEX');
    }
  };

  return (
    <div 
      onClick={() => onShowExplanation?.('mandates')}
      className="bg-[#0A0A0A] border border-[#222] rounded p-5 relative hover:border-[#FFD700]/10 hover:shadow-[0_0_12px_rgba(255,215,0,0.02)] transition-all duration-300" 
      id="mandate-validator-section"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#222] pb-3 mb-4 cursor-pointer group">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="text-[#FFD700] w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-gray-200 group-hover:text-white transition-colors">THE NINE CORE ENGINEERING MANDATES</h2>
            <p className="text-[10px] font-mono text-gray-500">APEX ENGINE COMPLIANCE AUDITOR</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => loadTemplate('non-compliant')}
            className="text-[10px] font-mono bg-[#111] hover:bg-[#1A1A1A] text-red-400 border border-red-900/30 px-2.5 py-1 rounded transition"
          >
            Non-Compliant Example
          </button>
          <button
            onClick={() => loadTemplate('compliant')}
            className="text-[10px] font-mono bg-[#111] hover:bg-[#1A1A1A] text-[#FFD700] border border-[#FFD700]/30 px-2.5 py-1 rounded transition"
          >
            Compliant Example
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Source Code Area */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="flex justify-between items-center bg-[#111] px-3 py-1.5 rounded border border-[#222]">
            <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-[#FFD700]" />
              TARGET_SOURCE.TS
            </span>
            <div className="flex items-center gap-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden" 
                accept=".ts,.tsx,.js,.jsx,.txt"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 text-[10px] font-mono text-gray-400 hover:text-white border border-[#222] hover:border-[#333] px-2.5 py-1 rounded transition bg-[#0C0C0C]"
              >
                <Upload className="w-3 h-3" />
                Upload File
              </button>
              <button
                onClick={runAudit}
                disabled={auditResult.type === 'LOADING'}
                className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase bg-[#FFD700] hover:bg-[#E5C100] text-black px-3 py-1 rounded transition disabled:opacity-50 shadow-[0_0_8px_rgba(255,215,0,0.2)]"
              >
                <Play className="w-3 h-3 fill-black" />
                Execute Audit
              </button>
            </div>
          </div>

          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative flex flex-col transition-all duration-300 rounded border ${isDragging ? 'border-[#FFD700] bg-[#FFD700]/5 shadow-[0_0_15px_rgba(255,215,0,0.1)]' : 'border-[#222]'}`}
          >
            {isDragging && (
              <div className="absolute inset-0 bg-[#050505]/90 flex flex-col items-center justify-center pointer-events-none z-10 animate-fade-in">
                <Upload className="w-8 h-8 text-[#FFD700] animate-bounce mb-2" />
                <span className="text-xs font-mono text-[#FFD700] uppercase tracking-widest">Drop file to load source</span>
              </div>
            )}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-80 bg-[#050505] text-gray-300 font-mono text-xs p-4 focus:outline-none focus:ring-1 focus:ring-[#FFD700]/30 resize-none leading-relaxed shadow-inner"
              placeholder="Paste your TypeScript code here to run static verification..."
            />
          </div>

          {/* Real-time Client-side Heuristics Panel */}
          <div className="bg-[#050505] border border-[#222] rounded p-3 space-y-2">
            <div className="flex justify-between items-center border-b border-[#222] pb-1.5">
              <span className="text-[9px] font-mono text-[#FFD700] uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                Heuristic Compliance Guard (Keystroke Real-Time)
              </span>
              <span className={`text-[10px] font-mono font-bold ${runClientSideLinter(code).score >= 75 ? 'text-[#FFD700]' : 'text-red-400'}`}>
                Score: {runClientSideLinter(code).score}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
              {runClientSideLinter(code).findings.map((f, i) => (
                <div key={i} className={`p-2 rounded border flex flex-col justify-between ${f.passed ? 'bg-[#FFD700]/5 border-[#FFD700]/10 text-gray-400' : 'bg-red-950/15 border-red-900/20 text-gray-300'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-gray-200">{f.mandate}</span>
                    <span className={f.passed ? 'text-[#FFD700]' : 'text-red-400'}>{f.passed ? '✓ PASS' : '✗ BREACH'}</span>
                  </div>
                  <p className="text-[8px] text-gray-500 leading-tight mb-1">{f.findings}</p>
                  {!f.passed && (
                    <p className="text-[8px] text-red-400 font-bold border-t border-red-900/20 pt-1 mt-1">
                      Fix: {f.recommendation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Audit Report Area */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-[#111] px-3 py-1.5 rounded border border-[#222] mb-3">
            <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
              COMPILER REPORTS & ANALYSIS
            </span>
          </div>

          <div className="bg-[#050505] border border-[#222] rounded p-4 h-96 overflow-y-auto flex flex-col shadow-inner">
            {auditResult.type === 'NOT_ASKED' && (
              <div className="m-auto text-center max-w-xs space-y-2">
                <ClipboardCheck className="w-10 h-10 text-gray-600 mx-auto" />
                <h3 className="text-xs font-mono text-gray-400 uppercase tracking-wider">Awaiting Target Source</h3>
                <p className="text-[10px] text-gray-500">
                  Select a template or paste custom code inside the editor, then run static verification to generate the compliance score.
                </p>
              </div>
            )}

            {auditResult.type === 'LOADING' && (
              <div className="m-auto text-center space-y-4">
                <div className="relative w-12 h-12 mx-auto">
                  <div className="absolute inset-0 rounded-full border-2 border-[#FFD700]/20 border-t-[#FFD700] animate-spin" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-mono text-[#FFD700]">COMPILE_STATIC_PASS_ACTIVE</p>
                  <p className="text-[9px] font-mono text-gray-500 animate-pulse">Consulting core architectural rules...</p>
                </div>
              </div>
            )}

            {auditResult.type === 'FAILURE' && (
              <div className="m-auto p-3 bg-red-950/20 border border-red-900/40 rounded text-center max-w-xs space-y-2">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
                <h3 className="text-xs font-mono text-red-500 font-bold">ANALYSIS ABORTED</h3>
                <p className="text-[10px] text-gray-400 leading-relaxed font-mono">
                  {auditResult.error}
                </p>
              </div>
            )}

            {auditResult.type === 'SUCCESS' && (
              <div className="space-y-4">
                {/* Score Header */}
                <div className="flex items-center justify-between border-b border-[#222] pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase">Compliance Threshold</span>
                    <p className={`text-xl font-mono font-black ${auditResult.data.passed ? 'text-[#FFD700]' : 'text-red-400'}`}>
                      {auditResult.data.score}% - {auditResult.data.passed ? 'VERIFIED' : 'FAILED'}
                    </p>
                  </div>
                  {auditResult.data.passed ? (
                    <CheckCircle className="w-8 h-8 text-[#FFD700] shrink-0" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-red-400 shrink-0" />
                  )}
                </div>

                {/* Overall summary */}
                <div className="p-3 bg-[#0A0A0A] border border-[#222] rounded">
                  <p className="text-[10px] font-mono text-gray-400 leading-relaxed">
                    <span className="text-[#FFD700] font-bold uppercase block mb-1">Architectural Critique</span>
                    {auditResult.data.overallSummary}
                  </p>
                </div>

                {/* Breakdown */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Mandate Findings</span>
                  {auditResult.data.details.map((detail, idx) => (
                    <div key={idx} className="bg-[#0A0A0A] border border-[#222] rounded p-2.5 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold text-gray-300">{detail.mandate}</span>
                        <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${detail.passed ? 'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                          {detail.passed ? 'Pass' : 'Breach'}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-relaxed italic">
                        &ldquo;{detail.findings}&rdquo;
                      </p>
                      {!detail.passed && (
                        <div className="pt-1 text-[9px] font-mono text-red-400 border-t border-[#222]/50">
                          <span className="font-bold">Corrective Action:</span> {detail.recommendation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
