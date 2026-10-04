'use client';

import React from 'react';
import { useLab } from '@/context/LabContext';
import { FileExplorer } from './FileExplorer';
import { CodeViewer } from './CodeViewer';
import { LogConsole } from './LogConsole';
import { CluesPanel } from './CluesPanel';
import { ExpectedBehavior } from './ExpectedBehavior';
import { 
  Terminal, 
  Target, 
  ArrowRight, 
  Code2
} from 'lucide-react';

export const InvestigationWorkspace: React.FC = () => {
  const { activeChallenge, activeTab, setActiveTab, setStage } = useLab();

  if (!activeChallenge) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-5 space-y-3.5 text-[#F0F6FC]">
      
      {/* Workspace Header Banner */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#58A6FF] mb-0.5">
            <span className="uppercase font-semibold">{activeChallenge.language}</span>
            <span>•</span>
            <span className="uppercase text-[#BC8CFF] font-semibold">{activeChallenge.bugCategory}</span>
          </div>
          <h1 className="text-xl font-bold text-[#F0F6FC] font-sans">{activeChallenge.title}</h1>
          <p className="text-xs text-[#8B949E] font-sans mt-0.5">{activeChallenge.tagline}</p>
        </div>

        <div className="flex items-center gap-2.5 self-end md:self-auto">
          <button
            onClick={() => setStage('diagnose')}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white font-mono font-semibold text-xs transition-colors shadow-sm"
          >
            <span>PROCEED TO DIAGNOSIS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Developer Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 h-[calc(100vh-190px)] min-h-[580px]">
        
        {/* Left Column: File Explorer & Clues (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3.5 h-full">
          <div className="h-1/2 min-h-[250px]">
            <FileExplorer />
          </div>
          <div className="h-1/2 min-h-[250px]">
            <CluesPanel />
          </div>
        </div>

        {/* Center/Right Column: Code Viewer & Logs/Spec (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-3.5 h-full">
          
          {/* Code Viewer (Top 62%) */}
          <div className="h-[62%] min-h-[340px]">
            <CodeViewer />
          </div>

          {/* Tabbed Log Console & Spec (Bottom 38%) */}
          <div className="h-[38%] min-h-[220px] flex flex-col">
            
            {/* Panel Tabs */}
            <div className="flex items-center gap-1.5 mb-1.5 font-mono text-xs">
              <button
                onClick={() => setActiveTab('logs')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-t-md transition-colors ${
                  activeTab === 'logs' || activeTab === 'editor'
                    ? 'bg-[#161B22] text-[#58A6FF] border-t border-x border-[#30363D] font-medium'
                    : 'text-[#8B949E] hover:text-[#F0F6FC]'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Console Logs</span>
              </button>

              <button
                onClick={() => setActiveTab('expected')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-t-md transition-colors ${
                  activeTab === 'expected'
                    ? 'bg-[#161B22] text-[#3FB950] border-t border-x border-[#30363D] font-medium'
                    : 'text-[#8B949E] hover:text-[#F0F6FC]'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Expected Spec</span>
              </button>
            </div>

            {/* Active Panel View */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'expected' ? <ExpectedBehavior /> : <LogConsole />}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
