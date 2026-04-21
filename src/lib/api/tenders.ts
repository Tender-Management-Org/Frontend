import { apiRequest } from "./client";
import type { PaginatedResponse } from "./types";

export interface TenderListItemApi {
  tender_id: string;
  tender_reference_number: string;
  title: string;
  organisation_chain: string;
  location: string;
  tender_value: string;
  product_category: string;
  sub_category: string;
  bid_submission_end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TenderDocumentVaultApi {
  id: string;
  title: string;
  file: string;
  doc_type: string;
  other_doc_type: string;
}

export interface TenderDocumentApi {
  id: string;
  document_type: string;
  document_name: string;
  description: string;
  document_size_kb: number;
  document: TenderDocumentVaultApi;
  created_at: string;
  updated_at: string;
}

export interface CorrigendumApi {
  id: string;
  title: string;
  corrigendum_type: string;
  created_at: string;
  updated_at: string;
}

export interface TenderFeeApi {
  tender_fee: number | string;
  processing_fee: number | string;
  fee_payable_to: string;
  fee_payable_at: string;
  tender_fee_exemption_allowed: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmdFeeApi {
  emd_amount: number | string;
  emd_fee_type: string;
  emd_percentage: number | string;
  emd_payable_to: string;
  emd_payable_at: string;
  emd_exemption_allowed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TenderDetailApi {
  tender_id: string;
  tender_reference_number: string;
  tender_type: string;
  organisation_chain: string;
  title: string;
  work_description: string;
  tender_value: number | string;
  product_category: string;
  sub_category: string | null;
  location: string;
  pincode: string;
  publish_date: string | null;
  bid_submission_start_date: string | null;
  bid_submission_end_date: string | null;
  bid_opening_date: string | null;
  is_active: boolean;
  documents: TenderDocumentApi[];
  fees: TenderFeeApi | null;
  emd: EmdFeeApi | null;
  corrigenda: CorrigendumApi[];
  created_at: string;
  updated_at: string;
}

export type TendersQuery = {
  page?: number;
  page_size?: number;
  search?: string;
  location?: string;
  min_value?: number;
  max_value?: number;
  product_category?: string;
  is_active?: boolean;
};

export interface TenderSemanticSearchRequest {
  query: string;
  top_k?: number;
  is_active?: boolean;
  location?: string;
  product_category?: string;
}

export interface TenderSemanticSearchResultApi {
  tender_id: string;
  title: string;
  work_description: string;
  product_category: string;
  sub_category: string | null;
  organisation_chain: string;
  location: string;
  publish_date: string | null;
  bid_submission_end_date: string | null;
  is_active: boolean;
  similarity_score: number;
}

export async function getTenders(params: TendersQuery = {}) {
  const query = new URLSearchParams();

  if (params.page) query.set("page", String(params.page));
  if (params.page_size) query.set("page_size", String(params.page_size));
  if (params.search) query.set("search", params.search);
  if (params.location) query.set("location", params.location);
  if (params.min_value !== undefined) query.set("min_value", String(params.min_value));
  if (params.max_value !== undefined) query.set("max_value", String(params.max_value));
  if (params.product_category) query.set("product_category", params.product_category);
  if (params.is_active !== undefined) query.set("is_active", String(params.is_active));

  const suffix = query.toString() ? `?${query.toString()}` : "";
  return apiRequest<PaginatedResponse<TenderListItemApi>>(`/tenders/${suffix}`);
}

export async function semanticSearchTenders(payload: TenderSemanticSearchRequest) {
  return apiRequest<TenderSemanticSearchResultApi[]>("/tenders/semantic-search/", {
    method: "POST",
    body: payload
  });
}

export async function getTenderDetail(tenderId: string) {
  return apiRequest<TenderDetailApi>(`/tenders/${encodeURIComponent(tenderId)}/`);
}
