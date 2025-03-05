import { FormData, FormElements } from '../types/form.types';

export interface IFormValidator {
  validateField(
    fieldName: keyof FormElements,
    element: HTMLElement
  ): {
    isValid: boolean;
    errorMessage: string;
  };
}

export interface IFormRenderer {
  renderForm(): HTMLFormElement;
}

export interface IErrorHandler {
  showError(container: HTMLElement, message: string): void;
}

export interface IToastService {
  showFormSubmissionSuccess(title: string, message: string): void;
}

export interface IFormSubmitter {
  submitForm(formData: FormData): Promise<void>;
  showSuccessMessage(): void;
}

export interface IFormView {
  createForm(): HTMLFormElement;
  setupElements(): void;
  getFormElements(): FormElements;
  setupEventListeners(
    submitHandler: (e: Event) => Promise<void>,
    validateFieldHandler: (fieldName: keyof FormElements) => boolean
  ): void;
  getAbortController(): AbortController;
  setAbortController(controller: AbortController): void;
  showFieldError(fieldName: keyof FormElements, errorMessage: string): void;
  disableSubmitButton(text: string): void;
  resetSubmitButton(): void;
  disableFormElements(): void;
  resetForm(): void;
  showFormError(message: string): void;
  getForm(): HTMLFormElement;
  getSubmitButton(): HTMLButtonElement;
  cleanup(): void;
}
