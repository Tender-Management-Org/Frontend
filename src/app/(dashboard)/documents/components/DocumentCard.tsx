import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export type DocumentStatus = "Verified" | "Pending" | "Expired";

export interface DocumentItem {
  id: number;
  name: string;
  type: "GST_Cert" | "PAN_Card" | "Balance_Sheet" | "Work_Order";
  expiry: string;
  status: DocumentStatus;
}

interface DocumentCardProps {
  document: DocumentItem;
}

const statusStyles: Record<DocumentStatus, string> = {
  Verified: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Expired: "bg-rose-100 text-rose-700"
};

export function DocumentCard({ document }: DocumentCardProps) {
  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{document.name}</p>
          <p className="text-sm text-slate-500">{document.type}</p>
        </div>
        <span className={cn("rounded-full px-2 py-1 text-xs font-medium", statusStyles[document.status])}>
          {document.status}
        </span>
      </div>

      <p className="text-sm text-slate-600">Expiry: {document.expiry}</p>
    </Card>
  );
}
