'use strict';

interface ElementRetrievalOptions {
  throwIfNotFound?: boolean;
  errorMessage?: string;
}

export class DOMUtils {
  static getElement<T extends HTMLElement>(
    selector: string,
    options: ElementRetrievalOptions = { throwIfNotFound: true }
  ): T | null {
    const element = document.querySelector<T>(selector);

    if (!element && options.throwIfNotFound) {
      throw new Error(options.errorMessage || `Element not found: ${selector}`);
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
    const element = document.getElementById(id) as T | null;

    if (!element && options.throwIfNotFound) {
      throw new Error(
        options.errorMessage || `Element not found with ID: ${id}`
      );
    }

    return element;
  }

  static addEventListener(
    element: HTMLElement,
    eventType: string,
    handler: EventListenerOrEventListenerObject
  ): void {
    element.addEventListener(eventType, handler);
  }

  static removeEventListener(
    element: HTMLElement,
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
}
