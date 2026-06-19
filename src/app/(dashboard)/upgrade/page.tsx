"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertCircle, Building2, Calendar, Check,
  Crown, Loader2, Phone, Sparkles, X, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BillingCycle, PlanApi, cancelSubscription,
  getPlans, subscribeToPlan,
} from "@/lib/api/subscription";
import { useSubscription } from "@/hooks/useSubscription";

// ── Static config ─────────────────────────────────────────────────────────────

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

const PLAN_BADGE: Record<string, string | null> = {
  starter:    null,
  growth:     "Most popular",
  enterprise: "Custom",
};

// ── Phone modal ───────────────────────────────────────────────────────────────

function PhoneModal({
  plan,
  billingCycle,
  onClose,
  onSuccess,
}: {
  plan: PlanApi;
  billingCycle: BillingCycle;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [phone, setPhone]     = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const price = billingCycle === "monthly" ? plan.price_monthly : plan.price_yearly;
  const label = billingCycle === "monthly" ? "/month" : "/year";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = phone.replace(/\s/g, "");
    if (!/^[6-9]\d{9}$/.test(cleaned)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { auth_link } = await subscribeToPlan(plan.tier, billingCycle, cleaned);
      window.location.href = auth_link;
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      setLoading(false);
    }
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 backdrop-blur-sm p-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-sm rounded-2xl border border-ink-200 bg-white shadow-dropdown">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-ink-100 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
              Subscribe to
            </p>
            <p className="text-base font-bold text-ink-900">
              {plan.name} — ₹{price.toLocaleString("en-IN")}{label}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 rounded-lg p-1 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-sm text-ink-600">
            Your mobile number is needed to set up the UPI AutoPay mandate for recurring billing.
          </p>

          <div className="space-y-1.5">
            <label htmlFor="phone" className="block text-sm font-medium text-ink-700">
              Mobile number <span className="text-danger-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                ref={inputRef}
                id="phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                  setError("");
                }}
                placeholder="9876543210"
                className={cn(
                  "w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-400 outline-none transition-colors",
                  "focus:border-navy-400 focus:ring-2 focus:ring-navy-100",
                  error ? "border-danger-400" : "border-ink-200"
                )}
              />
            </div>
            {error && (
              <p className="flex items-center gap-1.5 text-xs text-danger-600">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {error}
              </p>
            )}
          </div>

          <p className="text-xs text-ink-400">
            You&apos;ll be redirected to Cashfree to authorise the UPI AutoPay mandate. ₹1 is charged for verification and refunded.
          </p>

          <button
            type="submit"
            disabled={loading || phone.length < 10}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-navy-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Redirecting to Cashfree…" : "Continue to payment"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Plan card ─────────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  billingCycle,
  isCurrentPlan,
  isDowngrade,
  onSubscribe,
}: {
  plan: PlanApi;
  billingCycle: BillingCycle;
  isCurrentPlan: boolean;
  isDowngrade: boolean;
  onSubscribe: (plan: PlanApi) => void;
}) {
  const Icon        = PLAN_ICONS[plan.tier] ?? Zap;
  const badge       = PLAN_BADGE[plan.tier];
  const isEnterprise = plan.tier === "enterprise";
  const price       = billingCycle === "monthly" ? plan.price_monthly : plan.price_yearly;
  const priceSuffix = billingCycle === "monthly" ? "/month" : "/year";

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover",
        isCurrentPlan ? "border-navy-400 ring-2 ring-navy-200" : "border-ink-200"
      )}
    >
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
          <span className="text-3xl font-bold text-ink-900">
            {price === 0 ? "Custom" : `₹${price.toLocaleString("en-IN")}`}
          </span>
          {price > 0 && <span className="text-sm text-ink-400">{priceSuffix}</span>}
        </div>
        {billingCycle === "annual" && plan.price_yearly > 0 && (
          <p className="mt-0.5 text-xs text-success-600">
            Save {Math.round(100 - (plan.price_yearly / (plan.price_monthly * 12)) * 100)}% vs monthly
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
                {enabled
                  ? <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  : <span className="text-[10px]">—</span>}
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
          onClick={() => onSubscribe(plan)}
          className={cn(
            "w-full rounded-xl py-2.5 text-sm font-semibold transition-colors",
            isDowngrade
              ? "border border-ink-200 text-ink-700 hover:bg-ink-50"
              : "bg-navy-600 text-white hover:bg-navy-700"
          )}
        >
          {isDowngrade ? `Switch to ${plan.name}` : `Upgrade to ${plan.name}`}
        </button>
      )}
    </div>
  );
}

// ── Current plan status card ──────────────────────────────────────────────────

function CurrentPlanCard({ onCancelled }: { onCancelled: () => void }) {
  const { subscription, refresh } = useSubscription();
  const [cancelling,  setCancelling]  = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  if (!subscription) return null;
  const { status, plan, billing_cycle, cancel_at_period_end, current_period_end } = subscription;

  // Only show this card for paid (non-trial) subscriptions
  if (status === "trial" || status === "expired") return null;

  async function handleCancel() {
    setCancelling(true);
    setCancelError("");
    try {
      await cancelSubscription();
      refresh();
      onCancelled();
      setShowConfirm(false);
    } catch (err: unknown) {
      setCancelError(err instanceof Error ? err.message : "Could not cancel. Try again.");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-ink-900">
            {plan.name} plan
            {billing_cycle && (
              <span className="ml-2 rounded-full bg-navy-50 px-2 py-0.5 text-xs font-medium text-navy-600">
                {billing_cycle === "monthly" ? "Monthly" : "Annual"}
              </span>
            )}
            {status === "pending" && (
              <span className="ml-2 rounded-full bg-warning-50 px-2 py-0.5 text-xs font-medium text-warning-700">
                Pending mandate
              </span>
            )}
          </p>

          {current_period_end && status === "active" && (
            <p className="flex items-center gap-1.5 text-xs text-ink-500">
              <Calendar className="h-3.5 w-3.5" />
              {cancel_at_period_end
                ? `Access until ${new Date(current_period_end).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`
                : `Renews on ${new Date(current_period_end).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`}
            </p>
          )}

          {cancel_at_period_end && (
            <p className="text-xs font-medium text-warning-700">
              ⚠ Cancellation scheduled — no further charges after this period.
            </p>
          )}
        </div>

        {/* Cancel button — only if active and not already scheduled */}
        {status === "active" && !cancel_at_period_end && (
          <div className="shrink-0">
            {!showConfirm ? (
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="rounded-xl border border-danger-200 px-4 py-2 text-xs font-semibold text-danger-600 transition-colors hover:bg-danger-50"
              >
                Cancel subscription
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-xs text-ink-600">Cancel at period end?</p>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-danger-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-danger-700 disabled:opacity-50"
                >
                  {cancelling && <Loader2 className="h-3 w-3 animate-spin" />}
                  Yes, cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-50"
                >
                  Keep plan
                </button>
              </div>
            )}
            {cancelError && (
              <p className="mt-1.5 text-xs text-danger-600">{cancelError}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function UpgradePage() {
  const [plans,        setPlans]        = useState<PlanApi[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [selectedPlan, setSelectedPlan] = useState<PlanApi | null>(null);
  const [cancelledMsg, setCancelledMsg] = useState(false);

  const { subscription, loading: loadingSub, refresh } = useSubscription();

  useEffect(() => {
    getPlans()
      .then(setPlans)
      .catch(() => {})
      .finally(() => setLoadingPlans(false));
  }, []);

  // Pre-select cycle from current subscription billing cycle
  useEffect(() => {
    if (subscription?.billing_cycle) {
      setBillingCycle(subscription.billing_cycle);
    }
  }, [subscription?.billing_cycle]);

  const currentTier   = subscription?.plan.tier ?? null;
  const tierOrder     = ["trial", "starter", "growth", "enterprise"];
  const currentIndex  = tierOrder.indexOf(currentTier ?? "trial");
  const loading       = loadingPlans || loadingSub;

  function handleSubscribe(plan: PlanApi) {
    setSelectedPlan(plan);
  }

  const annualSavings = (() => {
    const paid = plans.filter((p) => p.price_monthly > 0 && p.price_yearly > 0);
    if (paid.length === 0) return null;
    const savings = Math.round(100 - (paid[0].price_yearly / (paid[0].price_monthly * 12)) * 100);
    return savings > 0 ? savings : null;
  })();

  return (
    <>
      {/* Phone modal */}
      {selectedPlan && (
        <PhoneModal
          plan={selectedPlan}
          billingCycle={billingCycle}
          onClose={() => setSelectedPlan(null)}
          onSuccess={() => setSelectedPlan(null)}
        />
      )}

      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-600 ring-1 ring-navy-200">
            <Building2 className="h-3.5 w-3.5" />
            Plans &amp; Pricing
          </div>
          <h1 className="text-2xl font-bold text-ink-900 sm:text-3xl">
            Choose the right plan for your firm
          </h1>
          <p className="text-sm text-ink-500">
            All plans include daily AI recommendations, eligibility tracking, and document management.
          </p>

          {/* Billing cycle toggle */}
          <div className="inline-flex items-center rounded-xl border border-ink-200 bg-ink-50 p-1">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={cn(
                "rounded-lg px-4 py-1.5 text-sm font-medium transition-colors",
                billingCycle === "monthly"
                  ? "bg-white text-ink-900 shadow-sm"
                  : "text-ink-500 hover:text-ink-700"
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors",
                billingCycle === "annual"
                  ? "bg-white text-ink-900 shadow-sm"
                  : "text-ink-500 hover:text-ink-700"
              )}
            >
              Annual
              {annualSavings && (
                <span className="rounded-full bg-success-100 px-1.5 py-0.5 text-[10px] font-bold text-success-700">
                  Save {annualSavings}%
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Cancellation notice */}
        {cancelledMsg && (
          <div className="flex items-center gap-3 rounded-xl border border-success-200 bg-success-50 px-4 py-3 text-sm text-success-700">
            <Check className="h-4 w-4 shrink-0" />
            Subscription cancelled. You retain access until the end of your current billing period.
          </div>
        )}

        {/* Current plan status */}
        <CurrentPlanCard onCancelled={() => { setCancelledMsg(true); refresh(); }} />

        {/* Trial / expired notice */}
        {subscription && !loadingSub && (
          <>
            {subscription.status === "trial" && subscription.days_remaining !== null && (
              <div className="rounded-xl border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-700">
                You&apos;re on the <span className="font-semibold">Free Trial</span> —{" "}
                {subscription.days_remaining} day{subscription.days_remaining !== 1 ? "s" : ""} remaining.
                Subscribe below to keep uninterrupted access.
              </div>
            )}
            {subscription.status === "expired" && (
              <div className="rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
                Your plan has expired. Subscribe below to restore access.
              </div>
            )}
          </>
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
            {plans.map((plan) => {
              const planIndex = tierOrder.indexOf(plan.tier);
              return (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  billingCycle={billingCycle}
                  isCurrentPlan={plan.tier === currentTier}
                  isDowngrade={planIndex < currentIndex}
                  onSubscribe={handleSubscribe}
                />
              );
            })}
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-ink-400">
          Prices shown are exclusive of GST. Powered by Cashfree Subscriptions with UPI AutoPay.
          Contact us for custom enterprise pricing.
        </p>
      </div>
    </>
  );
}
