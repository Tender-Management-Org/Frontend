import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { mapTenderDetailToLegacyShape } from "@/lib/api/tenderAdapters";
import { ApiError } from "@/lib/api/client";
import { getTenderDetail } from "@/lib/api/tenders";
import type { TenderDetail } from "@/types/tenderDetail";
import { FilingWorkspaceShell } from "./FilingWorkspaceShell";

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
    if (error instanceof ApiError && error.status === 404) notFound();
    if (error instanceof ApiError && error.status === 401)
      redirect(`/login?next=${encodeURIComponent(`/interested/${id}/workspace`)}`);
    throw error;
  }

  return (
    <section className="mx-auto w-full max-w-7xl space-y-5">
      <Link
        href="/interested"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 rounded-md"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to interested tenders
      </Link>

      <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-500">Filing workspace</p>
            <h1 className="mt-1 text-xl font-bold text-ink-900">{tender.work_items.title}</h1>
            <p className="mt-0.5 text-sm text-ink-500">{tender.basic_details.organisation_chain}</p>
          </div>
          <span className="shrink-0 rounded-full border border-violet-200 bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
            Interested
          </span>
        </div>
      </div>

      <FilingWorkspaceShell tenderId={id} tender={tender} />
    </section>
  );
}
