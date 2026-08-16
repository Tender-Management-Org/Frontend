import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, CalendarDays, Landmark, MapPin, Users } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { getScheme, type SchemeDetailApi } from "@/lib/api/genie";
import { collectSections, readBlobKey } from "@/lib/genie/schemeContent";
import { cn } from "@/lib/utils";
import { SchemeBlobSection } from "../components/SchemeBlobSection";
import { SchemeChatPanel } from "../components/SchemeChatPanel";

export const dynamic = "force-dynamic";

type PageProps = { params: { slug: string } };

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

async function loadScheme(slug: string): Promise<SchemeDetailApi> {
  try {
    return await getScheme(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    if (error instanceof ApiError && error.status === 401) {
      redirect(`/login?next=${encodeURIComponent(`/genie/${slug}`)}`);
    }
    throw error;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const scheme = await getScheme(params.slug);
    return {
      title: `${scheme.scheme_name} — Genie`,
      description: scheme.brief_description?.slice(0, 200),
    };
  } catch {
    return { title: "Scheme — Genie" };
  }
}

export default async function SchemeDetailPage({ params }: PageProps) {
  const scheme = await loadScheme(params.slug);
  const blob = scheme.normalised_json_blob;

  const authority =
    scheme.nodal_ministry || (scheme.level === "state" ? scheme.scheme_for : "Government of India");
  const implementingAgency = String(readBlobKey(blob, "implementingAgency") ?? "");
  const openDate = formatDate(scheme.open_date);
  const closeDate = formatDate(scheme.close_date);
  const sections = collectSections(blob);

  const facts = [
    { label: "Level", value: scheme.level === "central" ? "Central" : "State / UT", icon: Landmark },
    { label: scheme.level === "central" ? "Applies to" : "State / UT", value: scheme.scheme_for, icon: MapPin },
    { label: "Scheme type", value: scheme.scheme_type, icon: Users },
    { label: "Open date", value: openDate, icon: CalendarDays },
    { label: "Close date", value: closeDate, icon: CalendarDays },
  ].filter((fact) => Boolean(fact.value));

  return (
    <section className="mx-auto w-full max-w-5xl space-y-5">
      <Link
        href="/genie"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to schemes
      </Link>

      {/* Header */}
      <header className="rounded-2xl border border-ink-200 bg-surface p-6 shadow-card dark:border-ink-800">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  scheme.level === "central"
                    ? "border border-navy-200 bg-navy-50 text-navy-700 dark:border-accent-blue-bg dark:bg-accent-blue-bg dark:text-accent-blue"
                    : "border border-violet-200 bg-violet-50 text-violet-700 dark:border-accent-purple-bg dark:bg-accent-purple-bg dark:text-accent-purple"
                )}
              >
                {scheme.level === "central" ? "Central" : scheme.scheme_for || "State"}
              </span>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  scheme.is_currently_open
                    ? "border border-success-500/30 bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-500"
                    : "border border-danger-500/30 bg-danger-50 text-danger-700 dark:bg-danger-500/10 dark:text-danger-500"
                )}
              >
                {scheme.is_currently_open ? "Open" : "Closed"}
              </span>
            </div>

            <h1 className="text-xl font-semibold leading-snug text-ink-900 dark:text-ink-50">
              {scheme.scheme_name}
            </h1>
            {scheme.short_title && scheme.short_title !== scheme.scheme_name && (
              <p className="text-sm font-medium text-ink-500 dark:text-ink-400">
                {scheme.short_title}
              </p>
            )}
            <p className="text-sm text-ink-500 dark:text-ink-400">{authority}</p>
            {implementingAgency && implementingAgency !== authority && (
              <p className="text-xs text-ink-400 dark:text-ink-600">
                Implemented by {implementingAgency}
              </p>
            )}
          </div>

          <SchemeChatPanel inline label="Ask about this scheme" />
        </div>

        {scheme.brief_description && (
          <p className="mt-4 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
            {scheme.brief_description}
          </p>
        )}

        {facts.length > 0 && (
          <dl className="mt-5 grid gap-3 border-t border-ink-100 pt-4 dark:border-ink-900 sm:grid-cols-3">
            {facts.map((fact) => {
              const Icon = fact.icon;
              return (
                <div key={fact.label} className="rounded-lg bg-ink-50 px-3 py-2 dark:bg-ink-950">
                  <dt className="mb-0.5 text-2xs font-semibold uppercase tracking-widest text-ink-400 dark:text-ink-600">
                    {fact.label}
                  </dt>
                  <dd className="flex items-center gap-1.5 text-xs font-medium text-ink-700 dark:text-ink-200">
                    <Icon className="h-3 w-3 shrink-0 text-ink-400 dark:text-ink-600" aria-hidden />
                    <span className="truncate">{fact.value}</span>
                  </dd>
                </div>
              );
            })}
          </dl>
        )}

        {(scheme.category_labels.length > 0 ||
          scheme.target_beneficiaries.length > 0 ||
          scheme.tags.length > 0) && (
          <div className="mt-4 space-y-2 border-t border-ink-100 pt-4 dark:border-ink-900">
            {[
              { label: "Categories", values: scheme.category_labels },
              { label: "Beneficiaries", values: scheme.target_beneficiaries },
              { label: "Tags", values: scheme.tags },
            ]
              .filter((group) => group.values.length > 0)
              .map((group) => (
                <div key={group.label} className="flex flex-wrap items-center gap-1.5">
                  <span className="mr-1 text-2xs font-semibold uppercase tracking-widest text-ink-400 dark:text-ink-600">
                    {group.label}
                  </span>
                  {group.values.map((value) => (
                    <span
                      key={value}
                      className="inline-flex items-center rounded-full border border-ink-200 bg-ink-50 px-2.5 py-0.5 text-xs font-medium text-ink-600 dark:border-ink-800 dark:bg-ink-950 dark:text-ink-300"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              ))}
          </div>
        )}
      </header>

      {/* Body — everything else the normalised blob carries */}
      {sections.length > 0 ? (
        <div className="space-y-4">
          {sections.map((section) => (
            <SchemeBlobSection key={section.key} label={section.label} value={section.value} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-surface p-8 text-center dark:border-ink-800">
          <p className="text-sm text-ink-500 dark:text-ink-400">
            No further detail has been synced for this scheme yet.
          </p>
        </div>
      )}
    </section>
  );
}
