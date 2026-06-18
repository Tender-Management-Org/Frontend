"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface UpgradePromptProps {
  /** Short label for the locked feature, e.g. "Advanced filters" */
  feature: string;
  /** Which plan unlocks it, e.g. "Starter" */
  requiredPlan?: string;
  /** "inline" renders a locked state inside a section; "overlay" covers a card area */
  variant?: "inline" | "overlay";
  className?: string;
}

/**
 * Drop-in replacement for any UI section that requires a higher plan.
 *
 * Usage — inline (replaces a form section):
 *   <UpgradePrompt feature="Advanced filters" requiredPlan="Starter" />
 *
 * Usage — overlay (covers a blurred card):
 *   <div className="relative">
 *     <div className="pointer-events-none blur-sm select-none">{lockedContent}</div>
 *     <UpgradePrompt variant="overlay" feature="Interest signals" requiredPlan="Growth" />
 *   </div>
 */
export function UpgradePrompt({
  feature,
  requiredPlan,
  variant = "inline",
  className,
}: UpgradePromptProps) {
  if (variant === "overlay") {
    return (
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/80 backdrop-blur-sm",
          className
        )}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-50 ring-1 ring-navy-200">
          <Lock className="h-5 w-5 text-navy-600" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-ink-800">{feature}</p>
          {requiredPlan && (
            <p className="mt-0.5 text-xs text-ink-500">Available on {requiredPlan} and above</p>
          )}
        </div>
        <Link
          href="/upgrade"
          className="rounded-lg bg-navy-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-navy-700"
        >
          Upgrade plan
        </Link>
      </div>
    );
  }

  // inline variant
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-xl border border-navy-200/60 bg-navy-50 px-4 py-3",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-100">
          <Lock className="h-4 w-4 text-navy-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-ink-800">{feature}</p>
          {requiredPlan && (
            <p className="text-xs text-ink-500">Requires {requiredPlan} plan or higher</p>
          )}
        </div>
      </div>
      <Link
        href="/upgrade"
        className="shrink-0 rounded-lg bg-navy-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-navy-700"
      >
        Upgrade
      </Link>
    </div>
  );
}
