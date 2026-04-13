import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Download } from "lucide-react";

export interface TenderDocument {
  name: string;
  type: string;
  size: string;
}

interface TenderDocumentsProps {
  documents: TenderDocument[];
}

export function TenderDocuments({ documents }: TenderDocumentsProps) {
  return (
    <Card className="space-y-4">
      <h3 className="text-base font-semibold text-slate-900">Documents</h3>

      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.name}
            className="flex flex-col gap-3 rounded-lg border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-slate-900">{doc.name}</p>
              <p className="text-sm text-slate-500">
                {doc.type} • {doc.size}
              </p>
            </div>

            <Button variant="secondary" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
