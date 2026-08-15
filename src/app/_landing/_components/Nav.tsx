"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { BROWSE_LINKS, NAV_LINKS } from "../_data/content";
import { MagneticButton } from "./primitives";

function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elec-500",
        className
      )}
      aria-label="tenderkhoj home"
    >
      <span className="relative flex h-7 w-7 items-center justify-center rounded-[0.5rem] bg-stage text-white">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
          <circle cx="10.5" cy="10.5" r="6" stroke="currentColor" strokeWidth="2" />
          <path d="m15.5 15.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M8 10.5h5M10.5 8v5" stroke="#5C91FF" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      <span className="text-[0.95rem] font-semibold tracking-tight text-ink-900">tenderkhoj</span>
    </Link>
  );
}

/** Browse menu — the public state / category / sector directories. */
function BrowseMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <li ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="group relative inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elec-500"
      >
        Browse
        <ChevronDown
          className={cn("h-3.5 w-3.5 text-ink-400 transition-transform", open && "rotate-180")}
          aria-hidden
        />
        <span
          aria-hidden
          className="absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-elec-500 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 z-30 mt-1.5 w-60 animate-fade-in overflow-hidden rounded-2xl border border-ink-900/8 bg-white/95 p-1.5 shadow-dropdown backdrop-blur-xl"
        >
          {BROWSE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-canvas-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elec-500"
            >
              <span className="text-sm font-medium text-ink-800">{link.label}</span>
              <span className="text-2xs text-ink-400">{link.hint}</span>
            </Link>
          ))}
        </div>
      )}
    </li>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll behind the mobile sheet.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6 sm:pt-4">
      <nav
        aria-label="Primary"
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full px-4 py-2.5 transition-all duration-500 sm:px-5",
          scrolled
            ? "border border-ink-900/8 bg-white/70 shadow-lift backdrop-blur-xl saturate-150"
            : "border border-transparent bg-transparent"
        )}
      >
        <Wordmark />

        <ul className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group relative rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elec-500"
              >
                {link.label}
                <span
                  aria-hidden
                  className="absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-elec-500 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
              </Link>
            </li>
          ))}
          <BrowseMenu />
        </ul>

        <div className="flex items-center gap-1.5">
          <Link
            href="/login"
            className="hidden rounded-full px-3 py-2 text-[0.8125rem] font-medium text-ink-600 transition-colors hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elec-500 sm:inline-flex"
          >
            Sign in
          </Link>
          <MagneticButton
            href="/register"
            className="hidden px-5 py-2.5 text-[0.8125rem] sm:inline-flex"
            icon={<ArrowRight className="h-4 w-4" aria-hidden />}
          >
            Get Early Access
          </MagneticButton>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="lp-mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-900/10 bg-white/70 text-ink-700 backdrop-blur transition-colors hover:bg-white lg:hidden"
          >
            {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <div
        id="lp-mobile-nav"
        hidden={!open}
        className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl border border-ink-900/8 bg-white/95 p-2 shadow-lift backdrop-blur-xl lg:hidden"
      >
        <ul className="flex flex-col">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-ink-700 transition-colors hover:bg-canvas-soft"
              >
                {link.label}
              </Link>
            </li>
          ))}

          <li className="mt-1 border-t border-ink-900/8 pt-1">
            <p className="px-4 pb-1 pt-2 text-2xs font-semibold uppercase tracking-[0.18em] text-ink-400">
              Browse tenders
            </p>
            {BROWSE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-ink-700 transition-colors hover:bg-canvas-soft"
              >
                {link.label}
                <span className="text-2xs text-ink-400">{link.hint}</span>
              </Link>
            ))}
          </li>

          <li className="flex flex-col gap-2 border-t border-ink-900/8 p-2 pt-3">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center rounded-full border border-ink-900/12 px-5 py-3 text-sm font-semibold text-ink-800"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-full bg-stage px-5 py-3 text-sm font-semibold text-white"
            >
              Get Early Access
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
