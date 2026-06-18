"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Crown,
  Loader2,
  Save,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TagInput } from "@/components/ui/TagInput";
import { emitToast } from "@/lib/toast";

import {
  getNotificationPreferences,
  updateNotificationPreferences,
  type NotificationPreferences,
} from "@/lib/api/notifications";
import {
  getFirms,
  getFirmPreferences,
  upsertFirmPreferences,
} from "@/lib/api/firms";
import { useSubscription } from "@/hooks/useSubscription";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "notifications" | "recommendations" | "account";

// ─── Toggle row ───────────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink-900">{label}</p>
        {description && <p className="mt-0.5 text-xs text-ink-400">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2",
          checked ? "bg-navy-600" : "bg-ink-200"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-5">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-400">{title}</h3>
      <div className="divide-y divide-ink-50">{children}</div>
    </div>
  );
}

// ─── Notifications tab ────────────────────────────────────────────────────────

function NotificationsTab() {
  const [prefs, setPrefs]     = useState<NotificationPreferences | null>(null);
  const [saving, setSaving]   = useState(false);
  const [loading, setLoading] = useState(true);
  const dirty = useRef(false);

  useEffect(() => {
    getNotificationPreferences()
      .then(setPrefs)
      .catch(() => emitToast({ type: "error", title: "Could not load notification preferences." }))
      .finally(() => setLoading(false));
  }, []);

  function update(patch: Partial<NotificationPreferences>) {
    setPrefs((p) => p ? { ...p, ...patch } : p);
    dirty.current = true;
  }

  async function handleSave() {
    if (!prefs || !dirty.current) return;
    setSaving(true);
    try {
      const saved = await updateNotificationPreferences(prefs);
      setPrefs(saved);
      dirty.current = false;
      emitToast({ type: "success", title: "Notification preferences saved." });
    } catch {
      emitToast({ type: "error", title: "Failed to save preferences." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-ink-300" />
      </div>
    );
  }
  if (!prefs) return null;

  return (
    <div className="space-y-4">
      <Section title="Channels">
        <Toggle
          checked={prefs.email_enabled}
          onChange={(v) => update({ email_enabled: v })}
          label="Email notifications"
          description="Receive notifications to your registered email address."
        />
        <Toggle
          checked={prefs.whatsapp_enabled}
          onChange={(v) => update({ whatsapp_enabled: v })}
          label="WhatsApp notifications"
          description="Coming soon — we'll notify you when this is available."
        />
      </Section>

      <Section title="Events">
        <Toggle
          checked={prefs.notify_new_recommendation}
          onChange={(v) => update({ notify_new_recommendation: v })}
          label="New recommendations"
          description="When new tender matches are ready for your firm."
        />
        <Toggle
          checked={prefs.notify_deadline_approaching}
          onChange={(v) => update({ notify_deadline_approaching: v })}
          label="Deadline approaching"
          description="Alert 48 hours before bid submission closes on interested tenders."
        />
        <Toggle
          checked={prefs.notify_tender_updated}
          onChange={(v) => update({ notify_tender_updated: v })}
          label="Tender updated"
          description="When a corrigendum or change is published on a tracked tender."
        />
      </Section>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="sm">
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          Save changes
        </Button>
      </div>
    </div>
  );
}

// ─── Recommendations tab ──────────────────────────────────────────────────────

function RecommendationsTab() {
  const [firmId, setFirmId]   = useState<string | null>(null);
  const [saving, setSaving]   = useState(false);
  const [loading, setLoading] = useState(true);

  // Local form state
  const [strategy,    setStrategy]    = useState<"balanced" | "interest_led">("balanced");
  const [minValue,    setMinValue]    = useState("");
  const [maxValue,    setMaxValue]    = useState("");
  const [regions,     setRegions]     = useState("");
  const [sectors,     setSectors]     = useState("");
  const [excluded,    setExcluded]    = useState("");

  useEffect(() => {
    async function load() {
      try {
        const firmsRes = await getFirms(1);
        const active   = firmsRes.results.find((f) => f.is_active);
        if (!active) return;
        setFirmId(active.id);
        const p = await getFirmPreferences(active.id);
        setStrategy(p.recommendation_strategy as "balanced" | "interest_led");
        setMinValue(p.min_tender_value != null ? String(p.min_tender_value) : "");
        setMaxValue(p.max_tender_value != null ? String(p.max_tender_value) : "");
        setRegions(p.preferred_regions.join(", "));
        setSectors(p.target_sectors.join(", "));
        setExcluded(p.excluded_depts.join(", "));
      } catch {
        emitToast({ type: "error", title: "Could not load recommendation preferences." });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave() {
    if (!firmId) return;
    setSaving(true);
    try {
      const toList = (s: string) =>
        s.split(",").map((x) => x.trim()).filter(Boolean);

      await upsertFirmPreferences(firmId, {
        recommendation_strategy: strategy,
        min_tender_value: minValue ? Number(minValue) : null,
        max_tender_value: maxValue ? Number(maxValue) : null,
        preferred_regions: toList(regions),
        target_sectors:    toList(sectors),
        excluded_depts:    toList(excluded),
      });
      emitToast({ type: "success", title: "Recommendation preferences saved." });
    } catch {
      emitToast({ type: "error", title: "Failed to save preferences." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-ink-300" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Strategy */}
      <Section title="Matching strategy">
        <div className="py-2">
          <p className="mb-3 text-xs text-ink-400">
            Controls how your firm profile and interested tenders are blended to find new matches.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(
              [
                {
                  value: "balanced",
                  label: "Balanced",
                  sub: "60% firm profile · 40% interest signals",
                },
                {
                  value: "interest_led",
                  label: "Interest-led",
                  sub: "20% firm profile · 80% interest signals",
                },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStrategy(opt.value)}
                className={cn(
                  "rounded-xl border-2 px-4 py-3 text-left transition-all",
                  strategy === opt.value
                    ? "border-navy-600 bg-navy-50"
                    : "border-ink-100 hover:border-ink-300"
                )}
              >
                <p className={cn("text-sm font-semibold", strategy === opt.value ? "text-navy-700" : "text-ink-800")}>
                  {opt.label}
                </p>
                <p className="mt-0.5 text-xs text-ink-400">{opt.sub}</p>
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Value range */}
      <Section title="Tender value range">
        <div className="grid grid-cols-2 gap-3 py-2">
          <div>
            <label className="mb-1.5 block text-xs text-ink-500">Min value (₹)</label>
            <Input
              type="number"
              placeholder="e.g. 500000"
              value={minValue}
              onChange={(e) => setMinValue(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-ink-500">Max value (₹)</label>
            <Input
              type="number"
              placeholder="e.g. 10000000"
              value={maxValue}
              onChange={(e) => setMaxValue(e.target.value)}
            />
          </div>
        </div>
        <p className="pb-2 text-xs text-ink-400">Leave blank to include tenders of any value.</p>
      </Section>

      {/* Filters */}
      <Section title="Filters">
        <div className="space-y-4 py-2">
          <div>
            <label className="mb-1.5 block text-xs text-ink-500">Preferred regions</label>
            <TagInput value={regions} onChange={setRegions} placeholder="e.g. Rajasthan, Gujarat…" />
            <p className="mt-1 text-xs text-ink-400">Only show tenders from these states or districts.</p>
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-ink-500">Target sectors</label>
            <TagInput value={sectors} onChange={setSectors} placeholder="e.g. Road construction, IT services…" />
            <p className="mt-1 text-xs text-ink-400">Steer recommendations toward these sectors.</p>
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-ink-500">Excluded departments</label>
            <TagInput value={excluded} onChange={setExcluded} placeholder="e.g. Ministry of Defence…" />
            <p className="mt-1 text-xs text-ink-400">Never recommend tenders from these organisations.</p>
          </div>
        </div>
      </Section>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving || !firmId} size="sm">
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          Save changes
        </Button>
      </div>
    </div>
  );
}

// ─── Account tab ──────────────────────────────────────────────────────────────

const PLAN_ICONS: Record<string, React.ElementType> = {
  trial:      Sparkles,
  starter:    Zap,
  growth:     Sparkles,
  enterprise: Crown,
};

const PLAN_COLORS: Record<string, string> = {
  trial:      "bg-ink-50  text-ink-600  border-ink-200",
  starter:    "bg-blue-50 text-blue-700  border-blue-200",
  growth:     "bg-navy-50 text-navy-700  border-navy-200",
  enterprise: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

const STATUS_COLORS: Record<string, string> = {
  trial:     "bg-blue-100 text-blue-700",
  active:    "bg-green-100 text-green-700",
  expired:   "bg-red-100   text-red-700",
  cancelled: "bg-ink-100   text-ink-600",
};

function AccountTab() {
  const { subscription, loading } = useSubscription();

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-ink-300" />
      </div>
    );
  }
  if (!subscription) return null;

  const { plan, status, trial_ends_at, current_period_end, days_remaining } = subscription;
  const PlanIcon = PLAN_ICONS[plan.tier] ?? Sparkles;

  return (
    <div className="space-y-4">
      {/* Current plan card */}
      <div className={cn("rounded-xl border-2 p-5", PLAN_COLORS[plan.tier] ?? PLAN_COLORS.trial)}>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 rounded-lg bg-white/60 p-2">
            <PlanIcon className="h-5 w-5" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold capitalize">{plan.tier} plan</p>
              <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase", STATUS_COLORS[status] ?? STATUS_COLORS.active)}>
                {status}
              </span>
            </div>
            {status === "trial" && trial_ends_at && (
              <p className="mt-1 text-sm">
                Trial ends {new Date(trial_ends_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                {days_remaining != null && (
                  <span className="ml-1 font-medium">({days_remaining} day{days_remaining !== 1 ? "s" : ""} left)</span>
                )}
              </p>
            )}
            {status === "active" && current_period_end && (
              <p className="mt-1 text-sm">
                Renews on {new Date(current_period_end).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            )}
            {(status === "expired" || status === "cancelled") && (
              <p className="mt-1 text-sm">Your plan has {status}. Upgrade to continue using TenderPilot.</p>
            )}
          </div>
        </div>
      </div>

      {/* Limits */}
      <Section title="Plan limits">
        <div className="grid grid-cols-2 gap-x-4 py-2">
          {[
            { label: "Recommendations / day", value: plan.recommendation_count === -1 ? "Unlimited" : plan.recommendation_count },
            { label: "Max firms",             value: plan.max_firms            === -1 ? "Unlimited" : plan.max_firms },
          ].map(({ label, value }) => (
            <div key={label} className="py-2">
              <p className="text-xs text-ink-400">{label}</p>
              <p className="mt-0.5 text-sm font-semibold text-ink-900">{value}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Features */}
      <Section title="Included features">
        <div className="grid grid-cols-2 gap-x-4 py-2">
          {[
            { key: "can_use_advanced_filters",  label: "Advanced filters"       },
            { key: "can_use_eligibility_check", label: "Eligibility check"      },
            { key: "can_use_interest_signals",  label: "Interest signals"       },
            { key: "can_extract_documents",     label: "AI doc extraction"      },
            { key: "can_export_data",           label: "Export data"            },
            { key: "can_access_api",            label: "API access"             },
            { key: "has_priority_support",      label: "Priority support"       },
          ].map(({ key, label }) => {
            const enabled = plan.features[key as keyof typeof plan.features] ?? false;
            return (
              <div key={key} className={cn("flex items-center gap-2 py-1.5 text-sm", enabled ? "text-ink-800" : "text-ink-300 line-through")}>
                <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", enabled ? "bg-green-500" : "bg-ink-200")} />
                {label}
              </div>
            );
          })}
        </div>
      </Section>

      {status !== "active" && (
        <div className="flex justify-end">
          <Button size="sm" onClick={() => window.location.href = "/upgrade"}>
            <Zap className="h-3.5 w-3.5" />
            {status === "trial" ? "Upgrade now" : "Reactivate plan"}
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "notifications",   label: "Notifications",   icon: Bell     },
  { id: "recommendations", label: "Recommendations", icon: Sparkles },
  { id: "account",         label: "Account & Plan",  icon: Settings },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("notifications");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-ink-900">Settings</h2>
        <p className="mt-1 text-sm text-ink-500">Manage your notifications, recommendation preferences, and account.</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl border border-ink-100 bg-ink-50 p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all",
              activeTab === id
                ? "bg-white text-ink-900 shadow-sm"
                : "text-ink-500 hover:text-ink-800"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "notifications"   && <NotificationsTab />}
      {activeTab === "recommendations" && <RecommendationsTab />}
      {activeTab === "account"         && <AccountTab />}
    </div>
  );
}
