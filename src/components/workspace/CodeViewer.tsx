'use client';

import React, { useState } from 'react';
import { useLab } from '@/context/LabContext';
import { FileCode, Copy, Check, AlertCircle } from 'lucide-react';

export const CodeViewer: React.FC = () => {
  const { activeFile } = useLab();
  const [copied, setCopied] = useState(false);

  if (!activeFile) {
    return (
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-8 text-center text-[#8B949E] font-mono text-xs flex flex-col items-center justify-center h-full">
        <FileCode className="w-8 h-8 mb-2 opacity-50" />
        <p>Select a file from the explorer to view code.</p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = activeFile.content.split('\n');

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden flex flex-col h-full font-mono text-xs select-none">
      
      {/* Editor Header Bar */}
      <div className="bg-[#21262D] border-b border-[#30363D] px-3.5 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#0D1117] border border-[#30363D] text-[#58A6FF]">
            <FileCode className="w-3.5 h-3.5" />
            <span className="font-semibold">{activeFile.name}</span>
          </div>
          <span className="text-[11px] text-[#8B949E] hidden sm:inline">{activeFile.path}</span>
        </div>

        <div className="flex items-center gap-2">
          {activeFile.isSuspect && (
            <span className="hidden md:flex items-center gap-1 text-[10px] text-[#F85149] bg-[#F85149]/10 border border-[#F85149]/30 px-2 py-0.5 rounded">
              <AlertCircle className="w-3 h-3" />
              <span>SUSPECT BUG REGION</span>
            </span>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#0D1117] border border-[#30363D] hover:border-[#484F58] text-[#8B949E] hover:text-[#F0F6FC] transition-colors text-[11px]"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-[#3FB950]" />
                <span className="text-[#3FB950]">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>COPY</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Content Body */}
      <div className="p-3.5 overflow-auto flex-1 bg-[#0D1117] text-[#C9D1D9]">
        <pre className="font-mono text-[12px] leading-relaxed select-text">
          <code>
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const isHighlighted = activeFile.highlightLines?.includes(lineNum);

              return (
                <div
                  key={lineNum}
                  className={`flex items-start gap-4 px-2 py-0.5 rounded transition-colors ${
                    isHighlighted
                      ? 'bg-[#F85149]/15 border-l-2 border-[#F85149] font-medium text-[#F0F6FC]'
                      : 'hover:bg-[#21262D]/40'
                  }`}
                >
                  <span className={`w-6 shrink-0 text-right select-none ${isHighlighted ? 'text-[#F85149] font-bold' : 'text-[#8B949E]/50'}`}>
                    {lineNum}
                  </span>
                  <span className="flex-1 whitespace-pre overflow-x-auto">
                    {line.trim().startsWith('//') || line.trim().startsWith('#') ? (
                      <span className="text-[#8B949E] italic">{line}</span>
                    ) : (
                      line
                    )}
                  </span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>

      {/* Status Bar */}
      <div className="bg-[#21262D] border-t border-[#30363D] px-3.5 py-1 flex items-center justify-between text-[11px] text-[#8B949E]">
        <div className="flex items-center gap-3">
          <span>UTF-8</span>
          <span>{activeFile.language.toUpperCase()}</span>
          <span>{lines.length} lines</span>
        </div>
        <div>
          <span>Branch: <code className="text-[#58A6FF]">bug-hunt/fix-branch</code></span>
        </div>
      </div>

    </div>
  );
};
