import Link from "next/link";
import { ArrowRight, Building2, FileSearch, Sparkles } from "lucide-react";

const links = [
  {
    href: "/tenders",
    label: "Browse tenders",
    description: "Search thousands of active opportunities",
    icon: FileSearch,
    accent: "navy",
  },
  {
    href: "/firm",
    label: "Firm profile",
    description: "Identity, financials & preferences",
    icon: Building2,
    accent: "slate",
  },
  {
    href: "/recommendations",
    label: "AI recommendations",
    description: "Improve your bid win rate",
    icon: Sparkles,
    accent: "violet",
  },
] as const;

const accentClasses = {
  navy: "bg-navy-600 text-white group-hover:bg-navy-700",
  slate: "bg-ink-800 text-white group-hover:bg-ink-900",
  violet: "bg-violet-600 text-white group-hover:bg-violet-700",
};

export function DashboardQuickLinks() {
  return (
    <nav aria-label="Quick actions" className="w-full lg:max-w-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-400">Quick actions</p>
      <ul className="space-y-2">
        {links.map(({ href, label, description, icon: Icon, accent }) => (
          <li key={href}>
            <Link
              href={href}
              className="group flex items-center gap-3 rounded-xl border border-ink-200 bg-white p-3 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2"
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors",
                  accentClasses[accent]
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-ink-900">{label}</span>
                <span className="block truncate text-xs text-ink-400">{description}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-ink-600" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Local cn utility since this file doesn't import it separately
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
