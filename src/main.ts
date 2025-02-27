'use strict';

import { ErrorHandler } from './services/error-handler';
import { FormRenderer } from './services/form-renderer';
import { FormValidator } from './services/form-validator';
import { ToastService } from './services/toast-service';
import { FormData, FormElementType, FormElements } from './types/form.types';
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
  private eventHandlers: Record<string, EventListenerOrEventListenerObject> =
    {};

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
    this.eventHandlers['form-submit'] = this.handleSubmit.bind(this);
    DOMUtils.addEventListener(
      this.form,
      'submit',
      this.eventHandlers['form-submit']
    );

    Object.entries(this.elements).forEach(([key, element]) => {
      if (key === 'queryType') {
        const radioButtons = element as RadioNodeList;
        Array.from(radioButtons).forEach((radio, index) => {
          if (radio instanceof HTMLInputElement) {
            const handlerKey = `${key}-change-${index}`;
            this.eventHandlers[handlerKey] = this.validateField.bind(
              this,
              key as keyof FormElements
            );
            DOMUtils.addEventListener(
              radio,
              'change',
              this.eventHandlers[handlerKey]
            );
          }
        });
      } else {
        const inputKey = `${key}-input`;
        const blurKey = `${key}-blur`;

        this.eventHandlers[inputKey] = this.validateField.bind(
          this,
          key as keyof FormElements
        );
        this.eventHandlers[blurKey] = this.validateField.bind(
          this,
          key as keyof FormElements
        );

        DOMUtils.addEventListener(
          element,
          'input',
          this.eventHandlers[inputKey]
        );
        DOMUtils.addEventListener(element, 'blur', this.eventHandlers[blurKey]);
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error('An unknown error occurred.');
      }
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

  private disableFormElements(): void {
    Object.values(this.elements).forEach((element: FormElementType) => {
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement
      ) {
        element.disabled = true;
      } else if (element instanceof RadioNodeList) {
        Array.from(element).forEach((radio) => {
          if (radio instanceof HTMLInputElement) {
            radio.disabled = true;
          }
        });
      }
    });
  }

  private handleSuccessfulSubmission(): void {
    this.toastService.showSuccess(`
      <div class="toast-success-wrapper">
        <strong>Message Sent!</strong>
        <div class="toast-success-content">
          Thanks for completing the form. We'll be in touch soon!
        </div>
    </div>
    `);
    this.disableFormElements();
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
      this.eventHandlers['form-submit']
    );

    Object.entries(this.elements).forEach(
      ([key, element]: [string, FormElementType]) => {
        if (key === 'queryType') {
          const radioButtons = element as RadioNodeList;
          Array.from(radioButtons).forEach((radio, index) => {
            if (radio instanceof HTMLInputElement) {
              const handlerKey = `${key}-change-${index}`;
              DOMUtils.removeEventListener(
                radio,
                'change',
                this.eventHandlers[handlerKey]
              );
            }
          });
        } else {
          const inputKey = `${key}-input`;
          const blurKey = `${key}-blur`;

          DOMUtils.removeEventListener(
            element as HTMLElement,
            'input',
            this.eventHandlers[inputKey]
          );
          DOMUtils.removeEventListener(
            element as HTMLElement,
            'blur',
            this.eventHandlers[blurKey]
          );
        }
      }
    );
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
