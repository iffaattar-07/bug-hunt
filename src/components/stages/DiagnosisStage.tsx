'use client';

import React, { useEffect, useState } from 'react';
import { useLab } from '@/context/LabContext';
import { ShieldAlert, Check, X, ArrowRight, FileCode2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { SectionHead, cx, Chip } from '@/components/ui/primitives';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const ease = [0.16, 1, 0.3, 1] as const;

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
        confetti({
          particleCount: 70,
          spread: 65,
          origin: { y: 0.55 },
          colors: ['#E9B949', '#7FB069', '#CBBDA6'],
        });
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
    <div className="mx-auto w-full max-w-[900px] px-4 py-9 sm:px-6">
      <SectionHead
        tone="clue"
        kicker="Stage 2 / 5 — root cause"
        title={
          <>
            What is breaking{' '}
            <span className="text-signal">“{activeChallenge.title}”</span>?
          </>
        }
        desc="Commit to one hypothesis. The lab grades your reasoning immediately and records every attempt against your run."
        right={
          <div className="flex items-center gap-5 border-l border-ink-line pl-5">
            <div>
              <div className="flex items-baseline gap-2 font-mono text-[11px] tracking-[0.08em] text-fg-mute">
                <span>attempts</span>
                <span className="leader w-8" />
                <span className="font-display text-[17px] font-extrabold text-fg tnum">
                  {String(attemptsCount).padStart(2, '0')}
                </span>
              </div>
            </div>
            <button
              onClick={() => setStage('investigate')}
              className="btn-underline relative flex items-center gap-1.5 font-mono text-[11px] tracking-[0.05em] text-fg-dim transition-colors hover:text-signal"
            >
              <FileCode2 className="h-3.5 w-3.5" />
              back to code
            </button>
          </div>
        }
      />

      {/* hypotheses — a ruled register, not a stack of cards */}
      <div className="mt-8 border-t border-ink-line">
        {activeChallenge.diagnoses.map((option, idx) => {
          const isPicked = picked === option.id || selectedDiagnosis?.id === option.id;
          const feedbackHere = diagnosisFeedback?.optionId === option.id;
          const correctPick = selectedDiagnosis?.id === option.id;
          const wrongPick = feedbackHere && !diagnosisFeedback?.isCorrect;

          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                x: shakeId === option.id ? [0, -8, 7, -5, 3, 0] : 0,
              }}
              transition={{
                delay: idx * 0.06,
                duration: shakeId === option.id ? 0.45 : 0.4,
                ease,
              }}
              onClick={() => handleSelect(option.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleSelect(option.id)}
              className={cx(
                'group relative cursor-pointer border-b border-ink-line py-6 pl-14 pr-4 transition-colors duration-200',
                correctPick
                  ? 'bg-pass/[0.05]'
                  : wrongPick
                    ? 'bg-fail/[0.05]'
                    : selectedDiagnosis?.isCorrect
                      ? 'opacity-40'
                      : 'hover:bg-white/[0.02]',
              )}
            >
              {/* state rule */}
              <span
                className={cx(
                  'absolute inset-y-0 left-0 w-[3px] transition-colors duration-200',
                  correctPick
                    ? 'bg-pass'
                    : wrongPick
                      ? 'bg-fail'
                      : 'bg-transparent group-hover:bg-signal/70',
                )}
              />

              {/* confirmation wipes across the committed row */}
              {correctPick && (
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.55, ease }}
                  className="absolute inset-x-0 top-0 h-[2px] origin-left bg-pass"
                />
              )}

              {/* letter in the margin */}
              <span
                className={cx(
                  'absolute left-4 top-6 font-mono text-[15px] font-bold transition-colors duration-200',
                  correctPick
                    ? 'text-pass'
                    : wrongPick
                      ? 'text-fail'
                      : 'text-ink-400 group-hover:text-signal',
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

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-[17px] font-bold leading-tight tracking-[-0.02em] text-fg">
                      {option.title}
                    </h3>
                    {correctPick && <Chip tone="pass">confirmed</Chip>}
                  </div>
                  <p className="mt-2 max-w-[68ch] text-[13.5px] leading-[1.7] text-fg-dim">
                    {option.description}
                  </p>
                </div>

                <span
                  className={cx(
                    'hidden shrink-0 font-mono text-[10px] tracking-[0.08em] transition-opacity sm:block',
                    isPicked ? 'text-fg-mute opacity-100' : 'text-fg-mute opacity-0 group-hover:opacity-60',
                  )}
                >
                  {isPicked ? '· selected' : '· select'}
                </span>
              </div>

              {/* feedback */}
              <AnimatePresence initial={false}>
                {feedbackHere && diagnosisFeedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.32, ease }}
                    className="overflow-hidden"
                  >
                    <div
                      className={cx(
                        'mt-4 border-l-2 py-2 pl-4',
                        diagnosisFeedback.isCorrect ? 'border-pass' : 'border-fail',
                      )}
                    >
                      <div
                        className={cx(
                          'flex items-center gap-2 font-mono text-[11px] tracking-[0.08em]',
                          diagnosisFeedback.isCorrect ? 'text-pass' : 'text-fail',
                        )}
                      >
                        {diagnosisFeedback.isCorrect ? (
                          <>
                            <Check className="h-3.5 w-3.5" /> root cause confirmed
                          </>
                        ) : (
                          <>
                            <X className="h-3.5 w-3.5" /> hypothesis rejected
                          </>
                        )}
                      </div>
                      <p className="mt-1.5 select-text text-[13.5px] leading-[1.7] text-fg-dim">
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
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease }}
            className="crop relative mt-8 border border-ink-line bg-ink-850"
          >
            <div className="hazard h-[5px] w-full" />
            <div className="flex flex-col items-start gap-6 px-6 py-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-pass">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  verdict locked
                </div>
                <h3 className="mt-3 max-w-[24ch] font-display text-[24px] font-extrabold leading-[1.05] tracking-[-0.035em] text-fg">
                  Root cause isolated in {attemptsCount} attempt
                  {attemptsCount === 1 ? '' : 's'}.
                </h3>
                <p className="mt-2 max-w-[54ch] text-[13.5px] leading-[1.7] text-fg-dim">
                  Now weigh the candidate patches and pick the one that fixes the
                  cause — not the symptom.
                </p>
              </div>
              <button onClick={() => setStage('fix')} className="group btn-primary shrink-0">
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
