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

export default function Home() {
  const { stage } = useLab();

  return (
    <div className="w-full pb-16">
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {stage === 'landing' && <LandingView />}
          {stage === 'select' && <ChallengeSelection />}
          {stage === 'investigate' && <InvestigationWorkspace />}
          {stage === 'diagnose' && <DiagnosisStage />}
          {stage === 'fix' && <FixStage />}
          {stage === 'verify' && <VerificationStage />}
          {stage === 'report' && <EngineeringReportStage />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
