import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { CalendarDays, IndianRupee, MapPin, Building2 } from "lucide-react";
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

export function TenderCard({ tender }: TenderCardProps) {
  return (
    <Card className="space-y-4 transition-shadow hover:shadow-md">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-900">{tender.title}</h3>
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
          {tender.deadline}
        </p>
      </div>

      <p className="text-sm text-slate-600">{tender.description}</p>

      <div className="flex justify-end">
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
