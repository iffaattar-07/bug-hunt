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
import { motion, AnimatePresence } from 'framer-motion';
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

export default function Home() {
  const { stage } = useLab();
  const prev = React.useRef(ORDER.indexOf(stage));

  const idx = ORDER.indexOf(stage);
  const dir = idx >= prev.current ? 1 : -1;
  prev.current = idx;

  return (
    <div className="w-full pb-14">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={stage}
          initial={{ opacity: 0, x: dir * 28, filter: 'blur(5px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: dir * -22, filter: 'blur(5px)' }}
          transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
        >
          {VIEWS[stage]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
