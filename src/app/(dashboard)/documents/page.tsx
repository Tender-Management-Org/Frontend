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

const PAGE_SIZE_STORAGE_KEY = "documents_dashboard_page_size";
const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export default function DocumentsPage() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [firmId, setFirmId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalCount, setTotalCount] = useState(0);
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
  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalCount / pageSize)), [totalCount, pageSize]);
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;
  const rangeStart = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalCount);

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

  const loadDocuments = async (targetFirmId: string, page: number, perPage: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const docsResponse = await getFirmDocuments(targetFirmId, page, perPage);
      setDocuments(docsResponse.results.map(mapDocumentToItem));
      setTotalCount(docsResponse.count);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        setError("Please login to view documents.");
      } else {
        setError("Failed to load documents.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedPageSize = window.localStorage.getItem(PAGE_SIZE_STORAGE_KEY);
    if (!storedPageSize) return;
    const parsed = Number(storedPageSize);
    if (Number.isFinite(parsed) && PAGE_SIZE_OPTIONS.includes(parsed)) {
      setPageSize(parsed);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(PAGE_SIZE_STORAGE_KEY, String(pageSize));
  }, [pageSize]);

  useEffect(() => {
    async function loadFirm() {
      setIsLoading(true);
      setError(null);
      try {
        const firmsResponse = await getFirms(1);
        const primaryFirm = firmsResponse.results[0];
        if (!primaryFirm) {
          setDocuments([]);
          setTotalCount(0);
          setFirmId(null);
          setError("No firm found. Please complete onboarding first.");
          return;
        }
        setFirmId(primaryFirm.id);
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

    void loadFirm();
  }, []);

  useEffect(() => {
    if (!firmId) return;
    void loadDocuments(firmId, currentPage, pageSize);
  }, [firmId, currentPage, pageSize]);

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
      await uploadDocument({
        firm: firmId,
        file: payload.file,
        title: payload.title,
        doc_type: payload.docType as DocumentApi["doc_type"],
        other_doc_type: payload.otherDocType,
      });
      await loadDocuments(firmId, 1, pageSize);
      setCurrentPage(1);
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
          <p className="mt-2 text-2xl font-semibold text-slate-900">{totalCount}</p>
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

          <div className="flex flex-col gap-3 rounded-xl border border-border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Showing <span className="font-medium text-slate-900">{rangeStart}</span>-
              <span className="font-medium text-slate-900">{rangeEnd}</span> of{" "}
              <span className="font-medium text-slate-900">{totalCount}</span>
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <label className="text-sm text-slate-600" htmlFor="documents-page-size">
                Rows per page
              </label>
              <select
                id="documents-page-size"
                className="h-9 rounded-lg border border-border bg-white px-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                value={pageSize}
                onChange={(event) => {
                  const nextPageSize = Number(event.target.value);
                  setPageSize(nextPageSize);
                  setCurrentPage(1);
                }}
              >
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={!canGoPrevious || isLoading}
              >
                Previous
              </Button>
              <span className="px-1 text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={!canGoNext || isLoading}
              >
                Next
              </Button>
            </div>
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
