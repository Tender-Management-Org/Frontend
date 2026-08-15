"use client";

import { useEffect, useRef, useState } from "react";
import { cubicBezier, motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { FIT_BREAKDOWN, HERO_TENDERS, PROFILE_SIGNALS } from "../_data/content";
import { FitRing, GradientText, SectionLabel, useCalmMotion } from "./primitives";
import { TenderCardUI } from "./TenderUI";

const EASE = cubicBezier(0.16, 1, 0.3, 1);
/* The signals are scroll-scrubbed, so their travel needs a near-linear curve —
   an ease-out sends them to the core in the first few pixels of scroll and they
   spend the rest of the beat piled up in the middle. */
const TRAVEL = cubicBezier(0.45, 0, 0.55, 1);
const GENERIC = [
  "Road works package — Jaipur",
  "Hospital linen procurement",
  "Fibre optic laying — Kota",
  "Stationery rate contract",
];

/* ── Copy stages ──────────────────────────────────────────────────────────── */

const STAGES = [
  {
    title: (
      <>
        Not every tender is <span className="text-ink-400">your</span> tender.
      </>
    ),
    body: "Two firms can see the same 3,000 opportunities and have completely different shortlists. Relevance is specific to your firm — not to a keyword.",
  },
  {
    title: (
      <>
        AI understands <GradientText>your business.</GradientText>
      </>
    ),
    body: "Your industry, sector, scope of work, locations, financial profile, past projects and capabilities all feed a single working model of your firm.",
  },
  {
    title: (
      <>
        Then it scores <GradientText>every opportunity.</GradientText>
      </>
    ),
    body: "Instead of relying only on keywords, tenderkhoj uses semantic AI to understand your firm and rank tenders based on actual relevance. Every recommendation receives a personalized Fit Score from 0–100.",
  },
];

/* ── Shared geometry + timing, so the chips and their connector lines agree ── */

function signalGeometry(index: number, total: number, radius: number) {
  const t = total === 1 ? 0.5 : index / (total - 1);
  const angle = Math.PI * (0.53 + t * 0.94); // 95° → 264°, a generous left arc
  // Alternating radii keep neighbouring labels from colliding near the poles.
  const r = radius * (index % 2 === 0 ? 1 : 0.82);
  return {
    x: Math.cos(angle) * r,
    y: Math.sin(angle) * r,
    enter: 0.29 + index * 0.021,
    arrive: 0.5 + index * 0.023,
  };
}

/* ── A profile signal travelling into the AI core ─────────────────────────── */

function SignalNode({
  progress,
  label,
  index,
  total,
  radius,
}: {
  progress: MotionValue<number>;
  label: string;
  index: number;
  total: number;
  radius: number;
}) {
  const { x: startX, y: startY, enter, arrive } = signalGeometry(index, total, radius);

  const opacity = useTransform(progress, [enter, enter + 0.028, arrive - 0.03, arrive + 0.022], [0, 1, 1, 0], {
    clamp: true,
  });
  const x = useTransform(progress, [enter, arrive], [startX, 0], { clamp: true, ease: TRAVEL });
  const y = useTransform(progress, [enter, arrive], [startY, 0], { clamp: true, ease: TRAVEL });
  const scale = useTransform(progress, [enter, enter + 0.03, arrive], [0.8, 1, 0.45], { clamp: true });

  // The centring translate stays on the wrapper — Framer owns `transform` below.
  return (
    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <motion.span
        style={{ x, y, opacity, scale }}
        className="block whitespace-nowrap rounded-full border border-elec-500/25 bg-white px-3 py-1.5 text-2xs font-semibold text-elec-700 shadow-card will-change-transform"
      >
        {label}
      </motion.span>
    </span>
  );
}

/** The line the core reaches out along to pull a signal in. */
function SignalLine({
  progress,
  index,
  total,
  radius,
  size,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  radius: number;
  size: number;
}) {
  const { x, y, enter, arrive } = signalGeometry(index, total, radius);
  const c = size / 2;
  const length = Math.hypot(x, y);

  // Draws outward from the core, then retracts as the signal is absorbed.
  const dashOffset = useTransform(progress, [enter - 0.02, enter + 0.05], [length, 0], {
    clamp: true,
    ease: EASE,
  });
  const opacity = useTransform(progress, [enter - 0.02, enter + 0.04, arrive - 0.02, arrive], [0, 1, 1, 0], {
    clamp: true,
  });

  return (
    <motion.line
      x1={c}
      y1={c}
      x2={c + x}
      y2={c + y}
      stroke="url(#fit-line)"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeDasharray={length}
      style={{ strokeDashoffset: dashOffset, opacity }}
    />
  );
}

/** Ripple emitted by the core as signals land. */
function CorePulse({ progress, at }: { progress: MotionValue<number>; at: number }) {
  const scale = useTransform(progress, [at, at + 0.09], [0.55, 2.1], { clamp: true, ease: EASE });
  const opacity = useTransform(progress, [at, at + 0.02, at + 0.09], [0, 0.5, 0], { clamp: true });
  return (
    <motion.span
      aria-hidden
      style={{ scale, opacity }}
      className="absolute inset-0 rounded-[1.75rem] border border-elec-500/60"
    />
  );
}

function BreakdownBar({
  progress,
  label,
  value,
  index,
}: {
  progress: MotionValue<number>;
  label: string;
  value: number;
  index: number;
}) {
  const start = 0.82 + index * 0.028;
  const end = start + 0.07;
  const scaleX = useTransform(progress, [start, end], [0, value / 100], { clamp: true, ease: EASE });
  const opacity = useTransform(progress, [start - 0.03, start + 0.03], [0, 1], { clamp: true });

  return (
    <motion.div style={{ opacity }} className="space-y-1">
      <div className="flex items-baseline justify-between text-2xs">
        <span className="font-medium text-ink-500">{label}</span>
        <span className="font-bold tabular-nums text-ink-800">{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-ink-100">
        <motion.div
          style={{ scaleX }}
          className="h-full origin-left rounded-full bg-[linear-gradient(90deg,#2F6BFF,#7C5CFF)]"
        />
      </div>
    </motion.div>
  );
}

/** One row of the undifferentiated keyword list shown before the AI stages. */
function GenericRow({ progress, title, index }: { progress: MotionValue<number>; title: string; index: number }) {
  const opacity = useTransform(progress, [0.19, 0.25 - index * 0.012], [1, 0], { clamp: true });
  const x = useTransform(progress, [0.19, 0.26], [0, -14 - index * 5], { clamp: true, ease: EASE });
  return (
    <motion.div
      style={{ opacity, x }}
      className="flex items-center gap-2.5 rounded-xl border border-ink-900/8 bg-white/75 px-3 py-2.5 backdrop-blur"
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink-300" aria-hidden />
      <span className="min-w-0 flex-1 truncate text-xs text-ink-400">{title}</span>
      <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[0.5625rem] font-semibold text-ink-400">
        keyword
      </span>
    </motion.div>
  );
}

/* ── Section ──────────────────────────────────────────────────────────────── */

export function FitScore() {
  const calm = useCalmMotion();
  const ref = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  /* The visualisation is laid out in px, so it has to know its own size for the
     chips, the connector lines and the SVG viewBox to stay in register. */
  const [size, setSize] = useState(416);
  useEffect(() => {
    const el = boxRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => setSize(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const radius = size * 0.42;

  const tender = HERO_TENDERS[0];

  /* Copy stage windows — deliberately non-overlapping so text never doubles up. */
  const stage0 = useTransform(scrollYProgress, [0, 0.04, 0.22, 0.26], [1, 1, 1, 0]);
  const stage1 = useTransform(scrollYProgress, [0.28, 0.33, 0.58, 0.62], [0, 1, 1, 0]);
  const stage2 = useTransform(scrollYProgress, [0.64, 0.7, 1, 1], [0, 1, 1, 1]);
  const stageOpacities = [stage0, stage1, stage2];

  const stage0Y = useTransform(scrollYProgress, [0, 0.26], [0, -24]);
  const stage1Y = useTransform(scrollYProgress, [0.28, 0.62], [24, -24]);
  const stage2Y = useTransform(scrollYProgress, [0.64, 0.74], [24, 0]);
  const stageYs = [stage0Y, stage1Y, stage2Y];

  /* Stage 0 — the same undifferentiated list everyone sees. */
  const genericOpacity = useTransform(scrollYProgress, [0, 0.04], [0, 1], { clamp: true });
  const genericScale = useTransform(scrollYProgress, [0.19, 0.27], [1, 0.92], { clamp: true });
  const genericCaption = useTransform(scrollYProgress, [0, 0.04, 0.18, 0.24], [0, 1, 1, 0], { clamp: true });

  /* Stage 1 — profile signals feed the AI core. */
  const coreScale = useTransform(scrollYProgress, [0.28, 0.52, 0.72], [0.72, 1.14, 0.94], { clamp: true, ease: EASE });
  const coreGlow = useTransform(scrollYProgress, [0.28, 0.52, 0.74], [0.08, 0.6, 0.3], { clamp: true });
  const coreOpacity = useTransform(scrollYProgress, [0.26, 0.32, 0.74, 0.79], [0, 1, 1, 0], { clamp: true });
  const orbitOpacity = useTransform(scrollYProgress, [0.26, 0.34, 0.72, 0.8], [0, 1, 1, 0], { clamp: true });
  const orbitRotate = useTransform(scrollYProgress, [0.26, 0.8], [0, 150], { clamp: true });
  // Makes room beneath itself for the tender it is about to be compared against.
  const coreY = useTransform(scrollYProgress, [0.54, 0.66], [0, -78], { clamp: true, ease: EASE });

  /* Stage 1→2 — a tender arrives from the other side and gets compared. */
  const cardX = useTransform(scrollYProgress, [0.54, 0.68], ["68%", "0%"], { clamp: true, ease: EASE });
  const cardOpacity = useTransform(scrollYProgress, [0.52, 0.58, 0.72, 0.78], [0, 1, 1, 0], { clamp: true });
  const compareOpacity = useTransform(scrollYProgress, [0.62, 0.66, 0.71, 0.74], [0, 1, 1, 0], { clamp: true });
  const linkOpacity = useTransform(scrollYProgress, [0.64, 0.68, 0.72, 0.75], [0, 1, 1, 0], { clamp: true });
  const linkScale = useTransform(scrollYProgress, [0.64, 0.7], [0, 1], { clamp: true, ease: EASE });
  const compareSweep = useTransform(scrollYProgress, [0.62, 0.73], ["-110%", "110%"], { clamp: true });

  /* Stage 2 — the score. */
  const ringOpacity = useTransform(scrollYProgress, [0.74, 0.8], [0, 1], { clamp: true });
  const ringScale = useTransform(scrollYProgress, [0.74, 0.82], [0.86, 1], { clamp: true, ease: EASE });
  const ringProgress = useTransform(scrollYProgress, [0.76, 0.94], [0, 1], { clamp: true });
  const burstScale = useTransform(scrollYProgress, [0.74, 0.86], [0.6, 2], { clamp: true, ease: EASE });
  const burstOpacity = useTransform(scrollYProgress, [0.74, 0.77, 0.86], [0, 0.45, 0], { clamp: true });
  const panelOpacity = useTransform(scrollYProgress, [0.8, 0.86], [0, 1], { clamp: true });

  /* ── Reduced motion: a plain, complete, static version ─────────────────── */
  if (calm) {
    return (
      <section className="relative bg-canvas py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <SectionLabel>AI Matching</SectionLabel>
            {STAGES.map((stage, i) => (
              <div key={i}>
                <h2 className="text-[clamp(1.6rem,3.4vw,2.5rem)] font-semibold tracking-[-0.04em] text-ink-900">
                  {stage.title}
                </h2>
                <p className="mt-3 max-w-lg text-sm text-ink-500 sm:text-base">{stage.body}</p>
              </div>
            ))}
          </div>
          <div className="rounded-3xl border border-ink-900/8 bg-white p-8 shadow-lift">
            <div className="flex flex-col items-center">
              <FitRing value={tender.fit} label="Excellent Fit" sublabel="Personalized Fit Score" />
            </div>
            <div className="mt-8 space-y-3">
              {FIT_BREAKDOWN.map((row) => (
                <div key={row.label} className="space-y-1">
                  <div className="flex justify-between text-2xs">
                    <span className="text-ink-500">{row.label}</span>
                    <span className="font-bold text-ink-800">{row.value}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-ink-100">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#2F6BFF,#7C5CFF)]"
                      style={{ width: `${row.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[440vh] bg-canvas">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* ── Left: changing copy ──────────────────────────────────────── */}
          <div className="relative order-2 min-h-[15rem] lg:order-1 lg:min-h-[19rem]">
            <SectionLabel>AI Matching · Fit Score</SectionLabel>
            <div className="relative mt-5 h-full">
              {STAGES.map((stage, i) => (
                <motion.div
                  key={i}
                  style={{ opacity: stageOpacities[i], y: stageYs[i] }}
                  className={cn("top-0 w-full", i === 0 ? "relative" : "absolute")}
                >
                  <h2 className="text-balance text-[clamp(1.75rem,3.8vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-ink-900">
                    {stage.title}
                  </h2>
                  <p className="mt-4 max-w-lg text-pretty text-sm leading-relaxed text-ink-500 sm:text-base">
                    {stage.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Right: the visualization ─────────────────────────────────── */}
          <div
            ref={boxRef}
            className="relative order-1 mx-auto aspect-square w-full max-w-[26rem] lg:order-2"
          >
            {/* Orbit rings — one slowly counter-rotating with the scroll */}
            <motion.div
              aria-hidden
              style={{ opacity: orbitOpacity, rotate: orbitRotate }}
              className="absolute inset-[10%] rounded-full border border-dashed border-elec-500/25"
            />
            <motion.div
              aria-hidden
              style={{ opacity: orbitOpacity }}
              className="absolute inset-[24%] rounded-full border border-elec-500/12"
            />

            {/* Connector lines, drawn beneath the chips */}
            <svg
              aria-hidden
              viewBox={`0 0 ${size} ${size}`}
              className="pointer-events-none absolute inset-0 h-full w-full"
            >
              <defs>
                <linearGradient id="fit-line" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#2F6BFF" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#7C5CFF" stopOpacity="0.15" />
                </linearGradient>
              </defs>
              {PROFILE_SIGNALS.map((signal, index) => (
                <SignalLine
                  key={signal}
                  progress={scrollYProgress}
                  index={index}
                  total={PROFILE_SIGNALS.length}
                  radius={radius}
                  size={size}
                />
              ))}
            </svg>

            {/* Stage 0 — an undifferentiated keyword result list */}
            <div className="absolute left-1/2 top-1/2 w-[min(20rem,86%)] -translate-x-1/2 -translate-y-1/2">
              <motion.div style={{ opacity: genericOpacity, scale: genericScale }} className="space-y-2">
                {GENERIC.map((title, index) => (
                  <GenericRow key={title} progress={scrollYProgress} title={title} index={index} />
                ))}
                <motion.p
                  style={{ opacity: genericCaption }}
                  className="pt-1 text-center text-2xs text-ink-400"
                >
                  The same list, for every firm on the portal
                </motion.p>
              </motion.div>
            </div>

            {/* AI core */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                style={{ scale: coreScale, opacity: coreOpacity, y: coreY }}
                className="relative flex h-32 w-32 items-center justify-center"
              >
                <motion.span
                  style={{ opacity: coreGlow }}
                  className="absolute inset-[-80%] rounded-full bg-[radial-gradient(circle,rgba(47,107,255,0.42),transparent_64%)] blur-2xl"
                  aria-hidden
                />
                {/* Ripples as the signals land */}
                <CorePulse progress={scrollYProgress} at={0.5} />
                <CorePulse progress={scrollYProgress} at={0.57} />
                <CorePulse progress={scrollYProgress} at={0.63} />
                <span className="relative flex h-full w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-[1.75rem] border border-elec-500/25 bg-white/92 shadow-glow backdrop-blur-xl">
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,rgba(47,107,255,0.16),transparent_55%)] motion-safe:animate-[spin_9s_linear_infinite]"
                  />
                  <Cpu className="relative h-9 w-9 text-elec-600" aria-hidden />
                  <span className="relative text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-elec-600">
                    Firm model
                  </span>
                </span>
              </motion.div>
            </div>

            {/* Profile signals → AI core */}
            <div className="absolute inset-0">
              {PROFILE_SIGNALS.map((signal, index) => (
                <SignalNode
                  key={signal}
                  progress={scrollYProgress}
                  label={signal}
                  index={index}
                  total={PROFILE_SIGNALS.length}
                  radius={radius}
                />
              ))}
            </div>

            {/* Model ↔ tender link, drawn during the comparison */}
            <motion.div
              aria-hidden
              style={{ opacity: linkOpacity, scaleY: linkScale }}
              className="absolute left-1/2 top-[46%] h-10 w-px origin-top -translate-x-1/2 bg-[linear-gradient(180deg,#2F6BFF,rgba(124,92,255,0.15))]"
            />

            {/* Tender entering from the right, then being compared */}
            <div className="absolute left-1/2 top-[68%] w-[min(20rem,84%)] -translate-x-1/2 -translate-y-1/2">
              <motion.div style={{ x: cardX, opacity: cardOpacity }} className="relative will-change-transform">
                <TenderCardUI tender={tender} showEligibility={false} />
                {/* Comparison sweep across the tender */}
                <motion.span
                  aria-hidden
                  style={{ opacity: compareOpacity }}
                  className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
                >
                  <motion.span
                    style={{ x: compareSweep }}
                    className="absolute inset-y-0 -left-1/2 w-1/2 bg-[linear-gradient(90deg,transparent,rgba(47,107,255,0.25),transparent)]"
                  />
                </motion.span>
                <motion.span
                  style={{ opacity: compareOpacity }}
                  className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-elec-500/25 bg-white px-2.5 py-1 text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-elec-600 shadow-card"
                >
                  Comparing against your firm
                </motion.span>
              </motion.div>
            </div>

            {/* The score — sits above the breakdown panel, not behind it */}
            <div className="absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2">
              <motion.div style={{ opacity: ringOpacity, scale: ringScale }} className="relative">
                <motion.span
                  aria-hidden
                  style={{ scale: burstScale, opacity: burstOpacity }}
                  className="absolute inset-0 rounded-full border-2 border-elec-500/70"
                />
                <FitRing value={tender.fit} progress={ringProgress} label="Excellent Fit" sublabel="Fit Score / 100" />
              </motion.div>
            </div>

            {/* Breakdown panel */}
            <div className="absolute bottom-1 left-1/2 w-[min(21rem,92%)] -translate-x-1/2">
              <motion.div
                style={{ opacity: panelOpacity }}
                className="rounded-2xl border border-ink-900/8 bg-white/92 p-4 shadow-lift backdrop-blur-xl"
              >
                <p className="mb-2.5 text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-ink-400">
                  Score breakdown
                </p>
                <div className="space-y-2.5">
                  {FIT_BREAKDOWN.map((row, index) => (
                    <BreakdownBar
                      key={row.label}
                      progress={scrollYProgress}
                      label={row.label}
                      value={row.value}
                      index={index}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
