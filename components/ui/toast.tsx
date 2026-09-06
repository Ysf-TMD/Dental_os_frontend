'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  onClose?: () => void;
}

const variantStyles: Record<ToastVariant, string> = {
  default: 'bg-white border-gray-200',
  success: 'bg-green-50 border-green-200 text-green-900',
  error: 'bg-red-50 border-red-200 text-red-900',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
  info: 'bg-blue-50 border-blue-200 text-blue-900',
};

const iconStyles: Record<ToastVariant, string> = {
  default: 'text-gray-500',
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600',
};

export function Toast({ title, description, variant = 'default', onClose }: ToastProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-in slide-in-from-right-full duration-300',
        variantStyles[variant]
      )}
    >
      <div className="flex-1">
        {title && <div className="font-semibold text-sm">{title}</div>}
        {description && <div className="text-sm mt-1 opacity-90">{description}</div>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={cn('opacity-50 hover:opacity-100 transition-opacity', iconStyles[variant])}
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
