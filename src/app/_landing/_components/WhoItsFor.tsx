"use client";

import { AUDIENCES } from "../_data/content";
import { GradientText, Reveal, SectionLabel } from "./primitives";

/* ── Animated, industry-specific line art (no stock imagery) ──────────────── */

function CivilIcon() {
  return (
    <svg viewBox="0 0 64 48" className="h-full w-full" fill="none" aria-hidden>
      {/* road */}
      <path d="M4 44 L26 8 M60 44 L38 8" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M32 44 L32 8"
        stroke="#2F6BFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="5 6"
        className="motion-safe:animate-dash"
      />
      <rect x="8" y="6" width="10" height="8" rx="1.5" stroke="#94A3B8" strokeWidth="1.5" />
      <rect x="46" y="10" width="12" height="6" rx="1.5" stroke="#94A3B8" strokeWidth="1.5" />
    </svg>
  );
}

function InfraIcon() {
  return (
    <svg viewBox="0 0 64 48" className="h-full w-full" fill="none" aria-hidden>
      <path d="M4 40 h56" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      {[10, 24, 38, 52].map((x, i) => (
        <rect
          key={x}
          x={x}
          y={34 - i * 6}
          width="8"
          height={6 + i * 6}
          rx="1.5"
          fill={i === 3 ? "#2F6BFF" : "#E2E8F0"}
          className="origin-bottom transition-transform duration-500 group-hover:scale-y-110"
          style={{ transitionDelay: `${i * 70}ms` }}
        />
      ))}
      <path d="M8 12 q24 -8 48 0" stroke="#7C5CFF" strokeWidth="1.5" strokeDasharray="4 5" className="motion-safe:animate-dash" />
    </svg>
  );
}

function ItIcon() {
  return (
    <svg viewBox="0 0 64 48" className="h-full w-full" fill="none" aria-hidden>
      <rect x="6" y="8" width="52" height="30" rx="3" stroke="#CBD5E1" strokeWidth="2" />
      <path d="M24 42 h16" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      {[16, 22, 28].map((y, i) => (
        <path
          key={y}
          d={`M13 ${y} h${16 + i * 8}`}
          stroke={i === 1 ? "#2F6BFF" : "#E2E8F0"}
          strokeWidth="2.5"
          strokeLinecap="round"
          className="transition-all duration-500 group-hover:opacity-100"
          style={{ transitionDelay: `${i * 70}ms` }}
        />
      ))}
      <circle cx="49" cy="16" r="2.5" fill="#22C55E" className="motion-safe:animate-float-y" />
    </svg>
  );
}

function SupplyIcon() {
  return (
    <svg viewBox="0 0 64 48" className="h-full w-full" fill="none" aria-hidden>
      <path d="M32 6 L52 15 L52 33 L32 42 L12 33 L12 15 Z" stroke="#CBD5E1" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 15 L32 24 L52 15 M32 24 L32 42" stroke="#E2E8F0" strokeWidth="1.5" />
      <path
        d="M32 6 L52 15 L32 24 L12 15 Z"
        fill="#2F6BFF"
        fillOpacity="0.12"
        stroke="#2F6BFF"
        strokeWidth="1.5"
        className="transition-transform duration-500 group-hover:-translate-y-1"
      />
    </svg>
  );
}

const ICONS: Record<string, React.ReactNode> = {
  civil: <CivilIcon />,
  infra: <InfraIcon />,
  it: <ItIcon />,
  supply: <SupplyIcon />,
};

export function WhoItsFor() {
  return (
    <section id="for-businesses" className="relative bg-canvas py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <SectionLabel>Who it&rsquo;s for</SectionLabel>
          <h2 className="mt-4 text-balance text-[clamp(1.9rem,4.4vw,3.25rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-ink-900">
            Built for businesses that compete for{" "}
            <GradientText>government contracts.</GradientText>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCES.map((audience, index) => (
            <Reveal key={audience.key} i={index} className="h-full">
              <article className="group flex h-full flex-col rounded-3xl border border-ink-900/8 bg-white/80 p-5 shadow-card backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-elec-500/25 hover:shadow-lift-lg">
                <div className="h-16 w-full">{ICONS[audience.key]}</div>
                <h3 className="mt-5 text-sm font-semibold tracking-tight text-ink-900">
                  {audience.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-500">{audience.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-8 text-center text-sm text-ink-400">
            Whether you&rsquo;re tracking 10 opportunities or thousands, tenderkhoj helps your team find
            the ones that matter.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
