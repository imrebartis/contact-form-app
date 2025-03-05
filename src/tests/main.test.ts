import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ContactForm, ContactFormFactory } from '../main';
import { FormRenderer } from '../services/form-renderer';

describe('ContactForm', () => {
  let contactForm: ContactForm;
  let formElement: HTMLFormElement;

  beforeEach(() => {
    document.body.innerHTML = '';

    const renderer = new FormRenderer();
    formElement = renderer.renderForm();
    document.body.appendChild(formElement);

    contactForm = ContactFormFactory.create();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should display validation errors on empty form submission', () => {
    contactForm.init();
    const form = document.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));

    const errorMessages = document.querySelectorAll('.error-message');
    expect(errorMessages.length).toBeGreaterThan(0);
  });

  it('should validate fields as user types', () => {
    const contactForm = ContactFormFactory.create();
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
    contactForm.init();
    const submitButton = document.querySelector('button') as HTMLButtonElement;
    submitButton.disabled = true;

    const form = document.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));

    expect(submitButton.disabled).toBe(true);
    expect(submitButton.textContent).not.toBe('Sending...');
  });

  it('should disable all form elements after successful submission', async () => {
    vi.useFakeTimers();

    const contactForm = ContactFormFactory.create();
    contactForm.init();

    const form = document.querySelector('form') as HTMLFormElement;

    const firstName = form.querySelector('#first-name') as HTMLInputElement;
    const lastName = form.querySelector('#last-name') as HTMLInputElement;
    const email = form.querySelector('#email') as HTMLInputElement;
    const message = form.querySelector('#message') as HTMLTextAreaElement;
    const consent = form.querySelector('#consent') as HTMLInputElement;
    const radioButtons = form.querySelectorAll('[name="query-type"]');
    const submitButton = form.querySelector('button') as HTMLButtonElement;

    firstName.value = 'John';
    lastName.value = 'Doe';
    email.value = 'john.doe@example.com';
    message.value = 'This is a test message';
    consent.checked = true;
    (radioButtons[0] as HTMLInputElement).checked = true;

    form.dispatchEvent(new Event('submit'));

    // Fast-forward timer to simulate network delay
    vi.advanceTimersByTime(1600);
    await vi.runAllTimersAsync();

    expect(firstName.disabled).toBe(true);
    expect(lastName.disabled).toBe(true);
    expect(email.disabled).toBe(true);
    expect(message.disabled).toBe(true);
    expect(consent.disabled).toBe(true);
    radioButtons.forEach((radio) => {
      expect((radio as HTMLInputElement).disabled).toBe(true);
    });

    expect(submitButton.disabled).toBe(true);
    expect(submitButton.textContent).toBe('Sent');

    vi.useRealTimers();
  });

  it('should validate specific fields and show errors only for those fields', async () => {
    const contactForm = ContactFormFactory.create();
    contactForm.init();

    const form = document.querySelector('form') as HTMLFormElement;
    const firstName = form.querySelector('#first-name') as HTMLInputElement;
    const lastName = form.querySelector('#last-name') as HTMLInputElement;
    const email = form.querySelector('#email') as HTMLInputElement;

    firstName.value = 'John';

    form.dispatchEvent(new Event('submit'));

    const firstNameError = firstName.nextElementSibling as HTMLElement;
    const lastNameError = lastName.nextElementSibling as HTMLElement;
    const emailError = email.nextElementSibling as HTMLElement;

    expect(firstNameError.classList.contains('error-visible')).toBe(false);
    expect(lastNameError.classList.contains('error-visible')).toBe(true);
    expect(emailError.classList.contains('error-visible')).toBe(true);

    lastName.value = 'Doe';
    email.value = 'john.doe@example.com';
    const message = form.querySelector('#message') as HTMLTextAreaElement;
    message.value = 'Test message';
    const consent = form.querySelector('#consent') as HTMLInputElement;
    consent.checked = true;
    const radioButtons = form.querySelectorAll('[name="query-type"]');
    (radioButtons[0] as HTMLInputElement).checked = true;

    vi.useFakeTimers();
    form.dispatchEvent(new Event('submit'));

    expect(firstNameError.classList.contains('error-visible')).toBe(false);
    expect(lastNameError.classList.contains('error-visible')).toBe(false);
    expect(emailError.classList.contains('error-visible')).toBe(false);

    vi.advanceTimersByTime(100);
    const submitButton = form.querySelector('button') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
    expect(submitButton.textContent).toBe('Sending...');

    vi.useRealTimers();
  });
});
