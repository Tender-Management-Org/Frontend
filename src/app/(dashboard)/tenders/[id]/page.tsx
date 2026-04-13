import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ActionBar } from "./components/ActionBar";
import { CorrigendumList } from "./components/CorrigendumList";
import { TenderDocuments } from "./components/TenderDocuments";
import { TenderFees } from "./components/TenderFees";
import { TenderInfo } from "./components/TenderInfo";

export default function TenderDetailPage() {
  const tender = {
    title: "Road Construction",
    organization: "PWD Gujarat",
    location: "Gujarat",
    category: "Construction",
    value: "Rs 50,00,000",
    description:
      "Detailed project for construction and strengthening of a regional road corridor including drainage, shoulder works, and associated civil infrastructure. The scope includes material supply, execution, testing, and defect liability support.",
    dates: {
      publishDate: "2026-04-10",
      bidStartDate: "2026-04-15",
      bidEndDate: "2026-05-01",
      openingDate: "2026-05-03"
    },
    documents: [
      { name: "NIT Document", type: "PDF", size: "2MB" },
      { name: "BOQ Sheet", type: "XLSX", size: "1.2MB" },
      { name: "Technical Specifications", type: "DOCX", size: "980KB" }
    ],
    corrigendum: [
      { title: "Deadline Extension Notice", type: "Corrigendum", date: "2026-04-20" },
      { title: "Revised BOQ Clause 4.2", type: "Amendment", date: "2026-04-24" }
    ],
    fees: {
      emdAmount: "Rs 5,00,000",
      emdExemptionAllowed: "Yes",
      tenderFeeAmount: "Rs 10,000",
      payableTo: "Executive Engineer, PWD",
      payableAt: "Ahmedabad"
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{tender.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{tender.organization}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary">Interested</Button>
          <Button variant="ghost" className="border border-border">
            Ignore
          </Button>
          <Button>Apply Now</Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 space-y-6 lg:col-span-8">
          <TenderInfo
            title={tender.title}
            organization={tender.organization}
            location={tender.location}
            category={tender.category}
            value={tender.value}
            description={tender.description}
          />
          <TenderDocuments documents={tender.documents} />
          <CorrigendumList corrigendum={tender.corrigendum} />
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="space-y-6 lg:sticky lg:top-24">
            <TenderFees
              emdAmount={tender.fees.emdAmount}
              emdExemptionAllowed={tender.fees.emdExemptionAllowed}
              tenderFeeAmount={tender.fees.tenderFeeAmount}
              payableTo={tender.fees.payableTo}
              payableAt={tender.fees.payableAt}
            />

            <Card className="space-y-3">
              <h3 className="text-base font-semibold text-slate-900">Important Dates</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <p>Publish Date: {tender.dates.publishDate}</p>
                <p>Bid Start Date: {tender.dates.bidStartDate}</p>
                <p>Bid End Date: {tender.dates.bidEndDate}</p>
                <p>Opening Date: {tender.dates.openingDate}</p>
              </div>
            </Card>

            <ActionBar />
          </div>
        </div>
      </div>
    </section>
  );
}
