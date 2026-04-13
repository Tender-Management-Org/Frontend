import { cn } from "@/lib/utils";

export type RequirementStatus = "ready" | "missing" | "needs_verification" | "template_available";

interface StatusBadgeProps {
  status: RequirementStatus;
}

const statusConfig: Record<RequirementStatus, { label: string; className: string }> = {
  ready: {
    label: "Ready",
    className: "bg-emerald-100 text-emerald-700"
  },
  missing: {
    label: "Missing",
    className: "bg-rose-100 text-rose-700"
  },
  needs_verification: {
    label: "Needs Verification",
    className: "bg-amber-100 text-amber-700"
  },
  template_available: {
    label: "Template Available",
    className: "bg-blue-100 text-blue-700"
  }
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", statusConfig[status].className)}>
      {statusConfig[status].label}
    </span>
  );
}
