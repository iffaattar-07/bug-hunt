'use client';

import React, { useState } from 'react';
import { useLab } from '@/context/LabContext';
import {
  FileText,
  Timer,
  HelpCircle,
  ShieldCheck,
  Copy,
  Check,
  RotateCcw,
  Layers,
  KeyRound,
  Download,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Chip, Counter, cx, SectionHead } from '@/components/ui/primitives';

const SECTIONS = [
  { key: 'impact', n: '01', label: 'Executive summary & impact', tone: 'signal' },
  { key: 'cause', n: '02', label: 'Confirmed root cause', tone: 'clue' },
  { key: 'solution', n: '03', label: 'Implemented solution', tone: 'trace' },
  { key: 'prevention', n: '04', label: 'Prevention strategy', tone: 'pass' },
] as const;

export const EngineeringReportStage: React.FC = () => {
  const { finalReport, resetLab } = useLab();
  const [copied, setCopied] = useState(false);

  if (!finalReport) return null;

  const formatTime = (secs: number) =>
    `${Math.floor(secs / 60)}m ${String(secs % 60).padStart(2, '0')}s`;

  const markdown = `# Incident Post-Mortem: ${finalReport.challengeTitle}

**Date**: ${new Date(finalReport.timestamp).toLocaleDateString()}
**Severity**: ${finalReport.difficulty.toUpperCase()}
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

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const metrics = [
    { icon: <Timer className="h-3.5 w-3.5" />, label: 'Time elapsed', value: formatTime(finalReport.durationSeconds), raw: false, tone: 'text-signal' },
    { icon: <HelpCircle className="h-3.5 w-3.5" />, label: 'Attempts', value: finalReport.attemptsCount, raw: true, tone: 'text-clue' },
    { icon: <KeyRound className="h-3.5 w-3.5" />, label: 'Clues used', value: finalReport.cluesUnlockedCount, raw: true, tone: 'text-trace' },
    { icon: <ShieldCheck className="h-3.5 w-3.5" />, label: 'Specs passed', value: finalReport.totalTestsCount, raw: true, tone: 'text-pass' },
  ];

  return (
    <div className="mx-auto w-full max-w-[980px] px-4 py-9 sm:px-6">
      <SectionHead
        tone="pass"
        kicker="Stage 5 / 5 — Case closed"
        title={<>Post-mortem: {finalReport.challengeTitle}</>}
        desc="Filed automatically from your run. Export it as Markdown and drop it straight into your team's incident channel."
        right={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 rounded-[5px] border border-ink-edge bg-ink-800 px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-fg-dim transition-all duration-200 hover:-translate-y-0.5 hover:border-signal/50 hover:text-signal"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-pass" />
                  <span className="text-pass">Copied</span>
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5" />
                  Export .md
                </>
              )}
            </button>
            <button
              onClick={resetLab}
              className="flex items-center gap-2 rounded-[5px] bg-signal px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-950 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ffd160]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Next case
            </button>
          </div>
        }
      />

      {/* metrics */}
      <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="group relative overflow-hidden rounded-lg border border-ink-line bg-ink-800 p-4 shadow-panel transition-colors hover:border-ink-edge"
          >
            <span className="absolute inset-x-0 top-0 h-[3px] scale-x-0 bg-signal transition-transform duration-500 group-hover:scale-x-100" />
            <div className={cx('flex items-center gap-1.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.16em] text-fg-mute', m.tone)}>
              {m.icon}
              {m.label}
            </div>
            <div className="mt-2.5 font-display text-[26px] font-bold leading-none tracking-tight text-fg">
              {m.raw ? <Counter to={m.value as number} /> : <span className="tnum">{m.value}</span>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* report document */}
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative mt-5 overflow-hidden rounded-lg border border-ink-line bg-ink-800 shadow-lift"
      >
        {/* document masthead */}
        <div className="relative border-b border-ink-line bg-ink-700 px-6 py-6 sm:px-9">
          <div className="absolute inset-x-0 top-0 h-[6px] hazard" />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-signal">
                <FileText className="h-3.5 w-3.5" />
                Incident report
              </div>
              <h2 className="mt-2.5 max-w-[24ch] font-display text-[26px] font-bold leading-[1.1] tracking-tight text-fg">
                {finalReport.challengeTitle}
              </h2>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Chip tone="signal">
                  <Layers className="h-3 w-3" />
                  {finalReport.difficulty}
                </Chip>
                <Chip tone="trace">{finalReport.language}</Chip>
                <Chip tone="pass">
                  <ShieldCheck className="h-3 w-3" />
                  Resolved
                </Chip>
              </div>
            </div>

            <div className="shrink-0 self-start sm:self-auto">
              <div className="stamp rounded border-pass/70 text-pass">
                <span className="px-3 py-1.5">Case closed</span>
              </div>
            </div>
          </div>
        </div>

        {/* body */}
        <div className="divide-y divide-ink-line px-6 sm:px-9">
          {SECTIONS.map((s, i) => (
            <motion.section
              key={s.key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 + i * 0.1, duration: 0.5 }}
              className="py-7"
            >
              <div className="mb-3 flex items-baseline gap-3">
                <span
                  className={cx(
                    'font-display text-[13px] font-bold tracking-[0.1em]',
                    s.tone === 'signal' && 'text-signal',
                    s.tone === 'clue' && 'text-clue',
                    s.tone === 'trace' && 'text-trace',
                    s.tone === 'pass' && 'text-pass',
                  )}
                >
                  {s.n}
                </span>
                <h3 className="font-display text-[15px] font-bold uppercase tracking-[0.1em] text-fg">
                  {s.label}
                </h3>
                <span className="hidden h-px flex-1 bg-ink-line sm:block" />
              </div>

              {s.key === 'impact' && (
                <p className="max-w-[78ch] text-[14.5px] leading-[1.75] text-fg-dim">
                  {finalReport.technicalImpact}
                </p>
              )}

              {s.key === 'cause' && (
                <p className="select-text max-w-[78ch] rounded-[5px] border-l-2 border-clue/60 bg-ink-950 p-4 font-mono text-[12.5px] leading-relaxed text-fg-dim">
                  {finalReport.rootCauseSummary}
                </p>
              )}

              {s.key === 'solution' && (
                <div className="space-y-3">
                  <p className="max-w-[78ch] text-[14.5px] leading-[1.75] text-fg-dim">
                    {finalReport.fixAppliedSummary}
                  </p>
                  <div className="select-text overflow-x-auto rounded-[5px] border border-ink-line bg-ink-950 p-4">
                    <div className="mb-2 font-mono text-[9.5px] font-bold uppercase tracking-[0.16em] text-fg-mute">
                      target · {finalReport.fixSelected.targetFile}
                    </div>
                    <pre className="whitespace-pre font-mono text-[12px] leading-[1.7] text-pass">
                      <code>{finalReport.fixSelected.diffAfter}</code>
                    </pre>
                  </div>
                </div>
              )}

              {s.key === 'prevention' && (
                <p className="max-w-[78ch] text-[14.5px] leading-[1.75] text-fg-dim">
                  {finalReport.preventionStrategy}
                </p>
              )}
            </motion.section>
          ))}
        </div>

        {/* footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-line bg-ink-950 px-6 py-4 font-mono text-[9.5px] font-bold uppercase tracking-[0.16em] text-fg-mute sm:px-9">
          <span>signed · on-call investigator</span>
          <span className="text-signal">
            {new Date(finalReport.timestamp).toLocaleString()}
          </span>
        </div>
      </motion.article>
    </div>
  );
};
