import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { CalendarDays, IndianRupee, MapPin, Building2, Clock3 } from "lucide-react";
import Link from "next/link";

export interface TenderItem {
  id: string;
  title: string;
  organization: string;
  location: string;
  value: string;
  deadline: string;
  description: string;
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
    <Card className="space-y-4 border-slate-200 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="space-y-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-lg font-semibold leading-snug text-slate-900">{tender.title}</h3>
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
        <p className="flex items-center gap-2 text-sm text-slate-600">
          <Building2 className="h-4 w-4" />
          {tender.organization}
        </p>
      </div>

      <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-3">
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {tender.location}
        </p>
        <p className="flex items-center gap-2">
          <IndianRupee className="h-4 w-4" />
          {tender.value}
        </p>
        <p className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          {deadline.label}
        </p>
      </div>

      <p className="line-clamp-2 text-sm text-slate-600">{tender.description}</p>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <p className="text-xs text-slate-500">Open details to review eligibility and documents.</p>
        <Link
          href={`/tenders/${encodeURIComponent(tender.id)}`}
          className={cn(
            "inline-flex h-8 items-center justify-center rounded-lg bg-slate-900 px-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          )}
        >
          View Details
        </Link>
      </div>
    </Card>
  );
}
