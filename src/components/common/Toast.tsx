'use client';

import { toast } from 'sonner';
import { Button } from '@components/ui/button';

import {
  X,
  Check,
  AlertTriangle,
  Info,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export interface ToastOptions {
  message: string;
  duration?: number;
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
  className?: string;
}

export interface InteractiveToastOptions extends ToastOptions {
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  actionText?: string;
  onAction?: () => void;
  onClose?: () => void;
  showCloseButton?: boolean;
}

// ─── Simple Toast ────────────────────────────────────────────────────────
export const showSimpleToast = {
  success: (opts: ToastOptions) => {
    toast.custom(
      () => (
        <div
          className={[
            'flex items-center justify-center gap-2',
            'text-sm font-medium rounded-lg py-2 px-4',
            'bg-green-600 text-white',
            opts.className,
            'animate-enter',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <Check className="h-4 w-4 text-white" />
          <span>{opts.message}</span>
        </div>
      ),
      {
        duration: opts.duration ?? 4000,
        position: opts.position ?? 'top-center',
      },
    );
  },

  error: (opts: ToastOptions) => {
    toast.custom(
      () => (
        <div
          className={[
            'flex items-center justify-center gap-2',
            'text-sm font-medium rounded-lg py-2 px-4',
            'bg-red-600 text-white',
            opts.className,
            'animate-enter',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <AlertCircle className="h-4 w-4 text-white" />
          <span>{opts.message}</span>
        </div>
      ),
      {
        duration: opts.duration ?? 5000,
        position: opts.position ?? 'top-center',
      },
    );
  },

  warning: (opts: ToastOptions) => {
    toast.custom(
      () => (
        <div
          className={[
            'flex items-center justify-center gap-2',
            'text-sm font-medium rounded-lg py-2 px-4',
            'bg-amber-500 text-white',
            opts.className,
            'animate-enter',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <AlertTriangle className="h-4 w-4 text-white" />
          <span>{opts.message}</span>
        </div>
      ),
      {
        duration: opts.duration ?? 4000,
        position: opts.position ?? 'top-center',
      },
    );
  },

  info: (opts: ToastOptions) => {
    toast.custom(
      () => (
        <div
          className={[
            'flex items-center justify-center gap-2',
            'text-sm font-medium rounded-lg py-2 px-4',
            'bg-blue-600 text-white',
            opts.className,
            'animate-enter',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <Info className="h-4 w-4 text-white" />
          <span>{opts.message}</span>
        </div>
      ),
      {
        duration: opts.duration ?? 4000,
        position: opts.position ?? 'top-center',
      },
    );
  },

  custom: (opts: ToastOptions) => {
    toast.custom(
      () => (
        <div
          className={[
            'text-sm font-medium justify-center rounded-lg py-2 px-4',
            'bg-gray-600 text-white',
            opts.className,
            'animate-enter',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <span>{opts.message}</span>
        </div>
      ),
      {
        duration: opts.duration ?? 4000,
        position: opts.position ?? 'top-center',
      },
    );
  },
};

// ─── Interactive Toast ──────────────────────────────────────────────────
export const showInteractiveToast = {
  confirm: (opts: InteractiveToastOptions) => {
    toast.custom(
      (id) => (
        <div
          className={[
            'flex flex-col gap-3',
            'text-sm text-gray-800 rounded-xl border border-gray-200 p-4',
            'bg-gray-100 shadow-lg',
            opts.className,
            'animate-enter',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <p className="font-medium">{opts.message}</p>
          <div className="flex justify-end gap-2">
            {opts.showCancel !== false && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  opts.onCancel?.();
                  toast.dismiss(id);
                }}
                className="h-8 px-3"
              >
                {opts.cancelText ?? '취소'}
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => {
                opts.onConfirm?.();
                toast.dismiss(id);
              }}
              className="h-8 px-3"
            >
              {opts.confirmText ?? '확인'}
            </Button>
          </div>
        </div>
      ),
      {
        duration: opts.duration ?? Number.POSITIVE_INFINITY,
        position: opts.position ?? 'top-center',
      },
    );
  },

  action: (opts: InteractiveToastOptions) => {
    toast.custom(
      (id) => (
        <div
          className={[
            'flex flex-col justify-between',
            'rounded-lg p-4',
            'mx-auto',
            'shadow-sm',
            'bg-gray-500',
            opts.className,
            'animate-enter',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <div className="flex items-center mb-3">
            <CheckCircle className="w-7 h-7 pr-2 text-success font-bold" />
            <span className="text-base text-white whitespace-pre-line">
              {opts.message}
            </span>
            {opts.showCloseButton !== false && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  opts.onClose?.();
                  toast.dismiss(id);
                }}
                className="ml-auto h-5 w-5 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* 우측 액션 버튼 + 닫기 */}
          <div className="flex justify-end mt-3">
            {opts.onAction && (
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  opts.onAction?.();
                  toast.dismiss(id);
                }}
                className="h-6 p-2 bg-gray-40 text-xs"
              >
                {opts.actionText ?? '확인'}
              </Button>
            )}
          </div>
        </div>
      ),
      {
        duration: opts.duration ?? 8000,
        position: opts.position ?? 'top-center',
      },
    );
  },

  loading: (opts: ToastOptions & { onCancel?: () => void }) => {
    toast.custom(
      (id) => (
        <div
          className={[
            'flex items-center justify-between gap-3',
            'text-sm text-gray-800 rounded-xl border border-gray-200 p-3',
            'bg-gray-100',
            opts.className,
            'animate-enter',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <p className="flex-1 font-medium">{opts.message}</p>
          {opts.onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                opts.onCancel?.();
                toast.dismiss(id);
              }}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
      {
        duration: opts.duration ?? Number.POSITIVE_INFINITY,
        position: opts.position ?? 'top-center',
      },
    );
  },
};
