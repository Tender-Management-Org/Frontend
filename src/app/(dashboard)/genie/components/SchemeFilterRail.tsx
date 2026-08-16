"use client";

import { useState } from "react";
import { ChevronDown, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SchemeFacetValue, SchemeFacetsApi } from "@/lib/api/genie";

/** Values shown before the "Show all" toggle inside a section. */
const COLLAPSED_COUNT = 8;

export interface SchemeFilterState {
  state: string;
  categories: string[];
  beneficiaries: string[];
  tags: string[];
  openOnly: boolean;
}

export const EMPTY_FILTERS: SchemeFilterState = {
  state: "",
  categories: [],
  beneficiaries: [],
  tags: [],
  openOnly: false,
};

export function countActiveFilters(filters: SchemeFilterState): number {
  return (
    (filters.state ? 1 : 0) +
    filters.categories.length +
    filters.beneficiaries.length +
    filters.tags.length +
    (filters.openOnly ? 1 : 0)
  );
}

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function CheckboxSection({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: SchemeFacetValue[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [showAll, setShowAll] = useState(false);

  if (options.length === 0) return null;
  const visible = showAll ? options : options.slice(0, COLLAPSED_COUNT);

  return (
    <div className="border-b border-ink-100 dark:border-ink-900 py-3">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <span className="text-sm font-semibold text-ink-800 dark:text-ink-100">{title}</span>
        {isOpen ? (
          <Minus className="h-3.5 w-3.5 shrink-0 text-ink-400 dark:text-ink-600" aria-hidden />
        ) : (
          <Plus className="h-3.5 w-3.5 shrink-0 text-ink-400 dark:text-ink-600" aria-hidden />
        )}
      </button>

      {isOpen && (
        <ul className="mt-2 space-y-1">
          {visible.map((option) => {
            const isChecked = selected.includes(option.value);
            return (
              <li key={option.value}>
                <label className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-sm transition-colors hover:bg-ink-50 dark:hover:bg-ink-950">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggle(option.value)}
                    className="h-3.5 w-3.5 shrink-0 rounded border-ink-300 dark:border-ink-700 text-navy-600 focus:ring-navy-500"
                  />
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate",
                      isChecked
                        ? "font-medium text-ink-900 dark:text-ink-50"
                        : "text-ink-600 dark:text-ink-300"
                    )}
                    title={option.value}
                  >
                    {option.value}
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-ink-400 dark:text-ink-600">
                    {option.count}
                  </span>
                </label>
              </li>
            );
          })}

          {options.length > COLLAPSED_COUNT && (
            <li>
              <button
                type="button"
                onClick={() => setShowAll((prev) => !prev)}
                className="px-1 pt-1 text-xs font-semibold text-navy-600 dark:text-accent-blue hover:underline"
              >
                {showAll ? "Show less" : `Show all ${options.length}`}
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

interface SchemeFilterRailProps {
  facets: SchemeFacetsApi | null;
  filters: SchemeFilterState;
  onChange: (next: SchemeFilterState) => void;
}

export function SchemeFilterRail({ facets, filters, onChange }: SchemeFilterRailProps) {
  const activeCount = countActiveFilters(filters);

  return (
    <div className="rounded-2xl border border-ink-200 dark:border-ink-800 bg-surface p-4 shadow-card">
      <div className="flex items-center justify-between gap-2 border-b border-ink-100 dark:border-ink-900 pb-3">
        <h2 className="text-sm font-semibold text-ink-900 dark:text-ink-50">Filter by</h2>
        <button
          type="button"
          onClick={() => onChange(EMPTY_FILTERS)}
          disabled={activeCount === 0}
          className="text-xs font-semibold text-navy-600 dark:text-accent-blue transition-opacity hover:underline disabled:pointer-events-none disabled:opacity-40"
        >
          Reset filters
        </button>
      </div>

      {/* State / UT — single select, so it reads like the myScheme dropdown */}
      {facets && facets.states.length > 0 && (
        <div className="border-b border-ink-100 dark:border-ink-900 py-3">
          <label
            htmlFor="genie-state"
            className="mb-1.5 block text-sm font-semibold text-ink-800 dark:text-ink-100"
          >
            State / UT
          </label>
          <div className="relative">
            <select
              id="genie-state"
              value={filters.state}
              onChange={(event) => onChange({ ...filters, state: event.target.value })}
              className="h-10 w-full appearance-none rounded-lg border border-ink-200 bg-surface px-3 pr-8 text-sm text-ink-900 outline-none transition-colors hover:border-ink-300 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 dark:border-transparent dark:bg-control dark:text-ink-50 dark:hover:border-ink-700 dark:focus:border-accent-blue"
            >
              <option value="">All states</option>
              {facets.states.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value} ({option.count})
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400 dark:text-ink-600"
              aria-hidden
            />
          </div>
        </div>
      )}

      <CheckboxSection
        title="Scheme category"
        options={facets?.categories ?? []}
        selected={filters.categories}
        onToggle={(value) => onChange({ ...filters, categories: toggle(filters.categories, value) })}
      />
      <CheckboxSection
        title="Beneficiary"
        options={facets?.beneficiaries ?? []}
        selected={filters.beneficiaries}
        onToggle={(value) =>
          onChange({ ...filters, beneficiaries: toggle(filters.beneficiaries, value) })
        }
      />
      <CheckboxSection
        title="Tags"
        options={facets?.tags ?? []}
        selected={filters.tags}
        onToggle={(value) => onChange({ ...filters, tags: toggle(filters.tags, value) })}
      />

      <div className="pt-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.openOnly}
            onChange={(event) => onChange({ ...filters, openOnly: event.target.checked })}
            className="h-3.5 w-3.5 shrink-0 rounded border-ink-300 dark:border-ink-700 text-navy-600 focus:ring-navy-500"
          />
          <span className="text-ink-600 dark:text-ink-300">Currently open only</span>
        </label>
      </div>
    </div>
  );
}
