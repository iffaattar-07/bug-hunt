'use client';

import React from 'react';
import { useLab } from '@/context/LabContext';
import { Key, Lock, Unlock } from 'lucide-react';

export const CluesPanel: React.FC = () => {
  const { activeChallenge, unlockedClueIds, unlockClue } = useLab();

  if (!activeChallenge) return null;

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden flex flex-col h-full font-mono text-xs select-none">
      
      {/* Header */}
      <div className="bg-[#21262D] border-b border-[#30363D] px-3.5 py-2 flex items-center justify-between text-[#8B949E]">
        <div className="flex items-center gap-2">
          <Key className="w-3.5 h-3.5 text-[#D29922]" />
          <span className="font-semibold text-[#F0F6FC]">CLUES & HINTS</span>
        </div>
        <span className="text-[10px] text-[#D29922] bg-[#D29922]/10 px-2 py-0.5 rounded border border-[#D29922]/30">
          {unlockedClueIds.length} / {activeChallenge.clues.length} unlocked
        </span>
      </div>

      {/* Clues Body */}
      <div className="p-3 overflow-y-auto flex-1 space-y-3">
        {activeChallenge.clues.map((clue, idx) => {
          const isUnlocked = unlockedClueIds.includes(clue.id);

          return (
            <div
              key={clue.id}
              className={`p-3.5 rounded-lg border transition-colors ${
                isUnlocked
                  ? 'bg-[#D29922]/5 border-[#D29922]/30 text-[#F0F6FC]'
                  : 'bg-[#21262D]/50 border-[#30363D] text-[#8B949E]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#D29922]">HINT #{idx + 1}</span>
                  <span className="font-semibold text-[#F0F6FC] font-sans">{clue.title}</span>
                </div>

                {isUnlocked ? (
                  <span className="flex items-center gap-1 text-[10px] text-[#3FB950] bg-[#3FB950]/10 px-1.5 py-0.5 rounded border border-[#3FB950]/30">
                    <Unlock className="w-3 h-3" />
                    <span>UNLOCKED</span>
                  </span>
                ) : (
                  <button
                    onClick={() => unlockClue(clue.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#D29922] hover:bg-[#b8831b] text-[#0D1117] font-semibold text-[11px] transition-colors"
                  >
                    <Lock className="w-3 h-3" />
                    <span>REVEAL</span>
                  </button>
                )}
              </div>

              {isUnlocked ? (
                <p className="text-xs leading-relaxed text-[#C9D1D9] font-sans pt-1 border-t border-[#D29922]/20 select-text">
                  {clue.hint}
                </p>
              ) : (
                <p className="text-[11px] text-[#8B949E] italic pt-1 border-t border-[#30363D]/50">
                  Click 'Reveal' to unlock hint guidance.
                </p>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
