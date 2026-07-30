/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Send, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  Sparkles, 
  Code, 
  Shield, 
  Cpu, 
  FolderOpen, 
  FileText,
  Bookmark
} from 'lucide-react';
import { ChatMessage, SavedSession } from '../types';

interface ConsoleTerminalProps {
  onAddLog: (
    message: string, 
    level: 'INFO' | 'WARN' | 'ERROR' | 'SYSTEM' | 'RECONSTRUCT', 
    source: 'SEED' | 'SPINE' | 'APEX' | 'GOVERNOR' | 'AGENT'
  ) => void;
  deepFocusRef?: React.RefObject<HTMLTextAreaElement | null>;
}

const QUICK_DIRECTIVES = [
  {
    label: 'Overview',
    icon: Cpu,
    prompt: 'Provide a structured, technical overview of the V12 Omega Hierarchical Operating System stack.',
    log: 'Executing SYSTEM_ARCHITECTURE_DIAGNOSTIC...'
  },
  {
    label: 'Mandates Code Guide',
    icon: Code,
    prompt: 'Write a TypeScript code skeleton complying perfectly with Mandate 1 (State Determinism) and Mandate 2 (Signal Asynchrony).',
    log: 'Requesting CODE_COMPLIANCE_TEMPLATE_GEN...'
  },
  {
    label: 'Survival Protocol',
    icon: Shield,
    prompt: 'Detail the immunities, resource economics, and failures taxonomy defined in your Layer 1 Survival Engine.',
    log: 'Polling SURVIVAL_ENGINE_CRITIQUE_METRICS...'
  }
];

const STORAGE_KEY = 'argus_omega_sessions_v12';
const ACTIVE_SESSION_KEY = 'argus_omega_active_session_id';

export default function ConsoleTerminal({ onAddLog, deepFocusRef }: ConsoleTerminalProps) {
  const [input, setInput] = useState<string>('');
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Sync ref with deepFocusRef if provided
  useEffect(() => {
    if (deepFocusRef) {
      (deepFocusRef as any).current = textareaRef.current;
    }
  }, [deepFocusRef]);

  // Load saved sessions from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const activeId = localStorage.getItem(ACTIVE_SESSION_KEY);
      
      let loadedSessions: SavedSession[] = [];
      if (stored) {
        loadedSessions = JSON.parse(stored);
      }
      
      if (loadedSessions.length === 0) {
        // Create initial session
        const initialSession: SavedSession = {
          id: 'initial_session',
          title: 'System Boot Session',
          timestamp: new Date().toLocaleString(),
          messages: [
            {
              id: 'boot_msg',
              role: 'system',
              text: '🪐 [ARGUS OMEGA V12 ONLINE] - COGNITIVE MATRIX ESTABLISHED\n\n🛡️ CONSTITUTIONAL MOTTO:\n"Beyond the next level is the minimal build and quality standard for all aspects of the project."\n\nWelcome back, Principal Operator. The Frozen Core governance gates are active. All execution pipelines are verified under Layer 2 Governor oversight.\n\nType a directive below or click a Quick Macro to query the server-side Gemini architectural oracle.\n\n📝 CONSOLE COMMAND CANVAS ADVANCED CONTROLS:\n• [Enter] creates a new line exclusively (preventing accidental submissions)\n• Click [Send Icon] or press [Ctrl + Enter] / [Cmd + Enter] to execute.',
              timestamp: new Date().toLocaleTimeString()
            }
          ]
        };
        loadedSessions = [initialSession];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loadedSessions));
      }

      setSessions(loadedSessions);
      
      const targetActiveId = activeId && loadedSessions.some(s => s.id === activeId) 
        ? activeId 
        : loadedSessions[0].id;
      
      setActiveSessionId(targetActiveId);
    } catch (err) {
      console.error('Failed to load sessions from localStorage:', err);
    }
  }, []);

  // Save sessions to localStorage whenever they change
  const saveSessionsToStorage = (updatedSessions: SavedSession[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
    } catch (err) {
      console.error('Failed to save sessions to localStorage:', err);
    }
  };

  // Auto-resize textarea based on row count/content height (Dynamic Scaling)
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 240)}px`;
  }, [input]);

  // Auto scroll to terminal bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, activeSessionId, isLoading]);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  // Handle switching sessions
  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    localStorage.setItem(ACTIVE_SESSION_KEY, id);
    onAddLog(`Restored cognitive session: "${sessions.find(s => s.id === id)?.title}"`, 'INFO', 'SPINE');
  };

  // Handle creating a new session
  const handleCreateNewSession = () => {
    const newId = `session_${Date.now()}`;
    const newSession: SavedSession = {
      id: newId,
      title: `ArgOS Session #${sessions.length + 1}`,
      timestamp: new Date().toLocaleString(),
      messages: [
        {
          id: `welcome_${Date.now()}`,
          role: 'system',
          text: `🌌 [ARGUS OMEGA V12] - NEW ARCHITECTURAL CONTEXT STARTED\n\n🛡️ CONSTITUTIONAL MOTTO:\n"Beyond the next level is the minimal build and quality standard for all aspects of the project."\n\nCognitive workspace loaded successfully. Standard metadata compliance matrices are pre-configured.\n\nWhat high-performance system structure shall we draft today?`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]
    };

    const nextSessions = [newSession, ...sessions];
    setSessions(nextSessions);
    saveSessionsToStorage(nextSessions);
    setActiveSessionId(newId);
    localStorage.setItem(ACTIVE_SESSION_KEY, newId);
    onAddLog(`Created and loaded new architectural session: "${newSession.title}"`, 'SYSTEM', 'GOVERNOR');
  };

  // Handle deleting a session
  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      onAddLog('Cannot delete the sole active context container.', 'WARN', 'GOVERNOR');
      return;
    }

    const filtered = sessions.filter(s => s.id !== id);
    setSessions(filtered);
    saveSessionsToStorage(filtered);

    if (activeSessionId === id) {
      const fallbackId = filtered[0].id;
      setActiveSessionId(fallbackId);
      localStorage.setItem(ACTIVE_SESSION_KEY, fallbackId);
    }
    
    onAddLog('Purged conversation context from core memory.', 'WARN', 'SPINE');
  };

  // Handle copying a single message
  const handleCopyMessage = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
      onAddLog('Message copied cleanly to system clipboard.', 'INFO', 'AGENT');
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  // Submit query to Gemini API
  const handleSubmit = async (e?: React.FormEvent, customPrompt?: string, customLogMsg?: string) => {
    if (e) e.preventDefault();
    const promptToSend = customPrompt || input;
    if (!promptToSend.trim() || isLoading || !activeSessionId) return;

    const logMsg = customLogMsg || `Executing user instruction: "${promptToSend.slice(0, 35)}..."`;
    onAddLog(logMsg, 'INFO', 'AGENT');

    setInput('');
    setIsLoading(true);

    const userMessageId = `msg_${Date.now()}`;
    const systemResponseId = `msg_${Date.now() + 1}`;

    const userMsg: ChatMessage = {
      id: userMessageId,
      role: 'user',
      text: promptToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    // Update active session messages immediately
    const updatedSessions = sessions.map(session => {
      if (session.id === activeSessionId) {
        // If it was the placeholder title, let's auto-title it based on prompt
        const wasDefaultTitle = session.title.startsWith('ArgOS Session #') || session.title === 'System Boot Session';
        const newTitle = wasDefaultTitle 
          ? (promptToSend.length > 25 ? promptToSend.slice(0, 25) + '...' : promptToSend)
          : session.title;
          
        return {
          ...session,
          title: newTitle,
          messages: [...session.messages, userMsg, {
            id: systemResponseId,
            role: 'system',
            text: '',
            timestamp: new Date().toLocaleTimeString()
          }]
        };
      }
      return session;
    });

    setSessions(updatedSessions);
    saveSessionsToStorage(updatedSessions);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: promptToSend })
      });

      if (!response.ok) {
        throw new Error(`Server responded with state: ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.text || 'Core empty response anomaly.';

      setSessions(prev => {
        const next = prev.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: s.messages.map(m => {
                if (m.id === systemResponseId) {
                  return { ...m, text: rawText };
                }
                return m;
              })
            };
          }
          return s;
        });
        saveSessionsToStorage(next);
        return next;
      });

      onAddLog('Cognitive core response received successfully.', 'INFO', 'SEED');
    } catch (err: any) {
      console.error(err);
      const errText = `🚨 [COGNITIVE CRASH] Architectural inquiry failed.\nError: ${err.message || 'Unknown network interference.'}`;
      
      setSessions(prev => {
        const next = prev.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: s.messages.map(m => {
                if (m.id === systemResponseId) {
                  return { ...m, text: errText };
                }
                return m;
              })
            };
          }
          return s;
        });
        saveSessionsToStorage(next);
        return next;
      });
      onAddLog(`Cognitive Core inquiry failed: ${err.message}`, 'ERROR', 'SEED');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Mobile optimized input: Enter creates line break, Ctrl+Enter or Cmd+Enter submits
    if (e.key === 'Enter') {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        handleSubmit();
      }
      // Otherwise, default Enter behavior of typing a newline is preserved!
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="terminal-layout-wrapper">
      
      {/* Sessions Sidebar Tracker */}
      <div className="lg:col-span-1 bg-[#0A0A0A] border border-[#222] rounded p-4 flex flex-col h-[520px] max-h-[520px]">
        <div className="flex justify-between items-center border-b border-[#222] pb-2.5 mb-3">
          <span className="text-[10px] font-mono text-gray-400 tracking-wider flex items-center gap-1.5 uppercase">
            <Bookmark className="w-3.5 h-3.5 text-[#FFD700]" />
            CONTEXT LIST ({sessions.length})
          </span>
          <button 
            onClick={handleCreateNewSession}
            title="Create New Session"
            className="p-1 hover:bg-[#222] text-[#FFD700] rounded transition border border-[#FFD700]/20 hover:border-[#FFD700]/50"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin pr-1">
          {sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            return (
              <div
                key={session.id}
                onClick={() => handleSelectSession(session.id)}
                className={`group flex items-center justify-between p-2.5 rounded border text-left transition cursor-pointer ${
                  isActive
                    ? 'bg-[#111] border-[#FFD700]/50 text-[#FFD700] ring-1 ring-[#FFD700]/10'
                    : 'bg-[#050505] border-[#1A1A1A] text-gray-400 hover:border-[#222] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden min-w-0 flex-1">
                  <FileText className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#FFD700]' : 'text-gray-500'}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-mono font-bold truncate">{session.title}</p>
                    <p className="text-[8px] text-gray-500 font-mono mt-0.5 truncate">{session.timestamp}</p>
                  </div>
                </div>

                <button
                  onClick={(e) => handleDeleteSession(session.id, e)}
                  disabled={sessions.length <= 1}
                  className="p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition disabled:opacity-0 shrink-0 ml-1.5"
                  title="Purge session"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#222] text-center">
          <p className="text-[9px] font-mono text-gray-600 leading-tight">
            Conversations auto-save locally to maintain absolute runtime persistence.
          </p>
        </div>
      </div>

      {/* Main Terminal Window */}
      <div className="lg:col-span-3 bg-[#0A0A0A] border border-[#222] rounded p-5 flex flex-col h-[520px]" id="terminal-interface">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#222] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Terminal className="text-[#FFD700] w-5 h-5" />
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-gray-200">CORE COGNITIVE INTERFACE</h2>
              <p className="text-[10px] font-mono text-gray-500">DIRECT CONSOLE TO ARGUS V12 PROMPT ORACLE</p>
            </div>
          </div>

          {/* Macros */}
          <div className="flex flex-wrap gap-1.5">
            {QUICK_DIRECTIVES.map((directive, idx) => {
              const Icon = directive.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSubmit(undefined, directive.prompt, directive.log)}
                  disabled={isLoading}
                  className="flex items-center gap-1 text-[10px] font-mono bg-[#111] border border-[#222] text-gray-300 hover:text-[#FFD700] hover:border-[#FFD700]/30 px-2.5 py-1 rounded transition disabled:opacity-50"
                >
                  <Icon className="w-3 h-3 text-[#FFD700]" />
                  <span>{directive.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Terminal History Logs */}
        <div className="flex-grow bg-[#050505] border border-[#222] rounded p-4 overflow-y-auto font-mono text-xs text-gray-300 space-y-4 shadow-inner scrollbar-thin" id="terminal-history">
          {activeSession?.messages.map((item) => (
            <div key={item.id} className="space-y-1.5 group/msg relative">
              
              {/* Message Metadata and Actions */}
              <div className="flex justify-between items-start text-gray-500 text-[10px] border-b border-[#222]/40 pb-1">
                <span className={`font-bold ${item.role === 'user' ? 'text-gray-400' : 'text-[#FFD700]'}`}>
                  {item.role === 'user' ? 'argus_operator@v12_core:~# ' : 'argus_omega_v12_ai:~# '}
                  <span className={`${item.role === 'user' ? 'text-gray-300 font-normal' : 'text-[#FFD700] font-bold'}`}>
                    {item.role === 'user' ? item.text.slice(0, 50) + (item.text.length > 50 ? '...' : '') : 'COGNITIVE_RESPONSE'}
                  </span>
                </span>
                
                <div className="flex items-center gap-2">
                  <span className="opacity-60">{item.timestamp}</span>
                  <button
                    onClick={() => handleCopyMessage(item.id, item.text)}
                    className="p-0.5 hover:bg-[#222] text-gray-500 hover:text-white rounded transition"
                    title="Copy response content"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Message Content */}
              <div className="pl-3 pr-2 py-1 text-gray-300 leading-relaxed whitespace-pre-wrap selection:bg-[#FFD700]/20 selection:text-white">
                {item.text ? item.text : (
                  <span className="text-[#FFD700]/70 italic animate-pulse flex items-center gap-1">
                    <Sparkles className="w-3 h-3 animate-spin shrink-0" />
                    Solving matrix weights...
                  </span>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-[#FFD700] font-mono text-[11px] pl-3">
              <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-ping" />
              <span>SOLVING MATRIX WEIGHTS...</span>
            </div>
          )}
          <div ref={terminalEndRef} />
        </div>

        {/* Deep matte, distraction-free Command Canvas Input Section */}
        <form onSubmit={(e) => handleSubmit(e)} className="mt-4 flex flex-col space-y-1 shrink-0">
          <div className="relative flex items-end bg-[#050505] border border-[#222] rounded focus-within:border-[#FFD700]/50 focus-within:ring-1 focus-within:ring-[#FFD700]/30 transition-all p-1.5">
            <span className="font-mono text-xs text-[#FFD700] font-bold px-2 py-2 select-none self-start">argus_omega$</span>
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Enter instruction... ([Ctrl+Enter] to Execute, [Enter] for line break)"
              className="flex-grow bg-transparent text-xs font-mono text-gray-200 py-2 px-1 focus:outline-none resize-none min-h-[36px] max-h-[240px] leading-normal"
              style={{ minHeight: '36px' }}
            />
            <div className="flex items-center gap-2 self-end pb-1 pr-1">
              <span className="text-[9px] text-gray-600 select-none font-mono hidden sm:inline">
                [Ctrl + ↵ to submit]
              </span>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-[#FFD700] hover:bg-[#E5C100] text-black p-2 rounded transition disabled:opacity-30 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(255,215,0,0.2)]"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
