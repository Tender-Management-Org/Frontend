import Link from "next/link";
import { ArrowRight, Building2, CalendarDays, Landmark, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SchemeListItemApi } from "@/lib/api/genie";

/** Tags beyond this are collapsed into a "+N" pill so cards stay one height. */
const MAX_VISIBLE_TAGS = 5;

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

export function SchemeCard({ scheme }: { scheme: SchemeListItemApi }) {
  const href = `/genie/${encodeURIComponent(scheme.slug)}`;
  const authority =
    scheme.nodal_ministry || (scheme.level === "state" ? scheme.scheme_for : "Government of India");
  const visibleTags = scheme.tags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTagCount = scheme.tags.length - visibleTags.length;
  const closeDate = formatDate(scheme.close_date);

  return (
    <article className="group rounded-2xl border border-ink-200 dark:border-ink-800 bg-surface p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="text-base font-semibold leading-snug text-ink-900 dark:text-ink-50 transition-colors group-hover:text-navy-700 dark:group-hover:text-navy-500">
            <Link
              href={href}
              className="rounded-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:focus-visible:ring-navy-400"
            >
              {scheme.scheme_name}
            </Link>
          </h3>
          <p className="flex items-center gap-1.5 text-sm text-ink-500 dark:text-ink-400">
            {scheme.level === "state" ? (
              <MapPin className="h-3.5 w-3.5 shrink-0 text-ink-400 dark:text-ink-600" aria-hidden />
            ) : (
              <Landmark className="h-3.5 w-3.5 shrink-0 text-ink-400 dark:text-ink-600" aria-hidden />
            )}
            <span className="truncate">{authority}</span>
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
              scheme.level === "central"
                ? "border border-navy-200 bg-navy-50 text-navy-700 dark:border-accent-blue-bg dark:bg-accent-blue-bg dark:text-accent-blue"
                : "border border-violet-200 bg-violet-50 text-violet-700 dark:border-accent-purple-bg dark:bg-accent-purple-bg dark:text-accent-purple"
            )}
          >
            {scheme.level === "central" ? "Central" : scheme.scheme_for || "State"}
          </span>
          {!scheme.is_currently_open && (
            <span className="inline-flex items-center rounded-full border border-danger-500/30 bg-danger-50 px-2 py-0.5 text-xs font-semibold text-danger-700 dark:bg-danger-500/10 dark:text-danger-500">
              Closed
            </span>
          )}
        </div>
      </div>

      {scheme.brief_description && (
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-500 dark:text-ink-400">
          {scheme.brief_description}
        </p>
      )}

      {(scheme.scheme_type || closeDate) && (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-500 dark:text-ink-400">
          {scheme.scheme_type && (
            <span className="inline-flex items-center gap-1">
              <Building2 className="h-3 w-3 shrink-0 text-ink-400 dark:text-ink-600" aria-hidden />
              {scheme.scheme_type}
            </span>
          )}
          {closeDate && (
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3 w-3 shrink-0 text-ink-400 dark:text-ink-600" aria-hidden />
              Closes {closeDate}
            </span>
          )}
        </div>
      )}

      <div className="mt-4 flex items-end justify-between gap-3 border-t border-ink-100 dark:border-ink-900 pt-3">
        <div className="flex min-w-0 flex-wrap gap-1.5">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 px-2.5 py-0.5 text-xs font-medium text-ink-500 dark:text-ink-400"
            >
              {tag}
            </span>
          ))}
          {hiddenTagCount > 0 && (
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-ink-400 dark:text-ink-600">
              +{hiddenTagCount}
            </span>
          )}
        </div>

        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-ink-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:bg-ink-50 dark:text-ink-900 dark:hover:bg-primary/90 dark:focus-visible:ring-navy-400"
        >
          View details
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
