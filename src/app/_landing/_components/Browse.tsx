"use client";

import Link from "next/link";
import { ArrowRight, Layers3, MapPin, Tags } from "lucide-react";
import { BROWSE_GROUPS } from "../_data/content";
import { GradientText, Reveal, SectionLabel } from "./primitives";

const ICONS = {
  state: MapPin,
  category: Tags,
  sector: Layers3,
} as const;

/**
 * Public browse directories. Every chip is a deep link into the tender
 * dashboard with the filter pre-applied, so a signed-in visitor lands on
 * results rather than on an empty search.
 */
export function Browse() {
  return (
    <section id="browse" className="relative bg-canvas py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <SectionLabel>Browse the directory</SectionLabel>
          <h2 className="mt-4 text-balance text-[clamp(1.75rem,4.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-ink-900">
            Or just start looking. <GradientText>Filters already applied.</GradientText>
          </h2>
          <p className="mt-4 max-w-xl text-pretty text-sm text-ink-500 sm:text-base">
            Every state, category and sector we track has its own page — and each one opens the
            dashboard with that filter already set.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-3 lg:grid-cols-3">
          {BROWSE_GROUPS.map((group, index) => {
            const Icon = ICONS[group.key];
            return (
              <Reveal key={group.key} i={index} className="h-full">
                <article className="group flex h-full flex-col rounded-3xl border border-ink-900/8 bg-white/80 p-5 shadow-card backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-elec-500/25 hover:shadow-lift-lg">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-elec-500/20 bg-elec-50 text-elec-600">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="rounded-full border border-ink-900/8 bg-canvas-soft px-2.5 py-1 text-2xs font-semibold text-ink-500">
                      {group.cta}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-semibold tracking-tight text-ink-900">
                    {group.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-500">{group.body}</p>

                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {group.popular.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className="inline-flex rounded-full border border-ink-900/8 bg-white px-2.5 py-1 text-2xs font-medium text-ink-600 transition-colors hover:border-elec-500/30 hover:bg-elec-50 hover:text-elec-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elec-500"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={group.href}
                    className="mt-5 inline-flex items-center gap-1.5 self-start rounded-lg text-xs font-semibold text-elec-600 transition-colors hover:text-elec-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elec-500"
                  >
                    {group.title}
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden
                    />
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
