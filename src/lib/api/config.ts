export interface SiteConfig {
  invite_only: boolean;
}

const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
const API_BASE_URL = (rawBaseUrl || "http://127.0.0.1:8000/api").replace(/\/+$/, "");

export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const res = await fetch(`${API_BASE_URL}/config/`, { cache: "no-store" });
    if (!res.ok) return { invite_only: false };
    return res.json() as Promise<SiteConfig>;
  } catch {
    // If backend is unreachable during build/SSR, default to public mode
    return { invite_only: false };
  }
}
