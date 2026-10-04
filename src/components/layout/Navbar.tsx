'use client';

import React from 'react';
import { useLab } from '@/context/LabContext';
import { 
  Bug, 
  Terminal, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Clock, 
  ShieldAlert, 
  FileCode2, 
  FlaskConical,
  FileText
} from 'lucide-react';
import { LabStage } from '@/types/challenge';

export const Navbar: React.FC = () => {
  const { 
    stage, 
    activeChallenge, 
    elapsedSeconds, 
    soundMuted, 
    toggleSound, 
    resetLab, 
    setStage,
    selectedDiagnosis,
    selectedFix
  } = useLab();

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const stages: { id: LabStage; label: string; icon: React.ReactNode; disabled: boolean }[] = [
    { id: 'investigate', label: '1. Investigate', icon: <Terminal className="w-3.5 h-3.5" />, disabled: !activeChallenge },
    { id: 'diagnose', label: '2. Diagnose', icon: <ShieldAlert className="w-3.5 h-3.5" />, disabled: !activeChallenge },
    { id: 'fix', label: '3. Fix', icon: <FileCode2 className="w-3.5 h-3.5" />, disabled: !activeChallenge || !selectedDiagnosis?.isCorrect },
    { id: 'verify', label: '4. Verify', icon: <FlaskConical className="w-3.5 h-3.5" />, disabled: !activeChallenge || !selectedFix },
    { id: 'report', label: '5. Report', icon: <FileText className="w-3.5 h-3.5" />, disabled: stage !== 'report' && !selectedFix }
  ];

  return (
    <header className="bg-[#161B22] border-b border-[#30363D] sticky top-0 z-50 text-[#F0F6FC] select-none">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        
        {/* Brand identity */}
        <div 
          onClick={() => setStage('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="p-1.5 rounded-md bg-[#21262D] border border-[#30363D] group-hover:border-[#58A6FF]/50 transition-colors">
            <Bug className="w-4 h-4 text-[#58A6FF]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold tracking-tight text-sm text-[#F0F6FC]">Bug Hunt</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#21262D] border border-[#30363D] text-[#8B949E]">
              v1.0
            </span>
          </div>
        </div>

        {/* Workflow Stepper */}
        {activeChallenge && stage !== 'landing' && stage !== 'select' && (
          <nav className="hidden md:flex items-center gap-1 bg-[#0D1117] px-1.5 py-1 rounded-md border border-[#30363D]">
            {stages.map((st) => {
              const isActive = stage === st.id;
              return (
                <button
                  key={st.id}
                  disabled={st.disabled}
                  onClick={() => setStage(st.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono transition-colors ${
                    isActive 
                      ? 'bg-[#21262D] text-[#58A6FF] border border-[#30363D] font-medium'
                      : st.disabled
                      ? 'opacity-40 cursor-not-allowed text-[#8B949E]'
                      : 'text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]/50'
                  }`}
                >
                  {st.icon}
                  <span>{st.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Action Controls & Timer */}
        <div className="flex items-center gap-2.5">
          {activeChallenge && stage !== 'landing' && stage !== 'select' && (
            <div className="flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 rounded-md bg-[#21262D] border border-[#30363D] text-[#D29922]">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(elapsedSeconds)}</span>
            </div>
          )}

          <button
            onClick={toggleSound}
            title={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="p-1.5 rounded-md bg-[#21262D] border border-[#30363D] hover:border-[#484F58] text-[#8B949E] hover:text-[#F0F6FC] transition-colors"
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-[#F85149]" /> : <Volume2 className="w-4 h-4 text-[#58A6FF]" />}
          </button>

          {activeChallenge && (
            <button
              onClick={resetLab}
              title="Return to Challenge Selection"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#21262D] border border-[#30363D] hover:border-[#484F58] text-xs font-mono text-[#8B949E] hover:text-[#F0F6FC] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit Lab</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
