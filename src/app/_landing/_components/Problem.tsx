"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { CalendarClock, FileText, RefreshCw, Search, Shield, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { HERO_TENDERS } from "../_data/content";
import { GradientText, GridBackdrop, useCalmMotion, useSeeded } from "./primitives";
import { AppFrame, TenderCardUI } from "./TenderUI";

/* ────────────────────────────────────────────────────────────────────────────
   Each manual step is a small mock of the thing you actually stare at — a
   portal window, a CAPTCHA, a 146-page PDF — rather than a label describing it.
   ──────────────────────────────────────────────────────────────────────────── */

function Chrome({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-ink-900/10 bg-white shadow-card">
      <div className="flex items-center gap-1.5 border-b border-ink-900/6 bg-ink-100/70 px-2.5 py-2">
        <span className="flex gap-1" aria-hidden>
          <span className="h-1.5 w-1.5 rounded-full bg-ink-300" />
          <span className="h-1.5 w-1.5 rounded-full bg-ink-300" />
        </span>
        <span className="truncate text-[0.625rem] text-ink-400">{title}</span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

const STEPS: { label: string; visual: React.ReactNode }[] = [
  {
    label: "Open the portal",
    visual: (
      <Chrome title="eproc.rajasthan.gov.in">
        <div className="space-y-1" aria-hidden>
          <div className="h-1.5 w-2/3 rounded-full bg-ink-200" />
          <div className="mt-2 grid grid-cols-3 gap-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-4 rounded bg-ink-100" />
            ))}
          </div>
        </div>
      </Chrome>
    ),
  },
  {
    label: "Search by keyword",
    visual: (
      <Chrome title="Tender search">
        <div className="flex items-center gap-1.5 rounded-md border border-ink-200 px-1.5 py-1">
          <Search className="h-2.5 w-2.5 shrink-0 text-ink-400" aria-hidden />
          <span className="truncate text-[0.6875rem] text-ink-500">road construction</span>
          <span className="ml-auto h-2.5 w-2.5 rounded-sm bg-ink-300" aria-hidden />
        </div>
        <p className="mt-1.5 text-[0.5625rem] text-ink-400">0 exact matches</p>
      </Chrome>
    ),
  },
  {
    label: "Solve the CAPTCHA",
    visual: (
      <Chrome title="Verify you are human">
        <div className="flex items-center gap-1.5">
          <span
            className="select-none rounded bg-ink-100 px-2 py-1 font-mono text-xs italic tracking-[0.2em] text-ink-500 line-through decoration-ink-300"
            aria-hidden
          >
            x7Kq2
          </span>
          <Shield className="h-3 w-3 text-danger-500" aria-hidden />
        </div>
        <div className="mt-1.5 h-3 rounded border border-ink-200" aria-hidden />
      </Chrome>
    ),
  },
  {
    label: "Open a tender",
    visual: (
      <Chrome title="NIT / 4471">
        <div className="space-y-1" aria-hidden>
          {[100, 72, 88].map((w, i) => (
            <div key={i} className="h-1.5 rounded-full bg-ink-200" style={{ width: `${w}%` }} />
          ))}
          <div className="mt-1.5 h-3 w-14 rounded bg-elec-100" />
        </div>
      </Chrome>
    ),
  },
  {
    label: "Download the PDF",
    visual: (
      <Chrome title="Downloading…">
        <div className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 shrink-0 text-danger-500" aria-hidden />
          <span className="truncate text-[0.6875rem] text-ink-500">NIT_RD-4471.pdf</span>
        </div>
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-ink-100" aria-hidden>
          <div className="h-full w-2/5 rounded-full bg-elec-400" />
        </div>
      </Chrome>
    ),
  },
  {
    label: "Read 100+ pages",
    visual: (
      <Chrome title="Page 41 / 146">
        <div className="space-y-[3px] font-mono" aria-hidden>
          {[100, 94, 88, 96, 70, 92, 64].map((w, i) => (
            <div key={i} className="h-[3px] rounded-full bg-ink-200" style={{ width: `${w}%` }} />
          ))}
        </div>
      </Chrome>
    ),
  },
  {
    label: "Check eligibility by hand",
    visual: (
      <Chrome title="Qualification criteria">
        <ul className="space-y-1" aria-hidden>
          {["Turnover ≥ ₹90 L", "Similar work", "Solvency cert."].map((row) => (
            <li key={row} className="flex items-center gap-1.5 text-[0.6875rem] text-ink-500">
              <span className="flex h-3 w-3 items-center justify-center rounded-sm border border-ink-300 text-[0.5625rem] text-ink-400">
                ?
              </span>
              {row}
            </li>
          ))}
        </ul>
      </Chrome>
    ),
  },
  {
    label: "Repeat tomorrow",
    visual: (
      <Chrome title="Every morning">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 shrink-0 text-warning-600" aria-hidden />
          <div className="min-w-0 flex-1" aria-hidden>
            <div className="h-1.5 w-full rounded-full bg-ink-200" />
            <div className="mt-1 h-1.5 w-3/5 rounded-full bg-ink-200" />
          </div>
          <RefreshCw className="h-3 w-3 shrink-0 text-ink-400" aria-hidden />
        </div>
      </Chrome>
    ),
  },
];

/** One step: arrives in sequence, drifts into the pile, then collapses away. */
function WorkflowStep({
  progress,
  step,
  index,
  total,
  seed,
}: {
  progress: MotionValue<number>;
  step: { label: string; visual: React.ReactNode };
  index: number;
  total: number;
  seed: [number, number];
}) {
  const appearAt = 0.05 + (index / total) * 0.4;
  const collapseAt = 0.56;

  const opacity = useTransform(
    progress,
    [appearAt, appearAt + 0.035, collapseAt, collapseAt + 0.08],
    [0, 1, 1, 0],
    { clamp: true }
  );
  // Clutter: each card drifts off its grid slot as more of them pile up.
  const driftX = (seed[0] - 0.5) * 30;
  const driftY = (seed[1] - 0.5) * 22;
  const x = useTransform(progress, [appearAt, collapseAt, collapseAt + 0.1], [0, driftX, 0], { clamp: true });
  const y = useTransform(progress, [appearAt, appearAt + 0.05, collapseAt + 0.1], [22, driftY, 0], {
    clamp: true,
  });
  const rotate = useTransform(progress, [appearAt, collapseAt], [(seed[0] - 0.5) * 4, (seed[0] - 0.5) * 11], {
    clamp: true,
  });
  const scale = useTransform(progress, [appearAt, appearAt + 0.04, collapseAt, collapseAt + 0.09], [0.9, 1, 1, 0.55], {
    clamp: true,
  });
  const blur = useTransform(progress, [collapseAt, collapseAt + 0.09], ["blur(0px)", "blur(7px)"]);

  return (
    <motion.li
      style={{ opacity, x, y, rotate, scale, filter: blur }}
      className="relative will-change-transform"
    >
      {step.visual}
      <p className="mt-2 text-center text-sm font-medium text-ink-600">{step.label}</p>
      <span
        aria-hidden
        className="absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-ink-900/10 bg-white text-[0.625rem] font-bold tabular-nums text-ink-500 shadow-card"
      >
        {index + 1}
      </span>
    </motion.li>
  );
}

export function Problem() {
  const calm = useCalmMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const seeds = useSeeded(STEPS.length * 2, 31);

  const introOpacity = useTransform(scrollYProgress, [0, 0.06, 0.5, 0.58], [1, 1, 1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.58], [0, -34]);

  const outroOpacity = useTransform(scrollYProgress, [0.6, 0.72], [0, 1]);
  const outroY = useTransform(scrollYProgress, [0.6, 0.78], [30, 0]);
  const outroScale = useTransform(scrollYProgress, [0.6, 0.8], [0.94, 1]);

  // The canvas visibly "heats up" as the clutter accumulates, then cools.
  const noiseOpacity = useTransform(scrollYProgress, [0.1, 0.5, 0.62], [0, 0.55, 0]);

  if (calm) {
    return (
      <section id="how-it-works" className="relative bg-canvas py-24">
        <div className="mx-auto max-w-5xl px-5 text-center">
          <h2 className="text-[clamp(1.9rem,4.6vw,3.25rem)] font-semibold tracking-[-0.04em] text-ink-900">
            Tender discovery shouldn&rsquo;t be a full-time job.
          </h2>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <li key={step.label}>
                {step.visual}
                <p className="mt-2 text-center text-sm font-medium text-ink-600">
                  {index + 1}. {step.label}
                </p>
              </li>
            ))}
          </ol>
          <h3 className="mt-14 text-[clamp(1.6rem,4vw,2.75rem)] font-semibold tracking-[-0.04em] text-ink-900">
            There&rsquo;s a <GradientText>smarter way.</GradientText>
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-500">
            tenderkhoj continuously monitors procurement portals and brings relevant opportunities
            directly to your team.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="how-it-works" ref={ref} className="relative h-[320vh] bg-canvas">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10">
          <GridBackdrop />
          <motion.div
            style={{ opacity: noiseOpacity }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(244,63,94,0.10),transparent_62%)]"
          />
        </div>

        {/* ── The manual workflow, piling up ─────────────────────────────── */}
        <motion.div
          style={{ opacity: introOpacity, y: introY }}
          className="absolute inset-0 flex flex-col items-center justify-center px-4 pt-16 sm:px-5"
        >
          <h2 className="max-w-3xl text-balance text-center text-[clamp(1.6rem,4.4vw,3.1rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-ink-900">
            Tender discovery shouldn&rsquo;t be a{" "}
            <span className="text-danger-600">full-time job.</span>
          </h2>

          <ol className="mt-9 grid w-full max-w-5xl grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-5 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <WorkflowStep
                key={step.label}
                progress={scrollYProgress}
                step={step}
                index={index}
                total={STEPS.length}
                seed={[seeds[index * 2], seeds[index * 2 + 1]] as [number, number]}
              />
            ))}
          </ol>
        </motion.div>

        {/* ── The resolution ─────────────────────────────────────────────── */}
        <motion.div
          style={{ opacity: outroOpacity, y: outroY, scale: outroScale }}
          className="relative z-10 mx-auto w-full max-w-5xl px-5"
        >
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="text-center lg:text-left">
              <h3 className="text-balance text-[clamp(1.75rem,4.4vw,3rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-ink-900">
                There&rsquo;s a <GradientText>smarter way.</GradientText>
              </h3>
              <p className="mx-auto mt-4 max-w-md text-pretty text-base text-ink-500 sm:text-lg lg:mx-0">
                tenderkhoj continuously monitors procurement portals and brings relevant
                opportunities directly to your team.
              </p>
              <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-ink-900/10 bg-white/70 px-4 py-2 text-sm font-medium text-ink-500 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-elec-500" aria-hidden />
                Eight manual steps → one screen
              </p>
            </div>

            <AppFrame label="tenderkhoj — Today" className={cn("mx-auto w-full max-w-lg")}>
              <div className="space-y-2.5 bg-gradient-to-b from-white/60 to-canvas-soft/40 p-3.5">
                {HERO_TENDERS.slice(0, 2).map((tender) => (
                  <TenderCardUI key={tender.id} tender={tender} />
                ))}
              </div>
            </AppFrame>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
