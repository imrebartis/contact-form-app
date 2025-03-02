var w=Object.defineProperty;var L=(a,e,t)=>e in a?w(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t;var f=(a,e,t)=>L(a,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function t(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(o){if(o.ep)return;o.ep=!0;const r=t(o);fetch(o.href,r)}})();class c{static getElement(e,t={throwIfNotFound:!0}){const i=document.querySelector(e);if(!i&&t.throwIfNotFound)throw new Error(t.errorMessage||`Element not found: ${e}`);return i}static getElements(e,t={throwIfNotFound:!1}){const i=Array.from(document.querySelectorAll(e));if(i.length===0&&t.throwIfNotFound)throw new Error(t.errorMessage||`No elements found: ${e}`);return i}static getElementById(e,t={throwIfNotFound:!1}){const i=document.getElementById(e);if(!i&&t.throwIfNotFound)throw new Error(t.errorMessage||`Element not found with ID: ${e}`);return i}static getElementByName(e,t){return e.elements.namedItem(t)}static getErrorContainer(e,t){return e==="queryType"?document.querySelector(".radio-group"):t}static addEventListener(e,t,i,o){e.addEventListener(t,i,{signal:o})}static removeEventListener(e,t,i){e.removeEventListener(t,i)}static showError(e,t){this.setAriaInvalid(e,!!t);const i=this.findErrorElement(e);i&&this.updateErrorElement(i,t)}static setAriaInvalid(e,t){const i=t?"true":"false";e.classList.contains("radio-group")||e.classList.contains("checkbox-container")?e.querySelectorAll("input").forEach(r=>r.setAttribute("aria-invalid",i)):e.setAttribute("aria-invalid",i)}static findErrorElement(e){const t=e.getAttribute("aria-describedby");if(t)return this.getElementById(t);if(e.classList.contains("radio-group")||e.classList.contains("checkbox-container")){const o=e.querySelector(".error-message");if(o)return o}const i=e.closest(".form-field")||e.parentElement;return i&&i.querySelector(".error-message")||null}static setElementVisibility(e,t,i="block",o=!1,r="visible",s="hidden"){e.style.display=t?i:"none",e.setAttribute("aria-hidden",t?"false":"true"),o&&(t?(e.classList.add(r),e.classList.remove(s)):(e.classList.remove(r),e.classList.add(s)))}static disableElement(e,t=!0){(e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement||e instanceof HTMLSelectElement||e instanceof HTMLButtonElement)&&(e.disabled=t)}static disableRadioGroup(e,t=!0){Array.from(e).forEach(o=>{if(o instanceof HTMLInputElement){o.disabled=t;const r=o.closest(".radio-option");r&&(t?r.classList.add("disabled"):r.classList.remove("disabled"))}});const i=document.querySelector(".radio-group");i&&(t?i.classList.add("disabled"):i.classList.remove("disabled"))}static updateErrorElement(e,t){e.textContent=t,e.style.display=t?"block":"none",e.setAttribute("aria-hidden",t?"false":"true"),t?(e.classList.add("error-visible"),e.classList.remove("error-hidden")):(e.classList.remove("error-visible"),e.classList.add("error-hidden"))}}class T{constructor(){f(this,"activeErrors",new Map)}showError(e,t,i="default"){c.showError(e,t),t?this.trackError(e,i):this.clearError(e,i)}trackError(e,t){var i;this.activeErrors.has(t)||this.activeErrors.set(t,new Set),(i=this.activeErrors.get(t))==null||i.add(e)}clearError(e,t){const i=this.activeErrors.get(t);i&&(i.delete(e),i.size===0&&this.activeErrors.delete(t))}clearErrorGroup(e){const t=this.activeErrors.get(e);t&&(t.forEach(i=>{c.showError(i,"")}),this.activeErrors.delete(e))}clearAllErrors(){for(const e of this.activeErrors.keys())this.clearErrorGroup(e)}hasErrors(e="default"){const t=this.activeErrors.get(e);return!!t&&t.size>0}getErrorCount(e="default"){var t;return((t=this.activeErrors.get(e))==null?void 0:t.size)||0}}class N{renderForm(){return document.body.innerHTML=`
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
    `,document.querySelector(".contact-form")}}class F{validateField(e,t){let i=!0,o="";switch(e){case"firstName":case"lastName":i=t.value.trim().length>0,o=i?"":"This field is required";break;case"email":const r=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,s=t.value;i=r.test(s),o=i?"":"Please enter a valid email address",s||(o="This field is required");break;case"queryType":i=t.value!=="",o=i?"":"Please select a query type";break;case"message":i=t.value.trim().length>0,o=i?"":"This field is required";break;case"consent":i=t.checked,o=i?"":"To submit this form, please consent to being contacted";break}return{isValid:i,errorMessage:o}}}var k=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function x(a){return a&&a.__esModule&&Object.prototype.hasOwnProperty.call(a,"default")?a.default:a}var g={exports:{}};/*!
 * Toastify js 1.12.0
 * https://github.com/apvarun/toastify-js
 * @license MIT licensed
 *
 * Copyright (C) 2018 Varun A P
 */(function(a){(function(e,t){a.exports?a.exports=t():e.Toastify=t()})(k,function(e){var t=function(s){return new t.lib.init(s)},i="1.12.0";t.defaults={oldestFirst:!0,text:"Toastify is awesome!",node:void 0,duration:3e3,selector:void 0,callback:function(){},destination:void 0,newWindow:!1,close:!1,gravity:"toastify-top",positionLeft:!1,position:"",backgroundColor:"",avatar:"",className:"",stopOnFocus:!0,onClick:function(){},offset:{x:0,y:0},escapeMarkup:!0,ariaLive:"polite",style:{background:""}},t.lib=t.prototype={toastify:i,constructor:t,init:function(s){return s||(s={}),this.options={},this.toastElement=null,this.options.text=s.text||t.defaults.text,this.options.node=s.node||t.defaults.node,this.options.duration=s.duration===0?0:s.duration||t.defaults.duration,this.options.selector=s.selector||t.defaults.selector,this.options.callback=s.callback||t.defaults.callback,this.options.destination=s.destination||t.defaults.destination,this.options.newWindow=s.newWindow||t.defaults.newWindow,this.options.close=s.close||t.defaults.close,this.options.gravity=s.gravity==="bottom"?"toastify-bottom":t.defaults.gravity,this.options.positionLeft=s.positionLeft||t.defaults.positionLeft,this.options.position=s.position||t.defaults.position,this.options.backgroundColor=s.backgroundColor||t.defaults.backgroundColor,this.options.avatar=s.avatar||t.defaults.avatar,this.options.className=s.className||t.defaults.className,this.options.stopOnFocus=s.stopOnFocus===void 0?t.defaults.stopOnFocus:s.stopOnFocus,this.options.onClick=s.onClick||t.defaults.onClick,this.options.offset=s.offset||t.defaults.offset,this.options.escapeMarkup=s.escapeMarkup!==void 0?s.escapeMarkup:t.defaults.escapeMarkup,this.options.ariaLive=s.ariaLive||t.defaults.ariaLive,this.options.style=s.style||t.defaults.style,s.backgroundColor&&(this.options.style.background=s.backgroundColor),this},buildToast:function(){if(!this.options)throw"Toastify is not initialized";var s=document.createElement("div");s.className="toastify on "+this.options.className,this.options.position?s.className+=" toastify-"+this.options.position:this.options.positionLeft===!0?(s.className+=" toastify-left",console.warn("Property `positionLeft` will be depreciated in further versions. Please use `position` instead.")):s.className+=" toastify-right",s.className+=" "+this.options.gravity,this.options.backgroundColor&&console.warn('DEPRECATION NOTICE: "backgroundColor" is being deprecated. Please use the "style.background" property.');for(var n in this.options.style)s.style[n]=this.options.style[n];if(this.options.ariaLive&&s.setAttribute("aria-live",this.options.ariaLive),this.options.node&&this.options.node.nodeType===Node.ELEMENT_NODE)s.appendChild(this.options.node);else if(this.options.escapeMarkup?s.innerText=this.options.text:s.innerHTML=this.options.text,this.options.avatar!==""){var p=document.createElement("img");p.src=this.options.avatar,p.className="toastify-avatar",this.options.position=="left"||this.options.positionLeft===!0?s.appendChild(p):s.insertAdjacentElement("afterbegin",p)}if(this.options.close===!0){var d=document.createElement("button");d.type="button",d.setAttribute("aria-label","Close"),d.className="toast-close",d.innerHTML="&#10006;",d.addEventListener("click",(function(b){b.stopPropagation(),this.removeElement(this.toastElement),window.clearTimeout(this.toastElement.timeOutValue)}).bind(this));var l=window.innerWidth>0?window.innerWidth:screen.width;(this.options.position=="left"||this.options.positionLeft===!0)&&l>360?s.insertAdjacentElement("afterbegin",d):s.appendChild(d)}if(this.options.stopOnFocus&&this.options.duration>0){var u=this;s.addEventListener("mouseover",function(b){window.clearTimeout(s.timeOutValue)}),s.addEventListener("mouseleave",function(){s.timeOutValue=window.setTimeout(function(){u.removeElement(s)},u.options.duration)})}if(typeof this.options.destination<"u"&&s.addEventListener("click",(function(b){b.stopPropagation(),this.options.newWindow===!0?window.open(this.options.destination,"_blank"):window.location=this.options.destination}).bind(this)),typeof this.options.onClick=="function"&&typeof this.options.destination>"u"&&s.addEventListener("click",(function(b){b.stopPropagation(),this.options.onClick()}).bind(this)),typeof this.options.offset=="object"){var h=o("x",this.options),m=o("y",this.options),y=this.options.position=="left"?h:"-"+h,E=this.options.gravity=="toastify-top"?m:"-"+m;s.style.transform="translate("+y+","+E+")"}return s},showToast:function(){this.toastElement=this.buildToast();var s;if(typeof this.options.selector=="string"?s=document.getElementById(this.options.selector):this.options.selector instanceof HTMLElement||typeof ShadowRoot<"u"&&this.options.selector instanceof ShadowRoot?s=this.options.selector:s=document.body,!s)throw"Root element is not defined";var n=t.defaults.oldestFirst?s.firstChild:s.lastChild;return s.insertBefore(this.toastElement,n),t.reposition(),this.options.duration>0&&(this.toastElement.timeOutValue=window.setTimeout((function(){this.removeElement(this.toastElement)}).bind(this),this.options.duration)),this},hideToast:function(){this.toastElement.timeOutValue&&clearTimeout(this.toastElement.timeOutValue),this.removeElement(this.toastElement)},removeElement:function(s){s.className=s.className.replace(" on",""),window.setTimeout((function(){this.options.node&&this.options.node.parentNode&&this.options.node.parentNode.removeChild(this.options.node),s.parentNode&&s.parentNode.removeChild(s),this.options.callback.call(s),t.reposition()}).bind(this),400)}},t.reposition=function(){for(var s={top:15,bottom:15},n={top:15,bottom:15},p={top:15,bottom:15},d=document.getElementsByClassName("toastify"),l,u=0;u<d.length;u++){r(d[u],"toastify-top")===!0?l="toastify-top":l="toastify-bottom";var h=d[u].offsetHeight;l=l.substr(9,l.length-1);var m=15,y=window.innerWidth>0?window.innerWidth:screen.width;y<=360?(d[u].style[l]=p[l]+"px",p[l]+=h+m):r(d[u],"toastify-left")===!0?(d[u].style[l]=s[l]+"px",s[l]+=h+m):(d[u].style[l]=n[l]+"px",n[l]+=h+m)}return this};function o(s,n){return n.offset[s]?isNaN(n.offset[s])?n.offset[s]:n.offset[s]+"px":"0px"}function r(s,n){return!s||typeof n!="string"?!1:!!(s.className&&s.className.trim().split(/\s+/gi).indexOf(n)>-1)}return t.lib.init.prototype=t.lib,t})})(g);var S=g.exports;const q=x(S),C="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='20'%20height='21'%20fill='none'%20viewBox='0%200%2020%2021'%3e%3cpath%20fill='%23fff'%20d='M14.28%207.72a.748.748%200%200%201%200%201.06l-5.25%205.25a.748.748%200%200%201-1.06%200l-2.25-2.25a.75.75%200%201%201%201.06-1.06l1.72%201.72%204.72-4.72a.75.75%200%200%201%201.06%200Zm5.47%202.78A9.75%209.75%200%201%201%2010%20.75a9.76%209.76%200%200%201%209.75%209.75Zm-1.5%200A8.25%208.25%200%201%200%2010%2018.75a8.26%208.26%200%200%200%208.25-8.25Z'/%3e%3c/svg%3e";class M{showSuccess(e){q({text:e,duration:5e3,gravity:"top",position:"center",avatar:C,className:"toast-success",escapeMarkup:!1,stopOnFocus:!0,style:{background:"hsl(187, 24%, 22%)",color:"hsl(0, 0%, 100%)",boxShadow:"0 10px 30px rgba(33, 33, 33, 0.1)",borderRadius:"4px",fontFamily:"Karla, sans-serif",top:"16px"},offset:{x:0,y:16}}).showToast()}showFormSubmissionSuccess(e,t){const i=`
      <div class="toast-success-wrapper">
        <strong>${e}</strong>
        <div class="toast-success-content">
          ${t}
        </div>
      </div>
    `;this.showSuccess(i)}}class O{constructor(){f(this,"form");f(this,"elements");f(this,"submitButton");f(this,"validator");f(this,"toastService");f(this,"errorHandler");f(this,"formRenderer");f(this,"abortController");this.validator=new F,this.toastService=new M,this.errorHandler=new T,this.formRenderer=new N,this.abortController=new AbortController}init(){this.form=this.formRenderer.renderForm(),this.setupElements(),this.setupEventListeners(),this.setInitialFocus()}setupElements(){this.elements={firstName:c.getElementById("first-name"),lastName:c.getElementById("last-name"),email:c.getElementById("email"),queryType:c.getElementByName(this.form,"query-type"),message:c.getElementById("message"),consent:c.getElementById("consent")},this.submitButton=this.form.querySelector("button")}setupEventListeners(){const{signal:e}=this.abortController,t=i=>this.handleSubmit(i);c.addEventListener(this.form,"submit",t,e),Object.entries(this.elements).forEach(([i,o])=>{if(i==="queryType"){const r=o;Array.from(r).forEach(s=>{s instanceof HTMLInputElement&&c.addEventListener(s,"change",this.validateField.bind(this,i),e)})}else c.addEventListener(o,"input",this.validateField.bind(this,i),e),c.addEventListener(o,"blur",this.validateField.bind(this,i),e)})}setInitialFocus(){this.elements.firstName&&this.elements.firstName.focus()}validateField(e){const t=this.elements[e],{isValid:i,errorMessage:o}=this.validator.validateField(e,t),r=c.getErrorContainer(e,t);return r&&this.errorHandler.showError(r,i?"":o),i}async handleSubmit(e){if(e.preventDefault(),this.submitButton.disabled)return;this.validateAllFields()&&await this.submitForm()}validateAllFields(){let e=!0;return Object.keys(this.elements).forEach(t=>{const i=t;this.validateField(i)||(e=!1)}),e}async submitForm(){this.disableSubmitButton("Sending...");try{await new Promise(t=>setTimeout(t,1500));const e=this.collectFormData();console.log("Form submitted:",e),this.handleSuccessfulSubmission()}catch(e){e instanceof Error?console.error(e.message):console.error("An unknown error occurred."),this.handleFailedSubmission()}}collectFormData(){return{firstName:this.elements.firstName.value,lastName:this.elements.lastName.value,email:this.elements.email.value,queryType:this.elements.queryType.value,message:this.elements.message.value,consent:this.elements.consent.checked}}disableSubmitButton(e){this.submitButton.disabled=!0,this.submitButton.textContent=e}disableFormElements(){Object.values(this.elements).forEach(e=>{e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement?c.disableElement(e,!0):e instanceof RadioNodeList&&c.disableRadioGroup(e,!0)})}handleSuccessfulSubmission(){this.toastService.showFormSubmissionSuccess("Message Sent!","Thanks for completing the form. We'll be in touch soon!"),this.disableFormElements(),this.form.reset(),this.submitButton.textContent="Sent",this.submitButton.disabled=!0}handleFailedSubmission(){this.errorHandler.showError(this.form,"Failed to send message. Please try again."),this.submitButton.disabled=!1,this.submitButton.textContent="Submit"}cleanup(){this.abortController.abort(),this.abortController=new AbortController}}let v;document.addEventListener("DOMContentLoaded",()=>{v=new O,v.init()});window.addEventListener("beforeunload",()=>{v&&v.cleanup()});
//# sourceMappingURL=main-Bj0QhKq9.js.map
