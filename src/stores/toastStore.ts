import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  autoClose?: boolean;
}

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, autoClose?: boolean) => void;
  removeToast: (id: string) => void;
}

let toastId = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type, autoClose = true) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { 
          id: `toast-${++toastId}`, 
          message, 
          type, 
          autoClose 
        },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));