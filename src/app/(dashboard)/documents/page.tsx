"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api/client";
import { getFirmDocuments, type DocumentApi, uploadDocument } from "@/lib/api/documents";
import { getFirms } from "@/lib/api/firms";
import { DocumentCard, type DocumentItem } from "./components/DocumentCard";
import { DocumentFilters } from "./components/DocumentFilters";
import { DocumentTable } from "./components/DocumentTable";
import { UploadModal } from "./components/UploadModal";

function formatDate(isoDate: string) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function toLabel(value: string) {
  return value
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getDisplayType(document: DocumentApi) {
  if (document.doc_type === "other" && document.other_doc_type) {
    return document.other_doc_type;
  }
  return toLabel(document.doc_type);
}

function mapDocumentToItem(document: DocumentApi): DocumentItem {
  return {
    id: document.id,
    name: document.title || document.file.split("/").pop() || "Untitled document",
    type: getDisplayType(document),
    uploadedAt: formatDate(document.created_at),
    status: "Pending",
    fileUrl: document.file,
  };
}

export default function DocumentsPage() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [firmId, setFirmId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canUpload = useMemo(() => !!firmId && !isLoading, [firmId, isLoading]);

  useEffect(() => {
    async function loadDocuments() {
      setIsLoading(true);
      setError(null);
      try {
        const firmsResponse = await getFirms(1);
        const primaryFirm = firmsResponse.results[0];
        if (!primaryFirm) {
          setDocuments([]);
          setFirmId(null);
          setError("No firm found. Please complete onboarding first.");
          return;
        }
        setFirmId(primaryFirm.id);

        const docsResponse = await getFirmDocuments(primaryFirm.id, 1);
        setDocuments(docsResponse.results.map(mapDocumentToItem));
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) {
          setError("Please login to view documents.");
        } else {
          setError("Failed to load documents.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    void loadDocuments();
  }, []);

  const handleUpload = async (payload: {
    title: string;
    docType: string;
    otherDocType?: string;
    file: File;
  }) => {
    if (!firmId) {
      throw new Error("Firm not found. Complete onboarding first.");
    }
    setIsUploading(true);
    try {
      const created = await uploadDocument({
        firm: firmId,
        file: payload.file,
        title: payload.title,
        doc_type: payload.docType as DocumentApi["doc_type"],
        other_doc_type: payload.otherDocType,
      });

      setDocuments((prev) => [mapDocumentToItem(created), ...prev]);
      setError(null);
    } catch (e) {
      if (e instanceof ApiError) {
        throw new Error(`Upload failed (${e.status}).`);
      }
      throw new Error("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Document Vault</h2>
          <p className="text-sm text-slate-500">Manage tender compliance files with clear status tracking.</p>
        </div>
        <Button onClick={() => setIsUploadOpen(true)} disabled={!canUpload}>
          Upload Document
        </Button>
      </div>

      <DocumentFilters />

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">{error}</div>
      ) : isLoading ? (
        <div className="rounded-xl border border-border bg-slate-50 p-10 text-center">
          <p className="text-sm text-slate-500">Loading documents...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-slate-50 p-10 text-center">
          <p className="text-sm text-slate-500">No documents found.</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block">
            <DocumentTable documents={documents} />
          </div>

          <div className="space-y-4 md:hidden">
            {documents.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        </>
      )}

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
        isUploading={isUploading}
      />
    </section>
  );
}
