"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bookmark, ChevronRight, FileSearch } from "lucide-react";
import { cn } from "@/lib/utils";
import { tenderDetailHref } from "@/lib/tenders/path";
import { deadlineMeta, formatSource, type TenderItem } from "./TenderCard";

interface TenderTableProps {
  tenders: TenderItem[];
  /** `compact` drops the secondary line and tightens rows to ~32px. */
  density?: "comfortable" | "compact";
}

const toneDot: Record<"danger" | "warning" | "neutral", string> = {
  danger: "bg-danger-500",
  warning: "bg-warning-500",
  neutral: "bg-ink-300 dark:bg-ink-700",
};

const toneText: Record<"danger" | "warning" | "neutral", string> = {
  danger: "text-danger-700 dark:text-danger-400",
  warning: "text-warning-700 dark:text-warning-400",
  neutral: "text-ink-500 dark:text-ink-400",
};

function EmptyState() {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 dark:border-ink-800 bg-surface p-8 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-100 dark:bg-ink-900">
        <FileSearch className="h-7 w-7 text-ink-400 dark:text-ink-600" />
      </div>
      <h3 className="text-base font-semibold text-ink-800 dark:text-ink-100">No tenders found</h3>
      <p className="mt-1 max-w-xs text-sm text-ink-400 dark:text-ink-600">
        Try adjusting your search query or clearing the active filters.
      </p>
    </div>
  );
}

export function TenderTable({ tenders, density = "comfortable" }: TenderTableProps) {
  const router = useRouter();
  const isCompact = density === "compact";

  if (tenders.length === 0) return <EmptyState />;

  function handleRowActivate(event: React.MouseEvent<HTMLElement>, id: string) {
    // Let real links (and modifier-clicks for new tabs) behave normally.
    if ((event.target as HTMLElement).closest("a")) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    router.push(tenderDetailHref(id));
  }

  return (
    <div className="rounded-2xl border border-ink-200 dark:border-ink-800 bg-surface shadow-card">
      {/* ---------- Desktop: dense table ---------- */}
      <table className="hidden w-full table-fixed border-collapse md:table">
        {/* Sticky under the command bar (~7.5rem) so columns stay labelled. */}
        <thead className="sticky top-[7.5rem] z-10">
          <tr className="border-b border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 [&>th:first-child]:rounded-tl-2xl [&>th:last-child]:rounded-tr-2xl">
            <th className="w-[44%] px-4 py-2.5 text-left text-2xs font-semibold uppercase tracking-widest text-ink-400 dark:text-ink-600">
              Tender
            </th>
            <th className="w-[19%] px-3 py-2.5 text-left text-2xs font-semibold uppercase tracking-widest text-ink-400 dark:text-ink-600">
              Organization
            </th>
            <th className="w-[12%] px-3 py-2.5 text-left text-2xs font-semibold uppercase tracking-widest text-ink-400 dark:text-ink-600">
              Location
            </th>
            <th className="w-[11%] px-3 py-2.5 text-right text-2xs font-semibold uppercase tracking-widest text-ink-400 dark:text-ink-600">
              Value
            </th>
            <th className="w-[14%] px-4 py-2.5 text-right text-2xs font-semibold uppercase tracking-widest text-ink-400 dark:text-ink-600">
              Deadline
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100 dark:divide-ink-900">
          {tenders.map((tender) => {
            const dl = deadlineMeta(tender.deadline);
            return (
              <tr
                key={tender.id}
                onClick={(e) => handleRowActivate(e, tender.id)}
                className={cn(
                  "group cursor-pointer transition-colors hover:bg-navy-50/40 dark:hover:bg-navy-900/40",
                  isCompact && "[&>td]:py-1"
                )}
              >
                <td className="px-4 py-2.5 align-middle">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn("h-1.5 w-1.5 shrink-0 rounded-full", toneDot[dl.tone])}
                      title={dl.hint}
                      aria-hidden
                    />
                    <Link
                      href={tenderDetailHref(tender.id)}
                      title={tender.title}
                      className="truncate text-sm font-medium text-ink-800 dark:text-ink-100 transition-colors group-hover:text-navy-700 dark:group-hover:text-navy-500 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:focus-visible:ring-navy-400 rounded-sm"
                    >
                      {tender.title}
                    </Link>
                    {tender.isInterested && (
                      <Bookmark
                        className="h-3.5 w-3.5 shrink-0 fill-violet-500 text-violet-500"
                        aria-label="Interested"
                      />
                    )}
                    {typeof tender.similarityScore === "number" && (
                      <span className="shrink-0 rounded bg-navy-50 dark:bg-navy-900 px-1.5 py-0.5 text-2xs font-semibold tabular-nums text-navy-700 dark:text-navy-500">
                        {Math.round(tender.similarityScore * 100)}%
                      </span>
                    )}
                  </div>
                  {!isCompact && (
                    <div className="mt-0.5 flex items-center gap-2 pl-3.5">
                      <span className="truncate font-mono text-2xs text-ink-400 dark:text-ink-600">#{tender.id}</span>
                      {tender.source && (
                        <span className="shrink-0 text-2xs text-ink-300 dark:text-ink-700">{formatSource(tender.source)}</span>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-3 py-2.5 align-middle">
                  <span className="block truncate text-xs text-ink-600 dark:text-ink-300" title={tender.organization}>
                    {tender.organization}
                  </span>
                </td>
                <td className="px-3 py-2.5 align-middle">
                  <span className="block truncate text-xs text-ink-600 dark:text-ink-300" title={tender.location}>
                    {tender.location}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-right align-middle">
                  <span className="block truncate text-xs font-semibold tabular-nums text-ink-800 dark:text-ink-100">
                    {tender.value}
                  </span>
                </td>
                <td className="px-4 py-2.5 align-middle">
                  <div className="flex items-center justify-end gap-2">
                    <div className={cn("min-w-0 text-right", isCompact && "flex items-baseline justify-end gap-1.5")}>
                      <span className="block truncate text-xs tabular-nums text-ink-700 dark:text-ink-200">{dl.label}</span>
                      <span className={cn("block truncate text-2xs font-medium", toneText[dl.tone])}>
                        {dl.hint}
                      </span>
                    </div>
                    <ChevronRight
                      className="h-4 w-4 shrink-0 text-ink-300 dark:text-ink-700 transition-transform group-hover:translate-x-0.5 group-hover:text-navy-600 dark:group-hover:text-navy-400"
                      aria-hidden
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ---------- Mobile: stacked compact rows ---------- */}
      <ul className="divide-y divide-ink-100 dark:divide-ink-900 overflow-hidden rounded-2xl md:hidden">
        {tenders.map((tender) => {
          const dl = deadlineMeta(tender.deadline);
          return (
            <li key={tender.id}>
              <Link
                href={tenderDetailHref(tender.id)}
                className="block px-4 py-3 transition-colors active:bg-ink-50 dark:active:bg-ink-950"
              >
                <div className="flex items-start gap-2">
                  <span
                    className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", toneDot[dl.tone])}
                    aria-hidden
                  />
                  <span className="line-clamp-2 flex-1 text-sm font-medium text-ink-800 dark:text-ink-100">
                    {tender.title}
                  </span>
                  {tender.isInterested && (
                    <Bookmark
                      className="h-3.5 w-3.5 shrink-0 fill-violet-500 text-violet-500"
                      aria-label="Interested"
                    />
                  )}
                </div>
                <div className="mt-1 flex items-center gap-2 pl-3.5 text-2xs text-ink-400 dark:text-ink-600">
                  <span className="truncate">{tender.organization}</span>
                  <span aria-hidden>·</span>
                  <span className="shrink-0">{tender.location}</span>
                </div>
                <div className="mt-1 flex items-center justify-between pl-3.5">
                  <span className="text-xs font-semibold tabular-nums text-ink-800 dark:text-ink-100">{tender.value}</span>
                  <span className={cn("text-2xs font-medium", toneText[dl.tone])}>
                    {dl.label} · {dl.hint}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
