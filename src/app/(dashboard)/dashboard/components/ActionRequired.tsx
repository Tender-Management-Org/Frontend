import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export interface ActionItem {
  title: string;
  deadline: string;
  /** Defaults to /tenders */
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
  const diffMs = target.getTime() - today.getTime();
  const daysLeft = Math.round(diffMs / 86400000);
  const formatted = d.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  const urgent = daysLeft >= 0 && daysLeft <= 3;
  const past = daysLeft < 0;
  return { formatted, daysLeft, urgent, past };
}

function daysLeftLabel(daysLeft: number | null, past: boolean) {
  if (daysLeft === null) return null;
  if (past) return "Overdue";
  if (daysLeft === 0) return "Due today";
  if (daysLeft === 1) return "1 day left";
  return `${daysLeft} days left`;
}

export function ActionRequired({ items }: ActionRequiredProps) {
  return (
    <Card id="attention" className="scroll-mt-24 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">Needs your attention</h2>
            {items.length > 0 && (
              <span className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-800">
                {items.length}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">Deadlines coming up — open the tender to respond.</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50/40 px-4 py-8 text-center">
          <p className="text-sm font-medium text-emerald-900">You&apos;re all caught up</p>
          <p className="mt-1 text-xs text-emerald-800/80">No deadlines in this list right now.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const { formatted, daysLeft, urgent, past } = deadlineMeta(item.deadline);
            const hint = daysLeftLabel(daysLeft, past);
            const href = item.href ?? "/tenders";
            return (
              <li key={item.title}>
                <div
                  className={cn(
                    "rounded-xl border p-3 transition-colors",
                    urgent || past
                      ? "border-rose-200 bg-rose-50/40"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  )}
                >
                  <p className="font-medium leading-snug text-slate-900">{item.title}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5 text-slate-400" aria-hidden />
                      <span>{formatted}</span>
                    </span>
                    {hint && (
                      <span
                        className={cn(
                          "text-xs font-medium",
                          past || urgent ? "text-rose-700" : "text-slate-500"
                        )}
                      >
                        {hint}
                      </span>
                    )}
                  </div>
                  <Link
                    href={href}
                    className="mt-3 flex h-8 w-full items-center justify-center rounded-lg bg-slate-900 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
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
