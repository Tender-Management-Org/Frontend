"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TagInput } from "@/components/ui/TagInput";
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
import { uploadDocument, type DocumentApi } from "@/lib/api/documents";

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
  financials: "Add / edit financial",
  banking: "Add / edit banking & solvency",
  experience: "Add / edit experience",
  certifications: "Add / edit certification",
  exemptions: "Edit exemptions",
  preferences: "Edit preferences",
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
    experiences: FirmExperienceApi[];
    certification: FirmCertificationApi | null;
    exemptions: FirmExemptionsApi | null;
    preferences: FirmPreferencesApi | null;
    documents: DocumentApi[];
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

/** Parse a human-friendly Indian number like "35,00,000" or "3500000" to a number */
function parseIndianNumber(value: FormDataEntryValue | null): number | null {
  const str = String(value ?? "").replace(/,/g, "").trim();
  if (!str) return null;
  const num = Number(str);
  return Number.isFinite(num) ? num : null;
}

function parseListInput(value: string) {
  const raw = value.trim();
  if (!raw) return [];
  if (raw.startsWith("[")) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map((item) => String(item).trim()).filter(Boolean);
    } catch { /* fall through */ }
  }
  return raw.split(",").map((item) => item.trim()).filter(Boolean);
}

/** Format a number as Indian locale (e.g. 3500000 → "35,00,000") */
function formatIndianNumber(value: string | number | null | undefined): string {
  if (value == null || value === "") return "";
  const num = Number(String(value).replace(/,/g, ""));
  if (!Number.isFinite(num)) return String(value);
  return num.toLocaleString("en-IN");
}

function getFinancialYearOptions() {
  const now = new Date();
  const month = now.getMonth();
  const currentStartYear = month >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  const options: string[] = [];
  for (let startYear = currentStartYear + 1; startYear >= currentStartYear - 10; startYear -= 1) {
    const endYear = String((startYear + 1) % 100).padStart(2, "0");
    options.push(`${startYear}-${endYear}`);
  }
  return options;
}

/** Extract the first useful error message from an ApiError response body */
function extractApiError(e: unknown): string {
  if (!(e instanceof ApiError)) return "Failed to save. Please try again.";
  const data = e.data as Record<string, unknown> | string | null;
  if (typeof data === "string") return data || `Error ${e.status}`;
  if (data && typeof data === "object") {
    // Try field errors first
    for (const key of Object.keys(data)) {
      if (key === "detail") continue;
      const val = data[key];
      const msg = Array.isArray(val) ? val[0] : val;
      if (typeof msg === "string" && msg) return `${key}: ${msg}`;
    }
    if (typeof data.detail === "string") return data.detail;
  }
  return `Failed to save (${e.status}). Check entered values.`;
}

export function FirmEditModal({ section, onClose, firmId, data, onSaved }: FirmEditModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!section) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [section, onClose]);

  useEffect(() => { if (section) setError(null); }, [section]);

  if (!section) return null;

  const title = sectionTitles[section];
  const canSave = !!firmId;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      role="presentation"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="firm-edit-modal-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <h3 id="firm-edit-modal-title" className="text-lg font-semibold text-slate-900">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-slate-700" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          ref={formRef}
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!firmId) { setError("No firm selected. Complete onboarding first."); return; }
            setIsSaving(true);
            setError(null);
            try {
              const fd = new FormData(e.currentTarget);

              if (section === "firm") {
                const saved = await updateFirm(firmId, {
                  legal_name: String(fd.get("legal_name") ?? "").trim(),
                  business_name: String(fd.get("business_name") ?? "").trim(),
                  constitution: String(fd.get("constitution") ?? "").trim(),
                  incorporation_date: asOptionalString(fd.get("incorporation_date")),
                  industry_type: String(fd.get("industry_type") ?? "").trim(),
                  scope_of_work: String(fd.get("scope_of_work") ?? "").trim(),
                  is_active: asBool(fd.get("is_active")),
                });
                onSaved({ firm: saved });

              } else if (section === "identity") {
                const saved = await upsertFirmIdentity(firmId, {
                  pan_number: String(fd.get("pan_number") ?? "").trim().toUpperCase(),
                  gstin: String(fd.get("gstin") ?? "").trim().toUpperCase(),
                  cin: String(fd.get("cin") ?? "").trim().toUpperCase(),
                  udyam_number: String(fd.get("udyam_number") ?? "").trim().toUpperCase(),
                  dsc_expiry_date: asOptionalString(fd.get("dsc_expiry_date")),
                  san_brn: String(fd.get("san_brn") ?? "").trim(),
                  esi_number: String(fd.get("esi_number") ?? "").trim(),
                  pf_code: String(fd.get("pf_code") ?? "").trim().toUpperCase(),
                  shop_act_number: String(fd.get("shop_act_number") ?? "").trim(),
                });
                onSaved({ identity: saved });

              } else if (section === "locations") {
                const payload = {
                  address_line: String(fd.get("address_line") ?? "").trim(),
                  city: String(fd.get("city") ?? "").trim(),
                  state: String(fd.get("state") ?? "").trim(),
                  pincode: String(fd.get("pincode") ?? "").trim(),
                  is_primary: asBool(fd.get("is_primary")),
                };
                const saved = data.location
                  ? await updateFirmLocation(firmId, data.location.id, payload)
                  : await createFirmLocation(firmId, payload);
                onSaved({ location: saved });

              } else if (section === "financials") {
                const auditDocumentFile = fd.get("audit_document_file");
                let auditDocumentId: string | null | undefined = data.financial?.audit_document;
                if (auditDocumentFile instanceof File && auditDocumentFile.size > 0) {
                  const uploaded = await uploadDocument({
                    firm: firmId,
                    file: auditDocumentFile,
                    title: `${String(fd.get("financial_year") ?? "").trim() || "Financial"} audit document`,
                    doc_type: "financial",
                  });
                  auditDocumentId = uploaded.id;
                }
                if (!auditDocumentId) {
                  setError("Audit document is required. Please upload the audit report.");
                  setIsSaving(false);
                  return;
                }
                const payload = {
                  financial_year: String(fd.get("financial_year") ?? "").trim(),
                  turnover_amount: parseIndianNumber(fd.get("turnover_amount")) ?? undefined,
                  is_audited: asBool(fd.get("is_audited")),
                  audit_document: auditDocumentId,
                };
                const saved = data.financial
                  ? await updateFirmFinancial(firmId, data.financial.id, payload)
                  : await createFirmFinancial(firmId, payload);
                onSaved({ financial: saved });

              } else if (section === "banking") {
                const payload = {
                  bank_name: String(fd.get("bank_name") ?? "").trim(),
                  solvency_amount: parseIndianNumber(fd.get("solvency_amount")) ?? undefined,
                  issue_date: asOptionalString(fd.get("issue_date")) ?? undefined,
                  expiry_date: asOptionalString(fd.get("expiry_date")) ?? undefined,
                };
                const saved = data.banking
                  ? await updateFirmSolvencyCertificate(firmId, data.banking.id, payload)
                  : await createFirmSolvencyCertificate(firmId, payload);
                onSaved({ banking: saved });

              } else if (section === "experience") {
                const isCurrentlyWorking = fd.get("is_currently_working") === "true";
                const payload = {
                  project_name: String(fd.get("project_name") ?? "").trim(),
                  project_description: String(fd.get("project_description") ?? "").trim(),
                  client_name: String(fd.get("client_name") ?? "").trim(),
                  work_order_value: parseIndianNumber(fd.get("work_order_value")) ?? undefined,
                  start_date: asOptionalString(fd.get("start_date")),
                  completion_date: isCurrentlyWorking ? null : asOptionalString(fd.get("completion_date")),
                  is_currently_working: isCurrentlyWorking,
                  category_tags: parseListInput(String(fd.get("category_tags") ?? "")),
                };
                const saved = data.experience
                  ? await updateFirmExperience(firmId, data.experience.id, payload)
                  : await createFirmExperience(firmId, payload);
                onSaved({ experience: saved });

              } else if (section === "certifications") {
                const certificateFile = fd.get("document_file");
                let documentId: string | null | undefined = data.certification?.document;
                if (certificateFile instanceof File && certificateFile.size > 0) {
                  const uploaded = await uploadDocument({
                    firm: firmId,
                    file: certificateFile,
                    title:
                      String(fd.get("cert_number") ?? "").trim() ||
                      `${String(fd.get("cert_type") ?? "certificate").trim()} certificate`,
                    doc_type: "certificate",
                  });
                  documentId = uploaded.id;
                }
                const issueDate = asOptionalString(fd.get("issue_date"));
                if (!issueDate) {
                  setError("Issue date is required.");
                  setIsSaving(false);
                  return;
                }
                const payload = {
                  experience: asOptionalString(fd.get("experience")),
                  cert_type: String(fd.get("cert_type") ?? "msme").trim(),
                  other_cert_type: String(fd.get("other_cert_type") ?? "").trim(),
                  cert_number: String(fd.get("cert_number") ?? "").trim(),
                  issue_date: issueDate,
                  expiry_date: asOptionalString(fd.get("expiry_date")),
                  document: documentId ?? null,
                };
                const saved = data.certification
                  ? await updateFirmCertification(firmId, data.certification.id, payload)
                  : await createFirmCertification(firmId, payload);
                onSaved({ certification: saved });

              } else if (section === "exemptions") {
                const saved = await upsertFirmExemptions(firmId, {
                  eligible_for_emd_waiver: asBool(fd.get("eligible_for_emd_waiver")),
                  eligible_for_exp_waiver: asBool(fd.get("eligible_for_exp_waiver")),
                  local_preference_state: String(fd.get("local_preference_state") ?? "").trim(),
                });
                onSaved({ exemptions: saved });

              } else if (section === "preferences") {
                const saved = await upsertFirmPreferences(firmId, {
                  preferred_regions: parseListInput(String(fd.get("preferred_regions") ?? "")),
                  target_sectors: parseListInput(String(fd.get("target_sectors") ?? "")),
                  excluded_depts: parseListInput(String(fd.get("excluded_depts") ?? "")),
                  min_tender_value: parseIndianNumber(fd.get("min_tender_value")),
                  max_tender_value: parseIndianNumber(fd.get("max_tender_value")),
                });
                onSaved({ preferences: saved });
              }

              onClose();
            } catch (e) {
              setError(extractApiError(e));
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
            <CertificationFormFields certification={data.certification} experiences={data.experiences} />
          )}
          {section === "exemptions" && <ExemptionsFormFields exemptions={data.exemptions} />}
          {section === "preferences" && <PreferencesFormFields preferences={data.preferences} />}

          {error && (
            <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canSave || isSaving}>
              {isSaving ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700">
        {label}{required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

/** Controlled Indian-formatted number input — stores raw value in a hidden field */
function IndianNumberInput({ name, defaultValue, placeholder, required }: {
  name: string;
  defaultValue?: string | number | null;
  placeholder?: string;
  required?: boolean;
}) {
  const [display, setDisplay] = useState(() => formatIndianNumber(defaultValue));

  // Store raw numeric string in a hidden input so FormData picks up unformatted value
  const rawValue = display.replace(/,/g, "");

  return (
    <div className="relative">
      <input type="hidden" name={name} value={rawValue} />
      <Input
        value={display}
        onChange={(e) => {
          // Allow only digits and commas while typing
          const v = e.target.value.replace(/[^0-9]/g, "");
          setDisplay(v ? Number(v).toLocaleString("en-IN") : "");
        }}
        placeholder={placeholder ?? "e.g. 35,00,000"}
        required={required}
      />
    </div>
  );
}

function FirmFormFields({ firm }: { firm: FirmApi | null }) {
  const [scopeOfWork, setScopeOfWork] = useState(firm?.scope_of_work ?? "");

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Legal name" required>
          <Input name="legal_name" placeholder="Registered legal name" defaultValue={firm?.legal_name ?? ""} />
        </Field>
        <Field label="Business name" required>
          <Input name="business_name" placeholder="Trading or brand name" defaultValue={firm?.business_name ?? ""} />
        </Field>
        <Field label="Constitution" required>
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
        <Field label="Industry type" required>
          <Input name="industry_type" placeholder="e.g. Construction" defaultValue={firm?.industry_type ?? ""} />
        </Field>
        <Field label="Active">
          <select name="is_active" className={selectClass} defaultValue={String(firm?.is_active ?? true)}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </Field>
      </div>
      <Field label="Scope of work" required>
        <input type="hidden" name="scope_of_work" value={scopeOfWork} />
        <TagInput
          value={scopeOfWork}
          onChange={setScopeOfWork}
          placeholder="Type and press Enter — e.g. Civil Construction"
        />
        <p className="text-xs text-slate-400">Press Enter or comma to add each item as a tag.</p>
      </Field>
    </>
  );
}

function IdentityFormFields({ identity }: { identity: FirmIdentityApi | null }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Required</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="PAN number" required hint="Format: ABCDE1234F">
            <Input name="pan_number" placeholder="ABCDE1234F" maxLength={10} defaultValue={identity?.pan_number ?? ""} />
          </Field>
          <Field label="GSTIN" required hint="15-character GST Identification Number">
            <Input name="gstin" placeholder="27AABCS1429B1Z5" maxLength={15} defaultValue={identity?.gstin ?? ""} />
          </Field>
        </div>
      </div>
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Optional</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="CIN" hint="21-char Corporate Identity Number (companies only)">
            <Input name="cin" placeholder="U74999WB2000PTC200542" maxLength={21} defaultValue={identity?.cin ?? ""} />
          </Field>
          <Field label="Udyam Registration No." hint="Format: UDYAM-RJ-06-0012345">
            <Input name="udyam_number" placeholder="UDYAM-RJ-06-0012345" defaultValue={identity?.udyam_number ?? ""} />
          </Field>
          <Field label="SAN / BRN" hint="Shop Act Number or Business Registration Number">
            <Input name="san_brn" placeholder="e.g. RJ-BRN-2018-00412" defaultValue={identity?.san_brn ?? ""} />
          </Field>
          <Field label="ESI Number" hint="17-digit Employees' State Insurance number">
            <Input name="esi_number" placeholder="16000571060000999" maxLength={17} defaultValue={identity?.esi_number ?? ""} />
          </Field>
          <Field label="PF Code" hint="Provident Fund establishment code">
            <Input name="pf_code" placeholder="RJUDR2378824000" maxLength={22} defaultValue={identity?.pf_code ?? ""} />
          </Field>
          <Field label="Shop Act Reg. No." hint="Shops & Commercial Establishments Act">
            <Input name="shop_act_number" placeholder="SCA/2019/4/082341" maxLength={30} defaultValue={identity?.shop_act_number ?? ""} />
          </Field>
          <Field label="DSC Expiry Date" hint="Digital Signature Certificate expiry">
            <Input name="dsc_expiry_date" type="date" defaultValue={identity?.dsc_expiry_date ?? ""} />
          </Field>
        </div>
      </div>
    </div>
  );
}

function LocationFormFields({ location }: { location: FirmLocationApi | null }) {
  return (
    <>
      <Field label="Address line" required>
        <textarea name="address_line" className={textareaClass} placeholder="Street, building, landmark" defaultValue={location?.address_line ?? ""} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="City" required>
          <Input name="city" placeholder="City" defaultValue={location?.city ?? ""} />
        </Field>
        <Field label="State" required>
          <Input name="state" placeholder="State / UT" defaultValue={location?.state ?? ""} />
        </Field>
        <Field label="Pincode" required hint="6 digits">
          <Input name="pincode" placeholder="302001" maxLength={6} defaultValue={location?.pincode ?? ""} />
        </Field>
        <Field label="Primary address">
          <select name="is_primary" className={selectClass} defaultValue={String(location?.is_primary ?? false)}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </Field>
      </div>
    </>
  );
}

function FinancialsFormFields({ financial }: { financial: FirmFinancialApi | null }) {
  const financialYearOptions = getFinancialYearOptions();
  const hasCustomYear = !!financial?.financial_year && !financialYearOptions.includes(financial.financial_year);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Financial year" required>
          <select name="financial_year" className={selectClass} defaultValue={financial?.financial_year ?? ""}>
            <option value="">Select financial year</option>
            {hasCustomYear && <option value={financial?.financial_year}>{financial?.financial_year}</option>}
            {financialYearOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </Field>
        <Field label="Turnover amount (₹)" required hint="Indian format — e.g. 35,00,000">
          <IndianNumberInput name="turnover_amount" defaultValue={financial?.turnover_amount} placeholder="e.g. 35,00,000" />
        </Field>
        <Field label="Audited">
          <select name="is_audited" className={selectClass} defaultValue={String(financial?.is_audited ?? false)}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </Field>
      </div>
      <Field label="Audit document" required hint={financial?.audit_document ? "A document is already linked. Upload a new file to replace it." : "Upload the audited financial statement."}>
        <Input name="audit_document_file" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" />
        {financial?.audit_document && (
          <p className="text-xs text-slate-500">Current document will be kept unless you upload a replacement.</p>
        )}
      </Field>
    </div>
  );
}

function BankingFormFields({ banking }: { banking: FirmBankingSolvencyApi | null }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Bank name" required>
        <Input name="bank_name" placeholder="Issuing bank" defaultValue={banking?.bank_name ?? ""} />
      </Field>
      <Field label="Solvency amount (₹)" required hint="Indian format — e.g. 50,00,000">
        <IndianNumberInput name="solvency_amount" defaultValue={banking?.solvency_amount} placeholder="e.g. 50,00,000" />
      </Field>
      <Field label="Issue date" required>
        <Input name="issue_date" type="date" defaultValue={banking?.issue_date ?? ""} />
      </Field>
      <Field label="Expiry date" required>
        <Input name="expiry_date" type="date" defaultValue={banking?.expiry_date ?? ""} />
      </Field>
    </div>
  );
}

function ExperienceFormFields({ experience }: { experience: FirmExperienceApi | null }) {
  const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(experience?.is_currently_working ?? false);
  const [tags, setTags] = useState(experience?.category_tags?.join(", ") ?? "");

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Project name" required>
          <Input name="project_name" placeholder="Project title" defaultValue={experience?.project_name ?? ""} />
        </Field>
        <Field label="Client name">
          <Input name="client_name" placeholder="Client / issuing authority" defaultValue={experience?.client_name ?? ""} />
        </Field>
        <Field label="Work order value (₹)" required hint="Indian format — e.g. 1,50,00,000">
          <IndianNumberInput name="work_order_value" defaultValue={experience?.work_order_value} placeholder="e.g. 1,50,00,000" />
        </Field>
        <Field label="Start date">
          <Input name="start_date" type="date" defaultValue={experience?.start_date ?? ""} />
        </Field>
        <Field label="Currently working on this project?">
          <select
            name="is_currently_working"
            className={selectClass}
            value={String(isCurrentlyWorking)}
            onChange={(e) => setIsCurrentlyWorking(e.target.value === "true")}
          >
            <option value="false">No — project completed</option>
            <option value="true">Yes — ongoing</option>
          </select>
        </Field>
        {!isCurrentlyWorking && (
          <Field label="Completion date">
            <Input name="completion_date" type="date" defaultValue={experience?.completion_date ?? ""} />
          </Field>
        )}
      </div>
      <Field label="Project description">
        <textarea name="project_description" className={textareaClass} placeholder="Scope and outcomes" defaultValue={experience?.project_description ?? ""} />
      </Field>
      <Field label="Category tags" hint="Press Enter or comma to add tags">
        <input type="hidden" name="category_tags" value={tags} />
        <TagInput value={tags} onChange={setTags} placeholder="e.g. Roads, Civil, Smart City" />
      </Field>
    </div>
  );
}

function CertificationFormFields({ certification, experiences }: { certification: FirmCertificationApi | null; experiences: FirmExperienceApi[] }) {
  const [certType, setCertType] = useState<string>(certification?.cert_type ?? "msme");

  useEffect(() => { setCertType(certification?.cert_type ?? "msme"); }, [certification]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Certificate type" required>
          <select name="cert_type" className={selectClass} value={certType} onChange={(e) => setCertType(e.target.value)}>
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
        {certType === "other" && (
          <Field label="Specify certificate type" required>
            <Input name="other_cert_type" placeholder="Describe the certificate" defaultValue={certification?.other_cert_type ?? ""} />
          </Field>
        )}
        {certType === "experience" && (
          <Field label="Linked experience" hint="Select the project this certificate belongs to">
            <select name="experience" className={selectClass} defaultValue={certification?.experience ?? ""}>
              <option value="">Select experience</option>
              {experiences.map((exp) => (
                <option key={exp.id} value={exp.id}>
                  {exp.project_name || "Untitled"} — {exp.client_name || "No client"}
                </option>
              ))}
            </select>
          </Field>
        )}
        <Field label="Certificate number">
          <Input name="cert_number" placeholder="Registration / cert no." defaultValue={certification?.cert_number ?? ""} />
        </Field>
        <Field label="Issue date" required>
          <Input name="issue_date" type="date" defaultValue={certification?.issue_date ?? ""} required />
        </Field>
        <Field label="Expiry date" hint="Leave blank if the certificate does not expire">
          <Input name="expiry_date" type="date" defaultValue={certification?.expiry_date ?? ""} />
        </Field>
      </div>
      <Field label="Certificate document" hint="Upload PDF or image of the certificate">
        <Input name="document_file" type="file" accept=".pdf,.jpg,.jpeg,.png" />
        {certification?.document && (
          <p className="text-xs text-slate-500">A document is already linked. Upload a new file to replace it.</p>
        )}
      </Field>
    </div>
  );
}

function ExemptionsFormFields({ exemptions }: { exemptions: FirmExemptionsApi | null }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Eligible for EMD waiver">
        <select name="eligible_for_emd_waiver" className={selectClass} defaultValue={String(exemptions?.eligible_for_emd_waiver ?? false)}>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </Field>
      <Field label="Eligible for experience waiver">
        <select name="eligible_for_exp_waiver" className={selectClass} defaultValue={String(exemptions?.eligible_for_exp_waiver ?? false)}>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field label="Local preference state" hint="Typically aligned with your GST state">
          <Input name="local_preference_state" placeholder="e.g. Rajasthan" defaultValue={exemptions?.local_preference_state ?? ""} />
        </Field>
      </div>
    </div>
  );
}

function PreferencesFormFields({ preferences }: { preferences: FirmPreferencesApi | null }) {
  const [regions, setRegions] = useState(preferences?.preferred_regions?.join(", ") ?? "");
  const [sectors, setSectors] = useState(preferences?.target_sectors?.join(", ") ?? "");
  const [depts, setDepts] = useState(preferences?.excluded_depts?.join(", ") ?? "");

  return (
    <div className="space-y-4">
      <Field label="Preferred regions" hint="Press Enter or comma to add — e.g. Rajasthan, Gujarat">
        <input type="hidden" name="preferred_regions" value={regions} />
        <TagInput value={regions} onChange={setRegions} placeholder="e.g. Rajasthan" />
      </Field>
      <Field label="Target sectors" hint="Sectors you want to prioritise">
        <input type="hidden" name="target_sectors" value={sectors} />
        <TagInput value={sectors} onChange={setSectors} placeholder="e.g. Roads, Water, IT" />
      </Field>
      <Field label="Excluded departments" hint="Departments to filter out from recommendations">
        <input type="hidden" name="excluded_depts" value={depts} />
        <TagInput value={depts} onChange={setDepts} placeholder="e.g. Defence, DRDO" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Min tender value (₹)" hint="Indian format — e.g. 5,00,000">
          <IndianNumberInput name="min_tender_value" defaultValue={preferences?.min_tender_value} placeholder="e.g. 5,00,000" />
        </Field>
        <Field label="Max tender value (₹)" hint="Indian format — e.g. 5,00,00,000">
          <IndianNumberInput name="max_tender_value" defaultValue={preferences?.max_tender_value} placeholder="e.g. 5,00,00,000" />
        </Field>
      </div>
    </div>
  );
}
