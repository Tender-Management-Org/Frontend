/**
 * Helpers for reading and rendering the myScheme normalised blob.
 *
 * The blob is produced by the ingestion script and mirrors myScheme's own
 * response shape, which is not perfectly stable: keys move between the top
 * level and a `basicDetails` / `data` wrapper, values arrive as strings, arrays
 * of strings, or arrays of `{ label, value }` objects, and several long-form
 * fields (detailedDescription, benefits, eligibility) come back as HTML.
 *
 * Everything here is written to degrade rather than throw — an unexpected shape
 * should render as *something* readable, never blow up the detail page.
 */

export type BlobValue = unknown;

/** Wrapper keys the ingestion script may nest real content under. */
const WRAPPER_KEYS = ["basicDetails", "data", "scheme", "schemeContent"] as const;

/** Keys already surfaced in the page header — not repeated in the body. */
export const HEADER_KEYS = new Set([
  "schemeName",
  "schemeShortTitle",
  "shortTitle",
  "slug",
  "briefDescription",
  "level",
  "schemeFor",
  "state",
  "tags",
  "categoryLabels",
  "targetBeneficiaries",
  "nodalMinistryName",
  "nodalMinistry",
  "nodalDepartmentName",
  "nodalDepartment",
  "schemeType",
  "benefitType",
  "openDate",
  "closeDate",
  "isCurrentlyOpen",
  "implementingAgency",
]);

/** Preferred body order. Anything not listed renders after these, in blob order. */
export const SECTION_ORDER = [
  "detailedDescription",
  "benefits",
  "eligibility",
  "eligibilityCriteria",
  "exclusions",
  "applicationProcess",
  "documentsRequired",
  "documents",
  "definitions",
  "faqs",
  "references",
  "sources",
] as const;

const SECTION_LABELS: Record<string, string> = {
  detailedDescription: "About this scheme",
  benefits: "Benefits",
  eligibility: "Eligibility",
  eligibilityCriteria: "Eligibility criteria",
  exclusions: "Exclusions",
  applicationProcess: "How to apply",
  documentsRequired: "Documents required",
  documents: "Documents",
  definitions: "Definitions",
  faqs: "Frequently asked questions",
  references: "References",
  sources: "Sources",
};

/** Turn `applicationProcess` into "Application process" for unmapped keys. */
export function humaniseKey(key: string): string {
  if (SECTION_LABELS[key]) return SECTION_LABELS[key];
  const spaced = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** Read a key from the blob, checking known wrapper objects too. */
export function readBlobKey(blob: unknown, ...keys: string[]): BlobValue {
  if (!isRecord(blob)) return undefined;
  const containers: Record<string, unknown>[] = [blob];
  for (const wrapper of WRAPPER_KEYS) {
    const nested = blob[wrapper];
    if (isRecord(nested)) containers.push(nested);
  }
  for (const container of containers) {
    for (const key of keys) {
      const value = container[key];
      if (!isEmptyValue(value)) return value;
    }
  }
  return undefined;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (isRecord(value)) return Object.keys(value).length === 0;
  return false;
}

/** Flatten the blob (top level + wrappers) into a single ordered section list. */
export function collectSections(blob: unknown): { key: string; label: string; value: BlobValue }[] {
  if (!isRecord(blob)) return [];

  const merged: Record<string, unknown> = {};
  for (const wrapper of WRAPPER_KEYS) {
    const nested = blob[wrapper];
    if (isRecord(nested)) Object.assign(merged, nested);
  }
  // Top-level keys win over wrapper keys of the same name.
  for (const [key, value] of Object.entries(blob)) {
    if ((WRAPPER_KEYS as readonly string[]).includes(key)) continue;
    merged[key] = value;
  }

  const entries = Object.entries(merged).filter(
    ([key, value]) => !HEADER_KEYS.has(key) && !isEmptyValue(value)
  );

  const orderIndex = (key: string) => {
    const index = (SECTION_ORDER as readonly string[]).indexOf(key);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  };

  entries.sort(([a], [b]) => orderIndex(a) - orderIndex(b));

  return entries.map(([key, value]) => ({ key, label: humaniseKey(key), value }));
}

/** True when a string looks like it carries markup we should render as HTML. */
export function looksLikeHtml(value: string): boolean {
  return /<\/?(p|br|ul|ol|li|strong|em|b|i|a|h[1-6]|table|div|span)\b/i.test(value);
}

const ALLOWED_TAGS = new Set([
  "p", "br", "ul", "ol", "li", "strong", "b", "em", "i", "u",
  "h3", "h4", "h5", "h6", "blockquote", "code", "pre",
  "table", "thead", "tbody", "tr", "th", "td", "a",
]);

/**
 * Minimal allowlist sanitizer for the HTML myScheme returns.
 *
 * Strips script/style blocks entirely, drops every tag outside the allowlist,
 * and removes all attributes except a scheme-checked `href` on links. This is
 * intentionally strict — the goal is readable formatting, not fidelity, and it
 * avoids pulling a sanitizer dependency into the bundle for one page.
 */
export function sanitizeSchemeHtml(input: string): string {
  let html = input
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|iframe|object|embed)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<(script|style|iframe|object|embed)\b[^>]*\/?>/gi, "");

  html = html.replace(
    /<\s*(\/?)\s*([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g,
    (_match, closing: string, rawTag: string, attrs: string) => {
      const tag = rawTag.toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) return "";
      if (closing) return `</${tag}>`;
      if (tag === "a") {
        const href = /href\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(attrs);
        const url = (href?.[2] ?? href?.[3] ?? href?.[4] ?? "").trim();
        if (/^(https?:|mailto:|\/)/i.test(url)) {
          const safe = url.replace(/"/g, "&quot;");
          return `<a href="${safe}" target="_blank" rel="noopener noreferrer">`;
        }
        return "<a>";
      }
      return `<${tag}>`;
    }
  );

  return html;
}

/** Best-effort label for an object entry inside a list (FAQs, references, …). */
export function objectTitle(record: Record<string, unknown>): string | null {
  for (const key of ["title", "label", "name", "question", "heading", "header"]) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

/** Best-effort body for an object entry inside a list. */
export function objectBody(record: Record<string, unknown>): string | null {
  for (const key of ["description", "value", "answer", "text", "content", "detail", "body"]) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

/** Best-effort URL for an object entry (references list). */
export function objectUrl(record: Record<string, unknown>): string | null {
  for (const key of ["url", "link", "href", "source"]) {
    const value = record[key];
    if (typeof value === "string" && /^https?:\/\//i.test(value.trim())) return value.trim();
  }
  return null;
}
