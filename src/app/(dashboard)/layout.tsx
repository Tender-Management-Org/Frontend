import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col md:pl-0">
        <Navbar />
        <main className="flex-1 scroll-smooth overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
