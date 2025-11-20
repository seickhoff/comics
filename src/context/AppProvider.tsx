import { useState, ReactNode } from "react";
import { AppContext, AppSettings, SortConfig } from "./AppContext";
import { ColumnConfig, ColumnKey, ComicBook } from "../interfaces/ComicBook";
import { APP_CONFIG, OVERSTREET_CONFIG, SUMMARY_CONFIG, HEATMAP_CONFIG } from "../config/constants";
import { defaultColumns, defaultMobileColumns, defaultDesktopColumns } from "../config/columnDefaults";

// Default settings from constants
const getDefaultSettings = (): AppSettings => ({
  defaultFilename: APP_CONFIG.DEFAULT_FILENAME,
  defaultQuantity: APP_CONFIG.DEFAULTS.QUANTITY,
  defaultCondition: APP_CONFIG.DEFAULTS.CONDITION,
  defaultVolume: APP_CONFIG.DEFAULTS.VOLUME,
  toastDuration: APP_CONFIG.UI.TOAST_DURATION,
  maxTitleLength: APP_CONFIG.UI.MAX_TITLE_LENGTH,
  maxCommentLength: APP_CONFIG.UI.MAX_COMMENT_LENGTH,
  minYear: APP_CONFIG.VALIDATION.MIN_YEAR,
  maxYear: new Date().getFullYear() + 2,
  minIssue: APP_CONFIG.VALIDATION.MIN_ISSUE,
  overstreetMaxCharsDesktop: OVERSTREET_CONFIG.MAX_CHARS_DESKTOP,
  overstreetMaxCharsMobile: OVERSTREET_CONFIG.MAX_CHARS_MOBILE,
  overstreetLinesPerPage: OVERSTREET_CONFIG.LINES_PER_PAGE,
  summaryMaxListHeight: SUMMARY_CONFIG.MAX_LIST_HEIGHT,
  heatmapColorHue: HEATMAP_CONFIG.COLORS.HUE,
  heatmapColorSaturation: HEATMAP_CONFIG.COLORS.SATURATION,
  heatmapColorLightnessMin: HEATMAP_CONFIG.COLORS.LIGHTNESS_MIN,
  heatmapColorLightnessMax: HEATMAP_CONFIG.COLORS.LIGHTNESS_MAX,
  heatmapCellSize: 35, // Desktop cell size in pixels
});

// AppProvider component that provides the global context
export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Detect initial viewport
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  const [columns, setColumns] = useState<ColumnConfig[]>(defaultColumns);
  const [mobileColumns, setMobileColumns] = useState<ColumnConfig[]>(defaultMobileColumns);
  const [desktopColumns, setDesktopColumns] = useState<ColumnConfig[]>(defaultDesktopColumns);
  const [fileName, setFileName] = useState<string | null>(APP_CONFIG.DEFAULT_FILENAME);
  const [filters, setFilters] = useState<Record<ColumnKey, string>>({} as Record<ColumnKey, string>);
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [jsonData, setJsonData] = useState<ComicBook[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [useOrFiltering, setUseOrFiltering] = useState(false);
  const [user, setUser] = useState<null | { id: string; name: string }>(null);
  const [tableSortConfig, setTableSortConfig] = useState<Record<string, SortConfig>>({});
  const [mobileTableSortConfig, setMobileTableSortConfig] = useState<Record<string, SortConfig>>({});
  const [desktopTableSortConfig, setDesktopTableSortConfig] = useState<Record<string, SortConfig>>({});
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [handleBatchEdit, setHandleBatchEdit] = useState<(() => void) | null>(null);
  const [settings, setSettings] = useState<AppSettings>(getDefaultSettings());

  return (
    <AppContext.Provider
      value={{
        columns,
        fileName,
        filters,
        isConfigOpen,
        jsonData,
        loading,
        setColumns,
        setFileName,
        setFilters,
        setIsConfigOpen,
        setJsonData,
        setLoading,
        setUseOrFiltering,
        setUser,
        useOrFiltering,
        user,
        tableSortConfig,
        setTableSortConfig,
        mobileTableSortConfig,
        setMobileTableSortConfig,
        desktopTableSortConfig,
        setDesktopTableSortConfig,
        selectedKeys,
        setSelectedKeys,
        handleBatchEdit,
        setHandleBatchEdit,
        settings,
        setSettings,
        mobileColumns,
        setMobileColumns,
        desktopColumns,
        setDesktopColumns,
        isMobileView,
        setIsMobileView,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
