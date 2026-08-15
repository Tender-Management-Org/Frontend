import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { BrowseCta, SiteHeader, SubpageHero } from "../../_landing/_components/SiteHeader";
import { Footer } from "../../_landing/_components/Footer";

export const metadata = {
  title: "Tenders by State — tenderkhoj",
  description:
    "Browse government tenders across all Indian states and Union Territories. Find procurement opportunities in your state on tenderkhoj.",
  alternates: { canonical: "/browse/states" },
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
    <div className="min-h-screen bg-canvas text-ink-900 antialiased">
      <SiteHeader active="/browse/states" />

      <SubpageHero
        breadcrumb="Browse by State"
        title={
          <>
            Tenders by <span className="text-elec-600">State</span>
          </>
        }
        subtitle={`Government procurement across all ${STATES.length} Indian states and Union Territories. Every state opens the dashboard with that filter already applied.`}
        icon={<MapPin className="h-5 w-5" aria-hidden />}
      />

      <main className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {STATES.map((state) => (
            <li key={state.name}>
              <Link
                href={`/tenders?location=${encodeURIComponent(state.location)}`}
                className="group flex items-center gap-3 rounded-2xl border border-ink-900/8 bg-white/80 px-4 py-3.5 shadow-card backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-elec-500/25 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elec-500"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-elec-50 text-elec-600 transition-colors group-hover:bg-elec-100">
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink-800 transition-colors group-hover:text-elec-700">
                  {state.name}
                </span>
                <ArrowRight
                  className="h-3.5 w-3.5 shrink-0 text-ink-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-elec-600"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="text-ink-400">Or browse</span>
          <Link
            href="/browse/categories"
            className="rounded-full border border-ink-900/10 bg-white px-4 py-2 font-medium text-ink-700 transition-colors hover:border-elec-500/30 hover:text-elec-700"
          >
            By Category
          </Link>
          <Link
            href="/browse/sectors"
            className="rounded-full border border-ink-900/10 bg-white px-4 py-2 font-medium text-ink-700 transition-colors hover:border-elec-500/30 hover:text-elec-700"
          >
            By Sector
          </Link>
        </div>

        <BrowseCta
          title="Get notified about tenders in your state"
          body="tenderkhoj monitors procurement portals daily and matches new tenders to your firm automatically — with a Fit Score, eligibility check and document readiness on every one."
        />
      </main>

      <Footer />
    </div>
  );
}
