import { apiRequest } from "./client";
import type { PaginatedResponse } from "./types";

export interface DocumentApi {
  id: string;
  firm: string;
  file: string;
  title: string;
  doc_type: string;
  other_doc_type: string;
  created_at: string;
  updated_at: string;
}

export async function getFirmDocuments(firmId: string, page = 1) {
  return apiRequest<PaginatedResponse<DocumentApi>>(`/firms/${firmId}/documents/?page=${page}`);
}

export async function uploadDocument(payload: {
  firm: string;
  file: File;
  title?: string;
  doc_type: string;
  other_doc_type?: string;
}) {
  const formData = new FormData();
  formData.append("firm", payload.firm);
  formData.append("file", payload.file);
  formData.append("doc_type", payload.doc_type);

  if (payload.title) formData.append("title", payload.title);
  if (payload.other_doc_type) formData.append("other_doc_type", payload.other_doc_type);

  return apiRequest<DocumentApi>("/documents/upload/", {
    method: "POST",
    body: formData,
  });
}
