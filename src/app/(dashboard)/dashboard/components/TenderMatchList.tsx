"use client";

import Link from "next/link";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type MatchStatus = "Matched" | "Interested" | "Applied" | "Won" | "Lost";

export interface MatchItem {
  title: string;
  fit_score: number;
  status: MatchStatus;
  reason: string;
  tenderId?: string;
}

interface TenderMatchListProps {
  matches: MatchItem[];
}

const statusStyles: Record<MatchStatus, string> = {
  Matched: "bg-blue-100 text-blue-700",
  Interested: "bg-violet-100 text-violet-700",
  Applied: "bg-amber-100 text-amber-700",
  Won: "bg-emerald-100 text-emerald-700",
  Lost: "bg-rose-100 text-rose-700"
};

type FilterId = "all" | "strong" | "pipeline";

const filters: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "strong", label: "Strong fit (80+)" },
  { id: "pipeline", label: "Active (hide lost)" }
];

function fitScoreColor(score: number) {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-rose-500";
}

function fitLabelColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-rose-600";
}

export function TenderMatchList({ matches }: TenderMatchListProps) {
  const [filter, setFilter] = useState<FilterId>("all");

  const filtered = useMemo(() => {
    if (filter === "strong") return matches.filter((m) => m.fit_score >= 80);
    if (filter === "pipeline") return matches.filter((m) => m.status !== "Lost");
    return matches;
  }, [matches, filter]);

  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Recent matches</h2>
          <p className="mt-1 text-xs text-slate-500">
            Filter the list, then open a tender for full details.
          </p>
        </div>
        <p className="text-xs tabular-nums text-slate-400">Updated just now</p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="flex flex-wrap items-center gap-1.5"
          role="group"
          aria-label="Filter matches"
        >
          <SlidersHorizontal className="mr-1 hidden h-3.5 w-3.5 text-slate-400 sm:block" aria-hidden />
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
                filter === f.id
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500">
          Showing <span className="font-medium tabular-nums text-slate-700">{filtered.length}</span> of{" "}
          <span className="tabular-nums text-slate-700">{matches.length}</span>
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-slate-50/90 py-10 text-center text-sm text-slate-500">
          No tenders match this filter. Try &ldquo;All&rdquo; or adjust filters on the tenders page.
        </p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((match) => {
            const href = match.tenderId ? `/tenders/${match.tenderId}` : "/tenders";
            return (
              <li key={match.title}>
                <Link
                  href={href}
                  className="group block rounded-xl border border-slate-200 bg-white p-3.5 transition-all hover:border-slate-300 hover:bg-slate-50/90 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="min-w-0 flex-1 font-medium leading-snug text-slate-900 group-hover:text-slate-950">
                      {match.title}
                    </p>
                    <ChevronRight
                      className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500"
                      aria-hidden
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-14 overflow-hidden rounded-full bg-slate-100"
                        aria-hidden
                      >
                        <div
                          className={cn("h-full rounded-full transition-all", fitScoreColor(match.fit_score))}
                          style={{ width: `${match.fit_score}%` }}
                        />
                      </div>
                      <span className={cn("text-sm font-semibold tabular-nums", fitLabelColor(match.fit_score))}>
                        Fit {match.fit_score}
                      </span>
                    </div>
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", statusStyles[match.status])}>
                      {match.status}
                    </span>
                  </div>
                  <p className="mt-2 border-t border-slate-100 pt-2 text-sm leading-relaxed text-slate-600">
                    {match.reason}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <div className="border-t border-border pt-3">
        <Link
          href="/tenders"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
        >
          View all tenders
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </Card>
  );
}
