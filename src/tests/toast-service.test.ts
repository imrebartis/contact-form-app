import Toastify from 'toastify-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import successIcon from '../assets/images/icon-success-check.svg';
import { ToastService } from '../services/toast-service';

vi.mock('toastify-js');
vi.mock('../assets/images/icon-success-check.svg', () => ({
  default: 'success-icon.svg',
}));

describe('ToastService', () => {
  let toastService: ToastService;
  let mockShowToast: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockShowToast = vi.fn();
    (Toastify as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      () => ({
        showToast: mockShowToast,
      })
    );
    toastService = new ToastService();
  });

  it('should show success toast with correct configuration', () => {
    const testMessage = 'Test success message';
    toastService.showSuccess(testMessage);

    expect(Toastify).toHaveBeenCalledWith({
      text: testMessage,
      duration: 5000,
      gravity: 'top',
      position: 'center',
      avatar: successIcon,
      className: 'toast-success',
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
    });

    expect(mockShowToast).toHaveBeenCalled();
  });
});
