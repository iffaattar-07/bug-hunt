'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StreamLine {
  tag: string;
  tone: 'signal' | 'fail' | 'pass' | 'trace' | 'mute';
  text: string;
  delay: number;
}

const SCRIPT: StreamLine[] = [
  { tag: 'BOOT', tone: 'signal', text: 'lab.kernel :: attaching probe to worker#3', delay: 900 },
  { tag: 'TRACE', tone: 'trace', text: 'hydrate() → userStore.js:12 (rehydrating session)', delay: 1400 },
  { tag: 'ERROR', tone: 'fail', text: 'state clobbered — DEFAULT_USER overwrote saved session', delay: 1600 },
  { tag: 'HINT', tone: 'mute', text: '3 clues sealed · 4 candidate fixes queued', delay: 1200 },
  { tag: 'READY', tone: 'pass', text: 'incident channel open. awaiting investigator…', delay: 1300 },
];

const toneCls: Record<StreamLine['tone'], string> = {
  signal: 'text-signal',
  fail: 'text-fail',
  pass: 'text-pass',
  trace: 'text-trace',
  mute: 'text-fg-mute',
};

export const LiveTerminal: React.FC = () => {
  const [typed, setTyped] = useState<{ lines: StreamLine[]; partial: string; idx: number }>({
    lines: [],
    partial: '',
    idx: 0,
  });
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let char = 0;
    let timer: ReturnType<typeof setTimeout>;

    const run = (lineIdx: number) => {
      if (lineIdx >= SCRIPT.length) {
        timer = setTimeout(() => {
          if (cancelled) return;
          setTyped({ lines: [], partial: '', idx: 0 });
          char = 0;
          run(0);
        }, 3800);
        return;
      }

      const line = SCRIPT[lineIdx];
      char = 0;

      const type = () => {
        if (cancelled) return;
        char += 1;
        setTyped({
          lines: SCRIPT.slice(0, lineIdx),
          partial: line.text.slice(0, char),
          idx: lineIdx,
        });

        if (char < line.text.length) {
          timer = setTimeout(type, 16 + Math.random() * 26);
        } else {
          timer = setTimeout(() => {
            if (cancelled) return;
            setTyped({ lines: SCRIPT.slice(0, lineIdx + 1), partial: '', idx: lineIdx + 1 });
            run(lineIdx + 1);
          }, line.delay);
        }
      };

      timer = setTimeout(type, 340);
    };

    run(0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [typed]);

  const current = SCRIPT[typed.idx];

  return (
    <div className="panel group relative overflow-hidden">
      {/* window chrome */}
      <div className="flex items-center justify-between border-b border-ink-line bg-ink-700 px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-fail/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-signal/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-pass/80" />
          <span className="ml-2 font-mono text-[10px] text-fg-mute">
            incident-channel.log
          </span>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-pass">
          <span className="h-1.5 w-1.5 rounded-full bg-pass animate-pulse-dot" />
          Live
        </span>
      </div>

      {/* body */}
      <div
        ref={bodyRef}
        className="scanlines relative h-[224px] space-y-2.5 overflow-y-auto bg-ink-950 p-4 font-mono text-[11.5px] leading-relaxed sm:h-[248px]"
      >
        {/* slow CRT sweep */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-signal/[0.07] to-transparent animate-scan opacity-60" />

        {typed.lines.map((l, i) => (
          <motion.div
            key={`${i}-${l.text}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.24 }}
            className="flex gap-2.5"
          >
            <span className="shrink-0 select-none text-fg-mute/60">
              {String(10 + i).padStart(2, '0')}:
            </span>
            <span className={`w-[46px] shrink-0 font-bold ${toneCls[l.tone]}`}>
              [{l.tag}]
            </span>
            <span className="min-w-0 break-words text-fg-dim">{l.text}</span>
          </motion.div>
        ))}

        {(current || typed.idx >= SCRIPT.length) && (
          <div className="flex gap-2.5">
            <span className="shrink-0 select-none text-fg-mute/60">
              {String(10 + typed.lines.length).padStart(2, '0')}:
            </span>
            <span
              className={`w-[46px] shrink-0 font-bold ${
                current ? toneCls[current.tone] : 'text-pass'
              }`}
            >
              {current ? `[${current.tag}]` : '[ READY]'}
            </span>
            <span className="min-w-0 break-words text-fg">
              {current ? typed.partial : 'awaiting investigator'}
              <span className="ml-[1px] inline-block h-[13px] w-[7px] translate-y-[2px] bg-signal animate-blink" />
            </span>
          </div>
        )}
      </div>

      {/* status strip */}
      <div className="flex items-center justify-between border-t border-ink-line bg-ink-800 px-3.5 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-fg-mute">
        <span>utf-8 · lf · read-only</span>
        <span className="text-signal">branch: bug-hunt/prime</span>
      </div>
    </div>
  );
};
