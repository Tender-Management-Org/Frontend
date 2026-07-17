"use client";

import Link from "next/link";
import { FileSearch, Search } from "lucide-react";
import { useState, useMemo } from "react";

const SECTORS: { letter: string; items: { name: string; query: string }[] }[] = [
  {
    letter: "A",
    items: [
      { name: "Agriculture and Related Services", query: "agriculture" },
      { name: "Animal Husbandry and Dairying", query: "animal husbandry" },
      { name: "Aviation and Aerospace", query: "aviation" },
    ],
  },
  {
    letter: "B",
    items: [
      { name: "Banking, Finance and Insurance", query: "banking finance" },
      { name: "Broadcasting and Media", query: "broadcasting" },
      { name: "Building and Construction", query: "building construction" },
    ],
  },
  {
    letter: "C",
    items: [
      { name: "Chemical and Petrochemical", query: "chemical" },
      { name: "Civil Engineering", query: "civil engineering" },
      { name: "Consultancy", query: "consultancy" },
      { name: "Consultancy - Engineering", query: "consultancy engineering" },
      { name: "Consultancy - Financial", query: "consultancy financial" },
      { name: "Consultancy - HR and Manpower", query: "consultancy hr" },
      { name: "Consultancy - IT", query: "consultancy it" },
      { name: "Consultancy - Legal", query: "consultancy legal" },
      { name: "Consultancy - Management", query: "consultancy management" },
      { name: "Construction and Civil Works", query: "construction civil" },
      { name: "Customs and Border Services", query: "customs" },
    ],
  },
  {
    letter: "D",
    items: [
      { name: "Defence and Military", query: "defence" },
      { name: "Disaster Management", query: "disaster management" },
      { name: "Drugs and Pharmaceuticals", query: "drugs pharmaceuticals" },
    ],
  },
  {
    letter: "E",
    items: [
      { name: "Education and Training", query: "education training" },
      { name: "Electrical and Electronics", query: "electrical electronics" },
      { name: "Energy - Non Renewable", query: "non renewable energy" },
      { name: "Energy - Renewable", query: "renewable energy" },
      { name: "Environment and Ecology", query: "environment" },
    ],
  },
  {
    letter: "F",
    items: [
      { name: "Fertilizers and Chemicals", query: "fertilizer" },
      { name: "Food Processing", query: "food processing" },
      { name: "Forestry and Wildlife", query: "forestry" },
    ],
  },
  {
    letter: "G",
    items: [
      { name: "Gems and Jewellery", query: "gems jewellery" },
      { name: "Geo Services and Surveying", query: "geo survey" },
    ],
  },
  {
    letter: "H",
    items: [
      { name: "Health and Medical", query: "health medical" },
      { name: "Horticulture", query: "horticulture" },
      { name: "Housing and Urban Development", query: "housing urban" },
      { name: "Human Resources", query: "human resources" },
    ],
  },
  {
    letter: "I",
    items: [
      { name: "Industrial Equipment and Machinery", query: "industrial equipment" },
      { name: "Infrastructure Development", query: "infrastructure" },
      { name: "Information Technology", query: "information technology" },
      { name: "Irrigation and Water Resources", query: "irrigation water" },
    ],
  },
  {
    letter: "J",
    items: [
      { name: "Jute and Textiles", query: "jute textile" },
    ],
  },
  {
    letter: "L",
    items: [
      { name: "Labour and Employment", query: "labour employment" },
      { name: "Legal and Law Enforcement", query: "legal" },
      { name: "Logistics and Supply Chain", query: "logistics supply chain" },
    ],
  },
  {
    letter: "M",
    items: [
      { name: "Mechanical Engineering", query: "mechanical engineering" },
      { name: "Medical Equipment and Devices", query: "medical equipment" },
      { name: "Mining and Minerals", query: "mining" },
      { name: "Municipal Services", query: "municipal" },
    ],
  },
  {
    letter: "N",
    items: [
      { name: "Natural Gas and Petroleum", query: "natural gas petroleum" },
      { name: "Naval and Maritime", query: "naval maritime" },
    ],
  },
  {
    letter: "O",
    items: [
      { name: "Oil and Gas", query: "oil gas" },
    ],
  },
  {
    letter: "P",
    items: [
      { name: "Paper and Printing", query: "paper printing" },
      { name: "Ports and Shipping", query: "ports shipping" },
      { name: "Power and Electricity", query: "power electricity" },
      { name: "Public Health Engineering", query: "public health engineering" },
    ],
  },
  {
    letter: "R",
    items: [
      { name: "Railways", query: "railway" },
      { name: "Real Estate and Property", query: "real estate" },
      { name: "Roads and Highways", query: "roads highways" },
      { name: "Rural Development", query: "rural development" },
    ],
  },
  {
    letter: "S",
    items: [
      { name: "Sanitation and Waste Management", query: "sanitation waste" },
      { name: "Security Services", query: "security" },
      { name: "Smart City Projects", query: "smart city" },
      { name: "Solar Energy", query: "solar" },
      { name: "Sports and Recreation", query: "sports" },
      { name: "Steel and Metals", query: "steel metals" },
    ],
  },
  {
    letter: "T",
    items: [
      { name: "Telecom and Networking", query: "telecom networking" },
      { name: "Textiles and Garments", query: "textile garment" },
      { name: "Tourism and Hospitality", query: "tourism hospitality" },
      { name: "Transportation and Logistics", query: "transportation" },
    ],
  },
  {
    letter: "U",
    items: [
      { name: "Urban Local Bodies", query: "urban local" },
    ],
  },
  {
    letter: "W",
    items: [
      { name: "Water Supply and Treatment", query: "water supply" },
      { name: "Welfare and Social Services", query: "welfare social" },
    ],
  },
];

const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function TendersBySectorPage() {
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q && !activeLetter) return SECTORS;
    return SECTORS.flatMap((group) => {
      if (activeLetter && group.letter !== activeLetter) return [];
      const items = q
        ? group.items.filter((i) => i.name.toLowerCase().includes(q))
        : group.items;
      if (!items.length) return [];
      return [{ ...group, items }];
    });
  }, [search, activeLetter]);

  const availableLetters = new Set(SECTORS.map((g) => g.letter));

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

      {/* ── Hero banner ── */}
      <section
        className="relative border-b border-ink-100 py-12 sm:py-16"
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #0f2540 50%, #162a45 100%)",
        }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-4 text-sm text-navy-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white font-medium">Browse by Sector</span>
          </div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Tenders by Sector
          </h1>
          <p className="mt-2 text-navy-300 max-w-xl">
            Explore tenders across all industries — from agriculture to telecom.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {/* ── Search + A-Z filter ── */}
        <div className="mb-8 rounded-2xl border border-ink-100 bg-ink-50 p-4 sm:p-6">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              placeholder="Search sector..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setActiveLetter(null); }}
              className="w-full rounded-lg border border-ink-200 bg-white py-2.5 pl-9 pr-4 text-sm text-ink-900 placeholder:text-ink-400 focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-100"
            />
          </div>

          {/* A-Z strip */}
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => { setActiveLetter(null); setSearch(""); }}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                !activeLetter && !search
                  ? "bg-navy-600 text-white"
                  : "bg-white border border-ink-200 text-ink-700 hover:border-navy-300 hover:text-navy-700"
              }`}
            >
              All
            </button>
            {ALL_LETTERS.map((l) => {
              const isAvail = availableLetters.has(l);
              const isActive = activeLetter === l;
              return (
                <button
                  key={l}
                  disabled={!isAvail}
                  onClick={() => { setActiveLetter(isActive ? null : l); setSearch(""); }}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                    !isAvail
                      ? "cursor-not-allowed text-ink-300"
                      : isActive
                      ? "bg-navy-600 text-white"
                      : "bg-white border border-ink-200 text-ink-700 hover:border-navy-300 hover:text-navy-700"
                  }`}
                >
                  {l}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Sector list ── */}
        {filtered.length === 0 ? (
          <p className="text-center text-ink-400 py-16">No sectors found for &ldquo;{search}&rdquo;</p>
        ) : (
          <div className="space-y-6">
            {filtered.map((group) => (
              <div key={group.letter}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-lg font-bold text-ink-900">{group.letter}</span>
                  <div className="h-px flex-1 bg-ink-100" />
                </div>
                <div className="grid gap-px bg-ink-100 overflow-hidden rounded-xl border border-ink-100 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((item) => (
                    <Link
                      key={item.name}
                      href={`/tenders?search=${encodeURIComponent(item.query)}`}
                      className="group flex items-center gap-3 bg-white px-4 py-3 transition-colors hover:bg-navy-50"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-50">
                        <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3 text-success-600" stroke="currentColor" strokeWidth={2.5}>
                          <polyline points="2.5 8 6 11.5 13 4.5" />
                        </svg>
                      </span>
                      <span className="text-sm text-ink-700 group-hover:text-navy-700 transition-colors">
                        {item.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── CTA ── */}
        <div className="mt-12 rounded-2xl bg-navy-50 border border-navy-100 px-6 py-8 text-center">
          <h2 className="text-lg font-semibold text-ink-900">
            Let AI find the right sectors for your firm
          </h2>
          <p className="mt-2 text-sm text-ink-500">
            TenderKhoj analyses your firm profile and automatically recommends tenders across the most relevant sectors.
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
          <Link href="/browse/categories" className="hover:text-ink-600 transition-colors">Browse by Category</Link>
          <Link href="/browse/sectors" className="hover:text-ink-600 transition-colors font-medium text-ink-600">Browse by Sector</Link>
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
