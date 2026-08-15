"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Layers3, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrowseCta, SiteHeader, SubpageHero } from "../../_landing/_components/SiteHeader";
import { Footer } from "../../_landing/_components/Footer";

type SectorGroup = { letter: string; items: { name: string; query: string }[] };

const SECTORS: SectorGroup[] = [
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

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function TendersBySectorPage() {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState<string | null>(null);

  const available = useMemo(() => new Set(SECTORS.map((g) => g.letter)), []);

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return SECTORS.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => !needle || item.name.toLowerCase().includes(needle)
      ),
    })).filter((group) => group.items.length > 0 && (!letter || group.letter === letter));
  }, [query, letter]);

  const total = useMemo(() => groups.reduce((sum, g) => sum + g.items.length, 0), [groups]);

  return (
    <div className="min-h-screen bg-canvas text-ink-900 antialiased">
      <SiteHeader active="/browse/sectors" />

      <SubpageHero
        breadcrumb="Browse by Sector"
        title={
          <>
            Tenders by <span className="text-elec-600">Sector</span>
          </>
        }
        subtitle="Every industry we track — agriculture through telecom. Each sector opens the dashboard with that search already applied."
        icon={<Layers3 className="h-5 w-5" aria-hidden />}
      >
        {/* Search + alphabet filter */}
        <div className="mt-8 rounded-3xl border border-ink-900/8 bg-white/80 p-4 shadow-card backdrop-blur-xl sm:p-5">
          <div className="flex items-center gap-3 rounded-2xl border border-ink-900/10 bg-white px-4 py-3 focus-within:border-elec-500/40 focus-within:ring-2 focus-within:ring-elec-500/20">
            <Search className="h-4 w-4 shrink-0 text-ink-400" aria-hidden />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search sectors…"
              aria-label="Search sectors"
              className="min-w-0 flex-1 bg-transparent text-sm text-ink-800 outline-none placeholder:text-ink-400"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="shrink-0 rounded-full px-2 py-0.5 text-2xs font-medium text-ink-400 transition-colors hover:text-ink-700"
              >
                Clear
              </button>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setLetter(null)}
              aria-pressed={letter === null}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors",
                letter === null
                  ? "bg-stage text-white"
                  : "text-ink-500 hover:bg-canvas-soft hover:text-ink-800"
              )}
            >
              All
            </button>
            {ALPHABET.map((char) => {
              const enabled = available.has(char);
              return (
                <button
                  key={char}
                  type="button"
                  disabled={!enabled}
                  onClick={() => setLetter(letter === char ? null : char)}
                  aria-pressed={letter === char}
                  className={cn(
                    "h-7 w-7 rounded-lg text-xs font-semibold transition-colors",
                    !enabled && "cursor-not-allowed text-ink-200",
                    enabled && letter === char && "bg-elec-600 text-white",
                    enabled && letter !== char && "text-ink-500 hover:bg-canvas-soft hover:text-ink-800"
                  )}
                >
                  {char}
                </button>
              );
            })}
          </div>
        </div>
      </SubpageHero>

      <main className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        {groups.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-ink-900/12 bg-white/60 p-12 text-center">
            <p className="text-sm font-semibold text-ink-800">No sectors match “{query}”.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setLetter(null);
              }}
              className="mt-3 text-xs font-semibold text-elec-600 hover:text-elec-700"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="mb-6 text-xs text-ink-400" aria-live="polite">
              <span className="font-semibold tabular-nums text-ink-700">{total}</span> sectors
            </p>

            <div className="space-y-9">
              {groups.map((group) => (
                <section key={group.letter}>
                  <div className="flex items-center gap-3">
                    <h2 className="text-sm font-bold text-ink-900">{group.letter}</h2>
                    <span className="h-px flex-1 bg-ink-900/8" aria-hidden />
                  </div>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {group.items.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={`/tenders?search=${encodeURIComponent(item.query)}`}
                          className="group flex items-center gap-3 rounded-2xl border border-ink-900/8 bg-white/80 px-4 py-3 shadow-card backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-elec-500/25 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elec-500"
                        >
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-elec-500" aria-hidden />
                          <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink-700 transition-colors group-hover:text-elec-700">
                            {item.name}
                          </span>
                          <ArrowRight
                            className="h-3.5 w-3.5 shrink-0 text-ink-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-elec-600"
                            aria-hidden
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="text-ink-400">Or browse</span>
          <Link
            href="/browse/states"
            className="rounded-full border border-ink-900/10 bg-white px-4 py-2 font-medium text-ink-700 transition-colors hover:border-elec-500/30 hover:text-elec-700"
          >
            By State
          </Link>
          <Link
            href="/browse/categories"
            className="rounded-full border border-ink-900/10 bg-white px-4 py-2 font-medium text-ink-700 transition-colors hover:border-elec-500/30 hover:text-elec-700"
          >
            By Category
          </Link>
        </div>

        <BrowseCta
          title="Let AI find the right sectors for your firm"
          body="tenderkhoj reads your firm profile and recommends tenders across every sector that actually fits — no guessing which list to open."
        />
      </main>

      <Footer />
    </div>
  );
}
