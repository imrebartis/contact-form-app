'use strict';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ContactFormApp } from '../main';
import { Router } from '../utils/router';

// Mock ContactFormApp
vi.mock('../main', () => ({
  ContactFormApp: {
    getInstance: vi.fn(),
  },
}));

// Method to reset the Router singleton for testing
Router['resetInstance'] = function () {
  Router['instance'] = null;
};

describe('Router', () => {
  // Setup variables
  let router: any; // Using 'any' to access private properties for testing
  let mockHistoryPushState: ReturnType<typeof vi.fn>;
  let mockApp: {
    cleanup: ReturnType<typeof vi.fn>;
    showContactFormDirectly: ReturnType<typeof vi.fn>;
    showAuthenticatedWelcome: ReturnType<typeof vi.fn>;
    getAppContainer: ReturnType<typeof vi.fn>;
    init: ReturnType<typeof vi.fn>;
  };
  let originalPushState: typeof window.history.pushState;

  beforeEach(() => {
    // Reset Router singleton instance before each test
    Router['resetInstance']();

    // Save original pushState method
    originalPushState = window.history.pushState;

    // Mock pushState directly
    mockHistoryPushState = vi.fn();
    window.history.pushState = mockHistoryPushState;

    // Setup mock app with init method
    mockApp = {
      cleanup: vi.fn(),
      showContactFormDirectly: vi.fn(),
      showAuthenticatedWelcome: vi.fn(),
      getAppContainer: vi.fn().mockReturnValue(document.createElement('div')),
      init: vi.fn(),
    };

    // Setup mock app instance
    (ContactFormApp.getInstance as ReturnType<typeof vi.fn>).mockReturnValue(
      mockApp
    );

    // We need to spy on handleInitialRoute to prevent it from executing during tests
    vi.spyOn(Router.prototype as any, 'handleInitialRoute').mockImplementation(
      () => {}
    );

    // Mock handleRouteChange as well to prevent side effects
    vi.spyOn(Router.prototype as any, 'handleRouteChange').mockImplementation(
      () => {}
    );

    // Get router instance - Note: we're using getInstance to get the singleton
    router = Router.getInstance();

    // Reset currentPath for testing
    router.setCurrentPath('/');
  });

  afterEach(() => {
    vi.clearAllMocks();
    // Restore original pushState method
    window.history.pushState = originalPushState;
    // Reset the Router instance
    vi.unstubAllGlobals();
  });

  describe('navigateTo', () => {
    it('should not navigate when isPopStateHandling is true', () => {
      // Set isPopStateHandling to true
      router['isPopStateHandling'] = true;

      // Attempt navigation
      router.navigateTo('/contact-form');

      // Verify no navigation occurred
      expect(mockHistoryPushState).not.toHaveBeenCalled();
      expect(router['currentPath']).toBe('/');
      expect(mockApp.cleanup).not.toHaveBeenCalled();
    });

    it('should not navigate when path is the same as current path', () => {
      // Set current path
      router['currentPath'] = '/contact-form';

      // Attempt to navigate to the same path
      router.navigateTo('/contact-form');

      // Verify no navigation occurred
      expect(mockHistoryPushState).not.toHaveBeenCalled();
      expect(mockApp.cleanup).not.toHaveBeenCalled();
    });

    it('should navigate to contact form', () => {
      // Execute navigation
      router.navigateTo('/contact-form');

      // Verify history was updated
      expect(mockHistoryPushState).toHaveBeenCalledWith(
        {},
        '',
        '/contact-form'
      );

      // Verify currentPath was updated
      expect(router['currentPath']).toBe('/contact-form');

      // Verify app methods were called
      expect(mockApp.cleanup).toHaveBeenCalledTimes(1);
      expect(mockApp.showContactFormDirectly).toHaveBeenCalledTimes(1);
    });

    it('should handle contact form navigation when app container does not exist', () => {
      // Setup app container to return null
      mockApp.getAppContainer.mockReturnValueOnce(null);

      // Execute navigation
      router.navigateTo('/contact-form');

      // Verify correct behavior
      expect(mockHistoryPushState).toHaveBeenCalledWith(
        {},
        '',
        '/contact-form'
      );
      expect(router['currentPath']).toBe('/contact-form');
      expect(mockApp.cleanup).toHaveBeenCalledTimes(1);
      expect(mockApp.showContactFormDirectly).not.toHaveBeenCalled();
    });

    it('should navigate to welcome page', () => {
      // Execute navigation
      router.navigateTo('/welcome');

      // Verify history was updated
      expect(mockHistoryPushState).toHaveBeenCalledWith({}, '', '/welcome');

      // Verify currentPath was updated
      expect(router['currentPath']).toBe('/welcome');

      // Verify app methods were called
      expect(mockApp.cleanup).toHaveBeenCalledTimes(1);
      expect(mockApp.showAuthenticatedWelcome).toHaveBeenCalledTimes(1);
    });

    it('should handle unknown routes by defaulting to home page', () => {
      // Set current path to something other than '/' so navigation happens
      router.setCurrentPath('/contact-form');

      // Spy on handleRouteChange to verify it's called
      const handleRouteChangeSpy = router['handleRouteChange'];

      // Navigate to unknown route
      router.navigateTo('/unknown');

      // In the actual implementation, the path gets normalized to '/' before pushing to history
      expect(mockHistoryPushState).toHaveBeenCalledWith({}, '', '/');

      // The current path is normalized to '/' for unknown routes
      expect(router['currentPath']).toBe('/');

      // handleRouteChange should be called
      expect(handleRouteChangeSpy).toHaveBeenCalledWith(false);
    });

    it('should handle OAuth paths correctly', () => {
      // The router implementation doesn't normalize API paths
      router.navigateTo('/api/auth/callback');

      // API paths are passed through unchanged
      expect(mockHistoryPushState).toHaveBeenCalledWith(
        {},
        '',
        '/api/auth/callback'
      );

      // Current path should match the API path
      expect(router['currentPath']).toBe('/api/auth/callback');
    });
  });
});
