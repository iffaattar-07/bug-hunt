'use client';

import React from 'react';
import { useLab } from '@/context/LabContext';
import { ArrowRight, ArrowUpRight, Radio } from 'lucide-react';
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { LiveTerminal } from './LiveTerminal';
import { Counter, cx } from '@/components/ui/primitives';
import { Magnetic } from '@/components/ui/motion';

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
  { text: 'Prove', cls: 'grad-gold' },
  { text: 'the fix.', cls: 'grad-gold' },
];

const TICKER = [
  'race condition in session hydrate',
  'unbounded recursion in config merge',
  'off-by-one in buffer write',
  'timer leaked after unmount',
  'NaN folded into the revenue total',
  'segfault on malformed packet',
  'coverage 100% · specs green',
  'root cause isolated · patch staged',
];

const ease = [0.16, 1, 0.3, 1] as const;

export const LandingView: React.FC = () => {
  const { setStage } = useLab();
  const reduce = useReducedMotion();

  /* ---- pointer light over the hero ---- */
  const heroRef = React.useRef<HTMLElement>(null);
  const px = useMotionValue(520);
  const py = useMotionValue(240);
  const sx = useSpring(px, { stiffness: 90, damping: 22, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 90, damping: 22, mass: 0.4 });
  const light = useMotionTemplate`radial-gradient(440px circle at ${sx}px ${sy}px, rgba(233,185,73,0.13), rgba(233,185,73,0.04) 40%, transparent 70%)`;

  /* ---- protocol rail draws with the scroll ---- */
  const railRef = React.useRef<HTMLOListElement>(null);
  const { scrollYProgress: railProgress } = useScroll({
    target: railRef,
    offset: ['start 88%', 'end 62%'],
  });
  const railH = useTransform(railProgress, [0, 1], ['0%', '100%']);

  /* ---- the ghost word drifts against the page ---- */
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const ghostY = useTransform(heroProgress, [0, 1], ['0%', '26%']);
  const ghostFade = useTransform(heroProgress, [0, 1], [1, 0.25]);

  return (
    <div className="relative mx-auto w-full max-w-[1240px] px-4 pb-6 pt-10 sm:px-6 sm:pt-14">
      {/* ============================ HERO ============================ */}
      <section
        ref={heroRef}
        onPointerMove={(e) => {
          if (reduce) return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set(e.clientX - r.left);
          py.set(e.clientY - r.top);
        }}
        className="relative grid items-start gap-12 pb-16 lg:grid-cols-12 lg:gap-8"
      >
        {/* atmosphere: ghost type + pointer light */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute left-[-6vw] top-[30%]"
            style={reduce ? undefined : { y: ghostY, opacity: ghostFade }}
          >
            <span className="text-ghost block whitespace-nowrap font-display text-[26vw] font-extrabold leading-none tracking-[-0.06em]">
              DEBUG · HUNT
            </span>
          </motion.div>
          {!reduce && (
            <motion.div className="absolute inset-0" style={{ backgroundImage: light }} />
          )}
        </div>

        {/* margin rail — printed-manual spine */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 hidden h-full w-6 lg:block">
          <span className="absolute bottom-0 left-1 origin-bottom-left -rotate-90 whitespace-nowrap font-mono text-[10px] tracking-[0.34em] text-fg-mute/70">
            BUG HUNT — FIELD OPS — SHEET 01
          </span>
        </div>

        <div className="relative z-10 lg:col-span-7 lg:pl-10">
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

          {/* word-by-word mask reveal — the type arrives, it does not fade */}
          <h1 className="mt-7 font-display text-[44px] font-extrabold leading-[0.92] tracking-[-0.045em] sm:text-[62px] lg:text-[76px]">
            {HEAD.map((w, i) => (
              <span
                key={i}
                className="mr-[0.2em] inline-block overflow-hidden pb-[0.06em] align-bottom"
              >
                <motion.span
                  initial={reduce ? { opacity: 0 } : { y: '112%' }}
                  animate={reduce ? { opacity: 1 } : { y: '0%' }}
                  transition={{ delay: 0.07 * i + 0.1, duration: 0.75, ease }}
                  className={cx('inline-block', w.cls)}
                >
                  {w.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.span
            aria-hidden
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease }}
            className="hairline-gold mt-6 block max-w-[430px] origin-left"
          />

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
            <Magnetic>
              <button onClick={() => setStage('select')} className="group btn-primary">
                <span>Start the hunt</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </Magnetic>

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
          className="relative z-10 lg:col-span-5 lg:mt-16"
        >
          <span className="pointer-events-none absolute -left-3 -top-3 hidden h-6 w-6 border-l border-t border-signal/50 lg:block" />
          <span className="pointer-events-none absolute -bottom-3 -right-3 hidden h-6 w-6 border-b border-r border-signal/50 lg:block" />
          <LiveTerminal />
        </motion.div>

        {/* scroll cue */}
        {!reduce && (
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="pointer-events-none absolute bottom-0 left-0 z-10 hidden items-center gap-3 font-mono text-[10px] tracking-[0.28em] text-fg-mute/70 lg:flex"
          >
            scroll
            <motion.span
              animate={{ scaleY: [0, 1, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="block h-6 w-px origin-center bg-signal/60"
            />
          </motion.div>
        )}
      </section>

      {/* =========================== TICKER =========================== */}
      <div className="ticker border-y border-ink-line bg-ink-850/50 py-3">
        <div className="ticker-track">
          {[0, 1].map((half) => (
            <div key={half} className="flex shrink-0 items-center">
              {TICKER.map((t) => (
                <span
                  key={`${half}-${t}`}
                  className="flex items-center gap-3 whitespace-nowrap px-6 font-mono text-[11px] tracking-[0.1em] text-fg-mute"
                >
                  <span className="text-signal">▸</span>
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

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
        <ol ref={railRef} className="relative border-t border-ink-line">
          {/* the route draws itself as you read down */}
          {!reduce && (
            <motion.span
              aria-hidden
              style={{ height: railH }}
              className="absolute -left-3 top-0 hidden w-px origin-top bg-gradient-to-b from-signal via-signal/60 to-transparent lg:block"
            />
          )}
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
                <span className="relative w-12 shrink-0 font-display text-[26px] font-extrabold leading-none tracking-[-0.04em] text-ink-400 transition-colors duration-200 group-hover:text-signal tnum">
                  {s.step}
                </span>

                <h3 className="w-[190px] shrink-0 font-display text-[19px] font-bold leading-tight tracking-[-0.02em] text-fg transition-transform duration-300 ease-out group-hover:translate-x-1">
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
          <Magnetic className="shrink-0">
            <button onClick={() => setStage('select')} className="group btn-primary">
              <span>Enter the lab</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
          </Magnetic>
        </div>
      </section>
    </div>
  );
};
