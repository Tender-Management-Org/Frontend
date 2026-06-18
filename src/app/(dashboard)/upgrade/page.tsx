"use client";

import { useEffect, useState } from "react";
import { Check, Sparkles, Zap, Building2, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPlans, type PlanApi } from "@/lib/api/subscription";
import { useSubscription } from "@/hooks/useSubscription";

// ── Feature rows shown in each plan card ─────────────────────────────────────
const FEATURE_LABELS: { key: keyof PlanApi["features"]; label: string }[] = [
  { key: "can_use_advanced_filters",  label: "Advanced filters" },
  { key: "can_use_eligibility_check", label: "Eligibility check" },
  { key: "can_use_interest_signals",  label: "Interest signals" },
  { key: "can_extract_documents",     label: "AI document extraction" },
  { key: "can_export_data",           label: "Export data" },
  { key: "can_access_api",            label: "API access" },
  { key: "has_priority_support",      label: "Priority support" },
];

const PLAN_ICONS: Record<string, React.ElementType> = {
  starter:    Zap,
  growth:     Sparkles,
  enterprise: Crown,
};

const PLAN_ACCENT: Record<string, string> = {
  starter:    "border-navy-300 ring-navy-200",
  growth:     "border-navy-500 ring-navy-300",
  enterprise: "border-warning-500 ring-warning-200",
};

const PLAN_BADGE: Record<string, string | null> = {
  starter:    null,
  growth:     "Most popular",
  enterprise: "Custom",
};

function formatPrice(price: number) {
  if (price === 0) return "Custom";
  return `₹${price.toLocaleString("en-IN")}`;
}

function PlanCard({
  plan,
  isCurrentPlan,
}: {
  plan: PlanApi;
  isCurrentPlan: boolean;
}) {
  const Icon = PLAN_ICONS[plan.tier] ?? Zap;
  const badge = PLAN_BADGE[plan.tier];
  const accentClass = PLAN_ACCENT[plan.tier] ?? "border-ink-200";
  const isEnterprise = plan.tier === "enterprise";

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover",
        isCurrentPlan ? `ring-2 ${accentClass}` : "border-ink-200"
      )}
    >
      {/* Badge */}
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-navy-600 px-3 py-1 text-xs font-semibold text-white">
          {badge}
        </span>
      )}

      {/* Header */}
      <div className="mb-5">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50">
          <Icon className="h-5 w-5 text-navy-600" />
        </div>
        <h2 className="text-lg font-bold text-ink-900">{plan.name}</h2>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-3xl font-bold text-ink-900">{formatPrice(plan.price_monthly)}</span>
          {plan.price_monthly > 0 && <span className="text-sm text-ink-400">/month</span>}
        </div>
        {plan.price_yearly > 0 && (
          <p className="mt-0.5 text-xs text-success-600">
            ₹{plan.price_yearly.toLocaleString("en-IN")}/year — save{" "}
            {Math.round(100 - (plan.price_yearly / (plan.price_monthly * 12)) * 100)}%
          </p>
        )}
      </div>

      {/* Limits */}
      <div className="mb-5 space-y-1.5 rounded-xl bg-ink-50 p-3 text-xs text-ink-600">
        <p>
          <span className="font-semibold text-ink-800">
            {plan.max_firms === -1 ? "Unlimited" : plan.max_firms}
          </span>{" "}
          firm{plan.max_firms !== 1 ? "s" : ""}
        </p>
        <p>
          <span className="font-semibold text-ink-800">
            {plan.recommendation_count === -1 ? "Unlimited" : plan.recommendation_count}
          </span>{" "}
          recommendations / day
        </p>
      </div>

      {/* Features */}
      <ul className="mb-6 flex-1 space-y-2.5">
        {FEATURE_LABELS.map(({ key, label }) => {
          const enabled = plan.features[key];
          return (
            <li key={key} className={cn("flex items-center gap-2 text-sm", !enabled && "opacity-40")}>
              <span
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                  enabled ? "bg-success-50 text-success-600" : "bg-ink-100 text-ink-300"
                )}
              >
                {enabled ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : <span className="text-[10px]">—</span>}
              </span>
              <span className={enabled ? "text-ink-700" : "text-ink-400"}>{label}</span>
            </li>
          );
        })}
      </ul>

      {/* CTA */}
      {isCurrentPlan ? (
        <div className="rounded-xl border border-navy-200 bg-navy-50 py-2.5 text-center text-sm font-semibold text-navy-700">
          Current plan
        </div>
      ) : isEnterprise ? (
        <a
          href="mailto:hello@tenderpilot.in?subject=Enterprise plan enquiry"
          className="block rounded-xl bg-warning-600 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-warning-700"
        >
          Contact us
        </a>
      ) : (
        <button
          type="button"
          className="w-full rounded-xl bg-navy-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => {
            // TODO: open Razorpay checkout for plan.tier
            alert(`Razorpay checkout for ${plan.name} — wire up payment here.`);
          }}
        >
          Upgrade to {plan.name}
        </button>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function UpgradePage() {
  const [plans, setPlans] = useState<PlanApi[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const { subscription, loading: loadingSub } = useSubscription();

  useEffect(() => {
    getPlans()
      .then(setPlans)
      .catch(() => {})
      .finally(() => setLoadingPlans(false));
  }, []);

  const currentTier = subscription?.plan.tier ?? null;
  const loading = loadingPlans || loadingSub;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-600 ring-1 ring-navy-200">
          <Building2 className="h-3.5 w-3.5" />
          Plans &amp; Pricing
        </div>
        <h1 className="text-2xl font-bold text-ink-900 sm:text-3xl">
          Choose the right plan for your firm
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          All plans include daily AI recommendations, eligibility tracking, and document management.
        </p>
      </div>

      {/* Current plan notice */}
      {subscription && (
        <div className="rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-600 shadow-card">
          You are currently on the{" "}
          <span className="font-semibold text-ink-900">{subscription.plan.name}</span> plan
          {subscription.status === "trial" && subscription.days_remaining !== null && (
            <span className="text-warning-600">
              {" "}— {subscription.days_remaining} day{subscription.days_remaining !== 1 ? "s" : ""} remaining in trial
            </span>
          )}
          .
        </div>
      )}

      {/* Plan cards */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 animate-pulse rounded-2xl bg-ink-100" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={plan.tier === currentTier}
            />
          ))}
        </div>
      )}

      {/* Footer note */}
      <p className="text-center text-xs text-ink-400">
        Prices shown are exclusive of GST. Annual billing saves up to 17%. Contact us for custom enterprise pricing.
      </p>
    </div>
  );
}
