'use client';

import React, { useState } from 'react';
import { useLab } from '@/context/LabContext';
import { 
  FileText, 
  Clock, 
  HelpCircle, 
  ShieldCheck, 
  Copy, 
  Check, 
  RotateCcw, 
  Layers 
} from 'lucide-react';
import { motion } from 'framer-motion';

export const EngineeringReportStage: React.FC = () => {
  const { finalReport, resetLab } = useLab();
  const [copied, setCopied] = useState(false);

  if (!finalReport) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}m ${remaining}s`;
  };

  const generateMarkdownReport = () => {
    return `# Incident Post-Mortem: ${finalReport.challengeTitle}

**Date**: ${new Date(finalReport.timestamp).toLocaleDateString()}
**Severity / Difficulty**: ${finalReport.difficulty.toUpperCase()}
**Language**: ${finalReport.language}
**Status**: VERIFIED & RESOLVED

---

## Executive Summary
${finalReport.technicalImpact}

## Root Cause Analysis
${finalReport.rootCauseSummary}

## Applied Solution
${finalReport.fixAppliedSummary}

## Verification Metrics
- **Time Elapsed**: ${formatTime(finalReport.durationSeconds)}
- **Diagnosis Attempts**: ${finalReport.attemptsCount}
- **Clues Unlocked**: ${finalReport.cluesUnlockedCount}
- **Tests Passed**: ${finalReport.testsPassedCount} / ${finalReport.totalTestsCount} (100%)

## Prevention Strategy
${finalReport.preventionStrategy}
`;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 text-[#F0F6FC]">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#30363D] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#58A6FF] mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>POST-MORTEM INCIDENT REPORT</span>
          </div>
          <h1 className="text-2xl font-bold text-[#F0F6FC] font-sans tracking-tight">
            Engineering Report: {finalReport.challengeTitle}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#21262D] border border-[#30363D] hover:border-[#484F58] text-[#58A6FF] font-mono text-xs font-semibold transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#3FB950]" />
                <span className="text-[#3FB950]">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>EXPORT MARKDOWN</span>
              </>
            )}
          </button>

          <button
            onClick={resetLab}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#238636] text-white font-mono text-xs font-semibold hover:bg-[#2ea043] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>NEXT CHALLENGE</span>
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-lg bg-[#161B22] border border-[#30363D] font-mono space-y-1">
          <div className="text-[#8B949E] text-[10px] flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#D29922]" />
            <span>TIME ELAPSED</span>
          </div>
          <div className="text-lg font-bold text-[#F0F6FC]">{formatTime(finalReport.durationSeconds)}</div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#161B22] border border-[#30363D] font-mono space-y-1">
          <div className="text-[#8B949E] text-[10px] flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-[#BC8CFF]" />
            <span>DIAGNOSIS ATTEMPTS</span>
          </div>
          <div className="text-lg font-bold text-[#F0F6FC]">{finalReport.attemptsCount}</div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#161B22] border border-[#30363D] font-mono space-y-1">
          <div className="text-[#8B949E] text-[10px] flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#3FB950]" />
            <span>TESTS PASSED</span>
          </div>
          <div className="text-lg font-bold text-[#3FB950]">
            {finalReport.testsPassedCount} / {finalReport.totalTestsCount}
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#161B22] border border-[#30363D] font-mono space-y-1">
          <div className="text-[#8B949E] text-[10px] flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#58A6FF]" />
            <span>DIFFICULTY</span>
          </div>
          <div className="text-lg font-bold text-[#F0F6FC] uppercase">{finalReport.difficulty}</div>
        </div>
      </div>

      {/* Main Report Document Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 rounded-lg bg-[#161B22] border border-[#30363D] space-y-6 font-sans"
      >
        
        {/* Section 1: Executive Summary */}
        <div className="space-y-1.5 border-b border-[#30363D] pb-5">
          <h2 className="text-xs font-mono font-bold text-[#58A6FF] uppercase tracking-wider">
            1. EXECUTIVE SUMMARY & IMPACT
          </h2>
          <p className="text-sm text-[#C9D1D9] leading-relaxed">
            {finalReport.technicalImpact}
          </p>
        </div>

        {/* Section 2: Root Cause Analysis */}
        <div className="space-y-1.5 border-b border-[#30363D] pb-5">
          <h2 className="text-xs font-mono font-bold text-[#D29922] uppercase tracking-wider">
            2. CONFIRMED ROOT CAUSE ANALYSIS
          </h2>
          <div className="p-3 rounded-md bg-[#0D1117] border border-[#30363D] text-xs text-[#C9D1D9] font-mono leading-relaxed select-text">
            {finalReport.rootCauseSummary}
          </div>
        </div>

        {/* Section 3: Resolution & Code Diff */}
        <div className="space-y-2 border-b border-[#30363D] pb-5">
          <h2 className="text-xs font-mono font-bold text-[#BC8CFF] uppercase tracking-wider">
            3. IMPLEMENTED SOLUTION & CODE DIFF
          </h2>
          <p className="text-xs text-[#8B949E]">
            {finalReport.fixAppliedSummary}
          </p>
          <div className="p-3 rounded-md bg-[#0D1117] border border-[#30363D] font-mono text-xs text-[#3FB950] space-y-1 select-text">
            <div className="text-[10px] text-[#8B949E] font-semibold uppercase">Target: {finalReport.fixSelected.targetFile}</div>
            <pre className="whitespace-pre">
              <code>{finalReport.fixSelected.diffAfter}</code>
            </pre>
          </div>
        </div>

        {/* Section 4: Prevention */}
        <div className="space-y-1.5">
          <h2 className="text-xs font-mono font-bold text-[#3FB950] uppercase tracking-wider">
            4. PREVENTION STRATEGY
          </h2>
          <p className="text-xs text-[#C9D1D9] leading-relaxed font-sans">
            {finalReport.preventionStrategy}
          </p>
        </div>

      </motion.div>

    </div>
  );
};
