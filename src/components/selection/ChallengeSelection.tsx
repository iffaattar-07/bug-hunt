'use client';

import React, { useState } from 'react';
import { useLab } from '@/context/LabContext';
import { getAllChallenges } from '@/data/challenges';
import { Difficulty } from '@/types/challenge';
import { ArrowRight, Timer, Check, FolderOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Segmented, SectionHead, cx, Meter } from '@/components/ui/primitives';

const RISK: Record<Difficulty, { bars: number; tone: 'pass' | 'signal' | 'fail'; label: string }> = {
  easy: { bars: 1, tone: 'pass', label: 'Low risk' },
  medium: { bars: 2, tone: 'signal', label: 'Elevated' },
  hard: { bars: 3, tone: 'fail', label: 'Critical' },
};

const toneCls = {
  pass: 'text-pass',
  signal: 'text-signal',
  fail: 'text-fail',
} as const;

const barCls = {
  pass: 'bg-pass',
  signal: 'bg-signal',
  fail: 'bg-fail',
} as const;

const ease = [0.16, 1, 0.3, 1] as const;

export const ChallengeSelection: React.FC = () => {
  const { selectChallenge, completedChallengeIds } = useLab();
  const [filter, setFilter] = useState('all');
  const challenges = getAllChallenges();

  const filtered = challenges.filter((c) => filter === 'all' || c.difficulty === filter);
  const cleared = challenges.filter((c) => completedChallengeIds.includes(c.id)).length;

  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 py-10 sm:px-6">
      <SectionHead
        kicker="02 / case files"
        title="Choose your incident"
        desc="Four real-world failures, graded by blast radius. Cleared cases stay stamped until you reopen them."
        right={
          <div className="flex flex-col items-start gap-4 md:items-end">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] tracking-[0.08em] text-fg-mute">
                clearance
              </span>
              <div className="h-3 w-[92px]">
                <Meter
                  value={cleared}
                  max={challenges.length}
                  segments={4}
                  tone="pass"
                  className="h-full"
                />
              </div>
              <span className="font-display text-[15px] font-extrabold leading-none text-fg tnum">
                {cleared}
                <span className="text-fg-mute">/{challenges.length}</span>
              </span>
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

      {/* specimen sheet: a ruled matrix, not a row of floating cards */}
      <div className="mt-9 grid grid-cols-1 border-l border-t border-ink-line lg:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((ch, idx) => {
            const isCompleted = completedChallengeIds.includes(ch.id);
            const risk = RISK[ch.difficulty];

            return (
              <motion.article
                key={ch.id}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.4, ease }}
                onPointerMove={(e) => {
                  if (e.pointerType !== 'mouse') return;
                  const el = e.currentTarget;
                  const r = el.getBoundingClientRect();
                  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
                  el.style.setProperty('--my', `${e.clientY - r.top}px`);
                }}
                className={cx(
                  'group relative flex flex-col border-b border-r border-ink-line transition-colors duration-200',
                  isCompleted ? 'bg-ink-850/40' : 'bg-ink-850/40 hover:bg-ink-800',
                )}
              >
                {/* rule that draws in on hover */}
                <span className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-signal transition-transform duration-500 ease-out group-hover:scale-x-100" />

                <div className="spotlight relative flex flex-1 flex-col p-6 pt-7">
                  {isCompleted && (
                    <div className="pointer-events-none absolute right-5 top-6">
                      <div
                        className="stamp rounded-sm border-pass/60 text-pass"
                        style={{ opacity: 0.5, transform: 'rotate(-8deg)' }}
                      >
                        <span className="px-3 py-1.5 text-[10px]">cleared</span>
                      </div>
                    </div>
                  )}

                  {/* index + risk */}
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-display text-[34px] font-extrabold leading-none tracking-[-0.05em] text-ink-400 transition-colors duration-200 group-hover:text-signal tnum">
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    <div className="flex items-center gap-3">
                      <span className={cx('font-mono text-[10px] tracking-[0.1em]', toneCls[risk.tone])}>
                        {ch.difficulty}
                      </span>
                      <div className="flex items-center gap-1" title={risk.label}>
                        {[0, 1, 2].map((b) => (
                          <span
                            key={b}
                            className={cx(
                              'h-3 w-[4px]',
                              b < risk.bars ? barCls[risk.tone] : 'bg-ink-600',
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* title block */}
                  <div className="mt-6 flex-1">
                    <h3 className="max-w-[20ch] font-display text-[22px] font-extrabold leading-[1.08] tracking-[-0.03em] text-fg transition-colors duration-200 group-hover:text-signal">
                      {ch.title}
                    </h3>
                    <p className="mt-3 max-w-[44ch] text-[13.5px] leading-[1.65] text-fg-dim">
                      {ch.tagline}
                    </p>
                  </div>

                  {/* meta ledger */}
                  <div className="mt-6 space-y-1.5 font-mono text-[11px] tracking-[0.04em] text-fg-mute">
                    <div className="flex items-baseline gap-2">
                      <span>lang</span>
                      <span className="leader" />
                      <span className="text-fg-dim">{ch.language}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span>class</span>
                      <span className="leader" />
                      <span className="text-fg-dim">{ch.bugCategory}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span>eta</span>
                      <span className="leader" />
                      <span className="flex items-center gap-1 text-fg-dim">
                        <Timer className="h-3 w-3" />~{ch.estimatedTimeMinutes}m
                      </span>
                    </div>
                  </div>
                </div>

                {/* footer action */}
                <div className="flex items-center justify-between gap-3 border-t border-ink-line px-6 py-4">
                  <span
                    className={cx(
                      'flex items-center gap-1.5 font-mono text-[10.5px] tracking-[0.06em]',
                      isCompleted ? 'text-pass' : 'text-fg-mute',
                    )}
                  >
                    {isCompleted ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> verified
                      </>
                    ) : (
                      'unsolved'
                    )}
                  </span>

                  <button
                    onClick={() => selectChallenge(ch.id)}
                    className={cx(
                      'btn px-4 py-2.5 transition-colors duration-150',
                      isCompleted
                        ? 'border border-pass/50 text-pass hover:bg-pass hover:text-ink-950'
                        : 'bg-signal text-ink-950 hover:bg-[#f2c860]',
                    )}
                  >
                    <span>{isCompleted ? 're-investigate' : 'open case'}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 flex flex-col items-center gap-4 border border-dashed border-ink-edge py-16 text-center">
          <FolderOpen className="h-8 w-8 text-ink-400" />
          <p className="font-display text-lg font-bold tracking-tight text-fg">
            No cases at that grade
          </p>
          <button onClick={() => setFilter('all')} className="btn-ghost">
            Reset filter
          </button>
        </div>
      )}
    </div>
  );
};
