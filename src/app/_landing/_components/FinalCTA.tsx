"use client";

import { ArrowRight, CalendarDays } from "lucide-react";
import { GridBackdrop, MagneticButton, Orb, Reveal } from "./primitives";

export function FinalCTA() {
  return (
    <section id="start-free" className="relative bg-canvas px-4 pb-20 pt-8 sm:px-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-stage px-6 py-20 text-center text-white sm:rounded-[2.5rem] sm:px-12 sm:py-28">
        {/* Animated orb field */}
        <div aria-hidden className="absolute inset-0">
          <GridBackdrop tone="dark" />
          <Orb className="left-[12%] top-[-24%] h-[30rem] w-[30rem] opacity-40" color="#2F6BFF" />
          <Orb
            className="right-[6%] top-[10%] h-[26rem] w-[26rem] opacity-30"
            color="#7C5CFF"
            style={{ animationDelay: "-5s" }}
          />
          <Orb
            className="bottom-[-30%] left-[calc(50%-14rem)] h-[28rem] w-[28rem] opacity-25"
            color="#22C55E"
            style={{ animationDelay: "-11s" }}
          />
        </div>

        <div className="relative">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white/70 backdrop-blur">
              <span className="relative flex h-1.5 w-1.5" aria-hidden>
                <span className="absolute inline-flex h-full w-full rounded-full bg-success-500 opacity-70 motion-safe:animate-ring-pulse" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success-500" />
              </span>
              Your next opportunity may already be live.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="mx-auto mt-7 max-w-2xl text-balance text-[clamp(2.25rem,6vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
              Stop searching.
              <br />
              <span className="bg-[linear-gradient(100deg,#90B8FF,#C4B5FD,#7DE3A8,#90B8FF)] bg-[length:230%_100%] bg-clip-text text-transparent motion-safe:animate-gradient-x">
                Start winning.
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="mx-auto mt-5 max-w-md text-pretty text-base text-white/55 sm:text-lg">
              Let AI find the tenders that fit your business.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <MagneticButton
                href="/register"
                variant="onDark"
                icon={<ArrowRight className="h-4 w-4" aria-hidden />}
              >
                Start free
              </MagneticButton>
              <MagneticButton
                href="/contact"
                variant="onDark"
                slideIcon={false}
                className="bg-white/[0.06] text-white ring-1 ring-inset ring-white/15 shadow-none hover:bg-white/[0.12]"
                icon={<CalendarDays className="h-4 w-4" aria-hidden />}
              >
                Book a Demo
              </MagneticButton>
            </div>
          </Reveal>

          <Reveal delay={0.26}>
            <p className="mt-6 text-sm text-white/40">No credit card required.</p>
            <p className="mt-1 text-sm text-white/30">
              Built with ❤️ in India, for Indian businesses competing in government tenders.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
