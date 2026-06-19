import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { TrialBanner } from "@/components/subscription/TrialBanner";
import { FirmProvider } from "@/context/FirmContext";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { getSiteConfig } from "@/lib/api/config";
import type { ReactNode } from "react";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const siteConfig = await getSiteConfig();

  return (
    <SiteConfigProvider value={siteConfig}>
      <FirmProvider>
        <div className="flex h-screen overflow-hidden bg-ink-50">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <Navbar />
            {!siteConfig.invite_only && <TrialBanner />}
            <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">{children}</main>
          </div>
        </div>
      </FirmProvider>
    </SiteConfigProvider>
  );
}
