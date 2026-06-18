"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getFirms, type FirmApi } from "@/lib/api/firms";
import { hasAuthSession } from "@/lib/api/client";

// ── Cookie key ────────────────────────────────────────────────────────────────
// Written by this context so server components (dashboard, recommendations)
// can read it via `cookies()` from next/headers.
const COOKIE_KEY = "tp_active_firm";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function readActiveFirmCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${COOKIE_KEY}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

function writeActiveFirmCookie(firmId: string) {
  document.cookie = `${COOKIE_KEY}=${encodeURIComponent(firmId)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

// ── Context shape ─────────────────────────────────────────────────────────────

interface FirmContextValue {
  allFirms: FirmApi[];
  activeFirm: FirmApi | null;
  activeFirmId: string | null;
  loading: boolean;
  setActiveFirm: (firmId: string) => void;
  refreshFirms: () => Promise<void>;
}

const FirmContext = createContext<FirmContextValue>({
  allFirms: [],
  activeFirm: null,
  activeFirmId: null,
  loading: true,
  setActiveFirm: () => {},
  refreshFirms: async () => {},
});

// ── Provider ──────────────────────────────────────────────────────────────────

export function FirmProvider({ children }: { children: ReactNode }) {
  const [allFirms, setAllFirms] = useState<FirmApi[]>([]);
  const [activeFirmId, setActiveFirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadFirms = useCallback(async () => {
    if (!hasAuthSession()) {
      setLoading(false);
      return;
    }
    try {
      // Fetch all pages (most users have 1-5 firms; one page is enough)
      const res = await getFirms(1);
      const active = res.results.filter((f) => f.is_active);
      setAllFirms(active);

      // Resolve which firm is "active":
      // 1. Use the cookie if the firmId still exists and is active
      // 2. Otherwise fall back to the first active firm
      const cookieId = readActiveFirmCookie();
      const cookieMatch = active.find((f) => f.id === cookieId);
      const resolved = cookieMatch ?? active[0] ?? null;

      if (resolved) {
        setActiveFirmId(resolved.id);
        writeActiveFirmCookie(resolved.id);
      }
    } catch {
      // Not authenticated yet or network error — leave empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFirms();
  }, [loadFirms]);

  const setActiveFirm = useCallback(
    (firmId: string) => {
      const firm = allFirms.find((f) => f.id === firmId);
      if (!firm) return;
      setActiveFirmId(firmId);
      writeActiveFirmCookie(firmId);
      // Caller should invoke router.refresh() to re-render server components
    },
    [allFirms]
  );

  const refreshFirms = useCallback(async () => {
    await loadFirms();
  }, [loadFirms]);

  const activeFirm = allFirms.find((f) => f.id === activeFirmId) ?? null;

  return (
    <FirmContext.Provider
      value={{ allFirms, activeFirm, activeFirmId, loading, setActiveFirm, refreshFirms }}
    >
      {children}
    </FirmContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useFirm(): FirmContextValue {
  return useContext(FirmContext);
}
