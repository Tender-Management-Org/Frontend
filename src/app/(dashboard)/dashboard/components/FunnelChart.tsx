import { Card } from "@/components/ui/Card";

interface FunnelChartProps {
  data: {
    stage: string;
    count: number;
  }[];
}

export function FunnelChart({ data }: FunnelChartProps) {
  const maxValue = Math.max(...data.map((item) => item.count), 1);

  return (
    <Card className="space-y-4">
      <h3 className="text-base font-semibold text-slate-900">Conversion Funnel</h3>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.stage} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">{item.stage}</span>
              <span className="font-medium text-slate-900">{item.count}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-slate-900 transition-all"
                style={{ width: `${(item.count / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
