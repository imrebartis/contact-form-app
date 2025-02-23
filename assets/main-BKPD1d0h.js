var g=Object.defineProperty;var w=(r,i,t)=>i in r?g(r,i,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[i]=t;var p=(r,i,t)=>w(r,typeof i!="symbol"?i+"":i,t);(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const e of a.addedNodes)e.tagName==="LINK"&&e.rel==="modulepreload"&&o(e)}).observe(document,{childList:!0,subtree:!0});function t(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(s){if(s.ep)return;s.ep=!0;const a=t(s);fetch(s.href,a)}})();class E{showError(i,t){var a;const o=i.getAttribute("aria-describedby")||((a=i.querySelector("[aria-describedby]"))==null?void 0:a.getAttribute("aria-describedby")),s=document.getElementById(o||"");s&&(s.textContent=t,s.style.display=t?"block":"none",s.setAttribute("aria-hidden",(!t).toString())),i.classList.contains("radio-group")?i.querySelectorAll('input[type="radio"]').forEach(n=>{n.setAttribute("aria-invalid",t?"true":"false")}):i.setAttribute("aria-invalid",t?"true":"false")}}class T{renderForm(){return document.body.innerHTML=`
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
            <div class="checkbox-wrapper" role="group">
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
    `,document.querySelector(".contact-form")}}class x{validateField(i,t){let o=!0,s="";switch(i){case"firstName":case"lastName":o=t.value.trim().length>=2,s=o?"":"This field is required";break;case"email":const a=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,e=t.value;o=a.test(e),s=o?"":"Please enter a valid email address",e||(s="This field is required");break;case"queryType":o=t.value!=="",s=o?"":"Please select a query type";break;case"message":o=t.value.trim().length>0,s=o?"":"This field is required";break;case"consent":o=t.checked,s=o?"":"To submit this form, please consent to being contacted";break}return{isValid:o,errorMessage:s}}}var L=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function N(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var y={exports:{}};/*!
 * Toastify js 1.12.0
 * https://github.com/apvarun/toastify-js
 * @license MIT licensed
 *
 * Copyright (C) 2018 Varun A P
 */(function(r){(function(i,t){r.exports?r.exports=t():i.Toastify=t()})(L,function(i){var t=function(e){return new t.lib.init(e)},o="1.12.0";t.defaults={oldestFirst:!0,text:"Toastify is awesome!",node:void 0,duration:3e3,selector:void 0,callback:function(){},destination:void 0,newWindow:!1,close:!1,gravity:"toastify-top",positionLeft:!1,position:"",backgroundColor:"",avatar:"",className:"",stopOnFocus:!0,onClick:function(){},offset:{x:0,y:0},escapeMarkup:!0,ariaLive:"polite",style:{background:""}},t.lib=t.prototype={toastify:o,constructor:t,init:function(e){return e||(e={}),this.options={},this.toastElement=null,this.options.text=e.text||t.defaults.text,this.options.node=e.node||t.defaults.node,this.options.duration=e.duration===0?0:e.duration||t.defaults.duration,this.options.selector=e.selector||t.defaults.selector,this.options.callback=e.callback||t.defaults.callback,this.options.destination=e.destination||t.defaults.destination,this.options.newWindow=e.newWindow||t.defaults.newWindow,this.options.close=e.close||t.defaults.close,this.options.gravity=e.gravity==="bottom"?"toastify-bottom":t.defaults.gravity,this.options.positionLeft=e.positionLeft||t.defaults.positionLeft,this.options.position=e.position||t.defaults.position,this.options.backgroundColor=e.backgroundColor||t.defaults.backgroundColor,this.options.avatar=e.avatar||t.defaults.avatar,this.options.className=e.className||t.defaults.className,this.options.stopOnFocus=e.stopOnFocus===void 0?t.defaults.stopOnFocus:e.stopOnFocus,this.options.onClick=e.onClick||t.defaults.onClick,this.options.offset=e.offset||t.defaults.offset,this.options.escapeMarkup=e.escapeMarkup!==void 0?e.escapeMarkup:t.defaults.escapeMarkup,this.options.ariaLive=e.ariaLive||t.defaults.ariaLive,this.options.style=e.style||t.defaults.style,e.backgroundColor&&(this.options.style.background=e.backgroundColor),this},buildToast:function(){if(!this.options)throw"Toastify is not initialized";var e=document.createElement("div");e.className="toastify on "+this.options.className,this.options.position?e.className+=" toastify-"+this.options.position:this.options.positionLeft===!0?(e.className+=" toastify-left",console.warn("Property `positionLeft` will be depreciated in further versions. Please use `position` instead.")):e.className+=" toastify-right",e.className+=" "+this.options.gravity,this.options.backgroundColor&&console.warn('DEPRECATION NOTICE: "backgroundColor" is being deprecated. Please use the "style.background" property.');for(var n in this.options.style)e.style[n]=this.options.style[n];if(this.options.ariaLive&&e.setAttribute("aria-live",this.options.ariaLive),this.options.node&&this.options.node.nodeType===Node.ELEMENT_NODE)e.appendChild(this.options.node);else if(this.options.escapeMarkup?e.innerText=this.options.text:e.innerHTML=this.options.text,this.options.avatar!==""){var c=document.createElement("img");c.src=this.options.avatar,c.className="toastify-avatar",this.options.position=="left"||this.options.positionLeft===!0?e.appendChild(c):e.insertAdjacentElement("afterbegin",c)}if(this.options.close===!0){var d=document.createElement("button");d.type="button",d.setAttribute("aria-label","Close"),d.className="toast-close",d.innerHTML="&#10006;",d.addEventListener("click",(function(h){h.stopPropagation(),this.removeElement(this.toastElement),window.clearTimeout(this.toastElement.timeOutValue)}).bind(this));var l=window.innerWidth>0?window.innerWidth:screen.width;(this.options.position=="left"||this.options.positionLeft===!0)&&l>360?e.insertAdjacentElement("afterbegin",d):e.appendChild(d)}if(this.options.stopOnFocus&&this.options.duration>0){var u=this;e.addEventListener("mouseover",function(h){window.clearTimeout(e.timeOutValue)}),e.addEventListener("mouseleave",function(){e.timeOutValue=window.setTimeout(function(){u.removeElement(e)},u.options.duration)})}if(typeof this.options.destination<"u"&&e.addEventListener("click",(function(h){h.stopPropagation(),this.options.newWindow===!0?window.open(this.options.destination,"_blank"):window.location=this.options.destination}).bind(this)),typeof this.options.onClick=="function"&&typeof this.options.destination>"u"&&e.addEventListener("click",(function(h){h.stopPropagation(),this.options.onClick()}).bind(this)),typeof this.options.offset=="object"){var f=s("x",this.options),m=s("y",this.options),b=this.options.position=="left"?f:"-"+f,v=this.options.gravity=="toastify-top"?m:"-"+m;e.style.transform="translate("+b+","+v+")"}return e},showToast:function(){this.toastElement=this.buildToast();var e;if(typeof this.options.selector=="string"?e=document.getElementById(this.options.selector):this.options.selector instanceof HTMLElement||typeof ShadowRoot<"u"&&this.options.selector instanceof ShadowRoot?e=this.options.selector:e=document.body,!e)throw"Root element is not defined";var n=t.defaults.oldestFirst?e.firstChild:e.lastChild;return e.insertBefore(this.toastElement,n),t.reposition(),this.options.duration>0&&(this.toastElement.timeOutValue=window.setTimeout((function(){this.removeElement(this.toastElement)}).bind(this),this.options.duration)),this},hideToast:function(){this.toastElement.timeOutValue&&clearTimeout(this.toastElement.timeOutValue),this.removeElement(this.toastElement)},removeElement:function(e){e.className=e.className.replace(" on",""),window.setTimeout((function(){this.options.node&&this.options.node.parentNode&&this.options.node.parentNode.removeChild(this.options.node),e.parentNode&&e.parentNode.removeChild(e),this.options.callback.call(e),t.reposition()}).bind(this),400)}},t.reposition=function(){for(var e={top:15,bottom:15},n={top:15,bottom:15},c={top:15,bottom:15},d=document.getElementsByClassName("toastify"),l,u=0;u<d.length;u++){a(d[u],"toastify-top")===!0?l="toastify-top":l="toastify-bottom";var f=d[u].offsetHeight;l=l.substr(9,l.length-1);var m=15,b=window.innerWidth>0?window.innerWidth:screen.width;b<=360?(d[u].style[l]=c[l]+"px",c[l]+=f+m):a(d[u],"toastify-left")===!0?(d[u].style[l]=e[l]+"px",e[l]+=f+m):(d[u].style[l]=n[l]+"px",n[l]+=f+m)}return this};function s(e,n){return n.offset[e]?isNaN(n.offset[e])?n.offset[e]:n.offset[e]+"px":"0px"}function a(e,n){return!e||typeof n!="string"?!1:!!(e.className&&e.className.trim().split(/\s+/gi).indexOf(n)>-1)}return t.lib.init.prototype=t.lib,t})})(y);var k=y.exports;const q=N(k),C="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='20'%20height='21'%20fill='none'%20viewBox='0%200%2020%2021'%3e%3cpath%20fill='%23fff'%20d='M14.28%207.72a.748.748%200%200%201%200%201.06l-5.25%205.25a.748.748%200%200%201-1.06%200l-2.25-2.25a.75.75%200%201%201%201.06-1.06l1.72%201.72%204.72-4.72a.75.75%200%200%201%201.06%200Zm5.47%202.78A9.75%209.75%200%201%201%2010%20.75a9.76%209.76%200%200%201%209.75%209.75Zm-1.5%200A8.25%208.25%200%201%200%2010%2018.75a8.26%208.26%200%200%200%208.25-8.25Z'/%3e%3c/svg%3e";class O{showSuccess(i){q({text:i,duration:5e3,gravity:"top",position:"center",avatar:C,className:"toast-success",style:{background:"hsl(187, 24%, 22%)",color:"hsl(0, 0%, 100%)",boxShadow:"0 10px 30px rgba(33, 33, 33, 0.1)",borderRadius:"4px",fontFamily:"Karla, sans-serif",top:"16px"},offset:{x:0,y:16}}).showToast()}}class F{constructor(){p(this,"form");p(this,"elements");p(this,"submitButton");p(this,"validator");p(this,"toastService");p(this,"errorHandler");const i=new T;this.form=i.renderForm(),this.setupElements(),this.validator=new x,this.toastService=new O,this.errorHandler=new E,this.setupEventListeners()}setupElements(){this.elements={firstName:document.getElementById("first-name"),lastName:document.getElementById("last-name"),email:document.getElementById("email"),queryType:this.form.elements.namedItem("query-type"),message:document.getElementById("message"),consent:document.getElementById("consent")},this.submitButton=this.form.querySelector("button")}setupEventListeners(){this.form.addEventListener("submit",this.handleSubmit.bind(this)),Object.entries(this.elements).forEach(([i,t])=>{if(i==="queryType"){const o=t;Array.from(o).forEach(s=>{s instanceof HTMLInputElement&&s.addEventListener("change",()=>this.validateField(i))})}else t.addEventListener("input",()=>this.validateField(i)),t.addEventListener("blur",()=>this.validateField(i))})}validateField(i){const t=this.elements[i],{isValid:o,errorMessage:s}=this.validator.validateField(i,t),a=i==="queryType"?document.querySelector(".radio-group"):t;return this.errorHandler.showError(a,o?"":s),o}async handleSubmit(i){if(i.preventDefault(),this.submitButton.disabled)return;if(Object.keys(this.elements).every(o=>this.validateField(o))){this.submitButton.disabled=!0,this.submitButton.textContent="Sending...";try{await new Promise(s=>setTimeout(s,1500));const o={firstName:this.elements.firstName.value,lastName:this.elements.lastName.value,email:this.elements.email.value,queryType:this.elements.queryType.value,message:this.elements.message.value,consent:this.elements.consent.checked};console.log("Form submitted:",o),this.toastService.showSuccess("Thanks for completing the form. We'll be in touch soon!"),this.form.reset(),this.submitButton.textContent="Sent",this.submitButton.disabled=!0}catch{this.errorHandler.showError(this.form,"Failed to send message. Please try again."),this.submitButton.disabled=!1,this.submitButton.textContent="Submit"}}}}document.addEventListener("DOMContentLoaded",()=>{new F});
//# sourceMappingURL=main-BKPD1d0h.js.map
