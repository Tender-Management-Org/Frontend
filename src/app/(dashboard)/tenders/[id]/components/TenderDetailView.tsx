"use client";

import { cn } from "@/lib/utils";
import type { TenderDetail } from "@/types/tenderDetail";
import {
  Brain,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock,
  Download,
  Eye,
  FileText,
  Landmark,
  Loader2,
  MapPin,
  ScrollText,
  Timer,
} from "lucide-react";
import { useState } from "react";
import { EligibilityTab } from "./EligibilityTab";

function formatDateTime(iso: string | null | undefined): string {
  if (iso == null || iso === "") return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  }).format(d);
}

function formatYesNo(v: boolean): string {
  return v ? "Yes" : "No";
}

function formatInr(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(2)} L`;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

function formatSize(sizeKb: number): string {
  if (!Number.isFinite(sizeKb)) return "—";
  if (sizeKb >= 1024) return `${(sizeKb / 1024).toFixed(2)} MB`;
  return `${sizeKb.toFixed(2)} KB`;
}

function fv(value: string | number | null | undefined): string | number {
  if (value == null) return "—";
  if (typeof value === "string" && value.trim() === "") return "—";
  return value;
}

function extractFileName(fileUrl: string): string {
  try {
    const parsed = new URL(fileUrl, window.location.origin);
    return parsed.pathname.split("/").filter(Boolean).pop() || "document";
  } catch {
    return "document";
  }
}

async function downloadFromUrl(fileUrl: string): Promise<void> {
  const response = await fetch(fileUrl);
  if (!response.ok) throw new Error(`Failed: ${response.status}`);
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = extractFileName(fileUrl);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}

// ── Small presentational components ──────────────────────────────────────────

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[minmax(0,200px)_1fr] sm:gap-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</dt>
      <dd className="text-sm text-ink-800">{children}</dd>
    </div>
  );
}

function OrgChain({ value }: { value: string }) {
  const parts = value.split("||").map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) return <span className="text-ink-400">—</span>;
  return (
    <ol className="flex flex-wrap items-center gap-x-1 gap-y-1">
      {parts.map((part, i) => (
        <li key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-ink-300 select-none">›</span>}
          <span
            className={
              i === parts.length - 1
                ? "rounded-md bg-navy-50 px-2 py-0.5 text-xs font-semibold text-navy-700"
                : "text-xs text-ink-600"
            }
          >
            {part}
          </span>
        </li>
      ))}
    </ol>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
      <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-ink-500">{title}</h3>
      <dl className="divide-y divide-ink-100">{children}</dl>
    </div>
  );
}

function DocRow({
  doc,
  onView,
  onDownload,
  filingWorkspace,
  documentId,
}: {
  doc: { document_name?: string | null; description?: string | null; document_size_kb: number; file_url?: string | null };
  onView: () => void;
  onDownload: () => void;
  filingWorkspace?: FilingWorkspaceDocIntelProps;
  documentId?: number;
}) {
  const hasUrl = Boolean(doc.file_url);
  const isPdf = (() => {
    const name = (doc.document_name ?? "").toLowerCase();
    const url = (doc.file_url ?? "").toLowerCase();
    return name.endsWith(".pdf") || url.includes(".pdf");
  })();

  const docIntel =
    filingWorkspace?.enabled && documentId != null && isPdf
      ? filingWorkspace.docIntelByDocumentId[documentId]
      : undefined;
  const isSelected = filingWorkspace?.selectedDocumentId === documentId;
  const showDocIntel = Boolean(filingWorkspace?.enabled && documentId != null && isPdf);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border p-3.5 sm:flex-row sm:items-center sm:justify-between",
        isSelected ? "border-navy-300 bg-navy-50/40" : "border-ink-200"
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink-900">
          <FileText className="h-4 w-4 shrink-0 text-ink-400" aria-hidden />
          <span className="truncate">{fv(doc.document_name)}</span>
          {docIntel?.status === "complete" && (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-success-600" aria-label="Analysis complete" />
          )}
        </p>
        <p className="mt-0.5 text-xs text-ink-400">
          {fv(doc.description)} · {formatSize(doc.document_size_kb)}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <button
          type="button"
          onClick={onView}
          disabled={!hasUrl}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3 text-xs font-medium text-ink-700 transition-colors hover:bg-ink-50 disabled:opacity-40"
        >
          <Eye className="h-3.5 w-3.5" aria-hidden />
          View
        </button>
        <button
          type="button"
          onClick={onDownload}
          disabled={!hasUrl}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3 text-xs font-medium text-ink-700 transition-colors hover:bg-ink-50 disabled:opacity-40"
        >
          <Download className="h-3.5 w-3.5" aria-hidden />
          Download
        </button>
        {showDocIntel && docIntel?.status !== "complete" && (
          <button
            type="button"
            onClick={() =>
              filingWorkspace?.onRequestDocIntel(documentId!, doc.document_name ?? "Document")
            }
            disabled={docIntel?.status === "processing"}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-navy-200 bg-navy-50 px-3 text-xs font-medium text-navy-700 transition-colors hover:bg-navy-100 disabled:opacity-60"
          >
            {docIntel?.status === "processing" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            ) : (
              <Brain className="h-3.5 w-3.5" aria-hidden />
            )}
            {docIntel?.status === "processing" ? "Analyzing…" : "Analyze"}
          </button>
        )}
        {showDocIntel && docIntel?.status === "complete" && (
          <button
            type="button"
            onClick={() => filingWorkspace?.onSelectDocIntel(documentId!)}
            className={cn(
              "inline-flex h-8 items-center gap-1 rounded-lg border px-2.5 text-xs font-medium transition-colors",
              isSelected
                ? "border-navy-600 bg-navy-600 text-white"
                : "border-navy-200 bg-white text-navy-700 hover:bg-navy-50"
            )}
            aria-label="View analysis results"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Tab IDs ───────────────────────────────────────────────────────────────────

type TabId = "overview" | "details" | "dates" | "fee" | "documents" | "eligibility";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "details", label: "Details" },
  { id: "dates", label: "Dates" },
  { id: "fee", label: "Fee & EMD" },
  { id: "documents", label: "Documents" },
  { id: "eligibility", label: "✓ Eligibility" },
];

// ── Main component ────────────────────────────────────────────────────────────

export type DocIntelDocStatus = "idle" | "processing" | "complete" | "error";

export interface FilingWorkspaceDocIntelProps {
  enabled: boolean;
  docIntelByDocumentId: Record<number, { status: DocIntelDocStatus; documentName: string }>;
  selectedDocumentId: number | null;
  onRequestDocIntel: (documentId: number, documentName: string) => void;
  onSelectDocIntel: (documentId: number) => void;
}

interface TenderDetailViewProps {
  data: TenderDetail;
  tenderId: string;
  filingWorkspace?: FilingWorkspaceDocIntelProps;
  defaultTab?: TabId;
}

export function TenderDetailView({ data, tenderId, filingWorkspace, defaultTab = "overview" }: TenderDetailViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);

  const b = data.basic_details;
  const w = data.work_items;
  const tf = data.tender_fee_details;
  const emd = data.emd_fee_details;
  const cd = data.critical_dates;
  const auth = data.tender_inviting_authority;

  function handleView(fileUrl: string) {
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  }
  async function handleDownload(fileUrl: string) {
    try { await downloadFromUrl(fileUrl); }
    catch { window.open(fileUrl, "_blank", "noopener,noreferrer"); }
  }

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div
        className="flex overflow-x-auto rounded-xl border border-ink-200 bg-white p-1 shadow-card"
        role="tablist"
        aria-label="Tender detail sections"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500",
              activeTab === tab.id
                ? "bg-ink-900 text-white shadow-sm"
                : "text-ink-500 hover:bg-ink-100 hover:text-ink-800"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Overview tab ── */}
      {activeTab === "overview" && (
        <div className="space-y-4">

          {/* Key metrics strip */}
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <div className="rounded-xl border border-ink-200 bg-white p-4 shadow-card">
              <p className="text-2xs font-semibold uppercase tracking-wide text-ink-400">Tender value</p>
              <p className="mt-1 text-xl font-bold text-ink-900">{formatInr(w.tender_value)}</p>
            </div>
            <div className="rounded-xl border border-ink-200 bg-white p-4 shadow-card">
              <p className="text-2xs font-semibold uppercase tracking-wide text-ink-400">Period of work</p>
              <p className="mt-1 text-xl font-bold text-ink-900">{w.period_of_work_days} <span className="text-sm font-medium text-ink-500">days</span></p>
            </div>
            <div className="rounded-xl border border-ink-200 bg-white p-4 shadow-card">
              <p className="text-2xs font-semibold uppercase tracking-wide text-ink-400">Bid validity</p>
              <p className="mt-1 text-xl font-bold text-ink-900">{w.bid_validity_days} <span className="text-sm font-medium text-ink-500">days</span></p>
            </div>
            <div className="rounded-xl border border-ink-200 bg-white p-4 shadow-card">
              <p className="text-2xs font-semibold uppercase tracking-wide text-ink-400">Submission closes</p>
              <p className="mt-1 text-sm font-bold text-ink-900 leading-snug">{formatDateTime(cd.bid_submission_end_date)}</p>
            </div>
          </div>

          {/* Quick facts row */}
          <div className="rounded-2xl border border-ink-200 bg-white shadow-card">
            <dl className="divide-y divide-ink-100">
              {[
                { icon: CircleDot, label: "Category", value: String(fv(b.tender_category)) },
                { icon: CircleDot, label: "Sub-category", value: String(fv(w.product_category)) },
                { icon: MapPin, label: "Location", value: String(fv(w.location)) },
                { icon: MapPin, label: "Pincode", value: String(fv(w.pincode)) },
                { icon: Clock, label: "Contract type", value: String(fv(w.contract_type)) },
                { icon: Timer, label: "Bid opening place", value: String(fv(w.bid_opening_place)) },
              ].filter(f => f.value !== "—").map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 px-5 py-3">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-ink-400" aria-hidden />
                  <dt className="w-36 shrink-0 text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</dt>
                  <dd className="text-sm font-medium text-ink-800">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Description — full width */}
          <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <ScrollText className="h-4 w-4 text-ink-400" aria-hidden />
              <h3 className="text-sm font-bold uppercase tracking-wide text-ink-500">Work description</h3>
            </div>
            {fv(w.work_description) !== "—" ? (
              <p className="text-sm text-ink-700 leading-relaxed whitespace-pre-line">{w.work_description}</p>
            ) : (
              <p className="text-sm text-ink-400 italic">No description provided.</p>
            )}
            {fv(w.pre_qualification_details) !== "—" && (
              <div className="mt-4 rounded-lg bg-warning-50 border border-warning-200 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-warning-700 mb-1">Pre-qualification</p>
                <p className="text-sm text-warning-900 leading-relaxed">{w.pre_qualification_details}</p>
              </div>
            )}
          </div>

          {/* Authority — full width */}
          {fv(auth.name) !== "—" && (
            <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <Landmark className="h-4 w-4 text-ink-400" aria-hidden />
                <h3 className="text-sm font-bold uppercase tracking-wide text-ink-500">Tendering authority</h3>
              </div>
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
                {String(fv(auth.name)).split("||").map((part, i, arr) => (
                  <li key={i} className="flex items-center gap-2">
                    {i > 0 && <span className="text-ink-300 select-none">›</span>}
                    <span className={
                      i === arr.length - 1
                        ? "rounded-lg bg-navy-50 border border-navy-200 px-3 py-1.5 text-sm font-semibold text-navy-800"
                        : "text-sm text-ink-500"
                    }>
                      {part.trim()}
                    </span>
                  </li>
                ))}
              </ol>
              {fv(auth.address) !== "—" && (
                <p className="mt-3 text-xs text-ink-400 flex items-start gap-1.5">
                  <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden />
                  {auth.address}
                </p>
              )}
            </div>
          )}

          {/* Key dates strip */}
          <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="h-4 w-4 text-ink-400" aria-hidden />
              <h3 className="text-sm font-bold uppercase tracking-wide text-ink-500">Key dates</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Published", value: formatDateTime(cd.publish_date) },
                { label: "Doc download starts", value: formatDateTime(cd.document_download_sale_start_date) },
                { label: "Submission opens", value: formatDateTime(cd.bid_submission_start_date) },
                { label: "Submission closes", value: formatDateTime(cd.bid_submission_end_date) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-2xs font-semibold uppercase tracking-wide text-ink-400">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-ink-800">{value}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ── Details tab ── */}
      {activeTab === "details" && (
        <div className="space-y-4">
          <SectionCard title="Basic details">
            <DetailRow label="Organisation chain">
              <OrgChain value={b.organisation_chain ?? ""} />
            </DetailRow>
            <DetailRow label="Tender reference">{fv(b.tender_reference_number)}</DetailRow>
            <DetailRow label="Tender ID">{fv(b.tender_id)}</DetailRow>
            <DetailRow label="Withdrawal allowed">{formatYesNo(b.withdrawal_allowed)}</DetailRow>
            <DetailRow label="Tender type">{fv(b.tender_type)}</DetailRow>
            <DetailRow label="Form of contract">{fv(b.form_of_contract)}</DetailRow>
            <DetailRow label="Tender category">{fv(b.tender_category)}</DetailRow>
            <DetailRow label="No. of covers">{b.no_of_covers}</DetailRow>
            <DetailRow label="General tech evaluation">{formatYesNo(b.general_technical_evaluation_allowed)}</DetailRow>
            <DetailRow label="Itemwise tech evaluation">{formatYesNo(b.itemwise_technical_evaluation_allowed)}</DetailRow>
            <DetailRow label="Payment mode">{fv(b.payment_mode)}</DetailRow>
            <DetailRow label="Multi-currency (BOQ)">{formatYesNo(b.is_multi_currency_allowed_for_boq)}</DetailRow>
            <DetailRow label="Multi-currency (fee)">{formatYesNo(b.is_multi_currency_allowed_for_fee)}</DetailRow>
            <DetailRow label="Two-stage bidding">{formatYesNo(b.allow_two_stage_bidding)}</DetailRow>
          </SectionCard>

          {/* Pre-bid meeting */}
          <SectionCard title="Pre-bid meeting">
            <DetailRow label="Place">{fv(w.pre_bid_meeting_place)}</DetailRow>
            <DetailRow label="Address">{fv(w.pre_bid_meeting_address)}</DetailRow>
            <DetailRow label="Date">{formatDateTime(w.pre_bid_meeting_date)}</DetailRow>
          </SectionCard>

          {/* Cover details */}
          <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-ink-500">Cover details</h3>
            {data.cover_details.length === 0 ? (
              <p className="text-sm text-ink-400">No cover details listed.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-ink-200">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead className="border-b border-ink-200 bg-ink-50">
                    <tr>
                      {["No.", "Cover", "Doc type", "Description"].map((h) => (
                        <th key={h} className="px-3 py-2.5 text-xs font-semibold text-ink-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100">
                    {data.cover_details.map((c) => (
                      <tr key={c.cover_no} className="align-top">
                        <td className="px-3 py-2.5 text-xs tabular-nums text-ink-600">{c.cover_no}</td>
                        <td className="px-3 py-2.5 text-xs text-ink-800">{fv(c.cover)}</td>
                        <td className="px-3 py-2.5 text-xs text-ink-800">{fv(c.document_type)}</td>
                        <td className="px-3 py-2.5 text-xs text-ink-600">{fv(c.description)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Payment instruments */}
          <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-ink-500">Payment instruments (offline)</h3>
            {!data.payment_instruments.offline?.length ? (
              <p className="text-sm text-ink-400">No offline payment instruments listed.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-ink-200">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-ink-200 bg-ink-50">
                    <tr>
                      <th className="px-3 py-2.5 text-xs font-semibold text-ink-500">S.No.</th>
                      <th className="px-3 py-2.5 text-xs font-semibold text-ink-500">Instrument type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100">
                    {data.payment_instruments.offline.map((row) => (
                      <tr key={row.s_no}>
                        <td className="px-3 py-2.5 text-xs tabular-nums text-ink-600">{row.s_no}</td>
                        <td className="px-3 py-2.5 text-xs text-ink-800">{row.instrument_type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Dates tab ── */}
      {activeTab === "dates" && (
        <SectionCard title="Critical dates">
          {[
            { label: "Publish date", val: cd.publish_date },
            { label: "Bid opening date", val: cd.bid_opening_date },
            { label: "Doc download start", val: cd.document_download_sale_start_date },
            { label: "Doc download end", val: cd.document_download_sale_end_date },
            { label: "Clarification start", val: cd.clarification_start_date },
            { label: "Clarification end", val: cd.clarification_end_date },
            { label: "Bid submission start", val: cd.bid_submission_start_date },
            { label: "Bid submission end", val: cd.bid_submission_end_date },
          ].map(({ label, val }) => (
            <DetailRow key={label} label={label}>
              <span className={cn("tabular-nums", label.includes("end") && "font-semibold text-ink-900")}>
                {formatDateTime(val)}
              </span>
            </DetailRow>
          ))}
        </SectionCard>
      )}

      {/* ── Fee & EMD tab ── */}
      {activeTab === "fee" && (
        <div className="space-y-4">
          <SectionCard title="Tender fee">
            <DetailRow label="Tender fee">{formatInr(tf.tender_fee)}</DetailRow>
            <DetailRow label="Processing fee">{formatInr(tf.processing_fee)}</DetailRow>
            <DetailRow label="Fee payable to">{fv(tf.fee_payable_to)}</DetailRow>
            <DetailRow label="Fee payable at">{fv(tf.fee_payable_at)}</DetailRow>
            <DetailRow label="Fee exemption allowed">{formatYesNo(tf.tender_fee_exemption_allowed)}</DetailRow>
          </SectionCard>

          <SectionCard title="EMD (Earnest money deposit)">
            <DetailRow label="EMD amount">{formatInr(emd.emd_amount)}</DetailRow>
            <DetailRow label="EMD exemption allowed">{formatYesNo(emd.emd_exemption_allowed)}</DetailRow>
            <DetailRow label="EMD fee type">{fv(emd.emd_fee_type)}</DetailRow>
            <DetailRow label="EMD percentage">{emd.emd_percentage != null ? `${emd.emd_percentage}%` : "—"}</DetailRow>
            <DetailRow label="EMD payable to">{fv(emd.emd_payable_to)}</DetailRow>
            <DetailRow label="EMD payable at">{fv(emd.emd_payable_at)}</DetailRow>
          </SectionCard>
        </div>
      )}

      {/* ── Eligibility tab ── */}
      {activeTab === "eligibility" && (
        <EligibilityTab tenderId={tenderId} />
      )}

      {/* ── Documents tab ── */}
      {activeTab === "documents" && (
        <div className="space-y-5">
          {/* NIT documents */}
          <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
            <div className="mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wide text-ink-500">NIT documents</h3>
              <p className="mt-0.5 text-xs text-ink-400">
                {data.tender_documents.nit_documents.length} file(s)
              </p>
            </div>
            {data.tender_documents.nit_documents.length === 0 ? (
              <p className="text-sm text-ink-400">No NIT documents listed.</p>
            ) : (
              <div className="space-y-2">
                {data.tender_documents.nit_documents.map((doc) => (
                  <DocRow
                    key={doc.id}
                    doc={doc}
                    documentId={doc.id}
                    filingWorkspace={filingWorkspace}
                    onView={() => doc.file_url && handleView(doc.file_url)}
                    onDownload={() => doc.file_url && void handleDownload(doc.file_url)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Work item documents */}
          <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
            <div className="mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wide text-ink-500">Work item documents</h3>
              <p className="mt-0.5 text-xs text-ink-400">
                {data.tender_documents.work_item_documents.length} file(s)
              </p>
            </div>
            {data.tender_documents.work_item_documents.length === 0 ? (
              <p className="text-sm text-ink-400">No work item documents listed.</p>
            ) : (
              <div className="space-y-2">
                {data.tender_documents.work_item_documents.map((doc) => (
                  <DocRow
                    key={doc.id}
                    doc={{ ...doc, document_name: doc.document_name ?? doc.document_type }}
                    documentId={doc.id}
                    filingWorkspace={filingWorkspace}
                    onView={() => doc.file_url && handleView(doc.file_url)}
                    onDownload={() => doc.file_url && void handleDownload(doc.file_url)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Corrigendum */}
          <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
            <div className="mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wide text-ink-500">Corrigendum</h3>
              <p className="mt-0.5 text-xs text-ink-400">
                {data.latest_corrigendum_list.length} amendment(s)
              </p>
            </div>
            {data.latest_corrigendum_list.length === 0 ? (
              <p className="text-sm text-ink-400">No corrigendum entries.</p>
            ) : (
              <div className="space-y-2">
                {data.latest_corrigendum_list.map((c) => (
                  <div key={c.s_no} className="rounded-xl border border-warning-200 bg-warning-50 p-3">
                    <p className="text-sm font-semibold text-ink-900">{fv(c.corrigendum_title)}</p>
                    <p className="mt-0.5 text-xs text-ink-500">{fv(c.corrigendum_type)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
