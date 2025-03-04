import { FormData } from '../types/form.types';
import { ToastService } from './toast-service';

export class FormSubmitter {
  protected toastService: ToastService;

  constructor(toastService?: ToastService) {
    this.toastService = toastService || new ToastService();
  }

  async submitForm(formData: FormData): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Form submitted:', formData);
  }

  showSuccessMessage(): void {
    this.toastService.showFormSubmissionSuccess(
      'Message Sent!',
      "Thanks for completing the form. We'll be in touch soon!"
    );
  }
}
