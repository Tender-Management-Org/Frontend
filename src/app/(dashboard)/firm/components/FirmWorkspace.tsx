"use client";

import { Pencil } from "lucide-react";
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
  banking: FirmBankingSolvencyApi | null;
  experience: FirmExperienceApi | null;
  certification: FirmCertificationApi | null;
  exemptions: FirmExemptionsApi | null;
  preferences: FirmPreferencesApi | null;
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
    <p className="text-sm text-slate-500">
      No {entity} records yet. Data will appear here once connected to your account.
    </p>
  );
}

function SectionHeader({ title, onEdit }: { title: string; onEdit: () => void }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <button
        type="button"
        onClick={onEdit}
        aria-label={`Edit ${title}`}
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      >
        <Pencil className="h-4 w-4" aria-hidden />
      </button>
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
    banking: null,
    experience: null,
    certification: null,
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
          banking: solvencyResult.status === "fulfilled" ? (solvencyResult.value.results[0] ?? null) : null,
          experience: experiencesResult.status === "fulfilled" ? (experiencesResult.value.results[0] ?? null) : null,
          certification:
            certificationsResult.status === "fulfilled" ? (certificationsResult.value.results[0] ?? null) : null,
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Firm</h2>
        <p className="text-sm text-slate-500">
          Legal profile, compliance identifiers, locations, financials, and bidding preferences.
        </p>
      </div>

      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <nav
          aria-label="Firm sections"
          className="flex shrink-0 gap-1 overflow-x-auto rounded-lg border border-border bg-slate-50/80 p-1 lg:w-52 lg:flex-col lg:overflow-visible"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
                active === tab.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
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
              setData((prev) => ({ ...prev, ...nextData }));
            }}
          />

          {active === "firm" && (
            <Card>
              <SectionHeader title="Firm" onEdit={() => setEditSection("firm")} />
              <FieldGrid
                rows={[
                  { label: "ID", value: data.firm?.id },
                  { label: "Owner", value: data.firm?.owner ? String(data.firm.owner) : undefined },
                  { label: "Legal name", value: data.firm?.legal_name },
                  { label: "Business name", value: data.firm?.business_name },
                  { label: "Constitution", value: data.firm?.constitution },
                  { label: "Incorporation date", value: data.firm?.incorporation_date ?? undefined },
                  { label: "Industry type", value: data.firm?.industry_type },
                  { label: "Scope of work", value: data.firm?.scope_of_work },
                  { label: "Active", value: data.firm ? (data.firm.is_active ? "Yes" : "No") : undefined },
                  { label: "Created at", value: data.firm?.created_at },
                  { label: "Updated at", value: data.firm?.updated_at },
                ]}
              />
            </Card>
          )}

          {active === "identity" && (
            <Card>
              <SectionHeader title="Firm identity" onEdit={() => setEditSection("identity")} />
              <FieldGrid
                rows={[
                  { label: "Firm", value: data.identity?.firm },
                  { label: "PAN number", value: data.identity?.pan_number },
                  { label: "GSTIN", value: data.identity?.gstin },
                  { label: "CIN", value: data.identity?.cin },
                  { label: "Udyam number", value: data.identity?.udyam_number },
                  { label: "DSC expiry date", value: data.identity?.dsc_expiry_date ?? undefined },
                  { label: "Created at", value: data.identity?.created_at },
                  { label: "Updated at", value: data.identity?.updated_at },
                ]}
              />
            </Card>
          )}

          {active === "locations" && (
            <Card>
              <SectionHeader title="Firm locations" onEdit={() => setEditSection("locations")} />
              {data.location ? (
                <FieldGrid
                  rows={[
                    { label: "Address line", value: data.location.address_line },
                    { label: "City", value: data.location.city },
                    { label: "State", value: data.location.state },
                    { label: "Pincode", value: data.location.pincode },
                    { label: "Primary", value: data.location.is_primary ? "Yes" : "No" },
                    { label: "Created at", value: data.location.created_at },
                    { label: "Updated at", value: data.location.updated_at },
                  ]}
                />
              ) : (
                <EmptyTableHint entity="location" />
              )}
            </Card>
          )}

          {active === "financials" && (
            <Card>
              <SectionHeader title="Firm financials" onEdit={() => setEditSection("financials")} />
              <p className="mb-4 text-sm text-slate-600">
                Per financial year: turnover, net worth, profit after tax, audit status, and linked audit document.
              </p>
              {data.financial ? (
                <FieldGrid
                  rows={[
                    { label: "Financial year", value: data.financial.financial_year },
                    { label: "Turnover amount", value: String(data.financial.turnover_amount) },
                    { label: "Net worth", value: data.financial.net_worth != null ? String(data.financial.net_worth) : undefined },
                    {
                      label: "Profit after tax",
                      value: data.financial.profit_after_tax != null ? String(data.financial.profit_after_tax) : undefined,
                    },
                    { label: "Audited", value: data.financial.is_audited ? "Yes" : "No" },
                    { label: "Audit document", value: data.financial.audit_document ?? undefined },
                    { label: "Created at", value: data.financial.created_at },
                    { label: "Updated at", value: data.financial.updated_at },
                  ]}
                />
              ) : (
                <EmptyTableHint entity="financial" />
              )}
            </Card>
          )}

          {active === "banking" && (
            <Card>
              <SectionHeader title="Banking & solvency" onEdit={() => setEditSection("banking")} />
              {data.banking ? (
                <FieldGrid
                  rows={[
                    { label: "Bank name", value: data.banking.bank_name },
                    { label: "Solvency amount", value: String(data.banking.solvency_amount) },
                    { label: "Issue date", value: data.banking.issue_date },
                    { label: "Expiry date", value: data.banking.expiry_date },
                    { label: "Created at", value: data.banking.created_at },
                    { label: "Updated at", value: data.banking.updated_at },
                  ]}
                />
              ) : (
                <EmptyTableHint entity="banking / solvency" />
              )}
            </Card>
          )}

          {active === "experience" && (
            <Card>
              <SectionHeader title="Firm experience" onEdit={() => setEditSection("experience")} />
              {data.experience ? (
                <FieldGrid
                  rows={[
                    { label: "Project name", value: data.experience.project_name },
                    { label: "Client name", value: data.experience.client_name },
                    { label: "Work order value", value: String(data.experience.work_order_value) },
                    { label: "Start date", value: data.experience.start_date ?? undefined },
                    { label: "Completion date", value: data.experience.completion_date ?? undefined },
                    { label: "Tags", value: data.experience.category_tags.join(", ") },
                    { label: "Created at", value: data.experience.created_at },
                    { label: "Updated at", value: data.experience.updated_at },
                  ]}
                />
              ) : (
                <EmptyTableHint entity="experience" />
              )}
            </Card>
          )}

          {active === "certifications" && (
            <Card>
              <SectionHeader title="Firm certifications" onEdit={() => setEditSection("certifications")} />
              <p className="mb-4 text-sm text-slate-600">
                May link to an experience record for past-work certificates.
              </p>
              {data.certification ? (
                <FieldGrid
                  rows={[
                    { label: "Certificate type", value: data.certification.cert_type },
                    { label: "Other type", value: data.certification.other_cert_type },
                    { label: "Certificate number", value: data.certification.cert_number },
                    { label: "Rating", value: data.certification.rating_level },
                    { label: "Issue date", value: data.certification.issue_date ?? undefined },
                    { label: "Expiry date", value: data.certification.expiry_date ?? undefined },
                    { label: "Linked experience", value: data.certification.experience ?? undefined },
                    { label: "Document", value: data.certification.document ?? undefined },
                    { label: "Created at", value: data.certification.created_at },
                    { label: "Updated at", value: data.certification.updated_at },
                  ]}
                />
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
                  { label: "Firm", value: data.exemptions?.firm },
                  {
                    label: "Eligible for EMD waiver",
                    value: data.exemptions ? (data.exemptions.eligible_for_emd_waiver ? "Yes" : "No") : undefined,
                  },
                  {
                    label: "Eligible for experience waiver",
                    value: data.exemptions ? (data.exemptions.eligible_for_exp_waiver ? "Yes" : "No") : undefined,
                  },
                  { label: "Local preference state", value: data.exemptions?.local_preference_state },
                  { label: "Updated at", value: data.exemptions?.updated_at },
                ]}
              />
            </Card>
          )}

          {active === "preferences" && (
            <Card>
              <SectionHeader title="Firm preferences" onEdit={() => setEditSection("preferences")} />
              <FieldGrid
                rows={[
                  { label: "Firm", value: data.preferences?.firm },
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
                  { label: "Updated at", value: data.preferences?.updated_at },
                ]}
              />
            </Card>
          )}
        </div>
      </div>
      {isLoading && <p className="text-sm text-slate-500">Loading firm workspace...</p>}
    </div>
  );
}
