'use strict';

import Toastify from 'toastify-js';

import 'toastify-js/src/toastify.css';

import successIcon from '../../assets/images/icon-success-check.svg';
import { IToastService } from '../../interfaces/form-interfaces';

export class ToastService implements IToastService {
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

  showFormSubmissionSuccess(title: string, message: string): void {
    const formattedMessage = `
      <div class="toast-success-wrapper">
        <strong>${title}</strong>
        <div class="toast-success-content">
          ${message}
        </div>
      </div>
    `;

    this.showSuccess(formattedMessage);
  }
}
