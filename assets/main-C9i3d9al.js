var w=Object.defineProperty;var L=(n,t,e)=>t in n?w(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var u=(n,t,e)=>L(n,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function e(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(r){if(r.ep)return;r.ep=!0;const o=e(r);fetch(r.href,o)}})();class f{static getElement(t,e={throwIfNotFound:!0}){const i=document.querySelector(t);if(!i&&e.throwIfNotFound)throw new Error(e.errorMessage||`Element not found: ${t}`);return i}static getElements(t,e={throwIfNotFound:!1}){const i=Array.from(document.querySelectorAll(t));if(i.length===0&&e.throwIfNotFound)throw new Error(e.errorMessage||`No elements found: ${t}`);return i}static getElementById(t,e={throwIfNotFound:!1}){const i=document.getElementById(t);if(!i&&e.throwIfNotFound)throw new Error(e.errorMessage||`Element not found with ID: ${t}`);return i}static addEventListener(t,e,i){t.addEventListener(e,i)}static removeEventListener(t,e,i){t.removeEventListener(e,i)}static showError(t,e){this.setAriaInvalid(t,!!e);const i=this.findErrorElement(t);i&&this.updateErrorElement(i,e)}static setAriaInvalid(t,e){const i=e?"true":"false";t.classList.contains("radio-group")||t.classList.contains("checkbox-container")?t.querySelectorAll("input").forEach(o=>o.setAttribute("aria-invalid",i)):t.setAttribute("aria-invalid",i)}static findErrorElement(t){const e=t.getAttribute("aria-describedby");if(e)return this.getElementById(e);if(t.classList.contains("radio-group")||t.classList.contains("checkbox-container")){const r=t.querySelector(".error-message");if(r)return r}const i=t.closest(".form-field")||t.parentElement;return i&&i.querySelector(".error-message")||null}static setElementVisibility(t,e,i="block",r=!1,o="visible",s="hidden"){t.style.display=e?i:"none",t.setAttribute("aria-hidden",e?"false":"true"),r&&(e?(t.classList.add(o),t.classList.remove(s)):(t.classList.remove(o),t.classList.add(s)))}static updateErrorElement(t,e){t.textContent=e,t.style.display=e?"block":"none",t.setAttribute("aria-hidden",e?"false":"true"),e?(t.classList.add("error-visible"),t.classList.remove("error-hidden")):(t.classList.remove("error-visible"),t.classList.add("error-hidden"))}}class T{constructor(){u(this,"activeErrors",new Map)}showError(t,e,i="default"){f.showError(t,e),e?this.trackError(t,i):this.clearError(t,i)}trackError(t,e){var i;this.activeErrors.has(e)||this.activeErrors.set(e,new Set),(i=this.activeErrors.get(e))==null||i.add(t)}clearError(t,e){const i=this.activeErrors.get(e);i&&(i.delete(t),i.size===0&&this.activeErrors.delete(e))}clearErrorGroup(t){const e=this.activeErrors.get(t);e&&(e.forEach(i=>{f.showError(i,"")}),this.activeErrors.delete(t))}clearAllErrors(){for(const t of this.activeErrors.keys())this.clearErrorGroup(t)}hasErrors(t="default"){const e=this.activeErrors.get(t);return!!e&&e.size>0}getErrorCount(t="default"){var e;return((e=this.activeErrors.get(t))==null?void 0:e.size)||0}}class N{renderForm(){return document.body.innerHTML=`
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
    `,document.querySelector(".contact-form")}}class F{validateField(t,e){let i=!0,r="";switch(t){case"firstName":case"lastName":i=e.value.trim().length>0,r=i?"":"This field is required";break;case"email":const o=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,s=e.value;i=o.test(s),r=i?"":"Please enter a valid email address",s||(r="This field is required");break;case"queryType":i=e.value!=="",r=i?"":"Please select a query type";break;case"message":i=e.value.trim().length>0,r=i?"":"This field is required";break;case"consent":i=e.checked,r=i?"":"To submit this form, please consent to being contacted";break}return{isValid:i,errorMessage:r}}}var q=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function x(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var g={exports:{}};/*!
 * Toastify js 1.12.0
 * https://github.com/apvarun/toastify-js
 * @license MIT licensed
 *
 * Copyright (C) 2018 Varun A P
 */(function(n){(function(t,e){n.exports?n.exports=e():t.Toastify=e()})(q,function(t){var e=function(s){return new e.lib.init(s)},i="1.12.0";e.defaults={oldestFirst:!0,text:"Toastify is awesome!",node:void 0,duration:3e3,selector:void 0,callback:function(){},destination:void 0,newWindow:!1,close:!1,gravity:"toastify-top",positionLeft:!1,position:"",backgroundColor:"",avatar:"",className:"",stopOnFocus:!0,onClick:function(){},offset:{x:0,y:0},escapeMarkup:!0,ariaLive:"polite",style:{background:""}},e.lib=e.prototype={toastify:i,constructor:e,init:function(s){return s||(s={}),this.options={},this.toastElement=null,this.options.text=s.text||e.defaults.text,this.options.node=s.node||e.defaults.node,this.options.duration=s.duration===0?0:s.duration||e.defaults.duration,this.options.selector=s.selector||e.defaults.selector,this.options.callback=s.callback||e.defaults.callback,this.options.destination=s.destination||e.defaults.destination,this.options.newWindow=s.newWindow||e.defaults.newWindow,this.options.close=s.close||e.defaults.close,this.options.gravity=s.gravity==="bottom"?"toastify-bottom":e.defaults.gravity,this.options.positionLeft=s.positionLeft||e.defaults.positionLeft,this.options.position=s.position||e.defaults.position,this.options.backgroundColor=s.backgroundColor||e.defaults.backgroundColor,this.options.avatar=s.avatar||e.defaults.avatar,this.options.className=s.className||e.defaults.className,this.options.stopOnFocus=s.stopOnFocus===void 0?e.defaults.stopOnFocus:s.stopOnFocus,this.options.onClick=s.onClick||e.defaults.onClick,this.options.offset=s.offset||e.defaults.offset,this.options.escapeMarkup=s.escapeMarkup!==void 0?s.escapeMarkup:e.defaults.escapeMarkup,this.options.ariaLive=s.ariaLive||e.defaults.ariaLive,this.options.style=s.style||e.defaults.style,s.backgroundColor&&(this.options.style.background=s.backgroundColor),this},buildToast:function(){if(!this.options)throw"Toastify is not initialized";var s=document.createElement("div");s.className="toastify on "+this.options.className,this.options.position?s.className+=" toastify-"+this.options.position:this.options.positionLeft===!0?(s.className+=" toastify-left",console.warn("Property `positionLeft` will be depreciated in further versions. Please use `position` instead.")):s.className+=" toastify-right",s.className+=" "+this.options.gravity,this.options.backgroundColor&&console.warn('DEPRECATION NOTICE: "backgroundColor" is being deprecated. Please use the "style.background" property.');for(var a in this.options.style)s.style[a]=this.options.style[a];if(this.options.ariaLive&&s.setAttribute("aria-live",this.options.ariaLive),this.options.node&&this.options.node.nodeType===Node.ELEMENT_NODE)s.appendChild(this.options.node);else if(this.options.escapeMarkup?s.innerText=this.options.text:s.innerHTML=this.options.text,this.options.avatar!==""){var p=document.createElement("img");p.src=this.options.avatar,p.className="toastify-avatar",this.options.position=="left"||this.options.positionLeft===!0?s.appendChild(p):s.insertAdjacentElement("afterbegin",p)}if(this.options.close===!0){var d=document.createElement("button");d.type="button",d.setAttribute("aria-label","Close"),d.className="toast-close",d.innerHTML="&#10006;",d.addEventListener("click",(function(b){b.stopPropagation(),this.removeElement(this.toastElement),window.clearTimeout(this.toastElement.timeOutValue)}).bind(this));var l=window.innerWidth>0?window.innerWidth:screen.width;(this.options.position=="left"||this.options.positionLeft===!0)&&l>360?s.insertAdjacentElement("afterbegin",d):s.appendChild(d)}if(this.options.stopOnFocus&&this.options.duration>0){var c=this;s.addEventListener("mouseover",function(b){window.clearTimeout(s.timeOutValue)}),s.addEventListener("mouseleave",function(){s.timeOutValue=window.setTimeout(function(){c.removeElement(s)},c.options.duration)})}if(typeof this.options.destination<"u"&&s.addEventListener("click",(function(b){b.stopPropagation(),this.options.newWindow===!0?window.open(this.options.destination,"_blank"):window.location=this.options.destination}).bind(this)),typeof this.options.onClick=="function"&&typeof this.options.destination>"u"&&s.addEventListener("click",(function(b){b.stopPropagation(),this.options.onClick()}).bind(this)),typeof this.options.offset=="object"){var h=r("x",this.options),m=r("y",this.options),y=this.options.position=="left"?h:"-"+h,E=this.options.gravity=="toastify-top"?m:"-"+m;s.style.transform="translate("+y+","+E+")"}return s},showToast:function(){this.toastElement=this.buildToast();var s;if(typeof this.options.selector=="string"?s=document.getElementById(this.options.selector):this.options.selector instanceof HTMLElement||typeof ShadowRoot<"u"&&this.options.selector instanceof ShadowRoot?s=this.options.selector:s=document.body,!s)throw"Root element is not defined";var a=e.defaults.oldestFirst?s.firstChild:s.lastChild;return s.insertBefore(this.toastElement,a),e.reposition(),this.options.duration>0&&(this.toastElement.timeOutValue=window.setTimeout((function(){this.removeElement(this.toastElement)}).bind(this),this.options.duration)),this},hideToast:function(){this.toastElement.timeOutValue&&clearTimeout(this.toastElement.timeOutValue),this.removeElement(this.toastElement)},removeElement:function(s){s.className=s.className.replace(" on",""),window.setTimeout((function(){this.options.node&&this.options.node.parentNode&&this.options.node.parentNode.removeChild(this.options.node),s.parentNode&&s.parentNode.removeChild(s),this.options.callback.call(s),e.reposition()}).bind(this),400)}},e.reposition=function(){for(var s={top:15,bottom:15},a={top:15,bottom:15},p={top:15,bottom:15},d=document.getElementsByClassName("toastify"),l,c=0;c<d.length;c++){o(d[c],"toastify-top")===!0?l="toastify-top":l="toastify-bottom";var h=d[c].offsetHeight;l=l.substr(9,l.length-1);var m=15,y=window.innerWidth>0?window.innerWidth:screen.width;y<=360?(d[c].style[l]=p[l]+"px",p[l]+=h+m):o(d[c],"toastify-left")===!0?(d[c].style[l]=s[l]+"px",s[l]+=h+m):(d[c].style[l]=a[l]+"px",a[l]+=h+m)}return this};function r(s,a){return a.offset[s]?isNaN(a.offset[s])?a.offset[s]:a.offset[s]+"px":"0px"}function o(s,a){return!s||typeof a!="string"?!1:!!(s.className&&s.className.trim().split(/\s+/gi).indexOf(a)>-1)}return e.lib.init.prototype=e.lib,e})})(g);var k=g.exports;const S=x(k),C="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='20'%20height='21'%20fill='none'%20viewBox='0%200%2020%2021'%3e%3cpath%20fill='%23fff'%20d='M14.28%207.72a.748.748%200%200%201%200%201.06l-5.25%205.25a.748.748%200%200%201-1.06%200l-2.25-2.25a.75.75%200%201%201%201.06-1.06l1.72%201.72%204.72-4.72a.75.75%200%200%201%201.06%200Zm5.47%202.78A9.75%209.75%200%201%201%2010%20.75a9.76%209.76%200%200%201%209.75%209.75Zm-1.5%200A8.25%208.25%200%201%200%2010%2018.75a8.26%208.26%200%200%200%208.25-8.25Z'/%3e%3c/svg%3e";class O{showSuccess(t){S({text:t,duration:5e3,gravity:"top",position:"center",avatar:C,className:"toast-success",escapeMarkup:!1,stopOnFocus:!0,style:{background:"hsl(187, 24%, 22%)",color:"hsl(0, 0%, 100%)",boxShadow:"0 10px 30px rgba(33, 33, 33, 0.1)",borderRadius:"4px",fontFamily:"Karla, sans-serif",top:"16px"},offset:{x:0,y:16}}).showToast()}}class M{constructor(){u(this,"form");u(this,"elements");u(this,"submitButton");u(this,"validator");u(this,"toastService");u(this,"errorHandler");u(this,"formRenderer");u(this,"eventHandlers",{});this.validator=new F,this.toastService=new O,this.errorHandler=new T,this.formRenderer=new N}init(){this.form=this.formRenderer.renderForm(),this.setupElements(),this.setupEventListeners(),this.setInitialFocus()}setupElements(){this.elements={firstName:document.getElementById("first-name"),lastName:document.getElementById("last-name"),email:document.getElementById("email"),queryType:this.form.elements.namedItem("query-type"),message:document.getElementById("message"),consent:document.getElementById("consent")},this.submitButton=this.form.querySelector("button")}setupEventListeners(){this.eventHandlers["form-submit"]=this.handleSubmit.bind(this),f.addEventListener(this.form,"submit",this.eventHandlers["form-submit"]),Object.entries(this.elements).forEach(([t,e])=>{if(t==="queryType"){const i=e;Array.from(i).forEach((r,o)=>{if(r instanceof HTMLInputElement){const s=`${t}-change-${o}`;this.eventHandlers[s]=this.validateField.bind(this,t),f.addEventListener(r,"change",this.eventHandlers[s])}})}else{const i=`${t}-input`,r=`${t}-blur`;this.eventHandlers[i]=this.validateField.bind(this,t),this.eventHandlers[r]=this.validateField.bind(this,t),f.addEventListener(e,"input",this.eventHandlers[i]),f.addEventListener(e,"blur",this.eventHandlers[r])}})}setInitialFocus(){this.elements.firstName&&this.elements.firstName.focus()}validateField(t){const e=this.elements[t],{isValid:i,errorMessage:r}=this.validator.validateField(t,e);let o;return t==="queryType"?o=document.querySelector(".radio-group"):t==="consent"?o=document.querySelector(".checkbox-container"):o=e,this.errorHandler.showError(o,i?"":r),i}async handleSubmit(t){if(t.preventDefault(),this.submitButton.disabled)return;this.validateAllFields()&&await this.submitForm()}validateAllFields(){let t=!0;return Object.keys(this.elements).forEach(e=>{const i=e;this.validateField(i)||(t=!1)}),t}async submitForm(){this.disableSubmitButton("Sending...");try{await new Promise(e=>setTimeout(e,1500));const t=this.collectFormData();console.log("Form submitted:",t),this.handleSuccessfulSubmission()}catch(t){t instanceof Error?console.error(t.message):console.error("An unknown error occurred."),this.handleFailedSubmission()}}collectFormData(){return{firstName:this.elements.firstName.value,lastName:this.elements.lastName.value,email:this.elements.email.value,queryType:this.elements.queryType.value,message:this.elements.message.value,consent:this.elements.consent.checked}}disableSubmitButton(t){this.submitButton.disabled=!0,this.submitButton.textContent=t}disableFormElements(){Object.values(this.elements).forEach(t=>{t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement?t.disabled=!0:t instanceof RadioNodeList&&Array.from(t).forEach(e=>{e instanceof HTMLInputElement&&(e.disabled=!0)})})}handleSuccessfulSubmission(){this.toastService.showSuccess(`
      <div class="toast-success-wrapper">
        <strong>Message Sent!</strong>
        <div class="toast-success-content">
          Thanks for completing the form. We'll be in touch soon!
        </div>
    </div>
    `),this.disableFormElements(),this.form.reset(),this.submitButton.textContent="Sent",this.submitButton.disabled=!0}handleFailedSubmission(){this.errorHandler.showError(this.form,"Failed to send message. Please try again."),this.submitButton.disabled=!1,this.submitButton.textContent="Submit"}cleanup(){f.removeEventListener(this.form,"submit",this.eventHandlers["form-submit"]),Object.entries(this.elements).forEach(([t,e])=>{if(t==="queryType"){const i=e;Array.from(i).forEach((r,o)=>{if(r instanceof HTMLInputElement){const s=`${t}-change-${o}`;f.removeEventListener(r,"change",this.eventHandlers[s])}})}else{const i=`${t}-input`,r=`${t}-blur`;f.removeEventListener(e,"input",this.eventHandlers[i]),f.removeEventListener(e,"blur",this.eventHandlers[r])}})}}let v;document.addEventListener("DOMContentLoaded",()=>{v=new M,v.init()});window.addEventListener("beforeunload",()=>{v&&v.cleanup()});
//# sourceMappingURL=main-C9i3d9al.js.map
