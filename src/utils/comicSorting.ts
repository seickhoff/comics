import { ComicBook } from "../interfaces/ComicBook";

/**
 * Parse a string to number, returning null if invalid
 */
export function parseNumber(str: string): number | null {
  const num = Number(str);
  return Number.isFinite(num) ? num : null;
}

/**
 * Normalize title for sorting
 * "The Amazing Spider-Man" → "Amazing Spider-Man, The"
 */
export function normalizeTitle(title: string): string {
  if (title.startsWith("The ")) {
    return title.slice(4) + ", The";
  }
  return title;
}

/**
 * Sort comics by title (normalized), volume, and issue
 */
export function sortComics(data: ComicBook[]): ComicBook[] {
  return [...data].sort((a, b) => {
    // 1. Title (normalize for sorting)
    const t = normalizeTitle(a.title).localeCompare(normalizeTitle(b.title));
    if (t !== 0) return t;

    // 2. Volume
    const av = parseNumber(a.volume);
    const bv = parseNumber(b.volume);
    if (av !== null && bv !== null) {
      if (av !== bv) return av - bv;
    } else {
      const v = a.volume.localeCompare(b.volume);
      if (v !== 0) return v;
    }

    // 3. Issue
    const ai = parseNumber(a.issue);
    const bi = parseNumber(b.issue);
    if (ai !== null && bi !== null) {
      return ai - bi;
    }
    return a.issue.localeCompare(b.issue);
  });
}
