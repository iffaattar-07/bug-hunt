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
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Chip, Counter, SectionHead, Stamp } from '@/components/ui/primitives';

const SECTIONS = [
  { key: 'impact', n: '01', label: 'Executive summary & impact' },
  { key: 'cause', n: '02', label: 'Confirmed root cause' },
  { key: 'solution', n: '03', label: 'Implemented solution' },
  { key: 'prevention', n: '04', label: 'Prevention strategy' },
] as const;

const ease = [0.16, 1, 0.3, 1] as const;

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
    { icon: <Timer className="h-3.5 w-3.5" />, label: 'time elapsed', value: formatTime(finalReport.durationSeconds), raw: false },
    { icon: <HelpCircle className="h-3.5 w-3.5" />, label: 'attempts', value: finalReport.attemptsCount, raw: true },
    { icon: <KeyRound className="h-3.5 w-3.5" />, label: 'clues used', value: finalReport.cluesUnlockedCount, raw: true },
    { icon: <ShieldCheck className="h-3.5 w-3.5" />, label: 'specs passed', value: finalReport.totalTestsCount, raw: true },
  ];

  return (
    <div className="mx-auto w-full max-w-[980px] px-4 py-9 sm:px-6">
      <SectionHead
        tone="pass"
        kicker="Stage 5 / 5 — case closed"
        title={<>Post-mortem: {finalReport.challengeTitle}</>}
        desc="Filed automatically from your run. Export it as Markdown and drop it straight into your team's incident channel."
        right={
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 rounded-sm border border-ink-edge px-4 py-3 font-mono text-[11px] tracking-[0.06em] text-fg-dim transition-colors duration-150 hover:border-signal/60 hover:text-signal"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-pass" />
                  <span className="text-pass">copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  export .md
                </>
              )}
            </button>
            <button
              onClick={resetLab}
              className="flex items-center gap-2 rounded-sm bg-signal px-4 py-3 font-mono text-[11px] font-bold tracking-[0.06em] text-ink-950 transition-colors duration-150 hover:bg-[#f2c860]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              next case
            </button>
          </div>
        }
      />

      {/* metrics — one ruled band, not four cards */}
      <div className="mt-8 grid grid-cols-2 border-l border-t border-ink-line lg:grid-cols-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease }}
            className="border-b border-r border-ink-line px-5 py-5"
          >
            <div className="flex items-center gap-2 font-mono text-[10.5px] tracking-[0.08em] text-fg-mute">
              {m.icon}
              {m.label}
            </div>
            <div className="mt-3 font-display text-[28px] font-extrabold leading-none tracking-[-0.045em] text-fg">
              {m.raw ? <Counter to={m.value as number} /> : <span className="tnum">{m.value}</span>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* report document */}
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5, ease }}
        className="relative mt-6 border border-ink-line bg-ink-850"
      >
        {/* document masthead */}
        <div className="relative border-b border-ink-line px-6 py-8 sm:px-9">
          <div className="hazard absolute inset-x-0 top-0 h-[5px]" />
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.08em] text-signal">
                <FileText className="h-3.5 w-3.5" />
                incident report
              </div>
              <h2 className="mt-3 max-w-[24ch] font-display text-[30px] font-extrabold leading-[1.03] tracking-[-0.04em] text-fg">
                {finalReport.challengeTitle}
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                <Chip tone="signal">
                  <Layers className="h-3 w-3" />
                  {finalReport.difficulty}
                </Chip>
                <Chip tone="trace">{finalReport.language}</Chip>
                <Chip tone="pass">
                  <ShieldCheck className="h-3 w-3" />
                  resolved
                </Chip>
              </div>
            </div>

            <div className="shrink-0 self-start sm:mt-2">
              <Stamp text="case closed" tone="pass" className="relative inline-block" />
            </div>
          </div>
        </div>

        {/* body */}
        <div className="px-6 sm:px-9">
          {SECTIONS.map((s, i) => (
            <motion.section
              key={s.key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.45 }}
              className="border-b border-ink-line py-7 last:border-b-0"
            >
              <div className="mb-3 flex items-baseline gap-3">
                <span className="font-mono text-[12px] font-bold text-signal tnum">{s.n}</span>
                <h3 className="font-display text-[15px] font-bold tracking-[-0.01em] text-fg">
                  {s.label}
                </h3>
                <span className="hidden h-px flex-1 self-center sm:block">
                  <span className="leader block" />
                </span>
              </div>

              {s.key === 'impact' && (
                <p className="max-w-[76ch] text-[15px] leading-[1.75] text-fg-dim">
                  {finalReport.technicalImpact}
                </p>
              )}

              {s.key === 'cause' && (
                <p className="select-text max-w-[76ch] border-l-2 border-clue/60 bg-ink-950 p-4 font-mono text-[12.5px] leading-[1.75] text-fg-dim">
                  {finalReport.rootCauseSummary}
                </p>
              )}

              {s.key === 'solution' && (
                <div className="space-y-4">
                  <p className="max-w-[76ch] text-[15px] leading-[1.75] text-fg-dim">
                    {finalReport.fixAppliedSummary}
                  </p>
                  <div className="select-text overflow-x-auto border border-ink-line bg-ink-950">
                    <div className="border-b border-ink-line px-4 py-2 font-mono text-[10.5px] tracking-[0.06em] text-fg-mute">
                      target · {finalReport.fixSelected.targetFile}
                    </div>
                    <pre className="whitespace-pre px-4 py-3 font-mono text-[12px] leading-[1.7] text-pass">
                      <code>{finalReport.fixSelected.diffAfter}</code>
                    </pre>
                  </div>
                </div>
              )}

              {s.key === 'prevention' && (
                <p className="max-w-[76ch] text-[15px] leading-[1.75] text-fg-dim">
                  {finalReport.preventionStrategy}
                </p>
              )}
            </motion.section>
          ))}
        </div>

        {/* footer */}
        <div className="flex flex-wrap items-center gap-3 border-t border-ink-line bg-ink-950 px-6 py-4 font-mono text-[10.5px] tracking-[0.06em] text-fg-mute sm:px-9">
          <span>signed · on-call investigator</span>
          <svg
            viewBox="0 0 168 40"
            aria-hidden
            className="h-8 w-[150px] shrink-0 text-signal"
            fill="none"
          >
            <motion.path
              d="M4 28C14 10 20 34 30 22S46 6 54 24s14 12 22-2 16-14 24 2 16 10 24-4 18-6 30 2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0.2 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.5, ease }}
            />
          </svg>
          <span className="leader" />
          <span className="text-signal">
            {new Date(finalReport.timestamp).toLocaleString()}
          </span>
        </div>
      </motion.article>
    </div>
  );
};
