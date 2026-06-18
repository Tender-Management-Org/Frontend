import Link from "next/link";
import { AlertTriangle, CalendarDays, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export interface ActionItem {
  title: string;
  deadline: string;
  href?: string;
}

interface ActionRequiredProps {
  items: ActionItem[];
}

function deadlineMeta(isoDate: string) {
  const d = new Date(isoDate + "T12:00:00");
  if (Number.isNaN(d.getTime())) {
    return { formatted: isoDate, daysLeft: null as number | null, urgent: false, past: false };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(d);
  target.setHours(0, 0, 0, 0);
  const daysLeft = Math.round((target.getTime() - today.getTime()) / 86400000);
  const formatted = d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
  return { formatted, daysLeft, urgent: daysLeft >= 0 && daysLeft <= 3, past: daysLeft < 0 };
}

function urgencyLabel(daysLeft: number | null, past: boolean): string | null {
  if (daysLeft === null) return null;
  if (past) return "Overdue";
  if (daysLeft === 0) return "Due today";
  if (daysLeft === 1) return "1 day left";
  return `${daysLeft} days left`;
}

export function ActionRequired({ items }: ActionRequiredProps) {
  const sorted = [...items].sort((a, b) => {
    const ad = deadlineMeta(a.deadline).daysLeft ?? Infinity;
    const bd = deadlineMeta(b.deadline).daysLeft ?? Infinity;
    return ad - bd;
  });

  return (
    <Card id="attention" className="scroll-mt-24 space-y-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-danger-500" aria-hidden />
        <h2 className="text-base font-semibold text-ink-900">Needs attention</h2>
        {items.length > 0 && (
          <span className="ml-auto flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-danger-500 px-1.5 text-xs font-bold text-white">
            {items.length}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-success-300 bg-success-50 px-4 py-8 text-center">
          <CheckCircle2 className="mb-2 h-8 w-8 text-success-500" />
          <p className="text-sm font-semibold text-success-800">All caught up!</p>
          <p className="mt-0.5 text-xs text-success-700">No urgent deadlines right now.</p>
        </div>
      ) : (
        <ul className="max-h-[420px] space-y-2.5 overflow-y-auto pr-1">
          {sorted.map((item) => {
            const { formatted, daysLeft, urgent, past } = deadlineMeta(item.deadline);
            const hint = urgencyLabel(daysLeft, past);
            const href = item.href ?? "/tenders";
            const isCritical = urgent || past;

            return (
              <li key={item.title}>
                <div
                  className={cn(
                    "rounded-xl border p-3.5",
                    isCritical ? "border-danger-200 bg-danger-50" : "border-ink-200 bg-white"
                  )}
                >
                  <p className="line-clamp-2 text-sm font-semibold leading-snug text-ink-900">{item.title}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs text-ink-500">
                      <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                      {formatted}
                    </span>
                    {hint && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-semibold",
                          isCritical ? "bg-danger-100 text-danger-700" : "bg-ink-100 text-ink-600"
                        )}
                      >
                        {hint}
                      </span>
                    )}
                  </div>
                  <Link
                    href={href}
                    className={cn(
                      "mt-3 flex h-8 w-full items-center justify-center rounded-lg text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500",
                      isCritical
                        ? "bg-danger-600 text-white hover:bg-danger-700"
                        : "bg-ink-900 text-white hover:bg-ink-800"
                    )}
                  >
                    Review tender
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
