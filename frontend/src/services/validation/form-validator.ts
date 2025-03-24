'use strict';

import * as yup from 'yup';

import { formSubmissionSchema } from '../../../../shared';
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

    try {
      let value: string | boolean;

      // Special handling for consent checkbox
      if (fieldName === 'consent') {
        const checkbox = element as HTMLInputElement;
        value = checkbox.checked;
      } else if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement
      ) {
        value = element.value;
      } else {
        // For RadioNodeList or other elements
        value = (element as any).value || '';
      }

      // Create an object with just this field for validation
      const fieldData = { [fieldName]: value };
      formSubmissionSchema.validateSyncAt(fieldName, fieldData);
    } catch (err) {
      isValid = false;

      // Handle specific validation errors
      if (err instanceof yup.ValidationError) {
        errorMessage = err.message;

        // Special case for email validation - empty vs invalid format
        if (fieldName === 'email') {
          const emailValue = (element as HTMLInputElement).value;
          if (emailValue && emailValue.trim() !== '') {
            errorMessage = 'Valid email is required';
          }
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      } else {
        errorMessage = String(err);
      }
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
