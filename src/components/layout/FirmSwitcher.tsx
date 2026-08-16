"use client";

import { Building2, Check, ChevronDown, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { useFirm } from "@/context/FirmContext";
import { useSubscription } from "@/hooks/useSubscription";
import { cn } from "@/lib/utils";

export function FirmSwitcher() {
  const router = useRouter();
  const { allFirms, activeFirm, activeFirmId, loading, setActiveFirm } = useFirm();
  const { subscription } = useSubscription();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (loading) {
    return (
      <div className="h-8 w-32 animate-pulse rounded-lg bg-ink-100 dark:bg-ink-900" />
    );
  }

  if (!activeFirm) return null;

  const maxFirms = subscription?.plan.max_firms ?? 1;
  const canAddFirm = maxFirms === -1 || allFirms.length < maxFirms;
  const displayName = activeFirm.business_name || activeFirm.legal_name;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "flex h-8 max-w-[180px] items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-colors",
          open
            ? "border-navy-300 dark:border-accent-blue-bg bg-navy-50 dark:bg-accent-blue-bg text-navy-700 dark:text-accent-blue"
            : "border-ink-200 dark:border-ink-800 bg-surface text-ink-700 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-950"
        )}
      >
        <Building2 className="h-3.5 w-3.5 shrink-0 text-navy-500 dark:text-accent-blue" aria-hidden />
        <span className="truncate">{displayName}</span>
        {allFirms.length > 1 && (
          <ChevronDown
            className={cn(
              "ml-auto h-3 w-3 shrink-0 text-ink-400 dark:text-ink-600 transition-transform",
              open && "rotate-180"
            )}
            aria-hidden
          />
        )}
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select firm"
          className="absolute left-0 top-full z-50 mt-1.5 w-56 animate-fade-in rounded-2xl border border-ink-200 dark:border-ink-800 bg-surface py-1.5 shadow-dropdown"
        >
          {/* Firm list */}
          {allFirms.map((firm) => {
            const name = firm.business_name || firm.legal_name;
            const isActive = firm.id === activeFirmId;
            return (
              <button
                key={firm.id}
                role="option"
                aria-selected={isActive}
                type="button"
                onClick={() => {
                  setOpen(false);
                  if (!isActive) {
                    setActiveFirm(firm.id);
                    router.refresh();
                  }
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors",
                  isActive
                    ? "bg-navy-50 dark:bg-accent-blue-bg text-navy-700 dark:text-accent-blue"
                    : "text-ink-700 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-950"
                )}
              >
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold uppercase",
                    isActive ? "bg-navy-600 dark:bg-primary text-white" : "bg-ink-100 dark:bg-ink-900 text-ink-500 dark:text-ink-400"
                  )}
                >
                  {name.charAt(0)}
                </div>
                <span className="flex-1 truncate text-xs font-medium">{name}</span>
                {isActive && <Check className="h-3.5 w-3.5 shrink-0 text-navy-600 dark:text-accent-blue" aria-hidden />}
              </button>
            );
          })}

          {/* Divider + Add firm */}
          <div className="my-1 border-t border-ink-100 dark:border-ink-900" />
          {canAddFirm ? (
            <Link
              href="/firm/new"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-navy-600 dark:text-accent-blue transition-colors hover:bg-navy-50 dark:hover:bg-navy-900"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-navy-50 dark:bg-accent-blue-bg">
                <Plus className="h-3.5 w-3.5 text-navy-600 dark:text-accent-blue" aria-hidden />
              </div>
              Add firm
            </Link>
          ) : (
            <Link
              href="/upgrade"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-ink-400 dark:text-ink-600 transition-colors hover:bg-ink-50 dark:hover:bg-ink-950"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-ink-100 dark:bg-ink-900">
                <Plus className="h-3.5 w-3.5 text-ink-400 dark:text-ink-600" aria-hidden />
              </div>
              <span>
                Add firm{" "}
                <span className="text-navy-500 dark:text-accent-blue">(upgrade to add more)</span>
              </span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
