import * as yup from 'yup';

export default class ValidatedInput {
  constructor(
    private input: HTMLInputElement | HTMLTextAreaElement,
    private schema: yup.ObjectSchema<any>,
    private fieldName: string
  ) {
    this.setupValidation();
  }

  private setupValidation(): void {
    const errorContainer = document.createElement('span');
    errorContainer.className = 'error-message';
    errorContainer.id = `${this.fieldName}-error`;
    this.input.insertAdjacentElement('afterend', errorContainer);

    this.input.addEventListener('blur', () => this.validate(errorContainer));
    this.input.addEventListener('input', () => this.clearError(errorContainer));
  }

  private validate(errorContainer: HTMLSpanElement): void {
    const value = this.input.value;
    try {
      this.schema.validateSyncAt(this.fieldName, { [this.fieldName]: value });
      this.clearError(errorContainer);
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        this.showError(err.message, errorContainer);
      }
    }
  }

  private showError(message: string, errorContainer: HTMLSpanElement): void {
    this.input.classList.add('error');
    this.input.setAttribute('aria-invalid', 'true');
    this.input.setAttribute('aria-describedby', `${this.fieldName}-error`);
    errorContainer.textContent = message;
    errorContainer.setAttribute('role', 'alert');
  }

  private clearError(errorContainer: HTMLSpanElement): void {
    this.input.classList.remove('error');
    this.input.removeAttribute('aria-invalid');
    this.input.removeAttribute('aria-describedby');
    errorContainer.textContent = '';
    errorContainer.removeAttribute('role');
  }
}
