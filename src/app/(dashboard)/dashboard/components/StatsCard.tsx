import Link from "next/link";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  subtitle?: string;
  tooltip?: string;
  accent?: "default" | "warning" | "danger" | "success";
  href?: string;
}

const accentConfig: Record<
  NonNullable<StatsCardProps["accent"]>,
  { value: string; icon: string; subtitle: string; border: string }
> = {
  default: {
    value: "text-ink-900",
    icon: "bg-ink-100 text-ink-600",
    subtitle: "text-ink-400",
    border: "border-l-ink-300",
  },
  warning: {
    value: "text-warning-700",
    icon: "bg-warning-50 text-warning-600",
    subtitle: "text-warning-600",
    border: "border-l-warning-400",
  },
  danger: {
    value: "text-danger-600",
    icon: "bg-danger-50 text-danger-600",
    subtitle: "text-danger-600",
    border: "border-l-danger-500",
  },
  success: {
    value: "text-success-700",
    icon: "bg-success-50 text-success-700",
    subtitle: "text-success-700",
    border: "border-l-success-500",
  },
};

export function StatsCard({
  title,
  value,
  icon: Icon,
  subtitle,
  tooltip,
  accent = "default",
  href,
}: StatsCardProps) {
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
          {/* Title + optional info tooltip */}
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-400">{title}</p>
            {tooltip && (
              <div className="group relative flex items-center">
                <Info className="h-3 w-3 text-ink-300 cursor-default" aria-hidden />
                <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-52 -translate-x-1/2 rounded-lg border border-ink-200 bg-white px-3 py-2 text-xs leading-snug text-ink-600 shadow-lg opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  {tooltip}
                  <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-ink-200" />
                </div>
              </div>
            )}
          </div>
          <p className={cn("mt-2 text-3xl font-bold tabular-nums tracking-tight", cfg.value)}>{value}</p>
        </div>
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", cfg.icon)} aria-hidden>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {subtitle && <p className={cn("mt-3 text-xs leading-snug", cfg.subtitle)}>{subtitle}</p>}
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
