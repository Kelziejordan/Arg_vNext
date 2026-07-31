/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Database,
  Code,
  FileText,
  Workflow,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Search,
  BookOpen,
  Plus,
  Layers,
  Shuffle,
  Shield,
  Activity
} from 'lucide-react';
import { useRuntime } from '../core/RuntimeContext';

interface Preset {
  id: string;
  label: string;
  intent: string;
  canonical: {
    systemName: string;
    description: string;
    entities: Array<{ name: string; fields: string[]; role: string }>;
    offlineBoundary: string;
    coreRules: string[];
  };
  projections: {
    react: string;
    postgres: string;
    spec: string;
    mermaid: Array<{ from: string; to: string; type: string }>;
    tests: string;
  };
}

const PRESETS: Preset[] = [
  {
    id: 'inspection',
    label: 'Offline Field Inspection',
    intent: 'Build me an inspection app that works offline, synchronizes state automatically, and generates PDF reports.',
    canonical: {
      systemName: 'Offline Inspection Core',
      description: 'A sovereign local-first inspection system with autonomous syncing pipelines.',
      entities: [
        { name: 'Inspector', fields: ['id', 'name', 'credentials', 'publicKey'], role: 'Authorized operator identity' },
        { name: 'InspectionReport', fields: ['id', 'targetId', 'checklistState', 'offlineTimestamp', 'signatureBlob'], role: 'Primary event data' },
        { name: 'SyncQueue', fields: ['eventId', 'payload', 'retryCount', 'status'], role: 'Transactional resilience queue' }
      ],
      offlineBoundary: 'Local IndexedDB write-lock with append-only local ledger state.',
      coreRules: [
        'Must validate inspector cryptographic signatures locally prior to queueing.',
        'Must attempt synchronization only when network latency is verified < 150ms.',
        'PDF generation must reside in a isolated service worker for offline execution.'
      ]
    },
    projections: {
      react: `// React UI - Sovereign Local-First Inspection Component
import React, { useState, useEffect } from 'react';
import { Database, WifiOff, FileText, CheckCircle } from 'lucide-react';

export default function OfflineInspector() {
  const [reports, setReports] = useState([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const saveReportLocally = (reportData) => {
    const newReport = {
      id: crypto.randomUUID(),
      ...reportData,
      status: 'QUEUED_OFFLINE',
      timestamp: Date.now()
    };
    // Direct transaction write to Immutable Event Ledger
    const localStore = JSON.parse(localStorage.getItem('reports') || '[]');
    localStorage.setItem('reports', JSON.stringify([...localStore, newReport]));
    setReports(prev => [...prev, newReport]);
  };

  return (
    <div className="p-4 bg-black border border-gray-800 rounded-lg">
      <div className="flex justify-between items-center pb-3 border-b border-gray-900">
        <h3 className="text-xs font-mono font-bold text-white uppercase">Inspection Panel</h3>
        <span className={\`text-[9px] font-mono px-2 py-0.5 rounded \${isOffline ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}\`}>
          {isOffline ? 'OFFLINE SECURE' : 'SYNC ACTIVE'}
        </span>
      </div>
      {/* ... Dynamic report forms render here ... */}
    </div>
  );
}`,
      postgres: `-- PostgreSQL Schema Definition (Projected from Intent)
CREATE TABLE inspectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    credentials JSONB NOT NULL,
    public_key TEXT NOT NULL
);

CREATE TABLE inspection_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspector_id UUID REFERENCES inspectors(id),
    checklist_state JSONB NOT NULL,
    offline_timestamp TIMESTAMPTZ NOT NULL,
    signature_blob TEXT NOT NULL,
    sync_status VARCHAR(50) DEFAULT 'SYNCHRONIZED'
);

CREATE INDEX idx_reports_sync_status ON inspection_reports(sync_status);`,
      spec: `# Technical Specification Blueprint
## System Name: Sovereign Offline Inspection Core
### Archetype: Local-First Synchronization Engine

This system implements a technology-agnostic local write-lock structure to enable seamless data capture in disconnected environments.

### Core Architecture Capabilities
1. **Sovereign Local Persistence:** Direct write operations are securely committed to client sandboxes (IndexedDB) before any remote handshakes are scheduled.
2. **Deterministic Conflict Resolution:** Leverages Vector Clocks to resolve conflicts on synchronization.
3. **Hermetic PDF Compiling:** Runs self-contained client-side templates for offline report rendering.`,
      mermaid: [
        { from: 'Offline Input', to: 'Local Event Ledger', type: 'Instant Write' },
        { from: 'Local Event Ledger', to: 'Conflict Resolver', type: 'Background Sync' },
        { from: 'Conflict Resolver', to: 'Central Database', type: 'Atomic Commit' }
      ],
      tests: `// Unit Test Framework for Offline Sync Guarantees
import { describe, it, expect, vi } from 'vitest';
import { SyncQueueManager } from './sync';

describe('Offline Synchronization Validation', () => {
  it('should queue inspection reports locally during offline network events', async () => {
    const queue = new SyncQueueManager();
    const offlineReport = { id: '123', status: 'pending' };
    
    await queue.enqueue(offlineReport);
    
    expect(queue.getOfflineCount()).toBe(1);
    expect(queue.isSyncActive()).toBe(false);
  });
});`
    }
  },
  {
    id: 'ledger',
    label: 'Sovereign Multi-Tenant Budget',
    intent: 'Build a multi-tenant subscription ledger that syncs with bank transactions and auto-flags potential policy breaches.',
    canonical: {
      systemName: 'Constitutional Ledger System',
      description: 'A multi-tenant accounting core governed by hard-coded budget policy constraints.',
      entities: [
        { name: 'TenantSpace', fields: ['tenantId', 'organizationName', 'policyRules', 'quotaLimit'], role: 'Security isolation boundary' },
        { name: 'LedgerEntry', fields: ['entryId', 'amount', 'category', 'rawPayload', 'isBreach'], role: 'Immutable event record' },
        { name: 'BankSyncStream', fields: ['streamId', 'institutionCode', 'activeHandshake', 'lastPoll'], role: 'External data bridge' }
      ],
      offlineBoundary: 'Server-side sandboxed tenant accounts with cryptographic ledger locks.',
      coreRules: [
        'Every budget entry must undergo static policy validation before schema writing.',
        'Tenant spaces are cryptographically separated using schema-based multi-tenancy.',
        'Any single transaction over organizational quota must immediately transition state to WARNING.'
      ]
    },
    projections: {
      react: `// React UI - Secure Tenant Budget Overview
import React, { useState } from 'react';
import { Shield, AlertTriangle, TrendingUp } from 'lucide-react';

export default function TenantBudgetDashboard({ tenantId }) {
  const [balance, setBalance] = useState(125000);
  const [breaches, setBreaches] = useState([]);

  const processIncomingTransaction = (txn) => {
    // Immediate Policy Governance Validation Check
    if (txn.amount > 10000) {
      setBreaches(prev => [...prev, {
        id: txn.id,
        reason: 'Maximum discretionary purchase limit exceeded.'
      }]);
    }
  };

  return (
    <div className="p-4 bg-black border border-gray-800 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="text-[#FFD700] w-4" />
        <span className="text-xs font-mono font-bold text-white uppercase">Tenant Boundary Console</span>
      </div>
      {/* ... Policy Breach indicators and metrics ... */}
    </div>
  );
}`,
      postgres: `-- PostgreSQL Tenant Schema & Security Boundaries
CREATE TABLE tenant_spaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_name VARCHAR(255) NOT NULL,
    policy_rules JSONB NOT NULL,
    quota_limit NUMERIC(12, 2) NOT NULL
);

CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenant_spaces(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    is_breach BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enforce Strict Multi-Tenant Row-Level Security
ALTER TABLE ledger_entries ENABLE ROW LEVEL SECURITY;`,
      spec: `# Technical Specification Blueprint
## System Name: Constitutional Ledger System
### Archetype: Multi-Tenant Ledger Governance

Ensures cryptographically isolated accounts and real-time transaction processing.

### Policy Guards
1. **Tenant Isolation:** Enforced natively via Row-Level Security (RLS) on PostgreSQL.
2. **Structural Validation:** Real-time checking of transaction velocity, category restrictions, and quota maximums.
3. **Transaction Immutability:** Uses write-once transaction schemas for historical auditing.`,
      mermaid: [
        { from: 'Bank Sync Stream', to: 'Policy Guardrail', type: 'Ingress Payloads' },
        { from: 'Policy Guardrail', to: 'Multi-Tenant Ledger', type: 'Approved Transactions' },
        { from: 'Policy Guardrail', to: 'Security Alert Engine', type: 'Policy Violation (Breach)' }
      ],
      tests: `// Unit Test for Sovereign Multi-Tenant Separation Rules
import { describe, it, expect } from 'vitest';
import { TenantSecurityGuard } from './security';

describe('Tenant Separation Policy Validation', () => {
  it('should strictly refuse queries that attempt to access neighbor tenant data', async () => {
    const guard = new TenantSecurityGuard();
    const badQuery = { tenantId: 'TenantA', targetId: 'TenantB_data' };
    
    expect(() => guard.authorize(badQuery)).toThrowError('Tenant Isolation Breach');
  });
});`
    }
  }
];

const CAPABILITY_ORCHESTRATION_DATA: Record<string, Array<{ capability: string, demand: string, engine: string, tier: string, badge: string }>> = {
  inspection: [
    {
      capability: 'SOVEREIGN LOCAL PERSISTENCE',
      demand: 'Architect client-side sandbox write-locks and sync queues (IndexedDB).',
      engine: 'LONG-CONTEXT REASONING ENGINE',
      tier: 'Claude-3.5-Sonnet equivalent capability-tier',
      badge: 'Zero-loss state'
    },
    {
      capability: 'HERMETIC DOCUMENT GENERATION',
      demand: 'Compile offline-first PDF layout algorithms and file serialization tools.',
      engine: 'FAST SYNTAX GENERATION BLOCK',
      tier: 'Gemini-1.5-Flash equivalent capability-tier',
      badge: '1.2x compile velocity'
    },
    {
      capability: 'DETERMINISTIC TESTING INGRESS',
      demand: 'Synthesize isolated unit tests verifying sync queues and conflict resolution mechanics.',
      engine: 'LOGIC CHECKING SPECIALIST',
      tier: 'GPT-4o equivalent capability-tier',
      badge: '100% policy compliance'
    }
  ],
  ledger: [
    {
      capability: 'IMMUTABLE MULTI-TENANT RLS',
      demand: 'Generate strict PostgreSQL Row Level Security (RLS) constraints and tenant boundaries.',
      engine: 'CRYPTOGRAPHIC BOUNDARY SPECIALIST',
      tier: 'Claude-3.5-Sonnet equivalent capability-tier',
      badge: 'Unbreachable'
    },
    {
      capability: 'STATIC TRANSACTION AUDITING',
      demand: 'Deconstruct budget policy expressions and design real-time warning indicators.',
      engine: 'LOGICAL COGNITIVE SOLVER',
      tier: 'Gemini-1.5-Pro equivalent capability-tier',
      badge: '0ms delay parsing'
    },
    {
      capability: 'STREAMING SYNC PIPELINES',
      demand: 'Construct bank transaction ingestion Webhooks with automatic error retry states.',
      engine: 'FAST ASYNC ROUTING AGENT',
      tier: 'GPT-4o-mini equivalent capability-tier',
      badge: '99.9% uptime dispatch'
    }
  ],
  custom: [
    {
      capability: 'DYNAMIC LEXICAL SYNTAX PARSING',
      demand: 'Map custom natural language requests to structured canonical specifications.',
      engine: 'GENERALIST INTENT COMPILER',
      tier: 'Gemini-1.5-Pro equivalent capability-tier',
      badge: '98.5% semantic accuracy'
    },
    {
      capability: 'CROSS-FRAMEWORK PROJECTION LAYER',
      demand: 'Simultaneously translate the verified state models into React TSX, Postgres tables, and Specs.',
      engine: 'MULTI-TARGET SYNTHESIS SYSTEM',
      tier: 'Claude-3.5-Sonnet equivalent capability-tier',
      badge: 'Instantly synced'
    },
    {
      capability: 'CONSTITUTIONAL BOUNDARY COMPLIANCE',
      demand: 'Audit all projected codes against governance regulations and security mandates.',
      engine: 'STATIC RULES ENFORCER',
      tier: 'GPT-4o equivalent capability-tier',
      badge: '100% compliance certified'
    }
  ]
};

export default function IntentTranslator() {
  const { perspective, addLog } = useRuntime();
  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[0]);
  const [customIntent, setCustomIntent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'react' | 'postgres' | 'spec' | 'mermaid' | 'tests'>('spec');
  const [processingStep, setProcessingStep] = useState(0);

  // Custom compiled output based on custom input
  const [compiledResult, setCompiledResult] = useState<Preset | null>(null);

  const handlePresetSelect = (preset: Preset) => {
    setSelectedPreset(preset);
    setCompiledResult(null);
    setCustomIntent('');
    addLog(`Intent Translator preset switched to: ${preset.label}`, 'INFO', 'GOVERNOR');
  };

  const handleCustomProcess = () => {
    if (!customIntent.trim()) return;
    setIsProcessing(true);
    setProcessingStep(1);
    addLog('Intent Translator initializing lexical processing pipeline...', 'INFO', 'SPINE');

    const interval = setInterval(() => {
      setProcessingStep(prev => {
        if (prev === 3) {
          clearInterval(interval);
          
          // Compile a clever personalized canonical result on the fly based on input keywords
          const text = customIntent.toLowerCase();
          const hasOffline = text.includes('offline') || text.includes('sync') || text.includes('local');
          const hasDb = text.includes('database') || text.includes('sql') || text.includes('postgres') || text.includes('save') || text.includes('store');
          const hasPdf = text.includes('pdf') || text.includes('report') || text.includes('generate');
          const hasAuth = text.includes('auth') || text.includes('login') || text.includes('user') || text.includes('security');

          const name = text.split(' ').slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Sovereign Custom Engine';

          const generatedCanonical: Preset['canonical'] = {
            systemName: `${name} Core`,
            description: `A custom technology-agnostic canonical runtime designed to support: ${customIntent}`,
            entities: [
              { name: 'UserIdentity', fields: ['id', 'username', 'claims', 'authHash'], role: 'Core actor identity boundary' },
              { name: 'CoreEventRecord', fields: ['id', 'ownerId', 'statePayload', 'systemVersion'], role: 'Canonical state container' },
              { name: 'PolicyAuditor', fields: ['ruleId', 'expression', 'enforcementAction'], role: 'Static compliance gate' }
            ],
            offlineBoundary: hasOffline 
              ? 'Local IndexedDB client sandbox with delta transaction cache.' 
              : 'Isolated stateless processing context, committing to central persistence.',
            coreRules: [
              `All operations must satisfy: "${customIntent.substring(0, 75)}..."`,
              hasAuth ? 'Authenticate cryptographic signatures at the ingress gate.' : 'Enforce anonymous sandbox runtime with secure operational flags.',
              hasOffline ? 'Queue state updates locally when transmission latency exceeds 200ms.' : 'All pipeline commits are atomic and support zero-drift recovery.'
            ]
          };

          const generatedProjections: Preset['projections'] = {
            react: `// Custom Dynamic React Component Projected from: "${name}"
import React, { useState } from 'react';
import { Cpu, Shield, RefreshCw } from 'lucide-react';

export default function CustomSovereignRuntime() {
  const [runtimeState, setRuntimeState] = useState('NOMINAL');
  const [logs, setLogs] = useState([]);

  const dispatchOperation = (action) => {
    // Human intent translated into transaction schema
    const txn = {
      id: crypto.randomUUID(),
      type: action.type,
      timestamp: Date.now(),
      status: 'VERIFIED'
    };
    setLogs(prev => [txn, ...prev]);
  };

  return (
    <div className="p-4 bg-black border border-gray-800 rounded-lg text-white">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xs font-mono font-bold text-amber-400 uppercase">${name} Framework</h4>
        <span className="text-[10px] font-mono bg-amber-400/10 text-amber-400 px-1.5 py-0.2 rounded border border-amber-400/20">
          {runtimeState}
        </span>
      </div>
      <p className="text-[11px] text-gray-400 mb-3">${hasOffline ? 'Offline Sync Protocol Active.' : 'Direct Connection Channel Verified.'}</p>
      {/* Dynamic interaction elements */}
    </div>
  );
}`,
            postgres: `-- Custom Dynamic SQL Schema Projected from: "${name}"
CREATE TABLE user_identities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    claims JSONB NOT NULL,
    auth_hash TEXT NOT NULL
);

CREATE TABLE core_event_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES user_identities(id),
    state_payload JSONB NOT NULL,
    system_version VARCHAR(50) DEFAULT '1.0.0',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);`,
            spec: `# Dynamic Architecture Specification
## Unified System: ${name} Core
### Purpose: ${customIntent}

This design encapsulates the core business intent as an unalterable representation, permitting immediate projection across multiple framework targets.

### Key Capabilities Projected
1. **Cryptographic Identity Anchor:** User identities and actions are verified against hard-coded governance matrices.
2. **Technology-Agnostic Core:** The primary database structure, rules, and workflows are modeled natively, remaining independent of specific cloud or frontend libraries.
3. **${hasOffline ? 'Autonomous Local-First Pipeline' : 'High-Performance Stateless Conduit'}:** Engineered to preserve state stability under all conditions.`,
            mermaid: [
              { from: 'User Input', to: 'CoreEventRecord', type: 'Intent Capture' },
              { from: 'CoreEventRecord', to: 'PolicyAuditor', type: 'Mandate Checking' },
              { from: 'PolicyAuditor', to: 'Storage Target', type: 'Approved Commit' }
            ],
            tests: `// Custom Test Verification Suite
import { describe, it, expect } from 'vitest';
import { SovereignComplianceCore } from './compliance';

describe('${name} Core Verification', () => {
  it('should successfully assert all user constraints on incoming data', async () => {
    const compliance = new SovereignComplianceCore();
    const mockRecord = { type: 'STATE_COMMIT', payload: {} };
    
    const isValid = await compliance.verify(mockRecord);
    expect(isValid).toBe(true);
  });
});`
          };

          setCompiledResult({
            id: 'custom',
            label: name,
            intent: customIntent,
            canonical: generatedCanonical,
            projections: generatedProjections
          });
          setIsProcessing(false);
          addLog(`Sovereign Intent Translation Engine compiled successfully for: "${name}".`, 'SUCCESS', 'GOVERNOR');
          return 0;
        }
        return (prev + 1) as any;
      });
    }, 1000);
  };

  const activePreset = compiledResult || selectedPreset;

  return (
    <div className="bg-[#050505] border border-[#222] rounded-lg p-5 space-y-6 relative overflow-hidden" id="intent-translator">
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Title & Concept Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#111] pb-4 gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#FFD700] uppercase font-bold tracking-wider block">
            Layer 2 Intent Translation Service
          </span>
          <h2 className="text-sm font-black font-mono text-white uppercase mt-0.5 tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#FFD700]" />
            Intent-to-Representation Engine
          </h2>
          <p className="text-[10.5px] text-gray-400 mt-1 max-w-xl font-serif italic">
            "Your core business logic is the source of truth. Software stacks (React, SQL, Python) are just short-lived projections of that central meaning."
          </p>
        </div>

        <div className="text-[10px] font-mono bg-[#111] border border-[#222] px-3 py-1.5 rounded-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
          <span className="text-gray-400 uppercase">State:</span>
          <span className="text-white font-bold">READY TO TRANSLATE</span>
        </div>
      </div>

      {/* Top Console: Inputs & Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Preset Switcher & Text input (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[9.5px] font-mono text-gray-500 uppercase tracking-wider block font-bold">
              Select Pre-Configured Intent
            </label>
            <div className="flex flex-col gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePresetSelect(p)}
                  className={`text-left p-2.5 rounded text-xs font-mono transition-all duration-200 border cursor-pointer ${
                    activePreset.id === p.id && !compiledResult
                      ? 'bg-[#FFD700]/10 border-[#FFD700] text-white shadow-[0_0_8px_rgba(255,215,0,0.05)]'
                      : 'bg-[#0A0A0A] border-[#222] text-gray-400 hover:border-gray-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{p.label}</span>
                    <ArrowRight className="w-3 h-3 opacity-60" />
                  </div>
                  <p className="text-[9.5px] text-gray-500 mt-0.5 truncate max-w-[280px]">
                    "{p.intent}"
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[#111] pt-3 space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[9.5px] font-mono text-gray-500 uppercase tracking-wider block font-bold">
                Or Type Custom Intent
              </label>
              {compiledResult && (
                <button
                  onClick={() => {
                    setCompiledResult(null);
                    setSelectedPreset(PRESETS[0]);
                    setCustomIntent('');
                  }}
                  className="text-[9px] font-mono text-[#FFD700] hover:underline bg-transparent border-none cursor-pointer"
                >
                  Reset to Presets
                </button>
              )}
            </div>
            
            <div className="relative">
              <textarea
                value={customIntent}
                onChange={(e) => setCustomIntent(e.target.value)}
                placeholder="Example: Build a task tracker with status flags, calendar scheduling, and local-first SQLite exports..."
                rows={3}
                className="w-full bg-[#0A0A0A] border border-[#222] rounded p-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 font-mono resize-none leading-relaxed"
              />
            </div>
            
            <button
              onClick={handleCustomProcess}
              disabled={isProcessing || !customIntent.trim()}
              className="w-full text-xs font-mono font-bold uppercase py-2 bg-white text-black hover:bg-[#FFD700] hover:text-black rounded transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-30"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isProcessing ? 'COMPILING CANONICAL MEANING...' : 'TRANSLATE CUSTOM INTENT'}
            </button>
          </div>
        </div>

        {/* Right Column: Processing pipeline + The Canonical Object (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-[#0A0A0A] border border-[#111] rounded-lg p-4 min-h-[300px]">
          
          {isProcessing ? (
            /* Processing Pipeline Loader Animation */
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-10">
              <div className="relative">
                <RefreshCw className="w-10 h-10 text-[#FFD700] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="text-center space-y-2 max-w-sm">
                <p className="text-xs font-mono font-bold text-white uppercase tracking-widest animate-pulse">
                  {processingStep === 1 && '1. Parsing Raw Semantic Syntax...'}
                  {processingStep === 2 && '2. Extracting Technology-Agnostic Entities...'}
                  {processingStep === 3 && '3. Formulating Immutable Canonical Intent...'}
                </p>
                <div className="w-48 h-1 bg-[#111] rounded overflow-hidden mx-auto">
                  <div 
                    className="h-full bg-[#FFD700] transition-all duration-500" 
                    style={{ width: `${(processingStep / 3) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-500">
                  Aligning constraints with active operator policies.
                </p>
              </div>
            </div>
          ) : (
            /* The Canonical Core Representation Display */
            <div className="space-y-4 flex-1">
              <div className="flex items-center justify-between border-b border-[#111] pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FFD700]" />
                  <h3 className="text-xs font-mono font-bold text-white uppercase">
                    Stage 1: Canonical Representation (Source of Truth)
                  </h3>
                </div>
                <span className="text-[9px] font-mono text-gray-500">TECHNOLOGY-AGNOSTIC</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-[9px] font-mono text-gray-500 uppercase block">System Name</span>
                    <span className="text-xs font-mono font-bold text-white">{activePreset.canonical.systemName}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-gray-500 uppercase block">Core Intent Summary</span>
                    <p className="text-[10.5px] text-gray-300 leading-normal font-serif italic mt-0.5">
                      "{activePreset.canonical.description}"
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-gray-500 uppercase block">Operational Boundaries</span>
                    <p className="text-[10px] text-gray-400 font-mono leading-relaxed mt-0.5">
                      {activePreset.canonical.offlineBoundary}
                    </p>
                  </div>
                </div>

                <div className="bg-[#050505] border border-[#222] p-3 rounded space-y-3 max-h-[220px] overflow-y-auto scrollbar-thin">
                  <div>
                    <span className="text-[9px] font-mono text-[#FFD700] uppercase font-bold tracking-wider block">Domain Entities</span>
                    <div className="space-y-2 mt-1.5">
                      {activePreset.canonical.entities.map((ent, i) => (
                        <div key={i} className="border-b border-[#111] pb-1.5 last:border-b-0 last:pb-0">
                          <span className="text-[10px] font-mono font-bold text-white block">
                            {ent.name}
                          </span>
                          <span className="text-[9px] font-mono text-gray-400 block mt-0.5 leading-tight">
                            Role: {ent.role}
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {ent.fields.map((f, fi) => (
                              <span key={fi} className="text-[8px] font-mono bg-[#111] border border-[#222] px-1 text-gray-500 rounded">
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#111] pt-3">
                <span className="text-[9px] font-mono text-gray-500 uppercase block">Constitutional Enforcement Rules</span>
                <ul className="list-disc pl-4 space-y-1 mt-1.5">
                  {activePreset.canonical.coreRules.map((rule, idx) => (
                    <li key={idx} className="text-[10.5px] text-gray-400 leading-normal">
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="border-t border-[#111] pt-3 mt-4 text-[9px] font-mono text-gray-500 flex justify-between items-center">
            <span>Core Hash: SHA256_{activePreset.id.substring(0, 4)}_{activePreset.canonical.systemName.length}AA</span>
            <span>Enforced by Arg Anchor sovereign services</span>
          </div>
        </div>
      </div>

      {/* Stage 1.5: Capability-Oriented Orchestration (Interchangeable Model Routing) */}
      <div className="bg-[#0A0A0A] border border-[#111] rounded-lg p-5 space-y-4 relative overflow-hidden" id="capability-orchestration-panel">
        <div className="absolute top-0 right-0 w-60 h-60 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#111] pb-3 gap-3">
          <div>
            <span className="text-[10px] font-mono text-[#FFD700] uppercase font-bold tracking-wider block">
              Stage 1.5: Capability-Oriented Orchestration
            </span>
            <h3 className="text-xs font-mono font-bold text-white uppercase mt-0.5 tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#FFD700]" />
              State-Governed Capability Router (Piece together capabilities, not identities)
            </h3>
          </div>
          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-2 py-0.5 rounded font-extrabold uppercase flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Unified State Core Preserved
          </span>
        </div>

        <p className="text-[11px] text-gray-400 leading-normal font-sans">
          Instead of treating models as rigid identities (e.g. GPT, Claude, Gemini), the ARG runtime decomposes your core intent into <strong className="text-white font-mono uppercase text-[10px]">granular capability demands</strong>. Each demand is dynamically routed to the optimal interchangeable execution engine, keeping your project's governed state perfectly continuous across models and sessions.
        </p>

        {/* Visual Columns: Decompose, Route, Reconcile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
          
          {/* Decomposed Demands List (6 cols) */}
          <div className="lg:col-span-8 space-y-2.5">
            <div className="flex items-center gap-2 text-[9.5px] font-mono text-gray-500 uppercase border-b border-[#111] pb-1.5 font-bold">
              <Shuffle className="w-3.5 h-3.5 text-[#FFD700]" />
              Dynamic Capability-Demand Breakdown
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(CAPABILITY_ORCHESTRATION_DATA[activePreset.id] || CAPABILITY_ORCHESTRATION_DATA.custom).map((item, index) => (
                <div key={index} className="bg-[#050505] border border-[#222] p-3 rounded flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300 group">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start gap-1">
                      <span className="text-[9px] font-mono font-bold text-[#FFD700] uppercase tracking-tight leading-tight block truncate">
                        {item.capability}
                      </span>
                      <span className="text-[7.5px] bg-white/10 text-white border border-white/20 px-1 py-0.2 rounded font-mono uppercase font-bold shrink-0">
                        P{index + 1}
                      </span>
                    </div>
                    <p className="text-[9.5px] text-gray-400 font-mono leading-tight">
                      {item.demand}
                    </p>
                  </div>

                  <div className="border-t border-[#111] pt-2 mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[7px] font-mono text-gray-500 uppercase">
                      <span>Mapped Engine</span>
                      <span className="text-emerald-400 font-bold">{item.badge}</span>
                    </div>
                    <div className="text-[8.5px] font-mono text-gray-300 truncate font-semibold block uppercase">
                      {item.engine}
                    </div>
                    <div className="text-[7.5px] font-mono text-gray-600 block truncate">
                      {item.tier}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core State Reconciliation Panel (4 cols) */}
          <div className="lg:col-span-4 bg-[#050505] border border-[#222] p-4 rounded flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-gray-500 uppercase border-b border-[#111] pb-1.5 font-bold">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Governed State Core
              </div>

              <div className="bg-[#0C0C0C] p-3 rounded border border-emerald-950/40 space-y-1.5">
                <div className="flex justify-between items-center text-[9px] font-mono text-emerald-400 font-bold">
                  <span>UNIFIED PROJECT MEMORY</span>
                  <span className="text-[8px] bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 px-1 rounded uppercase font-bold">ACTIVE</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-normal font-sans">
                  The active runtime preserves every decision, entity rule, and constraint as structured state memory. Session limits or switching models will never lose context.
                </p>
              </div>
            </div>

            <div className="border-t border-[#111] pt-3 mt-3 flex items-center justify-between text-[8px] font-mono text-gray-500">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>RECONCILIATOR: NOMINAL</span>
              </div>
              <span className="text-gray-600 uppercase">SYNC RATE: 100%</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Interface: Target Projection Panel (Any Output) */}
      <div className="bg-[#0A0A0A] border border-[#111] rounded-lg p-4 space-y-4">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#111] pb-3 gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
            <h3 className="text-xs font-mono font-bold text-white uppercase">
              Stage 2: Target Projections (Project into Any Output instantly)
            </h3>
          </div>

          {/* Project toggle tabs */}
          <div className="flex flex-wrap gap-1 bg-[#050505] border border-[#222] p-0.5 rounded">
            <button
              onClick={() => setActiveTab('spec')}
              className={`text-[9.5px] font-mono px-2.5 py-1.5 rounded transition font-bold cursor-pointer flex items-center gap-1 ${
                activeTab === 'spec' ? 'bg-[#FFD700] text-black font-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              <FileText className="w-3 h-3" />
              SPEC BLUEPRINT
            </button>
            <button
              onClick={() => setActiveTab('react')}
              className={`text-[9.5px] font-mono px-2.5 py-1.5 rounded transition font-bold cursor-pointer flex items-center gap-1 ${
                activeTab === 'react' ? 'bg-[#FFD700] text-black font-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Code className="w-3 h-3" />
              REACT UI CODE
            </button>
            <button
              onClick={() => setActiveTab('postgres')}
              className={`text-[9.5px] font-mono px-2.5 py-1.5 rounded transition font-bold cursor-pointer flex items-center gap-1 ${
                activeTab === 'postgres' ? 'bg-[#FFD700] text-black font-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Database className="w-3 h-3" />
              POSTGRES SQL
            </button>
            <button
              onClick={() => setActiveTab('mermaid')}
              className={`text-[9.5px] font-mono px-2.5 py-1.5 rounded transition font-bold cursor-pointer flex items-center gap-1 ${
                activeTab === 'mermaid' ? 'bg-[#FFD700] text-black font-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Workflow className="w-3 h-3" />
              MERMAID DIAGRAM
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className={`text-[9.5px] font-mono px-2.5 py-1.5 rounded transition font-bold cursor-pointer flex items-center gap-1 ${
                activeTab === 'tests' ? 'bg-[#FFD700] text-black font-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              UNIT TESTS
            </button>
          </div>
        </div>

        {/* Content Projection display */}
        <div className="bg-[#050505] border border-[#222] rounded p-4 relative min-h-[180px]">
          
          {activeTab === 'spec' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[9px] font-mono text-gray-500">
                <span>FORMAT: MARKDOWN蓝图</span>
                <span>STATUS: LIVE GENERATED</span>
              </div>
              <div className="text-xs text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">
                {activePreset.projections.spec}
              </div>
            </div>
          )}

          {activeTab === 'react' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[9px] font-mono text-gray-500">
                <span>FORMAT: REACT / JSX (TSX)</span>
                <span>COMPILER: APEX V40 AOT</span>
              </div>
              <pre className="text-[10.5px] text-emerald-400 font-mono leading-relaxed overflow-x-auto scrollbar-thin p-2 bg-black rounded max-h-[300px]">
                <code>{activePreset.projections.react}</code>
              </pre>
            </div>
          )}

          {activeTab === 'postgres' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[9px] font-mono text-gray-500">
                <span>FORMAT: POSTGRESQL DDL SQL</span>
                <span>AUTHENTICATION: MULTI-TENANT SECURE</span>
              </div>
              <pre className="text-[10.5px] text-blue-400 font-mono leading-relaxed overflow-x-auto scrollbar-thin p-2 bg-black rounded max-h-[300px]">
                <code>{activePreset.projections.postgres}</code>
              </pre>
            </div>
          )}

          {activeTab === 'tests' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[9px] font-mono text-gray-500">
                <span>FORMAT: VITEST / JEST SPECS</span>
                <span>GOVERNANCE COVERAGE: 100%</span>
              </div>
              <pre className="text-[10.5px] text-yellow-500 font-mono leading-relaxed overflow-x-auto scrollbar-thin p-2 bg-black rounded max-h-[300px]">
                <code>{activePreset.projections.tests}</code>
              </pre>
            </div>
          )}

          {activeTab === 'mermaid' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[9px] font-mono text-gray-500">
                <span>FORMAT: MERMAID FLOW STRUCTURE</span>
                <span>INTERACTIVE GRAPHICS</span>
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-center py-6 gap-4 bg-black rounded p-4">
                {activePreset.projections.mermaid.map((step, sIdx) => (
                  <React.Fragment key={sIdx}>
                    <div className="bg-[#0A0A0A] border border-[#222] rounded p-3 text-center min-w-[140px] shadow-sm relative group hover:border-[#FFD700] transition-colors">
                      <span className="text-[8px] font-mono text-gray-500 block uppercase">NODE {sIdx + 1}</span>
                      <span className="text-xs font-mono text-white font-bold block mt-1 uppercase">{step.from}</span>
                    </div>

                    {sIdx < activePreset.projections.mermaid.length - 1 && (
                      <div className="flex flex-col items-center justify-center min-w-[100px] text-center">
                        <span className="text-[8px] font-mono text-[#FFD700] px-1 bg-[#111] border border-[#222] rounded mb-1 whitespace-nowrap">
                          {step.type}
                        </span>
                        <div className="w-full h-0.5 bg-gradient-to-r from-gray-700 via-[#FFD700] to-gray-700 relative flex justify-end">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700] absolute -top-0.5 right-0 animate-ping" />
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
