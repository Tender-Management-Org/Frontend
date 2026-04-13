import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function ActionBar() {
  return (
    <Card className="space-y-3">
      <h3 className="text-base font-semibold text-slate-900">Actions</h3>
      <div className="grid gap-2">
        <Button variant="secondary">Interested</Button>
        <Button variant="ghost" className="border border-border">
          Ignore
        </Button>
        <Button>Apply Now</Button>
      </div>
    </Card>
  );
}
