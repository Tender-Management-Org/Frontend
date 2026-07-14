import Link from "next/link";
import { FileSearch, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Refund & Cancellation Policy — TenderKhoj",
  description: "How subscription cancellations and refunds work on TenderKhoj.",
};

const TOC = [
  { id: "overview",        label: "Overview" },
  { id: "cancellation",    label: "How to Cancel" },
  { id: "access",          label: "Access After Cancellation" },
  { id: "refunds",         label: "Refund Policy" },
  { id: "trial",           label: "Free Trial" },
  { id: "mandate",         label: "UPI Mandate Verification" },
  { id: "failed-payments", label: "Failed Payments" },
  { id: "enterprise",      label: "Enterprise Plans" },
  { id: "contact",         label: "Contact" },
];

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-ink-50">
      <header className="sticky top-0 z-20 border-b border-ink-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-600">
              <FileSearch className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-ink-900">TenderKhoj</span>
          </Link>
          <div className="flex items-center gap-4 text-sm text-ink-500">
            <Link href="/terms" className="hover:text-ink-900 transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-ink-900 transition-colors">Contact Us</Link>
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

          <main className="min-w-0">
            <div className="mb-8 rounded-xl border border-ink-100 bg-white p-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-navy-50 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-navy-600" />
                <span className="text-xs font-medium text-navy-700">Legal Document</span>
              </div>
              <h1 className="text-3xl font-bold text-ink-900">Refund &amp; Cancellation Policy</h1>
              <p className="mt-3 text-ink-500">
                This policy explains how subscription cancellations and refunds work on TenderKhoj. It should be read
                together with our{" "}
                <Link href="/terms" className="text-navy-600 underline underline-offset-2 hover:text-navy-700">
                  Terms of Service
                </Link>
                .
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-ink-400">
                <span><strong className="text-ink-600">Effective:</strong> June 20, 2026</span>
                <span><strong className="text-ink-600">Operated by:</strong> Electrocom Solutions</span>
              </div>
            </div>

            <div className="space-y-6">

              <Section id="overview" title="1. Overview">
                <p>
                  TenderKhoj paid plans (Starter, Growth, and Enterprise) are billed via Cashfree Payments on a monthly
                  or annual cycle using UPI AutoPay. You may cancel at any time. Unless required by applicable law, we
                  do not issue pro-rated refunds for unused time in a billing period.
                </p>
              </Section>

              <Section id="cancellation" title="2. How to Cancel">
                <p>You can cancel your subscription in either of the following ways:</p>
                <ul className="mt-3 space-y-2 text-sm text-ink-600">
                  <ListItem>
                    From the <strong>Upgrade / Plans</strong> page while signed in — use the cancel subscription option
                    on your current plan card
                  </ListItem>
                  <ListItem>
                    By emailing{" "}
                    <a href="mailto:support@tenderkhoj.com?subject=Cancel%20subscription" className="text-navy-600 hover:underline">
                      support@tenderkhoj.com
                    </a>{" "}
                    from the email associated with your account
                  </ListItem>
                </ul>
                <p className="mt-3">
                  Cancellation takes effect at the end of your current billing period. No further charges will be
                  attempted after that period ends, provided the UPI AutoPay mandate is revoked or cancelled as part of
                  the process.
                </p>
              </Section>

              <Section id="access" title="3. Access After Cancellation">
                <p>
                  After you cancel, your paid plan features remain available until the end of the current billing period.
                  When that period ends, your subscription status becomes expired and paid features (including recommendation
                  generation limits associated with your plan) may be restricted until you reactivate or upgrade again.
                </p>
                <p className="mt-3">
                  Your firm data and uploaded documents are retained according to our{" "}
                  <Link href="/terms" className="text-navy-600 underline underline-offset-2 hover:text-navy-700">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-navy-600 underline underline-offset-2 hover:text-navy-700">
                    Privacy Policy
                  </Link>
                  . Cancelling a subscription is not the same as deleting your account.
                </p>
              </Section>

              <Section id="refunds" title="4. Refund Policy">
                <p>
                  <strong>No pro-rated refunds</strong> are issued for partial billing periods after cancellation, unless
                  required by applicable Indian law or mandated by a competent authority.
                </p>
                <p className="mt-3">We may consider a refund (in whole or in part) only in limited cases, such as:</p>
                <ul className="mt-3 space-y-2 text-sm text-ink-600">
                  <ListItem>A duplicate or accidental charge caused by a clear billing error on our side</ListItem>
                  <ListItem>A charge made after a properly completed cancellation had already taken effect</ListItem>
                  <ListItem>Where required under applicable consumer protection or other laws</ListItem>
                </ul>
                <p className="mt-3">
                  Refund requests should be sent to{" "}
                  <a href="mailto:support@tenderkhoj.com?subject=Refund%20request" className="text-navy-600 hover:underline">
                    support@tenderkhoj.com
                  </a>{" "}
                  with your account username, approximate charge date, and amount. Approved refunds are processed through
                  Cashfree back to the original payment instrument and typically appear within 5–10 business days,
                  depending on your bank.
                </p>
              </Section>

              <Section id="trial" title="5. Free Trial">
                <p>
                  New accounts receive a <strong>14-day free trial</strong>. No payment information is required to start
                  the trial, and <strong>no subscription charge is collected during the trial</strong>. Accordingly, the
                  trial period is not refundable.
                </p>
              </Section>

              <Section id="mandate" title="6. UPI Mandate Verification Charge">
                <p>
                  When you set up a paid subscription via Cashfree UPI AutoPay, a small verification charge (currently ₹1)
                  may be collected to validate the mandate. This verification amount is refunded by the payment process
                  and is not a subscription fee.
                </p>
              </Section>

              <Section id="failed-payments" title="7. Failed Payments">
                <p>
                  If a recurring payment fails (for example, due to insufficient balance or a revoked mandate), your
                  subscription may become inactive or expired and paid features may be restricted until payment succeeds
                  or you resubscribe. Failed charge attempts themselves do not create a refund entitlement.
                </p>
              </Section>

              <Section id="enterprise" title="8. Enterprise Plans">
                <p>
                  Enterprise pricing and commercial terms may be agreed separately. Where a custom agreement exists, that
                  agreement prevails over this policy to the extent of any conflict. For Enterprise enquiries, contact{" "}
                  <a href="mailto:hello@tenderkhoj.com?subject=Enterprise%20plan%20enquiry" className="text-navy-600 hover:underline">
                    hello@tenderkhoj.com
                  </a>
                  .
                </p>
              </Section>

              <Section id="contact" title="9. Contact">
                <p>
                  For cancellation help, refund requests, or billing questions:
                </p>
                <div className="mt-4 rounded-xl border border-ink-100 bg-ink-50 p-5 text-sm text-ink-700 space-y-1">
                  <p><strong>Electrocom Solutions</strong></p>
                  <p>Proprietor: Vaibhav Paliwal</p>
                  <p>Rajasthan, India</p>
                  <p>
                    Email:{" "}
                    <a href="mailto:support@tenderkhoj.com" className="text-navy-600 hover:underline">
                      support@tenderkhoj.com
                    </a>
                  </p>
                  <p>
                    Or visit our{" "}
                    <Link href="/contact" className="text-navy-600 hover:underline">
                      Contact Us
                    </Link>{" "}
                    page
                  </p>
                </div>
              </Section>

            </div>
          </main>
        </div>

        <footer className="mt-16 border-t border-ink-100 pt-8 text-center text-sm text-ink-400">
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/terms" className="hover:text-ink-600 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-ink-600 transition-colors">Privacy Policy</Link>
            <Link href="/refund" className="text-navy-600 font-medium">Refund &amp; Cancellation</Link>
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

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy-400" />
      <span>{children}</span>
    </li>
  );
}
