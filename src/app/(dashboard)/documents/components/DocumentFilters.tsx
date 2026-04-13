import { Input } from "@/components/ui/Input";

export function DocumentFilters() {
  return (
    <div className="grid gap-3 rounded-xl border border-border bg-white p-4 shadow-sm md:grid-cols-3">
      <Input placeholder="Search documents..." />

      <select className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300">
        <option>All Types</option>
        <option>GST_Cert</option>
        <option>PAN_Card</option>
        <option>Balance_Sheet</option>
        <option>Work_Order</option>
      </select>

      <select className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300">
        <option>All Status</option>
        <option>Verified</option>
        <option>Pending</option>
        <option>Expired</option>
      </select>
    </div>
  );
}
