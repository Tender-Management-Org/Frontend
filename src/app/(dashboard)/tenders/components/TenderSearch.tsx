import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, Sparkles } from "lucide-react";

interface TenderSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

export function TenderSearch({ value, onChange, onSubmit, onReset, isLoading = false }: TenderSearchProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSubmit();
            }}
            placeholder="Semantic search: describe what opportunity you want"
            className="pl-9"
          />
        </div>
        <Button className="sm:w-auto" onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "Searching..." : "Semantic Search"}
        </Button>
        <Button variant="ghost" className="sm:w-auto" onClick={onReset} disabled={isLoading}>
          Clear
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500">Quick picks:</span>
        <button
          type="button"
          className="rounded-full border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
        >
          Construction
        </button>
        <button
          type="button"
          className="rounded-full border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
        >
          IT Services
        </button>
        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 font-medium text-indigo-700">
          <Sparkles className="h-3 w-3" aria-hidden />
          High fit first
        </span>
      </div>
    </div>
  );
}
