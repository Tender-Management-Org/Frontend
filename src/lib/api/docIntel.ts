import { apiRequest } from "./client";

export interface EligibilityCriterion {
  criterion: string;
  category: string;
  applies_to: string;
  mandatory: boolean;
  linked_document: string;
  notes: string;
}

export interface RequiredDocument {
  document_name: string;
  type: string;
  mandatory: boolean;
  format: string;
  notes: string;
}

export interface DocIntelRecord<T> {
  id: number;
  tender_document_id: number;
  tender_id: string;
  data: T[];
  created_at: string;
  updated_at: string;
}

export interface DocIntelStatusResponse {
  status: "not_started" | "complete";
  tender_id: string;
  document_id: number;
  eligibility_criteria?: DocIntelRecord<EligibilityCriterion>;
  required_documents?: DocIntelRecord<RequiredDocument>;
}

export interface DocIntelProcessResponse {
  tender_id: string;
  document_id: number;
  remaining_credits: number;
  extraction: {
    tender_info: Record<string, string>;
    eligibility_criteria: EligibilityCriterion[];
    required_documents: RequiredDocument[];
    extraction_note: string;
  };
  eligibility_criteria: DocIntelRecord<EligibilityCriterion>;
  required_documents: DocIntelRecord<RequiredDocument>;
}

export function getDocIntelStatus(tenderId: string, documentId: number) {
  return apiRequest<DocIntelStatusResponse>(
    `/tenders/${encodeURIComponent(tenderId)}/documents/${documentId}/doc-intel/`
  );
}

export function processDocIntel(tenderId: string, documentId: number, firmId: string) {
  const params = new URLSearchParams({
    sync: "true",
    firm_id: firmId,
  });
  return apiRequest<DocIntelProcessResponse>(
    `/tenders/${encodeURIComponent(tenderId)}/documents/${documentId}/doc-intel/process/?${params}`,
    { method: "POST", body: {} }
  );
}

export function getDocIntelEligibility(tenderId: string, documentId: number) {
  return apiRequest<DocIntelRecord<EligibilityCriterion>>(
    `/tenders/${encodeURIComponent(tenderId)}/documents/${documentId}/doc-intel/eligibility-criteria/`
  );
}

export function getDocIntelRequiredDocuments(tenderId: string, documentId: number) {
  return apiRequest<DocIntelRecord<RequiredDocument>>(
    `/tenders/${encodeURIComponent(tenderId)}/documents/${documentId}/doc-intel/required-documents/`
  );
}
