/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Bot, ChevronDown, Check, Sparkles, Cpu, ShieldCheck, Zap, Layers } from 'lucide-react';
import { useRuntime } from '../core/RuntimeContext';
import { POPULAR_AI_MODELS, AiModel } from '../types';

interface AiModelSelectorProps {
  compact?: boolean;
  className?: string;
}

export default function AiModelSelector({ compact = false, className = '' }: AiModelSelectorProps) {
  const { selectedModelId, setSelectedModelId, selectedModel, addLog } = useRuntime();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectModel = (model: AiModel) => {
    setSelectedModelId(model.id);
    addLog(`AI Model switched to ${model.name} (${model.provider})`, 'INFO', 'SPINE');
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block font-mono text-xs ${className}`} ref={dropdownRef}>
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 bg-[#111111] hover:bg-[#181818] border ${
          selectedModel.isAuto ? 'border-[#FFD700]/50 shadow-[0_0_15px_rgba(255,215,0,0.1)]' : 'border-[#2a2a2a] hover:border-gray-500'
        } rounded-xl px-3 py-1.5 transition text-left cursor-pointer group font-mono`}
      >
        <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
          selectedModel.isAuto ? 'bg-[#FFD700] text-black font-black text-[10px]' : 'bg-[#222] text-white'
        }`}>
          {selectedModel.isAuto ? '⚓' : <Bot className="w-3.5 h-3.5 text-gray-200" />}
        </div>

        <div className="flex flex-col min-w-[120px]">
          <div className="flex items-center gap-1.5">
            <span className="text-white font-bold text-[11px] leading-tight truncate max-w-[130px]">
              {selectedModel.name}
            </span>
            {selectedModel.isAuto && (
              <span className="text-[7.5px] bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30 px-1 py-0.2 rounded font-black uppercase tracking-wider">
                DEFAULT
              </span>
            )}
          </div>
          <span className="text-[9px] text-gray-500 leading-none font-sans">
            {selectedModel.provider}
          </span>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-transform ml-1 ${
          isOpen ? 'rotate-180 text-[#FFD700]' : ''
        }`} />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 sm:right-auto sm:left-0 mt-2 w-80 sm:w-96 bg-[#0c0c0c] border border-[#2a2a2a] rounded-2xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 space-y-2">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#222] pb-2 px-1">
            <div className="flex items-center gap-1.5 text-[#FFD700]">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-black text-[10px] uppercase tracking-wider text-white">Select Active AI Engine</span>
            </div>
            <span className="text-[8.5px] text-gray-500 uppercase font-bold">11 Models Available</span>
          </div>

          <p className="text-[9.5px] text-gray-400 font-sans px-1">
            Switch the active AI model at any point during your conversation or code compilation.
          </p>

          {/* Models Scrollable List */}
          <div className="max-h-[320px] overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
            
            {POPULAR_AI_MODELS.map((model) => {
              const isSelected = selectedModelId === model.id;
              return (
                <button
                  key={model.id}
                  onClick={() => handleSelectModel(model)}
                  className={`w-full text-left p-2.5 rounded-xl border transition flex items-start justify-between gap-3 cursor-pointer group ${
                    isSelected
                      ? 'bg-[#181818] border-[#FFD700]/60 text-white shadow-md'
                      : 'bg-[#111111]/80 hover:bg-[#161616] border-[#1e1e1e] hover:border-[#333] text-gray-300'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-xs ${isSelected ? 'text-[#FFD700]' : 'text-white group-hover:text-[#FFD700]'}`}>
                        {model.name}
                      </span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded border ${model.badgeBg} ${model.badgeColor}`}>
                        {model.badge}
                      </span>
                      {model.isAuto && (
                        <span className="text-[8px] bg-[#FFD700] text-black font-black px-1.5 py-0.2 rounded uppercase">
                          Auto Select
                        </span>
                      )}
                    </div>

                    <p className="text-[10px] text-gray-400 font-sans leading-snug">
                      {model.description}
                    </p>

                    <div className="flex items-center gap-2 text-[8.5px] text-gray-500">
                      <span>Provider: <strong className="text-gray-300">{model.provider}</strong></span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#FFD700] text-black flex items-center justify-center shrink-0 mt-1 shadow">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}

          </div>

          <div className="border-t border-[#1e1e1e] pt-2 px-1 flex items-center justify-between text-[8.5px] text-gray-500">
            <span>Default: ARG Sovereign Auto-Select</span>
            <span className="text-emerald-400 font-bold">✓ Hot Swappable</span>
          </div>

        </div>
      )}

    </div>
  );
}
