import Link from "next/link";
import { FileSearch, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Tenders by Category — TenderKhoj",
  description:
    "Browse government tenders by popular categories — Solar, Railway, IT, Construction, Medical and more. Find the right opportunities on TenderKhoj.",
};

const CATEGORIES = [
  {
    name: "Solar Tenders",
    description: "Solar energy, rooftop solar, solar park procurement",
    query: "solar",
    icon: "☀️",
  },
  {
    name: "Railway Tenders",
    description: "Indian Railways, metro rail, track and infrastructure",
    query: "railway",
    icon: "🚆",
  },
  {
    name: "Information Technology",
    description: "Software, hardware, networking, e-governance",
    query: "information technology",
    icon: "💻",
  },
  {
    name: "Pharmaceutical Tenders",
    description: "Drugs, medicines, pharma supply and procurement",
    query: "pharmaceutical",
    icon: "💊",
  },
  {
    name: "Renewable Energy",
    description: "Wind, solar, hydro and clean energy projects",
    query: "renewable energy",
    icon: "⚡",
  },
  {
    name: "Infrastructure",
    description: "Roads, bridges, ports and civil infrastructure",
    query: "infrastructure",
    icon: "🏗️",
  },
  {
    name: "Construction",
    description: "Buildings, civil works, residential and commercial",
    query: "construction",
    icon: "🏛️",
  },
  {
    name: "Smart City",
    description: "Smart city mission projects and urban tech",
    query: "smart city",
    icon: "🌆",
  },
  {
    name: "Defence Tenders",
    description: "Defence ministry, military equipment and services",
    query: "defence",
    icon: "🛡️",
  },
  {
    name: "Medical & Healthcare",
    description: "Medical equipment, hospital supplies, healthcare",
    query: "medical",
    icon: "🏥",
  },
  {
    name: "Transportation",
    description: "Vehicles, logistics, road transport services",
    query: "transportation",
    icon: "🚛",
  },
  {
    name: "Water & Sanitation",
    description: "Water supply, sewage, AMRUT and sanitation",
    query: "water",
    icon: "💧",
  },
  {
    name: "Education Tenders",
    description: "Schools, universities, e-learning and education",
    query: "education",
    icon: "🎓",
  },
  {
    name: "Agriculture",
    description: "Farming equipment, seeds, irrigation and agri-tech",
    query: "agriculture",
    icon: "🌾",
  },
  {
    name: "Power & Electricity",
    description: "Power distribution, transmission and generation",
    query: "power",
    icon: "🔌",
  },
  {
    name: "Telecom Tenders",
    description: "Broadband, network infrastructure, BharatNet",
    query: "telecom",
    icon: "📡",
  },
];

export default function TendersByCategoryPage() {
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
      <section className="border-b border-ink-100 bg-navy-950 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-4 text-sm text-navy-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white font-medium">Browse by Category</span>
          </div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Tenders by Category
          </h1>
          <p className="mt-2 text-navy-300 max-w-xl">
            Explore government procurement across {CATEGORIES.length} popular categories.
            Find the right tenders for your industry.
          </p>
        </div>
      </section>

      {/* ── Category Grid ── */}
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/tenders?search=${encodeURIComponent(cat.query)}`}
              className="group relative flex flex-col gap-2 rounded-xl border border-ink-100 bg-white p-5 shadow-sm transition-all hover:border-navy-200 hover:shadow-card"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl" role="img" aria-label={cat.name}>
                  {cat.icon}
                </span>
                <ChevronRight className="h-4 w-4 text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-navy-500" />
              </div>
              <h2 className="text-sm font-semibold text-ink-900 group-hover:text-navy-700 transition-colors leading-snug">
                {cat.name}
              </h2>
              <p className="text-xs text-ink-400 leading-relaxed">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>

        {/* ── Also browse by ── */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/browse/states"
            className="rounded-lg border border-ink-200 px-5 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50 transition-colors"
          >
            Browse by State
          </Link>
          <Link
            href="/browse/sectors"
            className="rounded-lg border border-ink-200 px-5 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50 transition-colors"
          >
            Browse by Sector
          </Link>
        </div>

        {/* ── CTA ── */}
        <div className="mt-8 rounded-2xl bg-navy-50 border border-navy-100 px-6 py-8 text-center">
          <h2 className="text-lg font-semibold text-ink-900">
            Get AI-matched tenders for your firm
          </h2>
          <p className="mt-2 text-sm text-ink-500">
            TenderKhoj goes beyond categories — it uses AI to surface the exact tenders your firm can win.
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
          <Link href="/browse/states" className="hover:text-ink-600 transition-colors">Browse by State</Link>
          <Link href="/browse/categories" className="hover:text-ink-600 transition-colors font-medium text-ink-600">Browse by Category</Link>
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
