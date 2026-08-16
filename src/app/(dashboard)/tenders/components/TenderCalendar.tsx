"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight, FileSearch, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { tenderDetailHref } from "@/lib/tenders/path";
import type { TenderItem } from "./TenderCard";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MAX_CHIPS_PER_DAY = 3;

/** Local calendar key — never `toISOString()`, which is UTC and drifts in IST. */
function dayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Monday-first offset for a month's leading blanks. */
function leadingBlanks(firstOfMonth: Date) {
  return (firstOfMonth.getDay() + 6) % 7;
}

function toneForDays(daysLeft: number) {
  if (daysLeft < 0) return "closed";
  if (daysLeft <= 3) return "urgent";
  if (daysLeft <= 7) return "soon";
  return "normal";
}

const CHIP_TONE = {
  closed: "border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 text-ink-400 dark:text-ink-600",
  urgent: "border-danger-200 dark:border-danger-500/30 bg-danger-50 dark:bg-danger-500/10 text-danger-700 dark:text-danger-400 hover:bg-danger-100 dark:hover:bg-danger-500/15",
  soon: "border-warning-200 dark:border-warning-500/30 bg-warning-50 dark:bg-warning-500/10 text-warning-700 dark:text-warning-400 hover:bg-warning-100 dark:hover:bg-warning-500/15",
  normal: "border-navy-200 dark:border-navy-700 bg-navy-50 dark:bg-navy-900 text-navy-700 dark:text-navy-500 hover:bg-navy-100 dark:hover:bg-navy-800",
} as const;

export function TenderCalendar({ tenders }: { tenders: TenderItem[] }) {
  /* Group the page's tenders by their local closing date. */
  const byDay = useMemo(() => {
    const map = new Map<string, TenderItem[]>();
    for (const tender of tenders) {
      const date = new Date(tender.deadline);
      if (Number.isNaN(date.getTime())) continue;
      const key = dayKey(date);
      const bucket = map.get(key);
      if (bucket) bucket.push(tender);
      else map.set(key, [tender]);
    }
    return map;
  }, [tenders]);

  /* Start on the month holding the earliest deadline, not today — the list is
     usually sorted by closing date, so today's month is often empty. */
  const firstMonth = useMemo(() => {
    const times = tenders
      .map((t) => new Date(t.deadline).getTime())
      .filter((t) => !Number.isNaN(t));
    const earliest = times.length ? new Date(Math.min(...times)) : new Date();
    return new Date(earliest.getFullYear(), earliest.getMonth(), 1);
  }, [tenders]);

  const [monthOffset, setMonthOffset] = useState(0);
  const cursor = useMemo(
    () => new Date(firstMonth.getFullYear(), firstMonth.getMonth() + monthOffset, 1),
    [firstMonth, monthOffset]
  );

  const [expanded, setExpanded] = useState<string | null>(null);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const blanks = leadingBlanks(cursor);

  const monthCount = useMemo(() => {
    let count = 0;
    for (let day = 1; day <= daysInMonth; day += 1) {
      count += byDay.get(dayKey(new Date(cursor.getFullYear(), cursor.getMonth(), day)))?.length ?? 0;
    }
    return count;
  }, [byDay, cursor, daysInMonth]);

  if (tenders.length === 0) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 dark:border-ink-800 bg-surface p-8 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-100 dark:bg-ink-900">
          <FileSearch className="h-7 w-7 text-ink-400 dark:text-ink-600" />
        </div>
        <h3 className="text-base font-semibold text-ink-800 dark:text-ink-100">No tenders found</h3>
        <p className="mt-1 max-w-xs text-sm text-ink-400 dark:text-ink-600">
          Try adjusting your search query or clearing the active filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-200 dark:border-ink-800 bg-surface shadow-card">
      {/* Month bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-200 dark:border-ink-800 bg-ink-50/70 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-ink-400 dark:text-ink-600" aria-hidden />
          <h2 className="text-sm font-semibold text-ink-900 dark:text-ink-50">
            {cursor.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </h2>
          <span className="rounded-full bg-surface px-2 py-0.5 text-2xs font-semibold tabular-nums text-ink-500 dark:text-ink-400">
            {monthCount} closing
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMonthOffset((m) => m - 1)}
            aria-label="Previous month"
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-ink-200 dark:border-ink-800 bg-surface text-ink-600 dark:text-ink-300 transition-colors hover:bg-ink-50 dark:hover:bg-ink-950"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setMonthOffset(0)}
            className="rounded-lg border border-ink-200 dark:border-ink-800 bg-surface px-2.5 py-1 text-2xs font-medium text-ink-600 dark:text-ink-300 transition-colors hover:bg-ink-50 dark:hover:bg-ink-950"
          >
            Earliest
          </button>
          <button
            type="button"
            onClick={() => setMonthOffset((m) => m + 1)}
            aria-label="Next month"
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-ink-200 dark:border-ink-800 bg-surface text-ink-600 dark:text-ink-300 transition-colors hover:bg-ink-50 dark:hover:bg-ink-950"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Scope note — the calendar can only place what the current page loaded. */}
      <p className="flex items-center gap-1.5 border-b border-ink-100 dark:border-ink-900 bg-surface px-4 py-1.5 text-2xs text-ink-400 dark:text-ink-600">
        <Info className="h-3 w-3 shrink-0" aria-hidden />
        Showing the {tenders.length} tenders on this page — raise “Per page” to plot more at once.
      </p>

      {/* Weekday header */}
      <div className="grid grid-cols-7 border-b border-ink-200 dark:border-ink-800 bg-surface">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="px-2 py-1.5 text-center text-2xs font-semibold uppercase tracking-widest text-ink-400 dark:text-ink-600"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-px bg-ink-100 dark:bg-ink-900">
        {Array.from({ length: blanks }).map((_, i) => (
          <div key={`blank-${i}`} className="min-h-[6.5rem] bg-ink-50/40" aria-hidden />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = new Date(cursor.getFullYear(), cursor.getMonth(), i + 1);
          const key = dayKey(date);
          const items = byDay.get(key) ?? [];
          const isToday = date.getTime() === today.getTime();
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          const isOpen = expanded === key;
          const visible = isOpen ? items : items.slice(0, MAX_CHIPS_PER_DAY);

          return (
            <div
              key={key}
              className={cn(
                "min-h-[6.5rem] bg-surface p-1.5 transition-colors",
                isWeekend && "bg-ink-50/50",
                items.length > 0 && "bg-surface"
              )}
            >
              <div className="mb-1 flex items-center justify-between px-0.5">
                <span
                  className={cn(
                    "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-2xs font-semibold tabular-nums",
                    isToday ? "bg-navy-600 dark:bg-navy-400 text-white" : "text-ink-400 dark:text-ink-600"
                  )}
                >
                  {i + 1}
                </span>
                {items.length > 0 && (
                  <span className="text-2xs font-semibold tabular-nums text-ink-400 dark:text-ink-600">{items.length}</span>
                )}
              </div>

              <ul className="space-y-1">
                {visible.map((tender) => {
                  const deadline = new Date(tender.deadline);
                  deadline.setHours(0, 0, 0, 0);
                  const daysLeft = Math.round((deadline.getTime() - today.getTime()) / 86400000);
                  return (
                    <li key={tender.id}>
                      <Link
                        href={tenderDetailHref(tender.id)}
                        title={`${tender.title} · ${tender.value} · ${tender.organization}`}
                        className={cn(
                          "block truncate rounded-md border px-1.5 py-1 text-2xs font-medium transition-colors",
                          CHIP_TONE[toneForDays(daysLeft)]
                        )}
                      >
                        {tender.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {items.length > MAX_CHIPS_PER_DAY && (
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : key)}
                  className="mt-1 w-full rounded-md px-1.5 py-0.5 text-left text-2xs font-medium text-ink-400 dark:text-ink-600 transition-colors hover:bg-ink-50 dark:hover:bg-ink-950 hover:text-ink-700 dark:hover:text-ink-200"
                >
                  {isOpen ? "Show less" : `+${items.length - MAX_CHIPS_PER_DAY} more`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-ink-200 dark:border-ink-800 bg-ink-50/70 px-4 py-2 text-2xs text-ink-500 dark:text-ink-400">
        {[
          ["Closing in 3 days or less", "bg-danger-500"],
          ["Closing this week", "bg-warning-500"],
          ["Later", "bg-navy-500 dark:bg-navy-400"],
          ["Closed", "bg-ink-300 dark:bg-ink-700"],
        ].map(([label, dot]) => (
          <span key={label} className="inline-flex items-center gap-1.5">
            <span className={cn("h-1.5 w-1.5 rounded-full", dot)} aria-hidden />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
