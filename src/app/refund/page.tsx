import Link from "next/link";
import { FileSearch, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Cancellation & Refund Policy — TenderKhoj",
  description: "Cancellation and refund policy for VAIBHAV PALIWAL / TenderKhoj.",
};

const TOC = [
  { id: "cancellation", label: "Cancellations" },
  { id: "perishable",   label: "Perishable Items" },
  { id: "defective",    label: "Damaged or Defective" },
  { id: "warranty",     label: "Warranty Products" },
  { id: "refunds",      label: "Refund Processing" },
  { id: "contact",      label: "Contact" },
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
              <h1 className="text-3xl font-bold text-ink-900">Cancellation &amp; Refund Policy</h1>
              <p className="mt-3 text-ink-500">
                This Cancellation and Refund Policy applies to purchases and orders placed with VAIBHAV PALIWAL
                (TenderKhoj / Electrocom Solutions).
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-ink-400">
                <span><strong className="text-ink-600">Last updated:</strong> 15-07-2026</span>
                <span><strong className="text-ink-600">Merchant:</strong> VAIBHAV PALIWAL</span>
              </div>
            </div>

            <div className="space-y-6">

              <Section id="cancellation" title="1. Cancellations">
                <p>
                  VAIBHAV PALIWAL believes in helping its customers as far as possible, and has therefore a liberal
                  cancellation policy. Under this policy:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-ink-600">
                  <ListItem>
                    Cancellations will be considered only if the request is made immediately after placing the order.
                    However, the cancellation request may not be entertained if the orders have been communicated to the
                    vendors/merchants and they have initiated the process of shipping them.
                  </ListItem>
                </ul>
              </Section>

              <Section id="perishable" title="2. Perishable Items">
                <p>
                  VAIBHAV PALIWAL does not accept cancellation requests for perishable items like flowers, eatables etc.
                  However, refund/replacement can be made if the customer establishes that the quality of product delivered
                  is not good.
                </p>
              </Section>

              <Section id="defective" title="3. Damaged or Defective Items">
                <p>
                  In case of receipt of damaged or defective items please report the same to our Customer Service team.
                  The request will, however, be entertained once the Merchant has checked and determined the same at its
                  own end. This should be reported within <strong>7 Days</strong> of receipt of the products. In case you
                  feel that the product received is not as shown on the site or as per your expectations, you must bring
                  it to the notice of our customer service within <strong>7 Days</strong> of receiving the product. The
                  Customer Service Team after looking into your complaint will take an appropriate decision.
                </p>
              </Section>

              <Section id="warranty" title="4. Warranty Products">
                <p>
                  In case of complaints regarding products that come with a warranty from manufacturers, please refer the
                  issue to them.
                </p>
              </Section>

              <Section id="refunds" title="5. Refund Processing">
                <p>
                  In case of any Refunds approved by the VAIBHAV PALIWAL, it&apos;ll take <strong>6–8 Days</strong> for the
                  refund to be processed to the end customer.
                </p>
              </Section>

              <Section id="contact" title="6. Contact">
                <p>
                  For cancellation or refund requests, contact our Customer Service team:
                </p>
                <div className="mt-4 rounded-xl border border-ink-100 bg-ink-50 p-5 text-sm text-ink-700 space-y-1">
                  <p><strong>VAIBHAV PALIWAL</strong></p>
                  <p>Electrocom Solutions · TenderKhoj</p>
                  <p>Rajasthan, India</p>
                  <p>
                    Email:{" "}
                    <a href="mailto:support@tenderkhoj.com?subject=Cancellation%20or%20Refund" className="text-navy-600 hover:underline">
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
