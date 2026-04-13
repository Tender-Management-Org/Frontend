"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { DocumentCard, type DocumentItem } from "./components/DocumentCard";
import { DocumentFilters } from "./components/DocumentFilters";
import { DocumentTable } from "./components/DocumentTable";
import { UploadModal } from "./components/UploadModal";

export default function DocumentsPage() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const documents: DocumentItem[] = [
    {
      id: 1,
      name: "GST Certificate",
      type: "GST_Cert",
      expiry: "2027-01-01",
      status: "Verified"
    },
    {
      id: 2,
      name: "PAN Card Copy",
      type: "PAN_Card",
      expiry: "2030-12-31",
      status: "Verified"
    },
    {
      id: 3,
      name: "FY 2025 Balance Sheet",
      type: "Balance_Sheet",
      expiry: "2026-09-30",
      status: "Pending"
    },
    {
      id: 4,
      name: "Metro Rail Work Order",
      type: "Work_Order",
      expiry: "2025-11-10",
      status: "Expired"
    }
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Document Vault</h2>
          <p className="text-sm text-slate-500">Manage tender compliance files with clear status tracking.</p>
        </div>
        <Button onClick={() => setIsUploadOpen(true)}>Upload Document</Button>
      </div>

      <DocumentFilters />

      {documents.length === 0 ? (
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

      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </section>
  );
}
