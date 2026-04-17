import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface FunnelChartProps {
  data: {
    stage: string;
    count: number;
  }[];
}

const barTone = ["bg-slate-800", "bg-indigo-600", "bg-amber-500", "bg-emerald-600"];

export function FunnelChart({ data }: FunnelChartProps) {
  const maxValue = Math.max(...data.map((item) => item.count), 1);
  const firstCount = data[0]?.count ?? 0;
  const lastCount = data[data.length - 1]?.count ?? 0;
  const endRate =
    firstCount > 0 ? Math.round((lastCount / firstCount) * 100) : 0;

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-slate-900">Conversion funnel</h2>
        <p className="mt-1 text-xs text-slate-500">
          Volume at each stage; bar width is relative to your largest stage.
        </p>
      </div>

      <div className="space-y-4" role="list" aria-label="Funnel stages by count">
        {data.map((item, index) => {
          const prev = index > 0 ? data[index - 1]!.count : null;
          const pctOfPrev =
            prev != null && prev > 0 ? Math.round((item.count / prev) * 100) : null;
          const widthPct = (item.count / maxValue) * 100;
          const barClass = barTone[index % barTone.length] ?? "bg-slate-800";

          return (
            <div key={item.stage} className="space-y-1.5" role="listitem">
              <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                <span className="font-medium text-slate-700">{item.stage}</span>
                <div className="flex items-baseline gap-2">
                  {pctOfPrev != null && index > 0 && (
                    <span className="text-xs text-slate-400">{pctOfPrev}% of prior</span>
                  )}
                  <span className="tabular-nums font-semibold text-slate-900">{item.count}</span>
                </div>
              </div>
              <div
                className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={maxValue}
                aria-valuenow={item.count}
                aria-label={`${item.stage}: ${item.count}`}
              >
                <div
                  className={cn("h-full rounded-full transition-all", barClass)}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {data.length >= 2 && (
        <div className="rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2.5">
          <p className="text-xs text-slate-600">
            <span className="font-semibold text-slate-800">{endRate}%</span> of{" "}
            <span className="font-medium">{data[0]?.stage ?? "top"}</span> volume reaches{" "}
            <span className="font-medium">{data[data.length - 1]?.stage ?? "end"}</span>
            <span className="text-slate-400"> — demo figures</span>
          </p>
        </div>
      )}
    </Card>
  );
}
