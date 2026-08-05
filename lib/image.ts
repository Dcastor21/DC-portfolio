/**
 * Image URL resolver.
 *
 * The existing code calls `urlFor(x).url()` from sanity.ts, which assumes
 * every image is a Sanity asset reference. Mock content uses plain URL
 * strings, so this shim passes those through untouched and delegates
 * everything else to the real image builder.
 *
 * Migration: replace `import { urlFor } from "../sanity"` with
 * `import { imageUrl } from "../lib/image"` in components, and change
 * `urlFor(img).url()` to `imageUrl(img)`.
 */

import { urlFor } from "../sanity";

export function imageUrl(source: unknown, fallback = "/placeholder.svg"): string {
  if (!source) return fallback;
  if (typeof source === "string") return source;

  try {
    return urlFor(source).url() ?? fallback;
  } catch {
    return fallback;
  }
}
