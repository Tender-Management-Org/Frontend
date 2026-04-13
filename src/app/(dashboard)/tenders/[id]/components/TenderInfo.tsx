import { Card } from "@/components/ui/Card";
import { Building2, MapPin, Tag, IndianRupee } from "lucide-react";

interface TenderInfoProps {
  title: string;
  organization: string;
  location: string;
  category: string;
  value: string;
  description: string;
}

export function TenderInfo({
  title,
  organization,
  location,
  category,
  value,
  description
}: TenderInfoProps) {
  return (
    <Card className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">Comprehensive tender overview and scope.</p>
      </div>

      <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-2">
        <p className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          {organization}
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {location}
        </p>
        <p className="flex items-center gap-2">
          <Tag className="h-4 w-4" />
          {category}
        </p>
        <p className="flex items-center gap-2">
          <IndianRupee className="h-4 w-4" />
          {value}
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-base font-semibold text-slate-900">Description</h3>
        <p className="text-sm leading-relaxed text-slate-600">{description}</p>
      </div>
    </Card>
  );
}
