"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { TenderDetail } from "@/types/tenderDetail";
import { CalendarClock, CircleDot, Download, Eye, FileText, Landmark, MapPin } from "lucide-react";

function formatDateTime(iso: string | null | undefined): string {
  if (iso == null || iso === "") return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function formatYesNo(v: boolean): string {
  return v ? "Yes" : "No";
}

function formatInr(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(n);
}

function formatSize(sizeKb: number): string {
  if (!Number.isFinite(sizeKb)) return "—";
  if (sizeKb >= 1024) return `${(sizeKb / 1024).toFixed(2)} MB`;
  return `${sizeKb.toFixed(2)} KB`;
}

function formatValue(value: string | number | null | undefined): string | number {
  if (value == null) return "—";
  if (typeof value === "string" && value.trim() === "") return "—";
  return value;
}

function extractFileName(fileUrl: string): string {
  try {
    const parsed = new URL(fileUrl, window.location.origin);
    const pathname = parsed.pathname;
    const candidate = pathname.split("/").filter(Boolean).pop();
    return candidate || "document";
  } catch {
    return "document";
  }
}

async function downloadFromUrl(fileUrl: string): Promise<void> {
  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error(`Failed to download document: ${response.status}`);
  }

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

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-2.5 sm:grid-cols-[minmax(0,220px)_1fr] sm:gap-4">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="text-sm text-slate-900">{children}</div>
    </div>
  );
}

function Section({
  title,
  children,
  className
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("space-y-3", className)}>
      <h3 className="text-base font-semibold tracking-tight text-slate-900">{title}</h3>
      <div className="divide-y divide-slate-100">{children}</div>
    </Card>
  );
}

interface TenderDetailViewProps {
  data: TenderDetail;
}

export function TenderDetailView({ data }: TenderDetailViewProps) {
  const b = data.basic_details;
  const w = data.work_items;
  const tf = data.tender_fee_details;
  const emd = data.emd_fee_details;
  const cd = data.critical_dates;
  const auth = data.tender_inviting_authority;
  const actionLinkClassName =
    "inline-flex h-8 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500";
  const handleViewDocument = (fileUrl: string): void => {
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };
  const handleDownloadDocument = async (fileUrl: string): Promise<void> => {
    try {
      await downloadFromUrl(fileUrl);
    } catch {
      // Fallback to direct URL if fetch download is blocked by storage/browser constraints.
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h3 className="text-base font-semibold tracking-tight text-slate-900">At a glance</h3>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Category</p>
            <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <CircleDot className="h-4 w-4 text-slate-500" />
              {formatValue(b.tender_category)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Location</p>
            <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <MapPin className="h-4 w-4 text-slate-500" />
              {formatValue(w.location)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Authority</p>
            <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Landmark className="h-4 w-4 text-slate-500" />
              {formatValue(auth.name)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Submission end</p>
            <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <CalendarClock className="h-4 w-4 text-slate-500" />
              {formatDateTime(cd.bid_submission_end_date)}
            </p>
          </div>
        </div>
      </Card>

      <Section title="Basic details">
        <DetailRow label="Organisation chain">{formatValue(b.organisation_chain)}</DetailRow>
        <DetailRow label="Tender reference number">{formatValue(b.tender_reference_number)}</DetailRow>
        <DetailRow label="Tender ID">{formatValue(b.tender_id)}</DetailRow>
        <DetailRow label="Withdrawal allowed">{formatYesNo(b.withdrawal_allowed)}</DetailRow>
        <DetailRow label="Tender type">{formatValue(b.tender_type)}</DetailRow>
        <DetailRow label="Form of contract">{formatValue(b.form_of_contract)}</DetailRow>
        <DetailRow label="Tender category">{formatValue(b.tender_category)}</DetailRow>
        <DetailRow label="Number of covers">{b.no_of_covers}</DetailRow>
        <DetailRow label="General technical evaluation allowed">
          {formatYesNo(b.general_technical_evaluation_allowed)}
        </DetailRow>
        <DetailRow label="Itemwise technical evaluation allowed">
          {formatYesNo(b.itemwise_technical_evaluation_allowed)}
        </DetailRow>
        <DetailRow label="Payment mode">{formatValue(b.payment_mode)}</DetailRow>
        <DetailRow label="Multi-currency (BOQ)">{formatYesNo(b.is_multi_currency_allowed_for_boq)}</DetailRow>
        <DetailRow label="Multi-currency (fee)">{formatYesNo(b.is_multi_currency_allowed_for_fee)}</DetailRow>
        <DetailRow label="Two-stage bidding">{formatYesNo(b.allow_two_stage_bidding)}</DetailRow>
      </Section>

      <Section title="Work / scope">
        <DetailRow label="Title">{formatValue(w.title)}</DetailRow>
        <DetailRow label="Work description">{formatValue(w.work_description)}</DetailRow>
        <DetailRow label="Pre-qualification">{formatValue(w.pre_qualification_details)}</DetailRow>
        <DetailRow label="Independent external monitor remarks">{formatValue(w.independent_external_monitor_remarks)}</DetailRow>
        <DetailRow label="Tender value">{formatInr(w.tender_value)}</DetailRow>
        <DetailRow label="Product category">{formatValue(w.product_category)}</DetailRow>
        <DetailRow label="Sub category">{w.sub_category ?? "—"}</DetailRow>
        <DetailRow label="Contract type">{formatValue(w.contract_type)}</DetailRow>
        <DetailRow label="Bid validity (days)">{w.bid_validity_days}</DetailRow>
        <DetailRow label="Period of work (days)">{w.period_of_work_days}</DetailRow>
        <DetailRow label="Location">{formatValue(w.location)}</DetailRow>
        <DetailRow label="Pincode">{formatValue(w.pincode)}</DetailRow>
        <DetailRow label="Pre-bid meeting place">{w.pre_bid_meeting_place ?? "—"}</DetailRow>
        <DetailRow label="Pre-bid meeting address">{w.pre_bid_meeting_address ?? "—"}</DetailRow>
        <DetailRow label="Pre-bid meeting date">{formatDateTime(w.pre_bid_meeting_date)}</DetailRow>
        <DetailRow label="Bid opening place">{formatValue(w.bid_opening_place)}</DetailRow>
        <DetailRow label="NDA tender">{formatYesNo(w.should_allow_nda_tender)}</DetailRow>
        <DetailRow label="Preferential bidder">{formatYesNo(w.allow_preferential_bidder)}</DetailRow>
      </Section>

      <Section title="Tender inviting authority">
        <DetailRow label="Name">{formatValue(auth.name)}</DetailRow>
        <DetailRow label="Address">{formatValue(auth.address)}</DetailRow>
      </Section>

      <Section title="Critical dates">
        <DetailRow label="Publish date">{formatDateTime(cd.publish_date)}</DetailRow>
        <DetailRow label="Bid opening date">{formatDateTime(cd.bid_opening_date)}</DetailRow>
        <DetailRow label="Document download / sale start">{formatDateTime(cd.document_download_sale_start_date)}</DetailRow>
        <DetailRow label="Document download / sale end">{formatDateTime(cd.document_download_sale_end_date)}</DetailRow>
        <DetailRow label="Clarification start">{formatDateTime(cd.clarification_start_date)}</DetailRow>
        <DetailRow label="Clarification end">{formatDateTime(cd.clarification_end_date)}</DetailRow>
        <DetailRow label="Bid submission start">{formatDateTime(cd.bid_submission_start_date)}</DetailRow>
        <DetailRow label="Bid submission end">{formatDateTime(cd.bid_submission_end_date)}</DetailRow>
      </Section>

      <Card className="space-y-4">
        <h3 className="text-base font-semibold text-slate-900">Tender fee</h3>
        <div className="divide-y divide-slate-100">
          <DetailRow label="Tender fee">{formatInr(tf.tender_fee)}</DetailRow>
          <DetailRow label="Processing fee">{formatInr(tf.processing_fee)}</DetailRow>
          <DetailRow label="Fee payable to">{tf.fee_payable_to}</DetailRow>
          <DetailRow label="Fee payable at">{tf.fee_payable_at}</DetailRow>
          <DetailRow label="Tender fee exemption allowed">{formatYesNo(tf.tender_fee_exemption_allowed)}</DetailRow>
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="text-base font-semibold text-slate-900">EMD</h3>
        <div className="divide-y divide-slate-100">
          <DetailRow label="EMD amount">{formatInr(emd.emd_amount)}</DetailRow>
          <DetailRow label="EMD exemption allowed">{formatYesNo(emd.emd_exemption_allowed)}</DetailRow>
          <DetailRow label="EMD fee type">{emd.emd_fee_type}</DetailRow>
          <DetailRow label="EMD percentage">{emd.emd_percentage}%</DetailRow>
          <DetailRow label="EMD payable to">{emd.emd_payable_to}</DetailRow>
          <DetailRow label="EMD payable at">{emd.emd_payable_at}</DetailRow>
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="text-base font-semibold tracking-tight text-slate-900">Payment instruments (offline)</h3>
        {data.payment_instruments.offline && data.payment_instruments.offline.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full min-w-[320px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-3 py-2 font-medium">S.No.</th>
                  <th className="px-3 py-2 font-medium">Instrument type</th>
                </tr>
              </thead>
              <tbody>
                {data.payment_instruments.offline.map((row) => (
                  <tr key={row.s_no} className="border-t border-slate-100">
                    <td className="px-3 py-2">{row.s_no}</td>
                    <td className="px-3 py-2">{row.instrument_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No offline payment instruments listed.</p>
        )}
      </Card>

      <Card className="space-y-4">
        <h3 className="text-base font-semibold tracking-tight text-slate-900">Cover details</h3>
        {data.cover_details.length === 0 ? (
          <p className="text-sm text-slate-500">No cover details listed.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-3 py-2 font-medium">Cover no.</th>
                  <th className="px-3 py-2 font-medium">Cover</th>
                  <th className="px-3 py-2 font-medium">Document type</th>
                  <th className="px-3 py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {data.cover_details.map((c) => (
                  <tr key={c.cover_no} className="border-t border-slate-100 align-top">
                    <td className="px-3 py-2">{c.cover_no}</td>
                    <td className="px-3 py-2">{formatValue(c.cover)}</td>
                    <td className="px-3 py-2">{formatValue(c.document_type)}</td>
                    <td className="px-3 py-2 text-slate-700">{formatValue(c.description)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card className="space-y-4">
        <h3 className="text-base font-semibold tracking-tight text-slate-900">NIT documents</h3>
        <div className="space-y-3">
          {data.tender_documents.nit_documents.length === 0 ? (
            <p className="text-sm text-slate-500">No NIT documents listed.</p>
          ) : (
            data.tender_documents.nit_documents.map((doc) => {
              const fileUrl = doc.file_url;
              return (
                <div
                  key={doc.s_no}
                  className="flex flex-col gap-3 rounded-lg border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="flex items-center gap-2 font-medium text-slate-900">
                      <FileText className="h-4 w-4 text-slate-500" />
                      {formatValue(doc.document_name)}
                    </p>
                    <p className="text-sm text-slate-500">
                      {formatValue(doc.description)} • {formatSize(doc.document_size_kb)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {fileUrl ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleViewDocument(fileUrl)}
                        className={cn(actionLinkClassName, "bg-slate-100 text-slate-900 hover:bg-slate-200")}
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDownloadDocument(fileUrl)}
                        className={cn(actionLinkClassName, "bg-slate-100 text-slate-900 hover:bg-slate-200")}
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                    </>
                    ) : (
                    <>
                      <Button variant="secondary" size="sm" type="button" className="gap-2" disabled>
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <Button variant="secondary" size="sm" type="button" className="gap-2" disabled>
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="text-base font-semibold tracking-tight text-slate-900">Work item documents</h3>
        <div className="space-y-3">
          {data.tender_documents.work_item_documents.length === 0 ? (
            <p className="text-sm text-slate-500">No work item documents listed.</p>
          ) : (
            data.tender_documents.work_item_documents.map((doc) => {
              const fileUrl = doc.file_url;
              return (
                <div
                  key={doc.s_no}
                  className="flex flex-col gap-3 rounded-lg border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="flex items-center gap-2 font-medium text-slate-900">
                      <FileText className="h-4 w-4 text-slate-500" />
                      {formatValue(doc.document_name)}
                    </p>
                    <p className="text-sm text-slate-500">
                      {formatValue(doc.document_type)} • {formatValue(doc.description)} • {formatSize(doc.document_size_kb)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {fileUrl ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleViewDocument(fileUrl)}
                        className={cn(actionLinkClassName, "bg-slate-100 text-slate-900 hover:bg-slate-200")}
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDownloadDocument(fileUrl)}
                        className={cn(actionLinkClassName, "bg-slate-100 text-slate-900 hover:bg-slate-200")}
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                    </>
                    ) : (
                    <>
                      <Button variant="secondary" size="sm" type="button" className="gap-2" disabled>
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <Button variant="secondary" size="sm" type="button" className="gap-2" disabled>
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="text-base font-semibold tracking-tight text-slate-900">Corrigendum</h3>
        <div className="space-y-3">
          {data.latest_corrigendum_list.length === 0 ? (
            <p className="text-sm text-slate-500">No corrigendum entries.</p>
          ) : (
            data.latest_corrigendum_list.map((c) => (
              <div key={c.s_no} className="rounded-lg border border-slate-200 p-3">
                <p className="font-medium text-slate-900">{formatValue(c.corrigendum_title)}</p>
                <p className="text-sm text-slate-500">{formatValue(c.corrigendum_type)}</p>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
