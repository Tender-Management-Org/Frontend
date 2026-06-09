import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Brain, Circle, Clock3, FileSearch, ListChecks, Sparkles } from "lucide-react";
import { mapTenderDetailToLegacyShape } from "@/lib/api/tenderAdapters";
import { ApiError } from "@/lib/api/client";
import { getTenderDetail } from "@/lib/api/tenders";
import type { TenderDetail } from "@/types/tenderDetail";
import { TenderDetailView } from "../../../tenders/[id]/components/TenderDetailView";

type PageProps = {
  params: { id: string };
};

export const dynamic = "force-dynamic";

const checklistItems = [
  {
    label: "Required documents",
    description: "Extracted from NIT PDFs",
    status: "pending",
  },
  {
    label: "Clause highlights",
    description: "Key eligibility requirements",
    status: "pending",
  },
  {
    label: "Compliance risks",
    description: "Potential disqualification flags",
    status: "pending",
  },
];

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
      {/* Back */}
      <Link
        href="/interested"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 rounded-md"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to interested tenders
      </Link>

      {/* Hero */}
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

      {/* Content */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 xl:col-span-8">
          <TenderDetailView data={tender} />
        </div>

        <div className="col-span-12 space-y-4 xl:col-span-4">
          {/* Document Intelligence */}
          <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-50">
                <Brain className="h-4 w-4 text-navy-600" aria-hidden />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-ink-900">Document Intelligence</h2>
                <p className="text-xs text-ink-400">AI extraction from NIT PDFs</p>
              </div>
            </div>

            <div className="rounded-xl border border-dashed border-ink-200 bg-ink-50 p-4 text-center">
              <Sparkles className="mx-auto mb-2 h-6 w-6 text-ink-300" aria-hidden />
              <p className="text-xs font-semibold text-ink-600">Not started</p>
              <p className="mt-1 text-xs text-ink-400">
                AI analysis will extract required documents, eligibility criteria, and compliance requirements from NIT PDFs.
              </p>
            </div>

            <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-navy-100 bg-navy-50 px-3 py-2">
              <Clock3 className="h-3.5 w-3.5 shrink-0 text-navy-500" aria-hidden />
              <p className="text-xs text-navy-700">Coming soon — document parsing is in active development.</p>
            </div>
          </div>

          {/* Filing Checklist */}
          <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
                <ListChecks className="h-4 w-4 text-violet-600" aria-hidden />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-ink-900">Filing Checklist</h2>
                <p className="text-xs text-ink-400">Track your bid preparation progress</p>
              </div>
            </div>

            <ul className="space-y-3">
              {checklistItems.map((item) => (
                <li
                  key={item.label}
                  className="flex items-start gap-3 rounded-xl border border-dashed border-ink-200 bg-ink-50 p-3"
                >
                  <Circle className="mt-0.5 h-4 w-4 shrink-0 text-ink-300" aria-hidden />
                  <div>
                    <p className="text-xs font-semibold text-ink-600">{item.label}</p>
                    <p className="mt-0.5 text-xs text-ink-400">{item.description}</p>
                  </div>
                  <span className="ml-auto shrink-0 rounded-full bg-ink-100 px-2 py-0.5 text-2xs font-medium text-ink-500">
                    Pending
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tender docs quick link */}
          <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
            <div className="flex items-center gap-2">
              <FileSearch className="h-4 w-4 text-ink-400" aria-hidden />
              <h2 className="text-sm font-semibold text-ink-900">Tender documents</h2>
            </div>
            <p className="mt-2 text-xs text-ink-400">
              View all NIT PDFs and work item documents in the Documents tab of the tender detail above.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
