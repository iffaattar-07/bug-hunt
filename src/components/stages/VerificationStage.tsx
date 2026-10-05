'use client';

import React, { useEffect, useState } from 'react';
import { useLab } from '@/context/LabContext';
import {
  FlaskConical,
  Play,
  Check,
  ArrowRight,
  Terminal,
  Timer,
  Bug,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { SectionHead, Chip, cx, Counter, Stamp } from '@/components/ui/primitives';

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * The signature beat: a bug scurries across the completed panel, gets
 * flattened on arrival and leaves an impact ring behind.
 */
const BugSquash: React.FC = () => {
  const [phase, setPhase] = useState<'run' | 'squash' | 'gone'>('run');
  const reduce = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      <motion.div
        className="absolute top-1/2 -mt-5 text-fail"
        initial={{ left: '-6%', opacity: 0 }}
        animate={
          phase === 'run'
            ? { left: '50%', opacity: 1, scaleY: 1, scaleX: 1 }
            : phase === 'squash'
              ? { left: '50%', opacity: 1, scaleY: 0.08, scaleX: 1.8, y: 8 }
              : { left: '50%', opacity: 0, scaleY: 0.08, scaleX: 1.8, y: 8 }
        }
        transition={
          phase === 'run'
            ? { left: { duration: 0.85, ease: 'linear' }, opacity: { duration: 0.15 } }
            : { duration: 0.14, ease: [0.4, 0, 1, 1] }
        }
        onAnimationComplete={() => {
          setPhase((p) => (p === 'run' ? 'squash' : p === 'squash' ? 'gone' : p));
        }}
      >
        <motion.span
          animate={reduce ? undefined : { rotate: [12, -12, 12, -12], y: [0, -3, 0, -3] }}
          transition={{ duration: 0.16, repeat: Infinity, ease: 'easeInOut' }}
          className="block"
        >
          <Bug className="h-6 w-6" />
        </motion.span>
      </motion.div>

      {/* impact ring */}
      <AnimatePresence>
        {phase === 'squash' && (
          <motion.span
            className="absolute top-1/2 -mt-6 h-12 w-12 rounded-full border-2 border-signal"
            initial={{ left: '50%', x: '-50%', scale: 0.2, opacity: 0.9 }}
            animate={{ scale: 2.6, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

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
  const reduce = useReducedMotion();

  useEffect(() => {
    if (testRunnerState === 'completed') {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 900);
      /* confetti waits for the squash to land */
      const c = setTimeout(
        () => {
          try {
            confetti({
              particleCount: 90,
              spread: 72,
              origin: { y: 0.62 },
              colors: ['#E9B949', '#7FB069', '#CBBDA6'],
            });
          } catch {
            /* noop */
          }
        },
        reduce ? 0 : 1050,
      );
      return () => {
        clearTimeout(t);
        clearTimeout(c);
      };
    }
  }, [testRunnerState, reduce]);

  if (!activeChallenge || !selectedFix) return null;

  const passed = testCases.filter((t) => t.status === 'passed').length;
  const total = testCases.length;
  const done = testRunnerState === 'completed';
  const pct = total ? (passed / total) * 100 : 0;

  return (
    <div className="mx-auto w-full max-w-[880px] px-4 py-9 sm:px-6">
      <SectionHead
        tone="pass"
        kicker="Stage 4 / 5 — verification"
        title="Regression suite"
        desc={`Firing ${total} specs against your staged patch on ${activeChallenge.slug}. Every spec must go green before the case closes.`}
        right={
          <Chip tone={done ? 'pass' : 'neutral'}>
            {done ? <Check className="h-3 w-3" /> : <FlaskConical className="h-3 w-3" />}
            {testRunnerState}
          </Chip>
        }
      />

      <div className="relative mt-8 border border-ink-line bg-ink-850">
        {/* completion rule wipes across the top */}
        <motion.span
          className="absolute inset-x-0 top-0 z-10 h-[2px] origin-left bg-pass"
          initial={false}
          animate={{ scaleX: flash ? 1 : 0 }}
          transition={{ duration: 0.5, ease }}
        />

        {/* control bar */}
        <div className="flex flex-col gap-4 border-b border-ink-line px-5 py-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.06em] text-fg-mute">
              <Terminal className="h-3.5 w-3.5 text-trace" />
              test target
            </div>
            <div className="mt-2 flex flex-wrap items-baseline gap-3">
              <h2 className="font-display text-[19px] font-extrabold tracking-[-0.03em] text-fg">
                {activeChallenge.slug}.test
              </h2>
              <span className="font-mono text-[11.5px] text-trace">
                {selectedFix.targetFile}
              </span>
            </div>
          </div>

          <button
            onClick={runVerification}
            disabled={testRunnerState === 'running'}
            className={cx(
              'btn shrink-0 px-6 py-3.5',
              testRunnerState === 'running'
                ? 'cursor-wait border border-ink-edge bg-transparent text-fg-mute'
                : 'btn-primary',
            )}
          >
            {testRunnerState === 'running' ? (
              <>
                <FlaskConical className="h-4 w-4 animate-spin" />
                executing…
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                {done ? 're-run suite' : 'run verification'}
              </>
            )}
          </button>
        </div>

        {/* progress */}
        <div className="border-b border-ink-line px-5 py-5">
          <div className="mb-3 flex items-end justify-between">
            <span className="font-mono text-[11px] tracking-[0.08em] text-fg-mute">
              {testRunnerState === 'running'
                ? 'executing specs…'
                : done
                  ? 'suite passed'
                  : 'awaiting run'}
            </span>
            <span className="font-display text-[30px] font-extrabold leading-none tracking-[-0.04em] text-fg">
              <Counter to={passed} />
              <span className="text-fg-mute">/{total}</span>
            </span>
          </div>

          {/* segmented progress — reads as a meter, not a gradient */}
          <div className="flex h-2 w-full gap-[3px] overflow-hidden">
            {Array.from({ length: Math.max(total, 1) }).map((_, i) => (
              <motion.span
                key={i}
                animate={{
                  scaleY: i < passed ? 1 : 0.55,
                  opacity: i < passed ? 1 : 0.75,
                }}
                transition={{ duration: 0.4, ease, delay: i < passed ? 0.04 : 0 }}
                className={cx(
                  'h-full flex-1 origin-bottom',
                  i < passed ? 'bg-pass' : 'bg-ink-600',
                )}
              />
            ))}
          </div>

          <div className="mt-3 flex items-baseline gap-2 font-mono text-[10.5px] tracking-[0.06em] text-fg-mute">
            <span>pass threshold</span>
            <span className="leader" />
            <span className="text-pass tnum">{Math.round(pct)}%</span>
          </div>
        </div>

        {/* specs */}
        <div className="relative divide-y divide-ink-line bg-ink-950">
          {testRunnerState === 'running' && !reduce && (
            <span
              aria-hidden
              className="animate-sweep-y pointer-events-none absolute inset-x-0 z-10 h-px bg-gradient-to-r from-transparent via-signal to-transparent"
            />
          )}
          {testCases.map((tc, idx) => (
            <motion.div
              key={tc.id}
              layout
              animate={tc.status === 'failed' ? { x: [0, -6, 6, -4, 0] } : { x: 0 }}
              className={cx(
                'flex items-center justify-between gap-4 px-5 py-3.5 transition-colors duration-200',
                tc.status === 'passed'
                  ? 'bg-pass/[0.05]'
                  : tc.status === 'running'
                    ? 'bg-signal/[0.05]'
                    : '',
              )}
            >
              <div className="flex min-w-0 items-center gap-4">
                <span
                  className={cx(
                    'w-6 shrink-0 font-mono text-[11px] font-bold tnum',
                    tc.status === 'passed'
                      ? 'text-pass'
                      : tc.status === 'running'
                        ? 'text-signal'
                        : 'text-fg-mute',
                  )}
                >
                  {tc.status === 'passed' ? (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 520, damping: 18 }}
                      className="inline-flex"
                    >
                      <Check className="h-4 w-4" />
                    </motion.span>
                  ) : tc.status === 'running' ? (
                    <FlaskConical className="h-4 w-4 animate-spin" />
                  ) : (
                    String(idx + 1).padStart(2, '0')
                  )}
                </span>

                <div className="min-w-0">
                  <div className="truncate font-mono text-[12.5px] text-fg">{tc.name}</div>
                  <div className="truncate text-[12px] text-fg-mute">{tc.description}</div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {tc.status === 'passed' && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="shrink-0 font-mono text-[11px] text-pass tnum"
                  >
                    ✓ {tc.durationMs}ms
                  </motion.span>
                )}
                {tc.status === 'running' && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="shrink-0 font-mono text-[10.5px] tracking-[0.08em] text-signal"
                  >
                    running
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="flex items-baseline gap-2 border-t border-ink-line px-5 py-3 font-mono text-[10.5px] tracking-[0.06em] text-fg-mute">
          <span className="flex items-center gap-1.5">
            <Timer className="h-3 w-3" />
            exit code {done ? '0' : '—'}
          </span>
          <span className="leader" />
          <span className={done ? 'text-pass' : ''}>
            {passed} passed · {total - passed} pending
          </span>
        </div>
      </div>

      {/* success */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="crop relative mt-8 border border-ink-line bg-ink-850"
          >
            <div className="hazard h-[5px] w-full" />
            <div className="relative flex flex-col items-center gap-6 px-6 py-10 text-center">
              {!reduce && <BugSquash />}
              <Stamp text="verified" tone="pass" className="left-6 top-7 sm:left-10" />

              <div className="mt-4">
                <h3 className="font-display text-[30px] font-extrabold leading-none tracking-[-0.04em] text-fg">
                  All {total} specs green
                </h3>
                <p className="mx-auto mt-3 max-w-[48ch] text-[14px] leading-[1.7] text-fg-dim">
                  The patch holds. Nothing regressed. Time to write up what broke
                  and why it will not happen again.
                </p>
              </div>

              <button onClick={() => setStage('report')} className="group btn-primary">
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
