'use client';

import React from 'react';
import { useLab } from '@/context/LabContext';
import { Target, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export const ExpectedBehavior: React.FC = () => {
  const { activeChallenge } = useLab();

  if (!activeChallenge) return null;

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden flex flex-col h-full font-mono text-xs select-none">
      
      {/* Header */}
      <div className="bg-[#21262D] border-b border-[#30363D] px-3.5 py-2 flex items-center justify-between text-[#8B949E]">
        <div className="flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-[#3FB950]" />
          <span className="font-semibold text-[#F0F6FC]">EXPECTED VS ACTUAL SPECIFICATION</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5 overflow-y-auto flex-1 space-y-4 font-sans">
        
        {/* Architecture Overview */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-[#58A6FF]">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>ARCHITECTURE OVERVIEW</span>
          </div>
          <p className="text-xs text-[#C9D1D9] leading-relaxed bg-[#21262D] p-3 rounded-md border border-[#30363D] select-text font-mono">
            {activeChallenge.architectureOverview}
          </p>
        </div>

        {/* Reproduction Steps */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-[#D29922]">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>REPRODUCTION STEPS (ACTUAL FAILURE)</span>
          </div>
          <div className="bg-[#21262D] p-3 rounded-md border border-[#30363D] space-y-1.5">
            {activeChallenge.reproductionSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-[#C9D1D9]">
                <span className="font-mono text-[#D29922] font-bold">{idx + 1}.</span>
                <span className="select-text">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expected Behavior */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-[#3FB950]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>EXPECTED BEHAVIOR</span>
          </div>
          <div className="bg-[#3FB950]/10 border border-[#3FB950]/30 p-3 rounded-md text-xs text-[#3FB950] leading-relaxed select-text font-mono">
            {activeChallenge.expectedBehavior}
          </div>
        </div>

      </div>

    </div>
  );
};
