import { getTenders } from "@/lib/api/tenders";
import { mapTenderListItemToUi } from "@/lib/api/tenderAdapters";
import { CalendarDays, FileSearch, Flame } from "lucide-react";
import { TenderFilters } from "./components/TenderFilters";
import type { TenderItem } from "./components/TenderCard";
import { TenderList } from "./components/TenderList";
import { TenderSearch } from "./components/TenderSearch";

export const dynamic = "force-dynamic";

export default async function TendersPage() {
  let tenders: TenderItem[] = [];

  try {
    const response = await getTenders({ is_active: true });
    tenders = response.results.map(mapTenderListItemToUi);
  } catch (error) {
    console.error("Failed to load tenders", error);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const closingSoonCount = tenders.filter((tender) => {
    const date = new Date(tender.deadline);
    if (Number.isNaN(date.getTime())) return false;
    date.setHours(0, 0, 0, 0);
    const days = Math.round((date.getTime() - today.getTime()) / 86400000);
    return days >= 0 && days <= 7;
  }).length;

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-slate-50 p-5 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Tender dashboard</h2>
        <p className="mt-1 text-sm text-slate-500">Discover, shortlist, and act on opportunities before deadlines close.</p>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Active tenders</p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-slate-900">{tenders.length}</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 px-3 py-2.5">
            <p className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-amber-800">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden />
              Closing in 7 days
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-amber-700">{closingSoonCount}</p>
          </div>
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 px-3 py-2.5">
            <p className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-indigo-800">
              <Flame className="h-3.5 w-3.5" aria-hidden />
              Suggested focus
            </p>
            <p className="mt-1 text-sm font-medium text-indigo-700">
              Review urgent tenders first
            </p>
          </div>
        </div>
      </div>

      <TenderSearch />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3">
          <TenderFilters />
        </div>

        <div className="col-span-12 lg:col-span-9">
          <TenderList tenders={tenders} />
        </div>
      </div>
    </section>
  );
}
