import { ExternalLink, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * myScheme's own assistant. We open it as a full page because myScheme sends
 * X-Frame-Options / CSP frame-ancestors that refuse to render inside our origin.
 */
const GENIE_CHAT_URL = "https://aistore.myscheme.in/6t4rIofAaIAEgu2P9lmtD";

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
  return (
    <a
      href={GENIE_CHAT_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} (opens in a new tab)`}
      className={cn(
        inline
          ? "inline-flex items-center gap-1.5 rounded-lg border border-ink-200 dark:border-ink-800 bg-surface px-3.5 py-2 text-xs font-semibold text-ink-700 dark:text-ink-200 shadow-sm transition-colors hover:bg-ink-50 dark:hover:bg-ink-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:focus-visible:ring-navy-400"
          : "fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-navy-600 dark:bg-accent-blue px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-navy-700 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2",
        className
      )}
    >
      <MessageCircle className={inline ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden />
      <span className={inline ? undefined : "hidden sm:inline"}>{label}</span>
      <ExternalLink className={inline ? "h-3 w-3 text-ink-400 dark:text-ink-600" : "h-3.5 w-3.5 opacity-80"} aria-hidden />
    </a>
  );
}
