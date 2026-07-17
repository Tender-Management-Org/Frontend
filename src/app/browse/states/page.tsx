import Link from "next/link";
import { FileSearch, MapPin } from "lucide-react";

export const metadata = {
  title: "Tenders by State — TenderKhoj",
  description:
    "Browse government tenders across all Indian states and Union Territories. Find procurement opportunities in your state on TenderKhoj.",
};

const STATES = [
  { name: "Andaman & Nicobar Islands", location: "Andaman" },
  { name: "Andhra Pradesh", location: "Andhra Pradesh" },
  { name: "Arunachal Pradesh", location: "Arunachal Pradesh" },
  { name: "Assam", location: "Assam" },
  { name: "Bihar", location: "Bihar" },
  { name: "Chandigarh", location: "Chandigarh" },
  { name: "Chhattisgarh", location: "Chhattisgarh" },
  { name: "Dadra & Nagar Haveli", location: "Dadra" },
  { name: "Daman & Diu", location: "Daman" },
  { name: "Delhi", location: "Delhi" },
  { name: "Goa", location: "Goa" },
  { name: "Gujarat", location: "Gujarat" },
  { name: "Haryana", location: "Haryana" },
  { name: "Himachal Pradesh", location: "Himachal Pradesh" },
  { name: "Jammu & Kashmir", location: "Jammu" },
  { name: "Jharkhand", location: "Jharkhand" },
  { name: "Karnataka", location: "Karnataka" },
  { name: "Kerala", location: "Kerala" },
  { name: "Ladakh", location: "Ladakh" },
  { name: "Lakshadweep", location: "Lakshadweep" },
  { name: "Madhya Pradesh", location: "Madhya Pradesh" },
  { name: "Maharashtra", location: "Maharashtra" },
  { name: "Manipur", location: "Manipur" },
  { name: "Meghalaya", location: "Meghalaya" },
  { name: "Mizoram", location: "Mizoram" },
  { name: "Nagaland", location: "Nagaland" },
  { name: "Odisha", location: "Odisha" },
  { name: "Puducherry", location: "Puducherry" },
  { name: "Punjab", location: "Punjab" },
  { name: "Rajasthan", location: "Rajasthan" },
  { name: "Sikkim", location: "Sikkim" },
  { name: "Tamil Nadu", location: "Tamil Nadu" },
  { name: "Telangana", location: "Telangana" },
  { name: "Tripura", location: "Tripura" },
  { name: "Uttar Pradesh", location: "Uttar Pradesh" },
  { name: "Uttarakhand", location: "Uttarakhand" },
  { name: "West Bengal", location: "West Bengal" },
];

export default function TendersByStatePage() {
  return (
    <div className="min-h-screen bg-white font-sans text-ink-900">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-20 border-b border-ink-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-600">
              <FileSearch className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-ink-900">TenderKhoj</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-ink-600 hover:text-ink-900 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-navy-600 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="border-b border-ink-100 bg-ink-50 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-3 text-sm text-ink-500">
            <Link href="/" className="hover:text-navy-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-ink-900 font-medium">Browse by State</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-600">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-ink-900 sm:text-3xl">
                Tenders by State
              </h1>
              <p className="mt-1 text-ink-500">
                Browse government procurement opportunities across all {STATES.length} Indian states and Union Territories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── State Grid ── */}
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-px bg-ink-100 overflow-hidden rounded-2xl border border-ink-100 shadow-sm sm:grid-cols-2 lg:grid-cols-3">
          {STATES.map((state) => (
            <Link
              key={state.name}
              href={`/tenders?location=${encodeURIComponent(state.location)}`}
              className="group flex items-center gap-3 bg-white px-5 py-4 transition-colors hover:bg-navy-50"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success-50">
                <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 text-success-600" stroke="currentColor" strokeWidth={2.5}>
                  <polyline points="2.5 8 6 11.5 13 4.5" />
                </svg>
              </span>
              <span className="text-sm font-medium text-ink-800 group-hover:text-navy-700 transition-colors">
                {state.name}
              </span>
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="ml-auto h-3.5 w-3.5 shrink-0 text-ink-300 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          ))}
        </div>

        {/* ── CTA ── */}
        <div className="mt-12 rounded-2xl bg-navy-50 border border-navy-100 px-6 py-8 text-center">
          <h2 className="text-lg font-semibold text-ink-900">
            Get notified about tenders in your state
          </h2>
          <p className="mt-2 text-sm text-ink-500">
            TenderKhoj monitors new tenders daily and matches them to your firm automatically.
          </p>
          <Link
            href="/register"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-navy-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 transition-colors"
          >
            Start for free
          </Link>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-ink-100 py-8 text-center text-sm text-ink-400">
        <div className="flex flex-wrap justify-center gap-5 mb-3">
          <Link href="/browse/states" className="hover:text-ink-600 transition-colors font-medium text-ink-600">Browse by State</Link>
          <Link href="/browse/categories" className="hover:text-ink-600 transition-colors">Browse by Category</Link>
          <Link href="/browse/sectors" className="hover:text-ink-600 transition-colors">Browse by Sector</Link>
        </div>
        <div className="flex flex-wrap justify-center gap-5 mb-3">
          <Link href="/terms" className="hover:text-ink-600 transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-ink-600 transition-colors">Privacy</Link>
          <Link href="/disclaimer" className="hover:text-ink-600 transition-colors">Disclaimer</Link>
          <Link href="/contact" className="hover:text-ink-600 transition-colors">Contact</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} TenderKhoj, operated by Vaibhav Paliwal</p>
      </footer>
    </div>
  );
}
