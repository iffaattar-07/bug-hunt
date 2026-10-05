'use client';

import React, { useEffect, useState } from 'react';
import { useLab } from '@/context/LabContext';
import {
  FlaskConical,
  Play,
  Check,
  ArrowRight,
  Terminal,
  ShieldCheck,
  Timer,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { SectionHead, Chip, cx, Counter } from '@/components/ui/primitives';

export const VerificationStage: React.FC = () => {
  const {
    activeChallenge,
    selectedFix,
    testCases,
    testRunnerState,
    runVerification,
    setStage,
  } = useLab();
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (testRunnerState === 'completed') {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 900);
      try {
        confetti({
          particleCount: 110,
          spread: 78,
          origin: { y: 0.6 },
          colors: ['#FFC53D', '#54D67C', '#5AC8E8', '#FF5CA8'],
        });
      } catch {
        /* noop */
      }
      return () => clearTimeout(t);
    }
  }, [testRunnerState]);

  if (!activeChallenge || !selectedFix) return null;

  const passed = testCases.filter((t) => t.status === 'passed').length;
  const total = testCases.length;
  const done = testRunnerState === 'completed';
  const pct = total ? (passed / total) * 100 : 0;

  return (
    <div className="mx-auto w-full max-w-[860px] px-4 py-9 sm:px-6">
      <SectionHead
        tone="pass"
        kicker="Stage 4 / 5 — Verification"
        title="Regression suite"
        desc={`Firing ${total} specs against your staged patch on ${activeChallenge.slug}. Every spec must go green before the case closes.`}
        right={
          <Chip tone={done ? 'pass' : 'neutral'}>
            {done ? <Check className="h-3 w-3" /> : <FlaskConical className="h-3 w-3" />}
            {testRunnerState}
          </Chip>
        }
      />

      <motion.div
        animate={flash ? { boxShadow: '0 0 0 1px rgba(84,214,124,0.6), 0 24px 60px -30px rgba(84,214,124,0.7)' } : {}}
        transition={{ duration: 0.4 }}
        className="panel mt-7 overflow-hidden"
      >
        {/* control bar */}
        <div className="flex flex-col gap-4 border-b border-ink-line bg-ink-700 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-fg-mute">
              <Terminal className="h-3.5 w-3.5 text-trace" />
              Test target
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
              <h2 className="font-display text-[17px] font-bold tracking-tight text-fg">
                {activeChallenge.slug}.test
              </h2>
              <span className="rounded-[4px] border border-ink-edge bg-ink-900 px-2 py-[2px] font-mono text-[10px] text-signal">
                {selectedFix.targetFile}
              </span>
            </div>
          </div>

          <button
            onClick={runVerification}
            disabled={testRunnerState === 'running'}
            className={cx(
              'btn shrink-0 rounded-[5px] px-6 py-3.5',
              testRunnerState === 'running'
                ? 'cursor-wait border border-ink-edge bg-ink-600 text-fg-mute'
                : 'group btn-primary btn-sweep',
            )}
          >
            {testRunnerState === 'running' ? (
              <>
                <FlaskConical className="h-4 w-4 animate-spin" />
                Executing…
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                {done ? 'Re-run suite' : 'Run verification'}
              </>
            )}
          </button>
        </div>

        {/* progress */}
        <div className="border-b border-ink-line bg-ink-800 px-5 py-4">
          <div className="mb-2.5 flex items-end justify-between font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
            <span className={done ? 'text-pass' : 'text-fg-mute'}>
              {testRunnerState === 'running'
                ? 'Executing specs…'
                : done
                  ? 'Suite passed'
                  : 'Awaiting run'}
            </span>
            <span className="font-display text-[22px] leading-none tracking-tight tnum text-fg">
              <Counter to={passed} />
              <span className="text-fg-mute">/{total}</span>
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full border border-ink-line bg-ink-950 p-[2px]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-pass/70 via-pass to-pass"
              initial={{ width: '0%' }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-fg-mute">
            <span>pass threshold 100%</span>
            <span className="text-pass tnum">{Math.round(pct)}%</span>
          </div>
        </div>

        {/* specs */}
        <div className="space-y-2 bg-ink-950 p-4">
          {testCases.map((tc, idx) => (
            <motion.div
              key={tc.id}
              layout
              animate={
                tc.status === 'failed'
                  ? { x: [0, -8, 8, -5, 0] }
                  : { x: 0 }
              }
              className={cx(
                'flex items-center justify-between gap-4 rounded-[5px] border px-3.5 py-3 transition-colors duration-300',
                tc.status === 'passed'
                  ? 'border-pass/35 bg-pass/[0.08]'
                  : tc.status === 'running'
                    ? 'border-signal/50 bg-signal/[0.08]'
                    : 'border-ink-line bg-ink-800',
              )}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={cx(
                    'grid h-7 w-7 shrink-0 place-items-center rounded-[5px] border font-mono text-[11px] font-bold tnum',
                    tc.status === 'passed'
                      ? 'border-pass bg-pass text-ink-950'
                      : tc.status === 'running'
                        ? 'border-signal bg-signal text-ink-950'
                        : 'border-ink-edge bg-ink-700 text-fg-mute',
                  )}
                >
                  {tc.status === 'passed' ? (
                    <Check className="h-4 w-4" />
                  ) : tc.status === 'running' ? (
                    <FlaskConical className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    String(idx + 1).padStart(2, '0')
                  )}
                </span>

                <div className="min-w-0">
                  <div className="truncate font-mono text-[12px] font-semibold text-fg">
                    {tc.name}
                  </div>
                  <div className="truncate text-[11.5px] text-fg-mute">{tc.description}</div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {tc.status === 'passed' && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="shrink-0 font-mono text-[11px] font-bold text-pass tnum"
                  >
                    ✓ {tc.durationMs}ms
                  </motion.span>
                )}
                {tc.status === 'running' && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="shrink-0 font-mono text-[9.5px] font-bold uppercase tracking-[0.16em] text-signal"
                  >
                    running
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-ink-line bg-ink-700/60 px-5 py-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-fg-mute">
          <span className="flex items-center gap-1.5">
            <Timer className="h-3 w-3" />
            exit code {done ? '0' : '—'}
          </span>
          <span className={done ? 'text-pass' : 'text-fg-mute'}>
            {passed} passed · {total - passed} pending
          </span>
        </div>
      </motion.div>

      {/* success */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 22, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-6 overflow-hidden rounded-lg border border-pass/45 bg-ink-800 shadow-panel"
          >
            <div className="h-[7px] w-full hazard" />
            <div className="flex flex-col items-center gap-5 px-6 py-8 text-center">
              <motion.span
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 240, damping: 14, delay: 0.15 }}
                className="grid h-14 w-14 place-items-center rounded-full border-2 border-pass/50 bg-pass/15 text-pass"
              >
                <ShieldCheck className="h-7 w-7" />
              </motion.span>

              <div>
                <h3 className="font-display text-[24px] font-bold tracking-tight text-fg">
                  All {total} specs green
                </h3>
                <p className="mx-auto mt-2 max-w-[46ch] text-[13.5px] leading-relaxed text-fg-dim">
                  The patch holds. Nothing regressed. Time to write up what broke
                  and why it will not happen again.
                </p>
              </div>

              <button onClick={() => setStage('report')} className="group btn-primary btn-sweep">
                <span>Generate report</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
