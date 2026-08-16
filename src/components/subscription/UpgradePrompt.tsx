"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteConfig } from "@/context/SiteConfigContext";

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
  const { invite_only } = useSiteConfig();

  // In invite-only mode just show a locked indicator — no upgrade CTA
  if (invite_only) {
    return (
      <div className={cn("flex items-center gap-3 rounded-xl border border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 px-4 py-3", className)}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-100 dark:bg-ink-900">
          <Lock className="h-4 w-4 text-ink-400 dark:text-ink-600" />
        </div>
        <p className="text-sm text-ink-500 dark:text-ink-400">{feature} is not available on your current plan.</p>
      </div>
    );
  }

  if (variant === "overlay") {
    return (
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/80 dark:bg-ink-900/80 backdrop-blur-sm",
          className
        )}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-50 dark:bg-navy-900 ring-1 ring-navy-200 dark:ring-navy-700">
          <Lock className="h-5 w-5 text-navy-600 dark:text-navy-400" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-ink-800 dark:text-ink-100">{feature}</p>
          {requiredPlan && (
            <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">Available on {requiredPlan} and above</p>
          )}
        </div>
        <Link
          href="/upgrade"
          className="rounded-lg bg-navy-600 dark:bg-navy-400 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-navy-700 dark:hover:bg-navy-500"
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
        "flex items-center justify-between gap-4 rounded-xl border border-navy-200/60 bg-navy-50 dark:bg-navy-900 px-4 py-3",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-100 dark:bg-navy-800">
          <Lock className="h-4 w-4 text-navy-600 dark:text-navy-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-ink-800 dark:text-ink-100">{feature}</p>
          {requiredPlan && (
            <p className="text-xs text-ink-500 dark:text-ink-400">Requires {requiredPlan} plan or higher</p>
          )}
        </div>
      </div>
      <Link
        href="/upgrade"
        className="shrink-0 rounded-lg bg-navy-600 dark:bg-navy-400 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-navy-700 dark:hover:bg-navy-500"
      >
        Upgrade
      </Link>
    </div>
  );
}
