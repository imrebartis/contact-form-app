'use strict';

import { ErrorHandler } from './services/error-handler';
import { FormRenderer } from './services/form-renderer';
import { FormValidator } from './services/form-validator';
import { ToastService } from './services/toast-service';
import { FormData, FormElements } from './types/form.types';

import './styles/style.scss';

export class ContactForm {
  private form!: HTMLFormElement;
  private elements!: FormElements;
  private submitButton!: HTMLButtonElement;
  private validator!: FormValidator;
  private toastService!: ToastService;
  private errorHandler!: ErrorHandler;

  constructor() {
    const renderer = new FormRenderer();
    this.form = renderer.renderForm();
    this.setupElements();
    this.validator = new FormValidator();
    this.toastService = new ToastService();
    this.errorHandler = new ErrorHandler();
    this.setupEventListeners();
  }

  private setupElements(): void {
    this.elements = {
      firstName: document.getElementById('first-name') as HTMLInputElement,
      lastName: document.getElementById('last-name') as HTMLInputElement,
      email: document.getElementById('email') as HTMLInputElement,
      queryType: this.form.elements.namedItem('query-type') as RadioNodeList,
      message: document.getElementById('message') as HTMLTextAreaElement,
      consent: document.getElementById('consent') as HTMLInputElement,
    };
    this.submitButton = this.form.querySelector('button') as HTMLButtonElement;
  }

  private setupEventListeners(): void {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));

    Object.entries(this.elements).forEach(([key, element]) => {
      if (key === 'queryType') {
        const radioButtons = element as RadioNodeList;
        Array.from(radioButtons).forEach((radio) => {
          if (radio instanceof HTMLInputElement) {
            radio.addEventListener('change', () =>
              this.validateField(key as keyof FormElements)
            );
          }
        });
      } else {
        element.addEventListener('input', () =>
          this.validateField(key as keyof FormElements)
        );
        element.addEventListener('blur', () =>
          this.validateField(key as keyof FormElements)
        );
      }
    });
  }

  private validateField(fieldName: keyof FormElements): boolean {
    const element = this.elements[fieldName];
    const { isValid, errorMessage } = this.validator.validateField(
      fieldName,
      element as HTMLElement
    );

    const errorContainer =
      fieldName === 'queryType'
        ? (document.querySelector('.radio-group') as HTMLElement)
        : (element as HTMLElement);

    this.errorHandler.showError(errorContainer, isValid ? '' : errorMessage);
    return isValid;
  }

  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();

    if (this.submitButton.disabled) {
      return;
    }

    const isValid = Object.keys(this.elements).every((key) =>
      this.validateField(key as keyof FormElements)
    );

    if (isValid) {
      this.submitButton.disabled = true;
      this.submitButton.textContent = 'Sending...';

      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const formData: FormData = {
          firstName: this.elements.firstName.value,
          lastName: this.elements.lastName.value,
          email: this.elements.email.value,
          queryType: (this.elements.queryType as RadioNodeList).value,
          message: this.elements.message.value,
          consent: this.elements.consent.checked,
        };

        console.log('Form submitted:', formData);

        this.toastService.showSuccess(
          "Thanks for completing the form. We'll be in touch soon!"
        );
        this.form.reset();
        this.submitButton.textContent = 'Sent';
        this.submitButton.disabled = true;
      } catch (error) {
        this.errorHandler.showError(
          this.form,
          'Failed to send message. Please try again.'
        );
        this.submitButton.disabled = false;
        this.submitButton.textContent = 'Submit';
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ContactForm();
});
