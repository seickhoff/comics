import { createContext, Dispatch, SetStateAction } from "react";
import { ColumnConfig, ColumnKey, ComicBook, GradeCode } from "../interfaces/ComicBook";

// Type for User
export type User = { id: string; name: string } | null;

// Type for sort direction
export type SortDirection = "asc" | "desc";

// Type for a sort configuration for a single table
export type SortConfig = {
  key: keyof ComicBook;
  direction: SortDirection;
}[];

// Type for application settings (editable constants)
export type AppSettings = {
  defaultFilename: string;
  defaultQuantity: number;
  defaultCondition: GradeCode;
  defaultVolume: string;
  toastDuration: number;
  maxTitleLength: number;
  maxCommentLength: number;
  minYear: number;
  maxYear: number;
  minIssue: number;
  overstreetMaxCharsDesktop: number;
  overstreetMaxCharsMobile: number;
  overstreetLinesPerPage: number;
  summaryMaxListHeight: string;
  heatmapColorHue: number;
  heatmapColorSaturation: string;
  heatmapColorLightnessMin: number;
  heatmapColorLightnessMax: number;
};

// Type for the state
export type AppState = {
  user: User;
  setUser: (user: User) => void;

  loading: boolean;
  setLoading: (loading: boolean) => void;

  jsonData: ComicBook[];
  setJsonData: Dispatch<SetStateAction<ComicBook[]>>;

  columns: ColumnConfig[];
  setColumns: Dispatch<SetStateAction<ColumnConfig[]>>;

  filters: Record<ColumnKey, string>;
  setFilters: Dispatch<SetStateAction<Record<ColumnKey, string>>>;

  useOrFiltering: boolean;
  setUseOrFiltering: (value: boolean) => void;

  isConfigOpen: boolean;
  setIsConfigOpen: (value: boolean) => void;

  fileName: string | null;
  setFileName: (value: string | null) => void;

  // --- NEW: sorting configuration per table ---
  tableSortConfig: Record<string, SortConfig>; // keyed by table ID
  setTableSortConfig: Dispatch<SetStateAction<Record<string, SortConfig>>>;

  // --- NEW: selected rows for batch editing ---
  selectedKeys: Set<string>;
  setSelectedKeys: Dispatch<SetStateAction<Set<string>>>;

  // Batch edit handler - set by TableReport, called by ReportConfigWrapper
  handleBatchEdit: (() => void) | null;
  setHandleBatchEdit: (handler: (() => void) | null) => void;

  // Application settings
  settings: AppSettings;
  setSettings: Dispatch<SetStateAction<AppSettings>>;
};

// Context declaration
export const AppContext = createContext<AppState | undefined>(undefined);
