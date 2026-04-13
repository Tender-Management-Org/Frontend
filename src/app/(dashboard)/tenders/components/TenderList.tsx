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
    <div className="space-y-4">
      {tenders.map((tender) => (
        <TenderCard key={tender.id} tender={tender} />
      ))}
    </div>
  );
}
