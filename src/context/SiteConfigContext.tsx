"use client";

import { createContext, useContext } from "react";
import type { SiteConfig } from "@/lib/api/config";

const SiteConfigContext = createContext<SiteConfig>({ invite_only: false });

export function SiteConfigProvider({
  value,
  children,
}: {
  value: SiteConfig;
  children: React.ReactNode;
}) {
  return (
    <SiteConfigContext.Provider value={value}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig(): SiteConfig {
  return useContext(SiteConfigContext);
}
