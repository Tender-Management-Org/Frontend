"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { COMPARISONS } from "../_data/content";
import { GradientText, SectionLabel, useCalmMotion } from "./primitives";

/* Each pair gets its own beat. Nothing moves until the section is pinned, so
   the cluttered "today" column is fully readable before anything transforms. */
const FIRST_BEAT = 0.16;
const BEAT = 0.082;
const FLIP = 0.055;

function CompareRow({
  before,
  after,
  index,
  progress,
}: {
  before: string;
  after: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const start = FIRST_BEAT + index * BEAT;
  const end = start + FLIP;

  /* Old way — dims, softens and gets struck through. */
  const beforeOpacity = useTransform(progress, [start, end], [1, 0.3], { clamp: true });
  const beforeX = useTransform(progress, [start, end], [0, -12], { clamp: true });
  const beforeBlur = useTransform(progress, [start, end], ["blur(0px)", "blur(1.4px)"]);
  const strike = useTransform(progress, [start, end], [0, 1], { clamp: true });

  /* tenderkhoj way — sharpens into place. */
  const afterOpacity = useTransform(progress, [start, end], [0.22, 1], { clamp: true });
  const afterX = useTransform(progress, [start, end], [14, 0], { clamp: true });
  const afterBlur = useTransform(progress, [start, end], ["blur(4px)", "blur(0px)"]);
  const afterRing = useTransform(progress, [start, end, end + 0.05], [0, 1, 0], { clamp: true });
  const checkScale = useTransform(progress, [end - 0.02, end + 0.02], [0, 1], { clamp: true });

  /* The arrow lights up exactly on the hand-over. */
  const arrowOpacity = useTransform(progress, [start, end], [0.18, 1], { clamp: true });
  const arrowX = useTransform(progress, [start, end], [-3, 3], { clamp: true });

  return (
    <li className="grid grid-cols-[1fr_auto_1fr] items-center gap-1.5 sm:gap-4">
      <motion.div
        style={{ opacity: beforeOpacity, x: beforeX, filter: beforeBlur }}
        className="relative rounded-xl border border-ink-900/8 bg-ink-100/80 px-2.5 py-2 text-right text-xs font-medium text-ink-500 sm:px-4 sm:py-2.5 sm:text-base"
      >
        <span className="relative inline-block">
          {before}
          <motion.span
            aria-hidden
            style={{ scaleX: strike }}
            className="absolute inset-x-0 top-1/2 h-px origin-right bg-ink-400"
          />
        </span>
      </motion.div>

      <motion.span style={{ opacity: arrowOpacity, x: arrowX }} className="shrink-0" aria-hidden>
        <ArrowRight className="h-3.5 w-3.5 text-elec-500" />
      </motion.span>

      <motion.div
        style={{ opacity: afterOpacity, x: afterX, filter: afterBlur }}
        className="relative flex items-center gap-1.5 rounded-xl border border-elec-500/20 bg-white px-2.5 py-2 text-xs font-semibold text-ink-900 shadow-card sm:gap-2 sm:px-4 sm:py-2.5 sm:text-base"
      >
        <motion.span
          aria-hidden
          style={{ opacity: afterRing }}
          className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-elec-500/45"
        />
        <motion.span style={{ scale: checkScale }} className="shrink-0">
          <Check className="h-3.5 w-3.5 text-success-600" aria-hidden />
        </motion.span>
        <span className="min-w-0">{after}</span>
      </motion.div>
    </li>
  );
}

export function BeforeAfter() {
  const calm = useCalmMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const lastBeat = FIRST_BEAT + (COMPARISONS.length - 1) * BEAT + FLIP;

  /* Column headers: "Today" recedes, "With tenderkhoj" takes over. */
  const todayOpacity = useTransform(scrollYProgress, [0, FIRST_BEAT, lastBeat], [1, 1, 0.4], { clamp: true });
  const newOpacity = useTransform(scrollYProgress, [0, FIRST_BEAT, lastBeat], [0.4, 0.6, 1], { clamp: true });
  const railScale = useTransform(scrollYProgress, [FIRST_BEAT, lastBeat], [0, 1], { clamp: true });
  const countdown = useTransform(scrollYProgress, (p) =>
    Math.min(COMPARISONS.length, Math.max(0, Math.floor((p - FIRST_BEAT) / BEAT) + 1))
  );
  const summaryOpacity = useTransform(scrollYProgress, [lastBeat - 0.04, lastBeat + 0.04], [0, 1], {
    clamp: true,
  });
  const counterOpacity = useTransform(summaryOpacity, (v) => 1 - v);

  if (calm) {
    return (
      <section className="relative bg-canvas py-24">
        <div className="mx-auto max-w-4xl px-5">
          <SectionLabel>Before &amp; after</SectionLabel>
          <h2 className="mt-4 text-[clamp(1.9rem,4.4vw,3.25rem)] font-semibold tracking-[-0.04em] text-ink-900">
            The old way vs. the tenderkhoj way
          </h2>
          <ul className="mt-10 space-y-2.5">
            {COMPARISONS.map((row) => (
              <li key={row.before} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <span className="rounded-xl bg-ink-100 px-4 py-2.5 text-right text-sm text-ink-500 line-through">
                  {row.before}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-elec-500" aria-hidden />
                <span className="flex items-center gap-2 rounded-xl border border-elec-500/20 bg-white px-4 py-2.5 text-sm font-semibold text-ink-900">
                  <Check className="h-3.5 w-3.5 text-success-600" aria-hidden />
                  {row.after}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[300vh] bg-canvas">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="mx-auto w-full max-w-4xl px-4 pt-16 sm:px-5">
          <div className="text-center">
            <SectionLabel>Before &amp; after</SectionLabel>
            <h2 className="mx-auto mt-3 max-w-2xl text-balance text-[clamp(1.5rem,3.8vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-ink-900">
              The old way vs. <GradientText>the tenderkhoj way</GradientText>
            </h2>
          </div>

          {/* Column headers + progress rail */}
          <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-center gap-1.5 sm:gap-4">
            <motion.span
              style={{ opacity: todayOpacity }}
              className="text-right text-xs font-semibold uppercase tracking-[0.18em] text-ink-400"
            >
              Today
            </motion.span>
            <span aria-hidden className="w-3.5" />
            <motion.span
              style={{ opacity: newOpacity }}
              className="text-xs font-semibold uppercase tracking-[0.18em] text-elec-600"
            >
              With tenderkhoj
            </motion.span>
          </div>

          <div className="mt-1.5 h-px w-full overflow-hidden bg-ink-200">
            <motion.div
              style={{ scaleX: railScale }}
              className="h-full w-full origin-left bg-[linear-gradient(90deg,#2F6BFF,#7C5CFF,#22C55E)]"
            />
          </div>

          <ul className="mt-3 space-y-1.5 sm:space-y-2.5">
            {COMPARISONS.map((row, index) => (
              <CompareRow
                key={row.before}
                before={row.before}
                after={row.after}
                index={index}
                progress={scrollYProgress}
              />
            ))}
          </ul>

          <div className="relative mt-5 h-5 text-center">
            <motion.p
              style={{ opacity: summaryOpacity }}
              className="absolute inset-0 text-sm font-medium text-ink-500"
            >
              Eight manual habits replaced by one intelligent workflow.
            </motion.p>
            <motion.p
              style={{ opacity: counterOpacity }}
              className="absolute inset-0 text-sm tabular-nums text-ink-400"
            >
              <motion.span>{countdown}</motion.span> of {COMPARISONS.length} replaced
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
