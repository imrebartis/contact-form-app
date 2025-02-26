'use strict';

import Toastify from 'toastify-js';

import 'toastify-js/src/toastify.css';

import successIcon from '../assets/images/icon-success-check.svg';

export class ToastService {
  showSuccess(message: string): void {
    Toastify({
      text: message,
      duration: 5000,
      gravity: 'top',
      position: 'center',
      avatar: successIcon,
      className: 'toast-success',
      escapeMarkup: false,
      stopOnFocus: true,
      style: {
        background: 'hsl(187, 24%, 22%)',
        color: 'hsl(0, 0%, 100%)',
        boxShadow: '0 10px 30px rgba(33, 33, 33, 0.1)',
        borderRadius: '4px',
        fontFamily: 'Karla, sans-serif',
        top: '16px',
      },
      offset: {
        x: 0,
        y: 16,
      },
    }).showToast();
  }
}
