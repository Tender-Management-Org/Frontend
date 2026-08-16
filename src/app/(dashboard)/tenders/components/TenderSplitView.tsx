"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Bookmark,
  Building2,
  CalendarDays,
  Download,
  FileSearch,
  FileText,
  IndianRupee,
  MapPin,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { tenderDetailHref } from "@/lib/tenders/path";
import { getTenderDetail } from "@/lib/api/tenders";
import { mapTenderDetailToLegacyShape } from "@/lib/api/tenderAdapters";
import type { TenderDetail } from "@/types/tenderDetail";
import { deadlineMeta, formatSource, type TenderItem } from "./TenderCard";

const TONE_DOT = {
  danger: "bg-danger-500",
  warning: "bg-warning-500",
  neutral: "bg-ink-300 dark:bg-ink-700",
} as const;

const TONE_TEXT = {
  danger: "text-danger-700 dark:text-danger-400",
  warning: "text-warning-700 dark:text-warning-400",
  neutral: "text-ink-500 dark:text-ink-400",
} as const;

/* ── Local formatters (the adapter's are module-private) ─────────────────── */

function inr(value: number | null | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function fmtDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

function fmtKb(kb: number | null | undefined): string {
  if (typeof kb !== "number" || !Number.isFinite(kb) || kb <= 0) return "";
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
}

/**
 * Master–detail triage view.
 *
 * The header and meta cells render from the row we already have, so selection
 * is instant; the rest of the record is fetched per tender and cached, because
 * the list payload carries no EMD, dates, eligibility or documents — its
 * `description` is literally a copy of the title.
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
      <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 dark:border-ink-800 bg-surface p-8 text-center">
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

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
      {/* ── Master list ─────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-ink-200 dark:border-ink-800 bg-surface shadow-card">
        <ul
          ref={listRef}
          tabIndex={0}
          role="listbox"
          aria-label="Tenders"
          aria-activedescendant={selected ? `tender-option-${selected.id}` : undefined}
          onKeyDown={handleKeyDown}
          className="max-h-[calc(100svh-13rem)] divide-y divide-ink-100 dark:divide-ink-900 overflow-y-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-navy-500/40"
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
                    isSelected ? "bg-navy-50 dark:bg-accent-blue-bg" : "hover:bg-ink-50 dark:hover:bg-ink-950"
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
                        isSelected ? "text-navy-800 dark:text-accent-blue" : "text-ink-800 dark:text-ink-100"
                      )}
                    >
                      {tender.title}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-2xs text-ink-400 dark:text-ink-600">
                      <span className="truncate">{tender.location}</span>
                      <span aria-hidden>·</span>
                      <span className="shrink-0 tabular-nums">{tender.value}</span>
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className={cn("block text-2xs font-medium", TONE_TEXT[dl.tone])}>{dl.hint}</span>
                    {tender.isInterested && (
                      <Bookmark
                        className="ml-auto mt-0.5 h-3 w-3 fill-violet-500 dark:fill-accent-purple text-violet-500 dark:text-accent-purple"
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
      <div className="hidden overflow-hidden rounded-2xl border border-ink-200 dark:border-ink-800 bg-surface shadow-card lg:block">
        {selected && <DetailPane tender={selected} />}
      </div>
    </div>
  );
}

/* ── Small presentational atoms ──────────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-ink-100 dark:border-ink-900 px-5 py-4">
      <h3 className="text-2xs font-semibold uppercase tracking-widest text-ink-400 dark:text-ink-600">{title}</h3>
      <div className="mt-2.5">{children}</div>
    </section>
  );
}

function Field({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="text-2xs text-ink-400 dark:text-ink-600">{label}</p>
      <p
        className={cn(
          "mt-0.5 truncate text-sm tabular-nums",
          accent ? "font-semibold text-ink-900 dark:text-ink-50" : "text-ink-700 dark:text-ink-200"
        )}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

function SkeletonBlock({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-2" aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-3 animate-pulse rounded-full bg-ink-100 dark:bg-ink-900"
          style={{ width: `${92 - i * 14}%` }}
        />
      ))}
    </div>
  );
}

/* ── Detail pane ─────────────────────────────────────────────────────────── */

function DetailPane({ tender }: { tender: TenderItem }) {
  const dl = deadlineMeta(tender.deadline);

  const cacheRef = useRef(new Map<string, TenderDetail>());
  const paneRef = useRef<HTMLElement>(null);
  const [detail, setDetail] = useState<TenderDetail | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  // The pane is not remounted between selections, so scroll has to be reset.
  useEffect(() => {
    paneRef.current?.scrollTo({ top: 0 });
  }, [tender.id]);

  useEffect(() => {
    const cached = cacheRef.current.get(tender.id);
    if (cached) {
      setDetail(cached);
      setState("idle");
      return;
    }

    let cancelled = false;
    setDetail(null);
    setState("loading");

    getTenderDetail(tender.id)
      .then((api) => {
        if (cancelled) return;
        const mapped = mapTenderDetailToLegacyShape(api);
        cacheRef.current.set(tender.id, mapped);
        setDetail(mapped);
        setState("idle");
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [tender.id]);

  const work = detail?.work_items;
  const dates = detail?.critical_dates;
  const emd = detail?.emd_fee_details;
  const fees = detail?.tender_fee_details;
  const docs = [
    ...(detail?.tender_documents?.nit_documents ?? []),
    ...(detail?.tender_documents?.work_item_documents ?? []),
  ];
  const corrigenda = detail?.latest_corrigendum_list ?? [];

  /* The list's `description` is a copy of the title, so only show prose that
     actually differs from the heading. */
  const workDescription =
    work?.work_description && work.work_description.trim() !== tender.title.trim()
      ? work.work_description
      : null;
  const preQualification = work?.pre_qualification_details?.trim() || null;

  return (
    <article ref={paneRef} className="flex max-h-[calc(100svh-13rem)] flex-col overflow-y-auto">
      {/* Header — instant, from the row */}
      <header className="px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold leading-snug text-ink-900 dark:text-ink-50">{tender.title}</h2>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-400">
              <Building2 className="h-3.5 w-3.5 shrink-0 text-ink-400 dark:text-ink-600" aria-hidden />
              <span className="truncate">{tender.organization}</span>
            </p>
            <p className="mt-1 font-mono text-2xs text-ink-400 dark:text-ink-600">#{tender.id}</p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1.5">
            {typeof tender.similarityScore === "number" && (
              <span className="inline-flex items-center gap-1 rounded-full border border-navy-200 dark:border-accent-blue-bg bg-navy-50 dark:bg-accent-blue-bg px-2 py-0.5 text-2xs font-bold tabular-nums text-navy-700 dark:text-accent-blue">
                <Sparkles className="h-3 w-3" aria-hidden />
                {Math.round(tender.similarityScore * 100)}% match
              </span>
            )}
            {tender.isInterested && (
              <span className="inline-flex items-center rounded-full border border-violet-200 dark:border-accent-purple-bg bg-violet-50 dark:bg-accent-purple-bg px-2 py-0.5 text-2xs font-semibold text-violet-700 dark:text-accent-purple">
                Interested
              </span>
            )}
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-2xs font-semibold",
                dl.tone === "danger" && "border border-danger-200 dark:border-danger-500/30 bg-danger-50 dark:bg-danger-500/10 text-danger-700 dark:text-danger-400",
                dl.tone === "warning" && "border border-warning-200 dark:border-warning-500/30 bg-warning-50 dark:bg-warning-500/10 text-warning-700 dark:text-warning-400",
                dl.tone === "neutral" && "bg-ink-100 dark:bg-ink-900 text-ink-600 dark:text-ink-300"
              )}
            >
              {dl.hint}
            </span>
            {corrigenda.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border border-warning-200 dark:border-warning-500/30 bg-warning-50 dark:bg-warning-500/10 px-2 py-0.5 text-2xs font-semibold text-warning-700 dark:text-warning-400">
                <AlertTriangle className="h-3 w-3" aria-hidden />
                {corrigenda.length} corrigend{corrigenda.length === 1 ? "um" : "a"}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Row facts — also instant */}
      <div className="grid grid-cols-3 gap-2 px-5 pb-4">
        {[
          { label: "Location", value: tender.location, Icon: MapPin },
          { label: "Tender value", value: tender.value, Icon: IndianRupee },
          { label: "Closing date", value: dl.label, Icon: CalendarDays },
        ].map((cell) => (
          <div key={cell.label} className="rounded-xl bg-ink-50 dark:bg-ink-950 px-3 py-2">
            <p className="text-2xs font-semibold uppercase tracking-widest text-ink-400 dark:text-ink-600">{cell.label}</p>
            <p className="mt-1 flex items-center gap-1.5 truncate text-sm font-semibold text-ink-800 dark:text-ink-100">
              <cell.Icon className="h-3.5 w-3.5 shrink-0 text-ink-400 dark:text-ink-600" aria-hidden />
              {cell.value}
            </p>
          </div>
        ))}
      </div>

      {/* Everything below is fetched */}
      {state === "error" && (
        <Section title="Details">
          <p className="text-sm text-ink-500 dark:text-ink-400">
            Couldn&rsquo;t load the full record for this tender. Open it directly to see everything.
          </p>
        </Section>
      )}

      {state === "loading" && (
        <>
          <Section title="Submission requirements">
            <SkeletonBlock rows={2} />
          </Section>
          <Section title="Key dates">
            <SkeletonBlock rows={3} />
          </Section>
          <Section title="Scope of work">
            <SkeletonBlock rows={4} />
          </Section>
        </>
      )}

      {state === "idle" && detail && (
        <>
          <Section title="Submission requirements">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
              <Field label="EMD" value={inr(emd?.emd_amount)} accent />
              <Field label="Tender fee" value={inr(fees?.tender_fee)} accent />
              <Field label="Processing fee" value={inr(fees?.processing_fee)} />
              <Field label="Bid validity" value={work?.bid_validity_days ? `${work.bid_validity_days} days` : "—"} />
            </div>
            {(emd?.emd_exemption_allowed || fees?.tender_fee_exemption_allowed) && (
              <p className="mt-2.5 flex flex-wrap gap-1.5">
                {emd?.emd_exemption_allowed && (
                  <span className="rounded-full bg-success-50 dark:bg-success-500/10 px-2 py-0.5 text-2xs font-semibold text-success-700 dark:text-success-400">
                    EMD exemption allowed
                  </span>
                )}
                {fees?.tender_fee_exemption_allowed && (
                  <span className="rounded-full bg-success-50 dark:bg-success-500/10 px-2 py-0.5 text-2xs font-semibold text-success-700 dark:text-success-400">
                    Tender fee exemption allowed
                  </span>
                )}
              </p>
            )}
          </Section>

          <Section title="Key dates">
            <dl className="space-y-1.5">
              {[
                ["Published", dates?.publish_date],
                ["Document sale ends", dates?.document_download_sale_end_date],
                ["Clarification ends", dates?.clarification_end_date],
                ["Bid submission starts", dates?.bid_submission_start_date],
                ["Bid submission ends", dates?.bid_submission_end_date],
                ["Bid opening", dates?.bid_opening_date],
              ]
                .filter(([, value]) => Boolean(value))
                .map(([label, value]) => (
                  <div key={label as string} className="flex items-baseline justify-between gap-3">
                    <dt className="shrink-0 text-2xs text-ink-400 dark:text-ink-600">{label}</dt>
                    <dd className="truncate text-xs tabular-nums text-ink-700 dark:text-ink-200">
                      {fmtDateTime(value as string)}
                    </dd>
                  </div>
                ))}
            </dl>
            {work?.pre_bid_meeting_date && (
              <p className="mt-2.5 rounded-lg bg-navy-50 dark:bg-accent-blue-bg px-2.5 py-1.5 text-2xs text-navy-700 dark:text-accent-blue">
                Pre-bid meeting {fmtDateTime(work.pre_bid_meeting_date)}
                {work.pre_bid_meeting_place ? ` · ${work.pre_bid_meeting_place}` : ""}
              </p>
            )}
          </Section>

          {(workDescription || preQualification) && (
            <Section title="Scope &amp; eligibility">
              {workDescription && (
                <p className="whitespace-pre-line text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                  {workDescription}
                </p>
              )}
              {preQualification && (
                <div className={cn(workDescription && "mt-3")}>
                  <p className="text-2xs font-semibold uppercase tracking-widest text-ink-400 dark:text-ink-600">
                    Pre-qualification
                  </p>
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                    {preQualification}
                  </p>
                </div>
              )}
            </Section>
          )}

          <Section title="Contract">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
              <Field label="Contract type" value={work?.contract_type || "—"} />
              <Field
                label="Period of work"
                value={work?.period_of_work_days ? `${work.period_of_work_days} days` : "—"}
              />
              <Field label="Category" value={work?.product_category || "—"} />
              <Field label="Bid opening place" value={work?.bid_opening_place || "—"} />
              <Field label="Pincode" value={work?.pincode || "—"} />
              <Field label="Tender type" value={detail.basic_details?.tender_type || "—"} />
            </div>
          </Section>

          {docs.length > 0 && (
            <Section title={`Documents (${docs.length})`}>
              <ul className="space-y-1.5">
                {docs.slice(0, 8).map((doc) => {
                  const size = fmtKb(doc.document_size_kb);
                  return (
                    <li key={`${doc.id}-${doc.s_no}-${doc.document_name}`}>
                      <a
                        href={doc.file_url || tenderDetailHref(tender.id)}
                        target={doc.file_url ? "_blank" : undefined}
                        rel={doc.file_url ? "noopener noreferrer" : undefined}
                        className="group flex items-center gap-2 rounded-lg border border-ink-100 dark:border-ink-900 px-2.5 py-1.5 transition-colors hover:border-navy-200 dark:hover:border-navy-700 hover:bg-navy-50 dark:hover:bg-navy-900"
                      >
                        <FileText className="h-3.5 w-3.5 shrink-0 text-danger-500 dark:text-danger-400" aria-hidden />
                        <span className="min-w-0 flex-1 truncate text-xs text-ink-700 dark:text-ink-200">
                          {doc.document_name}
                        </span>
                        {size && <span className="shrink-0 text-2xs tabular-nums text-ink-400 dark:text-ink-600">{size}</span>}
                        <Download
                          className="h-3.5 w-3.5 shrink-0 text-ink-300 dark:text-ink-700 transition-colors group-hover:text-navy-600 dark:group-hover:text-navy-400"
                          aria-hidden
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
              {docs.length > 8 && (
                <p className="mt-2 text-2xs text-ink-400 dark:text-ink-600">
                  +{docs.length - 8} more on the full tender page
                </p>
              )}
            </Section>
          )}

          {detail.tender_inviting_authority?.name && (
            <Section title="Inviting authority">
              <p className="text-sm font-medium text-ink-800 dark:text-ink-100">{detail.tender_inviting_authority.name}</p>
              {detail.tender_inviting_authority.address && (
                <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-ink-500 dark:text-ink-400">
                  {detail.tender_inviting_authority.address}
                </p>
              )}
            </Section>
          )}
        </>
      )}

      <footer className="sticky bottom-0 mt-auto flex items-center justify-between gap-3 border-t border-ink-100 dark:border-ink-900 bg-white/95 dark:bg-ink-900/95 px-5 py-3 backdrop-blur">
        {tender.source ? (
          <span className="inline-flex items-center rounded-full border border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 px-2.5 py-0.5 text-2xs font-medium text-ink-500 dark:text-ink-400">
            {formatSource(tender.source)}
          </span>
        ) : (
          <span />
        )}
        <Link
          href={tenderDetailHref(tender.id)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-ink-900 dark:bg-ink-50 px-3.5 py-2 text-xs font-semibold text-white dark:text-ink-900 transition-colors hover:bg-navy-700 dark:hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:focus-visible:ring-navy-400"
        >
          Open full tender
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </footer>
    </article>
  );
}
