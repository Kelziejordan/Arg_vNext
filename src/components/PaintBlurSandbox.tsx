/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { 
  Paintbrush, 
  Eraser, 
  Trash2, 
  Eye, 
  EyeOff, 
  Sliders, 
  FileText, 
  Sparkles,
  Download,
  Square,
  Circle
} from 'lucide-react';

export default function PaintBlurSandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#FFD700'); // Standard ArgOS yellow
  const [brushSize, setBrushSize] = useState(4);
  const [blurAmount, setBlurAmount] = useState(0);
  const [activeTool, setActiveTool] = useState<'paint' | 'erase'>('paint');
  const [canvasBlur, setCanvasBlur] = useState(0);
  
  // Document text content to play with blurring
  const [docText, setDocText] = useState(
    `// ARGOS SYSTEM SECURITY MANDATE (CONFIDENTIAL)\n` +
    `// REGISTERED OPERATOR: kelseaziegler@gmail.com\n\n` +
    `[MANDATE-01] STATE DETERMINISM\n` +
    `All user-interface elements must bind strictly to local state or local key-value persistence. State must never drift.\n\n` +
    `[MANDATE-02] CRYPTO SIGNING\n` +
    `All compiled ledger blocks require SHA-256 validation before pipeline clearance. Non-compliance triggers a freeze.`
  );

  const [documentBlur, setDocumentBlur] = useState(0);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.parentElement?.clientWidth || 400;
    canvas.height = 250;

    // Fill white-neutral background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw some welcome retro shapes inside the canvas
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, 80, 80);

    ctx.strokeStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(280, 150, 40, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 215, 0, 0.15)';
    ctx.font = '11px Courier New';
    ctx.fillText('DRAW AND PAINT HERE', 120, 130);

  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = activeTool === 'erase' ? '#0a0a0a' : color;

    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="space-y-6 text-gray-300 font-mono text-[11px] animate-fade-in" id="paint-blur-sandbox">
      <div className="bg-[#090909]/80 border border-[#222] rounded-xl p-5 shadow-2xl relative overflow-hidden">
        
        {/* Banner */}
        <div className="flex items-center justify-between border-b border-[#222] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded">
              🎨
            </span>
            <div>
              <h3 className="text-white font-black text-xs uppercase tracking-wider">CREATIVE SANDBOX: PAINT & BLUR ENGINE</h3>
              <p className="text-[9px] text-gray-500 uppercase font-mono mt-0.5">Windows 3.1 Inspired Workspace</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/80" />
            <span className="w-2 h-2 rounded-full bg-amber-500/80" />
            <span className="w-2 h-2 rounded-full bg-green-500/80" />
          </div>
        </div>

        <p className="text-gray-400 text-[10px] leading-relaxed mb-4">
          Unwind and experiment! You can paint freely on the digital canvas below, load or edit the confidential security document, and use the focus controllers to dynamically blur or sharpen your workspace objects.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* PAINT CANVAS CONTROL */}
          <div className="lg:col-span-7 bg-[#050505] border border-[#1f1f1f] rounded-lg p-3.5 flex flex-col space-y-3">
            <div className="flex items-center justify-between border-b border-[#1b1b1b] pb-2">
              <span className="text-[10px] text-gray-300 font-black flex items-center gap-1.5">
                <Paintbrush className="w-3.5 h-3.5 text-[#FFD700]" />
                DRAWING BOARD
              </span>
              
              {/* Canvas controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTool('paint')}
                  className={`p-1 rounded border text-[9px] transition cursor-pointer ${activeTool === 'paint' ? 'bg-[#FFD700] text-black border-[#FFD700]' : 'border-[#222] bg-[#111] hover:text-white'}`}
                  title="Paint Brush"
                >
                  <Paintbrush className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setActiveTool('erase')}
                  className={`p-1 rounded border text-[9px] transition cursor-pointer ${activeTool === 'erase' ? 'bg-[#FFD700] text-black border-[#FFD700]' : 'border-[#222] bg-[#111] hover:text-white'}`}
                  title="Eraser Tool"
                >
                  <Eraser className="w-3 h-3" />
                </button>
                <button
                  onClick={clearCanvas}
                  className="p-1 rounded border border-red-950/40 bg-red-950/10 hover:bg-red-900/30 text-red-400 text-[9px] transition cursor-pointer"
                  title="Clear Workspace"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Colors & Brushes */}
            <div className="flex items-center justify-between bg-[#111] p-2 rounded border border-[#222]">
              <div className="flex items-center gap-2">
                <span className="text-[8.5px] text-gray-500 uppercase">Brush:</span>
                <div className="flex gap-1.5">
                  {['#FFD700', '#38bdf8', '#f43f5e', '#10b981', '#ffffff'].map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setColor(c);
                        setActiveTool('paint');
                      }}
                      className={`w-4 h-4 rounded-full border transition cursor-pointer ${color === c && activeTool === 'paint' ? 'scale-125 border-white' : 'border-transparent hover:scale-110'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[8.5px] text-gray-500 uppercase">Size:</span>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-16 accent-[#FFD700] h-1 bg-[#222] rounded-lg cursor-pointer"
                />
                <span className="text-[8px] text-white font-mono w-4">{brushSize}px</span>
              </div>
            </div>

            {/* Actual Canvas */}
            <div className="relative border border-[#222] rounded overflow-hidden bg-[#0a0a0a]">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full block cursor-crosshair transition-all duration-300"
                style={{ filter: `blur(${canvasBlur}px)` }}
              />
            </div>

            {/* Canvas Blur Slider */}
            <div className="bg-[#0e0e0e] border border-[#222] p-2.5 rounded-lg flex items-center justify-between">
              <span className="text-[8.5px] text-gray-400 font-bold flex items-center gap-1">
                <Sliders className="w-3 h-3 text-[#FFD700]" />
                CANVAS BLUR INTENSITY
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="12"
                  value={canvasBlur}
                  onChange={(e) => setCanvasBlur(parseInt(e.target.value))}
                  className="w-28 md:w-44 accent-[#FFD700] h-1 bg-[#222] rounded-lg cursor-pointer"
                />
                <span className="text-[9px] bg-[#1a1a1a] px-1.5 py-0.5 rounded font-black text-[#FFD700]">
                  {canvasBlur}px
                </span>
              </div>
            </div>
          </div>

          {/* DOCUMENT FOCUS BLUR CONTROL */}
          <div className="lg:col-span-5 bg-[#050505] border border-[#1f1f1f] rounded-lg p-3.5 flex flex-col space-y-3">
            <div className="flex items-center justify-between border-b border-[#1b1b1b] pb-2">
              <span className="text-[10px] text-gray-300 font-black flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                SECRET DOCUMENT
              </span>
              <span className="text-[8px] bg-sky-500/10 text-sky-400 px-1.5 py-0.2 rounded font-bold">MANDATE DRAFT</span>
            </div>

            <p className="text-[9px] text-gray-500 leading-normal">
              Type or edit text in the terminal workspace below, then use the slider to test real-time focal readability.
            </p>

            <div className="relative flex-grow flex flex-col min-h-[160px]">
              <textarea
                value={docText}
                onChange={(e) => setDocText(e.target.value)}
                className="w-full h-full flex-grow bg-[#0a0a0a] border border-[#222] rounded p-2.5 font-mono text-[9.5px] text-gray-300 leading-relaxed focus:border-sky-500 outline-none resize-none transition-all duration-300"
                style={{ filter: `blur(${documentBlur}px)` }}
                placeholder="Type anything to blur..."
              />
              {documentBlur > 3 && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded flex flex-col items-center justify-center p-3 text-center pointer-events-none">
                  <EyeOff className="w-5 h-5 text-[#FFD700] animate-bounce" />
                  <span className="text-[9px] text-[#FFD700] font-black uppercase tracking-wider mt-1.5">Focus Lost</span>
                  <span className="text-[8px] text-gray-400 max-w-[150px] leading-tight mt-0.5">Adjust slider below to restore readability</span>
                </div>
              )}
            </div>

            {/* Document Blur Slider */}
            <div className="bg-[#0e0e0e] border border-[#222] p-2.5 rounded-lg flex items-center justify-between">
              <span className="text-[8.5px] text-sky-400 font-bold flex items-center gap-1">
                <Sliders className="w-3 h-3 text-sky-400" />
                DOCUMENT BLUR INDEX
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="12"
                  value={documentBlur}
                  onChange={(e) => setDocumentBlur(parseInt(e.target.value))}
                  className="w-24 accent-sky-400 h-1 bg-[#222] rounded-lg cursor-pointer"
                />
                <span className="text-[9px] bg-[#1a1a1a] px-1.5 py-0.5 rounded font-black text-sky-400">
                  {documentBlur}px
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
