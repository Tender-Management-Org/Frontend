"use client";

import { useMemo } from "react";
import {
  Archive,
  CheckCircle2,
  FileUp,
  ListChecks,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { EligibilityCriterion, RequiredDocument } from "@/lib/api/docIntel";
import { Button } from "@/components/ui/Button";

export interface UploadedDocFile {
  file: File;
  fileName: string;
}

interface FilingPipelineSidebarProps {
  selectedDocumentName: string | null;
  eligibilityCriteria: EligibilityCriterion[];
  requiredDocuments: RequiredDocument[];
  uploadedFiles: Record<number, UploadedDocFile | null>;
  onUploadFile: (index: number, file: File | null) => void;
  onCreateZip: () => void;
  zipLoading: boolean;
}

function StepHeader({
  step,
  title,
  subtitle,
  icon: Icon,
}: {
  step: number;
  title: string;
  subtitle: string;
  icon: typeof ShieldCheck;
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-600 text-xs font-bold text-white">
        {step}
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-navy-600" aria-hidden />
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
          <p className="text-xs text-ink-400">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export function FilingPipelineSidebar({
  selectedDocumentName,
  eligibilityCriteria,
  requiredDocuments,
  uploadedFiles,
  onUploadFile,
  onCreateZip,
  zipLoading,
}: FilingPipelineSidebarProps) {
  const uploadedCount = useMemo(
    () => Object.values(uploadedFiles).filter(Boolean).length,
    [uploadedFiles]
  );

  if (!selectedDocumentName) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-6 text-center shadow-card">
        <Sparkles className="mx-auto mb-3 h-8 w-8 text-ink-300" aria-hidden />
        <p className="text-sm font-semibold text-ink-700">Filing pipeline</p>
        <p className="mt-1 text-xs text-ink-400">
          Run document intelligence on a PDF, then click the arrow to view extracted requirements here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">Active document</p>
        <p className="mt-0.5 truncate text-sm font-semibold text-ink-900">{selectedDocumentName}</p>
      </div>

      {/* Step 1: Eligibility criteria */}
      <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
        <StepHeader
          step={1}
          title="Eligibility criteria"
          subtitle="Extracted from the selected PDF"
          icon={ShieldCheck}
        />
        {eligibilityCriteria.length === 0 ? (
          <p className="text-xs text-ink-400">No eligibility criteria extracted.</p>
        ) : (
          <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
            {eligibilityCriteria.map((item, index) => (
              <li
                key={`${item.criterion}-${index}`}
                className="rounded-xl border border-ink-100 bg-ink-50 p-3"
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2
                    className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${item.mandatory ? "text-success-600" : "text-ink-300"}`}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-ink-800">{item.criterion}</p>
                    <p className="mt-0.5 text-2xs text-ink-500">
                      {item.category}
                      {item.linked_document ? ` · ${item.linked_document}` : ""}
                    </p>
                    {item.notes && <p className="mt-1 text-2xs text-ink-400">{item.notes}</p>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Step 2: Required documents with upload */}
      <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
        <StepHeader
          step={2}
          title="Required documents"
          subtitle="Upload your files for each requirement"
          icon={ListChecks}
        />
        {requiredDocuments.length === 0 ? (
          <p className="text-xs text-ink-400">No required documents extracted.</p>
        ) : (
          <ul className="max-h-72 space-y-2 overflow-y-auto pr-1">
            {requiredDocuments.map((doc, index) => {
              const uploaded = uploadedFiles[index];
              const inputId = `filing-upload-${index}`;
              return (
                <li
                  key={`${doc.document_name}-${index}`}
                  className="rounded-xl border border-ink-100 p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-ink-800">{doc.document_name}</p>
                      <p className="mt-0.5 text-2xs text-ink-500">
                        {doc.type}
                        {doc.format ? ` · ${doc.format}` : ""}
                        {doc.mandatory ? " · Mandatory" : ""}
                      </p>
                    </div>
                    {uploaded && (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-success-600" aria-hidden />
                    )}
                  </div>
                  <div className="mt-2">
                    <input
                      id={inputId}
                      type="file"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        onUploadFile(index, file);
                      }}
                    />
                    <label
                      htmlFor={inputId}
                      className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3 text-xs font-medium text-ink-700 transition-colors hover:bg-ink-50"
                    >
                      <FileUp className="h-3.5 w-3.5" aria-hidden />
                      {uploaded ? "Replace file" : "Upload file"}
                    </label>
                    {uploaded && (
                      <p className="mt-1 truncate text-2xs text-ink-500">{uploaded.fileName}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Step 3: Create zip */}
      <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
        <StepHeader
          step={3}
          title="Create submission zip"
          subtitle="Bundle all uploaded files"
          icon={Archive}
        />
        <p className="mb-3 text-xs text-ink-500">
          {uploadedCount} of {requiredDocuments.length} document(s) uploaded.
        </p>
        <Button
          type="button"
          onClick={onCreateZip}
          disabled={zipLoading || uploadedCount === 0}
          className="w-full"
        >
          <Archive className="h-4 w-4" aria-hidden />
          {zipLoading ? "Creating zip…" : "Download zip"}
        </Button>
      </div>
    </div>
  );
}
