import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { IFormSubmitter } from '../interfaces/form-interfaces';
import { ContactForm, ContactFormFactory } from '../main';
import { FormRenderer } from '../services/form-renderer';

describe('ContactForm', () => {
  let contactForm: ContactForm;
  let formElement: HTMLFormElement;
  let renderer: FormRenderer;
  let mockSubmitter: IFormSubmitter;

  beforeEach(() => {
    document.body.innerHTML = '';

    renderer = new FormRenderer();
    formElement = renderer.renderForm();
    document.body.appendChild(formElement);

    // mock submitter for better test isolation
    mockSubmitter = {
      submitForm: vi.fn().mockResolvedValue(undefined),
      showSuccessMessage: vi.fn(),
    };

    contactForm = ContactFormFactory.create({
      formRenderer: renderer,
      submitter: mockSubmitter,
    });
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

    const contactForm = ContactFormFactory.create({
      formRenderer: renderer,
      submitter: mockSubmitter,
    });
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

    expect(mockSubmitter.submitForm).toHaveBeenCalledTimes(1);
    expect(mockSubmitter.showSuccessMessage).toHaveBeenCalledTimes(1);

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

describe('ContactForm Abort Handling', () => {
  let contactForm: ContactForm;
  let formElement: HTMLFormElement;
  let renderer: FormRenderer;
  let mockSubmitter: IFormSubmitter;
  let abortController: AbortController;

  beforeEach(() => {
    document.body.innerHTML = '';

    // Create a new AbortController for each test
    abortController = new AbortController();

    renderer = new FormRenderer();
    formElement = renderer.renderForm();
    document.body.appendChild(formElement);

    // Mock submitter with delay to simulate network request
    mockSubmitter = {
      submitForm: vi.fn().mockImplementation(async (_data, signal) => {
        // Return a promise that resolves after a delay
        // This allows time to abort during the "request"
        return new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => resolve(undefined), 1000);

          // If signal is provided, hook up abort listener
          if (signal) {
            signal.addEventListener('abort', () => {
              clearTimeout(timeoutId);
              reject(
                new DOMException('The operation was aborted', 'AbortError')
              );
            });
          }
        });
      }),
      showSuccessMessage: vi.fn(),
    };

    contactForm = ContactFormFactory.create({
      formRenderer: renderer,
      submitter: mockSubmitter,
      abortController: abortController,
    });

    // Initialize the form
    contactForm.init();

    // Fill the form with valid data
    const form = document.querySelector('form') as HTMLFormElement;
    const firstName = form.querySelector('#first-name') as HTMLInputElement;
    const lastName = form.querySelector('#last-name') as HTMLInputElement;
    const email = form.querySelector('#email') as HTMLInputElement;
    const message = form.querySelector('#message') as HTMLTextAreaElement;
    const consent = form.querySelector('#consent') as HTMLInputElement;
    const radioButtons = form.querySelectorAll('[name="query-type"]');

    firstName.value = 'John';
    lastName.value = 'Doe';
    email.value = 'john.doe@example.com';
    message.value = 'This is a test message';
    consent.checked = true;
    (radioButtons[0] as HTMLInputElement).checked = true;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should not submit when aborted before submission starts', async () => {
    // Abort before submission
    abortController.abort();

    // Trigger form submission
    const form = document.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));

    // Wait for any promises to resolve
    await vi.runAllTimersAsync();

    // The submitForm method should not be called
    expect(mockSubmitter.submitForm).not.toHaveBeenCalled();

    // Submit button should not be in "Sending..." state
    const submitButton = form.querySelector('button') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(false);
    expect(submitButton.textContent).not.toBe('Sending...');
  });

  it('should handle abort during submission without showing error', async () => {
    vi.useFakeTimers();

    const form = document.querySelector('form') as HTMLFormElement;
    const submitButton = form.querySelector('button') as HTMLButtonElement;

    // Start form submission
    form.dispatchEvent(new Event('submit'));

    // Button should show "Sending..."
    expect(submitButton.disabled).toBe(true);
    expect(submitButton.textContent).toBe('Sending...');

    // Advance time slightly
    vi.advanceTimersByTime(100);

    // Abort during submission
    abortController.abort();

    // Fast-forward to complete all pending promises
    await vi.runAllTimersAsync();

    // The error message should not be displayed since this was an intentional abort
    const errorContainer = document.querySelector('.form-error') as HTMLElement;
    expect(errorContainer?.classList.contains('visible')).toBeFalsy();

    // submitForm should have been called but rejected due to abort
    expect(mockSubmitter.submitForm).toHaveBeenCalledTimes(1);
    expect(mockSubmitter.showSuccessMessage).not.toHaveBeenCalled();

    vi.useRealTimers();
  });

  it('should reset form state after submission is aborted', async () => {
    vi.useFakeTimers();

    // Setup spy on view.resetSubmitButton
    const resetSubmitButtonSpy = vi.spyOn(
      contactForm['view'],
      'resetSubmitButton'
    );

    const form = document.querySelector('form') as HTMLFormElement;

    // Start form submission
    form.dispatchEvent(new Event('submit'));

    // Advance time slightly
    vi.advanceTimersByTime(100);

    // Abort during submission
    abortController.abort();

    // Fast-forward to complete all pending promises
    await vi.runAllTimersAsync();

    // Verify resetSubmitButton was called after abort
    expect(resetSubmitButtonSpy).toHaveBeenCalled();

    // After abort, form should return to the original state
    const submitButton = form.querySelector('button') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(false);

    // Form elements should not be disabled
    const firstName = form.querySelector('#first-name') as HTMLInputElement;
    expect(firstName.disabled).toBe(false);

    vi.useRealTimers();
  });
});

describe('ContactForm State Transitions', () => {
  let renderer: FormRenderer;
  let mockSubmitter: IFormSubmitter;
  let viewSpies: Record<string, any>;
  let contactForm: ContactForm;

  beforeEach(() => {
    document.body.innerHTML = '';

    renderer = new FormRenderer();
    const formElement = renderer.renderForm();
    document.body.appendChild(formElement);

    // Create submitter with controllable outcomes
    mockSubmitter = {
      submitForm: vi.fn(),
      showSuccessMessage: vi.fn(),
    };

    // Set up form
    contactForm = ContactFormFactory.create({
      formRenderer: renderer,
      submitter: mockSubmitter,
    });

    // Initialize form
    contactForm.init();

    // Set up spies on view methods to track state transitions
    viewSpies = {
      disableSubmitButton: vi.spyOn(contactForm['view'], 'disableSubmitButton'),
      resetSubmitButton: vi.spyOn(contactForm['view'], 'resetSubmitButton'),
      disableFormElements: vi.spyOn(contactForm['view'], 'disableFormElements'),
      showFormError: vi.spyOn(contactForm['view'], 'showFormError'),
      resetForm: vi.spyOn(contactForm['view'], 'resetForm'),
    };

    // Fill form with valid data
    populateFormWithValidData();
  });

  function populateFormWithValidData() {
    const form = document.querySelector('form') as HTMLFormElement;
    const firstName = form.querySelector('#first-name') as HTMLInputElement;
    const lastName = form.querySelector('#last-name') as HTMLInputElement;
    const email = form.querySelector('#email') as HTMLInputElement;
    const message = form.querySelector('#message') as HTMLTextAreaElement;
    const consent = form.querySelector('#consent') as HTMLInputElement;
    const radioButtons = form.querySelectorAll('[name="query-type"]');

    firstName.value = 'John';
    lastName.value = 'Doe';
    email.value = 'john.doe@example.com';
    message.value = 'This is a test message';
    consent.checked = true;
    (radioButtons[0] as HTMLInputElement).checked = true;
  }

  it('should transition through correct states for successful submission', async () => {
    vi.useFakeTimers();

    // Configure mock to succeed
    mockSubmitter.submitForm = vi.fn().mockResolvedValue(undefined);

    // Submit the form
    const form = document.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));

    // Initial state - button disabled with "Sending..." text
    expect(viewSpies.disableSubmitButton).toHaveBeenCalledWith('Sending...');

    // Await all promises
    await vi.runAllTimersAsync();

    // Final state - success flow
    expect(mockSubmitter.showSuccessMessage).toHaveBeenCalledTimes(1);
    expect(viewSpies.disableFormElements).toHaveBeenCalledTimes(1);
    expect(viewSpies.resetForm).toHaveBeenCalledTimes(1);
    expect(viewSpies.disableSubmitButton).toHaveBeenLastCalledWith('Sent');

    // Error state should never be shown
    expect(viewSpies.showFormError).not.toHaveBeenCalled();

    vi.useRealTimers();
  });

  it('should transition through correct states for failed submission', async () => {
    vi.useFakeTimers();

    // Configure mock to fail
    const testError = new Error('Network error');
    (mockSubmitter.submitForm as jest.Mock).mockRejectedValue(testError);

    // Submit the form
    const form = document.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));

    // Initial state - button disabled with "Sending..." text
    expect(viewSpies.disableSubmitButton).toHaveBeenCalledWith('Sending...');

    // Await all promises
    await vi.runAllTimersAsync();

    // Final state - error flow
    expect(viewSpies.showFormError).toHaveBeenCalledWith(
      'Failed to send message. Please try again.'
    );
    expect(viewSpies.resetSubmitButton).toHaveBeenCalledTimes(1);

    // Success state methods should never be called
    expect(mockSubmitter.showSuccessMessage).not.toHaveBeenCalled();
    expect(viewSpies.disableFormElements).not.toHaveBeenCalled();
    expect(viewSpies.resetForm).not.toHaveBeenCalled();
    expect(viewSpies.disableSubmitButton).not.toHaveBeenCalledWith('Sent');

    vi.useRealTimers();
  });

  it('should transition through correct states for aborted submission', async () => {
    vi.useFakeTimers();

    // Create with an abort controller
    const abortController = new AbortController();

    // Create a new form with the abort controller
    document.body.innerHTML = '';
    const abortFormElement = renderer.renderForm();
    document.body.appendChild(abortFormElement);

    const abortContactForm = ContactFormFactory.create({
      formRenderer: renderer,
      submitter: mockSubmitter,
      abortController: abortController,
    });
    abortContactForm.init();

    // Configure mock to handle abort signal
    (mockSubmitter.submitForm as jest.Mock).mockImplementation(
      async (_, signal) => {
        return new Promise((_, reject) => {
          signal?.addEventListener('abort', () => {
            reject(new DOMException('The operation was aborted', 'AbortError'));
          });
        });
      }
    );

    // Fill the form again since we recreated it
    populateFormWithValidData();

    // Set up spies after initializing the form
    const abortViewSpies = {
      resetSubmitButton: vi.spyOn(
        abortContactForm['view'],
        'resetSubmitButton'
      ),
      showFormError: vi.spyOn(abortContactForm['view'], 'showFormError'),
    };

    // Submit the form
    const form = document.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));

    // Abort during submission
    vi.advanceTimersByTime(100);
    abortController.abort();

    // Await all promises
    await vi.runAllTimersAsync();

    // Verify abort-specific state transition
    expect(mockSubmitter.submitForm).toHaveBeenCalledTimes(1);
    expect(abortViewSpies.resetSubmitButton).toHaveBeenCalledTimes(1);
    expect(abortViewSpies.showFormError).not.toHaveBeenCalled();

    // Success state methods should never be called
    expect(mockSubmitter.showSuccessMessage).not.toHaveBeenCalled();

    vi.useRealTimers();
  });
});
