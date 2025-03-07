'use strict';

import DOMPurify from 'dompurify';
import validator from 'validator';

import { IFormValidator } from '../interfaces/form-interfaces';
import { FormElements } from '../types/form.types';

export class FormValidator implements IFormValidator {
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

interface ValidationResult {
  isValid: boolean;
  errorMessage: string;
}
