"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ApiError } from "@/lib/api/client";
import {
  createFirmCertification,
  createFirmExperience,
  createFirmFinancial,
  createFirmLocation,
  createFirmSolvencyCertificate,
  updateFirm,
  updateFirmCertification,
  updateFirmExperience,
  updateFirmFinancial,
  updateFirmLocation,
  updateFirmSolvencyCertificate,
  upsertFirmExemptions,
  upsertFirmIdentity,
  upsertFirmPreferences,
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

const selectClass =
  "h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300";

const textareaClass =
  "min-h-[88px] w-full resize-y rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300";

export type FirmModalSection =
  | "firm"
  | "identity"
  | "locations"
  | "financials"
  | "banking"
  | "experience"
  | "certifications"
  | "exemptions"
  | "preferences";

const sectionTitles: Record<FirmModalSection, string> = {
  firm: "Edit firm",
  identity: "Edit firm identity",
  locations: "Edit location",
  financials: "Edit financials",
  banking: "Edit banking & solvency",
  experience: "Edit experience",
  certifications: "Edit certification",
  exemptions: "Edit exemptions",
  preferences: "Edit preferences"
};

interface FirmEditModalProps {
  section: FirmModalSection | null;
  onClose: () => void;
  firmId: string | null;
  data: {
    firm: FirmApi | null;
    identity: FirmIdentityApi | null;
    location: FirmLocationApi | null;
    financial: FirmFinancialApi | null;
    banking: FirmBankingSolvencyApi | null;
    experience: FirmExperienceApi | null;
    certification: FirmCertificationApi | null;
    exemptions: FirmExemptionsApi | null;
    preferences: FirmPreferencesApi | null;
  };
  onSaved: (data: {
    firm?: FirmApi;
    identity?: FirmIdentityApi;
    location?: FirmLocationApi;
    financial?: FirmFinancialApi;
    banking?: FirmBankingSolvencyApi;
    experience?: FirmExperienceApi;
    certification?: FirmCertificationApi;
    exemptions?: FirmExemptionsApi;
    preferences?: FirmPreferencesApi;
  }) => void;
}

function asBool(value: FormDataEntryValue | null) {
  return String(value) === "true";
}

function asOptionalString(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str || null;
}

function asOptionalNumber(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  if (!str) return null;
  const num = Number(str);
  return Number.isFinite(num) ? num : null;
}

function parseListInput(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return [];
  if (raw.startsWith("[")) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      // Fall back to comma-separated parsing.
    }
  }
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function FirmEditModal({ section, onClose, firmId, data, onSaved }: FirmEditModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!section) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [section, onClose]);

  useEffect(() => {
    if (!section) return;
    setError(null);
  }, [section]);

  if (!section) return null;

  const title = sectionTitles[section];
  const canSave = !!firmId;
  const isEditMode = (() => {
    if (section === "firm") return !!data.firm;
    if (section === "identity") return !!data.identity;
    if (section === "locations") return !!data.location;
    if (section === "financials") return !!data.financial;
    if (section === "banking") return !!data.banking;
    if (section === "experience") return !!data.experience;
    if (section === "certifications") return !!data.certification;
    if (section === "exemptions") return !!data.exemptions;
    return !!data.preferences;
  })();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="firm-edit-modal-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <h3 id="firm-edit-modal-title" className="text-lg font-semibold text-slate-900">
            {title}
          </h3>
          <p className="text-sm text-slate-500">
            {isEditMode ? "Update this section and save changes to backend." : "Create this section in backend."}
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!firmId) {
              setError("No firm selected. Complete onboarding first.");
              return;
            }

            setIsSaving(true);
            setError(null);
            try {
              const formData = new FormData(e.currentTarget);
              if (section === "firm") {
                const saved = await updateFirm(firmId, {
                  legal_name: String(formData.get("legal_name") ?? "").trim(),
                  business_name: String(formData.get("business_name") ?? "").trim(),
                  constitution: String(formData.get("constitution") ?? "").trim(),
                  incorporation_date: asOptionalString(formData.get("incorporation_date")),
                  industry_type: String(formData.get("industry_type") ?? "").trim(),
                  scope_of_work: String(formData.get("scope_of_work") ?? "").trim(),
                  is_active: asBool(formData.get("is_active")),
                });
                onSaved({ firm: saved });
              } else if (section === "identity") {
                const saved = await upsertFirmIdentity(firmId, {
                  pan_number: String(formData.get("pan_number") ?? "").trim(),
                  gstin: String(formData.get("gstin") ?? "").trim(),
                  cin: String(formData.get("cin") ?? "").trim(),
                  udyam_number: String(formData.get("udyam_number") ?? "").trim(),
                  dsc_expiry_date: asOptionalString(formData.get("dsc_expiry_date")),
                });
                onSaved({ identity: saved });
              } else if (section === "locations") {
                const payload = {
                  address_line: String(formData.get("address_line") ?? "").trim(),
                  city: String(formData.get("city") ?? "").trim(),
                  state: String(formData.get("state") ?? "").trim(),
                  pincode: String(formData.get("pincode") ?? "").trim(),
                  is_primary: asBool(formData.get("is_primary")),
                };
                const saved = data.location
                  ? await updateFirmLocation(firmId, data.location.id, payload)
                  : await createFirmLocation(firmId, payload);
                onSaved({ location: saved });
              } else if (section === "financials") {
                const payload = {
                  financial_year: String(formData.get("financial_year") ?? "").trim(),
                  turnover_amount: asOptionalNumber(formData.get("turnover_amount")) ?? undefined,
                  net_worth: asOptionalNumber(formData.get("net_worth")),
                  profit_after_tax: asOptionalNumber(formData.get("profit_after_tax")),
                  is_audited: asBool(formData.get("is_audited")),
                  audit_document: asOptionalString(formData.get("audit_document")),
                };
                const saved = data.financial
                  ? await updateFirmFinancial(firmId, data.financial.id, payload)
                  : await createFirmFinancial(firmId, payload);
                onSaved({ financial: saved });
              } else if (section === "banking") {
                const payload = {
                  bank_name: String(formData.get("bank_name") ?? "").trim(),
                  solvency_amount: asOptionalNumber(formData.get("solvency_amount")) ?? undefined,
                  issue_date: asOptionalString(formData.get("issue_date")) ?? undefined,
                  expiry_date: asOptionalString(formData.get("expiry_date")) ?? undefined,
                };
                const saved = data.banking
                  ? await updateFirmSolvencyCertificate(firmId, data.banking.id, payload)
                  : await createFirmSolvencyCertificate(firmId, payload);
                onSaved({ banking: saved });
              } else if (section === "experience") {
                const payload = {
                  project_name: String(formData.get("project_name") ?? "").trim(),
                  project_description: String(formData.get("project_description") ?? "").trim(),
                  client_name: String(formData.get("client_name") ?? "").trim(),
                  work_order_value: asOptionalNumber(formData.get("work_order_value")) ?? undefined,
                  start_date: asOptionalString(formData.get("start_date")),
                  completion_date: asOptionalString(formData.get("completion_date")),
                  category_tags: parseListInput(formData.get("category_tags")),
                };
                const saved = data.experience
                  ? await updateFirmExperience(firmId, data.experience.id, payload)
                  : await createFirmExperience(firmId, payload);
                onSaved({ experience: saved });
              } else if (section === "certifications") {
                const payload = {
                  experience: asOptionalString(formData.get("experience")),
                  cert_type: String(formData.get("cert_type") ?? "msme").trim(),
                  other_cert_type: String(formData.get("other_cert_type") ?? "").trim(),
                  cert_number: String(formData.get("cert_number") ?? "").trim(),
                  rating_level: String(formData.get("rating_level") ?? "").trim(),
                  issue_date: asOptionalString(formData.get("issue_date")),
                  expiry_date: asOptionalString(formData.get("expiry_date")),
                  document: asOptionalString(formData.get("document")),
                };
                const saved = data.certification
                  ? await updateFirmCertification(firmId, data.certification.id, payload)
                  : await createFirmCertification(firmId, payload);
                onSaved({ certification: saved });
              } else if (section === "exemptions") {
                const saved = await upsertFirmExemptions(firmId, {
                  eligible_for_emd_waiver: asBool(formData.get("eligible_for_emd_waiver")),
                  eligible_for_exp_waiver: asBool(formData.get("eligible_for_exp_waiver")),
                  local_preference_state: String(formData.get("local_preference_state") ?? "").trim(),
                });
                onSaved({ exemptions: saved });
              } else if (section === "preferences") {
                const saved = await upsertFirmPreferences(firmId, {
                  preferred_regions: parseListInput(formData.get("preferred_regions")),
                  target_sectors: parseListInput(formData.get("target_sectors")),
                  excluded_depts: parseListInput(formData.get("excluded_depts")),
                  min_tender_value: asOptionalNumber(formData.get("min_tender_value")),
                  max_tender_value: asOptionalNumber(formData.get("max_tender_value")),
                });
                onSaved({ preferences: saved });
              }
              onClose();
            } catch (e) {
              if (e instanceof ApiError) {
                setError(`Failed to save (${e.status}). Check entered values.`);
              } else {
                setError("Failed to save changes.");
              }
            } finally {
              setIsSaving(false);
            }
          }}
        >
          {section === "firm" && <FirmFormFields firm={data.firm} />}
          {section === "identity" && <IdentityFormFields identity={data.identity} />}
          {section === "locations" && <LocationFormFields location={data.location} />}
          {section === "financials" && <FinancialsFormFields financial={data.financial} />}
          {section === "banking" && <BankingFormFields banking={data.banking} />}
          {section === "experience" && <ExperienceFormFields experience={data.experience} />}
          {section === "certifications" && (
            <CertificationFormFields certification={data.certification} />
          )}
          {section === "exemptions" && <ExemptionsFormFields exemptions={data.exemptions} />}
          {section === "preferences" && <PreferencesFormFields preferences={data.preferences} />}

          {error && <p className="rounded-md border border-rose-200 bg-rose-50 p-2 text-sm text-rose-700">{error}</p>}

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canSave || isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}

function FirmFormFields({ firm }: { firm: FirmApi | null }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Legal name">
          <Input name="legal_name" placeholder="Registered legal name" defaultValue={firm?.legal_name ?? ""} />
        </Field>
        <Field label="Business name">
          <Input name="business_name" placeholder="Trading or brand name" defaultValue={firm?.business_name ?? ""} />
        </Field>
        <Field label="Constitution">
          <select name="constitution" className={selectClass} defaultValue={firm?.constitution ?? ""}>
            <option value="">Select constitution</option>
            <option value="proprietor">Proprietor</option>
            <option value="partnership">Partnership</option>
            <option value="llp">LLP</option>
            <option value="private_limited">Private Limited</option>
            <option value="public_limited">Public Limited</option>
          </select>
        </Field>
        <Field label="Incorporation date">
          <Input name="incorporation_date" type="date" defaultValue={firm?.incorporation_date ?? ""} />
        </Field>
        <Field label="Industry type">
          <Input name="industry_type" placeholder="e.g. Construction" defaultValue={firm?.industry_type ?? ""} />
        </Field>
        <Field label="Active">
          <select name="is_active" className={selectClass} defaultValue={String(firm?.is_active ?? true)}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </Field>
      </div>
      <Field label="Scope of work">
        <textarea
          name="scope_of_work"
          className={textareaClass}
          placeholder="Summary of work the firm performs"
          defaultValue={firm?.scope_of_work ?? ""}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Created at (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" value={firm?.created_at ?? "—"} />
        </Field>
        <Field label="Updated at (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" value={firm?.updated_at ?? "—"} />
        </Field>
      </div>
    </>
  );
}

function IdentityFormFields({ identity }: { identity: FirmIdentityApi | null }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Firm (read-only)">
        <Input readOnly className="bg-slate-50 text-slate-600" value={identity?.firm ?? "—"} />
      </Field>
      <Field label="PAN number">
        <Input name="pan_number" placeholder="10-character PAN" maxLength={10} defaultValue={identity?.pan_number ?? ""} />
      </Field>
      <Field label="GSTIN">
        <Input name="gstin" placeholder="15-character GSTIN" maxLength={15} defaultValue={identity?.gstin ?? ""} />
      </Field>
      <Field label="CIN">
        <Input name="cin" placeholder="Corporate identification number" defaultValue={identity?.cin ?? ""} />
      </Field>
      <Field label="Udyam number">
        <Input name="udyam_number" placeholder="MSME Udyam" defaultValue={identity?.udyam_number ?? ""} />
      </Field>
      <Field label="DSC expiry date">
        <Input name="dsc_expiry_date" type="date" defaultValue={identity?.dsc_expiry_date ?? ""} />
      </Field>
      <Field label="Created at (read-only)">
        <Input readOnly className="bg-slate-50 text-slate-600" value={identity?.created_at ?? "—"} />
      </Field>
      <Field label="Updated at (read-only)">
        <Input readOnly className="bg-slate-50 text-slate-600" value={identity?.updated_at ?? "—"} />
      </Field>
    </div>
  );
}

function LocationFormFields({ location }: { location: FirmLocationApi | null }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Firm (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" value={location?.firm ?? "—"} />
        </Field>
      </div>
      <Field label="Address line">
        <textarea
          name="address_line"
          className={textareaClass}
          placeholder="Street, building, landmark"
          defaultValue={location?.address_line ?? ""}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="City">
          <Input name="city" placeholder="City" defaultValue={location?.city ?? ""} />
        </Field>
        <Field label="State">
          <Input name="state" placeholder="State / UT" defaultValue={location?.state ?? ""} />
        </Field>
        <Field label="Pincode">
          <Input name="pincode" placeholder="6 digits" maxLength={6} defaultValue={location?.pincode ?? ""} />
        </Field>
        <Field label="Primary address">
          <select name="is_primary" className={selectClass} defaultValue={String(location?.is_primary ?? false)}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Created at (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" value={location?.created_at ?? "—"} />
        </Field>
        <Field label="Updated at (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" value={location?.updated_at ?? "—"} />
        </Field>
      </div>
    </>
  );
}

function FinancialsFormFields({ financial }: { financial: FirmFinancialApi | null }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Firm (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" value={financial?.firm ?? "—"} />
        </Field>
        <Field label="Financial year">
          <Input name="financial_year" placeholder='e.g. 2023-24' defaultValue={financial?.financial_year ?? ""} />
        </Field>
        <Field label="Turnover amount">
          <Input
            name="turnover_amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            defaultValue={financial?.turnover_amount != null ? String(financial.turnover_amount) : ""}
          />
        </Field>
        <Field label="Net worth">
          <Input
            name="net_worth"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            defaultValue={financial?.net_worth != null ? String(financial.net_worth) : ""}
          />
        </Field>
        <Field label="Profit after tax">
          <Input
            name="profit_after_tax"
            type="number"
            step="0.01"
            placeholder="0.00"
            defaultValue={financial?.profit_after_tax != null ? String(financial.profit_after_tax) : ""}
          />
        </Field>
        <Field label="Audited">
          <select name="is_audited" className={selectClass} defaultValue={String(financial?.is_audited ?? false)}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </Field>
        <Field label="Audit document">
          <Input name="audit_document" placeholder="Document ID or pick from vault" defaultValue={financial?.audit_document ?? ""} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Created at (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" value={financial?.created_at ?? "—"} />
        </Field>
        <Field label="Updated at (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" value={financial?.updated_at ?? "—"} />
        </Field>
      </div>
    </>
  );
}

function BankingFormFields({ banking }: { banking: FirmBankingSolvencyApi | null }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Firm (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" value={banking?.firm ?? "—"} />
        </Field>
        <Field label="Bank name">
          <Input name="bank_name" placeholder="Issuing bank" defaultValue={banking?.bank_name ?? ""} />
        </Field>
        <Field label="Solvency amount">
          <Input
            name="solvency_amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            defaultValue={banking?.solvency_amount != null ? String(banking.solvency_amount) : ""}
          />
        </Field>
        <Field label="Issue date">
          <Input name="issue_date" type="date" defaultValue={banking?.issue_date ?? ""} />
        </Field>
        <Field label="Expiry date">
          <Input name="expiry_date" type="date" defaultValue={banking?.expiry_date ?? ""} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Created at (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" value={banking?.created_at ?? "—"} />
        </Field>
        <Field label="Updated at (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" value={banking?.updated_at ?? "—"} />
        </Field>
      </div>
    </>
  );
}

function ExperienceFormFields({ experience }: { experience: FirmExperienceApi | null }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Firm (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" value={experience?.firm ?? "—"} />
        </Field>
        <Field label="Project name">
          <Input name="project_name" placeholder="Project title" defaultValue={experience?.project_name ?? ""} />
        </Field>
        <Field label="Client name">
          <Input name="client_name" placeholder="Client / authority" defaultValue={experience?.client_name ?? ""} />
        </Field>
        <Field label="Work order value">
          <Input
            name="work_order_value"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            defaultValue={experience?.work_order_value != null ? String(experience.work_order_value) : ""}
          />
        </Field>
        <Field label="Start date">
          <Input name="start_date" type="date" defaultValue={experience?.start_date ?? ""} />
        </Field>
        <Field label="Completion date">
          <Input name="completion_date" type="date" defaultValue={experience?.completion_date ?? ""} />
        </Field>
      </div>
      <Field label="Project description">
        <textarea
          name="project_description"
          className={textareaClass}
          placeholder="Scope and outcomes"
          defaultValue={experience?.project_description ?? ""}
        />
      </Field>
      <Field label="Category tags (comma-separated)">
        <Input
          name="category_tags"
          placeholder="e.g. roads, civil, smart city"
          defaultValue={experience?.category_tags?.join(", ") ?? ""}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Created at (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" value={experience?.created_at ?? "—"} />
        </Field>
        <Field label="Updated at (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" value={experience?.updated_at ?? "—"} />
        </Field>
      </div>
    </>
  );
}

function CertificationFormFields({ certification }: { certification: FirmCertificationApi | null }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Firm (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" value={certification?.firm ?? "—"} />
        </Field>
        <Field label="Linked experience (optional)">
          <Input name="experience" placeholder="Experience record ID" defaultValue={certification?.experience ?? ""} />
        </Field>
        <Field label="Certificate type">
          <select name="cert_type" className={selectClass} defaultValue={certification?.cert_type ?? "msme"}>
            <option value="msme">MSME (Udyam)</option>
            <option value="nsic">NSIC</option>
            <option value="startup_india">Startup India (DPIIT)</option>
            <option value="iso">ISO</option>
            <option value="zed">ZED</option>
            <option value="gem_expert">GeM Expert</option>
            <option value="experience">Past work / experience certificate</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="Other certificate type">
          <Input name="other_cert_type" placeholder="If type is Other" defaultValue={certification?.other_cert_type ?? ""} />
        </Field>
        <Field label="Certificate number">
          <Input name="cert_number" placeholder="Registration / cert no." defaultValue={certification?.cert_number ?? ""} />
        </Field>
        <Field label="Rating level">
          <Input name="rating_level" placeholder="e.g. Gold, ZED Bronze" defaultValue={certification?.rating_level ?? ""} />
        </Field>
        <Field label="Issue date">
          <Input name="issue_date" type="date" defaultValue={certification?.issue_date ?? ""} />
        </Field>
        <Field label="Expiry date">
          <Input name="expiry_date" type="date" defaultValue={certification?.expiry_date ?? ""} />
        </Field>
        <Field label="Document">
          <Input name="document" placeholder="Document ID from vault" defaultValue={certification?.document ?? ""} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Created at (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" value={certification?.created_at ?? "—"} />
        </Field>
        <Field label="Updated at (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" value={certification?.updated_at ?? "—"} />
        </Field>
      </div>
    </>
  );
}

function ExemptionsFormFields({ exemptions }: { exemptions: FirmExemptionsApi | null }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Firm (read-only)">
        <Input readOnly className="bg-slate-50 text-slate-600" value={exemptions?.firm ?? "—"} />
      </Field>
      <Field label="Eligible for EMD waiver">
        <select
          name="eligible_for_emd_waiver"
          className={selectClass}
          defaultValue={String(exemptions?.eligible_for_emd_waiver ?? false)}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </Field>
      <Field label="Eligible for experience waiver">
        <select
          name="eligible_for_exp_waiver"
          className={selectClass}
          defaultValue={String(exemptions?.eligible_for_exp_waiver ?? false)}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field label="Local preference state">
          <Input
            name="local_preference_state"
            placeholder="Typically aligned with GST state"
            defaultValue={exemptions?.local_preference_state ?? ""}
          />
        </Field>
      </div>
      <Field label="Updated at (read-only)">
        <Input readOnly className="bg-slate-50 text-slate-600" value={exemptions?.updated_at ?? "—"} />
      </Field>
    </div>
  );
}

function PreferencesFormFields({ preferences }: { preferences: FirmPreferencesApi | null }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Firm (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" value={preferences?.firm ?? "—"} />
        </Field>
      </div>
      <Field label="Preferred regions (JSON array or comma-separated)">
        <textarea
          name="preferred_regions"
          className={textareaClass}
          placeholder='e.g. ["GJ","RJ"] or Gujarat, Rajasthan'
          defaultValue={preferences?.preferred_regions?.join(", ") ?? ""}
        />
      </Field>
      <Field label="Target sectors">
        <textarea
          name="target_sectors"
          className={textareaClass}
          placeholder="Sectors to prioritize"
          defaultValue={preferences?.target_sectors?.join(", ") ?? ""}
        />
      </Field>
      <Field label="Excluded departments">
        <textarea
          name="excluded_depts"
          className={textareaClass}
          placeholder="Departments to exclude"
          defaultValue={preferences?.excluded_depts?.join(", ") ?? ""}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Min tender value">
          <Input
            name="min_tender_value"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            defaultValue={preferences?.min_tender_value != null ? String(preferences.min_tender_value) : ""}
          />
        </Field>
        <Field label="Max tender value">
          <Input
            name="max_tender_value"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            defaultValue={preferences?.max_tender_value != null ? String(preferences.max_tender_value) : ""}
          />
        </Field>
        <Field label="Updated at (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" value={preferences?.updated_at ?? "—"} />
        </Field>
      </div>
    </>
  );
}
