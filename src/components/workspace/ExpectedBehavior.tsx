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
          <span className="font-mono text-[10.5px] tracking-[0.06em] text-fg-mute">
            read-only
          </span>
        }
      />

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4">
        {/* architecture */}
        <section>
          <h3 className="mb-2.5 flex items-center gap-2 font-mono text-[11px] tracking-[0.06em] text-trace">
            <Workflow className="h-3.5 w-3.5" />
            architecture
          </h3>
          <p className="select-text border border-ink-line bg-ink-950 p-3 font-mono text-[12px] leading-[1.7] text-fg-dim">
            {activeChallenge.architectureOverview}
          </p>
        </section>

        {/* repro steps */}
        <section>
          <h3 className="mb-3 flex items-center gap-2 font-mono text-[11px] tracking-[0.06em] text-signal">
            <CircleAlert className="h-3.5 w-3.5" />
            reproduction — actual failure
          </h3>
          <ol className="relative ml-1 space-y-3 border-l border-ink-edge pl-5">
            {activeChallenge.reproductionSteps.map((step, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06, duration: 0.3 }}
                className="relative flex items-start gap-3"
              >
                <span className="absolute -left-[27px] top-[1px] grid h-[19px] w-[19px] place-items-center border border-signal/60 bg-ink-950 font-mono text-[9.5px] font-bold text-signal tnum">
                  {idx + 1}
                </span>
                <span className="select-text text-[13px] leading-[1.7] text-fg-dim">
                  {step}
                </span>
              </motion.li>
            ))}
          </ol>
        </section>

        {/* expected */}
        <section>
          <h3 className="mb-2.5 flex items-center gap-2 font-mono text-[11px] tracking-[0.06em] text-pass">
            <CheckCircle2 className="h-3.5 w-3.5" />
            expected behaviour
          </h3>
          <div className="border-l-2 border-pass bg-pass/[0.05] px-4 py-3.5">
            <p className="select-text font-mono text-[12.5px] leading-[1.7] text-pass">
              {activeChallenge.expectedBehavior}
            </p>
          </div>
        </section>
      </div>
    </Panel>
  );
};
