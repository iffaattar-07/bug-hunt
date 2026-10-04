import { EngineeringReport } from '@/types/challenge';

const COMPLETED_CHALLENGES_KEY = 'bug_hunt_completed_ids';
const REPORTS_KEY = 'bug_hunt_reports';
const SOUND_MUTED_KEY = 'bug_hunt_sound_muted';

export function getCompletedChallengeIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(COMPLETED_CHALLENGES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCompletedChallengeId(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getCompletedChallengeIds();
    if (!current.includes(id)) {
      const updated = [...current, id];
      localStorage.setItem(COMPLETED_CHALLENGES_KEY, JSON.stringify(updated));
    }
  } catch {
    // Ignore storage write errors
  }
}

export function getSavedReports(): EngineeringReport[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEngineeringReport(report: EngineeringReport): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getSavedReports().filter(r => r.challengeId !== report.challengeId);
    const updated = [report, ...current];
    localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
    saveCompletedChallengeId(report.challengeId);
  } catch {
    // Ignore
  }
}

export function getSoundMutedState(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(SOUND_MUTED_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setSoundMutedState(muted: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SOUND_MUTED_KEY, String(muted));
  } catch {
    // Ignore
  }
}
