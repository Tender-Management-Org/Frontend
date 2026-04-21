import { Button } from "@/components/ui/Button";
import { mapTenderDetailToLegacyShape } from "@/lib/api/tenderAdapters";
import { ApiError } from "@/lib/api/client";
import { getTenderDetail } from "@/lib/api/tenders";
import type { TenderDetail } from "@/types/tenderDetail";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionBar } from "./components/ActionBar";
import { TenderDetailView } from "./components/TenderDetailView";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { id: string };
};

export default async function TenderDetailPage({ params }: PageProps) {
  const id = decodeURIComponent(params.id);
  let tender: TenderDetail;
  try {
    const detail = await getTenderDetail(id);
    tender = mapTenderDetailToLegacyShape(detail);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const title = tender.work_items.title;
  const subtitle = tender.basic_details.organisation_chain;
  const bidSubmissionEnd = tender.critical_dates.bid_submission_end_date;

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

        <div className="relative overflow-hidden rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-50 to-transparent" />

          <div className="relative flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <span className="inline-flex w-fit items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                {tender.basic_details.tender_category}
              </span>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
                <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
                <p className="mt-2 text-xs text-slate-500">Tender ID: {tender.basic_details.tender_id}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 md:justify-end">
              <Button variant="secondary">Interested</Button>
              <Button variant="ghost" className="border border-border">
                Ignore
              </Button>
              <Button>Apply Now</Button>
            </div>
          </div>

          <div className="relative mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Tender value</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                INR {Math.round(tender.work_items.tender_value).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Bid validity</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{tender.work_items.bid_validity_days} days</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Contract type</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{tender.work_items.contract_type}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Submission closes</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {bidSubmissionEnd ? new Date(bidSubmissionEnd).toLocaleString() : "Not specified"}
              </p>
            </div>
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
