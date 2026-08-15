"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BrandHomeLink } from "@/components/brand/BrandLogo";
import { cn } from "@/lib/utils";
import { BROWSE_LINKS } from "../_data/content";

/**
 * Header for the marketing subpages (the browse directories). The landing
 * page's floating nav is tied to its in-page hash sections, so subpages get
 * this solid variant instead — same wordmark, palette and CTAs.
 */
export function SiteHeader({
  active,
  showBrowse = true,
}: {
  active?: string;
  showBrowse?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors duration-300",
        scrolled ? "border-ink-900/8 bg-white/80 backdrop-blur-xl" : "border-transparent bg-canvas"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <BrandHomeLink wordmarkHeight={36} priority />

        {showBrowse && (
          <nav aria-label="Browse" className="hidden items-center gap-1 md:flex">
            {BROWSE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active === link.href ? "page" : undefined}
                className={cn(
                  "group relative rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elec-500",
                  active === link.href ? "text-ink-900" : "text-ink-600 hover:text-ink-900"
                )}
              >
                {link.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-3 -bottom-0.5 h-px origin-left bg-elec-500 transition-transform duration-300 ease-out",
                    active === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-1.5">
          <Link
            href="/login"
            className="rounded-full px-3 py-2 text-[0.8125rem] font-medium text-ink-600 transition-colors hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elec-500"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 rounded-full bg-stage px-5 py-2.5 text-[0.8125rem] font-semibold text-white shadow-lift transition-colors hover:bg-elec-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elec-500 focus-visible:ring-offset-2"
          >
            Start free
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </header>
  );
}

/** In-page back control for legal and company pages — not part of the navbar. */
export function PageBackLink({ href = "/", label = "Back" }: { href?: string; label?: string }) {
  return (
    <Link
      href={href}
      className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elec-500"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden />
      {label}
    </Link>
  );
}

/** Shared page header for the browse directories. */
export function SubpageHero({
  breadcrumb,
  title,
  subtitle,
  icon,
  children,
}: {
  breadcrumb: string;
  title: React.ReactNode;
  subtitle: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-ink-900/8 bg-canvas">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgb(15 23 42 / 0.045) 1px, transparent 1px), linear-gradient(90deg, rgb(15 23 42 / 0.045) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 70% 80% at 30% 0%, #000 20%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 30% 0%, #000 20%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 -top-40 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(47,107,255,0.16),transparent_68%)] blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-ink-400">
          <Link href="/" className="transition-colors hover:text-elec-600">
            Home
          </Link>
          <span aria-hidden>/</span>
          <span className="font-medium text-ink-700">{breadcrumb}</span>
        </nav>

        <div className="mt-5 flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-elec-500/20 bg-elec-50 text-elec-600">
            {icon}
          </span>
          <div className="min-w-0">
            <h1 className="text-balance text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-ink-900">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-pretty text-base text-ink-500 sm:text-lg">{subtitle}</p>
          </div>
        </div>

        {children}
      </div>
    </section>
  );
}

/** The shared "let AI do it instead" panel at the foot of each directory. */
export function BrowseCta({ title, body }: { title: string; body: string }) {
  return (
    <div className="relative mt-14 overflow-hidden rounded-3xl bg-stage px-6 py-12 text-center text-white sm:px-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 -top-24 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(47,107,255,0.55),transparent_66%)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 right-0 h-[20rem] w-[20rem] rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.45),transparent_66%)] blur-3xl"
      />
      <div className="relative">
        <h2 className="text-balance text-[clamp(1.35rem,3vw,2rem)] font-semibold tracking-[-0.03em]">
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base text-white/60">{body}</p>
        <Link
          href="/register"
          className="group mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-stage shadow-lift transition-colors hover:bg-elec-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-stage"
        >
          Start free
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden
          />
        </Link>
        <p className="mt-4 text-sm text-white/35">No credit card required.</p>
      </div>
    </div>
  );
}
