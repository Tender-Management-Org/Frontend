"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { getMySubscription } from "@/lib/api/subscription";

const MAX_POLLS   = 24;   // 24 × 5 s = 2 min
const POLL_MS     = 5000;

type State = "polling" | "success" | "timeout" | "error";

function UpgradeSuccessContent() {
  const router        = useRouter();
  const searchParams  = useSearchParams();
  const cfSubId       = searchParams.get("sub")   ?? "";
  const billingCycle  = searchParams.get("cycle") ?? "monthly";

  const [state,       setState]     = useState<State>("polling");
  const [planName,    setPlanName]  = useState("");
  const [renewDate,   setRenewDate] = useState("");
  const [errMsg,      setErrMsg]    = useState("");
  const pollCount = useRef(0);

  useEffect(() => {
    if (!cfSubId) {
      setState("error");
      setErrMsg("Missing subscription ID in URL. Go back and try again.");
      return;
    }

    let cancelled = false;

    async function poll() {
      if (cancelled) return;
      if (pollCount.current >= MAX_POLLS) {
        setState("timeout");
        return;
      }
      pollCount.current += 1;

      try {
        const sub = await getMySubscription();

        // Check if this sub matches the one we just created and is now active
        if (sub.cf_subscription_id === cfSubId && sub.status === "active") {
          setPlanName(sub.plan.name);
          if (sub.current_period_end) {
            setRenewDate(
              new Date(sub.current_period_end).toLocaleDateString("en-IN", {
                day: "numeric", month: "long", year: "numeric",
              })
            );
          }
          setState("success");
          return;
        }

        // Still pending — schedule next poll
        setTimeout(poll, POLL_MS);
      } catch {
        if (!cancelled) {
          setTimeout(poll, POLL_MS); // retry on network error
        }
      }
    }

    poll();
    return () => { cancelled = true; };
  }, [cfSubId]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-ink-200 bg-white p-8 shadow-card text-center">

        {/* Polling */}
        {state === "polling" && (
          <>
            <div className="mb-4 flex justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-50">
                <Loader2 className="h-7 w-7 animate-spin text-navy-600" />
              </span>
            </div>
            <h1 className="text-xl font-bold text-ink-900">Activating your subscription…</h1>
            <p className="mt-2 text-sm text-ink-500">
              We&apos;re waiting for your UPI mandate to be confirmed. This usually takes a few seconds.
            </p>
            <p className="mt-4 text-xs text-ink-400">
              {billingCycle === "annual" ? "Annual" : "Monthly"} plan ·{" "}
              Sub ID: <span className="font-mono">{cfSubId}</span>
            </p>
          </>
        )}

        {/* Success */}
        {state === "success" && (
          <>
            <div className="mb-4 flex justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success-50">
                <CheckCircle2 className="h-7 w-7 text-success-600" />
              </span>
            </div>
            <h1 className="text-xl font-bold text-ink-900">You&apos;re all set!</h1>
            <p className="mt-2 text-sm text-ink-500">
              Your <span className="font-semibold text-ink-800">{planName}</span> plan is now active.
              {renewDate && (
                <> Your next renewal date is <span className="font-semibold text-ink-800">{renewDate}</span>.</>
              )}
            </p>
            <button
              type="button"
              onClick={() => router.push("/recommendations")}
              className="mt-6 w-full rounded-xl bg-navy-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700"
            >
              Go to dashboard
            </button>
          </>
        )}

        {/* Timeout */}
        {state === "timeout" && (
          <>
            <div className="mb-4 flex justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-warning-50">
                <AlertCircle className="h-7 w-7 text-warning-600" />
              </span>
            </div>
            <h1 className="text-xl font-bold text-ink-900">Taking longer than expected</h1>
            <p className="mt-2 text-sm text-ink-500">
              Your UPI mandate may still be processing. Check back in a few minutes — your plan will
              activate automatically once the mandate is confirmed.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => { pollCount.current = 0; setState("polling"); }}
                className="flex-1 rounded-xl border border-ink-200 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-50"
              >
                Check again
              </button>
              <button
                type="button"
                onClick={() => router.push("/upgrade")}
                className="flex-1 rounded-xl bg-navy-600 py-2.5 text-sm font-semibold text-white hover:bg-navy-700"
              >
                Back to plans
              </button>
            </div>
          </>
        )}

        {/* Error */}
        {state === "error" && (
          <>
            <div className="mb-4 flex justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-50">
                <AlertCircle className="h-7 w-7 text-danger-600" />
              </span>
            </div>
            <h1 className="text-xl font-bold text-ink-900">Something went wrong</h1>
            {errMsg && <p className="mt-2 text-sm text-ink-500">{errMsg}</p>}
            <button
              type="button"
              onClick={() => router.push("/upgrade")}
              className="mt-6 w-full rounded-xl bg-navy-600 py-2.5 text-sm font-semibold text-white hover:bg-navy-700"
            >
              Back to plans
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function UpgradeSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-navy-600" />
        </div>
      }
    >
      <UpgradeSuccessContent />
    </Suspense>
  );
}
