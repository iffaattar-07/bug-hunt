import { Challenge } from '@/types/challenge';

export const pythonTrapChallenge: Challenge = {
  id: 'python-trap',
  slug: 'python-trap',
  title: 'The Python Trap',
  tagline: 'Events leak across callers due to a Python mutable default argument.',
  difficulty: 'easy',
  language: 'Python',
  bugCategory: 'Mutable Defaults',
  estimatedTimeMinutes: 5,
  description:
    'Calling `log_action()` for one user leaks activity history into subsequent calls for completely different users.',
  architectureOverview:
    'A simple Python helper function `tracker.py` appends activity items to a user history list.',
  reproductionSteps: [
    'Call `log_action("User1", "login")`.',
    'Call `log_action("User2", "view_page")`.',
    'Inspect returned list for User2.',
    'Observe that User2 list unexpectedly contains "login" from User1.'
  ],
  expectedBehavior:
    'Each call to `log_action()` without an explicit list should start with a fresh, isolated empty list.',
  files: [
    {
      path: 'src/tracker.py',
      name: 'tracker.py',
      language: 'python',
      isSuspect: true,
      highlightLines: [4, 5, 6],
      content: `# tracker.py - User activity event logger

# BUG: Default argument 'actions=[]' is created ONCE when the module loads!
# Modifying 'actions' in place leaks history across calls.
def log_action(user_id, action, actions=[]):
    actions.append(action)
    print(f"User {user_id} actions: {actions}")
    return actions
`
    }
  ],
  logs: [
    {
      id: 'log-1',
      timestamp: '14:02:10',
      level: 'info',
      source: 'server',
      message: 'User1 actions: ["login"]'
    },
    {
      id: 'log-2',
      timestamp: '14:02:15',
      level: 'error',
      source: 'server',
      message: 'STATE LEAK! User2 actions: ["login", "view_page"]'
    }
  ],
  clues: [
    {
      id: 'clue-1',
      title: 'Check when default arguments are evaluated in Python',
      hint: 'In Python, default arguments like `actions=[]` are evaluated once at function definition time, NOT on every function call.',
      unlocked: false
    }
  ],
  diagnoses: [
    {
      id: 'diag-1',
      title: 'Global variable collision',
      description: 'The user_id variable is shared in global scope.',
      isCorrect: false,
      feedback: 'Incorrect. user_id is a local function parameter.'
    },
    {
      id: 'diag-2',
      title: 'Mutable default argument (actions=[]) in Python function signature',
      description: 'In Python, default arguments are created once when defined. Calling `actions.append()` mutates the same shared list object across calls.',
      isCorrect: true,
      feedback: 'Correct! Default mutable objects like lists are shared across all calls in Python.'
    }
  ],
  fixes: [
    {
      id: 'fix-1',
      title: 'Band-aid: Clear list before returning',
      description: 'Call `actions.clear()` before returning.',
      isCorrect: false,
      targetFile: 'src/tracker.py',
      diffBefore: `return actions`,
      diffAfter: `result = list(actions)
actions.clear()
return result`,
      explanation: 'Sub-optimal fix. Using `actions=None` is the standard Pythonic solution.'
    },
    {
      id: 'fix-2',
      title: 'Clean Fix: Use actions=None sentinel default',
      description: 'Default `actions=None` and initialize a new list inside the function body.',
      isCorrect: true,
      targetFile: 'src/tracker.py',
      diffBefore: `# BUG: Default argument 'actions=[]' is created ONCE when the module loads!
def log_action(user_id, action, actions=[]):
    actions.append(action)`,
      diffAfter: `def log_action(user_id, action, actions=None):
    if actions is None:
        actions = []
    actions.append(action)`,
      explanation: 'Clean Pythonic fix! Defaulting to `None` ensures a new empty list is created for each call.'
    }
  ],
  tests: [
    {
      id: 'test-1',
      name: 'test_default_argument_isolation',
      description: 'Verify independent callers get fresh isolated action lists',
      durationMs: 110,
      status: 'pending'
    }
  ]
};
