'use strict';

export class FormRenderer {
  renderForm(): HTMLFormElement {
    document.body.innerHTML = `
      <main class="container">
        <form id="contact-form" class="contact-form" novalidate aria-label="Contact form">
          <h1>Contact Us</h1>

          <div class="form-group">
            <label for="first-name">
              <span class="label-text">First Name&nbsp;</span>
              <span class="required" aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id="first-name"
              name="first-name"
              aria-required="true"
              aria-describedby="first-name-error"
            >
            <span id="first-name-error" class="error-message" role="alert"></span>
          </div>

          <div class="form-group">
            <label for="last-name">
              <span class="label-text">Last Name&nbsp;</span>
              <span class="required" aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id="last-name"
              name="last-name"
              aria-required="true"
              aria-describedby="last-name-error"
            >
            <span id="last-name-error" class="error-message" role="alert"></span>
          </div>

          <div class="form-group">
            <label for="email">
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
            <span id="email-error" class="error-message" role="alert"></span>
          </div>

          <div class="form-group">
            <fieldset class="radio-group">
              <legend id="label-legend">
                <span class="label-text" id="query-type-label">Query Type&nbsp;</span>
                <span class="required" aria-hidden="true">*</span>
              </legend>
              <div class="radio-option" id="radio-option-general">
                <input
                  type="radio"
                  id="query-general"
                  name="query-type"
                  value="general"
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
                  aria-describedby="query-type-error"
                >
                <label for="query-support">Support Request</label>
              </div>
              <span id="query-type-error" class="error-message" role="alert"></span>
            </fieldset>
          </div>

          <div class="form-group">
            <label for="message">
              <span class="label-text">Message&nbsp;</span>
              <span class="required" aria-hidden="true">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              aria-required="true"
              aria-describedby="message-error"
            ></textarea>
            <span id="message-error" class="error-message" role="alert"></span>
          </div>

          <div class="form-group">
            <div class="checkbox-container" role="group">
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

          <button type="submit">Submit</button>
        </form>
      </main>
    `;

    return document.querySelector('.contact-form') as HTMLFormElement;
  }
}
