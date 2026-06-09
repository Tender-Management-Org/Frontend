import Link from "next/link";
import { ApiError } from "@/lib/api/client";
import { getInterestedTenders, type InterestedTenderApi } from "@/lib/api/tenders";
import { redirect } from "next/navigation";
import { ArrowRight, Bookmark, Building2, CalendarDays, FolderOpen, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

function formatInr(value: string) {
  const num = Number(value);
  if (!Number.isFinite(num)) return value;
  if (num >= 10_000_000) return `₹${(num / 10_000_000).toFixed(2)} Cr`;
  if (num >= 100_000) return `₹${(num / 100_000).toFixed(2)} L`;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(num);
}

function formatDateTime(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

function deadlineMeta(value: string | null) {
  if (!value) return { label: "No deadline", tone: "neutral" as const };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { label: "Date unavailable", tone: "neutral" as const };
  const now = new Date();
  const daysLeft = Math.ceil((date.getTime() - now.getTime()) / 86400000);
  if (daysLeft < 0) return { label: "Closed", tone: "danger" as const };
  if (daysLeft === 0) return { label: "Due today", tone: "danger" as const };
  if (daysLeft <= 3) return { label: `${daysLeft}d left`, tone: "danger" as const };
  if (daysLeft <= 7) return { label: `${daysLeft}d left`, tone: "warning" as const };
  return { label: `${daysLeft}d left`, tone: "neutral" as const };
}

function fitBand(score: number | null | undefined): { label: string; color: string; bar: string } {
  if (score == null) return { label: "—", color: "text-ink-400", bar: "bg-ink-200" };
  if (score >= 80) return { label: `${score} · High`, color: "text-success-700", bar: "bg-success-500" };
  if (score >= 60) return { label: `${score} · Medium`, color: "text-warning-700", bar: "bg-warning-500" };
  return { label: `${score} · Low`, color: "text-danger-600", bar: "bg-danger-500" };
}

export default async function InterestedPage() {
  let items: InterestedTenderApi[] = [];
  try {
    items = await getInterestedTenders();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect("/login?next=%2Finterested");
    }
    throw error;
  }

  return (
    <section className="mx-auto w-full max-w-7xl space-y-5">
      {/* Header */}
      <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-violet-600" aria-hidden />
              <h1 className="text-xl font-bold text-ink-900">Interested tenders</h1>
              <span className="flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-violet-600 px-1.5 text-xs font-bold text-white">
                {items.length}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-500">
              Your shortlisted pipeline — take action before deadlines close.
            </p>
          </div>
          <Link
            href="/tenders"
            className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2"
          >
            Explore more tenders
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-ink-200 bg-white py-20 text-center shadow-card">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50">
            <Bookmark className="h-8 w-8 text-violet-400" />
          </div>
          <h3 className="text-base font-semibold text-ink-800">No shortlisted tenders yet</h3>
          <p className="mt-1 max-w-xs text-sm text-ink-400">
            Browse the tender explorer and mark relevant tenders as &ldquo;Interested&rdquo; to build your pipeline.
          </p>
          <Link
            href="/tenders"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700"
          >
            Browse tenders
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const dl = deadlineMeta(item.bid_submission_end_date);
            const fit = fitBand(item.fit_score);
            return (
              <article
                key={item.match_id}
                className="group rounded-2xl border border-ink-200 bg-white p-5 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5"
              >
                {/* Top row */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-1">
                    <h3 className="text-base font-semibold leading-snug text-ink-900">{item.title}</h3>
                    <p className="text-xs font-mono text-ink-400">#{item.tender_id}</p>
                    <p className="flex items-center gap-1.5 text-sm text-ink-500">
                      <Building2 className="h-3.5 w-3.5 shrink-0 text-ink-400" aria-hidden />
                      <span className="truncate">{item.organisation_chain}</span>
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
                      Interested
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
                    <p className="flex items-center gap-1 text-xs font-medium text-ink-700">
                      <MapPin className="h-3 w-3 shrink-0 text-ink-400" aria-hidden />
                      <span className="truncate">{item.location || "—"}</span>
                    </p>
                  </div>
                  <div className="rounded-lg bg-ink-50 px-2.5 py-2">
                    <p className="mb-0.5 text-2xs font-semibold uppercase tracking-widest text-ink-400">Value</p>
                    <p className="text-xs font-semibold text-ink-800 truncate">{formatInr(item.tender_value)}</p>
                  </div>
                  <div className="rounded-lg bg-ink-50 px-2.5 py-2">
                    <p className="mb-0.5 text-2xs font-semibold uppercase tracking-widest text-ink-400">Deadline</p>
                    <p className="flex items-center gap-1 text-xs font-medium text-ink-700">
                      <CalendarDays className="h-3 w-3 shrink-0 text-ink-400" aria-hidden />
                      <span className="truncate">{formatDateTime(item.bid_submission_end_date)}</span>
                    </p>
                  </div>
                </div>

                {/* Fit score */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-ink-100" aria-hidden>
                    <div
                      className={cn("h-full rounded-full", fit.bar)}
                      style={{ width: `${item.fit_score ?? 0}%` }}
                    />
                  </div>
                  <span className={cn("text-xs font-semibold", fit.color)}>Fit: {fit.label}</span>
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-end border-t border-ink-100 pt-3">
                  <Link
                    href={`/interested/${encodeURIComponent(item.tender_id)}/workspace`}
                    className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                  >
                    <FolderOpen className="h-4 w-4" aria-hidden />
                    Open Filing Workspace
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
