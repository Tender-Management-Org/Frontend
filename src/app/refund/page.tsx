import Link from "next/link";
import { FileSearch, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Cancellation & Refund Policy — TenderKhoj",
  description: "Cancellation and refund policy for TenderKhoj subscriptions.",
};

const TOC = [
  { id: "trial",        label: "Free Trial" },
  { id: "cancellation", label: "Cancelling a Subscription" },
  { id: "billing",      label: "Billing Cycle & Auto-Pay" },
  { id: "refunds",      label: "Refund Eligibility" },
  { id: "processing",   label: "Refund Processing" },
  { id: "contact",      label: "Contact" },
];

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-ink-50">
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
              <h1 className="text-3xl font-bold text-ink-900">Cancellation &amp; Refund Policy</h1>
              <p className="mt-3 text-ink-500">
                This policy explains how cancellations and refunds work for paid TenderKhoj subscriptions.
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-ink-400">
                <span><strong className="text-ink-600">Effective:</strong> June 20, 2026</span>
                <span><strong className="text-ink-600">Operated by:</strong> Electrocom Solutions</span>
              </div>
            </div>

            <div className="space-y-6">

              <Section id="trial" title="1. Free Trial">
                <p>
                  New accounts start with a <strong>14-day free trial</strong> that includes core platform features
                  — up to 5 AI recommendations per day and 1 firm profile. No payment information is required to
                  start the trial, and no amount is charged during this period. Because nothing is collected during
                  the trial, there is nothing to refund if you decide not to continue.
                </p>
              </Section>

              <Section id="cancellation" title="2. Cancelling a Subscription">
                <p>
                  You may cancel your paid subscription at any time from the Upgrade page in your account, or by
                  contacting our support team. Cancellation stops future billing — it does not immediately end your
                  access.
                </p>
                <ul className="mt-3 space-y-2 text-sm text-ink-600">
                  <ListItem>
                    When you cancel, your plan remains active with full access until the end of the current billing
                    period you have already paid for.
                  </ListItem>
                  <ListItem>
                    After that date, your account reverts to an expired state: AI recommendation generation pauses,
                    and access to plan-gated features (document extraction, advanced filters, API access, etc.,
                    depending on your tier) is restricted until you resubscribe.
                  </ListItem>
                  <ListItem>
                    Your firm profile data and uploaded documents are not deleted on cancellation — they are retained
                    per our{" "}
                    <Link href="/privacy" className="text-navy-600 underline underline-offset-2 hover:text-navy-700">
                      Privacy Policy
                    </Link>
                    .
                  </ListItem>
                </ul>
              </Section>

              <Section id="billing" title="3. Billing Cycle & Auto-Pay">
                <p>
                  Paid subscriptions are billed monthly or annually, depending on the plan you choose, via{" "}
                  <strong>Cashfree Payments</strong> using a UPI recurring mandate (auto-pay). By subscribing, you
                  authorise Cashfree to debit the agreed amount on each billing cycle until you cancel.
                </p>
                <p className="mt-3">
                  You can view your next billing date and cancel the auto-pay mandate at any time from the Upgrade
                  page. TenderKhoj does not store your payment instrument details — all payment data is handled by
                  Cashfree.
                </p>
              </Section>

              <Section id="refunds" title="4. Refund Eligibility">
                <p>
                  Because TenderKhoj is a subscription service where access is granted immediately upon payment, we
                  follow a limited refund policy:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-ink-600">
                  <ListItem>
                    <strong>No pro-rated refunds</strong> are issued for unused time in a billing period after
                    cancellation — access simply continues until that period ends, as described in Section 2.
                  </ListItem>
                  <ListItem>
                    <strong>Duplicate or failed charges:</strong> If you were billed more than once for the same
                    billing period, or a payment was debited but your plan was not upgraded due to a technical error,
                    contact us and we will investigate and refund the incorrect charge.
                  </ListItem>
                  <ListItem>
                    <strong>Trial period:</strong> No refunds apply, since no payment is collected during the 14-day
                    trial (see Section 1).
                  </ListItem>
                  <ListItem>
                    Refunds outside the above cases are considered on a case-by-case basis — for example, if you were
                    charged despite a documented, ongoing platform outage that prevented you from using the service.
                    Contact our support team with details of your situation.
                  </ListItem>
                </ul>
              </Section>

              <Section id="processing" title="5. Refund Processing">
                <p>
                  Approved refunds are processed back to the original payment method via Cashfree Payments and
                  typically take <strong>6–8 business days</strong> to reflect in your account, depending on your
                  bank or UPI provider.
                </p>
              </Section>

              <Section id="contact" title="6. Contact">
                <p>
                  For cancellation or refund requests, contact our support team:
                </p>
                <div className="mt-4 rounded-xl border border-ink-100 bg-ink-50 p-5 text-sm text-ink-700 space-y-1">
                  <p><strong>Electrocom Solutions</strong></p>
                  <p>Proprietor: Vaibhav Paliwal</p>
                  <p>Rajasthan, India</p>
                  <p>
                    Email:{" "}
                    <a href="mailto:tenderkhojadmin@gmail.com?subject=Cancellation%20or%20Refund" className="text-navy-600 hover:underline">
                      tenderkhojadmin@gmail.com
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
            <Link href="/refund" className="text-navy-600 font-medium">Cancellation &amp; Refund</Link>
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
