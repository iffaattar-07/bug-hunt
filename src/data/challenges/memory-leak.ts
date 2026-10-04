import { Challenge } from '@/types/challenge';

export const memoryLeakChallenge: Challenge = {
  id: 'memory-leak',
  slug: 'memory-leak',
  title: 'The Memory Leak',
  tagline: 'C server leaks heap memory when processing invalid packets.',
  difficulty: 'medium',
  language: 'C',
  bugCategory: 'Memory Leak',
  estimatedTimeMinutes: 10,
  description:
    'Processing bad network packets causes heap memory usage to steadily rise until the OS terminates the program.',
  architectureOverview:
    'A network packet processing function `buffer.c` allocates buffer space on the heap using `malloc()`.',
  reproductionSteps: [
    'Send valid packet (size: 512).',
    'Send invalid packet (size: -1).',
    'Inspect heap memory allocations in Valgrind.',
    'Observe 1024 bytes leaked on the invalid packet error branch.'
  ],
  expectedBehavior:
    'Every `malloc()` must have a matching `free()` call on ALL return paths.',
  files: [
    {
      path: 'src/buffer.c',
      name: 'buffer.c',
      language: 'c',
      isSuspect: true,
      highlightLines: [9, 10, 11],
      content: `// buffer.c - Network packet buffer processor
#include <stdio.h>
#include <stdlib.h>

int process_packet(const char* data, int size) {
    // Allocate 1024 bytes buffer for packet processing
    char* buffer = (char*)malloc(1024);
    
    // Check if packet is invalid
    if (size <= 0) {
        printf("Error: Invalid packet size!\\n");
        return -1; // BUG: Exits early without calling free(buffer)!
    }
    
    printf("Processing packet of size %d\\n", size);
    
    free(buffer);
    return 0;
}
`
    }
  ],
  logs: [
    {
      id: 'log-1',
      timestamp: '08:14:02',
      level: 'info',
      source: 'server',
      message: 'Processing packet of size 512'
    },
    {
      id: 'log-2',
      timestamp: '08:14:05',
      level: 'error',
      source: 'server',
      message: 'Error: Invalid packet size!\nValgrind: 1024 bytes in 1 block definitely lost at malloc (buffer.c:7)'
    }
  ],
  clues: [
    {
      id: 'clue-1',
      title: 'Trace return statements in process_packet',
      hint: 'Look at line 11: `return -1;`. Was `free(buffer)` called before returning from that error branch?',
      unlocked: false
    }
  ],
  diagnoses: [
    {
      id: 'diag-1',
      title: 'Stack buffer overflow',
      description: 'The buffer array is too small for data size.',
      isCorrect: false,
      feedback: 'Incorrect. Buffer allocation uses malloc on the heap.'
    },
    {
      id: 'diag-2',
      title: 'Missing free(buffer) call on early error return path',
      description: 'When `size <= 0`, the function returns `-1` without freeing `buffer`, causing memory to leak on the heap.',
      isCorrect: true,
      feedback: 'Correct! Returning early without calling `free(buffer)` leaks allocated heap memory.'
    }
  ],
  fixes: [
    {
      id: 'fix-1',
      title: 'Band-aid: Allocate buffer on stack',
      description: 'Replace malloc with static array.',
      isCorrect: false,
      targetFile: 'src/buffer.c',
      diffBefore: `char* buffer = (char*)malloc(1024);`,
      diffAfter: `char buffer[1024];`,
      explanation: 'Not recommended for dynamic buffer sizes.'
    },
    {
      id: 'fix-2',
      title: 'Clean Fix: Free buffer before early return',
      description: 'Call `free(buffer)` before returning `-1` on error.',
      isCorrect: true,
      targetFile: 'src/buffer.c',
      diffBefore: `    if (size <= 0) {
        printf("Error: Invalid packet size!\\n");
        return -1; // BUG: Exits early without calling free(buffer)!
    }`,
      diffAfter: `    if (size <= 0) {
        printf("Error: Invalid packet size!\\n");
        free(buffer);
        return -1;
    }`,
      explanation: 'Clean fix! Ensures allocated memory is freed on all exit paths.'
    }
  ],
  tests: [
    {
      id: 'test-1',
      name: 'test_memory_leak_free_check',
      description: 'Verify zero memory leaks on error return branches',
      durationMs: 130,
      status: 'pending'
    }
  ]
};
