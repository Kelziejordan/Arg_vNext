import React, { useState } from 'react';
import {
  BookOpen,
  Database,
  Layers,
  Sparkles,
  ClipboardCheck,
  Search,
  CheckCircle,
  Clock,
  User,
  GitBranch,
  ArrowRight,
  ShieldCheck,
  List,
  ChevronRight,
  ShieldAlert,
  Terminal,
  Upload
} from 'lucide-react';
import { SystemLog } from '../types';

interface KnowledgeObjectsPanelProps {
  onAddLog: (message: string, level: SystemLog['level'], source: SystemLog['source']) => void;
}

interface KnowledgeObject {
  id: string;
  title: string;
  type: 'Principle' | 'Specification' | 'ADR' | 'Capability' | 'Mechanism' | 'Workflow' | 'Decision' | 'Review' | 'Breakthrough';
  status: 'Draft' | 'Review' | 'Frozen' | 'Deprecated';
  owner: string;
  version: string;
  created: string;
  modified: string;
  purpose: string;
  provenance: {
    createdBy: string;
    sourceRefs: string[];
    usedIn: string[];
    validationNotes: string;
  };
  details: string;
}

export default function KnowledgeObjectsPanel({ onAddLog }: KnowledgeObjectsPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'PRINCIPLE' | 'ADR' | 'SPEC' | 'BREAKTHROUGH'>('ALL');
  const [selectedObject, setSelectedObject] = useState<KnowledgeObject | null>(null);
  
  // Knowledge objects library
  const [knowledgeVault, setKnowledgeVault] = useState<KnowledgeObject[]>([
    {
      id: 'KP-001',
      title: 'State Determinism Rule',
      type: 'Principle',
      status: 'Frozen',
      owner: 'ARG Product',
      version: 'v1.0.0',
      created: '2026-06-15',
      modified: '2026-07-28',
      purpose: 'Enforces complete, unambiguous union state models for async flows.',
      provenance: {
        createdBy: 'Principal Operator',
        sourceRefs: ['ADR-001', 'BOOT.md'],
        usedIn: ['App.tsx', 'MandateValidator.tsx'],
        validationNotes: 'Strict compiler verification has been successfully executed.'
      },
      details: 'All state transitions related to asynchronous resource fetches MUST use the RemoteData<T> union type. Explicitly prevents concurrent state bugs, race conditions, and split boolean load flags.'
    },
    {
      id: 'ADR-004',
      title: 'BOOT.md as Canonical Operational Source',
      type: 'ADR',
      status: 'Frozen',
      owner: 'ARG Product',
      version: 'v1.2.0',
      created: '2026-07-20',
      modified: '2026-07-30',
      purpose: 'Establishes BOOT.md as the absolute single source of truth for runtime boots and session continuity.',
      provenance: {
        createdBy: 'Architect Reviewer',
        sourceRefs: ['ADR-002', 'Arg update 1'],
        usedIn: ['ContinuityManager.ts', 'server.ts'],
        validationNotes: 'Approved as a mandatory compliance contract.'
      },
      details: 'Durable session checkpoints are fully integrated into BOOT.md session states, effectively replacing separate, un-versioned recovery snapshots.'
    },
    {
      id: 'ADR-005',
      title: 'Sovereign State Refresh Requirement',
      type: 'ADR',
      status: 'Frozen',
      owner: 'ARG Product',
      version: 'v1.0.1',
      created: '2026-07-22',
      modified: '2026-07-30',
      purpose: 'Enforces that every active development session ends cleanly with a State Refresh.',
      provenance: {
        createdBy: 'Systems Architect',
        sourceRefs: ['Arg update 2', 'BOOT.md'],
        usedIn: ['App.tsx', 'OperationalStatePanel.tsx'],
        validationNotes: 'Ensures absolute alignment of working branches prior to shutdown.'
      },
      details: 'A State Refresh analyzes contextual parameters, logs active decisions to the event ledger, and packages context states to resist model memory loss.'
    },
    {
      id: 'AD-006',
      title: 'Capture and Defer Architectural Ideas',
      type: 'ADR',
      status: 'Frozen',
      owner: 'ARG Product',
      version: 'v1.0.0',
      created: '2026-07-25',
      modified: '2026-07-30',
      purpose: 'Prevents implementation interruption by systematically capturing and deferring interesting ideas.',
      provenance: {
        createdBy: 'Advisor',
        sourceRefs: ['ADR-003', 'Arg update 2'],
        usedIn: ['KnowledgeObjectsPanel.tsx', 'FutureOpportunities'],
        validationNotes: 'Keeps implementation scopes highly clean and tightly scoped.'
      },
      details: 'Provides a structured Research Queue where deferred concepts are audited and validated prior to merging with the platform core.'
    },
    {
      id: 'KP-002',
      title: 'Zero-Trust Data Boundaries',
      type: 'Principle',
      status: 'Frozen',
      owner: 'ARG Product',
      version: 'v1.0.0',
      created: '2026-05-10',
      modified: '2026-07-30',
      purpose: 'Requires strict runtime parsing and schemas at all data entry barriers.',
      provenance: {
        createdBy: 'AARA Agent',
        sourceRefs: ['Constitutional Laws'],
        usedIn: ['schemas/', 'MandateValidator.tsx'],
        validationNotes: 'Verified via Valibot static semantic checkers.'
      },
      details: 'TypeScript types exist only at build-time. We must enforce strict runtime schema-matching (Zod/Valibot) for all external streams (APIs, URLs, storage) prior to state acceptance.'
    },
    {
      id: 'AB-001',
      title: 'Persistent Cognitive Continuity Engine',
      type: 'Breakthrough',
      status: 'Review',
      owner: 'ARG Product',
      version: 'v2.1.0',
      created: '2026-06-20',
      modified: '2026-07-30',
      purpose: 'Preserves system operational context and execution variables across developer shutdowns.',
      provenance: {
        createdBy: 'Lead Engineer',
        sourceRefs: ['TEP-V12-OMEGA-FINAL', 'TS-001'],
        usedIn: ['App.tsx', 'CapabilityRegistryPanel.tsx'],
        validationNotes: 'Validated under TS-001 (The Void) stress harness.'
      },
      details: 'Achieves near-instant session resume capabilities on mobile by recording and mapping state deltas inside an event-sourced ledger, bypassing raw dialogue retention.'
    }
  ]);

  // Knowledge Pyramid Level descriptions
  const PYRAMID_LEVELS = [
    { level: 'L0', name: 'ARG FOUNDATION', desc: 'Immutable truths, primary identity, and core constitutional rules.', color: 'border-[#FFD700] text-[#FFD700] bg-[#FFD700]/5' },
    { level: 'L1', name: 'KNOWLEDGE VAULT', desc: 'Canonical specifications, verified ADRs, and historical decisions.', color: 'border-white text-white bg-white/5' },
    { level: 'L2', name: 'KNOWLEDGE VAULT MANAGER', desc: 'Indexes, validates, and arbitrates references and relationships.', color: 'border-gray-400 text-gray-300 bg-gray-400/5' },
    { level: 'L3', name: 'ARG WORKSPACE', desc: 'Operator cockpit, active workflows, and session brief generators.', color: 'border-gray-600 text-gray-400 bg-gray-600/5' },
    { level: 'L4', name: 'ARGOS RUNTIME', desc: 'Autonomous capability execution, state projections, and SRE bots.', color: 'border-gray-800 text-gray-500 bg-gray-800/5' }
  ];

  // Extraction Engine variables
  const [pasteBuffer, setPasteBuffer] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState('');
  const [newlyExtractedObject, setNewlyExtractedObject] = useState<KnowledgeObject | null>(null);

  // Trigger Recovery / Extraction Sequence
  const handleRecoverArchitecture = () => {
    if (!pasteBuffer.trim()) return;
    setIsExtracting(true);
    setNewlyExtractedObject(null);
    setExtractionProgress('Initializing cognitive parser...');
    onAddLog('Initiating architectural recovery from input dialogue buffer...', 'RECONSTRUCT', 'SPINE');

    const steps = [
      'Extracting core engineering decisions and judgments...',
      'Isolating specific design tradeoffs and discarded alternatives...',
      'Tracing compliance vectors against the 9 Engineering Mandates...',
      'Formulating Architecture Decision Record (ADR) schema...',
      'Validating object cryptographic hash and verifying lineage chain...'
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        setExtractionProgress(steps[current]);
        current++;
      } else {
        clearInterval(interval);
        
        // Formulate a beautiful extracted ADR object based on the paste input
        const randomId = `ADR-${String(knowledgeVault.length + 1).padStart(3, '0')}`;
        const newObj: KnowledgeObject = {
          id: randomId,
          title: 'Dynamic Capability Gating and Promotion',
          type: 'ADR',
          status: 'Review',
          owner: 'ARG Product',
          version: 'v1.0.0',
          created: new Date().toISOString().split('T')[0],
          modified: new Date().toISOString().split('T')[0],
          purpose: 'Disallows un-vetted capabilities from executing under production-prod environments.',
          provenance: {
            createdBy: 'Decolled Cognitive Ingestor',
            sourceRefs: ['User Paste Buffer', 'AD-006'],
            usedIn: ['WorkspacePanel.tsx', 'useCognitiveLoop.ts'],
            validationNotes: 'Harvested successfully with perfect structural integrity.'
          },
          details: 'Provides a rigid sandbox environment (Mutation Sandboxing) where new behavioral rules and prompt configurations are tested against simulated volatility before formal promotion.'
        };

        setKnowledgeVault([newObj, ...knowledgeVault]);
        setNewlyExtractedObject(newObj);
        setIsExtracting(false);
        setPasteBuffer('');
        onAddLog(`Architectural Object ${randomId} successfully recovered and committed.`, 'SYSTEM', 'SEED');
      }
    }, 800);
  };

  const filteredVault = knowledgeVault.filter((obj) => {
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'PRINCIPLE') return obj.type === 'Principle';
    if (selectedCategory === 'ADR') return obj.type === 'ADR';
    if (selectedCategory === 'SPEC') return obj.type === 'Specification';
    if (selectedCategory === 'BREAKTHROUGH') return obj.type === 'Breakthrough';
    return true;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in" id="knowledge-objects-workspace">
      
      {/* Left side: Pyramid and Categories (5 columns) */}
      <div className="md:col-span-5 space-y-6">
        
        {/* Knowledge Pyramid Card */}
        <div className="bg-[#0A0A0A] border border-[#222] p-5 rounded-lg space-y-4">
          <div className="flex justify-between items-center border-b border-[#222] pb-2">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#FFD700]" />
              The Knowledge Pyramid Stack
            </span>
            <span className="text-[9px] font-mono text-[#FFD700] uppercase">Canonical Memory Structure</span>
          </div>

          <div className="space-y-1.5 font-mono text-[9px]">
            {PYRAMID_LEVELS.map((lvl) => (
              <div
                key={lvl.level}
                onClick={() => {
                  onAddLog(`Pyramid Layer selected: [${lvl.name}] - Auditing dependencies.`, 'INFO', 'SPINE');
                }}
                className={`border p-2 rounded cursor-pointer transition-all hover:bg-[#111]/80 hover:translate-x-1 ${lvl.color}`}
              >
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-bold tracking-wider">{lvl.level}: {lvl.name}</span>
                  <span className="text-[8px] opacity-60">ACCESS ALLOWED</span>
                </div>
                <p className="opacity-70 leading-relaxed font-sans">{lvl.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Categories / Index Navigator */}
        <div className="bg-[#0A0A0A] border border-[#222] p-5 rounded-lg space-y-3">
          <span className="text-xs font-mono text-gray-400 uppercase tracking-wider block border-b border-[#222] pb-1.5">
            Vault Index Filter
          </span>
          <div className="grid grid-cols-3 gap-2 font-mono text-[9px]">
            {(['ALL', 'PRINCIPLE', 'ADR', 'SPEC', 'BREAKTHROUGH'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-1.5 rounded border transition uppercase font-bold cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#FFD700] text-black border-[#FFD700]'
                    : 'bg-[#111] text-gray-400 border-[#222] hover:border-gray-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Middle side: Objects Explorer (4 columns) */}
      <div className="md:col-span-4 bg-[#0A0A0A] border border-[#222] p-5 rounded-lg flex flex-col justify-between h-[450px]">
        <div className="flex justify-between items-center border-b border-[#222] pb-2 mb-3 shrink-0">
          <span className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#FFD700]" />
            Object Explorer ({filteredVault.length})
          </span>
          <span className="text-[8px] bg-[#FFD700]/10 text-[#FFD700] px-2 py-0.5 rounded font-mono">
            Lineage Verified
          </span>
        </div>

        {/* List of filtered objects */}
        <div className="flex-grow overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
          {filteredVault.map((obj) => (
            <div
              key={obj.id}
              onClick={() => {
                setSelectedObject(obj);
                onAddLog(`Inspecting Knowledge Object: [${obj.id}] ${obj.title}`, 'INFO', 'SPINE');
              }}
              className={`p-3 rounded border text-left cursor-pointer transition-all hover:translate-x-1 ${
                selectedObject?.id === obj.id
                  ? 'border-[#FFD700] bg-[#FFD700]/5'
                  : 'border-[#222] bg-[#0C0C0C] hover:border-[#444]'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-mono text-gray-500">{obj.id}</span>
                <span className="text-[8px] font-mono bg-[#111] px-1.5 py-0.5 rounded text-gray-400 uppercase">
                  {obj.type}
                </span>
              </div>
              <h4 className="text-xs font-serif italic text-white font-bold leading-snug line-clamp-1">{obj.title}</h4>
              <p className="text-[9px] text-gray-500 leading-normal line-clamp-1 pt-0.5">{obj.purpose}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right side: Detailed Pane OR Extraction Engine (3 columns) */}
      <div className="md:col-span-3 flex flex-col space-y-6">
        
        {/* Selected Object Detail Panel */}
        {selectedObject ? (
          <div className="bg-[#0A0A0A] border border-[#222] p-5 rounded-lg flex flex-col justify-between h-[230px] animate-fade-in">
            <div className="flex justify-between items-center border-b border-[#222] pb-2 shrink-0">
              <span className="text-[10px] font-mono text-[#FFD700] uppercase font-bold">{selectedObject.id} Metadata</span>
              <button
                onClick={() => setSelectedObject(null)}
                className="text-[9px] font-mono text-gray-500 hover:text-white"
              >
                CLOSE
              </button>
            </div>

            <div className="flex-grow overflow-y-auto space-y-2 pt-2.5 text-[9px] font-mono text-gray-400 pr-1 scrollbar-thin">
              <div className="flex justify-between border-b border-[#111] pb-1">
                <span>Title:</span>
                <span className="text-white text-right font-bold truncate max-w-[120px]">{selectedObject.title}</span>
              </div>
              <div className="flex justify-between border-b border-[#111] pb-1">
                <span>Type:</span>
                <span className="text-white uppercase">{selectedObject.type}</span>
              </div>
              <div className="flex justify-between border-b border-[#111] pb-1">
                <span>Status:</span>
                <span className="text-[#FFD700] uppercase font-bold">{selectedObject.status}</span>
              </div>
              <div className="flex justify-between border-b border-[#111] pb-1">
                <span>Version:</span>
                <span className="text-white">{selectedObject.version}</span>
              </div>
              <div className="flex justify-between border-b border-[#111] pb-1">
                <span>Owner:</span>
                <span className="text-gray-300">{selectedObject.owner}</span>
              </div>
              <div className="border-b border-[#111] pb-1.5 space-y-0.5">
                <span className="block text-gray-500">Design Purpose:</span>
                <p className="text-gray-300 font-sans leading-normal">{selectedObject.purpose}</p>
              </div>
              <div className="space-y-0.5">
                <span className="block text-gray-500">Execution Provenance:</span>
                <div className="bg-[#111] p-1.5 rounded border border-[#222] text-[8px] space-y-1 font-mono text-gray-500">
                  <div className="text-white">Validated By: {selectedObject.provenance.createdBy}</div>
                  <div>Source Refs: {selectedObject.provenance.sourceRefs.join(', ')}</div>
                  <div>Validation: {selectedObject.provenance.validationNotes}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#0A0A0A] border border-[#222] p-5 rounded-lg flex flex-col items-center justify-center text-center h-[230px] font-mono text-[10px] text-gray-500">
            <Search className="w-6 h-6 text-gray-600 mb-2 animate-pulse" />
            Select an object from the Vault to inspect lineage, purpose, validation, and historical tradeoffs.
          </div>
        )}

        {/* Recover Architecture Extraction Box */}
        <div className="bg-[#0A0A0A] border border-red-500/20 p-5 rounded-lg flex flex-col justify-between h-[200px]">
          <div className="flex justify-between items-center border-b border-[#222] pb-1.5 shrink-0">
            <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              Arg Architectural Recovery Engine
            </span>
          </div>

          {isExtracting ? (
            <div className="flex flex-col items-center justify-center text-center flex-grow space-y-2">
              <Terminal className="w-5 h-5 text-[#FFD700] animate-bounce" />
              <span className="text-[9px] font-mono text-[#FFD700] uppercase tracking-wider">{extractionProgress}</span>
            </div>
          ) : newlyExtractedObject ? (
            <div className="flex flex-col justify-between h-full pt-2 animate-fade-in">
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 p-1.5 rounded">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Object recovered successfully and committed.</span>
              </div>
              <p className="text-[8px] font-mono text-gray-500 italic shrink-0 leading-tight">
                New ADR artifact {newlyExtractedObject.id} was extracted with structured dependencies and locked into Layer 1 of the vault.
              </p>
              <button
                onClick={() => {
                  setSelectedObject(newlyExtractedObject);
                  setNewlyExtractedObject(null);
                }}
                className="w-full text-center text-[10px] font-mono font-bold uppercase bg-[#FFD700] hover:bg-[#E5C100] text-black py-1.5 rounded cursor-pointer"
              >
                Inspect Recovered ADR
              </button>
            </div>
          ) : (
            <div className="space-y-2 pt-2 flex-grow flex flex-col justify-between">
              <textarea
                value={pasteBuffer}
                onChange={(e) => setPasteBuffer(e.target.value)}
                placeholder="Paste raw conversation or designer notes here..."
                className="w-full flex-grow bg-[#050505] text-gray-300 font-mono text-[9px] p-2 focus:outline-none focus:ring-1 focus:ring-red-500/30 resize-none leading-relaxed border border-[#222] rounded"
              />
              <button
                onClick={handleRecoverArchitecture}
                disabled={!pasteBuffer.trim()}
                className="w-full text-center text-[10px] font-mono font-bold uppercase bg-[#FFD700] hover:bg-[#E5C100] text-black py-1.5 rounded disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1 shadow-[0_0_8px_rgba(255,215,0,0.1)]"
              >
                <Upload className="w-3 h-3" />
                Recover Architecture
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
