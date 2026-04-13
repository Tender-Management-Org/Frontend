import { TenderFilters } from "./components/TenderFilters";
import { TenderList } from "./components/TenderList";
import { TenderSearch } from "./components/TenderSearch";
import type { TenderItem } from "./components/TenderCard";

export default function TendersPage() {
  const tenders: TenderItem[] = [
    {
      id: 1,
      title: "Construction of Road",
      organization: "PWD Gujarat",
      location: "Ahmedabad",
      value: "Rs 50,00,000",
      deadline: "2026-05-01",
      description: "Road construction project for urban corridor expansion and drainage upgrade."
    },
    {
      id: 2,
      title: "Smart Classroom Equipment Supply",
      organization: "Education Dept. Rajasthan",
      location: "Jaipur",
      value: "Rs 18,50,000",
      deadline: "2026-05-08",
      description: "Supply and installation of smart classroom devices across district schools."
    },
    {
      id: 3,
      title: "Hospital IT Infrastructure Upgrade",
      organization: "Health Mission Maharashtra",
      location: "Pune",
      value: "Rs 72,00,000",
      deadline: "2026-05-15",
      description: "Network modernization, server setup, and security hardening for public hospitals."
    },
    {
      id: 4,
      title: "Water Pipeline Rehabilitation",
      organization: "Municipal Corp. Indore",
      location: "Indore",
      value: "Rs 39,75,000",
      deadline: "2026-05-20",
      description: "Replacement of aging water distribution lines and meter installation package."
    },
    {
      id: 5,
      title: "E-Governance Portal Maintenance",
      organization: "NIC Karnataka",
      location: "Bengaluru",
      value: "Rs 22,40,000",
      deadline: "2026-05-24",
      description: "Application support, SLA-based maintenance, and feature enhancements."
    },
    {
      id: 6,
      title: "Rural Solar Street Lighting",
      organization: "Energy Dept. Bihar",
      location: "Patna",
      value: "Rs 64,10,000",
      deadline: "2026-05-30",
      description: "Procurement and deployment of solar street lights in rural clusters."
    }
  ];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Tenders</h2>
        <p className="text-sm text-slate-500">Discover and track relevant opportunities for your firm.</p>
      </div>

      <TenderSearch />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3">
          <TenderFilters />
        </div>

        <div className="col-span-12 lg:col-span-9">
          <TenderList tenders={tenders} />
        </div>
      </div>
    </section>
  );
}
