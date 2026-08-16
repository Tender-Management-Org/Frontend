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
import { BrandMark, BrandWordmark } from "@/components/brand/BrandLogo";
import { cn } from "@/lib/utils";
import { getUnreadRecommendationsCount } from "@/lib/api/tenders";
import { useFirm } from "@/context/FirmContext";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { useTheme } from "@/context/ThemeContext";

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
  const [isMobileOpen,        setIsMobileOpen]        = useState(false);
  const [isCollapsed,         setIsCollapsed]         = useState(false);
  const [isOnboardingComplete,setIsOnboardingComplete]= useState(true);
  const [unreadCount,         setUnreadCount]         = useState(0);

  const { activeFirm, activeFirmId } = useFirm();
  const { invite_only, show_upgrade_cta } = useSiteConfig();
  const { theme } = useTheme();
  const brandVariant = theme === "dark" ? "onDark" : "onLight";

  // ── Onboarding cookie ──────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof document === "undefined") return;
    const cookieValue = document.cookie
      .split("; ")
      .find((entry) => entry.startsWith("tp_onboarding_complete="))
      ?.split("=")[1];
    setIsOnboardingComplete(cookieValue === "true");
  }, [pathname]);

  // ── Unread badge ───────────────────────────────────────────────────────────
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

  const firmName = activeFirm
    ? (activeFirm.business_name || activeFirm.legal_name)
    : "No firm";

  return (
    <>
      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open navigation"
        className="fixed left-4 top-4 z-40 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink-200 dark:border-ink-800 bg-surface text-ink-700 dark:text-ink-200 shadow-sm md:hidden"
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
          "fixed inset-y-0 left-0 z-50 flex h-screen flex-col bg-surface dark:bg-chrome shadow-sidebar transition-all duration-300 md:static md:z-auto",
          isCollapsed ? "w-[68px]" : "w-60",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* ── Brand ───────────────────────────────────────────────────────── */}
        <div
          className={cn(
            "shrink-0 border-b border-ink-100 dark:border-ink-900",
            isCollapsed ? "px-0 py-3" : "px-3 py-3"
          )}
        >
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              <Link href="/dashboard" aria-label="tenderkhoj home" className="rounded-xl">
                <BrandMark size={40} className="rounded-xl" variant={brandVariant} />
              </Link>
              <button
                type="button"
                onClick={() => setIsCollapsed(false)}
                aria-label="Expand sidebar"
                className="hidden h-6 w-6 items-center justify-center rounded-md text-ink-400 dark:text-ink-600 transition-colors hover:bg-ink-100 dark:hover:bg-ink-900 hover:text-ink-700 dark:hover:text-ink-200 md:inline-flex"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-1">
              <Link
                href="/dashboard"
                aria-label="tenderkhoj home"
                className="min-w-0 flex-1 rounded-lg px-2 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:focus-visible:ring-navy-400"
              >
                <BrandWordmark variant={brandVariant} height={28} />
                <p className="mt-1 truncate text-xs font-medium text-ink-500 dark:text-ink-400 leading-tight" title={firmName}>
                  {firmName}
                </p>
              </Link>
              {/* Collapse button */}
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                aria-label="Collapse sidebar"
                className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink-400 dark:text-ink-600 transition-colors hover:bg-ink-100 dark:hover:bg-ink-900 hover:text-ink-700 dark:hover:text-ink-200 md:inline-flex"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                aria-label="Close navigation"
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink-400 dark:text-ink-600 transition-colors hover:bg-ink-100 dark:hover:bg-ink-900 hover:text-ink-700 dark:hover:text-ink-200 md:hidden"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* ── Nav ─────────────────────────────────────────────────────────── */}
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
                        ? "bg-navy-600 text-white dark:bg-navActive dark:text-accent-cyan shadow-sm"
                        : "text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-900 hover:text-ink-900 dark:hover:text-ink-50"
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <span className="relative shrink-0">
                      <Icon
                        className={cn(
                          "h-4 w-4",
                          isActive ? "text-white dark:text-accent-cyan" : "text-ink-400 dark:text-ink-600 group-hover:text-ink-700 dark:group-hover:text-ink-200"
                        )}
                        aria-hidden
                      />
                      {isCollapsed && item.href === "/recommendations" && unreadCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 dark:bg-accent-red text-[8px] font-bold text-white leading-none">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </span>
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 truncate">{item.name}</span>
                        {item.href === "/recommendations" && unreadCount > 0 && (
                          <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 dark:bg-accent-red px-1 text-[10px] font-bold text-white leading-none">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </span>
                        )}
                        {!isOnboardingComplete && item.href !== "/dashboard" && item.href !== "/settings" && (
                          <Lock
                            className="h-3 w-3 shrink-0 text-ink-300 dark:text-ink-700"
                            aria-label={`${item.name} locked until onboarding is complete`}
                          />
                        )}
                      </>
                    )}
                    {isCollapsed && !isOnboardingComplete && item.href !== "/dashboard" && item.href !== "/settings" && (
                      <Lock
                        className="absolute right-1 top-1 h-2.5 w-2.5 text-ink-300 dark:text-ink-700"
                        aria-label={`${item.name} locked`}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── Footer — Upgrade callout ───────────────────────────────────────── */}
        <div className="shrink-0 border-t border-ink-100 dark:border-ink-900">
          {show_upgrade_cta && !invite_only && (
            <div className={cn("px-2 py-2", isCollapsed && "flex justify-center")}>
              <Link
                href="/upgrade"
                onClick={() => setIsMobileOpen(false)}
                title={isCollapsed ? "Upgrade plan" : undefined}
                className={cn(
                  "group flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-navy-600 dark:from-navy-400 to-navy-700 dark:to-navy-500 px-3 py-2.5 text-white transition-opacity hover:opacity-90",
                  isCollapsed ? "w-10 justify-center px-0" : "w-full"
                )}
              >
                <Zap className="h-4 w-4 shrink-0 text-yellow-300 dark:text-accent-orange" aria-hidden />
                {!isCollapsed && (
                  <div className="min-w-0">
                    <p className="text-xs font-semibold leading-tight">Upgrade plan</p>
                    <p className="truncate text-[10px] text-navy-200 dark:text-navy-700">Unlock more features</p>
                  </div>
                )}
              </Link>
            </div>
          )}
          {!isCollapsed && (
            <p
              className="truncate px-4 pb-2.5 pt-1 text-[10px] leading-tight text-ink-300 dark:text-ink-700"
              title="TenderKhoj, operated by Vaibhav Paliwal"
            >
              TenderKhoj, operated by Vaibhav Paliwal
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
