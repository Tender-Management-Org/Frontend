import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { CalendarDays, MapPin, Building2, Clock3 } from "lucide-react";
import Link from "next/link";

export interface TenderItem {
  id: string;
  title: string;
  organization: string;
  location: string;
  value: string;
  deadline: string;
  description: string;
  similarityScore?: number;
  isInterested?: boolean;
}

interface TenderCardProps {
  tender: TenderItem;
}

function deadlineMeta(deadline: string) {
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) {
    return {
      label: deadline,
      hint: "Date unavailable",
      tone: "neutral" as const
    };
  }
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  const daysLeft = Math.round((date.getTime() - now.getTime()) / 86400000);
  if (daysLeft < 0) {
    return { label: deadline, hint: "Closed", tone: "danger" as const };
  }
  if (daysLeft <= 3) {
    return { label: deadline, hint: daysLeft === 0 ? "Due today" : `${daysLeft} days left`, tone: "danger" as const };
  }
  if (daysLeft <= 7) {
    return { label: deadline, hint: `${daysLeft} days left`, tone: "warning" as const };
  }
  return { label: deadline, hint: `${daysLeft} days left`, tone: "neutral" as const };
}

export function TenderCard({ tender }: TenderCardProps) {
  const deadline = deadlineMeta(tender.deadline);

  return (
    <Card className="space-y-4 border-slate-200 p-5 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold leading-snug text-slate-900">{tender.title}</h3>
            <p className="text-xs text-slate-400">Tender ID: {tender.id}</p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            {typeof tender.similarityScore === "number" && (
              <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                Semantic match {Math.round(tender.similarityScore * 100)}%
              </span>
            )}
            {tender.isInterested && (
              <span className="inline-flex items-center rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
                Interested
              </span>
            )}
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                deadline.tone === "danger" && "bg-rose-100 text-rose-700",
                deadline.tone === "warning" && "bg-amber-100 text-amber-700",
                deadline.tone === "neutral" && "bg-slate-100 text-slate-600"
              )}
            >
              <Clock3 className="h-3 w-3" aria-hidden />
              {deadline.hint}
            </span>
          </div>
        </div>
        <p className="flex items-center gap-2 text-sm text-slate-600">
          <Building2 className="h-4 w-4" />
          {tender.organization}
        </p>
      </div>

      <div className="grid gap-2.5 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50/60 px-2.5 py-2 text-sm text-slate-600">
          <p className="mb-1 text-[11px] uppercase tracking-wide text-slate-500">Location</p>
          <p className="flex items-center gap-1.5 font-medium text-slate-700">
            <MapPin className="h-4 w-4 text-slate-400" />
            {tender.location}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50/60 px-2.5 py-2 text-sm text-slate-600">
          <p className="mb-1 text-[11px] uppercase tracking-wide text-slate-500">Tender value</p>
          <p className="font-semibold text-slate-800">{tender.value}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50/60 px-2.5 py-2 text-sm text-slate-600">
          <p className="mb-1 text-[11px] uppercase tracking-wide text-slate-500">Submission deadline</p>
          <p className="flex items-center gap-1.5 font-medium text-slate-700">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            {deadline.label}
          </p>
        </div>
      </div>

      <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">{tender.description}</p>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <p className="text-xs text-slate-500">Open details to review eligibility and documents.</p>
        <Link
          href={`/tenders/${encodeURIComponent(tender.id)}`}
          className={cn(
            "inline-flex h-9 items-center justify-center rounded-lg bg-slate-900 px-3.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          )}
        >
          View details
        </Link>
      </div>
    </Card>
  );
}
