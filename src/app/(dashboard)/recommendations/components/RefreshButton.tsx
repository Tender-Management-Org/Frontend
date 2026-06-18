"use client";

import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { refreshRecommendations } from "@/lib/api/tenders";
import { ApiError } from "@/lib/api/client";

interface RefreshButtonProps {
  firmId: string;
}

export function RefreshButton({ firmId }: RefreshButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("Couldn't queue task. Try again.");

  async function handleRefresh() {
    setState("loading");
    try {
      await refreshRecommendations(firmId);
      setState("done");
      setTimeout(() => setState("idle"), 5000);
    } catch (err) {
      const detail =
        err instanceof ApiError
          ? (err.data as { detail?: string })?.detail ?? err.message
          : "Couldn't queue task. Try again.";
      setErrorMsg(String(detail));
      setState("error");
      setTimeout(() => setState("idle"), 6000);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleRefresh}
        disabled={state === "loading" || state === "done"}
        className="inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2"
      >
        <RefreshCw
          className={`h-4 w-4 ${state === "loading" ? "animate-spin" : ""}`}
          aria-hidden
        />
        {state === "loading" ? "Queuing…" : state === "done" ? "Queued!" : "Regenerate recommendations"}
      </button>
      {state === "idle" && (
        <p className="text-xs text-ink-400">Run this after updating your firm profile.</p>
      )}
      {state === "done" && (
        <p className="text-xs text-ink-400">Running in background — reload in a moment.</p>
      )}
      {state === "error" && (
        <p className="text-xs text-danger-600">{errorMsg}</p>
      )}
    </div>
  );
}
