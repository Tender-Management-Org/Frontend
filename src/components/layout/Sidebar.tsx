"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bookmark,
  Building2,
  ChevronLeft,
  ChevronRight,
  FileSearch,
  LayoutDashboard,
  Lock,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Pipeline overview",
  },
  {
    name: "Firm",
    href: "/firm",
    icon: Building2,
    description: "Company profile",
  },
  {
    name: "Tenders",
    href: "/tenders",
    icon: FileSearch,
    description: "Browse & search",
  },
  {
    name: "Interested",
    href: "/interested",
    icon: Bookmark,
    description: "Your shortlist",
  },
  {
    name: "Recommendations",
    href: "/recommendations",
    icon: Sparkles,
    description: "AI suggestions",
  },
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
      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open navigation"
        className="fixed left-4 top-4 z-40 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink-200 bg-white text-ink-700 shadow-sm md:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Mobile backdrop */}
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-ink-900/50 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen flex-col bg-white shadow-sidebar transition-all duration-300 md:static md:z-auto",
          isCollapsed ? "w-[68px]" : "w-60",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Brand */}
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-ink-100",
            isCollapsed ? "justify-center px-0" : "justify-between px-4"
          )}
        >
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-navy-600">TenderPilot</p>
              <p className="truncate text-sm font-semibold text-ink-800">Workspace</p>
            </div>
          )}
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setIsCollapsed((prev) => !prev)}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden h-7 w-7 items-center justify-center rounded-md text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700 md:inline-flex"
            >
              {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close navigation"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700 md:hidden"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-2 py-4">
          <ul className="space-y-0.5">
            {menuItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "group relative flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                      isCollapsed ? "justify-center" : "gap-3",
                      isActive
                        ? "bg-navy-600 text-white shadow-sm"
                        : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isActive ? "text-white" : "text-ink-400 group-hover:text-ink-700"
                      )}
                      aria-hidden
                    />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 truncate">{item.name}</span>
                        {!isOnboardingComplete && item.href !== "/dashboard" && (
                          <Lock
                            className="h-3 w-3 shrink-0 text-ink-300"
                            aria-label={`${item.name} locked until onboarding is complete`}
                          />
                        )}
                      </>
                    )}
                    {isCollapsed && !isOnboardingComplete && item.href !== "/dashboard" && (
                      <Lock
                        className="absolute right-1 top-1 h-2.5 w-2.5 text-ink-300"
                        aria-label={`${item.name} locked`}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="shrink-0 border-t border-ink-100 px-4 py-3">
            <p className="text-xs text-ink-400">TenderPilot &copy; 2026</p>
          </div>
        )}
      </aside>
    </>
  );
}
