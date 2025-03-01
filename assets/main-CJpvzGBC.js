var w=Object.defineProperty;var L=(a,t,e)=>t in a?w(a,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[t]=e;var u=(a,t,e)=>L(a,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function e(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(o){if(o.ep)return;o.ep=!0;const r=e(o);fetch(o.href,r)}})();class b{static getElement(t,e={throwIfNotFound:!0}){const i=document.querySelector(t);if(!i&&e.throwIfNotFound)throw new Error(e.errorMessage||`Element not found: ${t}`);return i}static getElements(t,e={throwIfNotFound:!1}){const i=Array.from(document.querySelectorAll(t));if(i.length===0&&e.throwIfNotFound)throw new Error(e.errorMessage||`No elements found: ${t}`);return i}static getElementById(t,e={throwIfNotFound:!1}){const i=document.getElementById(t);if(!i&&e.throwIfNotFound)throw new Error(e.errorMessage||`Element not found with ID: ${t}`);return i}static addEventListener(t,e,i,o){t.addEventListener(e,i,{signal:o})}static removeEventListener(t,e,i){t.removeEventListener(e,i)}static showError(t,e){this.setAriaInvalid(t,!!e);const i=this.findErrorElement(t);i&&this.updateErrorElement(i,e)}static setAriaInvalid(t,e){const i=e?"true":"false";t.classList.contains("radio-group")||t.classList.contains("checkbox-container")?t.querySelectorAll("input").forEach(r=>r.setAttribute("aria-invalid",i)):t.setAttribute("aria-invalid",i)}static findErrorElement(t){const e=t.getAttribute("aria-describedby");if(e)return this.getElementById(e);if(t.classList.contains("radio-group")||t.classList.contains("checkbox-container")){const o=t.querySelector(".error-message");if(o)return o}const i=t.closest(".form-field")||t.parentElement;return i&&i.querySelector(".error-message")||null}static setElementVisibility(t,e,i="block",o=!1,r="visible",s="hidden"){t.style.display=e?i:"none",t.setAttribute("aria-hidden",e?"false":"true"),o&&(e?(t.classList.add(r),t.classList.remove(s)):(t.classList.remove(r),t.classList.add(s)))}static updateErrorElement(t,e){t.textContent=e,t.style.display=e?"block":"none",t.setAttribute("aria-hidden",e?"false":"true"),e?(t.classList.add("error-visible"),t.classList.remove("error-hidden")):(t.classList.remove("error-visible"),t.classList.add("error-hidden"))}}class N{constructor(){u(this,"activeErrors",new Map)}showError(t,e,i="default"){b.showError(t,e),e?this.trackError(t,i):this.clearError(t,i)}trackError(t,e){var i;this.activeErrors.has(e)||this.activeErrors.set(e,new Set),(i=this.activeErrors.get(e))==null||i.add(t)}clearError(t,e){const i=this.activeErrors.get(e);i&&(i.delete(t),i.size===0&&this.activeErrors.delete(e))}clearErrorGroup(t){const e=this.activeErrors.get(t);e&&(e.forEach(i=>{b.showError(i,"")}),this.activeErrors.delete(t))}clearAllErrors(){for(const t of this.activeErrors.keys())this.clearErrorGroup(t)}hasErrors(t="default"){const e=this.activeErrors.get(t);return!!e&&e.size>0}getErrorCount(t="default"){var e;return((e=this.activeErrors.get(t))==null?void 0:e.size)||0}}class T{renderForm(){return document.body.innerHTML=`
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
    `,document.querySelector(".contact-form")}}class k{validateField(t,e){let i=!0,o="";switch(t){case"firstName":case"lastName":i=e.value.trim().length>0,o=i?"":"This field is required";break;case"email":const r=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,s=e.value;i=r.test(s),o=i?"":"Please enter a valid email address",s||(o="This field is required");break;case"queryType":i=e.value!=="",o=i?"":"Please select a query type";break;case"message":i=e.value.trim().length>0,o=i?"":"This field is required";break;case"consent":i=e.checked,o=i?"":"To submit this form, please consent to being contacted";break}return{isValid:i,errorMessage:o}}}var F=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function q(a){return a&&a.__esModule&&Object.prototype.hasOwnProperty.call(a,"default")?a.default:a}var g={exports:{}};/*!
 * Toastify js 1.12.0
 * https://github.com/apvarun/toastify-js
 * @license MIT licensed
 *
 * Copyright (C) 2018 Varun A P
 */(function(a){(function(t,e){a.exports?a.exports=e():t.Toastify=e()})(F,function(t){var e=function(s){return new e.lib.init(s)},i="1.12.0";e.defaults={oldestFirst:!0,text:"Toastify is awesome!",node:void 0,duration:3e3,selector:void 0,callback:function(){},destination:void 0,newWindow:!1,close:!1,gravity:"toastify-top",positionLeft:!1,position:"",backgroundColor:"",avatar:"",className:"",stopOnFocus:!0,onClick:function(){},offset:{x:0,y:0},escapeMarkup:!0,ariaLive:"polite",style:{background:""}},e.lib=e.prototype={toastify:i,constructor:e,init:function(s){return s||(s={}),this.options={},this.toastElement=null,this.options.text=s.text||e.defaults.text,this.options.node=s.node||e.defaults.node,this.options.duration=s.duration===0?0:s.duration||e.defaults.duration,this.options.selector=s.selector||e.defaults.selector,this.options.callback=s.callback||e.defaults.callback,this.options.destination=s.destination||e.defaults.destination,this.options.newWindow=s.newWindow||e.defaults.newWindow,this.options.close=s.close||e.defaults.close,this.options.gravity=s.gravity==="bottom"?"toastify-bottom":e.defaults.gravity,this.options.positionLeft=s.positionLeft||e.defaults.positionLeft,this.options.position=s.position||e.defaults.position,this.options.backgroundColor=s.backgroundColor||e.defaults.backgroundColor,this.options.avatar=s.avatar||e.defaults.avatar,this.options.className=s.className||e.defaults.className,this.options.stopOnFocus=s.stopOnFocus===void 0?e.defaults.stopOnFocus:s.stopOnFocus,this.options.onClick=s.onClick||e.defaults.onClick,this.options.offset=s.offset||e.defaults.offset,this.options.escapeMarkup=s.escapeMarkup!==void 0?s.escapeMarkup:e.defaults.escapeMarkup,this.options.ariaLive=s.ariaLive||e.defaults.ariaLive,this.options.style=s.style||e.defaults.style,s.backgroundColor&&(this.options.style.background=s.backgroundColor),this},buildToast:function(){if(!this.options)throw"Toastify is not initialized";var s=document.createElement("div");s.className="toastify on "+this.options.className,this.options.position?s.className+=" toastify-"+this.options.position:this.options.positionLeft===!0?(s.className+=" toastify-left",console.warn("Property `positionLeft` will be depreciated in further versions. Please use `position` instead.")):s.className+=" toastify-right",s.className+=" "+this.options.gravity,this.options.backgroundColor&&console.warn('DEPRECATION NOTICE: "backgroundColor" is being deprecated. Please use the "style.background" property.');for(var n in this.options.style)s.style[n]=this.options.style[n];if(this.options.ariaLive&&s.setAttribute("aria-live",this.options.ariaLive),this.options.node&&this.options.node.nodeType===Node.ELEMENT_NODE)s.appendChild(this.options.node);else if(this.options.escapeMarkup?s.innerText=this.options.text:s.innerHTML=this.options.text,this.options.avatar!==""){var f=document.createElement("img");f.src=this.options.avatar,f.className="toastify-avatar",this.options.position=="left"||this.options.positionLeft===!0?s.appendChild(f):s.insertAdjacentElement("afterbegin",f)}if(this.options.close===!0){var d=document.createElement("button");d.type="button",d.setAttribute("aria-label","Close"),d.className="toast-close",d.innerHTML="&#10006;",d.addEventListener("click",(function(m){m.stopPropagation(),this.removeElement(this.toastElement),window.clearTimeout(this.toastElement.timeOutValue)}).bind(this));var l=window.innerWidth>0?window.innerWidth:screen.width;(this.options.position=="left"||this.options.positionLeft===!0)&&l>360?s.insertAdjacentElement("afterbegin",d):s.appendChild(d)}if(this.options.stopOnFocus&&this.options.duration>0){var c=this;s.addEventListener("mouseover",function(m){window.clearTimeout(s.timeOutValue)}),s.addEventListener("mouseleave",function(){s.timeOutValue=window.setTimeout(function(){c.removeElement(s)},c.options.duration)})}if(typeof this.options.destination<"u"&&s.addEventListener("click",(function(m){m.stopPropagation(),this.options.newWindow===!0?window.open(this.options.destination,"_blank"):window.location=this.options.destination}).bind(this)),typeof this.options.onClick=="function"&&typeof this.options.destination>"u"&&s.addEventListener("click",(function(m){m.stopPropagation(),this.options.onClick()}).bind(this)),typeof this.options.offset=="object"){var p=o("x",this.options),h=o("y",this.options),y=this.options.position=="left"?p:"-"+p,E=this.options.gravity=="toastify-top"?h:"-"+h;s.style.transform="translate("+y+","+E+")"}return s},showToast:function(){this.toastElement=this.buildToast();var s;if(typeof this.options.selector=="string"?s=document.getElementById(this.options.selector):this.options.selector instanceof HTMLElement||typeof ShadowRoot<"u"&&this.options.selector instanceof ShadowRoot?s=this.options.selector:s=document.body,!s)throw"Root element is not defined";var n=e.defaults.oldestFirst?s.firstChild:s.lastChild;return s.insertBefore(this.toastElement,n),e.reposition(),this.options.duration>0&&(this.toastElement.timeOutValue=window.setTimeout((function(){this.removeElement(this.toastElement)}).bind(this),this.options.duration)),this},hideToast:function(){this.toastElement.timeOutValue&&clearTimeout(this.toastElement.timeOutValue),this.removeElement(this.toastElement)},removeElement:function(s){s.className=s.className.replace(" on",""),window.setTimeout((function(){this.options.node&&this.options.node.parentNode&&this.options.node.parentNode.removeChild(this.options.node),s.parentNode&&s.parentNode.removeChild(s),this.options.callback.call(s),e.reposition()}).bind(this),400)}},e.reposition=function(){for(var s={top:15,bottom:15},n={top:15,bottom:15},f={top:15,bottom:15},d=document.getElementsByClassName("toastify"),l,c=0;c<d.length;c++){r(d[c],"toastify-top")===!0?l="toastify-top":l="toastify-bottom";var p=d[c].offsetHeight;l=l.substr(9,l.length-1);var h=15,y=window.innerWidth>0?window.innerWidth:screen.width;y<=360?(d[c].style[l]=f[l]+"px",f[l]+=p+h):r(d[c],"toastify-left")===!0?(d[c].style[l]=s[l]+"px",s[l]+=p+h):(d[c].style[l]=n[l]+"px",n[l]+=p+h)}return this};function o(s,n){return n.offset[s]?isNaN(n.offset[s])?n.offset[s]:n.offset[s]+"px":"0px"}function r(s,n){return!s||typeof n!="string"?!1:!!(s.className&&s.className.trim().split(/\s+/gi).indexOf(n)>-1)}return e.lib.init.prototype=e.lib,e})})(g);var x=g.exports;const C=q(x),S="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='20'%20height='21'%20fill='none'%20viewBox='0%200%2020%2021'%3e%3cpath%20fill='%23fff'%20d='M14.28%207.72a.748.748%200%200%201%200%201.06l-5.25%205.25a.748.748%200%200%201-1.06%200l-2.25-2.25a.75.75%200%201%201%201.06-1.06l1.72%201.72%204.72-4.72a.75.75%200%200%201%201.06%200Zm5.47%202.78A9.75%209.75%200%201%201%2010%20.75a9.76%209.76%200%200%201%209.75%209.75Zm-1.5%200A8.25%208.25%200%201%200%2010%2018.75a8.26%208.26%200%200%200%208.25-8.25Z'/%3e%3c/svg%3e";class O{showSuccess(t){C({text:t,duration:5e3,gravity:"top",position:"center",avatar:S,className:"toast-success",escapeMarkup:!1,stopOnFocus:!0,style:{background:"hsl(187, 24%, 22%)",color:"hsl(0, 0%, 100%)",boxShadow:"0 10px 30px rgba(33, 33, 33, 0.1)",borderRadius:"4px",fontFamily:"Karla, sans-serif",top:"16px"},offset:{x:0,y:16}}).showToast()}}class A{constructor(){u(this,"form");u(this,"elements");u(this,"submitButton");u(this,"validator");u(this,"toastService");u(this,"errorHandler");u(this,"formRenderer");u(this,"abortController");this.validator=new k,this.toastService=new O,this.errorHandler=new N,this.formRenderer=new T,this.abortController=new AbortController}init(){this.form=this.formRenderer.renderForm(),this.setupElements(),this.setupEventListeners(),this.setInitialFocus()}setupElements(){this.elements={firstName:document.getElementById("first-name"),lastName:document.getElementById("last-name"),email:document.getElementById("email"),queryType:this.form.elements.namedItem("query-type"),message:document.getElementById("message"),consent:document.getElementById("consent")},this.submitButton=this.form.querySelector("button")}setupEventListeners(){const{signal:t}=this.abortController;b.addEventListener(this.form,"submit",this.handleSubmit.bind(this),t),Object.entries(this.elements).forEach(([e,i])=>{if(e==="queryType"){const o=i;Array.from(o).forEach(r=>{r instanceof HTMLInputElement&&b.addEventListener(r,"change",this.validateField.bind(this,e),t)})}else b.addEventListener(i,"input",this.validateField.bind(this,e),t),b.addEventListener(i,"blur",this.validateField.bind(this,e),t)})}setInitialFocus(){this.elements.firstName&&this.elements.firstName.focus()}validateField(t){const e=this.elements[t],{isValid:i,errorMessage:o}=this.validator.validateField(t,e);let r;return t==="queryType"?r=document.querySelector(".radio-group"):t==="consent"?r=document.querySelector(".checkbox-container"):r=e,this.errorHandler.showError(r,i?"":o),i}async handleSubmit(t){if(t.preventDefault(),this.submitButton.disabled)return;this.validateAllFields()&&await this.submitForm()}validateAllFields(){let t=!0;return Object.keys(this.elements).forEach(e=>{const i=e;this.validateField(i)||(t=!1)}),t}async submitForm(){this.disableSubmitButton("Sending...");try{await new Promise(e=>setTimeout(e,1500));const t=this.collectFormData();console.log("Form submitted:",t),this.handleSuccessfulSubmission()}catch(t){t instanceof Error?console.error(t.message):console.error("An unknown error occurred."),this.handleFailedSubmission()}}collectFormData(){return{firstName:this.elements.firstName.value,lastName:this.elements.lastName.value,email:this.elements.email.value,queryType:this.elements.queryType.value,message:this.elements.message.value,consent:this.elements.consent.checked}}disableSubmitButton(t){this.submitButton.disabled=!0,this.submitButton.textContent=t}disableFormElements(){Object.values(this.elements).forEach(t=>{if(t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement)t.disabled=!0;else if(t instanceof RadioNodeList){const e=document.querySelector(".radio-group");e&&e.classList.add("disabled"),Array.from(t).forEach(i=>{if(i instanceof HTMLInputElement){i.disabled=!0;const o=i.closest(".radio-option");o&&o.classList.add("disabled")}})}})}handleSuccessfulSubmission(){this.toastService.showSuccess(`
      <div class="toast-success-wrapper">
        <strong>Message Sent!</strong>
        <div class="toast-success-content">
          Thanks for completing the form. We'll be in touch soon!
        </div>
    </div>
    `),this.disableFormElements(),this.form.reset(),this.submitButton.textContent="Sent",this.submitButton.disabled=!0}handleFailedSubmission(){this.errorHandler.showError(this.form,"Failed to send message. Please try again."),this.submitButton.disabled=!1,this.submitButton.textContent="Submit"}cleanup(){this.abortController.abort(),this.abortController=new AbortController}}let v;document.addEventListener("DOMContentLoaded",()=>{v=new A,v.init()});window.addEventListener("beforeunload",()=>{v&&v.cleanup()});
//# sourceMappingURL=main-CJpvzGBC.js.map
