import { Input } from "@/components/ui/Input";
import type { FirmProfileFormData, FormErrors } from "./types";

interface Step3LocationProps {
  formData: FirmProfileFormData;
  errors: FormErrors;
  onChange: (field: keyof FirmProfileFormData, value: string) => void;
}

export function Step3Location({ formData, errors, onChange }: Step3LocationProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Address Line *</label>
        <textarea
          value={formData.address_line}
          onChange={(event) => onChange("address_line", event.target.value)}
          rows={3}
          placeholder="Enter firm address"
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-slate-300"
        />
        {errors.address_line && <p className="text-xs text-red-600">{errors.address_line}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">City *</label>
          <Input
            value={formData.city}
            onChange={(event) => onChange("city", event.target.value)}
            placeholder="City"
          />
          {errors.city && <p className="text-xs text-red-600">{errors.city}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">State *</label>
          <Input
            value={formData.state}
            onChange={(event) => onChange("state", event.target.value)}
            placeholder="State"
          />
          {errors.state && <p className="text-xs text-red-600">{errors.state}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Pincode *</label>
          <Input
            value={formData.pincode}
            onChange={(event) => onChange("pincode", event.target.value.replace(/\D/g, ""))}
            placeholder="6-digit pincode"
            maxLength={6}
          />
          {errors.pincode && <p className="text-xs text-red-600">{errors.pincode}</p>}
        </div>
      </div>
    </div>
  );
}
