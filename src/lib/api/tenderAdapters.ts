import type { TenderDetail } from "@/types/tenderDetail";
import { SAMPLE_TENDER_DETAIL } from "@/lib/tenders/sampleTenderDetail";
import type { TenderDetailApi, TenderListItemApi, TenderSemanticSearchResultApi } from "./tenders";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://127.0.0.1:8000/api";
const backendOrigin = apiBaseUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");

function resolveDocumentUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `${backendOrigin}${url.startsWith("/") ? url : `/${url}`}`;
}

function toNumber(value: number | string | null | undefined, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function formatInrFromNumber(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDateForList(input: string | null): string {
  if (!input) return "—";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export interface TenderListUiItem {
  id: string;
  title: string;
  organization: string;
  location: string;
  value: string;
  deadline: string;
  description: string;
  similarityScore?: number;
}

export function mapTenderListItemToUi(item: TenderListItemApi): TenderListUiItem {
  return {
    id: item.tender_id,
    title: item.title,
    organization: item.organisation_chain,
    location: item.location || "—",
    value: formatInrFromNumber(toNumber(item.tender_value)),
    deadline: formatDateForList(item.bid_submission_end_date ?? null),
    description: item.title,
  };
}

export function mapTenderSemanticResultToUi(item: TenderSemanticSearchResultApi): TenderListUiItem {
  return {
    id: item.tender_id,
    title: item.title,
    organization: item.organisation_chain,
    location: item.location || "—",
    value: "—",
    deadline: formatDateForList(item.bid_submission_end_date),
    description: item.work_description || item.title,
    similarityScore: Number(item.similarity_score)
  };
}

export function mapTenderDetailToLegacyShape(api: TenderDetailApi): TenderDetail {
  const base = SAMPLE_TENDER_DETAIL;
  const getDocumentFileUrl = (doc: TenderDetailApi["documents"][number]): string | undefined =>
    resolveDocumentUrl(doc.file ?? doc.document?.file);

  return {
    ...base,
    basic_details: {
      ...base.basic_details,
      organisation_chain: api.organisation_chain,
      tender_reference_number: api.tender_reference_number,
      tender_id: api.tender_id,
      tender_type: api.tender_type,
    },
    work_items: {
      ...base.work_items,
      title: api.title,
      work_description: api.work_description,
      tender_value: toNumber(api.tender_value),
      product_category: api.product_category,
      sub_category: api.sub_category,
      location: api.location || "—",
      pincode: api.pincode || "—",
    },
    critical_dates: {
      ...base.critical_dates,
      publish_date: api.publish_date,
      bid_opening_date: api.bid_opening_date,
      bid_submission_start_date: api.bid_submission_start_date,
      bid_submission_end_date: api.bid_submission_end_date,
    },
    tender_fee_details: api.fees
      ? {
          ...base.tender_fee_details,
          tender_fee: toNumber(api.fees.tender_fee),
          processing_fee: toNumber(api.fees.processing_fee),
          fee_payable_to: api.fees.fee_payable_to || "—",
          fee_payable_at: api.fees.fee_payable_at || "—",
          tender_fee_exemption_allowed: api.fees.tender_fee_exemption_allowed,
        }
      : base.tender_fee_details,
    emd_fee_details: api.emd
      ? {
          ...base.emd_fee_details,
          emd_amount: toNumber(api.emd.emd_amount),
          emd_fee_type: api.emd.emd_fee_type || "—",
          emd_percentage: toNumber(api.emd.emd_percentage),
          emd_payable_to: api.emd.emd_payable_to || "—",
          emd_payable_at: api.emd.emd_payable_at || "—",
          emd_exemption_allowed: api.emd.emd_exemption_allowed,
        }
      : base.emd_fee_details,
    tender_documents: {
      nit_documents: api.documents.map((doc, index) => ({
        s_no: index + 1,
        document_name: doc.document_name || doc.document?.title || "Untitled document",
        description: doc.description || "—",
        document_size_kb: doc.document_size_kb ?? 0,
        file_url: getDocumentFileUrl(doc),
      })),
      work_item_documents: api.documents.map((doc, index) => ({
        s_no: index + 1,
        document_type: doc.document_type || "Document",
        document_name: doc.document_name || doc.document?.title || "Untitled document",
        description: doc.description || "—",
        document_size_kb: doc.document_size_kb ?? 0,
        file_url: getDocumentFileUrl(doc),
      })),
    },
    latest_corrigendum_list: api.corrigenda.map((item, index) => ({
      s_no: index + 1,
      corrigendum_title: item.title,
      corrigendum_type: item.corrigendum_type,
    })),
    tender_inviting_authority: {
      ...base.tender_inviting_authority,
      name: api.organisation_chain || "—",
      address: api.location || "—",
    },
  };
}
