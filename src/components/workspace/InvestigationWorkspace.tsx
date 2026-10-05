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
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="panel rail-tick relative flex flex-col gap-4 overflow-hidden pl-5 pr-4 py-4 md:flex-row md:items-center md:justify-between"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone="signal">{activeChallenge.language}</Chip>
            <Chip tone="clue">{activeChallenge.bugCategory}</Chip>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-mute">
              Incident report
            </span>
          </div>
          <h1 className="mt-2 font-display text-[22px] font-bold leading-tight tracking-tight text-fg">
            {activeChallenge.title}
          </h1>
          <p className="mt-1 max-w-[70ch] text-[13px] leading-relaxed text-fg-dim">
            {activeChallenge.tagline}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {/* live case stats */}
          <div className="flex items-center gap-4 rounded-[5px] border border-ink-line bg-ink-900 px-4 py-2.5">
            <div>
              <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-fg-mute">
                <KeyRound className="h-3 w-3 text-clue" />
                Clues
              </div>
              <div className="mt-1 font-display text-base font-bold leading-none text-fg tnum">
                {cluesDone}
                <span className="text-fg-mute">/{cluesTotal}</span>
              </div>
            </div>
            <span className="h-7 w-px bg-ink-line" />
            <div>
              <div className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-fg-mute">
                Attempts
              </div>
              <div className="mt-1 font-display text-base font-bold leading-none text-signal tnum">
                {attemptsCount}
              </div>
            </div>
          </div>

          <button onClick={() => setStage('diagnose')} className="group btn-primary btn-sweep">
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
            <div className="mb-2 flex items-center gap-1">
              {[
                { id: 'logs', label: 'Runtime log', icon: <Terminal className="h-3.5 w-3.5" /> },
                { id: 'expected', label: 'Spec', icon: <Target className="h-3.5 w-3.5" /> },
              ].map((t) => {
                const active =
                  activeTab === t.id || (t.id === 'logs' && activeTab === 'editor');
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as 'logs' | 'expected')}
                    className={cx(
                      'relative flex items-center gap-2 rounded-t-[6px] border border-b-0 px-3.5 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] transition-colors',
                      active
                        ? 'border-ink-line bg-ink-800 text-signal'
                        : 'border-transparent text-fg-mute hover:text-fg',
                    )}
                  >
                    {t.icon}
                    {t.label}
                    {active && (
                      <motion.span
                        layoutId="tab-rail"
                        transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                        className="absolute inset-x-0 -top-[1px] h-[2px] rounded-full bg-signal"
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
