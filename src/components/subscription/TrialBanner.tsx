"use client";

import Link from "next/link";
import { AlertTriangle, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSubscription } from "@/hooks/useSubscription";
import { useState } from "react";

export function TrialBanner() {
  const { isTrial, isExpired, daysRemaining, loading } = useSubscription();
  const [dismissed, setDismissed] = useState(false);

  if (loading || dismissed) return null;

  // ── Expired banner ────────────────────────────────────────────────────────
  if (isExpired) {
    return (
      <div className="flex items-center justify-between gap-3 border-b border-danger-500/20 bg-danger-50 px-4 py-2.5 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-danger-600" aria-hidden />
          <p className="truncate text-sm font-medium text-danger-700">
            Your free trial has ended. Upgrade to continue using TenderKhoj.
          </p>
        </div>
        <Link
          href="/upgrade"
          className="shrink-0 rounded-lg bg-danger-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-danger-700"
        >
          Upgrade now
        </Link>
      </div>
    );
  }

  // ── Active trial banner ───────────────────────────────────────────────────
  if (!isTrial) return null;

  const isUrgent = daysRemaining !== null && daysRemaining <= 3;
  const label =
    daysRemaining === null
      ? "You're on a free trial."
      : daysRemaining === 0
      ? "Your trial expires today."
      : daysRemaining === 1
      ? "1 day left in your trial."
      : `${daysRemaining} days left in your free trial.`;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b px-4 py-2.5 sm:px-6",
        isUrgent
          ? "border-warning-500/20 bg-warning-50"
          : "border-navy-200/40 bg-navy-50"
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <Zap
          className={cn("h-4 w-4 shrink-0", isUrgent ? "text-warning-600" : "text-navy-600")}
          aria-hidden
        />
        <p className={cn("truncate text-sm font-medium", isUrgent ? "text-warning-700" : "text-navy-700")}>
          {label}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Link
          href="/upgrade"
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors",
            isUrgent ? "bg-warning-600 hover:bg-warning-700" : "bg-navy-600 hover:bg-navy-700"
          )}
        >
          Upgrade
        </Link>
        <button
          type="button"
          aria-label="Dismiss banner"
          onClick={() => setDismissed(true)}
          className="inline-flex h-6 w-6 items-center justify-center rounded-md text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-600"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
