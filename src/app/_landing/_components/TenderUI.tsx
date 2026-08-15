"use client";

import { Building2, CalendarClock, CheckCircle2, IndianRupee, MapPin, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DemoTender } from "../_data/content";

/* ────────────────────────────────────────────────────────────────────────────
   Small shared product-UI atoms, reused across every section so the whole page
   reads as screenshots of one real application.
   ──────────────────────────────────────────────────────────────────────────── */

export function FitBadge({ value, className }: { value: number; className?: string }) {
  const tone =
    value >= 90
      ? "border-success-500/25 bg-success-50 text-success-700"
      : value >= 80
      ? "border-elec-500/25 bg-elec-50 text-elec-700"
      : "border-ink-900/10 bg-ink-100 text-ink-600";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-2xs font-bold tabular-nums",
        tone,
        className
      )}
    >
      <Sparkles className="h-3 w-3" aria-hidden />
      {value}
    </span>
  );
}

export function MetaCell({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  accent?: "amber" | "green";
}) {
  return (
    <div className="rounded-lg bg-canvas-soft px-2.5 py-1.5">
      <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-ink-400">{label}</p>
      <p
        className={cn(
          "mt-0.5 flex items-center gap-1 truncate text-xs font-semibold",
          accent === "amber" ? "text-warning-700" : accent === "green" ? "text-success-700" : "text-ink-800"
        )}
      >
        {icon}
        {value}
      </p>
    </div>
  );
}

/** The canonical tender card used in the hero and throughout the page. */
export function TenderCardUI({
  tender,
  compact = false,
  className,
  showEligibility = true,
}: {
  tender: DemoTender;
  compact?: boolean;
  className?: string;
  showEligibility?: boolean;
}) {
  return (
    <article
      className={cn(
        "w-full rounded-2xl border border-ink-900/8 bg-white/90 p-4 shadow-lift backdrop-blur-xl",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold tracking-tight text-ink-900">{tender.title}</h3>
          <p className="mt-1 flex items-center gap-1.5 truncate text-2xs text-ink-400">
            <Building2 className="h-3 w-3 shrink-0" aria-hidden />
            {tender.department}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-ink-400">Fit Score</p>
          <p className="text-lg font-bold leading-tight tabular-nums text-ink-900">
            {tender.fit}
            <span className="text-xs font-semibold text-ink-400">%</span>
          </p>
          <p className="text-[0.5625rem] font-semibold text-success-600">{tender.fitLabel}</p>
        </div>
      </div>

      {!compact && (
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          <MetaCell label="Location" value={tender.location.split(",")[0]} icon={<MapPin className="h-3 w-3 text-ink-400" aria-hidden />} />
          <MetaCell label="Tender Value" value={tender.value} icon={<IndianRupee className="h-3 w-3 text-ink-400" aria-hidden />} />
          <MetaCell label="Closing" value={tender.closing} icon={<CalendarClock className="h-3 w-3 text-warning-600" aria-hidden />} accent="amber" />
        </div>
      )}

      {showEligibility && (
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-ink-900/6 pt-2.5">
          <span className="inline-flex items-center gap-1.5 text-2xs font-medium text-success-700">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
            {tender.eligibility}
          </span>
          <span className="rounded-full border border-ink-900/8 bg-canvas-soft px-2 py-0.5 text-[0.5625rem] font-medium text-ink-500">
            {tender.source}
          </span>
        </div>
      )}
    </article>
  );
}

/** Ultra-compact row used for the flood, search results and pipeline columns. */
export function TenderChip({
  title,
  meta,
  fit,
  muted = false,
  className,
}: {
  title: string;
  meta?: string;
  fit?: number;
  muted?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 backdrop-blur",
        muted
          ? "border-ink-900/6 bg-white/55 text-ink-400"
          : "border-ink-900/10 bg-white/90 text-ink-800 shadow-card",
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", muted ? "bg-ink-300" : "bg-elec-500")} aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-medium">{title}</span>
        {meta && <span className="mt-0.5 block truncate text-2xs text-ink-400">{meta}</span>}
      </span>
      {typeof fit === "number" && <FitBadge value={fit} />}
    </div>
  );
}

/** Browser-chrome frame that makes any child read as "this is the product". */
export function AppFrame({
  children,
  label = "tenderkhoj — Recommendations",
  className,
  tone = "light",
}: {
  children: React.ReactNode;
  /** Node rather than string so callers can cross-fade the window title. */
  label?: React.ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border shadow-lift-lg",
        tone === "light" ? "border-ink-900/8 bg-white/80 backdrop-blur-xl" : "border-white/10 bg-white/5 backdrop-blur-xl",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 border-b px-4 py-2.5",
          tone === "light" ? "border-ink-900/6 bg-canvas-soft/80" : "border-white/10 bg-white/5"
        )}
      >
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-ink-300" />
          <span className="h-2 w-2 rounded-full bg-ink-300" />
          <span className="h-2 w-2 rounded-full bg-ink-300" />
        </span>
        <span
          className={cn(
            "mx-auto truncate rounded-md px-2 py-0.5 text-2xs font-medium",
            tone === "light" ? "bg-white/70 text-ink-400" : "bg-white/5 text-white/40"
          )}
        >
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}
