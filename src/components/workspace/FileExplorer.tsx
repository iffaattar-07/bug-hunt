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
        <div className="mb-2 flex items-center gap-2 px-2 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-fg-mute">
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
                  'group relative flex w-full items-center justify-between gap-2 overflow-hidden rounded-[5px] border px-2.5 py-2 text-left transition-all duration-200',
                  isSelected
                    ? 'border-signal/50 bg-signal/10 text-signal'
                    : 'border-transparent text-fg-dim hover:border-ink-edge hover:bg-ink-700 hover:text-fg',
                )}
              >
                {isSelected && (
                  <motion.span
                    layoutId="file-active"
                    transition={{ type: 'spring', stiffness: 480, damping: 36 }}
                    className="absolute inset-y-0 left-0 w-[3px] bg-signal"
                  />
                )}

                <span className="flex min-w-0 items-center gap-2.5">
                  <FileCode
                    className={cx(
                      'h-3.5 w-3.5 shrink-0 transition-colors',
                      isSelected ? 'text-signal' : file.isSuspect ? 'text-fail/70' : 'text-fg-mute',
                    )}
                  />
                  <span className="truncate font-mono text-[11.5px]">{file.name}</span>
                </span>

                {file.isSuspect && (
                  <span className="flex shrink-0 items-center gap-1 rounded border border-fail/35 bg-fail/10 px-1.5 py-[1px] font-mono text-[8.5px] font-bold uppercase tracking-[0.12em] text-fail">
                    <TriangleAlert className="h-2.5 w-2.5" />
                    Flagged
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-ink-line bg-ink-700/60 px-3.5 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-fg-mute">
        <span>{activeChallenge.slug}</span>
        <span className="text-fail/80">{flaggedNote(suspects)} flagged</span>
      </div>
    </Panel>
  );
};

function flaggedNote(n: number) {
  return n > 0 ? ` · ${n} flagged` : '';
}
