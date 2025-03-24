import { AuthStorage } from '../utils/auth-storage';
import { DOMUtils } from '../utils/dom-utils';
import { Router } from '../utils/router';

export class LandingPage {
  private container: HTMLElement;
  private apiBaseUrl: string;
  private authStatusUrl: string;
  private githubAuthUrl: string;
  private logoutUrl: string;

  constructor(container: HTMLElement) {
    this.container = container;

    // Add fallbacks for API URLs
    this.apiBaseUrl =
      import.meta.env.MODE === 'production'
        ? import.meta.env.VITE_APP_API_URL_PROD || ''
        : import.meta.env.VITE_APP_API_URL_DEV || 'http://localhost:3001';

    // Set up endpoints
    this.authStatusUrl = this.apiBaseUrl + '/api/auth/status';

    // Always use local auth endpoint when VITE_USE_LOCAL_AUTH is true,
    // regardless of mode
    if (import.meta.env.VITE_USE_LOCAL_AUTH === 'true') {
      this.githubAuthUrl = this.apiBaseUrl + '/api/auth/github';
      console.log('Using local GitHub auth URL:', this.githubAuthUrl);
    } else {
      this.githubAuthUrl =
        import.meta.env.MODE === 'production'
          ? import.meta.env.VITE_GITHUB_AUTH_URL ||
            this.apiBaseUrl + '/api/auth/github'
          : this.apiBaseUrl + '/api/auth/github';
    }

    this.logoutUrl = this.apiBaseUrl + '/api/auth/logout';

    console.log('LandingPage initialized');
  }

  private logDebugInfo(): void {
    console.log('AuthStorage data:', AuthStorage.getAuthData());
    console.log('Current URL:', window.location.href);
    console.log('Environment mode:', import.meta.env.MODE);
  }

  public render(): void {
    this.logDebugInfo();
    // Check for GitHub auth parameters in URL first
    if (this.handleAuthParams()) {
      console.log('Rendered authenticated welcome via URL parameters');
      return; // Early return if auth params were handled
    }

    // Then check storage for previously authenticated session
    const userData = AuthStorage.getAuthData();
    if (userData && window.location.pathname === '/welcome') {
      console.log('Rendering welcome from stored auth data');
      this.renderWelcomeMessage(userData);
      return;
    }

    // Continue with normal landing page rendering...
    this.renderLandingPage();
  }

  private async renderLandingPage(): Promise<void> {
    this.logDebugInfo();
    // Existing logic for checking auth status
    const authStatus = await this.checkAuthStatus();

    if (authStatus.isAuthenticated) {
      // Render the authenticated view
      this.renderWelcomeMessage(authStatus.user);
    } else {
      // Render login options
      this.renderLoginOptions();
    }
  }

  private async checkAuthStatus(): Promise<any> {
    try {
      // Cache-busting parameter
      const timestamp = new Date().getTime();
      const url = `${this.authStatusUrl}?t=${timestamp}`;

      const response = await fetch(url, {
        credentials: 'include',
        // Remove problematic headers
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(
          `Auth status request failed with status: ${response.status} ${response.statusText}`
        );
        try {
          const errorText = await response.text();
          console.error('Error response body:', errorText);
        } catch (textError) {
          console.error('Could not read error response text:', textError);
        }
        return { isAuthenticated: false };
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const data = await response.json();
          return data;
        } catch (jsonError) {
          console.error('Failed to parse JSON response:', jsonError);
          return { isAuthenticated: false };
        }
      } else {
        console.error(
          'Received non-JSON response with content type:',
          contentType
        );
        return { isAuthenticated: false };
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      return { isAuthenticated: false };
    }
  }

  private renderLoginOptions(): void {
    const content = document.createElement('div');
    content.className = 'landing-page';

    content.innerHTML = `
      <div class="landing-container">
        <h1>Contact Form</h1>
        <p>Please choose how you would like to continue:</p>

        <div class="landing-buttons">
          <button id="github-signin" class="btn btn-primary">
            Sign in with GitHub
          </button>

          <button id="continue-without-signin" class="btn btn-secondary">
            Continue without signing in
          </button>
        </div>
      </div>
    `;

    this.container.innerHTML = '';
    this.container.appendChild(content);

    // Add event listener for "Continue without signing in" button
    const continueButton = this.container.querySelector(
      '#continue-without-signin'
    );
    console.log('Continue without signin button:', continueButton);
    if (continueButton) {
      continueButton.addEventListener('click', () => {
        this.showContactForm();
      });
    }

    const githubSigninButton = this.container.querySelector('#github-signin');
    if (githubSigninButton) {
      githubSigninButton.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Redirecting to GitHub auth URL:', this.githubAuthUrl);
        // Direct browser navigation using window.location
        window.location.href = this.githubAuthUrl;
      });
    }
  }

  private renderWelcomeMessage(user: any): void {
    const content = document.createElement('div');
    content.className = 'landing-page';

    content.innerHTML = `
      <div class="landing-container">
        <h1>Welcome, ${DOMUtils.escapeHTML(user.name || user.email)}</h1>
        <p>${user.isAdmin ? 'You have admin access.' : 'You are logged in.'}</p>

        <div class="landing-buttons">
          <button id="continue-to-form" class="btn btn-primary">
            Continue to Contact Form
          </button>

          ${
            user.isAdmin
              ? `
          <button id="view-submissions" class="btn btn-secondary">
            View Submissions
          </button>
        `
              : ''
          }

          <button id="sign-out" class="btn btn-outline">
            Sign Out
          </button>
        </div>
      </div>
    `;

    this.container.innerHTML = '';
    this.container.appendChild(content);

    // Add event listener for "Continue to Contact Form" button
    const continueButton = this.container.querySelector('#continue-to-form');
    if (continueButton) {
      continueButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.showContactForm();
      });
    }

    // Add event listener for "View Submissions" button
    const viewSubmissionsButton =
      this.container.querySelector('#view-submissions');
    if (viewSubmissionsButton) {
      viewSubmissionsButton.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Navigating to submissions page');
        window.location.href = `${this.apiBaseUrl}/api/submissions`;
      });
    }

    // Add event listener for "Sign Out" button
    const signOutButton = this.container.querySelector('#sign-out');
    if (signOutButton) {
      signOutButton.addEventListener('click', async () => {
        try {
          const response = await fetch(this.logoutUrl, {
            method: 'GET',
            credentials: 'include',
          });

          if (response.ok) {
            window.history.pushState({}, '', '/');
            Router.getInstance().setCurrentPath('/');
            window.location.reload();
          } else {
            console.error('Failed to log out');
          }
        } catch (error) {
          console.error('Error during logout:', error);
        }
      });
    }
  }

  private async showContactForm(): Promise<void> {
    console.log('Navigation to contact form triggered');

    // Update the URL
    window.history.pushState({}, '', '/contact-form');

    // We'll update our router's internal state to match
    const router = Router.getInstance();
    router.setCurrentPath('/contact-form');

    // Clear the app container
    if (this.container) {
      this.container.innerHTML = '';

      // Use a more reliable method that directly dispatches the event
      console.log('Directly dispatching showContactForm event');
      const event = new Event('showContactForm');
      document.dispatchEvent(event);
    }
  }

  private handleAuthParams(): boolean {
    this.logDebugInfo();
    // Check for auth parameters in URL
    const urlParams = new URLSearchParams(window.location.search);
    console.log('Current URL:', window.location.href);
    console.log('Search params:', window.location.search);
    console.log('Auth param:', urlParams.get('auth'));

    if (urlParams.get('auth') === 'true') {
      const userId = urlParams.get('id');
      const userName = urlParams.get('name');
      const userEmail = urlParams.get('email');
      const isAdmin = urlParams.get('isAdmin') === 'true';

      console.log('Auth parameters detected, storing user data:', userId);
      console.log('Admin status:', isAdmin);

      if (userId && userName) {
        // Store auth data before clearing URL
        AuthStorage.storeAuthData({
          id: userId,
          name: userName,
          email: userEmail || '',
          isAdmin,
        });

        // Clear query parameters from URL but maintain on welcome page
        window.history.replaceState(
          { page: 'welcome', authenticated: true },
          '',
          '/welcome'
        );

        // Render welcome message with stored auth data
        this.renderWelcomeMessage({
          id: userId,
          name: userName,
          email: userEmail || '',
          isAdmin,
        });

        return true; // Authentication handled
      }
    }

    // No auth parameters or invalid data
    return false;
  }
}
