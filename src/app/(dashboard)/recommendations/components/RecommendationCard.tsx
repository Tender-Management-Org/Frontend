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

function fitBand(score: number | null) {
  if (score == null) return { label: "—", color: "text-ink-400", bar: "bg-ink-200" };
  if (score >= 80) return { label: `${score} · High`, color: "text-success-700", bar: "bg-success-500" };
  if (score >= 60) return { label: `${score} · Medium`, color: "text-warning-700", bar: "bg-warning-500" };
  return { label: `${score} · Low`, color: "text-danger-600", bar: "bg-danger-500" };
}

const statusBadge: Record<string, string> = {
  matched: "bg-blue-50 text-blue-700 border border-blue-200",
  interested: "bg-violet-50 text-violet-700 border border-violet-200",
  applied: "bg-warning-50 text-warning-700 border border-warning-200",
  won: "bg-success-50 text-success-700 border border-success-200",
  lost: "bg-danger-50 text-danger-700 border border-danger-200",
  ignored: "bg-ink-100 text-ink-500 border border-ink-200",
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
  const detailHref = `/tenders/${encodeURIComponent(item.tender_id)}`;

  async function handleMarkRead() {
    if (isRead || markingRead) return;
    setMarkingRead(true);
    try {
      await markRecommendationsRead(firmId, [item.match_id]);
      setIsRead(true);
    } catch {
      // Best-effort — let them try again
    } finally {
      setMarkingRead(false);
    }
  }

  async function handleViewDetails() {
    // Mark as read first (fire-and-forget), then navigate
    if (!isRead) {
      setIsRead(true);
      markRecommendationsRead(firmId, [item.match_id]).catch(() => {
        // Best-effort
      });
    }
    router.push(detailHref);
  }

  return (
    <article
      className={cn(
        "group relative rounded-2xl border bg-white p-5 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5",
        isRead ? "border-ink-200" : "border-l-4 border-l-navy-500 border-ink-200"
      )}
    >
      {/* Unread dot */}
      {!isRead && (
        <span className="absolute right-4 top-4 flex h-2 w-2 rounded-full bg-navy-500" aria-label="Unread" />
      )}

      {/* Top row */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="text-base font-semibold leading-snug text-ink-900 group-hover:text-navy-700 transition-colors pr-4">
            {item.title}
          </h3>
          <p className="text-xs font-mono text-ink-400">#{item.tender_id}</p>
          <p className="flex items-center gap-1.5 text-sm text-ink-500">
            <Building2 className="h-3.5 w-3.5 shrink-0 text-ink-400" aria-hidden />
            <span className="truncate">{item.organisation_chain}</span>
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
              statusBadge[item.status] ?? "bg-ink-100 text-ink-600"
            )}
          >
            {item.status}
          </span>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-semibold",
              dl.tone === "danger" && "bg-danger-50 text-danger-700 border border-danger-200",
              dl.tone === "warning" && "bg-warning-50 text-warning-700 border border-warning-200",
              dl.tone === "neutral" && "bg-ink-100 text-ink-600"
            )}
          >
            {dl.label}
          </span>
        </div>
      </div>

      {/* Meta row */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-ink-50 px-2.5 py-2">
          <p className="mb-0.5 text-2xs font-semibold uppercase tracking-widest text-ink-400">Location</p>
          <p className="flex items-center gap-1 text-xs font-medium text-ink-700 truncate">
            <MapPin className="h-3 w-3 shrink-0 text-ink-400" aria-hidden />
            <span className="truncate">{item.location || "—"}</span>
          </p>
        </div>
        <div className="rounded-lg bg-ink-50 px-2.5 py-2">
          <p className="mb-0.5 text-2xs font-semibold uppercase tracking-widest text-ink-400">Value</p>
          <p className="flex items-center gap-1 text-xs font-semibold text-ink-800 truncate">
            <IndianRupee className="h-3 w-3 shrink-0 text-ink-400" aria-hidden />
            <span className="truncate">{formatInr(item.tender_value)}</span>
          </p>
        </div>
        <div className="rounded-lg bg-ink-50 px-2.5 py-2">
          <p className="mb-0.5 text-2xs font-semibold uppercase tracking-widest text-ink-400">Deadline</p>
          <p className="flex items-center gap-1 text-xs font-medium text-ink-700 truncate">
            <CalendarDays className="h-3 w-3 shrink-0 text-ink-400" aria-hidden />
            <span className="truncate">{formatDate(item.bid_submission_end_date)}</span>
          </p>
        </div>
      </div>

      {/* Category + fit score */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-ink-500">
          <Tag className="h-3 w-3 shrink-0 text-ink-400" aria-hidden />
          <span className="truncate">{item.product_category}{item.sub_category ? ` · ${item.sub_category}` : ""}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-ink-100" aria-hidden>
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
        <p className="mt-3 text-xs leading-relaxed text-ink-500 line-clamp-2">{item.match_reason}</p>
      )}

      {/* Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-3">
        <div className="flex items-center gap-2">
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
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-2 text-xs font-medium text-ink-600 transition-colors hover:bg-ink-50 disabled:opacity-50"
            >
              <Check className="h-3.5 w-3.5" aria-hidden />
              {markingRead ? "Marking…" : "Mark as read"}
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={handleViewDetails}
          className="inline-flex items-center gap-1.5 rounded-lg bg-ink-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500"
        >
          View details
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
    </article>
  );
}
