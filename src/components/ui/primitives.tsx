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
      <div className="flex min-w-0 items-center gap-2.5">
        <span className={cx('shrink-0', toneCls)}>{icon}</span>
        <span className="truncate font-mono text-[11px] font-medium tracking-[0.05em] text-fg">
          {title}
        </span>
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
    signal: 'border-signal/40 bg-signal/[0.07] text-signal',
    pass: 'border-pass/40 bg-pass/[0.07] text-pass',
    fail: 'border-fail/40 bg-fail/[0.07] text-fail',
    clue: 'border-clue/35 bg-clue/[0.06] text-clue',
    trace: 'border-trace/35 bg-trace/[0.06] text-trace',
    neutral: 'border-ink-edge bg-transparent text-fg-dim',
  } as const;

  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-sm border px-2 py-[3px] font-mono text-[10px] font-medium tracking-[0.06em]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/*  Segmented — sliding block filter (framer layoutId)                 */
/* ------------------------------------------------------------------ */
export const Segmented: React.FC<{
  options: { value: string; label: string; icon?: React.ReactNode }[];
  value: string;
  onChange: (v: string) => void;
  id: string;
}> = ({ options, value, onChange, id }) => (
  <div className="inline-flex items-center gap-0.5 rounded-sm border border-ink-line bg-ink-900 p-1">
    {options.map((opt) => {
      const active = opt.value === value;
      return (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cx(
            'relative rounded-sm px-2.5 py-1 font-mono text-[10px] font-medium tracking-[0.06em] transition-colors duration-150',
            active ? 'text-ink-950' : 'text-fg-mute hover:text-fg',
          )}
        >
          {active && (
            <motion.span
              layoutId={`seg-${id}`}
              transition={{ type: 'spring', stiffness: 520, damping: 42 }}
              className="absolute inset-0 rounded-sm bg-signal"
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
/*  Meter — blocky progress segments                                   */
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
        <span
          key={i}
          className={cx(
            'h-full w-full flex-1 origin-bottom rounded-[1px] transition-colors duration-300',
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
}> = ({ to, duration = 900, className, suffix = '' }) => {
  const [n, setN] = useState(0);

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setN(to);
      return;
    }

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
/*  Stamp — ink stamp, pressed slightly off-square                      */
/* ------------------------------------------------------------------ */
export const Stamp: React.FC<{
  text: string;
  tone?: 'pass' | 'signal';
  className?: string;
}> = ({ text, tone = 'pass', className }) => (
  <motion.div
    initial={{ scale: 1.6, opacity: 0, rotate: -18 }}
    animate={{ scale: 1, opacity: 1, rotate: -7 }}
    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
    className={cx(
      'stamp',
      tone === 'pass' ? 'border-pass/70 text-pass' : 'border-signal/70 text-signal',
      className,
    )}
  >
    <span className="px-3 py-1.5">{text}</span>
  </motion.div>
);

/* ------------------------------------------------------------------ */
/*  SectionHead — editorial page header: kicker, rule, big title       */
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
    <div className="flex flex-col gap-6 border-b border-ink-line pb-7 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <div
          className={cx(
            'flex items-center gap-3 font-mono text-[11px] font-medium tracking-[0.08em]',
            toneCls,
          )}
        >
          <span className="text-fg-mute">§</span>
          {kicker}
        </div>
        <h1 className="mt-3 max-w-[22ch] font-display text-[30px] font-extrabold leading-[1.02] tracking-[-0.035em] text-fg md:text-[38px]">
          {title}
        </h1>
        {desc && (
          <p className="mt-3 max-w-[54ch] text-[14px] leading-[1.7] text-fg-dim">{desc}</p>
        )}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  DiffLine — tiny +/- diff line used in fix & report cards           */
/* ------------------------------------------------------------------ */
export const DiffLine: React.FC<{
  sign: '-' | '+';
  children: string;
}> = ({ sign, children }) => (
  <div
    className={cx(
      'flex gap-3 px-2 py-[3px] leading-[1.65]',
      sign === '-' ? 'bg-fail/[0.09] text-fail/90' : 'bg-pass/[0.09] text-pass/90',
    )}
  >
    <span className="w-3 shrink-0 select-none opacity-70">{sign}</span>
    <span className="whitespace-pre">{children}</span>
  </div>
);
