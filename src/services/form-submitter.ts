import { IFormSubmitter, IToastService } from '../interfaces/form-interfaces';
import { FormData } from '../types/form.types';

export class FormSubmitter implements IFormSubmitter {
  private toastService: IToastService;

  constructor(toastService: IToastService) {
    this.toastService = toastService;
  }

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

  showSuccessMessage(): void {
    this.toastService.showFormSubmissionSuccess(
      'Message Sent!',
      "Thanks for completing the form. We'll be in touch soon!"
    );
  }
}
