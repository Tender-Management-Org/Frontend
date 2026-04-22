"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api/client";
import { getInterestedTenders, markTender, type TenderMatchStatus } from "@/lib/api/tenders";
import { Card } from "@/components/ui/Card";

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
        const isInterested = rows.some((row) => row.tender_id === tenderId);
        if (isInterested) setCurrentStatus("interested");
      })
      .catch(() => {
        if (cancelled) return;
      });
    return () => {
      cancelled = true;
    };
  }, [tenderId]);

  async function handleMark(status: TenderMatchStatus) {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const match = await markTender(tenderId, status);
      setCurrentStatus(match.status);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setErrorMessage("Session expired. Please login again.");
      } else {
        setErrorMessage("Unable to update tender status. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="space-y-3">
      <h3 className="text-base font-semibold text-slate-900">Actions</h3>
      <div className="grid gap-2">
        <Button
          variant="secondary"
          onClick={() => void handleMark("interested")}
          disabled={isSubmitting || currentStatus === "interested"}
        >
          {currentStatus === "interested" ? "Marked Interested" : "Interested"}
        </Button>
        <Button
          variant="ghost"
          className="border border-border"
          onClick={() => void handleMark("ignored")}
          disabled={isSubmitting || currentStatus === "ignored"}
        >
          Ignore
        </Button>
      </div>
      {errorMessage ? <p className="text-xs text-rose-600">{errorMessage}</p> : null}
    </Card>
  );
}
