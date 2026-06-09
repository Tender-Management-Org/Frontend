"use client";

import { Bell, ChevronDown, LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { clearAuthTokens, hasAuthSession } from "@/lib/api/client";
import { emitToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const titleMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/firm": "Firm workspace",
  "/onboarding": "Firm onboarding",
  "/tenders": "Tender explorer",
  "/interested": "Interested tenders",
  "/recommendations": "Recommendations",
};

const sectionMap: Record<string, string> = {
  "/dashboard": "Main",
  "/firm": "Firm",
  "/onboarding": "Setup",
  "/tenders": "Tenders",
  "/interested": "Pipeline",
  "/recommendations": "Insights",
};

function getRouteContext(pathname: string) {
  if (pathname.startsWith("/tenders/") && pathname !== "/tenders") {
    return { section: "Tenders", title: "Tender detail" };
  }
  if (pathname.startsWith("/interested/") && pathname.includes("/workspace")) {
    return { section: "Pipeline", title: "Filing workspace" };
  }
  return {
    section: sectionMap[pathname] ?? "TenderPilot",
    title: titleMap[pathname] ?? "TenderPilot",
  };
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { section, title } = getRouteContext(pathname);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsAuthenticated(hasAuthSession());
  }, [pathname]);

  useEffect(() => {
    if (!profileOpen && !notificationsOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (profileRef.current?.contains(target)) return;
      if (notificationsRef.current?.contains(target)) return;
      setProfileOpen(false);
      setNotificationsOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setProfileOpen(false);
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [profileOpen, notificationsOpen]);

  function handleLogout() {
    clearAuthTokens();
    setIsAuthenticated(false);
    setProfileOpen(false);
    setNotificationsOpen(false);
    emitToast({ type: "success", title: "Logged out successfully." });
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-ink-100 bg-white px-4 sm:px-6">
      {/* Left: breadcrumb */}
      <div className="flex min-w-0 items-center gap-2">
        <span className="hidden text-xs font-medium text-ink-400 sm:inline">{section}</span>
        <span className="hidden text-ink-200 sm:inline">/</span>
        <h1 className="truncate text-sm font-semibold text-ink-900">{title}</h1>
      </div>

      {/* Right: actions */}
      <div className="flex shrink-0 items-center gap-2">
        {/* Notifications */}
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
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink-200 text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-700"
          >
            <Bell className="h-4 w-4" />
          </button>

          {notificationsOpen && (
            <div
              role="menu"
              aria-label="Notifications"
              className="absolute right-0 top-full z-50 mt-2 w-80 animate-fade-in rounded-2xl border border-ink-200 bg-white shadow-dropdown"
            >
              <div className="border-b border-ink-100 px-4 py-3">
                <p className="text-sm font-semibold text-ink-900">Notifications</p>
              </div>
              <div className="max-h-72 overflow-y-auto">
                <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
                  <Bell className="mb-2 h-8 w-8 text-ink-200" />
                  <p className="text-sm font-medium text-ink-500">No new notifications</p>
                  <p className="mt-1 text-xs text-ink-400">
                    Deadline alerts and match updates will appear here.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
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
              "flex h-9 items-center gap-1.5 rounded-lg border border-ink-200 px-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-50",
            )}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-600 text-white">
              <User className="h-3.5 w-3.5" />
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-ink-400" />
          </button>

          {profileOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full z-50 mt-2 min-w-[11rem] animate-fade-in rounded-2xl border border-ink-200 bg-white py-1 shadow-dropdown"
            >
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/login"
                    role="menuitem"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 transition-colors hover:bg-ink-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    role="menuitem"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 transition-colors hover:bg-ink-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    Register
                  </Link>
                </>
              ) : (
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-danger-600 transition-colors hover:bg-danger-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
