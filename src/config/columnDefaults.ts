import { ColumnConfig } from "../interfaces/ComicBook";

export const defaultColumns: ColumnConfig[] = [
  { key: "title", label: "Title", visible: true },
  { key: "publisher", label: "Publisher", visible: true },
  { key: "volume", label: "Volume", visible: true },
  { key: "issue", label: "Issue", visible: true },
  { key: "type", label: "Type", visible: true },
  { key: "month", label: "Month", visible: true },
  { key: "year", label: "Year", visible: true },
  { key: "quantity", label: "Quantity", visible: true },
  { key: "value", label: "Value", visible: true },
  { key: "condition", label: "Condition", visible: true },
  { key: "writer", label: "Writer", visible: true },
  { key: "artist", label: "Artist", visible: true },
  { key: "comments", label: "Comments", visible: true },
];

// Default mobile columns (fewer visible by default)
export const defaultMobileColumns: ColumnConfig[] = [
  { key: "title", label: "Title", visible: true },
  { key: "publisher", label: "Publisher", visible: false },
  { key: "volume", label: "Volume", visible: false },
  { key: "issue", label: "Issue", visible: true },
  { key: "type", label: "Type", visible: false },
  { key: "month", label: "Month", visible: true },
  { key: "year", label: "Year", visible: true },
  { key: "quantity", label: "Quantity", visible: false },
  { key: "value", label: "Value", visible: false },
  { key: "condition", label: "Condition", visible: false },
  { key: "writer", label: "Writer", visible: false },
  { key: "artist", label: "Artist", visible: false },
  { key: "comments", label: "Comments", visible: false },
];

// Default desktop columns (all visible)
export const defaultDesktopColumns: ColumnConfig[] = [...defaultColumns];
