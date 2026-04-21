import { cn } from "@/lib/utils";
import { DocumentActionsMenu } from "./DocumentActionsMenu";
import type { DocumentItem, DocumentStatus } from "./DocumentCard";

interface DocumentTableProps {
  documents: DocumentItem[];
  onViewDocument?: (fileUrl?: string) => void;
  onDownloadDocument?: (fileUrl?: string, documentName?: string) => void;
}

const statusStyles: Record<DocumentStatus, string> = {
  Verified: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Expired: "bg-rose-100 text-rose-700"
};

export function DocumentTable({ documents, onViewDocument, onDownloadDocument }: DocumentTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Document Name</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Uploaded</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="w-px whitespace-nowrap px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document.id} className="border-t border-slate-100 transition-colors hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-900">
                  <p className="max-w-[26rem] truncate font-medium">{document.name}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">{document.type}</td>
                <td className="px-4 py-3 text-slate-600">{document.uploadedAt}</td>
                <td className="px-4 py-3">
                  <span className={cn("rounded-full px-2 py-1 text-xs font-medium", statusStyles[document.status])}>
                    {document.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end">
                    <DocumentActionsMenu
                      documentId={document.id}
                      documentName={document.name}
                      align="end"
                      onView={() => onViewDocument?.(document.fileUrl)}
                      onDownload={() => onDownloadDocument?.(document.fileUrl, document.name)}
                    />
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
