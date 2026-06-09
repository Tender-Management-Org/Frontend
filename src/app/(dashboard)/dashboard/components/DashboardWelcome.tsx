"use client";

import { useEffect, useState } from "react";

export interface DashboardWelcomeProps {
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
    const greeting = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
    const dateLabel = now.toLocaleDateString("en-IN", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const timeLabel = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });
    setClock({ greeting, dateLabel, timeLabel });
  }, []);

  return (
    <div className="min-w-0">
      <div className="flex min-h-[1.25rem] flex-wrap items-baseline gap-x-2 gap-y-1">
        {clock ? (
          <>
            <p className="text-xs font-medium text-ink-400">{clock.dateLabel}</p>
            <span className="text-ink-200" aria-hidden>·</span>
            <p className="text-xs tabular-nums text-ink-400">{clock.timeLabel} IST</p>
          </>
        ) : (
          <span className="inline-block h-3 w-48 animate-pulse rounded bg-ink-200" aria-hidden />
        )}
      </div>

      <h2 className="mt-2 min-h-[2.25rem] text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
        {clock ? (
          clock.greeting
        ) : (
          <span className="inline-block h-8 w-52 animate-pulse rounded-lg bg-ink-200" aria-hidden />
        )}
      </h2>

      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-ink-500">
        Your tender pipeline at a glance — new matches, urgent deadlines, and bid progress.
      </p>

      {summary && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Pipeline summary">
          <li className="inline-flex items-center gap-1.5 rounded-full border border-danger-200 bg-danger-50 px-3 py-1 text-xs font-medium">
            <span className="tabular-nums font-bold text-danger-600">{summary.needsDecision}</span>
            <span className="text-ink-500">need decision</span>
          </li>
          <li className="inline-flex items-center gap-1.5 rounded-full border border-warning-200 bg-warning-50 px-3 py-1 text-xs font-medium">
            <span className="tabular-nums font-bold text-warning-600">{summary.expiringSoon}</span>
            <span className="text-ink-500">expiring soon</span>
          </li>
          <li className="inline-flex items-center gap-1.5 rounded-full border border-success-200 bg-success-50 px-3 py-1 text-xs font-medium">
            <span className="tabular-nums font-bold text-success-600">{summary.applied}</span>
            <span className="text-ink-500">applied</span>
          </li>
        </ul>
      )}
    </div>
  );
}
