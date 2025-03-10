import {
  MockInstance,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { ContactForm, ContactFormFactory } from '../main';
import { FormRenderer } from '../services/form-handling/form-renderer';

type TestableContactForm = ContactForm & {
  validateField: (fieldName: string) => boolean;
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
  let renderer: FormRenderer;
  let abortController: AbortController;

  beforeEach(() => {
    document.body.innerHTML = '';

    // Create a mocked AbortController for each test
    abortController = {
      signal: new AbortController().signal,
      abort: vi.fn(),
    } as unknown as AbortController;

    renderer = new FormRenderer();
    formElement = renderer.renderForm();
    document.body.appendChild(formElement);

    contactForm = ContactFormFactory.create({
      formRenderer: renderer,
      abortController: abortController,
    });
    testableForm = contactForm as unknown as TestableContactForm;

    validateFieldSpy = vi.spyOn(testableForm, 'validateField');

    contactForm.init();

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

    expect(abortController.abort).toHaveBeenCalledTimes(1);

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
    contactForm.cleanup();
    expect(abortController.abort).toHaveBeenCalledTimes(1);
  });
});
