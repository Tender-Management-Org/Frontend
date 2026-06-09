import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { FilterX, SlidersHorizontal } from "lucide-react";

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
  const hasActive =
    values.location || values.minValue || values.maxValue || values.deadlineTo;

  return (
    <Card className="space-y-5 p-5 lg:sticky lg:top-6">
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
          <SlidersHorizontal className="h-4 w-4 text-ink-400" aria-hidden />
          Filters
          {hasActive && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-navy-600 text-2xs font-bold text-white">
              !
            </span>
          )}
        </h3>
        <Button type="button" variant="ghost" size="sm" onClick={onReset} className="gap-1 text-ink-500">
          <FilterX className="h-3.5 w-3.5" aria-hidden />
          Reset
        </Button>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wide text-ink-400">Location</label>
        <Input
          placeholder="City or state"
          value={values.location}
          onChange={(e) => onChange({ ...values, location: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wide text-ink-400">Tender value (₹)</label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={values.minValue}
            onChange={(e) => onChange({ ...values, minValue: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Max"
            value={values.maxValue}
            onChange={(e) => onChange({ ...values, maxValue: e.target.value })}
          />
        </div>
        <p className="text-xs text-ink-400">Enter value in rupees</p>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wide text-ink-400">
            Submission deadline
          </label>
          <span
            title="Shows tenders closing on or before this date"
            className="inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-ink-100 text-2xs font-bold text-ink-500"
          >
            i
          </span>
        </div>
        <Input
          type="date"
          value={values.deadlineTo}
          onChange={(e) => onChange({ ...values, deadlineTo: e.target.value })}
        />
      </div>
    </Card>
  );
}
