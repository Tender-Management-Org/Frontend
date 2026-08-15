import Link from "next/link";
import { ArrowRight, Tags } from "lucide-react";
import { BrowseCta, SiteHeader, SubpageHero } from "../../_landing/_components/SiteHeader";
import { Footer } from "../../_landing/_components/Footer";

export const metadata = {
  title: "Tenders by Category — tenderkhoj",
  description:
    "Browse government tenders by popular categories — Solar, Railway, IT, Construction, Medical and more. Find the right opportunities on tenderkhoj.",
  alternates: { canonical: "/browse/categories" },
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
    <div className="min-h-screen bg-canvas text-ink-900 antialiased">
      <SiteHeader active="/browse/categories" />

      <SubpageHero
        breadcrumb="Browse by Category"
        title={
          <>
            Tenders by <span className="text-elec-600">Category</span>
          </>
        }
        subtitle={`Government procurement across ${CATEGORIES.length} popular categories. Each one opens the dashboard with that search already applied.`}
        icon={<Tags className="h-5 w-5" aria-hidden />}
      />

      <main className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <li key={cat.name}>
              <Link
                href={`/tenders?search=${encodeURIComponent(cat.query)}`}
                className="group flex h-full flex-col rounded-3xl border border-ink-900/8 bg-white/80 p-5 shadow-card backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-elec-500/25 hover:shadow-lift-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elec-500"
              >
                <div className="flex items-start justify-between gap-3">
                  <span aria-hidden className="text-2xl leading-none">
                    {cat.icon}
                  </span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-ink-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-elec-600"
                    aria-hidden
                  />
                </div>
                <h2 className="mt-4 text-sm font-semibold tracking-tight text-ink-900 transition-colors group-hover:text-elec-700">
                  {cat.name}
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-500">{cat.description}</p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="text-ink-400">Or browse</span>
          <Link
            href="/browse/states"
            className="rounded-full border border-ink-900/10 bg-white px-4 py-2 font-medium text-ink-700 transition-colors hover:border-elec-500/30 hover:text-elec-700"
          >
            By State
          </Link>
          <Link
            href="/browse/sectors"
            className="rounded-full border border-ink-900/10 bg-white px-4 py-2 font-medium text-ink-700 transition-colors hover:border-elec-500/30 hover:text-elec-700"
          >
            By Sector
          </Link>
        </div>

        <BrowseCta
          title="Get AI-matched tenders for your firm"
          body="tenderkhoj goes beyond categories — it reads your firm profile and surfaces the exact tenders you can realistically win, each with a personalized Fit Score."
        />
      </main>

      <Footer />
    </div>
  );
}
