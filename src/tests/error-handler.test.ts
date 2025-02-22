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
      element.setAttribute('aria-describedby', 'error-1');

      const radio1 = document.createElement('input');
      radio1.type = 'radio';
      const radio2 = document.createElement('input');
      radio2.type = 'radio';
      element.appendChild(radio1);
      element.appendChild(radio2);

      errorHandler.showError(element, 'Radio error message');

      expect(errorElement.textContent).toBe('Radio error message');
      expect(radio1.getAttribute('aria-invalid')).toBe('true');
      expect(radio2.getAttribute('aria-invalid')).toBe('true');
    });

    it('should handle elements with nested aria-describedby', () => {
      const nestedElement = document.createElement('div');
      nestedElement.setAttribute('aria-describedby', 'error-1');
      element.appendChild(nestedElement);

      errorHandler.showError(element, 'Nested error message');

      expect(errorElement.textContent).toBe('Nested error message');
      expect(errorElement.style.display).toBe('block');
    });

    it('should handle missing error element gracefully', () => {
      element.setAttribute('aria-describedby', 'non-existent-id');
      expect(() => {
        errorHandler.showError(element, 'Test message');
      }).not.toThrow();

      expect(element.getAttribute('aria-invalid')).toBe('true');
    });
  });
});
