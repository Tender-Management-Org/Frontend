import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";

export function TenderSearch() {
  return (
    <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Search tenders..." className="pl-9" />
        </div>
        <Button className="sm:w-auto">Search</Button>
      </div>
    </div>
  );
}
