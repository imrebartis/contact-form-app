'use strict';

import { DOMUtils } from '../utils/dom-utils';

export class ErrorHandler {
  showError(element: HTMLElement, message: string): void {
    DOMUtils.showError(element, message);
  }
}
