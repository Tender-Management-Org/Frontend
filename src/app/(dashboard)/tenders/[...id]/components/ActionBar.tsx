"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api/client";
import { getInterestedTenders, markTender, type TenderMatchStatus } from "@/lib/api/tenders";
import { AlertCircle, Bookmark, BookmarkCheck, EyeOff } from "lucide-react";

interface ActionBarProps {
  tenderId: string;
}

export function ActionBar({ tenderId }: ActionBarProps) {
  const [currentStatus, setCurrentStatus] = useState<TenderMatchStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getInterestedTenders()
      .then((rows) => {
        if (cancelled) return;
        if (rows.some((row) => row.tender_id === tenderId)) setCurrentStatus("interested");
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [tenderId]);

  async function handleMark(status: TenderMatchStatus) {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const match = await markTender(tenderId, status);
      setCurrentStatus(match.status);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setErrorMessage("Session expired — please sign in again.");
      } else {
        setErrorMessage("Could not update status. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const isInterested = currentStatus === "interested";
  const isIgnored = currentStatus === "ignored";

  return (
    <div className="rounded-2xl border border-ink-200 dark:border-ink-800 bg-surface p-5 shadow-card">
      <h3 className="mb-1 text-sm font-semibold text-ink-900 dark:text-ink-50">Your decision</h3>
      <p className="mb-4 text-xs text-ink-400 dark:text-ink-600">
        Mark this tender to track it in your pipeline.
      </p>

      <div className="space-y-2">
        <Button
          variant="primary"
          className="w-full justify-center"
          onClick={() => void handleMark("interested")}
          disabled={isSubmitting || isInterested}
        >
          {isInterested ? (
            <>
              <BookmarkCheck className="h-4 w-4" aria-hidden />
              Marked as interested
            </>
          ) : (
            <>
              <Bookmark className="h-4 w-4" aria-hidden />
              Mark as interested
            </>
          )}
        </Button>
        <Button
          variant="secondary"
          className="w-full justify-center text-ink-600 dark:text-ink-300"
          onClick={() => void handleMark("ignored")}
          disabled={isSubmitting || isIgnored}
        >
          <EyeOff className="h-4 w-4" aria-hidden />
          {isIgnored ? "Ignored" : "Ignore this tender"}
        </Button>
      </div>

      {errorMessage && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-danger-200 dark:border-danger-500/30 bg-danger-50 dark:bg-danger-500/10 px-3 py-2">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger-600 dark:text-danger-400" aria-hidden />
          <p className="text-xs text-danger-700 dark:text-danger-400">{errorMessage}</p>
        </div>
      )}

      {isInterested && (
        <div className="mt-3 rounded-lg border border-violet-200 dark:border-accent-purple-bg bg-violet-50 dark:bg-accent-purple-bg px-3 py-2">
          <p className="text-xs font-medium text-violet-700 dark:text-accent-purple">
            Added to your pipeline. View in{" "}
            <a href="/interested" className="underline underline-offset-2 hover:text-violet-900 dark:hover:text-accent-purple">
              Interested tenders
            </a>
            .
          </p>
        </div>
      )}

    </div>
  );
}
