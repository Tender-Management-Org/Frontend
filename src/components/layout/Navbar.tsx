"use client";

import { Bell, ChevronDown, LogOut, User, Check, CheckCheck, Sparkles, Clock, ClipboardList, Info, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { clearAuthTokens, hasAuthSession } from "@/lib/api/client";
import { FirmSwitcher } from "@/components/layout/FirmSwitcher";
import {
  AppNotification,
  getNotifications,
  getNotificationUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/api/notifications";
import { emitToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

// ─── helpers ─────────────────────────────────────────────────────────────────

const titleMap: Record<string, string> = {
  "/dashboard":      "Dashboard",
  "/firm":           "Firm workspace",
  "/onboarding":     "Firm onboarding",
  "/tenders":        "Tender explorer",
  "/interested":     "Interested tenders",
  "/recommendations":"Recommendations",
  "/settings":       "Settings",
  "/upgrade":        "Upgrade plan",
};

const sectionMap: Record<string, string> = {
  "/dashboard":      "Main",
  "/firm":           "Firm",
  "/onboarding":     "Setup",
  "/tenders":        "Tenders",
  "/interested":     "Pipeline",
  "/recommendations":"Insights",
  "/settings":       "Account",
  "/upgrade":        "Account",
};

function getRouteContext(pathname: string) {
  if (pathname.startsWith("/tenders/") && pathname !== "/tenders") {
    return { section: "Tenders", title: "Tender detail" };
  }
  if (pathname.startsWith("/interested/") && pathname !== "/interested") {
    return { section: "Pipeline", title: "Filing workspace" };
  }
  return {
    section: sectionMap[pathname] ?? "TenderKhoj",
    title: titleMap[pathname] ?? "TenderKhoj",
  };
}

function timeAgo(iso: string): string {
  const diff  = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  <  1) return "just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

const notificationTone: Record<string, { icon: LucideIcon; classes: string }> = {
  new_recommendation:   { icon: Sparkles,      classes: "bg-violet-50 text-violet-600 dark:bg-accent-purple-bg dark:text-accent-purple" },
  deadline_approaching: { icon: Clock,         classes: "bg-warning-50 text-warning-600 dark:bg-accent-orange-bg dark:text-accent-orange" },
  tender_updated:       { icon: ClipboardList, classes: "bg-navy-50 text-navy-600 dark:bg-accent-blue-bg dark:text-accent-blue" },
  system:                { icon: Info,          classes: "bg-ink-100 text-ink-500 dark:bg-ink-900 dark:text-ink-400" },
};
const defaultNotificationTone = { icon: Bell, classes: "bg-ink-100 text-ink-500 dark:bg-ink-900 dark:text-ink-400" };

// ─── component ────────────────────────────────────────────────────────────────

export function Navbar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { section, title } = getRouteContext(pathname);

  const [profileOpen,       setProfileOpen]       = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isAuthenticated,   setIsAuthenticated]   = useState(false);

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  const profileRef       = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // ── auth state ──────────────────────────────────────────────────────────────
  useEffect(() => {
    setIsAuthenticated(hasAuthSession());
  }, [pathname]);

  // ── unread count badge (fetched once per mount) ──────────────────────────────
  useEffect(() => {
    if (!hasAuthSession()) return;
    getNotificationUnreadCount()
      .then(({ unread_count }) => setUnreadCount(unread_count))
      .catch(() => {});
  }, []);

  // ── close on outside click / Escape ─────────────────────────────────────────
  useEffect(() => {
    if (!profileOpen && !notificationsOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (profileRef.current?.contains(target))       return;
      if (notificationsRef.current?.contains(target)) return;
      setProfileOpen(false);
      setNotificationsOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setProfileOpen(false); setNotificationsOpen(false); }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown",    onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown",    onKeyDown);
    };
  }, [profileOpen, notificationsOpen]);

  // ── load notifications when panel opens ─────────────────────────────────────
  useEffect(() => {
    if (!notificationsOpen) return;
    setLoadingNotifs(true);
    getNotifications()
      .then((res) => setNotifications(res.results))
      .catch(() => {})
      .finally(() => setLoadingNotifs(false));
  }, [notificationsOpen]);

  // ── actions ──────────────────────────────────────────────────────────────────

  const handleMarkRead = useCallback(async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // best-effort
    }
  }, []);

  const handleMarkAllRead = useCallback(async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {
      emitToast({ type: "error", title: "Could not mark all as read." });
    }
  }, []);

  function handleLogout() {
    clearAuthTokens();
    setIsAuthenticated(false);
    setProfileOpen(false);
    setNotificationsOpen(false);
    emitToast({ type: "success", title: "Logged out successfully." });
    router.replace("/login");
    router.refresh();
  }

  // ─── render ──────────────────────────────────────────────────────────────────

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-ink-100 dark:border-ink-900 bg-surface dark:bg-chrome px-4 sm:px-6">
      {/* Left: breadcrumb */}
      <div className="flex min-w-0 items-center gap-2">
        <span className="hidden text-xs font-medium text-ink-400 dark:text-ink-600 sm:inline">{section}</span>
        <span className="hidden text-ink-200 dark:text-ink-800 sm:inline">/</span>
        <h1 className="truncate text-sm font-semibold text-ink-900 dark:text-ink-50">{title}</h1>
      </div>

      {/* Right: actions */}
      <div className="flex shrink-0 items-center gap-2">

        {/* ── Firm switcher ── */}
        <FirmSwitcher />

        {/* ── Theme toggle ── */}
        <ThemeToggle />

        {/* ── Notifications bell ── */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            aria-expanded={notificationsOpen}
            aria-haspopup="menu"
            aria-label="Notifications"
            onClick={() => {
              setNotificationsOpen((o) => !o);
              setProfileOpen(false);
            }}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink-200 dark:border-ink-800 text-ink-500 dark:text-ink-400 transition-colors hover:bg-ink-50 dark:hover:bg-ink-950 hover:text-ink-700 dark:hover:text-ink-200"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 dark:bg-accent-red px-0.5 text-[9px] font-bold leading-none text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div
              role="menu"
              aria-label="Notifications"
              className="absolute right-0 top-full z-50 mt-2 w-80 animate-fade-in rounded-2xl border border-ink-200 dark:border-ink-800 bg-surface shadow-dropdown"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between border-b border-ink-100 dark:border-ink-900 px-4 py-3">
                <p className="text-sm font-semibold text-ink-900 dark:text-ink-50">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 rounded-full bg-red-100 dark:bg-accent-red-bg px-1.5 py-0.5 text-[10px] font-bold text-red-600 dark:text-accent-red">
                      {unreadCount}
                    </span>
                  )}
                </p>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 text-xs text-ink-400 dark:text-ink-600 hover:text-ink-700 dark:hover:text-ink-200"
                    title="Mark all as read"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    All read
                  </button>
                )}
              </div>

              {/* Panel body */}
              <div className="max-h-72 overflow-y-auto">
                {loadingNotifs ? (
                  <div className="flex justify-center py-8">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink-200 dark:border-ink-800 border-t-navy-600" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
                    <Bell className="mb-2 h-8 w-8 text-ink-200 dark:text-ink-800" />
                    <p className="text-sm font-medium text-ink-500 dark:text-ink-400">No notifications yet</p>
                    <p className="mt-1 text-xs text-ink-400 dark:text-ink-600">
                      Deadline alerts and match updates will appear here.
                    </p>
                  </div>
                ) : (
                  <ul>
                    {notifications.map((n) => (
                      <li
                        key={n.id}
                        className={cn(
                          "flex items-start gap-3 border-b border-ink-50 dark:border-ink-950 px-4 py-3 last:border-0",
                          !n.is_read && "bg-blue-50/40 dark:bg-accent-blue-bg/40"
                        )}
                      >
                        {(() => {
                          const tone = notificationTone[n.notification_type] ?? defaultNotificationTone;
                          const Icon = tone.icon;
                          return (
                            <span className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full", tone.classes)}>
                              <Icon className="h-3.5 w-3.5" />
                            </span>
                          );
                        })()}
                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              "text-xs leading-snug",
                              !n.is_read ? "font-semibold text-ink-900 dark:text-ink-50" : "text-ink-700 dark:text-ink-200"
                            )}
                          >
                            {n.title}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-[11px] text-ink-400 dark:text-ink-600">{n.body}</p>
                          <p className="mt-1 text-[10px] text-ink-300 dark:text-ink-700">{timeAgo(n.created_at)}</p>
                        </div>
                        {!n.is_read && (
                          <button
                            type="button"
                            onClick={() => handleMarkRead(n.id)}
                            aria-label="Mark as read"
                            className="mt-0.5 shrink-0 text-ink-300 dark:text-ink-700 hover:text-navy-600 dark:hover:text-navy-400"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Profile ── */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            aria-label="Account menu"
            onClick={() => {
              setProfileOpen((o) => !o);
              setNotificationsOpen(false);
            }}
            className={cn(
              "flex h-9 items-center gap-1.5 rounded-lg border border-ink-200 dark:border-ink-800 px-2.5 text-sm font-medium text-ink-700 dark:text-ink-200 transition-colors hover:bg-ink-50 dark:hover:bg-ink-950",
            )}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-600 dark:bg-navy-400 text-white">
              <User className="h-3.5 w-3.5" />
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-ink-400 dark:text-ink-600" />
          </button>

          {profileOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full z-50 mt-2 min-w-[12rem] animate-fade-in rounded-2xl border border-ink-200 dark:border-ink-800 bg-surface py-1 shadow-dropdown"
            >
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/login"
                    role="menuitem"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 dark:text-ink-200 transition-colors hover:bg-ink-50 dark:hover:bg-ink-950"
                    onClick={() => setProfileOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    role="menuitem"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 dark:text-ink-200 transition-colors hover:bg-ink-50 dark:hover:bg-ink-950"
                    onClick={() => setProfileOpen(false)}
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/settings"
                    role="menuitem"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 dark:text-ink-200 transition-colors hover:bg-ink-50 dark:hover:bg-ink-950"
                    onClick={() => setProfileOpen(false)}
                  >
                    <User className="h-4 w-4 text-ink-400 dark:text-ink-600" />
                    Settings
                  </Link>
                  <div className="my-1 border-t border-ink-100 dark:border-ink-900" />
                  <button
                    type="button"
                    role="menuitem"
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-danger-600 dark:text-danger-400 transition-colors hover:bg-danger-50 dark:hover:bg-danger-500/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
