import { FileSearch } from "lucide-react";
import { TenderCard, type TenderItem } from "./TenderCard";

interface TenderListProps {
  tenders: TenderItem[];
}

export function TenderList({ tenders }: TenderListProps) {
  if (tenders.length === 0) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-slate-50 p-8 text-center">
        <FileSearch className="mb-3 h-10 w-10 text-slate-400" />
        <h3 className="text-lg font-semibold text-slate-800">No tenders found</h3>
        <p className="mt-1 text-sm text-slate-500">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
        <p className="text-sm text-slate-600">
          Showing <span className="font-semibold tabular-nums text-slate-900">{tenders.length}</span> active tenders
        </p>
        <p className="text-xs text-slate-500">Sorted by latest updates</p>
      </div>
      {tenders.map((tender) => (
        <TenderCard key={tender.id} tender={tender} />
      ))}
    </div>
  );
}
