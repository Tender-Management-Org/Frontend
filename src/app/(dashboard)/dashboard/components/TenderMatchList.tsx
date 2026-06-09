"use client";

import Link from "next/link";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
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

const statusBadge: Record<MatchStatus, string> = {
  Matched: "bg-blue-50 text-blue-700 border border-blue-200",
  Interested: "bg-violet-50 text-violet-700 border border-violet-200",
  Applied: "bg-warning-50 text-warning-700 border border-warning-200",
  Won: "bg-success-50 text-success-700 border border-success-200",
  Lost: "bg-danger-50 text-danger-700 border border-danger-200",
};

type FilterId = "all" | "strong" | "pipeline";
const filterOptions: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "strong", label: "Strong fit (80+)" },
  { id: "pipeline", label: "Active" },
];

function fitBar(score: number) {
  if (score >= 80) return "bg-success-500";
  if (score >= 60) return "bg-warning-500";
  return "bg-danger-500";
}

function fitLabel(score: number) {
  if (score >= 80) return { text: "High", color: "text-success-700" };
  if (score >= 60) return { text: "Medium", color: "text-warning-700" };
  return { text: "Low", color: "text-danger-600" };
}

export function TenderMatchList({ matches }: TenderMatchListProps) {
  const [filter, setFilter] = useState<FilterId>("all");

  const filtered = useMemo(() => {
    if (filter === "strong") return matches.filter((m) => m.fit_score >= 80);
    if (filter === "pipeline") return matches.filter((m) => m.status !== "Lost");
    return matches;
  }, [matches, filter]);

  return (
    <Card className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-ink-900">Recent matches</h2>
          <p className="mt-0.5 text-xs text-ink-400">
            Showing <span className="tabular-nums font-semibold text-ink-700">{filtered.length}</span> of{" "}
            <span className="tabular-nums">{matches.length}</span> tenders
          </p>
        </div>
        <div className="flex items-center gap-1" role="group" aria-label="Filter matches">
          <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-ink-400" aria-hidden />
          {filterOptions.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500",
                filter === f.id
                  ? "bg-ink-900 text-white"
                  : "border border-ink-200 bg-white text-ink-600 hover:bg-ink-50"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink-200 bg-ink-50 py-12 text-center">
          <p className="text-sm font-medium text-ink-500">No tenders match this filter</p>
          <p className="mt-1 text-xs text-ink-400">Try &ldquo;All&rdquo; or browse the tenders page.</p>
        </div>
      ) : (
        <ul className="divide-y divide-ink-100">
          {filtered.map((match) => {
            const href = match.tenderId ? `/tenders/${match.tenderId}` : "/tenders";
            const isUrgent = match.status === "Matched" && match.fit_score >= 80;
            const { text: fitText, color: fitColor } = fitLabel(match.fit_score);
            return (
              <li key={match.title}>
                <Link
                  href={href}
                  className={cn(
                    "group flex flex-col gap-3 py-4 transition-colors hover:bg-ink-50 px-2 -mx-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold leading-snug text-ink-900 group-hover:text-navy-700">
                        {match.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-500">{match.reason}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-navy-600" aria-hidden />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Fit score bar */}
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-ink-100" aria-hidden>
                        <div
                          className={cn("h-full rounded-full", fitBar(match.fit_score))}
                          style={{ width: `${match.fit_score}%` }}
                        />
                      </div>
                      <span className={cn("text-xs font-semibold tabular-nums", fitColor)}>
                        {match.fit_score} · {fitText}
                      </span>
                    </div>
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", statusBadge[match.status])}>
                      {match.status}
                    </span>
                    {isUrgent && (
                      <span className="rounded-full bg-navy-100 px-2 py-0.5 text-xs font-semibold text-navy-700">
                        Priority review
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <div className="border-t border-ink-100 pt-4">
        <Link
          href="/tenders"
          className="inline-flex items-center gap-1 text-sm font-semibold text-navy-600 hover:text-navy-700"
        >
          View all tenders
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </Card>
  );
}
