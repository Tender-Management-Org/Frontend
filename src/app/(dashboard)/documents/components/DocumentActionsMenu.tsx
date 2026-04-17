"use client";

import { Download, Eye, MoreVertical, Trash2 } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const MENU_WIDTH = 192;
const MENU_HEIGHT_EST = 148;

export interface DocumentActionsHandlers {
  onView?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
}

interface DocumentActionsMenuProps extends DocumentActionsHandlers {
  documentId: number | string;
  documentName: string;
  align?: "start" | "end";
}

export function DocumentActionsMenu({
  documentId,
  documentName,
  align = "end",
  onView,
  onDownload,
  onDelete
}: DocumentActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const menuId = `document-actions-${documentId}`;

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const left =
      align === "end"
        ? Math.min(r.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8)
        : Math.max(8, r.left);
    const roomBelow = window.innerHeight - r.bottom - 8;
    const openDown = roomBelow >= MENU_HEIGHT_EST || r.top < MENU_HEIGHT_EST + 16;
    const top = openDown ? r.bottom + 8 : Math.max(8, r.top - MENU_HEIGHT_EST - 8);
    setPosition({ top, left });
  }, [align]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const onScrollResize = () => updatePosition();
    window.addEventListener("scroll", onScrollResize, true);
    window.addEventListener("resize", onScrollResize);
    return () => {
      window.removeEventListener("scroll", onScrollResize, true);
      window.removeEventListener("resize", onScrollResize);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t)) return;
      const menu = document.getElementById(menuId);
      if (menu?.contains(t)) return;
      setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, menuId]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className="relative inline-flex">
      <button
        ref={triggerRef}
        type="button"
        id={`${menuId}-trigger`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-label={`Actions for ${documentName}`}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-white text-slate-600 transition-colors",
          "hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
          open && "border-slate-300 bg-slate-50"
        )}
      >
        <MoreVertical className="h-4 w-4" aria-hidden />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-labelledby={`${menuId}-trigger`}
          style={{
            position: "fixed",
            top: position.top,
            left: position.left,
            width: MENU_WIDTH,
            zIndex: 60
          }}
          className="rounded-lg border border-border bg-white py-1 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none"
            onClick={() => {
              onView?.();
              close();
            }}
          >
            <Eye className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
            View
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none"
            onClick={() => {
              onDownload?.();
              close();
            }}
          >
            <Download className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
            Download
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 focus-visible:bg-rose-50 focus-visible:outline-none"
            onClick={() => {
              onDelete?.();
              close();
            }}
          >
            <Trash2 className="h-4 w-4 shrink-0 text-rose-500" aria-hidden />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
