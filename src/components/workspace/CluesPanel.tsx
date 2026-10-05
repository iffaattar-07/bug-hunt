'use client';

import React from 'react';
import { useLab } from '@/context/LabContext';
import { KeyRound, Lock, LockOpen } from 'lucide-react';
import { Panel, PanelHead, Meter, cx } from '@/components/ui/primitives';
import { motion, AnimatePresence } from 'framer-motion';

export const CluesPanel: React.FC = () => {
  const { activeChallenge, unlockedClueIds, unlockClue } = useLab();

  if (!activeChallenge) return null;

  const total = activeChallenge.clues.length;
  const done = unlockedClueIds.length;

  return (
    <Panel className="h-full">
      <PanelHead
        tone="clue"
        icon={<KeyRound className="h-3.5 w-3.5" />}
        title="Sealed intel"
        meta={
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-[74px] text-clue">
              <Meter value={done} max={total} segments={total} tone="signal" className="h-full" />
            </div>
            <span className="font-mono text-[10px] font-bold text-clue tnum">
              {done}/{total}
            </span>
          </div>
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto p-1">
        {activeChallenge.clues.map((clue, idx) => {
          const isUnlocked = unlockedClueIds.includes(clue.id);

          return (
            <motion.div
              key={clue.id}
              layout
              transition={{ duration: 0.4 }}
              className={cx(
                'relative overflow-hidden border-b border-ink-line px-3.5 py-3.5 transition-colors duration-200',
                isUnlocked ? 'bg-white/[0.02]' : '',
              )}
            >
              {isUnlocked && (
                <span className="absolute inset-y-0 left-0 w-[2px] bg-clue" />
              )}

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cx(
                        'font-mono text-[11px] font-bold tnum',
                        isUnlocked ? 'text-clue' : 'text-ink-400',
                      )}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h4
                      className={cx(
                        'truncate font-display text-[14.5px] font-bold tracking-[-0.015em]',
                        isUnlocked ? 'text-fg' : 'text-fg-dim',
                      )}
                    >
                      {clue.title}
                    </h4>
                  </div>
                </div>

                {!isUnlocked && (
                  <button
                    onClick={() => unlockClue(clue.id)}
                    className="group flex shrink-0 items-center gap-1.5 rounded-sm bg-signal px-2.5 py-1.5 font-mono text-[10px] font-bold tracking-[0.06em] text-ink-950 transition-colors duration-150 hover:bg-[#f2c860] active:translate-y-px"
                  >
                    <Lock className="h-3 w-3 transition-transform duration-200 group-hover:-rotate-12" />
                    reveal
                  </button>
                )}
              </div>

              <div className="mt-3 border-t border-dashed border-ink-edge pt-3">
                <AnimatePresence mode="wait" initial={false}>
                  {isUnlocked ? (
                    <motion.p
                      key="open"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="select-text text-[12.5px] leading-[1.7] text-fg-dim"
                    >
                      {clue.hint}
                    </motion.p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <LockOpen className="h-3 w-3 shrink-0 text-fg-mute/60" />
                      <p className="redacted select-none text-[12.5px] leading-[1.7] text-fg-mute">
                        {clue.hint}
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {isUnlocked && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-2 font-mono text-[10px] tracking-[0.08em] text-clue"
                >
                  · decrypted
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-baseline gap-2 border-t border-ink-line bg-ink-850 px-4 py-2.5 font-mono text-[10.5px] tracking-[0.06em] text-fg-mute">
        <span>{done === total ? 'all intel decrypted' : `${total - done} sealed`}</span>
        <span className="leader" />
        <span className={done === total ? 'text-clue' : ''}>costs nothing to look</span>
      </div>
    </Panel>
  );
};
