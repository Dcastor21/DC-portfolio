<div align="center">

# Next.js Portfolio Template

A developer portfolio built with **Next.js**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and an optional **Sanity** CMS.
Runs with zero configuration — connect a CMS when you're ready.

[![CI](https://github.com/OWNER/REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

[**Use this template**](https://github.com/OWNER/REPO/generate) · [Report a bug](https://github.com/OWNER/REPO/issues)

</div>

---

## Quick start

```bash
npm install
npm run setup     # prompts for your name, email, socials
npm run dev
```

Open <http://localhost:3000>. That's the whole first run — no accounts, no API keys.

The site starts in **mock mode**, rendering placeholder content from `data/mock.json`. Everything works: animations, routing, the contact form, the production build. Wire up Sanity whenever you want a CMS.

## What you get

- **Single-file configuration** — name, role, email, socials, and section toggles all live in `config/site.ts`
- **Zero-config first run** — `npm run build` succeeds with no `.env.local`, so the template is never a blank page
- **Certifications section** — digital badges that link out to the issuer, with automatic expired-credential handling
- **Optional Sanity CMS** — update content without redeploying, once you connect it
- **Scroll-snapping sections** — hero, about, experience, skills, certifications, projects, contact
- **Type-safe** — `tsc --noEmit` and `next build` enforced in CI

## Configuration

Everything identity-related is in one file:

```ts
// config/site.ts
export const siteConfig = {
  name: "Your Name",
  email: "you@example.com",
  socials: { github: "...", linkedin: "..." },
  sections: { certifications: true, experience: true, /* ... */ },
} as const;
```

Set any section to `false` to hide it — useful if you don't have work experience to show yet.

Environment variables are all optional:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Enables CMS mode. Without it, mock content is served. |
| `NEXT_PUBLIC_SANITY_DATASET` | Defaults to `production`. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Analytics. Omit and no script loads at all. |

## Certifications

Each badge is a `certification` document. The section sorts featured badges first, then by issue date, and renders anything past its `dateExpires` in greyscale with an "Expired" tag.

Two ways to supply the badge image:

- **`badgeImage`** — upload to Sanity (CDN transforms, no dead-link risk)
- **`badgeImageUrl`** — paste the issuer's hosted URL

To get Credly URLs: open your badge's public page, right-click the image → **Copy image address** (that's `badgeImageUrl`); the page URL itself is your `verifyUrl`. Bump the `340x340` segment to `680x680` for retina displays. Add any new image host to `images.remotePatterns` in `next.config.js`.

> Credly has an undocumented `/users/<name>/badges.json` endpoint. It's unversioned and CORS-restricted — if you use it, do it in a build-time script that writes a committed file, never at request time.

## Connecting Sanity

<details>
<summary>Expand — about five minutes</summary>

1. Create a free project at [sanity.io/manage](https://www.sanity.io/manage).
2. Copy the project ID into `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local`.
3. Start the Studio: `npm run studio`
4. Add `http://localhost:3000` and your production domain as CORS origins under **API → CORS origins**.

Restart the dev server; the mock-mode banner disappears.

**Note:** the bundled Studio is Sanity v2. Upgrading to v3+ is recommended — see `MIGRATION.md`.

</details>

## Customizing

| What | Where |
| --- | --- |
| Name, email, socials, section toggles | `config/site.ts` |
| Colors, fonts | `tailwind.config.js` |
| Section order | `pages/index.tsx` |
| Individual sections | `components/` |
| Placeholder content | `data/mock.json` |
| Content schemas | `sanity/schemas/` |

## Architecture note

Content is fetched in `lib/content.ts`, which queries Sanity directly from `getStaticProps`. This replaces an earlier pattern where `getStaticProps` made an HTTP request to the site's own `/api/*` routes — that breaks at build time, since the routes aren't serving yet, and required an extra `NEXT_PUBLIC_BASE_URL` variable.

## Credits

Originally built by [Mitchell Sparrow](https://github.com/MitchellSparrow), inspired by a tutorial from Sonny Sangha. Templatized by [YOUR NAME](https://github.com/OWNER).

## License

MIT — see [LICENSE](./LICENSE).
