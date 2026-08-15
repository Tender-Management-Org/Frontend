"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, TrendingUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FitRing, GradientText, Reveal, SectionLabel, useCalmMotion, useEnter } from "./primitives";
import { FitBadge } from "./TenderUI";

const LIKED = [
  { id: "l1", title: "Rural road package — Alwar", meta: "PWD · ₹1.9 Cr", fit: 91 },
  { id: "l2", title: "Approach road & culvert — Bhilwara", meta: "RSRDC · ₹82 Lakh", fit: 88 },
  { id: "l3", title: "Bituminous overlay — Sikar", meta: "PWD · ₹1.7 Cr", fit: 86 },
];

const DISMISSED = [
  { id: "d1", title: "Hospital linen procurement", meta: "Medical Dept. · ₹14 Lakh", fit: 44 },
  { id: "d2", title: "Housekeeping services — Ajmer", meta: "Municipal Corp. · ₹22 Lakh", fit: 39 },
  { id: "d3", title: "Stationery rate contract", meta: "Secretariat · ₹6 Lakh", fit: 31 },
];

const SCORE_STEPS = [76, 84, 92];

function Panel({
  tone,
  icon,
  action,
  caption,
  children,
}: {
  tone: "green" | "rose" | "blue";
  icon: React.ReactNode;
  action: string;
  caption: string;
  children: React.ReactNode;
}) {
  const tones = {
    green: "border-success-500/25 bg-success-50 text-success-700",
    rose: "border-danger-500/25 bg-danger-50 text-danger-700",
    blue: "border-elec-500/25 bg-elec-50 text-elec-700",
  } as const;

  return (
    <div className="flex h-full flex-col rounded-3xl border border-ink-900/8 bg-white/85 p-5 shadow-lift backdrop-blur-xl transition-shadow duration-300 hover:shadow-lift-lg">
      <span
        className={cn(
          "inline-flex w-fit items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold",
          tones[tone]
        )}
      >
        {icon}
        {action}
      </span>
      <div className="mt-4 flex-1">{children}</div>
      <p className="mt-4 border-t border-ink-900/6 pt-3 text-xs leading-relaxed text-ink-400">{caption}</p>
    </div>
  );
}

export function Learns() {
  const calm = useCalmMotion();
  const { ref, inView } = useEnter<HTMLDivElement>("-25%");
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (calm) {
      setStep(2);
      return;
    }
    if (!inView) return;
    setStep(0);
    const timers = [
      window.setTimeout(() => setStep(1), 900),
      window.setTimeout(() => setStep(2), 2000),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [inView, calm]);

  // Liked list: the two most similar rise to the top as the model updates.
  const likedOrder = step === 0 ? LIKED : [LIKED[1], LIKED[2], LIKED[0]];

  return (
    <section ref={ref} className="relative overflow-hidden bg-canvas py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="max-w-3xl">
          <SectionLabel>Continuous learning</SectionLabel>
          <h2 className="mt-4 text-balance text-[clamp(1.9rem,4.4vw,3.25rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-ink-900">
            The more you use it, <GradientText>the smarter it gets.</GradientText>
          </h2>
          <p className="mt-4 max-w-xl text-pretty text-base text-ink-500 sm:text-lg">
            tenderkhoj learns from your firm&rsquo;s actual behaviour to continuously improve future
            recommendations.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {/* ── Interested ─────────────────────────────────────────────── */}
          <Reveal i={0} className="h-full">
            <Panel
              tone="green"
              icon={<Heart className="h-3.5 w-3.5 fill-current" aria-hidden />}
              action="Interested"
              caption="Marking a tender interested pushes similar opportunities up your recommendations."
            >
              <ul className="space-y-2">
                {likedOrder.map((item) => (
                  <motion.li
                    key={item.id}
                    layout={!calm}
                    transition={{ type: "spring", stiffness: 240, damping: 26 }}
                    className="flex items-center gap-2 rounded-xl border border-ink-900/8 bg-white px-3 py-2 shadow-card"
                  >
                    <TrendingUp className="h-3.5 w-3.5 shrink-0 text-success-600" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-medium text-ink-800">{item.title}</span>
                      <span className="block truncate text-2xs text-ink-400">{item.meta}</span>
                    </span>
                    <FitBadge value={item.fit} />
                  </motion.li>
                ))}
              </ul>
            </Panel>
          </Reveal>

          {/* ── Not for me ─────────────────────────────────────────────── */}
          <Reveal i={1} className="h-full">
            <Panel
              tone="rose"
              icon={<X className="h-3.5 w-3.5" aria-hidden />}
              action="Not for Me"
              caption="Dismissed categories gradually lose priority, so your feed keeps getting tighter."
            >
              <ul className="space-y-2">
                {DISMISSED.map((item, index) => (
                  <motion.li
                    key={item.id}
                    animate={
                      calm
                        ? undefined
                        : {
                            opacity: step >= 1 && index < 2 ? 0.35 : 1,
                            y: step >= 1 && index < 2 ? 6 : 0,
                            filter: step >= 1 && index < 2 ? "blur(1.5px)" : "blur(0px)",
                          }
                    }
                    transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-2 rounded-xl border border-ink-900/8 bg-white px-3 py-2 shadow-card"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink-300" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-medium text-ink-700">{item.title}</span>
                      <span className="block truncate text-2xs text-ink-400">{item.meta}</span>
                    </span>
                    <FitBadge value={item.fit} />
                  </motion.li>
                ))}
              </ul>
            </Panel>
          </Reveal>

          {/* ── New recommendation ─────────────────────────────────────── */}
          <Reveal i={2} className="h-full">
            <Panel
              tone="blue"
              icon={<span className="text-[0.6875rem]">✦</span>}
              action="New Recommendation"
              caption="The same opportunity is re-scored as tenderkhoj understands your firm better."
            >
              <div className="flex flex-col items-center">
                <FitRing key={step} value={SCORE_STEPS[step]} size={132} stroke={9} />
                <p className="mt-1 text-xs font-medium text-ink-500">
                  Widening of District Road — Pali
                </p>
                <div className="mt-4 flex items-center gap-2">
                  {SCORE_STEPS.map((score, index) => (
                    <span
                      key={score}
                      className={cn(
                        "rounded-full px-2 py-0.5 text-2xs font-bold tabular-nums transition-colors duration-500",
                        index === step
                          ? "bg-elec-600 text-white"
                          : index < step
                          ? "bg-elec-50 text-elec-600"
                          : "bg-ink-100 text-ink-300"
                      )}
                    >
                      {score}
                    </span>
                  ))}
                </div>
              </div>
            </Panel>
          </Reveal>
        </div>

      </div>
    </section>
  );
}
