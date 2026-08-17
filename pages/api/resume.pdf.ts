import type { NextApiRequest, NextApiResponse } from "next";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

// Resolve the URL to screenshot. VERCEL_URL is set automatically on every
// Vercel deployment (preview and production) and always points at this
// same deployment, so it's more reliable inside a serverless function than
// hard-coding resume.dcastore.dev (which depends on DNS/domain config that
// has nothing to do with whether *this* deployment is healthy).
function resumeUrl(): string {
  if (process.env.RESUME_BASE_URL) return `${process.env.RESUME_BASE_URL}/resume`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/resume`;
  return "http://localhost:3000/resume";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method Not Allowed");
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    // Deliberately do NOT call page.emulateMediaType('screen') — leaving
    // Puppeteer on its default 'print' media type means the .print:hidden
    // download buttons on /resume disappear automatically, with zero
    // print-specific logic duplicated here.
    await page.goto(resumeUrl(), { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "Letter",
      printBackground: true,
      margin: { top: "0in", bottom: "0in", left: "0in", right: "0in" },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="darnel-castor-resume.pdf"'
    );
    res.status(200).send(pdf);
  } catch (err) {
    console.error("resume.pdf generation failed:", err);
    res.status(500).json({ error: "Failed to generate PDF" });
  } finally {
    await browser?.close();
  }
}