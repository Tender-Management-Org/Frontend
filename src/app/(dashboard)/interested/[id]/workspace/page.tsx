import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, CheckCircle2, FileSearch, ListChecks } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { mapTenderDetailToLegacyShape } from "@/lib/api/tenderAdapters";
import { ApiError } from "@/lib/api/client";
import { getTenderDetail } from "@/lib/api/tenders";
import type { TenderDetail } from "@/types/tenderDetail";
import { TenderDetailView } from "../../../tenders/[id]/components/TenderDetailView";

type PageProps = {
  params: { id: string };
};

export const dynamic = "force-dynamic";

export default async function InterestedTenderWorkspacePage({ params }: PageProps) {
  const id = decodeURIComponent(params.id);
  let tender: TenderDetail;

  try {
    const detail = await getTenderDetail(id);
    tender = mapTenderDetailToLegacyShape(detail);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    if (error instanceof ApiError && error.status === 401) {
      redirect(`/login?next=${encodeURIComponent(`/interested/${id}/workspace`)}`);
    }
    throw error;
  }

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <Link
          href="/interested"
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Interested dashboard
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-violet-50 via-white to-indigo-50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Filing workspace</p>
              <h1 className="text-2xl font-semibold text-slate-900">{tender.work_items.title}</h1>
              <p className="text-sm text-slate-600">{tender.basic_details.organisation_chain}</p>
            </div>
            <span className="inline-flex h-8 items-center rounded-full bg-violet-100 px-3 text-xs font-medium text-violet-700">
              Interested
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-8">
          <TenderDetailView data={tender} />
        </div>

        <div className="col-span-12 space-y-6 xl:col-span-4">
          <Card className="space-y-3">
            <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
              <FileSearch className="h-4 w-4 text-slate-500" />
              Document Intelligence
            </h2>
            <p className="text-sm text-slate-600">
              Extraction workflow will surface all required filing documents and compliance requirements here.
            </p>
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-500">
              Status: Not started
            </div>
          </Card>

          <Card className="space-y-3">
            <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
              <ListChecks className="h-4 w-4 text-slate-500" />
              Filing Checklist
            </h2>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-slate-300" />
                Required documents (pending extraction)
              </li>
              <li className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-slate-300" />
                Clause highlights (pending extraction)
              </li>
              <li className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-slate-300" />
                Compliance risks (pending extraction)
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}
