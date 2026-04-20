import { getTenders } from "@/lib/api/tenders";
import { mapTenderListItemToUi } from "@/lib/api/tenderAdapters";
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

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Tenders</h2>
        <p className="text-sm text-slate-500">Discover and track relevant opportunities for your firm.</p>
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
