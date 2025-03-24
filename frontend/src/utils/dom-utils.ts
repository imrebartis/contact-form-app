'use strict';

interface ElementRetrievalOptions {
  throwIfNotFound?: boolean;
  errorMessage?: string;
}

export class DOMUtils {
  static getElement<T extends HTMLElement>(
    selector: string | { id: string } | { form: HTMLFormElement; name: string },
    options: ElementRetrievalOptions = { throwIfNotFound: true }
  ): T | null {
    let element: T | null = null;
    let errorDetails = '';

    if (typeof selector === 'string') {
      // CSS selector strategy
      element = document.querySelector<T>(selector);
      errorDetails = `Element not found: ${selector}`;
    } else if ('id' in selector) {
      // ID strategy
      element = document.getElementById(selector.id) as T | null;
      errorDetails = `Element not found with ID: ${selector.id}`;
    } else if ('form' in selector && 'name' in selector) {
      // Form element by name strategy
      const namedItem = selector.form.elements.namedItem(selector.name);
      element = namedItem as T | null;
      errorDetails = `Element not found with name: ${selector.name} in form`;
    }

    if (!element && options.throwIfNotFound) {
      throw new Error(options.errorMessage || errorDetails);
    }

    return element;
  }
  static getElements<T extends HTMLElement>(
    selector: string,
    options: ElementRetrievalOptions = { throwIfNotFound: false }
  ): T[] {
    const elements = Array.from(document.querySelectorAll<T>(selector));

    if (elements.length === 0 && options.throwIfNotFound) {
      throw new Error(options.errorMessage || `No elements found: ${selector}`);
    }

    return elements;
  }

  static getElementById<T extends HTMLElement>(
    id: string,
    options: ElementRetrievalOptions = { throwIfNotFound: false }
  ): T | null {
    return this.getElement<T>({ id }, options);
  }

  static getElementByName<T extends Element | RadioNodeList>(
    form: HTMLFormElement,
    name: string,
    options: ElementRetrievalOptions = { throwIfNotFound: false }
  ): T | null {
    return this.getElement<HTMLElement>({ form, name }, options) as T | null;
  }

  static getErrorContainer(
    fieldName: string,
    element: HTMLElement | null
  ): HTMLElement | null {
    if (fieldName === 'queryType') {
      return document.querySelector('.radio-group') as HTMLElement;
    } else {
      return element;
    }
  }

  static addEventListener(
    element: EventTarget,
    eventType: string,
    handler: EventListenerOrEventListenerObject,
    signal?: AbortSignal
  ): void {
    element.addEventListener(eventType, handler, { signal });
  }

  static removeEventListener(
    element: EventTarget,
    eventType: string,
    handler: EventListenerOrEventListenerObject
  ): void {
    element.removeEventListener(eventType, handler);
  }

  static showError(element: HTMLElement, message: string): void {
    this.setAriaInvalid(element, !!message);

    const errorElement = this.findErrorElement(element);
    if (errorElement) {
      this.updateErrorElement(errorElement, message);
    }
  }

  private static setAriaInvalid(
    element: HTMLElement,
    isInvalid: boolean
  ): void {
    const value = isInvalid ? 'true' : 'false';

    if (
      element.classList.contains('radio-group') ||
      element.classList.contains('checkbox-container')
    ) {
      const inputs = element.querySelectorAll('input');
      inputs.forEach((input) => input.setAttribute('aria-invalid', value));
    } else {
      element.setAttribute('aria-invalid', value);
    }
  }

  private static findErrorElement(element: HTMLElement): HTMLElement | null {
    const describedById = element.getAttribute('aria-describedby');
    if (describedById) {
      return this.getElementById(describedById);
    }

    // Fallback for legacy code: find error element by proximity and class
    // First check the element's container for radio/checkbox groups
    if (
      element.classList.contains('radio-group') ||
      element.classList.contains('checkbox-container')
    ) {
      const errorElement = element.querySelector(
        '.error-message'
      ) as HTMLElement;
      if (errorElement) return errorElement;
    }

    // Then look for siblings or within parent
    const container = element.closest('.form-field') || element.parentElement;
    if (container) {
      return (container.querySelector('.error-message') as HTMLElement) || null;
    }

    return null;
  }

  static setElementVisibility(
    element: HTMLElement,
    isVisible: boolean,
    displayValue = 'block',
    useVisibilityClasses = false,
    visibleClassName = 'visible',
    hiddenClassName = 'hidden'
  ): void {
    element.style.display = isVisible ? displayValue : 'none';

    element.setAttribute('aria-hidden', isVisible ? 'false' : 'true');

    if (useVisibilityClasses) {
      if (isVisible) {
        element.classList.add(visibleClassName);
        element.classList.remove(hiddenClassName);
      } else {
        element.classList.remove(visibleClassName);
        element.classList.add(hiddenClassName);
      }
    }
  }

  static disableElement(
    element: HTMLElement,
    isDisabled: boolean = true
  ): void {
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement ||
      element instanceof HTMLButtonElement
    ) {
      element.disabled = isDisabled;
    }
  }

  static disableRadioGroup(
    radioNodeList: RadioNodeList,
    isDisabled: boolean = true
  ): void {
    Array.from(radioNodeList).forEach((radio) => {
      if (radio instanceof HTMLInputElement) {
        radio.disabled = isDisabled;

        const radioOption = radio.closest('.radio-option');
        if (radioOption) {
          if (isDisabled) {
            radioOption.classList.add('disabled');
          } else {
            radioOption.classList.remove('disabled');
          }
        }
      }
    });

    const radioGroup = document.querySelector('.radio-group');
    if (radioGroup) {
      if (isDisabled) {
        radioGroup.classList.add('disabled');
      } else {
        radioGroup.classList.remove('disabled');
      }
    }
  }

  private static updateErrorElement(
    errorElement: HTMLElement,
    message: string
  ): void {
    errorElement.textContent = message;

    errorElement.style.display = message ? 'block' : 'none';

    errorElement.setAttribute('aria-hidden', message ? 'false' : 'true');

    if (message) {
      errorElement.classList.add('error-visible');
      errorElement.classList.remove('error-hidden');
    } else {
      errorElement.classList.remove('error-visible');
      errorElement.classList.add('error-hidden');
    }
  }

  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    options: { immediate?: boolean } = {}
  ): (...args: Parameters<T>) => void {
    let timeout: number | undefined;

    return function (this: any, ...args: Parameters<T>): void {
      const context = this;

      // If immediate is set, execute immediately
      if (options.immediate) {
        func.apply(context, args);
        return;
      }

      const later = function () {
        timeout = undefined;
        func.apply(context, args);
      };

      clearTimeout(timeout);
      timeout = window.setTimeout(later, wait) as unknown as number;
    };
  }
}
