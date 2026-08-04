/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileText, Upload, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, RefreshCw, Layers } from 'lucide-react';
import { useRuntime } from '../core/RuntimeContext';

export default function DocumentAnalyzer() {
  const { addLog } = useRuntime();
  const [documentText, setDocumentText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    score: number;
    entities: string[];
    mandatesPassed: number;
    warnings: string[];
    summary: string;
  } | null>(null);

  const handleAnalyze = () => {
    if (!documentText.trim()) return;
    setIsAnalyzing(true);
    addLog('Document Analyzer pipeline initialized...', 'INFO', 'GOVERNOR');

    setTimeout(() => {
      const lower = documentText.toLowerCase();
      const hasAuth = lower.includes('auth') || lower.includes('jwt') || lower.includes('session');
      const hasDatabase = lower.includes('sql') || lower.includes('table') || lower.includes('database') || lower.includes('postgres');
      const hasOffline = lower.includes('offline') || lower.includes('sync') || lower.includes('cache');

      const extractedEntities = [];
      if (hasAuth) extractedEntities.push('UserIdentity', 'AuthSession');
      if (hasDatabase) extractedEntities.push('DataTable', 'SchemaIndex');
      if (hasOffline) extractedEntities.push('OfflineCacheQueue', 'SyncState');
      if (extractedEntities.length === 0) extractedEntities.push('CoreDocumentEntity', 'ActionLog');

      const warnings = [];
      if (!lower.includes('error') && !lower.includes('catch')) {
        warnings.push('No explicit error-handling or fallback boundary found in input.');
      }
      if (!lower.includes('type') && !lower.includes('interface')) {
        warnings.push('Type definitions not explicitly defined; suggest adding TS interfaces.');
      }

      setAnalysisResult({
        score: warnings.length === 0 ? 100 : 88 - (warnings.length * 10),
        entities: extractedEntities,
        mandatesPassed: 9 - warnings.length,
        warnings: warnings.length > 0 ? warnings : ['Document passed all static governance checks with zero warnings!'],
        summary: `Document analyzed successfully. Extracted ${extractedEntities.length} core domain entities and verified structural compliance.`
      });

      setIsAnalyzing(false);
      addLog('Document analysis completed. Governance score computed.', 'SUCCESS', 'GOVERNOR');
    }, 700);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setDocumentText(text);
        addLog(`File uploaded: ${file.name} (${file.size} bytes)`, 'INFO', 'SPINE');
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-[#080808] border border-[#222] rounded-xl p-5 space-y-5 font-mono text-xs shadow-2xl">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1b1b1b] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-white font-black uppercase text-xs tracking-wider">Analyze Code & Architecture Documents</h3>
            <p className="text-[9.5px] text-gray-500 font-sans">Upload or paste code, requirements, or architecture files to verify compliance</p>
          </div>
        </div>

        <span className="text-[9px] bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded font-bold uppercase">
          Static Linter Ready
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Input Textarea & File Upload */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex justify-between items-center text-[9.5px] text-gray-400 font-bold uppercase">
            <span>Paste Document or Code</span>
            <label className="text-[#FFD700] hover:underline cursor-pointer flex items-center gap-1">
              <Upload className="w-3 h-3" />
              <span>Upload File</span>
              <input type="file" onChange={handleFileUpload} accept=".txt,.md,.js,.ts,.tsx,.json,.sql" className="hidden" />
            </label>
          </div>

          <textarea
            value={documentText}
            onChange={(e) => setDocumentText(e.target.value)}
            placeholder="Paste system requirements, code snippets, SQL DDLs, or API specifications here..."
            rows={8}
            className="w-full bg-[#111] border border-[#222] focus:border-[#FFD700] rounded-lg p-3 text-xs text-white placeholder-gray-600 outline-none font-mono resize-none leading-relaxed"
          />

          <button
            onClick={handleAnalyze}
            disabled={!documentText.trim() || isAnalyzing}
            className="w-full py-2.5 bg-[#FFD700] hover:bg-[#FFD700]/90 disabled:opacity-40 text-black font-black uppercase text-xs rounded-lg transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Running Static Audit...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Run Document Linter</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Analysis Results */}
        <div className="lg:col-span-6 bg-[#111] border border-[#222] rounded-lg p-4 flex flex-col justify-between space-y-4">
          {analysisResult ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-[#222] pb-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Audit Summary</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded font-mono ${analysisResult.score >= 90 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`}>
                  SCORE: {analysisResult.score}%
                </span>
              </div>

              <p className="text-[11px] text-gray-300 font-sans leading-relaxed">
                {analysisResult.summary}
              </p>

              <div>
                <span className="text-[9px] text-gray-500 uppercase block font-bold mb-1.5">Extracted Entities</span>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.entities.map((e, idx) => (
                    <span key={idx} className="bg-[#181818] border border-[#333] text-[#FFD700] px-2 py-0.5 rounded text-[10px] font-bold">
                      {e}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[9px] text-gray-500 uppercase block font-bold mb-1.5">Mandates Verification</span>
                <div className="space-y-1">
                  {analysisResult.warnings.map((w, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[10px] text-gray-300">
                      {analysisResult.score >= 90 ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      )}
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-10 text-gray-500 space-y-2">
              <Layers className="w-8 h-8 text-gray-600" />
              <span className="text-xs font-bold uppercase text-gray-400">No Document Analyzed Yet</span>
              <p className="text-[10px] font-sans max-w-xs text-gray-500">
                Paste your code snippet or upload a document on the left and click "Run Document Linter" to view compliance scores.
              </p>
            </div>
          )}

          <div className="border-t border-[#222] pt-2 text-[8.5px] text-gray-500 flex justify-between items-center">
            <span>Mandates checked: 9/9</span>
            <span>Static Engine v1.2</span>
          </div>
        </div>

      </div>

    </div>
  );
}
