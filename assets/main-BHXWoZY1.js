var w=Object.defineProperty;var L=(r,s,t)=>s in r?w(r,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[s]=t;var f=(r,s,t)=>L(r,typeof s!="symbol"?s+"":s,t);(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const e of a.addedNodes)e.tagName==="LINK"&&e.rel==="modulepreload"&&o(e)}).observe(document,{childList:!0,subtree:!0});function t(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(i){if(i.ep)return;i.ep=!0;const a=t(i);fetch(i.href,a)}})();class c{static getElement(s){const t=document.querySelector(s);if(!t)throw new Error(`Element not found: ${s}`);return t}static getElements(s){return Array.from(document.querySelectorAll(s))}static addEventListener(s,t,o){s.addEventListener(t,o)}static removeEventListener(s,t,o){s.removeEventListener(t,o)}static showError(s,t){t?(s.setAttribute("aria-invalid","true"),(s.classList.contains("radio-group")||s.classList.contains("checkbox-container"))&&s.querySelectorAll("input").forEach(e=>e.setAttribute("aria-invalid","true"))):(s.setAttribute("aria-invalid","false"),(s.classList.contains("radio-group")||s.classList.contains("checkbox-container"))&&s.querySelectorAll("input").forEach(e=>e.setAttribute("aria-invalid","false")));const o=s.getAttribute("aria-describedby");if(o){const a=document.getElementById(o);if(a){this.updateErrorElement(a,s,t);return}}if(s.classList.contains("radio-group")||s.classList.contains("checkbox-container")){const a=s.querySelector(".error-message");a&&this.updateErrorElement(a,s,t);return}const i=s.nextElementSibling;if(i&&i.classList.contains("error-message"))this.updateErrorElement(i,s,t);else{const a=s.closest(".form-field")||s.parentElement;if(a){const e=a.querySelector(".error-message");e&&this.updateErrorElement(e,s,t)}}}static updateErrorElement(s,t,o){s.textContent=o,o?(s.style.display="block",s.setAttribute("aria-hidden","false"),t.setAttribute("aria-invalid","true")):(s.style.display="none",s.setAttribute("aria-hidden","true"),t.setAttribute("aria-invalid","false"))}}class x{showError(s,t){c.showError(s,t)}}class T{renderForm(){return document.body.innerHTML=`
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
                <span class="label-text" id="label-text">Query Type&nbsp;</span>
                <span class="required" aria-hidden="true">*</span>
              </legend>
              <div class="radio-option" id="radio-option-general" role="radio" aria-checked="false">
                <input
                  type="radio"
                  id="query-general"
                  name="query-type"
                  value="general"
                  aria-describedby="query-type-error"
                >
                <label for="query-general">General Enquiry</label>
              </div>
              <div class="radio-option" id="radio-option-support" role="radio" aria-checked="false">
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
    `,document.querySelector(".contact-form")}}class q{validateField(s,t){let o=!0,i="";switch(s){case"firstName":case"lastName":o=t.value.trim().length>=2,i=o?"":"This field is required";break;case"email":const a=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,e=t.value;o=a.test(e),i=o?"":"Please enter a valid email address",e||(i="This field is required");break;case"queryType":o=t.value!=="",i=o?"":"Please select a query type";break;case"message":o=t.value.trim().length>0,i=o?"":"This field is required";break;case"consent":o=t.checked,i=o?"":"To submit this form, please consent to being contacted";break}return{isValid:o,errorMessage:i}}}var N=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function k(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var g={exports:{}};/*!
 * Toastify js 1.12.0
 * https://github.com/apvarun/toastify-js
 * @license MIT licensed
 *
 * Copyright (C) 2018 Varun A P
 */(function(r){(function(s,t){r.exports?r.exports=t():s.Toastify=t()})(N,function(s){var t=function(e){return new t.lib.init(e)},o="1.12.0";t.defaults={oldestFirst:!0,text:"Toastify is awesome!",node:void 0,duration:3e3,selector:void 0,callback:function(){},destination:void 0,newWindow:!1,close:!1,gravity:"toastify-top",positionLeft:!1,position:"",backgroundColor:"",avatar:"",className:"",stopOnFocus:!0,onClick:function(){},offset:{x:0,y:0},escapeMarkup:!0,ariaLive:"polite",style:{background:""}},t.lib=t.prototype={toastify:o,constructor:t,init:function(e){return e||(e={}),this.options={},this.toastElement=null,this.options.text=e.text||t.defaults.text,this.options.node=e.node||t.defaults.node,this.options.duration=e.duration===0?0:e.duration||t.defaults.duration,this.options.selector=e.selector||t.defaults.selector,this.options.callback=e.callback||t.defaults.callback,this.options.destination=e.destination||t.defaults.destination,this.options.newWindow=e.newWindow||t.defaults.newWindow,this.options.close=e.close||t.defaults.close,this.options.gravity=e.gravity==="bottom"?"toastify-bottom":t.defaults.gravity,this.options.positionLeft=e.positionLeft||t.defaults.positionLeft,this.options.position=e.position||t.defaults.position,this.options.backgroundColor=e.backgroundColor||t.defaults.backgroundColor,this.options.avatar=e.avatar||t.defaults.avatar,this.options.className=e.className||t.defaults.className,this.options.stopOnFocus=e.stopOnFocus===void 0?t.defaults.stopOnFocus:e.stopOnFocus,this.options.onClick=e.onClick||t.defaults.onClick,this.options.offset=e.offset||t.defaults.offset,this.options.escapeMarkup=e.escapeMarkup!==void 0?e.escapeMarkup:t.defaults.escapeMarkup,this.options.ariaLive=e.ariaLive||t.defaults.ariaLive,this.options.style=e.style||t.defaults.style,e.backgroundColor&&(this.options.style.background=e.backgroundColor),this},buildToast:function(){if(!this.options)throw"Toastify is not initialized";var e=document.createElement("div");e.className="toastify on "+this.options.className,this.options.position?e.className+=" toastify-"+this.options.position:this.options.positionLeft===!0?(e.className+=" toastify-left",console.warn("Property `positionLeft` will be depreciated in further versions. Please use `position` instead.")):e.className+=" toastify-right",e.className+=" "+this.options.gravity,this.options.backgroundColor&&console.warn('DEPRECATION NOTICE: "backgroundColor" is being deprecated. Please use the "style.background" property.');for(var n in this.options.style)e.style[n]=this.options.style[n];if(this.options.ariaLive&&e.setAttribute("aria-live",this.options.ariaLive),this.options.node&&this.options.node.nodeType===Node.ELEMENT_NODE)e.appendChild(this.options.node);else if(this.options.escapeMarkup?e.innerText=this.options.text:e.innerHTML=this.options.text,this.options.avatar!==""){var p=document.createElement("img");p.src=this.options.avatar,p.className="toastify-avatar",this.options.position=="left"||this.options.positionLeft===!0?e.appendChild(p):e.insertAdjacentElement("afterbegin",p)}if(this.options.close===!0){var d=document.createElement("button");d.type="button",d.setAttribute("aria-label","Close"),d.className="toast-close",d.innerHTML="&#10006;",d.addEventListener("click",(function(b){b.stopPropagation(),this.removeElement(this.toastElement),window.clearTimeout(this.toastElement.timeOutValue)}).bind(this));var l=window.innerWidth>0?window.innerWidth:screen.width;(this.options.position=="left"||this.options.positionLeft===!0)&&l>360?e.insertAdjacentElement("afterbegin",d):e.appendChild(d)}if(this.options.stopOnFocus&&this.options.duration>0){var u=this;e.addEventListener("mouseover",function(b){window.clearTimeout(e.timeOutValue)}),e.addEventListener("mouseleave",function(){e.timeOutValue=window.setTimeout(function(){u.removeElement(e)},u.options.duration)})}if(typeof this.options.destination<"u"&&e.addEventListener("click",(function(b){b.stopPropagation(),this.options.newWindow===!0?window.open(this.options.destination,"_blank"):window.location=this.options.destination}).bind(this)),typeof this.options.onClick=="function"&&typeof this.options.destination>"u"&&e.addEventListener("click",(function(b){b.stopPropagation(),this.options.onClick()}).bind(this)),typeof this.options.offset=="object"){var h=i("x",this.options),m=i("y",this.options),y=this.options.position=="left"?h:"-"+h,E=this.options.gravity=="toastify-top"?m:"-"+m;e.style.transform="translate("+y+","+E+")"}return e},showToast:function(){this.toastElement=this.buildToast();var e;if(typeof this.options.selector=="string"?e=document.getElementById(this.options.selector):this.options.selector instanceof HTMLElement||typeof ShadowRoot<"u"&&this.options.selector instanceof ShadowRoot?e=this.options.selector:e=document.body,!e)throw"Root element is not defined";var n=t.defaults.oldestFirst?e.firstChild:e.lastChild;return e.insertBefore(this.toastElement,n),t.reposition(),this.options.duration>0&&(this.toastElement.timeOutValue=window.setTimeout((function(){this.removeElement(this.toastElement)}).bind(this),this.options.duration)),this},hideToast:function(){this.toastElement.timeOutValue&&clearTimeout(this.toastElement.timeOutValue),this.removeElement(this.toastElement)},removeElement:function(e){e.className=e.className.replace(" on",""),window.setTimeout((function(){this.options.node&&this.options.node.parentNode&&this.options.node.parentNode.removeChild(this.options.node),e.parentNode&&e.parentNode.removeChild(e),this.options.callback.call(e),t.reposition()}).bind(this),400)}},t.reposition=function(){for(var e={top:15,bottom:15},n={top:15,bottom:15},p={top:15,bottom:15},d=document.getElementsByClassName("toastify"),l,u=0;u<d.length;u++){a(d[u],"toastify-top")===!0?l="toastify-top":l="toastify-bottom";var h=d[u].offsetHeight;l=l.substr(9,l.length-1);var m=15,y=window.innerWidth>0?window.innerWidth:screen.width;y<=360?(d[u].style[l]=p[l]+"px",p[l]+=h+m):a(d[u],"toastify-left")===!0?(d[u].style[l]=e[l]+"px",e[l]+=h+m):(d[u].style[l]=n[l]+"px",n[l]+=h+m)}return this};function i(e,n){return n.offset[e]?isNaN(n.offset[e])?n.offset[e]:n.offset[e]+"px":"0px"}function a(e,n){return!e||typeof n!="string"?!1:!!(e.className&&e.className.trim().split(/\s+/gi).indexOf(n)>-1)}return t.lib.init.prototype=t.lib,t})})(g);var F=g.exports;const S=k(F),C="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='20'%20height='21'%20fill='none'%20viewBox='0%200%2020%2021'%3e%3cpath%20fill='%23fff'%20d='M14.28%207.72a.748.748%200%200%201%200%201.06l-5.25%205.25a.748.748%200%200%201-1.06%200l-2.25-2.25a.75.75%200%201%201%201.06-1.06l1.72%201.72%204.72-4.72a.75.75%200%200%201%201.06%200Zm5.47%202.78A9.75%209.75%200%201%201%2010%20.75a9.76%209.76%200%200%201%209.75%209.75Zm-1.5%200A8.25%208.25%200%201%200%2010%2018.75a8.26%208.26%200%200%200%208.25-8.25Z'/%3e%3c/svg%3e";class O{showSuccess(s){S({text:s,duration:5e3,gravity:"top",position:"center",avatar:C,className:"toast-success",style:{background:"hsl(187, 24%, 22%)",color:"hsl(0, 0%, 100%)",boxShadow:"0 10px 30px rgba(33, 33, 33, 0.1)",borderRadius:"4px",fontFamily:"Karla, sans-serif",top:"16px"},offset:{x:0,y:16}}).showToast()}}class A{constructor(){f(this,"form");f(this,"elements");f(this,"submitButton");f(this,"validator");f(this,"toastService");f(this,"errorHandler");f(this,"formRenderer");this.validator=new q,this.toastService=new O,this.errorHandler=new x,this.formRenderer=new T}init(){this.form=this.formRenderer.renderForm(),this.setupElements(),this.setupEventListeners(),this.setInitialFocus()}setupElements(){this.elements={firstName:document.getElementById("first-name"),lastName:document.getElementById("last-name"),email:document.getElementById("email"),queryType:this.form.elements.namedItem("query-type"),message:document.getElementById("message"),consent:document.getElementById("consent")},this.submitButton=this.form.querySelector("button")}setupEventListeners(){c.addEventListener(this.form,"submit",this.handleSubmit.bind(this)),Object.entries(this.elements).forEach(([s,t])=>{if(s==="queryType"){const o=t;Array.from(o).forEach(i=>{i instanceof HTMLInputElement&&c.addEventListener(i,"change",()=>this.validateField(s))})}else c.addEventListener(t,"input",()=>this.validateField(s)),c.addEventListener(t,"blur",()=>this.validateField(s))})}setInitialFocus(){this.elements.firstName&&this.elements.firstName.focus()}validateField(s){const t=this.elements[s],{isValid:o,errorMessage:i}=this.validator.validateField(s,t);let a;return s==="queryType"?a=document.querySelector(".radio-group"):s==="consent"?a=document.querySelector(".checkbox-container"):a=t,this.errorHandler.showError(a,o?"":i),o}async handleSubmit(s){if(s.preventDefault(),this.submitButton.disabled)return;this.validateAllFields()&&await this.submitForm()}validateAllFields(){return Object.keys(this.elements).every(s=>this.validateField(s))}async submitForm(){this.disableSubmitButton("Sending...");try{await new Promise(t=>setTimeout(t,1500));const s=this.collectFormData();console.log("Form submitted:",s),this.handleSuccessfulSubmission()}catch{this.handleFailedSubmission()}}collectFormData(){return{firstName:this.elements.firstName.value,lastName:this.elements.lastName.value,email:this.elements.email.value,queryType:this.elements.queryType.value,message:this.elements.message.value,consent:this.elements.consent.checked}}disableSubmitButton(s){this.submitButton.disabled=!0,this.submitButton.textContent=s}handleSuccessfulSubmission(){this.toastService.showSuccess("Thanks for completing the form. We'll be in touch soon!"),this.form.reset(),this.submitButton.textContent="Sent",this.submitButton.disabled=!0}handleFailedSubmission(){this.errorHandler.showError(this.form,"Failed to send message. Please try again."),this.submitButton.disabled=!1,this.submitButton.textContent="Submit"}cleanup(){c.removeEventListener(this.form,"submit",this.handleSubmit.bind(this)),Object.entries(this.elements).forEach(([s,t])=>{if(s==="queryType"){const o=t;Array.from(o).forEach(i=>{i instanceof HTMLInputElement&&c.removeEventListener(i,"change",()=>this.validateField(s))})}else c.removeEventListener(t,"input",()=>this.validateField(s)),c.removeEventListener(t,"blur",()=>this.validateField(s))})}}let v;document.addEventListener("DOMContentLoaded",()=>{v=new A,v.init()});window.addEventListener("beforeunload",()=>{v&&v.cleanup()});
//# sourceMappingURL=main-BHXWoZY1.js.map
