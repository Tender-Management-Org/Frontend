import Link from "next/link";
import { FileSearch, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Terms of Service — TenderKhoj",
  description: "Terms and conditions governing the use of TenderKhoj.",
};

const TOC = [
  { id: "acceptance",       label: "Acceptance of Terms" },
  { id: "about",            label: "About TenderKhoj" },
  { id: "accounts",         label: "User Accounts" },
  { id: "firm-profile",     label: "Firm Profile & Data" },
  { id: "tender-data",      label: "Tender Data & Search" },
  { id: "recommendations",  label: "AI Recommendations" },
  { id: "documents",        label: "Document Features" },
  { id: "subscriptions",    label: "Subscriptions & Payment" },
  { id: "acceptable-use",   label: "Acceptable Use" },
  { id: "govt-disclaimer",  label: "Government Portal Disclaimer" },
  { id: "ip",               label: "Intellectual Property" },
  { id: "liability",        label: "Limitation of Liability" },
  { id: "termination",      label: "Termination" },
  { id: "governing-law",    label: "Governing Law" },
  { id: "contact",          label: "Contact Us" },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ink-50">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-ink-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-600">
              <FileSearch className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-ink-900">TenderKhoj</span>
          </Link>
          <div className="flex items-center gap-4 text-sm text-ink-500">
            <Link href="/privacy" className="hover:text-ink-900 transition-colors">Privacy Policy</Link>
            <Link href="/disclaimer" className="hover:text-ink-900 transition-colors">Legal Disclaimer</Link>
            <Link
              href="/login"
              className="rounded-lg bg-navy-600 px-4 py-2 text-sm font-medium text-white hover:bg-navy-700 transition-colors"
            >
              Sign in
            </Link>
          </div>
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
            <div className="mb-8 rounded-xl border border-ink-100 bg-white p-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-navy-50 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-navy-600" />
                <span className="text-xs font-medium text-navy-700">Legal Document</span>
              </div>
              <h1 className="text-3xl font-bold text-ink-900">Terms of Service</h1>
              <p className="mt-3 text-ink-500">
                These Terms govern your use of TenderKhoj. Please read them carefully before creating an account.
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-ink-400">
                <span><strong className="text-ink-600">Effective:</strong> June 20, 2026</span>
                <span><strong className="text-ink-600">Operated by:</strong> Electrocom Solutions</span>
              </div>
            </div>

            <div className="space-y-6">

              {/* 1 */}
              <Section id="acceptance" title="1. Acceptance of Terms">
                <p>
                  By accessing or using TenderKhoj (available at <strong>tenderkhoj.com</strong>), creating an account,
                  or clicking &quot;Create account&quot;, you agree to be bound by these Terms of Service (&quot;Terms&quot;) and our{" "}
                  <Link href="/privacy" className="text-navy-600 underline underline-offset-2 hover:text-navy-700">Privacy Policy</Link>.
                  If you do not agree to these Terms, do not use the platform.
                </p>
                <p className="mt-3">
                  These Terms constitute a legally binding agreement between you (&quot;User&quot;) and Electrocom Solutions, a
                  proprietorship firm owned by Vaibhav Paliwal, registered in Rajasthan, India (&quot;we&quot;, &quot;us&quot;, or &quot;TenderKhoj&quot;).
                </p>
              </Section>

              {/* 2 */}
              <Section id="about" title="2. About TenderKhoj">
                <p>
                  TenderKhoj is an AI-powered tender discovery and bid management platform designed to help Indian businesses
                  track, discover, and prepare for government procurement tenders. The platform provides the following core services:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-ink-600">
                  <ListItem>
                    <strong>Tender aggregation</strong> — We collect publicly available tender listings from government
                    e-procurement portals (currently Rajasthan e-Procurement, with SHPP and others to follow) and maintain a
                    searchable copy on our servers. All sourced tenders are publicly accessible on the respective portals without
                    any login or authentication requirement.
                  </ListItem>
                  <ListItem>
                    <strong>AI-powered search</strong> — Keyword, semantic, and hybrid search across all aggregated tenders.
                  </ListItem>
                  <ListItem>
                    <strong>Personalised recommendations</strong> — Daily AI-generated tender matches based on your firm&apos;s
                    profile, past experience, and tender interests.
                  </ListItem>
                  <ListItem>
                    <strong>Bid management workspace</strong> — Tools to shortlist tenders, track pipeline stages
                    (Interested → Applied → Won/Lost), and receive deadline alerts.
                  </ListItem>
                  <ListItem>
                    <strong>Document intelligence (Phase 2)</strong> — OCR-based extraction of eligibility criteria from
                    tender documents you choose to upload, and a workspace for organising bid documents.
                  </ListItem>
                </ul>
                <p className="mt-3">
                  TenderKhoj is a productivity tool. We do not submit tenders, sign documents, or act as a representative
                  or agent for any bidder.
                </p>
              </Section>

              {/* 3 */}
              <Section id="accounts" title="3. User Accounts">
                <p>
                  To use TenderKhoj you must create an account with a valid username and password. You are responsible for
                  maintaining the confidentiality of your credentials and for all activity that occurs under your account.
                </p>
                <p className="mt-3">
                  You must provide accurate information during registration. We reserve the right to suspend or terminate
                  accounts where false information has been provided. You must be at least 18 years of age and legally authorised
                  to act on behalf of any firm you register on the platform.
                </p>
                <p className="mt-3">
                  Upon registration, you are automatically enrolled in a <strong>14-day free trial</strong> providing access
                  to core platform features including up to 5 AI recommendations per day and 1 firm profile. No payment
                  information is required to start the trial.
                </p>
                <p className="mt-3">
                  Access tokens issued to your account expire after 15 minutes and are automatically refreshed. Refresh tokens
                  are valid for 7 days and are rotated on each use. You must not share, transfer, or sell access to your account.
                </p>
              </Section>

              {/* 4 */}
              <Section id="firm-profile" title="4. Firm Profile & Data">
                <p>
                  TenderKhoj allows you to create and maintain a detailed profile of your firm, including legal identifiers
                  (PAN, GSTIN, CIN, Udyam Registration Number), financial records, certifications, past experience, and uploaded
                  documents. This information is used solely to:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-ink-600">
                  <ListItem>Generate AI embeddings to power tender recommendations</ListItem>
                  <ListItem>Apply preference-based filters (regions, value ranges, excluded departments)</ListItem>
                  <ListItem>Organise your bid preparation documents in the workspace</ListItem>
                </ul>
                <p className="mt-3">
                  You are solely responsible for the accuracy and completeness of the firm profile data you provide.
                  TenderKhoj does not verify the authenticity of any legal identifiers, financial figures, or documents you
                  upload. Any eligibility determination for a specific tender must be made by you independently by
                  referring to the official tender notice.
                </p>
                <p className="mt-3">
                  You must have legal authorisation to enter data on behalf of the firm you register. You must not enter false
                  or misleading information about your firm.
                </p>
              </Section>

              {/* 5 */}
              <Section id="tender-data" title="5. Tender Data & Search">
                <p>
                  TenderKhoj aggregates tender data from publicly accessible government e-procurement portals. All tenders
                  visible on our platform originate from portals that are freely accessible to any member of the public without
                  login or registration. We do not scrape data from portals that require authentication.
                </p>
                <p className="mt-3">
                  Our scrapers run on a nightly schedule. As a result, there may be a delay of up to 24 hours between a tender
                  being published on the source portal and it appearing on TenderKhoj. <strong>You must always verify all tender
                  details — including deadlines, eligibility criteria, and fee amounts — directly on the official government
                  portal before taking any action.</strong>
                </p>
                <p className="mt-3">
                  TenderKhoj provides direct links to source tender detail pages on official portals. Tender documents (NIT,
                  BOQ, Technical Specifications, etc.) are accessed directly from the official government portal via these links.
                  We do not host, modify, or redistribute government tender documents.
                </p>
              </Section>

              {/* 6 */}
              <Section id="recommendations" title="6. AI Recommendations">
                <p>
                  TenderKhoj&apos;s recommendation engine uses machine learning (sentence embeddings and vector similarity) to
                  suggest tenders that may be relevant to your firm based on your profile and past interactions. Recommendations
                  are generated nightly and refreshed automatically.
                </p>
                <p className="mt-3">
                  <strong>AI recommendations are suggestions only.</strong> The relevance score and match reason provided are
                  computed by an automated system and may not reflect the actual eligibility requirements of a tender. You must
                  read the full tender notice and evaluate your eligibility independently before deciding to bid.
                </p>
                <p className="mt-3">
                  The quality of recommendations depends on the completeness and accuracy of your firm profile, including
                  scope of work, past experience, and stated preferences. We make no guarantee regarding the precision,
                  recall, or completeness of the recommendation system.
                </p>
              </Section>

              {/* 7 */}
              <Section id="documents" title="7. Document Features">
                <Subsection title="7.1 Firm Document Vault">
                  <p>
                    You may upload documents (registration certificates, PAN, GST certificates, experience certificates,
                    financial audit reports, solvency certificates, etc.) to your firm&apos;s document vault. These files are
                    stored securely on our servers and are accessible only to authorised users within your account. You
                    must only upload documents that you have the legal right to upload and store.
                  </p>
                </Subsection>
                <Subsection title="7.2 Document Intelligence (OCR) — Phase 2">
                  <p>
                    TenderKhoj&apos;s upcoming document intelligence feature will allow you to upload tender document packages
                    (ZIP files or individual PDFs) downloaded from official portals. Our system will perform Optical Character
                    Recognition (OCR) to extract information such as eligibility criteria, EMD requirements, experience
                    criteria, and financial thresholds, and display this information within your bid workspace.
                  </p>
                  <p className="mt-3">
                    <strong>This extraction is for informational and productivity purposes only.</strong> OCR extraction
                    may be incomplete or inaccurate. You must cross-reference any extracted information against the official
                    tender documents. TenderKhoj is not responsible for any loss arising from reliance on extracted data.
                  </p>
                  <p className="mt-3">
                    By uploading tender documents, you confirm that those documents are publicly available government documents
                    and that your upload is solely for the purpose of your own bid preparation.
                  </p>
                </Subsection>
                <Subsection title="7.3 Bid Workspace">
                  <p>
                    The bid workspace is a productivity tool to help you organise and track the documents required for a
                    specific tender submission. TenderKhoj does not submit bids on your behalf, does not sign documents,
                    and does not interact with any government portal during bid submission.
                  </p>
                </Subsection>
              </Section>

              {/* 8 */}
              <Section id="subscriptions" title="8. Subscriptions & Payment">
                <Subsection title="8.1 Plans">
                  <p>
                    TenderKhoj offers the following subscription tiers after the free trial period:
                  </p>
                  <div className="mt-3 overflow-x-auto rounded-lg border border-ink-100">
                    <table className="w-full text-sm">
                      <thead className="bg-ink-50">
                        <tr>
                          <th className="px-4 py-2.5 text-left text-xs font-semibold text-ink-500">Plan</th>
                          <th className="px-4 py-2.5 text-left text-xs font-semibold text-ink-500">Recommendations/day</th>
                          <th className="px-4 py-2.5 text-left text-xs font-semibold text-ink-500">Max Firms</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ink-50">
                        {[
                          ["Trial (14 days)", "5", "1"],
                          ["Starter",         "15", "1"],
                          ["Growth",          "30", "3"],
                          ["Enterprise",      "Unlimited", "Unlimited"],
                        ].map(([plan, recs, firms]) => (
                          <tr key={plan}>
                            <td className="px-4 py-2.5 font-medium text-ink-800">{plan}</td>
                            <td className="px-4 py-2.5 text-ink-600">{recs}</td>
                            <td className="px-4 py-2.5 text-ink-600">{firms}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Subsection>
                <Subsection title="8.2 Payment">
                  <p>
                    Paid subscriptions are processed via Cashfree Payments (a licensed payment aggregator regulated by the
                    Reserve Bank of India). Payments are collected via UPI recurring mandate (auto-pay). By initiating a
                    subscription, you authorise Cashfree to debit the agreed subscription amount from your payment instrument
                    on the applicable billing cycle (monthly or annual).
                  </p>
                  <p className="mt-3">
                    TenderKhoj does not store your payment instrument details (UPI ID, bank account, card numbers).
                    All payment data is handled exclusively by Cashfree in accordance with their terms and PCI-DSS compliance.
                  </p>
                </Subsection>
                <Subsection title="8.3 Cancellation & Refunds">
                  <p>
                    You may cancel your subscription at any time from the Upgrade page or by contacting support. Upon
                    cancellation, your subscription will remain active until the end of the current billing period, after
                    which access will revert to an expired state. No pro-rated refunds are issued for partial billing
                    periods unless required by applicable law. Trial periods are not refundable as no payment is collected
                    during the trial. Full details are in our{" "}
                    <Link href="/refund" className="text-navy-600 underline underline-offset-2 hover:text-navy-700">
                      Refund &amp; Cancellation Policy
                    </Link>
                    .
                  </p>
                </Subsection>
                <Subsection title="8.4 Plan Limits">
                  <p>
                    Each plan enforces limits on the number of firm profiles and daily AI recommendations. If your subscription
                    expires or is cancelled, recommendation generation will be paused and access to certain features may be
                    restricted until you upgrade or reactivate.
                  </p>
                </Subsection>
              </Section>

              {/* 9 */}
              <Section id="acceptable-use" title="9. Acceptable Use">
                <p>You agree not to:</p>
                <ul className="mt-3 space-y-2 text-sm text-ink-600">
                  <ListItem>Use TenderKhoj for any unlawful purpose or in violation of any applicable laws</ListItem>
                  <ListItem>Attempt to gain unauthorised access to other users&apos; accounts or firm data</ListItem>
                  <ListItem>Reverse engineer, decompile, or attempt to extract the source code, algorithms, or AI models used by TenderKhoj</ListItem>
                  <ListItem>Use automated tools, bots, or scripts to access the TenderKhoj platform (separate from official API access granted to Enterprise users)</ListItem>
                  <ListItem>Scrape, harvest, or systematically extract tender data from TenderKhoj for redistribution or sale</ListItem>
                  <ListItem>Upload documents that you do not have the legal right to store or process</ListItem>
                  <ListItem>Upload malicious files, viruses, or any code designed to disrupt the platform</ListItem>
                  <ListItem>Provide false information about your firm, legal identifiers, or credentials</ListItem>
                  <ListItem>Share your account credentials with third parties or allow others to use your account</ListItem>
                  <ListItem>Use TenderKhoj in any manner that could damage, overburden, or impair our infrastructure</ListItem>
                </ul>
              </Section>

              {/* 10 */}
              <Section id="govt-disclaimer" title="10. Government Portal Disclaimer">
                <p>
                  TenderKhoj is an independent, privately operated platform. We are <strong>not</strong> affiliated with,
                  endorsed by, or in any way connected to the Government of Rajasthan, the National Informatics Centre (NIC),
                  the Rajasthan e-Procurement portal (eproc.rajasthan.gov.in), the State Highway Public Procurement portal
                  (SHPP), or any other government department or agency.
                </p>
                <p className="mt-3">
                  Tender data displayed on TenderKhoj is sourced from publicly available government portals. While we make
                  every effort to ensure accuracy, we make no representations or warranties regarding the completeness,
                  timeliness, or correctness of the tender data displayed. Official portals are the authoritative source of
                  all tender information.
                </p>
                <p className="mt-3">
                  Always download tender documents from and verify all details on the official government portal before
                  submitting a bid. TenderKhoj accepts no liability for any losses arising from reliance on information
                  displayed on our platform.
                </p>
              </Section>

              {/* 11 */}
              <Section id="ip" title="11. Intellectual Property">
                <p>
                  TenderKhoj and all associated technology — including the recommendation engine, embedding models,
                  search algorithms, UI design, and platform code — are the intellectual property of Electrocom Solutions.
                  You are granted a limited, non-exclusive, non-transferable licence to use the platform for your own
                  internal business purposes in accordance with these Terms.
                </p>
                <p className="mt-3">
                  Tender data sourced from government portals remains the property of the respective government bodies.
                  Firm data, documents, and content you upload to TenderKhoj remain your property. By uploading content,
                  you grant TenderKhoj a limited licence to process and store that content solely for the purpose of
                  providing the services described in these Terms.
                </p>
                <p className="mt-3">
                  You may not reproduce, distribute, create derivative works from, or commercially exploit any part of the
                  TenderKhoj platform, its algorithms, or its aggregated tender database.
                </p>
              </Section>

              {/* 12 */}
              <Section id="liability" title="12. Limitation of Liability">
                <p>
                  To the fullest extent permitted by applicable law, TenderKhoj, Electrocom Solutions, and its founders
                  shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including
                  but not limited to:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-ink-600">
                  <ListItem>Loss of a tender bid or business opportunity arising from delayed, inaccurate, or missing tender data</ListItem>
                  <ListItem>Incorrect eligibility assessment based on AI recommendations or OCR extraction</ListItem>
                  <ListItem>Failure to receive deadline notifications for any technical reason</ListItem>
                  <ListItem>Loss or corruption of uploaded documents due to technical failures</ListItem>
                  <ListItem>Any decision made in reliance on information displayed on the platform</ListItem>
                </ul>
                <p className="mt-3">
                  Our total aggregate liability to you for any claim arising from or related to these Terms or your use of
                  the platform shall not exceed the amount paid by you to TenderKhoj in the three months preceding the claim.
                </p>
                <p className="mt-3">
                  TenderKhoj is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, express
                  or implied, including but not limited to merchantability, fitness for a particular purpose, or
                  non-infringement.
                </p>
              </Section>

              {/* 13 */}
              <Section id="termination" title="13. Termination">
                <p>
                  You may terminate your account at any time by contacting us. Upon termination, your access to the platform
                  will cease at the end of your current billing period. Your firm data and documents will be retained for
                  30 days after termination to allow for data export, after which they will be permanently deleted.
                </p>
                <p className="mt-3">
                  We reserve the right to suspend or terminate your account immediately and without notice if we determine
                  that you have violated these Terms, engaged in fraudulent activity, or used the platform in a manner that
                  causes harm to us or third parties.
                </p>
              </Section>

              {/* 14 */}
              <Section id="governing-law" title="14. Governing Law">
                <p>
                  These Terms are governed by and construed in accordance with the laws of India, including the
                  Information Technology Act, 2000, the Information Technology (Amendment) Act, 2008, the Digital Personal
                  Data Protection Act, 2023, and the Indian Contract Act, 1872.
                </p>
                <p className="mt-3">
                  Any disputes arising out of or in connection with these Terms shall be subject to the exclusive
                  jurisdiction of the courts in Jaipur, Rajasthan, India.
                </p>
                <p className="mt-3">
                  We may update these Terms from time to time. We will notify you of material changes by email (if
                  provided) or via an in-platform notification. Continued use of the platform after the effective date
                  of updated Terms constitutes acceptance of the revised Terms.
                </p>
              </Section>

              {/* 15 */}
              <Section id="contact" title="15. Contact Us">
                <p>
                  If you have questions, concerns, or requests regarding these Terms, please contact us:
                </p>
                <div className="mt-4 rounded-xl border border-ink-100 bg-ink-50 p-5 text-sm text-ink-700 space-y-1">
                  <p><strong>Electrocom Solutions</strong></p>
                  <p>Proprietor: Vaibhav Paliwal</p>
                  <p>Rajasthan, India</p>
                  <p>Email: <a href="mailto:support@tenderkhoj.com" className="text-navy-600 hover:underline">support@tenderkhoj.com</a></p>
                  <p>Platform: <a href="https://tenderkhoj.com" className="text-navy-600 hover:underline">tenderkhoj.com</a></p>
                </div>
              </Section>

            </div>
          </main>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-ink-100 pt-8 text-center text-sm text-ink-400">
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/terms" className="text-navy-600 font-medium">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-ink-600 transition-colors">Privacy Policy</Link>
            <Link href="/refund" className="hover:text-ink-600 transition-colors">Refund &amp; Cancellation</Link>
            <Link href="/contact" className="hover:text-ink-600 transition-colors">Contact Us</Link>
            <Link href="/disclaimer" className="hover:text-ink-600 transition-colors">Legal Disclaimer</Link>
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

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="mb-2 text-sm font-semibold text-ink-800">{title}</h3>
      <div className="text-sm leading-relaxed text-ink-600">{children}</div>
    </div>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy-400" />
      <span>{children}</span>
    </li>
  );
}
