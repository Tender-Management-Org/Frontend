import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: string;
  accent?: "default" | "warning" | "danger" | "success";
}

const accentStyles: Record<NonNullable<StatsCardProps["accent"]>, string> = {
  default: "text-slate-900",
  warning: "text-amber-600",
  danger: "text-rose-600",
  success: "text-emerald-600"
};

export function StatsCard({ title, value, icon: Icon, trend, accent = "default" }: StatsCardProps) {
  return (
    <Card className="space-y-3 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        <div className="rounded-lg bg-slate-100 p-2 text-slate-700">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className={cn("text-3xl font-semibold", accentStyles[accent])}>{value}</p>
      {trend && <p className="text-xs text-slate-500">{trend}</p>}
    </Card>
  );
}
