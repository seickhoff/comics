import { ComicBook } from "../interfaces/ComicBook";
import { APP_CONFIG } from "../config/constants";

/**
 * Returns the default empty comic book state
 * Used for initializing forms and resetting after add operations
 */
export function getEmptyComic(): Partial<ComicBook> {
  return {
    title: "",
    publisher: "",
    volume: "",
    issue: "",
    value: "",
    writer: [],
    artist: [],
    month: "",
    year: "",
    quantity: APP_CONFIG.DEFAULTS.QUANTITY,
    condition: APP_CONFIG.DEFAULTS.CONDITION,
    comments: "",
  };
}
