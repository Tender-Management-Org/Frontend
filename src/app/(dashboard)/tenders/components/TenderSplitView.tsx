"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  Building2,
  CalendarDays,
  FileSearch,
  IndianRupee,
  MapPin,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { tenderDetailHref } from "@/lib/tenders/path";
import { deadlineMeta, formatSource, type TenderItem } from "./TenderCard";

const TONE_DOT = {
  danger: "bg-danger-500",
  warning: "bg-warning-500",
  neutral: "bg-ink-300",
} as const;

const TONE_TEXT = {
  danger: "text-danger-700",
  warning: "text-warning-700",
  neutral: "text-ink-500",
} as const;

/**
 * Master–detail triage view. The detail pane renders from the row we already
 * have rather than re-fetching, so selection is instant and there is no loading
 * state to manage; the full record stays one click away.
 */
export function TenderSplitView({ tenders }: { tenders: TenderItem[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(tenders[0]?.id ?? null);
  const listRef = useRef<HTMLUListElement>(null);

  // Keep the selection valid when the page, filters or sort change.
  useEffect(() => {
    if (tenders.length === 0) {
      setSelectedId(null);
      return;
    }
    setSelectedId((current) =>
      current && tenders.some((t) => t.id === current) ? current : tenders[0].id
    );
  }, [tenders]);

  const selectedIndex = useMemo(
    () => tenders.findIndex((t) => t.id === selectedId),
    [tenders, selectedId]
  );
  const selected = selectedIndex >= 0 ? tenders[selectedIndex] : undefined;

  /** ↑/↓ move through the list, the way a triage queue should behave. */
  function handleKeyDown(event: React.KeyboardEvent<HTMLUListElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const delta = event.key === "ArrowDown" ? 1 : -1;
    const next = Math.min(tenders.length - 1, Math.max(0, selectedIndex + delta));
    const nextId = tenders[next]?.id;
    if (!nextId) return;
    setSelectedId(nextId);
    listRef.current
      ?.querySelector<HTMLElement>(`[data-tender-index="${next}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }

  if (tenders.length === 0) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-white p-8 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-100">
          <FileSearch className="h-7 w-7 text-ink-400" />
        </div>
        <h3 className="text-base font-semibold text-ink-800">No tenders found</h3>
        <p className="mt-1 max-w-xs text-sm text-ink-400">
          Try adjusting your search query or clearing the active filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
      {/* ── Master list ─────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card">
        <ul
          ref={listRef}
          tabIndex={0}
          role="listbox"
          aria-label="Tenders"
          aria-activedescendant={selected ? `tender-option-${selected.id}` : undefined}
          onKeyDown={handleKeyDown}
          className="max-h-[calc(100svh-13rem)] divide-y divide-ink-100 overflow-y-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-navy-500/40"
        >
          {tenders.map((tender, index) => {
            const dl = deadlineMeta(tender.deadline);
            const isSelected = tender.id === selectedId;
            return (
              <li key={tender.id} data-tender-index={index}>
                <button
                  type="button"
                  id={`tender-option-${tender.id}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => setSelectedId(tender.id)}
                  className={cn(
                    "flex w-full items-start gap-2 px-3 py-2.5 text-left transition-colors",
                    isSelected ? "bg-navy-50" : "hover:bg-ink-50"
                  )}
                >
                  <span
                    className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", TONE_DOT[dl.tone])}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block truncate text-xs font-medium",
                        isSelected ? "text-navy-800" : "text-ink-800"
                      )}
                    >
                      {tender.title}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-2xs text-ink-400">
                      <span className="truncate">{tender.location}</span>
                      <span aria-hidden>·</span>
                      <span className="shrink-0 tabular-nums">{tender.value}</span>
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className={cn("block text-2xs font-medium", TONE_TEXT[dl.tone])}>{dl.hint}</span>
                    {tender.isInterested && (
                      <Bookmark
                        className="ml-auto mt-0.5 h-3 w-3 fill-violet-500 text-violet-500"
                        aria-label="Interested"
                      />
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ── Detail pane ─────────────────────────────────────────────────── */}
      <div className="hidden overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card lg:block">
        {selected && <DetailPane tender={selected} />}
      </div>
    </div>
  );
}

function DetailPane({ tender }: { tender: TenderItem }) {
  const dl = deadlineMeta(tender.deadline);

  return (
    <article className="flex max-h-[calc(100svh-13rem)] flex-col overflow-y-auto">
      <header className="border-b border-ink-100 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold leading-snug text-ink-900">{tender.title}</h2>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-500">
              <Building2 className="h-3.5 w-3.5 shrink-0 text-ink-400" aria-hidden />
              {tender.organization}
            </p>
            <p className="mt-1 font-mono text-2xs text-ink-400">#{tender.id}</p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1.5">
            {typeof tender.similarityScore === "number" && (
              <span className="inline-flex items-center gap-1 rounded-full border border-navy-200 bg-navy-50 px-2 py-0.5 text-2xs font-bold tabular-nums text-navy-700">
                <Sparkles className="h-3 w-3" aria-hidden />
                {Math.round(tender.similarityScore * 100)}% match
              </span>
            )}
            {tender.isInterested && (
              <span className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-2xs font-semibold text-violet-700">
                Interested
              </span>
            )}
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-2xs font-semibold",
                dl.tone === "danger" && "border border-danger-200 bg-danger-50 text-danger-700",
                dl.tone === "warning" && "border border-warning-200 bg-warning-50 text-warning-700",
                dl.tone === "neutral" && "bg-ink-100 text-ink-600"
              )}
            >
              {dl.hint}
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-2 px-5 py-4">
        {[
          { label: "Location", value: tender.location, Icon: MapPin },
          { label: "Tender value", value: tender.value, Icon: IndianRupee },
          { label: "Closing date", value: dl.label, Icon: CalendarDays },
        ].map((cell) => (
          <div key={cell.label} className="rounded-xl bg-ink-50 px-3 py-2">
            <p className="text-2xs font-semibold uppercase tracking-widest text-ink-400">{cell.label}</p>
            <p className="mt-1 flex items-center gap-1.5 truncate text-sm font-semibold text-ink-800">
              <cell.Icon className="h-3.5 w-3.5 shrink-0 text-ink-400" aria-hidden />
              {cell.value}
            </p>
          </div>
        ))}
      </div>

      {tender.description && (
        <div className="border-t border-ink-100 px-5 py-4">
          <p className="text-2xs font-semibold uppercase tracking-widest text-ink-400">Summary</p>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-600">
            {tender.description}
          </p>
        </div>
      )}

      <footer className="mt-auto flex items-center justify-between gap-3 border-t border-ink-100 px-5 py-3">
        {tender.source ? (
          <span className="inline-flex items-center rounded-full border border-ink-200 bg-ink-50 px-2.5 py-0.5 text-2xs font-medium text-ink-500">
            {formatSource(tender.source)}
          </span>
        ) : (
          <span />
        )}
        <Link
          href={tenderDetailHref(tender.id)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-ink-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500"
        >
          Open full tender
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </footer>
    </article>
  );
}
