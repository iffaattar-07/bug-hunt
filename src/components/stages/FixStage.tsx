'use client';

import React from 'react';
import { useLab } from '@/context/LabContext';
import { FileCode2, ArrowRight, GitCompare, Check, TriangleAlert, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { SectionHead, Chip, cx, DiffLine } from '@/components/ui/primitives';

const ease = [0.16, 1, 0.3, 1] as const;

const STACK = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.035, delayChildren: 0.12 } },
};

const LINE = {
  hidden: { opacity: 0, x: -8 },
  shown: { opacity: 1, x: 0, transition: { duration: 0.34, ease } },
};

export const FixStage: React.FC = () => {
  const { activeChallenge, selectedFix, submitFix, setStage } = useLab();
  const reduce = useReducedMotion();

  if (!activeChallenge) return null;

  const diffBlock = (raw: string, sign: '-' | '+') =>
    raw.split('\n').map((l, i) => (
      <motion.div key={i} variants={LINE}>
        <DiffLine sign={sign}>{l}</DiffLine>
      </motion.div>
    ));

  return (
    <div className="mx-auto w-full max-w-[980px] px-4 py-9 sm:px-6">
      <SectionHead
        kicker="Stage 3 / 5 — patch selection"
        title="Pick the fix you would actually ship"
        desc="Each candidate touches the same file. One resolves the root cause; the others merely quiet the symptom."
        right={
          <Chip tone="signal">
            <GitCompare className="h-3 w-3" />
            {activeChallenge.fixes.length} candidates
          </Chip>
        }
      />

      <div className="mt-8 border-t border-ink-line">
        {activeChallenge.fixes.map((fix, idx) => {
          const isSelected = selectedFix?.id === fix.id;
          const solved = isSelected && fix.isCorrect;

          return (
            <motion.article
              key={fix.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.45, ease }}
              onClick={() => submitFix(fix.id)}
              className={cx(
                'group relative cursor-pointer border-b border-ink-line transition-colors duration-200',
                isSelected ? 'bg-white/[0.022]' : 'hover:bg-white/[0.014]',
              )}
            >
              <span
                className={cx(
                  'absolute inset-y-0 left-0 w-[3px] transition-colors duration-200',
                  isSelected
                    ? solved
                      ? 'bg-pass'
                      : 'bg-signal'
                    : 'bg-transparent group-hover:bg-signal/60',
                )}
              />

              {/* header */}
              <div className="flex items-start gap-4 px-4 pb-5 pt-6 sm:px-6">
                <span
                  className={cx(
                    'mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full border transition-all duration-200',
                    isSelected
                      ? solved
                        ? 'border-pass bg-pass'
                        : 'border-signal bg-signal'
                      : 'border-ink-400 group-hover:border-signal',
                  )}
                >
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 520, damping: 30 }}
                      className="grid h-1.5 w-1.5 place-items-center rounded-full bg-ink-950"
                    />
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[11px] font-bold tracking-[0.1em] text-fg-mute">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-mono text-[11.5px] text-trace">{fix.targetFile}</span>
                    {solved && <Chip tone="pass">recommended</Chip>}
                  </div>
                  <h3 className="mt-2 font-display text-[19px] font-bold leading-tight tracking-[-0.025em] text-fg">
                    {fix.title}
                  </h3>
                  <p className="mt-2 max-w-[70ch] text-[13.5px] leading-[1.7] text-fg-dim">
                    {fix.description}
                  </p>
                </div>
              </div>

              {/* diff */}
              <div className="border-y border-ink-line bg-ink-950 px-4 py-4 sm:px-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.06em] text-fg-mute">
                    <FileCode2 className="h-3.5 w-3.5 text-trace" />
                    diff
                  </span>
                  <span className="flex items-center gap-3 font-mono text-[11px] font-medium tnum">
                    <span className="text-fail">−{fix.diffBefore.split('\n').length}</span>
                    <span className="text-pass">+{fix.diffAfter.split('\n').length}</span>
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="border border-fail/25 bg-fail/[0.04]">
                    <div className="flex items-center justify-between border-b border-fail/20 px-3 py-1.5 font-mono text-[10px] tracking-[0.08em] text-fail">
                      <span>before</span>
                      <span className="opacity-70">{fix.targetFile}</span>
                    </div>
                    <motion.div
                      initial={reduce ? 'shown' : 'hidden'}
                      animate="shown"
                      variants={STACK}
                      className="overflow-x-auto p-1.5"
                    >
                      {diffBlock(fix.diffBefore, '-')}
                    </motion.div>
                  </div>

                  <div className="border border-pass/25 bg-pass/[0.04]">
                    <div className="flex items-center justify-between border-b border-pass/20 px-3 py-1.5 font-mono text-[10px] tracking-[0.08em] text-pass">
                      <span>after</span>
                      <span className="opacity-70">{fix.targetFile}</span>
                    </div>
                    <motion.div
                      initial={reduce ? 'shown' : 'hidden'}
                      animate="shown"
                      variants={STACK}
                      className="overflow-x-auto p-1.5"
                    >
                      {diffBlock(fix.diffAfter, '+')}
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* rationale */}
              <AnimatePresence initial={false}>
                {isSelected && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.34, ease }}
                    className="overflow-hidden"
                  >
                    <div
                      className={cx(
                        'border-l-2 px-4 py-4 sm:px-6',
                        fix.isCorrect ? 'border-pass bg-pass/[0.04]' : 'border-signal bg-signal/[0.04]',
                      )}
                    >
                      <div
                        className={cx(
                          'flex items-center gap-2 font-mono text-[11px] tracking-[0.08em]',
                          fix.isCorrect ? 'text-pass' : 'text-signal',
                        )}
                      >
                        {fix.isCorrect ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" /> ship it
                          </>
                        ) : (
                          <>
                            <TriangleAlert className="h-3.5 w-3.5" /> symptom patch
                          </>
                        )}
                      </div>
                      <p className="mt-2 select-text max-w-[72ch] text-[13.5px] leading-[1.7] text-fg-dim">
                        {fix.explanation}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedFix && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease }}
            className="crop relative mt-8 border border-ink-line bg-ink-850"
          >
            <div className="hazard h-[5px] w-full" />
            <div className="flex flex-col items-start gap-6 px-6 py-7 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-signal">
                  <Check className="h-3.5 w-3.5" />
                  patch staged
                </div>
                <h3 className="mt-3 max-w-[26ch] font-display text-[22px] font-extrabold leading-[1.05] tracking-[-0.035em] text-fg">
                  {selectedFix.title}
                </h3>
                <p className="mt-2 max-w-[54ch] text-[13.5px] leading-[1.7] text-fg-dim">
                  Run the regression suite to confirm the patch holds under load.
                </p>
              </div>
              <button onClick={() => setStage('verify')} className="group btn-primary shrink-0">
                <span>Proceed to verification</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
