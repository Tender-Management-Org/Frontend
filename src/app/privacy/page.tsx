import Link from "next/link";
import { FileSearch, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — TenderKhoj",
  description: "How TenderKhoj collects, uses, and protects your data.",
};

const TOC = [
  { id: "introduction",   label: "Introduction" },
  { id: "data-collected", label: "Information We Collect" },
  { id: "how-we-use",     label: "How We Use Your Information" },
  { id: "storage",        label: "Data Storage & Security" },
  { id: "sharing",        label: "Data Sharing & Disclosure" },
  { id: "cookies",        label: "Cookies & Session Data" },
  { id: "your-rights",    label: "Your Rights (DPDPA)" },
  { id: "retention",      label: "Data Retention" },
  { id: "changes",        label: "Changes to This Policy" },
  { id: "contact",        label: "Contact Us" },
];

export default function PrivacyPage() {
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
            <div className="mb-8 rounded-xl border border-ink-100 bg-white p-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <span className="text-xs font-medium text-green-700">Legal Document</span>
              </div>
              <h1 className="text-3xl font-bold text-ink-900">Privacy Policy</h1>
              <p className="mt-3 text-ink-500">
                We take your privacy seriously. This policy explains what data we collect, why we collect it,
                and how we protect it.
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-ink-400">
                <span><strong className="text-ink-600">Effective:</strong> June 20, 2026</span>
                <span><strong className="text-ink-600">Operated by:</strong> Electrocom Solutions</span>
              </div>
            </div>

            <div className="space-y-6">

              {/* 1 */}
              <Section id="introduction" title="1. Introduction">
                <p>
                  Electrocom Solutions (&quot;we&quot;, &quot;us&quot;, &quot;TenderKhoj&quot;) is committed to protecting the privacy of our users.
                  This Privacy Policy explains how we collect, use, store, and protect information when you use the
                  TenderKhoj platform at <strong>tenderkhoj.com</strong>.
                </p>
                <p className="mt-3">
                  This policy is drafted in compliance with the <strong>Digital Personal Data Protection Act, 2023 (DPDPA)</strong>,
                  the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or
                  Information) Rules, 2011, and other applicable Indian data protection laws.
                </p>
                <p className="mt-3">
                  By using TenderKhoj, you consent to the practices described in this Privacy Policy. If you do not
                  agree, please discontinue use of the platform.
                </p>
              </Section>

              {/* 2 */}
              <Section id="data-collected" title="2. Information We Collect">
                <Subsection title="2.1 Account Information">
                  <p>When you register, we collect your <strong>username</strong> and optionally your <strong>email address</strong>.
                  Your password is stored as a salted cryptographic hash — we never store or have access to your plaintext password.</p>
                </Subsection>
                <Subsection title="2.2 Firm Profile Data">
                  <p>As part of setting up your firm on TenderKhoj, you may provide the following information, which we treat as
                  sensitive business data:</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-ink-600">
                    <ListItem><strong>Legal identifiers:</strong> PAN number, GSTIN, CIN, Udyam Registration Number, Shop Act Number, ESI Number, PF Code</ListItem>
                    <ListItem><strong>Business details:</strong> Legal name, business name, constitution type, industry type, incorporation date, scope of work</ListItem>
                    <ListItem><strong>Financial records:</strong> Annual turnover, net worth, profit after tax, audit status (per financial year)</ListItem>
                    <ListItem><strong>Banking &amp; solvency:</strong> Bank name, solvency certificate amounts and validity dates</ListItem>
                    <ListItem><strong>Experience:</strong> Past project names, descriptions, client names, project values, and dates</ListItem>
                    <ListItem><strong>Certifications:</strong> Certificate types (MSME, ISO, Startup India, etc.), certificate numbers, issue and expiry dates</ListItem>
                    <ListItem><strong>Location:</strong> Business address, city, state, pincode</ListItem>
                    <ListItem><strong>Preferences:</strong> Preferred regions, target sectors, excluded departments, tender value range</ListItem>
                  </ul>
                  <p className="mt-3">All firm profile data is entered voluntarily by you. You control what you enter and may update or delete it at any time.</p>
                </Subsection>
                <Subsection title="2.3 Uploaded Documents">
                  <p>You may upload business documents to TenderKhoj&apos;s document vault (e.g., PAN card, GST certificate,
                  experience certificates, financial audit reports, solvency certificates). These files are stored securely
                  on our servers and are associated only with your account.</p>
                  <p className="mt-2">You may also upload tender document packages (PDF/ZIP) for AI-assisted OCR extraction
                  (available on Starter, Growth, and Enterprise plans). These files are processed by our systems to extract
                  text-based information and are not shared with any third party.</p>
                </Subsection>
                <Subsection title="2.4 Tender Interaction Data">
                  <p>We collect data about how you interact with tenders on the platform: tenders you have viewed,
                  bookmarked (Interested), marked as Applied, Won, Lost, or Ignored. This data is used to personalise
                  your AI recommendations and power the blended recommendation engine.</p>
                </Subsection>
                <Subsection title="2.5 Payment Data">
                  <p>Subscription payments are processed by <strong>Cashfree Payments</strong>. We do not store your UPI ID,
                  bank account details, or any other payment instrument information. Cashfree may collect and process
                  payment information in accordance with their own privacy policy and RBI guidelines. We receive only
                  confirmation of payment status (success, failure, or cancellation) and your subscription tier.</p>
                </Subsection>
                <Subsection title="2.6 Technical & Usage Data">
                  <p>We may automatically collect technical information such as your IP address, browser type, device type,
                  and usage logs for the purpose of security monitoring, debugging, and platform improvement. This data
                  is not linked to personally identifiable information beyond what is necessary for security purposes.</p>
                </Subsection>
              </Section>

              {/* 3 */}
              <Section id="how-we-use" title="3. How We Use Your Information">
                <p>We use the information we collect for the following purposes:</p>
                <ul className="mt-3 space-y-2 text-sm text-ink-600">
                  <ListItem>
                    <strong>AI Recommendations:</strong> Your firm&apos;s scope of work, experience, and preference data is encoded
                    as a machine learning embedding (vector representation) to match your firm against relevant government tenders.
                    Your tender interaction data (Interested, Ignored) is used to further personalise recommendations over time.
                  </ListItem>
                  <ListItem>
                    <strong>Account Management:</strong> To create and manage your account, authenticate sessions, and enforce
                    plan limits and subscription status.
                  </ListItem>
                  <ListItem>
                    <strong>Notifications:</strong> To send you alerts about new recommendations, approaching tender deadlines
                    (48 hours before bid submission closes), and platform updates. Notification preferences are fully
                    controllable from your Settings page.
                  </ListItem>
                  <ListItem>
                    <strong>Payment Processing:</strong> To initiate and manage your subscription via Cashfree, and to apply
                    the correct plan limits to your account.
                  </ListItem>
                  <ListItem>
                    <strong>Document Intelligence:</strong> To perform OCR on documents you upload and surface
                    extracted information (eligibility criteria, deadlines, fee requirements) within your workspace.
                  </ListItem>
                  <ListItem>
                    <strong>Platform Improvement:</strong> Aggregated, anonymised usage patterns may be used to improve
                    the platform&apos;s features, recommendation quality, and search performance.
                  </ListItem>
                </ul>
                <p className="mt-4">
                  We do <strong>not</strong> use your data for advertising, profiling for third-party purposes, or any
                  automated decision-making that produces legal or significant effects without your involvement.
                </p>
              </Section>

              {/* 4 */}
              <Section id="storage" title="4. Data Storage & Security">
                <p>
                  All user data is stored on servers located in India. We implement the following technical and
                  organisational security measures:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-ink-600">
                  <ListItem>All data in transit is encrypted using TLS (HTTPS)</ListItem>
                  <ListItem>Passwords are stored as salted bcrypt hashes — never in plaintext</ListItem>
                  <ListItem>Authentication uses short-lived JWT access tokens (15-minute expiry) with rotating refresh tokens (7-day expiry)</ListItem>
                  <ListItem>Legal identifier data (PAN, GSTIN, CIN) and financial records are treated as Sensitive Personal Data or Information (SPDI) under the IT Rules, 2011</ListItem>
                  <ListItem>Access to firm data is restricted to the authenticated account owner; no other user can access your firm&apos;s data</ListItem>
                  <ListItem>Database access is restricted to authorised backend services only</ListItem>
                  <ListItem>Uploaded files are stored with access control and are not publicly accessible via URL</ListItem>
                </ul>
                <p className="mt-3">
                  While we implement industry-standard security measures, no method of electronic storage or transmission
                  is 100% secure. In the event of a data breach affecting your personal data, we will notify you and the
                  appropriate authorities as required by law.
                </p>
              </Section>

              {/* 5 */}
              <Section id="sharing" title="5. Data Sharing & Disclosure">
                <p>We do not sell, rent, or trade your personal or firm data. We share data only in the following limited circumstances:</p>
                <Subsection title="5.1 Payment Processor">
                  <p>Your phone number and subscription details are shared with <strong>Cashfree Payments</strong> to initiate
                  and manage your recurring subscription mandate. Cashfree processes this data as a data processor under
                  RBI and SEBI guidelines.</p>
                </Subsection>
                <Subsection title="5.2 Legal Requirements">
                  <p>We may disclose your data if required to do so by law, court order, or a lawful request from a
                  government authority, or if we believe disclosure is necessary to protect our rights or the safety
                  of users or the public.</p>
                </Subsection>
                <Subsection title="5.3 Business Transfer">
                  <p>In the event of a merger, acquisition, or sale of assets, your data may be transferred as part of
                  that transaction. We will notify you before your data is transferred and becomes subject to a different
                  privacy policy.</p>
                </Subsection>
                <p className="mt-3">
                  We do not share your data with any advertising networks, analytics resellers, data brokers, or
                  any third party for commercial purposes.
                </p>
              </Section>

              {/* 6 */}
              <Section id="cookies" title="6. Cookies & Session Data">
                <p>
                  TenderKhoj uses cookies to manage authentication sessions. We use the following cookies:
                </p>
                <div className="mt-3 overflow-x-auto rounded-lg border border-ink-100">
                  <table className="w-full text-sm">
                    <thead className="bg-ink-50">
                      <tr>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-ink-500">Cookie</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-ink-500">Purpose</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-ink-500">Lifetime</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-50">
                      {[
                        ["tp_access_token",       "Your authentication session token",                    "15 minutes"],
                        ["tp_refresh_token",      "Used to issue a new access token without re-login",   "7 days"],
                        ["tp_active_firm",        "Remembers which firm profile is currently active",     "Session"],
                        ["tp_onboarding_complete","Tracks whether you have completed initial onboarding", "Session"],
                      ].map(([name, purpose, lifetime]) => (
                        <tr key={name}>
                          <td className="px-4 py-2.5 font-mono text-xs text-ink-700">{name}</td>
                          <td className="px-4 py-2.5 text-ink-600">{purpose}</td>
                          <td className="px-4 py-2.5 text-ink-500">{lifetime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3">
                  We do not use third-party tracking cookies, advertising cookies, or analytics cookies. The cookies
                  listed above are strictly necessary for the platform to function and cannot be disabled without
                  preventing login.
                </p>
                <p className="mt-3">
                  We also use the browser&apos;s <strong>localStorage</strong> to temporarily save your onboarding form
                  draft so you don&apos;t lose progress if you navigate away. This data is stored only on your device
                  and is cleared once onboarding is complete.
                </p>
              </Section>

              {/* 7 */}
              <Section id="your-rights" title="7. Your Rights under the DPDPA">
                <p>
                  Under the Digital Personal Data Protection Act, 2023, you have the following rights with respect
                  to your personal data:
                </p>
                <ul className="mt-3 space-y-3 text-sm text-ink-600">
                  <ListItem>
                    <strong>Right to Access:</strong> You may request a summary of the personal data we hold about you
                    and how it is being processed.
                  </ListItem>
                  <ListItem>
                    <strong>Right to Correction:</strong> You may correct inaccurate or incomplete personal data directly
                    from your account settings or by contacting us.
                  </ListItem>
                  <ListItem>
                    <strong>Right to Erasure:</strong> You may request deletion of your personal data. We will delete
                    your account and associated firm data within 30 days of a valid erasure request, subject to any legal
                    retention obligations.
                  </ListItem>
                  <ListItem>
                    <strong>Right to Grievance Redressal:</strong> You may raise a grievance with us via the contact
                    details below. We will respond within a reasonable time. If your grievance is unresolved, you may
                    escalate to the Data Protection Board of India once constituted.
                  </ListItem>
                  <ListItem>
                    <strong>Right to Withdraw Consent:</strong> You may withdraw consent for optional data processing
                    (such as email notifications) at any time from your Settings page.
                  </ListItem>
                  <ListItem>
                    <strong>Right to Nominate:</strong> You may nominate another individual to exercise your data rights
                    in the event of your death or incapacity, in accordance with the DPDPA.
                  </ListItem>
                </ul>
                <p className="mt-3">
                  To exercise any of the above rights, please contact us at the email address provided in Section 10.
                </p>
              </Section>

              {/* 8 */}
              <Section id="retention" title="8. Data Retention">
                <p>
                  We retain your data for as long as your account is active. Upon account deletion or a valid erasure
                  request, we will permanently delete your personal data within 30 days, except where we are required
                  by law to retain certain records.
                </p>
                <p className="mt-3">
                  Subscription and payment records may be retained for up to 7 years as required by Indian accounting
                  and tax regulations. Anonymised, aggregated usage data (from which you cannot be identified) may be
                  retained indefinitely for platform improvement purposes.
                </p>
                <p className="mt-3">
                  Uploaded documents are deleted along with your account. Documents associated with tender workspaces
                  are retained until the workspace is deleted or the account is terminated.
                </p>
              </Section>

              {/* 9 */}
              <Section id="changes" title="9. Changes to This Policy">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technology,
                  legal requirements, or other factors. When we make material changes, we will notify you by email (if
                  you have provided one) or via an in-platform notification at least 7 days before the changes take
                  effect.
                </p>
                <p className="mt-3">
                  The &quot;Effective&quot; date at the top of this page will always reflect the date of the most recent revision.
                  We encourage you to review this policy periodically.
                </p>
              </Section>

              {/* 10 */}
              <Section id="contact" title="10. Contact Us">
                <p>
                  For privacy-related queries, data access requests, erasure requests, or grievances, please contact:
                </p>
                <div className="mt-4 rounded-xl border border-ink-100 bg-ink-50 p-5 text-sm text-ink-700 space-y-1">
                  <p><strong>Data Controller: Electrocom Solutions</strong></p>
                  <p>Proprietor: Vaibhav Paliwal</p>
                  <p>Rajasthan, India</p>
                  <p>Email: <a href="mailto:privacy@tenderkhoj.com" className="text-navy-600 hover:underline">privacy@tenderkhoj.com</a></p>
                  <p>Platform: <a href="https://tenderkhoj.com" className="text-navy-600 hover:underline">tenderkhoj.com</a></p>
                </div>
                <p className="mt-4 text-sm text-ink-500">
                  We aim to respond to all privacy-related requests within 15 business days.
                </p>
              </Section>

            </div>
          </main>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-ink-100 pt-8 text-center text-sm text-ink-400">
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/terms" className="hover:text-ink-600 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="text-navy-600 font-medium">Privacy Policy</Link>
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
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
      <span>{children}</span>
    </li>
  );
}
