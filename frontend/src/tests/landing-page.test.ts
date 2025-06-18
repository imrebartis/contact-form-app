import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LandingPage } from '../components/landing-page';
import { AuthStorage } from '../utils/auth-storage';
import { Router } from '../utils/router';
import { SpinnerUtils } from '../utils/spinner';

('use strict');

// Mock the modules
vi.mock('../utils/auth-storage');

// Create a mock Router instance - define it explicitly here
const mockRouter = {
  setCurrentPath: vi.fn(),
  navigateTo: vi.fn(),
};

// Mock Router to return our stable mock object
vi.mock('../utils/router', () => {
  return {
    Router: {
      getInstance: vi.fn(() => mockRouter),
    },
  };
});

vi.mock('../utils/spinner', () => ({
  SpinnerUtils: {
    showSpinner: vi.fn(),
    hideSpinner: vi.fn(),
    withSpinner: vi.fn((fn) => fn()),
  },
}));

// Mock the import.meta.env
vi.stubGlobal('import', {
  meta: {
    env: {
      MODE: 'development',
      VITE_APP_API_URL_DEV: 'http://localhost:3001',
      VITE_USE_LOCAL_AUTH: 'false',
    },
  },
});

describe('LandingPage', () => {
  let landingPage: LandingPage;
  let container: HTMLElement;
  let fetchMock: any;
  // @ts-ignore - This is actually used but TypeScript doesn't recognize it
  let windowSpy: any;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = '<div id="app"></div>';
    container = document.getElementById('app') as HTMLElement;

    // Setup fetch mock
    fetchMock = vi.fn();
    global.fetch = fetchMock;

    // Setup window location mock
    windowSpy = vi.spyOn(window, 'location', 'get');

    // Reset mocks
    vi.clearAllMocks();

    // Create instance
    landingPage = new LandingPage(container);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  describe('constructor', () => {
    it('should set up the API URLs correctly in development mode', () => {
      expect((landingPage as any).apiBaseUrl).toBe('http://localhost:3001');
      expect((landingPage as any).authStatusUrl).toBe(
        'http://localhost:3001/api/auth/status'
      );
      expect((landingPage as any).githubAuthUrl).toBe(
        'http://localhost:3001/api/auth/github'
      );
      expect((landingPage as any).logoutUrl).toBe(
        'http://localhost:3001/api/auth/logout'
      );
    });
  });

  describe('render', () => {
    it('should check for auth params first', () => {
      const handleAuthParamsSpy = vi.spyOn(
        landingPage as any,
        'handleAuthParams'
      );
      const renderLandingPageSpy = vi.spyOn(
        landingPage as any,
        'renderLandingPage'
      );

      handleAuthParamsSpy.mockReturnValueOnce(true);

      landingPage.render();

      expect(handleAuthParamsSpy).toHaveBeenCalled();
      expect(renderLandingPageSpy).not.toHaveBeenCalled();
    });

    it('should check for stored auth data if no auth params', () => {
      const handleAuthParamsSpy = vi.spyOn(
        landingPage as any,
        'handleAuthParams'
      );
      const renderWelcomeMessageSpy = vi.spyOn(
        landingPage as any,
        'renderWelcomeMessage'
      );
      const renderLandingPageSpy = vi.spyOn(
        landingPage as any,
        'renderLandingPage'
      );

      handleAuthParamsSpy.mockReturnValueOnce(false);

      const mockUser = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        isAdmin: false,
      };
      (AuthStorage.getAuthData as jest.Mock).mockReturnValueOnce(mockUser);

      // Mock window.location.pathname
      Object.defineProperty(window, 'location', {
        value: { pathname: '/welcome' },
        writable: true,
      });

      landingPage.render();

      expect(handleAuthParamsSpy).toHaveBeenCalled();
      expect(AuthStorage.getAuthData).toHaveBeenCalled();
      expect(renderWelcomeMessageSpy).toHaveBeenCalledWith(mockUser);
      expect(renderLandingPageSpy).not.toHaveBeenCalled();
    });

    it('should render landing page if no auth params and no stored auth data', async () => {
      const handleAuthParamsSpy = vi.spyOn(
        landingPage as any,
        'handleAuthParams'
      );
      const renderLandingPageSpy = vi.spyOn(
        landingPage as any,
        'renderLandingPage'
      );

      handleAuthParamsSpy.mockReturnValueOnce(false);
      (AuthStorage.getAuthData as jest.Mock).mockReturnValueOnce(null);

      renderLandingPageSpy.mockResolvedValueOnce(undefined);

      await landingPage.render();

      expect(handleAuthParamsSpy).toHaveBeenCalled();
      expect(AuthStorage.getAuthData).toHaveBeenCalled();
      expect(renderLandingPageSpy).toHaveBeenCalled();
    });
  });

  describe('handleAuthParams', () => {
    it('should return false if no auth params in URL', () => {
      Object.defineProperty(window, 'location', {
        value: { search: '' },
        writable: true,
      });

      const result = (landingPage as any).handleAuthParams();
      expect(result).toBe(false);
    });

    it('should store auth data and render welcome message if valid auth params', () => {
      const renderWelcomeMessageSpy = vi.spyOn(
        landingPage as any,
        'renderWelcomeMessage'
      );
      const historyReplaceStateSpy = vi.spyOn(window.history, 'replaceState');

      Object.defineProperty(window, 'location', {
        value: {
          search:
            '?auth=true&id=123&name=Test&email=test@example.com&isAdmin=true',
        },
        writable: true,
      });

      const result = (landingPage as any).handleAuthParams();

      expect(result).toBe(true);
      expect(AuthStorage.storeAuthData).toHaveBeenCalledWith({
        id: '123',
        name: 'Test',
        email: 'test@example.com',
        isAdmin: true,
      });
      expect(historyReplaceStateSpy).toHaveBeenCalledWith(
        { page: 'welcome', authenticated: true },
        '',
        '/welcome'
      );
      expect(renderWelcomeMessageSpy).toHaveBeenCalledWith({
        id: '123',
        name: 'Test',
        email: 'test@example.com',
        isAdmin: true,
      });
    });

    it('should return false if auth=true but no userId or userName', () => {
      Object.defineProperty(window, 'location', {
        value: { search: '?auth=true' },
        writable: true,
      });

      const result = (landingPage as any).handleAuthParams();
      expect(result).toBe(false);
    });
  });

  describe('renderLoginOptions', () => {
    it('should render login options with correct buttons', () => {
      (landingPage as any).renderLoginOptions();

      expect(container.innerHTML).toContain('<h1>Contact Form</h1>');
      expect(container.innerHTML).toContain('Sign in with GitHub');
      expect(container.innerHTML).toContain('Continue without signing in');

      const githubButton = container.querySelector('#github-signin');
      const continueButton = container.querySelector(
        '#continue-without-signin'
      );

      expect(githubButton).not.toBeNull();
      expect(continueButton).not.toBeNull();
    });

    it('should attach event listeners to buttons', () => {
      const showContactFormSpy = vi.spyOn(
        landingPage as any,
        'showContactForm'
      );
      const handleLoginSpy = vi.spyOn(landingPage as any, 'handleLogin');

      (landingPage as any).renderLoginOptions();

      const githubButton = container.querySelector(
        '#github-signin'
      ) as HTMLButtonElement;
      const continueButton = container.querySelector(
        '#continue-without-signin'
      ) as HTMLButtonElement;

      continueButton.click();
      expect(showContactFormSpy).toHaveBeenCalled();

      githubButton.click();
      expect(handleLoginSpy).toHaveBeenCalled();
    });
  });

  describe('renderWelcomeMessage', () => {
    it('should render welcome message for regular user', () => {
      const user = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        isAdmin: false,
      };

      (landingPage as any).renderWelcomeMessage(user);

      expect(container.innerHTML).toContain('<h1>Welcome, Test User</h1>');
      expect(container.innerHTML).toContain('You are logged in.');
      expect(container.innerHTML).toContain('Continue to Contact Form');
      expect(container.innerHTML).toContain('Sign Out');
      expect(container.innerHTML).not.toContain('View Submissions');
    });

    it('should render welcome message with admin options for admin user', () => {
      const admin = {
        id: '123',
        name: 'Admin User',
        email: 'admin@example.com',
        isAdmin: true,
      };

      (landingPage as any).renderWelcomeMessage(admin);

      expect(container.innerHTML).toContain('<h1>Welcome, Admin User</h1>');
      expect(container.innerHTML).toContain('You have admin access.');
      expect(container.innerHTML).toContain('View Submissions');
    });

    it('should attach event listeners to buttons in welcome message', () => {
      const showContactFormSpy = vi.spyOn(
        landingPage as any,
        'showContactForm'
      );
      const handleLogoutSpy = vi.spyOn(landingPage as any, 'handleLogout');

      const admin = {
        id: '123',
        name: 'Admin User',
        email: 'admin@example.com',
        isAdmin: true,
      };

      (landingPage as any).renderWelcomeMessage(admin);

      const continueButton = container.querySelector(
        '#continue-to-form'
      ) as HTMLButtonElement;
      const signOutButton = container.querySelector(
        '#sign-out'
      ) as HTMLButtonElement;
      const viewSubmissionsButton = container.querySelector(
        '#view-submissions'
      ) as HTMLButtonElement;

      continueButton.click();
      expect(showContactFormSpy).toHaveBeenCalled();

      signOutButton.click();
      expect(handleLogoutSpy).toHaveBeenCalled();

      // Test view submissions button redirects with spinner
      const originalLocation = window.location;
      Object.defineProperty(window, 'location', {
        value: { href: '' },
        writable: true,
      });

      viewSubmissionsButton.click();

      expect(SpinnerUtils.showSpinner).toHaveBeenCalled();
      expect(window.location.href).toBe(
        'http://localhost:3001/api/submissions'
      );

      window.location = originalLocation as string & Location;
    });
  });

  describe('showContactForm', () => {
    it('should update URL and router path, dispatch event, and show spinner', async () => {
      const historyPushStateSpy = vi.spyOn(window.history, 'pushState');
      const dispatchEventSpy = vi.spyOn(document, 'dispatchEvent');

      await (landingPage as any).showContactForm();

      expect(SpinnerUtils.showSpinner).toHaveBeenCalled();
      expect(historyPushStateSpy).toHaveBeenCalledWith({}, '', '/contact-form');
      expect(Router.getInstance().setCurrentPath).toHaveBeenCalledWith(
        '/contact-form'
      );
      expect(dispatchEventSpy).toHaveBeenCalled();
      expect(container.innerHTML).toBe('');
      expect(SpinnerUtils.hideSpinner).toHaveBeenCalledWith(300);
    });
  });

  describe('handleLogin', () => {
    it('should prevent default and redirect to GitHub auth URL', () => {
      const preventDefault = vi.fn();
      const event = { preventDefault } as unknown as Event;

      // Mock window.location.href
      const originalLocation = window.location;
      window.location = { href: '' } as string & Location;

      (landingPage as any).handleLogin(event);

      expect(preventDefault).toHaveBeenCalled();
      expect(SpinnerUtils.showSpinner).toHaveBeenCalled();
      expect(window.location.href).toBe(
        'http://localhost:3001/api/auth/github'
      );

      window.location = originalLocation as string & Location;
    });
  });

  describe('handleLogout', () => {
    it('should call logout endpoint and clear auth data on success', async () => {
      const historyPushStateSpy = vi.spyOn(window.history, 'pushState');

      fetchMock.mockResolvedValueOnce({
        ok: true,
      });

      // Mock window.location.reload
      const reloadMock = vi.fn();
      Object.defineProperty(window, 'location', {
        value: { reload: reloadMock },
        writable: true,
      });

      await (landingPage as any).handleLogout();

      expect(SpinnerUtils.showSpinner).toHaveBeenCalled();
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/logout',
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      expect(AuthStorage.clearAuthData).toHaveBeenCalled();
      expect(historyPushStateSpy).toHaveBeenCalledWith({}, '', '/');
      expect(Router.getInstance().setCurrentPath).toHaveBeenCalledWith('/');
      expect(reloadMock).toHaveBeenCalled();
    });

    it('should handle errors during logout', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      fetchMock.mockRejectedValueOnce(new Error('Network error'));

      await (landingPage as any).handleLogout();

      expect(SpinnerUtils.showSpinner).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error during logout:',
        expect.any(Error)
      );
      expect(SpinnerUtils.hideSpinner).toHaveBeenCalled();
    });

    it('should handle failed logout response', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // Mock a failed Response with status and statusText
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({
          error: { message: 'Logout failed', details: 'Session expired' },
        }),
        text: async () => '',
        clone() {
          return this;
        },
      });

      await (landingPage as any).handleLogout();

      expect(SpinnerUtils.showSpinner).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Logout failed: Session expired');
      expect(SpinnerUtils.hideSpinner).toHaveBeenCalled();
    });
  });

  describe('checkAuthStatus', () => {
    it('should use spinner during auth status check', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => 'application/json',
        },
        json: vi.fn().mockResolvedValueOnce({
          isAuthenticated: true,
          user: { name: 'Test' },
        }),
      });

      const result = await (landingPage as any).checkAuthStatus();

      expect(SpinnerUtils.withSpinner).toHaveBeenCalled();
      expect(result).toEqual({ isAuthenticated: true, user: { name: 'Test' } });
    });

    it('should handle successful JSON response', async () => {
      const mockResponse = {
        isAuthenticated: true,
        user: { id: '123', name: 'Test' },
      };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => 'application/json',
        },
        json: vi.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await (landingPage as any).checkAuthStatus();

      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('http://localhost:3001/api/auth/status?t='),
        expect.objectContaining({
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('should handle failed response', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error',
        text: vi.fn().mockResolvedValueOnce('Internal Server Error'),
        clone() {
          return this;
        },
      });

      const result = await (landingPage as any).checkAuthStatus();

      expect(result).toEqual({ isAuthenticated: false });
      expect(consoleSpy).toHaveBeenCalledWith(
        'API error:',
        'Internal Server Error'
      );
    });

    it('should handle JSON parsing errors', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      fetchMock.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => 'application/json',
        },
        json: vi.fn().mockRejectedValueOnce(new Error('Invalid JSON')),
      });

      const result = await (landingPage as any).checkAuthStatus();

      expect(result).toEqual({ isAuthenticated: false });
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to parse JSON response:',
        expect.any(Error)
      );
    });

    it('should handle non-JSON responses', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      fetchMock.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => 'text/html',
        },
      });

      const result = await (landingPage as any).checkAuthStatus();

      expect(result).toEqual({ isAuthenticated: false });
      expect(consoleSpy).toHaveBeenCalledWith(
        'Received non-JSON response with content type:',
        'text/html'
      );
    });

    it('should handle network errors', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      fetchMock.mockRejectedValueOnce(new Error('Network error'));

      const result = await (landingPage as any).checkAuthStatus();

      expect(result).toEqual({ isAuthenticated: false });
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error checking auth status:',
        expect.any(Error)
      );
    });
  });
});
