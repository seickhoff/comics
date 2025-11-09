import { ComicBook } from "../interfaces/ComicBook";

/**
 * Generate a unique key for a comic book
 * Used for selection management and data operations
 */
export function getComicKey(comic: ComicBook): string {
  return `${comic.title}||${comic.publisher}||${comic.volume}||${comic.issue}`;
}

/**
 * Generate a comic key from individual values
 * Useful when you have the values but not the ComicBook object
 */
export function getComicKeyFromValues(title: string, publisher: string, volume: string, issue: string): string {
  return `${title}||${publisher}||${volume}||${issue}`;
}

/**
 * Parse a comic key back into its components
 */
export function parseComicKey(key: string): { title: string; publisher: string; volume: string; issue: string } | null {
  const parts = key.split("||");
  if (parts.length !== 4) return null;

  const [title, publisher, volume, issue] = parts;
  return { title, publisher, volume, issue };
}
