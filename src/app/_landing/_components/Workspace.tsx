"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { DASHBOARD_WIDGETS, HERO_TENDERS, PIPELINE_STAGES } from "../_data/content";
import { CountUp, GradientText, Reveal, SectionLabel, useCalmMotion } from "./primitives";
import { FitBadge } from "./TenderUI";

const STAGE_COPY: Record<(typeof PIPELINE_STAGES)[number], string> = {
  Matched: "Surfaced by AI with a Fit Score and eligibility summary.",
  Interested: "Your team flags it — the model learns from the signal.",
  Applied: "Documents assembled, EMD paid, bid submitted on the portal.",
  Won: "Contract awarded. The outcome feeds back into future matching.",
};

const TONES = {
  elec: "text-elec-600",
  amber: "text-warning-600",
  violet: "text-violet-600",
  ink: "text-ink-700",
  green: "text-success-600",
} as const;

/** Widget values step up as the tender advances through the pipeline. */
function Widget({
  label,
  value,
  tone,
  progress,
  index,
}: {
  label: string;
  value: number;
  tone: keyof typeof TONES;
  progress: MotionValue<number>;
  index: number;
}) {
  const start = 0.1 + index * 0.06;
  const scale = useTransform(progress, [start, start + 0.06, start + 0.12], [1, 1.06, 1], { clamp: true });

  return (
    <motion.div
      style={{ scale }}
      className="rounded-2xl border border-ink-900/8 bg-white/88 p-3.5 shadow-card backdrop-blur"
    >
      <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-ink-400">{label}</p>
      <p className={cn("mt-1 text-2xl font-semibold tracking-tight", TONES[tone])}>
        <CountUp value={value} />
      </p>
    </motion.div>
  );
}

export function Workspace() {
  const calm = useCalmMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const tender = HERO_TENDERS[0];

  // The travelling tender: 0 → 1 maps across the four columns.
  const travel = useTransform(scrollYProgress, [0.16, 0.85], [0, 3], { clamp: true });
  const chipLeft = useTransform(travel, (v) => `${(v / 4) * 100 + 12.5}%`);
  const chipY = useTransform(scrollYProgress, [0.16, 0.5, 0.85], [0, -6, 0]);
  const lineScale = useTransform(scrollYProgress, [0.16, 0.85], [0, 1], { clamp: true });

  const activeIndex = useTransform(travel, (v) => Math.round(v));

  if (calm) {
    return (
      <section className="relative bg-canvas py-24">
        <div className="mx-auto max-w-6xl px-5">
          <SectionLabel>One workspace</SectionLabel>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.9rem,4.4vw,3.25rem)] font-semibold tracking-[-0.04em] text-ink-900">
            From discovery to decision. One workspace.
          </h2>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PIPELINE_STAGES.map((stage) => (
              <div key={stage} className="rounded-2xl border border-ink-900/8 bg-white p-4 shadow-card">
                <p className="text-sm font-semibold text-ink-900">{stage}</p>
                <p className="mt-1.5 text-xs text-ink-500">{STAGE_COPY[stage]}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {DASHBOARD_WIDGETS.map((w) => (
              <div key={w.label} className="rounded-2xl border border-ink-900/8 bg-white p-3.5">
                <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-ink-400">
                  {w.label}
                </p>
                <p className={cn("mt-1 text-2xl font-semibold", TONES[w.tone])}>{w.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[300vh] bg-canvas">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-5">
          <Reveal className="max-w-2xl">
            <SectionLabel>One workspace</SectionLabel>
            <h2 className="mt-4 text-balance text-[clamp(1.75rem,4.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-ink-900">
              From discovery to decision. <GradientText>One workspace.</GradientText>
            </h2>
          </Reveal>

          {/* ── Pipeline ─────────────────────────────────────────────────── */}
          <div className="relative mt-10">
            {/* Connector line */}
            <div aria-hidden className="absolute inset-x-[12.5%] top-[3.25rem] h-px bg-ink-200">
              <motion.div
                style={{ scaleX: lineScale }}
                className="h-full w-full origin-left bg-[linear-gradient(90deg,#2F6BFF,#7C5CFF,#22C55E)]"
              />
            </div>

            {/* Travelling tender chip */}
            <motion.div
              style={{ left: chipLeft, y: chipY, x: "-50%" }}
              className="absolute top-[1.4rem] z-20 w-[min(15rem,44vw)] will-change-transform"
            >
              <div className="flex items-center gap-2 rounded-xl border border-elec-500/25 bg-white px-3 py-2 shadow-glow">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-elec-500" aria-hidden />
                <span className="min-w-0 flex-1 truncate text-2xs font-semibold text-ink-800">
                  {tender.title}
                </span>
                <FitBadge value={tender.fit} />
              </div>
            </motion.div>

            <ol className="grid grid-cols-4 gap-2 sm:gap-3">
              {PIPELINE_STAGES.map((stage, index) => (
                <PipelineColumn
                  key={stage}
                  stage={stage}
                  copy={STAGE_COPY[stage]}
                  index={index}
                  activeIndex={activeIndex}
                />
              ))}
            </ol>
          </div>

          {/* ── Dashboard widgets ────────────────────────────────────────── */}
          <div className="mt-8 grid gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
            {DASHBOARD_WIDGETS.map((widget, index) => (
              <Widget
                key={widget.label}
                label={widget.label}
                value={widget.value}
                tone={widget.tone}
                progress={scrollYProgress}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PipelineColumn({
  stage,
  copy,
  index,
  activeIndex,
}: {
  stage: string;
  copy: string;
  index: number;
  activeIndex: MotionValue<number>;
}) {
  const opacity = useTransform(activeIndex, (v) => (v >= index ? 1 : 0.42));
  const borderOpacity = useTransform(activeIndex, (v) => (v >= index ? 1 : 0));

  return (
    <motion.li style={{ opacity }} className="relative pt-16">
      <div className="relative rounded-2xl border border-ink-900/8 bg-white/85 p-3.5 shadow-card backdrop-blur">
        <motion.span
          style={{ opacity: borderOpacity }}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-elec-500/40"
        />
        <p className="flex items-center gap-1.5 text-xs font-semibold text-ink-900">
          <motion.span style={{ opacity: borderOpacity }}>
            <Check className="h-3.5 w-3.5 text-success-600" aria-hidden />
          </motion.span>
          {stage}
        </p>
        <p className="mt-1.5 text-2xs leading-relaxed text-ink-400">{copy}</p>
      </div>
    </motion.li>
  );
}
