"use client";

import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { FirmEditModal, type FirmModalSection } from "./FirmEditModal";

const tabs: { id: FirmModalSection; label: string }[] = [
  { id: "firm", label: "Firm" },
  { id: "identity", label: "Identity" },
  { id: "locations", label: "Locations" },
  { id: "financials", label: "Financials" },
  { id: "banking", label: "Banking & solvency" },
  { id: "experience", label: "Experience" },
  { id: "certifications", label: "Certifications" },
  { id: "exemptions", label: "Exemptions" },
  { id: "preferences", label: "Preferences" }
];

type TabId = FirmModalSection;

function FieldGrid({ rows }: { rows: { label: string; value?: string }[] }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label} className="space-y-1">
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{row.label}</dt>
          <dd className="text-sm text-slate-900">{row.value ?? "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

function EmptyTableHint({ entity }: { entity: string }) {
  return (
    <p className="text-sm text-slate-500">
      No {entity} records yet. Data will appear here once connected to your account.
    </p>
  );
}

function SectionHeader({ title, onEdit }: { title: string; onEdit: () => void }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <button
        type="button"
        onClick={onEdit}
        aria-label={`Edit ${title}`}
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      >
        <Pencil className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

export function FirmWorkspace() {
  const [active, setActive] = useState<TabId>("firm");
  const [editSection, setEditSection] = useState<FirmModalSection | null>(null);

  useEffect(() => {
    setEditSection(null);
  }, [active]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Firm</h2>
        <p className="text-sm text-slate-500">
          Legal profile, compliance identifiers, locations, financials, and bidding preferences.
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <nav
          aria-label="Firm sections"
          className="flex shrink-0 gap-1 overflow-x-auto rounded-lg border border-border bg-slate-50/80 p-1 lg:w-52 lg:flex-col lg:overflow-visible"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
                active === tab.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1 space-y-6">
          <FirmEditModal section={editSection} onClose={() => setEditSection(null)} />

          {active === "firm" && (
            <Card>
              <SectionHeader title="Firm" onEdit={() => setEditSection("firm")} />
              <FieldGrid
                rows={[
                  { label: "ID" },
                  { label: "Owner" },
                  { label: "Legal name" },
                  { label: "Business name" },
                  { label: "Constitution" },
                  { label: "Incorporation date" },
                  { label: "Industry type" },
                  { label: "Scope of work" },
                  { label: "Active" },
                  { label: "Created at" },
                  { label: "Updated at" }
                ]}
              />
            </Card>
          )}

          {active === "identity" && (
            <Card>
              <SectionHeader title="Firm identity" onEdit={() => setEditSection("identity")} />
              <FieldGrid
                rows={[
                  { label: "Firm" },
                  { label: "PAN number" },
                  { label: "GSTIN" },
                  { label: "CIN" },
                  { label: "Udyam number" },
                  { label: "DSC expiry date" },
                  { label: "Created at" },
                  { label: "Updated at" }
                ]}
              />
            </Card>
          )}

          {active === "locations" && (
            <Card>
              <SectionHeader title="Firm locations" onEdit={() => setEditSection("locations")} />
              <EmptyTableHint entity="location" />
            </Card>
          )}

          {active === "financials" && (
            <Card>
              <SectionHeader title="Firm financials" onEdit={() => setEditSection("financials")} />
              <p className="mb-4 text-sm text-slate-600">
                Per financial year: turnover, net worth, profit after tax, audit status, and linked audit document.
              </p>
              <EmptyTableHint entity="financial" />
            </Card>
          )}

          {active === "banking" && (
            <Card>
              <SectionHeader title="Banking & solvency" onEdit={() => setEditSection("banking")} />
              <EmptyTableHint entity="banking / solvency" />
            </Card>
          )}

          {active === "experience" && (
            <Card>
              <SectionHeader title="Firm experience" onEdit={() => setEditSection("experience")} />
              <EmptyTableHint entity="experience" />
            </Card>
          )}

          {active === "certifications" && (
            <Card>
              <SectionHeader title="Firm certifications" onEdit={() => setEditSection("certifications")} />
              <p className="mb-4 text-sm text-slate-600">
                May link to an experience record for past-work certificates.
              </p>
              <EmptyTableHint entity="certification" />
            </Card>
          )}

          {active === "exemptions" && (
            <Card>
              <SectionHeader title="Firm exemptions log" onEdit={() => setEditSection("exemptions")} />
              <FieldGrid
                rows={[
                  { label: "Firm" },
                  { label: "Eligible for EMD waiver" },
                  { label: "Eligible for experience waiver" },
                  { label: "Local preference state" },
                  { label: "Updated at" }
                ]}
              />
            </Card>
          )}

          {active === "preferences" && (
            <Card>
              <SectionHeader title="Firm preferences" onEdit={() => setEditSection("preferences")} />
              <FieldGrid
                rows={[
                  { label: "Firm" },
                  { label: "Preferred regions" },
                  { label: "Target sectors" },
                  { label: "Excluded departments" },
                  { label: "Min tender value" },
                  { label: "Max tender value" },
                  { label: "Updated at" }
                ]}
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
