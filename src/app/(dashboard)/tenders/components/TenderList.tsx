import { FileSearch } from "lucide-react";
import { TenderCard, type TenderItem } from "./TenderCard";

interface TenderListProps {
  tenders: TenderItem[];
}

export function TenderList({ tenders }: TenderListProps) {
  if (tenders.length === 0) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-white p-8 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-100">
          <FileSearch className="h-7 w-7 text-ink-400" />
        </div>
        <h3 className="text-base font-semibold text-ink-800">No tenders found</h3>
        <p className="mt-1 max-w-xs text-sm text-ink-400">
          Try adjusting your search query or clearing the active filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tenders.map((tender) => (
        <TenderCard key={tender.id} tender={tender} />
      ))}
    </div>
  );
}
