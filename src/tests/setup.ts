import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, expect, vi } from 'vitest';

expect.extend(matchers);

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

// Polyfill for SubmitEvent if not available in the test environment
if (typeof SubmitEvent === 'undefined') {
  class SubmitEventPolyfill extends Event {
    constructor(type: string, options?: EventInit) {
      super(type, options);
    }
  }

  // @ts-ignore - Adding SubmitEvent to the global scope
  global.SubmitEvent = SubmitEventPolyfill;
}

// Mock AbortController to make it synchronous in test environment
const originalAbortController = global.AbortController;
class SynchronousAbortController extends originalAbortController {
  abort() {
    super.abort();
    // Ensure signal propagates immediately in tests
    vi.runAllTimers();
  }
}

// @ts-ignore - Replace global AbortController with synchronous version for tests
global.AbortController = SynchronousAbortController;
