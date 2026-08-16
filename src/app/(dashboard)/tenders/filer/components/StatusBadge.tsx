import { cn } from "@/lib/utils";

export type RequirementStatus = "ready" | "missing" | "needs_verification" | "template_available";

interface StatusBadgeProps {
  status: RequirementStatus;
}

const statusConfig: Record<RequirementStatus, { label: string; className: string }> = {
  ready: {
    label: "Ready",
    className: "bg-emerald-100 dark:bg-accent-green-bg text-emerald-700 dark:text-accent-green"
  },
  missing: {
    label: "Missing",
    className: "bg-rose-100 dark:bg-accent-red-bg text-rose-700 dark:text-accent-red"
  },
  needs_verification: {
    label: "Needs Verification",
    className: "bg-amber-100 dark:bg-accent-orange-bg text-amber-700 dark:text-accent-orange"
  },
  template_available: {
    label: "Template Available",
    className: "bg-blue-100 dark:bg-accent-blue-bg text-blue-700 dark:text-accent-blue"
  }
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", statusConfig[status].className)}>
      {statusConfig[status].label}
    </span>
  );
}
