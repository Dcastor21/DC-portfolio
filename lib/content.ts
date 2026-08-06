import { groq } from "next-sanity";
import { sanityClient } from "../sanity";

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

export async function getPortfolioContent(): Promise<PortfolioContent> {
  const [pageInfo, experiences, skills, projects, socials, certifications] =
    await Promise.all([
      sanityClient.fetch<PageInfo>(queries.pageInfo),
      sanityClient.fetch<Experience[]>(queries.experiences),
      sanityClient.fetch<Skill[]>(queries.skills),
      sanityClient.fetch<Project[]>(queries.projects),
      sanityClient.fetch<Social[]>(queries.socials),
      sanityClient.fetch<Certification[]>(queries.certifications),
    ]);

  return {
    pageInfo,
    experiences: experiences ?? [],
    skills: skills ?? [],
    projects: projects ?? [],
    socials: socials ?? [],
    certifications: certifications ?? [],
  };
}
