'use strict';

import { ErrorHandler } from './services/error-handler';
import { FormRenderer } from './services/form-renderer';
import { FormValidator } from './services/form-validator';
import { ToastService } from './services/toast-service';
import { FormData, FormElementType, FormElements } from './types/form.types';
import { DOMUtils } from './utils/dom-utils';

import './styles/style.scss';

export class ContactForm {
  protected form!: HTMLFormElement;
  protected elements!: FormElements;
  protected submitButton!: HTMLButtonElement;
  protected validator: FormValidator;
  protected toastService: ToastService;
  protected errorHandler: ErrorHandler;
  protected formRenderer: FormRenderer;
  protected abortController: AbortController;

  constructor(
    validator?: FormValidator,
    toastService?: ToastService,
    errorHandler?: ErrorHandler,
    formRenderer?: FormRenderer
  ) {
    this.validator = validator || new FormValidator();
    this.toastService = toastService || new ToastService();
    this.errorHandler = errorHandler || new ErrorHandler();
    this.formRenderer = formRenderer || new FormRenderer();
    this.abortController = new AbortController();
  }

  init(): void {
    this.form = this.createForm();
    this.setupElements();
    this.setupEventListeners();
    this.onAfterInit();
  }

  protected createForm(): HTMLFormElement {
    return this.formRenderer.renderForm();
  }

  protected setupElements(): void {
    this.elements = {
      firstName: DOMUtils.getElementById('first-name') as HTMLInputElement,
      lastName: DOMUtils.getElementById('last-name') as HTMLInputElement,
      email: DOMUtils.getElementById('email') as HTMLInputElement,
      queryType: DOMUtils.getElementByName(
        this.form,
        'query-type'
      ) as RadioNodeList,
      message: DOMUtils.getElementById('message') as HTMLTextAreaElement,
      consent: DOMUtils.getElementById('consent') as HTMLInputElement,
    };
    this.submitButton = this.form.querySelector('button') as HTMLButtonElement;
  }

  protected setupEventListeners(): void {
    const { signal } = this.abortController;

    const boundSubmitHandler = (e: Event) => this.handleSubmit(e);

    DOMUtils.addEventListener(this.form, 'submit', boundSubmitHandler, signal);

    Object.entries(this.elements).forEach(([key, element]) => {
      if (key === 'queryType') {
        this.setupRadioGroupListeners(element as RadioNodeList, key, signal);
      } else {
        this.setupInputListeners(element, key, signal);
      }
    });
  }

  protected setupRadioGroupListeners(
    radioNodeList: RadioNodeList,
    key: string,
    signal: AbortSignal
  ): void {
    Array.from(radioNodeList).forEach((radio) => {
      if (radio instanceof HTMLInputElement) {
        DOMUtils.addEventListener(
          radio,
          'change',
          this.validateField.bind(this, key as keyof FormElements),
          signal
        );
      }
    });
  }

  protected setupInputListeners(
    element: EventTarget,
    key: string,
    signal: AbortSignal
  ): void {
    DOMUtils.addEventListener(
      element,
      'input',
      this.validateField.bind(this, key as keyof FormElements),
      signal
    );
    DOMUtils.addEventListener(
      element,
      'blur',
      this.validateField.bind(this, key as keyof FormElements),
      signal
    );
  }

  protected onAfterInit(): void {
    this.setInitialFocus();
  }

  protected setInitialFocus(): void {
    if (this.elements.firstName) {
      this.elements.firstName.focus();
    }
  }

  protected validateField(fieldName: keyof FormElements): boolean {
    const element = this.elements[fieldName];
    const { isValid, errorMessage } = this.validator.validateField(
      fieldName,
      element as HTMLElement
    );

    const errorContainer = DOMUtils.getErrorContainer(
      fieldName,
      element as HTMLElement | null
    );

    if (errorContainer) {
      this.errorHandler.showError(errorContainer, isValid ? '' : errorMessage);
    }
    return isValid;
  }

  protected async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();

    if (this.submitButton.disabled) {
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
    this.disableSubmitButton('Sending...');

    try {
      await this.performSubmission();
      this.handleSuccessfulSubmission();
    } catch (error: unknown) {
      this.handleFailedSubmission(error);
    }
  }

  protected async performSubmission(): Promise<void> {
    // Default implementation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const formData = this.collectFormData();
    console.log('Form submitted:', formData);
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

  protected disableSubmitButton(text: string): void {
    this.submitButton.disabled = true;
    this.submitButton.textContent = text;
  }

  protected disableFormElements(): void {
    Object.values(this.elements).forEach((element: FormElementType) => {
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement
      ) {
        DOMUtils.disableElement(element, true);
      } else if (element instanceof RadioNodeList) {
        DOMUtils.disableRadioGroup(element, true);
      }
    });
  }

  protected handleSuccessfulSubmission(): void {
    this.toastService.showFormSubmissionSuccess(
      'Message Sent!',
      "Thanks for completing the form. We'll be in touch soon!"
    );

    this.disableFormElements();
    this.form.reset();
    this.submitButton.textContent = 'Sent';
    this.submitButton.disabled = true;
  }

  protected handleFailedSubmission(error?: unknown): void {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('An unknown error occurred.');
    }

    this.errorHandler.showError(
      this.form,
      'Failed to send message. Please try again.'
    );
    this.submitButton.disabled = false;
    this.submitButton.textContent = 'Submit';
  }

  cleanup(): void {
    this.abortController.abort();
    // Create a new controller in case the form is reinitialized
    this.abortController = new AbortController();
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
