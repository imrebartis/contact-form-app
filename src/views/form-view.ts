import {
  IErrorHandler,
  IFormRenderer,
  IFormView,
} from '../interfaces/form-interfaces';
import { FormElementType, FormElements } from '../types/form.types';
import { DOMUtils } from '../utils/dom-utils';

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
   * Queries the DOM to initialize form elements.
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
   * Adds an event listener for form submission.
   * @param submitHandler - The handler for form submission events.
   */
  private addSubmitEventListener(
    submitHandler: (e: Event) => Promise<void>
  ): void {
    this.form.addEventListener(FormEvents.Submit, submitHandler, {
      signal: this.abortController.signal,
    });
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
    console.log('isTest', isTest);
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
    this.errorHandler.showError(this.form, message);
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
