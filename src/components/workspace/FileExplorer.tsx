'use client';

import React from 'react';
import { useLab } from '@/context/LabContext';
import { FileCode, FolderTree, TriangleAlert } from 'lucide-react';
import { Panel, PanelHead, cx } from '@/components/ui/primitives';
import { motion } from 'framer-motion';

export const FileExplorer: React.FC = () => {
  const { activeChallenge, activeFile, setActiveFile } = useLab();

  if (!activeChallenge) return null;

  const suspects = activeChallenge.files.filter((f) => f.isSuspect).length;

  return (
    <Panel className="h-full">
      <PanelHead
        icon={<FolderTree className="h-3.5 w-3.5" />}
        title="Source tree"
        meta={
          <span className="font-mono text-[10px] text-fg-mute tnum">
            {activeChallenge.files.length} files
            {flaggedNote(suspects)}
          </span>
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        <div className="mb-2 flex items-center gap-2 px-3 font-mono text-[10.5px] tracking-[0.06em] text-fg-mute">
          <span className="text-signal">❯</span>
          src/
        </div>

        <div className="space-y-1">
          {activeChallenge.files.map((file, i) => {
            const isSelected = activeFile?.path === file.path;

            return (
              <motion.button
                key={file.path}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                onClick={() => setActiveFile(file)}
                className={cx(
                  'group relative flex w-full items-center justify-between gap-2 overflow-hidden px-3 py-2.5 text-left transition-colors duration-150',
                  isSelected
                    ? 'bg-signal/[0.08] text-signal'
                    : 'text-fg-dim hover:bg-white/[0.025] hover:text-fg',
                )}
              >
                {isSelected && (
                  <motion.span
                    layoutId="file-active"
                    transition={{ type: 'spring', stiffness: 520, damping: 44 }}
                    className="absolute inset-y-0 left-0 w-[2px] bg-signal"
                  />
                )}

                <span className="flex min-w-0 items-center gap-2.5">
                  <FileCode
                    className={cx(
                      'h-3.5 w-3.5 shrink-0 transition-colors',
                      isSelected ? 'text-signal' : file.isSuspect ? 'text-fail/80' : 'text-fg-mute',
                    )}
                  />
                  <span className="truncate font-mono text-[12px]">{file.name}</span>
                </span>

                {file.isSuspect && (
                  <span className="flex shrink-0 items-center gap-1 border border-fail/40 px-1.5 py-[1px] font-mono text-[9px] tracking-[0.08em] text-fail">
                    <TriangleAlert className="h-2.5 w-2.5" />
                    flag
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex items-baseline gap-2 border-t border-ink-line bg-ink-850 px-3.5 py-2.5 font-mono text-[10.5px] tracking-[0.06em] text-fg-mute">
        <span>{activeChallenge.slug}</span>
        <span className="leader" />
        <span className={suspects > 0 ? 'text-fail' : ''}>{flaggedNote(suspects)} flagged</span>
      </div>
    </Panel>
  );
};

function flaggedNote(n: number) {
  return n > 0 ? ` · ${n} flagged` : '';
}
