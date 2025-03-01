import {
  MockInstance,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { ContactForm } from '../main';
import { FormRenderer } from '../services/form-renderer';

type TestableContactForm = ContactForm & {
  validateField: (fieldName: string) => boolean;
  abortController: AbortController;
};

type ValidateFieldSpy = MockInstance<[fieldName: string], boolean>;

describe('ContactForm Cleanup', () => {
  let contactForm: ContactForm;
  let testableForm: TestableContactForm;
  let formElement: HTMLFormElement;
  let firstNameInput: HTMLInputElement;
  let lastNameInput: HTMLInputElement;
  let emailInput: HTMLInputElement;
  let validateFieldSpy: ValidateFieldSpy;

  beforeEach(() => {
    // Clear DOM and set up the form
    document.body.innerHTML = '';
    const renderer = new FormRenderer();
    formElement = renderer.renderForm();
    document.body.appendChild(formElement);

    // Create the ContactForm instance
    contactForm = new ContactForm();
    testableForm = contactForm as unknown as TestableContactForm;

    // Set up spy on validateField
    validateFieldSpy = vi.spyOn(testableForm, 'validateField');

    // Initialize the form
    contactForm.init();

    // Get references to form elements
    firstNameInput = document.getElementById('first-name') as HTMLInputElement;
    lastNameInput = document.getElementById('last-name') as HTMLInputElement;
    emailInput = document.getElementById('email') as HTMLInputElement;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should cleanup event listeners when abort is called', async () => {
    firstNameInput.dispatchEvent(new Event('input'));
    expect(validateFieldSpy).toHaveBeenCalledTimes(1);
    validateFieldSpy.mockClear();

    contactForm.cleanup();

    // Small delay to ensure abort signal propagates in test environment
    await vi.runAllTimersAsync();

    // Create a new spy to ensure we're capturing after cleanup
    const newValidateFieldSpy: ValidateFieldSpy = vi.spyOn(
      testableForm,
      'validateField'
    );

    // Events should no longer trigger callbacks
    firstNameInput.dispatchEvent(new Event('input'));
    lastNameInput.dispatchEvent(new Event('input'));
    emailInput.dispatchEvent(new Event('input'));

    expect(newValidateFieldSpy).not.toHaveBeenCalled();
  });

  it('should allow reinitialization after cleanup', async () => {
    contactForm.cleanup();
    validateFieldSpy.mockClear();

    // Create new form and reinitialize
    document.body.innerHTML = '';
    const renderer = new FormRenderer();
    const newFormElement = renderer.renderForm();
    document.body.appendChild(newFormElement);

    contactForm.init();

    // Get fresh reference after reinitialization
    const newFirstNameInput = document.getElementById(
      'first-name'
    ) as HTMLInputElement;

    // Run timers and dispatch event
    await vi.runAllTimersAsync();
    newFirstNameInput.dispatchEvent(new Event('input'));
    await vi.runAllTimersAsync();

    expect(validateFieldSpy).toHaveBeenCalledTimes(1);
  }, 10000);

  it('should create a new AbortController after cleanup', () => {
    const originalController = testableForm.abortController;

    const abortSpy = vi.spyOn(originalController, 'abort');

    contactForm.cleanup();

    expect(abortSpy).toHaveBeenCalledTimes(1);

    // The controller should be different after cleanup
    expect(testableForm.abortController).not.toBe(originalController);
  });

  it('should not respond to events from previous initialization after reinitialization', () => {
    const firstInput = firstNameInput.cloneNode(true) as HTMLInputElement;
    document.body.appendChild(firstInput);

    // Clean up and reinitialize with new DOM
    contactForm.cleanup();
    validateFieldSpy.mockClear();

    // Create a new form and add to DOM
    document.body.innerHTML = '';
    const renderer = new FormRenderer();
    const newFormElement = renderer.renderForm();
    document.body.appendChild(newFormElement);

    // Reinitialize with the new form
    contactForm.init();

    // Events on old elements should not trigger callbacks
    firstInput.dispatchEvent(new Event('input'));
    expect(validateFieldSpy).not.toHaveBeenCalled();

    // Events on new elements should work
    const newFirstNameInput = document.getElementById(
      'first-name'
    ) as HTMLInputElement;
    newFirstNameInput.dispatchEvent(new Event('input'));
    expect(validateFieldSpy).toHaveBeenCalledTimes(1);
  });

  it('should properly abort the controller when cleanup is called', () => {
    const mockAbortController = {
      signal: new AbortController().signal,
      abort: vi.fn<[], void>(),
    };

    testableForm.abortController = mockAbortController;

    contactForm.cleanup();

    expect(mockAbortController.abort).toHaveBeenCalledTimes(1);
  });
});
