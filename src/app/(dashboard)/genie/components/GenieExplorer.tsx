"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getSchemeFacets,
  getSchemes,
  type SchemeFacetsApi,
  type SchemeLevel,
  type SchemeListItemApi,
  type SchemesQuery,
} from "@/lib/api/genie";
import { SchemeCard } from "./SchemeCard";
import { SchemeChatPanel } from "./SchemeChatPanel";
import {
  EMPTY_FILTERS,
  SchemeFilterRail,
  countActiveFilters,
  type SchemeFilterState,
} from "./SchemeFilterRail";

const PAGE_SIZE = 10;

type LevelTab = "all" | SchemeLevel;

const TABS: { id: LevelTab; label: string }[] = [
  { id: "all", label: "All schemes" },
  { id: "state", label: "State / UT schemes" },
  { id: "central", label: "Central schemes" },
];

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "scheme_name", label: "Name (A–Z)" },
  { value: "-scheme_name", label: "Name (Z–A)" },
  { value: "-last_synced_at", label: "Recently updated" },
  { value: "close_date", label: "Closing soonest" },
];

function joinOrUndefined(values: string[]): string | undefined {
  return values.length > 0 ? values.join(",") : undefined;
}

export function GenieExplorer() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<LevelTab>("all");
  const [filters, setFilters] = useState<SchemeFilterState>(EMPTY_FILTERS);
  const [ordering, setOrdering] = useState(SORT_OPTIONS[0].value);
  const [page, setPage] = useState(1);

  const [schemes, setSchemes] = useState<SchemeListItemApi[]>([]);
  const [count, setCount] = useState(0);
  const [facets, setFacets] = useState<SchemeFacetsApi | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpenOnMobile, setIsFilterOpenOnMobile] = useState(false);

  // Debounce the search box so typing doesn't fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const query = useMemo<SchemesQuery>(
    () => ({
      search: search || undefined,
      level: tab === "all" ? undefined : tab,
      state: filters.state || undefined,
      category: joinOrUndefined(filters.categories),
      beneficiary: joinOrUndefined(filters.beneficiaries),
      tag: joinOrUndefined(filters.tags),
      is_currently_open: filters.openOnly ? true : undefined,
    }),
    [search, tab, filters]
  );

  // Any change to the query itself resets paging — page 4 of the old result
  // set is meaningless against the new one.
  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getSchemes({ ...query, ordering, page, page_size: PAGE_SIZE })
      .then((response) => {
        if (cancelled) return;
        setSchemes(response.results);
        setCount(response.count);
      })
      .catch(() => {
        if (cancelled) return;
        setSchemes([]);
        setCount(0);
        setError("Could not load schemes. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query, ordering, page]);

  // Facets track the same filters so the counts reflect what's actually left.
  useEffect(() => {
    let cancelled = false;
    getSchemeFacets(query)
      .then((response) => {
        if (!cancelled) setFacets(response);
      })
      .catch(() => {
        if (!cancelled) setFacets(null);
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const activeFilterCount = countActiveFilters(filters);

  const handleFiltersChange = useCallback((next: SchemeFilterState) => {
    setFilters(next);
  }, []);

  return (
    <section className="mx-auto w-full max-w-7xl space-y-5">
      {/* Header */}
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 text-xl font-semibold text-ink-900 dark:text-ink-50">
            <Sparkles className="h-5 w-5 text-navy-600 dark:text-accent-blue" aria-hidden />
            Genie
          </h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            Government schemes your firm may be able to claim — browse, filter, and open any
            scheme for the full eligibility and application detail.
          </p>
        </div>
        <SchemeChatPanel inline label="Ask Genie" />
      </header>

      {/* Search */}
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400 dark:text-ink-600"
          aria-hidden
        />
        <input
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search schemes by name or description…"
          aria-label="Search schemes"
          className="h-11 w-full rounded-xl border border-ink-200 bg-surface pl-10 pr-10 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-400 hover:border-ink-300 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 dark:border-transparent dark:bg-control dark:text-ink-50 dark:placeholder:text-ink-600 dark:hover:border-ink-700 dark:focus:border-accent-blue"
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => setSearchInput("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-ink-400 transition-colors hover:text-ink-700 dark:text-ink-600 dark:hover:text-ink-200"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        {/* Filter rail */}
        <div
          className={cn(
            "shrink-0 lg:block lg:w-64",
            isFilterOpenOnMobile ? "block" : "hidden"
          )}
        >
          <SchemeFilterRail facets={facets} filters={filters} onChange={handleFiltersChange} />
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          {/* Tabs */}
          <div
            role="tablist"
            aria-label="Scheme level"
            className="flex gap-1 border-b border-ink-200 dark:border-ink-800"
          >
            {TABS.map((item) => (
              <button
                key={item.id}
                role="tab"
                aria-selected={tab === item.id}
                onClick={() => setTab(item.id)}
                className={cn(
                  "-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                  tab === item.id
                    ? "border-navy-600 text-navy-700 dark:border-accent-blue dark:text-accent-blue"
                    : "border-transparent text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Result meta */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFilterOpenOnMobile((prev) => !prev)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-surface px-3 py-1.5 text-xs font-semibold text-ink-700 shadow-sm dark:border-ink-800 dark:text-ink-200 lg:hidden"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-0.5 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-navy-600 px-1 text-[10px] font-bold text-white dark:bg-accent-blue">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <p className="text-sm text-ink-500 dark:text-ink-400">
                {isLoading ? "Loading…" : <><span className="font-semibold text-ink-800 dark:text-ink-100">{count}</span> scheme{count === 1 ? "" : "s"} found</>}
              </p>
            </div>

            <label className="flex items-center gap-2 text-xs text-ink-500 dark:text-ink-400">
              Sort
              <select
                value={ordering}
                onChange={(event) => setOrdering(event.target.value)}
                aria-label="Sort schemes"
                className="h-8 rounded-lg border border-ink-200 bg-surface px-2 text-xs text-ink-900 outline-none focus:border-navy-500 dark:border-transparent dark:bg-control dark:text-ink-50"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Results */}
          {error ? (
            <div className="rounded-2xl border border-danger-500/30 bg-danger-50 p-6 text-center text-sm text-danger-700 dark:bg-danger-500/10 dark:text-danger-500">
              {error}
            </div>
          ) : isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-40 animate-pulse rounded-2xl border border-ink-200 bg-surface dark:border-ink-800"
                />
              ))}
            </div>
          ) : schemes.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-surface p-8 text-center dark:border-ink-800">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-100 dark:bg-ink-900">
                <Sparkles className="h-7 w-7 text-ink-400 dark:text-ink-600" aria-hidden />
              </div>
              <h3 className="text-base font-semibold text-ink-800 dark:text-ink-100">
                No schemes found
              </h3>
              <p className="mt-1 max-w-xs text-sm text-ink-400 dark:text-ink-600">
                Try a different search term or clear the active filters.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {schemes.map((scheme) => (
                <SchemeCard key={scheme.id} scheme={scheme} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !error && totalPages > 1 && (
            <nav
              aria-label="Scheme pagination"
              className="flex items-center justify-center gap-2 pt-2"
            >
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page <= 1}
                aria-label="Previous page"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-ink-200 bg-surface text-ink-600 transition-colors hover:bg-ink-50 disabled:pointer-events-none disabled:opacity-40 dark:border-ink-800 dark:text-ink-300 dark:hover:bg-ink-950"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>
              <span className="px-2 text-sm text-ink-600 dark:text-ink-300">
                Page <span className="font-semibold">{page}</span> of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page >= totalPages}
                aria-label="Next page"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-ink-200 bg-surface text-ink-600 transition-colors hover:bg-ink-50 disabled:pointer-events-none disabled:opacity-40 dark:border-ink-800 dark:text-ink-300 dark:hover:bg-ink-950"
              >
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </nav>
          )}
        </div>
      </div>
    </section>
  );
}
