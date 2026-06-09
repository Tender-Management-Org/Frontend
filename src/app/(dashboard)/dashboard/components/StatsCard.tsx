import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: string;
  accent?: "default" | "warning" | "danger" | "success";
  href?: string;
}

const accentConfig: Record<
  NonNullable<StatsCardProps["accent"]>,
  { value: string; icon: string; trend: string; border: string }
> = {
  default: {
    value: "text-ink-900",
    icon: "bg-ink-100 text-ink-600",
    trend: "text-ink-400",
    border: "border-l-ink-300",
  },
  warning: {
    value: "text-warning-700",
    icon: "bg-warning-50 text-warning-600",
    trend: "text-warning-600",
    border: "border-l-warning-400",
  },
  danger: {
    value: "text-danger-600",
    icon: "bg-danger-50 text-danger-600",
    trend: "text-danger-600",
    border: "border-l-danger-500",
  },
  success: {
    value: "text-success-700",
    icon: "bg-success-50 text-success-700",
    trend: "text-success-700",
    border: "border-l-success-500",
  },
};

export function StatsCard({ title, value, icon: Icon, trend, accent = "default", href }: StatsCardProps) {
  const cfg = accentConfig[accent];

  const inner = (
    <div
      className={cn(
        "rounded-2xl border border-ink-200 border-l-4 bg-white p-5 shadow-card transition-all",
        cfg.border,
        href && "hover:shadow-card-hover hover:-translate-y-0.5"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-400">{title}</p>
          <p className={cn("mt-2 text-3xl font-bold tabular-nums tracking-tight", cfg.value)}>{value}</p>
        </div>
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", cfg.icon)} aria-hidden>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend && <p className={cn("mt-3 text-xs leading-snug", cfg.trend)}>{trend}</p>}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2 rounded-2xl">
        {inner}
      </Link>
    );
  }
  return inner;
}
