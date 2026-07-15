import Link from "next/link";
import { FileSearch, ChevronRight, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Legal Disclaimer — TenderKhoj",
  description: "Important legal notices and disclaimers about TenderKhoj's services.",
};

const TOC = [
  { id: "independence",     label: "Platform Independence" },
  { id: "data-accuracy",    label: "Tender Data Accuracy" },
  { id: "ai-disclaimer",    label: "AI Recommendations" },
  { id: "ocr-disclaimer",   label: "Document Intelligence (OCR)" },
  { id: "no-advice",        label: "Not Professional Advice" },
  { id: "third-party",      label: "Third-Party Portals" },
  { id: "liability",        label: "Limitation of Liability" },
  { id: "contact",          label: "Contact" },
];

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-ink-50">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-ink-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-600">
              <FileSearch className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-ink-900">TenderKhoj</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">

          {/* Sidebar TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-xl border border-ink-100 bg-white p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-400">On this page</p>
              <nav className="space-y-1">
                {TOC.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-ink-500 hover:bg-ink-50 hover:text-ink-900 transition-colors"
                  >
                    <ChevronRight className="h-3 w-3 shrink-0 text-ink-300" />
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main className="min-w-0">
            {/* Hero */}
            <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                <span className="text-xs font-medium text-amber-700">Legal Notice</span>
              </div>
              <h1 className="text-3xl font-bold text-ink-900">Legal Disclaimer</h1>
              <p className="mt-3 text-ink-600">
                Please read this disclaimer carefully. It contains important information about the nature and
                limitations of TenderKhoj&apos;s services.
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-ink-400">
                <span><strong className="text-ink-600">Effective:</strong> June 20, 2026</span>
                <span><strong className="text-ink-600">Operated by:</strong> Electrocom Solutions</span>
              </div>
            </div>

            {/* Key Notice Banner */}
            <div className="mb-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <div className="text-sm text-amber-800">
                <strong>Always verify tender details on the official government portal</strong> before making any
                bidding decisions. TenderKhoj is a productivity tool — not the authoritative source for government procurement data.
              </div>
            </div>

            <div className="space-y-6">

              {/* 1 */}
              <Section id="independence" title="1. Platform Independence — Not a Government Portal">
                <p>
                  TenderKhoj is an <strong>independent, privately operated software platform</strong> developed and
                  maintained by Electrocom Solutions, a proprietorship firm based in Rajasthan, India.
                </p>
                <p className="mt-3">
                  TenderKhoj is <strong>not</strong> affiliated with, endorsed by, sponsored by, or in any way
                  connected to:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-ink-600">
                  <ListItem>The Government of Rajasthan</ListItem>
                  <ListItem>The National Informatics Centre (NIC)</ListItem>
                  <ListItem>The Rajasthan e-Procurement Portal (eproc.rajasthan.gov.in)</ListItem>
                  <ListItem>The State Highway Public Procurement Portal (SHPP)</ListItem>
                  <ListItem>The Government e-Marketplace (GeM)</ListItem>
                  <ListItem>Any other central or state government department, ministry, or agency</ListItem>
                </ul>
                <p className="mt-3">
                  Use of TenderKhoj does not constitute registration with or approval from any government body.
                  Your eligibility to bid on a tender is determined solely by the criteria stated in the official
                  tender notice published by the relevant procuring entity.
                </p>
              </Section>

              {/* 2 */}
              <Section id="data-accuracy" title="2. Tender Data Accuracy & Timeliness">
                <p>
                  TenderKhoj aggregates tender data from publicly accessible government e-procurement portals through
                  automated processes. While we make every reasonable effort to ensure the accuracy and completeness of
                  this data, we make <strong>no representations or warranties</strong>, express or implied, regarding:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-ink-600">
                  <ListItem>The completeness or accuracy of tender listings, values, deadlines, or descriptions displayed on our platform</ListItem>
                  <ListItem>The timeliness of data — our scrapers run on a nightly schedule, which means there may be a lag of up to 24 hours between a tender being published on the official portal and appearing on TenderKhoj</ListItem>
                  <ListItem>The continued accuracy of tender details that may be updated or cancelled after we have scraped them (corrigenda, deadline extensions, cancellations)</ListItem>
                  <ListItem>The availability of tenders — a tender visible on TenderKhoj may have been cancelled, withdrawn, or modified on the source portal</ListItem>
                </ul>
                <Callout type="warning">
                  <strong>The official government portal is always the authoritative source.</strong> Before preparing
                  or submitting any bid, you must independently verify all tender details — including eligibility
                  criteria, submission deadlines, EMD requirements, and document requirements — on the relevant
                  official portal.
                </Callout>
              </Section>

              {/* 3 */}
              <Section id="ai-disclaimer" title="3. AI Recommendations Disclaimer">
                <p>
                  TenderKhoj&apos;s recommendation engine uses artificial intelligence (machine learning sentence embeddings
                  and vector similarity algorithms) to identify tenders that may be relevant to your firm based on your
                  profile and past interactions.
                </p>
                <p className="mt-3">
                  These recommendations are <strong>algorithmically generated suggestions</strong> and carry the following
                  important limitations:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-ink-600">
                  <ListItem>
                    <strong>Fit scores are indicative, not definitive.</strong> A high fit score does not mean your firm is
                    eligible for a tender. Eligibility is determined by the specific criteria stated in the tender notice,
                    including technical qualifications, financial turnover requirements, certifications, and prior
                    experience criteria.
                  </ListItem>
                  <ListItem>
                    <strong>The AI may miss relevant tenders or include irrelevant ones.</strong> The recommendation
                    system is continuously improving but cannot guarantee 100% recall or precision.
                  </ListItem>
                  <ListItem>
                    <strong>Match reasons are auto-generated text.</strong> The human-readable explanation accompanying
                    each recommendation is generated by an algorithm and should not be treated as a legal or professional
                    assessment of your eligibility.
                  </ListItem>
                  <ListItem>
                    <strong>Recommendation quality depends on profile completeness.</strong> Firms with incomplete profiles
                    (missing scope of work, experience, or preferences) may receive lower-quality recommendations.
                  </ListItem>
                </ul>
                <p className="mt-3">
                  TenderKhoj accepts no liability for any missed tender opportunities or costs incurred as a result of
                  reliance on AI-generated recommendations.
                </p>
              </Section>

              {/* 4 */}
              <Section id="ocr-disclaimer" title="4. Document Intelligence & OCR Disclaimer">
                <p>
                  TenderKhoj&apos;s document intelligence feature (available on Starter, Growth, and Enterprise plans)
                  lets you apply automated OCR and AI analysis directly to the official tender documents TenderKhoj has
                  already sourced from the government portal — you do not upload any documents yourself. This feature
                  is provided as a
                  <strong> productivity aid only</strong> and carries the following limitations:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-ink-600">
                  <ListItem>
                    <strong>OCR extraction is not guaranteed to be complete or accurate.</strong> Scanned documents,
                    handwritten text, complex tables, and non-standard formatting may result in extraction errors,
                    missing information, or misinterpreted text.
                  </ListItem>
                  <ListItem>
                    <strong>Results are highly dependent on the visual quality of the source document.</strong> The
                    accuracy of document intelligence output depends on the scan quality, formatting, and layout of the
                    original document published by the procuring government entity — poor-quality scans will produce
                    lower-quality extraction.
                  </ListItem>
                  <ListItem>
                    <strong>Extracted eligibility criteria are informational only.</strong> They are intended to help
                    you quickly understand the key requirements of a tender, including required documents, annexures,
                    and corrigendums. You must read the complete official tender document to make any eligibility or
                    compliance determination.
                  </ListItem>
                  <ListItem>
                    <strong>We do not modify or alter the underlying tender documents.</strong> All documents you
                    view and use remain as-published by the procuring government entity.
                  </ListItem>
                  <ListItem>
                    <strong>The tender filing workspace does not submit anything.</strong> Any documents you organise
                    or prepare using TenderKhoj&apos;s workspace must be submitted directly through the official government
                    portal by you.
                  </ListItem>
                </ul>
                <Callout type="info">
                  TenderKhoj&apos;s document tools help you work faster. They do not replace the need to read tender
                  documents carefully and assess your own eligibility.
                </Callout>
              </Section>

              {/* 5 */}
              <Section id="no-advice" title="5. Not Professional, Legal, or Bidding Advice">
                <p>
                  Nothing on TenderKhoj — including tender listings, AI recommendations, fit scores, match reasons,
                  OCR-extracted eligibility criteria, deadline alerts, or any other content — constitutes:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-ink-600">
                  <ListItem><strong>Legal advice:</strong> We are not lawyers. Tender eligibility, contract compliance, and bid regulations are legal matters. Consult a qualified legal professional for advice on specific tender requirements.</ListItem>
                  <ListItem><strong>Financial advice:</strong> Information about tender values, EMD amounts, or financial eligibility thresholds is for reference only. Consult a Chartered Accountant for financial eligibility assessments.</ListItem>
                  <ListItem><strong>Bidding strategy advice:</strong> We do not advise on pricing, bid preparation strategy, or competitive positioning.</ListItem>
                  <ListItem><strong>Representation:</strong> TenderKhoj does not represent or act as an agent for any user in any government procurement process.</ListItem>
                </ul>
              </Section>

              {/* 6 */}
              <Section id="third-party" title="6. Third-Party Portals & External Links">
                <p>
                  TenderKhoj provides links to official government e-procurement portals for you to access tender
                  documents, verify details, and submit bids. When you follow these links, you leave TenderKhoj and
                  enter third-party websites governed by their own terms and policies.
                </p>
                <p className="mt-3">
                  TenderKhoj has no control over the availability, content, or functionality of external government
                  portals. We are not responsible for:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-ink-600">
                  <ListItem>Downtime or unavailability of government portals that prevents you from accessing or submitting tenders</ListItem>
                  <ListItem>Changes to government portal interfaces that affect your ability to complete actions</ListItem>
                  <ListItem>CAPTCHA challenges or other access controls on government portals that users must resolve themselves</ListItem>
                  <ListItem>Any data you enter directly on government portals</ListItem>
                </ul>
                <p className="mt-3">
                  Payments on TenderKhoj are processed by <strong>Cashfree Payments</strong>. TenderKhoj is not
                  responsible for the availability or terms of Cashfree&apos;s services. Cashfree is a third-party payment
                  aggregator licensed by the Reserve Bank of India.
                </p>
              </Section>

              {/* 7 */}
              <Section id="liability" title="7. Limitation of Liability">
                <p>
                  To the maximum extent permitted by applicable Indian law, Electrocom Solutions, its founders, employees,
                  and contractors shall not be liable for any loss or damage — direct, indirect, incidental, special,
                  consequential, or punitive — arising from or related to your use of TenderKhoj, including but not limited to:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-ink-600">
                  <ListItem>Missed tender deadlines due to delayed data aggregation or notification failures</ListItem>
                  <ListItem>Bid disqualification arising from reliance on AI-generated recommendations, fit scores, or OCR-extracted eligibility information</ListItem>
                  <ListItem>Financial losses arising from an unsuccessful bid prepared using TenderKhoj&apos;s workspace</ListItem>
                  <ListItem>Loss or corruption of documents uploaded to TenderKhoj due to technical failure</ListItem>
                  <ListItem>Unavailability of the TenderKhoj platform due to maintenance, technical issues, or force majeure events</ListItem>
                  <ListItem>Any action taken by a government authority in connection with a tender bid you prepared or submitted</ListItem>
                </ul>
                <p className="mt-3">
                  TenderKhoj is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We disclaim all implied warranties of
                  merchantability, fitness for a particular purpose, and non-infringement to the fullest extent permitted by law.
                </p>
                <p className="mt-3">
                  You use TenderKhoj at your own risk and are solely responsible for all decisions made in connection
                  with government tender bidding.
                </p>
              </Section>

              {/* 8 */}
              <Section id="contact" title="8. Contact">
                <p>
                  If you have questions about this disclaimer or any legal aspects of TenderKhoj, please contact us:
                </p>
                <div className="mt-4 rounded-xl border border-ink-100 bg-ink-50 p-5 text-sm text-ink-700 space-y-1">
                  <p><strong>Electrocom Solutions</strong></p>
                  <p>Proprietor: Vaibhav Paliwal</p>
                  <p>Rajasthan, India</p>
                  <p>Email: <a href="mailto:tenderkhojadmin@gmail.com" className="text-navy-600 hover:underline">tenderkhojadmin@gmail.com</a></p>
                  <p>Platform: <a href="https://tenderkhoj.com" className="text-navy-600 hover:underline">tenderkhoj.com</a></p>
                </div>
              </Section>

            </div>
          </main>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-ink-100 pt-8 text-center text-sm text-ink-400">
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/terms" className="hover:text-ink-600 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-ink-600 transition-colors">Privacy Policy</Link>
            <Link href="/refund" className="hover:text-ink-600 transition-colors">Refund &amp; Cancellation</Link>
            <Link href="/contact" className="hover:text-ink-600 transition-colors">Contact Us</Link>
            <Link href="/disclaimer" className="text-navy-600 font-medium">Legal Disclaimer</Link>
          </div>
          <p className="mt-4">&copy; 2026 Electrocom Solutions. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-xl border border-ink-100 bg-white p-6 md:p-8">
      <h2 className="mb-4 text-lg font-semibold text-ink-900">{title}</h2>
      <div className="text-sm leading-relaxed text-ink-600 space-y-0">{children}</div>
    </section>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
      <span>{children}</span>
    </li>
  );
}

function Callout({ type, children }: { type: "warning" | "info"; children: React.ReactNode }) {
  const styles = {
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    info:    "border-blue-200 bg-blue-50 text-blue-800",
  };
  return (
    <div className={`mt-4 rounded-lg border p-4 text-sm leading-relaxed ${styles[type]}`}>
      {children}
    </div>
  );
}
