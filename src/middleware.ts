import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/firm", "/onboarding", "/tenders", "/interested", "/recommendations"];
const AUTH_ROUTES = ["/login", "/register"];

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");

// Decode JWT payload without verifying signature — only used to check expiry.
function jwtExpiry(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return typeof decoded.exp === "number" ? decoded.exp : null;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const exp = jwtExpiry(token);
  if (exp === null) return true;
  // Add 30s buffer so we refresh slightly before actual expiry.
  return Date.now() / 1000 >= exp - 30;
}

async function refreshTokens(refreshToken: string): Promise<{ access: string; refresh: string } | null> {
  if (!API_BASE_URL) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { access?: string; refresh?: string };
    if (!data.access) return null;
    return { access: data.access, refresh: data.refresh ?? refreshToken };
  } catch {
    return null;
  }
}

function setTokenCookies(
  response: NextResponse,
  access: string,
  refresh: string,
) {
  response.cookies.set("tp_access_token", access, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15, // 15 min — matches JWT lifetime
  });
  response.cookies.set("tp_refresh_token", refresh, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("tp_access_token")?.value;
  const refreshToken = request.cookies.get("tp_refresh_token")?.value;
  const onboardingComplete = request.cookies.get("tp_onboarding_complete")?.value === "true";

  const hasSession = Boolean(refreshToken);
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  const isOnboardingRoute = pathname === "/onboarding" || pathname.startsWith("/onboarding/");
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // No session at all → redirect to login
  if (isProtectedRoute && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL(onboardingComplete ? "/dashboard" : "/onboarding", request.url));
  }

  if (hasSession && !onboardingComplete && isProtectedRoute && !isOnboardingRoute) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  if (hasSession && onboardingComplete && isOnboardingRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Access token missing or expired → try to refresh before hitting server component
  if (isProtectedRoute && refreshToken && (!accessToken || isTokenExpired(accessToken))) {
    const tokens = await refreshTokens(refreshToken);

    if (!tokens) {
      // Refresh failed — session dead, redirect to login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("tp_access_token");
      response.cookies.delete("tp_refresh_token");
      response.cookies.delete("tp_onboarding_complete");
      return response;
    }

    // Refresh succeeded — forward new access token to server components via request
    // and set new cookies on the response so the browser stores them.
    const requestWithToken = NextResponse.next({
      request: {
        headers: new Headers(request.headers),
      },
    });
    requestWithToken.cookies.set("tp_access_token", tokens.access);
    setTokenCookies(requestWithToken, tokens.access, tokens.refresh);
    return requestWithToken;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/firm/:path*", "/onboarding/:path*", "/tenders/:path*", "/interested/:path*", "/recommendations/:path*", "/login", "/register"],
};
