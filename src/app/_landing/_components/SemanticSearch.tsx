"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CornerDownLeft, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { SEARCH_SCENES } from "../_data/content";
import { GradientText, Reveal, SectionLabel, useCalmMotion, useEnter } from "./primitives";
import { TenderChip } from "./TenderUI";

type Phase = "typing" | "submitting" | "results";

const TYPE_MS = 34;
const HOLD_MS = 2600;

export function SemanticSearch() {
  const calm = useCalmMotion();
  const { ref, inView } = useEnter<HTMLDivElement>("-25%");

  const [scene, setScene] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");

  const query = SEARCH_SCENES[scene].query;
  const results = SEARCH_SCENES[scene].results;

  /* Typing → submit → results → next scene, looping while visible. */
  useEffect(() => {
    if (calm) {
      setTyped(query);
      setPhase("results");
      return;
    }
    if (!inView) return;

    let cancelled = false;
    const timers: number[] = [];
    setTyped("");
    setPhase("typing");

    let i = 0;
    const typeNext = () => {
      if (cancelled) return;
      i += 1;
      setTyped(query.slice(0, i));
      if (i < query.length) {
        timers.push(window.setTimeout(typeNext, TYPE_MS));
      } else {
        timers.push(
          window.setTimeout(() => {
            if (cancelled) return;
            setPhase("submitting");
            timers.push(
              window.setTimeout(() => {
                if (cancelled) return;
                setPhase("results");
                timers.push(
                  window.setTimeout(() => {
                    if (cancelled) return;
                    setScene((s) => (s + 1) % SEARCH_SCENES.length);
                  }, HOLD_MS)
                );
              }, 620)
            );
          }, 480)
        );
      }
    };
    timers.push(window.setTimeout(typeNext, 420));

    return () => {
      cancelled = true;
      timers.forEach(window.clearTimeout);
    };
  }, [inView, scene, query, calm]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-canvas py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(47,107,255,0.10),transparent_66%)] blur-3xl"
      />

      <div className="relative mx-auto max-w-3xl px-5 text-center">
        <Reveal>
          <SectionLabel>Semantic search</SectionLabel>
          <h2 className="mt-4 text-balance text-[clamp(1.9rem,4.6vw,3.25rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-ink-900">
            Search tenders <GradientText>like you think.</GradientText>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-ink-500 sm:text-lg">
            No complicated filters. No exact keyword matching. Describe what you&rsquo;re looking for in
            natural language.
          </p>
        </Reveal>

        {/* Search box */}
        <Reveal delay={0.1} className="mt-10">
          <div
            className={cn(
              "flex items-center gap-3 rounded-2xl border bg-white/90 px-4 py-3.5 text-left shadow-lift backdrop-blur-xl transition-all duration-300 sm:px-5",
              phase === "typing" ? "border-elec-500/40 shadow-glow" : "border-ink-900/8"
            )}
          >
            <Search className="h-4.5 w-4.5 shrink-0 text-ink-400" aria-hidden />
            <p className="min-w-0 flex-1 truncate text-sm text-ink-800 sm:text-base" aria-live="polite">
              {typed || <span className="text-ink-300">Describe the opportunity you&rsquo;re looking for…</span>}
              {!calm && phase === "typing" && (
                <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-elec-500 align-middle animate-caret" aria-hidden />
              )}
            </p>
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-2xs font-semibold transition-colors",
                phase === "typing" ? "bg-ink-100 text-ink-400" : "bg-stage text-white"
              )}
            >
              {phase === "submitting" ? (
                <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
              ) : (
                <CornerDownLeft className="h-3 w-3" aria-hidden />
              )}
              Enter
            </span>
          </div>
        </Reveal>

        {/* Results */}
        <div className="relative mt-4 min-h-[13rem]">
          <AnimatePresence mode="wait">
            {phase === "results" && (
              <motion.ul
                key={scene}
                initial={calm ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={calm ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-2 text-left"
              >
                {results.map((result, index) => (
                  <motion.li
                    key={result.title}
                    initial={calm ? false : { opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <TenderChip title={result.title} meta={result.meta} fit={result.fit} />
                  </motion.li>
                ))}
                <motion.li
                  initial={calm ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="pt-1 text-center text-xs text-ink-400"
                >
                  Ranked by semantic relevance to your firm profile
                </motion.li>
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Scene indicator */}
        {!calm && (
          <div className="mt-2 flex items-center justify-center gap-1.5">
            {SEARCH_SCENES.map((s, index) => (
              <span
                key={s.query}
                className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  index === scene ? "w-6 bg-elec-500" : "w-1.5 bg-ink-200"
                )}
                aria-hidden
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
