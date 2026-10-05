'use client';

import React, { useState } from 'react';
import { useLab } from '@/context/LabContext';
import { getAllChallenges } from '@/data/challenges';
import { Difficulty } from '@/types/challenge';
import { ArrowRight, Code2, Timer, Check, FolderOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chip, Segmented, SectionHead, cx, Meter } from '@/components/ui/primitives';

const RISK: Record<Difficulty, { bars: number; tone: 'pass' | 'signal' | 'fail'; label: string }> = {
  easy: { bars: 1, tone: 'pass', label: 'Low risk' },
  medium: { bars: 2, tone: 'signal', label: 'Elevated' },
  hard: { bars: 3, tone: 'fail', label: 'Critical' },
};

const toneCls = {
  pass: 'text-pass border-pass/40 bg-pass/10',
  signal: 'text-signal border-signal/40 bg-signal/10',
  fail: 'text-fail border-fail/40 bg-fail/10',
} as const;

export const ChallengeSelection: React.FC = () => {
  const { selectChallenge, completedChallengeIds } = useLab();
  const [filter, setFilter] = useState('all');
  const challenges = getAllChallenges();

  const filtered = challenges.filter((c) => filter === 'all' || c.difficulty === filter);
  const cleared = challenges.filter((c) => completedChallengeIds.includes(c.id)).length;

  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 py-10 sm:px-6">
      <SectionHead
        kicker="Case files"
        title="Choose your incident"
        desc="Four real-world failures, graded by blast radius. Cleared cases stay stamped until you reopen them."
        right={
          <div className="flex flex-col items-start gap-3 md:items-end">
            <div className="flex items-center gap-3 rounded-[5px] border border-ink-line bg-ink-800 px-3.5 py-2.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-fg-mute">
                Clearance
              </span>
              <span className="font-display text-lg font-bold leading-none text-signal tnum">
                {cleared}
                <span className="text-fg-mute">/{challenges.length}</span>
              </span>
              <div className="h-4 w-[68px]">
                <Meter
                  value={cleared}
                  max={challenges.length}
                  segments={4}
                  tone="pass"
                  className="h-full"
                />
              </div>
            </div>

            <Segmented
              id="difficulty"
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'all', label: 'All' },
                { value: 'easy', label: 'Easy' },
                { value: 'medium', label: 'Med' },
                { value: 'hard', label: 'Hard' },
              ]}
            />
          </div>
        }
      />

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((ch, idx) => {
            const isCompleted = completedChallengeIds.includes(ch.id);
            const risk = RISK[ch.difficulty];

            return (
              <motion.article
                key={ch.id}
                layout
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: idx * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className={cx(
                  'group relative flex flex-col overflow-hidden rounded-lg border bg-ink-800 shadow-panel transition-all duration-300',
                  isCompleted
                    ? 'border-pass/30'
                    : 'border-ink-line hover:-translate-y-1.5 hover:border-signal/45 hover:shadow-lift',
                )}
              >
                {/* hazard header rail, colour-coded by risk */}
                <span
                  className={cx(
                    'absolute inset-x-0 top-0 z-10 h-[5px]',
                    isCompleted ? 'bg-pass' : risk.bars === 1 ? 'bg-pass' : risk.bars === 2 ? 'bg-signal' : 'bg-fail',
                  )}
                />
                {/* sweep on hover */}
                <span className="pointer-events-none absolute inset-0 overflow-hidden">
                  <span className="absolute -left-1/3 top-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.045] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:animate-sweep" />
                </span>

                <div className="relative flex flex-1 flex-col p-5 pt-6">
                  {isCompleted && (
                    <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center">
                      <div
                        className="stamp rounded border-pass/70 text-pass"
                        style={{ opacity: 0.4, transform: 'rotate(-14deg)' }}
                      >
                        <span className="px-4 py-2 text-[13px]">Cleared</span>
                      </div>
                    </div>
                  )}

                  {/* risk row */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cx(
                        'rounded border px-2 py-[3px] font-mono text-[9px] font-bold uppercase tracking-[0.16em]',
                        toneCls[risk.tone],
                      )}
                    >
                      {ch.difficulty}
                    </span>

                    <div className="flex items-center gap-1.5" title={risk.label}>
                      {[0, 1, 2].map((b) => (
                        <span
                          key={b}
                          className={cx(
                            'h-3.5 w-[5px] rounded-[1px]',
                            b < risk.bars
                              ? risk.bars === 1
                                ? 'bg-pass'
                                : risk.bars === 2
                                  ? 'bg-signal'
                                  : 'bg-fail'
                              : 'bg-ink-600',
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {/* title block */}
                  <div className="mt-5 flex-1">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-fg-mute">
                      Case #{String(idx + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-1.5 font-display text-[19px] font-bold leading-[1.15] tracking-tight text-fg transition-colors duration-200 group-hover:text-signal">
                      {ch.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-[12.5px] leading-relaxed text-fg-mute">
                      {ch.tagline}
                    </p>
                  </div>

                  {/* meta */}
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    <Chip tone="trace">
                      <Code2 className="h-3 w-3" />
                      {ch.language}
                    </Chip>
                    <Chip tone="clue">{ch.bugCategory}</Chip>
                  </div>
                </div>

                {/* footer action */}
                <div className="border-t border-ink-line bg-ink-700/70 p-3">
                  <div className="mb-2.5 flex items-center justify-between px-1 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-fg-mute">
                    <span className="flex items-center gap-1.5">
                      <Timer className="h-3 w-3" />
                      ~{ch.estimatedTimeMinutes}m
                    </span>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-pass">
                        <Check className="h-3 w-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-fg-mute/70">Unsolved</span>
                    )}
                  </div>

                  <button
                    onClick={() => selectChallenge(ch.id)}
                    className={cx(
                      'btn w-full justify-between rounded-[5px] px-3.5 py-2.5 transition-all duration-200',
                      isCompleted
                        ? 'border border-pass/40 bg-pass/10 text-pass hover:bg-pass hover:text-ink-950'
                        : 'bg-signal text-ink-950 hover:bg-[#ffd160]',
                    )}
                  >
                    <span>{isCompleted ? 'Re-investigate' : 'Open case'}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-lg border border-dashed border-ink-edge bg-ink-800/60 py-16 text-center">
          <FolderOpen className="h-8 w-8 text-fg-mute" />
          <p className="font-display text-lg font-semibold text-fg">No cases at that grade</p>
          <button onClick={() => setFilter('all')} className="btn-ghost rounded-[5px]">
            Reset filter
          </button>
        </div>
      )}
    </div>
  );
};
