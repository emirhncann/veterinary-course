/**
 * Toast Store - Bildirimler için global state yönetimi
 */

import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastState {
  toasts: Toast[];
}

interface ToastActions {
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
  success: (title: string, message?: string, duration?: number) => string;
  error: (title: string, message?: string, duration?: number) => string;
  warning: (title: string, message?: string, duration?: number) => string;
  info: (title: string, message?: string, duration?: number) => string;
  loading: (title: string, message?: string) => string;
  updateToast: (id: string, updates: Partial<Omit<Toast, 'id'>>) => void;
}

type ToastStore = ToastState & ToastActions;

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useToast = create<ToastStore>((set, get) => ({
  toasts: [],

  addToast: (toast) => {
    const id = generateId();
    const newToast = { ...toast, id };
    
    set((state) => ({
      toasts: [...state.toasts, newToast]
    }));

    // Auto remove after duration (except for loading toasts)
    if (toast.type !== 'loading') {
      const duration = toast.duration ?? (toast.type === 'error' ? 5000 : 3000);
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }

    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    }));
  },

  clearAll: () => {
    set({ toasts: [] });
  },

  success: (title, message, duration) => {
    return get().addToast({ type: 'success', title, message, duration });
  },

  error: (title, message, duration) => {
    return get().addToast({ type: 'error', title, message, duration });
  },

  warning: (title, message, duration) => {
    return get().addToast({ type: 'warning', title, message, duration });
  },

  info: (title, message, duration) => {
    return get().addToast({ type: 'info', title, message, duration });
  },

  loading: (title, message) => {
    return get().addToast({ type: 'loading', title, message });
  },

  updateToast: (id, updates) => {
    set((state) => ({
      toasts: state.toasts.map((toast) =>
        toast.id === id ? { ...toast, ...updates } : toast
      )
    }));
  },
}));
