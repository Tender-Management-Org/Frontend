"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Bookmark,
  Building2,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileSearch,
  LayoutDashboard,
  Lock,
  Menu,
  Plus,
  Settings,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getUnreadRecommendationsCount } from "@/lib/api/tenders";
import { useFirm } from "@/context/FirmContext";
import { useSubscription } from "@/hooks/useSubscription";

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
  const [firmDropdownOpen,    setFirmDropdownOpen]    = useState(false);

  const { allFirms, activeFirm, activeFirmId, setActiveFirm } = useFirm();
  const { subscription } = useSubscription();
  const firmDropdownRef = useRef<HTMLDivElement>(null);

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

  // ── Close firm dropdown on outside click / Escape ─────────────────────────
  useEffect(() => {
    if (!firmDropdownOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!firmDropdownRef.current?.contains(e.target as Node)) setFirmDropdownOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFirmDropdownOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [firmDropdownOpen]);

  const maxFirms = subscription?.plan.max_firms ?? 1;
  const canAddFirm = maxFirms === -1 || allFirms.length < maxFirms;
  const firmName = activeFirm
    ? (activeFirm.business_name || activeFirm.legal_name)
    : "No firm";
  const firmInitial = firmName.charAt(0).toUpperCase();

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
        {/* ── Brand + Firm switcher ────────────────────────────────────────── */}
        <div
          className={cn(
            "relative shrink-0 border-b border-ink-100",
            isCollapsed ? "px-0 py-3" : "px-3 py-3"
          )}
          ref={firmDropdownRef}
        >
          {isCollapsed ? (
            /* Collapsed: just the firm avatar + collapse toggle below */
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => setFirmDropdownOpen((o) => !o)}
                aria-label="Switch firm"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-600 text-sm font-bold text-white transition-colors hover:bg-navy-700"
                title={firmName}
              >
                {firmInitial}
              </button>
              <button
                type="button"
                onClick={() => setIsCollapsed(false)}
                aria-label="Expand sidebar"
                className="hidden h-6 w-6 items-center justify-center rounded-md text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700 md:inline-flex"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            /* Expanded: TenderPilot label + firm dropdown trigger */
            <div className="flex items-center justify-between gap-1">
              <button
                type="button"
                onClick={() => setFirmDropdownOpen((o) => !o)}
                aria-expanded={firmDropdownOpen}
                aria-haspopup="listbox"
                className={cn(
                  "group flex min-w-0 flex-1 items-center gap-2.5 rounded-xl px-2 py-2 transition-colors",
                  firmDropdownOpen ? "bg-ink-100" : "hover:bg-ink-50"
                )}
              >
                {/* Firm avatar */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-600 text-sm font-bold text-white">
                  {firmInitial}
                </div>
                {/* Labels */}
                <div className="min-w-0 text-left">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-navy-500 leading-none mb-0.5">
                    TenderPilot
                  </p>
                  <p className="truncate text-sm font-semibold text-ink-800 leading-tight">
                    {firmName}
                  </p>
                </div>
                <ChevronDown
                  className={cn(
                    "ml-auto h-3.5 w-3.5 shrink-0 text-ink-400 transition-transform",
                    firmDropdownOpen && "rotate-180"
                  )}
                  aria-hidden
                />
              </button>

              {/* Collapse button */}
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                aria-label="Collapse sidebar"
                className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700 md:inline-flex"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                aria-label="Close navigation"
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700 md:hidden"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Firm dropdown */}
          {firmDropdownOpen && (
            <div
              role="listbox"
              aria-label="Select firm"
              className={cn(
                "absolute left-2 right-2 top-full z-50 mt-1 animate-fade-in rounded-2xl border border-ink-200 bg-white py-1.5 shadow-dropdown",
                isCollapsed && "left-14 right-auto w-52"
              )}
            >
              {/* Firm list */}
              {allFirms.map((firm) => {
                const name = firm.business_name || firm.legal_name;
                const isActive = firm.id === activeFirmId;
                return (
                  <button
                    key={firm.id}
                    role="option"
                    aria-selected={isActive}
                    type="button"
                    onClick={() => {
                      setFirmDropdownOpen(false);
                      if (!isActive) setActiveFirm(firm.id);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors",
                      isActive ? "bg-navy-50 text-navy-700" : "text-ink-700 hover:bg-ink-50"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold uppercase",
                        isActive ? "bg-navy-600 text-white" : "bg-ink-100 text-ink-500"
                      )}
                    >
                      {name.charAt(0)}
                    </div>
                    <span className="flex-1 truncate text-xs font-medium">{name}</span>
                    {isActive && <Check className="h-3.5 w-3.5 shrink-0 text-navy-600" aria-hidden />}
                  </button>
                );
              })}

              {/* Divider + Add firm */}
              <div className="my-1 border-t border-ink-100" />
              {canAddFirm ? (
                <Link
                  href="/firm/new"
                  onClick={() => { setFirmDropdownOpen(false); setIsMobileOpen(false); }}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-navy-600 transition-colors hover:bg-navy-50"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-navy-50">
                    <Plus className="h-3.5 w-3.5 text-navy-600" aria-hidden />
                  </div>
                  Add firm
                </Link>
              ) : (
                <Link
                  href="/upgrade"
                  onClick={() => { setFirmDropdownOpen(false); setIsMobileOpen(false); }}
                  className="flex items-center gap-2.5 px-3 py-2 transition-colors hover:bg-ink-50"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ink-100">
                    <Plus className="h-3.5 w-3.5 text-ink-400" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-ink-500">Add firm</p>
                    <p className="text-[10px] text-navy-500">Upgrade to add more</p>
                  </div>
                </Link>
              )}
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

        {/* ── Footer — Upgrade callout + copyright ────────────────────────── */}
        <div className="shrink-0 border-t border-ink-100">
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
