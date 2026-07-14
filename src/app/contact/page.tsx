import Link from "next/link";
import { FileSearch, Mail } from "lucide-react";
import { ContactForm } from "./ContactForm";

export const metadata = {
  title: "Contact Us — TenderKhoj",
  description: "Get in touch with TenderKhoj — send a message or email us directly.",
};

const CONTACT_EMAIL = "tenderkhojadmin@gmail.com";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-ink-50">
      <header className="sticky top-0 z-20 border-b border-ink-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-600">
              <FileSearch className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-ink-900">TenderKhoj</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink-900">Contact Us</h1>
          <p className="mt-2 text-ink-500">
            Have a question or need help? Send us a message and we&apos;ll get back to you.
          </p>
        </div>

        <div className="mb-6 flex items-start gap-3 rounded-xl border border-ink-100 bg-white p-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-50">
            <Mail className="h-4 w-4 text-navy-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-ink-900">Email us directly</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-0.5 inline-block text-sm font-medium text-navy-600 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>

        <div className="rounded-xl border border-ink-100 bg-white p-6 md:p-8">
          <h2 className="mb-5 text-lg font-semibold text-ink-900">Send a message</h2>
          <ContactForm />
        </div>

        <footer className="mt-12 border-t border-ink-100 pt-6 text-center text-sm text-ink-400">
          <div className="flex flex-wrap justify-center gap-5">
            <Link href="/terms" className="hover:text-ink-600 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-ink-600 transition-colors">Privacy</Link>
            <Link href="/refund" className="hover:text-ink-600 transition-colors">Cancellation &amp; Refund</Link>
          </div>
          <p className="mt-3">&copy; 2026 Electrocom Solutions</p>
        </footer>
      </main>
    </div>
  );
}
