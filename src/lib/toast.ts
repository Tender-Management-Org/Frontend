"use client";

type ToastType = "success" | "error" | "info";

export type ToastPayload = {
  title: string;
  description?: string;
  type?: ToastType;
};

const TOAST_EVENT_NAME = "tp:toast";

export function emitToast(payload: ToastPayload) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<ToastPayload>(TOAST_EVENT_NAME, { detail: payload }));
}

export function getToastEventName() {
  return TOAST_EVENT_NAME;
}
