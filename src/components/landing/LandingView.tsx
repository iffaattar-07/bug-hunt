'use client';

import React from 'react';
import { useLab } from '@/context/LabContext';
import { ArrowRight, ArrowUpRight, Radio } from 'lucide-react';
import { motion } from 'framer-motion';
import { LiveTerminal } from './LiveTerminal';
import { Counter, cx } from '@/components/ui/primitives';

const STEPS = [
  {
    step: '01',
    title: 'Pick a case',
    desc: 'Four production incidents across JavaScript, Python, C and C++.',
    meta: 'intake',
  },
  {
    step: '02',
    title: 'Investigate',
    desc: 'Read the source, watch the runtime log, crack sealed clues.',
    meta: 'read',
  },
  {
    step: '03',
    title: 'Diagnose',
    desc: 'Commit to a root-cause hypothesis. Get graded instantly.',
    meta: 'judge',
  },
  {
    step: '04',
    title: 'Ship the fix',
    desc: 'Compare candidate diffs side by side. Choose the clean one.',
    meta: 'patch',
  },
  {
    step: '05',
    title: 'Verify',
    desc: 'Run the regression suite and watch every spec go green.',
    meta: 'prove',
  },
  {
    step: '06',
    title: 'File the report',
    desc: 'Export a post-mortem with root cause, diff and metrics.',
    meta: 'close',
  },
];

const HEAD = [
  { text: 'Find', cls: 'text-fg' },
  { text: 'the bug.', cls: 'text-fg' },
  { text: 'Prove', cls: 'text-signal' },
  { text: 'the fix.', cls: 'text-signal' },
];

const ease = [0.16, 1, 0.3, 1] as const;

export const LandingView: React.FC = () => {
  const { setStage } = useLab();

  return (
    <div className="relative mx-auto w-full max-w-[1240px] px-4 pb-6 pt-10 sm:px-6 sm:pt-14">
      {/* ============================ HERO ============================ */}
      <section className="relative grid items-start gap-12 pb-16 lg:grid-cols-12 lg:gap-8">
        {/* margin rail — printed-manual spine */}
        <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-6 lg:block">
          <span className="absolute bottom-0 left-1 origin-bottom-left -rotate-90 whitespace-nowrap font-mono text-[10px] tracking-[0.34em] text-fg-mute/70">
            BUG HUNT — FIELD OPS — SHEET 01
          </span>
        </div>

        <div className="lg:col-span-7 lg:pl-10">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] tracking-[0.08em] text-fg-mute"
          >
            <span className="text-signal">§ 00</span>
            <span className="hidden h-px w-8 bg-ink-edge sm:block" />
            <span>incident intake · open</span>
            <span className="flex items-center gap-1.5 text-pass">
              <span className="h-1.5 w-1.5 rounded-full bg-pass animate-pulse-dot" />
              live
            </span>
          </motion.div>

          <h1 className="mt-7 font-display text-[44px] font-extrabold leading-[0.9] tracking-[-0.045em] sm:text-[62px] lg:text-[76px]">
            {HEAD.map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i + 0.08, duration: 0.5, ease }}
                className={cx('mr-[0.22em] inline-block', w.cls)}
              >
                {w.text}
              </motion.span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.45, ease }}
            className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start"
          >
            <p className="max-w-[42ch] border-l border-signal/60 pl-4 text-[15px] leading-[1.75] text-fg-dim">
              A production incident lands on your desk. Isolate the root cause from
              real logs, defend your diagnosis, ship a clean fix and file the
              post-mortem — before the clock stops counting in your favour.
            </p>
            <div className="shrink-0 font-mono text-[11px] leading-[2] tracking-[0.04em] text-fg-mute">
              <div className="flex items-baseline gap-2">
                <span>lang</span>
                <span className="leader" />
                <span className="text-fg-dim">js · py · c · c++</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span>mode</span>
                <span className="leader" />
                <span className="text-fg-dim">solo / timed</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span>output</span>
                <span className="leader" />
                <span className="text-fg-dim">post-mortem</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.45, ease }}
            className="mt-9 flex flex-wrap items-center gap-5"
          >
            <button onClick={() => setStage('select')} className="group btn-primary">
              <span>Start the hunt</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.06em] text-fg-mute">
              <Radio className="h-3.5 w-3.5 text-clue" />
              4 open incidents
            </span>
          </motion.div>

          {/* ledger stat row — asymmetric, not three equal boxes */}
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="mt-12 grid max-w-xl grid-cols-3 border-t border-ink-line pt-4"
          >
            {[
              { n: 4, s: '', l: 'incidents' },
              { n: 6, s: '', l: 'ops stages' },
              { n: 100, s: '%', l: 'coverage' },
            ].map((s, i) => (
              <div
                key={s.l}
                className={cx('pr-4', i > 0 && 'border-l border-ink-line pl-4')}
              >
                <dd className="font-display text-[30px] font-extrabold leading-none tracking-[-0.04em] text-fg">
                  <Counter to={s.n} suffix={s.s} />
                </dd>
                <dt className="mt-2 font-mono text-[10px] tracking-[0.1em] text-fg-mute">
                  {s.l}
                </dt>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* terminal — dropped below the fold-line, deliberately off-axis */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.6, ease }}
          className="relative lg:col-span-5 lg:mt-16"
        >
          <span className="pointer-events-none absolute -left-3 -top-3 hidden h-6 w-6 border-l border-t border-signal/50 lg:block" />
          <span className="pointer-events-none absolute -bottom-3 -right-3 hidden h-6 w-6 border-b border-r border-signal/50 lg:block" />
          <LiveTerminal />
        </motion.div>
      </section>

      <div className="hairline" />

      {/* ========================= OPS PROTOCOL ======================== */}
      <section className="pb-16 pt-14">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="font-mono text-[11px] tracking-[0.08em] text-signal">
              § 01 — ops protocol
            </span>
            <h2 className="mt-3 max-w-[16ch] font-display text-[34px] font-extrabold leading-[0.98] tracking-[-0.04em] text-fg sm:text-[42px]">
              Six stages. One verdict.
            </h2>
          </div>
          <p className="max-w-[36ch] border-l border-ink-line pl-4 text-[13.5px] leading-[1.7] text-fg-mute">
            Every incident runs the same disciplined loop — the same one an
            on-call engineer walks at 3am.
          </p>
        </div>

        {/* index list — a table of contents, not a card grid */}
        <ol className="border-t border-ink-line">
          {STEPS.map((s, i) => (
            <motion.li
              key={s.step}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.05, duration: 0.4, ease }}
              className={cx(
                'group border-b border-ink-line transition-colors duration-200 hover:bg-white/[0.018]',
                i === 2 && 'lg:pl-10',
                i === 3 && 'lg:pr-10',
              )}
            >
              <div className="flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:gap-7">
                <span className="w-12 shrink-0 font-display text-[26px] font-extrabold leading-none tracking-[-0.04em] text-ink-400 transition-colors duration-200 group-hover:text-signal tnum">
                  {s.step}
                </span>

                <h3 className="w-[190px] shrink-0 font-display text-[19px] font-bold leading-tight tracking-[-0.02em] text-fg">
                  {s.title}
                </h3>

                <span className="hidden h-px flex-1 self-center lg:block" />

                <p className="max-w-[46ch] text-[13.5px] leading-[1.65] text-fg-dim">
                  {s.desc}
                </p>

                <span className="hidden w-16 shrink-0 text-right font-mono text-[10px] tracking-[0.1em] text-fg-mute transition-colors duration-200 group-hover:text-signal sm:block">
                  {s.meta}
                </span>
              </div>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* =========================== CTA BAND ========================= */}
      <section className="crop relative mb-6 border border-ink-line bg-ink-850">
        <div className="hazard h-[5px] w-full" />
        <div className="flex flex-col items-start gap-7 px-6 py-10 sm:px-10 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-mono text-[11px] tracking-[0.08em] text-fg-mute">
              § 02 — clearance
            </span>
            <h2 className="mt-3 max-w-[18ch] font-display text-[30px] font-extrabold leading-[1.02] tracking-[-0.04em] text-fg sm:text-[38px]">
              The clock is already running.
            </h2>
            <p className="mt-3 max-w-[52ch] text-[14px] leading-[1.7] text-fg-dim">
              Four incidents are open. Pick one, get your hands on the code and
              earn the clearance stamp.
            </p>
          </div>
          <button onClick={() => setStage('select')} className="group btn-primary shrink-0">
            <span>Enter the lab</span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </div>
      </section>
    </div>
  );
};
