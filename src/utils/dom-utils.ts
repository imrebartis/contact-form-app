'use strict';

export class DOMUtils {
  static getElement<T extends HTMLElement>(selector: string): T {
    const element = document.querySelector<T>(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    return element;
  }

  static getElements<T extends HTMLElement>(selector: string): T[] {
    return Array.from(document.querySelectorAll<T>(selector));
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
    if (message) {
      element.setAttribute('aria-invalid', 'true');

      if (
        element.classList.contains('radio-group') ||
        element.classList.contains('checkbox-container')
      ) {
        const inputs = element.querySelectorAll('input');
        inputs.forEach((input) => input.setAttribute('aria-invalid', 'true'));
      }
    } else {
      element.setAttribute('aria-invalid', 'false');

      if (
        element.classList.contains('radio-group') ||
        element.classList.contains('checkbox-container')
      ) {
        const inputs = element.querySelectorAll('input');
        inputs.forEach((input) => input.setAttribute('aria-invalid', 'false'));
      }
    }

    const describedById = element.getAttribute('aria-describedby');
    if (describedById) {
      const errorElement = document.getElementById(describedById);
      if (errorElement) {
        this.updateErrorElement(errorElement, element, message);
        return;
      }
    }

    if (
      element.classList.contains('radio-group') ||
      element.classList.contains('checkbox-container')
    ) {
      const errorElement = element.querySelector(
        '.error-message'
      ) as HTMLElement;
      if (errorElement) {
        this.updateErrorElement(errorElement, element, message);
      }
      return;
    }

    const errorElement = element.nextElementSibling as HTMLElement;
    if (errorElement && errorElement.classList.contains('error-message')) {
      this.updateErrorElement(errorElement, element, message);
    } else {
      const parentElement =
        element.closest('.form-field') || element.parentElement;
      if (parentElement) {
        const errorWithinParent = parentElement.querySelector('.error-message');
        if (errorWithinParent) {
          this.updateErrorElement(
            errorWithinParent as HTMLElement,
            element,
            message
          );
        }
      }
    }
  }

  private static updateErrorElement(
    errorElement: HTMLElement,
    inputElement: HTMLElement,
    message: string
  ): void {
    errorElement.textContent = message;

    if (message) {
      errorElement.style.display = 'block';
      errorElement.setAttribute('aria-hidden', 'false');
      inputElement.setAttribute('aria-invalid', 'true');
    } else {
      errorElement.style.display = 'none';
      errorElement.setAttribute('aria-hidden', 'true');
      inputElement.setAttribute('aria-invalid', 'false');
    }
  }
}
