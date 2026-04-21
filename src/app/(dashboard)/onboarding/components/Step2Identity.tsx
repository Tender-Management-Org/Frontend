import { Input } from "@/components/ui/Input";
import type { FirmProfileFormData, FormErrors } from "./types";

interface Step2IdentityProps {
  formData: FirmProfileFormData;
  errors: FormErrors;
  onChange: (field: keyof FirmProfileFormData, value: string) => void;
}

export function Step2Identity({ formData, errors, onChange }: Step2IdentityProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">PAN Number *</label>
        <Input
          value={formData.pan_number}
          onChange={(event) => onChange("pan_number", event.target.value.toUpperCase())}
          placeholder="ABCDE1234F"
          maxLength={10}
        />
        {errors.pan_number && <p className="text-xs text-red-600">{errors.pan_number}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">GSTIN *</label>
        <Input
          value={formData.gstin}
          onChange={(event) => onChange("gstin", event.target.value)}
          placeholder="Enter GSTIN"
          maxLength={15}
        />
        {errors.gstin && <p className="text-xs text-red-600">{errors.gstin}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">CIN *</label>
        <Input
          value={formData.cin}
          onChange={(event) => onChange("cin", event.target.value)}
          placeholder="Enter CIN"
          maxLength={21}
        />
        {errors.cin && <p className="text-xs text-red-600">{errors.cin}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Udyam Number</label>
        <Input
          value={formData.udyam_number}
          onChange={(event) => onChange("udyam_number", event.target.value)}
          placeholder="Optional"
        />
      </div>

      <div className="space-y-2 md:max-w-sm">
        <label className="text-sm font-medium text-slate-700">DSC Expiry Date</label>
        <Input
          type="date"
          value={formData.dsc_expiry_date}
          onChange={(event) => onChange("dsc_expiry_date", event.target.value)}
        />
      </div>
    </div>
  );
}
