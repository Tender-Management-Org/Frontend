import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  EyeOff,
  IndianRupee,
  MapPin,
  Sparkles,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ApiError } from "@/lib/api/client";
import { getFirms } from "@/lib/api/firms";
import { getRecommendations, type TenderRecommendationApi } from "@/lib/api/tenders";
import { TenderMatchActionButton } from "@/components/tenders/TenderMatchActionButton";
import { RefreshButton } from "./components/RefreshButton";

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

// ─── card ────────────────────────────────────────────────────────────────────

function RecommendationCard({ item }: { item: TenderRecommendationApi }) {
  const dl = deadlineMeta(item.bid_submission_end_date);
  const fit = fitBand(item.fit_score);

  return (
    <article className="group rounded-2xl border border-ink-200 bg-white p-5 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5">
      {/* Top row */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="text-base font-semibold leading-snug text-ink-900 group-hover:text-navy-700 transition-colors">
            <Link
              href={`/tenders/${encodeURIComponent(item.tender_id)}`}
              className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 rounded-sm"
            >
              {item.title}
            </Link>
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
        <TenderMatchActionButton
          tenderId={item.tender_id}
          status="ignored"
          label="Not for me"
          loadingLabel="Dismissing…"
          icon={EyeOff}
          errorMessage="Could not dismiss tender. Please try again."
        />
        <Link
          href={`/tenders/${encodeURIComponent(item.tender_id)}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-ink-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500"
        >
          View details
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </article>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export default async function RecommendationsPage() {
  // Fetch active firm
  let firmId: string | null = null;
  try {
    const firmsRes = await getFirms(1);
    const activeFirm = firmsRes.results.find((f) => f.is_active);
    firmId = activeFirm?.id ?? null;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect("/login?next=%2Frecommendations");
    }
    throw error;
  }

  // Fetch recommendations
  let items: TenderRecommendationApi[] = [];
  let totalCount = 0;
  let embeddingMissing = false;

  if (firmId) {
    try {
      const res = await getRecommendations(firmId, { page_size: 50 });
      items = res.results;
      totalCount = res.count;
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        embeddingMissing = true;
      } else if (error instanceof ApiError && error.status === 401) {
        redirect("/login?next=%2Frecommendations");
      }
      // Otherwise swallow — show empty state
    }
  }

  return (
    <section className="mx-auto w-full max-w-7xl space-y-5">
      {/* Header */}
      <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 shrink-0">
              <Sparkles className="h-5 w-5 text-navy-600" aria-hidden />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-ink-900">Recommendations</h1>
                {totalCount > 0 && (
                  <span className="flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-navy-600 px-1.5 text-xs font-bold text-white">
                    {totalCount}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-ink-500">
                Tenders matched to your firm profile by AI — sorted by fit score.
              </p>
            </div>
          </div>
          {firmId && !embeddingMissing && (
            <RefreshButton firmId={firmId} />
          )}
        </div>
      </div>

      {/* No firm */}
      {!firmId && (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-ink-200 bg-white py-20 text-center shadow-card">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-50">
            <Sparkles className="h-8 w-8 text-ink-300" />
          </div>
          <h3 className="text-base font-semibold text-ink-800">No active firm found</h3>
          <p className="mt-1 max-w-xs text-sm text-ink-400">
            Complete your firm profile to unlock personalised tender recommendations.
          </p>
          <Link
            href="/firm"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700"
          >
            Set up firm profile
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      )}

      {/* Embedding not ready */}
      {firmId && embeddingMissing && (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-ink-200 bg-white py-20 text-center shadow-card">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-50">
            <Sparkles className="h-8 w-8 text-navy-300" />
          </div>
          <h3 className="text-base font-semibold text-ink-800">Profile not ready yet</h3>
          <p className="mt-1 max-w-sm text-sm text-ink-400">
            Your firm&apos;s embedding is still being built. Add your scope of work, industry, and past
            experiences — then come back to see matched tenders.
          </p>
          <Link
            href="/firm"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700"
          >
            Complete firm profile
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      )}

      {/* Empty state */}
      {firmId && !embeddingMissing && items.length === 0 && (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-ink-200 bg-white py-20 text-center shadow-card">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-50">
            <Sparkles className="h-8 w-8 text-navy-400" />
          </div>
          <h3 className="text-base font-semibold text-ink-800">No recommendations yet</h3>
          <p className="mt-1 max-w-sm text-sm text-ink-400">
            Click &ldquo;Refresh&rdquo; to generate your first batch of matched tenders based on your firm profile.
          </p>
          {firmId && <RefreshButton firmId={firmId} />}
        </div>
      )}

      {/* Recommendations list */}
      {items.length > 0 && (
        <div className="space-y-3">
          {items.map((item) => (
            <RecommendationCard key={item.match_id} item={item} />
          ))}
        </div>
      )}

      {/* Pagination hint */}
      {totalCount > items.length && (
        <p className="text-center text-xs text-ink-400">
          Showing {items.length} of {totalCount} matches.{" "}
          <Link href="/tenders" className="font-semibold text-navy-600 hover:underline">
            Browse all tenders
          </Link>
        </p>
      )}
    </section>
  );
}
