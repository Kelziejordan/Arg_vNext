/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, RefreshCw, Code, ShieldCheck, Database, ArrowRight, Cpu } from 'lucide-react';
import { useRuntime } from '../core/RuntimeContext';
import AiModelSelector from './AiModelSelector';

interface Message {
  id: string;
  sender: 'user' | 'arg';
  text: string;
  timestamp: string;
  modelName?: string;
  codeSnippet?: string;
  category?: 'BUILD' | 'ARCHITECTURE' | 'COMPLIANCE' | 'GENERAL';
}

const STARTER_QUESTIONS = [
  { text: "How do I build an offline-first inspection app?", category: "BUILD" },
  { text: "What is the difference between Canonical Intent and Projected Code?", category: "ARCHITECTURE" },
  { text: "How does Arg Anchor ensure strict type safety & zero-drift state?", category: "COMPLIANCE" },
  { text: "Help me design a multi-tenant subscription ledger", category: "BUILD" }
];

export default function AskArgConsole() {
  const { addLog, selectedModel } = useRuntime();
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'arg',
      text: "Hello! I am ARG, your sovereign AI architecture assistant. Ask me anything about building projects, designing database schemas, or writing verified code.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelName: 'ARG Sovereign Engine',
      category: 'GENERAL'
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsThinking(true);
    addLog(`User query submitted to Ask ARG: "${query.substring(0, 30)}..."`, 'INFO', 'SPINE');

    setTimeout(() => {
      let replyText = '';
      let codeSnippet: string | undefined = undefined;
      const lower = query.toLowerCase();

      if (lower.includes('offline') || lower.includes('sync') || lower.includes('inspection')) {
        replyText = "To build a robust offline-first application, ARG recommends decoupling local persistence from remote network sync. Write directly to an immutable client-side event ledger (like IndexedDB) first, then dispatch background sync passes when latency is verified under 150ms.";
        codeSnippet = `// Offline-First Sync Pattern
const saveLocalEvent = async (eventPayload) => {
  const transaction = await db.transaction(['events'], 'readwrite');
  await transaction.objectStore('events').add({
    id: crypto.randomUUID(),
    payload: eventPayload,
    status: 'QUEUED_OFFLINE',
    timestamp: Date.now()
  });
  // Dispatch background sync pass if online
  if (navigator.onLine) scheduleBackgroundSync();
};`;
      } else if (lower.includes('canonical') || lower.includes('projected') || lower.includes('intent')) {
        replyText = "In ARG Anchor, **Canonical Intent** is the single technology-agnostic source of truth for your business logic. Frameworks like React TSX, PostgreSQL schemas, and Vitest unit tests are simply **Projected Stacks** derived from that central canonical representation. When business requirements change, you update the intent once, and all code projections update in sync.";
      } else if (lower.includes('drift') || lower.includes('type') || lower.includes('compliance') || lower.includes('mandate')) {
        replyText = "ARG Anchor prevents architectural drift by running every generated module through 9 strict engineering mandates. For instance, Mandate 1 forbids raw un-discriminated boolean loading flags in favor of RemoteData union states, while Mandate 2 enforces AbortControllers on all asynchronous network threads.";
        codeSnippet = `// RemoteData Union Type (Mandate 1 Compliance)
type RemoteData<T> = 
  | { kind: 'NotAsked' }
  | { kind: 'Loading' }
  | { kind: 'Success'; data: T }
  | { kind: 'Failure'; error: string };`;
      } else if (lower.includes('multi-tenant') || lower.includes('ledger') || lower.includes('budget') || lower.includes('database')) {
        replyText = "For multi-tenant databases, ARG uses Row-Level Security (RLS) in PostgreSQL alongside cryptographically separated tenant IDs. This guarantees hard isolation between organizations at the database engine level.";
        codeSnippet = `-- Multi-Tenant PostgreSQL RLS Constraint
CREATE TABLE tenant_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    payload JSONB NOT NULL
);

ALTER TABLE tenant_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON tenant_records
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);`;
      } else {
        replyText = `ARG Anchor processed your request: "${query}". You can turn this idea directly into executable React code, PostgreSQL tables, and technical specs using the "Build a Project" tool!`;
      }

      const argMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'arg',
        text: replyText,
        codeSnippet,
        modelName: selectedModel.name,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: 'GENERAL'
      };

      setMessages(prev => [...prev, argMsg]);
      setIsThinking(false);
      addLog(`Ask ARG response compiled using model: ${selectedModel.name}`, 'SUCCESS', 'SPINE');
    }, 800);
  };

  return (
    <div className="bg-[#080808] border border-[#222] rounded-xl p-5 space-y-4 shadow-2xl font-mono text-xs">
      
      {/* Header with AI Model Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1b1b1b] pb-3 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-white font-black uppercase text-xs tracking-wider">Ask ARG Assistant</h3>
            <p className="text-[9.5px] text-gray-500 font-sans">Brainstorm architecture or ask questions with any AI model</p>
          </div>
        </div>

        {/* AI Switcher Control */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-gray-500 font-bold uppercase hidden md:inline">AI Model:</span>
          <AiModelSelector compact />
        </div>
      </div>

      {/* Starter Questions */}
      {messages.length <= 2 && (
        <div className="space-y-1.5">
          <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider block">Suggested Questions</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {STARTER_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q.text)}
                className="text-left bg-[#111] hover:bg-[#181818] border border-[#222] hover:border-[#FFD700]/40 p-2.5 rounded text-[10px] text-gray-300 hover:text-white transition cursor-pointer flex items-center justify-between group"
              >
                <span>"{q.text}"</span>
                <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-[#FFD700] transition-colors shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Feed */}
      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin py-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'arg' && (
              <div className="w-6 h-6 rounded bg-[#FFD700] text-black flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                ⚓
              </div>
            )}

            <div className={`max-w-[85%] space-y-2 rounded-xl p-3.5 ${
              m.sender === 'user'
                ? 'bg-[#FFD700]/15 border border-[#FFD700]/30 text-white rounded-tr-none'
                : 'bg-[#111111] border border-[#222] text-gray-200 rounded-tl-none'
            }`}>
              <div className="flex items-center justify-between gap-3 text-[8.5px] text-gray-500 border-b border-white/5 pb-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold uppercase text-gray-300">{m.sender === 'user' ? 'You' : 'ARG Assistant'}</span>
                  {m.modelName && (
                    <span className="text-[8px] bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] px-1.5 py-0.2 rounded font-bold">
                      via {m.modelName}
                    </span>
                  )}
                </div>
                <span>{m.timestamp}</span>
              </div>

              <p className="text-[11px] leading-relaxed font-sans font-medium whitespace-pre-wrap">
                {m.text}
              </p>

              {m.codeSnippet && (
                <div className="bg-black/80 border border-[#222] rounded p-2.5 mt-2 overflow-x-auto">
                  <pre className="text-[10px] text-emerald-400 font-mono leading-normal">
                    <code>{m.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </div>

            {m.sender === 'user' && (
              <div className="w-6 h-6 rounded bg-zinc-800 text-gray-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="flex gap-3 items-center text-gray-400 text-[10px] p-2 bg-[#111] border border-[#222] rounded-lg w-fit">
            <RefreshCw className="w-3.5 h-3.5 text-[#FFD700] animate-spin" />
            <span>ARG is analyzing your query...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2 pt-2 border-t border-[#1b1b1b]"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask ARG anything (e.g. 'How do I add user authentication to my project?')..."
          className="flex-grow bg-[#111] border border-[#222] focus:border-[#FFD700] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 outline-none font-sans"
        />
        <button
          type="submit"
          disabled={!input.trim() || isThinking}
          className="bg-[#FFD700] hover:bg-[#FFD700]/90 disabled:opacity-40 text-black font-black px-4 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer text-xs"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
