"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  IndianRupee,
  MapPin,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { markRecommendationsRead, type TenderRecommendationApi } from "@/lib/api/tenders";
import { tenderDetailHref } from "@/lib/tenders/path";
import { TenderMatchActionButton } from "@/components/tenders/TenderMatchActionButton";

// ─── helpers ────────────────────────────────────────────────────────────────

function formatInr(value: string | null | undefined) {
  if (!value) return "—";
  const num = Number(value);
  if (!Number.isFinite(num)) return value;
  if (num >= 10_000_000) return `₹${(num / 10_000_000).toFixed(2)} Cr`;
  if (num >= 100_000) return `₹${(num / 100_000).toFixed(2)} L`;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function deadlineMeta(value: string | null) {
  if (!value) return { label: "No deadline", tone: "neutral" as const };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { label: "Date unavailable", tone: "neutral" as const };
  const daysLeft = Math.ceil((date.getTime() - Date.now()) / 86400000);
  if (daysLeft < 0) return { label: "Closed", tone: "danger" as const };
  if (daysLeft === 0) return { label: "Due today", tone: "danger" as const };
  if (daysLeft <= 3) return { label: `${daysLeft}d left`, tone: "danger" as const };
  if (daysLeft <= 7) return { label: `${daysLeft}d left`, tone: "warning" as const };
  return { label: `${daysLeft}d left`, tone: "neutral" as const };
}

function formatSource(slug: string): string {
  return slug.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function fitBand(score: number | null) {
  if (score == null) return { label: "—", color: "text-ink-400 dark:text-ink-600", bar: "bg-ink-200 dark:bg-ink-800" };
  if (score >= 80) return { label: `${score} · High`, color: "text-success-700 dark:text-success-400", bar: "bg-success-500" };
  if (score >= 60) return { label: `${score} · Medium`, color: "text-warning-700 dark:text-warning-400", bar: "bg-warning-500" };
  return { label: `${score} · Low`, color: "text-danger-600 dark:text-danger-400", bar: "bg-danger-500" };
}

const statusBadge: Record<string, string> = {
  matched: "bg-blue-50 dark:bg-accent-blue-bg text-blue-700 dark:text-accent-blue border border-blue-200 dark:border-accent-blue-bg",
  interested: "bg-violet-50 dark:bg-accent-purple-bg text-violet-700 dark:text-accent-purple border border-violet-200 dark:border-accent-purple-bg",
  applied: "bg-warning-50 dark:bg-warning-500/10 text-warning-700 dark:text-warning-400 border border-warning-200 dark:border-warning-500/30",
  won: "bg-success-50 dark:bg-success-500/10 text-success-700 dark:text-success-400 border border-success-200 dark:border-success-500/30",
  lost: "bg-danger-50 dark:bg-danger-500/10 text-danger-700 dark:text-danger-400 border border-danger-200 dark:border-danger-500/30",
  ignored: "bg-ink-100 dark:bg-ink-900 text-ink-500 dark:text-ink-400 border border-ink-200 dark:border-ink-800",
};

// ─── component ───────────────────────────────────────────────────────────────

interface Props {
  item: TenderRecommendationApi;
  firmId: string;
}

export function RecommendationCard({ item, firmId }: Props) {
  const router = useRouter();
  const [isRead, setIsRead] = useState(item.is_read);
  const [markingRead, setMarkingRead] = useState(false);

  const dl = deadlineMeta(item.bid_submission_end_date);
  const fit = fitBand(item.fit_score);
  const detailHref = tenderDetailHref(item.tender_id);

  function broadcastRead() {
    window.dispatchEvent(new CustomEvent("recommendation-read"));
  }

  async function handleMarkRead() {
    if (isRead || markingRead) return;
    setMarkingRead(true);
    try {
      await markRecommendationsRead(firmId, [item.match_id]);
      setIsRead(true);
      broadcastRead();
    } catch {
      // Best-effort — let them try again
    } finally {
      setMarkingRead(false);
    }
  }

  async function handleViewDetails() {
    if (!isRead) {
      setIsRead(true);
      broadcastRead();
      markRecommendationsRead(firmId, [item.match_id]).catch(() => {});
    }
    router.push(detailHref);
  }

  return (
    <article
      className={cn(
        "group relative rounded-2xl border bg-surface p-5 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5",
        isRead ? "border-ink-200 dark:border-ink-800" : "border-l-4 border-l-navy-500 border-ink-200 dark:border-ink-800"
      )}
    >
      {/* Unread dot */}
      {!isRead && (
        <span className="absolute right-4 top-4 flex h-2 w-2 rounded-full bg-navy-500 dark:bg-primary" aria-label="Unread" />
      )}

      {/* Top row */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="text-base font-semibold leading-snug text-ink-900 dark:text-ink-50 group-hover:text-navy-700 dark:group-hover:text-navy-500 transition-colors pr-4">
            {item.title}
          </h3>
          <p className="text-xs font-mono text-ink-400 dark:text-ink-600">#{item.tender_id}</p>
          <p className="flex items-center gap-1.5 text-sm text-ink-500 dark:text-ink-400">
            <Building2 className="h-3.5 w-3.5 shrink-0 text-ink-400 dark:text-ink-600" aria-hidden />
            <span className="truncate">{item.organisation_chain}</span>
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
              statusBadge[item.status] ?? "bg-ink-100 dark:bg-ink-900 text-ink-600 dark:text-ink-300"
            )}
          >
            {item.status}
          </span>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-semibold",
              dl.tone === "danger" && "bg-danger-50 dark:bg-danger-500/10 text-danger-700 dark:text-danger-400 border border-danger-200 dark:border-danger-500/30",
              dl.tone === "warning" && "bg-warning-50 dark:bg-warning-500/10 text-warning-700 dark:text-warning-400 border border-warning-200 dark:border-warning-500/30",
              dl.tone === "neutral" && "bg-ink-100 dark:bg-ink-900 text-ink-600 dark:text-ink-300"
            )}
          >
            {dl.label}
          </span>
        </div>
      </div>

      {/* Meta row */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-ink-50 dark:bg-ink-950 px-2.5 py-2">
          <p className="mb-0.5 text-2xs font-semibold uppercase tracking-widest text-ink-400 dark:text-ink-600">Location</p>
          <p className="flex items-center gap-1 text-xs font-medium text-ink-700 dark:text-ink-200 truncate">
            <MapPin className="h-3 w-3 shrink-0 text-ink-400 dark:text-ink-600" aria-hidden />
            <span className="truncate">{item.location || "—"}</span>
          </p>
        </div>
        <div className="rounded-lg bg-ink-50 dark:bg-ink-950 px-2.5 py-2">
          <p className="mb-0.5 text-2xs font-semibold uppercase tracking-widest text-ink-400 dark:text-ink-600">Value</p>
          <p className="flex items-center gap-1 text-xs font-semibold text-ink-800 dark:text-ink-100 truncate">
            <IndianRupee className="h-3 w-3 shrink-0 text-ink-400 dark:text-ink-600" aria-hidden />
            <span className="truncate">{formatInr(item.tender_value)}</span>
          </p>
        </div>
        <div className="rounded-lg bg-ink-50 dark:bg-ink-950 px-2.5 py-2">
          <p className="mb-0.5 text-2xs font-semibold uppercase tracking-widest text-ink-400 dark:text-ink-600">Deadline</p>
          <p className="flex items-center gap-1 text-xs font-medium text-ink-700 dark:text-ink-200 truncate">
            <CalendarDays className="h-3 w-3 shrink-0 text-ink-400 dark:text-ink-600" aria-hidden />
            <span className="truncate">{formatDate(item.bid_submission_end_date)}</span>
          </p>
        </div>
      </div>

      {/* Category + fit score */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-400">
          <Tag className="h-3 w-3 shrink-0 text-ink-400 dark:text-ink-600" aria-hidden />
          <span className="truncate">{item.product_category}{item.sub_category ? ` · ${item.sub_category}` : ""}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-900" aria-hidden>
            <div
              className={cn("h-full rounded-full", fit.bar)}
              style={{ width: `${item.fit_score ?? 0}%` }}
            />
          </div>
          <span className={cn("text-xs font-semibold", fit.color)}>Fit: {fit.label}</span>
        </div>
      </div>

      {/* Match reason */}
      {item.match_reason && (
        <p className="mt-3 text-xs leading-relaxed text-ink-500 dark:text-ink-400 line-clamp-2">{item.match_reason}</p>
      )}

      {/* Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 dark:border-ink-900 pt-3">
        <div className="flex flex-wrap items-center gap-2">
          {item.source && (
            <span className="inline-flex items-center rounded-full border border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 px-2.5 py-0.5 text-xs font-medium text-ink-500 dark:text-ink-400">
              {formatSource(item.source)}
            </span>
          )}
          <TenderMatchActionButton
            tenderId={item.tender_id}
            status="ignored"
            label="Not for me"
            loadingLabel="Dismissing…"
            icon="eye-off"
            errorMessage="Could not dismiss tender. Please try again."
          />
          {!isRead && (
            <button
              type="button"
              onClick={handleMarkRead}
              disabled={markingRead}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 dark:border-ink-800 px-3 py-2 text-xs font-medium text-ink-600 dark:text-ink-300 transition-colors hover:bg-ink-50 dark:hover:bg-ink-950 disabled:opacity-50"
            >
              <Check className="h-3.5 w-3.5" aria-hidden />
              {markingRead ? "Marking…" : "Mark as read"}
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={handleViewDetails}
          className="inline-flex items-center gap-1.5 rounded-lg bg-ink-900 dark:bg-ink-50 px-3.5 py-2 text-xs font-semibold text-white dark:text-ink-900 transition-colors hover:bg-navy-700 dark:hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:focus-visible:ring-navy-400"
        >
          View details
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
    </article>
  );
}
