import { cn } from "@/lib/utils";
import { ArrowRight, Building2, CalendarDays, IndianRupee, MapPin } from "lucide-react";
import Link from "next/link";

export interface TenderItem {
  id: string;
  title: string;
  organization: string;
  location: string;
  value: string;
  deadline: string;
  description: string;
  source?: string;
  similarityScore?: number;
  isInterested?: boolean;
}

function formatSource(slug: string): string {
  return slug.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

interface TenderCardProps {
  tender: TenderItem;
}

function deadlineMeta(deadline: string) {
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) {
    return { label: deadline, hint: "Date unavailable", tone: "neutral" as const };
  }
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  const daysLeft = Math.round((date.getTime() - now.getTime()) / 86400000);
  const formatted = new Date(deadline).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
  if (daysLeft < 0) return { label: formatted, hint: "Closed", tone: "danger" as const };
  if (daysLeft === 0) return { label: formatted, hint: "Due today", tone: "danger" as const };
  if (daysLeft <= 3) return { label: formatted, hint: `${daysLeft} days left`, tone: "danger" as const };
  if (daysLeft <= 7) return { label: formatted, hint: `${daysLeft} days left`, tone: "warning" as const };
  return { label: formatted, hint: `${daysLeft} days left`, tone: "neutral" as const };
}

export function TenderCard({ tender }: TenderCardProps) {
  const dl = deadlineMeta(tender.deadline);

  return (
    <article className="group rounded-2xl border border-ink-200 bg-white p-5 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="text-base font-semibold leading-snug text-ink-900 group-hover:text-navy-700 transition-colors">
              <Link href={`/tenders/${encodeURIComponent(tender.id)}`} className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 rounded-sm">
                {tender.title}
              </Link>
            </h3>
            <p className="text-xs font-mono text-ink-400">#{tender.id}</p>
          </div>
          {/* Badges */}
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            {typeof tender.similarityScore === "number" && (
              <span className="inline-flex items-center rounded-full bg-navy-50 px-2 py-0.5 text-xs font-semibold text-navy-700 border border-navy-200">
                {Math.round(tender.similarityScore * 100)}% match
              </span>
            )}
            {tender.isInterested && (
              <span className="inline-flex items-center rounded-full bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-700 border border-violet-200">
                Interested
              </span>
            )}
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                dl.tone === "danger" && "bg-danger-50 text-danger-700 border border-danger-200",
                dl.tone === "warning" && "bg-warning-50 text-warning-700 border border-warning-200",
                dl.tone === "neutral" && "bg-ink-100 text-ink-600"
              )}
            >
              {dl.hint}
            </span>
          </div>
        </div>

        <p className="flex items-center gap-1.5 text-sm text-ink-500">
          <Building2 className="h-3.5 w-3.5 shrink-0 text-ink-400" aria-hidden />
          <span className="truncate">{tender.organization}</span>
        </p>
      </div>

      {/* Meta row */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-ink-50 px-2.5 py-2">
          <p className="mb-0.5 text-2xs font-semibold uppercase tracking-widest text-ink-400">Location</p>
          <p className="flex items-center gap-1 text-xs font-medium text-ink-700 truncate">
            <MapPin className="h-3 w-3 shrink-0 text-ink-400" aria-hidden />
            {tender.location}
          </p>
        </div>
        <div className="rounded-lg bg-ink-50 px-2.5 py-2">
          <p className="mb-0.5 text-2xs font-semibold uppercase tracking-widest text-ink-400">Value</p>
          <p className="flex items-center gap-1 text-xs font-semibold text-ink-800 truncate">
            <IndianRupee className="h-3 w-3 shrink-0 text-ink-400" aria-hidden />
            {tender.value}
          </p>
        </div>
        <div className="rounded-lg bg-ink-50 px-2.5 py-2">
          <p className="mb-0.5 text-2xs font-semibold uppercase tracking-widest text-ink-400">Deadline</p>
          <p className="flex items-center gap-1 text-xs font-medium text-ink-700 truncate">
            <CalendarDays className="h-3 w-3 shrink-0 text-ink-400" aria-hidden />
            {dl.label}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-500">{tender.description}</p>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-3">
        {tender.source ? (
          <span className="inline-flex items-center rounded-full border border-ink-200 bg-ink-50 px-2.5 py-0.5 text-xs font-medium text-ink-500">
            {formatSource(tender.source)}
          </span>
        ) : (
          <span />
        )}
        <Link
          href={`/tenders/${encodeURIComponent(tender.id)}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-ink-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500"
        >
          View details
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
