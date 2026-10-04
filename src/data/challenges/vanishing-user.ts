import { Challenge } from '@/types/challenge';

export const vanishingUserChallenge: Challenge = {
  id: 'vanishing-user',
  slug: 'vanishing-user',
  title: 'The Vanishing User',
  tagline: 'User session disappears when restoring state after a page refresh.',
  difficulty: 'easy',
  language: 'JavaScript',
  bugCategory: 'State Management',
  estimatedTimeMinutes: 5,
  description:
    'When a user logs in, their profile is saved. However, restoring the session resets the user data back to the default guest state.',
  architectureOverview:
    'A simple state store `userStore.js` manages current user data and restores sessions from saved storage.',
  reproductionSteps: [
    'Log in user with username "Alex".',
    'Call `restoreSession(savedUser)`.',
    'Check current user profile.',
    'Observe that profile returned to "Guest" instead of "Alex".'
  ],
  expectedBehavior:
    'Restoring the session should retain the saved user profile while keeping default fallbacks for missing properties.',
  files: [
    {
      path: 'src/userStore.js',
      name: 'userStore.js',
      language: 'javascript',
      isSuspect: true,
      highlightLines: [11, 12, 13],
      content: `// userStore.js - User session state store
const DEFAULT_USER = { name: "Guest", isLoggedIn: false, role: "viewer" };

let currentUser = { ...DEFAULT_USER };

export function loginUser(name) {
  currentUser = { name, isLoggedIn: true, role: "admin" };
}

// BUG: Object.assign puts DEFAULT_USER last, overwriting saved session data!
export function restoreSession(savedSession) {
  if (savedSession) {
    currentUser = Object.assign({}, savedSession, DEFAULT_USER);
  }
}

export function getUser() {
  return currentUser;
}
`
    }
  ],
  logs: [
    {
      id: 'log-1',
      timestamp: '10:04:12',
      level: 'info',
      source: 'browser',
      message: '[Auth] Restoring session with saved payload: { name: "Alex", isLoggedIn: true }'
    },
    {
      id: 'log-2',
      timestamp: '10:04:13',
      level: 'error',
      source: 'browser',
      message: '[State] Session reset! currentUser is now: { name: "Guest", isLoggedIn: false, role: "viewer" }'
    }
  ],
  clues: [
    {
      id: 'clue-1',
      title: 'Inspect Object.assign parameter order',
      hint: '`Object.assign(target, ...sources)` applies sources from left to right. Parameters on the right overwrite properties on the left.',
      unlocked: false
    }
  ],
  diagnoses: [
    {
      id: 'diag-1',
      title: 'Storage API read error',
      description: 'The saved session object is unreadable.',
      isCorrect: false,
      feedback: 'Incorrect. The console log shows `savedSession` is valid.'
    },
    {
      id: 'diag-2',
      title: 'Incorrect parameter order in Object.assign()',
      description: 'In `Object.assign({}, savedSession, DEFAULT_USER)`, `DEFAULT_USER` comes last and overwrites the saved user properties with `Guest` defaults.',
      isCorrect: true,
      feedback: 'Correct! Passing `DEFAULT_USER` last causes default values to overwrite valid saved session data.'
    }
  ],
  fixes: [
    {
      id: 'fix-1',
      title: 'Band-aid: Manually set name after restore',
      description: 'Manually reassign `currentUser.name = savedSession.name`.',
      isCorrect: false,
      targetFile: 'src/userStore.js',
      diffBefore: `currentUser = Object.assign({}, savedSession, DEFAULT_USER);`,
      diffAfter: `currentUser = Object.assign({}, savedSession, DEFAULT_USER);
currentUser.name = savedSession.name;`,
      explanation: 'Flawed fix. Hardcoding property assignments bypasses proper object merging.'
    },
    {
      id: 'fix-2',
      title: 'Clean Fix: Place DEFAULT_USER first in Object.assign',
      description: 'Put `DEFAULT_USER` first as base fallbacks, then merge `savedSession` on top.',
      isCorrect: true,
      targetFile: 'src/userStore.js',
      diffBefore: `// BUG: Object.assign puts DEFAULT_USER last, overwriting saved session data!
currentUser = Object.assign({}, savedSession, DEFAULT_USER);`,
      diffAfter: `// Default values first, saved session overrides defaults
currentUser = Object.assign({}, DEFAULT_USER, savedSession);`,
      explanation: 'Clean solution! Base defaults are applied first, allowing saved session properties to correctly take precedence.'
    }
  ],
  tests: [
    {
      id: 'test-1',
      name: 'restoreSession() preservation',
      description: 'Should preserve saved user name and login status on session restore',
      durationMs: 120,
      status: 'pending'
    },
    {
      id: 'test-2',
      name: 'Default fallback protection',
      description: 'Should fallback to default role if saved session role is missing',
      durationMs: 140,
      status: 'pending'
    }
  ]
};
