"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * myScheme's own assistant, embedded. We deliberately do not proxy or scrape it —
 * the iframe talks to myScheme directly, so answers stay authoritative.
 */
const GENIE_CHAT_URL = "https://aistore.myscheme.in/6t4rIofAaIAEgu2P9lmtD?isEmbed=true";

interface SchemeChatPanelProps {
  /** Shown on the launcher button — e.g. "Ask about this scheme". */
  label?: string;
  /** Render as an inline button in a toolbar instead of a floating bubble. */
  inline?: boolean;
  className?: string;
}

export function SchemeChatPanel({
  label = "Ask Genie",
  inline = false,
  className,
}: SchemeChatPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  // The iframe is only mounted after the first open, so browsing the list
  // never pays for a third-party frame the user may not want.
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    if (isOpen) setHasMounted(true);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <>
      {inline ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg border border-ink-200 dark:border-ink-800 bg-surface px-3.5 py-2 text-xs font-semibold text-ink-700 dark:text-ink-200 shadow-sm transition-colors hover:bg-ink-50 dark:hover:bg-ink-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:focus-visible:ring-navy-400",
            className
          )}
        >
          <MessageCircle className="h-3.5 w-3.5" aria-hidden />
          {label}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={label}
          className={cn(
            "fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-navy-600 dark:bg-accent-blue px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-navy-700 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2",
            className
          )}
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">{label}</span>
        </button>
      )}

      {isOpen && (
        <button
          type="button"
          aria-label="Close chat"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-ink-900/50 backdrop-blur-sm"
        />
      )}

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Scheme assistant"
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-surface shadow-2xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "pointer-events-none translate-x-full"
        )}
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-ink-100 dark:border-ink-900 px-4 py-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink-900 dark:text-ink-50">Scheme assistant</p>
            <p className="truncate text-xs text-ink-400 dark:text-ink-600">
              Powered by myScheme
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-400 dark:text-ink-600 transition-colors hover:bg-ink-100 dark:hover:bg-ink-900 hover:text-ink-700 dark:hover:text-ink-200"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </header>

        <div className="min-h-0 flex-1 bg-ink-50 dark:bg-ink-950">
          {hasMounted && (
            <iframe
              src={GENIE_CHAT_URL}
              title="myScheme assistant"
              className="h-full w-full border-0"
              allow="clipboard-write; microphone"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
        </div>
      </aside>
    </>
  );
}
