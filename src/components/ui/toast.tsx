/**
 * Toast Component - Bildirimler için UI bileşeni
 */

'use client';

import * as React from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { useToast, type Toast } from '@/lib/stores/useToast';

const toastVariants = {
  success: {
    icon: CheckCircle,
    className: 'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-900/20 dark:text-green-100',
    iconClassName: 'text-green-600 dark:text-green-400'
  },
  error: {
    icon: AlertCircle,
    className: 'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-900/20 dark:text-red-100',
    iconClassName: 'text-red-600 dark:text-red-400'
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-100',
    iconClassName: 'text-yellow-600 dark:text-yellow-400'
  },
  info: {
    icon: Info,
    className: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-100',
    iconClassName: 'text-blue-600 dark:text-blue-400'
  },
  loading: {
    icon: Loader2,
    className: 'border-gray-200 bg-gray-50 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100',
    iconClassName: 'text-gray-600 dark:text-gray-400 animate-spin'
  }
};

interface ToastItemProps {
  toast: Toast;
}

function ToastItem({ toast }: ToastItemProps) {
  const { removeToast } = useToast();
  const variant = toastVariants[toast.type];
  const Icon = variant.icon;

  return (
    <div
      className={cn(
        'relative flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300 ease-in-out',
        'animate-in slide-in-from-right-full',
        variant.className
      )}
    >
      <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', variant.iconClassName)} />
      
      <div className="flex-1 space-y-1">
        <div className="font-medium text-sm">{toast.title}</div>
        {toast.message && (
          <div className="text-sm opacity-90">{toast.message}</div>
        )}
        {toast.action && (
          <Button
            variant="outline"
            size="sm"
            onClick={toast.action.onClick}
            className="mt-2 h-8"
          >
            {toast.action.label}
          </Button>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 hover:bg-black/10 dark:hover:bg-white/10"
        onClick={() => removeToast(toast.id)}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Kapat</span>
      </Button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
