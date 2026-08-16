import { ExternalLink } from "lucide-react";
import {
  isRecord,
  looksLikeHtml,
  objectBody,
  objectTitle,
  objectUrl,
  sanitizeSchemeHtml,
  humaniseKey,
  isEmptyValue,
  type BlobValue,
} from "@/lib/genie/schemeContent";

/** Shared prose styling for sanitized myScheme HTML. */
const PROSE =
  "space-y-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300 " +
  "[&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 " +
  "[&_li]:my-1 [&_strong]:font-semibold [&_strong]:text-ink-800 dark:[&_strong]:text-ink-100 " +
  "[&_h3]:mt-4 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-ink-800 dark:[&_h3]:text-ink-100 " +
  "[&_h4]:mt-3 [&_h4]:text-sm [&_h4]:font-semibold [&_h4]:text-ink-800 dark:[&_h4]:text-ink-100 " +
  "[&_a]:text-navy-600 [&_a]:underline dark:[&_a]:text-accent-blue " +
  "[&_table]:my-2 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-ink-200 [&_td]:px-2 [&_td]:py-1 " +
  "[&_th]:border [&_th]:border-ink-200 [&_th]:px-2 [&_th]:py-1 [&_th]:text-left dark:[&_td]:border-ink-800 dark:[&_th]:border-ink-800";

function TextBlock({ value }: { value: string }) {
  if (looksLikeHtml(value)) {
    return (
      <div
        className={PROSE}
        // Sanitized above with a strict tag allowlist; myScheme returns
        // formatted HTML for these fields and plain text loses the structure.
        dangerouslySetInnerHTML={{ __html: sanitizeSchemeHtml(value) }}
      />
    );
  }
  return (
    <p className="whitespace-pre-line text-sm leading-relaxed text-ink-600 dark:text-ink-300">
      {value}
    </p>
  );
}

function ObjectEntry({ record }: { record: Record<string, unknown> }) {
  const title = objectTitle(record);
  const body = objectBody(record);
  const url = objectUrl(record);

  // Nothing recognisable — fall back to listing whatever primitive fields exist.
  if (!title && !body && !url) {
    const rows = Object.entries(record).filter(
      ([, value]) => !isEmptyValue(value) && typeof value !== "object"
    );
    if (rows.length === 0) return null;
    return (
      <dl className="grid gap-x-4 gap-y-1 sm:grid-cols-[minmax(0,180px)_1fr]">
        {rows.map(([key, value]) => (
          <div key={key} className="contents">
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400 dark:text-ink-600">
              {humaniseKey(key)}
            </dt>
            <dd className="text-sm text-ink-600 dark:text-ink-300">{String(value)}</dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <div className="space-y-1">
      {title && (
        <p className="text-sm font-semibold text-ink-800 dark:text-ink-100">{title}</p>
      )}
      {body && <TextBlock value={body} />}
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-navy-600 hover:underline dark:text-accent-blue"
        >
          {url}
          <ExternalLink className="h-3 w-3" aria-hidden />
        </a>
      )}
    </div>
  );
}

function ValueRenderer({ value }: { value: BlobValue }) {
  if (typeof value === "string") return <TextBlock value={value} />;

  if (typeof value === "number" || typeof value === "boolean") {
    return (
      <p className="text-sm text-ink-600 dark:text-ink-300">
        {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
      </p>
    );
  }

  if (Array.isArray(value)) {
    const items = value.filter((item) => !isEmptyValue(item));
    if (items.length === 0) return null;

    const allPrimitive = items.every((item) => typeof item !== "object");
    if (allPrimitive) {
      return (
        <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
          {items.map((item, index) => (
            <li key={index}>{String(item)}</li>
          ))}
        </ul>
      );
    }

    return (
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border border-ink-100 bg-ink-50 p-3 dark:border-ink-900 dark:bg-ink-950"
          >
            {isRecord(item) ? <ObjectEntry record={item} /> : <ValueRenderer value={item} />}
          </div>
        ))}
      </div>
    );
  }

  if (isRecord(value)) {
    const entries = Object.entries(value).filter(([, item]) => !isEmptyValue(item));
    if (entries.length === 0) return null;
    return (
      <div className="space-y-3">
        {entries.map(([key, item]) => (
          <div key={key} className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400 dark:text-ink-600">
              {humaniseKey(key)}
            </p>
            <ValueRenderer value={item} />
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export function SchemeBlobSection({ label, value }: { label: string; value: BlobValue }) {
  if (isEmptyValue(value)) return null;

  return (
    <section className="rounded-2xl border border-ink-200 bg-surface p-5 shadow-card dark:border-ink-800">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-800 dark:text-ink-100">
        {label}
      </h2>
      <ValueRenderer value={value} />
    </section>
  );
}
