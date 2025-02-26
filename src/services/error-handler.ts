'use strict';

import { DOMUtils } from '../utils/dom-utils';

export class ErrorHandler {
  private activeErrors: Map<string, Set<HTMLElement>> = new Map();

  showError(element: HTMLElement, message: string, groupId = 'default'): void {
    DOMUtils.showError(element, message);

    if (message) {
      this.trackError(element, groupId);
    } else {
      this.clearError(element, groupId);
    }
  }

  private trackError(element: HTMLElement, groupId: string): void {
    if (!this.activeErrors.has(groupId)) {
      this.activeErrors.set(groupId, new Set());
    }
    this.activeErrors.get(groupId)?.add(element);
  }

  private clearError(element: HTMLElement, groupId: string): void {
    const groupErrors = this.activeErrors.get(groupId);
    if (groupErrors) {
      groupErrors.delete(element);
      if (groupErrors.size === 0) {
        this.activeErrors.delete(groupId);
      }
    }
  }

  clearErrorGroup(groupId: string): void {
    const groupErrors = this.activeErrors.get(groupId);
    if (groupErrors) {
      groupErrors.forEach((element) => {
        DOMUtils.showError(element, '');
      });
      this.activeErrors.delete(groupId);
    }
  }

  clearAllErrors(): void {
    for (const groupId of this.activeErrors.keys()) {
      this.clearErrorGroup(groupId);
    }
  }

  hasErrors(groupId = 'default'): boolean {
    const group = this.activeErrors.get(groupId);
    return !!group && group.size > 0;
  }

  getErrorCount(groupId = 'default'): number {
    return this.activeErrors.get(groupId)?.size || 0;
  }
}
