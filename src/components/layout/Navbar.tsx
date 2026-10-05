'use client';

import React from 'react';
import { useLab } from '@/context/LabContext';
import {
  Bug,
  Terminal,
  Volume2,
  VolumeX,
  RotateCcw,
  Timer,
  ShieldAlert,
  FileCode2,
  FlaskConical,
  FileText,
} from 'lucide-react';
import { LabStage } from '@/types/challenge';
import { motion, AnimatePresence } from 'framer-motion';
import { cx, Meter } from '@/components/ui/primitives';

const MISSION: { id: LabStage; short: string; icon: React.ReactNode }[] = [
  { id: 'investigate', short: 'Investigate', icon: <Terminal className="h-3.5 w-3.5" /> },
  { id: 'diagnose', short: 'Diagnose', icon: <ShieldAlert className="h-3.5 w-3.5" /> },
  { id: 'fix', short: 'Fix', icon: <FileCode2 className="h-3.5 w-3.5" /> },
  { id: 'verify', short: 'Verify', icon: <FlaskConical className="h-3.5 w-3.5" /> },
  { id: 'report', short: 'Report', icon: <FileText className="h-3.5 w-3.5" /> },
];

export const Navbar: React.FC = () => {
  const {
    stage,
    activeChallenge,
    elapsedSeconds,
    soundMuted,
    toggleSound,
    resetLab,
    setStage,
    selectedDiagnosis,
    selectedFix,
    unlockedClueIds,
    attemptsCount,
    testRunnerState,
  } = useLab();

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    return `${String(mins).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;
  };

  const inMission =
    !!activeChallenge && !['landing', 'select'].includes(stage);

  const currentIdx = MISSION.findIndex((m) => m.id === stage);
  const unlocked = unlockedClueIds.length;
  const xp = Math.min(
    480,
    (currentIdx < 0 ? 0 : currentIdx) * 60 +
      unlocked * 45 +
      (selectedDiagnosis?.isCorrect ? 90 : 0) +
      (selectedFix ? 70 : 0) +
      (testRunnerState === 'completed' ? 120 : 0) -
      Math.max(0, attemptsCount - 1) * 15,
  );
  const rank =
    xp >= 400 ? 'S' : xp >= 300 ? 'A' : xp >= 200 ? 'B' : xp >= 100 ? 'C' : 'D';

  const lockedStages = MISSION.map((m, i) => {
    const active = stage === m.id;
    let disabled = false;
    if (m.id === 'fix') disabled = !selectedDiagnosis?.isCorrect;
    if (m.id === 'verify') disabled = !selectedFix;
    if (m.id === 'report') disabled = stage !== 'report' && !selectedFix;
    return { ...m, active, disabled, idx: i };
  });

  return (
    <header className="sticky top-0 z-50 border-b border-ink-line bg-ink-900/95 backdrop-blur-sm select-none">
      <div className="mx-auto flex h-[60px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
        {/* ---- brand ---- */}
        <button
          onClick={() => setStage('landing')}
          className="group flex shrink-0 items-center gap-3"
        >
          <span className="relative grid h-8 w-8 place-items-center bg-signal text-ink-950 transition-colors group-hover:bg-[#f2c860]">
            <Bug className="h-[17px] w-[17px] transition-transform duration-300 group-hover:-rotate-6" />
          </span>
          <span className="hidden text-left leading-none sm:block">
            <span className="block font-display text-[14px] font-extrabold tracking-[-0.01em] text-fg">
              BUG&nbsp;HUNT
            </span>
            <span className="mt-[3px] block font-mono text-[9px] tracking-[0.16em] text-fg-mute">
              field ops · v1.0
            </span>
          </span>
        </button>

        {/* ---- mission track ---- */}
        <AnimatePresence>
          {inMission && (
            <motion.nav
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.24 }}
              className="hidden min-w-0 items-center gap-1 lg:flex"
            >
              {lockedStages.map((st, i) => (
                <React.Fragment key={st.id}>
                  {i > 0 && (
                    <span
                      className={cx(
                        'h-px w-5 shrink-0 transition-colors duration-300',
                        currentIdx >= i ? 'bg-signal/70' : 'bg-ink-edge',
                      )}
                    />
                  )}
                  <button
                    disabled={st.disabled}
                    onClick={() => setStage(st.id)}
                    className={cx(
                      'relative flex shrink-0 items-center gap-1.5 px-2.5 py-2 font-mono text-[11px] tracking-[0.03em] transition-colors duration-150',
                      st.active
                        ? 'text-signal'
                        : st.disabled
                          ? 'cursor-not-allowed text-fg-mute/40'
                          : 'text-fg-mute hover:text-fg',
                    )}
                  >
                    <span
                      className={cx(
                        'grid h-[17px] w-[17px] place-items-center rounded-sm text-[9px] font-bold',
                        st.active
                          ? 'bg-signal text-ink-950'
                          : currentIdx > st.idx
                            ? 'border border-pass/50 text-pass'
                            : 'border border-ink-edge text-fg-mute',
                      )}
                    >
                      {currentIdx > st.idx ? '✓' : st.idx + 1}
                    </span>
                    <span className="hidden xl:inline">{st.short}</span>
                    {st.active && (
                      <motion.span
                        layoutId="mission-active"
                        transition={{ type: 'spring', stiffness: 520, damping: 44 }}
                        className="absolute inset-x-1 -bottom-[1px] h-[2px] bg-signal"
                      />
                    )}
                  </button>
                </React.Fragment>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>

        {/* ---- right cluster ---- */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {inMission && (
            <>
              {/* XP ledger */}
              <div className="hidden items-center gap-3 border-r border-ink-line pr-3 md:flex">
                <div className="w-24">
                  <div className="flex items-baseline gap-1.5 font-mono text-[9.5px] tracking-[0.08em] text-fg-mute">
                    <span>score</span>
                    <span className="leader" />
                    <span className="tnum text-signal">{xp}</span>
                  </div>
                  <Meter
                    value={xp}
                    max={480}
                    segments={8}
                    className="mt-1.5 h-[4px] w-full"
                  />
                </div>
                <span className="grid h-6 w-6 place-items-center rounded-sm border border-signal/50 font-mono text-[11px] font-bold text-signal">
                  {rank}
                </span>
              </div>

              {/* timer */}
              <div className="flex items-center gap-2 font-mono text-[12px] text-fg">
                <Timer className="h-3.5 w-3.5 text-fg-mute" />
                <span className="tnum">{formatTime(elapsedSeconds)}</span>
              </div>
            </>
          )}

          <button
            onClick={toggleSound}
            title={soundMuted ? 'Unmute audio' : 'Mute audio'}
            aria-label="Toggle sound"
            className="grid h-8 w-8 place-items-center rounded-sm border border-ink-line text-fg-mute transition-colors duration-150 hover:border-ink-edge hover:text-fg"
          >
            {soundMuted ? (
              <VolumeX className="h-4 w-4 text-fail" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>

          {activeChallenge && (
            <button
              onClick={resetLab}
              className="flex items-center gap-1.5 rounded-sm border border-ink-line px-2.5 py-2 font-mono text-[10.5px] tracking-[0.06em] text-fg-mute transition-colors duration-150 hover:border-fail/60 hover:text-fail"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">abort</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
