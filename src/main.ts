'use strict';

import { ErrorHandler } from './services/error-handler';
import { FormRenderer } from './services/form-renderer';
import { FormSubmitter } from './services/form-submitter';
import { FormValidator } from './services/form-validator';
import { ToastService } from './services/toast-service';
import { FormData, FormElements } from './types/form.types';
import { FormView } from './views/form-view';

import './styles/style.scss';

export class ContactForm {
  protected view: FormView;
  protected validator: FormValidator;
  protected submitter: FormSubmitter;
  protected elements!: FormElements;

  // Getter and setter for testing purposes
  get abortController(): AbortController {
    return this.view.getAbortController();
  }

  set abortController(controller: AbortController) {
    this.view.setAbortController(controller);
  }

  constructor(
    validator?: FormValidator,
    toastService?: ToastService,
    errorHandler?: ErrorHandler,
    formRenderer?: FormRenderer
  ) {
    this.validator = validator || new FormValidator();
    const toast = toastService || new ToastService();
    const error = errorHandler || new ErrorHandler();
    const renderer = formRenderer || new FormRenderer();

    this.view = new FormView(renderer, error);
    this.submitter = new FormSubmitter(toast);
  }

  init(): void {
    this.view.createForm();
    this.elements = this.view.getFormElements();

    const boundSubmitHandler = (e: Event) => this.handleSubmit(e);
    const boundValidateField = (fieldName: keyof FormElements) =>
      this.validateField(fieldName);

    this.view.setupEventListeners(boundSubmitHandler, boundValidateField);
  }

  protected validateField(fieldName: keyof FormElements): boolean {
    const element = this.elements[fieldName];
    const { isValid, errorMessage } = this.validator.validateField(
      fieldName,
      element as HTMLElement
    );

    this.view.showFieldError(fieldName, isValid ? '' : errorMessage);
    return isValid;
  }

  protected async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();

    const submitButton = this.view.getSubmitButton();
    if (submitButton.disabled) {
      return;
    }

    const isValid = this.validateAllFields();

    if (isValid) {
      await this.submitForm();
    }
  }

  protected validateAllFields(): boolean {
    let allValid = true;

    Object.keys(this.elements).forEach((key) => {
      const fieldName = key as keyof FormElements;
      const isValid = this.validateField(fieldName);

      if (!isValid) {
        allValid = false;
      }
    });

    return allValid;
  }

  protected async submitForm(): Promise<void> {
    this.view.disableSubmitButton('Sending...');

    try {
      const formData = this.collectFormData();
      await this.submitter.submitForm(formData);
      this.handleSuccessfulSubmission();
    } catch (error: unknown) {
      this.handleFailedSubmission(error);
    }
  }

  protected collectFormData(): FormData {
    return {
      firstName: this.elements.firstName.value,
      lastName: this.elements.lastName.value,
      email: this.elements.email.value,
      queryType: (this.elements.queryType as RadioNodeList).value,
      message: this.elements.message.value,
      consent: this.elements.consent.checked,
    };
  }

  protected handleSuccessfulSubmission(): void {
    this.submitter.showSuccessMessage();
    this.view.disableFormElements();
    this.view.resetForm();
    this.view.disableSubmitButton('Sent');
  }

  protected handleFailedSubmission(error?: unknown): void {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('An unknown error occurred.');
    }

    this.view.showFormError('Failed to send message. Please try again.');
    this.view.resetSubmitButton();
  }

  cleanup(): void {
    this.view.cleanup();
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
