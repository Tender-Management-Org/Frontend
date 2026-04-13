import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "#e5e7eb",
        muted: "#6b7280",
        background: "#f8fafc",
        surface: "#ffffff"
      }
    }
  },
  plugins: []
};

export default config;
