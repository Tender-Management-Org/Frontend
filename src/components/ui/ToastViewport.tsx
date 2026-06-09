"use client";

import { useEffect, useState } from "react";
import { getToastEventName, type ToastPayload } from "@/lib/toast";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

type ToastMessage = ToastPayload & { id: number };

const toastConfig: Record<
  NonNullable<ToastPayload["type"]>,
  { className: string; Icon: typeof CheckCircle2 }
> = {
  success: {
    className: "border-success-200 bg-success-50 text-success-900",
    Icon: CheckCircle2,
  },
  error: {
    className: "border-danger-200 bg-danger-50 text-danger-900",
    Icon: AlertCircle,
  },
  info: {
    className: "border-ink-200 bg-white text-ink-900",
    Icon: Info,
  },
};

export function ToastViewport() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const timeoutIds: number[] = [];
    const onToast = (event: Event) => {
      const customEvent = event as CustomEvent<ToastPayload>;
      const payload = customEvent.detail;
      if (!payload?.title) return;
      const nextToast: ToastMessage = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        type: payload.type ?? "info",
        title: payload.title,
        description: payload.description,
      };
      setToasts((current) => [...current, nextToast]);
      const timeoutId = window.setTimeout(() => {
        setToasts((current) => current.filter((t) => t.id !== nextToast.id));
      }, 3500);
      timeoutIds.push(timeoutId);
    };
    window.addEventListener(getToastEventName(), onToast as EventListener);
    return () => {
      window.removeEventListener(getToastEventName(), onToast as EventListener);
      timeoutIds.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-[min(92vw,22rem)] flex-col gap-2">
      {toasts.map((toast) => {
        const { className, Icon } = toastConfig[toast.type ?? "info"];
        return (
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-dropdown animate-fade-in ${className}`}
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <div className="min-w-0">
              <p className="text-sm font-semibold">{toast.title}</p>
              {toast.description && (
                <p className="mt-0.5 text-xs opacity-80">{toast.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
