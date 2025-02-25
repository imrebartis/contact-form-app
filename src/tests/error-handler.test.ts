import { beforeEach, describe, expect, it } from 'vitest';

import { ErrorHandler } from '../services/error-handler';

describe('ErrorHandler', () => {
  let errorHandler: ErrorHandler;
  let element: HTMLElement;
  let errorElement: HTMLElement;

  beforeEach(() => {
    errorHandler = new ErrorHandler();

    document.body.innerHTML = '';

    element = document.createElement('div');
    errorElement = document.createElement('div');
    errorElement.id = 'error-1';
    document.body.appendChild(element);
    document.body.appendChild(errorElement);
  });

  describe('showError', () => {
    it('should handle error display for regular elements', () => {
      element.setAttribute('aria-describedby', 'error-1');

      errorHandler.showError(element, 'Test error message');

      expect(errorElement.textContent).toBe('Test error message');
      expect(errorElement.style.display).toBe('block');
      expect(errorElement.getAttribute('aria-hidden')).toBe('false');
      expect(element.getAttribute('aria-invalid')).toBe('true');
    });

    it('should clear error message when empty message is provided', () => {
      element.setAttribute('aria-describedby', 'error-1');

      errorHandler.showError(element, '');

      expect(errorElement.textContent).toBe('');
      expect(errorElement.style.display).toBe('none');
      expect(errorElement.getAttribute('aria-hidden')).toBe('true');
      expect(element.getAttribute('aria-invalid')).toBe('false');
    });

    it('should handle radio group elements', () => {
      element.classList.add('radio-group');

      const internalErrorElement = document.createElement('div');
      internalErrorElement.classList.add('error-message');
      element.appendChild(internalErrorElement);

      const radio1 = document.createElement('input');
      radio1.type = 'radio';
      const radio2 = document.createElement('input');
      radio2.type = 'radio';
      element.appendChild(radio1);
      element.appendChild(radio2);

      errorHandler.showError(element, 'Radio error message');

      expect(internalErrorElement.textContent).toBe('Radio error message');
      expect(radio1.getAttribute('aria-invalid')).toBe('true');
      expect(radio2.getAttribute('aria-invalid')).toBe('true');
    });

    it('should handle elements with aria-describedby', () => {
      element.setAttribute('aria-describedby', 'error-1');
      errorElement.classList.add('error-message');

      errorHandler.showError(element, 'Test error message');

      expect(errorElement.textContent).toBe('Test error message');
      expect(errorElement.style.display).toBe('block');
      expect(element.getAttribute('aria-invalid')).toBe('true');
    });

    it('should handle elements with nested aria-describedby', () => {
      document.body.innerHTML = `
        <div>
          <input id="test-input" aria-describedby="error-message" />
          <div id="error-message" class="error-message"></div>
        </div>
      `;

      const element = document.getElementById('test-input') as HTMLInputElement;
      const errorElement = document.getElementById(
        'error-message'
      ) as HTMLElement;

      errorHandler.showError(element, 'Nested error message');

      expect(errorElement.textContent).toBe('Nested error message');
      expect(errorElement.style.display).toBe('block');
    });

    it('should handle missing error element gracefully', () => {
      document.body.innerHTML = `
        <div>
          <input id="test-input" />
        </div>
      `;

      const element = document.getElementById('test-input') as HTMLInputElement;

      expect(() => {
        errorHandler.showError(element, 'Test error');
      }).not.toThrow();

      expect(element.getAttribute('aria-invalid')).toBe('true');
    });
  });
});
