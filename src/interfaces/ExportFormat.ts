// src/interfaces/ExportFormat.ts
import { ComicBook, ColumnConfig, ColumnKey } from "./ComicBook";
import { SortConfig } from "../context/AppContext";

export interface ExportFormat {
  // Metadata
  appName: string;
  version: string;
  exportDate: string;

  // App Context Settings
  columns: ColumnConfig[];
  filters: Record<ColumnKey, string>;
  useOrFiltering: boolean;
  tableSortConfig: Record<string, SortConfig>;

  // Comic Data
  comics: ComicBook[];
}
