var e=Object.defineProperty,t=(t,n,s)=>((t,n,s)=>n in t?e(t,n,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[n]=s)(t,"symbol"!=typeof n?n+"":n,s);import{T as n,p as s,v as i}from"./vendor-n-WUl7CN.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const n of e)if("childList"===n.type)for(const e of n.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?t.credentials="include":"anonymous"===e.crossOrigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();const r={storeAuthData(e){sessionStorage.setItem("auth_user",JSON.stringify(e)),sessionStorage.setItem("auth_timestamp",Date.now().toString())},getAuthData(){const e=sessionStorage.getItem("auth_user");return e?JSON.parse(e):null},isAuthenticated(){return!!this.getAuthData()},clearAuthData(){sessionStorage.removeItem("auth_user"),sessionStorage.removeItem("auth_timestamp")}};class a{static getElement(e,t={throwIfNotFound:!0}){let n=null,s="";if("string"==typeof e)n=document.querySelector(e),s=`Element not found: ${e}`;else if("id"in e)n=document.getElementById(e.id),s=`Element not found with ID: ${e.id}`;else if("form"in e&&"name"in e){n=e.form.elements.namedItem(e.name),s=`Element not found with name: ${e.name} in form`}if(!n&&t.throwIfNotFound)throw new Error(t.errorMessage||s);return n}static getElements(e,t={throwIfNotFound:!1}){const n=Array.from(document.querySelectorAll(e));if(0===n.length&&t.throwIfNotFound)throw new Error(t.errorMessage||`No elements found: ${e}`);return n}static getElementById(e,t={throwIfNotFound:!1}){return this.getElement({id:e},t)}static getElementByName(e,t,n={throwIfNotFound:!1}){return this.getElement({form:e,name:t},n)}static getErrorContainer(e,t){return"queryType"===e?document.querySelector(".radio-group"):t}static addEventListener(e,t,n,s){e.addEventListener(t,n,{signal:s})}static removeEventListener(e,t,n){e.removeEventListener(t,n)}static showError(e,t){this.setAriaInvalid(e,!!t);const n=this.findErrorElement(e);n&&this.updateErrorElement(n,t)}static setAriaInvalid(e,t){const n=t?"true":"false";if(e.classList.contains("radio-group")||e.classList.contains("checkbox-container")){e.querySelectorAll("input").forEach((e=>e.setAttribute("aria-invalid",n)))}else e.setAttribute("aria-invalid",n)}static findErrorElement(e){const t=e.getAttribute("aria-describedby");if(t)return this.getElementById(t);if(e.classList.contains("radio-group")||e.classList.contains("checkbox-container")){const t=e.querySelector(".error-message");if(t)return t}const n=e.closest(".form-field")||e.parentElement;return n&&n.querySelector(".error-message")||null}static setElementVisibility(e,t,n="block",s=!1,i="visible",r="hidden"){e.style.display=t?n:"none",e.setAttribute("aria-hidden",t?"false":"true"),s&&(t?(e.classList.add(i),e.classList.remove(r)):(e.classList.remove(i),e.classList.add(r)))}static disableElement(e,t=!0){(e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement||e instanceof HTMLButtonElement)&&(e.disabled=t)}static disableRadioGroup(e,t=!0){Array.from(e).forEach((e=>{if(e instanceof HTMLInputElement){e.disabled=t;const n=e.closest(".radio-option");n&&(t?n.classList.add("disabled"):n.classList.remove("disabled"))}}));const n=document.querySelector(".radio-group");n&&(t?n.classList.add("disabled"):n.classList.remove("disabled"))}static updateErrorElement(e,t){e.textContent=t,e.style.display=t?"block":"none",e.setAttribute("aria-hidden",t?"false":"true"),t?(e.classList.add("error-visible"),e.classList.remove("error-hidden")):(e.classList.remove("error-visible"),e.classList.add("error-hidden"))}static debounce(e,t,n={}){let s;return function(...i){const r=this;if(n.immediate)return void e.apply(r,i);clearTimeout(s),s=window.setTimeout((function(){s=void 0,e.apply(r,i)}),t)}}static escapeHTML(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}}const o=class e{constructor(){t(this,"routes"),t(this,"currentPath","/"),t(this,"isPopStateHandling",!1),this.routes=new Map,this.setupRoutes(),this.initializeHistoryState(),window.addEventListener("popstate",(async e=>{this.isPopStateHandling=!0;try{const e=window.location.pathname;window.history.state;if(e.startsWith("/api/"))return void(this.isPopStateHandling=!1);const t=this.mapPathToRoute(e);if(this.currentPath=t,"/contact-form"===t){const e=q.getInstance();if(e.cleanup(),e.getAppContainer()){const e=new Event("showContactForm");document.dispatchEvent(e)}}else if("/welcome"===t){const e=q.getInstance();e.cleanup(),e.showAuthenticatedWelcome()}else{const e=q.getInstance();e.cleanup();const t=document.getElementById("app");if(t&&(t.innerHTML="",e.getAppContainer()!==t)){const e=document.createElement("div");e.id="app",document.body.appendChild(e)}window.setTimeout((()=>e.init()),0)}}finally{this.isPopStateHandling=!1}})),this.handleInitialRoute()}static getInstance(){return e.instance||(e.instance=new e),e.instance}static resetInstance(){e.instance=null}setupRoutes(){this.routes.set("/",(()=>{const e=q.getInstance();e.cleanup(),e.init()})),this.routes.set("/welcome",(()=>{const e=q.getInstance();e.cleanup();r.getAuthData();e.showAuthenticatedWelcome()})),this.routes.set("/contact-form",(()=>{const e=q.getInstance();e.cleanup(),e.getAppContainer()&&e.showContactFormDirectly()}))}handleInitialRoute(){const e=window.location.pathname;if(this.currentPath=this.mapPathToRoute(e),"/welcome"===this.currentPath){window.history.length<=1&&(window.history.replaceState({page:"root"},"","/"),window.history.pushState({page:"welcome"},"","/welcome"));new URLSearchParams(window.location.search).get("auth")}if("/contact-form"===this.currentPath){const e=q.getInstance();e.cleanup(),e.showContactFormDirectly()}else if("/welcome"===this.currentPath){const e=q.getInstance();e.cleanup(),e.showAuthenticatedWelcome()}else this.currentPath.startsWith("/api/")||q.getInstance().init()}handleRouteChange(e=!1){const t=window.location.pathname,n=this.mapPathToRoute(t);if(e||n!==this.currentPath){this.currentPath=n;const e=this.routes.get(n);if(e)e();else{const e=this.routes.get("/");e&&e()}}}navigateTo(e){if(this.isPopStateHandling)return;const t=this.mapPathToRoute(e);if(t!==this.currentPath)if(window.history.pushState({},"",t),this.currentPath=t,"/contact-form"===t){const e=q.getInstance();e.cleanup(),e.getAppContainer()&&e.showContactFormDirectly()}else if("/welcome"===t){const e=q.getInstance();e.cleanup(),e.showAuthenticatedWelcome()}else this.handleRouteChange(!1)}navigateToWelcome(e){window.location.pathname.includes("/api/auth")?window.history.pushState({page:"welcome",userId:e},"","/welcome"):window.history.replaceState({page:"welcome",userId:e},"","/welcome"),this.currentPath="/welcome"}setCurrentPath(e){this.currentPath=this.mapPathToRoute(e)}mapPathToRoute(e){return e.startsWith("/api/")?e:"/contact-form"===e?"/contact-form":"/welcome"===e?"/welcome":"/"}initializeHistoryState(){"/welcome"===window.location.pathname&&(window.history.replaceState({page:"welcome",timestamp:Date.now()},"","/welcome"),this.currentPath="/welcome")}};t(o,"instance",null);let l=o;class c{constructor(e){t(this,"container"),t(this,"apiBaseUrl"),t(this,"authStatusUrl"),t(this,"githubAuthUrl"),t(this,"logoutUrl"),this.container=e,this.apiBaseUrl="",this.authStatusUrl=this.apiBaseUrl+"/api/auth/status",this.githubAuthUrl=this.apiBaseUrl+"/api/auth/github",this.logoutUrl=this.apiBaseUrl+"/api/auth/logout"}logDebugInfo(){}render(){if(this.logDebugInfo(),this.handleAuthParams())return;const e=r.getAuthData();e&&"/welcome"===window.location.pathname?this.renderWelcomeMessage(e):this.renderLandingPage()}async renderLandingPage(){this.logDebugInfo();const e=await this.checkAuthStatus();e.isAuthenticated?this.renderWelcomeMessage(e.user):this.renderLoginOptions()}async checkAuthStatus(){try{const n=(new Date).getTime(),s=`${this.authStatusUrl}?t=${n}`,i=await fetch(s,{credentials:"include",headers:{"Content-Type":"application/json"}});if(!i.ok){try{await i.text()}catch(e){}return{isAuthenticated:!1}}const r=i.headers.get("content-type");if(!r||!r.includes("application/json"))return{isAuthenticated:!1};try{return await i.json()}catch(t){return{isAuthenticated:!1}}}catch(n){return{isAuthenticated:!1}}}renderLoginOptions(){const e=document.createElement("div");e.className="landing-page",e.innerHTML='\n      <div class="landing-container">\n        <h1>Contact Form</h1>\n        <p>Please choose how you would like to continue:</p>\n\n        <div class="landing-buttons">\n          <button id="github-signin" class="btn btn-primary">\n            Sign in with GitHub\n          </button>\n\n          <button id="continue-without-signin" class="btn btn-secondary">\n            Continue without signing in\n          </button>\n        </div>\n      </div>\n    ',this.container.innerHTML="",this.container.appendChild(e);const t=this.container.querySelector("#continue-without-signin");t&&t.addEventListener("click",(()=>{this.showContactForm()}));const n=this.container.querySelector("#github-signin");n&&n.addEventListener("click",(e=>{e.preventDefault(),window.location.href=this.githubAuthUrl}))}renderWelcomeMessage(e){const t=document.createElement("div");t.className="landing-page",t.innerHTML=`\n      <div class="landing-container">\n        <h1>Welcome, ${a.escapeHTML(e.name||e.email)}</h1>\n        <p>${e.isAdmin?"You have admin access.":"You are logged in."}</p>\n\n        <div class="landing-buttons">\n          <button id="continue-to-form" class="btn btn-primary">\n            Continue to Contact Form\n          </button>\n\n          ${e.isAdmin?'\n          <button id="view-submissions" class="btn btn-secondary">\n            View Submissions\n          </button>\n        ':""}\n\n          <button id="sign-out" class="btn btn-outline">\n            Sign Out\n          </button>\n        </div>\n      </div>\n    `,this.container.innerHTML="",this.container.appendChild(t);const n=this.container.querySelector("#continue-to-form");n&&n.addEventListener("click",(e=>{e.preventDefault(),this.showContactForm()}));const s=this.container.querySelector("#view-submissions");s&&s.addEventListener("click",(e=>{e.preventDefault(),window.location.href=`${this.apiBaseUrl}/api/submissions`}));const i=this.container.querySelector("#sign-out");i&&i.addEventListener("click",(async()=>{try{(await fetch(this.logoutUrl,{method:"GET",credentials:"include"})).ok&&(window.history.pushState({},"","/"),l.getInstance().setCurrentPath("/"),window.location.reload())}catch(e){}}))}async showContactForm(){window.history.pushState({},"","/contact-form");if(l.getInstance().setCurrentPath("/contact-form"),this.container){this.container.innerHTML="";const e=new Event("showContactForm");document.dispatchEvent(e)}}handleAuthParams(){this.logDebugInfo();const e=new URLSearchParams(window.location.search);if("true"===e.get("auth")){const t=e.get("id"),n=e.get("name"),s=e.get("email"),i="true"===e.get("isAdmin");if(t&&n)return r.storeAuthData({id:t,name:n,email:s||"",isAdmin:i}),window.history.replaceState({page:"welcome",authenticated:!0},"","/welcome"),this.renderWelcomeMessage({id:t,name:n,email:s||"",isAdmin:i}),!0}return!1}}class d{constructor(){t(this,"activeErrors",new Map)}showError(e,t,n="default"){a.showError(e,t),t?this.trackError(e,n):this.clearError(e,n)}trackError(e,t){var n;this.activeErrors.has(t)||this.activeErrors.set(t,new Set),null==(n=this.activeErrors.get(t))||n.add(e)}clearError(e,t){const n=this.activeErrors.get(t);n&&(n.delete(e),0===n.size&&this.activeErrors.delete(t))}clearErrorGroup(e){const t=this.activeErrors.get(e);t&&(t.forEach((e=>{a.showError(e,"")})),this.activeErrors.delete(e))}clearAllErrors(){for(const e of this.activeErrors.keys())this.clearErrorGroup(e)}hasErrors(e="default"){const t=this.activeErrors.get(e);return!!t&&t.size>0}getErrorCount(e="default"){var t;return(null==(t=this.activeErrors.get(e))?void 0:t.size)||0}}class u{renderForm(){let e=document.getElementById("app");e||(e=document.createElement("div"),e.id="app",document.body.appendChild(e)),e.innerHTML="";const t=document.createElement("main");return t.className="container",t.innerHTML='\n      <form id="contact-form" class="contact-form" novalidate aria-label="Contact form">\n        <h1>Contact Us</h1>\n\n        <div class="name-fields-container">\n          <div class="form-group">\n            <label class="form-label" for="first-name">\n              <span class="label-text">First Name&nbsp;</span>\n              <span class="required" aria-hidden="true">*</span>\n            </label>\n            <input\n              type="text"\n              id="first-name"\n              name="first-name"\n              aria-required="true"\n              aria-describedby="first-name-error"\n            >\n            <span id="first-name-error" class="error-message" role="alert"></span>\n          </div>\n\n          <div class="form-group">\n            <label class="form-label" for="last-name">\n              <span class="label-text">Last Name&nbsp;</span>\n              <span class="required" aria-hidden="true">*</span>\n            </label>\n            <input\n              type="text"\n              id="last-name"\n              name="last-name"\n              aria-required="true"\n              aria-describedby="last-name-error"\n            >\n            <span id="last-name-error" class="error-message" role="alert"></span>\n          </div>\n        </div>\n\n        <div class="form-group">\n          <label class="form-label" for="email">\n            <span class="label-text">Email Address&nbsp;</span>\n            <span class="required" aria-hidden="true">*</span>\n          </label>\n          <input\n            type="email"\n            id="email"\n            name="email"\n            aria-required="true"\n            aria-describedby="email-error"\n          >\n          <span id="email-error" class="error-message" role="alert"></span>\n        </div>\n\n        <div class="form-group">\n          <fieldset class="radio-group" aria-describedby="query-type-error">\n            <legend id="label-legend">\n              <span class="label-text" id="query-type-label">Query Type&nbsp;</span>\n              <span class="required" aria-hidden="true">*</span>\n            </legend>\n            <div class="radio-options-container">\n              <div class="radio-option" id="radio-option-general">\n                <input\n                  type="radio"\n                  id="query-general"\n                  name="query-type"\n                  value="general"\n                  aria-required="true"\n                  aria-describedby="query-type-error"\n                >\n                <label for="query-general">General Enquiry</label>\n              </div>\n              <div class="radio-option" id="radio-option-support">\n                <input\n                  type="radio"\n                  id="query-support"\n                  name="query-type"\n                  value="support"\n                  aria-required="true"\n                  aria-describedby="query-type-error"\n                >\n                <label for="query-support">Support Request</label>\n              </div>\n            </div>\n            <span id="query-type-error" class="error-message" role="alert"></span>\n          </fieldset>\n        </div>\n\n        <div class="form-group">\n          <label class="form-label" for="message">\n            <span class="label-text">Message&nbsp;</span>\n            <span class="required" aria-hidden="true">*</span>\n          </label>\n          <textarea\n            id="message"\n            name="message"\n            aria-required="true"\n            aria-describedby="message-error"\n          ></textarea>\n          <span id="message-error" class="error-message" role="alert"></span>\n        </div>\n\n        <div class="form-group">\n          <div class="checkbox-container" role="group" aria-describedby="consent-error">\n            <input\n              type="checkbox"\n              id="consent"\n              name="consent"\n              aria-required="true"\n              aria-describedby="consent-error"\n            >\n            <label for="consent">\n              <span class="label-text">I consent to being contacted by the team&nbsp;</span>\n              <span class="required" aria-hidden="true">*</span>\n            </label>\n            <span id="consent-error" class="error-message" role="alert"></span>\n          </div>\n        </div>\n\n        <button type="submit" aria-label="Submit contact form">Submit</button>\n      </form>\n    ',e.appendChild(t),document.getElementById("contact-form")}}class h{constructor(e){t(this,"toastService"),t(this,"apiUrl"),this.toastService=e;const n=window.location.origin;this.apiUrl=`${n||"http://localhost:3001"}/api/submissions`}formatFormData(e){const t=["firstName","lastName","email","message"];for(const n of t)if(!(n in e)||""===e[n].trim())throw new Error(`Missing required field: ${n}`);return{submission:{...e,timestamp:(new Date).toISOString()}}}async submitForm(e,t){try{const n=this.formatFormData(e);await new Promise(((e,s)=>{const i=setTimeout((async()=>{try{const s=await fetch(this.apiUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n),signal:t});if(!s.ok){const e=await s.text();throw new Error(`API error: ${s.status} - ${e}`)}await s.json().catch((()=>({})));e(null)}catch(i){s(i)}}),1500);t&&t.addEventListener("abort",(()=>{clearTimeout(i),s(new DOMException("Form submission aborted","AbortError"))}))}))}catch(n){throw n}}showSuccessMessage(){this.toastService.showFormSubmissionSuccess("Message Sent!","Thanks for completing the form. We'll be in touch soon!")}}class m{showSuccess(e){n({text:e,duration:5e3,gravity:"top",position:"center",avatar:"data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='20'%20height='21'%20fill='none'%20viewBox='0%200%2020%2021'%3e%3cpath%20fill='%23fff'%20d='M14.28%207.72a.748.748%200%200%201%200%201.06l-5.25%205.25a.748.748%200%200%201-1.06%200l-2.25-2.25a.75.75%200%201%201%201.06-1.06l1.72%201.72%204.72-4.72a.75.75%200%200%201%201.06%200Zm5.47%202.78A9.75%209.75%200%201%201%2010%20.75a9.76%209.76%200%200%201%209.75%209.75Zm-1.5%200A8.25%208.25%200%201%200%2010%2018.75a8.26%208.26%200%200%200%208.25-8.25Z'/%3e%3c/svg%3e",className:"toast-success",escapeMarkup:!1,stopOnFocus:!0,style:{background:"hsl(187, 24%, 22%)",color:"hsl(0, 0%, 100%)",boxShadow:"0 10px 30px rgba(33, 33, 33, 0.1)",borderRadius:"4px",fontFamily:"Karla, sans-serif",top:"16px"},offset:{x:0,y:16}}).showToast()}showFormSubmissionSuccess(e,t){const n=`\n      <div class="toast-success-wrapper">\n        <strong>${e}</strong>\n        <div class="toast-success-content">\n          ${t}\n        </div>\n      </div>\n    `;this.showSuccess(n)}}class p{validateField(e,t){let n=!0,r="";switch(e){case"firstName":case"lastName":case"message":n=s.sanitize(t.value.trim()).length>0,r=n?"":"This field is required";break;case"email":const e=s.sanitize(t.value);e.trim()?(n=i.isEmail(e),r=n?"":"Please enter a valid email address"):(n=!1,r="This field is required");break;case"queryType":n=""!==s.sanitize(t.value),r=n?"":"Please select a query type";break;case"consent":n=t.checked,r=n?"":"To submit this form, please consent to being contacted"}return{isValid:n,errorMessage:r}}}const g="input",b="blur",f="change",w="submit",v="first-name",E="last-name",y="email",S="message",F="consent",L="query-type",C="Submit";class A{constructor(e,n,s){t(this,"form"),t(this,"elements"),t(this,"submitButton"),t(this,"formRenderer"),t(this,"errorHandler"),t(this,"abortController"),t(this,"currentFormElements",new Set),t(this,"isActive",!1),t(this,"elementToFieldNameMap",new Map),this.formRenderer=e,this.errorHandler=n,this.abortController=s||new AbortController}isExternalController(){var e;return(null==(e=this.abortController)?void 0:e.signal)&&!this.abortController.signal.aborted}createForm(){return this.form=this.formRenderer.renderForm(),this.setupElements(),this.setInitialFocus(),this.isActive=!0,this.form}setupElements(){this.initializeFormElements(),this.initializeSubmitButton(),this.trackCurrentFormElements(),this.buildElementFieldNameMap()}initializeFormElements(){this.elements={firstName:a.getElementById(v),lastName:a.getElementById(E),email:a.getElementById(y),queryType:a.getElementByName(this.form,L),message:a.getElementById(S),consent:a.getElementById(F)}}initializeSubmitButton(){this.submitButton=this.form.querySelector("button")}trackCurrentFormElements(){this.currentFormElements.clear(),Object.values(this.elements).forEach((e=>{e instanceof HTMLElement?this.currentFormElements.add(e):e instanceof RadioNodeList&&Array.from(e).forEach((e=>{e instanceof HTMLElement&&this.currentFormElements.add(e)}))}))}buildElementFieldNameMap(){this.elementToFieldNameMap.clear(),Object.entries(this.elements).forEach((([e,t])=>{t instanceof HTMLElement?this.elementToFieldNameMap.set(t,e):t instanceof RadioNodeList&&Array.from(t).forEach((t=>{t instanceof HTMLElement&&this.elementToFieldNameMap.set(t,e)}))}))}setInitialFocus(){this.elements.firstName&&this.elements.firstName.focus()}setupEventListeners(e,t){this.addSubmitEventListener(e),this.setupEventDelegation(t),this.setupDirectEventListeners(t)}addSubmitEventListener(e){this.form.addEventListener(w,e,{signal:this.abortController.signal})}createDebouncedHandler(e){const t="undefined"!=typeof process&&!1;return a.debounce(e,300,{immediate:t})}setupEventDelegation(e){const t=this.createDebouncedHandler((t=>this.handleDelegatedEvent(t,e)));this.form.addEventListener(g,t,{signal:this.abortController.signal}),this.form.addEventListener(b,(t=>this.handleDelegatedEvent(t,e)),{signal:this.abortController.signal,capture:!0}),this.form.addEventListener(f,(t=>this.handleDelegatedEvent(t,e)),{signal:this.abortController.signal})}setupDirectEventListeners(e){Object.entries(this.elements).forEach((([t,n])=>{if("queryType"===t&&n instanceof RadioNodeList)Array.from(n).forEach((n=>{n instanceof HTMLInputElement&&n.addEventListener(f,(()=>{this.isActive&&e(t)}),{signal:this.abortController.signal})}));else if(n instanceof HTMLInputElement||n instanceof HTMLTextAreaElement){const s=this.createDebouncedHandler((()=>{this.isActive&&e(t)}));n.addEventListener(g,s,{signal:this.abortController.signal}),n.addEventListener(b,(()=>{this.isActive&&e(t)}),{signal:this.abortController.signal})}}))}handleDelegatedEvent(e,t){if(!this.isActive)return;const n=e.target;if(!n||!(n instanceof HTMLInputElement||n instanceof HTMLTextAreaElement||n instanceof HTMLSelectElement)||!this.currentFormElements.has(n))return;const s=this.getFieldNameFromElement(n);s&&t(s)}getFieldNameFromElement(e){return this.elementToFieldNameMap.get(e)||null}getFormElements(){return this.elements}getForm(){return this.form}getSubmitButton(){return this.submitButton}getAbortSignal(){return this.abortController.signal}showFieldError(e,t){const n=this.elements[e],s=a.getErrorContainer(e,n);s&&this.errorHandler.showError(s,t)}disableSubmitButton(e){this.submitButton.disabled=!0,this.submitButton.textContent=e}resetSubmitButton(){this.submitButton.disabled=!1,this.submitButton.textContent=C}disableFormElements(){Object.values(this.elements).forEach((e=>{e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement?a.disableElement(e,!0):e instanceof RadioNodeList&&a.disableRadioGroup(e,!0)}))}resetForm(){this.form.reset()}showFormError(e){this.errorHandler.showError(this.form,e)}cleanup(){this.isActive=!1,this.currentFormElements.clear(),this.elementToFieldNameMap.clear(),this.abortController&&"function"==typeof this.abortController.abort&&this.abortController.abort(),this.isExternalController()||(this.abortController=new AbortController)}}class I{constructor(e,n,s){t(this,"view"),t(this,"validator"),t(this,"submitter"),t(this,"elements"),this.validator=e,this.submitter=n,this.view=s}cleanup(){this.view.cleanup()}init(){try{this.view.createForm(),this.elements=this.view.getFormElements();const e=e=>this.handleSubmit(e),t=e=>this.validateField(e);this.view.setupEventListeners(e,t)}catch(e){throw e}}validateField(e){const t=this.elements[e],{isValid:n,errorMessage:s}=this.validator.validateField(e,t);return this.view.showFieldError(e,n?"":s),n}async handleSubmit(e){e.preventDefault(),this.view.getSubmitButton().disabled||this.validateAllFields()&&await this.submitForm()}validateAllFields(){let e=!0;return Object.keys(this.elements).forEach((t=>{const n=t;this.validateField(n)||(e=!1)})),e}async submitForm(){const e=this.view.getAbortSignal();if(!(null==e?void 0:e.aborted)){this.view.disableSubmitButton("Sending...");try{const t=this.collectFormData();await this.submitter.submitForm(t,e),this.handleSuccessfulSubmission()}catch(t){this.handleSubmissionError(t)}}}handleSubmissionError(e){e instanceof DOMException&&"AbortError"===e.name?this.view.resetSubmitButton():this.handleFailedSubmission(e)}collectFormData(){return{firstName:s.sanitize(this.elements.firstName.value),lastName:s.sanitize(this.elements.lastName.value),email:s.sanitize(this.elements.email.value),queryType:s.sanitize(this.elements.queryType.value),message:s.sanitize(this.elements.message.value),consent:this.elements.consent.checked}}handleSuccessfulSubmission(){this.submitter.showSuccessMessage(),this.view.disableFormElements(),this.view.resetForm(),this.view.disableSubmitButton("Sent")}handleFailedSubmission(e){Error,this.view.showFormError("Failed to send message. Please try again."),this.view.resetSubmitButton()}}class T{static create(e={}){const t=e.validator||new p,n=e.toastService||new m,s=e.errorHandler||new d,i=e.formRenderer||new u,r=e.view||new A(i,s,e.abortController),a=e.submitter||new h(n);return new I(t,a,r)}}const M=class e{constructor(){t(this,"contactForm",null),t(this,"appContainer",null),t(this,"landingPage",null),t(this,"isInitialized",!1),this.appContainer=document.getElementById("app")}static getInstance(){return e.instance||(e.instance=new e),e.instance}init(){this.cleanup(),this.appContainer&&(this.landingPage=new c(this.appContainer),this.landingPage.render(),this.isInitialized=!0,document.addEventListener("showContactForm",(()=>{this.initContactForm()})),this.setupUnloadCleanup())}showContactFormDirectly(){this.appContainer&&(this.cleanup(),this.initContactForm(),this.isInitialized=!0)}initContactForm(){this.contactForm=T.create(),this.contactForm.init()}cleanup(){this.contactForm&&(this.contactForm.cleanup(),this.contactForm=null),this.landingPage=null,this.appContainer&&(this.appContainer.innerHTML=""),this.isInitialized=!1}setupUnloadCleanup(){window.addEventListener("beforeunload",(()=>{this.cleanup()}))}getAppContainer(){return this.appContainer}showAuthenticatedWelcome(){this.appContainer&&(this.cleanup(),this.landingPage=new c(this.appContainer),this.landingPage.render(),this.isInitialized=!0)}};t(M,"instance",null);let q=M;"undefined"!=typeof document&&document.addEventListener("DOMContentLoaded",(function(){l.getInstance(),"/"===window.location.pathname&&null===window.history.state&&window.history.replaceState({initial:!0},"","/")}));
