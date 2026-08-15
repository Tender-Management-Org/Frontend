export interface SiteConfig {
  invite_only: boolean;
  show_upgrade_cta: boolean;
}

const DEFAULT_SITE_CONFIG: SiteConfig = {
  invite_only: false,
  show_upgrade_cta: true,
};

const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
const API_BASE_URL = (rawBaseUrl || "http://127.0.0.1:8000/api").replace(/\/+$/, "");

export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const res = await fetch(`${API_BASE_URL}/config/`, { cache: "no-store" });
    if (!res.ok) return DEFAULT_SITE_CONFIG;
    const data = (await res.json()) as Partial<SiteConfig>;
    return {
      invite_only: Boolean(data.invite_only),
      show_upgrade_cta: data.show_upgrade_cta !== false,
    };
  } catch {
    // If backend is unreachable during build/SSR, default to public mode
    return DEFAULT_SITE_CONFIG;
  }
}
