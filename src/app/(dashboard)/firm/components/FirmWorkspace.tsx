"use client";

import { Building2, CheckSquare, Eye, Landmark, Pencil, Plus, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import {
  getFirm,
  getFirmCertifications,
  getFirmExemptions,
  getFirmExperiences,
  getFirmFinancials,
  getFirmIdentity,
  getFirmLocations,
  getFirmPreferences,
  getFirms,
  getFirmSolvencyCertificates,
  type FirmApi,
  type FirmBankingSolvencyApi,
  type FirmCertificationApi,
  type FirmExemptionsApi,
  type FirmExperienceApi,
  type FirmFinancialApi,
  type FirmIdentityApi,
  type FirmLocationApi,
  type FirmPreferencesApi,
} from "@/lib/api/firms";
import { getFirmDocuments, type DocumentApi } from "@/lib/api/documents";
import { cn } from "@/lib/utils";
import { FirmEditModal, type FirmModalSection } from "./FirmEditModal";

type TabId = FirmModalSection | "documents";

const tabs: { id: TabId; label: string }[] = [
  { id: "firm", label: "Firm" },
  { id: "identity", label: "Identity" },
  { id: "locations", label: "Locations" },
  { id: "financials", label: "Financials" },
  { id: "banking", label: "Banking & solvency" },
  { id: "experience", label: "Experience" },
  { id: "certifications", label: "Certifications" },
  { id: "exemptions", label: "Exemptions" },
  { id: "preferences", label: "Preferences" },
  { id: "documents", label: "Documents" },
];

interface FirmWorkspaceData {
  firm: FirmApi | null;
  identity: FirmIdentityApi | null;
  location: FirmLocationApi | null;
  financial: FirmFinancialApi | null;
  financials: FirmFinancialApi[];
  banking: FirmBankingSolvencyApi | null;
  bankings: FirmBankingSolvencyApi[];
  experience: FirmExperienceApi | null;
  experiences: FirmExperienceApi[];
  certification: FirmCertificationApi | null;
  certifications: FirmCertificationApi[];
  exemptions: FirmExemptionsApi | null;
  preferences: FirmPreferencesApi | null;
  documents: DocumentApi[];
}

function formatDateTime(value?: string | null) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}

function FieldGrid({ rows }: { rows: { label: string; value?: string }[] }) {
  return (
    <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label} className="space-y-1">
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">{row.label}</dt>
          <dd className="text-sm text-ink-800">{row.value ?? "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

function EmptyState({ entity }: { entity: string }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-ink-200 bg-ink-50 px-4 py-10 text-center">
      <p className="text-sm font-medium text-ink-500">No {entity} records yet</p>
      <p className="mt-0.5 text-xs text-ink-400">Data will appear here once added to your profile.</p>
    </div>
  );
}

function SectionHeader({ title, onEdit, onAdd }: { title: string; onEdit: () => void; onAdd?: () => void }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3 border-b border-ink-100 pb-4">
      <h3 className="text-base font-semibold text-ink-900">{title}</h3>
      <div className="flex items-center gap-2">
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            aria-label={`Add ${title}`}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-navy-600 bg-navy-600 px-3 text-xs font-medium text-white transition-colors hover:bg-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Add
          </button>
        )}
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${title}`}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ink-200 text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
    </div>
  );
}

function fmt(value: string | number | null | undefined): string | undefined {
  if (value == null || value === "") return undefined;
  const num = Number(String(value).replace(/,/g, ""));
  if (!Number.isFinite(num)) return String(value);
  return `₹${num.toLocaleString("en-IN")}`;
}

function SummaryCard({ title, value, icon: Icon }: { title: string; value: string; icon: typeof Building2 }) {
  return (
    <div className="rounded-xl border border-ink-200 bg-white p-4 shadow-card">
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-ink-100">
        <Icon className="h-4 w-4 text-ink-600" aria-hidden />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{title}</p>
      <p className="mt-1 text-sm font-semibold text-ink-900">{value}</p>
    </div>
  );
}

function RecordCard({
  title,
  subtitle,
  onEdit,
  children,
}: {
  title: string;
  subtitle?: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-ink-200 bg-ink-50/50 p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink-900">{title}</p>
          {subtitle && <p className="text-xs text-ink-400">{subtitle}</p>}
        </div>
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${title}`}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-ink-200 bg-white text-ink-500 transition-colors hover:bg-ink-100"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
      {children}
    </div>
  );
}

export function FirmWorkspace() {
  const [active, setActive] = useState<TabId>("firm");
  const [editSection, setEditSection] = useState<FirmModalSection | null>(null);
  const [firmId, setFirmId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<FirmWorkspaceData>({
    firm: null,
    identity: null,
    location: null,
    financial: null,
    financials: [],
    banking: null,
    bankings: [],
    experience: null,
    experiences: [],
    certification: null,
    certifications: [],
    exemptions: null,
    preferences: null,
    documents: [],
  });

  const resolveDocumentLabel = (documentId?: string | null) => {
    if (!documentId) return undefined;
    const match = data.documents.find((d) => d.id === documentId);
    if (!match) return documentId;
    return match.title || match.file.split("/").pop() || match.id;
  };

  const resolveDocumentUrl = (documentId?: string | null): string | undefined => {
    if (!documentId) return undefined;
    const match = data.documents.find((d) => d.id === documentId);
    return match?.file;
  };

  const resolveDocumentTypeLabel = (document: DocumentApi) => {
    if (document.doc_type !== "other") return document.doc_type;
    return document.other_doc_type || "other";
  };

  useEffect(() => { setEditSection(null); }, [active]);

  useEffect(() => {
    async function loadWorkspace() {
      setIsLoading(true);
      setError(null);
      try {
        const firmsResponse = await getFirms(1);
        const primaryFirm = firmsResponse.results[0];
        if (!primaryFirm) {
          setFirmId(null);
          setError("No firm found. Please complete onboarding first.");
          return;
        }
        setFirmId(primaryFirm.id);
        const [firm, identityResult, locationsResult, financialsResult, solvencyResult, experiencesResult, certificationsResult, exemptionsResult, preferencesResult, documentsResult] =
          await Promise.allSettled([
            getFirm(primaryFirm.id),
            getFirmIdentity(primaryFirm.id),
            getFirmLocations(primaryFirm.id, 1),
            getFirmFinancials(primaryFirm.id, 1),
            getFirmSolvencyCertificates(primaryFirm.id, 1),
            getFirmExperiences(primaryFirm.id, 1),
            getFirmCertifications(primaryFirm.id, 1),
            getFirmExemptions(primaryFirm.id),
            getFirmPreferences(primaryFirm.id),
            getFirmDocuments(primaryFirm.id, 1, 100),
          ]);
        setData({
          firm: firm.status === "fulfilled" ? firm.value : primaryFirm,
          identity: identityResult.status === "fulfilled" ? identityResult.value : null,
          location: locationsResult.status === "fulfilled" ? (locationsResult.value.results[0] ?? null) : null,
          financial: financialsResult.status === "fulfilled" ? (financialsResult.value.results[0] ?? null) : null,
          financials: financialsResult.status === "fulfilled" ? financialsResult.value.results : [],
          banking: solvencyResult.status === "fulfilled" ? (solvencyResult.value.results[0] ?? null) : null,
          bankings: solvencyResult.status === "fulfilled" ? solvencyResult.value.results : [],
          experience: experiencesResult.status === "fulfilled" ? (experiencesResult.value.results[0] ?? null) : null,
          experiences: experiencesResult.status === "fulfilled" ? experiencesResult.value.results : [],
          certification: certificationsResult.status === "fulfilled" ? (certificationsResult.value.results[0] ?? null) : null,
          certifications: certificationsResult.status === "fulfilled" ? certificationsResult.value.results : [],
          exemptions: exemptionsResult.status === "fulfilled" ? exemptionsResult.value : null,
          preferences: preferencesResult.status === "fulfilled" ? preferencesResult.value : null,
          documents: documentsResult.status === "fulfilled" ? documentsResult.value.results : [],
        });
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) {
          setError("Please login to view firm details.");
        } else {
          setError("Failed to load firm details.");
        }
      } finally {
        setIsLoading(false);
      }
    }
    void loadWorkspace();
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      {/* Header */}
      <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-widest text-navy-600">Firm</p>
        <h1 className="mt-1 text-xl font-bold text-ink-900">Profile workspace</h1>
        <p className="mt-1 text-sm text-ink-500">
          Legal profile, compliance identifiers, locations, financials, and bidding preferences.
        </p>
      </div>

      {isLoading && (
        <div className="rounded-xl border border-ink-200 bg-white p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-navy-600 border-t-transparent" aria-hidden />
            <p className="text-sm text-ink-500">Loading firm workspace…</p>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-danger-200 bg-danger-50 px-5 py-4 text-sm text-danger-700">
          {error}
        </div>
      )}

      {/* Summary cards */}
      {!isLoading && !error && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard title="Business name" value={data.firm?.business_name || "Not set"} icon={Building2} />
          <SummaryCard
            title="Firm status"
            value={data.firm ? (data.firm.is_active ? "Active" : "Inactive") : "Unknown"}
            icon={CheckSquare}
          />
          <SummaryCard
            title="Financial records"
            value={data.financials.length > 0 ? `${data.financials.length} entries` : "No entries"}
            icon={Landmark}
          />
          <SummaryCard
            title="Certifications"
            value={data.certifications.length > 0 ? `${data.certifications.length} certs` : "None"}
            icon={ShieldCheck}
          />
        </div>
      )}

      {/* Tab layout */}
      {!isLoading && (
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
          {/* Sidebar nav */}
          <nav
            aria-label="Firm sections"
            className="flex shrink-0 gap-1 overflow-x-auto rounded-2xl border border-ink-200 bg-white p-2 shadow-card xl:sticky xl:top-6 xl:w-56 xl:flex-col xl:overflow-visible"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                className={cn(
                  "whitespace-nowrap rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500",
                  active === tab.id
                    ? "bg-navy-600 text-white"
                    : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Tab content */}
          <div className="min-w-0 flex-1 space-y-5">
            <FirmEditModal
              section={editSection}
              onClose={() => setEditSection(null)}
              firmId={firmId}
              data={data}
              onSaved={(nextData) => {
                setData((prev) => {
                  if (nextData.experience) {
                    const exists = prev.experiences.some((i) => i.id === nextData.experience?.id);
                    const experiences = exists
                      ? prev.experiences.map((i) => (i.id === nextData.experience?.id ? nextData.experience! : i))
                      : [nextData.experience, ...prev.experiences];
                    return { ...prev, ...nextData, experiences };
                  }
                  if (nextData.financial) {
                    const exists = prev.financials.some((i) => i.id === nextData.financial?.id);
                    const financials = exists
                      ? prev.financials.map((i) => (i.id === nextData.financial?.id ? nextData.financial! : i))
                      : [nextData.financial, ...prev.financials];
                    return { ...prev, ...nextData, financials };
                  }
                  if (nextData.banking) {
                    const exists = prev.bankings.some((i) => i.id === nextData.banking?.id);
                    const bankings = exists
                      ? prev.bankings.map((i) => (i.id === nextData.banking?.id ? nextData.banking! : i))
                      : [nextData.banking, ...prev.bankings];
                    return { ...prev, ...nextData, bankings };
                  }
                  if (nextData.certification) {
                    const exists = prev.certifications.some((i) => i.id === nextData.certification?.id);
                    const certifications = exists
                      ? prev.certifications.map((i) => (i.id === nextData.certification?.id ? nextData.certification! : i))
                      : [nextData.certification, ...prev.certifications];
                    return { ...prev, ...nextData, certifications };
                  }
                  return { ...prev, ...nextData };
                });
              }}
            />

            {active === "firm" && (
              <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
                <SectionHeader title="Firm" onEdit={() => setEditSection("firm")} />
                <FieldGrid
                  rows={[
                    { label: "Owner", value: data.firm?.owner_username },
                    { label: "Legal name", value: data.firm?.legal_name },
                    { label: "Business name", value: data.firm?.business_name },
                    { label: "Constitution", value: data.firm?.constitution },
                    { label: "Incorporation date", value: data.firm?.incorporation_date ?? undefined },
                    { label: "Industry type", value: data.firm?.industry_type },
                    { label: "Scope of work", value: data.firm?.scope_of_work },
                    { label: "Active", value: data.firm ? (data.firm.is_active ? "Yes" : "No") : undefined },
                  ]}
                />
              </div>
            )}

            {active === "identity" && (
              <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
                <SectionHeader title="Firm identity" onEdit={() => setEditSection("identity")} />
                <FieldGrid
                  rows={[
                    { label: "PAN number", value: data.identity?.pan_number },
                    { label: "GSTIN", value: data.identity?.gstin },
                    { label: "CIN", value: data.identity?.cin },
                    { label: "Udyam number", value: data.identity?.udyam_number },
                    { label: "SAN / BRN", value: data.identity?.san_brn },
                    { label: "ESI number", value: data.identity?.esi_number },
                    { label: "PF code", value: data.identity?.pf_code },
                    { label: "Shop Act Reg. No.", value: data.identity?.shop_act_number },
                    { label: "DSC expiry date", value: data.identity?.dsc_expiry_date ?? undefined },
                  ]}
                />
              </div>
            )}

            {active === "locations" && (
              <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
                <SectionHeader title="Firm location" onEdit={() => setEditSection("locations")} />
                {data.location ? (
                  <FieldGrid
                    rows={[
                      { label: "Address line", value: data.location.address_line },
                      { label: "City", value: data.location.city },
                      { label: "State", value: data.location.state },
                      { label: "Pincode", value: data.location.pincode },
                      { label: "Primary", value: data.location.is_primary ? "Yes" : "No" },
                    ]}
                  />
                ) : (
                  <EmptyState entity="location" />
                )}
              </div>
            )}

            {active === "financials" && (
              <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
                <SectionHeader
                  title="Financials"
                  onEdit={() => { setData((prev) => ({ ...prev, financial: null })); setEditSection("financials"); }}
                  onAdd={() => { setData((prev) => ({ ...prev, financial: null })); setEditSection("financials"); }}
                />
                <p className="mb-4 text-sm text-ink-500">Per financial year: turnover and audit status.</p>
                {data.financials.length > 0 ? (
                  <div className="space-y-3">
                    {data.financials.map((financial) => (
                      <RecordCard
                        key={financial.id}
                        title={financial.financial_year || "Financial year"}
                        subtitle={`Turnover: ${fmt(financial.turnover_amount) ?? "—"}`}
                        onEdit={() => { setData((prev) => ({ ...prev, financial })); setEditSection("financials"); }}
                      >
                        <FieldGrid
                          rows={[
                            { label: "Turnover", value: fmt(financial.turnover_amount) },
                            { label: "Audited", value: financial.is_audited ? "Yes" : "No" },
                          ]}
                        />
                        {(() => {
                          const url = resolveDocumentUrl(financial.audit_document);
                          const label = resolveDocumentLabel(financial.audit_document);
                          return url ? (
                            <div className="mt-3 border-t border-ink-100 pt-3">
                              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-400">Audit document</p>
                              <a
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 transition-colors hover:bg-ink-50"
                              >
                                <Eye className="h-3.5 w-3.5" aria-hidden />
                                {label ?? "View document"}
                              </a>
                            </div>
                          ) : (
                            <p className="mt-2 text-xs text-ink-400">No audit document linked.</p>
                          );
                        })()}
                      </RecordCard>
                    ))}
                  </div>
                ) : (
                  <EmptyState entity="financial" />
                )}
              </div>
            )}

            {active === "banking" && (
              <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
                <SectionHeader
                  title="Banking & solvency"
                  onEdit={() => { setData((prev) => ({ ...prev, banking: null })); setEditSection("banking"); }}
                  onAdd={() => { setData((prev) => ({ ...prev, banking: null })); setEditSection("banking"); }}
                />
                {data.bankings.length > 0 ? (
                  <div className="space-y-3">
                    {data.bankings.map((banking) => (
                      <RecordCard
                        key={banking.id}
                        title={banking.bank_name || "Bank record"}
                        subtitle={`Solvency: ${fmt(banking.solvency_amount) ?? "—"}`}
                        onEdit={() => { setData((prev) => ({ ...prev, banking })); setEditSection("banking"); }}
                      >
                        <FieldGrid
                          rows={[
                            { label: "Issue date", value: banking.issue_date },
                            { label: "Expiry date", value: banking.expiry_date },
                          ]}
                        />
                      </RecordCard>
                    ))}
                  </div>
                ) : (
                  <EmptyState entity="banking / solvency" />
                )}
              </div>
            )}

            {active === "experience" && (
              <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
                <SectionHeader
                  title="Experience"
                  onEdit={() => { setData((prev) => ({ ...prev, experience: null })); setEditSection("experience"); }}
                  onAdd={() => { setData((prev) => ({ ...prev, experience: null })); setEditSection("experience"); }}
                />
                {data.experiences.length > 0 ? (
                  <div className="space-y-3">
                    {data.experiences.map((exp) => (
                      <RecordCard
                        key={exp.id}
                        title={exp.project_name || "Untitled project"}
                        subtitle={`Client: ${exp.client_name || "—"}`}
                        onEdit={() => { setData((prev) => ({ ...prev, experience: exp })); setEditSection("experience"); }}
                      >
                        <FieldGrid
                          rows={[
                            { label: "Work order value", value: fmt(exp.work_order_value) },
                            { label: "Start date", value: exp.start_date ?? undefined },
                            { label: "Status", value: exp.is_currently_working ? "Ongoing" : (exp.completion_date ? `Completed ${exp.completion_date}` : "Completed") },
                            { label: "Tags", value: exp.category_tags.join(", ") || undefined },
                          ]}
                        />
                      </RecordCard>
                    ))}
                  </div>
                ) : (
                  <EmptyState entity="experience" />
                )}
              </div>
            )}

            {active === "certifications" && (
              <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
                <SectionHeader
                  title="Certifications"
                  onEdit={() => { setData((prev) => ({ ...prev, certification: null })); setEditSection("certifications"); }}
                  onAdd={() => { setData((prev) => ({ ...prev, certification: null })); setEditSection("certifications"); }}
                />
                {data.certifications.length > 0 ? (
                  <div className="space-y-3">
                    {data.certifications.map((cert) => (
                      <RecordCard
                        key={cert.id}
                        title={cert.cert_type === "other" ? (cert.other_cert_type || "Other") : cert.cert_type}
                        subtitle={cert.cert_number ? `Cert no: ${cert.cert_number}` : undefined}
                        onEdit={() => { setData((prev) => ({ ...prev, certification: cert })); setEditSection("certifications"); }}
                      >
                        <FieldGrid
                          rows={[
                            { label: "Issue date", value: cert.issue_date ?? undefined },
                            { label: "Expiry date", value: cert.expiry_date ?? "Does not expire" },
                            { label: "Document", value: resolveDocumentLabel(cert.document) },
                          ]}
                        />
                      </RecordCard>
                    ))}
                  </div>
                ) : (
                  <EmptyState entity="certification" />
                )}
              </div>
            )}

            {active === "exemptions" && (
              <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
                <SectionHeader title="Exemptions" onEdit={() => setEditSection("exemptions")} />
                <FieldGrid
                  rows={[
                    { label: "EMD waiver eligible", value: data.exemptions ? (data.exemptions.eligible_for_emd_waiver ? "Yes" : "No") : undefined },
                    { label: "Experience waiver eligible", value: data.exemptions ? (data.exemptions.eligible_for_exp_waiver ? "Yes" : "No") : undefined },
                    { label: "Local preference state", value: data.exemptions?.local_preference_state },
                  ]}
                />
              </div>
            )}

            {active === "preferences" && (
              <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
                <SectionHeader title="Preferences" onEdit={() => setEditSection("preferences")} />
                <FieldGrid
                  rows={[
                    { label: "Preferred regions", value: data.preferences?.preferred_regions?.join(", ") },
                    { label: "Target sectors", value: data.preferences?.target_sectors?.join(", ") },
                    { label: "Excluded departments", value: data.preferences?.excluded_depts?.join(", ") },
                    { label: "Min tender value", value: fmt(data.preferences?.min_tender_value) },
                    { label: "Max tender value", value: fmt(data.preferences?.max_tender_value) },
                  ]}
                />
              </div>
            )}

            {active === "documents" && (
              <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
                <div className="mb-5 border-b border-ink-100 pb-4">
                  <h3 className="text-base font-semibold text-ink-900">Firm documents</h3>
                  <p className="mt-0.5 text-sm text-ink-500">All uploaded files in your document vault.</p>
                </div>
                {data.documents.length > 0 ? (
                  <div className="space-y-2">
                    {data.documents.map((document) => {
                      const fileName = document.file.split("/").pop() || document.id;
                      return (
                        <div key={document.id} className="rounded-xl border border-ink-200 bg-ink-50/50 p-4">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0 space-y-0.5">
                              <p className="truncate text-sm font-semibold text-ink-900">{document.title || fileName}</p>
                              <p className="text-xs text-ink-400">Type: {resolveDocumentTypeLabel(document)}</p>
                            </div>
                            <a
                              href={document.file}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex w-fit shrink-0 items-center rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 transition-colors hover:bg-ink-50"
                            >
                              Open file
                            </a>
                          </div>
                          <p className="mt-2 text-xs text-ink-400">Created {formatDateTime(document.created_at)}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState entity="document" />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
