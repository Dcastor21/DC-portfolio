import { GetStaticProps } from "next";
import Head from "next/head";
import React from "react";

import { siteConfig } from "../../config/site";
import { getPortfolioContent, PortfolioContent } from "../../lib/content";
import {
  formatDateRange,
  formatMonthYear,
  groupSkillsByCategory,
} from "../../lib/resume-format";

type Props = PortfolioContent;

/** Left label / right-aligned value — the "Company ... Dates" row pattern
 *  used throughout the reference resume. */
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
    <div className="flex items-baseline justify-between gap-4">
      <span className={leftClassName}>{left}</span>
      {right && <span className={`shrink-0 text-right ${rightClassName}`}>{right}</span>}
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

export default function Resume({
  pageInfo,
  experiences,
  skills,
  projects,
  socials,
  certifications,
  education,
}: Props) {
  const skillGroups = groupSkillsByCategory(skills);
  const contactParts = [
    pageInfo?.address,
    pageInfo?.phoneNumber,
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
      <div className="mx-auto mb-4 flex max-w-[8.5in] justify-end gap-3 px-4 print:hidden">
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
      <main className="mx-auto min-h-[11in] w-[8.5in] max-w-full bg-white px-[0.65in] py-[0.55in] text-neutral-900 shadow-lg print:min-h-0 print:w-auto print:shadow-none">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-[20px] font-bold uppercase tracking-wide">
            {pageInfo?.name ?? siteConfig.name}
          </h1>
          <p className="mt-1 text-[10.5px] text-neutral-700">
            {contactParts.join(" | ")}
          </p>
        </header>

        {/* Professional Experience */}
        {experiences?.length > 0 && (
          <section>
            <SectionHeading>Professional Experience</SectionHeading>
            <div className="space-y-2.5">
              {experiences.map((exp) => (
                <div key={exp._id}>
                  <SplitRow
                    left={exp.company}
                    right={formatDateRange(
                      exp.dateStarted,
                      exp.dateEnded,
                      exp.isCurrentlyWorkingHere
                    )}
                  />
                  <SplitRow
                    left={exp.jobTitle}
                    right={exp.location}
                    leftClassName="italic text-[10.5px] text-neutral-800"
                    rightClassName="italic text-[10.5px] text-neutral-700"
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

        {/* Skills */}
        {skillGroups.length > 0 && (
          <section>
            <SectionHeading>Skills</SectionHeading>
            <ul className="space-y-0.5 text-[10.5px] leading-snug text-neutral-800">
              {skillGroups.map((group) => (
                <li key={group.category}>
                  <span className="font-bold">{group.category}: </span>
                  {group.items.join(", ")}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Projects & Outside Experience */}
        {projects?.length > 0 && (
          <section>
            <SectionHeading>Projects &amp; Outside Experience</SectionHeading>
            <div className="space-y-2.5">
              {projects.map((project) => (
                <div key={project._id}>
                  <SplitRow
                    left={project.title}
                    right={formatDateRange(
                      project.dateStarted,
                      project.dateEnded,
                      project.isOngoing
                    )}
                  />
                  <Bullets points={project.points} />
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
                    left={edu.degree}
                    right={edu.location}
                    leftClassName="italic text-[10.5px] text-neutral-800"
                    rightClassName="italic text-[10.5px] text-neutral-700"
                  />
                  <Bullets points={edu.points} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications?.length > 0 && (
          <section>
            <SectionHeading>Certifications</SectionHeading>
            <ul className="list-disc space-y-0.5 pl-4 text-[10.5px] leading-snug text-neutral-800">
              {certifications.map((cert) => (
                <li key={cert._id}>
                  <span className="font-bold">{cert.title}</span>
                  {cert.issuer && ` : ${cert.issuer}`}
                  {cert.dateIssued && ` - ${formatMonthYear(cert.dateIssued)}`}
                </li>
              ))}
            </ul>
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