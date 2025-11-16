import { ComicBook, ColumnConfig, ColumnKey } from "../interfaces/ComicBook";
import { AppSettings, SortConfig } from "../context/AppContext";
import { normalizeComicBook } from "./normalizeComicBook";
import { sortComics } from "./comicSorting";
import { isExportFormat } from "./exportFormat";

export interface CollectionLoaderSetters {
  setJsonData: (data: ComicBook[]) => void;
  setFileName?: (name: string) => void;
  setColumns?: (cols: ColumnConfig[]) => void;
  setMobileColumns?: (cols: ColumnConfig[]) => void;
  setDesktopColumns?: (cols: ColumnConfig[]) => void;
  setFilters?: (filters: Record<ColumnKey, string>) => void;
  setUseOrFiltering?: (val: boolean) => void;
  setTableSortConfig?: (config: Record<string, SortConfig>) => void;
  setMobileTableSortConfig?: (config: Record<string, SortConfig>) => void;
  setDesktopTableSortConfig?: (config: Record<string, SortConfig>) => void;
  setSettings?: (settings: AppSettings) => void;
}

export interface LoadCollectionResult {
  success: boolean;
  count: number;
  error?: string;
}

/**
 * Load collection data from parsed JSON
 * Handles both new ExportFormat and legacy array format
 */
export function loadCollectionData(
  rawData: unknown,
  setters: CollectionLoaderSetters,
  filename?: string
): LoadCollectionResult {
  try {
    // Check if it's the new format or legacy format
    if (isExportFormat(rawData)) {
      // New format: restore all app context settings
      const normalized = rawData.comics.map(normalizeComicBook);
      const sorted = sortComics(normalized);
      setters.setJsonData(sorted);

      // Restore app context settings if setters provided
      if (rawData.columns && setters.setColumns) {
        setters.setColumns(rawData.columns);
      }
      if (rawData.mobileColumns && setters.setMobileColumns) {
        setters.setMobileColumns(rawData.mobileColumns);
      }
      if (rawData.desktopColumns && setters.setDesktopColumns) {
        setters.setDesktopColumns(rawData.desktopColumns);
      }
      if (rawData.filters && setters.setFilters) {
        setters.setFilters(rawData.filters);
      }
      if (typeof rawData.useOrFiltering === "boolean" && setters.setUseOrFiltering) {
        setters.setUseOrFiltering(rawData.useOrFiltering);
      }
      if (rawData.tableSortConfig && setters.setTableSortConfig) {
        setters.setTableSortConfig(rawData.tableSortConfig);
      }
      if (rawData.mobileTableSortConfig && setters.setMobileTableSortConfig) {
        setters.setMobileTableSortConfig(rawData.mobileTableSortConfig);
      }
      if (rawData.desktopTableSortConfig && setters.setDesktopTableSortConfig) {
        setters.setDesktopTableSortConfig(rawData.desktopTableSortConfig);
      }
      if (rawData.settings && setters.setSettings) {
        setters.setSettings(rawData.settings);
      }

      // Set filename if provided
      if (filename && setters.setFileName) {
        setters.setFileName(filename);
      }

      return { success: true, count: sorted.length };
    } else {
      // Legacy format: just an array of comics
      const normalized = Array.isArray(rawData) ? rawData.map(normalizeComicBook) : [];
      const sorted = sortComics(normalized);
      setters.setJsonData(sorted);

      // Set filename if provided
      if (filename && setters.setFileName) {
        setters.setFileName(filename);
      }

      return { success: true, count: sorted.length };
    }
  } catch (error) {
    console.error("Error loading collection data:", error);
    return { success: false, count: 0, error: String(error) };
  }
}
