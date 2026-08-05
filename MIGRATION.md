# Post-merge notes

**Everything in Phases 1–3 below has already been applied** in this package:
personal data removed, config/lib/data layers added, certifications section
wired in, and `npm run build` verified with no `.env.local`.

What remains for you: **Phase 0** (license + repo settings), **Phase 4**
(dependency modernization), and **Phase 6** (publishing). Phases 1–3 are kept
as a record of what changed and why.

Delete this file before publishing the template.

---

# Migration checklist

Order matters — each phase leaves the repo in a working state.

## Phase 0 — Before you write any code

- [ ] Open an issue on the upstream repo asking about a license. There's no
      `LICENSE` file, which means all rights reserved by default. Fork freely,
      but don't publish it as a template for others until this is resolved.
- [ ] Fork, then **Settings → General → Template repository**.
- [ ] Rename the repo to something discoverable (`nextjs-portfolio-template`).
- [ ] Set topics: `nextjs`, `portfolio-template`, `template`, `tailwindcss`,
      `sanity`, `framer-motion`, `typescript`.
- [ ] Enable Discussions; disable Wiki and Projects.
- [ ] Upload a social preview image (**Settings → General → Social preview**).

## Phase 1 — Purge personal data

Grep for these before anything else:

```bash
grep -rniE "mitchell|sparrow|mitchellsparrow\.com" \
  --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" \
  --include="*.md" .
```

- [ ] `sanity.ts` — the hardcoded `projectId`. Move to `env.sanityProjectId`.
- [ ] `next.config.js` — `images.domains` / `remotePatterns`. Also confirm it
      uses `remotePatterns`; `domains` is deprecated in Next 13+.
- [ ] `public/` — delete the profile photo, hero image, resume PDF, and favicon.
      Replace with clearly-labeled placeholders.
- [ ] `components/` — every hardcoded name, email, social URL, and typewriter
      string. These are the ones that hide.
- [ ] `README.md` — replace wholesale with the one in this kit.
- [ ] `package.json` — `name`, `author`, `repository`, `description`.
- [ ] Check the git history for a committed `.env`:
      `git log --all --full-history -- .env .env.local`

## Phase 2 — Drop in the kit

Copy these to the repo root, preserving paths:

```
config/site.ts
lib/env.ts
lib/content.ts
lib/image.ts
data/mock.json
.env.example          (overwrites the existing one)
.nvmrc
LICENSE
CONTRIBUTING.md
README.md
MIGRATION.md          (delete before publishing — it's for you, not users)
scripts/setup.mjs
.github/**
```

Then add to `package.json`:

```json
{
  "scripts": {
    "setup": "node scripts/setup.mjs",
    "seed": "sanity dataset import ./data/seed.ndjson production --replace",
    "studio": "sanity dev",
    "typecheck": "tsc --noEmit"
  },
  "engines": { "node": ">=18" }
}
```

## Phase 3 — Wire it up

- [ ] `sanity.ts` — read config from `lib/env.ts` instead of literals. Guard the
      client creation so an absent `projectId` doesn't throw at import time.
- [ ] `pages/index.tsx` — replace the five separate `fetch*` calls in
      `getStaticProps` with a single `getPortfolioContent()`. Pass `isMock`
      down if you want a dismissible "demo content" banner.
- [ ] Components — swap `urlFor(x).url()` for `imageUrl(x)` from `lib/image.ts`.
      Without this, mock mode crashes on the first image.
- [ ] Components — read from `siteConfig` instead of literals.
- [ ] Wrap each section render in its `siteConfig.sections.*` flag.
- [ ] Export a real seed dataset once your own Sanity project has content:
      `sanity dataset export production` → strip personal data → commit as
      `data/seed.ndjson`.

## Phase 4 — Modernize

The repo is from late 2022; expect drift.

- [ ] `npx npm-check-updates -u && npm install`, then fix what breaks.
- [ ] Sanity: confirm which major version `sanity/` targets. The README's
      `sanity start` is v2 syntax. v3+ uses `sanity dev` and can embed the
      Studio at `/studio` — worth doing, it removes a whole setup step.
- [ ] Framer Motion v11+ renamed the package to `motion` for some entry points;
      check imports.
- [ ] Add `prefers-reduced-motion` handling if it isn't there. Scroll-snap plus
      unconditional animation is an accessibility problem.
- [ ] Consider a `.devcontainer/` so "Open in Codespaces" works.

## Phase 5 — Verify like a stranger

The test that actually matters:

```bash
cd $(mktemp -d)
npx degit YOURNAME/YOURREPO test-run
cd test-run
npm install
npm run dev
```

- [ ] Renders a complete-looking site with **no `.env.local`**
- [ ] No red errors in the terminal or browser console
- [ ] The mock-mode warning appears exactly once and says what to do next
- [ ] `npm run build` succeeds with no env file
- [ ] `npm run setup` produces a valid `config/site.ts` that typechecks
- [ ] Vercel deploy button completes with all env fields left blank
- [ ] Lighthouse accessibility ≥ 90

## Phase 6 — Publish

- [ ] Replace every `OWNER/REPO` placeholder in `README.md`,
      `.github/ISSUE_TEMPLATE/config.yml`, and the Vercel button URL.
- [ ] Add `docs/screenshot.png` (the README references it).
- [ ] Tag `v1.0.0` and write release notes.
- [ ] Credit the original author in the README — already stubbed in.
