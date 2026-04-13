import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export function TenderFilters() {
  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">Filters</h3>
        <Button variant="ghost" size="sm">
          Reset
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">Location</p>
        <Input placeholder="Enter city or state" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">Tender Value</p>
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="Min" />
          <Input placeholder="Max" />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">Category</p>
        <select className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300">
          <option>All Categories</option>
          <option>Construction</option>
          <option>IT Services</option>
          <option>Equipment Supply</option>
          <option>Consulting</option>
        </select>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">Deadline</p>
        <Input type="date" />
      </div>
    </Card>
  );
}
