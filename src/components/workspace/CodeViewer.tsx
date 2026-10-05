'use client';

import React, { useMemo, useState } from 'react';
import { useLab } from '@/context/LabContext';
import { FileCode2, Copy, Check, TriangleAlert, Braces } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cx } from '@/components/ui/primitives';

const KEYWORDS = [
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do',
  'switch', 'case', 'break', 'continue', 'import', 'from', 'export', 'default',
  'class', 'extends', 'new', 'this', 'super', 'static', 'async', 'await', 'try',
  'catch', 'finally', 'throw', 'typeof', 'instanceof', 'null', 'undefined', 'true',
  'false', 'def', 'lambda', 'self', 'None', 'True', 'False', 'elif', 'pass', 'with',
  'as', 'global', 'nonlocal', 'yield', 'raise', 'int', 'void', 'char', 'float',
  'double', 'long', 'short', 'unsigned', 'signed', 'sizeof', 'struct', 'union',
  'enum', 'typedef', 'goto', 'extern', 'register', 'volatile', 'include', 'define',
  'printf', 'malloc', 'free', 'NULL', 'public', 'private', 'protected', 'namespace',
  'using', 'template', 'typename', 'auto', 'constexpr', 'nullptr',
];

type Tok = { t: string; c: string };

const cache = new Map<string, RegExp>();

function getRegex(lang: string): RegExp {
  const key = /python/i.test(lang) ? 'py' : 'c';
  let re = cache.get(key);
  if (!re) {
    const comment = key === 'py' ? '#[^\\n]*' : '\\/\\/[^\\n]*';
    re = new RegExp(
      [
        `(${comment})`,
        `('(?:[^'\\\\]|\\\\.)*'|"(?:[^"\\\\]|\\\\.)*"|\`(?:[^\`\\\\]|\\\\.)*\`)`,
        `\\b(${KEYWORDS.join('|')})\\b`,
        `(\\b\\d+(?:\\.\\d+)?\\b)`,
      ].join('|'),
      'g',
    );
    cache.set(key, re);
  }
  re.lastIndex = 0;
  return re;
}

function tokenize(line: string, lang: string): Tok[] {
  if (!line) return [];
  const master = getRegex(lang);
  const out: Tok[] = [];
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = master.exec(line)) !== null) {
    if (m[0] === '') {
      master.lastIndex += 1;
      continue;
    }
    if (m.index > last) out.push({ t: line.slice(last, m.index), c: '' });
    if (m[1]) out.push({ t: m[1], c: 'comment' });
    else if (m[2]) out.push({ t: m[2], c: 'string' });
    else if (m[3]) out.push({ t: m[3], c: 'kw' });
    else if (m[4]) out.push({ t: m[4], c: 'num' });
    else out.push({ t: m[0], c: '' });
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push({ t: line.slice(last), c: '' });
  return out;
}

const tokCls: Record<string, string> = {
  comment: 'text-fg-mute/80 italic',
  string: 'text-pass/90',
  kw: 'text-signal',
  num: 'text-clue',
  '': '',
};

export const CodeViewer: React.FC = () => {
  const { activeFile } = useLab();
  const [copied, setCopied] = useState(false);

  const lines = useMemo(
    () => (activeFile ? activeFile.content.split('\n') : []),
    [activeFile],
  );

  if (!activeFile) {
    return (
      <div className="panel grid h-full place-items-center p-8 text-center">
        <div>
          <Braces className="mx-auto h-9 w-9 text-ink-400" />
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-fg-mute">
            No file selected
          </p>
        </div>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="panel flex h-full flex-col overflow-hidden font-mono">
      {/* ---- tab strip ---- */}
      <div className="flex items-center justify-between gap-3 border-b border-ink-line bg-ink-700 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex items-center gap-2 rounded-[4px] border border-signal/30 bg-signal/10 px-2.5 py-1 text-[11px] font-bold text-signal">
            <FileCode2 className="h-3.5 w-3.5" />
            {activeFile.name}
          </span>
          <span className="hidden truncate text-[10px] text-fg-mute sm:inline">
            {activeFile.path}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <AnimatePresence>
            {activeFile.isSuspect && (
              <motion.span
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="hidden items-center gap-1.5 rounded border border-fail/40 bg-fail/10 px-2 py-1 text-[9.5px] font-bold uppercase tracking-[0.14em] text-fail md:flex"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-fail animate-pulse-dot" />
                Suspect region
              </motion.span>
            )}
          </AnimatePresence>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-[4px] border border-ink-edge bg-ink-800 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-fg-mute transition-colors hover:border-signal/50 hover:text-signal"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-pass" />
                <span className="text-pass">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* ---- code body ---- */}
      <div key={activeFile.path} className="relative min-h-0 flex-1 overflow-auto bg-ink-950">
        <AnimatePresence>
          <motion.div
            key={activeFile.path}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="min-w-full py-3 text-[12.5px] leading-[1.75]"
          >
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const isHot = activeFile.highlightLines?.includes(lineNum);
              const toks = tokenize(line, activeFile.language);

              return (
                <div
                  key={lineNum}
                  className={cx(
                    'group relative flex items-start gap-4 border-l-2 pr-4 transition-colors',
                    isHot
                      ? 'border-fail bg-fail/10'
                      : 'border-transparent hover:border-ink-edge hover:bg-white/[0.025]',
                  )}
                >
                  <span
                    className={cx(
                      'w-11 shrink-0 select-none border-r pr-3 text-right tnum',
                      isHot ? 'border-fail/40 font-bold text-fail' : 'border-ink-line/70 text-fg-mute/50',
                    )}
                  >
                    {lineNum}
                  </span>

                  <span
                    className={cx(
                      'flex-1 whitespace-pre',
                      isHot ? 'text-fg' : 'text-fg-dim',
                    )}
                  >
                    {toks.length === 0 ? (
                      <span>&nbsp;</span>
                    ) : (
                      toks.map((tk, i) => (
                        <span key={i} className={tokCls[tk.c]}>
                          {tk.t}
                        </span>
                      ))
                    )}
                  </span>

                  {isHot && (
                    <span className="mt-1.5 shrink-0 animate-pulse-dot rounded-[3px] bg-fail px-1.5 py-[1px] text-[8.5px] font-bold uppercase tracking-[0.14em] text-ink-950 opacity-0 transition-opacity group-hover:opacity-100">
                      line {lineNum}
                    </span>
                  )}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ---- status bar ---- */}
      <div className="flex items-center justify-between border-t border-ink-line bg-ink-700 px-3.5 py-1.5 text-[10px] text-fg-mute">
        <div className="flex items-center gap-3.5">
          <span>UTF-8</span>
          <span className="uppercase">{activeFile.language}</span>
          <span className="tnum">{lines.length} ln</span>
          {activeFile.isSuspect && (
            <span className="flex items-center gap-1 text-fail">
              <TriangleAlert className="h-3 w-3" />
              {activeFile.highlightLines?.length ?? 0} flagged
            </span>
          )}
        </div>
        <span>
          <span className="text-signal">⎇</span> bug-hunt/fix-branch
        </span>
      </div>
    </div>
  );
};
