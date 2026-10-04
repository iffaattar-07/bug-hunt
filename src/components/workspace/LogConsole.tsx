'use client';

import React, { useState } from 'react';
import { useLab } from '@/context/LabContext';
import { Terminal, AlertCircle, AlertTriangle, Info, ChevronDown, ChevronRight } from 'lucide-react';
import { LogEntry } from '@/types/challenge';

export const LogConsole: React.FC = () => {
  const { activeChallenge } = useLab();
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  if (!activeChallenge) return null;

  const logs = activeChallenge.logs.filter((l) => {
    if (filterLevel === 'all') return true;
    return l.level === filterLevel || l.source === filterLevel;
  });

  const getLevelBadge = (level: LogEntry['level']) => {
    switch (level) {
      case 'error':
        return {
          icon: <AlertCircle className="w-3.5 h-3.5 text-[#F85149]" />,
          cls: 'text-[#F85149] bg-[#F85149]/10 border-[#F85149]/30'
        };
      case 'warn':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-[#D29922]" />,
          cls: 'text-[#D29922] bg-[#D29922]/10 border-[#D29922]/30'
        };
      case 'info':
        return {
          icon: <Info className="w-3.5 h-3.5 text-[#58A6FF]" />,
          cls: 'text-[#58A6FF] bg-[#58A6FF]/10 border-[#58A6FF]/30'
        };
      case 'debug':
        return {
          icon: <Terminal className="w-3.5 h-3.5 text-[#BC8CFF]" />,
          cls: 'text-[#BC8CFF] bg-[#BC8CFF]/10 border-[#BC8CFF]/30'
        };
    }
  };

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden flex flex-col h-full font-mono text-xs select-none">
      
      {/* Console Header */}
      <div className="bg-[#21262D] border-b border-[#30363D] px-3.5 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#58A6FF]" />
          <span className="font-semibold text-[#F0F6FC]">RUNTIME LOGS</span>
          <span className="text-[10px] bg-[#0D1117] px-2 py-0.5 rounded border border-[#30363D] text-[#8B949E]">
            {logs.length} events
          </span>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1 bg-[#0D1117] p-0.5 rounded border border-[#30363D] text-[10px]">
          {['all', 'error', 'warn', 'info'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-2 py-0.5 rounded uppercase transition-colors ${
                filterLevel === lvl
                  ? 'bg-[#21262D] text-[#58A6FF] font-semibold border border-[#30363D]'
                  : 'text-[#8B949E] hover:text-[#F0F6FC]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Console Body */}
      <div className="p-2.5 overflow-y-auto flex-1 bg-[#0D1117] space-y-2">
        {logs.map((log) => {
          const badge = getLevelBadge(log.level);
          const isExpanded = expandedLogId === log.id;

          return (
            <div
              key={log.id}
              className="p-2.5 rounded bg-[#161B22] border border-[#30363D] space-y-1.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1">
                  <div className="mt-0.5">{badge.icon}</div>
                  
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap text-[10px]">
                      <span className="text-[#8B949E]">{log.timestamp}</span>
                      <span className={`px-1.5 py-0.2 rounded border uppercase font-medium ${badge.cls}`}>
                        {log.level}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-[#0D1117] border border-[#30363D] text-[#8B949E]">
                        {log.source}
                      </span>
                    </div>

                    <p className="text-[#C9D1D9] leading-normal whitespace-pre-wrap select-text text-xs">
                      {log.message}
                    </p>
                  </div>
                </div>

                {log.stackTrace && (
                  <button
                    onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                    className="flex items-center gap-1 text-[10px] text-[#8B949E] hover:text-[#58A6FF] px-2 py-0.5 rounded bg-[#0D1117] border border-[#30363D] transition-colors shrink-0"
                  >
                    <span>Stack Trace</span>
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                )}
              </div>

              {/* Expandable Stack Trace */}
              {isExpanded && log.stackTrace && (
                <div className="mt-2 p-2 rounded bg-[#0D1117] border border-[#F85149]/30 text-[#F85149] font-mono text-[11px] space-y-0.5 select-text">
                  {log.stackTrace.map((st, idx) => (
                    <div key={idx} className="pl-2 border-l border-[#F85149]/40">
                      {st}
                    </div>
                  ))}
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
