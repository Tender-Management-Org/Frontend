"use client";

import { useEffect, useMemo, useState } from "react";
import { Bookmark, CalendarDays, ChevronLeft, ChevronRight, Database, FilterX, Loader2, Search, X } from "lucide-react";
import { getInterestedTenders, getTenders, semanticSearchTenders } from "@/lib/api/tenders";
import { mapTenderListItemToUi, mapTenderSemanticResultToUi } from "@/lib/api/tenderAdapters";
import { cn } from "@/lib/utils";
import type { TenderItem } from "./TenderCard";
import { TenderFilters, type TenderFilterValues } from "./TenderFilters";
import { TenderList } from "./TenderList";
import { TenderSearch } from "./TenderSearch";
import { TenderViewSwitcher, type TenderView } from "./TenderViewSwitcher";

const PAGE_SIZE_KEY = "tender_dashboard_page_size";
const SEARCH_MODE_KEY = "tender_dashboard_search_mode";
const FILTERS_KEY = "tender_dashboard_filters_v2";
const SORT_KEY = "tender_dashboard_sort";
const VIEW_KEY = "tender_dashboard_view";
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const SEARCH_MODE_OPTIONS = ["semantic", "keyword", "hybrid"] as const;
const VIEW_OPTIONS = ["detailed", "minimal", "compact", "split", "calendar"] as const;

const SORT_OPTIONS = [
  { value: "bid_submission_end_date", label: "Closing soon first" },
  { value: "-bid_submission_end_date", label: "Latest deadline" },
  { value: "-publish_date", label: "Newest listed" },
  { value: "-tender_value", label: "Highest value" },
  { value: "tender_value", label: "Lowest value" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

const DEFAULT_FILTER_VALUES: TenderFilterValues = {
  location: "",
  status: "active",
  source: "",
};

function toLocalDateStr(d: Date) {
  // Use local calendar date — NOT toISOString() which returns UTC and can
  // be a day behind in IST (UTC+5:30) until 5:30 AM local time.
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTodayStr() {
  return toLocalDateStr(new Date());
}

function getDateOffsetStr(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toLocalDateStr(d);
}

function buildDateParams(filters: TenderFilterValues) {
  const today = getTodayStr();
  const yesterday = getDateOffsetStr(-1);
  const sevenDaysOut = getDateOffsetStr(7);

  switch (filters.status) {
    case "active":
      return {
        is_active: true as boolean | undefined,
        bid_submission_end_date_from: today,
        bid_submission_end_date_to: undefined,
      };
    case "closing_soon":
      return {
        is_active: true as boolean | undefined,
        bid_submission_end_date_from: today,
        bid_submission_end_date_to: sevenDaysOut,
      };
    case "closed":
      return {
        is_active: undefined as boolean | undefined,
        bid_submission_end_date_from: undefined as string | undefined,
        bid_submission_end_date_to: yesterday,
      };
    case "all":
    default:
      return {
        is_active: true as boolean | undefined,
        bid_submission_end_date_from: undefined as string | undefined,
        bid_submission_end_date_to: undefined,
      };
  }
}

export function TenderDashboardExplorer() {
  const [items, setItems] = useState<TenderItem[]>([]);
  const [semanticResults, setSemanticResults] = useState<TenderItem[]>([]);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"default" | "semantic">("default");
  const [searchMode, setSearchMode] = useState<"semantic" | "keyword" | "hybrid">("hybrid");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [view, setView] = useState<TenderView>("detailed");
  const [hasLoadedPageSizePreference, setHasLoadedPageSizePreference] = useState(false);
  const [hasLoadedSearchModePreference, setHasLoadedSearchModePreference] = useState(false);
  const [hasLoadedFiltersPreference, setHasLoadedFiltersPreference] = useState(false);
  const [hasLoadedSortPreference, setHasLoadedSortPreference] = useState(false);
  const [hasLoadedViewPreference, setHasLoadedViewPreference] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreSemanticResults, setHasMoreSemanticResults] = useState(false);
  const [activeSemanticQuery, setActiveSemanticQuery] = useState("");
  const [activeSemanticMode, setActiveSemanticMode] = useState<"semantic" | "keyword" | "hybrid">("hybrid");
  const [interestedIds, setInterestedIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<TenderFilterValues>(DEFAULT_FILTER_VALUES);
  const [sortBy, setSortBy] = useState<SortValue>("bid_submission_end_date");

  // Everything except the card view shares the dense command bar and full width.
  const isMinimal = view !== "detailed";

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
    const saved = window.localStorage.getItem(VIEW_KEY);
    if (saved && VIEW_OPTIONS.includes(saved as TenderView)) {
      setView(saved as TenderView);
    }
    setHasLoadedViewPreference(true);
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem(FILTERS_KEY);
    if (!saved) { setHasLoadedFiltersPreference(true); return; }
    try {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed.location === "string") {
        // Ensure new fields added later have a default value
        setFilters({ ...DEFAULT_FILTER_VALUES, ...parsed });
      }
    } catch { /* ignore */ } finally {
      setHasLoadedFiltersPreference(true);
    }
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem(SORT_KEY);
    if (saved && SORT_OPTIONS.some((o) => o.value === saved)) {
      setSortBy(saved as SortValue);
    }
    setHasLoadedSortPreference(true);
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
    if (!hasLoadedViewPreference) return;
    window.localStorage.setItem(VIEW_KEY, view);
  }, [view, hasLoadedViewPreference]);

  useEffect(() => {
    if (!hasLoadedFiltersPreference) return;
    window.localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
  }, [filters, hasLoadedFiltersPreference]);

  useEffect(() => {
    if (!hasLoadedSortPreference) return;
    window.localStorage.setItem(SORT_KEY, sortBy);
  }, [sortBy, hasLoadedSortPreference]);

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
    if (mode !== "default" || !hasLoadedFiltersPreference || !hasLoadedSortPreference) return;
    let isCancelled = false;
    setIsLoading(true);
    const dateParams = buildDateParams(filters);

    getTenders({
      ...dateParams,
      page,
      page_size: pageSize,
      location: filters.location.trim() || undefined,
      source: filters.source || undefined,
      ordering: sortBy,
    })
      .then((response) => {
        if (isCancelled) return;
        setItems(response.results.map(mapTenderListItemToUi));
        setTotalCount(response.count);
      })
      .catch(() => { if (!isCancelled) { setItems([]); setTotalCount(0); } })
      .finally(() => { if (!isCancelled) setIsLoading(false); });
    return () => { isCancelled = true; };
  }, [mode, page, pageSize, filters, sortBy, hasLoadedFiltersPreference, hasLoadedSortPreference]);

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
    const results = await semanticSearchTenders({
      query: trimmed,
      top_k: semanticTopK,
      offset,
      search_mode: m,
      is_active: filters.status !== "closed",
    });
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

  const viewSwitcher = <TenderViewSwitcher value={view} onChange={setView} />;

  const hasActiveFilters =
    Boolean(filters.location) || filters.status !== "active" || Boolean(filters.source);

  const sortSelect = mode === "default" && (
    <label className="inline-flex items-center gap-1.5 text-xs text-ink-500">
      <span className="hidden xl:inline">Sort</span>
      <select
        aria-label="Sort by"
        value={sortBy}
        onChange={(e) => { setSortBy(e.target.value as SortValue); setPage(1); }}
        className="h-8 rounded-lg border border-ink-200 bg-white px-2 text-xs text-ink-700 outline-none focus:ring-2 focus:ring-navy-500/30"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );

  const pageSizeSelect = (
    <label className="inline-flex items-center gap-1.5 text-xs text-ink-500">
      <span className="hidden xl:inline">Per page</span>
      <select
        aria-label="Results per page"
        value={pageSize}
        onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
        className="h-8 rounded-lg border border-ink-200 bg-white px-2 text-xs text-ink-700 outline-none focus:ring-2 focus:ring-navy-500/30"
      >
        {PAGE_SIZE_OPTIONS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </label>
  );

  return (
    <section className={cn("mx-auto w-full", isMinimal ? "max-w-[100rem] space-y-3" : "max-w-7xl space-y-5")}>
      {isMinimal ? (
        /* ──────────────────────────────────────────────────────────────────
           Minimal view: one sticky command bar replaces the stat cards, the
           search card, the filter bar and the list toolbar. Those four blocks
           cost ~420px of chrome before the first row — half the viewport on a
           laptop — which defeats the point of a dense view.
           ────────────────────────────────────────────────────────────────── */
        <div className="sticky top-0 z-20 -mt-2 space-y-2 bg-ink-50/85 pb-2 pt-2 backdrop-blur">
          {/* Line 1 — identity, live counts, view switcher */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 rounded-xl border border-ink-200 bg-white px-3 py-2 shadow-card">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="text-sm font-bold text-ink-900">Tender explorer</h1>
              <span className="hidden h-3.5 w-px bg-ink-200 sm:block" aria-hidden />
              <span className="inline-flex items-center gap-1.5 text-xs text-ink-500">
                <Database className="h-3.5 w-3.5 text-ink-400" aria-hidden />
                {isLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-ink-400" aria-hidden />
                ) : (
                  <span className="font-semibold tabular-nums text-ink-900">
                    {totalCount.toLocaleString("en-IN")}
                  </span>
                )}
                records
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-ink-500">
                <CalendarDays className="h-3.5 w-3.5 text-warning-600" aria-hidden />
                <span className="font-semibold tabular-nums text-warning-700">{closingSoonCount}</span>
                closing soon
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-ink-500">
                <Bookmark className="h-3.5 w-3.5 text-violet-600" aria-hidden />
                <span className="font-semibold tabular-nums text-violet-700">{interestedOnPageCount}</span>
                interested
              </span>
              <span className="hidden h-3.5 w-px bg-ink-200 sm:block" aria-hidden />
              <span className="text-xs tabular-nums text-ink-400">
                Page {page} / {totalPages}
              </span>
            </div>
            {viewSwitcher}
          </div>

          {/* Line 2 — search, filters and sorting on one wrapping row */}
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-ink-200 bg-white px-3 py-2 shadow-card">
            <div className="relative min-w-[13rem] flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" aria-hidden />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSemanticSearch(); }}
                placeholder="Describe the opportunity you're looking for…"
                aria-label="Search tenders"
                className="h-8 w-full rounded-lg border border-ink-200 bg-white pl-8 pr-7 text-xs text-ink-800 outline-none placeholder:text-ink-400 focus:ring-2 focus:ring-navy-500/30"
              />
              {query && (
                <button
                  type="button"
                  onClick={handleResetSearch}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-400 transition-colors hover:text-ink-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <select
              aria-label="Search mode"
              value={searchMode}
              onChange={(e) => setSearchMode(e.target.value as "semantic" | "keyword" | "hybrid")}
              className="h-8 shrink-0 rounded-lg border border-ink-200 bg-white px-2 text-xs text-ink-700 outline-none focus:ring-2 focus:ring-navy-500/30"
            >
              <option value="hybrid">Hybrid</option>
              <option value="semantic">Semantic</option>
              <option value="keyword">Keyword</option>
            </select>

            <button
              type="button"
              onClick={handleSemanticSearch}
              disabled={isLoading}
              className="h-8 shrink-0 rounded-lg bg-ink-900 px-3 text-xs font-semibold text-white transition-colors hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Searching…" : "Search"}
            </button>

            <span className="hidden h-5 w-px bg-ink-200 lg:block" aria-hidden />

            <TenderFilters
              variant="inline"
              values={filters}
              onChange={handleFilterChange}
              onReset={handleFilterReset}
            />

            <div className="ml-auto flex items-center gap-2">
              {sortSelect}
              {pageSizeSelect}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleFilterReset}
                  className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-medium text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-800"
                >
                  <FilterX className="h-3.5 w-3.5" aria-hidden />
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ---------- Detailed: full stat cards ---------- */}
          <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-ink-900">Tender explorer</h1>
                <p className="mt-0.5 text-sm text-ink-400">Search and filter active government tenders.</p>
              </div>
              {viewSwitcher}
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

          <TenderSearch
            value={query}
            onChange={setQuery}
            onSubmit={handleSemanticSearch}
            onReset={handleResetSearch}
            searchMode={searchMode}
            onSearchModeChange={setSearchMode}
            isLoading={isLoading}
          />
        </>
      )}

      {/* Main layout: filters + list */}
      <div className={cn(!isMinimal && "grid grid-cols-12 gap-5")}>
        {!isMinimal && (
          <div className="col-span-12 lg:col-span-3">
            <TenderFilters values={filters} onChange={handleFilterChange} onReset={handleFilterReset} />
          </div>
        )}

        <div className={cn("space-y-3", !isMinimal && "col-span-12 space-y-4 lg:col-span-9")}>
          {!isMinimal && (
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
              <div className="flex flex-wrap items-center gap-3">
                {sortSelect}
                {pageSizeSelect}
              </div>
            </div>
          )}

          <TenderList tenders={currentItems} view={view} />

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
