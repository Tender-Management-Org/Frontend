"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Icons (inline SVG to avoid extra deps) ───────────────────────────────────

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-6 h-6">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}
function IconBrain() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-6 h-6">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.14"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.14"/>
    </svg>
  );
}
function IconFile() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-6 h-6">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
  );
}
function IconPipeline() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-6 h-6">
      <rect x="3" y="3" width="5" height="5" rx="1"/><rect x="10" y="3" width="5" height="5" rx="1"/><rect x="17" y="3" width="4" height="5" rx="1"/>
      <path d="M5.5 8v3H12v-3"/><path d="M12 11v3"/><rect x="9" y="14" width="6" height="5" rx="1"/>
    </svg>
  );
}
function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}
function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}
function IconArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}
function IconMenu() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
    </svg>
  );
}
function IconClose() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: <IconSearch />,
    title: "Automated Tender Discovery",
    description:
      "Continuously monitors government procurement portals and imports newly published tenders. No manual searching, no repetitive portal visits — just fresh opportunities delivered automatically.",
    color: "bg-navy-50 text-navy-600",
  },
  {
    icon: <IconBrain />,
    title: "AI-Powered Recommendations",
    description:
      "Uses semantic AI and vector embeddings to match every tender against your firm's profile, producing a personalized Fit Score so you always know which opportunities are worth pursuing.",
    color: "bg-success-50 text-success-600",
  },
  {
    icon: <IconFile />,
    title: "Document Intelligence",
    description:
      "Automatically extracts eligibility criteria and required documents from tender files, then cross-references them against your firm's repository — so you know exactly what's ready and what's missing.",
    color: "bg-warning-50 text-warning-600",
  },
  {
    icon: <IconPipeline />,
    title: "Complete Tender Pipeline",
    description:
      "Track every opportunity from Matched → Interested → Applied → Won/Lost in a centralized pipeline. No more spreadsheets or missed deadlines.",
    color: "bg-navy-50 text-navy-600",
  },
];

const steps = [
  {
    number: "01",
    title: "Build Your Firm Profile",
    description:
      "Add your company details, past projects, financials, and preferred sectors. A richer profile means more accurate AI recommendations.",
  },
  {
    number: "02",
    title: "Get Matched Tenders Daily",
    description:
      "TenderKhoj automatically discovers new tenders and ranks them for your firm using a personalized Fit Score — no searching required.",
  },
  {
    number: "03",
    title: "Review, Decide & Bid",
    description:
      "See eligibility analysis, required documents, and deadlines all in one place. Mark tenders as Interested and track them through your pipeline.",
  },
];

const comparison = [
  { feature: "Automated tender discovery (no manual searching)", portal: false, tk: true },
  { feature: "AI-powered semantic matching", portal: false, tk: true },
  { feature: "Personalized recommendations per firm", portal: false, tk: true },
  { feature: "Automatic eligibility analysis", portal: false, tk: true },
  { feature: "Document readiness check", portal: false, tk: true },
  { feature: "Bid pipeline & lifecycle tracking", portal: false, tk: true },
  { feature: "Aggregates multiple portals", portal: false, tk: true },
];

const stats = [
  { value: "10,000+", label: "Tenders in database" },
  { value: "2", label: "Portals monitored" },
  { value: "24/7", label: "Automated monitoring" },
  { value: "100%", label: "AI-powered matching" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-ink-900">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b border-ink-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-600">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-4 h-4">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-ink-900">tenderkhoj</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 text-sm font-medium text-ink-600 md:flex">
            <a href="#features" className="hover:text-ink-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-ink-900 transition-colors">How it works</a>
            <a href="#comparison" className="hover:text-ink-900 transition-colors">Why TenderKhoj</a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="text-sm font-medium text-ink-600 hover:text-ink-900 transition-colors">
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-navy-600 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700 transition-colors"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-1 text-ink-600"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-ink-200 bg-white px-4 pb-4 pt-2 md:hidden">
            <nav className="flex flex-col gap-3 text-sm font-medium text-ink-700">
              <a href="#features" onClick={() => setMobileOpen(false)} className="py-1">Features</a>
              <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="py-1">How it works</a>
              <a href="#comparison" onClick={() => setMobileOpen(false)} className="py-1">Why TenderKhoj</a>
              <div className="mt-2 flex flex-col gap-2">
                <Link href="/login" className="rounded-lg border border-ink-200 px-4 py-2 text-center">Sign in</Link>
                <Link href="/register" className="rounded-lg bg-navy-600 px-4 py-2 text-center text-white font-semibold">
                  Get Started Free
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-white pt-16 pb-20 sm:pt-20 sm:pb-28">
        {/* Subtle background gradient */}
        <div className="pointer-events-none absolute inset-0 -top-40">
          <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-navy-50 opacity-60 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-navy-200 bg-navy-50 px-3 py-1.5 text-xs font-semibold text-navy-700">
            <span className="h-1.5 w-1.5 rounded-full bg-navy-500" />
            AI-Powered Tender Intelligence Platform
          </div>

          <h1 className="mb-5 text-4xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-5xl md:text-6xl">
            Stop searching for tenders.{" "}
            <span className="text-navy-600">Start winning them.</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-ink-500 sm:text-xl">
            TenderKhoj continuously discovers government procurement opportunities,
            matches them to your firm using AI, and tells you exactly what&apos;s needed to
            bid — so your team can focus on winning.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-lg bg-navy-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-navy-700 transition-colors"
            >
              Get Started Free <IconArrow />
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-6 py-3 text-base font-semibold text-ink-700 hover:bg-ink-50 transition-colors"
            >
              See how it works
            </a>
          </div>

          <p className="mt-4 text-sm text-ink-400">No credit card required · Free to get started</p>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-ink-200 bg-ink-50 py-10">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 sm:grid-cols-4 sm:px-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold text-navy-600">{s.value}</div>
              <div className="mt-1 text-sm text-ink-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Everything your team needs to win more contracts
            </h2>
            <p className="mt-3 text-lg text-ink-500">
              The right tenders, for the right firm, at the right time.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className={`mb-4 inline-flex rounded-xl p-2.5 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-ink-900">{f.title}</h3>
                <p className="text-sm leading-relaxed text-ink-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="bg-ink-50 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Up and running in minutes
            </h2>
            <p className="mt-3 text-lg text-ink-500">
              Three steps from signup to your first matched tender.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.number} className="relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-[calc(50%+2rem)] top-6 hidden h-0.5 w-[calc(100%-4rem)] bg-navy-200 sm:block" />
                )}
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-navy-600 text-sm font-bold text-white shadow-sm">
                    {step.number}
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-ink-900">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison ── */}
      <section id="comparison" className="py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Why not just use the government portal?
            </h2>
            <p className="mt-3 text-lg text-ink-500">
              Government portals show you tenders. TenderKhoj finds the right ones for you.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card">
            {/* Header */}
            <div className="grid grid-cols-3 border-b border-ink-200 bg-ink-50 px-6 py-4 text-sm font-semibold text-ink-600">
              <div className="col-span-1">Feature</div>
              <div className="text-center">Govt. Portal</div>
              <div className="text-center text-navy-600">tenderkhoj</div>
            </div>

            {comparison.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 items-center px-6 py-4 text-sm ${i % 2 === 1 ? "bg-ink-50/50" : ""}`}
              >
                <div className="text-ink-700">{row.feature}</div>
                <div className="flex justify-center">
                  {row.portal ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success-50 text-success-600">
                      <IconCheck />
                    </span>
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-danger-50 text-danger-600">
                      <IconX />
                    </span>
                  )}
                </div>
                <div className="flex justify-center">
                  {row.tk ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success-50 text-success-600">
                      <IconCheck />
                    </span>
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-danger-50 text-danger-600">
                      <IconX />
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Footer row */}
            <div className="border-t border-ink-200 bg-navy-50 px-6 py-4">
              <div className="grid grid-cols-3 items-center text-sm font-medium">
                <div className="text-ink-700">Bottom line</div>
                <div className="text-center text-ink-500">Manual, generic</div>
                <div className="text-center font-semibold text-navy-700">AI-driven, personalized</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Semantic search callout ── */}
      <section className="bg-navy-950 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-navy-800 px-3 py-1.5 text-xs font-semibold text-navy-300">
            Semantic Search
          </div>
          <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
            Search in plain English
          </h2>
          <div className="mx-auto mb-6 max-w-lg rounded-xl border border-navy-700 bg-navy-900 px-5 py-4 text-left">
            <p className="text-sm text-navy-400 mb-1">Example query</p>
            <p className="text-base italic text-white">
              &ldquo;Road construction tenders in Rajasthan above ₹50 lakh&rdquo;
            </p>
          </div>
          <p className="text-navy-300">
            TenderKhoj understands the intent behind your search and returns
            semantically ranked results — not just exact keyword matches.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Ready to find your next contract?
          </h2>
          <p className="mt-4 text-lg text-ink-500">
            Join firms that are already using TenderKhoj to discover and win
            more government tenders.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-lg bg-navy-600 px-7 py-3 text-base font-semibold text-white shadow-sm hover:bg-navy-700 transition-colors"
            >
              Get Started Free <IconArrow />
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-ink-200 px-7 py-3 text-base font-semibold text-ink-700 hover:bg-ink-50 transition-colors"
            >
              Contact us
            </Link>
          </div>
          <p className="mt-4 text-sm text-ink-400">No credit card required</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-ink-200 bg-ink-950">
        <div className="mx-auto max-w-6xl px-4 pt-14 pb-8 sm:px-6">

          {/* Top row — logo + columns */}
          <div className="grid gap-10 sm:grid-cols-4">

            {/* Brand */}
            <div className="sm:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-600">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-4 h-4">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
                <span className="font-bold text-white text-lg">tenderkhoj</span>
              </div>
              <p className="text-sm text-ink-400 leading-relaxed">
                AI-powered tender intelligence for businesses that want to win more government contracts.
              </p>
            </div>

            {/* Platform links */}
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-ink-500">Platform</h4>
              <ul className="space-y-2.5 text-sm text-ink-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it works</a></li>
                <li><a href="#comparison" className="hover:text-white transition-colors">Why TenderKhoj</a></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Get Started Free</Link></li>
              </ul>
            </div>

            {/* Company links */}
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-ink-500">Company</h4>
              <ul className="space-y-2.5 text-sm text-ink-400">
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
              </ul>
            </div>

            {/* Legal links */}
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-ink-500">Legal</h4>
              <ul className="space-y-2.5 text-sm text-ink-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 border-t border-ink-800 pt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-xs text-ink-500">
              © {new Date().getFullYear()} TenderKhoj. All rights reserved.
            </p>
            <p className="text-xs text-ink-600">
              The right tenders, for the right firm, at the right time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
