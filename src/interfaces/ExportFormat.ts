import { ComicBook, ColumnConfig, ColumnKey } from "./ComicBook";
import { AppSettings, SortConfig } from "../context/AppContext";

export interface ExportFormat {
  // Metadata
  appName: string;
  version: string;
  exportDate: string;

  // App Context Settings
  columns: ColumnConfig[];
  mobileColumns?: ColumnConfig[]; // Optional for backward compatibility
  desktopColumns?: ColumnConfig[]; // Optional for backward compatibility
  filters: Record<ColumnKey, string>;
  useOrFiltering: boolean;
  tableSortConfig: Record<string, SortConfig>;
  mobileTableSortConfig?: Record<string, SortConfig>; // Optional for backward compatibility
  desktopTableSortConfig?: Record<string, SortConfig>; // Optional for backward compatibility
  settings?: AppSettings; // Optional for backward compatibility

  // Comic Data
  comics: ComicBook[];
}
