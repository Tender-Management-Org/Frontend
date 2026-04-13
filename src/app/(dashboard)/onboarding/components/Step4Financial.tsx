import { Input } from "@/components/ui/Input";
import type { FirmProfileFormData, FormErrors } from "./types";

interface Step4FinancialProps {
  formData: FirmProfileFormData;
  errors: FormErrors;
  onChange: (field: keyof FirmProfileFormData, value: string) => void;
}

export function Step4Financial({ formData, errors, onChange }: Step4FinancialProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Turnover</label>
        <Input
          value={formData.turnover}
          onChange={(event) => onChange("turnover", event.target.value)}
          placeholder="Enter turnover"
        />
        {errors.turnover && <p className="text-xs text-red-600">{errors.turnover}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Net Worth</label>
        <Input
          value={formData.net_worth}
          onChange={(event) => onChange("net_worth", event.target.value)}
          placeholder="Enter net worth"
        />
        {errors.net_worth && <p className="text-xs text-red-600">{errors.net_worth}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Profit After Tax</label>
        <Input
          value={formData.profit_after_tax}
          onChange={(event) => onChange("profit_after_tax", event.target.value)}
          placeholder="Enter PAT"
        />
        {errors.profit_after_tax && <p className="text-xs text-red-600">{errors.profit_after_tax}</p>}
      </div>
    </div>
  );
}
