import { ComicBook, GradeCode } from "../interfaces/ComicBook";
import { generateUUID } from "./uuid";

/**
 * Normalizes raw comic book data to match the ComicBook interface types.
 * This ensures consistent data types throughout the application.
 *
 * @param raw - Raw comic book data (from JSON or user input)
 * @returns Normalized ComicBook object with correct data types
 */
export function normalizeComicBook(raw: Partial<ComicBook>): ComicBook {
  // Helper to safely convert to number
  const toNumber = (val: unknown, defaultValue: number = 0): number => {
    if (val === null || val === undefined || val === "") return defaultValue;
    const num = Number(val);
    return isNaN(num) ? defaultValue : num;
  };

  // Helper to safely convert to string
  const toString = (val: unknown, defaultValue: string = ""): string => {
    if (val === null || val === undefined) return defaultValue;
    return String(val);
  };

  // Helper to ensure array type
  const toArray = (val: unknown): string[] => {
    if (Array.isArray(val)) return val.map(String).filter((v) => v.trim() !== "");
    return [];
  };

  // Normalize month to 2-digit format if provided
  let month: string | undefined = undefined;
  if (raw.month !== null && raw.month !== undefined && raw.month !== "") {
    const monthNum = toNumber(raw.month);
    month = monthNum > 0 ? monthNum.toString().padStart(2, "0") : toString(raw.month);
  }

  // Normalize value to 2 decimal places if provided
  let value = "";
  if (raw.value !== null && raw.value !== undefined && raw.value !== "") {
    const valueNum = toNumber(raw.value);
    value = valueNum > 0 ? valueNum.toFixed(2) : toString(raw.value);
  }

  // Ensure condition is a valid grade code, default to NM
  const condition =
    raw.condition && Object.values(GradeCode).includes(raw.condition as GradeCode)
      ? (raw.condition as GradeCode)
      : GradeCode.NM;

  return {
    uuid: raw.uuid || generateUUID(), // Generate UUID if not present (for legacy data)
    title: toString(raw.title),
    publisher: toString(raw.publisher),
    volume: toString(raw.volume),
    issue: toString(raw.issue),
    month,
    year: toString(raw.year),
    quantity: toNumber(raw.quantity, 1),
    value,
    condition,
    type: raw.type !== null && raw.type !== undefined && raw.type !== "" ? toString(raw.type) : undefined,
    writer: toArray(raw.writer),
    artist: toArray(raw.artist),
    comments:
      raw.comments !== null && raw.comments !== undefined && raw.comments !== "" ? toString(raw.comments) : undefined,
  };
}
