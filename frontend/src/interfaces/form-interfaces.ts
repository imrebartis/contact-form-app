'use strict';

import { FormData, FormElements } from '../types/form.types';

/**
 * Interface for form field validation services
 */
export interface IFormValidator {
  /**
   * Validates a form field
   *
   * @param fieldName - Name of the field to validate
   * @param element - DOM element to validate
   * @returns Object containing validation status and error message
   */
  validateField(
    fieldName: keyof FormElements,
    element: HTMLElement
  ): {
    isValid: boolean;
    errorMessage: string;
  };
}

/**
 * Interface for form rendering services
 */
export interface IFormRenderer {
  /**
   * Renders the form in the DOM
   *
   * @returns The created form element
   */
  renderForm(): HTMLFormElement;
}

/**
 * Interface for error handling services
 */
export interface IErrorHandler {
  /**
   * Displays an error message
   *
   * @param container - Container element where error will be shown
   * @param message - Error message to display
   */
  showError(container: HTMLElement, message: string): void;
}

/**
 * Interface for toast notification services
 */
export interface IToastService {
  /**
   * Shows a success notification for form submission
   *
   * @param title - Title of the success message
   * @param message - Body of the success message
   */
  showFormSubmissionSuccess(title: string, message: string): void;
}

/**
 * Interface for form submission services
 */
export interface IFormSubmitter {
  /**
   * Submits form data
   *
   * @param formData - Sanitized form data to submit
   * @param signal - Optional signal to abort submission
   */
  submitForm(formData: FormData, signal?: AbortSignal): Promise<void>;

  /**
   * Displays a success message after submission
   */
  showSuccessMessage(): void;
}

/**
 * Interface for form view services
 */
export interface IFormView {
  /**
   * Creates and renders the form
   *
   * @returns The created form element
   */
  createForm(): HTMLFormElement;

  /**
   * Sets up event listeners for form interactions
   *
   * @param submitHandler - Handler for form submission
   * @param validateFieldHandler - Handler for field validation
   */
  setupEventListeners(
    submitHandler: (e: Event) => Promise<void>,
    validateFieldHandler: (fieldName: keyof FormElements) => boolean
  ): void;

  /**
   * Gets references to form elements
   */
  getFormElements(): FormElements;

  /**
   * Gets the form element
   */
  getForm(): HTMLFormElement;

  /**
   * Gets the submit button
   */
  getSubmitButton(): HTMLButtonElement;

  /**
   * Gets the abort signal for canceling operations
   */
  getAbortSignal(): AbortSignal;

  /**
   * Shows an error for a specific field
   *
   * @param fieldName - Name of the field with the error
   * @param errorMessage - Error message to display
   */
  showFieldError(fieldName: keyof FormElements, errorMessage: string): void;

  /**
   * Disables the submit button with custom text
   *
   * @param text - Text to display on the disabled button
   */
  disableSubmitButton(text: string): void;

  /**
   * Resets the submit button to its initial state
   */
  resetSubmitButton(): void;

  /**
   * Disables all form elements
   */
  disableFormElements(): void;

  /**
   * Resets the form to its initial state
   */
  resetForm(): void;

  /**
   * Shows a general form error
   *
   * @param message - Error message to display
   */
  showFormError(message: string): void;

  /**
   * Cleans up resources and event listeners
   */
  cleanup(): void;
}
