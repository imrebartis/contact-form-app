import { ContactFormApp } from '../main';
import { AuthStorage } from '../utils/auth-storage';
import { SpinnerUtils } from './spinner';

export class Router {
  private static instance: Router | null = null;
  private routes: Map<string, () => void>;
  private currentPath: string = '/';
  private isPopStateHandling = false;

  private constructor() {
    this.routes = new Map();
    this.setupRoutes();

    // Ensure history has an initial state with flag
    this.initializeHistoryState();

    // Listen for popstate events (browser back/forward)
    window.addEventListener('popstate', async () => {
      // Set flag to prevent other navigation during this handler
      this.isPopStateHandling = true;

      try {
        // Get the actual path before normalization
        const actualPath = window.location.pathname;

        // If this is an API path, let the browser handle it directly
        if (actualPath.startsWith('/api/')) {
          this.isPopStateHandling = false;
          return; // Exit early and let the browser handle the API request
        }

        const normalizedPath = this.mapPathToRoute(actualPath);
        // For all other navigation cases, update the current path
        this.currentPath = normalizedPath;

        // Execute the direct action based on the path
        if (normalizedPath === '/contact-form') {
          // We're navigating back to the contact form
          const app = ContactFormApp.getInstance();
          app.cleanup();

          if (app.getAppContainer()) {
            const event = new Event('showContactForm');
            document.dispatchEvent(event);
          }
        } else if (normalizedPath === '/welcome') {
          // We're navigating back to the welcome page
          const app = ContactFormApp.getInstance();
          app.cleanup();
          app.showAuthenticatedWelcome();
        } else {
          // We're navigating back to the home/landing page
          // Force a complete refresh of the app
          const app = ContactFormApp.getInstance();
          app.cleanup();

          // Force a manual DOM reset and rerender
          const appContainer = document.getElementById('app');
          if (appContainer) {
            appContainer.innerHTML = '';

            if (app.getAppContainer() !== appContainer) {
              const newAppContainer = document.createElement('div');
              newAppContainer.id = 'app';
              document.body.appendChild(newAppContainer);
            }
          }

          // Reinitialize from scratch with slight delay
          window.setTimeout(() => app.init(), 0);
        }
      } finally {
        this.isPopStateHandling = false;
      }
    });

    this.handleInitialRoute();
  }

  /**
   * Get the singleton instance of the Router
   */
  public static getInstance(): Router {
    if (!Router.instance) {
      Router.instance = new Router();
    }
    return Router.instance;
  }

  // For testing purposes only
  public static resetInstance(): void {
    Router.instance = null;
  }

  private setupRoutes() {
    // Homepage route (unauthenticated landing page)
    this.routes.set('/', () => {
      // Always perform full cleanup when showing landing page
      const app = ContactFormApp.getInstance();
      app.cleanup();
      app.init();
    });

    // Authenticated welcome page route
    this.routes.set('/welcome', () => {
      const app = ContactFormApp.getInstance();
      app.cleanup();

      // Check if user is authenticated via storage
      const userData = AuthStorage.getAuthData();
      if (userData) {
        // Call with the userData from storage
        app.showAuthenticatedWelcome();
      } else {
        app.showAuthenticatedWelcome();
      }
    });

    // Contact form route
    this.routes.set('/contact-form', () => {
      // Show contact form directly without initializing the landing page
      const app = ContactFormApp.getInstance();
      // Ensure cleanup before showing the form
      app.cleanup();

      // Directly initialize the contact form rather than going through the landing page
      if (app.getAppContainer()) {
        app.showContactFormDirectly();
      } else {
        console.error('App container not found');
      }
    });
  }

  private handleInitialRoute() {
    const path = window.location.pathname;
    // Normalize the path
    this.currentPath = this.mapPathToRoute(path);

    // For authenticated welcome page, ensure we have a history entry to go back to
    if (this.currentPath === '/welcome') {
      // Check if we have any history entries to go back to
      if (window.history.length <= 1) {
        // Create a history entry for the root path first, then push the welcome state
        window.history.replaceState({ page: 'root' }, '', '/');
        window.history.pushState({ page: 'welcome' }, '', '/welcome');
      }
    }

    // Handle each potential route
    if (this.currentPath === '/contact-form') {
      const app = ContactFormApp.getInstance();

      // Skip initialization of landing page and go directly to contact form
      app.cleanup();

      // Directly initialize contact form
      app.showContactFormDirectly();
    } else if (this.currentPath === '/welcome') {
      const app = ContactFormApp.getInstance();
      app.cleanup();
      app.showAuthenticatedWelcome();
    } else {
      // For homepage, just initialize normally
      ContactFormApp.getInstance().init();
    }
  }

  private handleRouteChange(isBackNavigation = false) {
    const path = window.location.pathname;

    // Normalize the path
    const normalizedPath = this.mapPathToRoute(path);

    // Always handle back navigation or path changes
    if (isBackNavigation || normalizedPath !== this.currentPath) {
      this.currentPath = normalizedPath;

      const route = this.routes.get(normalizedPath);
      if (route) {
        route();
      } else {
        // Fallback to homepage if no route is found
        const homeRoute = this.routes.get('/');
        if (homeRoute) {
          homeRoute();
        }
      }
    }
  }

  public navigateTo(path: string) {
    if (this.isPopStateHandling) {
      return;
    }

    SpinnerUtils.showSpinner();

    // Normalize the path
    const normalizedPath = this.mapPathToRoute(path);

    if (normalizedPath !== this.currentPath) {
      window.history.pushState({}, '', normalizedPath);
      this.currentPath = normalizedPath;

      // Handle each potential route
      if (normalizedPath === '/contact-form') {
        const app = ContactFormApp.getInstance();
        app.cleanup();

        // Use direct method instead of event dispatch for consistent behavior
        if (app.getAppContainer()) {
          app.showContactFormDirectly();
        } else {
          console.error('App container not found');
        }
      } else if (normalizedPath === '/welcome') {
        const app = ContactFormApp.getInstance();
        app.cleanup();
        app.showAuthenticatedWelcome();
      } else {
        this.handleRouteChange(false);
      }
    }

    SpinnerUtils.hideSpinner(300);
  }

  /**
   * Handles special authenticated navigation to welcome page
   * Ensures proper history state is set up to prevent back navigation to landing
   */
  public navigateToWelcome(userId: string): void {
    // Simplify navigation without auth protection flags
    SpinnerUtils.showSpinner();

    if (window.location.pathname.includes('/api/auth')) {
      // We're coming from OAuth
      window.history.pushState(
        {
          page: 'welcome',
          userId,
        },
        '',
        '/welcome'
      );
    } else {
      // Standard navigation
      window.history.replaceState(
        {
          page: 'welcome',
          userId,
        },
        '',
        '/welcome'
      );
    }

    // Update router's internal path
    this.currentPath = '/welcome';

    SpinnerUtils.hideSpinner(300);
  }

  /**
   * Sets the current path directly (used for synchronizing router state)
   */
  public setCurrentPath(path: string): void {
    // Normalize the path
    this.currentPath = this.mapPathToRoute(path);
  }

  /**
   * Normalizes a path to one of the recognized routes
   * @param path The path to normalize
   * @returns The normalized path: '/', '/welcome', or '/contact-form'
   */
  private mapPathToRoute(path: string): string {
    // Don't intercept API paths - let them be handled by the server
    if (path.startsWith('/api/')) {
      return path; // Return the API path unchanged
    }

    if (path === '/contact-form') {
      return '/contact-form';
    } else if (path === '/welcome') {
      return '/welcome';
    } else {
      return '/';
    }
  }

  // New method to ensure proper history state initialization
  private initializeHistoryState() {
    // Capture current path and state
    const currentPath = window.location.pathname;

    // If we're on the welcome page, initialize with simple state
    if (currentPath === '/welcome') {
      // Create a simple state for the welcome page
      window.history.replaceState(
        {
          page: 'welcome',
          timestamp: Date.now(),
        },
        '',
        '/welcome'
      );

      // Update router's internal state
      this.currentPath = '/welcome';
    }
  }
}
