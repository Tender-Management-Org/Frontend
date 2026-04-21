import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/firm", "/onboarding", "/documents", "/tenders", "/recommendations"];
const AUTH_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get("tp_refresh_token")?.value);
  const onboardingComplete = request.cookies.get("tp_onboarding_complete")?.value === "true";

  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  const isOnboardingRoute = pathname === "/onboarding" || pathname.startsWith("/onboarding/");
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

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

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/firm/:path*", "/onboarding/:path*", "/documents/:path*", "/tenders/:path*", "/recommendations/:path*", "/login", "/register"],
};
