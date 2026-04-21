import { Input } from "@/components/ui/Input";

interface DocumentFiltersProps {
  searchTerm: string;
  selectedType: string;
  selectedStatus: string;
  onSearchTermChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onReset: () => void;
  typeOptions: string[];
}

export function DocumentFilters({
  searchTerm,
  selectedType,
  selectedStatus,
  onSearchTermChange,
  onTypeChange,
  onStatusChange,
  onReset,
  typeOptions,
}: DocumentFiltersProps) {
  return (
    <div className="grid gap-3 rounded-xl border border-border bg-white p-4 shadow-sm md:grid-cols-[2fr_1fr_1fr_auto]">
      <Input
        placeholder="Search by document name or type..."
        value={searchTerm}
        onChange={(event) => onSearchTermChange(event.target.value)}
      />

      <select
        className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"
        value={selectedType}
        onChange={(event) => onTypeChange(event.target.value)}
      >
        <option value="all">All Types</option>
        {typeOptions.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <select
        className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"
        value={selectedStatus}
        onChange={(event) => onStatusChange(event.target.value)}
      >
        <option value="all">All Status</option>
        <option value="Verified">Verified</option>
        <option value="Pending">Pending</option>
        <option value="Expired">Expired</option>
      </select>

      <button
        type="button"
        onClick={onReset}
        className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
      >
        Reset
      </button>
    </div>
  );
}
