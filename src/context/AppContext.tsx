// src/context/AppContext.tsx
import { createContext, Dispatch, SetStateAction } from "react";
import { ColumnConfig, ColumnKey, ComicBook } from "../interfaces/ComicBook";

// Type for User
export type User = { id: string; name: string } | null;

// Type for sort direction
export type SortDirection = "asc" | "desc";

// Type for a sort configuration for a single table
export type SortConfig = {
  key: keyof ComicBook;
  direction: SortDirection;
}[];

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
};

// Context declaration
export const AppContext = createContext<AppState | undefined>(undefined);
