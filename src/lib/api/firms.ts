import { apiRequest } from "./client";
import type { PaginatedResponse } from "./types";

export interface FirmApi {
  id: string;
  owner: number;
  legal_name: string;
  business_name: string;
  constitution: string;
  incorporation_date: string | null;
  industry_type: string;
  scope_of_work: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getFirms(page = 1) {
  return apiRequest<PaginatedResponse<FirmApi>>(`/firms/?page=${page}`);
}

export async function getFirm(firmId: string) {
  return apiRequest<FirmApi>(`/firms/${firmId}/`);
}
