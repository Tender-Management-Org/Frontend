"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bookmark,
  Building2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Files,
  LayoutDashboard,
  Lock,
  Menu,
  Sparkles,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Firm", href: "/firm", icon: Building2 },
  { name: "Tenders", href: "/tenders", icon: FileText },
  { name: "Interested", href: "/interested", icon: Bookmark },
  { name: "Documents", href: "/documents", icon: Files },
  { name: "Recommendations", href: "/recommendations", icon: Sparkles }
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(true);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const cookieValue = document.cookie
      .split("; ")
      .find((entry) => entry.startsWith("tp_onboarding_complete="))
      ?.split("=")[1];
    setIsOnboardingComplete(cookieValue === "true");
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className="fixed left-4 top-4 z-40 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/95 text-slate-700 shadow-sm backdrop-blur md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close mobile menu overlay"
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-slate-200 bg-white/90 p-4 shadow-xl shadow-slate-900/10 backdrop-blur transition-all duration-300 md:static md:z-auto md:shadow-none",
          isCollapsed ? "w-[84px]" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="mb-8 flex items-center justify-between gap-2">
          {!isCollapsed && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">TenderPilot</p>
              <p className="text-sm font-semibold text-slate-900">Workspace</p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCollapsed((prev) => !prev)}
              className="hidden h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 md:inline-flex"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (pathname.startsWith(item.href) && item.href !== "/dashboard" && item.href.length > 1);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  isCollapsed ? "justify-center" : "gap-3",
                  isActive
                    ? "bg-slate-900 text-white shadow-sm shadow-slate-900/20"
                    : "text-slate-700 hover:bg-slate-100/90 hover:text-slate-900"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
                {!isOnboardingComplete && (
                  <Lock
                    className={cn("h-3.5 w-3.5 shrink-0", isCollapsed ? "absolute right-2 top-2" : "ml-auto")}
                    aria-label={`${item.name} locked until onboarding is complete`}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
