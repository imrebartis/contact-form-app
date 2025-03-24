'use strict';

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
  private apiUrl: string;

  /**
   * Initializes a new FormSubmitter with toast notification service
   *
   * @param toastService - Service to display submission notifications
   */
  constructor(toastService: IToastService) {
    this.toastService = toastService;

    // Determine API URL based on environment mode
    const baseUrl =
      import.meta.env.MODE === 'production'
        ? import.meta.env.VITE_APP_API_URL_PROD || window.location.origin
        : import.meta.env.VITE_APP_API_URL_DEV;

    this.apiUrl = `${baseUrl || 'http://localhost:3001'}/api/submissions`;
  }

  /**
   * Validates and formats form data to ensure it matches server requirements
   *
   * @param formData - The raw form data to validate and format
   * @returns Properly formatted form data for submission
   */
  private formatFormData(formData: FormData): any {
    // Ensure all required fields are present
    const requiredFields = ['firstName', 'lastName', 'email', 'message'];
    for (const field of requiredFields) {
      if (!(field in formData) || (formData as any)[field].trim() === '') {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Format data according to what the backend expects
    // The backend expects a specific format with 'submission' wrapper
    return {
      submission: {
        ...formData,
        // Ensure timestamp is included
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Submits form data to the backend API
   *
   * @param formData - The sanitized form data to submit
   * @param signal - Optional AbortSignal to cancel the submission
   * @throws Will throw an error if submission is aborted or fails
   */
  async submitForm(formData: FormData, signal?: AbortSignal): Promise<void> {
    try {
      // Format and validate the data before submission
      const formattedData = this.formatFormData(formData);
      console.log('Formatted form data being submitted:', formattedData);

      // Create a promise that can be aborted
      await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(async () => {
          try {
            // Submit form data to the backend API
            const response = await fetch(this.apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                // Alternative security measures that don't rely on cookies
                'X-Form-Submission-Time': Date.now().toString(),
                'X-Form-Origin': window.location.origin || 'unknown',
              },
              body: JSON.stringify(formattedData),
              credentials: 'include', // include credentials if they're available
              signal,
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error('API error response:', errorText);
              throw new Error(`API error: ${response.status} - ${errorText}`);
            }

            resolve(null);
          } catch (error) {
            console.error('Form submission error:', error);
            reject(error);
          }
        }, 1500);

        // If provided, handle abort signal
        if (signal) {
          signal.addEventListener('abort', () => {
            clearTimeout(timeoutId);
            reject(new DOMException('Form submission aborted', 'AbortError'));
          });
        }
      });
    } catch (error) {
      console.error('Form validation error:', error);
      throw error;
    }
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
