import { Sparkles, TrendingUp, UserCheck, Bell, Target } from "lucide-react";

const placeholderCategories = [
  {
    icon: UserCheck,
    title: "Profile completeness",
    description: "Complete your firm's experience records and certifications to improve tender matching accuracy.",
    impact: "High",
    impactColor: "bg-danger-50 text-danger-700 border-danger-200",
  },
  {
    icon: Target,
    title: "Tender fit improvements",
    description: "Update your scope of work to include specific project categories where you have past experience.",
    impact: "High",
    impactColor: "bg-danger-50 text-danger-700 border-danger-200",
  },
  {
    icon: Bell,
    title: "Deadline reminders",
    description: "Set up alerts for tenders with submission deadlines within 7 days.",
    impact: "Medium",
    impactColor: "bg-warning-50 text-warning-700 border-warning-200",
  },
  {
    icon: TrendingUp,
    title: "Bid win rate insights",
    description: "Analysis of your historical applications will surface patterns to improve success rates.",
    impact: "Medium",
    impactColor: "bg-warning-50 text-warning-700 border-warning-200",
  },
];

export default function RecommendationsPage() {
  return (
    <section className="mx-auto w-full max-w-7xl space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50">
            <Sparkles className="h-5 w-5 text-navy-600" aria-hidden />
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink-900">Recommendations</h1>
            <p className="text-sm text-ink-500">AI-powered suggestions to improve your bid win rate.</p>
          </div>
        </div>
      </div>

      {/* Coming soon state */}
      <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-12 text-center shadow-card">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-50">
          <Sparkles className="h-8 w-8 text-navy-400" />
        </div>
        <h2 className="text-base font-semibold text-ink-800">No recommendations yet</h2>
        <p className="mt-2 max-w-sm mx-auto text-sm text-ink-400">
          Personalised AI recommendations will appear here once your firm profile is complete and you have applied to a few tenders.
        </p>
      </div>

      {/* Preview of upcoming recommendation types */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-400">What&apos;s coming</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {placeholderCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.title}
                className="rounded-2xl border border-ink-200 bg-white p-5 opacity-60 shadow-card"
                aria-hidden="true"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-100">
                    <Icon className="h-4 w-4 text-ink-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-ink-800">{cat.title}</p>
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${cat.impactColor}`}>
                        {cat.impact}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-ink-500">{cat.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
