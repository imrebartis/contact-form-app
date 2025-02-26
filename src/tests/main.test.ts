import { beforeEach, describe, expect, it } from 'vitest';

import { ContactForm } from '../main';
import { FormRenderer } from '../services/form-renderer';

describe('ContactForm', () => {
  let formElement: HTMLFormElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    const renderer = new FormRenderer();
    formElement = renderer.renderForm();
    document.body.appendChild(formElement);
    new ContactForm();
  });

  it('should display validation errors on empty form submission', () => {
    formElement.dispatchEvent(new Event('submit'));

    const errorMessages = document.querySelectorAll('.error-message');
    expect(errorMessages.length).toBeGreaterThan(0);
  });

  it('should validate fields as user types', () => {
    const contactForm = new ContactForm();
    contactForm.init();

    const firstNameInput = document.getElementById(
      'first-name'
    ) as HTMLInputElement;
    firstNameInput.blur();

    const errorMessage = firstNameInput.nextElementSibling as HTMLElement;

    expect(errorMessage?.textContent).toBe('This field is required');
    expect(errorMessage?.classList.contains('error-visible')).toBe(true);

    firstNameInput.value = 'John';

    const inputEvent = new Event('input');
    firstNameInput.dispatchEvent(inputEvent);

    expect(errorMessage?.textContent).toBe('');
    expect(errorMessage?.classList.contains('error-visible')).toBe(false);
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
