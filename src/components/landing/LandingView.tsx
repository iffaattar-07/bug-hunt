'use client';

import React from 'react';
import { useLab } from '@/context/LabContext';
import { 
  Search, 
  ShieldAlert, 
  FileCode2, 
  CheckCircle2, 
  FileText, 
  ArrowRight, 
  Terminal, 
  Layers, 
  Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingView: React.FC = () => {
  const { setStage } = useLab();

  const workflowSteps = [
    {
      step: '01',
      title: 'Choose Challenge',
      desc: 'Select from 4 developer challenges in JavaScript, Python, C, and C++.',
      icon: <Layers className="w-4 h-4 text-[#58A6FF]" />
    },
    {
      step: '02',
      title: 'Investigate',
      desc: 'Inspect source code, observe error logs in a live terminal, and discover clues.',
      icon: <Search className="w-4 h-4 text-[#3FB950]" />
    },
    {
      step: '03',
      title: 'Diagnose',
      desc: 'Hypothesize the root cause from technical options and receive instant feedback.',
      icon: <ShieldAlert className="w-4 h-4 text-[#D29922]" />
    },
    {
      step: '04',
      title: 'Fix',
      desc: 'Evaluate side-by-side code diffs to choose clean architectural solutions.',
      icon: <FileCode2 className="w-4 h-4 text-[#BC8CFF]" />
    },
    {
      step: '05',
      title: 'Verify',
      desc: 'Watch a simulated automated test runner execute regression specs.',
      icon: <CheckCircle2 className="w-4 h-4 text-[#3FB950]" />
    },
    {
      step: '06',
      title: 'Engineering Report',
      desc: 'Review an incident post-mortem report capturing root cause and metrics.',
      icon: <FileText className="w-4 h-4 text-[#58A6FF]" />
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 text-[#F0F6FC] space-y-16">
      
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#21262D] border border-[#30363D] text-[#58A6FF] font-mono text-xs"
        >
          <Cpu className="w-3.5 h-3.5 text-[#58A6FF]" />
          <span>DEVELOPER DEBUGGING LAB</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-4xl md:text-5xl font-extrabold text-[#F0F6FC] tracking-tight font-sans leading-tight"
        >
          Find the bug. Understand the failure. <br />
          <span className="text-[#58A6FF]">Prove the fix.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-base text-[#8B949E] font-sans leading-relaxed"
        >
          An interactive debugging workspace showcasing real software engineering thinking. 
          Investigate production logs, isolate root causes, select clean architectural fixes, and generate incident reports.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="pt-2"
        >
          <button
            onClick={() => setStage('select')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white font-mono font-semibold text-xs tracking-wide transition-colors shadow-sm"
          >
            <span>START HUNTING</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      {/* Code Telemetry Preview Card */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="rounded-lg bg-[#161B22] border border-[#30363D] overflow-hidden shadow-md max-w-4xl mx-auto"
      >
        <div className="bg-[#21262D] px-4 py-2.5 border-b border-[#30363D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#F85149]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#D29922]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#3FB950]" />
            <span className="ml-2 font-mono text-xs text-[#8B949E]">bughunt-telemetry.log</span>
          </div>
          <span className="font-mono text-[11px] text-[#58A6FF]">LAB SIMULATOR</span>
        </div>

        <div className="p-5 font-mono text-xs space-y-2 bg-[#0D1117] text-[#C9D1D9]">
          <div className="flex items-start gap-3">
            <span className="text-[#8B949E]">[10:04:12]</span>
            <span className="text-[#58A6FF]">[TRACE]</span>
            <span>Initializing challenge: <code className="text-[#D29922]">"The Vanishing User" (JavaScript)</code></span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[#8B949E]">[10:04:13]</span>
            <span className="text-[#F85149]">[ERROR]</span>
            <span>Auth state reset! DEFAULT_USER overwrites saved session at userStore.js:12</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[#8B949E]">[10:04:14]</span>
            <span className="text-[#3FB950]">[VERIFY]</span>
            <span>Regression specs queued: 2 tests pending.</span>
          </div>
        </div>
      </motion.div>

      {/* Workflow Steps Grid */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-[#F0F6FC] font-sans">
            The Software Debugging Workflow
          </h2>
          <p className="text-[#8B949E] text-xs">
            A structured engineering lab environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflowSteps.map((ws, idx) => (
            <motion.div
              key={ws.step}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * idx }}
              className="p-5 rounded-lg bg-[#161B22] border border-[#30363D] hover:border-[#484F58] transition-colors space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded bg-[#21262D] border border-[#30363D]">
                  {ws.icon}
                </div>
                <span className="font-mono text-xs font-bold text-[#8B949E]">
                  {ws.step}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#F0F6FC] font-sans">{ws.title}</h3>
                <p className="text-xs text-[#8B949E] mt-1 leading-relaxed">{ws.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};
