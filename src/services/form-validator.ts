'use strict';

import { FormElements } from '../types/form.types';

export class FormValidator {
  validateField(
    fieldName: keyof FormElements,
    element: HTMLElement
  ): ValidationResult {
    let isValid = true;
    let errorMessage = '';

    switch (fieldName) {
      case 'firstName':
      case 'lastName':
        isValid = (element as HTMLInputElement).value.trim().length >= 2;
        errorMessage = isValid ? '' : 'This field is required';
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const value = (element as HTMLInputElement).value;
        isValid = emailRegex.test(value);
        errorMessage = isValid ? '' : 'Please enter a valid email address';
        if (!value) errorMessage = 'This field is required';
        break;

      case 'queryType':
        const selectedRadio = (element as unknown as RadioNodeList).value;
        isValid = selectedRadio !== '';
        errorMessage = isValid ? '' : 'Please select a query type';
        break;

      case 'message':
        isValid = (element as HTMLTextAreaElement).value.trim().length > 0;
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
