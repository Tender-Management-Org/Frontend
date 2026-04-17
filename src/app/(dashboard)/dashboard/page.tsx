import { AlertTriangle, BriefcaseBusiness, Clock3, Send } from "lucide-react";
import { ActionRequired } from "./components/ActionRequired";
import { DashboardQuickLinks } from "./components/DashboardQuickLinks";
import { DashboardWelcome } from "./components/DashboardWelcome";
import { FunnelChart } from "./components/FunnelChart";
import { StatsCard } from "./components/StatsCard";
import { TenderMatchList } from "./components/TenderMatchList";

export default function DashboardPage() {
  const stats = {
    matched: 24,
    expiring: 5,
    action_required: 8,
    applied: 10
  };

  const matches = [
    {
      title: "Road Construction - Ahmedabad",
      tenderId: "2026_CEPWD_550252_1",
      fit_score: 85,
      status: "Matched" as const,
      reason: "Matches your turnover and category"
    },
    {
      title: "Smart Classroom Infra Setup",
      tenderId: "demo-smart-classroom-001",
      fit_score: 74,
      status: "Interested" as const,
      reason: "Strong technical capability match"
    },
    {
      title: "Drainage Rehabilitation Phase II",
      tenderId: "demo-water-pipeline-003",
      fit_score: 91,
      status: "Applied" as const,
      reason: "High historical success rate in similar tenders"
    },
    {
      title: "Rural Solar Lighting Deployment",
      tenderId: "demo-solar-005",
      fit_score: 58,
      status: "Lost" as const,
      reason: "Partial qualification match due to domain mismatch"
    }
  ];

  const actionItems = [
    { title: "Road Construction - Ahmedabad", deadline: "2026-05-01", href: "/tenders/2026_CEPWD_550252_1" },
    { title: "Smart Classroom Infra Setup", deadline: "2026-05-03", href: "/tenders/demo-smart-classroom-001" },
    { title: "Water Pipeline Expansion Project", deadline: "2026-05-05", href: "/tenders/demo-water-pipeline-003" }
  ];

  const funnelData = [
    { stage: "Matched", count: 24 },
    { stage: "Interested", count: 16 },
    { stage: "Applied", count: 10 },
    { stage: "Won", count: 3 }
  ];

  return (
    <section className="mx-auto w-full max-w-7xl space-y-8">
      <div className="relative rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-slate-50/90 p-6 shadow-sm sm:p-8">
        <div
          className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent sm:inset-x-8"
          aria-hidden
        />
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <DashboardWelcome
            summary={{
              needsDecision: stats.action_required,
              expiringSoon: stats.expiring,
              applied: stats.applied
            }}
          />
          <DashboardQuickLinks />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Matched tenders"
          value={stats.matched}
          icon={BriefcaseBusiness}
          trend="+12% vs last week"
          href="/tenders"
        />
        <StatsCard
          title="Expiring soon"
          value={stats.expiring}
          icon={Clock3}
          accent="warning"
          trend="Closing in the next 7 days"
          href="/tenders"
        />
        <StatsCard
          title="Needs decision"
          value={stats.action_required}
          icon={AlertTriangle}
          accent="danger"
          trend="Review or dismiss to stay on track"
          href="/dashboard#attention"
        />
        <StatsCard
          title="Applied"
          value={stats.applied}
          icon={Send}
          accent="success"
          trend="+4 submissions this week"
          href="/tenders"
        />
      </div>

      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        <div className="col-span-12 space-y-6 lg:col-span-8">
          <TenderMatchList matches={matches} />
          <FunnelChart data={funnelData} />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-20 lg:space-y-6">
            <ActionRequired items={actionItems} />
          </div>
        </div>
      </div>
    </section>
  );
}
