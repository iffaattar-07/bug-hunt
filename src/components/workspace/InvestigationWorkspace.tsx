'use client';

import React from 'react';
import { useLab } from '@/context/LabContext';
import { FileExplorer } from './FileExplorer';
import { CodeViewer } from './CodeViewer';
import { LogConsole } from './LogConsole';
import { CluesPanel } from './CluesPanel';
import { ExpectedBehavior } from './ExpectedBehavior';
import { Terminal, Target, ArrowRight, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { Chip, cx } from '@/components/ui/primitives';

export const InvestigationWorkspace: React.FC = () => {
  const { activeChallenge, activeTab, setActiveTab, setStage, unlockedClueIds, attemptsCount } =
    useLab();

  if (!activeChallenge) return null;

  const cluesTotal = activeChallenge.clues.length;
  const cluesDone = unlockedClueIds.length;

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6">
      {/* ---------------- mission banner ---------------- */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="rail-tick relative flex flex-col gap-5 overflow-hidden border border-ink-line bg-ink-850 py-5 pl-6 pr-4 md:flex-row md:items-end md:justify-between"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] tracking-[0.06em] text-fg-mute">
            <Chip tone="signal">{activeChallenge.language}</Chip>
            <Chip tone="neutral">{activeChallenge.bugCategory}</Chip>
            <span>incident report</span>
          </div>
          <h1 className="mt-3 max-w-[26ch] font-display text-[26px] font-extrabold leading-[1.05] tracking-[-0.04em] text-fg">
            {activeChallenge.title}
          </h1>
          <p className="mt-2 max-w-[72ch] text-[13.5px] leading-[1.7] text-fg-dim">
            {activeChallenge.tagline}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-end gap-6">
          {/* live case stats */}
          <div className="font-mono text-[11px] tracking-[0.06em] text-fg-mute">
            <div className="flex items-baseline gap-2">
              <span className="flex items-center gap-1.5">
                <KeyRound className="h-3 w-3 text-clue" />
                clues
              </span>
              <span className="leader w-10" />
              <span className="font-display text-[15px] font-extrabold text-fg tnum">
                {cluesDone}
                <span className="text-fg-mute">/{cluesTotal}</span>
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span>attempts</span>
              <span className="leader w-10" />
              <span className="font-display text-[15px] font-extrabold text-signal tnum">
                {attemptsCount}
              </span>
            </div>
          </div>

          <button onClick={() => setStage('diagnose')} className="group btn-primary">
            <span>Proceed to diagnosis</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </motion.div>

      {/* ---------------- workspace grid ---------------- */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:h-[calc(100vh-236px)] lg:min-h-[600px]">
        {/* left rail */}
        <div className="flex flex-col gap-4 lg:col-span-4 lg:h-full lg:min-h-0">
          <div className="h-[300px] lg:h-[46%] lg:min-h-0">
            <FileExplorer />
          </div>
          <div className="h-[340px] lg:h-[54%] lg:min-h-0">
            <CluesPanel />
          </div>
        </div>

        {/* main column */}
        <div className="flex min-w-0 flex-col gap-4 lg:col-span-8 lg:h-full lg:min-h-0">
          <div className="h-[420px] lg:h-[60%] lg:min-h-0">
            <CodeViewer />
          </div>

          <div className="flex min-h-[300px] flex-col lg:h-[40%] lg:min-h-0">
            {/* tab rail */}
            <div className="mb-2 flex items-center gap-5 border-b border-ink-line">
              {[
                { id: 'logs', label: 'runtime log', icon: <Terminal className="h-3.5 w-3.5" /> },
                { id: 'expected', label: 'spec', icon: <Target className="h-3.5 w-3.5" /> },
              ].map((t) => {
                const active =
                  activeTab === t.id || (t.id === 'logs' && activeTab === 'editor');
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as 'logs' | 'expected')}
                    className={cx(
                      'relative -mb-px flex items-center gap-2 pb-2.5 font-mono text-[11px] tracking-[0.05em] transition-colors duration-150',
                      active ? 'text-fg' : 'text-fg-mute hover:text-fg-dim',
                    )}
                  >
                    {t.icon}
                    {t.label}
                    {active && (
                      <motion.span
                        layoutId="tab-rail"
                        transition={{ type: 'spring', stiffness: 520, damping: 44 }}
                        className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-signal"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="min-h-0 flex-1 overflow-hidden">
              {activeTab === 'expected' ? <ExpectedBehavior /> : <LogConsole />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
