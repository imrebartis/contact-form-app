'use strict';

import { beforeEach, describe, expect, it } from 'vitest';

import { formSubmissionSchema } from '../../../shared';
import { FormValidator } from '../services/validation/form-validator';

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

      input.value = '';
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
      expect(result.errorMessage).toBe('Valid email is required');

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

// Additional tests for the shared formSubmissionSchema

describe('formSubmissionSchema', () => {
  it('should validate correct data', () => {
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      message: 'Hello, this is a test message.',
      queryType: 'general',
      consent: true,
    };

    expect(() => formSubmissionSchema.validateSync(validData)).not.toThrow();
  });

  it('should throw validation errors for invalid data', () => {
    const invalidData = {
      firstName: '',
      lastName: '',
      email: 'invalid-email',
      message: '',
      queryType: 'invalid-type',
    };

    try {
      formSubmissionSchema.validateSync(invalidData, { abortEarly: false });
    } catch (error) {
      if (error instanceof Error && 'errors' in error) {
        expect(error.errors).toContain('This field is required');
        expect(error.errors).toContain('Valid email is required');
        expect(error.errors).toContain('Please select a query type');
        expect(error.errors).toContain(
          'To submit this form, please consent to being contacted'
        );
      } else {
        throw error; // Re-throw if it's not the expected error type
      }
    }
  });

  it('should handle edge cases like empty strings and special characters', () => {
    const edgeCaseData = {
      firstName: '!',
      lastName: '@',
      email: 'edge.case@example.com',
      message: 'Special characters: !@#$%^&*()',
      queryType: 'support',
      consent: true,
    };

    expect(() => formSubmissionSchema.validateSync(edgeCaseData)).not.toThrow();
  });
});
