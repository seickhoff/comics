import { ComicBook, ColumnConfig, ColumnKey } from "./ComicBook";
import { AppSettings, SortConfig } from "../context/AppContext";

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
  settings?: AppSettings; // Optional for backward compatibility

  // Comic Data
  comics: ComicBook[];
}
