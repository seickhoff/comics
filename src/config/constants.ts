/**
 * Application-wide configuration constants
 * Centralized location for default values and metadata
 */

import { GradeCode } from "../interfaces/ComicBook";

export const APP_CONFIG = {
  // Default file name for new collections
  DEFAULT_FILENAME: "new-collection.json",

  // Default comic book values
  DEFAULTS: {
    QUANTITY: 1,
    CONDITION: GradeCode.NM,
    VOLUME: "1",
  },

  // File export metadata
  EXPORT: {
    FORMAT_VERSION: "2.0",
    GENERATOR: "Comic Book Collection Manager",
  },

  // UI Configuration
  UI: {
    TOAST_DURATION: 3000, // milliseconds
    MAX_TITLE_LENGTH: 100,
    MAX_COMMENT_LENGTH: 500,
  },

  // Validation rules
  VALIDATION: {
    MIN_YEAR: 1900,
    MAX_YEAR: new Date().getFullYear() + 2, // Allow up to 2 years in the future
    MIN_ISSUE: 0,
  },
} as const;

/**
 * Commonly used alignment configurations for table columns
 */
export const COLUMN_ALIGNMENT = {
  CENTER: ["issue", "month", "year", "quantity", "condition"] as const,
  RIGHT: ["value"] as const,
} as const;
