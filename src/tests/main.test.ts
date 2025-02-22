import { beforeEach, describe, expect, it } from 'vitest';

import { ContactForm } from '../main';
import { FormRenderer } from '../services/form-renderer';

describe('ContactForm', () => {
  // @ts-expect-error
  let form: ContactForm;
  let formElement: HTMLFormElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    const renderer = new FormRenderer();
    formElement = renderer.renderForm();
    document.body.appendChild(formElement);
    form = new ContactForm();
  });

  it('should display validation errors on empty form submission', () => {
    formElement.dispatchEvent(new Event('submit'));

    const errorMessages = document.querySelectorAll('.error-message');
    expect(errorMessages.length).toBeGreaterThan(0);
  });

  it('should validate fields as user types', () => {
    const firstNameInput = document.getElementById(
      'first-name'
    ) as HTMLInputElement;
    firstNameInput.value = 'J';
    firstNameInput.dispatchEvent(new Event('input'));

    const errorMessage = firstNameInput.nextElementSibling;
    expect(errorMessage?.textContent).toBe('This field is required');

    firstNameInput.value = 'John';
    firstNameInput.dispatchEvent(new Event('input'));
    expect(errorMessage?.textContent).toBe('');
  });

  it('should prevent multiple submissions', () => {
    const submitButton = formElement.querySelector(
      'button'
    ) as HTMLButtonElement;
    submitButton.disabled = true;

    formElement.dispatchEvent(new Event('submit'));

    expect(submitButton.disabled).toBe(true);
    expect(submitButton.textContent).not.toBe('Sending...');
  });
});
