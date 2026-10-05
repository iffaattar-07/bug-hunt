'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(' ');

/* ------------------------------------------------------------------ */
/*  Panel — the single surface primitive used everywhere in the app    */
/* ------------------------------------------------------------------ */
export const Panel: React.FC<{
  children: React.ReactNode;
  className?: string;
  }> = ({ children, className }) => (
  <div className={cx('panel flex flex-col overflow-hidden', className)}>{children}</div>
);

export const PanelHead: React.FC<{
  icon?: React.ReactNode;
  title: string;
  meta?: React.ReactNode;
  action?: React.ReactNode;
  tone?: 'signal' | 'pass' | 'fail' | 'clue' | 'trace';
  tick?: boolean;
}> = ({ icon, title, meta, action, tone = 'signal', tick = false }) => {
  const toneCls = {
    signal: 'text-signal',
    pass: 'text-pass',
    fail: 'text-fail',
    clue: 'text-clue',
    trace: 'text-trace',
  }[tone];

  return (
    <div className={cx('panel-head relative flex-wrap', tick && 'rail-tick pl-4')}>
      <div className="flex min-w-0 items-center gap-2">
        <span className={cx('shrink-0', toneCls)}>{icon}</span>
        <span className="label truncate text-fg">{title}</span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {meta}
        {action}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Chip — small mono metadata capsule                                 */
/* ------------------------------------------------------------------ */
export const Chip: React.FC<{
  children: React.ReactNode;
  className?: string;
  tone?: 'signal' | 'pass' | 'fail' | 'clue' | 'trace' | 'neutral';
}> = ({ children, className, tone = 'neutral' }) => {
  const tones = {
    signal: 'border-signal/35 bg-signal/10 text-signal',
    pass: 'border-pass/35 bg-pass/10 text-pass',
    fail: 'border-fail/35 bg-fail/10 text-fail',
    clue: 'border-clue/35 bg-clue/10 text-clue',
    trace: 'border-trace/35 bg-trace/10 text-trace',
    neutral: 'border-ink-edge bg-ink-700 text-fg-dim',
  } as const;

  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded border px-2 py-[3px] font-mono text-[10px] font-semibold uppercase tracking-[0.12em]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/*  Segmented — sliding pill filter (framer layoutId)                  */
/* ------------------------------------------------------------------ */
export const Segmented: React.FC<{
  options: { value: string; label: string; icon?: React.ReactNode }[];
  value: string;
  onChange: (v: string) => void;
  id: string;
}> = ({ options, value, onChange, id }) => (
  <div className="inline-flex items-center gap-0.5 rounded-md border border-ink-line bg-ink-900 p-1">
    {options.map((opt) => {
      const active = opt.value === value;
      return (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cx(
            'relative rounded px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em] transition-colors',
            active ? 'text-ink-950' : 'text-fg-mute hover:text-fg',
          )}
        >
          {active && (
            <motion.span
              layoutId={`seg-${id}`}
              transition={{ type: 'spring', stiffness: 460, damping: 34 }}
              className="absolute inset-0 rounded bg-signal"
            />
          )}
          <span className="relative flex items-center gap-1.5">
            {opt.icon}
            {opt.label}
          </span>
        </button>
      );
    })}
  </div>
);

/* ------------------------------------------------------------------ */
/*  Meter — blocky arcade progress segments                            */
/* ------------------------------------------------------------------ */
export const Meter: React.FC<{
  value: number;
  max?: number;
  segments?: number;
  tone?: 'signal' | 'pass' | 'fail';
  className?: string;
}> = ({ value, max = 100, segments = 12, tone = 'signal', className }) => {
  const pct = Math.max(0, Math.min(1, value / max));
  const filled = Math.round(pct * segments);
  const color = { signal: 'bg-signal', pass: 'bg-pass', fail: 'bg-fail' }[tone];

  return (
    <div className={cx('flex items-center gap-[3px]', className)}>
      {Array.from({ length: segments }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ scaleY: 0.3, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ delay: i * 0.02, type: 'spring', stiffness: 500, damping: 30 }}
          className={cx(
            'h-full w-full origin-bottom flex-1 rounded-[1px]',
            i < filled ? color : 'bg-ink-600',
          )}
        />
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Counter — eased number roll                                        */
/* ------------------------------------------------------------------ */
export const Counter: React.FC<{
  to: number;
  duration?: number;
  className?: string;
  suffix?: string;
}> = ({ to, duration = 1100, className, suffix = '' }) => {
  const [n, setN] = useState(0);

  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();

    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);

  return (
    <span className={cx('tnum', className)}>
      {n}
      {suffix}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/*  Stamp — rotated verification ink stamp                             */
/* ------------------------------------------------------------------ */
export const Stamp: React.FC<{
  text: string;
  tone?: 'pass' | 'signal';
  className?: string;
}> = ({ text, tone = 'pass', className }) => (
  <motion.div
    initial={{ scale: 2.2, opacity: 0, rotate: -26 }}
    animate={{ scale: 1, opacity: 1, rotate: -13 }}
    transition={{ type: 'spring', stiffness: 260, damping: 14 }}
    className={cx(
      'stamp rounded',
      tone === 'pass'
        ? 'border-pass/70 text-pass'
        : 'border-signal/70 text-signal',
      className,
    )}
  >
    <span className="px-3 py-1.5">{text}</span>
  </motion.div>
);

/* ------------------------------------------------------------------ */
/*  SectionHead — editorial page headers with consistent baseline      */
/* ------------------------------------------------------------------ */
export const SectionHead: React.FC<{
  kicker: string;
  title: React.ReactNode;
  desc?: string;
  right?: React.ReactNode;
  tone?: 'signal' | 'pass' | 'fail' | 'clue' | 'trace';
}> = ({ kicker, title, desc, right, tone = 'signal' }) => {
  const toneCls = {
    signal: 'text-signal',
    pass: 'text-pass',
    fail: 'text-fail',
    clue: 'text-clue',
    trace: 'text-trace',
  }[tone];

  return (
    <div className="flex flex-col gap-5 border-b border-ink-line pb-6 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0 space-y-2.5">
        <div className={cx('flex items-center gap-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.24em]', toneCls)}>
          <span className="h-[7px] w-[7px] rounded-full bg-current animate-pulse-dot" />
          {kicker}
        </div>
        <h1 className="font-display text-2xl font-bold leading-[1.1] tracking-tight text-fg md:text-[28px]">
          {title}
        </h1>
        {desc && <p className="max-w-xl text-[13px] leading-relaxed text-fg-dim">{desc}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Delta row — tiny +/- diff line used in fix & report cards          */
/* ------------------------------------------------------------------ */
export const DiffLine: React.FC<{
  sign: '-' | '+';
  children: string;
}> = ({ sign, children }) => (
  <div
    className={cx(
      'flex gap-3 rounded-[3px] px-2 py-[3px] leading-[1.65]',
      sign === '-' ? 'bg-fail/10 text-fail/90' : 'bg-pass/10 text-pass/90',
    )}
  >
    <span className="w-3 shrink-0 select-none opacity-70">{sign}</span>
    <span className="whitespace-pre">{children}</span>
  </div>
);

