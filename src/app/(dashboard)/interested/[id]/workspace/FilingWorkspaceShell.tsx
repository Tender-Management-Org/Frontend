"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { TenderDetail } from "@/types/tenderDetail";
import { TenderDetailView, type FilingWorkspaceDocIntelProps } from "../../../tenders/[id]/components/TenderDetailView";
import { useFirm } from "@/context/FirmContext";
import {
  getDocIntelStatus,
  processDocIntel,
  type DocIntelStatusResponse,
  type EligibilityCriterion,
  type RequiredDocument,
} from "@/lib/api/docIntel";
import { ApiError } from "@/lib/api/client";
import { emitToast } from "@/lib/toast";
import { DocIntelConfirmDialog } from "./DocIntelConfirmDialog";
import { FilingPipelineSidebar, type UploadedDocFile } from "./FilingPipelineSidebar";

export type DocIntelDocStatus = "idle" | "processing" | "complete" | "error";

interface FilingWorkspaceShellProps {
  tenderId: string;
  tender: TenderDetail;
}

function isPdfDocument(doc: { document_name?: string | null; file_url?: string | null }) {
  const name = (doc.document_name ?? "").toLowerCase();
  const url = (doc.file_url ?? "").toLowerCase();
  return name.endsWith(".pdf") || url.includes(".pdf");
}

async function createZipFromFiles(
  files: { name: string; file: File }[],
  zipName: string
) {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  for (const entry of files) {
    zip.file(entry.name, entry.file);
  }
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = zipName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function FilingWorkspaceShell({ tenderId, tender }: FilingWorkspaceShellProps) {
  const { activeFirm, activeFirmId, refreshFirms } = useFirm();

  const pdfDocuments = useMemo(() => {
    const seen = new Set<number>();
    const docs: { id: number; document_name: string }[] = [];
    for (const doc of [
      ...tender.tender_documents.nit_documents,
      ...tender.tender_documents.work_item_documents,
    ]) {
      if (!isPdfDocument(doc) || seen.has(doc.id)) continue;
      seen.add(doc.id);
      docs.push({ id: doc.id, document_name: doc.document_name });
    }
    return docs;
  }, [tender]);

  const [docIntelByDocumentId, setDocIntelByDocumentId] = useState<
    Record<number, { status: DocIntelDocStatus; documentName: string }>
  >(() =>
    Object.fromEntries(
      pdfDocuments.map((doc) => [doc.id, { status: "idle" as const, documentName: doc.document_name }])
    )
  );

  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
  const [selectedData, setSelectedData] = useState<{
    documentName: string;
    eligibilityCriteria: EligibilityCriterion[];
    requiredDocuments: RequiredDocument[];
  } | null>(null);

  const [confirmTarget, setConfirmTarget] = useState<{ id: number; name: string } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Record<number, UploadedDocFile | null>>({});
  const [zipLoading, setZipLoading] = useState(false);

  const creditsRemaining = activeFirm?.doc_intel_credits ?? 0;

  const loadStatusForDocument = useCallback(
    async (documentId: number, documentName: string): Promise<DocIntelStatusResponse | null> => {
      try {
        return await getDocIntelStatus(tenderId, documentId);
      } catch {
        setDocIntelByDocumentId((prev) => ({
          ...prev,
          [documentId]: { status: "error", documentName },
        }));
        return null;
      }
    },
    [tenderId]
  );

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      await Promise.all(
        pdfDocuments.map(async (doc) => {
          const status = await loadStatusForDocument(doc.id, doc.document_name);
          if (cancelled || !status) return;
          if (status.status === "complete") {
            setDocIntelByDocumentId((prev) => ({
              ...prev,
              [doc.id]: { status: "complete", documentName: doc.document_name },
            }));
          }
        })
      );
    }
    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [pdfDocuments, loadStatusForDocument]);

  const applyStatusToSelection = useCallback((status: DocIntelStatusResponse, documentName: string) => {
    setSelectedData({
      documentName,
      eligibilityCriteria: status.eligibility_criteria?.data ?? [],
      requiredDocuments: status.required_documents?.data ?? [],
    });
    setUploadedFiles({});
  }, []);

  const handleSelectDocIntel = useCallback(
    async (documentId: number) => {
      const meta = docIntelByDocumentId[documentId];
      if (!meta || meta.status !== "complete") return;

      setSelectedDocumentId(documentId);
      const status = await loadStatusForDocument(documentId, meta.documentName);
      if (status?.status === "complete") {
        applyStatusToSelection(status, meta.documentName);
      }
    },
    [applyStatusToSelection, docIntelByDocumentId, loadStatusForDocument]
  );

  const handleRequestDocIntel = useCallback((documentId: number, documentName: string) => {
    setConfirmTarget({ id: documentId, name: documentName });
  }, []);

  const handleConfirmDocIntel = useCallback(async () => {
    if (!confirmTarget || !activeFirmId) return;

    const { id, name } = confirmTarget;
    setConfirmLoading(true);
    setDocIntelByDocumentId((prev) => ({
      ...prev,
      [id]: { status: "processing", documentName: name },
    }));

    try {
      const result = await processDocIntel(tenderId, id, activeFirmId);
      setDocIntelByDocumentId((prev) => ({
        ...prev,
        [id]: { status: "complete", documentName: name },
      }));
      setSelectedDocumentId(id);
      setSelectedData({
        documentName: name,
        eligibilityCriteria: result.eligibility_criteria.data,
        requiredDocuments: result.required_documents.data,
      });
      setUploadedFiles({});
      await refreshFirms();
      emitToast({
        type: "success",
        title: "Document intelligence complete",
        description: `Extracted requirements from ${name}.`,
      });
      setConfirmTarget(null);
    } catch (error) {
      setDocIntelByDocumentId((prev) => ({
        ...prev,
        [id]: { status: "error", documentName: name },
      }));
      const message =
        error instanceof ApiError
          ? typeof error.data === "object" &&
            error.data !== null &&
            "detail" in error.data &&
            typeof (error.data as { detail: unknown }).detail === "string"
            ? (error.data as { detail: string }).detail
            : error.message
          : "Document intelligence failed.";
      emitToast({ type: "error", title: "Analysis failed", description: message });
    } finally {
      setConfirmLoading(false);
    }
  }, [activeFirmId, confirmTarget, refreshFirms, tenderId]);

  const handleUploadFile = useCallback((index: number, file: File | null) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [index]: file ? { file, fileName: file.name } : null,
    }));
  }, []);

  const handleCreateZip = useCallback(async () => {
    if (!selectedData) return;
    const entries = selectedData.requiredDocuments
      .map((doc, index) => {
        const uploaded = uploadedFiles[index];
        if (!uploaded) return null;
        return { name: uploaded.fileName || doc.document_name, file: uploaded.file };
      })
      .filter((entry): entry is { name: string; file: File } => entry !== null);

    if (entries.length === 0) return;

    setZipLoading(true);
    try {
      const safeName = selectedData.documentName.replace(/\.pdf$/i, "").replace(/[^\w.-]+/g, "_");
      await createZipFromFiles(entries, `${safeName || "submission"}-documents.zip`);
      emitToast({
        type: "success",
        title: "Zip downloaded",
        description: `${entries.length} file(s) bundled.`,
      });
    } catch {
      emitToast({
        type: "error",
        title: "Zip creation failed",
        description: "Could not create the zip file. Try again.",
      });
    } finally {
      setZipLoading(false);
    }
  }, [selectedData, uploadedFiles]);

  const filingWorkspace: FilingWorkspaceDocIntelProps = {
    enabled: true,
    docIntelByDocumentId,
    selectedDocumentId,
    onRequestDocIntel: handleRequestDocIntel,
    onSelectDocIntel: handleSelectDocIntel,
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 xl:col-span-8">
          <TenderDetailView
            data={tender}
            tenderId={tenderId}
            filingWorkspace={filingWorkspace}
            defaultTab="documents"
          />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <FilingPipelineSidebar
            selectedDocumentName={selectedData?.documentName ?? null}
            eligibilityCriteria={selectedData?.eligibilityCriteria ?? []}
            requiredDocuments={selectedData?.requiredDocuments ?? []}
            uploadedFiles={uploadedFiles}
            onUploadFile={handleUploadFile}
            onCreateZip={handleCreateZip}
            zipLoading={zipLoading}
          />
        </div>
      </div>

      {confirmTarget && (
        <DocIntelConfirmDialog
          documentName={confirmTarget.name}
          creditsRemaining={creditsRemaining}
          loading={confirmLoading}
          onConfirm={() => void handleConfirmDocIntel()}
          onCancel={() => {
            if (!confirmLoading) setConfirmTarget(null);
          }}
        />
      )}
    </>
  );
}
