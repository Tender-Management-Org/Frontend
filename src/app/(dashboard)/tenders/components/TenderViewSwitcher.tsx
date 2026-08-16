"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, Check, ChevronDown, Columns2, LayoutGrid, Rows3, Rows4 } from "lucide-react";
import { cn } from "@/lib/utils";

export type TenderView = "detailed" | "minimal" | "compact" | "calendar" | "split";

export const TENDER_VIEW_OPTIONS = [
  {
    value: "detailed" as const,
    label: "Detailed",
    description: "Full cards with meta and summary",
    Icon: LayoutGrid,
  },
  {
    value: "minimal" as const,
    label: "Minimalistic",
    description: "Dense table — more rows per screen",
    Icon: Rows3,
  },
  {
    value: "compact" as const,
    label: "Compact",
    description: "Single-line rows — maximum density",
    Icon: Rows4,
  },
  {
    value: "split" as const,
    label: "Split",
    description: "List on the left, details on the right",
    Icon: Columns2,
  },
  {
    value: "calendar" as const,
    label: "Calendar",
    description: "Tenders placed on their closing date",
    Icon: CalendarDays,
  },
];

interface TenderViewSwitcherProps {
  value: TenderView;
  onChange: (view: TenderView) => void;
  className?: string;
}

export function TenderViewSwitcher({ value, onChange, className }: TenderViewSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const active = TENDER_VIEW_OPTIONS.find((o) => o.value === value) ?? TENDER_VIEW_OPTIONS[0];
  const ActiveIcon = active.Icon;

  // Close on outside click / Escape
  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Change view — currently ${active.label}`}
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-lg border border-ink-200 dark:border-ink-800 bg-surface px-3 text-sm font-medium text-ink-700 dark:text-ink-200 shadow-card transition-colors",
          "hover:bg-ink-50 dark:hover:bg-ink-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500/40",
          isOpen && "border-navy-300 dark:border-accent-blue-bg bg-navy-50 dark:bg-accent-blue-bg text-navy-700 dark:text-accent-blue"
        )}
      >
        <ActiveIcon className="h-4 w-4 text-ink-400 dark:text-ink-600" aria-hidden />
        <span className="hidden sm:inline">{active.label}</span>
        <span className="sm:hidden">View</span>
        <ChevronDown
          className={cn("h-3.5 w-3.5 text-ink-400 dark:text-ink-600 transition-transform", isOpen && "rotate-180")}
          aria-hidden
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Tender view"
          className="absolute right-0 z-30 mt-1.5 w-72 animate-fade-in overflow-hidden rounded-xl border border-ink-200 dark:border-ink-800 bg-surface p-1 shadow-dropdown"
        >
          {TENDER_VIEW_OPTIONS.map((option) => {
            const OptionIcon = option.Icon;
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500/40",
                  isSelected ? "bg-navy-50 dark:bg-accent-blue-bg" : "hover:bg-ink-50 dark:hover:bg-ink-950"
                )}
              >
                <OptionIcon
                  className={cn("mt-0.5 h-4 w-4 shrink-0", isSelected ? "text-navy-600 dark:text-accent-blue" : "text-ink-400 dark:text-ink-600")}
                  aria-hidden
                />
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block text-sm font-semibold",
                      isSelected ? "text-navy-700 dark:text-accent-blue" : "text-ink-800 dark:text-ink-100"
                    )}
                  >
                    {option.label}
                  </span>
                  <span className="mt-0.5 block text-xs leading-snug text-ink-400 dark:text-ink-600">
                    {option.description}
                  </span>
                </span>
                {isSelected && <Check className="mt-0.5 h-4 w-4 shrink-0 text-navy-600 dark:text-accent-blue" aria-hidden />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
