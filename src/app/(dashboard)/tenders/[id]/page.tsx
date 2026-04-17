import { Button } from "@/components/ui/Button";
import { getTenderDetail } from "@/lib/tenders";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionBar } from "./components/ActionBar";
import { TenderDetailView } from "./components/TenderDetailView";

type PageProps = {
  params: { id: string };
};

export default function TenderDetailPage({ params }: PageProps) {
  const id = decodeURIComponent(params.id);
  const tender = getTenderDetail(id);
  if (!tender) {
    notFound();
  }

  const title = tender.work_items.title;
  const subtitle = tender.basic_details.organisation_chain;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4">
        <Link
          href="/tenders"
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to tenders
        </Link>

        <div className="flex flex-col gap-4 rounded-xl border border-border bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            <p className="mt-1 text-xs text-slate-400">Tender ID: {tender.basic_details.tender_id}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary">Interested</Button>
            <Button variant="ghost" className="border border-border">
              Ignore
            </Button>
            <Button>Apply Now</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 space-y-6 lg:col-span-8">
          <TenderDetailView data={tender} />
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="space-y-6 lg:sticky lg:top-24">
            <ActionBar />
          </div>
        </div>
      </div>
    </section>
  );
}
