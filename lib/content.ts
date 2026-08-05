/**
 * Single entry point for all page content.
 *
 * Replaces the previous utils/fetch* + pages/api/get* round trip, which had
 * getStaticProps HTTP-fetch the site's own API routes via NEXT_PUBLIC_BASE_URL.
 * That pattern breaks at build time (the routes aren't serving yet) and forced
 * an extra env var. Querying Sanity directly from getStaticProps is both
 * correct and faster.
 *
 * When Sanity is unconfigured this serves data/mock.json instead, so
 * `npm run dev` works on a fresh clone with no setup.
 */

import { groq } from "next-sanity";
import { sanityClient } from "../sanity";
import { env, warnIfUnconfigured } from "./env";
import mock from "../data/mock.json";

import type {
  PageInfo,
  Experience,
  Skill,
  Project,
  Social,
  Certification,
} from "../typings";

export type PortfolioContent = {
  pageInfo: PageInfo;
  experiences: Experience[];
  skills: Skill[];
  projects: Project[];
  socials: Social[];
  certifications: Certification[];
  /** True when content came from data/mock.json. */
  isMock: boolean;
};

const queries = {
  pageInfo: groq`*[_type == "pageInfo"][0]`,
  experiences: groq`*[_type == "experience"] {
    ...,
    technologies[]->
  }`,
  skills: groq`*[_type == "skill"]`,
  projects: groq`*[_type == "project"] {
    ...,
    technologies[]->
  }`,
  socials: groq`*[_type == "social"]`,
  certifications: groq`*[_type == "certification"] | order(featured desc, dateIssued desc)`,
};

const mockContent = mock as unknown as Omit<PortfolioContent, "isMock">;

export async function getPortfolioContent(): Promise<PortfolioContent> {
  if (!env.hasSanity) {
    warnIfUnconfigured();
    return { ...mockContent, isMock: true };
  }

  const [pageInfo, experiences, skills, projects, socials, certifications] =
    await Promise.all([
      sanityClient.fetch<PageInfo>(queries.pageInfo),
      sanityClient.fetch<Experience[]>(queries.experiences),
      sanityClient.fetch<Skill[]>(queries.skills),
      sanityClient.fetch<Project[]>(queries.projects),
      sanityClient.fetch<Social[]>(queries.socials),
      sanityClient.fetch<Certification[]>(queries.certifications),
    ]);

  // An empty dataset is a very common first-run state — surface it clearly
  // rather than rendering a blank page.
  if (!pageInfo) {
    console.warn(
      "Sanity is connected but the dataset is empty. Add content in the " +
        "Studio (`npm run studio`), or start from data/mock.json.",
    );
    return { ...mockContent, isMock: true };
  }

  return {
    pageInfo,
    experiences: experiences ?? [],
    skills: skills ?? [],
    projects: projects ?? [],
    socials: socials ?? [],
    certifications: certifications ?? [],
    isMock: false,
  };
}
