"use client";

import { useEffect } from "react";
import { markRecommendationsRead } from "@/lib/api/tenders";

/**
 * Invisible component: fires mark-all-read once when the recommendations page mounts.
 * This keeps the server component intact while still clearing the unread badge.
 */
export function AutoMarkRead({ firmId }: { firmId: string }) {
  useEffect(() => {
    markRecommendationsRead(firmId).catch(() => {
      // Best-effort — badge will eventually sync on next poll
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firmId]);

  return null;
}
