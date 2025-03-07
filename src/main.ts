'use strict';

import DOMPurify from 'dompurify';

import {
  IFormSubmitter,
  IFormValidator,
  IFormView,
} from './interfaces/form-interfaces';
import { ErrorHandler } from './services/error-handler';
import { FormRenderer } from './services/form-renderer';
import { FormSubmitter } from './services/form-submitter';
import { FormValidator } from './services/form-validator';
import { ToastService } from './services/toast-service';
import { FormData, FormElements } from './types/form.types';
import { FormView } from './views/form-view';

import './styles/style.scss';

export class ContactForm {
  protected view: IFormView;
  protected validator: IFormValidator;
  protected submitter: IFormSubmitter;
  protected elements!: FormElements;

  cleanup(): void {
    this.view.cleanup();
  }

  constructor(
    validator: IFormValidator,
    submitter: IFormSubmitter,
    view: IFormView
  ) {
    this.validator = validator;
    this.submitter = submitter;
    this.view = view;
  }

  init(): void {
    try {
      this.view.createForm();
      this.elements = this.view.getFormElements();

      const boundSubmitHandler = (e: Event) => this.handleSubmit(e);
      const boundValidateField = (fieldName: keyof FormElements) =>
        this.validateField(fieldName);

      this.view.setupEventListeners(boundSubmitHandler, boundValidateField);
    } catch (error) {
      console.error('Error in ContactForm init:', error);
      throw error; // Re-throw to make test failures more obvious
    }
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
    const abortSignal = this.view.getAbortSignal();
    if (abortSignal?.aborted) {
      console.log('Form submission aborted before starting');
      return;
    }

    this.view.disableSubmitButton('Sending...');

    try {
      const formData = this.collectFormData();
      await this.submitter.submitForm(formData, abortSignal);
      this.handleSuccessfulSubmission();
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('Form submission was aborted during processing');
        return; // Don't show error for intentional aborts
      }
      this.handleFailedSubmission(error);
    }
  }

  protected collectFormData(): FormData {
    return {
      firstName: DOMPurify.sanitize(this.elements.firstName.value),
      lastName: DOMPurify.sanitize(this.elements.lastName.value),
      email: DOMPurify.sanitize(this.elements.email.value),
      queryType: DOMPurify.sanitize(
        (this.elements.queryType as RadioNodeList).value
      ),
      message: DOMPurify.sanitize(this.elements.message.value),
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
}

interface ContactFormFactoryConfig {
  validator?: IFormValidator;
  formRenderer?: FormRenderer;
  errorHandler?: ErrorHandler;
  toastService?: ToastService;
  view?: IFormView;
  submitter?: IFormSubmitter;
  abortController?: AbortController;
}

// Factory to create fully configured ContactForm
export class ContactFormFactory {
  static create(config: ContactFormFactoryConfig = {}): ContactForm {
    const validator = config.validator || new FormValidator();
    const toastService = config.toastService || new ToastService();
    const errorHandler = config.errorHandler || new ErrorHandler();
    const formRenderer = config.formRenderer || new FormRenderer();

    const view =
      config.view ||
      new FormView(formRenderer, errorHandler, config.abortController);
    const submitter = config.submitter || new FormSubmitter(toastService);

    return new ContactForm(validator, submitter, view);
  }
}

export class ContactFormApp {
  private static instance: ContactFormApp | null = null;
  private contactForm: ContactForm | null = null;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Get the singleton instance of the ContactFormApp
   */
  public static getInstance(): ContactFormApp {
    if (!ContactFormApp.instance) {
      ContactFormApp.instance = new ContactFormApp();
    }
    return ContactFormApp.instance;
  }

  public init(): void {
    // Clean up any existing form
    this.cleanup();

    this.contactForm = ContactFormFactory.create();
    this.contactForm.init();

    // Setup cleanup on page unload
    this.setupUnloadCleanup();
  }

  public cleanup(): void {
    if (this.contactForm) {
      this.contactForm.cleanup();
      this.contactForm = null;
    }
  }

  private setupUnloadCleanup(): void {
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ContactFormApp.getInstance().init();
});

export function initContactForm(): void {
  ContactFormApp.getInstance().init();
}

export function cleanupContactForm(): void {
  ContactFormApp.getInstance().cleanup();
}
