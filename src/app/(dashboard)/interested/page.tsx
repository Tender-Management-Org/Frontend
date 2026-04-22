import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ApiError } from "@/lib/api/client";
import { getInterestedTenders, type InterestedTenderApi } from "@/lib/api/tenders";
import { redirect } from "next/navigation";
import { ArrowRight, Building2, CalendarDays, Clock3, Files, MapPin, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

function formatInr(value: string) {
  const num = Number(value);
  if (!Number.isFinite(num)) return value;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(num);
}

function formatDateTime(value: string | null) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function deadlineMeta(value: string | null) {
  if (!value) {
    return { label: "No deadline provided", tone: "neutral" as const };
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { label: "Date unavailable", tone: "neutral" as const };
  }
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffMs / 86400000);
  if (daysLeft < 0) {
    return { label: "Closed", tone: "danger" as const };
  }
  if (daysLeft === 0) {
    return { label: "Due today", tone: "danger" as const };
  }
  if (daysLeft <= 3) {
    return { label: `${daysLeft} day${daysLeft > 1 ? "s" : ""} left`, tone: "danger" as const };
  }
  if (daysLeft <= 7) {
    return { label: `${daysLeft} day${daysLeft > 1 ? "s" : ""} left`, tone: "warning" as const };
  }
  return { label: `${daysLeft} day${daysLeft > 1 ? "s" : ""} left`, tone: "neutral" as const };
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
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-violet-50 via-white to-indigo-50 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-slate-900">Interested dashboard</h2>
            <p className="text-sm text-slate-600">
              Track shortlisted tenders and move quickly on high-fit opportunities.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/tenders"
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Explore tenders
            </Link>
            <span className="inline-flex h-9 items-center rounded-lg bg-slate-900 px-3 text-sm font-medium text-white">
              {items.length} shortlisted
            </span>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <Card>
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
              <Sparkles className="h-5 w-5 text-slate-500" aria-hidden />
            </div>
            <p className="text-sm font-medium text-slate-700">No interested tenders yet.</p>
            <p className="mt-1 text-sm text-slate-500">Shortlist tenders from the explorer to build your pipeline.</p>
            <Link
              href="/tenders"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-slate-700 underline-offset-4 hover:underline"
            >
              Browse tenders
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const deadline = deadlineMeta(item.bid_submission_end_date);
            return (
              <Card
                key={item.match_id}
                className="space-y-4 border-slate-200 p-5 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold leading-snug text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-400">Tender ID: {item.tender_id}</p>
                  <p className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Building2 className="h-4 w-4 text-slate-400" aria-hidden />
                    {item.organisation_chain}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">Interested</span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                      deadline.tone === "danger" && "bg-rose-100 text-rose-700",
                      deadline.tone === "warning" && "bg-amber-100 text-amber-700",
                      deadline.tone === "neutral" && "bg-slate-100 text-slate-600"
                    )}
                  >
                    <Clock3 className="h-3 w-3" aria-hidden />
                    {deadline.label}
                  </span>
                </div>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-600">
                  <p className="mb-1 text-[11px] uppercase tracking-wide text-slate-500">Location</p>
                  <p className="flex items-center gap-1.5 font-medium text-slate-700">
                    <MapPin className="h-4 w-4 text-slate-400" aria-hidden />
                    {item.location || "Not specified"}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-600">
                  <p className="mb-1 text-[11px] uppercase tracking-wide text-slate-500">Tender value</p>
                  <p className="font-semibold text-slate-800">{formatInr(item.tender_value)}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-600">
                  <p className="mb-1 text-[11px] uppercase tracking-wide text-slate-500">Submission deadline</p>
                  <p className="flex items-center gap-1.5 font-medium text-slate-700">
                    <CalendarDays className="h-4 w-4 text-slate-400" aria-hidden />
                    {formatDateTime(item.bid_submission_end_date)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                <p className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                  <Files className="h-3.5 w-3.5" aria-hidden />
                  Fit score: <span className="font-semibold text-slate-700">{item.fit_score}</span>
                </p>
                <Link
                  href={`/tenders/${encodeURIComponent(item.tender_id)}`}
                  className="inline-flex h-9 items-center gap-1 rounded-lg bg-slate-900 px-3.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                >
                  View details
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </div>
            </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
