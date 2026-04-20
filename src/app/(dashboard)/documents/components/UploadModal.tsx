import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import type { DocumentApi } from "@/lib/api/documents";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (payload: {
    title: string;
    docType: string;
    otherDocType?: string;
    file: File;
  }) => Promise<void>;
  isUploading: boolean;
}

const DOC_TYPES = [
  { value: "legal", label: "Legal" },
  { value: "financial", label: "Financial" },
  { value: "pan", label: "PAN Card" },
  { value: "gst", label: "GST Certificate" },
  { value: "certificate", label: "Certificate" },
  { value: "other", label: "Other" }
] satisfies { value: DocumentApi["doc_type"]; label: string }[];

export function UploadModal({ isOpen, onClose, onUpload, isUploading }: UploadModalProps) {
  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState<DocumentApi["doc_type"]>("legal");
  const [otherDocType, setOtherDocType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isUploading) return;
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a file.");
      return;
    }
    if (docType === "other" && !otherDocType.trim()) {
      setError("Please provide a custom document type.");
      return;
    }

    setError(null);
    try {
      await onUpload({
        title: title.trim(),
        docType,
        otherDocType: docType === "other" ? otherDocType.trim() : undefined,
        file
      });
      setTitle("");
      setDocType("legal");
      setOtherDocType("");
      setFile(null);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg rounded-xl border border-border bg-white p-6 shadow-lg">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Upload Document</h3>
          <p className="text-sm text-slate-500">Add a compliance document to your vault.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Document Name</label>
            <Input
              placeholder="Enter document name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Document Type</label>
            <select
              className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:bg-slate-100"
              value={docType}
              onChange={(e) => setDocType(e.target.value as DocumentApi["doc_type"])}
              disabled={isUploading}
            >
              {DOC_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {docType === "other" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Custom Type</label>
              <Input
                placeholder="Enter custom document type"
                value={otherDocType}
                onChange={(e) => setOtherDocType(e.target.value)}
                disabled={isUploading}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">File Upload</label>
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              disabled={isUploading}
            />
          </div>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
    </div>
  );
}
