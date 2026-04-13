import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { DocumentItem, DocumentStatus } from "./DocumentCard";

interface DocumentTableProps {
  documents: DocumentItem[];
}

const statusStyles: Record<DocumentStatus, string> = {
  Verified: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Expired: "bg-rose-100 text-rose-700"
};

export function DocumentTable({ documents }: DocumentTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Document Name</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Expiry Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document.id} className="border-t border-slate-100 transition-colors hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-900">{document.name}</td>
                <td className="px-4 py-3 text-slate-600">{document.type}</td>
                <td className="px-4 py-3 text-slate-600">{document.expiry}</td>
                <td className="px-4 py-3">
                  <span className={cn("rounded-full px-2 py-1 text-xs font-medium", statusStyles[document.status])}>
                    {document.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary">
                      View
                    </Button>
                    <Button size="sm" variant="ghost" className="border border-border">
                      Download
                    </Button>
                    <Button size="sm" variant="ghost" className="border border-border text-rose-600 hover:bg-rose-50">
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
