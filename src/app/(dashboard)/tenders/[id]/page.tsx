import { mapTenderDetailToLegacyShape } from "@/lib/api/tenderAdapters";
import { ApiError } from "@/lib/api/client";
import { getTenderDetail } from "@/lib/api/tenders";
import type { TenderDetail } from "@/types/tenderDetail";
import { ArrowLeft, CalendarClock, Clock4, ExternalLink, IndianRupee, Tag } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ActionBar } from "./components/ActionBar";
import { TenderDetailView } from "./components/TenderDetailView";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { id: string };
};

function formatInr(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(2)} L`;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

function deadlineUrgency(isoDate: string | null | undefined): "danger" | "warning" | "neutral" {
  if (!isoDate) return "neutral";
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return "neutral";
  const now = new Date();
  const days = Math.round((d.getTime() - now.getTime()) / 86400000);
  if (days <= 3) return "danger";
  if (days <= 7) return "warning";
  return "neutral";
}

export default async function TenderDetailPage({ params }: PageProps) {
  const id = decodeURIComponent(params.id);
  let tender: TenderDetail;
  let sourceUrl: string | null = null;
  try {
    const detail = await getTenderDetail(id);
    sourceUrl = detail.source_url ?? null;
    tender = mapTenderDetailToLegacyShape(detail);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    if (error instanceof ApiError && error.status === 401)
      redirect(`/login?next=${encodeURIComponent(`/tenders/${id}`)}`);
    throw error;
  }

  const title = tender.work_items.title;
  const subtitle = tender.basic_details.organisation_chain;
  const bidSubmissionEnd = tender.critical_dates.bid_submission_end_date;
  const urgency = deadlineUrgency(bidSubmissionEnd);

  const formattedDeadline = bidSubmissionEnd
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      }).format(new Date(bidSubmissionEnd))
    : "Not specified";

  return (
    <section className="mx-auto w-full max-w-7xl space-y-5">
      {/* Back nav */}
      <Link
        href="/tenders"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2 rounded-md"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to tenders
      </Link>

      {/* Hero */}
      <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-ink-200 bg-ink-50 px-2.5 py-1 text-xs font-semibold text-ink-600">
              {tender.basic_details.tender_category || "Works"}
            </span>
            <span className="text-xs font-mono text-ink-400">#{tender.basic_details.tender_id}</span>
          </div>
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-navy-200 bg-navy-50 px-2.5 py-1 text-xs font-semibold text-navy-600 transition-colors hover:bg-navy-100 hover:text-navy-800"
            >
              <ExternalLink className="h-3 w-3" aria-hidden />
              View on source
            </a>
          )}
        </div>

        <h1 className="mt-3 text-xl font-bold leading-snug text-ink-900 sm:text-2xl">{title}</h1>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-1 gap-y-0.5 text-xs text-ink-500">
          {subtitle
            ? subtitle.split("||").map((part, i, arr) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <span className="text-ink-300 select-none">›</span>}
                  <span className={i === arr.length - 1 ? "font-semibold text-ink-700" : ""}>{part.trim()}</span>
                </span>
              ))
            : null}
        </p>

        {/* Quick stat pills */}
        <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <div className="flex items-center gap-2.5 rounded-xl border border-ink-200 bg-ink-50 px-4 py-3">
            <IndianRupee className="h-4 w-4 shrink-0 text-ink-400" aria-hidden />
            <div>
              <p className="text-2xs font-semibold uppercase tracking-wide text-ink-400">Tender value</p>
              <p className="text-sm font-bold text-ink-900">{formatInr(tender.work_items.tender_value)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-ink-200 bg-ink-50 px-4 py-3">
            <Clock4 className="h-4 w-4 shrink-0 text-ink-400" aria-hidden />
            <div>
              <p className="text-2xs font-semibold uppercase tracking-wide text-ink-400">Bid validity</p>
              <p className="text-sm font-bold text-ink-900">{tender.work_items.bid_validity_days} days</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-ink-200 bg-ink-50 px-4 py-3">
            <Tag className="h-4 w-4 shrink-0 text-ink-400" aria-hidden />
            <div>
              <p className="text-2xs font-semibold uppercase tracking-wide text-ink-400">Contract type</p>
              <p className="text-sm font-bold text-ink-900">{tender.work_items.contract_type || "—"}</p>
            </div>
          </div>
          <div
            className={cn(
              "flex items-center gap-2.5 rounded-xl border px-4 py-3",
              urgency === "danger" ? "border-danger-200 bg-danger-50" :
              urgency === "warning" ? "border-warning-200 bg-warning-50" :
              "border-ink-200 bg-ink-50"
            )}
          >
            <CalendarClock
              className={cn(
                "h-4 w-4 shrink-0",
                urgency === "danger" ? "text-danger-600" :
                urgency === "warning" ? "text-warning-600" : "text-ink-400"
              )}
              aria-hidden
            />
            <div>
              <p className={cn(
                "text-2xs font-semibold uppercase tracking-wide",
                urgency === "danger" ? "text-danger-600" :
                urgency === "warning" ? "text-warning-600" : "text-ink-400"
              )}>
                Submission closes
              </p>
              <p className={cn(
                "text-sm font-bold",
                urgency === "danger" ? "text-danger-700" :
                urgency === "warning" ? "text-warning-700" : "text-ink-900"
              )}>
                {formattedDeadline}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content + Action sidebar */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-8">
          <TenderDetailView data={tender} tenderId={id} />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <div className="space-y-5 lg:sticky lg:top-6">
            <ActionBar tenderId={id} />
          </div>
        </div>
      </div>
    </section>
  );
}
