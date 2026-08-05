/**
 * ─────────────────────────────────────────────────────────────
 *  EDIT THIS FILE FIRST.
 *  Everything identity-related lives here so you never have to
 *  grep through components to find a hardcoded name or link.
 * ─────────────────────────────────────────────────────────────
 */

export const siteConfig = {
  /** Shown in the hero, nav, and <title>. */
  name: "Darnel Castor",

  /** Rotating strings in the hero typewriter effect. */
  roles: [
    "Hi, the name's Darnel Castor",
    "Software Engineer",
    "But Loves Design More",
  ],

  /** Short line under your name on the About section. */
  tagline: "Building things for the web.",

  email: "contact@dcastor.dev",
  phone: "",
  location: "Atlanta, GA United States",

  /** Canonical URL. Used for metadata, sitemap, and OG tags. */
  url: "https://example.com",

  /** Path inside /public. Leave empty to hide the resume button. */
  resumePath: "/resume.pdf",

  socials: {
    github: "https://github.com/Dcastor21",
    linkedin: "https://linkedin.com/in/darnel-c",
    twitter: "",
    youtube: "",
  },

  meta: {
    title: "Darnel Castor | Portfolio",
    description:
      "Portfolio showcasing my projects, skills and experience.",
    /** Path inside /public — 1200x630 recommended. */
    ogImage: "/og.png",
  },

  /** Feature flags — hide sections you haven't filled in yet. */
  sections: {
    about: true,
    experience: true,
    skills: true,
    certifications: true,
    projects: true,
    contact: true,
  },
} as const;

export type SiteConfig = typeof siteConfig;
