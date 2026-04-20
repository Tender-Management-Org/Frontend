import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { DocumentActionsMenu } from "./DocumentActionsMenu";

export type DocumentStatus = "Verified" | "Pending" | "Expired";

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  status: DocumentStatus;
  fileUrl?: string;
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
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900">{document.name}</p>
          <p className="text-sm text-slate-500">{document.type}</p>
        </div>
        <div className="flex shrink-0 items-start gap-2">
          <span className={cn("rounded-full px-2 py-1 text-xs font-medium", statusStyles[document.status])}>
            {document.status}
          </span>
          <DocumentActionsMenu
            documentId={document.id}
            documentName={document.name}
            align="end"
          />
        </div>
      </div>

      <p className="text-sm text-slate-600">Uploaded: {document.uploadedAt}</p>
    </Card>
  );
}
