'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useLab } from '@/context/LabContext';
import { Terminal, CircleAlert, TriangleAlert, Info, Bug, ChevronRight } from 'lucide-react';
import { LogEntry } from '@/types/challenge';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, PanelHead, Segmented, cx } from '@/components/ui/primitives';

const LEVEL = {
  error: { icon: <CircleAlert className="h-3.5 w-3.5" />, cls: 'border-fail/40 bg-fail/10 text-fail', dot: 'bg-fail' },
  warn: { icon: <TriangleAlert className="h-3.5 w-3.5" />, cls: 'border-signal/40 bg-signal/10 text-signal', dot: 'bg-signal' },
  info: { icon: <Info className="h-3.5 w-3.5" />, cls: 'border-trace/40 bg-trace/10 text-trace', dot: 'bg-trace' },
  debug: { icon: <Bug className="h-3.5 w-3.5" />, cls: 'border-clue/40 bg-clue/10 text-clue', dot: 'bg-clue' },
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
            <span className="hidden items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-pass sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-pass animate-pulse-dot" />
              Streaming
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
        className="scanlines relative min-h-0 flex-1 space-y-2 overflow-y-auto bg-ink-950 p-3"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {logs.map((log, i) => {
            const lv = LEVEL[log.level];
            const isOpen = open === log.id;

            return (
              <motion.div
                key={log.id}
                layout
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 14 }}
                transition={{ delay: Math.min(i * 0.05, 0.4), duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={cx(
                  'relative overflow-hidden rounded-[5px] border bg-ink-800 p-3 pl-4 transition-colors',
                  log.level === 'error' ? 'border-fail/30' : 'border-ink-line',
                )}
              >
                <span className={cx('absolute inset-y-0 left-0 w-[3px]', lv.dot)} />

                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cx('grid h-5 w-5 place-items-center rounded-[4px] border', lv.cls)}>
                        {lv.icon}
                      </span>
                      <span className="font-mono text-[10px] text-fg-mute tnum">
                        {log.timestamp}
                      </span>
                      <span
                        className={cx(
                          'rounded border px-1.5 py-[1px] font-mono text-[9px] font-bold uppercase tracking-[0.12em]',
                          lv.cls,
                        )}
                      >
                        {log.level}
                      </span>
                      <span className="rounded border border-ink-edge bg-ink-900 px-1.5 py-[1px] font-mono text-[9px] uppercase tracking-[0.1em] text-fg-mute">
                        {log.source}
                      </span>
                    </div>

                    <p className="mt-2 select-text whitespace-pre-wrap break-words font-mono text-[12px] leading-relaxed text-fg">
                      {log.message}
                    </p>
                  </div>

                  {log.stackTrace && (
                    <button
                      onClick={() => setOpen(isOpen ? null : log.id)}
                      className="flex shrink-0 items-center gap-1 rounded-[4px] border border-ink-edge bg-ink-900 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-fg-mute transition-colors hover:border-signal/50 hover:text-signal"
                    >
                      Stack
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
                      <div className="mt-3 space-y-1 rounded-[4px] border border-fail/30 bg-ink-950 p-2.5 font-mono text-[10.5px] text-fail/90">
                        {log.stackTrace.map((st, idx) => (
                          <div key={idx} className="border-l-2 border-fail/40 pl-2.5">
                            {st}
                          </div>
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
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-fg-mute">
                No events at this level
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-ink-line bg-ink-700/60 px-3.5 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-fg-mute">
        <span>tail -f app.log</span>
        <span className="text-fail">{counts.error} error(s) on record</span>
      </div>
    </Panel>
  );
};
