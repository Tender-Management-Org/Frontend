"use client";

import { useFirm } from "@/context/FirmContext";
import {
  type EligibilityCheckApi,
  type EligibilityCriterion,
  type EligibilityCriterionStatus,
  getEligibilityCheck,
  overrideCriterionStatus,
  runEligibilityCheck,
} from "@/lib/api/tenders";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Loader2,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// ── Helpers ───────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  financial: "Financial",
  technical: "Technical",
  registration: "Registration & Certifications",
  experience: "Past Experience",
  legal: "Legal",
  location: "Location",
  other: "Other",
};

const CATEGORY_ORDER = [
  "financial", "registration", "experience", "technical", "legal", "location", "other",
];

function groupByCategory(criteria: EligibilityCriterion[]) {
  const groups: Record<string, EligibilityCriterion[]> = {};
  for (const c of criteria) {
    const cat = c.category ?? "other";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(c);
  }
  return groups;
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: EligibilityCriterionStatus | undefined }) {
  if (status === "met") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 shrink-0">
        <CheckCircle2 className="h-3 w-3" />
        Met
      </span>
    );
  }
  if (status === "not_met") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-xs font-semibold text-red-700 shrink-0">
        <XCircle className="h-3 w-3" />
        Not met
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-semibold text-amber-700 shrink-0">
      <AlertCircle className="h-3 w-3" />
      Unknown
    </span>
  );
}

// ── Override dropdown ─────────────────────────────────────────────────────────

function OverrideDropdown({
  current,
  onSelect,
}: {
  current: EligibilityCriterionStatus | undefined;
  onSelect: (s: EligibilityCriterionStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  const options: { value: EligibilityCriterionStatus; label: string }[] = [
    { value: "met", label: "✅  Mark as met" },
    { value: "unknown", label: "❓  Mark as unknown" },
    { value: "not_met", label: "❌  Mark as not met" },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 rounded-lg border border-ink-200 bg-white px-2 py-1 text-xs text-ink-500 hover:bg-ink-50 transition-colors"
        title="Override status"
      >
        Override
        <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-ink-200 bg-white py-1 shadow-lg">
            {options
              .filter((o) => o.value !== current)
              .map((o) => (
                <button
                  key={o.value}
                  type="button"
                  className="flex w-full items-center px-3 py-2 text-xs text-ink-700 hover:bg-ink-50 transition-colors"
                  onClick={() => { setOpen(false); onSelect(o.value); }}
                >
                  {o.label}
                </button>
              ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Criterion row ─────────────────────────────────────────────────────────────

function CriterionRow({
  criterion,
  onOverride,
  overriding,
}: {
  criterion: EligibilityCriterion;
  onOverride: (status: EligibilityCriterionStatus) => void;
  overriding: boolean;
}) {
  return (
    <div className={cn(
      "flex items-start gap-3 rounded-xl border p-3.5 transition-colors",
      criterion.status === "met" && "border-emerald-100 bg-emerald-50/40",
      criterion.status === "not_met" && "border-red-100 bg-red-50/40",
      (!criterion.status || criterion.status === "unknown") && "border-amber-100 bg-amber-50/30",
    )}>
      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-ink-800 leading-snug">{criterion.criteria}</p>
        {criterion.key_value && (
          <p className="mt-0.5 text-xs font-semibold text-ink-500">Threshold: {criterion.key_value}</p>
        )}
        {criterion.reason && (
          <p className="mt-1 text-xs text-ink-400 italic">{criterion.reason}</p>
        )}
        {criterion.owner_override && criterion.owner_note && (
          <p className="mt-1 text-xs text-navy-600">Note: {criterion.owner_note}</p>
        )}
      </div>

      {/* Status + override */}
      <div className="flex shrink-0 items-center gap-2">
        {overriding ? (
          <Loader2 className="h-4 w-4 animate-spin text-ink-400" />
        ) : (
          <>
            <StatusBadge status={criterion.status} />
            <OverrideDropdown current={criterion.status} onSelect={onOverride} />
          </>
        )}
      </div>
    </div>
  );
}

// ── Summary bar ───────────────────────────────────────────────────────────────

function SummaryBar({ summary }: { summary: EligibilityCheckApi["summary"] }) {
  if (!summary) return null;
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">
        <p className="text-2xl font-bold text-emerald-700">{summary.met}</p>
        <p className="text-xs font-semibold text-emerald-600 mt-0.5">Met</p>
      </div>
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center">
        <p className="text-2xl font-bold text-amber-700">{summary.unknown}</p>
        <p className="text-xs font-semibold text-amber-600 mt-0.5">Unknown</p>
      </div>
      <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center">
        <p className="text-2xl font-bold text-red-700">{summary.not_met}</p>
        <p className="text-xs font-semibold text-red-600 mt-0.5">Not met</p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function EligibilityTab({ tenderId }: { tenderId: string }) {
  const { activeFirmId } = useFirm();

  const [check, setCheck] = useState<EligibilityCheckApi | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [overridingIndex, setOverridingIndex] = useState<number | null>(null);

  // Try to load a cached result on mount
  useEffect(() => {
    if (!activeFirmId) return;
    getEligibilityCheck(tenderId, activeFirmId)
      .then(setCheck)
      .catch(() => {}); // 404 = never run, that's fine
  }, [tenderId, activeFirmId]);

  const handleRun = useCallback(async (refresh = false) => {
    if (!activeFirmId) return;
    setError(null);
    setLoading(true);
    setLoadingMsg("Reading NIT documents…");

    // Show rotating messages so the user knows it's working
    const msgs = [
      "Reading NIT documents…",
      "Extracting eligibility criteria…",
      "Matching against your firm profile…",
      "Almost done…",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % msgs.length;
      setLoadingMsg(msgs[i]);
    }, 3000);

    try {
      const result = await runEligibilityCheck(tenderId, activeFirmId, refresh);
      setCheck(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      setError(msg);
    } finally {
      clearInterval(interval);
      setLoading(false);
      setLoadingMsg("");
    }
  }, [tenderId, activeFirmId]);

  const handleOverride = useCallback(async (
    index: number,
    status: EligibilityCriterionStatus
  ) => {
    if (!activeFirmId) return;
    setOverridingIndex(index);
    try {
      const result = await overrideCriterionStatus(tenderId, activeFirmId, index, status);
      setCheck(result);
    } catch {
      // silent — badge reverts
    } finally {
      setOverridingIndex(null);
    }
  }, [tenderId, activeFirmId]);

  // ── No firm selected ──────────────────────────────────────────────────────
  if (!activeFirmId) {
    return (
      <div className="rounded-2xl border border-ink-200 bg-white p-8 text-center shadow-card">
        <ShieldCheck className="mx-auto h-10 w-10 text-ink-300 mb-3" />
        <p className="text-sm font-semibold text-ink-700">No firm selected</p>
        <p className="mt-1 text-xs text-ink-400">Select a firm from the top bar to check eligibility.</p>
      </div>
    );
  }

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="rounded-2xl border border-ink-200 bg-white p-10 text-center shadow-card">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-navy-600 mb-4" />
        <p className="text-sm font-semibold text-ink-700">{loadingMsg}</p>
        <p className="mt-1 text-xs text-ink-400">This usually takes 10–20 seconds.</p>
      </div>
    );
  }

  // ── Not yet run ───────────────────────────────────────────────────────────
  if (!check) {
    return (
      <div className="rounded-2xl border border-ink-200 bg-white p-10 text-center shadow-card">
        <ShieldCheck className="mx-auto h-10 w-10 text-ink-300 mb-4" />
        <p className="text-base font-semibold text-ink-800">Check your eligibility</p>
        <p className="mt-1 text-sm text-ink-400 max-w-xs mx-auto">
          AI will read the NIT documents and match every requirement against your firm profile.
        </p>
        {error && (
          <p className="mt-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={() => handleRun(false)}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-ink-800 transition-colors"
        >
          <ShieldCheck className="h-4 w-4" />
          Check Eligibility
        </button>
      </div>
    );
  }

  // ── Failed ────────────────────────────────────────────────────────────────
  if (check.status === "failed") {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-card">
        <XCircle className="mx-auto h-8 w-8 text-red-400 mb-3" />
        <p className="text-sm font-semibold text-ink-800">Check failed</p>
        <p className="mt-1 text-xs text-ink-500">{check.error_message || "An unexpected error occurred."}</p>
        <button
          type="button"
          onClick={() => handleRun(true)}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </button>
      </div>
    );
  }

  // ── Results ───────────────────────────────────────────────────────────────
  const criteria = check.matched_criteria ?? [];
  const groups = groupByCategory(criteria);

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wide text-ink-500">
          Eligibility criteria · {criteria.length} found
        </h3>
        <button
          type="button"
          onClick={() => handleRun(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-600 hover:bg-ink-50 transition-colors"
        >
          <RefreshCw className="h-3 w-3" />
          Re-check
        </button>
      </div>

      {/* Summary */}
      <SummaryBar summary={check.summary} />

      {/* Unknown/not-met callout */}
      {check.summary && (check.summary.unknown > 0 || check.summary.not_met > 0) && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          <span className="font-semibold">Action needed:</span> Review the{" "}
          {check.summary.unknown > 0 && `${check.summary.unknown} unknown`}
          {check.summary.unknown > 0 && check.summary.not_met > 0 && " and "}
          {check.summary.not_met > 0 && `${check.summary.not_met} unmet`}
          {" "}criteria below. You can override the status once you verify manually.
        </div>
      )}

      {/* Criteria grouped by category */}
      {CATEGORY_ORDER.filter((cat) => groups[cat]?.length).map((cat) => (
        <div key={cat} className="rounded-2xl border border-ink-200 bg-white p-4 shadow-card space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wide text-ink-400 mb-3">
            {CATEGORY_LABELS[cat] ?? cat}
          </h4>
          {groups[cat].map((c) => {
            const globalIdx = criteria.indexOf(c);
            return (
              <CriterionRow
                key={globalIdx}
                criterion={c}
                overriding={overridingIndex === globalIdx}
                onOverride={(status) => handleOverride(globalIdx, status)}
              />
            );
          })}
        </div>
      ))}

      {criteria.length === 0 && (
        <div className="rounded-2xl border border-ink-200 bg-white p-8 text-center shadow-card">
          <p className="text-sm text-ink-400">No eligibility criteria were found in the NIT documents.</p>
        </div>
      )}

      <p className="text-center text-xs text-ink-300">
        Last checked {check.extracted_at ? new Date(check.extracted_at).toLocaleString("en-IN") : "—"}
      </p>
    </div>
  );
}
