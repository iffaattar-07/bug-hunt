'use client';

import React from 'react';
import { useLab } from '@/context/LabContext';
import { FileCode, AlertTriangle, FolderOpen } from 'lucide-react';

export const FileExplorer: React.FC = () => {
  const { activeChallenge, activeFile, setActiveFile } = useLab();

  if (!activeChallenge) return null;

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden flex flex-col h-full font-mono text-xs select-none">
      
      {/* Header */}
      <div className="px-3 py-2 bg-[#21262D] border-b border-[#30363D] flex items-center justify-between text-[#8B949E]">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-3.5 h-3.5 text-[#58A6FF]" />
          <span className="font-semibold text-[#F0F6FC]">FILE EXPLORER</span>
        </div>
        <span className="text-[10px]">
          {activeChallenge.files.length} files
        </span>
      </div>

      {/* File List */}
      <div className="p-1.5 space-y-1 overflow-y-auto flex-1">
        {activeChallenge.files.map((file) => {
          const isSelected = activeFile?.path === file.path;

          return (
            <button
              key={file.path}
              onClick={() => setActiveFile(file)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left transition-colors ${
                isSelected
                  ? 'bg-[#21262D] text-[#58A6FF] border border-[#30363D] font-medium'
                  : 'text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]/40 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#58A6FF]' : 'text-[#8B949E]'}`} />
                <span className="truncate">{file.name}</span>
              </div>

              {file.isSuspect && (
                <span 
                  title="High suspicion file"
                  className="flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149] shrink-0"
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>SUSPECT</span>
                </span>
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
};
