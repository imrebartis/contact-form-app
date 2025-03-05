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
  // Tracking for event listeners to make cleanup more reliable
  protected boundEventHandlers: Map<
    EventTarget,
    Array<{
      type: string;
      listener: EventListener;
      signal: AbortSignal;
    }>
  > = new Map();

  constructor(formRenderer: IFormRenderer, errorHandler: IErrorHandler) {
    this.formRenderer = formRenderer;
    this.errorHandler = errorHandler;
    this.abortController = new AbortController();
  }

  getAbortController(): AbortController {
    return this.abortController;
  }

  setAbortController(controller: AbortController): void {
    this.abortController = controller;
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
    const { signal } = this.abortController;

    this.addEventListenerWithTracking(
      this.form,
      'submit',
      submitHandler,
      signal
    );

    Object.entries(this.elements).forEach(([key, element]) => {
      if (key === 'queryType') {
        this.setupRadioGroupListeners(
          element as RadioNodeList,
          key,
          validateFieldHandler,
          signal
        );
      } else {
        this.setupInputListeners(element, key, validateFieldHandler, signal);
      }
    });
  }

  setupRadioGroupListeners(
    radioNodeList: RadioNodeList,
    key: string,
    validateFieldHandler: (fieldName: keyof FormElements) => boolean,
    signal: AbortSignal
  ): void {
    Array.from(radioNodeList).forEach((radio) => {
      if (radio instanceof HTMLInputElement) {
        const boundHandler = () =>
          validateFieldHandler(key as keyof FormElements);
        this.addEventListenerWithTracking(
          radio,
          'change',
          boundHandler,
          signal
        );
      }
    });
  }

  setupInputListeners(
    element: EventTarget,
    key: string,
    validateFieldHandler: (fieldName: keyof FormElements) => boolean,
    signal: AbortSignal
  ): void {
    const boundHandler = () => validateFieldHandler(key as keyof FormElements);
    this.addEventListenerWithTracking(element, 'input', boundHandler, signal);
    this.addEventListenerWithTracking(element, 'blur', boundHandler, signal);
  }

  private addEventListenerWithTracking(
    element: EventTarget,
    type: string,
    listener: EventListener,
    signal: AbortSignal
  ): void {
    if (!this.boundEventHandlers.has(element)) {
      this.boundEventHandlers.set(element, []);
    }

    this.boundEventHandlers.get(element)?.push({
      type,
      listener,
      signal,
    });

    element.addEventListener(type, listener, { signal });
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
    this.abortController.abort();

    // Manually remove all tracked event listeners as a fallback
    this.boundEventHandlers.forEach((handlers, element) => {
      handlers.forEach(({ type, listener }) => {
        element.removeEventListener(type, listener);
      });
    });

    this.boundEventHandlers.clear();

    this.abortController = new AbortController();
  }
}
