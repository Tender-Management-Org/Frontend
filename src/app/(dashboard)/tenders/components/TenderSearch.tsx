import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TenderSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  searchMode: "semantic" | "keyword" | "hybrid";
  onSearchModeChange: (mode: "semantic" | "keyword" | "hybrid") => void;
  isLoading?: boolean;
}

const modeLabels: Record<"semantic" | "keyword" | "hybrid", string> = {
  hybrid: "Hybrid",
  semantic: "Semantic",
  keyword: "Keyword",
};

const modeDescriptions: Record<"semantic" | "keyword" | "hybrid", string> = {
  hybrid: "Best of both — recommended",
  semantic: "Meaning-based similarity",
  keyword: "Exact term matching",
};

export function TenderSearch({
  value,
  onChange,
  onSubmit,
  onReset,
  searchMode,
  onSearchModeChange,
  isLoading = false,
}: TenderSearchProps) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-4 shadow-card">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden />
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSubmit();
            }}
            placeholder="Describe the opportunity you're looking for…"
            className="pl-9 pr-9"
          />
          {value && (
            <button
              type="button"
              onClick={onReset}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button onClick={onSubmit} disabled={isLoading} className="shrink-0">
          {isLoading ? "Searching…" : "Search"}
        </Button>
      </div>

      {/* Mode selector */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-medium text-ink-400">Mode:</span>
        {(["hybrid", "semantic", "keyword"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => onSearchModeChange(mode)}
            title={modeDescriptions[mode]}
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500",
              searchMode === mode
                ? "border-navy-300 bg-navy-50 text-navy-700"
                : "border-ink-200 bg-white text-ink-600 hover:bg-ink-50"
            )}
          >
            {modeLabels[mode]}
          </button>
        ))}
        <span className="ml-1 hidden text-xs text-ink-400 sm:inline">{modeDescriptions[searchMode]}</span>
      </div>
    </div>
  );
}
