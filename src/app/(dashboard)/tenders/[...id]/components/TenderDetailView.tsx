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
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

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

function formatSize(sizeKb: number | null | undefined): string {
  if (sizeKb == null || !Number.isFinite(sizeKb) || sizeKb <= 0) return "—";
  if (sizeKb >= 1024) return `${(sizeKb / 1024).toFixed(2)} MB`;
  return `${sizeKb.toFixed(2)} KB`;
}

function fv(value: string | number | null | undefined): string | number {
  if (value == null) return "—";
  if (typeof value === "string" && value.trim() === "") return "—";
  return value;
}

function hasValue(value: string | number | null | undefined): boolean {
  return fv(value) !== "—";
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

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-ink-200 dark:border-ink-800 bg-surface shadow-card", className)}>
      {children}
    </div>
  );
}

function PanelHeading({
  icon: Icon,
  title,
  subtitle,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-4", className)}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-ink-400 dark:text-ink-600" aria-hidden />}
        <h3 className="text-sm font-bold uppercase tracking-wide text-ink-500 dark:text-ink-400">{title}</h3>
      </div>
      {subtitle && <p className="mt-0.5 text-xs text-ink-400 dark:text-ink-600">{subtitle}</p>}
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[minmax(0,200px)_1fr] sm:gap-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400 dark:text-ink-600">{label}</dt>
      <dd className="text-sm text-ink-800 dark:text-ink-100">{children}</dd>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Panel className="p-5">
      <PanelHeading title={title} className="mb-1" />
      <dl className="divide-y divide-ink-100 dark:divide-ink-900">{children}</dl>
    </Panel>
  );
}

function Chain({
  value,
  variant = "compact",
}: {
  value: string;
  variant?: "compact" | "prominent";
}) {
  const parts = value.split("||").map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) return <span className="text-ink-400 dark:text-ink-600">—</span>;
  const lastClass =
    variant === "prominent"
      ? "rounded-lg bg-navy-50 dark:bg-accent-blue-bg border border-navy-200 dark:border-accent-blue-bg px-3 py-1.5 text-sm font-semibold text-navy-800 dark:text-accent-blue"
      : "rounded-md bg-navy-50 dark:bg-accent-blue-bg px-2 py-0.5 text-xs font-semibold text-navy-700 dark:text-accent-blue";
  const restClass = variant === "prominent" ? "text-sm text-ink-500 dark:text-ink-400" : "text-xs text-ink-600 dark:text-ink-300";
  const gap = variant === "prominent" ? "gap-x-2 gap-y-2" : "gap-x-1 gap-y-1";

  return (
    <ol className={cn("flex flex-wrap items-center", gap)}>
      {parts.map((part, i) => (
        <li key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-ink-300 dark:text-ink-700 select-none">›</span>}
          <span className={i === parts.length - 1 ? lastClass : restClass}>{part}</span>
        </li>
      ))}
    </ol>
  );
}

function MetricCard({ label, children, compact }: { label: string; children: React.ReactNode; compact?: boolean }) {
  return (
    <div className="rounded-xl border border-ink-200 dark:border-ink-800 bg-surface p-4 shadow-card">
      <p className="text-2xs font-semibold uppercase tracking-wide text-ink-400 dark:text-ink-600">{label}</p>
      <p className={cn("mt-1 font-bold text-ink-900 dark:text-ink-50", compact ? "text-sm leading-snug" : "text-xl")}>
        {children}
      </p>
    </div>
  );
}

function SimpleTable({
  headers,
  empty,
  minWidth,
  children,
}: {
  headers: string[];
  empty?: string;
  minWidth?: string;
  children?: React.ReactNode;
}) {
  if (!children) {
    return <p className="text-sm text-ink-400 dark:text-ink-600">{empty ?? "No rows listed."}</p>;
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-ink-200 dark:border-ink-800">
      <table className={cn("w-full text-left text-sm", minWidth)}>
        <thead className="border-b border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-3 py-2.5 text-xs font-semibold text-ink-500 dark:text-ink-400">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100 dark:divide-ink-900">{children}</tbody>
      </table>
    </div>
  );
}

function Td({
  children,
  numeric,
  muted,
}: {
  children: React.ReactNode;
  numeric?: boolean;
  muted?: boolean;
}) {
  return (
    <td
      className={cn(
        "px-3 py-2.5 text-xs",
        numeric && "tabular-nums",
        muted ? "text-ink-600 dark:text-ink-300" : "text-ink-800 dark:text-ink-100"
      )}
    >
      {children}
    </td>
  );
}

function DocRow({
  doc,
  onView,
  onDownload,
  filingWorkspace,
  documentId,
}: {
  doc: { document_name?: string | null; description?: string | null; document_size_kb?: number | null; file_url?: string | null };
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
        isSelected ? "border-navy-300 dark:border-accent-blue-bg bg-navy-50/40 dark:bg-accent-blue-bg/40" : "border-ink-200 dark:border-ink-800"
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink-900 dark:text-ink-50">
          <FileText className="h-4 w-4 shrink-0 text-ink-400 dark:text-ink-600" aria-hidden />
          <span className="truncate">{fv(doc.document_name)}</span>
          {docIntel?.status === "complete" && (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-success-600 dark:text-success-400" aria-label="Analysis complete" />
          )}
        </p>
        <p className="mt-0.5 text-xs text-ink-400 dark:text-ink-600">
          {[doc.description?.trim(), formatSize(doc.document_size_kb)].filter((part) => part && part !== "—").join(" · ") || "—"}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <button
          type="button"
          onClick={onView}
          disabled={!hasUrl}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-ink-200 dark:border-ink-800 bg-surface px-3 text-xs font-medium text-ink-700 dark:text-ink-200 transition-colors hover:bg-ink-50 dark:hover:bg-ink-950 disabled:opacity-40"
        >
          <Eye className="h-3.5 w-3.5" aria-hidden />
          View
        </button>
        <button
          type="button"
          onClick={onDownload}
          disabled={!hasUrl}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-ink-200 dark:border-ink-800 bg-surface px-3 text-xs font-medium text-ink-700 dark:text-ink-200 transition-colors hover:bg-ink-50 dark:hover:bg-ink-950 disabled:opacity-40"
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
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-navy-200 dark:border-accent-blue-bg bg-navy-50 dark:bg-accent-blue-bg px-3 text-xs font-medium text-navy-700 dark:text-accent-blue transition-colors hover:bg-navy-100 dark:hover:bg-accent-blue-bg/70 disabled:opacity-60"
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
                ? "border-navy-600 dark:border-primary bg-navy-600 dark:bg-primary text-white"
                : "border-navy-200 dark:border-accent-blue-bg bg-surface text-navy-700 dark:text-accent-blue hover:bg-navy-50 dark:hover:bg-navy-900"
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

function DocumentGroup({
  title,
  docs,
  filingWorkspace,
  onView,
  onDownload,
}: {
  title: string;
  docs: Array<{
    id: number;
    document_name?: string | null;
    document_type?: string | null;
    description?: string | null;
    document_size_kb?: number | null;
    file_url?: string | null;
  }>;
  filingWorkspace?: FilingWorkspaceDocIntelProps;
  onView: (fileUrl: string) => void;
  onDownload: (fileUrl: string) => void;
}) {
  if (docs.length === 0) return null;
  return (
    <Panel className="p-5">
      <PanelHeading title={title} subtitle={`${docs.length} file(s)`} />
      <div className="space-y-2">
        {docs.map((doc) => (
          <DocRow
            key={doc.id}
            doc={{ ...doc, document_name: doc.document_name ?? doc.document_type }}
            documentId={doc.id}
            filingWorkspace={filingWorkspace}
            onView={() => doc.file_url && onView(doc.file_url)}
            onDownload={() => doc.file_url && onDownload(doc.file_url)}
          />
        ))}
      </div>
    </Panel>
  );
}

// ── Tab IDs ───────────────────────────────────────────────────────────────────

type TabId = "overview" | "dates" | "fee" | "documents";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "dates", label: "Dates" },
  { id: "fee", label: "Fee & EMD" },
  { id: "documents", label: "Documents" },
];

function isTabId(value: string): value is TabId {
  return TABS.some((tab) => tab.id === value);
}

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
  filingWorkspace?: FilingWorkspaceDocIntelProps;
  defaultTab?: TabId;
}

export function TenderDetailView({ data, filingWorkspace, defaultTab = "overview" }: TenderDetailViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>(isTabId(defaultTab) ? defaultTab : "overview");

  const b = data.basic_details;
  const w = data.work_items;
  const tf = data.tender_fee_details;
  const emd = data.emd_fee_details;
  const cd = data.critical_dates;
  const auth = data.tender_inviting_authority;
  const offlineInstruments = data.payment_instruments.offline ?? [];
  const hasPreBid =
    hasValue(w.pre_bid_meeting_place) || hasValue(w.pre_bid_meeting_address) || hasValue(w.pre_bid_meeting_date);

  const quickFacts: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: CircleDot, label: "Sub-category", value: String(fv(w.product_category)) },
    { icon: MapPin, label: "Location", value: String(fv(w.location)) },
    { icon: MapPin, label: "Pincode", value: String(fv(w.pincode)) },
    { icon: Clock, label: "Contract type", value: String(fv(w.contract_type)) },
    { icon: Timer, label: "Bid opening place", value: String(fv(w.bid_opening_place)) },
    { icon: CircleDot, label: "Tender type", value: String(fv(b.tender_type)) },
    { icon: CircleDot, label: "Form of contract", value: String(fv(b.form_of_contract)) },
    { icon: CircleDot, label: "Payment mode", value: String(fv(b.payment_mode)) },
  ].filter((f) => f.value !== "—");

  function handleView(fileUrl: string) {
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  }
  async function handleDownload(fileUrl: string) {
    try { await downloadFromUrl(fileUrl); }
    catch { window.open(fileUrl, "_blank", "noopener,noreferrer"); }
  }

  return (
    <div className="space-y-4">
      <div
        className="flex overflow-x-auto rounded-xl border border-ink-200 dark:border-ink-800 bg-surface p-1 shadow-card"
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
              "flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:focus-visible:ring-navy-400",
              activeTab === tab.id
                ? "bg-ink-900 dark:bg-ink-50 text-white dark:text-ink-900 shadow-sm"
                : "text-ink-500 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-900 hover:text-ink-800 dark:hover:text-ink-100"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <MetricCard label="Tender value">{formatInr(w.tender_value)}</MetricCard>
            <MetricCard label="Period of work">
              {w.period_of_work_days}{" "}
              <span className="text-sm font-medium text-ink-500 dark:text-ink-400">days</span>
            </MetricCard>
            <MetricCard label="Bid validity">
              {w.bid_validity_days}{" "}
              <span className="text-sm font-medium text-ink-500 dark:text-ink-400">days</span>
            </MetricCard>
            <MetricCard label="Submission closes" compact>
              {formatDateTime(cd.bid_submission_end_date)}
            </MetricCard>
          </div>

          {quickFacts.length > 0 && (
            <Panel>
              <dl className="divide-y divide-ink-100 dark:divide-ink-900">
                {quickFacts.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4 px-5 py-3">
                    <Icon className="h-3.5 w-3.5 shrink-0 text-ink-400 dark:text-ink-600" aria-hidden />
                    <dt className="w-36 shrink-0 text-xs font-semibold uppercase tracking-wide text-ink-400 dark:text-ink-600">
                      {label}
                    </dt>
                    <dd className="text-sm font-medium text-ink-800 dark:text-ink-100">{value}</dd>
                  </div>
                ))}
              </dl>
            </Panel>
          )}

          <Panel className="p-5">
            <PanelHeading icon={ScrollText} title="Work description" />
            {hasValue(w.work_description) ? (
              <p className="text-sm text-ink-700 dark:text-ink-200 leading-relaxed whitespace-pre-line">{w.work_description}</p>
            ) : (
              <p className="text-sm text-ink-400 dark:text-ink-600 italic">No description provided.</p>
            )}
            {hasValue(w.pre_qualification_details) && (
              <div className="mt-4 rounded-lg bg-warning-50 dark:bg-warning-500/10 border border-warning-200 dark:border-warning-500/30 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-warning-700 dark:text-warning-400 mb-1">
                  Pre-qualification
                </p>
                <p className="text-sm text-warning-900 dark:text-warning-300 leading-relaxed">{w.pre_qualification_details}</p>
              </div>
            )}
          </Panel>

          {hasValue(auth.name) && (
            <Panel className="p-5">
              <PanelHeading icon={Landmark} title="Tendering authority" />
              <Chain value={String(auth.name)} variant="prominent" />
              {hasValue(auth.address) && (
                <p className="mt-3 text-xs text-ink-400 dark:text-ink-600 flex items-start gap-1.5">
                  <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden />
                  {auth.address}
                </p>
              )}
            </Panel>
          )}

          <SectionCard title="Tender specifications">
            {hasValue(b.tender_reference_number) && (
              <DetailRow label="Tender reference">{b.tender_reference_number}</DetailRow>
            )}
            <DetailRow label="Withdrawal allowed">{formatYesNo(b.withdrawal_allowed)}</DetailRow>
            <DetailRow label="No. of covers">{b.no_of_covers}</DetailRow>
            <DetailRow label="General tech evaluation">{formatYesNo(b.general_technical_evaluation_allowed)}</DetailRow>
            <DetailRow label="Itemwise tech evaluation">{formatYesNo(b.itemwise_technical_evaluation_allowed)}</DetailRow>
            <DetailRow label="Multi-currency (BOQ)">{formatYesNo(b.is_multi_currency_allowed_for_boq)}</DetailRow>
            <DetailRow label="Multi-currency (fee)">{formatYesNo(b.is_multi_currency_allowed_for_fee)}</DetailRow>
            <DetailRow label="Two-stage bidding">{formatYesNo(b.allow_two_stage_bidding)}</DetailRow>
          </SectionCard>

          <Panel className="p-5">
            <PanelHeading title="Cover details" />
            <SimpleTable
              headers={["No.", "Cover", "Doc type", "Description"]}
              empty="No cover details listed."
              minWidth="min-w-[480px]"
            >
              {data.cover_details.length > 0
                ? data.cover_details.map((c) => (
                    <tr key={c.cover_no} className="align-top">
                      <Td numeric muted>{c.cover_no}</Td>
                      <Td>{fv(c.cover)}</Td>
                      <Td>{fv(c.document_type)}</Td>
                      <Td muted>{fv(c.description)}</Td>
                    </tr>
                  ))
                : undefined}
            </SimpleTable>
          </Panel>

          {hasPreBid && (
            <SectionCard title="Pre-bid meeting">
              {hasValue(w.pre_bid_meeting_place) && (
                <DetailRow label="Place">{w.pre_bid_meeting_place}</DetailRow>
              )}
              {hasValue(w.pre_bid_meeting_address) && (
                <DetailRow label="Address">{w.pre_bid_meeting_address}</DetailRow>
              )}
              {hasValue(w.pre_bid_meeting_date) && (
                <DetailRow label="Date">{formatDateTime(w.pre_bid_meeting_date)}</DetailRow>
              )}
            </SectionCard>
          )}

          <Panel className="p-5">
            <PanelHeading icon={CalendarDays} title="Key dates" />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Published", value: formatDateTime(cd.publish_date) },
                { label: "Doc download starts", value: formatDateTime(cd.document_download_sale_start_date) },
                { label: "Submission opens", value: formatDateTime(cd.bid_submission_start_date) },
                { label: "Submission closes", value: formatDateTime(cd.bid_submission_end_date) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-2xs font-semibold uppercase tracking-wide text-ink-400 dark:text-ink-600">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-ink-800 dark:text-ink-100">{value}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

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
              <span className={cn("tabular-nums", label.includes("end") && "font-semibold text-ink-900 dark:text-ink-50")}>
                {formatDateTime(val)}
              </span>
            </DetailRow>
          ))}
        </SectionCard>
      )}

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

          <Panel className="p-5">
            <PanelHeading title="Payment instruments (offline)" />
            <SimpleTable headers={["S.No.", "Instrument type"]} empty="No offline payment instruments listed.">
              {offlineInstruments.length > 0
                ? offlineInstruments.map((row) => (
                    <tr key={row.s_no}>
                      <Td numeric muted>{row.s_no}</Td>
                      <Td>{row.instrument_type}</Td>
                    </tr>
                  ))
                : undefined}
            </SimpleTable>
          </Panel>
        </div>
      )}

      {activeTab === "documents" && (
        <div className="space-y-5">
          {data.tender_documents.nit_documents.length === 0 &&
            data.tender_documents.work_item_documents.length === 0 && (
              <Panel className="p-5">
                <p className="text-sm text-ink-400 dark:text-ink-600">No documents listed.</p>
              </Panel>
            )}

          <DocumentGroup
            title="NIT documents"
            docs={data.tender_documents.nit_documents}
            filingWorkspace={filingWorkspace}
            onView={handleView}
            onDownload={(url) => void handleDownload(url)}
          />
          <DocumentGroup
            title="Work item documents"
            docs={data.tender_documents.work_item_documents}
            filingWorkspace={filingWorkspace}
            onView={handleView}
            onDownload={(url) => void handleDownload(url)}
          />

          <Panel className="p-5">
            <PanelHeading
              title="Corrigendum"
              subtitle={`${data.latest_corrigendum_list.length} amendment(s)`}
            />
            {data.latest_corrigendum_list.length === 0 ? (
              <p className="text-sm text-ink-400 dark:text-ink-600">No corrigendum entries.</p>
            ) : (
              <div className="space-y-2">
                {data.latest_corrigendum_list.map((c) => (
                  <div
                    key={c.s_no}
                    className="rounded-xl border border-warning-200 dark:border-warning-500/30 bg-warning-50 dark:bg-warning-500/10 p-3"
                  >
                    <p className="text-sm font-semibold text-ink-900 dark:text-ink-50">{fv(c.corrigendum_title)}</p>
                    <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">{fv(c.corrigendum_type)}</p>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      )}
    </div>
  );
}
