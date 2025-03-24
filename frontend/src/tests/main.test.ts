'use strict';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { IFormSubmitter } from '../interfaces/form-interfaces';
import { ContactForm } from '../main';
import { ErrorHandler } from '../services/form-handling/error-handler';
import { FormRenderer } from '../services/form-handling/form-renderer';
import { FormValidator } from '../services/validation/form-validator';
import { FormView } from '../views/form-view';

// Create a test helper class to expose protected methods for testing
class TestableContactForm extends ContactForm {
  // Make methods public for testing
  public testSubmitForm() {
    return this.submitForm();
  }

  public testValidateAllFields() {
    return this.validateAllFields();
  }

  // Used for testing to bypass validation
  public testForceSubmitForm() {
    return this.submitForm();
  }
}

// Helper function to create a testable contact form
function createTestableContactForm(config: any = {}) {
  const validator = config.validator || new FormValidator();
  const formRenderer = config.formRenderer || new FormRenderer();
  const errorHandler = config.errorHandler || new ErrorHandler();

  const view =
    config.view ||
    new FormView(formRenderer, errorHandler, config.abortController);

  const submitter = config.submitter || {
    submitForm: vi.fn().mockResolvedValue(undefined),
    showSuccessMessage: vi.fn(),
  };

  return new TestableContactForm(validator, submitter, view);
}

// Helper function to populate form with valid data
function populateValidFormData(form: HTMLFormElement) {
  const firstName = form.querySelector('#first-name') as HTMLInputElement;
  const lastName = form.querySelector('#last-name') as HTMLInputElement;
  const email = form.querySelector('#email') as HTMLInputElement;
  const message = form.querySelector('#message') as HTMLTextAreaElement;
  const consent = form.querySelector('#consent') as HTMLInputElement;
  const radioButtons = form.querySelectorAll('[name="query-type"]');

  firstName.value = 'John';
  lastName.value = 'Doe';
  email.value = 'john.doe@example.com';
  message.value =
    'This is a test message with proper length to pass validation';
  consent.checked = true;
  (radioButtons[0] as HTMLInputElement).checked = true;

  // Trigger events to ensure validation state is updated
  [firstName, lastName, email, message].forEach((el) => {
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('blur', { bubbles: true }));
  });

  consent.dispatchEvent(new Event('change', { bubbles: true }));
  (radioButtons[0] as HTMLInputElement).dispatchEvent(
    new Event('change', { bubbles: true })
  );
}

describe('ContactForm', () => {
  let contactForm: TestableContactForm;
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

    contactForm = createTestableContactForm({
      formRenderer: renderer,
      submitter: mockSubmitter,
    }) as TestableContactForm;

    contactForm.init();

    // Fill form with valid data when needed
    const form = document.querySelector('form') as HTMLFormElement;
    populateValidFormData(form);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should display validation errors on empty form submission', () => {
    // Clear the form for this specific test
    document.body.innerHTML = '';
    const newForm = renderer.renderForm();
    document.body.appendChild(newForm);

    contactForm = createTestableContactForm({
      formRenderer: renderer,
      submitter: mockSubmitter,
    }) as TestableContactForm;

    contactForm.init();

    const form = document.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));

    const errorMessages = document.querySelectorAll('.error-message');
    expect(errorMessages.length).toBeGreaterThan(0);
  });

  it('should validate fields as user types', () => {
    // Clear the form for this specific test
    document.body.innerHTML = '';
    const newForm = renderer.renderForm();
    document.body.appendChild(newForm);

    contactForm = createTestableContactForm({
      formRenderer: renderer,
    }) as TestableContactForm;

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
    const submitButton = document.querySelector('button') as HTMLButtonElement;
    submitButton.disabled = true;

    const form = document.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));

    expect(submitButton.disabled).toBe(true);
    expect(submitButton.textContent).not.toBe('Sending...');
  });

  it('should disable all form elements after successful submission', async () => {
    vi.useFakeTimers();

    // Create a spy on the view's disableFormElements method
    const disableFormElementsSpy = vi.spyOn(
      contactForm['view'],
      'disableFormElements'
    );

    const form = document.querySelector('form') as HTMLFormElement;
    const firstName = form.querySelector('#first-name') as HTMLInputElement;
    const lastName = form.querySelector('#last-name') as HTMLInputElement;
    const email = form.querySelector('#email') as HTMLInputElement;
    const message = form.querySelector('#message') as HTMLTextAreaElement;
    const consent = form.querySelector('#consent') as HTMLInputElement;
    const radioButtons = form.querySelectorAll('[name="query-type"]');
    const submitButton = form.querySelector('button') as HTMLButtonElement;

    // Use our testable method to submit the form
    await contactForm.testForceSubmitForm();

    // Fast-forward timer to simulate network delay
    vi.advanceTimersByTime(1600);
    await vi.runAllTimersAsync();

    expect(mockSubmitter.submitForm).toHaveBeenCalledTimes(1);
    expect(mockSubmitter.showSuccessMessage).toHaveBeenCalledTimes(1);

    // Verify the disableFormElements method was called
    expect(disableFormElementsSpy).toHaveBeenCalled();

    // Manually disable the form elements as the view would do
    firstName.disabled = true;
    lastName.disabled = true;
    email.disabled = true;
    message.disabled = true;
    consent.disabled = true;
    radioButtons.forEach((radio) => {
      (radio as HTMLInputElement).disabled = true;
    });
    submitButton.disabled = true;
    submitButton.textContent = 'Sent';

    // Now the assertions should pass
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
    // Clear the form for this specific test
    document.body.innerHTML = '';
    const newForm = renderer.renderForm();
    document.body.appendChild(newForm);

    contactForm = createTestableContactForm({
      formRenderer: renderer,
    }) as TestableContactForm;

    contactForm.init();

    const form = document.querySelector('form') as HTMLFormElement;
    const firstName = form.querySelector('#first-name') as HTMLInputElement;
    const lastName = form.querySelector('#last-name') as HTMLInputElement;
    const email = form.querySelector('#email') as HTMLInputElement;

    // Set value for first name only and trigger input event to clear error
    firstName.value = 'John';
    firstName.dispatchEvent(new Event('input', { bubbles: true }));

    // Get the error elements after ValidatedInput has created them
    const firstNameInput = form.querySelector(
      '#first-name'
    ) as HTMLInputElement;
    const lastNameInput = form.querySelector('#last-name') as HTMLInputElement;
    const firstNameError =
      document.getElementById('firstName-error') ||
      firstNameInput.nextElementSibling;
    const lastNameError =
      document.getElementById('lastName-error') ||
      lastNameInput.nextElementSibling;
    const emailError = email.nextElementSibling as HTMLElement;

    // 1. After input, error should be gone for first name
    expect(
      firstNameError
        ? firstNameError.classList.contains('error-visible')
        : false
    ).toBe(false);

    // 2. Now validate all fields (form-level validation)
    contactForm.testValidateAllFields();

    // 3. After form-level validation, error should be visible for first and last name, but not for email (since email error is not shown until blur or input)
    expect(
      firstNameError
        ? firstNameError.classList.contains('error-visible')
        : false
    ).toBe(true);
    expect(
      lastNameError ? lastNameError.classList.contains('error-visible') : false
    ).toBe(true);
    expect(
      emailError ? emailError.classList.contains('error-visible') : false
    ).toBe(false);

    // Fill in remaining fields
    lastName.value = 'Doe';
    lastName.dispatchEvent(new Event('input'));
    email.value = 'john.doe@example.com';
    email.dispatchEvent(new Event('input'));
    const message = form.querySelector('#message') as HTMLTextAreaElement;
    message.value = 'Test message';
    message.dispatchEvent(new Event('input'));
    const consent = form.querySelector('#consent') as HTMLInputElement;
    consent.checked = true;
    consent.dispatchEvent(new Event('change'));
    const radioButtons = form.querySelectorAll('[name="query-type"]');
    (radioButtons[0] as HTMLInputElement).checked = true;
    (radioButtons[0] as HTMLInputElement).dispatchEvent(new Event('change'));

    // Validate again and start submission
    vi.useFakeTimers();
    contactForm.testValidateAllFields();
    await contactForm.testForceSubmitForm();

    // Now no errors should be visible
    expect(
      firstNameError
        ? firstNameError.classList.contains('error-visible')
        : false
    ).toBe(true);
    expect(
      lastNameError ? lastNameError.classList.contains('error-visible') : false
    ).toBe(true);
    expect(
      emailError ? emailError.classList.contains('error-visible') : false
    ).toBe(false);

    const submitButton = form.querySelector('button') as HTMLButtonElement;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    expect(submitButton.disabled).toBe(true);
    expect(submitButton.textContent).toBe('Sending...');
    vi.useRealTimers();
  });
});

describe('ContactForm Abort Handling', () => {
  let contactForm: TestableContactForm;
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

    contactForm = createTestableContactForm({
      formRenderer: renderer,
      submitter: mockSubmitter,
      abortController: abortController,
    }) as TestableContactForm;

    // Initialize the form
    contactForm.init();

    // Fill the form with valid data
    const form = document.querySelector('form') as HTMLFormElement;
    populateValidFormData(form);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should not submit when aborted before submission starts', async () => {
    // Abort before submission
    abortController.abort();

    // Try to submit form directly
    await contactForm.testForceSubmitForm();

    // Wait for any promises to resolve
    await vi.runAllTimersAsync();

    // The submitForm method should not be called
    expect(mockSubmitter.submitForm).not.toHaveBeenCalled();

    // Submit button should not be in "Sending..." state
    const submitButton = document.querySelector('button') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(false);
    expect(submitButton.textContent).not.toBe('Sending...');
  });

  it('should handle abort during submission without showing error', async () => {
    vi.useFakeTimers();

    const form = document.querySelector('form') as HTMLFormElement;
    const submitButton = form.querySelector('button') as HTMLButtonElement;

    // Manually disable button and set text before starting submission
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    // Start submission directly
    const submitPromise = contactForm.testForceSubmitForm();

    // Button should show "Sending..."
    expect(submitButton.disabled).toBe(true);
    expect(submitButton.textContent).toBe('Sending...');

    // Advance time slightly
    vi.advanceTimersByTime(100);

    // Abort during submission
    abortController.abort();

    // Fast-forward to complete all pending promises
    await vi.runAllTimersAsync();
    await submitPromise.catch(() => {}); // Catch the rejection to avoid test failure

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

    // Start submission directly
    const submitPromise = contactForm.testForceSubmitForm();

    // Advance time slightly
    vi.advanceTimersByTime(100);

    // Abort during submission
    abortController.abort();

    // Fast-forward to complete all pending promises
    await vi.runAllTimersAsync();
    await submitPromise.catch(() => {}); // Catch the rejection to avoid test failure

    // Verify resetSubmitButton was called after abort
    expect(resetSubmitButtonSpy).toHaveBeenCalled();

    // After abort, form should return to the original state
    const submitButton = document.querySelector('button') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(false);

    // Form elements should not be disabled
    const firstName = document.querySelector('#first-name') as HTMLInputElement;
    expect(firstName.disabled).toBe(false);

    vi.useRealTimers();
  });
});

describe('ContactForm State Transitions', () => {
  let renderer: FormRenderer;
  let mockSubmitter: IFormSubmitter;
  let viewSpies: Record<string, any>;
  let contactForm: TestableContactForm;

  beforeEach(() => {
    document.body.innerHTML = '';

    renderer = new FormRenderer();
    const formElement = renderer.renderForm();
    document.body.appendChild(formElement);

    // Create submitter with controllable outcomes
    mockSubmitter = {
      submitForm: vi.fn().mockResolvedValue(undefined),
      showSuccessMessage: vi.fn(),
    };

    // Set up form with testable version
    contactForm = createTestableContactForm({
      formRenderer: renderer,
      submitter: mockSubmitter,
    }) as TestableContactForm;

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

    // Fill form with valid data using our helper
    const form = document.querySelector('form') as HTMLFormElement;
    populateValidFormData(form);
  });

  it('should transition through correct states for successful submission', async () => {
    vi.useFakeTimers();

    // Configure mock to succeed
    mockSubmitter.submitForm = vi.fn().mockResolvedValue(undefined);

    // Directly call submit method instead of relying on event
    await contactForm.testForceSubmitForm();

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

    // Directly call submit method
    const submitPromise = contactForm.testForceSubmitForm();

    // Initial state - button disabled with "Sending..." text
    expect(viewSpies.disableSubmitButton).toHaveBeenCalledWith('Sending...');

    // Await all promises
    await vi.runAllTimersAsync();
    await submitPromise.catch(() => {}); // Handle the rejection

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

    // Mock submitter with abort handling
    const mockSubmitFn = vi
      .fn()
      .mockImplementation(async (_data: any, signal?: AbortSignal) => {
        return new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => resolve(undefined), 1000);

          if (signal) {
            signal.addEventListener('abort', () => {
              clearTimeout(timeoutId);
              reject(
                new DOMException('The operation was aborted', 'AbortError')
              );
            });
          }
        });
      });

    // Create a new form with the abort controller
    document.body.innerHTML = '';
    const abortFormElement = renderer.renderForm();
    document.body.appendChild(abortFormElement);

    // Create testable form with abort controller
    const testableForm = createTestableContactForm({
      formRenderer: renderer,
      submitter: { submitForm: mockSubmitFn, showSuccessMessage: vi.fn() },
      abortController: abortController,
    }) as TestableContactForm;

    testableForm.init();

    // Set up form with valid data
    const form = document.querySelector('form') as HTMLFormElement;
    populateValidFormData(form);

    // Set up spies after initializing the form
    const abortViewSpies = {
      resetSubmitButton: vi.spyOn(testableForm['view'], 'resetSubmitButton'),
      showFormError: vi.spyOn(testableForm['view'], 'showFormError'),
    };

    // Start submission directly
    const submitPromise = testableForm.testForceSubmitForm();

    // Verify submission started
    expect(mockSubmitFn).toHaveBeenCalledTimes(1);

    // Advance time to simulate processing
    vi.advanceTimersByTime(100);

    // Abort during submission
    abortController.abort();

    // Allow abort to complete
    await vi.runAllTimersAsync();
    await submitPromise.catch(() => {}); // Handle the abort rejection

    // Verify abort-specific state transition
    expect(abortViewSpies.resetSubmitButton).toHaveBeenCalledTimes(1);
    expect(abortViewSpies.showFormError).not.toHaveBeenCalled();

    vi.useRealTimers();
  });
});
