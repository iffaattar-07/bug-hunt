import { Challenge } from '@/types/challenge';

export const infiniteLoopChallenge: Challenge = {
  id: 'infinite-loop',
  slug: 'infinite-loop',
  title: 'The Infinite Loop',
  tagline: 'Unsigned integer underflow in C++ loop condition causes infinite loop.',
  difficulty: 'hard',
  language: 'C++',
  bugCategory: 'Control Flow',
  estimatedTimeMinutes: 15,
  description:
    'Printing order IDs in reverse order locks up the program in an infinite loop.',
  architectureOverview:
    'A C++ order processor `order_processor.cpp` iterates backwards over a vector of order IDs.',
  reproductionSteps: [
    'Pass vector `{101, 102, 103}` to `print_orders_reverse()`.',
    'Observe loop index `i` decrement from `0` to `4294967295`.',
    'Observe CPU utilization lock at 100%.'
  ],
  expectedBehavior:
    'The loop should iterate from the last element down to index 0 and terminate cleanly.',
  files: [
    {
      path: 'src/order_processor.cpp',
      name: 'order_processor.cpp',
      language: 'cpp',
      isSuspect: true,
      highlightLines: [9, 10, 11],
      content: `// order_processor.cpp - Reverse order queue processor
#include <iostream>
#include <vector>

void print_orders_reverse(const std::vector<int>& order_ids) {
    if (order_ids.empty()) return;

    // BUG: 'i' is unsigned int! Since unsigned numbers are always >= 0,
    // when 'i' is 0, 'i--' underflows to 4294967295 -> INFINITE LOOP!
    for (unsigned int i = order_ids.size() - 1; i >= 0; i--) {
        std::cout << "Order ID: " << order_ids[i] << std::endl;
    }
}
`
    }
  ],
  logs: [
    {
      id: 'log-1',
      timestamp: '12:30:00',
      level: 'info',
      source: 'server',
      message: 'Processing reverse orders for 3 items.'
    },
    {
      id: 'log-2',
      timestamp: '12:30:01',
      level: 'error',
      source: 'server',
      message: 'INTEGER UNDERFLOW! Index i decremented past 0 -> i = 4294967295 >= 0 evaluates TRUE forever!'
    }
  ],
  clues: [
    {
      id: 'clue-1',
      title: 'Analyze data type of loop counter i',
      hint: '`i` is declared as `unsigned int`. Can an unsigned integer ever be less than 0? When `0 - 1` happens on an unsigned type, what value does it become?',
      unlocked: false
    }
  ],
  diagnoses: [
    {
      id: 'diag-1',
      title: 'Vector memory overflow',
      description: 'The vector size exceeds max capacity.',
      isCorrect: false,
      feedback: 'Incorrect. Vector size is valid.'
    },
    {
      id: 'diag-2',
      title: 'Unsigned integer underflow in loop condition (unsigned int i >= 0)',
      description: 'Unsigned integers wrap around on underflow (`0 - 1 = 4294967295`). Therefore `i >= 0` is always true, creating an infinite loop.',
      isCorrect: true,
      feedback: 'Correct! Unsigned integers can never be negative, making `i >= 0` an infinite loop condition.'
    }
  ],
  fixes: [
    {
      id: 'fix-1',
      title: 'Band-aid: Cast i to signed int inside loop',
      description: 'Cast `(int)i >= 0`.',
      isCorrect: false,
      targetFile: 'src/order_processor.cpp',
      diffBefore: `for (unsigned int i = order_ids.size() - 1; i >= 0; i--) {`,
      diffAfter: `for (int i = order_ids.size() - 1; i >= 0; i--) {`,
      explanation: 'Using C++ reverse iterators is the clean idiomatic C++ solution.'
    },
    {
      id: 'fix-2',
      title: 'Clean Fix: Use C++ reverse iterators (rbegin / rend)',
      description: 'Traverse vector safely with `rbegin()` and `rend()`.',
      isCorrect: true,
      targetFile: 'src/order_processor.cpp',
      diffBefore: `    // BUG: 'i' is unsigned int!
    for (unsigned int i = order_ids.size() - 1; i >= 0; i--) {
        std::cout << "Order ID: " << order_ids[i] << std::endl;
    }`,
      diffAfter: `    // Clean C++ reverse iterator traversal
    for (auto it = order_ids.rbegin(); it != order_ids.rend(); ++it) {
        std::cout << "Order ID: " << *it << std::endl;
    }`,
      explanation: 'Clean C++ fix! Reverse iterators avoid raw index math and underflow bugs entirely.'
    }
  ],
  tests: [
    {
      id: 'test-1',
      name: 'test_reverse_traversal_termination',
      description: 'Verify loop terminates safely after processing all elements',
      durationMs: 140,
      status: 'pending'
    }
  ]
};
