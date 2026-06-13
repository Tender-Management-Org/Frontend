"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookmarkMinus, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api/client";
import { markTender, type TenderMatchStatus } from "@/lib/api/tenders";

const ACTION_ICONS = {
  "bookmark-minus": BookmarkMinus,
  "eye-off": EyeOff,
} as const;

type TenderMatchActionIcon = keyof typeof ACTION_ICONS;

interface TenderMatchActionButtonProps {
  tenderId: string;
  status: TenderMatchStatus;
  label: string;
  loadingLabel: string;
  icon: TenderMatchActionIcon;
  errorMessage?: string;
}

export function TenderMatchActionButton({
  tenderId,
  status,
  label,
  loadingLabel,
  icon,
  errorMessage = "Could not update tender. Please try again.",
}: TenderMatchActionButtonProps) {
  const Icon = ACTION_ICONS[icon];
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAction() {
    setIsSubmitting(true);
    setError(null);
    try {
      await markTender(tenderId, status);
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("Session expired — please sign in again.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="text-ink-600"
        onClick={() => void handleAction()}
        disabled={isSubmitting}
      >
        <Icon className="h-4 w-4" aria-hidden />
        {isSubmitting ? loadingLabel : label}
      </Button>
      {error && <p className="text-xs text-danger-600">{error}</p>}
    </div>
  );
}
