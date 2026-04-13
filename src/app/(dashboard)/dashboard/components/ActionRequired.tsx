import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export interface ActionItem {
  title: string;
  deadline: string;
}

interface ActionRequiredProps {
  items: ActionItem[];
}

export function ActionRequired({ items }: ActionRequiredProps) {
  return (
    <Card className="space-y-4">
      <h3 className="text-base font-semibold text-slate-900">Action Required</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.title} className="rounded-lg border border-slate-200 p-3">
            <p className="font-medium text-slate-900">{item.title}</p>
            <p className="mt-1 text-sm text-slate-500">Deadline: {item.deadline}</p>
            <Button size="sm" className="mt-3 w-full">
              Take Action
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
