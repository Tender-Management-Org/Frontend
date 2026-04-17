"use client";

import { useEffect, useState } from "react";

export interface DashboardWelcomeProps {
  /** Shown as compact summary chips under the subtitle */
  summary?: {
    needsDecision: number;
    expiringSoon: number;
    applied: number;
  };
}

type ClockState = {
  greeting: string;
  dateLabel: string;
  timeLabel: string;
};

export function DashboardWelcome({ summary }: DashboardWelcomeProps) {
  const [clock, setClock] = useState<ClockState | null>(null);

  useEffect(() => {
    const now = new Date();
    const h = now.getHours();
    const greeting =
      h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
    const dateLabel = now.toLocaleDateString("en-IN", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
    const timeLabel = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit"
    });
    setClock({ greeting, dateLabel, timeLabel });
  }, []);

  return (
    <div className="min-w-0">
      <div className="flex min-h-[1.25rem] flex-wrap items-baseline gap-x-3 gap-y-1">
        {clock ? (
          <>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{clock.dateLabel}</p>
            <span className="text-xs tabular-nums text-slate-400" aria-hidden>
              ·
            </span>
            <p className="text-xs tabular-nums text-slate-400">{clock.timeLabel}</p>
          </>
        ) : (
          <>
            <span
              className="inline-block h-3 w-[11rem] max-w-full animate-pulse rounded bg-slate-200/90"
              aria-hidden
            />
            <span className="select-none text-xs text-transparent" aria-hidden>
              ·
            </span>
            <span
              className="inline-block h-3 w-14 animate-pulse rounded bg-slate-200/90"
              aria-hidden
            />
            <span className="sr-only">Loading date and time</span>
          </>
        )}
      </div>
      <h2 className="mt-2 min-h-[2rem] text-2xl font-semibold tracking-tight text-slate-900 md:min-h-[2.25rem] md:text-3xl">
        {clock ? (
          clock.greeting
        ) : (
          <span
            className="inline-block h-8 w-[10rem] max-w-[85%] animate-pulse rounded-lg bg-slate-200/90 md:h-9"
            aria-hidden
          />
        )}
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
        Your pipeline at a glance — new matches, deadlines that need attention, and how bids convert.
      </p>

      {summary && (
        <ul
          className="mt-4 flex flex-wrap gap-2"
          aria-label="Key counts"
        >
          <li className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
            <span className="tabular-nums font-semibold text-rose-600">{summary.needsDecision}</span>
            <span className="text-slate-500"> need a decision</span>
          </li>
          <li className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
            <span className="tabular-nums font-semibold text-amber-600">{summary.expiringSoon}</span>
            <span className="text-slate-500"> expiring soon</span>
          </li>
          <li className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
            <span className="tabular-nums font-semibold text-emerald-600">{summary.applied}</span>
            <span className="text-slate-500"> applied</span>
          </li>
        </ul>
      )}
    </div>
  );
}
