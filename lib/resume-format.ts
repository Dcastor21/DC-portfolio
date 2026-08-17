import type { Skill } from "../typings";

/** Fixed category order matching the reference resume's Skills section. */
export const SKILL_CATEGORY_ORDER = [
  "Languages",
  "AI/ML",
  "Cloud & DevOps",
  "Databases",
  "Frontend",
  "Backend",
] as const;

/** "2025-11-01" -> "Nov 2025" */
export function formatMonthYear(dateString?: string | null): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/** Builds "Mar 2025 - Present" / "Sep 2024 - Feb 2025" style ranges. */
export function formatDateRange(
  start?: string | null,
  end?: string | null,
  isOngoing?: boolean
): string {
  const startLabel = formatMonthYear(start);
  const endLabel = isOngoing ? "Present" : formatMonthYear(end);
  if (!startLabel && !endLabel) return "";
  if (!endLabel) return startLabel;
  return `${startLabel} - ${endLabel}`;
}

/** "2028-11-01" -> "Nov 2028", or "N/A" if the credential doesn't expire. */
export function formatExpiry(dateString?: string | null): string {
  return formatMonthYear(dateString) || "N/A";
}

export type SkillGroup = { category: string; items: string[] };

/**
 * Groups skill documents by their resume `category`, in the fixed order
 * above. Skills with no category (or an unrecognized one) are dropped from
 * the resume view — they still render fine on the portfolio progress bars.
 */
export function groupSkillsByCategory(skills: Skill[]): SkillGroup[] {
  const byCategory = new Map<string, string[]>();

  for (const skill of skills) {
    if (!skill.category || !skill.title) continue;
    const list = byCategory.get(skill.category) ?? [];
    list.push(skill.title);
    byCategory.set(skill.category, list);
  }

  return SKILL_CATEGORY_ORDER.filter((category) => byCategory.has(category)).map(
    (category) => ({ category, items: byCategory.get(category)! })
  );
}

/**
 * Same ordering as groupSkillsByCategory, flattened into one list — used by
 * the pill-cloud skills layout, which shows skills grouped in spirit
 * (languages, then AI/ML, then cloud, ...) without visible category labels.
 */
export function flattenSkillsInOrder(skills: Skill[]): string[] {
  return groupSkillsByCategory(skills).flatMap((group) => group.items);
}