"use client";

import { useEffect, useRef, useState } from "react";
import {
  BarChart2,
  Building2,
  Inbox,
  Loader2,
  MapPin,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api/client";
import {
  getRelatedTenders,
  getTenderBidResult,
  type TenderBidResultApi,
  type TenderRelatedApi,
} from "@/lib/api/tenders";
import { cn } from "@/lib/utils";

function formatInr(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return "—";
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(2)} L`;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatTenderValue(value: string | number | null | undefined): string {
  if (value == null || value === "") return "—";
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? formatInr(parsed) : "—";
}

function shortOrg(chain: string | null | undefined): string {
  if (!chain) return "—";
  const parts = chain
    .split("||")
    .map((part) => part.trim())
    .filter(Boolean);
  return parts[parts.length - 1] || chain;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function pickString(obj: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function pickNumber(obj: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value.replace(/,/g, ""));
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return null;
}

function pickBool(obj: Record<string, unknown>, keys: string[]): boolean {
  return keys.some((key) => obj[key] === true);
}

type BidRow = {
  firmName: string;
  amount: number | null;
  isWinner: boolean;
  rank: string;
};

function normalizeBidResult(result: TenderBidResultApi): { winner: BidRow | null; bids: BidRow[] } {
  const awarded = (result.awarded_to ?? []).map(asRecord).filter((row): row is Record<string, unknown> => Boolean(row));
  const financial = (result.financial_bids ?? []).map(asRecord).filter((row): row is Record<string, unknown> => Boolean(row));
  const nameKeys = ["seller_name", "firm_name", "bidder_name", "vendor_name", "name"];
  const amountKeys = ["quoted_price", "awarded_value", "bid_amount", "price", "amount"];

  const winnerNames = new Set(
    awarded
      .map((row) => pickString(row, nameKeys).toLowerCase())
      .filter(Boolean),
  );

  const bids: BidRow[] = financial.map((row) => {
    const firmName = pickString(row, nameKeys) || "Unknown firm";
    const rank = pickString(row, ["rank"]);
    const isWinner =
      pickBool(row, ["awarded", "is_awarded", "winner"]) ||
      rank.toUpperCase() === "L1" ||
      winnerNames.has(firmName.toLowerCase());
    return {
      firmName,
      amount: pickNumber(row, amountKeys),
      isWinner,
      rank,
    };
  });

  if (bids.length === 0) {
    for (const row of awarded) {
      bids.push({
        firmName: pickString(row, nameKeys) || "Unknown firm",
        amount: pickNumber(row, amountKeys),
        isWinner: true,
        rank: pickString(row, ["rank"]) || "L1",
      });
    }
  }

  const winner =
    bids.find((bid) => bid.isWinner) ??
    (awarded[0]
      ? {
          firmName: pickString(awarded[0], nameKeys) || "Unknown firm",
          amount: pickNumber(awarded[0], amountKeys),
          isWinner: true,
          rank: pickString(awarded[0], ["rank"]) || "L1",
        }
      : null);

  const sorted = [...bids].sort((a, b) => {
    if (a.isWinner !== b.isWinner) return a.isWinner ? -1 : 1;
    if (a.amount != null && b.amount != null) return a.amount - b.amount;
    return 0;
  });

  return { winner, bids: sorted };
}

interface RelatedTendersInsightsProps {
  tenderId: string;
}

export function RelatedTendersInsights({ tenderId }: RelatedTendersInsightsProps) {
  const [related, setRelated] = useState<TenderRelatedApi[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bidResult, setBidResult] = useState<TenderBidResultApi | null>(null);
  const [bidLoading, setBidLoading] = useState(false);
  const [bidError, setBidError] = useState<string | null>(null);
  const requestSeq = useRef(0);

  useEffect(() => {
    let cancelled = false;
    setListLoading(true);
    setListError(null);
    setSelectedId(null);
    setBidResult(null);
    setBidError(null);

    getRelatedTenders(tenderId)
      .then((rows) => {
        if (!cancelled) setRelated(rows);
      })
      .catch((error) => {
        if (cancelled) return;
        if (error instanceof ApiError && error.status === 401) {
          setListError("Session expired — please sign in again.");
        } else {
          setListError("Could not load related tenders. Please try again.");
        }
      })
      .finally(() => {
        if (!cancelled) setListLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tenderId]);

  async function handleAnalyse(relatedTenderId: string) {
    const seq = ++requestSeq.current;
    setSelectedId(relatedTenderId);
    setBidLoading(true);
    setBidError(null);
    setBidResult(null);

    try {
      const result = await getTenderBidResult(relatedTenderId);
      if (requestSeq.current !== seq) return;
      setBidResult(result);
    } catch (error) {
      if (requestSeq.current !== seq) return;
      if (error instanceof ApiError && error.status === 404) {
        setBidError("No bidding results are available for this tender yet.");
      } else if (error instanceof ApiError && error.status === 401) {
        setBidError("Session expired — please sign in again.");
      } else {
        setBidError("Could not load bidding details. Please try again.");
      }
    } finally {
      if (requestSeq.current === seq) setBidLoading(false);
    }
  }

  const selected = related.find((row) => row.tender_id === selectedId) ?? null;
  const analysis = bidResult ? normalizeBidResult(bidResult) : null;

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-ink-500 dark:text-ink-400">
          Related Tenders
        </h3>
        <p className="mt-0.5 text-xs text-ink-400 dark:text-ink-600">
          Top 10 similar tenders. Analyse one to inspect its bid results without leaving this page.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-stretch">
        <div className="flex min-h-[28rem] flex-col overflow-hidden rounded-2xl border border-ink-200 dark:border-ink-800 bg-surface shadow-card">
          {listLoading ? (
            <div className="flex flex-1 items-center justify-center gap-2 text-sm text-ink-400 dark:text-ink-600">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Loading related tenders…
            </div>
          ) : listError ? (
            <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-danger-600 dark:text-danger-400">
              {listError}
            </div>
          ) : related.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
              <Inbox className="h-8 w-8 text-ink-300 dark:text-ink-700" aria-hidden />
              <p className="text-sm text-ink-500 dark:text-ink-400">No related tenders found.</p>
            </div>
          ) : (
            <ol className="flex-1 divide-y divide-ink-100 overflow-y-auto dark:divide-ink-900" aria-label="Related tenders">
              {related.map((row, index) => {
                const isSelected = row.tender_id === selectedId;
                const isAnalysing = isSelected && bidLoading;
                return (
                  <li
                    key={row.tender_id}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3.5",
                      isSelected && "bg-navy-50/60 dark:bg-accent-blue-bg/40",
                    )}
                  >
                    <span className="mt-0.5 w-5 shrink-0 text-xs font-semibold tabular-nums text-ink-400 dark:text-ink-600">
                      {index + 1}.
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-snug text-ink-900 dark:text-ink-50">
                        {row.title}
                      </p>
                      <p className="mt-0.5 font-mono text-2xs text-ink-400 dark:text-ink-600">#{row.tender_id}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-400">
                        <Building2 className="h-3 w-3 shrink-0" aria-hidden />
                        <span className="truncate">{shortOrg(row.organisation_chain)}</span>
                      </p>
                      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-2xs text-ink-400 dark:text-ink-600">
                        {row.location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" aria-hidden />
                            {row.location}
                          </span>
                        )}
                        <span>{formatTenderValue(row.tender_value)}</span>
                        <span className="capitalize">{row.status}</span>
                        {row.similarity_score > 0 && (
                          <span className="rounded-full bg-navy-50 px-1.5 py-0.5 font-semibold text-navy-700 dark:bg-accent-blue-bg dark:text-accent-blue">
                            {Math.round(row.similarity_score * 100)}% match
                          </span>
                        )}
                        {row.has_bid_result && (
                          <span className="rounded-full bg-success-50 px-1.5 py-0.5 font-semibold text-success-700 dark:bg-success-500/10 dark:text-success-400">
                            Bid result
                          </span>
                        )}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant={isSelected ? "primary" : "secondary"}
                      size="sm"
                      className="shrink-0"
                      onClick={() => void handleAnalyse(row.tender_id)}
                      disabled={isAnalysing}
                      aria-pressed={isSelected}
                    >
                      {isAnalysing ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                      ) : (
                        <BarChart2 className="h-3.5 w-3.5" aria-hidden />
                      )}
                      {isAnalysing ? "Analysing…" : "Analyse"}
                    </Button>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        <div className="flex min-h-[28rem] flex-col rounded-2xl border border-ink-200 dark:border-ink-800 bg-surface p-5 shadow-card">
          {!selectedId && !bidLoading ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
              <BarChart2 className="h-9 w-9 text-ink-300 dark:text-ink-700" aria-hidden />
              <p className="text-sm font-medium text-ink-600 dark:text-ink-300">Select a tender to analyse</p>
              <p className="max-w-xs text-xs text-ink-400 dark:text-ink-600">
                Click Analyse on a related tender to see the winning firm, bid amounts, and other participants.
              </p>
            </div>
          ) : bidLoading ? (
            <div className="flex flex-1 items-center justify-center gap-2 text-sm text-ink-400 dark:text-ink-600">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Loading bidding details…
            </div>
          ) : bidError ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
              <Inbox className="h-8 w-8 text-ink-300 dark:text-ink-700" aria-hidden />
              <p className="text-sm text-ink-500 dark:text-ink-400">{bidError}</p>
              {selected && (
                <p className="max-w-xs truncate text-xs text-ink-400 dark:text-ink-600">{selected.title}</p>
              )}
            </div>
          ) : analysis && bidResult ? (
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
              <div>
                <p className="text-2xs font-semibold uppercase tracking-wide text-ink-400 dark:text-ink-600">
                  Bid analysis
                </p>
                <h4 className="mt-1 text-sm font-semibold leading-snug text-ink-900 dark:text-ink-50">
                  {selected?.title ?? bidResult.title}
                </h4>
                <p className="mt-0.5 font-mono text-2xs text-ink-400 dark:text-ink-600">
                  #{selected?.tender_id ?? bidResult.bid_number}
                </p>
              </div>

              <div
                className={cn(
                  "rounded-xl border px-4 py-3",
                  analysis.winner
                    ? "border-success-500/30 bg-success-50 dark:bg-success-500/10"
                    : "border-ink-200 bg-ink-50 dark:border-ink-800 dark:bg-ink-950",
                )}
              >
                <p className="flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-wide text-success-700 dark:text-success-400">
                  <Trophy className="h-3.5 w-3.5" aria-hidden />
                  Winning firm
                </p>
                {analysis.winner ? (
                  <>
                    <p className="mt-1 text-sm font-bold text-ink-900 dark:text-ink-50">
                      {analysis.winner.firmName}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold tabular-nums text-success-700 dark:text-success-400">
                      {formatInr(analysis.winner.amount)}
                    </p>
                  </>
                ) : (
                  <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
                    No awarded firm recorded for this tender.
                  </p>
                )}
              </div>

              <div>
                <p className="mb-2 text-2xs font-semibold uppercase tracking-wide text-ink-400 dark:text-ink-600">
                  Participating firms
                  {analysis.bids.length > 0 ? ` · ${analysis.bids.length}` : ""}
                </p>
                {analysis.bids.length === 0 ? (
                  <p className="text-sm text-ink-400 dark:text-ink-600">No bid amounts listed.</p>
                ) : (
                  <ul className="space-y-2">
                    {analysis.bids.map((bid) => (
                      <li
                        key={`${bid.firmName}-${bid.rank}-${bid.amount ?? "na"}`}
                        className={cn(
                          "flex items-start justify-between gap-3 rounded-xl border px-3 py-2.5",
                          bid.isWinner
                            ? "border-success-500/40 bg-success-50 dark:bg-success-500/10"
                            : "border-ink-200 dark:border-ink-800",
                        )}
                      >
                        <div className="min-w-0">
                          <p
                            className={cn(
                              "truncate text-sm",
                              bid.isWinner
                                ? "font-bold text-ink-900 dark:text-ink-50"
                                : "font-medium text-ink-800 dark:text-ink-100",
                            )}
                          >
                            {bid.firmName}
                          </p>
                          <p className="mt-0.5 text-2xs text-ink-400 dark:text-ink-600">
                            {bid.isWinner ? "Winning bid" : bid.rank || "Participating bid"}
                          </p>
                        </div>
                        <p
                          className={cn(
                            "shrink-0 text-sm tabular-nums",
                            bid.isWinner
                              ? "font-bold text-success-700 dark:text-success-400"
                              : "font-medium text-ink-700 dark:text-ink-200",
                          )}
                        >
                          {formatInr(bid.amount)}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
