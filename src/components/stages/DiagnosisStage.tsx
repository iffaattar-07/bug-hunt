'use client';

import React, { useEffect, useState } from 'react';
import { useLab } from '@/context/LabContext';
import { ShieldAlert, Check, X, ArrowRight, FileCode2, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { SectionHead, cx, Chip } from '@/components/ui/primitives';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export const DiagnosisStage: React.FC = () => {
  const {
    activeChallenge,
    submitDiagnosis,
    diagnosisFeedback,
    selectedDiagnosis,
    attemptsCount,
    setStage,
  } = useLab();

  const [picked, setPicked] = useState<string | null>(null);
  const [shakeId, setShakeId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedDiagnosis?.isCorrect) {
      try {
        confetti({ particleCount: 90, spread: 72, origin: { y: 0.55 }, colors: ['#FFC53D', '#54D67C', '#5AC8E8'] });
      } catch {
        /* noop */
      }
    }
  }, [selectedDiagnosis]);

  if (!activeChallenge) return null;

  const handleSelect = (id: string) => {
    if (selectedDiagnosis?.isCorrect) return;
    setPicked(id);
    const ok = submitDiagnosis(id);
    if (!ok) {
      setShakeId(id);
      setTimeout(() => setShakeId(null), 600);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[880px] px-4 py-9 sm:px-6">
      <SectionHead
        tone="clue"
        kicker="Stage 2 / 5 — Root cause"
        title={
          <>
            What is breaking{' '}
            <span className="text-signal">“{activeChallenge.title}”</span>?
          </>
        }
        desc="Commit to one hypothesis. The lab grades your reasoning immediately and records every attempt against your run."
        right={
          <div className="flex items-center gap-3 rounded-[5px] border border-ink-line bg-ink-800 px-4 py-3">
            <HelpCircle className="h-4 w-4 text-signal" />
            <div>
              <div className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-fg-mute">
                Attempts
              </div>
              <div className="mt-0.5 font-display text-lg font-bold leading-none text-signal tnum">
                {String(attemptsCount).padStart(2, '0')}
              </div>
            </div>
            <span className="h-8 w-px bg-ink-line" />
            <button
              onClick={() => setStage('investigate')}
              className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-trace transition-colors hover:text-signal"
            >
              <FileCode2 className="h-3.5 w-3.5" />
              Back to code
            </button>
          </div>
        }
      />

      <div className="mt-7 space-y-3">
        {activeChallenge.diagnoses.map((option, idx) => {
          const isPicked = picked === option.id || selectedDiagnosis?.id === option.id;
          const feedbackHere = diagnosisFeedback?.optionId === option.id;
          const correctPick = selectedDiagnosis?.id === option.id;
          const wrongPick = feedbackHere && !diagnosisFeedback?.isCorrect;

          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{
                opacity: 1,
                y: 0,
                x: shakeId === option.id ? [0, -10, 9, -6, 4, 0] : 0,
              }}
              transition={{
                delay: idx * 0.07,
                duration: shakeId === option.id ? 0.5 : 0.45,
                ease: [0.16, 1, 0.3, 1],
              }}
              onClick={() => handleSelect(option.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleSelect(option.id)}
              className={cx(
                'group relative cursor-pointer overflow-hidden rounded-lg border bg-ink-800 p-5 shadow-panel transition-all duration-300',
                correctPick
                  ? 'border-pass/60 ring-1 ring-pass/25'
                  : wrongPick
                    ? 'border-fail/60'
                    : selectedDiagnosis?.isCorrect
                      ? 'border-ink-line opacity-50'
                      : 'border-ink-line hover:-translate-y-0.5 hover:border-signal/45 hover:shadow-lift',
              )}
            >
              {/* left state bar */}
              <span
                className={cx(
                  'absolute inset-y-0 left-0 w-[3px] transition-colors',
                  correctPick ? 'bg-pass' : wrongPick ? 'bg-fail' : 'bg-transparent group-hover:bg-signal/60',
                )}
              />

              <div className="flex items-start gap-4">
                {/* letter marker */}
                <span
                  className={cx(
                    'grid h-9 w-9 shrink-0 place-items-center rounded-[6px] border font-display text-[13px] font-bold transition-all duration-300',
                    correctPick
                      ? 'border-pass bg-pass text-ink-950'
                      : wrongPick
                        ? 'border-fail bg-fail text-ink-950'
                        : 'border-ink-edge bg-ink-700 text-fg-dim group-hover:border-signal/50 group-hover:text-signal',
                  )}
                >
                  {correctPick ? (
                    <Check className="h-4 w-4" />
                  ) : wrongPick ? (
                    <X className="h-4 w-4" />
                  ) : (
                    LETTERS[idx]
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-display text-[16px] font-semibold leading-tight tracking-tight text-fg">
                      {option.title}
                    </h3>
                    {correctPick && <Chip tone="pass">Confirmed</Chip>}
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-fg-dim">
                    {option.description}
                  </p>
                </div>

                <span
                  className={cx(
                    'hidden shrink-0 font-mono text-[9px] font-bold uppercase tracking-[0.16em] transition-opacity sm:block',
                    isPicked ? 'opacity-100 text-fg-mute' : 'opacity-0 group-hover:opacity-60 text-fg-mute',
                  )}
                >
                  {isPicked ? 'selected' : 'select'}
                </span>
              </div>

              {/* feedback */}
              <AnimatePresence initial={false}>
                {feedbackHere && diagnosisFeedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div
                      className={cx(
                        'mt-4 rounded-[5px] border p-3.5',
                        diagnosisFeedback.isCorrect
                          ? 'border-pass/35 bg-pass/10'
                          : 'border-fail/35 bg-fail/10',
                      )}
                    >
                      <div
                        className={cx(
                          'mb-1.5 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em]',
                          diagnosisFeedback.isCorrect ? 'text-pass' : 'text-fail',
                        )}
                      >
                        {diagnosisFeedback.isCorrect ? (
                          <>
                            <Check className="h-3.5 w-3.5" /> Root cause confirmed
                          </>
                        ) : (
                          <>
                            <X className="h-3.5 w-3.5" /> Hypothesis rejected
                          </>
                        )}
                      </div>
                      <p className="select-text text-[13px] leading-relaxed text-fg-dim">
                        {diagnosisFeedback.message}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* proceed */}
      <AnimatePresence>
        {selectedDiagnosis?.isCorrect && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 overflow-hidden rounded-lg border border-pass/40 bg-ink-800 shadow-panel"
          >
            <div className="h-[6px] w-full hazard" />
            <div className="flex flex-col items-start gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-pass">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Verdict locked
                </div>
                <h3 className="mt-2 font-display text-[20px] font-bold tracking-tight text-fg">
                  Root cause isolated in {attemptsCount} attempt
                  {attemptsCount === 1 ? '' : 's'}.
                </h3>
                <p className="mt-1.5 max-w-[52ch] text-[13px] leading-relaxed text-fg-dim">
                  Now weigh the candidate patches and pick the one that fixes the
                  cause — not the symptom.
                </p>
              </div>
              <button onClick={() => setStage('fix')} className="group btn-primary btn-sweep shrink-0">
                <span>Choose the fix</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
