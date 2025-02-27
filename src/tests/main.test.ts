import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ContactForm } from '../main';
import { FormRenderer } from '../services/form-renderer';

describe('ContactForm', () => {
  let formElement: HTMLFormElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    const renderer = new FormRenderer();
    formElement = renderer.renderForm();
    document.body.appendChild(formElement);
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

  it('should disable all form elements after successful submission', async () => {
    vi.useFakeTimers();

    const contactForm = new ContactForm();

    document.body.appendChild = vi.fn();
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
});
