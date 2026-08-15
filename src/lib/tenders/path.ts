/** Encode a portal tender ID for a URL path, keeping `/` as real separators. */
export function encodeTenderIdPath(tenderId: string): string {
  return tenderId
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export function tenderDetailHref(tenderId: string): string {
  return `/tenders/${encodeTenderIdPath(tenderId)}`;
}

export function interestedWorkspaceHref(tenderId: string): string {
  return `/interested/${encodeTenderIdPath(tenderId)}/workspace`;
}

/** Rebuild a portal tender ID from a Next.js catch-all `[...id]` param. */
export function tenderIdFromCatchAll(id: string | string[]): string {
  const segments = Array.isArray(id) ? id : [id];
  return segments.map((segment) => decodeURIComponent(segment)).join("/");
}

/** Same as `tenderIdFromCatchAll`, but drops a trailing `workspace` segment. */
export function tenderIdFromInterestedCatchAll(id: string | string[]): string {
  const segments = Array.isArray(id) ? id : [id];
  const withoutWorkspace =
    segments.length > 1 && segments[segments.length - 1] === "workspace"
      ? segments.slice(0, -1)
      : segments;
  return withoutWorkspace.map((segment) => decodeURIComponent(segment)).join("/");
}
