import Link from "next/link";
import { Building2, ChevronRight, FileText, Search, Sparkles } from "lucide-react";

const links = [
  {
    href: "/tenders",
    label: "Browse tenders",
    description: "Search and filter opportunities",
    icon: Search
  },
  {
    href: "/firm",
    label: "Firm profile",
    description: "Identity, financials, preferences",
    icon: Building2
  },
  {
    href: "/documents",
    label: "Document vault",
    description: "Compliance files & uploads",
    icon: FileText
  },
  {
    href: "/recommendations",
    label: "Recommendations",
    description: "Ideas to improve bid outcomes",
    icon: Sparkles
  }
] as const;

export function DashboardQuickLinks() {
  return (
    <nav aria-label="Quick navigation" className="w-full lg:max-w-lg">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Jump to</p>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
        {links.map(({ href, label, description, icon: Icon }) => (
          <li key={href} className="min-w-0">
            <Link
              href={href}
              className="group flex h-full min-h-[4.5rem] flex-col justify-center gap-1 rounded-xl border border-border bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 lg:min-h-0 lg:flex-row lg:items-center lg:gap-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-0.5 text-sm font-medium leading-tight text-slate-900">
                  <span className="truncate">{label}</span>
                  <ChevronRight
                    className="h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-600"
                    aria-hidden
                  />
                </span>
                <span className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-slate-500 lg:line-clamp-1 lg:text-xs">
                  {description}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
