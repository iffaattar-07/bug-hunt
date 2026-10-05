'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

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
    <div className="panel relative overflow-hidden">
      {/* header */}
      <div className="flex items-center justify-between border-b border-ink-line bg-ink-850 px-4 py-3">
        <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.05em] text-fg-dim">
          <span className="text-signal">▸</span>
          <span>incident-channel.log</span>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.1em] text-pass">
          <span className="h-1.5 w-1.5 rounded-full bg-pass animate-pulse-dot" />
          rec
        </span>
      </div>

      {/* body */}
      <div
        ref={bodyRef}
        className="scanlines relative h-[224px] space-y-2.5 overflow-y-auto bg-ink-950 px-4 py-4 font-mono text-[11.5px] leading-[1.7] sm:h-[252px]"
      >
        {typed.lines.map((l, i) => (
          <motion.div
            key={`${i}-${l.text}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex gap-2.5"
          >
            <span className="shrink-0 select-none text-fg-mute/60 tnum">
              {String(10 + i).padStart(2, '0')}
            </span>
            <span className={`w-[46px] shrink-0 ${toneCls[l.tone]}`}>[{l.tag}]</span>
            <span className="min-w-0 break-words text-fg-dim">{l.text}</span>
          </motion.div>
        ))}

        {(current || typed.idx >= SCRIPT.length) && (
          <div className="flex gap-2.5">
            <span className="shrink-0 select-none text-fg-mute/60 tnum">
              {String(10 + typed.lines.length).padStart(2, '0')}
            </span>
            <span
              className={`w-[46px] shrink-0 ${
                current ? toneCls[current.tone] : 'text-pass'
              }`}
            >
              {current ? `[${current.tag}]` : '[READY]'}
            </span>
            <span className="min-w-0 break-words text-fg">
              {current ? typed.partial : 'awaiting investigator'}
              <span className="ml-[1px] inline-block h-[13px] w-[7px] translate-y-[2px] bg-signal animate-blink" />
            </span>
          </div>
        )}
      </div>

      {/* status strip */}
      <div className="flex items-center gap-3 border-t border-ink-line bg-ink-850 px-4 py-2.5 font-mono text-[10px] tracking-[0.06em] text-fg-mute">
        <span>utf-8 · lf · read-only</span>
        <span className="leader" />
        <span className="text-signal">branch: bug-hunt/prime</span>
      </div>
    </div>
  );
};
