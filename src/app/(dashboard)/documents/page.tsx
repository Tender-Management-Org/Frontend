"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, Filter, Files } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canUpload = useMemo(() => !!firmId && !isLoading, [firmId, isLoading]);
  const typeOptions = useMemo(
    () => Array.from(new Set(documents.map((document) => document.type))).sort((a, b) => a.localeCompare(b)),
    [documents]
  );

  const filteredDocuments = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return documents.filter((document) => {
      const matchesSearch =
        !query ||
        document.name.toLowerCase().includes(query) ||
        document.type.toLowerCase().includes(query);
      const matchesType = selectedType === "all" || document.type === selectedType;
      const matchesStatus = selectedStatus === "all" || document.status === selectedStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [documents, searchTerm, selectedType, selectedStatus]);

  const activeFilterCount = useMemo(
    () =>
      Number(searchTerm.trim().length > 0) +
      Number(selectedType !== "all") +
      Number(selectedStatus !== "all"),
    [searchTerm, selectedStatus, selectedType]
  );

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedStatus("all");
  };

  const handleViewDocument = (fileUrl?: string) => {
    if (!fileUrl) return;
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownloadDocument = (fileUrl?: string, documentName?: string) => {
    if (!fileUrl) return;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = documentName ?? "document";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          <p className="text-sm text-slate-500">Manage tender compliance files with clear status tracking and quick retrieval.</p>
        </div>
        <Button onClick={() => setIsUploadOpen(true)} disabled={!canUpload}>
          Upload Document
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            <Files className="h-4 w-4" /> Total Documents
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{documents.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            <FileText className="h-4 w-4" /> Showing Results
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{filteredDocuments.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            <Filter className="h-4 w-4" /> Active Filters
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{activeFilterCount}</p>
        </div>
      </div>

      <DocumentFilters
        searchTerm={searchTerm}
        selectedType={selectedType}
        selectedStatus={selectedStatus}
        onSearchTermChange={setSearchTerm}
        onTypeChange={setSelectedType}
        onStatusChange={setSelectedStatus}
        onReset={clearFilters}
        typeOptions={typeOptions}
      />

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
      ) : filteredDocuments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-slate-50 p-10 text-center">
          <p className="text-sm text-slate-600">No documents match the current filters.</p>
          <Button className="mt-4" variant="secondary" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          <div className="hidden md:block">
            <DocumentTable
              documents={filteredDocuments}
              onViewDocument={handleViewDocument}
              onDownloadDocument={handleDownloadDocument}
            />
          </div>

          <div className="space-y-4 md:hidden">
            {filteredDocuments.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onViewDocument={handleViewDocument}
                onDownloadDocument={handleDownloadDocument}
              />
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
