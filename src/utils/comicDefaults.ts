import { ComicBook } from "../interfaces/ComicBook";
import { APP_CONFIG } from "../config/constants";
import { generateUUID } from "./uuid";

/**
 * Returns the default empty comic book state
 * Used for initializing forms and resetting after add operations
 */
export function getEmptyComic(): Partial<ComicBook> {
  return {
    uuid: generateUUID(),
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
    type: "",
    comments: "",
  };
}
