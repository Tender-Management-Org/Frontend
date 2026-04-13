"use client";

import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";

const titleMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/onboarding": "Firm Onboarding",
  "/tenders": "Tenders",
  "/documents": "Document Vault",
  "/recommendations": "Recommendations"
};

export function Navbar() {
  const pathname = usePathname();
  const title = titleMap[pathname] ?? "Tender Platform";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-white px-6">
      <h1 className="text-lg font-semibold text-slate-900">{title}</h1>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="h-10 w-64 rounded-lg border border-border bg-white pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-slate-600 hover:bg-slate-100"
        >
          <Bell className="h-4 w-4" />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
          VA
        </div>
      </div>
    </header>
  );
}
