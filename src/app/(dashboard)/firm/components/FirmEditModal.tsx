"use client";

import { useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

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
}

export function FirmEditModal({ section, onClose }: FirmEditModalProps) {
  useEffect(() => {
    if (!section) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [section, onClose]);

  if (!section) return null;

  const title = sectionTitles[section];

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
          <p className="text-sm text-slate-500">Update fields for this section. Connect to your API to persist changes.</p>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onClose();
          }}
        >
          {section === "firm" && <FirmFormFields />}
          {section === "identity" && <IdentityFormFields />}
          {section === "locations" && <LocationFormFields />}
          {section === "financials" && <FinancialsFormFields />}
          {section === "banking" && <BankingFormFields />}
          {section === "experience" && <ExperienceFormFields />}
          {section === "certifications" && <CertificationFormFields />}
          {section === "exemptions" && <ExemptionsFormFields />}
          {section === "preferences" && <PreferencesFormFields />}

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
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

function FirmFormFields() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Legal name">
          <Input name="legal_name" placeholder="Registered legal name" />
        </Field>
        <Field label="Business name">
          <Input name="business_name" placeholder="Trading or brand name" />
        </Field>
        <Field label="Constitution">
          <select name="constitution" className={selectClass} defaultValue="">
            <option value="">Select constitution</option>
            <option value="proprietor">Proprietor</option>
            <option value="partnership">Partnership</option>
            <option value="llp">LLP</option>
            <option value="private_limited">Private Limited</option>
            <option value="public_limited">Public Limited</option>
          </select>
        </Field>
        <Field label="Incorporation date">
          <Input name="incorporation_date" type="date" />
        </Field>
        <Field label="Industry type">
          <Input name="industry_type" placeholder="e.g. Construction" />
        </Field>
        <Field label="Active">
          <select name="is_active" className={selectClass} defaultValue="true">
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </Field>
      </div>
      <Field label="Scope of work">
        <textarea name="scope_of_work" className={textareaClass} placeholder="Summary of work the firm performs" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Created at (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" placeholder="—" />
        </Field>
        <Field label="Updated at (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" placeholder="—" />
        </Field>
      </div>
    </>
  );
}

function IdentityFormFields() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Firm (read-only)">
        <Input readOnly className="bg-slate-50 text-slate-600" placeholder="—" />
      </Field>
      <Field label="PAN number">
        <Input name="pan_number" placeholder="10-character PAN" maxLength={10} />
      </Field>
      <Field label="GSTIN">
        <Input name="gstin" placeholder="15-character GSTIN" maxLength={15} />
      </Field>
      <Field label="CIN">
        <Input name="cin" placeholder="Corporate identification number" />
      </Field>
      <Field label="Udyam number">
        <Input name="udyam_number" placeholder="MSME Udyam" />
      </Field>
      <Field label="DSC expiry date">
        <Input name="dsc_expiry_date" type="date" />
      </Field>
      <Field label="Created at (read-only)">
        <Input readOnly className="bg-slate-50 text-slate-600" placeholder="—" />
      </Field>
      <Field label="Updated at (read-only)">
        <Input readOnly className="bg-slate-50 text-slate-600" placeholder="—" />
      </Field>
    </div>
  );
}

function LocationFormFields() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Firm (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" placeholder="—" />
        </Field>
      </div>
      <Field label="Address line">
        <textarea name="address_line" className={textareaClass} placeholder="Street, building, landmark" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="City">
          <Input name="city" placeholder="City" />
        </Field>
        <Field label="State">
          <Input name="state" placeholder="State / UT" />
        </Field>
        <Field label="Pincode">
          <Input name="pincode" placeholder="6 digits" maxLength={6} />
        </Field>
        <Field label="Primary address">
          <select name="is_primary" className={selectClass} defaultValue="false">
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Created at (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" placeholder="—" />
        </Field>
        <Field label="Updated at (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" placeholder="—" />
        </Field>
      </div>
    </>
  );
}

function FinancialsFormFields() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Firm (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" placeholder="—" />
        </Field>
        <Field label="Financial year">
          <Input name="financial_year" placeholder='e.g. 2023-24' />
        </Field>
        <Field label="Turnover amount">
          <Input name="turnover_amount" type="number" step="0.01" min="0" placeholder="0.00" />
        </Field>
        <Field label="Net worth">
          <Input name="net_worth" type="number" step="0.01" min="0" placeholder="0.00" />
        </Field>
        <Field label="Profit after tax">
          <Input name="profit_after_tax" type="number" step="0.01" placeholder="0.00" />
        </Field>
        <Field label="Audited">
          <select name="is_audited" className={selectClass} defaultValue="false">
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </Field>
        <Field label="Audit document">
          <Input name="audit_document" placeholder="Document ID or pick from vault" />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Created at (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" placeholder="—" />
        </Field>
        <Field label="Updated at (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" placeholder="—" />
        </Field>
      </div>
    </>
  );
}

function BankingFormFields() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Firm (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" placeholder="—" />
        </Field>
        <Field label="Bank name">
          <Input name="bank_name" placeholder="Issuing bank" />
        </Field>
        <Field label="Solvency amount">
          <Input name="solvency_amount" type="number" step="0.01" min="0" placeholder="0.00" />
        </Field>
        <Field label="Issue date">
          <Input name="issue_date" type="date" />
        </Field>
        <Field label="Expiry date">
          <Input name="expiry_date" type="date" />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Created at (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" placeholder="—" />
        </Field>
        <Field label="Updated at (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" placeholder="—" />
        </Field>
      </div>
    </>
  );
}

function ExperienceFormFields() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Firm (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" placeholder="—" />
        </Field>
        <Field label="Project name">
          <Input name="project_name" placeholder="Project title" />
        </Field>
        <Field label="Client name">
          <Input name="client_name" placeholder="Client / authority" />
        </Field>
        <Field label="Work order value">
          <Input name="work_order_value" type="number" step="0.01" min="0" placeholder="0.00" />
        </Field>
        <Field label="Start date">
          <Input name="start_date" type="date" />
        </Field>
        <Field label="Completion date">
          <Input name="completion_date" type="date" />
        </Field>
      </div>
      <Field label="Project description">
        <textarea name="project_description" className={textareaClass} placeholder="Scope and outcomes" />
      </Field>
      <Field label="Category tags (comma-separated)">
        <Input name="category_tags" placeholder="e.g. roads, civil, smart city" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Created at (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" placeholder="—" />
        </Field>
        <Field label="Updated at (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" placeholder="—" />
        </Field>
      </div>
    </>
  );
}

function CertificationFormFields() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Firm (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" placeholder="—" />
        </Field>
        <Field label="Linked experience (optional)">
          <Input name="experience" placeholder="Experience record ID" />
        </Field>
        <Field label="Certificate type">
          <select name="cert_type" className={selectClass} defaultValue="msme">
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
          <Input name="other_cert_type" placeholder="If type is Other" />
        </Field>
        <Field label="Certificate number">
          <Input name="cert_number" placeholder="Registration / cert no." />
        </Field>
        <Field label="Rating level">
          <Input name="rating_level" placeholder="e.g. Gold, ZED Bronze" />
        </Field>
        <Field label="Issue date">
          <Input name="issue_date" type="date" />
        </Field>
        <Field label="Expiry date">
          <Input name="expiry_date" type="date" />
        </Field>
        <Field label="Document">
          <Input name="document" placeholder="Document ID from vault" />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Created at (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" placeholder="—" />
        </Field>
        <Field label="Updated at (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" placeholder="—" />
        </Field>
      </div>
    </>
  );
}

function ExemptionsFormFields() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Firm (read-only)">
        <Input readOnly className="bg-slate-50 text-slate-600" placeholder="—" />
      </Field>
      <Field label="Eligible for EMD waiver">
        <select name="eligible_for_emd_waiver" className={selectClass} defaultValue="false">
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </Field>
      <Field label="Eligible for experience waiver">
        <select name="eligible_for_exp_waiver" className={selectClass} defaultValue="false">
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field label="Local preference state">
          <Input name="local_preference_state" placeholder="Typically aligned with GST state" />
        </Field>
      </div>
      <Field label="Updated at (read-only)">
        <Input readOnly className="bg-slate-50 text-slate-600" placeholder="—" />
      </Field>
    </div>
  );
}

function PreferencesFormFields() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Firm (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" placeholder="—" />
        </Field>
      </div>
      <Field label="Preferred regions (JSON array or comma-separated)">
        <textarea name="preferred_regions" className={textareaClass} placeholder='e.g. ["GJ","RJ"] or Gujarat, Rajasthan' />
      </Field>
      <Field label="Target sectors">
        <textarea name="target_sectors" className={textareaClass} placeholder="Sectors to prioritize" />
      </Field>
      <Field label="Excluded departments">
        <textarea name="excluded_depts" className={textareaClass} placeholder="Departments to exclude" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Min tender value">
          <Input name="min_tender_value" type="number" step="0.01" min="0" placeholder="0.00" />
        </Field>
        <Field label="Max tender value">
          <Input name="max_tender_value" type="number" step="0.01" min="0" placeholder="0.00" />
        </Field>
        <Field label="Updated at (read-only)">
          <Input readOnly className="bg-slate-50 text-slate-600" placeholder="—" />
        </Field>
      </div>
    </>
  );
}
