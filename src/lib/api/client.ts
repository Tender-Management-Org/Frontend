const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
const isDevelopment = process.env.NODE_ENV !== "production";

// Server-side fetch in Next.js requires absolute URLs. Use a local default in dev
// so pages don't crash when .env.local is not created yet.
const API_BASE_URL = (rawBaseUrl || (isDevelopment ? "http://127.0.0.1:8000/api" : "")).replace(/\/+$/, "");
const ACCESS_TOKEN_KEY = "tp_access_token";
const REFRESH_TOKEN_KEY = "tp_refresh_token";
const ACCESS_COOKIE = "tp_access_token";
const REFRESH_COOKIE = "tp_refresh_token";
const ONBOARDING_COOKIE = "tp_onboarding_complete";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

function setClientCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

function clearClientCookie(name: string) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}

async function readServerCookie(name: string): Promise<string | null> {
  if (typeof window !== "undefined") return null;
  const { cookies } = await import("next/headers");
  return cookies().get(name)?.value ?? null;
}

function getClientCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
}

async function getAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") {
    return readServerCookie(ACCESS_COOKIE);
  }
  // Always read from cookie — keeps client and middleware in sync after token rotation.
  return getClientCookie(ACCESS_COOKIE);
}

async function getRefreshToken(): Promise<string | null> {
  if (typeof window === "undefined") {
    return readServerCookie(REFRESH_COOKIE);
  }
  // Always read from cookie — middleware rotates refresh tokens into cookies,
  // so localStorage would hold a stale (blacklisted) token after rotation.
  return getClientCookie(REFRESH_COOKIE);
}

export function setAuthTokens(tokens: { access: string; refresh: string }) {
  if (typeof window === "undefined") return;
  // Cookies only — no localStorage. Middleware writes new tokens to cookies on
  // every rotation; reading localStorage would see the old blacklisted token.
  setClientCookie(ACCESS_COOKIE, tokens.access, 60 * 15);
  setClientCookie(REFRESH_COOKIE, tokens.refresh, 60 * 60 * 24 * 7);
}

export function clearAuthTokens() {
  clearClientCookie(ACCESS_COOKIE);
  clearClientCookie(REFRESH_COOKIE);
  clearClientCookie(ONBOARDING_COOKIE);
}

export function hasAuthSession() {
  if (typeof window === "undefined") return false;
  return Boolean(getClientCookie(REFRESH_COOKIE));
}

export function setOnboardingComplete(completed: boolean) {
  if (typeof window === "undefined") return;
  setClientCookie(ONBOARDING_COOKIE, completed ? "true" : "false", 60 * 60 * 24 * 7);
}

// Singleton refresh promise — prevents multiple concurrent 401s from each
// firing their own refresh, which would blacklist the rotating refresh token
// mid-flight and log the user out.
let _refreshPromise: Promise<string | null> | null = null;

async function doRefreshAccessToken(): Promise<string | null> {
  const refresh = await getRefreshToken();
  if (!refresh) return null;

  const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
    cache: "no-store",
  });

  if (!response.ok) {
    clearAuthTokens();
    return null;
  }

  const data = (await response.json()) as { access: string; refresh?: string };
  const nextRefresh = data.refresh ?? refresh;
  setAuthTokens({ access: data.access, refresh: nextRefresh });
  return data.access;
}

async function refreshAccessToken(): Promise<string | null> {
  if (_refreshPromise) return _refreshPromise;
  _refreshPromise = doRefreshAccessToken().finally(() => {
    _refreshPromise = null;
  });
  return _refreshPromise;
}

async function rawApiRequest<T>(path: string, options: RequestOptions = {}, accessToken?: string | null): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError(
      "NEXT_PUBLIC_API_BASE_URL is not set. Configure it in frontend .env.local.",
      500,
      null
    );
  }

  const { body, headers, ...rest } = options;
  const isFormData = body instanceof FormData;
  const requestHeaders = new Headers(headers);

  if (!isFormData && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }
  if (accessToken) {
    requestHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
    body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    throw new ApiError(`API request failed with status ${response.status}`, response.status, data);
  }

  return data as T;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const access = await getAccessToken();
  try {
    return await rawApiRequest<T>(path, options, access);
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) {
      throw error;
    }
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      // Refresh failed — session is dead. Redirect to login.
      if (typeof window !== "undefined") {
        window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
      }
      throw error;
    }
    return rawApiRequest<T>(path, options, refreshed);
  }
}

export async function loginWithPassword(username: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    cache: "no-store",
  });
  const data = (await response.json()) as { access?: string; refresh?: string; detail?: string };
  if (!response.ok || !data.access || !data.refresh) {
    throw new ApiError(data.detail ?? "Invalid credentials.", response.status, data);
  }
  setAuthTokens({ access: data.access, refresh: data.refresh });
}

export async function getOnboardingStatus() {
  return apiRequest<{ onboarding_complete: boolean }>("/auth/onboarding-status/");
}

export async function registerWithPassword(username: string, email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
    cache: "no-store",
  });
  const data = (await response.json()) as {
    access?: string;
    refresh?: string;
    onboarding_complete?: boolean;
    detail?: string;
    [key: string]: unknown;
  };
  if (!response.ok || !data.access || !data.refresh) {
    throw new ApiError(
      typeof data.detail === "string" ? data.detail : "Unable to register account.",
      response.status,
      data
    );
  }
  setAuthTokens({ access: data.access, refresh: data.refresh });
  setOnboardingComplete(Boolean(data.onboarding_complete));
}
