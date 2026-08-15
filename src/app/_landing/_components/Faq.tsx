"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAQS } from "../_data/content";
import { Reveal, SectionLabel, useCalmMotion } from "./primitives";

export function Faq() {
  const calm = useCalmMotion();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative bg-canvas py-24 sm:py-28">
      <div className="mx-auto max-w-3xl px-5">
        <Reveal className="text-center">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="mt-4 text-balance text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-ink-900">
            Questions bid teams ask us
          </h2>
        </Reveal>

        <ul className="mt-10 space-y-2">
          {FAQS.map((item, index) => {
            const isOpen = open === index;
            return (
              <Reveal key={item.q} i={index} as="li">
                <div className="overflow-hidden rounded-2xl border border-ink-900/8 bg-white/80 backdrop-blur-xl transition-colors duration-300 hover:border-ink-900/16">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elec-500"
                    >
                      <span className="text-base font-semibold text-ink-900">{item.q}</span>
                      <Plus
                        className={cn(
                          "h-4 w-4 shrink-0 text-ink-400 transition-transform duration-300",
                          isOpen && "rotate-45 text-elec-600"
                        )}
                        aria-hidden
                      />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={calm ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={calm ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-base leading-relaxed text-ink-500">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
