import { Card } from "@/components/ui/Card";

export interface CorrigendumItem {
  title: string;
  type: string;
  date: string;
}

interface CorrigendumListProps {
  corrigendum: CorrigendumItem[];
}

export function CorrigendumList({ corrigendum }: CorrigendumListProps) {
  return (
    <Card className="space-y-4">
      <h3 className="text-base font-semibold text-slate-900">Corrigendum Updates</h3>

      <div className="space-y-3">
        {corrigendum.map((item) => (
          <div key={`${item.title}-${item.date}`} className="rounded-lg border border-slate-200 p-3">
            <p className="font-medium text-slate-900">{item.title}</p>
            <p className="text-sm text-slate-500">
              {item.type} • {item.date}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
