'use client';

import React from 'react';
import { useLab } from '@/context/LabContext';
import { Target, CheckCircle2, CircleAlert, Workflow } from 'lucide-react';
import { Panel, PanelHead } from '@/components/ui/primitives';
import { motion } from 'framer-motion';

export const ExpectedBehavior: React.FC = () => {
  const { activeChallenge } = useLab();

  if (!activeChallenge) return null;

  return (
    <Panel className="h-full">
      <PanelHead
        tone="pass"
        icon={<Target className="h-3.5 w-3.5" />}
        title="Spec: expected vs actual"
        meta={
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-mute">
            read-only
          </span>
        }
      />

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
        {/* architecture */}
        <section>
          <h3 className="mb-2 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-trace">
            <Workflow className="h-3.5 w-3.5" />
            Architecture
          </h3>
          <p className="select-text rounded-[5px] border border-ink-line bg-ink-950 p-3 font-mono text-[11.5px] leading-relaxed text-fg-dim">
            {activeChallenge.architectureOverview}
          </p>
        </section>

        {/* repro steps */}
        <section>
          <h3 className="mb-2 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-signal">
            <CircleAlert className="h-3.5 w-3.5" />
            Reproduction — actual failure
          </h3>
          <ol className="relative ml-1 space-y-2.5 border-l border-dashed border-ink-edge pl-4">
            {activeChallenge.reproductionSteps.map((step, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.07, duration: 0.35 }}
                className="relative flex items-start gap-3"
              >
                <span className="absolute -left-[23px] top-[1px] grid h-[17px] w-[17px] place-items-center rounded-full border border-signal/50 bg-ink-950 font-mono text-[9px] font-bold text-signal tnum">
                  {idx + 1}
                </span>
                <span className="select-text text-[12.5px] leading-relaxed text-fg-dim">
                  {step}
                </span>
              </motion.li>
            ))}
          </ol>
        </section>

        {/* expected */}
        <section>
          <h3 className="mb-2 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-pass">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Expected behaviour
          </h3>
          <div className="relative overflow-hidden rounded-[5px] border border-pass/35 bg-pass/10 p-3.5">
            <span className="absolute inset-y-0 left-0 w-[3px] bg-pass" />
            <p className="select-text pl-1 font-mono text-[12px] leading-relaxed text-pass">
              {activeChallenge.expectedBehavior}
            </p>
          </div>
        </section>
      </div>
    </Panel>
  );
};
