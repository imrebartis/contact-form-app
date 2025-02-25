'use strict';

import { ErrorHandler } from './services/error-handler';
import { FormRenderer } from './services/form-renderer';
import { FormValidator } from './services/form-validator';
import { ToastService } from './services/toast-service';
import { FormData, FormElements } from './types/form.types';
import { DOMUtils } from './utils/dom-utils';

import './styles/style.scss';

export class ContactForm {
  private form!: HTMLFormElement;
  private elements!: FormElements;
  private submitButton!: HTMLButtonElement;
  private validator: FormValidator;
  private toastService: ToastService;
  private errorHandler: ErrorHandler;
  private formRenderer: FormRenderer;

  constructor() {
    this.validator = new FormValidator();
    this.toastService = new ToastService();
    this.errorHandler = new ErrorHandler();
    this.formRenderer = new FormRenderer();
  }

  init(): void {
    this.form = this.formRenderer.renderForm();
    this.setupElements();
    this.setupEventListeners();
    this.setInitialFocus();
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
    DOMUtils.addEventListener(
      this.form,
      'submit',
      this.handleSubmit.bind(this)
    );

    Object.entries(this.elements).forEach(([key, element]) => {
      if (key === 'queryType') {
        const radioButtons = element as RadioNodeList;
        Array.from(radioButtons).forEach((radio) => {
          if (radio instanceof HTMLInputElement) {
            DOMUtils.addEventListener(radio, 'change', () =>
              this.validateField(key as keyof FormElements)
            );
          }
        });
      } else {
        DOMUtils.addEventListener(element, 'input', () =>
          this.validateField(key as keyof FormElements)
        );
        DOMUtils.addEventListener(element, 'blur', () =>
          this.validateField(key as keyof FormElements)
        );
      }
    });
  }

  private setInitialFocus(): void {
    if (this.elements.firstName) {
      this.elements.firstName.focus();
    }
  }

  private validateField(fieldName: keyof FormElements): boolean {
    const element = this.elements[fieldName];
    const { isValid, errorMessage } = this.validator.validateField(
      fieldName,
      element as HTMLElement
    );

    let errorContainer: HTMLElement;

    if (fieldName === 'queryType') {
      errorContainer = document.querySelector('.radio-group') as HTMLElement;
    } else if (fieldName === 'consent') {
      errorContainer = document.querySelector(
        '.checkbox-container'
      ) as HTMLElement;
    } else {
      errorContainer = element as HTMLElement;
    }

    this.errorHandler.showError(errorContainer, isValid ? '' : errorMessage);
    return isValid;
  }

  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();

    if (this.submitButton.disabled) {
      return;
    }

    const isValid = this.validateAllFields();

    if (isValid) {
      await this.submitForm();
    }
  }

  private validateAllFields(): boolean {
    return Object.keys(this.elements).every((key) =>
      this.validateField(key as keyof FormElements)
    );
  }

  private async submitForm(): Promise<void> {
    this.disableSubmitButton('Sending...');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const formData: FormData = this.collectFormData();
      console.log('Form submitted:', formData);

      this.handleSuccessfulSubmission();
    } catch (error) {
      this.handleFailedSubmission();
    }
  }

  private collectFormData(): FormData {
    return {
      firstName: this.elements.firstName.value,
      lastName: this.elements.lastName.value,
      email: this.elements.email.value,
      queryType: (this.elements.queryType as RadioNodeList).value,
      message: this.elements.message.value,
      consent: this.elements.consent.checked,
    };
  }

  private disableSubmitButton(text: string): void {
    this.submitButton.disabled = true;
    this.submitButton.textContent = text;
  }

  private handleSuccessfulSubmission(): void {
    this.toastService.showSuccess(
      "Thanks for completing the form. We'll be in touch soon!"
    );
    this.form.reset();
    this.submitButton.textContent = 'Sent';
    this.submitButton.disabled = true;
  }

  private handleFailedSubmission(): void {
    this.errorHandler.showError(
      this.form,
      'Failed to send message. Please try again.'
    );
    this.submitButton.disabled = false;
    this.submitButton.textContent = 'Submit';
  }

  cleanup(): void {
    DOMUtils.removeEventListener(
      this.form,
      'submit',
      this.handleSubmit.bind(this)
    );

    Object.entries(this.elements).forEach(([key, element]) => {
      if (key === 'queryType') {
        const radioButtons = element as RadioNodeList;
        Array.from(radioButtons).forEach((radio) => {
          if (radio instanceof HTMLInputElement) {
            DOMUtils.removeEventListener(radio, 'change', () =>
              this.validateField(key as keyof FormElements)
            );
          }
        });
      } else {
        DOMUtils.removeEventListener(element, 'input', () =>
          this.validateField(key as keyof FormElements)
        );
        DOMUtils.removeEventListener(element, 'blur', () =>
          this.validateField(key as keyof FormElements)
        );
      }
    });
  }
}

let contactForm: ContactForm;

document.addEventListener('DOMContentLoaded', () => {
  contactForm = new ContactForm();
  contactForm.init();
});

window.addEventListener('beforeunload', () => {
  if (contactForm) {
    contactForm.cleanup();
  }
});
