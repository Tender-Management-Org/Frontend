"use client";

import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Globe,
  Search,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FEATURES } from "../_data/content";
import { GradientText, Reveal, SectionLabel } from "./primitives";

/* ── Card shell ───────────────────────────────────────────────────────────── */

function BentoCard({
  title,
  body,
  span,
  children,
  index,
}: {
  title: string;
  body: string;
  span: string;
  children: React.ReactNode;
  index: number;
}) {
  return (
    <Reveal i={index} className={cn("min-w-0", span)}>
      <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink-900/8 bg-white/80 p-5 shadow-card backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-elec-500/25 hover:shadow-lift-lg">
        {/* Hover wash */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(47,107,255,0.07),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        <div className="relative">
          <h3 className="text-base font-semibold tracking-tight text-ink-900">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">{body}</p>
        </div>
        <div className="relative mt-4 flex-1">{children}</div>
      </article>
    </Reveal>
  );
}

/* ── Per-feature visuals ──────────────────────────────────────────────────── */

function DiscoveryVisual() {
  const portals = ["Rajasthan e-Proc", "GeM", "CPPP"];
  return (
    <div className="flex h-full items-center gap-3">
      <ul className="space-y-1.5">
        {portals.map((portal) => (
          <li
            key={portal}
            className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/8 bg-canvas-soft px-2 py-1 text-[0.5625rem] font-medium text-ink-500"
          >
            <Globe className="h-2.5 w-2.5 text-ink-400" aria-hidden />
            {portal}
          </li>
        ))}
      </ul>

      <svg viewBox="0 0 60 60" className="h-16 w-14 shrink-0 text-elec-400" fill="none" aria-hidden>
        {[10, 30, 50].map((y) => (
          <path
            key={y}
            d={`M0 ${y} C 24 ${y}, 30 30, 58 30`}
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            className="motion-safe:animate-dash"
          />
        ))}
        <circle cx="58" cy="30" r="2.5" fill="currentColor" />
      </svg>

      <ul className="flex-1 space-y-1.5">
        {[0, 1, 2, 3].map((i) => (
          <li
            key={i}
            className="flex items-center gap-2 rounded-lg border border-ink-900/6 bg-white px-2 py-1.5 shadow-card transition-transform duration-500"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <span className="h-1 w-1 rounded-full bg-elec-500" aria-hidden />
            <span className="h-1 flex-1 rounded-full bg-ink-100" aria-hidden />
            <span className="h-1 w-4 rounded-full bg-success-500/50" aria-hidden />
          </li>
        ))}
      </ul>
    </div>
  );
}

function FitVisual() {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex h-full items-center justify-center">
      <div className="relative">
        <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90" aria-hidden>
          <circle cx="36" cy="36" r={r} fill="none" stroke="#E9EBF2" strokeWidth="7" />
          <circle
            cx="36"
            cy="36"
            r={r}
            fill="none"
            stroke="url(#bento-fit)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * 0.4}
            className="transition-[stroke-dashoffset] duration-700 ease-out group-hover:[stroke-dashoffset:3px]"
          />
          <defs>
            <linearGradient id="bento-fit" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2F6BFF" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold tabular-nums text-ink-900">
          94
        </span>
      </div>
    </div>
  );
}

function DocVisual() {
  return (
    <div className="relative h-full min-h-[4.5rem] overflow-hidden rounded-xl border border-ink-900/8 bg-white p-2.5">
      <div className="flex items-center gap-1.5 pb-1.5">
        <FileText className="h-2.5 w-2.5 text-danger-500" aria-hidden />
        <span className="text-[0.5rem] text-ink-400">NIT · 146 pages</span>
      </div>
      <div className="space-y-1" aria-hidden>
        {[100, 82, 94, 68, 88, 76].map((w, i) => (
          <div
            key={i}
            className={cn(
              "h-1 rounded-full transition-colors duration-500",
              i === 1 || i === 3 ? "bg-elec-200 group-hover:bg-elec-400" : "bg-ink-100"
            )}
            style={{ width: `${w}%`, transitionDelay: `${i * 60}ms` }}
          />
        ))}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-[linear-gradient(180deg,transparent,rgba(47,107,255,0.16),transparent)] motion-safe:animate-scan-y"
        style={{ animationDuration: "3.6s" }}
      >
        <div className="h-px w-full bg-elec-400/80" />
      </div>
    </div>
  );
}

function EligibilityVisual() {
  const rows = [
    { label: "Turnover ≥ ₹90 Lakh", ok: true },
    { label: "Similar work experience", ok: true },
    { label: "Class AA registration", ok: true },
    { label: "Solvency certificate", ok: false },
  ];
  return (
    <ul className="space-y-1.5">
      {rows.map((row, i) => (
        <li
          key={row.label}
          className="flex items-center gap-2 rounded-lg border border-ink-900/6 bg-white px-2 py-1.5 text-[0.5625rem] transition-transform duration-500 group-hover:translate-x-0.5"
          style={{ transitionDelay: `${i * 55}ms` }}
        >
          {row.ok ? (
            <CheckCircle2 className="h-3 w-3 shrink-0 text-success-600" aria-hidden />
          ) : (
            <AlertTriangle className="h-3 w-3 shrink-0 text-warning-600" aria-hidden />
          )}
          <span className={row.ok ? "text-ink-600" : "text-warning-700"}>{row.label}</span>
        </li>
      ))}
    </ul>
  );
}

function DashboardVisual() {
  const tiles = [
    { label: "Recommended", value: "24", tone: "text-elec-600" },
    { label: "Closing", value: "7", tone: "text-warning-600" },
    { label: "Awaiting", value: "5", tone: "text-violet-600" },
    { label: "Won", value: "4", tone: "text-success-600" },
  ];
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {tiles.map((tile, i) => (
        <div
          key={tile.label}
          className="rounded-lg border border-ink-900/6 bg-white px-2 py-1.5 transition-transform duration-500 group-hover:-translate-y-0.5"
          style={{ transitionDelay: `${i * 50}ms` }}
        >
          <p className="text-[0.5rem] uppercase tracking-wider text-ink-400">{tile.label}</p>
          <p className={cn("text-sm font-semibold tabular-nums", tile.tone)}>{tile.value}</p>
        </div>
      ))}
    </div>
  );
}

function PipelineVisual() {
  const cols = ["Matched", "Interested", "Applied", "Won"];
  return (
    <div className="grid h-full grid-cols-4 gap-1.5">
      {cols.map((col, i) => (
        <div key={col} className="flex flex-col gap-1 rounded-lg bg-canvas-soft p-1.5">
          <span className="text-[0.4375rem] font-semibold uppercase tracking-wider text-ink-400">
            {col}
          </span>
          {Array.from({ length: 3 - i > 0 ? 3 - i : 1 }).map((_, j) => (
            <span
              key={j}
              className={cn(
                "h-2.5 rounded bg-white shadow-card transition-all duration-500",
                i === 3 && j === 0 && "bg-success-500/25 group-hover:bg-success-500/50"
              )}
              style={{ transitionDelay: `${(i * 3 + j) * 40}ms` }}
              aria-hidden
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function FirmVisual() {
  const fields = ["Industry", "Turnover", "Past projects", "Certifications"];
  return (
    <div className="flex h-full items-center gap-3">
      <div className="relative h-14 w-14 shrink-0">
        <svg viewBox="0 0 56 56" className="-rotate-90 h-14 w-14" aria-hidden>
          <circle cx="28" cy="28" r="22" fill="none" stroke="#E9EBF2" strokeWidth="5" />
          <circle
            cx="28"
            cy="28"
            r="22"
            fill="none"
            stroke="#2F6BFF"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 22}
            strokeDashoffset={2 * Math.PI * 22 * 0.22}
            className="transition-[stroke-dashoffset] duration-700 group-hover:[stroke-dashoffset:0]"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[0.625rem] font-bold text-ink-800">
          78%
        </span>
      </div>
      <ul className="flex-1 space-y-1">
        {fields.map((field, i) => (
          <li
            key={field}
            className="flex items-center justify-between rounded-md bg-canvas-soft px-2 py-1 text-[0.5rem] text-ink-500 transition-transform duration-500 group-hover:translate-x-0.5"
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            {field}
            <CheckCircle2 className={cn("h-2.5 w-2.5", i < 3 ? "text-success-600" : "text-ink-300")} aria-hidden />
          </li>
        ))}
      </ul>
    </div>
  );
}

function SearchVisual() {
  return (
    <div className="flex h-full flex-col justify-center gap-2 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center gap-2 rounded-xl border border-elec-500/25 bg-white px-3 py-2 shadow-card">
        <Search className="h-3 w-3 shrink-0 text-elec-500" aria-hidden />
        <span className="truncate text-[0.625rem] text-ink-600">
          Solar rooftop projects in Rajasthan under ₹1 Cr
        </span>
        <span className="ml-auto hidden h-3 w-px bg-elec-400 motion-safe:animate-caret sm:block" aria-hidden />
      </div>
      <ul className="flex flex-1 gap-1.5">
        {[94, 88, 81].map((fit, i) => (
          <li
            key={fit}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-ink-900/6 bg-white px-2 py-2 text-[0.5625rem] font-bold text-ink-700 shadow-card transition-transform duration-500 group-hover:-translate-y-0.5"
            style={{ transitionDelay: `${i * 70}ms` }}
          >
            <Sparkles className="h-2.5 w-2.5 text-elec-500" aria-hidden />
            {fit}
          </li>
        ))}
      </ul>
    </div>
  );
}

const VISUALS: Record<string, { node: React.ReactNode; span: string }> = {
  discovery: { node: <DiscoveryVisual />, span: "lg:col-span-4" },
  fit: { node: <FitVisual />, span: "lg:col-span-2" },
  docs: { node: <DocVisual />, span: "lg:col-span-2" },
  eligibility: { node: <EligibilityVisual />, span: "lg:col-span-2" },
  dashboard: { node: <DashboardVisual />, span: "lg:col-span-2" },
  pipeline: { node: <PipelineVisual />, span: "lg:col-span-3" },
  firm: { node: <FirmVisual />, span: "lg:col-span-3" },
  search: { node: <SearchVisual />, span: "lg:col-span-6" },
};

/* ── Section ──────────────────────────────────────────────────────────────── */

export function Bento() {
  return (
    <section id="features" className="relative bg-canvas py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <SectionLabel>Features</SectionLabel>
          <h2 className="mt-4 text-balance text-[clamp(1.9rem,4.4vw,3.25rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-ink-900">
            Everything your <GradientText>tender team needs.</GradientText>
          </h2>
        </Reveal>

        <div className="mt-12 grid auto-rows-[minmax(11rem,auto)] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {FEATURES.map((feature, index) => (
            <BentoCard
              key={feature.key}
              title={feature.title}
              body={feature.body}
              span={VISUALS[feature.key].span}
              index={index}
            >
              {VISUALS[feature.key].node}
            </BentoCard>
          ))}
        </div>
      </div>
    </section>
  );
}
