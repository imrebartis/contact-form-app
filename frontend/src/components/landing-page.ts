import { DOMUtils } from '../utils/dom-utils';

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
    this.githubAuthUrl =
      import.meta.env.VITE_GITHUB_AUTH_URL ||
      this.apiBaseUrl + '/api/auth/callback/github';
    this.logoutUrl = this.apiBaseUrl + '/api/auth/logout';
  }

  async render(): Promise<void> {
    // Check if user is already authenticated
    const authStatus = await this.checkAuthStatus();

    if (authStatus.isAuthenticated) {
      // User is already logged in, render welcome message
      this.renderWelcomeMessage(authStatus.user);
    } else {
      // User is not logged in, render login options
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
          <a href="${this.githubAuthUrl}" class="btn btn-primary">
            Sign in with GitHub
          </a>

          <button id="continue-without-signin" class="btn btn-secondary">
            Continue without signing in
          </button>
        </div>
      </div>
    `;

    this.container.innerHTML = '';
    this.container.appendChild(content);

    // Add event listener for "Continue without signing in" button
    const continueButton = document.getElementById('continue-without-signin');
    if (continueButton) {
      continueButton.addEventListener('click', () => {
        this.showContactForm();
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
            <a href="${this.apiBaseUrl}/api/submissions">
              View Submissions
            </a>
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
    const continueButton = document.getElementById('continue-to-form');
    if (continueButton) {
      continueButton.addEventListener('click', () => {
        this.showContactForm();
      });
    }

    // Add event listener for "Sign Out" button
    const signOutButton = document.getElementById('sign-out');
    signOutButton?.addEventListener('click', async () => {
      try {
        const response = await fetch(this.logoutUrl, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          // Force reload the page to clear any cached auth state
          window.location.reload();
        } else {
          console.error('Failed to log out');
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    });
  }

  private showContactForm(): void {
    // Clear the landing page
    this.container.innerHTML = '';

    // Initialize the contact form
    // This will use the existing ContactFormApp functionality
    const event = new Event('showContactForm');
    document.dispatchEvent(event);
  }
}
