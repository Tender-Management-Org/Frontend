"use client";

import { Bell, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const titleMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/firm": "Firm",
  "/onboarding": "Firm Onboarding",
  "/tenders": "Tenders",
  "/documents": "Document Vault",
  "/recommendations": "Recommendations"
};

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const title =
    pathname.startsWith("/tenders/") && pathname !== "/tenders"
      ? "Tender detail"
      : (titleMap[pathname] ?? "Tender Platform");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

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
    setProfileOpen(false);
    setNotificationsOpen(false);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-white px-6">
      <h1 className="text-lg font-semibold text-slate-900">{title}</h1>

      <div className="flex items-center gap-3">
        <Link
          href="/onboarding"
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg border border-border bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          Onboarding
        </Link>

        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="h-10 w-64 rounded-lg border border-border bg-white pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        <div className="relative z-30" ref={notificationsRef}>
          <button
            type="button"
            aria-expanded={notificationsOpen}
            aria-haspopup="menu"
            aria-label="Notifications"
            onClick={() => {
              setNotificationsOpen((o) => !o);
              setProfileOpen(false);
            }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <Bell className="h-4 w-4" />
          </button>

          {notificationsOpen && (
            <div
              role="menu"
              aria-label="Notification list"
              className="absolute right-0 top-full mt-2 w-[min(100vw-2rem,20rem)] rounded-lg border border-border bg-white py-2 shadow-lg"
            >
              <p className="border-b border-border px-4 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Notifications
              </p>
              <div className="max-h-72 overflow-y-auto px-2 pt-2">
                <p className="px-2 py-6 text-center text-sm text-slate-500">
                  No new notifications
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="relative z-30" ref={profileRef}>
          <button
            type="button"
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            aria-label="Account menu"
            onClick={() => {
              setProfileOpen((o) => !o);
              setNotificationsOpen(false);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            VA
          </button>

          {profileOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-2 min-w-[10rem] rounded-lg border border-border bg-white py-1 shadow-lg"
            >
              <Link
                href="/login"
                role="menuitem"
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => setProfileOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                role="menuitem"
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => setProfileOpen(false)}
              >
                Register
              </Link>
              <button
                type="button"
                role="menuitem"
                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
