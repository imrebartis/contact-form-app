'use strict';

import * as yup from 'yup';

import { formSubmissionSchema } from '../../../shared';
import {
  IErrorHandler,
  IFormRenderer,
  IFormView,
} from '../interfaces/form-interfaces';
import { FormElementType, FormElements } from '../types/form.types';
import { DOMUtils } from '../utils/dom-utils';
import ValidatedInput from '../utils/validated-input';

const FormEvents = {
  Input: 'input',
  Blur: 'blur',
  Change: 'change',
  Submit: 'submit',
};

const FormElementIds = {
  FirstName: 'first-name',
  LastName: 'last-name',
  Email: 'email',
  Message: 'message',
  Consent: 'consent',
};

const FormElementNames = {
  QueryType: 'query-type',
};

const ButtonLabels = {
  Submit: 'Submit',
};

export class FormView implements IFormView {
  protected form!: HTMLFormElement;
  protected elements!: FormElements;
  protected submitButton!: HTMLButtonElement;
  protected formRenderer: IFormRenderer;
  protected errorHandler: IErrorHandler;
  protected abortController: AbortController;
  private currentFormElements: Set<HTMLElement> = new Set();
  private isActive: boolean = false;
  private elementToFieldNameMap = new Map<HTMLElement, string>();

  private isExternalController(): boolean {
    // If the signal exists and isn't aborted
    // despite calling abort(), it's likely a mock controller provided for testing
    return this.abortController?.signal && !this.abortController.signal.aborted;
  }

  constructor(
    formRenderer: IFormRenderer,
    errorHandler: IErrorHandler,
    abortController?: AbortController
  ) {
    this.formRenderer = formRenderer;
    this.errorHandler = errorHandler;
    this.abortController = abortController || new AbortController();
  }

  createForm(): HTMLFormElement {
    this.form = this.formRenderer.renderForm();
    this.setupElements();
    this.setInitialFocus();
    this.isActive = true;
    return this.form;
  }

  /**
   * Initializes form elements by querying the DOM and storing references.
   */
  setupElements(): void {
    this.initializeFormElements();
    this.initializeSubmitButton();
    this.trackCurrentFormElements();
    this.buildElementFieldNameMap();
  }

  /**
   * Queries the DOM to initialize form elements and sets up validation.
   */
  private initializeFormElements(): void {
    this.elements = {
      firstName: DOMUtils.getElementById(
        FormElementIds.FirstName
      ) as HTMLInputElement,
      lastName: DOMUtils.getElementById(
        FormElementIds.LastName
      ) as HTMLInputElement,
      email: DOMUtils.getElementById(FormElementIds.Email) as HTMLInputElement,
      queryType: DOMUtils.getElementByName(
        this.form,
        FormElementNames.QueryType
      ) as RadioNodeList,
      message: DOMUtils.getElementById(
        FormElementIds.Message
      ) as HTMLTextAreaElement,
      consent: DOMUtils.getElementById(
        FormElementIds.Consent
      ) as HTMLInputElement,
    };

    // Set up validation for each input field
    new ValidatedInput(
      this.elements.firstName,
      formSubmissionSchema,
      'firstName'
    );
    new ValidatedInput(
      this.elements.lastName,
      formSubmissionSchema,
      'lastName'
    );
    new ValidatedInput(this.elements.email, formSubmissionSchema, 'email');
    new ValidatedInput(this.elements.message, formSubmissionSchema, 'message');
  }

  /**
   * Initializes the submit button by querying the DOM.
   */
  private initializeSubmitButton(): void {
    this.submitButton = this.form.querySelector('button') as HTMLButtonElement;
  }

  /**
   * Helper method to store references to all current form elements.
   */
  private trackCurrentFormElements(): void {
    this.currentFormElements.clear();

    Object.values(this.elements).forEach((element) => {
      if (element instanceof HTMLElement) {
        this.currentFormElements.add(element);
      } else if (element instanceof RadioNodeList) {
        Array.from(element).forEach((radio) => {
          if (radio instanceof HTMLElement) {
            this.currentFormElements.add(radio);
          }
        });
      }
    });
  }

  /**
   * Builds a map of form elements to their field names.
   */
  private buildElementFieldNameMap(): void {
    this.elementToFieldNameMap.clear();

    Object.entries(this.elements).forEach(([fieldName, element]) => {
      if (element instanceof HTMLElement) {
        this.elementToFieldNameMap.set(element, fieldName);
      } else if (element instanceof RadioNodeList) {
        // For RadioNodeList, map each radio button to the field name
        Array.from(element).forEach((radio) => {
          if (radio instanceof HTMLElement) {
            this.elementToFieldNameMap.set(radio, fieldName);
          }
        });
      }
    });
  }

  /**
   * Sets the initial focus to the first name input field.
   */
  setInitialFocus(): void {
    if (this.elements.firstName) {
      this.elements.firstName.focus();
    }
  }

  /**
   * Sets up event listeners for form events.
   * @param submitHandler - The handler for form submission events.
   * @param validateFieldHandler - The handler for field validation events.
   */
  setupEventListeners(
    submitHandler: (e: Event) => Promise<void>,
    validateFieldHandler: (fieldName: keyof FormElements) => boolean
  ): void {
    this.addSubmitEventListener(submitHandler);
    this.setupEventDelegation(validateFieldHandler);
    this.setupDirectEventListeners(validateFieldHandler);
  }

  /**
   * Updates the visual state of a form field based on validation results.
   * @param fieldName - The name of the field.
   * @param isValid - Whether the field is valid.
   * @param errorMessage - The error message to display if invalid.
   */
  updateFieldVisualState(
    fieldName: keyof FormElements,
    isValid: boolean,
    errorMessage: string
  ): void {
    const element = this.elements[fieldName];
    if (element instanceof HTMLElement) {
      const errorContainer = DOMUtils.getErrorContainer(fieldName, element);

      if (isValid) {
        element.classList.remove('error');
        element.classList.add('success');
        if (errorContainer) errorContainer.textContent = '';
      } else {
        element.classList.remove('success');
        element.classList.add('error');
        if (errorContainer) errorContainer.textContent = errorMessage;
      }
    }
  }

  /**
   * Validates the form data and updates the visual state of each field.
   * @returns An object containing validation errors or null if valid.
   */
  validateFormDataWithVisualFeedback(): Record<string, string> | null {
    const formData = {
      firstName: this.elements.firstName.value,
      lastName: this.elements.lastName.value,
      email: this.elements.email.value,
      message: this.elements.message.value,
      queryType: this.elements.queryType.value,
      consent: this.elements.consent.checked,
    };

    try {
      formSubmissionSchema.validateSync(formData, { abortEarly: false });

      // Update all fields to success state
      Object.keys(this.elements).forEach((field) => {
        this.updateFieldVisualState(field as keyof FormElements, true, '');
      });

      return null; // No validation errors
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors = error.inner.reduce((acc, err) => {
          if (err.path) {
            acc[err.path] = err.message;
            this.updateFieldVisualState(
              err.path as keyof FormElements,
              false,
              err.message
            );
          }
          return acc;
        }, {} as Record<string, string>);

        return errors;
      }
      throw error; // Re-throw unexpected errors
    }
  }

  /**
   * Validates the form data using the shared schema.
   * @returns An object containing validation errors or null if valid.
   */
  validateFormData(): Record<string, string> | null {
    const formData = {
      firstName: this.elements.firstName.value,
      lastName: this.elements.lastName.value,
      email: this.elements.email.value,
      message: this.elements.message.value,
      queryType: this.elements.queryType.value,
      consent: this.elements.consent.checked,
    };

    try {
      formSubmissionSchema.validateSync(formData, { abortEarly: false });
      return null; // No validation errors
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationError = error as yup.ValidationError;
        return validationError.inner.reduce((acc, err) => {
          if (err.path) acc[err.path] = err.message;
          return acc;
        }, {} as Record<string, string>);
      }
      throw error; // Re-throw unexpected errors
    }
  }

  /**
   * Adds an event listener for form submission.
   * @param submitHandler - The handler for form submission events.
   */
  private addSubmitEventListener(
    submitHandler: (e: Event) => Promise<void>
  ): void {
    this.form.addEventListener(
      FormEvents.Submit,
      async (e) => {
        e.preventDefault();
        const errors = this.validateFormData();
        if (errors) {
          Object.entries(errors).forEach(([field, message]) => {
            this.showFieldError(field as keyof FormElements, message);
          });
          return;
        }
        await submitHandler(e);
      },
      {
        signal: this.abortController.signal,
      }
    );
  }

  /**
   * Creates a debounced event handler with consistent configuration.
   * @param handler The handler function to debounce
   * @returns A debounced version of the handler
   */
  private createDebouncedHandler<T extends (...args: any[]) => any>(
    handler: T
  ): (...args: Parameters<T>) => void {
    // Only set immediate to true if we're in a test environment
    const isTest =
      typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
    return DOMUtils.debounce(handler, 300, { immediate: isTest });
  }

  /**
   * Sets up event delegation for form events.
   * @param validateFieldHandler - The handler for field validation events.
   */
  private setupEventDelegation(
    validateFieldHandler: (fieldName: keyof FormElements) => boolean
  ): void {
    const debouncedInputHandler = this.createDebouncedHandler((event: Event) =>
      this.handleDelegatedEvent(event, validateFieldHandler)
    );

    this.form.addEventListener(FormEvents.Input, debouncedInputHandler, {
      signal: this.abortController.signal,
    });

    this.form.addEventListener(
      FormEvents.Blur,
      (event) => this.handleDelegatedEvent(event, validateFieldHandler),
      { signal: this.abortController.signal, capture: true }
    );

    this.form.addEventListener(
      FormEvents.Change,
      (event) => this.handleDelegatedEvent(event, validateFieldHandler),
      { signal: this.abortController.signal }
    );
  }

  /**
   * Sets up direct event listeners for form elements.
   * @param validateFieldHandler - The handler for field validation events.
   */
  private setupDirectEventListeners(
    validateFieldHandler: (fieldName: keyof FormElements) => boolean
  ): void {
    Object.entries(this.elements).forEach(([fieldName, element]) => {
      if (fieldName === 'queryType' && element instanceof RadioNodeList) {
        Array.from(element).forEach((radio) => {
          if (radio instanceof HTMLInputElement) {
            radio.addEventListener(
              FormEvents.Change,
              () => {
                if (this.isActive) {
                  validateFieldHandler(fieldName as keyof FormElements);
                }
              },
              { signal: this.abortController.signal }
            );
          }
        });
      } else if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement
      ) {
        const debouncedInputHandler = this.createDebouncedHandler(() => {
          if (this.isActive) {
            validateFieldHandler(fieldName as keyof FormElements);
          }
        });

        element.addEventListener(FormEvents.Input, debouncedInputHandler, {
          signal: this.abortController.signal,
        });

        element.addEventListener(
          FormEvents.Blur,
          () => {
            if (this.isActive) {
              validateFieldHandler(fieldName as keyof FormElements);
            }
          },
          { signal: this.abortController.signal }
        );
      }
    });
  }

  /**
   * Handles delegated events for form elements.
   * @param event - The event object.
   * @param validateFieldHandler - The handler for field validation events.
   */
  private handleDelegatedEvent(
    event: Event,
    validateFieldHandler: (fieldName: keyof FormElements) => boolean
  ): void {
    if (!this.isActive) return;

    const target = event.target as HTMLElement;
    if (
      !target ||
      !(
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) ||
      // Ensure the element belongs to the current form
      !this.currentFormElements.has(target)
    ) {
      return;
    }

    const fieldName = this.getFieldNameFromElement(target);
    if (fieldName) {
      validateFieldHandler(fieldName as keyof FormElements);
    }
  }

  /**
   * Gets the field name from an element.
   * @param element - The element to get the field name for.
   * @returns The field name or null if not found.
   */
  private getFieldNameFromElement(element: HTMLElement): string | null {
    return this.elementToFieldNameMap.get(element) || null;
  }

  /**
   * Gets the form elements.
   * @returns The form elements.
   */
  getFormElements(): FormElements {
    return this.elements;
  }

  /**
   * Gets the form element.
   * @returns The form element.
   */
  getForm(): HTMLFormElement {
    return this.form;
  }

  /**
   * Gets the submit button.
   * @returns The submit button.
   */
  getSubmitButton(): HTMLButtonElement {
    return this.submitButton;
  }

  /**
   * Gets the abort signal.
   * @returns The abort signal.
   */
  getAbortSignal(): AbortSignal {
    return this.abortController.signal;
  }

  /**
   * Shows a field error.
   * @param fieldName - The name of the field.
   * @param errorMessage - The error message to display.
   */
  showFieldError(fieldName: keyof FormElements, errorMessage: string): void {
    const element = this.elements[fieldName];
    const errorContainer = DOMUtils.getErrorContainer(
      fieldName,
      element as HTMLElement | null
    );

    if (errorContainer) {
      this.errorHandler.showError(errorContainer, errorMessage);
    }
  }

  /**
   * Disables the submit button and sets its text.
   * @param text - The text to set on the submit button.
   */
  disableSubmitButton(text: string): void {
    this.submitButton.disabled = true;
    this.submitButton.textContent = text;
  }

  /**
   * Resets the submit button to its default state.
   */
  resetSubmitButton(): void {
    this.submitButton.disabled = false;
    this.submitButton.textContent = ButtonLabels.Submit;
  }

  /**
   * Disables all form elements.
   */
  disableFormElements(): void {
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

  /**
   * Resets the form to its default state.
   */
  resetForm(): void {
    this.form.reset();
  }

  /**
   * Shows a form error.
   * @param message - The error message to display.
   */
  showFormError(message: string): void {
    // Create or get the form error element
    let errorElement = document.querySelector('.form-error');

    if (!errorElement) {
      // Create the error element if it doesn't exist
      errorElement = document.createElement('div');
      errorElement.className = 'form-error';

      // Get the first form group (which contains the first name field)
      const firstFormGroup = document.querySelector('.form-group');

      if (firstFormGroup) {
        // Insert the error message before the first form group
        firstFormGroup.parentNode?.insertBefore(errorElement, firstFormGroup);
      } else {
        // Fallback: add to the beginning of the form
        this.form.prepend(errorElement);
      }
    }

    // Update the error message
    errorElement.textContent = message;

    // Make the error visible
    errorElement.classList.add('error-visible');

    // Clear the error after 5 seconds
    setTimeout(() => {
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('error-visible');
      }
    }, 5000);
  }

  /**
   * Cleans up the form view.
   */
  cleanup(): void {
    this.isActive = false;

    this.currentFormElements.clear();
    this.elementToFieldNameMap.clear();

    if (
      this.abortController &&
      typeof this.abortController.abort === 'function'
    ) {
      this.abortController.abort();
    }

    // Create a new AbortController for future use
    // Unless it's a mock controller provided for testing
    if (!this.isExternalController()) {
      this.abortController = new AbortController();
    }
  }
}
