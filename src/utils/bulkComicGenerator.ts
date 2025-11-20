import { ComicBook } from "../interfaces/ComicBook";
import { generateUUID } from "./uuid";

export interface BulkComicGeneratorResult {
  success: boolean;
  comics?: ComicBook[];
  error?: string;
}

/**
 * Generate multiple comic book entries for a sequential run
 * Increments issue number and automatically handles month/year rollover
 */
export function generateBulkComics(
  baseComic: Partial<ComicBook>,
  startIssue: string,
  endingIssue: string
): BulkComicGeneratorResult {
  const start = parseFloat(startIssue);
  const end = parseFloat(endingIssue);

  // Validation
  if (isNaN(start) || isNaN(end)) {
    return {
      success: false,
      error: "Issue and Ending Issue must be valid numbers for bulk add.",
    };
  }

  if (end < start) {
    return {
      success: false,
      error: "Ending Issue must be greater than or equal to Issue.",
    };
  }

  if (!baseComic.month || !baseComic.year) {
    return {
      success: false,
      error: "Month and Year are required for bulk add.",
    };
  }

  // Generate comics
  const comics: ComicBook[] = [];
  let currentIssue = start;
  let currentMonth = parseInt(baseComic.month);
  let currentYear = parseInt(baseComic.year);

  while (currentIssue <= end) {
    comics.push({
      ...baseComic,
      uuid: generateUUID(),
      issue: String(currentIssue),
      month: String(currentMonth).padStart(2, "0"),
      year: String(currentYear),
    } as ComicBook);

    currentIssue++;
    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
  }

  return { success: true, comics };
}

/**
 * Calculate how many comics will be generated in a bulk add operation
 */
export function calculateBulkAddCount(startIssue: string, endingIssue: string): number {
  const start = parseFloat(startIssue);
  const end = parseFloat(endingIssue);
  if (!isNaN(start) && !isNaN(end) && end >= start) {
    return Math.floor(end - start + 1);
  }
  return 0;
}
