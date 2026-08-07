import { motion, useReducedMotion } from "framer-motion";
import React from "react";
import { imageUrl } from "../lib/image";
import { Certification } from "../typings";

type Props = { certifications: Certification[] };

function formatMonthYear(iso?: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function isExpired(cert: Certification): boolean {
  if (!cert.dateExpires) return false;
  const expiry = new Date(cert.dateExpires);
  return !Number.isNaN(expiry.getTime()) && expiry < new Date();
}

function BadgeCard({
  cert,
  index,
  reduceMotion,
}: {
  cert: Certification;
  index: number;
  reduceMotion: boolean | null;
}) {
  const expired = isExpired(cert);
  const src = imageUrl(cert.badgeImage ?? cert.badgeImageUrl);

  return (
    <motion.a
      href={cert.verifyUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Verify ${cert.title}, issued by ${cert.issuer}${
        expired ? " (expired)" : ""
      }`}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: reduceMotion ? 0 : index * 0.08 }}
      className="group flex w-[210px] flex-shrink-0 snap-center flex-col items-center
                 rounded-xl border border-darkGreen/20 bg-white dark:bg-darkBackground p-5 text-center
                 shadow-sm transition-all duration-200
                 hover:border-darkGreen hover:shadow-md
                 focus-visible:outline focus-visible:outline-2
                 focus-visible:outline-offset-2 focus-visible:outline-darkGreen
                 md:w-[240px]"
    >
      <div className="relative">
        {/* Decorative: the accessible name lives on the anchor. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          width={110}
          height={110}
          loading="lazy"
          decoding="async"
          className={`h-[110px] w-[110px] object-contain transition-transform
                      duration-200 group-hover:scale-105 ${
                        expired ? "opacity-40 grayscale" : ""
                      }`}
        />
        {expired && (
          <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            Expired
          </span>
        )}
      </div>

      <h4 className="mt-4 text-sm font-semibold leading-snug text-darkBlack dark:text-white">
        {cert.title}
      </h4>

      <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">
        {cert.issuer}
      </p>

      <p className="mt-2 text-[11px] text-gray-400">
        {formatMonthYear(cert.dateIssued)}
        {cert.dateExpires
          ? ` — ${expired ? "expired" : "valid until"} ${formatMonthYear(
              cert.dateExpires,
            )}`
          : " · no expiry"}
      </p>

      {cert.skills && cert.skills.length > 0 && (
        <ul className="mt-3 flex flex-wrap justify-center gap-1.5">
          {cert.skills.slice(0, 3).map((skill) => (
            <li
              key={skill}
              className="rounded-full bg-lightGreen/20 px-2 py-0.5 text-[10px] text-darkGreen"
            >
              {skill}
            </li>
          ))}
        </ul>
      )}

      <span className="mt-3 text-[11px] font-medium text-darkGreen opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
        Verify credential →
      </span>
    </motion.a>
  );
}

export default function Certifications({ certifications }: Props) {
  const reduceMotion = useReducedMotion();

  if (!certifications || certifications.length === 0) return null;

  // Featured first, then most recently issued.
  const sorted = [...certifications].sort((a, b) => {
    if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
    return (
      new Date(b.dateIssued ?? 0).getTime() -
      new Date(a.dateIssued ?? 0).getTime()
    );
  });

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5 }}
      className="h-screen relative flex flex-col text-center md:text-left
                 max-w-full px-10 justify-center mx-auto items-center"
    >
      <h3
        id="certifications-heading"
        className="absolute top-20 md:top-24 uppercase tracking-[20px] text-gray-500 text-xl md:text-2xl"
      >
        Certifications
      </h3>
      <h3 className="absolute top-32 md:top-36 uppercase tracking-[3px] text-gray-500 text-sm">
        Click a badge to verify it
      </h3>

      <div
        role="list"
        aria-labelledby="certifications-heading"
        className="w-full flex gap-6 snap-x snap-mandatory overflow-x-auto
                   py-10 mt-16 justify-start md:justify-center
                   scrollbar-thin scrollbar-track-gray-400/20 scrollbar-thumb-darkGreen/80"
      >
        {sorted.map((cert, index) => (
          <div role="listitem" key={cert._id}>
            <BadgeCard
              cert={cert}
              index={index}
              reduceMotion={reduceMotion}
            />
          </div>
        ))}
      </div>

      <div className="w-full absolute top-[30%] bg-lightGreen/10 left-0 h-[300px] -skew-y-12" />
    </motion.div>
  );
}
