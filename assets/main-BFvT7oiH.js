var e=Object.defineProperty,t=(t,s,r)=>((t,s,r)=>s in t?e(t,s,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[s]=r)(t,"symbol"!=typeof s?s+"":s,r);import{T as s,p as r,v as n}from"./vendor-DtqsyKpb.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const s of e)if("childList"===s.type)for(const e of s.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?t.credentials="include":"anonymous"===e.crossOrigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();class i{static getElement(e,t={throwIfNotFound:!0}){let s=null,r="";if("string"==typeof e)s=document.querySelector(e),r=`Element not found: ${e}`;else if("id"in e)s=document.getElementById(e.id),r=`Element not found with ID: ${e.id}`;else if("form"in e&&"name"in e){s=e.form.elements.namedItem(e.name),r=`Element not found with name: ${e.name} in form`}if(!s&&t.throwIfNotFound)throw new Error(t.errorMessage||r);return s}static getElements(e,t={throwIfNotFound:!1}){const s=Array.from(document.querySelectorAll(e));if(0===s.length&&t.throwIfNotFound)throw new Error(t.errorMessage||`No elements found: ${e}`);return s}static getElementById(e,t={throwIfNotFound:!1}){return this.getElement({id:e},t)}static getElementByName(e,t,s={throwIfNotFound:!1}){return this.getElement({form:e,name:t},s)}static getErrorContainer(e,t){return"queryType"===e?document.querySelector(".radio-group"):t}static addEventListener(e,t,s,r){e.addEventListener(t,s,{signal:r})}static removeEventListener(e,t,s){e.removeEventListener(t,s)}static showError(e,t){this.setAriaInvalid(e,!!t);const s=this.findErrorElement(e);s&&this.updateErrorElement(s,t)}static setAriaInvalid(e,t){const s=t?"true":"false";if(e.classList.contains("radio-group")||e.classList.contains("checkbox-container")){e.querySelectorAll("input").forEach((e=>e.setAttribute("aria-invalid",s)))}else e.setAttribute("aria-invalid",s)}static findErrorElement(e){const t=e.getAttribute("aria-describedby");if(t)return this.getElementById(t);if(e.classList.contains("radio-group")||e.classList.contains("checkbox-container")){const t=e.querySelector(".error-message");if(t)return t}const s=e.closest(".form-field")||e.parentElement;return s&&s.querySelector(".error-message")||null}static setElementVisibility(e,t,s="block",r=!1,n="visible",i="hidden"){e.style.display=t?s:"none",e.setAttribute("aria-hidden",t?"false":"true"),r&&(t?(e.classList.add(n),e.classList.remove(i)):(e.classList.remove(n),e.classList.add(i)))}static disableElement(e,t=!0){(e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement||e instanceof HTMLButtonElement)&&(e.disabled=t)}static disableRadioGroup(e,t=!0){Array.from(e).forEach((e=>{if(e instanceof HTMLInputElement){e.disabled=t;const s=e.closest(".radio-option");s&&(t?s.classList.add("disabled"):s.classList.remove("disabled"))}}));const s=document.querySelector(".radio-group");s&&(t?s.classList.add("disabled"):s.classList.remove("disabled"))}static updateErrorElement(e,t){e.textContent=t,e.style.display=t?"block":"none",e.setAttribute("aria-hidden",t?"false":"true"),t?(e.classList.add("error-visible"),e.classList.remove("error-hidden")):(e.classList.remove("error-visible"),e.classList.add("error-hidden"))}static debounce(e,t,s={}){let r;return function(...n){const i=this;if(s.immediate)return void e.apply(i,n);clearTimeout(r),r=window.setTimeout((function(){r=void 0,e.apply(i,n)}),t)}}}class a{constructor(){t(this,"activeErrors",new Map)}showError(e,t,s="default"){i.showError(e,t),t?this.trackError(e,s):this.clearError(e,s)}trackError(e,t){var s;this.activeErrors.has(t)||this.activeErrors.set(t,new Set),null==(s=this.activeErrors.get(t))||s.add(e)}clearError(e,t){const s=this.activeErrors.get(t);s&&(s.delete(e),0===s.size&&this.activeErrors.delete(t))}clearErrorGroup(e){const t=this.activeErrors.get(e);t&&(t.forEach((e=>{i.showError(e,"")})),this.activeErrors.delete(e))}clearAllErrors(){for(const e of this.activeErrors.keys())this.clearErrorGroup(e)}hasErrors(e="default"){const t=this.activeErrors.get(e);return!!t&&t.size>0}getErrorCount(e="default"){var t;return(null==(t=this.activeErrors.get(e))?void 0:t.size)||0}}class o{renderForm(){return document.body.innerHTML='\n      <main class="container">\n        <form id="contact-form" class="contact-form" novalidate aria-label="Contact form">\n          <h1>Contact Us</h1>\n\n          <div class="name-fields-container">\n            <div class="form-group">\n              <label class="form-label" for="first-name">\n                <span class="label-text">First Name&nbsp;</span>\n                <span class="required" aria-hidden="true">*</span>\n              </label>\n              <input\n                type="text"\n                id="first-name"\n                name="first-name"\n                aria-required="true"\n                aria-describedby="first-name-error"\n              >\n              <span id="first-name-error" class="error-message" role="alert"></span>\n            </div>\n\n            <div class="form-group">\n              <label class="form-label" for="last-name">\n                <span class="label-text">Last Name&nbsp;</span>\n                <span class="required" aria-hidden="true">*</span>\n              </label>\n              <input\n                type="text"\n                id="last-name"\n                name="last-name"\n                aria-required="true"\n                aria-describedby="last-name-error"\n              >\n              <span id="last-name-error" class="error-message" role="alert"></span>\n            </div>\n          </div>\n\n          <div class="form-group">\n            <label class="form-label" for="email">\n              <span class="label-text">Email Address&nbsp;</span>\n              <span class="required" aria-hidden="true">*</span>\n            </label>\n            <input\n              type="email"\n              id="email"\n              name="email"\n              aria-required="true"\n              aria-describedby="email-error"\n            >\n            <span id="email-error" class="error-message" role="alert"></span>\n          </div>\n\n          <div class="form-group">\n            <fieldset class="radio-group" aria-describedby="query-type-error">\n              <legend id="label-legend">\n                <span class="label-text" id="query-type-label">Query Type&nbsp;</span>\n                <span class="required" aria-hidden="true">*</span>\n              </legend>\n              <div class="radio-options-container">\n                <div class="radio-option" id="radio-option-general">\n                  <input\n                    type="radio"\n                    id="query-general"\n                    name="query-type"\n                    value="general"\n                    aria-required="true"\n                    aria-describedby="query-type-error"\n                  >\n                  <label for="query-general">General Enquiry</label>\n                </div>\n                <div class="radio-option" id="radio-option-support">\n                  <input\n                    type="radio"\n                    id="query-support"\n                    name="query-type"\n                    value="support"\n                    aria-required="true"\n                    aria-describedby="query-type-error"\n                  >\n                  <label for="query-support">Support Request</label>\n                </div>\n              </div>\n              <span id="query-type-error" class="error-message" role="alert"></span>\n            </fieldset>\n          </div>\n\n          <div class="form-group">\n            <label class="form-label" for="message">\n              <span class="label-text">Message&nbsp;</span>\n              <span class="required" aria-hidden="true">*</span>\n            </label>\n            <textarea\n              id="message"\n              name="message"\n              aria-required="true"\n              aria-describedby="message-error"\n            ></textarea>\n            <span id="message-error" class="error-message" role="alert"></span>\n          </div>\n\n          <div class="form-group">\n            <div class="checkbox-container" role="group" aria-describedby="consent-error">\n              <input\n                type="checkbox"\n                id="consent"\n                name="consent"\n                aria-required="true"\n                aria-describedby="consent-error"\n              >\n              <label for="consent">\n                <span class="label-text">I consent to being contacted by the team&nbsp;</span>\n                <span class="required" aria-hidden="true">*</span>\n              </label>\n              <span id="consent-error" class="error-message" role="alert"></span>\n            </div>\n          </div>\n\n          <button type="submit" aria-label="Submit contact form">Submit</button>\n        </form>\n      </main>\n    ',document.querySelector(".contact-form")}}var l={};class c{constructor(e){t(this,"toastService"),t(this,"apiUrl"),this.toastService=e,this.apiUrl="undefined"!=typeof process&&l&&l.TS_APP_API_URL||"http://localhost:3001/api/submissions"}formatFormData(e){const t=["firstName","lastName","email","message"];for(const s of t)if(!(s in e)||""===e[s].trim())throw new Error(`Missing required field: ${s}`);return{submission:{...e,timestamp:(new Date).toISOString()}}}async submitForm(e,t){try{const s=this.formatFormData(e);await new Promise(((e,r)=>{const n=setTimeout((async()=>{try{const r=await fetch(this.apiUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s),signal:t});if(!r.ok){const e=await r.text();throw new Error(`API error: ${r.status} - ${e}`)}await r.json().catch((()=>({})));e(null)}catch(n){r(n)}}),1500);t&&t.addEventListener("abort",(()=>{clearTimeout(n),r(new DOMException("Form submission aborted","AbortError"))}))}))}catch(s){throw s}}showSuccessMessage(){this.toastService.showFormSubmissionSuccess("Message Sent!","Thanks for completing the form. We'll be in touch soon!")}}class d{showSuccess(e){s({text:e,duration:5e3,gravity:"top",position:"center",avatar:"data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='20'%20height='21'%20fill='none'%20viewBox='0%200%2020%2021'%3e%3cpath%20fill='%23fff'%20d='M14.28%207.72a.748.748%200%200%201%200%201.06l-5.25%205.25a.748.748%200%200%201-1.06%200l-2.25-2.25a.75.75%200%201%201%201.06-1.06l1.72%201.72%204.72-4.72a.75.75%200%200%201%201.06%200Zm5.47%202.78A9.75%209.75%200%201%201%2010%20.75a9.76%209.76%200%200%201%209.75%209.75Zm-1.5%200A8.25%208.25%200%201%200%2010%2018.75a8.26%208.26%200%200%200%208.25-8.25Z'/%3e%3c/svg%3e",className:"toast-success",escapeMarkup:!1,stopOnFocus:!0,style:{background:"hsl(187, 24%, 22%)",color:"hsl(0, 0%, 100%)",boxShadow:"0 10px 30px rgba(33, 33, 33, 0.1)",borderRadius:"4px",fontFamily:"Karla, sans-serif",top:"16px"},offset:{x:0,y:16}}).showToast()}showFormSubmissionSuccess(e,t){const s=`\n      <div class="toast-success-wrapper">\n        <strong>${e}</strong>\n        <div class="toast-success-content">\n          ${t}\n        </div>\n      </div>\n    `;this.showSuccess(s)}}class m{validateField(e,t){let s=!0,i="";switch(e){case"firstName":case"lastName":case"message":s=r.sanitize(t.value.trim()).length>0,i=s?"":"This field is required";break;case"email":const e=r.sanitize(t.value);e.trim()?(s=n.isEmail(e),i=s?"":"Please enter a valid email address"):(s=!1,i="This field is required");break;case"queryType":s=""!==r.sanitize(t.value),i=s?"":"Please select a query type";break;case"consent":s=t.checked,i=s?"":"To submit this form, please consent to being contacted"}return{isValid:s,errorMessage:i}}}const u="input",h="blur",b="change",p="submit",f="first-name",v="last-name",E="email",g="message",y="consent",w="query-type",F="Submit";class L{constructor(e,s,r){t(this,"form"),t(this,"elements"),t(this,"submitButton"),t(this,"formRenderer"),t(this,"errorHandler"),t(this,"abortController"),t(this,"currentFormElements",new Set),t(this,"isActive",!1),t(this,"elementToFieldNameMap",new Map),this.formRenderer=e,this.errorHandler=s,this.abortController=r||new AbortController}isExternalController(){var e;return(null==(e=this.abortController)?void 0:e.signal)&&!this.abortController.signal.aborted}createForm(){return this.form=this.formRenderer.renderForm(),this.setupElements(),this.setInitialFocus(),this.isActive=!0,this.form}setupElements(){this.initializeFormElements(),this.initializeSubmitButton(),this.trackCurrentFormElements(),this.buildElementFieldNameMap()}initializeFormElements(){this.elements={firstName:i.getElementById(f),lastName:i.getElementById(v),email:i.getElementById(E),queryType:i.getElementByName(this.form,w),message:i.getElementById(g),consent:i.getElementById(y)}}initializeSubmitButton(){this.submitButton=this.form.querySelector("button")}trackCurrentFormElements(){this.currentFormElements.clear(),Object.values(this.elements).forEach((e=>{e instanceof HTMLElement?this.currentFormElements.add(e):e instanceof RadioNodeList&&Array.from(e).forEach((e=>{e instanceof HTMLElement&&this.currentFormElements.add(e)}))}))}buildElementFieldNameMap(){this.elementToFieldNameMap.clear(),Object.entries(this.elements).forEach((([e,t])=>{t instanceof HTMLElement?this.elementToFieldNameMap.set(t,e):t instanceof RadioNodeList&&Array.from(t).forEach((t=>{t instanceof HTMLElement&&this.elementToFieldNameMap.set(t,e)}))}))}setInitialFocus(){this.elements.firstName&&this.elements.firstName.focus()}setupEventListeners(e,t){this.addSubmitEventListener(e),this.setupEventDelegation(t),this.setupDirectEventListeners(t)}addSubmitEventListener(e){this.form.addEventListener(p,e,{signal:this.abortController.signal})}createDebouncedHandler(e){const t="undefined"!=typeof process&&!1;return i.debounce(e,300,{immediate:t})}setupEventDelegation(e){const t=this.createDebouncedHandler((t=>this.handleDelegatedEvent(t,e)));this.form.addEventListener(u,t,{signal:this.abortController.signal}),this.form.addEventListener(h,(t=>this.handleDelegatedEvent(t,e)),{signal:this.abortController.signal,capture:!0}),this.form.addEventListener(b,(t=>this.handleDelegatedEvent(t,e)),{signal:this.abortController.signal})}setupDirectEventListeners(e){Object.entries(this.elements).forEach((([t,s])=>{if("queryType"===t&&s instanceof RadioNodeList)Array.from(s).forEach((s=>{s instanceof HTMLInputElement&&s.addEventListener(b,(()=>{this.isActive&&e(t)}),{signal:this.abortController.signal})}));else if(s instanceof HTMLInputElement||s instanceof HTMLTextAreaElement){const r=this.createDebouncedHandler((()=>{this.isActive&&e(t)}));s.addEventListener(u,r,{signal:this.abortController.signal}),s.addEventListener(h,(()=>{this.isActive&&e(t)}),{signal:this.abortController.signal})}}))}handleDelegatedEvent(e,t){if(!this.isActive)return;const s=e.target;if(!s||!(s instanceof HTMLInputElement||s instanceof HTMLTextAreaElement||s instanceof HTMLSelectElement)||!this.currentFormElements.has(s))return;const r=this.getFieldNameFromElement(s);r&&t(r)}getFieldNameFromElement(e){return this.elementToFieldNameMap.get(e)||null}getFormElements(){return this.elements}getForm(){return this.form}getSubmitButton(){return this.submitButton}getAbortSignal(){return this.abortController.signal}showFieldError(e,t){const s=this.elements[e],r=i.getErrorContainer(e,s);r&&this.errorHandler.showError(r,t)}disableSubmitButton(e){this.submitButton.disabled=!0,this.submitButton.textContent=e}resetSubmitButton(){this.submitButton.disabled=!1,this.submitButton.textContent=F}disableFormElements(){Object.values(this.elements).forEach((e=>{e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement?i.disableElement(e,!0):e instanceof RadioNodeList&&i.disableRadioGroup(e,!0)}))}resetForm(){this.form.reset()}showFormError(e){this.errorHandler.showError(this.form,e)}cleanup(){this.isActive=!1,this.currentFormElements.clear(),this.elementToFieldNameMap.clear(),this.abortController&&"function"==typeof this.abortController.abort&&this.abortController.abort(),this.isExternalController()||(this.abortController=new AbortController)}}class S{constructor(e,s,r){t(this,"view"),t(this,"validator"),t(this,"submitter"),t(this,"elements"),this.validator=e,this.submitter=s,this.view=r}cleanup(){this.view.cleanup()}init(){try{this.view.createForm(),this.elements=this.view.getFormElements();const e=e=>this.handleSubmit(e),t=e=>this.validateField(e);this.view.setupEventListeners(e,t)}catch(e){throw e}}validateField(e){const t=this.elements[e],{isValid:s,errorMessage:r}=this.validator.validateField(e,t);return this.view.showFieldError(e,s?"":r),s}async handleSubmit(e){e.preventDefault(),this.view.getSubmitButton().disabled||this.validateAllFields()&&await this.submitForm()}validateAllFields(){let e=!0;return Object.keys(this.elements).forEach((t=>{const s=t;this.validateField(s)||(e=!1)})),e}async submitForm(){const e=this.view.getAbortSignal();if(!(null==e?void 0:e.aborted)){this.view.disableSubmitButton("Sending...");try{const t=this.collectFormData();await this.submitter.submitForm(t,e),this.handleSuccessfulSubmission()}catch(t){this.handleSubmissionError(t)}}}handleSubmissionError(e){e instanceof DOMException&&"AbortError"===e.name?this.view.resetSubmitButton():this.handleFailedSubmission(e)}collectFormData(){return{firstName:r.sanitize(this.elements.firstName.value),lastName:r.sanitize(this.elements.lastName.value),email:r.sanitize(this.elements.email.value),queryType:r.sanitize(this.elements.queryType.value),message:r.sanitize(this.elements.message.value),consent:this.elements.consent.checked}}handleSuccessfulSubmission(){this.submitter.showSuccessMessage(),this.view.disableFormElements(),this.view.resetForm(),this.view.disableSubmitButton("Sent")}handleFailedSubmission(e){Error,this.view.showFormError("Failed to send message. Please try again."),this.view.resetSubmitButton()}}class q{static create(e={}){const t=e.validator||new m,s=e.toastService||new d,r=e.errorHandler||new a,n=e.formRenderer||new o,i=e.view||new L(n,r,e.abortController),l=e.submitter||new c(s);return new S(t,l,i)}}const T=class e{constructor(){t(this,"contactForm",null)}static getInstance(){return e.instance||(e.instance=new e),e.instance}init(){this.cleanup(),this.contactForm=q.create(),this.contactForm.init(),this.setupUnloadCleanup()}cleanup(){this.contactForm&&(this.contactForm.cleanup(),this.contactForm=null)}setupUnloadCleanup(){window.addEventListener("beforeunload",(()=>{this.cleanup()}))}};t(T,"instance",null);let M=T;document.addEventListener("DOMContentLoaded",(()=>{M.getInstance().init()}));
