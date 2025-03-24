import { ContactFormApp } from '../main';
import { AuthStorage } from '../utils/auth-storage';

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
    window.addEventListener('popstate', async (event) => {
      // Set flag to prevent other navigation during this handler
      this.isPopStateHandling = true;
      console.log(
        'POPSTATE EVENT FIRED!',
        window.location.pathname,
        event.state
      );

      try {
        // Get the actual path before normalization
        const actualPath = window.location.pathname;
        console.log('ACTUAL path before normalization:', actualPath);

        // Get the previous state BEFORE normalization
        const previousState = window.history.state || {};

        // If this is an API path, let the browser handle it directly
        if (actualPath.startsWith('/api/')) {
          console.log(
            '⚠️ Detected API path, letting browser handle it:',
            actualPath
          );
          this.isPopStateHandling = false;
          return; // Exit early and let the browser handle the API request
        }

        const normalizedPath = this.mapPathToRoute(actualPath);

        console.log('Router internals:', {
          currentPath: this.currentPath,
          actualPath,
          normalizedPath,
          historyState: previousState,
          historyLength: window.history.length,
        });

        // For all other navigation cases, update the current path
        this.currentPath = normalizedPath;

        // Execute the direct action based on the path
        if (normalizedPath === '/contact-form') {
          // We're navigating back to the contact form
          console.log('Back navigation to contact form');
          const app = ContactFormApp.getInstance();
          app.cleanup();

          if (app.getAppContainer()) {
            console.log(
              'Dispatching showContactForm event for back navigation'
            );
            const event = new Event('showContactForm');
            document.dispatchEvent(event);
          }
        } else if (normalizedPath === '/welcome') {
          // We're navigating back to the welcome page
          console.log('Back navigation to the welcome page');
          const app = ContactFormApp.getInstance();
          app.cleanup();
          app.showAuthenticatedWelcome();
        } else {
          // We're navigating back to the home/landing page
          console.log('Back navigation to landing page');

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
      console.log('Executing route handler for /');
      // Always perform full cleanup when showing landing page
      const app = ContactFormApp.getInstance();
      app.cleanup();
      app.init();
    });

    // Authenticated welcome page route
    this.routes.set('/welcome', () => {
      console.log('Executing route handler for /welcome');
      const app = ContactFormApp.getInstance();
      app.cleanup();

      // Check if user is authenticated via storage
      const userData = AuthStorage.getAuthData();
      if (userData) {
        console.log('User authenticated from storage:', userData.id);
        // Call with the userData from storage
        app.showAuthenticatedWelcome();
      } else {
        console.log('No auth data found, showing regular welcome');
        app.showAuthenticatedWelcome();
      }
    });

    // Contact form route
    this.routes.set('/contact-form', () => {
      console.log('Executing route handler for /contact-form');
      // Show contact form directly without initializing the landing page
      const app = ContactFormApp.getInstance();
      // Ensure cleanup before showing the form
      app.cleanup();

      // Directly initialize the contact form rather than going through the landing page
      if (app.getAppContainer()) {
        console.log('Directly showing contact form');
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

    console.log(`Initial route: ${this.currentPath}`);
    console.log('Full URL:', window.location.href);
    console.log('URL params:', window.location.search);

    // For authenticated welcome page, ensure we have a history entry to go back to
    if (this.currentPath === '/welcome') {
      // Check if we have any history entries to go back to
      if (window.history.length <= 1) {
        // Create a history entry for the root path first, then push the welcome state
        window.history.replaceState({ page: 'root' }, '', '/');
        window.history.pushState({ page: 'welcome' }, '', '/welcome');
        console.log(
          'Created history entry for root path to enable back button on welcome page'
        );
      }

      // Check URL parameters for auth data
      const urlParams = new URLSearchParams(window.location.search);
      const hasAuthParam = urlParams.get('auth') === 'true';

      console.log('Welcome page has auth param:', hasAuthParam);

      if (hasAuthParam) {
        console.log('Auth parameters detected on welcome page initial load');
      }
    }

    // Handle each potential route
    if (this.currentPath === '/contact-form') {
      console.log('Initial path is contact form, showing directly');
      const app = ContactFormApp.getInstance();

      // Skip initialization of landing page and go directly to contact form
      app.cleanup();

      // Directly initialize contact form
      console.log('Directly showing contact form on page refresh/initial load');
      app.showContactFormDirectly();
    } else if (this.currentPath === '/welcome') {
      console.log(
        'Initial path is welcome page, showing authenticated welcome'
      );
      const app = ContactFormApp.getInstance();
      app.cleanup();
      app.showAuthenticatedWelcome();
    } else if (this.currentPath.startsWith('/api/')) {
      // Don't interfere with API routes
      console.log(
        'API route detected in initial route handling:',
        this.currentPath
      );
      // Let the server handle it
    } else {
      // For homepage, just initialize normally
      ContactFormApp.getInstance().init();
    }
  }

  private handleRouteChange(isBackNavigation = false) {
    const path = window.location.pathname;

    // Normalize the path
    const normalizedPath = this.mapPathToRoute(path);

    console.log(
      `Handling route change: ${this.currentPath} -> ${normalizedPath}, isBack: ${isBackNavigation}`
    );

    // Always handle back navigation or path changes
    if (isBackNavigation || normalizedPath !== this.currentPath) {
      this.currentPath = normalizedPath;

      const route = this.routes.get(normalizedPath);
      if (route) {
        route();
      } else {
        // Fallback to homepage if no route is found
        console.log('No route found, defaulting to /');
        const homeRoute = this.routes.get('/');
        if (homeRoute) {
          homeRoute();
        }
      }
    }
  }

  public navigateTo(path: string) {
    if (this.isPopStateHandling) {
      console.log('Ignoring navigateTo during popstate handling');
      return;
    }

    // Normalize the path
    const normalizedPath = this.mapPathToRoute(path);

    if (normalizedPath !== this.currentPath) {
      console.log(`Navigating to: ${normalizedPath}`);
      window.history.pushState({}, '', normalizedPath);
      this.currentPath = normalizedPath;

      // Handle each potential route
      if (normalizedPath === '/contact-form') {
        console.log('Direct navigation to contact form');
        const app = ContactFormApp.getInstance();
        app.cleanup();

        // Use direct method instead of event dispatch for consistent behavior
        if (app.getAppContainer()) {
          console.log('Directly showing contact form');
          app.showContactFormDirectly();
        } else {
          console.error('App container not found');
        }
      } else if (normalizedPath === '/welcome') {
        console.log('Direct navigation to welcome page');
        const app = ContactFormApp.getInstance();
        app.cleanup();
        app.showAuthenticatedWelcome();
      } else {
        this.handleRouteChange(false);
      }
    }
  }

  /**
   * Handles special authenticated navigation to welcome page
   * Ensures proper history state is set up to prevent back navigation to landing
   */
  public navigateToWelcome(userId: string): void {
    console.log('Navigating to welcome page as authenticated user');

    // Simplify navigation without auth protection flags
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
  }

  /**
   * Sets the current path directly (used for synchronizing router state)
   */
  public setCurrentPath(path: string): void {
    // Normalize the path
    this.currentPath = this.mapPathToRoute(path);
    console.log(`Router current path set to: ${this.currentPath}`);
  }

  /**
   * Normalizes a path to one of the recognized routes
   * @param path The path to normalize
   * @returns The normalized path: '/', '/welcome', or '/contact-form'
   */
  private mapPathToRoute(path: string): string {
    // Don't intercept API paths - let them be handled by the server
    if (path.startsWith('/api/')) {
      console.log('Not normalizing API path:', path);
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

    console.log('Initializing history state for path:', currentPath);

    // If we're on the welcome page, initialize with simple state
    if (currentPath === '/welcome') {
      console.log('Initializing welcome page state');

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
