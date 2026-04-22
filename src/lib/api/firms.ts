import { apiRequest } from "./client";
import type { PaginatedResponse } from "./types";

export interface FirmApi {
  id: string;
  owner: number;
  owner_username?: string;
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

export interface FirmIdentityApi {
  id: string;
  firm: string;
  pan_number: string;
  gstin: string;
  cin: string;
  udyam_number: string;
  dsc_expiry_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface FirmLocationApi {
  id: string;
  firm: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface FirmFinancialApi {
  id: string;
  firm: string;
  financial_year: string;
  turnover_amount: string | number;
  net_worth: string | number | null;
  profit_after_tax: string | number | null;
  is_audited: boolean;
  audit_document: string | null;
  created_at: string;
  updated_at: string;
}

export interface FirmBankingSolvencyApi {
  id: string;
  firm: string;
  bank_name: string;
  solvency_amount: string | number;
  issue_date: string;
  expiry_date: string;
  created_at: string;
  updated_at: string;
}

export interface FirmExperienceApi {
  id: string;
  firm: string;
  project_name: string;
  project_description: string;
  client_name: string;
  work_order_value: string | number;
  start_date: string | null;
  completion_date: string | null;
  category_tags: string[];
  created_at: string;
  updated_at: string;
}

export interface FirmCertificationApi {
  id: string;
  firm: string;
  experience: string | null;
  cert_type: string;
  other_cert_type: string;
  cert_number: string;
  rating_level: string;
  issue_date: string | null;
  expiry_date: string | null;
  document: string | null;
  created_at: string;
  updated_at: string;
}

export interface FirmExemptionsApi {
  id: string;
  firm: string;
  eligible_for_emd_waiver: boolean;
  eligible_for_exp_waiver: boolean;
  local_preference_state: string;
  updated_at: string;
}

export interface FirmPreferencesApi {
  id: string;
  firm: string;
  preferred_regions: string[];
  target_sectors: string[];
  excluded_depts: string[];
  min_tender_value: string | number | null;
  max_tender_value: string | number | null;
  updated_at: string;
}

export async function getFirms(page = 1) {
  return apiRequest<PaginatedResponse<FirmApi>>(`/firms/?page=${page}`);
}

export async function getFirm(firmId: string) {
  return apiRequest<FirmApi>(`/firms/${firmId}/`);
}

export async function createFirm(payload: Omit<Partial<FirmApi>, "id" | "owner" | "created_at" | "updated_at">) {
  return apiRequest<FirmApi>("/firms/", { method: "POST", body: payload });
}

export async function updateFirm(firmId: string, payload: Partial<FirmApi>) {
  return apiRequest<FirmApi>(`/firms/${firmId}/`, { method: "PATCH", body: payload });
}

export async function getFirmIdentity(firmId: string) {
  return apiRequest<FirmIdentityApi>(`/firms/${firmId}/identity/`);
}

export async function upsertFirmIdentity(
  firmId: string,
  payload: Omit<Partial<FirmIdentityApi>, "id" | "created_at" | "updated_at">
) {
  return apiRequest<FirmIdentityApi>(`/firms/${firmId}/identity/`, { method: "POST", body: payload });
}

export async function getFirmLocations(firmId: string, page = 1) {
  return apiRequest<PaginatedResponse<FirmLocationApi>>(`/firms/${firmId}/locations/?page=${page}`);
}

export async function createFirmLocation(
  firmId: string,
  payload: Omit<Partial<FirmLocationApi>, "id" | "created_at" | "updated_at">
) {
  return apiRequest<FirmLocationApi>(`/firms/${firmId}/locations/`, { method: "POST", body: payload });
}

export async function updateFirmLocation(
  firmId: string,
  locationId: string,
  payload: Omit<Partial<FirmLocationApi>, "id" | "created_at" | "updated_at">
) {
  return apiRequest<FirmLocationApi>(`/firms/${firmId}/locations/${locationId}/`, {
    method: "PATCH",
    body: payload,
  });
}

export async function getFirmFinancials(firmId: string, page = 1) {
  return apiRequest<PaginatedResponse<FirmFinancialApi>>(`/firms/${firmId}/financials/?page=${page}`);
}

export async function createFirmFinancial(
  firmId: string,
  payload: Omit<Partial<FirmFinancialApi>, "id" | "created_at" | "updated_at">
) {
  return apiRequest<FirmFinancialApi>(`/firms/${firmId}/financials/`, { method: "POST", body: payload });
}

export async function updateFirmFinancial(
  firmId: string,
  financialId: string,
  payload: Omit<Partial<FirmFinancialApi>, "id" | "created_at" | "updated_at">
) {
  return apiRequest<FirmFinancialApi>(`/firms/${firmId}/financials/${financialId}/`, {
    method: "PATCH",
    body: payload,
  });
}

export async function getFirmSolvencyCertificates(firmId: string, page = 1) {
  return apiRequest<PaginatedResponse<FirmBankingSolvencyApi>>(
    `/firms/${firmId}/solvency-certificates/?page=${page}`
  );
}

export async function createFirmSolvencyCertificate(
  firmId: string,
  payload: Omit<Partial<FirmBankingSolvencyApi>, "id" | "created_at" | "updated_at">
) {
  return apiRequest<FirmBankingSolvencyApi>(`/firms/${firmId}/solvency-certificates/`, {
    method: "POST",
    body: payload,
  });
}

export async function updateFirmSolvencyCertificate(
  firmId: string,
  solvencyId: string,
  payload: Omit<Partial<FirmBankingSolvencyApi>, "id" | "created_at" | "updated_at">
) {
  return apiRequest<FirmBankingSolvencyApi>(`/firms/${firmId}/solvency-certificates/${solvencyId}/`, {
    method: "PATCH",
    body: payload,
  });
}

export async function getFirmExperiences(firmId: string, page = 1) {
  return apiRequest<PaginatedResponse<FirmExperienceApi>>(`/firms/${firmId}/experiences/?page=${page}`);
}

export async function createFirmExperience(
  firmId: string,
  payload: Omit<Partial<FirmExperienceApi>, "id" | "created_at" | "updated_at">
) {
  return apiRequest<FirmExperienceApi>(`/firms/${firmId}/experiences/`, { method: "POST", body: payload });
}

export async function updateFirmExperience(
  firmId: string,
  experienceId: string,
  payload: Omit<Partial<FirmExperienceApi>, "id" | "created_at" | "updated_at">
) {
  return apiRequest<FirmExperienceApi>(`/firms/${firmId}/experiences/${experienceId}/`, {
    method: "PATCH",
    body: payload,
  });
}

export async function getFirmCertifications(firmId: string, page = 1) {
  return apiRequest<PaginatedResponse<FirmCertificationApi>>(`/firms/${firmId}/certifications/?page=${page}`);
}

export async function createFirmCertification(
  firmId: string,
  payload: Omit<Partial<FirmCertificationApi>, "id" | "created_at" | "updated_at">
) {
  return apiRequest<FirmCertificationApi>(`/firms/${firmId}/certifications/`, {
    method: "POST",
    body: payload,
  });
}

export async function updateFirmCertification(
  firmId: string,
  certificationId: string,
  payload: Omit<Partial<FirmCertificationApi>, "id" | "created_at" | "updated_at">
) {
  return apiRequest<FirmCertificationApi>(`/firms/${firmId}/certifications/${certificationId}/`, {
    method: "PATCH",
    body: payload,
  });
}

export async function getFirmExemptions(firmId: string) {
  return apiRequest<FirmExemptionsApi>(`/firms/${firmId}/exemptions/`);
}

export async function upsertFirmExemptions(
  firmId: string,
  payload: Omit<Partial<FirmExemptionsApi>, "id" | "updated_at">
) {
  return apiRequest<FirmExemptionsApi>(`/firms/${firmId}/exemptions/`, { method: "POST", body: payload });
}

export async function getFirmPreferences(firmId: string) {
  return apiRequest<FirmPreferencesApi>(`/firms/${firmId}/preferences/`);
}

export async function upsertFirmPreferences(
  firmId: string,
  payload: Omit<Partial<FirmPreferencesApi>, "id" | "updated_at">
) {
  return apiRequest<FirmPreferencesApi>(`/firms/${firmId}/preferences/`, { method: "POST", body: payload });
}
