"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowDown, ArrowRight, Layers, ScanLine, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { FLOOD_TITLES, HERO_TENDERS, RAW_FEED } from "../_data/content";
import { GradientText, GridBackdrop, MagneticButton, Orb, Pill, useCalmMotion, useSeeded } from "./primitives";
import { AppFrame, TenderCardUI, TenderChip } from "./TenderUI";

/** Where the flood converges — the centre of the product frame, not the page. */
const SINK_Y = 20; // vh below the viewport centre

/* ────────────────────────────────────────────────────────────────────────────
   A single card in the "thousands of tenders" flood. It stays fully legible
   for most of its journey, then shrinks into the recommendations panel.
   ──────────────────────────────────────────────────────────────────────────── */

function FloodCard({
  progress,
  seed,
  title,
}: {
  progress: MotionValue<number>;
  seed: [number, number, number];
  title: string;
}) {
  const angle = seed[0] * Math.PI * 2;
  const radius = 58 + seed[1] * 34;
  const startX = Math.cos(angle) * radius;
  const startY = Math.sin(angle) * radius * 0.66 - SINK_Y;
  const lag = seed[2] * 0.16;

  const from = 0.1 + lag;
  const to = 0.5 + lag;

  const x = useTransform(progress, [from, to], [`${startX}vw`, "0vw"], { clamp: true });
  const y = useTransform(progress, [from, to], [`${startY}vh`, `${SINK_Y}vh`], { clamp: true });
  // Held near full size for most of the trip, then absorbed at the very end.
  const scale = useTransform(progress, [from, to - 0.12, to], [1, 0.92, 0.42], { clamp: true });
  const rotate = useTransform(progress, [from, to - 0.12], [(seed[0] - 0.5) * 16, 0], { clamp: true });
  const opacity = useTransform(
    progress,
    [from, from + 0.035, to - 0.07, to],
    [0, 1, 1, 0],
    { clamp: true }
  );

  return (
    <div aria-hidden className="absolute left-1/2 top-1/2 w-[min(19rem,74vw)] -translate-x-1/2 -translate-y-1/2">
      <motion.div style={{ x, y, scale, rotate, opacity }} className="will-change-transform">
        <TenderChip title={title} meta="Government e-procurement" />
      </motion.div>
    </div>
  );
}

/**
 * What the frame shows before anything happens: the raw portal firehose, in
 * arrival order, with no scores. It is what the flood is made of — so when the
 * recommendations replace it, the panel reads as the *result* of the filtering
 * rather than something that was sitting there all along.
 */
function RawFeedPanel() {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between px-1 pb-0.5">
        <span className="inline-flex min-w-0 items-center gap-1.5 truncate text-2xs font-semibold uppercase tracking-[0.14em] text-ink-400">
          <Layers className="h-3 w-3 shrink-0" aria-hidden />
          All live tenders
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 text-2xs text-ink-400">
          <span className="relative flex h-1.5 w-1.5" aria-hidden>
            <span className="absolute inline-flex h-full w-full rounded-full bg-warning-500/70 motion-safe:animate-ring-pulse" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-warning-500" />
          </span>
          3,709 open<span className="hidden sm:inline"> · unranked</span>
        </span>
      </div>

      <ul className="space-y-1.5">
        {RAW_FEED.map((row) => (
          <li
            key={row.title}
            className="flex items-center gap-2.5 rounded-xl border border-ink-900/8 bg-white/75 px-3 py-2.5"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink-300" aria-hidden />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-medium text-ink-600">{row.title}</span>
              <span className="block truncate text-2xs text-ink-400">{row.meta}</span>
            </span>
            <span className="shrink-0 text-2xs tabular-nums text-ink-400">{row.value}</span>
            <span className="hidden w-9 shrink-0 text-right text-2xs text-ink-300 sm:block">&mdash;</span>
          </li>
        ))}
      </ul>

      <p className="pt-1 text-center text-2xs text-ink-400">
        Every portal, every category, in the order it was published
      </p>
    </div>
  );
}

/**
 * Moves its children by a fraction of the pointer offset. Kept as its own
 * component so the `useTransform` hooks never run conditionally.
 */
function Drift({
  x,
  y,
  factor,
  calm,
  className,
  children,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  factor: number;
  calm: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const tx = useTransform(x, (v) => v * factor);
  const ty = useTransform(y, (v) => v * factor * 0.85);
  return (
    <motion.div style={calm ? undefined : { x: tx, y: ty }} className={className}>
      {children}
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Hero + the sticky "filtering the noise" transition, as one scroll story.

   The product frame is never dismissed: the flood is absorbed into it and the
   payoff headline resolves above it, so the visitor ends the section looking at
   the recommendations panel rather than at an empty stage.
   ──────────────────────────────────────────────────────────────────────────── */

export function Hero() {
  const calm = useCalmMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* The copy slot is sized by the hero copy, which is much taller than the
     payoff that replaces it — leaving a void above the payoff and cropping the
     panel below. Measure both and lift the end state by the difference rather
     than hard-coding a number that only holds at one width and font. */
  const copyRef = useRef<HTMLDivElement>(null);
  const payoffRef = useRef<HTMLDivElement>(null);
  const [lift, setLift] = useState(0);

  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;
    const measure = () => {
      const copyHeight = copyRef.current?.offsetHeight ?? 0;
      const payoffHeight = payoffRef.current?.offsetHeight ?? 0;
      // Reclaim nearly all of the void the taller hero copy leaves behind,
      // keeping a small margin so the payoff never rides up under the nav.
      setLift(Math.max(0, Math.round(copyHeight - payoffHeight - 12)));
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (copyRef.current) observer.observe(copyRef.current);
    if (payoffRef.current) observer.observe(payoffRef.current);
    return () => observer.disconnect();
  }, []);

  /* Pointer parallax for the product composition (desktop, mouse only). */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spx = useSpring(px, { stiffness: 120, damping: 24, mass: 0.6 });
  const spy = useSpring(py, { stiffness: 120, damping: 24, mass: 0.6 });

  function handlePointer(event: React.PointerEvent) {
    if (calm || event.pointerType !== "mouse") return;
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set(((event.clientX - rect.left) / rect.width - 0.5) * 26);
    py.set(((event.clientY - rect.top) / rect.height - 0.5) * 18);
  }

  /* ── Choreography ──────────────────────────────────────────────────────
     0.00–0.18  hero copy, product frame cropped by the fold
     0.10–0.50  tenders flood in from every edge, fully legible
     0.38–0.55  they are absorbed into the recommendations panel
     0.52–1.00  the payoff headline resolves above the panel, which stays  */

  const copyOpacity = useTransform(scrollYProgress, [0, 0.08, 0.18], [1, 1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 0.18], [0, -60]);
  const copyBlur = useTransform(scrollYProgress, [0.06, 0.18], ["blur(0px)", "blur(12px)"]);

  const payoffOpacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1], { clamp: true });
  const payoffY = useTransform(scrollYProgress, [0.5, 0.66, 0.84], [26, 0, -lift], { clamp: true });
  const payoffBlur = useTransform(scrollYProgress, [0.5, 0.64], ["blur(10px)", "blur(0px)"]);

  /* The frame rises into place and then simply stays put. */
  // Rises into place, holds, then lifts with the payoff so the two stay locked.
  const frameY = useTransform(scrollYProgress, [0, 0.34, 0.66, 0.84], [92, 0, 0, -lift], { clamp: true });
  const frameScale = useTransform(scrollYProgress, [0, 0.34], [1.05, 1], { clamp: true });

  /* The panel swaps contents mid-flood: raw feed out, recommendations in. */
  const rawOpacity = useTransform(scrollYProgress, [0.3, 0.44], [1, 0], { clamp: true });
  const rawY = useTransform(scrollYProgress, [0.3, 0.46], [0, -18], { clamp: true });
  const recOpacity = useTransform(scrollYProgress, [0.5, 0.62], [0, 1], { clamp: true });
  const recY = useTransform(scrollYProgress, [0.5, 0.64], [16, 0], { clamp: true });

  /* Absorption glow — peaks while the last cards land. */
  const sinkGlow = useTransform(scrollYProgress, [0.34, 0.52, 0.68], [0, 0.9, 0], { clamp: true });
  const matchedOpacity = useTransform(scrollYProgress, [0.62, 0.72], [0, 1], { clamp: true });

  const seeds = useSeeded(FLOOD_TITLES.length * 3, 7);

  return (
    <section id="product" ref={sectionRef} className="relative h-[340vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        {/* Ambient background */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-canvas">
          <GridBackdrop />
          <Orb className="left-[6%] top-[8%] h-[34rem] w-[34rem] opacity-[0.16]" color="#2F6BFF" />
          <Orb
            className="right-[2%] top-[26%] h-[30rem] w-[30rem] opacity-[0.14]"
            color="#7C5CFF"
            style={{ animationDelay: "-6s" }}
          />
        </div>

        {/* ── Copy slot — hero copy, then the payoff, in the same space ────
             The slot takes its height from the hero copy in normal flow rather
             than a fixed svh value: the headline's line count depends on the
             viewport width and the loaded font, so a fixed height overlaps the
             CTAs as soon as it wraps one line further than expected. */}
        <div className="relative z-20 w-full shrink-0 pb-2 pt-24 sm:pt-28">
          <motion.div
            ref={copyRef}
            style={calm ? undefined : { opacity: copyOpacity, y: copyY, filter: copyBlur }}
            className="mx-auto max-w-5xl px-5 text-center"
          >
            <Pill className="animate-fade-in">
              <span className="relative flex h-1.5 w-1.5" aria-hidden>
                <span className="absolute inline-flex h-full w-full rounded-full bg-elec-500 opacity-70 motion-safe:animate-ring-pulse" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-elec-500" />
              </span>
              AI-powered tender intelligence
            </Pill>

            <h1 className="mt-4 text-balance text-[clamp(1.85rem,4.6vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.045em] text-ink-900">
              <span className="block">Stop searching for tenders.</span>
              <span className="mt-1 block text-ink-500">
                Start finding the ones <GradientText className="whitespace-nowrap">you can win.</GradientText>
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-ink-500 sm:text-lg">
              tenderkhoj discovers government tenders, understands your business, and recommends the
              opportunities that actually fit your firm.
            </p>

            <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <MagneticButton href="/register" icon={<ArrowRight className="h-4 w-4" aria-hidden />}>
                Start free
              </MagneticButton>
              <MagneticButton
                href="#how-it-works"
                variant="ghost"
                slideIcon={false}
                icon={
                  <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden />
                }
              >
                See How It Works
              </MagneticButton>
            </div>

            <p className="mt-3 text-xs text-ink-400">
              Free trial · No credit card required
            </p>

            <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-medium text-ink-400">
              {["AI Recommendations", "Document Intelligence", "Eligibility Analysis"].map((item, index) => (
                <li key={item} className="flex items-center gap-3">
                  {index > 0 && <span className="h-1 w-1 rounded-full bg-ink-300" aria-hidden />}
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* The payoff — overlays the slot the hero copy just vacated */}
          <motion.div
            ref={payoffRef}
            style={calm ? undefined : { opacity: payoffOpacity, y: payoffY, filter: payoffBlur }}
            className={cn(
              "absolute inset-x-0 bottom-1 mx-auto max-w-3xl px-5 text-center",
              calm && "static mt-10"
            )}
          >
            <h2 className="text-balance text-[clamp(1.6rem,3.7vw,2.9rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-ink-900">
              Thousands of tenders.
              <br />
              <GradientText>Only a few matter to you.</GradientText>
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-ink-500 sm:text-base">
              tenderkhoj filters the noise the moment it appears — so your team only ever looks at
              opportunities worth their time.
            </p>
          </motion.div>
        </div>

        {/* ── The flood — absorbed into the panel below ─────────────────── */}
        {!calm && (
          <div aria-hidden className="pointer-events-none absolute inset-0 z-30">
            {FLOOD_TITLES.map((title, index) => (
              <FloodCard
                key={title}
                progress={scrollYProgress}
                title={title}
                seed={[seeds[index * 3], seeds[index * 3 + 1], seeds[index * 3 + 2]] as [number, number, number]}
              />
            ))}
          </div>
        )}

        {/* ── The product frame — rises into place and stays ────────────── */}
        <motion.div
          ref={stageRef}
          onPointerMove={handlePointer}
          onPointerLeave={() => {
            px.set(0);
            py.set(0);
          }}
          style={calm ? undefined : { y: frameY, scale: frameScale }}
          className="relative z-40 mx-auto w-full max-w-5xl flex-1 px-5"
        >
          <motion.div
            style={calm ? undefined : { x: spx, y: spy }}
            className="relative mx-auto w-full max-w-3xl [transform-style:preserve-3d]"
          >
            {/* Absorption glow behind the panel */}
            {!calm && (
              <motion.span
                aria-hidden
                style={{ opacity: sinkGlow }}
                className="pointer-events-none absolute inset-x-8 -top-6 bottom-0 rounded-[2rem] bg-[radial-gradient(60%_50%_at_50%_20%,rgba(47,107,255,0.4),transparent_70%)] blur-2xl"
              />
            )}

            <AppFrame
              label={
                calm ? (
                  "tenderkhoj — Recommendations for STech Infra Pvt. Ltd."
                ) : (
                  /* The window title swaps with the contents. Both live in the
                     same grid cell so the chrome never changes width. */
                  <span className="grid grid-cols-1">
                    <motion.span style={{ opacity: rawOpacity }} className="col-start-1 row-start-1 truncate">
                      tenderkhoj — Live tender feed
                    </motion.span>
                    <motion.span style={{ opacity: recOpacity }} className="col-start-1 row-start-1 truncate">
                      tenderkhoj — Recommendations for STech Infra Pvt. Ltd.
                    </motion.span>
                  </span>
                )
              }
            >
              <div className="relative bg-gradient-to-b from-white/60 to-canvas-soft/40 p-2.5 sm:p-3">
                {!calm && (
                  <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-20 h-full overflow-hidden">
                    <div className="h-8 w-full animate-scan-y bg-[linear-gradient(180deg,transparent,rgba(47,107,255,0.16),transparent)]">
                      <div className="h-px w-full bg-elec-400/70 shadow-[0_0_16px_2px_rgba(47,107,255,0.55)]" />
                    </div>
                  </div>
                )}

                {/* Both panels occupy one grid cell, so the frame keeps a single
                    height through the crossfade — no jump, no layout thrash.
                    `grid-cols-1` (minmax(0,1fr)) stops the track sizing itself
                    to the widest panel's max-content and overflowing. */}
                <div className="grid grid-cols-1">
                  {!calm && (
                    <motion.div
                      style={{ opacity: rawOpacity, y: rawY }}
                      className="col-start-1 row-start-1 self-start"
                      aria-hidden
                    >
                      <RawFeedPanel />
                    </motion.div>
                  )}

                  <motion.div
                    style={calm ? undefined : { opacity: recOpacity, y: recY }}
                    className="col-start-1 row-start-1 space-y-1.5 self-start"
                  >
                    <div className="flex items-center justify-between px-1 pb-0.5">
                      <span className="inline-flex min-w-0 items-center gap-1.5 truncate text-2xs font-semibold uppercase tracking-[0.14em] text-elec-600">
                        <Sparkles className="h-3 w-3 shrink-0" aria-hidden />
                        Recommended for you
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-1.5 text-2xs text-ink-400">
                        <ScanLine className="h-3 w-3" aria-hidden />
                        <span className="hidden sm:inline">Filtered from </span>3,709 live tenders
                      </span>
                    </div>

                    {HERO_TENDERS.slice(0, 3).map((tender, index) => (
                      <Drift
                        key={tender.id}
                        x={spx}
                        y={spy}
                        factor={0.35 + index * 0.22}
                        calm={calm}
                        className={cn(index === 0 && "relative z-10")}
                      >
                        <TenderCardUI tender={tender} compact={index > 0} />
                      </Drift>
                    ))}

                    {/* Reads out the result of the filtering the visitor just watched */}
                    <motion.p
                      style={calm ? undefined : { opacity: matchedOpacity }}
                      className="flex items-center justify-center gap-1.5 pt-1 text-2xs font-medium text-ink-400"
                    >
                      <Sparkles className="h-3 w-3 text-elec-500" aria-hidden />
                      3 strong matches out of 3,709 live tenders
                    </motion.p>
                  </motion.div>
                </div>
              </div>
            </AppFrame>

          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
