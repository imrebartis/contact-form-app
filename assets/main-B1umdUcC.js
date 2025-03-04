var T=Object.defineProperty;var S=(n,e,t)=>e in n?T(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var u=(n,e,t)=>S(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function t(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(r){if(r.ep)return;r.ep=!0;const o=t(r);fetch(r.href,o)}})();class f{static getElement(e,t={throwIfNotFound:!0}){const i=document.querySelector(e);if(!i&&t.throwIfNotFound)throw new Error(t.errorMessage||`Element not found: ${e}`);return i}static getElements(e,t={throwIfNotFound:!1}){const i=Array.from(document.querySelectorAll(e));if(i.length===0&&t.throwIfNotFound)throw new Error(t.errorMessage||`No elements found: ${e}`);return i}static getElementById(e,t={throwIfNotFound:!1}){const i=document.getElementById(e);if(!i&&t.throwIfNotFound)throw new Error(t.errorMessage||`Element not found with ID: ${e}`);return i}static getElementByName(e,t){return e.elements.namedItem(t)}static getErrorContainer(e,t){return e==="queryType"?document.querySelector(".radio-group"):t}static addEventListener(e,t,i,r){e.addEventListener(t,i,{signal:r})}static removeEventListener(e,t,i){e.removeEventListener(t,i)}static showError(e,t){this.setAriaInvalid(e,!!t);const i=this.findErrorElement(e);i&&this.updateErrorElement(i,t)}static setAriaInvalid(e,t){const i=t?"true":"false";e.classList.contains("radio-group")||e.classList.contains("checkbox-container")?e.querySelectorAll("input").forEach(o=>o.setAttribute("aria-invalid",i)):e.setAttribute("aria-invalid",i)}static findErrorElement(e){const t=e.getAttribute("aria-describedby");if(t)return this.getElementById(t);if(e.classList.contains("radio-group")||e.classList.contains("checkbox-container")){const r=e.querySelector(".error-message");if(r)return r}const i=e.closest(".form-field")||e.parentElement;return i&&i.querySelector(".error-message")||null}static setElementVisibility(e,t,i="block",r=!1,o="visible",s="hidden"){e.style.display=t?i:"none",e.setAttribute("aria-hidden",t?"false":"true"),r&&(t?(e.classList.add(o),e.classList.remove(s)):(e.classList.remove(o),e.classList.add(s)))}static disableElement(e,t=!0){(e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement||e instanceof HTMLButtonElement)&&(e.disabled=t)}static disableRadioGroup(e,t=!0){Array.from(e).forEach(r=>{if(r instanceof HTMLInputElement){r.disabled=t;const o=r.closest(".radio-option");o&&(t?o.classList.add("disabled"):o.classList.remove("disabled"))}});const i=document.querySelector(".radio-group");i&&(t?i.classList.add("disabled"):i.classList.remove("disabled"))}static updateErrorElement(e,t){e.textContent=t,e.style.display=t?"block":"none",e.setAttribute("aria-hidden",t?"false":"true"),t?(e.classList.add("error-visible"),e.classList.remove("error-hidden")):(e.classList.remove("error-visible"),e.classList.add("error-hidden"))}}class g{constructor(){u(this,"activeErrors",new Map)}showError(e,t,i="default"){f.showError(e,t),t?this.trackError(e,i):this.clearError(e,i)}trackError(e,t){var i;this.activeErrors.has(t)||this.activeErrors.set(t,new Set),(i=this.activeErrors.get(t))==null||i.add(e)}clearError(e,t){const i=this.activeErrors.get(t);i&&(i.delete(e),i.size===0&&this.activeErrors.delete(t))}clearErrorGroup(e){const t=this.activeErrors.get(e);t&&(t.forEach(i=>{f.showError(i,"")}),this.activeErrors.delete(e))}clearAllErrors(){for(const e of this.activeErrors.keys())this.clearErrorGroup(e)}hasErrors(e="default"){const t=this.activeErrors.get(e);return!!t&&t.size>0}getErrorCount(e="default"){var t;return((t=this.activeErrors.get(e))==null?void 0:t.size)||0}}class E{renderForm(){return document.body.innerHTML=`
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
    `,document.querySelector(".contact-form")}}var k=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function C(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var w={exports:{}};/*!
 * Toastify js 1.12.0
 * https://github.com/apvarun/toastify-js
 * @license MIT licensed
 *
 * Copyright (C) 2018 Varun A P
 */(function(n){(function(e,t){n.exports?n.exports=t():e.Toastify=t()})(k,function(e){var t=function(s){return new t.lib.init(s)},i="1.12.0";t.defaults={oldestFirst:!0,text:"Toastify is awesome!",node:void 0,duration:3e3,selector:void 0,callback:function(){},destination:void 0,newWindow:!1,close:!1,gravity:"toastify-top",positionLeft:!1,position:"",backgroundColor:"",avatar:"",className:"",stopOnFocus:!0,onClick:function(){},offset:{x:0,y:0},escapeMarkup:!0,ariaLive:"polite",style:{background:""}},t.lib=t.prototype={toastify:i,constructor:t,init:function(s){return s||(s={}),this.options={},this.toastElement=null,this.options.text=s.text||t.defaults.text,this.options.node=s.node||t.defaults.node,this.options.duration=s.duration===0?0:s.duration||t.defaults.duration,this.options.selector=s.selector||t.defaults.selector,this.options.callback=s.callback||t.defaults.callback,this.options.destination=s.destination||t.defaults.destination,this.options.newWindow=s.newWindow||t.defaults.newWindow,this.options.close=s.close||t.defaults.close,this.options.gravity=s.gravity==="bottom"?"toastify-bottom":t.defaults.gravity,this.options.positionLeft=s.positionLeft||t.defaults.positionLeft,this.options.position=s.position||t.defaults.position,this.options.backgroundColor=s.backgroundColor||t.defaults.backgroundColor,this.options.avatar=s.avatar||t.defaults.avatar,this.options.className=s.className||t.defaults.className,this.options.stopOnFocus=s.stopOnFocus===void 0?t.defaults.stopOnFocus:s.stopOnFocus,this.options.onClick=s.onClick||t.defaults.onClick,this.options.offset=s.offset||t.defaults.offset,this.options.escapeMarkup=s.escapeMarkup!==void 0?s.escapeMarkup:t.defaults.escapeMarkup,this.options.ariaLive=s.ariaLive||t.defaults.ariaLive,this.options.style=s.style||t.defaults.style,s.backgroundColor&&(this.options.style.background=s.backgroundColor),this},buildToast:function(){if(!this.options)throw"Toastify is not initialized";var s=document.createElement("div");s.className="toastify on "+this.options.className,this.options.position?s.className+=" toastify-"+this.options.position:this.options.positionLeft===!0?(s.className+=" toastify-left",console.warn("Property `positionLeft` will be depreciated in further versions. Please use `position` instead.")):s.className+=" toastify-right",s.className+=" "+this.options.gravity,this.options.backgroundColor&&console.warn('DEPRECATION NOTICE: "backgroundColor" is being deprecated. Please use the "style.background" property.');for(var a in this.options.style)s.style[a]=this.options.style[a];if(this.options.ariaLive&&s.setAttribute("aria-live",this.options.ariaLive),this.options.node&&this.options.node.nodeType===Node.ELEMENT_NODE)s.appendChild(this.options.node);else if(this.options.escapeMarkup?s.innerText=this.options.text:s.innerHTML=this.options.text,this.options.avatar!==""){var h=document.createElement("img");h.src=this.options.avatar,h.className="toastify-avatar",this.options.position=="left"||this.options.positionLeft===!0?s.appendChild(h):s.insertAdjacentElement("afterbegin",h)}if(this.options.close===!0){var d=document.createElement("button");d.type="button",d.setAttribute("aria-label","Close"),d.className="toast-close",d.innerHTML="&#10006;",d.addEventListener("click",(function(b){b.stopPropagation(),this.removeElement(this.toastElement),window.clearTimeout(this.toastElement.timeOutValue)}).bind(this));var l=window.innerWidth>0?window.innerWidth:screen.width;(this.options.position=="left"||this.options.positionLeft===!0)&&l>360?s.insertAdjacentElement("afterbegin",d):s.appendChild(d)}if(this.options.stopOnFocus&&this.options.duration>0){var c=this;s.addEventListener("mouseover",function(b){window.clearTimeout(s.timeOutValue)}),s.addEventListener("mouseleave",function(){s.timeOutValue=window.setTimeout(function(){c.removeElement(s)},c.options.duration)})}if(typeof this.options.destination<"u"&&s.addEventListener("click",(function(b){b.stopPropagation(),this.options.newWindow===!0?window.open(this.options.destination,"_blank"):window.location=this.options.destination}).bind(this)),typeof this.options.onClick=="function"&&typeof this.options.destination>"u"&&s.addEventListener("click",(function(b){b.stopPropagation(),this.options.onClick()}).bind(this)),typeof this.options.offset=="object"){var p=r("x",this.options),m=r("y",this.options),y=this.options.position=="left"?p:"-"+p,F=this.options.gravity=="toastify-top"?m:"-"+m;s.style.transform="translate("+y+","+F+")"}return s},showToast:function(){this.toastElement=this.buildToast();var s;if(typeof this.options.selector=="string"?s=document.getElementById(this.options.selector):this.options.selector instanceof HTMLElement||typeof ShadowRoot<"u"&&this.options.selector instanceof ShadowRoot?s=this.options.selector:s=document.body,!s)throw"Root element is not defined";var a=t.defaults.oldestFirst?s.firstChild:s.lastChild;return s.insertBefore(this.toastElement,a),t.reposition(),this.options.duration>0&&(this.toastElement.timeOutValue=window.setTimeout((function(){this.removeElement(this.toastElement)}).bind(this),this.options.duration)),this},hideToast:function(){this.toastElement.timeOutValue&&clearTimeout(this.toastElement.timeOutValue),this.removeElement(this.toastElement)},removeElement:function(s){s.className=s.className.replace(" on",""),window.setTimeout((function(){this.options.node&&this.options.node.parentNode&&this.options.node.parentNode.removeChild(this.options.node),s.parentNode&&s.parentNode.removeChild(s),this.options.callback.call(s),t.reposition()}).bind(this),400)}},t.reposition=function(){for(var s={top:15,bottom:15},a={top:15,bottom:15},h={top:15,bottom:15},d=document.getElementsByClassName("toastify"),l,c=0;c<d.length;c++){o(d[c],"toastify-top")===!0?l="toastify-top":l="toastify-bottom";var p=d[c].offsetHeight;l=l.substr(9,l.length-1);var m=15,y=window.innerWidth>0?window.innerWidth:screen.width;y<=360?(d[c].style[l]=h[l]+"px",h[l]+=p+m):o(d[c],"toastify-left")===!0?(d[c].style[l]=s[l]+"px",s[l]+=p+m):(d[c].style[l]=a[l]+"px",a[l]+=p+m)}return this};function r(s,a){return a.offset[s]?isNaN(a.offset[s])?a.offset[s]:a.offset[s]+"px":"0px"}function o(s,a){return!s||typeof a!="string"?!1:!!(s.className&&s.className.trim().split(/\s+/gi).indexOf(a)>-1)}return t.lib.init.prototype=t.lib,t})})(w);var N=w.exports;const q=C(N),x="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='20'%20height='21'%20fill='none'%20viewBox='0%200%2020%2021'%3e%3cpath%20fill='%23fff'%20d='M14.28%207.72a.748.748%200%200%201%200%201.06l-5.25%205.25a.748.748%200%200%201-1.06%200l-2.25-2.25a.75.75%200%201%201%201.06-1.06l1.72%201.72%204.72-4.72a.75.75%200%200%201%201.06%200Zm5.47%202.78A9.75%209.75%200%201%201%2010%20.75a9.76%209.76%200%200%201%209.75%209.75Zm-1.5%200A8.25%208.25%200%201%200%2010%2018.75a8.26%208.26%200%200%200%208.25-8.25Z'/%3e%3c/svg%3e";class L{showSuccess(e){q({text:e,duration:5e3,gravity:"top",position:"center",avatar:x,className:"toast-success",escapeMarkup:!1,stopOnFocus:!0,style:{background:"hsl(187, 24%, 22%)",color:"hsl(0, 0%, 100%)",boxShadow:"0 10px 30px rgba(33, 33, 33, 0.1)",borderRadius:"4px",fontFamily:"Karla, sans-serif",top:"16px"},offset:{x:0,y:16}}).showToast()}showFormSubmissionSuccess(e,t){const i=`
      <div class="toast-success-wrapper">
        <strong>${e}</strong>
        <div class="toast-success-content">
          ${t}
        </div>
      </div>
    `;this.showSuccess(i)}}class M{constructor(e){u(this,"toastService");this.toastService=e||new L}async submitForm(e){await new Promise(t=>setTimeout(t,1500)),console.log("Form submitted:",e)}showSuccessMessage(){this.toastService.showFormSubmissionSuccess("Message Sent!","Thanks for completing the form. We'll be in touch soon!")}}class A{validateField(e,t){let i=!0,r="";switch(e){case"firstName":case"lastName":i=t.value.trim().length>0,r=i?"":"This field is required";break;case"email":const o=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,s=t.value;i=o.test(s),r=i?"":"Please enter a valid email address",s||(r="This field is required");break;case"queryType":i=t.value!=="",r=i?"":"Please select a query type";break;case"message":i=t.value.trim().length>0,r=i?"":"This field is required";break;case"consent":i=t.checked,r=i?"":"To submit this form, please consent to being contacted";break}return{isValid:i,errorMessage:r}}}class O{constructor(e,t){u(this,"form");u(this,"elements");u(this,"submitButton");u(this,"formRenderer");u(this,"errorHandler");u(this,"abortController");u(this,"boundEventHandlers",new Map);this.formRenderer=e||new E,this.errorHandler=t||new g,this.abortController=new AbortController}getAbortController(){return this.abortController}setAbortController(e){this.abortController=e}createForm(){return this.form=this.formRenderer.renderForm(),this.setupElements(),this.setInitialFocus(),this.form}setupElements(){this.elements={firstName:f.getElementById("first-name"),lastName:f.getElementById("last-name"),email:f.getElementById("email"),queryType:f.getElementByName(this.form,"query-type"),message:f.getElementById("message"),consent:f.getElementById("consent")},this.submitButton=this.form.querySelector("button")}setInitialFocus(){this.elements.firstName&&this.elements.firstName.focus()}setupEventListeners(e,t){const{signal:i}=this.abortController;this.addEventListenerWithTracking(this.form,"submit",e,i),Object.entries(this.elements).forEach(([r,o])=>{r==="queryType"?this.setupRadioGroupListeners(o,r,t,i):this.setupInputListeners(o,r,t,i)})}setupRadioGroupListeners(e,t,i,r){Array.from(e).forEach(o=>{if(o instanceof HTMLInputElement){const s=()=>i(t);this.addEventListenerWithTracking(o,"change",s,r)}})}setupInputListeners(e,t,i,r){const o=()=>i(t);this.addEventListenerWithTracking(e,"input",o,r),this.addEventListenerWithTracking(e,"blur",o,r)}addEventListenerWithTracking(e,t,i,r){var o;this.boundEventHandlers.has(e)||this.boundEventHandlers.set(e,[]),(o=this.boundEventHandlers.get(e))==null||o.push({type:t,listener:i,signal:r}),e.addEventListener(t,i,{signal:r})}getFormElements(){return this.elements}getForm(){return this.form}getSubmitButton(){return this.submitButton}showFieldError(e,t){const i=this.elements[e],r=f.getErrorContainer(e,i);r&&this.errorHandler.showError(r,t)}disableSubmitButton(e){this.submitButton.disabled=!0,this.submitButton.textContent=e}resetSubmitButton(){this.submitButton.disabled=!1,this.submitButton.textContent="Submit"}disableFormElements(){Object.values(this.elements).forEach(e=>{e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement?f.disableElement(e,!0):e instanceof RadioNodeList&&f.disableRadioGroup(e,!0)})}resetForm(){this.form.reset()}showFormError(e){this.errorHandler.showError(this.form,e)}cleanup(){this.abortController.abort(),this.boundEventHandlers.forEach((e,t)=>{e.forEach(({type:i,listener:r})=>{t.removeEventListener(i,r)})}),this.boundEventHandlers.clear(),this.abortController=new AbortController}}class B{constructor(e,t,i,r){u(this,"view");u(this,"validator");u(this,"submitter");u(this,"elements");this.validator=e||new A;const o=t||new L,s=i||new g,a=r||new E;this.view=new O(a,s),this.submitter=new M(o)}get abortController(){return this.view.getAbortController()}set abortController(e){this.view.setAbortController(e)}init(){this.view.createForm(),this.elements=this.view.getFormElements();const e=i=>this.handleSubmit(i),t=i=>this.validateField(i);this.view.setupEventListeners(e,t)}validateField(e){const t=this.elements[e],{isValid:i,errorMessage:r}=this.validator.validateField(e,t);return this.view.showFieldError(e,i?"":r),i}async handleSubmit(e){if(e.preventDefault(),this.view.getSubmitButton().disabled)return;this.validateAllFields()&&await this.submitForm()}validateAllFields(){let e=!0;return Object.keys(this.elements).forEach(t=>{const i=t;this.validateField(i)||(e=!1)}),e}async submitForm(){this.view.disableSubmitButton("Sending...");try{const e=this.collectFormData();await this.submitter.submitForm(e),this.handleSuccessfulSubmission()}catch(e){this.handleFailedSubmission(e)}}collectFormData(){return{firstName:this.elements.firstName.value,lastName:this.elements.lastName.value,email:this.elements.email.value,queryType:this.elements.queryType.value,message:this.elements.message.value,consent:this.elements.consent.checked}}handleSuccessfulSubmission(){this.submitter.showSuccessMessage(),this.view.disableFormElements(),this.view.resetForm(),this.view.disableSubmitButton("Sent")}handleFailedSubmission(e){e instanceof Error?console.error(e.message):console.error("An unknown error occurred."),this.view.showFormError("Failed to send message. Please try again."),this.view.resetSubmitButton()}cleanup(){this.view.cleanup()}}let v;document.addEventListener("DOMContentLoaded",()=>{v=new B,v.init()});window.addEventListener("beforeunload",()=>{v&&v.cleanup()});
//# sourceMappingURL=main-B1umdUcC.js.map
