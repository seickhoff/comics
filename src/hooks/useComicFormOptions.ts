import { useMemo } from "react";
import { ComicBook } from "../interfaces/ComicBook";

/**
 * Extract unique values from comics for a given field
 * Used to populate datalist options in the form
 */
function getUniqueValues<T extends keyof ComicBook>(comics: ComicBook[], key: T): string[] {
  const values = comics.flatMap((c) => {
    const v = c[key];
    if (Array.isArray(v)) return v.map(String);
    return [String(v ?? "")];
  });
  const unique = Array.from(new Set(values.filter((v) => v.trim() !== "")));
  return unique.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

/**
 * Custom hook to generate all datalist options for the comic form
 */
export function useComicFormOptions(existingComics: ComicBook[]) {
  const titleOptions = useMemo(() => getUniqueValues(existingComics, "title"), [existingComics]);
  const publisherOptions = useMemo(() => getUniqueValues(existingComics, "publisher"), [existingComics]);
  const volumeOptions = useMemo(() => getUniqueValues(existingComics, "volume"), [existingComics]);
  const issueOptions = useMemo(() => getUniqueValues(existingComics, "issue"), [existingComics]);
  const valueOptions = useMemo(() => getUniqueValues(existingComics, "value"), [existingComics]);
  const monthOptions = useMemo(() => getUniqueValues(existingComics, "month"), [existingComics]);
  const yearOptions = useMemo(() => getUniqueValues(existingComics, "year"), [existingComics]);
  const typeOptions = useMemo(() => getUniqueValues(existingComics, "type"), [existingComics]);
  const writerOptions = useMemo(() => getUniqueValues(existingComics, "writer"), [existingComics]);
  const artistOptions = useMemo(() => getUniqueValues(existingComics, "artist"), [existingComics]);

  return {
    titleOptions,
    publisherOptions,
    volumeOptions,
    issueOptions,
    valueOptions,
    monthOptions,
    yearOptions,
    typeOptions,
    writerOptions,
    artistOptions,
  };
}
