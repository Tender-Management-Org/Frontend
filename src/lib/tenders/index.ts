import type { TenderDetail } from "@/types/tenderDetail";
import { SAMPLE_TENDER_DETAIL } from "./sampleTenderDetail";

export interface TenderListItem {
  id: string;
  title: string;
  organization: string;
  location: string;
  value: string;
  deadline: string;
  description: string;
}

const SAMPLE_ID = SAMPLE_TENDER_DETAIL.basic_details.tender_id;

export const TENDER_LIST: TenderListItem[] = [
  {
    id: SAMPLE_ID,
    title: SAMPLE_TENDER_DETAIL.work_items.title,
    organization: SAMPLE_TENDER_DETAIL.basic_details.organisation_chain,
    location: SAMPLE_TENDER_DETAIL.work_items.location,
    value: formatInrFromNumber(SAMPLE_TENDER_DETAIL.work_items.tender_value),
    deadline: "2026-04-07",
    description: SAMPLE_TENDER_DETAIL.work_items.work_description
  },
  {
    id: "demo-smart-classroom-001",
    title: "Smart Classroom Equipment Supply",
    organization: "Education Dept. Rajasthan",
    location: "Jaipur",
    value: "Rs 18,50,000",
    deadline: "2026-05-08",
    description: "Supply and installation of smart classroom devices across district schools."
  },
  {
    id: "demo-hospital-it-002",
    title: "Hospital IT Infrastructure Upgrade",
    organization: "Health Mission Maharashtra",
    location: "Pune",
    value: "Rs 72,00,000",
    deadline: "2026-05-15",
    description: "Network modernization, server setup, and security hardening for public hospitals."
  },
  {
    id: "demo-water-pipeline-003",
    title: "Water Pipeline Rehabilitation",
    organization: "Municipal Corp. Indore",
    location: "Indore",
    value: "Rs 39,75,000",
    deadline: "2026-05-20",
    description: "Replacement of aging water distribution lines and meter installation package."
  },
  {
    id: "demo-egov-004",
    title: "E-Governance Portal Maintenance",
    organization: "NIC Karnataka",
    location: "Bengaluru",
    value: "Rs 22,40,000",
    deadline: "2026-05-24",
    description: "Application support, SLA-based maintenance, and feature enhancements."
  },
  {
    id: "demo-solar-005",
    title: "Rural Solar Street Lighting",
    organization: "Energy Dept. Bihar",
    location: "Patna",
    value: "Rs 64,10,000",
    deadline: "2026-05-30",
    description: "Procurement and deployment of solar street lights in rural clusters."
  }
];

function formatInrFromNumber(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(n);
}

function parseRoughValueToNumber(value: string): number {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return SAMPLE_TENDER_DETAIL.work_items.tender_value;
  return Number.parseInt(digits, 10) || SAMPLE_TENDER_DETAIL.work_items.tender_value;
}

/** Merge list row into sample so every id shows the full structure with sensible overrides */
export function getTenderDetail(id: string): TenderDetail | null {
  const item = TENDER_LIST.find((t) => t.id === id);
  if (!item) return null;

  if (id === SAMPLE_ID) {
    return SAMPLE_TENDER_DETAIL;
  }

  const tenderValue = parseRoughValueToNumber(item.value);

  return {
    ...SAMPLE_TENDER_DETAIL,
    basic_details: {
      ...SAMPLE_TENDER_DETAIL.basic_details,
      tender_id: item.id,
      tender_reference_number: `REF-${item.id}`,
      organisation_chain: item.organization
    },
    work_items: {
      ...SAMPLE_TENDER_DETAIL.work_items,
      title: item.title,
      work_description: item.description,
      tender_value: tenderValue,
      location: item.location,
      product_category: SAMPLE_TENDER_DETAIL.work_items.product_category
    },
    tender_inviting_authority: {
      name: item.organization,
      address: `${item.location}`
    }
  };
}
