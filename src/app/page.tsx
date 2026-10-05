'use client';

import React from 'react';
import { useLab } from '@/context/LabContext';
import { LandingView } from '@/components/landing/LandingView';
import { ChallengeSelection } from '@/components/selection/ChallengeSelection';
import { InvestigationWorkspace } from '@/components/workspace/InvestigationWorkspace';
import { DiagnosisStage } from '@/components/stages/DiagnosisStage';
import { FixStage } from '@/components/stages/FixStage';
import { VerificationStage } from '@/components/stages/VerificationStage';
import { EngineeringReportStage } from '@/components/stages/EngineeringReportStage';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { LabStage } from '@/types/challenge';

const ORDER: LabStage[] = [
  'landing',
  'select',
  'investigate',
  'diagnose',
  'fix',
  'verify',
  'report',
];

const VIEWS: Record<LabStage, React.ReactNode> = {
  landing: <LandingView />,
  select: <ChallengeSelection />,
  investigate: <InvestigationWorkspace />,
  diagnose: <DiagnosisStage />,
  fix: <FixStage />,
  verify: <VerificationStage />,
  report: <EngineeringReportStage />,
};

const EASE = [0.16, 1, 0.3, 1] as const;

/* scenes enter with weight, but leave fast — motion gets out of the way */
const SCENE = {
  enter: (d: number) => ({
    opacity: 0,
    x: d * 34,
    y: 12,
    scale: 0.994,
    transition: { duration: 0.44, ease: EASE },
  }),
  center: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { duration: 0.44, ease: EASE },
  },
  exit: (d: number) => ({
    opacity: 0,
    x: d * -18,
    scale: 0.994,
    transition: { duration: 0.2, ease: EASE },
  }),
} as const;

const REDUCED = {
  enter: { opacity: 0, transition: { duration: 0.2 } },
  center: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
} as const;

export default function Home() {
  const { stage } = useLab();
  const reduce = useReducedMotion();
  const prev = React.useRef(ORDER.indexOf(stage));

  const idx = ORDER.indexOf(stage);
  const dir = idx >= prev.current ? 1 : -1;
  prev.current = idx;

  /* every scene opens from the top of its sheet */
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.scrollY > 40) window.scrollTo(0, 0);
  }, [stage]);

  return (
    <div className="relative w-full pb-14">
      {/* scene wipe: a hairline of light crosses the sheet on every cut */}
      {!reduce && (
        <motion.span
          key={`wipe-${stage}`}
          aria-hidden
          className="hairline-gold pointer-events-none fixed left-0 top-[60px] z-40 w-full origin-left"
          initial={{ scaleX: 0, opacity: 0.85 }}
          animate={{ scaleX: 1, opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        />
      )}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={stage}
          custom={dir}
          variants={reduce ? REDUCED : SCENE}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {VIEWS[stage]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
