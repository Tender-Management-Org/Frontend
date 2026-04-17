import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: string;
  accent?: "default" | "warning" | "danger" | "success";
  /** Makes the whole card a link (e.g. to filtered list or anchor) */
  href?: string;
}

const accentStyles: Record<NonNullable<StatsCardProps["accent"]>, string> = {
  default: "text-slate-900",
  warning: "text-amber-600",
  danger: "text-rose-600",
  success: "text-emerald-600"
};

const borderAccent: Record<NonNullable<StatsCardProps["accent"]>, string> = {
  default: "border-l-slate-400",
  warning: "border-l-amber-400",
  danger: "border-l-rose-500",
  success: "border-l-emerald-500"
};

const iconWrap: Record<NonNullable<StatsCardProps["accent"]>, string> = {
  default: "bg-slate-100 text-slate-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-rose-50 text-rose-700",
  success: "bg-emerald-50 text-emerald-700"
};

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  accent = "default",
  href
}: StatsCardProps) {
  const card = (
    <Card
      className={cn(
        "space-y-3 border-l-4 transition-all",
        borderAccent[accent],
        href && "h-full hover:-translate-y-0.5 hover:shadow-md"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className={cn("mt-2 text-3xl font-semibold tabular-nums tracking-tight", accentStyles[accent])}>
            {value}
          </p>
        </div>
        <div
          className={cn("rounded-xl p-2.5", iconWrap[accent])}
          aria-hidden
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      {trend && (
        <p className="text-xs leading-snug text-slate-500">{trend}</p>
      )}
      {href && (
        <p className="text-xs font-medium text-slate-500 group-hover:text-slate-700">
          View details
          <span className="sr-only"> — {title}</span>
        </p>
      )}
    </Card>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
      >
        {card}
      </Link>
    );
  }

  return card;
}
