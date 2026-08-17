import type { NextApiRequest, NextApiResponse } from "next";
import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  Packer,
  Paragraph,
  TabStopPosition,
  TabStopType,
  TextRun,
} from "docx";

import { getPortfolioContent } from "../../lib/content";
import { formatDateRange, formatMonthYear, groupSkillsByCategory } from "../../lib/resume-format";

const BODY_SIZE = 19; // 9.5pt (docx sizes are in half-points)
const NAME_SIZE = 32; // 16pt
const HEADING_SIZE = 19; // 9.5pt

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 220, after: 90 },
    border: {
      bottom: { color: "999999", space: 2, style: BorderStyle.SINGLE, size: 4 },
    },
    children: [
      new TextRun({ text: text.toUpperCase(), bold: true, size: HEADING_SIZE }),
    ],
  });
}

/** "Left ......... Right", right-aligned via a tab stop at the page margin. */
function splitRow(
  left: string,
  right: string,
  opts: { bold?: boolean; italics?: boolean; spacingBefore?: number } = {}
): Paragraph {
  return new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
    spacing: { before: opts.spacingBefore ?? 0 },
    children: [
      new TextRun({ text: left, bold: opts.bold, italics: opts.italics, size: BODY_SIZE }),
      ...(right
        ? [new TextRun({ text: `\t${right}`, bold: opts.bold, italics: opts.italics, size: BODY_SIZE })]
        : []),
    ],
  });
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    children: [new TextRun({ text, size: BODY_SIZE })],
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const { pageInfo, experiences, skills, projects, socials, certifications, education } =
      await getPortfolioContent();

    const skillGroups = groupSkillsByCategory(skills);

    // Contact line: plain text for address/phone, hyperlinks for email + socials.
    const contactRuns: (TextRun | ExternalHyperlink)[] = [];
    const pushSeparator = () => {
      if (contactRuns.length > 0) contactRuns.push(new TextRun({ text: "  |  ", size: BODY_SIZE }));
    };
    if (pageInfo?.address) {
      contactRuns.push(new TextRun({ text: pageInfo.address, size: BODY_SIZE }));
    }
    if (pageInfo?.phoneNumber) {
      pushSeparator();
      contactRuns.push(new TextRun({ text: pageInfo.phoneNumber, size: BODY_SIZE }));
    }
    if (pageInfo?.email) {
      pushSeparator();
      contactRuns.push(
        new ExternalHyperlink({
          link: `mailto:${pageInfo.email}`,
          children: [new TextRun({ text: pageInfo.email, size: BODY_SIZE, style: "Hyperlink" })],
        })
      );
    }
    for (const social of socials ?? []) {
      pushSeparator();
      contactRuns.push(
        new ExternalHyperlink({
          link: social.url,
          children: [new TextRun({ text: social.title, size: BODY_SIZE, style: "Hyperlink" })],
        })
      );
    }

    const children: Paragraph[] = [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: (pageInfo?.name ?? "").toUpperCase(), bold: true, size: NAME_SIZE }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: contactRuns,
      }),
    ];

    if (experiences?.length) {
      children.push(sectionHeading("Professional Experience"));
      experiences.forEach((exp, i) => {
        children.push(
          splitRow(
            exp.company,
            formatDateRange(exp.dateStarted, exp.dateEnded, exp.isCurrentlyWorkingHere),
            { bold: true, spacingBefore: i === 0 ? 0 : 160 }
          )
        );
        children.push(splitRow(exp.jobTitle, exp.location ?? "", { italics: true }));
        if (exp.description) {
          children.push(new Paragraph({ children: [new TextRun({ text: exp.description, size: BODY_SIZE })] }));
        }
        (exp.points ?? []).forEach((p) => children.push(bullet(p)));
      });
    }

    if (skillGroups.length) {
      children.push(sectionHeading("Skills"));
      skillGroups.forEach((group) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${group.category}: `, bold: true, size: BODY_SIZE }),
              new TextRun({ text: group.items.join(", "), size: BODY_SIZE }),
            ],
          })
        );
      });
    }

    if (projects?.length) {
      children.push(sectionHeading("Projects & Outside Experience"));
      projects.forEach((project, i) => {
        children.push(
          splitRow(
            project.title,
            formatDateRange(project.dateStarted, project.dateEnded, project.isOngoing),
            { bold: true, spacingBefore: i === 0 ? 0 : 160 }
          )
        );
        (project.points ?? []).forEach((p) => children.push(bullet(p)));
      });
    }

    if (education?.length) {
      children.push(sectionHeading("Education"));
      education.forEach((edu, i) => {
        children.push(splitRow(edu.school, "", { bold: true, spacingBefore: i === 0 ? 0 : 120 }));
        children.push(splitRow(edu.degree ?? "", edu.location ?? "", { italics: true }));
        (edu.points ?? []).forEach((p) => children.push(bullet(p)));
      });
    }

    if (certifications?.length) {
      children.push(sectionHeading("Certifications"));
      certifications.forEach((cert) => {
        const label = [cert.issuer, formatMonthYear(cert.dateIssued)].filter(Boolean).join(" - ");
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: cert.title, bold: true, size: BODY_SIZE }),
              new TextRun({ text: label ? ` : ${label}` : "", size: BODY_SIZE }),
            ],
          })
        );
      });
    }

    const doc = new Document({
      styles: { default: { document: { run: { font: "Calibri" } } } },
      sections: [{ properties: { page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } } }, children }],
    });

    const buffer = await Packer.toBuffer(doc);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader("Content-Disposition", 'attachment; filename="darnel-castor-resume.docx"');
    res.status(200).send(buffer);
  } catch (err) {
    console.error("resume.docx generation failed:", err);
    res.status(500).json({ error: "Failed to generate DOCX" });
  }
}