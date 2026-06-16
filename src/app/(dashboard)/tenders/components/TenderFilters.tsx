import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { FilterX, SlidersHorizontal } from "lucide-react";

export type TenderStatus = "active" | "closing_soon" | "closed" | "all";

export type TenderFilterValues = {
  location: string;
  status: TenderStatus;
};

const STATUS_OPTIONS: { value: TenderStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "closing_soon", label: "Closing Soon" },
  { value: "closed", label: "Closed" },
  { value: "all", label: "All" },
];

type TenderFiltersProps = {
  values: TenderFilterValues;
  onChange: (next: TenderFilterValues) => void;
  onReset: () => void;
};

export function TenderFilters({ values, onChange, onReset }: TenderFiltersProps) {
  const hasActive = values.location || values.status !== "active";

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

      {/* Status filter */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wide text-ink-400">Status</label>
        <div className="flex flex-wrap gap-1.5">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ ...values, status: opt.value })}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                values.status === opt.value
                  ? opt.value === "active"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : opt.value === "closing_soon"
                    ? "border-warning-500 bg-warning-50 text-warning-700"
                    : opt.value === "closed"
                    ? "border-danger-400 bg-danger-50 text-danger-700"
                    : "border-navy-500 bg-navy-50 text-navy-700"
                  : "border-ink-200 bg-white text-ink-500 hover:border-ink-300 hover:text-ink-700"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wide text-ink-400">Location</label>
        <Input
          placeholder="City or state"
          value={values.location}
          onChange={(e) => onChange({ ...values, location: e.target.value })}
        />
      </div>
    </Card>
  );
}
