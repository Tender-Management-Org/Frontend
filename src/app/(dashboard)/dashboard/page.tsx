import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AlertTriangle, ArrowRight, BriefcaseBusiness, Clock3, Send } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { getFirms } from "@/lib/api/firms";
import { getDashboardStats } from "@/lib/api/tenders";
import type { DashboardStatsApi } from "@/lib/api/tenders";
import { ActionRequired } from "./components/ActionRequired";
import { DashboardWelcome } from "./components/DashboardWelcome";
import { FunnelChart } from "./components/FunnelChart";
import { StatsCard } from "./components/StatsCard";

export default async function DashboardPage() {
  // ── Resolve active firm (prefer cookie set by FirmSwitcher) ───────────────
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
      redirect("/login?next=%2Fdashboard");
    }
    throw error;
  }

  // ── Fetch dashboard stats ──────────────────────────────────────────────────
  let stats: DashboardStatsApi | null = null;
  if (firmId) {
    try {
      stats = await getDashboardStats(firmId);
    } catch {
      // Render empty state — don't crash the whole page
    }
  }

  // ── Derived values ─────────────────────────────────────────────────────────
  const unread = stats?.unread_recommendations ?? 0;
  const total = stats?.total_recommendations ?? 0;
  const expiringSoon = stats?.expiring_soon ?? 0;
  const needsDecision = stats?.needs_decision ?? 0;
  const applied = stats?.applied ?? 0;
  const attentionItems = stats?.attention_items ?? [];
  const attentionCount = attentionItems.length;

  const funnelData = stats?.funnel ?? [
    { stage: "Matched", count: 0 },
    { stage: "Interested", count: 0 },
    { stage: "Applied", count: 0 },
    { stage: "Won", count: 0 },
  ];

  const actionItems = attentionItems.map((item) => ({
    title: item.title,
    deadline: item.bid_submission_end_date ?? "",
    href: item.href,
  }));

  return (
    <section className="mx-auto w-full max-w-7xl space-y-6">
      {/* Welcome hero */}
      <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card sm:p-8">
        <DashboardWelcome />
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-ink-100 pt-5">
          <Link
            href="/recommendations"
            className="inline-flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2"
          >
            Review recommendations
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          {attentionCount > 0 && (
            <Link
              href="/dashboard#attention"
              className="inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2"
            >
              Resolve {attentionCount} attention item{attentionCount !== 1 ? "s" : ""}
            </Link>
          )}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Unread recommendations"
          value={`${unread} / ${total}`}
          icon={BriefcaseBusiness}
          subtitle={unread === 0 ? "All caught up!" : `${total - unread} already reviewed`}
          tooltip={`AI-matched tenders for your firm (capped at ${total}). Shows how many you haven't opened yet.`}
          href="/recommendations"
        />
        <StatsCard
          title="Expiring soon"
          value={expiringSoon}
          icon={Clock3}
          accent="warning"
          subtitle="Matched or interested — closing in 7 days"
          tooltip="Tenders you've been matched with or marked as interested that close within the next 7 days."
          href="/tenders"
        />
        <StatsCard
          title="Needs decision"
          value={needsDecision}
          icon={AlertTriangle}
          accent="danger"
          subtitle="Unreviewed AI recommendations"
          tooltip="Recommended tenders you haven't opened yet. Mark as interested or dismiss to keep your pipeline clean."
          href="/recommendations"
        />
        <StatsCard
          title="Applied"
          value={applied}
          icon={Send}
          accent="success"
          subtitle={applied === 0 ? "No applications yet" : `${applied} bid${applied !== 1 ? "s" : ""} submitted`}
          tooltip="Total tenders you've submitted a bid for."
          href="/tenders"
        />
      </div>

      {/* Main content + sidebar */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 space-y-6 lg:col-span-8">
          <FunnelChart data={funnelData} />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-6">
            <ActionRequired items={actionItems} />
          </div>
        </div>
      </div>
    </section>
  );
}
