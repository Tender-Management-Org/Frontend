"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, ArrowRight, CheckCircle2, FileText, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { DOC_LINES, EXTRACTED, REPOSITORY_MATCHES } from "../_data/content";
import { GradientText, SectionLabel, useCalmMotion } from "./primitives";

/* ── The tender document ──────────────────────────────────────────────────── */

function DocumentPage({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-ink-900/8 bg-white shadow-lift-lg",
        className
      )}
    >
      {/* Document header */}
      <div className="flex items-center justify-between gap-3 border-b border-ink-900/6 bg-canvas-soft/70 px-4 py-2.5">
        <span className="inline-flex items-center gap-2 text-2xs font-medium text-ink-500">
          <FileText className="h-3.5 w-3.5 text-danger-500" aria-hidden />
          NIT_RJ-PWD-2026-RD-4471.pdf
        </span>
        <span className="rounded-md bg-white px-2 py-0.5 text-[0.5625rem] font-semibold tabular-nums text-ink-400">
          Page 41 / 146
        </span>
      </div>

      {/* Body */}
      <div className="doc-body relative px-4 py-4 sm:px-6 sm:py-6">
        {/* Scanning beam */}
        <div
          className="doc-beam pointer-events-none absolute inset-x-0 top-0 z-10 h-16 opacity-0"
          aria-hidden
        >
          <div className="h-full w-full bg-[linear-gradient(180deg,transparent,rgba(47,107,255,0.14),transparent)]" />
          <div className="h-px w-full bg-elec-400 shadow-[0_0_18px_3px_rgba(47,107,255,0.6)]" />
        </div>

        <div className="space-y-[0.3rem] font-mono text-[0.5rem] leading-relaxed text-ink-500 sm:text-[0.625rem]">
          {DOC_LINES.map((line, index) => (
            <p
              key={index}
              className={cn(
                "relative whitespace-pre-wrap",
                line.text.startsWith("SECTION") && "pt-2 font-semibold text-ink-800",
                line.highlight && "doc-hl rounded px-1 -mx-1"
              )}
            >
              {line.text}
            </p>
          ))}
        </div>

        {/* Faded continuation */}
        <div className="mt-3 space-y-1.5" aria-hidden>
          {[92, 78, 96, 64, 88, 72].map((w, i) => (
            <div key={i} className="h-1 rounded-full bg-ink-100" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </div>
    </div>
  );
}

/* ── Extracted structured data ────────────────────────────────────────────── */

function ExtractPanel() {
  return (
    <div className="space-y-2.5">
      {EXTRACTED.map((group) => (
        <div
          key={group.title}
          className="extract-card rounded-2xl border border-ink-900/8 bg-white/92 p-3.5 shadow-lift backdrop-blur-xl"
        >
          <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-ink-400">
            {group.title}
          </p>
          <ul className="mt-2 space-y-1.5">
            {group.items.map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-2xs">
                {item.state === "ok" ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success-600" aria-hidden />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-warning-600" aria-hidden />
                )}
                <span className={cn("flex-1", item.state === "warn" ? "text-warning-700" : "text-ink-700")}>
                  {item.label}
                </span>
                {item.value && <span className="font-semibold tabular-nums text-ink-900">{item.value}</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ── Requirement → repository → verdict ───────────────────────────────────── */

function RepoPanel() {
  return (
    <div className="w-full rounded-3xl border border-ink-900/8 bg-white/95 p-4 shadow-lift-lg backdrop-blur-xl sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 text-2xs font-semibold uppercase tracking-[0.16em] text-ink-400">
          <FolderOpen className="h-3.5 w-3.5 text-elec-500" aria-hidden />
          Matched against your document repository
        </p>
        <span className="rounded-full bg-success-50 px-2 py-0.5 text-[0.5625rem] font-bold text-success-700">
          3 / 4 ready
        </span>
      </div>

      <ul className="mt-3 space-y-2">
        {REPOSITORY_MATCHES.map((row) => (
          <li
            key={row.requirement}
            className="repo-row grid grid-cols-[1fr_auto_auto] items-center gap-2 rounded-xl border border-ink-900/6 bg-canvas-soft/60 px-3 py-2 sm:gap-3"
          >
            <span className="truncate text-2xs font-medium text-ink-700">{row.requirement}</span>
            <ArrowRight className="h-3 w-3 text-ink-300" aria-hidden />
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.5625rem] font-bold",
                row.state === "ok" ? "bg-success-50 text-success-700" : "bg-warning-50 text-warning-700"
              )}
            >
              {row.state === "ok" ? (
                <CheckCircle2 className="h-3 w-3" aria-hidden />
              ) : (
                <AlertTriangle className="h-3 w-3" aria-hidden />
              )}
              {row.result}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Section ──────────────────────────────────────────────────────────────── */

export function DocIntel() {
  const calm = useCalmMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (calm) return;
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();

        const build = (shiftX: number) => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.7,
            },
            defaults: { ease: "power2.out" },
          });

          // 1 — the document dominates the screen
          gsap.set(".doc-stage", { scale: 1.12, xPercent: 0, transformOrigin: "50% 35%" });
          gsap.set(".doc-hl", { backgroundColor: "rgba(47,107,255,0)", color: "#64748B" });
          gsap.set([".extract-card", ".repo-panel"], { opacity: 0, y: 26 });
          gsap.set(".repo-row", { opacity: 0, x: -12 });
          gsap.set(".headline-2, .headline-3", { opacity: 0, y: 18 });
          // Animate `top` (a % of the document body it is positioned in) rather
          // than yPercent (a % of the beam itself), so the sweep covers the full
          // page height at every breakpoint.
          gsap.set(".doc-beam", { opacity: 0, top: "-12%" });

          // 2 — the question
          tl.to(".headline-1", { opacity: 0, y: -18, duration: 0.6 }, 0.1)
            .to(".headline-2", { opacity: 1, y: 0, duration: 0.6 }, 0.16)

            // 3 — the document steps aside and the scan runs
            .to(".doc-stage", { scale: 1, xPercent: shiftX, duration: 1 }, 0.3)
            .to(".doc-beam", { opacity: 1, duration: 0.2 }, 0.42)
            .to(".doc-beam", { top: "102%", duration: 1.5, ease: "none" }, 0.46)
            .to(
              ".doc-hl",
              {
                backgroundColor: "rgba(47,107,255,0.12)",
                color: "#1B4DF5",
                duration: 0.35,
                stagger: 0.18,
              },
              0.6
            )
            .to(".doc-beam", { opacity: 0, duration: 0.25 }, 1.95)

            // 4 — structured data lands on the right
            .to(".extract-card", { opacity: 1, y: 0, duration: 0.7, stagger: 0.22 }, 1.0)

            // 5 — matched against the repository
            .to(".headline-2", { opacity: 0, y: -18, duration: 0.35 }, 2.05)
            .to(".headline-3", { opacity: 1, y: 0, duration: 0.5 }, 2.45)
            .to(".extract-card", { opacity: 0.35, y: -10, duration: 0.6 }, 2.2)
            .to(".repo-panel", { opacity: 1, y: 0, duration: 0.7 }, 2.35)
            .to(".repo-row", { opacity: 1, x: 0, duration: 0.5, stagger: 0.16 }, 2.5)

            // 6 — clear the stage, then land the payoff on an empty canvas
            .to(".headline-3", { opacity: 0, y: -18, duration: 0.4 }, 3.1)
            .to(".doc-stage-wrap", { opacity: 0, scale: 0.96, duration: 0.6 }, 3.1)
            .to(".finale", { opacity: 1, y: 0, duration: 0.6 }, 3.4);

          return () => tl.scrollTrigger?.kill();
        };

        mm.add("(min-width: 1024px)", () => build(-26));
        mm.add("(max-width: 1023.98px)", () => build(0));
      }, root);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [calm]);

  /* ── Reduced motion: everything visible, no timeline ───────────────────── */
  if (calm) {
    return (
      <section className="relative bg-canvas py-24">
        <div className="mx-auto max-w-6xl px-5">
          <SectionLabel>Document Intelligence</SectionLabel>
          <h2 className="mt-4 max-w-3xl text-[clamp(1.8rem,4.2vw,3rem)] font-semibold tracking-[-0.04em] text-ink-900">
            A 146-page tender document. You shouldn&rsquo;t have to read all of it to know whether you
            qualify.
          </h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <DocumentPage />
            <div className="space-y-4">
              <ExtractPanel />
              <RepoPanel />
            </div>
          </div>
          <p className="mt-8 max-w-2xl text-base text-ink-500">
            Document Intelligence extracts eligibility criteria, required documents and submission
            requirements, then compares them with your firm&rsquo;s profile and document repository.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={rootRef} className="relative h-[520vh] bg-canvas">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden px-4 pt-20 sm:px-5">
        {/* Headlines */}
        <div className="relative mx-auto mb-5 h-[6.5rem] w-full max-w-4xl text-center sm:mb-6 sm:h-28">
          <div className="headline-1 absolute inset-x-0 top-0">
            <SectionLabel>Document Intelligence</SectionLabel>
            <h2 className="mt-3 text-balance text-[clamp(1.8rem,4.6vw,3.25rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-ink-900">
              A 146-page tender document.
            </h2>
          </div>
          <div className="headline-2 absolute inset-x-0 top-0">
            <SectionLabel>Document Intelligence</SectionLabel>
            <h2 className="mt-3 text-balance text-[clamp(1.4rem,3.6vw,2.5rem)] font-semibold leading-[1.06] tracking-[-0.04em] text-ink-900">
              You shouldn&rsquo;t have to read all of it{" "}
              <span className="text-ink-400">to know whether you qualify.</span>
            </h2>
          </div>
          <div className="headline-3 absolute inset-x-0 top-0">
            <SectionLabel>Eligibility &amp; document readiness</SectionLabel>
            <h2 className="mt-3 text-balance text-[clamp(1.4rem,3.6vw,2.5rem)] font-semibold leading-[1.06] tracking-[-0.04em] text-ink-900">
              Every requirement, checked against{" "}
              <GradientText>your own documents.</GradientText>
            </h2>
          </div>
        </div>

        {/* Stage — one DOM tree at every breakpoint, so the timeline targets
            exactly one set of elements. The document is height-capped on small
            screens so the extracted panels always stay above the fold. */}
        <div className="doc-stage-wrap relative mx-auto grid w-full max-w-6xl flex-none grid-cols-1 items-start gap-4 lg:grid-cols-2 lg:gap-5">
          <div className="doc-stage mx-auto w-full max-w-lg will-change-transform">
            <div className="relative max-h-[28svh] overflow-hidden rounded-2xl lg:max-h-[46svh]">
              <DocumentPage />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-canvas to-transparent"
              />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <ExtractPanel />
            <div className="repo-panel pointer-events-none absolute inset-0 flex items-start rounded-3xl bg-canvas/90 backdrop-blur-[2px]">
              <RepoPanel />
            </div>
          </div>
        </div>

        {/* Finale */}
        <div className="finale pointer-events-none absolute inset-0 z-30 flex translate-y-6 items-center justify-center bg-canvas px-5 text-center opacity-0">
          <div>
            <h3 className="mx-auto max-w-3xl text-balance text-[clamp(1.6rem,4.4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-ink-900">
              From hundreds of pages to <GradientText>one clear action plan.</GradientText>
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-base text-ink-500">
              Document Intelligence extracts eligibility criteria, required documents and submission
              requirements, then compares them with your firm&rsquo;s profile and document repository.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
