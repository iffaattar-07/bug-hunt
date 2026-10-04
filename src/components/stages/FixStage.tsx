'use client';

import React from 'react';
import { useLab } from '@/context/LabContext';
import { 
  FileCode2, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  GitCompare, 
  Check, 
  X 
} from 'lucide-react';
import { motion } from 'framer-motion';

export const FixStage: React.FC = () => {
  const { 
    activeChallenge, 
    selectedFix, 
    submitFix, 
    setStage 
  } = useLab();

  if (!activeChallenge) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 text-[#F0F6FC]">
      
      {/* Header */}
      <div className="border-b border-[#30363D] pb-5 space-y-1.5">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#BC8CFF]">
          <FileCode2 className="w-3.5 h-3.5" />
          <span>STAGE 3: CODE SOLUTION & DIFF ANALYSIS</span>
        </div>
        <h1 className="text-2xl font-bold text-[#F0F6FC] font-sans tracking-tight">
          Select the Code Fix
        </h1>
        <p className="text-xs text-[#8B949E] font-sans">
          Review candidate code diffs and select the clean solution that fixes the root cause.
        </p>
      </div>

      {/* Candidate Fix Cards */}
      <div className="space-y-4">
        {activeChallenge.fixes.map((fix, idx) => {
          const isSelected = selectedFix?.id === fix.id;

          return (
            <motion.div
              key={fix.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              onClick={() => submitFix(fix.id)}
              className={`rounded-lg border transition-colors cursor-pointer overflow-hidden ${
                isSelected
                  ? fix.isCorrect
                    ? 'bg-[#161B22] border-[#3FB950]/60'
                    : 'bg-[#161B22] border-[#D29922]/60'
                  : 'bg-[#161B22] border-[#30363D] hover:border-[#484F58]'
              }`}
            >
              {/* Fix Card Header */}
              <div className="p-4 bg-[#21262D] border-b border-[#30363D] flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="px-2 py-0.5 rounded bg-[#0D1117] border border-[#30363D] text-[#58A6FF] font-semibold">
                      OPTION #{idx + 1}
                    </span>
                    <span className="text-[#8B949E]">{fix.targetFile}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#F0F6FC] font-sans">{fix.title}</h3>
                  <p className="text-xs text-[#8B949E] font-sans">{fix.description}</p>
                </div>

                <div className="shrink-0">
                  <input
                    type="radio"
                    name="fix-selection"
                    checked={isSelected}
                    onChange={() => submitFix(fix.id)}
                    className="w-4 h-4 accent-[#58A6FF] cursor-pointer"
                  />
                </div>
              </div>

              {/* Code Diff Viewer */}
              <div className="p-4 bg-[#0D1117] space-y-2.5 font-mono text-xs">
                <div className="flex items-center gap-2 text-[#8B949E] text-[11px] pb-1 border-b border-[#30363D]">
                  <GitCompare className="w-3.5 h-3.5 text-[#58A6FF]" />
                  <span>CODE DIFF</span>
                </div>

                {/* Diff Before (Removed code) */}
                <div className="p-2.5 rounded bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149] space-y-1 overflow-x-auto select-text">
                  <div className="text-[10px] font-bold flex items-center gap-1 uppercase">
                    <X className="w-3 h-3" />
                    <span>BEFORE</span>
                  </div>
                  <pre className="whitespace-pre">
                    <code>{fix.diffBefore}</code>
                  </pre>
                </div>

                {/* Diff After (Added code) */}
                <div className="p-2.5 rounded bg-[#3FB950]/10 border border-[#3FB950]/30 text-[#3FB950] space-y-1 overflow-x-auto select-text">
                  <div className="text-[10px] font-bold flex items-center gap-1 uppercase">
                    <Check className="w-3 h-3" />
                    <span>AFTER</span>
                  </div>
                  <pre className="whitespace-pre">
                    <code>{fix.diffAfter}</code>
                  </pre>
                </div>
              </div>

              {/* Explanation & Rationale Callout if Selected */}
              {isSelected && (
                <div className={`p-3.5 border-t text-xs font-mono select-text ${
                  fix.isCorrect 
                    ? 'bg-[#3FB950]/10 border-[#3FB950]/30 text-[#3FB950]' 
                    : 'bg-[#D29922]/10 border-[#D29922]/30 text-[#D29922]'
                }`}>
                  <div className="font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    {fix.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>RECOMMENDED SOLUTION</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>SUB-OPTIMAL FIX</span>
                      </>
                    )}
                  </div>
                  <p className="font-sans leading-relaxed text-[#C9D1D9]">{fix.explanation}</p>
                </div>
              )}

            </motion.div>
          );
        })}
      </div>

      {/* Action CTA when fix is selected */}
      {selectedFix && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 rounded-lg bg-[#161B22] border border-[#30363D] text-center space-y-3"
        >
          <h3 className="text-base font-bold text-[#F0F6FC] font-sans">
            Selected: <span className="text-[#58A6FF]">{selectedFix.title}</span>
          </h3>
          <p className="text-xs text-[#8B949E] max-w-md mx-auto">
            Proceed to the Verification Stage to run regression tests against your code fix.
          </p>
          <button
            onClick={() => setStage('verify')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white font-mono font-semibold text-xs transition-colors shadow-sm"
          >
            <span>PROCEED TO VERIFICATION</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

    </div>
  );
};
