import { Input } from "@/components/ui/Input";
import type { FirmProfileFormData, FormErrors } from "./types";

interface Step2IdentityProps {
  formData: FirmProfileFormData;
  errors: FormErrors;
  onChange: (field: keyof FirmProfileFormData, value: string) => void;
}

function FieldHint({ text }: { text: string }) {
  return <p className="text-xs text-slate-400">{text}</p>;
}

export function Step2Identity({ formData, errors, onChange }: Step2IdentityProps) {
  return (
    <div className="space-y-5">
      {/* Required identifiers */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Required</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">PAN Number *</label>
            <Input
              value={formData.pan_number}
              onChange={(e) => onChange("pan_number", e.target.value.toUpperCase())}
              placeholder="ABCDE1234F"
              maxLength={10}
            />
            <FieldHint text="Format: 5 letters · 4 digits · 1 letter (e.g. AABCS1429B)" />
            {errors.pan_number && <p className="text-xs text-red-600">{errors.pan_number}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">GSTIN *</label>
            <Input
              value={formData.gstin}
              onChange={(e) => onChange("gstin", e.target.value.toUpperCase())}
              placeholder="27AABCS1429B1Z5"
              maxLength={15}
            />
            <FieldHint text="15-character GST Identification Number" />
            {errors.gstin && <p className="text-xs text-red-600">{errors.gstin}</p>}
          </div>
        </div>
      </div>

      {/* Optional identifiers */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Optional</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">CIN</label>
            <Input
              value={formData.cin}
              onChange={(e) => onChange("cin", e.target.value.toUpperCase())}
              placeholder="U74999WB2000PTC200542"
              maxLength={21}
            />
            <FieldHint text="21-character Corporate Identity Number (companies only)" />
            {errors.cin && <p className="text-xs text-red-600">{errors.cin}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Udyam Registration No.</label>
            <Input
              value={formData.udyam_number}
              onChange={(e) => onChange("udyam_number", e.target.value.toUpperCase())}
              placeholder="UDYAM-RJ-06-0012345"
            />
            <FieldHint text="Format: UDYAM-[State]-[District]-[7 digits]" />
            {errors.udyam_number && <p className="text-xs text-red-600">{errors.udyam_number}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">SAN / BRN</label>
            <Input
              value={formData.san_brn}
              onChange={(e) => onChange("san_brn", e.target.value)}
              placeholder="e.g. RJ-BRN-2018-00412"
            />
            <FieldHint text="Shop Act Number or Business Registration Number (state-issued)" />
            {errors.san_brn && <p className="text-xs text-red-600">{errors.san_brn}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">ESI Number <span className="font-normal text-slate-400">(ESI Act 1948)</span></label>
            <Input
              value={formData.esi_number}
              onChange={(e) => onChange("esi_number", e.target.value.replace(/\D/g, ""))}
              placeholder="16000571060000999"
              maxLength={17}
            />
            <FieldHint text="17-digit Employees' State Insurance number" />
            {errors.esi_number && <p className="text-xs text-red-600">{errors.esi_number}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">PF Code <span className="font-normal text-slate-400">(EPF Act 1952)</span></label>
            <Input
              value={formData.pf_code}
              onChange={(e) => onChange("pf_code", e.target.value.toUpperCase())}
              placeholder="RJUDR2378824000"
              maxLength={22}
            />
            <FieldHint text="Provident Fund establishment code" />
            {errors.pf_code && <p className="text-xs text-red-600">{errors.pf_code}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Shop Act Reg. No.</label>
            <Input
              value={formData.shop_act_number}
              onChange={(e) => onChange("shop_act_number", e.target.value)}
              placeholder="SCA/2019/4/082341"
              maxLength={30}
            />
            <FieldHint text="Shops & Commercial Establishments Act registration" />
            {errors.shop_act_number && <p className="text-xs text-red-600">{errors.shop_act_number}</p>}
          </div>

          <div className="space-y-1.5 md:col-span-1">
            <label className="text-sm font-medium text-slate-700">DSC Expiry Date</label>
            <Input
              type="date"
              value={formData.dsc_expiry_date}
              onChange={(e) => onChange("dsc_expiry_date", e.target.value)}
            />
            <FieldHint text="Digital Signature Certificate expiry — used for renewal reminders" />
          </div>
        </div>
      </div>
    </div>
  );
}
