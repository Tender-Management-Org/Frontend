import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SlidersHorizontal } from "lucide-react";

export type TenderFilterValues = {
  location: string;
  minValue: string;
  maxValue: string;
  deadlineTo: string;
};

type TenderFiltersProps = {
  values: TenderFilterValues;
  onChange: (next: TenderFilterValues) => void;
  onReset: () => void;
};

export function TenderFilters({ values, onChange, onReset }: TenderFiltersProps) {
  return (
    <Card className="space-y-5 lg:sticky lg:top-20">
      <div className="flex items-center justify-between">
        <h3 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
          <SlidersHorizontal className="h-4 w-4 text-slate-500" aria-hidden />
          Filters
        </h3>
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
        <p className="text-xs text-slate-600">
          Narrow the list to focus on tenders your team can act on quickly.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">Location</p>
        <Input
          placeholder="Enter city or state"
          value={values.location}
          onChange={(event) => onChange({ ...values, location: event.target.value })}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">Tender Value</p>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={values.minValue}
            onChange={(event) => onChange({ ...values, minValue: event.target.value })}
          />
          <Input
            type="number"
            placeholder="Max"
            value={values.maxValue}
            onChange={(event) => onChange({ ...values, maxValue: event.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <p className="inline-flex items-center gap-1 text-sm font-medium text-slate-700">
          Deadline
          <button
            type="button"
            aria-label="Deadline means bid submission end date"
            title="Deadline means Bid Submission End Date. Tenders closing on or before the selected date are shown."
            className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-[10px] font-semibold text-slate-500"
          >
            i
          </button>
        </p>
        <Input
          type="date"
          value={values.deadlineTo}
          onChange={(event) => onChange({ ...values, deadlineTo: event.target.value })}
        />
      </div>
    </Card>
  );
}
