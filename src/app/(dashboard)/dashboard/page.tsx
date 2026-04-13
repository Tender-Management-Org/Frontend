import { AlertTriangle, BriefcaseBusiness, Clock3, Send } from "lucide-react";
import { ActionRequired } from "./components/ActionRequired";
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
      fit_score: 85,
      status: "Matched" as const,
      reason: "Matches your turnover and category"
    },
    {
      title: "Smart Classroom Infra Setup",
      fit_score: 74,
      status: "Interested" as const,
      reason: "Strong technical capability match"
    },
    {
      title: "Drainage Rehabilitation Phase II",
      fit_score: 91,
      status: "Applied" as const,
      reason: "High historical success rate in similar tenders"
    },
    {
      title: "Rural Solar Lighting Deployment",
      fit_score: 58,
      status: "Lost" as const,
      reason: "Partial qualification match due to domain mismatch"
    }
  ];

  const actionItems = [
    { title: "Road Construction - Ahmedabad", deadline: "2026-05-01" },
    { title: "Smart Classroom Infra Setup", deadline: "2026-05-03" },
    { title: "Water Pipeline Expansion Project", deadline: "2026-05-05" }
  ];

  const funnelData = [
    { stage: "Matched", count: 24 },
    { stage: "Interested", count: 16 },
    { stage: "Applied", count: 10 },
    { stage: "Won", count: 3 }
  ];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
        <p className="text-sm text-slate-500">Action-driven view of matches, priorities, and conversions.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Matched Tenders" value={stats.matched} icon={BriefcaseBusiness} trend="+12% this week" />
        <StatsCard title="Expiring Soon" value={stats.expiring} icon={Clock3} accent="warning" trend="Next 7 days" />
        <StatsCard
          title="Action Required"
          value={stats.action_required}
          icon={AlertTriangle}
          accent="danger"
          trend="Pending decisions"
        />
        <StatsCard title="Applied" value={stats.applied} icon={Send} accent="success" trend="+4 this week" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <TenderMatchList matches={matches} />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <ActionRequired items={actionItems} />
        </div>
      </div>

      <FunnelChart data={funnelData} />
    </section>
  );
}
