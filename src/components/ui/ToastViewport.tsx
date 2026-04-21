"use client";

import { useEffect, useState } from "react";
import { getToastEventName, type ToastPayload } from "@/lib/toast";

type ToastMessage = ToastPayload & { id: number };

const styleMap: Record<NonNullable<ToastPayload["type"]>, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-rose-200 bg-rose-50 text-rose-900",
  info: "border-slate-200 bg-white text-slate-900"
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
        description: payload.description
      };

      setToasts((current) => [...current, nextToast]);
      const timeoutId = window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== nextToast.id));
      }, 3200);
      timeoutIds.push(timeoutId);
    };

    window.addEventListener(getToastEventName(), onToast as EventListener);
    return () => {
      window.removeEventListener(getToastEventName(), onToast as EventListener);
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-[min(92vw,22rem)] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          className={`pointer-events-auto rounded-xl border px-4 py-3 shadow-lg shadow-slate-900/10 ${styleMap[toast.type ?? "info"]}`}
        >
          <p className="text-sm font-semibold">{toast.title}</p>
          {toast.description ? <p className="mt-1 text-xs opacity-90">{toast.description}</p> : null}
        </div>
      ))}
    </div>
  );
}
