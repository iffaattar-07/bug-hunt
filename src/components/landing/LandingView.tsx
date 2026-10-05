'use client';

import React from 'react';
import { useLab } from '@/context/LabContext';
import {
  Search,
  ShieldAlert,
  FileCode2,
  CheckCircle2,
  FileText,
  ArrowRight,
  Layers,
  Crosshair,
  Radio,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LiveTerminal } from './LiveTerminal';
import { Counter, cx } from '@/components/ui/primitives';

const STEPS = [
  {
    step: '01',
    title: 'Pick a case',
    desc: 'Four production incidents across JavaScript, Python, C and C++.',
    icon: <Layers className="h-4 w-4" />,
    tone: 'signal' as const,
  },
  {
    step: '02',
    title: 'Investigate',
    desc: 'Read the source, watch the runtime log, crack sealed clues.',
    icon: <Search className="h-4 w-4" />,
    tone: 'trace' as const,
  },
  {
    step: '03',
    title: 'Diagnose',
    desc: 'Commit to a root-cause hypothesis. Get graded instantly.',
    icon: <ShieldAlert className="h-4 w-4" />,
    tone: 'clue' as const,
  },
  {
    step: '04',
    title: 'Ship the fix',
    desc: 'Compare candidate diffs side by side. Choose the clean one.',
    icon: <FileCode2 className="h-4 w-4" />,
    tone: 'signal' as const,
  },
  {
    step: '05',
    title: 'Verify',
    desc: 'Run the regression suite and watch every spec go green.',
    icon: <CheckCircle2 className="h-4 w-4" />,
    tone: 'pass' as const,
  },
  {
    step: '06',
    title: 'File the report',
    desc: 'Export a post-mortem with root cause, diff and metrics.',
    icon: <FileText className="h-4 w-4" />,
    tone: 'trace' as const,
  },
];

const toneRing = {
  signal: 'border-signal/35 bg-signal/10 text-signal',
  trace: 'border-trace/35 bg-trace/10 text-trace',
  clue: 'border-clue/35 bg-clue/10 text-clue',
  pass: 'border-pass/35 bg-pass/10 text-pass',
} as const;

const HEAD = [
  { text: 'Find', cls: 'text-fg' },
  { text: 'the bug.', cls: 'text-fg' },
  { text: 'Prove', cls: 'text-signal' },
  { text: 'the fix.', cls: 'text-signal' },
];

export const LandingView: React.FC = () => {
  const { setStage } = useLab();

  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 pb-4 pt-10 sm:px-6 sm:pt-14">
      {/* ============================ HERO ============================ */}
      <section className="grid items-center gap-10 pb-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 rounded-[5px] border border-ink-edge bg-ink-800 py-1.5 pl-1.5 pr-3"
          >
            <span className="grid h-5 w-5 place-items-center rounded-[3px] bg-signal text-ink-950">
              <Crosshair className="h-3 w-3" />
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg-dim">
              Field Ops // Debug Lab
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-pass animate-pulse-dot" />
          </motion.div>

          <h1 className="mt-6 font-display text-[42px] font-bold leading-[0.98] tracking-[-0.03em] sm:text-[58px] lg:text-[64px]">
            {HEAD.map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 26, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.06 * i + 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={cx('mr-[0.28em] inline-block', w.cls)}
              >
                {w.text}
              </motion.span>
            ))}
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 block h-[6px] w-full origin-left rounded-full bg-gradient-to-r from-signal via-signal/70 to-transparent"
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34, duration: 0.5 }}
            className="mt-7 max-w-[46ch] text-[15px] leading-[1.75] text-fg-dim"
          >
            A production incident lands on your desk. Isolate the root cause from
            real logs, defend your diagnosis, ship a clean fix and file the
            post-mortem — before the clock stops counting in your favour.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.44, duration: 0.5 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <button onClick={() => setStage('select')} className="group btn-primary btn-sweep">
              <span>Start the hunt</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            <div className="flex items-center gap-2.5 rounded-[5px] border border-ink-line bg-ink-800 px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-fg-mute">
              <Radio className="h-3.5 w-3.5 text-clue" />
              4 open incidents
            </div>
          </motion.div>

          {/* stat strip */}
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-11 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-lg border border-ink-line bg-ink-line"
          >
            {[
              { n: 4, s: '', l: 'Incidents' },
              { n: 6, s: '', l: 'Ops stages' },
              { n: 100, s: '%', l: 'Coverage' },
            ].map((s) => (
              <div key={s.l} className="bg-ink-800 px-4 py-3.5">
                <dd className="font-display text-2xl font-bold text-fg">
                  <Counter to={s.n} suffix={s.s} />
                </dd>
                <dt className="mt-1 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-fg-mute">
                  {s.l}
                </dt>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5"
        >
          <LiveTerminal />
        </motion.div>
      </section>

      <div className="hairline" />

      {/* ========================= OPS PROTOCOL ======================== */}
      <section className="pb-16 pt-14">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-signal">
              Ops protocol — six stages
            </span>
            <h2 className="mt-3 font-display text-[30px] font-bold leading-none tracking-tight text-fg sm:text-[36px]">
              Six stages. One verdict.
            </h2>
          </div>
          <p className="max-w-[38ch] text-[13px] leading-relaxed text-fg-mute">
            Every incident runs the same disciplined loop — the same one an
            on-call engineer walks at 3am.
          </p>
        </div>

        <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* connecting rail behind the grid */}
          <div className="pointer-events-none absolute -top-6 left-0 hidden h-px w-full bg-ink-line lg:block" />

          {STEPS.map((s, i) => (
            <motion.article
              key={s.step}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -5 }}
              className="group relative flex flex-col overflow-hidden rounded-lg border border-ink-line bg-ink-800 p-5 shadow-panel transition-colors duration-300 hover:border-ink-edge"
            >
              {/* top rail that fills on hover */}
              <span className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-signal transition-transform duration-500 ease-out group-hover:scale-x-100" />

              <div className="flex items-start justify-between">
                <span
                  className={cx(
                    'grid h-10 w-10 place-items-center rounded-[6px] border transition-transform duration-300 group-hover:scale-110',
                    toneRing[s.tone],
                  )}
                >
                  {s.icon}
                </span>
                <span className="font-display text-[34px] font-bold leading-none text-ink-600 transition-colors duration-300 group-hover:text-signal/40 tnum">
                  {s.step}
                </span>
              </div>

              <h3 className="mt-5 font-display text-[17px] font-semibold tracking-tight text-fg">
                {s.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-fg-mute">{s.desc}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* =========================== CTA BAND ========================= */}
      <section className="mb-6 overflow-hidden rounded-xl border border-ink-line bg-ink-800 shadow-panel">
        <div className="h-[7px] w-full hazard opacity-90" />
        <div className="flex flex-col items-start gap-6 px-6 py-9 sm:px-9 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-[26px] font-bold leading-tight tracking-tight text-fg sm:text-[30px]">
              The clock is already running.
            </h2>
            <p className="mt-2 max-w-[48ch] text-[13.5px] leading-relaxed text-fg-dim">
              Four incidents are open. Pick one, get your hands on the code and
              earn the clearance stamp.
            </p>
          </div>
          <button onClick={() => setStage('select')} className="group btn-primary btn-sweep shrink-0">
            <span>Enter the lab</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </section>
    </div>
  );
};
