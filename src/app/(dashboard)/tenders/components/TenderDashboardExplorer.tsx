"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Flame } from "lucide-react";
import { getInterestedTenders, getTenders, semanticSearchTenders } from "@/lib/api/tenders";
import { mapTenderListItemToUi, mapTenderSemanticResultToUi } from "@/lib/api/tenderAdapters";
import type { TenderItem } from "./TenderCard";
import { TenderFilters } from "./TenderFilters";
import { TenderList } from "./TenderList";
import { TenderSearch } from "./TenderSearch";

const PAGE_SIZE_KEY = "tender_dashboard_page_size";
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export function TenderDashboardExplorer() {
  const [items, setItems] = useState<TenderItem[]>([]);
  const [semanticResults, setSemanticResults] = useState<TenderItem[]>([]);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"default" | "semantic">("default");
  const [searchMode, setSearchMode] = useState<"semantic" | "keyword" | "hybrid">("hybrid");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [hasLoadedPageSizePreference, setHasLoadedPageSizePreference] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreSemanticResults, setHasMoreSemanticResults] = useState(false);
  const [activeSemanticQuery, setActiveSemanticQuery] = useState("");
  const [activeSemanticMode, setActiveSemanticMode] = useState<"semantic" | "keyword" | "hybrid">("hybrid");
  const [interestedIds, setInterestedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = Number(window.localStorage.getItem(PAGE_SIZE_KEY));
    if (PAGE_SIZE_OPTIONS.includes(saved)) {
      setPageSize(saved);
    }
    setHasLoadedPageSizePreference(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedPageSizePreference) return;
    window.localStorage.setItem(PAGE_SIZE_KEY, String(pageSize));
  }, [pageSize, hasLoadedPageSizePreference]);

  useEffect(() => {
    let isCancelled = false;
    getInterestedTenders()
      .then((rows) => {
        if (isCancelled) return;
        setInterestedIds(new Set(rows.map((row) => row.tender_id)));
      })
      .catch(() => {
        if (isCancelled) return;
        setInterestedIds(new Set());
      });
    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (mode !== "default") return;
    let isCancelled = false;
    setIsLoading(true);
    getTenders({ is_active: true, page, page_size: pageSize })
      .then((response) => {
        if (isCancelled) return;
        setItems(response.results.map(mapTenderListItemToUi));
        setTotalCount(response.count);
      })
      .catch(() => {
        if (isCancelled) return;
        setItems([]);
        setTotalCount(0);
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });
    return () => {
      isCancelled = true;
    };
  }, [mode, page, pageSize]);

  const semanticPageItems = useMemo(() => {
    if (mode !== "semantic") return [];
    const start = (page - 1) * pageSize;
    return semanticResults.slice(start, start + pageSize);
  }, [mode, semanticResults, page, pageSize]);

  const decoratedItems = useMemo(
    () => items.map((item) => ({ ...item, isInterested: interestedIds.has(item.id) })),
    [items, interestedIds]
  );
  const decoratedSemanticItems = useMemo(
    () => semanticPageItems.map((item) => ({ ...item, isInterested: interestedIds.has(item.id) })),
    [semanticPageItems, interestedIds]
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentItems = mode === "semantic" ? decoratedSemanticItems : decoratedItems;
  const semanticTopK = Math.min(pageSize * 3, 200);

  const closingSoonCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return currentItems.filter((tender) => {
      const date = new Date(tender.deadline);
      if (Number.isNaN(date.getTime())) return false;
      date.setHours(0, 0, 0, 0);
      const days = Math.round((date.getTime() - today.getTime()) / 86400000);
      return days >= 0 && days <= 7;
    }).length;
  }, [currentItems]);

  async function fetchSemanticResults(
    nextOffset: number,
    shouldAppend: boolean,
    queryText: string,
    modeValue: "semantic" | "keyword" | "hybrid"
  ) {
    const trimmed = queryText.trim();
    if (!trimmed) return;

    const results = await semanticSearchTenders({
      query: trimmed,
      top_k: semanticTopK,
      offset: nextOffset,
      search_mode: modeValue,
      is_active: true
    });
    const mapped = results.map(mapTenderSemanticResultToUi);
    setSemanticResults((prev) => (shouldAppend ? [...prev, ...mapped] : mapped));
    setHasMoreSemanticResults(mapped.length === semanticTopK);
    setTotalCount((prev) => (shouldAppend ? prev + mapped.length : mapped.length));
  }

  async function handleSemanticSearch() {
    const trimmed = query.trim();
    if (!trimmed) {
      setMode("default");
      setPage(1);
      setHasMoreSemanticResults(false);
      return;
    }
    setIsLoading(true);
    try {
      await fetchSemanticResults(0, false, trimmed, searchMode);
      setActiveSemanticQuery(trimmed);
      setActiveSemanticMode(searchMode);
      setMode("semantic");
      setPage(1);
    } catch {
      setSemanticResults([]);
      setTotalCount(0);
      setHasMoreSemanticResults(false);
      setMode("semantic");
      setPage(1);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLoadMoreSemanticResults() {
    if (isLoadingMore || !hasMoreSemanticResults || mode !== "semantic") return;
    setIsLoadingMore(true);
    try {
      await fetchSemanticResults(semanticResults.length, true, activeSemanticQuery, activeSemanticMode);
    } finally {
      setIsLoadingMore(false);
    }
  }

  function handleResetSearch() {
    setQuery("");
    setSemanticResults([]);
    setHasMoreSemanticResults(false);
    setActiveSemanticQuery("");
    setMode("default");
    setPage(1);
  }

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-slate-50 p-4 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">Tender dashboard</h2>
            <p className="mt-0.5 text-sm text-slate-500">Find and act on opportunities quickly.</p>
          </div>
          <p className="text-xs text-slate-500">
            <span className="font-semibold tabular-nums text-slate-800">{totalCount}</span> total records
          </p>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Total records</p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-slate-900">{totalCount}</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 px-3 py-2.5">
            <p className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-amber-800">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden />
              Closing soon (current page)
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-amber-700">{closingSoonCount}</p>
          </div>
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 px-3 py-2.5">
            <p className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-indigo-800">
              <Flame className="h-3.5 w-3.5" aria-hidden />
              Search mode
            </p>
            <p className="mt-1 text-sm font-medium text-indigo-700">
              {mode === "semantic" ? `${searchMode} mode` : "Standard listing"}
            </p>
          </div>
        </div>
      </div>

      <TenderSearch
        value={query}
        onChange={setQuery}
        onSubmit={handleSemanticSearch}
        onReset={handleResetSearch}
        searchMode={searchMode}
        onSearchModeChange={setSearchMode}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-12 gap-4 lg:gap-6">
        <div className="col-span-12 lg:col-span-3">
          <TenderFilters />
        </div>

        <div className="col-span-12 space-y-4 lg:col-span-9">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
            <p className="text-sm text-slate-600">
              <span className="font-semibold tabular-nums text-slate-900">{totalCount}</span>{" "}
              {totalCount === 1 ? "record" : "records"} · Page{" "}
              <span className="font-semibold tabular-nums text-slate-900">{page}</span> /{" "}
              <span className="font-semibold tabular-nums text-slate-900">{totalPages}</span>
            </p>
            <label className="inline-flex items-center gap-2 text-sm text-slate-600">
              Per page
              <select
                value={pageSize}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  setPageSize(next);
                  setPage(1);
                }}
                className="h-8 rounded-md border border-slate-200 bg-white px-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <TenderList tenders={currentItems} />

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleLoadMoreSemanticResults}
              disabled={
                mode !== "semantic" ||
                !hasMoreSemanticResults ||
                isLoading ||
                isLoadingMore ||
                query.trim() !== activeSemanticQuery ||
                searchMode !== activeSemanticMode
              }
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoadingMore ? "Loading..." : "Load more results"}
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isLoading}
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isLoading}
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
