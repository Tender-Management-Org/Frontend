"use client";

import { Compass, Gauge, Target } from "lucide-react";
import { VALUE_CARDS } from "../_data/content";
import { GridBackdrop, Orb, Reveal, SectionLabel } from "./primitives";

const ICONS = [Compass, Gauge, Target];

export function Outcome() {
  return (
    <section className="relative overflow-hidden bg-stage py-28 text-white sm:py-36">
      <div aria-hidden className="absolute inset-0">
        <GridBackdrop tone="dark" animated />
        <Orb className="left-[10%] top-[-10%] h-[38rem] w-[38rem] opacity-25" color="#2F6BFF" />
        <Orb
          className="right-[-6%] bottom-[-14%] h-[34rem] w-[34rem] opacity-20"
          color="#7C5CFF"
          style={{ animationDelay: "-8s" }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-5 text-center">
        <Reveal>
          <SectionLabel tone="dark">The outcome</SectionLabel>
          <h2 className="mx-auto mt-5 max-w-3xl text-balance text-[clamp(2rem,5.2vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.045em]">
            Spend less time finding opportunities.
            <br className="hidden sm:block" />{" "}
            <span className="bg-[linear-gradient(100deg,#90B8FF,#C4B5FD,#90B8FF)] bg-[length:220%_100%] bg-clip-text text-transparent motion-safe:animate-gradient-x">
              Spend more time winning them.
            </span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-3 text-left sm:grid-cols-3">
          {VALUE_CARDS.map((card, index) => {
            const Icon = ICONS[index];
            return (
              <Reveal key={card.title} i={index} className="h-full">
                <article className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(92,145,255,0.16),transparent_62%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.06] text-elec-300">
                    <Icon className="h-4.5 w-4.5" aria-hidden />
                  </span>
                  <h3 className="relative mt-5 text-xl font-semibold tracking-tight">{card.title}</h3>
                  <p className="relative mt-2 text-base leading-relaxed text-white/55">{card.body}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
