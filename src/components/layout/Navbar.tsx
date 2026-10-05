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
  Crosshair,
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

  const isUnlocked = (idx: number) => {
    if (idx === 0) return true;
    if (idx === 1) return currentIdx >= 1 || stage === 'investigate';
    if (idx === 2) return !!selectedDiagnosis?.isCorrect;
    if (idx === 3) return !!selectedFix;
    return stage === 'report';
  };

  const lockedStages = MISSION.map((m, i) => {
    const active = stage === m.id;
    let disabled = false;
    if (m.id === 'fix') disabled = !selectedDiagnosis?.isCorrect;
    if (m.id === 'verify') disabled = !selectedFix;
    if (m.id === 'report') disabled = stage !== 'report' && !selectedFix;
    return { ...m, active, disabled, idx: i };
  });

  return (
    <header className="sticky top-0 z-50 border-b border-ink-line bg-ink-850/95 backdrop-blur-sm select-none">
      {/* hairline signal across the very top of the app */}
      <div className="h-[2px] w-full bg-gradient-to-r from-signal/0 via-signal/60 to-signal/0" />

      <div className="mx-auto flex h-[62px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
        {/* ---- brand ---- */}
        <button
          onClick={() => setStage('landing')}
          className="group flex shrink-0 items-center gap-3"
        >
          <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-[5px] border border-signal/40 bg-signal/10 transition-colors group-hover:bg-signal/20">
            <Bug className="h-[18px] w-[18px] text-signal transition-transform duration-300 group-hover:rotate-12" />
            <span className="absolute -bottom-px left-0 h-[3px] w-full hazard opacity-70" />
          </span>
          <span className="hidden text-left leading-none sm:block">
            <span className="block font-display text-[15px] font-bold tracking-[0.02em] text-fg">
              BUG&nbsp;HUNT
            </span>
            <span className="mt-1 block font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-fg-mute">
              Field Ops v1.0
            </span>
          </span>
        </button>

        {/* ---- mission track ---- */}
        <AnimatePresence>
          {inMission && (
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="hidden min-w-0 items-center gap-1 lg:flex"
            >
              {lockedStages.map((st, i) => (
                <React.Fragment key={st.id}>
                  {i > 0 && (
                    <span className="relative h-[2px] w-6 shrink-0 overflow-hidden rounded bg-ink-600">
                      <motion.span
                        className="absolute inset-0 bg-signal"
                        initial={false}
                        animate={{
                          scaleX: currentIdx >= i ? 1 : 0,
                          originX: 0,
                        }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </span>
                  )}
                  <button
                    disabled={st.disabled}
                    onClick={() => setStage(st.id)}
                    className={cx(
                      'group relative flex shrink-0 items-center gap-1.5 rounded-[5px] border px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] transition-all duration-200',
                      st.active
                        ? 'border-signal/60 bg-signal/15 text-signal'
                        : st.disabled
                          ? 'cursor-not-allowed border-ink-line bg-ink-800/60 text-fg-mute/45'
                          : 'border-ink-line bg-ink-800 text-fg-dim hover:border-ink-edge hover:text-fg',
                    )}
                  >
                    <span
                      className={cx(
                        'grid h-4 w-4 place-items-center rounded-[3px] text-[9px]',
                        st.active
                          ? 'bg-signal text-ink-950'
                          : currentIdx > st.idx
                            ? 'bg-pass/25 text-pass'
                            : 'bg-ink-700 text-fg-mute',
                      )}
                    >
                      {currentIdx > st.idx ? '✓' : st.idx + 1}
                    </span>
                    <span className="hidden xl:inline">{st.short}</span>
                    {st.active && (
                      <motion.span
                        layoutId="mission-active"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        className="absolute -bottom-[9px] left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-signal"
                      />
                    )}
                  </button>
                </React.Fragment>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>

        {/* ---- right cluster ---- */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          {inMission && (
            <>
              {/* XP */}
              <div className="hidden items-center gap-2 rounded-[5px] border border-ink-line bg-ink-800 px-2.5 py-1.5 md:flex">
                <Crosshair className="h-3.5 w-3.5 text-signal" />
                <div className="w-16">
                  <div className="flex items-baseline justify-between font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-fg-mute">
                    <span>XP</span>
                    <span className="tnum text-signal">{xp}</span>
                  </div>
                  <Meter
                    value={xp}
                    max={480}
                    segments={8}
                    className="mt-1 h-[5px] w-full"
                  />
                </div>
                <span className="grid h-6 w-6 place-items-center rounded-[4px] border border-signal/40 bg-signal/10 font-display text-[11px] font-bold text-signal">
                  {rank}
                </span>
              </div>

              {/* timer */}
              <div className="flex items-center gap-2 rounded-[5px] border border-ink-line bg-ink-800 px-2.5 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-pass animate-pulse-dot" />
                <Timer className="h-3.5 w-3.5 text-fg-mute" />
                <span className="tnum font-mono text-[12px] font-bold text-fg">
                  {formatTime(elapsedSeconds)}
                </span>
              </div>
            </>
          )}

          <button
            onClick={toggleSound}
            title={soundMuted ? 'Unmute audio' : 'Mute audio'}
            aria-label="Toggle sound"
            className="grid h-9 w-9 place-items-center rounded-[5px] border border-ink-line bg-ink-800 text-fg-mute transition-colors hover:border-ink-edge hover:text-fg"
          >
            {soundMuted ? (
              <VolumeX className="h-4 w-4 text-fail" />
            ) : (
              <Volume2 className="h-4 w-4 text-signal" />
            )}
          </button>

          {activeChallenge && (
            <button
              onClick={resetLab}
              className="flex items-center gap-1.5 rounded-[5px] border border-ink-line bg-ink-800 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-fg-mute transition-colors hover:border-fail/50 hover:text-fail"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Abort</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
