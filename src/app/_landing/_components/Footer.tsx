import Link from "next/link";
import { BROWSE_LINKS } from "../_data/content";

const LINK_GROUPS = [
  {
    title: "Browse tenders",
    links: BROWSE_LINKS.map((link) => ({ label: link.label, href: link.href })),
  },
  {
    title: "Product",
    links: [
      { label: "Product", href: "#product" },
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-ink-900/8 bg-canvas">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
          <div>
            <span className="inline-flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-[0.5rem] bg-stage text-white">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                  <circle cx="10.5" cy="10.5" r="6" stroke="currentColor" strokeWidth="2" />
                  <path d="m15.5 15.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M8 10.5h5M10.5 8v5" stroke="#5C91FF" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <span className="text-[0.95rem] font-semibold tracking-tight text-ink-900">tenderkhoj</span>
            </span>
            <p className="mt-4 max-w-xs text-base leading-relaxed text-ink-500">
              The right tenders. For the right firm. At the right time.
            </p>
          </div>

          {LINK_GROUPS.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
                {group.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-500 transition-colors hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elec-500"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-ink-900/8 pt-6 sm:flex-row">
          <p className="text-sm text-ink-400">© 2026 tenderkhoj</p>
          <p className="text-sm text-ink-300">Built for Indian businesses competing in government procurement.</p>
        </div>
      </div>
    </footer>
  );
}
