import { GetStaticProps } from "next";
import Head from "next/head";
import React from "react";

import { siteConfig } from "../../config/site";
import { getPortfolioContent, PortfolioContent } from "../../lib/content";
import {
  flattenSkillsInOrder,
  formatDateRange,
  formatExpiry,
  formatMonthYear,
} from "../../lib/resume-format";

type Props = PortfolioContent;

/** Left label / right-aligned value — the "X ... Y" row pattern used
 *  throughout the reference resume (job headers, cert dates, etc). */
function SplitRow({
  left,
  right,
  leftClassName = "font-bold",
  rightClassName = "text-neutral-700",
}: {
  left: React.ReactNode;
  right?: React.ReactNode;
  leftClassName?: string;
  rightClassName?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <span className={`min-w-0 break-words ${leftClassName}`}>{left}</span>
      {right && (
        <span className={`shrink-0 self-start text-left sm:self-auto sm:text-right ${rightClassName}`}>
          {right}
        </span>
      )}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-4 mb-1.5 border-b border-neutral-400 pb-0.5 text-[11px] font-bold uppercase tracking-wide text-neutral-900">
      {children}
    </h2>
  );
}

function Bullets({ points }: { points?: string[] }) {
  if (!points?.length) return null;
  return (
    <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-[10.5px] leading-snug text-neutral-800">
      {points.map((point, i) => (
        <li key={i}>{point}</li>
      ))}
    </ul>
  );
}

/** Small bordered tag — used for the skills cloud and project tech stacks. */
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded border border-neutral-400 px-1.5 py-0.5 text-[9.5px] leading-none text-neutral-800">
      {children}
    </span>
  );
}

export default function Resume({
  pageInfo,
  experiences,
  skills,
  projects,
  socials,
  certifications,
  education,
}: Props) {
  const flatSkills = flattenSkillsInOrder(skills);

  // Contact line intentionally omits phone/address to match the reference —
  // email + whatever's in `socials` (LinkedIn, GitHub, a "Website" entry
  // pointing at dcastor.dev, etc).
  const contactParts = [
    pageInfo?.email,
    ...(socials ?? []).map((s) => s.title),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-neutral-200 py-8 print:bg-white print:py-0">
      <Head>
        <title>{pageInfo?.name ? `${pageInfo.name} — Resume` : "Resume"}</title>
        <meta name="robots" content="noindex" />
      </Head>

      {/* Download bar — hidden from print/PDF capture automatically */}
      <div className="mx-auto mb-4 flex w-full max-w-[8.5in] justify-end gap-3 px-4 print:hidden">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not a page route */}
        <a
          href="/api/resume.pdf"
          className="rounded-md bg-darkGreen px-4 py-2 text-sm font-medium text-white hover:bg-darkGreen/90"
        >
          Download PDF
        </a>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not a page route */}
        <a
          href="/api/resume.docx"
          className="rounded-md border border-darkGreen px-4 py-2 text-sm font-medium text-darkGreen hover:bg-darkGreen/10"
        >
          Download Word
        </a>
      </div>

      {/* The page itself — sized to letter, this is what Puppeteer captures */}
      <main className="mx-auto min-h-[11in] w-full max-w-[8.5in] bg-white px-4 py-5 text-neutral-900 shadow-lg sm:px-[0.65in] sm:py-[0.55in] print:min-h-0 print:w-auto print:shadow-none">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-[20px] font-bold uppercase tracking-wide">
            {pageInfo?.name ?? siteConfig.name}
          </h1>
          <p className="mt-1 text-[10.5px] text-neutral-700">
            {contactParts.join(" | ")}
          </p>
        </header>

        {/* Professional Summary */}
        {(pageInfo?.backgroundInformation || pageInfo?.summaryHighlights?.length) && (
          <section>
            <SectionHeading>Professional Summary</SectionHeading>
            {pageInfo?.backgroundInformation && (
              <p className="text-[10.5px] leading-snug text-neutral-800">
                {pageInfo.backgroundInformation}
              </p>
            )}
            <Bullets points={pageInfo?.summaryHighlights} />
          </section>
        )}

        {/* Skills */}
        {flatSkills.length > 0 && (
          <section>
            <SectionHeading>Skills</SectionHeading>
            <div className="flex flex-wrap gap-1.5">
              {flatSkills.map((title) => (
                <Pill key={title}>{title}</Pill>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {experiences?.length > 0 && (
          <section>
            <SectionHeading>Experience</SectionHeading>
            <div className="space-y-2.5">
              {experiences.map((exp) => (
                <div key={exp._id}>
                  <SplitRow
                    left={[exp.jobTitle, exp.company, exp.location]
                      .filter(Boolean)
                      .join(" | ")}
                    right={formatDateRange(
                      exp.dateStarted,
                      exp.dateEnded,
                      exp.isCurrentlyWorkingHere
                    )}
                  />
                  {exp.description && (
                    <p className="mt-0.5 text-[10.5px] leading-snug text-neutral-800">
                      {exp.description}
                    </p>
                  )}
                  <Bullets points={exp.points} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects / Portfolio */}
        {projects?.length > 0 && (
          <section>
            <SectionHeading>Projects / Portfolio</SectionHeading>
            <div className="space-y-2">
              {projects.map((project) => (
                <div key={project._id}>
                  <SplitRow
                    left={[project.title, project.role].filter(Boolean).join(", ")}
                    right={formatDateRange(
                      project.dateStarted,
                      project.dateEnded,
                      project.isOngoing
                    )}
                  />
                  {project.linkToBuild && (
                    <a
                      href={project.linkToBuild}
                      className="text-[10px] text-neutral-600 underline"
                    >
                      {project.linkToBuild}
                    </a>
                  )}
                  {project.summary && (
                    <p className="mt-0.5 text-[10.5px] leading-snug text-neutral-800">
                      {project.summary}
                    </p>
                  )}
                  <Bullets points={project.points} />
                  {project.technologies?.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {project.technologies.map((tech) => (
                        <Pill key={tech._id}>{tech.title}</Pill>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <section>
            <SectionHeading>Education</SectionHeading>
            <div className="space-y-1.5">
              {education.map((edu) => (
                <div key={edu._id}>
                  <SplitRow left={edu.school} />
                  <SplitRow
                    left={[edu.degree, edu.location].filter(Boolean).join(", ")}
                    leftClassName="italic text-[10.5px] text-neutral-800"
                  />
                  <Bullets points={edu.points} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certification and Licenses */}
        {certifications?.length > 0 && (
          <section>
            <SectionHeading>Certification and Licenses</SectionHeading>
            <div className="space-y-2">
              {certifications.map((cert) => (
                <div key={cert._id}>
                  <SplitRow
                    left={cert.title}
                    right={formatMonthYear(cert.dateIssued)}
                  />
                  <SplitRow
                    left={cert.issuer}
                    right={`Expiry Date: ${formatExpiry(cert.dateExpires)}`}
                    leftClassName="text-[10.5px] text-neutral-800"
                    rightClassName="text-[10px] text-neutral-600"
                  />
                  {cert.credentialId && (
                    <p className="text-[10px] text-neutral-600">
                      {cert.verifyUrl ? (
                        <a href={cert.verifyUrl} className="underline">
                          {cert.credentialId}
                        </a>
                      ) : (
                        cert.credentialId
                      )}
                    </p>
                  )}
                  <Bullets points={cert.points} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const content = await getPortfolioContent();
  return { props: content, revalidate: 10 };
};