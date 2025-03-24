'use strict';

import DOMPurify from 'dompurify';
import validator from 'validator';

import { IFormValidator } from '../../interfaces/form-interfaces';
import { FormElements } from '../../types/form.types';

/**
 * Validates form field inputs according to specific validation rules
 * Implements the IFormValidator interface to ensure proper form validation
 */
export class FormValidator implements IFormValidator {
  /**
   * Validates a form field based on its field name
   *
   * @param fieldName - The name of the field to validate (must be a key of FormElements)
   * @param element - The HTML element to validate
   * @returns ValidationResult object containing validation status and error message
   */
  validateField(
    fieldName: keyof FormElements,
    element: HTMLElement
  ): ValidationResult {
    let isValid = true;
    let errorMessage = '';

    switch (fieldName) {
      case 'firstName':
      case 'lastName':
        isValid =
          DOMPurify.sanitize((element as HTMLInputElement).value.trim())
            .length > 0;
        errorMessage = isValid ? '' : 'This field is required';
        break;

      case 'email':
        const value = DOMPurify.sanitize((element as HTMLInputElement).value);
        if (!value.trim()) {
          isValid = false;
          errorMessage = 'This field is required';
        } else {
          isValid = validator.isEmail(value);
          errorMessage = isValid ? '' : 'Please enter a valid email address';
        }
        break;

      case 'queryType':
        const selectedRadio = DOMPurify.sanitize(
          (element as unknown as RadioNodeList).value
        );
        isValid = selectedRadio !== '';
        errorMessage = isValid ? '' : 'Please select a query type';
        break;

      case 'message':
        isValid =
          DOMPurify.sanitize((element as HTMLTextAreaElement).value.trim())
            .length > 0;
        errorMessage = isValid ? '' : 'This field is required';
        break;

      case 'consent':
        isValid = (element as HTMLInputElement).checked;
        errorMessage = isValid
          ? ''
          : 'To submit this form, please consent to being contacted';
        break;
    }

    return { isValid, errorMessage };
  }
}

/**
 * Result of a form field validation
 */
interface ValidationResult {
  /** Whether the field passed validation */
  isValid: boolean;
  /** Error message to display if validation failed, empty string if validation passed */
  errorMessage: string;
}
