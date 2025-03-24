import { FormData } from '../types/form-data.ts';

type ValidationErrors = Record<string, string>;

/**
 * Validates form submission data
 * @param data The form data to validate
 * @returns An object with validation errors (empty if validation passes)
 */
export const validateFormSubmission = (data: FormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Validate firstName
  if (!data.firstName) {
    errors.firstName = 'First name is required';
  } else if (data.firstName.length < 1) {
    errors.firstName = 'First name cannot be empty';
  } else if (data.firstName.length > 100) {
    errors.firstName = 'First name cannot exceed 100 characters';
  }

  // Validate lastName
  if (!data.lastName) {
    errors.lastName = 'Last name is required';
  } else if (data.lastName.length < 1) {
    errors.lastName = 'Last name cannot be empty';
  } else if (data.lastName.length > 100) {
    errors.lastName = 'Last name cannot exceed 100 characters';
  }

  // Validate email
  if (!data.email) {
    errors.email = 'Email is required';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.email = 'Email format is invalid';
    }
  }

  // Validate message
  if (!data.message) {
    errors.message = 'Message is required';
  } else if (data.message.length < 1) {
    errors.message = 'Message cannot be empty';
  }

  // Validate queryType
  if (!data.queryType) {
    errors.queryType = 'Query type is required';
  } else if (!['general', 'support'].includes(data.queryType)) {
    errors.queryType = 'Query type must be either general or support';
  }

  return errors;
};
