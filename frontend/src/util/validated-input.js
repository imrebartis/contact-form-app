import * as yup from 'yup';

class ValidatedInput {
  constructor(inputElement, schema, fieldName) {
    this.inputElement = inputElement;
    this.schema = schema;
    this.fieldName = fieldName;
    this.errorContainer = document.createElement('span');
    this.errorContainer.className = 'error-message';
    this.errorContainer.id = `${fieldName}-error`;
    this.inputElement.insertAdjacentElement('afterend', this.errorContainer);

    this.inputElement.addEventListener('blur', () => this.validate());
    this.inputElement.addEventListener('input', () => this.clearError());
  }

  validate() {
    const value = this.inputElement.value;
    try {
      this.schema.validateSyncAt(this.fieldName, { [this.fieldName]: value });
      this.clearError();
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        this.showError(err.message);
      }
    }
  }

  showError(message) {
    this.inputElement.classList.add('error');
    this.inputElement.setAttribute('aria-invalid', 'true');
    this.inputElement.setAttribute(
      'aria-describedby',
      `${this.fieldName}-error`
    );
    this.errorContainer.textContent = message;
    this.errorContainer.setAttribute('role', 'alert');
  }

  clearError() {
    this.inputElement.classList.remove('error');
    this.inputElement.removeAttribute('aria-invalid');
    this.inputElement.removeAttribute('aria-describedby');
    this.errorContainer.textContent = '';
    this.errorContainer.removeAttribute('role');
  }
}

export default ValidatedInput;
