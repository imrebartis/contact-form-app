/**
 * Utility class for managing a loading spinner overlay
 */
export class SpinnerUtils {
  private static spinnerElement: HTMLDivElement | null = null;
  private static timeoutId: number | null = null;
  private static lastFocusedElement: HTMLElement | null = null;
  private static showTime: number = 0;

  /**
   * Shows the loading spinner
   */
  public static showSpinner(): void {
    // Clear any existing timeout
    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    // Save current focus for later restoration
    this.lastFocusedElement = document.activeElement as HTMLElement;

    // Start display timer to ensure minimum visibility
    this.showTime = Date.now();

    // Create spinner if it doesn't exist
    if (!this.spinnerElement) {
      // Create a live region for announcements
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.textContent = 'Loading page, please wait';

      // Create the spinner
      this.spinnerElement = document.createElement('div');
      this.spinnerElement.className = 'spinner-overlay';
      this.spinnerElement.setAttribute('role', 'status');
      this.spinnerElement.innerHTML =
        '<div class="spinner" aria-busy="true"></div>';

      // Append both to the body
      document.body.appendChild(liveRegion);
      document.body.appendChild(this.spinnerElement);
    } else {
      this.spinnerElement.style.display = 'flex';
    }
  }

  /**
   * Hides the loading spinner
   * @param delay Optional delay in milliseconds before hiding the spinner
   */
  public static hideSpinner(delay: number = 0): void {
    if (!this.spinnerElement) return;

    // Ensure spinner shows for at least 400ms to prevent flashing
    const elapsedTime = Date.now() - this.showTime;
    const minimumTime = 400; // milliseconds
    const remainingTime = Math.max(0, minimumTime - elapsedTime);
    const totalDelay = remainingTime + delay;

    if (totalDelay > 0) {
      this.timeoutId = window.setTimeout(() => {
        this.hideSpinnerImmediate();
        this.restoreFocus();
      }, totalDelay);
    } else {
      this.hideSpinnerImmediate();
      this.restoreFocus();
    }
  }

  /**
   * Immediately hides the spinner without delay
   */
  private static hideSpinnerImmediate(): void {
    if (this.spinnerElement) {
      this.spinnerElement.style.display = 'none';
    }

    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  /**
   * Restores focus to the previously focused element
   */
  private static restoreFocus(): void {
    // Restore focus to the previously focused element or to the main content
    if (
      this.lastFocusedElement &&
      document.body.contains(this.lastFocusedElement)
    ) {
      this.lastFocusedElement.focus();
    } else {
      // Focus on main content area as fallback
      const mainContent =
        document.querySelector('main, [role="main"]') ||
        document.getElementById('app');
      if (mainContent instanceof HTMLElement) {
        mainContent.setAttribute('tabindex', '-1');
        mainContent.focus();
        mainContent.removeAttribute('tabindex');
      }
    }
  }

  /**
   * Shows spinner during execution of an async function
   * @param asyncFn Function to execute while showing spinner
   * @returns Result of the async function
   */
  public static async withSpinner<T>(asyncFn: () => Promise<T>): Promise<T> {
    this.showSpinner();
    try {
      return await asyncFn();
    } finally {
      this.hideSpinner(300); // Small delay for smoother UX
    }
  }
}
