import Link from "next/link";
import { FileSearch, Mail, Phone, MapPin } from "lucide-react";

export const metadata = {
  title: "About Us — TenderKhoj",
  description: "About TenderKhoj — an AI-powered tender discovery and bid management platform for Indian businesses.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ink-50">
      <header className="sticky top-0 z-20 border-b border-ink-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-600">
              <FileSearch className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-ink-900">TenderKhoj</span>
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-navy-600 px-4 py-2 text-sm font-medium text-white hover:bg-navy-700 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink-900">About TenderKhoj</h1>
          <p className="mt-3 text-ink-500">
            AI-powered tender discovery and bid management for Indian businesses.
          </p>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-ink-100 bg-white p-6 md:p-8">
            <h2 className="mb-3 text-lg font-semibold text-ink-900">What we do</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              TenderKhoj helps Indian businesses track, discover, and prepare for government procurement tenders.
              We aggregate publicly available tender listings from government e-procurement portals, use AI to
              recommend tenders relevant to your firm, and provide a workspace to organise the documents needed for
              a bid submission.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              TenderKhoj is a productivity tool. We are an independent, privately operated platform — we are not a
              government body, and we do not submit bids, sign documents, or act as an agent for any user in the
              procurement process. Full details on our relationship to government portals are in our{" "}
              <Link href="/disclaimer" className="text-navy-600 underline underline-offset-2 hover:text-navy-700">
                Legal Disclaimer
              </Link>
              .
            </p>
          </section>

          <section className="rounded-xl border border-ink-100 bg-white p-6 md:p-8">
            <h2 className="mb-3 text-lg font-semibold text-ink-900">Who operates TenderKhoj</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              TenderKhoj (tenderkhoj.com) is operated by <strong>Vaibhav Paliwal</strong>, based in Rajasthan, India.
            </p>
          </section>

          <section className="rounded-xl border border-ink-100 bg-white p-6 md:p-8">
            <h2 className="mb-4 text-lg font-semibold text-ink-900">Get in touch</h2>
            <div className="space-y-3 text-sm text-ink-700">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-navy-600" />
                <a href="mailto:tenderkhojadmin@gmail.com" className="text-navy-600 hover:underline">
                  tenderkhojadmin@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-navy-600" />
                <a href="tel:+917427089473" className="text-navy-600 hover:underline">
                  +91 74270 89473
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-navy-600" />
                <span>Rajasthan, India</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-ink-500">
              Or visit our{" "}
              <Link href="/contact" className="text-navy-600 underline underline-offset-2 hover:text-navy-700">
                Contact Us
              </Link>{" "}
              page.
            </p>
          </section>
        </div>

        <footer className="mt-12 border-t border-ink-100 pt-6 text-center text-sm text-ink-400">
          <div className="flex flex-wrap justify-center gap-5">
            <Link href="/terms" className="hover:text-ink-600 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-ink-600 transition-colors">Privacy</Link>
            <Link href="/refund" className="hover:text-ink-600 transition-colors">Cancellation &amp; Refund</Link>
            <Link href="/disclaimer" className="hover:text-ink-600 transition-colors">Disclaimer</Link>
            <Link href="/contact" className="hover:text-ink-600 transition-colors">Contact</Link>
          </div>
          <p className="mt-3">&copy; 2026 TenderKhoj, operated by Vaibhav Paliwal</p>
        </footer>
      </main>
    </div>
  );
}
