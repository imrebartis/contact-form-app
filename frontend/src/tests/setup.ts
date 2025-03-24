'use strict';

import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { JSDOM } from 'jsdom';
import { afterEach, beforeEach, expect, vi } from 'vitest';

// Ensure DOM environment is set up before any imports or tests run
setupDOMEnvironment();

// Now that DOM is set up, extend matchers
expect.extend(matchers);

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
  document.body.innerHTML = '';
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

// Set up a DOM environment for tests that don't have one yet
function setupDOMEnvironment() {
  if (typeof window === 'undefined') {
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
      url: 'http://localhost:3000/',
      pretendToBeVisual: true,
    });

    // Set up the DOM globals
    global.window = dom.window as unknown as Window & typeof globalThis;
    global.document = dom.window.document;
    global.navigator = dom.window.navigator;
    global.HTMLElement = dom.window.HTMLElement;
    global.Element = dom.window.Element;
    global.history = dom.window.history;
    global.Location = dom.window.Location;
    global.Event = dom.window.Event;

    // Add more DOM APIs that might be needed
    global.HTMLInputElement = dom.window.HTMLInputElement;
    global.HTMLTextAreaElement = dom.window.HTMLTextAreaElement;
    global.HTMLButtonElement = dom.window.HTMLButtonElement;
    global.HTMLDivElement = dom.window.HTMLDivElement;
    global.CustomEvent = dom.window.CustomEvent;
    global.NodeList = dom.window.NodeList;
    global.RadioNodeList = dom.window.RadioNodeList;

    // Mock functions that might be used with proper typing
    (global.window.scrollTo as unknown) = vi.fn<[number, number], void>();
    (global.window.alert as unknown) = vi.fn<[message?: string], void>();
    (global.window.confirm as unknown) = vi
      .fn<[message?: string], boolean>()
      .mockReturnValue(true);
  }
}
