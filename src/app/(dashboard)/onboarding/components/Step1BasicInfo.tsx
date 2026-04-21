import { Input } from "@/components/ui/Input";
import type { FirmProfileFormData, FormErrors } from "./types";

interface Step1BasicInfoProps {
  formData: FirmProfileFormData;
  errors: FormErrors;
  onChange: (field: keyof FirmProfileFormData, value: string) => void;
}

export function Step1BasicInfo({ formData, errors, onChange }: Step1BasicInfoProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Legal Name *</label>
          <Input
            value={formData.legal_name}
            onChange={(event) => onChange("legal_name", event.target.value)}
            placeholder="Enter legal firm name"
          />
          {errors.legal_name && <p className="text-xs text-red-600">{errors.legal_name}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Business Name *</label>
          <Input
            value={formData.business_name}
            onChange={(event) => onChange("business_name", event.target.value)}
            placeholder="Enter business name"
          />
          {errors.business_name && <p className="text-xs text-red-600">{errors.business_name}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Constitution *</label>
          <select
            value={formData.constitution}
            onChange={(event) => onChange("constitution", event.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option value="">Select constitution</option>
            <option value="proprietor">Proprietor</option>
            <option value="partnership">Partnership</option>
            <option value="llp">LLP</option>
            <option value="private_limited">Private Limited</option>
            <option value="public_limited">Public Limited</option>
          </select>
          {errors.constitution && <p className="text-xs text-red-600">{errors.constitution}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Industry Type *</label>
          <Input
            value={formData.industry_type}
            onChange={(event) => onChange("industry_type", event.target.value)}
            placeholder="e.g. Infrastructure"
          />
          {errors.industry_type && <p className="text-xs text-red-600">{errors.industry_type}</p>}
        </div>
      </div>

      <div className="space-y-2 md:max-w-sm">
        <label className="text-sm font-medium text-slate-700">Incorporation Date *</label>
        <Input
          type="date"
          value={formData.incorporation_date}
          onChange={(event) => onChange("incorporation_date", event.target.value)}
        />
        {errors.incorporation_date && <p className="text-xs text-red-600">{errors.incorporation_date}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Scope of work *</label>
        <textarea
          value={formData.scope_of_work}
          onChange={(event) => onChange("scope_of_work", event.target.value)}
          placeholder="Describe work your firm performs, comma-separated if needed"
          className="min-h-[96px] w-full resize-y rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
        />
        {errors.scope_of_work && <p className="text-xs text-red-600">{errors.scope_of_work}</p>}
      </div>
    </div>
  );
}
