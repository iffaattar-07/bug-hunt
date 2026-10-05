'use client';

import React from 'react';
import { useLab } from '@/context/LabContext';
import { FileCode2, ArrowRight, GitCompare, Check, TriangleAlert, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHead, Chip, cx, DiffLine } from '@/components/ui/primitives';

export const FixStage: React.FC = () => {
  const { activeChallenge, selectedFix, submitFix, setStage } = useLab();

  if (!activeChallenge) return null;

  const diffBlock = (raw: string, sign: '-' | '+') =>
    raw.split('\n').map((l, i) => (
      <DiffLine key={i} sign={sign}>
        {l}
      </DiffLine>
    ));

  return (
    <div className="mx-auto w-full max-w-[980px] px-4 py-9 sm:px-6">
      <SectionHead
        tone="signal"
        kicker="Stage 3 / 5 — Patch selection"
        title="Pick the fix you would actually ship"
        desc="Each candidate touches the same file. One resolves the root cause; the others merely quiet the symptom."
        right={
          <Chip tone="signal">
            <GitCompare className="h-3 w-3" />
            {activeChallenge.fixes.length} candidates
          </Chip>
        }
      />

      <div className="mt-7 space-y-4">
        {activeChallenge.fixes.map((fix, idx) => {
          const isSelected = selectedFix?.id === fix.id;
          const solved = isSelected && fix.isCorrect;

          return (
            <motion.article
              key={fix.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.09, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => submitFix(fix.id)}
              className={cx(
                'group relative cursor-pointer overflow-hidden rounded-lg border bg-ink-800 shadow-panel transition-all duration-300',
                isSelected
                  ? solved
                    ? 'border-pass/60 ring-1 ring-pass/20'
                    : 'border-signal/60 ring-1 ring-signal/20'
                  : 'border-ink-line hover:-translate-y-1 hover:border-signal/40 hover:shadow-lift',
              )}
            >
              {/* header */}
              <div className="flex items-start gap-4 border-b border-ink-line bg-ink-700 p-4 sm:p-5">
                <span
                  className={cx(
                    'mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-all duration-300',
                    isSelected
                      ? solved
                        ? 'border-pass bg-pass'
                        : 'border-signal bg-signal'
                      : 'border-ink-400 group-hover:border-signal/70',
                  )}
                >
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                      className="grid h-2.5 w-2.5 place-items-center rounded-full bg-ink-950"
                    />
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-[4px] border border-ink-edge bg-ink-900 px-2 py-[2px] font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-fg-mute">
                      Option {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-mono text-[11px] text-trace">{fix.targetFile}</span>
                    {solved && <Chip tone="pass">Recommended</Chip>}
                  </div>
                  <h3 className="mt-2 font-display text-[18px] font-bold leading-tight tracking-tight text-fg">
                    {fix.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-fg-dim">
                    {fix.description}
                  </p>
                </div>
              </div>

              {/* diff */}
              <div className="bg-ink-950 p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-fg-mute">
                    <FileCode2 className="h-3.5 w-3.5 text-trace" />
                    Diff
                  </span>
                  <span className="flex items-center gap-3 font-mono text-[10px] font-bold tnum">
                    <span className="text-fail">−{fix.diffBefore.split('\n').length}</span>
                    <span className="text-pass">+{fix.diffAfter.split('\n').length}</span>
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="space-y-px overflow-x-auto rounded-[5px] border border-fail/25 bg-fail/[0.06] p-1.5">
                    <div className="mb-1 flex items-center gap-1.5 px-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-fail">
                      Before
                    </div>
                    {diffBlock(fix.diffBefore, '-')}
                  </div>

                  <div className="space-y-px overflow-x-auto rounded-[5px] border border-pass/25 bg-pass/[0.06] p-1.5">
                    <div className="mb-1 flex items-center gap-1.5 px-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-pass">
                      After
                    </div>
                    {diffBlock(fix.diffAfter, '+')}
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
                    transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div
                      className={cx(
                        'border-t p-4 sm:p-5',
                        fix.isCorrect
                          ? 'border-pass/30 bg-pass/[0.07]'
                          : 'border-signal/30 bg-signal/[0.07]',
                      )}
                    >
                      <div
                        className={cx(
                          'mb-1.5 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em]',
                          fix.isCorrect ? 'text-pass' : 'text-signal',
                        )}
                      >
                        {fix.isCorrect ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" /> Ship it
                          </>
                        ) : (
                          <>
                            <TriangleAlert className="h-3.5 w-3.5" /> Symptom patch
                          </>
                        )}
                      </div>
                      <p className="select-text text-[13px] leading-relaxed text-fg-dim">
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
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 overflow-hidden rounded-lg border border-ink-edge bg-ink-800 shadow-panel"
          >
            <div className="h-[6px] w-full hazard" />
            <div className="flex flex-col items-start gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-signal">
                  <Check className="h-3.5 w-3.5" />
                  Patch staged
                </div>
                <h3 className="mt-2 truncate font-display text-[19px] font-bold tracking-tight text-fg">
                  {selectedFix.title}
                </h3>
                <p className="mt-1.5 max-w-[54ch] text-[13px] leading-relaxed text-fg-dim">
                  Run the regression suite to confirm the patch holds under load.
                </p>
              </div>
              <button onClick={() => setStage('verify')} className="group btn-primary btn-sweep shrink-0">
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
