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
  Settings,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getUnreadRecommendationsCount } from "@/lib/api/tenders";
import { useFirm } from "@/context/FirmContext";

const menuItems = [
  { name: "Dashboard",       href: "/dashboard",       icon: LayoutDashboard, description: "Pipeline overview" },
  { name: "Firm",            href: "/firm",             icon: Building2,       description: "Company profile"  },
  { name: "Tenders",         href: "/tenders",          icon: FileSearch,      description: "Browse & search"  },
  { name: "Interested",      href: "/interested",       icon: Bookmark,        description: "Your shortlist"   },
  { name: "Recommendations", href: "/recommendations",  icon: Sparkles,        description: "AI suggestions"   },
  { name: "Settings",        href: "/settings",         icon: Settings,        description: "Preferences"      },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen]         = useState(false);
  const [isCollapsed,  setIsCollapsed]           = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(true);
  const [unreadCount,  setUnreadCount]           = useState(0);
  const { activeFirmId } = useFirm();

  useEffect(() => {
    if (typeof document === "undefined") return;
    const cookieValue = document.cookie
      .split("; ")
      .find((entry) => entry.startsWith("tp_onboarding_complete="))
      ?.split("=")[1];
    setIsOnboardingComplete(cookieValue === "true");
  }, [pathname]);

  useEffect(() => {
    if (!activeFirmId) return;
    let cancelled = false;
    async function fetchCount() {
      try {
        const { unread_count } = await getUnreadRecommendationsCount(activeFirmId!);
        if (!cancelled) setUnreadCount(unread_count);
      } catch { /* best-effort */ }
    }
    fetchCount();
    return () => { cancelled = true; };
  }, [activeFirmId]);

  useEffect(() => {
    function handleRead() { setUnreadCount((prev) => Math.max(0, prev - 1)); }
    window.addEventListener("recommendation-read", handleRead);
    return () => window.removeEventListener("recommendation-read", handleRead);
  }, []);

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
                    <span className="relative shrink-0">
                      <Icon
                        className={cn(
                          "h-4 w-4",
                          isActive ? "text-white" : "text-ink-400 group-hover:text-ink-700"
                        )}
                        aria-hidden
                      />
                      {isCollapsed && item.href === "/recommendations" && unreadCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white leading-none">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </span>
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 truncate">{item.name}</span>
                        {item.href === "/recommendations" && unreadCount > 0 && (
                          <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white leading-none">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </span>
                        )}
                        {!isOnboardingComplete && item.href !== "/dashboard" && item.href !== "/settings" && (
                          <Lock
                            className="h-3 w-3 shrink-0 text-ink-300"
                            aria-label={`${item.name} locked until onboarding is complete`}
                          />
                        )}
                      </>
                    )}
                    {isCollapsed && !isOnboardingComplete && item.href !== "/dashboard" && item.href !== "/settings" && (
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

        {/* Footer — Upgrade callout + copyright */}
        <div className="shrink-0 border-t border-ink-100">
          {/* Upgrade strip */}
          <div className={cn("px-2 py-2", isCollapsed && "flex justify-center")}>
            <Link
              href="/upgrade"
              onClick={() => setIsMobileOpen(false)}
              title={isCollapsed ? "Upgrade plan" : undefined}
              className={cn(
                "group flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-navy-600 to-navy-700 px-3 py-2.5 text-white transition-opacity hover:opacity-90",
                isCollapsed ? "w-10 justify-center px-0" : "w-full"
              )}
            >
              <Zap className="h-4 w-4 shrink-0 text-yellow-300" aria-hidden />
              {!isCollapsed && (
                <div className="min-w-0">
                  <p className="text-xs font-semibold leading-tight">Upgrade plan</p>
                  <p className="truncate text-[10px] text-navy-200">Unlock more features</p>
                </div>
              )}
            </Link>
          </div>

          {!isCollapsed && (
            <div className="px-4 pb-3 pt-1">
              <p className="text-xs text-ink-400">TenderPilot &copy; 2026</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
