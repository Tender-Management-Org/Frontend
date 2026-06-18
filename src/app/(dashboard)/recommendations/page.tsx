import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ArrowRight, Sparkles } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { getFirms, getFirmPreferences } from "@/lib/api/firms";
import { getRecommendations, type TenderRecommendationApi } from "@/lib/api/tenders";
import { RefreshButton } from "./components/RefreshButton";
import { RecommendationCard } from "./components/RecommendationCard";

// ─── page ────────────────────────────────────────────────────────────────────

export default async function RecommendationsPage() {
  // Fetch active firm (prefer cookie set by FirmSwitcher)
  let firmId: string | null = null;
  try {
    const cookieStore = await cookies();
    const cookieFirmId = cookieStore.get("tp_active_firm")?.value ?? null;
    const firmsRes = await getFirms(1);
    const activeList = firmsRes.results.filter((f) => f.is_active);
    const cookieMatch = cookieFirmId ? activeList.find((f) => f.id === cookieFirmId) : null;
    firmId = (cookieMatch ?? activeList[0])?.id ?? null;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect("/login?next=%2Frecommendations");
    }
    throw error;
  }

  // Fetch firm preferences to get recommendations_count
  let recommendationsCount = 10;
  if (firmId) {
    try {
      const prefs = await getFirmPreferences(firmId);
      recommendationsCount = prefs.recommendations_count ?? 10;
    } catch {
      // Fall back to default
    }
  }

  // Fetch recommendations
  let items: TenderRecommendationApi[] = [];
  let embeddingMissing = false;

  if (firmId) {
    try {
      const res = await getRecommendations(firmId, { page_size: recommendationsCount });
      items = res.results;
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        embeddingMissing = true;
      } else if (error instanceof ApiError && error.status === 401) {
        redirect("/login?next=%2Frecommendations");
      }
      // Otherwise swallow — show empty state
    }
  }

  return (
    <section className="mx-auto w-full max-w-7xl space-y-5">
      {/* Header */}
      <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 shrink-0">
              <Sparkles className="h-5 w-5 text-navy-600" aria-hidden />
            </div>
            <div>
              <h1 className="text-xl font-bold text-ink-900">Recommendations</h1>
              <p className="mt-1 text-sm text-ink-500">
                {items.length > 0
                  ? `Today's top ${items.length} match${items.length === 1 ? "" : "es"} — refreshes daily, sorted by fit score.`
                  : "Your daily shortlist of tenders matched to your firm profile."}
              </p>
            </div>
          </div>
          {firmId && !embeddingMissing && (
            <RefreshButton firmId={firmId} />
          )}
        </div>
      </div>

      {/* No firm */}
      {!firmId && (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-ink-200 bg-white py-20 text-center shadow-card">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-50">
            <Sparkles className="h-8 w-8 text-ink-300" />
          </div>
          <h3 className="text-base font-semibold text-ink-800">No active firm found</h3>
          <p className="mt-1 max-w-xs text-sm text-ink-400">
            Complete your firm profile to unlock personalised tender recommendations.
          </p>
          <Link
            href="/firm"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700"
          >
            Set up firm profile
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      )}

      {/* Embedding not ready */}
      {firmId && embeddingMissing && (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-ink-200 bg-white py-20 text-center shadow-card">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-50">
            <Sparkles className="h-8 w-8 text-navy-300" />
          </div>
          <h3 className="text-base font-semibold text-ink-800">Profile not ready yet</h3>
          <p className="mt-1 max-w-sm text-sm text-ink-400">
            Your firm&apos;s embedding is still being built. Add your scope of work, industry, and past
            experiences — then come back to see matched tenders.
          </p>
          <Link
            href="/firm"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700"
          >
            Complete firm profile
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      )}

      {/* Empty state */}
      {firmId && !embeddingMissing && items.length === 0 && (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-ink-200 bg-white py-20 text-center shadow-card">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-50">
            <Sparkles className="h-8 w-8 text-navy-400" />
          </div>
          <h3 className="text-base font-semibold text-ink-800">No recommendations yet</h3>
          <p className="mt-1 max-w-sm text-sm text-ink-400">
            Click &ldquo;Refresh&rdquo; to generate your first batch of matched tenders based on your firm profile.
          </p>
          {firmId && <RefreshButton firmId={firmId} />}
        </div>
      )}

      {/* Recommendations list */}
      {items.length > 0 && firmId && (
        <div className="space-y-3">
          {items.map((item) => (
            <RecommendationCard key={item.match_id} item={item} firmId={firmId} />
          ))}
        </div>
      )}

      {/* Browse more */}
      <p className="text-center text-xs text-ink-400">
        These are today&apos;s top {items.length} matches.{" "}
        <Link href="/tenders" className="font-semibold text-navy-600 hover:underline">
          Browse all tenders
        </Link>
      </p>
    </section>
  );
}
