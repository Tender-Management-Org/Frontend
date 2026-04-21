"use client";

import { Building2, Landmark, MapPin, Pencil, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
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
import { cn } from "@/lib/utils";
import { FirmEditModal, type FirmModalSection } from "./FirmEditModal";

const tabs: { id: FirmModalSection; label: string }[] = [
  { id: "firm", label: "Firm" },
  { id: "identity", label: "Identity" },
  { id: "locations", label: "Locations" },
  { id: "financials", label: "Financials" },
  { id: "banking", label: "Banking & solvency" },
  { id: "experience", label: "Experience" },
  { id: "certifications", label: "Certifications" },
  { id: "exemptions", label: "Exemptions" },
  { id: "preferences", label: "Preferences" }
];

type TabId = FirmModalSection;

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
}

function formatDateTime(value?: string | null) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function FieldGrid({ rows }: { rows: { label: string; value?: string }[] }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label} className="space-y-1">
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{row.label}</dt>
          <dd className="text-sm text-slate-900">{row.value ?? "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

function EmptyTableHint({ entity }: { entity: string }) {
  return (
    <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
      No {entity} records yet. Data will appear here once connected to your account.
    </p>
  );
}

function SectionHeader({ title, onEdit }: { title: string; onEdit: () => void }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <button
        type="button"
        onClick={onEdit}
        aria-label={`Edit ${title}`}
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      >
        <Pencil className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

function SummaryCard({ title, value, icon: Icon }: { title: string; value: string; icon: typeof Building2 }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/5">
      <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
        <Icon className="h-4 w-4" aria-hidden />
      </div>
      <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
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
  });

  useEffect(() => {
    setEditSection(null);
  }, [active]);

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

        const [
          firm,
          identityResult,
          locationsResult,
          financialsResult,
          solvencyResult,
          experiencesResult,
          certificationsResult,
          exemptionsResult,
          preferencesResult,
        ] = await Promise.allSettled([
          getFirm(primaryFirm.id),
          getFirmIdentity(primaryFirm.id),
          getFirmLocations(primaryFirm.id, 1),
          getFirmFinancials(primaryFirm.id, 1),
          getFirmSolvencyCertificates(primaryFirm.id, 1),
          getFirmExperiences(primaryFirm.id, 1),
          getFirmCertifications(primaryFirm.id, 1),
          getFirmExemptions(primaryFirm.id),
          getFirmPreferences(primaryFirm.id),
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
          certification:
            certificationsResult.status === "fulfilled" ? (certificationsResult.value.results[0] ?? null) : null,
          certifications: certificationsResult.status === "fulfilled" ? certificationsResult.value.results : [],
          exemptions: exemptionsResult.status === "fulfilled" ? exemptionsResult.value : null,
          preferences: preferencesResult.status === "fulfilled" ? preferencesResult.value : null,
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
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Profile workspace</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Firm</h2>
        <p className="mt-2 text-sm text-slate-500">
          Legal profile, compliance identifiers, locations, financials, and bidding preferences.
        </p>
      </div>

      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Business name" value={data.firm?.business_name || "Not set"} icon={Building2} />
        <SummaryCard
          title="Firm status"
          value={data.firm ? (data.firm.is_active ? "Active" : "Inactive") : "Unknown"}
          icon={MapPin}
        />
        <SummaryCard
          title="Financial records"
          value={data.financials.length > 0 ? `${data.financials.length} entries` : "No entries"}
          icon={Landmark}
        />
        <SummaryCard
          title="Certifications"
          value={data.certifications.length > 0 ? `${data.certifications.length} certificates` : "No certificates"}
          icon={ShieldCheck}
        />
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
        <nav
          aria-label="Firm sections"
          className="flex shrink-0 gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm shadow-slate-900/5 xl:sticky xl:top-24 xl:w-60 xl:flex-col xl:overflow-visible"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={cn(
                "whitespace-nowrap rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                active === tab.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1 space-y-6">
          <FirmEditModal
            section={editSection}
            onClose={() => setEditSection(null)}
            firmId={firmId}
            data={data}
            onSaved={(nextData) => {
              setData((prev) => {
                if (nextData.experience) {
                  const exists = prev.experiences.some((item) => item.id === nextData.experience?.id);
                  const experiences = exists
                    ? prev.experiences.map((item) => (item.id === nextData.experience?.id ? nextData.experience! : item))
                    : [nextData.experience, ...prev.experiences];
                  return { ...prev, ...nextData, experiences };
                }
                if (nextData.financial) {
                  const exists = prev.financials.some((item) => item.id === nextData.financial?.id);
                  const financials = exists
                    ? prev.financials.map((item) => (item.id === nextData.financial?.id ? nextData.financial! : item))
                    : [nextData.financial, ...prev.financials];
                  return { ...prev, ...nextData, financials };
                }
                if (nextData.banking) {
                  const exists = prev.bankings.some((item) => item.id === nextData.banking?.id);
                  const bankings = exists
                    ? prev.bankings.map((item) => (item.id === nextData.banking?.id ? nextData.banking! : item))
                    : [nextData.banking, ...prev.bankings];
                  return { ...prev, ...nextData, bankings };
                }
                if (nextData.certification) {
                  const exists = prev.certifications.some((item) => item.id === nextData.certification?.id);
                  const certifications = exists
                    ? prev.certifications.map((item) =>
                        item.id === nextData.certification?.id ? nextData.certification! : item
                      )
                    : [nextData.certification, ...prev.certifications];
                  return { ...prev, ...nextData, certifications };
                }
                return { ...prev, ...nextData };
              });
            }}
          />

          {active === "firm" && (
            <Card>
              <SectionHeader title="Firm" onEdit={() => setEditSection("firm")} />
              <FieldGrid
                rows={[
                  { label: "ID", value: data.firm?.id },
                  {
                    label: "Owner",
                    value: data.firm?.owner_username ?? (data.firm?.owner ? String(data.firm.owner) : undefined),
                  },
                  { label: "Legal name", value: data.firm?.legal_name },
                  { label: "Business name", value: data.firm?.business_name },
                  { label: "Constitution", value: data.firm?.constitution },
                  { label: "Incorporation date", value: data.firm?.incorporation_date ?? undefined },
                  { label: "Industry type", value: data.firm?.industry_type },
                  { label: "Scope of work", value: data.firm?.scope_of_work },
                  { label: "Active", value: data.firm ? (data.firm.is_active ? "Yes" : "No") : undefined },
                  { label: "Created at", value: formatDateTime(data.firm?.created_at) },
                  { label: "Updated at", value: formatDateTime(data.firm?.updated_at) },
                ]}
              />
            </Card>
          )}

          {active === "identity" && (
            <Card>
              <SectionHeader title="Firm identity" onEdit={() => setEditSection("identity")} />
              <FieldGrid
                rows={[
                  { label: "PAN number", value: data.identity?.pan_number },
                  { label: "GSTIN", value: data.identity?.gstin },
                  { label: "CIN", value: data.identity?.cin },
                  { label: "Udyam number", value: data.identity?.udyam_number },
                  { label: "DSC expiry date", value: data.identity?.dsc_expiry_date ?? undefined },
                  { label: "Created at", value: formatDateTime(data.identity?.created_at) },
                  { label: "Updated at", value: formatDateTime(data.identity?.updated_at) },
                ]}
              />
            </Card>
          )}

          {active === "locations" && (
            <Card>
              <SectionHeader title="Firm location" onEdit={() => setEditSection("locations")} />
              {data.location ? (
                <FieldGrid
                  rows={[
                    { label: "Address line", value: data.location.address_line },
                    { label: "City", value: data.location.city },
                    { label: "State", value: data.location.state },
                    { label: "Pincode", value: data.location.pincode },
                    { label: "Primary", value: data.location.is_primary ? "Yes" : "No" },
                    { label: "Created at", value: formatDateTime(data.location.created_at) },
                    { label: "Updated at", value: formatDateTime(data.location.updated_at) },
                  ]}
                />
              ) : (
                <EmptyTableHint entity="location" />
              )}
            </Card>
          )}

          {active === "financials" && (
            <Card>
              <SectionHeader
                title="Firm financials"
                onEdit={() => {
                  setData((prev) => ({ ...prev, financial: null }));
                  setEditSection("financials");
                }}
              />
              <p className="mb-4 text-sm text-slate-600">
                Per financial year: turnover, net worth, profit after tax, audit status, and linked audit document.
              </p>
              {data.financials.length > 0 ? (
                <div className="space-y-4">
                  {data.financials.map((financial) => (
                    <div key={financial.id} className="rounded-xl border border-slate-200 bg-slate-50/40 p-4">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900">{financial.financial_year || "Financial year"}</h4>
                          <p className="text-xs text-slate-500">Turnover: {String(financial.turnover_amount)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setData((prev) => ({ ...prev, financial }));
                            setEditSection("financials");
                          }}
                          aria-label={`Edit financial ${financial.financial_year || financial.id}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100"
                        >
                          <Pencil className="h-4 w-4" aria-hidden />
                        </button>
                      </div>
                      <FieldGrid
                        rows={[
                          { label: "Net worth", value: financial.net_worth != null ? String(financial.net_worth) : undefined },
                          {
                            label: "Profit after tax",
                            value: financial.profit_after_tax != null ? String(financial.profit_after_tax) : undefined,
                          },
                          { label: "Audited", value: financial.is_audited ? "Yes" : "No" },
                          { label: "Audit document", value: financial.audit_document ?? undefined },
                          { label: "Created at", value: formatDateTime(financial.created_at) },
                          { label: "Updated at", value: formatDateTime(financial.updated_at) },
                        ]}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyTableHint entity="financial" />
              )}
            </Card>
          )}

          {active === "banking" && (
            <Card>
              <SectionHeader
                title="Banking & solvency"
                onEdit={() => {
                  setData((prev) => ({ ...prev, banking: null }));
                  setEditSection("banking");
                }}
              />
              {data.bankings.length > 0 ? (
                <div className="space-y-4">
                  {data.bankings.map((banking) => (
                    <div key={banking.id} className="rounded-xl border border-slate-200 bg-slate-50/40 p-4">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900">{banking.bank_name || "Bank record"}</h4>
                          <p className="text-xs text-slate-500">Solvency: {String(banking.solvency_amount)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setData((prev) => ({ ...prev, banking }));
                            setEditSection("banking");
                          }}
                          aria-label={`Edit banking ${banking.bank_name || banking.id}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100"
                        >
                          <Pencil className="h-4 w-4" aria-hidden />
                        </button>
                      </div>
                      <FieldGrid
                        rows={[
                          { label: "Issue date", value: banking.issue_date },
                          { label: "Expiry date", value: banking.expiry_date },
                          { label: "Created at", value: formatDateTime(banking.created_at) },
                          { label: "Updated at", value: formatDateTime(banking.updated_at) },
                        ]}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyTableHint entity="banking / solvency" />
              )}
            </Card>
          )}

          {active === "experience" && (
            <Card>
              <SectionHeader
                title="Firm experience"
                onEdit={() => {
                  setData((prev) => ({ ...prev, experience: null }));
                  setEditSection("experience");
                }}
              />
              {data.experiences.length > 0 ? (
                <div className="space-y-4">
                  {data.experiences.map((experience) => (
                    <div key={experience.id} className="rounded-xl border border-slate-200 bg-slate-50/40 p-4">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900">{experience.project_name || "Untitled project"}</h4>
                          <p className="text-xs text-slate-500">Client: {experience.client_name || "—"}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setData((prev) => ({ ...prev, experience }));
                            setEditSection("experience");
                          }}
                          aria-label={`Edit experience ${experience.project_name || experience.id}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100"
                        >
                          <Pencil className="h-4 w-4" aria-hidden />
                        </button>
                      </div>
                      <FieldGrid
                        rows={[
                          { label: "Work order value", value: String(experience.work_order_value) },
                          { label: "Start date", value: experience.start_date ?? undefined },
                          { label: "Completion date", value: experience.completion_date ?? undefined },
                          { label: "Tags", value: experience.category_tags.join(", ") || undefined },
                          { label: "Created at", value: formatDateTime(experience.created_at) },
                          { label: "Updated at", value: formatDateTime(experience.updated_at) },
                        ]}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyTableHint entity="experience" />
              )}
            </Card>
          )}

          {active === "certifications" && (
            <Card>
              <SectionHeader
                title="Firm certifications"
                onEdit={() => {
                  setData((prev) => ({ ...prev, certification: null }));
                  setEditSection("certifications");
                }}
              />
              <p className="mb-4 text-sm text-slate-600">
                May link to an experience record for past-work certificates.
              </p>
              {data.certifications.length > 0 ? (
                <div className="space-y-4">
                  {data.certifications.map((certification) => (
                    <div key={certification.id} className="rounded-xl border border-slate-200 bg-slate-50/40 p-4">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900">{certification.cert_type}</h4>
                          <p className="text-xs text-slate-500">Certificate no: {certification.cert_number || "—"}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setData((prev) => ({ ...prev, certification }));
                            setEditSection("certifications");
                          }}
                          aria-label={`Edit certification ${certification.cert_number || certification.id}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100"
                        >
                          <Pencil className="h-4 w-4" aria-hidden />
                        </button>
                      </div>
                      <FieldGrid
                        rows={[
                          { label: "Other type", value: certification.other_cert_type || undefined },
                          { label: "Rating", value: certification.rating_level || undefined },
                          { label: "Issue date", value: certification.issue_date ?? undefined },
                          { label: "Expiry date", value: certification.expiry_date ?? undefined },
                          { label: "Linked experience", value: certification.experience ?? undefined },
                          { label: "Document", value: certification.document ?? undefined },
                          { label: "Created at", value: formatDateTime(certification.created_at) },
                          { label: "Updated at", value: formatDateTime(certification.updated_at) },
                        ]}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyTableHint entity="certification" />
              )}
            </Card>
          )}

          {active === "exemptions" && (
            <Card>
              <SectionHeader title="Firm exemptions log" onEdit={() => setEditSection("exemptions")} />
              <FieldGrid
                rows={[
                  {
                    label: "Eligible for EMD waiver",
                    value: data.exemptions ? (data.exemptions.eligible_for_emd_waiver ? "Yes" : "No") : undefined,
                  },
                  {
                    label: "Eligible for experience waiver",
                    value: data.exemptions ? (data.exemptions.eligible_for_exp_waiver ? "Yes" : "No") : undefined,
                  },
                  { label: "Local preference state", value: data.exemptions?.local_preference_state },
                  { label: "Updated at", value: formatDateTime(data.exemptions?.updated_at) },
                ]}
              />
            </Card>
          )}

          {active === "preferences" && (
            <Card>
              <SectionHeader title="Firm preferences" onEdit={() => setEditSection("preferences")} />
              <FieldGrid
                rows={[
                  { label: "Preferred regions", value: data.preferences?.preferred_regions?.join(", ") },
                  { label: "Target sectors", value: data.preferences?.target_sectors?.join(", ") },
                  { label: "Excluded departments", value: data.preferences?.excluded_depts?.join(", ") },
                  {
                    label: "Min tender value",
                    value: data.preferences?.min_tender_value != null ? String(data.preferences.min_tender_value) : undefined,
                  },
                  {
                    label: "Max tender value",
                    value: data.preferences?.max_tender_value != null ? String(data.preferences.max_tender_value) : undefined,
                  },
                  { label: "Updated at", value: formatDateTime(data.preferences?.updated_at) },
                ]}
              />
            </Card>
          )}
        </div>
      </div>
      {isLoading && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
          Loading firm workspace...
        </div>
      )}
    </div>
  );
}
