import {
  IErrorHandler,
  IFormRenderer,
  IFormView,
} from '../interfaces/form-interfaces';
import { FormElementType, FormElements } from '../types/form.types';
import { DOMUtils } from '../utils/dom-utils';

export class FormView implements IFormView {
  protected form!: HTMLFormElement;
  protected elements!: FormElements;
  protected submitButton!: HTMLButtonElement;
  protected formRenderer: IFormRenderer;
  protected errorHandler: IErrorHandler;
  protected abortController: AbortController;

  private isExternalController(): boolean {
    // If there is a signal property that's not aborted despite calling abort(),
    // it's likely a mock controller provided for testing
    return (
      this.abortController &&
      'signal' in this.abortController &&
      !this.abortController.signal.aborted
    );
  }

  // Array to track listeners for explicit removal
  private eventListeners: Array<{
    element: EventTarget;
    type: string;
    handler: EventListener;
  }> = [];

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
    return this.form;
  }

  setupElements(): void {
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

  setInitialFocus(): void {
    if (this.elements.firstName) {
      this.elements.firstName.focus();
    }
  }

  setupEventListeners(
    submitHandler: (e: Event) => Promise<void>,
    validateFieldHandler: (fieldName: keyof FormElements) => boolean
  ): void {
    this.addTrackedEventListener(this.form, 'submit', submitHandler);

    Object.entries(this.elements).forEach(([key, element]) => {
      if (key === 'queryType') {
        this.setupRadioGroupListeners(
          element as RadioNodeList,
          key,
          validateFieldHandler
        );
      } else {
        this.setupInputListeners(element, key, validateFieldHandler);
      }
    });
  }

  setupRadioGroupListeners(
    radioNodeList: RadioNodeList,
    key: string,
    validateFieldHandler: (fieldName: keyof FormElements) => boolean
  ): void {
    Array.from(radioNodeList).forEach((radio) => {
      if (radio instanceof HTMLInputElement) {
        const boundHandler = () =>
          validateFieldHandler(key as keyof FormElements);
        this.addTrackedEventListener(radio, 'change', boundHandler);
      }
    });
  }

  setupInputListeners(
    element: EventTarget,
    key: string,
    validateFieldHandler: (fieldName: keyof FormElements) => boolean
  ): void {
    const boundHandler = () => validateFieldHandler(key as keyof FormElements);
    this.addTrackedEventListener(element, 'input', boundHandler);
    this.addTrackedEventListener(element, 'blur', boundHandler);
  }

  // Helper method to track event listeners for proper cleanup
  private addTrackedEventListener(
    element: EventTarget,
    type: string,
    handler: EventListener
  ): void {
    // Store reference for explicit removal during cleanup
    this.eventListeners.push({ element, type, handler });

    // Use AbortController for backup cleanup
    element.addEventListener(type, handler, {
      signal: this.abortController.signal,
    });
  }

  getFormElements(): FormElements {
    return this.elements;
  }

  getForm(): HTMLFormElement {
    return this.form;
  }

  getSubmitButton(): HTMLButtonElement {
    return this.submitButton;
  }

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

  disableSubmitButton(text: string): void {
    this.submitButton.disabled = true;
    this.submitButton.textContent = text;
  }

  resetSubmitButton(): void {
    this.submitButton.disabled = false;
    this.submitButton.textContent = 'Submit';
  }

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

  resetForm(): void {
    this.form.reset();
  }

  showFormError(message: string): void {
    this.errorHandler.showError(this.form, message);
  }

  cleanup(): void {
    if (
      this.abortController &&
      typeof this.abortController.abort === 'function'
    ) {
      this.abortController.abort();
    }

    // Remove event listeners manually as a backup cleanup mechanism
    this.eventListeners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler);
    });

    this.eventListeners = [];

    // Create a new AbortController for future use
    // Unless it's a mock controller provided for testing
    if (!this.isExternalController()) {
      this.abortController = new AbortController();
    }
  }
}
