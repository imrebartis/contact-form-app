import { beforeEach, describe, expect, it } from 'vitest';

import { FormValidator } from '../services/form-validator';

describe('FormValidator', () => {
  let validator: FormValidator;

  beforeEach(() => {
    validator = new FormValidator();
  });

  describe('validateField', () => {
    it('should validate first name', () => {
      const input = document.createElement('input');

      input.value = '';
      let result = validator.validateField('firstName', input);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('This field is required');

      input.value = 'J';
      result = validator.validateField('firstName', input);
      expect(result.isValid).toBe(false);

      input.value = 'John';
      result = validator.validateField('firstName', input);
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBe('');
    });

    it('should validate email', () => {
      const input = document.createElement('input');

      input.value = '';
      let result = validator.validateField('email', input);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('This field is required');

      input.value = 'invalid-email';
      result = validator.validateField('email', input);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Please enter a valid email address');

      input.value = 'test@example.com';
      result = validator.validateField('email', input);
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBe('');
    });

    it('should validate query type', () => {
      const radioNodeList = document.createElement(
        'input'
      ) as unknown as RadioNodeList;

      radioNodeList.value = '';
      let result = validator.validateField(
        'queryType',
        radioNodeList as unknown as HTMLElement
      );
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Please select a query type');

      radioNodeList.value = 'general';
      result = validator.validateField(
        'queryType',
        radioNodeList as unknown as HTMLElement
      );
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBe('');
    });

    it('should validate message', () => {
      const textarea = document.createElement('textarea');

      textarea.value = '';
      let result = validator.validateField('message', textarea);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('This field is required');

      textarea.value = '';
      result = validator.validateField('message', textarea);
      expect(result.isValid).toBe(false);

      textarea.value = 'This is a proper message';
      result = validator.validateField('message', textarea);
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBe('');
    });

    it('should validate consent', () => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';

      checkbox.checked = false;
      let result = validator.validateField('consent', checkbox);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe(
        'To submit this form, please consent to being contacted'
      );

      checkbox.checked = true;
      result = validator.validateField('consent', checkbox);
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBe('');
    });
  });
});
