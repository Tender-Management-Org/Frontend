import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface FunnelChartProps {
  data: { stage: string; count: number }[];
}

const stageConfig = [
  { bar: "bg-navy-600", dot: "bg-navy-600" },
  { bar: "bg-violet-500", dot: "bg-violet-500" },
  { bar: "bg-warning-500", dot: "bg-warning-500" },
  { bar: "bg-success-500", dot: "bg-success-500" },
];

export function FunnelChart({ data }: FunnelChartProps) {
  const maxValue = Math.max(...data.map((d) => d.count), 1);
  const firstCount = data[0]?.count ?? 0;
  const lastCount = data[data.length - 1]?.count ?? 0;
  const endRate = firstCount > 0 ? Math.round((lastCount / firstCount) * 100) : 0;

  return (
    <Card className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-ink-900">Conversion funnel</h2>
        <p className="mt-0.5 text-xs text-ink-400">Volume at each stage · bar width relative to largest stage</p>
      </div>

      <div className="space-y-4" role="list" aria-label="Funnel stages">
        {data.map((item, index) => {
          const prev = index > 0 ? data[index - 1]!.count : null;
          const pctOfPrev = prev != null && prev > 0 ? Math.round((item.count / prev) * 100) : null;
          const widthPct = (item.count / maxValue) * 100;
          const cfg = stageConfig[index % stageConfig.length]!;

          return (
            <div key={item.stage} className="space-y-2" role="listitem">
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 shrink-0 rounded-full", cfg.dot)} aria-hidden />
                  <span className="text-sm font-medium text-ink-700">{item.stage}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  {pctOfPrev != null && (
                    <span className="text-xs text-ink-400">{pctOfPrev}% of prior</span>
                  )}
                  <span className="text-sm font-bold tabular-nums text-ink-900">{item.count}</span>
                </div>
              </div>
              <div
                className="h-2 w-full overflow-hidden rounded-full bg-ink-100"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={maxValue}
                aria-valuenow={item.count}
                aria-label={`${item.stage}: ${item.count}`}
              >
                <div
                  className={cn("h-full rounded-full transition-all duration-500", cfg.bar)}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {data.length >= 2 && (
        <div className="rounded-xl border border-ink-100 bg-ink-50 px-4 py-3">
          <p className="text-xs text-ink-600">
            End-to-end conversion:{" "}
            <span className="font-bold text-ink-900">{endRate}%</span>
            {" "}of {data[0]?.stage} reach {data[data.length - 1]?.stage}
            <span className="ml-1 text-ink-400">— demo figures</span>
          </p>
        </div>
      )}
    </Card>
  );
}
