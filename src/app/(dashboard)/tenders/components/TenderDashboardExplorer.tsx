"use client";

import { useEffect, useMemo, useState } from "react";
import { Bookmark, CalendarDays, ChevronLeft, ChevronRight, Database, Loader2 } from "lucide-react";
import { getInterestedTenders, getTenders, semanticSearchTenders } from "@/lib/api/tenders";
import { mapTenderListItemToUi, mapTenderSemanticResultToUi } from "@/lib/api/tenderAdapters";
import { cn } from "@/lib/utils";
import type { TenderItem } from "./TenderCard";
import { TenderFilters, type TenderFilterValues } from "./TenderFilters";
import { TenderList } from "./TenderList";
import { TenderSearch } from "./TenderSearch";

const PAGE_SIZE_KEY = "tender_dashboard_page_size";
const SEARCH_MODE_KEY = "tender_dashboard_search_mode";
const FILTERS_KEY = "tender_dashboard_filters";
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const SEARCH_MODE_OPTIONS = ["semantic", "keyword", "hybrid"] as const;
const DEFAULT_FILTER_VALUES: TenderFilterValues = {
  location: "",
  minValue: "",
  maxValue: "",
  deadlineTo: "",
};

export function TenderDashboardExplorer() {
  const [items, setItems] = useState<TenderItem[]>([]);
  const [semanticResults, setSemanticResults] = useState<TenderItem[]>([]);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"default" | "semantic">("default");
  const [searchMode, setSearchMode] = useState<"semantic" | "keyword" | "hybrid">("hybrid");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [hasLoadedPageSizePreference, setHasLoadedPageSizePreference] = useState(false);
  const [hasLoadedSearchModePreference, setHasLoadedSearchModePreference] = useState(false);
  const [hasLoadedFiltersPreference, setHasLoadedFiltersPreference] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreSemanticResults, setHasMoreSemanticResults] = useState(false);
  const [activeSemanticQuery, setActiveSemanticQuery] = useState("");
  const [activeSemanticMode, setActiveSemanticMode] = useState<"semantic" | "keyword" | "hybrid">("hybrid");
  const [interestedIds, setInterestedIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<TenderFilterValues>(DEFAULT_FILTER_VALUES);

  // Preferences hydration
  useEffect(() => {
    const saved = Number(window.localStorage.getItem(PAGE_SIZE_KEY));
    if (PAGE_SIZE_OPTIONS.includes(saved)) setPageSize(saved);
    setHasLoadedPageSizePreference(true);
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem(SEARCH_MODE_KEY);
    if (saved && SEARCH_MODE_OPTIONS.includes(saved as (typeof SEARCH_MODE_OPTIONS)[number])) {
      setSearchMode(saved as "semantic" | "keyword" | "hybrid");
    }
    setHasLoadedSearchModePreference(true);
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem(FILTERS_KEY);
    if (!saved) { setHasLoadedFiltersPreference(true); return; }
    try {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed.location === "string") setFilters(parsed);
    } catch { /* ignore */ } finally {
      setHasLoadedFiltersPreference(true);
    }
  }, []);

  // Persist preferences
  useEffect(() => {
    if (!hasLoadedPageSizePreference) return;
    window.localStorage.setItem(PAGE_SIZE_KEY, String(pageSize));
  }, [pageSize, hasLoadedPageSizePreference]);

  useEffect(() => {
    if (!hasLoadedSearchModePreference) return;
    window.localStorage.setItem(SEARCH_MODE_KEY, searchMode);
  }, [searchMode, hasLoadedSearchModePreference]);

  useEffect(() => {
    if (!hasLoadedFiltersPreference) return;
    window.localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
  }, [filters, hasLoadedFiltersPreference]);

  // Interested tenders
  useEffect(() => {
    let isCancelled = false;
    getInterestedTenders()
      .then((rows) => { if (!isCancelled) setInterestedIds(new Set(rows.map((r) => r.tender_id))); })
      .catch(() => { if (!isCancelled) setInterestedIds(new Set()); });
    return () => { isCancelled = true; };
  }, []);

  // Default browse fetch
  useEffect(() => {
    if (mode !== "default" || !hasLoadedFiltersPreference) return;
    let isCancelled = false;
    setIsLoading(true);
    const minValue = filters.minValue.trim() ? Number(filters.minValue) : undefined;
    const maxValue = filters.maxValue.trim() ? Number(filters.maxValue) : undefined;
    getTenders({
      is_active: true,
      page,
      page_size: pageSize,
      location: filters.location.trim() || undefined,
      min_value: Number.isFinite(minValue) ? minValue : undefined,
      max_value: Number.isFinite(maxValue) ? maxValue : undefined,
      bid_submission_end_date_to: filters.deadlineTo || undefined,
    })
      .then((response) => {
        if (isCancelled) return;
        setItems(response.results.map(mapTenderListItemToUi));
        setTotalCount(response.count);
      })
      .catch(() => { if (!isCancelled) { setItems([]); setTotalCount(0); } })
      .finally(() => { if (!isCancelled) setIsLoading(false); });
    return () => { isCancelled = true; };
  }, [mode, page, pageSize, filters, hasLoadedFiltersPreference]);

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
    return currentItems.filter((t) => {
      const d = new Date(t.deadline);
      if (Number.isNaN(d.getTime())) return false;
      d.setHours(0, 0, 0, 0);
      const days = Math.round((d.getTime() - today.getTime()) / 86400000);
      return days >= 0 && days <= 7;
    }).length;
  }, [currentItems]);

  const interestedOnPageCount = useMemo(
    () => currentItems.filter((t) => t.isInterested).length,
    [currentItems]
  );

  async function fetchSemanticResults(offset: number, append: boolean, q: string, m: "semantic" | "keyword" | "hybrid") {
    const trimmed = q.trim();
    if (!trimmed) return;
    const results = await semanticSearchTenders({ query: trimmed, top_k: semanticTopK, offset, search_mode: m, is_active: true });
    const mapped = results.map(mapTenderSemanticResultToUi);
    setSemanticResults((prev) => (append ? [...prev, ...mapped] : mapped));
    setHasMoreSemanticResults(mapped.length === semanticTopK);
    setTotalCount((prev) => (append ? prev + mapped.length : mapped.length));
  }

  async function handleSemanticSearch() {
    const trimmed = query.trim();
    if (!trimmed) { setMode("default"); setPage(1); setHasMoreSemanticResults(false); return; }
    setIsLoading(true);
    try {
      await fetchSemanticResults(0, false, trimmed, searchMode);
      setActiveSemanticQuery(trimmed);
      setActiveSemanticMode(searchMode);
      setMode("semantic");
      setPage(1);
    } catch {
      setSemanticResults([]); setTotalCount(0); setHasMoreSemanticResults(false); setMode("semantic"); setPage(1);
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
    setQuery(""); setSemanticResults([]); setHasMoreSemanticResults(false);
    setActiveSemanticQuery(""); setMode("default"); setPage(1);
  }

  function handleFilterChange(next: TenderFilterValues) {
    setFilters(next); setMode("default"); setPage(1);
  }

  function handleFilterReset() {
    setFilters(DEFAULT_FILTER_VALUES); setMode("default"); setPage(1);
  }

  return (
    <section className="mx-auto w-full max-w-7xl space-y-5">
      {/* Header stats */}
      <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-ink-900">Tender explorer</h1>
            <p className="mt-0.5 text-sm text-ink-400">Search and filter active government tenders.</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border border-ink-200 bg-ink-50 px-4 py-3">
            <Database className="h-5 w-5 shrink-0 text-ink-400" aria-hidden />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Total records</p>
              <p className="text-xl font-bold tabular-nums text-ink-900">{totalCount.toLocaleString("en-IN")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-warning-200 bg-warning-50 px-4 py-3">
            <CalendarDays className="h-5 w-5 shrink-0 text-warning-600" aria-hidden />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-warning-700">Closing soon</p>
              <p className="text-xl font-bold tabular-nums text-warning-700">{closingSoonCount}</p>
              <p className="text-xs text-warning-600">on this page</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3">
            <Bookmark className="h-5 w-5 shrink-0 text-violet-600" aria-hidden />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">Interested</p>
              <p className="text-xl font-bold tabular-nums text-violet-700">{interestedOnPageCount}</p>
              <p className="text-xs text-violet-600">on this page</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <TenderSearch
        value={query}
        onChange={setQuery}
        onSubmit={handleSemanticSearch}
        onReset={handleResetSearch}
        searchMode={searchMode}
        onSearchModeChange={setSearchMode}
        isLoading={isLoading}
      />

      {/* Main layout: filters + list */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-3">
          <TenderFilters values={filters} onChange={handleFilterChange} onReset={handleFilterReset} />
        </div>

        <div className="col-span-12 space-y-4 lg:col-span-9">
          {/* List toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3 shadow-card">
            <p className="text-sm text-ink-600">
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Loading…
                </span>
              ) : (
                <>
                  <span className="font-bold tabular-nums text-ink-900">{totalCount.toLocaleString("en-IN")}</span>
                  {" "}records · Page{" "}
                  <span className="font-bold tabular-nums text-ink-900">{page}</span>
                  {" "}of{" "}
                  <span className="font-bold tabular-nums text-ink-900">{totalPages}</span>
                </>
              )}
            </p>
            <label className="inline-flex items-center gap-2 text-sm text-ink-500">
              Per page
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="h-8 rounded-lg border border-ink-200 bg-white px-2 text-sm text-ink-700 outline-none focus:ring-2 focus:ring-navy-500/30"
              >
                {PAGE_SIZE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>

          <TenderList tenders={currentItems} />

          {/* Pagination */}
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleLoadMoreSemanticResults}
              disabled={
                mode !== "semantic" || !hasMoreSemanticResults || isLoading || isLoadingMore ||
                query.trim() !== activeSemanticQuery || searchMode !== activeSemanticMode
              }
              className={cn(
                "rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-50",
                "disabled:cursor-not-allowed disabled:opacity-40"
              )}
            >
              {isLoadingMore ? (
                <span className="inline-flex items-center gap-1.5">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading more…
                </span>
              ) : (
                "Load more results"
              )}
            </button>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || isLoading}
                aria-label="Previous page"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink-200 bg-white text-ink-700 transition-colors hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 text-sm font-medium tabular-nums text-ink-600">{page} / {totalPages}</span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || isLoading}
                aria-label="Next page"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink-200 bg-white text-ink-700 transition-colors hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
