"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookmarkMinus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api/client";
import { markTender } from "@/lib/api/tenders";

interface RemoveFromInterestedButtonProps {
  tenderId: string;
}

export function RemoveFromInterestedButton({ tenderId }: RemoveFromInterestedButtonProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleRemove() {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await markTender(tenderId, "matched");
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setErrorMessage("Session expired — please sign in again.");
      } else {
        setErrorMessage("Could not remove tender. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="text-ink-600"
        onClick={() => void handleRemove()}
        disabled={isSubmitting}
      >
        <BookmarkMinus className="h-4 w-4" aria-hidden />
        {isSubmitting ? "Removing…" : "Remove from list"}
      </Button>
      {errorMessage && <p className="text-xs text-danger-600">{errorMessage}</p>}
    </div>
  );
}
