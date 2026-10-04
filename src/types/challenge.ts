export type Difficulty = 'easy' | 'medium' | 'hard';
export type Language = 'JavaScript' | 'Python' | 'C' | 'C++';
export type BugCategory = 'State Management' | 'Mutable Defaults' | 'Memory Leak' | 'Control Flow';

export type LabStage = 
  | 'landing' 
  | 'select' 
  | 'investigate' 
  | 'diagnose' 
  | 'fix' 
  | 'verify' 
  | 'report';

export interface FileNode {
  path: string;
  name: string;
  language: string;
  content: string;
  isSuspect?: boolean;
  highlightLines?: number[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  source: 'browser' | 'server' | 'network';
  message: string;
  stackTrace?: string[];
}

export interface Clue {
  id: string;
  title: string;
  hint: string;
  unlocked: boolean;
}

export interface DiagnosisOption {
  id: string;
  title: string;
  description: string;
  isCorrect: boolean;
  feedback: string;
  codeReference?: string;
}

export interface FixOption {
  id: string;
  title: string;
  description: string;
  isCorrect: boolean;
  targetFile: string;
  diffBefore: string;
  diffAfter: string;
  explanation: string;
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  durationMs: number;
  status: 'pending' | 'running' | 'passed' | 'failed';
  errorMessage?: string;
}

export interface Challenge {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  difficulty: Difficulty;
  language: Language;
  bugCategory: BugCategory;
  estimatedTimeMinutes: number;
  description: string;
  architectureOverview: string;
  reproductionSteps: string[];
  expectedBehavior: string;
  files: FileNode[];
  logs: LogEntry[];
  clues: Clue[];
  diagnoses: DiagnosisOption[];
  fixes: FixOption[];
  tests: TestCase[];
}

export interface EngineeringReport {
  challengeId: string;
  challengeTitle: string;
  difficulty: Difficulty;
  language: Language;
  durationSeconds: number;
  attemptsCount: number;
  cluesUnlockedCount: number;
  diagnosisSelected: DiagnosisOption;
  fixSelected: FixOption;
  testsPassedCount: number;
  totalTestsCount: number;
  rootCauseSummary: string;
  technicalImpact: string;
  fixAppliedSummary: string;
  preventionStrategy: string;
  timestamp: string;
}
