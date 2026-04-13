import { Card } from "@/components/ui/Card";

interface TenderFeesProps {
  emdAmount: string;
  emdExemptionAllowed: string;
  tenderFeeAmount: string;
  payableTo: string;
  payableAt: string;
}

export function TenderFees({
  emdAmount,
  emdExemptionAllowed,
  tenderFeeAmount,
  payableTo,
  payableAt
}: TenderFeesProps) {
  return (
    <Card className="space-y-4">
      <h3 className="text-base font-semibold text-slate-900">Fees</h3>

      <div className="space-y-3 text-sm">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="font-medium text-slate-900">EMD</p>
          <p className="mt-1 text-slate-600">Amount: {emdAmount}</p>
          <p className="text-slate-600">Exemption Allowed: {emdExemptionAllowed}</p>
        </div>

        <div className="rounded-lg bg-slate-50 p-3">
          <p className="font-medium text-slate-900">Tender Fee</p>
          <p className="mt-1 text-slate-600">Fee Amount: {tenderFeeAmount}</p>
          <p className="text-slate-600">Payable To: {payableTo}</p>
          <p className="text-slate-600">Payable At: {payableAt}</p>
        </div>
      </div>
    </Card>
  );
}
