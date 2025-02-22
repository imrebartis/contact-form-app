'use strict';
export class ErrorHandler {
  showError(element: HTMLElement, message: string): void {
    const errorId =
      element.getAttribute('aria-describedby') ||
      element
        .querySelector('[aria-describedby]')
        ?.getAttribute('aria-describedby');
    const errorElement = document.getElementById(errorId || '');

    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = message ? 'block' : 'none';
      errorElement.setAttribute('aria-hidden', (!message).toString());
    }

    if (element.classList.contains('radio-group')) {
      const radioInputs = element.querySelectorAll('input[type="radio"]');
      radioInputs.forEach((input) => {
        input.setAttribute('aria-invalid', message ? 'true' : 'false');
      });
    } else {
      element.setAttribute('aria-invalid', message ? 'true' : 'false');
    }
  }
}
