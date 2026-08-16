import { apiRequest } from "./client";
import type { PaginatedResponse } from "./types";

export type SchemeLevel = "central" | "state";

export interface SchemeListItemApi {
  id: string;
  slug: string;
  scheme_name: string;
  short_title: string;
  brief_description: string;
  category_labels: string[];
  tags: string[];
  scheme_for: string;
  target_beneficiaries: string[];
  level: SchemeLevel;
  nodal_ministry: string;
  scheme_type: string;
  open_date: string | null;
  close_date: string | null;
  is_currently_open: boolean;
  last_synced_at: string;
}

export interface SchemeDetailApi extends SchemeListItemApi {
  /** Full normalised payload — the detail page renders defensively from this. */
  normalised_json_blob: Record<string, unknown>;
  content_hash: string;
  created_at: string;
}

export interface SchemeFacetValue {
  value: string;
  count: number;
}

export interface SchemeFacetsApi {
  total: number;
  levels: SchemeFacetValue[];
  states: SchemeFacetValue[];
  categories: SchemeFacetValue[];
  beneficiaries: SchemeFacetValue[];
  tags: SchemeFacetValue[];
}

export type SchemesQuery = {
  page?: number;
  page_size?: number;
  search?: string;
  level?: SchemeLevel | "";
  state?: string;
  /** Comma-separated; matches any (OR). */
  category?: string;
  tag?: string;
  beneficiary?: string;
  is_currently_open?: boolean;
  ordering?: string;
};

function buildQuery(params: SchemesQuery): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function getSchemes(params: SchemesQuery = {}) {
  return apiRequest<PaginatedResponse<SchemeListItemApi>>(
    `/genie/schemes/${buildQuery(params)}`
  );
}

export async function getScheme(slug: string) {
  return apiRequest<SchemeDetailApi>(`/genie/schemes/${encodeURIComponent(slug)}/`);
}

export async function getSchemeFacets(params: SchemesQuery = {}) {
  return apiRequest<SchemeFacetsApi>(`/genie/schemes/facets/${buildQuery(params)}`);
}

export async function getSchemeRaw(slug: string) {
  return apiRequest<Record<string, unknown>>(
    `/genie/schemes/${encodeURIComponent(slug)}/raw/`
  );
}
