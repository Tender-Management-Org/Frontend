"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Files,
  LayoutDashboard,
  Menu,
  Sparkles,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Firm", href: "/firm", icon: Building2 },
  { name: "Tenders", href: "/tenders", icon: FileText },
  { name: "Documents", href: "/documents", icon: Files },
  { name: "Recommendations", href: "/recommendations", icon: Sparkles }
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className="fixed left-4 top-4 z-40 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white text-slate-700 shadow-sm md:hidden"
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
          "fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-border bg-white p-4 transition-all duration-300 md:static md:z-auto",
          isCollapsed ? "w-[84px]" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="mb-8 flex items-center justify-between gap-2">
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-wide text-slate-500",
              isCollapsed && "hidden md:block md:text-[0px]"
            )}
          >
            Tender Platform
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCollapsed((prev) => !prev)}
              className="hidden h-8 w-8 items-center justify-center rounded-lg border border-border text-slate-600 hover:bg-slate-100 md:inline-flex"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-slate-600 hover:bg-slate-100 md:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <nav className="space-y-1">
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
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isCollapsed ? "justify-center" : "gap-3",
                  isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
