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
import {
  flattenSkillsInOrder,
  formatDateRange,
  formatExpiry,
  formatMonthYear,
} from "../../lib/resume-format";

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
  opts: { bold?: boolean; italics?: boolean; spacingBefore?: number; size?: number } = {}
): Paragraph {
  const size = opts.size ?? BODY_SIZE;
  return new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
    spacing: { before: opts.spacingBefore ?? 0 },
    children: [
      new TextRun({ text: left, bold: opts.bold, italics: opts.italics, size }),
      ...(right
        ? [new TextRun({ text: `\t${right}`, bold: opts.bold, italics: opts.italics, size })]
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

    const flatSkills = flattenSkillsInOrder(skills);

    // Contact line — email + socials only, matching the web page (no
    // phone/address in this format).
    const contactRuns: (TextRun | ExternalHyperlink)[] = [];
    const pushSeparator = () => {
      if (contactRuns.length > 0) contactRuns.push(new TextRun({ text: "  |  ", size: BODY_SIZE }));
    };
    if (pageInfo?.email) {
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

    if (pageInfo?.backgroundInformation || pageInfo?.summaryHighlights?.length) {
      children.push(sectionHeading("Professional Summary"));
      if (pageInfo?.backgroundInformation) {
        children.push(
          new Paragraph({ children: [new TextRun({ text: pageInfo.backgroundInformation, size: BODY_SIZE })] })
        );
      }
      (pageInfo?.summaryHighlights ?? []).forEach((p) => children.push(bullet(p)));
    }

    if (flatSkills.length) {
      children.push(sectionHeading("Skills"));
      children.push(
        new Paragraph({ children: [new TextRun({ text: flatSkills.join(", "), size: BODY_SIZE })] })
      );
    }

    if (experiences?.length) {
      children.push(sectionHeading("Experience"));
      experiences.forEach((exp, i) => {
        const left = [exp.jobTitle, exp.company, exp.location].filter(Boolean).join(" | ");
        children.push(
          splitRow(
            left,
            formatDateRange(exp.dateStarted, exp.dateEnded, exp.isCurrentlyWorkingHere),
            { bold: true, spacingBefore: i === 0 ? 0 : 160 }
          )
        );
        if (exp.description) {
          children.push(new Paragraph({ children: [new TextRun({ text: exp.description, size: BODY_SIZE })] }));
        }
        (exp.points ?? []).forEach((p) => children.push(bullet(p)));
      });
    }

    if (projects?.length) {
      children.push(sectionHeading("Projects / Portfolio"));
      projects.forEach((project, i) => {
        const left = [project.title, project.role].filter(Boolean).join(", ");
        children.push(
          splitRow(
            left,
            formatDateRange(project.dateStarted, project.dateEnded, project.isOngoing),
            { bold: true, spacingBefore: i === 0 ? 0 : 160 }
          )
        );
        if (project.linkToBuild) {
          children.push(
            new Paragraph({
              children: [
                new ExternalHyperlink({
                  link: project.linkToBuild,
                  children: [new TextRun({ text: project.linkToBuild, size: 17, style: "Hyperlink" })],
                }),
              ],
            })
          );
        }
        if (project.summary) {
          children.push(new Paragraph({ children: [new TextRun({ text: project.summary, size: BODY_SIZE })] }));
        }
        (project.points ?? []).forEach((p) => children.push(bullet(p)));
        if (project.technologies?.length) {
          const stack = project.technologies.map((t) => t.title).join(", ");
          children.push(new Paragraph({ children: [new TextRun({ text: stack, italics: true, size: 17 })] }));
        }
      });
    }

    if (education?.length) {
      children.push(sectionHeading("Education"));
      education.forEach((edu, i) => {
        children.push(splitRow(edu.school, "", { bold: true, spacingBefore: i === 0 ? 0 : 120 }));
        children.push(splitRow([edu.degree, edu.location].filter(Boolean).join(", "), "", { italics: true }));
        (edu.points ?? []).forEach((p) => children.push(bullet(p)));
      });
    }

    if (certifications?.length) {
      children.push(sectionHeading("Certification and Licenses"));
      certifications.forEach((cert, i) => {
        children.push(
          splitRow(cert.title, formatMonthYear(cert.dateIssued), { bold: true, spacingBefore: i === 0 ? 0 : 160 })
        );
        children.push(
          splitRow(cert.issuer, `Expiry Date: ${formatExpiry(cert.dateExpires)}`, { size: 17 })
        );
        if (cert.credentialId) {
          children.push(
            new Paragraph({
              children: cert.verifyUrl
                ? [
                    new ExternalHyperlink({
                      link: cert.verifyUrl,
                      children: [new TextRun({ text: cert.credentialId, size: 17, style: "Hyperlink" })],
                    }),
                  ]
                : [new TextRun({ text: cert.credentialId, size: 17 })],
            })
          );
        }
        (cert.points ?? []).forEach((p) => children.push(bullet(p)));
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