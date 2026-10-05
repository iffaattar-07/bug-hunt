'use client';

import React from 'react';
import { useLab } from '@/context/LabContext';
import { KeyRound, Lock, LockOpen, Sparkles } from 'lucide-react';
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

      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto p-3">
        {activeChallenge.clues.map((clue, idx) => {
          const isUnlocked = unlockedClueIds.includes(clue.id);

          return (
            <motion.div
              key={clue.id}
              layout
              transition={{ duration: 0.4 }}
              className={cx(
                'relative overflow-hidden rounded-[6px] border p-3.5 transition-colors duration-300',
                isUnlocked
                  ? 'border-clue/35 bg-clue/[0.07]'
                  : 'border-ink-line bg-ink-700/60',
              )}
            >
              {isUnlocked && (
                <span className="absolute inset-y-0 left-0 w-[3px] bg-clue" />
              )}

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cx(
                        'grid h-5 w-5 shrink-0 place-items-center rounded-[4px] font-mono text-[10px] font-bold',
                        isUnlocked ? 'bg-clue text-ink-950' : 'bg-ink-600 text-fg-mute',
                      )}
                    >
                      {idx + 1}
                    </span>
                    <h4
                      className={cx(
                        'truncate font-display text-[14px] font-semibold tracking-tight',
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
                    className="group flex shrink-0 items-center gap-1.5 rounded-[5px] bg-signal px-3 py-1.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-ink-950 transition-all duration-200 hover:bg-[#ffd160] active:translate-y-px"
                  >
                    <Lock className="h-3 w-3 transition-transform duration-200 group-hover:rotate-[-12deg]" />
                    Reveal
                  </button>
                )}
              </div>

              <div className="mt-2.5 border-t border-dashed pt-2.5"
                style={{ borderColor: isUnlocked ? 'rgba(255,92,168,0.28)' : 'rgba(255,255,255,0.06)' }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isUnlocked ? (
                    <motion.p
                      key="open"
                      initial={{ opacity: 0, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, filter: 'blur(0px)' }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="select-text text-[12.5px] leading-relaxed text-fg-dim"
                    >
                      {clue.hint}
                    </motion.p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <LockOpen className="h-3 w-3 shrink-0 text-fg-mute/60" />
                      <p className="redacted select-none text-[12.5px] leading-relaxed text-fg-mute">
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
                  transition={{ delay: 0.35 }}
                  className="mt-2.5 flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-clue"
                >
                  <Sparkles className="h-3 w-3" />
                  Intel decrypted
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="border-t border-ink-line bg-ink-700/60 px-3.5 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-fg-mute">
        {done === total ? (
          <span className="text-clue">All intel decrypted</span>
        ) : (
          <span>{total - done} sealed · costs nothing to look</span>
        )}
      </div>
    </Panel>
  );
};
