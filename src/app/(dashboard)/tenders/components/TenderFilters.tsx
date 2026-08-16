"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { FilterX, MapPin, SlidersHorizontal } from "lucide-react";
import { getScraperSources, type ScraperSourceApi } from "@/lib/api/tenders";

export type TenderStatus = "active" | "closing_soon" | "closed" | "all";

export type TenderFilterValues = {
  location: string;
  status: TenderStatus;
  source: string;
};

const STATUS_OPTIONS: { value: TenderStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "closing_soon", label: "Closing Soon" },
  { value: "closed", label: "Closed" },
  { value: "all", label: "All" },
];

function statusChipClass(status: TenderStatus, isSelected: boolean) {
  if (!isSelected) {
    return "border-ink-200 dark:border-ink-800 bg-surface text-ink-500 dark:text-ink-400 hover:border-ink-300 dark:hover:border-ink-700 hover:text-ink-700 dark:hover:text-ink-200";
  }
  switch (status) {
    case "active":
      return "border-emerald-500 bg-emerald-50 text-emerald-700";
    case "closing_soon":
      return "border-warning-500 bg-warning-50 text-warning-700";
    case "closed":
      return "border-danger-400 bg-danger-50 text-danger-700";
    default:
      return "border-navy-500 dark:border-navy-400 bg-navy-50 dark:bg-navy-900 text-navy-700 dark:text-navy-500";
  }
}

type TenderFiltersProps = {
  values: TenderFilterValues;
  onChange: (next: TenderFilterValues) => void;
  onReset: () => void;
  /**
   * `sidebar` (default) is the full card, `compact` is a self-contained toolbar
   * row, and `inline` is the bare controls for embedding in an existing bar.
   */
  variant?: "sidebar" | "compact" | "inline";
};

export function TenderFilters({ values, onChange, onReset, variant = "sidebar" }: TenderFiltersProps) {
  const [sources, setSources] = useState<ScraperSourceApi[]>([]);

  useEffect(() => {
    getScraperSources()
      .then(setSources)
      .catch(() => setSources([]));
  }, []);

  const hasActive = Boolean(values.location) || values.status !== "active" || Boolean(values.source);

  /* ---------------- Bare controls, for an existing toolbar ---------------- */
  if (variant === "inline") {
    return (
      <>
        <div className="flex flex-wrap items-center gap-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ ...values, status: opt.value })}
              className={cn(
                "h-8 rounded-lg border px-2.5 text-xs font-semibold transition-colors",
                statusChipClass(opt.value, values.status === opt.value)
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <MapPin
            className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400 dark:text-ink-600"
            aria-hidden
          />
          <input
            placeholder="City or state"
            aria-label="Filter by location"
            value={values.location}
            onChange={(e) => onChange({ ...values, location: e.target.value })}
            className="h-8 w-32 rounded-lg border border-ink-200 dark:border-ink-800 bg-surface pl-7 pr-2 text-xs text-ink-700 dark:text-ink-200 outline-none placeholder:text-ink-400 dark:placeholder:text-ink-600 focus:ring-2 focus:ring-navy-500/30"
          />
        </div>

        {sources.length > 0 && (
          <select
            aria-label="Filter by source"
            value={values.source}
            onChange={(e) => onChange({ ...values, source: e.target.value })}
            className="h-8 rounded-lg border border-ink-200 dark:border-ink-800 bg-surface px-2 text-xs text-ink-700 dark:text-ink-200 outline-none focus:ring-2 focus:ring-navy-500/30"
          >
            <option value="">All sources</option>
            {sources.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.display_name}
              </option>
            ))}
          </select>
        )}
      </>
    );
  }

  /* ---------------- Compact inline toolbar (minimal view) ---------------- */
  if (variant === "compact") {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-ink-200 dark:border-ink-800 bg-surface px-3 py-2 shadow-card">
        <SlidersHorizontal className="h-4 w-4 shrink-0 text-ink-400 dark:text-ink-600" aria-hidden />

        <div className="flex flex-wrap items-center gap-1.5">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ ...values, status: opt.value })}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors",
                statusChipClass(opt.value, values.status === opt.value)
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <span className="hidden h-5 w-px bg-ink-200 dark:bg-ink-800 sm:block" aria-hidden />

        <div className="relative">
          <MapPin
            className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400 dark:text-ink-600"
            aria-hidden
          />
          <input
            placeholder="City or state"
            aria-label="Filter by location"
            value={values.location}
            onChange={(e) => onChange({ ...values, location: e.target.value })}
            className="h-8 w-40 rounded-lg border border-ink-200 dark:border-ink-800 bg-surface pl-7 pr-2 text-xs text-ink-700 dark:text-ink-200 outline-none placeholder:text-ink-400 dark:placeholder:text-ink-600 focus:ring-2 focus:ring-navy-500/30"
          />
        </div>

        {sources.length > 0 && (
          <select
            aria-label="Filter by source"
            value={values.source}
            onChange={(e) => onChange({ ...values, source: e.target.value })}
            className="h-8 rounded-lg border border-ink-200 dark:border-ink-800 bg-surface px-2 text-xs text-ink-700 dark:text-ink-200 outline-none focus:ring-2 focus:ring-navy-500/30"
          >
            <option value="">All sources</option>
            {sources.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.display_name}
              </option>
            ))}
          </select>
        )}

        {hasActive && (
          <button
            type="button"
            onClick={onReset}
            className="ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-ink-500 dark:text-ink-400 transition-colors hover:bg-ink-50 dark:hover:bg-ink-950 hover:text-ink-700 dark:hover:text-ink-200"
          >
            <FilterX className="h-3.5 w-3.5" aria-hidden />
            Reset
          </button>
        )}
      </div>
    );
  }

  /* ---------------- Sidebar card (detailed view) ---------------- */
  return (
    <Card className="space-y-5 p-5 lg:sticky lg:top-6">
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-900 dark:text-ink-50">
          <SlidersHorizontal className="h-4 w-4 text-ink-400 dark:text-ink-600" aria-hidden />
          Filters
          {hasActive && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-navy-600 dark:bg-navy-400 text-2xs font-bold text-white">
              !
            </span>
          )}
        </h3>
        <Button type="button" variant="ghost" size="sm" onClick={onReset} className="gap-1 text-ink-500 dark:text-ink-400">
          <FilterX className="h-3.5 w-3.5" aria-hidden />
          Reset
        </Button>
      </div>

      {/* Status filter */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wide text-ink-400 dark:text-ink-600">Status</label>
        <div className="flex flex-wrap gap-1.5">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ ...values, status: opt.value })}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                statusChipClass(opt.value, values.status === opt.value)
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Location filter */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wide text-ink-400 dark:text-ink-600">Location</label>
        <Input
          placeholder="City or state"
          value={values.location}
          onChange={(e) => onChange({ ...values, location: e.target.value })}
        />
      </div>

      {/* Source filter — only shown when sources are available */}
      {sources.length > 0 && (
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wide text-ink-400 dark:text-ink-600">Source</label>
          <div className="flex flex-wrap gap-1.5">
            {/* "All" chip to clear the source filter */}
            <button
              type="button"
              onClick={() => onChange({ ...values, source: "" })}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                !values.source
                  ? "border-navy-500 dark:border-navy-400 bg-navy-50 dark:bg-navy-900 text-navy-700 dark:text-navy-500"
                  : "border-ink-200 dark:border-ink-800 bg-surface text-ink-500 dark:text-ink-400 hover:border-ink-300 dark:hover:border-ink-700 hover:text-ink-700 dark:hover:text-ink-200"
              )}
            >
              All
            </button>
            {sources.map((s) => (
              <button
                key={s.slug}
                type="button"
                onClick={() => onChange({ ...values, source: values.source === s.slug ? "" : s.slug })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                  values.source === s.slug
                    ? "border-navy-500 dark:border-navy-400 bg-navy-50 dark:bg-navy-900 text-navy-700 dark:text-navy-500"
                    : "border-ink-200 dark:border-ink-800 bg-surface text-ink-500 dark:text-ink-400 hover:border-ink-300 dark:hover:border-ink-700 hover:text-ink-700 dark:hover:text-ink-200"
                )}
              >
                {s.display_name}
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
