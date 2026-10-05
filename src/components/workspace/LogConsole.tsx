'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useLab } from '@/context/LabContext';
import { Terminal, CircleAlert, TriangleAlert, Info, Bug, ChevronRight } from 'lucide-react';
import { LogEntry } from '@/types/challenge';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, PanelHead, Segmented, cx } from '@/components/ui/primitives';

const LEVEL = {
  error: { icon: <CircleAlert className="h-3.5 w-3.5" />, cls: 'text-fail', dot: 'bg-fail' },
  warn: { icon: <TriangleAlert className="h-3.5 w-3.5" />, cls: 'text-signal', dot: 'bg-signal' },
  info: { icon: <Info className="h-3.5 w-3.5" />, cls: 'text-trace', dot: 'bg-trace' },
  debug: { icon: <Bug className="h-3.5 w-3.5" />, cls: 'text-clue', dot: 'bg-clue' },
} as const;

export const LogConsole: React.FC = () => {
  const { activeChallenge } = useLab();
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState<string | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const all = activeChallenge?.logs ?? [];
  const logs = all.filter((l) => filter === 'all' || l.level === filter || l.source === filter);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [filter]);

  if (!activeChallenge) return null;

  const counts = {
    all: all.length,
    error: all.filter((l) => l.level === 'error').length,
    warn: all.filter((l) => l.level === 'warn').length,
    info: all.filter((l) => l.level === 'info').length,
  };

  return (
    <Panel className="h-full">
      <PanelHead
        tone="trace"
        icon={<Terminal className="h-3.5 w-3.5" />}
        title="Runtime stream"
        meta={
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 font-mono text-[10.5px] tracking-[0.06em] text-pass sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-pass animate-pulse-dot" />
              streaming
            </span>
            <Segmented
              id="loglevel"
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'all', label: `All ${counts.all}` },
                { value: 'error', label: `Err ${counts.error}` },
                { value: 'warn', label: `Wrn ${counts.warn}` },
                { value: 'info', label: `Inf ${counts.info}` },
              ]}
            />
          </div>
        }
      />

      <div
        ref={bodyRef}
        className="scanlines relative min-h-0 flex-1 overflow-y-auto bg-ink-950 p-2"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {logs.map((log, i) => {
            const lv = LEVEL[log.level];
            const isOpen = open === log.id;

            return (
              <motion.div
                key={log.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: Math.min(i * 0.04, 0.3), duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={cx(
                  'relative overflow-hidden border-b border-ink-line py-3 pl-4 pr-3 transition-colors',
                  log.level === 'error' ? 'bg-fail/[0.04]' : '',
                )}
              >
                <span className={cx('absolute inset-y-0 left-0 w-[2px]', lv.dot)} />

                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className={cx('flex items-center gap-1.5 font-mono text-[10px] tracking-[0.08em]', lv.cls)}>
                        {lv.icon}
                        {log.level}
                      </span>
                      <span className="font-mono text-[10.5px] text-fg-mute tnum">
                        {log.timestamp}
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.06em] text-fg-mute/80">
                        {log.source}
                      </span>
                    </div>

                    <p className="mt-1.5 select-text whitespace-pre-wrap break-words font-mono text-[12.5px] leading-[1.65] text-fg">
                      {log.message}
                    </p>
                  </div>

                  {log.stackTrace && (
                    <button
                      onClick={() => setOpen(isOpen ? null : log.id)}
                      className="flex shrink-0 items-center gap-1 border border-ink-edge px-2 py-1 font-mono text-[10px] tracking-[0.06em] text-fg-mute transition-colors duration-150 hover:border-signal/60 hover:text-signal"
                    >
                      stack
                      <ChevronRight
                        className={cx('h-3 w-3 transition-transform duration-200', isOpen && 'rotate-90')}
                      />
                    </button>
                  )}
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && log.stackTrace && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 space-y-1 border-l-2 border-fail/50 bg-ink-900 py-2 pl-3 font-mono text-[11px] leading-[1.6] text-fail/90">
                        {log.stackTrace.map((st, idx) => (
                          <div key={idx}>{st}</div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {logs.length === 0 && (
          <div className="grid h-full place-items-center py-10 text-center">
            <div>
              <Terminal className="mx-auto h-7 w-7 text-ink-400" />
              <p className="mt-2 font-mono text-[11px] tracking-[0.06em] text-fg-mute">
                no events at this level
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 border-t border-ink-line bg-ink-850 px-4 py-2.5 font-mono text-[10.5px] tracking-[0.06em] text-fg-mute">
        <span>tail -f app.log</span>
        <span className="leader" />
        <span className="text-fail">{counts.error} error(s) on record</span>
      </div>
    </Panel>
  );
};
