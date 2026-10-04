'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Challenge, 
  LabStage, 
  FileNode, 
  DiagnosisOption, 
  FixOption, 
  TestCase, 
  EngineeringReport 
} from '@/types/challenge';
import { getChallengeById, challenges } from '@/data/challenges';
import { soundFX } from '@/lib/sound';
import { 
  getCompletedChallengeIds, 
  saveEngineeringReport, 
  getSoundMutedState, 
  setSoundMutedState 
} from '@/lib/storage';

interface LabContextType {
  stage: LabStage;
  activeChallenge: Challenge | null;
  activeFile: FileNode | null;
  activeTab: 'editor' | 'logs' | 'clues' | 'expected';
  logFilter: string;
  unlockedClueIds: string[];
  attemptsCount: number;
  selectedDiagnosis: DiagnosisOption | null;
  diagnosisFeedback: { isCorrect: boolean; message: string; optionId: string } | null;
  selectedFix: FixOption | null;
  testCases: TestCase[];
  testRunnerState: 'idle' | 'running' | 'completed';
  elapsedSeconds: number;
  soundMuted: boolean;
  completedChallengeIds: string[];
  finalReport: EngineeringReport | null;
  
  // Actions
  setStage: (stage: LabStage) => void;
  selectChallenge: (challengeId: string) => void;
  setActiveFile: (file: FileNode) => void;
  setActiveTab: (tab: 'editor' | 'logs' | 'clues' | 'expected') => void;
  setLogFilter: (filter: string) => void;
  unlockClue: (clueId: string) => void;
  submitDiagnosis: (optionId: string) => boolean;
  submitFix: (fixId: string) => void;
  runVerification: () => void;
  toggleSound: () => void;
  resetLab: () => void;
}

const LabContext = createContext<LabContextType | undefined>(undefined);

export const LabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stage, setStageState] = useState<LabStage>('landing');
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'logs' | 'clues' | 'expected'>('editor');
  const [logFilter, setLogFilter] = useState<string>('all');
  const [unlockedClueIds, setUnlockedClueIds] = useState<string[]>([]);
  const [attemptsCount, setAttemptsCount] = useState<number>(0);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<DiagnosisOption | null>(null);
  const [diagnosisFeedback, setDiagnosisFeedback] = useState<{ isCorrect: boolean; message: string; optionId: string } | null>(null);
  const [selectedFix, setSelectedFix] = useState<FixOption | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [testRunnerState, setTestRunnerState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [completedChallengeIds, setCompletedChallengeIds] = useState<string[]>([]);
  const [finalReport, setFinalReport] = useState<EngineeringReport | null>(null);

  // Load storage state on mount
  useEffect(() => {
    const completed = getCompletedChallengeIds();
    setCompletedChallengeIds(completed);

    const muted = getSoundMutedState();
    setSoundMuted(muted);
    soundFX.enabled = !muted;
  }, []);

  // Timer loop when active in investigation or stages
  useEffect(() => {
    if (!activeChallenge || stage === 'landing' || stage === 'select' || stage === 'report') {
      return;
    }

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeChallenge, stage]);

  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    setSoundMutedState(next);
    soundFX.enabled = !next;
  };

  const setStage = useCallback((newStage: LabStage) => {
    soundFX.playClick();
    setStageState(newStage);
  }, []);

  const selectChallenge = useCallback((challengeId: string) => {
    soundFX.playClick();
    const ch = getChallengeById(challengeId);
    if (!ch) return;

    setActiveChallenge(ch);
    setActiveFile(ch.files[0] || null);
    setActiveTab('editor');
    setLogFilter('all');
    setUnlockedClueIds([]);
    setAttemptsCount(0);
    setSelectedDiagnosis(null);
    setDiagnosisFeedback(null);
    setSelectedFix(null);
    setTestCases(ch.tests.map(t => ({ ...t, status: 'pending' })));
    setTestRunnerState('idle');
    setElapsedSeconds(0);
    setFinalReport(null);
    setStageState('investigate');
  }, []);

  const unlockClue = useCallback((clueId: string) => {
    soundFX.playClick();
    setUnlockedClueIds((prev) => {
      if (prev.includes(clueId)) return prev;
      return [...prev, clueId];
    });
  }, []);

  const submitDiagnosis = useCallback((optionId: string): boolean => {
    if (!activeChallenge) return false;

    setAttemptsCount((prev) => prev + 1);
    const option = activeChallenge.diagnoses.find((d) => d.id === optionId);

    if (!option) return false;

    if (option.isCorrect) {
      soundFX.playSuccess();
      setSelectedDiagnosis(option);
      setDiagnosisFeedback({
        isCorrect: true,
        message: option.feedback,
        optionId
      });
      return true;
    } else {
      soundFX.playError();
      setDiagnosisFeedback({
        isCorrect: false,
        message: option.feedback,
        optionId
      });
      return false;
    }
  }, [activeChallenge]);

  const submitFix = useCallback((fixId: string) => {
    if (!activeChallenge) return;
    soundFX.playClick();

    const fix = activeChallenge.fixes.find((f) => f.id === fixId);
    if (!fix) return;

    setSelectedFix(fix);
  }, [activeChallenge]);

  const runVerification = useCallback(() => {
    if (!activeChallenge || !selectedDiagnosis || !selectedFix) return;

    setTestRunnerState('running');
    setTestCases(activeChallenge.tests.map(t => ({ ...t, status: 'pending' })));

    let currentIdx = 0;

    const runNextTest = () => {
      if (currentIdx >= activeChallenge.tests.length) {
        // All tests finished
        setTestRunnerState('completed');
        soundFX.playSuccess();

        const report: EngineeringReport = {
          challengeId: activeChallenge.id,
          challengeTitle: activeChallenge.title,
          difficulty: activeChallenge.difficulty,
          language: activeChallenge.language,
          durationSeconds: elapsedSeconds,
          attemptsCount: attemptsCount,
          cluesUnlockedCount: unlockedClueIds.length,
          diagnosisSelected: selectedDiagnosis,
          fixSelected: selectedFix,
          testsPassedCount: activeChallenge.tests.length,
          totalTestsCount: activeChallenge.tests.length,
          rootCauseSummary: selectedDiagnosis.description,
          technicalImpact: activeChallenge.tagline,
          fixAppliedSummary: selectedFix.explanation,
          preventionStrategy: `Enforce strict continuous integration checks for ${activeChallenge.bugCategory} and add explicit regression specs to test payload stability.`,
          timestamp: new Date().toISOString()
        };

        setFinalReport(report);
        saveEngineeringReport(report);
        setCompletedChallengeIds(getCompletedChallengeIds());
        return;
      }

      const test = activeChallenge.tests[currentIdx];

      setTestCases((prev) =>
        prev.map((t, idx) => (idx === currentIdx ? { ...t, status: 'running' } : t))
      );
      soundFX.playTestRun();

      setTimeout(() => {
        setTestCases((prev) =>
          prev.map((t, idx) => (idx === currentIdx ? { ...t, status: 'passed' } : t))
        );
        currentIdx++;
        setTimeout(runNextTest, 250);
      }, test.durationMs);
    };

    setTimeout(runNextTest, 400);
  }, [activeChallenge, selectedDiagnosis, selectedFix, elapsedSeconds, attemptsCount, unlockedClueIds]);

  const resetLab = useCallback(() => {
    soundFX.playClick();
    setActiveChallenge(null);
    setActiveFile(null);
    setStageState('select');
  }, []);

  return (
    <LabContext.Provider
      value={{
        stage,
        activeChallenge,
        activeFile,
        activeTab,
        logFilter,
        unlockedClueIds,
        attemptsCount,
        selectedDiagnosis,
        diagnosisFeedback,
        selectedFix,
        testCases,
        testRunnerState,
        elapsedSeconds,
        soundMuted,
        completedChallengeIds,
        finalReport,
        setStage,
        selectChallenge,
        setActiveFile,
        setActiveTab,
        setLogFilter,
        unlockClue,
        submitDiagnosis,
        submitFix,
        runVerification,
        toggleSound,
        resetLab
      }}
    >
      {children}
    </LabContext.Provider>
  );
};

export const useLab = () => {
  const context = useContext(LabContext);
  if (!context) {
    throw new Error('useLab must be used within a LabProvider');
  }
  return context;
};
