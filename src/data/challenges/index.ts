import { Challenge } from '@/types/challenge';
import { vanishingUserChallenge } from './vanishing-user';
import { pythonTrapChallenge } from './python-trap';
import { memoryLeakChallenge } from './memory-leak';
import { infiniteLoopChallenge } from './infinite-loop';

export const challenges: Challenge[] = [
  vanishingUserChallenge,
  pythonTrapChallenge,
  memoryLeakChallenge,
  infiniteLoopChallenge,
];

export function getChallengeById(id: string): Challenge | undefined {
  return challenges.find((c) => c.id === id || c.slug === id);
}

export function getAllChallenges(): Challenge[] {
  return challenges;
}
