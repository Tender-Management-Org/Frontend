"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────────────────
   Motion helpers
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * `true` when the user has asked the OS to reduce motion.
 *
 * Several sections render a completely different (static) tree in calm mode, so
 * this deliberately reports `false` for the server render and the first client
 * render — otherwise the two trees disagree and React bails out of hydration.
 * The static version swaps in on the commit right after mount.
 */
export function useCalmMotion(): boolean {
  const reduced = useReducedMotion() ?? false;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && reduced;
}

/** The root margin string accepted by Framer's `useInView`, derived from it. */
type ViewMargin = NonNullable<Parameters<typeof useInView>[1]>["margin"];

/**
 * Fires once when the element scrolls into view. Used for count-ups and
 * imperative (GSAP) timelines that should not run off-screen.
 */
export function useEnter<T extends HTMLElement = HTMLDivElement>(margin: ViewMargin = "-15%") {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, margin });
  return { ref, inView };
}

/* ────────────────────────────────────────────────────────────────────────────
   Reveal — the one entrance animation used across the page
   ──────────────────────────────────────────────────────────────────────────── */

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger index — multiplied by 60ms. */
  i?: number;
  delay?: number;
  y?: number;
  /** Adds a short blur-to-sharp transition. */
  blur?: boolean;
  as?: "div" | "li" | "span" | "section";
};

export function Reveal({
  children,
  className,
  i = 0,
  delay = 0,
  y = 22,
  blur = false,
  as = "div",
}: RevealProps) {
  const calm = useCalmMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (calm) return <MotionTag className={className}>{children}</MotionTag>;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y, filter: blur ? "blur(10px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{
        duration: 0.7,
        delay: delay + i * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </MotionTag>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Buttons
   ──────────────────────────────────────────────────────────────────────────── */

type ButtonProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "ghost" | "onDark";
  className?: string;
  icon?: ReactNode;
  /** Slides the icon on hover instead of nudging it. */
  slideIcon?: boolean;
};

/**
 * CTA with a restrained magnetic pull on pointer devices. The transform is
 * applied to a wrapper so the button's own hover/active states stay intact.
 */
export function MagneticButton({
  children,
  href,
  variant = "primary",
  className,
  icon,
  slideIcon = true,
}: ButtonProps) {
  const calm = useCalmMotion();
  const wrapRef = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 280, damping: 22, mass: 0.4 });

  const handleMove = useCallback(
    (event: React.PointerEvent) => {
      if (calm || event.pointerType !== "mouse") return;
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      x.set(((event.clientX - rect.left) / rect.width - 0.5) * 14);
      y.set(((event.clientY - rect.top) / rect.height - 0.5) * 10);
    },
    [calm, x, y]
  );

  const reset = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const base =
    "group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold tracking-tight transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-elec-500";

  const variants = {
    primary:
      "bg-stage text-white shadow-lift hover:bg-elec-600 focus-visible:ring-offset-canvas",
    ghost:
      "border border-ink-900/12 bg-white/70 text-ink-800 backdrop-blur hover:border-ink-900/25 hover:bg-white focus-visible:ring-offset-canvas",
    onDark:
      "bg-white text-stage shadow-lift hover:bg-elec-50 focus-visible:ring-offset-stage",
  } as const;

  return (
    <motion.span
      ref={wrapRef}
      style={calm ? undefined : { x: sx, y: sy }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className="inline-block"
    >
      <Link href={href} className={cn(base, variants[variant], className)}>
        <span>{children}</span>
        {icon && (
          <span
            className={cn(
              "transition-transform duration-300 ease-out",
              slideIcon && "group-hover:translate-x-1"
            )}
          >
            {icon}
          </span>
        )}
      </Link>
    </motion.span>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Typography helpers
   ──────────────────────────────────────────────────────────────────────────── */

export function GradientText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "bg-[linear-gradient(100deg,#1B4DF5_0%,#7C5CFF_35%,#2F6BFF_60%,#1B4DF5_100%)] bg-[length:250%_100%] bg-clip-text text-transparent",
        "motion-safe:animate-gradient-x",
        className
      )}
    >
      {children}
    </span>
  );
}

export function Pill({
  children,
  tone = "light",
  className,
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium tracking-tight backdrop-blur",
        tone === "light"
          ? "border-ink-900/10 bg-white/70 text-ink-600"
          : "border-white/15 bg-white/5 text-white/70",
        className
      )}
    >
      {children}
    </span>
  );
}

export function SectionLabel({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" }) {
  return (
    <p
      className={cn(
        "text-2xs font-semibold uppercase tracking-[0.22em]",
        tone === "light" ? "text-elec-600" : "text-elec-300"
      )}
    >
      {children}
    </p>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Numbers
   ──────────────────────────────────────────────────────────────────────────── */

/** Counts from 0 to `value` the first time it enters the viewport. */
export function CountUp({
  value,
  duration = 1.4,
  className,
  suffix = "",
  format,
}: {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
  format?: (n: number) => string;
}) {
  const calm = useCalmMotion();
  const { ref, inView } = useEnter<HTMLSpanElement>("-20%");
  const [display, setDisplay] = useState(calm ? value : 0);

  useEffect(() => {
    if (calm) {
      setDisplay(value);
      return;
    }
    if (!inView) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setDisplay(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration, calm]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {format ? format(display) : display.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Fit Score ring
   ──────────────────────────────────────────────────────────────────────────── */

export function FitRing({
  value,
  size = 168,
  stroke = 10,
  label,
  sublabel,
  /** Optional external driver (0–1) for scroll-scrubbed usage. */
  progress,
  className,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
  progress?: MotionValue<number>;
  className?: string;
}) {
  const calm = useCalmMotion();
  const { ref, inView } = useEnter<HTMLDivElement>("-20%");
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  // Hooks must run unconditionally — this fallback is unused when `progress` is set.
  const fallbackProgress = useMotionValue(0);

  const [autoPct, setAutoPct] = useState(calm ? value / 100 : 0);
  useEffect(() => {
    if (progress) return;
    if (calm) {
      setAutoPct(value / 100);
      return;
    }
    if (!inView) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1500);
      const eased = 1 - Math.pow(1 - t, 3);
      setAutoPct((value / 100) * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, calm, progress]);

  const driver = progress ?? fallbackProgress;
  const drivenOffset = useTransform(driver, (p) => circumference * (1 - (p * value) / 100));

  // Keep the printed number in step with an externally driven ring.
  const [drivenValue, setDrivenValue] = useState(calm ? value : 0);
  useEffect(() => {
    if (!progress) return;
    if (calm) {
      setDrivenValue(value);
      return;
    }
    setDrivenValue(Math.round(progress.get() * value));
    return progress.on("change", (p) => setDrivenValue(Math.round(p * value)));
  }, [progress, value, calm]);

  return (
    <div ref={ref} className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90" role="img" aria-label={`Fit Score ${value} out of 100`}>
        <defs>
          <linearGradient id={`fit-grad-${size}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2F6BFF" />
            <stop offset="55%" stopColor="#7C5CFF" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E9EBF2" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#fit-grad-${size})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={
            progress
              ? { strokeDashoffset: drivenOffset }
              : { strokeDashoffset: circumference * (1 - autoPct) }
          }
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[2.6rem] font-semibold leading-none tracking-tight tabular-nums text-ink-900">
          {progress ? drivenValue : Math.round(autoPct * 100)}
        </span>
        {label && <span className="mt-1 text-xs font-semibold text-success-600">{label}</span>}
        {sublabel && <span className="text-2xs text-ink-400">{sublabel}</span>}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Backdrops
   ──────────────────────────────────────────────────────────────────────────── */

export function GridBackdrop({
  tone = "light",
  className,
  animated = false,
}: {
  tone?: "light" | "dark";
  className?: string;
  animated?: boolean;
}) {
  const line = tone === "light" ? "rgb(15 23 42 / 0.045)" : "rgb(255 255 255 / 0.05)";
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", animated && "motion-safe:animate-grid-pan", className)}
      style={{
        backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
        backgroundSize: "56px 56px",
        maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, #000 40%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, #000 40%, transparent 100%)",
      }}
    />
  );
}

export function Orb({
  className,
  style,
  color = "#2F6BFF",
}: {
  className?: string;
  style?: CSSProperties;
  color?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute rounded-full blur-3xl motion-safe:animate-orb-drift", className)}
      style={{ background: `radial-gradient(circle at 50% 50%, ${color}, transparent 68%)`, ...style }}
    />
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Tilt wrapper — subtle 3D response to the pointer
   ──────────────────────────────────────────────────────────────────────────── */

export function Tilt({
  children,
  className,
  max = 6,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const calm = useCalmMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 20 });
  const sry = useSpring(ry, { stiffness: 200, damping: 20 });

  const onMove = (event: React.PointerEvent) => {
    if (calm || event.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * max * 2);
    rx.set(-py * max * 2);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      style={calm ? undefined : { rotateX: srx, rotateY: sry, transformPerspective: 1200 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Deterministic pseudo-random — keeps SSR and client markup identical
   ──────────────────────────────────────────────────────────────────────────── */

export function useSeeded(count: number, seed = 1) {
  return useMemo(() => {
    const out: number[] = [];
    let s = seed;
    for (let i = 0; i < count; i += 1) {
      s = (s * 9301 + 49297) % 233280;
      out.push(s / 233280);
    }
    return out;
  }, [count, seed]);
}
