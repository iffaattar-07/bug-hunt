'use client';

import React, { useState } from 'react';
import { useLab } from '@/context/LabContext';
import { getAllChallenges } from '@/data/challenges';
import { Challenge, Difficulty } from '@/types/challenge';
import { 
  Terminal, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Code2, 
  Layers, 
  AlertCircle,
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';

export const ChallengeSelection: React.FC = () => {
  const { selectChallenge, completedChallengeIds } = useLab();
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const challenges = getAllChallenges();

  const filtered = challenges.filter((c) => {
    if (filterDifficulty === 'all') return true;
    return c.difficulty === filterDifficulty;
  });

  const getDifficultyBadge = (diff: Difficulty) => {
    switch (diff) {
      case 'easy':
        return 'text-[#3FB950] bg-[#3FB950]/10 border-[#3FB950]/30';
      case 'medium':
        return 'text-[#D29922] bg-[#D29922]/10 border-[#D29922]/30';
      case 'hard':
        return 'text-[#F85149] bg-[#F85149]/10 border-[#F85149]/30';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8 text-[#F0F6FC]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#30363D] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#58A6FF] mb-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>SELECT A LAB</span>
          </div>
          <h1 className="text-2xl font-bold text-[#F0F6FC] font-sans tracking-tight">
            Developer Challenges
          </h1>
          <p className="text-xs text-[#8B949E] mt-1">
            4 simple, real-world code scenarios in JavaScript, Python, C, and C++.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-1.5 bg-[#161B22] p-1 rounded-md border border-[#30363D] self-start md:self-auto font-mono text-xs">
          <span className="px-2 text-[#8B949E] flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Filter:</span>
          </span>
          {['all', 'easy', 'medium', 'hard'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterDifficulty(lvl)}
              className={`px-2.5 py-1 rounded capitalize transition-colors ${
                filterDifficulty === lvl
                  ? 'bg-[#21262D] text-[#58A6FF] font-medium border border-[#30363D]'
                  : 'text-[#8B949E] hover:text-[#F0F6FC]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Challenge Cards Grid (4 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((ch, idx) => {
          const isCompleted = completedChallengeIds.includes(ch.id);

          return (
            <motion.div
              key={ch.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * idx }}
              className="rounded-lg bg-[#161B22] border border-[#30363D] hover:border-[#58A6FF]/50 transition-colors flex flex-col justify-between overflow-hidden group shadow-sm"
            >
              <div className="p-5 space-y-3.5">
                
                {/* Header Tags */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase border ${getDifficultyBadge(ch.difficulty)}`}>
                    {ch.difficulty}
                  </span>

                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#3FB950]/10 border border-[#3FB950]/30 text-[#3FB950] font-mono text-[10px]">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>VERIFIED</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#8B949E]">
                      <Clock className="w-3 h-3" />
                      <span>~{ch.estimatedTimeMinutes}m</span>
                    </span>
                  )}
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="text-base font-bold text-[#F0F6FC] font-sans group-hover:text-[#58A6FF] transition-colors">
                    {ch.title}
                  </h3>
                  <p className="text-xs text-[#8B949E] mt-1 leading-relaxed font-sans line-clamp-2">
                    {ch.tagline}
                  </p>
                </div>

                {/* Meta details badges */}
                <div className="pt-1 flex flex-wrap gap-1.5 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-[#21262D] border border-[#30363D] text-[#C9D1D9] flex items-center gap-1">
                    <Code2 className="w-3 h-3 text-[#58A6FF]" />
                    <span>{ch.language}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#21262D] border border-[#30363D] text-[#C9D1D9] flex items-center gap-1">
                    <Layers className="w-3 h-3 text-[#BC8CFF]" />
                    <span>{ch.bugCategory}</span>
                  </span>
                </div>

              </div>

              {/* Start Action */}
              <div className="p-3 bg-[#21262D] border-t border-[#30363D]">
                <button
                  onClick={() => selectChallenge(ch.id)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-[#21262D] border border-[#30363D] hover:border-[#58A6FF] hover:bg-[#58A6FF] hover:text-[#0D1117] text-[#58A6FF] font-mono font-semibold text-xs transition-colors"
                >
                  <span>{isCompleted ? 'RE-INVESTIGATE' : 'START LAB'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
