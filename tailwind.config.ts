import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "rgb(var(--color-border) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        // Design system
        navy: {
          50: "#F0F4FF",
          100: "#E0E9FF",
          200: "#C7D7FE",
          300: "#A5B8FC",
          400: "#8193F8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
          950: "#1E1B4B",
        },
        ink: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617",
        },
        success: {
          50: "#F0FDF4",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
        },
        warning: {
          50: "#FFFBEB",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
        },
        danger: {
          50: "#FFF1F2",
          500: "#F43F5E",
          600: "#E11D48",
          700: "#BE123C",
        },
        // ── Landing page 2 palette ──────────────────────────────────────────
        /** Electric blue — primary accent for the marketing surface. */
        elec: {
          50: "#EFF5FF",
          100: "#DBE8FF",
          200: "#BDD5FF",
          300: "#90B8FF",
          400: "#5C91FF",
          500: "#2F6BFF",
          600: "#1B4DF5",
          700: "#173CD8",
          800: "#1833AE",
          900: "#1A3189",
          950: "#141F53",
        },
        /** Warm off-white canvas + near-black stage for dark sections. */
        canvas: {
          DEFAULT: "#FBFAF8",
          soft: "#F5F4F1",
          line: "#EBE9E4",
        },
        stage: {
          DEFAULT: "#0A0B12",
          soft: "#12141F",
          line: "#242739",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      boxShadow: {
        "card": "0 1px 3px 0 rgb(15 23 42 / 0.06), 0 1px 2px -1px rgb(15 23 42 / 0.04)",
        "card-hover": "0 4px 6px -1px rgb(15 23 42 / 0.08), 0 2px 4px -2px rgb(15 23 42 / 0.04)",
        "dropdown": "0 10px 15px -3px rgb(15 23 42 / 0.1), 0 4px 6px -4px rgb(15 23 42 / 0.05)",
        "sidebar": "1px 0 0 0 #E2E8F0",
        // Landing page 2
        "lift": "0 24px 48px -20px rgb(10 11 18 / 0.18), 0 8px 16px -12px rgb(10 11 18 / 0.12)",
        "lift-lg": "0 48px 96px -32px rgb(10 11 18 / 0.28), 0 16px 32px -20px rgb(10 11 18 / 0.14)",
        "glow": "0 0 0 1px rgb(47 107 255 / 0.12), 0 12px 36px -12px rgb(47 107 255 / 0.35)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      keyframes: {
        "slide-in-from-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(-4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        // ── Landing page 2 ────────────────────────────────────────────────
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "float-y": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "scan-y": {
          "0%": { transform: "translateY(-8%)", opacity: "0" },
          "10%, 90%": { opacity: "1" },
          "100%": { transform: "translateY(760%)", opacity: "0" },
        },
        "orb-drift": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "33%": { transform: "translate3d(6%,-4%,0) scale(1.08)" },
          "66%": { transform: "translate3d(-5%,5%,0) scale(0.96)" },
        },
        "grid-pan": {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "56px 56px" },
        },
        "shimmer": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(200%)" },
        },
        "caret": {
          "0%, 45%": { opacity: "1" },
          "50%, 95%": { opacity: "0" },
        },
        "ring-pulse": {
          "0%": { transform: "scale(0.9)", opacity: "0.55" },
          "70%, 100%": { transform: "scale(1.6)", opacity: "0" },
        },
        "dash": {
          to: { strokeDashoffset: "-24" },
        },
      },
      animation: {
        "slide-in-from-left": "slide-in-from-left 0.25s ease-out",
        "fade-in": "fade-in 0.15s ease-out",
        // Landing page 2
        "gradient-x": "gradient-x 7s ease infinite",
        "float-y": "float-y 6s ease-in-out infinite",
        "scan-y": "scan-y 4.5s cubic-bezier(0.4,0,0.2,1) infinite",
        "orb-drift": "orb-drift 18s ease-in-out infinite",
        "grid-pan": "grid-pan 8s linear infinite",
        "shimmer": "shimmer 2.4s ease-in-out infinite",
        "caret": "caret 1.1s step-end infinite",
        "ring-pulse": "ring-pulse 2.6s cubic-bezier(0.4,0,0.2,1) infinite",
        "dash": "dash 0.9s linear infinite",
      },
    }
  },
  plugins: []
};

export default config;
