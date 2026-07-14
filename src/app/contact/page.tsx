import Link from "next/link";
import { FileSearch, ChevronRight, Mail, Building2, Shield, Scale, Briefcase } from "lucide-react";

export const metadata = {
  title: "Contact Us — TenderKhoj",
  description: "Get in touch with TenderKhoj for support, billing, privacy, or enterprise enquiries.",
};

const TOC = [
  { id: "support",     label: "General Support" },
  { id: "billing",     label: "Billing & Subscriptions" },
  { id: "privacy",     label: "Privacy & Data" },
  { id: "legal",       label: "Legal" },
  { id: "enterprise",  label: "Enterprise" },
  { id: "company",     label: "Company Details" },
];

const CHANNELS = [
  {
    id: "support",
    title: "1. General Support",
    icon: Mail,
    description:
      "Questions about your account, firm profile, tender search, recommendations, or how to use the platform.",
    email: "support@tenderkhoj.com",
    response: "We aim to respond within 2 business days.",
  },
  {
    id: "billing",
    title: "2. Billing & Subscriptions",
    icon: Briefcase,
    description:
      "Subscription changes, invoices, failed payments, or questions about cancellation and refunds.",
    email: "support@tenderkhoj.com",
    subject: "Billing enquiry",
    response: (
      <>
        For cancellation and refund rules, see our{" "}
        <Link href="/refund" className="text-navy-600 underline underline-offset-2 hover:text-navy-700">
          Refund &amp; Cancellation Policy
        </Link>
        .
      </>
    ),
  },
  {
    id: "privacy",
    title: "3. Privacy & Data Requests",
    icon: Shield,
    description:
      "Data access, correction, or erasure requests under the Digital Personal Data Protection Act, 2023, and other privacy-related queries.",
    email: "privacy@tenderkhoj.com",
    response: "We aim to respond to privacy requests within 15 business days.",
  },
  {
    id: "legal",
    title: "4. Legal",
    icon: Scale,
    description:
      "Questions about our Terms of Service, Privacy Policy, Legal Disclaimer, or other legal notices.",
    email: "legal@tenderkhoj.com",
  },
  {
    id: "enterprise",
    title: "5. Enterprise",
    icon: Building2,
    description:
      "Custom plans, higher limits, dedicated support, or procurement for larger teams and organisations.",
    email: "hello@tenderkhoj.com",
    subject: "Enterprise plan enquiry",
  },
];

export default function ContactPage() {
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
            <Link href="/terms" className="hover:text-ink-900 transition-colors">Terms</Link>
            <Link href="/refund" className="hover:text-ink-900 transition-colors">Refunds</Link>
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
                <span className="text-xs font-medium text-navy-700">Get in touch</span>
              </div>
              <h1 className="text-3xl font-bold text-ink-900">Contact Us</h1>
              <p className="mt-3 text-ink-500">
                Choose the right channel below and we&apos;ll get back to you as soon as we can.
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-ink-400">
                <span><strong className="text-ink-600">Operated by:</strong> Electrocom Solutions</span>
                <span><strong className="text-ink-600">Based in:</strong> Rajasthan, India</span>
              </div>
            </div>

            <div className="space-y-6">
              {CHANNELS.map((channel) => {
                const Icon = channel.icon;
                const href = channel.subject
                  ? `mailto:${channel.email}?subject=${encodeURIComponent(channel.subject)}`
                  : `mailto:${channel.email}`;
                return (
                  <Section key={channel.id} id={channel.id} title={channel.title}>
                    <div className="flex gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-50">
                        <Icon className="h-4 w-4 text-navy-600" />
                      </div>
                      <div className="min-w-0">
                        <p>{channel.description}</p>
                        <p className="mt-3">
                          Email:{" "}
                          <a href={href} className="font-medium text-navy-600 hover:underline">
                            {channel.email}
                          </a>
                        </p>
                        {channel.response && (
                          <p className="mt-2 text-ink-500">{channel.response}</p>
                        )}
                      </div>
                    </div>
                  </Section>
                );
              })}

              <Section id="company" title="6. Company Details">
                <div className="rounded-xl border border-ink-100 bg-ink-50 p-5 text-sm text-ink-700 space-y-1">
                  <p><strong>Electrocom Solutions</strong></p>
                  <p>Proprietor: Vaibhav Paliwal</p>
                  <p>Rajasthan, India</p>
                  <p>
                    Platform:{" "}
                    <a href="https://tenderkhoj.com" className="text-navy-600 hover:underline">
                      tenderkhoj.com
                    </a>
                  </p>
                </div>
                <p className="mt-4 text-sm text-ink-500">
                  Related documents:{" "}
                  <Link href="/terms" className="text-navy-600 hover:underline">Terms of Service</Link>
                  {" · "}
                  <Link href="/privacy" className="text-navy-600 hover:underline">Privacy Policy</Link>
                  {" · "}
                  <Link href="/refund" className="text-navy-600 hover:underline">Refund &amp; Cancellation</Link>
                  {" · "}
                  <Link href="/disclaimer" className="text-navy-600 hover:underline">Legal Disclaimer</Link>
                </p>
              </Section>
            </div>
          </main>
        </div>

        <footer className="mt-16 border-t border-ink-100 pt-8 text-center text-sm text-ink-400">
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/terms" className="hover:text-ink-600 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-ink-600 transition-colors">Privacy Policy</Link>
            <Link href="/refund" className="hover:text-ink-600 transition-colors">Refund &amp; Cancellation</Link>
            <Link href="/contact" className="text-navy-600 font-medium">Contact Us</Link>
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
