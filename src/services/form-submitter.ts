import { IFormSubmitter, IToastService } from '../interfaces/form-interfaces';
import { FormData } from '../types/form.types';

export class FormSubmitter implements IFormSubmitter {
  private toastService: IToastService;

  constructor(toastService: IToastService) {
    this.toastService = toastService;
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
