'use client';

import React, { useState } from 'react';
import { useLab } from '@/context/LabContext';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  HelpCircle, 
  FileCode 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DiagnosisStage: React.FC = () => {
  const { 
    activeChallenge, 
    submitDiagnosis, 
    diagnosisFeedback, 
    selectedDiagnosis, 
    attemptsCount,
    setStage 
  } = useLab();

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  if (!activeChallenge) return null;

  const handleSelect = (optionId: string) => {
    setSelectedOptionId(optionId);
    submitDiagnosis(optionId);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 text-[#F0F6FC]">
      
      {/* Header */}
      <div className="border-b border-[#30363D] pb-5 space-y-1.5">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#D29922]">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>STAGE 2: ROOT CAUSE DIAGNOSIS</span>
        </div>
        <h1 className="text-2xl font-bold text-[#F0F6FC] font-sans tracking-tight">
          What is causing "{activeChallenge.title}"?
        </h1>
        <p className="text-xs text-[#8B949E] font-sans">
          Select the correct engineering root cause hypothesis based on your code investigation.
        </p>
      </div>

      {/* Attempts Badge */}
      <div className="flex items-center justify-between text-xs font-mono bg-[#161B22] p-3 rounded-lg border border-[#30363D]">
        <div className="flex items-center gap-2 text-[#8B949E]">
          <HelpCircle className="w-4 h-4 text-[#58A6FF]" />
          <span>Diagnosis attempts: <strong className="text-[#F0F6FC]">{attemptsCount}</strong></span>
        </div>
        <button
          onClick={() => setStage('investigate')}
          className="flex items-center gap-1.5 text-[#58A6FF] hover:underline"
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Return to Code</span>
        </button>
      </div>

      {/* Hypothesis Options */}
      <div className="space-y-3">
        {activeChallenge.diagnoses.map((option, idx) => {
          const isSelected = selectedOptionId === option.id || selectedDiagnosis?.id === option.id;
          const isFeedbackForThis = diagnosisFeedback?.optionId === option.id;

          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.08 }}
              onClick={() => !selectedDiagnosis?.isCorrect && handleSelect(option.id)}
              className={`p-4 rounded-lg border transition-colors cursor-pointer select-none space-y-2.5 ${
                selectedDiagnosis?.id === option.id
                  ? 'bg-[#3FB950]/10 border-[#3FB950]/50 text-[#F0F6FC]'
                  : isFeedbackForThis && !diagnosisFeedback?.isCorrect
                  ? 'bg-[#F85149]/10 border-[#F85149]/50 text-[#F0F6FC]'
                  : 'bg-[#161B22] border-[#30363D] hover:border-[#484F58]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 font-mono text-[11px] px-2 py-0.5 rounded bg-[#21262D] border border-[#30363D] text-[#58A6FF] font-medium">
                    OPTION #{idx + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-sans text-[#F0F6FC]">{option.title}</h3>
                    <p className="text-xs text-[#8B949E] mt-1 leading-relaxed font-sans">
                      {option.description}
                    </p>
                  </div>
                </div>

                {selectedDiagnosis?.id === option.id ? (
                  <CheckCircle2 className="w-5 h-5 text-[#3FB950] shrink-0" />
                ) : isFeedbackForThis && !diagnosisFeedback?.isCorrect ? (
                  <XCircle className="w-5 h-5 text-[#F85149] shrink-0" />
                ) : null}
              </div>

              {/* Feedback Rationale Callout */}
              <AnimatePresence>
                {isFeedbackForThis && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-3 rounded-md border text-xs font-mono leading-relaxed select-text ${
                      diagnosisFeedback.isCorrect
                        ? 'bg-[#3FB950]/15 border-[#3FB950]/40 text-[#3FB950]'
                        : 'bg-[#F85149]/15 border-[#F85149]/40 text-[#F85149]'
                    }`}
                  >
                    <div className="font-bold mb-1 uppercase tracking-wider flex items-center gap-1.5">
                      {diagnosisFeedback.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>DIAGNOSIS CONFIRMED (CORRECT)</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>DIAGNOSIS REJECTED (INCORRECT)</span>
                        </>
                      )}
                    </div>
                    <p className="font-sans text-[#C9D1D9]">{diagnosisFeedback.message}</p>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          );
        })}
      </div>

      {/* Action CTA when diagnosis is correct */}
      {selectedDiagnosis?.isCorrect && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 rounded-lg bg-[#161B22] border border-[#3FB950]/40 space-y-3 text-center"
        >
          <h3 className="text-base font-bold text-[#3FB950] font-sans">
            Root cause confirmed! Ready to select a fix.
          </h3>
          <p className="text-xs text-[#8B949E] max-w-md mx-auto">
            Proceed to the Fix Stage to evaluate code diffs and implement the solution.
          </p>
          <button
            onClick={() => setStage('fix')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white font-mono font-semibold text-xs transition-colors shadow-sm"
          >
            <span>PROCEED TO FIX STAGE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

    </div>
  );
};
