'use strict';

import { IFormRenderer } from '../../interfaces/form-interfaces';

export class FormRenderer implements IFormRenderer {
  renderForm(): HTMLFormElement {
    // Find the app container or create one if it doesn't exist
    let appContainer = document.getElementById('app');
    if (!appContainer) {
      appContainer = document.createElement('div');
      appContainer.id = 'app';
      document.body.appendChild(appContainer);
    }

    // Clear the container before adding the form
    appContainer.innerHTML = '';

    // Create a container for the form
    const formContainer = document.createElement('main');
    formContainer.className = 'container';

    // Add the form HTML
    formContainer.innerHTML = `
      <form id="contact-form" class="contact-form" novalidate aria-label="Contact form">
        <h1>Contact Us</h1>

        <div class="name-fields-container">
          <div class="form-group">
            <label class="form-label" for="first-name">
              <span class="label-text">First Name&nbsp;</span>
              <span class="required" aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id="first-name"
              name="first-name"
              aria-required="true"
              aria-describedby="firstName-error"
            >
          </div>

          <div class="form-group">
            <label class="form-label" for="last-name">
              <span class="label-text">Last Name&nbsp;</span>
              <span class="required" aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id="last-name"
              name="last-name"
              aria-required="true"
              aria-describedby="lastName-error"
            >
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="email">
            <span class="label-text">Email Address&nbsp;</span>
            <span class="required" aria-hidden="true">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            aria-required="true"
            aria-describedby="email-error"
          >
        </div>

        <div class="form-group">
          <fieldset class="radio-group" aria-describedby="query-type-error">
            <legend id="label-legend">
              <span class="label-text" id="query-type-label">Query Type&nbsp;</span>
              <span class="required" aria-hidden="true">*</span>
            </legend>
            <div class="radio-options-container">
              <div class="radio-option" id="radio-option-general">
                <input
                  type="radio"
                  id="query-general"
                  name="query-type"
                  value="general"
                  aria-required="true"
                  aria-describedby="query-type-error"
                >
                <label for="query-general">General Enquiry</label>
              </div>
              <div class="radio-option" id="radio-option-support">
                <input
                  type="radio"
                  id="query-support"
                  name="query-type"
                  value="support"
                  aria-required="true"
                  aria-describedby="query-type-error"
                >
                <label for="query-support">Support Request</label>
              </div>
            </div>
            <span id="query-type-error" class="error-message" role="alert"></span>
          </fieldset>
        </div>

        <div class="form-group">
          <label class="form-label" for="message">
            <span class="label-text">Message&nbsp;</span>
            <span class="required" aria-hidden="true">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            aria-required="true"
            aria-describedby="message-error"
          ></textarea>
        </div>

        <div class="form-group">
          <div class="checkbox-container" role="group" aria-describedby="consent-error">
            <input
              type="checkbox"
              id="consent"
              name="consent"
              aria-required="true"
              aria-describedby="consent-error"
            >
            <label for="consent">
              <span class="label-text">I consent to being contacted by the team&nbsp;</span>
              <span class="required" aria-hidden="true">*</span>
            </label>
            <span id="consent-error" class="error-message" role="alert"></span>
          </div>
        </div>

        <button type="submit" aria-label="Submit contact form">Submit</button>
      </form>
    `;

    // Add the form to the container
    appContainer.appendChild(formContainer);

    // Return the form element
    return document.getElementById('contact-form') as HTMLFormElement;
  }
}
