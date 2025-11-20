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

/**
 * Special marker values for batch operations
 */
export const BATCH_MARKERS = {
  CLEAR_FIELD: "__CLEAR__",
  CLEAR_TEXT: " ", // Single space to clear text fields
} as const;

/**
 * Overstreet Report configuration
 */
export const OVERSTREET_CONFIG = {
  // Character limits for line breaking
  MAX_CHARS_DESKTOP: 46,
  MAX_CHARS_MOBILE: 40,

  // Pagination
  LINES_PER_PAGE: 32,

  // Desktop page dimensions
  PAGE: {
    WIDTH: "450px",
    HEIGHT: "700px",
  },

  // Font sizes
  FONT_SIZE: {
    DESKTOP_BASE: "0.875rem",
    DESKTOP_HEADER: "1rem",
    DESKTOP_PAGE_NUMBER: "0.8rem",
    MOBILE_BASE: "0.75rem",
    MOBILE_HEADER: "0.75rem",
  },

  // Spacing
  SPACING: {
    HEADER_MARGIN_TOP: "1rem",
    HEADER_MARGIN_BOTTOM: "0.5rem",
    HEADER_TITLE_MARGIN_BOTTOM: "0.25rem",
  },
} as const;

/**
 * Summary page configuration
 */
export const SUMMARY_CONFIG = {
  // Font sizes for statistics
  FONT_SIZE: {
    DESKTOP_STAT_VALUE: "1.406rem",
    MOBILE_STAT_VALUE: "1.125rem",
    STAT_LABEL: "0.75rem",
  },

  // Scrollable list max height
  MAX_LIST_HEIGHT: "500px",
} as const;

/**
 * Heatmap configuration
 */
export const HEATMAP_CONFIG = {
  // Desktop grid
  DESKTOP: {
    CELL_WIDTH: "35px",
    CELL_HEIGHT: "35px",
    YEAR_LABEL_WIDTH: "60px",
    MONTH_LABEL_WIDTH: "35px",
    FONT_SIZE_BASE: "0.875rem",
    FONT_SIZE_CELL: "0.75rem",
  },

  // Mobile grid
  MOBILE: {
    CELL_WIDTH: "20px",
    CELL_HEIGHT: "20px",
    YEAR_LABEL_WIDTH: "35px",
    MONTH_LABEL_WIDTH: "20px",
    FONT_SIZE_BASE: "0.65rem",
    FONT_SIZE_CELL: "0.5rem",
  },

  // Legend
  LEGEND: {
    DESKTOP_GRADIENT_BOXES: 24,
    MOBILE_GRADIENT_BOXES: 6,
    BOX_WIDTH_DESKTOP: "20px",
    BOX_WIDTH_MOBILE: "30px",
    BOX_HEIGHT: "20px",
  },

  // Color scheme
  COLORS: {
    EMPTY: "#f0f0f0",
    HUE: 210, // Blue hue
    SATURATION: "70%",
    LIGHTNESS_MIN: 30, // Darkest (most comics)
    LIGHTNESS_MAX: 85, // Lightest (fewest comics)
  },
} as const;
