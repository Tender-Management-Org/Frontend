"use client";

import { Brain, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DocIntelConfirmDialogProps {
  documentName: string;
  creditsRemaining: number;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DocIntelConfirmDialog({
  documentName,
  creditsRemaining,
  loading,
  onConfirm,
  onCancel,
}: DocIntelConfirmDialogProps) {
  const hasCredits = creditsRemaining > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 backdrop-blur-sm p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) onCancel();
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-ink-200 bg-white shadow-dropdown">
        <div className="flex items-start justify-between border-b border-ink-100 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50">
              <Brain className="h-4 w-4 text-navy-600" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-bold text-ink-900">Run document intelligence</p>
              <p className="mt-0.5 text-xs text-ink-500">Analyze this PDF with AI</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg p-1 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <p className="text-sm text-ink-600">
            Extract eligibility criteria and required documents from{" "}
            <span className="font-semibold text-ink-900">{documentName}</span>.
          </p>

          <div className="rounded-xl border border-ink-200 bg-ink-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Credit usage</p>
            <p className="mt-1 text-sm text-ink-800">
              1 credit will be deducted from your firm.
            </p>
            <p className="mt-1 text-xs text-ink-500">
              Remaining credits: <span className="font-semibold text-ink-800">{creditsRemaining}</span>
            </p>
          </div>

          {!hasCredits && (
            <p className="text-sm text-danger-700">
              You have no doc intel credits left. Contact support or upgrade your plan.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-ink-100 px-5 py-4">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm} disabled={loading || !hasCredits}>
            {loading ? "Analyzing…" : "Confirm & analyze"}
          </Button>
        </div>
      </div>
    </div>
  );
}
