"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Loader2 } from "lucide-react";
import { createFirm, type FirmApi } from "@/lib/api/firms";
import { useFirm } from "@/context/FirmContext";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

type Constitution = FirmApi["constitution"];

const CONSTITUTIONS: { value: Constitution; label: string }[] = [
  { value: "proprietor",      label: "Proprietorship"    },
  { value: "partnership",     label: "Partnership"        },
  { value: "llp",             label: "LLP"                },
  { value: "private_limited", label: "Private Limited"   },
  { value: "public_limited",  label: "Public Limited"    },
];

interface FormState {
  legal_name: string;
  business_name: string;
  constitution: Constitution | "";
  industry_type: string;
  scope_of_work: string;
  incorporation_date: string;
}

const INITIAL: FormState = {
  legal_name: "",
  business_name: "",
  constitution: "",
  industry_type: "",
  scope_of_work: "",
  incorporation_date: "",
};

// ── Field components ──────────────────────────────────────────────────────────

function Label({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-ink-700">
      {children}
      {required && <span className="ml-1 text-danger-500">*</span>}
    </label>
  );
}

function Input({
  id, value, onChange, placeholder, type = "text", error,
}: {
  id: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; error?: string;
}) {
  return (
    <div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 outline-none transition-colors",
          "focus:border-navy-400 focus:ring-2 focus:ring-navy-100",
          error ? "border-danger-400" : "border-ink-200"
        )}
      />
      {error && <p className="mt-1 text-xs text-danger-600">{error}</p>}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NewFirmPage() {
  const router = useRouter();
  const { refreshFirms } = useFirm();

  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const next: typeof errors = {};
    if (!form.legal_name.trim())  next.legal_name  = "Legal name is required.";
    if (!form.business_name.trim()) next.business_name = "Business name is required.";
    if (!form.constitution)       next.constitution = "Please select a constitution.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError(null);

    try {
      const payload: Partial<FirmApi> = {
        legal_name:        form.legal_name.trim(),
        business_name:     form.business_name.trim(),
        constitution:      form.constitution as Constitution,
        industry_type:     form.industry_type.trim(),
        scope_of_work:     form.scope_of_work.trim(),
        incorporation_date: form.incorporation_date || null,
      };

      const newFirm = await createFirm(payload);

      // Write cookie so server components and FirmContext both see the new firm
      document.cookie = `tp_active_firm=${encodeURIComponent(newFirm.id)}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;

      // Re-fetch firms so context picks up the new firm + activeFirmId
      await refreshFirms();

      // Navigate to workspace — FirmWorkspace reacts to activeFirmId from context
      router.push("/firm");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Back link */}
      <Link
        href="/firm"
        className="inline-flex items-center gap-1.5 text-sm text-ink-500 transition-colors hover:text-ink-800"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to firm workspace
      </Link>

      {/* Card */}
      <div className="rounded-2xl border border-ink-200 bg-white shadow-card">
        {/* Header */}
        <div className="border-b border-ink-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50">
              <Building2 className="h-5 w-5 text-navy-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-ink-900">Add a new firm</h1>
              <p className="text-sm text-ink-500">
                Fill in the basics — you can complete the full profile from the workspace.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-5 px-6 py-6">

            {/* Required fields */}
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                Required
              </p>
              <div className="rounded-xl border border-ink-100 bg-ink-50/40 p-4 space-y-4">

                <div className="space-y-1.5">
                  <Label htmlFor="legal_name" required>Legal name</Label>
                  <Input
                    id="legal_name"
                    value={form.legal_name}
                    onChange={(v) => set("legal_name", v)}
                    placeholder="Registered legal name of the firm"
                    error={errors.legal_name}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="business_name" required>Business / brand name</Label>
                  <Input
                    id="business_name"
                    value={form.business_name}
                    onChange={(v) => set("business_name", v)}
                    placeholder="Trading or brand name (if different)"
                    error={errors.business_name}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="constitution" required>Constitution</Label>
                  <select
                    id="constitution"
                    value={form.constitution}
                    onChange={(e) => set("constitution", e.target.value as Constitution)}
                    className={cn(
                      "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none transition-colors",
                      "focus:border-navy-400 focus:ring-2 focus:ring-navy-100",
                      !form.constitution ? "text-ink-400" : "",
                      errors.constitution ? "border-danger-400" : "border-ink-200"
                    )}
                  >
                    <option value="" disabled>Select constitution type</option>
                    {CONSTITUTIONS.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  {errors.constitution && (
                    <p className="mt-1 text-xs text-danger-600">{errors.constitution}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Optional fields */}
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                Optional — you can fill these later
              </p>
              <div className="rounded-xl border border-ink-100 bg-ink-50/40 p-4 space-y-4">

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="industry_type">Industry type</Label>
                    <Input
                      id="industry_type"
                      value={form.industry_type}
                      onChange={(v) => set("industry_type", v)}
                      placeholder="e.g. IT Services, Construction"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="incorporation_date">Incorporation date</Label>
                    <Input
                      id="incorporation_date"
                      type="date"
                      value={form.incorporation_date}
                      onChange={(v) => set("incorporation_date", v)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="scope_of_work">Scope of work</Label>
                  <textarea
                    id="scope_of_work"
                    value={form.scope_of_work}
                    onChange={(e) => set("scope_of_work", e.target.value)}
                    placeholder="Brief description of services/work the firm performs (used for tender matching)"
                    rows={3}
                    className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 outline-none transition-colors focus:border-navy-400 focus:ring-2 focus:ring-navy-100 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Server error */}
            {serverError && (
              <p className="rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
                {serverError}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-ink-100 px-6 py-4">
            <Link
              href="/firm"
              className="rounded-xl border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-navy-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Creating firm…" : "Create firm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
