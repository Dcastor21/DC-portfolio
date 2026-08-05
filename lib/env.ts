/**
 * Environment resolution.
 *
 * Design goal: the template must run with ZERO configuration.
 * If Sanity credentials are absent we fall back to local mock
 * content instead of crashing with an opaque error.
 */

type Env = {
  sanityProjectId: string | null;
  sanityDataset: string;
  sanityApiVersion: string;
  /** True when we have enough config to talk to Sanity. */
  hasSanity: boolean;
};

function read(name: string): string | null {
  const value = process.env[name];
  if (!value || value.trim() === "" || value.startsWith("your-")) return null;
  return value.trim();
}

const sanityProjectId = read("NEXT_PUBLIC_SANITY_PROJECT_ID");

export const env: Env = {
  sanityProjectId,
  sanityDataset: read("NEXT_PUBLIC_SANITY_DATASET") ?? "production",
  sanityApiVersion: read("NEXT_PUBLIC_SANITY_API_VERSION") ?? "2023-05-03",
  hasSanity: sanityProjectId !== null,
};

let warned = false;

/** Called once by the content layer on first fetch. */
export function warnIfUnconfigured(): void {
  if (env.hasSanity || warned) return;
  warned = true;
  console.warn(
    [
      "",
      "  ⚠  Running in MOCK MODE — no Sanity project configured.",
      "",
      "     The site is rendering placeholder content from data/mock.json.",
      "     To connect your own CMS:",
      "",
      "       1. cp .env.example .env.local",
      "       2. Create a project at https://sanity.io/manage",
      "       3. Set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local",
      "       4. Restart the dev server",
      "",
    ].join("\n"),
  );
}

/**
 * Use in places where Sanity is genuinely required (e.g. the Studio
 * route) so the failure message names the missing variable.
 */
export function requireSanity(): { projectId: string; dataset: string } {
  if (!env.sanityProjectId) {
    throw new Error(
      "Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Copy .env.example to " +
        ".env.local and fill it in — see README § Configuration.",
    );
  }
  return { projectId: env.sanityProjectId, dataset: env.sanityDataset };
}
