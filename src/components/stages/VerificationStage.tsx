'use client';

import React, { useEffect } from 'react';
import { useLab } from '@/context/LabContext';
import { 
  FlaskConical, 
  Play, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Terminal, 
  ShieldCheck 
} from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export const VerificationStage: React.FC = () => {
  const { 
    activeChallenge, 
    selectedFix, 
    testCases, 
    testRunnerState, 
    runVerification, 
    setStage 
  } = useLab();

  // Trigger confetti when test runner completes successfully
  useEffect(() => {
    if (testRunnerState === 'completed') {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // Ignore confetti errors
      }
    }
  }, [testRunnerState]);

  if (!activeChallenge || !selectedFix) return null;

  const passedCount = testCases.filter((t) => t.status === 'passed').length;
  const totalCount = testCases.length;
  const isCompleted = testRunnerState === 'completed';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 text-[#F0F6FC]">
      
      {/* Header */}
      <div className="border-b border-[#30363D] pb-5 space-y-1.5">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#3FB950]">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>STAGE 4: AUTOMATED VERIFICATION TEST RUNNER</span>
        </div>
        <h1 className="text-2xl font-bold text-[#F0F6FC] font-sans tracking-tight">
          Regression Test Suite
        </h1>
        <p className="text-xs text-[#8B949E] font-sans">
          Execute test specs against applied fix: <code className="text-[#58A6FF]">{selectedFix.title}</code>.
        </p>
      </div>

      {/* Test Runner Control Card */}
      <div className="p-5 rounded-lg bg-[#161B22] border border-[#30363D] space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#30363D] pb-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#8B949E]">
              <Terminal className="w-3.5 h-3.5 text-[#58A6FF]" />
              <span>TEST SUITE</span>
            </div>
            <h2 className="text-base font-bold text-[#F0F6FC] font-sans mt-0.5">
              Target Suite: {activeChallenge.slug}.test
            </h2>
          </div>

          <button
            onClick={runVerification}
            disabled={testRunnerState === 'running'}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-md font-mono font-semibold text-xs tracking-wide transition-colors ${
              testRunnerState === 'running'
                ? 'bg-[#21262D] text-[#8B949E] cursor-not-allowed border border-[#30363D]'
                : 'bg-[#238636] hover:bg-[#2ea043] text-white shadow-sm'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{testRunnerState === 'running' ? 'RUNNING SPECS...' : 'RUN VERIFICATION'}</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 font-mono text-xs">
          <div className="flex justify-between text-[#8B949E]">
            <span>Status: {testRunnerState.toUpperCase()}</span>
            <span>{passedCount} / {totalCount} specs passed</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#0D1117] overflow-hidden border border-[#30363D]">
            <motion.div
              className="h-full bg-[#3FB950] rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${(passedCount / totalCount) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Specs List */}
        <div className="space-y-2 font-mono text-xs bg-[#0D1117] p-3 rounded-md border border-[#30363D]">
          {testCases.map((tc, idx) => (
            <div
              key={tc.id}
              className={`p-2.5 rounded border flex items-center justify-between gap-3 transition-colors ${
                tc.status === 'passed'
                  ? 'bg-[#3FB950]/10 border-[#3FB950]/30 text-[#3FB950]'
                  : tc.status === 'running'
                  ? 'bg-[#21262D] border-[#58A6FF]/50 text-[#58A6FF]'
                  : 'bg-[#21262D]/40 border-[#30363D]/50 text-[#8B949E]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 text-[#8B949E] text-right">0{idx + 1}</span>

                {tc.status === 'passed' ? (
                  <CheckCircle2 className="w-4 h-4 text-[#3FB950] shrink-0" />
                ) : tc.status === 'running' ? (
                  <FlaskConical className="w-4 h-4 text-[#58A6FF] animate-spin shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-[#8B949E] shrink-0" />
                )}

                <div>
                  <div className="font-semibold font-sans text-[#F0F6FC] text-xs">{tc.name}</div>
                  <div className="text-[10px] text-[#8B949E]">{tc.description}</div>
                </div>
              </div>

              {tc.status === 'passed' && (
                <span className="text-[10px] text-[#3FB950] font-mono">
                  ✓ {tc.durationMs}ms
                </span>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* Final Verification Success Banner */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-lg bg-[#161B22] border border-[#3FB950]/40 space-y-3 text-center"
        >
          <div className="inline-flex p-2.5 rounded-full bg-[#3FB950]/10 border border-[#3FB950]/30 text-[#3FB950]">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#F0F6FC] font-sans">
              ALL TESTS VERIFIED & PASSED
            </h3>
            <p className="text-xs text-[#8B949E] mt-1 max-w-md mx-auto">
              The regression suite passed cleanly. View your Post-Mortem Engineering Report.
            </p>
          </div>

          <button
            onClick={() => setStage('report')}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white font-mono font-semibold text-xs transition-colors shadow-sm"
          >
            <span>VIEW ENGINEERING REPORT</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

    </div>
  );
};
