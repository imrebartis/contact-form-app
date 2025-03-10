import {
  IFormSubmitter,
  IToastService,
} from '../../interfaces/form-interfaces';
import { FormData } from '../../types/form.types';

/**
 * Handles form submission operations and success notifications
 * Implements the IFormSubmitter interface
 */
export class FormSubmitter implements IFormSubmitter {
  /** Service for displaying toast notifications to the user */
  private toastService: IToastService;

  /**
   * Initializes a new FormSubmitter with toast notification service
   *
   * @param toastService - Service to display submission notifications
   */
  constructor(toastService: IToastService) {
    this.toastService = toastService;
  }

  /**
   * Submits form data to the server
   * Currently simulates submission with a delay
   *
   * @param formData - The sanitized form data to submit
   * @param signal - Optional AbortSignal to cancel the submission
   * @throws Will throw an error if submission is aborted or fails
   */
  async submitForm(formData: FormData, signal?: AbortSignal): Promise<void> {
    // Create a promise that can be aborted
    await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(resolve, 1500);

      // If provided, handle abort signal
      if (signal) {
        signal.addEventListener('abort', () => {
          clearTimeout(timeoutId);
          reject(new DOMException('Form submission aborted', 'AbortError'));
        });
      }
    });

    console.log('Form submitted:', formData);
  }

  /**
   * Displays a success message after successful form submission
   */
  showSuccessMessage(): void {
    this.toastService.showFormSubmissionSuccess(
      'Message Sent!',
      "Thanks for completing the form. We'll be in touch soon!"
    );
  }
}
